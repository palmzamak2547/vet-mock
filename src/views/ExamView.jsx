import { useState, useEffect } from 'react';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import QuestionComponent from '../components/Question.jsx';
import { fmtTime, isCorrect, isWritingType } from '../hooks/utils.js';
import { countBuddiesOnQ } from '../hooks/useStudyBuddies.js';
import { useModalFocus } from '../hooks/useModalFocus.js';

export default function ExamView({ currentQ, currentIdx, questions, timeLeft, useTimer, isBookmarked, toggleBookmark, currentAnswer, answerCurrent, nextQ, prevQ, notes, setNote, jumpToQ, answers, bookmarks, buddies, user, goHome, mode, instantFeedback }) {
  const [showNote, setShowNote] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  // Practice-only instant reveal: ✓/✗ + explanation right after answering.
  // Exam mode always defers feedback to the results/review flow.
  const revealAnswer = mode !== 'exam' && Boolean(instantFeedback);
  const submitDialogRef = useModalFocus({
    active: confirmSubmit,
    onClose: () => setConfirmSubmit(false),
  });
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const isLast = currentIdx === questions.length - 1;
  // Keyboard on the last Q (Space/Enter/J in App) asks to submit — surface
  // the same confirm dialog the button opens, so a keypress can't end the
  // exam without an explicit confirm.
  useEffect(() => {
    const open = () => setConfirmSubmit(true);
    window.addEventListener('vmx-exam-submit-request', open);
    return () => window.removeEventListener('vmx-exam-submit-request', open);
  }, []);
  // Show the navigator opener for medium/long exams; short exams (≤10) just use prev/next
  const showNavOpener = questions.length >= 15;
  // Live "X buddies on this Q" count — pulls from Supabase presence
  // payload (qKey field). Hidden when 0 or no Supabase.
  const qKey = currentQ ? `${currentQ.subject}:${currentQ.id}` : null;
  const buddiesHere = countBuddiesOnQ(buddies || {}, qKey, user?.id);

  // Exit-exam handler — explicit confirm so a stray tap on the X
  // doesn't lose progress. Auto-save + in-flight resume mean a refresh
  // also recovers state, but the visible escape route is what reduces
  // panic when a user mishits during a real session. Uses the app's own
  // dialog (an OS confirm mid-exam reads as a browser warning).
  const exitExam = () => {
    if (!goHome) return;
    setConfirmExit(true);
  };

  return (
    <>
      <div className="vmx-exam-top">
        {goHome && (
          <button
            type="button"
            onClick={exitExam}
            title="ออกจากชุดนี้ — คำตอบยังถูกเก็บไว้ผ่าน auto-save"
            aria-label="ออกจากชุดนี้"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            style={{ padding: '4px 10px', fontSize: 13, marginRight: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <span aria-hidden="true">✕</span>
            <span>ออก</span>
          </button>
        )}
        <div className="vmx-progress">
          <strong>{currentIdx + 1}</strong> / {questions.length}
          {(currentQ?.type === 'essay' || currentQ?.type === 'short') && (
            <span style={{
              marginLeft: 8,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'rgba(184, 137, 64, 0.15)',
              color: 'var(--clr-gold-text)',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'var(--vmx-mono)',
              letterSpacing: '0.06em',
            }}>
              ✍️ {currentQ.type === 'essay' ? 'WRITING' : 'SHORT'}
            </span>
          )}
        </div>
        {useTimer && (
          <div className={`vmx-timer ${timeLeft <= 10 ? 'warn' : (timeLeft <= 60 && (currentQ?.type === 'essay' || currentQ?.type === 'short')) ? 'warn' : ''}`}>
            {fmtTime(timeLeft)}
          </div>
        )}
        {revealAnswer && (() => {
          // Running tally over auto-gradable answered questions — the
          // motivational "✓ n/m" chip. Writing types self-grade in Review,
          // so they stay out of the count entirely.
          const graded = questions.filter((q) => !isWritingType(q) && answers[q.id] !== undefined);
          if (!graded.length) return null;
          const ok = graded.filter((q) => isCorrect(q, answers[q.id])).length;
          return (
            <div className={`vmx-live-score ${ok / graded.length >= 0.6 ? '' : 'low'}`} title="คะแนนสดของชุดนี้ (เฉพาะข้อตรวจอัตโนมัติ)">
              ✓ {ok}/{graded.length}
            </div>
          );
        })()}
      </div>
      <div className="vmx-progress-bar">
        <div
          className="vmx-progress-fill"
          role="progressbar"
          aria-label="ความคืบหน้าของชุดข้อสอบ"
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-valuenow={currentIdx + 1}
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>
      <div className="vmx-sr-only" role="status" aria-live="polite">ข้อ {currentIdx + 1} จาก {questions.length}</div>

      {buddiesHere > 0 && (
        <div style={{
          marginTop: 8, padding: '4px 12px', borderRadius: 999,
          background: 'rgba(74, 107, 74, 0.10)', border: '1px solid var(--clr-sage)',
          fontSize: 11, fontFamily: 'var(--vmx-mono)',
          color: 'var(--clr-sage)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          👥 {buddiesHere} คนกำลังทำข้อนี้
        </div>
      )}

      <QuestionComponent
        currentQ={currentQ}
        currentAnswer={currentAnswer}
        answerCurrent={answerCurrent}
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
        note={notes[currentQ.id]}
        onNoteChange={(val) => setNote(currentQ.id, val)}
        showNote={showNote}
        setShowNote={setShowNote}
        revealAnswer={revealAnswer}
      />

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={prevQ} disabled={currentIdx === 0}>← ข้อก่อนหน้า</button>
        {showNavOpener && jumpToQ && (
          <button className="vmx-btn vmx-btn-ghost" onClick={() => setShowNav(true)} title="ดูทุกข้อ + ข้ามไปข้อที่ต้องการ">
            📋 {currentIdx + 1}/{questions.length}
          </button>
        )}
        <button
          className="vmx-btn vmx-btn-primary"
          onClick={() => { if (isLast) setConfirmSubmit(true); else nextQ(); }}
        >
          {isLast ? 'ส่งข้อสอบ ✓' : 'ข้อถัดไป →'}
        </button>
      </div>

      {showNav && jumpToQ && (
        <NavGrid
          questions={questions}
          answers={answers}
          bookmarks={bookmarks}
          currentIdx={currentIdx}
          onJump={(i) => { jumpToQ(i); setShowNav(false); }}
          onClose={() => setShowNav(false)}
        />
      )}

      {/* Leaving parks the current set. App.goHome resets only the active
          runtime and deliberately preserves vmx-inflight-exam until it is
          completed, explicitly discarded, or expires. */}
      <ConfirmDialog
        open={confirmExit}
        title="ออกจากชุดนี้?"
        body={`ความคืบหน้า${answeredCount > 0 ? ` ${answeredCount} จาก ${questions.length} ข้อ` : ''} จะถูกเก็บไว้ที่หน้าแรก กดทำต่อเพื่อกลับมาข้อเดิมได้ภายใน 6 ชั่วโมง`}
        confirmLabel="เก็บไว้แล้วออก"
        cancelLabel="ทำต่อ"
        onConfirm={() => { setConfirmExit(false); goHome(); }}
        onCancel={() => setConfirmExit(false)}
      />

      {confirmSubmit && (
        <div className="vmx-modal-overlay" onClick={() => setConfirmSubmit(false)}>
          <div
            ref={submitDialogRef}
            className="vmx-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 420 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vmx-submit-title"
            tabIndex={-1}
            data-vmx-modal="true"
          >
            {(() => {
              const answered = questions.filter((q) => answers[q.id] !== undefined).length;
              const remaining = questions.length - answered;
              return (
                <>
                  <h2 id="vmx-submit-title" style={{ margin: '0 0 8px' }}>ส่งข้อสอบ?</h2>
                  <p style={{ margin: '0 0 6px', color: 'var(--clr-ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
                    ตอบแล้ว {answered} จาก {questions.length} ข้อ
                  </p>
                  {remaining > 0 && (
                    <p role="alert" style={{ margin: '0 0 4px', color: 'var(--clr-rose-text)', fontSize: 14, fontWeight: 600, lineHeight: 1.6 }}>
                      ยังไม่ได้ตอบอีก {remaining} ข้อ — ถ้าส่งตอนนี้ ข้อที่เว้นจะไม่ได้คะแนน
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="vmx-btn vmx-btn-primary"
                      onClick={() => { setConfirmSubmit(false); nextQ(); }}
                      style={{ flex: '1 1 140px' }}
                      autoFocus
                    >
                      ส่งข้อสอบ
                    </button>
                    <button
                      type="button"
                      className="vmx-btn vmx-btn-ghost"
                      onClick={() => setConfirmSubmit(false)}
                      style={{ flex: '1 1 140px' }}
                    >
                      กลับไปตรวจ
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}

function NavGrid({ questions, answers, bookmarks, currentIdx, onJump, onClose }) {
  const answered = questions.filter((q) => answers[q.id] !== undefined).length;
  const remaining = questions.length - answered;
  const dialogRef = useModalFocus({ onClose });

  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="vmx-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 720 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vmx-nav-grid-title"
        tabIndex={-1}
        data-vmx-modal="true"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <h2 id="vmx-nav-grid-title" style={{ margin: 0 }}>ข้ามไปข้อ</h2>
          <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>
            ตอบแล้ว {answered}/{questions.length}, เหลือ {remaining}
          </div>
        </div>

        <div
          className="vmx-nav-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
            gap: 8,
            maxHeight: '60vh',
            overflowY: 'auto',
            padding: 4,
          }}
        >
          {questions.map((q, i) => {
            const isAnswered = answers[q.id] !== undefined;
            const isBookmarked = bookmarks?.includes(q.id);
            const isCurrent = i === currentIdx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onJump(i)}
                title={`ข้อ ${i + 1}${isAnswered ? ', ตอบแล้ว' : ''}${isBookmarked ? ', ★' : ''}`}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '10px 4px',
                  borderRadius: 8,
                  fontFamily: 'var(--vmx-mono)',
                  fontSize: 13,
                  fontWeight: isCurrent ? 700 : 500,
                  position: 'relative',
                  background: isCurrent
                    ? 'var(--clr-rose)'
                    : isAnswered
                      ? 'var(--clr-sage-soft, #c8d8c0)'
                      : 'var(--clr-surface-2)',
                  color: isCurrent ? 'white' : 'var(--clr-ink)',
                  border: isCurrent ? '2px solid var(--clr-rose)' : '1px solid var(--clr-border)',
                  transition: 'transform 0.1s',
                  minHeight: 44,
                }}
                onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
              >
                {i + 1}
                {isBookmarked && (
                  <span style={{ position: 'absolute', top: 1, right: 4, fontSize: 9, color: isCurrent ? 'white' : 'var(--clr-gold-text)' }}>★</span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 12, fontSize: 11, color: 'var(--clr-ink-soft)', flexWrap: 'wrap' }}>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, background: 'var(--clr-rose)', borderRadius: 3, verticalAlign: 'middle', marginRight: 4 }} /> ข้อปัจจุบัน</span>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, background: 'var(--clr-sage-soft, #c8d8c0)', borderRadius: 3, verticalAlign: 'middle', marginRight: 4 }} /> ตอบแล้ว</span>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, background: 'var(--clr-surface-2)', borderRadius: 3, border: '1px solid var(--clr-border)', verticalAlign: 'middle', marginRight: 4 }} /> ยังไม่ตอบ</span>
          <span>★ Bookmark</span>
        </div>

        <div className="vmx-btn-row" style={{ marginTop: 16 }}>
          <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  );
}
