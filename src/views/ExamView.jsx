import { useState } from 'react';
import QuestionComponent from '../components/Question.jsx';
import { fmtTime } from '../hooks/utils.js';

export default function ExamView({ currentQ, currentIdx, questions, timeLeft, useTimer, isBookmarked, toggleBookmark, currentAnswer, answerCurrent, nextQ, prevQ, notes, setNote }) {
  const [showNote, setShowNote] = useState(false);
  return (
    <>
      <div className="vmx-exam-top">
        <div className="vmx-progress"><strong>{currentIdx + 1}</strong> / {questions.length}</div>
        {useTimer && <div className={`vmx-timer ${timeLeft <= 10 ? 'warn' : ''}`}>{fmtTime(timeLeft)}</div>}
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
        <button className="vmx-btn vmx-btn-primary" onClick={nextQ}>{currentIdx === questions.length - 1 ? 'ส่งข้อสอบ ✓' : 'ข้อถัดไป →'}</button>
      </div>
    </>
  );
}
