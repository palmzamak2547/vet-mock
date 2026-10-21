// A practice set or a mock exam, from the first question to the result. Pure functions over a
// plain object, so the same rules run in the page, in tests and after a reload.
//
// An item carries everything needed to grade and redraw it without the bank:
//   key     "subject:id"           domain  where it was drawn from
//   order   display → original option index, fixed when the set is made, so the options
//           keep their places when the page is reloaded mid-exam
//   answer  the original index of the right option
// A choice is always stored as the ORIGINAL option index.
//
// Practice reveals each answer at once and locks it. A mock exam keeps every answer open to
// change until it is submitted, and runs against an absolute deadline: closing the page does
// not stop the clock, as in the exam room, and a deadline that passed while the page was
// closed submits the exam the next time it opens.

import { createStore } from './storage.js';

export const SESSION_KEY = 'vca:session:v1';
export const RESULTS_KEY = 'vca:results:v1';
export const RESULTS_KEPT = 30;

export function newId(now = Date.now()) {
  let rand = '';
  try {
    const buf = new Uint32Array(2);
    globalThis.crypto.getRandomValues(buf);
    rand = buf[0].toString(36) + buf[1].toString(36);
  } catch {
    rand = Math.random().toString(36).slice(2);
  }
  return `${now.toString(36)}-${rand.slice(0, 8)}`;
}

/**
 * @param {{ mode: 'practice'|'mock', items: Array<{key:string,domain:string,order:number[],answer:number}>,
 *   limitSec?: number|null, now?: number, meta?: object, id?: string }} opts
 */
export function createSession({ mode, items, limitSec = null, now = Date.now(), meta = {}, id = newId(now) }) {
  if (mode !== 'practice' && mode !== 'mock') throw new Error(`unknown mode ${mode}`);
  if (!items.length) throw new Error('a set needs at least one question');
  const timed = mode === 'mock' && Number(limitSec) > 0;
  return {
    v: 1, id, mode, createdAt: now, items,
    answers: {}, flags: [], cursor: 0,
    limitSec: timed ? Number(limitSec) : null,
    deadline: timed ? now + Number(limitSec) * 1000 : null,
    status: 'active', meta,
  };
}

export const remainingMs = (s, now = Date.now()) => (s.deadline == null ? null : Math.max(0, s.deadline - now));
export const isExpired = (s, now = Date.now()) => s.deadline != null && now >= s.deadline;
export const answeredCount = (s) => s.items.filter((it) => s.answers[it.key]).length;

export function choose(s, key, choice, now = Date.now()) {
  if (s.status !== 'active' || isExpired(s, now)) return s;
  const item = s.items.find((it) => it.key === key);
  if (!item || !Number.isInteger(choice) || choice < 0 || choice >= item.order.length) return s;
  if (s.mode === 'practice' && s.answers[key]) return s;
  return { ...s, answers: { ...s.answers, [key]: { choice, at: now } } };
}

/** Mock only: take an answer back. */
export function unchoose(s, key, now = Date.now()) {
  if (s.mode !== 'mock' || s.status !== 'active' || isExpired(s, now) || !s.answers[key]) return s;
  const answers = { ...s.answers };
  delete answers[key];
  return { ...s, answers };
}

export function go(s, index) {
  const cursor = Math.min(Math.max(0, index), s.items.length - 1);
  return cursor === s.cursor ? s : { ...s, cursor };
}

export function toggleFlag(s, key) {
  if (s.status !== 'active') return s;
  const flags = s.flags.includes(key) ? s.flags.filter((k) => k !== key) : [...s.flags, key];
  return { ...s, flags };
}

export function tally(s) {
  const answered = answeredCount(s);
  return { total: s.items.length, answered, unanswered: s.items.length - answered, flagged: s.flags.length };
}

/**
 * The finished set: what was asked, what was chosen, and the score. A question held back from
 * learners after the set was made (paused(key)) and left unanswered is not counted: the page
 * says so on that question.
 * @param {{ paused?: (key: string) => boolean }} [opts]
 */
export function finish(s, now = Date.now(), { paused = () => false } = {}) {
  const expired = isExpired(s, now);
  const end = s.deadline != null ? Math.min(now, s.deadline) : now;
  const items = s.items.filter((it) => !(paused(it.key) && !s.answers[it.key])).map((it) => {
    const choice = s.answers[it.key]?.choice ?? null;
    return { key: it.key, domain: it.domain, order: it.order, answer: it.answer, choice, correct: choice === it.answer };
  });
  return {
    v: 1, id: s.id, mode: s.mode, createdAt: s.createdAt, finishedAt: now,
    durationMs: Math.max(0, end - s.createdAt), limitSec: s.limitSec, expired,
    total: items.length, correct: items.filter((x) => x.correct).length,
    answered: items.filter((x) => x.choice !== null).length,
    flags: s.flags.slice(), items, meta: s.meta,
  };
}

