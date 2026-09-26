import test from 'node:test';
import assert from 'node:assert/strict';

// Only the mock below can answer either configured upstream.
process.env.UPSTASH_REDIS_REST_URL = 'https://quota.example.invalid';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-only';
process.env.YOUTUBE_API_KEY = 'test-only';
const { default: handler } = await import('../../api/playlist.js');

async function run({ count = 0, unavailableAt = 0 } = {}) {
  const events = [];
  let debits = 0;
  let pages = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    const target = new URL(url);
    if (target.hostname === 'quota.example.invalid') {
      const commands = JSON.parse(init.body);
      const provider = commands.some(c => c[0] === 'INCR' && c[1] === 'rl:provider:youtube-data-api:daily');
      if (provider) {
        events.push('debit');
        debits++;
        count++;
        if (debits === unavailableAt) return new Response('', { status: 503 });
      }
      return Response.json(commands.map(c => ({ result: c[0] === 'TTL' ? 3600 : c[0] === 'INCR' && provider ? count : 1 })));
    }
    if (target.hostname === 'www.googleapis.com') {
      assert.equal(events.at(-1), 'debit', 'every Google request must immediately follow a provider debit');
      if (target.pathname.endsWith('/playlistItems')) {
        events.push('playlistItems');
        pages++;
        return Response.json({
          items: Array.from({ length: 50 }, (_, i) => ({ snippet: { resourceId: { videoId: `video-${pages}-${i}` }, title: 'Lecture' } })),
          ...(pages < 5 ? { nextPageToken: `page-${pages + 1}` } : {}),
        });
      }
      assert.ok(target.pathname.endsWith('/videos'));
      events.push('videos');
      return Response.json({ items: target.searchParams.get('id').split(',').map(id => ({ id, contentDetails: { duration: 'PT5M30S' } })) });
    }
    assert.equal(target.hostname, 'www.youtube.com', 'unexpected network target');
    events.push('rss');
    return new Response('<feed></feed>');
  };
  const res = {
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
  try {
    await handler({ method: 'GET', query: { id: 'PL-quota-audit-123' }, headers: { 'x-vercel-forwarded-for': '192.0.2.55' } }, res);
    return { res, events, debits };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('five playlist pages and five duration batches each debit the provider quota', async () => {
  const { res, events, debits } = await run();
  assert.equal(res.code, 200);
  assert.equal(res.body.source, 'api');
  assert.equal(res.body.count, 250);
  assert.ok(res.body.items.every(item => item.duration === '5:30'));
  assert.equal(events.filter(e => e === 'playlistItems').length, 5);
  assert.equal(events.filter(e => e === 'videos').length, 5);
  assert.equal(debits, 10);
});

test('quota cutoff stops the next playlist page and falls back to uncached RSS', async () => {
  const { res, events, debits } = await run({ count: 7999 });
  assert.equal(res.code, 200);
  assert.equal(res.body.source, 'rss');
  assert.equal(res.body.reason, 'budget_exhausted');
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.equal(events.filter(e => e === 'playlistItems').length, 1);
  assert.equal(events.filter(e => e === 'videos').length, 0);
  assert.equal(events.filter(e => e === 'rss').length, 1);
  assert.equal(debits, 2);
});

test('quota cutoff skips optional durations while retaining the complete playlist', async () => {
  const { res, events, debits } = await run({ count: 7995 });
  assert.equal(res.code, 200);
  assert.equal(res.body.source, 'api');
  assert.equal(res.body.count, 250);
  assert.ok(res.body.items.every(item => item.duration === undefined));
  assert.equal(events.filter(e => e === 'playlistItems').length, 5);
  assert.equal(events.filter(e => e === 'videos' || e === 'rss').length, 0);
  assert.equal(debits, 6);
});

for (const [stage, unavailableAt, allowedPages] of [['pagination', 2, 1], ['optional durations', 6, 5]]) {
  test(`a shared limiter outage during ${stage} fails closed without RSS`, async () => {
    const { res, events } = await run({ unavailableAt });
    assert.equal(res.code, 503);
    assert.equal(res.body.reason, 'temporarily_unavailable');
    assert.equal(res.headers['Cache-Control'], 'private, no-store');
    assert.equal(res.headers['Retry-After'], '30');
    assert.equal(events.filter(e => e === 'playlistItems').length, allowedPages);
    assert.equal(events.filter(e => e === 'videos' || e === 'rss').length, 0);
  });
}
