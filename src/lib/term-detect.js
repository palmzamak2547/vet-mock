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
// 4. Caches per-entry related-question IDs in a WeakMap keyed by the
//    entry object, so a 200-Q exam re-rendering doesn't rebuild the
//    list per click.
// ============================================================

import {
  resolveGlossaryEntry,
  getAllDetectableTerms,
  getAllSearchableStrings,
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

// ────────────────────────────────────────────────────────────
// getEntryByTerm(term, subject) — case-insensitive lookup
// ────────────────────────────────────────────────────────────
export function getEntryByTerm(term, subject = null) {
  return resolveGlossaryEntry(term, subject);
}

// ────────────────────────────────────────────────────────────
// getRelatedQuestionIds(entry, QB) — find Qs that mention this term
// ────────────────────────────────────────────────────────────
// Searches the question bank for word-boundary matches of the term,
// any alias, or any synonym, inside q.q | q.options[] | q.explain.
// Returns numeric IDs (matching q.id). Result cached per entry so
// repeated popover opens for the same term don't re-scan QB.
//
// The COUNT the card shows does not come from here — it comes from the
// build-time index in glossary-related.generated.js, because at render
// time QB holds only the banks the session has loaded and a number that
// changes with load order is a number we would be making up. This stays
// for the click itself, where a live scan of what is actually loaded is
// the honest answer.
const relatedCache = new WeakMap();

export function getRelatedQuestionIds(entry, QB) {
  if (!entry || !Array.isArray(QB) || QB.length === 0) return [];

  // Cache key = entry object — same entry across calls returns cached.
  // We also nest by QB length so a later bank load invalidates.
  const cached = relatedCache.get(entry);
  if (cached && cached.qbLen === QB.length) return cached.ids;

  const needles = getAllSearchableStrings(entry).map((s) => s.toLowerCase());
  if (needles.length === 0) return [];

  // Build a per-call regex (one entry's needles, longest-first).
  const sorted = needles.slice().sort((a, b) => b.length - a.length);
  const alternation = sorted.map(escapeRegex).join('|');
  const re = new RegExp(`(^|[^A-Za-z0-9])(${alternation})(?![A-Za-z0-9])`, 'i');

  const ids = [];
  for (const q of QB) {
    if (!q || q.id == null) continue;
    // Scan the most informative fields. We deliberately skip rare
    // fields (passage, hint) for speed — the popover's "related Qs"
    // is a discovery tool, not a citation tracker.
    const blobs = [q.q, q.explain];
    if (Array.isArray(q.options)) blobs.push(...q.options);
    let hit = false;
    for (const b of blobs) {
      if (b && re.test(String(b))) { hit = true; break; }
    }
    if (hit) ids.push(q.id);
  }

  relatedCache.set(entry, { qbLen: QB.length, ids });
  return ids;
}
