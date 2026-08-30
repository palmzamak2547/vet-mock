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
//         x: number, y: number, w: number, h: number,  // NORMALIZED 0..1
//         label:  string,                    // short tag (front hint)
//         answer: string,                    // full back answer
//       }],
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
  if (typeof window === 'undefined' || !window.localStorage) return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

// Returns { ok, evicted: [names], reason } so the caller can tell the student
// what actually happened. It used to return nothing at all: on a quota error
// it deleted their other decks to make room, and saveDeck reported success
// either way — so "saved ✓" could mean "saved, and two of your decks are
// gone". Its own comment promised a "บันทึกไม่สำเร็จ" toast that it gave the
// caller no way to raise.
function writeRaw(arr) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { ok: false, evicted: [], reason: 'no-storage' };
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    return { ok: true, evicted: [], reason: null };
  } catch {
    // Quota exceeded. Image decks run 100-300 KB each, so one oversized
    // upload can fill the 5 MB budget. Evicting is still the least-bad
    // option — the alternative is that nothing saves at all — but the
    // student has to be told which decks it cost them.
    const byRecency = arr.slice().sort(
      (a, b) => (b.lastOpened || b.createdAt || 0) - (a.lastOpened || a.createdAt || 0),
    );
    const fallback = byRecency.slice();
    const evicted = [];
    while (fallback.length > 1) {
      const dropped = fallback.pop();
      evicted.push((dropped && dropped.name) || 'ชุดที่ไม่มีชื่อ');
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
        return { ok: true, evicted, reason: 'quota' };
      } catch {
        /* keep evicting */
      }
    }
    return { ok: false, evicted, reason: 'quota' };
  }
}

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
  const taken = new Set();
  for (const m of rawMasks) {
    if (Number.isInteger(m?.slot) && m.slot >= 0 && m.slot < ID_STRIDE) taken.add(m.slot);
  }
  let probe = 0;
  const nextFreeSlot = () => {
    while (probe < ID_STRIDE && taken.has(probe)) probe++;
    if (probe >= ID_STRIDE) return null; // deck is full; mask stays out of SR
    taken.add(probe);
    return probe;
  };
  const seen = new Set();
  const masks = rawMasks.map((m) => {
    const keep = Number.isInteger(m?.slot) && m.slot >= 0 && m.slot < ID_STRIDE && !seen.has(m.slot);
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
  const normalized = normalizeDeck({
    ...deck,
    id,
    createdAt: deck.createdAt || now,
    lastOpened: now,
  });
  if (!normalized) return null;

  // Drop existing copy if updating
  let next = list.filter((d) => d.id !== id);
  next.push(normalized);

  // LRU evict if over cap
  if (next.length > MAX_DECKS) {
    next.sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0));
    next = next.slice(0, MAX_DECKS);
  }

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
  if (next.length === list.length) return;
  writeRaw(next);
  notifyChange();
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
