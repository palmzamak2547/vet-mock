// Every button that starts a set goes through here: with a set still open, the student chooses
// between going back to it and replacing it. Nothing is thrown away without asking.

import { useState } from 'react';
import { Link } from './Link.jsx';
import { Sheet } from './Sheet.jsx';
import { useActiveSession } from '../lib/hooks.js';
import { sessionStore } from '../lib/session.js';

export function useStartGuard() {
  const active = useActiveSession();
  const [pending, setPending] = useState(null);
  const guard = (start) => {
    if (sessionStore.get()) setPending(() => start);
    else start();
  };
  const sheet = (
    <Sheet open={!!pending && !!active} onClose={() => setPending(null)} title="มีชุดที่ยังทำไม่เสร็จ">
      {active && (
        <>
          <p className="sheet-p">
            {active.mode === 'mock' ? 'สอบจำลอง' : 'ชุดฝึก'}ที่ค้างอยู่ทำถึงข้อ {active.cursor + 1} จาก {active.items.length} ถ้าเริ่มชุดใหม่ ชุดเดิมจะถูกทิ้ง
            {active.mode === 'mock' ? ' และคำตอบในชุดนั้นจะไม่ถูกนับ เพราะสอบจำลองนับคะแนนตอนส่ง' : ' ส่วนคำตอบที่ฝึกไปแล้วยังนับในความคืบหน้า'}
          </p>
          <div className="sheet-actions">
            <Link to="/session" className="btn btn-ghost" data-autofocus>ทำชุดเดิมต่อ</Link>
            <button type="button" className="btn btn-ink" onClick={() => { const start = pending; setPending(null); sessionStore.set(null); start(); }}>เริ่มชุดใหม่แทน</button>
          </div>
        </>
      )}
    </Sheet>
  );
  return { guard, sheet };
}
