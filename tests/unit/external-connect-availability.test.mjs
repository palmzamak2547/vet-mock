// ============================================================
// external-connect-availability — a connect button only where it can work
// ============================================================
// Production has no Google or Notion OAuth client configured, so
// /api/external-connect-start answers not_configured and the library's
// "เชื่อมต่อ" buttons led to "ยังไม่เปิดใช้การเชื่อมต่อผู้ให้บริการนี้". A
// button that cannot work must not be shown. GET /api/external-connect now
// says which providers this deployment can connect, from env PRESENCE only,
// and the reader shows a provider (and talks about connecting at all) only
// when the server says yes. Pasting a public Google link needs none of it
// and stays first.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf, settle } from '../helpers/fake-react.mjs';
import { externalCapabilities } from '../../api/_lib/external-connections.js';
import manageConnections from '../../api/external-connect.js';

const FULL = {
  VITE_SUPABASE_URL: 'https://fixture.supabase.test',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-secret-value',
  GOOGLE_OAUTH_CLIENT_ID: 'google-client-id-value',
  GOOGLE_OAUTH_CLIENT_SECRET: 'google-client-secret-value',
  NOTION_OAUTH_CLIENT_ID: 'notion-client-id-value',
  NOTION_OAUTH_CLIENT_SECRET: 'notion-client-secret-value',
};
const without = (...keys) => Object.fromEntries(Object.entries(FULL).filter(([k]) => !keys.includes(k)));

test('a provider is connectable only with its id, its secret, a state secret and storage', () => {
  assert.deepEqual(externalCapabilities({}), { connect: { google: false, notion: false } });
  assert.deepEqual(externalCapabilities(FULL), { connect: { google: true, notion: true } });
  // Production tonight: storage and signing are there, no OAuth client.
  assert.deepEqual(externalCapabilities(without('GOOGLE_OAUTH_CLIENT_ID', 'GOOGLE_OAUTH_CLIENT_SECRET',
    'NOTION_OAUTH_CLIENT_ID', 'NOTION_OAUTH_CLIENT_SECRET')), { connect: { google: false, notion: false } });
  assert.equal(externalCapabilities(without('GOOGLE_OAUTH_CLIENT_SECRET')).connect.google, false, 'an id without its secret is not configured');
  assert.equal(externalCapabilities(without('NOTION_OAUTH_CLIENT_ID')).connect.notion, false);
  assert.deepEqual(externalCapabilities(without('SUPABASE_SERVICE_ROLE_KEY')).connect, { google: false, notion: false },
    'no service role: nowhere to keep the grant and nothing to sign the state with');
  assert.deepEqual(externalCapabilities({ ...without('SUPABASE_SERVICE_ROLE_KEY'), EXTERNAL_OAUTH_STATE_SECRET: 's' }).connect,
    { google: false, notion: false }, 'a state secret alone still cannot store the grant');
  // NOTION_TOKEN reads pages shared with the server's own integration; it
  // does not let a student connect anything.
  assert.equal(externalCapabilities({ ...without('NOTION_OAUTH_CLIENT_ID'), NOTION_TOKEN: 'tok' }).connect.notion, false);
});

const response = () => ({ statusCode: 200, headers: {}, body: null,
  setHeader(k, v) { this.headers[k.toLowerCase()] = v; return this; }, status(c) { this.statusCode = c; return this; },
  json(b) { this.body = b; return this; }, end() { return this; } });

function withEnv(t, env) {
  const keys = [...new Set([...Object.keys(FULL), 'NOTION_TOKEN', 'EXTERNAL_OAUTH_STATE_SECRET', 'SUPABASE_URL'])];
  const prior = Object.fromEntries(keys.map(k => [k, process.env[k]]));
  for (const k of keys) delete process.env[k];
  Object.assign(process.env, env);
  const priorFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('the availability answer must not do IO'); };
  t.after(() => {
    globalThis.fetch = priorFetch;
    for (const [k, v] of Object.entries(prior)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  });
  return () => calls;
}

