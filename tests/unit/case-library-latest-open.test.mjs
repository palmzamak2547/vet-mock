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
// A failed open also wrote into the list's own error state, which hides the
// modality tabs, the empty state and the grid, so one case that failed to
// download replaced the whole library with an error and left nothing to
// retry with (audit MD-10).
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
import { thaiError } from '../../src/lib/errors.js';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/components/lab/CaseLibrary.jsx'), 'utf8').replace(/\r\n/g, '\n');
const IMPORT = "await import('../../lib/supabase.js')";

/** handleOpen's callback, exactly as written in the component. */
function handleOpenSource() {
  const anchor = 'const handleOpen = useCallback(';
  const start = SRC.indexOf(anchor);
  assert.notEqual(start, -1, 'CaseLibrary must still define handleOpen');
  const end = SRC.indexOf('\n  }, [', start) + 4;
  return SRC.slice(start + anchor.length, end);
}

function harness() {
  const body = handleOpenSource();
  assert.ok(body.includes(IMPORT), 'handleOpen must still lazy-load the Supabase client');

  const downloads = new Map(); // storage path -> resolve/reject of that fetch
  const sb = {
    from: () => ({ select: () => ({ eq: (_col, id) => ({ order: async () => ({
      data: [{ id: `f-${id}`, view_name: 'lat', storage_path: `p/${id}`, transfer_syntax: null, pixel_spacing_mm: null }],
      error: null,
    }) }) }) }),
    storage: { from: () => ({ createSignedUrl: async (path) => ({ data: { signedUrl: `signed:${path}` }, error: null }) }) },
  };
  const state = { openingId: undefined, error: null, openError: null, opened: [] };
  const context = {
    console: { error() {} }, File,
    thaiError,
    importSupabase: async () => ({ getSupabase: async () => sb }),
    fetch: (url) => new Promise((res, rej) => { downloads.set(url.replace(/^signed:/, ''), { res, rej }); }),
    setOpeningId: (v) => { state.openingId = v; },
    setError: (v) => { state.error = v; },
    // Plain data out of the vm realm, so strict deepEqual can compare it.
    setOpenError: (v) => { state.openError = v && JSON.parse(JSON.stringify(v)); },
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
  const fail = (id) => downloads.get(`p/${id}`).rej(new TypeError('Failed to fetch'));
  const refuse = (id) => downloads.get(`p/${id}`).res({ ok: false, status: 404, arrayBuffer: async () => new ArrayBuffer(0) });
  return { handleOpen, leave, state, settle, finish, fail, refuse };
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
  assert.equal(h.state.openError, null, 'a failure of the case the student left behind was shown as an error');
  assert.equal(h.state.error, null);
  assert.equal(h.state.openingId, 'B');

  h.fail('B'); await pB;
  assert.equal(h.state.openError?.caseData?.id, 'B');
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
  assert.equal(h.state.openError, null);
});

test('a failed open keeps the case list, says why in Thai, and its retry opens the case once the network is back', async () => {
  const h = harness();
  const pA = h.handleOpen(A);
  await h.settle();
  h.fail('A'); await pA;
  assert.equal(h.state.error, null, 'one case that failed to download replaced the whole library with an error');
  assert.deepEqual(h.state.openError, { caseData: A, message: 'เชื่อมต่อไม่ได้ — ตรวจอินเทอร์เน็ตแล้วลองใหม่' });
  assert.equal(h.state.openingId, null);

  // The notice's retry opens the same case again; the old failure goes at once.
  const retry = h.handleOpen(h.state.openError.caseData);
  assert.equal(h.state.openError, null, 'the old failure stayed up while the retry was running');
  await h.settle();
  h.finish('A'); await retry;
  assert.deepEqual(h.state.opened, [{ id: 'A', names: ['hip-dysplasia_lat.dcm'] }]);
  assert.equal(h.state.openError, null);
  assert.equal(h.state.error, null);
});

test('a failure with no reason a student can act on names the case and offers the retry, without English', async () => {
  const h = harness();
  const pA = h.handleOpen(A);
  await h.settle();
  h.refuse('A'); await pA; // the storage file is gone: "HTTP 404 fetching lat"
  assert.deepEqual(h.state.openError, { caseData: A, message: '' });
  assert.equal(h.state.error, null);
});

test('opening another case clears the previous failure at once', async () => {
  const h = harness();
  const pA = h.handleOpen(A);
  await h.settle();
  h.fail('A'); await pA;
  assert.equal(h.state.openError?.caseData?.id, 'A');

  const pB = h.handleOpen(B);
  assert.equal(h.state.openError, null, 'case A\'s failure was still shown while case B opened');
  await h.settle();
  h.finish('B'); await pB;
  assert.deepEqual(h.state.opened.map((o) => o.id), ['B']);
  assert.equal(h.state.openError, null);
});

test('only a failed list load hides the list; a failed open shows its own notice with a retry', () => {
  for (const gate of [
    '{!loading && !error && cases.length > 0 && (\n        <ModalityTabs',
    '{!loading && !error && cases.length === 0 && (',
    '{!loading && !error && cases.length > 0 && (() => {',
  ]) assert.ok(SRC.includes(gate), `the list must still hide on the list error alone: ${gate.split('\n')[0]}`);
  assert.doesNotMatch(handleOpenSource(), /\bsetError\(/, 'an open failure must not use the list\'s error state');

  const at = SRC.indexOf('{openError && (');
  assert.notEqual(at, -1, 'a failed open has no notice of its own');
  const notice = SRC.slice(at, SRC.indexOf('\n      )}', at));
  assert.match(notice, /role="alert"/);
  assert.match(notice, /onClick=\{\(\) => handleOpen\(openError\.caseData\)\}/, 'the notice must retry the case that failed');
  assert.match(notice, />\s*ลองอีกครั้ง\s*</);
  assert.ok(at < SRC.indexOf('<ModalityTabs'), 'the notice must sit above the tabs and the grid');
});
