// ============================================================
// HighlightToCard — "✨ ทำ flashcard" from a text selection
//   inside SummaryModal (.vmx-summary-body).
//
// Flow:
//   1. User selects ≥10 chars inside .vmx-summary-body
//   2. selectionchange (debounced 200ms) checks length + ancestry
//   3. Floating button appears near the selection rect
//   4. Click → modal with editable front + empty back + subject
//   5. Save → saveUserFlashcard() + toast → modal + button hide
//
// Cross-platform:
//   • selectionchange (not mouseup) → works for iOS long-press
//   • position: fixed + getBoundingClientRect of range
//   • min-width/height 44px (Apple HIG)
//   • touch-action: manipulation + transparent tap-highlight
//   • Modal uses safe-area-inset-bottom + 100dvh
//   • Mounts as a portal-less top-level component (no props)
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { SUBJECTS } from '../data/curriculum.js';
import { saveUserFlashcard } from '../lib/user-flashcards.js';
import ClozeEditor from './ClozeEditor.jsx';
import { useModalFocus } from '../hooks/useModalFocus.js';

const MIN_CHARS = 10;
const DEBOUNCE_MS = 200;

function getSelectionInfo() {
  if (typeof window === 'undefined') return null;
  const sel = window.getSelection?.();
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
  const text = sel.toString().trim();
  if (text.length < MIN_CHARS) return null;
  // Anchor must live inside a .vmx-summary-body container
  const node = sel.anchorNode;
  if (!node) return null;
  const el = node.nodeType === 1 ? node : node.parentElement;
  if (!el || !el.closest?.('.vmx-summary-body')) return null;
  let rect = null;
  try {
    const range = sel.getRangeAt(0);
    rect = range.getBoundingClientRect();
  } catch {
    return null;
  }
  if (!rect || (rect.width === 0 && rect.height === 0)) return null;
  return { text, rect };
}

function Toast({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: `calc(28px + env(safe-area-inset-bottom, 0px))`,
        transform: 'translateX(-50%)',
        background: 'rgba(28, 32, 28, 0.92)',
        color: '#fff',
        padding: '10px 18px',
        borderRadius: 999,
        fontSize: 14,
        fontWeight: 600,
        boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
        zIndex: 2000,
        pointerEvents: 'none',
        maxWidth: 'min(420px, 92vw)',
        textAlign: 'center',
      }}
    >
      {message}
    </div>
  );
}

