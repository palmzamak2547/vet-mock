// ============================================================
// student-identity.test.mjs — a student's public name and picture
// ============================================================
// The defects this release fixed, each held here:
//   1. One write path. The picture a student picked went to auth metadata
//      while every screen read profiles.avatar_emoji, so it showed nowhere.
//      saveIdentity writes profiles first (only username and avatar_emoji,
//      never the key) and mirrors to metadata after; every editor calls it.
//   2. Never the email's local part as a public name (for a Chula address it
//      is the student number): not prefilled in the editor, not in the header
//      while the profile loads, not proposed at signup.
//   3. The first-run step: once, on Home only, never over a set, skippable.
//   4. One year: the hub reads the app's year, and the cohort from it.
//   5. The board choice explained, and the board's own line for the student.
//   6. Every statement on the hub true: the level is said to be device-only.
// ============================================================

import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, findAll, textOf, settle } from '../helpers/fake-react.mjs';
import {
  checkPublicName, normalizePublicName, nameLength, isAutoName, cohortForYear, boardStanding,
  identityWriteError, PICTURES, SURFACES, NAME_MAX,
} from '../../src/lib/public-identity.js';
import { identityIntroDue, introSeen, markIntroSeen, introSeenKey } from '../../src/lib/identity-gate.js';
import { earnedBadges, nextBadge, COUNTED_BADGES, badgeMetrics } from '../../src/lib/badges.js';
import { daysTrack, weekTrack } from '../../src/lib/study-record.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

// ── Name rules ─────────────────────────────────────────────────────
test('a Thai name is a valid public name, and is stored normalised', () => {
  for (const name of ['ปิง', 'หมอปิง สัตวแพทย์', 'ping_vet', 'Ping 86', 'น้องหมี.vet']) {
    const r = checkPublicName(name);
    assert.equal(r.ok, true, `${name}: ${r.reason}`);
  }
  assert.equal(normalizePublicName('  ปิง ​  สัตวแพทย์‮ '), 'ปิง สัตวแพทย์', 'invisible and bidi characters go, spaces collapse');
  // What Postgres char_length counts: Thai marks are code points of their own.
  assert.equal(nameLength('น้ำ'), 3);
  assert.ok(NAME_MAX <= 30, 'the client limit sits inside profiles_username_length_check (2 to 30)');
});

test('a student number, an email or the email local part is never a public name', () => {
  const email = '6531234531@student.chula.ac.th';
  for (const name of ['6531234531', 'ping6531234531', '653 123 45', '๖๕๓๑๒๓๔๕', 'ping@chula.ac.th', 'ping.com', 'www.ping']) {
    assert.equal(checkPublicName(name, { email }).ok, false, name);
  }
  assert.equal(checkPublicName('ping.vet', { email: 'ping.vet@gmail.com' }).ok, false, 'the local part of the account email');
  assert.equal(checkPublicName('Ping 2026').ok, true, 'four digits in a row are a year, not an id');
});

test('reserved words, the database-made names and junk are refused', () => {
  for (const name of ['admin', 'Admin_Ping', 'v e t m o c k', 'ทีมงาน VetMock', 'แอดมินปิง', 'อาจารย์ปิง', 'staff1', 'mod',
    'user', 'user_2', 'user_a1b2c3', 'นิสิต', '___', '12', 'ab', 'x'.repeat(NAME_MAX + 1), 'ping<script>', 'ปิง😀']) {
    assert.equal(checkPublicName(name).ok, false, name);
  }
});

test('database refusals are said plainly in Thai', () => {
  assert.match(identityWriteError({ code: '23505', message: 'duplicate key value violates unique constraint "profiles_username_key"' }), /มีคนใช้แล้ว/);
  assert.match(identityWriteError({ code: '23514', message: 'violates check constraint "profiles_username_length_check"' }), /ตัวอักษร/);
  assert.match(identityWriteError({ code: '42501', message: 'new row violates row-level security policy' }), /สิทธิ์/);
  assert.match(identityWriteError(new TypeError('Failed to fetch')), /เชื่อมต่อ/);
});

test('auto-made names are recognised as not chosen', () => {
  for (const n of ['user', 'user_2', 'USER_99', 'user_0f3a9c', 'นิสิต', '', null, '6531234531']) assert.equal(isAutoName(n), true, String(n));
  assert.equal(isAutoName('modeled.member', 'modeled.member@gmail.com'), true, 'the email local part was never chosen');
  for (const n of ['ping', 'user_ping', 'SomchaiJaidee', 'ปิง']) assert.equal(isAutoName(n, 'x@y.z'), false, n);
});

