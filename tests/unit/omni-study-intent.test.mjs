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
import { Q_VISIBLE_COUNTS_BY_SUBJECT_BY_BANK_YEAR as BY_BANK_YEAR } from '../../src/data/q-counts.js';

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
  // Year 4: COM V's own year, where its practice shelf opens (see below).
  const r = intent('คลิป COM5', 4);
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

test('a document count that is not known yet is neither "none" nor a number', () => {
  const subject = { resources: { questions: { available: true, count: 100 }, notes: { available: true, count: 6 } } };
  // null: the shelf has not loaded (or could not). Asked for, it still leads.
  const asked = studyActions(subject, 'library', null);
  assert.equal(asked.missing, null, 'never "ยังไม่มีเอกสาร" on a count that is only missing');
  assert.deepEqual(asked.actions[0], { target: 'library', label: 'คลังเอกสาร', count: null, unit: 'ไฟล์' });
  // Not asked for, an unknown shelf is not offered.
  assert.deepEqual(studyActions(subject, null, null).actions.map((a) => a.target), ['practice', 'notes']);
  // Known and empty is said plainly, as before.
  const empty = studyActions(subject, 'library', 0);
  assert.equal(empty.missing, 'ยังไม่มีเอกสารของวิชานี้ในคลัง');
  assert.deepEqual(empty.actions.map((a) => a.target), ['practice', 'notes']);
  assert.equal(studyActions(subject, 'library', 3).actions[0].count, 3);
});

test('practice is offered only for a course of the selected year', () => {
  // App loads the selected year's question banks and its practice screens
  // count that year's pool. COM V is a year-4 course: in year 5 the card said
  // "ฝึกข้อสอบ COM V 129 ข้อ, ปี 4", Enter opened the topics, and every topic
  // said ยังไม่มีข้อที่พร้อมใช้ในชุดนี้ with start disabled.
  for (const q of ['ข้อสอบ com5', 'com5', 'COM V', 'ข้อสอบ com5 ปี 4']) {
    const r = intent(q, 5);
    const main = r?.subjects[0];
    assert.equal(main?.meta.id, 'com5', q);
    const { actions } = studyActions(main, r.want);
    assert.ok(!actions.some((a) => a.target === 'practice'), `${q}: no practice button outside year 4`);
    assert.ok(actions.length > 0, `${q}: notes, clips and VetWiki open in any year`);
  }
  // Asked for practice, the card says where the questions are instead of
  // claiming the course has none.
  const asked = intent('ข้อสอบ com5', 5);
  assert.equal(studyActions(asked.subjects[0], asked.want).missing,
    'ข้อสอบวิชานี้อยู่ในชั้นปี 4 เปลี่ยนเป็นชั้นปี 4 ก่อนจึงจะฝึกได้');
  // In its own year the same card leads with practice.
  const own = intent('ข้อสอบ com5', 4);
  assert.equal(studyActions(own.subjects[0], own.want).actions[0].target, 'practice');
  assert.equal(studyActions(own.subjects[0], own.want).missing, null);
  // A course of the selected year keeps its practice shelf.
  const y5 = intent('ข้อสอบ epidemiology', 5);
  assert.equal(studyActions(y5.subjects[0], y5.want).actions[0].target, 'practice');
});

test('a course whose only shelf is another year\'s practice gets no card', () => {
  // Hypothetical entry with questions and nothing else: in another year
  // there is nothing on the card a tap could open.
  const subject = { year: 4, practiceOpen: false, resources: { questions: { available: true, count: 40 } } };
  assert.deepEqual(studyActions(subject, null).actions, []);
  for (const q of ['ข้อสอบ com5', 'com5']) {
    for (const s of intent(q, 5)?.subjects || []) {
      assert.ok(studyActions(s, null).actions.length > 0, `${q}: ${s.meta.id} is offered only with something to open`);
    }
  }
});

// 2026-10-12 review of the rule above: practice follows the banks App loads,
// not the course's year. questions-vca.js is a shared bank (registry year
// null), so VCA practice opens in years 1-4 on it; the card had vanished there.
test('a course with a bank that loads in every year keeps practice in every year, at the count that year serves', () => {
  const shared = BY_BANK_YEAR.shared.vca;
  const own5 = BY_BANK_YEAR['5'].vca;
  assert.ok(shared > 0 && own5 > 0, 'VCA has a shared bank and year-5 banks');
  for (const year of [1, 3, 4]) {
    const r = intent('ข้อสอบ vca', year);
    const vca = r?.subjects.find((s) => s.meta.id === 'vca');
    assert.ok(vca, `year ${year}: the card is there`);
    const practice = studyActions(vca, r.want).actions[0];
    assert.equal(practice?.target, 'practice', `year ${year}: practice leads`);
    assert.equal(practice.count, shared, `year ${year}: the shared bank is what loads`);
  }
  const r5 = intent('ข้อสอบ vca', 5);
  const vca5 = r5.subjects.find((s) => s.meta.id === 'vca');
  assert.equal(studyActions(vca5, r5.want).actions[0].count, shared + own5);
});

test('documents asked for open the shelf of a course from any year', () => {
  // biochem-1 (year 1) has questions and documents and nothing else. From
  // year 5, "เอกสาร biochem" got no card: practice was closed and the
  // document count was not known when the card was decided.
  const r = intent('เอกสาร biochem', 5);
  const main = r?.subjects.find((s) => s.meta.id === 'biochem-1');
  assert.ok(main, 'the card is there');
  assert.equal(studyActions(main, r.want, null).actions[0]?.target, 'library');
});

test('practice asked for in another year says which year even with nothing else to open', () => {
  const r = intent('ข้อสอบ biochem', 5);
  const main = r?.subjects.find((s) => s.meta.id === 'biochem-1');
  assert.ok(main, 'the course is kept so the card can say where its questions are');
  assert.equal(studyActions(main, r.want, null).missing, 'ข้อสอบวิชานี้อยู่ในชั้นปี 1 เปลี่ยนเป็นชั้นปี 1 ก่อนจึงจะฝึกได้');
});

test('a course with nothing behind it is not offered at all', () => {
  // Year-1 anatomy courses with no questions, notes, clips or articles.
  const r = intent('สรุป anatomy ปี 1');
  assert.ok(!r || r.subjects.every((s) => studyActions(s, r.want).actions.length > 0));
});
