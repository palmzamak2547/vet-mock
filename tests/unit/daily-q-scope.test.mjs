// ============================================================
// Daily question: never a hidden topic, and one ✓ per question
// ============================================================
// Two triage items on Home (OV-content-24, OV-tools-41):
//   • pickTodaysQ did not read the curriculum's hidden topics, so the class
//     question could come from a topic the app says does not exist.
//   • the day's record was keyed by date alone, so after switching year the
//     other year's question wore the ✓ and answering it overwrote the record.

import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECTS, hiddenTopicIdsFor, semesterForSubject } from '../../src/data/curriculum.js';
import { SUBJECT_PAPERS } from '../../src/data/exam-papers.generated.js';
import { detectCurrentPhase } from '../../src/lib/current-phase.js';
import { questionInScope, scopeForPhase } from '../../src/lib/exam-scope.js';
import {
  pickTodaysQ, readTodaysQStatus, recordTodaysQAnswer, getDailyQResultForDate, dailyQStreak, todayKey, TODAY_KEY_PREFIX,
} from '../../src/lib/daily-q.js';

const DATE = '2026-10-12';

// A real subject with a real hidden topic, and one of its visible topics.
function hiddenCase() {
  for (const s of SUBJECTS) {
    const hidden = (s.topics || []).find((t) => t?.hidden);
    const visible = (s.topics || []).find((t) => t && !t.hidden);
    if (hidden && visible) return { subject: s.id, hidden: hidden.id, visible: visible.id };
  }
  return null;
}

const mcq = (subject, topic, id) => ({
  id, subject, topic, type: 'mcq', q: `stem ${id}`, options: ['a', 'b', 'c', 'd'], answer: 0,
});

test('the daily question never comes from a hidden topic', () => {
  const found = hiddenCase();
  assert.ok(found, 'the curriculum carries at least one hidden topic beside a visible one');
  assert.ok(hiddenTopicIdsFor(found.subject).has(found.hidden), 'the fixture topic is hidden');
  // Nine hidden-topic questions around one visible one: date hashing lands on
  // a hidden index far more often than not if the filter is missing.
  const bank = [...Array.from({ length: 9 }, (_, i) => mcq(found.subject, found.hidden, 100 + i)), mcq(found.subject, found.visible, 500)];
  for (let day = 1; day <= 28; day++) {
    const q = pickTodaysQ(bank, `2026-10-${String(day).padStart(2, '0')}`);
    assert.ok(q, `day ${day}: a visible question exists, so one is picked`);
    assert.equal(q.topic, found.visible, `day ${day}: picked a hidden topic`);
  }
  // Only hidden questions: nothing to show, rather than a question the app hides elsewhere.
  assert.equal(pickTodaysQ(bank.slice(0, 9), DATE), null);
});

test('in the final weeks the daily question never comes from a midterm topic', () => {
  // swine-gi-viral was taught before Vet 86's midterm, swine-asf after it.
  const bank = [...Array.from({ length: 9 }, (_, i) => mcq('swine-clinic', 'swine-gi-viral', 200 + i)), mcq('swine-clinic', 'swine-asf', 700)];
  for (let day = 10; day <= 22; day++) {
    const q = pickTodaysQ(bank, `2026-11-${day}`, { year: 5 });
    assert.equal(q?.topic, 'swine-asf', `11-${day}: picked a midterm topic in the final weeks`);
  }
  // Before the midterm the same bank serves its midterm topic.
  const sept = new Set(Array.from({ length: 10 }, (_, i) => pickTodaysQ(bank, `2026-09-${String(i + 1).padStart(2, '0')}`, { year: 5 })?.topic));
  assert.ok(sept.has('swine-gi-viral'), 'the midterm weeks still draw midterm topics');
});

