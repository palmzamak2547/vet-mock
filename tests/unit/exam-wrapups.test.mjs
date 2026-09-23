import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { WRAPUP_SUBJECTS, WRAPUP_SCOPE, hasWrapUp, loadWrapUp, selfNumbered, wrapUpStillAhead } from '../../src/data/exam-wrapups.js';
import { LECTURER_SETS } from '../../src/data/lecturer-sets.js';
import * as curriculum from '../../src/data/curriculum.js';
import { QB, loadQB } from '../../src/data/questions.js';
import { isPastPaperQuestion } from '../../src/lib/question-metadata.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { removeQuestions, wrapUpCites } from '../../scripts/lib/bank-file.mjs';

const FORBIDDEN = /โพย|ออกตามนี้|ตรงข้อสอบ|ข้อสอบรั่ว|ออกบ่อย|ออกสอบบ่อย|นักศึกษา|·|★|…/;

function topicsOf(subject) {
  const ids = new Set();
  const walk = (o) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) return o.forEach(walk);
    if (o.id === subject && Array.isArray(o.topics)) o.topics.forEach((t) => ids.add(t.id));
    Object.values(o).forEach(walk);
  };
  walk(curriculum);
  return ids;
}

test('a wrap-up shows only for the paper it was written for', () => {
  for (const s of WRAPUP_SUBJECTS) {
    assert.equal(hasWrapUp(s, WRAPUP_SCOPE.year, WRAPUP_SCOPE.phase), true);
    assert.equal(hasWrapUp(s, WRAPUP_SCOPE.year, '1-final'), false);
    assert.equal(hasWrapUp(s, 4, WRAPUP_SCOPE.phase), false);
  }
  assert.equal(hasWrapUp('no-such-subject'), false);
});

for (const subject of WRAPUP_SUBJECTS) {
  test(`${subject}: every item is a curriculum topic of a lecturer in the set, sourced, and clean`, async () => {
    const w = await loadWrapUp(subject);
    assert.ok(w, 'loads');
    assert.equal(w.subject, subject);
    assert.equal(w.exam.date, LECTURER_SETS[subject].examDate, 'exam date matches the lecturer set');
    const topics = topicsOf(subject);
    const lecturerIds = new Set(LECTURER_SETS[subject].lecturers.map((l) => l.id));
    assert.ok(w.groups.length >= 1);
    let items = 0;
    for (const g of w.groups) {
      assert.ok(lecturerIds.has(g.id), `lecturer ${g.id} is in the set`);
      assert.ok(g.formatNote && !FORBIDDEN.test(g.formatNote));
      for (const it of g.items) {
        items++;
        assert.ok(topics.has(it.topic), `${it.topic} is a curriculum topic`);
        assert.ok(it.keywords.length >= 3, `${it.name}: keywords`);
        assert.ok(it.emphasis.length >= 1, `${it.name}: emphasis`);
        for (const b of [...it.emphasis, ...it.examined]) {
          assert.ok(b.text && b.src, `${it.name}: every bullet names its source`);
          assert.ok(!FORBIDDEN.test(b.text), `${it.name}: forbidden token in "${b.text.slice(0, 30)}"`);
        }
        assert.ok(it.sources.length >= 1);
      }
    }
    assert.ok(items >= 1);
  });
}

test('a list the lecturer numbered is not numbered twice', () => {
  assert.equal(selfNumbered(['1 Emerging Infectious Diseases', '2 Public Health', '3 Food Safety']), true);
  assert.equal(selfNumbered(['21 genotype แต่ 1 serotype', '5 pathotypes (velogenic ถึง asymptomatic)']), false, 'a figure that opens a fact is not a list number');
  assert.equal(selfNumbered(['ถ่ายมูกเลือด ไก่เนื้อ 3-6 สัปดาห์']), false);
  assert.equal(selfNumbered([]), false);
});

test('no shipped keyword glues a heading onto its first list item', async () => {
  for (const subject of WRAPUP_SUBJECTS) {
    const w = await loadWrapUp(subject);
    for (const g of w.groups) {
      for (const it of g.items) {
        for (const k of it.keywords) {
          assert.ok(!/[:：]\s*\d+\s+\S+.*$/.test(k) || !/^\s*\d/.test(k), `${it.name}: "${k}" reads as a heading with item 1 stuck to it`);
          assert.ok(!/[:：,;]\s*$/.test(k), `${it.name}: "${k}" stops mid-sentence`);
          const open = (k.match(/\(/g) || []).length;
          const close = (k.match(/\)/g) || []).length;
          assert.equal(open, close, `${it.name}: "${k}" has unbalanced brackets`);
        }
      }
    }
  }
});

test("Home drops a subject's wrap-up once that paper is over, and keeps it while any sitting remains", () => {
  const end = (e) => e.endMs;
  const papers = [
    { subject: 'one-health', endMs: 1_000 },
    { subject: 'avian-medicine', endMs: 5_000 },
  ];
  // before either paper
  assert.equal(wrapUpStillAhead('one-health', papers, end, 0), true);
  assert.equal(wrapUpStillAhead('avian-medicine', papers, end, 0), true);
  // between them: the morning paper is done, the afternoon one is not
  assert.equal(wrapUpStillAhead('one-health', papers, end, 2_000), false);
  assert.equal(wrapUpStillAhead('avian-medicine', papers, end, 2_000), true);
  // after both
  assert.equal(wrapUpStillAhead('avian-medicine', papers, end, 9_000), false);
  // a resit or a second paper keeps it while any one is still ahead
  const two = [{ subject: 'x', endMs: 1_000 }, { subject: 'x', endMs: 8_000 }];
  assert.equal(wrapUpStillAhead('x', two, end, 2_000), true);
  // silence in the timetable is not evidence the exam was sat
  assert.equal(wrapUpStillAhead('not-scheduled', papers, end, 9_000), true);
  assert.equal(wrapUpStillAhead('anything', [], end, 9_000), true);
});