export default function HighlightToCard() {
  const [anchor, setAnchor] = useState(null); // { text, rect } | null
  const [modalOpen, setModalOpen] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [subject, setSubject] = useState('');
  const [toast, setToast] = useState('');
  // 'manual' = existing front/back flashcard, 'cloze' = Anki-style cloze deletion
  const [mode, setMode] = useState('manual');

  const debounceRef = useRef(null);
  const backRef = useRef(null);
  const toastTimer = useRef(null);
  const dialogRef = useModalFocus({ active: modalOpen, onClose: closeModal, initialFocusRef: backRef });

  // Subject options (drop "all" — flashcard belongs to a specific subject or none)
  const subjectOptions = useMemo(
    () => SUBJECTS.filter((s) => s.id !== 'all'),
    [],
  );

  // Listen to selection changes (debounced). Doesn't run while modal is open.
  useEffect(() => {
    if (modalOpen) return undefined;
    const onSelChange = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const info = getSelectionInfo();
        setAnchor(info);
      }, DEBOUNCE_MS);
    };
    document.addEventListener('selectionchange', onSelChange);
    // Also clear the floating button when the SummaryModal scrolls
    // (rect would otherwise stick to an outdated position).
    const onScroll = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const info = getSelectionInfo();
        setAnchor(info);
      }, DEBOUNCE_MS);
    };
    document.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('selectionchange', onSelChange);
      document.removeEventListener('scroll', onScroll, true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [modalOpen]);

  // Outside-click dismisses the floating button
  useEffect(() => {
    if (!anchor || modalOpen) return undefined;
    const onPointerDown = (e) => {
      // Don't dismiss when clicking the button itself
      if (e.target?.closest?.('[data-vmx-highlight-btn]')) return;
      // Selection getting cleared elsewhere will be picked up by
      // selectionchange anyway — but proactively clear so taps
      // outside the highlight feel responsive.
      setTimeout(() => {
        const info = getSelectionInfo();
        if (!info) setAnchor(null);
      }, 0);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [anchor, modalOpen]);

  // Autofocus the back textarea when modal opens (manual mode only —
  // ClozeEditor handles its own focus).
  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return undefined;
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [toast]);

  function openModal() {
    if (!anchor) return;
    setFront(anchor.text);
    setBack('');
    setSubject('');
    setMode('manual');
    setModalOpen(true);
    // Clear the floating button — modal owns the flow now
    setAnchor(null);
  }

  function closeModal() {
    setModalOpen(false);
    setFront('');
    setBack('');
    setSubject('');
    setMode('manual');
  }

  function handleClozeSaved(cards) {
    const n = Array.isArray(cards) ? cards.length : 0;
    setToast(n > 1 ? `✓ เพิ่ม ${n} cloze cards แล้ว` : '✓ เพิ่ม cloze card แล้ว');
    closeModal();
  }

  function handleSave() {
    const trimmedFront = (front || '').trim();
    if (!trimmedFront) return;
    saveUserFlashcard({
      front: trimmedFront,
      back: (back || '').trim(),
      subject: subject || null,
      source: 'summary-highlight',
    });
    setToast('✓ เพิ่ม flashcard แล้ว');
    closeModal();
  }

  // ── Floating button position ──────────────────────────────────
  // Place above the selection when there's room, below otherwise.
  // Clamp horizontally inside viewport.
  let buttonStyle = null;
  if (anchor && !modalOpen) {
    const { rect } = anchor;
    const BTN_W = 156;
    const BTN_H = 44;
    const MARGIN = 8;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    let top = rect.top - BTN_H - MARGIN;
    if (top < MARGIN) top = Math.min(rect.bottom + MARGIN, vh - BTN_H - MARGIN);
    let left = rect.left + rect.width / 2 - BTN_W / 2;
    if (left < MARGIN) left = MARGIN;
    if (left + BTN_W > vw - MARGIN) left = vw - BTN_W - MARGIN;
    buttonStyle = {
      position: 'fixed',
      top: `${Math.max(MARGIN, top)}px`,
      left: `${left}px`,
      minWidth: BTN_W,
      minHeight: BTN_H,
      padding: '8px 14px',
      borderRadius: 999,
      border: '1px solid var(--clr-border, rgba(0,0,0,0.12))',
      background: 'var(--clr-surface, #fff)',
      color: 'var(--clr-ink, #1d201d)',
      fontSize: 14,
      fontWeight: 600,
      boxShadow: '0 8px 24px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.08)',
      cursor: 'pointer',
      zIndex: 1500,
      touchAction: 'manipulation',
      WebkitTapHighlightColor: 'transparent',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    };
  }

  return (
    <>
      {anchor && !modalOpen && (
        <button
          type="button"
          data-vmx-highlight-btn
          onMouseDown={(e) => e.preventDefault() /* don't kill the selection */}
          onTouchStart={(e) => { /* keep selection on iOS */ e.stopPropagation(); }}
          onClick={openModal}
          style={buttonStyle}
          aria-label="ทำ flashcard จากข้อความที่เลือก"
        >
          ทำ flashcard
        </button>
      )}

      {modalOpen && (
        <div
          className="vmx-modal-overlay"
          onClick={closeModal}
          style={{ zIndex: 1600 }}
        >
          <div
            ref={dialogRef}
            className="vmx-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 540,
              width: '100%',
              maxHeight: 'min(90vh, calc(100dvh - 24px))',
              paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vmx-highlight-card-title"
            tabIndex={-1}
            data-vmx-modal="true"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 id="vmx-highlight-card-title" style={{ margin: 0, flex: 1, fontSize: 20 }}>ทำ flashcard</h2>
              <button
                type="button"
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                onClick={closeModal}
                title="ปิด (Esc)"
                aria-label="ปิดหน้าต่างทำ flashcard"
                style={{ fontSize: 18, padding: '4px 10px' }}
              >
                ✕
              </button>
            </div>

            {/* Mode tabs — manual vs cloze */}
            <div
              role="tablist"
              aria-label="ประเภท flashcard"
              style={{
                display: 'flex',
                gap: 6,
                padding: 4,
                borderRadius: 10,
                background: 'var(--clr-surface-2, #f7f6f1)',
                border: '1px solid var(--clr-border)',
              }}
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'manual'}
                onClick={() => setMode('manual')}
                className={`vmx-btn vmx-btn-sm ${mode === 'manual' ? 'vmx-btn-primary' : 'vmx-btn-ghost'}`}
                style={{ flex: 1, minHeight: 36, fontWeight: 600 }}
              >
                ✍️ Manual back
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'cloze'}
                onClick={() => setMode('cloze')}
                className={`vmx-btn vmx-btn-sm ${mode === 'cloze' ? 'vmx-btn-primary' : 'vmx-btn-ghost'}`}
                style={{ flex: 1, minHeight: 36, fontWeight: 600 }}
              >
                Cloze deletion
              </button>
            </div>

            {mode === 'manual' && (
              <>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-ink)' }}>
                    ด้านหน้า (คำถาม)
                  </span>
                  <textarea
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid var(--clr-border)',
                      background: 'var(--clr-surface-2, #f7f6f1)',
                      color: 'var(--clr-ink)',
                      fontSize: 15,
                      fontFamily: 'inherit',
                      lineHeight: 1.5,
                      resize: 'vertical',
                      minHeight: 60,
                      boxSizing: 'border-box',
                    }}
                  />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-ink)' }}>
                    ด้านหลัง (คำตอบ)
                  </span>
                  <textarea
                    ref={backRef}
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    rows={4}
                    placeholder="พิมพ์คำตอบ / คำอธิบายที่อยากจำ…"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid var(--clr-border)',
                      background: 'var(--clr-surface-2, #f7f6f1)',
                      color: 'var(--clr-ink)',
                      fontSize: 15,
                      fontFamily: 'inherit',
                      lineHeight: 1.5,
                      resize: 'vertical',
                      minHeight: 80,
                      boxSizing: 'border-box',
                    }}
                  />
                </label>

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

                <div className="vmx-btn-row" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                  <button
                    type="button"
                    className="vmx-btn vmx-btn-ghost"
                    onClick={closeModal}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    className="vmx-btn vmx-btn-primary"
                    onClick={handleSave}
                    disabled={!front.trim()}
                    style={{ opacity: front.trim() ? 1 : 0.55 }}
                  >
                    บันทึก
                  </button>
                </div>
              </>
            )}

            {mode === 'cloze' && (
              <ClozeEditor
                initialText={front}
                subject={subject}
                onSave={handleClozeSaved}
                onCancel={closeModal}
              />
            )}
          </div>
        </div>
      )}

      {toast && <Toast message={toast} />}
    </>
  );
}
