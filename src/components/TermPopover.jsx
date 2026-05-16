// ============================================================
// TermPopover — floating mini-card for a glossary term
// ============================================================
// AMBOSS-style popup that appears next to a tapped term in a Q stem.
// - Shows term (EN canonical), Thai gloss, category badge, definition
// - "Related: termA · termB" chips re-open the popover with that
//   term's entry (in-popover nav, NO modal stack — one popover at a
//   time)
// - Closes on Esc, click-outside, or × button
// - Positioned relative to anchorRect with viewport clamping. Prefers
//   above the anchor; flips below if not enough room. Always clamps
//   horizontally so it never spills off the screen edge.
// - Mobile-friendly: max-width 360 px, ≥44 px close button
// ============================================================

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { findGlossaryEntry } from '../data/glossary.js';

const CATEGORY_LABELS = {
  renal: 'Renal',
  cardiac: 'Cardiac',
  endocrine: 'Endo',
  neuro: 'Neuro',
  repro: 'Repro',
  infectious: 'Infect',
  pharm: 'Pharm',
  surgery: 'Surgery',
};

const POPOVER_MAX_WIDTH = 360;
const POPOVER_MARGIN = 8; // gap between anchor and popover
const VIEWPORT_PADDING = 8; // min distance from screen edges

export default function TermPopover({ entry: initialEntry, anchorRect, onClose }) {
  const [entry, setEntry] = useState(initialEntry);
  const popoverRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, placement: 'below' });

  // Re-sync if the parent passes a fresh entry (e.g. user taps a
  // different term while popover is open — single-popover policy)
  useEffect(() => { setEntry(initialEntry); }, [initialEntry]);

  // Esc closes
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Click-outside closes (mousedown so it fires before any inside-
  // click handlers; on iOS, touchstart parallels mousedown via the
  // synthetic event chain)
  useEffect(() => {
    const onDocDown = (e) => {
      if (!popoverRef.current) return;
      if (popoverRef.current.contains(e.target)) return;
      onClose?.();
    };
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('touchstart', onDocDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('touchstart', onDocDown);
    };
  }, [onClose]);

  // Compute position after layout (we need the popover's actual size
  // to flip correctly). useLayoutEffect runs before paint so the user
  // never sees a flash at (0,0).
  useLayoutEffect(() => {
    if (!popoverRef.current || !anchorRect) return;
    const rect = popoverRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Vertical: prefer above, flip below if not enough room
    const spaceAbove = anchorRect.top;
    const spaceBelow = vh - anchorRect.bottom;
    let placement = 'above';
    let top;
    if (spaceAbove >= rect.height + POPOVER_MARGIN + VIEWPORT_PADDING) {
      top = anchorRect.top - rect.height - POPOVER_MARGIN;
    } else if (spaceBelow >= rect.height + POPOVER_MARGIN + VIEWPORT_PADDING) {
      placement = 'below';
      top = anchorRect.bottom + POPOVER_MARGIN;
    } else {
      // Neither fits comfortably — pick the larger and clamp
      placement = spaceBelow > spaceAbove ? 'below' : 'above';
      top = placement === 'below'
        ? anchorRect.bottom + POPOVER_MARGIN
        : Math.max(VIEWPORT_PADDING, anchorRect.top - rect.height - POPOVER_MARGIN);
    }

    // Horizontal: center on anchor, clamp to viewport
    let left = anchorRect.left + anchorRect.width / 2 - rect.width / 2;
    left = Math.max(VIEWPORT_PADDING, Math.min(left, vw - rect.width - VIEWPORT_PADDING));

    // Final vertical clamp (in case the popover is taller than viewport)
    top = Math.max(VIEWPORT_PADDING, Math.min(top, vh - rect.height - VIEWPORT_PADDING));

    setPos({ top, left, placement });
  }, [anchorRect, entry]);

  // Click a related-term chip → navigate popover content (no new modal)
  const onRelatedClick = useCallback((key) => {
    const next = findGlossaryEntry(key);
    if (next) setEntry(next);
  }, []);

  if (!entry) return null;

  const catLabel = CATEGORY_LABELS[entry.category] || entry.category;
  const relatedEntries = (entry.related || [])
    .map((k) => findGlossaryEntry(k))
    .filter(Boolean);

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label={`Definition: ${entry.key}`}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        maxWidth: POPOVER_MAX_WIDTH,
        width: 'min(360px, calc(100vw - 16px))',
        background: 'var(--clr-surface-1, #fff)',
        color: 'var(--clr-ink, #111)',
        border: '1px solid var(--clr-border, rgba(0,0,0,0.12))',
        borderRadius: 10,
        boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
        padding: '12px 14px 14px',
        zIndex: 9000,
        fontSize: 14,
        lineHeight: 1.45,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Header — term + close */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25 }}>{entry.key}</div>
          {entry.th && entry.th.toLowerCase() !== entry.key.toLowerCase() && (
            <div style={{ fontSize: 13, color: 'var(--clr-ink-soft, #555)' }}>{entry.th}</div>
          )}
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            minWidth: 44,
            minHeight: 44,
            width: 44,
            height: 44,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: 'var(--clr-ink-soft, #777)',
            fontSize: 22,
            lineHeight: 1,
            cursor: 'pointer',
            padding: 0,
            margin: '-8px -8px 0 0',
            borderRadius: 6,
          }}
        >
          ×
        </button>
      </div>

      {/* Category badge */}
      {catLabel && (
        <div style={{ marginBottom: 8 }}>
          <span style={{
            display: 'inline-block',
            fontSize: 11,
            fontFamily: 'JetBrains Mono, monospace',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            padding: '2px 8px',
            borderRadius: 999,
            background: 'var(--clr-surface-2, rgba(0,0,0,0.06))',
            color: 'var(--clr-ink-soft, #555)',
          }}>{catLabel}</span>
        </div>
      )}

      {/* Definition */}
      <div style={{ marginBottom: relatedEntries.length ? 10 : 0 }}>{entry.def}</div>

      {/* Related terms */}
      {relatedEntries.length > 0 && (
        <div style={{ borderTop: '1px solid var(--clr-border, rgba(0,0,0,0.08))', paddingTop: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--clr-ink-soft, #888)', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 0.5 }}>Related</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {relatedEntries.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => onRelatedClick(r.key)}
                style={{
                  background: 'var(--clr-surface-2, rgba(0,0,0,0.04))',
                  border: '1px solid var(--clr-border, rgba(0,0,0,0.1))',
                  borderRadius: 999,
                  padding: '3px 10px',
                  fontSize: 12,
                  color: 'inherit',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  minHeight: 28,
                }}
              >
                {r.key}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
