# Supabase Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Supabase into the React client to handle user registration/login, database queries for products, live cart & wishlist synchronization, and contact form submissions.

**Architecture:** Frontend-only integration using `@supabase/supabase-js` SDK. Datastore fetch operations are cached via `@tanstack/react-query`, while user sessions, carts, and wishlists are synchronized dynamically between a persistent Zustand store and Supabase backend tables.

**Tech Stack:** React 19, Vite, Bun, Zustand 5, React Query 5, Supabase Client SDK, Vitest (Testing)

## Global Constraints

- Use `bun` as the package manager.
- Follow Tailwind CSS v4 patterns.
- Do not use placeholders or generic error handling; implement complete code files.
- Enforce strict typing in TypeScript.

---

### Task 1: Environment Setup, Supabase Client, and Testing Suite

**Files:**
- Create: `.env.example`
- Create: `.env`
- Create: `src/lib/supabase.ts`
- Modify: `package.json`
- Create: `src/lib/__tests__/supabase.test.ts`

**Interfaces:**
- Produces: `supabase` (SupabaseClient instance exported from `src/lib/supabase.ts`)

- [ ] **Step 1: Create .env.example**

Create file `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/.env.example` with content:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 2: Create .env**

Create file `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/.env` with content:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 3: Install SDK and Vitest**

Run:
```bash
bun add @supabase/supabase-js && bun add -d vitest @testing-library/react happy-dom
```

- [ ] **Step 4: Configure test scripts in package.json**

Modify `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/package.json` to append `test` in `scripts`:
```json
"scripts": {
  "build": "tsc -b && vite build",
  "dev": "vite",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest run"
}
```

- [ ] **Step 5: Create Supabase client file**

Create file `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/src/lib/supabase.ts` with content:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 6: Write client initialization test**

Create file `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/src/lib/__tests__/supabase.test.ts` with content:
```typescript
import { describe, it, expect } from 'vitest';
import { supabase } from '../supabase';

describe('Supabase Client Configuration', () => {
  it('should initialize supabase client correctly', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });
});
```

- [ ] **Step 7: Run test to verify it passes**

Run: `bun run test src/lib/__tests__/supabase.test.ts`
Expected Output: `PASS  src/lib/__tests__/supabase.test.ts`

- [ ] **Step 8: Commit**

Run:
```bash
git add .env.example src/lib/supabase.ts package.json src/lib/__tests__/supabase.test.ts
git commit -m "feat: setup supabase client and vitest runner"
```

---

### Task 2: Database Migrations and Product Seeding

**Files:**
- Create: `supabase/migrations/20260626000000_init_schema.sql`
- Create: `scripts/seed-products.ts`

**Interfaces:**
- Produces: `supabase/migrations/20260626000000_init_schema.sql` containing DDL schemas.

- [ ] **Step 1: Write SQL Migration File**

Create file `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/supabase/migrations/20260626000000_init_schema.sql` with content:
```sql
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PRODUCTS
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null check (price >= 0),
  image_url text,
  category text,
  stock integer default 0 check (stock >= 0),
  rating numeric default 0 check (rating >= 0 and rating <= 5),
  reviews_count integer default 0 check (reviews_count >= 0),
  details jsonb,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CART ITEMS
create table public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer default 1 check (quantity > 0) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id)
);

-- WISHLIST ITEMS
create table public.wishlist_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id)
);

-- CONTACT SUBMISSIONS
create table public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENABLE RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.contact_submissions enable row level security;

-- POLICIES
create policy "Allow public read-access to profiles" on public.profiles for select using (true);
create policy "Allow users to update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Allow public read-access to products" on public.products for select using (true);

create policy "Allow users to read own cart" on public.cart_items for select using (auth.uid() = user_id);
create policy "Allow users to insert into own cart" on public.cart_items for insert with check (auth.uid() = user_id);
create policy "Allow users to update own cart" on public.cart_items for update using (auth.uid() = user_id);
create policy "Allow users to delete from own cart" on public.cart_items for delete using (auth.uid() = user_id);

create policy "Allow users to read own wishlist" on public.wishlist_items for select using (auth.uid() = user_id);
create policy "Allow users to insert into own wishlist" on public.wishlist_items for insert with check (auth.uid() = user_id);
create policy "Allow users to delete from own wishlist" on public.wishlist_items for delete using (auth.uid() = user_id);

create policy "Allow anyone to submit contact messages" on public.contact_submissions for insert with check (true);
```

- [ ] **Step 2: Create Seeding Script**

