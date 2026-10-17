// Signing in: Google, LINE, or a link by email. It is VetMock's account, so a student who already
// uses vetmock.com signs in as themselves, and one who starts here gets an account that works
// there too. Practice never needs it.

import { useEffect, useRef, useState } from 'react';
import { Sheet } from '../../components/Sheet.jsx';
import { Icon } from '../../components/Icon.jsx';
import { GOOGLE_CLIENT_ID, LINE_LIFF_ID, MODE } from '../config.js';
import { signIn } from '../account.js';
import '../community.css';

/** Google's own G, as its sign-in guidelines ask a sign-in button to carry. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/** LINE's own logo: the speech bubble with LINE cut out of it, white on the button's LINE
 *  green (Simple Icons path data, CC0; the mark is LINE Corporation's). */
function LineMark() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <path fill="#fff" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

/** Google's own button (online/gis.js), so Google's popup names this site. If it cannot load,
 *  onFail hands the place back to the redirect button. */
function GoogleGisButton({ onToken, onFail }) {
  const ref = useRef(null);
  useEffect(() => {
    let undo = () => {};
    let gone = false;
    const el = ref.current;
    import('../gis.js')
      .then(({ renderGoogleButton }) => renderGoogleButton(el, {
        clientId: GOOGLE_CLIENT_ID,
        theme: document.documentElement.dataset.theme === 'dark' ? 'filled_black' : 'outline',
        width: el.clientWidth,
        onCredential: onToken,
      }))
      .then((u) => { if (gone) u(); else undo = u; })
      .catch(() => { if (!gone) onFail(); });
    return () => { gone = true; undo(); };
  }, [onToken, onFail]);
  return <div ref={ref} className="signin-gis" aria-label="ดำเนินการต่อด้วย Google" />;
}

export default function SignInSheet({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(null);
  const [sent, setSent] = useState('');
  const [error, setError] = useState('');

  const go = async (method, arg, extra) => {
    setBusy(method);
    setError('');
    try {
      const res = await signIn(method, arg, extra);
      if (method === 'email' && res?.sent) setSent(arg);
    } catch (err) {
      setError(err?.message || 'เข้าสู่ระบบไม่สำเร็จ ลองอีกครั้ง');
    } finally {
      setBusy(null);
    }
  };
  const lineReady = MODE === 'demo' || !!LINE_LIFF_ID;
  const [gis, setGis] = useState(MODE === 'live' && !!GOOGLE_CLIENT_ID);
  const onGisToken = useRef((token, nonce) => go('googleIdToken', token, nonce)).current;
  const onGisFail = useRef(() => setGis(false)).current;

  return (
    <Sheet open={open} onClose={onClose} title="เข้าสู่ระบบ">
      {sent ? (
        <div className="signin-sent" role="status">
          <span className="signin-sent-mark"><Icon name="mail" size={22} /></span>
          <p>ส่งลิงก์ไปที่ <b>{sent}</b> แล้ว เปิดอีเมลในเครื่องนี้แล้วกดลิงก์เพื่อเข้าสู่ระบบ</p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSent('')}>ใช้อีเมลอื่น</button>
        </div>
      ) : (
        <>
          <p className="sheet-p">ใช้บัญชีเดียวกับ VetMock ได้เลย ถ้ายังไม่มี ระบบจะสร้างให้ใหม่</p>
          <div className="signin-ways">
            {gis ? (
              <GoogleGisButton onToken={onGisToken} onFail={onGisFail} />
            ) : (
              <button type="button" className="signin-way signin-google" onClick={() => go('google')} disabled={!!busy} data-autofocus>
                <span className="signin-logo"><GoogleMark /></span>
                <span>ดำเนินการต่อด้วย Google</span>
                {busy === 'google' && <span className="spinner" aria-hidden="true" />}
              </button>
            )}
            {lineReady && (
              <button type="button" className="signin-way signin-line" onClick={() => go('line')} disabled={!!busy}>
                <span className="signin-logo"><LineMark /></span>
                <span>ดำเนินการต่อด้วย LINE</span>
                {busy === 'line' && <span className="spinner" aria-hidden="true" />}
              </button>
            )}
          </div>
          <div className="signin-or"><span>หรือรับลิงก์ทางอีเมล</span></div>
          <form className="signin-email" onSubmit={(e) => { e.preventDefault(); if (email.trim()) go('email', email.trim()); }}>
            <label className="sr" htmlFor="signin-email">อีเมล</label>
            <input id="signin-email" type="email" inputMode="email" autoComplete="email" placeholder="อีเมลของคุณ" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" className="btn btn-ink" disabled={!!busy || !email.trim()}>
              {busy === 'email' ? <span className="spinner" aria-hidden="true" /> : 'ส่งลิงก์'}
            </button>
          </form>
        </>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      <p className="hint signin-fine">การฝึกและผลสอบยังเก็บในเครื่องนี้เหมือนเดิม ไม่ต้องเข้าสู่ระบบก็ฝึกได้ บัญชีใช้สำหรับโปรไฟล์ ชุมชน และแชท{MODE === 'demo' ? ' (โหมดทดลอง: กดแล้วเข้าสู่ระบบทันทีด้วยบัญชีจำลอง)' : ''}</p>
    </Sheet>
  );
}
