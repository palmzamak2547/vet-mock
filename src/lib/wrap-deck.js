// ============================================================
// wrap-deck.js — the wrap-up as a revision deck, one item per card
// ============================================================
// Recalling an item before seeing it fixes it better than reading it again,
// and one item at a time is less to hold. So the deck shows a card's name,
// the student tries to recall it, opens it, and only then says whether they
// knew it: "จำได้" or "ต้องทวน". The ones marked ต้องทวน come back in a round
// of their own.
//
// Everything here is pure: the view keeps the state in localStorage under a
// vmx-wrap-deck-* key, per device, and reads it back through readDeck, which
// forgives a missing, old or corrupt value by starting clean. Nothing of it
// reaches sync or the exam session.
// ============================================================

export const DECK_VERSION = 1;
export const KNOWN = 'k';
export const AGAIN = 'a';

/** The localStorage key for one paper's deck: vmx-wrap-deck-<subject>-<term>-<phase>. */
export function deckKey(subject, term, phase) {
  const part = (v) => String(v ?? 'none').replace(/[^0-9A-Za-z_-]/g, '_');
  return `vmx-wrap-deck-${part(subject)}-${part(term)}-${part(phase)}`;
}

/**
 * A card's identity: its topic and its name. An item renamed later loses its
 * mark, which is safer than a mark landing on another item.
 */
export const cardId = (item) => `${item?.topic ?? ''}|${item?.name ?? ''}`;

/** A clean deck: first card, nothing marked, no redo round. */
export const freshDeck = () => ({ v: DECK_VERSION, pos: 0, marks: {}, queue: null, done: false, pace: 'full' });

/**
 * The saved deck checked against today's cards. Marks for cards that are gone
 * are dropped, the position is kept inside the deck, and a redo round keeps
 * only cards that still exist and are still marked ต้องทวน.
 */
export function readDeck(raw, ids) {
  const fresh = freshDeck();
  const known = new Set(ids);
  let v;
  try { v = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return fresh; }
  if (!v || typeof v !== 'object' || v.v !== DECK_VERSION) return fresh;
  const marks = {};
  if (v.marks && typeof v.marks === 'object') {
    for (const [id, m] of Object.entries(v.marks)) {
      if (known.has(id) && (m === KNOWN || m === AGAIN)) marks[id] = m;
    }
  }
  const n = ids.length;
  const pos = Number.isInteger(v.pos) && v.pos >= 0 && v.pos < n ? v.pos : 0;
  let queue = null;
  if (Array.isArray(v.queue)) {
    queue = v.queue.filter((id, i, all) => known.has(id) && marks[id] === AGAIN && all.indexOf(id) === i);
    if (!queue.length) queue = null;
  }
  const pace = v.pace === 'quick' ? 'quick' : 'full';
  return { v: DECK_VERSION, pos: queue ? Math.max(0, ids.indexOf(queue[0])) : pos, marks, queue, done: v.done === true && n > 0, pace };
}

/** The cards with a given mark, in deck order. */
export const marked = (state, ids, mark) => ids.filter((id) => state.marks[id] === mark);

/** Move to a card without marking it (the arrows, the strip). */
export function goTo(state, ids, pos) {
  if (!ids.length) return state;
  return { ...state, pos: Math.max(0, Math.min(ids.length - 1, pos)), done: false };
}

/**
 * Mark the card on screen and move on: in a redo round to the next card of
 * that round, otherwise to the next card in the deck. Past the last card the
 * deck is done, and the view shows what is left to revise.
 * `mark` null moves on without marking (the quick round's "ถัดไป").
 */
export function rate(state, ids, mark) {
  const id = ids[state.pos];
  if (id === undefined) return state;
  const marks = { ...state.marks };
  if (mark === KNOWN || mark === AGAIN) marks[id] = mark;
  if (state.queue) {
    const queue = state.queue.filter((q) => q !== id);
    if (!queue.length) return { ...state, marks, queue: null, done: true };
    return { ...state, marks, queue, pos: ids.indexOf(queue[0]), done: false };
  }
  if (state.pos >= ids.length - 1) return { ...state, marks, done: true };
  return { ...state, marks, pos: state.pos + 1, done: false };
}

/** A round of only the ต้องทวน cards, from the first of them; unchanged when there are none. */
export function startRedo(state, ids) {
  const queue = marked(state, ids, AGAIN);
  if (!queue.length) return state;
  return { ...state, queue, pos: ids.indexOf(queue[0]), done: false };
}

/** Leave the redo round (or the summary) and carry on from the card on screen. */
export const resume = (state) => ({ ...state, queue: null, done: false });

/** Start again: nothing marked, the first card, the pace kept. */
export const restart = (state) => ({ ...freshDeck(), pace: state.pace });

/** How far the student is, for the strip and the summary. */
export function tally(state, ids) {
  const known = marked(state, ids, KNOWN).length;
  const again = marked(state, ids, AGAIN).length;
  return { total: ids.length, known, again, seen: known + again };
}

/** What the strip draws for each card: 'now', 'known', 'again' or ''. */
export function segments(state, ids) {
  return ids.map((id, i) => (i === state.pos && !state.done ? 'now' : state.marks[id] === KNOWN ? 'known' : state.marks[id] === AGAIN ? 'again' : ''));
}
