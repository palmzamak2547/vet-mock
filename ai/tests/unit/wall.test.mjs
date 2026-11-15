// The Chula sign-in wall (lib/wall.js, docs/CHULA-SIGNIN.md): what the page shows
// before it knows, that a saved member session opens with no network, that nobody
// is signed out because a check failed, and how the AI requests carry the session
// (lib/api.js): the bearer token, one refresh and retry after a 401, a 403 that
// moves the wall to the link screen.
import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.location = { hostname: 'localhost', search: '', origin: 'http://localhost' };
const { createWall, problemText, PROBLEM_TEXT, TRIAL_NOTE } = await import('../../src/lib/wall.js');
const { chat, transcribe, setApiAuth } = await import('../../src/lib/api.js');

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
    refresh: async () => null,
    ...over,
  };
  return { auth, calls, emit: (event, session) => { for (const cb of listeners) cb(event, session); } };
}

/** The access-state RPC: a function of the bearer token, or a rejection (no network). */
function server(answer) {
  const seen = [];
  const fetchImpl = async (url, init) => {
    seen.push({ url, auth: init.headers.Authorization });
    if (answer === 'offline') throw new TypeError('Failed to fetch');
    const body = typeof answer === 'function' ? answer(init.headers.Authorization) : answer;
    if (body?.status) return new Response('{}', { status: body.status });
    return Response.json(body);
  };
  return { fetchImpl, seen };
}

const place = () => {
  const replaced = [];
  return { replaced, location: { pathname: '/', search: '', hash: '' }, history: { state: null, replaceState: (_s, _t, url) => replaced.push(url) } };
};

function wallWith({ auth, store = memoryStore(), answer = { enforce: true, member: false, uid: null }, location, history, safetyMs = 30, doc = null, now, reload } = {}) {
  const { fetchImpl, seen } = server(answer);
  const p = place();
  const wall = createWall({ auth, store, fetchImpl, online: () => true, location: location || p.location, history: history || p.history, events: null, doc, safetyMs, ...(now ? { now } : {}), ...(reload ? { reload } : {}) });
  return { wall, seen, store, replaced: p.replaced };
}

test('a build with no database has nothing to gate and asks nothing', async () => {
  const { auth } = fakeAuth({ configured: false });
  const { wall, seen } = wallWith({ auth });
  assert.equal(wall.get().gate, 'open');
  await wall.start();
  assert.equal(wall.get().gate, 'open');
  assert.equal(seen.length, 0);
});

test('never the assistant before the switch is known: checking, then the sign-in card', async () => {
  const { auth } = fakeAuth();
  const { wall, seen, store } = wallWith({ auth, answer: { enforce: true, member: false, uid: null } });
  assert.equal(wall.get().gate, 'checking', 'first visit, switch unknown: neither app nor buttons');
  await wall.start();
  assert.equal(wall.get().gate, 'signin');
  assert.equal(seen[0].url, 'https://x.supabase.co/rest/v1/rpc/chula_access_state');
  assert.equal(seen[0].auth, 'Bearer anon', 'a guest asks with the anon key');
  assert.equal(JSON.parse(store.getItem('vmx-chula-wall')).enforce, true, 'the switch is remembered');
});

test('the switch off opens the old app, and a remembered "on" shows the card at once', async () => {
  const off = wallWith({ auth: fakeAuth().auth, answer: { enforce: false, member: false, uid: null } });
  await off.wall.start();
  assert.equal(off.wall.get().gate, 'open');

  const on = wallWith({ auth: fakeAuth().auth, store: memoryStore(remember(true)), answer: { enforce: false, member: false, uid: null } });
  assert.equal(on.wall.get().gate, 'signin', 'the device remembers the wall was on: no flash of the app');
  await on.wall.start();
  assert.equal(on.wall.get().gate, 'open', 'the server says it is off now');
});

test('unreachable on a first visit assumes the wall on; a remembered answer stands', async () => {
  const first = wallWith({ auth: fakeAuth().auth, answer: 'offline' });
  await first.wall.start();
  assert.equal(first.wall.get().gate, 'signin');

  const known = wallWith({ auth: fakeAuth().auth, store: memoryStore(remember(false)), answer: 'offline' });
  await known.wall.start();
  assert.equal(known.wall.get().gate, 'open', 'last seen off, and nothing new learned');
});

