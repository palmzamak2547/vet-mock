// ============================================================
// useDropdownAnchor — viewport-aware dropdown side picker
// ============================================================
// Centralizes the logic that picks whether a popover should
// anchor LEFT (extend rightward from trigger) or RIGHT (extend
// leftward) based on the trigger's position in the viewport.
//
// Why: Palm bug 2026-05-24 — ThemePicker dropdown was hardcoded
// to `right: 0` (extends leftward). On mobile the theme button
// sits at x=16 from the left viewport edge, so the 220px dropdown
// extended ~160 px off-screen. Same pattern repeated in UserMenu,
// XpChip, and ToolsFAB.
//
// This hook is the single source of truth: whenever we add a new
// trigger-anchored popover, call this hook instead of hardcoding
// `right: 0`. Future enhancement: vertical flip (above vs below)
// when below would overflow the viewport bottom.
//
// Usage:
//   const wrapRef = useRef(null);
//   const anchorSide = useDropdownAnchor(wrapRef, open, 220);
//   ...
//   <div ref={wrapRef} style={{ position: 'relative' }}>
//     <button>...</button>
//     {open && <div style={{
//       position: 'absolute', top: 'calc(100% + 6px)',
//       ...(anchorSide === 'left' ? { left: 0 } : { right: 0 }),
//       maxWidth: 'calc(100vw - 24px)', // viewport safety net
//     }}>
//   </div>
// ============================================================

import { useState, useEffect } from 'react';

const SIDE_GUTTER = 12;

/**
 * Pick the popover anchor side based on trigger position.
 * @param {React.RefObject<HTMLElement>} wrapRef - the wrapper element ref
 * @param {boolean} open - whether the popover is open (gates re-compute)
 * @param {number} dropdownMinWidth - the popover's min-width in CSS px
 * @returns {'left' | 'right'} - the side to anchor the popover
 */
export function useDropdownAnchor(wrapRef, open, dropdownMinWidth) {
  const [anchorSide, setAnchorSide] = useState('right');
  useEffect(() => {
    if (!open || !wrapRef.current) return;
    const recomputeSide = () => {
      const btnR = wrapRef.current?.getBoundingClientRect();
      if (!btnR) return;
      const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
      // Anchoring right: dropdown left edge = btnR.right - dropdownMinWidth
      // If that lands past SIDE_GUTTER off the left edge, switch to left anchor.
      if (btnR.right - dropdownMinWidth < SIDE_GUTTER) {
        setAnchorSide('left');
      } else if (btnR.left + dropdownMinWidth > vw - SIDE_GUTTER) {
        // Anchoring left would push past the right edge — keep right anchor.
        setAnchorSide('right');
      } else {
        // Both sides fit — prefer right (matches the historic look on desktop).
        setAnchorSide('right');
      }
    };
    recomputeSide();
    window.addEventListener('resize', recomputeSide);
    return () => window.removeEventListener('resize', recomputeSide);
  }, [open, dropdownMinWidth, wrapRef]);
  return anchorSide;
}
