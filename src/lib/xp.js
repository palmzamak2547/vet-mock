// XP system — accumulates lifetime points from answering Qs, grading
// SR cards, reading notes, and claiming daily quests. Level curve is
// `floor(sqrt(totalXp / 50))` → first 5 level thresholds: 0, 50, 200,
// 450, 800, 1250 XP. Squared so early levels feel fast; later levels
// taper without ever capping.
//
// Storage: single `vmx-xp` key. Reads tolerate corrupted JSON (try /
// catch around every parse). Writes dispatch `vmx-xp-changed` so the
// XpChip + QuestsPanel can re-render without polling.

const STORAGE_KEY = 'vmx-xp';
const EVENT_NAME = 'vmx-xp-changed';

export const XP_AWARDS = Object.freeze({
  correctAnswer: 5,
  wrongAnswer: 2,
  srGrade: 3,
  dailyQ: 10,
  notesRead: 5,
});

const DEFAULT_STATE = Object.freeze({
  totalXp: 0,
  lifetimeQs: 0,
  lastUpdated: 0,
  todayXp: 0,
  todayDate: '',
});

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getXpState() {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage?.getItem(STORAGE_KEY) : null;
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    // The day rollover used to happen only inside awardXp, so reading the
    // state on a new day returned YESTERDAY's total and the chip announced
    // it as "วันนี้" until the next award happened to reset it. Rolling
    // over on read means every consumer sees today's number, today.
    const sameDay = parsed.todayDate === todayKey();
    return {
      ...DEFAULT_STATE,
      ...parsed,
      totalXp: Math.max(0, Number(parsed.totalXp) || 0),
      lifetimeQs: Math.max(0, Number(parsed.lifetimeQs) || 0),
      todayXp: sameDay ? Math.max(0, Number(parsed.todayXp) || 0) : 0,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function persist(state) {
  try {
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function awardXp(amount, reason = 'misc') {
  const safeAmount = Math.max(0, Math.floor(Number(amount) || 0));
  if (safeAmount === 0) return getXpState().totalXp;
  // Quest points are the one award no synced record holds: count them until
  // they are added to the account (XpChip, lib/identity-write.js).
  // Kept per account: a second student on this phone never inherits them.
  if (String(reason).startsWith('quest')) {
    try {
      const st = window.localStorage;
      const uid = deviceAccount(st);
      if (uid) st.setItem(pendingKey(uid), String(pendingXp(uid, st) + safeAmount));
    } catch { /* private mode */ }
  }
  const cur = getXpState();
  const today = todayKey();
  const next = {
    totalXp: cur.totalXp + safeAmount,
    lifetimeQs: cur.lifetimeQs + (reason === 'exam' ? 1 : 0),
    lastUpdated: Date.now(),
    todayDate: today,
    todayXp: cur.todayDate === today ? (cur.todayXp || 0) + safeAmount : safeAmount,
  };
  persist(next);
  try {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { amount: safeAmount, reason, total: next.totalXp } }));
  } catch {}
  return next.totalXp;
}

export function levelFor(totalXp) {
  const xp = Math.max(0, Number(totalXp) || 0);
  return Math.floor(Math.sqrt(xp / 50));
}

export function xpForLevel(level) {
  const lvl = Math.max(0, Math.floor(Number(level) || 0));
  return lvl * lvl * 50;
}

export function xpForNextLevel(totalXp) {
  const xp = Math.max(0, Number(totalXp) || 0);
  const lvl = levelFor(xp);
  const floor = xpForLevel(lvl);
  const ceil = xpForLevel(lvl + 1);
  const current = xp - floor;
  const needed = Math.max(1, ceil - floor);
  const pct = Math.min(100, Math.round((current / needed) * 100));
  return { current, needed, pct, level: lvl, nextLevel: lvl + 1 };
}

export const XP_EVENT = EVENT_NAME;

/**
 * XP rebuilt from what follows the account: every answer in the synced
 * history (XP_AWARDS for a right or a wrong answer) and every review counted
 * on a synced SR card. Any device holding the account computes the same
 * number from the same rows, so the level is the same everywhere.
 */
export function accountXp({ history = [], srCards = {} } = {}) {
  let xp = 0;
  for (const row of Array.isArray(history) ? history : []) {
    if (!row) continue;
    xp += row.correct === true ? XP_AWARDS.correctAnswer : XP_AWARDS.wrongAnswer;
  }
  for (const card of Object.values(srCards && typeof srCards === 'object' ? srCards : {})) {
    const n = Math.max(0, Math.floor(Number(card?.totalReviews) || 0));
    xp += n * XP_AWARDS.srGrade;
  }
  return xp;
}

// ── The level that follows the account ─────────────────────────────
// What the app awards XP for today: answers (in the synced history), SR
// grades (counted on the synced cards) and daily-quest rewards (quests.js,
// kept per day on the device only). The daily question and reading award
// nothing (XP_AWARDS.dailyQ and notesRead are never granted). So the one
// device-only part is quest points. It travels in the account's metadata,
// written through identity-write.js rarely:
//   xp_quests   quest points, added when a quest is claimed (a few a day)
//   xp_carry    { <device id>: n }: this device's old counter's lead over the
//               account, recorded once per device. Keyed by device, so a
//               second tab writing it again overwrites, never adds.

const SYNC_OWNER_KEY = 'vmx-user-sync-owner-v1';
const DEVICE_KEY = 'vmx-device-id';
const OWNER_KEY = 'vmx-xp-owner';
export const carriedKey = (uid) => `vmx-xp-carried:${uid}`;
export const pendingKey = (uid) => `vmx-xp-pending:${uid}`;

const read = (storage, key) => { try { return storage?.getItem(key) ?? null; } catch { return null; } };
const write = (storage, key, value) => { try { storage?.setItem(key, String(value)); } catch { /* private mode */ } };
const count = (value) => Math.max(0, Math.floor(Number(value) || 0));

/** The account the sync store holds this device for, or null for a guest. */
export function deviceAccount(storage = globalThis.localStorage) {
  try {
    const v = JSON.parse(read(storage, SYNC_OWNER_KEY) || 'null');
    return typeof v === 'string' && v && v !== 'anonymous' ? v : null;
  } catch { return null; }
}

/** A random id for this browser, made once. */
export function deviceId(storage = globalThis.localStorage) {
  let id = read(storage, DEVICE_KEY);
  if (!id) {
    id = globalThis.crypto?.randomUUID?.() || `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    write(storage, DEVICE_KEY, id);
  }
  return id;
}

/** The account metadata's carried XP: quest points and every device's carry. */
export function extraXpOf(user) {
  const md = user?.user_metadata || {};
  const carries = md.xp_carry && typeof md.xp_carry === 'object' ? Object.values(md.xp_carry) : [];
  return count(md.xp_quests) + carries.reduce((sum, n) => sum + count(n), 0);
}

/** Quest points this account earned on this device and not yet added. */
export const pendingXp = (uid, storage = globalThis.localStorage) => (uid ? count(read(storage, pendingKey(uid))) : 0);
export const setPendingXp = (uid, n, storage = globalThis.localStorage) => { if (uid) write(storage, pendingKey(uid), count(n)); };

/**
 * Whether this device's old counter can be this account's. Every answer the
 * account gave here is in its synced history, so a counter that recorded more
 * answers than the whole history holds also counts someone else's (a second
 * student on a shared phone). Once one account has carried it, it is that
 * account's alone.
 */
export function counterIsTheirs({ user, history = [], device = getXpState(), storage = globalThis.localStorage } = {}) {
  if (!user?.id) return false;
  const owner = read(storage, OWNER_KEY);
  if (owner) return owner === user.id;
  return count(device?.lifetimeQs) <= (Array.isArray(history) ? history.length : 0);
}

/**
 * The XP a student sees, one function of data that follows the account:
 * rebuilt answers and reviews plus the carried metadata. Two terms are
 * transitional, both only on the device that earned them: this account's
 * quest points not yet added (flushed by XpChip within a moment when online),
 * and, until this device's one-time carry is recorded, the old counter where
 * it is higher and can be this account's. A guest's level is the counter.
 */
export function shownXp({ history = [], srCards = {}, user = null, device = getXpState(), storage = globalThis.localStorage } = {}) {
  const rebuilt = accountXp({ history, srCards });
  const counter = count(device?.totalXp);
  if (!user?.id) return Math.max(rebuilt, counter);
  const own = rebuilt + extraXpOf(user) + pendingXp(user.id, storage);
  const carried = read(storage, carriedKey(user.id)) === '1';
  if (carried || !counterIsTheirs({ user, history, device, storage })) return own;
  return Math.max(own, counter);
}

/**
 * What to add to the account now. `ready` is the sync store having finished
 * this account's first pull: before that its history is empty, and a lead
 * measured then would count every answer twice. The carry is this device's
 * counter's lead over the account excluding this device's own earlier carry
 * (so writing it again is the same number), only where the counter can be
 * this account's; quest points already counted on the device are inside it.
 */
export function xpToCarry({ user, history = [], srCards = {}, device = getXpState(), storage = globalThis.localStorage, ready = false } = {}) {
  const none = { addQuests: 0, carry: null, first: false };
  if (!user?.id || !ready) return none;
  const pending = pendingXp(user.id, storage);
  if (read(storage, carriedKey(user.id)) === '1') return { ...none, addQuests: pending };
  if (!counterIsTheirs({ user, history, device, storage })) return { ...none, addQuests: pending, first: true, owns: false };
  const id = deviceId(storage);
  const md = user.user_metadata || {};
  const mine = count(md.xp_carry?.[id]);
  const others = extraXpOf(user) - mine;
  const lead = count(device?.totalXp) - (accountXp({ history, srCards }) + others);
  return { addQuests: 0, carry: { device: id, value: Math.max(0, lead) }, first: true, owns: true };
}

/** Record on the device that the carry for this account is done. */
export function markCarried(uid, storage = globalThis.localStorage, { owns = true } = {}) {
  write(storage, carriedKey(uid), '1');
  if (owns && !read(storage, OWNER_KEY)) write(storage, OWNER_KEY, uid);
}