test('a saved member session opens offline, and nobody is signed out when the check fails', async () => {
  const { auth, calls } = fakeAuth({
    stored: () => ({ access_token: 'old', user: MEMBER }),
    // the refresh could not reach the server: auth-js keeps the session and says why
    session: async () => ({ session: null, error: { name: 'AuthRetryableFetchError', status: 0 }, retryable: true }),
  });
  const { wall } = wallWith({ auth, store: memoryStore(remember(true)), answer: 'offline' });
  assert.equal(wall.get().gate, 'open', 'opens from the device before any network');
  await wall.start();
  assert.equal(wall.get().gate, 'open');
  assert.equal(wall.get().user?.id, MEMBER.id, 'the account stays');
  assert.equal(calls.signOut, 0);
});

test('an account the server let in before opens offline even without a Chula identity on the device', async () => {
  const { auth } = fakeAuth({
    stored: () => ({ access_token: 'old', user: GMAIL }),
    session: async () => ({ session: null, error: { name: 'AuthRetryableFetchError', status: 0 }, retryable: true }),
  });
  const { wall } = wallWith({ auth, store: memoryStore(remember(true, [GMAIL.id])), answer: 'offline' });
  await wall.start();
  assert.equal(wall.get().gate, 'open');
  const stranger = wallWith({ auth, store: memoryStore(remember(true)), answer: 'offline' });
  await stranger.wall.start();
  assert.equal(stranger.wall.get().gate, 'link', 'not remembered, not a Chula identity, server unreachable');
});

test('the server decides for a signed-in account: yes opens, no shows the link screen', async () => {
  const yes = fakeAuth({ stored: () => ({ access_token: 't', user: GMAIL }), session: async () => ({ session: { access_token: 'fresh', user: GMAIL }, error: null }) });
  const a = wallWith({ auth: yes.auth, answer: (bearer) => ({ enforce: true, member: bearer === 'Bearer fresh', uid: GMAIL.id }) });
  assert.equal(a.wall.get().gate, 'checking', 'a non-member waits for the server (the admin passes there)');
  await a.wall.start();
  assert.equal(a.wall.get().gate, 'open');
  assert.equal(a.seen[0].auth, 'Bearer fresh', 'asked with the session the client handed back');
  assert.deepEqual(JSON.parse(a.store.getItem('vmx-chula-wall')).members, [GMAIL.id]);

  const no = fakeAuth({ stored: () => ({ access_token: 't', user: MEMBER }), session: async () => ({ session: { access_token: 't', user: MEMBER }, error: null }) });
  const b = wallWith({ auth: no.auth, store: memoryStore(remember(true, [MEMBER.id])), answer: { enforce: true, member: false, uid: MEMBER.id } });
  await b.wall.start();
  assert.equal(b.wall.get().gate, 'link', 'the server saying no wins over the device');
  assert.deepEqual(JSON.parse(b.store.getItem('vmx-chula-wall')).members, [], 'a no forgets the account');
});

test('an answer about another account says nothing about this one', async () => {
  const { auth } = fakeAuth({ stored: () => ({ access_token: 't', user: GMAIL }), session: async () => ({ session: { access_token: 't', user: GMAIL }, error: null }) });
  const { wall } = wallWith({ auth, answer: { enforce: true, member: true, uid: 'someone-else' } });
  await wall.start();
  assert.equal(wall.get().verdict, 'unknown');
  assert.equal(wall.get().gate, 'link');
});

test('"use another account" signs out here and returns to the sign-in card without a problem line', async () => {
  const { auth, calls } = fakeAuth({ stored: () => ({ access_token: 't', user: GMAIL }), session: async () => ({ session: { access_token: 't', user: GMAIL }, error: null }) });
  const { wall } = wallWith({ auth, answer: (bearer) => ({ enforce: true, member: false, uid: bearer === 'Bearer anon' ? null : GMAIL.id }) });
  await wall.start();
  assert.equal(wall.get().gate, 'link');
  await wall.signOut();
  assert.equal(calls.signOut, 1);
  assert.equal(wall.get().gate, 'signin');
  assert.equal(wall.get().problem, null);
});

test('a session that expired while away asks for a sign-in and says why', async () => {
  const { auth } = fakeAuth({ stored: () => ({ access_token: 'dead', user: GMAIL }), session: async () => ({ session: null, error: null }) });
  const { wall } = wallWith({ auth, answer: { enforce: true, member: false, uid: null } });
  await wall.start();
  assert.equal(wall.get().gate, 'signin');
  assert.equal(wall.get().problem, 'expired');
  assert.equal(problemText('expired'), 'เซสชันหมดอายุแล้ว เข้าสู่ระบบอีกครั้ง');
});

