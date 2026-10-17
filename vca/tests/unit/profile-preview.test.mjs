// api/u.js: a shared /u/<handle> link answers with the app shell carrying that profile's title,
// description and cover, escapes what the student typed, and falls back to the plain shell.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

const SHELL = '<html><head><title>VetMock VCA</title><link rel="canonical" href="https://vca.vetmock.com/" />'
  + '<meta property="og:title" content="home" /><meta property="og:image" content="https://vca.vetmock.com/og/home.png" />'
  + '<meta name="twitter:image" content="x" /></head><body><div id="root"></div></body></html>';
const PROFILES = {
  anuthin: { user_id: 'a852a209-71ce-4a46-9efd-e13718a346cb', handle: 'anuthin', display_name: 'Anuthin', bio: null },
  sneaky: { user_id: 'b852a209-71ce-4a46-9efd-e13718a346cb', handle: 'sneaky', display_name: '"><script>alert(1)</script>', bio: 'a & b' },
};
let handler;
let realFetch;
const calls = [];

before(async () => {
  process.env.VITE_SUPABASE_URL = 'https://db.example';
  process.env.VITE_SUPABASE_ANON_KEY = 'anon';
  realFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts = {}) => {
    calls.push(String(url));
    const u = new URL(url);
    if (u.hostname === 'vca.vetmock.com') return new Response(SHELL, { status: 200 });
    if (u.pathname.endsWith('/profiles')) {
      const h = u.searchParams.get('handle').replace('eq.', '');
      return new Response(JSON.stringify(PROFILES[h] ? [PROFILES[h]] : []), { status: 200 });
    }
    if (opts.method === 'HEAD') {
      return u.pathname.includes(PROFILES.anuthin.user_id) ? new Response(null, { status: 200, headers: { etag: '"abc123"' } }) : new Response(null, { status: 400 });
    }
    return new Response('', { status: 404 });
  };
  ({ default: handler } = await import('../../api/u.js'));
});
after(() => { globalThis.fetch = realFetch; });

async function get(handle) {
  const out = { headers: {} };
  const res = {
    setHeader: (k, v) => { out.headers[k] = v; },
    status(code) { out.status = code; return this; },
    send(body) { out.body = body; return this; },
  };
  await handler({ query: { handle }, headers: { host: 'vca.vetmock.com' } }, res);
  return out;
}

test('a profile with a cover shares its name and its cover', async () => {
  const r = await get('anuthin');
  assert.equal(r.status, 200);
  assert.match(r.body, /<title>Anuthin \(@anuthin\) \| VetMock VCA<\/title>/);
  assert.match(r.body, /property="og:image" content="https:\/\/db\.example\/storage\/v1\/object\/public\/vca-media\/a852a209-71ce-4a46-9efd-e13718a346cb\/avatar\/og\.jpg\?v=abc123"/);
  assert.match(r.body, /name="twitter:image" content="https:\/\/db\.example\/[^"]+og\.jpg\?v=abc123"/);
  assert.match(r.body, /rel="canonical" href="https:\/\/vca\.vetmock\.com\/u\/anuthin"/);
  assert.match(r.body, /property="og:description" content="Anuthin ในชุมชน VetMock VCA/);
  assert.match(r.headers['cache-control'], /s-maxage=300/);
});

test('what a student typed is escaped, and no cover falls back to the community cover', async () => {
  const r = await get('sneaky');
  assert.doesNotMatch(r.body, /<script>alert/);
  assert.match(r.body, /&quot;&gt;&lt;script&gt;alert\(1\)&lt;\/script&gt; \(@sneaky\)/);
  assert.match(r.body, /property="og:description" content="a &amp; b"/);
  assert.match(r.body, /property="og:image" content="https:\/\/vca\.vetmock\.com\/og\/community\.jpg"/);
});

test('an unknown or malformed handle gets the shell unchanged, and a malformed one is never queried', async () => {
  assert.equal((await get('nobody_here')).body, SHELL);
  calls.length = 0;
  assert.equal((await get('../../etc')).body, SHELL);
  assert.ok(!calls.some((c) => c.includes('/profiles')), 'no database query for a malformed handle');
});
