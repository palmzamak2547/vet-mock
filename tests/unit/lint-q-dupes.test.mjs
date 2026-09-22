// ============================================================
// lint:dupes sees near-duplicates, and fails on two copies that disagree
// ============================================================
// The dupe key was the first 80 normalised characters, so one changed word
// kept two copies apart. Milk hygiene carried the same true/false sentence
// twice, "วิธีการตรวจสุขลักษณะอนามัยของนมพาสเจอร์ไรส์แบบรวดเร็ว ได้แก่
// clot-on-boiling test และ alcohol test", keyed false in one bank and true in
// the other, and the lint reported 0 duplicate groups.
//
// The near-duplicate pass compares stems within a subject by character-bigram
// Dice, then checks the keys: two copies that key the same answer are a
// duplicate, two true/false copies that key opposite answers are a
// contradiction. Known duplicates awaiting a merge are listed and may only
// shrink; deliberate pairs are allow-listed with a reason.
// ============================================================

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  findNearDuplicates,
  checkNearDuplicates,
  ALLOWED_NEAR_DUPLICATES,
  KNOWN_NEAR_DUPLICATES,
} from '../../scripts/lint-q-dupes.mjs';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

let nextId = 992000;
const tf = (q, answer, extra = {}) => ({ id: nextId++, subject: 'fixture', topic: 't', type: 'tf', q, answer, explain: 'x', ...extra });
const mcq = (q, options, answer, extra = {}) => ({ id: nextId++, subject: 'fixture', topic: 't', type: 'mcq', q, options, answer, explain: 'x', ...extra });

const SENTENCE = 'วิธีการตรวจสุขลักษณะอนามัยและความสดของน้ำนมพาสเจอร์ไรส์แบบรวดเร็ว ได้แก่ clot-on-boiling test และ alcohol test';
const REWORDED = 'วิธีการตรวจสุขลักษณะอนามัยของนมพาสเจอร์ไรส์แบบรวดเร็วได้แก่ Clot-on boiling test และ Alcohol test';

test('two true/false copies of one sentence with opposite keys are a contradiction', () => {
  const found = findNearDuplicates([tf(SENTENCE, false), tf(REWORDED, true)]);
  assert.equal(found.length, 1);
  assert.equal(found[0].kind, 'contradiction');

  const same = findNearDuplicates([tf(SENTENCE, false), tf(REWORDED, false)]);
  assert.equal(same[0]?.kind, 'duplicate');
});

test('a stem that adds a negation, or quotes different numbers, is a different question', () => {
  assert.deepEqual(findNearDuplicates([
    mcq('ขนาดพื้นที่ของสถานพยาบาลสัตว์ประเภทที่มีที่พักสัตว์ป่วย ต้องมีขนาดพื้นที่ไม่น้อยกว่าเท่าใด', ['60 ตร.ม.', '70 ตร.ม.', '80 ตร.ม.', '90 ตร.ม.'], 3),
    mcq('ขนาดพื้นที่ของสถานพยาบาลสัตว์ประเภทที่ไม่มีที่พักสัตว์ป่วย ต้องมีขนาดพื้นที่ไม่น้อยกว่าเท่าใด', ['20 ตร.ม.', '30 ตร.ม.', '40 ตร.ม.', '50 ตร.ม.'], 0),
  ]), []);
  assert.deepEqual(findNearDuplicates([
    mcq('OSCE station: โคนม DIM 209 วัน ไม่พบประวัติเป็นสัด ควรเลือก postpartum program ใด', ['CUI', 'COA', 'PD', 'skip'], 1),
    mcq('OSCE station: โคนม DIM 100 วัน เป็นสัด 21 วันก่อน ควรเลือก postpartum program ใด', ['CUI', 'COA', 'PD', 'skip'], 1),
  ]), []);
});

