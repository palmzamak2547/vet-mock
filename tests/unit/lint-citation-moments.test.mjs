// A question that says "คาบ 3 นาที 12:06" sends the student to a moment of a
// recording. scripts/lint-citation-moments.mjs checks that the moment exists:
// the recording has a summary, the time is real and inside the recording, and
// it falls near a timestamp the summary carries. These tests pin that it
// passes on the shipped data and that each kind of broken cite fails it.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BUDGET, WINDOW, checkCitationMoments, citeFault, citesIn, loadQuestions, loadRecordings, seconds,
} from '../../scripts/lint-citation-moments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [questions, recordings] = await Promise.all([loadQuestions(ROOT), loadRecordings(ROOT)]);

test('every cited moment in the shipped bank and summaries lands in its recording', () => {
  const { checked, faults } = checkCitationMoments({ questions, recordings });
  assert.ok(questions.length > 6000, `only ${questions.length} questions read`);
  assert.ok(checked > 1000, `only ${checked} cites found, so the parser stopped reading them`);
  assert.ok(faults.length <= BUDGET, faults.map((f) => `${f.where} ${f.cite}: ${f.why}`).join('\n'));
});

// A real recording with a summary, and one of its question cites, to break.
const [realId, realRec] = [...recordings].find(([, r]) => r.moments.length > 3 && r.durationMin > 30);
const heading = realRec.moments[2];
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const row = (verified) => ({ id: 999999, subject: 'scratch', topic: 'scratch', q: 'x', verified });
const faultsFor = (verified) => checkCitationMoments({ questions: [row(verified)], recordings: new Map([[realId, { ...realRec, examFormat: '' }]]) }).faults;

test('a cite a little into a section, or just before its heading, passes', () => {
  assert.deepEqual(faultsFor(`${realId} [${mmss(heading + WINDOW.after)}]`), []);
  assert.deepEqual(faultsFor(`${realId} [${mmss(heading - WINDOW.before)}]`), []);
  assert.deepEqual(faultsFor(`VET86 ${realId} [${mmss(heading)}-${mmss(heading + 30)}], [${mmss(heading + 10)}]`), []);
});

test('[99:99] fails', () => {
  const faults = faultsFor(`${realId} [99:99]`);
  assert.equal(faults.length, 1);
  assert.equal(faults[0].why, 'malformed time');
  assert.ok(Number.isNaN(seconds('99:99')));
  assert.equal(seconds('1:02:03'), 3723);
});

test('an 11-character id that has no summary fails instead of being skipped', () => {
  const faults = faultsFor('Zz9Zz9Zz9Zz [1:00]');
  assert.equal(faults.length, 1);
  assert.equal(faults[0].why, 'no summary for this recording id');
});

test('a moment past the end of the recording fails', () => {
  const past = realRec.durationMin * 60 + 60;
  assert.match(citeFault({ start: mmss(past), end: null }, realRec), /past the end/);
  assert.equal(citeFault({ start: mmss(realRec.durationMin * 60 + 30), end: null }, { ...realRec, moments: [realRec.durationMin * 60] }), null,
    'durationMin is cut down to whole minutes, so the last minute is still inside');
});

test('a moment nowhere near any summary timestamp fails', () => {
  const rec = { moments: [60, 600], durationMin: 60, examFormat: '' };
  assert.match(citeFault({ start: '20:00', end: null }, rec), /no summary timestamp within/);
  assert.equal(citeFault({ start: '12:59', end: null }, rec), null);
});

test('an examFormat is checked against its own recording', () => {
  const rec = { moments: [60, 600], durationMin: 60, examFormat: 'เน้น [1:30] และ [40:00]' };
  const { faults } = checkCitationMoments({ questions: [], recordings: new Map([['AbCdEfGh123', rec]]) });
  assert.deepEqual(faults.map((f) => f.cite), ['[40:00]']);
});

test('plain words are not read as recording ids', () => {
  assert.deepEqual(citesIn('information [12:30]'), []);
  assert.deepEqual(citesIn('ดู 7XyI0SjnuBA [12:34], [13:00-13:20]').map((c) => [c.start, c.end]), [['12:34', null], ['13:00', '13:20']]);
});
