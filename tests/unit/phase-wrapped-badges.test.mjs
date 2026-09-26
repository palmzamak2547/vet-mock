// ============================================================
// phase-wrapped-badges.test.mjs — a Phase Wrapped badge is earned exactly
// when its label is true (B80)
// ============================================================
// badges.js says "A badge is earned or it is not shown as earned", but:
//   - 'จบช่วงสอบ' needed stats.phaseCompleted, which buildPhaseStats never set;
//   - 'ชุดเต็ม ไม่ผิดเลย' needed every answer in the ~65-day window correct,
//     so a 10/10 set among other sets never earned it;
//   - 'รอดจาก Panic Mode' went to any 50 answers, Panic Mode or not;
//   - 'ช่วยเติมเนื้อหา' ("ส่งเนื้อหาเข้ามาช่วยเติมคลัง") went to a private
//     custom question, which is never sent anywhere.
// History rows carry no mode, so Panic answers and submissions have to be
// passed in by whoever knows them; until then those badges are not offered.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPhaseStats } from '../../src/lib/phase-wrapped.js';
import { earnedBadges } from '../../src/lib/badges.js';

const base = { id: '1-mid', label: 'เทอม 1 กลางภาค', startDate: new Date(2026, 8, 21), endDate: new Date(2026, 8, 25) };
const T = new Date(2026, 8, 20, 10, 0, 0).getTime();

// Rows as finishExam writes them: one `date` for the whole set.
function set(at, n, correctOf) {
  return Array.from({ length: n }, (_, i) => ({ date: at, questionId: at + i, correct: i < correctOf, subject: 'com5', year: 5, phase: '1-mid' }));
}

// The probe from the report: 60 answers in the midterm week, first set 10/10,
// then sets with mistakes; one private custom question.
const history = [
  ...set(T, 10, 10),
  ...set(T + 60_000, 20, 15),
  ...set(T + 120_000, 30, 20),
];
const customQuestions = [{ id: 60001, q: 'my own question' }];

const ids = (badges) => badges.map((b) => b.id).sort();

test('a completed phase with a 10/10 set earns จบช่วงสอบ and ชุดเต็ม, and nothing it did not do', () => {
  const stats = buildPhaseStats({ phase: { ...base, _state: 'completed' }, history });
  assert.equal(stats.phaseCompleted, true);
  assert.equal(stats.perfectSets, 1);
  const got = ids(earnedBadges({ history, customQuestions, stats }));
  assert.ok(got.includes('exam-finished'), 'a completed phase is not marked finished');
  assert.ok(got.includes('perfect'), 'a 10/10 set did not earn ชุดเต็ม');
  assert.ok(!got.includes('panic-survivor'), 'Panic Mode badge for answers that were not Panic Mode');
  assert.ok(!got.includes('contributor'), 'a private custom question is not a submission');
});

test('the current phase is not finished, and a short or imperfect set is not ชุดเต็ม', () => {
  const rows = [...set(T, 9, 9), ...set(T + 60_000, 12, 11)];
  const stats = buildPhaseStats({ phase: { ...base, _state: 'current' }, history: rows });
  assert.equal(stats.phaseCompleted, false);
  assert.equal(stats.perfectSets, 0);
  const got = ids(earnedBadges({ history: rows, stats }));
  assert.ok(!got.includes('exam-finished'));
  assert.ok(!got.includes('perfect'));
});

test('Panic and contributor badges follow the counts passed for them', () => {
  const stats = buildPhaseStats({ phase: { ...base, _state: 'current' }, history });
  const got = ids(earnedBadges({ history, stats, panicAnswers: 50, contributions: 1 }));
  assert.ok(got.includes('panic-survivor'));
  assert.ok(got.includes('contributor'));
  assert.ok(!ids(earnedBadges({ history, stats, panicAnswers: 49 })).includes('panic-survivor'));
});
