// ============================================================
// Lazy Supabase loader
// ============================================================
// The @supabase/supabase-js bundle is ~190KB ungzipped. Most cold
// visits never need it (no saved session, never clicks Login). So
// we only dynamic-import the SDK on demand.
//
// Three entry points trigger the load:
//   1) hasSavedSession() returned true at boot → useAuth() pulls it
//   2) User clicks Login (AuthView) → signInWith* helpers
//   3) Any cloud-sync call (api.js) — should only fire after login
//
// The SDK client is cached as a single Promise, so multiple callers
// share one fetch and one createClient() call.
// ============================================================

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabase = !!(url && key);

let _clientPromise = null;

// Lazily import the SDK and instantiate the client. Subsequent calls
// return the same promise, so all consumers see one shared client.
export function getSupabase() {
  if (!hasSupabase) return Promise.resolve(null);
  if (!_clientPromise) {
    _clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url, key, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      })
    );
  }
  return _clientPromise;
}

// Cheap synchronous check — does localStorage already have a Supabase
// auth token? If yes, useAuth should pull the SDK at boot. If no, we
// can skip the SDK load entirely until the user opts in.
export function hasSavedSession() {
  if (!hasSupabase || typeof window === 'undefined') return false;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) return true;
    }
  } catch {}
  return false;
}

// ─── Auth helpers — all lazy ────────────────────────────────
export async function signUpWithEmail(email, password, username) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email, password) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = await getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}