Create file `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/scripts/seed-products.ts` with content:
```typescript
import { createClient } from '@supabase/supabase-js';
import { shopProducts } from '../src/data/shopData';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing URL or Key env variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding products...');
  for (const product of shopProducts) {
    const { data, error } = await supabase.from('products').upsert({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image,
      category: product.category,
      stock: 10,
      rating: product.rating,
      reviews_count: product.reviews,
      details: { dimensions: product.dimensions || '', material: product.material || '' },
      is_featured: product.featured || false,
    }, { onConflict: 'name' });

    if (error) {
      console.error(`Failed to seed ${product.name}:`, error.message);
    } else {
      console.log(`Seeded: ${product.name}`);
    }
  }
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 3: Commit migration and script**

Run:
```bash
git add supabase/migrations/20260626000000_init_schema.sql scripts/seed-products.ts
git commit -m "feat: add SQL migrations and products seeding script"
```

---

### Task 3: Global Authentication State Provider

**Files:**
- Create: `src/providers/SupabaseAuthProvider.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabase`
- Consumes: `useAppStore` from `src/store/useAppStore`
- Produces: `SupabaseAuthProvider` wrapper component

- [ ] **Step 1: Implement SupabaseAuthProvider**

Create file `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/src/providers/SupabaseAuthProvider.tsx` with content:
```typescript
import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore(state => state.setUser);
  const setIsLoading = useAppStore(state => state.setIsLoading);

  useEffect(() => {
    setIsLoading(true);
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.full_name || '',
          email: session.user.email || '',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.full_name || '',
          email: session.user.email || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setIsLoading]);

  return <>{children}</>;
}
```

- [ ] **Step 2: Update src/main.tsx to wrap App**

Modify `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/src/main.tsx` to include `SupabaseAuthProvider`:
```typescript
<<<<
import { QueryProvider } from '@/providers/QueryProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
)
====
import { QueryProvider } from '@/providers/QueryProvider.tsx'
import { SupabaseAuthProvider } from '@/providers/SupabaseAuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <SupabaseAuthProvider>
        <App />
      </SupabaseAuthProvider>
    </QueryProvider>
  </StrictMode>,
)
>>>>
```

- [ ] **Step 3: Commit**

Run:
```bash
git add src/providers/SupabaseAuthProvider.tsx src/main.tsx
git commit -m "feat: add global SupabaseAuthProvider and integrate into main render"
```

---

### Task 4: Connect Authentication Forms

**Files:**
- Modify: `src/pages/auth/components/LoginForm.tsx`
- Modify: `src/pages/auth/components/RegisterForm.tsx`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabase`

- [ ] **Step 1: Refactor LoginForm**

Modify `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/src/pages/auth/components/LoginForm.tsx` to call Supabase authentication API:
```typescript
<<<<
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo implementation
    console.log('Login attempt:', { email, password });
  };
====
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };
>>>>
```
*(Import `supabase` at top of file)*:
```typescript
import { supabase } from '@/lib/supabase';
```

- [ ] **Step 2: Refactor RegisterForm**

Modify `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/src/pages/auth/components/RegisterForm.tsx` to handle user signs up:
```typescript
<<<<
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register attempt:', { name, email, password });
  };
====
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create user account.');
    } finally {
      setLoading(false);
    }
  };
>>>>
```
*(Import `supabase` at top of file)*:
```typescript
import { supabase } from '@/lib/supabase';
```

- [ ] **Step 3: Commit**

Run:
```bash
git add src/pages/auth/components/LoginForm.tsx src/pages/auth/components/RegisterForm.tsx
git commit -m "feat: connect login and signup forms to Supabase Auth"
```

---

### Task 5: Zustand Syncing Store for Cart & Wishlist

