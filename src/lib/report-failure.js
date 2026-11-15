// Tell the owner that something a student did failed: a save that did not
// stick, a sync that did not go through, a screen that did not load, a list
// that could not be read. client-diagnostics.js counts each one (no identity,
// the message scrubbed) and /app/admin shows the last 24 hours.
//
// This file imports nothing, so any module can call it without growing a
// chunk. It never throws and never waits.
export const FAILURE_EVENT = 'vmx-failure';

export function reportFailure(kind, error, target = globalThis.window) {
  try {
    if (!target?.dispatchEvent || typeof CustomEvent !== 'function') return;
    const detail = {
      kind,
      name: (error && typeof error === 'object' && error.name) || 'Error',
      message: typeof error === 'string' ? error : (error && error.message) || '',
    };
    target.dispatchEvent(new CustomEvent(FAILURE_EVENT, { detail }));
  } catch { /* reporting a failure must never become one */ }
}
