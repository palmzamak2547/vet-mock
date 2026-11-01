// The Chula sign-in rule is copied into the three sub-apps, which are separate Vite builds that
// cannot import src/ (docs/CHULA-SIGNIN.md): ai/src/lib/chula.js, vca/src/online/chula.js and
// research/src/lib/auth/chula.js. This holds every copy to the answers of src/lib/chula.js on the
// same case tables: domains, identities, every gate state, error mapping, the device's memory, the
// OAuth error in the address and the state call. Change the rule in src/lib/chula.js and the copies
// together: they are copies, not subsets, so a new export there belongs in all three, and this file
// names the copy that drifted.
import test from 'node:test';
import { readFileSync as readSource } from 'node:fs';
import assert from 'node:assert/strict';
import * as main from '../../src/lib/chula.js';
import * as ai from '../../ai/src/lib/chula.js';
import * as vca from '../../vca/src/online/chula.js';
import * as research from '../../research/src/lib/auth/chula.js';

const COPIES = { ai, vca, research };

// A real Chula identity carries Google's hosted-domain claim; a Gmail one has none.
const hdOf = (email) => (/@(student.)?chula.ac.th$/i.test(email) ? { custom_claims: { hd: email.split('@')[1].toLowerCase() } } : {});
const google = (email, verified = true) => ({ provider: 'google', identity_data: { email, email_verified: verified, ...hdOf(email) } });
const USERS = {
  none: null,
  member: { id: 'm', email: 'someone@gmail.com', identities: [google('someone@gmail.com'), google('6631234531@student.chula.ac.th')] },
  staff: { id: 's', email: 'a.b@chula.ac.th', identities: [google('A.B@Chula.ac.th', 'true')] },
  gmail: { id: 'g', email: 'someone@gmail.com', identities: [google('someone@gmail.com')] },
  unverified: { id: 'u', email: 'x@student.chula.ac.th', identities: [google('x@student.chula.ac.th', false)] },
  emailOnly: { id: 'e', email: 'x@student.chula.ac.th', identities: [{ provider: 'email', identity_data: { email: 'x@student.chula.ac.th', email_verified: true } }] },
  subdomain: { id: 'v', email: 'x@vet.chula.ac.th', identities: [google('x@vet.chula.ac.th')] },
  noIdentities: { id: 'n', email: 'x@student.chula.ac.th' },
};

function memoryStore() {
  const map = new Map();
  return { map, getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k) };
}

test('every copy exports the whole rule, with the same constants', () => {
  for (const [name, copy] of Object.entries(COPIES)) {
    for (const key of Object.keys(main)) assert.ok(key in copy, `${name} lacks ${key}`);
    assert.deepEqual([...copy.CHULA_DOMAINS], [...main.CHULA_DOMAINS], `${name}: CHULA_DOMAINS`);
    assert.deepEqual({ ...copy.CHULA_HD }, { ...main.CHULA_HD }, `${name}: CHULA_HD`);
    assert.equal(copy.CHULA_REFUSAL_MARK, main.CHULA_REFUSAL_MARK, `${name}: CHULA_REFUSAL_MARK`);
  }
});

test('the same domains, exactly', () => {
  const emails = [
    '6631234531@student.chula.ac.th', 'A.B@Chula.ac.th', ' x@chula.ac.th ', 'x@STUDENT.CHULA.AC.TH',
    'x@vet.chula.ac.th', 'x@chula.ac.th.evil.com', 'x@evilchula.ac.th', 'x@student.chula.ac.th.',
    'a@b@chula.ac.th', 'chula.ac.th', '@chula.ac.th', '', 'x@gmail.com', '\tx@chula.ac.th',
    null, undefined, 42, {}, ['x@chula.ac.th'],
  ];
  for (const [name, copy] of Object.entries(COPIES)) {
    for (const email of emails) assert.equal(copy.isChulaEmail(email), main.isChulaEmail(email), `${name}: isChulaEmail(${JSON.stringify(email)})`);
  }
});

test('the same identities: a verified Chula Google identity, never the account email', () => {
  for (const [name, copy] of Object.entries(COPIES)) {
    for (const [label, user] of Object.entries(USERS)) {
      assert.equal(copy.hasChulaIdentity(user), main.hasChulaIdentity(user), `${name}: hasChulaIdentity(${label})`);
      assert.equal(copy.chulaEmailOf(user), main.chulaEmailOf(user), `${name}: chulaEmailOf(${label})`);
    }
  }
});

