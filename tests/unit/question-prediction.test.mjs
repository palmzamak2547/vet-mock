import test from 'node:test';
import assert from 'node:assert/strict';

import {
  examScopeForPhase,
  predictionMetadataIssues,
  questionInScope,
  questionNeedsAnswerReview,
} from '../../src/lib/question-prediction.js';
import { isCurrentScopeQuestion, isHighPredictionQuestion } from '../../src/lib/current-scope.js';
import { scopeForTopic, questionInScope as onPaper } from '../../src/lib/exam-scope.js';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const BASE = {
  sourceType: 'lecture-derived',
  answerStatus: 'verified',
  curriculumVersion: '2569-1',
  examScope: 'midterm',
  predictionTier: 'high',
  predictionSignals: ['current-lecture', 'senior-recurrence'],
  predictionEvidence: ['Senior examination summary p.1 Q1'],
};

test('phase ids map to an exam scope without confusing semester and exam', () => {
  assert.equal(examScopeForPhase('1-mid'), 'midterm');
  assert.equal(examScopeForPhase('2-final'), 'final');
  assert.equal(examScopeForPhase(null), null);
});

test('high-prediction practice requires current, verified, phase-matching evidence', () => {
  assert.equal(isCurrentScopeQuestion({ ...BASE, predictionTier: 'medium' }, {
    curriculumVersion: '2569-1',
    selectedPhase: '1-mid',
  }), true);
  assert.equal(isHighPredictionQuestion(BASE, {
    curriculumVersion: '2569-1',
    selectedPhase: '1-mid',
  }), true);
  assert.equal(isHighPredictionQuestion({ ...BASE, examScope: 'both' }, {
    curriculumVersion: '2569-1',
    selectedPhase: '1-final',
  }), true);
  // Continuous assessment is not a final paper: browsing the final phase
  // must not sweep it in. It has its own bucket.
  assert.equal(isCurrentScopeQuestion({ ...BASE, predictionTier: 'medium', examScope: 'continuous' }, {
    curriculumVersion: '2569-1',
    selectedPhase: '1-final',
  }), false);
  // With no phase chosen the semester view still carries it.
  assert.equal(isCurrentScopeQuestion({ ...BASE, predictionTier: 'medium', examScope: 'continuous' }, {
    curriculumVersion: '2569-1',
  }), true);
  assert.equal(isHighPredictionQuestion({ ...BASE, examScope: 'final' }, {
    curriculumVersion: '2569-1',
    selectedPhase: '1-mid',
  }), false);
  assert.equal(isHighPredictionQuestion({ ...BASE, answerStatus: 'needs-review' }, {
    curriculumVersion: '2569-1',
    selectedPhase: '1-mid',
  }), false);
  assert.equal(isHighPredictionQuestion(BASE, {
    curriculumVersion: '2568-2',
    selectedPhase: '1-mid',
  }), false);
  assert.equal(isHighPredictionQuestion(BASE, {
    curriculumVersion: '2569-1',
    selectedPhase: '2-mid',
  }), false);
  assert.equal(isHighPredictionQuestion({ ...BASE, predictionSignals: ['current-lecture'] }, {
    curriculumVersion: '2569-1',
    selectedPhase: '1-mid',
  }), false);
});

test('the phase selector keeps midterm, final and no-paper courses apart', () => {
  // midterm bucket: midterm + both, never final or continuous
  assert.equal(questionInScope('midterm', 'midterm'), true);
  assert.equal(questionInScope('both', 'midterm'), true);
  assert.equal(questionInScope('final', 'midterm'), false);
  assert.equal(questionInScope('continuous', 'midterm'), false);
  // final bucket
  assert.equal(questionInScope('final', 'final'), true);
  assert.equal(questionInScope('both', 'final'), true);
  assert.equal(questionInScope('continuous', 'final'), false);
  // continuous bucket holds only continuous
  assert.equal(questionInScope('continuous', 'continuous'), true);
  assert.equal(questionInScope('both', 'continuous'), false);
  // no bucket = everything
  assert.equal(questionInScope('continuous', null), true);
  // the phase selector is the only way in: 1-final asks for the final pile
  assert.equal(isCurrentScopeQuestion({ ...BASE, examScope: 'final' }, {
    curriculumVersion: '2569-1',
    selectedPhase: '1-final',
  }), true);
  assert.equal(isCurrentScopeQuestion({ ...BASE, examScope: 'midterm' }, {
    curriculumVersion: '2569-1',
    selectedPhase: '1-final',
  }), false);
});

