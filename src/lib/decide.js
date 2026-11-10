// ============================================================
// decide.js — the app decides for the student, says why, and steps aside
// ============================================================
// Palm, 11 Nov 2026: "ส่วนที่ให้users ตัดสินใจเยอะๆ อยากให้ลดลงแล้วเราใช้จิตวิทยา
// ตัดสินใจสิ่งที่ดีที่สุดและเข้าใจผู้ใช้ที่สุดให้แทนครับ จะได้ไม่รก", and "ฝังลงไปใน
// infrastructure ให้แข็งแกร่ง เป็นระบบ และต่อยอดได้เรื่อยๆ".
//
// One registry of the choices a student used to make before studying. Each
// decision (src/lib/decisions/*.js, all listed in decisions/index.js) turns
// what the app already knows (signals, handed in by the screen) into one value
// and one short Thai clause of why. The screen shows the value and the why in
// one line, the start button under it, and tucks the controls away. A choice
// the student makes there is remembered and wins next time.
//
// Principles every decision names in its header comment
// (docs/DECIDE-FOR-STUDENT.md):
//   default effect  the preselected option is the best one for this student
//   fewer choices   one option shown, the rest one tap away
//   a stated reason one short line of why builds trust in the default
//   yours wins      an explicit choice is remembered and respected
//   timely          the nearer the paper, the more exam-like
//
// Pure: no React, no clock, no storage inside a rule. Time arrives in the
// signals; storage is an injected { get, set, remove } that defaults to
// localStorage, and every access is wrapped, so a blocked store only means
// the app's own default is used. Each decision is its own module so a screen
// loads only the rules it uses (Home's budget is in perf-budgets.json).
//
// Never decided here, silently or otherwise: anything that changes scoring,
// deletes data or hides content. Those keep their explicit confirmation.
// ============================================================

export const DECIDE_PREFIX = 'vmx-decide:';
/** The why of a value the student set themselves. */
export const YOURS_WHY = 'ตามที่คุณตั้งไว้';

const browserStore = {
  get: (k) => localStorage.getItem(k),
  set: (k, v) => localStorage.setItem(k, v),
  remove: (k) => localStorage.removeItem(k),
};
const defaultIO = () => (typeof localStorage === 'undefined' ? null : browserStore);

export function safeGet(io, key) {
  try { return io ? io.get(key) ?? null : null; } catch { return null; }
}
function safeSet(io, key, value) {
  try { if (!io) return false; io.set(key, value); return true; } catch { return false; }
}
export function safeRemove(io, key) {
  try { io?.remove(key); } catch { /* a blocked store forgets nothing; the default still applies */ }
}
export function parse(raw) {
  if (raw == null) return undefined;
  try { return JSON.parse(raw); } catch { return undefined; }
}

// ── The registry ─────────────────────────────────────────────────────────────
// A decision: id; auto(signals) → { value, why }; valid(value) for a
// remembered value; key when the student's own choice is stored under
// vmx-decide:<key>; merge(auto, stored, signals) when a remembered choice
// covers only part of the value (null = it does not apply here); read/clear
// when the choice already lives under older keys of its own.
const REGISTRY = new Map();

/** Add a decision to the registry; returns its id for the screen to pass. */
export function defineDecision(entry) {
  if (!entry?.id || typeof entry.auto !== 'function' || typeof entry.valid !== 'function') {
    throw new Error('decide: a decision needs an id, auto() and valid()');
  }
  REGISTRY.set(entry.id, Object.freeze({ ...entry }));
  return entry.id;
}

export const decisionIds = () => [...REGISTRY.keys()];
export const decisionFor = (id) => REGISTRY.get(id) || null;

function entryFor(id) {
  const entry = REGISTRY.get(id);
  if (!entry) throw new Error(`decide: no decision named ${id}`);
  return entry;
}

/** The student's own remembered choice for a decision, or null. An invalid
 *  stored value is removed, never served. */
const isValid = (entry, value) => { try { return Boolean(entry.valid(value)); } catch { return false; } };

