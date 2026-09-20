// ============================================================
// case-library-latest-open.test.mjs — the case picked last is the one that opens
// ============================================================
// Each "เปิด case" click downloaded its files and then called the parent's
// onOpenCase, with only the clicked card disabled meanwhile. A student who
// clicked case A, then case B while A was still downloading, got B — and then
// A again when A's slower download finished, because every unresolved click
// applied itself. The same late completion could reopen the viewer after
// Back, and either click's finally cleared the other's loading marker
// (audit MD-07; source-only there, demonstrated here before the fix).
//
// The component renders JSX and lazy-imports Supabase, so its open callback
// is lifted out of the source and run with the Supabase client, fetch and
// React state mocked; download completion order is under the test's control.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/components/lab/CaseLibrary.jsx'), 'utf8').replace(/\r\n/g, '\n');
const IMPORT = "await import('../../lib/supabase.js')";

function harness() {
  const anchor = 'const handleOpen = useCallback(';
  const start = SRC.indexOf(anchor);
  assert.notEqual(start, -1, 'CaseLibrary must still define handleOpen');
  const end = SRC.indexOf('\n  }, [', start) + 4;
  const body = SRC.slice(start + anchor.length, end);
  assert.ok(body.includes(IMPORT), 'handleOpen must still lazy-load the Supabase client');

  const downloads = new Map(); // storage path -> resolve/reject of that fetch
  const sb = {
    from: () => ({ select: () => ({ eq: (_col, id) => ({ order: async () => ({
      data: [{ id: `f-${id}`, view_name: 'lat', storage_path: `p/${id}`, transfer_syntax: null, pixel_spacing_mm: null }],
      error: null,
    }) }) }) }),
    storage: { from: () => ({ createSignedUrl: async (path) => ({ data: { signedUrl: `signed:${path}` }, error: null }) }) },
  };
  const state = { openingId: undefined, error: null, opened: [] };
  const context = {
    console: { error() {} }, File,
    thaiError: (e, fallback) => e?.message || fallback,
    importSupabase: async () => ({ getSupabase: async () => sb }),
    fetch: (url) => new Promise((res, rej) => { downloads.set(url.replace(/^signed:/, ''), { res, rej }); }),
    setOpeningId: (v) => { state.openingId = v; },
    setError: (v) => { state.error = v; },
    // `files` is built inside the vm realm; keep plain data so strict deepEqual can compare it.
    onOpenCase: (files, c) => { state.opened.push({ id: c.id, names: Array.from(files, (f) => f.name) }); },
    openSeqRef: { current: 0 },
  };
  const handleOpen = vm.runInNewContext('(' + body.replace(IMPORT, 'await importSupabase()') + ')', context);

  const retireAnchor = 'useEffect(() => () => { openSeqRef.current += 1; }, []);';
  assert.ok(SRC.includes(retireAnchor), 'leaving the list must retire the opens still in flight');
  const leave = vm.runInNewContext('(() => { openSeqRef.current += 1; })', context);

  const settle = async () => { for (let i = 0; i < 10 && downloads.size < 2; i++) await new Promise((r) => setImmediate(r)); };
  const ok = () => ({ ok: true, status: 200, arrayBuffer: async () => new ArrayBuffer(8) });
  const finish = (id) => downloads.get(`p/${id}`).res(ok());
  const fail = (id) => downloads.get(`p/${id}`).rej(new Error(`network lost on ${id}`));
  return { handleOpen, leave, state, settle, finish, fail };
}

const A = { id: 'A', slug: 'hip-dysplasia' };
const B = { id: 'B', slug: 'cardiomegaly' };

test('A slow, B fast: B opens once and A finishing later cannot replace it', async () => {
  const h = harness();
  const pA = h.handleOpen(A);
  const pB = h.handleOpen(B);
  await h.settle();
  assert.equal(h.state.openingId, 'B', 'the card the student clicked last shows as loading');

  h.finish('B'); await pB;
  assert.deepEqual(h.state.opened, [{ id: 'B', names: ['cardiomegaly_lat.dcm'] }]);
  assert.equal(h.state.openingId, null);

  h.finish('A'); await pA;
  assert.deepEqual(h.state.opened.map((o) => o.id), ['B'], 'the earlier, slower open reopened its case over the one chosen last');
  assert.equal(h.state.error, null);
});

test('A fast, B slow: A finishing first is ignored and must not clear B\'s loading marker', async () => {
  const h = harness();
  const pA = h.handleOpen(A);
  const pB = h.handleOpen(B);
  await h.settle();

  h.finish('A'); await pA;
  assert.deepEqual(h.state.opened, [], 'a case the student moved on from was opened anyway');
  assert.equal(h.state.openingId, 'B', 'the stale open cleared the loading marker of the open still running');

  h.finish('B'); await pB;
  assert.deepEqual(h.state.opened.map((o) => o.id), ['B']);
  assert.equal(h.state.openingId, null);
});

test('a stale download that fails raises no error; the newest one that fails does', async () => {
  const h = harness();
  const pA = h.handleOpen(A);
  const pB = h.handleOpen(B);
  await h.settle();

  h.fail('A'); await pA;
  assert.equal(h.state.error, null, 'a failure of the case the student left behind was shown as an error');
  assert.equal(h.state.openingId, 'B');

  h.fail('B'); await pB;
  assert.match(h.state.error, /network lost on B/);
  assert.equal(h.state.openingId, null);
  assert.deepEqual(h.state.opened, []);
});

test('Back while a download is pending: the late completion does not reopen the viewer', async () => {
  const h = harness();
  const pA = h.handleOpen(A);
  await h.settle();
  h.leave();
  h.finish('A'); await pA;
  assert.deepEqual(h.state.opened, [], 'a download that completed after leaving the list reopened the viewer');
  assert.equal(h.state.openingId, 'A', 'nothing may touch the state of a list that is no longer there');
});

test('one open at a time still works exactly as before', async () => {
  const h = harness();
  const pA = h.handleOpen(A);
  await h.settle();
  assert.equal(h.state.openingId, 'A');
  h.finish('A'); await pA;
  assert.deepEqual(h.state.opened, [{ id: 'A', names: ['hip-dysplasia_lat.dcm'] }]);
  assert.equal(h.state.openingId, null);
  assert.equal(h.state.error, null);
});
