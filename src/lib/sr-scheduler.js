// Scheduler dispatcher for spaced repetition. SM-2 stays the default; FSRS-6
// is an opt-in device preference. Both schedulers advance on every grade
// (dual-write), so switching is instant and lossless in either direction —
// there is no one-time migration to get wrong and nothing to undo.
//
// sm2.js itself is never edited here; it is wrapped, because its arithmetic
// is pinned by tests/unit/sm2-honesty.test.mjs.

import { updateCard, previewInterval as sm2PreviewInterval, getDueCards as sm2GetDueCards, getCardStats as sm2GetCardStats } from '../hooks/sm2.js';
import { FSRS_ALGORITHM, nextFsrsState, previewFsrsIntervals, intervalFor } from './fsrs.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const SM2_ALGORITHM = 'vetmock-sm2-v1';
export const SCHEDULER_CHOICES = Object.freeze(['sm2', 'fsrs']);
export const SCHEDULER_DEFAULT = 'sm2';
export const SCHEDULER_STORAGE_KEY = 'vmx-sr-scheduler';
export const SCHEDULER_CHANGE_EVENT = 'vmx-sr-scheduler-change';

export const SCHEDULER_LABELS = Object.freeze({
  sm2: 'SM-2 (เดิม)',
  fsrs: 'FSRS (ทบทวนน้อยลง จำได้ขึ้น)',
});

export function normalizeScheduler(value) {
  return SCHEDULER_CHOICES.includes(value) ? value : SCHEDULER_DEFAULT;
}

let currentScheduler;
export function readSchedulerPreference() {
  if (currentScheduler) return currentScheduler;
  try { currentScheduler = normalizeScheduler(window.localStorage.getItem(SCHEDULER_STORAGE_KEY)); }
  catch { currentScheduler = SCHEDULER_DEFAULT; }
  return currentScheduler;
}

export function saveSchedulerPreference(scheduler) {
  currentScheduler = normalizeScheduler(scheduler);
  let persisted = true;
  try { window.localStorage.setItem(SCHEDULER_STORAGE_KEY, currentScheduler); } catch { persisted = false; }
  window.dispatchEvent(new Event(SCHEDULER_CHANGE_EVENT));
  return persisted;
}

export function subscribeSchedulerPreference(callback) {
  const onStorage = (event) => {
    if (event.key !== SCHEDULER_STORAGE_KEY && event.key !== null) return;
    currentScheduler = undefined;
    callback();
  };
  window.addEventListener(SCHEDULER_CHANGE_EVENT, callback);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(SCHEDULER_CHANGE_EVENT, callback);
    window.removeEventListener('storage', onStorage);
  };
}

export function algorithmFor(scheduler) {
  return scheduler === 'fsrs' ? FSRS_ALGORITHM : SM2_ALGORITHM;
}

// The timestamp the given scheduler treats as this card's due moment. A card
// that has never been graded under FSRS falls back to the SM-2 date until its
// first FSRS grade writes a real one.
export function dueAt(card, scheduler = readSchedulerPreference()) {
  if (scheduler === 'fsrs' && card?.fsrs?.due) return card.fsrs.due;
  return card?.nextReview ?? 0;
}

// Derive a first FSRS state from the SM-2 history a card already has.
// The SM-2 interval is the stability proxy (it is a scheduled-out duration at
// similar retention); ease maps linearly onto FSRS difficulty, hardest→10.
export function deriveFsrsState(card) {
  if (!card || card.totalReviews === 0 || !card.lastReview) {
    return { stability: null, difficulty: null, interval: 0, due: card?.nextReview ?? 0, lastReview: null };
  }
  const stability = Math.max(0.5, card.interval || 1);
  const difficulty = Math.min(10, Math.max(1, 10 - ((card.easeFactor - 1.3) * 9) / 1.6));
  return { stability, difficulty, interval: Math.max(1, Math.round(intervalFor(stability))), due: card.nextReview, lastReview: card.lastReview };
}

// `fsrs` present and shape-valid wins; anything else re-derives. Reading the
// card never mutates it — the derived object is only written back by a grade.
export function ensureFsrsState(card) {
  const s = card?.fsrs;
  if (s && (s.stability === null || typeof s.stability === 'number')
    && (s.difficulty === null || typeof s.difficulty === 'number')
    && typeof s.due === 'number') return s;
  return deriveFsrsState(card);
}

// Grade once, advance BOTH schedulers. The SM-2 fields move via updateCard
// exactly as before (same numbers the pinned tests hold); the fsrs sub-object
// moves in parallel so neither schedule goes stale while it is not selected.
// updateCard reads the wall clock itself, so the grade's timestamps are then
// re-anchored to one shared instant — same arithmetic, one canonical `now`
// for both schedules.
export function gradeCard(card, quality, { now = Date.now(), scheduler = readSchedulerPreference() } = {}) {
  const next = updateCard(card, quality);
  next.lastReview = now;
  next.nextReview = now + next.interval * MS_PER_DAY;
  next.fsrs = nextFsrsState(ensureFsrsState(card), quality, now);
  return next;
}

export function getDueCards(cards, limit = 0, scheduler = readSchedulerPreference()) {
  const now = Date.now();
  const due = Object.values(cards)
    .filter((c) => dueAt(c, scheduler) <= now)
    .sort((a, b) => dueAt(a, scheduler) - dueAt(b, scheduler));
  return limit && limit > 0 ? due.slice(0, limit) : due;
}

// Bucket semantics mirror sm2.js exactly (due requires evidence of a real
// review, autoPromoted counts as due, buckets never double-count); only the
// due timestamp and the mastered bar follow the selected scheduler.
export function getCardStats(cards, scheduler = readSchedulerPreference()) {
  if (scheduler !== 'fsrs') return sm2GetCardStats(cards);
  const now = Date.now();
  const tomorrow = now + MS_PER_DAY;
  const values = Object.values(cards);
  const hasMet = (c) => c.totalReviews > 0 || c.autoPromoted;
  const intervalOf = (c) => c.fsrs?.interval ?? c.interval ?? 0;
  return {
    total: values.length,
    due: values.filter((c) => dueAt(c, 'fsrs') <= now && hasMet(c)).length,
    dueTomorrow: values.filter((c) => { const d = dueAt(c, 'fsrs'); return d > now && d <= tomorrow && hasMet(c); }).length,
    new: values.filter((c) => c.totalReviews === 0 && !c.autoPromoted).length,
    mastered: values.filter((c) => c.totalReviews >= 5 && intervalOf(c) >= 21).length,
  };
}

// What each grade button would schedule, in days [Again, Hard, Good, Easy] —
// the honesty contract both schedulers share.
export function previewIntervals(card, scheduler = readSchedulerPreference()) {
  if (scheduler === 'fsrs') return previewFsrsIntervals(ensureFsrsState(card));
  return [0, 1, 2, 3].map((quality) => sm2PreviewInterval(card, quality));
}
