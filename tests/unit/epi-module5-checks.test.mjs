// ============================================================
// epi-module5-checks.test.mjs — the bench checks cannot be won by shape
// ============================================================
// BenchView renders each check's options in source order, lettered a-d,
// with no shuffle, and "ตอบถูกแล้ว N จาก 22 ข้อ" counts the answers. When
// the checks shipped, always picking the longest option scored 19 of 22,
// always picking b scored 15, and a was never the key (B65) — the tell the
// question standard forbids in the bank (lint:questions, LENGTH_BIAS_RATIO
// 1.6). The rewrite keeps each key's slide answer and moves the tells out.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

import { ALL_CHECKS } from '../../src/data/epi-module5.js';

const len = (s) => [...String(s)].length;

test('every check is a well-formed four-option question', () => {
  assert.equal(ALL_CHECKS.length, 22);
  assert.equal(new Set(ALL_CHECKS.map((c) => c.id)).size, 22, 'ids stay unique: progress is stored by id');
  for (const c of ALL_CHECKS) {
    assert.equal(c.options.length, 4, c.id);
    assert.ok(Number.isInteger(c.answer) && c.answer >= 0 && c.answer < 4, c.id);
    assert.equal(new Set(c.options).size, 4, `${c.id}: options are distinct`);
  }
});

test('the key is in every position, and no position wins on its own', () => {
  const byPos = [0, 0, 0, 0];
  for (const c of ALL_CHECKS) byPos[c.answer] += 1;
  for (let p = 0; p < 4; p++) {
    assert.ok(byPos[p] >= 3, `option ${'abcd'[p]} is the key ${byPos[p]} times`);
    assert.ok(byPos[p] <= 8, `always picking ${'abcd'[p]} scores ${byPos[p]} of 22`);
  }
});

test('picking the longest option is no better than a guess', () => {
  let strictlyLongest = 0;
  for (const c of ALL_CHECKS) {
    const L = c.options.map(len);
    const max = Math.max(...L);
    if (L[c.answer] === max && L.filter((n) => n === max).length === 1) strictlyLongest += 1;
    const others = L.filter((_, i) => i !== c.answer);
    const mean = others.reduce((a, b) => a + b, 0) / others.length;
    assert.ok(L[c.answer] / mean <= 1.5, `${c.id}: key is ${(L[c.answer] / mean).toFixed(2)}x the mean distractor`);
  }
  // Chance is 22/4 = 5.5.
  assert.ok(strictlyLongest <= 6, `the longest option is the key in ${strictlyLongest} of 22`);
});