test('GET answers booleans to anyone, caches publicly, and never echoes a value', async t => {
  const calls = withEnv(t, without('NOTION_OAUTH_CLIENT_ID', 'NOTION_OAUTH_CLIENT_SECRET'));
  const res = response();
  await manageConnections({ method: 'GET', headers: { host: 'vetmock.test' }, socket: { remoteAddress: '10.9.9.9' }, query: {} }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { connect: { google: true, notion: false } });
  assert.match(res.headers['cache-control'], /public/);
  assert.match(res.headers['cache-control'], /s-maxage=\d+/);
  assert.equal(res.headers.vary, 'Origin');
  const text = JSON.stringify(res.body);
  for (const value of Object.values(FULL)) assert.ok(!text.includes(value), 'no env value leaves the server');
  assert.equal(calls(), 0, 'no account, no storage, no rate-limit store');

  const preflight = response();
  await manageConnections({ method: 'OPTIONS', headers: { host: 'vetmock.test' }, socket: { remoteAddress: '10.9.9.9' } }, preflight);
  assert.match(preflight.headers['access-control-allow-methods'], /GET/);

  const foreign = response();
  await manageConnections({ method: 'GET', headers: { host: 'vetmock.test', origin: 'https://evil.example' }, socket: { remoteAddress: '10.9.9.9' } }, foreign);
  assert.equal(foreign.statusCode, 403);

  const put = response();
  await manageConnections({ method: 'PUT', headers: { host: 'vetmock.test' }, socket: { remoteAddress: '10.9.9.9' } }, put);
  assert.equal(put.statusCode, 405);
});

// ── client ─────────────────────────────────────────────────────────────
async function freshClient() {
  return loadModule('src/lib/external-doc-client.js', { stubs: [
    { match: '/supabase\\.js$', contents: 'export const getSupabase = () => null;' },
  ] });
}
function stubFetch(t, answer) {
  const prior = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => { calls.push({ url: String(url), options }); return answer(url, options); };
  t.after(() => { globalThis.fetch = prior; });
  return calls;
}

test('the client asks once, without an account, and remembers only a well-formed answer', async t => {
  const client = await freshClient();
  let reply = { ok: false, status: 405, json: async () => ({ error: 'Method not allowed' }) };
  const calls = stubFetch(t, async () => reply);
  assert.equal(client.peekConnectable(), null);
  let result = await client.fetchConnectable();
  assert.deepEqual(result.connectable, { google: false, notion: false }, 'an older deployment offers nothing to connect');
  assert.equal(result.ok, false);
  assert.equal(client.peekConnectable(), null, 'a failure is not remembered');
  assert.equal(calls[0].url, '/api/external-connect');
  assert.equal(calls[0].options.method, 'GET');
  assert.equal(calls[0].options.headers.Authorization, undefined, 'no token for a public answer');

  reply = { ok: true, status: 200, json: async () => ({ connect: { google: 'yes', notion: 1 } }) };
  result = await client.fetchConnectable();
  assert.deepEqual(result.connectable, { google: false, notion: false }, 'only real booleans count');
  assert.equal(client.peekConnectable(), null, 'a malformed answer is not remembered either');

  reply = { ok: true, status: 200, json: async () => ({ connect: { google: true, notion: false } }) };
  result = await client.fetchConnectable();
  assert.deepEqual(result, { ok: true, connectable: { google: true, notion: false } });
  const before = calls.length;
  assert.deepEqual((await client.fetchConnectable()).connectable, { google: true, notion: false });
  assert.equal(calls.length, before, 'asked once per page');
  assert.deepEqual(client.peekConnectable(), { google: true, notion: false });

  // The server refusing a start as not configured outranks the remembered answer.
  reply = { ok: false, status: 503, json: async () => ({ reason: 'not_configured' }) };
  assert.equal((await client.startExternalConnection('google')).ok, false);
  assert.deepEqual(client.peekConnectable(), { google: false, notion: false });
});

test('the note under the paste box names only what this deployment can connect', async () => {
  const client = await freshClient();
  assert.equal(client.connectNoteFor(null), null);
  assert.equal(client.connectNoteFor({ google: false, notion: false }), null);
  assert.match(client.connectNoteFor({ google: true, notion: false }), /Google/);
  assert.doesNotMatch(client.connectNoteFor({ google: true, notion: false }), /Notion/);
  assert.match(client.connectNoteFor({ google: false, notion: true }), /Notion/);
  assert.doesNotMatch(client.connectNoteFor({ google: false, notion: true }), /Google/);
  assert.match(client.connectNoteFor({ google: true, notion: true }), /Google.*Notion/);
  for (const note of [client.connectNoteFor({ google: true, notion: true }), client.connectNoteFor({ google: true })]) {
    assert.ok(!note.includes('·'));
  }
});

// ── the reader itself ──────────────────────────────────────────────────
const { default: ExternalDocsSection } = await loadModule('src/components/ExternalDocsSection.jsx', { stubs: [
  { match: '/lib/external-doc-client\\.js$', contents: `
    export const PROVIDER_LABELS = { gdocs: 'Google Docs', notion: 'Notion' };
    export const CONNECT_PROVIDER_LABELS = { google: 'Google', notion: 'Notion' };
    export const NO_CONNECTABLE = { google: false, notion: false };
    export const peekConnectable = () => globalThis.__availability.peek();
    export const fetchConnectable = (...a) => globalThis.__availability.fetchConnectable(...a);
    export const connectNoteFor = c => c && (c.google || c.notion) ? 'CONNECT NOTE' : null;
    export const connectMessageFor = () => 'Connection failed';
    export const connectNoticeFor = () => null;
    export const fetchExternalDoc = async () => ({ ok: false, error: 'x' });
    export const fetchExternalConnections = (...a) => globalThis.__availability.fetchExternalConnections(...a);
    export const disconnectExternalConnection = async () => ({ ok: true });
    export const startExternalConnection = (...a) => globalThis.__availability.startExternalConnection(...a);
    export const listExternalFiles = async () => ({ ok: true, files: [] });
    export const pickGoogleFiles = async () => ({ ok: true, files: [] });
    export const loadRecentExternalDocs = () => [];
    export const rememberRecentExternalDoc = e => [e];
  ` },
] });

