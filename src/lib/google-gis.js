// ============================================================
// google-gis — Google Identity Services (client-side ID token flow)
// ============================================================
//
// Why this exists:
//   Supabase's redirect-based OAuth flow (`signInWithOAuth({provider:
//   'google'})`) routes the browser through
//     https://<your-project>.supabase.co/auth/v1/callback?code=…
//   for a fraction of a second. Users see the raw Supabase URL in
//   their address bar mid-flow and the project ID leaks. To hide it,
//   Supabase Pro offers a custom auth domain ($25/mo) — or we can
//   bypass the redirect entirely by using Google Identity Services
//   (GIS) on the client.
//
// Flow (GIS):
//   1. User clicks the Google button.
//   2. GIS opens a Google-hosted popup.
//   3. Google returns an ID token (JWT) directly to our page —
//      NEVER touches the Supabase callback URL.
//   4. We call `supabase.auth.signInWithIdToken({provider:'google',
//      token, nonce})` which trades the JWT for a Supabase session.
//
// Setup requirements (one-time, Palm-side):
//   1. Google Cloud Console → APIs & Services → Credentials → the
//      OAuth 2.0 Client ID that's already wired into Supabase Auth
//      → Authorized JavaScript origins:
//         https://vetmock.vercel.app
//         http://localhost:5173
//         https://vetmock.com (added 2026-10-12)
//   2. Vercel env vars → VITE_GOOGLE_CLIENT_ID = the OAuth client ID
//      (the one ending in .apps.googleusercontent.com — public, safe
//      in client code).
//   3. Redeploy.
//
// Until VITE_GOOGLE_CLIENT_ID is set, `isGoogleGisAvailable()` returns
// false and callers fall back to the redirect flow. Zero regression.
// ============================================================

const GIS_SRC = 'https://accounts.google.com/gsi/client';
let _gisPromise = null;

// Fire the same vmx-auth-changed event that lib/supabase.js helpers
// dispatch after a successful sign-in. useAuth.js subscribes to this
// event and uses it to load the SDK + attach onAuthStateChange
// (Path B). Without this dispatch on the GIS path, useAuth never
// hydrates after Google sign-in → user is "signed in" inside Supabase
// but the React UI still shows logged-out state until manual refresh.
// Bug Palm reported 2026-05-18: "พอล็อคอินสำเร็จแล้วต้องรีเฟรช".
function notifyAuthChanged() {
  if (typeof window !== 'undefined') {
    try { window.dispatchEvent(new CustomEvent('vmx-auth-changed')); } catch { /* noop */ }
  }
}

/** Lazy-load the GIS script. Idempotent; a failed load is tried again on the next call. */
function loadGisScript() {
  if (_gisPromise) return _gisPromise;
  _gisPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'));
    if (window.google?.accounts?.id) return resolve();
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      // Already inserted — wait for load
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => { existing.remove(); reject(new Error('GIS load failed')); }, { once: true });
      return;
    }
    const s = document.createElement('script');
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    // A failed tag fires no event again: the next call must insert a fresh one, not wait on it.
    s.onerror = () => { s.remove(); reject(new Error('GIS load failed')); };
    document.head.appendChild(s);
  // Drop the memo on failure, as getSupabase does: one load that failed (campus
  // wifi dropping, a page opened offline) otherwise fails every later button and
  // sign-in in this tab at once, and sign-in falls back to the redirect.
  }).catch((err) => { _gisPromise = null; throw err; });
  return _gisPromise;
}

// Google answers GIS only on the Authorized JavaScript origins above.
// https://vetmock.com was added to the VetMock Web client on 2026-10-12
// (beside vetmock.vercel.app and localhost:5173), so sign-in there uses the
// popup flow. If an origin is ever removed from the client, remove it here.
/** Whether Google lets this origin use the popup flow. */
export function gisOriginAllowed(origin) {
  if (origin === 'https://vetmock.vercel.app' || origin === 'https://vetmock.com') return true;
  return typeof origin === 'string' && /^http:\/\/localhost(:\d+)?$/.test(origin);
}

/**
 * True iff GIS is configured (env var present + browser context) on an
 * origin Google accepts. Caller uses this to decide between GIS popup and
 * redirect flow.
 */
export function isGoogleGisAvailable() {
  if (typeof window === 'undefined') return false;
  // Inside the Android app Google refuses this popup; signInWithGoogle uses Android's account sheet there.
  if (window.VetMockApp) return false;
  return !!import.meta.env.VITE_GOOGLE_CLIENT_ID && gisOriginAllowed(window.location.origin);
}

// Hash a raw nonce with SHA-256, return hex string. Supabase expects
// us to send the RAW nonce; Google receives the HASH; Supabase then
// hashes the raw nonce we send + compares to id_token.nonce claim.
async function sha256Hex(input) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function randomNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sign in with Google via GIS. Returns the Supabase session data.
 *
 * @param {{ supabase: any }} args — pass an authenticated Supabase
 *   client. We don't import getSupabase() here to keep this module
 *   side-effect-free (testable + reusable).
 */
