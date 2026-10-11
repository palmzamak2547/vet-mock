// ============================================================
// reading-layout.js — shared decisions for the reading surfaces
// ============================================================
// The library, VetWiki, clips and notes all list one curriculum by year, and
// all of them were built wide first: on a phone each opened on whichever
// year sorted first and expanded every group, so the student's own year sat
// screens below the fold (owner review 2026-10-12: phone 4/10, iPad 8/10).
// These are the small, testable rules they now share.
// ============================================================

/** Narrow enough that groups start folded: phones, not the iPad. */
export const COMPACT_READING_QUERY = '(max-width: 640px)';

/** Whether this screen starts groups folded. False without a window (tests, SSR). */
export function prefersCompactReading(win = typeof window !== 'undefined' ? window : null) {
  try {
    return !!win?.matchMedia?.(COMPACT_READING_QUERY).matches;
  } catch {
    return false;
  }
}

/**
 * The reader's own year first, everything else in its original order. A
 * stable partition, not a sort: the curriculum's order inside each part is
 * the order the faculty teaches in, and a missing year changes nothing.
 */
export function ownYearFirst(items, yearOf, selectedYear) {
  if (selectedYear == null) return items.slice();
  const own = [];
  const rest = [];
  for (const item of items) (yearOf(item) === selectedYear ? own : rest).push(item);
  return own.length === 0 ? items.slice() : [...own, ...rest];
}

// Catalogue descriptions that only restate the document kind in another
// language: 241 slide decks say "Lecture Slides" under a "สไลด์" label and
// handouts say "Supplementary Materials". The row is unchanged; the card
// simply does not print the same fact twice.
const KIND_ECHOES = {
  slide: ['lecture slides', 'lecture slide', 'slides', 'slide'],
  handout: ['supplementary materials', 'supplementary material', 'handout', 'handouts'],
  textbook: ['textbook', 'textbooks'],
  summary: ['summary'],
};

/**
 * The description worth showing on a card, or null when it only echoes the
 * kind, in English or in the kind label the card already shows (handouts
 * described as "เอกสารประกอบ" under an "เอกสารประกอบ" label).
 */
export function cardDescription(doc, kindText = '') {
  const text = typeof doc?.description === 'string' ? doc.description.trim() : '';
  if (!text) return null;
  const lower = text.toLowerCase();
  const echoes = KIND_ECHOES[doc.kind] || [];
  if (echoes.includes(lower)) return null;
  return kindText && lower === String(kindText).trim().toLowerCase() ? null : text;
}

/**
 * The year the reader picked in the header, read the way App stores it (a
 * JSON number, or 'null' before a pick). Views that App does not hand the
 * year to (VetWiki's index) read it here; null means "not picked".
 */
export function storedSelectedYear(storage = typeof window !== 'undefined' ? window.localStorage : null) {
  try {
    const value = JSON.parse(storage?.getItem('vmx-selected-year') ?? 'null');
    const year = typeof value === 'string' ? Number(value) : value;
    return Number.isInteger(year) && year > 0 ? year : null;
  } catch {
    return null;
  }
}
