# vite

> Next-generation frontend build tool — instant dev server, fast HMR, optimized builds  
> **Version:** 8.0.1 · **Runtime:** bun · [npm](https://www.npmjs.com/package/vite) · [Docs](https://vite.dev)

---

> ✏️ **This file is yours to edit** — it lives at `~/.offpkg/docs/bun/vite.md`  
> To regenerate from original: `offpkg docs reset vite --runtime bun`

---

## My Notes

<!-- Add your own notes, snippets, and team conventions here -->

---

## Install

```bash
# Scaffold a new project
bun create vite my-app --template react-ts

# Add to existing project
bun add -d vite @vitejs/plugin-react
```

## Templates

```bash
bun create vite my-app --template react-ts      # React + TypeScript
bun create vite my-app --template react         # React + JS
bun create vite my-app --template vue-ts
bun create vite my-app --template svelte-ts
bun create vite my-app --template vanilla-ts
```

---

## Config (`vite.config.ts`)

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    open: true,               // auto-open browser
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',        // 'esbuild' | 'terser' | false
    target: 'es2020',
    chunkSizeWarningLimit: 1000, // KB
  },

  preview: {
    port: 4173,
  },
})
```

---

## CLI Commands

```bash
bun run dev        # start dev server (HMR enabled)
bun run build      # production build → dist/
bun run preview    # preview production build locally
bun run vite       # same as dev
```

---

## Environment Variables

Vite exposes env vars prefixed with `VITE_` to client code:

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=MyApp
```

```ts
// Access in code
const apiUrl = import.meta.env.VITE_API_URL
const isDev = import.meta.env.DEV          // boolean
const isProd = import.meta.env.PROD        // boolean
const mode = import.meta.env.MODE         // 'development' | 'production'
```

### Multiple `.env` files

```
.env                  # always loaded
.env.local            # always loaded, gitignored
.env.development      # loaded in dev mode
.env.production       # loaded in build mode
.env.production.local # loaded in build mode, gitignored
```

---

## Path Aliases (`@/`)

```ts
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

```json
// tsconfig.json — must match
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```ts
// Usage
import { Button } from '@/components/Button'
import { api } from '@/lib/api'
```

---

## Plugins

```bash
bun add -d @vitejs/plugin-react          # React + Fast Refresh
bun add -d @vitejs/plugin-react-swc      # React + SWC (faster)
bun add -d @tailwindcss/vite             # Tailwind v4
bun add -d vite-plugin-svgr              # import SVG as React components
bun add -d vite-tsconfig-paths           # auto-read tsconfig paths
```

```ts
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

plugins: [react(), svgr(), tsconfigPaths(), tailwindcss()]
```

---

## Static Assets

```ts
// Import image — returns URL string
import logo from './assets/logo.png'
<img src={logo} />

// Raw file content
import readme from './README.md?raw'

// SVG as component (requires vite-plugin-svgr)
import Logo from './logo.svg?react'
<Logo className="w-8 h-8" />

// Public folder — served at root, never processed
// Put in /public/ → reference as /logo.png
```

---

## Build Output

```bash
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # main bundle
│   ├── vendor-[hash].js     # auto code-split chunk
│   └── index-[hash].css
```

### Manual chunks

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'query': ['@tanstack/react-query'],
      },
    },
  },
},
```

---

## Resources

- [Vite Docs](https://vite.dev/guide/)
- [Config Reference](https://vite.dev/config/)
- [Plugins](https://vite.dev/plugins/)
- [GitHub](https://github.com/vitejs/vite)