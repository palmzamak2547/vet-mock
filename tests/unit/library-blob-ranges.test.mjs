// /api/library-blob answers a byte range of a document whose size is
// catalogued (5.238.0), so the reader can draw page one from the end of a PDF
// while the rest downloads. Storage ignores Range and sends the object from
// byte 0, so every range costs this function every byte up to its end, and
// that is what it is counted as. These pin the cut, the count, the abuse the
// count exists for, and that nothing about who may read changed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import { finished } from 'node:stream/promises';

const MB = 1024 * 1024;

async function setup(t, { size, body = null, status = 'public', user = 'member', key = 'docs/deck.pdf', mime = 'application/pdf' }) {
  const mod = await import('../../api/library-blob.js');
  const { mintBlobToken } = await import('../../api/_lib/blob-token.js');
  const saved = { ...process.env };
  t.after(() => { process.env = saved; });
  Object.assign(process.env, { CLOUDFLARE_API_TOKEN: 'ranges-test', R2_ACCOUNT_ID: 'acct' });
  const storage = { calls: 0, ranges: [] };
  // Storage ignores Range and answers the whole object.
  t.mock.method(globalThis, 'fetch', async (_url, init) => {
    storage.calls++;
    storage.ranges.push(init?.headers?.Range || null);
    const bytes = body || new Uint8Array(16);
    return new Response(new ReadableStream({ pull(c) { c.enqueue(bytes); c.close(); } }, { highWaterMark: 0 }), { status: 200 });
  });
  const token = mintBlobToken({ storage_bucket: 'b', storage_key: key, mime, byte_size: size, status }, { user });
  return { ...mod, token, storage };
}

function sink() {
  const chunks = [];
  const res = new Writable({ write(c, _e, done) { chunks.push(c); done(); } });
  res.headers = {};
  res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v; };
  res.bytes = () => Buffer.concat(chunks);
  return res;
}

async function call(handler, token, { range, method = 'GET', ip = '203.0.113.90', query = '' } = {}) {
  const res = sink();
  await handler({ method, url: '/api/library-blob?' + new URLSearchParams(token) + query, headers: { 'x-vercel-forwarded-for': ip, ...(range ? { range } : {}) } }, res);
  return res;
}

test('a catalogued document answers a range with exactly those bytes, cut from the whole object storage sends', async (t) => {
  const file = Uint8Array.from({ length: 1000 }, (_, i) => i % 251);
  const { default: handler, token, storage } = await setup(t, { size: 1000, body: file });
  const res = await call(handler, token, { range: 'bytes=900-999' });
  await finished(res);
  assert.equal(res.statusCode, 206);
  assert.equal(res.headers['content-range'], 'bytes 900-999/1000');
  assert.equal(res.headers['content-length'], '100');
  assert.equal(res.headers['accept-ranges'], 'bytes');
  assert.deepEqual([...res.bytes()], [...file.slice(900, 1000)]);
  assert.equal(storage.ranges[0], 'bytes=900-999', 'still forwarded: a storage that one day honours it answers 206 itself');
  const head = await call(handler, token, { method: 'HEAD' });
  assert.equal(head.headers['accept-ranges'], 'bytes');
});

test('a document of unknown size is still downloaded whole and says it takes no ranges', async (t) => {
  const { default: handler, token } = await setup(t, { size: 0, user: 'unsized-reader' });
  const res = await call(handler, token, { range: 'bytes=0-9' });
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['accept-ranges'], 'none');
  assert.equal(res.headers['content-range'], undefined);
});

test('a range is counted as every byte storage sends to reach its end, never more than the object', async () => {
  const { bytesPulled } = await import('../../api/library-blob.js');
  const n = 100 * MB;
  assert.equal(bytesPulled({ n }, false), n, 'a whole GET counts the object');
  assert.equal(bytesPulled({ n }, false, { offset: n - 65536, length: 65536 }), n, 'the tail of a 100 MB deck costs 100 MB');
  assert.equal(bytesPulled({ n }, false, { offset: 0, length: 65536 }), 65536, 'the first chunk costs one chunk');
  assert.equal(bytesPulled({ n }, false, { offset: 10 * MB, length: 128 * 1024 }), 10 * MB + 128 * 1024);
  assert.equal(bytesPulled({ n }, false, { offset: 0, length: 2 * n }), n, 'capped at the object');
  assert.equal(bytesPulled({ n }, true, { offset: n - 1, length: 1 }), 0, 'media stays outside the byte budget');
  assert.equal(bytesPulled({ n: 0 }, false, { offset: 0, length: 10 }), 1, 'unsized: counted as it streams, as before');
});

