// The Chula sign-in wall (online/wall.js, docs/CHULA-SIGNIN.md): the site never shows a page
// before it knows, a saved member session opens with no network, nobody is signed out because a
// check failed, and a sign-in that came back with an error is said on the wall's own card.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWall, problemText, PROBLEM_TEXT } from '../../src/online/wall.js';
import { wall as siteWall, storedSession } from '../../src/online/gate.js';

// A real Chula identity carries Google's hosted-domain claim; a Gmail one has none.
const hdOf = (email) => (/@(student.)?chula.ac.th$/i.test(email) ? { custom_claims: { hd: email.split('@')[1].toLowerCase() } } : {});
const google = (email, verified = true) => ({ provider: 'google', identity_data: { email, email_verified: verified, ...hdOf(email) } });
const MEMBER = { id: 'u-member', email: 'someone@gmail.com', identities: [google('someone@gmail.com'), google('6631234531@student.chula.ac.th')] };
const GMAIL = { id: 'u-gmail', email: 'someone@gmail.com', identities: [google('someone@gmail.com')] };

function memoryStore(seed = {}) {
  const map = new Map(Object.entries(seed));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k) };
}
const remember = (enforce, members = []) => ({ 'vmx-chula-wall': JSON.stringify({ enforce, members }) });

function fakeAuth(over = {}) {
  const listeners = [];
  const calls = { signIn: [], signOut: 0, onChange: 0 };
  const auth = {
    configured: true,
    url: 'https://x.supabase.co',
    key: 'anon',
    stored: () => null,
    returning: () => false,
    session: async () => ({ session: null, error: null, retryable: false }),
    onChange: async (cb) => { calls.onChange += 1; listeners.push(cb); return () => {}; },
    signIn: async (hd) => { calls.signIn.push(hd); },
    signOut: async () => { calls.signOut += 1; for (const cb of listeners) cb('SIGNED_OUT', null); },
    ...over,
  };
  return { auth, calls, emit: (event, session) => { for (const cb of listeners) cb(event, session); } };
}

function wallWith({ auth, store = memoryStore(), answer = { enforce: true, member: false, uid: null }, location, history }) {
  const seen = [];
  const fetchImpl = async (url, init) => {
    seen.push({ url, auth: init.headers.Authorization });
    if (answer === 'offline') throw new TypeError('Failed to fetch');
    return Response.json(typeof answer === 'function' ? answer(init.headers.Authorization) : answer);
  };
  const wall = createWall({
    auth, store, fetchImpl, online: () => true, events: null, safetyMs: 30,
    location: location || { pathname: '/practice', search: '', hash: '' },
    history: history || { state: null, replaceState() {} },
  });
  return { wall, seen, store };
}

test('a build with no backend (demo or off) has nothing to gate and loads nothing', async () => {
  assert.equal(siteWall.get().configured, false, 'node has no VITE_SUPABASE_URL: the site\'s wall is off');
  assert.equal(siteWall.get().gate, 'open');
  const { auth, calls } = fakeAuth({ configured: false });
  const { wall, seen } = wallWith({ auth });
  await wall.start();
  assert.equal(wall.get().gate, 'open');
  assert.equal(seen.length, 0);
  assert.equal(calls.onChange, 0);
});

test('never a page before the switch is known; a guest\'s visit never loads the account client', async () => {
  const { auth, calls } = fakeAuth();
  const { wall, seen } = wallWith({ auth });
  assert.equal(wall.get().gate, 'checking');
  await wall.start();
  assert.equal(wall.get().gate, 'signin');
  assert.equal(seen[0].auth, 'Bearer anon');
  assert.equal(calls.onChange, 0, 'no session on this device: Supabase stays unloaded');
});

