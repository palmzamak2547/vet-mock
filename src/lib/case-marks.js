// ============================================================
// case-marks.js — the marks a student lays on a case
// ============================================================
// The case reader (work/case-reader/DESIGN.md, slice 1): ranges and their
// quotes, the undo history, the storage key and the one-time adoption of the
// marks saved before this release. This is what the pane needs to draw a case
// with its marks; what a hand needs to make them (the word snap, offsets of a
// point, the reading place) is in ink/case-hand.js, loaded with the case.
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

/** Who took the marks saved before owner-scoped keys: `{ owner, at }`, set once per device. */
export const ADOPT_KEY = 'vmx-case-adopt';

// ── colours ─────────────────────────────────────────────────
// None collides with a verdict (right sage, partial gold, wrong rose). The
// values are tokens in styles.css (--clr-case-*), so a theme can move them.
export const RANGE_COLORS = [
  { id: 'lemon', label: 'เหลือง', dot: 'var(--clr-case-lemon-dot)' },
  { id: 'sky', label: 'ฟ้า', dot: 'var(--clr-case-sky-dot)' },
  { id: 'lilac', label: 'ม่วง', dot: 'var(--clr-case-lilac-dot)' },
];
export const PEN_COLORS = [
  { id: 'ink', label: 'ดำ', value: 'var(--clr-case-ink)', token: '--clr-case-ink' },
  { id: 'ocean', label: 'น้ำเงิน', value: 'var(--clr-case-ocean)', token: '--clr-case-ocean' },
  { id: 'plum', label: 'ม่วง', value: 'var(--clr-case-plum)', token: '--clr-case-plum' },
];
const LEGACY_RANGE = { yellow: 'lemon', green: 'sky', pink: 'lilac' };

/** A pen colour as the canvas needs it: the token's value now, in this theme. */
export function penInk(id) {
  const c = PEN_COLORS.find((x) => x.id === id) || PEN_COLORS[0];
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(c.token).trim();
    if (v) return v;
  } catch { /* no document */ }
  return 'currentColor';
}

// ── ranges and quotes ───────────────────────────────────────
const CONTEXT = 16;

/** The marked text with up to 16 characters of context each side. */
export function quoteAt(text, start, end) {
  const str = String(text ?? '');
  return { pre: str.slice(Math.max(0, start - CONTEXT), start), exact: str.slice(start, end), post: str.slice(end, end + CONTEXT) };
}

const commonTail = (a, b) => { let n = 0; while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n++; return n; };
const commonHead = (a, b) => { let n = 0; while (n < a.length && n < b.length && a[n] === b[n]) n++; return n; };

/**
 * Where a range sits in `text` now: { start, end }, or null when its words are
 * not in the text (the mark is kept, unseen). The stored offsets win when the
 * text there is still the quote; otherwise every place the quote's words occur
 * is scored by how much of its context matches, then by nearness to the old place.
 */
