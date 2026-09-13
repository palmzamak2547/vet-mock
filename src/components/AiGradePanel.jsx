// ============================================================
// AiGradePanel — the fourth panel of SmartGrader
// ============================================================
// Everything behind this was already built and deployed: the endpoint, the
// provider chain, the client helper. Nothing called it, so the code never
// reached a browser. This is the button.
//
// It sits BESIDE the self-grading panels rather than replacing them. The
// rubric checklist and the confidence calibration are the part that makes a
// student think about their own answer; a score handed to them is not a
// substitute for that. This is a second opinion, asked for deliberately.
//
// It never grades on its own: the request costs money per press and the
// answer is only useful once the student has actually finished writing.
// ============================================================

import { useState } from 'react';
import { gradeWithAI } from '../lib/ai-grade.js';

export default function AiGradePanel({ q, userAnswer }) {
  const [state, setState] = useState({ status: 'idle' });
  const answer = typeof userAnswer === 'string' ? userAnswer.trim() : '';

  // Nothing to grade, and nothing to grade it against.
  if (!answer || !q?.model_answer) return null;

  const run = async () => {
    setState({ status: 'loading' });
    // Only the id and what the student wrote. The server holds the key.
    const res = await gradeWithAI({ qid: q.id, userAnswer: answer });
    setState(res.ok ? { status: 'done', g: res.grading } : { status: 'error', error: res.error, hint: res.hint });
  };

  const g = state.g;
  const scores = g?.scores && typeof g.scores === 'object' ? Object.entries(g.scores) : [];

  return (
    <div className="vmx-aigrade">
      <div className="vmx-aigrade-head">
        <span className="vmx-kicker">ให้ช่วยตรวจคำตอบ</span>
        <button
          type="button"
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={run}
          disabled={state.status === 'loading'}
        >
          {state.status === 'loading' ? 'กำลังตรวจ…'
            : state.status === 'done' ? 'ตรวจอีกครั้ง'
            : 'ตรวจคำตอบนี้'}
        </button>
      </div>

      {state.status === 'idle' && (
        <p className="vmx-aigrade-note">
          ลองให้คะแนนตัวเองตามเกณฑ์ข้างบนก่อน แล้วค่อยกดเทียบ จะเห็นว่าเราประเมินตัวเองตรงแค่ไหน
        </p>
      )}

      {/* A failure here is not the student's problem and must not read like
          one: the self-grading above still works, and that is what we say. */}
      {state.status === 'error' && (
        <p className="vmx-aigrade-note vmx-aigrade-error">
          {state.error}
          {state.hint ? ` (${state.hint})` : ''}
          {' '}ระหว่างนี้ใช้เกณฑ์ให้คะแนนด้านบนประเมินเองได้ตามปกติ
        </p>
      )}

      {state.status === 'done' && g && (
        <div className="vmx-aigrade-result">
          {scores.length > 0 && (
            <ul className="vmx-aigrade-scores">
              {scores.map(([name, s]) => (
                <li key={name}>
                  <span className="vmx-aigrade-cat">{name}</span>
                  <span className="vmx-aigrade-pts">{s?.earned ?? '?'} / {s?.total ?? '?'}</span>
                  {s?.justification && <span className="vmx-aigrade-why">{s.justification}</span>}
                </li>
              ))}
            </ul>
          )}
          {g.overallFeedback && <p className="vmx-aigrade-overall">{g.overallFeedback}</p>}
          {Array.isArray(g.strengthsSpotted) && g.strengthsSpotted.length > 0 && (
            <div className="vmx-aigrade-list vmx-aigrade-good">
              <span className="vmx-kicker">ที่เขียนได้ดีแล้ว</span>
              <ul>{g.strengthsSpotted.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
          )}
          {Array.isArray(g.improvements) && g.improvements.length > 0 && (
            <div className="vmx-aigrade-list vmx-aigrade-gap">
              <span className="vmx-kicker">ที่ยังขาด</span>
              <ul>{g.improvements.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
          )}
          <p className="vmx-aigrade-note">
            คะแนนนี้เป็นตัวช่วยเทียบ ไม่ใช่คะแนนจริงของรายวิชา เกณฑ์ของอาจารย์เป็นตัวตัดสิน
          </p>
        </div>
      )}
    </div>
  );
}
