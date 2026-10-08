import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf, settle } from '../helpers/fake-react.mjs';
import handler from '../../api/fetch-external-doc.js';
import { getConnection, refreshGoogleAccess } from '../../api/_lib/external-connections.js';
import manageConnections from '../../api/external-connect.js';
import listFiles from '../../api/list-external-files.js';

const { default: ExternalDocsSection } = await loadModule('src/components/ExternalDocsSection.jsx', { stubs: [
  { match: '/lib/external-doc-client\\.js$', contents: `
    export const PROVIDER_LABELS = { gdocs: 'Google Docs', notion: 'Notion' };
    export const CONNECT_PROVIDER_LABELS = { google: 'Google', notion: 'Notion' };
    export const connectMessageFor = () => 'Connection failed';
    export const fetchExternalDoc = (...a) => globalThis.__externalProbe.fetchExternalDoc(...a);
    export const fetchExternalConnections = (...a) => globalThis.__externalProbe.fetchExternalConnections(...a);
    export const disconnectExternalConnection = (...a) => globalThis.__externalProbe.disconnectExternalConnection(...a);
    export const startExternalConnection = (...a) => globalThis.__externalProbe.startExternalConnection(...a);
    export const listExternalFiles = (...a) => globalThis.__externalProbe.listExternalFiles(...a);
    export const loadRecentExternalDocs = () => [];
    export const rememberRecentExternalDoc = e => [e];
  ` },
] });
const doc = { provider: 'gdocs', title: 'Private account A document', markdown: '# Account A private contents', sourceUrl: 'https://docs.google.com/document/d/ACCOUNTAPRIVATEDOC00001/edit' };
const connection = { provider: 'google', accountLabel: 'account-a@example.test' };
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
function setup(t, overrides = {}) {
  const prev = globalThis.__externalProbe;
  globalThis.__externalProbe = {
    fetchExternalDoc: async () => ({ ok: true, doc }),
    fetchExternalConnections: async () => ({ ok: true, connections: [] }),
    disconnectExternalConnection: async () => ({ ok: true }),
    startExternalConnection: async () => ({ ok: false, error: 'Connection failed' }),
    listExternalFiles: async () => ({ ok: true, files: [] }),
    ...overrides,
  };
  const view = mount(ExternalDocsSection, { user: { id: 'account-a' } });
  t.after(() => { view.unmount(); globalThis.__externalProbe = prev; });
  return view;
}
const button = (view, label) => findAll(view.tree, n => n.type === 'button' && textOf(n) === label)[0];
async function open(view) {
  findAll(view.tree, n => n.type === 'input')[0].props.onChange({ target: { value: doc.sourceUrl } }); view.flush();
  findAll(view.tree, n => n.type === 'form')[0].props.onSubmit({ preventDefault() {} });
  await settle(view, 1);
}
test('reader clears account A document when user signs out', async t => {
  const view = setup(t); await open(view);
  assert.match(textOf(view.tree), /Private account A document/);
  view.update({ user: null }); await settle(view, 1);
  assert.doesNotMatch(textOf(view.tree), /Private account A document/);
});
test('a delayed A connection list cannot replace B connection state', async t => {
  const pending = deferred(); let calls = 0;
  const view = setup(t, { fetchExternalConnections: () => ++calls === 1 ? pending.promise : Promise.resolve({ ok: true, connections: [] }) });
  view.update({ user: { id: 'account-b' } }); await settle(view, 1);
  pending.resolve({ ok: true, connections: [connection] }); await settle(view, 2);
  assert.doesNotMatch(textOf(view.tree), /account-a@example\.test/);
});
test('a failed connect request is visible without a prior reader error', async t => {
  const view = setup(t); await settle(view, 1);
  await button(view, 'เชื่อมต่อ').props.onClick(); view.flush();
  assert.match(textOf(view.tree), /Connection failed/);
});
test('a failed disconnect remains connected and displays an actionable error', async t => {
  const view = setup(t, {
    fetchExternalConnections: async () => ({ ok: true, connections: [connection] }),
    disconnectExternalConnection: async () => ({ ok: false, error: 'Disconnect failed' }),
  }); await settle(view, 1);
  await button(view, 'ยกเลิกการเชื่อมต่อ').props.onClick(); view.flush();
  assert.match(textOf(view.tree), /account-a@example\.test/);
  assert.match(textOf(view.tree), /Disconnect failed/);
});