test('over the real bank, every day of the Year-5 final weeks picks a course that sits that paper', async () => {
  // A swine-only bank could not show it: questions of unknown scope were kept,
  // and nothing asked whether the course sits this paper or is taught this
  // term, so VCA practice and term-2 courses filled most November days.
  const { QB, loadQB } = await import('../../src/data/questions.js');
  await loadQB();
  const { isQuestionDeliverable } = await import('../../src/data/question-delivery.generated.js');
  const bank = QB.filter(isQuestionDeliverable);
  let checked = 0;
  for (let d = new Date('2026-09-26T00:00:00Z'); d <= new Date('2026-12-04T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1)) {
    const day = d.toISOString().slice(0, 10);
    const phase = detectCurrentPhase(new Date(`${day}T12:00:00+07:00`), 5);
    if (scopeForPhase(phase) !== 'final') continue;
    const q = pickTodaysQ(bank, day, { year: 5 });
    assert.ok(q, `${day}: the final has questions, so one is picked`);
    const sits = SUBJECT_PAPERS[q.subject];
    assert.ok(sits === 'final' || sits === 'both', `${day}: ${q.subject} sits no final`);
    assert.equal(semesterForSubject(q.subject), 1, `${day}: ${q.subject} is not taught this term`);
    assert.ok(questionInScope(q, 'final'), `${day}: ${q.subject}:${q.id} is not on the final`);
    // One question for the whole class, whatever order the bank loaded in.
    assert.equal(pickTodaysQ([...bank].reverse(), day, { year: 5 }), q, `${day}: the pick depends on bank order`);
    checked += 1;
  }
  assert.ok(checked >= 30, `the final weeks were walked (${checked} days)`);
});

test('a paper whose only questions sit in a hidden topic falls back to the year, not to nothing', () => {
  // No hidden topic of this term sits a paper today, so the lookup is handed
  // in: swine-asf (a final topic) hidden, swine-gi-viral (midterm) visible.
  const hiddenTopics = (subject) => new Set(subject === 'swine-clinic' ? ['swine-asf'] : []);
  const hidden = mcq('swine-clinic', 'swine-asf', 300);
  const elsewhere = mcq('swine-clinic', 'swine-gi-viral', 301);
  for (let day = 10; day <= 22; day++) {
    const q = pickTodaysQ([hidden, elsewhere], `2026-11-${day}`, { year: 5, hiddenTopics });
    assert.equal(q?.id, 301, `11-${day}: the hidden question's paper emptied the pool`);
  }
});

// ── A localStorage the module can sweep ───────────────────────────────
function fakeStorage() {
  const map = new Map();
  return {
    get length() { return map.size; },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    clear: () => map.clear(),
  };
}

function withStorage(t) {
  const storage = fakeStorage();
  const had = globalThis.window;
  globalThis.window = { localStorage: storage };
  t.after(() => { if (had === undefined) delete globalThis.window; else globalThis.window = had; });
  return storage;
}

test('the ✓ belongs to the question that was answered, not to the day', (t) => {
  withStorage(t);
  const year4 = { subject: 'com4', id: 1 };
  const year5 = { subject: 'epidemiology', id: 9 };

  recordTodaysQAnswer({ qSubject: year4.subject, qId: year4.id, choice: 0, correct: true, dateStr: DATE });
  assert.equal(readTodaysQStatus(DATE, year4).completed, true, 'the answered question is done');
  assert.equal(readTodaysQStatus(DATE, year5).completed, false, 'the other year\'s question shows no ✓');
  // The plain day record still says the day was done, for the streak.
  assert.equal(readTodaysQStatus(DATE).completed, true);
  assert.equal(readTodaysQStatus(DATE).qSubject, 'com4');

  // Answering the year-5 question keeps the first answer of the day on the
  // day record (streak and history read it) and records its own answer.
  recordTodaysQAnswer({ qSubject: year5.subject, qId: year5.id, choice: 2, correct: false, dateStr: DATE });
  const day = readTodaysQStatus(DATE);
  assert.equal(day.qSubject, 'com4', 'the day record was not overwritten');
  assert.equal(day.correct, true);
  assert.equal(getDailyQResultForDate(DATE), 'correct');
  const five = readTodaysQStatus(DATE, year5);
  assert.equal(five.completed, true);
  assert.equal(five.correct, false);
  assert.equal(five.choice, 2);
  const four = readTodaysQStatus(DATE, year4);
  assert.equal(four.completed, true);
  assert.equal(four.correct, true);
  // Ids compare as text: a bank id of "1" and a stored 1 are the same question.
  assert.equal(readTodaysQStatus(DATE, { subject: 'com4', id: '1' }).completed, true);
});

test('a record written before per-question entries still marks its own question, and only its own', (t) => {
  const storage = withStorage(t);
  storage.setItem(TODAY_KEY_PREFIX + DATE, JSON.stringify({ qSubject: 'com4', qId: 1, choice: 0, correct: true, ts: 1 }));
  assert.equal(readTodaysQStatus(DATE, { subject: 'com4', id: 1 }).completed, true);
  assert.equal(readTodaysQStatus(DATE, { subject: 'epidemiology', id: 9 }).completed, false);
  assert.equal(readTodaysQStatus(DATE).completed, true);
  // Answering the same question again is one record, not a second one.
  recordTodaysQAnswer({ qSubject: 'com4', qId: 1, choice: 1, correct: false, dateStr: DATE });
  assert.equal(readTodaysQStatus(DATE).qSubject, 'com4');
  assert.equal(readTodaysQStatus(DATE, { subject: 'com4', id: 1 }).choice, 1);
});

test('the streak counts a day with any answer, as before', (t) => {
  withStorage(t);
  const today = todayKey();
  recordTodaysQAnswer({ qSubject: 'com4', qId: 1, choice: 0, correct: true, dateStr: today });
  assert.equal(dailyQStreak(), 1);
});
