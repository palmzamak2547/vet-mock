// scripts/regen-exam-recurrence.mjs builds src/data/exam-recurrence.generated.js:
// which topics and items the papers of more than one cohort examined.
// These tests pin the three things that number rests on: which questions
// count as evidence, which cohort each one names, and when two records are
// the same item. The pairs in tests/fixtures/exam-recurrence-pairs.json were
// read by hand on 2026-10-28; a rule change that joins a `distinct` pair or
// splits a `same` pair has to answer to them.
import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildExamRecurrence,
  compareKeys,
  filedCohorts,
  fingerprint,
  isPaperEvidence,
  renderModule,
  sameItem,
  sameItemClusters,
  sittingOf,
} from '../../scripts/regen-exam-recurrence.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const pairs = JSON.parse(fs.readFileSync(path.join(repo, 'tests/fixtures/exam-recurrence-pairs.json'), 'utf8'));
const everyone = () => true;

test('evidence is a filed paper, or a past paper by the predicate when nothing is filed', () => {
  // Filed as a paper but tagged อิงแนวข้อสอบ, so Panic band 1: still a sat paper.
  assert.equal(isPaperEvidence({ examOrigin: 'Zoonoses (Vet 85) recalled matching section', tags: ['อิงแนวข้อสอบ'] }), true);
  assert.equal(isPaperEvidence({ examOrigin: 'อิงแนวข้อสอบ', sourceType: 'exam-aligned' }), false);
  assert.equal(isPaperEvidence({ examOrigin: 'Avian Medicine final study notes (Vet 85 compilation)', sourceType: 'student-compilation' }), false);
  assert.equal(isPaperEvidence({ examOrigin: 'Mock 1 Part I' }), false);
  assert.equal(isPaperEvidence({ sourceType: 'past-paper', source: 'Zoonosis Mid 86.pdf หน้า 2 (บันทึกหลังสอบของรุ่นพี่ Vet 85)' }), true);
  assert.equal(isPaperEvidence({ sourceType: 'lecture-derived', source: 'Zoonosis Mid 86.pdf หน้า 2' }), false);
});

test('the sitting comes from examOrigin, then from a post-exam record in source', () => {
  assert.deepEqual(sittingOf({ examOrigin: 'Equine Med midterm recall (Vet 85)', source: 'Equine Med Mid 86.pdf p.4 (รวบรวมโดยรุ่นพี่ Vet 85)' }), { cohorts: [85], paper: 'midterm' });
  assert.deepEqual(sittingOf({ sourceType: 'past-paper', source: 'Zoonosis Mid 86.pdf หน้า 2 (บันทึกหลังสอบของรุ่นพี่ Vet 85)' }), { cohorts: [85], paper: null });
  assert.deepEqual(sittingOf({ examOrigin: 'COM III Final 86', source: 'DC3final 86' }), { cohorts: [], paper: 'final' });
  assert.deepEqual(sittingOf({ examOrigin: 'Aj. Ekasingh Vet 84-86 Final' }), { cohorts: [84, 85, 86], paper: 'final' });
  // A compilation's author is not a sitting, in either field.
  assert.deepEqual(sittingOf({ sourceType: 'past-paper', source: 'Aqua Med Mid 86 (รวบรวมโดยรุ่นพี่ Vet 85)' }), { cohorts: [], paper: null });
});

test('a cohort filed for a label-only origin counts, unless it is the label read back', () => {
  const filed = (cohort, kind = 'paper') => () => ({ kind, cohort });
  // Today's filing for the TJ86 files: 86, the label itself. Never a sitting.
  assert.deepEqual(filedCohorts('COM I Final 86', filed(86)), []);
  assert.deepEqual(filedCohorts('TJ86', filed(86)), []);
  // A correction from the block that names its cohort comes through.
  assert.deepEqual(filedCohorts('COM I Final 86', filed(85)), [85]);
  assert.deepEqual(filedCohorts('Swine Herd Mid TJ86 อ.อจิมา', filed([84, 85, 86])), [84, 85]);
  assert.deepEqual(filedCohorts('Swine Repro Mid 86', filed(null)), []);
  assert.deepEqual(filedCohorts('Poultry Final 2019', filed(82)), [82], 'a year is not a label');
  // Where the string names a designator, the parser's reading stands.
  assert.deepEqual(filedCohorts('Avian Medicine final recall (Vet 85 compilation)', filed(85)), []);
  assert.deepEqual(filedCohorts('อิงแนวข้อสอบ', filed(85, 'aligned')), []);
  // The row's own post-exam record outranks a cohort filed for the whole file.
  const row = { examOrigin: 'TJ86', source: 'Zoonosis Mid 86.pdf หน้า 2 (บันทึกหลังสอบของรุ่นพี่ Vet 85)' };
  assert.deepEqual(sittingOf(row, { filing: filed(84) }), { cohorts: [85], paper: null });
  assert.deepEqual(sittingOf({ examOrigin: 'Food Safety Final 86' }, { filing: filed(86) }), { cohorts: [], paper: 'final' });
  assert.deepEqual(sittingOf({ examOrigin: 'Food Safety Final 86' }, { filing: filed(85) }), { cohorts: [85], paper: 'final' });
});

