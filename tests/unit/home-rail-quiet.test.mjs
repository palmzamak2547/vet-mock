// Home's rail (5.214): the tuition countdown is named only in its last 14
// days, and a class row prints the course's own name in the app, never the
// registrar's capitals cut mid-word ("EQUINE MEDICINE AND SU… VET6 807").

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getHomeMilestone, getTopMilestone, describeMilestone, ACADEMIC_MILESTONES, CLASS_TIMETABLE, PAYMENT_NOTICE_DAYS } from '../../src/data/schedule.js';
import { SUBJECTS, SUBJECTS_BY_YEAR } from '../../src/data/curriculum.js';

const at = (iso) => new Date(`${iso}T10:00:00+07:00`);

test('the tuition window is not on Home 67 days out, and is in its last 14 days', () => {
  const payment = ACADEMIC_MILESTONES.find((m) => m.id === 's2-payment');
  assert.equal(payment.kind, 'payment');
  // 11 Nov 2026: the window had 67 days left and was Home's milestone.
  const early = at('2026-11-11');
  assert.equal(describeMilestone(payment, early).daysLeftToEnd > PAYMENT_NOTICE_DAYS, true);
  assert.equal(getTopMilestone(early)?.kind, 'payment', 'the schedule page still ranks it');
  assert.notEqual(getHomeMilestone(early)?.kind, 'payment', 'Home names a 67-day countdown');
  // Its last 14 days: named when it is the window closing first.
  for (const iso of ['2027-01-04', '2027-01-17']) {
    const late = at(iso);
    const left = describeMilestone(payment, late).daysLeftToEnd;
    assert.ok(left <= PAYMENT_NOTICE_DAYS && left >= 0, iso);
    const top = getTopMilestone(late);
    if (top?.id === 's2-payment') assert.equal(getHomeMilestone(late)?.id, 's2-payment', `${iso}: hidden in its last days`);
  }
});

test('every class row Home can print has a course name in the app, so no row falls back to capitals', () => {
  const all = [...SUBJECTS, ...Object.values(SUBJECTS_BY_YEAR).flat()];
  for (const [year, rows] of Object.entries(CLASS_TIMETABLE)) {
    for (const r of rows) {
      const name = all.find((s) => s.id === r.subject)?.name;
      if (name) assert.notEqual(name, r.title, `${year} ${r.subject}`);
    }
  }
  const home = readFileSync(new URL('../../src/views/HomeView.jsx', import.meta.url), 'utf8');
  assert.match(home, /const nextClassToday = courseNamed\(getNextClass\(selectedYear\)\);/);
  assert.match(home, /const topMilestone = getHomeMilestone\(\);/);
  assert.ok(!/nextClassToday\.code/.test(home), 'the course code is back on the row');
});
