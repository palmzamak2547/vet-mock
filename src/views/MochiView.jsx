import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import MotionSettings from '../components/MotionSettings.jsx';
import MotionSurface from '../components/MotionSurface.jsx';
import StudyBreak from '../components/StudyBreak.jsx';
import BuddySelector from '../components/BuddySelector.jsx';
import { MotionButton } from '../components/MotionFeedback.jsx';
import { EFFECTS, GROUPS } from '../lib/motion-kit/catalog.js';
import { artImgFallback } from '../lib/art-fallback.js';
import { canShow3D } from '../lib/buddy.js';
import { useBuddy } from '../hooks/useBuddy.js';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import MascotStill from '../components/MascotStill.jsx';
import '../styles-buddy.css';

const MascotSquad3DViewer = lazy(() => import('../components/MascotSquad3DViewer.jsx'));

export default function MochiView({ goHome, onOpenFocus, onOpenGame }) {
  const { buddy } = useBuddy();
  const [squadViewMode, setSquadViewMode] = useState('2d');
  // A new pick greets the student once (a hop on the picture, a wave in 3D);
  // opening the page or switching 2D and 3D does not.
  const [arriving, setArriving] = useState(false);
  const shownBuddy = useRef(buddy.id);
  useEffect(() => {
    if (shownBuddy.current === buddy.id) return;
    shownBuddy.current = buddy.id;
    setArriving(true);
  }, [buddy.id]);
  // Assume a device can draw 3D until the probe (after first paint, off the
  // critical path) says otherwise; then the 3D switch is not offered at all.
  const [can3D, setCan3D] = useState(true);
  useEffect(() => {
    const ok = canShow3D();
    setCan3D(ok);
    if (!ok) setSquadViewMode('2d');
  }, []);
  const show3D = can3D && squadViewMode === '3d';
  // /app/mochi#buddy opens on the buddy section (a link from a companion
  // card, or a search result), after layout has placed it.
  useEffect(() => {
    if (globalThis.location?.hash !== '#buddy') return undefined;
    const frame = requestAnimationFrame(() => document.getElementById('buddy')?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, []);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [selected, setSelected] = useState('mochi-hello');
  const [group, setGroup] = useState('mochi');
  const [paused, setPaused] = useState(false);
  const [restart, setRestart] = useState(0);
  const effect = EFFECTS.find(item => item.id === selected);
  const choices = EFFECTS.filter(item => item.group === group);
  function pickGroup(id) { setGroup(id); setSelected(EFFECTS.find(item => item.group === id).id); }
  return <div className="vmx-mochi-page">
    <BackBar onBack={goHome} label="กลับไปเรียน" />
    <header className="vmx-mochi-heading">
      <div><img src="/motion/assets/mochi.png" width="64" height="64" className="vmx-mochi-rest-portrait" alt="" onError={artImgFallback} /><p className="vmx-eyebrow">MOCHI / STUDY BREAK</p><h1>พักกับ Mochi</h1><p>พื้นที่เล็ก ๆ ให้พักมือ พักสายตา แล้วกลับไปเรียนในจังหวะของตัวเอง</p></div>
      {(onOpenFocus || onOpenGame) && <div className="vmx-rest-doors">
        {onOpenFocus && <MotionButton className="vmx-btn vmx-btn-ghost" onClick={onOpenFocus}>จับเวลาอ่านพร้อมช่วงพัก</MotionButton>}
        {onOpenGame && <MotionButton className="vmx-btn vmx-btn-ghost" onClick={onOpenGame}>เกมลูกไก่หนีเชื้อโรค</MotionButton>}
      </div>}
    </header>
    <StudyBreak />
    <MotionSettings />
    <section id="buddy" className="vmx-squad-showcase vmx-buddy-section" aria-labelledby="vmx-buddy-title">
      <p className="vmx-eyebrow vmx-buddy-eyebrow">VETMOCK STUDY SQUAD</p>
      <h2 id="vmx-buddy-title" className="vmx-buddy-title">ผองเพื่อนประจำคลินิก</h2>
      <p className="vmx-buddy-lede">เลือกคู่หูไว้หนึ่งตัว แล้วคู่หูจะอ่านไปด้วยกันตอนจับเวลาโฟกัส และฉลองเมื่อคุณโฟกัสครบเวลา</p>
      <BuddySelector selectedId={buddy.id} label="เลือกคู่หู" />
      <div className="vmx-buddy-spotlight">
        <div className="vmx-buddy-spotlight-head">
          <div className="vmx-buddy-spotlight-name">
            <span className="vmx-buddy-kicker">คู่หูของคุณ</span>
            <strong>{buddy.nameTh} <span lang="en">({buddy.name})</span></strong>
            <span className="vmx-buddy-role">{buddy.role}</span>
            <span className="vmx-buddy-species">{buddy.species}</span>
          </div>
          {can3D && <div className="vmx-buddy-mode" role="group" aria-label="รูปแบบการแสดงคู่หู">
            <button type="button" aria-pressed={!show3D} onClick={() => setSquadViewMode('2d')}>ภาพ 2D</button>
            <button type="button" aria-pressed={show3D} onClick={() => setSquadViewMode('3d')}>โมเดล 3D</button>
          </div>}
        </div>
        {show3D ? (
          <ErrorBoundary fallback={<BuddyPicture buddy={buddy} note="เปิดโมเดล 3D ไม่สำเร็จ จึงแสดงเป็นภาพนิ่งแทน" />}>
            {/* While the 3D chunk loads, the same picture holds the same stage:
                switching 2D to 3D never jumps. */}
            <Suspense fallback={<BuddyPicture buddy={buddy} />}>
              <MascotSquad3DViewer id={buddy.id} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <BuddyPicture buddy={buddy} hop={arriving} onHopEnd={() => setArriving(false)} />
        )}
      </div>
    </section>
    <details className="vmx-motion-examples" onToggle={event => setExamplesOpen(event.currentTarget.open)}>
    <summary>ดูตัวอย่างเอฟเฟกต์และท่า Mochi</summary>
    {examplesOpen && <>
    <div className="vmx-mochi-groups" role="group" aria-label="หมวดกิจกรรม">
      {GROUPS.map(item => <button type="button" key={item.id} aria-pressed={group === item.id} onClick={() => pickGroup(item.id)}>{item.name}<span>{EFFECTS.filter(e => e.group === item.id).length}</span></button>)}
    </div>
    <div className="vmx-mochi-workspace">
      <section className="vmx-mochi-player" aria-labelledby="vmx-mochi-effect-title">
        <div className="vmx-mochi-player-heading"><div><h2 id="vmx-mochi-effect-title">{effect.th}</h2><p>{effect.hint}</p></div></div>
        <MotionSurface effect={selected} paused={paused} restart={restart} />
        <div className="vmx-mochi-controls">
          <button type="button" className="vmx-btn vmx-btn-ghost" aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? 'เล่นต่อ' : 'พักการเคลื่อนไหว'}</button>
          <button type="button" className="vmx-btn vmx-btn-ghost" onClick={() => setRestart(v => v + 1)}>เริ่มกิจกรรมใหม่</button>
          <button type="button" className="vmx-btn vmx-btn-primary" onClick={goHome}>กลับไปเรียน</button>
        </div>
        {['loading', 'interaction', 'celebration'].includes(group) && <p className="vmx-mochi-example-note">พื้นที่ทดลองเอฟเฟกต์ — ปุ่มและข้อความในกรอบนี้เป็นตัวอย่าง ไม่เปลี่ยนโน้ต คะแนน หรือสตรีกของคุณ</p>}
      </section>
      <section className="vmx-mochi-picker" aria-label="เลือกกิจกรรม">
        <label className="vmx-mochi-select">เลือกกิจกรรม
          <select value={selected} onChange={e => setSelected(e.target.value)}>{choices.map(item => <option key={item.id} value={item.id}>{item.th}</option>)}</select>
        </label>
        <div className="vmx-mochi-choices">{choices.map((item, i) => <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}><span className="vmx-mochi-choice-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><span><strong>{item.th}</strong><span>{item.name}</span></span></button>)}</div>
      </section>
    </div>
    </>}
    </details>
  </div>;
}

/** The buddy drawn on the same stage the 3D model uses, standing on a flat
 *  pedestal like the 3D one, so 2D and 3D swap in place. `hop` greets a new
 *  pick; the picture is keyed on the buddy, so each pick plays it once. */
function BuddyPicture({ buddy, note, hop = false, onHopEnd }) {
  if (note) return <div className="vmx-buddy-stage vmx-buddy-stage-still"><MascotStill mascot={buddy} note={note} /></div>;
  return <div className="vmx-buddy-stage vmx-buddy-stage-2d">
    <span className="vmx-buddy-pedestal" aria-hidden="true" />
    <img
      key={buddy.src}
      className="vmx-buddy-stage-picture"
      data-arrive={hop ? '' : undefined}
      onAnimationEnd={onHopEnd}
      src={buddy.src}
      alt={buddy.alt}
      decoding="async"
      onError={artImgFallback}
    />
  </div>;
}
