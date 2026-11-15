// ============================================================
// pass.js: a trial link's code on this device (docs/CHULA-SIGNIN.md, "Trial links")
// ============================================================
// A trial link is this page's address with ?pass=<code>. The code leaves the
// address as the page starts and stays on the device, so a reload or a later
// visit still has it. lib/api.js sends it on a request that carries no session,
// and lib/wall.js opens the page on it while nobody is signed in. Whether the
// code is still good is the server's answer, on every request.
// ============================================================

export const PASS_KEY = 'vmx-ai-pass';
export const PASS_HEADER = 'X-VetMock-Pass';
const PASS_RE = /^[A-Za-z0-9_-]{22,64}$/;

const wellFormed = (value) => typeof value === 'string' && PASS_RE.test(value);
const deviceStore = () => { try { return globalThis.localStorage; } catch { return null; } };

// Where storage is refused (a private window on some browsers) the code lasts for this page load.
let held = null;

/**
 * Read ?pass= once, as the page starts. The address loses it either way; only a
 * well-formed code is kept. Returns the code kept, or null.
 */
export function takePassFromUrl(location = globalThis.location, history = globalThis.history, store = deviceStore()) {
  try {
    const search = new URLSearchParams(location.search);
    if (!search.has('pass')) return null;
    const code = search.get('pass');
    search.delete('pass');
    const query = search.toString();
    try {
      history?.replaceState?.(history.state, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash || ''}`);
    } catch { /* an address that cannot be rewritten keeps the code in view; the link still works */ }
    if (!wellFormed(code)) return null;
    try {
      if (!store) throw new Error('no storage');
      store.setItem(PASS_KEY, code);
      held = null;
    } catch {
      held = code;
    }
    return code;
  } catch {
    return null;
  }
}

/** The code this device holds, or null. */
export function getPass(store = deviceStore()) {
  try {
    const saved = store?.getItem(PASS_KEY);
    if (wellFormed(saved)) return saved;
  } catch { /* storage refused: what this page load holds is all there is */ }
  return held;
}

/** Forget the code: the server refused it, or an account left this device. */
export function clearPass(store = deviceStore()) {
  held = null;
  try { store?.removeItem(PASS_KEY); } catch { /* nothing was kept there */ }
}
