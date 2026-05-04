import { useRef, useState } from 'react';
import { SUBJECTS } from '../data/questions.js';
import { RichText } from '../lib/richtext.jsx';
import SmartPassage from './SmartPassage.jsx';
import ZoomableImage from './ZoomableImage.jsx';

export default function QuestionComponent({ currentQ, currentAnswer, answerCurrent, isBookmarked, toggleBookmark, note, onNoteChange, showNote, setShowNote }) {
  // Passage panel (for reading-comprehension questions) — handled by
  // SmartPassage component (see ./SmartPassage.jsx). It owns its own
  // open/closed state, highlight + pen overlays, and persistence.
  // We just hold a ref so the mobile FAB can scroll the passage into
  // view when the user taps "📄 Passage".
  const passageRef = useRef(null);

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

  // FAB action — smooth scroll passage into view. SmartPassage manages
  // open/closed itself; we don't need to force it open from here.
  const focusPassage = () => {
    requestAnimationFrame(() => {
      try {
        passageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch {
        passageRef.current?.scrollIntoView();
      }
    });
  };

  // Header (bookmark + note + badge + image) renders at top regardless
  // of layout. Below it, when a passage exists, the passage and the
  // question content split into a 2-column grid on wide screens (CSS
  // class `vmx-q-with-passage` does the responsive switch — see
  // styles.js). On narrow screens they stack as before, plus a FAB
  // appears for one-tap "back to passage" access.
  const passageBlock = currentQ.passage && (
    <div ref={passageRef} className="vmx-q-passage-pane">
      <SmartPassage
        text={currentQ.passage}
        title={currentQ.passage_title}
        defaultOpen={true}
      />
    </div>
  );

  const contentBlock = (
    <div className="vmx-q-content-pane">
      <div className="vmx-qtext"><RichText text={currentQ.q} /></div>

      {/* Image rendering — used for U/S sonograms in หมาหอน bank.
          Tap to enlarge in lightbox modal (close: tap outside / × / Esc). */}
      {currentQ.imagePath && <ZoomableImage src={currentQ.imagePath} maxHeight={360} />}

      {/* Data discrepancy flag — surfaces conflicts between past papers
          and current lecture content. See vault discrepancies.md +
          self-optimization rule 1d (hold to facts). */}
      {currentQ.flag && <FlagChip flag={currentQ.flag} />}

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

      {/* Short answer — free-form text input. Auto-grade does loose
          keyword matching against q.keywords; user can also self-grade
          or AI-grade in Review since open-text grading is fuzzy. */}
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
          target_words / soft_max_words / hard_max_words drive the bar
          color (sage → gold → rose) so the user self-regulates length
          against the Final's penalty zones. */}
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

      {currentQ.image && (
        <img
          src={currentQ.image}
          alt={`Question ${currentQ.id} image · ${currentQ.subject}/${currentQ.topic || 'general'}`}
          loading="lazy"
          decoding="async"
          className="vmx-qimage"
          // onError swaps the broken <img> for an inline placeholder
          // so users see "image failed to load" rather than a blank
          // gap. We hide the img element to avoid double-rendering.
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const ph = e.currentTarget.nextElementSibling;
            if (ph && ph.dataset.imgFallback) ph.style.display = 'block';
          }}
        />
      )}
      {currentQ.image && (
        <div data-img-fallback="1" style={{ display: 'none', padding: '12px 16px', borderRadius: 10, background: 'var(--clr-rose-soft)', border: '1px dashed var(--clr-rose)', fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic', margin: '8px 0' }}>
          ⚠️ ภาพประกอบโหลดไม่ได้ — ลองรีเฟรชหรือเช็คเน็ต
        </div>
      )}

      {/* Layout switch: with-passage = grid on wide / stacked on narrow */}
      {currentQ.passage ? (
        <div className="vmx-q-with-passage">
          {passageBlock}
          {contentBlock}
        </div>
      ) : (
        <>{contentBlock}</>
      )}

      {/* Mobile/tablet only — pinned bottom-right. CSS hides it on
          desktop because the side-by-side grid already keeps the
          passage in view. Tap → expand+scroll the passage block. */}
      {currentQ.passage && (
        <button
          type="button"
          className="vmx-passage-fab"
          onClick={focusPassage}
          aria-label="ดู passage"
          title="ดู passage"
        >
          📄 Passage
        </button>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// FlagChip — visual warning that a question has a known data
// conflict between past paper answer and current lecture content.
// Severity color: major=rose, minor=gold, unclear=ink-soft.
// Click expands to show note + sources.
// ────────────────────────────────────────────────────────────────
function FlagChip({ flag }) {
  const [open, setOpen] = useState(false);
  const sev = flag?.severity || 'unclear';
  const palette = {
    major: { bg: 'rgba(194, 109, 109, 0.12)', border: 'var(--clr-rose)', text: 'var(--clr-rose)', icon: '⚠️' },
    minor: { bg: 'rgba(184, 137, 64, 0.12)', border: 'var(--clr-gold)', text: 'var(--clr-gold)', icon: '⚡' },
    unclear: { bg: 'var(--clr-surface-2)', border: 'var(--clr-border)', text: 'var(--clr-ink-soft)', icon: '❓' },
  }[sev] || palette.unclear;

  return (
    <div style={{ marginTop: 12 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: palette.bg,
          border: `1px solid ${palette.border}`,
          borderRadius: 999,
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
          color: palette.text,
        }}
        title="ข้อมูลขัดแย้ง — กดดูรายละเอียด"
      >
        {palette.icon} ข้อมูลขัดแย้ง · {sev.toUpperCase()} {open ? '▾' : '▸'}
      </button>

      {open && (
        <div style={{
          marginTop: 8,
          padding: '12px 14px',
          background: palette.bg,
          borderLeft: `3px solid ${palette.border}`,
          borderRadius: '0 8px 8px 0',
          fontSize: 13,
          lineHeight: 1.6,
          color: 'var(--clr-ink)',
        }}>
          <div>{flag.note}</div>
          {flag.sources?.length > 0 && (
            <div style={{
              marginTop: 8,
              fontSize: 11,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--clr-ink-soft)',
            }}>
              📚 Sources: {flag.sources.join(' · ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
