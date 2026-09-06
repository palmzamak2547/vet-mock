import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { startWebVitals } from './lib/web-vitals.js'
import { unlockAudio } from './lib/audio-unlock.js'
import { applyIdMigration } from './lib/id-migration.js'

import './lib/dom-compat.js'
import './lib/app-lifecycle.js'

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