export async function signInWithGoogleGis({ supabase, hd = '', link = false }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('NO_GOOGLE_CLIENT_ID');
  if (!supabase) throw new Error('Supabase client required');

  await loadGisScript();
  if (!window.google?.accounts?.id) throw new Error('GIS not available');

  const rawNonce = randomNonce();
  const hashedNonce = await sha256Hex(rawNonce);

  return new Promise((resolve, reject) => {
    // GIS state shared between init + button render
    let resolved = false;
    const finish = (err, data) => {
      if (resolved) return;
      resolved = true;
      if (err) reject(err);
      else resolve(data);
    };

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        // GIS receives the HASHED nonce in its 'nonce' field. The
        // resulting id_token will contain this hash in its 'nonce'
        // claim, which Supabase will verify by re-hashing the raw
        // nonce we pass to signInWithIdToken.
        nonce: hashedNonce,
        callback: async (response) => {
          if (!response?.credential) {
            finish(new Error('No credential returned from GIS'));
            return;
          }
          try {
            // link: add this Google identity to the account already signed in
            // (the Chula wall's เชื่อมบัญชีจุฬา), instead of signing in with it.
            const credentials = { provider: 'google', token: response.credential, nonce: rawNonce };
            const { data, error } = link
              ? await supabase.auth.linkIdentity(credentials)
              : await supabase.auth.signInWithIdToken(credentials);
            if (error) {
              finish(error);
            } else {
              notifyAuthChanged();
              finish(null, data);
            }
          } catch (e) {
            finish(e);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        // Google lists only accounts on this hosted domain (student.chula.ac.th
        // for the Chula wall); with none signed in the prompt is not displayed
        // and the caller falls back to the redirect.
        ...(hd ? { hd } : {}),
        // Apple-style flow style — pops a sheet instead of full-page
        ux_mode: 'popup',
        itp_support: true, // Better Safari ITP handling
      });

      // Show the GIS One Tap prompt. If it's suppressed (rate-limited,
      // previously dismissed, browser config), we don't fail — the
      // caller can fall through to renderButton or redirect flow.
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
          // Don't reject yet — give the user a button-driven path.
          // Many browsers suppress One Tap after a single dismiss;
          // the AuthView will show the explicit button as primary.
          finish(new Error('GIS_PROMPT_SUPPRESSED'));
        } else if (notification.isDismissedMoment?.() && notification.getDismissedReason?.() !== 'credential_returned') {
          // Closed by the user: without this the promise never settled and
          // the button stayed busy until the caller's safety timeout.
          finish(new Error('GIS_POPUP_CLOSED'));
        }
      });
    } catch (e) {
      finish(e);
    }
  });
}

/**
 * Render an inline Google button into a container element. Returns
 * a cleanup function. Use this when One Tap is suppressed and you
 * want a deterministic button to click.
 *
 * @param {HTMLElement} container
 * @param {{ supabase, onSuccess?, onError?, theme?: 'filled_blue' | 'outline' }} opts
 */
export async function renderGoogleGisButton(container, opts = {}) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('NO_GOOGLE_CLIENT_ID');
  if (!container) throw new Error('container required');
  if (!opts.supabase) throw new Error('Supabase client required');

  await loadGisScript();
  if (!window.google?.accounts?.id) throw new Error('GIS not available');

  const rawNonce = randomNonce();
  const hashedNonce = await sha256Hex(rawNonce);

  window.google.accounts.id.initialize({
    client_id: clientId,
    nonce: hashedNonce,
    // hd lists only accounts on that hosted domain first (the Chula wall);
    // link adds the identity to the account already signed in.
    ...(opts.hd ? { hd: opts.hd } : {}),
    callback: async (response) => {
      if (!response?.credential) {
        opts.onError?.(new Error('No credential'));
        return;
      }
      opts.onCredential?.();
      try {
        const credentials = { provider: 'google', token: response.credential, nonce: rawNonce };
        const { data, error } = opts.link
          ? await opts.supabase.auth.linkIdentity(credentials)
          : await opts.supabase.auth.signInWithIdToken(credentials);
        if (error) {
          opts.onError?.(error);
        } else {
          notifyAuthChanged();
          opts.onSuccess?.(data);
        }
      } catch (e) {
        opts.onError?.(e);
      }
    },
    auto_select: false,
    ux_mode: 'popup',
    itp_support: true,
  });

  window.google.accounts.id.renderButton(container, {
    theme: opts.theme || 'filled_blue',
    size: 'large',
    type: 'standard',
    shape: opts.shape || 'rectangular',
    text: opts.text || 'signin_with',
    logo_alignment: opts.logoAlignment || 'left',
    locale: 'th',
    // Google caps the button at 400 px.
    width: Math.min(400, container.clientWidth || 280),
  });
  // One Tap beside the button, as Google recommends: one tap when the account is
  // already signed in to Google here, and the button when it is not.
  if (opts.prompt) {
    try { window.google.accounts.id.prompt(); } catch { /* the button still works */ }
  }

  // Return a teardown so the caller can re-render on theme/lang change
  return () => {
    try { container.innerHTML = ''; } catch { /* noop */ }
  };
}
