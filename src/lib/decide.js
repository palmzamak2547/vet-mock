// ============================================================
// decide.js — the app decides for the student, says why, and steps aside
// ============================================================
// Palm, 11 Nov 2026: "ส่วนที่ให้users ตัดสินใจเยอะๆ อยากให้ลดลงแล้วเราใช้จิตวิทยา
// ตัดสินใจสิ่งที่ดีที่สุดและเข้าใจผู้ใช้ที่สุดให้แทนครับ จะได้ไม่รก", and "ฝังลงไปใน
// infrastructure ให้แข็งแกร่ง เป็นระบบ และต่อยอดได้เรื่อยๆ".
//
// One registry of the choices a student used to make before studying. Each
// entry turns what the app already knows (signals, handed in by the screen)
// into one value and one short Thai clause of why. The screen shows the value
// and the why in one line, the start button under it, and tucks the controls
// away. A choice the student makes there is remembered and wins next time.
//
// Principles every entry names (docs/DECIDE-FOR-STUDENT.md):
//   default effect  the preselected option is the best one for this student
//   fewer choices   one option shown, the rest one tap away
//   a stated reason one short line of why builds trust in the default
//   yours wins      an explicit choice is remembered and respected
//   timely          the nearer the paper, the more exam-like
//
// Pure: no React, no clock, no storage inside a rule. Time arrives in the
// signals; storage is an injected { get, set, remove } that defaults to
// localStorage, and every access is wrapped, so a blocked store only means
// the app's own default is used.
//
// Never decided here, silently or otherwise: anything that changes scoring,
// deletes data or hides content. Those keep their explicit confirmation.
// ============================================================
import { ladderPreset } from './practice-ladder.js';
import { phaseLabel, phaseOrder } from './current-phase.js';

export const DECIDE_PREFIX = 'vmx-decide:';
/** The why of a value the student set themselves. */
export const YOURS_WHY = 'ตามที่คุณตั้งไว้';

const browserStore = {
  get: (k) => localStorage.getItem(k),
  set: (k, v) => localStorage.setItem(k, v),
  remove: (k) => localStorage.removeItem(k),
};
const defaultIO = () => (typeof localStorage === 'undefined' ? null : browserStore);

function safeGet(io, key) {
  try { return io ? io.get(key) ?? null : null; } catch { return null; }
}
function safeSet(io, key, value) {
  try { if (!io) return false; io.set(key, value); return true; } catch { return false; }
}
function safeRemove(io, key) {
  try { io?.remove(key); } catch { /* a blocked store forgets nothing; the default still applies */ }
}
function parse(raw) {
  if (raw == null) return undefined;
  try { return JSON.parse(raw); } catch { return undefined; }
}

const isObject = (v) => v != null && typeof v === 'object' && !Array.isArray(v);
const intIn = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
const capTo = (n, available) => (Number.isFinite(available) && available > 0 ? Math.min(n, Math.floor(available)) : n);
const daysClause = (days, what) => (!Number.isInteger(days) || days < 0 || days > 14 ? ''
  : days === 0 ? `, สอบ${what}วันนี้` : `, อีก ${days} วันสอบ${what}`);

// ── The registry ─────────────────────────────────────────────────────────────
// An entry: id; principle (one English line, the behavioural rule it applies);
// auto(signals) → { value, why }; valid(value) for a remembered value; key
// when the student's own choice is stored under vmx-decide:<key>; merge(auto,
// stored, signals) when a remembered choice covers only part of the value
// (null = it does not apply here); read/clear when the choice already lives
// under older keys of its own.
const PRACTICE_FIELDS = {
  numQuestions: (v) => intIn(v, 1, 1000),
  useTimer: (v) => typeof v === 'boolean',
  timePerQ: (v) => intIn(v, 5, 3600),
  instantFeedback: (v) => typeof v === 'boolean',
  pick: (v) => v === 'random' || v === 'adaptive',
};

