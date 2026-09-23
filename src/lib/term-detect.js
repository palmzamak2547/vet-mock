// ============================================================
// term-detect.js — scan text for glossary terms
// ============================================================
// Pure helper for TermLinkedRichText. Builds a master regex once at
// module load (longest-first alternation) and uses non-overlapping
// matches to enumerate every glossary hit in a string.
//
// Design notes:
// 1. Longest-first sort prevents partial swallow: "USG" won't match
//    inside "USGcost", and "ACE inhibitor" (15 chars) wins over a
//    bare "ACE" (3 chars) when both could fit.
// 2. Word boundary WITHOUT lookbehind. The repo ships to `ios >= 14`
//    (package.json browserslist, STABILITY.md rule 7) and lookbehind
//    only landed in Safari 16.4 — a module-scope RegExp using it
//    throws while the module is evaluating, which takes the whole
//    question stem down with it on those phones. So the boundary is a
//    captured leading character that we subtract back off the match
//    offset. Thai characters count as boundaries, which is what the
//    bilingual stems need: "ค่า BUN สูง" still matches.
// 3. A match is only a hit if the glossary can resolve it FOR THIS
//    SUBJECT. IBD is inflammatory bowel disease in small animal and
//    infectious bursal disease in poultry; an unresolvable term is
//    left as plain text rather than defined wrongly.
// ============================================================

import {
  resolveGlossaryEntry,
  getAllDetectableTerms,
} from '../data/glossary.js';

const MIN_TERM_LEN = 3; // two letters are never unambiguous enough to auto-open
// Measured, not assumed: in this bank PD is polydipsia in small animal and
// pregnancy diagnosis in ruminant practice, PU is polyuria and perineal
// urethrostomy, DM is diabetes mellitus, dry matter and the dorsomedial
// nucleus. Scope separates some of those; it cannot separate the ones that
// collide inside one discipline, so two-letter keys are not detected at all.

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build master regex once at module load.
// All known terms + aliases, sorted longest-first so the regex engine
// prefers the longer match (e.g. "pulmonary edema" over "edema").
const ALL_TERMS = getAllDetectableTerms()
  .filter((t) => t.length >= MIN_TERM_LEN)
  .slice()
  .sort((a, b) => b.length - a.length);

const ALTERNATION = ALL_TERMS.map(escapeRegex).join('|');

// 'gi' = global + case-insensitive.
// Group 1 is the boundary character (empty at start of string), group 2
// the term. `'` (Cushing's) is fine inside a term — it is not [A-Za-z0-9]
// so it cannot break the boundary either side.
const TERM_RE = ALL_TERMS.length
  ? new RegExp(`(^|[^A-Za-z0-9])(${ALTERNATION})(?![A-Za-z0-9])`, 'gi')
  : null;

// A qualifier immediately before the term can change what the term
// means. "mitral regurgitation" is a leaking heart valve, not food
// coming back up; "uterine edema" on a mare-cycle scan is a normal
// oestrogen effect, not hypoalbuminaemia. Entries declare these in
// `notAfter`, and a match preceded by one is left alone.
const WORD_BEFORE_RE = /([A-Za-z฀-๿]+)[\s-]*$/;

function blockedByContext(entry, text, start) {
  const guards = entry && entry.notAfter;
  if (!guards || !guards.length) return false;
  const before = WORD_BEFORE_RE.exec(text.slice(Math.max(0, start - 40), start));
  if (!before) return false;
  const prev = before[1].toLowerCase();
  return guards.some((g) => String(g).toLowerCase() === prev);
}

// ────────────────────────────────────────────────────────────
// detectTerms(text, subject) — non-overlapping matches with positions
// ────────────────────────────────────────────────────────────
// Returns Array<{ term, entry, start, end }> sorted by start asc.
// `subject` is the question's subject id; without one, only terms whose
// meaning does not change with discipline can resolve.
export function detectTerms(text, subject = null) {
  if (!TERM_RE || !text) return [];
  const str = String(text);
  TERM_RE.lastIndex = 0;
  const out = [];
  let m;
  while ((m = TERM_RE.exec(str)) !== null) {
    const lead = m[1] || '';
    const matched = m[2];
    const start = m.index + lead.length;
    const entry = resolveGlossaryEntry(matched, subject);
    if (entry && !blockedByContext(entry, str, start)) {
      out.push({ term: matched, entry, start, end: start + matched.length });
    }
    // Zero-length guard (shouldn't fire with our regex shape).
    if (m.index === TERM_RE.lastIndex) TERM_RE.lastIndex++;
  }
  return out;
}
