import { useState, useMemo } from 'react';
import { QB, SUBJECTS } from '../data/questions.js';
import { updateCard, initCard, getDueCards, getCardStats } from '../hooks/sm2.js';
import { fmtDate, isCorrect } from '../hooks/utils.js';

export default function SRSessionView({ srCards, setSrCards, goHome, customQuestions = [] }) {
  const allQuestions = [...QB, ...customQuestions];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCards, setSessionCards] = useState(() => {
    // Build pool of cards (init missing)
    const pool = {};
    allQuestions.forEach((q) => {
      pool[q.id] = srCards[q.id] || initCard(q.id);
    });
    return getDueCards(pool, 20);
  });
  const [reviewedCount, setReviewedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const currentCard = sessionCards[currentIdx];
  const currentQ = currentCard ? allQuestions.find((q) => q.id === currentCard.questionId) : null;

  const stats = useMemo(() => getCardStats(srCards), [srCards]);

  const handleGrade = (quality) => {
    const updated = updateCard(currentCard, quality);
    setSrCards({ ...srCards, [currentCard.questionId]: updated });
    if (quality >= 2) setCorrectCount(correctCount + 1);
    setReviewedCount(reviewedCount + 1);
    setShowAnswer(false);

    if (currentIdx < sessionCards.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Session complete
      setCurrentIdx(sessionCards.length); // Move past last
    }
  };

  // Session completed
  if (!currentQ || currentIdx >= sessionCards.length) {
    return (
      <>
        <div className="vmx-hero"><h1>Session <em>Complete</em> 🎉</h1><p>ทบทวนเสร็จแล้ว กลับมาทบทวนพรุ่งนี้นะ</p></div>
        <div className="vmx-results-hero">
          <div className="vmx-score-big pass">{reviewedCount}</div>
          <div className="vmx-score-label">Cards Reviewed</div>
          <div className="vmx-score-frac">{correctCount} ได้, {reviewedCount - correctCount} ต้องทบทวน</div>
        </div>
        <div className="vmx-stat-grid">
          <div className="vmx-stat-card"><div className="vmx-stat-num">{stats.total}</div><div className="vmx-stat-lbl">Total Cards</div></div>
          <div className="vmx-stat-card"><div className="vmx-stat-num" style={{ color: 'var(--clr-sage)' }}>{stats.mastered}</div><div className="vmx-stat-lbl">Mastered</div></div>
          <div className="vmx-stat-card"><div className="vmx-stat-num" style={{ color: 'var(--clr-gold)' }}>{stats.dueTomorrow}</div><div className="vmx-stat-lbl">Due Tomorrow</div></div>
        </div>
        <div className="vmx-btn-row">
          <button className="vmx-btn vmx-btn-primary" onClick={goHome}>← กลับหน้าแรก</button>
        </div>
      </>
    );
  }

  // Show question as flashcard
  let answerText = '';
  if (currentQ.type === 'mcq') answerText = `${String.fromCharCode(65 + currentQ.answer)}. ${currentQ.options[currentQ.answer]}`;
  else if (currentQ.type === 'tf') answerText = currentQ.answer ? 'True' : 'False';
  else if (currentQ.type === 'fill') answerText = currentQ.blanks.join(' / ');
  else if (currentQ.type === 'match') answerText = currentQ.pairs.map((p) => `${p.left} → ${p.right}`).join('\n');

  return (
    <>
      <div className="vmx-exam-top">
        <div className="vmx-progress"><strong>{currentIdx + 1}</strong> / {sessionCards.length} · 🧠 SR</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
          next: {fmtDate(currentCard.nextReview)}
        </div>
      </div>
      <div className="vmx-progress-bar">
        <div className="vmx-progress-fill" style={{ width: `${((currentIdx + 1) / sessionCards.length) * 100}%` }}></div>
      </div>

      <div className="vmx-flashcard">
        <div className="front">
          <div className="vmx-qtype-badge">{SUBJECTS.find((s) => s.id === currentQ.subject)?.name || currentQ.subject}</div>
          {currentQ.image && <img src={currentQ.image} alt="" className="vmx-qimage" style={{ margin: '0 auto 16px' }} />}
          <div style={{ fontSize: 18 }}>{currentQ.q}</div>
        </div>
        {showAnswer && (
          <div className="back">
            <div className="answer">{answerText}</div>
            {currentQ.explain && <div style={{ fontSize: 14, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>{currentQ.explain}</div>}
          </div>
        )}
      </div>

      {!showAnswer ? (
        <div className="vmx-btn-row" style={{ justifyContent: 'center' }}>
          <button className="vmx-btn vmx-btn-primary" onClick={() => setShowAnswer(true)} style={{ minWidth: 240 }}>
            แสดงคำตอบ (Space)
          </button>
        </div>
      ) : (
        <div className="vmx-sr-grade">
          <button className="vmx-sr-btn again" onClick={() => handleGrade(0)}>
            <div className="label">Again</div>
            <div className="sub">&lt; 1 min</div>
          </button>
          <button className="vmx-sr-btn hard" onClick={() => handleGrade(1)}>
            <div className="label">Hard</div>
            <div className="sub">~1 day</div>
          </button>
          <button className="vmx-sr-btn good" onClick={() => handleGrade(2)}>
            <div className="label">Good</div>
            <div className="sub">{currentCard.interval || 1}-6 days</div>
          </button>
          <button className="vmx-sr-btn easy" onClick={() => handleGrade(3)}>
            <div className="label">Easy</div>
            <div className="sub">{Math.round((currentCard.interval || 1) * 2.5)} days</div>
          </button>
        </div>
      )}

      <div className="vmx-btn-row" style={{ marginTop: 16 }}>
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goHome}>← หยุดและออก</button>
      </div>
    </>
  );
}
