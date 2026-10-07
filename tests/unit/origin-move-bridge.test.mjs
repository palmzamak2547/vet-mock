// ============================================================
// origin-move-bridge — the old address hands a learner's data to vetmock.com
// ============================================================
// index.html carries one inline script that runs only on vetmock.vercel.app.
// A plain redirect would open vetmock.com with empty storage, because
// localStorage and IndexedDB belong to an origin. The script either sends the
// learner on at once (nothing, or nothing new, to carry) or POSTs a snapshot
// to vetmock.com/api/move-in, and every way it can fail leaves the old app
// booting with its data where it was.
//
// These run the real script out of index.html in a vm sandbox, so a change to
// the shipped bytes is what gets tested.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { gunzipSync } from 'node:zlib';

const HTML = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const SCRIPT = /<script id="vmx-origin-move">([\s\S]*?)<\/script>/.exec(HTML)?.[1];
const META = /<meta name="vmx-origin-move" content="([^"]*)"/.exec(HTML)?.[1];
const OLD = 'https://vetmock.vercel.app';
const NEW = 'https://vetmock.com';
const HERE = '/app/notes?x=1#n';

class FakeStorage {
  constructor(entries = {}, { fail = false } = {}) { this.values = new Map(Object.entries(entries)); this.fail = fail; }
  get length() { if (this.fail) throw new Error('SecurityError'); return this.values.size; }
  key(i) { if (this.fail) throw new Error('SecurityError'); return [...this.values.keys()][i] ?? null; }
  getItem(k) { if (this.fail) throw new Error('SecurityError'); return this.values.has(k) ? this.values.get(k) : null; }
  setItem(k, v) { if (this.fail) throw new Error('SecurityError'); this.values.set(k, String(v)); }
  removeItem(k) { if (this.fail) throw new Error('SecurityError'); this.values.delete(k); }
}

// Just enough IndexedDB for the bridge: open by name, an upgrade it may abort,
// and getAll on an existing store. `created` records any database an open
// left behind, because an empty one would never be upgraded by the app.
function fakeIndexedDb(databases = {}) {
  const created = [];
  return {
    created,
    open(name) {
      const req = { result: null, error: null, transaction: null, onupgradeneeded: null, onsuccess: null, onerror: null };
      queueMicrotask(() => {
        const stores = databases[name];
        if (!stores) {
          let aborted = false;
          req.transaction = { abort() { aborted = true; } };
          req.result = { objectStoreNames: { contains: () => false }, close() {} };
          req.onupgradeneeded?.({ oldVersion: 0 });
          if (aborted) { req.error = Object.assign(new Error('aborted'), { name: 'AbortError' }); req.onerror?.({ preventDefault() {} }); return; }
          created.push(name);
          req.onsuccess?.();
          return;
        }
        req.result = {
          objectStoreNames: { contains: (store) => Object.hasOwn(stores, store) },
          close() {},
          transaction(store) {
            return { objectStore: () => ({ getAll() {
              const get = { result: null, onsuccess: null, onerror: null };
              queueMicrotask(() => { get.result = structuredClone(stores[store]); get.onsuccess?.(); });
              return get;
            } }) };
          },
        };
        req.onsuccess?.();
      });
      return req;
    },
  };
}

function element(tag, env) {
  const el = {
    tagName: tag.toUpperCase(), children: [], attributes: {}, className: '', textContent: '', style: {},
    setAttribute(k, v) { this.attributes[k] = String(v); },
    appendChild(child) { this.children.push(child); return child; },
  };
  if (tag === 'form') {
    el.submit = function submit() {
      const fields = Object.fromEntries(this.children.filter((c) => c.tagName === 'INPUT').map((c) => [c.name, c.value]));
      env.submitted = { method: String(this.method).toUpperCase(), action: this.action, fields };
    };
  }
  return el;
}

