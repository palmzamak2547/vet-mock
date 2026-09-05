// ============================================================
// phase-wrapped — Spotify-Wrapped-style end-of-phase recap
// ============================================================
//
// After an exam phase finishes (Midterm or Final), we want to
// reward the student with a shareable "your term in numbers"
// card — total Qs answered, mastery %, weakest/strongest
// subject, peak streak, hours studied, daily bar chart.
//
// Pure helpers here. UI lives in <PhaseWrappedCard /> +
// <PhaseWrappedView />.
//
// Phase ID convention (mirrors PhaseSelectView's PHASES):
//   '1-mid'   · เทอม 1 กลางภาค · sem 1 midterm  · months 8-10
//   '1-final' · เทอม 1 ปลายภาค · sem 1 final    · months 11-12
//   '2-mid'   · เทอม 2 กลางภาค · sem 2 midterm  · months 2-3
//   '2-final' · เทอม 2 ปลายภาค · sem 2 final    · months 4-5
//
// A "completed" phase = today is AFTER the last exam date for
// that phase. We surface its wrapped card until the user dismisses
// it via `markWrappedDismissed(phaseId)`.
//
// All localStorage access is defensive — quota / private mode /
// disabled storage cannot break callers.
// ============================================================

import { EXAM_SCHEDULE } from '../data/schedule.js';
import { CURRENT_YEAR } from '../data/curriculum.js';

// ── Phase metadata ────────────────────────────────────────────
// Months mirror PhaseSelectView's heuristic. Ordering matters for
// "current phase" detection — first match wins, but we also fall
// back gracefully when today lands between phases.
export const PHASE_DEFS = [
  { id: '1-mid',   label: 'เทอม 1 กลางภาค', months: [8, 9, 10],  semester: 1, kind: 'mid'   },
  { id: '1-final', label: 'เทอม 1 ปลายภาค', months: [11, 12],    semester: 1, kind: 'final' },
  { id: '2-mid',   label: 'เทอม 2 กลางภาค', months: [1, 2, 3],   semester: 2, kind: 'mid'   },
  { id: '2-final', label: 'เทอม 2 ปลายภาค', months: [4, 5],      semester: 2, kind: 'final' },
];

// Window (in days) after a phase ends during which the wrapped
// banner stays visible. 21 days lets returning users still see
// their recap a couple of weeks into the break, but it doesn't
// linger forever and become noise next term.
const POST_PHASE_WINDOW_DAYS = 21;

// localStorage key — single JSON blob keyed by phaseId so we
// don't pollute the LS namespace with one key per phase.
const LS_DISMISSED_KEY = 'vmx-wrapped-dismissed';

// Heuristic when a history row carries no explicit duration:
// 45 s / Q is a conservative MCQ-practice average (real-exam
// pace is closer to 60-90 s/Q, but practice is faster).
const AVG_SECONDS_PER_Q = 45;

// ── localStorage helpers (defensive) ──────────────────────────
function safeReadLS(key, fallback) {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
}

function safeWriteLS(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota / private mode — silent
  }
}

// ── Date helpers ──────────────────────────────────────────────
function ymd(d) {
  return new Date(d).toLocaleDateString('en-CA');
}

function startOfDay(d) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

// ── Year normaliser ───────────────────────────────────────────
// Schedule keys are 'y4', 'y5'… but callers may pass a number.
function yearKeyOf(year) {
  if (year == null) return 'y4';
  return String(year).startsWith('y') ? String(year) : `y${year}`;
}

// Map an exam-row date ('YYYY-MM-DD') to the phase that owns it.
// Returns the phase def or null when month doesn't match any.
function phaseForExamDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const m = d.getMonth() + 1; // 1-12
  for (const p of PHASE_DEFS) {
    if (p.months.includes(m)) return p;
  }
  return null;
}

// Group exams per phase, return { [phaseId]: { firstDate, lastDate } }
function phaseBoundsByYear(yearKey) {
  const list = EXAM_SCHEDULE[yearKey] || [];
  const bounds = {};
  for (const exam of list) {
    const p = phaseForExamDate(exam.date);
    if (!p) continue;
    const d = new Date(exam.date);
    if (Number.isNaN(d.getTime())) continue;
    if (!bounds[p.id]) {
      bounds[p.id] = { firstDate: d, lastDate: d, phase: p };
    } else {
      if (d < bounds[p.id].firstDate) bounds[p.id].firstDate = d;
      if (d > bounds[p.id].lastDate) bounds[p.id].lastDate = d;
    }
  }
  return bounds;
}

