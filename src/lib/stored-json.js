// ============================================================
// stored-json — the one safe way to read a JSON value the app stored
// ============================================================
// A stored value can be missing, unreadable (a cut-off write, the text
// "undefined" from JSON.stringify(undefined)), a JSON null, or of another
// shape than the reader expects. Every one of those reads as `fallback`, so
// no caller dereferences a null: two such reads blanked a screen until
// 11 Nov 2026 (vmx-consent-prefs, the whole app; vmx-quests-streak, Home).
// `accept(value)` narrows the shape further (an object, an array).
// tests/unit/stored-json-readers.test.mjs lists every place that still
// parses a stored value itself; new code reads through this.
// ============================================================

export const isPlainObject = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

/**
 * @param {string} key
 * @param {*} fallback  returned for a missing, corrupt, null or refused value
 * @param {{ accept?: (value: any) => boolean, storage?: Storage }} [options]
 */
export function readStoredJson(key, fallback, { accept, storage } = {}) {
  try {
    const store = storage || globalThis.window?.localStorage;
    const raw = store?.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    if (value === null) return fallback;
    if (accept && !accept(value)) return fallback;
    return value;
  } catch {
    return fallback;
  }
}
