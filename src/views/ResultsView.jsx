import { isCorrect, isWritingType } from '../hooks/utils.js';

export default function ResultsView({ score, questions, answers, goHome, setView, mode }) {
  // Split writing from auto-graded for the result counts so writing
  // questions don't show up as "wrong" — they need Self/AI grading.
  const autoQs = questions.filter((q) => !isWritingType(q));
  const writingQs = questions.filter((q) => isWritingType(q));
  const wrongCount = autoQs.filter((q) => answers[q.id] !== undefined && !isCorrect(q, answers[q.id])).length;
  const skipCount = autoQs.filter((q) => answers[q.id] === undefined).length;
  const writingAttempted = writingQs.filter((q) => {
    const ua = answers[q.id];
    return typeof ua === 'string' && ua.trim().length > 0;
  }).length;

  const msg = score.pct === 100 ? '"เทพสุดๆ เก่งมากก 🏆"'
    : score.pct >= 80 ? '"โค้ดดดด ใกล้จะผ่านแล้ว อ่านอีกนิดนึง"'
    : score.pct >= 60 ? '"ผ่านครับ แต่ต้องอ่านซ้ำส่วนที่ผิด"'
    : score.pct >= 40 ? '"สู้ๆ นะ เปิดข้อสอบเก่าอ่านอีกรอบกันเถอะ"'
    : '"ไม่เป็นไร เริ่มใหม่ได้เสมอ 💪"';

  const isExam = mode === 'exam';
  const passed = score.pct >= 60;

  return (
    <>
      {isExam && (
        <div style={{ textAlign: 'center', marginBottom: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.15em', color: 'var(--clr-ink-soft)' }}>
          {passed ? '✓ PASSED' : '✗ FAILED'} · EXAM MODE
        </div>
      )}

      <div className="vmx-results-hero">
        {autoQs.length > 0 ? (
          <>
            <h2 className={`vmx-score-big ${score.pct >= 60 ? 'pass' : 'fail'}`}>
              {score.pct}<span style={{ fontSize: '0.4em', fontWeight: 400 }}>%</span>
            </h2>
            <div className="vmx-score-label">Auto-graded Score</div>
            <div className="vmx-score-frac">{score.correct} / {autoQs.length} ถูก</div>
          </>
        ) : (
          <>
            <h2 className="vmx-score-big" style={{ color: 'var(--clr-gold)' }}>
              ✍️
            </h2>
            <div className="vmx-score-label">Writing Practice Done</div>
            <div className="vmx-score-frac">{writingAttempted} / {writingQs.length} ข้อเขียนเสร็จ</div>
          </>
        )}
        {writingQs.length > 0 && autoQs.length > 0 && (
          <div style={{ marginTop: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(184, 137, 64, 0.12)', border: '1px solid var(--clr-gold)', display: 'inline-block', fontSize: 12, color: 'var(--clr-ink)', fontFamily: 'JetBrains Mono, monospace' }}>
            ✍️ มีข้อเขียน {writingQs.length} ข้อ — ตรวจใน "ดูเฉลย" (Self / 🤖 AI)
          </div>
        )}
        <div className="vmx-score-msg">{msg}</div>
      </div>

      <div className="vmx-stat-grid">
        <div className="vmx-stat-card">
          <div className="vmx-stat-num" style={{ color: 'var(--clr-sage)' }}>{score.correct}</div>
          <div className="vmx-stat-lbl">Correct</div>
        </div>
        <div className="vmx-stat-card">
          <div className="vmx-stat-num" style={{ color: 'var(--clr-rose)' }}>{wrongCount}</div>
          <div className="vmx-stat-lbl">Wrong</div>
        </div>
        <div className="vmx-stat-card">
          <div className="vmx-stat-num" style={{ color: 'var(--clr-gold)' }}>{skipCount}</div>
          <div className="vmx-stat-lbl">Skipped</div>
        </div>
        {writingQs.length > 0 && (
          <div className="vmx-stat-card">
            <div className="vmx-stat-num" style={{ color: 'var(--clr-plum, #7d4a7d)' }}>{writingAttempted}/{writingQs.length}</div>
            <div className="vmx-stat-lbl">✍️ Writing</div>
          </div>
        )}
      </div>

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← กลับหน้าแรก</button>
        <button className="vmx-btn vmx-btn-primary" onClick={() => setView('review')}>ดูเฉลย →</button>
      </div>
    </>
  );
}
