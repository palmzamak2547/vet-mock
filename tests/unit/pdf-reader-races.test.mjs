// ============================================================
// pdf-reader-races.test.mjs — the reader answers to the latest intent
// ============================================================
// Two of the reader's asynchronous paths let an older request finish after a
// newer one and speak for it:
//
//  • Opening document B while A was still loading (the command palette, a
//    second tap on the shelf) let whichever finished LAST publish itself. A
//    slow A replaced B on screen while the export source still pointed at B,
//    so an export stamped A's ink onto B's pages.
//
//  • Clearing or editing the search box while the first search was still
//    reading the document did not withdraw that search: when the read ended
//    it filled the results for a query the box no longer held and jumped to
//    a page nobody asked for.
//
// These are the reader's real callbacks, cut from the source and run under
// vm with every asynchronous step under the test's control, the way the
// live-sync tests in this folder do it.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { searchPages, pageTextFromItems } from '../../src/lib/thai-search.js';

const SRC = readFileSync(new URL('../../src/views/PdfAnnotateView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

function between(start, end, from = 0) {
  const a = SRC.indexOf(start, from);
  assert.notEqual(a, -1, `the reader must still contain ${JSON.stringify(start)}`);
  const b = SRC.indexOf(end, a);
  assert.notEqual(b, -1, `the reader must still contain ${JSON.stringify(end)} after ${JSON.stringify(start)}`);
  return SRC.slice(a + start.length, b);
}

const tick = () => new Promise((r) => setImmediate(r));

// ── opening documents ────────────────────────────────────────────────

function reader() {
  const state = { published: [], saves: [], loading: [], Error: null };
  const tasks = new Map();
  const task = (key) => {
    let resolve; let reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    const t = {
      key, promise, destroyed: false,
      resolve: (numPages) => resolve({ identity: key.replace(/^audit:/, ''), numPages, destroyed: false, destroy() { this.destroyed = true; return Promise.resolve(); } }),
      reject,
      destroy() { t.destroyed = true; reject(new Error('Worker was destroyed')); return Promise.resolve(); },
    };
    tasks.set(key, t);
    return t;
  };
  const gates = new Map(); // hash -> resolver for a deliberately slow loadAnnotations
  const ctx = {
    console: { error() {} },
    ownerId: null,
    sourceRef: { current: null },
    resumeTo: { current: 0 },
    currentStrokesRef: { current: [] },
    loadGenRef: { current: 0 },
    pendingTaskRef: { current: null },
    useCallback: (fn) => fn,
    SIZE_WARN_MB: 30,
    SIZE_HARD_MB: 60,
    loadPdfjs: async () => ({ getDocument: ({ url, data }) => task(url ?? data.key) }),
    fetch: async (url) => ({ ok: true, arrayBuffer: async () => ({ key: url }) }),
    readWithProgress: async (res) => res.arrayBuffer(),
    hashFile: async (file) => file.hash,
    loadAnnotations: (hash) => (gates.has(hash) ? new Promise((r) => gates.set(hash, r)) : Promise.resolve(null)),
    pullAndMerge: async () => null,
    loadLegacyAnnotations: async () => null,
    saveAnnotations: async (hash) => { state.saves.push(hash); return { ok: true }; },
    refreshRecent() {},
    storageHealth: () => ({ persistent: true }),
    showToast() {},
    thaiError: (e) => String(e?.message || e),
    mb: (n) => String(n),
  };
  for (const s of ['Error', 'DownloadProgress', 'Loading', 'LoadingMsg', 'LegacyAvailable', 'Deleted', 'FileHash', 'FileName', 'PageCount', 'StrokesByPage', 'CurrentPage']) {
    ctx[`set${s}`] = (v) => { state[s] = v; if (s === 'Loading') state.loading.push(v); };
  }
  ctx.setPdfDoc = (doc) => { state.PdfDoc = doc; state.published.push(doc.identity); };
  vm.createContext(ctx);
  ctx.supersedeOpen = vm.runInContext(`(${between('const supersedeOpen = useCallback(', '\n  }, []);')}\n  })`, ctx);
  const ingestRemote = vm.runInContext(`(${between('const ingestRemote = useCallback(', '\n  }, [showToast, refreshRecent]);')}\n  })`, ctx);
  const ingestFile = vm.runInContext(`(${between('const ingestFile = useCallback(', '\n  }, [showToast, refreshRecent]);')}\n  })`, ctx);
  const remote = (key) => ({ url: `audit:${key}`, slug: key, sha256: key, fileName: `${key}.pdf`, rangeSupported: true });
  const slowAnnotations = (hash) => gates.set(hash, null);
  const releaseAnnotations = (hash) => { gates.get(hash)?.(null); gates.delete(hash); };
  return { state, tasks, ctx, ingestRemote, ingestFile, remote, slowAnnotations, releaseAnnotations };
}

test('a slower first open finishing after a newer one neither shows nor exports', async () => {
  const r = reader();
  const a = r.ingestRemote(r.remote('A'));
  await tick();
  const b = r.ingestRemote(r.remote('B'));
  await tick();
  assert.equal(r.tasks.get('audit:A').destroyed, true, 'the superseded load was left running');
  r.tasks.get('audit:B').resolve(2);
  await Promise.all([a, b]);
  assert.deepEqual(r.state.published, ['B'], 'the document on screen is not the one opened last');
  assert.equal(r.state.FileHash, 'B');
  // Field by field: the object was made inside the vm realm.
  assert.equal(r.ctx.sourceRef.current?.kind, 'url');
  assert.equal(r.ctx.sourceRef.current?.url, 'audit:B', 'an export would read a different document from the one shown');
  assert.deepEqual(r.state.saves, ['B'], 'the withdrawn open still saved its metadata');
  assert.equal(r.state.Error, null, 'the cancelled open showed an error');
  assert.equal(r.state.Loading, false);
});

test('a first open that has its bytes but is still merging ink is released when a newer one wins', async () => {
  const r = reader();
  r.slowAnnotations('A');
  const a = r.ingestRemote(r.remote('A'));
  await tick();
  r.tasks.get('audit:A').resolve(3);
  await tick();
  const b = r.ingestRemote(r.remote('B'));
  await tick();
  r.tasks.get('audit:B').resolve(2);
  await b;
  r.releaseAnnotations('A');
  await a;
  assert.deepEqual(r.state.published, ['B']);
  assert.equal(r.state.PdfDoc.identity, 'B');
  assert.equal(r.state.FileHash, 'B');
  assert.deepEqual(r.state.saves, ['B']);
  const aDoc = await r.tasks.get('audit:A').promise;
  assert.equal(aDoc.destroyed, true, 'the document nobody will see kept its worker');
});

test('a fast first open never flashes up once a newer open has begun', async () => {
  const r = reader();
  const a = r.ingestRemote(r.remote('A'));
  await tick();
  const b = r.ingestRemote(r.remote('B'));
  await tick();
  r.tasks.get('audit:B').resolve(2);
  await Promise.all([a, b]);
  assert.deepEqual(r.state.published, ['B']);
  assert.deepEqual(r.state.saves, ['B']);
});

test('a personal file and a shelf document opened over each other end on the shelf document', async () => {
  const r = reader();
  const file = { name: 'notes.pdf', type: 'application/pdf', size: 1024, hash: 'F', arrayBuffer: async () => ({ key: 'file:F' }) };
  const f = r.ingestFile(file);
  await tick(); await tick(); await tick();
  const b = r.ingestRemote(r.remote('B'));
  await tick();
  r.tasks.get('audit:B').resolve(2);
  await Promise.all([f, b]);
  assert.deepEqual(r.state.published, ['B']);
  assert.equal(r.state.FileHash, 'B');
  assert.equal(r.ctx.sourceRef.current.kind, 'url', 'the export source still pointed at the personal file');
  assert.deepEqual(r.state.saves, ['B']);
});

test('a withdrawn open neither reports its cancellation nor clears the newer open\'s loading state', async () => {
  const r = reader();
  const a = r.ingestRemote(r.remote('A'));
  await tick();
  const b = r.ingestRemote(r.remote('B'));
  await a;
  await tick(); await tick();
  assert.equal(r.state.Loading, true, 'the cancelled open switched the spinner off under the live one');
  assert.equal(r.state.Error, null);
  r.tasks.get('audit:B').resolve(2);
  await b;
  assert.equal(r.state.Loading, false);
  assert.deepEqual(r.state.published, ['B']);
});

test('leaving the reader withdraws the open still in flight', async () => {
  const r = reader();
  const a = r.ingestRemote(r.remote('A'));
  await tick();
  r.ctx.supersedeOpen(); // what the unmount cleanup calls
  await a;
  assert.equal(r.tasks.get('audit:A').destroyed, true);
  assert.deepEqual(r.state.published, []);
  assert.deepEqual(r.state.saves, []);
  const cleanup = between('// Cleanup on unmount', '}, []);');
  assert.match(cleanup, /supersedeOpen\(\);/, 'the unmount cleanup must withdraw a pending open');
});

// ── searching ────────────────────────────────────────────────────────

function searcher(pages) {
  const st = { hits: undefined, navigated: [], searching: [], query: null, getPageCalls: 0 };
  const waiting = [];
  const ctx = {
    pdfDoc: {
      numPages: pages.length,
      getPage: async (i) => {
        st.getPageCalls += 1;
        return { getTextContent: () => new Promise((r) => waiting.push(() => r({ items: [{ str: pages[i - 1] }] }))) };
      },
    },
    fileHash: 'doc-1',
    textRef: { current: { hash: null, pages: null } },
    searchAbortRef: { current: 0 },
    searchReqRef: { current: 0 },
    pageTextFromItems,
    searchPages,
    setHits: (v) => { st.hits = v; },
    setSearching: (v) => { st.searching.push(v); },
    setHitIdx: (v) => { st.hitIdx = v; },
    goToPage: (n) => { st.navigated.push(n); },
    setQuery: (v) => { st.query = v; },
  };
  vm.createContext(ctx);
  const head = '  async function ensureText()';
  const fns = vm.runInContext(`${head}${between(head, '\n  // Results,')}\n({ ensureText, runSearch, dropSearch })`, ctx);
  const effect = between('// A new document invalidates the extracted text', '}, [fileHash]);');
  const documentChanged = vm.runInContext(`(() => {${effect.slice(effect.indexOf('{') + 1)}})`, ctx);
  // Lets the read finish one page at a time, as pdf.js would.
  const finishRead = async () => { while (waiting.length) { waiting.shift()(); await tick(); } };
  // Answers only the page asked for first.
  const releaseOne = async () => { waiting.shift()(); await tick(); await tick(); };
  // Exactly what the search box's onChange does.
  const typeInto = (value) => { ctx.setQuery(value); fns.dropSearch(); if (!value.trim()) ctx.setHits(null); };
  return { st, ctx, fns, documentChanged, finishRead, releaseOne, typeInto, busy: () => st.searching[st.searching.length - 1] };
}

test('clearing the box while the document is still being read withdraws the search', async () => {
  const s = searcher(['alpha', 'beta']);
  const pending = s.fns.runSearch('alpha');
  await tick();
  s.typeInto('');
  await s.finishRead();
  await pending;
  assert.equal(s.st.hits, null, 'the cleared box was filled with the old query\'s results');
  assert.deepEqual(s.st.navigated, [], 'the reader jumped to a page for a search that was withdrawn');
  assert.equal(s.busy(), false, 'the search box stayed busy');
});

test('retyping and resubmitting answers only the latest query, from a single read of the document', async () => {
  const s = searcher(['alpha', 'beta']);
  const first = s.fns.runSearch('alpha');
  await tick();
  s.typeInto('beta');
  const second = s.fns.runSearch('beta');
  await s.finishRead();
  await Promise.all([first, second]);
  assert.equal(s.st.hits?.length, 1);
  assert.equal(s.st.hits[0].page, 2);
  assert.deepEqual(s.st.navigated, [2], 'the withdrawn query still moved the reader');
  assert.equal(s.st.getPageCalls, 2, 'the second query re-read the document instead of joining the read in progress');
  assert.equal(s.busy(), false);
  assert.deepEqual(Array.from(s.ctx.textRef.current.pages || []).slice(1), ['alpha', 'beta'], 'the finished read was not kept for the next query');
});

test('a document change while a search waits publishes nothing, and the search that follows keeps its busy state', async () => {
  const s = searcher(['alpha', 'beta']);
  const old = s.fns.runSearch('alpha');
  await tick();
  s.ctx.fileHash = 'doc-2';
  s.documentChanged();
  const fresh = s.fns.runSearch('beta');
  await tick();
  // The old document's read ends first (its next page is never asked for);
  // it belongs to nobody now.
  await s.releaseOne();
  await old;
  assert.equal(s.st.hits, null, 'the old document\'s hits were shown for the new one');
  assert.deepEqual(s.st.navigated, []);
  assert.equal(s.busy(), true, 'the withdrawn search switched off the busy state of the one that replaced it');
  await s.finishRead();
  await fresh;
  assert.equal(s.st.hits?.length, 1);
  assert.deepEqual(s.st.navigated, [2]);
  assert.equal(s.busy(), false);
});

test('the search box withdraws the running search on every edit', () => {
  const input = between('id="vmx-pdf-search"', '/>');
  assert.match(input, /onChange=\{\(e\) => \{ setQuery\(e\.target\.value\); dropSearch\(\);/, 'onChange must call dropSearch');
});
