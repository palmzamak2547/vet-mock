// Four errors in a senior compilation were caught during the equine ingest and
// recorded only as prose in AGENTS.md: a breeding season the writer contradicts
// on his own next page, a "3-way" Foley the recording calls two-way,
// "เข็มเล็กมาก (12G)" where 12G is large bore, and misoprostol dosed in
// milligrams. Nothing stopped a later question from teaching any of them.
// src/data/source-conflicts.js now holds them as data, and
// scripts/report-source-conflicts.mjs flags a question whose key or
// explanation states the rejected side.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SOURCE_CONFLICTS } from '../../src/data/source-conflicts.js';
import { conflictHits, keyedText } from '../../scripts/report-source-conflicts.mjs';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { QB, loadQB } from '../../src/data/questions.js';

const byId = (id) => SOURCE_CONFLICTS.find((c) => c.id === id);
const mcq = (subject, options, answer, explain = '') => ({ id: 1, subject, type: 'mcq', q: 'x', options, answer, explain });

test('the four compilation errors exist as data, each with both sides and a verdict', () => {
  assert.equal(SOURCE_CONFLICTS.length, 4);
  const ids = new Set();
  const subjects = new Set(SUBJECTS.map((s) => s.id));
  for (const c of SOURCE_CONFLICTS) {
    assert.ok(!ids.has(c.id), `${c.id} is unique`);
    ids.add(c.id);
    assert.ok(subjects.has(c.subject), `${c.id}: ${c.subject} is a subject`);
    for (const k of ['claim', 'verdict', 'evidence']) assert.ok(typeof c[k] === 'string' && c[k].length > 10, `${c.id}: ${k}`);
    for (const side of [c.sourceA, c.sourceB]) assert.ok(side?.ref && side?.says, `${c.id}: each source names where and what`);
    assert.ok(Array.isArray(c.rejected) && c.rejected.length, `${c.id}: says what to look for`);
    for (const group of c.rejected) assert.ok(Array.isArray(group) && group.every((re) => re instanceof RegExp));
    assert.ok(!/·/.test(JSON.stringify(c)));
  }
});

test('a question keyed to "12G = เข็มเล็ก" is flagged', () => {
  const q = mcq('equine-repro', ['ใช้เข็มขนาดใหญ่ 12G', 'ใช้เข็มเล็กมาก (12G) เพื่อไม่ให้ follicle ช้ำ'], 1);
  const hits = conflictHits([q], SOURCE_CONFLICTS);
  assert.deepEqual(hits.map((h) => h.conflict), ['eqrepro-opu-needle-gauge']);
  assert.deepEqual(conflictHits([{ ...q, answer: 0 }], SOURCE_CONFLICTS), [], 'keyed to the other option, it is not');
});

test('each recorded wrong side is caught, and only in its own subject', () => {
  const foley = mcq('equine-repro', ['Foley catheter ต่อ 3-way แล้วหมุนให้น้ำไหลลงถ้วยกรอง'], 0);
  const miso = mcq('equine-repro', ['x'], 0, 'ละลาย Cytotec 1 เม็ด 300 mg ในน้ำเกลือแล้ว infuse เข้ามดลูก');
  const season = { id: 2, subject: 'equine-repro', type: 'tf', q: 'breeding season ของม้าคือ ก.พ. - เม.ย.', answer: true, explain: '' };
  assert.deepEqual(conflictHits([foley, miso, season], SOURCE_CONFLICTS).map((h) => `${h.conflict} ${h.id}`).sort(),
    ['eqrepro-breeding-season-months 2', 'eqrepro-foley-flush-way 1', 'eqrepro-misoprostol-dose-unit 1']);
  assert.deepEqual(conflictHits([{ ...season, answer: false }], SOURCE_CONFLICTS), [], 'a false statement teaches the right side');
  assert.deepEqual(conflictHits([{ ...foley, subject: 'com1' }], SOURCE_CONFLICTS), [], 'another subject is not this conflict');
  assert.ok(byId('eqrepro-foley-flush-way').sourceB.ref.includes('FBNU52oH1z8 [71:29]'));
});

test('the text read is what the question teaches: the key, the explanation, a model answer', () => {
  assert.equal(keyedText(mcq('s', ['a', 'b'], 1, 'e')), 'b\ne');
  assert.equal(keyedText({ type: 'tf', q: 'stem', answer: true, explain: 'e' }), 'stem\ne');
  assert.equal(keyedText({ type: 'tf', q: 'stem', answer: false, explain: 'e' }), 'e');
  assert.equal(keyedText({ type: 'short', q: 'stem', model_answer: 'm', explain: 'e' }), 'm\ne');
  assert.equal(keyedText({ type: 'match', pairs: [{ left: 'l', right: 'r' }], explain: 'e' }), 'l r\ne');
});

test('the shipped bank states none of the rejected sides', async () => {
  await loadQB();
  const hits = conflictHits(QB, SOURCE_CONFLICTS);
  assert.deepEqual(hits.map((h) => `${h.conflict} ${h.subject}#${h.id}`), []);
});
