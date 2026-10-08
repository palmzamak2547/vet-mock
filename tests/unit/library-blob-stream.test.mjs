import test from 'node:test';
import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import { finished } from 'node:stream/promises';
import handler from '../../api/library-blob.js';
import { mintBlobToken } from '../../api/_lib/blob-token.js';

function storage(t, fetchImpl, status = 'restricted') {
  const previous = { CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN, R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID };
  process.env.CLOUDFLARE_API_TOKEN = 'stream-test-only';
  process.env.R2_ACCOUNT_ID = 'stream-test-account';
  t.mock.method(globalThis, 'fetch', fetchImpl);
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  });
  const token = mintBlobToken({ storage_bucket: 'test', storage_key: 'docs/lecture.pdf', mime: 'application/pdf', byte_size: 6, status });
  return { method: 'GET', url: '/api/library-blob?' + new URLSearchParams(token), headers: {} };
}

function response(write) {
  const chunks = [];
  const res = new Writable({ highWaterMark: 1, write: write || ((chunk, _encoding, done) => { chunks.push(chunk); setImmediate(done); }) });
  res.headers = new Map();
  res.setHeader = (name, value) => res.headers.set(name.toLowerCase(), value);
  res.bytes = () => Buffer.concat(chunks);
  return res;
}

async function settles(pending) {
  let timer;
  try {
    await Promise.race([pending, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('stream handler did not settle after cancellation')), 1000); })]);
  } finally { clearTimeout(timer); }
}

test('closing during upstream headers aborts the pending storage request', async (t) => {
  let started;
  const ready = new Promise((resolve) => { started = resolve; });
  let signal;
  const req = storage(t, async (_url, options) => {
    signal = options.signal;
    started();
    return new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }));
  });
  const res = response();
  const pending = handler(req, res);
  await ready;
  res.destroy();
  await settles(pending);
  assert.equal(signal.aborted, true);
});

test('the existing storage timeout still aborts with a controlled failure and clears its timer', async (t) => {
  let expire;
  let delay;
  let cleared;
  const timer = {};
  t.mock.method(globalThis, 'setTimeout', (callback, ms) => { expire = callback; delay = ms; return timer; });
  t.mock.method(globalThis, 'clearTimeout', (value) => { cleared = value; });
  const req = storage(t, async (_url, { signal }) => new Promise((_, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  }));
  const res = response();
  const pending = handler(req, res);
  assert.equal(delay, 60_000);
  expire();
  await pending;
  await finished(res);
  assert.equal(res.statusCode, 502);
  assert.deepEqual(JSON.parse(res.bytes().toString()), { error: 'storage_unavailable' });
  assert.equal(cleared, timer);
});

test('closing before the first body byte cancels a pending upstream read', async (t) => {
  let reading;
  const ready = new Promise((resolve) => { reading = resolve; });
  let cancelled = false;
  const body = new ReadableStream({ pull() { reading(); }, cancel() { cancelled = true; } }, { highWaterMark: 0 });
  const req = storage(t, async () => new Response(body));
  const res = response();
  const pending = handler(req, res);
  await ready;
  res.destroy();
  await settles(pending);
  assert.equal(cancelled, true);
});

test('closing a backpressured download cancels upstream instead of waiting forever for drain', async (t) => {
  let written;
  const ready = new Promise((resolve) => { written = resolve; });
  let cancelled = false;
  const body = new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(100)); },
    cancel() { cancelled = true; },
  });
  const req = storage(t, async () => new Response(body));
  const res = response((_chunk, _encoding, _done) => { written(); });
  const pending = handler(req, res);
  await ready;
  assert.equal(res.writableNeedDrain, true);
  res.destroy();
  await settles(pending);
  assert.equal(cancelled, true);
  assert.equal(res.writableFinished, false);
});

test('an upstream body failure terminates the download without claiming complete bytes', async (t) => {
  let controller;
  const body = new ReadableStream({ start(value) { controller = value; controller.enqueue(new Uint8Array(3)); } });
  const req = storage(t, async () => new Response(body));
  const res = response((_chunk, _encoding, done) => { controller.error(new Error('storage connection lost')); done(); });
  await settles(handler(req, res));
  await finished(res).catch(() => {});
  assert.equal(res.writableFinished, false, 'a truncated body is not a completed download');
  assert.equal(res.destroyed, true);
});

test('successful backpressured downloads keep every byte and restricted cache headers', async (t) => {
  const req = storage(t, async () => new Response(new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array([1, 2, 3])); controller.enqueue(new Uint8Array([4, 5, 6])); controller.close(); },
  }), { headers: { 'Content-Length': '6', ETag: '"lecture-v1"' } }));
  const res = response();
  await handler(req, res);
  await finished(res);
  assert.equal(res.writableFinished, true);
  assert.deepEqual([...res.bytes()], [1, 2, 3, 4, 5, 6]);
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers.get('content-type'), 'application/pdf');
  assert.equal(res.headers.get('content-length'), '6');
  assert.equal(res.headers.get('etag'), '"lecture-v1"');
  assert.equal(res.headers.get('accept-ranges'), 'none');
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.equal(res.headers.get('x-vetmock-library-access'), 'restricted');
  assert.match(res.headers.get('content-disposition'), /^inline; filename="lecture.pdf";/);
});

test('partial public downloads preserve range status, headers and request range', async (t) => {
  let range;
  const req = storage(t, async (_url, options) => {
    range = options.headers.Range;
    return new Response(new Uint8Array([4, 5, 6]), { status: 206, headers: { 'Content-Length': '3', 'Content-Range': 'bytes 3-5/6' } });
  }, 'public');
  req.headers.range = 'bytes=3-5';
  const res = response();
  await handler(req, res);
  await finished(res);
  assert.equal(range, 'bytes=3-5');
  assert.equal(res.statusCode, 206);
  assert.deepEqual([...res.bytes()], [4, 5, 6]);
  assert.equal(res.headers.get('content-range'), 'bytes 3-5/6');
  assert.equal(res.headers.get('content-length'), '3');
  assert.equal(res.headers.get('accept-ranges'), 'bytes');
  assert.match(res.headers.get('cache-control'), /^private, max-age=\d+$/);
});

test('upstream refusals retain their error status and are never cached', async (t) => {
  let upstreamStatus = 404;
  const req = storage(t, async () => new Response('storage error', { status: upstreamStatus }));
  for (const [status, expected] of [[404, 404], [403, 502], [500, 502]]) {
    upstreamStatus = status;
    const res = response();
    await handler(req, res);
    await finished(res);
    assert.equal(res.statusCode, expected);
    assert.equal(res.headers.get('cache-control'), 'no-store');
    assert.deepEqual(JSON.parse(res.bytes().toString()), { error: 'object_unavailable' });
  }
});