**Files:**
- Modify: `src/store/useAppStore.ts`
- Create: `src/store/__tests__/useAppStore.test.ts`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabase`
- Produces: `useAppStore` updated state variables (`cart`, `wishlist`, and DB syncer actions)

- [ ] **Step 1: Update useAppStore to sync with Supabase**

Modify `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/src/store/useAppStore.ts` with content:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface CartItem {
  id?: string;
  productId: string;
  quantity: number;
}

interface AppState {
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  cart: CartItem[];
  wishlist: string[]; // array of productIds
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  clearLocalState: () => void;
  mergeGuestState: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => {
        set({ user });
        if (user) {
          get().mergeGuestState();
        } else {
          get().clearLocalState();
        }
      },
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      cart: [],
      wishlist: [],
      
      fetchCart: async () => {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) return;
        const { data, error } = await supabase
          .from('cart_items')
          .select('product_id, quantity');
        if (error) return;
        set({ cart: data.map(item => ({ productId: item.product_id, quantity: item.quantity })) });
      },

      fetchWishlist: async () => {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) return;
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('product_id');
        if (error) return;
        set({ wishlist: data.map(item => item.product_id) });
      },

      addToCart: async (productId, quantity = 1) => {
        const currentCart = get().cart;
        const existing = currentCart.find(item => item.productId === productId);
        let newCart = [...currentCart];

        if (existing) {
          newCart = currentCart.map(item => 
            item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          newCart.push({ productId, quantity });
        }

        set({ cart: newCart });

        const session = await supabase.auth.getSession();
        const user = session.data.session?.user;
        if (user) {
          await supabase.from('cart_items').upsert({
            user_id: user.id,
            product_id: productId,
            quantity: existing ? existing.quantity + quantity : quantity,
          }, { onConflict: 'user_id,product_id' });
        }
      },

      updateCartQuantity: async (productId, quantity) => {
        const newCart = get().cart.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        );
        set({ cart: newCart });

        const session = await supabase.auth.getSession();
        const user = session.data.session?.user;
        if (user) {
          await supabase.from('cart_items').update({ quantity }).match({ user_id: user.id, product_id: productId });
        }
      },

      removeFromCart: async (productId) => {
        set({ cart: get().cart.filter(item => item.productId !== productId) });

        const session = await supabase.auth.getSession();
        const user = session.data.session?.user;
        if (user) {
          await supabase.from('cart_items').delete().match({ user_id: user.id, product_id: productId });
        }
      },

      toggleWishlist: async (productId) => {
        const currentList = get().wishlist;
        const hasIt = currentList.includes(productId);
        const newList = hasIt ? currentList.filter(id => id !== productId) : [...currentList, productId];
        set({ wishlist: newList });

        const session = await supabase.auth.getSession();
        const user = session.data.session?.user;
        if (user) {
          if (hasIt) {
            await supabase.from('wishlist_items').delete().match({ user_id: user.id, product_id: productId });
          } else {
            await supabase.from('wishlist_items').insert({ user_id: user.id, product_id: productId });
          }
        }
      },

      clearLocalState: () => set({ cart: [], wishlist: [] }),

      mergeGuestState: async () => {
        const session = await supabase.auth.getSession();
        const user = session.data.session?.user;
        if (!user) return;

        const localCart = get().cart;
        for (const item of localCart) {
          await supabase.from('cart_items').upsert({
            user_id: user.id,
            product_id: item.productId,
            quantity: item.quantity,
          }, { onConflict: 'user_id,product_id' });
        }

        const localWishlist = get().wishlist;
        for (const pid of localWishlist) {
          await supabase.from('wishlist_items').upsert({
            user_id: user.id,
            product_id: pid,
          }, { onConflict: 'user_id,product_id' });
        }

        get().fetchCart();
        get().fetchWishlist();
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }),
    }
  )
);
```

- [ ] **Step 2: Commit**

Run:
```bash
git add src/store/useAppStore.ts
git commit -m "feat: refactor useAppStore for local cart & wishlist sync with Supabase backend"
```

---

### Task 6: Fetch Products Catalog from Database

**Files:**
- Create: `src/hooks/useProducts.ts`
- Modify: `src/pages/shop/ShopPage.tsx`
- Modify: `src/pages/product/ProductPage.tsx`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabase`
- Produces: React Query custom hooks (`useProductsQuery`, `useProductDetailQuery`)

- [ ] **Step 1: Implement Query Hooks**

Create file `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/src/hooks/useProducts.ts` with content:
```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useProductsQuery(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useProductDetailQuery(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
}
```

- [ ] **Step 2: Refactor ShopPage**

Modify `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/src/pages/shop/ShopPage.tsx` to read from `useProductsQuery` instead of local static files.

- [ ] **Step 3: Refactor ProductDetailPage**

Modify `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/src/pages/product/ProductPage.tsx` to fetch single item.

- [ ] **Step 4: Commit**

Run:
```bash
git add src/hooks/useProducts.ts src/pages/shop/ShopPage.tsx src/pages/product/ProductPage.tsx
git commit -m "feat: migrate shop and product details pages to fetch dynamically from Supabase"
```

---

### Task 7: Submit Contact Form Responses to Database

**Files:**
- Modify: `src/pages/contact/ContactPage.tsx`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabase`

- [ ] **Step 1: Update ContactPage Form Submit Handler**

Modify `file:///home/aswin/programming/vscode/celestialabs/vigrahakart/src/pages/contact/ContactPage.tsx`:
```typescript
<<<<
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };
====
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      if (error) throw error;
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit message.');
    } finally {
      setLoading(false);
    }
  };
>>>>
```
*(Import `supabase` and `useState` at top of file)*:
```typescript
import { supabase } from '@/lib/supabase';
```

- [ ] **Step 2: Commit**

Run:
```bash
git add src/pages/contact/ContactPage.tsx
git commit -m "feat: connect contact form to Supabase contact_submissions table"
```

---