test('pending account reads and consent redirects retire on account switch or unmount', async t => {
  const previousWindow = globalThis.window, redirects = [];
  globalThis.window = { location: { search: '', assign: url => redirects.push(url) } };
  t.after(() => { globalThis.window = previousWindow; });
  for (const action of ['read', 'connect', 'files']) {
    const pending = deferred();
    const view = setup(t, {
      fetchExternalDoc: () => pending.promise,
      startExternalConnection: () => pending.promise,
      fetchExternalConnections: async () => ({ ok: true, connections: action === 'files' ? [connection] : [] }),
      listExternalFiles: () => pending.promise,
    }); await settle(view, 1);
    if (action === 'read') await open(view);
    if (action === 'connect') button(view, 'เชื่อมต่อ').props.onClick();
    view.update({ user: null });
    pending.resolve(action === 'read' ? { ok: true, doc } : action === 'connect' ? { ok: true, url: 'https://accounts.google.com/o/oauth2/auth' }
      : { ok: true, files: [{ id: 'private-file', title: 'Private late file', url: doc.sourceUrl }] });
    await settle(view, 2);
    assert.doesNotMatch(textOf(view.tree), /Private|account-a@example/);
    view.unmount();
  }
  assert.deepEqual(redirects, []);
});

test('independent provider files stay usable through another provider failure and retry', async t => {
  const slow = deferred(); let googleCalls = 0;
  const file = { id: 'notion-file', title: 'Available Notion page', url: 'https://notion.so/' + 'a'.repeat(32) };
  const view = setup(t, {
    fetchExternalConnections: async () => ({ ok: true, connections: [connection, { provider: 'notion', accountLabel: 'Notion workspace' }] }),
    listExternalFiles: provider => provider === 'notion' ? Promise.resolve({ ok: true, files: [file] })
      : ++googleCalls === 1 ? slow.promise : Promise.resolve({ ok: true, files: [{ ...file, title: 'Recovered Google file', url: doc.sourceUrl }] }),
  }); await settle(view, 2);
  assert.match(textOf(view.tree), /Available Notion page/);
  assert.match(textOf(view.tree), /กำลังโหลดไฟล์/);
  slow.resolve({ ok: false, error: 'File listing unavailable' }); await settle(view, 1);
  assert.match(textOf(view.tree), /File listing unavailable/);
  await button(view, 'ลองโหลดไฟล์อีกครั้ง').props.onClick(); view.flush();
  assert.match(textOf(view.tree), /Recovered Google file/);
  assert.match(textOf(view.tree), /Available Notion page/);
  await button(view, 'เปิดอ่าน').props.onClick(); await settle(view, 1);
  assert.match(textOf(view.tree), /Private account A document/);
  assert.doesNotMatch(textOf(view.tree), /\+ (ไฟล์โน๊ต|โน๊ต|ข้อสอบ)/);
});

test('status failures have a retry and disconnect success cannot revive delayed files', async t => {
  let statusCalls = 0, disconnected = false;
  const pending = deferred();
  const view = setup(t, {
    fetchExternalConnections: async () => ++statusCalls === 1 ? { ok: false, error: 'Status unavailable' }
      : { ok: true, connections: disconnected ? [] : [connection] },
    listExternalFiles: () => pending.promise,
    disconnectExternalConnection: async () => { disconnected = true; return { ok: true }; },
  }); await settle(view, 1);
  assert.match(textOf(view.tree), /Status unavailable/);
  button(view, 'ตรวจการเชื่อมต่ออีกครั้ง').props.onClick(); await settle(view, 1);
  await button(view, 'ยกเลิกการเชื่อมต่อ').props.onClick(); view.flush();
  pending.resolve({ ok: true, files: [{ id: 'late', title: 'Old disconnected file', url: doc.sourceUrl }] }); await settle(view, 1);
  assert.doesNotMatch(textOf(view.tree), /Old disconnected file|account-a@example/);
  assert.match(textOf(view.tree), /ยกเลิกการเชื่อมต่อGoogleแล้ว/);
});

test('a failed status retry leaves existing file requests able to settle', async t => {
  let statusCalls = 0;
  const pending = deferred();
  const view = setup(t, {
    fetchExternalConnections: async () => ++statusCalls === 1 ? { ok: true, connections: [connection] } : { ok: false, error: 'Status retry failed' },
    listExternalFiles: () => pending.promise,
    disconnectExternalConnection: async () => ({ ok: false, error: 'Disconnect unavailable' }),
  }); await settle(view, 1);
  await button(view, 'ยกเลิกการเชื่อมต่อ').props.onClick(); view.flush();
  await button(view, 'ตรวจการเชื่อมต่ออีกครั้ง').props.onClick(); view.flush();
  pending.resolve({ ok: true, files: [{ id: 'loaded', title: 'Files still settled', url: doc.sourceUrl }] }); await settle(view, 1);
  assert.match(textOf(view.tree), /Files still settled|Status retry failed/);
  assert.doesNotMatch(textOf(view.tree), /กำลังโหลดไฟล์/);
});

