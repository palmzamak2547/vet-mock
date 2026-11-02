// The Chula sign-in wall in front of the workspace [docs/CHULA-SIGNIN.md]: the workspace never shows
// before the wall knows, a saved member session opens with no network, nobody is signed out because a
// check failed, the wall's memory lives in the one prefs key, and every word it shows is a dictionary
// key in both languages. OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// A localStorage for prefs.js (Node has none).
const mem = new Map();
globalThis.localStorage = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) };

const { createWall, problemKey, PROBLEM_KEYS, chulaWall } = await import('../../src/lib/auth/wall.js');
const { prefsStore, rememberAnswer, rememberedMember, rememberedEnforce } = await import('../../src/lib/auth/chula.js');
const { readPrefs, writePrefs, PREFS_KEY } = await import('../../src/lib/store/prefs.js');
const { signIn, signedOutHere } = await import('../../src/lib/auth/client.js');
const dict = (await import('../../src/i18n/runtime-chula.js')).default;
const runtime = (await import('../../src/i18n/runtime.js')).default;

// A real Chula identity carries Google's hosted-domain claim; a Gmail one has none.
const hdOf = (email) => (/@(student.)?chula.ac.th$/i.test(email) ? { custom_claims: { hd: email.split('@')[1].toLowerCase() } } : {});
const google = (email, verified = true) => ({ provider: 'google', identity_data: { email, email_verified: verified, ...hdOf(email) } });
const MEMBER = { id: '5f0c2d7e-8a1b-4c3d-9e2f-0123456789ab', email: 'someone@gmail.com', identities: [google('someone@gmail.com'), google('6631234531@student.chula.ac.th')] };
const GMAIL = { id: '6a1d3e8f-9b2c-4d5e-8f3a-123456789abc', email: 'someone@gmail.com', identities: [google('someone@gmail.com')] };

function memoryStore(seed = {}) {
  const map = new Map(Object.entries(seed));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)) };
}
const remember = (enforce, members = []) => ({ 'vmx-chula-wall': JSON.stringify({ enforce, members }) });

function fakeAuth(over = {}) {
  const listeners = [];
  const calls = { signIn: [], signOut: 0 };
  const auth = {
    configured: true,
    url: 'https://x.supabase.co',
    key: 'anon',
    stored: () => null,
    returning: () => false,
    session: async () => ({ session: null, error: null, retryable: false }),
    onChange: async (cb) => { listeners.push(cb); return () => {}; },
    signIn: async (hd) => { calls.signIn.push(hd); },
    signOut: async () => { calls.signOut += 1; for (const cb of listeners) cb('SIGNED_OUT', null); },
    ...over,
  };
  return { auth, calls, emit: (event, session) => { for (const cb of listeners) cb(event, session); } };
}

function wallWith({ auth, store = memoryStore(), answer = { enforce: true, member: false, uid: null }, location, history, doc = null, now, reload }) {
  const seen = [];
  const fetchImpl = async (url, init) => {
    seen.push({ url, auth: init.headers.Authorization });
    if (answer === 'offline') throw new TypeError('Failed to fetch');
    return Response.json(typeof answer === 'function' ? answer(init.headers.Authorization) : answer);
  };
  const wall = createWall({
    auth, store, fetchImpl, online: () => true, events: null, safetyMs: 30, doc,
    ...(now ? { now } : {}), ...(reload ? { reload } : {}),
    location: location || { pathname: '/app', search: '', hash: '' },
    history: history || { state: null, replaceState() {} },
  });
  return { wall, seen, store };
}

