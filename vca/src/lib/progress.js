// What the student has answered, kept on this device only.
//
// One entry per question key ("subject:id", the main app's own question identity):
//   d  domain id     n  attempts     c  correct attempts
//   l  1 when the last answer was right, 0 when it was wrong
//   t  when it was last answered (ms)
// plus answers per calendar day for the streak, and the exam date the student set.
// Mastery reads the LAST answer: a question missed twice and then got right counts as known.

import { createStore } from './storage.js';
import { isDay, localDay, previousDay, daysBetween } from './dates.js';

export const PROGRESS_KEY = 'vca:progress:v1';

export const emptyProgress = () => ({ v: 1, q: {}, days: {}, examDate: null });

export function normalizeProgress(raw) {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object' || raw.v !== 1) return base;
  if (raw.q && typeof raw.q === 'object') {
    for (const [key, e] of Object.entries(raw.q)) {
      if (!e || typeof e !== 'object' || typeof e.d !== 'string') continue;
      const n = Math.max(0, Math.floor(Number(e.n) || 0));
      if (!n) continue;
      base.q[key] = { d: e.d, n, c: Math.min(n, Math.max(0, Math.floor(Number(e.c) || 0))), l: e.l ? 1 : 0, t: Number(e.t) || 0 };
    }
  }
  if (raw.days && typeof raw.days === 'object') {
    for (const [day, n] of Object.entries(raw.days)) if (isDay(day) && Number(n) > 0) base.days[day] = Math.floor(Number(n));
  }
  base.examDate = isDay(raw.examDate) ? raw.examDate : null;
  return base;
}

/**
 * @param {ReturnType<typeof emptyProgress>} state
 * @param {{ key: string, domain: string, correct: boolean, at?: number }} answer
 */
export function recordAnswer(state, { key, domain, correct, at = Date.now() }) {
  const prev = state.q[key];
  const entry = {
    d: domain,
    n: (prev?.n || 0) + 1,
    c: (prev?.c || 0) + (correct ? 1 : 0),
    l: correct ? 1 : 0,
    t: at,
  };
  const day = localDay(at);
  return { ...state, q: { ...state.q, [key]: entry }, days: { ...state.days, [day]: (state.days[day] || 0) + 1 } };
}

/** Several answers at once (a submitted mock exam), in one write. */
export function recordAnswers(state, answers) {
  return answers.reduce((s, a) => recordAnswer(s, a), state);
}

/** Seen, known and attempt counts, for one domain or (domainId null) for everything. */
export function statsFor(state, domainId = null) {
  let seen = 0; let known = 0; let attempts = 0; let correct = 0;
  for (const e of Object.values(state.q)) {
    if (domainId && e.d !== domainId) continue;
    seen += 1; known += e.l; attempts += e.n; correct += e.c;
  }
  return { seen, known, wrong: seen - known, attempts, correct, accuracy: seen ? known / seen : null };
}

/** Keys whose last answer was wrong, newest first, optionally inside some domains. */
export function wrongKeys(state, domainIds = null) {
  const only = domainIds ? new Set(domainIds) : null;
  return Object.entries(state.q)
    .filter(([, e]) => !e.l && (!only || only.has(e.d)))
    .sort((a, b) => b[1].t - a[1].t)
    .map(([key]) => key);
}

/** Consecutive study days ending today, or ending yesterday while today is still open. */
export function streak(state, today = localDay()) {
  let day = state.days[today] ? today : previousDay(today);
  let n = 0;
  while (state.days[day]) { n += 1; day = previousDay(day); }
  return n;
}

/** Days until the exam the student set (0 on the day), or null. */
export function daysToExam(state, today = localDay()) {
  return state.examDate ? daysBetween(today, state.examDate) : null;
}

/** How many unseen questions a day would cover the bank by the exam. */
export function dailyPace(unseen, days) {
  if (days == null || days <= 0) return null;
  return Math.ceil(unseen / days);
}

export const progressStore = createStore(PROGRESS_KEY, emptyProgress(), normalizeProgress);
