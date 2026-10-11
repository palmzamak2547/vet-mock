// The Imaging Practical's "recent files" list.
//
// A DICOM file name is often a patient's or an owner's name, so the list lives
// in sessionStorage: the browser drops it with the tab, nothing has to sweep
// it on sign-out, and it never reaches the device storage. It is display-only
// (a File cannot be reopened from a name), so nothing is lost.
//
// Older versions kept the list in localStorage with no expiry.
// dropSavedRecentFiles() removes that copy; the Lab page calls it once when it
// opens. Every call here swallows a storage error: a browser that refuses
// storage (private mode, blocked site data) just shows an empty list.

export const RECENT_KEY = 'vmx-lab-recent-files';
export const RECENT_MAX = 5;

function tabStorage() {
  try { return globalThis.sessionStorage ?? null; } catch { return null; }
}
function deviceStorage() {
  try { return globalThis.localStorage ?? null; } catch { return null; }
}

/** The tab's recent files, newest first. Anything unreadable is an empty list. */
export function readRecentFiles(storage = tabStorage()) {
  try {
    const raw = storage?.getItem(RECENT_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list
      .filter((entry) => entry && typeof entry === 'object' && typeof entry.name === 'string')
      .slice(0, RECENT_MAX);
  } catch {
    return [];
  }
}

/** Keep the list for this tab. An empty list removes the key. */
export function writeRecentFiles(list, storage = tabStorage()) {
  try {
    if (!list || list.length === 0) storage?.removeItem(RECENT_KEY);
    else storage?.setItem(RECENT_KEY, JSON.stringify(list));
  } catch { /* storage refused: the list simply is not kept */ }
}

/** Remove the copy an older version left in the device storage. */
export function dropSavedRecentFiles(storage = deviceStorage()) {
  try { storage?.removeItem(RECENT_KEY); } catch { /* storage refused: nothing to remove */ }
}