test('abuse: a member who loops the tail of a 100 MB deck is stopped where looping the whole deck was', async (t) => {
  const size = 100 * MB;
  const { default: handler, token, BLOB_BYTES, storage } = await setup(t, { size, user: 'tail-looper' });
  const allowed = Math.floor(BLOB_BYTES.max / size);
  assert.equal(allowed, 20, 'the same 20 as twenty whole opens before 5.238.0');
  for (let i = 0; i < allowed; i++) {
    assert.equal((await call(handler, token, { range: `bytes=${size - 65536}-${size - 1}`, ip: '203.0.113.91' })).statusCode, 206, `tail ${i + 1}`);
  }
  const refused = await call(handler, token, { range: `bytes=${size - 65536}-${size - 1}`, ip: '203.0.113.91' });
  assert.equal(refused.statusCode, 429);
  assert.equal(storage.calls, allowed, 'the refused range never reached storage');
  // Their classmates are untouched.
  const { mintBlobToken } = await import('../../api/_lib/blob-token.js');
  const other = mintBlobToken({ storage_bucket: 'b', storage_key: 'docs/deck.pdf', mime: 'application/pdf', byte_size: size, status: 'public' }, { user: 'classmate' });
  assert.equal((await call(handler, other, { range: `bytes=${size - 65536}-${size - 1}`, ip: '203.0.113.91' })).statusCode, 206);
});

test('abuse: cheap ranges near the start are still stopped at 300 requests per link', async (t) => {
  const { default: handler, token, BLOB_RATE } = await setup(t, { size: 100 * MB, user: 'chunk-looper' });
  for (let i = 0; i < BLOB_RATE.max; i++) {
    assert.equal((await call(handler, token, { range: 'bytes=0-65535', ip: '203.0.113.92' })).statusCode, 206, `request ${i + 1}`);
  }
  assert.equal((await call(handler, token, { range: 'bytes=0-65535', ip: '203.0.113.92' })).statusCode, 429);
});

test('an honest open of a 25 MB and a 100 MB deck fits the member budget several times over', async (t) => {
  const { default: handler, bytesPulled, BLOB_BYTES } = await setup(t, { size: 16, user: 'pattern' });
  assert.ok(handler);
  // What the reader asks for (src/lib/pdf-range-source.js): one whole download,
  // the tail in one read, and at most MAX_RANGES in all; measured on a 24.4 MB
  // lecture deck: the tail and four page-tree reads at 65 to 94 percent in.
  // A file over 40 MB (not kept on the device) may spend at most 3x on ranges.
  const { MAX_RANGES, tailBytes, rangeChargeCap } = await import('../../src/lib/pdf-range-source.js');
  const measured25 = [25539014, 16777216, 19005440, 20316160, 23920640, 4587520]; // range ends, s25.pdf, 10 Mbit/s
  assert.ok(measured25.length <= MAX_RANGES);
  const cost25 = bytesPulled({ n: 25539014 }, false) + measured25.reduce((a, end) => a + bytesPulled({ n: 25539014 }, false, { offset: end - 1, length: 1 }), 0);
  assert.ok(Math.floor(BLOB_BYTES.max / cost25) >= 15, `the measured 24.4 MB open costs ${(cost25 / MB).toFixed(0)} MB: fifteen such opens in ten minutes`);
  for (const n of [25 * MB, 100 * MB]) {
    const perRange = bytesPulled({ n }, false, { offset: n - tailBytes(n), length: tailBytes(n) });
    const rangeCost = Math.min(MAX_RANGES * perRange, rangeChargeCap(n));
    const worst = bytesPulled({ n }, false) + rangeCost;
    const opens = Math.floor(BLOB_BYTES.max / worst);
    assert.ok(opens >= (n > 40 * MB ? 5 : 11), `${n / MB} MB: ${opens} worst-case opens in ten minutes`);
  }
});

test('every range request passes the same signed link check, and a restricted range is never cached', async (t) => {
  const file = Uint8Array.from({ length: 100 }, (_, i) => i);
  const { default: handler, token } = await setup(t, { size: 100, body: file, status: 'restricted', user: 'restricted-reader' });
  const forged = await call(handler, { t: token.t, s: 'A'.repeat(43) }, { range: 'bytes=90-99' });
  assert.equal(forged.statusCode, 403);
  const tampered = await call(handler, { t: Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(token.t, 'base64url')), n: 1 })).toString('base64url'), s: token.s }, { range: 'bytes=0-0' });
  assert.equal(tampered.statusCode, 403, 'the size that sets the count is signed');
  const res = await call(handler, token, { range: 'bytes=90-99' });
  await finished(res);
  assert.equal(res.statusCode, 206);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['x-vetmock-library-access'], 'restricted');
});
