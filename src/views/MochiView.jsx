import { useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import MotionSettings from '../components/MotionSettings.jsx';
import MotionSurface from '../components/MotionSurface.jsx';
import StudyBreak from '../components/StudyBreak.jsx';
import { MotionButton } from '../components/MotionFeedback.jsx';
import { EFFECTS, GROUPS } from '../lib/motion-kit/catalog.js';

export default function MochiView({ goHome, onOpenFocus }) {
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
      <div><img src="/motion/assets/mochi.png" width="64" height="64" className="vmx-mochi-rest-portrait" alt="" /><p className="vmx-eyebrow">MOCHI / STUDY BREAK</p><h1>พักกับ Mochi</h1><p>พื้นที่เล็ก ๆ ให้พักมือ พักสายตา แล้วกลับไปเรียนในจังหวะของตัวเอง</p></div>
      {onOpenFocus && <MotionButton className="vmx-btn vmx-btn-ghost" onClick={onOpenFocus}>จับเวลาอ่านพร้อมช่วงพัก</MotionButton>}
    </header>
    <StudyBreak />
    <MotionSettings />
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
