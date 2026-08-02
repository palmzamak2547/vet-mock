// ============================================================
// auth-storage.js — where the Supabase session token is kept
// ============================================================
// The sign-in form offers "จดจำ session — login ค้างไว้ แม้ปิดเว็บ" and writes the
// answer to vmx-stay-signed-in. Nothing used to read it: the client was built
// with persistSession: true and the default localStorage backend, so the
// refresh token survived tab close either way. A student on a shared faculty or
// library machine who deliberately unticked the box stayed signed in, and the
// next person to open VetMock landed in their account.
//
// Honouring the choice needs a storage adapter rather than a constructor flag,
// because the client is created once and memoized — usually well before the box
// is ticked. This resolves the destination per operation instead.
//
// Reads fall back to the other store so flipping the box never orphans a live
// session, and writes clear the store we are not using, so a token cannot
// linger in localStorage after the user asked us not to keep it.
//
// Kept out of supabase.js so it can be unit-tested: that module reads
// import.meta.env at load, which throws under the Node test runner.
// ============================================================

export const STAY_SIGNED_IN_KEY = 'vmx-stay-signed-in';

/** Default true — only an explicit '0' opts out, so a missing or unreadable
 *  flag behaves the way the app did before this existed. */
export function staySignedIn(store) {
  try {
    return (store ?? globalThis.localStorage).getItem(STAY_SIGNED_IN_KEY) !== '0';
  } catch {
    return true;
  }
}

/** Build the adapter. Stores are injected so tests can supply fakes; in the
 *  app both default to the real Web Storage objects. */
export function createAuthStorage(getLocal = () => globalThis.localStorage,
                                  getSession = () => globalThis.sessionStorage) {
  const pick = () => {
    const keep = staySignedIn(getLocal());
    return keep
      ? { primary: getLocal(), other: getSession() }
      : { primary: getSession(), other: getLocal() };
  };

  return {
    getItem(k) {
      try {
        const { primary, other } = pick();
        const hit = primary.getItem(k);
        return hit ?? other.getItem(k);
      } catch { return null; }
    },
    setItem(k, v) {
      try {
        const { primary, other } = pick();
        primary.setItem(k, v);
        other.removeItem(k);
      } catch {}
    },
    removeItem(k) {
      // Sign-out clears both, never just the one currently selected — the
      // flag may have been flipped since the token was written.
      try { getLocal().removeItem(k); } catch {}
      try { getSession().removeItem(k); } catch {}
    },
  };
}

/** True when a Supabase auth token exists in EITHER store.
 *
 *  Both are scanned because a user who unticked the box has their token in
 *  sessionStorage. Checking only localStorage would read them as signed out at
 *  boot and skip the hydrate, landing them on the signed-out UI while holding a
 *  perfectly good session. */
export function hasStoredAuthToken(getLocal = () => globalThis.localStorage,
                                   getSession = () => globalThis.sessionStorage) {
  const isAuthKey = (k) => !!k && k.startsWith('sb-') && k.endsWith('-auth-token');
  for (const get of [getLocal, getSession]) {
    try {
      const store = get();
      for (let i = 0; i < store.length; i++) {
        if (isAuthKey(store.key(i))) return true;
      }
    } catch {}
  }
  return false;
}
