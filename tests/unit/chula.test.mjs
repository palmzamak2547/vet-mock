// The Chula sign-in rule on the client (src/lib/chula.js, docs/CHULA-SIGNIN.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import {
  CHULA_DOMAINS, isChulaEmail, hasChulaIdentity, chulaEmailOf, gateState, rememberedEnforce,
  rememberedMember, rememberAnswer, fetchAccessState, signInProblem, takeAuthErrorFromUrl,
} from '../../src/lib/chula.js';

const MIGRATION = new URL('../../supabase/migrations/20261101170000_chula_wall.sql', import.meta.url);
const sql = readFileSync(MIGRATION, 'utf8');

const google = (email, verified = true) => ({ provider: 'google', identity_data: { email, email_verified: verified } });
const member = { id: 'm', email: 'someone@gmail.com', identities: [google('someone@gmail.com'), google('6631234531@student.chula.ac.th')] };
const gmail = { id: 'g', email: 'someone@gmail.com', identities: [google('someone@gmail.com')] };

function memoryStore() {
  const map = new Map();
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k) };
}

test('the domain list is the one the database checks', () => {
  const inSql = sql.match(/lower\(split_part\(btrim\(email\), '@', 2\)\) in \(([^)]*)\)/)[1].match(/'([^']+)'/g).map((s) => s.slice(1, -1));
  assert.deepEqual([...inSql].sort(), [...CHULA_DOMAINS].sort());
  for (const domain of CHULA_DOMAINS) assert.ok(sql.includes(`'${domain}'`));
});

test('exact Chula domains only, the same table the SQL harness checks', () => {
  const cases = {
    '6631234531@student.chula.ac.th': true, 'A.B@Chula.ac.th': true, ' x@chula.ac.th ': true,
    'x@vet.chula.ac.th': false, 'x@chula.ac.th.evil.com': false, 'x@evilchula.ac.th': false, 'x@student.chula.ac.th.': false,
    'a@b@chula.ac.th': false, 'chula.ac.th': false, '': false, 'x@gmail.com': false,
  };
  for (const [email, expected] of Object.entries(cases)) assert.equal(isChulaEmail(email), expected, email);
  for (const notText of [null, undefined, 42, {}, ['x@chula.ac.th']]) assert.equal(isChulaEmail(notText), false);
});

test('membership is a verified Chula Google identity, never the account email', () => {
  assert.equal(hasChulaIdentity(member), true);
  assert.equal(hasChulaIdentity(gmail), false);
  assert.equal(hasChulaIdentity({ email: 'x@student.chula.ac.th', identities: [{ provider: 'email', identity_data: { email: 'x@student.chula.ac.th', email_verified: true } }] }), false);
  assert.equal(hasChulaIdentity({ identities: [google('x@student.chula.ac.th', false)] }), false);
  assert.equal(hasChulaIdentity({ identities: [google('x@student.chula.ac.th', 'true')] }), true);
  assert.equal(hasChulaIdentity({ identities: [google('x@vet.chula.ac.th')] }), false);
  assert.equal(hasChulaIdentity({ email: 'x@student.chula.ac.th' }), false);
  assert.equal(hasChulaIdentity(null), false);
  assert.equal(chulaEmailOf(member), '6631234531@student.chula.ac.th');
  assert.equal(chulaEmailOf(gmail), null);
});

test('the gate never shows the app before it knows, and opens a saved member offline', () => {
  const base = { configured: true, enforce: true, loading: false, user: null, verdict: 'pending', remembered: false };
  const s = (over) => gateState({ ...base, ...over });
  assert.equal(s({ configured: false }), 'open', 'a build with no database has no accounts to gate');
  assert.equal(s({ enforce: false }), 'open', 'the switch off restores the old app');
  assert.equal(s({ loading: true }), 'checking');
  assert.equal(s({ loading: true, user: member }), 'checking', 'no flash of the app while the session is read');
  assert.equal(s({}), 'signin');
  assert.equal(s({ enforce: 'pending' }), 'checking', 'the switch not known yet: neither app nor buttons');
  assert.equal(s({ user: member }), 'open', 'a member opens without waiting for the server');
  assert.equal(s({ user: member, verdict: 'unknown' }), 'open', 'offline, a member opens');
  assert.equal(s({ user: member, verdict: 'no' }), 'link', 'the server saying no wins over the device');
  assert.equal(s({ user: gmail }), 'checking', 'a non-member waits for the server (the admin passes there)');
  assert.equal(s({ user: gmail, verdict: 'yes' }), 'open');
  assert.equal(s({ user: gmail, verdict: 'no' }), 'link');
  assert.equal(s({ user: gmail, verdict: 'unknown' }), 'link');
  assert.equal(s({ user: gmail, verdict: 'unknown', remembered: true }), 'open', 'offline, an account the server let in before opens');
});