test('the switch off opens the site; a remembered "on" shows the card at once; unreachable assumes on', async () => {
  const off = wallWith({ auth: fakeAuth().auth, answer: { enforce: false, member: false, uid: null } });
  await off.wall.start();
  assert.equal(off.wall.get().gate, 'open');
  const on = wallWith({ auth: fakeAuth().auth, store: memoryStore(remember(true)), answer: 'offline' });
  assert.equal(on.wall.get().gate, 'signin');
  await on.wall.start();
  assert.equal(on.wall.get().gate, 'signin');
  const first = wallWith({ auth: fakeAuth().auth, answer: 'offline' });
  await first.wall.start();
  assert.equal(first.wall.get().gate, 'signin', 'never knew: assume on');
  const known = wallWith({ auth: fakeAuth().auth, store: memoryStore(remember(false)), answer: 'offline' });
  await known.wall.start();
  assert.equal(known.wall.get().gate, 'open', 'last seen off: the practice site stays open offline');
});

test('a saved member session opens offline, and the check failing signs nobody out', async () => {
  const { auth, calls } = fakeAuth({
    stored: () => ({ access_token: 'old', user: MEMBER }),
    session: async () => ({ session: null, error: { name: 'AuthRetryableFetchError', status: 0 }, retryable: true }),
  });
  const { wall } = wallWith({ auth, store: memoryStore(remember(true)), answer: 'offline' });
  assert.equal(wall.get().gate, 'open');
  await wall.start();
  assert.equal(wall.get().gate, 'open');
  assert.equal(wall.get().user.id, MEMBER.id);
  assert.equal(calls.signOut, 0);
});

test('an account the server let in on this device before opens offline', async () => {
  const { auth } = fakeAuth({
    stored: () => ({ access_token: 'old', user: GMAIL }),
    session: async () => { throw new Error('chunk failed to load'); },
  });
  const { wall } = wallWith({ auth, store: memoryStore(remember(true, [GMAIL.id])), answer: 'offline' });
  await wall.start();
  assert.equal(wall.get().gate, 'open');
});

test('the server decides for a signed-in account, and an answer about someone else says nothing', async () => {
  const fresh = { session: async () => ({ session: { access_token: 'fresh', user: GMAIL }, error: null }), stored: () => ({ access_token: 't', user: GMAIL }) };
  const yes = wallWith({ auth: fakeAuth(fresh).auth, answer: (b) => ({ enforce: true, member: b === 'Bearer fresh', uid: GMAIL.id }) });
  assert.equal(yes.wall.get().gate, 'checking');
  await yes.wall.start();
  assert.equal(yes.wall.get().gate, 'open');
  const no = wallWith({ auth: fakeAuth(fresh).auth, answer: { enforce: true, member: false, uid: GMAIL.id } });
  await no.wall.start();
  assert.equal(no.wall.get().gate, 'link');
  const other = wallWith({ auth: fakeAuth(fresh).auth, answer: { enforce: true, member: true, uid: 'someone-else' } });
  await other.wall.start();
  assert.equal(other.wall.get().verdict, 'unknown');
  assert.equal(other.wall.get().gate, 'link');
});

test('"use another account" signs out here and asks again, with no problem line', async () => {
  const fresh = { session: async () => ({ session: { access_token: 't', user: GMAIL }, error: null }), stored: () => ({ access_token: 't', user: GMAIL }) };
  const { auth, calls } = fakeAuth(fresh);
  const { wall } = wallWith({ auth, answer: (b) => ({ enforce: true, member: false, uid: b === 'Bearer anon' ? null : GMAIL.id }) });
  await wall.start();
  assert.equal(wall.get().gate, 'link');
  await wall.signOut();
  assert.equal(calls.signOut, 1);
  assert.equal(wall.get().gate, 'signin');
  assert.equal(wall.get().problem, null);
});

