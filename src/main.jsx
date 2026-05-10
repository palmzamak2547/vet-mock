import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { startWebVitals } from './lib/web-vitals.js'

// Begin Core Web Vitals monitoring before React mounts so we capture
// FCP / LCP from the very first paint. Zero deps, zero UI impact —
// just observes performance entries and persists samples to
// localStorage. DashboardView reads + plots these.
startWebVitals()

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

// ── Service worker — true offline + asset caching ─────────────────
// Registered after window.load to avoid contending with first paint.
// New SW versions don't reload mid-session — instead we set a flag
// that App.jsx watches; the next idle/safe moment shows a soft toast
// "อัปเดตใหม่พร้อมแล้ว · กดเพื่อรีเฟรช".
//
// In dev mode we deliberately UNREGISTER any prior SW so HMR works;
// the SW is production-only.
window.addEventListener('load', () => {
  if (!('serviceWorker' in navigator)) return
  if (import.meta.env?.MODE !== 'production') {
    // Dev mode — clear any stale SW so HMR flows freely
    navigator.serviceWorker.getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {})
    return
  }
  navigator.serviceWorker.register('/sw.js').then((reg) => {
    // When a new worker is installed *after* one was already controlling
    // this page, surface an "update available" toast.
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing
      if (!nw) return
      nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          window.dispatchEvent(new CustomEvent('vmx-sw-update'))
        }
      })
    })
  }).catch((err) => {
    console.warn('[sw] registration failed:', err)
  })
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
