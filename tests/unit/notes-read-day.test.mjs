// ============================================================
// notes-read-day.test.mjs — NotesView reading credit and search rendering
// ============================================================
// 1. The reading-quest dedupe uses the quest's own day.
//
//    Reading a topic for 10 seconds credits the "read 1 topic" and "read 3
//    topics" quests once per topic per day. NotesView kept its dedupe log
//    under the UTC day (toISOString), while recordQuestEvent credits the
//    quest for quests.js todayKey(), the LOCAL day. In Bangkok (UTC+7) the
//    two disagree from 00:00 to 07:00: a topic re-read after midnight got no
//    credit on the new day until 7 a.m., and a topic read at 06:59 and again
//    at 07:01 counted twice. NotesView now keys the log with the quest's
//    todayKey, so the two days are equal by construction.
//
//    This file pins TZ=Asia/Bangkok itself, so it means the same on a UTC CI
//    runner as on a student's phone (the lesson of ci-runs-in-utc).
//
// The view renders JSX, so the function is lifted out of the source and run
// against a storage shim, the real quests.js and a mocked clock.
// ============================================================

process.env.TZ = 'Asia/Bangkok';

import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/views/NotesView.jsx'), 'utf8').replace(/\r\n/g, '\n');

const at = (iso) => Date.parse(iso);
mock.timers.enable({ apis: ['Date'], now: at('2026-09-23T00:30:00+07:00') });
test.after(() => mock.timers.reset());

// quests.js reads window.localStorage when an event is recorded.
const store = new Map();
const localStorage = {
  get length() { return store.size; },
  key: (i) => Array.from(store.keys())[i] ?? null,
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => { store.set(k, String(v)); },
  removeItem: (k) => { store.delete(k); },
  clear: () => store.clear(),
};
globalThis.window = { localStorage, dispatchEvent: () => true, addEventListener() {}, removeEventListener() {} };

const quests = await import('../../src/lib/quests.js');

/** Every name NotesView imports from quests.js, bound to the real module. */
function questImports() {
  const m = SRC.match(/import \{([^}]+)\} from '\.\.\/lib\/quests\.js';/);
  assert.ok(m, 'NotesView must import from lib/quests.js');
  return Object.fromEntries(m[1].split(',').map((s) => s.trim()).filter(Boolean).map((name) => [name, quests[name]]));
}

function loadMarkTopicReadOnce(storage = localStorage) {
  const start = SRC.indexOf('function markTopicReadOnce(');
  assert.notEqual(start, -1, 'NotesView must still dedupe reading credit in markTopicReadOnce');
  const end = SRC.indexOf('\n}\n', start);
  const key = SRC.match(/const READ_LOG_LS = '([^']+)';/);
  assert.ok(key, 'the dedupe log key must still be a module constant');
  return vm.runInNewContext(`(${SRC.slice(start, end + 2)})`, {
    ...questImports(),
    READ_LOG_LS: key[1],
    localStorage: storage,
    Date, // the mocked clock
    JSON,
  });
}

const READ_LOG = SRC.match(/const READ_LOG_LS = '([^']+)';/)[1];
const loggedDay = () => JSON.parse(store.get(READ_LOG)).day;

test('00:30 in Bangkok: the read is logged under the day the quest counts it for', () => {
  store.clear();
  mock.timers.setTime(at('2026-09-23T00:30:00+07:00'));
  const markTopicReadOnce = loadMarkTopicReadOnce();

  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), true);
  assert.equal(loggedDay(), '2026-09-23', 'the dedupe log used the UTC day (still 22 Sep until 07:00 in Bangkok)');
  assert.equal(typeof quests.todayKey, 'function', 'quests.js must export the day key it credits quests under');
  assert.equal(loggedDay(), quests.todayKey());
});

test('re-reading a topic after local midnight earns the new day\'s credit', () => {
  store.clear();
  const markTopicReadOnce = loadMarkTopicReadOnce();

  mock.timers.setTime(at('2026-09-22T23:00:00+07:00'));
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), true);

  mock.timers.setTime(at('2026-09-23T00:30:00+07:00'));
  assert.equal(
    markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'),
    true,
    'a new local day began at midnight, but the topic stayed "already read" until 07:00',
  );
});

test('06:59 and 07:01 are the same local day, so the topic counts once', () => {
  store.clear();
  const markTopicReadOnce = loadMarkTopicReadOnce();

  mock.timers.setTime(at('2026-09-23T06:59:00+07:00'));
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-fish-biology'), true);

  mock.timers.setTime(at('2026-09-23T07:01:00+07:00'));
  assert.equal(
    markTopicReadOnce('aquatic-clinic', 'aqua-fish-biology'),
    false,
    'the UTC day turned over at 07:00 and credited the same topic twice in one day',
  );
});

test('within one day each topic still counts once, and different topics each count', () => {
  store.clear();
  mock.timers.setTime(at('2026-09-23T10:00:00+07:00'));
  const markTopicReadOnce = loadMarkTopicReadOnce();

  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), true);
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), false);
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-fish-biology'), true);
  assert.equal(markTopicReadOnce('zoonoses', 'aqua-intro-thailand'), true, 'the key is subject:topic');
  assert.deepEqual(JSON.parse(store.get(READ_LOG)).topics, [
    'aquatic-clinic:aqua-intro-thailand',
    'aquatic-clinic:aqua-fish-biology',
    'zoonoses:aqua-intro-thailand',
  ]);
});

test('a log written before this change (same YYYY-MM-DD shape) is still read', () => {
  store.clear();
  mock.timers.setTime(at('2026-09-23T10:00:00+07:00'));
  store.set(READ_LOG, JSON.stringify({ day: '2026-09-23', topics: ['aquatic-clinic:aqua-intro-thailand'] }));
  const markTopicReadOnce = loadMarkTopicReadOnce();
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), false);
});

test('with storage disabled the read is still credited', () => {
  const broken = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('SecurityError'); } };
  const markTopicReadOnce = loadMarkTopicReadOnce(broken);
  assert.equal(markTopicReadOnce('aquatic-clinic', 'aqua-intro-thailand'), true);
});
