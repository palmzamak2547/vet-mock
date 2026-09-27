// Sign-in for research.vetmock.com [M1-DESIGN.md 9.7]. The only module allowed to import
// @supabase/supabase-js (tests/unit/no-egress.test.mjs). Loaded lazily, never on the landing's first
// paint. Sign-in is optional: a guest works fully on the device; signing in only scopes projects to
// the account on this device (nothing syncs in M1). OWNER: runtime role.
//
// Redirect flow with PKCE: signIn() leaves the page for the provider and comes back to /app?code=...;
// the client created on that page load exchanges the code (detectSessionInUrl) and the session starts.
// No popups (COOP is same-origin). Only Supabase Auth is contacted here; no research data is sent.

const URL_ENV = import.meta.env?.VITE_SUPABASE_URL;
const KEY_ENV = import.meta.env?.VITE_SUPABASE_ANON_KEY;

/** True when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set for this build. */
export const AUTH_CONFIGURED = Boolean(URL_ENV && KEY_ENV);

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
 * @param {'google'} provider
 * @returns {Promise<{ ok: false, key: string }>}
 */
export async function signIn(provider = 'google') {
  const client = await getAuthClient();
  if (!client) return { ok: false, key: 'runtime.auth.notConfigured' };
  if (provider !== 'google') return { ok: false, key: 'runtime.auth.failed' };
  const { error } = await client.auth.signInWithOAuth({ provider, options: { redirectTo: redirectTarget() } });
  return { ok: false, key: error ? 'runtime.auth.failed' : 'runtime.auth.redirecting' };
}

/**
 * Sign out on this device only. Projects stay on the device under the account and come back when the
 * same account signs in again; the UI says so beside the delete button.
 * @returns {Promise<{ ok: boolean, key: string|null }>}
 */
export async function signOut() {
  const client = await getAuthClient();
  if (!client) return { ok: true, key: null };
  const { error } = await client.auth.signOut({ scope: 'local' });
  return error ? { ok: false, key: 'runtime.auth.failed' } : { ok: true, key: null };
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
