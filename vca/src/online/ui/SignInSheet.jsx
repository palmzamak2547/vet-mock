// Signing in: Google, LINE, or a link by email. It is VetMock's account, so a student who already
// uses vetmock.com signs in as themselves, and one who starts here gets an account that works
// there too. Practice never needs it.

import { useState } from 'react';
import { Sheet } from '../../components/Sheet.jsx';
import { Icon } from '../../components/Icon.jsx';
import { LINE_LIFF_ID, MODE } from '../config.js';
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

/** LINE's speech bubble, white on the button's LINE green, which carries the name beside it. */
function LineMark() {
  return (
    <svg viewBox="0 0 48 48" width="24" height="24" aria-hidden="true" focusable="false">
      <path fill="#fff" d="M24 7C13.5 7 5 13.9 5 22.4c0 7.6 6.7 14 15.8 15.2.6.1 1.5.4 1.7 1 .2.5.1 1.3.1 1.8l-.3 1.6c-.1.5-.4 1.9 1.7 1 2-.8 10.9-6.4 14.8-11 2.7-3 4.2-6 4.2-9.4C43 13.9 34.5 7 24 7z" />
    </svg>
  );
}

export default function SignInSheet({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(null);
  const [sent, setSent] = useState('');
  const [error, setError] = useState('');

  const go = async (method, arg) => {
    setBusy(method);
    setError('');
    try {
      const res = await signIn(method, arg);
      if (method === 'email' && res?.sent) setSent(arg);
    } catch (err) {
      setError(err?.message || 'เข้าสู่ระบบไม่สำเร็จ ลองอีกครั้ง');
    } finally {
      setBusy(null);
    }
  };
  const lineReady = MODE === 'demo' || !!LINE_LIFF_ID;

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
            <button type="button" className="signin-way signin-google" onClick={() => go('google')} disabled={!!busy} data-autofocus>
              <span className="signin-logo"><GoogleMark /></span>
              <span>ต่อด้วย Google</span>
              {busy === 'google' && <span className="spinner" aria-hidden="true" />}
            </button>
            {lineReady && (
              <button type="button" className="signin-way signin-line" onClick={() => go('line')} disabled={!!busy}>
                <span className="signin-logo"><LineMark /></span>
                <span>ต่อด้วย LINE</span>
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
