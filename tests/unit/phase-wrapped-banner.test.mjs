// The end-of-phase card on Home. On 26 Sep 2026, the day after the last
// midterm, it replaced the welcome card (tour, Mochi) for every student,
// including one who had never answered a question and so had nothing to
// recap, and it read year 4's timetable whatever year the student had
// chosen. It now needs activity inside the phase window and the chosen
// year's papers.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getCompletedPhase, hasPhaseActivity, buildPhaseStats } from '../../src/lib/phase-wrapped.js';

const AFTER_MIDTERM = new Date(2026, 8, 27, 10, 0); // 27 Sep 2026, local time
const DURING_MIDTERM = new Date(2026, 8, 24, 10, 0);

test('a completed phase is read from the year the caller names', () => {
  const y5 = getCompletedPhase(AFTER_MIDTERM, 'y5');
  assert.equal(y5?.id, '1-mid');
  assert.equal(y5.endDate.getDate(), 25, 'year 5 midterm ends with Zoonoses on 25 Sep');
  assert.equal(getCompletedPhase(DURING_MIDTERM, 'y5'), null, 'not completed while papers remain');
  assert.equal(getCompletedPhase(AFTER_MIDTERM, 'y1'), null, 'a year with no timetable has no recap');
});

test('activity means a history row inside the phase window, the same window the stats use', () => {
  const phase = getCompletedPhase(AFTER_MIDTERM, 'y5');
  assert.equal(hasPhaseActivity(phase, []), false);
  assert.equal(hasPhaseActivity(phase, [{ date: '2025-01-01T10:00:00Z', correct: true }]), false);
  const inside = [{ date: '2026-09-20T10:00:00+07:00', correct: true, subject: 'zoonoses' }];
  assert.equal(hasPhaseActivity(phase, inside), true);
  assert.equal(buildPhaseStats({ phase, history: inside }).qCount, 1);
  assert.equal(hasPhaseActivity(null, inside), false);
});

test('Home and the recap view pass the chosen year and gate the card on activity', () => {
  const home = readFileSync(resolve('src/views/HomeView.jsx'), 'utf8');
  assert.match(home, /getCompletedPhase\(new Date\(\), `y\$\{selectedYear\}`\)/);
  assert.match(home, /hasPhaseActivity\(completedPhase, history\)/);
  const view = readFileSync(resolve('src/views/PhaseWrappedView.jsx'), 'utf8');
  assert.match(view, /getCompletedPhase\(new Date\(\), year\)/);
  const app = readFileSync(resolve('src/App.jsx'), 'utf8');
  assert.match(app, /PhaseWrappedView \{\.\.\.\{[^}]*selectedYear[^}]*\}\}/);
});
