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
