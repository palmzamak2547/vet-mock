// ============================================================
// AccountSettingsView — "บัญชีและข้อมูล" (post-login)
// ============================================================
// Four groups, in the order a student looks for them:
//   • How classmates see you   name, picture and the board choice, edited
//                              with the same editor as the profile hub
//   • Signing in and security  the address, the linked sign-in methods,
//                              passkeys, password (two steps), email change,
//                              signing out every device
//   • Your data                one download that holds everything the app
//                              keeps for this account and this device, and
//                              says what is in it; connected apps
//   • Leaving                  sign out here; delete the account
//
// How passwords, passkeys, the email change and deletion work is unchanged;
// only where they sit and how they are named. Year, cohort and bio are no
// longer asked for: nothing read them, and the app's year is the one the
// student picks for the whole app (shown on the profile hub).
//
// Reachable from:
//   • the profile hub (บัญชีและข้อมูล), the header menu, the palette
// ============================================================

import { useState, useEffect } from 'react';
import {
  updatePassword,
  requestReauthOtp,
  registerPasskey,
  listPasskeys,
  deletePasskey,
  isPasskeySupported,
  updateEmail,
  signOut,
  signOutAllDevices,
  deleteAccountData,
} from '../lib/supabase.js';
import { isWebAuthnDismissal, thaiAuthError } from '../lib/auth-errors.js';
import { thaiError } from '../lib/errors.js';
import { passwordStrength } from '../lib/auth-utils.js';
import BackBar from '../components/BackBar.jsx';
import IdentityEditor from '../components/IdentityEditor.jsx';
import { confirmDialog } from '../lib/dialog.js';
import { isSyntheticLineEmail } from '../lib/line-account.js';
import { isAutoName, showsOnBoards } from '../lib/public-identity.js';
import { getXpState } from '../lib/xp.js';
import '../styles-profile.css';

// Typed to confirm a delete. Thai only, so nobody switches keyboards halfway.
const DELETE_PHRASE = 'ลบบัญชี';
// A LINE-only account has no mailbox for the reauth code, so it cannot set a
// password until it has a real email (OV-data-9).
const LINE_ONLY_PASSWORD = 'บัญชีนี้เข้าด้วย LINE เพิ่มอีเมลจริงก่อนจึงตั้งรหัสผ่านได้';

// What the one download holds, said on the page before it is pressed.
export const EXPORT_HOLDS = Object.freeze([
  'ประวัติการทำข้อสอบ ข้อที่บันทึกไว้ โน้ต การ์ดทบทวน วันต่อเนื่อง ข้อที่เขียนเอง และรายการอ่าน',
  'ชื่อ รูป และการเลือกเรื่องกระดานอันดับ',
  'เลเวลและชั้นปีที่เลือกไว้ในเครื่องนี้',
  'Flashcard ชุดปิดภาพ Pinboard โน้ตวิดีโอ และคลิปที่เพิ่มเองในเครื่องนี้',
]);

const PROVIDER_NAME = { google: 'Google', line: 'LINE', email: 'อีเมลและรหัสผ่าน' };

