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
import { getCompletedPhase, getCurrentPhase, hasPhaseActivity, buildPhaseStats } from '../../src/lib/phase-wrapped.js';

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
  assert.match(view, /getCompletedPhase\(now, year, \{ includeDismissed: true \}\)/);
  const app = readFileSync(resolve('src/App.jsx'), 'utf8');
  assert.match(app, /PhaseWrappedView \{\.\.\.\{[^}]*selectedYear[^}]*\}\}/);
});

test('dismissing quiets the Home banner only; the recap page can still open the finished phase', () => {
  const store = new Map();
  globalThis.window = { localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  } };
  try {
    store.set('vmx-wrapped-dismissed', JSON.stringify({ '1-mid': 1 }));
    assert.equal(getCompletedPhase(AFTER_MIDTERM, 'y5'), null, 'Home no longer offers it');
    assert.equal(getCompletedPhase(AFTER_MIDTERM, 'y5', { includeDismissed: true })?.id, '1-mid',
      'the recap page used to fall back to a live preview of the next phase instead');
  } finally {
    delete globalThis.window;
  }
});

test('a finished phase draws its 30 days up to its own end, not up to today', () => {
  const phase = getCompletedPhase(AFTER_MIDTERM, 'y5');
  const stats = buildPhaseStats({ phase, history: [{ date: '2026-09-20T10:00:00+07:00', correct: true, subject: 'zoonoses' }], now: AFTER_MIDTERM });
  const last = stats.byDay[stats.byDay.length - 1].date;
  const end = new Date(phase.endDate.getTime() + 2 * 24 * 60 * 60 * 1000);
  assert.ok(last <= end.toLocaleDateString('en-CA'), `the strip ends ${last}, after the window`);
  assert.equal(stats.phaseEnd, phase.endDate.toISOString());
});

test('past the 21-day window the finished phase still reads as finished, and its last strip day counts', () => {
  // 20 Oct 2026: the Home banner is gone and the recap page falls back to
  // getCurrentPhase, which returns the same finished midterm. It used to be
  // marked as running ("ระหว่างทาง"), its strip ran on to today, flat.
  const now = new Date(2026, 9, 20, 10, 0);
  const phase = getCurrentPhase(now, 'y5');
  assert.equal(phase.id, '1-mid');
  const stats = buildPhaseStats({ phase, history: [{ date: '2026-09-26T15:00:00+07:00', correct: true, subject: 'zoonoses' }], now });
  assert.equal(stats.phaseCompleted, true);
  const last = stats.byDay[stats.byDay.length - 1];
  assert.equal(last.date, '2026-09-26', 'the strip ends on the last day the window holds');
  assert.equal(last.qs, 1, "that day used to be the window's closing midnight, always flat");
});

test('a phase still running is a preview whose strip ends today', () => {
  const phase = getCurrentPhase(DURING_MIDTERM, 'y5');
  const stats = buildPhaseStats({ phase, history: [{ date: '2026-09-23T10:00:00+07:00', correct: true, subject: 'zoonoses' }], now: DURING_MIDTERM });
  assert.equal(stats.phaseCompleted, false);
  assert.equal(stats.byDay[stats.byDay.length - 1].date, '2026-09-24');
});

test('the recap page decides finished or running from the clock, not from which lookup found the phase', () => {
  const view = readFileSync(resolve('src/views/PhaseWrappedView.jsx'), 'utf8');
  assert.doesNotMatch(view, /_state/);
  assert.match(view, /stats[.]phaseCompleted/);
});
