import assert from 'node:assert/strict';
import test from 'node:test';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import {
  QB_TOTAL,
  QB_SOURCE_TOTAL,
  QB_BLOCKED_TOTAL,
  Q_COUNTS_BY_SUBJECT,
  Q_COUNTS_BY_TOPIC,
  Q_CURRENT_SCOPE_COUNTS,
  Q_HIGH_PREDICTION_COUNTS,
  Q_PAST_PAPER_COUNTS_BY_TOPIC,
} from '../../src/data/q-counts.js';
import { BLOCKED_QUESTION_COUNT, isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { isPastPaperQuestion, questionTopicId } from '../../src/lib/question-metadata.js';
import { isCurrentScopeQuestion, isHighPredictionQuestion } from '../../src/lib/question-prediction.js';

const questions = [];
for (const entry of BANK_REGISTRY) {
  const bank = await entry.load();
  if (Array.isArray(bank)) questions.push(...bank);
}
const deliverableQuestions = questions.filter(isQuestionDeliverable);

function countByTopic(predicate = () => true) {
  const counts = {};
  for (const q of deliverableQuestions) {
    if (!predicate(q)) continue;
    const subject = q.subject || '__unknown__';
    const topic = questionTopicId(q);
    counts[subject] ||= {};
    counts[subject][topic] = (counts[subject][topic] || 0) + 1;
  }
  return counts;
}

test('generated per-topic counts exactly cover the live question banks', () => {
  const liveCounts = countByTopic();

  assert.deepEqual(Q_COUNTS_BY_TOPIC, liveCounts);
  assert.equal(deliverableQuestions.length, QB_TOTAL);
  assert.equal(questions.length, QB_SOURCE_TOTAL);
  assert.equal(questions.length - deliverableQuestions.length, QB_BLOCKED_TOTAL);
  assert.equal(QB_BLOCKED_TOTAL, BLOCKED_QUESTION_COUNT);

  for (const [subject, topics] of Object.entries(Q_COUNTS_BY_TOPIC)) {
    const nestedTotal = Object.values(topics).reduce((sum, count) => sum + count, 0);
    assert.equal(
      nestedTotal,
      Q_COUNTS_BY_SUBJECT[subject],
      `${subject}: nested topic counts must sum to its subject total`,
    );
  }
});

test('figure-dependent Epidemiology questions are deliverable with real assets', () => {
  for (const id of [100002, 100004]) {
    const question = questions.find((q) => q.subject === 'epidemiology' && q.id === id);
    assert.ok(question, `epidemiology:${id} must exist`);
    assert.equal(isQuestionDeliverable(question), true, `epidemiology:${id} must not be blocked`);
    assert.match(question.image || '', /^\/figures\/questions\/q\d+\.webp$/);
    assert.ok(question.imageAlt?.length > 20, `epidemiology:${id} must have useful alt text`);
    assert.ok(question.imageCredit?.length > 10, `epidemiology:${id} must show provenance`);
  }
});

test('generated past-paper counts include canonical and legacy markers', () => {
  const liveCounts = countByTopic(isPastPaperQuestion);

  assert.deepEqual(Q_PAST_PAPER_COUNTS_BY_TOPIC, liveCounts);

  for (const [subject, topics] of Object.entries(Q_PAST_PAPER_COUNTS_BY_TOPIC)) {
    for (const [topic, count] of Object.entries(topics)) {
      assert.ok(
        count <= (Q_COUNTS_BY_TOPIC[subject]?.[topic] || 0),
        `${subject}/${topic}: past-paper count cannot exceed its total`,
      );
    }
  }
});

test('generated high-prediction counts match verified current-scope questions', () => {
  const buildScopedCounts = (predicate) => {
    const live = {};
    for (const q of deliverableQuestions) {
      if (hiddenBySubject.get(q.subject)?.has(q.topic)) continue;
      const version = q.curriculumVersion;
      if (!version || !predicate(q, { curriculumVersion: version })) continue;
      const subject = q.subject || '__unknown__';
      live[version] ||= { all: {}, midterm: {}, final: {}, continuous: {} };
      live[version].all[subject] = (live[version].all[subject] || 0) + 1;
      const scopes = q.examScope === 'both'
        ? ['midterm', 'final']
        : q.examScope === 'continuous'
          ? ['continuous', 'midterm', 'final']
          : [q.examScope];
      for (const scope of scopes) {
        if (!live[version][scope]) continue;
        live[version][scope][subject] = (live[version][scope][subject] || 0) + 1;
      }
    }
    return live;
  };
  const hiddenBySubject = new Map(SUBJECTS.map((subject) => [
    subject.id,
    new Set((subject.topics || []).filter((topic) => topic.hidden).map((topic) => topic.id)),
  ]));
  assert.deepEqual(Q_CURRENT_SCOPE_COUNTS, buildScopedCounts(isCurrentScopeQuestion));
  assert.deepEqual(Q_HIGH_PREDICTION_COUNTS, buildScopedCounts(isHighPredictionQuestion));
});

test('past-paper metadata rule keeps canonical and legacy banks aligned', () => {
  assert.equal(isPastPaperQuestion({ sourceType: 'past-paper' }), true);
  assert.equal(isPastPaperQuestion({ examOrigin: 'Vet 84 Final Q12' }), true);
  assert.equal(isPastPaperQuestion({ examOrigin: 'Mock 1 Part I' }), false);
  assert.equal(isPastPaperQuestion({ examOrigin: 'OSCE 14 May 2025 station prep doc' }), false);
  assert.equal(isPastPaperQuestion({ sourceType: 'student-compilation', examOrigin: 'Vet 85 recall' }), false);
  assert.equal(isPastPaperQuestion({ sourceType: 'lecture-derived', examOrigin: 'Final study notes' }), false);
  assert.equal(isPastPaperQuestion({ source: 'ข้อสอบเก่า Final 86' }), true);
  assert.equal(isPastPaperQuestion({ source: 'Past paper review' }), true);
  assert.equal(isPastPaperQuestion({ source: '7. ข้อสอบ 81' }), true);
  assert.equal(isPastPaperQuestion({ source: 'EXOTIC MID 86 Q12' }), true);
  assert.equal(isPastPaperQuestion({ examOrigin: 'Past Exam 2021, Part III' }), true);
  assert.equal(isPastPaperQuestion({ sourceType: 'lecture', source: 'Lecture slide' }), false);
  assert.equal(questionTopicId({}), '__unassigned__');
});