const SR_DEFAULT = Object.freeze({ yearScope: 'current', subject: 'all', phaseScope: 'current', size: 25, scheduler: 'sm2' });
// The planner's rows have stored the student's picks under these keys since
// before this registry; a value other than the default is the student's own.
const SR_KEYS = { size: 'vmx-sr-session-size', subject: 'vmx-sr-subject-filter', yearScope: 'vmx-sr-year-scope', phaseScope: 'vmx-sr-phase-scope' };
const SR_SCHEDULER_KEY = 'vmx-sr-scheduler';
const SR_FIELDS = {
  size: (v) => v === 'all' || intIn(v, 1, 1000),
  subject: (v) => typeof v === 'string' && v.length > 0 && v.length < 80,
  yearScope: (v) => v === 'current' || v === 'all',
  phaseScope: (v) => v === 'current' || v === 'all',
  scheduler: (v) => v === 'sm2' || v === 'fsrs',
};

const validFields = (fields) => (v) => isObject(v) && Object.keys(v).length > 0
  && Object.entries(v).every(([k, x]) => fields[k] && fields[k](x));

export const DECISIONS = Object.freeze({
  // Default effect + a stated reason: a topic tap opens on the student's rung
  // of the practice ladder, exactly the set the ladder has always made, and
  // says so; yours wins for any row they change.
  'practice.setup': {
    id: 'practice.setup',
    principle: 'Default effect: the ladder rung the student is on sets the whole set; yours wins row by row.',
    key: 'practice.setup',
    valid: validFields(PRACTICE_FIELDS),
    auto(s = {}) {
      const step = s.step === 'timed' ? 'timed' : 'understand';
      const available = Number.isFinite(s.available) && s.available > 0 ? s.available : null;
      const preset = ladderPreset(step, { available, timePerQ: s.timePerQ });
      const value = {
        step,
        numQuestions: preset.numQuestions,
        useTimer: preset.useTimer,
        timePerQ: preset.timePerQ,
        // Rung 1 is built on the answer after every question; rung 2 keeps the
        // student's feedback switch, as the topic tap always has.
        instantFeedback: preset.useTimer ? s.instantFeedback !== false : true,
        pick: s.pick === 'adaptive' ? 'adaptive' : 'random',
      };
      const base = step === 'timed' ? 'ขั้นใช้ความรู้ที่คุณขึ้นมาแล้ว จับเวลาทีละข้อ'
        : s.hasHistory ? 'ขั้นทำความเข้าใจ ข้อง่ายก่อน เห็นเฉลยทุกข้อ'
          : 'เริ่มขั้นแรก ข้อง่ายก่อน เห็นเฉลยทุกข้อ';
      return { value, why: base + daysClause(s.daysToPaper, 'วิชานี้') };
    },
    merge(auto, stored, s = {}) {
      const value = { ...auto, ...stored };
      value.numQuestions = capTo(value.numQuestions, s.available);
      value.step = value.useTimer ? 'timed' : 'understand';
      return value;
    },
  },

  // Default effect: today's review is the plan Home computed, else a size a
  // day can hold; yours wins for the rows the student set (stored under the
  // planner's own keys). A plan's size is for that one session and wins.
  'sr.setup': {
    id: 'sr.setup',
    principle: 'Default effect: today\'s plan, or a size one day can hold, oldest cards first; yours wins.',
    valid: validFields(SR_FIELDS),
    auto(s = {}) {
      const plan = Number.isInteger(s.planSize) && s.planSize > 0 ? s.planSize : null;
      const value = { ...SR_DEFAULT, size: plan ?? SR_DEFAULT.size };
      const why = plan ? 'ตามแผนวันนี้จากหน้าแรก'
        : s.dueReviewed > 0 ? 'ใบที่ค้างนานสุดมาก่อน ทีละ 25 ใบพอดีกับหนึ่งวัน'
          : s.newCount > 0 ? 'เริ่มทีละ 25 ใบ ทำทุกวันได้ผลกว่าทำทีเดียวเยอะ'
            : 'ยังไม่มีใบถึงรอบ';
      return { value, why };
    },
    read(io) {
      const out = {};
      for (const [field, key] of Object.entries(SR_KEYS)) {
        const v = parse(safeGet(io, key));
        if (v !== undefined && v !== SR_DEFAULT[field]) out[field] = v;
      }
      const scheduler = safeGet(io, SR_SCHEDULER_KEY);
      if (scheduler && scheduler !== SR_DEFAULT.scheduler) out.scheduler = scheduler;
      return Object.keys(out).length ? out : undefined;
    },
    clear(io) {
      for (const key of Object.values(SR_KEYS)) safeRemove(io, key);
      safeRemove(io, SR_SCHEDULER_KEY);
    },
    merge(auto, stored, s = {}) {
      const own = { ...stored };
      if (Number.isInteger(s.planSize) && s.planSize > 0) delete own.size;
      return Object.keys(own).length ? { ...auto, ...own } : null;
    },
  },

  // Default effect + timely: after the year, the paper the timetable has
  // current is the paper; only when it has none does the student choose.
  'phase.firstRun': {
    id: 'phase.firstRun',
    principle: 'Default effect + timely: the timetable\'s current paper is chosen; the student is asked only when it has none.',
    valid: (v) => isObject(v) && (v.phase === null || phaseOrder(v.phase) >= 0),
    auto(s = {}) {
      const phase = !s.scaffold && phaseOrder(s.current) >= 0 ? s.current : null;
      return phase
        ? { value: { phase, ask: false }, why: `เลือก${phaseLabel(phase)}ให้ตามตารางสอบ` }
        : { value: { phase: null, ask: !s.scaffold }, why: '' };
    },
  },

  // Fewer choices + timely: Home shows one practice mode first. Near a paper
  // the exam-prep card; else wrong answers to redo; else the weakest topic;
  // else this term's checked slides; else the free practice card.
  'home.mode': {
    id: 'home.mode',
    principle: 'Fewer choices + timely: one practice mode first, the nearer the paper the more exam-like.',
    valid: (v) => typeof v === 'string' && v.length > 0,
    auto(s = {}) {
      const has = (id) => Array.isArray(s.cards) && s.cards.includes(id);
      if (has('near-exam') && Number.isInteger(s.daysToPaper) && s.daysToPaper >= 0 && s.daysToPaper <= 14) {
        const name = s.paperSubject || 'วิชาถัดไป';
        return { value: 'near-exam', why: s.daysToPaper === 0 ? `สอบ${name}วันนี้` : `อีก ${s.daysToPaper} วันสอบ${name}` };
      }
      if (has('wrong') && s.wrongCount > 0) return { value: 'wrong', why: `มีข้อที่ยังตอบผิด ${s.wrongCount} ข้อ` };
      if (has('weak')) return { value: 'weak', why: Number.isFinite(s.weakPct) ? `หัวข้อที่คุณตอบถูก ${s.weakPct}% ฝึกตรงนี้คุ้มที่สุด` : 'หัวข้อที่คุณพลาดบ่อยที่สุด' };
      if (has('current-scope')) return { value: 'current-scope', why: 'ข้อของเทอมนี้ที่ตรวจเฉลยแล้ว ตรงกับสไลด์' };
      const first = has('pick-count') ? 'pick-count' : (s.cards || [])[0] || 'pick-count';
      return { value: first, why: 'สุ่มข้อจากทุกวิชาของปีนี้' };
    },
  },
});