// ── Public API ────────────────────────────────────────────────

/**
 * Identify the phase the user is CURRENTLY studying in.
 *
 * Priority: (1) match today's month against PHASE_DEFS,
 * (2) fall back to "most recent phase whose last exam already
 *     passed" so off-season visits don't return null.
 *
 * @param {Date} [now]
 * @returns {{id:string,label:string,startDate:Date,endDate:Date,daysIntoPhase:number}|null}
 */
export function getCurrentPhase(now = new Date(), year = `y${CURRENT_YEAR}`) {
  const yearKey = yearKeyOf(year);
  const bounds = phaseBoundsByYear(yearKey);
  const m = now.getMonth() + 1;

  // Direct month match first.
  let candidate = PHASE_DEFS.find((p) => p.months.includes(m)) || null;

  // Off-season (June / July / mid-Aug etc.) — fall back to the
  // last phase whose last-exam already happened.
  if (!candidate) {
    const past = Object.values(bounds)
      .filter((b) => b.lastDate <= now)
      .sort((a, b) => b.lastDate - a.lastDate);
    candidate = past[0]?.phase || PHASE_DEFS[PHASE_DEFS.length - 1];
  }
  if (!candidate) return null;

  const b = bounds[candidate.id];
  // If schedule has no exams for this phase yet (e.g. scaffold
  // years), synthesise a 60-day window centred on the phase's
  // middle month — better than returning null.
  let startDate, endDate;
  if (b) {
    startDate = startOfDay(b.firstDate);
    endDate = startOfDay(b.lastDate);
  } else {
    const yr = now.getFullYear();
    const midMonth = candidate.months[Math.floor(candidate.months.length / 2)];
    startDate = new Date(yr, midMonth - 1, 1);
    endDate = new Date(yr, midMonth - 1, 28);
  }

  const today = startOfDay(now);
  const daysIntoPhase = Math.max(0, Math.round((today - startDate) / (24 * 60 * 60 * 1000)));

  return {
    id: candidate.id,
    label: candidate.label,
    startDate,
    endDate,
    daysIntoPhase,
  };
}

/**
 * Return the most recently completed phase IF the user hasn't
 * dismissed its wrapped card yet. Otherwise null.
 *
 * "Completed" = today is strictly AFTER the phase's last exam
 * AND within POST_PHASE_WINDOW_DAYS of it.
 */
export function getCompletedPhase(now = new Date(), year = 'y4') {
  const yearKey = yearKeyOf(year);
  const bounds = phaseBoundsByYear(yearKey);
  const today = startOfDay(now);

  let best = null;
  for (const { lastDate, phase } of Object.values(bounds)) {
    const last = startOfDay(lastDate);
    const dayDiff = Math.floor((today - last) / (24 * 60 * 60 * 1000));
    if (dayDiff >= 1 && dayDiff <= POST_PHASE_WINDOW_DAYS) {
      if (!best || last > best.lastDate) best = { phase, lastDate: last };
    }
  }
  if (!best) return null;
  if (isWrappedDismissed(best.phase.id)) return null;

  // Phase span — same shape as getCurrentPhase return.
  const b = bounds[best.phase.id];
  const startDate = startOfDay(b.firstDate);
  const endDate = startOfDay(b.lastDate);
  const daysIntoPhase = Math.round((today - startDate) / (24 * 60 * 60 * 1000));

  return {
    id: best.phase.id,
    label: best.phase.label,
    startDate,
    endDate,
    daysIntoPhase,
  };
}

/**
 * Compile rich phase stats from history + SR + bookmarks.
 *
 * @param {object} args
 * @param {object} args.phase - return shape of getCurrentPhase / getCompletedPhase
 * @param {Array} args.history - exam-row history (date, subject, correct, durationSec?)
 * @param {object} args.srCards - { [qId]: { interval, repetitions, … } }
 * @param {Array} args.bookmarks - bookmarked Q ids (used for engagement signal)
 * @param {Array} [args.allQuestions] - currently unused but kept in signature
 * @param {Array} [args.subjects] - SUBJECTS list for pretty labels
 */
