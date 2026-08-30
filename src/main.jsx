import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { startWebVitals } from './lib/web-vitals.js'
import { unlockAudio } from './lib/audio-unlock.js'
import { applyIdMigration } from './lib/id-migration.js'

// ── Survive DOM mutation by things outside the app ──────────────────
// React assumes it owns the nodes it created. Google Translate does not:
// on a Thai-language page Chrome readily offers to translate, and doing so
// rewraps text nodes in <font> elements. When React later tries to remove or
// reorder a node it no longer physically owns, the DOM throws
//   "Failed to execute 'removeChild' on 'Node': The node to be removed is
//    not a child of this node"
// and the error escapes React's render, taking the view down with it —
// a white screen for something the student did in their own browser chrome.
// Browser extensions that inject into the page do the same thing.
//
// Making these two operations no-ops when the node is not actually a child
// turns a crash into a cosmetic mismatch that the next render repairs. It
// does NOT block translation, which is the student's choice to make.
// Same defence Tipjai carries for the same reason.
if (typeof Node === 'function' && Node.prototype) {
  const nativeRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) return child
    return nativeRemoveChild.apply(this, arguments)
  }
  const nativeInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) return newNode
    return nativeInsertBefore.apply(this, arguments)
  }
}

// One-time migration of user-stored Q IDs after the 2026-05-13 renumber
// of 165 cross-subject ID collisions. Runs once per browser (gated by
// `vmx-id-migration-v1` flag). No-op for users who never had history.
applyIdMigration()

// Begin Core Web Vitals monitoring before React mounts so we capture
// FCP / LCP from the very first paint. Zero deps, zero UI impact —
// just observes performance entries and persists samples to
// localStorage. DashboardView reads + plots these.
startWebVitals()

// iOS audio gesture unlock — install a one-time listener on the first
// pointer/keyboard interaction with the page. Once fired, the audio
// subsystem is "unlocked" for the entire session, so later async
// TTS / Edge-proxy playback works even after await boundaries.
// Without this, iOS Safari silently blocks the first 🔊 tap.
const _unlockOnce = () => {
  unlockAudio()
  window.removeEventListener('pointerdown', _unlockOnce, true)
  window.removeEventListener('keydown', _unlockOnce, true)
  window.removeEventListener('touchstart', _unlockOnce, true)
}
window.addEventListener('pointerdown', _unlockOnce, { capture: true, passive: true })
window.addEventListener('keydown', _unlockOnce, { capture: true, passive: true })
window.addEventListener('touchstart', _unlockOnce, { capture: true, passive: true })

// ── Stale-chunk recovery ───────────────────────────────────────────
// After a Vercel deploy, an open browser tab still has the OLD
// index.html which references chunks with the OLD hash. When the
// user navigates and a lazy chunk is requested, the file is gone
// (404) → "Failed to fetch dynamically imported module" error and
// the app crashes to the ErrorBoundary fallback.
//
// Vite emits a `vite:preloadError` event for this exact case. Outside an
// exam we reload once for fresh hashes. During an exam we defer the update
// and surface status so in-progress answers are never interrupted.
window.addEventListener('vite:preloadError', (event) => {
  const reloadKey = 'vmx-chunk-reload'
  const deferredKey = 'vmx-update-deferred'
  const activeView = window.history.state?.vmxView
  const examActive = activeView === 'exam'

  if (examActive) {
    event.preventDefault?.()
    const detail = {
      state: 'deferred',
      reason: 'preload-error',
      message: event?.payload?.message || 'A newer app version is ready',
    }
    window.__VMX_UPDATE_STATUS__ = detail
    document.documentElement.dataset.vmxUpdateStatus = 'deferred'
    sessionStorage.setItem(deferredKey, '1')
    window.dispatchEvent(new CustomEvent('vmx-update-deferred', { detail }))
    window.dispatchEvent(new CustomEvent('vmx-sw-update', { detail }))
    console.warn('[chunk] preload failed during exam - update deferred:', detail.message)
    return
  }

  // A lazy chunk can fail because the device is genuinely offline, not
  // because a deploy replaced its hash. Let the importing component receive
  // that rejection so it can show its own retry UI; reloading here only throws
  // the student back to Home and cannot restore connectivity.
  if (navigator.onLine === false) {
    console.warn('[chunk] preload failed while offline — leaving retry to the current view')
    return
  }

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
  setTimeout(() => {
    sessionStorage.removeItem('vmx-chunk-reload')
    sessionStorage.removeItem('vmx-update-deferred')
  }, 3000)
})

// ── Service worker — true offline + asset caching ─────────────────
// Registered after window.load to avoid contending with first paint.
// New SW versions don't reload mid-session — instead we set a flag
// that App.jsx watches; the next idle/safe moment shows a soft toast
// "อัปเดตใหม่พร้อมแล้ว · กดเพื่อรีเฟรช".
//
// In dev mode we deliberately UNREGISTER any prior SW so HMR works;
// the SW is production-only.
let waitingWorker = null
let reloadAfterActivation = false

// Ask a worker which build it is, so the UI can tell a genuinely new update
// apart from the one the user already said no to. Resolves to null rather than
// hanging if the worker does not answer.
const workerVersion = (worker) => new Promise((resolve) => {
  if (!worker) return resolve(null)
  let done = false
  const finish = (v) => { if (!done) { done = true; resolve(v) } }
  try {
    const ch = new MessageChannel()
    ch.port1.onmessage = (e) => finish(e.data?.version || null)
    setTimeout(() => finish(null), 1500)
    worker.postMessage('GET_VERSION', [ch.port2])
  } catch { finish(null) }
})

const announceWaitingWorker = async (worker) => {
  if (!worker || !navigator.serviceWorker.controller) return
  waitingWorker = worker
  // A waiting worker stays waiting until the user acts, and this runs on every
  // page load — so without a version to key on, the same pending update
  // re-announced itself every single load and the banner looked broken.
  const version = await workerVersion(worker)
  const detail = { state: 'ready', reason: 'service-worker', version }
  window.__VMX_UPDATE_STATUS__ = detail
  document.documentElement.dataset.vmxUpdateStatus = 'ready'
  window.dispatchEvent(new CustomEvent('vmx-sw-update', { detail }))
}

const activateWaitingWorker = (reloadWhenReady = false) => {
  if (!waitingWorker) return
  reloadAfterActivation = reloadAfterActivation || reloadWhenReady
  waitingWorker.postMessage('SKIP_WAITING')
}

// Existing update UI refreshes with location.reload(). Translate that
// explicit unload into SKIP_WAITING without changing the active view.
window.addEventListener('beforeunload', () => activateWaitingWorker(false))
window.addEventListener('pagehide', () => activateWaitingWorker(false))
window.addEventListener('vmx-sw-apply-update', () => activateWaitingWorker(true))

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!reloadAfterActivation) return
    reloadAfterActivation = false
    window.location.reload()
  })
}

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
    // A worker may already be waiting when this tab opens.
    announceWaitingWorker(reg.waiting)

    // When a new worker is installed *after* one was already controlling
    // this page, surface an "update available" toast.
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing
      if (!nw) return
      nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          announceWaitingWorker(reg.waiting || nw)
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
