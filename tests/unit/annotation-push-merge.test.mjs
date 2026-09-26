// ============================================================
// annotation-push-merge — a push can only add to the account copy
// ============================================================
// B13 (bug hunt 2026-09-26). pushNow upserted the pushing device's whole
// record into pdf_annotations.data. A device whose realtime channel missed
// another device's change (a sleeping laptop, a backgrounded tab) then wrote
// its own strokes over the account copy, and the other device's synced
// strokes vanished from it with no tombstone. The module header promises the
// opposite: a two-phase set, union of strokes minus union of tombstones.
// pushNow now reads the account copy and pushes the merge of the two, and
// pushes nothing when it cannot read what it would be replacing.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

let sequence = 0;
async function fixture({ remote = null, readError = null } = {}) {
  const key = `__annotationPushMerge${++sequence}`;
  const state = { remote, readError, uploads: [] };
  const sb = {
    auth: { getSession: async () => ({ data: { session: { user: { id: 'acct' } } } }) },
    from: () => {
      const query = {
        select() { return query; }, eq() { return query; },
        maybeSingle: async () => (state.readError
          ? { data: null, error: { message: state.readError } }
          : { data: state.remote ? { data: state.remote } : null, error: null }),
        upsert: async (row) => { state.uploads.push(row); state.remote = row.data; return { error: null }; },
      };
      return query;
    },
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

const stroke = (id) => ({ id, pts: [[0.1, 0.1], [0.2, 0.2]], tool: 'pen' });
const record = (ids, deleted = []) => ({
  hash: 'deck', ownerId: 'acct', fileName: 'deck.pdf', pageCount: 3,
  strokesByPage: { 1: ids.map(stroke) }, deleted, lastPage: 1, lastOpened: 1,
});
const ids = (data) => Object.values(data.strokesByPage || {}).flat().map((s) => s.id).sort();

test('a device that never saw another device\'s strokes cannot remove them from the account', async () => {
  const f = await fixture({ remote: { strokesByPage: { 1: [stroke('a1'), stroke('a2')] }, deleted: [], lastOpened: 1 } });
  try {
    const result = await f.sync.pushNow('deck', record(['b1']), 'acct');
    assert.equal(result.ok, true);
    assert.deepEqual(ids(f.state.uploads[0].data), ['a1', 'a2', 'b1']);
  } finally { f.dispose(); }
});

test('tombstones from either side still erase: the merge is a two-phase set', async () => {
  const f = await fixture({ remote: { strokesByPage: { 1: [stroke('a1'), stroke('x')] }, deleted: ['gone'], lastOpened: 1 } });
  try {
    await f.sync.pushNow('deck', record(['gone', 'b1'], ['x']), 'acct');
    const data = f.state.uploads[0].data;
    assert.deepEqual(ids(data), ['a1', 'b1'], 'a stroke erased on either device stays erased');
    assert.deepEqual([...data.deleted].sort(), ['gone', 'x']);
  } finally { f.dispose(); }
});

test('when the account copy cannot be read, nothing is written over it', async () => {
  const f = await fixture({ remote: { strokesByPage: { 1: [stroke('a1')] }, deleted: [] }, readError: 'network' });
  try {
    const result = await f.sync.pushNow('deck', record(['b1']), 'acct');
    assert.equal(result.ok, false);
    assert.equal(f.state.uploads.length, 0);
    assert.equal(f.sync.syncState('acct').status, 'error');
  } finally { f.dispose(); }
});
