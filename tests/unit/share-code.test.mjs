// The /s/ code (src/lib/share-link.js): a set packed into a short link. It must
// give back exactly the set it was made from, keep reading the old ?qset= form,
// and refuse anything it did not write, because a code arrives from anyone.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  encodeShareCode, decodeShareCode, encodeQuizSet, decodeQuizSet,
  SHARE_SUBJECTS, SHARE_CODE_MAX_ITEMS, SHARE_CODE_MAX_CHARS,
} from '../../src/lib/share-link.js';

const set = (ids, subject = 'epidemiology') => ids.map((id) => ({ subject, id }));
const seq = (start, n) => Array.from({ length: n }, (_, i) => start + i);
const same = (a, b) => assert.deepEqual(a, b.map(({ subject, id }) => ({ subject, id })));

test('a set comes back exactly, in its order, for 1, 10, 50 and 200 questions', () => {
  for (const n of [1, 10, 50, 200]) {
    const s = set(seq(100001, n));
    same(decodeShareCode(encodeShareCode(s)), s);
  }
});

test('scattered ids, ids going down, and sets mixing subjects come back exactly', () => {
  const scattered = set([214705, 100001, 107019, 101500, 200100, 103333, 8031, 100500, 150000, 120000]);
  same(decodeShareCode(encodeShareCode(scattered)), scattered);
  const mixed = Array.from({ length: 200 }, (_, i) => ({ subject: SHARE_SUBJECTS[i % SHARE_SUBJECTS.length], id: 70001 + ((i * 104729) % 624000) }));
  same(decodeShareCode(encodeShareCode(mixed)), mixed);
});

test('the lengths stay short: measured for the share design', () => {
  assert.equal(encodeShareCode(set([107010])).length, 8);
  assert.equal(encodeShareCode(set(seq(107010, 10))).length, 20);
  assert.ok(encodeShareCode(set(seq(100001, 50))).length <= 80);
  const mixed = Array.from({ length: 200 }, (_, i) => ({ subject: SHARE_SUBJECTS[i % SHARE_SUBJECTS.length], id: 600000 + i * 401 }));
  assert.ok(encodeShareCode(mixed).length <= SHARE_CODE_MAX_CHARS);
});

test('what cannot travel stays out: questions a student wrote, repeats, unknown subjects', () => {
  const code = encodeShareCode([
    { subject: 'epidemiology', id: 65000 },
    { subject: 'epidemiology', id: 107010 },
    { subject: 'epidemiology', id: 107010 },
    { subject: 'no-such-subject', id: 5 },
  ]);
  same(decodeShareCode(code), set([107010]));
  assert.equal(encodeShareCode([{ subject: 'epidemiology', id: 65000 }]), '');
  assert.equal(encodeShareCode([]), '');
  assert.equal(encodeShareCode(set(seq(100001, 250))).length, encodeShareCode(set(seq(100001, SHARE_CODE_MAX_ITEMS))).length);
});

test('the subject table only grows: these indexes are links people already hold', () => {
  assert.equal(new Set(SHARE_SUBJECTS).size, SHARE_SUBJECTS.length);
  assert.ok(Object.isFrozen(SHARE_SUBJECTS));
  assert.equal(SHARE_SUBJECTS[0], 'aquatic-clinic');
  assert.equal(SHARE_SUBJECTS[12], 'epidemiology');
  assert.equal(SHARE_SUBJECTS[42], 'zoonoses');
});

test('old ?qset= links still read', () => {
  const s = set(seq(107010, 10));
  same(decodeQuizSet(encodeQuizSet(s)), s);
  // A link made before the short form, written out in full.
  const old = Buffer.from(JSON.stringify([{ s: 'epidemiology', i: 107010 }, { s: 'zoonoses', i: 8031 }])).toString('base64url');
  same(decodeQuizSet(old), [{ subject: 'epidemiology', id: 107010 }, { subject: 'zoonoses', id: 8031 }]);
});

const good = encodeShareCode(set(seq(107010, 10)));
const bytesOf = (code) => [...Buffer.from(code, 'base64url')];
const codeOf = (bytes) => Buffer.from(bytes).toString('base64url');

test('hostile codes are refused', () => {
  const hostile = {
    empty: '',
    tooLong: 'A'.repeat(SHARE_CODE_MAX_CHARS + 4),
    badCharacters: `${good.slice(0, 10)}+/=`,
    percent: '%3Cscript%3E',
    html: '<script>alert(1)</script>',
    space: `${good} `,
    lengthOneMod4: `${good}A`,
    prototypeNames: '__proto__',
    constructor: 'constructor',
    hasOwnProperty: 'hasOwnProperty',
  };
  for (const [name, code] of Object.entries(hostile)) assert.equal(decodeShareCode(code), null, name);
  for (const v of [null, undefined, 42, {}, [good]]) assert.equal(decodeShareCode(v), null, String(v));
  // Five bytes leave two unused bits in the last character: set, they name the same bytes, and are refused.
  const five = codeOf([1, 1, 12, 0x82, 0x01]);
  assert.ok(decodeShareCode(five), 'the canonical form opens');
  const tail = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const bumped = five.slice(0, -1) + tail[tail.indexOf(five.at(-1)) + 1];
  assert.equal(decodeShareCode(bumped), null, 'non-canonical tail');
});

test('broken bytes are refused: version, flags, counts, cut-off and overlong varints, trailing bytes', () => {
  const b = bytesOf(good); // [1, 10, 12, ...ids]
  const cases = {
    version2: [2, ...b.slice(1)],
    picksFlag: [b[0] | 0x20, ...b.slice(1)],
    highBits: [b[0] | 0x40, ...b.slice(1)],
    countZero: [1, 0, 12],
    countTooBig: [1, 0xc9, 0x01, 12, ...b.slice(3)],
    countShort: [1, 11, ...b.slice(2)],
    subjectOutOfTable: [1, 1, SHARE_SUBJECTS.length, 2],
    cutOffVarint: [1, 1, 12, 0x80],
    overlongVarint: [1, 1, 12, 0x82, 0x00],
    sixByteVarint: [1, 1, 12, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01],
    trailingByte: [...b, 0],
    idZero: [1, 1, 12, 0],
    idNegative: [1, 1, 12, 3],
    customId: [1, 1, 12, ...(() => { const o = []; let v = 65000 * 2; while (v >= 0x80) { o.push((v & 0x7f) | 0x80); v >>>= 7; } o.push(v); return o; })()],
    repeat: [1, 2, 12, 2, 0],
    mixedFlagOneSubject: [0x11, 2, 12, 2, 12, 2],
  };
  for (const [name, bytes] of Object.entries(cases)) assert.equal(decodeShareCode(codeOf(bytes)), null, name);
});

test('the bank check runs on every question', () => {
  const asked = [];
  const has = (subject, id) => { asked.push(`${subject}:${id}`); return id !== 107015; };
  assert.equal(decodeShareCode(good, { has }), null);
  assert.ok(asked.includes('epidemiology:107015'));
  assert.equal(decodeShareCode(good, { has: () => true }).length, 10);
});
