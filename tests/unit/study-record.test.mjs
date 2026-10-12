// ============================================================
// study-record.js — the student's own record, pinned
// ============================================================
// The profile hub and Home's rhythm strip both read these helpers, so one
// wrong day boundary would show up as two surfaces disagreeing. `now` is
// always passed, so nothing here depends on the clock the test runs under.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  weekTrack, recentSessions, sessionWhen, subjectsStarted, classRowLabel, shortThaiDay, rowTime,
} from '../../src/lib/study-record.js';
import { topicProgressKey } from '../../src/lib/study-progress.js';

const H = 60 * 60 * 1000;
const D = 24 * H;
// A Monday, 13:00 local, so day arithmetic crosses no month boundary.
const NOW = new Date(2026, 9, 12, 13, 0, 0).getTime();

test('weekTrack: seven local days ending today, with answers counted per day', () => {
  const history = [
    { date: NOW - 2 * H, subject: 'a', correct: true },           // today
    { date: NOW - 1 * H, subject: 'a', correct: false },          // today
    { date: NOW - 3 * D, subject: 'b', correct: true },           // three days ago
    { date: new Date(NOW - 6 * D).toISOString(), subject: 'b' },  // ISO string, six days ago
    { date: NOW - 9 * D, subject: 'b', correct: true },           // outside the week
    { subject: 'c', correct: true },                              // undated: ignored
    { date: 'not a date', subject: 'c' },                         // unreadable: ignored
    null,
  ];
  const track = weekTrack(history, NOW);
  assert.equal(track.length, 7);
  assert.equal(track[6].isToday, true);
  assert.equal(track.filter((d) => d.isToday).length, 1);
  assert.deepEqual(track.map((d) => d.count), [1, 0, 0, 1, 0, 0, 2]);
  assert.deepEqual(track.map((d) => d.studied), [true, false, false, true, false, false, true]);
  assert.equal(track[6].date, '2026-10-12');
  assert.equal(track[0].date, '2026-10-06');
  assert.deepEqual(track.map((d) => d.dowLabel), ['อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา', 'จ']);
});

test('weekTrack: no history gives seven empty days, never a throw', () => {
  for (const input of [undefined, null, [], {}, 'x']) {
    const track = weekTrack(input, NOW);
    assert.equal(track.length, 7);
    assert.ok(track.every((d) => d.count === 0 && d.studied === false));
  }
});

test('recentSessions: answers in one subject with short gaps are one session; a subject change or a pause starts another', () => {
  const t0 = NOW - 5 * H;
  const history = [
    { date: t0, subject: 'epi', correct: true },
    { date: t0 + 30_000, subject: 'epi', correct: false },
    { date: t0 + 60_000, subject: 'epi', correct: true },
    { date: t0 + 2 * H, subject: 'epi', correct: true },             // 2h pause: a new session
    { date: t0 + 2 * H + 40_000, subject: 'zoo', correct: true },    // subject change: a new session
    { date: t0 + 2 * H + 80_000, subject: 'zoo', correct: true },
    { subject: 'zoo', correct: true },                               // undated: ignored
    { date: t0 + 3 * H, correct: true },                             // no subject: ignored
  ];
  const sessions = recentSessions(history, { limit: 10 });
  assert.deepEqual(sessions.map((s) => [s.subject, s.total, s.correct]), [
    ['zoo', 2, 2],
    ['epi', 1, 1],
    ['epi', 3, 2],
  ]);
  assert.equal(sessions[0].startedAt, t0 + 2 * H + 40_000);
  assert.equal(sessions[2].endedAt, t0 + 60_000);
  // Row order in storage does not matter: two synced devices interleave rows.
  const shuffled = [...history].reverse();
  assert.deepEqual(recentSessions(shuffled, { limit: 10 }).map((s) => s.total), [2, 1, 3]);
  assert.equal(recentSessions(history, { limit: 2 }).length, 2);
  assert.deepEqual(recentSessions([]), []);
  assert.deepEqual(recentSessions(null), []);
});

