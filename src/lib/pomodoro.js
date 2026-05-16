// Pomodoro session log + config — localStorage-backed history of focus sessions.
//
// Design notes:
// - TWO localStorage keys (intentional separation so a corrupt config blob
//   never nukes the user's hard-won streak history, and vice versa):
//     'vmx-pomodoro'         → { sessions: [...], totalMin: N, currentStreak: N }
//     'vmx-pomodoro-config'  → { focusMin, shortBreakMin, longBreakMin }
// - Sessions FIFO-capped at 200 records (~14 KB) — way under any browser quota.
// - All reads are tolerant of missing/corrupt blobs (return sensible defaults).
// - Dispatches 'vmx-pomodoro-changed' on every write so open views refresh
//   without polling.
// - Pure storage helpers — no setInterval/timer code lives here.

const HISTORY_KEY = 'vmx-pomodoro';
const CONFIG_KEY = 'vmx-pomodoro-config';
const CAP = 200;

const DEFAULT_CONFIG = {
  focusMin: 25,
  shortBreakMin: 5,
  longBreakMin: 15,
};

function emptyHistory() {
  return { sessions: [], totalMin: 0, currentStreak: 0 };
}

function startOfDay(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function broadcast() {
  try {
    window.dispatchEvent(new Event('vmx-pomodoro-changed'));
  } catch {
    /* SSR / no-window — ignore */
  }
}

// --- History --------------------------------------------------------------

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return emptyHistory();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyHistory();
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      totalMin: Number(parsed.totalMin) || 0,
      currentStreak: Number(parsed.currentStreak) || 0,
    };
  } catch {
    return emptyHistory();
  }
}

function writeHistory(data) {
  try {
    // Cap sessions FIFO — keep most recent CAP rows.
    const sessions = Array.isArray(data.sessions) ? data.sessions : [];
    const trimmed = sessions.length > CAP ? sessions.slice(sessions.length - CAP) : sessions;
    const payload = {
      sessions: trimmed,
      totalMin: Number(data.totalMin) || 0,
      currentStreak: Number(data.currentStreak) || 0,
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify(payload));
    broadcast();
  } catch {
    /* quota / private mode — ignore */
  }
}

function computeStreak(sessions) {
  // Days with ≥1 completed session, counted back from today (or yesterday if
  // user hasn't completed today yet).
  const days = new Set();
  for (const s of sessions) {
    if (s.completed && s.date) days.add(startOfDay(s.date));
  }
  if (days.size === 0) return 0;
  const DAY = 24 * 60 * 60 * 1000;
  let cursor = startOfDay(Date.now());
  if (!days.has(cursor)) cursor -= DAY;
  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor -= DAY;
  }
  return streak;
}

export function recordSession({ durationMin, completed }) {
  const hist = loadHistory();
  const row = {
    date: Date.now(),
    durationMin: Number(durationMin) || 25,
    completed: !!completed,
  };
  const sessions = [...hist.sessions, row];
  const totalMin = sessions.reduce(
    (sum, s) => (s.completed ? sum + (Number(s.durationMin) || 0) : sum),
    0
  );
  const currentStreak = computeStreak(sessions);
  writeHistory({ sessions, totalMin, currentStreak });
}

export function getTotalMinutesToday() {
  const today = startOfDay(Date.now());
  return loadHistory().sessions.reduce((sum, s) => {
    if (!s.completed) return sum;
    return startOfDay(s.date) === today ? sum + (Number(s.durationMin) || 0) : sum;
  }, 0);
}

export function getSessionsCount() {
  const { sessions } = loadHistory();
  const today = startOfDay(Date.now());
  const weekAgo = today - 6 * 24 * 60 * 60 * 1000; // rolling 7-day window (today + 6 prior)
  let todayN = 0;
  let weekN = 0;
  let totalN = 0;
  for (const s of sessions) {
    if (!s.completed) continue;
    totalN += 1;
    const d = startOfDay(s.date);
    if (d === today) todayN += 1;
    if (d >= weekAgo) weekN += 1;
  }
  return { today: todayN, week: weekN, total: totalN };
}

// --- Config ---------------------------------------------------------------

export function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_CONFIG };
    return {
      focusMin: clamp(parsed.focusMin, 5, 90, DEFAULT_CONFIG.focusMin),
      shortBreakMin: clamp(parsed.shortBreakMin, 1, 30, DEFAULT_CONFIG.shortBreakMin),
      longBreakMin: clamp(parsed.longBreakMin, 5, 60, DEFAULT_CONFIG.longBreakMin),
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

function clamp(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function saveConfig(patch) {
  const current = loadConfig();
  const next = {
    focusMin: clamp(patch.focusMin ?? current.focusMin, 5, 90, current.focusMin),
    shortBreakMin: clamp(patch.shortBreakMin ?? current.shortBreakMin, 1, 30, current.shortBreakMin),
    longBreakMin: clamp(patch.longBreakMin ?? current.longBreakMin, 5, 60, current.longBreakMin),
  };
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
    broadcast();
  } catch {
    /* quota / private mode — ignore */
  }
  return next;
}

export const POMODORO_DEFAULTS = { ...DEFAULT_CONFIG };
