import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ── Stale-chunk recovery ───────────────────────────────────────────
// After a Vercel deploy, an open browser tab still has the OLD
// index.html which references chunks with the OLD hash. When the
// user navigates and a lazy chunk is requested, the file is gone
// (404) → "Failed to fetch dynamically imported module" error and
// the app crashes to the ErrorBoundary fallback.
//
// Vite emits a `vite:preloadError` event for this exact case. We
// auto-reload the page once so the user gets the latest index.html
// + new chunk hashes. Use sessionStorage to avoid an infinite reload
// loop if the chunk really is broken.
window.addEventListener('vite:preloadError', (event) => {
  const reloadKey = 'vmx-chunk-reload'
  if (sessionStorage.getItem(reloadKey) === '1') {
    // Already tried once this session — don't reload again
    console.error('[chunk] preload failed twice — letting ErrorBoundary handle:', event?.payload)
    return
  }
  sessionStorage.setItem(reloadKey, '1')
  console.warn('[chunk] preload failed — reloading for fresh deploy:', event?.payload?.message)
  // Prevent default so React doesn't see the error first
  event.preventDefault?.()
  window.location.reload()
})

// Clear the reload flag once the app loads successfully
window.addEventListener('load', () => {
  // Wait a beat in case lazy-loads happen on first paint
  setTimeout(() => sessionStorage.removeItem('vmx-chunk-reload'), 3000)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
