// ============================================================
// subject-progress.test.mjs — coverage % per subject
// ============================================================
// Guards the pure lib behind every "เรียนวิชานี้ไปกี่ %" surface
// (Home cards, subject select, dashboard). The dangerous mistakes
// are all in the edges: blocked questions inflating the numerator,
// hidden topics inflating the denominator, cross-subject id
// collisions leaking progress between subjects, custom questions
// being invisible, and a subject with no pool claiming a %.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  answeredKeysBySubject,
  computeSubjectProgress,
} from '../../src/lib/subject-progress.js';
import { BLOCKED_QUESTIONS, isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { SUBJECTS, hiddenTopicIdsFor, visibleQuestionCount } from '../../src/data/curriculum.js';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const mkQ = (id, subject, topic, over = {}) => ({ id, subject, topic, q: 'q', options: ['a', 'b'], answer: 0, ...over });
const hist = (subject, questionId, over = {}) => ({ date: 1, questionId, correct: false, subject, year: 5, phase: null, ...over });

test('answeredKeysBySubject: compound keys, distinct per subject', () => {
  const keys = answeredKeysBySubject([hist('com5', 1), hist('com5', 1), hist('com5', 2), hist('surg', 4)]);
  assert.equal(keys.get('com5').size, 2, 'duplicate attempts collapse to one covered question');
  assert.deepEqual([...keys.get('com5')], ['com5:1', 'com5:2']);
  assert.deepEqual([...keys.get('surg')], ['surg:4']);
});

test('answeredKeysBySubject: junk rows are skipped, never crash', () => {
  const keys = answeredKeysBySubject([null, {}, { questionId: 1 }, hist('com5', 1)]);
  assert.equal(keys.size, 1);
});

test('computeSubjectProgress: wrong answers still count as covered', () => {
  const out = computeSubjectProgress({
    history: [hist('com5', 1, { correct: false }), hist('com5', 2, { correct: false })],
    allQuestions: [mkQ(1, 'com5', 'cve'), mkQ(2, 'com5', 'cve'), mkQ(3, 'com5', 'zoo')],
  });
  assert.deepEqual(out.com5, { covered: 2, total: 3, pct: 67 });
});

test('computeSubjectProgress: same numeric id does not leak across subjects', () => {
  // com5:1 is answered; surg also has id 1 — bare-id matching would
  // credit surgery with com5's progress.
  const bank = [mkQ(1, 'com5', 'cve'), mkQ(1, 'surg', 'wound'), mkQ(2, 'surg', 'wound')];
  const out = computeSubjectProgress({ history: [hist('com5', 1)], allQuestions: bank });
  assert.equal(out.com5.covered, 1);
  assert.deepEqual(out.surg, { covered: 0, total: 2, pct: 0 }, 'collision must not leak coverage');
});

test('computeSubjectProgress: blocked questions never count — not even from old history', () => {
  const [blocked] = BLOCKED_QUESTIONS;
  const [blockedSubject, blockedId] = blocked.key.split(':');
  const bank = [
    mkQ(1, 'com5', 'cve'), mkQ(2, 'com5', 'cve'), mkQ(3, 'com5', 'zoo'),
    mkQ(Number(blockedId), blockedSubject, 'some-topic'),
  ];
  const out = computeSubjectProgress({
    history: [hist('com5', 1), hist('com5', 2), hist('com5', 3), hist(blockedSubject, Number(blockedId))],
    allQuestions: bank,
  });
  assert.equal(out.com5.total, 3, 'blocked question is not in the pool');
  assert.equal(out.com5.pct, 100);
  // The blocked subject has no pool, so its answered history shows 0%
  // rather than 100-of-nothing.
  assert.deepEqual(out[blockedSubject], { covered: 0, total: 0, pct: 0 });
});

test('computeSubjectProgress: hidden topics shrink the denominator', () => {
  const withHidden = SUBJECTS.find((s) => s.id !== 'all' && Array.isArray(s.topics) && s.topics.some((t) => t.hidden));
  if (!withHidden) { assert.ok(true, 'no hidden topics in curriculum this run — rule vacuously held'); return; }
  const visibleTopic = withHidden.topics.find((t) => !t.hidden).id;
  const hiddenTopic = withHidden.topics.find((t) => t.hidden).id;
  const bank = [mkQ(10, withHidden.id, visibleTopic), mkQ(11, withHidden.id, hiddenTopic)];
  const out = computeSubjectProgress({ history: [hist(withHidden.id, 10), hist(withHidden.id, 11)], allQuestions: bank });
  assert.equal(out[withHidden.id].total, 1, 'hidden-topic question is not offered');
  assert.equal(out[withHidden.id].covered, 1, 'but the answered visible one counts');
  assert.equal(out[withHidden.id].pct, 100);
});

test('computeSubjectProgress: custom questions join the pool', () => {
  const custom = [{ id: 9001, subject: 'com5', topic: 'cve', q: 'q', options: ['a'], answer: 0 }];
  const out = computeSubjectProgress({
    history: [hist('com5', 1), hist('com5', 9001)],
    allQuestions: [mkQ(1, 'com5', 'cve')],
    customQuestions: custom,
  });
  assert.deepEqual(out.com5, { covered: 2, total: 2, pct: 100 });
});

test('computeSubjectProgress: empty inputs yield empty, never a crash', () => {
  assert.deepEqual(computeSubjectProgress({}), {});
  assert.deepEqual(computeSubjectProgress({ history: null, allQuestions: null, customQuestions: null }), {});
  const out = computeSubjectProgress({ history: [hist('com5', 1)], allQuestions: [] });
  assert.deepEqual(out.com5, { covered: 0, total: 0, pct: 0 }, 'no pool → no progress claim');
});

test('computeSubjectProgress: answering the whole real pool = 100%, totals match visibleQuestionCount', async () => {
  // Integration against the real loaded bank, one genuinely pool-
  // bearing subject: pct caps at 100 and the denominator equals the
  // count the subject cards already show.
  const allQuestions = [];
  for (const bank of BANK_REGISTRY) {
    allQuestions.push(...(await bank.load()));
  }
  const pool = allQuestions.filter((q) => q?.subject && q?.topic
    && isQuestionDeliverable(q) && !hiddenTopicIdsFor(q.subject).has(q.topic));
  assert.ok(pool.length > 100, `expected a real pool, got ${pool.length}`);

  const target = pool[0].subject;
  const history = pool.filter((q) => q.subject === target).map((q) => hist(target, q.id));
  const out = computeSubjectProgress({ history, allQuestions });

  const expectedTotal = visibleQuestionCount(target, allQuestions);
  assert.ok(expectedTotal > 0, 'target subject must have a visible pool');
  assert.equal(out[target].total, expectedTotal, 'pool must match visibleQuestionCount');
  assert.equal(out[target].pct, 100, 'answering the whole pool = 100%');
  for (const [subject, r] of Object.entries(out)) {
    assert.ok(r.pct >= 0 && r.pct <= 100, `${subject} pct out of range: ${r.pct}`);
    assert.ok(r.covered <= r.total, `${subject} covered > total`);
  }
});
