import test from 'node:test';
import assert from 'node:assert/strict';
import { createUserDataSync } from '../../src/lib/user-data-sync.js';

class MemoryStorage {
  values = new Map();

  get length() {
    return this.values.size;
  }

  key(index) {
    return [...this.values.keys()][index] ?? null;
  }

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

function createLifecycle(initialOnline = true) {
  let online = initialOnline;
  const listeners = new Set();
  return {
    isOnline: () => online,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setOnline(next) {
      online = next;
      for (const listener of listeners) listener(next ? 'online' : 'offline');
    },
    emit(reason) {
      for (const listener of listeners) listener(reason);
    },
  };
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function fakeRemote(initialRow) {
  let row = clone(initialRow);
  let pullError = null;
  let pushError = null;
  const pushes = [];
  return {
    pushes,
    get row() {
      return clone(row);
    },
    set row(next) {
      row = clone(next);
    },
    setPullError(error) {
      pullError = error;
    },
    setPushError(error) {
      pushError = error;
    },
    async pull() {
      if (pullError) throw pullError;
      return clone(row);
    },
    async push(userId, payload) {
      pushes.push({ userId, payload: clone(payload) });
      if (pushError) throw pushError;
      row = { user_id: userId, ...clone(payload) };
    },
  };
}

async function settle(ms = 20) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

test('a backup patch is accepted as a whole or leaves every field unchanged', () => {
  const storage = new MemoryStorage();
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote: fakeRemote(null) });
  sync.send({ type: 'CHANGE', principalId: null, derive: () => ({ bookmarks: [1], notes: { old: 'keep' } }) });
  const before = clone(sync.getSnapshot().data);
  const write = storage.setItem.bind(storage);
  storage.setItem = (key, value) => {
    if (key.startsWith('vmx-user-op-v1:')) throw new Error('quota exceeded');
    write(key, value);
  };
  const patch = { bookmarks: [], notes: { restored: 'new' }, readingChecklist: { 'topic:s/t': 100 } };
  const refused = sync.send({ type: 'CHANGE', principalId: null, derive: () => patch });
  assert.equal(refused.accepted, false);
  assert.deepEqual(sync.getSnapshot().data, before);
  storage.setItem = write;
  assert.equal(sync.send({ type: 'CHANGE', principalId: null, derive: () => patch }).accepted, true);
  for (const [key, value] of Object.entries(patch)) assert.deepEqual(sync.getSnapshot().data[key], value);
});

test('failed remote push keeps an offline note durable and retries after reload', async () => {
  const storage = new MemoryStorage();
  const lifecycle = createLifecycle(true);
  const remote = fakeRemote({ notes: { 'com5:101': 'cloud note' } });
  const first = createUserDataSync({
    storage,
    lifecycle,
    remote,
    debounceMs: 0,
    random: () => 0.5,
  });

  first.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  assert.equal(first.getSnapshot().data.notes['com5:101'], 'cloud note');

  remote.setPushError(new Error('offline'));
  first.send({
    type: 'CHANGE',
    derive: (data) => ({
      notes: { ...data.notes, 'com5:101': 'offline edit' },
    }),
  });
  await settle();
  assert.equal(first.getSnapshot().data.notes['com5:101'], 'offline edit');
  assert.equal(first.getSnapshot().sync.pending, true);
  assert.equal(remote.row.notes['com5:101'], 'cloud note');
  first.close();

  remote.setPushError(null);
  const second = createUserDataSync({
    storage,
    lifecycle,
    remote,
    debounceMs: 0,
    random: () => 0.5,
  });
  second.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle(40);

  assert.equal(second.getSnapshot().data.notes['com5:101'], 'offline edit');
  assert.equal(remote.row.notes['com5:101'], 'offline edit');
  assert.equal(second.getSnapshot().sync.pending, false);
  second.close();
});

test('an explicit empty cloud field clears a clean local field', async () => {
  const storage = new MemoryStorage();
  const lifecycle = createLifecycle(true);
  const remote = fakeRemote({ notes: { 'com5:101': 'old' } });
  const first = createUserDataSync({ storage, lifecycle, remote, debounceMs: 0 });

  first.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  assert.deepEqual(first.getSnapshot().data.notes, { 'com5:101': 'old' });
  first.close();

  remote.row = { notes: {} };
  const second = createUserDataSync({ storage, lifecycle, remote, debounceMs: 0 });
  second.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();

  assert.deepEqual(second.getSnapshot().data.notes, {});
  assert.equal(second.getSnapshot().sync.pending, false);
  second.close();
});

test('a failed pull never authorizes a push over unread cloud state', async () => {
  const storage = new MemoryStorage();
  storage.setItem('vmx-notes', JSON.stringify({ 'com5:101': 'local' }));
  const lifecycle = createLifecycle(true);
  const remote = fakeRemote({ notes: { 'com5:101': 'cloud' } });
  remote.setPullError(new Error('network unavailable'));
  const sync = createUserDataSync({
    storage,
    lifecycle,
    remote,
    debounceMs: 0,
    random: () => 0.5,
  });

  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();

  assert.equal(remote.pushes.length, 0);
  assert.equal(sync.getSnapshot().data.notes['com5:101'], 'local');
  assert.equal(sync.getSnapshot().sync.error.code, 'REMOTE_PULL_FAILED');
  sync.close();
});

test('local deletion made offline wins when stale cloud data returns', async () => {
  const storage = new MemoryStorage();
  const lifecycle = createLifecycle(true);
  const remote = fakeRemote({ notes: { 'com5:101': 'delete me' } });
  const first = createUserDataSync({ storage, lifecycle, remote, debounceMs: 0 });

  first.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  remote.setPushError(new Error('offline'));
  first.send({ type: 'CHANGE', derive: () => ({ notes: {} }) });
  await settle();
  first.close();

  remote.setPushError(null);
  const second = createUserDataSync({ storage, lifecycle, remote, debounceMs: 0 });
  second.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle(40);

  assert.deepEqual(second.getSnapshot().data.notes, {});
  assert.deepEqual(remote.row.notes, {});
  second.close();
});

