// /api/library-blob answers a byte range of a document whose size is
// catalogued (5.238.0), so the reader can draw page one from the end of a PDF
// while the rest downloads. Storage is read through R2's S3 API with a request
// signed here, which honours Range, so a range reads and is counted as its own
// bytes. When that route cannot be signed, the Cloudflare REST API is the
// fallback: it sends the object from byte 0, a range is cut here, and it is
// counted as every byte up to its end. These pin both routes, the count, the
// abuse the count exists for, and that nothing about who may read changed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import { finished } from 'node:stream/promises';

const MB = 1024 * 1024;
const S3_HOST = 'acct.r2.cloudflarestorage.com';

// route 'direct': permanent S3 keys in the environment, so the signed URL is
// made with no lookup. 'rest': the signed route is off, as when the token
// cannot sign. `s3` decides how the S3 route answers: 'ranges' (as R2 does) or
// a status to refuse with.
async function setup(t, { size, body = null, status = 'public', user = 'member', key = 'docs/deck.pdf', mime = 'application/pdf', route = 'direct', s3 = 'ranges' }) {
  const mod = await import('../../api/library-blob.js');
  const { mintBlobToken } = await import('../../api/_lib/blob-token.js');
  const saved = { ...process.env };
  t.after(() => { process.env = saved; mod.setDirectStorage(true); });
  Object.assign(process.env, { CLOUDFLARE_API_TOKEN: 'ranges-test', R2_ACCOUNT_ID: 'acct', R2_ACCESS_KEY_ID: 'test-key', R2_SECRET_ACCESS_KEY: 'test-secret' });
  mod.setDirectStorage(route === 'direct');
  const storage = { calls: 0, ranges: [], urls: [], auth: [], sent: 0 };
  const object = body || new Uint8Array(Math.min(size || 16, 4096));
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    storage.calls++;
    const range = init?.headers?.Range || null;
    storage.ranges.push(range);
    storage.urls.push(String(url));
    storage.auth.push(init?.headers?.Authorization || null);
    const m = /^bytes=(\d+)-(\d*)$/.exec(range || '');
    if (String(url).includes(S3_HOST)) {
      if (s3 !== 'ranges') return new Response('refused', { status: s3 });
      if (m) {
        // R2 honours Range: only the asked bytes leave storage.
        const from = Number(m[1]);
        const to = Math.min(size - 1, m[2] ? Number(m[2]) : size - 1);
        const part = object.length >= size ? object.slice(from, to + 1) : new Uint8Array(Math.min(to - from + 1, 4096));
        storage.sent += to - from + 1;
        return new Response(part, { status: 206, headers: { 'content-length': String(to - from + 1), 'content-range': `bytes ${from}-${to}/${size}` } });
      }
      storage.sent += size;
      return new Response(object, { status: 200 });
    }
    // The REST API ignores Range and answers the whole object.
    storage.sent += size;
    return new Response(new ReadableStream({ pull(c) { c.enqueue(object); c.close(); } }, { highWaterMark: 0 }), { status: 200 });
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

async function call(handler, token, { range, method = 'GET', ip = '203.0.113.90' } = {}) {
  const res = sink();
  await handler({ method, url: '/api/library-blob?' + new URLSearchParams(token), headers: { 'x-vercel-forwarded-for': ip, ...(range ? { range } : {}) } }, res);
  return res;
}

test('a range is read from storage by range, through a signed S3 request, and answered with exactly those bytes', async (t) => {
  const file = Uint8Array.from({ length: 1000 }, (_, i) => i % 251);
  const { default: handler, token, storage } = await setup(t, { size: 1000, body: file });
  const res = await call(handler, token, { range: 'bytes=900-999' });
  await finished(res);
  assert.equal(res.statusCode, 206);
  assert.equal(res.headers['content-range'], 'bytes 900-999/1000');
  assert.equal(res.headers['content-length'], '100');
  assert.equal(res.headers['accept-ranges'], 'bytes');
  assert.deepEqual([...res.bytes()], [...file.slice(900, 1000)]);
  assert.equal(storage.calls, 1);
  const asked = new URL(storage.urls[0]);
  assert.equal(asked.host, S3_HOST);
  assert.equal(asked.pathname, '/b/docs/deck.pdf', 'the bucket and key the signed link names');
  assert.ok(asked.searchParams.get('X-Amz-Signature'), 'signed');
  assert.ok(Number(asked.searchParams.get('X-Amz-Expires')) <= 120, 'and short-lived');
  assert.equal(storage.ranges[0], 'bytes=900-999');
  assert.equal(storage.auth[0], null, 'the account token never travels with it');
  assert.equal(storage.sent, 100, 'storage sent the range, not the file');
  const head = await call(handler, token, { method: 'HEAD' });
  assert.equal(head.headers['accept-ranges'], 'bytes');
});

test('when the signed route is refused, the REST route still answers, and the prefix it reads is counted', async (t) => {
  const file = Uint8Array.from({ length: 1000 }, (_, i) => i % 251);
  const { default: handler, token, storage } = await setup(t, { size: 1000, body: file, s3: 403, user: 'refused-route' });
  const res = await call(handler, token, { range: 'bytes=900-999' });
  await finished(res);
  assert.equal(res.statusCode, 206);
  assert.deepEqual([...res.bytes()], [...file.slice(900, 1000)]);
  assert.equal(storage.calls, 2);
  assert.match(storage.urls[1], /api\.cloudflare\.com\/client\/v4\/accounts\/acct\/r2\/buckets\/b\/objects\/docs\/deck\.pdf$/);
  assert.equal(storage.auth[1], 'Bearer ranges-test');
});

test('a document of unknown size is still downloaded whole and says it takes no ranges', async (t) => {
  const { default: handler, token } = await setup(t, { size: 0, user: 'unsized-reader' });
  const res = await call(handler, token, { range: 'bytes=0-9' });
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['accept-ranges'], 'none');
  assert.equal(res.headers['content-range'], undefined);
});

