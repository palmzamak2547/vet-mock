// ============================================================
// user-flashcards.js — localStorage layer for user-authored
// "Highlight → Flashcard" entries (created from SummaryModal
// text selections inside VideoView). These flow into the SR
// pool alongside QB + customQuestions.
// ============================================================
//
// Storage shape (one array, mixed types — distinguish via `type`):
//   key:   'vmx-user-flashcards'
//   value: JSON array of either
//          { id, type:'flashcard', subject, front, back,
//            createdAt, source? }
//        | { id, type:'cloze', subject, fullText, clozeIdx,
//            front, back, deckGroupId, createdAt, source? }
//
// ID range:
//   • Built-in QB Qs    : 1 – 49999
//   • Reserved buffer   : 50000 – 59999 (legacy/seeded)
//   • customQuestions   : 60000 – 69999
//   • user flashcards   : 70000 – 74999  ← manual back
//   • cloze cards       : 75000 – 79999  ← cloze deletion
// Keeping ranges disjoint avoids SR-card key collisions in the
// sm2 store (which keys cards by `q.id` only).
// ============================================================

import { splitClozes } from './cloze.js';

const STORAGE_KEY = 'vmx-user-flashcards';
const ID_START = 70000;
const FLASHCARD_ID_MAX = 74999;
const CLOZE_ID_START = 75000;
const CLOZE_ID_MAX = 79999;

// Belt-and-suspenders: notify the ⌘K palette that its static index
// is now stale (user just added/removed a flashcard). Two channels:
//   1. Window event 'vmx-palette-invalidate' — any listener (the
//      palette module installs one) clears its module-level cache.
//   2. Direct ESM import of `invalidateCommandPaletteCache` — works
//      even if the listener is somehow missed (e.g. palette chunk
//      not yet loaded in this tab).
// Failure of either path is silent: stale index is a UX glitch, not
// a data-loss event, so we never let it crash the save.
function notifyPaletteInvalidate() {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event('vmx-palette-invalidate'));
  } catch {
    /* no-op */
  }
}

function safeParse(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readRaw() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

function writeRaw(arr) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // Quota exceeded or storage disabled — silently no-op so the
    // caller doesn't crash. UI layer can show a toast if needed.
  }
}

/**
 * Read all user-authored cards (oldest first by id).
 * Returns BOTH manual flashcards (type:'flashcard') AND cloze
 * cards (type:'cloze') — SR session merges them together, so
 * we return one combined list. Callers that only want one kind
 * can filter on `c.type`.
 */
export function loadUserFlashcards() {
  const list = readRaw();
  return list.filter(
    (c) => c && typeof c === 'object' && typeof c.id === 'number'
      && (c.type === 'flashcard' || c.type === 'cloze'),
  );
}

/** Returns max(existing flashcard ids) + 1, floored to ID_START.
 *  Caps to FLASHCARD_ID_MAX (cloze cards live above that). */
export function nextFlashcardId() {
  const list = readRaw();
  let max = ID_START - 1;
  for (const c of list) {
    if (
      c && typeof c.id === 'number'
      && c.type === 'flashcard'
      && c.id > max && c.id <= FLASHCARD_ID_MAX
    ) {
      max = c.id;
    }
  }
  return max + 1;
}

/** Returns next available cloze-card id (75000–79999). */
export function nextClozeId() {
  const list = readRaw();
  let max = CLOZE_ID_START - 1;
  for (const c of list) {
    if (
      c && typeof c.id === 'number'
      && c.type === 'cloze'
      && c.id > max && c.id <= CLOZE_ID_MAX
    ) {
      max = c.id;
    }
  }
  return max + 1;
}

/**
 * Append a new flashcard. Returns the saved card (with id + createdAt).
 * `front` + `back` are trimmed; empty `front` is rejected (returns null).
 */
