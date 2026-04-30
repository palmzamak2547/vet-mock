// ============================================================
// AccountSettingsView — manage account (post-login)
// ============================================================
// Sections:
//   • Profile info (email + username · read-only)
//   • Change password
//   • Change email (sends verify link to new email)
//   • Logout all devices (security)
//   • Delete account (danger zone — best-effort client-side delete)
//
// Reachable from:
//   • HomeView when signed in (gear/avatar dropdown)
//   • ⌘K palette → "Account settings"
// ============================================================

import { useState } from 'react';
import {
  updatePassword,
  updateEmail,
  signOut,
  signOutAllDevices,
  deleteAccountData,
} from '../lib/supabase.js';
import { thaiAuthError } from '../lib/auth-errors.js';
import { passwordStrength } from '../lib/auth-utils.js';
import BackBar from '../components/BackBar.jsx';

export default function AccountSettingsView({ user, goHome, onSignedOut }) {
  const [section, setSection] = useState(null); // null | 'password' | 'email' | 'delete'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Form state
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  if (!user) {
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" />
        <div className="vmx-empty" style={{ marginTop: 40 }}>
          ต้อง login ก่อนเข้าหน้านี้
        </div>
      </>
    );
  }

  const email = user.email || '(no email)';
  const username = user.user_metadata?.username || '—';

  const reset = () => { setError(''); setInfo(''); };

  const handleChangePassword = async (e) => {
    e?.preventDefault();
    reset();
    if (newPassword.length < 6) { setError('รหัสผ่านใหม่ต้องยาว 6 ตัวขึ้นไป'); return; }
    if (newPassword !== newPasswordConfirm) { setError('รหัสผ่านยืนยันไม่ตรงกัน'); return; }
    setLoading(true);
    try {
      await updatePassword(newPassword);
      setInfo('✓ เปลี่ยนรหัสผ่านสำเร็จ');
      setNewPassword(''); setNewPasswordConfirm('');
      setTimeout(() => { setSection(null); setInfo(''); }, 1500);
    } catch (err) {
      setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  const handleChangeEmail = async (e) => {
    e?.preventDefault();
    reset();
    if (!newEmail.trim() || !newEmail.includes('@')) { setError('อีเมลไม่ถูกต้อง'); return; }
    if (newEmail === email) { setError('อีเมลใหม่ต้องไม่เหมือนเดิม'); return; }
    setLoading(true);
    try {
      await updateEmail(newEmail.trim());
      setInfo(`✓ ส่งลิงก์ยืนยันไปที่ ${newEmail} แล้ว — กดลิงก์ในอีเมลใหม่เพื่อยืนยัน · อีเมลเก่ายังใช้ login ได้จนกว่าจะยืนยัน`);
      setNewEmail('');
      setTimeout(() => { setSection(null); setInfo(''); }, 4000);
    } catch (err) {
      setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  const handleLogoutAll = async () => {
    if (!confirm('Logout จากทุก device ที่คุณเคย login? · จำเป็นต้อง login ใหม่ทุกที่')) return;
    reset();
    setLoading(true);
    try {
      await signOutAllDevices();
      setInfo('✓ Logout ทุก device แล้ว');
      if (onSignedOut) onSignedOut();
    } catch (err) {
      setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  const handleSignOut = async () => {
    reset();
    setLoading(true);
    try {
      await signOut();
      if (onSignedOut) onSignedOut();
    } catch (err) {
      setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  const handleDelete = async (e) => {
    e?.preventDefault();
    reset();
    if (deleteConfirmText !== 'ลบ account') {
      setError('พิมพ์ "ลบ account" ให้ตรงเพื่อยืนยัน');
      return;
    }
    if (!confirm('ลบ account จริงๆ? · ข้อมูลทั้งหมด (progress, scores, bookmarks) จะหาย · ไม่สามารถกู้คืนได้')) return;
    setLoading(true);
    try {
      const result = await deleteAccountData();
      if (result.errors.length > 0) {
        console.warn('Delete errors:', result.errors);
        setInfo('✓ ลบข้อมูลแล้ว — บางส่วนอาจคงเหลือ · email vetmock เพื่อล้างถาวร');
      } else {
        setInfo('✓ ลบ account สำเร็จ — Logout แล้ว');
      }
      setTimeout(() => {
        if (onSignedOut) onSignedOut();
      }, 2000);
    } catch (err) {
      setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />

      <div className="vmx-hero">
        <h1>⚙️ <em>Account</em> Settings</h1>
        <p>จัดการ account · เปลี่ยนรหัสผ่าน อีเมล หรือลบ account</p>
      </div>

      <div className="vmx-config-panel" style={{ maxWidth: 560, margin: '0 auto' }}>
        {/* Profile info */}
        <Card>
          <h3 style={cardHeading}>📋 ข้อมูล account</h3>
          <KV label="อีเมล" value={email} />
          <KV label="Username" value={username} />
          <KV label="User ID" value={<code style={{ fontSize: 11 }}>{user.id?.slice(0, 8)}…</code>} />
        </Card>

        {/* Banners */}
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

        {/* Change password */}
        <Card>
          <h3 style={cardHeading}>🔒 เปลี่ยนรหัสผ่าน</h3>
          {section !== 'password' ? (
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { reset(); setSection('password'); }}>
              เปลี่ยนรหัสผ่าน →
            </button>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div className="vmx-form-group">
                <label>รหัสผ่านใหม่</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="อย่างน้อย 6 ตัว" autoComplete="new-password" />
                {newPassword && <PasswordStrengthBar password={newPassword} />}
              </div>
              <div className="vmx-form-group">
                <label>ยืนยันรหัสผ่านใหม่</label>
                <input type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} autoComplete="new-password" />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="vmx-btn vmx-btn-primary vmx-btn-sm" disabled={loading}>
                  {loading ? '…' : 'บันทึก'}
                </button>
                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setSection(null); reset(); }}>
                  ยกเลิก
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* Change email */}
        <Card>
          <h3 style={cardHeading}>📧 เปลี่ยนอีเมล</h3>
          {section !== 'email' ? (
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { reset(); setSection('email'); }}>
              เปลี่ยนอีเมล →
            </button>
          ) : (
            <form onSubmit={handleChangeEmail}>
              <div className="vmx-form-group">
                <label>อีเมลใหม่</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@example.com" autoComplete="email" />
                <div style={{ marginTop: 4, fontSize: 11, color: 'var(--clr-ink-soft)' }}>
                  เราจะส่งลิงก์ยืนยันไปที่อีเมลใหม่ — ต้องกดลิงก์เพื่อยืนยันก่อน
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="vmx-btn vmx-btn-primary vmx-btn-sm" disabled={loading}>
                  {loading ? '…' : 'ส่งลิงก์ยืนยัน'}
                </button>
                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setSection(null); reset(); }}>
                  ยกเลิก
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* Logout all devices */}
        <Card>
          <h3 style={cardHeading}>🚪 Session</h3>
          <p style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12, lineHeight: 1.5 }}>
            Logout ครั้งเดียวจากทุก device — ใช้ตอนสงสัยว่ารหัสรั่ว
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={handleSignOut} disabled={loading}>
              Logout (เฉพาะ device นี้)
            </button>
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={handleLogoutAll} disabled={loading} style={{ borderColor: 'var(--clr-gold)' }}>
              ⚠️ Logout ทุก device
            </button>
          </div>
        </Card>

        {/* Danger zone — delete account */}
        <Card style={{ borderColor: 'var(--clr-rose)', borderWidth: 1, borderStyle: 'solid' }}>
          <h3 style={{ ...cardHeading, color: 'var(--clr-rose)' }}>☠️ Danger Zone</h3>
          {section !== 'delete' ? (
            <>
              <p style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12, lineHeight: 1.5 }}>
                ลบ account + ข้อมูลทั้งหมด · ไม่สามารถกู้คืนได้
              </p>
              <button
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                onClick={() => { reset(); setSection('delete'); }}
                style={{ color: 'var(--clr-rose)', borderColor: 'var(--clr-rose)' }}
              >
                ลบ account →
              </button>
            </>
          ) : (
            <form onSubmit={handleDelete}>
              <div style={{ padding: 12, borderRadius: 8, background: 'var(--clr-rose-soft)', marginBottom: 12, fontSize: 12, lineHeight: 1.6 }}>
                <strong>⚠️ การลบ account จะ:</strong>
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  <li>ลบ progress, scores, bookmarks, flashcards ทั้งหมด</li>
                  <li>Logout จากทุก device</li>
                  <li>ไม่สามารถกู้คืนได้</li>
                </ul>
              </div>
              <div className="vmx-form-group">
                <label>พิมพ์ <code>ลบ account</code> เพื่อยืนยัน</label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="ลบ account"
                  autoComplete="off"
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="submit"
                  className="vmx-btn vmx-btn-sm"
                  disabled={loading || deleteConfirmText !== 'ลบ account'}
                  style={{ background: 'var(--clr-rose)', color: '#fff', borderColor: 'var(--clr-rose)' }}
                >
                  {loading ? '…' : '☠️ ยืนยัน ลบ account'}
                </button>
                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setSection(null); setDeleteConfirmText(''); reset(); }}>
                  ยกเลิก
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24, justifyContent: 'center' }}>
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}

const cardHeading = {
  margin: '0 0 12px',
  fontFamily: 'Fraunces, serif',
  fontSize: 16,
  fontWeight: 600,
  color: 'var(--clr-ink)',
};

function Card({ children, style }) {
  return (
    <div
      style={{
        background: 'var(--clr-surface)',
        border: '1px solid var(--clr-border)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function KV({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', fontSize: 13 }}>
      <span style={{ color: 'var(--clr-ink-soft)' }}>{label}</span>
      <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{value}</span>
    </div>
  );
}

function PasswordStrengthBar({ password }) {
  const s = passwordStrength(password);
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 4, background: 'var(--clr-surface-2)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${s.percent}%`, background: s.color, transition: 'width 0.2s ease, background 0.2s ease' }} />
      </div>
      <div style={{ marginTop: 4, fontSize: 11, color: 'var(--clr-ink-soft)' }}>
        ความแข็งแรง: <strong style={{ color: s.color }}>{s.label}</strong>
      </div>
    </div>
  );
}