test('a session that ended while away says so; one signed out elsewhere on the page says so too', async () => {
  const { auth, emit } = fakeAuth({ stored: () => ({ access_token: 'dead', user: GMAIL }), session: async () => ({ session: null, error: null }) });
  const { wall } = wallWith({ auth });
  await wall.start();
  assert.equal(wall.get().problem, 'expired');
  emit('SIGNED_IN', { access_token: 'n', user: MEMBER });
  assert.equal(wall.get().problem, null);
  assert.equal(wall.get().gate, 'open');
  emit('SIGNED_OUT', null);
  assert.equal(wall.get().gate, 'signin');
  assert.equal(wall.get().problem, 'expired', 'not asked for here: the refresh token was refused');
});

test('a sign-in finished on /auth/callback reaches the wall before the page comes back', async () => {
  const session = { access_token: 'cb', user: MEMBER };
  let stored = null;
  const { auth, calls } = fakeAuth({ stored: () => stored, session: async () => ({ session: stored, error: null }) });
  const { wall } = wallWith({ auth, store: memoryStore(remember(true)), answer: { enforce: true, member: true, uid: MEMBER.id } });
  await wall.start();
  assert.equal(wall.get().gate, 'signin');
  stored = session; // the callback page set the session
  await wall.resync();
  assert.equal(calls.onChange, 1, 'the wall subscribes once the client is loaded anyway');
  assert.equal(wall.get().user.id, MEMBER.id);
  assert.equal(wall.get().gate, 'open');
});

test('an error the callback page hands over is said on the card in plain words', () => {
  const { auth } = fakeAuth();
  const { wall } = wallWith({ auth, store: memoryStore(remember(true)) });
  wall.holdProblem('not-chula');
  assert.equal(wall.get().gate, 'signin');
  assert.equal(problemText(wall.get().problem), 'บัญชีนี้ไม่ใช่อีเมลจุฬา เลือกบัญชี @student.chula.ac.th หรือ @chula.ac.th แล้วลองใหม่');
  assert.equal(problemText('cancelled'), 'ยกเลิกการเข้าสู่ระบบแล้ว ลองใหม่ได้ทุกเมื่อ');
  assert.equal(problemText('offline'), 'ยังไม่ได้ต่ออินเทอร์เน็ต การเข้าสู่ระบบครั้งแรกต้องใช้เน็ต เครื่องที่เคยเข้าสู่ระบบแล้วใช้ต่อได้แบบออฟไลน์');
  assert.equal(problemText('expired'), 'เซสชันหมดอายุแล้ว เข้าสู่ระบบอีกครั้ง');
  assert.equal(problemText('unknown'), 'เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง');
  assert.equal(problemText('linking-off'), PROBLEM_TEXT.unknown);
  for (const text of Object.values(PROBLEM_TEXT)) assert.ok(!/[·•]/.test(text), 'no middle dot in UI copy');
});

test('an OAuth error in the address is read once and removed', () => {
  const replaced = [];
  const { auth } = fakeAuth();
  const { wall } = wallWith({
    auth,
    location: { pathname: '/exam', search: '?x=1', hash: '#error=access_denied&error_description=The+user+denied+the+request' },
    history: { state: null, replaceState: (_s, _t, url) => replaced.push(url) },
  });
  assert.deepEqual(replaced, ['/exam?x=1']);
  assert.equal(wall.get().problem, 'cancelled');
});

test('sign-in buttons: the student domain, the staff domain, one at a time, freed by the safety timer', async () => {
  const { auth, calls } = fakeAuth({ signIn: async (hd) => { calls.signIn.push(hd); return new Promise(() => {}); } });
  const { wall } = wallWith({ auth, store: memoryStore(remember(true)) });
  wall.signIn();
  wall.signIn('chula.ac.th');
  assert.deepEqual(calls.signIn, ['student.chula.ac.th']);
  assert.equal(wall.get().busy, 'student.chula.ac.th');
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(wall.get().busy, null, 'a stalled redirect never leaves the buttons disabled');
  wall.signIn('chula.ac.th');
  assert.deepEqual(calls.signIn, ['student.chula.ac.th', 'chula.ac.th']);
  await new Promise((r) => setTimeout(r, 50));
  const failing = wallWith({ auth: fakeAuth({ signIn: async () => { throw new Error('popup_closed'); } }).auth, store: memoryStore(remember(true)) });
  await failing.wall.signIn();
  assert.equal(failing.wall.get().problem, 'cancelled');
});