test('a malformed or multiple range on a document is ignored and the whole file answered, not a 416', async (t) => {
  const { default: handler, token, storage } = await setup(t, { size: 1000, user: 'download-manager' });
  for (const range of ['bytes=0-1,5-9', 'Bytes=0-9', 'bytes=x-y']) {
    const res = await call(handler, token, { range });
    assert.equal(res.statusCode, 200, range);
    assert.equal(res.headers['content-range'], undefined, range);
  }
  assert.ok(storage.ranges.every((r) => r === null), 'no Range reached storage');
});

test('a range is counted as the bytes storage sends for it: its own through S3, from byte 0 through REST', async () => {
  const { bytesPulled } = await import('../../api/library-blob.js');
  const n = 100 * MB;
  const tail = { offset: n - 65536, length: 65536 };
  assert.equal(bytesPulled({ n }, false), n, 'a whole GET counts the object');
  assert.equal(bytesPulled({ n }, false, tail, { fromStart: false }), 65536, 'the tail through S3 costs the tail');
  assert.equal(bytesPulled({ n }, false, tail), n, 'the tail through REST costs the file');
  assert.equal(bytesPulled({ n }, false, { offset: 0, length: 2 * n }, { fromStart: false }), n, 'capped at the object');
  assert.equal(bytesPulled({ n }, true, tail), 0, 'media stays outside the byte budget');
  assert.equal(bytesPulled({ n: 0 }, false, { offset: 0, length: 10 }), 1, 'unsized: counted as it streams, as before');
});

test('abuse: looping the tail of a 100 MB deck is refused at the 301st request on the link; looping the whole deck after 20', async (t) => {
  const size = 100 * MB;
  const { default: handler, token, BLOB_RATE, BLOB_BYTES, storage } = await setup(t, { size, user: 'tail-looper' });
  const tail = `bytes=${size - 65536}-${size - 1}`;
  for (let i = 0; i < BLOB_RATE.max; i++) {
    assert.equal((await call(handler, token, { range: tail, ip: '203.0.113.91' })).statusCode, 206, `tail ${i + 1}`);
  }
  assert.equal((await call(handler, token, { range: tail, ip: '203.0.113.91' })).statusCode, 429, 'the 301st');
  assert.equal(storage.calls, BLOB_RATE.max, 'the refused range never reached storage');
  assert.equal(storage.sent, BLOB_RATE.max * 65536, 'storage read 300 tails, about 19 MB, not 300 files');
  // The same member asking for the whole file by range, over and over, on
  // another link: 2 GB holds 20 of them, exactly as twenty whole opens.
  const { mintBlobToken } = await import('../../api/_lib/blob-token.js');
  const other = mintBlobToken({ storage_bucket: 'b', storage_key: 'docs/other.pdf', mime: 'application/pdf', byte_size: size, status: 'public' }, { user: 'whole-looper' });
  const allowed = Math.floor(BLOB_BYTES.max / size);
  assert.equal(allowed, 20);
  for (let i = 0; i < allowed; i++) assert.equal((await call(handler, other, { range: 'bytes=0-', ip: '203.0.113.93' })).statusCode, 206, `whole ${i + 1}`);
  assert.equal((await call(handler, other, { range: 'bytes=0-', ip: '203.0.113.93' })).statusCode, 429);
});

