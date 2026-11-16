// ============================================================
// ReadAloudBar — the controls of the read-aloud while it reads
// ============================================================
// Fixed above the bottom of the screen (and above a phone's sticky
// ข้อก่อนหน้า / ข้อถัดไป row), so it never moves the page. One height in every
// state: loading, playing, paused, an error and the live voices only change
// what its parts say. The engine (lib/read-aloud.js) is passed in once loaded.
// ============================================================
import { Suspense, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import NavIcon from './NavIcon.jsx';
import { readAloud, RATES } from '../lib/read-aloud-store.js';
import { lazyWithRetry } from '../lib/lazy-retry.js';

// The voice settings load on the tap that opens them.
const VoiceSettings = lazyWithRetry(() => import('./VoiceSettings.jsx'));

const clock = (s) => {
  const t = Math.max(0, Math.round(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

// timed: the card is inside a timed paper; the speed button then steps the
// speed as before instead of opening the voice settings.
// hostRef: the text being read sits in a dialog, so the bar is drawn inside
// it (still fixed to the screen): above the dialog, reached by Tab inside it,
// and under any sheet opened later, such as the voice settings.
export default function ReadAloudBar({ jobPrefix, engine, timed = false, hostRef = null, optionLetter = (i) => String.fromCharCode(65 + i) }) {
  const st = useSyncExternalStore(readAloud.subscribe, readAloud.get, readAloud.get);
  const [drag, setDrag] = useState(null);
  // The voice settings, open over the page; they stay open if the reading ends meanwhile.
  const [tuning, setTuning] = useState(false);
  const [place, setPlace] = useState({ lift: 12, nav: null });
  const barRef = useRef(null);
  const rangeRef = useRef(null);
  const mine = Boolean(st.job && st.job.id.startsWith(jobPrefix));

  // On a phone the previous/next row sticks to the bottom: sit above it. The
  // bottom nav's height is read where the app sets it (focus mode zeroes it on
  // .vmx-app, which this portal is outside). While the bar is up the page gets
  // room, as tall as the space from the bar's top down, to scroll its last
  // lines (and the previous/next row) out from under it.
  useLayoutEffect(() => {
    if (!mine) return undefined;
    const root = document.documentElement;
    root.classList.add('vmx-read-open');
    const row = document.querySelector('.vmx-exam-actions');
    const app = document.querySelector('.vmx-app');
    const update = () => {
      const nav = app ? getComputedStyle(app).getPropertyValue('--vmx-bottom-nav-h').trim() || null : null;
      const lift = row && getComputedStyle(row).position === 'sticky' ? row.offsetHeight + 20 : 12;
      setPlace((p) => (p.lift === lift && p.nav === nav ? p : { lift, nav }));
      const bar = barRef.current?.getBoundingClientRect();
      if (bar) root.style.setProperty('--vmx-read-spacer', `${Math.ceil(window.innerHeight - bar.top + 8)}px`);
    };
    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (row) ro?.observe(row);
    if (barRef.current) ro?.observe(barRef.current);
    window.addEventListener('resize', update);
    // A screen reader's adjustment (VoiceOver, TalkBack) fires change, not
    // pointerup or keyup: commit the seek on change too.
    const input = rangeRef.current;
    const onChange = () => { const v = Number(input?.value); if (Number.isFinite(v)) { engine?.seek(v); setDrag(null); } };
    input?.addEventListener('change', onChange);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', update);
      input?.removeEventListener('change', onChange);
      root.classList.remove('vmx-read-open');
      root.style.removeProperty('--vmx-read-spacer');
    };
  }, [mine, engine]);

  if (typeof document === 'undefined') return null;
  // Its own portal: the bar's transform would hold a fixed dialog inside it.
  const sheet = tuning && !timed ? createPortal(
    <Suspense fallback={null}>
      <VoiceSettings onClose={() => setTuning(false)} />
    </Suspense>,
    document.body,
  ) : null;
  if (!mine) return sheet;
  const busy = st.status === 'playing' || st.status === 'loading';
  // Clips and the live voices have the same controls: pause, resume, points, speed.
  const clipControls = Boolean(engine);
  const byPoint = st.points > 1;
  const where = st.job.what === 'q'
    ? (st.kind === 'stem' ? st.job.stemLabel || 'โจทย์' : st.option >= 0 ? `ตัวเลือก ${optionLetter(st.option)}` : '')
    : '';
  const say = st.status === 'error' ? st.note
    : st.status === 'loading' ? 'กำลังโหลดเสียง'
    : st.status === 'paused' ? 'หยุดชั่วคราว'
    : st.device ? 'เสียงอ่านของเครื่อง'
    : '';
  const shown = drag ?? st.time;
  const commit = () => { if (drag != null) { engine?.seek(drag); setDrag(null); } };
  const nextRate = RATES[(RATES.indexOf(st.rate) + 1) % RATES.length];

  return <>{sheet}{createPortal(
    <div ref={barRef} className={`vmx-read-bar is-${st.status}`} role="region" aria-label="เสียงอ่าน" style={{ '--vmx-read-bar-lift': `${place.lift}px`, ...(place.nav ? { '--vmx-bottom-nav-h': place.nav } : {}) }}>
      <div className="vmx-read-bar-ctrl">
        <button type="button" className="vmx-read-btn" disabled={!clipControls}
          aria-label={byPoint ? 'ย้อนไปจุดก่อนหน้า' : 'ย้อนกลับ 10 วินาที'} title={byPoint ? 'จุดก่อนหน้า' : 'ย้อน 10 วินาที'}
          onClick={() => engine?.prev()}>
          <NavIcon name="skip-back" size={20} />
        </button>
        <button type="button" className="vmx-read-btn vmx-read-main"
          aria-label={busy ? 'หยุดชั่วคราว' : 'เล่นต่อ'} title={busy ? 'หยุดชั่วคราว' : 'เล่นต่อ'}
          onClick={() => engine?.toggle()}>
          {st.status === 'loading'
            ? <span className="vmx-read-spin" aria-hidden="true" />
            : <NavIcon name={busy ? 'pause' : 'play'} size={22} />}
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
        {timed ? (
          // A timed paper keeps the bar as it was: the speed steps on a tap,
          // and no dialog opens over a running clock.
          <button type="button" className="vmx-read-btn vmx-read-rate" disabled={!clipControls}
            aria-label={`ความเร็ว ${st.rate} เท่า แตะเพื่อเปลี่ยนเป็น ${nextRate} เท่า`} title="ความเร็วเสียงอ่าน"
            onClick={() => engine?.setRate(nextRate)}>
            {st.rate}x
          </button>
        ) : (
          <button type="button" className="vmx-read-btn vmx-read-rate" aria-haspopup="dialog" aria-expanded={tuning}
            aria-label={`ปรับเสียงอ่าน ความเร็ว ${st.rate} เท่า`} title="ปรับเสียงอ่าน"
            onClick={() => setTuning(true)}>
            {st.rate}x
            <span aria-hidden="true" style={{ display: 'inline-flex', marginLeft: 3, opacity: 0.75 }}><NavIcon name="tune" size={15} /></span>
          </button>
        )}
        <button type="button" className="vmx-read-btn" aria-label="ปิดเสียงอ่าน" title="ปิดเสียงอ่าน" onClick={() => engine?.stop()}>
          <NavIcon name="close" size={18} />
        </button>
      </div>
      <div className="vmx-read-bar-scrub">
        <input ref={rangeRef} type="range" min="0" max={Math.max(st.duration, 0.1)} step="0.1" value={Math.min(shown, Math.max(st.duration, 0.1))}
          disabled={!clipControls || !st.duration}
          aria-label="ตำแหน่งที่อ่าน" aria-valuetext={`${clock(shown)} จาก ${clock(st.duration)}`}
          style={{ '--p': st.duration ? Math.min(1, shown / st.duration) : 0 }}
          onChange={(e) => setDrag(Number(e.target.value))}
          onPointerUp={commit} onPointerCancel={commit} onKeyUp={commit} onBlur={commit} />
        <span className="vmx-read-time" aria-hidden="true">{clock(shown)} / {clock(st.duration)}</span>
      </div>
    </div>,
    hostRef?.current || document.body,
  )}</>;
}
