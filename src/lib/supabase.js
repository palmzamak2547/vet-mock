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

import { createAuthStorage, hasStoredAuthToken } from './auth-storage.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabase = !!(url && key);

let _clientPromise = null;

// Routes the session token to localStorage or sessionStorage depending on the
// "จดจำ session" choice. See auth-storage.js for why it is an adapter and not a
// constructor flag.
const authStorage = createAuthStorage();

export function getSupabase() {
  if (!hasSupabase) return Promise.resolve(null);
  if (!_clientPromise) {
    _clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url, key, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storage: authStorage,
          // Passkeys are behind an explicit opt-in because the API is still
          // marked experimental upstream. Everything else here keeps working
          // if it changes; only the passkey helpers below depend on it.
          experimental: { passkey: true },
        },
      })
    // Drop the memo on failure, or one bad chunk load poisons auth for the
    // rest of the page. The dynamic import fails for ordinary reasons —
    // campus wifi dropping, or a deploy landing mid-session so the hashed
    // chunk this tab remembers is already gone — and without this every
    // later caller re-awaits the same rejected promise. The user sees every
    // sign-in attempt fail until they think to reload, which nothing tells
    // them to do. Same shape as the reset in line-liff.js.
    ).catch((err) => { _clientPromise = null; throw err; });
  }
  return _clientPromise;
}

// Cheap synchronous check — is a Supabase auth token already stored? If yes,
// useAuth should pull the SDK at boot. If no, we can skip the SDK load
// entirely until the user opts in.
//
// Both stores are scanned, because authStorage above puts the token in
// sessionStorage for anyone who unticked "จดจำ session". Checking only
// localStorage would read those users as signed out at boot and skip the
// hydrate, so they would land on the signed-out UI while holding a perfectly
// good session.
export function hasSavedSession() {
  if (!hasSupabase || typeof window === 'undefined') return false;
  return hasStoredAuthToken();
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

  // Prefer GIS (Google Identity Services) popup flow when configured —
  // it bypasses Supabase's OAuth callback URL, so users no longer see
  // the raw "<project>.supabase.co" flash mid-flow. Falls back to the
  // redirect flow if (a) VITE_GOOGLE_CLIENT_ID isn't set, (b) GIS
  // script fails to load (offline / strict CSP), or (c) GIS one-tap
  // is suppressed by the browser (recent dismiss, ITP, etc.).
  try {
    const { isGoogleGisAvailable, signInWithGoogleGis } = await import('./google-gis.js');
    if (isGoogleGisAvailable()) {
      const data = await signInWithGoogleGis({ supabase });
      notifyAuthChanged();
      return data;
    }
  } catch (err) {
    // Don't surface GIS-specific errors — they have a redirect-flow
    // fallback. Only log so we can debug if GIS-only sites break.
    const msg = err?.message || '';
    if (msg === 'GIS_PROMPT_SUPPRESSED' || msg === 'NO_GOOGLE_CLIENT_ID') {
      // Expected suppressions — fall through to redirect flow silently.
    } else {
      console.warn('[auth] GIS sign-in failed, falling back to redirect:', msg);
    }
  }

  // Redirect-based fallback. Visible Supabase URL flash here is
  // unavoidable without GIS or a custom-domain Pro Supabase plan.
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

// ─── Reauthentication for sensitive changes ─────────────────────
// Changing the password or the recovery email used to need nothing but a live
// session. Leave the app open on a shared library machine, or lend a phone for
// two minutes, and whoever is at the keyboard can take the account and its
// whole exam history permanently.
//
// The check is an emailed OTP rather than a "current password" field, because a
// large share of these accounts signed in with Google and have no password to
// type. The repo already ships supabase/email-templates/05-reauthentication.html
// for exactly this and nothing was calling it.
export async function requestReauthOtp() {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.reauthenticate();
  if (error) throw error;
}

// `nonce` is the code from that email. Supabase only demands it when the
// project has security_update_password_require_reauthentication on, but it is
// accepted either way — so the client can send it before the flag is flipped,
// and flipping the flag cannot strand anyone mid-release.
export async function updatePassword(newPassword, nonce) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const payload = { password: newPassword };
  if (nonce) payload.nonce = nonce;
  const { error } = await supabase.auth.updateUser(payload);
  if (error) throw error;
}

