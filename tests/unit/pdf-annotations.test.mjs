// The annotation record is one localStorage key shared by two writers on
// different debounce clocks: the stroke autosave (500 ms, passes strokes,
// no lastPage) and the reading-position tracker (800 ms, passes lastPage,
// no strokes). saveAnnotations merges field-by-field so neither writer can
// erase the other's work — the property pinned here.
import test from 'node:test';
import assert from 'node:assert/strict';

function fakeWindow() {
  const store = new Map();
  return {
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
  };
}

test('stroke autosave and page tracker cannot clobber each other', async () => {
  globalThis.window = fakeWindow();
  try {
    const { saveAnnotations, loadAnnotations } = await import('../../src/lib/pdf-annotations.js');
    saveAnnotations('h1', { fileName: 'a.pdf', pageCount: 10, strokesByPage: { 2: [{ mode: 'pen' }] } });
    // page tracker fires: lastPage only
    saveAnnotations('h1', { fileName: 'a.pdf', pageCount: 10, lastPage: 7 });
    // stroke autosave fires after it: strokes only
    saveAnnotations('h1', { fileName: 'a.pdf', pageCount: 10, strokesByPage: { 2: [{ mode: 'pen' }, { mode: 'pen' }] } });
    const rec = loadAnnotations('h1');
    assert.equal(rec.lastPage, 7, 'a stroke save must not erase the reading position');
    assert.equal(rec.strokesByPage['2'].length, 2, 'a page save must not erase strokes');
  } finally {
    delete globalThis.window;
  }
});

test('lastPage defaults to 1 for records that predate the field', async () => {
  globalThis.window = fakeWindow();
  try {
    const { saveAnnotations, loadAnnotations } = await import('../../src/lib/pdf-annotations.js');
    saveAnnotations('old', { fileName: 'b.pdf', pageCount: 3 });
    assert.equal(loadAnnotations('old').lastPage, 1);
  } finally {
    delete globalThis.window;
  }
});
