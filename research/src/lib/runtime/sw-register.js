// Registers /sw.js (static files only; competitor-gaps.md D4(d)) [M1-DESIGN.md 12]. OWNER: runtime role.
// Rules: register after the first paint, only on https or localhost, never call skipWaiting from the
// page, never reload an open page; a new version takes over on the next visit.

/** @returns {Promise<'registered'|'unsupported'|'skipped'|'failed'>} */
export async function registerServiceWorker() {
  return 'skipped';
}
