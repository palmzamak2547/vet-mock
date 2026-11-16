// ============================================================
// case-ops.js — making and undoing the marks on a case
// ============================================================
// What a hand needs once it marks: the colours, a new highlight with its
// quote, the ops that add and remove marks, and their undo history. Nothing
// here is needed to draw a case with its marks (case-marks.js), so it loads
// with the hand (ink/case-hand.js) and stays out of the exam's own chunk.
// ============================================================
import { quoteAt } from './case-marks.js';

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

/** A pen colour as the canvas needs it: the token's value now, in this theme. */
export function penInk(id) {
  const c = PEN_COLORS.find((x) => x.id === id) || PEN_COLORS[0];
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(c.token).trim();
    if (v) return v;
  } catch { /* no document */ }
  return 'currentColor';
}

let idSeq = 0;
export const newMarkId = () => `m${Date.now().toString(36)}${(idSeq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** A highlight, the snapped range of `text`, in `color`. */
export function makeRange(text, { start, end }, color = 'lemon') {
  return { id: newMarkId(), kind: 'range', style: 'wash', start, end, color, quote: quoteAt(text, start, end) };
}

// ── undo and redo ───────────────────────────────────────────
// An op adds and removes whole marks; undoing it removes what it added and
// puts back what it removed.
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

// Undo is kept for the page's life, so it survives the card moving to the next part, and it is kept per
// text: the stages of a case share one record (its key), but undo in one stage undoes only what was done
// in that stage's view, never a mark of a later stage that this view does not show.
const HISTORIES = new Map();
export function historyFor(key, text = '') {
  const id = `${key}\u0000${text}`;
  if (!HISTORIES.has(id)) HISTORIES.set(id, createHistory());
  return HISTORIES.get(id);
}