test('the same gate state for every combination the device can be in', () => {
  let cases = 0;
  for (const configured of [true, false]) {
    for (const enforce of [true, false, 'pending']) {
      for (const loading of [true, false]) {
        for (const [label, user] of Object.entries(USERS)) {
          for (const verdict of ['pending', 'yes', 'no', 'unknown', undefined]) {
            for (const remembered of [true, false, undefined]) {
              const input = { configured, enforce, loading, user, verdict, remembered };
              const expected = main.gateState(input);
              for (const [name, copy] of Object.entries(COPIES)) {
                assert.equal(copy.gateState(input), expected, `${name}: gateState(${JSON.stringify({ ...input, user: label })})`);
              }
              cases += 1;
            }
          }
        }
      }
    }
  }
  assert.equal(cases, 2 * 3 * 2 * Object.keys(USERS).length * 5 * 3);
});

test('the same plain-language problem for every way a sign-in fails', () => {
  const errors = [
    { message: 'บัญชีนี้ไม่ใช่อีเมลจุฬา ใช้บัญชี Google ของ @student.chula.ac.th หรือ @chula.ac.th' },
    { error: 'server_error', error_code: 'unexpected_failure', error_description: 'Database error saving new user' },
    { message: 'chula_member_required' },
    { code: 'identity_already_exists', message: 'Identity is already linked to another user' },
    { code: 'manual_linking_disabled', message: 'Manual linking is disabled' },
    { error: 'access_denied', error_description: 'The user denied the request' },
    new Error('GIS_POPUP_CLOSED'),
    { message: 'User cancelled the sign-in' },
    new TypeError('Failed to fetch'),
    new TypeError('NetworkError when attempting to fetch resource.'),
    new TypeError('Load failed'),
    { message: 'Invalid Refresh Token: Refresh Token Not Found' },
    { message: 'JWT expired' },
    new Error('something new'),
    { description: 'Session expired' },
    {},
    null,
  ];
  for (const [name, copy] of Object.entries(COPIES)) {
    for (const error of errors) {
      for (const online of [true, false]) {
        assert.equal(copy.signInProblem(error, { online }), main.signInProblem(error, { online }), `${name}: signInProblem(${JSON.stringify(error)}, online ${online})`);
      }
    }
    assert.equal(copy.signInProblem(new Error('x')), main.signInProblem(new Error('x')), `${name}: online by default`);
  }
});

test('the same memory of the switch and the accounts let in, step by step', () => {
  const steps = [
    { enforce: true, uid: 'a', member: true },
    { enforce: false, uid: 'a', member: null },
    { enforce: 'pending', uid: 'b', member: true },
    { enforce: true, uid: 'a', member: false },
    { enforce: true, uid: null, member: true },
    ...Array.from({ length: 12 }, (_, i) => ({ enforce: true, uid: `u${i}`, member: true })),
  ];
  const stores = { main: memoryStore(), ...Object.fromEntries(Object.keys(COPIES).map((n) => [n, memoryStore()])) };
  const read = (rule, store) => ({ enforce: rule.rememberedEnforce(store), a: rule.rememberedMember('a', store), b: rule.rememberedMember('b', store), u11: rule.rememberedMember('u11', store), none: rule.rememberedMember(null, store) });
  for (const [name, copy] of Object.entries(COPIES)) assert.deepEqual(read(copy, stores[name]), read(main, stores.main), `${name}: an empty device`);
  for (const step of steps) {
    main.rememberAnswer(step, stores.main);
    for (const [name, copy] of Object.entries(COPIES)) {
      copy.rememberAnswer(step, stores[name]);
      assert.equal(stores[name].map.get('vmx-chula-wall'), stores.main.map.get('vmx-chula-wall'), `${name}: stored after ${JSON.stringify(step)}`);
      assert.deepEqual(read(copy, stores[name]), read(main, stores.main), `${name}: read back after ${JSON.stringify(step)}`);
    }
  }
  const broken = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  for (const [name, copy] of Object.entries(COPIES)) {
    assert.doesNotThrow(() => copy.rememberAnswer({ enforce: true, uid: 'a', member: true }, broken), name);
    assert.equal(copy.rememberedMember('a', broken), false, name);
    const junk = memoryStore();
    junk.setItem('vmx-chula-wall', '{not json');
    assert.equal(copy.rememberedEnforce(junk), main.rememberedEnforce(junk), `${name}: unreadable memory`);
  }
});