export function saveUserFlashcard({ front, back, subject = null, source = null } = {}) {
  const f = (front || '').toString().trim();
  const b = (back || '').toString().trim();
  if (!f) return null;
  const card = {
    id: nextFlashcardId(),
    type: 'flashcard',
    subject: subject || null,
    front: f,
    back: b,
    // Mirror into `q` so the existing SR-flashcard renderer
    // (SRSessionView reads currentQ.q for the front face) just works
    // without a special branch on every <RichText/> call site.
    q: f,
    createdAt: Date.now(),
    source: source || null,
  };
  const list = readRaw();
  list.push(card);
  writeRaw(list);
  // ⌘K palette caches the static index at module scope; bust it now
  // so the new card shows up in the next search session.
  notifyPaletteInvalidate();
  // Direct module poke (works even if the palette chunk hasn't
  // attached its window listener yet). Dynamic import keeps this
  // module free of a circular static dep on the palette.
  import('../components/CommandPalette.jsx')
    .then((m) => m?.invalidateCommandPaletteCache?.())
    .catch(() => { /* palette chunk not loaded yet — fine */ });
  return card;
}

/** Remove a flashcard by id. No-op if not found. Works for both
 *  manual flashcards AND single cloze cards (the latter usually
 *  deleted via deleteClozeGroup instead, which removes the whole
 *  family at once). */
export function deleteUserFlashcard(id) {
  const list = readRaw();
  const next = list.filter((c) => c.id !== id);
  if (next.length !== list.length) {
    writeRaw(next);
    notifyPaletteInvalidate();
    import('../components/CommandPalette.jsx')
      .then((m) => m?.invalidateCommandPaletteCache?.())
      .catch(() => { /* no-op */ });
  }
}

// ── Cloze cards ──────────────────────────────────────────────
// A "cloze save" produces N cards (one per unique cN index)
// that share a deckGroupId so we can edit/delete them as a unit.
//
// Each saved card object:
//   { id, type:'cloze', subject, fullText, clozeIdx,
//     front, back, q, deckGroupId, createdAt, source? }
//
// `q` mirrors `front` so the SR renderer's existing currentQ.q
// reads keep working without a special branch (same trick the
// manual flashcards use above).

/** Crypto-randomish deck group id; safe to share across cards. */
function makeDeckGroupId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `clz-${crypto.randomUUID()}`;
  }
  return `clz-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Parse cloze text into N cards (one per unique cN index),
 * append all to storage, and return the saved array. If the
 * text has no cloze marks, returns [].
 *
 * @param {{ fullText: string, subject?: string|null, source?: string|null }} args
 * @returns {Array<object>}  newly-saved cards (may be length 0)
 */
export function saveClozeText({ fullText, subject = null, source = null } = {}) {
  const text = (fullText || '').toString();
  if (!text.trim()) return [];
  const slices = splitClozes(text);
  if (slices.length === 0) return [];
  const deckGroupId = makeDeckGroupId();
  const createdAt = Date.now();
  const list = readRaw();
  // Compute starting id once, then increment locally — avoids
  // re-scanning the array for every card in the same batch.
  let nextId = CLOZE_ID_START - 1;
  for (const c of list) {
    if (
      c && typeof c.id === 'number'
      && c.type === 'cloze'
      && c.id > nextId && c.id <= CLOZE_ID_MAX
    ) {
      nextId = c.id;
    }
  }
  nextId += 1;
  const newCards = slices.map((s, i) => ({
    id: nextId + i,
    type: 'cloze',
    subject: subject || null,
    fullText: s.fullText,
    clozeIdx: s.idx,
    front: s.front,
    back: s.back,
    // Mirror front into `q` so SR-renderer fallbacks (currentQ.q)
    // have something readable even before the dedicated cloze
    // dispatch lands.
    q: s.front,
    deckGroupId,
    createdAt,
    source: source || null,
  }));
  const next = list.concat(newCards);
  writeRaw(next);
  notifyPaletteInvalidate();
  import('../components/CommandPalette.jsx')
    .then((m) => m?.invalidateCommandPaletteCache?.())
    .catch(() => { /* no-op */ });
  return newCards;
}

/**
 * Remove every cloze card sharing a deckGroupId. No-op if the
 * group doesn't exist. Returns the number of cards removed.
 */
export function deleteClozeGroup(deckGroupId) {
  if (!deckGroupId) return 0;
  const list = readRaw();
  const next = list.filter(
    (c) => !(c && c.type === 'cloze' && c.deckGroupId === deckGroupId),
  );
  const removed = list.length - next.length;
  if (removed > 0) {
    writeRaw(next);
    notifyPaletteInvalidate();
    import('../components/CommandPalette.jsx')
      .then((m) => m?.invalidateCommandPaletteCache?.())
      .catch(() => { /* no-op */ });
  }
  return removed;
}
