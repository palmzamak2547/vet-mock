// ============================================================
// library-doc-open — how a library document reaches the student (1 Nov 2026)
// ============================================================
// Walked on vetmock.com in six browser profiles:
//   • the reader kept a shelf deck in App state only, so a reload, browser
//     Forward or iOS reloading a killed tab landed on the empty "เปิด PDF"
//     page: the deck is now named in the reader's address;
//   • 214 Word, PowerPoint and Excel files went out as an
//     application/octet-stream attachment, because "openxmlformats" matched
//     the html/xml guard;
//   • the 61 library videos answered a byte range with the whole file and
//     Accept-Ranges: none, and Safari on iPhone and iPad plays media only from
//     a server that answers ranges with 206.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import { finished } from 'node:stream/promises';
import handler, { contentHeaders, sliceBody } from '../../api/library-blob.js';
import { mintBlobToken } from '../../api/_lib/blob-token.js';
import { readerTarget, readerUrl, viewForAppPath } from '../../src/lib/view-route.js';
import { contentHitRows } from '../../src/lib/library.js';
import { vcaLibraryDocs } from '../../src/lib/vca-library.js';
import { VCA_MATERIALS } from '../../src/data/vca-materials.js';

test('the reader address names the deck, and a link may ask for a page', () => {
  assert.equal(viewForAppPath('/app/tools/pdf'), 'pdf-annotate');
  assert.equal(readerUrl('fiqc-sp-e1-2-8303d4'), '/app/tools/pdf?doc=fiqc-sp-e1-2-8303d4');
  assert.equal(readerUrl('fiqc-sp-e1-2-8303d4', 8), '/app/tools/pdf?doc=fiqc-sp-e1-2-8303d4&page=8');
  assert.equal(readerUrl('deck', 1), '/app/tools/pdf?doc=deck', 'page 1 is where a deck opens anyway');
  // Thai slugs are real (library-file accepts them): they survive the round trip.
  const thai = 'fiqc-ml-acfs-1-การควบคุมคุณภาพ-2a322b';
  assert.deepEqual(readerTarget(new URL(readerUrl(thai, 3), 'https://vetmock.com').search), { slug: thai, page: 3 });
  assert.deepEqual(readerTarget('?doc=deck&page=0'), { slug: 'deck', page: null });
  assert.deepEqual(readerTarget('?doc=deck&page=2.5'), { slug: 'deck', page: null });
  for (const bad of ['', '?doc=', '?doc=../etc', '?doc=Deck', '?doc=a%20b', '?q=deck', '?doc=-x']) {
    assert.equal(readerTarget(bad), null, `${bad} names no deck`);
  }
});

test('a text match inside any PDF a VCA card groups is shown and opens that file', () => {
  // 146 VCA copies are not their card's own file; 1 of the 8 archive matches
  // for "diagnosis" on vetmock.com (1 Nov 2026) was one, and it never showed.
  const cards = vcaLibraryDocs(VCA_MATERIALS);
  const card = cards.find((c) => (c.source_files || []).some((f) => (f.backups || []).some((b) => b.mime === 'application/pdf' && b.slug !== c.slug)));
  assert.ok(card, 'the shelf still has a card that groups more than one PDF');
  const other = card.source_files.flatMap((f) => f.backups || []).find((b) => b.mime === 'application/pdf' && b.slug !== card.slug);
  const hits = contentHitRows([{ slug: card.slug, page: 2 }, { slug: other.slug, page: 7 }, { slug: 'not-on-the-shelf', page: 1 }], [card]);
  assert.deepEqual(hits.map((h) => h.slug), [card.slug, other.slug], 'nothing outside the shelf\'s filters, nothing grouped dropped');
  assert.equal(hits[1].doc.slug, other.slug, 'the match opens the file it was found in');
  assert.equal(hits[1].doc.range_supported, true, 'and reads it by range, as the card itself does');
  assert.deepEqual(contentHitRows([{ slug: other.slug, page: 7 }], []), [], 'a card the filters hide hides its files too');
});

