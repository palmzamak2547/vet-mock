// ============================================================
// RecallQuiz — closing the summary and finding out what stuck
// ============================================================
// Reading a summary feels like learning and mostly is not; being asked one
// question about it, before looking, is the cheapest test of that there is.
// So this sits at the bottom of a summary the student has just read through.
//
// The answer to every question is a passage COPIED OUT of that same summary,
// and the server discards any item whose quote it cannot find there again.
// That is what makes it safe to put in front of a student: the questions are
// generated, but the answers are not — they are the lecture's own words, and
// they are shown as a quote so it is clear which is which.
// ============================================================

import { useState } from 'react';
import { recallFromLecture, COACH_MESSAGE } from '../lib/study-coach.js';

export default function RecallQuiz({ videoId }) {
  const [state, setState] = useState({ status: 'idle' });
  const [shown, setShown] = useState(() => new Set());

  if (!videoId) return null;

  const run = async () => {
    setState({ status: 'loading' });
    const res = await recallFromLecture(videoId);
    setState(res.ok
      ? { status: 'done', items: res.data.items }
      : { status: 'failed', message: COACH_MESSAGE[res.reason] || COACH_MESSAGE.error });
  };

  const reveal = (i) => setShown((prev) => new Set(prev).add(i));

  return (
    <div className="vmx-recall">
      <div className="vmx-recall-head">
        <span className="vmx-kicker">อ่านจบแล้วลองตอบดู</span>
        {state.status !== 'done' && (
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={run}
            disabled={state.status === 'loading'}
          >
            {state.status === 'loading' ? 'กำลังตั้งคำถาม…' : 'ถามกลับจากสรุปนี้'}
          </button>
        )}
      </div>

      {state.status === 'failed' && <p className="vmx-coach-foot">{state.message}</p>}

      {state.status === 'done' && (
        <ol className="vmx-recall-list">
          {state.items.map((item, i) => (
            <li key={i} className="vmx-recall-item">
              <p className="vmx-recall-q">{item.q}</p>
              {shown.has(i) ? (
                <blockquote className="vmx-recall-a">
                  <span className="vmx-kicker">จากสรุป</span>
                  {item.quote}
                </blockquote>
              ) : (
                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => reveal(i)}>
                  ดูเฉลย
                </button>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
