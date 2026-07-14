# Admin Dashboard Design Specification

This document defines the architecture, database changes, security constraints, routing mechanisms, and user interface for the VigrahKart Admin Dashboard.

## 1. Overview & Goals
The Admin Dashboard provides a secure, hidden panel for managing products, tracking inventory health, and reviewing customer contact submissions.

* **Target Path:** `/admin-dashboard`
* **Access Control:** Restrict access solely to authenticated accounts with `is_admin = true`.
* **Primary Features:**
  * Real-time inventory metrics & statistics (valuation, category distribution, stock warnings).
  * Product CRUD (Create, Read, Update, Delete) operations.
  * Customer contact inquiry viewer.

---

## 2. Database Schema & Security (RLS)

We will introduce a new migration script under `supabase/migrations/` to add authorization columns and enforce Row-Level Security (RLS).

### Schema Alterations

```sql
-- 1. Add is_admin flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false NOT NULL;

-- 2. Modify handle_new_user() trigger function to automatically grant admin rights to acharleseon@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_username text;
  username_exists boolean;
  final_username text;
  counter integer := 1;
  is_admin_user boolean := false;
BEGIN
  -- Check if user matches default admin email
  IF new.email = 'acharleseon@gmail.com' THEN
    is_admin_user := true;
  END IF;

  default_username := coalesce(
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1),
    'user_' || substr(new.id::text, 1, 8)
  );

  default_username := lower(regexp_replace(default_username, '[^a-zA-Z0-9]', '_', 'g'));

  IF default_username = '' THEN
    default_username := 'user_' || substr(new.id::text, 1, 8);
  END IF;

  final_username := default_username;

  LOOP
    SELECT exists(SELECT 1 FROM public.profiles WHERE username = final_username) INTO username_exists;
    IF NOT username_exists THEN
      EXIT;
    END IF;
    final_username := default_username || '_' || counter;
    counter := counter + 1;
  END LOOP;

  INSERT INTO public.profiles (id, email, phone, username, full_name, is_admin)
  VALUES (
    new.id, 
    new.email,
    new.phone,
    final_username,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    is_admin_user
  )
  ON CONFLICT (id) DO UPDATE
  SET email = excluded.email,
      phone = excluded.phone,
      full_name = excluded.full_name,
      username = excluded.username,
      is_admin = excluded.is_admin;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Row Level Security (RLS) Policies

```sql
-- Enable Products CRUD Policies for Admin
CREATE POLICY "Allow admin insert on products" 
  ON public.products FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Allow admin update on products" 
  ON public.products FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Allow admin delete on products" 
  ON public.products FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Enable Contact Submissions Read Policies for Admin
CREATE POLICY "Allow admin select on contact_submissions" 
  ON public.contact_submissions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

---

## 3. Frontend Architecture & Guarding

### Access Guards (`AdminGuard.tsx`)
We will create a protector component using React Router `<Outlet />` that inspects the Zustand app store state.
* **Unauthorized State:** If the user profile is null, or `user.is_admin` is false:
  * Render a central login form component (`AdminLoginPage.tsx`) *directly on the `/admin-dashboard` path* (keeping the route hidden).
  * If the user logs in and is authenticated but their profile does not have `is_admin = true`, display an "Access Denied" error state.
* **Authorized State:** If `user.is_admin === true`, render the `<Outlet />` inside the Admin layout.

### Zustand Store Extensions
* Update `AppUser` in `src/store/useAppStore.ts` and `src/types/schema.ts` to include `is_admin: boolean`.
* Update `SupabaseAuthProvider.tsx` to fetch the `is_admin` flag on login/session recovery.

---

## 4. UI Components & Pages

### Layout & Navigation
* **`AdminLayout.tsx`:** Container featuring:
  * Left sidebar navigation pane:
    * Dashboard link (`/admin-dashboard`)
    * Products link (`/admin-dashboard/products`)
    * Messages link (`/admin-dashboard/messages`)
    * Profile card at bottom with admin email and **Logout** action.
  * Right/Main panel: Header showing page title and active view container.

### Sub-Pages
1. **`AdminDashboardPage.tsx`:** Analytics view:
   * **Grid of Metrics:**
     * Total Inventory Valuation (`sum(price * stock)`).
     * Total Cataloged Items count.
     * Active Inquiries count.
     * Stock Warnings (out of stock + running low `stock < 5`).
   * **Low Stock Alerts Table:** Displays products near depletion.
   * **Distribution Breakdown:** Simple text/grid representation of items per category.

2. **`AdminProductsPage.tsx`:** Catalog CRUD:
   * Header with "Add Product" button.
   * Filter controls: Name query search, Category dropdown selector.
   * Data table with columns: Image, Name, Category, Price, Stock, Rating, Actions (Edit/Delete).
   * **ProductFormModal.tsx:** Slide-over/modal form for adding and editing products with full validation using `react-hook-form` and `zod`.

3. **`AdminMessagesPage.tsx`:** Contact viewer:
   * Table displaying submissions (date, sender name, email, subject).
   * Clicking a row opens a modal displaying the complete inquiry body.

---

## 5. API Integration (React Query & Mutations)

To enable CRUD and read operations efficiently:
* **`useAdminProducts`:** React Query mutations for adding, editing, and deleting products.
  * Uses the existing `supabase` client.
  * Invalidation of `products` cache query to auto-refresh tables.
* **`useContactSubmissions`:** React Query query to select from `contact_submissions` table (available only to admin sessions).
