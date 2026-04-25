import { isCorrect } from '../hooks/utils.js';

export default function ResultsView({ score, questions, answers, goHome, setView, mode }) {
  const wrongCount = questions.filter((q) => answers[q.id] !== undefined && !isCorrect(q, answers[q.id])).length;
  const skipCount = questions.filter((q) => answers[q.id] === undefined).length;

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
        <h2 className={`vmx-score-big ${score.pct >= 60 ? 'pass' : 'fail'}`}>
          {score.pct}<span style={{ fontSize: '0.4em', fontWeight: 400 }}>%</span>
        </h2>
        <div className="vmx-score-label">Final Score</div>
        <div className="vmx-score-frac">{score.correct} / {score.total} ถูก</div>
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
      </div>

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← กลับหน้าแรก</button>
        <button className="vmx-btn vmx-btn-primary" onClick={() => setView('review')}>ดูเฉลย →</button>
      </div>
    </>
  );
}