const response = () => ({ statusCode: 200, headers: {}, body: null,
  setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, status(c) { this.statusCode = c; return this; },
  json(b) { this.body = b; return this; }, end() { return this; } });
test('a connected Google private document uses the saved Google provider', async t => {
  const priorFetch = globalThis.fetch;
  const priorEnv = Object.fromEntries(['VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'GOOGLE_API_KEY'].map(k => [k, process.env[k]]));
  process.env.VITE_SUPABASE_URL = 'https://fixture.supabase.test'; process.env.SUPABASE_SERVICE_ROLE_KEY = 'fixture-key'; delete process.env.GOOGLE_API_KEY;
  t.after(() => { globalThis.fetch = priorFetch; for (const [k, v] of Object.entries(priorEnv)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } });
  const lookups = [];
  globalThis.fetch = async (raw, options = {}) => {
    const url = new URL(raw);
    if (url.pathname === '/auth/v1/user') return { ok: true, json: async () => ({ id: 'account-a' }) };
    if (url.pathname === '/rest/v1/external_connections') {
      lookups.push(url.searchParams.get('provider'));
      return { ok: true, json: async () => url.searchParams.get('provider') === 'eq.google' ? [{ provider: 'google', access_token: 'fixture-token' }] : [] };
    }
    if (url.hostname === 'www.googleapis.com') {
      assert.equal(options.headers.Authorization, 'Bearer fixture-token');
      return { ok: true, status: 200, url: url.href, text: async () => '# Private account A', json: async () => ({ name: 'Private document' }) };
    }
    return { ok: false, status: 403, url: url.href };
  };
  const res = response();
  await handler({ method: 'POST', headers: { host: 'vetmock.test', authorization: 'Bearer fixture-session' }, socket: { remoteAddress: '10.98.1.1' }, body: { url: doc.sourceUrl } }, res);
  assert.equal(res.statusCode, 200, JSON.stringify({ body: res.body, lookups }));
  assert.equal(res.body.markdown, '# Private account A');
});
test('refresh compare-and-update keeps the owner and cannot revive a disconnected or reconnected row', async () => {
  const writes = [];
  let current = { user_id: 'account-a', provider: 'google', access_token: 'expired-token', refresh_token: 'fixture-refresh', expires_at: '2000-01-01T00:00:00Z' };
  const deps = { url: 'https://fixture.supabase.test', key: 'fixture-key', fetch: async (raw, options = {}) => {
    if (options.method === 'PATCH') {
      const url = new URL(raw), body = JSON.parse(options.body);
      writes.push({ url, body });
      const matched = current?.user_id === url.searchParams.get('user_id').slice(3)
        && current?.access_token === JSON.parse(url.searchParams.get('access_token').slice(3))
        && current?.refresh_token === JSON.parse(url.searchParams.get('refresh_token').slice(3));
      if (matched) current = { ...current, ...body };
      return { ok: true, json: async () => matched ? [{ user_id: current.user_id }] : [] };
    }
    if (String(raw).includes('oauth2.googleapis.com')) return { ok: true, json: async () => ({ access_token: 'fresh-fixture-token', expires_in: 3600 }) };
    assert.notEqual(options.method, 'POST', 'a refresh must never insert a revoked connection');
    const fields = new URL(raw).searchParams.get('select').split(',');
    return { ok: true, json: async () => current ? [Object.fromEntries(Object.entries(current).filter(([key]) => fields.includes(key)))] : [] };
  } };
  const row = await getConnection({ userId: 'account-a', provider: 'google' }, deps);
  const result = await refreshGoogleAccess(row, deps);
  assert.equal(result.accessToken, 'fresh-fixture-token');
  assert.equal(writes[0].url.searchParams.get('user_id'), 'eq.account-a');
  assert.equal(writes[0].body.user_id, undefined);
  assert.equal(current.access_token, 'fresh-fixture-token');
  current = null;
  assert.equal(await refreshGoogleAccess(row, deps), null);
  assert.equal(current, null);
  current = { ...row, access_token: 'reconnected-token', refresh_token: 'new-refresh' };
  assert.equal(await refreshGoogleAccess(row, deps), null);
  assert.equal(current.access_token, 'reconnected-token');
});

test('concurrent Google refreshes reuse only a fresh token from the same surviving connection', async () => {
  for (const scenario of ['same connection', 'deleted', 'reconnected', 'reconnected same access', 'stale', 'unknown expiry', 'other owner']) {
    const row = { user_id: 'account-a', provider: 'google', access_token: 'old-access', refresh_token: 'same-consent', expires_at: '2000-01-01T00:00:00Z' };
    let current = { ...row }, readbacks = 0;
    const tokenReplies = [], writes = [];
    const deps = { url: 'https://fixture.supabase.test', key: 'fixture-key', fetch: async (raw, options = {}) => {
      const url = new URL(raw);
      if (url.hostname === 'oauth2.googleapis.com') {
        const reply = deferred(); tokenReplies.push(reply); return reply.promise;
      }
      assert.equal(url.searchParams.get('user_id'), 'eq.account-a');
      assert.equal(url.searchParams.get('provider'), 'eq.google');
      if (options.method === 'PATCH') {
        const body = JSON.parse(options.body);
        writes.push(body);
        const matched = current?.user_id === row.user_id && current?.access_token === JSON.parse(url.searchParams.get('access_token').slice(3))
          && current?.refresh_token === JSON.parse(url.searchParams.get('refresh_token').slice(3));
        if (matched) current = { ...current, ...body };
        return { ok: true, json: async () => matched ? [{ user_id: row.user_id }] : [] };
      }
      assert.equal(options.method, 'GET');
      readbacks++;
      return { ok: true, json: async () => current ? [{ ...current }] : [] };
    } };
    const first = refreshGoogleAccess(row, deps), second = refreshGoogleAccess(row, deps);
    assert.equal(tokenReplies.length, 2, 'two independent requests reach the provider before either completes');
    tokenReplies[0].resolve({ ok: true, json: async () => ({ access_token: 'first-fresh', expires_in: 3600 }) });
    assert.deepEqual(await first, { accessToken: 'first-fresh' });
    if (scenario === 'deleted') current = null;
    if (scenario === 'reconnected') current = { ...current, access_token: 'new-consent-access', refresh_token: 'new-consent' };
    if (scenario === 'reconnected same access') current = { ...current, access_token: row.access_token, refresh_token: 'new-consent' };
    if (scenario === 'stale') current = { ...current, expires_at: '2000-01-01T00:00:00Z' };
    if (scenario === 'unknown expiry') current = { ...current, expires_at: null };
    if (scenario === 'other owner') current = { ...current, user_id: 'account-b' };
    const beforeSecond = current && { ...current };
    tokenReplies[1].resolve({ ok: true, json: async () => ({ access_token: 'second-fresh', expires_in: 3600 }) });
    assert.deepEqual(await second, scenario === 'same connection' ? { accessToken: 'first-fresh' } : null, scenario);
    assert.deepEqual(current, beforeSecond, `${scenario}: losing refresh never overwrites or recreates a row`);
    assert.equal(writes.length, 2);
    assert.equal(readbacks, 1);
  }
});

function backend(t, responder) {
  const previousFetch = globalThis.fetch;
  const before = Object.fromEntries(['VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'GOOGLE_API_KEY'].map(k => [k, process.env[k]]));
  process.env.VITE_SUPABASE_URL = 'https://fixture.supabase.test'; process.env.SUPABASE_SERVICE_ROLE_KEY = 'fixture-key'; delete process.env.GOOGLE_API_KEY;
  globalThis.fetch = async (raw, options = {}) => {
    const url = new URL(raw);
    if (url.pathname === '/auth/v1/user') return { ok: true, json: async () => ({ id: 'account-a' }) };
    return responder(url, options);
  };
  t.after(() => { globalThis.fetch = previousFetch; for (const [k, v] of Object.entries(before)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } });
}
const request = (method, body = {}, query = {}) => ({ method, body, query,
  headers: { host: 'vetmock.test', authorization: 'Bearer fixture-session' }, socket: { remoteAddress: '10.98.1.2' } });

test('a private linked sheet keeps gid including zero and never exports the first tab on failure', async t => {
  let gid = 42, available = true;
  const calls = [];
  backend(t, (url, options) => {
    calls.push(url.href);
    if (url.pathname === '/rest/v1/external_connections') return { ok: true, json: async () => [{ user_id: 'account-a', provider: 'google', access_token: 'sheet-token' }] };
    if (url.hostname === 'sheets.googleapis.com') {
      assert.equal(options.headers.Authorization, 'Bearer sheet-token');
      assert.equal(options.redirect, 'error');
      if (!available) return { ok: false, status: 403 };
      if (url.pathname.includes('/values/')) {
        assert.equal(decodeURIComponent(url.pathname.split('/values/')[1]), "'Tab ''Two'''", 'the matched gid decides the range');
        return { ok: true, text: async () => JSON.stringify({ values: [['Linked tab', 'Value'], ['Selected', String(gid)]] }) };
      }
      return { ok: true, json: async () => ({ properties: { title: 'Private workbook' }, sheets: [
        { properties: { sheetId: gid + 1, title: 'Wrong first tab' } }, { properties: { sheetId: gid, title: "Tab 'Two'" } },
      ] }) };
    }
    assert.notEqual(url.hostname, 'www.googleapis.com', 'a linked tab must never use first-tab Drive export');
    return { ok: false, status: 403, url: url.href };
  });
  for (gid of [42, 0]) {
    const res = response();
    await handler(request('POST', { url: `https://docs.google.com/spreadsheets/d/PRIVATEWORKBOOK000000001/edit#gid=${gid}` }), res);
    assert.equal(res.statusCode, 200, JSON.stringify(res.body));
    assert.match(res.body.markdown, new RegExp(`Selected \\| ${gid}`));
    assert.match(res.body.sourceUrl, new RegExp(`gid=${gid}$`));
    assert.equal(res.headers['cache-control'], 'private, no-store');
  }
  available = false;
  const res = response();
  await handler(request('POST', { url: 'https://docs.google.com/spreadsheets/d/PRIVATEWORKBOOK000000001/edit#gid=42' }), res);
  assert.equal(res.statusCode, 422);
  assert.equal(res.body.reason, 'sheet_unavailable');
});

test('connection storage outage stays an error instead of claiming disconnection', async t => {
  backend(t, () => ({ ok: false, status: 503 }));
  const res = response();
  await manageConnections(request('POST', { action: 'status' }), res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.reason, 'storage');
  assert.equal(res.headers['cache-control'], 'private, no-store');
});

test('an ordinary selected-sheet transport failure keeps the readable public gid fallback', async t => {
  let publicReads = 0;
  backend(t, url => {
    if (url.pathname === '/rest/v1/external_connections') return { ok: true, json: async () => [{ user_id: 'account-a', provider: 'google', access_token: 'fixture-token' }] };
    if (url.hostname === 'sheets.googleapis.com') throw new TypeError('Modeled transport failure');
    assert.equal(url.hostname, 'docs.google.com'); assert.equal(url.searchParams.get('gid'), '42'); publicReads++;
    return { ok: true, url: url.href, text: async () => 'Selected tab,Value\nPublic proof,42' };
  });
  const res = response();
  await handler(request('POST', { url: 'https://docs.google.com/spreadsheets/d/PRIVATEWORKBOOK000000001/edit#gid=42' }), res);
  assert.equal(res.statusCode, 200, JSON.stringify(res.body)); assert.equal(publicReads, 1);
  assert.match(res.body.markdown, /Public proof/);
});

test('file listings enforce origin, no-store and provider response shape', async t => {
  let provider = 'google', malformed = false, calls = 0;
  backend(t, url => {
    calls++;
    if (url.pathname === '/rest/v1/external_connections') return { ok: true, json: async () => [{ user_id: 'account-a', provider, access_token: 'fixture-token' }] };
    if (provider === 'google') {
      assert.match(url.searchParams.get('q'), /trashed=false/);
      return { ok: true, json: async () => ({ files: malformed ? {} : [{ id: 'READABLEGOOGLEFILE000001', name: 'Readable file', mimeType: 'application/vnd.google-apps.document' }] }) };
    }
    return { ok: true, json: async () => ({ results: [{ id: 'a'.repeat(32), url: malformed ? 'javascript:alert(1)' : `https://notion.so/${'a'.repeat(32)}` }] }) };
  });
  const foreign = request('GET', {}, { provider }); foreign.headers.origin = 'https://evil.example';
  let res = response(); await listFiles(foreign, res);
  assert.equal(res.statusCode, 403); assert.equal(calls, 0);
  for (provider of ['google', 'notion']) {
    malformed = false; res = response(); await listFiles(request('GET', {}, { provider }), res);
    assert.equal(res.statusCode, 200, JSON.stringify(res.body)); assert.equal(res.body.files.length, 1);
    assert.equal(res.headers['cache-control'], 'private, no-store');
    malformed = true; res = response(); await listFiles(request('GET', {}, { provider }), res);
    assert.equal(res.statusCode, 502); assert.equal(res.body.reason, 'temporarily_unavailable');
  }
});

