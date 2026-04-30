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

// Notify useAuth (and any other listener) that the SDK is now loaded
// and an auth state change just happened. useAuth uses this signal to
// (a) fetch the current session for the user that just signed in and
// (b) attach an onAuthStateChange listener — neither of which it does
// at boot when there's no saved session, to keep the SDK lazy.
function notifyAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vmx-auth-changed'));
  }
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
  notifyAuthChanged();
  return data;
}

export async function signInWithEmail(email, password) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  notifyAuthChanged();
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
  // OAuth redirects away — the post-redirect bootstrap path picks
  // up the session via hasSavedSession()
  return data;
}

export async function signOut() {
  const supabase = await getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
  notifyAuthChanged();
}

// ─── Password reset ─────────────────────────────────────────────
export async function sendPasswordReset(email) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/?auth=reset`,
  });
  if (error) throw error;
}

export async function updatePassword(newPassword) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

// ─── Magic Link (passwordless) sign-in ──────────────────────────
// User enters email → Supabase sends a clickable link → clicking
// the link auto-signs them in. No password to forget. Great for
// users who came via Google before and never set a password.
export async function signInWithMagicLink(email) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
      // Don't auto-create accounts via magic link — only existing users
      // can use it. This forces signup to go through the normal flow
      // where username is collected.
      shouldCreateUser: false,
    },
  });
  if (error) throw error;
  return data;
}

// ─── Sign out from ALL devices (security action) ────────────────
// Used when user suspects credential leak or wants fresh start.
// Supabase scope='global' invalidates all refresh tokens for this user.
export async function signOutAllDevices() {
  const supabase = await getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut({ scope: 'global' });
  notifyAuthChanged();
}

// ─── Update email (with re-verification link) ───────────────────
// Supabase sends a confirmation link to the NEW email. Until the
// user clicks it, the old email remains primary.
export async function updateEmail(newEmail) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw error;
}

// ─── Delete account (best-effort, client-side) ──────────────────
// Without a server-side service-role key, we can't fully delete from
// auth.users via the public API. Closest we can do client-side:
//   1) Delete the user's profile + progress rows (RLS allows self-delete)
//   2) Sign out everywhere
// The auth.users row remains as a "tombstone" until a future cron/edge
// function reaps it. From the user's perspective: data is gone, login
// no longer works on their email until support manually clears.
//
// If you want true deletion, deploy a Supabase Edge Function with
// service_role and call it here instead.
export async function deleteAccountData() {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data: sess } = await supabase.auth.getSession();
  const userId = sess?.session?.user?.id;
  if (!userId) throw new Error('ไม่ได้ login อยู่');

  // Delete known tables that store user-specific data. Each call is
  // best-effort — failures are logged but don't block the others.
  const tables = ['profiles', 'attempts', 'flashcards', 'group_members', 'feedback'];
  const errors = [];
  for (const t of tables) {
    try {
      const { error } = await supabase.from(t).delete().eq('user_id', userId);
      if (error && !/no rows/i.test(error.message)) errors.push({ table: t, error });
    } catch (e) {
      errors.push({ table: t, error: e });
    }
  }
  // Profile uses 'id' not 'user_id' on some schemas
  try { await supabase.from('profiles').delete().eq('id', userId); } catch {}

  // Sign out everywhere as the final step
  await supabase.auth.signOut({ scope: 'global' });
  notifyAuthChanged();

  return { ok: errors.length === 0, errors };
}

// ─── Username availability check (for real-time validation) ─────
// Throttled by callers; does a single COUNT against profiles.
// Returns: true (free) | false (taken) | null (unknown / error).
export async function isUsernameAvailable(username) {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { count, error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('username', username);
  if (error) return null;
  return (count ?? 0) === 0;
}
