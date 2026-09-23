// ============================================================
// user-data-sync-concurrency.test.mjs — two devices, one account
// ============================================================
// Every flush re-reads the row, rebases its own edits onto it, and writes the
// result back. Before the write was conditional, two devices whose read-to-
// write windows overlapped both read the same row, and the second write
// replaced the first: a note added on the laptop vanished from the account
// while a bookmark from the phone landed, and BOTH devices had already said
// "synced". The next page load pulled the row without the note and it was
// gone from the laptop too.
//
// The write is now a compare-and-set on user_data.updated_at (see
// src/lib/user-data-cas.js). The server below models exactly that: a push
// carrying a precondition only lands when the row is still the one that was
// read, otherwise it answers SYNC_CONFLICT and the device re-reads, rebases
// and tries again. A push without a precondition is the old unconditional
// upsert, which is what the engine sent before the fix.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { createUserDataSync } from '../../src/lib/user-data-sync.js';

class MemoryStorage {
  values = new Map();
  get length() { return this.values.size; }
  key(i) { return [...this.values.keys()][i] ?? null; }
  getItem(k) { return this.values.get(k) ?? null; }
  setItem(k, v) { this.values.set(k, String(v)); }
  removeItem(k) { this.values.delete(k); }
}
const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));
const settle = (ms = 30) => new Promise((r) => setTimeout(r, ms));
/** Polls instead of sleeping a fixed time, so a slow machine waits longer
 *  rather than asserting on a race that has not finished yet. */
async function until(predicate, timeoutMs = 3000) {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeoutMs) return false;
    await settle(5);
  }
  return true;
}
// Retries fire in milliseconds instead of 1.5-30 s.
const fastScheduler = { setTimeout: (fn, d) => setTimeout(fn, Math.min(d, 5)), clearTimeout: (id) => clearTimeout(id) };

/** A server with compare-and-set on updated_at, as pushUserData gives
 *  PostgREST once the engine passes a precondition. `holdPulls(n)` releases
 *  the next n pulls together, so both devices read the same row before either
 *  writes. */
function casServer(initial) {
  let row = initial ? { ...clone(initial), updated_at: 't0' } : null;
  let seq = 0;
  let held = 0; let waiting = [];
  let loseResponseAfterCommit = 0;
  const commits = []; const conflicts = [];
  return {
    commits, conflicts,
    get row() { return clone(row); },
    holdPulls(n) { held = n; },
    loseNextResponses(n = 1) { loseResponseAfterCommit = n; },
    async pull() {
      const snapshot = clone(row);
      if (held > 0) {
        await new Promise((resolve) => {
          waiting.push(resolve);
          if (waiting.length >= held) { held = 0; const w = waiting; waiting = []; w.forEach((f) => f()); }
        });
      }
      return snapshot;
    },
    async push(userId, payload, pre) {
      await Promise.resolve();
      const current = row?.updated_at ?? null;
      // No precondition = the old unconditional upsert.
      const ok = !pre || (pre.rowExists ? row !== null && current === pre.expectedUpdatedAt : row === null);
      if (!ok) {
        conflicts.push(userId);
        throw Object.assign(new Error('conflict'), { code: 'SYNC_CONFLICT' });
      }
      row = { user_id: userId, ...clone(payload), updated_at: `t${++seq}` };
      commits.push(clone(payload));
      if (loseResponseAfterCommit > 0) { loseResponseAfterCommit -= 1; throw new Error('network: response lost after commit'); }
      return { ok: true, updatedAt: row.updated_at };
    },
  };
}

function device(server, storage = new MemoryStorage()) {
  const store = createUserDataSync({ storage, remote: server, debounceMs: 60_000, scheduler: fastScheduler });
  store.send({ type: 'SESSION_CHANGED', userId: 'same-owner' });
  return { store, storage };
}
const phase = (d) => d.store.getSnapshot().sync.phase;
const change = (d, derive) => d.store.send({ type: 'CHANGE', principalId: 'same-owner', derive });
const flushBoth = (a, b) => { a.store.send({ type: 'REFRESH_REQUESTED' }); b.store.send({ type: 'REFRESH_REQUESTED' }); };
async function reopen(server, storage) {
  const d = device(server, storage);
  await until(() => phase(d) === 'synced');
  return d;
}

async function race(initial, editA, editB, { lose = 0 } = {}) {
  const server = casServer(initial);
  const a = device(server); const b = device(server);
  await until(() => phase(a) === 'synced' && phase(b) === 'synced');
  change(a, editA); change(b, editB);
  server.holdPulls(2);
  if (lose) server.loseNextResponses(lose);
  flushBoth(a, b);
  await settle(20);
  await until(() => phase(a) === 'synced' && phase(b) === 'synced');
  return { server, a, b };
}

