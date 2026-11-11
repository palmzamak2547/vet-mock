// ============================================================
// text-only-surfaces.test.mjs — no figure question where no figure is drawn
// ============================================================
// TodaysQModal and the race run screen render the stem and the options only.
// The daily pick and the race pool took any deliverable MCQ, so a year-4
// student could be handed "ดูภาพประกอบ — ภาพใดคือ …" with options A to E and
// no picture, and the answer went into the class pulse (B49). A 15-question
// practrum race had about a 0.8 chance of including a dystocia-grid item.
//
// These run the real pickers over the real bank.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { yearForSubject } from '../../src/data/curriculum.js';
import { pickTodaysQ } from '../../src/lib/daily-q.js';
import { isTextOnlyQuestion, raceEligibleQuestions } from '../../src/lib/question-surfaces.js';

const LIVE = [];
for (const entry of BANK_REGISTRY) for (const q of await entry.load()) LIVE.push(q);
const DELIVERABLE = LIVE.filter(isQuestionDeliverable);

// A passage question that keeps its whole sentence in `say` needs nothing more: these screens draw that sentence.
const needsMore = (q) => Boolean(q.image || q.imagePath || (q.passage && !q.say));

test('a question whose numbers sit in a passage table, and whose whole sentence is kept, is still text only', () => {
  const kept = DELIVERABLE.filter((q) => q.passage && q.say);
  assert.ok(kept.length >= 13, `${kept.length} questions keep their whole sentence`);
  for (const q of kept) assert.ok(isTextOnlyQuestion(q), `${q.subject}:${q.id}`);
  assert.equal(isTextOnlyQuestion({ q: 'ข้อใดถูก', passage: 'เนื้อเรื่องที่ต้องอ่าน' }), false, 'a passage with no whole sentence is still needed');
  const pool = raceEligibleQuestions(LIVE, 'epidemiology', isQuestionDeliverable);
  for (const q of kept.filter((x) => x.subject === 'epidemiology' && x.type === 'mcq' && x.options.length >= 3)) {
    assert.ok(pool.includes(q), `${q.subject}:${q.id} left the race pool`);
  }
});

function daysFrom(start, n) {
  const d = new Date(`${start}T00:00:00Z`);
  return Array.from({ length: n }, (_, i) => {
    const x = new Date(d.getTime() + i * 86400000);
    return `${x.getUTCFullYear()}-${String(x.getUTCMonth() + 1).padStart(2, '0')}-${String(x.getUTCDate()).padStart(2, '0')}`;
  });
}

test('the bank still has figure questions, so the checks below mean something', () => {
  const years = new Set(DELIVERABLE.filter((q) => q.type === 'mcq' && needsMore(q)).map((q) => yearForSubject(q.subject)));
  assert.ok(years.has(4) && years.has(5), `figure MCQs in years ${[...years].join(', ')}`);
});

test('a year of daily questions never picks one that needs a figure or passage', () => {
  // HomeView hands pickTodaysQ the deliverable bank and the student's year.
  const days = daysFrom('2026-09-01', 366);
  for (const year of [1, 2, 3, 4, 5]) {
    for (const day of days) {
      const q = pickTodaysQ(DELIVERABLE, day, { year });
      if (!q) continue;
      assert.ok(!needsMore(q), `year ${year} on ${day} picked ${q.subject}:${q.id}, which needs its figure`);
    }
  }
});

test('the daily pick is still deterministic for a (year, date)', () => {
  const a = pickTodaysQ(DELIVERABLE, '2027-02-06', { year: 4 });
  const b = pickTodaysQ([...DELIVERABLE].reverse(), '2027-02-06', { year: 4 });
  assert.equal(`${a.subject}:${a.id}`, `${b.subject}:${b.id}`);
});

test('no race pool contains a question the race screen cannot draw', () => {
  const subjects = [...new Set(DELIVERABLE.map((q) => q.subject))];
  let figureSubjects = 0;
  for (const subject of subjects) {
    const withFigures = DELIVERABLE.filter((q) => q.subject === subject && q.type === 'mcq' && needsMore(q));
    if (withFigures.length) figureSubjects++;
    const pool = raceEligibleQuestions(LIVE, subject, isQuestionDeliverable);
    for (const q of pool) {
      assert.ok(isTextOnlyQuestion(q), `${subject}:${q.id} is in the race pool but needs its figure`);
      assert.ok(isQuestionDeliverable(q) && q.type === 'mcq' && q.options.length >= 3);
    }
  }
  assert.ok(figureSubjects > 0, 'some subject has figure questions to exclude');
});

test('the race screen builds its pool through raceEligibleQuestions', () => {
  const src = readFileSync(new URL('../../src/views/RaceView.jsx', import.meta.url), 'utf8');
  assert.match(src, /raceEligibleQuestions\(QB, subject, isQuestionDeliverable\)/);
});
