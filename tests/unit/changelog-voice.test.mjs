// ============================================================
// changelog.js — what a student notices, not how it was fixed
// ============================================================
// The About page prints every change description in full. AGENTS.md Rule 2
// keeps the changelog to user-observable change, so a description says what
// the student will notice and stops there: no root cause ("สาเหตุคือ…"), and
// no talk of which model read a page or how much quota it spent.
//
// The audit that found this measured the releases from 5.124.0 on; those and
// every later release are held to it. Releases before that are history and
// are left as they shipped. "โมเดล 3 มิติ" is a thing students open, so it is
// allowed.
//
// Length: a title plus at most two sentences. Releases after 5.128.0 keep each
// description to 300 characters; 5.128.0 and older were written before the
// limit and are not rewritten to meet it.

import test from 'node:test';
import assert from 'node:assert/strict';

const { CHANGELOG } = await import('../../src/data/changelog.js');

const parse = (v) => String(v).split('.').map((n) => Number.parseInt(n, 10) || 0);
const cmp = (a, b) => {
  const x = parse(a);
  const y = parse(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] || 0) - (y[i] || 0);
    if (d) return d;
  }
  return 0;
};

const VOICE_FROM = '5.124.0';
const LENGTH_AFTER = '5.128.0';
const MAX_DESC = 300;
const MECHANISM = /สาเหตุคือ|โควตา|โมเดล(?!\s*3\s*มิติ)/;

const fieldsOf = (release) => [
  ['headline', release.headline],
  ...(release.changes || []).flatMap((c, i) => [
    [`changes[${i}].title`, c.title],
    [`changes[${i}].desc`, c.desc],
  ]),
];

const mechanismHits = (releases) => {
  const hits = [];
  for (const r of releases) {
    if (cmp(r.version, VOICE_FROM) < 0) continue;
    for (const [field, text] of fieldsOf(r)) {
      const m = typeof text === 'string' && text.match(MECHANISM);
      if (m) hits.push(`${r.version} ${field}: "${m[0]}"`);
    }
  }
  return hits;
};

const overLength = (releases) => {
  const hits = [];
  for (const r of releases) {
    if (cmp(r.version, LENGTH_AFTER) <= 0) continue;
    (r.changes || []).forEach((c, i) => {
      const n = (c.desc || '').length;
      if (n > MAX_DESC) hits.push(`${r.version} changes[${i}].desc is ${n} characters`);
    });
  }
  return hits;
};

test('no release from 5.124.0 on narrates a root cause, a model or a quota', () => {
  assert.deepEqual(
    mechanismHits(CHANGELOG),
    [],
    'say what the student notices; the mechanism belongs in the commit message',
  );
});

test('the voice check catches each phrase, and lets a 3D model through', () => {
  const at = (desc) => [{ version: '9.0.0', headline: 'x', changes: [{ title: 'y', desc }] }];
  assert.equal(mechanismHits(at('สาเหตุคือค่าว่าง')).length, 1);
  assert.equal(mechanismHits(at('ใช้โควตาหมด')).length, 1);
  assert.equal(mechanismHits(at('ส่งต่อให้โมเดลสำรอง')).length, 1);
  assert.deepEqual(mechanismHits(at('เปิดโมเดล 3 มิติของกะโหลกม้า')), []);
  assert.deepEqual(mechanismHits([{ version: '5.80.0', headline: 'โมเดลม้า', changes: [] }]), []);
});

test('every release after 5.128.0 keeps each description to 300 characters', () => {
  assert.deepEqual(overLength(CHANGELOG), [], 'a title plus at most two sentences on what the student notices');
});

test('the length check applies after 5.128.0 and not before', () => {
  const long = 'ก'.repeat(MAX_DESC + 1);
  const at = (version) => [{ version, headline: 'x', changes: [{ title: 'y', desc: long }] }];
  assert.equal(overLength(at('5.128.1')).length, 1);
  assert.equal(overLength(at('5.129.0')).length, 1);
  assert.deepEqual(overLength(at('5.128.0')), []);
  assert.deepEqual(overLength(at('5.126.4')), []);
});
