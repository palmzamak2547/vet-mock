// ============================================================
// badges.js — marks derived from what the app already counts
// ============================================================
// Nothing new is stored. Every badge is a function of the history, SR cards,
// bookmarks and custom questions the app already keeps, so a badge can never
// disagree with the dashboard and clearing your data clears your badges — as
// it should, because the badge was only ever a reading of that data.
//
// Two rules the set has to keep or it stops meaning anything:
//   1. A badge is earned or it is not shown as earned. There is no "almost".
//   2. Nothing here is a claim about a student's ability. "อ่านดึก" says when
//      the timestamps were, not that someone studies well or badly.
//
// History entries carry `date` and `correct`; `subject` where known. That is
// the whole substrate — a badge that would need anything else is not written.
// ============================================================

import { BADGE_ART } from '../data/art.js';

const ONE_DAY = 24 * 60 * 60 * 1000;

const dayKey = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Longest run of consecutive calendar days that have at least one answer. */
export function longestDayStreak(history) {
  const days = new Set();
  for (const h of history || []) {
    const k = dayKey(h?.date);
    if (k) days.add(k);
  }
  if (days.size === 0) return 0;
  const sorted = [...days].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = new Date(sorted[i - 1]).getTime();
    const cur = new Date(sorted[i]).getTime();
    if (Math.round((cur - prev) / ONE_DAY) === 1) {
      run += 1;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }
  return best;
}

/** How many answers landed inside [fromHour, toHour) local time. */
export function answersInHourRange(history, fromHour, toHour) {
  let n = 0;
  for (const h of history || []) {
    const d = new Date(h?.date);
    if (Number.isNaN(d.getTime())) continue;
    const hour = d.getHours();
    const inRange = fromHour <= toHour
      ? hour >= fromHour && hour < toHour
      : hour >= fromHour || hour < toHour; // a window that crosses midnight
    if (inRange) n += 1;
  }
  return n;
}

/** The counts the derived badges read, from history and SR cards alone.
 *  `currentStreak` is the saved streak a screen shows beside the badges (it
 *  knows about a freeze, which history cannot): the streak badges count the
 *  longer of it and the longest run in history, so a tile reading 4 days and
 *  a badge line reading "2 of 7" can never sit side by side. */
export function badgeMetrics({ history = [], srCards = {}, currentStreak = 0 } = {}) {
  history = Array.isArray(history) ? history : [];
  const answered = (history || []).length;
  const streak = Math.max(longestDayStreak(history), Math.max(0, Math.floor(Number(currentStreak) || 0)));
  const nightAnswers = answersInHourRange(history, 22, 4);
  const earlyAnswers = answersInHourRange(history, 5, 8);
  const reviewedCards = Object.values(srCards || {})
    .filter((c) => Number(c?.totalReviews) > 0).length;
  // A question answered wrong at least once and right at least once later.
  // "Later" is each row's own time, read as wrong-pool.js reads it: a sync
  // merge appends this device's rows after the other device's whatever their
  // date, so array order gave the badge for questions last answered wrong and
  // missed real corrections. Rows with no time count as the oldest and keep
  // the order they were written in.
  const timeOf = (h) => {
    const n = Number(h?.date);
    const t = typeof h?.date === 'string' && !Number.isFinite(n) ? Date.parse(h.date) : n;
    return Number.isFinite(t) ? t : -Infinity;
  };
  const inTimeOrder = history
    .map((h, i) => ({ h, i, t: timeOf(h) }))
    .sort((a, b) => (a.t - b.t) || (a.i - b.i))
    .map(({ h }) => h);
  const seen = new Map();
  let corrected = 0;
  for (const h of inTimeOrder) {
    // History rows carry `questionId` (the older fixtures used `id`).
    const key = `${h?.subject || '?'}:${h?.questionId ?? h?.id ?? h?.qId ?? '?'}`;
    const prior = seen.get(key);
    if (prior === false && h?.correct) { corrected += 1; seen.set(key, 'done'); }
    else if (prior === undefined) seen.set(key, h?.correct ? 'done' : false);
  }

  return { answered, streak, nightAnswers, earlyAnswers, reviewedCards, corrected };
}

