import test from 'node:test';
import assert from 'node:assert/strict';

import {
  examScopeForPhase,
  isCurrentScopeQuestion,
  isHighPredictionQuestion,
  predictionMetadataIssues,
  questionInScope,
  questionNeedsAnswerReview,
} from '../../src/lib/question-prediction.js';

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
  assert.equal(isCurrentScopeQuestion({ ...BASE, predictionTier: 'medium', examScope: 'continuous' }, {
    curriculumVersion: '2569-1',
    examScope: 'continuous',
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

test('an explicit bucket wins over the browsing phase and keeps the three piles apart', () => {
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
  // explicit examScope overrides a contradicting selectedPhase
  assert.equal(isCurrentScopeQuestion({ ...BASE, examScope: 'final' }, {
    curriculumVersion: '2569-1',
    selectedPhase: '1-mid',
    examScope: 'final',
  }), true);
  assert.equal(isCurrentScopeQuestion({ ...BASE, examScope: 'midterm' }, {
    curriculumVersion: '2569-1',
    selectedPhase: '1-mid',
    examScope: 'final',
  }), false);
});

test('prediction metadata is all-or-nothing and high tier needs two signals', () => {
  assert.deepEqual(predictionMetadataIssues(BASE), []);
  assert.deepEqual(predictionMetadataIssues({ q: 'legacy question' }), []);
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
