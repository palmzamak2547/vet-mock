// ============================================================
// practice-ladder.js — the three rungs from "I do not know this yet" to
// "I can sit the paper", and what moves a student between them
// ============================================================
// Palm, owner review 2026-10-11: "โหมดฝึกอยากให้เป็นทำความเข้าใจด้วยคำถามง่ายๆ
// ที่ล้อกับการนำไปสู่การทำโหมดสอบได้มากกว่า". Practice, timed practice and the
// exam simulation used to be three unrelated presets on three screens. They
// are one ladder now, read and written through this module only, so the
// config screen, the results screen and the start of a set agree on what a
// rung means.
//
// The learning model behind the rungs (retrieval practice with feedback,
// then the same under time, then the exam's own conditions):
//   1 ทำความเข้าใจ  untimed, the answer and reasoning after every question,
//                  the gentler questions first (see gentleRank below)
//   2 ฝึกจับเวลา    the same with a clock per question: retrieval under a
//                  little pressure, still with immediate feedback
//   3 ซ้อมสอบ       exam mode: one clock for the whole set, feedback only
//                  after submitting, like the paper
//
// Everything here is pure except the two small storage helpers at the end.
// Nothing reads the question bank; the caller hands over the pool.
// ============================================================

import { DEFAULT_RATING, DIFFICULTY_MIN_ATTEMPTS, hasMeasuredDifficulty } from './elo.js';
import { keepPassageOrder } from './adaptive-select.js';
import { isWritingType } from '../hooks/utils.js';

// Rung names follow the product vision of 2026-10-12 (one "ฝึก" door with a
// ladder: ทำความเข้าใจ → ใช้ความรู้ → แบบสอบ). The hints say what the engine
// does with the clock, because the two clocks differ: a practice clock runs
// per question and moves on when it runs out (useExamSession's per-question
// deadline), an exam clock is one budget for the whole set and submits it when
// it runs out (sessionBudget). Neither is changed here; the copy only tells.
export const LADDER_STEPS = [
  {
    id: 'understand', n: 1, label: 'ทำความเข้าใจ', short: 'เข้าใจ',
    count: 10, mode: 'quick', useTimer: false, instantFeedback: true,
    hint: 'ข้อที่น่าจะง่ายมาก่อน ไม่จับเวลา เห็นเฉลยและเหตุผลทุกข้อ',
  },
  {
    id: 'timed', n: 2, label: 'ใช้ความรู้', short: 'ใช้ความรู้',
    count: 20, mode: 'quick', useTimer: true, instantFeedback: true, timePerQ: 60,
    hint: 'จับเวลาทีละข้อ หมดเวลาข้อไหนจะไปข้อถัดไปเอง ยังเห็นเฉลยทันที',
  },
  {
    id: 'exam', n: 3, label: 'แบบสอบ', short: 'แบบสอบ',
    count: 50, mode: 'exam', useTimer: true, timePerQ: 60,
    hint: 'นาฬิกาเดียวทั้งชุด หมดเวลาคือส่งทั้งชุด เฉลยหลังส่ง',
  },
];

export const LADDER_STEP_IDS = LADDER_STEPS.map((s) => s.id);

// The share of a set that moves a student up one rung. Rules of this app, not
// measurements: the copy that quotes them says so ("ได้ 80% ขึ้นไป").
export const STEP_UP_RATIO = { understand: 0.8, timed: 0.7 };
// A set shorter than this proves nothing either way (the personal-best rule
// in ResultsView draws the same line).
export const STEP_MIN_SET = 5;

export function ladderStep(id) {
  return LADDER_STEPS.find((s) => s.id === id) || LADDER_STEPS[0];
}

/** Which rung a set of settings is on. Derived, never stored, so the ladder
 *  on screen can never disagree with the switches under it. */
export function ladderStepFor({ mode, useTimer }) {
  if (mode === 'exam') return 'exam';
  return useTimer ? 'timed' : 'understand';
}

/** The settings a rung asks for. `available` caps the count to the pool so a
 *  thin topic never promises more than it holds; a per-question time the
 *  student already chose is kept. */
export function ladderPreset(id, { available = null, timePerQ = 60 } = {}) {
  const step = ladderStep(id);
  const cap = Number.isFinite(available) && available > 0 ? Math.max(1, Math.floor(available)) : null;
  return {
    mode: step.mode,
    useTimer: step.useTimer,
    instantFeedback: step.instantFeedback ?? true,
    numQuestions: cap == null ? step.count : Math.min(step.count, cap),
    timePerQ: step.useTimer ? (Number.isFinite(timePerQ) && timePerQ >= 5 ? timePerQ : step.timePerQ || 60) : timePerQ,
  };
}