test('a build without sign-in keeps the workspace open and never loads the wall', async () => {
  assert.equal(chulaWall().get().configured, false, 'no VITE_SUPABASE_URL under node');
  assert.equal(chulaWall().get().gate, 'open');
  const workspace = readFileSync(new URL('../../src/workspace/Workspace.jsx', import.meta.url), 'utf8');
  assert.match(workspace, /AUTH_CONFIGURED \? \(/, 'the gate is mounted only when sign-in is configured');
  assert.match(workspace, /lazy\(\(\) => import\('\.\/components\/ChulaGate\.jsx'\)\)/, 'and in its own chunk');
  assert.deepEqual(await signIn('google', { hd: 'student.chula.ac.th' }), { ok: false, key: 'runtime.auth.notConfigured' });
});

test('never the workspace before the switch is known: checking, then the sign-in card', async () => {
  const { wall, seen } = wallWith({ auth: fakeAuth().auth });
  assert.equal(wall.get().gate, 'checking');
  await wall.start();
  assert.equal(wall.get().gate, 'signin');
  assert.equal(seen[0].url, 'https://x.supabase.co/rest/v1/rpc/chula_access_state');
  assert.equal(seen[0].auth, 'Bearer anon');
});

test('the switch off keeps the old workspace; unreachable assumes on unless the device knew better', async () => {
  const off = wallWith({ auth: fakeAuth().auth, answer: { enforce: false, member: false, uid: null } });
  await off.wall.start();
  assert.equal(off.wall.get().gate, 'open');
  const first = wallWith({ auth: fakeAuth().auth, answer: 'offline' });
  await first.wall.start();
  assert.equal(first.wall.get().gate, 'signin');
  const known = wallWith({ auth: fakeAuth().auth, store: memoryStore(remember(false)), answer: 'offline' });
  await known.wall.start();
  assert.equal(known.wall.get().gate, 'open');
});

test('a saved member session opens offline, and the check failing signs nobody out', async () => {
  const { auth, calls } = fakeAuth({
    stored: () => ({ access_token: 'old', user: MEMBER }),
    session: async () => ({ session: null, error: { name: 'AuthRetryableFetchError', status: 0 }, retryable: true }),
  });
  const { wall } = wallWith({ auth, store: memoryStore(remember(true)), answer: 'offline' });
  assert.equal(wall.get().gate, 'open', 'from the device, before any network');
  await wall.start();
  assert.equal(wall.get().gate, 'open');
  assert.equal(wall.get().user.id, MEMBER.id);
  assert.equal(calls.signOut, 0);
});

test('an account the server let in before opens offline; one it never did waits for the link', async () => {
  const offline = { stored: () => ({ access_token: 'old', user: GMAIL }), session: async () => ({ session: null, error: { name: 'AuthRetryableFetchError', status: 0 }, retryable: true }) };
  const known = wallWith({ auth: fakeAuth(offline).auth, store: memoryStore(remember(true, [GMAIL.id])), answer: 'offline' });
  await known.wall.start();
  assert.equal(known.wall.get().gate, 'open');
  const stranger = wallWith({ auth: fakeAuth(offline).auth, store: memoryStore(remember(true)), answer: 'offline' });
  await stranger.wall.start();
  assert.equal(stranger.wall.get().gate, 'link');
});

test('the server decides for a signed-in account, and "use another account" asks again', async () => {
  const fresh = { stored: () => ({ access_token: 't', user: GMAIL }), session: async () => ({ session: { access_token: 'fresh', user: GMAIL }, error: null }) };
  const yes = wallWith({ auth: fakeAuth(fresh).auth, answer: (b) => ({ enforce: true, member: b === 'Bearer fresh', uid: GMAIL.id }) });
  assert.equal(yes.wall.get().gate, 'checking', 'a non-member waits for the server (the admin passes there)');
  await yes.wall.start();
  assert.equal(yes.wall.get().gate, 'open');
  const { auth, calls } = fakeAuth(fresh);
  const no = wallWith({ auth, answer: (b) => ({ enforce: true, member: false, uid: b === 'Bearer anon' ? null : GMAIL.id }) });
  await no.wall.start();
  assert.equal(no.wall.get().gate, 'link');
  assert.equal(no.wall.get().email, 'someone@gmail.com');
  await no.wall.signOut();
  assert.equal(calls.signOut, 1);
  assert.equal(no.wall.get().gate, 'signin');
  assert.equal(no.wall.get().problem, null, 'asked for: no "expired" line');
});

test('a session gone while away says "expired"; a sign-out from the account menu does not', async () => {
  const gone = wallWith({ auth: fakeAuth({ stored: () => ({ access_token: 'dead', user: GMAIL }), session: async () => ({ session: null, error: null }) }).auth });
  await gone.wall.start();
  assert.equal(gone.wall.get().problem, 'expired');

  let menu = false;
  const live = { access_token: 't', user: MEMBER };
  const f = fakeAuth({ stored: () => live, session: async () => ({ session: live, error: null }), signedOutHere: () => menu });
  const w = wallWith({ auth: f.auth, store: memoryStore(remember(true)) });
  await w.wall.start();
  assert.equal(w.wall.get().gate, 'open');
  menu = true; // AccountMenu called client.js signOut()
  f.emit('SIGNED_OUT', null);
  assert.equal(w.wall.get().gate, 'signin');
  assert.equal(w.wall.get().problem, null);
  assert.equal(signedOutHere(), false, 'nothing signed out on this page yet');
});

test('a landing sign-in (?code=) is "checking" until the exchange settles; a failed one says so', async () => {
  let settle;
  const { auth } = fakeAuth({ returning: () => true, session: () => new Promise((r) => { settle = r; }) });
  const { wall } = wallWith({ auth, answer: { enforce: true, member: true, uid: MEMBER.id } });
  assert.equal(wall.get().gate, 'checking');
  const started = wall.start();
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(wall.get().gate, 'checking');
  settle({ session: { access_token: 'new', user: MEMBER }, error: null });
  await started;
  assert.equal(wall.get().gate, 'open');

  const failed = wallWith({ auth: fakeAuth({ returning: () => true, session: async () => ({ session: null, error: { name: 'AuthPKCEGrantCodeExchangeError', message: 'Code verifier could not be found' } }) }).auth });
  await failed.wall.start();
  assert.equal(failed.wall.get().gate, 'signin');
  assert.equal(failed.wall.get().problem, 'unknown');
});

test('an OAuth error is read from the address once, and with the wall off it still reaches the workspace', async () => {
  const replaced = [];
  const { wall } = wallWith({
    auth: fakeAuth().auth,
    answer: { enforce: false, member: false, uid: null },
    location: { pathname: '/app', search: '?error=access_denied&error_description=The+user+denied+the+request', hash: '' },
    history: { state: null, replaceState: (_s, _t, url) => replaced.push(url) },
  });
  assert.deepEqual(replaced, ['/app']);
  assert.equal(wall.get().problem, 'cancelled');
  assert.equal(wall.get().returned, true);
  await wall.start();
  assert.equal(wall.get().gate, 'open', 'ChulaGate then hands runtime.auth.failed to useOwner\'s notice');
});

test('sign-in buttons: student domain, staff domain, one at a time, freed after the safety timeout', async () => {
  const { auth, calls } = fakeAuth({ signIn: async (hd) => { calls.signIn.push(hd); return new Promise(() => {}); } });
  const { wall } = wallWith({ auth, store: memoryStore(remember(true)) });
  wall.signIn();
  wall.signIn('chula.ac.th');
  assert.deepEqual(calls.signIn, ['student.chula.ac.th']);
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(wall.get().busy, null);
  wall.signIn('chula.ac.th');
  assert.deepEqual(calls.signIn, ['student.chula.ac.th', 'chula.ac.th']);
  await new Promise((r) => setTimeout(r, 50));
  const failing = wallWith({ auth: fakeAuth({ signIn: async () => { throw new TypeError('Failed to fetch'); } }).auth, store: memoryStore(remember(true)) });
  await failing.wall.signIn();
  assert.equal(failing.wall.get().problem, 'offline');
});

test('the wall\'s memory lives inside the one prefs key, validated on the way back', () => {
  mem.clear();
  writePrefs({ lang: 'en' });
  rememberAnswer({ enforce: true, uid: MEMBER.id, member: true });
  assert.deepEqual([...mem.keys()], [PREFS_KEY], 'no second localStorage key');
  assert.deepEqual(readPrefs().chulaWall, { enforce: true, members: [MEMBER.id] });
  assert.equal(readPrefs().lang, 'en', 'the other prefs stay');
  assert.equal(rememberedEnforce(), true);
  assert.equal(rememberedMember(MEMBER.id), true);
  rememberAnswer({ enforce: true, uid: MEMBER.id, member: false });
  assert.equal(rememberedMember(MEMBER.id, prefsStore), false, 'a no forgets the account');
  for (let i = 0; i < 20; i++) rememberAnswer({ enforce: false, uid: `u${i}`, member: true });
  assert.equal(readPrefs().chulaWall.members.length, 8, 'the list stays small');
  assert.ok(mem.get(PREFS_KEY).length < 1024, 'prefs stay under 1 KB');
  mem.set(PREFS_KEY, JSON.stringify({ chulaWall: { enforce: 'yes', members: ['ok', 7, 'x'.repeat(80)] } }));
  assert.deepEqual(readPrefs().chulaWall, { members: ['ok'] }, 'a malformed memory keeps only what is well formed');
  mem.set(PREFS_KEY, '{not json');
  assert.equal(readPrefs().chulaWall, null);
  assert.equal(rememberedEnforce(), null);
});

test('every word the wall shows is a key in both languages, with the wording every VetMock origin uses', () => {
  const gate = readFileSync(new URL('../../src/workspace/components/ChulaGate.jsx', import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1');
  const keys = new Set([...gate.matchAll(/['"`]((?:runtime|common|ws)\.[A-Za-z0-9_.]+)['"`]/g)].map((m) => m[1]));
  for (const key of Object.values(PROBLEM_KEYS)) keys.add(key);
  assert.ok(keys.size >= 20, `only ${keys.size} keys found; the scan is broken`);
  const known = { th: { ...runtime.th, ...dict.th }, en: { ...runtime.en, ...dict.en } };
  for (const key of keys) {
    if (/^(common|ws)\./.test(key)) continue; // workspace-i18n-coverage.test.mjs checks these
    for (const lang of ['th', 'en']) assert.ok(known[lang][key], `${lang} ${key} is missing`);
  }
  assert.equal(dict.th['runtime.chula.title'], 'เข้าสู่ระบบด้วยอีเมลจุฬา');
  assert.equal(dict.th['runtime.chula.lead'], 'กดปุ่ม Google ด้านล่าง แล้วเลือกอีเมลจุฬาของคุณ');
  assert.equal(dict.th['runtime.chula.addressCaption'], 'ไม่ต้องพิมพ์ เลือกบัญชีนี้ในหน้าต่างของ Google');
  assert.equal(dict.th['runtime.chula.google'], 'ดำเนินการต่อด้วย Google', 'the house button, only when the one Google draws cannot load');
  assert.equal(dict.th['runtime.chula.staff'], 'บุคลากรใช้ @chula.ac.th');
  assert.equal(dict.th['runtime.chula.student'], 'นิสิตใช้ @student.chula.ac.th');
  assert.equal(dict.th['runtime.chula.linkTitle'], 'บัญชีนี้ยังไม่ได้เชื่อมกับอีเมลจุฬา');
  assert.equal(dict.th['runtime.chula.linkBody'], 'กดปุ่ม Google แล้วเลือกอีเมลจุฬาของคุณ ความคืบหน้าเดิมอยู่ครบ');
  assert.equal(dict.th['runtime.chula.linkGo'], undefined, 'no more sending the student to vetmock.com to link');
  assert.equal(dict.th['runtime.chula.instead'], 'เข้าบัญชีจุฬานั้นแทน');
  assert.equal(dict.th['runtime.chula.other'], 'ใช้บัญชีอื่น');
  assert.equal(dict.th[problemKey('not-chula')], 'บัญชีนี้ไม่ใช่อีเมลจุฬา เลือกบัญชี @student.chula.ac.th หรือ @chula.ac.th แล้วลองใหม่');
  assert.equal(dict.th[problemKey('cancelled')], 'ยกเลิกการเข้าสู่ระบบแล้ว ลองใหม่ได้ทุกเมื่อ');
  assert.equal(dict.th[problemKey('offline')], 'ยังไม่ได้ต่ออินเทอร์เน็ต การเข้าสู่ระบบครั้งแรกต้องใช้เน็ต เครื่องที่เคยเข้าสู่ระบบแล้วใช้ต่อได้แบบออฟไลน์');
  assert.equal(dict.th[problemKey('expired')], 'เซสชันหมดอายุแล้ว เข้าสู่ระบบอีกครั้ง');
  assert.equal(dict.th[problemKey('unknown')], 'เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง');
  assert.equal(dict.th[problemKey('identity-taken')], 'บัญชีจุฬานี้มีบัญชี VetMock ของตัวเองอยู่แล้ว เข้าบัญชีจุฬานั้นแทนได้เลย ความคืบหน้าในบัญชีนี้ยังอยู่');
  assert.equal(dict.th[problemKey('linking-off')], 'ตอนนี้ยังเชื่อมบัญชีไม่ได้ ลองใหม่อีกครั้ง');
  assert.equal(problemKey('something-new'), PROBLEM_KEYS.unknown);
  assert.equal(problemKey(null), null);
  assert.equal(dict.th['runtime.chula.inapp.line'], 'LINE เปิดหน้าเข้าสู่ระบบของ Google ไม่ได้');
  assert.equal(dict.th['runtime.chula.inapp.other'], '{app} เปิดหน้าเข้าสู่ระบบของ Google ไม่ได้ แตะเมนูของแอปแล้วเลือกเปิดในเบราว์เซอร์');
});

test('Google\'s button: the token becomes a session on this page, and the wall opens for a member', async () => {
  const calls = [];
  const { auth } = fakeAuth({
    idToken: async (token, nonce) => { calls.push([token, nonce]); return { access_token: 'from-google', user: MEMBER }; },
    onChange: async () => { calls.push('subscribed'); return () => {}; },
  });
  const { wall } = wallWith({ auth, store: memoryStore(remember(true)), answer: { enforce: true, member: true, uid: MEMBER.id } });
  await wall.start();
  assert.equal(wall.get().gate, 'signin');
  const done = wall.signInWithGoogleToken('id-token', 'raw-nonce');
  assert.equal(wall.get().busy, 'google');
  await done;
  assert.deepEqual(calls, [['id-token', 'raw-nonce'], 'subscribed'], 'and from then on the wall hears the account');
  assert.equal(wall.get().gate, 'open');
  const refused = wallWith({ auth: fakeAuth({ idToken: async () => { throw new Error('Database error saving new user'); } }).auth, store: memoryStore(remember(true)) });
  await refused.wall.signInWithGoogleToken('t', 'n');
  assert.equal(refused.wall.get().problem, 'not-chula');
  assert.equal(refused.wall.get().busy, null);
});

test('Google\'s own button only on the origin the client lists, with the Chula domain and One Tap', async () => {
  const { GIS_CLIENT_ID, gisOriginAllowed, gisUsable, renderGoogleButton } = await import('../../src/lib/auth/gis.js');
  assert.equal(GIS_CLIENT_ID, '807323754507-v4kctbouiqucot3e0isqju1mq1jl9k2u.apps.googleusercontent.com');
  assert.equal(gisOriginAllowed('https://research.vetmock.com'), true);
  for (const origin of ['http://localhost:43110', 'https://research.vetmock.com.evil.example', 'https://vetmock-research.vercel.app']) assert.equal(gisUsable(origin), false, origin);
  const calls = { initialize: [], renderButton: [], prompt: 0, cancel: 0 };
  globalThis.window = { google: { accounts: { id: {
    initialize: (o) => calls.initialize.push(o), renderButton: (_el, o) => calls.renderButton.push(o),
    prompt: () => { calls.prompt += 1; }, cancel: () => { calls.cancel += 1; },
  } } } };
  const el = { clientWidth: 330, replaceChildren() { this.cleared = true; } };
  const got = [];
  const undo = await renderGoogleButton(el, { hd: 'chula.ac.th', theme: 'filled_black', locale: 'en', prompt: true, onCredential: (t, n) => got.push([t, n]) });
  assert.equal(calls.initialize[0].hd, 'chula.ac.th');
  assert.deepEqual({ ...calls.renderButton[0] }, { type: 'standard', theme: 'filled_black', size: 'large', shape: 'rectangular', text: 'signin_with', logo_alignment: 'left', locale: 'en', width: 330 });
  assert.equal(calls.prompt, 1);
  calls.initialize[0].callback({ credential: 'tok' });
  const { createHash } = await import('node:crypto');
  assert.equal(calls.initialize[0].nonce, createHash('sha256').update(got[0][1]).digest('hex'), 'Google sees the hash of the nonce the account gets');
  undo();
  assert.equal(el.cleared, true);
  assert.equal(calls.cancel, 1);
  delete globalThis.window;
});

test('the link screen links in place on this origin\'s session, then the page starts again', async () => {
  const calls = [];
  let reloaded = 0;
  const fresh = { stored: () => ({ access_token: 't', user: GMAIL }), session: async () => ({ session: { access_token: 't', user: GMAIL }, error: null }) };
  const { auth } = fakeAuth({ ...fresh, linkToken: async (token, nonce) => { calls.push([token, nonce]); return { user: GMAIL }; } });
  const { wall } = wallWith({ auth, answer: { enforce: true, member: false, uid: GMAIL.id }, reload: () => { reloaded += 1; } });
  await wall.start();
  assert.equal(wall.get().gate, 'link');
  const done = wall.linkWithGoogleToken('id-token', 'raw-nonce');
  assert.equal(wall.get().busy, 'link');
  await done;
  assert.deepEqual(calls, [['id-token', 'raw-nonce']]);
  assert.equal(reloaded, 1);
  const taken = fakeAuth({ ...fresh, linkToken: async () => { throw Object.assign(new Error('Identity is already linked to another user'), { code: 'identity_already_exists' }); } });
  const a = wallWith({ auth: taken.auth, answer: { enforce: true, member: false, uid: GMAIL.id } });
  await a.wall.start();
  await a.wall.linkWithGoogleToken('t', 'n');
  assert.equal(a.wall.get().problem, 'identity-taken');
  await a.wall.signOut();
  assert.equal(a.wall.get().gate, 'signin', '"use that Chula account instead" signs out here');
  const off = fakeAuth({ ...fresh, linkToken: async () => { throw Object.assign(new Error('Manual linking is disabled'), { code: 'manual_linking_disabled' }); } });
  const b = wallWith({ auth: off.auth, answer: { enforce: true, member: false, uid: GMAIL.id } });
  await b.wall.start();
  await b.wall.linkWithGoogleToken('t', 'n');
  assert.equal(b.wall.get().problem, 'linking-off');
  const hds = [];
  const redirect = fakeAuth({ ...fresh, linkRedirect: async (hd) => { hds.push(hd); } });
  const c = wallWith({ auth: redirect.auth, answer: { enforce: true, member: false, uid: GMAIL.id } });
  await c.wall.start();
  await c.wall.linkRedirect('chula.ac.th');
  assert.deepEqual(hds, ['chula.ac.th']);
  await new Promise((r) => setTimeout(r, 50));
});

test('a tab shown again asks again, at most once a minute', async () => {
  let clock = 9_000_000;
  const handlers = {};
  const doc = { visibilityState: 'visible', addEventListener: (name, fn) => { handlers[name] = fn; } };
  const { wall, seen } = wallWith({ auth: fakeAuth().auth, doc, now: () => clock, answer: { enforce: false, member: false, uid: null } });
  await wall.start();
  assert.equal(seen.length, 1);
  clock += 45_000;
  handlers.visibilitychange();
  assert.equal(seen.length, 1);
  clock += 20_000;
  handlers.visibilitychange();
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(seen.length, 2);
});

test('an empty slot is no button: the house button takes its place', async () => {
  const { buttonDrawn, DRAWN_MS } = await import('../../src/lib/auth/gis.js');
  const slot = (frame) => ({ querySelector: () => frame });
  assert.equal(DRAWN_MS, 4000);
  assert.equal(buttonDrawn(slot({ getBoundingClientRect: () => ({ width: 330, height: 40 }) })), true);
  assert.equal(buttonDrawn(slot({ getBoundingClientRect: () => ({ width: 0, height: 0 }) })), false);
  assert.equal(buttonDrawn(slot(null)), false);
});

test('a stored session restored on load (SIGNED_IN, same account) keeps the OAuth error read from the address', async () => {
  const live = { access_token: 't', user: GMAIL };
  const { auth, emit } = fakeAuth({ stored: () => live, session: async () => ({ session: live, error: null }) });
  const replaced = [];
  const { wall } = wallWith({
    auth,
    answer: { enforce: true, member: false, uid: GMAIL.id },
    location: { pathname: '/', search: '?error=invalid_request&error_code=identity_already_exists&error_description=Identity+is+already+linked+to+another+user', hash: '' },
    history: { state: null, replaceState: (_s, _t, url) => replaced.push(url) },
  });
  assert.equal(wall.get().problem, 'identity-taken');
  await wall.start();
  emit('SIGNED_IN', live); // what auth-js sends when it restores the stored session
  assert.equal(wall.get().gate, 'link');
  assert.equal(wall.get().problem, 'identity-taken', 'the way to that other account stays on screen');
  emit('SIGNED_IN', { access_token: 'n', user: MEMBER });
  assert.equal(wall.get().problem, null, 'another account clears it');
});
