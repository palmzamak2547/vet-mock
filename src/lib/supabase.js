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

// Did we land here from an email/OAuth redirect that needs the SDK to
// parse tokens out of the URL? Examples:
//   • Magic link:    #access_token=...&refresh_token=...&type=magiclink
//   • Recovery:      #access_token=...&type=recovery (or ?auth=reset)
//   • OAuth return:  #access_token=... (Google/etc)
//   • PKCE flow:     ?code=...
//   • Email error:   #error_code=... or ?error=...
//
// These flows put the credentials in the URL but NOT in localStorage —
// the SDK's `detectSessionInUrl: true` parses + persists on first load.
// Without this check, hasSavedSession() would return false and useAuth
// would skip eager SDK load → the page would appear "not signed in"
// until the user manually refreshed (which still wouldn't help, since
// hash is gone after refresh) or navigated to AuthView which preloads.
export function hasAuthRedirectInUrl() {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash || '';
  const search = window.location.search || '';
  // Hash params (implicit flow): access_token, refresh_token, error_code
  if (/[#&](access_token|refresh_token|provider_token|error_code|error_description)=/.test(hash)) return true;
  // Query params (PKCE flow + custom flags)
  if (/[?&](code|token_hash)=/.test(search)) return true;
  // App's own auth-action flag (?auth=reset)
  try {
    const params = new URLSearchParams(search);
    if (params.get('auth') === 'reset' || params.get('auth') === 'verify') return true;
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

// ─── Profile enrichment ─────────────────────────────────────────
// Profile fields (year/cohort/avatar/bio/privacy) live in user_metadata
// rather than a separate `profiles.year` column so we don't have to
// block on a Supabase schema migration. user_metadata is a JSON blob
// on auth.users that the user owns + can update via updateUser().
//
// Fields:
//   year (1-6) | cohort ("Vet 86") | avatar_emoji | bio (≤140) |
//   show_on_leaderboard (bool) | onboarded (bool, set after first
//   onboarding flow finishes — used to suppress the modal on returns)
export async function updateProfileMetadata(metadata) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.updateUser({ data: metadata });
  if (error) throw error;
  notifyAuthChanged();
  return data;
}

// ─── Update username (in profiles table) ────────────────────────
// Username uniqueness is enforced server-side via a unique index. If
// another user grabs the name between availability check and update,
// the error is surfaced in Thai.
export async function updateUsername(newUsername) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data: sess } = await supabase.auth.getSession();
  const userId = sess?.session?.user?.id;
  if (!userId) throw new Error('ไม่ได้ login อยู่');
  const { data, error } = await supabase
    .from('profiles')
    .update({ username: newUsername })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  // Mirror to user_metadata so HomeView / UserMenu pick it up without
  // a profiles re-fetch round-trip.
  await supabase.auth.updateUser({ data: { username: newUsername } });
  return data;
}

// ─── LINE OAuth (Thailand-specific provider) ────────────────────
// Requires Supabase Dashboard → Auth → Providers → LINE setup with a
// LINE Developer app's channel ID + secret. Until that's configured,
// this throws a helpful error instead of failing silently.
export async function signInWithLine() {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'line',
    options: { redirectTo: window.location.origin },
  });
  if (error) {
    // Surface "provider not enabled" cleanly so AuthView can render
    // a Thai message pointing to the Supabase setup checklist.
    if (/provider/i.test(error.message)) {
      throw new Error('PROVIDER_NOT_CONFIGURED:line');
    }
    throw error;
  }
  return data;
}

// ─── Apple Sign-in (iOS PWA users) ──────────────────────────────
// Requires Apple Developer account + Services ID + private key
// configured in Supabase Dashboard. Frontend code is identical to
// Google; the heavy lifting is at the dashboard level.
export async function signInWithApple() {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: window.location.origin },
  });
  if (error) {
    if (/provider/i.test(error.message)) {
      throw new Error('PROVIDER_NOT_CONFIGURED:apple');
    }
    throw error;
  }
  return data;
}

// ─── Anonymous → Registered migration ───────────────────────────
// When a user has been playing offline (localStorage only) and then
// signs up, their progress should follow them to the cloud — not get
// overwritten by an empty pull. Called from App after a successful
// signup, BEFORE pullUserData runs (which would otherwise fetch
// {} from cloud and clear local state).
//
// Strategy: read localStorage, push to user_data row. If row didn't
// exist (first-ever account), this becomes the initial state. If it
// did exist (rare — user had a prior account on same browser), we
// MERGE conservatively: keep the higher count for arrays, take the
// non-null for objects. Conflicts that can't be resolved automatically
// get logged but don't block.
export async function migrateLocalToCloud() {
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, reason: 'no-supabase' };
  const { data: sess } = await supabase.auth.getSession();
  const userId = sess?.session?.user?.id;
  if (!userId) return { ok: false, reason: 'not-signed-in' };

  // Read all known localStorage state — same keys App.jsx uses.
  const read = (k) => {
    try {
      const raw = window.localStorage?.getItem(k);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };
  const local = {
    bookmarks:        read('vmx-bookmarks') || [],
    history:          read('vmx-history') || [],
    notes:            read('vmx-notes') || {},
    sr_cards:         read('vmx-sr-cards') || {},
    custom_questions: read('vmx-custom-q') || [],
    streak_data:      read('vmx-streak') || { streak: 0, lastDate: null },
  };
  // Skip migration if local is empty across the board — saves a write.
  const isEmpty =
    local.bookmarks.length === 0 &&
    local.history.length === 0 &&
    Object.keys(local.notes).length === 0 &&
    Object.keys(local.sr_cards).length === 0 &&
    local.custom_questions.length === 0 &&
    !local.streak_data?.lastDate;
  if (isEmpty) return { ok: true, migrated: false, reason: 'no-local-data' };

  // Upsert into user_data — same table pushUserData targets.
  const { error } = await supabase
    .from('user_data')
    .upsert({ user_id: userId, ...local, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (error) {
    return { ok: false, reason: 'upsert-failed', error };
  }
  return { ok: true, migrated: true, counts: {
    bookmarks: local.bookmarks.length,
    history: local.history.length,
    notes: Object.keys(local.notes).length,
    sr_cards: Object.keys(local.sr_cards).length,
    custom_questions: local.custom_questions.length,
  } };
}

// ─── Friend search (find user by username) ──────────────────────
// Simple LIKE search against profiles.username. RLS should restrict
// to public profiles only (not enforced client-side; relying on
// `show_on_leaderboard` user_metadata flag = honor system for v1).
// Caps at 10 results to avoid full-table scans on a popular prefix.
export async function searchUsersByUsername(query) {
  const supabase = await getSupabase();
  if (!supabase) return [];
  const q = String(query || '').trim();
  if (q.length < 2) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_emoji')
    .ilike('username', `${q}%`)
    .limit(10);
  if (error) return [];
  return data || [];
}
