import { useState } from 'react';
import { SUBJECTS } from '../data/questions.js';
import { RichText } from '../lib/richtext.jsx';

export default function QuestionComponent({ currentQ, currentAnswer, answerCurrent, isBookmarked, toggleBookmark, note, onNoteChange, showNote, setShowNote }) {
  // Passage panel (for reading-comprehension questions) — collapsible.
  // Defaults open the first time so students see the text; they can
  // collapse it when they're ready to focus on answering.
  const [passageOpen, setPassageOpen] = useState(true);

  // Word count for essay-type writing questions
  const essayText = (currentQ.type === 'essay' && typeof currentAnswer === 'string') ? currentAnswer : '';
  const essayWords = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const target = currentQ.target_words || 150;
  const softMax = currentQ.soft_max_words || 180;
  const hardMax = currentQ.hard_max_words || 200;
  const essayBarColor =
    essayWords === 0 ? 'var(--clr-border)' :
    essayWords > hardMax ? 'var(--clr-rose)' :
    essayWords > softMax ? 'var(--clr-gold)' :
    'var(--clr-sage)';

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
        {currentQ.type === 'short' && 'Short Answer'}
        {currentQ.type === 'essay' && '✍️ Writing (Summary)'}
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

      {/* Passage block (for reading-comprehension questions) */}
      {currentQ.passage && (
        <div style={{ marginBottom: 16, border: '1px solid var(--clr-border)', borderRadius: 12, overflow: 'hidden', background: 'var(--clr-surface-2)' }}>
          <button
            type="button"
            onClick={() => setPassageOpen((v) => !v)}
            style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', width: '100%', boxSizing: 'border-box', background: 'var(--clr-surface)', borderBottom: passageOpen ? '1px solid var(--clr-border)' : 'none' }}
          >
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)' }}>
              📄 {currentQ.passage_title || 'Reading Passage'}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--clr-ink-soft)' }}>{passageOpen ? '▾ ซ่อน' : '▸ ดู passage'}</span>
          </button>
          {passageOpen && (
            <div style={{ padding: '14px 16px', fontSize: 14, lineHeight: 1.75, color: 'var(--clr-ink)', whiteSpace: 'pre-wrap', maxHeight: 380, overflowY: 'auto' }}>
              <RichText text={currentQ.passage} />
            </div>
          )}
        </div>
      )}

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

      {/* Short answer — free-form 1-3 line text input.
          Auto-grade does loose keyword matching against q.model_answer
          (see hooks/utils.js → isCorrect). User can also self-grade in
          ReviewView since open-text grading is inherently fuzzy. */}
      {currentQ.type === 'short' && (
        <div className="vmx-fill-row">
          <div className="vmx-fill-label">Your answer (พิมพ์ตอบสั้นๆ)</div>
          <textarea
            className="vmx-fill-input"
            value={typeof currentAnswer === 'string' ? currentAnswer : ''}
            onChange={(e) => answerCurrent(e.target.value.slice(0, 1000))}
            placeholder="เขียนคำตอบสั้นๆ (1-3 ประโยค)"
            rows={3}
            style={{ minHeight: 70, fontFamily: 'inherit', resize: 'vertical', width: '100%', boxSizing: 'border-box', padding: 10 }}
            maxLength={1000}
          />
          <div style={{ marginTop: 4, fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
            {(typeof currentAnswer === 'string' ? currentAnswer.length : 0)}/1000 chars
          </div>
        </div>
      )}

      {/* Essay / Summary — full writing question with live word counter.
          target_words / soft_max_words / hard_max_words on the question
          drive the bar color (sage → gold → rose) so the user can self-
          regulate length against the Final's penalty zones. */}
      {currentQ.type === 'essay' && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
            <div className="vmx-fill-label" style={{ marginBottom: 0 }}>
              Your summary
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
              <strong style={{ color: essayBarColor }}>{essayWords}</strong>
              <span> / target {target} words</span>
              {essayWords > hardMax && <span style={{ color: 'var(--clr-rose)', marginLeft: 8 }}> · −2 pts (เกิน {hardMax})</span>}
              {essayWords > softMax && essayWords <= hardMax && <span style={{ color: 'var(--clr-gold)', marginLeft: 8 }}> · −1 pt (เกิน {softMax})</span>}
            </div>
          </div>
          <textarea
            value={essayText}
            onChange={(e) => answerCurrent(e.target.value.slice(0, 5000))}
            placeholder={`เขียน summary ~${target} คำ — ใช้ paraphrasing techniques (เปลี่ยน synonyms, structure, ฯลฯ) · จับ main idea + key supporting details · ห้ามใส่ opinion`}
            rows={12}
            maxLength={5000}
            style={{
              width: '100%', boxSizing: 'border-box',
              minHeight: 240, padding: 12, fontFamily: 'inherit', fontSize: 14, lineHeight: 1.6,
              border: '1px solid var(--clr-border)', borderRadius: 10, background: 'var(--clr-bg)', color: 'var(--clr-ink)',
              resize: 'vertical',
            }}
          />
          {/* Word-count bar (visual) */}
          <div style={{ marginTop: 8, height: 4, background: 'var(--clr-surface-2)', borderRadius: 999, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, (essayWords / hardMax) * 100)}%`,
                background: essayBarColor,
                transition: 'width 0.2s, background 0.2s',
              }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>
            🎯 Target: <strong>{target}</strong> words · Soft cap: <strong>{softMax}</strong> (penalty −1) · Hard cap: <strong>{hardMax}</strong> (penalty −2)
          </div>
        </div>
      )}
    </div>
  );
}
