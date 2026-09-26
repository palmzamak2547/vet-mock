// ============================================================
// review-self-graded.test.mjs — a written answer is not ✗ ผิด
// ============================================================
// B10/B51 (bug hunt 2026-09-26). Results keeps essays and short answers out
// of the score ("มีข้อเขียน N ข้อ ตรวจด้วย rubric"). Review asked isCorrect,
// which is always false for an essay and, for a short answer, a keyword
// count: 14 of the 110 keyword-graded short items fail their OWN model
// answer (keywords written as whole sentences, or 15 to 19 alternatives for
// "ยกตัวอย่าง 2 แบบ"). So a written essay, or the bank's own model answer,
// showed ✗ ผิด, sat in the ผิด tab, and Review opened on that tab.
//
// Review now gives a written answer its own bucket, ประเมินเอง, the same
// thing Results calls it. These run Review's own counting code.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

import * as utils from '../../src/hooks/utils.js';

const { reviewOutcome } = utils;
const REVIEW = readFileSync(new URL('../../src/views/ReviewView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

async function corpusQuestion(id) {
  const { BANK_REGISTRY } = await import('../../src/data/bank-registry.generated.js');
  for (const bank of BANK_REGISTRY) {
    const q = (await bank.load()).find((x) => x?.id === id);
    if (q) return q;
  }
  throw new Error(`question ${id} is gone from the corpus`);
}

test('a written answer is self-graded, whatever the keyword count says', async () => {
  const q8355 = await corpusQuestion(8355);
  assert.equal(q8355.type, 'short');
  assert.equal(utils.isCorrect(q8355, q8355.model_answer), false, 'the keyword grader rejects the bank\'s own model answer');
  assert.equal(reviewOutcome(q8355, q8355.model_answer), 'self');
  assert.equal(reviewOutcome({ id: 1, type: 'essay' }, 'A full essay.'), 'self');
  assert.equal(reviewOutcome({ id: 2, type: 'short', keywords: ['x'] }, 'no'), 'self');
});

test('blank written answers are still skipped, and auto-graded ones keep their outcome', () => {
  assert.equal(reviewOutcome({ id: 1, type: 'essay' }, '   '), 'skipped');
  assert.equal(reviewOutcome({ id: 2, type: 'short', keywords: ['x'] }, undefined), 'skipped');
  const mcq = { id: 3, type: 'mcq', options: ['a', 'b'], answer: 1 };
  assert.equal(reviewOutcome(mcq, 1), 'correct');
  assert.equal(reviewOutcome(mcq, 0), 'wrong');
  assert.equal(reviewOutcome(mcq, undefined), 'skipped');
});

const FIXTURE = [
  { q: { id: 1, type: 'essay', model_answer: 'm' }, ua: 'My essay', is: 'self' },
  { q: { id: 2, type: 'short', keywords: ['HPAI พบเฉพาะ H5 และ H7'], model_answer: 'H5, H7' }, ua: 'H5 and H7', is: 'self' },
  { q: { id: 3, type: 'mcq', options: ['a', 'b'], answer: 1 }, ua: 1, is: 'correct' },
  { q: { id: 4, type: 'mcq', options: ['a', 'b'], answer: 1 }, ua: 0, is: 'wrong' },
  { q: { id: 5, type: 'essay' }, ua: undefined, is: 'skipped' },
];
const questions = FIXTURE.map((f) => f.q);
const answers = Object.fromEntries(FIXTURE.filter((f) => f.ua !== undefined).map((f) => [f.q.id, f.ua]));

function memoBody(name) {
  const m = REVIEW.match(new RegExp(`const ${name} = useMemo\\(\\(\\) => \\{([\\s\\S]*?)\\n {2}\\}, \\[`));
  assert.ok(m, `ReviewView no longer memoises ${name}`);
  return m[1];
}
const run = (body, scope) => vm.runInContext(`(() => {${body}\n})()`, vm.createContext({ ...utils, ...scope }));

test('Review counts written answers under ประเมินเอง, not ผิด', () => {
  const counts = run(memoBody('counts'), { questions, answers, bookmarks: [], notes: {} });
  assert.equal(counts.wrong, 1, 'a written answer is counted under ผิด');
  assert.equal(counts.self, 2);
  assert.equal(counts.correct + counts.wrong + counts.skipped + counts.self, questions.length);
});

test('the ประเมินเอง tab shows the written answers, and ผิด does not', () => {
  const body = memoBody('filtered');
  const shown = (filter) => run(body, { questions, answers, bookmarks: [], notes: {}, filter }).map((q) => q.id);
  assert.deepEqual(shown('wrong'), [4]);
  assert.deepEqual(shown('self'), [1, 2]);
  assert.ok(/\{ id: 'self',\s+label: 'ประเมินเอง'/.test(REVIEW), 'Review has no ประเมินเอง tab');
});

test('a set of written answers does not open Review on the ผิด tab', () => {
  const init = REVIEW.match(/const \[filter, setFilter\] = useState\(\(\) => \{([\s\S]*?)\n {2}\}\);/);
  assert.ok(init, 'the initial filter is no longer derived in one place');
  const writtenOnly = FIXTURE.filter((f) => f.is === 'self').map((f) => f.q);
  const first = run(init[1], { questions: writtenOnly, answers });
  assert.notEqual(first, 'wrong');
});

test('the review row takes its state from the same rule as the counts', () => {
  assert.ok(REVIEW.includes('const outcome = reviewOutcome(q, userAns);'), 'the row decides its outcome its own way');
  assert.ok(REVIEW.includes("const correct = outcome === 'correct';"), 'the row reads correct from somewhere else');
  const cls = REVIEW.match(/\n\s+const cls = ([^\n]+);\n/);
  assert.ok(cls, 'the row class is no longer one expression');
  const clsFor = (outcome, isPartial = false) => vm.runInContext(cls[1], vm.createContext({ outcome, isPartial, answered: outcome !== 'skipped', correct: outcome === 'correct' }));
  assert.equal(clsFor('self'), 'skipped', 'a written row is red');
  assert.equal(clsFor('wrong'), 'wrong');
  assert.equal(clsFor('wrong', true), 'skipped', 'a part-right matching set is not red');
  assert.equal(clsFor('correct'), 'correct');
  assert.equal(clsFor('skipped'), 'skipped');
  assert.ok(REVIEW.includes("outcome === 'self' ? 'ประเมินเอง'"), 'a written row is not labelled ประเมินเอง');
});
