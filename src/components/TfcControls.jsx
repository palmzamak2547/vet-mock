// True or false with a written correction (type 'tfc'): the paper's format where a statement
// marked ผิด must be put right in writing. Two word buttons, and under ผิด one field for the
// word or number that makes the statement true. The answer is stored as fill stores its own,
// an array of strings: ['T'], or ['F', 'the correction'].
//
// The controls only. The card (Question.jsx) owns the check, the verdict panel and the timing,
// so this type reveals exactly when a fill-in item does: on ตรวจคำตอบ, never on the tap, because
// the verdict must not show before the correction is typed.

import { TYPED_MAX_CHARS } from '../hooks/utils.js';

// The correction put away when the student switched to ถูก, by attempt and item, for this page
// load: one card serves the whole set, so each item keeps its own. A fresh (unanswered) item drops its own.
const TFC_DRAFTS = new Map();

export const tfcVerdict = (answer) => (Array.isArray(answer) && (answer[0] === 'T' || answer[0] === 'F') ? answer[0] : null);
export const tfcText = (answer) => (Array.isArray(answer) && answer[0] === 'F' && typeof answer[1] === 'string' ? answer[1] : '');

export default function TfcControls({ q, answer, answerCurrent, revealed = false, outcome = null, onEnter, fieldId, draftKey = fieldId }) {
  const picked = tfcVerdict(answer);
  const text = tfcText(answer);
  const keyIs = q.answer === true ? 'T' : 'F';
  if (!picked) TFC_DRAFTS.delete(draftKey);
  const pick = (value) => {
    if (revealed) return;
    if (value === 'T') {
      if (picked === 'F') TFC_DRAFTS.set(draftKey, text);
      answerCurrent(['T']);
      return;
    }
    // The correction typed so far comes back when the student returns to ผิด.
    answerCurrent(['F', picked === 'F' ? text : TFC_DRAFTS.get(draftKey) ?? '']);
  };
  // After the check each button says in words what it is, as a true/false card does.
  const mark = (value) => {
    if (!revealed) return null;
    const isKey = keyIs === value;
    const mine = picked === value;
    if (isKey) return mine ? { mark: '✓ เฉลย, คุณตอบ', said: 'เฉลย และคุณตอบข้อนี้' } : { mark: '✓ เฉลย', said: 'เฉลย' };
    return mine ? { mark: '✗ คุณตอบ', said: 'คุณตอบข้อนี้ ไม่ใช่เฉลย' } : null;
  };
  const cls = (value) => {
    const on = picked === value ? (value === 'T' ? ' selected-true' : ' selected-false') : '';
    if (!revealed) return on;
    if (keyIs === value) return `${on} reveal-correct`;
    return picked === value ? `${on} reveal-wrong` : on;
  };
  // The correction's own mark, when the key is ผิด and the student said so.
  const fixState = revealed && picked === 'F' && outcome
    ? (q.answer === true ? 'void' : outcome.fix === 'ok' ? 'ok' : outcome.fix === 'off' ? 'no' : '')
    : '';
  return (
    <div className="vmx-tfc">
      <div className="vmx-tfc-row" role="group" aria-label="ข้อความนี้ถูกหรือผิด">
        {[['T', 'ถูก'], ['F', 'ผิด']].map(([value, word]) => {
          const m = mark(value);
          return (
            <button
              key={value}
              type="button"
              className={`vmx-tf-btn vmx-tfc-btn${cls(value)}`}
              aria-pressed={picked === value}
              aria-disabled={revealed || undefined}
              aria-label={m ? `${word}, ${m.said}` : undefined}
              onClick={() => pick(value)}
            >
              {word}
              {m ? <span className="vmx-tfc-mark">{m.mark}</span> : null}
            </button>
          );
        })}
      </div>
      {!revealed && picked !== 'F' && <p className="vmx-tfc-hint">ถ้าผิด ต้องเขียนแก้ให้ถูก</p>}
      {picked === 'F' && (
        <div className={`vmx-fill-field vmx-tfc-field${fixState === 'ok' ? ' is-ok' : fixState === 'no' ? ' is-no' : ''}`}>
          <label className="vmx-fill-label" htmlFor={fieldId}><span className="w">แก้เป็น</span></label>
          <div className="vmx-fill-input-wrap">
            <input
              id={fieldId}
              type="text"
              className={`vmx-fill-input${fixState === 'void' ? ' is-void' : ''}`}
              value={text}
              placeholder="คำหรือตัวเลขที่ถูก"
              readOnly={revealed}
              aria-invalid={fixState === 'no' ? true : undefined}
              aria-describedby={fixState === 'no' ? `${fieldId}-key` : undefined}
              autoCapitalize="off" autoCorrect="off" spellCheck={false} autoComplete="off"
              maxLength={TYPED_MAX_CHARS}
              enterKeyHint="done"
              onChange={(e) => { if (!revealed) answerCurrent(['F', e.target.value]); }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent?.isComposing) { e.preventDefault(); if (!revealed) onEnter?.(e); } }}
            />
            {fixState === 'ok' && <span className="vmx-fill-mark is-ok">✓ ถูก</span>}
            {fixState === 'no' && <span className="vmx-fill-mark is-no">✗ ผิด</span>}
          </div>
        </div>
      )}
    </div>
  );
}