test('Word, PowerPoint and Excel files go out as themselves, never as unknown attachments', () => {
  for (const m of [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]) assert.deepEqual(contentHeaders({ m }), { type: m, disposition: 'inline' }, m);
  // The guard itself still holds for anything a browser would run as a page.
  for (const m of ['text/html', 'image/svg+xml', 'application/xhtml+xml', 'text/javascript',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document+html']) {
    assert.deepEqual(contentHeaders({ m }), { type: 'application/octet-stream', disposition: 'attachment' }, m);
  }
});

// ── Byte ranges through /api/library-blob ─────────────────────────────────

const BYTES = Uint8Array.from({ length: 20 }, (_, i) => i + 1);

function storage(t, { mime, chunk = 3, onCancel = () => {} }) {
  const previous = { CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN, R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID };
  process.env.CLOUDFLARE_API_TOKEN = 'range-test-only';
  process.env.R2_ACCOUNT_ID = 'range-test-account';
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  });
  const asked = [];
  // Storage as it behaves: the whole object, whatever Range was sent.
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    asked.push(options.headers.Range ?? null);
    let at = 0;
    const body = new ReadableStream({
      pull(controller) {
        if (at >= BYTES.length) { controller.close(); return; }
        controller.enqueue(BYTES.slice(at, at + chunk));
        at += chunk;
      },
      cancel: onCancel,
    });
    return new Response(body, { status: 200, headers: { 'content-length': String(BYTES.length), 'content-type': mime } });
  });
  const token = mintBlobToken({ storage_bucket: 'test', storage_key: 'docs/abc/clip.bin', mime, byte_size: BYTES.length, status: 'public' });
  return { url: '/api/library-blob?' + new URLSearchParams(token), asked };
}

function response() {
  const chunks = [];
  const res = new Writable({ write(chunk, _encoding, done) { chunks.push(chunk); done(); } });
  res.headers = new Map();
  res.setHeader = (name, value) => res.headers.set(name.toLowerCase(), String(value));
  res.bytes = () => [...Buffer.concat(chunks)];
  return res;
}

async function get(url, headers = {}, method = 'GET') {
  const res = response();
  await handler({ method, url, headers }, res);
  if (!res.writableFinished) await finished(res).catch(() => {});
  return res;
}

test('a video answers a byte range with exactly those bytes and 206', async (t) => {
  const { url, asked } = storage(t, { mime: 'video/mp4' });
  const first = await get(url, { range: 'bytes=0-1' });
  assert.equal(first.statusCode, 206);
  assert.equal(first.headers.get('content-range'), 'bytes 0-1/20');
  assert.equal(first.headers.get('content-length'), '2');
  assert.equal(first.headers.get('accept-ranges'), 'bytes');
  assert.deepEqual(first.bytes(), [1, 2]);
  // Across storage's chunk edges, open-ended and from the end.
  assert.deepEqual((await get(url, { range: 'bytes=5-12' })).bytes(), [6, 7, 8, 9, 10, 11, 12, 13]);
  assert.deepEqual((await get(url, { range: 'bytes=17-' })).bytes(), [18, 19, 20]);
  assert.deepEqual((await get(url, { range: 'bytes=-4' })).bytes(), [17, 18, 19, 20]);
  assert.deepEqual(asked, [null, null, null, null], 'storage is asked for the whole object, never a range it would ignore');
  const beyond = await get(url, { range: 'bytes=40-' });
  assert.equal(beyond.statusCode, 416);
  assert.equal(beyond.headers.get('content-range'), 'bytes */20');
  const whole = await get(url);
  assert.equal(whole.statusCode, 200);
  assert.equal(whole.headers.get('accept-ranges'), 'bytes', 'a whole read tells the player it may seek');
  assert.equal(whole.bytes().length, 20);
  assert.equal((await get(url, {}, 'HEAD')).headers.get('accept-ranges'), 'bytes');
});

test('a range lets storage go once its bytes are out', async (t) => {
  let cancelled = false;
  const { url } = storage(t, { mime: 'audio/mpeg', chunk: 2, onCancel: () => { cancelled = true; } });
  assert.deepEqual((await get(url, { range: 'bytes=2-3' })).bytes(), [3, 4]);
  assert.equal(cancelled, true, 'the rest of the object is not pulled through the function');
});

test('a PDF still comes back whole: a viewer told it may seek would pull the deck once per range', async (t) => {
  const { url } = storage(t, { mime: 'application/pdf' });
  const res = await get(url, { range: 'bytes=0-1' });
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers.get('accept-ranges'), 'none');
  assert.equal(res.bytes().length, 20);
});

test('sliceBody reports an object shorter than its catalogued size instead of ending quietly', async () => {
  const body = new ReadableStream({ start(c) { c.enqueue(new Uint8Array([1, 2, 3])); c.close(); } });
  const reader = sliceBody(body, 1, 5).getReader();
  assert.deepEqual([...(await reader.read()).value], [2, 3]);
  await assert.rejects(reader.read(), /object_shorter_than_catalogued/);
});