// Badges counted from history and SR cards, with the count each needs. The
// thresholds are earnedBadges' own; a test holds the two to each other.
const COUNTED = Object.freeze([
  ['questions-100', 'answered', 100, 'ข้อ'],
  ['questions-1000', 'answered', 1000, 'ข้อ'],
  ['streak-7', 'streak', 7, 'วันต่อเนื่อง'],
  ['streak-30', 'streak', 30, 'วันต่อเนื่อง'],
  ['corrected-mistakes', 'corrected', 20, 'ข้อที่แก้ได้'],
  ['review-cycle', 'reviewedCards', 50, 'การ์ดที่ทบทวน'],
  ['night-owl', 'nightAnswers', 50, 'ข้อหลังสี่ทุ่ม'],
  ['early-bird', 'earlyAnswers', 50, 'ข้อก่อนแปดโมง'],
]);
export const COUNTED_BADGES = COUNTED.map(([id, metric, need]) => ({ id, metric, need }));

/**
 * The badge closest to being earned, counted from the same metrics: the
 * unearned one with the largest share done (a goal that is nearly reached
 * pulls hardest), ties to the earlier in the list. null when every counted
 * badge is earned. Night and early badges are never proposed: the hour a
 * student studies is not something to push.
 */
export function nextBadge({ history = [], srCards = {}, currentStreak = 0 } = {}) {
  const m = badgeMetrics({ history, srCards, currentStreak });
  let best = null;
  for (const [id, metric, need, unit] of COUNTED) {
    if (metric === 'nightAnswers' || metric === 'earlyAnswers') continue;
    const have = Math.min(m[metric] || 0, need);
    if (have >= need || !BADGE_ART[id]) continue;
    const share = have / need;
    if (!best || share > best.share) best = { id, label: BADGE_ART[id].label, src: BADGE_ART[id].src, have, need, unit, share };
  }
  return best;
}

/**
 * Which badges this student has earned.
 *
 * @param {object} src  history, srCards, stats, and the counts the history
 *   cannot tell: contributions, panicAnswers, groupCount, raceWins
 * @returns {Array<{id, label, src, why}>} earned only, in display order
 */
export function earnedBadges({
  history = [],
  srCards = {},
  stats = null,
  contributions = 0,
  panicAnswers = 0,
  groupCount = 0,
  raceWins = 0,
  currentStreak = 0,
} = {}) {
  const { answered, streak, nightAnswers, earlyAnswers, reviewedCards, corrected } = badgeMetrics({ history, srCards, currentStreak });

  const candidates = [
    ['streak-7', streak >= 7, `ทำข้อสอบต่อเนื่อง ${streak} วัน`],
    ['streak-30', streak >= 30, `ทำข้อสอบต่อเนื่อง ${streak} วัน`],
    ['questions-100', answered >= 100, `ทำไปแล้ว ${answered.toLocaleString()} ข้อ`],
    ['questions-1000', answered >= 1000, `ทำไปแล้ว ${answered.toLocaleString()} ข้อ`],
    // One set (10 answers or more) with none wrong, not the whole window.
    ['perfect', (stats?.perfectSets || 0) >= 1, 'มีชุดที่ถูกทุกข้อ'],
    // History rows carry no mode, so the caller passes how many answers were
    // given in Panic Mode; any 50 answers are not "รอดจาก Panic Mode".
    ['panic-survivor', panicAnswers >= 50, `ทำ ${panicAnswers} ข้อใน Panic Mode`],
    ['night-owl', nightAnswers >= 50, `ทำข้อสอบหลังสี่ทุ่ม ${nightAnswers} ข้อ`],
    ['early-bird', earlyAnswers >= 50, `ทำข้อสอบก่อนแปดโมง ${earlyAnswers} ข้อ`],
    ['corrected-mistakes', corrected >= 20, `กลับไปแก้ข้อที่เคยผิดได้ ${corrected} ข้อ`],
    ['review-cycle', reviewedCards >= 50, `ทบทวนการ์ดครบรอบ ${reviewedCards} ใบ`],
    // Submissions to the shared bank only: a private custom question is never
    // sent anywhere, so it does not make "ส่งเนื้อหาเข้ามาช่วยเติมคลัง" true.
    ['contributor', contributions >= 1, 'ส่งเนื้อหาเข้ามาช่วยเติมคลัง'],
    ['study-group', groupCount >= 1, 'อยู่ในกลุ่มติว'],
    ['race-winner', raceWins >= 1, 'ชนะการแข่งอย่างน้อยหนึ่งครั้ง'],
    ['exam-finished', stats?.phaseCompleted === true, 'ผ่านช่วงสอบนี้มาแล้ว'],
  ];

  return candidates
    .filter(([id, won]) => won && BADGE_ART[id])
    .map(([id, , why]) => ({ id, why, label: BADGE_ART[id].label, src: BADGE_ART[id].src }));
}
