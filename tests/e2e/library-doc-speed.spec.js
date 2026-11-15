import http from 'node:http';
import { expect, test } from './fixtures.js';

// A library PDF used to be downloaded whole before page one was drawn: 22 s
// for a 24 MB deck on a 10 Mbit/s phone (docs/releases/5.238.0.md). Now the
// reader draws page one from the first bytes plus a byte range for the file's
// end (its cross-reference table), and the rest arrives behind it
// (src/lib/pdf-range-source.js). A server that cannot answer ranges gets the
// old whole download.
//
// The file is served by a small server in this test, because the point is a
// response that stops after its first megabyte and waits: Playwright's own
// route answers all at once.

test.use({ serviceWorkers: 'block' });

const SLUG = 'speed-test-deck';
const MB = 1024 * 1024;

// Page one near the start, 8 MB of filler no page uses, the other pages and
// the cross-reference table at the end: the layout of a slide deck exported
// to PDF, where page one is not reachable without the end of the file.
function deck() {
  const parts = [];
  const offsets = [];
  let length = 0;
  const add = (s) => { const b = Buffer.isBuffer(s) ? s : Buffer.from(s, 'latin1'); parts.push(b); length += b.length; };
  const obj = (n, body) => { offsets[n] = length; add(`${n} 0 obj\n${body}\nendobj\n`); };
  const content = (text) => { const s = `BT /F1 28 Tf 60 400 Td (${text}) Tj ET`; return `<</Length ${s.length}>>\nstream\n${s}\nendstream`; };
  add('%PDF-1.4\n');
  const pages = 3;
  obj(1, '<</Type/Catalog/Pages 2 0 R>>');
  obj(2, `<</Type/Pages/Kids[${Array.from({ length: pages }, (_, i) => `${10 + i * 2} 0 R`).join(' ')}]/Count ${pages}>>`);
  obj(3, '<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>');
  obj(10, '<</Type/Page/Parent 2 0 R/MediaBox[0 0 500 600]/Resources<</Font<</F1 3 0 R>>>>/Contents 11 0 R>>');
  obj(11, content('First page'));
  offsets[4] = length;
  add(`4 0 obj\n<</Length ${8 * MB}>>\nstream\n`); add(Buffer.alloc(8 * MB, 0x20)); add('\nendstream\nendobj\n');
  for (let i = 1; i < pages; i++) {
    obj(10 + i * 2, `<</Type/Page/Parent 2 0 R/MediaBox[0 0 500 600]/Resources<</Font<</F1 3 0 R>>>>/Contents ${11 + i * 2} 0 R>>`);
    obj(11 + i * 2, content(i === pages - 1 ? 'Lastpageword' : `Page ${i + 1}`));
  }
  const size = 11 + (pages - 1) * 2 + 1;
  const xref = length;
  add(`xref\n0 ${size}\n`);
  for (let n = 0; n < size; n++) add(offsets[n] === undefined ? '0000000000 65535 f \n' : `${String(offsets[n]).padStart(10, '0')} 00000 n \n`);
  add(`trailer\n<</Size ${size}/Root 1 0 R>>\nstartxref\n${xref}\n%%EOF\n`);
  return Buffer.concat(parts);
}
const FILE = deck();

// Serves FILE. The whole download sends its first megabyte and then waits for
// release(); a byte range is answered at once. `ranges: false` is a server
// that ignores Range and says so, as /api/library-blob did before 5.238.0.
function fileServer({ ranges }) {
  const state = { wholeSent: 0, rangeRequests: [], release: null };
  const released = new Promise((resolve) => { state.release = resolve; });
  const server = http.createServer(async (req, res) => {
    const cors = {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'range',
      'access-control-expose-headers': 'accept-ranges, content-length, content-range',
      'cache-control': 'no-store',
    };
    if (req.method === 'OPTIONS') { res.writeHead(204, cors); res.end(); return; }
    const m = /^bytes=(\d+)-(\d+)$/.exec(req.headers.range || '');
    if (ranges && m) {
      const from = Number(m[1]); const to = Math.min(FILE.length - 1, Number(m[2]));
      state.rangeRequests.push(`${from}-${to}`);
      res.writeHead(206, { ...cors, 'content-type': 'application/pdf', 'content-length': to - from + 1, 'content-range': `bytes ${from}-${to}/${FILE.length}`, 'accept-ranges': 'bytes' });
      res.end(FILE.subarray(from, to + 1));
      return;
    }
    if (m) state.rangeRequests.push(`ignored ${m[0]}`);
    res.writeHead(200, { ...cors, 'content-type': 'application/pdf', 'content-length': FILE.length, 'accept-ranges': ranges ? 'bytes' : 'none' });
    const head = FILE.subarray(0, MB);
    res.write(head);
    state.wholeSent = head.length;
    await released;
    for (let at = MB; at < FILE.length; at += 256 * 1024) {
      const piece = FILE.subarray(at, at + 256 * 1024);
      if (!res.write(piece)) await new Promise((r) => res.once('drain', r));
      state.wholeSent += piece.length;
    }
    res.end();
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, state, origin: `http://127.0.0.1:${server.address().port}` })));
}

