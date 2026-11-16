// ============================================================
// case-marks.js — the marks a student lays on a case
// ============================================================
// The case reader (slice 1 of its design): ranges and their
// quotes, the storage key and the one-time adoption of the marks saved before
// this release. This is what the pane needs to draw a case with its marks;
// what a hand needs to make them (the word snap, offsets of a point, the
// reading place, new marks and their undo in case-ops.js) is in
// ink/case-hand.js, loaded with the case.
//
// Nothing loaded with the hand or the sheet imports this file: it is in the
// pane's chunk, and a chunk that its own lazy parts import from cannot be
// fetched again under a fresh address after a failed download (CaseSlot.jsx).
// So a new mark's quote, saving and the adoption key are in case-ops.js, and
// adoptLegacy is handed the old key instead of the hash that makes it.
//
// A highlight is a text range, never a page position:
//   { id, kind: 'range', style: 'wash', start, end, color, quote: { pre, exact, post } }
// start and end are offsets in the passage. The quote is the marked text with
// up to 16 characters each side, so a mark whose passage was edited is found
// again by its words; one that cannot be found is kept, unseen, never dropped.
//
// A pen stroke of today's pane is { id, kind: 'px', color, width, points } in
// CSS pixels from the top left of the passage's text box: the stroke format
// SmartPassage saved. Slice 3 turns them into ink anchored to the text; until
// then they draw in the pane where they always did.
// ============================================================

import { readStoredJson } from './stored-json.js';

/** The old per-passage key's hash (SmartPassage, before 5.240.0): djb2 of the passage text. */
export function legacyPassageHash(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h) + text.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

/**
 * The case a passage belongs to: its subject, its title and the first 200
 * characters of its text. A case whose passage grows from stage to stage
 * starts with the same 200 characters, so its marks follow it across stages.
 */
export function caseKey({ subject = '', title = '', passage = '' } = {}) {
  return legacyPassageHash(`${subject}\u0001${title}\u0001${String(passage).slice(0, 200)}`);
}

/** Where one account's marks on one case are kept on this device. A visitor's are the visitor's. */
export function marksStorageKey(ownerId, key) {
  return `vmx-case-${ownerId ? encodeURIComponent(ownerId) : 'guest'}-${key}`;
}

// ── ranges and quotes ───────────────────────────────────────
const CONTEXT = 16;

const commonTail = (a, b) => { let n = 0; while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n++; return n; };
const commonHead = (a, b) => { let n = 0; while (n < a.length && n < b.length && a[n] === b[n]) n++; return n; };

/**
 * Where a range sits in `text` now: { start, end }, or null when it cannot be
 * placed with confidence (the mark is kept, unseen, and nothing done in this
 * view touches it). The stored offsets win when the text there is still the
 * quote. A range past the end of `text` belongs to a longer stage of the case
 * and is not shown here. Otherwise the quote's words are looked for, and a place
 * counts only where enough of the words around them match too: the same word
 * elsewhere in the passage is not the place the student marked. Half of the 32
 * characters a quote keeps must match: 8 was met by chance (" in the ", or a
 * few short Thai syllables), which moved a mark onto the same word elsewhere.
 */
export const CONTEXT_NEEDED = 16;
export function placeRange(text, mark) {
  const str = String(text ?? '');
  const { start, end, quote } = mark || {};
  if (!(Number.isInteger(start) && Number.isInteger(end) && end > start)) return null;
  if (end > str.length) return null;
  if (!quote || typeof quote.exact !== 'string' || !quote.exact) return { start, end };
  if (str.slice(start, end) === quote.exact) return { start, end };
  const pre = quote.pre || '';
  const post = quote.post || '';
  // A quote at the very start or end of its passage has less context to give; ask for what it has.
  const needed = Math.min(CONTEXT_NEEDED, pre.length + post.length);
  let best = null;
  for (let at = str.indexOf(quote.exact); at >= 0; at = str.indexOf(quote.exact, at + 1)) {
    const tail = commonTail(str.slice(Math.max(0, at - CONTEXT), at), pre);
    const head = commonHead(str.slice(at + quote.exact.length, at + quote.exact.length + CONTEXT), post);
    if (tail + head < needed) continue;
    const score = tail + head;
    const near = Math.abs(at - start);
    if (!best || score > best.score || (score === best.score && near < best.near)) best = { at, score, near };
  }
  return best ? { start: best.at, end: best.at + quote.exact.length } : null;
}

/** The ranges laid on `text`: those found (with their offsets now), and those kept unseen. */
export function resolveRanges(text, marks) {
  const shown = [];
  const unplaced = [];
  for (const m of marks || []) {
    if (m?.kind !== 'range') continue;
    const at = placeRange(text, m);
    if (at) shown.push({ ...m, ...at });
    else unplaced.push(m);
  }
  shown.sort((a, b) => a.start - b.start);
  return { shown, unplaced };
}

/**
 * One drawn run of the passage (its characters from `off` on) cut by the
 * ranges into { text, mark? } pieces. Where two overlap, the earlier keeps its span.
 */
export function segmentsFor(str, off, ranges) {
  const segs = [];
  const end = off + str.length;
  let cursor = off;
  for (const r of ranges) {
    const a = Math.max(r.start, cursor);
    const b = Math.min(r.end, end);
    if (b <= a) continue;
    if (a > cursor) segs.push({ text: str.slice(cursor - off, a - off) });
    segs.push({ text: str.slice(a - off, b - off), mark: r });
    cursor = b;
  }
  if (cursor < end) segs.push({ text: str.slice(cursor - off) });
  return segs;
}

// ── the record kept per account and case ────────────────────
const isRange = (m) => m && m.kind === 'range' && Number.isInteger(m.start) && Number.isInteger(m.end) && m.end > m.start;
const isPx = (m) => m && m.kind === 'px' && Array.isArray(m.points);

const isRecord = (rec) => Boolean(rec) && Array.isArray(rec.marks);

/**
 * The marks this account keeps on this case, read from `storage`. `convert` is
 * adoptLegacy (ink/case-hand.js), loaded with the case; until it is given, a case
 * with no record yet is reported as `pending` and nothing is written.
 * { ok: true, marks, adopted } or { ok: false } when storage cannot be read
 * (nothing may then be written over what is there).
 *
 * Marks saved before this release sit under the passage's own key, shared by
 * every account on the device. The first time a case is shown after the
 * release, the account signed in then (or the visitor) is recorded as their
 * owner in ADOPT_KEY. That owner, and only that owner, gets a copy of a
 * passage's old marks the first time the passage opens; the old keys are
 * never written or removed, so they stay as the backup.
 */
export function readCaseMarks(storage, { ownerId = null, subject = '', title = '', passage = '' } = {}, adopt = null) {
  const key = marksStorageKey(ownerId, caseKey({ subject, title, passage }));
  try {
    if (storage.getItem(key) != null) {
      // Present but unreadable is not empty: nothing may be written over it.
      const rec = readStoredJson(key, null, { storage, accept: isRecord });
      if (!rec) return { ok: false, key };
      return { ok: true, key, marks: rec.marks.filter((m) => isRange(m) || isPx(m)), adopted: false };
    }
    if (!adopt) return { ok: true, key, marks: [], adopted: false, pending: true };
    return adopt(storage, key, { ownerId, passage, legacyKey: `vmx-pass-${legacyPassageHash(String(passage))}` });
  } catch {
    return { ok: false, key };
  }
}