function run({
  url = `${OLD}${HERE}`, local = {}, session = {}, online = true, meta = META, compression = true,
  idb = undefined, failLocal = false, failSession = false,
} = {}) {
  assert.ok(SCRIPT, 'index.html carries the origin-move bridge');
  assert.ok(META, 'index.html names both hosts in its vmx-origin-move meta tag');
  const u = new URL(url);
  const env = { replaced: [], reloaded: 0, stopped: 0, submitted: null, stayedAt: null, timers: [], listeners: {}, windowListeners: {}, nodes: [] };
  const localStorage = new FakeStorage(local, { fail: failLocal });
  const sessionStorage = new FakeStorage(session, { fail: failSession });
  const location = {
    hostname: u.hostname, origin: u.origin, pathname: u.pathname, search: u.search, hash: u.hash,
    replace(next) { env.replaced.push(String(next)); },
    reload() { env.reloaded += 1; },
  };
  const documentElement = { appendChild(child) { env.nodes.push(child); return child; } };
  const document = {
    body: null, documentElement,
    querySelector: (sel) => (sel === 'meta[name="vmx-origin-move"]' && meta != null ? { getAttribute: () => meta } : null),
    createElement: (tag) => element(tag, env),
    addEventListener: (type, fn) => { env.listeners[type] = fn; },
  };
  const sandbox = {
    location, document, localStorage, sessionStorage,
    navigator: { onLine: online },
    history: { state: null, replaceState(_s, _t, next) { env.stayedAt = String(next); } },
    indexedDB: idb, URLSearchParams, TextEncoder, Blob, Response, btoa,
    setTimeout: (fn, ms) => { env.timers.push({ fn, ms }); return env.timers.length; },
    clearTimeout() {},
    stop() { env.stopped += 1; },
    addEventListener: (type, fn) => { env.windowListeners[type] = fn; },
  };
  if (compression) sandbox.CompressionStream = CompressionStream;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SCRIPT, sandbox);
  return { env, sandbox, localStorage, sessionStorage };
}

async function settle(env) {
  for (let i = 0; i < 400 && !env.submitted && !env.replaced.length; i++) await new Promise((r) => setTimeout(r, 2));
}

function payloadOf(submitted) {
  const { p, enc } = submitted.fields;
  const bytes = Buffer.from(p, 'base64url');
  return JSON.parse((enc === 'gz64' ? gunzipSync(bytes) : bytes).toString('utf8'));
}

const STUDY = {
  'vmx-bookmarks': '[101,102]',
  'vmx-history': '[{"id":"a1","questionId":101,"subject":"com5","date":1758800000000,"correct":true}]',
  'vmx-pass-abc-hl': '[{"s":1,"e":4}]',
  'vmx-theme': '"dark"',
};

test('production names exactly the old host and the new origin', () => {
  assert.equal(META, 'vetmock.vercel.app https://vetmock.com');
});

test('nothing to carry: the old address sends the learner on with path, query and hash', async () => {
  for (const local of [{}, { 'sb-proj-auth-token': '{"access_token":"x"}', 'vmx-move-sent': 'abc' }]) {
    const { env } = run({ local });
    assert.deepEqual(env.replaced, [`${NEW}${HERE}`]);
    assert.equal(env.submitted, null);
    assert.equal(env.stopped, 1, 'the old app does not start on the way out');
  }
});

test('changed data is POSTed as a form, never put in a URL, and leaves the app unstarted', async () => {
  const local = {
    ...STUDY,
    'vmx-move-sent': 'previous',
    'vmx-move-inbox': '{"stale":true}',
    'sb-mpovsdzdggvksmeehqfj-auth-token': '{"access_token":"secret"}',
    'unrelated-key': 'x',
  };
  const { env, sandbox, sessionStorage } = run({ local, session: { 'sb-other-auth-token': 'y', 'vmx-video-pending-clip': 'z' } });
  assert.equal(sandbox.__vmxMoving, true, 'main.jsx reads this and renders nothing');
  assert.equal(env.stopped, 1, 'the rest of the page, the app module included, never loads');
  await settle(env);
  assert.ok(env.submitted, 'a form was submitted');
  assert.deepEqual(env.replaced, [], 'no navigation carries data');
  assert.equal(env.submitted.method, 'POST');
  assert.equal(env.submitted.action, `${NEW}/api/move-in`);
  assert.deepEqual(Object.keys(env.submitted.fields).sort(), ['enc', 'h', 'p', 'to']);
  assert.equal(env.submitted.fields.enc, 'gz64');
  assert.match(env.submitted.fields.p, /^[A-Za-z0-9_-]+$/);
  assert.match(env.submitted.fields.h, /^[0-9a-f]{16}$/);
  assert.equal(env.submitted.fields.to, HERE);
  const payload = payloadOf(env.submitted);
  assert.equal(payload.v, 1);
  assert.equal(payload.from, OLD);
  assert.equal(payload.signedIn, true, 'a session token exists, so the learner signs in again over there');
  assert.deepEqual(payload.local, STUDY, 'every vmx- key, and only those');
  assert.ok(!JSON.stringify(payload).includes('secret'), 'the Supabase session is never copied');
  assert.deepEqual(payload.idb, { pdf: [], events: [] });
  assert.ok(Number(sessionStorage.getItem('vmx-move-out')) > 0, 'the tab remembers it is on its way out');
  assert.equal(env.timers.some((t) => t.ms >= 30000), true, 'a submission that never leaves falls back to the old app');
});