test('same stem, and each key is the other copy\'s key, is a duplicate even with new distractors', () => {
  const found = findNearDuplicates([
    mcq('เชื้อใดถือเป็นความเสี่ยงต่อการติดเชื้อในทารกแรกเกิดจากการบริโภคน้ำนม', ['Campylobacter coli', 'Bacillus cereus', 'Listeria monocytogenes', 'Pseudomonas fluorescens'], 2),
    mcq('เชื้อใดที่ถือเป็นความเสี่ยงต่อการติดเชื้อในทารกแรกเกิดผ่านการบริโภคน้ำนม', ['Salmonella spp.', 'Staphylococcus aureus', 'Listeria monocytogenes', 'Bacillus cereus'], 2),
  ]);
  assert.equal(found.length, 1);
  assert.equal(found[0].kind, 'duplicate');
});

test('when one copy\'s key is a distractor of the other, the two ask different things', () => {
  const options = ['7 บวกลบ 1 องศาเซลเซียส นาน 10 วัน', '20 ถึง 25 องศาเซลเซียส นาน 5 ถึง 7 วัน', '32 บวกลบ 1 องศาเซลเซียส นาน 48 ชั่วโมง', '55 บวกลบ 1 องศาเซลเซียส นาน 48 ชั่วโมง'];
  assert.deepEqual(findNearDuplicates([
    mcq('สภาวะใดใช้เพาะเลี้ยงแบคทีเรียกลุ่ม thermophilic', options, 3),
    mcq('สภาวะใดใช้เพาะเลี้ยงแบคทีเรียกลุ่ม thermoduric mesophiles', options, 2),
  ]), []);
});

test('different subjects, different passages, and rows held for review are not compared', () => {
  assert.deepEqual(findNearDuplicates([tf(SENTENCE, false), tf(REWORDED, true, { subject: 'other' })]), []);
  assert.deepEqual(findNearDuplicates([
    mcq('What was the purpose of the study?', ['a', 'b', 'c', 'd'], 0, { passage: 'Bats roost in caves and carry lyssaviruses across regions.' }),
    mcq('What was the purpose of the study?', ['a', 'b', 'c', 'd'], 0, { passage: 'Atopic dermatitis in dogs responds to oclacitinib therapy.' }),
  ]), []);
  assert.deepEqual(findNearDuplicates([tf(SENTENCE, false, { flag: { severity: 'unclear', note: 'held' } }), tf(REWORDED, true)]), []);
});

test('an allow-listed pair passes, an unlisted duplicate fails, and a resolved known entry is reported', () => {
  const a = tf(SENTENCE, false);
  const b = tf(REWORDED, false);
  const pair = [`${a.subject}:${a.id}`, `${b.subject}:${b.id}`];
  assert.equal(checkNearDuplicates([a, b], { allowed: [], known: [] }).duplicates.length, 1);
  assert.equal(checkNearDuplicates([a, b], { allowed: [{ pair, reason: 'fixture' }], known: [] }).duplicates.length, 0);
  assert.equal(checkNearDuplicates([a, b], { allowed: [], known: [{ pair, keep: pair[0] }] }).duplicates.length, 0);
  const stale = checkNearDuplicates([a], { allowed: [], known: [{ pair, keep: pair[0] }] }).stale;
  assert.equal(stale.length, 1, 'a known duplicate that no longer exists must be removed from the list');
});

test('every allow-listed pair says why', () => {
  for (const entry of ALLOWED_NEAR_DUPLICATES) {
    assert.equal(entry.pair.length, 2);
    assert.ok(String(entry.reason || '').trim().length > 20, `${entry.pair.join(' / ')} has no reason`);
  }
  for (const entry of KNOWN_NEAR_DUPLICATES) {
    assert.ok(entry.pair.includes(entry.keep), `${entry.pair.join(' / ')} must name which copy to keep`);
  }
});

test('the real corpus has no contradicting copies and no unlisted near-duplicates', async () => {
  const questions = [];
  for (const entry of BANK_REGISTRY) questions.push(...(await entry.load()));
  const result = checkNearDuplicates(questions);
  assert.deepEqual(result.contradictions.map((p) => `${p.a} / ${p.b}`), []);
  assert.deepEqual(result.duplicates.map((p) => `${p.a} / ${p.b}`), []);
  assert.deepEqual(result.stale.map((p) => p.pair.join(' / ')), []);
});
