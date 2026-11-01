// ============================================================
// auth.js — the one door to Supabase Auth
// ============================================================
// The only module that imports @supabase/supabase-js, and only when it is first
// needed: a saved session to read, or a sign-in to start. The account is
// VetMock's (one Supabase project); this origin keeps its own session under its
// own storage key, so ai.vetmock.com and vetmock.com never sign each other out.
// Google comes back to this origin with ?code= (PKCE); the client made on that
// page load exchanges it (detectSessionInUrl) and the session starts.

// Vite inlines import.meta.env; under node --test it is undefined
const ENV = import.meta.env || {};

// A production build falls back to VetMock's public project address and its
// publishable key (both public by design, the same project vetmock.com uses), so
// the wall works without an env var on the vetmock-ai project; without them the
// page would show no wall while the API refused every chat.
const PUBLIC_URL = 'https://mpovsdzdggvksmeehqfj.supabase.co';
const PUBLIC_KEY = 'sb_publishable_KwutdHMNFp4t17vtLl3fhA_v9p8lCIT';
export const SUPABASE_URL = ENV.VITE_SUPABASE_URL || (ENV.PROD ? PUBLIC_URL : '');
export const SUPABASE_KEY = ENV.VITE_SUPABASE_ANON_KEY || (ENV.PROD ? PUBLIC_KEY : '');
/** False in a build with no database: no accounts, so the Chula wall stays open. */
export const AUTH_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_KEY);
export const AUTH_STORAGE_KEY = 'vmx-ai-auth';

let pending = null;

/** @returns {Promise<import('@supabase/supabase-js').SupabaseClient|null>} */
export function getAuthClient() {
  if (!AUTH_CONFIGURED) return Promise.resolve(null);
  if (!pending) {
    pending = import('@supabase/supabase-js')
      .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          flowType: 'pkce',
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: AUTH_STORAGE_KEY,
        },
      }))
      // a chunk that failed once (offline, a deploy mid-visit) must not fail every later call
      .catch((error) => { pending = null; throw error; });
  }
  return pending;
}

/** The session this device kept, read from the client's own entry without loading it. */
export function storedSession(store = globalThis.localStorage) {
  try {
    const raw = store?.getItem(AUTH_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const session = parsed?.user ? parsed : parsed?.currentSession;
    return session?.user && typeof session.user.id === 'string' ? session : null;
  } catch {
    return null;
  }
}

/** A refresh that failed because the network is down or the server did not answer, not a refusal. */
export function isRetryableAuthError(error) {
  if (!error) return false;
  return error.name === 'AuthRetryableFetchError' || error.status === 0 || (typeof error.status === 'number' && error.status >= 500);
}

/** What the Chula wall needs from the account, in one place (lib/wall.js takes it). */
export const authPort = {
  configured: AUTH_CONFIGURED,
  url: SUPABASE_URL,
  key: SUPABASE_KEY,
  stored: () => storedSession(),
  /** Google sent the student back with a code this page load exchanges. */
  returning: () => {
    try { return new URLSearchParams(globalThis.location?.search || '').has('code'); } catch { return false; }
  },
  async session() {
    const client = await getAuthClient();
    if (!client) return { session: null, error: null };
    const init = await client.auth.initialize();
    const { data, error } = await client.auth.getSession();
    return { session: data?.session || null, error: error || init?.error || null, retryable: isRetryableAuthError(error) };
  },
  async onChange(callback) {
    const client = await getAuthClient();
    if (!client) return () => {};
    const { data } = client.auth.onAuthStateChange((event, session) => callback(event, session));
    return () => data?.subscription?.unsubscribe();
  },
  /** Google's own button handed back an ID token (lib/gis.js): trade it for a session, here, no redirect. */
  async idToken(token, nonce) {
    const client = await getAuthClient();
    if (!client) throw new Error('auth not configured');
    const { data, error } = await client.auth.signInWithIdToken({ provider: 'google', token, nonce });
    if (error) throw error;
    return data?.session || null;
  },
  /** The link screen: add the Google identity of that ID token to the account signed in here (manual linking). */
  async linkToken(token, nonce) {
    const client = await getAuthClient();
    if (!client) throw new Error('auth not configured');
    const { data, error } = await client.auth.linkIdentity({ provider: 'google', token, nonce });
    if (error) throw error;
    return data;
  },
  /** The link screen's fallback: link through Google's redirect, back to this page. */
  async linkRedirect(hd) {
    const client = await getAuthClient();
    if (!client) throw new Error('auth not configured');
    const { error } = await client.auth.linkIdentity({
      provider: 'google',
      options: { redirectTo: `${globalThis.location.origin}/`, queryParams: { hd, prompt: 'select_account' } },
    });
    if (error) throw error;
  },
  /** The fallback: leaves for Google through the database's address; resolves only if the redirect did not start. */
  async signIn(hd) {
    const client = await getAuthClient();
    if (!client) throw new Error('auth not configured');
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${globalThis.location.origin}/`, queryParams: { hd, prompt: 'select_account' } },
    });
    if (error) throw error;
  },
  /** This device only: the account is shared with vetmock.com and its other devices. */
  async signOut() {
    const client = await getAuthClient();
    if (client) await client.auth.signOut({ scope: 'local' });
  },
  /** A fresh access token, or null when the server would not give one. */
  async refresh() {
    const client = await getAuthClient();
    if (!client) return null;
    const { data, error } = await client.auth.refreshSession();
    return error ? null : data?.session?.access_token || null;
  },
};
