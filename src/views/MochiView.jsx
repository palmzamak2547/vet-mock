import { useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import MotionSettings from '../components/MotionSettings.jsx';
import MotionSurface from '../components/MotionSurface.jsx';
import StudyBreak from '../components/StudyBreak.jsx';
import { MotionButton } from '../components/MotionFeedback.jsx';
import { EFFECTS, GROUPS } from '../lib/motion-kit/catalog.js';
import { SQUAD_MASCOTS } from '../data/art.js';

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
    <section className="vmx-squad-showcase" style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--clr-border)' }}>
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <p className="vmx-eyebrow" style={{ color: 'var(--clr-sage-text)' }}>VETMOCK STUDY SQUAD</p>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '4px 0', color: 'var(--clr-ink)' }}>ผองเพื่อนประจำคลินิก</h2>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--clr-ink-soft)' }}>
          คู่หูตัวการ์ตูนประจำแต่ละหมวดวิชา ที่พร้อมร่วมอ่านและเป็นกำลังใจให้ทุกการทบทวน
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 'var(--space-3)',
      }}>
        {Object.values(SQUAD_MASCOTS).map((m) => (
          <div key={m.id} style={{
            padding: 'var(--space-3)',
            borderRadius: 'var(--r-md, 12px)',
            background: 'var(--clr-surface-2, rgba(255, 255, 255, 0.7))',
            border: '1px solid var(--clr-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <img
              src={m.src}
              alt={m.alt}
              width={100}
              height={100}
              loading="lazy"
              decoding="async"
              style={{ width: '84px', height: '84px', objectFit: 'contain', borderRadius: '10px', marginBottom: '8px' }}
            />
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--clr-ink)' }}>
              {m.nameTh}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--clr-sage-text)', fontWeight: 500, marginTop: '2px' }}>
              {m.role}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--clr-ink-soft)', marginTop: '4px', lineHeight: 1.3 }}>
              {m.species}
            </div>
          </div>
        ))}
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
