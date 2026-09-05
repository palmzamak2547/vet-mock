// ============================================================
// phase-wrapped-study-time.test.mjs — an estimate must say so
// ============================================================
// The Wrapped card shows "ที่อ่าน 3.0 ชม." and burns the same number
// into the PNG a student posts to IG. Nothing in the app ever writes
// `durationSec` onto a history row (finishExam stores
// {date, questionId, correct, subject, year, phase}; the real session
// length only leaves as exam_results.duration_sec), so buildPhaseStats'
// "measured" branch is dead and every hour on the card is
// qCount * 45 s relabelled. 240 Qs in forty minutes of short bursts and
// 240 Qs across ten evenings both read "3.0 ชม.".
//
// The number is still worth showing — the text export already hedges
// it with "~" — but the stats have to carry WHERE it came from, and
// every surface that prints it has to pass that on. This pins:
//   1. buildPhaseStats flags an estimated total (and does not flag a
//      fully measured one);
//   2. statsToText hedges only when told the number is a guess;
//   3. the card's on-screen cell and its canvas block both consult the
//      flag (JSX can't be imported here, so that part is a source pin).
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildPhaseStats, statsToText } from '../../src/lib/phase-wrapped.js';

const phase = {
  id: '1-mid',
  label: 'เทอม 1 กลางภาค',
  startDate: new Date(2026, 8, 1),
  endDate: new Date(2026, 9, 15),
};
// Inside the phase window (buildPhaseStats pads 60 days before startDate).
const T0 = new Date(2026, 8, 10, 10, 0, 0).getTime();

/** History rows exactly as finishExam writes them — no durationSec unless asked. */
function rows(n, extra = {}) {
  return Array.from({ length: n }, (_, i) => ({
    date: T0 + i * 60_000,
    questionId: 1000 + i,
    correct: i % 2 === 0,
    subject: 'poultry',
    year: 4,
    phase: '1-mid',
    ...extra,
  }));
}

test('rows without durationSec: the total is the 45 s/Q guess and is flagged as one', () => {
  const stats = buildPhaseStats({ phase, history: rows(240) });
  assert.equal(stats.qCount, 240);
  assert.equal(stats.totalStudyMin, 180, '240 x 45 s = 180 min; the value itself is unchanged');
  assert.equal(stats.studyTimeEstimated, true);
});

test('rows that all carry durationSec: measured minutes, not flagged', () => {
  const stats = buildPhaseStats({ phase, history: rows(240, { durationSec: 10 }) });
  assert.equal(stats.totalStudyMin, 40, '240 x 10 s = 40 min');
  assert.equal(stats.studyTimeEstimated, false);
});

test('a partly measured total is still an estimate', () => {
  const history = [...rows(100, { durationSec: 30 }), ...rows(5)];
  const stats = buildPhaseStats({ phase, history });
  assert.equal(stats.studyTimeEstimated, true);
});

test('an empty phase has nothing estimated', () => {
  assert.equal(buildPhaseStats({ phase, history: [] }).studyTimeEstimated, false);
  assert.equal(buildPhaseStats({ phase: null }).studyTimeEstimated, false);
});

test('statsToText hedges the guess and does not hedge a measurement', () => {
  const guessed = statsToText(buildPhaseStats({ phase, history: rows(240) }));
  assert.match(guessed, /⏱ อ่านไป ~3\.0 ชม\./);
  const measured = statsToText(buildPhaseStats({ phase, history: rows(240, { durationSec: 10 }) }));
  assert.match(measured, /⏱ อ่านไป 0\.7 ชม\./);
  assert.doesNotMatch(measured, /~/);
});

// ── Card source pin ──────────────────────────────────────────
const CARD = readFileSync(join(resolve(process.cwd()), 'src/components/PhaseWrappedCard.jsx'), 'utf8');

test('the on-screen ที่อ่าน cell prints the hedge, not a bare number', () => {
  const cell = CARD.split('\n').find((l) => l.includes('<StatCell') && l.includes('unit="ชม."'));
  assert.ok(cell, 'the study-time StatCell must still exist');
  assert.doesNotMatch(cell, /label="ที่อ่าน"/, 'a fixed "ที่อ่าน" label presents the estimate as measured');
  assert.match(cell, /studyTimeEstimated|hrApprox/, 'the cell must consult the estimate flag');
});

test('the shared PNG prints the hedge next to the hours', () => {
  const label = CARD.indexOf("'ที่อ่าน");
  assert.notEqual(label, -1, 'the canvas study-time label must still be drawn');
  const block = CARD.slice(CARD.lastIndexOf('\n', label), CARD.indexOf("'ชม.'", label));
  assert.match(block, /studyTimeEstimated|hrApprox/, 'the canvas block must consult the estimate flag');
  assert.doesNotMatch(block, /fillText\(`\$\{hr\}`/, 'the hours must not be drawn bare');
});