test('the topic decides which paper a vouched question sits, as it does for every other set', () => {
  // A topic's examScope is this year's timetable; the question's own field
  // is the paper it was written for, often another cohort's. Read alone, the
  // field kept 30 verified equine questions out of the final's
  // ตามสไลด์ปัจจุบัน set, while their topics sit both papers.
  assert.equal(scopeForTopic('equine-medicine', 'equine-intro'), 'both', 'premise: equine-intro sits both papers');
  assert.equal(scopeForTopic('zoonoses', 'zoo-intro'), 'midterm', 'premise: zoo-intro sits the midterm');
  assert.equal(scopeForTopic('zoonoses', 'zoo-mycoses'), 'final', 'premise: zoo-mycoses sits the final');
  assert.equal(scopeForTopic('poa-clinical', 'poa-intro'), 'continuous', 'premise: POA has no written paper');
  assert.equal(scopeForTopic('equine-medicine', 'no-such-topic'), null, 'premise: an unknown topic has no scope');

  const at = (selectedPhase) => ({ curriculumVersion: '2569-1', selectedPhase });
  const sits = (question) => ['1-mid', '1-final'].filter((phase) => isCurrentScopeQuestion(question, at(phase)));
  const onBoth = { ...BASE, subject: 'equine-medicine', topic: 'equine-intro', examScope: 'midterm' };
  assert.deepEqual(sits(onBoth), ['1-mid', '1-final'], 'a both-paper topic sits both papers');
  assert.equal(isHighPredictionQuestion(onBoth, at('1-final')), true, 'the predicted set reads the same rule');
  assert.deepEqual(sits({ ...BASE, subject: 'zoonoses', topic: 'zoo-intro', examScope: 'final' }), ['1-mid']);
  assert.deepEqual(sits({ ...BASE, subject: 'zoonoses', topic: 'zoo-mycoses', examScope: 'midterm' }), ['1-final']);
  // A course with no written paper sits neither paper whatever its question
  // says, and a question that says continuous sits neither on any topic.
  assert.deepEqual(sits({ ...BASE, subject: 'poa-clinical', topic: 'poa-intro', examScope: 'midterm' }), []);
  assert.deepEqual(sits({ ...BASE, subject: 'equine-medicine', topic: 'equine-intro', examScope: 'continuous' }), []);
  // Where the topic has no scope, the question's own field still answers.
  assert.deepEqual(sits({ ...BASE, subject: 'equine-medicine', topic: 'no-such-topic', examScope: 'final' }), ['1-final']);
  // No period picked: the whole semester, as before.
  assert.equal(isCurrentScopeQuestion(onBoth, { curriculumVersion: '2569-1' }), true);
});

test('on the real bank, every vouched question sits exactly the papers the pool puts it on', async () => {
  // The set filters by this predicate and then by the paper. If the two
  // disagree, the set is their overlap and a question disappears from a
  // paper its topic sits.
  const wrong = [];
  let checked = 0;
  for (const entry of BANK_REGISTRY) {
    const bank = await entry.load();
    for (const q of Array.isArray(bank) ? bank : []) {
      const version = q.curriculumVersion;
      if (!version || !isCurrentScopeQuestion(q, { curriculumVersion: version })) continue;
      checked += 1;
      const term = String(version).split('-')[1];
      for (const [phase, paper] of [[`${term}-mid`, 'midterm'], [`${term}-final`, 'final']]) {
        const vouched = isCurrentScopeQuestion(q, { curriculumVersion: version, selectedPhase: phase });
        const placed = onPaper(q, paper);
        if (vouched !== placed) wrong.push(`${q.subject}:${q.id} (${q.topic}) ${phase}: set ${vouched}, paper ${placed}`);
      }
    }
  }
  assert.ok(checked > 100, `only ${checked} vouched questions found; the bank did not load`);
  assert.deepEqual(wrong, []);
});

test('prediction metadata is all-or-nothing and high tier needs two signals', () => {
  assert.deepEqual(predictionMetadataIssues(BASE), []);
  assert.deepEqual(predictionMetadataIssues({ q: 'legacy question' }), []);
  // ...but which PAPER a question sits is a separate axis: saying so alone is
  // a complete statement, not half a prediction. Folding the two together is
  // what would have failed 5,169 questions the moment we started separating
  // the midterm pile from the final one.
  assert.deepEqual(predictionMetadataIssues({ q: 'legacy', examScope: 'midterm' }), []);
  assert.deepEqual(predictionMetadataIssues({ q: 'legacy', examScope: 'nonsense' }), ['examScope']);
  assert.deepEqual(
    predictionMetadataIssues({ ...BASE, predictionSignals: ['current-lecture'] }),
    ['highTierNeedsTwoSignals'],
  );
  assert.deepEqual(
    predictionMetadataIssues({ ...BASE, predictionEvidence: [] }),
    ['predictionEvidence', 'highTierNeedsEvidence'],
  );
  assert.ok(predictionMetadataIssues({ predictionTier: 'high' }).length >= 5);
});

test('evidence-only metadata and unknown signal names fail closed', () => {
  assert.ok(predictionMetadataIssues({
    predictionEvidence: ['Senior paper p.1'],
  }).length > 0);
  assert.ok(predictionMetadataIssues({
    ...BASE,
    predictionSignals: ['banana', 'banana-two'],
    predictionTier: 'high',
    predictionEvidence: ['Senior paper p.1'],
  }).includes('predictionSignals'));
});

test('pending and legacy unclear answers fail closed', () => {
  assert.equal(questionNeedsAnswerReview({ answerStatus: 'needs-review' }), true);
  assert.equal(questionNeedsAnswerReview({ flag: { severity: 'unclear' } }), true);
  assert.equal(questionNeedsAnswerReview({ answerStatus: 'verified' }), false);
});
