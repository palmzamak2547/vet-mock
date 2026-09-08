import { useEffect, useRef, useState } from 'react';
import { createScope } from '../lib/motion-kit/core.js';
import { createParticles } from '../lib/motion-kit/particles.js';
import { selectReadingItem } from '../lib/motion-kit/reading.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { MotionButton } from './MotionFeedback.jsx';

const POINTERS = [
  ['none', 'ปิดตัวชี้'], ['spotlight', 'แสงตามสายตา'], ['halo', 'วงแหวน'],
  ['ink', 'หมึกชั่วคราว'], ['paw', 'รอยอุ้งเท้า'], ['comet', 'ดาวหาง'],
  ['orbit', 'ดาวโคจร'], ['leaf', 'ใบไม้'], ['mochi', 'Mochi ตามตัวชี้'],
];

export default function ReadingEffects({ children, contentKey }) {
  const content = useRef(null), stage = useRef(null), scope = useRef(null);
  const marked = useRef([]), position = useRef(0);
  const [pointer, setPointer] = useState('none');
  const [focus, setFocus] = useState(false);
  const [place, setPlace] = useState({ index: 0, total: 0 });
  const { reduced, preferences } = useMotionPreferences();
  const clearMarks = () => { marked.current.forEach(node => node.classList.remove('vm-reading-selected')); marked.current = []; };
  const collect = () => Array.from(content.current?.querySelectorAll('p, li, blockquote, pre, table') || [])
    .filter(node => node.getClientRects().length && node.textContent.trim().length > 15 && !node.parentElement?.closest('li, blockquote, pre, table'));
  const select = (index, scroll = false) => {
    clearMarks();
    const items = collect();
    position.current = Math.max(0, Math.min(index, items.length - 1));
    const selected = selectReadingItem(items, position.current);
    marked.current = items;
    setPlace({ index: selected ? position.current + 1 : 0, total: items.length });
    if (scroll) selected?.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
  };
  useEffect(() => {
    if (focus) select(0);
    else clearMarks();
    return clearMarks;
    // A new topic/search must never keep highlighting a removed paragraph.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, contentKey]);
  useEffect(() => {
    if (pointer === 'none' || preferences.mode === 'off') return undefined;
    const owner = createScope(stage.current, { quiet: reduced });
    scope.current = owner;
    const fx = createParticles(stage.current, { scope: owner, preset: pointer, kind: 'cursor', eventTarget: content.current, pointerBursts: false, idleTimeout: .7, maxDpr: 1.25, intensity: .4, assetBase: '/motion/assets' });
    return () => { fx.destroy(); owner.destroy(); scope.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointer, preferences.mode]);
  useEffect(() => { scope.current?.setQuiet(reduced); }, [reduced]);
  return <div className={`vmx-reading-effects${focus ? ' is-focused' : ''}`}>
    <div className="vmx-reading-tools" role="group" aria-label="ช่วยโฟกัสการอ่าน">
      <MotionButton className="vmx-btn vmx-btn-ghost vmx-btn-sm" aria-pressed={focus} onClick={() => setFocus(value => !value)}>โฟกัสทีละย่อหน้า</MotionButton>
      <label>ตัวชี้ขณะอ่าน <select aria-label="ตัวชี้ขณะอ่าน" value={pointer} onChange={event => setPointer(event.target.value)}>{POINTERS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      {focus && <div className="vmx-reading-focus-controls">
        <button type="button" aria-label="ย่อหน้าก่อนหน้า" className="vmx-btn vmx-btn-ghost vmx-btn-sm" disabled={place.index <= 1} onClick={() => select(position.current - 1, true)}>ก่อนหน้า</button>
        <span role="status">{place.total ? `${place.index} / ${place.total}` : 'เปิดเนื้อหาเพื่อเริ่มโฟกัส'}</span>
        <button type="button" aria-label="ย่อหน้าถัดไป" className="vmx-btn vmx-btn-ghost vmx-btn-sm" disabled={!place.total || place.index >= place.total} onClick={() => select(position.current + 1, true)}>ถัดไป</button>
      </div>}
      {pointer !== 'none' && <span className="vmx-reading-effect-hint">ตัวชี้ชั่วคราว ไม่บันทึกรอยลงในเนื้อหา{reduced ? ' · หยุดการเคลื่อนไหวตามการตั้งค่า' : ''}</span>}
    </div>
    <div className="vmx-reading-effect-anchor" aria-hidden="true"><div ref={stage} className="vmx-reading-effect-stage" data-reading-pointer={pointer} /></div>
    <div ref={content} data-reading-content="true">{children}</div>
  </div>;
}
