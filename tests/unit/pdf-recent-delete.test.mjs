import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { mergeRecords } from '../../src/lib/pdf-annotations.js';

const source = readFileSync(new URL('../../src/views/PdfAnnotateView.jsx', import.meta.url), 'utf8');
const start = source.indexOf('async function removeRecent(');
const end = source.indexOf('async function recoverLegacy(', start);
assert.ok(start > 0 && end > start, 'run the reader deletion handler that ships');

function fixture({ ownerId = 'student', deleted = [], strokes = [{ id: 'ink' }] } = {}) {
  const original = { hash: 'deck', ownerId, fileName: 'deck.pdf', strokesByPage: { 1: strokes }, deleted };
  const state = { local: structuredClone(original), remote: structuredClone(original), online: false,
    saveOk: true, deleteOk: true, pushes: 0, drops: 0, toasts: [] };
  const remove = vm.runInNewContext(`(${source.slice(start, end)})`, {
    ownerId,
    peekAnnotations: () => state.local,
    loadAnnotations: async () => state.local,
    saveAnnotations: async (hash, record) => {
      if (!state.saveOk) return { ok: false };
      state.local = mergeRecords(state.local, record);
      return { ok: true };
    },
    pushNow: async (hash, record) => {
      state.pushes++;
      if (!state.online) return { ok: false };
      state.remote = mergeRecords(state.remote, record);
      return { ok: true };
    },
    deleteAnnotations: async () => {
      state.drops++;
      if (state.deleteOk) state.local = null;
      return { ok: state.deleteOk };
    },
    refreshRecent() {},
    showToast: message => state.toasts.push(message),
  });
  return { state, remove: () => remove('deck'), reopen: () => mergeRecords(state.local, state.remote) };
}

test('repeated offline removal preserves tombstones so reopening cannot resurrect the ink', async () => {
  const f = fixture();
  await f.remove();
  assert.deepEqual(f.state.local.deleted, ['ink']);
  await f.remove();
  await f.remove();
  assert.equal(f.state.drops, 0, 'failed uploads cannot discard the local deletion');
  assert.equal(f.state.pushes, 3, 'an empty live-stroke list still needs its deletion uploaded');
  assert.deepEqual(f.reopen().strokesByPage, {});
});

test('a retry after reconnection uploads the retained deletion before dropping the recent entry', async () => {
  const f = fixture();
  await f.remove();
  f.state.online = true;
  await f.remove();
  assert.equal(f.state.drops, 1);
  assert.equal(f.state.local, null);
  assert.deepEqual(f.state.remote.deleted, ['ink']);
  assert.deepEqual(f.reopen().strokesByPage, {});
});

test('removing an already-erased document keeps its unsynced eraser tombstones offline', async () => {
  const f = fixture({ strokes: [], deleted: ['erased'] });
  await f.remove();
  assert.equal(f.state.drops, 0);
  assert.equal(f.state.pushes, 1);
  assert.deepEqual(f.state.local.deleted, ['erased']);
});

test('a failed local tombstone save never uploads or drops the original ink', async () => {
  const f = fixture();
  f.state.saveOk = false;
  await f.remove();
  assert.equal(f.state.pushes, 0);
  assert.equal(f.state.drops, 0);
  assert.equal(f.state.local.strokesByPage[1][0].id, 'ink');
  assert.match(f.state.toasts.at(-1), /ไม่สำเร็จ/);
});

test('guest removals remain local and unmarked account entries need no upload', async () => {
  for (const options of [{ ownerId: null }, { ownerId: null, strokes: [], deleted: ['old'] }, { strokes: [] }]) {
    const f = fixture(options);
    await f.remove();
    assert.equal(f.state.pushes, 0);
    assert.equal(f.state.drops, 1);
    assert.equal(f.state.local, null);
  }
});

test('a failed recent-entry removal reports failure and retains the deletion', async () => {
  const f = fixture();
  f.state.online = true;
  f.state.deleteOk = false;
  await f.remove();
  assert.ok(f.state.local);
  assert.deepEqual(f.state.remote.deleted, ['ink']);
  assert.match(f.state.toasts.at(-1), /ไม่สำเร็จ/);
});
