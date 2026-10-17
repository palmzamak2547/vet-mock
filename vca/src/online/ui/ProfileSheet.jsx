// A profile: made in four short steps the first time (who you are, about you, what you are
// revising, and where to go next), then edited on one page. It can start from what the student's
// own VetMock account already says (name and animal) when they choose to use it; the photo is
// their own; the practice stats come from this device and show only when switched on.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Sheet } from '../../components/Sheet.jsx';
import { Icon } from '../../components/Icon.jsx';
import { Link } from '../../components/Link.jsx';
import { ShareButton } from '../../components/Share.jsx';
import { TypingHint } from '../../components/TypingHint.jsx';
import { num } from '../../lib/format.js';
import { DOMAIN_CARDS } from '../../lib/bank.js';
import { progressStore, statsFor, streak } from '../../lib/progress.js';
import { resultsStore } from '../../lib/session.js';
import { PhotoPicker } from './PhotoPicker.jsx';
import { ProfileCard } from './ProfileCard.jsx';
import { refreshCover } from '../cover.js';
import { getBackend, saveProfile, useAccount } from '../account.js';
import '../community.css';
import { AVATARS, TONES, handleProblem, problemText, statsFrom, suggestHandle } from '../shapes.js';

const SCHOOLS = ['จุฬาลงกรณ์มหาวิทยาลัย', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยขอนแก่น', 'มหาวิทยาลัยเชียงใหม่', 'มหาวิทยาลัยมหิดล', 'มหาวิทยาลัยมหาสารคาม', 'มหาวิทยาลัยสงขลานครินทร์', 'มหาวิทยาลัยแม่โจ้', 'มหาวิทยาลัยวลัยลักษณ์', 'มหาวิทยาลัยเทคโนโลยีมหานคร'];
const ROUNDS = ['2/2569', '1/2570', '2/2570'];
const FOCUS_MAX = 8;
// What a screen reader says for each colour swatch (the tone's own id is a design token's name).
const TONE_NAMES = { verd: 'เขียว', brass: 'ทอง', cinn: 'ส้มอิฐ', cobalt: 'น้ำเงิน', plum: 'ม่วง', ink: 'เทาเข้ม' };
const STEPS = ['ตัวตน', 'เกี่ยวกับคุณ', 'หมวดที่สนใจ'];
// Typed into the empty fields as examples (components/TypingHint.jsx).
const NAME_EXAMPLES = ['มิ้นท์', 'ภูมิ Vet 86', 'แพรวา'];
const BIO_EXAMPLES = ['อ่อนสัตว์ปีก หาเพื่อนติว', 'ถนัดสัตว์เล็ก ถามได้เลย', 'ติวด้วยกันทุกคืนวันพุธ'];

// Other usernames to try when the one typed is taken: the same name with the student's cohort
// number (Vet 86 gives _86) or marked as a vet student. Each is checked again when picked.
function alternatives(handle, cohort) {
  const base = handle.replace(/_+$/, '').slice(0, 16);
  const year = String(cohort || '').match(/\d{2,3}/)?.[0];
  return [year && `${base}_${year}`, `${base}_vet`, `${base}_vca`].filter((h) => h && h !== handle && !handleProblem(h)).slice(0, 2);
}

function localStats() {
  const all = statsFor(progressStore.get());
  return statsFrom({ seen: all.seen, correct: all.known, streak: streak(progressStore.get()), mocks: resultsStore.get().filter((r) => r.mode === 'mock').length });
}

/** What the username check found, under the field: checking, free, taken (with others to try)
 *  or a rule it breaks. */
function ClaimNote({ form, set, problem, free, existing }) {
  if (problem) {
    const tries = problem === 'ชื่อนี้มีคนใช้แล้ว' ? alternatives(form.handle, form.cohort) : [];
    return (
      <>
        <span id="handle-note" className="form-note claim-note is-bad" role="status">{problem}{tries.length > 0 && ' ลองชื่อนี้แทน'}</span>
        {tries.length > 0 && (
          <span className="claim-try">
            {tries.map((h) => <button key={h} type="button" className="chip" onClick={() => set('handle')(h)}>@{h}</button>)}
          </span>
        )}
      </>
    );
  }
  if (form.handle === existing?.handle) return <span id="handle-note" className="form-note claim-note">ชื่อผู้ใช้ปัจจุบันของคุณ</span>;
  if (free) return <span id="handle-note" className="form-note claim-note is-free" role="status"><Icon name="check" size={14} />ว่าง ลิงก์ของคุณคือ vca.vetmock.com/u/{form.handle}</span>;
  return <span id="handle-note" className="form-note claim-note"><span className="spinner" aria-hidden="true" />กำลังเช็กว่ามีคนใช้หรือยัง</span>;
}

/** Photo or animal, colour, name and handle: the part every profile needs. */
function Identity({ form, set, snapshot, useSnapshot, problem, free, existing, onCropping, cropping }) {
  return (
    <>
      {!existing && snapshot && !form.fromVetmock && (
        <div className="pform-found">
          <span className="pform-found-mark" aria-hidden="true">{snapshot.avatar || '🐾'}</span>
          <p className="pform-found-text">ใช้ชื่อจาก VetMock <b>{snapshot.username ? `@${snapshot.username}` : snapshot.name}</b></p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={useSnapshot}>ใช้</button>
        </div>
      )}
      <div className={`pform-hero${cropping ? ' is-cropping' : ''}`}>
        <div className="pform-picks">
          <PhotoPicker photo={form.photo} onChange={set('photo')} onCropping={onCropping} />
          {!cropping && !form.photo && (
            <details className="pform-more">
              <summary>เลือกสัตว์แทน <Icon name="chevronDown" size={16} /></summary>
              <div className="pform-row" role="radiogroup" aria-label="สัตว์ประจำตัว">
                {AVATARS.map((a) => (
                  <button key={a} type="button" role="radio" aria-checked={form.avatar === a} className={`pform-emoji${form.avatar === a ? ' on' : ''}`} onClick={() => set('avatar')(a)}>{a}</button>
                ))}
              </div>
              <div className="pform-row" role="radiogroup" aria-label="สีพื้น">
                {TONES.map((t) => (
                  <button key={t} type="button" role="radio" aria-checked={form.tone === t} aria-label={TONE_NAMES[t] || t} className={`pform-tone av-${t}${form.tone === t ? ' on' : ''}`} onClick={() => set('tone')(t)} />
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
      {!cropping && (
        <>
          <label className="form-row">
            <span className="form-label">ชื่อที่แสดง</span>
            <input value={form.name} onChange={set('name')} maxLength={40} required autoComplete="nickname" placeholder="ชื่อเล่นหรือชื่อจริงก็ได้" data-autofocus />
            <TypingHint examples={NAME_EXAMPLES} />
          </label>
          <div className="form-row claim-row">
            <label className="form-label" htmlFor="handle-input">ชื่อผู้ใช้</label>
            <span className="form-prefix"><span aria-hidden="true">@</span>
              <input id="handle-input" value={form.handle} onChange={(e) => set('handle')(e.target.value.toLowerCase())} maxLength={20} required autoCapitalize="none" autoComplete="username" spellCheck="false" aria-invalid={!!problem} aria-describedby="handle-note" />
            </span>
            <ClaimNote form={form} set={set} problem={problem} free={free} existing={existing} />
          </div>
        </>
      )}
    </>
  );
}

function About({ form, set }) {
  return (
    <>
      <div className="form-pair">
        <label className="form-row">
          <span className="form-label">มหาวิทยาลัย</span>
          <input value={form.school} onChange={set('school')} maxLength={60} list="schools" placeholder="ไม่บอกก็ได้" />
          <datalist id="schools">{SCHOOLS.map((s) => <option key={s} value={s} />)}</datalist>
        </label>
        <label className="form-row">
          <span className="form-label">รุ่น</span>
          <input value={form.cohort} onChange={set('cohort')} maxLength={24} placeholder="เช่น Vet 85" />
        </label>
      </div>
      <fieldset className="form-row pform-rounds">
        <legend className="form-label">สอบรอบ</legend>
        <div className="chips" role="radiogroup" aria-label="สอบรอบ">
          {[...ROUNDS, ''].map((r) => (
            <button key={r || 'none'} type="button" role="radio" aria-checked={form.round === r} className={`chip${form.round === r ? ' on' : ''}`} onClick={() => set('round')(r)}>{r || 'ยังไม่แน่ใจ'}</button>
          ))}
        </div>
      </fieldset>
      <label className="form-row">
        <span className="form-label">แนะนำตัวสั้น ๆ</span>
        <textarea value={form.bio} onChange={set('bio')} maxLength={160} rows={2} placeholder="เช่น อ่อนสัตว์ปีก หาเพื่อนติว" />
        <TypingHint examples={BIO_EXAMPLES} />
        <span className="form-note">{form.bio.length}/160</span>
      </label>
    </>
  );
}

function Focus({ form, set, showStats, setShowStats, local }) {
  const toggle = (id) => {
    const has = form.focus.includes(id);
    if (!has && form.focus.length >= FOCUS_MAX) return;
    set('focus')(has ? form.focus.filter((x) => x !== id) : [...form.focus, id]);
  };
  return (
    <>
      <p className="sheet-p">หมวดที่กำลังเตรียม ได้ถึง {FOCUS_MAX} หมวด ขึ้นบนโปรไฟล์และเป็นทางลัดในกระดาน ตัวเลขคือจำนวนข้อ</p>
      <div className="chips pform-focus" role="group" aria-label="หมวดที่สนใจ">
        {DOMAIN_CARDS.map((d) => {
          const on = form.focus.includes(d.id);
          return (
            <button key={d.id} type="button" aria-pressed={on} className={`chip${on ? ' on' : ''}`} onClick={() => toggle(d.id)} disabled={!on && form.focus.length >= FOCUS_MAX}>
              {on && <Icon name="check" size={14} />}{d.th}<span className="chip-n">{num(d.count)}</span>
            </button>
          );
        })}
      </div>
      <p className="form-note">เลือกแล้ว {form.focus.length}/{FOCUS_MAX}</p>
      <label className="switch">
        <input type="checkbox" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} />
        <span className="switch-ui" aria-hidden="true" />
        <span>โชว์สถิติการฝึกบนโปรไฟล์ <span className="hint">{local.answered ? `ทำไปแล้ว ${num(local.answered)} ข้อ${local.accuracy != null ? ` ถูก ${local.accuracy}%` : ''}` : 'ยังไม่มีสถิติในเครื่องนี้'}</span></span>
      </label>
    </>
  );
}

/** The last step: the card gets its stamp, the username is theirs, one thing to do (share it)
 *  and three ways in. */
function Welcome({ profile, onClose }) {
  return (
    <div className="welcome">
      <div className="welcome-card"><ProfileCard profile={profile} stamped /></div>
      <h3 className="welcome-h">@{profile.handle} เป็นของคุณแล้ว</h3>
      <div className="welcome-go">
        <ShareButton path={`/u/${profile.handle}`} title={`${profile.name} (@${profile.handle})`} text="มาฝึกข้อสอบ VCA ด้วยกันที่ VetMock VCA" label="แชร์โปรไฟล์" className="btn btn-ink" />
        <Link to="/community/new" className="btn btn-ghost" onClick={onClose}><Icon name="edit" size={18} />ตั้งกระทู้แรก</Link>
      </div>
      <p className="welcome-ways">
        <Link to="/chat/lobby" className="text-link" onClick={onClose}>ทักทายในห้องรวม</Link>
        <Link to={`/u/${profile.handle}`} className="text-link" onClick={onClose}>ดูโปรไฟล์ของคุณ</Link>
      </p>
    </div>
  );
}

export default function ProfileSheet({ open, onClose }) {
  const account = useAccount();
  const existing = account.profile;
  const [form, setForm] = useState(() => (existing ? { ...existing } : {
    name: account.user?.name || '', handle: suggestHandle(account.user?.name, account.user?.email), avatar: '🐾', tone: 'verd', photo: null,
    school: '', cohort: '', round: '2/2569', bio: '', stats: {}, focus: [], fromVetmock: false,
  }));
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [showStats, setShowStats] = useState(() => !!existing?.stats?.answered);
  const [snapshot, setSnapshot] = useState(null);
  const [taken, setTaken] = useState(false);
  const [checked, setChecked] = useState(''); // the last username the backend said is free
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const local = useMemo(localStats, []);
  const check = useRef(0);
  const firstPhoto = useRef(existing?.photo || null);
  const tried = useRef(new Set());

  useEffect(() => {
    if (existing || account.status !== 'in') return;
    let live = true;
    getBackend().then((b) => b.profiles.snapshot()).then((s) => { if (live && s && (s.username || s.name)) setSnapshot(s); }).catch(() => {});
    return () => { live = false; };
  }, [existing, account.status]);

  useEffect(() => {
    const id = ++check.current;
    setTaken(false);
    if (handleProblem(form.handle) || form.handle === existing?.handle) return undefined;
    const t = setTimeout(() => {
      getBackend().then((b) => b.profiles.taken(form.handle)).then((v) => {
        if (id !== check.current) return;
        setTaken(v);
        if (!v) setChecked(form.handle);
      }).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [form.handle, existing?.handle]);

  // Photos tried and dropped before saving are taken back; so is the old one after a change.
  const set = (k) => (e) => {
    const v = e?.target ? e.target.value : e;
    if (k === 'photo' && v) tried.current.add(v);
    setForm((f) => ({ ...f, [k]: v }));
  };
  const leave = () => {
    const unused = [...tried.current];
    if (unused.length) getBackend().then((b) => b.media.discard(unused)).catch(() => {});
    onClose();
  };
  const useSnapshot = () => setForm((f) => ({
    ...f,
    name: snapshot.name || snapshot.username || f.name,
    handle: suggestHandle(snapshot.username) || f.handle,
    avatar: AVATARS.includes(snapshot.avatar) ? snapshot.avatar : f.avatar,
    fromVetmock: true,
  }));
  const problem = handleProblem(form.handle) || (taken ? 'ชื่อนี้มีคนใช้แล้ว' : null);
  const free = !problem && checked === form.handle;
  const identityOk = form.name.trim() && !problem;

  const save = async () => {
    if (!identityOk) { setStep(0); return; }
    setBusy(true);
    setError('');
    try {
      const saved = await saveProfile({ ...form, stats: showStats ? local : {}, onboardedAt: existing?.onboardedAt || new Date().toISOString() });
      const kept = saved.photo;
      tried.current.delete(kept);
      const drop = [...tried.current, ...(firstPhoto.current && firstPhoto.current !== kept ? [firstPhoto.current] : [])];
      tried.current.clear();
      if (drop.length) getBackend().then((b) => b.media.discard(drop)).catch(() => {});
      // The link preview follows the profile; it is drawn on this device, off the main path.
      getBackend().then((b) => refreshCover(saved, b)).catch(() => {});
      if (existing) onClose(); else setDone(saved);
    } catch (err) {
      setError(/duplicate|unique/i.test(err.message) ? 'ชื่อผู้ใช้นี้มีคนใช้แล้ว' : problemText(err));
    } finally {
      setBusy(false);
    }
  };

  const props = { form, set, snapshot, useSnapshot, problem, free, existing, cropping, onCropping: setCropping };
  const card = !cropping && <ProfileCard profile={form} />;
  if (done) {
    return <Sheet open={open} onClose={onClose} title="โปรไฟล์ของคุณ" wide><Welcome profile={done} onClose={onClose} /></Sheet>;
  }
  if (existing) {
    return (
      <Sheet open={open} onClose={leave} title="แก้ไขโปรไฟล์" wide>
        {card}
        <form className="pform" onSubmit={(e) => { e.preventDefault(); save(); }}>
          <Identity {...props} />
          {!cropping && (
            <>
              <About form={form} set={set} />
              <h3 className="pform-sub">หมวดที่สนใจ</h3>
              <Focus form={form} set={set} showStats={showStats} setShowStats={setShowStats} local={local} />
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="pform-go">
                <button type="submit" className="btn btn-ink" disabled={!identityOk || busy}>
                  {busy ? <span className="spinner" aria-hidden="true" /> : <Icon name="check" size={18} />}บันทึก
                </button>
                <button type="button" className="btn btn-ghost" onClick={leave}>ยกเลิก</button>
              </div>
            </>
          )}
        </form>
      </Sheet>
    );
  }

  const last = step === STEPS.length - 1;
  const next = (e) => { e.preventDefault(); if (step === 0 && !identityOk) return; if (last) save(); else setStep(step + 1); };
  return (
    <Sheet open={open} onClose={leave} title="ตั้งโปรไฟล์" wide>
      <ol className="steps" aria-label={`ขั้นที่ ${step + 1} จาก ${STEPS.length}`}>
        {STEPS.map((s, i) => <li key={s} className={i === step ? 'on' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}><span className="steps-dot" aria-hidden="true">{i < step ? <Icon name="check" size={12} /> : i + 1}</span>{s}</li>)}
      </ol>
      {card}
      <form className="pform" onSubmit={next}>
        {step === 0 && <Identity {...props} />}
        {step === 1 && <About form={form} set={set} />}
        {step === 2 && <Focus form={form} set={set} showStats={showStats} setShowStats={setShowStats} local={local} />}
        {!cropping && (
          <>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="pform-go">
              <button type="submit" className="btn btn-ink" disabled={(step === 0 && !identityOk) || busy}>
                {busy ? <span className="spinner" aria-hidden="true" /> : <Icon name={last ? 'check' : 'arrowRight'} size={18} />}
                {last ? 'เริ่มใช้ชุมชน' : 'ต่อไป'}
              </button>
              {step > 0 ? <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>ย้อนกลับ</button>
                : <button type="button" className="btn btn-ghost" onClick={leave}>ไว้ทีหลัง</button>}
              {step > 0 && !last && <button type="button" className="text-link pform-skip" onClick={() => setStep(step + 1)}>ข้ามขั้นนี้</button>}
            </div>
          </>
        )}
      </form>
    </Sheet>
  );
}
