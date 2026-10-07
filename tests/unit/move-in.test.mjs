// ============================================================
// move-in — vetmock.com's half of the origin move
// ============================================================
// /api/move-in receives the form the old address posts, checks where it came
// from, and answers with a page that writes the learner's data into
// vetmock.com's own storage before sending an ACK back to the old address.
// Nothing is stored on the server and the body is never logged.
//
// The handler runs with a fake req/res; the page it serves runs in a vm
// sandbox (tests/helpers/move-in-page.mjs) against fake storage.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

import handler, {
  createMoveInHandler, safeTo, FIELD_KEYS, OLD_ORIGIN, NEW_HOST, MAX_PAYLOAD,
} from '../../api/move-in.js';
import { USER_DATA_FIELDS } from '../../src/lib/user-data-sync.js';
import { MemoryStorage, inboxIndexedDb, encodePayload, pageParts, runMovePage } from '../helpers/move-in-page.mjs';

const OLD = 'https://vetmock.vercel.app';

// `origin: undefined` means the request carries no Origin header at all.
function request(options = {}) {
  const { method = 'POST', host = 'vetmock.com', body = {}, forwarded } = options;
  const origin = Object.hasOwn(options, 'origin') ? options.origin : OLD;
  const headers = { host };
  if (forwarded) headers['x-forwarded-host'] = forwarded;
  if (origin !== undefined) headers.origin = origin;
  return { method, headers, body };
}
function response() {
  return {
    statusCode: 200, headers: {}, body: '', ended: false,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    getHeader(k) { return this.headers[k.toLowerCase()]; },
    end(b = '') { this.body = String(b); this.ended = true; return this; },
  };
}
async function call(req, h = handler) { const res = response(); await h(req, res); return res; }

const PAYLOAD = {
  v: 1, from: OLD, at: 1758800000000, signedIn: false,
  local: { 'vmx-bookmarks': '[1,2]', 'vmx-theme': '"dark"', 'vmx-selected-year': '4' },
  idb: { pdf: [], events: [] },
};
const goodBody = (extra = {}) => ({ p: encodePayload(PAYLOAD), enc: 'gz64', h: '0123456789abcdef', to: '/app/notes?x=1#n', ...extra });

test('the production handler serves vetmock.com and answers the old address', () => {
  assert.equal(OLD_ORIGIN, OLD);
  assert.equal(NEW_HOST, 'vetmock.com');
  assert.equal(MAX_PAYLOAD, Math.floor(4.4 * 1024 * 1024));
});

test('the field keys the page may merge are exactly the user-data local keys', () => {
  assert.deepEqual([...FIELD_KEYS].sort(), Object.values(USER_DATA_FIELDS).map((f) => f.localKey).sort());
});

test('only POST', async () => {
  for (const method of ['GET', 'HEAD', 'PUT', 'OPTIONS']) {
    const res = await call(request({ method, body: goodBody() }));
    assert.equal(res.statusCode, 405, method);
    assert.equal(res.headers.allow, 'POST');
  }
});

test('a POST that reached the old host (vetmock.com still redirects) goes back there to hold', async () => {
  // A 307 replays the POST; after a cross-origin redirect the browser sends
  // Origin: null, so the host decides before the origin does.
  for (const origin of [OLD, 'null', undefined]) {
    const res = await call(request({ host: 'vetmock.vercel.app', origin, body: goodBody() }));
    assert.equal(res.statusCode, 303, String(origin));
    assert.equal(res.headers.location, `${OLD}/?vmx-move=hold&to=${encodeURIComponent('/app/notes?x=1#n')}`);
    assert.equal(res.headers['cache-control'], 'no-store');
  }
  const preview = await call(request({ host: 'vetmock-git-x.vercel.app', body: goodBody({ to: '//evil.example' }) }));
  assert.equal(preview.statusCode, 303);
  assert.equal(preview.headers.location, `${OLD}/?vmx-move=hold&to=%2F`);
  const forwarded = await call(request({ host: 'internal', forwarded: 'vetmock.com', body: goodBody() }));
  assert.equal(forwarded.statusCode, 200, 'x-forwarded-host names the public host');
});

test('a POST from anywhere but the old address is refused', async () => {
  for (const origin of ['https://evil.example', 'null', undefined, 'https://vetmock.com', 'http://vetmock.vercel.app']) {
    const res = await call(request({ origin, body: goodBody() }));
    assert.equal(res.statusCode, 403, String(origin));
    assert.match(res.headers['content-type'], /^text\/html/);
    assert.equal(pageParts(res.body).json, null, 'nothing to write');
    assert.match(res.body, /vmx-move=hold/, 'the way back to the old address is offered');
  }
});

test('an oversized payload is 413, a malformed one 400', async () => {
  const big = await call(request({ body: goodBody({ p: 'A'.repeat(MAX_PAYLOAD + 1) }) }));
  assert.equal(big.statusCode, 413);
  for (const bad of [
    { enc: 'br64' }, { enc: undefined }, { p: '' }, { p: 'not+base64/' }, { p: undefined },
    { h: '' }, { h: 'NOT-HEX' }, { h: 'a'.repeat(33) }, { h: undefined },
  ]) {
    const res = await call(request({ body: goodBody(bad) }));
    assert.equal(res.statusCode, 400, JSON.stringify(bad));
    assert.equal(pageParts(res.body).json, null);
  }
});