test('an OAuth error is read from the address once, removed, and said in plain words', async () => {
  const replaced = [];
  const { auth } = fakeAuth();
  const { wall } = wallWith({
    auth,
    location: { pathname: '/', search: '?error=server_error&error_code=unexpected_failure&error_description=Database+error+saving+new+user', hash: '' },
    history: { state: null, replaceState: (_s, _t, url) => replaced.push(url) },
  });
  assert.deepEqual(replaced, ['/']);
  assert.equal(wall.get().problem, 'not-chula');
  assert.equal(problemText(wall.get().problem), PROBLEM_TEXT['not-chula']);
  assert.equal(problemText('identity-taken'), 'บัญชีจุฬานี้มีบัญชี VetMock ของตัวเองอยู่แล้ว เข้าบัญชีจุฬานั้นแทนได้เลย ความคืบหน้าในบัญชีนี้ยังอยู่');
  assert.equal(problemText('linking-off'), 'ตอนนี้ยังเชื่อมบัญชีไม่ได้ ลองใหม่อีกครั้ง');
  assert.equal(problemText('something-new'), PROBLEM_TEXT.unknown);
  assert.equal(problemText(null), '');
});

test('a landing sign-in (?code=) is "checking" until the client settles', async () => {
  let settle;
  const { auth } = fakeAuth({ returning: () => true, session: () => new Promise((r) => { settle = r; }) });
  const { wall } = wallWith({ auth, answer: { enforce: true, member: true, uid: MEMBER.id } });
  assert.equal(wall.get().gate, 'checking');
  const started = wall.start();
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(wall.get().gate, 'checking', 'no sign-in card flashes while the code is exchanged');
  settle({ session: { access_token: 'new', user: MEMBER }, error: null });
  await started;
  assert.equal(wall.get().gate, 'open');
});

test('a sign-in starts Google with the student domain, the staff link with chula.ac.th', async () => {
  const { auth, calls } = fakeAuth();
  const { wall } = wallWith({ auth, store: memoryStore(remember(true)) });
  await wall.signIn();
  await wall.signIn('chula.ac.th');
  assert.deepEqual(calls.signIn, ['student.chula.ac.th'], 'one sign-in at a time while the page leaves');
  assert.equal(wall.get().busy, 'student.chula.ac.th');
  await new Promise((r) => setTimeout(r, 50));
  await wall.signIn('chula.ac.th');
  assert.deepEqual(calls.signIn, ['student.chula.ac.th', 'chula.ac.th']);
});

test('a sign-in that stalls frees the buttons after the safety timeout', async () => {
  const { auth } = fakeAuth({ signIn: () => new Promise(() => {}) });
  const { wall } = wallWith({ auth, store: memoryStore(remember(true)), safetyMs: 20 });
  wall.signIn();
  assert.equal(wall.get().busy, 'student.chula.ac.th');
  await new Promise((r) => setTimeout(r, 40));
  assert.equal(wall.get().busy, null);
});

test('a sign-in that fails says which problem it was', async () => {
  const { auth } = fakeAuth({ signIn: async () => { throw new TypeError('Failed to fetch'); } });
  const { wall } = wallWith({ auth, store: memoryStore(remember(true)) });
  await wall.signIn();
  assert.equal(wall.get().busy, null);
  assert.equal(wall.get().problem, 'offline');
});

test('the API refusing the account moves the wall: 403 to the link screen, 401 to the sign-in card', async () => {
  const member = fakeAuth({ stored: () => ({ access_token: 't', user: MEMBER }), session: async () => ({ session: { access_token: 't', user: MEMBER }, error: null }) });
  const a = wallWith({ auth: member.auth, store: memoryStore(remember(false)), answer: 'offline' });
  await a.wall.start();
  assert.equal(a.wall.get().gate, 'open');
  a.wall.apiAuth.refused('signin');
  assert.equal(a.wall.get().gate, 'signin', 'even a Chula identity: the server refused its token');
  assert.equal(a.wall.get().problem, 'expired');
  member.emit('SIGNED_IN', { access_token: 'n', user: MEMBER });
  assert.equal(a.wall.get().gate, 'open', 'a sign-in clears it');

  const gmail = fakeAuth({ stored: () => ({ access_token: 't', user: GMAIL }), session: async () => ({ session: { access_token: 't', user: GMAIL }, error: null }) });
  const b = wallWith({ auth: gmail.auth, store: memoryStore(remember(false, [GMAIL.id])), answer: 'offline' });
  await b.wall.start();
  b.wall.apiAuth.refused('link');
  assert.equal(b.wall.get().gate, 'link');
  assert.equal(b.wall.get().remembered, false, 'the device forgets the account the server refused');
});

