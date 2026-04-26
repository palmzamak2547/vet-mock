import { useState, useEffect } from 'react';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  sendPasswordReset,
  updatePassword,
} from '../lib/supabase.js';
import { thaiAuthError } from '../lib/auth-errors.js';

// AuthView — sign in / sign up / forgot password
//
// Modes:
//   'signin'  → email + password Login
//   'signup'  → username + email + password
//   'reset'   → email-only, sends reset link via Supabase
//
// UX features (Level 2):
//   • Thai error messages (lib/auth-errors.js)
//   • Show/hide password toggle (👁)
//   • Forgot password flow + success banner
//   • Defensive email-confirmation hint when signup returns no session
//   • Already-signed-in detection (auto-redirect via prop)
//
// Smart features (Level 3) layer on top of this in a follow-up commit.
export default function AuthView({ onBack, onSuccess, user }) {
  // Detect password-reset deep link (`?auth=reset`) on mount so the
  // initial mode lands users straight into the update-password flow.
  // When user clicks the link in their reset email, Supabase's SDK
  // (with detectSessionInUrl) auto-creates a temporary "recovery"
  // session — meaning `user` is already populated by the time we
  // render. We therefore can't auto-redirect on `user` (BUG 7) until
  // AFTER deciding mode, otherwise the recovery flow bounces home.
  const initialMode = (() => {
    if (typeof window === 'undefined') return 'signin';
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === 'reset') return 'update-password';
    } catch {}
    return 'signin';
  })();
  const [mode, setMode] = useState(initialMode); // signin | signup | reset | update-password

  // BUG 7 — already signed in → bounce to home immediately, EXCEPT
  // when we landed here via a password-reset link (in which case the
  // existing session is the recovery session and we want to stay).
  useEffect(() => {
    if (user && mode !== 'update-password' && onSuccess) onSuccess();
  }, [user, mode, onSuccess]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [emailVerifyPending, setEmailVerifyPending] = useState(null); // null | { email }
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // Reset banners when switching modes
  useEffect(() => {
    setError(''); setInfo(''); setEmailVerifyPending(null);
  }, [mode]);

  const submit = async (e) => {
    e?.preventDefault();
    setError(''); setInfo(''); setEmailVerifyPending(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!username.trim()) throw new Error('กรุณาใส่ชื่อ username');
        if (password.length < 6) throw new Error('รหัสผ่านต้องยาว 6 ตัวขึ้นไป');
        const result = await signUpWithEmail(email, password, username.trim());
        // If Supabase returned a session → email confirmation is OFF, user is in
        if (result?.session) {
          if (onSuccess) onSuccess();
          return;
        }
        // No session → either email-confirmation is ON, or sign-in needed
        try {
          await signInWithEmail(email, password);
          if (onSuccess) onSuccess();
        } catch (signInErr) {
          // Most common reason: email confirmation pending
          const msg = thaiAuthError(signInErr);
          if (/ยืนยันอีเมล|confirm/i.test(msg) || /not confirmed/i.test(signInErr.message || '')) {
            setEmailVerifyPending({ email });
          } else {
            setInfo('✓ สมัครสำเร็จ! ลอง Login ด้วย email + password ของคุณ');
            setMode('signin');
          }
        }
      } else if (mode === 'reset') {
        if (!email.trim()) throw new Error('กรุณาใส่อีเมล');
        await sendPasswordReset(email.trim());
        setInfo(`✓ ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ${email} แล้ว — เช็คอีเมล (รวม junk folder)`);
      } else if (mode === 'update-password') {
        if (newPassword.length < 6) throw new Error('รหัสผ่านใหม่ต้องยาว 6 ตัวขึ้นไป');
        if (newPassword !== newPasswordConfirm) throw new Error('รหัสผ่านยืนยันไม่ตรงกัน');
        await updatePassword(newPassword);
        setInfo('✓ เปลี่ยนรหัสผ่านสำเร็จ — กลับสู่หน้าแรกใน 2 วินาที');
        // Clean the ?auth=reset query param from URL so refreshing
        // doesn't re-trigger this mode forever.
        try { window.history.replaceState(null, '', window.location.pathname); } catch {}
        setTimeout(() => { if (onSuccess) onSuccess(); }, 2000);
      } else {
        // signin
        await signInWithEmail(email, password);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(thaiAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setError(''); setInfo(''); setLoading(true);
    try { await signInWithGoogle(); }
    catch (err) { setError(thaiAuthError(err)); setLoading(false); }
  };

  // ── Heading text per mode ──
  const heading = {
    signin:           { title: 'ยินดีต้อนรับ',     sub: 'Login เพื่อ sync progress และ join group กับเพื่อน',  cta: 'Login' },
    signup:           { title: 'สมัครใช้งาน',     sub: 'สร้าง account ใหม่ — ฟรี ไม่มีค่าใช้จ่าย',           cta: 'สมัคร' },
    reset:            { title: 'ลืมรหัสผ่าน?',    sub: 'ใส่อีเมลของคุณ เราจะส่งลิงก์รีเซ็ตให้',                cta: 'ส่งลิงก์รีเซ็ต' },
    'update-password':{ title: 'ตั้งรหัสผ่านใหม่', sub: 'ใส่รหัสผ่านใหม่ที่อยากใช้',                          cta: 'บันทึกรหัสผ่าน' },
  }[mode];

  return (
    <>
      <div className="vmx-hero">
        <h1>{heading.title} <em>VetMock</em></h1>
        <p>{heading.sub}</p>
      </div>

      <div className="vmx-config-panel" style={{ maxWidth: 440, margin: '0 auto' }}>
        {/* Email-verification pending banner */}
        {emailVerifyPending && (
          <div style={{ padding: 14, borderRadius: 12, background: 'rgba(184, 137, 64, 0.12)', border: '1px solid var(--clr-gold)', marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
            📧 <strong>ตรวจอีเมลของคุณ</strong><br/>
            <span style={{ color: 'var(--clr-ink-soft)' }}>
              เราส่งลิงก์ยืนยันไปที่ <code>{emailVerifyPending.email}</code> · คลิกลิงก์นั้นเพื่อยืนยันก่อน Login (อาจอยู่ใน junk/spam)
            </span>
          </div>
        )}

        {/* Google OAuth — hide on reset / update-password mode */}
        {mode !== 'reset' && mode !== 'update-password' && (
          <>
            <button className="vmx-btn vmx-btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginBottom: 20 }} onClick={google} disabled={loading}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                เข้าสู่ระบบด้วย Google
              </span>
            </button>

            <div style={{ textAlign: 'center', margin: '16px 0', fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
              — หรือใช้อีเมล —
            </div>
          </>
        )}

        <form onSubmit={submit} noValidate>
          {mode === 'signup' && (
            <div className="vmx-form-group">
              <label>ชื่อแสดง (Username)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.slice(0, 30))}
                placeholder="เช่น vet86_ping"
                maxLength={30}
                autoComplete="username"
              />
            </div>
          )}

          {mode !== 'update-password' && (
            <div className="vmx-form-group">
              <label>อีเมล</label>
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={254}
              />
            </div>
          )}

          {mode === 'signin' || mode === 'signup' ? (
            <div className="vmx-form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>รหัสผ่าน</span>
                {mode === 'signin' && (
                  <a
                    onClick={() => setMode('reset')}
                    style={{ cursor: 'pointer', color: 'var(--clr-sage)', fontSize: 11, fontWeight: 400, textDecoration: 'underline' }}
                  >
                    ลืมรหัสผ่าน?
                  </a>
                )}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'อย่างน้อย 6 ตัว' : ''}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  style={{ paddingRight: 44, width: '100%', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  style={{
                    position: 'absolute',
                    right: 6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 6,
                    fontSize: 16,
                    color: 'var(--clr-ink-soft)',
                    lineHeight: 1,
                  }}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>
          ) : null}

          {mode === 'update-password' && (
            <>
              <div className="vmx-form-group">
                <label>รหัสผ่านใหม่</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัว"
                  autoComplete="new-password"
                />
              </div>
              <div className="vmx-form-group">
                <label>ยืนยันรหัสผ่านใหม่</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  placeholder="พิมพ์ซ้ำให้ตรง"
                  autoComplete="new-password"
                />
              </div>
              <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--clr-ink-soft)' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
                  แสดงรหัสผ่าน
                </label>
              </div>
            </>
          )}

          {error && (
            <div style={{ padding: 10, borderRadius: 8, background: 'var(--clr-rose-soft)', color: 'var(--clr-ink)', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
              ⚠️ {error}
            </div>
          )}
          {info && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(74, 107, 74, 0.15)', color: 'var(--clr-ink)', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
              {info}
            </div>
          )}

          <button
            type="submit"
            className="vmx-btn vmx-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            disabled={loading}
          >
            {loading ? '⏳ ...' : heading.cta}
          </button>
        </form>

        {/* Mode switch links */}
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--clr-ink-soft)' }}>
          {mode === 'signin' && (
            <>ยังไม่มี account? <a onClick={() => setMode('signup')} style={linkStyle}>สมัครเลย</a></>
          )}
          {mode === 'signup' && (
            <>มี account แล้ว? <a onClick={() => setMode('signin')} style={linkStyle}>Login</a></>
          )}
          {mode === 'reset' && (
            <>จำได้แล้ว? <a onClick={() => setMode('signin')} style={linkStyle}>กลับไป Login</a></>
          )}
        </div>
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 30, justifyContent: 'center' }}>
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onBack}>
          ← ใช้งานแบบไม่ login (single-player)
        </button>
      </div>
    </>
  );
}

const linkStyle = { cursor: 'pointer', color: 'var(--clr-sage)', textDecoration: 'underline' };
