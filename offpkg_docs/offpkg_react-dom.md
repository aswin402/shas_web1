# react-dom

> React renderer for the browser DOM  
> **Version:** 19.2.4 · **Runtime:** bun · [npm](https://www.npmjs.com/package/react-dom) · [Docs](https://react.dev/reference/react-dom)

---

> ✏️ **This file is yours to edit** — it lives at `~/.offpkg/docs/bun/react-dom.md`  
> To regenerate from original: `offpkg docs reset react-dom --runtime bun`

---

## My Notes

<!-- Add your own notes, snippets, and team conventions here -->

---

## Install

```bash
bun add react react-dom
bun add -d @types/react @types/react-dom
```

> Always install `react` and `react-dom` together — they must be the same version.

---

## Entry Point

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

## `createRoot` API

```tsx
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root')!)

// Render / update
root.render(<App />)

// Unmount and clean up
root.unmount()
```

---

## Portals — render outside the component tree

Useful for modals, tooltips, and overlays that need to escape CSS overflow or z-index constraints.

```tsx
import { createPortal } from 'react-dom'

function Modal({ children }: { children: React.ReactNode }) {
  return createPortal(
    <div className="modal-overlay">
      <div className="modal">{children}</div>
    </div>,
    document.body  // renders here, not in parent's DOM position
  )
}
```

---

## `flushSync` — force synchronous DOM update

Use sparingly — bypasses React's batching. Useful when you need the DOM updated before reading a layout measurement.

```tsx
import { flushSync } from 'react-dom'

flushSync(() => {
  setCount(count + 1)
})
// DOM is updated here before the next line
inputRef.current?.scrollIntoView()
```

---

## `useFormStatus` — form submission state (React 19)

Must be used inside a `<form>` with a Server Action.

```tsx
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  )
}
```

---

## Hydration (SSR)

```tsx
import { hydrateRoot } from 'react-dom/client'

// Attach React to server-rendered HTML
hydrateRoot(
  document.getElementById('root')!,
  <App />
)
```

---

## Imports at a Glance

```tsx
// Client rendering
import { createRoot } from 'react-dom/client'
import { hydrateRoot } from 'react-dom/client'

// Utilities
import { createPortal } from 'react-dom'
import { flushSync } from 'react-dom'

// React 19 form hooks
import { useFormStatus } from 'react-dom'
import { useFormState } from 'react-dom'  // renamed to useActionState in React 19
```

---

## Resources

- [react-dom API Reference](https://react.dev/reference/react-dom)
- [createRoot](https://react.dev/reference/react-dom/client/createRoot)
- [Portals](https://react.dev/reference/react-dom/createPortal)