test('Google\'s button: the token becomes a session on this page, and the wall opens for a member', async () => {
  const calls = [];
  const { auth } = fakeAuth({
    idToken: async (token, nonce) => { calls.push([token, nonce]); return { access_token: 'from-google', user: MEMBER }; },
    onChange: async () => { calls.push('subscribed'); return () => {}; },
  });
  const { wall, seen } = wallWith({ auth, store: memoryStore(remember(true)), answer: (b) => ({ enforce: true, member: b === 'Bearer from-google', uid: MEMBER.id }) });
  await wall.start();
  assert.equal(wall.get().gate, 'signin');
  const done = wall.signInWithGoogleToken('id-token', 'raw-nonce');
  assert.equal(wall.get().busy, 'google', 'busy while the token is traded');
  await done;
  assert.deepEqual(calls, [['id-token', 'raw-nonce'], 'subscribed'], 'and from then on the wall hears the account');
  assert.equal(wall.get().busy, null);
  assert.equal(wall.get().gate, 'open');
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(seen.at(-1).auth, 'Bearer from-google', 'the new session is asked about at once');
});

test('Google\'s button: a refused account or a stalled exchange says so and frees the button', async () => {
  const refused = fakeAuth({ idToken: async () => { throw Object.assign(new Error('Database error saving new user'), { status: 500 }); } });
  const a = wallWith({ auth: refused.auth, store: memoryStore(remember(true)) });
  await a.wall.signInWithGoogleToken('t', 'n');
  assert.equal(a.wall.get().problem, 'not-chula');
  assert.equal(a.wall.get().busy, null);
  assert.equal(a.wall.get().gate, 'signin');
  const stalled = fakeAuth({ idToken: () => new Promise(() => {}) });
  const b = wallWith({ auth: stalled.auth, store: memoryStore(remember(true)) });
  b.wall.signInWithGoogleToken('t', 'n');
  assert.equal(b.wall.get().busy, 'google');
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(b.wall.get().busy, null, 'the safety timeout');
});

test('the link screen links in place: Google\'s token joins this account, then the page starts again', async () => {
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
  assert.equal(reloaded, 1, 'the page starts again as the account it now is');
});

test('linking refused: an address with its own account, or linking switched off, each says so', async () => {
  const fresh = { stored: () => ({ access_token: 't', user: GMAIL }), session: async () => ({ session: { access_token: 't', user: GMAIL }, error: null }) };
  const taken = fakeAuth({ ...fresh, linkToken: async () => { throw Object.assign(new Error('Identity is already linked to another user'), { code: 'identity_already_exists', status: 422 }); } });
  const a = wallWith({ auth: taken.auth, answer: { enforce: true, member: false, uid: GMAIL.id }, reload: () => { throw new Error('no reload on a refusal'); } });
  await a.wall.start();
  await a.wall.linkWithGoogleToken('t', 'n');
  assert.equal(a.wall.get().problem, 'identity-taken');
  assert.equal(a.wall.get().busy, null);
  assert.equal(a.wall.get().gate, 'link', 'still on the link screen, with the way to that other account');
  await a.wall.signOut();
  assert.equal(a.wall.get().gate, 'signin', '"use that Chula account instead" signs out here');
  const off = fakeAuth({ ...fresh, linkToken: async () => { throw Object.assign(new Error('Manual linking is disabled'), { code: 'manual_linking_disabled', status: 404 }); } });
  const b = wallWith({ auth: off.auth, answer: { enforce: true, member: false, uid: GMAIL.id } });
  await b.wall.start();
  await b.wall.linkWithGoogleToken('t', 'n');
  assert.equal(b.wall.get().problem, 'linking-off');
});

test('the link screen\'s fallback links through Google\'s redirect with the chosen domain', async () => {
  const hds = [];
  const fresh = { stored: () => ({ access_token: 't', user: GMAIL }), session: async () => ({ session: { access_token: 't', user: GMAIL }, error: null }) };
  const { auth } = fakeAuth({ ...fresh, linkRedirect: async (hd) => { hds.push(hd); } });
  const { wall } = wallWith({ auth, answer: { enforce: true, member: false, uid: GMAIL.id } });
  await wall.start();
  await wall.linkRedirect('chula.ac.th');
  assert.deepEqual(hds, ['chula.ac.th']);
  assert.equal(wall.get().busy, 'chula.ac.th', 'busy while the page leaves');
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(wall.get().busy, null, 'freed by the safety timeout if it never does');
});

