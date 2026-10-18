// Making a set and opening it: read the index of each domain it draws from (a few KB each), keep
// the entries that pass the filters, draw, then fetch the text of only the questions drawn (the
// shards that hold them), fix each one's option order, and store the session.

import { DOMAIN_CARDS, loadEntries, loadQuestions, toItem } from './bank.js';
import { eligible, draw, shuffle, seededRandom } from './sets.js';
import { createSession, sessionStore } from './session.js';
import { progressStore } from './progress.js';
import { examWeights } from '../data/almanac.js';
import { EXAM_SECONDS, FORMAT } from '../data/exam.js';

export const ALL_DOMAINS = DOMAIN_CARDS.map((d) => d.id);

export const PRACTICE_SIZES = [10, 20, 50, 100];
/** The largest is one part of the real paper. */
export const MOCK_SIZES = [25, 50, 100, FORMAT.perPart];
/** Seconds a question; the exam's own pace (54) is the default; 0 = untimed. */
export const PER_QUESTION = [45, EXAM_SECONDS, 90, 0];

/**
 * How a set spreads across domains: 'exam' by how often the exam asked each one in the three
 * latest years (data/almanac.js), 'bank' by how many questions each holds here.
 */
export const EXAM_WEIGHTS = examWeights();
const weightsFor = (mix) => (mix === 'bank' ? undefined : EXAM_WEIGHTS);

/**
 * Why the builder's choices leave no question, as one short line a student can act on; null when
 * they leave some. `narrowed` says the domains, the source or a topic cut the pool as well as the
 * status did, so "none missed yet" is never claimed of questions the other choices left out.
 * @param {{ status?: string, narrowed?: boolean, count: number }} choices
 */
export function emptyReason({ status = 'all', narrowed = false, count }) {
  if (count > 0) return null;
  if (status === 'wrong') return narrowed ? 'ยังไม่มีข้อที่เคยตอบผิดตามตัวเลือกนี้' : 'ยังไม่มีข้อที่เคยตอบผิด';
  if (status === 'unseen') return narrowed ? 'ทำครบทุกข้อตามตัวเลือกนี้แล้ว' : 'ทำครบทุกข้อแล้ว';
  return 'ไม่มีข้อที่ตรงกับตัวเลือกนี้';
}

/**
 * `onProgress(done, total)` counts the questions drawn whose text has arrived.
 * @param {{ mode: 'practice'|'mock', domains?: string[]|null, size: number, source?: string, status?: string,
 *   topics?: string[]|null, keys?: string[]|null, perQuestion?: number, label?: string,
 *   onProgress?: (done: number, total: number) => void }} opts
 * @returns {Promise<{ ok: true, session: object } | { ok: false, reason: 'empty' }>}
 */
export async function startSet(opts) {
  const { mode, size, source = 'all', status = 'all', topics = null, keys = null, perQuestion = EXAM_SECONDS, mix = 'exam', label = '', prefer = null, onProgress } = opts;
  const domains = opts.domains?.length ? opts.domains : ALL_DOMAINS;
  // Entries carry what the filters and the draw read (key, domain, source, topic), not the text.
  const entries = await loadEntries(domains);
  const pool = eligible(entries, { source, status, topics, keys }, progressStore.get());
  if (!pool.length) return { ok: false, reason: 'empty' };
  const rand = seededRandom();
  // A list of keys (retrying what was missed) keeps every one it can, in a fresh order.
  // prefer 'unseen' draws what has never been answered first and tops up from the rest, so a
  // quick start is always full and never repeats while there is something new.
  const weights = weightsFor(mix);
  let picked;
  if (keys) picked = shuffle(pool, rand).slice(0, size);
  else if (prefer === 'unseen') {
    const seen = progressStore.get().q;
    const fresh = pool.filter((q) => !seen[q.key]);
    const first = draw(fresh, size, rand, weights);
    const rest = first.length < size ? draw(pool.filter((q) => seen[q.key]), size - first.length, rand, weights) : [];
    picked = shuffle([...first, ...rest], rand);
  } else picked = draw(pool, size, rand, weights);
  // The text of the questions drawn: onProgress counts them as their shards arrive.
  const questions = await loadQuestions(picked, onProgress);
  const items = questions.map(toItem);
  const timed = mode === 'mock' && perQuestion > 0;
  const session = createSession({
    mode,
    items,
    limitSec: timed ? perQuestion * items.length : null,
    meta: {
      domains: opts.domains?.length ? domains : null,
      source, status, topics, size, label, mix, perQuestion: timed ? perQuestion : 0,
      retry: !!keys,
    },
  });
  sessionStore.set(session);
  return { ok: true, session };
}

/**
 * A few domains for a quick set, chosen with weight by how often the exam asks them: a set of
 * ten from four domains (four indexes to read, not nineteen), and over many sets every domain
 * turns up about as often as the exam turns to it.
 */
export function pickDomains(k, rand = seededRandom()) {
  const pool = DOMAIN_CARDS.map((d) => ({ id: d.id, w: EXAM_WEIGHTS[d.id] || 0 })).filter((d) => d.w > 0);
  const out = [];
  while (out.length < k && pool.length) {
    let r = rand() * pool.reduce((sum, d) => sum + d.w, 0);
    let at = pool.findIndex((d) => (r -= d.w) < 0);
    if (at < 0) at = pool.length - 1;
    out.push(pool.splice(at, 1)[0].id);
  }
  return out;
}

/** Ten questions, now: new ones first, from four domains drawn by how often the exam asks them. */
export function quickStart(opts = {}) {
  return startSet({ mode: 'practice', size: 10, prefer: 'unseen', domains: pickDomains(4), label: 'quick', ...opts });
}
