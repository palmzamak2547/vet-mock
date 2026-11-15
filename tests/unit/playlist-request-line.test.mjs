// /api/playlist reads its id from the request line, never from req.query.
//
// `req.query` is the platform's lazy getter, and this route was its one busy
// reader. On Node 24 the builder versions that filled it with Node's legacy
// url.parse() logged DEP0169 here once per instance (12 times in the week to
// 10 Nov 2026). The route now parses the request line itself with `new URL`
// against a fixed base, as library-file, library-blob and video-file do.
//
// The table below was compared with url.parse(line, true).query under Node 24
// when it was written: every line gets the answer the old reading gave it,
// except the four at the end, which say how they differ.
import test from 'node:test';
import assert from 'node:assert/strict';

delete process.env.YOUTUBE_API_KEY; // the feed path: the id travels as ?playlist_id=
const { default: handler } = await import('../../api/playlist.js');

const GOOD = 'PLabcdefghij';

// One request through the real handler. YouTube is the only host it may call.
async function ask(line, headers = { host: 'vetmock.com' }) {
  const upstream = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    const target = new URL(url);
    assert.equal(target.origin, 'https://www.youtube.com', `the route called ${target.origin}`);
    upstream.push(target.searchParams.get('playlist_id'));
    return new Response('<feed><entry><yt:videoId>abcdefghijk</yt:videoId><title>Lecture</title></entry></feed>');
  };
  let queryReads = 0;
  const req = {
    method: 'GET',
    url: line,
    headers: { 'x-vercel-forwarded-for': `198.51.100.${1 + (ask.n++ % 250)}`, ...headers },
    // What the platform would hand over. The route must not ask for it.
    get query() { queryReads++; return { id: 'PLdecoydecoy' }; },
  };
  const res = {
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
  try {
    await handler(req, res);
  } finally {
    globalThis.fetch = realFetch;
  }
  return { res, upstream, queryReads };
}
ask.n = 0;

// Request lines that carry a usable id, and the id YouTube is asked for.
const READ = [
  [`/api/playlist?id=${GOOD}`, GOOD],
  [`/api/playlist?id=PL-_abcdefgh`, 'PL-_abcdefgh'],
  [`/api/playlist?x=1&id=${GOOD}&y=2`, GOOD],
  [`/api/playlist?&&id=${GOOD}&&`, GOOD],
  // The first id wins, whatever follows it.
  [`/api/playlist?id=${GOOD}&id=PLzzzzzzzzzz`, GOOD],
  [`/api/playlist?id=${GOOD}&id=<script>`, GOOD],
  // Percent-encoding, plus signs and spaces around the value.
  ['/api/playlist?id=%50Labcdefghij', GOOD],
  [`/api/playlist?%69d=${GOOD}`, GOOD],
  [`/api/playlist?id=+${GOOD}+`, GOOD],
  [`/api/playlist?id=%20${GOOD}%20`, GOOD],
  [`/api/playlist?id=%C2%A0${GOOD}`, GOOD],
  [`/api/playlist?id=${GOOD}#fragment`, GOOD],
  // A relative path, and no path at all.
  [`?id=${GOOD}`, GOOD],
  [`api/playlist?id=${GOOD}`, GOOD],
  [`../api/playlist?id=${GOOD}`, GOOD],
  [`\\api\\playlist?id=${GOOD}`, GOOD],
  // A host inside the request line: the id is read, the host is never called.
  [`//evil.example/api/playlist?id=${GOOD}`, GOOD],
  [`http://evil.example/api/playlist?id=${GOOD}`, GOOD],
  // Names that are properties of every object.
  [`/api/playlist?__proto__=1&constructor=2&id=${GOOD}`, GOOD],
];

