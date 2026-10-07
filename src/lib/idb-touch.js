// ============================================================
// idb-touch — one localStorage key that moves whenever IndexedDB study data does
// ============================================================
// The old address's bridge (index.html) decides whether there is anything new
// to carry to vetmock.com by hashing localStorage, which cannot see IndexedDB.
// PDF ink, a reading position and study events live only there, so each write
// to those stores bumps this counter, and a change made only there still
// counts as new data for the next move. One short value, written in place.
// ============================================================

export const IDB_TOUCH_KEY = 'vmx-idb-touched';

export function touchStudyStores() {
  try {
    const storage = globalThis.localStorage ?? globalThis.window?.localStorage;
    if (!storage) return;
    storage.setItem(IDB_TOUCH_KEY, String((Number(storage.getItem(IDB_TOUCH_KEY)) || 0) + 1));
  } catch { /* full or blocked storage: the next write tries again */ }
}
