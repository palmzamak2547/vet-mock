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
// 2. Word-boundary: ASCII negative lookbehind/ahead — Thai context
//    around an English term still produces a match (Thai chars are
//    treated as boundaries), which is what we want for the bilingual
//    Q stems VetMock uses.
// 3. Caches per-entry related-question IDs in a WeakMap keyed by the
//    entry object, so a 200-Q exam re-rendering doesn't rebuild the
//    list per click.
// ============================================================

import {
  findGlossaryEntry,
  getAllDetectableTerms,
  getAllSearchableStrings,
} from '../data/glossary.js';

const MIN_TERM_LEN = 3; // skip 1-2 char abbreviations unless explicitly aliased

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build master regex once at module load.
// All known terms + aliases, sorted longest-first so the regex engine
// prefers the longer match (e.g. "pulmonary edema" over "edema").
const ALL_TERMS = getAllDetectableTerms()
  .filter((t) => {
    // Allow short terms only when they're all-uppercase abbreviations
    // (BUN, ALT, ALP, CHF, MMVD, etc.) — we look at the *canonical*
    // term casing to decide. Synonyms/aliases already lowercased in
    // the index, so check the original glossary entry.
    if (t.length >= MIN_TERM_LEN) return true;
    return false; // 1-2 char strings are too noisy
  })
  .slice()
  .sort((a, b) => b.length - a.length);

const ALTERNATION = ALL_TERMS.map(escapeRegex).join('|');

// 'gi' = global + case-insensitive.
// Lookbehind/ahead = ASCII word-boundary that still allows Thai chars
// adjacent (so "BUN" inside Thai sentence "ค่า BUN สูง" still matches).
// We explicitly allow `'` (Cushing's) inside terms — the alternation
// already escapes it, no boundary issue because `'` isn't [A-Za-z0-9].
const TERM_RE = ALL_TERMS.length
  ? new RegExp(`(?<![A-Za-z0-9])(${ALTERNATION})(?![A-Za-z0-9])`, 'gi')
  : null;

// ────────────────────────────────────────────────────────────
// detectTerms(text) — return non-overlapping matches with positions
// ────────────────────────────────────────────────────────────
// Returns Array<{ term, entry, start, end }> sorted by start asc.
// Empty array for null/empty input or when no terms hit.
export function detectTerms(text) {
  if (!TERM_RE || !text) return [];
  const str = String(text);
  TERM_RE.lastIndex = 0;
  const out = [];
  let m;
  while ((m = TERM_RE.exec(str)) !== null) {
    const matched = m[1];
    const entry = findGlossaryEntry(matched);
    if (!entry) continue;
    out.push({
      term: matched,
      entry,
      start: m.index,
      end: m.index + matched.length,
    });
    // Zero-length guard (shouldn't fire with our regex shape).
    if (m.index === TERM_RE.lastIndex) TERM_RE.lastIndex++;
  }
  return out;
}

// ────────────────────────────────────────────────────────────
// getEntryByTerm(term) — case-insensitive lookup
// ────────────────────────────────────────────────────────────
// Returns the canonical glossary entry or null.
export function getEntryByTerm(term) {
  return findGlossaryEntry(term);
}

// ────────────────────────────────────────────────────────────
// getRelatedQuestionIds(entry, QB) — find Qs that mention this term
// ────────────────────────────────────────────────────────────
// Searches the question bank for word-boundary matches of the term,
// any alias, or any synonym, inside q.q | q.options[] | q.explain.
// Returns numeric IDs (matching q.id). Result cached per entry so
// repeated popover opens for the same term don't re-scan QB.
//
// Caller responsibility: pass the current QB array (already loaded).
// We don't import questions.js here to avoid pulling the whole bank
// into a module that may be imported pre-load.
const relatedCache = new WeakMap();

export function getRelatedQuestionIds(entry, QB) {
  if (!entry || !Array.isArray(QB) || QB.length === 0) return [];

  // Cache key = entry object — same entry across calls returns cached.
  // We also nest by QB length so a hot-reload that adds Qs invalidates.
  const cached = relatedCache.get(entry);
  if (cached && cached.qbLen === QB.length) return cached.ids;

  const needles = getAllSearchableStrings(entry).map((s) => s.toLowerCase());
  if (needles.length === 0) return [];

  // Build a per-call regex (one entry's needles, longest-first).
  const sorted = needles.slice().sort((a, b) => b.length - a.length);
  const alternation = sorted.map(escapeRegex).join('|');
  const re = new RegExp(`(?<![A-Za-z0-9])(${alternation})(?![A-Za-z0-9])`, 'i');

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
