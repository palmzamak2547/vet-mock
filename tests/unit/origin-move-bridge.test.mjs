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
    listeners: {}, parentNode: null,
    setAttribute(k, v) { this.attributes[k] = String(v); },
    appendChild(child) { child.parentNode = this; this.children.push(child); return child; },
    removeChild(child) { this.children = this.children.filter((c) => c !== child); child.parentNode = null; return child; },
    addEventListener(type, fn) { this.listeners[type] = fn; },
    click() { this.listeners.click?.({ type: 'click', target: this }); },
  };
  if (tag === 'form') {
    el.submit = function submit() {
      const fields = Object.fromEntries(this.children.filter((c) => c.tagName === 'INPUT').map((c) => [c.name, c.value]));
      env.submitted = { method: String(this.method).toUpperCase(), action: this.action, fields };
    };
  }
  return el;
}

// The parts of a fake node tree a test reads: every element, depth first, and
// all the text a reader would see.
function walk(node, out = []) {
  if (!node) return out;
  out.push(node);
  for (const child of node.children || []) walk(child, out);
  return out;
}
const textOf = (node) => walk(node).map((n) => n.textContent || '').filter(Boolean).join('\n');
// The guide an installed app stops on: the <main class="vmx-guide"> in the body the script made.
function guideOf(env) {
  return env.nodes.flatMap((n) => walk(n)).find((n) => n.tagName === 'MAIN' && /\bvmx-guide\b/.test(n.className)) || null;
}

// `installed`: { standalone: true } is iOS's home-screen flag; { display: 'standalone' }
// makes matchMedia('(display-mode: standalone)') match. `navType` is what
// performance.getEntriesByType('navigation') reports for this load. `ua` is the
// user agent the guide reads to name the steps of this device.
function run({
  url = `${OLD}${HERE}`, local = {}, session = {}, online = true, meta = META, compression = true,
  idb = undefined, failLocal = false, failSession = false, installed = null, navType = 'navigate', ua = '', maxTouchPoints = 0,
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
    navigator: { onLine: online, userAgent: ua, maxTouchPoints, ...(installed?.standalone ? { standalone: true } : {}) },
    matchMedia: (query) => ({ matches: query === `(display-mode: ${installed?.display || 'browser'})` }),
    performance: { getEntriesByType: (type) => (type === 'navigation' ? [{ type: navType }] : []) },
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
  assert.deepEqual(Object.keys(env.submitted.fields).sort(), ['enc', 'h', 'p']);
  assert.equal(env.submitted.fields.enc, 'gz64');
  assert.match(env.submitted.fields.p, /^[A-Za-z0-9_-]+$/);
  assert.match(env.submitted.fields.h, /^[0-9a-f]{16}$/);
  assert.equal(sessionStorage.getItem('vmx-move-to'), HERE, 'where the learner was stays in this tab');
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
  for (const to of ['//evil.example/x', '/\\evil.example', 'https://evil.example', 'javascript:alert(1)', '/a\nb', `/${'a'.repeat(16384)}`]) {
    const { env } = run({ url: `${OLD}/?vmx-moved=abc&to=${encodeURIComponent(to)}` });
    assert.deepEqual(env.replaced, [`${NEW}/`], to);
  }
});

