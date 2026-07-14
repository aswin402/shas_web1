# zod

> TypeScript-first schema validation with static type inference  
> **Version:** 4.3.6 · **Runtime:** bun · [npm](https://www.npmjs.com/package/zod) · [Docs](https://zod.dev)

---

> ✏️ **This file is yours to edit** — it lives at `~/.offpkg/docs/bun/zod.md`  
> To regenerate from original: `offpkg docs reset zod --runtime bun`

---

## My Notes

<!-- Add your own notes, snippets, and team conventions here -->

---

## Install

```bash
bun add zod
```

Requires `strict: true` in `tsconfig.json`.

## Import

```ts
import * as z from 'zod'
// or
import { z } from 'zod'
```

> **Zod v4 import:** Use `import { z } from 'zod'` — the named export is new in v4 and preferred.

---

## Core idea

Write the schema once — get validation **and** the TypeScript type for free:

```ts
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().optional(),
})

type User = z.infer<typeof UserSchema>
// { id: number; email: string; name?: string }

// Validate at runtime
const user = UserSchema.parse(untrustedData)      // throws on failure
const result = UserSchema.safeParse(untrustedData) // never throws
```

---

## Parse vs SafeParse

```ts
// parse — throws ZodError if invalid
try {
  const user = UserSchema.parse(data)
} catch (err) {
  if (err instanceof z.ZodError) {
    console.log(err.issues)
  }
}

// safeParse — always returns a result object
const result = UserSchema.safeParse(data)

if (result.success) {
  console.log(result.data)     // typed and validated
} else {
  console.log(result.error.issues)       // array of issues
  console.log(result.error.flatten())    // { fieldErrors, formErrors }
  console.log(result.error.format())     // nested object of errors
}

// Async variants (for async refinements)
const result = await UserSchema.safeParseAsync(data)
```

---

## Primitive Types

```ts
z.string()
z.number()
z.boolean()
z.bigint()
z.date()
z.symbol()
z.undefined()
z.null()
z.void()
z.any()
z.unknown()
z.never()
```

---

## String Validation

```ts
z.string()
  .min(3, 'At least 3 characters')
  .max(100, 'Too long')
  .length(10, 'Exactly 10 characters')
  .email('Invalid email')
  .url('Invalid URL')
  .uuid('Invalid UUID')
  .cuid()
  .cuid2()
  .nanoid()
  .regex(/^\d{4}$/, 'Must be 4 digits')
  .startsWith('https://')
  .endsWith('.com')
  .includes('@')
  .toLowerCase()           // transforms to lowercase
  .toUpperCase()
  .trim()                  // strips whitespace
  .nonempty('Required')    // disallow empty string ''
```

**Common patterns:**
```ts
const emailSchema = z.string().trim().toLowerCase().email()
const slugSchema  = z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug')
const urlSchema   = z.string().url()
const uuidSchema  = z.string().uuid()
const phoneSchema = z.string().regex(/^\+?[\d\s\-()]{7,15}$/)
```

---

## Number Validation

```ts
z.number()
  .int('Must be an integer')
  .positive('Must be positive')
  .negative()
  .nonnegative()
  .nonpositive()
  .gt(0)     .gte(1)    // greater than / greater than or equal
  .lt(100)   .lte(99)   // less than / less than or equal
  .multipleOf(5)
  .safe()               // within Number.MAX_SAFE_INTEGER
  .finite()             // not Infinity
```

**Coerce strings from HTML inputs:**
```ts
// HTML <input type="number"> returns a string — coerce it
const ageSchema = z.coerce.number().int().positive().max(120)
const priceSchema = z.coerce.number().multipleOf(0.01).nonnegative()
```

---

## Object

```ts
const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.date().optional(),
})

// Extend — add fields
const AdminSchema = UserSchema.extend({
  permissions: z.array(z.string()),
})

// Merge two schemas
const MergedSchema = SchemaA.merge(SchemaB)

// Pick — keep only these fields
const PublicUserSchema = UserSchema.pick({ id: true, name: true, email: true })

// Omit — remove these fields
const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true })

// Partial — make all fields optional (great for PATCH endpoints)
const UpdateUserSchema = UserSchema.partial()

// Required — make all fields required
const RequiredSchema = UserSchema.required()

// Passthrough — allow unknown keys (don't strip them)
UserSchema.passthrough()

// Strict — reject unknown keys
z.strictObject({ name: z.string() })

// Strip (default) — remove unknown keys silently
UserSchema.strip()
```

---

## Array

```ts
z.array(z.string())
z.array(z.number()).nonempty('At least one item required')
z.array(z.string()).min(1).max(10)
z.array(z.string()).length(3)

// Typed tuple
const CoordSchema = z.tuple([z.number(), z.number()])
type Coord = z.infer<typeof CoordSchema> // [number, number]

// Rest element
const ArgsSchema = z.tuple([z.string()]).rest(z.number())
// [string, ...number[]]
```

---

## Enum

```ts
// Zod enum (most common)
const RoleSchema = z.enum(['admin', 'user', 'guest'])
type Role = z.infer<typeof RoleSchema> // 'admin' | 'user' | 'guest'

// Access values
RoleSchema.options  // ['admin', 'user', 'guest']
RoleSchema.enum.admin // 'admin'

// From a const array (keeps type narrow)
const ROLES = ['admin', 'user', 'guest'] as const
const RoleSchema = z.enum(ROLES)

// Native TypeScript enum
enum Status { Active, Inactive }
z.nativeEnum(Status)
```

---

## Union & Intersection

```ts
// Union
const IdSchema = z.union([z.string(), z.number()])
const IdSchema = z.string().or(z.number())  // shorthand

// Discriminated union — faster and better errors
const ShapeSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('circle'),    radius: z.number() }),
  z.object({ type: z.literal('rect'),      width: z.number(), height: z.number() }),
  z.object({ type: z.literal('triangle'),  base: z.number(), height: z.number() }),
])

// Intersection
const AdminSchema = UserSchema.and(z.object({ adminKey: z.string() }))
```

---

## Optional / Nullable / Default

```ts
z.string().optional()          // string | undefined
z.string().nullable()          // string | null
z.string().nullish()           // string | null | undefined
z.string().default('fallback') // uses 'fallback' when input is undefined
z.string().catch('fallback')   // uses 'fallback' on validation failure (never throws)
```

---

## Literal

```ts
z.literal('admin')     // exactly 'admin'
z.literal(42)
z.literal(true)

// Multiple literals
const StatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('banned'),
])
```

---

## Transform

Transforms run **after** validation and can change the output type.

```ts
// String → number
const NumberFromString = z.string()
  .transform((val) => parseInt(val, 10))
  .pipe(z.number().int())  // validate the result too

// Object → different shape
const ApiUserSchema = z.object({ first_name: z.string(), last_name: z.string() })
  .transform(({ first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
  }))

// Trim and lowercase email
const emailSchema = z.string()
  .transform((s) => s.trim().toLowerCase())
  .pipe(z.string().email())

// Input vs output types differ after transform
type Input  = z.input<typeof NumberFromString>   // string
type Output = z.output<typeof NumberFromString>  // number
// same as z.infer<> which gives the output
```

---

## Refinements (custom validation)

```ts
// Single refinement
const PasswordSchema = z.string()
  .min(8)
  .refine((val) => /[A-Z]/.test(val), { message: 'Need one uppercase letter' })
  .refine((val) => /[0-9]/.test(val), { message: 'Need one number' })

// Cross-field validation
const SignupSchema = z.object({
  password: z.string().min(8),
  confirm:  z.string(),
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],    // attach error to this field
})

// Async refinement (e.g. check DB)
const EmailSchema = z.string().email().superRefine(async (email, ctx) => {
  const exists = await checkEmailInDb(email)
  if (exists) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Email already in use',
    })
  }
})
```

---

## Record & Map

```ts
// Record — typed key-value object
const CacheSchema = z.record(z.string(), z.number())
type Cache = z.infer<typeof CacheSchema> // Record<string, number>

// Record with enum keys
const ScoreSchema = z.record(z.enum(['win', 'loss', 'draw']), z.number())

// Map
const MapSchema = z.map(z.string(), z.number())
// Map<string, number>

// Set
const TagSetSchema = z.set(z.string())
// Set<string>
```

---

## Error Handling in Detail

```ts
const result = UserSchema.safeParse(data)

if (!result.success) {
  // Flat — great for forms
  const flat = result.error.flatten()
  // {
  //   formErrors: [],          // top-level errors
  //   fieldErrors: {           // per-field errors
  //     email: ['Invalid email'],
  //     name: ['Too short'],
  //   }
  // }

  // Format — nested object
  const formatted = result.error.format()
  // { email: { _errors: ['Invalid email'] }, name: { _errors: [...] } }

  // Raw issues array
  result.error.issues.forEach((issue) => {
    console.log(issue.path)    // ['email']
    console.log(issue.message) // 'Invalid email'
    console.log(issue.code)    // 'invalid_string'
  })
}
```

---

## Real-world Patterns

### API request body validation (with Hono)

```ts
import { z } from 'zod'

const CreatePostSchema = z.object({
  title:     z.string().min(1).max(200).trim(),
  content:   z.string().min(1),
  tags:      z.array(z.string()).max(5).default([]),
  published: z.boolean().default(false),
})

app.post('/posts', async (c) => {
  const result = CreatePostSchema.safeParse(await c.req.json())
  if (!result.success) {
    return c.json({ errors: result.error.flatten().fieldErrors }, 400)
  }
  const post = await db.createPost(result.data)
  return c.json(post, 201)
})
```

### Environment variable validation

```ts
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT:         z.coerce.number().default(3000),
  NODE_ENV:     z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET:   z.string().min(32),
})

export const env = EnvSchema.parse(process.env)
// Now env.PORT is a number, not a string
```

### Shared schema between server and client

```ts
// shared/schemas.ts
export const UserSchema = z.object({
  id:    z.string().uuid(),
  email: z.string().email(),
  name:  z.string(),
  role:  z.enum(['admin', 'user']),
})

export const CreateUserSchema = UserSchema.omit({ id: true })
export const UpdateUserSchema = UserSchema.partial().omit({ id: true })

export type User       = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
```

### PATCH endpoint (partial update)

```ts
const UpdateUserSchema = z.object({
  name:  z.string().min(1).optional(),
  email: z.string().email().optional(),
  role:  z.enum(['admin', 'user']).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field required' }
)
```

---

## Resources

- [Zod Docs](https://zod.dev)
- [GitHub](https://github.com/colinhacks/zod)
- [v4 Migration Guide](https://zod.dev/v4)
- [Zod Playground](https://zod.dev/play)