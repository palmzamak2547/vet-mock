import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// scripts/probe-api-latency.mjs carries a member's access token. Against a stand-in site with the
// wall on: the token rides on the mint only, a refused, dead or malformed token stops the probe
// without printing it or timing anything, and without one nothing is minted.
const SCRIPT = fileURLToPath(new URL('../../scripts/probe-api-latency.mjs', import.meta.url));
const jwt = (exp, sig = 'sig') => `${[{ alg: 'none' }, { exp }].map((p) => Buffer.from(JSON.stringify(p)).toString('base64url')).join('.')}.${sig}`;
const soon = () => Math.floor(Date.now() / 1000) + 3600;
const GOOD = jwt(soon());
const NOT_A_MEMBER = jwt(soon(), 'outsider');
// Replaces fetch in the probe, so a test that expects no request also proves none left.
const NO_NETWORK = `data:text/javascript,${encodeURIComponent('globalThis.fetch = async (u) => { process.stderr.write("FETCH " + u + "\\n"); throw new Error("offline"); };')}`;

async function probe(token, { base, slug = 'deck-a', offline = false } = {}) {
  const seen = [];
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://site');
    const auth = req.headers.authorization || '';
    seen.push({ pathname: url.pathname, auth });
    if (url.pathname === '/api/library-file') {
      const [status, body] = auth === `Bearer ${GOOD}` ? [200, { url: slug === 'deck-expired' ? '/api/library-blob?t=expired' : '/api/library-blob?t=1&s=2' }]
        : auth === `Bearer ${NOT_A_MEMBER}` ? [403, { error: 'chula_required' }] : [401, { error: 'signin_required' }];
      res.writeHead(status, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(body));
    }
    if (url.pathname === '/api/library-blob') {
      res.writeHead(url.searchParams.get('t') === 'expired' ? 403 : 200);
      return res.end(Buffer.alloc(2048));
    }
    res.writeHead(url.pathname === '/api/tts' ? 405 : 400);
    res.end('{}');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const site = base || `http://127.0.0.1:${server.address().port}`;
  const result = await new Promise((resolve) => {
    execFile(process.execPath, [...(offline ? ['--import', NO_NETWORK] : []), SCRIPT, `--base=${site}`, '--runs=1', slug],
      { env: { ...process.env, VMX_PROBE_TOKEN: token } },
      (error, stdout, stderr) => resolve({ code: error ? error.code : 0, stdout, stderr }));
  });
  server.close();
  return { ...result, site, seen };
}

test('an open is timed as the client makes it, and the token rides on the mint only', async () => {
  const { code, stdout, seen } = await probe(GOOD);
  assert.equal(code, 0);
  assert.match(stdout, /member token, expires in 60 min/);
  assert.match(stdout, /open median: \d+ ms \(mint \d+, file \d+\), n=1; first mint \d+ ms/);
  assert.deepEqual(seen.filter((r) => r.pathname === '/api/library-file').map((r) => Boolean(r.auth)), [true]);
  assert.deepEqual(seen.filter((r) => r.auth).map((r) => r.pathname), ['/api/library-file']);
  assert.ok(seen.some((r) => r.pathname === '/api/library-blob'));
});

test('without a token nothing is minted, and the output says the open was not measured', async () => {
  const { code, stdout, seen } = await probe('');
  assert.equal(code, 0);
  assert.match(stdout, /no VMX_PROBE_TOKEN/);
  assert.doesNotMatch(stdout, /open median/);
  assert.equal(seen.filter((r) => r.pathname === '/api/library-file').length, 0);
});

test('a refused token stops the probe before any timing, naming the refusal and its origin', async () => {
  for (const [token, error] of [[jwt(soon(), 'forged'), 'signin_required'], [NOT_A_MEMBER, 'chula_required']]) {
    const { code, stdout, stderr, site } = await probe(token);
    assert.equal(code, 1, error);
    assert.ok(stderr.includes(`${error} from ${site}: refused`), stderr);
    assert.doesNotMatch(stdout, /open median|first byte/);
  }
});

test('a failed file fetch is not counted as an open', async () => {
  const { code, stdout } = await probe(GOOD, { slug: 'deck-expired' });
  assert.equal(code, 0);
  assert.match(stdout, /deck-expired: file 403, not counted/);
  assert.doesNotMatch(stdout, /open median/);
});

test('a dead or malformed token is never sent or printed', async () => {
  const session = JSON.stringify({ access_token: GOOD, refresh_token: 'refresh-secret', user: { email: 'student@example.edu' } }, null, 2);
  const wrapped = `${GOOD.slice(0, 40)}\n${GOOD.slice(40)}`;
  for (const token of [jwt(Math.floor(Date.now() / 1000) - 10), session, wrapped]) {
    const { code, stdout, stderr, seen } = await probe(token);
    assert.equal(code, 2);
    assert.equal(seen.length, 0);
    for (const secret of [GOOD.slice(10, 40), 'refresh-secret', 'student@example.edu']) assert.ok(!`${stdout}${stderr}`.includes(secret), secret);
  }
});

test('a host that is not VetMock gets nothing', async () => {
  for (const base of ['https://example.com', 'https://vetmock.com.example.com', 'https://evilvetmock.com', 'http://vetmock.com', 'https://vetmock-copy.vercel.app']) {
    const { code, stderr } = await probe(GOOD, { base, offline: true });
    assert.equal(code, 2, base);
    assert.match(stderr, /not sending a member token to /, base);
    assert.doesNotMatch(stderr, /FETCH/, base);
  }
});
