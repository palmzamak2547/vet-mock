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
  if (String(reason).startsWith('quest')) {
    try { const st = window.localStorage; st?.setItem('vmx-xp-pending', String((Math.floor(Number(st.getItem('vmx-xp-pending')) || 0)) + safeAmount)); } catch { /* private mode */ }
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
// device-only part is quest points, and it travels as a running number in
// the account's metadata, `xp_extra`, written through identity-write.js
// rarely: when a quest is claimed (a few times a day at most) and once,
// when this release first sees an account on a device that already had a
// higher counter.

/** Account metadata's carried XP (quest points and the one-time carry). */
export const extraXpOf = (user) => Math.max(0, Math.floor(Number(user?.user_metadata?.xp_extra) || 0));

/**
 * The XP a student sees, one function of data that follows the account:
 * the rebuilt answers and reviews plus the carried number. Two transitional
 * terms only, both on the device that earned them: quest points claimed
 * here and not yet added to the account (`pending`, flushed by XpChip within
 * a moment when online), and, until this device's one-time carry has been
 * recorded, the old counter where it is higher, so the level never drops
 * here while the carry is on its way. A guest has no account: this device's
 * own counter stands for it.
 */
export function shownXp({ history = [], srCards = {}, user = null, device = getXpState(), storage = globalThis.localStorage } = {}) {
  const rebuilt = accountXp({ history, srCards });
  const counter = Math.max(0, Number(device?.totalXp) || 0);
  if (!user?.id) return Math.max(rebuilt, counter);
  let carried = false;
  try { carried = storage?.getItem(carriedKey(user.id)) === '1'; } catch { carried = false; }
  const own = rebuilt + extraXpOf(user);
  return carried ? own + pendingXp(storage) : Math.max(own, counter);
}

const PENDING_KEY = 'vmx-xp-pending';
export const carriedKey = (uid) => `vmx-xp-carried:${uid}`;

/** Quest points earned here and not yet added to the account. */
export function pendingXp(storage = globalThis.localStorage) {
  try { return Math.max(0, Math.floor(Number(storage?.getItem(PENDING_KEY)) || 0)); } catch { return 0; }
}
export function setPendingXp(n, storage = globalThis.localStorage) {
  try { storage?.setItem(PENDING_KEY, String(Math.max(0, Math.floor(n) || 0))); } catch { /* private mode */ }
}

/**
 * How much to add to the account's carried XP now, and whether this is the
 * one-time carry. The first time a signed-in account is seen on a device
 * after this release, the old counter's lead over the account's number is
 * recorded ONCE (so the level never drops on the device in use); quest
 * points already in that counter are part of the lead, so the pending count
 * is folded into it. After that, only new quest points are added.
 */
export function xpToCarry({ user, history = [], srCards = {}, device = getXpState(), storage = globalThis.localStorage } = {}) {
  if (!user?.id) return { add: 0, first: false };
  let carried = false;
  try { carried = storage?.getItem(carriedKey(user.id)) === '1'; } catch { carried = true; }
  const pending = pendingXp(storage);
  if (carried) return { add: pending, first: false };
  const lead = Math.max(0, Math.floor(Number(device?.totalXp) || 0)) - (accountXp({ history, srCards }) + extraXpOf(user));
  return { add: Math.max(0, lead), first: true };
}