test('hold, offline, auth callbacks and unusable storage keep the old app, data untouched', async () => {
  const cases = [
    { url: `${OLD}/app/notes?vmx-move=hold`, stayedAt: '/app/notes' },
    { url: `${OLD}/?vmx-move=hold&to=${encodeURIComponent(HERE)}`, stayedAt: HERE },
    { session: { 'vmx-move-hold': String(Date.now() - 1000) } },
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

// A hold is the time it began; it lasts half an hour (tested below).
const holdStarted = (sessionStorage) => Math.abs(Date.now() - Number(sessionStorage.getItem('vmx-move-hold'))) < 5000;

test('a hold lasts for the tab', () => {
  const { sessionStorage } = run({ url: `${OLD}/?vmx-move=hold`, local: STUDY });
  assert.ok(holdStarted(sessionStorage));
});

test('coming straight back from vetmock.com means it still redirects here: hold, no loop', () => {
  const back = run({ local: STUDY, session: { 'vmx-move-out': String(Date.now() - 1500) } });
  assert.deepEqual(back.env.replaced, []);
  assert.equal(back.env.submitted, null);
  assert.ok(holdStarted(back.sessionStorage));
  const later = run({ local: {}, session: { 'vmx-move-out': String(Date.now() - 120_000) } });
  assert.deepEqual(later.env.replaced, [`${NEW}${HERE}`], 'an old mark does not hold a later visit');
});

test('retry forgets the last ACK and the hold, then moves', async () => {
  const first = run({ local: STUDY });
  await settle(first.env);
  const { env, localStorage, sessionStorage } = run({
    url: `${OLD}/?vmx-move=retry`,
    local: { ...STUDY, 'vmx-move-sent': first.env.submitted.fields.h },
    session: { 'vmx-move-hold': '1', 'vmx-move-out': String(Date.now()) },
  });
  await settle(env);
  assert.equal(localStorage.getItem('vmx-move-sent'), null);
  assert.ok(env.submitted);
  assert.equal(sessionStorage.getItem('vmx-move-to'), '/', 'our own parameters are not carried');
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

test('localStorage too large on its own holds as well, PDF ink and events or not', async () => {
  const big = 'x'.repeat(3_400_000); // > 4.2 MB once base64-encoded without compression
  const tooBig = run({ local: { ...STUDY, 'vmx-notes': JSON.stringify({ q1: big }) }, compression: false });
  await settle(tooBig.env);
  assert.equal(tooBig.env.submitted, null, 'never lose data to a size limit');
  assert.equal(tooBig.env.replaced.length, 1);
  assert.deepEqual(tooBig.env.replaced, ['https://vetmock.vercel.app/?vmx-move=hold']);
  assert.equal(tooBig.sessionStorage.getItem('vmx-move-to'), HERE, 'the reload keeps the learner where they were');
  assert.ok(holdStarted(tooBig.sessionStorage));
});

test('a policy that refuses the form falls back to the old app', async () => {
  const { env, sessionStorage, localStorage } = run({ local: STUDY });
  await settle(env);
  assert.ok(env.submitted);
  env.listeners.securitypolicyviolation?.({ effectiveDirective: 'form-action', violatedDirective: 'form-action' });
  assert.equal(env.replaced.length, 1, 'refused submission reloads into a hold');
  assert.match(env.replaced[0], /vmx-move=hold/);
  assert.ok(holdStarted(sessionStorage));
  assert.equal(localStorage.getItem('vmx-move-failed'), env.submitted.fields.h, 'the same data is not posted into the same refusal again');
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
  // Vercel compiles sources strictly (path-to-regexp 6, strict: true), where `/:path*` matches
  // neither `/` nor a path ending in `/`: production kept serving the old home page to Googlebot
  // (measured 2026-10-08). `/:path(.*)` compiles to ^(?:\/(.*))$ and matches every path.
  assert.equal(rule.source, '/:path(.*)');
  assert.equal(rule.destination, 'https://vetmock.com/:path');
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

test('Google popup sign-in works on vetmock.com; LINE login stays off there until its LIFF endpoint moves', async () => {
  const gis = await import('../../src/lib/google-gis.js');
  const liff = await import('../../src/lib/line-liff.js');
  // One constant each; flipping it follows the console change. vetmock.com
  // became an Authorized JavaScript origin of the GIS client on 2026-10-12;
  // the LIFF endpoint still points at vetmock.vercel.app.
  assert.equal(gis.GIS_AUTHORISED_ON_VETMOCK_COM, true);
  assert.equal(liff.LIFF_ENDPOINT_ON_VETMOCK_COM, false);
  for (const allowed of [gis.gisOriginAllowed, liff.liffOriginAllowed]) {
    assert.equal(allowed('https://vetmock.vercel.app'), true);
    assert.equal(allowed('http://localhost:5173'), true);
    assert.equal(allowed('http://localhost:4173'), true);
    assert.equal(allowed('https://vetmock-git-x-palmzamak2547s-projects.vercel.app'), false);
    assert.equal(allowed('http://localhost.evil.example'), false);
    assert.equal(allowed(undefined), false);
  }
  assert.equal(gis.gisOriginAllowed('https://vetmock.com'), true, 'the popup flow on the primary origin');
  assert.equal(liff.liffOriginAllowed('https://vetmock.com'), false, 'no LINE button there until the LIFF endpoint moves');
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
  const online = run({ local: STUDY, session: { 'vmx-move-hold': String(Date.now()) } });
  assert.deepEqual(online.env.replaced, [], 'held');
  assert.equal(online.env.windowListeners.error, undefined, 'online holds load the app as before');
});

// ── review fixes (2026-10-08) ───────────────────────────────────────────────

// A shared quiz link is /?qset=<base64url of [{s,i},...]> (src/lib/share-link.js):
// 70 questions already pass 2,048 characters and 200 run to about 5,900.
function quizPath(n) {
  const rows = Array.from({ length: n }, (_, i) => ({ s: 'com5', i: 1000 + i }));
  return `/?qset=${Buffer.from(JSON.stringify(rows)).toString('base64url')}`;
}

test('a shared quiz link of 200 questions keeps its path through every hop', async () => {
  const long = quizPath(200);
  assert.ok(long.length > 5000 && long.length < 16384, String(long.length));
  assert.deepEqual(run({ url: `${OLD}${long}` }).env.replaced, [`${NEW}${long}`], 'straight on');
  assert.deepEqual(run({ url: `${OLD}/?vmx-moved=abc&to=${encodeURIComponent(long)}` }).env.replaced, [`${NEW}${long}`], 'the ACK hop');
  const moving = run({ url: `${OLD}${long}`, local: STUDY });
  await settle(moving.env);
  assert.equal(moving.sessionStorage.getItem('vmx-move-to'), long, 'the tab keeps it whole');
  const tooLong = `/${'a'.repeat(16384)}`;
  assert.deepEqual(run({ url: `${OLD}/?vmx-moved=abc&to=${encodeURIComponent(tooLong)}` }).env.replaced, [`${NEW}/`], 'past 16 KB it is not a path this app makes');
});

test('too much for one POST: nothing is sent, the tab holds and says why, and that data is not packed again', async () => {
  const big = 'x'.repeat(3_400_000); // > 4.2 MB once base64-encoded without compression
  const row = { key: 'guest:e', owner: 'guest', event: { id: 'e', note: big }, pending: 1 };
  const idb = fakeIndexedDb({ 'vmx-pdf-annotations': { docs: [] }, 'vmx-study-events-v1': { events: [row] } });
  const first = run({ local: STUDY, compression: false, idb });
  await settle(first.env);
  assert.equal(first.env.submitted, null, 'nothing moves without its study events');
  assert.equal(first.env.replaced.length, 1);
  const back = new URL(first.env.replaced[0]);
  assert.equal(back.origin, OLD);
  assert.equal(back.searchParams.get('vmx-move'), 'hold');
  assert.equal(back.searchParams.get('to'), null, 'not in the URL');
  assert.equal(first.sessionStorage.getItem('vmx-move-to'), HERE, 'the reload keeps the learner where they were');
  assert.match(first.localStorage.getItem('vmx-move-big') || '', /^[0-9a-f]{16}$/, 'remembered for this data');

  // The reload into the old app says why it is still here.
  const stored = () => Object.fromEntries(first.localStorage.values);
  const held = run({ url: first.env.replaced[0], local: stored(), session: Object.fromEntries(first.sessionStorage.values), idb });
  assert.deepEqual(held.env.replaced, []);
  assert.equal(held.env.stayedAt, HERE);
  assert.match(held.sandbox.__vmxMoveNote || '', /มากเกิน/);
  assert.doesNotMatch(held.sandbox.__vmxMoveNote, /·/);

  // A later session with the same data holds at once: no IndexedDB read, no packing, no POST.
  let opened = 0;
  const counting = { open: (...args) => { opened += 1; return idb.open(...args); } };
  const later = run({ local: stored(), idb: counting });
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(opened, 0);
  assert.equal(later.env.submitted, null);
  assert.deepEqual(later.env.replaced, []);
  assert.equal(later.env.stopped, 0, 'the old app boots');
  assert.match(later.sandbox.__vmxMoveNote || '', /มากเกิน/);

  // Changed data is worth another try.
  const changed = run({ local: { ...stored(), 'vmx-bookmarks': '[1]' }, compression: false, idb: fakeIndexedDb({}) });
  await settle(changed.env);
  assert.ok(changed.env.submitted);
});

test('a move vetmock.com could not finish comes back with its hash: that data is not sent again, changed data is', async () => {
  const first = run({ local: STUDY });
  await settle(first.env);
  const h = first.env.submitted.fields.h;
  const back = run({ url: `${OLD}/?vmx-move=hold&failed=${h}&to=${encodeURIComponent(HERE)}`, local: STUDY });
  assert.equal(back.localStorage.getItem('vmx-move-failed'), h);
  assert.deepEqual(back.env.replaced, []);
  assert.equal(back.env.stayedAt, HERE, 'our parameters leave the address bar');
  assert.match(back.sandbox.__vmxMoveNote || '', /ไม่สำเร็จ/);

  const again = run({ local: { ...STUDY, 'vmx-move-failed': h } });
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(again.env.submitted, null, 'the same data is not uploaded again');
  assert.deepEqual(again.env.replaced, []);
  assert.equal(again.env.stopped, 0, 'the old app boots');

  const changed = run({ local: { ...STUDY, 'vmx-bookmarks': '[101]', 'vmx-move-failed': h } });
  await settle(changed.env);
  assert.ok(changed.env.submitted, 'changed data tries again');

  const retry = run({ url: `${OLD}/?vmx-move=retry`, local: { ...STUDY, 'vmx-move-failed': h, 'vmx-move-big': h } });
  await settle(retry.env);
  assert.ok(retry.env.submitted, 'retry tries again');
  assert.equal(retry.localStorage.getItem('vmx-move-failed'), null);
  assert.equal(retry.localStorage.getItem('vmx-move-big'), null);

  const junk = run({ url: `${OLD}/?vmx-move=hold&failed=%3Cscript%3E`, local: STUDY });
  assert.equal(junk.localStorage.getItem('vmx-move-failed'), null, 'only a hash is stored');
});

// iOS keeps a home-screen app's storage apart from Safari's, and leaving its
// scope opens a browser sheet. Android and desktop installed apps share the
// browser's storage, and one that held would stay a second writer forever.
test('only an iOS home-screen app stays: it boots, and says once per device that VetMock is moving', async () => {
  const NOTE = 'VetMock กำลังย้ายไปที่ vetmock.com แอปที่ติดตั้งไว้บนหน้าจอใช้ต่อได้ตามปกติ ข้อมูลยังอยู่ครบ';
  const ios = run({ local: STUDY, installed: { standalone: true } });
  await new Promise((r) => setTimeout(r, 10));
  assert.deepEqual(ios.env.replaced, []);
  assert.equal(ios.env.submitted, null);
  assert.equal(ios.env.stopped, 0);
  assert.notEqual(ios.sandbox.__vmxMoving, true);
  assert.equal(ios.sandbox.__vmxMoveNote, NOTE);
  const shown = Object.fromEntries(ios.localStorage.values);
  const again = run({ local: shown, installed: { standalone: true } });
  assert.deepEqual(again.env.replaced, []);
  assert.equal(again.sandbox.__vmxMoveNote, undefined, 'once per device, not once per launch');
  assert.deepEqual(run({ installed: { standalone: true } }).env.replaced, [], 'nothing stored: still stays');
  const ack = run({ url: `${OLD}/?vmx-moved=0123456789abcdef&to=%2Fapp`, installed: { standalone: true } });
  assert.deepEqual(ack.env.replaced, [], 'not even the ACK leaves the app');
  assert.equal(ack.env.stayedAt, '/app');
  for (const display of ['standalone', 'fullscreen', 'minimal-ui', 'browser']) {
    const other = run({ local: STUDY, installed: { display } });
    await settle(other.env);
    assert.ok(other.env.submitted, `display-mode ${display}: shares the browser's storage, so it moves`);
  }
});

// ── The installed app that cannot change address ─────────────────────────────
// An app installed from vetmock.vercel.app is bound to that address. Sent on to
// vetmock.com it leaves its scope, and the browser puts its own bar (the close
// button, the page title, "vetmock.com") over every page for good, which is what
// the owner saw on Android. Its data still moves, once, as for a tab; what it no
// longer does is go on without a word. It stops on a short guide to installing
// again, and the learner's one button then opens vetmock.com.
const CHROME_ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const SAMSUNG = 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36';
const DESKTOP_CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const ACK = '0123456789abcdef';
const GUIDE_TITLE = 'VetMock ย้ายบ้านใหม่แล้ว';
const MOVED_LINE = 'ข้อมูลการเรียนของคุณไปอยู่ที่ vetmock.com เรียบร้อยแล้ว';
const INSTALLED = ['standalone', 'minimal-ui', 'window-controls-overlay'];

const buttonOf = (guide) => walk(guide).filter((n) => n.tagName === 'BUTTON');

test('an installed app is not sent on once its data has moved: it stops on the guide, and its one button goes on', async () => {
  for (const display of INSTALLED) {
    const ack = run({ url: `${OLD}/?vmx-moved=${ACK}&to=%2Fapp%2Fnotes%3Fx%3D1%23n`, installed: { display }, ua: CHROME_ANDROID });
    assert.deepEqual(ack.env.replaced, [], `display-mode ${display}: the ACK does not carry the installed app away`);
    assert.equal(ack.localStorage.getItem('vmx-move-sent'), ACK, 'what arrived is still remembered');
    assert.equal(ack.sandbox.__vmxMoving, true, 'the old app does not boot underneath the guide');
    assert.equal(ack.env.stopped, 1);
    assert.equal(ack.env.stayedAt, '/app/notes?x=1#n', 'the address bar goes back to the learner\'s own page');
    const guide = guideOf(ack.env);
    assert.ok(guide, 'the guide is on screen');
    const text = textOf(guide);
    assert.ok(text.includes(GUIDE_TITLE));
    assert.ok(text.includes(MOVED_LINE), 'it says the data is already over there');
    const buttons = buttonOf(guide);
    assert.equal(buttons.length, 1, 'one button, nothing else to choose');
    assert.equal(buttons[0].textContent, 'เปิด vetmock.com');
    assert.deepEqual(ack.env.replaced, [], 'showing the guide goes nowhere');
    buttons[0].click();
    assert.deepEqual(ack.env.replaced, [`${NEW}/app/notes?x=1#n`], 'the button opens vetmock.com at the same page');
    assert.ok(Number(ack.sessionStorage.getItem('vmx-move-out')) > 0, 'and marks the way out, so a redirect back cannot loop');
  }
});

test('an installed app with nothing new to carry stops on the guide too, and a tab still goes straight on', async () => {
  const first = run({ local: STUDY });
  await settle(first.env);
  const sent = { ...STUDY, 'vmx-move-sent': first.env.submitted.fields.h };
  for (const local of [sent, {}]) {
    const app = run({ local, installed: { display: 'standalone' }, ua: CHROME_ANDROID });
    assert.deepEqual(app.env.replaced, []);
    assert.equal(app.env.submitted, null, 'nothing is posted again');
    const guide = guideOf(app.env);
    assert.ok(guide, 'the guide is on screen');
    buttonOf(guide)[0].click();
    assert.deepEqual(app.env.replaced, [`${NEW}${HERE}`]);
  }
  const text = textOf(guideOf(run({ local: {}, installed: { display: 'standalone' }, ua: CHROME_ANDROID }).env));
  assert.ok(!text.includes(MOVED_LINE), 'with nothing stored it does not claim anything moved');
  assert.ok(text.includes(GUIDE_TITLE));
  assert.deepEqual(run({ local: sent, ua: CHROME_ANDROID }).env.replaced, [`${NEW}${HERE}`], 'a tab goes on as ever');
  assert.equal(guideOf(run({ local: sent, ua: CHROME_ANDROID }).env), null, 'a tab never sees the guide');
});

test('the guide gives the steps of the device it is on and no other', async () => {
  const ack = (ua) => textOf(guideOf(run({ url: `${OLD}/?vmx-moved=${ACK}`, installed: { display: 'standalone' }, ua }).env));
  const android = ack(CHROME_ANDROID);
  assert.match(android, /เปิด Chrome เข้า vetmock\.com กด ⋮/);
  assert.match(android, /“ติดตั้ง”/, 'the Install menu items of Chrome all begin with that word');
  assert.match(android, /ลบ VetMock อันเก่า/);
  const samsung = ack(SAMSUNG);
  assert.match(samsung, /เปิด Samsung Internet เข้า vetmock\.com/);
  assert.match(samsung, /“Add page to”/);
  assert.match(samsung, /“Home screen”/);
  const desktop = ack(DESKTOP_CHROME);
  assert.match(desktop, /เปิด Chrome หรือ Edge เข้า vetmock\.com/);
  assert.match(desktop, /ปลายแถบที่อยู่/);
  const own = (text) => text.split('\n').filter((l) => /เปิด (Chrome|Samsung)/.test(l)).length;
  for (const text of [android, samsung, desktop]) assert.equal(own(text), 1, 'exactly one install step names a browser');
  assert.ok(!/Samsung/.test(android) && !/Edge/.test(android), 'Android Chrome is not told about Samsung or Edge');
  assert.ok(!/Chrome/.test(samsung), 'Samsung Internet is not told about Chrome');
  assert.ok(!/Samsung/.test(desktop) && !/Android/.test(desktop), 'a computer is not told about phones');
  for (const text of [android, samsung, desktop]) {
    for (const word of ['Safari', 'iPhone', 'iPad', 'Share', 'Add to Home Screen']) assert.ok(!text.includes(word), `an installed app here never reads iOS wording (${word})`);
  }
});

test('the guide is plain, kind and honest: no dot separators, no tool talk, and every number it names is true', () => {
  const states = [
    run({ url: `${OLD}/?vmx-moved=${ACK}`, installed: { display: 'standalone' }, ua: CHROME_ANDROID }),
    run({ url: `${OLD}/?vmx-moved=${ACK}`, installed: { display: 'standalone' }, ua: SAMSUNG }),
    run({ url: `${OLD}/?vmx-moved=${ACK}`, installed: { display: 'standalone' }, ua: DESKTOP_CHROME }),
    run({ local: {}, installed: { display: 'standalone' }, ua: CHROME_ANDROID }),
  ];
  for (const { env } of states) {
    const guide = guideOf(env);
    const text = textOf(guide);
    assert.ok(!text.includes('·') && !text.includes('•'), 'no middle dot as a separator');
    assert.ok(!/\bAI\b|Claude|GPT|build|deploy|vercel|cache|bridge|redirect/i.test(text.replace(/vetmock\.vercel\.app/g, '')), text);
    assert.ok(!text.includes('ข้อสอบเก่า'));
    const items = walk(guide).filter((n) => n.tagName === 'LI');
    assert.ok(items.length === 2, 'two steps, not a wall of instructions');
    assert.ok(text.length < 600, `short enough for one screen (${text.length} characters)`);
  }
});

test('holds, offline, sign-in callbacks and marked data keep an installed app booting as a tab\'s would, with no guide', async () => {
  const cases = [
    ['hold', { url: `${OLD}/?vmx-move=hold`, local: STUDY }],
    ['hold after a failed move', { url: `${OLD}/?vmx-move=hold&failed=${ACK}`, local: STUDY }],
    ['offline', { local: STUDY, online: false }],
    ['a Google sign-in callback', { url: `${OLD}/?code=abc123&state=x`, local: STUDY }],
    ['an email sign-in callback', { url: `${OLD}/#access_token=abc&type=magiclink`, local: STUDY }],
  ];
  for (const [name, options] of cases) {
    const app = run({ ...options, installed: { display: 'standalone' }, ua: CHROME_ANDROID });
    await new Promise((r) => setTimeout(r, 5));
    assert.equal(guideOf(app.env), null, `${name}: no guide`);
    assert.notEqual(app.sandbox.__vmxMoving, true, `${name}: the old app boots`);
    assert.equal(app.env.stopped, 0, name);
    assert.deepEqual(app.env.replaced, [], name);
    assert.equal(app.env.submitted, null, name);
  }
  // Data that could not move before: the old app boots and says so, as for a tab.
  const first = run({ local: STUDY });
  await settle(first.env);
  const hash = first.env.submitted.fields.h;
  for (const mark of ['vmx-move-big', 'vmx-move-failed']) {
    const app = run({ local: { ...STUDY, [mark]: hash }, installed: { display: 'standalone' }, ua: CHROME_ANDROID });
    assert.equal(guideOf(app.env), null, `${mark}: no guide`);
    assert.notEqual(app.sandbox.__vmxMoving, true);
    assert.equal(typeof app.sandbox.__vmxMoveNote, 'string', `${mark}: it says why it stayed`);
  }
});

test('display-mode fullscreen and browser are not installed apps: a tab goes straight on, as ever', async () => {
  for (const display of ['fullscreen', 'browser']) {
    const ack = run({ url: `${OLD}/?vmx-moved=${ACK}`, installed: { display }, ua: DESKTOP_CHROME });
    assert.deepEqual(ack.env.replaced, [`${NEW}/`], display);
    assert.equal(guideOf(ack.env), null, display);
  }
});

test('retry is the learner asking again: an installed app moves without the guide in the way', async () => {
  const app = run({ url: `${OLD}/?vmx-move=retry`, local: STUDY, installed: { display: 'standalone' }, ua: CHROME_ANDROID });
  await settle(app.env);
  assert.ok(app.env.submitted, 'the data is posted again');
  assert.equal(guideOf(app.env), null);
});

test('an iOS home-screen app never reaches the guide, even though it reports display-mode standalone too', async () => {
  const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1';
  for (const url of [`${OLD}${HERE}`, `${OLD}/?vmx-moved=${ACK}`]) {
    const app = run({ url, local: STUDY, installed: { standalone: true, display: 'standalone' }, ua: IOS });
    await new Promise((r) => setTimeout(r, 5));
    assert.equal(guideOf(app.env), null, url);
    assert.deepEqual(app.env.replaced, [], 'it stays where it is, as before');
    assert.equal(app.env.submitted, null);
    assert.notEqual(app.sandbox.__vmxMoving, true, 'and boots');
  }
});

test('an iPhone or iPad is never shown the guide, whatever display-mode says: it has no steps here', async () => {
  const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1';
  const MAC_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15';
  // Without the home-screen flag these are not the app that stays, so they go on as a tab always did.
  for (const [ua, touch] of [[IPHONE, 5], [MAC_UA, 5]]) {
    const app = run({ url: `${OLD}/?vmx-moved=${ACK}`, installed: { display: 'standalone' }, ua, maxTouchPoints: touch });
    assert.deepEqual(app.env.replaced, [`${NEW}/`], ua);
    assert.equal(guideOf(app.env), null, ua);
  }
  // A real Mac has no touch points: its Dock web app is a computer's installed app and gets the computer's steps.
  const mac = run({ url: `${OLD}/?vmx-moved=${ACK}`, installed: { display: 'standalone' }, ua: MAC_UA, maxTouchPoints: 0 });
  assert.ok(guideOf(mac.env), 'a Mac is not an iPad');
});

test('the guide\'s button is a real touch target and the guide follows the dark theme', () => {
  const css = /<style>([\s\S]*?)<\/style>/.exec(HTML.slice(HTML.indexOf('vmx-origin-move')))?.[1] || '';
  assert.match(css, /\.vmx-guide button\{[^}]*min-height:(4[4-9]|[5-9]\d)px/, 'at least 44px tall');
  assert.match(css, /\[data-theme="dark"\] \.vmx-guide button\{/, 'dark theme has its own button colours');
  assert.match(css, /\.vmx-guide\{[^}]*overflow-y:auto/, 'a small phone can scroll to the last step');
});

test('where the learner was stays in this tab, never in a URL: the form does not carry it and each hop back finds it', async () => {
  const long = quizPath(200);
  const moving = run({ url: `${OLD}${long}`, local: STUDY });
  await settle(moving.env);
  assert.deepEqual(Object.keys(moving.env.submitted.fields).sort(), ['enc', 'h', 'p']);
  assert.equal(moving.sessionStorage.getItem('vmx-move-to'), long);
  const tab = () => Object.fromEntries(moving.sessionStorage.values);
  const ack = run({ url: `${OLD}/?vmx-moved=0123456789abcdef`, session: tab() });
  assert.deepEqual(ack.env.replaced, [`${NEW}${long}`]);
  assert.equal(ack.sessionStorage.getItem('vmx-move-to'), null, 'used once');
  const failed = run({ url: `${OLD}/?vmx-move=hold&failed=0123456789abcdef`, local: STUDY, session: tab() });
  assert.equal(failed.env.stayedAt, long, 'back from a failed move, the old app opens there');
  // A reload into the old app does not carry it in the URL either.
  const big = 'x'.repeat(3_400_000);
  const tooBig = run({ url: `${OLD}${long}`, local: { ...STUDY, 'vmx-notes': JSON.stringify({ q1: big }) }, compression: false });
  await settle(tooBig.env);
  assert.deepEqual(tooBig.env.replaced, [`${OLD}/?vmx-move=hold`]);
  assert.equal(tooBig.sessionStorage.getItem('vmx-move-to'), long);
});

test('a hold lasts half an hour, not the whole life of the tab', async () => {
  const set = run({ url: `${OLD}/?vmx-move=hold`, local: STUDY });
  const stamp = Number(set.sessionStorage.getItem('vmx-move-hold'));
  assert.ok(Math.abs(Date.now() - stamp) < 5000, 'the hold remembers when it began');
  const recent = run({ local: STUDY, session: { 'vmx-move-hold': String(Date.now() - 60_000) } });
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(recent.env.submitted, null);
  assert.deepEqual(recent.env.replaced, []);
  const expired = run({ local: STUDY, session: { 'vmx-move-hold': String(Date.now() - 31 * 60_000) } });
  await settle(expired.env);
  assert.ok(expired.env.submitted, 'an expired hold moves on the next load');
});

test('back or forward to the old address is not taken for a redirect loop', async () => {
  const first = run({ local: STUDY });
  await settle(first.env);
  const local = { ...STUDY, 'vmx-move-sent': first.env.submitted.fields.h };
  const out = { 'vmx-move-out': String(Date.now() - 1500) };
  assert.deepEqual(run({ local, session: out, navType: 'navigate' }).env.replaced, [], 'a navigation this soon is the redirect coming back');
  const back = run({ local, session: out, navType: 'back_forward' });
  assert.deepEqual(back.env.replaced, [`${NEW}${HERE}`], 'the back button decides as usual');
  assert.equal(back.sessionStorage.getItem('vmx-move-hold'), null);
  // Restored from the back-forward cache, the moving page reloads to decide; that reload is the same case.
  const moving = run({ local: STUDY });
  await settle(moving.env);
  moving.env.windowListeners.pageshow({ persisted: true });
  assert.equal(moving.env.reloaded, 1);
  const reloaded = run({ local, session: Object.fromEntries(moving.sessionStorage.values), navType: 'reload' });
  assert.deepEqual(reloaded.env.replaced, [`${NEW}${HERE}`]);
});
