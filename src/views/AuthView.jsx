import { useState } from 'react';
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '../lib/supabase.js';

export default function AuthView({ onBack, onSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const submit = async (e) => {
    e?.preventDefault();
    setError(''); setInfo(''); setLoading(true);
    try {
      if (mode === 'signup') {
        if (!username.trim()) throw new Error('กรุณาใส่ชื่อ username');
        if (password.length < 6) throw new Error('รหัสผ่านต้องยาว 6 ตัวขึ้นไป');
        const result = await signUpWithEmail(email, password, username.trim());
        // If session is returned (email confirmation disabled) — already logged in
        if (result?.session) {
          if (onSuccess) onSuccess();
          return;
        }
        // Fallback: try to sign in immediately
        try {
          await signInWithEmail(email, password);
          if (onSuccess) onSuccess();
        } catch {
          setInfo('✓ สมัครสำเร็จ! กรุณา login ด้วย email + password ของคุณ');
        }
      } else {
        await signInWithEmail(email, password);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Error');
    } finally { setLoading(false); }
  };

  const google = async () => {
    setError(''); setLoading(true);
    try { await signInWithGoogle(); } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <>
      <div className="vmx-hero">
        <h1>{mode === 'signin' ? 'ยินดีต้อนรับ' : 'สมัครใช้งาน'} <em>VetMock</em></h1>
        <p>{mode === 'signin' ? 'Login เพื่อ sync progress และ join group กับเพื่อน' : 'สร้าง account ใหม่ — ฟรี ไม่มีค่าใช้จ่าย'}</p>
      </div>

      <div className="vmx-config-panel" style={{ maxWidth: 440, margin: '0 auto' }}>
        <button className="vmx-btn vmx-btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginBottom: 20 }} onClick={google} disabled={loading}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            เข้าสู่ระบบด้วย Google
          </span>
        </button>

        <div style={{ textAlign: 'center', margin: '16px 0', fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
          — หรือใช้อีเมล —
        </div>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <div className="vmx-form-group">
              <label>ชื่อแสดง (Username)</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="เช่น vet86_ping" required />
            </div>
          )}
          <div className="vmx-form-group">
            <label>อีเมล</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="vmx-form-group">
            <label>รหัสผ่าน</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'อย่างน้อย 6 ตัว' : ''} required autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
          </div>

          {error && <div style={{ padding: 10, borderRadius: 8, background: 'var(--clr-rose-soft)', color: 'var(--clr-ink)', fontSize: 13, marginBottom: 12 }}>⚠️ {error}</div>}
          {info && <div style={{ padding: 10, borderRadius: 8, background: 'rgba(74, 107, 74, 0.15)', color: 'var(--clr-ink)', fontSize: 13, marginBottom: 12 }}>{info}</div>}

          <button type="submit" className="vmx-btn vmx-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={loading}>
            {loading ? '...' : (mode === 'signin' ? 'Login' : 'สมัคร')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--clr-ink-soft)' }}>
          {mode === 'signin' ? (
            <>ยังไม่มี account? <a onClick={() => { setMode('signup'); setError(''); }} style={{ cursor: 'pointer', color: 'var(--clr-sage)', textDecoration: 'underline' }}>สมัครเลย</a></>
          ) : (
            <>มี account แล้ว? <a onClick={() => { setMode('signin'); setError(''); }} style={{ cursor: 'pointer', color: 'var(--clr-sage)', textDecoration: 'underline' }}>Login</a></>
          )}
        </div>
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 30, justifyContent: 'center' }}>
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onBack}>← ใช้งานแบบไม่ login (single-player)</button>
      </div>
    </>
  );
}
