import { useState } from 'react';
import QuestionComponent from '../components/Question.jsx';
import { fmtTime } from '../hooks/utils.js';

export default function ExamView({ currentQ, currentIdx, questions, timeLeft, useTimer, isBookmarked, toggleBookmark, currentAnswer, answerCurrent, nextQ, prevQ, notes, setNote, jumpToQ, answers, bookmarks }) {
  const [showNote, setShowNote] = useState(false);
  const [showNav, setShowNav] = useState(false);
  // Show the navigator opener for medium/long exams; short exams (≤10) just use prev/next
  const showNavOpener = questions.length >= 15;

  return (
    <>
      <div className="vmx-exam-top">
        <div className="vmx-progress">
          <strong>{currentIdx + 1}</strong> / {questions.length}
          {(currentQ?.type === 'essay' || currentQ?.type === 'short') && (
            <span style={{
              marginLeft: 8,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'rgba(184, 137, 64, 0.15)',
              color: 'var(--clr-gold)',
              fontSize: 10,
              fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace',
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
      </div>
      <div className="vmx-progress-bar">
        <div className="vmx-progress-fill" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
      </div>

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
      />

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={prevQ} disabled={currentIdx === 0}>← ข้อก่อนหน้า</button>
        {showNavOpener && jumpToQ && (
          <button className="vmx-btn vmx-btn-ghost" onClick={() => setShowNav(true)} title="ดูทุกข้อ + ข้ามไปข้อที่ต้องการ">
            📋 {currentIdx + 1}/{questions.length}
          </button>
        )}
        <button className="vmx-btn vmx-btn-primary" onClick={nextQ}>{currentIdx === questions.length - 1 ? 'ส่งข้อสอบ ✓' : 'ข้อถัดไป →'}</button>
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
    </>
  );
}

function NavGrid({ questions, answers, bookmarks, currentIdx, onJump, onClose }) {
  const answered = questions.filter((q) => answers[q.id] !== undefined).length;
  const remaining = questions.length - answered;

  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div
        className="vmx-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 720 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>📋 ข้ามไปข้อ</h2>
          <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
            ตอบแล้ว {answered}/{questions.length} · เหลือ {remaining}
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
                onClick={() => onJump(i)}
                title={`ข้อ ${i + 1}${isAnswered ? ' · ตอบแล้ว' : ''}${isBookmarked ? ' · ★' : ''}`}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '10px 4px',
                  borderRadius: 8,
                  fontFamily: 'JetBrains Mono, monospace',
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
                  <span style={{ position: 'absolute', top: 1, right: 4, fontSize: 9, color: isCurrent ? 'white' : 'var(--clr-gold)' }}>★</span>
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
          <button className="vmx-btn vmx-btn-ghost" onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  );
}
