import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WRAPUP_SUBJECTS, WRAPUP_SCOPE, hasWrapUp, loadWrapUp, selfNumbered, wrapUpStillAhead } from '../../src/data/exam-wrapups.js';
import { LECTURER_SETS } from '../../src/data/lecturer-sets.js';
import * as curriculum from '../../src/data/curriculum.js';

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
