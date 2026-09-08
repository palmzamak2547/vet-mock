import { useEffect, useRef, useState } from 'react';
import { createScope } from '../lib/motion-kit/core.js';
import { createPlay } from '../lib/motion-kit/play.js';
import { fireConfetti } from '../lib/confetti.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { MotionButton, MotionEnter } from './MotionFeedback.jsx';
import '../styles-motion-kit.css';

export default function StudyBreak({ paused = false }) {
  const root = useRef(null), owner = useRef(null);
  const [variant, setVariant] = useState('breath');
  const [restart, setRestart] = useState(0);
  const [complete, setComplete] = useState(false);
  const { reduced } = useMotionPreferences();
  useEffect(() => {
    const host = root.current;
    const scope = createScope(host, { quiet: reduced, paused });
    owner.current = scope;
    let finished = false;
    const play = createPlay(host, { scope, variant, assetBase: '/motion/assets', onEvent(event) {
      if (!finished && (event.type === 'win' || (event.type === 'pop' && event.count === 12))) {
        finished = true;
        setComplete(true);
        fireConfetti({ count: 28, preset: 'hearts' });
      }
    } });
    return () => { play.destroy(); scope.destroy(); host.replaceChildren(); owner.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, restart]);
  useEffect(() => { owner.current?.setQuiet(reduced); }, [reduced]);
  useEffect(() => { owner.current?.setPaused(paused); }, [paused]);
  return <section className="vmx-study-break" aria-label="พักระหว่างเรียน">
    <div className="vmx-study-break-heading"><div><h2>พักสั้น ๆ แล้วค่อยไปต่อ</h2><p>หายใจ ผ่อนสายตา หรือเล่นสักรอบระหว่างพัก</p></div>
      <label>ช่วงพัก <select aria-label="กิจกรรมระหว่างพัก" value={variant} onChange={event => { setComplete(false); setVariant(event.target.value); }}>
        <option value="breath">หายใจตามจังหวะ</option><option value="memory">จับคู่ให้ครบ</option><option value="bubbles">จิ้มฟองพักสมอง</option><option value="fetch">โยนบอลให้ Mochi</option>
      </select></label>
    </div>
    <div ref={root} className="vm-host vmx-break-stage" data-break-activity={variant} />
    {complete && <MotionEnter effect="like" className="vmx-break-complete" role="status">ครบแล้ว! พักต่อหรือกลับไปเรียนเมื่อพร้อมได้เลย</MotionEnter>}
    <MotionButton className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setComplete(false); setRestart(value => value + 1); }}>เริ่มช่วงพักใหม่</MotionButton>
  </section>;
}
