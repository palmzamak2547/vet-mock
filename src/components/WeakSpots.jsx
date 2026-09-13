// ============================================================
// WeakSpots — what the misses in one session had in common
// ============================================================
// The results screen already counts. A count tells a student how much they
// missed, never what went wrong: four misses spread across four topics and
// four misses that are all the same two organisms being swapped read
// identically as "4".
//
// So this looks for the pattern instead, and shows the questions each pattern
// was drawn from beside it. The citation is not decoration — it is the only
// way for the student to check the claim, and a pattern the server could not
// tie back to at least two of their own questions never reaches this screen.
// ============================================================

import { useState } from 'react';
import { reviewMisses, COACH_MESSAGE } from '../lib/study-coach.js';

const shortLabel = (q) => {
  const text = String(q?.q || '').replace(/\s+/g, ' ').trim();
  return text.length > 34 ? `${text.slice(0, 34)}…` : text || `ข้อ ${q?.id ?? ''}`;
};

export default function WeakSpots({ wrongQs, answers }) {
  const [state, setState] = useState({ status: 'idle' });

  // Two misses is the floor for a pattern — with one there is nothing to
  // compare it against, and the server refuses those anyway.
  const gradeable = (wrongQs || []).filter((q) => q.type === 'mcq' || q.type === 'tf');
  if (gradeable.length < 2) return null;

  const run = async () => {
    setState({ status: 'loading' });
    const res = await reviewMisses(gradeable.map((q) => ({ qid: String(q.id), chosen: answers[q.id] })));
    setState(res.ok
      ? { status: 'done', data: res.data }
      : { status: 'failed', message: COACH_MESSAGE[res.reason] || COACH_MESSAGE.error });
  };

  const byId = new Map(gradeable.map((q) => [String(q.id), q]));
  const data = state.data;
  const patterns = data?.patterns || [];

  return (
    <div className="vmx-weakspots">
      <div className="vmx-weakspots-head">
        <span className="vmx-kicker">ที่พลาดรอบนี้มีอะไรร่วมกัน</span>
        {state.status !== 'done' && (
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={run}
            disabled={state.status === 'loading'}
          >
            {state.status === 'loading' ? 'กำลังอ่าน…' : 'หาจุดร่วม'}
          </button>
        )}
      </div>

      {state.status === 'idle' && (
        <p className="vmx-coach-foot">
          เทียบ {gradeable.length} ข้อที่ผิดรอบนี้ดูว่าพลาดด้วยเหตุผลเดียวกันหรือเปล่า
        </p>
      )}
      {state.status === 'failed' && <p className="vmx-coach-foot">{state.message}</p>}

      {state.status === 'done' && (
        <>
          {patterns.length === 0 && (
            <p className="vmx-coach-foot">
              รอบนี้ข้อที่ผิดไม่ได้พลาดด้วยเหตุผลเดียวกัน แยกทบทวนเป็นข้อ ๆ ได้เลย
            </p>
          )}
          {patterns.map((p, i) => (
            <div key={i} className="vmx-weakspot">
              <p className="vmx-weakspot-text">{p.text}</p>
              <ul className="vmx-weakspot-refs">
                {p.questionIds.map((id) => (
                  <li key={id}>{shortLabel(byId.get(String(id)))}</li>
                ))}
              </ul>
            </div>
          ))}
          {data.focus && (
            <div className="vmx-weakspot-focus">
              <span className="vmx-kicker">ทำต่อ</span>
              <p>{data.focus}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
