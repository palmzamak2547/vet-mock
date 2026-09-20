import { readLocalExtra, writeLocalExtra } from './local-extras.js';
// ============================================================
// image-occlusion.js — localStorage layer for Image Occlusion
// (Anki-style) decks. User uploads an anatomy / radiograph /
// microbe image, drags rectangles over labels, and each mask
// becomes one SR card asking "label ในกล่องที่ซ่อนคืออะไร?".
// ============================================================
//
// Storage shape:
//   key:   'vmx-image-occlusion-decks'
//   value: JSON array of
//     {
//       id:           number,
//       name:         string,                // user-facing deck title
//       imageDataUrl: string,                // inlined data: URL
//       masks: [{
//         id:     string,
//         slot:   number,                    // 0..99, fixed for the mask's life
//         x: number, y: number, w: number, h: number,  // NORMALIZED 0..1
//         label:  string,                    // short tag (front hint)
//         answer: string,                    // full back answer
//       }],
//       nextSlot:     number,                // first slot never handed out yet
//       createdAt:    number,
//       lastOpened:   number,
//     }
//
// ID range:
//   • Built-in QB Qs    : 1 – 49999
//   • Reserved buffer   : 50000 – 59999 (legacy/seeded)
//   • customQuestions   : 60000 – 69999
//   • user flashcards   : 70000+
//   • image occlusion   : 80000+        ← this module
//
// Card IDs are deck.id + mask.slot, and a deck reserves a 100-id window
// because nextDeckId() spaces deck ids by ID_STRIDE. Both parts are fixed
// for the lifetime of the deck and the mask.
//
// They used to be derived from ARRAY POSITIONS (deckIdx, maskIdx) on the
// belief — written down right here — that "SR state lives at the deck+mask
// level so the ID is a runtime concern only". It is not: srCards is keyed by
// this id and is cloud-synced.
//
// loadOcclusionCards sorts decks createdAt-ASC before numbering, which did
// make *adding* a deck safe (it lands at the end). DELETING did not: removing
// a deck shifted every later deck's window down by 100, and removing a mask
// shifted every later mask in that deck down by one — so a saved review
// schedule silently came to point at a different mask.
// ============================================================

const STORAGE_KEY = 'vmx-image-occlusion-decks';
const ID_START = 80000;
const ID_STRIDE = 100; // mask slots per deck
const MAX_DECKS = 30;
export const IMAGE_OCCLUSION_EVENT = 'vmx-image-occlusion-changed';

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
  return Array.isArray(value) ? value : [];
}

// Returns { ok, evicted: [names], reason } so the caller can tell the student
// what actually happened. It used to return nothing at all: on a quota error
// it deleted their other decks to make room, and saveDeck reported success
// either way — so "saved ✓" could mean "saved, and two of your decks are
// gone". Its own comment promised a "บันทึกไม่สำเร็จ" toast that it gave the
// caller no way to raise.
function writeRaw(arr) { const ok = writeLocalExtra(STORAGE_KEY, arr); return { ok, evicted: [], reason: ok ? null : 'quota' }; }

function notifyChange() {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event(IMAGE_OCCLUSION_EVENT));
  } catch {
    /* no-op */
  }
  // Same pattern as user-flashcards.js — bust the palette index so a
  // future "search by deck name" feature picks up new decks.
  try {
    window.dispatchEvent(new Event('vmx-palette-invalidate'));
  } catch {
    /* no-op */
  }
}

function genMaskId() {
  return 'm_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
}

function isValidMask(m) {
  return (
    m &&
    typeof m === 'object' &&
    typeof m.x === 'number' &&
    typeof m.y === 'number' &&
    typeof m.w === 'number' &&
    typeof m.h === 'number' &&
    m.w > 0 &&
    m.h > 0
  );
}