test('different fields: both acknowledged edits survive overlapping flushes', async () => {
  const { server, a, b } = await race({ bookmarks: [], notes: {} },
    (c) => ({ notes: { ...c.notes, fromA: 'saved' } }),
    (c) => ({ bookmarks: [...c.bookmarks, 'fromB'] }));
  assert.equal(server.row.notes.fromA, 'saved', 'the laptop note was replaced by the phone write');
  assert.deepEqual(server.row.bookmarks, ['fromB']);
  assert.ok(server.conflicts.length >= 1, 'the overlap was real');
  assert.equal(phase(a), 'synced');
  assert.equal(phase(b), 'synced');
  assert.equal(a.store.getSnapshot().sync.error, null, 'a lost race is not an error banner');
  assert.equal(b.store.getSnapshot().sync.error, null, 'a lost race is not an error banner');
  a.store.close(); b.store.close();
  const ra = await reopen(server, a.storage);
  assert.equal(ra.store.getSnapshot().data.notes.fromA, 'saved');
  assert.deepEqual(ra.store.getSnapshot().data.bookmarks, ['fromB']);
  ra.store.close();
});

test('same field, different keys: both notes survive', async () => {
  const { server, a, b } = await race({ notes: { base: 'x' } },
    (c) => ({ notes: { ...c.notes, k1: 'A' } }),
    (c) => ({ notes: { ...c.notes, k2: 'B' } }));
  assert.deepEqual(server.row.notes, { base: 'x', k1: 'A', k2: 'B' });
  a.store.close(); b.store.close();
});

test('delete on one device, edit of another key on the other', async () => {
  const { server, a, b } = await race({ notes: { k1: 'v', k2: 'v' } },
    (c) => { const n = { ...c.notes }; delete n.k1; return { notes: n }; },
    (c) => ({ notes: { ...c.notes, k2: 'edited' } }));
  assert.deepEqual(server.row.notes, { k2: 'edited' });
  a.store.close(); b.store.close();
});

test('delete versus edit of the same key converges on both devices', async () => {
  const { server, a, b } = await race({ notes: { k1: 'v', other: 'keep' } },
    (c) => { const n = { ...c.notes }; delete n.k1; return { notes: n }; },
    (c) => ({ notes: { ...c.notes, k1: 'edited' } }));
  assert.equal(server.row.notes.other, 'keep');
  a.store.close(); b.store.close();
  const ra = await reopen(server, a.storage); const rb = await reopen(server, b.storage);
  assert.deepEqual(ra.store.getSnapshot().data.notes, server.row.notes);
  assert.deepEqual(rb.store.getSnapshot().data.notes, server.row.notes);
  ra.store.close(); rb.store.close();
});

test('both devices append history: union, no duplicates', async () => {
  const h = (id) => ({ questionId: id, date: '2026-09-23', subject: 'eq', correct: true });
  const { server, a, b } = await race({ history: [h('q0')] },
    (c) => ({ history: [...c.history, h('qA')] }),
    (c) => ({ history: [...c.history, h('qB')] }));
  assert.deepEqual(server.row.history.map((x) => x.questionId).sort(), ['q0', 'qA', 'qB']);
  a.store.close(); b.store.close();
});

test('a commit whose response is lost is retried without duplication or loss', async () => {
  const h = (id) => ({ questionId: id, date: '2026-09-23', subject: 'eq', correct: true });
  const { server, a, b } = await race({ history: [], notes: {} },
    (c) => ({ history: [...c.history, h('qA')], notes: { ...c.notes, a: 1 } }),
    (c) => ({ history: [...c.history, h('qB')] }),
    { lose: 1 });
  assert.deepEqual(server.row.history.map((x) => x.questionId).sort(), ['qA', 'qB']);
  assert.equal(server.row.notes.a, 1);
  assert.equal(phase(a), 'synced');
  assert.equal(phase(b), 'synced');
  a.store.close(); b.store.close();
});

