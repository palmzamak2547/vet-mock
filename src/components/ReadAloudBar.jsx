// ============================================================
// ReadAloudBar — the controls of the read-aloud while it reads
// ============================================================
// Fixed above the bottom of the screen (and above a phone's sticky
// ข้อก่อนหน้า / ข้อถัดไป row), so it never moves the page. One height in every
// state: loading, playing, paused, an error and the live voices only change
// what its parts say. The engine (lib/read-aloud.js) is passed in once loaded.
// ============================================================
import { useLayoutEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import NavIcon from './NavIcon.jsx';
import { readAloud, RATES } from '../lib/read-aloud-store.js';

const clock = (s) => {
  const t = Math.max(0, Math.round(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

export default function ReadAloudBar({ jobPrefix, engine, optionLetter = (i) => String.fromCharCode(65 + i) }) {
  const st = useSyncExternalStore(readAloud.subscribe, readAloud.get, readAloud.get);
  const [drag, setDrag] = useState(null);
  const [lift, setLift] = useState(12);
  const mine = Boolean(st.job && st.job.id.startsWith(jobPrefix));

  // On a phone the previous/next row sticks to the bottom: sit above it. While
  // the bar is up the page gets room to scroll its last lines out from under it.
  useLayoutEffect(() => {
    if (!mine) return undefined;
    document.documentElement.classList.add('vmx-read-open');
    const row = document.querySelector('.vmx-exam-actions');
    if (!row) return () => document.documentElement.classList.remove('vmx-read-open');
    const update = () => setLift(getComputedStyle(row).position === 'sticky' ? row.offsetHeight + 20 : 12);
    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(row);
    window.addEventListener('resize', update);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', update);
      document.documentElement.classList.remove('vmx-read-open');
    };
  }, [mine]);

  if (!mine || typeof document === 'undefined') return null;
  const busy = st.status === 'playing' || st.status === 'loading';
  const clipControls = Boolean(engine) && !st.device;
  const byPoint = st.points > 1;
  const where = st.job.what === 'q'
    ? (st.kind === 'stem' ? 'โจทย์' : st.option >= 0 ? `ตัวเลือก ${optionLetter(st.option)}` : '')
    : '';
  const say = st.status === 'error' ? st.note
    : st.device ? 'เสียงอ่านของเครื่อง'
    : st.status === 'loading' ? 'กำลังโหลดเสียง'
    : st.status === 'paused' ? 'หยุดชั่วคราว'
    : '';
  const shown = drag ?? st.time;
  const commit = () => { if (drag != null) { engine?.seek(drag); setDrag(null); } };
  const nextRate = RATES[(RATES.indexOf(st.rate) + 1) % RATES.length];

  return createPortal(
    <div className={`vmx-read-bar is-${st.status}`} role="region" aria-label="เสียงอ่าน" style={{ '--vmx-read-bar-lift': `${lift}px` }}>
      <div className="vmx-read-bar-ctrl">
        <button type="button" className="vmx-read-btn" disabled={!clipControls}
          aria-label={byPoint ? 'ย้อนไปจุดก่อนหน้า' : 'ย้อนกลับ 10 วินาที'} title={byPoint ? 'จุดก่อนหน้า' : 'ย้อน 10 วินาที'}
          onClick={() => engine?.prev()}>
          <NavIcon name="skip-back" size={20} />
        </button>
        <button type="button" className="vmx-read-btn vmx-read-main" aria-pressed={busy}
          aria-label={st.device ? 'หยุดอ่าน' : busy ? 'หยุดชั่วคราว' : 'เล่นต่อ'} title={st.device ? 'หยุดอ่าน' : busy ? 'หยุดชั่วคราว' : 'เล่นต่อ'}
          onClick={() => (st.device ? engine?.stop() : engine?.toggle())}>
          {st.status === 'loading' && !st.device
            ? <span className="vmx-read-spin" aria-hidden="true" />
            : <NavIcon name={busy ? (st.device ? 'speaker-off' : 'pause') : 'play'} size={22} />}
        </button>
        <button type="button" className="vmx-read-btn" disabled={!clipControls}
          aria-label={byPoint ? 'ข้ามไปจุดถัดไป' : 'ข้ามไป 10 วินาที'} title={byPoint ? 'จุดถัดไป' : 'ข้าม 10 วินาที'}
          onClick={() => engine?.next()}>
          <NavIcon name="skip-forward" size={20} />
        </button>
      </div>
      <div className="vmx-read-bar-info">
        <span className="vmx-read-title">{st.job.title}{where && <span className="vmx-read-where">{where}</span>}</span>
        <span className="vmx-read-state" role="status" aria-live="polite">{say}</span>
      </div>
      <div className="vmx-read-bar-end">
        <button type="button" className="vmx-read-btn vmx-read-rate" disabled={!clipControls}
          aria-label={`ความเร็ว ${st.rate} เท่า แตะเพื่อเปลี่ยนเป็น ${nextRate} เท่า`} title="ความเร็วเสียงอ่าน"
          onClick={() => engine?.setRate(nextRate)}>
          {st.rate}x
        </button>
        <button type="button" className="vmx-read-btn" aria-label="ปิดเสียงอ่าน" title="ปิดเสียงอ่าน" onClick={() => engine?.stop()}>
          <NavIcon name="close" size={18} />
        </button>
      </div>
      <div className="vmx-read-bar-scrub">
        <input type="range" min="0" max={Math.max(st.duration, 0.1)} step="0.1" value={Math.min(shown, Math.max(st.duration, 0.1))}
          disabled={!clipControls || !st.duration}
          aria-label="ตำแหน่งที่อ่าน" aria-valuetext={`${clock(shown)} จาก ${clock(st.duration)}`}
          style={{ '--p': st.duration ? Math.min(1, shown / st.duration) : 0 }}
          onChange={(e) => setDrag(Number(e.target.value))}
          onPointerUp={commit} onKeyUp={commit} onBlur={commit} />
        <span className="vmx-read-time" aria-hidden="true">{clock(shown)} / {clock(st.duration)}</span>
      </div>
    </div>,
    document.body,
  );
}