test('recentSessions: one graded set is one session even across subjects (every row shares the set time)', () => {
  // App writes every row of a set with the set's completion time; a mixed
  // set used to split into one fake 1-question session per subject run.
  const t = NOW - 60_000;
  const set = ['zoonoses', 'com4', 'zoonoses', 'repro-lect', 'com4', 'zoonoses', 'com4', 'epidemiology', 'com4', 'zoonoses']
    .map((subject, i) => ({ date: t, subject, correct: i % 2 === 0 }));
  const sessions = recentSessions(set, { limit: 10 });
  assert.equal(sessions.length, 1, 'one set, one row');
  assert.equal(sessions[0].total, 10);
  assert.equal(sessions[0].correct, 5);
  assert.equal(sessions[0].subject, 'all', 'a set across subjects is named as many subjects');
  // A one-subject set keeps its subject; an earlier set stays its own session.
  const earlier = [1, 2, 3].map(() => ({ date: t - 3 * 3600_000, subject: 'com4', correct: true }));
  const two = recentSessions([...earlier, ...set.map((r) => ({ ...r, subject: 'zoonoses' }))], { limit: 10 });
  assert.deepEqual(two.map((s) => [s.subject, s.total]), [['zoonoses', 10], ['com4', 3]]);
});

test('sessionWhen: today and yesterday by name, older by day', () => {
  assert.equal(sessionWhen(NOW - 20 * 60_000, NOW), 'วันนี้ 12:40');
  assert.equal(sessionWhen(NOW - D + 5 * H, NOW), 'เมื่อวาน 18:00');
  // 02:00 is still "today" on the local calendar, not "yesterday".
  const twoAm = new Date(2026, 9, 12, 2, 0).getTime();
  assert.equal(sessionWhen(twoAm, NOW), 'วันนี้ 02:00');
  assert.equal(sessionWhen(NOW - 3 * D, NOW), 'ศุกร์ 9 ต.ค.');
  assert.equal(sessionWhen('garbage', NOW), '');
  assert.equal(shortThaiDay(NOW), 'จันทร์ 12 ต.ค.');
});

test('subjectsStarted: a subject counts as started with one read topic, and only subjects with topics count', () => {
  const subjects = [
    { id: 'epi', topics: [{ id: 't1' }, { id: 't2' }] },
    { id: 'zoo', topics: [{ id: 't1' }, { id: 't9', hidden: true }] },
    { id: 'none', topics: [] },
    { id: 'hidden-only', topics: [{ id: 'h', hidden: true }] },
  ];
  const checklist = { [topicProgressKey('epi', 't1')]: 1700000000000, [topicProgressKey('zoo', 't9')]: true };
  // zoo's only read topic is hidden, so zoo has not started.
  assert.deepEqual(subjectsStarted(checklist, subjects), { started: 1, total: 2 });
  assert.deepEqual(subjectsStarted({}, subjects), { started: 0, total: 2 });
  assert.deepEqual(subjectsStarted(undefined, undefined), { started: 0, total: 0 });
});

test('classRowLabel: in session, today, tomorrow and a later weekday read as Home prints them', () => {
  const cls = { title: 'VET EPIDEM', start: '10:00', dayOffset: 0, dow: 1 };
  assert.equal(classRowLabel(cls, null), '10:00 น. VET EPIDEM');
  assert.equal(classRowLabel(cls, { title: 'VET EPIDEM' }), 'กำลังเรียน VET EPIDEM');
  assert.equal(classRowLabel({ ...cls, dayOffset: 1 }, null), 'พรุ่งนี้ 10:00 น. VET EPIDEM');
  assert.equal(classRowLabel({ ...cls, dayOffset: 3, dow: 4 }, null), 'วันพฤหัส 10:00 น. VET EPIDEM');
  assert.equal(classRowLabel({ ...cls, title: 'A very long class title indeed' }, null, (s) => s.slice(0, 6)), '10:00 น. A very');
  assert.equal(classRowLabel(null, null), '');
});

test('rowTime: timestamps and ISO strings read, nothing else does', () => {
  assert.equal(rowTime(NOW), NOW);
  assert.equal(rowTime(new Date(NOW).toISOString()), NOW);
  assert.equal(rowTime(undefined), null);
  assert.equal(rowTime(''), null);
  assert.equal(rowTime('soon'), null);
});
