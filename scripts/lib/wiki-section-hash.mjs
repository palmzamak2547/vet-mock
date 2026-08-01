// ============================================================
// wiki-section-hash — stable content hash for one wiki section
// ============================================================
// A question's wikiRef records the hash of the section it cites. If the
// section is later edited, the hash stops matching and the validator can say
// "these N questions cite a section that has changed, re-check them" instead
// of the citation silently rotting.
//
// This module is the SINGLE definition of that hash. The backfill script and
// the validator both import it — if they ever computed it differently, every
// ref would mismatch forever and the gate would be worse than useless.
//
// What is hashed: the section body between its <a id="..."> anchor and the
// next anchor (or end of file), after normalisation.
//
// Normalisation, and why each step is here:
//   • CRLF -> LF          this repo checks out CRLF on Windows and LF in CI;
//                         without this the same file hashes differently per OS
//   • NFC unicode         Thai combining marks have multiple encodings
//   • drop the section-meta comment   review metadata changes (reviewedAt,
//                         reviewedBy) are not content changes
//   • drop html anchors   they are structure, not prose
//   • collapse whitespace reflowing a paragraph is not a content change
//
// Deliberately NOT normalised away: punctuation, numbers, casing, markdown
// emphasis. Those carry meaning — "72°C/15 s" becoming "72°C/25 s" MUST break
// the hash, that is the entire point.
// ============================================================

import { createHash } from 'node:crypto';

export const HASH_PREFIX = 'sha256';
const HASH_LENGTH = 16;

/**
 * Pull the raw body of one section out of a page's markdown.
 * @param {string} content full markdown of the page
 * @param {string} anchorId the id on the section's <a> tag
 * @returns {string|null} raw section body, or null if the anchor is absent
 */
export function extractSectionBody(content, anchorId) {
  if (typeof content !== 'string' || !anchorId) return null;
  const anchorRe = /<a\s+(?:[^>]*?\s+)?id=["']([^"']+)["'][^>]*>(?:<\/a>)?/gi;

  const spans = [];
  let m;
  while ((m = anchorRe.exec(content)) !== null) {
    spans.push({ id: m[1], start: anchorRe.lastIndex });
  }
  const idx = spans.findIndex((s) => s.id === anchorId);
  if (idx === -1) return null;

  const start = spans[idx].start;
  const end = idx + 1 < spans.length
    ? content.lastIndexOf('<a', spans[idx + 1].start)
    : content.length;
  return content.slice(start, end < start ? content.length : end);
}

/**
 * Normalise a raw section body to the form that actually gets hashed.
 * Exported so a debugging session can diff two normalisations directly
 * instead of staring at two hex strings.
 * @param {string} raw
 * @returns {string}
 */
export function normaliseSectionBody(raw) {
  return String(raw)
    .replace(/\r\n?/g, '\n')
    .normalize('NFC')
    .replace(/<!--\s*wiki-section-meta[\s\S]*?-->/gi, ' ')
    .replace(/<a\s+[^>]*>|<\/a>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {string} content full markdown of the page
 * @param {string} anchorId
 * @returns {string|null} e.g. "sha256:3f9a1c02de4b7788", or null if not found
 */
export function sectionContentHash(content, anchorId) {
  const raw = extractSectionBody(content, anchorId);
  if (raw === null) return null;
  const normalised = normaliseSectionBody(raw);
  if (!normalised) return null;
  const digest = createHash('sha256').update(normalised, 'utf8').digest('hex');
  return `${HASH_PREFIX}:${digest.slice(0, HASH_LENGTH)}`;
}
