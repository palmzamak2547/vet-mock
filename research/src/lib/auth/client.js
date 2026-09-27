// Sign-in for research.vetmock.com [M1-DESIGN.md 9.7]. The only module allowed to import
// @supabase/supabase-js (tests/unit/no-egress.test.mjs). Loaded lazily, never on the landing's first
// paint. Sign-in is optional: a guest works fully on the device; signing in only scopes projects to
// the account on this device (nothing syncs in M1). OWNER: runtime role.

/** True when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set for this build. */
export const AUTH_CONFIGURED = Boolean(import.meta.env?.VITE_SUPABASE_URL && import.meta.env?.VITE_SUPABASE_ANON_KEY);

/** @returns {Promise<import('@supabase/supabase-js').SupabaseClient|null>} */
export async function getAuthClient() {
  throw new Error('not implemented: auth/client.getAuthClient');
}

/**
 * Redirect sign-in (no popups; COOP is same-origin). redirectTo = `${location.origin}/app`.
 * @param {'google'} provider
 */
export async function signIn(provider) { void provider; throw new Error('not implemented: auth/client.signIn'); }

export async function signOut() { throw new Error('not implemented: auth/client.signOut'); }