test('an edit made during an in-flight push is sent in a follow-up flush', async () => {
  const storage = new MemoryStorage();
  const lifecycle = createLifecycle(true);
  let row = { notes: { 'com5:101': 'base' } };
  const pushes = [];
  let releaseFirstPush;
  const remote = {
    async pull() {
      return clone(row);
    },
    async push(userId, payload) {
      pushes.push({ userId, payload: clone(payload) });
      if (pushes.length === 1) {
        await new Promise((resolve) => { releaseFirstPush = resolve; });
      }
      row = { user_id: userId, ...clone(payload) };
    },
  };
  const sync = createUserDataSync({ storage, lifecycle, remote, debounceMs: 0 });

  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  sync.send({
    type: 'CHANGE',
    derive: (data) => ({ notes: { ...data.notes, 'com5:101': 'first edit' } }),
  });
  await settle();
  assert.equal(pushes.length, 1);

  sync.send({
    type: 'CHANGE',
    derive: (data) => ({ notes: { ...data.notes, 'com5:101': 'latest edit' } }),
  });
  releaseFirstPush();
  await settle(50);

  assert.equal(pushes.length, 2);
  assert.equal(pushes[1].payload.notes['com5:101'], 'latest edit');
  assert.equal(sync.getSnapshot().sync.pending, false);
  sync.close();
});

test('a note deleted while the push that added it is still in flight stays deleted', async () => {
  // The acknowledgement replayed the outbox record onto the payload it had
  // just sent. That record keeps the base from before the note existed, so
  // after the deletion folded in it no longer mentioned the note at all, and
  // replayed onto a payload that held the note it left the note there: the
  // note came back on screen and the next flush sent it to the account.
  const storage = new MemoryStorage();
  let row = { notes: {}, custom_questions: [] };
  const pushes = [];
  let releaseFirstPush = null;
  const remote = {
    async pull() {
      return clone(row);
    },
    async push(userId, payload) {
      pushes.push(clone(payload));
      if (pushes.length === 1) await new Promise((resolve) => { releaseFirstPush = resolve; });
      row = { user_id: userId, ...clone(payload) };
    },
  };
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(true), remote, debounceMs: 0 });
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();

  sync.send({
    type: 'CHANGE',
    principalId: 'user-1',
    derive: (d) => ({
      notes: { ...d.notes, q1: 'draft' },
      customQuestions: [...d.customQuestions, { id: 'cq-1', q: 'draft question' }],
    }),
  });
  await settle();
  assert.equal(pushes.length, 1, 'the push that adds the note is in flight');
  assert.equal(pushes[0].notes.q1, 'draft');

  sync.send({
    type: 'CHANGE',
    principalId: 'user-1',
    derive: (d) => {
      const notes = { ...d.notes };
      delete notes.q1;
      return { notes, customQuestions: d.customQuestions.filter((q) => q.id !== 'cq-1') };
    },
  });
  assert.equal(sync.getSnapshot().data.notes.q1, undefined);

  releaseFirstPush();
  await settle(60);

  assert.equal(sync.getSnapshot().data.notes.q1, undefined, 'the acknowledgement does not bring the note back');
  assert.deepEqual(sync.getSnapshot().data.customQuestions, [], 'nor the deleted question');
  assert.ok(pushes.length >= 2, 'the deletion is sent after the acknowledgement');
  assert.equal(row.notes.q1, undefined, 'the account no longer has the note');
  assert.deepEqual(row.custom_questions, [], 'nor the question');
  assert.equal(sync.getSnapshot().sync.pending, false);
  sync.close();

  const reopened = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote, debounceMs: 0 });
  reopened.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  assert.equal(reopened.getSnapshot().data.notes.q1, undefined, 'a reload does not bring it back either');
  assert.deepEqual(reopened.getSnapshot().data.customQuestions, []);
  reopened.close();
});

test('a late response from the previous account cannot replace the active account', async () => {
  const storage = new MemoryStorage();
  const lifecycle = createLifecycle(true);
  let releaseUserA;
  const remote = {
    pull(userId) {
      if (userId === 'user-a') {
        return new Promise((resolve) => { releaseUserA = resolve; });
      }
      return Promise.resolve({ notes: { profile: 'user-b data' } });
    },
    async push() {},
  };
  const sync = createUserDataSync({ storage, lifecycle, remote, debounceMs: 0 });

  sync.send({ type: 'SESSION_CHANGED', userId: 'user-a' });
  await settle(5);
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-b' });
  await settle();
  releaseUserA({ notes: { profile: 'user-a data' } });
  await settle();

  assert.equal(sync.getSnapshot().data.notes.profile, 'user-b data');
  sync.close();
});

test('account data stays hidden while signed out and restores offline only for its owner', async () => {
  const storage = new MemoryStorage();
  const onlineLifecycle = createLifecycle(true);
  const remote = fakeRemote({ notes: { private: 'user-a note' } });
  const first = createUserDataSync({
    storage,
    lifecycle: onlineLifecycle,
    remote,
    debounceMs: 0,
  });

  first.send({ type: 'SESSION_CHANGED', userId: 'user-a' });
  await settle();
  assert.equal(first.getSnapshot().data.notes.private, 'user-a note');
  first.close();

  let offlinePulls = 0;
  const offlineLifecycle = createLifecycle(false);
  const second = createUserDataSync({
    storage,
    lifecycle: offlineLifecycle,
    remote: {
      async pull() {
        offlinePulls += 1;
        throw new Error('should not pull while offline');
      },
      async push() {},
    },
    debounceMs: 0,
  });

  assert.deepEqual(second.getSnapshot().data.notes, {});
  second.send({ type: 'SESSION_CHANGED', userId: 'user-a' });
  assert.equal(second.getSnapshot().data.notes.private, 'user-a note');
  assert.equal(second.getSnapshot().sync.phase, 'offline');
  assert.equal(offlinePulls, 0);

  second.send({ type: 'SESSION_CHANGED', userId: null });
  assert.deepEqual(second.getSnapshot().data.notes, {});
  second.close();
});

