// ============================================================
// ClozeEditor.jsx — typing UI for Anki-style cloze cards.
// ============================================================
// Used by HighlightToCard (modal mode) and potentially future
// surfaces (e.g. NotesView inline). API:
//
//   <ClozeEditor
//     initialText="RER = 30 × {{c1::BW}} + 70"
//     subject="repro"
//     onSave={(cards) => …}      // cards = Array<savedCard>
//     onCancel={() => …}
//   />
//
// Behaviour:
//   • Textarea with toolbar: "✨ ทำ cloze" wraps the current
//     selection in `{{cN::...}}`, auto-incrementing N.
//   • Live preview shows front+back side-by-side for the first
//     cloze index; tab strip switches between indices.
//   • Subject picker (defaults to props.subject || '').
//   • Save disabled until parseCloze finds at least one mark.
//
// Cross-platform:
//   • Autofocus on mount (deferred to next frame for iOS).
//   • Selection API works on iPad (we use selectionStart/End
//     from the textarea, not window.getSelection — more reliable
//     inside <textarea>).
//   • No external deps; no portal; renders inline so the parent
//     (HighlightToCard) controls modal chrome.
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { SUBJECTS } from '../data/curriculum.js';
import { parseCloze, expandCloze, maxClozeIndex } from '../lib/cloze.js';
import { saveClozeText } from '../lib/user-flashcards.js';

