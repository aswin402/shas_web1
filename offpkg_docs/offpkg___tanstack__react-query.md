# @tanstack/react-query

> Server state management — fetching, caching, syncing async data in React  
> **Version:** 5.95.0 · **Runtime:** bun · [npm](https://www.npmjs.com/package/@tanstack/react-query) · [Docs](https://tanstack.com/query)

---

> ✏️ **This file is yours to edit** — it lives at `~/.offpkg/docs/bun/@tanstack/react-query.md`  
> To regenerate from original: `offpkg docs reset @tanstack/react-query --runtime bun`

---

## My Notes

<!-- Add your own notes, snippets, and team conventions here -->

---

## Install

```bash
bun add @tanstack/react-query
bun add -d @tanstack/react-query-devtools
```

## Import

```ts
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query'
```

> **Mental model:** TanStack Query owns **server state** (API data). Use `useState`/`zustand` for **client state** (modals, UI toggles).

---

## Setup

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,     // 1 minute — data is fresh for this long
      retry: 2,                 // retry failed requests twice
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
```

---

## `useQuery` — fetch & cache data

```tsx
const { data, isPending, isError, error, isFetching, refetch } = useQuery({
  queryKey: ['users'],           // cache key — array, treated like a dependency array
  queryFn: () => fetch('/api/users').then(r => r.json()),
})

// With parameter
const { data: user } = useQuery({
  queryKey: ['user', userId],    // changes when userId changes → auto refetch
  queryFn: () => api.getUser(userId),
  enabled: !!userId,             // only run when userId is truthy
})
```

### `useQuery` return values

```ts
data          // T | undefined — the resolved data
isPending     // true while loading for the first time
isFetching    // true whenever a fetch is in flight (including background)
isError       // true if the last fetch failed
error         // Error | null
isSuccess     // true if data is available
dataUpdatedAt // timestamp of last successful fetch
refetch()     // manually trigger a refetch
```

### `useQuery` options

```ts
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 1000 * 60 * 5,    // 5 min — don't refetch if data is fresh
  gcTime: 1000 * 60 * 10,      // 10 min — keep in cache after unmount (was cacheTime in v4)
  refetchOnWindowFocus: true,   // refetch when tab regains focus (default: true)
  refetchOnMount: true,         // refetch when component mounts (default: true)
  refetchInterval: 5000,        // poll every 5 seconds (false to disable)
  retry: 3,                     // number of retries on failure
  enabled: true,                // conditionally run the query
  select: (data) => data.items, // transform data — only rerenders if result changes
  placeholderData: [],          // shown while loading (not cached)
  initialData: cachedData,      // treated as real data, skips loading state
})
```

---

## `useMutation` — create, update, delete

```tsx
const mutation = useMutation({
  mutationFn: (newUser: CreateUserDTO) =>
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json()),

  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['users'] }) // refetch users list
  },
  onError: (error) => {
    toast.error(error.message)
  },
  onSettled: () => {
    // runs after success or error
  },
})

// Trigger it
mutation.mutate({ name: 'Jane', email: 'jane@example.com' })

// Or async/await
await mutation.mutateAsync({ name: 'Jane' })
```

### `useMutation` states

```ts
mutation.isPending   // true while running
mutation.isSuccess   // true after success
mutation.isError     // true after failure
mutation.isIdle      // true before first call
mutation.data        // T — result data
mutation.error       // Error | null
mutation.variables   // the variables passed to mutate()
mutation.reset()     // reset to idle state
```

---

## `useQueryClient` — imperative cache control

```tsx
const queryClient = useQueryClient()

// Invalidate — mark stale → triggers refetch on next render
queryClient.invalidateQueries({ queryKey: ['users'] })

// Invalidate all queries starting with 'user'
queryClient.invalidateQueries({ queryKey: ['user'] })

// Manually set cache data (e.g. after create/update)
queryClient.setQueryData(['user', id], updatedUser)

// Update part of cached data
queryClient.setQueryData(['users'], (old: User[]) =>
  old.map(u => u.id === id ? { ...u, name: 'Jane' } : u)
)

// Prefetch — load data before navigation
await queryClient.prefetchQuery({
  queryKey: ['user', id],
  queryFn: () => api.getUser(id),
})

// Read cache without subscribing
const users = queryClient.getQueryData<User[]>(['users'])

// Remove from cache
queryClient.removeQueries({ queryKey: ['users'] })

// Cancel in-flight requests
await queryClient.cancelQueries({ queryKey: ['users'] })
```

---

## Query Keys — best practice

```ts
// Treat like a dependency array — include everything the queryFn uses
['users']                           // all users
['user', userId]                    // specific user
['user', userId, 'posts']           // user's posts
['users', { status: 'active' }]    // filtered
['search', { q: 'flutter', page: 1 }]
```

---

## Parallel & Dependent Queries

```tsx
// Parallel — both run at the same time
const usersQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
const postsQuery = useQuery({ queryKey: ['posts'], queryFn: fetchPosts })

// Dependent — waits for userId before running
const { data: user } = useQuery({ queryKey: ['user', id], queryFn: () => fetchUser(id) })
const { data: orders } = useQuery({
  queryKey: ['orders', user?.id],
  queryFn: () => fetchOrders(user!.id),
  enabled: !!user,   // only runs after user is loaded
})
```

---

## Infinite / Paginated Queries

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => fetchPosts({ page: pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, pages) =>
    lastPage.hasMore ? pages.length + 1 : undefined,
})

// data.pages is an array of pages — flatten to render
const allPosts = data?.pages.flatMap(p => p.items) ?? []
```

---

## Optimistic Updates

```tsx
const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (updated) => {
    await queryClient.cancelQueries({ queryKey: ['user', updated.id] })
    const previous = queryClient.getQueryData<User>(['user', updated.id])
    queryClient.setQueryData(['user', updated.id], updated)  // update cache immediately
    return { previous }  // return for rollback
  },
  onError: (err, updated, context) => {
    // Roll back on failure
    queryClient.setQueryData(['user', updated.id], context?.previous)
  },
  onSettled: (_, __, updated) => {
    queryClient.invalidateQueries({ queryKey: ['user', updated.id] })
  },
})
```

---

## Custom Hook Pattern (recommended)

```ts
// hooks/useUsers.ts
export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: api.getUsers })
}

export function useUser(id: string) {
  return useQuery({ queryKey: ['user', id], queryFn: () => api.getUser(id), enabled: !!id })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}
```

---

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [GitHub](https://github.com/TanStack/query)
- [DevTools](https://tanstack.com/query/latest/docs/framework/react/devtools)
- [v4 → v5 Migration Guide](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5)