// ============================================================
// daily-q-stability.test.mjs — one question, all day, for everyone it claims
// ============================================================
// daily-q.js promises "every student sees the same Q on the same day". It
// picked with `hash(date) % pool.length` and indexed the pool array, so the
// answer depended on two things that are not the date:
//
//   • how much of the lazily-loaded, year-scoped QB happened to be in the
//     array at that moment (switching year appends into the SAME array), so
//     the chip could show a different question later in the same day while
//     the answer already recorded under that date belonged to the old one;
//   • the order the bank chunks resolved in, which differs per network.
//
// The pick is now filtered to the student's year and sorted by a stable key
// first, so it depends only on (year, date).
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import { pickTodaysQ } from '../../src/lib/daily-q.js';
import { SUBJECTS_BY_YEAR } from '../../src/data/curriculum.js';

const DATE = '2026-09-04';

function subjectsFor(year) {
  const list = (SUBJECTS_BY_YEAR[year] || []).filter((s) => s.id !== 'all');
  assert.ok(list.length >= 2, `year ${year} needs real subjects for this test`);
  return list.map((s) => s.id);
}

const mcq = (subject, id) => ({
  id, subject, topic: 't', type: 'mcq', q: `q${id}`,
  options: ['a', 'b', 'c', 'd'], answer: 0,
});

function bankFor(year, count) {
  const subs = subjectsFor(year);
  return Array.from({ length: count }, (_, i) => mcq(subs[i % subs.length], 1000 + i));
}

test('the pick survives the bank growing under it', () => {
  const y5 = bankFor(5, 12);
  const first = pickTodaysQ(y5, DATE, { year: 5 });
  assert.ok(first, 'a year-5 bank must yield a question');

  // The student switches year; loadQBForYear appends into the same array.
  const grown = [...y5, ...bankFor(4, 20)];
  const second = pickTodaysQ(grown, DATE, { year: 5 });
  assert.equal(
    `${second.subject}:${second.id}`,
    `${first.subject}:${first.id}`,
    'the daily question must not change because another year loaded',
  );
});

test('the pick does not depend on the order the chunks arrived in', () => {
  const y5 = bankFor(5, 15);
  const a = pickTodaysQ(y5, DATE, { year: 5 });
  const b = pickTodaysQ([...y5].reverse(), DATE, { year: 5 });
  const c = pickTodaysQ([y5[7], ...y5.slice(0, 7), ...y5.slice(8)], DATE, { year: 5 });
  assert.equal(`${b.subject}:${b.id}`, `${a.subject}:${a.id}`, 'reversed load order changed the question');
  assert.equal(`${c.subject}:${c.id}`, `${a.subject}:${a.id}`, 'a reordered chunk changed the question');
});

test('a different day gives a different question, so the habit loop still works', () => {
  const y5 = bankFor(5, 40);
  const picks = new Set(
    ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05']
      .map((d) => { const q = pickTodaysQ(y5, d, { year: 5 }); return `${q.subject}:${q.id}`; }),
  );
  assert.ok(picks.size >= 3, `five days should not collapse to ${picks.size} question(s)`);
});

test('a year gets a question from its own bank, never another year\'s', () => {
  const mixed = [...bankFor(5, 10), ...bankFor(4, 10)];
  const y4Subjects = new Set(subjectsFor(4));
  const q = pickTodaysQ(mixed, DATE, { year: 4 });
  assert.ok(q, 'a year-4 student must get a year-4 question');
  assert.ok(y4Subjects.has(q.subject), `${q.subject} is not a year-4 subject`);
});

test('no year filter keeps the old whole-bank behaviour for any other caller', () => {
  const y5 = bankFor(5, 6);
  assert.ok(pickTodaysQ(y5, DATE), 'omitting the year must still return a question');
  assert.equal(pickTodaysQ([], DATE, { year: 5 }), null);
  assert.equal(pickTodaysQ(null, DATE, { year: 5 }), null);
});

test('a year with no questions in the bank yields nothing rather than someone else\'s', () => {
  assert.equal(pickTodaysQ(bankFor(5, 8), DATE, { year: 4 }), null);
});
