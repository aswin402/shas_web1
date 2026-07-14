# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a secure and hidden Admin Dashboard at `/admin-dashboard` supporting inventory analytics, product CRUD, and customer contact submissions viewer.

**Architecture:** Database RLS and triggers enforce authentication. An AdminGuard component blocks unauthorized users. Dashboard pages leverage React Query for data access.

**Tech Stack:** React 19, Tailwind CSS v4, Supabase (PostgreSQL + RLS), Zustand, TanStack React Query, React Router 7.

## Global Constraints

- Use bun as the package manager.
- Follow Tailwind CSS v4 patterns.
- Do not use placeholders or generic error handling; implement complete code files.
- Enforce strict typing in TypeScript.

---

### Task 1: Database Schema & Authorization Trigger

**Files:**
- Create: `supabase/migrations/20260627000000_add_admin_role.sql`

**Interfaces:**
- Consumes: None
- Produces: `is_admin` column on `profiles` table, updated `handle_new_user()` trigger, and admin-specific RLS policies.

- [ ] **Step 1: Write the migration SQL file**

Create the file `supabase/migrations/20260627000000_add_admin_role.sql` with the following content:

```sql
-- Add is_admin column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false NOT NULL;

-- Update trigger function to auto-assign is_admin to acharleseon@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_username text;
  username_exists boolean;
  final_username text;
  counter integer := 1;
  is_admin_user boolean := false;
BEGIN
  -- Auto-grant admin role to user
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

-- Enable RLS updates
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

CREATE POLICY "Allow admin select on contact_submissions" 
  ON public.contact_submissions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

- [ ] **Step 2: Commit migration file**

Run:
```bash
git add supabase/migrations/20260627000000_add_admin_role.sql
git commit -m "migration: add is_admin column and trigger logic"
```

---

### Task 2: Zustand Store and Auth Provider Updates

**Files:**
- Modify: `src/store/useAppStore.ts`
- Modify: `src/types/schema.ts`
- Modify: `src/providers/SupabaseAuthProvider.tsx`
- Modify: `src/providers/__tests__/SupabaseAuthProvider.test.tsx`

**Interfaces:**
- Consumes: Database schema changes (`is_admin`)
- Produces: `is_admin` boolean property inside the Zustand global user state.

- [ ] **Step 1: Write failing tests**

Update `src/providers/__tests__/SupabaseAuthProvider.test.tsx` to assert that the `is_admin` property is returned:

```typescript
// Look for user session tests and add assertion for is_admin:
expect(useAppStore.getState().user).toEqual({
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  username: 'testuser',
  is_admin: true, // Assert admin status
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `bun run test`
Expected: Failures on assertions due to missing `is_admin` field.

- [ ] **Step 3: Modify types, store and provider**

Update `AppUser` interface in `src/store/useAppStore.ts`:
```typescript
interface AppUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  username?: string | null;
  is_admin?: boolean; // Added
}
```

Update `UserSchema` in `src/types/schema.ts`:
```typescript
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  is_admin: z.boolean().optional(),
});
```

Update `SupabaseAuthProvider.tsx` select and payload:
```typescript
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, phone, full_name, email, is_admin') // Added is_admin
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          name: profile?.full_name || session.user.user_metadata.full_name || '',
          email: profile?.email || session.user.email || '',
          phone: profile?.phone || session.user.phone || '',
          username: profile?.username || session.user.user_metadata.username || '',
          is_admin: profile?.is_admin || false, // Added is_admin
        });
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `bun run test`
Expected: All tests pass.

- [ ] **Step 5: Commit changes**

Run:
```bash
git add src/store/useAppStore.ts src/types/schema.ts src/providers/SupabaseAuthProvider.tsx src/providers/__tests__/SupabaseAuthProvider.test.tsx
git commit -m "feat(auth): sync is_admin profile flag to Zustand state"
```

---

### Task 3: Access Guarding & Admin Login Portal

**Files:**
- Create: `src/components/auth/AdminGuard.tsx`
- Create: `src/pages/admin/AdminLoginPage.tsx`
- Modify: `src/App.tsx`
- Create: `src/components/auth/__tests__/AdminGuard.test.tsx`

**Interfaces:**
- Consumes: Zustand store `user` state.
- Produces: Protected layout guard and hidden login page for `/admin-dashboard`.

- [ ] **Step 1: Write failing tests for AdminGuard**

Create `src/components/auth/__tests__/AdminGuard.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminGuard } from '../AdminGuard';
import { useAppStore } from '@/store/useAppStore';

describe('AdminGuard', () => {
  it('shows login page when user is not logged in', () => {
    useAppStore.setState({ user: null });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminGuard />}>
            <Route index element={<div>Admin Dashboard Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/admin login/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/components/auth/__tests__/AdminGuard.test.tsx`
Expected: Failures.

- [ ] **Step 3: Implement Guard, Login Page, and route wiring**

Create `src/components/auth/AdminGuard.tsx`:
```typescript
import { Outlet } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';

export function AdminGuard() {
  const user = useAppStore(state => state.user);

  if (!user || !user.is_admin) {
    return <AdminLoginPage />;
  }

  return <Outlet />;
}
```

Create `src/pages/admin/AdminLoginPage.tsx` containing an admin login form that calls `supabase.auth.signInWithPassword`. Use absolute layout centering with custom form values.

Update `src/App.tsx` routes:
```typescript
// Import AdminGuard and Admin sub-pages...
// Add nested routes:
      {
        path: 'admin-dashboard',
        element: <AdminGuard />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: 'products',
            element: <AdminProductsPage />,
          },
          {
            path: 'messages',
            element: <AdminMessagesPage />,
          },
        ]
      }
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `bun run test`
Expected: Pass.

- [ ] **Step 5: Commit changes**

Run:
```bash
git add src/components/auth/AdminGuard.tsx src/pages/admin/AdminLoginPage.tsx src/App.tsx
git commit -m "feat(auth): protect admin routes and add hidden login page"
```

---

### Task 4: Sidebar Layout & Analytics Page

**Files:**
- Create: `src/layouts/AdminLayout.tsx`
- Create: `src/pages/admin/AdminDashboardPage.tsx`
- Create: `src/pages/admin/__tests__/AdminDashboardPage.test.tsx`

**Interfaces:**
- Consumes: `<Outlet />` sub-pages.
- Produces: Fully styled sidebar dashboard page displaying metrics & inventory valuation.

- [ ] **Step 1: Write failing tests for Analytics calculation**

Create `src/pages/admin/__tests__/AdminDashboardPage.test.tsx` checking that valuation, count, and warnings render correctly.

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/pages/admin/__tests__/AdminDashboardPage.test.tsx`
Expected: Fail.

- [ ] **Step 3: Implement Layout and Analytics view**

Implement `src/layouts/AdminLayout.tsx` and `src/pages/admin/AdminDashboardPage.tsx`. Integrate React Query (`useProductsQuery` and `useContactSubmissions`) to calculate summary numbers (`sum(price * stock)`).

- [ ] **Step 4: Run tests and verify they pass**

Run: `bun run test`
Expected: Pass.

- [ ] **Step 5: Commit changes**

Run:
```bash
git add src/layouts/AdminLayout.tsx src/pages/admin/AdminDashboardPage.tsx
git commit -m "feat(admin): build admin layout and analytics dashboard"
```

---

### Task 5: Products CRUD Management

**Files:**
- Create: `src/pages/admin/AdminProductsPage.tsx`
- Create: `src/pages/admin/components/ProductFormModal.tsx`
- Create: `src/pages/admin/__tests__/AdminProductsPage.test.tsx`

**Interfaces:**
- Consumes: Supabase database client `products` table write operations.
- Produces: Catalog editor dashboard (creating, updating, and deleting products).

- [ ] **Step 1: Write failing tests for Products CRUD**

Create `src/pages/admin/__tests__/AdminProductsPage.test.tsx` verifying CRUD functions and validation rules.

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/pages/admin/__tests__/AdminProductsPage.test.tsx`
Expected: Fail.

- [ ] **Step 3: Implement Products Panel & Form Modal**

Create `src/pages/admin/AdminProductsPage.tsx` and `src/pages/admin/components/ProductFormModal.tsx`. Connect inputs to `react-hook-form` + zod schema, and map submission actions to real database queries (`supabase.from('products').upsert()`).

- [ ] **Step 4: Run tests and verify they pass**

Run: `bun run test`
Expected: Pass.

- [ ] **Step 5: Commit changes**

Run:
```bash
git add src/pages/admin/AdminProductsPage.tsx src/pages/admin/components/ProductFormModal.tsx
git commit -m "feat(admin): support CRUD operations for catalog products"
```

---

### Task 6: Messages & Client Inquiries Viewer

**Files:**
- Create: `src/pages/admin/AdminMessagesPage.tsx`
- Create: `src/pages/admin/__tests__/AdminMessagesPage.test.tsx`

**Interfaces:**
- Consumes: Supabase database client `contact_submissions` table select.
- Produces: Read-only viewer list and inquiry modal.

- [ ] **Step 1: Write failing tests for Messages Page**

Create `src/pages/admin/__tests__/AdminMessagesPage.test.tsx` checking that list rendering operates correctly.

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/pages/admin/__tests__/AdminMessagesPage.test.tsx`
Expected: Fail.

- [ ] **Step 3: Implement Messages Viewer**

Implement `src/pages/admin/AdminMessagesPage.tsx` pulling from `contact_submissions` table via TanStack Query and displaying columns for sender, email, subject, date, and body modal.

- [ ] **Step 4: Run tests and verify they pass**

Run: `bun run test`
Expected: Pass.

- [ ] **Step 5: Commit changes**

Run:
```bash
git add src/pages/admin/AdminMessagesPage.tsx
git commit -m "feat(admin): build customer message inquiries viewer"
```
