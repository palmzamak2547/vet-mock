// Registers /sw.js (static files only; competitor-gaps.md D4(d)) [M1-DESIGN.md 12]. OWNER: runtime role.
// Rules: register after the first paint, only on https or localhost, never call skipWaiting from the
// page, never reload an open page; a new version takes over on the next visit.

/** Hosts where a service worker may run without https. */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * @param {{ location?: Location, navigator?: Navigator, dev?: boolean }} [env]  injectable for tests
 * @returns {Promise<'registered'|'unsupported'|'skipped'|'failed'>}
 */
export async function registerServiceWorker(env = {}) {
  const loc = env.location || globalThis.location;
  const nav = env.navigator || globalThis.navigator;
  const dev = env.dev ?? Boolean(import.meta.env?.DEV);
  if (dev) return 'skipped';
  if (!nav || !('serviceWorker' in nav)) return 'unsupported';
  if (!loc || !(loc.protocol === 'https:' || LOCAL_HOSTS.has(loc.hostname))) return 'skipped';
  try {
    await nav.serviceWorker.register('/sw.js', { scope: '/', type: 'classic', updateViaCache: 'none' });
    return 'registered';
  } catch {
    return 'failed';
  }
}