test('switching accounts hides the previous account before the next pull finishes', async () => {
  const storage = new MemoryStorage();
  const lifecycle = createLifecycle(true);
  let releaseUserB;
  const remote = {
    pull(userId) {
      if (userId === 'user-a') {
        return Promise.resolve({ notes: { private: 'user-a note' } });
      }
      return new Promise((resolve) => { releaseUserB = resolve; });
    },
    async push() {},
  };
  const sync = createUserDataSync({ storage, lifecycle, remote, debounceMs: 0 });

  sync.send({ type: 'SESSION_CHANGED', userId: 'user-a' });
  await settle();
  assert.equal(sync.getSnapshot().data.notes.private, 'user-a note');

  sync.send({ type: 'SESSION_CHANGED', userId: 'user-b' });
  assert.equal(sync.getSnapshot().principalId, 'user-b');
  assert.deepEqual(sync.getSnapshot().data.notes, {});
  const staleChange = sync.send({
    type: 'CHANGE',
    principalId: 'user-a',
    derive: () => ({ notes: { leaked: 'must not write' } }),
  });
  assert.equal(staleChange.accepted, false);
  assert.deepEqual(sync.getSnapshot().data.notes, {});

  releaseUserB({ notes: { private: 'user-b note' } });
  await settle();
  assert.equal(sync.getSnapshot().data.notes.private, 'user-b note');
  sync.close();
});

test('a pre-push rebase preserves unrelated cloud changes from another device', async () => {
  const storage = new MemoryStorage();
  const lifecycle = createLifecycle(true);
  const remote = fakeRemote({
    bookmarks: ['cloud-old'],
    notes: { cloud: 'base' },
  });
  const sync = createUserDataSync({ storage, lifecycle, remote, debounceMs: 0 });

  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  remote.row = {
    bookmarks: ['cloud-new'],
    notes: { cloud: 'base' },
  };

  sync.send({
    type: 'CHANGE',
    derive: (data) => ({
      notes: { ...data.notes, local: 'new note' },
    }),
  });
  await settle(50);

  assert.deepEqual(remote.row.bookmarks, ['cloud-new']);
  assert.deepEqual(remote.row.notes, { cloud: 'base', local: 'new note' });
  assert.deepEqual(sync.getSnapshot().data.bookmarks, ['cloud-new']);
  sync.close();
});

test('two tabs keep both durable operations even if both close before flushing', async () => {
  const storage = new MemoryStorage();
  const lifecycleA = createLifecycle(true);
  const lifecycleB = createLifecycle(true);
  const remote = fakeRemote({ bookmarks: [], notes: {} });
  const tabA = createUserDataSync({
    storage,
    lifecycle: lifecycleA,
    remote,
    debounceMs: 60_000,
  });
  const tabB = createUserDataSync({
    storage,
    lifecycle: lifecycleB,
    remote,
    debounceMs: 60_000,
  });

  tabA.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  tabB.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  tabA.send({
    type: 'CHANGE',
    derive: (data) => ({ notes: { ...data.notes, fromA: 'saved' } }),
  });
  tabB.send({
    type: 'CHANGE',
    derive: (data) => ({ bookmarks: [...data.bookmarks, 'from-b'] }),
  });
  tabA.close();
  tabB.close();
  assert.equal(remote.pushes.length, 0);

  const offlineLifecycle = createLifecycle(false);
  const reopened = createUserDataSync({
    storage,
    lifecycle: offlineLifecycle,
    remote,
    debounceMs: 0,
  });
  reopened.send({ type: 'SESSION_CHANGED', userId: 'user-1' });

  assert.equal(reopened.getSnapshot().data.notes.fromA, 'saved');
  assert.deepEqual(reopened.getSnapshot().data.bookmarks, ['from-b']);
  reopened.close();
});

test('subscription teardown and resubscribe preserves pending work', async () => {
  const storage = new MemoryStorage();
  const lifecycle = createLifecycle(true);
  const remote = fakeRemote({ notes: {} });
  const sync = createUserDataSync({
    storage,
    lifecycle,
    remote,
    debounceMs: 100,
  });
  const unsubscribe = sync.subscribe(() => {});

  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  sync.send({
    type: 'CHANGE',
    derive: (data) => ({ notes: { ...data.notes, strict: 'survives' } }),
  });
  unsubscribe();
  await settle(130);
  assert.equal(remote.pushes.length, 0);

  const unsubscribeAgain = sync.subscribe(() => {});
  await settle(50);
  assert.equal(remote.row.notes.strict, 'survives');
  unsubscribeAgain();
  sync.close();
});

test('anonymous work survives an account round trip without exposing account-only data', async () => {
  const storage = new MemoryStorage();
  const lifecycle = createLifecycle(true);
  const remote = fakeRemote({ notes: { accountOnly: 'private' } });
  const sync = createUserDataSync({ storage, lifecycle, remote, debounceMs: 0 });

  sync.send({
    type: 'CHANGE',
    derive: (data) => ({
      notes: { ...data.notes, guest: 'keep me' },
      history: [...data.history, { id: 'guest-result' }],
    }),
  });
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle(50);
  assert.equal(sync.getSnapshot().data.notes.accountOnly, 'private');
  assert.equal(sync.getSnapshot().data.notes.guest, 'keep me');

  sync.send({ type: 'SESSION_CHANGED', userId: null });
  assert.deepEqual(sync.getSnapshot().data.notes, { guest: 'keep me' });
  assert.deepEqual(sync.getSnapshot().data.history, [{ id: 'guest-result' }]);
  sync.close();
});

test('a signed-out session does not accumulate outbox records across page loads', () => {
  // Regression: the outbox record was keyed by a per-store UUID and the only
  // deletion path ran inside flush(), which returns early without a userId. A
  // guest therefore left one cumulative record — holding `base` AND `value` of
  // the whole dataset — behind on every page load, until localStorage filled
  // and every finished exam was silently discarded.
  const storage = new MemoryStorage();
  const lifecycle = createLifecycle(true);

  for (let session = 0; session < 12; session += 1) {
    const sync = createUserDataSync({ storage, lifecycle, remote: fakeRemote(null), debounceMs: 0 });
    for (let answered = 0; answered < 5; answered += 1) {
      sync.send({
        type: 'CHANGE',
        derive: (data) => ({
          history: [...data.history, { id: `s${session}-q${answered}` }],
        }),
      });
    }
    sync.close();
  }

  const leftover = [...storage.values.keys()].filter((key) => key.includes('user-op'));
  assert.equal(leftover.length, 0, 'guest outbox records must not survive their commit');

  const reopened = createUserDataSync({ storage, lifecycle, remote: fakeRemote(null), debounceMs: 0 });
  assert.equal(reopened.getSnapshot().data.history.length, 60, 'every answer is still there');
  reopened.close();
});