test('a tab shown again asks again, at most once a minute', async () => {
  let clock = 1_000_000;
  const handlers = {};
  const doc = { visibilityState: 'visible', addEventListener: (name, fn) => { handlers[name] = fn; } };
  const { auth } = fakeAuth();
  const { wall, seen } = wallWith({ auth, doc, now: () => clock, answer: { enforce: false, member: false, uid: null } });
  await wall.start();
  assert.equal(seen.length, 1);
  clock += 30_000;
  handlers.visibilitychange();
  assert.equal(seen.length, 1, 'half a minute later: not yet');
  clock += 31_000;
  doc.visibilityState = 'hidden';
  handlers.visibilitychange();
  assert.equal(seen.length, 1, 'a tab being hidden asks nothing');
  doc.visibilityState = 'visible';
  handlers.visibilitychange();
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(seen.length, 2, 'shown again after a minute: asks, so an open tab sees the switch turned on');
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

// ── the requests ────────────────────────────────────────────
function streamOf(text) {
  return new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(text)); c.close(); } });
}
const DONE = 'event: delta\ndata: {"text":"ok"}\n\nevent: done\ndata: {"ms":1}\n\n';

function provider({ token = 'tok', refresh = async () => 'tok2' } = {}) {
  const refused = [];
  return { refused, auth: { token: async () => token, refresh, refused: (kind) => refused.push(kind) } };
}

test('every chat request carries the session as a bearer token', async () => {
  const p = provider();
  setApiAuth(p.auth);
  const seen = [];
  globalThis.fetch = async (url, init) => { seen.push(init.headers); return new Response(streamOf(DONE), { status: 200 }); };
  await chat({ messages: [{ role: 'user', content: 'x' }], on: () => {} });
  assert.equal(seen[0].Authorization, 'Bearer tok');
  assert.equal(seen[0]['Content-Type'], 'application/json', 'the other headers stay');
  assert.deepEqual(p.refused, []);
});

test('a 401 refreshes the session once and retries with the new token', async () => {
  const p = provider();
  setApiAuth(p.auth);
  const seen = [];
  globalThis.fetch = async (url, init) => {
    seen.push(init.headers.Authorization);
    return init.headers.Authorization === 'Bearer tok2'
      ? new Response(streamOf(DONE), { status: 200 })
      : Response.json({ error: 'signin_required', message: 'เข้าสู่ระบบด้วยอีเมลจุฬาก่อนใช้งาน' }, { status: 401 });
  };
  const got = [];
  await chat({ messages: [], on: (e) => got.push(e) });
  assert.deepEqual(seen, ['Bearer tok', 'Bearer tok2']);
  assert.deepEqual(got, ['delta', 'done']);
  assert.deepEqual(p.refused, []);
});

test('a 401 the refresh cannot fix shows the sign-in wall and the Thai refusal', async () => {
  const p = provider({ refresh: async () => null });
  setApiAuth(p.auth);
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; return Response.json({ error: 'signin_required', message: 'เข้าสู่ระบบด้วยอีเมลจุฬาก่อนใช้งาน' }, { status: 401 }); };
  await assert.rejects(chat({ messages: [], on: () => {} }), (e) => e.reason === 'signin_required' && e.status === 401 && e.message === 'เข้าสู่ระบบด้วยอีเมลจุฬาก่อนใช้งาน');
  assert.equal(calls, 1, 'no retry without a new token');
  assert.deepEqual(p.refused, ['signin']);
});

test('a 403 chula_required shows the link screen; another 403 does not', async () => {
  const p = provider();
  setApiAuth(p.auth);
  globalThis.fetch = async () => Response.json({ error: 'chula_required', message: 'บัญชีนี้ยังไม่ได้เชื่อมกับอีเมลจุฬา' }, { status: 403 });
  await assert.rejects(chat({ messages: [], on: () => {} }), (e) => e.reason === 'chula_required' && e.message === 'บัญชีนี้ยังไม่ได้เชื่อมกับอีเมลจุฬา');
  assert.deepEqual(p.refused, ['link']);
  globalThis.fetch = async () => Response.json({ error: 'origin', message: 'เว็บนี้ไม่ได้รับอนุญาตให้เรียกใช้ผู้ช่วย' }, { status: 403 });
  await assert.rejects(chat({ messages: [], on: () => {} }), (e) => e.reason === 'origin');
  assert.deepEqual(p.refused, ['link'], 'an origin refusal is not about the account');
});

test('a 503 from the check is a temporary error, not a refusal', async () => {
  const p = provider();
  setApiAuth(p.auth);
  globalThis.fetch = async () => Response.json({ error: 'backend-unavailable', message: 'ตรวจสิทธิ์ไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง' }, { status: 503 });
  await assert.rejects(chat({ messages: [], on: () => {} }), (e) => e.reason === 'backend-unavailable' && e.status === 503);
  assert.deepEqual(p.refused, []);
});

