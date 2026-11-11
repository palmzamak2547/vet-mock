// Ask the browser, once, to keep this site's storage.
//
// Flashcards, cloze and image-occlusion decks, the pinboard, video notes,
// clips a student added, watch history and notebooks live only on the device
// (local-extras.js, notebook.js). Without a persistent-storage grant the
// browser may clear them when the device runs short of space, and Safari
// clears script-written storage of a site not visited for a while.
//
// The ask happens at the moment it means something, the first time a student
// saves something of their own, and only once per device: a refusal is
// remembered, never repeated, and nothing is shown either way.

const ASKED_KEY = 'vmx-persist-asked';
let pending = null;

function askedBefore(storage) {
  try { return storage?.getItem(ASKED_KEY) === '1'; } catch { return true; }
}

function remember(storage) {
  try { storage?.setItem(ASKED_KEY, '1'); } catch { /* storage full or blocked: asking again later is harmless */ }
}

/**
 * Resolves to true when storage is (now) persistent, false otherwise. Never
 * throws and never asks twice on one device.
 */
export function keepDeviceWork({ nav = globalThis.navigator, storage = globalThis.localStorage } = {}) {
  if (pending) return pending;
  const api = nav?.storage;
  if (!api || typeof api.persist !== 'function' || askedBefore(storage)) return Promise.resolve(false);
  pending = (async () => {
    try {
      if (typeof api.persisted === 'function' && await api.persisted()) return true;
      return (await api.persist()) === true;
    } catch {
      return false;
    } finally {
      remember(storage);
    }
  })();
  return pending;
}

/** Tests only. */
export function resetKeepDeviceWork() { pending = null; }
