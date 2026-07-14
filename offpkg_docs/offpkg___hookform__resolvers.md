# @hookform/resolvers

> Schema validation adapters for react-hook-form — Zod, Yup, Valibot, Joi, and more  
> **Version:** 5.2.2 · **Runtime:** bun · [npm](https://www.npmjs.com/package/@hookform/resolvers)

---

> ✏️ **This file is yours to edit** — it lives at `~/.offpkg/docs/bun/@hookform/resolvers.md`  
> To regenerate from original: `offpkg docs reset @hookform/resolvers --runtime bun`

---

## My Notes

<!-- Add your own notes, snippets, and team conventions here -->

---

## Install

```bash
bun add @hookform/resolvers

# Plus your chosen validation library
bun add zod        # recommended
bun add yup
bun add valibot
```

---

## Usage Pattern

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'  // swap per library
import * as z from 'zod'

const schema = z.object({ ... })
type FormData = z.infer<typeof schema>

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
})
```

---

## Zod (recommended)

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  age: z.number({ coerce: true }).int().positive(),
})

type FormData = z.infer<typeof schema>

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="number" {...register('age', { valueAsNumber: true })} />
      {errors.age && <p>{errors.age.message}</p>}

      <button type="submit">Submit</button>
    </form>
  )
}
```

---

## Yup

```tsx
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required('Required'),
  age: yup.number().required().positive().integer(),
})

useForm({ resolver: yupResolver(schema) })
```

---

## Valibot

```tsx
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'

const schema = v.object({
  username: v.pipe(v.string(), v.minLength(3, 'Min 3 chars')),
  password: v.pipe(v.string(), v.nonEmpty('Required')),
})

useForm({ resolver: valibotResolver(schema) })
```

---

## Joi

```tsx
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'

const schema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
})

useForm({ resolver: joiResolver(schema) })
```

---

## All Supported Resolvers

| Library | Import path | Type inference |
|---------|-------------|----------------|
| Zod | `/zod` | ✅ |
| Yup | `/yup` | ✅ |
| Valibot | `/valibot` | ✅ |
| Joi | `/joi` | ❌ |
| ArkType | `/arktype` | ✅ |
| TypeBox | `/typebox` | ✅ |
| class-validator | `/class-validator` | ✅ |
| Effect | `/effect-ts` | ✅ |
| io-ts | `/io-ts` | ✅ |
| Superstruct | `/superstruct` | ✅ |
| Vest | `/vest` | ❌ |
| VineJS | `/vine` | ✅ |
| Standard Schema | `/standard-schema` | ✅ |

---

## TypeScript — Input vs Output types

When a schema transforms values (e.g. coerces strings to numbers):

```tsx
useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
  resolver: zodResolver(schema),
})
// input type = what the form field receives (string from <input>)
// output type = what handleSubmit receives after transformation (number)
```

---

## Resources

- [GitHub](https://github.com/react-hook-form/resolvers)
- [npm](https://www.npmjs.com/package/@hookform/resolvers)
- [react-hook-form docs](https://react-hook-form.com/docs/useform#resolver)