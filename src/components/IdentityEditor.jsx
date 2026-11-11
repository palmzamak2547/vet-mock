// ============================================================
// IdentityEditor — "how classmates see you": name, picture, board choice
// ============================================================
// One editor for the three places a student sets it: the first-run step
// (IdentityStep), the identity card on the profile hub (edited in place) and
// the account page. It writes through saveIdentity() only, so the choice is
// what every other screen shows, and it shows the row other members will
// see while the student types.
//
// Never offered as a name: the part of the email before the @ (for a Chula
// address, the student number) and a name the database made (user_2). Such
// a name is said for what it is and the field starts empty.
// ============================================================

import { shownName as drawnName, shownPicture } from '../lib/public-display.js';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { saveIdentity, isPublicNameFree } from '../lib/identity-write.js';
import {
  PICTURES, DEFAULT_PICTURE, SURFACES, checkPublicName, identityWriteError, isAutoName,
  normalizePublicName, nameLength, showsOnBoards, NAME_MAX, NAME_MIN,
} from '../lib/public-identity.js';

export default function IdentityEditor({
  user, profile, mode = 'edit', onSaved, onCancel, onSkip, headingId, nameInputId,
}) {
  const uid = useId();
  const email = user?.email || '';
  const current = profile?.username || '';
  const auto = isAutoName(current, email, user);
  const [name, setName] = useState(auto ? '' : current);
  // A picture outside the set is never drawn (public-display.js), so the
  // editor starts from what others actually see.
  const startPicture = shownPicture(profile?.avatar_emoji || DEFAULT_PICTURE);
  const [picture, setPicture] = useState(startPicture);
  const [shown, setShown] = useState(showsOnBoards(user));
  const [touched, setTouched] = useState(false);
  const [free, setFree] = useState(null); // true | false | null (unknown)
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [surfacesOpen, setSurfacesOpen] = useState(false);
  const inputRef = useRef(null);

  const trimmed = normalizePublicName(name);
  const keepName = trimmed === '' || trimmed === current;
  const check = useMemo(() => (keepName ? { ok: true, value: current } : checkPublicName(name, { email })), [name, keepName, current, email]);
  // The preview shows what others would see: a name the rules refuse (a
  // student number, an email) is never drawn as if it were public.
  const previewName = keepName ? drawnName(current) : (check.ok || nameLength(check.value) < NAME_MIN) ? check.value : '';

  // Ask whether another member holds the name, once typing pauses.
  useEffect(() => {
    setFree(null);
    if (keepName || !check.ok) return undefined;
    let alive = true;
    const t = setTimeout(() => {
      isPublicNameFree(check.value, user?.id).then((r) => { if (alive) setFree(r); });
    }, 450);
    return () => { alive = false; clearTimeout(t); };
  }, [check.ok, check.value, keepName, user?.id]);

  const fieldError = touched && !keepName && !check.ok ? check.reason : free === false || free === 'taken' ? 'ชื่อนี้มีคนใช้แล้ว ลองชื่ออื่น' : free === 'similar' ? 'คล้ายกับชื่อที่มีคนใช้แล้ว ลองชื่ออื่น' : '';
  const hint = auto && current
    ? `ตอนนี้คือ ${current} ซึ่งระบบตั้งให้`
    : `ไม่เกิน ${NAME_MAX} ตัวอักษร ห้ามอีเมลหรือรหัสนิสิต`;
  const changed = !keepName || picture !== startPicture || shown !== showsOnBoards(user);

  const submit = async (event) => {
    event?.preventDefault();
    setTouched(true);
    setError('');
    if (!keepName && !check.ok) { inputRef.current?.focus(); return; }
    if (free === false || free === 'taken' || free === 'similar') { inputRef.current?.focus(); return; }
    if (mode === 'edit' && !changed) { onCancel?.(); return; }
    setSaving(true);
    try {
      const result = await saveIdentity({
        username: keepName ? undefined : check.value,
        avatarEmoji: picture !== startPicture ? picture : undefined,
        showOnLeaderboard: shown,
        expectUserId: user?.id || null,
      });
      const next = result.profile || { ...profile, username: keepName ? current : check.value, avatar_emoji: picture };
      onSaved?.(next, { metaSaved: result.metaSaved, shown });
    } catch (err) {
      setError(identityWriteError(err));
    } finally {
      setSaving(false);
    }
  };

  const nameId = nameInputId || `${uid}-name`;
  const hintId = `${uid}-hint`;
  const errId = `${uid}-err`;
  const surfacesId = `${uid}-surfaces`;

  return (
    <form className="vmx-id-editor" onSubmit={submit} noValidate aria-labelledby={headingId}>
      {/* The row another member sees, drawn from what is typed now. */}
      <div className="vmx-id-preview" aria-live="polite">
        <span className="vmx-id-preview-label">เพื่อนจะเห็นแบบนี้</span>
        <div className={`vmx-id-row${shown ? '' : ' is-hidden'}`}>
          <span key={picture} className="vmx-id-pic" aria-hidden="true">{picture}</span>
          <span className="vmx-id-row-name">{previewName || 'ชื่อของคุณ'}</span>
        </div>
      </div>

      <div className="vmx-form-group">
        <label htmlFor={nameId}>ชื่อที่เพื่อนเห็น</label>
        <input
          ref={inputRef}
          id={nameId}
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          onBlur={() => setTouched(true)}
          placeholder={auto ? 'เช่น ปิง หรือ ping_vet' : ''}
          maxLength={NAME_MAX + 8}
          autoComplete="nickname"
          autoCapitalize="off"
          spellCheck={false}
          aria-invalid={fieldError ? 'true' : undefined}
          aria-describedby={`${hintId}${fieldError ? ` ${errId}` : ''}`}
        />
        <p id={hintId} className="vmx-id-hint">{hint}</p>
        {fieldError && <p id={errId} className="vmx-id-err" role="alert">{fieldError}</p>}
      </div>

      <fieldset className="vmx-id-pics">
        <legend className="vmx-sr-only">รูป</legend>
        <div className="vmx-id-pic-grid">
          {PICTURES.map((p) => (
            <label key={p.emoji} className="vmx-id-pic-opt">
              <input type="radio" name={`${uid}-pic`} value={p.emoji} checked={picture === p.emoji} onChange={() => setPicture(p.emoji)} />
              <span aria-hidden="true">{p.emoji}</span>
              <span className="vmx-sr-only">{p.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="vmx-id-board">
        <label className="vmx-id-switch">
          <span className="vmx-id-switch-text">
            <strong>แสดงบนกระดานอันดับ</strong>
            <span id={`${uid}-board-what`}>
              {shown
                ? 'เพื่อนเห็นชื่อ รูป และคะแนนสูงสุดบนกระดาน และเห็นว่าคุณกำลังอ่าน'
                : 'ไม่ขึ้นกระดาน อันดับในกลุ่ม และรายชื่อคนที่กำลังอ่าน แต่ชื่อยังแสดงในความเห็น ห้องแข่งที่คุณเข้าเอง สมาชิกกลุ่ม และข้อที่คุณเคยแชร์'}
            </span>
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={shown}
            onChange={(e) => setShown(e.target.checked)}
            aria-describedby={`${uid}-board-what`}
          />
        </label>
        <button
          type="button"
          className="vmx-id-more"
          aria-expanded={surfacesOpen}
          aria-controls={surfacesId}
          onClick={() => setSurfacesOpen((v) => !v)}
        >
          ใครเห็นอะไรบ้าง
        </button>
        <ul id={surfacesId} className="vmx-id-surfaces" hidden={!surfacesOpen}>
          {SURFACES.map((s) => (
            <li key={s.id}>
              <strong>{s.label}</strong>
              <span>{s.shows}</span>
              <span className={s.followsChoice ? 'is-follows' : 'is-always'}>
                {s.followsChoice ? (shown ? 'แสดง' : 'ซ่อนตามที่เลือก') : 'แสดงเสมอ เลือกซ่อนไม่ได้'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {error && <p className="vmx-id-err" role="alert">{error}</p>}

      <div className="vmx-id-actions">
        <button type="submit" className="vmx-btn vmx-btn-primary" disabled={saving} aria-busy={saving || undefined}>
          {saving ? 'กำลังบันทึก' : 'บันทึก'}
        </button>
        {mode === 'intro' ? (
          <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onSkip} disabled={saving}>ไว้ทีหลัง</button>
        ) : (
          <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onCancel} disabled={saving}>ยกเลิก</button>
        )}
      </div>
    </form>
  );
}
