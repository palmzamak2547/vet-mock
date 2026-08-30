// ============================================================
// Pressing "1" must record the option the student is looking at
// ============================================================
// Answers are stored by the option's SOURCE index; the rendered order is a
// per-session permutation. The click path mapped through displayToOriginal.
// The documented 1-4 shortcut did not — it passed the digit straight in, so
// it recorded whichever option happened to be first in the SOURCE array and
// then highlighted a different row than the one pressed. No question data
// sets noShuffle, so this reached every multiple-choice question.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getShuffledOptions } from '../../src/lib/option-shuffle.js';

const q = (id, n) => ({ id, options: Array.from({ length: n }, (_, i) => `option-${i}`) });

// What the fixed handler does.
const press = (question, digit) => {
  const { displayToOriginal } = getShuffledOptions(question);
  const d = digit - 1;
  return d < displayToOriginal.length ? displayToOriginal[d] : undefined;
};

test('the digit records the option at that visible row, for every question', () => {
  let permuted = 0;
  for (let id = 1; id <= 400; id++) {
    const question = q(id, 4);
    const { displayOptions, displayToOriginal } = getShuffledOptions(question);
    if (displayToOriginal.some((orig, disp) => orig !== disp)) permuted++;
    for (let digit = 1; digit <= 4; digit++) {
      const stored = press(question, digit);
      assert.equal(
        question.options[stored], displayOptions[digit - 1],
        `q${id}: pressing ${digit} stored "${question.options[stored]}" but row ${digit} shows "${displayOptions[digit - 1]}"`,
      );
    }
  }
  // If nothing were permuted the assertion above would pass trivially.
  assert.ok(permuted > 300, `only ${permuted}/400 questions were permuted — the test proves nothing`);
});

test('the old behaviour really was wrong, not merely different', () => {
  // Count questions where the raw digit picks a different option than the row.
  let wrong = 0;
  for (let id = 1; id <= 400; id++) {
    const question = q(id, 4);
    const { displayOptions } = getShuffledOptions(question);
    for (let digit = 1; digit <= 4; digit++) {
      if (question.options[digit - 1] !== displayOptions[digit - 1]) wrong++;
    }
  }
  assert.ok(wrong > 1000, `raw-digit mismatches were only ${wrong}; expected the bug to be pervasive`);
});

test('a row that does not exist records nothing', () => {
  assert.equal(press(q(7, 3), 4), undefined, 'pressing 4 on a 3-option question still stored an index');
  assert.equal(press(q(7, 2), 3), undefined);
});

test('a single option is never permuted', () => {
  const { displayToOriginal } = getShuffledOptions(q(9, 1));
  assert.deepEqual(displayToOriginal, [0]);
});

test('display and original maps are exact inverses', () => {
  for (let id = 1; id <= 50; id++) {
    const { displayToOriginal, originalToDisplay } = getShuffledOptions(q(id, 5));
    displayToOriginal.forEach((orig, disp) => assert.equal(originalToDisplay[orig], disp));
  }
});

test('the exam keyboard handler goes through the map', () => {
  const APP = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
  assert.match(
    APP, /getShuffledOptions\(q\)[\s\S]{0,400}?answerCurrent\(displayToOriginal\[displayIdx\]\)/,
    'App.jsx no longer maps the digit through the permutation',
  );
  assert.ok(
    !/answerCurrent\(parseInt\(e\.key\) - 1\)/.test(APP),
    'the raw-digit call is back',
  );
});
