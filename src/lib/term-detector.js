// ============================================================
// term-detector.js — find glossary terms inside text
// ============================================================
// Used by SmartText to underline known vet medical terms in
// question stems. Built once at module load (regex is global +
// case-insensitive), and detection runs ≤1ms for ~500-char stems.
//
// Design:
// 1. Pull every key + alias from glossary.js via getAllTerms()
// 2. Sort DESC by length so longer matches win (e.g. "MMVD" over a
//    spurious 1-char fragment, "pulmonary edema" over "edema")
// 3. Escape regex metachars per term (especially Cushing's needs '
//    handled and ACE inhibitor needs the space matched literally)
// 4. Use word boundaries that work for English + the Thai aliases
//    we seed (Thai has no inter-word space, so we rely on negative
//    lookbehind/ahead for alphanumeric vs not — keeps "BUN" from
//    matching inside "BUNDLE")
// ============================================================

import { findGlossaryEntry, getAllTerms } from '../data/glossary.js';

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build the master detection regex once at module load.
// - Longest-first alternation so the engine prefers "MMVD" over "M"
// - Capturing group lets us recover the matched substring
// - Lookbehind/ahead enforces "word-ish" boundary: a match must not
//   be flanked by ASCII letters/digits (e.g. "BUN" inside "BUNDLE"
//   won't fire). Thai chars are treated as boundaries, which is
//   what we want — Thai aliases like "อะโซเทเมีย" still match when
//   embedded in Thai text because we don't require space, only
//   "not an ASCII alphanumeric" on either side.
const TERMS = getAllTerms().slice().sort((a, b) => b.length - a.length);
const ALTERNATION = TERMS.map(escapeRegex).join('|');
// 'gi' = global + case-insensitive. (?<![A-Za-z0-9]) / (?![A-Za-z0-9])
// = English word boundary that still allows Thai context around it.
const TERM_RE = TERMS.length ? new RegExp(`(?<![A-Za-z0-9])(${ALTERNATION})(?![A-Za-z0-9])`, 'gi') : null;

// Find all glossary-term occurrences inside `text`.
// Returns an array of { start, end, term, entry }, sorted by start
// asc, non-overlapping (regex engine guarantees non-overlap on the
// same scan). Each match resolves to a glossary entry via case-
// insensitive lookup.
export function detectTerms(text) {
  if (!TERM_RE || !text) return [];
  TERM_RE.lastIndex = 0;
  const out = [];
  let m;
  while ((m = TERM_RE.exec(text)) !== null) {
    const matched = m[1];
    const entry = findGlossaryEntry(matched);
    if (!entry) continue; // defensive — should not happen since index is built from same source
    out.push({
      start: m.index,
      end: m.index + matched.length,
      term: matched,
      entry,
    });
    // Guard against zero-length matches (shouldn't happen with our regex,
    // but cheap insurance against infinite loops)
    if (m.index === TERM_RE.lastIndex) TERM_RE.lastIndex++;
  }
  return out;
}

// Split text into ordered segments ready for rendering.
// Returns an array of:
//   { type: 'text', value: string }            — plain run (will be piped through RichText)
//   { type: 'term', value: string, entry }     — clickable term button
// The result preserves original text exactly when concatenated; empty
// runs are omitted.
export function wrapTerms(text) {
  if (!text) return [];
  const str = String(text);
  const matches = detectTerms(str);
  if (matches.length === 0) {
    return [{ type: 'text', value: str }];
  }
  const segments = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start > cursor) {
      segments.push({ type: 'text', value: str.slice(cursor, m.start) });
    }
    segments.push({ type: 'term', value: str.slice(m.start, m.end), entry: m.entry });
    cursor = m.end;
  }
  if (cursor < str.length) {
    segments.push({ type: 'text', value: str.slice(cursor) });
  }
  return segments;
}