export const DECISION_IDS = Object.freeze(Object.keys(DECISIONS));

function entryFor(id) {
  const entry = DECISIONS[id];
  if (!entry) throw new Error(`decide: no decision named ${id}`);
  return entry;
}

/** The student's own remembered choice for a decision, or null. An invalid
 *  stored value is removed, never served. */
export function recall(id, io = defaultIO()) {
  const entry = entryFor(id);
  let stored;
  if (entry.read) {
    try { stored = entry.read(io); } catch { stored = undefined; }
    return stored !== undefined && entry.valid(stored) ? stored : null;
  }
  if (!entry.key) return null;
  const key = DECIDE_PREFIX + entry.key;
  stored = parse(safeGet(io, key));
  if (stored === undefined) {
    if (safeGet(io, key) != null) safeRemove(io, key);
    return null;
  }
  if (!entry.valid(stored)) { safeRemove(io, key); return null; }
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
    if (value != null) return { value, why: YOURS_WHY, by: 'you' };
  }
  return { value: auto.value, why: auto.why, by: 'auto' };
}

/** Remember the student's explicit choice. Returns false when it is not a
 *  valid value or the store refused it. */
export function remember(id, value, io = defaultIO()) {
  const entry = entryFor(id);
  if (!entry.key || !entry.valid(value)) return false;
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
