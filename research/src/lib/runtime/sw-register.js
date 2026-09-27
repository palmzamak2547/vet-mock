// Registers /sw.js (static files only; competitor-gaps.md D4(d)) [M1-DESIGN.md 12]. OWNER: runtime role.
// Rules: register after the first paint, only on https or localhost, never call skipWaiting from the
// page, never reload an open page; a new version takes over on the next visit.

/**
 * The worker precaches the whole Studio (about 4.6 MB: the engine, the spreadsheet reader, the
 * workspace). A reader of the front door who never opens the Studio should not pay that, so it is
 * installed on the first visit to /app or /licenses, not on the landing (review round 1).
 * @param {string} pathname
 */
export function wantsServiceWorker(pathname) {
  return /^\/(app|licenses)(\/|$)/.test(String(pathname || ''));
}

/**
 * Register once the page is on a Studio route: now, or on the first in-app navigation there.
 * @param {() => Promise<unknown>} register
 * @param {{ location: Location, addEventListener: Window['addEventListener'], removeEventListener: Window['removeEventListener'] }} [win]
 */
export function registerWhenInStudio(register = registerServiceWorker, win = globalThis.window) {
  if (!win) return;
  if (wantsServiceWorker(win.location?.pathname)) { register(); return; }
  const check = () => {
    if (!wantsServiceWorker(win.location?.pathname)) return;
    win.removeEventListener('rs:navigate', check);
    win.removeEventListener('popstate', check);
    register();
  };
  win.addEventListener('rs:navigate', check);
  win.addEventListener('popstate', check);
}

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