test('the microphone\'s transcription carries the token and handles a 401 the same way', async () => {
  globalThis.FileReader = class {
    readAsDataURL(blob) {
      blob.arrayBuffer().then((b) => { this.result = `data:audio/wav;base64,${Buffer.from(b).toString('base64')}`; this.onload(); });
    }
  };
  const p = provider();
  setApiAuth(p.auth);
  const seen = [];
  globalThis.fetch = async (url, init) => {
    seen.push([url, init.headers.Authorization]);
    return init.headers.Authorization === 'Bearer tok2' ? Response.json({ text: ' สวัสดี ' }) : Response.json({ error: 'signin_required' }, { status: 401 });
  };
  const text = await transcribe(new Blob([new Uint8Array(64)], { type: 'audio/wav' }));
  assert.equal(text, 'สวัสดี');
  assert.deepEqual(seen.map((s) => s[1]), ['Bearer tok', 'Bearer tok2']);
  assert.ok(seen.every((s) => s[0].endsWith('/api/ai-transcribe')));
});

test('with no wall (a build without a database) requests go out as before', async () => {
  setApiAuth(null);
  const seen = [];
  globalThis.fetch = async (url, init) => { seen.push(init.headers); return new Response(streamOf(DONE), { status: 200 }); };
  await chat({ messages: [], on: () => {} });
  assert.equal(seen[0].Authorization, undefined);
  const guest = provider({ token: null });
  setApiAuth(guest.auth);
  await chat({ messages: [], on: () => {} });
  assert.equal(seen[1].Authorization, undefined, 'a guest while the wall is off sends no header');
});

// ── a trial link (lib/pass.js; docs/CHULA-SIGNIN.md, "Trial links") ─────────
// Shaped like a code, and no pass anywhere: the server stubs decide what is good.
const CODE = 'unit-test-code_not-a-pass-0001';
const holding = (extra = {}) => memoryStore({ 'vmx-ai-pass': CODE, ...extra });
const trialLink = { pathname: '/', search: `?pass=${CODE}`, hash: '' };

test('a trial link opens the page for a device with no account, where the sign-in card would be', async () => {
  const replaced = [];
  const { wall, store } = wallWith({ auth: fakeAuth().auth, location: trialLink, history: { state: null, replaceState: (_s, _t, url) => replaced.push(url) } });
  assert.deepEqual(replaced, ['/'], 'the code leaves the address as the page starts');
  assert.equal(store.getItem('vmx-ai-pass'), CODE);
  assert.equal(wall.get().gate, 'checking', 'never the assistant before the switch is known');
  assert.equal(wall.get().trial, false);
  await wall.start();
  assert.equal(wall.get().gate, 'open');
  assert.equal(wall.get().trial, true);
  assert.equal(wall.apiAuth.pass(), CODE);
  assert.equal(await wall.apiAuth.token(), null);
  assert.ok(!JSON.stringify(wall.get()).includes(CODE), 'the state the page draws from never holds the code');
});

test('a later visit opens on the stored code at once; with the wall off it is an ordinary visit', async () => {
  const on = wallWith({ auth: fakeAuth().auth, store: holding(remember(true)) });
  assert.equal(on.wall.get().gate, 'open', 'the wall remembered on and a code held: no flash of the sign-in card');
  assert.equal(on.wall.get().trial, true);
  const off = wallWith({ auth: fakeAuth().auth, store: holding(), answer: { enforce: false, member: false, uid: null } });
  await off.wall.start();
  assert.equal(off.wall.get().gate, 'open');
  assert.equal(off.wall.get().trial, false, 'no wall, no trial: a guest like any other');
  assert.equal(off.wall.apiAuth.pass(), null, 'and the code is not sent');
  const none = wallWith({ auth: fakeAuth().auth, store: memoryStore(remember(true)) });
  assert.equal(none.wall.get().gate, 'signin', 'no code, no trial');
  assert.equal(none.wall.get().trial, false);
});

