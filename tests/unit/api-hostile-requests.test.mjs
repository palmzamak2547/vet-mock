// Every function under api/ answers hostile requests with a status, never an
// unhandled error, and never puts error text in what it answers.
//
// The list of functions is read from the directory, so a function is covered
// the day it is added. Every provider key is set to a fake value and requests
// carry a member's bearer, so handlers walk past "not configured" and the
// sign-in wall into their body and account code. The network is cut: the only
// answers are a fake database's (the gate and the session, in memory here),
// and every other fetch throws a marked error, so nothing reaches a provider.
//
// The same file holds three source rules for the class of bug behind them:
//   - a route that spends money refuses when its limiter cannot count;
//   - a route behind the Chula gate counts a member on their account;
//   - a handler reads its body through api/_lib/body.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sessionToken } from '../helpers/supabase-jwt.mjs';

const API = fileURLToPath(new URL('../../api/', import.meta.url));
const FILES = readdirSync(API).filter((f) => f.endsWith('.js')).sort();
const source = (f) => readFileSync(`${API}${f}`, 'utf8');
const code = (f) => source(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');

const NETWORK_MARK = 'hostile-network-cut-7f3a';
const BODY_MARK = 'hostile-body-unreadable-91c2';
const DB = 'https://db.hostile.test';
const UID = '00000000-0000-4000-8000-0000000000aa';
const BEARER = sessionToken(DB, { sub: UID });

// Names the API reads (api/**: env.X) that hold a key, token, secret or
// account id get a fake value; switches and limits keep their defaults.
const FAKE_ENV = {
  VITE_SUPABASE_URL: DB, SUPABASE_URL: DB, VITE_SUPABASE_ANON_KEY: 'anon-hostile-0123456789abcdef', SUPABASE_ANON_KEY: 'anon-hostile-0123456789abcdef',
  SUPABASE_SERVICE_ROLE_KEY: 'service-hostile', VETMOCK_RPC_SIGNING_KEY: 'sign-hostile-0123456789abcdef',
  DEEPSEEK_API_KEY: 'fake', ANTHROPIC_API_KEY: 'fake', GEMINI_API_KEY: 'fake', GOOGLE_API_KEY: 'fake', IAPP_API_KEY: 'fake',
  CF_AI_TOKEN: 'fake', CF_AI_ACCOUNT_ID: 'acct', CF_ACCOUNT_ID: 'acct', R2_ACCOUNT_ID: 'acct', CLOUDFLARE_API_TOKEN: 'fake-cf-token',
  LIBRARY_BLOB_SECRET: 'fake-blob', RESEND_API_KEY: 're_fake', ELEVENLABS_API_KEY: 'fake', ELEVENLABS_VOICE_AGENT_ID: 'agent',
  YOUTUBE_API_KEY: 'fake', NCBI_API_KEY: 'fake', NOTION_TOKEN: 'fake', EXTERNAL_OAUTH_STATE_SECRET: 'fake-state-secret-0123456789',
  GOOGLE_OAUTH_CLIENT_ID: 'fake', GOOGLE_OAUTH_CLIENT_SECRET: 'fake', GOOGLE_PICKER_API_KEY: 'fake',
  NOTION_OAUTH_CLIENT_ID: 'fake', NOTION_OAUTH_CLIENT_SECRET: 'fake', R2_ACCESS_KEY_ID: 'fake', R2_SECRET_ACCESS_KEY: 'fake', R2_BUCKET: 'b',
  FEEDBACK_HASH_KEY: 'fake', MOCHI_VOICE_OPEN: '1',
};

function harness() {
  for (const k of Object.keys(process.env)) {
    if (/KEY|TOKEN|SECRET|SUPABASE|UPSTASH|VERCEL|DEEPSEEK|ANTHROPIC|RESEND|ELEVEN|R2|CLOUDFLARE|IAPP|GEMINI|CF_|LIFF|GOOGLE|NOTION|FEEDBACK|MOCHI|AI_/i.test(k)) delete process.env[k];
  }
  Object.assign(process.env, FAKE_ENV, { NODE_ENV: 'test' });
  globalThis.fetch = async (input, init = {}) => {
    const url = String(input?.url || input);
    const auth = String(init.headers?.Authorization || init.headers?.authorization || '');
    const member = auth === `Bearer ${BEARER}`;
    if (url === `${DB}/rest/v1/rpc/chula_access_state`) {
      if (member) return Response.json({ enforce: true, signed_in: true, member: true, uid: UID });
      if (auth.includes('anon-hostile')) return Response.json({ enforce: true, signed_in: false, member: false, uid: null });
      return new Response('{"message":"JWT invalid"}', { status: 401 });
    }
    if (url === `${DB}/auth/v1/user`) return member ? Response.json({ id: UID, email: 'hostile@student.chula.ac.th' }) : new Response('{}', { status: 401 });
    if (url === `${DB}/rest/v1/rpc/is_admin`) return Response.json(false);
    throw new TypeError(NETWORK_MARK);
  };
}

function mkRes() {
  const res = { statusCode: 200, headers: {}, body: undefined, headersSent: false };
  res.setHeader = (k, v) => { res.headers[String(k).toLowerCase()] = v; return res; };
  res.getHeader = (k) => res.headers[String(k).toLowerCase()];
  res.removeHeader = (k) => { delete res.headers[String(k).toLowerCase()]; };
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (b) => { res.body = b; return res; };
  res.send = (b) => { res.body = b; return res; };
  res.end = (b) => { if (b !== undefined) res.body = b; return res; };
  res.write = () => true;
  res.writeHead = (c, h) => { res.statusCode = c; Object.assign(res.headers, h || {}); return res; };
  res.flushHeaders = () => {};
  res.on = () => res;
  res.once = () => res;
  res.emit = () => true;
  return res;
}

function mkReq(method, body, { headers = {}, url = '/api/x', badBody = false, signedIn = true } = {}) {
  const query = Object.fromEntries(new URL(url, 'http://local').searchParams);
  const req = {
    method, url, query,
    headers: { host: 'vetmock.com', 'content-type': 'application/json', ...(signedIn ? { authorization: `Bearer ${BEARER}` } : {}), ...headers },
    socket: { remoteAddress: '198.51.100.7' },
    on() { return req; }, once() { return req; },
  };
  if (badBody) Object.defineProperty(req, 'body', { get() { throw Object.assign(new Error(BODY_MARK), { statusCode: 400 }); } });
  else req.body = body;
  return req;
}

// Prototype keys arrive as own keys from JSON.parse, as they would from a client.
const PROTO = JSON.parse('{"__proto__":{"admin":true},"constructor":{"prototype":{"x":1}},"qid":"__proto__","mode":"toString","action":"__proto__","provider":"constructor","subject":"hasOwnProperty"}');
const WRONG_TYPES = { userAnswer: {}, utterance: [], url: {}, question: 5, text: 5, audio: 5, code: {}, questionIds: 'x', message: {}, type: [], image: 7, mime: [], qid: {}, messages: 'x', items: 'x' };

const CASES = [
  ['GET'], ['DELETE'], ['OPTIONS'], ['PUT', {}], ['PATCH', {}], ['HEAD'], ['post', {}],
  ['POST', undefined], ['POST', null], ['POST', 'not json'], ['POST', 'null'], ['POST', []], ['POST', 7], ['POST', {}],
  ['POST', { x: 'a'.repeat(200_000) }],
  ['POST', PROTO], ['POST', WRONG_TYPES],
  ['POST', undefined, { badBody: true }],
  ['POST', undefined, { badBody: true, signedIn: false }],
  ['POST', 'message=hi', { headers: { 'content-type': 'application/x-www-form-urlencoded' } }],
  ['POST', '--b\r\nContent-Disposition: form-data; name="x"\r\n\r\n1\r\n--b--', { headers: { 'content-type': 'multipart/form-data; boundary=b' } }],
  ['POST', Buffer.from('{"text":"x"}'), { headers: { 'content-type': 'text/plain' } }],
  ['POST', { text: 'x' }, { headers: { 'content-type': 'application/vmx-b64' } }],
  ['POST', {}, { headers: { origin: 'https://evil.example' } }],
  ['GET', undefined, { url: '/api/x?year=5;DROP&study=25:99&health=1&bust=1&s=__proto__&t=x&v=constructor&f=toString&slug=__proto__' }],
  ['GET', undefined, { url: '/api/x?probe=1', signedIn: false }],
];

// A response must never carry a stack frame, the network error's text or the
// body parser's text. Fixed messages and short codes only.
const LEAK = new RegExp([
  NETWORK_MARK, BODY_MARK, 'Unexpected token', 'is not valid JSON', 'Cannot read propert', 'Cannot destructure',
  'is not a function', 'is not defined', '\\bat [^\\s]+ \\(', 'file:///', 'node:internal', '\\.js:\\d+:\\d+',
].join('|'));

const labelOf = (method, body, opts) => `${method} ${opts?.badBody ? '<unreadable body>' : opts?.headers?.origin ? '<foreign origin>' : opts?.headers?.['content-type'] ? `<${opts.headers['content-type'].split(';')[0]}>` : JSON.stringify(body)?.slice(0, 30)}${opts?.signedIn === false ? ' (signed out)' : ''}`;

async function runAll() {
  const out = [];
  for (const f of FILES) {
    const mod = await import(pathToFileURL(`${API}${f}`).href);
    assert.equal(typeof mod.default, 'function', `${f} exports a handler`);
    for (const [method, body, opts] of CASES) {
      const res = mkRes();
      const label = `${f} ${labelOf(method, body, opts)}`;
      let threw = null;
      let timer;
      try {
        await Promise.race([
          Promise.resolve(mod.default(mkReq(method, body, opts), res)),
          new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), 8_000); }),
        ]);
      } catch (e) {
        threw = e;
      } finally {
        clearTimeout(timer);
      }
      out.push({ f, label, method, body, opts, threw, res });
    }
  }
  return out;
}

