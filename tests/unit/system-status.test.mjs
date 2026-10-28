// /api/system-status: the admin page's view of every outside service a
// feature needs. Pins that a dead credit, key or token reads as a problem
// with the step that fixes it, that nothing secret leaves the server, and
// that only the admin can ask.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import handler from '../../api/system-status.js';
import { runChecks } from '../../api/_lib/system-status.js';

const NOW = Date.parse('2026-10-29T00:00:00Z');
const DAY = 86_400_000;
const json = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body, text: async () => JSON.stringify(body) });

// A fetch that answers by URL prefix; anything unrouted is a network failure.
const router = (routes) => async (url) => {
  const hit = Object.keys(routes).find((prefix) => String(url).startsWith(prefix));
  if (!hit) throw new Error(`unrouted ${url}`);
  return routes[hit]();
};

const SECRETS = {
  IAPP_API_KEY: 'iapp-secret-1', DEEPSEEK_API_KEY: 'ds-secret-2', ANTHROPIC_API_KEY: 'an-secret-3',
  GEMINI_API_KEY: 'gm-secret-4', CLOUDFLARE_API_TOKEN: 'cf-secret-5', CF_ACCOUNT_ID: 'acct',
  VETMOCK_RPC_SIGNING_KEY: 'sign-secret-6', LIBRARY_BLOB_SECRET: 'blob-secret-7', RESEND_API_KEY: 're-secret-8',
  VERCEL_ENV: 'production',
};

const healthy = {
  'https://api.iapp.co.th/': () => ({ ok: true, status: 200, arrayBuffer: async () => new ArrayBuffer(10) }),
  'https://api.deepseek.com/user/balance': () => json(200, { is_available: true, balance_infos: [{ currency: 'USD', total_balance: '4.20' }] }),
  'https://api.anthropic.com/v1/models': () => json(200, { data: [] }),
  'https://generativelanguage.googleapis.com/': () => json(200, { models: [] }),
  'https://api.cloudflare.com/client/v4/user/tokens/verify': () => json(200, { success: true, result: { status: 'active' } }),
  'https://rdap.verisign.com/': () => json(200, { events: [{ eventAction: 'expiration', eventDate: new Date(NOW + 330 * DAY).toISOString() }] }),
};

const deps = (over = {}) => ({
  env: { ...SECRETS },
  fetchImpl: router(healthy),
  synth: async () => 4096,
  limit: async () => ({ ok: true }),
  mic: async () => true,
  now: NOW,
  ...over,
});
const byId = (list) => Object.fromEntries(list.map((c) => [c.id, c]));

test('a healthy deployment reads ok everywhere, and no secret leaves the server', async () => {
  const checks = await runChecks(deps());
  const states = Object.fromEntries(checks.map((c) => [c.id, c.state]));
  for (const id of ['voice-edge', 'voice-iapp', 'mic', 'ai-deepseek', 'ai-anthropic', 'rate-limit', 'cloudflare', 'signing', 'domain']) {
    assert.equal(states[id], 'ok', `${id}: ${JSON.stringify(byId(checks)[id])}`);
  }
  const text = JSON.stringify(checks);
  for (const secret of Object.values(SECRETS).filter((v) => /secret/.test(v))) assert.ok(!text.includes(secret), `leaked ${secret}`);
  assert.match(byId(checks)['ai-deepseek'].detail, /4\.20 USD/);
});

test('an empty credit or a dead upstream reads as a problem, with the step that fixes it', async () => {
  const checks = byId(await runChecks(deps({
    synth: async () => { throw new Error('Unexpected server response: 403'); },
    fetchImpl: router({
      ...healthy,
      'https://api.iapp.co.th/': () => json(402, { balance: 0, error_code: 'INSUFFICIENT_CREDITS' }),
      'https://api.deepseek.com/user/balance': () => json(200, { is_available: false, balance_infos: [{ currency: 'USD', total_balance: '0.00' }] }),
      'https://api.anthropic.com/v1/models': () => json(401, { error: { type: 'authentication_error' } }),
    }),
    mic: async () => false,
  })));
  for (const id of ['voice-edge', 'voice-iapp', 'mic', 'ai-deepseek', 'ai-anthropic']) {
    assert.equal(checks[id].state, 'down', id);
    assert.ok(checks[id].fix && checks[id].fix.length > 10, `${id} says what to do`);
  }
  assert.match(checks['voice-iapp'].detail, /เครดิต/);
  assert.match(checks['voice-edge'].detail, /403/);
});

