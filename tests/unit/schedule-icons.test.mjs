import test from 'node:test';
import assert from 'node:assert/strict';

import { EXAM_SCHEDULE } from '../../src/data/schedule.js';
import { SUBJECTS } from '../../src/data/curriculum.js';

// The timetable rows carry their own icon as free text, and it used to drift
// from the curriculum: avian-medicine wore poultry's 🐔, swine herd/repro were
// swapped, com2 wore com4's stethoscope. A row must never disagree with the
// subject it belongs to — students see both surfaces in the same week.
test('exam schedule rows reuse the curriculum icon of their subject', () => {
  const iconById = new Map(SUBJECTS.map(s => [s.id, s.icon]));
  const checked = new Set();
  for (const [year, rows] of Object.entries(EXAM_SCHEDULE)) {
    for (const exam of rows) {
      assert.ok(iconById.has(exam.subject), `${year}/${exam.id} points at unknown subject ${exam.subject}`);
      assert.equal(exam.icon, iconById.get(exam.subject), `${year}/${exam.id} icon drifts from curriculum`);
      checked.add(exam.id);
    }
  }
  assert.ok(checked.size >= 40, `expected the full current timetable, got ${checked.size} rows`);
});
