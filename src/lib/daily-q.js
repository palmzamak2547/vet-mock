// ============================================================
// daily-q — deterministic Q pick for daily challenge
// ============================================================
//
// Uses a stable hash of the date string (YYYY-MM-DD) modulo the pool
// size so every user sees the same Q on the same day — turns into
// a habit anchor + a shared talking point ("ข้อวันนี้ตอบอะไร?").
//
// We pick from MCQ-only Qs in subjects that are LIVE (not scaffold),
// to avoid showing essay/fill-blank Qs that need typed answers — the
// daily-Q UI is a quick "tap the right answer" loop.
// ============================================================

export const TODAY_KEY_PREFIX = 'vmx-todays-q-';

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Simple FNV-1a 32-bit hash — deterministic, no deps, stable across
// browsers. Produces an integer we can mod by the pool size.
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickTodaysQ(qb, dateStr = todayKey()) {
  if (!Array.isArray(qb) || qb.length === 0) return null;
  // Filter to MCQ-only, has options, not flagged, not scaffold subject
  const pool = qb.filter((q) =>
    q?.type === 'mcq' &&
    Array.isArray(q?.options) &&
    q.options.length >= 3 &&
    !q.flag?.severity // skip Qs with major data discrepancies
  );
  if (pool.length === 0) return null;
  const idx = hashStr(dateStr) % pool.length;
  return pool[idx];
}

export function readTodaysQStatus(dateStr = todayKey()) {
  try {
    const raw = window.localStorage.getItem(TODAY_KEY_PREFIX + dateStr);
    if (!raw) return { completed: false };
    return { completed: true, ...JSON.parse(raw) };
  } catch {
    return { completed: false };
  }
}

export function recordTodaysQAnswer({ qSubject, qId, choice, correct, dateStr = todayKey() }) {
  try {
    const payload = JSON.stringify({ qSubject, qId, choice, correct, ts: Date.now() });
    window.localStorage.setItem(TODAY_KEY_PREFIX + dateStr, payload);
  } catch {}
}

// Read the recorded result for a specific date — returns 'correct',
// 'wrong', or null (no record / parse error). Used by the daily-q
// history layer to build the emoji-grid share card. Reads the SAME
// per-day key that recordTodaysQAnswer writes, so no migration needed.
export function getDailyQResultForDate(dateStr) {
  try {
    const raw = window.localStorage.getItem(TODAY_KEY_PREFIX + dateStr);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.correct !== 'boolean') return null;
    return parsed.correct ? 'correct' : 'wrong';
  } catch {
    return null;
  }
}

// Streak across consecutive days that the user actually answered.
// Walks backward from today; stops at the first day with no record.
export function dailyQStreak() {
  let count = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (readTodaysQStatus(key).completed) {
      count++;
      d.setDate(d.getDate() - 1);
    } else {
      // Allow today itself to be "not yet done" — only the day BEFORE
      // breaks the streak. Skip the first iteration's miss.
      if (i === 0) {
        d.setDate(d.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return count;
}
