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

import { useEffect, useRef } from 'react';

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
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onCancel?.(); }
    };
    document.addEventListener('keydown', onKey);
    // Focus the confirm so keyboard users can act immediately; the exam's
    // global shortcuts already stand down while a .vmx-modal-overlay is open.
    confirmRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const titleId = 'vmx-confirm-title';
  return (
    <div className="vmx-modal-overlay" onClick={onCancel}>
      <div
        className="vmx-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 420 }}
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
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <button
            ref={confirmRef}
            type="button"
            className={`vmx-btn ${tone === 'danger' ? 'vmx-btn-danger' : 'vmx-btn-primary'}`}
            onClick={onConfirm}
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
