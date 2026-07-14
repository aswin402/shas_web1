# axios

> Promise-based HTTP client for the browser and Node.js  
> **Version:** 1.9.0 · **Runtime:** bun · [npm](https://www.npmjs.com/package/axios) · [Docs](https://axios-http.com/docs/intro)

---

> ✏️ **This file is yours to edit** — it lives at `~/.offpkg/docs/bun/axios.md`  
> Every project you add axios to will use YOUR version of this file.  
> To regenerate from original: `offpkg docs reset axios --runtime bun`

---

## My Notes

<!-- Add your own notes, snippets, and team conventions here -->

---

## Install

```bash
bun add axios
```

## Import

```js
import axios from 'axios'

// Named imports
import axios, { isCancel, AxiosError } from 'axios'

// CommonJS
const axios = require('axios')
```

---

## Usage

### GET

```js
// Simple
const res = await axios.get('/users?id=1')
console.log(res.data)

// With params
const res = await axios.get('/users', { params: { id: 1 } })

// Async/await with error handling
try {
  const res = await axios.get('/users/1')
  console.log(res.data)
} catch (err) {
  console.error(err)
}
```

### POST

```js
const res = await axios.post('/users', {
  name: 'John',
  email: 'john@example.com'
})
```

### PUT / PATCH / DELETE

```js
await axios.put('/users/1', { name: 'Updated' })
await axios.patch('/users/1', { name: 'Patched' })
await axios.delete('/users/1')
```

### Generic config-based call

```js
await axios({
  method: 'post',
  url: '/users',
  data: { name: 'John' }
})
```

### Concurrent requests

```js
const [users, posts] = await Promise.all([
  axios.get('/users'),
  axios.get('/posts')
])
```

---

## Creating an Instance

Use instances to avoid repeating `baseURL`, headers, or timeouts across requests.

```js
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: { 'Authorization': `Bearer ${TOKEN}` }
})

// Use it like the global axios
const res = await api.get('/users')
```

---

## Request Config

Only `url` is required. All other fields are optional.

```js
{
  url: '/users',
  method: 'get',                          // default
  baseURL: 'https://api.example.com',
  headers: { 'X-Custom': 'value' },
  params: { id: 1 },                      // appended to URL as query string
  data: { name: 'John' },                 // request body (POST/PUT/PATCH/DELETE)
  timeout: 5000,                          // ms — 0 means no timeout (default)
  responseType: 'json',                   // 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
  withCredentials: false,                 // send cookies with cross-site requests
  maxRedirects: 5,
  auth: {
    username: 'user',
    password: 'pass'
  },
  validateStatus: (status) => status < 500  // customize which status codes reject
}
```

---

## Response Schema

```js
const res = await axios.get('/users/1')

res.data        // parsed response body
res.status      // HTTP status code (e.g. 200)
res.statusText  // HTTP status message (e.g. "OK")
res.headers     // response headers
res.config      // the config used for the request
res.request     // the underlying request object
```

---

## Config Defaults

Set defaults applied to every request globally or per-instance.

```js
// Global defaults
axios.defaults.baseURL = 'https://api.example.com'
axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`

// Instance defaults
const api = axios.create({ baseURL: 'https://api.example.com' })
api.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`
```

**Precedence (highest to lowest):**  
per-request config → instance defaults → global defaults

---

## Interceptors

Run logic before every request is sent or after every response is received.

```js
const api = axios.create()

// Request interceptor — runs before the request
api.interceptors.request.use(
  (config) => {
    config.headers['X-Request-Time'] = Date.now()
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — runs after the response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // handle token refresh or redirect
    }
    return Promise.reject(error)
  }
)
```

**Remove an interceptor:**

```js
const id = api.interceptors.request.use(fn)
api.interceptors.request.eject(id)
```

**Clear all interceptors:**

```js
api.interceptors.request.clear()
api.interceptors.response.clear()
```

> **Note:** Request interceptors run in **reverse order** (LIFO).  
> Response interceptors run in **insertion order** (FIFO).

---

## Error Handling

```js
try {
  await axios.get('/users/1')
} catch (err) {
  if (err.response) {
    // Server responded with a non-2xx status
    console.log(err.response.status)
    console.log(err.response.data)
  } else if (err.request) {
    // Request was made but no response received
    console.log('No response received')
  } else {
    // Error setting up the request
    console.log(err.message)
  }
}
```

**Common error codes:**

| Code | Meaning |
|------|---------|
| `ERR_NETWORK` | Network failure or CORS issue |
| `ECONNABORTED` | Request timed out or was aborted |
| `ETIMEDOUT` | Timeout (when `clarifyTimeoutError: true`) |
| `ERR_CANCELED` | Manually canceled via AbortController |
| `ERR_BAD_REQUEST` | 4xx response |
| `ERR_BAD_RESPONSE` | 5xx or unparseable response |
| `ERR_INVALID_URL` | Malformed URL |

---

## Timeouts

```js
try {
  const res = await axios.get('/slow-endpoint', { timeout: 5000 })
} catch (err) {
  if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
    console.error('Request timed out')
  }
}
```

---

## Cancellation

Use the native `AbortController` (recommended):

```js
const controller = new AbortController()

axios.get('/users', { signal: controller.signal })
  .then(res => console.log(res.data))
  .catch(err => {
    if (axios.isCancel(err)) console.log('Canceled')
  })

// Cancel the request
controller.abort()
```

---

## Form Data

### URL-encoded (`application/x-www-form-urlencoded`)

```js
const params = new URLSearchParams({ foo: 'bar', baz: '123' })
await axios.post('/submit', params)
```

**Auto-serialization** — set the content-type header and axios handles the rest:

```js
await axios.post('/submit', { foo: 'bar' }, {
  headers: { 'content-type': 'application/x-www-form-urlencoded' }
})
```

### Multipart (`multipart/form-data`)

```js
const form = new FormData()
form.append('name', 'John')
form.append('file', fileInput.files[0])
await axios.post('/upload', form)
```

**Auto-serialization:**

```js
await axios.post('/upload', { name: 'John' }, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

**Shorthand methods:** `axios.postForm`, `axios.putForm`, `axios.patchForm`

```js
await axios.postForm('/upload', { file: fileInput.files[0] })
```

---

## Upload / Download Progress

```js
await axios.post('/upload', data, {
  onUploadProgress: ({ progress, rate, estimated }) => {
    console.log(`${(progress * 100).toFixed(1)}% — ${(rate / 1024).toFixed(1)} KB/s`)
  },
  onDownloadProgress: ({ progress }) => {
    console.log(`Download: ${(progress * 100).toFixed(1)}%`)
  }
})
```

> Progress events are throttled to **3 times per second**.

---

## Rate Limiting *(Node.js only)*

```js
await axios.post('/upload', buffer, {
  maxRate: [100 * 1024, 100 * 1024]  // [uploadLimit, downloadLimit] in bytes/s
})
```

---

## Headers (`AxiosHeaders`)

```js
// Inside a request interceptor
config.headers.set('Authorization', `Bearer ${token}`)
config.headers.setContentType('application/json')

// Disable a header
config.headers.set('User-Agent', false)
```

---

## TypeScript

```ts
import axios, { AxiosResponse, AxiosError } from 'axios'

interface User {
  id: number
  name: string
}

const res: AxiosResponse<User> = await axios.get<User>('/users/1')
console.log(res.data.name)
```

---

## Proxy *(Node.js only)*

```js
await axios.get('/data', {
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: { username: 'user', password: 'pass' }
  }
})
```

---

## Resources

- [Official Docs](https://axios-http.com/docs/intro)
- [GitHub](https://github.com/axios/axios)
- [Changelog](https://github.com/axios/axios/blob/main/CHANGELOG.md)