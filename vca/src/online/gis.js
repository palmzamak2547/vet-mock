// Google sign-in through Google Identity Services: Google's own button opens a Google popup that
// names this site, and hands back an ID token that the backend trades for a session
// (auth.googleIdToken). The redirect flow sends the student through the Supabase project's
// address, which Google then shows as the app being signed in to.
//
// Google answers only on the OAuth client's Authorized JavaScript origins, so this runs only when
// the build has VITE_GOOGLE_CLIENT_ID (set once https://vca.vetmock.com is on that list); without
// it the sheet keeps the redirect button.

const SRC = 'https://accounts.google.com/gsi/client';
let loading = null;

function load() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SRC;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => { loading = null; reject(new Error('โหลดปุ่ม Google ไม่สำเร็จ')); };
      document.head.appendChild(s);
    });
  }
  return loading;
}

const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/**
 * Draw Google's button into `el`. On a choice, `onCredential(idToken, rawNonce)` runs; Google is
 * given the SHA-256 of the nonce and the backend checks the raw one against the token.
 * @returns {Promise<() => void>} clean-up
 */
export async function renderGoogleButton(el, { clientId, theme, width, onCredential }) {
  await load();
  const raw = hex(crypto.getRandomValues(new Uint8Array(16)));
  const hashed = hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))));
  window.google.accounts.id.initialize({
    client_id: clientId,
    nonce: hashed,
    ux_mode: 'popup',
    itp_support: true,
    auto_select: false,
    callback: (res) => { if (res?.credential) onCredential(res.credential, raw); },
  });
  window.google.accounts.id.renderButton(el, {
    type: 'standard',
    theme,
    size: 'large',
    shape: 'pill',
    text: 'continue_with',
    logo_alignment: 'left',
    locale: 'th',
    width: Math.min(400, Math.max(200, Math.round(width))),
  });
  return () => { el.replaceChildren(); };
}