test('without CompressionStream the payload is plain base64url JSON', async () => {
  const { env } = run({ local: STUDY, compression: false });
  await settle(env);
  assert.equal(env.submitted.fields.enc, 'js64');
  assert.deepEqual(payloadOf(env.submitted).local, STUDY);
});

test('the same data a second time is not carried again: straight on, no POST', async () => {
  const first = run({ local: STUDY });
  await settle(first.env);
  const h = first.env.submitted.fields.h;
  const { env } = run({ local: { ...STUDY, 'vmx-move-sent': h, 'vmx-move-received': 'ignored' } });
  assert.deepEqual(env.replaced, [`${NEW}${HERE}`]);
  assert.equal(env.submitted, null);
  const changed = run({ local: { ...STUDY, 'vmx-bookmarks': '[101]', 'vmx-move-sent': h } });
  await settle(changed.env);
  assert.ok(changed.env.submitted, 'one changed byte is carried again');
});

test('the hash does not depend on the order storage lists its keys', async () => {
  const a = run({ local: STUDY });
  const b = run({ local: Object.fromEntries(Object.entries(STUDY).reverse()) });
  await settle(a.env); await settle(b.env);
  assert.equal(a.env.submitted.fields.h, b.env.submitted.fields.h);
});

test('the ACK from vetmock.com stores the hash and moves on, never moving again from that hop', async () => {
  const { env, localStorage, sandbox } = run({
    url: `${OLD}/?vmx-moved=0123456789abcdef&to=${encodeURIComponent(HERE)}`,
    local: STUDY,
  });
  assert.equal(localStorage.getItem('vmx-move-sent'), '0123456789abcdef');
  assert.deepEqual(env.replaced, [`${NEW}${HERE}`]);
  assert.equal(env.submitted, null);
  assert.notEqual(sandbox.__vmxMoving, true);
});

test('the ACK only ever leads to a path on vetmock.com', () => {
  for (const to of ['//evil.example/x', '/\\evil.example', 'https://evil.example', 'javascript:alert(1)', '/a\nb', `/${'a'.repeat(2048)}`]) {
    const { env } = run({ url: `${OLD}/?vmx-moved=abc&to=${encodeURIComponent(to)}` });
    assert.deepEqual(env.replaced, [`${NEW}/`], to);
  }
});

test('hold, offline, auth callbacks and unusable storage keep the old app, data untouched', async () => {
  const cases = [
    { url: `${OLD}/app/notes?vmx-move=hold`, stayedAt: '/app/notes' },
    { url: `${OLD}/?vmx-move=hold&to=${encodeURIComponent(HERE)}`, stayedAt: HERE },
    { session: { 'vmx-move-hold': '1' } },
    { online: false },
    { url: `${OLD}/?code=abc123&state=xyz` },
    { url: `${OLD}/#access_token=abc&refresh_token=def&type=magiclink` },
    { url: `${OLD}/app/account?type=recovery` },
    { url: `${OLD}/#error=access_denied&error_description=expired` },
    { url: `${OLD}/?auth=reset` },
    { failLocal: true },
    { failSession: true },
  ];
  for (const c of cases) {
    const { env, sandbox, localStorage } = run({ local: STUDY, ...c });
    await new Promise((r) => setTimeout(r, 5));
    const label = JSON.stringify(c);
    assert.deepEqual(env.replaced, [], label);
    assert.equal(env.submitted, null, label);
    assert.equal(env.stopped, 0, label);
    assert.notEqual(sandbox.__vmxMoving, true, label);
    if (!c.failLocal) assert.deepEqual(Object.fromEntries(localStorage.values), STUDY, label);
    if (c.stayedAt) assert.equal(env.stayedAt, c.stayedAt, `${label}: our parameters leave the address bar`);
  }
});

