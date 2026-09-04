// ============================================================
// daily-q — deterministic Q pick for daily challenge
// ============================================================
//
// Uses a stable hash of the date string (YYYY-MM-DD) modulo the pool
// size so every student IN THE SAME YEAR sees the same Q on the same
// day — a habit anchor and a shared talking point ("ข้อวันนี้ตอบอะไร?").
//
// Two things the pool must not depend on, because both differ between
// students and even between two moments of one student's day:
//
//   • WHICH banks are loaded. QB is lazy and year-scoped, and switching
//     year appends into the same array, so `hash % pool.length` picked a
//     different question after the bank grew — the chip changed mid-day
//     while the answer already recorded under today's date belonged to
//     the question it used to show.
//   • The ORDER the chunks resolved in. The pick indexes the array, so
//     two students whose network delivered chunks in a different order
//     landed on different questions out of the same set.
//
// Hence: filter to the student's year, then sort by a stable key before
// indexing. Across years the question deliberately differs — a first-year
// student has no business being handed a year-5 paper — so the promise
// is per-year, and the copy must not claim more than that.
//
// We pick from MCQ-only Qs in subjects that are LIVE (not scaffold),
// to avoid showing essay/fill-blank Qs that need typed answers — the
// daily-Q UI is a quick "tap the right answer" loop.
// ============================================================

import { yearForSubject } from '../data/curriculum.js';

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

export function pickTodaysQ(qb, dateStr = todayKey(), { year = null } = {}) {
  if (!Array.isArray(qb) || qb.length === 0) return null;
  // Filter to MCQ-only, has options, not flagged, not scaffold subject
  let pool = qb.filter((q) =>
    q?.type === 'mcq' &&
    Array.isArray(q?.options) &&
    q.options.length >= 3 &&
    !q.flag?.severity // skip Qs with major data discrepancies
  );
  if (year != null) {
    pool = pool.filter((q) => yearForSubject(q.subject) === year);
  }
  if (pool.length === 0) return null;
  // Stable order, so the pick depends only on (year, date) — never on the
  // order the lazy bank chunks happened to resolve in.
  pool.sort((a, b) => (`${a.subject}:${a.id}` < `${b.subject}:${b.id}` ? -1 : 1));
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
  // Fire-and-forget class-pulse increment — Palm spec 2026-05-18 round 2.
  // Deduped per device per day (localStorage flag) so refreshing the
  // page or revisiting the daily-Q modal doesn't double-count.
  recordDailyQClassPulse(correct, dateStr);
}

// ─── Class pulse (Supabase aggregate) ───────────────────────────────
// Calls the public.record_daily_q_pulse(was_correct) RPC. Anonymous-
// callable. The aggregate row is keyed by date so the load on Postgres
// is one UPSERT per user per day, not per attempt. Client-side guard
// dedupes per device per day.
//
// Privacy: no userId, no IP, no fingerprint — just an integer counter.

export async function recordDailyQClassPulse(wasCorrect, dateStr = todayKey()) {
  if (typeof window === 'undefined') return;
  const flagKey = `vmx-daily-q-pulse-fired-${dateStr}`;
  try {
    if (window.localStorage.getItem(flagKey)) return; // already fired today
  } catch {}
  try {
    const mod = await import('./supabase.js');
    if (!mod.hasSupabase) return;
    const supabase = await mod.getSupabase();
    if (!supabase) return;
    const { error } = await supabase.rpc('record_daily_q_pulse', {
      was_correct: !!wasCorrect,
    });
    if (error) return;
    try { window.localStorage.setItem(flagKey, '1'); } catch {}
  } catch {
    // Silent — class pulse is decorative; never block daily-Q flow.
  }
}

// Fetch today's class-pulse aggregate. Returns { total, correct, pct }
// or null when unavailable / no rows yet. Used by HomeView to render
// "🌐 X คนทำ Daily Q วันนี้ · Y% ตอบถูก" chip.
export async function fetchTodaysClassPulse() {
  if (typeof window === 'undefined') return null;
  try {
    const mod = await import('./supabase.js');
    if (!mod.hasSupabase) return null;
    const supabase = await mod.getSupabase();
    if (!supabase) return null;
    const today = todayKey();
    const { data, error } = await supabase
      .from('daily_q_pulse')
      .select('total_attempts, correct_attempts')
      .eq('pulse_date', today)
      .maybeSingle();
    if (error || !data) return null;
    const total = Number(data.total_attempts || 0);
    const correct = Number(data.correct_attempts || 0);
    if (total <= 0) return null;
    return { total, correct, pct: Math.round((correct / total) * 100) };
  } catch {
    return null;
  }
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
