// ============================================================
// pinboard.js — Personal pinboard storage
// ============================================================
//
// Lets the user pin Qs / video summaries / flashcards / per-Q notes
// across the app, then revisit them later in one consolidated grid
// (PinboardView). Persists to localStorage `vmx-pinboard` as an
// array of `pin` objects. Caps at MAX_PINS — oldest evicted on overflow
// to keep the index lookup cheap and prevent localStorage bloat.
//
// Pin shape:
//   { id, type, payload, label, addedAt }
//
//   id        monotonic integer; reused only after every existing pin
//             is deleted (we seed from max(existing.id) + 1)
//   type      'question' | 'summary' | 'flashcard' | 'note'
//   payload   type-specific (see payloadKey below)
//   label     short human-readable label shown in PinboardView card
//   addedAt   Date.now() at insertion
//
// Cross-component sync: every mutation dispatches the custom event
// `vmx-pinboard-changed` on window so PinButton instances can refresh
// their pinned state without polling.

const STORAGE_KEY = 'vmx-pinboard';
const EVENT_NAME = 'vmx-pinboard-changed';
const MAX_PINS = 60;

// Compute a stable string key for a pin payload of a given type. Used
// by isPinned() to detect dupes; mirror this in addPin() so we don't
// stack 12 copies of the same Q.
export function payloadKey(type, payload) {
  if (!payload) return '';
  switch (type) {
    case 'question':  return `${payload.subject || '?'}:${payload.id ?? '?'}`;
    case 'summary':   return String(payload.videoId || '');
    case 'flashcard': return String(payload.flashcardId || '');
    case 'note':      return String(payload.qKey || '');
    default:          return '';
  }
}

function safeRead() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWrite(list) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage may be disabled or full — fail silent rather than
    // crash the UI. The pin simply won't survive a reload.
  }
}

function fire() {
  if (typeof window === 'undefined') return;
  try { window.dispatchEvent(new CustomEvent(EVENT_NAME)); } catch {}
}

// Returns pins sorted addedAt desc (newest first). Cheap — N <= 60.
export function loadPins() {
  const list = safeRead();
  return list.slice().sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
}

export function isPinned(type, key) {
  if (!type || !key) return false;
  const list = safeRead();
  for (const p of list) {
    if (p.type === type && payloadKey(p.type, p.payload) === key) return true;
  }
  return false;
}

// Adds a pin (no-op if an equivalent one already exists). Returns the
// existing-or-newly-created pin so callers can render it immediately.
export function addPin({ type, payload, label }) {
  if (!type || !payload) return null;
  const list = safeRead();
  const key = payloadKey(type, payload);
  const existing = list.find((p) => p.type === type && payloadKey(p.type, p.payload) === key);
  if (existing) return existing;

  const maxId = list.reduce((m, p) => Math.max(m, p.id || 0), 0);
  const pin = {
    id: maxId + 1,
    type,
    payload,
    label: (label || '').toString().slice(0, 200),
    addedAt: Date.now(),
  };
  list.push(pin);

  // Evict oldest to keep <= MAX_PINS. Sorting by addedAt desc and
  // slicing keeps the newest survivors.
  if (list.length > MAX_PINS) {
    list.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    list.length = MAX_PINS;
  }

  safeWrite(list);
  fire();
  return pin;
}

export function removePin(id) {
  if (id == null) return;
  const list = safeRead();
  const next = list.filter((p) => p.id !== id);
  if (next.length === list.length) return;
  safeWrite(next);
  fire();
}

export function removePinByKey(type, key) {
  if (!type || !key) return;
  const list = safeRead();
  const next = list.filter((p) => !(p.type === type && payloadKey(p.type, p.payload) === key));
  if (next.length === list.length) return;
  safeWrite(next);
  fire();
}

export function clearPinboard() {
  safeWrite([]);
  fire();
}

export const PINBOARD_EVENT = EVENT_NAME;
export const PINBOARD_MAX = MAX_PINS;