test('a token or a domain close to expiry warns before it breaks', async () => {
  const checks = byId(await runChecks(deps({
    fetchImpl: router({
      ...healthy,
      'https://api.cloudflare.com/client/v4/user/tokens/verify': () => json(200, { success: true, result: { status: 'active', expires_on: new Date(NOW + 10 * DAY).toISOString() } }),
      'https://rdap.verisign.com/': () => json(200, { events: [{ eventAction: 'expiration', eventDate: new Date(NOW + 30 * DAY).toISOString() }] }),
    }),
  })));
  assert.equal(checks.cloudflare.state, 'warn');
  assert.match(checks.cloudflare.detail, /10 วัน/);
  assert.equal(checks.domain.state, 'warn');
  assert.match(checks.domain.detail, /30 วัน/);
});

test('an account-owned Cloudflare token is checked on the account endpoint', async () => {
  const checks = byId(await runChecks(deps({
    fetchImpl: router({
      ...healthy,
      'https://api.cloudflare.com/client/v4/user/tokens/verify': () => json(401, { success: false }),
      'https://api.cloudflare.com/client/v4/accounts/acct/tokens/verify': () => json(200, { success: true, result: { status: 'active' } }),
    }),
  })));
  assert.equal(checks.cloudflare.state, 'ok');
});

test('missing configuration says so instead of looking healthy', async () => {
  const checks = byId(await runChecks(deps({
    env: { VERCEL_ENV: 'production' },
    limit: async () => ({ ok: false, unavailable: true }),
  })));
  assert.equal(checks.signing.state, 'down', 'exam results and error counts cannot be signed');
  assert.equal(checks['rate-limit'].state, 'down', 'every limited API answers 503');
  assert.equal(checks['voice-iapp'].state, 'off');
  assert.equal(checks['ai-deepseek'].state, 'off');
  assert.equal(checks.cloudflare.state, 'down', 'library files need the token');
  assert.equal(checks.email.state, 'down');
  assert.equal(checks.connectors.state, 'off');
});

test('a check that hangs or throws does not take the others down', async () => {
  const checks = byId(await runChecks(deps({
    fetchImpl: router({ ...healthy, 'https://api.deepseek.com/user/balance': () => { throw new Error('socket hang up'); } }),
  })));
  assert.equal(checks['ai-deepseek'].state, 'down');
  assert.equal(checks['ai-anthropic'].state, 'ok');
});

// The Supabase project is on the free plan, which pauses a project after a
// week with no requests (a term break, or no maintainer): sign-in, sync, the
// library and the AI's sources would all stop. One request a day prevents it.
test('a daily request keeps the free Supabase project from pausing', () => {
  const cron = (JSON.parse(readFileSync('vercel.json', 'utf8')).crons || []).find((c) => c.path === '/api/ai-chat?warm=1');
  assert.ok(cron, 'vercel.json crons has /api/ai-chat?warm=1');
  assert.match(cron.schedule, /^\d+ \d+ \* \* \*$/, 'once a day');
  assert.match(readFileSync('api/ai-chat.js', 'utf8'), /if \(warm\) await warmLibrary\(\)/, 'the warm GET reaches library_search on Supabase');
});

function call({ headers = {}, method = 'GET' } = {}, over = {}) {
  const res = {
    statusCode: 200, headers: {}, body: null,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
    end() { return this; },
  };
  const req = { method, headers: { host: 'vetmock.com', ...headers }, url: '/api/system-status' };
  return Promise.resolve(handler(req, res, deps(over))).then(() => res);
}

test('only the admin can read it', async () => {
  assert.equal((await call({}, { auth: async () => null })).statusCode, 401);
  assert.equal((await call({}, { auth: async () => ({ userId: 'u', token: 't' }), isAdmin: async () => false })).statusCode, 403);
  const ok = await call({}, { auth: async () => ({ userId: 'u', token: 't' }), isAdmin: async () => true });
  assert.equal(ok.statusCode, 200);
  assert.ok(Array.isArray(ok.body.checks) && ok.body.checks.length >= 10);
  assert.equal(ok.headers['cache-control'], 'private, no-store');
  assert.equal((await call({ method: 'POST' })).statusCode, 405);
});
