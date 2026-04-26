import { useState } from 'react';
import { SUBJECTS } from '../data/questions.js';
import { RichText } from '../lib/richtext.jsx';

export default function QuestionComponent({ currentQ, currentAnswer, answerCurrent, isBookmarked, toggleBookmark, note, onNoteChange, showNote, setShowNote }) {
  return (
    <div className="vmx-question-card">
      <button className={`vmx-bookmark-btn ${isBookmarked ? 'active' : ''}`} onClick={() => toggleBookmark(currentQ.id)} title="Bookmark (B)">
        {isBookmarked ? '★' : '☆'}
      </button>
      <button className={`vmx-note-btn ${note ? 'has-note' : ''}`} onClick={() => setShowNote(!showNote)} title="Note (N)">
        📝
      </button>

      <div className="vmx-qtype-badge">
        {currentQ.type === 'mcq' && 'Multiple Choice'}
        {currentQ.type === 'tf' && 'True / False'}
        {currentQ.type === 'fill' && 'Fill in the Blank'}
        {currentQ.type === 'match' && 'Matching'}
        {(() => {
          const subj = SUBJECTS.find((s) => s.id === currentQ.subject);
          const topic = currentQ.topic && subj?.topics?.find((t) => t.id === currentQ.topic);
          return (
            <>
              {' · '}{subj?.name || currentQ.subject}
              {topic && <> · <span style={{ color: subj?.color || 'var(--clr-ink-soft)' }}>{topic.icon} {topic.label.replace(/^คาบ\s*\d+(-\d+)?\s*·\s*/, '')}</span></>}
            </>
          );
        })()}
        {currentQ.examOrigin && (
          <span title="คำถามนี้อ้างอิงจากข้อสอบเก่า" style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 999, background: 'var(--clr-gold-soft)', color: 'var(--clr-ink)', fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
            📜 ข้อสอบเก่า
          </span>
        )}
      </div>

      {currentQ.image && <img src={currentQ.image} alt="" className="vmx-qimage" />}
      <div className="vmx-qtext"><RichText text={currentQ.q} /></div>

      {showNote && (
        <div className="vmx-note-panel">
          <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 6, fontFamily: 'JetBrains Mono, monospace' }}>NOTE</div>
          <textarea className="vmx-note-textarea" value={note || ''} onChange={(e) => onNoteChange(e.target.value.slice(0, 5000))} placeholder="จดโน้ตที่นี่..." maxLength={5000} />
        </div>
      )}

      {currentQ.type === 'mcq' && (
        <div className="vmx-options">
          {currentQ.options?.length > 0 ? currentQ.options.map((opt, i) => (
            <button key={i} className={`vmx-option ${currentAnswer === i ? 'selected' : ''}`} onClick={() => answerCurrent(i)}>
              <div className="vmx-option-letter">{String.fromCharCode(65 + i)}</div>
              <div className="vmx-option-text"><RichText text={opt} /></div>
            </button>
          )) : (
            <div className="vmx-empty">⚠️ ข้อนี้ไม่มี options — ข้อมูลผิดรูปแบบ</div>
          )}
        </div>
      )}

      {currentQ.type === 'tf' && (
        <div className="vmx-tf-row">
          <button className={`vmx-tf-btn ${currentAnswer === true ? 'selected-true' : ''}`} onClick={() => answerCurrent(true)}>✓ True</button>
          <button className={`vmx-tf-btn ${currentAnswer === false ? 'selected-false' : ''}`} onClick={() => answerCurrent(false)}>✗ False</button>
        </div>
      )}

      {currentQ.type === 'fill' && (
        <div className="vmx-fill-row">
          {currentQ.blanks.map((_, i) => (
            <div key={i}>
              <div className="vmx-fill-label">
                {currentQ.blanks.length > 1 ? `ช่องที่ ${i + 1}` : 'คำตอบ'}
              </div>
              <input type="text" className="vmx-fill-input" value={(currentAnswer && currentAnswer[i]) || ''}
                onChange={(e) => { const arr = currentAnswer ? [...currentAnswer] : []; arr[i] = e.target.value; answerCurrent(arr); }}
                placeholder={`เติมในช่อง ____ ${currentQ.blanks.length > 1 ? '(' + (i + 1) + ')' : ''}`} />
            </div>
          ))}
        </div>
      )}

      {currentQ.type === 'match' && (
        <div className="vmx-match-row">
          {currentQ.pairs.map((pair, i) => (
            <div key={i} className="vmx-match-item">
              <div className="vmx-match-left"><RichText text={pair.left} /></div>
              <select className="vmx-match-select" value={(currentAnswer && currentAnswer[i]) || ''}
                onChange={(e) => { const obj = currentAnswer ? { ...currentAnswer } : {}; obj[i] = e.target.value; answerCurrent(obj); }}>
                <option value="">— เลือก —</option>
                {currentQ.pairs.map((p, j) => <option key={j} value={p.right}>{p.right.replace(/\*\*/g, '').replace(/\*/g, '')}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
