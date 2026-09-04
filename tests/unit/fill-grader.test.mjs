// ============================================================
// fill-grader.test.mjs — a fragment of the answer is not the answer
// ============================================================
// isCorrect() graded a fill-in-the-blank with
//
//     u === bl || (u.length > 2 && (u.includes(bl) || bl.includes(u)))
//
// so ANY three characters of the key scored full marks. Measured against the
// real corpus: 36 of 60 blanks accepted their own first three letters —
// "lat" for "lateral condyle", "vas" for "vastus lateralis", "gre" for
// "greater trochanter". In Thai it is worse than lenient: "ตับ" (liver) was
// accepted for "ตับอ่อน" (pancreas), a different organ.
//
// An exam-practice app that marks a wrong organ correct teaches the wrong
// thing and inflates the score it reports. Writing MORE than the key still
// passes, and dropping a qualifier still passes, because neither of those is
// a student who does not know the answer.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import { isCorrect } from '../../src/hooks/utils.js';

const fill = (...blanks) => ({ type: 'fill', blanks });

test('a three-letter fragment of the key is not correct', () => {
  assert.equal(isCorrect(fill('lateral condyle'), ['lat']), false);
  assert.equal(isCorrect(fill('vastus lateralis'), ['vas']), false);
  assert.equal(isCorrect(fill('greater trochanter'), ['gre']), false);
  assert.equal(isCorrect(fill('cohesive'), ['coh']), false);
});

test('a Thai fragment that names a different organ is not correct', () => {
  // ตับ is the liver; ตับอ่อน is the pancreas.
  assert.equal(isCorrect(fill('ตับอ่อน'), ['ตับ']), false);
  assert.equal(isCorrect(fill('ตับอ่อน'), ['ตับอ่อน']), true);
});

test('the exact answer is correct, whatever the case and spacing', () => {
  assert.equal(isCorrect(fill('Lateral Condyle'), ['  lateral condyle ']), true);
  assert.equal(isCorrect(fill('cohesive'), ['COHESIVE']), true);
});

test('writing more than the key still passes', () => {
  assert.equal(isCorrect(fill('lateral condyle'), ['the lateral condyle']), true);
  assert.equal(isCorrect(fill('cohesive'), ['cohesive bandage']), true);
});

test('dropping a qualifier still passes when most of the key is there', () => {
  assert.equal(
    isCorrect(fill('traumatic reticuloperitonitis'), ['reticuloperitonitis']),
    true,
    'a student who names the condition without its qualifier knows it',
  );
  assert.equal(
    isCorrect(fill('traumatic reticuloperitonitis'), ['traumatic']),
    false,
    'the qualifier alone is not the condition',
  );
});

test('every blank must be right, not just one', () => {
  assert.equal(isCorrect(fill('cohesive', 'cast padding'), ['cohesive', 'cast padding']), true);
  assert.equal(isCorrect(fill('cohesive', 'cast padding'), ['cohesive', 'cas']), false);
});

test('empty, missing and non-array answers are not correct', () => {
  assert.equal(isCorrect(fill('cohesive'), ['']), false);
  assert.equal(isCorrect(fill('cohesive'), [null]), false);
  assert.equal(isCorrect(fill('cohesive'), 'cohesive'), false);
  assert.equal(isCorrect(fill('cohesive'), null), false);
});

test('a one or two character key still matches exactly', () => {
  // The >= 3 floor must not make short keys unanswerable.
  assert.equal(isCorrect(fill('T3'), ['t3']), true);
  assert.equal(isCorrect(fill('pH'), ['ph']), true);
});