export function buildPhaseStats({ phase, history = [], srCards = {}, bookmarks = [], allQuestions = [], subjects = [] }) {
  if (!phase) {
    return emptyStats();
  }

  // Pretty-label index for strongest/weakest
  const subjMap = {};
  for (const s of subjects || []) {
    if (s?.id) subjMap[s.id] = { name: s.name || s.id, icon: s.icon || '📚' };
  }

  // Phase window — pad 60 days before startDate so the recap
  // covers actual study time, not just exam week. Padding past
  // endDate keeps cram-week activity in scope.
  const startMs = phase.startDate.getTime() - 60 * 24 * 60 * 60 * 1000;
  const endMs = phase.endDate.getTime() + 2 * 24 * 60 * 60 * 1000;

  const scoped = (Array.isArray(history) ? history : []).filter((h) => {
    if (!h?.date) return false;
    const ts = new Date(h.date).getTime();
    if (Number.isNaN(ts)) return false;
    return ts >= startMs && ts <= endMs;
  });

  // Per-subject + global aggregation in one pass
  const subj = {};
  let qCount = 0;
  let correct = 0;
  let secondsExplicit = 0;
  let qsWithoutDuration = 0;
  const dayKeys = new Set();
  // Daily Q count for the mini bar chart — last 30 days ending today
  const todayKey = ymd(Date.now());
  const todayMs = startOfDay(Date.now()).getTime();
  const dailyMap = new Map(); // dayKey -> count

  for (const h of scoped) {
    qCount++;
    if (h.correct) correct++;
    const s = h.subject || 'unknown';
    if (!subj[s]) subj[s] = { total: 0, correct: 0 };
    subj[s].total++;
    if (h.correct) subj[s].correct++;
    const dk = ymd(h.date);
    dayKeys.add(dk);
    dailyMap.set(dk, (dailyMap.get(dk) || 0) + 1);
    if (typeof h.durationSec === 'number' && h.durationSec > 0) {
      secondsExplicit += h.durationSec;
    } else {
      qsWithoutDuration++;
    }
  }

  // Longest streak inside the phase window
  let longestStreak = 0;
  if (dayKeys.size > 0) {
    const sorted = [...dayKeys].sort();
    let run = 1;
    longestStreak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const cur = new Date(sorted[i]);
      const diff = Math.round((cur - prev) / (24 * 60 * 60 * 1000));
      if (diff === 1) {
        run++;
        if (run > longestStreak) longestStreak = run;
      } else {
        run = 1;
      }
    }
  }

  // Total minutes — explicit + estimated. Stored as int minutes.
  const totalStudyMin = Math.round((secondsExplicit + qsWithoutDuration * AVG_SECONDS_PER_Q) / 60);
  // Nothing in the app writes `durationSec` onto a history row today:
  // finishExam stores {date, questionId, correct, subject, year, phase}
  // and the real session length only leaves as exam_results.duration_sec.
  // So in practice every minute above is the 45 s/Q heuristic, and 240 Qs
  // in forty minutes of short bursts reads the same "3.0 ชม." as 240 Qs
  // across ten long evenings. Whoever prints the number has to say that,
  // and this flag is how they know. It is true whenever ANY of the total
  // was guessed, because a partly guessed sum is still not a measurement.
  const studyTimeEstimated = qsWithoutDuration > 0;

  // Subject ranking — ≥10 attempts gating avoids "100% (1/1)"
  const ranked = Object.entries(subj)
    .filter(([, v]) => v.total >= 10)
    .map(([id, v]) => ({
      id,
      name: subjMap[id]?.name || id,
      icon: subjMap[id]?.icon || '📚',
      total: v.total,
      correct: v.correct,
      pct: Math.round((v.correct / v.total) * 100),
    }))
    .sort((a, b) => b.pct - a.pct);

  const strongestSubject = ranked[0] || null;
  const weakestSubject = ranked.length > 1 ? ranked[ranked.length - 1] : ranked[0] || null;

  // Mastery via SR — fraction of SR cards with interval ≥ 14 days
  const srValues = srCards && typeof srCards === 'object' ? Object.values(srCards) : [];
  const masteredCards = srValues.filter((c) => {
    const interval = c?.interval ?? c?.intervalDays ?? c?.spacedDays ?? 0;
    return typeof interval === 'number' && interval >= 14;
  }).length;

  // 30-day bar chart, oldest → newest, includes zero-days so the
  // chart shows real gaps in study habit.
  const byDay = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(todayMs - i * 24 * 60 * 60 * 1000);
    const dk = ymd(d);
    byDay.push({ date: dk, qs: dailyMap.get(dk) || 0 });
  }

  const dailyAvg = byDay.length > 0
    ? Math.round(byDay.reduce((s, x) => s + x.qs, 0) / byDay.length * 10) / 10
    : 0;

  const correctPct = qCount > 0 ? Math.round((correct / qCount) * 100) : 0;

  return {
    phaseId: phase.id,
    phaseLabel: phase.label,
    qCount,
    correct,
    correctPct,
    masteredCards,
    totalStudyMin,
    studyTimeEstimated,
    weakestSubject,
    strongestSubject,
    longestStreak,
    dailyAvg,
    byDay,
    bookmarkCount: Array.isArray(bookmarks) ? bookmarks.length : 0,
    isEmpty: qCount === 0,
  };
}

