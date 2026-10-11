// ============================================================
// pdf-text-cache.test.mjs — the reader's search text belongs to the document
// ============================================================
// OV-media-14. The reader extracts each page's text once and keeps it for
// later searches. The cache was keyed on the file hash alone:
//
//  • Opening the same file again while a search was still reading it gave a
//    new pdf.js document with the same hash. The invalidation effect listened
//    to the hash only, so it never ran; the old document was destroyed under
//    the read still running, every page after that threw, each was stored as
//    '' and the blanks were cached. Every later search on that file then
//    missed text that was right there on the page.
//  • Any page that failed to read was cached as a page with no text.
//
// The text is now tied to the document object, the effect also runs when the
// document changes, and a read with a failed page answers only the search
// that asked for it.
//
// These are the reader's real callbacks and effect, cut from the source and
// run under vm with every asynchronous step under the test's control, the way
// pdf-reader-races.test.mjs does it. The effect is re-run only when the deps
// written in the source change, as React would.
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

/** The invalidation effect: its body and its dependency list, as written. */
function invalidationEffect() {
  const start = SRC.indexOf('// A new document invalidates the extracted text');
  assert.notEqual(start, -1, 'the reader must still have its text invalidation effect');
  const open = SRC.indexOf('useEffect(() => {', start);
  const close = SRC.indexOf('\n  }, [', open);
  const depsEnd = SRC.indexOf(']);', close);
  assert.ok(open > start && close > open && depsEnd > close, 'the effect must be a useEffect with a dependency list');
  return {
    body: SRC.slice(open + 'useEffect(() => {'.length, close),
    deps: SRC.slice(close + '\n  }, ['.length, depsEnd),
  };
}

