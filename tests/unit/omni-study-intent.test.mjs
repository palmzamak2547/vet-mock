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
import { Q_VISIBLE_COUNTS_BY_SUBJECT } from '../../src/data/q-counts.js';

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

test('a course with nothing behind it is not offered at all', () => {
  // Year-1 anatomy courses with no questions, notes, clips or articles.
  const r = intent('สรุป anatomy ปี 1');
  assert.ok(!r || r.subjects.every((s) => studyActions(s, r.want).actions.length > 0));
});

// Another year's course: opening it loads its year's banks (App), so the card
// offers practice from any year at the topic screen's count. A year-5 student
// reviewing COM V (year 4) used to get no practice button and a line telling
// them to switch their year.
test('another year\'s course offers practice at its full count', () => {
  for (const q of ['ข้อสอบ com5', 'com5']) {
    const r = intent(q, 5);
    const main = r?.subjects.find((s) => s.meta.id === 'com5');
    assert.ok(main, q);
    const practice = studyActions(main, r.want).actions.find((a) => a.target === 'practice');
    assert.equal(practice?.count, Q_VISIBLE_COUNTS_BY_SUBJECT.com5, `${q}: practice at the course's count`);
  }
  // VCA, a year-5 course with a bank every year loads, counts the same everywhere.
  for (const year of [1, 4, 5]) {
    const r = intent('ข้อสอบ vca', year);
    const vca = r.subjects.find((s) => s.meta.id === 'vca');
    assert.equal(studyActions(vca, r.want).actions[0].count, Q_VISIBLE_COUNTS_BY_SUBJECT.vca, `year ${year}`);
  }
});

test('documents asked for open the shelf of a course from any year', () => {
  const r = intent('เอกสาร biochem', 5);
  const main = r?.subjects.find((s) => s.meta.id === 'biochem-1');
  assert.ok(main, 'the card is there');
  assert.equal(studyActions(main, r.want, null).actions[0]?.target, 'library');
});

// The card's practice number is what the topic screen it opens shows: the
// course's count, or for a course of the selected year under a chosen period,
// the period's term-and-paper count (as Home's subject cards). The period is
// the selected year's calendar, so another year's course is counted whole
// (5.144.4 review: under เทอม 1 ปลายภาค the card withheld 12 of 22 year-4
// courses from a year-5 student). Checked over every course, year 1-5 and period.
test('the card\'s practice count is what the topic screen shows, for every course, year and period', async () => {
  const { Q_COUNTS_BY_TOPIC_BY_SCOPE } = await import('../../src/data/q-counts.js');
  const { yearForSubject } = await import('../../src/data/curriculum.js');
  const catalog = createStudyCatalog();
  const screenAll = (id, phase, year) => {
    const ownYear = yearForSubject(id) == null || yearForSubject(id) === year;
    const scoped = phase && ownYear ? Q_COUNTS_BY_TOPIC_BY_SCOPE[phase] : null;
    return scoped ? Object.values(scoped[id] || {}).reduce((a, b) => a + b, 0) : catalog.browse({ subject: id }).resources.questions.count;
  };
  const wrong = [];
  for (const year of [1, 2, 3, 4, 5]) {
    for (const phase of [null, '1-mid', '1-final', '2-mid', '2-final']) {
      for (const id of Object.keys(Q_VISIBLE_COUNTS_BY_SUBJECT)) {
        const r = detectStudyIntent(`ข้อสอบ ${id}`, { selectedYear: year, selectedPhase: phase });
        const card = r?.subjects.find((s) => s.meta.id === id);
        if (!card) continue;
        const shown = studyActions(card, r.want).actions.find((a) => a.target === 'practice')?.count || 0;
        const expected = screenAll(id, phase, year);
        if (shown !== expected) wrong.push(`${id} year ${year} ${phase || 'no period'}: card ${shown}, screen ${expected}`);
      }
    }
  }
  assert.deepEqual(wrong, []);
});

test('a course of the selected year outside the chosen period says so', () => {
  // epidemiology (year 5) sits only the final, so it holds nothing for เทอม 1
  // กลางภาค: its topic screen shows no set there, so the card offers none and
  // names the reason. (milk-meat-hygiene was the example until its cleaning
  // topic joined the final in 5.167.1.)
  for (const [q, id, year, phase] of [['ข้อสอบ epidemiology', 'epidemiology', 5, '1-mid'], ['ข้อสอบ com5', 'com5', 4, '1-final']]) {
    const r = detectStudyIntent(q, { selectedYear: year, selectedPhase: phase });
    const main = r?.subjects.find((s) => s.meta.id === id);
    assert.ok(main, `${id}: the course keeps its card`);
    const { actions, missing } = studyActions(main, r.want, null);
    assert.ok(!actions.some((a) => a.target === 'practice'), id);
    assert.equal(missing, 'ข้อสอบวิชานี้ไม่อยู่ในช่วงสอบที่เลือก เปลี่ยนช่วงสอบก่อนจึงจะฝึกได้', id);
  }
});

test('another year\'s course is offered whole under any period', () => {
  // The period is the selected year's calendar. biochem-1 (year 1, term 2) and
  // COM V (year 4, term 2) from year 5 under เทอม 1 ปลายภาค: 5.144.4 named the
  // period and offered no practice, though the student asked for the course.
  for (const [q, id] of [['ข้อสอบ biochem', 'biochem-1'], ['ข้อสอบ com5', 'com5']]) {
    for (const phase of ['1-mid', '1-final', '2-mid', '2-final']) {
      const r = detectStudyIntent(q, { selectedYear: 5, selectedPhase: phase });
      const main = r?.subjects.find((s) => s.meta.id === id);
      const practice = studyActions(main, r.want, null).actions.find((a) => a.target === 'practice');
      assert.equal(practice?.count, Q_VISIBLE_COUNTS_BY_SUBJECT[id], `${id} under ${phase}`);
    }
  }
});
