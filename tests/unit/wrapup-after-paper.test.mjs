// Sweep 2026-10-20: Home stopped offering a wrap-up once its paper was sat,
// but the topic screen kept a "อ่านสรุปก่อนสอบ" card for a paper that ended
// days earlier. Both places must ask the same question.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { wrapUpStillAhead } from '../../src/data/exam-wrapups.js';

const topic = readFileSync(new URL('../../src/views/TopicSelectView.jsx', import.meta.url), 'utf8');

test('the topic screen hides a wrap-up whose paper has been sat, as Home does', () => {
  assert.match(topic, /const wrapUp = onOpenWrapUp \? wrapUpFor\(subject, selectedYear, paperPhase\) : null;/);
  // A past year's timetable has every paper behind it: the earlier year's
  // wrap-up the student falls back to shows (labelled) instead of hiding.
  assert.match(topic, /showWrapUp = Boolean\(wrapUp && \(pastYearTable\s*\|\|\s*wrapUpStillAhead\(subject, getUpcomingExams\(`y\$\{selectedYear\}`\), examEndMs, Date\.now\(\), scopeForPhase\(paperPhase\)\)\)\);/);
});

test('a sat paper is no longer ahead; a paper later today still is', () => {
  const paper = { subject: 'one-health', term: 'midterm', end: 1000 };
  const endOf = (e) => e.end;
  assert.equal(wrapUpStillAhead('one-health', [paper], endOf, 2000, 'midterm'), false);
  assert.equal(wrapUpStillAhead('one-health', [paper], endOf, 500, 'midterm'), true);
});
