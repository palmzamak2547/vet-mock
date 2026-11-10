// ============================================================
// evidence.js — the slide a revealed answer rests on (docs/ANSWER-EVIDENCE.md)
// ============================================================
// Which page of which library document, and which lines on it, is filed per
// subject in src/data/evidence/<subject>.generated.js: a citation, loaded as
// its own small chunk when a question of that subject is shown. The page
// image is not in the app: it sits behind an address that /api/evidence-pass
// gives to Chula members only, so a visitor outside the wall gets the
// citation and never the slide.
import { evidenceHash } from './evidence-hash.js';
import { EVIDENCE_LOADERS } from '../data/evidence/loaders.generated.js';

const loaded = new Map();    // subject → { docs, q }, or null when it has no file
const pending = new Map();

/** Load a subject's index. Asked for when a question is shown, so it is in memory before the answer is. */
export function prefetchEvidence(subject, loaders = EVIDENCE_LOADERS) {
  if (!subject || loaded.has(subject)) return Promise.resolve();
  if (pending.has(subject)) return pending.get(subject);
  const load = Object.hasOwn(loaders, subject) ? loaders[subject] : null;
  if (!load) { loaded.set(subject, null); return Promise.resolve(); }
  const job = load()
    .then((m) => { loaded.set(subject, m.EVIDENCE || null); }, () => { /* offline: asked again with the next question */ })
    .finally(() => { pending.delete(subject); });
  pending.set(subject, job);
  return job;
}

/** The slide for a question: undefined while its subject is still loading, null when it has none.
 *  A question whose stem or key changed after its slide was matched has none until it is matched again. */
export function evidenceFor(q) {
  const index = loaded.get(q?.subject);
  if (index === undefined) return undefined;
  const row = index?.q && Object.hasOwn(index.q, q.id) ? index.q[q.id] : null;
  if (!Array.isArray(row)) return null;
  const [doc, page, w, h, boxes, hash] = row;
  if (hash !== evidenceHash(q) || !(w > 0 && h > 0) || !Array.isArray(boxes)) return null;
  const [sha16, slug, title, kind] = index.docs?.[doc] || [];
  return sha16 ? { sha16, slug, title, kind, page, w, h, boxes } : null;
}

/** Whether a loaded subject has any slides filed (false while it is still loading). */
export const hasEvidence = (subject) => Boolean(loaded.get(subject));

/** Tests start from an empty memory. */
export function resetEvidence() {
  loaded.clear();
  pending.clear();
  base = undefined;
  refusedAt = 0;
  asking = null;
}

// ---------- the page images ----------
const HOST = 'https://slides.vetmock.com/';
const PASS_KEY = 'vmx-evidence-base-v1';   // sessionStorage: gone with the tab, so a shared device does not keep it
const REFUSED_MS = 5 * 60_000;             // a visitor the wall refused is not asked about again on every answer
let base;                                  // the address; null after a refusal; undefined while nobody has asked
let refusedAt = 0;
let asking = null;

const validBase = (v) => (typeof v === 'string' && v.startsWith(HOST) && /^[\w./:-]+$/.test(v) ? v.replace(/\/+$/, '') : null);

/** What this tab knows without asking: the address, null (refused a moment ago), or undefined (not asked yet). */
export function knownBase({ storage = globalThis.sessionStorage, now = Date.now() } = {}) {
  if (typeof base === 'string') return base;
  if (base === null) {
    if (now - refusedAt < REFUSED_MS) return null;
    base = undefined;
  }
  try {
    const kept = validBase(storage?.getItem(PASS_KEY));
    if (kept) base = kept;
  } catch { /* storage refused: ask */ }
  return base;
}

/** Where the page images are, for a member; null for anyone else or when it cannot be asked now. One request at a time. */
export function evidenceBase({ fetchImpl = globalThis.fetch, storage = globalThis.sessionStorage, now = Date.now } = {}) {
  const known = knownBase({ storage, now: now() });
  if (known !== undefined) return Promise.resolve(known);
  asking ||= (async () => {
    let got = null;
    try {
      const { authHeader } = await import('./api-auth.js');
      const res = await fetchImpl('/api/evidence-pass', { headers: await authHeader() });
      if (res.ok) got = validBase((await res.json())?.base);
    } catch { /* offline: a refusal for now */ }
    base = got;
    if (got) { try { storage?.setItem(PASS_KEY, got); } catch { /* kept in memory only */ } } else refusedAt = now();
    asking = null;
    return got;
  })();
  return asking;
}

/** Ask again next time: the account changed, or the address stopped answering (the folder was moved). */
export function forgetEvidenceBase({ storage = globalThis.sessionStorage } = {}) {
  base = undefined;
  refusedAt = 0;
  try { storage?.removeItem(PASS_KEY); } catch { /* nothing kept */ }
}

export const slideUrl = (address, rec) => `${address}/${rec.sha16}/p${String(rec.page).padStart(3, '0')}.webp`;

/** The part of the page to show inline: the highlighted lines with room around them, never
 *  magnified past what a 1280 px page image can carry. Fractions of the page.
 *  `narrow` is a phone: its frame is some 240 px wide, so it shows less of the page's width
 *  (the slide's words come out near 13 px) in a taller frame. */
export function cropOf(rec, { narrow = false } = {}) {
  const ratio = rec.w / rec.h;                       // the page's own shape
  // No lines to mark (the fact is in a figure): the page is shown whole.
  if (!rec.boxes.length) return { cx: 0, cy: 0, cw: 1, ch: 1, shape: ratio };
  const least = narrow ? 0.45 : 0.62;                // the most the page is magnified
  const flattest = narrow ? 2.2 : 3;                 // the frame's width over its height, at most
  const xs = rec.boxes.flatMap(([x, , w]) => [x, x + w]);
  const ys = rec.boxes.flatMap(([, y, , h]) => [y, y + h]);
  const x0 = Math.min(...xs) / 1000; const x1 = Math.max(...xs) / 1000;
  const y0 = Math.min(...ys) / 1000; const y1 = Math.max(...ys) / 1000;
  let cw = Math.min(1, Math.max(least, x1 - x0 + 0.08));
  let ch = Math.min(1, y1 - y0 + 0.12);
  const shape = () => (cw * ratio) / ch;             // the frame's width over its height
  if (shape() > flattest) ch = Math.min(1, (cw * ratio) / flattest);   // a single line: give it air above and below
  if (shape() < 1.5) cw = Math.min(1, (1.5 * ch) / ratio);      // many lines: widen before growing tall
  if (shape() < 1.1) { cw = 1; ch = 1; }                        // most of the page is marked: show the page
  const cx = Math.min(1 - cw, Math.max(0, (x0 + x1) / 2 - cw / 2));
  const cy = Math.min(1 - ch, Math.max(0, (y0 + y1) / 2 - ch / 2));
  return { cx, cy, cw, ch, shape: shape() };
}