let results;
let BAD_BODY;
test.before(async () => {
  harness();
  ({ BAD_BODY } = await import('../../api/_lib/body.js'));
  const warn = console.warn; const error = console.error; const log = console.log;
  console.warn = () => {}; console.error = () => {}; console.log = () => {};
  try { results = await runAll(); } finally { console.warn = warn; console.error = error; console.log = log; }
});

test('every handler answers every hostile request; none throws', () => {
  assert.ok(FILES.length >= 20, 'the api directory was read');
  const thrown = results.filter((r) => r.threw).map((r) => `${r.label} -> ${String(r.threw?.message).slice(0, 80)}`);
  assert.deepEqual(thrown, []);
});

test('a malformed body is never a server fault', () => {
  const malformed = (r) => r.opts?.badBody || r.body === null || r.body === 'not json' || r.body === 'null' || Array.isArray(r.body) || r.body === 7;
  const faults = results
    .filter((r) => r.method === 'POST' && malformed(r) && r.res.statusCode >= 500 && r.res.statusCode !== 503)
    .map((r) => `${r.label} -> ${r.res.statusCode}`);
  assert.deepEqual(faults, [], 'a hostile body is the caller\'s error (400), or refused before it is read');
});

test('no response holds a stack frame, an upstream message or parser text', () => {
  const leaks = [];
  for (const r of results) {
    const b = r.res.body;
    if (b === undefined || Buffer.isBuffer(b)) continue;
    const text = typeof b === 'string' ? b : JSON.stringify(b);
    if (LEAK.test(text)) leaks.push(`${r.label} -> ${text.slice(0, 140)}`);
  }
  assert.deepEqual(leaks, []);
});

