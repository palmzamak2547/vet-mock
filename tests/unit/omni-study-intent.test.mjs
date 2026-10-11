// ============================================================
// omni-study-intent.test.mjs — "คลิป COM5", "สรุป epidem", "ข้อสอบ avian"
// ============================================================
// Palm, 2026-10-11: a subject typed with คลิป, สรุปวิชา or แบบทดสอบ should put
// that subject's clips, summary or practice first. Pinned against the real
// curriculum and the same study catalog the topic screen counts from, so a
// button on the card can never promise a shelf the topic screen calls empty.

import test from 'node:test';
import assert from 'node:assert/strict';

import { detectStudyIntent, detectIntents, studyActions } from '../../src/lib/omni-intents.js';
import { createStudyCatalog } from '../../src/lib/study-catalog.js';

const intent = (q, year = 5) => detectStudyIntent(q, { selectedYear: year });
const first = (q, year) => intent(q, year)?.subjects[0]?.meta.id;

test('a shelf word plus a subject opens that shelf first', () => {
  for (const [q, want, id] of [
    ['คลิป COM5', 'videos', 'com5'],
    ['สรุป epidem', 'notes', 'epidemiology'],
    ['ข้อสอบ avian', 'practice', 'avian-medicine'],
    ['สรุปวิชาcom5', 'notes', 'com5'],
    ['คลิปcom5', 'videos', 'com5'],
    ['สรุประบาดวิทยา', 'notes', 'epidemiology'],
  ]) {
    const r = intent(q);
    assert.equal(r?.want, want, q);
    assert.equal(r.subjects[0].meta.id, id, q);
    assert.equal(studyActions(r.subjects[0], r.want).actions[0].target, want, `${q}: the asked-for shelf leads`);
  }
});

test('a course named outright gets its card; a fragment stays an ordinary result', () => {
  assert.equal(first('COM V'), 'com5');
  assert.equal(first('com 5'), 'com5');
  assert.equal(first('epidemiology'), 'epidemiology');
  assert.equal(intent('epidem'), null, 'the subject row already answers a fragment');
  assert.equal(intent('equine'), null);
});

test('a course number answers with the study card, a gen-ed number with the course card', () => {
  const kinds = (q) => detectIntents(q, { selectedYear: 5 }).map((i) => i.kind);
  assert.deepEqual(kinds('3107508'), ['study']);
  assert.deepEqual(kinds('5100101'), ['course']);
});

test('feature words alone, schedules and unrelated words are not a subject', () => {
  for (const q of ['สรุปบทเรียน', 'คลิปย้อนหลัง', 'ทดสอบ', 'ตารางสอบ epidem', 'schedule', 'Rabies', 'เครื่องคิดเลข', 'ข้อสอบ สัตว์']) {
    assert.equal(intent(q), null, q);
  }
});

test('an ambiguous name offers each course it can mean', () => {
  const ids = intent('ข้อสอบ ม้า').subjects.map((s) => s.meta.id).sort();
  assert.deepEqual(ids, ['equine-medicine', 'equine-repro']);
});

test('the card counts what the topic screen counts', () => {
  const r = intent('คลิป COM5');
  const page = createStudyCatalog().browse({ subject: 'com5' }).resources;
  const byTarget = Object.fromEntries(studyActions(r.subjects[0], r.want).actions.map((a) => [a.target, a.count]));
  assert.equal(byTarget.videos, page.videos.count);
  assert.equal(byTarget.practice, page.questions.count);
  assert.equal(byTarget.notes, page.notes.count);
});

test('an empty shelf is said plainly and the shelves that exist are offered', () => {
  const subject = { resources: { questions: { available: true, count: 26 }, notes: { available: false, count: 0 }, videos: { available: false, count: 0 }, wiki: { available: false, count: 0 } } };
  const { actions, missing } = studyActions(subject, 'videos');
  assert.equal(missing, 'ยังไม่มีคลิปในวิชานี้');
  assert.deepEqual(actions.map((a) => a.target), ['practice']);
  // The document shelf only appears when documents for the course can be opened.
  assert.deepEqual(studyActions(subject, null, 4).actions.map((a) => a.target), ['practice', 'library']);
});

test('a course with nothing behind it is not offered at all', () => {
  // Year-1 anatomy courses with no questions, notes, clips or articles.
  const r = intent('สรุป anatomy ปี 1');
  assert.ok(!r || r.subjects.every((s) => studyActions(s, r.want).actions.length > 0));
});