test('the same OAuth error taken from the address, and the same address left behind', () => {
  const places = [
    { pathname: '/app/home', search: '?x=1&error=access_denied&error_description=User+cancelled', hash: '' },
    { pathname: '/', search: '', hash: '#error=server_error&error_code=unexpected_failure&error_description=Database+error+saving+new+user' },
    { pathname: '/auth/callback', search: '?keep=1', hash: '#error_description=Only+a+description&state=s' },
    { pathname: '/', search: '?code=abc', hash: '' },
    { pathname: '/app', search: '', hash: '' },
  ];
  for (const place of places) {
    const replaced = { main: [] };
    const history = (list) => ({ state: { v: 1 }, replaceState: (_s, _t, url) => list.push(url) });
    const peeked = main.readAuthErrorFromUrl(place);
    const expected = main.takeAuthErrorFromUrl(place, history(replaced.main));
    for (const [name, copy] of Object.entries(COPIES)) {
      replaced[name] = [];
      assert.deepEqual(copy.readAuthErrorFromUrl(place), peeked, `${name}: read ${place.search}${place.hash}`);
      assert.deepEqual(copy.takeAuthErrorFromUrl(place, history(replaced[name])), expected, `${name}: ${place.search}${place.hash}`);
      assert.deepEqual(replaced[name], replaced.main, `${name}: address after ${place.search}${place.hash}`);
    }
  }
  for (const [name, copy] of Object.entries(COPIES)) assert.equal(copy.takeAuthErrorFromUrl(null, null), null, `${name}: no address at all`);
});

test('the same state call: the session first, the anon key when the token is refused', async () => {
  const server = () => {
    const calls = [];
    const fetchImpl = async (url, init) => {
      calls.push([url, init.method, init.headers.apikey, init.headers.Authorization, init.body]);
      if (init.headers.Authorization === 'Bearer expired') return new Response('{}', { status: 401 });
      if (init.headers.Authorization === 'Bearer down') return new Response('x', { status: 503 });
      return Response.json({ enforce: true, member: init.headers.Authorization === 'Bearer good', signed_in: true, uid: 'u1' });
    };
    return { calls, fetchImpl };
  };
  const ask = async (rule, token) => {
    const s = server();
    let result;
    try { result = await rule.fetchAccessState({ url: 'https://x.supabase.co', key: 'anon', token, fetchImpl: s.fetchImpl }); } catch (error) { result = { threw: String(error.message) }; }
    return { result, calls: s.calls };
  };
  for (const token of ['good', 'expired', null, 'down']) {
    const expected = await ask(main, token);
    for (const [name, copy] of Object.entries(COPIES)) assert.deepEqual(await ask(copy, token), expected, `${name}: token ${token}`);
  }
  const shape = { url: 'u', key: 'k', fetchImpl: async () => Response.json([]) };
  for (const [name, copy] of Object.entries(COPIES)) await assert.rejects(copy.fetchAccessState(shape), /shape/, name);
});

test('the same answer when the database has no state function (404): no wall, never "assume on"', async () => {
  const missing = async () => new Response('{"message":"Could not find the function"}', { status: 404 });
  const answers = [];
  for (const token of [null, 'good']) {
    const expected = await main.fetchAccessState({ url: 'https://x.supabase.co', key: 'anon', token, fetchImpl: missing });
    answers.push(expected);
    for (const [name, copy] of Object.entries(COPIES)) {
      assert.deepEqual(await copy.fetchAccessState({ url: 'https://x.supabase.co', key: 'anon', token, fetchImpl: missing }), expected, `${name}: 404, token ${token}`);
    }
  }
  assert.deepEqual(answers[0], { enforce: false, member: null, uid: null }, 'the main rule reads a missing function as no wall');
});

test('each sub-app links the ID token it was handed, and signs out of the device even offline', () => {
  const read = (path) => readSource(new URL(path, import.meta.url), 'utf8');
  // Without `token`, auth-js would quietly switch to linking through a redirect.
  for (const [name, path] of [['ai', '../../ai/src/lib/auth.js'], ['vca', '../../vca/src/online/gate.js'], ['research', '../../research/src/lib/auth/wall.js']]) {
    assert.ok(read(path).includes("linkIdentity({ provider: 'google', token, nonce })"), `${name} links the ID token`);
  }
  for (const [name, path] of [['ai', '../../ai/src/lib/auth.js'], ['vca', '../../vca/src/online/live.js'], ['research', '../../research/src/lib/auth/client.js']]) {
    const src = read(path);
    assert.ok(src.includes("signOut({ scope: 'local' })"), `${name} signs out of this device only`);
    assert.ok(src.includes('._removeSession()'), `${name} ends the local session as auth-js does, telling every tab, when the server cannot be reached`);
    assert.ok(/removeItem\((AUTH_STORAGE_KEY|storageKey)\)/.test(src), `${name} still drops the token without that method`);
  }
});