test('a member who opens a trial link stays a member: the code is kept and never sent', async () => {
  const live = { access_token: 't', user: MEMBER };
  const { auth } = fakeAuth({ stored: () => live, session: async () => ({ session: live, error: null }) });
  const { wall, store } = wallWith({ auth, location: trialLink, answer: { enforce: true, member: true, uid: MEMBER.id } });
  await wall.start();
  assert.equal(wall.get().gate, 'open');
  assert.equal(wall.get().trial, false);
  assert.equal(wall.apiAuth.pass(), null);
  assert.equal(await wall.apiAuth.token(), 't');
  assert.equal(store.getItem('vmx-ai-pass'), CODE, 'stored, unused while a session exists');

  const other = { access_token: 'g', user: GMAIL };
  const stranger = fakeAuth({ stored: () => other, session: async () => ({ session: other, error: null }) });
  const b = wallWith({ auth: stranger.auth, store: holding(), answer: { enforce: true, member: false, uid: GMAIL.id } });
  await b.wall.start();
  assert.equal(b.wall.get().gate, 'link', 'a signed-in account that is not a member is asked to link, as before');
  assert.equal(b.wall.apiAuth.pass(), null);
});

test('the server refusing the code ends the trial: the sign-in card with one line, the code forgotten', async () => {
  const { wall, store } = wallWith({ auth: fakeAuth().auth, store: holding(remember(true)) });
  await wall.start();
  assert.equal(wall.get().trial, true);
  wall.apiAuth.refused('pass');
  assert.equal(wall.get().gate, 'signin');
  assert.equal(wall.get().trial, false);
  assert.equal(wall.get().problem, 'trial-ended');
  assert.equal(problemText(wall.get().problem), 'ลิงก์ทดลองหมดอายุแล้ว เข้าสู่ระบบด้วยอีเมลจุฬาเพื่อใช้ต่อ');
  assert.equal(store.getItem('vmx-ai-pass'), null);
  assert.equal(wall.apiAuth.pass(), null);
});

test('an account leaving the device takes the code with it, so the sign-in card comes back', async () => {
  const live = { access_token: 't', user: MEMBER };
  const stays = fakeAuth({ stored: () => live, session: async () => ({ session: live, error: null }) });
  const a = wallWith({ auth: stays.auth, store: holding(remember(true, [MEMBER.id])), answer: (bearer) => ({ enforce: true, member: bearer === 'Bearer t', uid: bearer === 'Bearer t' ? MEMBER.id : null }) });
  await a.wall.start();
  await a.wall.signOut();
  assert.equal(a.wall.get().gate, 'signin', 'a sign-out lands on the sign-in card, not in a trial');
  assert.equal(a.store.getItem('vmx-ai-pass'), null);

  const gone = fakeAuth({ stored: () => live, session: async () => ({ session: null, error: null, retryable: false }) });
  const b = wallWith({ auth: gone.auth, store: holding(remember(true, [MEMBER.id])) });
  await b.wall.start();
  assert.equal(b.wall.get().gate, 'signin');
  assert.equal(b.wall.get().problem, 'expired', 'an ended session is told so, as before');
  assert.equal(b.store.getItem('vmx-ai-pass'), null);
});

const trialProvider = () => {
  const p = { refused: [], refreshed: 0 };
  p.auth = { token: async () => null, refresh: async () => { p.refreshed += 1; return null; }, refused: (kind) => p.refused.push(kind), pass: () => CODE };
  return p;
};

test('a trial visitor\'s request carries the code and no token; a session never carries the code', async () => {
  const p = trialProvider();
  setApiAuth(p.auth);
  const seen = [];
  globalThis.fetch = async (url, init) => { seen.push(init.headers); return new Response(streamOf(DONE), { status: 200 }); };
  await chat({ messages: [{ role: 'user', content: 'x' }], on: () => {} });
  assert.equal(seen[0]['X-VetMock-Pass'], CODE);
  assert.equal(seen[0].Authorization, undefined);
  assert.equal(seen[0]['Content-Type'], 'application/json', 'the other headers stay');
  setApiAuth({ ...p.auth, token: async () => 'tok' });
  await chat({ messages: [], on: () => {} });
  assert.equal(seen[1].Authorization, 'Bearer tok');
  assert.equal(seen[1]['X-VetMock-Pass'], undefined, 'a member is never sent as a trial visitor');
  assert.deepEqual(p.refused, []);
  assert.equal(p.refreshed, 0);
});

