// ============================================================
// ai/quiz.js — real bank questions as an in-chat quiz
// ============================================================
// A quiz card carries questions FROM THE BANK, never generated ones: the
// stem, options, answer and explanation a student sees are the ones the bank
// holds and the exam screen would show. The model only writes the one-line
// lead-in; it is never asked to produce a question or a key.
//
// Only deliverable questions (question-catalog.js already applies
// isQuestionDeliverable) of a shape a card can show faithfully (corpus.js
// isQuizzable: no figure, no reading passage, a valid key) are eligible.
//
// Selection: the subject the student named, narrowed to the topic words of
// the request when there are any (ranked with the same concept index as
// everything else, then sampled from the best few times n so a repeated
// request does not get the identical set); without a subject, the topic words
// across the whole bank. Each question links to itself in VetMock's exam
// screen through the shared-quiz URL.
// ============================================================

import { QUIZ_DEFAULT, QUIZ_MAX } from './config.js';
import { questionSetLink } from './links.js';
import { subjectName, topicLabel } from './corpus.js';
import { subjectsInText } from './subjects.js';

const clampN = (n) => {
  const v = Math.round(Number(n));
  return Number.isFinite(v) && v > 0 ? Math.min(QUIZ_MAX, v) : QUIZ_DEFAULT;
};

/** k items from a list, uniformly, without replacement (rng injectable for tests). */
export function sample(list, k, rng = Math.random) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, k);
}

/** One bank question in the card's shape. */
export function toQuizQuestion(q) {
  const tf = q.type === 'tf';
  const topic = topicLabel(q.subject, q.topic);
  return {
    id: q.id,
    stem: String(q.q || '').trim(),
    options: tf ? ['ถูก', 'ผิด'] : q.options.map((o) => String(o)),
    answer: tf ? (q.answer ? 0 : 1) : q.answer,
    explain: q.explain ? String(q.explain).trim() : null,
    // The course's display name, as in `sources` (the link carries the id).
    subject: subjectName(q.subject),
    ...(topic ? { topic } : {}),
    url: questionSetLink([q]),
  };
}

/**
 * Pick questions for a quiz.
 * @param {object} corpus     loadCorpus() result
 * @param {object} o
 * @param {string[]} o.subjects   resolved subject ids (may be empty)
 * @param {Array} o.concepts      topic concepts of the request (may be empty)
 * @param {number} [o.n]
 * @returns {{ card: object|null, picked: Array, pool: number, subject: string|null }}
 */
export function pickQuiz(corpus, { subjects = [], concepts = [], n, rng = Math.random } = {}) {
  const want = clampN(n);
  const subjectSet = new Set(subjects);
  const isQuestion = (d) => d.kind === 'question' && (!subjectSet.size || subjectSet.has(d.subject));
  // Topic words that are not just the course's own name ("COM5" names the
  // pool, it is not a topic inside it).
  const topical = concepts.filter((c) => c.core && !subjectsInText(c.label).length);
  let pool = [];
  if (topical.length) {
    const { results } = corpus.index.rank(topical, { filter: isQuestion, limit: want * 6 });
    pool = results.filter((r) => r.coverage >= 0.5).map((r) => corpus.docs[r.i]);
  }
  let narrowed = pool.length >= Math.min(want, 2);
  if (!narrowed) {
    if (!subjectSet.size) return { card: null, picked: [], pool: 0, subject: null };
    pool = corpus.docs.filter(isQuestion);
  }
  const best = narrowed ? pool.slice(0, Math.max(want * 3, want)) : pool;
  const picked = sample(best, Math.min(want, best.length), rng).map((d) => d.q);
  if (!picked.length) return { card: null, picked: [], pool: pool.length, subject: subjects[0] || null };
  const subject = subjects.length === 1 ? subjects[0] : (new Set(picked.map((q) => q.subject)).size === 1 ? picked[0].subject : null);
  const what = subject ? subjectName(subject) : 'จากคลัง VetMock';
  const card = {
    type: 'quiz',
    title: `ข้อสอบ ${what} ${picked.length} ข้อ`,
    questions: picked.map(toQuizQuestion),
  };
  return { card, picked, pool: pool.length, subject, narrowed };
}
