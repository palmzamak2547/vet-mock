import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDailyPlan } from '../../src/lib/daily-plan.js';

test('an imminent paper comes before an unrelated review backlog', () => {
  const plan = buildDailyPlan({ minutes: 30, due: 200, exam: true, examUrgent: true });
  assert.deepEqual(plan.steps.map(s => s.kind), ['exam', 'sr']);
  assert.ok(plan.steps[0].minutes >= plan.steps[1].minutes);
  assert.deepEqual(buildDailyPlan({ minutes: 30, due: 200, exam: true }).steps.map(s => s.kind), ['sr', 'exam']);
});

test('a small wrong-answer pool leaves room for useful practice and a bounded reading reserve', () => {
  const plan = buildDailyPlan({ minutes: 60, due: 2, wrong: 1, weakSubject: 'com3' });
  assert.deepEqual(plan.steps.map(s => [s.kind, s.count]), [['sr', 2], ['wrong', 1], ['weak', 25]]);
  assert.equal(plan.steps[2].subject, 'com3');
  assert.equal(plan.reviewMinutes, 6);
});

test('every plan has finite positive work within its budget, including partial or invalid counts', () => {
  for (const minutes of [15, 30, 60, 0, 45, NaN]) {
    for (const due of [0, 1, 2, 1000, -1, Infinity, NaN]) {
      for (const wrong of [0, 0.5, 1, 1000, -1, Infinity, NaN]) {
        const plan = buildDailyPlan({ minutes, due, wrong });
        assert.ok(plan.steps.length >= 1 && plan.steps.length <= 3);
        assert.ok(plan.steps.every(s => Number.isInteger(s.count) && s.count > 0 && s.count <= 30));
        assert.equal(plan.steps.reduce((sum, s) => sum + s.minutes, 0) + plan.reviewMinutes, plan.budget);
        assert.ok(plan.reviewMinutes >= 3 && plan.reviewMinutes <= 6);
      }
    }
  }
});

test('a thin or empty paper never promises more questions than its actual pool', () => {
  const thin = buildDailyPlan({ minutes: 60, practiceAvailable: 3, exam: true });
  assert.equal(thin.steps[0].count, 3);
  assert.equal(thin.reviewMinutes, 54);
  assert.deepEqual(buildDailyPlan({ practiceAvailable: 0 }).steps, []);
  assert.deepEqual(buildDailyPlan({ due: 2, practiceAvailable: 0 }).steps.map(s => s.kind), ['sr']);
});
