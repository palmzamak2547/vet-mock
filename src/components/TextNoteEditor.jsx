// TextNoteEditor: the box a typed note is written in, over its own spot.
//
// Same font, size, colour and wrap width as the note will be painted with
// (lib/textnote.js), so what is typed is where it will stay. It saves when
// focus leaves it (a tap elsewhere) or on Ctrl/Cmd+Enter; Esc puts back what
// was there before. Emptying a note and leaving deletes it.
import React, { useEffect, useRef, useState } from 'react';
import { fontPx, TEXT_WIDTH } from '../lib/textnote.js';

export default function TextNoteEditor({ w, h, note, onCommit, onCancel }) {
  const [text, setText] = useState(note.text || '');
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);
  // Grow with the text, so nothing scrolls inside a note.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text, w, h]);

  const finish = (save) => {
    if (done.current) return;
    done.current = true;
    if (save) onCommit(text); else onCancel();
  };
  const px = fontPx(note, h);
  return (
    <textarea
      ref={ref}
      className="vmx-textnote-editor"
      aria-label="พิมพ์ข้อความบนหน้า กด Ctrl+Enter เพื่อบันทึก Esc เพื่อยกเลิก"
      value={text}
      rows={1}
      onChange={(e) => setText(e.target.value.slice(0, 2000))}
      onBlur={() => finish(true)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); }
        else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); finish(true); }
      }}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        left: note.points[0][0] * w,
        top: note.points[0][1] * h,
        width: Math.max(80, (note.w || TEXT_WIDTH) * w),
        fontSize: px,
        lineHeight: 1.45,
        color: note.color,
      }}
    />
  );
}