test('a boot whose session has lapsed restores the signed-out workspace instead of an empty app', () => {
  // Regression: the constructor hides account data behind an empty dataset
  // when CURRENT_OWNER_KEY names a user. Because `userId` starts as null, a
  // SESSION_CHANGED(null) — what an expired token produces — matched the
  // "no change" guard and published that empty dataset, so the student saw an
  // app with nothing in it while their work sat in storage.
  const storage = new MemoryStorage();
  const lifecycle = createLifecycle(true);

  const guest = createUserDataSync({ storage, lifecycle, remote: fakeRemote(null), debounceMs: 0 });
  guest.send({ type: 'CHANGE', derive: () => ({ bookmarks: ['guest-1', 'guest-2'] }) });
  guest.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  guest.close();

  // Next launch: storage still names the account, but auth resolves signed-out.
  const lapsed = createUserDataSync({ storage, lifecycle, remote: fakeRemote(null), debounceMs: 0 });
  assert.deepEqual(lapsed.getSnapshot().data.bookmarks, [], 'account data stays hidden until confirmed');
  lapsed.send({ type: 'SESSION_CHANGED', userId: null });
  assert.deepEqual(
    lapsed.getSnapshot().data.bookmarks,
    ['guest-1', 'guest-2'],
    'the signed-out workspace is restored',
  );
  lapsed.close();
});

test('a full disk recovers by reclaiming dead keys instead of refusing forever', () => {
  // The reported symptom: "พื้นที่จัดเก็บในเครื่องไม่พอ" on every action with no
  // way out, because the quota stayed full and nothing ever reclaimed it.
  const storage = new MemoryStorage();
  // Daily questions older than the year the streak can reach, which nothing
  // reads any more.
  for (let d = 1; d <= 60; d += 1) {
    storage.setItem(`vmx-todays-q-2024-01-${String(d).padStart(2, '0')}`, 'x'.repeat(200));
  }
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote: fakeRemote(null) });

  const write = storage.setItem.bind(storage);
  let full = true;
  storage.setItem = (key, value) => {
    if (full && key.startsWith('vmx-user-op-v1:')) {
      const error = new Error('The quota has been exceeded.');
      error.name = 'QuotaExceededError';
      throw error;
    }
    write(key, value);
  };
  // The reclaim pass sweeps the dead daily keys; that is what makes room, so
  // let the retry through once space has actually come back.
  const dailyLeft = () => [...storage.values.keys()].filter((k) => k.startsWith('vmx-todays-q-')).length;
  const origRemove = storage.removeItem.bind(storage);
  storage.removeItem = (key) => { origRemove(key); if (dailyLeft() === 0) full = false; };

  const accepted = sync.send({ type: 'CHANGE', principalId: null, derive: () => ({ bookmarks: [7] }) });
  assert.equal(accepted.accepted, true, 'the write should succeed after reclaiming');
  assert.deepEqual(sync.getSnapshot().data.bookmarks, [7]);
  assert.equal(dailyLeft(), 0, 'the dead daily-question keys should be gone');
});

test('reclaiming never trades a student\u2019s work for space', () => {
  const storage = new MemoryStorage();
  storage.setItem('vmx-todays-q-2020-01-01', 'x'.repeat(100));
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote: fakeRemote(null) });
  sync.send({ type: 'CHANGE', principalId: null, derive: () => ({ notes: { 12: 'my note' } }) });

  const write = storage.setItem.bind(storage);
  let thrown = 0;
  storage.setItem = (key, value) => {
    if (key.startsWith('vmx-user-op-v1:') && thrown < 1) {
      thrown += 1;
      const error = new Error('quota');
      error.name = 'QuotaExceededError';
      throw error;
    }
    write(key, value);
  };
  sync.send({ type: 'CHANGE', principalId: null, derive: () => ({ bookmarks: [1] }) });
  assert.deepEqual(sync.getSnapshot().data.notes, { 12: 'my note' }, 'notes must survive a reclaim');
});

test('an append-only field records a delta, not a second copy of itself', async () => {
  // `history` grows by one row per answer. Storing the previous array
  // alongside the new one put a full copy of it into meta AND the outbox AND
  // the journal — ten copies at the peak of a write.
  const { changeDelta } = await import('../../src/lib/user-data-sync.js');
  const base = [{ id: 1 }, { id: 2 }];
  const value = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const delta = changeDelta(base, value);
  assert.deepEqual(delta.added, ['id:3']);
  assert.deepEqual(delta.removed, []);

  const storage = new MemoryStorage();
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote: fakeRemote(null) });
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  const big = Array.from({ length: 400 }, (_, i) => ({ id: i, pad: 'x'.repeat(60) }));
  sync.send({ type: 'CHANGE', principalId: 'user-1', derive: () => ({ bookmarks: big.map((b) => b.id) }) });
  const meta = JSON.parse(storage.getItem('vmx-user-sync-v1:user-1'));
  assert.ok(meta.dirty.bookmarks, 'bookmarks should be dirty');
  assert.ok(!('base' in meta.dirty.bookmarks) && !('value' in meta.dirty.bookmarks), 'neither copy of the array is stored');
  assert.ok(Array.isArray(meta.dirty.bookmarks.put));
  sync.close();
});

test('clearing a list still deletes it rather than merging it back', () => {
  // This is what `base` existed for. The delta has to preserve it exactly:
  // "ล้างข้อมูลทั้งหมด" must not resurrect from the cloud copy.
  const storage = new MemoryStorage();
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote: fakeRemote(null) });
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  sync.send({ type: 'CHANGE', principalId: 'user-1', derive: () => ({ bookmarks: [1, 2, 3] }) });
  sync.send({ type: 'CHANGE', principalId: 'user-1', derive: () => ({ bookmarks: [] }) });
  const meta = JSON.parse(storage.getItem('vmx-user-sync-v1:user-1'));
  const entry = meta.dirty.bookmarks;
  assert.equal(entry.removed.length, 3, 'all three must be recorded as removed');
  assert.deepEqual(entry.put, [], 'nothing was added on the way to empty');
  sync.close();
});

// ── PF-03: what one small edit writes ─────────────────────────────
// Every edit used to commit the whole study record: a journal holding the full
// snapshot, then the snapshot again, then the changed field. With a long
// history that is several megabytes of JSON per bookmark tap or flashcard
// rating, a dropped frame each time on a phone, and a record that briefly
// existed three times in a nearly full storage.

