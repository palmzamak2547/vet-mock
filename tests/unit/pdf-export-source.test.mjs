// ============================================================
// pdf-export-source.test.mjs — export re-reads the original through a link
// that still works (B23)
// ============================================================
// Library decks open through a signed link that lives 15 to 75 minutes. The
// reader keeps only that URL, and a deck over 40 MB never enters the service
// worker's cache, so exporting ink after the window re-fetched a dead link and
// the toast read "โหลดไฟล์ต้นฉบับไม่สำเร็จ (403)" on every retry. readSourceBytes
// asks for a fresh link once on 401/403 and otherwise tells the student to
// reopen the document; no status code reaches the screen.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

const { readSourceBytes } = await import('../../src/lib/pdf-export.js');

const ok = (bytes) => ({ ok: true, status: 200, arrayBuffer: async () => bytes });
const fail = (status) => ({ ok: false, status, arrayBuffer: async () => { throw new Error('no body'); } });

test('an expired link is minted again once and the export goes on', async () => {
  const bytes = new ArrayBuffer(8);
  const calls = [];
  const src = { kind: 'url', url: '/api/library-blob?t=old&s=x&h=abc', resolve: async () => '/api/library-blob?t=new&s=y&h=abc' };
  const out = await readSourceBytes(src, { fetchImpl: async (u) => { calls.push(u); return u.includes('t=old') ? fail(403) : ok(bytes); } });
  assert.equal(out, bytes);
  assert.deepEqual(calls, ['/api/library-blob?t=old&s=x&h=abc', '/api/library-blob?t=new&s=y&h=abc']);
  assert.equal(src.url, '/api/library-blob?t=new&s=y&h=abc', 'the next export starts from the fresh link');
});

test('without a way to mint, the student is told to reopen, with no status code', async () => {
  for (const status of [401, 403]) {
    const src = { kind: 'url', url: '/api/library-blob?t=old' };
    const err = await readSourceBytes(src, { fetchImpl: async () => fail(status) }).then(() => null, (e) => e);
    assert.ok(err);
    assert.match(err.message, /เปิดเอกสารนี้ใหม่/);
    assert.doesNotMatch(err.message, /\d{3}/);
  }
});

test('a fresh link that is refused too, or a mint that fails, still asks to reopen', async () => {
  const src = { kind: 'url', url: '/old', resolve: async () => '/new' };
  const e1 = await readSourceBytes(src, { fetchImpl: async () => fail(403) }).then(() => null, (e) => e);
  assert.match(e1.message, /เปิดเอกสารนี้ใหม่/);
  const src2 = { kind: 'url', url: '/old', resolve: async () => { throw new Error('mint failed'); } };
  const e2 = await readSourceBytes(src2, { fetchImpl: async () => fail(403) }).then(() => null, (e) => e);
  assert.match(e2.message, /เปิดเอกสารนี้ใหม่/);
});

test('other failures say so in Thai without a status code, and a file source is read directly', async () => {
  const err = await readSourceBytes({ kind: 'url', url: '/x' }, { fetchImpl: async () => fail(500) }).then(() => null, (e) => e);
  assert.match(err.message, /[฀-๿]/);
  assert.doesNotMatch(err.message, /\d{3}/);
  const bytes = new ArrayBuffer(4);
  assert.equal(await readSourceBytes({ kind: 'file', file: { arrayBuffer: async () => bytes } }), bytes);
  await assert.rejects(readSourceBytes(null), /ไม่พบไฟล์ต้นฉบับ/);
});

test('a working link is fetched once and never re-minted', async () => {
  let minted = 0;
  const bytes = new ArrayBuffer(2);
  const out = await readSourceBytes({ kind: 'url', url: '/ok', resolve: async () => { minted += 1; return '/other'; } },
    { fetchImpl: async () => ok(bytes) });
  assert.equal(out, bytes);
  assert.equal(minted, 0);
});

test('the reader exports through readSourceBytes and keeps the link minter (wiring)', async () => {
  const { readFileSync } = await import('node:fs');
  const view = readFileSync(new URL('../../src/views/PdfAnnotateView.jsx', import.meta.url), 'utf8');
  assert.match(view, /import \{[^}]*\breadSourceBytes\b[^}]*\} from '\.\.\/lib\/pdf-export\.js';/);
  assert.match(view, /sourceRef\.current = \{ kind: 'url', url, resolve: typeof doc\.resolve === 'function' \? doc\.resolve : null \};/);
  assert.match(view, /return readSourceBytes\(sourceRef\.current\);/);
  assert.doesNotMatch(view, /โหลดไฟล์ต้นฉบับไม่สำเร็จ \(\$\{res\.status\}\)/, 'no bare status code in the export error');
});
