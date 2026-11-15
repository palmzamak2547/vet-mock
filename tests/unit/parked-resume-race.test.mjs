// Resuming a parked set waits up to 8 s for the banks (so it continues on the current questions),
// and a wait is a window for the student to act. With nothing guarding it: a second tap on ทำต่อ
// landed after the first had timed out and opened the parked copy, and primed the session again
// from the record read at the tap, wiping the answers given meanwhile and swapping the questions;
// a new set started during the wait, or the set discarded during it, was replaced by the parked one.
// src/lib/parked-resume.js now runs one resume at a time and, after the wait, carries on only if
// the student is still on Home with the same parked record (sessionId and savedAt).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSingleFlight, parkedStillCurrent, resumeParkedSet } from '../../src/lib/parked-resume.js';
import { inflightExamKey } from '../../src/lib/exam-recovery.js';

const OWNER = 'u1';
const q = (over = {}) => ({ id: 1, subject: 's', year: 4, type: 'mcq', q: 'stem', options: ['a', 'b'], answer: 0, explain: 'old', ...over });
const record = (over = {}) => ({ ownerId: OWNER, sessionId: 'S1', savedAt: 1000, questions: [q()], answers: { 1: 0 }, ...over });

function memoryStorage(entries = {}) {
  const map = new Map(Object.entries(entries));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k) };
}

// A world with a fake clock and a bank load the test releases by hand.
function world() {
  const storage = memoryStorage({ [inflightExamKey(OWNER)]: JSON.stringify(record()) });
  const timers = [];
  let releaseBank;
  const bankLoaded = new Promise((r) => { releaseBank = r; });
  const state = { view: 'home', bank: [], primed: 0, session: null, busy: [] };
  const deps = {
    read: async () => JSON.parse(storage.getItem(inflightExamKey(OWNER))),
    loadYear: () => bankLoaded,
    bank: () => state.bank,
    stillCurrent: (saved) => state.view === 'home' && parkedStillCurrent(storage, OWNER, saved),
    prime: (saved) => { state.primed++; state.session = { questions: saved.questions, answers: { ...saved.answers } }; return true; },
    apply: () => { state.view = 'exam'; },
    onBusy: (b) => state.busy.push(b),
    timer: (fn) => timers.push(fn),
  };
  const fireTimeout = () => timers.splice(0).forEach((fn) => fn());
  return { storage, state, deps, fireTimeout, releaseBank: () => { state.bank = [q({ explain: 'new' })]; releaseBank(); } };
}
const tick = () => new Promise((r) => setImmediate(r));

test('a second tap joins the first resume: answers given after it opened survive, the questions do not change', async () => {
  const w = world();
  const flight = createSingleFlight();
  const first = flight(() => resumeParkedSet(w.deps));
  await tick();
  const second = flight(() => resumeParkedSet(w.deps)); // tapped again, 2 s in
  assert.equal(second, first, 'one resume at a time');
  w.fireTimeout(); // 8 s: the banks are still loading, the parked copy opens
  assert.equal(await first, 'resumed');
  assert.equal(w.state.primed, 1);
  w.state.session.answers[1] = 1; // the student answers
  const shown = w.state.session.questions;
  w.releaseBank(); // the banks arrive at 10 s
  await tick();
  assert.equal(w.state.primed, 1, 'nothing primes the session again');
  assert.equal(w.state.session.answers[1], 1);
  assert.equal(w.state.session.questions, shown);
  assert.deepEqual(w.state.busy, [true, false], 'busy from the tap until it settled');
});

test('when the banks arrive in time the set opens on the current questions', async () => {
  const w = world();
  const run = resumeParkedSet(w.deps);
  await tick();
  w.releaseBank();
  assert.equal(await run, 'resumed');
  assert.equal(w.state.session.questions[0].explain, 'new');
});

test('a new set started during the wait wins; the parked set does not replace it', async () => {
  const w = world();
  const run = resumeParkedSet(w.deps);
  await tick();
  // The new set's autosave writes its own record (another session) and the view leaves Home.
  w.storage.setItem(inflightExamKey(OWNER), JSON.stringify(record({ sessionId: 'S2', savedAt: 2000 })));
  w.state.view = 'exam';
  w.releaseBank();
  assert.equal(await run, 'stale');
  assert.equal(w.state.primed, 0);
});

test('a set discarded during the wait does not come back', async () => {
  const w = world();
  const run = resumeParkedSet(w.deps);
  await tick();
  w.storage.removeItem(inflightExamKey(OWNER)); // ไม่ทำต่อ
  w.fireTimeout();
  assert.equal(await run, 'stale');
  assert.equal(w.state.primed, 0);
});

test('the same set saved again during the wait (a newer savedAt) is read again, not opened stale', async () => {
  const w = world();
  const run = resumeParkedSet(w.deps);
  await tick();
  w.storage.setItem(inflightExamKey(OWNER), JSON.stringify(record({ savedAt: 1500 })));
  w.fireTimeout();
  assert.equal(await run, 'stale');
});

test('a submitted set opens at once on its parked copy, with no wait', async () => {
  const w = world();
  w.storage.setItem(inflightExamKey(OWNER), JSON.stringify(record({ submitted: true })));
  assert.equal(await resumeParkedSet(w.deps), 'resumed');
  assert.equal(w.state.session.questions[0].explain, 'old');
});
