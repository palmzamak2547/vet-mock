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
import vm from 'node:vm';

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
    '/a\nb', '/a\u0000', '/a\u007f', `/${'a'.repeat(16384)}`, null, undefined, 42, ['/x']]) {
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
  await call(request({ body: goodBody() })); // the rate limiter names its backend once per process
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
  assert.equal(storage.getItem('vmx-bookmarks'), '[9]', 'a mirror of the snapshot below, which carries the data');
  assert.equal(storage.getItem('vmx-selected-year'), '4', 'absent keys are copied');
  const inbox = JSON.parse(storage.getItem('vmx-move-inbox'));
  assert.deepEqual(inbox.fields, {
    'vmx-notes': '{"q1":"earlier"}',
    'vmx-user-data-v1:anonymous': '{"bookmarks":[1,2]}',
    'vmx-user-data-v2:anonymous': '{"version":2,"revision":3,"clock":9,"base":{"bookmarks":[1,2]}}',
  }, 'an existing inbox is merged, never overwritten; field keys travel inside the owner\'s snapshot');
  assert.equal(inbox.oldGuest, true);
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
    { ...PAYLOAD, local: [] },
    { ...PAYLOAD, idb: { pdf: 'x', events: [] } },
    { ...PAYLOAD, idb: { pdf: [1], events: [] } },
  ]) {
    const storage = new MemoryStorage();
    const run = await runMovePage(await served(bad), { storage });
    assert.equal(run.failed, true, JSON.stringify(bad).slice(0, 80));
    assert.deepEqual(run.replaced, [`${OLD}/?vmx-move=hold&failed=0123456789abcdef&to=${encodeURIComponent('/app/notes?x=1#n')}`], 'back, never an ACK');
    assert.deepEqual(storage.snapshot(), {});
  }
});

test('storage that refuses a write shows the way back instead of an ACK', async () => {
  const storage = new MemoryStorage();
  storage.refuse = (k) => k === 'vmx-selected-year';
  const run = await runMovePage(await served(PAYLOAD), { storage });
  assert.equal(run.failed, true);
  assert.ok(run.replaced.every((url) => !url.includes('vmx-moved')), 'no ACK');
  assert.equal(storage.getItem('vmx-move-received'), null, 'no receipt for a move that did not finish');
});

// ── review fixes (2026-10-08) ───────────────────────────────────────────────

const H = '0123456789abcdef';
const TO = '/app/notes?x=1#n';
const holdUrl = (failed, to = TO) => `${OLD}/?vmx-move=hold${failed ? `&failed=${failed}` : ''}&to=${encodeURIComponent(to)}`;
function quizPath(n) {
  const rows = Array.from({ length: n }, (_, i) => ({ s: 'com5', i: 1000 + i }));
  return `/?qset=${Buffer.from(JSON.stringify(rows)).toString('base64url')}`;
}
// Runs the nonce-bound script of a refusal page; returns where it sends the browser.
function followRefusal(html) {
  const script = /<script nonce="[^"]+">([\s\S]*?)<\/script>/.exec(html)?.[1];
  if (!script) return [];
  const replaced = [];
  const sandbox = { location: { replace: (url) => replaced.push(String(url)) } };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  return replaced;
}
async function moveOnce(storage, local) {
  const run = await runMovePage(await served({ ...PAYLOAD, local }), { storage });
  assert.equal(run.failed, false);
  return run;
}

test('`to` keeps a shared quiz link of 200 questions, up to 16 KB', async () => {
  const long = quizPath(200);
  assert.equal(safeTo(long), long);
  assert.equal(safeTo(`/${'a'.repeat(16383)}`).length, 16384);
  assert.equal(safeTo(`/${'a'.repeat(16384)}`), '/');
  const res = await call(request({ body: goodBody({ to: long }) }));
  const run = await runMovePage(res.body, { storage: new MemoryStorage() });
  assert.equal(new URL(run.replaced[0]).searchParams.get('to'), long, 'the ACK carries it back');
  const wrongHost = await call(request({ host: 'vetmock.vercel.app', body: goodBody({ to: long }) }));
  assert.equal(new URL(wrongHost.headers.location).searchParams.get('to'), long);
});

test('one large value, a photo deck say, moves: only the payload limit bounds the size', async () => {
  const deck = JSON.stringify([{ id: 80001, name: 'x', imageDataUrl: `data:image/jpeg;base64,${'A'.repeat(3 * 1024 * 1024)}`, masks: [] }]);
  const storage = new MemoryStorage();
  await moveOnce(storage, { ...PAYLOAD.local, 'vmx-image-occlusion-decks': deck });
  assert.equal(storage.getItem('vmx-image-occlusion-decks'), deck);
});