test('a refused code ends the trial with no refresh and no retry; a temporary error ends nothing', async () => {
  const p = trialProvider();
  setApiAuth(p.auth);
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; return Response.json({ error: 'pass_invalid', message: 'ลิงก์ทดลองนี้ใช้ไม่ได้แล้ว' }, { status: 401 }); };
  await assert.rejects(chat({ messages: [], on: () => {} }), (e) => e.reason === 'pass_invalid' && e.status === 401 && e.message === 'ลิงก์ทดลองนี้ใช้ไม่ได้แล้ว');
  assert.equal(calls, 1);
  assert.equal(p.refreshed, 0, 'there is no session to refresh');
  assert.deepEqual(p.refused, ['pass']);
  globalThis.fetch = async () => Response.json({ error: 'backend-unavailable', message: 'ตรวจสิทธิ์ไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง' }, { status: 503 });
  await assert.rejects(chat({ messages: [], on: () => {} }), (e) => e.reason === 'backend-unavailable' && e.status === 503);
  globalThis.fetch = async () => Response.json({ error: 'rate', message: 'ถามติดกันเร็วเกินไป รอสักครู่แล้วลองใหม่', retryAfter: 30 }, { status: 429 });
  await assert.rejects(chat({ messages: [], on: () => {} }), (e) => e.reason === 'rate' && e.retryAfter === 30);
  assert.deepEqual(p.refused, ['pass'], 'a temporary error or a rate limit keeps the trial');
});

test('the microphone sends the code the same way', async () => {
  const p = trialProvider();
  setApiAuth(p.auth);
  const seen = [];
  globalThis.fetch = async (url, init) => { seen.push([url, init.headers]); return Response.json({ text: ' สวัสดี ' }); };
  assert.equal(await transcribe(new Blob([new Uint8Array(64)], { type: 'audio/wav' })), 'สวัสดี');
  assert.ok(seen[0][0].endsWith('/api/ai-transcribe'));
  assert.equal(seen[0][1]['X-VetMock-Pass'], CODE);
  assert.equal(seen[0][1].Authorization, undefined);
});

test('a trial visitor sees the live call, and the note says what the link opens', async () => {
  assert.equal(TRIAL_NOTE, 'ลิงก์ทดลอง: ถามตอบและคุยด้วยเสียงได้ ไม่รวมคลังเอกสารของจุฬาฯ');
  const { readFile } = await import('node:fs/promises');
  const app = await readFile(new URL('../../src/App.jsx', import.meta.url), 'utf8');
  assert.match(app, /onVoice=\{startVoice\}/, 'the composer offers the call to everyone the page is open for');
  assert.match(app, /onVoiceHint=\{prefetchVoice\}/);
  assert.doesNotMatch(app, /trial \? undefined|!trial &&/, 'nothing hides the call from a trial visitor');
  assert.match(app, /className="voice-cta"/);
  assert.match(app, /gate\.problem === 'trial-ended'\) setVoiceOn\(false\)/, 'a refused link ends an open call');
  // every request a call makes (start, its tools, a photo) goes through the one helper that adds the code
  const voice = await readFile(new URL('../../src/lib/voice.js', import.meta.url), 'utf8');
  const posts = voice.match(/method: 'POST'/g) || [];
  const helped = voice.match(/authorized\((VOICE_URL|API_URL), \{\s*method: 'POST'/g) || [];
  assert.ok(posts.length >= 3, 'start, tools and photo');
  assert.equal(helped.length, posts.length, 'no POST of the call builds its own request');
});

test('a call\'s start request carries the code like any other', async () => {
  const p = trialProvider();
  setApiAuth(p.auth);
  const { authorized } = await import('../../src/lib/api.js');
  const seen = [];
  globalThis.fetch = async (url, init) => { seen.push(init.headers); return Response.json({ error: 'pass_invalid' }, { status: 401 }); };
  const res = await authorized('/api/ai-voice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"start"}' });
  assert.equal(res.status, 401);
  assert.equal(seen[0]['X-VetMock-Pass'], CODE);
  assert.equal(seen[0].Authorization, undefined);
  assert.deepEqual(p.refused, ['pass'], 'a refused code before a call ends the trial as a chat request does');
  setApiAuth(null);
});

test('the page and the route together: a refused code moves the page to the sign-in card', async () => {
  const { wall, store } = wallWith({ auth: fakeAuth().auth, store: holding(remember(true)) });
  await wall.start();
  setApiAuth(wall.apiAuth);
  const seen = [];
  globalThis.fetch = async (url, init) => {
    seen.push(init.headers);
    return Response.json({ error: 'pass_invalid', message: 'ลิงก์ทดลองนี้ใช้ไม่ได้แล้ว' }, { status: 401 });
  };
  await assert.rejects(chat({ messages: [], on: () => {} }), (e) => e.reason === 'pass_invalid');
  assert.equal(seen[0]['X-VetMock-Pass'], CODE);
  assert.equal(wall.get().gate, 'signin');
  assert.equal(wall.get().problem, 'trial-ended');
  assert.equal(store.getItem('vmx-ai-pass'), null);
  setApiAuth(null);
});