function harness() {
  const st = { hits: undefined, navigated: [], searching: [], query: null };
  const waiting = [];
  /** A pdf.js document stand-in. A destroyed one throws, as pdf.js does. */
  const makeDoc = (pages, { failOnce = [] } = {}) => {
    const fail = new Set(failOnce);
    const doc = {
      numPages: pages.length,
      destroyed: false,
      getPageCalls: 0,
      async getPage(i) {
        doc.getPageCalls += 1;
        if (doc.destroyed) throw new Error('Transport destroyed');
        if (fail.has(i)) { fail.delete(i); throw new Error('Invalid page request'); }
        return {
          getTextContent: () => new Promise((resolve, reject) => waiting.push(() => (
            doc.destroyed ? reject(new Error('Transport destroyed')) : resolve({ items: [{ str: pages[i - 1] }] })
          ))),
        };
      },
      destroy() { doc.destroyed = true; return Promise.resolve(); },
    };
    return doc;
  };
  const ctx = {
    pdfDoc: null,
    fileHash: null,
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
  const { body, deps } = invalidationEffect();
  const effect = vm.runInContext(`(() => {${body}\n})`, ctx);
  const readDeps = vm.runInContext(`(() => [${deps}])`, ctx);
  let lastDeps = null;
  /** A render commit: the effect runs on mount and whenever a dep changed. */
  const commit = () => {
    const next = readDeps();
    if (!lastDeps || next.length !== lastDeps.length || next.some((d, i) => !Object.is(d, lastDeps[i]))) {
      lastDeps = next;
      effect();
    }
  };
  /** Open a document, as ingestFile/openLibraryDoc publish it. The previous
   *  one is destroyed by the [pdfDoc] effect's cleanup. */
  const open = (doc, hash) => {
    const previous = ctx.pdfDoc;
    ctx.pdfDoc = doc;
    ctx.fileHash = hash;
    previous?.destroy();
    commit();
  };
  // Lets the read finish one page at a time, as pdf.js would. A page asks for
  // its text a tick after getPage, so this waits for the queue to stay empty.
  const finishRead = async () => {
    await tick();
    while (waiting.length) {
      while (waiting.length) { waiting.shift()(); await tick(); }
      await tick();
    }
  };
  const releaseOne = async () => { waiting.shift()(); await tick(); await tick(); };
  const cachedPages = () => Array.from(ctx.textRef.current.pages || []).slice(1);
  return { st, ctx, fns, makeDoc, open, finishRead, releaseOne, cachedPages };
}

const PAGES = ['alpha', 'beta', 'gamma'];

test('reopening the same file while a search reads it caches nothing blank', async () => {
  const h = harness();
  const first = h.makeDoc(PAGES);
  h.open(first, 'same-hash');
  const waitingSearch = h.fns.runSearch('gamma');
  await tick();
  await h.releaseOne(); // page 1 of the first document is read

  // The same file, opened again: a new pdf.js document, the same hash. The
  // first document is destroyed under the read still running.
  const second = h.makeDoc(PAGES);
  h.open(second, 'same-hash');
  await h.finishRead();
  await waitingSearch;
  assert.equal(h.st.hits, null, 'the search that was waiting on the destroyed document published its blanks');
  assert.deepEqual(h.st.navigated, []);
  assert.ok(!h.cachedPages().includes(''), `blank pages were cached: ${JSON.stringify(h.cachedPages())}`);

  // The next search on the reopened document finds what is on page 3.
  const next = h.fns.runSearch('gamma');
  await h.finishRead();
  await next;
  assert.equal(h.st.hits?.length, 1, 'a later search missed text that is on the page');
  assert.equal(h.st.hits[0].page, 3);
  assert.deepEqual(h.st.navigated, [3]);
  assert.deepEqual(h.cachedPages(), PAGES);
  assert.equal(h.ctx.textRef.current.doc, second, 'the cached text must say which document it was read from');
  assert.ok(second.getPageCalls >= 3, 'the reopened document was read');
});

test('cached text is reused only for the document it was read from', async () => {
  const h = harness();
  const first = h.makeDoc(PAGES);
  h.open(first, 'same-hash');
  const read = h.fns.runSearch('beta');
  await h.finishRead();
  await read;
  assert.deepEqual(h.cachedPages(), PAGES);
  const callsBefore = first.getPageCalls;
  // A second search on the same document joins the cache, with no new read.
  await h.fns.runSearch('alpha');
  assert.equal(first.getPageCalls, callsBefore, 'the same document was read twice');

  // A different document object under the same hash never answers from the
  // first one's cache, even if nothing cleared it.
  const second = h.makeDoc(['delta', 'epsilon', 'zeta']);
  h.ctx.pdfDoc = second;
  const other = h.fns.runSearch('zeta');
  await h.finishRead();
  await other;
  assert.equal(h.st.hits?.length, 1, 'the second document was answered from the first one\'s text');
  assert.equal(h.st.hits[0].page, 3);
  assert.equal(h.ctx.textRef.current.doc, second);
});

test('a page that failed to read is not cached as a page with no text', async () => {
  const h = harness();
  const doc = h.makeDoc(PAGES, { failOnce: [2] });
  h.open(doc, 'flaky');
  const first = h.fns.runSearch('beta');
  await h.finishRead();
  await first;
  // This search answers with what could be read.
  assert.deepEqual(h.st.hits, []);
  assert.equal(h.ctx.textRef.current.pages, null, 'an incomplete read was kept for later searches');

  // The next search reads the document again and finds page 2.
  const second = h.fns.runSearch('beta');
  await h.finishRead();
  await second;
  assert.equal(h.st.hits?.length, 1, 'page 2 stayed blank for every later search');
  assert.equal(h.st.hits[0].page, 2);
  assert.deepEqual(h.cachedPages(), PAGES);
});

test('a different file still invalidates the text and withdraws the waiting search', async () => {
  const h = harness();
  h.open(h.makeDoc(PAGES), 'doc-1');
  const old = h.fns.runSearch('gamma');
  await tick();
  h.open(h.makeDoc(['one', 'two']), 'doc-2');
  await h.finishRead();
  await old;
  assert.equal(h.st.hits, null);
  assert.deepEqual(h.st.navigated, []);
  const fresh = h.fns.runSearch('two');
  await h.finishRead();
  await fresh;
  assert.equal(h.st.hits?.[0]?.page, 2);
});

// COPY-18 (the reader's line). รุ่น is a cohort in this app; the version of
// the app that saved the strokes is a เวอร์ชัน, as the sync engine says it.
test('the legacy-ink banner says เวอร์ชันเก่า, not รุ่นเก่า', () => {
  assert.ok(SRC.includes('พบลายเส้นเวอร์ชันเก่าในเครื่องที่ยังไม่ได้ระบุเจ้าของ'), 'the banner must name the old version');
  assert.doesNotMatch(SRC, /รุ่น(?:เก่า|ก่อน|ใหม่)/, 'รุ่น must not stand for an app version in the reader');
});