/**
 * What a finished set means for the ladder.
 *   up    reached the rung's bar: the next rung is the clear next step
 *   hold  above the app's practice mark but under the bar: same rung again
 *   back  under the practice mark: one rung down (or stay on the first)
 *   done  the top rung reached its bar: ready for another paper
 *   short the set was too small to judge
 * Exact counts, never the rounded percentage: 7/9 rounds to 78 and reads
 * like "nearly 80", and 0.8 is the line.
 */
export function ladderVerdict({ stepId, correct, total, passPct = 60 }) {
  const step = LADDER_STEP_IDS.includes(stepId) ? stepId : 'understand';
  const ratio = total > 0 ? correct / total : 0;
  if (!(total >= STEP_MIN_SET)) return { kind: 'short', step, next: step, ratio };
  if (ratio < passPct / 100) {
    const next = step === 'exam' ? 'timed' : 'understand';
    return { kind: 'back', step, next, ratio };
  }
  if (step === 'exam') return { kind: 'done', step, next: 'exam', ratio };
  const bar = STEP_UP_RATIO[step];
  if (ratio >= bar) return { kind: 'up', step, next: step === 'understand' ? 'timed' : 'exam', ratio };
  return { kind: 'hold', step, next: step, ratio };
}

// ── The gentle order for rung 1 ─────────────────────────────────────────────
// Measured difficulty decides when it exists. ONE constant says when a
// question's recorded attempts are enough for its rating to become the ramp's
// signal: DIFFICULTY_MIN_ATTEMPTS in src/lib/elo.js (20), read here through
// hasMeasuredDifficulty and nowhere else. Production had no question with that
// many attempts on 2026-10-11, so most of the time the order comes from a
// PROXY, stated here so nobody reads it as a measurement: recognition before
// recall (true/false and short multiple choice before matching, fill-in, short
// answer and essay), and a short stem before a long clinical vignette. The
// proxy is a rating-shaped number on the same 1500-centred scale so a measured
// rating slots in without a special case.
export const MEASURED_RAMP_MIN_ATTEMPTS = DIFFICULTY_MIN_ATTEMPTS;
const TYPE_OFFSET = { tf: -100, mcq: 0, fill: 60, match: 60, short: 120, essay: 160 };

export function gentleRank(question, difficultyData = null) {
  if (hasMeasuredDifficulty(question, difficultyData)) return difficultyData[String(question.id)].rating;
  const offset = TYPE_OFFSET[question?.type] ?? 0;
  const stemLength = String(question?.q || '').length;
  // one point per ten characters of stem, capped at an 800-character vignette
  const lengthBump = Math.min(80, Math.floor(stemLength / 10));
  const optionCount = Array.isArray(question?.options) ? question.options.length : 0;
  const optionBump = optionCount > 4 ? (optionCount - 4) * 10 : 0;
  return DEFAULT_RATING + offset + lengthBump + optionBump;
}

/** Stable easy-to-hard order; passage questions keep their reading order
 *  inside the slots they land in (the same rule the adaptive ramp uses). */
export function gentleOrder(questions, difficultyData = null) {
  const ranked = (questions || [])
    .map((q, i) => ({ q, i, r: gentleRank(q, difficultyData) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((e) => e.q);
  return keepPassageOrder(ranked);
}

function shuffleWith(list, rng) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Pick `count` questions for rung 1 from a pool: a random window three times
 * the size wanted (so two sessions in a row are not the same ten questions),
 * then the gentlest of that window, served easy to hard. Written items (short
 * answer, essay) cannot show a verdict the moment the student answers, so
 * they stay out of this rung while the pool has enough auto-marked questions;
 * a pool that is mostly written keeps them (never empty, never short).
 */
export function gentlePick(pool, count, { difficultyData = null, rng = Math.random } = {}) {
  const wanted = Math.max(1, Math.floor(count));
  if (!Array.isArray(pool) || pool.length === 0) return [];
  const autoMarked = pool.filter((q) => !isWritingType(q));
  const base = autoMarked.length >= wanted ? autoMarked : pool;
  const windowSize = Math.min(base.length, wanted * 3);
  const window = shuffleWith(base, rng).slice(0, windowSize);
  return gentleOrder(window, difficultyData).slice(0, wanted);
}

// ── Where the student left the ladder ───────────────────────────────────────
// One small key so a student who worked at rung 2 yesterday opens a topic at
// rung 2 today. A UI preference, not study data: it does not sync.
const STEP_KEY = 'vmx-ladder-step';

export function recallLadderStep(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  try {
    const id = storage?.getItem(STEP_KEY);
    return id && LADDER_STEP_IDS.includes(id) && id !== 'exam' ? id : 'understand';
  } catch { return 'understand'; }
}

export function rememberLadderStep(id, storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!LADDER_STEP_IDS.includes(id)) return;
  try { storage?.setItem(STEP_KEY, id); } catch { /* a blocked store is a nicety lost, not an error */ }
}
