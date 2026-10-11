// ============================================================
// install-prompt.js — catches the browser's install offer once, at boot
// ============================================================
// Chrome, Edge and Samsung Internet raise `beforeinstallprompt` ONCE per page
// load, usually while Home is on screen. A chip that only starts listening
// when it mounts (the profile hub's, mounted when โปรไฟล์ is tapped) hears
// nothing and renders nothing. So the event is caught here, from import time,
// kept, and handed to any chip that asks, whenever it mounts.
//
// main.jsx imports this file for its side effect and nothing else.
//
// The event can be used once: prompt() on a spent event throws. The chip
// therefore clears the store as it calls prompt(), and the browser's own
// next `beforeinstallprompt` (after a dismissal) replaces it.
// ============================================================

let deferred = null;
const listeners = new Set();

function notify() {
  for (const listener of [...listeners]) {
    try { listener(deferred); } catch { /* one bad subscriber must not mute the rest */ }
  }
}

/** The held install event, or null when there is none to offer. */
export function getInstallPrompt() {
  return deferred;
}

/** Calls `listener` whenever the held event changes. Returns the unsubscribe. */
export function subscribeInstallPrompt(listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Drops the held event (after prompt(), or once the app is installed). */
export function clearInstallPrompt() {
  if (deferred === null) return;
  deferred = null;
  notify();
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Hold back the browser's own banner so the chip can offer the install.
    event.preventDefault();
    deferred = event;
    notify();
  });
  window.addEventListener('appinstalled', clearInstallPrompt);
}