test('Google\'s button: the token becomes a session on this page and the wall opens for a member', async () => {
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
  assert.deepEqual(calls, [['id-token', 'raw-nonce'], 'subscribed']);
  assert.equal(wall.get().gate, 'open');
  const refused = wallWith({ auth: fakeAuth({ idToken: async () => { throw new Error('บัญชีนี้ไม่ใช่อีเมลจุฬา ใช้บัญชี Google ของ @student.chula.ac.th'); } }).auth, store: memoryStore(remember(true)) });
  await refused.wall.signInWithGoogleToken('t', 'n');
  assert.equal(refused.wall.get().problem, 'not-chula');
  assert.equal(refused.wall.get().busy, null);
});

test('Google\'s button on the wall: the Chula domain, One Tap, signin text; the sheet\'s call is unchanged', async () => {
  const { WALL_GOOGLE_CLIENT_ID, GOOGLE_ORIGINS } = await import('../../src/online/config.js');
  assert.equal(WALL_GOOGLE_CLIENT_ID, '807323754507-v4kctbouiqucot3e0isqju1mq1jl9k2u.apps.googleusercontent.com', 'no build id: the main app\'s public client');
  assert.deepEqual([...GOOGLE_ORIGINS], ['https://vca.vetmock.com'], 'previews and dev servers keep the redirect');
  const calls = { initialize: [], renderButton: [], prompt: 0, cancel: 0 };
  globalThis.window = { google: { accounts: { id: {
    initialize: (o) => calls.initialize.push(o), renderButton: (_el, o) => calls.renderButton.push(o),
    prompt: () => { calls.prompt += 1; }, cancel: () => { calls.cancel += 1; },
  } } } };
  const { renderGoogleButton } = await import('../../src/online/gis.js');
  const el = { replaceChildren() { this.cleared = true; } };
  const got = [];
  const undo = await renderGoogleButton(el, { clientId: 'cid', hd: 'student.chula.ac.th', prompt: true, text: 'signin_with', theme: 'outline', width: 640, onCredential: (t, n) => got.push([t, n]) });
  assert.equal(calls.initialize[0].hd, 'student.chula.ac.th');
  assert.equal(calls.renderButton[0].text, 'signin_with');
  assert.equal(calls.renderButton[0].width, 400);
  assert.equal(calls.renderButton[0].locale, 'th');
  assert.equal(calls.prompt, 1);
  calls.initialize[0].callback({ credential: 'tok' });
  const { createHash } = await import('node:crypto');
  assert.equal(calls.initialize[0].nonce, createHash('sha256').update(got[0][1]).digest('hex'));
  undo();
  assert.equal(calls.cancel, 1);
  assert.equal(el.cleared, true);
  await renderGoogleButton({ replaceChildren() {} }, { clientId: 'cid', theme: 'outline', width: 300, onCredential() {} });
  assert.equal('hd' in calls.initialize[1], false, 'the sign-in sheet passes no domain');
  assert.equal(calls.renderButton[1].text, 'continue_with');
  assert.equal(calls.prompt, 1, 'and no One Tap');
  delete globalThis.window;
});

test('the stored session is read from the client\'s own entry without loading it', () => {
  const entry = (v) => ({ getItem: (k) => (k === 'vmx-vca-auth' ? v : null) });
  assert.equal(storedSession(entry(JSON.stringify({ access_token: 'a', user: { id: 'u1' } }))).user.id, 'u1');
  assert.equal(storedSession(entry(JSON.stringify({ currentSession: { access_token: 'a', user: { id: 'u2' } } }))).user.id, 'u2');
  assert.equal(storedSession(entry('{not json')), null);
  assert.equal(storedSession(entry(null)), null);
  assert.equal(storedSession({ getItem() { throw new Error('denied'); } }), null);
});
