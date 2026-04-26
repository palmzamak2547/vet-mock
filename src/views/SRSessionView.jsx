import { useState, useMemo } from 'react';
import { QB, SUBJECTS } from '../data/questions.js';
import { updateCard, initCard, getDueCards, getCardStats } from '../hooks/sm2.js';
import { isFlashcardCompatible } from '../hooks/sr-filter.js';
import { fmtDate } from '../hooks/utils.js';
import { useLocalStorage } from '../hooks/useStorage.js';
import { RichText, stripRichText } from '../lib/richtext.jsx';

// ============================================================
// SRSessionView — Spaced Repetition flashcard session
//
// Starts with a planning step: pick session size + subject filter
// so a backlog of 400+ cards isn't dumped on the user in one sitting.
// Selections persist via localStorage so the last preset comes back
// next time.
//
// Eligibility filter (isFlashcardCompatible) lives in hooks/sr-filter.js
// so the Home dashboard badge and this view always agree.
// ============================================================

const SIZE_PRESETS = [25, 50, 100, 200];

export default function SRSessionView({ srCards, setSrCards, goHome, customQuestions = [] }) {
  const allQuestions = useMemo(() => [...QB, ...customQuestions], [customQuestions]);

  // Persist last-used preferences
  const [sessionSize, setSessionSize] = useLocalStorage('vmx-sr-session-size', 25);
  const [subjectFilter, setSubjectFilter] = useLocalStorage('vmx-sr-subject-filter', 'all');

  const [sessionCards, setSessionCards] = useState(null);  // null = planning step
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Build filtered pool of due cards (most overdue first — getDueCards already sorts)
  // Also track how many questions were excluded for transparency.
  const { duePool, excludedCount, eligibleCount } = useMemo(() => {
    const inSubject = subjectFilter === 'all'
      ? allQuestions
      : allQuestions.filter((q) => q.subject === subjectFilter);
    const eligible = inSubject.filter(isFlashcardCompatible);
    const pool = {};
    eligible.forEach((q) => {
      pool[q.id] = srCards[q.id] || initCard(q.id);
    });
    return {
      duePool: getDueCards(pool),
      excludedCount: inSubject.length - eligible.length,
      eligibleCount: eligible.length,
    };
  }, [allQuestions, srCards, subjectFilter]);

  // Stats only for cards belonging to SR-eligible questions in the
  // current subject filter — keeps Total/Mastered consistent with what
  // the user can actually see in SR.
  const stats = useMemo(() => {
    const eligibleIds = new Set();
    const inSubject = subjectFilter === 'all'
      ? allQuestions
      : allQuestions.filter((q) => q.subject === subjectFilter);
    inSubject.filter(isFlashcardCompatible).forEach((q) => eligibleIds.add(q.id));
    const filtered = {};
    for (const id of eligibleIds) if (srCards[id]) filtered[id] = srCards[id];
    return getCardStats(filtered);
  }, [srCards, allQuestions, subjectFilter]);

  // Subjects that actually have at least one card in the bank
  const subjectsWithCards = useMemo(() => {
    const s = new Set();
    allQuestions.forEach((q) => s.add(q.subject));
    return SUBJECTS.filter((s2) => s2.id === 'all' || s.has(s2.id));
  }, [allQuestions]);

  const startSession = () => {
    const cap = sessionSize === 'all' ? duePool.length : Math.min(sessionSize, duePool.length);
    setSessionCards(duePool.slice(0, cap));
    setCurrentIdx(0);
    setShowAnswer(false);
    setReviewedCount(0);
    setCorrectCount(0);
  };

  // ─── Planning step (before session starts) ──────────────────────
  if (!sessionCards) {
    const dueCount = duePool.length;
    return (
      <>
        <div className="vmx-hero">
          <h1>🧠 Spaced <em>Repetition</em></h1>
          <p>เลือกขนาด session ที่ทำได้สบายๆ — ทำติดต่อกันทุกวันสำคัญกว่าทำเยอะๆ ครั้งเดียว</p>
        </div>

        <div className="vmx-config-panel">
          {/* Subject filter */}
          {subjectsWithCards.length > 2 && (
            <div className="vmx-config-row">
              <label className="vmx-label">วิชา</label>
              <div className="vmx-chip-row">
                {subjectsWithCards.map((s) => (
                  <button
                    key={s.id}
                    className={`vmx-chip ${subjectFilter === s.id ? 'active' : ''}`}
                    onClick={() => setSubjectFilter(s.id)}
                  >
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Session size */}
          <div className="vmx-config-row">
            <label className="vmx-label">จำนวนวันนี้</label>
            <div className="vmx-chip-row">
              {SIZE_PRESETS.map((n) => (
                <button
                  key={n}
                  className={`vmx-chip ${sessionSize === n ? 'active' : ''}`}
                  onClick={() => setSessionSize(n)}
                  disabled={n > dueCount && dueCount > 0}
                  title={n > dueCount ? `มี due แค่ ${dueCount}` : ''}
                >
                  {n} ใบ
                </button>
              ))}
              <button
                className={`vmx-chip ${sessionSize === 'all' ? 'active' : ''}`}
                onClick={() => setSessionSize('all')}
              >
                ทั้งหมด ({dueCount})
              </button>
            </div>
          </div>

          {/* Status */}
          <div style={{ marginTop: 8, padding: '14px 16px', borderRadius: 12, background: 'var(--clr-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Due ตอนนี้
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 32, lineHeight: 1, marginTop: 2, color: dueCount > 100 ? 'var(--clr-rose)' : 'var(--clr-ink)' }}>
                {dueCount}
                <span style={{ fontSize: 14, color: 'var(--clr-ink-soft)', marginLeft: 8 }}>ใบ</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                จะทำวันนี้
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 32, lineHeight: 1, marginTop: 2, color: 'var(--clr-sage)' }}>
                {sessionSize === 'all' ? dueCount : Math.min(sessionSize, dueCount)}
              </div>
            </div>
          </div>

          {dueCount > 100 && sessionSize !== 'all' && (
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(184, 137, 64, 0.10)', border: '1px solid var(--clr-gold)', fontSize: 12, lineHeight: 1.6 }}>
              💡 <strong>มี due {dueCount} ใบ — เยอะหน่อย</strong>
              <br />
              <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)' }}>
                Algorithm จะหยิบ "ใบที่ค้างนานสุด" มาก่อน · ทำ {sessionSize} วันนี้ + ทำต่อพรุ่งนี้ดีกว่ายัดทีเดียว · ทำต่อเนื่องสำคัญสุด
              </span>
            </div>
          )}

          {excludedCount > 0 && (
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic', lineHeight: 1.5 }}>
              💡 SR pool ตอนนี้มี <strong>{eligibleCount}</strong> ข้อ · ตัด <strong>{excludedCount}</strong> ข้อออกเพราะตอบไม่ได้แบบ flashcard (ข้อ "ข้อใดถูก..." + ข้อจับคู่ ที่ต้องเห็น choice/lefts ก่อน)
            </div>
          )}

          {/* Mini stats */}
          <div className="vmx-stat-grid" style={{ marginTop: 16 }}>
            <div className="vmx-stat-card">
              <div className="vmx-stat-num">{stats.total}</div>
              <div className="vmx-stat-lbl">Total cards</div>
            </div>
            <div className="vmx-stat-card">
              <div className="vmx-stat-num" style={{ color: 'var(--clr-sage)' }}>{stats.mastered}</div>
              <div className="vmx-stat-lbl">Mastered</div>
            </div>
            <div className="vmx-stat-card">
              <div className="vmx-stat-num" style={{ color: 'var(--clr-gold)' }}>{stats.dueTomorrow}</div>
              <div className="vmx-stat-lbl">Due tomorrow</div>
            </div>
          </div>
        </div>

        <div className="vmx-btn-row">
          <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← ย้อนกลับ</button>
          <button
            className="vmx-btn vmx-btn-primary"
            onClick={startSession}
            disabled={dueCount === 0}
          >
            {dueCount === 0 ? '🎉 ไม่มีใบที่ต้องทบทวน' : '🚀 เริ่ม Session →'}
          </button>
        </div>
      </>
    );
  }

  // ─── Active session ─────────────────────────────────────────────
  const currentCard = sessionCards[currentIdx];
  const currentQ = currentCard ? allQuestions.find((q) => q.id === currentCard.questionId) : null;

  const handleGrade = (quality) => {
    const updated = updateCard(currentCard, quality);
    setSrCards({ ...srCards, [currentCard.questionId]: updated });
    if (quality >= 2) setCorrectCount(correctCount + 1);
    setReviewedCount(reviewedCount + 1);
    setShowAnswer(false);
    if (currentIdx < sessionCards.length - 1) setCurrentIdx(currentIdx + 1);
    else setCurrentIdx(sessionCards.length);
  };

  // Session complete
  if (!currentQ || currentIdx >= sessionCards.length) {
    const remaining = duePool.length - reviewedCount;
    return (
      <>
        <div className="vmx-hero">
          <h1>Session <em>Complete</em> 🎉</h1>
          <p>ทบทวนเสร็จแล้ว · กลับมาทบทวนพรุ่งนี้นะ</p>
        </div>
        <div className="vmx-results-hero">
          <div className="vmx-score-big pass">{reviewedCount}</div>
          <div className="vmx-score-label">Cards Reviewed</div>
          <div className="vmx-score-frac">{correctCount} ได้ · {reviewedCount - correctCount} ต้องทบทวน</div>
        </div>
        <div className="vmx-stat-grid">
          <div className="vmx-stat-card"><div className="vmx-stat-num">{stats.total}</div><div className="vmx-stat-lbl">Total Cards</div></div>
          <div className="vmx-stat-card"><div className="vmx-stat-num" style={{ color: 'var(--clr-sage)' }}>{stats.mastered}</div><div className="vmx-stat-lbl">Mastered</div></div>
          <div className="vmx-stat-card"><div className="vmx-stat-num" style={{ color: 'var(--clr-gold)' }}>{remaining > 0 ? remaining : stats.dueTomorrow}</div><div className="vmx-stat-lbl">{remaining > 0 ? 'ค้างอีก' : 'Due tomorrow'}</div></div>
        </div>
        <div className="vmx-btn-row">
          {remaining > 0 && (
            <button className="vmx-btn vmx-btn-primary" onClick={() => { setSessionCards(null); }}>
              ทำต่ออีก session →
            </button>
          )}
          <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← กลับหน้าแรก</button>
        </div>
      </>
    );
  }

  // Show question as flashcard
  // (Match type is excluded by isFlashcardCompatible — branch kept for safety)
  let answerText = '';
  let answerNode = null;
  if (currentQ.type === 'mcq') {
    const opt = currentQ.options?.[currentQ.answer];
    answerText = opt
      ? `${String.fromCharCode(65 + currentQ.answer)}. ${stripRichText(opt)}`
      : '⚠️ คำตอบของข้อนี้ผิดรูปแบบ — แจ้งให้ทีมแก้';
  } else if (currentQ.type === 'tf') {
    // Visual T/F reveal — green ✓ for true, red ✗ for false
    answerNode = (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 16px', borderRadius: 999,
        background: currentQ.answer ? 'var(--clr-sage-soft)' : 'var(--clr-rose-soft)',
        color: currentQ.answer ? 'var(--clr-sage)' : 'var(--clr-rose)',
        fontWeight: 700,
        fontSize: 18,
      }}>
        {currentQ.answer ? '✓ TRUE' : '✗ FALSE'}
      </span>
    );
    answerText = currentQ.answer ? 'True' : 'False';
  } else if (currentQ.type === 'fill') {
    answerText = currentQ.blanks.length > 1
      ? currentQ.blanks.map((b, i) => `(${i + 1}) ${stripRichText(b)}`).join('  ·  ')
      : stripRichText(currentQ.blanks[0] || '');
  } else if (currentQ.type === 'match') {
    answerText = currentQ.pairs.map((p) => `${stripRichText(p.left)} → ${stripRichText(p.right)}`).join('\n');
  }

  // Friendly Thai label for the question type — shows up in the SR badge
  const typeLabel = {
    mcq: 'MCQ',
    tf: 'True/False',
    fill: 'เติมคำ',
    match: 'จับคู่',
  }[currentQ.type] || currentQ.type;

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
          <div className="vmx-qtype-badge">
            {SUBJECTS.find((s) => s.id === currentQ.subject)?.name || currentQ.subject}
            {' · '}{typeLabel}
          </div>
          {currentQ.image && <img src={currentQ.image} alt="" className="vmx-qimage" style={{ margin: '0 auto 16px' }} />}
          <div style={{ fontSize: 18 }}><RichText text={currentQ.q} /></div>
        </div>
        {showAnswer && (
          <div className="back">
            <div className="answer">
              {answerNode || answerText}
            </div>
            {currentQ.explain && <div style={{ fontSize: 14, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}><RichText text={currentQ.explain} /></div>}
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
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setSessionCards(null)}>← เปลี่ยนการตั้งค่า</button>
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goHome}>หยุดและออก</button>
      </div>
    </>
  );
}