// ── The write path ─────────────────────────────────────────────────
function saveIdentityRunner() {
  const source = read('src/lib/identity-write.js');
  const m = source.match(/export async function saveIdentity\((\{[^)]*\} = \{\})\) \{([\s\S]*?)\n\}/);
  assert.ok(m, 'saveIdentity exists in lib/identity-write.js');
  return new AsyncFunction(m[1], 'getSupabase', 'notifyAuthChanged', m[2]);
}

function fakeClient({ profileError = null, metaError = null } = {}) {
  const calls = [];
  const client = {
    rpc: async (name) => { calls.push(['rpc', name]); return { error: null }; },
    auth: {
      getSession: async () => ({ data: { session: { user: { id: 'u1' } } } }),
      updateUser: async (arg) => { calls.push(['updateUser', arg]); return { error: metaError }; },
    },
    from(table) {
      const q = { table, patch: null, eqs: [] };
      const chain = {
        update(patch) { q.patch = patch; return chain; },
        eq(col, val) { q.eqs.push([col, val]); return chain; },
        select() { return chain; },
        single: async () => {
          calls.push(['update', q]);
          return profileError ? { data: null, error: profileError } : { data: { id: 'u1', created_at: 'x', ...q.patch }, error: null };
        },
      };
      return chain;
    },
  };
  return { client, calls };
}

test('the write path: hiding writes metadata first, then the row; showing writes the row first', async () => {
  const run = saveIdentityRunner();
  const { client, calls } = fakeClient();
  let notified = 0;
  const out = await run({ username: 'ปิง', avatarEmoji: '🐶', showOnLeaderboard: false }, async () => client, () => notified++);
  // Hiding: the metadata the boards read goes first, then the row.
  assert.deepEqual(calls[0], ['updateUser', { data: { username: 'ปิง', avatar_emoji: '🐶', show_on_leaderboard: false, identity_intro_done: true } }]);
  assert.deepEqual(calls[1], ['rpc', 'ensure_profile'], 'a missing row is made first');
  assert.equal(calls[2][0], 'update');
  assert.equal(calls[2][1].table, 'profiles');
  assert.deepEqual(calls[2][1].patch, { username: 'ปิง', avatar_emoji: '🐶' }, 'only the two columns members may write, never the key');
  assert.deepEqual(calls[2][1].eqs, [['id', 'u1']]);
  assert.equal(out.profile.avatar_emoji, '🐶', 'the saved row comes back for every screen to show');
  assert.equal(out.metaSaved, true);
  assert.equal(notified, 1);
});

test('a refused profile write stops before metadata and carries the database code', async () => {
  const run = saveIdentityRunner();
  const { client, calls } = fakeClient({ profileError: { code: '23505', message: 'duplicate key' } });
  await assert.rejects(run({ username: 'taken', avatarEmoji: '🐱' }, async () => client, () => {}), (e) => e.code === '23505');
  assert.equal(calls.filter(([k]) => k === 'updateUser').length, 0, 'metadata never claims a name the row refused');
});

test('a failed metadata mirror is reported, not hidden', async () => {
  const run = saveIdentityRunner();
  const { client } = fakeClient({ metaError: { message: 'network' } });
  const out = await run({ avatarEmoji: '🐱', showOnLeaderboard: true }, async () => client, () => {});
  assert.equal(out.metaSaved, false);
  assert.equal(out.profile.avatar_emoji, '🐱');
});

