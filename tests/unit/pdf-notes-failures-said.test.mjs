// The PDF reader says a refused notebook write where the student acted, and
// counts the failures a student cannot act on (the recent list, the legacy
// ink migration) through reportFailure instead of swallowing them.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const view = readFileSync(new URL('../../src/views/PdfAnnotateView.jsx', import.meta.url), 'utf8');
const shelf = readFileSync(new URL('../../src/components/NotebookShelf.jsx', import.meta.url), 'utf8');

// The handler as it ships: from `const <name> = useCallback(` to its deps line.
function shipped(name, depsLine) {
  const start = view.indexOf(`const ${name} = useCallback(`);
  const end = view.indexOf(depsLine, start);
  assert.ok(start > 0 && end > start, `find ${name} in the reader`);
  return view.slice(view.indexOf('useCallback(', start) + 'useCallback('.length, end + 1);
}

const notSavedLiteral = shelf.match(/NOT_SAVED = (\{[^\n]*\});/);
assert.ok(notSavedLiteral, 'the shelf keeps its บันทึกไม่สำเร็จ notice');
const NOT_SAVED = vm.runInNewContext(`(${notSavedLiteral[1]})`);

function run(source, context) {
  return vm.runInNewContext(`(${source})`, context);
}

test('add page on a refused write says บันทึกไม่สำเร็จ and adds no page that would vanish', () => {
  const said = [];
  const opened = [];
  const addPage = run(shipped('addNotebookPage', '}, [openNotebook, showToast]);'), {
    notebookRef: { current: { id: 'nb1', pages: 2 } },
    NOTEBOOK_MAX_PAGES: 40,
    showToast() {},
    saveNow() {},
    updateNotebook: () => null,
    alertDialog: (o) => { said.push(o); },
    NOT_SAVED,
    openNotebook: (nb, opts) => { opened.push({ nb, opts }); },
  });
  addPage();
  assert.equal(said.length, 1, 'the student is told');
  assert.equal(said[0].title, 'บันทึกไม่สำเร็จ');
  assert.equal(opened.length, 0, 'no unsaved page is opened');
});

test('add page that saves opens the new page and says nothing', () => {
  const said = [];
  const opened = [];
  const addPage = run(shipped('addNotebookPage', '}, [openNotebook, showToast]);'), {
    notebookRef: { current: { id: 'nb1', pages: 2 } },
    NOTEBOOK_MAX_PAGES: 40,
    showToast() {},
    saveNow() {},
    updateNotebook: (id, patch) => ({ id, pages: patch.pages }),
    alertDialog: (o) => { said.push(o); },
    NOT_SAVED,
    openNotebook: (nb, opts) => { opened.push({ nb, opts }); },
  });
  addPage();
  assert.equal(said.length, 0);
  assert.equal(opened.length, 1);
  assert.equal(opened[0].nb.pages, 3);
  assert.equal(opened[0].opts.page, 3);
});

test('opening a notebook the device refuses to keep says บันทึกไม่สำเร็จ and still opens it', async () => {
  const said = [];
  const ingested = [];
  const open = run(shipped('openNotebook', '}, [ingestRemote]);'), {
    updateNotebook: () => null,
    alertDialog: (o) => { said.push(o); },
    NOT_SAVED,
    buildNotebookPdf: async () => new Uint8Array(1),
    notebookRef: { current: null },
    notebookKey: (id) => `nb:${id}`,
    ingestRemote: (o) => { ingested.push(o); },
  });
  await open({ id: 'nb1', title: 'สมุด', paper: 'lined', pages: 1 });
  assert.equal(said.length, 1);
  assert.equal(said[0].title, 'บันทึกไม่สำเร็จ');
  assert.equal(ingested.length, 1, 'the notebook still opens');
});

test('a recent list that cannot be read is counted, not swallowed', async () => {
  const reports = [];
  const refresh = run(shipped('refreshRecent', '}, [listRecentPdfs]);'), {
    listRecentPdfs: () => Promise.reject(new Error('idb read failed')),
    setRecent() { throw new Error('nothing to show'); },
    reportFailure: (kind, error) => { reports.push({ kind, error }); },
    String,
  });
  refresh();
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(reports.length, 1);
  assert.equal(reports[0].kind, 'load');
  assert.equal(reports[0].error.message, 'idb read failed');
});

test('a legacy ink migration that cannot write is counted once, with its reason', async () => {
  const prevWindow = globalThis.window;
  const target = new EventTarget();
  target.localStorage = {
    getItem: (k) => (k === 'vmx-pdf-annotations' ? JSON.stringify({ deck: { fileName: 'deck.pdf', strokesByPage: {} } }) : null),
  };
  const failures = [];
  target.addEventListener('vmx-failure', (e) => failures.push(e.detail));
  globalThis.window = target;
  try {
    assert.equal(typeof indexedDB, 'undefined', 'node has no IndexedDB, so the copy fails');
    const mod = await import(`../../src/lib/pdf-annotations.js?legacy-fail=${Date.now()}`);
    await mod.listRecentPdfs();
    await mod.loadAnnotations('deck');
    assert.equal(failures.length, 1, 'one failure, however many readers wait on the migration');
    assert.equal(failures[0].kind, 'save');
    assert.equal(failures[0].message, 'no-idb');
  } finally {
    globalThis.window = prevWindow;
  }
});