export function placeRange(text, mark) {
  const str = String(text ?? '');
  const { start, end, quote } = mark || {};
  if (!(Number.isInteger(start) && Number.isInteger(end) && end > start)) return null;
  if (!quote || typeof quote.exact !== 'string' || !quote.exact) {
    return end <= str.length ? { start, end } : null;
  }
  if (str.slice(start, end) === quote.exact) return { start, end };
  let best = null;
  for (let at = str.indexOf(quote.exact); at >= 0; at = str.indexOf(quote.exact, at + 1)) {
    const score = commonTail(str.slice(Math.max(0, at - CONTEXT), at), quote.pre || '')
      + commonHead(str.slice(at + quote.exact.length, at + quote.exact.length + CONTEXT), quote.post || '');
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

let idSeq = 0;
export const newMarkId = () => `m${Date.now().toString(36)}${(idSeq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** A highlight, the snapped range of `text`, in `color`. */
export function makeRange(text, { start, end }, color = 'lemon') {
  return { id: newMarkId(), kind: 'range', style: 'wash', start, end, color, quote: quoteAt(text, start, end) };
}

/** The marks SmartPassage saved under the passage's own key, in today's form. The old values stay where they are. */
export function convertLegacy(text, hlRaw, drRaw) {
  const marks = [];
  const hl = JSON.parse(hlRaw || '[]');
  const dr = JSON.parse(drRaw || '[]');
  if (!Array.isArray(hl) || !Array.isArray(dr)) throw new Error('legacy marks are not lists');
  for (const h of hl) {
    if (!(Number.isInteger(h?.start) && Number.isInteger(h?.end) && h.end > h.start)) continue;
    marks.push({
      id: `legacy-hl-${String(h.id ?? marks.length)}`, kind: 'range', style: 'wash', start: h.start, end: h.end,
      color: LEGACY_RANGE[h.color] || 'lemon', quote: quoteAt(text, h.start, h.end),
    });
  }
  dr.forEach((s, i) => {
    if (!Array.isArray(s?.points)) return;
    marks.push({ id: `legacy-dr-${i}`, kind: 'px', color: s.color, width: s.width, points: s.points, legacy: 1 });
  });
  return marks;
}

const isRecord = (rec) => Boolean(rec) && Array.isArray(rec.marks);

/**
 * The marks this account keeps on this case, read from `storage`.
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
export function readCaseMarks(storage, { ownerId = null, subject = '', title = '', passage = '' } = {}) {
  const key = marksStorageKey(ownerId, caseKey({ subject, title, passage }));
  try {
    if (storage.getItem(key) != null) {
      // Present but unreadable is not empty: nothing may be written over it.
      const rec = readStoredJson(key, null, { storage, accept: isRecord });
      if (!rec) return { ok: false, key };
      return { ok: true, key, marks: rec.marks.filter((m) => isRange(m) || isPx(m)), adopted: false };
    }
    let claim = readStoredJson(ADOPT_KEY, null, { storage });
    const me = ownerId || null;
    if (!claim || !('owner' in claim)) {
      claim = { owner: me, at: Date.now() };
      try { storage.setItem(ADOPT_KEY, JSON.stringify(claim)); } catch { /* read-only storage: adopt nothing */ return { ok: true, key, marks: [], adopted: false }; }
    }
    if ((claim.owner || null) !== me) return { ok: true, key, marks: [], adopted: false };
    const legacy = `vmx-pass-${legacyPassageHash(String(passage))}`;
    const hl = storage.getItem(`${legacy}-hl`);
    const dr = storage.getItem(`${legacy}-dr`);
    if (hl == null && dr == null) return { ok: true, key, marks: [], adopted: false };
    const marks = convertLegacy(String(passage), hl, dr);
    // Written at once, so a later clear of this case is not undone by adopting the old keys again.
    storage.setItem(key, JSON.stringify({ v: 1, marks }));
    return { ok: true, key, marks, adopted: true };
  } catch {
    return { ok: false, key };
  }
}

/** Saves the marks. An empty case is saved as an empty record, never removed: removing it would adopt the old marks again. */
export function writeCaseMarks(storage, key, marks) {
  try {
    storage.setItem(key, JSON.stringify({ v: 1, marks }));
    return true;
  } catch {
    return false;
  }
}

// ── undo and redo ───────────────────────────────────────────
// One history per case for every kind of mark. An op adds and removes whole
// marks; undoing it removes what it added and puts back what it removed.
export const HISTORY_LIMIT = 100;

export function applyOp(marks, op, backward = false) {
  const add = backward ? op.remove : op.add;
  const remove = backward ? op.add : op.remove;
  const gone = new Set((remove || []).map((m) => m.id));
  const kept = marks.filter((m) => !gone.has(m.id));
  const have = new Set(kept.map((m) => m.id));
  return [...kept, ...(add || []).filter((m) => !have.has(m.id))];
}

export function createHistory(limit = HISTORY_LIMIT) {
  let done = [];
  let undone = [];
  return {
    /** Records an op already applied. A new op ends the redo trail. */
    push(op) {
      if (!op || (!op.add?.length && !op.remove?.length)) return;
      done.push(op);
      if (done.length > limit) done = done.slice(done.length - limit);
      undone = [];
    },
    undo(marks) {
      const op = done.pop();
      if (!op) return null;
      undone.push(op);
      return applyOp(marks, op, true);
    },
    redo(marks) {
      const op = undone.pop();
      if (!op) return null;
      done.push(op);
      return applyOp(marks, op, false);
    },
    get canUndo() { return done.length > 0; },
    get canRedo() { return undone.length > 0; },
    clear() { done = []; undone = []; },
  };
}