function normalizeDeck(d) {
  if (!d || typeof d !== 'object') return null;
  if (typeof d.id !== 'number' || typeof d.imageDataUrl !== 'string') return null;
  // Each mask carries a `slot`, fixed for its lifetime, and the SR card id is
  // deck.id + slot. It used to be ID_START + deckIdx*ID_STRIDE + maskIdx —
  // both array POSITIONS — so deleting a deck, or a mask, renumbered
  // everything after it and re-pointed cloud-synced review schedules at
  // different masks. deck.id is already stride-spaced by nextDeckId (80000,
  // 80100, ...), so it is the natural base and needs no new bookkeeping.
  const rawMasks = Array.isArray(d.masks) ? d.masks.filter(isValidMask) : [];
  const validSlot = (s) => Number.isInteger(s) && s >= 0 && s < ID_STRIDE;
  const taken = new Set();
  let highest = -1;
  for (const m of rawMasks) {
    if (validSlot(m?.slot)) { taken.add(m.slot); highest = Math.max(highest, m.slot); }
  }
  // A new mask takes a slot ABOVE every slot the deck has ever handed out.
  // Refilling the lowest free slot meant a box drawn after another was
  // deleted took the deleted box's card id, and with it that card's review
  // history. `nextSlot` is the high-water mark; a deck saved before it
  // existed starts from its highest surviving slot.
  let cursor = Number.isInteger(d.nextSlot) && d.nextSlot >= 0 ? Math.max(d.nextSlot, highest + 1) : highest + 1;
  let probe = 0;
  const nextFreeSlot = () => {
    while (cursor < ID_STRIDE && taken.has(cursor)) cursor++;
    if (cursor < ID_STRIDE) { taken.add(cursor); return cursor++; }
    // Every slot has been handed out at least once: reuse the lowest free one
    // rather than leave the mask out of SR.
    while (probe < ID_STRIDE && taken.has(probe)) probe++;
    if (probe >= ID_STRIDE) return null; // deck is full; mask stays out of SR
    taken.add(probe);
    return probe++;
  };
  const seen = new Set();
  const masks = rawMasks.map((m) => {
    const keep = validSlot(m?.slot) && !seen.has(m.slot);
    if (keep) seen.add(m.slot);
    return {
      id: typeof m.id === 'string' && m.id ? m.id : genMaskId(),
      slot: keep ? m.slot : nextFreeSlot(),
      x: Math.max(0, Math.min(1, m.x)),
      y: Math.max(0, Math.min(1, m.y)),
      w: Math.max(0, Math.min(1, m.w)),
      h: Math.max(0, Math.min(1, m.h)),
      label: (m.label || '').toString().trim(),
      answer: (m.answer || '').toString().trim(),
    };
  });
  return {
    id: d.id,
    name: (d.name || '').toString().trim() || 'Untitled deck',
    imageDataUrl: d.imageDataUrl,
    masks,
    nextSlot: cursor,
    createdAt: typeof d.createdAt === 'number' ? d.createdAt : Date.now(),
    lastOpened: typeof d.lastOpened === 'number' ? d.lastOpened : (d.createdAt || Date.now()),
  };
}

/** Read all decks, sorted by createdAt desc (newest first). */
export function loadDecks() {
  const list = readRaw()
    .map(normalizeDeck)
    .filter(Boolean);
  list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return list;
}

/** Find a deck by id (or null). */
export function findDeck(deckId) {
  return loadDecks().find((d) => d.id === deckId) || null;
}

/** Returns max(existing ids) + 1, floored to ID_START. */
function nextDeckId() {
  const list = readRaw();
  let max = ID_START - 1;
  for (const d of list) {
    if (d && typeof d.id === 'number' && d.id > max) max = d.id;
  }
  // Reserve ID_STRIDE per deck so masks get disjoint card-ids.
  return Math.max(ID_START, max + ID_STRIDE);
}

/**
 * Save (insert or update) a deck. Assigns id + createdAt when the
 * caller passes a deck without one. Returns the saved deck.
 *
 * LRU evict: if total deck count would exceed MAX_DECKS, the
 * least-recently-opened deck (other than the one we're saving) is
 * dropped first.
 */
