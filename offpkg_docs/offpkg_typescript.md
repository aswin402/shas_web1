# typescript

> Typed superset of JavaScript  
> **Version:** 5.9.3 · **Runtime:** bun · [npm](https://www.npmjs.com/package/typescript) · [Docs](https://www.typescriptlang.org)

---

> ✏️ **This file is yours to edit** — it lives at `~/.offpkg/docs/bun/typescript.md`  
> To regenerate from original: `offpkg docs reset typescript --runtime bun`

---

## My Notes

<!-- Add your own notes, snippets, and team conventions here -->

---

## Install

```bash
bun add -d typescript
bunx tsc --init   # generates tsconfig.json
```

> **Note:** Bun runs TypeScript natively — you don't need `ts-node` or compilation for running scripts. TypeScript here is for type checking and editor support.

---

## `tsconfig.json` (recommended for Bun projects)

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2023"],

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,

    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Key options:**
- `strict: true` — enables all strict checks (required by many libraries)
- `noEmit: true` — type-check only, let Bun handle execution
- `moduleResolution: "bundler"` — correct for Bun and Vite
- `noUncheckedIndexedAccess` — array/object access returns `T | undefined`

---

## Type Checking

```bash
# Type-check without emitting files
bunx tsc --noEmit

# Watch mode
bunx tsc --noEmit --watch
```

---

## Core Types

```ts
// Primitives
let name: string = 'Jane'
let age: number = 30
let active: boolean = true
let id: bigint = 9007199254740991n
let sym: symbol = Symbol('id')

// Arrays
let tags: string[] = ['a', 'b']
let tags: Array<string> = ['a', 'b']

// Tuple
let coords: [number, number] = [0, 0]

// Object
let user: { name: string; age?: number } = { name: 'Jane' }

// Union
let value: string | number
let status: 'active' | 'inactive' | 'pending'

// Intersection
type AdminUser = User & { role: 'admin' }

// Any / Unknown / Never
let anything: any
let safe: unknown
function fail(): never { throw new Error('') }

// Null / Undefined
let maybe: string | null = null
let optional: string | undefined
```

---

## Interfaces & Types

```ts
interface User {
  id: number
  email: string
  name?: string           // optional
  readonly createdAt: Date
}

type Status = 'active' | 'inactive'

type ID = string | number

// Extending
interface Admin extends User {
  role: 'admin'
  permissions: string[]
}

// Merging (interface only)
interface Window {
  myCustomProp: string
}
```

---

## Generics

```ts
function identity<T>(value: T): T {
  return value
}

function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

interface ApiResponse<T> {
  data: T
  error: string | null
  status: number
}

// Constraints
function getLength<T extends { length: number }>(item: T): number {
  return item.length
}

// Default generic
type Pagination<T = unknown> = {
  items: T[]
  total: number
  page: number
}
```

---

## Utility Types

```ts
// Make all properties optional
type PartialUser = Partial<User>

// Make all properties required
type RequiredUser = Required<User>

// Make all properties read-only
type ReadonlyUser = Readonly<User>

// Pick specific properties
type PublicUser = Pick<User, 'id' | 'name'>

// Omit specific properties
type UserWithoutPassword = Omit<User, 'password'>

// Record — typed key-value map
type UserMap = Record<string, User>

// Extract / Exclude from union
type StringOrNumber = string | number | boolean
type OnlyStrings = Extract<StringOrNumber, string>    // string
type NoStrings = Exclude<StringOrNumber, string>      // number | boolean

// Return type of a function
type Result = ReturnType<typeof fetchUser>

// Parameters of a function
type Params = Parameters<typeof fetchUser>

// Infer from Promise
type Resolved = Awaited<Promise<User>>

// Non-nullable
type NonNull = NonNullable<string | null | undefined>  // string
```

---

## Type Narrowing

```ts
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()  // string here
  }
  return value.toFixed(2)       // number here
}

// instanceof
if (error instanceof Error) { error.message }

// in operator
if ('email' in user) { user.email }

// Type predicates
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'email' in obj
}

// Assertion functions
function assertDefined<T>(val: T | null | undefined): asserts val is T {
  if (val == null) throw new Error('Expected defined value')
}
```

---

## `satisfies` Operator

```ts
const config = {
  port: 3000,
  host: 'localhost',
} satisfies Record<string, string | number>

config.port  // inferred as number, not string | number
```

---

## `as const`

```ts
const ROLES = ['admin', 'user', 'guest'] as const
type Role = typeof ROLES[number]  // 'admin' | 'user' | 'guest'

const config = { port: 3000, host: 'localhost' } as const
// All properties are readonly literal types
```

---

## Resources

- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [tsconfig Reference](https://www.typescriptlang.org/tsconfig)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)