const never = { setTimeout: () => 0, clearTimeout: () => {} };
const longHistory = (n) => Array.from({ length: n }, (_, i) => ({
  questionId: 1000 + (i % 4000), correct: i % 3 !== 0, date: 1_750_000_000_000 + i * 60_000,
  subject: 'com5', year: 4, phase: '2-final',
}));
const someCards = (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [String(i), {
  questionId: i, easeFactor: 2.5, interval: 3, repetitions: 2, nextReview: 1_750_000_000_000,
  lastReview: 1_749_000_000_000, totalReviews: 4, lapses: 0,
}]));
function recordWrites(storage) {
  const writes = [];
  const realSet = storage.setItem.bind(storage);
  storage.setItem = (key, value) => { writes.push({ key, length: String(value).length }); realSet(key, value); };
  return writes;
}
const tapBookmark = (sync, id, principalId = 'user-1') => sync.send({
  type: 'CHANGE', principalId,
  derive: (d) => ({ bookmarks: d.bookmarks.includes(id) ? d.bookmarks.filter((x) => x !== id) : [...d.bookmarks, id] }),
});
const rateCard = (sync, id, principalId = 'user-1') => sync.send({
  type: 'CHANGE', principalId,
  derive: (d) => ({ srCards: { ...d.srCards, [String(id)]: { ...d.srCards[String(id)], interval: 7 + id } } }),
});

test('a bookmark tap or flashcard rating does not rewrite a 30,000-entry history', async () => {
  const history = longHistory(30_000);
  const historyChars = JSON.stringify(history).length;
  const remote = fakeRemote({ history, sr_cards: someCards(100), bookmarks: [], notes: {} });
  const storage = new MemoryStorage();
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(true), remote, debounceMs: 60_000, scheduler: never });
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  // Hydrating 30,000 entries takes tens of ms here and longer on a busy CI
  // runner; wait for it rather than for a fixed time.
  for (let waited = 0; sync.getSnapshot().sync.phase !== 'synced' && waited < 10_000; waited += 20) await settle(20);
  assert.equal(sync.getSnapshot().data.history.length, 30_000);

  const writes = recordWrites(storage);
  const cost = (edit) => {
    const times = [];
    let largest = 0;
    for (let i = 0; i < 9; i += 1) {
      writes.length = 0;
      const start = performance.now();
      assert.equal(edit(i).accepted, true);
      times.push(performance.now() - start);
      largest = Math.max(largest, ...writes.map((w) => w.length));
    }
    times.sort((a, b) => a - b);
    return { median: times[4], largest };
  };
  const tap = cost((i) => tapBookmark(sync, 500 + i));
  const rating = cost((i) => rateCard(sync, i));

  assert.ok(tap.largest < historyChars / 20, `a bookmark tap wrote ${tap.largest} chars in one key; the history is ${historyChars}`);
  assert.ok(rating.largest < historyChars / 20, `a rating wrote ${rating.largest} chars in one key; the history is ${historyChars}`);
  assert.ok(tap.median < 5, `a bookmark tap took ${tap.median.toFixed(2)} ms`);
  assert.ok(rating.median < 5, `a rating took ${rating.median.toFixed(2)} ms`);
  assert.equal(sync.getSnapshot().data.srCards['8'].interval, 15, 'the edits themselves landed');
  sync.close();
});

/** An idle scheduler the test runs by hand. */
function manualIdle() {
  const queue = [];
  return {
    queue,
    request(fn) { const handle = { fn }; queue.push(handle); return handle; },
    cancel(handle) { const i = queue.indexOf(handle); if (i !== -1) queue.splice(i, 1); },
    run() { for (const handle of queue.splice(0)) handle.fn(); },
  };
}
const snapshotOf = (storage, principal) => JSON.parse(storage.getItem(`vmx-user-data-v1:${principal}`) || 'null');
const outboxKeys = (storage, principal) => [...storage.values.keys()].filter((k) => k.startsWith(`vmx-user-op-v1:${principal}:`));

test('an edit made just before a forced close comes back through outbox replay', async () => {
  const storage = new MemoryStorage();
  const remote = fakeRemote({ bookmarks: [], notes: {} });
  const first = createUserDataSync({ storage, lifecycle: createLifecycle(true), remote, debounceMs: 60_000, scheduler: never, idle: manualIdle() });
  first.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  tapBookmark(first, 42);
  first.send({ type: 'CHANGE', principalId: 'user-1', derive: (d) => ({ notes: { ...d.notes, n: 'kept' } }) });
  // No close, no idle, no flush: the tab is killed here.
  assert.deepEqual(snapshotOf(storage, 'user-1').bookmarks, [], 'the snapshot has not caught up yet');

  const offline = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote, debounceMs: 0, idle: manualIdle() });
  offline.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  assert.deepEqual(offline.getSnapshot().data.bookmarks, [42]);
  assert.equal(offline.getSnapshot().data.notes.n, 'kept');
  assert.equal(offline.getSnapshot().sync.pending, true, 'still waiting to be pushed');
  offline.close();

  const online = createUserDataSync({ storage, lifecycle: createLifecycle(true), remote, debounceMs: 0, idle: manualIdle() });
  online.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle(60);
  assert.deepEqual(remote.row.bookmarks, [42], 'the edit still reaches the account');
  assert.equal(remote.row.notes.n, 'kept');
  assert.equal(online.getSnapshot().sync.pending, false);
  online.close();

  // Signed out, the fields' own keys and the outbox carry it the same way.
  const guestStorage = new MemoryStorage();
  const guest = createUserDataSync({ storage: guestStorage, lifecycle: createLifecycle(true), remote: fakeRemote(null), idle: manualIdle() });
  tapBookmark(guest, 7, null);
  const reopened = createUserDataSync({ storage: guestStorage, lifecycle: createLifecycle(true), remote: fakeRemote(null), idle: manualIdle() });
  assert.deepEqual(reopened.getSnapshot().data.bookmarks, [7]);
  assert.deepEqual(outboxKeys(guestStorage, 'anonymous'), [], 'boot folds the signed-out outbox into the snapshot');
  assert.deepEqual(snapshotOf(guestStorage, 'anonymous').bookmarks, [7]);
  reopened.close();
});