test('abuse, REST fallback: looping the tail of a 100 MB deck is refused where looping the whole deck was', async (t) => {
  const size = 100 * MB;
  const { default: handler, token, BLOB_BYTES, storage } = await setup(t, { size, user: 'rest-tail-looper', route: 'rest' });
  const allowed = Math.floor(BLOB_BYTES.max / size);
  assert.equal(allowed, 20);
  for (let i = 0; i < allowed; i++) {
    assert.equal((await call(handler, token, { range: `bytes=${size - 65536}-${size - 1}`, ip: '203.0.113.94' })).statusCode, 206, `tail ${i + 1}`);
  }
  assert.equal((await call(handler, token, { range: `bytes=${size - 65536}-${size - 1}`, ip: '203.0.113.94' })).statusCode, 429);
  assert.equal(storage.calls, allowed, 'the refused range never reached storage');
});

test('an honest open of a 24 MB and a 100 MB deck: how many fit in ten minutes on each route', async () => {
  const { bytesPulled, BLOB_BYTES } = await import('../../api/library-blob.js');
  // What the reader asked for on the measured 24.4 MB deck (AFTER.md): the
  // whole download, the tail, five 128 KB reads.
  const n24 = 25539014;
  const ranges24 = [[24772608, 25539014], [16646144, 16777216], [18874368, 19005440], [20185088, 20316160], [23789568, 23920640], [4456448, 4587520]];
  const open = (n, ranges, fromStart) => bytesPulled({ n }, false) + ranges.reduce((a, [from, to]) => a + bytesPulled({ n }, false, { offset: from, length: to - from }, { fromStart }), 0);
  const direct24 = open(n24, ranges24, false);
  const rest24 = open(n24, ranges24, true);
  assert.equal(Math.floor(BLOB_BYTES.max / direct24), 79, `S3: ${(direct24 / MB).toFixed(1)} MB per open`);
  assert.equal(Math.floor(BLOB_BYTES.max / rest24), 15, `REST: ${(rest24 / MB).toFixed(1)} MB per open`);
  // A 100 MB deck with the same shape (tail 2 MB, five 128 KB reads); the
  // reader caps ranges at 3x a file it does not keep (rangeChargeCap).
  const n100 = 100 * MB;
  const ranges100 = [[n100 - 2 * MB, n100], ...[0.65, 0.74, 0.79, 0.94, 0.17].map((p) => [Math.floor(n100 * p), Math.floor(n100 * p) + 128 * 1024])];
  const direct100 = open(n100, ranges100, false);
  assert.equal(Math.floor(BLOB_BYTES.max / direct100), 19, `S3: ${(direct100 / MB).toFixed(1)} MB per open`);
  const rest100 = bytesPulled({ n: n100 }, false) + 3 * n100;
  assert.equal(Math.floor(BLOB_BYTES.max / rest100), 5, 'REST, at the reader\'s cap');
});

test('every range request passes the same signed link check, and a restricted range is never cached', async (t) => {
  const file = Uint8Array.from({ length: 100 }, (_, i) => i);
  const { default: handler, token, storage } = await setup(t, { size: 100, body: file, status: 'restricted', user: 'restricted-reader' });
  const forged = await call(handler, { t: token.t, s: 'A'.repeat(43) }, { range: 'bytes=90-99' });
  assert.equal(forged.statusCode, 403);
  const tampered = await call(handler, { t: Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(token.t, 'base64url')), n: 1 })).toString('base64url'), s: token.s }, { range: 'bytes=0-0' });
  assert.equal(tampered.statusCode, 403, 'the size that sets the count is signed');
  assert.equal(storage.calls, 0, 'neither reached storage');
  const res = await call(handler, token, { range: 'bytes=90-99' });
  await finished(res);
  assert.equal(res.statusCode, 206);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['x-vetmock-library-access'], 'restricted');
});
