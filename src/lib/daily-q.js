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

import { yearForSubject, hiddenTopicIdsFor } from '../data/curriculum.js';
import { sweepStaleKeys } from './storage-gc.js';
import { isTextOnlyQuestion } from './question-surfaces.js';

export const TODAY_KEY_PREFIX = 'vmx-todays-q-';

// One question, one key, whatever type its id arrived as (banks carry
// numbers, a restored record may carry the same id as text).
const questionKey = (subject, id) => `${subject}:${String(id)}`;
const sameQuestion = (record, q) => !!record && !!q
  && record.qSubject === q.subject && String(record.qId) === String(q.id);

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
    !q.flag?.severity && // skip Qs with major data discrepancies
    // TodaysQModal draws the stem and options only: a question that reads
    // off a figure or a passage cannot be answered there.
    isTextOnlyQuestion(q)
  );
  if (year != null) {
    pool = pool.filter((q) => yearForSubject(q.subject) === year);
  }
  // Hidden topics are excluded from every advertised count and every pool
  // (exam-pool.js does the same), so the class question must not come from
  // one: the app would be handing out a question it says does not exist.
  // Once per subject, not once per question, like exam-pool.js.
  const hiddenBySubject = new Map();
  const hiddenFor = (subject) => {
    let hidden = hiddenBySubject.get(subject);
    if (!hidden) {
      hidden = hiddenTopicIdsFor(subject);
      hiddenBySubject.set(subject, hidden);
    }
    return hidden;
  };
  pool = pool.filter((q) => !hiddenFor(q.subject).has(q.topic));
  if (pool.length === 0) return null;
  // Stable order, so the pick depends only on (year, date) — never on the
  // order the lazy bank chunks happened to resolve in.
  pool.sort((a, b) => (`${a.subject}:${a.id}` < `${b.subject}:${b.id}` ? -1 : 1));
  const idx = hashStr(dateStr) % pool.length;
  return pool[idx];
}

// The day's record. Its top level is the FIRST answer of the day (the streak
// walk and the share grid read it); `byQuestion` holds every answer of the
// day under "subject:id". The pick is per year, so a student who switches
// year mid-day meets a second question: without the per-question entries
// the other year's question wore the first one's ✓, and answering it
// overwrote the record (OV-tools-41).
//
// With `q`, the status is that question's own: done only if it was answered.
// Without `q`, the day's: done if anything was answered (what the streak asks).
export function readTodaysQStatus(dateStr = todayKey(), q = null) {
  try {
    const raw = window.localStorage.getItem(TODAY_KEY_PREFIX + dateStr);
    if (!raw) return { completed: false };
    const record = JSON.parse(raw);
    if (!record || typeof record !== 'object') return { completed: false };
    const { byQuestion, ...day } = record;
    if (!q) return { completed: true, ...day };
    const own = byQuestion && typeof byQuestion === 'object' ? byQuestion[questionKey(q.subject, q.id)] : null;
    if (own) return { completed: true, ...own };
    // A record written before per-question entries carries one answer, at
    // the top level: it marks its own question and no other.
    if (sameQuestion(day, q)) return { completed: true, ...day };
    return { completed: false };
  } catch {
    return { completed: false };
  }
}

export function recordTodaysQAnswer({ qSubject, qId, choice, correct, dateStr = todayKey() }) {
  try {
    const storageKey = TODAY_KEY_PREFIX + dateStr;
    const answer = { qSubject, qId, choice, correct, ts: Date.now() };
    let existing = null;
    try { existing = JSON.parse(window.localStorage.getItem(storageKey) || 'null'); } catch { existing = null; }
    if (!existing || typeof existing !== 'object' || existing.qSubject == null) existing = null;
    const byQuestion = { ...(existing?.byQuestion || {}) };
    byQuestion[questionKey(qSubject, qId)] = answer;
    // Keep the day's first answer on top unless it was this question's own.
    const day = existing && !sameQuestion(existing, { subject: qSubject, id: qId })
      ? { qSubject: existing.qSubject, qId: existing.qId, choice: existing.choice, correct: existing.correct, ts: existing.ts }
      : answer;
    window.localStorage.setItem(storageKey, JSON.stringify({ ...day, byQuestion }));
    // One key was written per calendar day and none was ever removed, so a
    // term of daily questions is hundreds of dead entries. Yesterday's answer
    // is read by nothing; clear the other days as today's lands.
    sweepStaleKeys(window.localStorage, { today: dateStr });
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
