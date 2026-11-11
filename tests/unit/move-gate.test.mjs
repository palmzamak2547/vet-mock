// main.jsx loads origin-move.js only when lib/move-gate.js finds work for it. A gate that says null
// where the module would have done something would drop a student's move, so every case below is
// run through both: when the gate says null, the module's three jobs are all no-ops.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  moveWork, dueMoveJobs, countInboxAttempt, startWhenReady, MOVE_JOBS,
  MOVE_INBOX, MOVE_INBOX_ATTEMPTS, MOVE_RECEIVED, NOTICE_MS, MAX_ATTEMPTS, MOVE_WAIT_MS,
} from '../../src/lib/move-gate.js';
import { applyMoveInbox, importMovedRecords, moveNotice } from '../../src/lib/origin-move.js';

const store = (entries) => {
  const m = new Map(Object.entries(entries));
  return {
    get length() { return m.size; },
    key: (i) => [...m.keys()][i] ?? null,
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
  };
};
const NOW = 1_800_000_000_000;
const received = (v) => ({ [MOVE_RECEIVED]: JSON.stringify(v) });

const CASES = [
  ['a fresh browser', {}, null],
  ['an inbox waiting', { [MOVE_INBOX]: JSON.stringify({ fields: {} }) }, 'now'],
  ['an unreadable inbox', { [MOVE_INBOX]: '{oops' }, 'now'],
  ['records still to import', received({ at: NOW - 1000 }), 'later'],
  ['imported, notice due', received({ at: NOW - 1000, idbDone: true }), 'later'],
  ['imported, notice shown', received({ at: NOW - 1000, idbDone: true, shown: true }), null],
  ['imported, notice too old', received({ at: NOW - NOTICE_MS, idbDone: true }), null],
  ['imported, notice from the future', received({ at: NOW + 5000, idbDone: true }), null],
  ['a received record that is not an object', { [MOVE_RECEIVED]: '[1]' }, null],
  ['an unreadable received record', { [MOVE_RECEIVED]: '{oops' }, null],
  ['records whose import failed three boots running', received({ at: NOW - NOTICE_MS - 1, attempts: MAX_ATTEMPTS }), null],
];

test('an inbox whose merge was tried three boots running is left where it is', () => {
  const win = { localStorage: store({ [MOVE_INBOX]: '{"fields":{}}', [MOVE_INBOX_ATTEMPTS]: String(MAX_ATTEMPTS) }) };
  assert.equal(moveWork(win, NOW), null);
  assert.equal(dueMoveJobs(win, NOW).has('inbox'), false);
  win.localStorage.setItem(MOVE_INBOX_ATTEMPTS, String(MAX_ATTEMPTS - 1));
  assert.equal(moveWork(win, NOW), 'now');
  countInboxAttempt(win);
  assert.equal(win.localStorage.getItem(MOVE_INBOX_ATTEMPTS), String(MAX_ATTEMPTS));
  assert.equal(moveWork(win, NOW), null);
  assert.equal(win.localStorage.getItem(MOVE_INBOX), '{"fields":{}}', 'the moved data stays in the inbox');
});

test('a record import counts its tries and stops after the last one, leaving the records', async () => {
  const s = store(received({ at: NOW - 1000 }));
  let reads = 0;
  const failing = { storage: s, readInbox: async () => { reads++; throw new Error('idb refused'); } };
  for (let i = 0; i < MAX_ATTEMPTS; i++) assert.equal((await importMovedRecords(failing)).ok, false);
  assert.equal(reads, MAX_ATTEMPTS);
  assert.equal(JSON.parse(s.getItem(MOVE_RECEIVED)).attempts, MAX_ATTEMPTS);
  assert.equal(dueMoveJobs({ localStorage: s }, NOW).has('records'), false);
  assert.equal((await importMovedRecords(failing)).gaveUp, true);
  assert.equal(reads, MAX_ATTEMPTS, 'a fourth boot does not read IndexedDB again');
});

test('every start-up job has a when and a due test, and the gate answers from the table alone', () => {
  assert.deepEqual(MOVE_JOBS.map((j) => j.id).sort(), ['inbox', 'note', 'notice', 'records']);
  for (const job of MOVE_JOBS) {
    assert.ok(['now', 'later'].includes(job.when), job.id);
    assert.equal(typeof job.due, 'function', job.id);
  }
});

// The boot race: main.jsx starts the app when its waits settle or after MOVE_WAIT_MS, whichever is first.
function fakeTimer() {
  const pending = [];
  return { timer: (fn, ms) => pending.push({ fn, ms }), fire: () => pending.splice(0).forEach((t) => t.fn()), pending };
}

test('startWhenReady: a chunk that stalls starts the app after the wait, and says it was late', async () => {
  const t = fakeTimer();
  let started = 0, late = 0;
  startWhenReady([new Promise(() => {})], () => { started++; }, { onLate: () => { late++; }, timer: t.timer });
  await Promise.resolve();
  assert.equal(started, 0, 'still waiting for the chunk');
  assert.equal(t.pending[0].ms, MOVE_WAIT_MS);
  t.fire();
  assert.equal(started, 1);
  assert.equal(late, 1);
});

test('startWhenReady: a chunk in time starts the app once, and the timer that fires later does nothing', async () => {
  const t = fakeTimer();
  let started = 0, late = 0;
  let arrive;
  startWhenReady([new Promise((r) => { arrive = r; })], () => { started++; }, { onLate: () => { late++; }, timer: t.timer });
  arrive();
  await new Promise(setImmediate);
  assert.equal(started, 1);
  t.fire();
  assert.equal(started, 1);
  assert.equal(late, 0);
});

test('startWhenReady: nothing to wait for starts at once, with no timer', () => {
  const t = fakeTimer();
  let started = 0;
  startWhenReady([], () => { started++; }, { timer: t.timer });
  assert.equal(started, 1);
  assert.equal(t.pending.length, 0);
});

for (const [name, entries, want] of CASES) {
  test(`gate: ${name} -> ${want}`, async () => {
    assert.equal(moveWork({ localStorage: store(entries) }, NOW), want);
    if (want !== null) return;
    // The module has nothing to do either.
    const s = store(entries);
    assert.equal(applyMoveInbox(s).applied, false);
    assert.equal(s.getItem(MOVE_INBOX), null);
    let read = false;
    const r = await importMovedRecords({ storage: s, readInbox: async () => { read = true; return []; } });
    assert.equal(read, false, 'no IndexedDB import was due');
    assert.ok(r.skipped === true || r.gaveUp === true);
    assert.equal(moveNotice(s, NOW), null);
  });
}

test('gate: the old address left a note', () => {
  assert.equal(moveWork({ localStorage: store({}), __vmxMoveNote: 'VetMock ย้ายไปแล้ว' }, NOW), 'later');
});

test('gate: storage that throws means no move work, never a crash', () => {
  const win = {};
  Object.defineProperty(win, 'localStorage', { get() { throw new Error('denied'); } });
  assert.equal(moveWork(win, NOW), null);
  assert.equal(moveWork({ localStorage: { getItem() { throw new Error('denied'); } } }, NOW), null);
});
