# zustand

> Minimal, fast state management for React  
> **Version:** 5.0.12 · **Runtime:** bun · [npm](https://www.npmjs.com/package/zustand) · [Docs](https://zustand.docs.pmnd.rs)

---

> ✏️ **This file is yours to edit** — it lives at `~/.offpkg/docs/bun/zustand.md`  
> To regenerate from original: `offpkg docs reset zustand --runtime bun`

---

## My Notes

<!-- Add your own notes, snippets, and team conventions here -->

---

## Install

```bash
bun add zustand
```

---

## Usage

### Create a Store

```ts
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: () => void
  reset: () => void
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  reset: () => set({ bears: 0 }),
}))
```

### Use in Components

```tsx
function BearCount() {
  const bears = useBearStore((state) => state.bears)
  return <p>{bears} bears</p>
}

function Controls() {
  const increase = useBearStore((state) => state.increase)
  return <button onClick={increase}>+1</button>
}
```

> No providers needed — works anywhere in the tree.

---

## Selecting State

```ts
// Single value — re-renders only when this value changes
const bears = useBearStore((state) => state.bears)

// Multiple values — use useShallow to avoid unnecessary re-renders
import { useShallow } from 'zustand/react/shallow'

const { bears, fish } = useBearStore(
  useShallow((state) => ({ bears: state.bears, fish: state.fish }))
)

// Fetch all state (re-renders on any change — use sparingly)
const state = useBearStore()
```

---

## Updating State

```ts
// Merge update (shallow merge — does NOT deep merge)
set({ bears: 5 })

// Functional update — read current state
set((state) => ({ bears: state.bears + 1 }))

// Replace entire state (second arg = true)
set({}, true)

// Read state outside of set with get
const useStore = create<State>((set, get) => ({
  count: 0,
  double: () => {
    const current = get().count
    set({ count: current * 2 })
  },
}))
```

---

## Async Actions

```ts
const useStore = create<State>((set) => ({
  users: [],
  loading: false,
  fetchUsers: async () => {
    set({ loading: true })
    const users = await api.getUsers()
    set({ users, loading: false })
  },
}))
```

---

## Outside React

```ts
// Read state without a hook
const bears = useBearStore.getState().bears

// Write state
useBearStore.setState({ bears: 10 })

// Subscribe to all changes
const unsub = useBearStore.subscribe((state) => {
  console.log('new state:', state.bears)
})
unsub() // unsubscribe
```

---

## Middleware

### Persist (localStorage / sessionStorage)

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useStore = create(
  persist<State>(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage',                               // localStorage key
      storage: createJSONStorage(() => sessionStorage),   // default: localStorage
    }
  )
)
```

### Immer (nested state mutations)

```ts
import { immer } from 'zustand/middleware/immer'

const useStore = create(
  immer<State>((set) => ({
    user: { profile: { name: 'Jane' } },
    updateName: (name: string) =>
      set((state) => {
        state.user.profile.name = name  // mutate directly
      }),
  }))
)
```

### DevTools (Redux DevTools extension)

```ts
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools<State>(
    (set) => ({ bears: 0, increase: () => set({ bears: 1 }) }),
    { name: 'BearStore' }
  )
)
```

### Combining Middleware

```ts
const useStore = create<State>()(
  devtools(
    persist(
      immer((set) => ({
        // your state
      })),
      { name: 'my-store' }
    )
  )
)
```

---

## Slices Pattern (large stores)

```ts
// bears.ts
export const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((s) => ({ bears: s.bears + 1 })),
})

// fish.ts
export const createFishSlice = (set) => ({
  fish: 0,
  addFish: () => set((s) => ({ fish: s.fish + 1 })),
})

// store.ts
import { create } from 'zustand'

const useStore = create<BearSlice & FishSlice>((...args) => ({
  ...createBearSlice(...args),
  ...createFishSlice(...args),
}))
```

---

## Resources

- [Docs](https://zustand.docs.pmnd.rs)
- [GitHub](https://github.com/pmndrs/zustand)
- [Guides](https://zustand.docs.pmnd.rs/guides)