import { useState, useMemo } from 'react';
import { QB, SUBJECTS } from '../data/questions.js';
import { updateCard, initCard, getDueCards, getCardStats, previewInterval } from '../hooks/sm2.js';
import { isFlashcardCompatible } from '../hooks/sr-filter.js';
import { fmtDate } from '../hooks/utils.js';
import { safeImageUrl } from '../lib/safe-url.js';
import { useLocalStorage } from '../hooks/useStorage.js';
import { RichText, stripRichText } from '../lib/richtext.jsx';
import ZoomableImage from '../components/ZoomableImage.jsx';
import { loadUserFlashcards } from '../lib/user-flashcards.js';
// Wave-4 card types — each lib produces Q-shaped objects with a
// distinct `type` so the renderer below can dispatch to the right
// React component. Storage + ID ranges are owned by the libs (cloze
// piggybacks on user-flashcards; image-occlusion has its own deck
// store). Both surface as flashcard-compatible (sr-filter.js passes
// any non-mcq/match/short/essay/fill type by default).
import { loadOcclusionCards } from '../lib/image-occlusion.js';
import ImageOcclusionCard from '../components/ImageOcclusionCard.jsx';
import ClozeCard from '../components/ClozeCard.jsx';
import { isQuestionDeliverable } from '../data/question-delivery.generated.js';

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