async function openDeck(page, origin) {
  await page.route(/\/_vercel\/(insights|speed-insights)\/script[^/]*\.js|va\.vercel-scripts\.com\/.*script/,
    (route) => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.route('**/api/library-file?slug=*', (route) => route.fulfill({ json: { url: `${origin}/deck.pdf` } }));
  await page.goto('/app/tools/pdf');
  // The shelf's own saved copy of the catalogue names the deck, as on a phone
  // that has opened the library before.
  await page.evaluate(async ({ slug, size }) => {
    const cache = await caches.open('vmx-library-catalog-v1');
    await cache.put('/__vmx/library-catalog.json', new Response(JSON.stringify({ at: Date.now(), docs: [{
      id: slug, slug, title: 'Speed test deck', status: 'public', storage_provider: 'r2',
      mime: 'application/pdf', byte_size: size, sha256_16: 'abcdef0123456789', subject: 'epid',
    }] }), { headers: { 'content-type': 'application/json' } }));
  }, { slug: SLUG, size: FILE.length });
  await page.goto(`/app/tools/pdf?doc=${SLUG}`);
}

const ready = (page, n = 1) => page.locator(`[data-page="${n}"][data-render-state="ready"]`);

test('page one is drawn while most of the file has not arrived, and the rest still comes', async ({ page }) => {
  const { server, state, origin } = await fileServer({ ranges: true });
  try {
    await openDeck(page, origin);
    await expect(ready(page)).toBeVisible({ timeout: 30_000 });
    expect(state.wholeSent, 'only the first megabyte of the whole download has been sent').toBe(MB);
    expect(state.wholeSent / FILE.length).toBeLessThan(0.2);
    expect(state.rangeRequests.length, 'the end of the file came by range').toBeGreaterThan(0);
    expect(state.rangeRequests.length).toBeLessThanOrEqual(6);
    // A search asked for before the file is whole says why it is waiting.
    await page.getByRole('button', { name: /ค้นหาในเอกสาร/ }).first().click();
    await page.locator('#vmx-pdf-search').fill('Lastpageword');
    await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'ไฟล์ยังโหลดไม่ครบ' })).toBeVisible();
    state.release();
    // The rest arrives behind page one and the search finds the last page.
    await expect(page.getByText('1/1 หน้า 3')).toBeVisible({ timeout: 30_000 });
    expect(state.wholeSent).toBe(FILE.length);
  } finally {
    state.release();
    server.close();
  }
});

test('a server that cannot answer ranges gets the whole download, as before', async ({ page }) => {
  const { server, state, origin } = await fileServer({ ranges: false });
  try {
    await openDeck(page, origin);
    // Held after the first megabyte: the old download counts it out loud, and
    // no page is drawn while the file is not whole.
    await expect(page.getByText(/กำลังโหลด 1\.0 \/ 8\.0 MB/).first()).toBeVisible({ timeout: 30_000 });
    expect(state.wholeSent).toBe(MB);
    await expect(ready(page)).toHaveCount(0);
    state.release();
    await expect(ready(page)).toBeVisible({ timeout: 30_000 });
    expect(state.wholeSent).toBe(FILE.length);
    expect(state.rangeRequests, 'no range was asked of a server that said none').toEqual([]);
  } finally {
    state.release();
    server.close();
  }
});
