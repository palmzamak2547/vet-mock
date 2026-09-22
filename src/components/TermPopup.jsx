// ============================================================
// TermPopup — AMBOSS-style mini definition card
// ============================================================
// Floating popover anchored next to a tapped glossary term inside a
// Q stem. Renders term + thai + defShort + defLong + a button to
// open all related Qs as a config-driven exam.
//
// Props:
//   entry        glossary entry object ({ term, thai, defShort, ... })
//   anchorRect   DOMRect of the clicked .vmx-term button (for placement)
//   onClose      ()              — Esc / outside-click / × button
//   onOpenRelated  (entry) => {} — "ข้อที่เกี่ยวข้อง N ข้อ" click
//   relatedCount   number        — count to show in the button label
//
// Placement: prefers above the anchor; flips below if not enough room.
// Always horizontally clamps to viewport so it never spills off-edge.
// Mobile-safe: max-width 360 px, 44 px close button, position:fixed
// so safe-area-inset works around iOS notch.
// ============================================================

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const CATEGORY_LABELS = {
  symptom: 'Symptom',
  disease: 'Disease',
  drug: 'Drug',
  'lab-value': 'Lab',
  anatomy: 'Anatomy',
  organism: 'Organism',
};

const POPUP_MAX_WIDTH = 360;
// Below this a card is a sliver, not something you can read — at that point
// it scrolls internally instead of shrinking further.
const MIN_READABLE_HEIGHT = 180;
const POPUP_MARGIN = 8;     // gap between anchor edge and popup
const VIEWPORT_PAD = 8;     // min distance from screen edges