test('the snapshot catches up once per burst, when the page is idle or hidden', () => {
  const storage = new MemoryStorage();
  const idle = manualIdle();
  const lifecycle = createLifecycle(true);
  const sync = createUserDataSync({ storage, lifecycle, remote: fakeRemote(null), idle });
  sync.subscribe(() => {});
  for (let i = 1; i <= 5; i += 1) tapBookmark(sync, i, null);
  assert.equal(idle.queue.length, 1, 'five taps ask for one compaction');
  assert.equal(outboxKeys(storage, 'anonymous').length, 1);
  idle.run();
  assert.deepEqual(snapshotOf(storage, 'anonymous').bookmarks, [1, 2, 3, 4, 5]);
  assert.deepEqual(outboxKeys(storage, 'anonymous'), [], 'signed out, the compacted outbox record goes');
  assert.equal(sync.getSnapshot().sync.pending, false);

  tapBookmark(sync, 6, null);
  lifecycle.emit('hidden');
  assert.deepEqual(snapshotOf(storage, 'anonymous').bookmarks, [1, 2, 3, 4, 5, 6], 'hiding the page compacts at once');
  assert.equal(idle.queue.length, 0, 'and cancels the idle request');
  sync.close();
});

test('switching account after an uncompacted edit keeps both workspaces whole across a reload', async () => {
  const storage = new MemoryStorage();
  const remote = fakeRemote({ notes: { account: 'cloud' } });
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(true), remote, debounceMs: 60_000, scheduler: never, idle: manualIdle() });
  tapBookmark(sync, 'guest-q', null);
  sync.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  sync.send({ type: 'CHANGE', principalId: 'user-1', derive: (d) => ({ notes: { ...d.notes, mine: 'account edit' } }) });
  // Killed while signed in, before any compaction or flush.

  const lapsed = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote, idle: manualIdle() });
  lapsed.send({ type: 'SESSION_CHANGED', userId: null });
  assert.deepEqual(lapsed.getSnapshot().data.bookmarks, ['guest-q'], 'the signed-out workspace is intact');
  assert.equal(lapsed.getSnapshot().data.notes.mine, undefined, 'and the account stays hidden');
  lapsed.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  assert.equal(lapsed.getSnapshot().data.notes.mine, 'account edit', 'the account edit replays on sign-in');
  lapsed.close();
});

test('a journal left by a half-finished commit cannot replay over later edits', () => {
  // Nearly full: the boot commit writes its journal, then the snapshot write
  // fails, so the journal stays for the next boot to replay. Every edit used
  // to replace it with its own; now compaction has to.
  const storage = new MemoryStorage();
  storage.setItem('vmx-bookmarks', JSON.stringify(['old']));
  storage.setItem('vmx-user-op-v1:anonymous:crashed-tab', JSON.stringify({
    version: 1, token: 'crashed-tab:1', createdAt: 1, changes: { notes: { base: {}, value: { n: 'from crash' } } },
  }));
  const realSet = storage.setItem.bind(storage);
  let failSnapshot = true;
  storage.setItem = (key, value) => {
    if (failSnapshot && key === 'vmx-user-data-v1:anonymous') { failSnapshot = false; const e = new Error('full'); e.name = 'QuotaExceededError'; throw e; }
    realSet(key, value);
  };
  const idle = manualIdle();
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(true), remote: fakeRemote(null), idle });
  assert.ok(storage.getItem('vmx-user-sync-journal-v1'), 'the half-finished boot commit left its journal');
  tapBookmark(sync, 'new', null);
  idle.run();
  // Killed here. The next boot must not bring 'old' back without 'new'.
  const reopened = createUserDataSync({ storage, lifecycle: createLifecycle(true), remote: fakeRemote(null), idle: manualIdle() });
  assert.deepEqual(reopened.getSnapshot().data.bookmarks, ['old', 'new']);
  assert.equal(reopened.getSnapshot().data.notes.n, 'from crash');
  reopened.close();
});

test('another tab sees an edit before the snapshot has caught up', () => {
  const storage = new MemoryStorage();
  const lifeA = createLifecycle(true); const lifeB = createLifecycle(true);
  const idleA = manualIdle();
  const a = createUserDataSync({ storage, lifecycle: lifeA, remote: fakeRemote(null), idle: idleA });
  const b = createUserDataSync({ storage, lifecycle: lifeB, remote: fakeRemote(null), idle: manualIdle() });
  a.subscribe(() => {}); b.subscribe(() => {});
  tapBookmark(a, 'from-a', null);
  lifeB.emit('storage');
  assert.deepEqual(b.getSnapshot().data.bookmarks, ['from-a'], 'read from the outbox');
  idleA.run();
  lifeB.emit('storage');
  assert.deepEqual(b.getSnapshot().data.bookmarks, ['from-a'], 'read from the compacted snapshot');
  tapBookmark(b, 'from-b', null);
  lifeA.emit('storage');
  assert.deepEqual(a.getSnapshot().data.bookmarks, ['from-a', 'from-b']);
  a.close(); b.close();
  const reopened = createUserDataSync({ storage, lifecycle: createLifecycle(true), remote: fakeRemote(null), idle: manualIdle() });
  assert.deepEqual(reopened.getSnapshot().data.bookmarks, ['from-a', 'from-b']);
  reopened.close();
});