export default function SRSessionView({ srCards, setSrCards, goHome, customQuestions = [], selectedYear = 4, selectedPhase, qbReady = true }) {
  // Merge in user-authored flashcards (from "Highlight → Flashcard"
  // in SummaryModal). They live in localStorage and don't trigger
  // React updates by themselves — we read on mount and let the
  // session refresh on the next planning step.
  const allQuestions = useMemo(
    () => [
      ...QB.filter(isQuestionDeliverable),
      ...customQuestions,
      ...loadUserFlashcards(),       // 'flashcard' + 'cloze' (mixed)
      ...loadOcclusionCards(),       // 'image-occlusion' (one per mask)
    ],
    // qbReady matters: QB is lazy-loaded and mutated IN PLACE, so without it
    // this memo keeps the empty snapshot for the whole mount and the view
    // reports "ไม่มีใบที่ต้องทบทวน" for a user who does have cards due.
    [customQuestions, qbReady],
  );

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
  //
  // Split "true due" (already reviewed, time to see again) from "new"
  // (never reviewed). Both go into the session pool — SR sessions need
  // new cards to grow the deck — but the planning UI labels them
  // separately so a fresh user doesn't see misleading "Due 1842 ใบ"
  // when in reality every card is unseen. Mirrors the cardStats fix in
  // sm2.js + HomeView SR mode-card (2026-05-16).
  // Year-scope toggle: ON by default — surface only cards from the
  // year the user is currently studying so Y5 surprises don't leak
  // into a Y4 review session. User can toggle OFF when they want
  // cross-year ("ทุกปี").
  const [yearScope, setYearScope] = useLocalStorage('vmx-sr-year-scope', 'current');

  const { duePool, dueReviewedCount, newCount, excludedCount, eligibleCount } = useMemo(() => {
    let inSubject = subjectFilter === 'all'
      ? allQuestions
      : allQuestions.filter((q) => q.subject === subjectFilter);
    // Year-scope: when 'current', restrict cross-subject pool to selectedYear.
    // User-authored flashcards / cloze / image-occlusion typically lack q.year —
    // we keep those (year-agnostic content). Only filter Qs that explicitly
    // carry a year field that doesn't match.
    if (yearScope === 'current' && subjectFilter === 'all') {
      inSubject = inSubject.filter((q) => q.year == null || q.year === selectedYear);
    }
    const eligible = inSubject.filter(isFlashcardCompatible);
    const pool = {};
    // Attach `subject` to each card runtime so the currentQ lookup below
    // can disambiguate dupe IDs across subjects. localStorage shape stays
    // bare-id keyed (no migration); the runtime annotation is enough to
    // pick the right Q for display.
    eligible.forEach((q) => {
      const card = srCards[q.id] || initCard(q.id);
      pool[q.id] = { ...card, subject: q.subject };
    });
    const due = getDueCards(pool);
    return {
      duePool: due,
      dueReviewedCount: due.filter((c) => c.totalReviews > 0).length,
      newCount: due.filter((c) => c.totalReviews === 0).length,
      excludedCount: inSubject.length - eligible.length,
      eligibleCount: eligible.length,
    };
  }, [allQuestions, srCards, subjectFilter, yearScope, selectedYear]);

  // Stats only for cards belonging to SR-eligible questions in the
  // current subject filter — keeps Total/Mastered consistent with what
  // the user can actually see in SR.
  const stats = useMemo(() => {
    const eligibleIds = new Set();
    let inSubject = subjectFilter === 'all'
      ? allQuestions
      : allQuestions.filter((q) => q.subject === subjectFilter);
    if (yearScope === 'current' && subjectFilter === 'all') {
      inSubject = inSubject.filter((q) => q.year == null || q.year === selectedYear);
    }
    inSubject.filter(isFlashcardCompatible).forEach((q) => eligibleIds.add(q.id));
    const filtered = {};
    for (const id of eligibleIds) if (srCards[id]) filtered[id] = srCards[id];
    return getCardStats(filtered);
  }, [srCards, allQuestions, subjectFilter, yearScope, selectedYear]);

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
          <h1>Spaced <em>Repetition</em></h1>
          <p>เลือกขนาด session ที่ทำได้สบายๆ — ทำติดต่อกันทุกวันสำคัญกว่าทำเยอะๆ ครั้งเดียว</p>
        </div>

        <div className="vmx-config-panel">
          {/* Year scope toggle — default to current year so cross-year
              cards don't leak into focused review sessions */}
          {subjectFilter === 'all' && (
            <div className="vmx-config-row" role="group" aria-labelledby="vmx-srs-year-label">
              <div id="vmx-srs-year-label" className="vmx-label">ขอบเขตปี</div>
              <div className="vmx-chip-row">
                <button
                  className={`vmx-chip ${yearScope === 'current' ? 'active' : ''}`}
                  aria-pressed={yearScope === 'current'}
                  onClick={() => setYearScope('current')}
                >
                  ปี {selectedYear} เท่านั้น
                </button>
                <button
                  className={`vmx-chip ${yearScope === 'all' ? 'active' : ''}`}
                  aria-pressed={yearScope === 'all'}
                  onClick={() => setYearScope('all')}
                >
                  🌐 ทุกปี
                </button>
              </div>
            </div>
          )}

          {/* Subject filter */}
          {subjectsWithCards.length > 2 && (
            <div className="vmx-config-row" role="group" aria-labelledby="vmx-srs-subject-label">
              <div id="vmx-srs-subject-label" className="vmx-label">วิชา</div>
              <div className="vmx-chip-row">
                {subjectsWithCards.map((s) => (
                  <button
                    key={s.id}
                    className={`vmx-chip ${subjectFilter === s.id ? 'active' : ''}`}
                    aria-pressed={subjectFilter === s.id}
                    onClick={() => setSubjectFilter(s.id)}
                  >
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Session size */}
          <div className="vmx-config-row" role="group" aria-labelledby="vmx-srs-size-label">
            <div id="vmx-srs-size-label" className="vmx-label">จำนวนวันนี้</div>
            <div className="vmx-chip-row">
              {SIZE_PRESETS.map((n) => (
                <button
                  key={n}
                  className={`vmx-chip ${sessionSize === n ? 'active' : ''}`}
                  aria-pressed={sessionSize === n}
                  onClick={() => setSessionSize(n)}
                  disabled={n > dueCount && dueCount > 0}
                  title={n > dueCount ? `มี due แค่ ${dueCount}` : ''}
                >
                  {n} ใบ
                </button>
              ))}
              <button
                className={`vmx-chip ${sessionSize === 'all' ? 'active' : ''}`}
                aria-pressed={sessionSize === 'all'}
                onClick={() => setSessionSize('all')}
              >
                ทั้งหมด ({dueCount})
              </button>
            </div>
          </div>

          {/* Status — separate "Due" (reviewed before, time to revisit)
              from "New" (unseen). Fresh user sees Due 0 + New 1842
              instead of misleading "Due 1842". Both feed the session. */}
          <div style={{ marginTop: 8, padding: '14px 16px', borderRadius: 12, background: 'var(--clr-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 18 }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Due ทบทวน
                </div>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 32, lineHeight: 1, marginTop: 2, color: dueReviewedCount > 100 ? 'var(--clr-rose-text)' : 'var(--clr-ink)' }}>
                  {dueReviewedCount}
                  <span style={{ fontSize: 14, color: 'var(--clr-ink-soft)', marginLeft: 6 }}>ใบ</span>
                </div>
              </div>
              {newCount > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    ใหม่
                  </div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 32, lineHeight: 1, marginTop: 2, color: 'var(--clr-gold-text)' }}>
                    {newCount}
                    <span style={{ fontSize: 14, color: 'var(--clr-ink-soft)', marginLeft: 6 }}>ใบ</span>
                  </div>
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                จะทำวันนี้
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 32, lineHeight: 1, marginTop: 2, color: 'var(--clr-sage)' }}>
                {sessionSize === 'all' ? dueCount : Math.min(sessionSize, dueCount)}
              </div>
            </div>
          </div>

          {dueReviewedCount > 100 && sessionSize !== 'all' && (
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(184, 137, 64, 0.10)', border: '1px solid var(--clr-gold)', fontSize: 12, lineHeight: 1.6 }}>
              💡 <strong>มีใบค้างทบทวน {dueReviewedCount} ใบ — เยอะหน่อย</strong>
              <br />
              <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)' }}>
                Algorithm จะหยิบ "ใบที่ค้างนานสุด" มาก่อน, ทำ {sessionSize} วันนี้ + ทำต่อพรุ่งนี้ดีกว่ายัดทีเดียว, ทำต่อเนื่องสำคัญสุด
              </span>
            </div>
          )}
          {stats.total === 0 && newCount > 0 && (
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(74, 107, 74, 0.10)', border: '1px solid var(--clr-sage)', fontSize: 12, lineHeight: 1.6 }}>
              🌱 <strong>เริ่มจาก 0 — มี {newCount} ใบใหม่รอเปิด</strong>
              <br />
              <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)' }}>
                ทำ {Math.min(sessionSize === 'all' ? 25 : sessionSize, 25)} ใบวันนี้ก่อน, พรุ่งนี้ค่อยกลับมา review ใบเดิม + เปิดใบใหม่อีก, ติดต่อกันทุกวันสำคัญสุด
              </span>
            </div>
          )}

          {excludedCount > 0 && (
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic', lineHeight: 1.5 }}>
              SR pool ตอนนี้มี <strong>{eligibleCount}</strong> ข้อ, ตัด <strong>{excludedCount}</strong> ข้อออกเพราะตอบไม่ได้แบบ flashcard (ข้อ "ข้อใดถูก..." + ข้อจับคู่ ที่ต้องเห็น choice/lefts ก่อน)
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
              <div className="vmx-stat-num" style={{ color: 'var(--clr-gold-text)' }}>{stats.dueTomorrow}</div>
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
            {dueCount === 0 ? '🎉 ไม่มีใบที่ต้องทบทวน' : 'เริ่ม Session →'}
          </button>
        </div>
      </>
    );
  }

  // ─── Active session ─────────────────────────────────────────────
  const currentCard = sessionCards[currentIdx];
  // Use compound (subject:id) match when available — pool building
  // attaches q.subject to each card. Falls back to id-only match for
  // legacy cards that pre-date the subject annotation.
  const currentQ = currentCard
    ? allQuestions.find((q) =>
        q.id === currentCard.questionId
        && (!currentCard.subject || q.subject === currentCard.subject)
      ) || allQuestions.find((q) => q.id === currentCard.questionId)
    : null;

  // Pressing Again is the one moment the app has proof of a gap. Hiding the
  // card for 24 hours at exactly that moment is backwards — every other SRS
  // shows it again before the session ends. The long-term schedule is still
  // written by updateCard, so this only changes what happens in the next few
  // minutes; the card is re-queued at most RELEARN_CAP times so a student who
  // keeps pressing Again can always finish.
  const RELEARN_CAP = 2;

  const handleGrade = (quality) => {
    const updated = updateCard(currentCard, quality);
    setSrCards({ ...srCards, [currentCard.questionId]: updated });
    if (quality >= 2) setCorrectCount(correctCount + 1);
    setReviewedCount(reviewedCount + 1);
    setShowAnswer(false);

    const relearned = (currentCard._relearn || 0);
    if (quality === 0 && relearned < RELEARN_CAP) {
      setSessionCards([...sessionCards, { ...currentCard, _relearn: relearned + 1 }]);
    }

    if (currentIdx < sessionCards.length - 1) setCurrentIdx(currentIdx + 1);
    else setCurrentIdx(sessionCards.length);
  };

  const relearnLeft = RELEARN_CAP - (currentCard?._relearn || 0);

  // Session complete
  if (!currentQ || currentIdx >= sessionCards.length) {
    const remaining = duePool.length - reviewedCount;
    return (
      <>
        <div className="vmx-hero">
          <h1>Session <em>Complete</em> 🎉</h1>
          <p>ทบทวนเสร็จแล้ว, กลับมาทบทวนพรุ่งนี้นะ</p>
        </div>
        <div className="vmx-results-hero">
          <div className="vmx-score-big pass">{reviewedCount}</div>
          <div className="vmx-score-label">Cards Reviewed</div>
          <div className="vmx-score-frac">{correctCount} ได้, {reviewedCount - correctCount} ต้องทบทวน</div>
        </div>
        <div className="vmx-stat-grid">
          <div className="vmx-stat-card"><div className="vmx-stat-num">{stats.total}</div><div className="vmx-stat-lbl">Total Cards</div></div>
          <div className="vmx-stat-card"><div className="vmx-stat-num" style={{ color: 'var(--clr-sage)' }}>{stats.mastered}</div><div className="vmx-stat-lbl">Mastered</div></div>
          <div className="vmx-stat-card"><div className="vmx-stat-num" style={{ color: 'var(--clr-gold-text)' }}>{remaining > 0 ? remaining : stats.dueTomorrow}</div><div className="vmx-stat-lbl">{remaining > 0 ? 'ค้างอีก' : 'Due tomorrow'}</div></div>
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
      : 'คำตอบของข้อนี้ผิดรูปแบบ — แจ้งให้ทีมแก้';
  } else if (currentQ.type === 'tf') {
    // Visual T/F reveal — green ✓ for true, red ✗ for false
    answerNode = (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 16px', borderRadius: 999,
        background: currentQ.answer ? 'var(--clr-sage-soft)' : 'var(--clr-rose-soft)',
        color: currentQ.answer ? 'var(--clr-sage)' : 'var(--clr-rose-text)',
        fontWeight: 700,
        fontSize: 18,
      }}>
        {currentQ.answer ? '✓ TRUE' : '✗ FALSE'}
      </span>
    );
    answerText = currentQ.answer ? 'True' : 'False';
  } else if (currentQ.type === 'fill') {
    answerText = currentQ.blanks.length > 1
      ? currentQ.blanks.map((b, i) => `(${i + 1}) ${stripRichText(b)}`).join(' ,  ')
      : stripRichText(currentQ.blanks[0] || '');
  } else if (currentQ.type === 'match') {
    answerText = currentQ.pairs.map((p) => `${stripRichText(p.left)} → ${stripRichText(p.right)}`).join('\n');
  } else if (currentQ.type === 'flashcard') {
    // User-authored card from "Highlight → Flashcard" — back side
    // is plain text the user typed; fall back to `answer` for any
    // legacy/imported shape that uses the generic field name.
    answerText = stripRichText(currentQ.back || currentQ.answer || '');
  }

  // Friendly Thai label for the question type — shows up in the SR badge
  const typeLabel = {
    mcq: 'MCQ',
    tf: 'True/False',
    fill: 'เติมคำ',
    match: 'จับคู่',
    flashcard: '⚡ Flashcard',
    cloze: 'Cloze',
    'image-occlusion': 'Image Occlusion',
  }[currentQ.type] || currentQ.type;

  // Wave-4 dispatch: Image Occlusion + Cloze cards have rich
  // front/back renderings that don't fit the linear "stem + answer
  // text" layout below. Hand them off to their own components which
  // own the grading buttons too. The main SR shell still owns
  // progress/next-review/type badge above; the component returns
  // null when not its turn so React can re-mount cleanly.
  if (currentQ.type === 'image-occlusion') {
    return (
      <>
        <div className="vmx-exam-top">
          <div className="vmx-progress"><strong>{currentIdx + 1}</strong> / {sessionCards.length}, SR</div>
          <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
            next: {fmtDate(currentCard.nextReview)}
          </div>
        </div>
        <div className="vmx-progress-bar">
          <div className="vmx-progress-fill" style={{ width: `${((currentIdx + 1) / sessionCards.length) * 100}%` }}></div>
        </div>
        <ImageOcclusionCard q={currentQ} showAnswer={showAnswer} onReveal={() => setShowAnswer(true)} />
        {showAnswer && (
          <div className="vmx-grade-row">
            <button className="vmx-btn vmx-btn-rose" onClick={() => handleGrade(0)}>0, Again</button>
            <button className="vmx-btn vmx-btn-gold" onClick={() => handleGrade(1)}>1, Hard</button>
            <button className="vmx-btn vmx-btn-sage" onClick={() => handleGrade(2)}>2, Good</button>
            <button className="vmx-btn vmx-btn-primary" onClick={() => handleGrade(3)}>3, Easy</button>
          </div>
        )}
      </>
    );
  }

  if (currentQ.type === 'cloze') {
    return (
      <>
        <div className="vmx-exam-top">
          <div className="vmx-progress"><strong>{currentIdx + 1}</strong> / {sessionCards.length}, SR</div>
          <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
            next: {fmtDate(currentCard.nextReview)}
          </div>
        </div>
        <div className="vmx-progress-bar">
          <div className="vmx-progress-fill" style={{ width: `${((currentIdx + 1) / sessionCards.length) * 100}%` }}></div>
        </div>
        <ClozeCard q={currentQ} showAnswer={showAnswer} onReveal={() => setShowAnswer(true)} />
        {showAnswer && (
          <div className="vmx-grade-row">
            <button className="vmx-btn vmx-btn-rose" onClick={() => handleGrade(0)}>0, Again</button>
            <button className="vmx-btn vmx-btn-gold" onClick={() => handleGrade(1)}>1, Hard</button>
            <button className="vmx-btn vmx-btn-sage" onClick={() => handleGrade(2)}>2, Good</button>
            <button className="vmx-btn vmx-btn-primary" onClick={() => handleGrade(3)}>3, Easy</button>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="vmx-exam-top">
        <div className="vmx-progress"><strong>{currentIdx + 1}</strong> / {sessionCards.length}, SR</div>
        <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
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
            {', '}{typeLabel}
          </div>
          {currentQ.image && safeImageUrl(currentQ.image) && (
            <>
              <img
                src={safeImageUrl(currentQ.image)}
                alt={`Question ${currentQ.id} image, ${currentQ.subject}/${currentQ.topic || 'general'}`}
                loading="lazy"
                decoding="async"
                className="vmx-qimage"
                style={{ margin: '0 auto 16px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const ph = e.currentTarget.nextElementSibling;
                  if (ph && ph.dataset.imgFallback) ph.style.display = 'block';
                }}
              />
              <div data-img-fallback="1" style={{ display: 'none', padding: '12px 16px', borderRadius: 10, background: 'var(--clr-rose-soft)', border: '1px dashed var(--clr-rose)', fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic', margin: '0 auto 16px' }}>
                ภาพประกอบโหลดไม่ได้
              </div>
            </>
          )}
          <div style={{ fontSize: 18 }}><RichText text={currentQ.q} /></div>
          {currentQ.imagePath && <ZoomableImage src={currentQ.imagePath} maxHeight={240} />}
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
        // Every sublabel is computed by the scheduler itself. They used to be
        // written by hand and had drifted: Again promised "< 1 min" while
        // hiding the card for a full day, Easy multiplied by a hardcoded 2.5
        // instead of the card's own ease, and Good showed a range.
        <div className="vmx-sr-grade">
          <button className="vmx-sr-btn again" onClick={() => handleGrade(0)}>
            <div className="label">Again</div>
            <div className="sub">{relearnLeft > 0 ? 'ท้ายรอบนี้' : `${previewInterval(currentCard, 0)} วัน`}</div>
          </button>
          <button className="vmx-sr-btn hard" onClick={() => handleGrade(1)}>
            <div className="label">Hard</div>
            <div className="sub">{previewInterval(currentCard, 1)} วัน</div>
          </button>
          <button className="vmx-sr-btn good" onClick={() => handleGrade(2)}>
            <div className="label">Good</div>
            <div className="sub">{previewInterval(currentCard, 2)} วัน</div>
          </button>
          <button className="vmx-sr-btn easy" onClick={() => handleGrade(3)}>
            <div className="label">Easy</div>
            <div className="sub">{previewInterval(currentCard, 3)} วัน</div>
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