test('the device remembers the switch and the accounts the server let in', () => {
  const store = memoryStore();
  assert.equal(rememberedEnforce(store), null);
  rememberAnswer({ enforce: true, uid: 'a', member: true }, store);
  assert.equal(rememberedEnforce(store), true);
  assert.equal(rememberedMember('a', store), true);
  assert.equal(rememberedMember('b', store), false);
  rememberAnswer({ enforce: false, uid: 'a', member: null }, store);
  assert.equal(rememberedEnforce(store), false);
  assert.equal(rememberedMember('a', store), true, 'an unknown answer keeps what was known');
  rememberAnswer({ enforce: true, uid: 'a', member: false }, store);
  assert.equal(rememberedMember('a', store), false, 'a no forgets the account');
  store.setItem('vmx-chula-wall', '{not json');
  assert.equal(rememberedEnforce(store), null);
  assert.equal(rememberedMember('a', store), false);
  const broken = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  assert.doesNotThrow(() => rememberAnswer({ enforce: true, uid: 'a', member: true }, broken));
  assert.equal(rememberedMember('a', broken), false);
  for (let i = 0; i < 20; i++) rememberAnswer({ enforce: true, uid: `u${i}`, member: true }, store);
  assert.equal(JSON.parse(store.getItem('vmx-chula-wall')).members.length, 8, 'the list stays small');
});

test('the switch is asked with the session, and learned without it when the token is refused', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push(init.headers.Authorization);
    if (init.headers.Authorization === 'Bearer expired') return new Response('{}', { status: 401 });
    return Response.json({ enforce: true, member: init.headers.Authorization === 'Bearer good', signed_in: true, uid: 'u1' });
  };
  assert.deepEqual(await fetchAccessState({ url: 'https://x.supabase.co', key: 'anon', token: 'good', fetchImpl }), { enforce: true, member: true, uid: 'u1' });
  assert.deepEqual(await fetchAccessState({ url: 'https://x.supabase.co', key: 'anon', token: 'expired', fetchImpl }), { enforce: true, member: null, uid: 'u1' });
  assert.deepEqual(calls, ['Bearer good', 'Bearer expired', 'Bearer anon']);
  await assert.rejects(fetchAccessState({ url: 'u', key: 'k', fetchImpl: async () => new Response('x', { status: 503 }) }), /503/);
  await assert.rejects(fetchAccessState({ url: 'u', key: 'k', fetchImpl: async () => Response.json([]) }), /shape/);
});

test('every way a sign-in fails has its own plain answer', () => {
  assert.equal(signInProblem({ message: 'บัญชีนี้ไม่ใช่อีเมลจุฬา ใช้บัญชี Google ของ @student.chula.ac.th หรือ @chula.ac.th' }), 'not-chula');
  assert.equal(signInProblem({ error: 'server_error', error_description: 'Database error saving new user' }), 'not-chula');
  assert.equal(signInProblem({ code: 'identity_already_exists', message: 'Identity is already linked to another user' }), 'identity-taken');
  assert.equal(signInProblem({ code: 'manual_linking_disabled', message: 'Manual linking is disabled' }), 'linking-off');
  assert.equal(signInProblem({ error: 'access_denied', error_description: 'The user denied the request' }), 'cancelled');
  assert.equal(signInProblem(new Error('GIS_POPUP_CLOSED')), 'cancelled');
  assert.equal(signInProblem(new TypeError('Failed to fetch')), 'offline');
  assert.equal(signInProblem(new Error('anything'), { online: false }), 'offline');
  assert.equal(signInProblem({ message: 'Invalid Refresh Token: Refresh Token Not Found' }), 'expired');
  assert.equal(signInProblem(new Error('something new')), 'unknown');
  assert.equal(signInProblem(null), null);
});

test('an OAuth error is read from the address once and removed from it', () => {
  const replaced = [];
  const history = { state: { v: 1 }, replaceState: (_s, _t, url) => replaced.push(url) };
  const found = takeAuthErrorFromUrl({ pathname: '/app/home', search: '?x=1&error=access_denied&error_description=User+cancelled', hash: '' }, history);
  assert.deepEqual(found, { error: 'access_denied', error_code: '', error_description: 'User cancelled' });
  assert.deepEqual(replaced, ['/app/home?x=1']);
  const fromHash = takeAuthErrorFromUrl({ pathname: '/', search: '', hash: '#error=server_error&error_code=unexpected_failure&error_description=Database+error+saving+new+user' }, history);
  assert.equal(fromHash.error_code, 'unexpected_failure');
  assert.equal(replaced.at(-1), '/');
  assert.equal(takeAuthErrorFromUrl({ pathname: '/', search: '?code=abc', hash: '' }, history), null);
});

test('a table added after the wall carries the members-only policy', () => {
  const dir = new URL('../../supabase/migrations/', import.meta.url);
  const later = readdirSync(dir).filter((f) => f.endsWith('.sql') && f > '20261101170000_chula_wall.sql');
  for (const file of later) {
    const text = readFileSync(new URL(file, dir), 'utf8');
    const tables = [...text.matchAll(/create table (?:if not exists )?(public|vca)\.(\w+)/gi)].map((m) => `${m[1]}.${m[2]}`);
    for (const table of tables) {
      assert.match(text, new RegExp(`"chula members only" on ${table.replace('.', '\\.')}`), `${file} creates ${table} without the "chula members only" policy (docs/CHULA-SIGNIN.md)`);
    }
  }
});