// ─── Passkeys (WebAuthn) ────────────────────────────────────────
// The device holds a private key and unlocks it with a fingerprint, face, or
// PIN. Nothing shared is ever typed or sent, so there is no password to forget
// and nothing a fake VetMock page can collect — the credential is bound to the
// real origin by the browser.
//
// Two things about this are worth knowing before relying on it:
//
//   • The upstream API is experimental and may change without notice. Every
//     call here is wrapped so a change degrades to "passkey unavailable"
//     rather than breaking the sign-in screen for everyone.
//   • Passkeys are cryptographically bound to the relying-party ID, which is
//     currently vetmock.vercel.app. Moving VetMock to a custom domain later
//     invalidates every passkey already registered and everyone has to enrol
//     again. Worth settling the domain before pushing enrolment hard.
//
// WebAuthn also needs a secure origin, so this is dead on http://localhost —
// the origin allow-list cannot contain localhost when the RP ID is the Vercel
// host. Test passkeys against the deployed site.

/** Can this browser do passkeys at all? Cheap, synchronous, no SDK load. */
export function isPasskeySupported() {
  return typeof window !== 'undefined'
    && typeof window.PublicKeyCredential === 'function'
    && !!navigator?.credentials;
}

/** Register a passkey for the signed-in user. Requires an existing confirmed,
 *  non-anonymous account — this is an addition to an account, not a signup. */
export async function registerPasskey() {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  if (!supabase.auth.registerPasskey) throw new Error('PASSKEY_UNSUPPORTED');
  const { data, error } = await supabase.auth.registerPasskey();
  if (error) throw error;
  notifyAuthChanged();
  return data;
}

/** Sign in with a passkey. Discoverable credentials, so the user is not asked
 *  for an email first — the authenticator resolves the account itself. */
export async function signInWithPasskey() {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  if (!supabase.auth.signInWithPasskey) throw new Error('PASSKEY_UNSUPPORTED');
  const { data, error } = await supabase.auth.signInWithPasskey();
  if (error) throw error;
  notifyAuthChanged();
  return data;
}

/** The current user's passkeys. Returns [] rather than throwing when the
 *  feature is off or the shape moved, so a settings page can render either way. */
export async function listPasskeys() {
  try {
    const supabase = await getSupabase();
    if (!supabase?.auth?.passkey?.list) return [];
    const { data, error } = await supabase.auth.passkey.list();
    if (error) return [];
    return Array.isArray(data) ? data : (data?.passkeys || []);
  } catch { return []; }
}

export async function deletePasskey(passkeyId) {
  const supabase = await getSupabase();
  if (!supabase?.auth?.passkey?.delete) throw new Error('PASSKEY_UNSUPPORTED');
  const { error } = await supabase.auth.passkey.delete({ passkeyId });
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

// ─── Resend signup verification email ───────────────────────────
// Used by the email-verify-pending banner so users who missed/lost
// the original confirmation mail can request a fresh link without
// re-running the whole signup. Supabase rate-limits at ~60s/email
// by default; on hit returns a "rate limit" error that the UI maps
// to a Thai cooldown message.
export async function resendVerificationEmail(email) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) throw error;
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

