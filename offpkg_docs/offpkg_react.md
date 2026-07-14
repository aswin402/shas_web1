# react

> JavaScript library for building user interfaces  
> **Version:** 19.2.4 · **Runtime:** bun · [npm](https://www.npmjs.com/package/react) · [Docs](https://react.dev)

---

> ✏️ **This file is yours to edit** — it lives at `~/.offpkg/docs/bun/react.md`  
> To regenerate from original: `offpkg docs reset react --runtime bun`

---

## My Notes

<!-- Add your own notes, snippets, and team conventions here -->

---

## Install

```bash
bun add react react-dom
bun add -d @types/react @types/react-dom
```

## Import

```tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
```

---

## Component

```tsx
// Function component (standard)
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

// Arrow function component
const Button = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick}>{children}</button>
)
```

---

## Hooks

### `useState`

```tsx
const [count, setCount] = useState(0)
const [user, setUser] = useState<User | null>(null)

setCount(count + 1)
setCount(prev => prev + 1)          // functional update
setUser(prev => ({ ...prev, name: 'Jane' }))
```

### `useEffect`

```tsx
// On mount
useEffect(() => {
  fetchData()
}, [])

// On dependency change
useEffect(() => {
  document.title = `${count} items`
}, [count])

// Cleanup on unmount
useEffect(() => {
  const sub = subscribe()
  return () => sub.unsubscribe()
}, [])
```

### `useRef`

```tsx
const inputRef = useRef<HTMLInputElement>(null)
inputRef.current?.focus()

// Mutable value — does NOT trigger re-render
const timerRef = useRef<number>(0)
timerRef.current = setTimeout(fn, 1000)
```

### `useMemo` — expensive computation cache

```tsx
const sorted = useMemo(
  () => items.slice().sort((a, b) => a.name.localeCompare(b.name)),
  [items]
)
```

### `useCallback` — stable function reference

```tsx
const handleClick = useCallback(() => {
  setCount(c => c + 1)
}, []) // only recreated if deps change
```

### `useContext`

```tsx
const ThemeContext = React.createContext<'light' | 'dark'>('light')

// Provide
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// Consume
const theme = useContext(ThemeContext)
```

### `useReducer`

```tsx
type Action = { type: 'increment' } | { type: 'reset' }

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1
    case 'reset': return 0
  }
}

const [count, dispatch] = useReducer(reducer, 0)
dispatch({ type: 'increment' })
```

### `useId` — unique IDs for accessibility

```tsx
const id = useId()
<label htmlFor={id}>Name</label>
<input id={id} />
```

### `useTransition` — mark state update as non-urgent

```tsx
const [isPending, startTransition] = useTransition()

startTransition(() => {
  setFilter(input)  // non-blocking update
})
```

---

## React 19 — New Features

### `use()` hook — read resources in render

```tsx
import { use } from 'react'

function UserCard({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)  // suspends until resolved
  return <p>{user.name}</p>
}
```

### `useOptimistic` — optimistic UI updates

```tsx
const [optimisticLikes, addOptimisticLike] = useOptimistic(
  likes,
  (state, newLike) => [...state, newLike]
)

async function handleLike() {
  addOptimisticLike(tempLike)   // shows immediately
  await saveLike(tempLike)      // actual API call
}
```

### Server Actions (React 19 + frameworks)

```tsx
async function createUser(formData: FormData) {
  'use server'
  const name = formData.get('name')
  await db.users.create({ name })
}

<form action={createUser}>
  <input name="name" />
  <button type="submit">Create</button>
</form>
```

---

## JSX Patterns

```tsx
// Conditional rendering
{isLoggedIn && <Dashboard />}
{isLoggedIn ? <Dashboard /> : <Login />}

// Lists
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}

// Fragment (no extra DOM node)
<>
  <h1>Title</h1>
  <p>Body</p>
</>

// Spread props
<Button {...buttonProps} />

// Children
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>
}
```

---

## TypeScript Patterns

```tsx
// Component props
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  children?: React.ReactNode
}

// Event handlers
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {}
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {}
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {}
const handleKeyDown = (e: React.KeyboardEvent) => {}

// Ref types
const divRef = useRef<HTMLDivElement>(null)
const inputRef = useRef<HTMLInputElement>(null)

// Generic component
function List<T extends { id: string }>({ items, renderItem }: {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}) {
  return <ul>{items.map(item => <li key={item.id}>{renderItem(item)}</li>)}</ul>
}
```

---

## Entry Point (`react-dom`)

```tsx
// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

---

## Custom Hooks

```tsx
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initial
  })

  const set = useCallback((val: T) => {
    setValue(val)
    localStorage.setItem(key, JSON.stringify(val))
  }, [key])

  return [value, set] as const
}
```

---

## Resources

- [react.dev](https://react.dev)
- [Hooks Reference](https://react.dev/reference/react)
- [React 19 Changelog](https://react.dev/blog/2024/12/05/react-19)