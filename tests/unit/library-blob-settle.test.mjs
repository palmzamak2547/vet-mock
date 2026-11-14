// The bytes an unsized document streamed are counted before the handler
// returns (api/library-blob.js): a function frozen after its response would
// otherwise lose the count. The shared limiter here answers slowly, so a count
// left un-awaited is still in flight when the handler resolves.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Writable } from 'node:stream';

test('an unsized document\'s streamed bytes are counted before the handler resolves', async (t) => {
  const saved = { ...process.env };
  t.after(() => { process.env = saved; });
  Object.assign(process.env, {
    UPSTASH_REDIS_REST_URL: 'https://limiter.test', UPSTASH_REDIS_REST_TOKEN: 'limiter-token',
    CLOUDFLARE_API_TOKEN: 'settle-test', R2_ACCOUNT_ID: 'acct',
  });
  const counts = new Map();
  const finished = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    if (String(url).startsWith('https://limiter.test/pipeline')) {
      const commands = JSON.parse(init.body);
      await new Promise((r) => setTimeout(r, 25));
      const out = commands.map(([op, key, by]) => {
        if (op === 'INCR' || op === 'INCRBY') {
          const n = (counts.get(key) || 0) + (op === 'INCR' ? 1 : Number(by));
          counts.set(key, n);
          if (op === 'INCRBY') finished.push(Number(by));
          return { result: n };
        }
        return { result: 1 };
      });
      return Response.json(out);
    }
    const bytes = new Uint8Array(4096);
    return new Response(new ReadableStream({ pull(c) { c.enqueue(bytes); c.close(); } }, { highWaterMark: 0 }), { status: 200 });
  });
  const { default: handler } = await import(`../../api/library-blob.js?settle=${Date.now()}`);
  const { mintBlobToken } = await import('../../api/_lib/blob-token.js');
  const token = mintBlobToken({ storage_bucket: 'b', storage_key: 'docs/unsized.pdf', mime: 'application/pdf', byte_size: 0, status: 'public' }, { user: 'settle' });
  const res = new Writable({ write(_c, _e, done) { done(); } });
  res.headers = {};
  res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v; };
  await handler({ method: 'GET', url: '/api/library-blob?' + new URLSearchParams(token), headers: { 'x-vercel-forwarded-for': '203.0.113.210' } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(finished, [4095], 'the streamed 4,096 bytes (1 counted before serving) were recorded before the handler resolved');
});