export function recall(id, io = defaultIO()) {
  const entry = entryFor(id);
  let stored;
  if (entry.read) {
    try { stored = entry.read(io); } catch { stored = undefined; }
    return stored !== undefined && isValid(entry, stored) ? stored : null;
  }
  if (!entry.key) return null;
  const key = DECIDE_PREFIX + entry.key;
  const raw = safeGet(io, key);
  stored = parse(raw);
  if (stored === undefined || !isValid(entry, stored)) {
    if (raw != null) safeRemove(io, key);
    return null;
  }
  return stored;
}

/**
 * The value a screen opens with: { value, why, by }. `by` is 'you' when the
 * student's remembered choice applies (why then says it follows them), else
 * 'auto' with the rule's own why.
 */
export function decide(id, signals = {}, io = defaultIO()) {
  const entry = entryFor(id);
  const auto = entry.auto(signals);
  const stored = recall(id, io);
  if (stored != null) {
    const value = entry.merge ? entry.merge(auto.value, stored, signals) : stored;
    // A remembered choice that changes nothing is not the student's: the line
    // then gives the app's own reason, and there is nothing to restore.
    if (value != null && !sameValue(value, auto.value)) return { value, why: YOURS_WHY, by: 'you' };
  }
  return { value: auto.value, why: auto.why, by: 'auto' };
}

/** Remember the student's explicit choice. Returns false when it is not a
 *  valid value or the store refused it. */
export function remember(id, value, io = defaultIO()) {
  const entry = entryFor(id);
  if (!entry.key || !isValid(entry, value)) return false;
  return safeSet(io, DECIDE_PREFIX + entry.key, JSON.stringify(value));
}

/** Add one row's change to what is remembered (a decision whose value is an
 *  object of rows). */
export function rememberRows(id, rows, io = defaultIO()) {
  return remember(id, { ...(recall(id, io) || {}), ...rows }, io);
}

/** Back to the app's own default. */
export function forget(id, io = defaultIO()) {
  const entry = entryFor(id);
  if (entry.clear) { try { entry.clear(io); } catch { /* the default still applies */ } return; }
  if (entry.key) safeRemove(io, DECIDE_PREFIX + entry.key);
}

// ── A why that is shown on the next screen, once ────────────────────────────
// A decision made on one screen and seen on the next (the first run's paper,
// shown on Home) leaves its why here for this tab session only.
const sessionStore = () => (typeof sessionStorage === 'undefined' ? null : {
  get: (k) => sessionStorage.getItem(k),
  set: (k, v) => sessionStorage.setItem(k, v),
  remove: (k) => sessionStorage.removeItem(k),
});
export function leaveWhy(screen, why, io = sessionStore()) {
  if (typeof why === 'string' && why) safeSet(io, `${DECIDE_PREFIX}why:${screen}`, why);
}
/** Read without removing: a render reads it, an effect then takes it. */
export function peekWhy(screen, io = sessionStore()) {
  return safeGet(io, `${DECIDE_PREFIX}why:${screen}`) || null;
}
export function takeWhy(screen, io = sessionStore()) {
  const why = safeGet(io, `${DECIDE_PREFIX}why:${screen}`);
  if (why != null) safeRemove(io, `${DECIDE_PREFIX}why:${screen}`);
  return why || null;
}

// ── "ปรับเอง", the one disclosure that holds what the app chose ─────────────
// Closed by default; its open state is remembered per device and per screen.
export function adjustOpen(screen, io = defaultIO()) {
  return safeGet(io, `${DECIDE_PREFIX}open:${screen}`) === '1';
}
export function setAdjustOpen(screen, open, io = defaultIO()) {
  if (open) safeSet(io, `${DECIDE_PREFIX}open:${screen}`, '1');
  else safeRemove(io, `${DECIDE_PREFIX}open:${screen}`);
}

// Shared by the decisions' valid() checks.
export const isObject = (v) => v != null && typeof v === 'object' && !Array.isArray(v);
export const intIn = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
export const validRows = (fields) => (v) => isObject(v) && Object.keys(v).length > 0
  && Object.entries(v).every(([k, x]) => Object.hasOwn(fields, k) && fields[k](x));

function sameValue(a, b) {
  if (a === b) return true;
  if (!isObject(a) || !isObject(b)) return false;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].every((k) => a[k] === b[k]);
}
