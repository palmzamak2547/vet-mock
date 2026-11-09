import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// scripts/probe-api-latency.mjs carries a member's access token. Against a stand-in site: the
// token rides on the mint only, a refused or dead token stops the probe instead of timing the
// wall, and without one nothing is minted.
const SCRIPT = fileURLToPath(new URL('../../scripts/probe-api-latency.mjs', import.meta.url));
const jwt = (exp) => `${[{ alg: 'none' }, { exp }].map((p) => Buffer.from(JSON.stringify(p)).toString('base64url')).join('.')}.sig`;
const GOOD = jwt(Math.floor(Date.now() / 1000) + 3600);

async function probe(token, { base } = {}) {
  const seen = [];
  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://site');
    seen.push({ pathname, auth: req.headers.authorization || '' });
    if (pathname === '/api/library-file') {
      const ok = req.headers.authorization === `Bearer ${GOOD}`;
      res.writeHead(ok ? 200 : 401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(ok ? { url: '/api/library-blob?t=1&s=2' } : { error: 'signin_required' }));
    }
    res.writeHead(pathname === '/api/library-blob' ? 200 : pathname === '/api/tts' ? 405 : 400);
    res.end(pathname === '/api/library-blob' ? Buffer.alloc(2048) : '{}');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const site = base || `http://127.0.0.1:${server.address().port}`;
  const result = await new Promise((resolve) => {
    execFile(process.execPath, [SCRIPT, `--base=${site}`, '--runs=1', 'deck-a'], { env: { ...process.env, VMX_PROBE_TOKEN: token } },
      (error, stdout, stderr) => resolve({ code: error ? error.code : 0, stdout, stderr }));
  });
  server.close();
  return { ...result, seen };
}

test('a member token rides on the mint, never on the file link or the cheap calls', async () => {
  const { code, stdout, seen } = await probe(GOOD);
  assert.equal(code, 0);
  assert.match(stdout, /member token, expires in 60 min/);
  assert.match(stdout, /open median: .*\(n=1\)/);
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

test('a token the wall refuses stops the probe before any timing is reported', async () => {
  const { code, stdout, stderr } = await probe(jwt(Math.floor(Date.now() / 1000) + 3600).replace('.sig', '.other'));
  assert.equal(code, 1);
  assert.match(stderr, /mint 401 signin_required: the wall refused this token/);
  assert.doesNotMatch(stdout, /open median|first byte/);
});

test('a dead token or a host that is not VetMock gets nothing', async () => {
  const dead = await probe(jwt(Math.floor(Date.now() / 1000) - 10));
  assert.equal(dead.code, 2);
  assert.equal(dead.seen.length, 0);
  const foreign = await probe(GOOD, { base: 'https://example.com' });
  assert.equal(foreign.code, 2);
  assert.match(foreign.stderr, /not sending a member token to https:\/\/example\.com/);
});
