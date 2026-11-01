// ============================================================
// gis.js — Google's own sign-in button (Google Identity Services)
// ============================================================
// The pattern of src/lib/google-gis.js in the main app. Google's button opens a
// Google window that names this site and hands back an ID token, which the
// account trades for a session (signInWithIdToken). The redirect instead walks
// through the database's own address, which Google's screen then shows as
// "continue to ...supabase.co", so it is only the fallback: when the script
// cannot load, or on an origin the OAuth client does not list.
//
// Google is given the SHA-256 of a random nonce; the raw one goes with the token
// to the account, which hashes it again and compares it with the token's claim.
// ============================================================

const SRC = 'https://accounts.google.com/gsi/client';
// Vite inlines import.meta.env; under node --test it is undefined
const ENV = import.meta.env || {};

/** VetMock's Google OAuth client (a public id), the main app's VITE_GOOGLE_CLIENT_ID. */
export const GIS_CLIENT_ID = ENV.VITE_GOOGLE_CLIENT_ID || '807323754507-v4kctbouiqucot3e0isqju1mq1jl9k2u.apps.googleusercontent.com';

/** The Authorised JavaScript origins on that client that serve this app. */
const ORIGINS = ['https://ai.vetmock.com'];

/** Whether Google answers this origin; anywhere else the house button redirects. */
export const gisOriginAllowed = (origin) => ORIGINS.includes(origin);

/** True when Google's button can run here: a client id and an origin Google lists. */
export function gisUsable(origin = globalThis.location?.origin) {
  return Boolean(GIS_CLIENT_ID) && gisOriginAllowed(origin);
}

const LOAD_MS = 8000;
let loading = null;

/** Load Google's script once; a failure (blocked, offline, slow past 8 s) is not remembered. */
export function loadGis({ timeoutMs = LOAD_MS } = {}) {
  if (globalThis.window?.google?.accounts?.id) return Promise.resolve();
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timer = setTimeout(() => reject(new Error('GIS load timeout')), timeoutMs);
      script.src = SRC;
      script.async = true;
      script.onload = () => { clearTimeout(timer); if (window.google?.accounts?.id) resolve(); else reject(new Error('GIS not available')); };
      script.onerror = () => { clearTimeout(timer); reject(new Error('GIS load failed')); };
      document.head.appendChild(script);
    }).catch((error) => { loading = null; throw error; });
  }
  return loading;
}

const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/** A random nonce and its SHA-256, the pair a Google ID token is checked with. */
export async function noncePair() {
  const raw = hex(crypto.getRandomValues(new Uint8Array(16)));
  const hashed = hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))));
  return { raw, hashed };
}

/**
 * Draw Google's button into `el`, with One Tap beside it when `prompt` is set. On a choice,
 * `onCredential(idToken, rawNonce)` runs. `hd` lists accounts on that hosted domain
 * (student.chula.ac.th, or chula.ac.th for staff); the database, not the hint, decides.
 * @returns {Promise<() => void>} clean-up (empties the slot and closes One Tap)
 */
export async function renderGoogleButton(el, { clientId = GIS_CLIENT_ID, hd = '', theme = 'outline', shape = 'pill', text = 'signin_with', prompt = false, onCredential }) {
  if (!clientId) throw new Error('NO_GOOGLE_CLIENT_ID');
  if (!el) throw new Error('container required');
  await loadGis();
  const { raw, hashed } = await noncePair();
  const id = window.google.accounts.id;
  id.initialize({
    client_id: clientId,
    nonce: hashed,
    ...(hd ? { hd } : {}),
    ux_mode: 'popup',
    itp_support: true,
    auto_select: false,
    cancel_on_tap_outside: true,
    callback: (response) => { if (response?.credential) onCredential?.(response.credential, raw); },
  });
  id.renderButton(el, {
    type: 'standard',
    theme,
    size: 'large',
    shape,
    text,
    logo_alignment: 'left',
    locale: 'th',
    // Google caps the button at 400 px
    width: Math.min(400, Math.max(200, Math.round(el.clientWidth || 280))),
  });
  if (prompt) {
    try { id.prompt(); } catch { /* the button still works */ }
  }
  return () => {
    try { id.cancel(); } catch { /* not shown */ }
    try { el.replaceChildren(); } catch { /* gone */ }
  };
}