test('every refusal of a move sends the learner back to the old address by itself, naming the data that failed', async () => {
  for (const [req, status] of [
    [request({ origin: 'https://evil.example', body: goodBody() }), 403],
    [request({ body: goodBody({ p: 'A'.repeat(MAX_PAYLOAD + 1) }) }), 413],
    [request({ body: goodBody({ enc: 'br64' }) }), 400],
  ]) {
    const res = await call(req);
    assert.equal(res.statusCode, status);
    assert.deepEqual(followRefusal(res.body), [holdUrl(H)], String(status));
    assert.match(res.body, /vmx-move=retry/, 'the manual links stay');
    assert.equal(pageParts(res.body).json, null, 'nothing to write');
  }
  const noHash = await call(request({ body: goodBody({ h: 'NOT-HEX' }) }));
  assert.deepEqual(followRefusal(noHash.body), [holdUrl(null)], 'without a usable hash it goes back all the same');
  const get = await call(request({ method: 'GET' }));
  assert.deepEqual(followRefusal(get.body), [], 'a GET has no move behind it');
});

test('a page that cannot finish goes back to the old address with the hash it could not move', async () => {
  const storage = new MemoryStorage();
  storage.refuse = (k) => k === 'vmx-selected-year';
  const run = await runMovePage(await served(PAYLOAD), { storage });
  assert.equal(run.failed, true, 'the failure section shows while it goes');
  assert.deepEqual(run.replaced, [holdUrl(H)]);
  const broken = await runMovePage(await served({ ...PAYLOAD, v: 2 }), { storage: new MemoryStorage() });
  assert.deepEqual(broken.replaced, [holdUrl(H)]);
});

test('the old host answers any method with the way back, before anything else', async () => {
  for (const method of ['GET', 'HEAD', 'PUT']) {
    const res = await call(request({ method, host: 'vetmock.vercel.app' }));
    assert.equal(res.statusCode, 303, method);
    assert.equal(res.headers.location, `${OLD}/?vmx-move=hold&to=%2F`);
  }
});

test('posts are rate limited per address; a limited learner goes back to the old address to try another time', async () => {
  const seen = [];
  const limited = createMoveInHandler({ limit: async (req) => { seen.push(req.headers['x-vercel-forwarded-for']); return { ok: false, retryAfter: 42 }; } });
  const req = request({ body: goodBody() });
  req.headers['x-vercel-forwarded-for'] = '203.0.113.9';
  const res = await call(req, limited);
  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['retry-after'], '42');
  assert.deepEqual(seen, ['203.0.113.9']);
  assert.deepEqual(followRefusal(res.body), [holdUrl(null)], 'no failure is recorded: it was not this data');
  const unavailable = await call(request({ body: goodBody() }), createMoveInHandler({ limit: async () => ({ ok: false, unavailable: true, retryAfter: 30 }) }));
  assert.equal(unavailable.statusCode, 503);
  assert.deepEqual(followRefusal(unavailable.body), [holdUrl(null)]);

  // The shipped handler counts by client address.
  const statuses = [];
  for (let i = 0; i < 125; i++) {
    const one = request({ body: goodBody() });
    one.headers['x-vercel-forwarded-for'] = '198.51.100.23';
    statuses.push((await call(one)).statusCode);
  }
  assert.ok(statuses.slice(0, 100).every((s) => s === 200));
  assert.equal(statuses.at(-1), 429);
});

test('a later move takes what only the old address changed and keeps what only vetmock.com changed', async () => {
  const storage = new MemoryStorage();
  const first = { 'vmx-pass-abc-hl': '[{"s":1,"e":4}]', 'vmx-theme': '"dark"', 'vmx-flag-x': '1', 'vmx-osce': '{"a":1}' };
  await moveOnce(storage, first);
  const base = JSON.parse(storage.getItem('vmx-move-base'));
  assert.deepEqual(Object.keys(base.keys).sort(), Object.keys(first).sort(), 'every carried key is fingerprinted');
  storage.setItem('vmx-theme', '"light"');
  storage.setItem('vmx-osce', '{"a":2}');
  const second = { ...first, 'vmx-pass-abc-hl': '[{"s":1,"e":9}]', 'vmx-osce': '{"a":3}' };
  await moveOnce(storage, second);
  assert.equal(storage.getItem('vmx-pass-abc-hl'), '[{"s":1,"e":9}]', 'changed only on the old address: carried');
  assert.equal(storage.getItem('vmx-theme'), '"light"', 'changed only here: kept');
  assert.equal(storage.getItem('vmx-osce'), '{"a":2}', 'changed on both: vetmock.com keeps its own, as before');
  storage.setItem('vmx-pass-abc-hl', '[]');
  await moveOnce(storage, second);
  assert.equal(storage.getItem('vmx-pass-abc-hl'), '[]', 'a change made here after the last move is not undone');
});