export default function ClozeEditor({
  initialText = '',
  subject: initialSubject = '',
  onSave,
  onCancel,
}) {
  const [text, setText] = useState(initialText);
  const [subject, setSubject] = useState(initialSubject || '');
  const [activeIdx, setActiveIdx] = useState(null);
  const [error, setError] = useState('');
  const taRef = useRef(null);

  const subjectOptions = useMemo(
    () => SUBJECTS.filter((s) => s.id !== 'all'),
    [],
  );

  const parsed = useMemo(() => parseCloze(text), [text]);

  // Keep activeIdx valid as the user types
  useEffect(() => {
    if (!parsed.hasCloze) {
      if (activeIdx !== null) setActiveIdx(null);
      return;
    }
    if (activeIdx === null || !parsed.clozeIndices.includes(activeIdx)) {
      setActiveIdx(parsed.clozeIndices[0]);
    }
  }, [parsed, activeIdx]);

  // Autofocus textarea on mount (after paint, for iOS)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      taRef.current?.focus();
      // Place caret at end so the user can keep typing
      const len = (taRef.current?.value || '').length;
      try { taRef.current?.setSelectionRange(len, len); } catch { /* no-op */ }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  function wrapSelectionAsCloze() {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    if (start === end) {
      setError('เลือกข้อความที่อยากซ่อนก่อน แล้วกด "ทำ cloze"');
      return;
    }
    const before = text.slice(0, start);
    const selected = text.slice(start, end);
    const after = text.slice(end);
    const nextIdx = maxClozeIndex(text) + 1;
    const wrapped = `{{c${nextIdx}::${selected}}}`;
    const newText = before + wrapped + after;
    setText(newText);
    setError('');
    // Restore caret AFTER the wrapped text so typing continues naturally
    requestAnimationFrame(() => {
      const caret = before.length + wrapped.length;
      try {
        ta.focus();
        ta.setSelectionRange(caret, caret);
      } catch { /* no-op */ }
    });
  }

  function handleSave() {
    if (!parsed.hasCloze) {
      setError('ยังไม่มี cloze — เลือกข้อความแล้วกด "ทำ cloze"');
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) {
      setError('ข้อความว่าง');
      return;
    }
    try {
      const cards = saveClozeText({
        fullText: trimmed,
        subject: subject || null,
        source: 'cloze-editor',
      });
      if (!cards || cards.length === 0) {
        setError('บันทึกไม่ได้ — ลองเช็ค cloze marks');
        return;
      }
      onSave?.(cards);
    } catch (e) {
      setError(`บันทึกไม่ได้: ${e?.message || e}`);
    }
  }

  // Preview for the currently-selected cloze index
  const preview = useMemo(() => {
    if (activeIdx == null) return null;
    return expandCloze(text, activeIdx);
  }, [text, activeIdx]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className="vmx-btn vmx-btn-secondary vmx-btn-sm"
          onClick={wrapSelectionAsCloze}
          style={{ minHeight: 36, padding: '6px 12px' }}
          aria-label="ทำ cloze จากข้อความที่เลือก"
        >
          ทำ cloze ที่เลือก
        </button>
        {parsed.hasCloze && (
          <span style={{ fontSize: 12, color: 'var(--clr-ink-soft, #5e635e)' }}>
            {parsed.clozeIndices.length} cloze
            {parsed.clozeIndices.length > 1 ? ' indices' : ''} → จะสร้าง {parsed.clozeIndices.length} ใบ
          </span>
        )}
      </div>

      {/* Textarea */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-ink)' }}>
          ข้อความ (ใช้ {'{{c1::คำที่ซ่อน}}'} ครอบส่วนที่อยากซ่อน)
        </span>
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => { setText(e.target.value); setError(''); }}
          rows={5}
          placeholder="พิมพ์ข้อความ แล้วเลือกคำที่อยากซ่อน → กด ทำ cloze"
          spellCheck={false}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid var(--clr-border)',
            background: 'var(--clr-surface-2, #f7f6f1)',
            color: 'var(--clr-ink)',
            fontSize: 15,
            fontFamily: 'inherit',
            lineHeight: 1.55,
            resize: 'vertical',
            minHeight: 100,
            boxSizing: 'border-box',
          }}
        />
      </label>

      {/* Preview pane */}
      {parsed.hasCloze && preview && (
        <div
          style={{
            border: '1px dashed var(--clr-border, rgba(0,0,0,0.18))',
            borderRadius: 10,
            padding: 12,
            background: 'var(--clr-surface, #fff)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          {/* Tab strip */}
          {parsed.clozeIndices.length > 1 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {parsed.clozeIndices.map((i, n) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`vmx-btn vmx-btn-sm ${activeIdx === i ? 'vmx-btn-primary' : 'vmx-btn-ghost'}`}
                  style={{
                    minHeight: 32,
                    padding: '4px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {n + 1} / {parsed.clozeIndices.length}
                </button>
              ))}
            </div>
          )}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--clr-ink-soft, #5e635e)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              ด้านหน้า (c{activeIdx})
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {preview.front.split('[_____]').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span
                      style={{
                        display: 'inline-block',
                        background: 'var(--clr-gold-soft, #f6e7c1)',
                        color: 'var(--clr-ink, #1d201d)',
                        padding: '1px 8px',
                        borderRadius: 999,
                        fontWeight: 700,
                        margin: '0 2px',
                      }}
                    >
                      …
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--clr-ink-soft, #5e635e)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              ด้านหลัง (เฉลย)
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--clr-ink-soft, #5e635e)' }}>
              {preview.back}
            </div>
          </div>
        </div>
      )}

      {/* Subject */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-ink)' }}>
          วิชา (ไม่บังคับ)
        </span>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid var(--clr-border)',
            background: 'var(--clr-surface, #fff)',
            color: 'var(--clr-ink)',
            fontSize: 15,
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        >
          <option value="">— ไม่ระบุ —</option>
          {subjectOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.icon ? `${s.icon} ` : ''}{s.name}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <div
          role="alert"
          style={{
            background: 'var(--clr-red-soft, #fde0e0)',
            color: 'var(--clr-red-deep, #8a1a1a)',
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
        {onCancel && (
          <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onCancel}>
            ยกเลิก
          </button>
        )}
        <button
          type="button"
          className="vmx-btn vmx-btn-primary"
          onClick={handleSave}
          disabled={!parsed.hasCloze}
          style={{ opacity: parsed.hasCloze ? 1 : 0.55 }}
        >
          บันทึก {parsed.hasCloze ? `(${parsed.clozeIndices.length} ใบ)` : ''}
        </button>
      </div>
    </div>
  );
}