test('a note deleted after the snapshot caught up stays deleted, after a crash and in another tab', async () => {
  // The outbox record keeps its oldest base, so a note added and deleted again
  // folds into a record that no longer mentions it. Replayed onto a snapshot
  // compacted while the note existed, that record would leave the note there:
  // a signed-in reboot offline, or a second tab, brought the deleted note back.
  const setNote = (sync, value) => sync.send({
    type: 'CHANGE', principalId: 'user-1',
    derive: (d) => {
      const notes = { ...d.notes };
      if (value === undefined) delete notes.q1; else notes.q1 = value;
      return { notes };
    },
  });
  const storage = new MemoryStorage();
  const remote = fakeRemote({ notes: {} });
  const setup = createUserDataSync({ storage, lifecycle: createLifecycle(true), remote, debounceMs: 60_000, scheduler: never, idle: manualIdle() });
  setup.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  setup.close();

  // Offline, so nothing is pushed and the outbox record stays.
  const lifeA = createLifecycle(false); const lifeB = createLifecycle(false);
  const idleA = manualIdle(); const idleB = manualIdle();
  const a = createUserDataSync({ storage, lifecycle: lifeA, remote, debounceMs: 60_000, scheduler: never, idle: idleA });
  const b = createUserDataSync({ storage, lifecycle: lifeB, remote, debounceMs: 60_000, scheduler: never, idle: idleB });
  a.subscribe(() => {}); b.subscribe(() => {});
  a.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  b.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  setNote(a, 'draft'); lifeB.emit('storage');
  idleA.run(); lifeB.emit('storage');
  assert.equal(snapshotOf(storage, 'user-1').notes.q1, 'draft');
  setNote(a, undefined); lifeB.emit('storage');
  assert.equal(a.getSnapshot().data.notes.q1, undefined);
  assert.equal(b.getSnapshot().data.notes.q1, undefined, 'the other tab does not see the deleted note');

  // A tab killed here, before any idle pass, boots without the note.
  const rebooted = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote, debounceMs: 60_000, scheduler: never, idle: manualIdle() });
  rebooted.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  assert.equal(rebooted.getSnapshot().data.notes.q1, undefined, 'a reboot does not bring the deleted note back');
  rebooted.close();

  // Nor does the other tab write it back when it compacts its own edit.
  b.send({ type: 'CHANGE', principalId: 'user-1', derive: (d) => ({ bookmarks: [...d.bookmarks, 9] }) });
  lifeA.emit('storage');
  idleB.run(); lifeA.emit('storage');
  assert.equal(a.getSnapshot().data.notes.q1, undefined);
  a.close(); b.close();
  const after = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote, debounceMs: 60_000, scheduler: never, idle: manualIdle() });
  after.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  assert.equal(after.getSnapshot().data.notes.q1, undefined);
  assert.deepEqual(after.getSnapshot().data.bookmarks, [9]);
  after.close();
});

test('a sent exam result and a reset streak stay gone once the snapshot has caught up', async () => {
  // The same fold, through the list and streak merges rather than the keyed
  // object: a queued exam result that the snapshot caught up with and that
  // was then sent and taken off the queue, and a streak reset after the
  // snapshot held the day's streak. Replayed onto that snapshot, the folded
  // record put the sent result back in the queue and the old streak back on
  // the header, in another tab and after a reboot.
  const storage = new MemoryStorage();
  const remote = fakeRemote({ streak_data: { streak: 5, lastDate: '2026-09-22' } });
  const setup = createUserDataSync({ storage, lifecycle: createLifecycle(true), remote, debounceMs: 60_000, scheduler: never, idle: manualIdle() });
  setup.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  setup.close();

  const lifeA = createLifecycle(false); const lifeB = createLifecycle(false);
  const idleA = manualIdle();
  const a = createUserDataSync({ storage, lifecycle: lifeA, remote, debounceMs: 60_000, scheduler: never, idle: idleA });
  const b = createUserDataSync({ storage, lifecycle: lifeB, remote, debounceMs: 60_000, scheduler: never, idle: manualIdle() });
  a.subscribe(() => {}); b.subscribe(() => {});
  a.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  b.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  const edit = (derive) => { a.send({ type: 'CHANGE', principalId: 'user-1', derive }); lifeB.emit('storage'); };

  edit((d) => ({
    pendingExamResults: [...d.pendingExamResults, { id: 'run-1', score: 42 }],
    streakData: { streak: 6, lastDate: '2026-09-23' },
  }));
  idleA.run(); lifeB.emit('storage');
  assert.deepEqual(snapshotOf(storage, 'user-1').pendingExamResults, [{ id: 'run-1', score: 42 }]);
  edit((d) => ({ pendingExamResults: d.pendingExamResults.filter((r) => r.id !== 'run-1') }));
  edit(() => ({ streakData: { streak: 0, lastDate: null } }));

  assert.deepEqual(b.getSnapshot().data.pendingExamResults, [], 'the other tab does not queue the sent result again');
  assert.deepEqual(b.getSnapshot().data.streakData, { streak: 0, lastDate: null });
  const rebooted = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote, debounceMs: 60_000, scheduler: never, idle: manualIdle() });
  rebooted.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  assert.deepEqual(rebooted.getSnapshot().data.pendingExamResults, [], 'a reboot does not queue it again');
  assert.deepEqual(rebooted.getSnapshot().data.streakData, { streak: 0, lastDate: null });
  rebooted.close(); a.close(); b.close();
});

// ── Sweeping old outbox records ──────────────────────────────────
// A window writes its snapshot a few seconds after its last edit, so for those
// seconds the edit lives only in its outbox record. The sweeps keep the newest
// four records per account, and a window opened before the others holds the
// oldest one.

const writeNote = (store, key, principalId = 'user-1') => store.send({
  type: 'CHANGE', principalId, derive: (d) => ({ notes: { ...d.notes, [key]: `note ${key}` } }),
});

/** Window A with an edit not yet in the snapshot, whose record is the oldest
 *  of five unpushed ones. Offline all along, so nothing is pushed. */
async function fiveRecordsAndALiveEdit() {
  const storage = new MemoryStorage();
  const remote = fakeRemote({ notes: {} });
  const setup = createUserDataSync({ storage, lifecycle: createLifecycle(true), remote, debounceMs: 60_000, scheduler: never, idle: manualIdle() });
  setup.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  await settle();
  setup.close();

  let clock = 1_000;
  const lifeA = createLifecycle(false); const idleA = manualIdle();
  const a = createUserDataSync({ storage, lifecycle: lifeA, remote, debounceMs: 60_000, scheduler: never, idle: idleA, now: () => clock });
  a.subscribe(() => {});
  a.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  writeNote(a, 'a1');
  idleA.run();
  for (let i = 0; i < 4; i += 1) {
    clock += 1_000;
    const reload = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote, debounceMs: 60_000, scheduler: never, idle: manualIdle(), now: () => clock });
    reload.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
    writeNote(reload, `c${i}`);
    reload.close();
    lifeA.emit('storage');
  }
  const lifeB = createLifecycle(false);
  const b = createUserDataSync({ storage, lifecycle: lifeB, remote, debounceMs: 60_000, scheduler: never, idle: manualIdle(), now: () => clock + 5_000 });
  b.subscribe(() => {});
  b.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  clock += 1_000;
  writeNote(a, 'a2');
  lifeB.emit('storage');
  assert.equal(outboxKeys(storage, 'user-1').length, 5);
  assert.equal(snapshotOf(storage, 'user-1').notes.a2, undefined, 'the edit is only in A’s outbox record');
  return { storage, remote, a, b, lifeA, idleA };
}

