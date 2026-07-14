# react-hook-form

> Performant, flexible form library for React using hooks  
> **Version:** 7.72.0 · **Runtime:** bun · [npm](https://www.npmjs.com/package/react-hook-form) · [Docs](https://react-hook-form.com)

---

> ✏️ **This file is yours to edit** — it lives at `~/.offpkg/docs/bun/react-hook-form.md`  
> To regenerate from original: `offpkg docs reset react-hook-form --runtime bun`

---

## My Notes

<!-- Add your own notes, snippets, and team conventions here -->

---

## Install

```bash
bun add react-hook-form
```

---

## Usage

```tsx
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: 'Email is required' })} />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register('password', { minLength: { value: 8, message: 'Min 8 chars' } })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

---

## `register` — Validation Rules

```tsx
register('field', {
  required: 'This field is required',
  minLength: { value: 3, message: 'Min 3 characters' },
  maxLength: { value: 100, message: 'Max 100 characters' },
  min: { value: 0, message: 'Must be positive' },
  max: { value: 99, message: 'Max 99' },
  pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
  validate: (value) => value !== 'admin' || 'Username "admin" not allowed',
  validate: {
    notEmpty: (v) => v.trim().length > 0 || 'Cannot be blank',
    noSpaces: (v) => !v.includes(' ') || 'No spaces allowed',
  },
})
```

---

## `useForm` Options

```ts
const form = useForm<FormData>({
  defaultValues: {
    email: '',
    password: '',
  },
  mode: 'onSubmit',       // when to validate: 'onSubmit' | 'onBlur' | 'onChange' | 'all'
  reValidateMode: 'onChange',
  shouldFocusError: true,
  criteriaMode: 'firstError',  // 'all' to collect all errors per field
})
```

---

## `formState`

```ts
const { formState } = useForm()

formState.errors           // validation errors by field name
formState.isSubmitting     // true while handleSubmit is running
formState.isSubmitted      // true after first submit
formState.isDirty          // true if any field was changed
formState.isValid          // true if no errors
formState.touchedFields    // fields the user has interacted with
formState.dirtyFields      // fields that differ from defaultValues
```

---

## Utility Methods

```ts
const { reset, setValue, getValues, watch, setError, clearErrors, trigger } = useForm()

// Reset form to defaultValues (or new values)
reset()
reset({ email: 'new@example.com' })

// Set a field value
setValue('email', 'user@example.com')
setValue('email', 'user@example.com', { shouldValidate: true, shouldDirty: true })

// Get current values
const values = getValues()
const email = getValues('email')

// Watch field(s) for re-rendering
const email = watch('email')
const [email, password] = watch(['email', 'password'])

// Set a manual error
setError('email', { type: 'manual', message: 'Email already taken' })

// Trigger validation manually
await trigger()           // all fields
await trigger('email')    // specific field
```

---

## `Controller` — For UI Library Inputs

Use `Controller` when wrapping third-party components (Select, DatePicker, etc.):

```tsx
import { useForm, Controller } from 'react-hook-form'

<Controller
  name="country"
  control={control}
  rules={{ required: true }}
  render={({ field }) => (
    <Select {...field} options={countryOptions} />
  )}
/>
```

---

## Schema Validation (with Zod)

```bash
bun add @hookform/resolvers zod
```

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof schema>

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
})
```

---

## Resources

- [Official Docs](https://react-hook-form.com)
- [API Reference](https://react-hook-form.com/docs)
- [Resolvers (Zod, Yup, Joi...)](https://github.com/react-hook-form/resolvers)