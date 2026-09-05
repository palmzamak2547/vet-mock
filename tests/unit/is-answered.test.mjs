// ============================================================
// "Answered" means answered, not "a value is present"
// ============================================================
// Clearing an answer leaves the key in place: emptying an essay stores '',
// and MatchDragDrop's ล้างทั้งหมด stores {}. ExamView counted with
// `answers[q.id] !== undefined`, which both pass, so the submit dialog
// reported cleared questions as answered — and since it derived "remaining"
// from that same count, it suppressed its own "you left N blank" warning at
// the moment it mattered most.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isAnswered } from '../../src/hooks/utils.js';

test('a cleared answer is not an answer', () => {
  assert.equal(isAnswered(''), false, 'an emptied essay counted as answered');
  assert.equal(isAnswered('   '), false, 'whitespace counted as answered');
  assert.equal(isAnswered({}), false, 'a cleared match question counted as answered');
  assert.equal(isAnswered(undefined), false);
  assert.equal(isAnswered(null), false);
});

test('a real answer counts, including the falsy ones', () => {
  // Option A is index 0 and False is `false`; a truthiness check would drop
  // both, which is the mirror-image bug of the one being fixed.
  assert.equal(isAnswered(0), true, 'choosing the first option was discarded');
  assert.equal(isAnswered(false), true, 'answering False was discarded');
  assert.equal(isAnswered(3), true);
  assert.equal(isAnswered(true), true);
  assert.equal(isAnswered('ตอบ'), true);
  assert.equal(isAnswered({ a: 'b' }), true);
});

test('ExamView asks the shared question everywhere', () => {
  const SRC = readFileSync(new URL('../../src/views/ExamView.jsx', import.meta.url), 'utf8');
  assert.ok(
    !SRC.includes('answers[q.id] !== undefined'),
    'a raw presence check is back in ExamView — it will count cleared answers again',
  );
  assert.ok(SRC.includes('isAnswered(answers[q.id])'), 'ExamView no longer uses the shared predicate');
});

test('the submit dialog and its warning are counted the same way', () => {
  // The bug was not just a wrong number: "remaining" is derived from
  // "answered", so one bad predicate silenced the warning too.
  const SRC = readFileSync(new URL('../../src/views/ExamView.jsx', import.meta.url), 'utf8');
  const dialog = SRC.slice(SRC.indexOf('vmx-submit-title') - 700, SRC.indexOf('vmx-submit-title') + 900);
  assert.ok(dialog.includes('isAnswered(answers[q.id])'), 'the submit dialog counts with a different rule');
  assert.ok(dialog.includes('questions.length - answered'), 'remaining is no longer derived from answered');
});

test('a cleared fill-in-the-blank is not an answer either', () => {
  // Fill stores one string per blank; typing into a blank and deleting it
  // leaves [''] behind. Arrays are objects, so the pair-map rule above
  // counted that as answered — the one shape this function did not cover.
  assert.equal(isAnswered(['']), false, 'an emptied blank counted as answered');
  assert.equal(isAnswered(['', '']), false, 'two emptied blanks counted as answered');
  assert.equal(isAnswered(['   ']), false, 'whitespace in a blank counted as answered');
  assert.equal(isAnswered(['gauze']), true);
  assert.equal(isAnswered(['', 'padding']), true, 'one filled blank is an answer in progress');
});