export default function TermPopup({ entry, anchorRect, onClose, onOpenRelated, relatedCount = 0 }) {
  const popupRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, placement: 'above', ready: false });
  const [maxHeight, setMaxHeight] = useState(null);

  // ───── Esc close ─────
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

  // ───── Outside-click / scroll close ─────
  // mousedown/touchstart so we fire BEFORE any internal click handler.
  // Scroll close = parity with native popover UX (popup detached from
  // anchor when the page moves under it).
  useEffect(() => {
    const onDocDown = (e) => {
      if (!popupRef.current) return;
      if (popupRef.current.contains(e.target)) return;
      // Tapping another term must re-anchor the card to it. This handler used
      // to fire first and close, so the wrapper's click saw no open popup and
      // the "different term" path never ran — you had to tap twice.
      if (e.target?.closest?.('.vmx-term')) return;
      // If user tapped a DIFFERENT term button, the wrapper handler
      // will reopen the popup with the new entry — we don't try to
      // mediate that here, just close.
      onClose?.();
    };
    // Scrolling the page detaches the card from its anchor, so it closes.
    // Scrolling the card's OWN body must not — that is how a long entry is
    // read at all now that it has a height cap.
    const onScroll = (e) => {
      if (popupRef.current && e.target instanceof Node && popupRef.current.contains(e.target)) return;
      onClose?.();
    };
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('touchstart', onDocDown, { passive: true });
    // Capture-phase scroll listener so nested scroll containers also
    // trigger close. {passive:true} keeps scroll perf intact.
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('touchstart', onDocDown);
      window.removeEventListener('scroll', onScroll, { capture: true });
    };
  }, [onClose]);

  // ───── Smart placement ─────
  // useLayoutEffect runs before paint so the user never sees a flash
  // at (0,0). We measure the rendered popup, then compute viewport-
  // clamped position relative to the anchor rect.
  useLayoutEffect(() => {
    if (!popupRef.current || !anchorRect) return;
    const rect = popupRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Vertical. The old rule only asked which side was BIGGER, so on a
    // tablet a term near the top of the stem always flipped below — landing
    // squarely on options A-D, i.e. covering the question it was explaining
    // while the student was still reading it. Now the card is allowed to
    // shrink: whichever side it can fit in after capping its height wins,
    // and `above` is preferred because the answer options live below.
    const aboveGap = anchorRect.top - POPUP_MARGIN - VIEWPORT_PAD;
    const belowGap = vh - anchorRect.bottom - POPUP_MARGIN - VIEWPORT_PAD;
    // Above wins whenever there is a readable amount of room, even when
    // below has MORE room. Below is where the answer options are, and a
    // card that fits comfortably on top of the thing you are trying to
    // read is not a better card. Checked against the reported case: term
    // at y=263 on a 1080-tall tablet gives 247px above and ~700px below —
    // the old "pick the bigger side" rule chose below and landed on
    // options A to D.
    const placement = aboveGap >= MIN_READABLE_HEIGHT ? 'above' : 'below';
    const gap = placement === 'above' ? aboveGap : belowGap;
    const height = Math.min(rect.height, Math.max(gap, MIN_READABLE_HEIGHT));
    let top = placement === 'above'
      ? anchorRect.top - height - POPUP_MARGIN
      : anchorRect.bottom + POPUP_MARGIN;
    setMaxHeight(Math.max(MIN_READABLE_HEIGHT, Math.floor(gap)));

    // Horizontal: center on anchor, clamp to viewport.
    let left = anchorRect.left + anchorRect.width / 2 - rect.width / 2;
    left = Math.max(VIEWPORT_PAD, Math.min(left, vw - rect.width - VIEWPORT_PAD));
    // Final vertical clamp (popup taller than viewport edge case).
    top = Math.max(VIEWPORT_PAD, Math.min(top, vh - height - VIEWPORT_PAD));

    setPos({ top, left, placement, ready: true });
  }, [anchorRect, entry]);

  if (!entry) return null;

  const catLabel = CATEGORY_LABELS[entry.category] || entry.category || '';

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="false"
      aria-label={`Definition: ${entry.term}`}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        // Hidden first paint (placement calc pending) → no (0,0) flash.
        visibility: pos.ready ? 'visible' : 'hidden',
        maxWidth: POPUP_MAX_WIDTH,
        width: 'min(360px, calc(100vw - 16px))',
        // --clr-surface-1 does not exist; the fallback meant a hardcoded
        // white card under theme-aware ink, which in dark mode is cream
        // text on white at 1.24:1.
        background: 'var(--clr-surface)',
        color: 'var(--clr-ink, #111)',
        border: '1px solid var(--clr-border, rgba(0,0,0,0.12))',
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)',
        padding: '12px 14px 14px',
        zIndex: 9000,
        fontSize: 14,
        lineHeight: 1.5,
        // A long entry used to run off the bottom of the screen with no way
        // to reach the rest: the card had no height cap, and the one gesture
        // that could have revealed more — scrolling — closed it.
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
      }}
    >
      {/* Header: term + thai + close */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25, wordBreak: 'break-word' }}>{entry.term}</div>
          {entry.thai && entry.thai.toLowerCase() !== entry.term.toLowerCase() && (
            <div style={{ fontSize: 13, color: 'var(--clr-ink-soft, #666)', marginTop: 1 }}>{entry.thai}</div>
          )}
        </div>
        <button
          type="button"
          aria-label="ปิด"
          onClick={onClose}
          style={{
            minWidth: 44, minHeight: 44, width: 44, height: 44,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none',
            color: 'var(--clr-ink-soft, #888)',
            fontSize: 24, lineHeight: 1, cursor: 'pointer',
            padding: 0, margin: '-8px -8px 0 0',
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
            fontFamily: 'var(--vmx-mono)',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            padding: '2px 8px',
            borderRadius: 999,
            background: 'var(--clr-surface-2, rgba(0,0,0,0.06))',
            color: 'var(--clr-ink-soft, #555)',
          }}>{catLabel}</span>
        </div>
      )}

      {/* Short definition — emphasized */}
      {entry.defShort && (
        <div style={{ marginBottom: entry.defLong ? 8 : 10, fontWeight: 600, lineHeight: 1.45 }}>
          {entry.defShort}
        </div>
      )}

      {/* Long definition — fuller clinical context */}
      {entry.defLong && (
        <div style={{
          marginBottom: 10,
          fontSize: 13,
          lineHeight: 1.55,
          color: 'var(--clr-ink-soft, #444)',
        }}>
          {entry.defLong}
        </div>
      )}

      {/* Related Qs CTA */}
      {relatedCount > 0 && (
        <div style={{ borderTop: '1px solid var(--clr-border, rgba(0,0,0,0.08))', paddingTop: 10 }}>
          <button
            type="button"
            onClick={() => onOpenRelated?.(entry)}
            style={{
              all: 'unset',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              minHeight: 36,
              background: 'var(--clr-gold)',
              color: 'var(--clr-gold-on)',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ข้อที่เกี่ยวข้อง {relatedCount} ข้อ
          </button>
        </div>
      )}
    </div>
  );
}
