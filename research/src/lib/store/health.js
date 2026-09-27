// Storage health shown to the student [M1-DESIGN.md 9.6]. OWNER: runtime role.

/**
 * @param {{ mode?: 'idb'|'memory', storage?: StorageManager|null, userAgent?: string, standalone?: boolean }} [opts]
 *   mode comes from the opened database; the rest is injectable for tests
 * @returns {Promise<{ mode: 'idb'|'memory', usage: number|null, quota: number|null, persisted: boolean|null, safariEviction: boolean }>}
 *   safariEviction: true on Safari outside an installed web app (seven-day rule), so the UI nudges a download.
 */
export async function storageHealth(opts = {}) {
  const storage = 'storage' in opts ? opts.storage : globalThis.navigator?.storage || null;
  let usage = null;
  let quota = null;
  let persisted = null;
  try {
    const est = storage?.estimate ? await storage.estimate() : null;
    if (est && typeof est.usage === 'number') usage = est.usage;
    if (est && typeof est.quota === 'number') quota = est.quota;
  } catch { /* unknown */ }
  try {
    persisted = storage?.persisted ? await storage.persisted() : null;
  } catch { /* unknown */ }
  const ua = opts.userAgent ?? globalThis.navigator?.userAgent ?? '';
  const standalone = opts.standalone ?? isStandalone();
  return { mode: opts.mode || 'idb', usage, quota, persisted, safariEviction: isSafari(ua) && !standalone && persisted !== true };
}

/** WebKit Safari (desktop or iOS), not Chrome, Edge, Firefox or an in-app Android browser. */
export function isSafari(ua) {
  return /AppleWebKit/.test(ua) && /Safari/.test(ua) && !/(Chrome|Chromium|CriOS|FxiOS|EdgiOS|Edg|OPR|Android)/.test(ua);
}

function isStandalone() {
  try {
    return Boolean(globalThis.matchMedia?.('(display-mode: standalone)').matches || globalThis.navigator?.standalone);
  } catch {
    return false;
  }
}

/** Ask the browser to keep this site's data. Only from an explicit button. @returns {Promise<boolean|null>} */
export async function requestPersistence() {
  try {
    return globalThis.navigator?.storage?.persist ? await globalThis.navigator.storage.persist() : null;
  } catch {
    return null;
  }
}