// Request lines with no usable id: 400, and YouTube is not asked.
const REFUSED = [
  // No query, an empty one, an empty or valueless id.
  '/api/playlist',
  '/api/playlist?',
  '/api/playlist?id=',
  '/api/playlist?id',
  '',
  ' ',
  '*',
  // Another name.
  `/api/playlist?ID=${GOOD}`,
  `/api/playlist?id[]=${GOOD}`,
  `/api/playlist?id%5B%5D=${GOOD}`,
  `/api/playlist??id=${GOOD}`,
  // The first id decides, also when it is the bad one.
  `/api/playlist?id=bad&id=${GOOD}`,
  // Too short, too long, far too long.
  '/api/playlist?id=short',
  `/api/playlist?id=${'a'.repeat(41)}`,
  `/api/playlist?id=${'a'.repeat(100_000)}`,
  // Hostile characters, raw and encoded.
  `/api/playlist?id=${GOOD}%00`,
  `/api/playlist?id=${GOOD}%0d%0aSet-Cookie:x=1`,
  '/api/playlist?id=../../etc/passwd',
  '/api/playlist?id=PLabc<script>alert(1)</script>',
  `/api/playlist?id=${GOOD}%26key=stolen`,
  `/api/playlist?id=${GOOD};id=x`,
  `/api/playlist?id=${GOOD}?id=x`,
  '/api/playlist?id=PLabc defghij',
  '/api/playlist?id=%zz%zz%zz%zz%zz',
  `/api/playlist?id=${GOOD}%`,
  `/api/playlist?id=%${GOOD}`,
  `/api/playlist?id=${GOOD}%ff`,
  '/api/playlist?id=PL%E0%B8%81abcdefghi',
  '/api/playlist?id=ＰＬabcdefghij',
  `/api/playlist?id=%E2%80%8B${GOOD}`,
  // Request lines no parser can read.
  '//',
  '//[',
  'http://',
];

const HOSTS = {
  'a Host header': { host: 'vetmock.com' },
  'no Host header': {},
  'a Host header that is not ours': { host: 'evil.example', 'x-forwarded-host': 'evil.example' },
};

for (const [name, headers] of Object.entries(HOSTS)) {
  test(`the id is read from the request line (${name})`, async () => {
    for (const [line, id] of READ) {
      const { res, upstream, queryReads } = await ask(line, headers);
      assert.equal(res.code, 200, `${line}: ${JSON.stringify(res.body)}`);
      assert.deepEqual(upstream, [id], `${line}: the id YouTube was asked for`);
      assert.equal(queryReads, 0, `${line}: req.query was read`);
    }
  });

  test(`a request line without a usable id is a 400 and asks nobody (${name})`, async () => {
    for (const line of REFUSED) {
      const { res, upstream, queryReads } = await ask(line, headers);
      const shown = JSON.stringify(line.slice(0, 60));
      assert.equal(res.code, 400, shown);
      assert.equal(res.body.reason, 'bad_id', shown);
      assert.equal(res.headers['Cache-Control'], 'no-store', shown);
      assert.deepEqual(upstream, [], `${shown}: YouTube was asked`);
      assert.equal(queryReads, 0, `${shown}: req.query was read`);
    }
  });
}

test('a request with no url at all, or one that is not text, is a 400', async () => {
  for (const url of [undefined, null, 0, 42, {}, [], true]) {
    const { res, upstream } = await ask(url);
    assert.equal(res.code, 400, String(url));
    assert.deepEqual(upstream, []);
  }
});

// Where the new reading differs from url.parse(). None of these lines can
// reach the function as the platform routes it; each is pinned so the
// difference stays a known one.
test('the four request lines the old reading answered differently', async () => {
  // 1. querystring stopped at 1,000 parameters, so an id after them was not seen.
  const crowded = `/api/playlist?${Array.from({ length: 1200 }, (_, i) => `a${i}=1`).join('&')}&id=${GOOD}`;
  assert.deepEqual((await ask(crowded)).upstream, [GOOD], 'an id after 1,200 other parameters is read');

  // 2. The WHATWG parser drops a raw tab or line break, which no request line
  //    can carry; url.parse kept it and the id was refused.
  assert.deepEqual((await ask('/api/playlist?id=PLabc\tdefghij')).upstream, [GOOD]);
  assert.deepEqual((await ask('/api/playlist?id=PLabc\ndefghij')).upstream, [GOOD]);

  // 3. A line that opens with a host no host can be: url.parse read its query,
  //    the WHATWG parser refuses the whole line.
  assert.equal((await ask(`//a%20b/api/playlist?id=${GOOD}`)).res.code, 400);

  // 4. An absolute line with an unclosed bracket: url.parse threw, which the
  //    handler did not catch. It is a 400 now.
  assert.equal((await ask(`http://[::1/api/playlist?id=${GOOD}`)).res.code, 400);
});
