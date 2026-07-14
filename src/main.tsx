import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider } from '@/providers/QueryProvider.tsx'
import { SupabaseAuthProvider } from '@/providers/SupabaseAuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <SupabaseAuthProvider>
        <App />
      </SupabaseAuthProvider>
    </QueryProvider>
  </StrictMode>,
)
