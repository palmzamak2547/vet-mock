import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

let sequence = 0;
async function fixture() {
  const key = `__annotationOwnerTest${++sequence}`;
  const state = { userId: 'account-a', uploads: [], remote: null };
  const sb = {
    auth: { getSession: async () => ({ data: { session: { user: { id: state.userId } } } }) },
    from: () => ({
      upsert: async row => { state.uploads.push(row); return { error: null }; },
      select() { return this; }, eq() { return this; },
      maybeSingle: async () => ({ data: state.remote, error: null }),
    }),
  };
  globalThis[key] = sb;
  const authModule = `export const hasSupabase=true; export const getSupabase=async()=>globalThis.${key};`;
  const authUrl = 'data:text/javascript;base64,' + Buffer.from(authModule).toString('base64');
  const source = readFileSync(new URL('../../src/lib/annotation-sync.js', import.meta.url), 'utf8')
    .replace("'./supabase.js'", JSON.stringify(authUrl))
    .replace("'./pdf-annotations.js'", JSON.stringify(new URL('../../src/lib/pdf-annotations.js', import.meta.url).href));
  const sync = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
  return { state, sync, dispose: () => { delete globalThis[key]; } };
}

test('a queued PDF upload cannot follow a browser account switch', async () => {
  const f = await fixture();
  try {
    const rec = { ownerId: 'account-a', strokesByPage: { 1: [{ id: 'private-a' }] } };
    f.sync.schedulePush('same-file', rec, 'account-a');
    f.state.userId = 'account-b';
    await f.sync.flushPushes('account-a');
    assert.equal(f.state.uploads.length, 0);
    assert.equal(f.sync.syncState('account-b').status, 'off');
  } finally { f.dispose(); }
});

test('legacy and guest records cannot be silently uploaded into the signed-in account', async () => {
  const f = await fixture();
  try {
    for (const rec of [{ strokesByPage: {} }, { ownerId: null, strokesByPage: {} }, { ownerId: 'account-b' }]) {
      assert.equal((await f.sync.pushNow('file', rec, 'account-a')).ok, false);
    }
    assert.equal(f.state.uploads.length, 0);
    const own = { ownerId: 'account-a', strokesByPage: { 1: [{ id: 'own' }] } };
    assert.equal((await f.sync.pushNow('file', own, 'account-a')).ok, true);
    assert.equal(f.state.uploads[0].user_id, 'account-a');
  } finally { f.dispose(); }
});

test('exit flush sends the newest local strokes using the queued owner', async () => {
  const f = await fixture();
  try {
    const { putRecord } = await import('../../src/lib/pdf-annotations.js');
    const old = { hash: 'final-stroke', ownerId: 'account-a', strokesByPage: { 1: [{ id: 'old' }] } };
    f.sync.schedulePush(old.hash, old, 'account-a');
    await putRecord({ ...old, strokesByPage: { 1: [{ id: 'old' }, { id: 'last' }] }, deleted: ['erased'] }, 'account-a');
    await f.sync.flushPushes('account-a');
    assert.deepEqual(f.state.uploads[0].data.strokesByPage[1].map(stroke => stroke.id), ['old', 'last']);
    assert.deepEqual(f.state.uploads[0].data.deleted, ['erased']);
    assert.equal(f.state.uploads[0].user_id, 'account-a');
  } finally { f.dispose(); }
});