test('a hold lasts for the tab', () => {
  const { sessionStorage } = run({ url: `${OLD}/?vmx-move=hold`, local: STUDY });
  assert.equal(sessionStorage.getItem('vmx-move-hold'), '1');
});

test('coming straight back from vetmock.com means it still redirects here: hold, no loop', () => {
  const back = run({ local: STUDY, session: { 'vmx-move-out': String(Date.now() - 1500) } });
  assert.deepEqual(back.env.replaced, []);
  assert.equal(back.env.submitted, null);
  assert.equal(back.sessionStorage.getItem('vmx-move-hold'), '1');
  const later = run({ local: {}, session: { 'vmx-move-out': String(Date.now() - 120_000) } });
  assert.deepEqual(later.env.replaced, [`${NEW}${HERE}`], 'an old mark does not hold a later visit');
});

test('retry forgets the last ACK and the hold, then moves', async () => {
  const first = run({ local: STUDY });
  await settle(first.env);
  const { env, localStorage } = run({
    url: `${OLD}/?vmx-move=retry`,
    local: { ...STUDY, 'vmx-move-sent': first.env.submitted.fields.h },
    session: { 'vmx-move-hold': '1', 'vmx-move-out': String(Date.now()) },
  });
  await settle(env);
  assert.equal(localStorage.getItem('vmx-move-sent'), null);
  assert.ok(env.submitted);
  assert.equal(env.submitted.fields.to, '/', 'our own parameters are not carried');
});

test('other hosts behave exactly as before: previews, vetmock.com, localhost, no meta', async () => {
  for (const options of [
    { url: 'https://vetmock-git-branch-palmzamak2547s-projects.vercel.app/app/x' },
    { url: 'https://vetmock.com/app/x' },
    { url: 'http://localhost:5173/app/x' },
    { url: 'http://127.0.0.1:41731/app/x' },
    { meta: null },
  ]) {
    const { env, sandbox, localStorage, sessionStorage } = run({ local: STUDY, ...options });
    await new Promise((r) => setTimeout(r, 5));
    assert.deepEqual(env.replaced, []);
    assert.equal(env.submitted, null);
    assert.equal(env.stopped, 0);
    assert.equal(env.stayedAt, null);
    assert.notEqual(sandbox.__vmxMoving, true);
    assert.deepEqual(Object.fromEntries(localStorage.values), STUDY);
    assert.equal(sessionStorage.values.size, 0);
  }
});

test('IndexedDB is read without creating a database the app would never upgrade', async () => {
  const absent = fakeIndexedDb({});
  const one = run({ local: STUDY, idb: absent });
  await settle(one.env);
  assert.deepEqual(absent.created, []);
  assert.deepEqual(payloadOf(one.env.submitted).idb, { pdf: [], events: [] });

  const pdf = { hash: 'owner:guest:abc', docHash: 'abc', ownerId: null, strokesByPage: { 1: [{ id: 's1' }] }, deleted: [] };
  const row = { key: 'guest:e1', owner: 'guest', event: { id: 'e1' }, pending: 1, durable: true };
  const both = fakeIndexedDb({ 'vmx-pdf-annotations': { docs: [pdf] }, 'vmx-study-events-v1': { events: [row] } });
  const two = run({ local: STUDY, idb: both });
  await settle(two.env);
  assert.deepEqual(payloadOf(two.env.submitted).idb, { pdf: [pdf], events: [row] });
});

