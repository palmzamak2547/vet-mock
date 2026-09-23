// ============================================================
// A subject must not be passable by always picking the longest option
// ============================================================
// lint:questions judged length one question at a time, against the mean
// distractor, and only warned below 1.6x. A key that is merely the longest
// option, by a margin too small to trip that ratio, passed every time, so a
// whole subject could reward "pick the longest" (com1 88%, engprof1 61%,
// vet-pharm-2 60% against a chance rate of 20-25%) and no gate noticed.
//
// The lint now scores each subject for two strategies, always-longest and
// always-shortest (ties split evenly, as year4-longest-option.test.mjs
// does), and fails when a subject beats chance by more than the margin
// unless it is listed in the budget, which may only fall.
// ============================================================

import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  lintQuestions,
  loadQuestions,
  lengthStrategyScores,
  LENGTH_STRATEGY_BUDGET,
  STRATEGY_MARGIN,
  STRATEGY_MIN_N,
} = require('../../scripts/lint-questions.cjs');

let nextId = 997000;
// One MCQ whose key sits at `answerAt`, with option lengths chosen by `lens`.
const mcq = (subject, lens, answerAt) => ({
  id: nextId++, subject, topic: 't', type: 'mcq', q: 'fixture',
  options: lens.map((n, i) => `${'ก'.repeat(n)}${i}`),
  answer: answerAt, explain: 'fixture',
});
const bank = (subject, n, pick) => Array.from({ length: n }, (_, i) => pick(i));
const strategyErrors = (qs, opts) => lintQuestions(qs, opts).errors.filter((f) => f.kind === 'length-strategy');

test('a subject whose key is always the longest option fails the lint', () => {
  // key 12 chars, distractors 10: never the 1.6x per-question ratio, always longest
  const qs = bank('fixture-longest', 25, (i) => mcq('fixture-longest', [10, 10, 12, 10], 2));
  assert.deepEqual(lintQuestions(qs).findings.filter((f) => f.kind === 'length-bias'), [], 'no per-question finding');
  const errs = strategyErrors(qs);
  assert.equal(errs.length, 1);
  assert.equal(errs[0].strategy, 'longest');
  assert.equal(errs[0].subject, 'fixture-longest');
});

test('always-shortest is scored the same way', () => {
  const qs = bank('fixture-shortest', 25, () => mcq('fixture-shortest', [12, 12, 10, 12], 2));
  const errs = strategyErrors(qs);
  assert.deepEqual(errs.map((e) => e.strategy), ['shortest']);
});

test('a subject whose key is the longest only at chance passes', () => {
  // key rotates through the positions of a fixed length ladder, so the key is
  // longest in one question of four: 25%, the chance rate
  const qs = bank('fixture-fair', 24, (i) => mcq('fixture-fair', [10, 11, 12, 13], i % 4));
  assert.deepEqual(strategyErrors(qs), []);
});

test('a small subject is not judged', () => {
  const qs = bank('fixture-small', STRATEGY_MIN_N - 1, () => mcq('fixture-small', [10, 10, 12, 10], 2));
  assert.deepEqual(strategyErrors(qs), []);
});

test('a listed subject may stay at its budget and fall, never rise', () => {
  const qs = bank('fixture-listed', 20, (i) => mcq('fixture-listed', [10, 10, 12, 10], i < 10 ? 2 : 0));
  // longest wins 10 of 20 = 50%
  const at = { longest: { 'fixture-listed': 50 }, shortest: {} };
  assert.deepEqual(strategyErrors(qs, { strategyBudget: at }), []);
  const below = { longest: { 'fixture-listed': 49 }, shortest: {} };
  assert.equal(strategyErrors(qs, { strategyBudget: below }).length, 1, 'rose above its budget');
  const loose = { longest: { 'fixture-listed': 60 }, shortest: {} };
  const warns = lintQuestions(qs, { strategyBudget: loose }).warns.filter((f) => f.kind === 'length-strategy-budget');
  assert.equal(warns.length, 1, 'a budget above the score asks to be lowered');
});

// The live bank against the committed budget.
const live = await loadQuestions();

test('the live bank is within its length-strategy budget', () => {
  assert.deepEqual(strategyErrors(live).map((e) => `${e.subject} ${e.strategy} ${e.score}%`), []);
});

// A listed subject that has since come within the margin is a lint warning
// ("delete it from LENGTH_STRATEGY_BUDGET"), not a failure: a rewrite that
// makes a subject fairer must not turn the gate red.
test('every subject that still beats chance is listed in the budget', () => {
  const scores = lengthStrategyScores(live);
  for (const strategy of ['longest', 'shortest']) {
    const over = scores
      .filter((s) => s.n >= STRATEGY_MIN_N && s[strategy] - s.chance > STRATEGY_MARGIN)
      .map((s) => s.subject);
    const unlisted = over.filter((s) => !Object.hasOwn(LENGTH_STRATEGY_BUDGET[strategy], s));
    assert.deepEqual(unlisted, [], strategy);
  }
});

