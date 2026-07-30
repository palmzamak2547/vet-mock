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
