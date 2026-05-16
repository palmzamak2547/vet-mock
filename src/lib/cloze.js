// ============================================================
// cloze.js — Anki-style cloze deletion parser.
// ============================================================
// Pure functions. No localStorage, no React. Storage is handled
// by user-flashcards.js (cloze cards live alongside manual
// flashcards in the same `vmx-user-flashcards` array, distinct
// only by `type: 'cloze'` and ID range 75000–79999).
//
// Cloze syntax:
//   "RER = 30 × {{c1::BW}} + {{c2::70}}"
//
//   • One cloze mark per `{{cN::...}}` group, where N is a 1-99
//     index. Multiple marks with the SAME N collapse into one
//     card that hides all of them simultaneously (Anki behaviour).
//   • Different N values create separate cards. The example above
//     yields 2 cards (one hides BW, one hides 70).
//   • The visible "answer" on the back is the inner text; the
//     hidden front is a pill `[_____]`.
//
// Regex notes:
//   • Pattern: /\{\{c(\d+)::((?:[^{}]|\{(?!\{)|\}(?!\}))*)\}\}/g
//     Allows single { or } inside the payload (e.g. LaTeX-ish
//     content) but NOT nested {{...}} — those would be ambiguous
//     and Anki-incompat anyway. If user types nested clozes we
//     match the OUTER one only (regex is greedy-up-to-}}; nested
//     inner clozes simply become literal payload text).
//   • Unbalanced braces (`{{c1::foo` with no closing `}}`) are
//     treated as plain text → hasCloze=false → editor blocks save.
//
// REPL smoke tests (paste into a browser console once cloze.js
// is bundled — or run via `node --input-type=module`):
//
//   parseCloze("RER = 30 × {{c1::BW}} + {{c2::70}}")
//     // → { hasCloze: true, clozeIndices: [1, 2], rawText: "RER = …" }
//
//   parseCloze("ไม่มี cloze เลย")
//     // → { hasCloze: false, clozeIndices: [], rawText: "ไม่มี cloze เลย" }
//
//   expandCloze("RER = 30 × {{c1::BW}} + {{c2::70}}", 1)
//     // → { front: "RER = 30 × [_____] + 70", back: "RER = 30 × BW + 70" }
//
//   splitClozes("Heart sounds: S1 ({{c1::AV close}}) and S2 ({{c1::semilunar close}})")
//     // → 1 entry (both marks share c1) — front hides BOTH, back reveals both
//
//   splitClozes("Unclosed {{c1::oops")
//     // → []  (hasCloze false → no cards)
// ============================================================

// Match `{{cN::payload}}` where payload can contain single { or }
// but not the literal `{{` or `}}` token (would break parsing).
// Capture group 1 = index digits, group 2 = payload text.
const CLOZE_RE = /\{\{c(\d+)::((?:[^{}]|\{(?!\{)|\}(?!\}))*)\}\}/g;

const BLANK = '[_____]';

/**
 * Scan text for `{{cN::...}}` marks.
 *
 * @param {string} text
 * @returns {{ hasCloze: boolean, clozeIndices: number[], rawText: string }}
 *   clozeIndices is sorted ascending and de-duplicated.
 */
export function parseCloze(text) {
  const raw = typeof text === 'string' ? text : '';
  const trimmed = raw.replace(/\s+$/g, ''); // strip trailing whitespace
  if (!trimmed) {
    return { hasCloze: false, clozeIndices: [], rawText: raw };
  }
  const seen = new Set();
  // Reset regex state — globals are stateful across calls.
  CLOZE_RE.lastIndex = 0;
  let m;
  while ((m = CLOZE_RE.exec(trimmed)) !== null) {
    const n = Number.parseInt(m[1], 10);
    if (Number.isFinite(n) && n > 0 && n < 1000) seen.add(n);
    // Defensive: avoid zero-width infinite loops
    if (m.index === CLOZE_RE.lastIndex) CLOZE_RE.lastIndex += 1;
  }
  CLOZE_RE.lastIndex = 0;
  const indices = Array.from(seen).sort((a, b) => a - b);
  return {
    hasCloze: indices.length > 0,
    clozeIndices: indices,
    rawText: raw,
  };
}

/**
 * Render front+back for a SINGLE cloze index.
 *
 *   • front: replace every `{{c<idx>::X}}` with `[_____]` pill marker,
 *            replace every `{{cN::X}}` (N≠idx) with its inner text.
 *   • back:  replace every `{{cN::X}}` (any N) with its inner text.
 *
 * @param {string} text
 * @param {number} idx
 * @returns {{ front: string, back: string }}
 */
export function expandCloze(text, idx) {
  const raw = typeof text === 'string' ? text : '';
  const target = Number.parseInt(idx, 10);
  // Build front
  const front = raw.replace(CLOZE_RE, (_full, nStr, payload) => {
    const n = Number.parseInt(nStr, 10);
    return n === target ? BLANK : payload;
  });
  CLOZE_RE.lastIndex = 0;
  // Build back (reveal everything as plain text)
  const back = raw.replace(CLOZE_RE, (_full, _nStr, payload) => payload);
  CLOZE_RE.lastIndex = 0;
  return { front, back };
}

/**
 * Reveal-all renderer — used by the back face to draw highlighted
 * answer text. Same as expandCloze().back but kept as its own export
 * so callers' intent is obvious.
 *
 * @param {string} text
 * @returns {string}
 */
export function stripClozeMarks(text) {
  const raw = typeof text === 'string' ? text : '';
  const out = raw.replace(CLOZE_RE, (_full, _nStr, payload) => payload);
  CLOZE_RE.lastIndex = 0;
  return out;
}

/**
 * Generate one renderable entry per unique cloze index found in `text`.
 * Returns [] if no marks are present (or text is empty).
 *
 * @param {string} text
 * @returns {Array<{ idx: number, front: string, back: string, fullText: string }>}
 */
export function splitClozes(text) {
  const { hasCloze, clozeIndices, rawText } = parseCloze(text);
  if (!hasCloze) return [];
  return clozeIndices.map((idx) => {
    const { front, back } = expandCloze(rawText, idx);
    return { idx, front, back, fullText: rawText };
  });
}

/**
 * Highest cN currently in the text (0 if none) — used by the
 * editor toolbar to auto-pick the NEXT index when wrapping a
 * fresh selection. Anki convention: each new wrap gets a new
 * index unless the user explicitly re-uses one.
 *
 * @param {string} text
 * @returns {number}
 */
export function maxClozeIndex(text) {
  const { clozeIndices } = parseCloze(text);
  if (!clozeIndices.length) return 0;
  return clozeIndices[clozeIndices.length - 1];
}

export const CLOZE_BLANK = BLANK;