test('vetmock.com\'s empty mirrors take the old values at once; field keys are never staged beside the owner\'s snapshot', async () => {
  const empties = Object.fromEntries(Object.values(USER_DATA_FIELDS).map((f) => [f.localKey, JSON.stringify(f.initial)]));
  const history = Array.from({ length: 40 }, (_, i) => ({ id: `h${i}`, questionId: i, date: 1, correct: true }));
  const v2 = (base) => JSON.stringify({ version: 2, revision: 0, clock: 3, base, acknowledged: [] });
  const local = {
    'vmx-user-sync-owner-v1': '"anonymous"', 'vmx-bookmarks': '[1,2]', 'vmx-history': JSON.stringify(history),
    'vmx-user-data-v2:anonymous': v2({ bookmarks: [1, 2], history }),
  };
  // One earlier visit to vetmock.com: the eight mirrors, all empty.
  const visited = new MemoryStorage({ ...empties, 'vmx-user-sync-owner-v1': '"anonymous"', 'vmx-theme': '"light"' });
  await moveOnce(visited, local);
  assert.equal(visited.getItem('vmx-history'), local['vmx-history']);
  assert.equal(visited.getItem('vmx-bookmarks'), '[1,2]');
  assert.equal(visited.getItem('vmx-user-data-v2:anonymous'), local['vmx-user-data-v2:anonymous']);
  assert.deepEqual(Object.keys(JSON.parse(visited.getItem('vmx-move-inbox') || '{"fields":{}}').fields), [], 'nothing is staged twice');

  // vetmock.com has study data of its own: the old snapshot is staged for the merge, its mirrors are not.
  const studied = new MemoryStorage({ 'vmx-user-sync-owner-v1': '"anonymous"', 'vmx-bookmarks': '[9]', 'vmx-user-data-v2:anonymous': v2({ bookmarks: [9] }) });
  await moveOnce(studied, local);
  assert.deepEqual(Object.keys(JSON.parse(studied.getItem('vmx-move-inbox')).fields), ['vmx-user-data-v2:anonymous']);

  // Another owner's mirrors never fill this one's empty workspace.
  const other = new MemoryStorage({ ...empties, 'vmx-user-sync-owner-v1': '"anonymous"' });
  await moveOnce(other, { 'vmx-user-sync-owner-v1': '"user-9"', 'vmx-history': local['vmx-history'], 'vmx-user-data-v2:user-9': v2({ history }) });
  assert.equal(other.getItem('vmx-history'), '[]');
});

test('a tools bundle on either side never hides the other side\'s tools: their lists join by id', async () => {
  const card = (id) => ({ id, type: 'flashcard', q: `q${id}`, front: `q${id}`, back: 'a' });
  const ids = (raw) => JSON.parse(raw).map((c) => c.id);
  // The old address restored a backup (a bundle); vetmock.com made a card of its own.
  const one = new MemoryStorage({ 'vmx-user-flashcards': JSON.stringify([card(9100002)]) });
  await moveOnce(one, {
    'vmx-local-extras-v1': JSON.stringify({ 'vmx-user-flashcards': [card(9100001)], 'vmx-pinboard': [] }),
    'vmx-user-flashcards': JSON.stringify([card(9100099)]), // hidden behind the old bundle: not the learner's view
  });
  assert.equal(one.getItem('vmx-local-extras-v1'), null, 'the bundle itself is not carried over');
  assert.deepEqual(ids(one.getItem('vmx-user-flashcards')), [9100002, 9100001]);
  // vetmock.com restored a backup; the old address made a card in its plain key.
  const two = new MemoryStorage({ 'vmx-local-extras-v1': JSON.stringify({ 'vmx-user-flashcards': [card(9100002)] }) });
  await moveOnce(two, { 'vmx-user-flashcards': JSON.stringify([card(9100001)]) });
  assert.deepEqual(JSON.parse(two.getItem('vmx-local-extras-v1'))['vmx-user-flashcards'].map((c) => c.id), [9100002, 9100001]);
  assert.equal(two.getItem('vmx-user-flashcards'), null, 'written where vetmock.com reads it');
});
