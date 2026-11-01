// Google sign-in through Google Identity Services: Google's own button opens a Google popup that
// names this site, and hands back an ID token that the backend trades for a session
// (auth.googleIdToken). The redirect flow sends the student through the Supabase project's
// address, which Google then shows as the app being signed in to.
//
// Google answers only on the OAuth client's Authorized JavaScript origins. The sign-in sheet uses
// it when the build has VITE_GOOGLE_CLIENT_ID; the Chula wall (ui/ChulaWall.jsx) on the origins in
// config.js GOOGLE_ORIGINS, with One Tap beside the button and the Chula domain as the hint.

const SRC = 'https://accounts.google.com/gsi/client';
const LOAD_MS = 8000;
let loading = null;

function load() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      // a script that neither loads nor fails (a stalled network) must not leave an empty slot
      const timer = setTimeout(() => { loading = null; reject(new Error('โหลดปุ่ม Google ไม่สำเร็จ')); }, LOAD_MS);
      s.src = SRC;
      s.async = true;
      s.onload = () => { clearTimeout(timer); resolve(); };
      s.onerror = () => { clearTimeout(timer); loading = null; reject(new Error('โหลดปุ่ม Google ไม่สำเร็จ')); };
      document.head.appendChild(s);
    });
  }
  return loading;
}

const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/**
 * Draw Google's button into `el`. On a choice, `onCredential(idToken, rawNonce)` runs; Google is
 * given the SHA-256 of the nonce and the backend checks the raw one against the token. `hd` lists
 * accounts on that hosted domain (the database, not the hint, decides who is let in); `prompt`
 * shows One Tap beside the button.
 * @returns {Promise<() => void>} clean-up
 */
export async function renderGoogleButton(el, { clientId, theme, width, onCredential, hd = '', prompt = false, text = 'continue_with' }) {
  await load();
  const raw = hex(crypto.getRandomValues(new Uint8Array(16)));
  const hashed = hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))));
  const id = window.google.accounts.id;
  id.initialize({
    client_id: clientId,
    nonce: hashed,
    ...(hd ? { hd } : {}),
    ux_mode: 'popup',
    itp_support: true,
    auto_select: false,
    cancel_on_tap_outside: true,
    callback: (res) => { if (res?.credential) onCredential(res.credential, raw); },
  });
  id.renderButton(el, {
    type: 'standard',
    theme,
    size: 'large',
    shape: 'pill',
    text,
    logo_alignment: 'left',
    locale: 'th',
    width: Math.min(400, Math.max(200, Math.round(width))),
  });
  if (prompt) {
    try { id.prompt(); } catch { /* the button still works */ }
  }
  return () => {
    if (prompt) { try { id.cancel(); } catch { /* not shown */ } }
    el.replaceChildren();
  };
}