/**
 * Bring a set made before a bank update in line with the questions as they are now: a corrected
 * key is graded against the new answer (the page already shows it), and a question whose options
 * changed in number gets a fresh order and loses a choice that no longer points anywhere.
 * Returns the same object when nothing changed.
 * @param {(key: string) => null | { answer: number, options: unknown[] }} lookup
 */
export function refreshItems(s, lookup) {
  let changed = false;
  const answers = { ...s.answers };
  const items = s.items.map((it) => {
    const q = lookup(it.key);
    if (!q || !Array.isArray(q.options) || !Number.isInteger(q.answer)) return it;
    if (q.options.length !== it.order.length) {
      changed = true;
      delete answers[it.key];
      return { ...it, answer: q.answer, order: q.options.map((_, i) => i) };
    }
    if (q.answer !== it.answer) { changed = true; return { ...it, answer: q.answer }; }
    return it;
  });
  return changed ? { ...s, items, answers } : s;
}

/** Score per domain, in the order the domains first appear in the set. */
export function byDomain(result) {
  const map = new Map();
  for (const it of result.items) {
    const row = map.get(it.domain) || { domain: it.domain, total: 0, correct: 0 };
    row.total += 1;
    if (it.correct) row.correct += 1;
    map.set(it.domain, row);
  }
  return [...map.values()];
}

/**
 * The same rows, weakest first: the lowest share right, and between equal shares the domain
 * that was asked more (the surer reading). After a mock over many domains the first row is
 * where to practise next.
 */
export function weakestFirst(rows) {
  return rows.slice().sort((a, b) => a.correct / a.total - b.correct / b.total || b.total - a.total);
}

// Stored data is read at start-up, before any page: anything malformed is dropped here rather
// than throwing, which would stop the app from opening at all.
const goodItem = (it) => !!it && typeof it === 'object' && typeof it.key === 'string' && Array.isArray(it.order) && Number.isInteger(it.answer);
const isObject = (o) => !!o && typeof o === 'object' && !Array.isArray(o);

export function normalizeSession(raw) {
  if (!isObject(raw) || raw.v !== 1 || raw.status !== 'active' || !Array.isArray(raw.items) || !raw.items.length) return null;
  if (!raw.items.every(goodItem)) return null;
  return {
    ...raw,
    answers: isObject(raw.answers) ? raw.answers : {},
    flags: Array.isArray(raw.flags) ? raw.flags.filter((k) => typeof k === 'string') : [],
    cursor: Math.min(Math.max(0, raw.cursor | 0), raw.items.length - 1),
    // A clock that cannot be read is no clock: a damaged deadline showed NaN:NaN.
    ...(finite(raw.deadline) && finite(raw.limitSec) ? {} : { deadline: null, limitSec: null }),
  };
}

const finite = (n) => typeof n === 'number' && Number.isFinite(n);

/** One stored or imported result, made whole: its counts are recomputed from its items, so a
 *  truncated or hand-edited file cannot show NaN% or break the result page. */
function normalizeResult(r) {
  if (!isObject(r) || r.v !== 1 || typeof r.id !== 'string' || !Array.isArray(r.items)) return null;
  const items = r.items.filter(goodItem).map((it) => {
    const choice = Number.isInteger(it.choice) ? it.choice : null;
    return { ...it, domain: typeof it.domain === 'string' ? it.domain : '', choice, correct: choice !== null && choice === it.answer };
  });
  if (!items.length || !finite(r.finishedAt)) return null;
  return {
    ...r, items,
    mode: r.mode === 'mock' ? 'mock' : 'practice',
    total: items.length,
    correct: items.filter((x) => x.correct).length,
    answered: items.filter((x) => x.choice !== null).length,
    createdAt: finite(r.createdAt) ? r.createdAt : r.finishedAt,
    durationMs: finite(r.durationMs) && r.durationMs >= 0 ? r.durationMs : 0,
    flags: Array.isArray(r.flags) ? r.flags.filter((k) => typeof k === 'string') : [],
  };
}

export function normalizeResults(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeResult).filter(Boolean).slice(0, RESULTS_KEPT);
}

export const sessionStore = createStore(SESSION_KEY, null, normalizeSession);
export const resultsStore = createStore(RESULTS_KEY, [], normalizeResults);

/** Keep a finished result, newest first, at most RESULTS_KEPT. */
export function keepResult(list, result) {
  return [result, ...list.filter((r) => r.id !== result.id)].slice(0, RESULTS_KEPT);
}