export function saveDeck(deck) {
  if (!deck || typeof deck !== 'object') return null;
  if (typeof deck.imageDataUrl !== 'string' || !deck.imageDataUrl) return null;

  const list = readRaw();
  const now = Date.now();
  const isNew = typeof deck.id !== 'number';
  const id = isNew ? nextDeckId() : deck.id;
  // A mask that comes back without its slot (a caller that serialised only
  // geometry and text) keeps the slot the stored copy gave it, matched by
  // mask id. Otherwise a save renumbered the survivors from zero and a later
  // mask took the card id, and the review schedule, of a deleted one.
  const stored = isNew ? null : list.find((d) => d && d.id === id);
  const storedSlots = new Map((stored?.masks || []).map((m) => [m?.id, m?.slot]));
  const masks = (Array.isArray(deck.masks) ? deck.masks : []).map((m) => (
    m && typeof m === 'object' && !Number.isInteger(m.slot) && Number.isInteger(storedSlots.get(m.id))
      ? { ...m, slot: storedSlots.get(m.id) }
      : m
  ));
  const normalized = normalizeDeck({
    ...deck,
    id,
    masks,
    nextSlot: Number.isInteger(deck.nextSlot) ? deck.nextSlot : stored?.nextSlot,
    createdAt: deck.createdAt || now,
    lastOpened: now,
  });
  if (!normalized) return null;

  // Drop existing copy if updating
  let next = list.filter((d) => d.id !== id);
  next.push(normalized);

  // Adding a deck must never delete another student's stored work.
  if (next.length > MAX_DECKS && !list.some(item => item.id === normalized.id)) return null;

  // Hand back what actually happened. A quota eviction deletes other decks,
  // and the caller has to be able to say so instead of showing "saved ✓".
  const write = writeRaw(next);
  notifyChange();
  if (!write.ok) return null;
  return { ...normalized, _evicted: write.evicted };
}

/** Touch lastOpened without modifying other fields. */
export function touchDeck(deckId) {
  const list = readRaw();
  const idx = list.findIndex((d) => d && d.id === deckId);
  if (idx < 0) return;
  list[idx] = { ...list[idx], lastOpened: Date.now() };
  writeRaw(list);
  // No event — this is a read-side bookkeeping update.
}

/** Remove a deck by id. */
export function deleteDeck(deckId) {
  const list = readRaw();
  const next = list.filter((d) => d.id !== deckId);
  if (next.length === list.length) return true;
  // writeRaw hands back { ok, evicted, reason }; testing the object itself
  // made a refused write (quota, private mode) look like a deletion, and the
  // view said "ลบแล้ว" over a deck that was still there after reload.
  if (!writeRaw(next).ok) return false;
  notifyChange();
  return true;
}

/**
 * Flatten all decks into SR-compatible Q objects. Each mask is one Q.
 *
 * Shape:
 *   {
 *     id:           number,            // 80000+
 *     type:         'image-occlusion',
 *     subject:      'user',
 *     q:            'label ในกล่องที่ซ่อนคืออะไร?',
 *     deckId, deckName, maskId,
 *     imageDataUrl, mask: {x,y,w,h},
 *     allMasks:     [{x,y,w,h,id}, ...],   // for background fade
 *     answer:       string,                 // label or full answer
 *     back:         string,                 // SR back-side text
 *   }
 *
 * Orchestrator will register 'image-occlusion' as SR-compatible after
 * all Wave-4 agents finish. Until then the cards exist in the deck
 * store but won't appear in the SR pool — safe.
 */
export function loadOcclusionCards() {
  const decks = loadDecks();
  // Sort decks createdAt-asc for stable card-id assignment.
  decks.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  const out = [];
  decks.forEach((deck) => {
    if (!deck || !Array.isArray(deck.masks) || !deck.masks.length) return;
    const allMasks = deck.masks.map((m) => ({
      id: m.id,
      x: m.x,
      y: m.y,
      w: m.w,
      h: m.h,
    }));
    deck.masks.forEach((mask) => {
      const back = (mask.answer || mask.label || '').trim();
      if (!back) return; // skip blank-answer masks — they're work-in-progress
      // A deck past ID_STRIDE masks has no free slot left; those masks stay
      // out of SR rather than colliding with the next deck's card ids.
      if (!Number.isInteger(mask.slot)) return;
      out.push({
        id: deck.id + mask.slot,
        type: 'image-occlusion',
        subject: 'user',
        q: 'label ในกล่องที่ซ่อนคืออะไร?',
        deckId: deck.id,
        deckName: deck.name,
        maskId: mask.id,
        imageDataUrl: deck.imageDataUrl,
        mask: { x: mask.x, y: mask.y, w: mask.w, h: mask.h },
        allMasks,
        label: mask.label,
        answer: back,
        back,
        createdAt: deck.createdAt,
      });
    });
  });
  return out;
}

/** Lookup a single occlusion card by its synthetic SR id. */
export function findCard(cardId) {
  if (typeof cardId !== 'number') return null;
  const cards = loadOcclusionCards();
  return cards.find((c) => c.id === cardId) || null;
}

/** Generate a fresh mask id (exposed for the editor). */
export { genMaskId };