test('a payload over the limit drops events, then PDF ink, and otherwise holds', async () => {
  const big = 'x'.repeat(3_400_000); // > 4.2 MB once base64-encoded without compression
  const pdf = { hash: 'owner:guest:big', docHash: 'big', ownerId: null, strokesByPage: { 1: [{ id: 'p', points: big }] } };
  const row = { key: 'guest:e', owner: 'guest', event: { id: 'e', note: big }, pending: 1 };

  const eventsOut = run({ local: STUDY, compression: false, idb: fakeIndexedDb({ 'vmx-pdf-annotations': { docs: [] }, 'vmx-study-events-v1': { events: [row] } }) });
  await settle(eventsOut.env);
  assert.deepEqual(payloadOf(eventsOut.env.submitted).idb.events, []);
  assert.deepEqual(payloadOf(eventsOut.env.submitted).dropped, ['events']);

  const bothOut = run({ local: STUDY, compression: false, idb: fakeIndexedDb({ 'vmx-pdf-annotations': { docs: [pdf] }, 'vmx-study-events-v1': { events: [row] } }) });
  await settle(bothOut.env);
  assert.deepEqual(payloadOf(bothOut.env.submitted).idb, { pdf: [], events: [] });
  assert.deepEqual(payloadOf(bothOut.env.submitted).local, STUDY, 'localStorage always travels whole');

  const tooBig = run({ local: { ...STUDY, 'vmx-notes': JSON.stringify({ q1: big }) }, compression: false });
  await settle(tooBig.env);
  assert.equal(tooBig.env.submitted, null, 'never lose data to a size limit');
  assert.equal(tooBig.env.replaced.length, 1);
  assert.match(tooBig.env.replaced[0], /^https:\/\/vetmock\.vercel\.app\/\?vmx-move=hold&to=/);
  assert.equal(new URL(tooBig.env.replaced[0]).searchParams.get('to'), HERE, 'the reload keeps the learner where they were');
  assert.equal(tooBig.sessionStorage.getItem('vmx-move-hold'), '1');
});

test('a policy that refuses the form falls back to the old app', async () => {
  const { env, sessionStorage } = run({ local: STUDY });
  await settle(env);
  assert.ok(env.submitted);
  env.listeners.securitypolicyviolation?.({ effectiveDirective: 'form-action', violatedDirective: 'form-action' });
  assert.equal(env.replaced.length, 1, 'refused submission reloads into a hold');
  assert.match(env.replaced[0], /vmx-move=hold/);
  assert.equal(sessionStorage.getItem('vmx-move-hold'), '1');
});

test('an IndexedDB failure is a hold, not a move without the ink', async () => {
  const broken = { open() { throw new Error('InvalidStateError'); } };
  const { env } = run({ local: STUDY, idb: broken });
  await settle(env);
  assert.equal(env.submitted, null);
  assert.match(env.replaced[0] || '', /vmx-move=hold/);
});

// ── vercel.json: crawlers go straight to vetmock.com, browsers never do ─────

const VERCEL = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));

test('the old address lets this page post its form to vetmock.com', () => {
  const policy = VERCEL.headers.find((rule) => rule.source === '/(.*)').headers
    .find((h) => h.key === 'Content-Security-Policy').value;
  const formAction = policy.split(';').map((d) => d.trim()).find((d) => d.startsWith('form-action ')).split(/\s+/).slice(1);
  assert.deepEqual(formAction, ["'self'", META.split(/\s+/)[1]], 'without it the POST is refused and the learner holds forever');
});

test('crawlers on the old host are sent to vetmock.com permanently; browsers, the LINE app and /sw.js are not', () => {
  const moves = (VERCEL.redirects || []).filter((r) => r.has?.some((h) => h.type === 'host'));
  assert.equal(moves.length, 1);
  const [rule] = moves;
  assert.equal(rule.source, '/:path*');
  assert.equal(rule.destination, 'https://vetmock.com/:path*');
  assert.equal(rule.permanent, true);
  assert.deepEqual(rule.has.find((h) => h.type === 'host'), { type: 'host', value: 'vetmock.vercel.app' });
  const ua = rule.has.find((h) => h.type === 'header' && h.key === 'user-agent');
  assert.ok(ua, 'gated on the user agent');
  // Vercel matches a `has` value as a whole-string regex; test it that way.
  const matches = (agent) => new RegExp(`^${ua.value}$`).test(agent);
  for (const bot of [
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    'Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)',
    'DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)',
    'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
    'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'facebookexternalhit/1.1;line-poker/1.0',
    'Mozilla/5.0 (compatible; Linespider/1.1; +https://lin.ee/4dwXkTH)',
    'Twitterbot/1.0',
    'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)',
    'WhatsApp/2.23.20.0 A',
    'TelegramBot (like TwitterBot)',
    'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)',
    'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
    'Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)',
    'Mozilla/5.0 (compatible; SomeCrawler/1.0)',
    'Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; spider-feedback@bytedance.com)',
  ]) assert.ok(matches(bot), bot);
  for (const browser of [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36',
    // The LINE app's own browser, where many students open shared links.
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/14.10.0',
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/129.0.0.0 Mobile Safari/537.36 Line/14.12.1/IAB',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/470.0.0.37.106;FBBV/600000000]',
    'Mozilla/5.0 (Linux; Android 12; CUBOT P60) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 11; Cubot X30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/129.0.0.0 Safari/537.36',
  ]) assert.ok(!matches(browser), browser);
  // No other rule redirects the old host for everyone.
  assert.equal((VERCEL.redirects || []).filter((r) => r.destination?.startsWith('https://vetmock.com')).length, 1);
});