test('no screen writes the picture to metadata alone any more', () => {
  for (const file of ['src/views/AccountSettingsView.jsx', 'src/views/ProfileView.jsx', 'src/components/IdentityEditor.jsx', 'src/components/IdentityStep.jsx']) {
    const s = read(file);
    assert.doesNotMatch(s, /updateProfileMetadata\(/, `${file} does not write profile fields to metadata alone`);
  }
  assert.match(read('src/components/IdentityEditor.jsx'), /saveIdentity\(/);
  assert.doesNotMatch(read('src/lib/supabase.js'), /export async function updateUsername/, 'the old name-only path is gone');
  assert.doesNotMatch(read('src/views/AccountSettingsView.jsx'), /รีเฟรชหน้า/, 'a save never asks for a refresh');
});

// ── Never the email local part ─────────────────────────────────────
test('the header shows a stand-in, never the email local part, while the profile loads', () => {
  const header = read('src/components/HeaderBar.jsx');
  assert.doesNotMatch(header, /email\??\.split\('@'\)/);
  assert.match(header, /username: 'นิสิต'/);
});

test('signup proposes no name from the email', () => {
  const auth = read('src/views/AuthView.jsx');
  assert.doesNotMatch(auth, /deriveUsernameFromEmail\(/);
});

// ── The account page, driven as React would ────────────────────────
let AccountView;
const acct = { calls: [] };
before(async () => {
  globalThis.__ident = acct;
  const mod = await loadModule('src/views/AccountSettingsView.jsx', {
    stubs: [
      { match: '(^|/)supabase\\.js$', contents: `
        const rec = (name) => async (...args) => { globalThis.__ident.calls.push([name, ...args]); return { profile: { id: 'u', username: args[0]?.username || 'user_2', avatar_emoji: args[0]?.avatarEmoji || '🐾', created_at: 'x' }, metaSaved: true }; };
        export const getSupabase = async () => null;
        export const updatePassword = rec('updatePassword');
        export const requestReauthOtp = rec('requestReauthOtp');
        export const registerPasskey = rec('registerPasskey');
        export const listPasskeys = async () => [];
        export const deletePasskey = rec('deletePasskey');
        export const isPasskeySupported = () => false;
        export const updateEmail = rec('updateEmail');
        export const signOut = rec('signOut');
        export const signOutAllDevices = rec('signOutAllDevices');
        export const deleteAccountData = rec('deleteAccountData');
        export const updateProfileMetadata = rec('updateProfileMetadata');
        export const updateUsername = rec('updateUsername');` },
      { match: '/lib/dialog\\.js$', contents: 'export const confirmDialog = async () => true; export const alertDialog = async () => {};' },
      { match: '/BackBar\\.jsx$', contents: 'export default function BackBar() { return null; }' },
    ],
  });
  AccountView = mod.default;
});

const CHULA_USER = {
  id: 'cccccccc-1111-2222-3333-444444444444',
  email: '6531234531@student.chula.ac.th',
  email_confirmed_at: '2026-10-01T00:00:00Z',
  user_metadata: { full_name: 'Somchai Jaidee', avatar_emoji: '🐶' },
};
const AUTO_PROFILE = { id: CHULA_USER.id, username: 'user_2', avatar_emoji: '🐾', created_at: '2026-01-01' };
const buttons = (tree) => findAll(tree, (n) => n.type === 'button');
const byId = (tree, id) => findAll(tree, (n) => n.props?.id === id)[0];

test('the account editor starts empty for an auto-made name and never offers the student number', async () => {
  acct.calls.length = 0;
  const inst = mount(AccountView, { user: CHULA_USER, profile: AUTO_PROFILE, goHome() {}, coreData: {} });
  assert.match(textOf(inst.tree), /ยังไม่ได้ตั้งชื่อ/, 'the auto name is said for what it is');
  assert.match(textOf(inst.tree), /user_2 ซึ่งระบบตั้งให้/);
  buttons(inst.tree).find((b) => /^แก้ไข/.test(textOf(b).trim())).props.onClick();
  inst.flush();
  const input = byId(inst.tree, 'vmx-account-username');
  assert.equal(input.props.value, '', 'nothing prefilled');
  assert.ok(!textOf(inst.tree).includes('6531234531') || /อีเมล/.test(textOf(inst.tree)), 'the student number is not proposed as a name');
  inst.unmount();
});

let Editor;
before(async () => {
  Editor = (await loadModule('src/components/IdentityEditor.jsx', {
    stubs: [{ match: '/lib/identity-write\\.js$', contents: `
      export const saveIdentity = async (arg) => { globalThis.__ident.calls.push(['saveIdentity', arg]); return { profile: { id: 'u', username: arg.username || 'user_2', avatar_emoji: arg.avatarEmoji || '🐾', created_at: 'x' }, metaSaved: true }; };
      export const isPublicNameFree = async (name) => { globalThis.__ident.calls.push(['isPublicNameFree', name]); return name !== 'taken_name'; };` }],
  })).default;
});

test('the picture picked in the editor goes through the one write path', async () => {
  acct.calls.length = 0;
  let saved = null;
  const inst = mount(Editor, { user: CHULA_USER, profile: AUTO_PROFILE, mode: 'edit', onSaved(row) { saved = row; } });
  const cat = findAll(inst.tree, (n) => n.type === 'input' && n.props.type === 'radio' && n.props.value === '🐱')[0];
  cat.props.onChange();
  inst.flush();
  assert.match(textOf(findAll(inst.tree, (n) => n.props?.className === 'vmx-id-preview')[0]), /🐱/, 'the preview row shows the new picture at once');
  await findAll(inst.tree, (n) => n.type === 'form')[0].props.onSubmit({ preventDefault() {} });
  await settle(inst);
  const call = acct.calls.find(([k]) => k === 'saveIdentity');
  assert.ok(call, 'saveIdentity was called');
  assert.equal(call[1].avatarEmoji, '🐱');
  assert.equal(call[1].username, undefined, 'an untouched auto name is kept, not resent');
  assert.equal(saved?.avatar_emoji, '🐱', 'the app hears the saved row at once');
  inst.unmount();
});

test('the editor refuses a student number before any request, and a taken name after asking', async (t) => {
  acct.calls.length = 0;
  const inst = mount(Editor, { user: CHULA_USER, profile: AUTO_PROFILE, mode: 'edit' });
  const input = () => findAll(inst.tree, (n) => n.type === 'input' && n.props.type === 'text')[0];
  input().props.onChange({ target: { value: '6531234531' } });
  input().props.onBlur();
  inst.flush();
  assert.equal(input().props['aria-invalid'], 'true');
  assert.match(textOf(inst.tree), /รหัสนิสิต/);
  await findAll(inst.tree, (n) => n.type === 'form')[0].props.onSubmit({ preventDefault() {} });
  assert.equal(acct.calls.filter(([k]) => k === 'saveIdentity').length, 0, 'nothing is sent');
  t.mock.timers.enable({ apis: ['setTimeout'] });
  input().props.onChange({ target: { value: 'taken_name' } });
  inst.flush();
  t.mock.timers.tick(500);
  t.mock.timers.reset();
  await settle(inst);
  assert.match(textOf(inst.tree), /มีคนใช้แล้ว/);
  inst.unmount();
});

test('the account page no longer asks for year, cohort or bio, and names what the download holds', () => {
  const s = read('src/views/AccountSettingsView.jsx');
  for (const id of ['vmx-account-year', 'vmx-account-cohort', 'vmx-account-bio', 'vmx-account-avatar']) assert.ok(!s.includes(id), id);
  const inst = mount(AccountView, { user: CHULA_USER, profile: AUTO_PROFILE, goHome() {}, coreData: {} });
  const t = textOf(inst.tree);
  for (const heading of ['ตัวตนที่เพื่อนเห็น', 'การเข้าสู่ระบบและความปลอดภัย', 'ข้อมูลของคุณ', 'ออกจากบัญชี']) assert.ok(t.includes(heading), heading);
  assert.match(t, /เลเวลและชั้นปีที่เลือกไว้ในเครื่องนี้/, 'the export says the level is in it');
  inst.unmount();
});

// ── The privacy choice, explained ──────────────────────────────────
test('every surface says whether the board choice hides the student there, comments honestly', () => {
  const comments = SURFACES.find((s) => s.id === 'comments');
  assert.equal(comments.followsChoice, false, 'comments read profiles directly and never the flag');
  assert.ok(SURFACES.find((s) => s.id === 'leaderboard').followsChoice);
  assert.ok(SURFACES.find((s) => s.id === 'online').followsChoice, 'presence honours it (useStudyBuddies)');
  assert.match(read('src/hooks/useStudyBuddies.js'), /show_on_leaderboard/);
  assert.doesNotMatch(read('src/lib/api.js').slice(read('src/lib/api.js').indexOf('export async function listQComments')), /^\s*\.eq\('show_on_leaderboard/m);
});

test('the board line: hidden, ranked or absent', () => {
  const me = { id: 'me', user_metadata: {} };
  assert.equal(boardStanding(null, []), null);
  assert.deepEqual(boardStanding({ id: 'me', user_metadata: { show_on_leaderboard: false } }, [{ user_id: 'me' }]), { kind: 'hidden' });
  assert.equal(boardStanding(me, null), null);
  assert.deepEqual(boardStanding(me, [{ user_id: 'a' }, { user_id: 'me' }]), { kind: 'ranked', rank: 2, of: 2 });
  assert.deepEqual(boardStanding(me, [{ user_id: 'a' }]), { kind: 'absent', of: 1, capped: false });
  assert.equal(boardStanding(me, Array.from({ length: 200 }, (_, i) => ({ user_id: `x${i}` }))).capped, true);
});

// ── The first-run step ─────────────────────────────────────────────
test('the first-run step shows once, on Home only, never over a set', () => {
  const user = { id: 'u1', email: '6531234531@student.chula.ac.th', user_metadata: { full_name: 'S J' } };
  const profile = { id: 'u1', username: 'user_2', avatar_emoji: '🐾', created_at: '2026-01-01' };
  const base = { user, profile, view: 'home' };
  assert.equal(identityIntroDue(base), true, 'an auto-made name on Home');
  for (const view of ['exam', 'results', 'review', 'topic-select', 'profile', 'sr-session', 'config']) {
    assert.equal(identityIntroDue({ ...base, view }), false, `never on ${view}`);
  }
  assert.equal(identityIntroDue({ ...base, pendingResume: true }), false, 'not while a set waits to be resumed');
  assert.equal(identityIntroDue({ ...base, welcome: true }), false, 'not over the wall\'s welcome');
  assert.equal(identityIntroDue({ ...base, seen: true }), false, 'not again on this device');
  assert.equal(identityIntroDue({ ...base, user: { ...user, user_metadata: { identity_intro_done: true } } }), false, 'not again on another device');
  assert.equal(identityIntroDue({ ...base, profile: { id: 'u1', username: 'นิสิต', avatar_emoji: '🐾' } }), false, 'not for the stand-in profile');
  assert.equal(identityIntroDue({ ...base, user: null }), false, 'not for a guest');
  const chose = { ...base, user: { ...user, user_metadata: { username: 'ping_vet' } }, profile: { ...profile, username: 'ping_vet' } };
  assert.equal(identityIntroDue(chose), false, 'not for a student who already chose a name');
  const fromEmail = { ...base, profile: { ...profile, username: '6531234531' }, user: { ...user, user_metadata: { username: '6531234531' } } };
  assert.equal(identityIntroDue(fromEmail), true, 'a stored student number is not a choice');
});

test('the device remembers the step per account', () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.equal(introSeen(storage, 'u1'), false);
  markIntroSeen(storage, 'u1');
  assert.equal(introSeen(storage, 'u1'), true);
  assert.equal(introSeen(storage, 'u2'), false);
  assert.equal(store.get(introSeenKey('u1')), '1');
  assert.equal(introSeen({ getItem() { throw new Error('blocked'); } }, 'u1'), false, 'a blocked storage reads as not seen');
});

test('App mounts the step only through the gate', () => {
  const app = read('src/App.jsx');
  const mount = app.slice(app.indexOf("user && view === 'home' && !pendingResume"), app.indexOf('<IdentityStep '));
  assert.ok(mount.length > 0 && mount.length < 400, 'App mounts the step only on Home with nothing in progress');
  for (const part of ['!wall.welcome', '!tourOpen', '!identityClosed', 'profile?.created_at', '!user.user_metadata?.identity_intro_done']) assert.ok(mount.includes(part), part);
  assert.doesNotMatch(app, /from '\.\/lib\/identity-gate/, 'the first load carries none of the gate');
  assert.match(read('src/components/IdentityStep.jsx'), /if \(!identityIntroDue\(\{ user, profile, view, seen \}\)\) return null;/);
});

// ── One year, one cohort ───────────────────────────────────────────
test('the cohort comes from the app year and the semester note', () => {
  const note = 'Vet 86 = ชั้นปีที่ 5';
  assert.equal(cohortForYear(5, note), 'Vet 86');
  assert.equal(cohortForYear(4, note), 'Vet 87');
  assert.equal(cohortForYear(6, note), 'Vet 85');
  assert.equal(cohortForYear(0, note), null);
  assert.equal(cohortForYear(5, ''), null);
  const hub = read('src/views/ProfileView.jsx');
  assert.doesNotMatch(hub, /profile\?\.year/, 'profiles has no year column');
  assert.match(hub, /cohortForYear\(year, SEMESTER\?\.cohortNote\)/);
});

// ── Every statement on the hub true ────────────────────────────────
test('the review row says what the student gets, no algorithm names', () => {
  const hub = read('src/views/ProfileView.jsx');
  // Code comments may name the scheduler; what a student reads may not.
  const shown = hub.split('\n').filter((l) => !/^\s*(\/\/|\/\*|\*)/.test(l)).join('\n');
  assert.doesNotMatch(shown, /SM-2|FSRS/);
  assert.match(hub, /แอปเลือกวันให้เอง/);
});

test('the streak tile and the streak trophies read one number', () => {
  const day = 86400000;
  const t0 = Date.UTC(2026, 9, 1, 3);
  // History holds a run of 2 days; the saved streak (which knows a freeze) says 4.
  const history = [0, 1, 5, 6].map((d, i) => ({ date: t0 + d * day, questionId: `q${i}`, subject: 's', correct: true }));
  const next = nextBadge({ history, currentStreak: 4 });
  assert.equal(next.id, 'streak-7');
  assert.deepEqual([next.have, next.need], [4, 7], 'the trophy line says 4 of 7 when the tile says 4');
  assert.equal(badgeMetrics({ history, currentStreak: 0 }).streak, 2, 'without the saved streak, the longest run in history');
  assert.ok(earnedBadges({ history, currentStreak: 7 }).some((b) => b.id === 'streak-7'), 'a 7-day tile and the 7-day trophy agree');
  const hub = read('src/views/ProfileView.jsx');
  assert.match(hub, /nextBadge\(\{ history: history \|\| \[\], srCards: srCards \|\| \{\}, currentStreak: stats\.streak \}\)/);
  assert.match(hub, /earnedBadges\(\{ history: history \|\| \[\], srCards: srCards \|\| \{\}, currentStreak: stats\.streak \}\)/);
});

// ── Badges and the figure ──────────────────────────────────────────
test('the next badge is the counted badge nearest to done, with the same thresholds', () => {
  const day = 86400000;
  const t0 = Date.UTC(2026, 9, 1, 3);
  const rows = (n, perDay = 1) => Array.from({ length: n }, (_, i) => ({ date: t0 + Math.floor(i / perDay) * day, questionId: `q${i}`, subject: 's', correct: true }));
  assert.equal(nextBadge({ history: [] }).id, 'questions-100', 'ties go to the first in order');
  const six = rows(6);
  assert.equal(nextBadge({ history: six }).id, 'streak-7', 'six days in a row: one day from a badge');
  assert.deepEqual([nextBadge({ history: six }).have, nextBadge({ history: six }).need], [6, 7]);
  // Every counted threshold is exactly where earnedBadges awards it.
  for (const { id, metric, need } of COUNTED_BADGES) {
    if (metric !== 'answered') continue;
    const below = earnedBadges({ history: rows(need - 1, 50) }).some((b) => b.id === id);
    const at = earnedBadges({ history: rows(need, 50) }).some((b) => b.id === id);
    assert.deepEqual([below, at], [false, true], id);
  }
  assert.equal(badgeMetrics({ history: rows(3) }).streak, 3);
});

test('four weeks of days, oldest first, with answers and right answers', () => {
  const now = Date.UTC(2026, 10, 11, 5); // 12:00 Bangkok
  const rows = [
    { date: now, correct: true }, { date: now - 1000, correct: false },
    { date: new Date(now - 86400000).toISOString(), correct: true },
  ];
  const d = daysTrack(rows, 28, now);
  assert.equal(d.length, 28);
  assert.deepEqual([d[27].count, d[27].correct, d[27].isToday], [2, 1, true]);
  assert.deepEqual([d[26].count, d[26].correct], [1, 1]);
  assert.equal(weekTrack(rows, now)[6].count, d[27].count, 'agrees with the seven-day strip');
});

test('the picture set is plain animals, each with a Thai name for screen readers', () => {
  assert.ok(PICTURES.length >= 12);
  assert.equal(new Set(PICTURES.map((p) => p.emoji)).size, PICTURES.length);
  for (const p of PICTURES) {
    assert.ok([...p.emoji].length <= 2 && p.emoji.length <= 32, 'fits profiles_avatar_length_check');
    assert.match(p.label, /^[฀-๿ ]+$/);
  }
});
