import { readLocalExtra, writeLocalExtra } from './local-extras.js';
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
// ID range. srCards and the SR pool key cards by `q.id` only, so a card a
// student writes must never share an id with a bank question.
//   • customQuestions   : 60000 – 69999
//   • user flashcards   : 9_100_000 – 9_399_999  ← manual back
//   • cloze cards       : 9_400_000 – 9_699_999  ← cloze deletion
//   • moved legacy cards: old id + 9_000_000 (9_070_000 – 9_079_999)
// Flashcards used to take 70000+ and cloze cards 75000+, but the year-1 banks
// were later numbered 70001-76039: a new card inherited a bank question's
// review schedule and one of the two dropped out of the session. A stored
// card whose id a bank question holds (LEGACY_BANK_ID_RANGES) is moved once,
// deterministically, and keeps `legacyId`; every other stored id stays put.
// tests/unit/user-card-ids.test.mjs checks both lists against the banks.
// ============================================================

import { splitClozes } from './cloze.js';

const STORAGE_KEY = 'vmx-user-flashcards';
const ID_START = 9_100_000;
const FLASHCARD_ID_MAX = 9_399_999;
const CLOZE_ID_START = 9_400_000;
const CLOZE_ID_MAX = 9_699_999;
const LEGACY_OFFSET = 9_000_000;

export const USER_CARD_ID_RANGES = Object.freeze({
  flashcard: [ID_START, FLASHCARD_ID_MAX],
  cloze: [CLOZE_ID_START, CLOZE_ID_MAX],
  movedLegacy: [70000 + LEGACY_OFFSET, 79999 + LEGACY_OFFSET],
});

/** Bank question ids inside the old 70000-79999 personal-card range. */
export const LEGACY_BANK_ID_RANGES = Object.freeze([
  [70001, 70027], [70029, 70043], [70045, 70049], [71001, 71026], [72001, 72046],
  [73001, 73028], [74001, 74081], [75001, 75032], [76001, 76029], [76031, 76039],
]);

/**
 * What a save screen says when the browser refused to store a card. It used
 * to say "ลองลบการ์ดเก่า", but no screen deletes a personal card. Image-
 * occlusion decks hold whole images in the same storage and can be deleted.
 */
export const CARD_STORAGE_FULL_MESSAGE =
  'บันทึกไม่สำเร็จ เบราว์เซอร์นี้เก็บข้อมูลเพิ่มไม่ได้ ลองลบแฟลชการ์ดปิดภาพที่ไม่ใช้แล้ว หรือปิดโหมดไม่ระบุตัวตน';

const onBankId = (id) => LEGACY_BANK_ID_RANGES.some(([lo, hi]) => id >= lo && id <= hi);

/**
 * The SR record a card reads. A moved card (see readRaw) has no record under
 * its new id until it is graded again, so it reads the one it used before the
 * move, stamped with the new id. Nothing in srCards is rewritten or dropped:
 * the old record stays with the bank question that shares the old id.
 */
export function srCardFor(srCards, q) {
  if (!srCards || !q) return undefined;
  const own = srCards[q.id];
  if (own) return own;
  if (!Number.isInteger(q.legacyId)) return undefined;
  const carried = srCards[q.legacyId];
  return carried ? { ...carried, questionId: q.id } : undefined;
}

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
  const value = readLocalExtra(STORAGE_KEY, []);
  if (!Array.isArray(value)) return [];
  // A card saved on a bank question's id moves to old id + LEGACY_OFFSET. The
  // move is a pure function of the stored id, so the card reads the same
  // whether or not the write-back below lands.
  let moved = false;
  const list = value.map((c) => {
    if (!c || typeof c !== 'object' || !Number.isInteger(c.id) || !onBankId(c.id)) return c;
    if (c.type !== 'flashcard' && c.type !== 'cloze') return c;
    moved = true;
    return { ...c, id: c.id + LEGACY_OFFSET, legacyId: c.id };
  });
  if (moved) writeLocalExtra(STORAGE_KEY, list);
  return list;
}

/**
 * Returns true when the write actually landed.
 *
 * This used to swallow the failure and return nothing, and its own comment
 * said "UI layer can show a toast if needed" — which the UI layer could not
 * do, because it was never told. So a student on a full or private-mode
 * localStorage saw "✓ เพิ่ม flashcard แล้ว" for a card that was never
 * stored, and found out when they opened their deck and it was not there.
 */
function writeRaw(arr) { return writeLocalExtra(STORAGE_KEY, arr); }

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
  // Not stored is not saved: returning the card here would have the caller
  // announce a save that did not happen.
  if (!writeRaw(list)) return null;
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
  if (!writeRaw(next)) return null;
  notifyPaletteInvalidate();
  import('../components/CommandPalette.jsx')
    .then((m) => m?.invalidateCommandPaletteCache?.())
    .catch(() => { /* no-op */ });
  return newCards;
}