test('closing both devices mid-race loses nothing once they reopen', async () => {
  const server = casServer({ bookmarks: [], notes: {} });
  const a = device(server); const b = device(server);
  await until(() => phase(a) === 'synced' && phase(b) === 'synced');
  change(a, (c) => ({ notes: { ...c.notes, fromA: 'saved' } }));
  change(b, (c) => ({ bookmarks: [...c.bookmarks, 'fromB'] }));
  server.holdPulls(2);
  flushBoth(a, b);
  await settle(5);
  a.store.close(); b.store.close();       // before any retry could run
  const ra = await reopen(server, a.storage); const rb = await reopen(server, b.storage);
  ra.store.send({ type: 'REFRESH_REQUESTED' }); rb.store.send({ type: 'REFRESH_REQUESTED' });
  await settle(20);
  await until(() => phase(ra) === 'synced' && phase(rb) === 'synced');
  assert.equal(server.row.notes.fromA, 'saved');
  assert.deepEqual(server.row.bookmarks, ['fromB']);
  ra.store.close(); rb.store.close();
});

test('first write for a new account: two devices racing to create the row', async () => {
  const { server, a, b } = await race(null,
    (c) => ({ notes: { ...c.notes, fromA: 'saved' } }),
    (c) => ({ bookmarks: [...c.bookmarks, 'fromB'] }));
  assert.equal(server.row.notes.fromA, 'saved');
  assert.deepEqual(server.row.bookmarks, ['fromB']);
  a.store.close(); b.store.close();
});

test('a race that keeps being lost backs off instead of hammering the server, and never shows an error', async () => {
  // A scheduler the test drives by hand, so the requested delays are visible.
  const queue = []; const delays = []; let nextId = 0;
  const scheduler = {
    setTimeout(fn, delay) { const id = ++nextId; queue.push({ id, fn }); delays.push(delay); return id; },
    clearTimeout(id) { const i = queue.findIndex((t) => t.id === id); if (i !== -1) queue.splice(i, 1); },
  };
  const runNext = async () => { const t = queue.shift(); assert.ok(t, 'a retry was scheduled'); t.fn(); await settle(5); };

  const inner = casServer({ notes: {} });
  let conflictsLeft = Infinity;
  const pushes = [];
  const server = {
    pull: (id) => inner.pull(id),
    async push(id, payload, pre) {
      pushes.push(pre);
      if (conflictsLeft > 0) {
        conflictsLeft -= 1;
        throw Object.assign(new Error('conflict'), { code: 'SYNC_CONFLICT' });
      }
      return inner.push(id, payload, pre);
    },
  };
  const storage = new MemoryStorage();
  const store = createUserDataSync({ storage, remote: server, debounceMs: 60_000, scheduler, random: () => 0.5 });
  store.send({ type: 'SESSION_CHANGED', userId: 'same-owner' });
  await settle(10);
  store.send({ type: 'CHANGE', principalId: 'same-owner', derive: (c) => ({ notes: { ...c.notes, kept: 'yes' } }) });
  delays.length = 0;
  store.send({ type: 'REFRESH_REQUESTED' });
  await settle(10);

  for (let i = 0; i < 4; i += 1) {
    const sync = store.getSnapshot().sync;
    assert.equal(sync.phase, 'pending', 'a lost race waits to try again');
    assert.equal(sync.error, null, 'a lost race is not an error banner');
    await runNext();
  }
  // Four quick re-reads, jittered inside 200 ms, then the normal back-off.
  assert.equal(pushes.length, 5);
  assert.ok(pushes.every((pre) => pre && pre.rowExists === true && pre.expectedUpdatedAt === 't0'),
    'every write is conditional on the row that was read');
  assert.deepEqual(delays.slice(0, 4).map((d) => d <= 200), [true, true, true, true]);
  assert.ok(delays[4] >= 1200, `the fifth lost race falls back to the back-off, got ${delays[4]} ms`);
  assert.equal(store.getSnapshot().sync.error, null);
  assert.equal(store.getSnapshot().data.notes.kept, 'yes', 'the edit is still on the device');
  assert.equal(inner.row.notes.kept, undefined, 'and nothing claimed it was written');

  // Once the row stops moving, the edit lands and the streak is forgotten.
  conflictsLeft = 1;
  await runNext();                         // the back-off retry: conflict again
  await runNext();                         // ...and then it lands
  assert.equal(inner.row.notes.kept, 'yes');
  assert.equal(store.getSnapshot().sync.phase, 'synced');

  delays.length = 0;
  conflictsLeft = 1;
  store.send({ type: 'CHANGE', principalId: 'same-owner', derive: (c) => ({ notes: { ...c.notes, later: 'yes' } }) });
  store.send({ type: 'REFRESH_REQUESTED' });
  await settle(10);
  assert.ok(delays.at(-1) <= 200, 'a success resets the streak, so the next lost race retries quickly');
  await runNext();
  assert.equal(inner.row.notes.later, 'yes');
  store.close();
});