function reader(t, { user = { id: 'account-a' }, peek = null, connectable = { google: false, notion: false }, connections = [], start } = {}) {
  const prior = globalThis.__availability;
  const statusCalls = [];
  globalThis.__availability = {
    peek: () => peek,
    fetchConnectable: async () => ({ ok: true, connectable }),
    fetchExternalConnections: async (options) => { statusCalls.push(options); return { ok: true, connections }; },
    startExternalConnection: start || (async () => ({ ok: false, reason: 'not_configured', error: 'Connection failed' })),
  };
  const view = mount(ExternalDocsSection, { user });
  t.after(() => { view.unmount(); globalThis.__availability = prior; });
  return { view, statusCalls };
}
const buttons = (view, label) => findAll(view.tree, n => n.type === 'button' && textOf(n) === label);

test('nothing connectable: no connect panel, no promise, no status read, and the paste box works', async t => {
  for (const user of [{ id: 'account-a' }, null]) {
    const { view, statusCalls } = reader(t, { user });
    await settle(view);
    const text = textOf(view.tree);
    assert.equal(buttons(view, 'เชื่อมต่อ').length, 0, 'no button that would answer not_configured');
    assert.doesNotMatch(text, /เชื่อมบัญชี/, 'nothing about connecting an account at all');
    assert.doesNotMatch(text, /CONNECT NOTE/);
    assert.match(text, /แชร์แบบทุกคนที่มีลิงก์/, 'the way that works for everyone is said plainly');
    assert.equal(findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ลิงก์เอกสาร').length, 1);
    assert.equal(buttons(view, 'เปิดเอกสาร').length, 1);
    assert.equal(statusCalls.length, 0, 'no account lookup where nothing can be connected');
    view.unmount();
  }
});

test('only the configured provider shows, and a guest hears about connecting only then', async t => {
  const { view, statusCalls } = reader(t, { connectable: { google: true, notion: false } });
  await settle(view);
  const names = findAll(view.tree, n => n.props?.className === 'vmx-extdoc-connect-name').map(textOf);
  assert.deepEqual(names, ['Google']);
  assert.equal(buttons(view, 'เชื่อมต่อ').length, 1);
  assert.match(textOf(view.tree), /CONNECT NOTE/);
  assert.equal(statusCalls.length, 1, 'the account is read once the server says a provider is connectable');
  view.unmount();

  const guest = reader(t, { user: null, connectable: { google: false, notion: true } });
  await settle(guest.view);
  assert.match(textOf(guest.view.tree), /เข้าสู่ระบบเพื่อเชื่อมบัญชี/);
  assert.equal(guest.statusCalls.length, 0);
});

test('a provider the server refuses as not configured loses its button and says so calmly', async t => {
  const { view } = reader(t, { peek: { google: true, notion: true } });
  await settle(view);
  assert.equal(buttons(view, 'เชื่อมต่อ').length, 2);
  await buttons(view, 'เชื่อมต่อ')[0].props.onClick();
  await settle(view);
  const names = findAll(view.tree, n => n.props?.className === 'vmx-extdoc-connect-name').map(textOf);
  assert.deepEqual(names, ['Notion'], 'the Google button is gone');
  assert.equal(findAll(view.tree, n => n.props?.role === 'alert').length, 0, 'not the student\'s mistake, so no alert');
  assert.match(textOf(findAll(view.tree, n => n.props?.role === 'status' && n.props?.className === 'vmx-extdoc-notice')[0]),
    /ยังเชื่อมบัญชี Google ไม่ได้/);
  assert.equal(buttons(view, 'เชื่อมต่อ')[0].props.disabled, false, 'Notion stays usable');
});

test('a grant this account already holds can still be ended where connecting is off', async t => {
  const { view } = reader(t, { peek: { google: false, notion: true }, connections: [{ provider: 'google', accountLabel: 'held@example.test' }] });
  await settle(view);
  assert.match(textOf(view.tree), /held@example\.test/);
  assert.equal(buttons(view, 'ยกเลิกการเชื่อมต่อ').length, 1);
});
