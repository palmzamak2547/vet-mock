// ============================================================
// AccountSettingsView — manage account (post-login)
// ============================================================
// Sections:
//   • Profile info (email + username, read-only)
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
  updateProfileMetadata,
  updateUsername,
} from '../lib/supabase.js';
import { thaiAuthError } from '../lib/auth-errors.js';
import {
  passwordStrength,
  validateUsername,
  sanitizeUsername,
} from '../lib/auth-utils.js';
import BackBar from '../components/BackBar.jsx';
import { confirmDialog } from '../lib/dialog.js';

export default function AccountSettingsView({ user, goHome, onSignedOut }) {
  const [section, setSection] = useState(null); // null | 'profile' | 'password' | 'email' | 'delete'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Form state
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Profile-edit form state — pre-populated from current user_metadata
  const md = user?.user_metadata || {};
  const [editUsername, setEditUsername] = useState(md.username || user?.email?.split('@')[0] || '');
  const [editYear, setEditYear] = useState(md.year ?? '');
  const [editCohort, setEditCohort] = useState(md.cohort || '');
  const [editAvatar, setEditAvatar] = useState(md.avatar_emoji || '🐾');
  const [editBio, setEditBio] = useState(md.bio || '');
  const [editShowLb, setEditShowLb] = useState(md.show_on_leaderboard !== false); // default true

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

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    reset();
    setLoading(true);
    try {
      // Username: only call updateUsername if changed (round-trip + uniqueness re-check)
      const currentUsername = md.username || '';
      if (editUsername && editUsername !== currentUsername) {
        const v = validateUsername(editUsername);
        if (!v.ok) { setError(`Username: ${v.reason}`); setLoading(false); return; }
        await updateUsername(editUsername);
      }
      // Other profile fields → user_metadata in one batched updateUser call
      await updateProfileMetadata({
        year: editYear ? Number(editYear) : null,
        cohort: editCohort || null,
        avatar_emoji: editAvatar || null,
        bio: (editBio || '').slice(0, 140) || null,
        show_on_leaderboard: editShowLb,
      });
      setInfo('✓ บันทึกโปรไฟล์เรียบร้อย — รีเฟรชหน้าเพื่อเห็นผลทุกที่');
      setTimeout(() => { setSection(null); setInfo(''); }, 1800);
    } catch (err) {
      setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  const handleExportData = async () => {
    reset();
    setLoading(true);
    try {
      // Bundle local + cloud-mirrored state into a single JSON download
      // — matches the data Cloud sync covers + local-only flags.
      const read = (k) => {
        try {
          const raw = window.localStorage?.getItem(k);
          return raw ? JSON.parse(raw) : null;
        } catch { return null; }
      };
      const exportBlob = {
        version: 1,
        exported_at: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email,
          username: md.username,
          metadata: md,
        },
        progress: {
          bookmarks:        read('vmx-bookmarks') || [],
          history:          read('vmx-history') || [],
          notes:            read('vmx-notes') || {},
          sr_cards:         read('vmx-sr-cards') || {},
          custom_questions: read('vmx-custom-q') || [],
          streak_data:      read('vmx-streak') || null,
          reading_checklist: read('vmx-reading-checklist') || {},
          selected_year:    read('vmx-selected-year'),
          last_session:     read('vmx-last-session-config'),
          theme:            read('vmx-theme'),
        },
      };
      const blob = new Blob([JSON.stringify(exportBlob, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vetmock-export-${user.id?.slice(0, 8)}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setInfo('✓ ดาวน์โหลด JSON เรียบร้อย — เปิดด้วย text editor หรือ import ที่ Question Manager ได้');
    } catch (err) {
      setError(`ส่งออกไม่สำเร็จ: ${err?.message || err}`);
    } finally { setLoading(false); }
  };

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
      setInfo(`✓ ส่งลิงก์ยืนยันไปที่ ${newEmail} แล้ว — กดลิงก์ในอีเมลใหม่เพื่อยืนยัน, อีเมลเก่ายังใช้ login ได้จนกว่าจะยืนยัน`);
      setNewEmail('');
      setTimeout(() => { setSection(null); setInfo(''); }, 4000);
    } catch (err) {
      setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  const handleLogoutAll = async () => {
    if (!(await confirmDialog({ title: 'ออกจากระบบทุกเครื่อง?', body: 'ต้อง login ใหม่ทุกเครื่องที่เคยเข้าไว้', confirmLabel: 'ออกทุกเครื่อง', tone: 'danger' }))) return;
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
    if (!(await confirmDialog({ title: 'ลบบัญชีถาวร?', body: 'ความคืบหน้า คะแนน และ bookmarks ทั้งหมดจะหายไป', note: 'กู้คืนไม่ได้', confirmLabel: 'ลบบัญชี', tone: 'danger' }))) return;
    setLoading(true);
    try {
      const result = await deleteAccountData();
      if (result.errors.length > 0) {
        console.warn('Delete errors:', result.errors);
        setInfo('✓ ลบข้อมูลแล้ว — บางส่วนอาจคงเหลือ, email vetmock เพื่อล้างถาวร');
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
        <h1><em>Account</em> Settings</h1>
        <p>จัดการ account, เปลี่ยนรหัสผ่าน อีเมล หรือลบ account</p>
      </div>

      <div className="vmx-config-panel" style={{ maxWidth: 560, margin: '0 auto' }}>
        {/* Profile info — read-only summary + last sign-in metadata */}
        <Card>
          <h3 style={cardHeading}>ข้อมูล account</h3>
          <KV label="อีเมล" value={
            <>
              {email}
              {user.email_confirmed_at
                ? <span style={{ marginLeft: 6, color: 'var(--clr-sage)', fontSize: 11 }}>✓ ยืนยันแล้ว</span>
                : <span style={{ marginLeft: 6, color: 'var(--clr-gold)', fontSize: 11 }}>ยังไม่ยืนยัน</span>}
            </>
          } />
          <KV label="Username" value={
            <>
              {md.avatar_emoji || ''} {username}
            </>
          } />
          {md.year && <KV label="ชั้นปี" value={`ปี ${md.year}${md.cohort ? `, ${md.cohort}` : ''}`} />}
          {md.bio && <KV label="Bio" value={<span style={{ maxWidth: 280, textAlign: 'right' }}>{md.bio}</span>} />}
          {user.last_sign_in_at && (
            <KV label="Login ล่าสุด" value={
              <span title={new Date(user.last_sign_in_at).toLocaleString('th-TH')}>
                {timeAgoTh(user.last_sign_in_at)}
              </span>
            } />
          )}
          <KV label="User ID" value={<code style={{ fontSize: 11 }}>{user.id?.slice(0, 8)}…</code>} />
        </Card>

        {/* Edit profile (year + cohort + avatar + bio + privacy) */}
        <Card>
          <h3 style={cardHeading}>แก้ไขโปรไฟล์</h3>
          {section !== 'profile' ? (
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { reset(); setSection('profile'); }}>
              แก้ไข username, ชั้นปี, avatar, bio, privacy →
            </button>
          ) : (
            <form onSubmit={handleSaveProfile}>
              <div className="vmx-form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(sanitizeUsername(e.target.value))}
                  placeholder="vet86_ping"
                  maxLength={30}
                  autoComplete="username"
                />
                <div style={{ marginTop: 4, fontSize: 11, color: 'var(--clr-ink-soft)' }}>
                  ใช้ได้: a-z, A-Z, 0-9, _, 3-30 ตัว
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div className="vmx-form-group" style={{ flex: '0 0 100px' }}>
                  <label>ชั้นปี</label>
                  <select value={editYear} onChange={(e) => setEditYear(e.target.value)}>
                    <option value="">—</option>
                    <option value="1">ปี 1</option>
                    <option value="2">ปี 2</option>
                    <option value="3">ปี 3</option>
                    <option value="4">ปี 4</option>
                    <option value="5">ปี 5</option>
                    <option value="6">ปี 6</option>
                  </select>
                </div>
                <div className="vmx-form-group" style={{ flex: 1, minWidth: 140 }}>
                  <label>Cohort</label>
                  <input
                    type="text"
                    value={editCohort}
                    onChange={(e) => setEditCohort(e.target.value.slice(0, 30))}
                    placeholder="Vet 86"
                    maxLength={30}
                  />
                </div>
                <div className="vmx-form-group" style={{ flex: '0 0 90px' }}>
                  <label>Avatar</label>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value.slice(0, 4))}
                    placeholder="🐾"
                    maxLength={4}
                    style={{ textAlign: 'center', fontSize: 18 }}
                  />
                </div>
              </div>
              <div className="vmx-form-group">
                <label>Bio (≤140 ตัว)</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value.slice(0, 140))}
                  placeholder="แนะนำตัวสั้น ๆ — อะไรที่อยากให้คนรู้"
                  maxLength={140}
                  rows={2}
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', fontSize: 14, padding: 8, border: '1px solid var(--clr-border)', borderRadius: 8, background: 'var(--clr-bg)', color: 'var(--clr-ink)' }}
                />
                <div style={{ marginTop: 4, fontSize: 11, color: 'var(--clr-ink-soft)', textAlign: 'right' }}>
                  {editBio.length}/140
                </div>
              </div>
              <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--clr-ink)' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editShowLb}
                    onChange={(e) => setEditShowLb(e.target.checked)}
                  />
                  แสดงบน Leaderboard (ปิดถ้าอยากเก็บ progress เป็น private)
                </label>
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
          <h3 style={cardHeading}>เปลี่ยนรหัสผ่าน</h3>
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
          <h3 style={cardHeading}>เปลี่ยนอีเมล</h3>
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

        {/* Export data — GDPR portability + offline backup */}
        <Card>
          <h3 style={cardHeading}>Export ข้อมูล</h3>
          <p style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12, lineHeight: 1.5 }}>
            ดาวน์โหลด progress ทั้งหมด (bookmarks, history, notes, custom Q, streak) เป็น JSON
          </p>
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={handleExportData} disabled={loading}>
            {loading ? '…' : '↓ ดาวน์โหลด JSON'}
          </button>
        </Card>

        {/* Logout all devices */}
        <Card>
          <h3 style={cardHeading}>Session</h3>
          <p style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12, lineHeight: 1.5 }}>
            Logout ครั้งเดียวจากทุก device — ใช้ตอนสงสัยว่ารหัสรั่ว
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={handleSignOut} disabled={loading}>
              Logout (เฉพาะ device นี้)
            </button>
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={handleLogoutAll} disabled={loading} style={{ borderColor: 'var(--clr-gold)' }}>
              Logout ทุก device
            </button>
          </div>
        </Card>

        {/* Danger zone — delete account */}
        <Card style={{ borderColor: 'var(--clr-rose)', borderWidth: 1, borderStyle: 'solid' }}>
          <h3 style={{ ...cardHeading, color: 'var(--clr-rose)' }}>Danger Zone</h3>
          {section !== 'delete' ? (
            <>
              <p style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12, lineHeight: 1.5 }}>
                ลบ account + ข้อมูลทั้งหมด, ไม่สามารถกู้คืนได้
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
                <strong>การลบ account จะ:</strong>
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

// Cheap Thai relative-time formatter — used for "Login ล่าสุด" display.
// No timezone math; relies on the user's clock matching their actual TZ
// (always true for browser-based UIs).
function timeAgoTh(iso) {
  if (!iso) return '—';
  const ts = new Date(iso).getTime();
  if (!Number.isFinite(ts)) return '—';
  const diffMin = Math.round((Date.now() - ts) / 60000);
  if (diffMin < 1) return 'เมื่อสักครู่';
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} ชม. ที่แล้ว`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay} วันที่แล้ว`;
  return new Date(iso).toLocaleDateString('th-TH');
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