test('`to` is a path on this site or it is /', () => {
  for (const ok of ['/', '/app/notes?x=1#n', '/wiki/com5/heart', '/app/x?q=a%20b']) assert.equal(safeTo(ok), ok);
  for (const bad of ['', 'app', '//evil.example', '/\\evil.example', 'https://evil.example', 'javascript:alert(1)',
    '/a\nb', '/a\u0000', '/a\u007f', `/${'a'.repeat(2048)}`, null, undefined, 42, ['/x']]) {
    assert.equal(safeTo(bad), '/', JSON.stringify(bad));
  }
});

test('the page is private, unindexed, referrer-free, and runs one nonce-bound script', async () => {
  const a = await call(request({ body: goodBody() }));
  const b = await call(request({ body: goodBody() }));
  assert.equal(a.statusCode, 200);
  assert.equal(a.headers['content-type'], 'text/html; charset=utf-8');
  assert.equal(a.headers['cache-control'], 'no-store');
  assert.equal(a.headers['x-robots-tag'], 'noindex');
  assert.equal(a.headers['referrer-policy'], 'no-referrer');
  const nonce = /'nonce-([^']+)'/.exec(a.headers['content-security-policy'])?.[1];
  assert.ok(nonce && nonce.length >= 16, 'a per-response nonce');
  assert.notEqual(nonce, /'nonce-([^']+)'/.exec(b.headers['content-security-policy'])?.[1]);
  assert.match(a.headers['content-security-policy'], /default-src 'none'/);
  assert.match(a.headers['content-security-policy'], /frame-ancestors 'none'/);
  const scripts = [...a.body.matchAll(/<script\b([^>]*)>/g)].map((m) => m[1]);
  assert.deepEqual(scripts.filter((attrs) => !/type="application\/json"/.test(attrs)), [` nonce="${nonce}"`]);
  assert.match(a.body, /กำลังย้ายข้อมูลการเรียนของคุณ/);
  assert.match(a.body, /<html lang="th">/);
});

test('`to` is sanitised and `<` cannot close the data block', async () => {
  const res = await call(request({ body: goodBody({ to: '/app/x?q=</script><script>alert(1)</script>' }) }));
  const { json } = pageParts(res.body);
  assert.ok(!json.includes('<'), 'every < in the embedded JSON is escaped');
  assert.equal(JSON.parse(json).to, '/app/x?q=</script><script>alert(1)</script>');
  const evil = await call(request({ body: goodBody({ to: '//evil.example/x' }) }));
  assert.equal(JSON.parse(pageParts(evil.body).json).to, '/');
});

test('the body is never logged, on any path', async (t) => {
  const seen = [];
  for (const level of ['log', 'info', 'warn', 'error', 'debug', 'trace']) t.mock.method(console, level, (...args) => seen.push(args));
  const marker = encodePayload({ ...PAYLOAD, local: { 'vmx-notes': '{"q":"private note text"}' } });
  for (const req of [
    request({ body: goodBody({ p: marker }) }),
    request({ host: 'vetmock.vercel.app', body: goodBody({ p: marker }) }),
    request({ origin: 'https://evil.example', body: goodBody({ p: marker }) }),
    request({ body: goodBody({ p: marker, enc: 'nope' }) }),
    request({ body: { p: marker, enc: 'gz64', h: 'abc', to: '/' }, method: 'GET' }),
  ]) await call(req);
  assert.deepEqual(seen, []);
});

test('a urlencoded string body is read the same way', async () => {
  const res = await call(request({ body: new URLSearchParams(goodBody()).toString() }));
  assert.equal(res.statusCode, 200);
  assert.equal(JSON.parse(pageParts(res.body).json).to, '/app/notes?x=1#n');
});

// ── the page itself ─────────────────────────────────────────────

async function served(payload, extra = {}) {
  const h = createMoveInHandler({ oldOrigin: OLD, newHost: 'vetmock.com' });
  const res = await call(request({ body: goodBody({ p: encodePayload(payload, extra.enc || 'gz64'), ...extra }) }), h);
  assert.equal(res.statusCode, 200);
  return res.body;
}

