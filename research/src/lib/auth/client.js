// Sign-in for research.vetmock.com [M1-DESIGN.md 9.7]. The only module allowed to import
// @supabase/supabase-js (tests/unit/no-egress.test.mjs). Loaded lazily, never on the landing's first
// paint. While the Chula sign-in wall is off, sign-in is optional: a guest works fully on the device;
// signing in only scopes projects to the account on this device (nothing syncs in M1). While it is
// on, the workspace asks for a Chula member session first (lib/auth/wall.js, docs/CHULA-SIGNIN.md).
// OWNER: runtime role.
//
// Redirect flow with PKCE: signIn() leaves the page for the provider and comes back to /app?code=...;
// the client created on that page load exchanges the code (detectSessionInUrl) and the session starts.
// No popups (COOP is same-origin). Only Supabase Auth is contacted here; no research data is sent.

const URL_ENV = import.meta.env?.VITE_SUPABASE_URL;
const KEY_ENV = import.meta.env?.VITE_SUPABASE_ANON_KEY;

/** True when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set for this build. */
export const AUTH_CONFIGURED = Boolean(URL_ENV && KEY_ENV);

/** The project's address and public key, for the Chula wall's one state call (lib/auth/chula.js). */
export const AUTH_URL = URL_ENV || '';
export const AUTH_KEY = KEY_ENV || '';

/** Where the provider sends the student back: the workspace on this origin. */
export function redirectTarget(origin = globalThis.location?.origin || '') {
  return `${origin}/app`;
}

let clientPromise = null;

/** @returns {Promise<import('@supabase/supabase-js').SupabaseClient|null>} */
export async function getAuthClient() {
  if (!AUTH_CONFIGURED) return null;
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) => createClient(URL_ENV, KEY_ENV, {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'vmx-research-auth',
      },
    })).catch((e) => {
      clientPromise = null;
      throw e;
    });
  }
  return clientPromise;
}

/**
 * Redirect sign-in (no popups; COOP is same-origin). redirectTo = `${location.origin}/app`.
 * Resolves only if the redirect did not happen (an error); otherwise the page leaves.
 * `hd` (the Chula wall's student.chula.ac.th or chula.ac.th) asks Google for an account on that domain,
 * with its account chooser; the database, not this hint, decides who is let in (docs/CHULA-SIGNIN.md).
 * @param {'google'} provider
 * @param {{ hd?: string }} [opts]
 * @returns {Promise<{ ok: false, key: string, error?: any }>}
 */
export async function signIn(provider = 'google', { hd = '' } = {}) {
  const client = await getAuthClient();
  if (!client) return { ok: false, key: 'runtime.auth.notConfigured' };
  if (provider !== 'google') return { ok: false, key: 'runtime.auth.failed' };
  const options = hd
    ? { redirectTo: redirectTarget(), queryParams: { hd, prompt: 'select_account' } }
    : { redirectTo: redirectTarget() };
  const { error } = await client.auth.signInWithOAuth({ provider, options });
  return error ? { ok: false, key: 'runtime.auth.failed', error } : { ok: false, key: 'runtime.auth.redirecting' };
}

let leftOnPurpose = false;

/** True once this page signed out on purpose: the Chula wall then says nothing about an expired session. */
export const signedOutHere = () => leftOnPurpose;

/**
 * Sign out on this device only. Projects stay on the device under the account and come back when the
 * same account signs in again; the UI says so beside the delete button.
 * @returns {Promise<{ ok: boolean, key: string|null }>}
 */
export async function signOut() {
  const client = await getAuthClient();
  if (!client) return { ok: true, key: null };
  leftOnPurpose = true;
  const { error } = await client.auth.signOut({ scope: 'local' });
  if (!error) return { ok: true, key: null };
  // Offline (or an expired token with no network) auth-js keeps the token. End the
  // local session the way it does after a refused refresh: _removeSession clears the
  // token, stops a retrying refresh from saving it again, and tells every tab
  // SIGNED_OUT. Without it, drop the token through the client's own storage.
  const { storage, storageKey } = client.auth ?? {};
  try {
    if (typeof client.auth?._removeSession === 'function') await client.auth._removeSession();
    else await storage.removeItem(storageKey);
    return { ok: true, key: null };
  } catch {
    return { ok: false, key: 'runtime.auth.failed' };
  }
}

/** Remove the sign-in leftovers (?code=, ?error=) from the address bar once the client has read them. */
export function cleanAuthParams(loc = globalThis.location, hist = globalThis.history) {
  if (!loc || !hist) return false;
  const url = new URL(loc.href);
  let changed = false;
  for (const p of ['code', 'error', 'error_code', 'error_description', 'state']) {
    if (url.searchParams.has(p)) {
      url.searchParams.delete(p);
      changed = true;
    }
  }
  if (changed) hist.replaceState(hist.state, '', `${url.pathname}${url.search}${url.hash}`);
  return changed;
}
