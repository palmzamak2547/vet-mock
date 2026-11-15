// localStorage that never throws. A private window, a full disk or blocked site data falls back
// to memory for this page's life, so practice still works; it just is not kept.

const memory = new Map();

// Once a write is refused, the page says so (App.jsx): practice still runs from memory, but a
// student who answered a whole set and reloaded used to find it gone without a word.
let refused = false;
const refusedListeners = new Set();
export const storageRefused = () => refused;
export function onStorageRefused(listener) {
  refusedListeners.add(listener);
  return () => refusedListeners.delete(listener);
}
function markRefused() {
  if (refused) return;
  refused = true;
  for (const l of refusedListeners) l();
}

export function readJSON(key, fallback) {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    if (raw != null) return JSON.parse(raw);
  } catch { /* unreadable or blocked: fall through to memory */ }
  return memory.has(key) ? memory.get(key) : fallback;
}

/** @returns {boolean} whether the value reached storage that outlives the page */
export function writeJSON(key, value) {
  memory.set(key, value);
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
    if (globalThis.localStorage) return true;
  } catch { /* full, blocked or a private window: said on screen below */ }
  markRefused();
  return false;
}

export function removeKey(key) {
  memory.delete(key);
  try { globalThis.localStorage?.removeItem(key); } catch { /* nothing kept there anyway */ }
}

/**
 * A value kept under one key, with subscribers for useSyncExternalStore. Another tab's write
 * arrives through the storage event, so two open tabs never undo each other's answers.
 * @template T
 * @param {string} key
 * @param {T} initial
 * @param {(raw: any) => T} normalize repairs or replaces whatever was stored
 */
export function createStore(key, initial, normalize = (x) => x) {
  let state = normalize(readJSON(key, initial));
  const listeners = new Set();
  const emit = () => { for (const l of listeners) l(); };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key !== key) return;
      state = normalize(readJSON(key, initial));
      emit();
    });
  }
  return {
    key,
    get: () => state,
    set(next) {
      state = typeof next === 'function' ? next(state) : next;
      writeJSON(key, state);
      emit();
      return state;
    },
    reset() {
      removeKey(key);
      state = normalize(initial);
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