// ─── Delete account (atomic via Edge Function) ──────────────────
// Palm audit 2026-05-20 P1: was a best-effort client-side multi-table
// delete that hit hardcoded table names (`attempts` / `flashcards` /
// `feedback`) that DON'T exist in the canonical schema, AND the
// `profiles` table had no DELETE RLS policy so the rows were silently
// not deleted (RLS-deny default).
//
// Now: posts to the `delete-account` Edge Function which uses
// service_role to purge across all user-scoped tables in the right
// order, then admin.deleteUser to clear auth.users. Returns an
// audit report `{ok, deleted: {table: count}, errors}`. The Edge
// Function source lives in supabase/functions/delete-account/.
//
// If ANY table delete fails, the Edge Function skips the auth.users
// step so the account stays recoverable instead of leaving a tombstone.
export async function deleteAccountData() {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data: sess } = await supabase.auth.getSession();
  const userId = sess?.session?.user?.id;
  const accessToken = sess?.session?.access_token;
  if (!userId || !accessToken) throw new Error('ไม่ได้ login อยู่');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) throw new Error('Supabase URL not configured');

  let report;
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
    });
    report = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(report?.error || `delete-account returned ${res.status}`);
    }
  } catch (e) {
    // Network failure / function error → return diagnostic so the UI
    // can show the user something actionable. Don't silently signOut
    // in this case because their data is still intact + recoverable.
    return { ok: false, errors: [{ table: '__network__', error: e?.message || String(e) }] };
  }

  // Sign out ONLY on success. On success the Edge Function has already deleted
  // auth.users, so the session is dead server-side and this just clears the
  // client cache. On a PARTIAL failure the account still exists (the function
  // deliberately skips the auth.users delete when any table errored) — and
  // signing out there destroyed the session on every device while the UI told
  // the student to "try again", a retry they could no longer perform without
  // logging back in first.
  const ok = !!report?.ok;
  if (ok) {
    try { await supabase.auth.signOut({ scope: 'global' }); } catch {}
    notifyAuthChanged();
  }

  return {
    ok,
    deleted: report?.deleted || {},
    errors: report?.errors || [],
  };
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
    .select('id, username, avatar_emoji, created_at')
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
// this throws a tagged error that AuthView catches and turns into a
// setup-help modal with exact callback URL + checklist.
//
// CALLBACK URL to whitelist in LINE Developer Console:
//   https://<your-supabase-project>.supabase.co/auth/v1/callback
// Plus in Supabase Dashboard → Auth → URL Configuration →
//   Site URL: https://vetmock.vercel.app
//   Redirect URLs: https://vetmock.vercel.app, http://localhost:5173
// Pre-flight check: query Supabase's public auth settings endpoint to
// see which external providers are enabled BEFORE asking the SDK to
// build an authorize URL. The SDK's signInWithOAuth redirects the
// browser to `<project>.supabase.co/auth/v1/authorize?provider=line`
// regardless of whether that provider is actually configured — so a
// disabled provider lands the user on a raw JSON error page (the
// "Unsupported provider: Provider line could not be found" body Palm
// hit). Settings endpoint is public (no key required for the GET) so
// the check is essentially free.
//
// Returns null on network failure (don't block — let signInWithOAuth
// proceed and surface whatever error it gets).
async function checkProviderEnabled(providerKey) {
  if (!url) return null;
  try {
    const resp = await fetch(`${url}/auth/v1/settings`, {
      headers: key ? { apikey: key } : {},
    });
    if (!resp.ok) return null;
    const json = await resp.json();
    const external = json?.external || {};
    return Boolean(external[providerKey]);
  } catch {
    return null;
  }
}

// LINE login — Supabase Auth does NOT natively support LINE provider,
// so we bridge via LINE LIFF SDK + a Supabase Edge Function. See
// src/lib/line-liff.js for the full flow; this wrapper just delegates
// while preserving the existing signature (callers don't need to know).
//
// If VITE_LINE_LIFF_ID isn't set, throw PROVIDER_NOT_CONFIGURED:line so
// AuthView's existing handler still surfaces the setup help modal.
export async function signInWithLine() {
  const { isLiffAvailable, signInWithLineViaLiff } = await import('./line-liff.js');
  if (!isLiffAvailable()) {
    const e = new Error('PROVIDER_NOT_CONFIGURED:line');
    e.rawMessage = 'VITE_LINE_LIFF_ID not set. LINE login requires a LIFF channel + Edge Function — see src/lib/line-liff.js header comment for setup steps.';
    throw e;
  }
  try {
    return await signInWithLineViaLiff();
  } catch (err) {
    // Surface bridge-level failures (network, JWT verify, Supabase admin
    // error) under the same PROVIDER_NOT_CONFIGURED umbrella so AuthView
    // opens the setup help modal with the raw detail visible. Genuine
    // user-cancelled flows (liff.login() didn't return an id_token) get
    // the same treatment — surfacing the dev modal is harmless.
    const msg = err?.message || String(err);
    const e = new Error('PROVIDER_NOT_CONFIGURED:line');
    e.rawMessage = err?.rawMessage || msg;
    throw e;
  }
}

// ─── Apple Sign-in (iOS PWA users) ──────────────────────────────
// Requires Apple Developer account ($99/yr) + Services ID + private
// key configured in Supabase Dashboard. Frontend code is identical
// to Google; the heavy lifting is dashboard-side.
//
// CALLBACK URL for Apple Developer console:
//   https://<your-supabase-project>.supabase.co/auth/v1/callback
// Plus the Services ID + Key ID + Team ID + .p8 key contents go into
// Supabase Dashboard → Auth → Providers → Apple.
// Discord OAuth — free alternative to Apple Sign-in for VetMock.
// Supabase supports Discord as a native external provider, so the
// flow is identical to Google: signInWithOAuth + browser redirect.
//
// CALLBACK URL to whitelist in Discord Developer Portal:
//   https://<your-supabase-project>.supabase.co/auth/v1/callback
// Plus enable Discord in Supabase Dashboard → Authentication →
// Providers → Discord and paste Client ID + Client Secret from the
// Discord Developer Portal application.
export async function signInWithDiscord() {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');

  // Pre-flight settings check so a disabled provider surfaces our
  // friendly setup-help modal rather than dumping a JSON error.
  const enabled = await checkProviderEnabled('discord');
  if (enabled === false) {
    const e = new Error('PROVIDER_NOT_CONFIGURED:discord');
    e.rawMessage = 'Provider "discord" is disabled in Supabase Auth settings (Dashboard → Authentication → Providers → Discord).';
    throw e;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: { redirectTo: window.location.origin },
  });
  if (error) {
    if (/provider|enabled|oauth|validation|redirect|invalid|not.*allowed|unsupported/i.test(error.message)) {
      const e = new Error('PROVIDER_NOT_CONFIGURED:discord');
      e.rawMessage = error.message;
      throw e;
    }
    throw error;
  }
  return data;
}