// ── sign-in that only works on origins the owner registered ─────────────────

test('Google popup sign-in and LINE login stay off on vetmock.com until the owner registers it', async () => {
  const gis = await import('../../src/lib/google-gis.js');
  const liff = await import('../../src/lib/line-liff.js');
  // One constant each; flipping it is the owner's step after the console change.
  assert.equal(gis.GIS_AUTHORISED_ON_VETMOCK_COM, false);
  assert.equal(liff.LIFF_ENDPOINT_ON_VETMOCK_COM, false);
  for (const allowed of [gis.gisOriginAllowed, liff.liffOriginAllowed]) {
    assert.equal(allowed('https://vetmock.vercel.app'), true);
    assert.equal(allowed('http://localhost:5173'), true);
    assert.equal(allowed('http://localhost:4173'), true);
    assert.equal(allowed('https://vetmock.com'), false, 'the Supabase redirect flow / no LINE button there for now');
    assert.equal(allowed('https://vetmock-git-x-palmzamak2547s-projects.vercel.app'), false);
    assert.equal(allowed('http://localhost.evil.example'), false);
    assert.equal(allowed(undefined), false);
  }
  const view = readFileSync(new URL('../../src/views/AuthView.jsx', import.meta.url), 'utf8');
  assert.match(view, /\{isLiffAvailable\(\) && \(\s*<button[\s\S]{0,400}onClick=\{lineLogin\}/, 'the LINE button shows only where LIFF can log in');
});

test('restored from the back-forward cache, the moving page decides again instead of waiting', async () => {
  const { env } = run({ local: STUDY });
  await settle(env);
  assert.ok(env.submitted);
  env.windowListeners.pageshow?.({ persisted: false });
  assert.equal(env.reloaded, 0);
  env.windowListeners.pageshow?.({ persisted: true });
  assert.equal(env.reloaded, 1);
});

test('offline, an app that cannot load says so instead of leaving a blank page', async () => {
  // The worker caches every navigation, so after a visit that went straight on
  // to vetmock.com it can hand back this page offline with app files it never
  // fetched. The old app is still tried first; only its failure shows this.
  const { env } = run({ local: STUDY, online: false });
  assert.deepEqual(env.replaced, []);
  const onError = env.windowListeners.error;
  assert.ok(onError, 'listens for the app failing to load');
  onError({ target: { tagName: 'IMG', src: 'https://vetmock.vercel.app/x.png' } });
  onError({ target: { tagName: 'SCRIPT', src: 'https://www.youtube.com/iframe_api' } });
  assert.equal(env.nodes.length, 0, 'other failures are not this');
  onError({ target: { tagName: 'SCRIPT', src: 'https://vetmock.vercel.app/assets/main-AbC123.js' } });
  assert.equal(env.nodes.length, 1);
  const box = env.nodes[0].children[0];
  assert.equal(box.className, 'vmx-move');
  assert.equal(box.attributes.role, 'status');
  assert.match(box.children.map((c) => c.textContent).join(' '), /ออฟไลน์/);
  onError({ target: { tagName: 'SCRIPT', src: 'https://vetmock.vercel.app/assets/vendor-react-x.js' } });
  assert.equal(env.nodes.length, 1, 'shown once');
  const online = run({ local: STUDY, session: { 'vmx-move-hold': '1' } });
  assert.equal(online.env.windowListeners.error, undefined, 'online holds load the app as before');
});
