// ============================================================
// ConfirmDialog — the app's own confirm, replacing window.confirm()
// ============================================================
// An OS dialog ignores the cream/sage theme, can't explain consequences in
// more than one line, and on mobile reads as a browser warning rather than
// part of the app. This is the shared primitive the critical flows use
// instead (exit exam, discard an in-flight session, destructive resets).
//
// Reuses the existing .vmx-modal-overlay / .vmx-modal shell so it matches
// the NavGrid + submit-confirm dialogs already in the exam. Behaviour:
// Esc cancels, backdrop click cancels, the confirm button takes focus, and
// `tone="danger"` colours the confirm for irreversible actions.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { useModalFocus } from '../hooks/useModalFocus.js';

export default function ConfirmDialog({
  open,
  title,
  body,
  note,
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  tone = 'default',
  // A notice has nothing to cancel — one button, and Esc/backdrop dismiss it.
  hideCancel = false,
  // Ask for a line of text instead of a yes/no. onConfirm receives the value.
  input = null,          // { placeholder?, maxLength?, multiline?, initial? }
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);
  const inputRef = useRef(null);
  const [value, setValue] = useState(input?.initial || '');
  const dialogRef = useModalFocus({
    active: open,
    onClose: onCancel,
    initialFocusRef: input ? inputRef : confirmRef,
  });

  // A fresh open starts from the caller's initial value, not the last answer.
  useEffect(() => { if (open) setValue(input?.initial || ''); }, [open, input]);

  if (!open) return null;

  const titleId = 'vmx-confirm-title';
  return (
    <div className="vmx-modal-overlay" onClick={onCancel}>
      <div
        ref={dialogRef}
        className="vmx-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 420 }}
        tabIndex={-1}
        data-vmx-modal="true"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} style={{ margin: '0 0 8px' }}>{title}</h2>
        {body && (
          <p style={{ margin: '0 0 6px', color: 'var(--clr-ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
            {body}
          </p>
        )}
        {note && (
          <p style={{ margin: '0 0 4px', color: 'var(--clr-rose-text)', fontSize: 13.5, fontWeight: 600, lineHeight: 1.6 }}>
            {note}
          </p>
        )}
        {input && (
          input.multiline ? (
            <textarea
              ref={inputRef}
              aria-label={input.label || input.placeholder || 'รายละเอียด'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={input.maxLength || 500}
              placeholder={input.placeholder || ''}
              rows={3}
              style={{ width: '100%', marginTop: 10, boxSizing: 'border-box', fontFamily: 'inherit', fontSize: 14 }}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              aria-label={input.label || input.placeholder || 'รายละเอียด'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onConfirm?.(value); } }}
              maxLength={input.maxLength || 200}
              placeholder={input.placeholder || ''}
              style={{ width: '100%', marginTop: 10, boxSizing: 'border-box', minHeight: 44, fontFamily: 'inherit', fontSize: 14 }}
            />
          )
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <button
            ref={confirmRef}
            type="button"
            className={`vmx-btn ${tone === 'danger' ? 'vmx-btn-danger' : 'vmx-btn-primary'}`}
            onClick={() => onConfirm?.(input ? value : true)}
            style={{ flex: '1 1 140px' }}
          >
            {confirmLabel}
          </button>
          {!hideCancel && (
            <button
              type="button"
              className="vmx-btn vmx-btn-ghost"
              onClick={onCancel}
              style={{ flex: '1 1 140px' }}
            >
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
