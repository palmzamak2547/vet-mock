// ============================================================
// line-liff — LINE LIFF + Edge Function bridge for VetMock auth
// ============================================================
//
// Why this file exists:
//   Supabase Auth does NOT natively support LINE OAuth (their native
//   list covers google/apple/facebook/azure/kakao + enterprise IdPs).
//   The official "Add LINE Provider in Supabase Dashboard" doesn't
//   exist — clicking signInWithOAuth({provider:'line'}) just returns
//   400 "Unsupported provider".
//
//   This module bridges LINE → Supabase manually:
//     1. Load LINE LIFF SDK on demand (~12 KB gzip).
//     2. liff.init({ liffId }) + liff.login() → user signs in on LINE.
//     3. Read LIFF-issued ID token (a JWT signed by LINE).
//     4. POST it to our Edge Function `/functions/v1/line-auth`,
//        which verifies the JWT against LINE's JWKS and returns a
//        Supabase magic-link URL.
//     5. Browser navigates to that magic link → Supabase establishes
//        session normally → onAuthStateChange fires → user is in.
//
// Setup checklist (Palm-side, ~10 min):
//   ┌─ LINE Developer Console (https://developers.line.biz/console/)
//   │  1. Create or open a Provider.
//   │  2. "Create a new channel" → LINE Login.
//   │  3. Set scopes: openid, profile, email.
//   │  4. Tab "LIFF" → "Add":
//   │       - Endpoint URL: https://vetmock.vercel.app
//   │       - Scope: openid profile email
//   │       - Size: Full
//   │     Copy the LIFF ID (format: 1234567890-abcdefgh).
//   │  5. Tab "Basic settings" → copy the Channel ID (numeric).
//   └─ Supabase
//      6. Edge Function env:
//           supabase secrets set LINE_CHANNEL_ID=<channel_id>
//      7. Deploy: supabase functions deploy line-auth --no-verify-jwt
//   └─ Vercel
//      8. Add env: VITE_LINE_LIFF_ID = <liff_id>
//      9. Redeploy (or push any commit).
//
// Until VITE_LINE_LIFF_ID is set, isLiffAvailable() returns false and
// AuthView can fall back to "LINE coming soon" UI gracefully.
// ============================================================

// Build marker: 2026-05-17 — bumped to force a fresh Vercel build
// that picks up VITE_LINE_LIFF_ID env (previous redeploy used cache).
let _liffPromise = null;

/**
 * Lazy-load the LIFF SDK + initialise with the configured LIFF ID.
 * Idempotent — repeat calls reuse the same init promise.
 *
 * Returns the `liff` instance ready to use.
 */
async function getLiff() {
  if (_liffPromise) return _liffPromise;
  const liffId = import.meta.env.VITE_LINE_LIFF_ID;
  if (!liffId) {
    _liffPromise = null;
    throw new Error('NO_LIFF_ID');
  }
  _liffPromise = (async () => {
    const mod = await import('@line/liff');
    const liff = mod.default;
    await liff.init({ liffId });
    return liff;
  })().catch((err) => {
    // Reset on failure so the next call retries cleanly.
    _liffPromise = null;
    throw err;
  });
  return _liffPromise;
}

/**
 * True iff LIFF is configured (env var present + browser context).
 * Used by AuthView to decide whether to render the LINE button.
 */
export function isLiffAvailable() {
  if (typeof window === 'undefined') return false;
  return Boolean(import.meta.env.VITE_LINE_LIFF_ID);
}

/**
 * Resolve the Edge Function URL for line-auth.
 * Constructed from VITE_SUPABASE_URL so deploys to different projects
 * route correctly without an extra env.
 */
function getLineAuthEndpoint() {
  const base = import.meta.env.VITE_SUPABASE_URL;
  if (!base) throw new Error('VITE_SUPABASE_URL not set');
  return `${base.replace(/\/$/, '')}/functions/v1/line-auth`;
}

/**
 * Sign in with LINE.
 *
 * 1. Ensure LIFF is initialised.
 * 2. If not LINE-logged-in, kick off liff.login() — this REDIRECTS
 *    the browser to LINE for consent. When it comes back, this same
 *    function should be re-invoked to pick up the id token.
 * 3. Grab the LINE ID token + POST to our Edge Function.
 * 4. Browser navigates to the returned magic-link URL; Supabase
 *    handles the rest.
 *
 * The caller in AuthView wraps this in a try/catch and surfaces a
 * friendly Thai message if any step fails.
 */
export async function signInWithLineViaLiff() {
  const liff = await getLiff();

  // If not already logged in to LINE, redirect to LINE login.
  // The user lands back at this same page (the LIFF endpoint URL).
  // The redirectUri default is the current URL, which is fine.
  if (!liff.isLoggedIn()) {
    liff.login();
    // liff.login() triggers window.location change synchronously;
    // returning here is a defensive no-op.
    return null;
  }

  // Pull the LINE-issued ID token (a JWT we'll forward to Supabase).
  const idToken = liff.getIDToken();
  if (!idToken) {
    throw new Error('LIFF_NO_ID_TOKEN');
  }

  // Exchange LINE ID token for a Supabase magic-link via the Edge Function.
  const endpoint = getLineAuthEndpoint();
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      // Edge Function accepts anon-key callers (deployed --no-verify-jwt
      // for this gateway endpoint, but the apikey header is still
      // expected for project routing).
      ...(import.meta.env.VITE_SUPABASE_ANON_KEY
        ? { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY }
        : {}),
    },
    body: JSON.stringify({
      id_token: idToken,
      redirect_to: window.location.origin,
    }),
  });

  if (!resp.ok) {
    let detail = `HTTP ${resp.status}`;
    try {
      const j = await resp.json();
      detail = j?.error || j?.detail || detail;
    } catch { /* keep status-only message */ }
    const e = new Error(`LINE_BRIDGE_FAILED:${detail}`);
    e.rawMessage = detail;
    throw e;
  }

  const data = await resp.json();
  if (!data?.action_link) {
    throw new Error('LINE_BRIDGE_NO_ACTION_LINK');
  }

  // Hand off to Supabase magic-link flow. This is a top-level
  // navigation — Supabase's auth listener will catch the session
  // on the resulting redirect back to our origin.
  window.location.href = data.action_link;
  return data;
}

/**
 * Best-effort logout — clears the LIFF session if loaded.
 * Safe to call even when LIFF isn't initialised.
 */
export async function liffLogoutIfInitialised() {
  if (!_liffPromise) return;
  try {
    const liff = await _liffPromise;
    if (liff.isLoggedIn()) liff.logout();
  } catch {
    /* swallow — logout failures shouldn't block sign-out flow */
  }
}
