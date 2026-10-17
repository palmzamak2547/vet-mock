// What the student has answered: repaired on load, mastery by the last answer, streaks by the
// student's own calendar days.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyProgress, normalizeProgress, recordAnswer, recordAnswers, statsFor, wrongKeys, streak, daysToExam, dailyPace,
  progressStore, PROGRESS_KEY,
} from '../../src/lib/progress.js';
import { localDay } from '../../src/lib/dates.js';

test('the store key is the one the pages and the e2e suite read', () => {
  assert.equal(PROGRESS_KEY, 'vca:progress:v1');
  assert.deepEqual(progressStore.get(), emptyProgress());
});

test('normalizeProgress starts over on anything it does not recognise', () => {
  assert.deepEqual(normalizeProgress(null), emptyProgress());
  assert.deepEqual(normalizeProgress('x'), emptyProgress());
  assert.deepEqual(normalizeProgress({ v: 2, q: { a: { d: 'x', n: 1 } } }), emptyProgress());
});

test('normalizeProgress repairs entries one by one', () => {
  const out = normalizeProgress({
    v: 1,
    q: {
      'vca:1': { d: 'swine', n: 3, c: 9, l: 'yes', t: '5' },
      'vca:2': { d: 'swine', n: 0, c: 0, l: 1 },
      'vca:3': { n: 2 },
      'vca:4': null,
      'vca:5': { d: 'equine', n: 2.7, c: -1, l: 0 },
    },
    days: { '2026-10-17': 4, '2026-10-16': 0, 'nope': 3, '2026-10-15': '2' },
    examDate: '2027-01-23',
  });
  assert.deepEqual(out.q, {
    'vca:1': { d: 'swine', n: 3, c: 3, l: 1, t: 5 },
    'vca:5': { d: 'equine', n: 2, c: 0, l: 0, t: 0 },
  });
  assert.deepEqual(out.days, { '2026-10-17': 4, '2026-10-15': 2 });
  assert.equal(out.examDate, '2027-01-23');
  assert.equal(normalizeProgress({ v: 1, examDate: '23/01/2027' }).examDate, null);
});

test('recordAnswer counts attempts, keeps the last result and adds to the day', () => {
  const at = Date.UTC(2026, 9, 17, 5, 0); // midday in Bangkok, morning in UTC: one calendar day in both
  let s = emptyProgress();
  s = recordAnswer(s, { key: 'vca:1', domain: 'swine', correct: false, at });
  s = recordAnswer(s, { key: 'vca:1', domain: 'swine', correct: true, at: at + 1 });
  assert.deepEqual(s.q['vca:1'], { d: 'swine', n: 2, c: 1, l: 1, t: at + 1 });
  assert.deepEqual(s.days, { [localDay(at)]: 2 });
  const before = s;
  recordAnswer(s, { key: 'vca:2', domain: 'swine', correct: true, at });
  assert.deepEqual(before.q['vca:2'], undefined, 'state is never changed in place');
});

test('an answer late at night counts on the student\'s own calendar day', () => {
  const at = Date.UTC(2026, 9, 16, 18, 30); // 01:30 on 17 Oct in Bangkok, 18:30 on 16 Oct in UTC
  const day = Object.keys(recordAnswer(emptyProgress(), { key: 'k', domain: 'd', correct: true, at }).days)[0];
  if (process.env.TZ === 'UTC') assert.equal(day, '2026-10-16');
  else if (process.env.TZ === 'Asia/Bangkok') assert.equal(day, '2026-10-17');
  else assert.equal(day, localDay(at));
});

test('recordAnswers is a fold over recordAnswer', () => {
  const at = Date.UTC(2026, 9, 17, 5, 0);
  const answers = [
    { key: 'a', domain: 'x', correct: true, at },
    { key: 'b', domain: 'y', correct: false, at },
    { key: 'a', domain: 'x', correct: false, at },
  ];
  const s = recordAnswers(emptyProgress(), answers);
  assert.deepEqual(s, answers.reduce(recordAnswer, emptyProgress()));
  assert.equal(s.days[localDay(at)], 3);
});

const state = normalizeProgress({
  v: 1,
  q: {
    'a:1': { d: 'swine', n: 2, c: 1, l: 1, t: 10 },
    'a:2': { d: 'swine', n: 1, c: 0, l: 0, t: 30 },
    'b:1': { d: 'equine', n: 3, c: 1, l: 0, t: 20 },
    'b:2': { d: 'equine', n: 1, c: 1, l: 1, t: 40 },
  },
  days: { '2026-10-15': 3, '2026-10-16': 5 },
});

test('statsFor counts seen, known and wrong by the last answer', () => {
  assert.deepEqual(statsFor(state), { seen: 4, known: 2, wrong: 2, attempts: 7, correct: 3, accuracy: 0.5 });
  assert.deepEqual(statsFor(state, 'swine'), { seen: 2, known: 1, wrong: 1, attempts: 3, correct: 1, accuracy: 0.5 });
  assert.equal(statsFor(state, 'aquatic').accuracy, null);
});

test('wrongKeys lists last-wrong questions, newest first', () => {
  assert.deepEqual(wrongKeys(state), ['a:2', 'b:1']);
  assert.deepEqual(wrongKeys(state, ['equine']), ['b:1']);
  assert.deepEqual(wrongKeys(state, []), []);
});

test('a streak ends today, or yesterday while today is still open', () => {
  assert.equal(streak(state, '2026-10-16'), 2);
  assert.equal(streak(state, '2026-10-17'), 2, 'today not studied yet: the streak still stands');
  assert.equal(streak(state, '2026-10-18'), 0, 'a whole day missed');
  assert.equal(streak({ days: { '2026-12-31': 1, '2027-01-01': 1 } }, '2027-01-01'), 2, 'across the new year');
});

test('days to the exam and the daily pace', () => {
  assert.equal(daysToExam(state, '2026-10-17'), null);
  assert.equal(daysToExam({ ...state, examDate: '2027-01-23' }, '2026-10-17'), 98);
  assert.equal(daysToExam({ ...state, examDate: '2027-01-23' }, '2027-01-23'), 0);
  assert.equal(daysToExam({ ...state, examDate: '2027-01-23' }, '2027-01-24'), -1);
  assert.equal(dailyPace(5783, 98), 60);
  assert.equal(dailyPace(10, 3), 4);
  assert.equal(dailyPace(10, 0), null);
  assert.equal(dailyPace(10, -2), null);
  assert.equal(dailyPace(10, null), null);
});
