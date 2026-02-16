import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import './index.css'

console.log('[app] startup')

// Global fetch logger for API calls.
const originalFetch = globalThis.fetch
globalThis.fetch = async (...args) => {
  const [input, init] = args
  const start = performance.now()
  console.log('[api] request', input, init)
  try {
    const response = await originalFetch(...args)
    const durationMs = (performance.now() - start).toFixed(1)
    console.log('[api] response', response.status, response.url, `${durationMs}ms`)
    return response
  } catch (error) {
    const durationMs = (performance.now() - start).toFixed(1)
    console.error('[api] error', input, `${durationMs}ms`, error)
    throw error
  }
}

// Global form submit logger.
window.addEventListener('submit', (event) => {
  const target = event.target
  if (target instanceof HTMLFormElement) {
    const action = target.getAttribute('action') ?? '(no action)'
    console.log('[form] submit', action, target)
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