test('only the paper the wrap-up was written for counts; a later final does not keep it alive', () => {
  const end = (e) => e.endMs;
  const papers = [
    { subject: 'one-health', term: 'midterm', endMs: 1_000 },
    { subject: 'one-health', term: 'final', endMs: 9_000_000 },
  ];
  assert.equal(wrapUpStillAhead('one-health', papers, end, 2_000, 'midterm'), false, 'the midterm is over');
  assert.equal(wrapUpStillAhead('one-health', papers, end, 2_000, 'final'), true, 'the final is still ahead');
  assert.equal(wrapUpStillAhead('one-health', papers, end, 2_000, null), true, 'no term given: any paper counts');
});

// A bullet names the question behind it: "ข้อสอบเก่า 105728" is a claim that a
// cohort sat that item, "แนวข้อสอบ 202275" that it was written from a senior's
// exam guidance. The number is the only link back to the bank, so it must
// resolve, and the stronger label must mean exactly what isPastPaperQuestion
// means everywhere else in the app. Commit 7dd03d5b merged #105730 into
// #207464 and left the milk wrap-up citing a question that no longer existed,
// and 57 bullets called a compilation-written item "ข้อสอบเก่า".
function wrapUpCiteFaults(wrapup, byId) {
  const faults = [];
  const walk = (o) => {
    if (typeof o === 'string') {
      for (const { label, id } of wrapUpCites(o)) {
        const q = byId.get(id);
        if (!q) faults.push(`${label} ${id} is not in the bank`);
        else if (!isQuestionDeliverable(q)) faults.push(`${label} ${id} is blocked from delivery`);
        else if (label === 'ข้อสอบเก่า' && !isPastPaperQuestion(q)) faults.push(`ข้อสอบเก่า ${id} is not a past paper (${q.sourceType || 'no sourceType'})`);
      }
      return;
    }
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') Object.values(o).forEach(walk);
  };
  walk(wrapup);
  return faults;
}

const bankById = async () => {
  await loadQB();
  return new Map(QB.map((q) => [String(q.id), q]));
};

test('every question a wrap-up cites is live, and "ข้อสอบเก่า" only ever names a sat paper', async () => {
  const byId = await bankById();
  const faults = [];
  let cites = 0;
  for (const subject of WRAPUP_SUBJECTS) {
    const w = await loadWrapUp(subject);
    cites += wrapUpCites(JSON.stringify(w)).length;
    faults.push(...wrapUpCiteFaults(w, byId).map((f) => `${subject}: ${f}`));
  }
  assert.ok(cites > 150, `only ${cites} cited ids found, so the parser stopped reading them`);
  assert.deepEqual(faults, []);
});

test('deleting a question a wrap-up cites fails that check', async () => {
  const byId = await bankById();
  const w = await loadWrapUp('milk-meat-hygiene');
  const [first] = wrapUpCites(JSON.stringify(w));
  assert.ok(first, 'the milk wrap-up cites questions');
  assert.deepEqual(wrapUpCiteFaults(w, byId).filter((f) => f.includes(` ${first.id} `)), []);
  byId.delete(first.id);
  assert.ok(wrapUpCiteFaults(w, byId).some((f) => f === `${first.label} ${first.id} is not in the bank`));
});

test('the citation parser reads id lists and stops at the next pointer', () => {
  assert.deepEqual(wrapUpCites('ข้อสอบเก่า 105734, 105735, TJ ข้อ 46 และ 47 (บล็อก 7)').map((c) => c.id), ['105734', '105735']);
  assert.deepEqual(wrapUpCites('ข้อสอบเก่าปี 4 1923, แนวข้อสอบปี 4 4019'), [
    { label: 'ข้อสอบเก่า', id: '1923' }, { label: 'แนวข้อสอบ', id: '4019' },
  ]);
  assert.deepEqual(wrapUpCites('TJ p5, แนวข้อสอบ 202279, 202280'), [
    { label: 'แนวข้อสอบ', id: '202279' }, { label: 'แนวข้อสอบ', id: '202280' },
  ]);
  assert.deepEqual(wrapUpCites('ข้อสอบเก่า ตอนถูก/ผิด ข้อ 3'), []);
});

test('removing a question a wrap-up still cites says so', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wrapcite-'));
  fs.mkdirSync(path.join(dir, 'wrapups'));
  const bank = path.join(dir, 'questions-x.js');
  fs.writeFileSync(bank, 'export const X = [\n  { "id": 105730, "q": "หนึ่ง" },\n  { "id": 105731, "q": "สอง" },\n];\n');
  fs.writeFileSync(path.join(dir, 'wrapups', 'milk.js'), 'export default { src: "ข้อสอบเก่า 105730" };\n');
  const warned = [];
  const original = console.warn;
  console.warn = (...args) => warned.push(args.join(' '));
  try {
    assert.equal(removeQuestions(bank, new Set([105731])), 1);
    assert.deepEqual(warned, [], 'an uncited question goes quietly');
    assert.equal(removeQuestions(bank, new Set([105730])), 1);
  } finally {
    console.warn = original;
  }
  assert.equal(warned.length, 1);
  assert.match(warned[0], /milk\.js/);
  assert.match(warned[0], /105730/);
});