export default function AccountSettingsView({ user, profile = null, goHome, setView, onSignedOut, coreData, onIdentitySaved = null, selectedYear = null }) {
  const [section, setSection] = useState(null); // null | 'identity' | 'password' | 'email' | 'delete'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Form state
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  // Emailed reauth code, and whether we have asked for one yet.
  const [reauthCode, setReauthCode] = useState('');
  const [reauthSent, setReauthSent] = useState(false);
  // Passkeys on this account. [] also covers "feature off" so the card
  // renders the create button rather than an error.
  const [passkeys, setPasskeys] = useState([]);
  const [passkeysFailed, setPasskeysFailed] = useState(false);
  const [passkeyLoad, setPasskeyLoad] = useState(0);
  const [newEmail, setNewEmail] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [identitySaved, setIdentitySaved] = useState('');

  const md = user?.user_metadata || {};
  // The LINE placeholder's local part is line_<sub>, never a username to offer.
  const lineOnly = isSyntheticLineEmail(user);

  if (!user) {
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" />
        <div className="vmx-empty" style={{ marginTop: 40 }}>
          ต้องเข้าสู่ระบบก่อนเปิดหน้านี้
        </div>
      </>
    );
  }

  const email = user.email || '';
  // The public name is the profiles row every other screen shows; metadata is
  // only its mirror, and an account signed in with Google has none there.
  const publicName = profile?.username || '';
  const autoName = isAutoName(publicName, email);
  const picture = profile?.avatar_emoji || '🐾';

  const reset = () => { setError(''); setInfo(''); };

  // One file for everything the app keeps for this student: the synced study
  // data in the shape the progress page restores, the account's public
  // identity and choices, and what lives on this device only (level, year,
  // device tools). The detailed answer log and PDF handwriting stay separate.
  const handleExportData = async () => {
    reset();
    setLoading(true);
    try {
      if (!coreData) throw new Error('ยังโหลดข้อมูลบัญชีไม่ครบ กรุณาลองใหม่');
      let localExtras = null;
      try { localExtras = (await import('../lib/local-extras.js')).exportLocalExtras(); } catch { localExtras = null; }
      const exportBlob = {
        version: '5.2',
        exportDate: new Date().toISOString(),
        ...coreData,
        account: {
          id: user.id,
          email: lineOnly ? null : user.email,
          username: publicName || null,
          avatar_emoji: profile?.avatar_emoji || null,
          show_on_leaderboard: showsOnBoards(user),
          // Quest points and the one-time carry the level adds (lib/xp.js).
          xp_extra: Math.max(0, Math.floor(Number(md.xp_extra) || 0)),
          // Saved by earlier versions of the account page; kept, not asked for.
          ...(md.year ? { year: md.year } : {}),
          ...(md.cohort ? { cohort: md.cohort } : {}),
          ...(md.bio ? { bio: md.bio } : {}),
        },
        device: { selectedYear: selectedYear ?? null, xp: getXpState() },
        ...(localExtras ? { localExtras } : {}),
      };
      const blob = new Blob([JSON.stringify(exportBlob, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vetmock-export-${user.id?.slice(0, 8)}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setInfo(localExtras
        ? 'เริ่มดาวน์โหลดไฟล์แล้ว ดูในโฟลเดอร์ดาวน์โหลดของเครื่อง ถ้าเปิดจากในแอปอื่นแล้วไม่เห็นไฟล์ ให้เปิด VetMock ในเบราว์เซอร์ปกติ'
        : 'เริ่มดาวน์โหลดไฟล์แล้ว แต่อ่าน Flashcard และเครื่องมือในเครื่องนี้ไม่ครบ จึงไม่อยู่ในไฟล์ ดาวน์โหลดแยกได้ที่หน้าความคืบหน้า');
    } catch (err) {
      setError(thaiError(err, 'ส่งออกไม่สำเร็จ ลองใหม่อีกครั้ง'));
    } finally { setLoading(false); }
  };

  // Passkeys can only be created from a signed-in session, so this screen is
  // the only place they can come from.
  useEffect(() => {
    let alive = true;
    if (!isPasskeySupported()) return undefined;
    listPasskeys().then((rows) => {
      if (!alive) return;
      setPasskeysFailed(rows === null);
      setPasskeys(rows || []);
    });
    return () => { alive = false; };
  }, [passkeyLoad]);

  const handleRegisterPasskey = async () => {
    reset();
    setLoading(true);
    try {
      await registerPasskey();
      const rows = await listPasskeys();
      setPasskeysFailed(rows === null);
      setPasskeys(rows || []);
      setInfo('✓ สร้าง passkey เรียบร้อย ครั้งต่อไปเข้าสู่ระบบได้เลยโดยไม่ต้องใช้รหัสผ่าน');
    } catch (err) {
      const t = `${err?.code || err?.name || ''} ${err?.message || ''}`;
      // Dismissing the OS prompt is a normal choice, not a failure to report.
      // auth-js hides the browser's NotAllowedError behind a passthrough
      // `code`, so the shared check also reads `name` and `cause`.
      if (isWebAuthnDismissal(err)) { /* no banner */ }
      else if (/webauthn_credential_exists/i.test(t)) setInfo('อุปกรณ์นี้มี passkey อยู่แล้ว');
      else setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  const handleDeletePasskey = async (passkeyId) => {
    reset();
    if (!(await confirmDialog({ title: 'ลบ passkey นี้?', body: 'อุปกรณ์นี้จะใช้ passkey เข้าสู่ระบบไม่ได้อีก', confirmLabel: 'ลบ', tone: 'danger' }))) return;
    setLoading(true);
    try {
      await deletePasskey(passkeyId);
      const rows = await listPasskeys();
      setPasskeysFailed(rows === null);
      setPasskeys(rows || []);
      setInfo('ลบ passkey แล้ว');
    } catch (err) {
      setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  // Step 1: prove the person at the keyboard owns the inbox, before letting
  // them set a new password. Without this a borrowed session is a permanent
  // account takeover — see requestReauthOtp in lib/supabase.js.
  const handleRequestReauth = async (e) => {
    e?.preventDefault();
    reset();
    if (lineOnly) { setError(LINE_ONLY_PASSWORD); return; }
    if (newPassword.length < 8) { setError('รหัสผ่านใหม่ต้องยาว 8 ตัวขึ้นไป'); return; }
    if (newPassword !== newPasswordConfirm) { setError('รหัสผ่านยืนยันไม่ตรงกัน'); return; }
    setLoading(true);
    try {
      await requestReauthOtp();
      setReauthSent(true);
      setInfo('ส่งรหัสยืนยันไปที่อีเมลของคุณแล้ว กรอกรหัสเพื่อยืนยันการเปลี่ยนรหัสผ่าน');
    } catch (err) {
      setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  // Step 2: the code from that email travels with the change as `nonce`.
  const handleChangePassword = async (e) => {
    e?.preventDefault();
    reset();
    if (newPassword.length < 8) { setError('รหัสผ่านใหม่ต้องยาว 8 ตัวขึ้นไป'); return; }
    if (newPassword !== newPasswordConfirm) { setError('รหัสผ่านยืนยันไม่ตรงกัน'); return; }
    if (!reauthCode.trim()) { setError('กรอกรหัสยืนยันที่ส่งไปทางอีเมล'); return; }
    setLoading(true);
    try {
      await updatePassword(newPassword, reauthCode.trim());
      setInfo('✓ เปลี่ยนรหัสผ่านสำเร็จ');
      setNewPassword(''); setNewPasswordConfirm(''); setReauthCode(''); setReauthSent(false);
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
      // A LINE-only account has no old email to keep using, so it is not promised one.
      setInfo(lineOnly
        ? `✓ ส่งลิงก์ยืนยันไปที่ ${newEmail} แล้ว — กดลิงก์ในอีเมลนั้นเพื่อยืนยัน`
        : `✓ ส่งลิงก์ยืนยันไปที่ ${newEmail} แล้ว — กดลิงก์ในอีเมลใหม่เพื่อยืนยัน อีเมลเก่ายังใช้เข้าสู่ระบบได้จนกว่าจะยืนยัน`);
      setNewEmail('');
      setTimeout(() => { setSection(null); setInfo(''); }, 4000);
    } catch (err) {
      setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  const handleLogoutAll = async () => {
    if (!(await confirmDialog({ title: 'ออกจากระบบทุกเครื่อง?', body: 'ต้องเข้าสู่ระบบใหม่ทุกเครื่องที่เคยเข้าไว้', confirmLabel: 'ออกทุกเครื่อง', tone: 'danger' }))) return;
    reset();
    setLoading(true);
    try {
      await signOutAllDevices();
      setInfo('✓ ออกจากระบบทุกเครื่องแล้ว');
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
    if (deleteConfirmText !== DELETE_PHRASE) {
      setError(`พิมพ์ "${DELETE_PHRASE}" ให้ตรงเพื่อยืนยัน`);
      return;
    }
    if (!(await confirmDialog({ title: 'ลบบัญชีถาวร?', body: 'ความคืบหน้า คะแนน และ bookmarks ทั้งหมดจะหายไป', note: 'กู้คืนไม่ได้', confirmLabel: 'ลบบัญชี', tone: 'danger' }))) return;
    setLoading(true);
    try {
      const result = await deleteAccountData();
      // Branch on ok, not on errors.length. Both arms used to show a checkmark
      // and sign the user out, so a delete that touched nothing at all still
      // read as "✓ ลบข้อมูลแล้ว" — and the Edge Function deliberately skips the
      // auth.users delete whenever any table errored, meaning "บางส่วนอาจคงเหลือ"
      // was the copy shown for a fully live account. Of everything in this
      // screen, a destructive privacy action is the one that must not lie: the
      // student walks away believing their history is gone and never checks.
      if (result.ok !== true) {
        console.warn('Delete errors:', result.errors);
        const networkOnly = (result.errors || []).some((e) => e.table === '__network__');
        // A partial failure cannot claim "ข้อมูลยังอยู่": the function purges
        // table by table and reports which ones it got through, so some of the
        // student's history may already be gone. Say what is actually known
        // instead of a reassurance the code cannot back up.
        const purged = Object.entries(result.deleted || {})
          .filter(([, v]) => v && v !== 0)
          .length;
        setError(networkOnly
          ? 'ยังยืนยันผลการลบไม่ได้ เพราะการเชื่อมต่อขาดหาย ข้อมูลบางส่วนอาจถูกลบแล้ว กรุณาตรวจสถานะบัญชีหรือติดต่อทีมงานก่อนลองอีกครั้ง'
          : purged > 0
            ? 'ลบยังไม่เสร็จสมบูรณ์ — บัญชียังอยู่ แต่ข้อมูลบางส่วนถูกลบไปแล้ว กดลบอีกครั้งเพื่อให้เสร็จ หรือส่งเมลให้ทีมงานลบให้'
            : 'ลบไม่สำเร็จ — บัญชีและข้อมูลยังอยู่ โปรดลองใหม่ หรือส่งเมลให้ทีมงานลบให้');
        return;
      }
      setInfo(result.devicePurged === false
        ? '✓ ลบบัญชีสำเร็จและออกจากระบบแล้ว แต่ล้างข้อมูลบางส่วนในเครื่องนี้ไม่สำเร็จ ลบข้อมูลเว็บไซต์ในการตั้งค่าเบราว์เซอร์เองได้'
        : '✓ ลบบัญชีสำเร็จและออกจากระบบแล้ว');
      setTimeout(() => {
        if (onSignedOut) onSignedOut();
      }, 2000);
    } catch (err) {
      setError(thaiAuthError(err));
    } finally { setLoading(false); }
  };

  const identities = (Array.isArray(user.identities) ? user.identities : [])
    .map((i) => ({ provider: i?.provider, email: i?.identity_data?.email || '' }))
    .filter((i) => i.provider);

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />

      <div className="vmx-hero vmx-acct-hero">
        <h1>บัญชีและข้อมูล</h1>
        <p>วิธีเข้าสู่ระบบ ข้อมูลของคุณ และการออกจากบัญชี</p>
      </div>

      <div className="vmx-acct">
        {/* ── How classmates see you ─────────────────────────────────── */}
        <section className="vmx-acct-group" aria-labelledby="acct-identity">
          <h2 id="acct-identity">ตัวตนที่เพื่อนเห็น</h2>
          <div className="vmx-acct-card">
            {section !== 'identity' ? (
              <>
                <div className="vmx-acct-id">
                  <span className="vmx-hub-pic" aria-hidden="true">{picture}</span>
                  <div className="vmx-acct-id-body">
                    <span className="vmx-hub-name">{autoName ? 'ยังไม่ได้ตั้งชื่อ' : publicName}</span>
                    <span className="vmx-hub-meta">
                      {autoName && publicName ? `ตอนนี้เพื่อนเห็นเป็น ${publicName} ซึ่งระบบตั้งให้ ` : ''}
                      {showsOnBoards(user) ? 'แสดงบนกระดานอันดับ' : 'ไม่แสดงบนกระดานอันดับ'}
                    </span>
                  </div>
                </div>
                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { reset(); setIdentitySaved(''); setSection('identity'); }}>
                  แก้ไขชื่อ รูป และการแสดงบนกระดาน
                </button>
                {identitySaved && <p className="vmx-hub-saved is-on" role="status">{identitySaved}</p>}
              </>
            ) : (
              <IdentityEditor
                user={user}
                profile={profile}
                mode="edit"
                headingId="acct-identity"
                nameInputId="vmx-account-username"
                onCancel={() => setSection(null)}
                onSaved={(next, saved) => {
                  onIdentitySaved?.(next, saved);
                  setSection(null);
                  setIdentitySaved(saved?.metaSaved === false
                    ? 'บันทึกชื่อและรูปแล้ว แต่เรื่องกระดานอันดับยังไม่ได้บันทึก ลองอีกครั้ง'
                    : 'บันทึกแล้ว เพื่อนเห็นแบบนี้ตั้งแต่ตอนนี้');
                }}
              />
            )}
          </div>
        </section>

        {/* ── Signing in and security ────────────────────────────────── */}
        <section className="vmx-acct-group" aria-labelledby="acct-signin">
          <h2 id="acct-signin">การเข้าสู่ระบบและความปลอดภัย</h2>
          <div className="vmx-acct-card">
            <dl className="vmx-acct-facts">
              <div>
                <dt>อีเมล</dt>
                {/* The LINE placeholder is not the student's email; it is never printed. */}
                <dd>
                  {lineOnly ? 'ยังไม่มีอีเมล (เข้าด้วย LINE)' : !email ? 'ยังไม่มีอีเมล' : (
                    <>
                      <span className="vmx-acct-mail">{email}</span>
                      {user.email_confirmed_at
                        ? <span className="vmx-acct-tag is-ok">ยืนยันแล้ว</span>
                        : <span className="vmx-acct-tag is-warn">ยังไม่ยืนยัน</span>}
                    </>
                  )}
                </dd>
              </div>
              {identities.length > 0 && (
                <div>
                  <dt>เข้าด้วย</dt>
                  <dd>
                    <ul className="vmx-acct-methods">
                      {identities.map((i, n) => (
                        <li key={`${i.provider}-${n}`}>
                          {PROVIDER_NAME[i.provider] || i.provider}
                          {i.email && !isSyntheticLineEmail(i.email) ? <span className="vmx-acct-mail"> {i.email}</span> : null}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
              {user.last_sign_in_at && (
                <div>
                  <dt>เข้าสู่ระบบล่าสุด</dt>
                  <dd title={new Date(user.last_sign_in_at).toLocaleString('th-TH')}>{timeAgoTh(user.last_sign_in_at)}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Passkeys — the only place they can be created, since registering
              one requires being signed in already. Hidden entirely on browsers
              that cannot do WebAuthn rather than shown as a dead control. */}
          {isPasskeySupported() && (
            <div className="vmx-acct-card">
              <h3>Passkey</h3>
              <p className="vmx-acct-note">
                เข้าสู่ระบบด้วยลายนิ้วมือ ใบหน้า หรือ PIN ของเครื่อง ไม่ต้องจำรหัสผ่าน
                และหน้าเว็บปลอมขโมยไปใช้ไม่ได้ เพราะ passkey ผูกกับที่อยู่เว็บจริงเท่านั้น
              </p>
              {passkeysFailed && (
                <div role="alert" className="vmx-acct-inline">
                  <span>โหลดรายการ passkey ไม่สำเร็จ</span>
                  <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setPasskeyLoad((n) => n + 1)}>ลองอีกครั้ง</button>
                </div>
              )}
              {passkeys.length > 0 && (
                <ul className="vmx-acct-list">
                  {passkeys.map((pk) => (
                    <li key={pk.id}>
                      <span>
                        {pk.friendly_name || 'Passkey'}
                        {pk.created_at && <span className="vmx-hub-meta"> เพิ่มเมื่อ {new Date(pk.created_at).toLocaleDateString('th-TH')}</span>}
                      </span>
                      <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => handleDeletePasskey(pk.id)} disabled={loading}>
                        ลบ
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={handleRegisterPasskey} disabled={loading}>
                {loading ? '…' : passkeys.length ? 'เพิ่ม passkey อีกอัน' : 'สร้าง passkey บนเครื่องนี้'}
              </button>
            </div>
          )}

          {/* Change password */}
          <div className="vmx-acct-card">
            <h3>{lineOnly ? 'ตั้งรหัสผ่าน' : 'เปลี่ยนรหัสผ่าน'}</h3>
            {lineOnly ? (
              /* The reauth code would go to the LINE placeholder, which no mail
                 reaches, so the form could never finish. Say what to do instead. */
              <p className="vmx-acct-note">{LINE_ONLY_PASSWORD}</p>
            ) : section !== 'password' ? (
              <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { reset(); setSection('password'); }}>
                เปลี่ยนรหัสผ่าน →
              </button>
            ) : (
              /* Two steps on purpose. A live session alone used to be enough to
                 set a new password, so a borrowed phone or a shared library
                 machine handed over the account for good. The second step proves
                 whoever is typing can also read the account's email. */
              <form onSubmit={reauthSent ? handleChangePassword : handleRequestReauth}>
                <div className="vmx-form-group">
                  <label htmlFor="vmx-account-password">รหัสผ่านใหม่</label>
                  <input id="vmx-account-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="อย่างน้อย 8 ตัว" autoComplete="new-password" disabled={reauthSent} />
                  {newPassword && <PasswordStrengthBar password={newPassword} />}
                </div>
                <div className="vmx-form-group">
                  <label htmlFor="vmx-account-password-confirm">ยืนยันรหัสผ่านใหม่</label>
                  <input id="vmx-account-password-confirm" type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} autoComplete="new-password" disabled={reauthSent} />
                </div>
                {reauthSent && (
                  <div className="vmx-form-group">
                    <label htmlFor="vmx-account-reauth-code">รหัสยืนยันจากอีเมล</label>
                    <input
                      id="vmx-account-reauth-code"
                      type="text" inputMode="numeric" autoComplete="one-time-code"
                      value={reauthCode} onChange={(e) => setReauthCode(e.target.value)}
                      placeholder="กรอกรหัสที่ส่งไปทางอีเมล" autoFocus
                    />
                    <div className="vmx-acct-note">
                      ส่งไปที่ {email} หากไม่พบ ลองดูในกล่องสแปม
                    </div>
                  </div>
                )}
                <div className="vmx-acct-actions">
                  <button type="submit" className="vmx-btn vmx-btn-primary vmx-btn-sm" disabled={loading}>
                    {loading ? '…' : reauthSent ? 'ยืนยันและเปลี่ยนรหัสผ่าน' : 'ส่งรหัสยืนยัน'}
                  </button>
                  <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setSection(null); setReauthSent(false); setReauthCode(''); reset(); }}>
                    ยกเลิก
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Change email */}
          <div className="vmx-acct-card">
            <h3>{lineOnly ? 'เพิ่มอีเมล' : 'เปลี่ยนอีเมล'}</h3>
            {section !== 'email' ? (
              <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { reset(); setSection('email'); }}>
                {lineOnly ? 'เพิ่มอีเมล →' : 'เปลี่ยนอีเมล →'}
              </button>
            ) : (
              <form onSubmit={handleChangeEmail}>
                <div className="vmx-form-group">
                  <label htmlFor="vmx-account-email">อีเมลใหม่</label>
                  <input id="vmx-account-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@example.com" autoComplete="email" />
                  <div className="vmx-acct-note">
                    เราจะส่งลิงก์ยืนยันไปที่อีเมลใหม่ ต้องกดลิงก์เพื่อยืนยันก่อน
                  </div>
                </div>
                <div className="vmx-acct-actions">
                  <button type="submit" className="vmx-btn vmx-btn-primary vmx-btn-sm" disabled={loading}>
                    {loading ? '…' : 'ส่งลิงก์ยืนยัน'}
                  </button>
                  <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setSection(null); reset(); }}>
                    ยกเลิก
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="vmx-acct-card">
            <h3>ออกจากระบบทุกเครื่อง</h3>
            <p className="vmx-acct-note">ใช้ตอนลืมออกจากเครื่องคนอื่น หรือสงสัยว่ามีคนอื่นเข้าบัญชีนี้</p>
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={handleLogoutAll} disabled={loading}>
              ออกจากระบบทุกเครื่อง
            </button>
          </div>
        </section>

        {/* ── Your data ──────────────────────────────────────────────── */}
        <section className="vmx-acct-group" aria-labelledby="acct-data">
          <h2 id="acct-data">ข้อมูลของคุณ</h2>
          <div className="vmx-acct-card">
            <h3>ดาวน์โหลดข้อมูลทั้งหมด</h3>
            <p className="vmx-acct-note">ไฟล์เดียว นำกลับเข้าได้ที่หน้าความคืบหน้า ในไฟล์มี</p>
            <ul className="vmx-acct-holds">
              {EXPORT_HOLDS.map((line) => <li key={line}>{line}</li>)}
            </ul>
            <p className="vmx-acct-note">ประวัติแบบละเอียดรายข้อและลายมือบน PDF ไฟล์ใหญ่ จึงดาวน์โหลดแยกที่หน้าความคืบหน้าและหน้า PDF</p>
            <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={handleExportData} disabled={loading}>
              {loading ? '…' : 'ดาวน์โหลดไฟล์ข้อมูล'}
            </button>
          </div>
          {/* Google Drive and Notion grants are ended on the connected-apps page. */}
          {setView && (
            <div className="vmx-acct-card">
              <h3>แอปที่เชื่อมไว้</h3>
              <p className="vmx-acct-note">ตารางสอบในปฏิทิน และแอปที่ได้รับสิทธิ์อ่านข้อมูล ยกเลิกสิทธิ์ได้ที่หน้านี้</p>
              <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setView('connect-apps')}>เปิดหน้าเชื่อมแอป</button>
            </div>
          )}
        </section>

        {/* ── Leaving ────────────────────────────────────────────────── */}
        <section className="vmx-acct-group" aria-labelledby="acct-leave">
          <h2 id="acct-leave">ออกจากบัญชี</h2>
          <div className="vmx-acct-card">
            <h3>ออกจากระบบเครื่องนี้</h3>
            <p className="vmx-acct-note">ข้อมูลในบัญชียังอยู่ครบ เข้าสู่ระบบใหม่เมื่อไหร่ก็ใช้ต่อได้</p>
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={handleSignOut} disabled={loading}>
              ออกจากระบบเฉพาะเครื่องนี้
            </button>
          </div>

          {/* Danger zone — delete account */}
          <div className="vmx-acct-card is-danger">
            <h3>ลบบัญชี</h3>
            {section !== 'delete' ? (
              <>
                <p className="vmx-acct-note">ลบบัญชีและข้อมูลในบัญชีทั้งหมด กู้คืนไม่ได้ ดาวน์โหลดข้อมูลไว้ก่อนได้จากหัวข้อด้านบน</p>
                <button
                  className="vmx-btn vmx-btn-ghost vmx-btn-sm vmx-acct-danger"
                  onClick={() => { reset(); setSection('delete'); }}
                >
                  ลบบัญชี →
                </button>
              </>
            ) : (
              <form onSubmit={handleDelete}>
                <div className="vmx-acct-warn">
                  <strong>การลบบัญชีจะ:</strong>
                  <ul>
                    <li>ลบความคืบหน้า คะแนน bookmarks และข้อมูลของบัญชีนี้ทั้งหมด ทั้งในบัญชีและในเครื่องนี้</li>
                    <li>Flashcard ชุดปิดภาพ และ Pinboard เก็บไว้ในเบราว์เซอร์นี้ ไม่ได้อยู่ในบัญชี จึงไม่ถูกลบ ลบเองได้จากหน้าเครื่องมือนั้น หรือล้างข้อมูลเว็บไซต์ในเบราว์เซอร์</li>
                    <li>ออกจากระบบทุกเครื่อง</li>
                    <li>ไม่สามารถกู้คืนได้</li>
                  </ul>
                </div>
                <div className="vmx-form-group">
                  <label htmlFor="vmx-account-delete-confirm">พิมพ์ <code>{DELETE_PHRASE}</code> เพื่อยืนยัน</label>
                  <input
                    id="vmx-account-delete-confirm"
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder={DELETE_PHRASE}
                    autoComplete="off"
                  />
                </div>
                <div className="vmx-acct-actions">
                  <button
                    type="submit"
                    className="vmx-btn vmx-btn-sm"
                    disabled={loading || deleteConfirmText !== DELETE_PHRASE}
                    style={{ background: 'var(--clr-rose)', color: '#fff', borderColor: 'var(--clr-rose)' }}
                  >
                    {loading ? '…' : 'ยืนยันลบบัญชี'}
                  </button>
                  <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setSection(null); setDeleteConfirmText(''); reset(); }}>
                    ยกเลิก
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* The result of the last action, held at the bottom of the screen
            while the page is in view, so it is seen wherever the button was. */}
        {error && <div className="vmx-acct-banner is-error" role="alert">{error}</div>}
        {info && <div className="vmx-acct-banner is-info" role="status">{info}</div>}
      </div>
    </>
  );
}

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
      <div style={{ marginTop: 4, fontSize: 14, color: 'var(--clr-ink-soft)' }}>
        ความแข็งแรง: <strong style={{ color: s.color }}>{s.label}</strong>
      </div>
    </div>
  );
}
