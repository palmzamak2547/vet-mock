// ============================================================
// user-flashcards.js — localStorage layer for user-authored
// "Highlight → Flashcard" entries (created from SummaryModal
// text selections inside VideoView). These flow into the SR
// pool alongside QB + customQuestions.
// ============================================================
//
// Storage shape:
//   key:   'vmx-user-flashcards'
//   value: JSON array of { id, type:'flashcard', subject, front, back,
//                          createdAt, source? }
//
// ID range:
//   • Built-in QB Qs    : 1 – 49999
//   • Reserved buffer   : 50000 – 59999 (legacy/seeded)
//   • customQuestions   : 60000 – 69999
//   • user flashcards   : 70000+        ← this module
// Keeping ranges disjoint avoids SR-card key collisions in the
// sm2 store (which keys cards by `q.id` only).
// ============================================================

const STORAGE_KEY = 'vmx-user-flashcards';
const ID_START = 70000;

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

/** Read all user-authored flashcards (oldest first by id). */
export function loadUserFlashcards() {
  const list = readRaw();
  // Guard against malformed entries from older versions
  return list.filter(
    (c) => c && typeof c === 'object' && typeof c.id === 'number' && c.type === 'flashcard',
  );
}

/** Returns max(existing ids) + 1, floored to ID_START. */
export function nextFlashcardId() {
  const list = readRaw();
  let max = ID_START - 1;
  for (const c of list) {
    if (c && typeof c.id === 'number' && c.id > max) max = c.id;
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
  return card;
}

/** Remove a flashcard by id. No-op if not found. */
export function deleteUserFlashcard(id) {
  const list = readRaw();
  const next = list.filter((c) => c.id !== id);
  if (next.length !== list.length) writeRaw(next);
}
