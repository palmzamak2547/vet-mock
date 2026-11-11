// First: supplies .at(), Object.hasOwn and AbortSignal.timeout on iOS 14-15 before any module uses them.
import './lib/platform-compat.js'
// Inside the Android app, window.VetMockApp and the WebView's missing APIs (lib/native-app.js) are in place
// before the app starts. Only the check is on the first load; a browser never fetches the rest.
import { IS_APP } from './lib/native-detect.js'
// Study data carried over from vetmock.vercel.app is merged before anything reads it. The merge
// (lib/origin-move.js) loads only on a boot that has move work (lib/move-gate.js), and then the app
// starts after it; nearly every boot has none and starts at once, as before.
import { dueMoveJobs, moveWork, startWhenReady } from './lib/move-gate.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { startWebVitals } from './lib/web-vitals.js'
import { unlockAudio } from './lib/audio-unlock.js'
import { applyIdMigration } from './lib/id-migration.js'

import './lib/dom-compat.js'
import './lib/app-lifecycle.js'
import './lib/install-prompt.js'
import { applyMotionPreference, subscribeMotionPreferences } from './lib/motion-preferences.js'

// Everything that reads the student's stored data, in the order it always ran.
function startApp() {
  applyMotionPreference()
  const stopMotionSync = subscribeMotionPreferences(applyMotionPreference)
  if (import.meta.hot) import.meta.hot.dispose(stopMotionSync)

  // One-time migration of user-stored Q IDs after the 2026-05-13 renumber
  // of 165 cross-subject ID collisions. Runs once per browser (gated by
  // `vmx-id-migration-v1` flag). No-op for users who never had history.
  applyIdMigration()

  // index.html's bridge is handing this learner's data to vetmock.com: no app on this page.
  if (!window.__vmxMoving) ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

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

// What must be in place before the app starts: the app layer inside the
// Android app, and a move's inbox merge. If either cannot load, the app starts
// without it, as a failed lazy screen leaves the rest of the app: the inbox
// stays in localStorage for the next boot and the old address keeps its copy;
// the app runs as a browser page does.
// A chunk that stalls instead of failing gets MOVE_WAIT_MS: then the app starts
// and window.__vmxMoveSkip tells origin-move.js, should it still arrive, not to
// merge under a store that has already read the data. On the 'later' path the
// app is already running, so the flag is set before the module is asked for.
// The module runs the jobs this boot's answer named (window.__vmxMoveDue), not a
// second reading of storage. Neither a timeout nor a reload counts as a try.
const before = []
if (IS_APP) before.push(import('./lib/native-app.js').catch(() => {}))
const moveDue = dueMoveJobs(window)
window.__vmxMoveDue = [...moveDue]
const move = moveWork(window, Date.now(), moveDue)
if (move === 'now') {
  before.push(import('./lib/origin-move.js').catch(() => {}))
} else if (move === 'later') {
  window.__vmxMoveSkip = true
  import('./lib/origin-move.js').catch(() => {})
}
startWhenReady(before, startApp, { onLate: () => { window.__vmxMoveSkip = true } })