test('every handler that reads a body reaches it with a member\'s bearer and refuses an unreadable one', () => {
  const readers = FILES.filter((f) => /\breadJsonBody\(|\breadEncodedJsonBody\(/.test(code(f)));
  const reached = new Set(results
    .filter((r) => r.opts?.badBody && r.opts?.signedIn !== false && r.res.statusCode === 400 && JSON.stringify(r.res.body) === JSON.stringify(BAD_BODY))
    .map((r) => r.f));
  const missed = readers.filter((f) => !reached.has(f));
  assert.deepEqual(missed, [], 'these read a body but never got that far: the harness must reach their body code');
  assert.ok(readers.length >= 15, `handlers reading a body: ${readers.length}`);
  // Reported in the test name's output for the release notes.
  console.log(`[hostile] ${reached.size} of ${FILES.length} handlers reached their body code`);
});

test('a prototype key never names a record: no 2xx for the prototype body', () => {
  const served = results.filter((r) => r.body === PROTO && r.res.statusCode >= 200 && r.res.statusCode < 300).map((r) => `${r.label} -> ${r.res.statusCode}`);
  assert.deepEqual(served.filter((s) => !/ai-chat|ai-voice|client-diagnostic|mochi-voice/.test(s)), []);
});

// ── Source rules ────────────────────────────────────────────────────────────

// The library link and the video route mint cheap presigned links and stay
// open through a limiter outage by decision; the AI health read costs no token.
const FAIL_OPEN_ALLOWED = new Map([
  ['library-file.js', 'mints a short-lived link; a limiter outage must not close the library'],
  ['video-file.js', 'mints a short-lived link to our own clip copies'],
  ['ai-chat.js', 'the ?health=1 read costs no token'],
]);

test('a route refuses when its limiter cannot count, unless it is listed as a cheap reading surface', () => {
  const failOpen = /!\s*(\w+)\.ok\s*&&\s*!\s*\1\.unavailable/;
  const found = FILES.filter((f) => failOpen.test(code(f)));
  const unlisted = found.filter((f) => !FAIL_OPEN_ALLOWED.has(f));
  assert.deepEqual(unlisted, [], 'a limit that lets requests through while it cannot count; answer `if (!limit.ok) return sendRateLimitFailure(res, limit)`');
  for (const f of FAIL_OPEN_ALLOWED.keys()) assert.ok(found.includes(f), `${f} no longer fails open: drop it from FAIL_OPEN_ALLOWED`);
});

test('a route behind the Chula gate counts a member on their account, not their address alone', () => {
  const offenders = [];
  for (const f of FILES) {
    const src = code(f);
    if (!/await (requireChula|chulaGate)\(/.test(src)) continue;
    const keys = [...src.matchAll(/rateLimit\(\s*(`[^`]*`|'[^']*')/g)].map((m) => m[1]);
    const byAddress = keys.filter((k) => /clientIP|\$\{ip\}/.test(k));
    const byAccount = /limitCaller\(/.test(src) || keys.some((k) => /userId|\$\{uid\}|\$\{who\}|conversationId/.test(k));
    if (byAddress.length && !byAccount) offenders.push(`${f}: ${byAddress.join(', ')}`);
  }
  assert.deepEqual(offenders, [], 'count through limitCaller(req, gate, ...) in api/_lib/rate-limit.js');
});

test('a handler reads its body only through api/_lib/body.js', () => {
  // Each of these parses its body itself, inside its own guard, and is held by
  // the hostile cases above.
  const own = new Set(['ai-chat.js', 'ai-voice.js', 'move-in.js']);
  const offenders = FILES.filter((f) => !own.has(f) && /\breq\.body\b/.test(code(f)));
  assert.deepEqual(offenders, [], 'use readJsonBody(req) / sendBadBody(res)');
});
