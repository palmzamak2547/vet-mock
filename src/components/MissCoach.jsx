// ============================================================
// MissCoach — the second half of a wrong answer
// ============================================================
// The bank's own explanation says what the right answer is. It often says
// nothing about the option the student actually reached for, and that is the
// part worth understanding: a distractor chosen by someone who studied is
// usually a real fact filed under the wrong heading.
//
// So this asks about THAT option, and only after a press — the first thing to
// do with a wrong answer is look at it yourself.
//
// It never states which option is correct. The app already marks that from
// the bank, so no generated sentence is ever in a position to contradict it.
// ============================================================

import { useState } from 'react';
import { explainMiss, alreadyExplained } from '../lib/study-coach.js';
import { RichText } from '../lib/richtext.jsx';

// The reasons study-coach.js gives when the service itself did not answer.
const OUTAGE = new Set(['off', 'error', 'timeout']);
export const OUTAGE_LINE = 'ตอนนี้ยังอธิบายเพิ่มไม่ได้ ลองใหม่ภายหลัง';

export default function MissCoach({ q, chosen }) {
  const [state, setState] = useState({ status: 'idle' });

  // Multiple choice only. On a True/False the bank's explanation IS the
  // account of the other side, so there is nothing left for this to add.
  if (!q || q.type !== 'mcq' || !Array.isArray(q.options)) return null;
  if (!Number.isInteger(chosen) || chosen === q.answer) return null;
  if (alreadyExplained(q.explain, q.options[chosen])) return null;

  const run = async () => {
    setState({ status: 'loading' });
    const res = await explainMiss({ qid: q.id, chosen });
    setState(res.ok ? { status: 'done', data: res.data } : { status: OUTAGE.has(res.reason) ? 'down' : 'quiet' });
  };

  // "Nothing to add" (the guards declined, a quota) removes the button and
  // nothing else: the explanation above it is the part that matters. An outage
  // says so in one plain line instead, so a dead service is not mistaken for
  // a question with nothing more to say. Never red: it is not the student's fault.
  if (state.status === 'quiet') return null;
  if (state.status === 'down') return <p className="vmx-coach-foot" role="status">{OUTAGE_LINE}</p>;

  if (state.status !== 'done') {
    return (
      <div className="vmx-coach-ask">
        <button
          type="button"
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={run}
          disabled={state.status === 'loading'}
        >
          {state.status === 'loading' ? 'กำลังเทียบให้…' : 'ทำไมข้อที่เลือกถึงไม่ใช่'}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="vmx-coach-line">
        <span className="vmx-coach-k">ข้อที่เลือก</span>
        <RichText text={state.data.trap} />
      </div>
      <div className="vmx-coach-line">
        <span className="vmx-coach-k">จุดที่ตัดออก</span>
        <RichText text={state.data.tell} />
      </div>
      <p className="vmx-coach-foot">เรียบเรียงจากตัวเลือกและคำอธิบายของข้อนี้</p>
    </>
  );
}
