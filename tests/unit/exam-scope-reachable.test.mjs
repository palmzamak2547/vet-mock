// Every question must be reachable from at least one phase.
//
// Palm, 2026-09-19: "อย่าให้มีปลายภาค ตอนเลือกกลางภาคเด็ดขาด" — and the other
// half of that, which is easy to miss while enforcing the first: a question
// must not fall out of BOTH papers either. A student who cannot reach a
// question has lost it, and loses it silently.
//
// The two examScope fields do not mean the same thing. A topic's is THIS
// year's timetable. A question's is the paper it was recorded from, often
// another cohort's. So the topic decides which paper a question is on now, and
// the question's own tag is consulted only when its topic has no timetable
// entry. Reading both as an AND hid 11 questions from midterm and final
// alike: the aquatic conservation set, for instance, is tagged midterm
// because Vet 85 sat that lecture early, while the topic is final for Vet 86.

import assert from 'node:assert/strict';
import test from 'node:test';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import { questionInScope, scopeOfQuestion } from '../../src/lib/exam-scope.js';

const questions = [];
for (const entry of BANK_REGISTRY) {
  const bank = await entry.load();
  if (Array.isArray(bank)) questions.push(...bank);
}

const PHASES = ['midterm', 'final'];

test('no question is invisible in every phase', () => {
  const orphans = questions.filter((q) => {
    if (scopeOfQuestion(q) === 'continuous') return false; // no written paper, by design
    return !PHASES.some((phase) => questionInScope(q, phase));
  });
  const sample = orphans.slice(0, 8).map((q) => `${q.id} ${q.subject}/${q.topic}`);
  assert.equal(orphans.length, 0, `unreachable questions: ${orphans.length}\n${sample.join('\n')}`);
});

test("a question tagged for another cohort's paper follows its topic", () => {
  // aqua-conservation is taught after the midterm for Vet 86; the questions on
  // it were transcribed from a paper where it came before one.
  const q = { subject: 'aquatic-clinic', topic: 'aqua-conservation', examScope: 'midterm' };
  assert.equal(questionInScope(q, 'midterm'), false, 'must not pad a midterm set');
  assert.equal(questionInScope(q, 'final'), true, 'must still be practisable');
});

test('a question keeps its own tag when its topic has no timetable entry', () => {
  const q = { subject: 'no-such-subject', topic: 'no-such-topic', examScope: 'final' };
  assert.equal(questionInScope(q, 'final'), true);
  assert.equal(questionInScope(q, 'midterm'), false);
});

test('continuous on a question is never overridden by a topic', () => {
  // A course with no written paper must not have its questions pulled into
  // one by the topic it happens to sit under.
  const q = { subject: 'aquatic-clinic', topic: 'aqua-conservation', examScope: 'continuous' };
  assert.equal(scopeOfQuestion(q), 'continuous');
  assert.equal(questionInScope(q, 'midterm'), false);
  assert.equal(questionInScope(q, 'final'), false);
});
