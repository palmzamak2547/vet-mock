// ============================================================
// wrap-progress.js — where the student is among a wrap-up's items
// ============================================================
// The page is one long read of 28 items or more. The sticky index says
// "5 จาก 28" and marks item 5, so a student who looks up knows how far they
// are and how much is left. An IntersectionObserver (in the view) reports
// which items sit in a reading band under the sticky bar; this picks the one
// the student is on. No scroll listener: the observer fires only when an item
// crosses the band, never per frame.
// ============================================================

/** The band an item must cross to be "the one being read": just under the
 *  sticky index (56 px, the items' scroll-margin, plus a little) down to the
 *  upper half of the screen. */
export const READING_BAND = '-64px 0px -55% 0px';

/**
 * The item being read: the first of those in the band (the one whose end the
 * student has not yet passed), or, when none is in it (the page's top, or a
 * gap between two items), the one read last.
 */
export function currentItem(inBand, last = 0) {
  let first = null;
  for (const n of inBand) if (Number.isInteger(n) && n >= 0 && (first === null || n < first)) first = n;
  return first === null ? last : first;
}

/** "5 จาก 28", counted from one. */
export function progressLabel(index, total) {
  if (!total) return '';
  const n = Math.min(Math.max(index, 0), total - 1) + 1;
  return `${n} จาก ${total}`;
}