export async function signInWithApple() {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');

  // Same pre-flight as LINE — Apple Sign-in requires Apple Developer
  // setup ($99/yr) so it's commonly disabled. Catch upfront before the
  // SDK redirects to a JSON error page.
  const enabled = await checkProviderEnabled('apple');
  if (enabled === false) {
    const e = new Error('PROVIDER_NOT_CONFIGURED:apple');
    e.rawMessage = 'Provider "apple" is disabled in Supabase Auth settings (Apple needs Services ID + .p8 key configured).';
    throw e;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: window.location.origin },
  });
  if (error) {
    if (/provider|enabled|oauth|validation|redirect|invalid|not.*allowed|unsupported/i.test(error.message)) {
      const e = new Error('PROVIDER_NOT_CONFIGURED:apple');
      e.rawMessage = error.message;
      throw e;
    }
    throw error;
  }
  return data;
}

// Get the Supabase project URL so the OAuth setup help modal can show
// the exact callback URL the user needs to paste into LINE / Apple
// Developer Console. Reads from the env that supabase.js already
// resolves at module load; doesn't require a live session.
export function getSupabaseProjectUrl() {
  return url || null;
}
export function getOAuthCallbackUrl() {
  if (!url) return null;
  // Trim trailing slash if present, then append the canonical callback path
  return url.replace(/\/+$/, '') + '/auth/v1/callback';
}

// ─── Anonymous → Registered migration ───────────────────────────
// When a user has been playing offline (localStorage only) and then
// signs up, their progress should follow them to the cloud — not get
// overwritten by an empty pull. Called from App after a successful
// signup, BEFORE pullUserData runs (which would otherwise fetch
// {} from cloud and clear local state).
//
// Strategy: read localStorage and write ONLY the fields the account
// does not already have. If the row did not exist (first-ever account)
// that is the whole local snapshot, which is the point. If it did, the
// account's own data is left exactly as it is and the skipped fields
// are reported back to the caller.
//
// The previous version of this comment described a conservative merge
// that keeps "the higher count for arrays" — no such code existed. It
// upserted the whole snapshot over the row.
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

  // Only fill fields the account does not already have.
  //
  // This used to upsert the whole local snapshot over the row, which its own
  // docstring called a conservative merge and was not. The function is only
  // reached from the sign-UP branch, but Supabase returns an obfuscated
  // success for an email that already exists, and the code then falls through
  // to signInWithEmail — so a returning student who taps "สมัคร" instead of
  // "เข้าสู่ระบบ" on a fresh device, types their real credentials, and has
  // answered even one question locally would have had their entire cloud
  // history, bookmarks, notes and SR cards replaced by that one answer.
  //
  // Migrating anonymous work INTO an empty account is the whole job, so
  // writing only what the account is missing does that job and cannot
  // destroy anything.
  const { data: remote, error: readErr } = await supabase
    .from('user_data')
    .select('bookmarks, history, notes, sr_cards, custom_questions, streak_data')
    .eq('user_id', userId)
    .maybeSingle();
  // A read failure is not permission to overwrite. Refuse rather than guess.
  if (readErr) return { ok: false, reason: 'read-failed', error: readErr };

  const hasRemote = (v) => (
    Array.isArray(v) ? v.length > 0
      : (v && typeof v === 'object') ? Object.keys(v).length > 0
        : v != null
  );
  const payload = { user_id: userId, updated_at: new Date().toISOString() };
  const skipped = [];
  for (const [field, value] of Object.entries(local)) {
    if (remote && hasRemote(remote[field])) { skipped.push(field); continue; }
    payload[field] = value;
  }
  if (Object.keys(payload).length === 2) {
    return { ok: true, migrated: false, reason: 'account-already-has-data', skipped };
  }

  const { error } = await supabase
    .from('user_data')
    .upsert(payload, { onConflict: 'user_id' });
  if (error) {
    return { ok: false, reason: 'upsert-failed', error };
  }
  return { ok: true, migrated: true, skipped, counts: {
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