test('on a fresh vetmock.com every key is copied as it was, then the ACK goes back', async () => {
  const pdf = { hash: 'owner:guest:abc', docHash: 'abc', ownerId: null, strokesByPage: {} };
  const row = { key: 'guest:e1', owner: 'guest', event: { id: 'e1' }, pending: 1 };
  const storage = new MemoryStorage();
  const idb = inboxIndexedDb();
  const run = await runMovePage(await served({ ...PAYLOAD, signedIn: true, idb: { pdf: [pdf], events: [row] } }), { storage, idb });
  assert.equal(run.failed, false);
  for (const [k, v] of Object.entries(PAYLOAD.local)) assert.equal(storage.getItem(k), v, k);
  assert.equal(storage.getItem('vmx-move-inbox'), null, 'nothing to merge into an empty origin');
  assert.deepEqual(idb.rows(), [{ db: 'pdf', value: pdf }, { db: 'events', value: row }]);
  const received = JSON.parse(storage.getItem('vmx-move-received'));
  assert.equal(received.hash, '0123456789abcdef');
  assert.equal(received.keys, 3);
  assert.equal(received.pdf, 1);
  assert.equal(received.events, 1);
  assert.equal(received.signedIn, true);
  assert.ok(Number.isFinite(received.at));
  assert.deepEqual(run.replaced, [`${OLD}/?vmx-moved=0123456789abcdef&to=${encodeURIComponent('/app/notes?x=1#n')}`]);
});

test('js64 payloads decode too', async () => {
  const storage = new MemoryStorage();
  const run = await runMovePage(await served(PAYLOAD, { enc: 'js64' }), { storage });
  assert.equal(run.failed, false);
  assert.equal(storage.getItem('vmx-bookmarks'), '[1,2]');
});

test('keys vetmock.com already has: user data goes to the inbox, everything else stays as it is', async () => {
  const storage = new MemoryStorage({
    'vmx-theme': '"light"',
    'vmx-bookmarks': '[9]',
    'vmx-user-data-v1:anonymous': '{"bookmarks":[9]}',
    'vmx-user-data-v2:anonymous': '{"version":2,"revision":0,"clock":5,"base":{}}',
    'vmx-user-sync-owner-v1': '"anonymous"',
    'vmx-move-inbox': JSON.stringify({ at: 1, from: OLD, owner: '"anonymous"', fields: { 'vmx-notes': '{"q1":"earlier"}' }, copied: ['vmx-a'] }),
  });
  const local = {
    'vmx-theme': '"dark"',
    'vmx-bookmarks': '[1,2]',
    'vmx-user-data-v1:anonymous': '{"bookmarks":[1,2]}',
    'vmx-user-data-v2:anonymous': '{"version":2,"revision":3,"clock":9,"base":{"bookmarks":[1,2]}}',
    'vmx-user-sync-owner-v1': '"anonymous"',
    'vmx-selected-year': '4',
  };
  const run = await runMovePage(await served({ ...PAYLOAD, local }), { storage });
  assert.equal(run.failed, false);
  assert.equal(storage.getItem('vmx-theme'), '"light"', 'vetmock.com is the newer side');
  assert.equal(storage.getItem('vmx-bookmarks'), '[9]', 'merged later by the app, not overwritten here');
  assert.equal(storage.getItem('vmx-selected-year'), '4', 'absent keys are copied');
  const inbox = JSON.parse(storage.getItem('vmx-move-inbox'));
  assert.deepEqual(inbox.fields, {
    'vmx-notes': '{"q1":"earlier"}',
    'vmx-bookmarks': '[1,2]',
    'vmx-user-data-v1:anonymous': '{"bookmarks":[1,2]}',
    'vmx-user-data-v2:anonymous': '{"version":2,"revision":3,"clock":9,"base":{"bookmarks":[1,2]}}',
  }, 'an existing inbox is merged, never overwritten');
  assert.equal(inbox.owner, '"anonymous"');
  assert.deepEqual(inbox.copied.sort(), ['vmx-a', 'vmx-selected-year']);
  assert.equal(inbox.from, OLD);
  assert.equal(run.replaced.length, 1);
});

test('a payload that is not this app\'s data writes nothing', async () => {
  for (const bad of [
    { ...PAYLOAD, v: 2 },
    { ...PAYLOAD, local: { 'vmx-move-sent': 'x' } },
    { ...PAYLOAD, local: { 'other-key': 'x' } },
    { ...PAYLOAD, local: { 'sb-x-auth-token': 'x' } },
    { ...PAYLOAD, local: { 'vmx-a': 1 } },
    { ...PAYLOAD, local: { 'vmx-a': 'x'.repeat(2 * 1024 * 1024 + 1) } },
    { ...PAYLOAD, local: [] },
    { ...PAYLOAD, idb: { pdf: 'x', events: [] } },
    { ...PAYLOAD, idb: { pdf: [1], events: [] } },
  ]) {
    const storage = new MemoryStorage();
    const run = await runMovePage(await served(bad), { storage });
    assert.equal(run.failed, true, JSON.stringify(bad).slice(0, 80));
    assert.deepEqual(run.replaced, []);
    assert.deepEqual(storage.snapshot(), {});
  }
});

test('storage that refuses a write shows the way back instead of an ACK', async () => {
  const storage = new MemoryStorage();
  storage.refuse = (k) => k === 'vmx-selected-year';
  const run = await runMovePage(await served(PAYLOAD), { storage });
  assert.equal(run.failed, true);
  assert.deepEqual(run.replaced, []);
  assert.equal(storage.getItem('vmx-move-received'), null, 'no receipt for a move that did not finish');
});