function emptyStats() {
  return {
    phaseId: null,
    phaseLabel: '',
    qCount: 0,
    correct: 0,
    correctPct: 0,
    masteredCards: 0,
    totalStudyMin: 0,
    studyTimeEstimated: false,
    weakestSubject: null,
    strongestSubject: null,
    longestStreak: 0,
    dailyAvg: 0,
    byDay: [],
    bookmarkCount: 0,
    isEmpty: true,
  };
}

// ── Seen / dismiss bookkeeping ────────────────────────────────

/** Mark a wrapped card as dismissed for `phaseId`. Idempotent. */
export function markWrappedDismissed(phaseId) {
  if (!phaseId) return;
  const cur = safeReadLS(LS_DISMISSED_KEY, {}) || {};
  if (typeof cur !== 'object' || Array.isArray(cur)) {
    safeWriteLS(LS_DISMISSED_KEY, { [phaseId]: Date.now() });
    return;
  }
  cur[phaseId] = Date.now();
  safeWriteLS(LS_DISMISSED_KEY, cur);
}

/** Was wrapped card for `phaseId` already dismissed? */
export function isWrappedDismissed(phaseId) {
  if (!phaseId) return false;
  const cur = safeReadLS(LS_DISMISSED_KEY, {});
  if (!cur || typeof cur !== 'object' || Array.isArray(cur)) return false;
  return cur[phaseId] != null;
}

/** Clear dismissal for `phaseId` — used for "show again" testing. */
export function resetWrappedDismissed(phaseId) {
  const cur = safeReadLS(LS_DISMISSED_KEY, {}) || {};
  if (typeof cur !== 'object' || Array.isArray(cur)) return;
  if (phaseId) {
    delete cur[phaseId];
    safeWriteLS(LS_DISMISSED_KEY, cur);
  } else {
    safeWriteLS(LS_DISMISSED_KEY, {});
  }
}

// ── Plain-text version (for clipboard "คัดลอกสรุป") ───────────

/** Render the stats as an IG-caption / chat-paste friendly block. */
export function statsToText(stats) {
  if (!stats || stats.isEmpty) return '';
  const lines = [];
  lines.push(`📊 VetMock Wrapped, ${stats.phaseLabel}`);
  lines.push('');
  lines.push(`🎯 ${stats.qCount.toLocaleString()} ข้อ, ${stats.correctPct}% ถูก`);
  if (stats.strongestSubject) lines.push(`🏆 ดีที่สุด: ${stats.strongestSubject.name} (${stats.strongestSubject.pct}%)`);
  if (stats.weakestSubject && stats.weakestSubject.id !== stats.strongestSubject?.id) {
    lines.push(`💪 ต้องเก็บอีก: ${stats.weakestSubject.name} (${stats.weakestSubject.pct}%)`);
  }
  if (stats.longestStreak > 0) lines.push(`🔥 streak สูงสุด: ${stats.longestStreak} วัน`);
  if (stats.totalStudyMin > 0) {
    const hr = (stats.totalStudyMin / 60).toFixed(1);
    // "~" unless the stats say every minute was measured. A stats object
    // that never heard of the flag keeps the hedge it always had.
    const approx = stats.studyTimeEstimated === false ? '' : '~';
    lines.push(`⏱ อ่านไป ${approx}${hr} ชม.`);
  }
  if (stats.masteredCards > 0) lines.push(`🧠 ${stats.masteredCards} cards mastered`);
  lines.push('');
  lines.push('vetmock.vercel.app, @vetmock.cu');
  return lines.join('\n');
}
