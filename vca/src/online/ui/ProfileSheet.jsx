// Making or editing a profile. A new one starts from what the student's own VetMock account
// already says (their name and animal there), when they choose to use it; the practice stats
// come from this device and show only when the student switches them on.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Sheet } from '../../components/Sheet.jsx';
import { Icon } from '../../components/Icon.jsx';
import { num } from '../../lib/format.js';
import { progressStore, statsFor, streak } from '../../lib/progress.js';
import { resultsStore } from '../../lib/session.js';
import { Avatar } from './Avatar.jsx';
import { getBackend, saveProfile, useAccount } from '../account.js';
import '../community.css';
import { AVATARS, TONES, handleProblem, statsFrom, suggestHandle } from '../shapes.js';

const SCHOOLS = ['จุฬาลงกรณ์มหาวิทยาลัย', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยขอนแก่น', 'มหาวิทยาลัยเชียงใหม่', 'มหาวิทยาลัยมหิดล', 'มหาวิทยาลัยมหาสารคาม', 'มหาวิทยาลัยสงขลานครินทร์', 'มหาวิทยาลัยแม่โจ้', 'มหาวิทยาลัยวลัยลักษณ์', 'มหาวิทยาลัยเทคโนโลยีมหานคร'];
const ROUNDS = ['2/2569', '1/2570', '2/2570'];

function localStats() {
  const all = statsFor(progressStore.get());
  return statsFrom({ seen: all.seen, correct: all.known, streak: streak(progressStore.get()), mocks: resultsStore.get().filter((r) => r.mode === 'mock').length });
}

export default function ProfileSheet({ open, onClose }) {
  const account = useAccount();
  const existing = account.profile;
  const [form, setForm] = useState(() => existing || {
    name: account.user?.name || '', handle: suggestHandle(account.user?.name, account.user?.email), avatar: '🐾', tone: 'verd',
    school: '', cohort: '', round: '2/2569', bio: '', stats: {}, fromVetmock: false,
  });
  const [showStats, setShowStats] = useState(() => !!existing?.stats?.answered);
  const [snapshot, setSnapshot] = useState(null);
  const [taken, setTaken] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const local = useMemo(localStats, []);
  const check = useRef(0);

  // A new profile: is there a VetMock profile on this account to start from?
  useEffect(() => {
    if (existing || account.status !== 'in') return;
    let live = true;
    getBackend().then((b) => b.profiles.snapshot()).then((s) => { if (live && s && (s.username || s.name)) setSnapshot(s); }).catch(() => {});
    return () => { live = false; };
  }, [existing, account.status]);

  // Is the handle free? Asked a moment after typing stops.
  useEffect(() => {
    const id = ++check.current;
    setTaken(false);
    if (handleProblem(form.handle) || form.handle === existing?.handle) return undefined;
    const t = setTimeout(() => {
      getBackend().then((b) => b.profiles.taken(form.handle)).then((v) => { if (id === check.current) setTaken(v); }).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [form.handle, existing?.handle]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));
  const useSnapshot = () => setForm((f) => ({
    ...f,
    name: snapshot.name || snapshot.username || f.name,
    handle: suggestHandle(snapshot.username) || f.handle,
    avatar: AVATARS.includes(snapshot.avatar) ? snapshot.avatar : f.avatar,
    fromVetmock: true,
  }));
  const problem = handleProblem(form.handle) || (taken ? 'ชื่อนี้มีคนใช้แล้ว' : null);
  const ready = form.name.trim() && !problem;

  const submit = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    setError('');
    try {
      await saveProfile({ ...form, stats: showStats ? local : {} });
      onClose();
    } catch (err) {
      setError(/duplicate|unique/i.test(err.message) ? 'ชื่อผู้ใช้นี้มีคนใช้แล้ว' : (err.message || 'บันทึกไม่สำเร็จ'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title={existing ? 'แก้ไขโปรไฟล์' : 'ตั้งโปรไฟล์'} wide>
      {!existing && snapshot && !form.fromVetmock && (
        <div className="pform-found">
          <span className="pform-found-mark" aria-hidden="true">{snapshot.avatar || '🐾'}</span>
          <div className="pform-found-text">
            <b>เจอบัญชี VetMock ของคุณ</b>
            <span>{snapshot.username ? `@${snapshot.username}` : snapshot.name}{snapshot.answered ? ` ทำไปแล้ว ${num(snapshot.answered)} ข้อ` : ''}</span>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={useSnapshot}>ใช้ชื่อและรูปนี้</button>
        </div>
      )}
      <form className="pform" onSubmit={submit}>
        <div className="pform-hero">
          <Avatar profile={form} size={72} ring />
          <div className="pform-picks">
            <div className="pform-row" role="radiogroup" aria-label="รูปประจำตัว">
              {AVATARS.map((a) => (
                <button key={a} type="button" role="radio" aria-checked={form.avatar === a} className={`pform-emoji${form.avatar === a ? ' on' : ''}`} onClick={() => set('avatar')(a)}>{a}</button>
              ))}
            </div>
            <div className="pform-row" role="radiogroup" aria-label="สี">
              {TONES.map((t) => (
                <button key={t} type="button" role="radio" aria-checked={form.tone === t} aria-label={t} className={`pform-tone av-${t}${form.tone === t ? ' on' : ''}`} onClick={() => set('tone')(t)} />
              ))}
            </div>
          </div>
        </div>

        <label className="form-row">
          <span className="form-label">ชื่อที่แสดง</span>
          <input value={form.name} onChange={set('name')} maxLength={40} required autoComplete="nickname" data-autofocus />
        </label>
        <label className="form-row">
          <span className="form-label">ชื่อผู้ใช้</span>
          <span className="form-prefix"><span aria-hidden="true">@</span>
            <input value={form.handle} onChange={(e) => set('handle')(e.target.value.toLowerCase())} maxLength={20} required autoCapitalize="none" autoComplete="username" spellCheck="false" aria-invalid={!!problem} aria-describedby="handle-note" />
          </span>
          <span id="handle-note" className={`form-note${problem ? ' is-bad' : ''}`}>{problem || 'ใช้เป็นลิงก์โปรไฟล์ เช่น vca.vetmock.com/u/' + form.handle}</span>
        </label>
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
        <label className="form-row">
          <span className="form-label">สอบรอบ</span>
          <span className="select select-block">
            <select value={form.round || ''} onChange={set('round')}>
              <option value="">ยังไม่ได้เลือก</option>
              {ROUNDS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <Icon name="chevronDown" size={18} />
          </span>
        </label>
        <label className="form-row">
          <span className="form-label">แนะนำตัวสั้น ๆ</span>
          <textarea value={form.bio} onChange={set('bio')} maxLength={160} rows={2} placeholder="เช่น อ่อนสัตว์ปีก หาเพื่อนติว" />
          <span className="form-note">{form.bio.length}/160</span>
        </label>
        <label className="switch">
          <input type="checkbox" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} />
          <span className="switch-ui" aria-hidden="true" />
          <span>โชว์สถิติการฝึกบนโปรไฟล์ <span className="hint">{local.answered ? `ทำไปแล้ว ${num(local.answered)} ข้อ${local.accuracy != null ? ` ถูก ${local.accuracy}%` : ''}` : 'ยังไม่มีสถิติในเครื่องนี้'}</span></span>
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="pform-go">
          <button type="submit" className="btn btn-ink" disabled={!ready || busy}>
            {busy ? <span className="spinner" aria-hidden="true" /> : <Icon name="check" size={18} />}
            {existing ? 'บันทึก' : 'เริ่มใช้ชุมชน'}
          </button>
          {!existing && <button type="button" className="btn btn-ghost" onClick={onClose}>ไว้ทีหลัง</button>}
        </div>
      </form>
    </Sheet>
  );
}
