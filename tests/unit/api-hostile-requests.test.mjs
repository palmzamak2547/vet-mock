// Every function under api/ answers hostile requests with a status, never an
// unhandled error, and never puts error text in what it answers.
//
// The list of functions is read from the directory, so a function is covered
// the day it is added. The network is cut (every fetch throws a marked error)
// and no secret is set, so nothing here can reach a provider or spend money.
//
// The same file holds three source rules for the class of bug behind them:
//   - a route that spends money refuses when its limiter cannot count;
//   - a route behind the Chula gate does not count by address alone;
//   - a handler reads its body through api/_lib/body.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const API = fileURLToPath(new URL('../../api/', import.meta.url));
const FILES = readdirSync(API).filter((f) => f.endsWith('.js')).sort();
const source = (f) => readFileSync(`${API}${f}`, 'utf8');
const code = (f) => source(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');

const NETWORK_MARK = 'hostile-network-cut-7f3a';
const BODY_MARK = 'hostile-body-unreadable-91c2';

function harness() {
  for (const k of Object.keys(process.env)) {
    if (/KEY|TOKEN|SECRET|SUPABASE|UPSTASH|VERCEL|DEEPSEEK|ANTHROPIC|RESEND|ELEVEN|R2|CLOUDFLARE|IAPP|GEMINI|CF_|LIFF|GOOGLE|NOTION|FEEDBACK/i.test(k)) delete process.env[k];
  }
  process.env.NODE_ENV = 'test';
  globalThis.fetch = async () => { throw new TypeError(NETWORK_MARK); };
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

function mkReq(method, body, { headers = {}, url = '/api/x', badBody = false } = {}) {
  const req = { method, headers: { host: 'vetmock.com', ...headers }, url, query: {}, socket: { remoteAddress: '198.51.100.7' }, on() { return req; }, once() { return req; } };
  if (badBody) Object.defineProperty(req, 'body', { get() { throw Object.assign(new Error(BODY_MARK), { statusCode: 400 }); } });
  else req.body = body;
  return req;
}

const CASES = [
  ['GET'], ['DELETE'], ['OPTIONS'],
  ['POST', undefined], ['POST', null], ['POST', 'not json'], ['POST', 'null'], ['POST', []], ['POST', 7], ['POST', {}],
  ['POST', { x: 'a'.repeat(200_000) }],
  ['POST', { messages: 'x', question: {}, qid: {}, mode: [], items: 'x', text: { a: 1 }, audio: [], url: 5, action: {} }],
  ['POST', undefined, { badBody: true }],
  ['POST', {}, { headers: { origin: 'https://evil.example' } }],
  ['GET', undefined, { url: '/api/x?year=5;DROP&study=25:99&health=1&bust=1' }],
];

// A response must never carry a stack frame, the network error's text or the
// body parser's text. Fixed messages and short codes only.
const LEAK = new RegExp([
  NETWORK_MARK, BODY_MARK, 'Unexpected token', 'is not valid JSON', 'Cannot read propert', 'Cannot destructure',
  'is not a function', 'is not defined', '\\bat [^\\s]+ \\(', 'file:///', 'node:internal', '\\.js:\\d+:\\d+',
].join('|'));

async function runAll() {
  const out = [];
  for (const f of FILES) {
    const mod = await import(pathToFileURL(`${API}${f}`).href);
    assert.equal(typeof mod.default, 'function', `${f} exports a handler`);
    for (const [method, body, opts] of CASES) {
      const res = mkRes();
      const label = `${f} ${method} ${opts?.badBody ? '<unreadable body>' : opts?.headers ? '<foreign origin>' : JSON.stringify(body)?.slice(0, 30)}`;
      let threw = null;
      let timer;
      try {
        await Promise.race([
          Promise.resolve(mod.default(mkReq(method, body, opts), res)),
          new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), 5_000); }),
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
test.before(async () => {
  harness();
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
  const faults = results
    .filter((r) => r.method === 'POST' && r.res.statusCode >= 500 && r.res.statusCode !== 503)
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

test('handlers that read a body answer an unreadable one with 400 and the fixed message', async () => {
  const { BAD_BODY } = await import('../../api/_lib/body.js');
  // With no database configured the gate lets a local caller through, so these
  // reach their body: each must refuse it itself.
  for (const f of ['client-diagnostic.js', 'exam-result.js', 'race-start.js', 'send-feedback.js', 'tts.js']) {
    for (const r of results.filter((x) => x.f === f && (x.opts?.badBody || x.body === null || Array.isArray(x.body)))) {
      assert.equal(r.res.statusCode, 400, r.label);
      assert.deepEqual(r.res.body, BAD_BODY, r.label);
    }
  }
});

// ── Source rules ────────────────────────────────────────────────────────────

// Reading surfaces whose limit guards against bulk downloading, not a paid
// call, and that stay open through a limiter outage on purpose (AGENTS.md,
// Library and sync), and the AI health read, which costs no token.
const FAIL_OPEN_ALLOWED = new Map([
  ['library-file.js', 'reading surface: a limiter outage must not close the library'],
  ['library-blob.js', 'reading surface: a limiter outage must not close the library'],
  ['video-file.js', 'reading surface: our own clip copies'],
  ['ai-chat.js', 'the ?health=1 read costs no token'],
]);

test('a route refuses when its limiter cannot count, unless it is listed as a free reading surface', () => {
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
  const own = new Set(['ai-chat.js', 'ai-voice.js', 'move-in.js', 'tts.js']);
  const offenders = FILES.filter((f) => !own.has(f) && /\breq\.body\b/.test(code(f)));
  assert.deepEqual(offenders, [], 'use readJsonBody(req) / sendBadBody(res)');
});

test('limitCaller: a member is counted on their account; the address keeps a far higher ceiling', async () => {
  const { limitCaller, ADDRESS_CEILING_FACTOR } = await import('../../api/_lib/rate-limit.js');
  const hall = (n) => ({ headers: { 'x-vercel-forwarded-for': '203.0.113.50' }, n });
  const route = `t-${Date.now()}`;
  // Fifteen students on one address, two asks each, against a limit of 2 per person.
  for (let s = 0; s < 15; s++) {
    for (let i = 0; i < 2; i++) {
      const r = await limitCaller(hall(s), { userId: `student-${s}` }, route, 2, 60_000);
      assert.equal(r.ok, true, `student ${s} ask ${i + 1}`);
    }
  }
  assert.equal((await limitCaller(hall(0), { userId: 'student-0' }, route, 2, 60_000)).ok, false, 'each student keeps their own limit');
  assert.ok(ADDRESS_CEILING_FACTOR >= 10);
  // Without an account the address is the caller.
  const guest = `g-${Date.now()}`;
  assert.equal((await limitCaller(hall(0), null, guest, 1, 60_000)).ok, true);
  assert.equal((await limitCaller(hall(0), { userId: null }, guest, 1, 60_000)).ok, false);
  // The address ceiling still brakes one address cycling accounts.
  const brake = `b-${Date.now()}`;
  let refused = 0;
  for (let s = 0; s < 40; s++) if (!(await limitCaller(hall(s), { userId: `cycle-${s}` }, brake, 1, 60_000, { addressMax: 30 })).ok) refused++;
  assert.equal(refused, 10);
});

test('the origin rule admits this team\'s previews only', async () => {
  const { allowedOrigin } = await import('../../api/_lib/rate-limit.js');
  const from = (origin) => allowedOrigin({ headers: { origin, host: 'api.example' } });
  for (const ok of ['https://vetmock-3p7zymay8-palmzamak2547s-projects.vercel.app', 'https://vetmock-git-main-palmzamak2547s-projects.vercel.app',
    'https://vetmock-ai-abc123-palmzamak2547s-projects.vercel.app', 'https://vetmock-vca-git-x-palmzamak2547s-projects.vercel.app']) {
    assert.equal(from(ok), ok, ok);
  }
  for (const bad of ['https://vetmock-evil.vercel.app', 'https://vetmock-x-other-team.vercel.app', 'https://vet-mock-evil.vercel.app',
    'http://vetmock-abc-palmzamak2547s-projects.vercel.app', 'https://vetmock-abc-palmzamak2547s-projects.vercel.app.evil.example']) {
    assert.equal(from(bad), null, bad);
  }
});
