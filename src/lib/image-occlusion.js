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
// Card IDs are derived as 80000 + (deckIdx * 100) + maskIdx so a
// single deck reserves a 100-id window. Deck index is the stable
// position in createdAt-asc order; deletion shifts later decks
// down but SR state lives at the deck+mask level so the ID is a
// runtime concern only.
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

function writeRaw(arr) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  let toWrite = arr;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toWrite));
    return;
  } catch {
    // Quota exceeded — evict oldest-opened decks until it fits or we're
    // down to the most recent one. Image decks can be 100-300 KB each so
    // a single oversized upload can blow the 5 MB quota.
    let fallback = toWrite.slice().sort(
      (a, b) => (b.lastOpened || b.createdAt || 0) - (a.lastOpened || a.createdAt || 0),
    );
    while (fallback.length > 1) {
      fallback.pop();
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
        return;
      } catch {
        /* keep evicting */
      }
    }
    // Give up silently — UI surfaces a "บันทึกไม่สำเร็จ" toast instead.
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
  const masks = Array.isArray(d.masks) ? d.masks.filter(isValidMask).map((m) => ({
    id: typeof m.id === 'string' && m.id ? m.id : genMaskId(),
    x: Math.max(0, Math.min(1, m.x)),
    y: Math.max(0, Math.min(1, m.y)),
    w: Math.max(0, Math.min(1, m.w)),
    h: Math.max(0, Math.min(1, m.h)),
    label: (m.label || '').toString().trim(),
    answer: (m.answer || '').toString().trim(),
  })) : [];
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

  writeRaw(next);
  notifyChange();
  return normalized;
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
  decks.forEach((deck, deckIdx) => {
    if (!deck || !Array.isArray(deck.masks) || !deck.masks.length) return;
    const allMasks = deck.masks.map((m) => ({
      id: m.id,
      x: m.x,
      y: m.y,
      w: m.w,
      h: m.h,
    }));
    deck.masks.forEach((mask, maskIdx) => {
      const back = (mask.answer || mask.label || '').trim();
      if (!back) return; // skip blank-answer masks — they're work-in-progress
      out.push({
        id: ID_START + deckIdx * ID_STRIDE + maskIdx,
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
