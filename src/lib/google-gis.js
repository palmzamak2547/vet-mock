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

/** Lazy-load the GIS script. Idempotent. */
function loadGisScript() {
  if (_gisPromise) return _gisPromise;
  _gisPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'));
    if (window.google?.accounts?.id) return resolve();
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      // Already inserted — wait for load
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('GIS load failed')), { once: true });
      return;
    }
    const s = document.createElement('script');
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('GIS load failed'));
    document.head.appendChild(s);
  });
  return _gisPromise;
}

/**
 * True iff GIS is configured (env var present + browser context).
 * Caller uses this to decide between GIS popup and redirect flow.
 */
export function isGoogleGisAvailable() {
  if (typeof window === 'undefined') return false;
  return !!import.meta.env.VITE_GOOGLE_CLIENT_ID;
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
export async function signInWithGoogleGis({ supabase }) {
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
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce: rawNonce,
            });
            if (error) finish(error);
            else finish(null, data);
          } catch (e) {
            finish(e);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
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
    callback: async (response) => {
      if (!response?.credential) {
        opts.onError?.(new Error('No credential'));
        return;
      }
      try {
        const { data, error } = await opts.supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
          nonce: rawNonce,
        });
        if (error) opts.onError?.(error);
        else opts.onSuccess?.(data);
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
    shape: 'rectangular',
    text: 'signin_with',
    locale: 'th',
    width: container.clientWidth || 280,
  });

  // Return a teardown so the caller can re-render on theme/lang change
  return () => {
    try { container.innerHTML = ''; } catch { /* noop */ }
  };
}
