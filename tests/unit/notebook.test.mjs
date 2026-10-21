// notebook: the list in this browser, ruling per paper, real PDF bytes.
import test from 'node:test';
import assert from 'node:assert/strict';

const store = new Map();
globalThis.localStorage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
const nb = await import('../../src/lib/notebook.js');

test('create, list newest first, rename, pages only grow, remove', () => {
  store.clear();
  const a = nb.createNotebook({ title: '  Anatomy ', paper: 'grid', pages: 3, now: 1, id: 'a' });
  const b = nb.createNotebook({ title: '', paper: 'nonsense', pages: 0, now: 2, id: 'b' });
  assert.equal(a.title, 'Anatomy');
  assert.deepEqual([b.title, b.paper, b.pages], ['สมุดเล่มใหม่', 'lined', 1]);
  assert.deepEqual(nb.listNotebooks().map((n) => n.id), ['b', 'a']);
  assert.equal(nb.updateNotebook('a', { pages: 2 }, 3).pages, 3, 'never shrinks');
  assert.equal(nb.updateNotebook('a', { pages: 9 }, 4).pages, 9);
  assert.equal(nb.updateNotebook('a', { title: 'Physio' }, 5).title, 'Physio');
  assert.deepEqual(nb.listNotebooks().map((n) => n.id), ['a', 'b'], 'the edited one comes first');
  assert.equal(nb.removeNotebook('b'), true);
  assert.equal(nb.removeNotebook('b'), false);
  assert.equal(nb.notebookKey('a'), 'nb:a');
});

test('ruling: lined has a margin, grid and dot fill the page, blank is empty', () => {
  const lined = nb.rulingFor('lined');
  assert.ok(lined.lines.length > 25 && lined.lines.length < 40);
  assert.ok(lined.lines.some(([x1, , x2]) => x1 === x2), 'the margin rule');
  assert.equal(nb.rulingFor('blank').lines.length, 0);
  assert.ok(nb.rulingFor('dot').dots.length > 2000, 'a 5 mm dot grid over A4');
  const cornell = nb.rulingFor('cornell').lines;
  assert.ok(cornell.some(([x1, y1, x2, y2]) => x1 === x2 && Math.round(x1) === 180), 'cue column at 2.5 in');
});

test('the PDF has the pages asked for', async () => {
  const { PDFDocument } = await import('pdf-lib');
  const bytes = await nb.buildNotebookPdf({ paper: 'lined', pages: 3 });
  const doc = await PDFDocument.load(bytes);
  assert.equal(doc.getPageCount(), 3);
  const [w, h] = [doc.getPage(0).getWidth(), doc.getPage(0).getHeight()];
  assert.deepEqual([Math.round(w), Math.round(h)], [595, 842]);
  // The ruling is shared, so pages cost almost nothing.
  const one = (await nb.buildNotebookPdf({ paper: 'dot', pages: 1 })).length;
  const many = (await nb.buildNotebookPdf({ paper: 'dot', pages: 100 })).length;
  assert.ok(many < one + 100 * 400, `100 dot pages ${many} bytes vs one ${one}`);
});