for (const { why, pair: [a, b] } of pairs.same) {
  test(`same item: ${why}`, () => {
    assert.ok(sameItem(fingerprint(a), fingerprint(b)), `${a.subject}:${a.id} ~ ${b.subject}:${b.id}`);
    assert.ok(sameItem(fingerprint(b), fingerprint(a)), 'the rule is symmetric');
  });
}

for (const { why, pair: [a, b] } of pairs.distinct) {
  test(`two items, never one: ${why}`, () => {
    assert.equal(sameItem(fingerprint(a), fingerprint(b)), null, `${a.subject}:${a.id} ~ ${b.subject}:${b.id}`);
    assert.equal(sameItem(fingerprint(b), fingerprint(a)), null, 'the rule is symmetric');
  });
}

test('a chain of near matches does not pull in an item unlike its first link', () => {
  // a~b and b~c pass (stem Jaccard 0.28 with the same key); a and c share nothing.
  const item = (id, q) => ({ subject: 'zoonoses', id, type: 'mcq', q, options: ['lymph node', 'spleen'], answer: 0 });
  const a = item(1, 'aaa bbb ccc ddd eee fff');
  const b = item(2, 'ddd eee fff ggg hhh iii');
  const c = item(3, 'ggg hhh iii jjj kkk lll');
  assert.ok(sameItem(fingerprint(a), fingerprint(b)));
  assert.ok(sameItem(fingerprint(b), fingerprint(c)));
  assert.equal(sameItem(fingerprint(a), fingerprint(c)), null);
  const clusters = sameItemClusters([c, b, a]);
  assert.deepEqual(clusters, [['zoonoses:1', 'zoonoses:2']]);
});

test('question keys sort by subject, then numerically by id', () => {
  const keys = ['zoonoses:10', 'aquatic-clinic:202197', 'zoonoses:9', 'zoonoses:x2', 'zoonoses:x10'];
  assert.deepEqual([...keys].sort(compareKeys), ['aquatic-clinic:202197', 'zoonoses:9', 'zoonoses:10', 'zoonoses:x10', 'zoonoses:x2']);
});

function fixtureBank() {
  const z = (id, extra) => ({ subject: 'zoonoses', id, type: 'mcq', q: `item ${id}`, options: ['a', 'b'], answer: 0, ...extra });
  return [
    z(1, { topic: 't1', examOrigin: 'Zoonoses midterm recall (Vet 85)' }),
    z(2, { topic: 't1', examOrigin: 'Vet 80 past paper · Vet 83 update commentary' }),
    z(3, { topic: 't1', examOrigin: 'TJ86' }),
    z(4, { topic: 't2', examOrigin: 'อิงแนวข้อสอบ', sourceType: 'exam-aligned', tags: ['อิงแนวข้อสอบ'] }),
    z(5, { topic: 't2', sourceType: 'past-paper', source: 'Zoonosis Mid 86.pdf หน้า 2 (บันทึกหลังสอบของรุ่นพี่ Vet 85)' }),
    z(6, { topic: 't2', examOrigin: 'Aquatic Med 3107520 คลังข้อสอบพาร์ทหน่วยงานและองค์กร (Vet 84 และ Vet 85)' }),
    z(7, { topic: 't2', examOrigin: 'Zoonoses midterm recall (Vet 85)' }),
    z(8, { examOrigin: 'Zoonoses (Vet 85) recalled short-answer section' }),
  ];
}
const notSeven = (q) => q.id !== 7;

test('each topic lists its cohorts by paper, with the question keys behind every one', () => {
  const { subjects } = buildExamRecurrence(fixtureBank(), { deliverable: notSeven });
  const zoo = subjects.zoonoses;
  assert.deepEqual(zoo.cohorts, [80, 84, 85]);
  assert.equal(zoo.items, 6, 'the aligned item and the one held from learners are not evidence');
  assert.deepEqual(zoo.topics.t1, {
    cohorts: [80, 85],
    first: 80,
    last: 85,
    items: 3,
    sat: { 80: { unknown: ['zoonoses:2'] }, 85: { midterm: ['zoonoses:1'] } },
    unattributed: ['zoonoses:3'],
  });
  assert.deepEqual(zoo.topics.t2, {
    cohorts: [84, 85],
    first: 84,
    last: 85,
    items: 2,
    sat: { 84: { unknown: ['zoonoses:6'] }, 85: { unknown: ['zoonoses:5', 'zoonoses:6'] } },
    unattributed: [],
  });
  assert.deepEqual(zoo.topics.__unassigned__.cohorts, [85], 'a question with no topic is kept, not dropped');
});

test('the same input in any order renders the same module', () => {
  const bank = fixtureBank();
  const once = renderModule(buildExamRecurrence(bank, { deliverable: everyone }));
  const again = renderModule(buildExamRecurrence([...bank].reverse(), { deliverable: everyone }));
  assert.equal(again, once);
  assert.match(once, /^\/\/ AUTO-GENERATED by scripts\/regen-exam-recurrence\.mjs/);
});

test('the generated file carries data only: ids, keys and numbers, no copy for students', () => {
  const generated = fs.readFileSync(path.join(repo, 'src/data/exam-recurrence.generated.js'), 'utf8');
  assert.doesNotMatch(generated, /[\u0E00-\u0E7F]/, 'Thai text would be copy; labels belong to a later, linted step');
  assert.match(generated, /export const EXAM_RECURRENCE = \{/);
  assert.match(generated, /export const EXAM_RECURRENCE_CLUSTERS = \[/);
});
