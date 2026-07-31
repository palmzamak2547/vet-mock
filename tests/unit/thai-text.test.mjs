// truncateThai — the home-screen chips truncate Thai titles, and a plain
// .slice() cut them mid-cluster. The case that shipped is the first test.
import test from 'node:test';
import assert from 'node:assert/strict';
import { truncateThai } from '../../src/lib/thai-text.js';

test('does not orphan a leading vowel (the shipped bug)', () => {
  const s = 'ชำระค่าเล่าเรียน ผ่านแอป CUNEX';
  assert.equal(s.slice(0, 22), 'ชำระค่าเล่าเรียน ผ่านแ', 'guard: the naive cut really does end on แ');
  const out = truncateThai(s, 22);
  assert.equal(out, 'ชำระค่าเล่าเรียน ผ่าน…');
  assert.ok(!/[เ-ไ]…$/.test(out), 'must not end with a leading vowel before the ellipsis');
});

test('does not strip a combining mark off a base it keeps', () => {
  // The naive cut at 22 keeps ผ and drops its ู, changing the word.
  const s = 'ตรวจรายชื่อกับอาจารย์ผู้สอน ครั้งที่ 1';
  assert.equal(truncateThai(s, 22), 'ตรวจรายชื่อกับอาจารย์…');
});

test('leaves a string that already fits completely alone', () => {
  assert.equal(truncateThai('ระบาดวิทยา', 22), 'ระบาดวิทยา');
  assert.equal(truncateThai('ระบาดวิทยา', 10), 'ระบาดวิทยา');
});

test('trims the space the backtracking leaves behind', () => {
  const out = truncateThai('บริษัทนำ Stethoscope มาให้ลอง — 3M Littmann', 30);
  assert.equal(out, 'บริษัทนำ Stethoscope มาให้ลอง…');
  assert.ok(!/ …$/.test(out));
});

test('leaves Latin text to the plain cut', () => {
  assert.equal(truncateThai('Companion Animal Reproduction', 12), 'Companion An…');
});

test('degenerate input cannot produce an empty chip', () => {
  assert.equal(truncateThai('เเเเเเเเเเ', 5), 'เเเเเ…');
  assert.equal(truncateThai('', 10), '');
  assert.equal(truncateThai(null, 10), '');
  assert.equal(truncateThai('abc', 0), '');
});
