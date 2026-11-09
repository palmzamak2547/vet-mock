// Pomodoro session log + config — localStorage-backed history of focus sessions.
//
// Design notes:
// - TWO localStorage keys (intentional separation so a corrupt config blob
//   never nukes the user's hard-won streak history, and vice versa):
//     'vmx-pomodoro'         → { sessions: [...], totalMin: N, currentStreak: N, earlierRun? }
//     'vmx-pomodoro-config'  → { focusMin, shortBreakMin, longBreakMin }
// - Sessions capped at 200 records (~14 KB) — way under any browser quota.
//   Failed sessions go first; the study days of completed ones the cap drops
//   are kept as one run (`earlierRun`), so the streak outlives the cap.
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
  strictFocus: true,
};

function emptyHistory() {
  return { sessions: [], totalMin: 0, currentStreak: 0, earlierRun: null };
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
    const sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
    const earlierRun = readRun(parsed.earlierRun);
    return {
      sessions,
      totalMin: Number(parsed.totalMin) || 0,
      // Derived from the session dates on every read. The stored number is
      // the streak as of the last recorded session; handing it back as-is
      // meant a streak never expired while the student stayed away, and the
      // view still said 3 วัน after three days without a session.
      currentStreak: computeStreak(sessions, earlierRun),
      earlierRun,
    };
  } catch {
    return emptyHistory();
  }
}

function writeHistory(data) {
  try {
    const sessions = Array.isArray(data.sessions) ? data.sessions : [];
    const { kept, dropped } = capSessions(sessions);
    const earlierRun = extendRun(readRun(data.earlierRun), dropped);
    const totalMin = kept.reduce(
      (sum, s) => (s.completed ? sum + (Number(s.durationMin) || 0) : sum),
      0
    );
    const payload = {
      sessions: kept,
      totalMin,
      currentStreak: computeStreak(kept, earlierRun),
    };
    if (earlierRun) payload.earlierRun = earlierRun;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(payload));
    broadcast();
  } catch {
    /* quota / private mode — ignore */
  }
}

// Keep the newest CAP rows, failed sessions dropped first: nothing reads a
// failed row, and a run of them pushed out the completed rows that today's
// minutes, the counts and the streak are made of.
function capSessions(sessions) {
  let excess = sessions.length - CAP;
  if (excess <= 0) return { kept: sessions, dropped: [] };
  const failed = new Set();
  for (let i = 0; i < sessions.length && failed.size < excess; i += 1) {
    if (!sessions[i]?.completed) failed.add(i);
  }
  excess -= failed.size;
  const kept = [];
  const dropped = [];
  sessions.forEach((s, i) => {
    if (failed.has(i)) return;
    if (excess > 0) {
      excess -= 1;
      dropped.push(s);
    } else {
      kept.push(s);
    }
  });
  return { kept, dropped };
}

// The streak walks the days the rows cover, so once the cap dropped rows a
// streak longer than the kept rows reach was cut to them. The study days of
// dropped rows are kept as one run instead: `from` and `to` are the times of a
// session on its first and on its last day, and every day between is a study
// day. Only the newest run can still reach today, so an older one is let go
// once a gap separates it from a later dropped day.
function extendRun(run, dropped) {
  let next = run;
  for (const s of dropped) {
    const at = s?.completed && s.date ? new Date(s.date).getTime() : NaN;
    if (!Number.isFinite(at)) continue;
    const day = startOfDay(at);
    if (!next) {
      next = { from: at, to: at };
      continue;
    }
    const first = startOfDay(next.from);
    const last = startOfDay(next.to);
    if (day >= first && day <= last) continue;
    if (previousDay(day) === last) next = { from: next.from, to: at };
    else if (day > last) next = { from: at, to: at };
    else if (previousDay(first) === day) next = { from: at, to: next.to };
  }
  return next;
}

function readRun(run) {
  if (!run || typeof run !== 'object') return null;
  const { from, to } = run;
  return Number.isFinite(from) && Number.isFinite(to) && from > 0 && from <= to ? { from, to } : null;
}

function computeStreak(sessions, earlierRun = null) {
  // Days with ≥1 completed session, counted back from today (or yesterday if
  // user hasn't completed today yet).
  const days = new Set();
  for (const s of sessions) {
    if (s.completed && s.date) days.add(startOfDay(s.date));
  }
  if (days.size === 0 && !earlierRun) return 0;
  const first = earlierRun ? startOfDay(earlierRun.from) : Infinity;
  const last = earlierRun ? startOfDay(earlierRun.to) : -Infinity;
  const studied = (day) => days.has(day) || (day >= first && day <= last);
  let cursor = startOfDay(Date.now());
  if (!studied(cursor)) cursor = previousDay(cursor);
  let streak = 0;
  while (studied(cursor)) {
    streak += 1;
    cursor = previousDay(cursor);
  }
  return streak;
}

// Local midnight `days` calendar days before `dayStart` (one by default).
// Stepping by calendar day rather than by 24 h keeps the walk on midnights
// across a DST change.
function previousDay(dayStart, days = 1) {
  const d = new Date(dayStart);
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function recordSession({ durationMin, completed, endedAt }) {
  const hist = loadHistory();
  const now = Date.now();
  const row = {
    // A focus that ran out while the student was away is logged at the moment
    // it ended (never later than now), so its minutes and its streak day stay
    // on the day it ran instead of the day /app/focus was opened again.
    date: Number.isFinite(endedAt) ? Math.min(endedAt, now) : now,
    durationMin: Number(durationMin) || 25,
    completed: !!completed,
  };
  writeHistory({ sessions: [...hist.sessions, row], earlierRun: hist.earlierRun });
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
  // Rolling 7-day window (today + 6 prior), by calendar day: 6 × 24 h after a
  // fall-back day landed at 01:00 on day -6 and dropped that whole day.
  const weekAgo = previousDay(today, 6);
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
      strictFocus: typeof parsed.strictFocus === 'boolean' ? parsed.strictFocus : DEFAULT_CONFIG.strictFocus,
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
    strictFocus: typeof patch.strictFocus === 'boolean' ? patch.strictFocus : current.strictFocus,
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