// ============================================================
// An explanation that only restates the key is not an explanation
// ============================================================
// After a wrong answer, 104 legacy explanations just repeated the answer
// ("นิ้ว 2, 5", "Cast", "Tibial compression test") and never said why.
// scripts/lib/question-standard.mjs now names the defect (restatesKey), the
// standard report prints it as a coverage row, and lint:questions holds the
// count to RESTATED_KEY_BUDGET, which may only fall.
// ============================================================

const { restatesKey, COVERAGE } = await import('../../scripts/lib/question-standard.mjs');
const { RESTATED_KEY_BUDGET, lintBank } = require('../../scripts/lint-questions.cjs');

const tf = (q, explain) => ({ id: nextId++, subject: 'fixture', topic: 't', type: 'tf', q, answer: true, explain });
const choice = (options, answer, explain) => ({ id: nextId++, subject: 'fixture', topic: 't', type: 'mcq', q: 'fixture', options, answer, explain });

test('an explanation that repeats the key, or says almost nothing, is flagged', () => {
  const flagged = [
    choice(['1, 2', '2, 5', '3, 4', 'ทุกนิ้ว'], 1, 'นิ้ว 2, 5'),
    choice(['Soft bandage', 'Splint', 'Cast', 'Sling'], 2, 'Cast'),
    choice(['Introduction → Methodology → Results → Discussion / Conclusion', 'Methods → Results'], 0,
      'IMRD format = Introduction → Methodology → Results → Discussion / Conclusion'),
    { id: nextId++, subject: 'fixture', topic: 't', type: 'match', q: 'จับคู่', explain: '' },
  ];
  for (const q of flagged) assert.equal(restatesKey(q), true, JSON.stringify(q.explain));
});

test('an explanation that gives a reason is not flagged, however short', () => {
  const fine = [
    choice(['Femur', 'Humerus', 'Radius', 'Tibia'], 2, 'Radius ใส่ IM pin ไม่ได้เพราะ medullary canal แคบและโค้ง'),
    tf('เชื้อ Mycoplasma ไม่มีผนังเซลล์ จึงดื้อต่อยากลุ่มเพนิซิลลิน',
      'ถูก Mycoplasma ไม่มีผนังเซลล์ ยาที่ออกฤทธิ์ต่อผนังเซลล์จึงไม่มีเป้าหมายให้ทำลาย'),
    choice(['Bromocriptine', 'Oxytocin'], 0, 'Bromocriptine ยับยั้ง prolactin จึงหยุดการสร้างน้ำนมใน pseudopregnancy'),
  ];
  for (const q of fine) assert.equal(restatesKey(q), false, JSON.stringify(q.explain));
});

test('the standard report prints the new coverage row', () => {
  assert.ok(COVERAGE.some(([label]) => /reason/.test(label)), COVERAGE.map(([l]) => l).join(', '));
});

test('lint:questions holds restated keys to a budget that may only fall', () => {
  const rows = [choice(['A1', 'B1'], 0, 'A1'), choice(['A2', 'B2'], 0, 'A2 ถูกเพราะ B2 เป็นกลไกที่ต่างออกไปโดยสิ้นเชิง')];
  const over = lintQuestions(rows, { restatesKey, restatedKeyBudget: 0 });
  assert.deepEqual(over.errors.filter((f) => f.kind === 'restated-key').map((f) => f.count), [1]);
  const at = lintQuestions(rows, { restatesKey, restatedKeyBudget: 1 });
  assert.deepEqual(at.errors.filter((f) => f.kind === 'restated-key'), []);
  const loose = lintQuestions(rows, { restatesKey, restatedKeyBudget: 5 });
  assert.equal(loose.warns.filter((f) => f.kind === 'restated-key-budget').length, 1);
});

// Under the budget is a lint warning asking for the number to be lowered, not
// a failure: rewriting one more explanation must not turn the gate red.
test('the live bank is within the restated-key budget', () => {
  const count = live.filter(restatesKey).length;
  assert.ok(count <= RESTATED_KEY_BUDGET, `${count} restated keys, budget ${RESTATED_KEY_BUDGET}`);
});

// The CLI must pass the predicate in: lintQuestions() without it skips the
// check, so this goes through lintBank, the path main() takes.
test('lint:questions itself fails when one more explanation only restates the key', async () => {
  const clean = await lintBank(live);
  assert.deepEqual(clean.errors.filter((f) => f.kind === 'restated-key'), []);
  const extra = Array.from({ length: RESTATED_KEY_BUDGET + 1 - live.filter(restatesKey).length }, () => choice(['A9', 'B9'], 0, 'A9'));
  const over = await lintBank([...live, ...extra]);
  assert.deepEqual(over.errors.filter((f) => f.kind === 'restated-key').map((f) => f.count), [RESTATED_KEY_BUDGET + 1]);
});