test('reclaiming room on a full disk keeps an edit another window has not compacted yet', async () => {
  const { storage, remote, a, b, lifeA, idleA } = await fiveRecordsAndALiveEdit();
  // B's own record cannot be written until the reclaim frees an outbox key.
  const realSet = storage.setItem.bind(storage);
  const realRemove = storage.removeItem.bind(storage);
  let full = true;
  storage.setItem = (key, value) => {
    if (full && key.startsWith('vmx-user-op-v1:')) {
      const error = new Error('The quota has been exceeded.');
      error.name = 'QuotaExceededError';
      throw error;
    }
    realSet(key, value);
  };
  storage.removeItem = (key) => { realRemove(key); if (key.startsWith('vmx-user-op-v1:')) full = false; };

  assert.equal(writeNote(b, 'b1').accepted, true, 'the reclaim made room for the new edit');
  assert.ok(outboxKeys(storage, 'user-1').length <= 5, 'an old record went');
  lifeA.emit('storage');
  const every = ['a1', 'a2', 'c0', 'c1', 'c2', 'c3'];
  for (const key of every) assert.equal(a.getSnapshot().data.notes[key], `note ${key}`, `window A still shows ${key}`);
  idleA.run();
  a.close();
  const reopened = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote, idle: manualIdle() });
  reopened.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  for (const key of every) assert.equal(reopened.getSnapshot().data.notes[key], `note ${key}`, `a reload shows ${key}`);
  reopened.close(); b.close();
});

test('the outbox sweep folds what it drops, and drops nothing it cannot fold', async () => {
  const { sweepOutbox } = await import('../../src/lib/user-data-sync.js');
  {
    const { storage, a, b } = await fiveRecordsAndALiveEdit();
    const out = sweepOutbox(storage);
    assert.equal(out.removed.length, 1, 'the oldest of five goes');
    assert.equal(outboxKeys(storage, 'user-1').length, 4);
    assert.equal(snapshotOf(storage, 'user-1').notes.a2, 'note a2', 'after its edit reached the snapshot');
    assert.deepEqual(sweepOutbox(storage).removed, [], 'four is left alone');
    a.close(); b.close();
  }
  {
    // A half-finished commit's journal would put the old snapshot back at the
    // next boot, over the fold, so the record stays.
    const { storage, a, b } = await fiveRecordsAndALiveEdit();
    storage.setItem('vmx-user-sync-journal-v1', JSON.stringify({
      version: 1, patchIsSnapshot: true, snapshot: snapshotOf(storage, 'user-1'), snapshotKey: 'vmx-user-data-v1:user-1',
    }));
    assert.deepEqual(sweepOutbox(storage).removed, []);
    assert.equal(outboxKeys(storage, 'user-1').length, 5);
    a.close(); b.close();
  }
  {
    // No snapshot to fold into: nothing goes.
    const { storage, a, b } = await fiveRecordsAndALiveEdit();
    storage.removeItem('vmx-user-data-v1:user-1');
    assert.deepEqual(sweepOutbox(storage).removed, []);
    a.close(); b.close();
  }
  {
    // The snapshot cannot be written: nothing goes.
    const { storage, a, b } = await fiveRecordsAndALiveEdit();
    const realSet = storage.setItem.bind(storage);
    storage.setItem = (key, value) => {
      if (key === 'vmx-user-data-v1:user-1') { const e = new Error('full'); e.name = 'QuotaExceededError'; throw e; }
      realSet(key, value);
    };
    assert.deepEqual(sweepOutbox(storage).removed, []);
    assert.equal(outboxKeys(storage, 'user-1').length, 5);
    a.close(); b.close();
  }
  {
    // A record being written right now stays, and `userId` limits the sweep.
    const { storage, a, b } = await fiveRecordsAndALiveEdit();
    const oldest = outboxKeys(storage, 'user-1')
      .map((key) => ({ key, createdAt: JSON.parse(storage.getItem(key)).createdAt }))
      .sort((x, y) => x.createdAt - y.createdAt)[0].key;
    assert.deepEqual(sweepOutbox(storage, { userId: 'someone-else' }).removed, []);
    assert.deepEqual(sweepOutbox(storage, { userId: 'user-1', protectKey: oldest }).removed, []);
    const out = sweepOutbox(storage, { userId: 'user-1', keep: 3, protectKey: oldest });
    assert.equal(out.removed.length, 1);
    assert.ok(storage.getItem(oldest), 'the protected record survives');
    a.close(); b.close();
  }
  {
    // A signed-out device's own records are folded by boot, into the fields'
    // own keys as well, so the sweep leaves them alone.
    const storage = new MemoryStorage();
    for (let i = 0; i < 6; i += 1) {
      storage.setItem(`vmx-user-op-v1:anonymous:tab-${i}`, JSON.stringify({
        version: 1, token: `tab-${i}:1`, createdAt: i, changes: { bookmarks: { put: [i], removed: [] } },
      }));
    }
    storage.setItem('vmx-user-sync-owner-v1', JSON.stringify('anonymous'));
    assert.deepEqual(sweepOutbox(storage).removed, []);
  }
});

test('a record written by the previous build still loads', () => {
  // Old-shape records with a full `base` are sitting in storage at upgrade
  // time; refusing them would drop changes a student already made.
  const storage = new MemoryStorage();
  storage.setItem('vmx-user-op-v1:anonymous:legacy', JSON.stringify({
    version: 1, token: 'legacy:1', createdAt: 1,
    changes: { bookmarks: { base: [1], value: [1, 2] } },
  }));
  const sync = createUserDataSync({ storage, lifecycle: createLifecycle(false), remote: fakeRemote(null) });
  // 2 was added locally and survives; 1 was already in the base and is absent
  // from the empty remote, so the merge reads it as deleted elsewhere. What
  // matters here is that the record was READ at all rather than rejected by
  // the validation — a rejected record would leave bookmarks empty.
  assert.deepEqual(sync.getSnapshot().data.bookmarks, [2], 'the old-shape record must still replay');
});
