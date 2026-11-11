// ============================================================
// student-identity-review.test.mjs — the security review of the profile
// branch (fd9bec89), one test per finding
// ============================================================
//   1. The level carry: never before the account's history has arrived, never
//      a second account's counter on a shared phone, never twice from two tabs.
//   2. A hidden student is not in presence at all, and the sentence that says
//      so also names where the name still shows.
//   3. A name the database made from the Google name is not a choice.
//   4. Name rules: NFKC, marks on digits, sara am, look-alike letters, the
//      legacy signup check.
//   5. Every surface draws a member through public-display.js.
//   6. The write order and the account check (in student-identity.test.mjs:
//      "the write path"), and the export copy.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  accountXp, shownXp, xpToCarry, markCarried, carriedKey, pendingKey, extraXpOf, XP_AWARDS, levelFor,
} from '../../src/lib/xp.js';
import { checkPublicName, normalizePublicName, compactName, SURFACES } from '../../src/lib/public-identity.js';
import { isAutoName, identityIntroDue } from '../../src/lib/identity-gate.js';
import { shownName, shownPicture } from '../../src/lib/public-display.js';
import { validateUsername } from '../../src/lib/auth-utils.js';

const ROOT = new URL('../../', import.meta.url);
const read = (p) => readFileSync(new URL(p, ROOT), 'utf8');
const store = (init = {}) => {
  const m = new Map(Object.entries(init));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), map: m };
};
const answers = (n) => Array.from({ length: n }, (_, i) => ({ correct: i % 2 === 0 }));

// ── 1. The level carry ─────────────────────────────────────────────
test('no carry before the account history has arrived (the early effect)', () => {
  const history = answers(700);
  const rebuilt = accountXp({ history });
  const device = { totalXp: rebuilt, lifetimeQs: 700 }; // the counter counted exactly these answers
  const st = store();
  const user = { id: 'A', user_metadata: {} };
  // Signed in, sync not finished: history still empty. No carry at all.
  assert.deepEqual(xpToCarry({ user, history: [], device, storage: st, ready: false }), { addQuests: 0, carry: null, first: false });
  // Had it run on the empty history it would have carried the whole counter.
  // With the history in, the lead is what it should be: nothing.
  const plan = xpToCarry({ user, history, device, storage: st, ready: true });
  assert.equal(plan.carry.value, 0, 'answers are counted once, from the history');
  markCarried('A', st, { owns: true });
  assert.equal(shownXp({ history, user, device, storage: st }), rebuilt, '3500 stays 3500, not 7000');
});

test('a second account on the same phone never gets the first one\'s counter or quest points', () => {
  const st = store({ 'vmx-user-sync-owner-v1': JSON.stringify('A') });
  const aHistory = answers(990);
  const device = { totalXp: accountXp({ history: aHistory }) + 300, lifetimeQs: 990 }; // A's 300 quest points
  const A = { id: 'A', user_metadata: {} };
  const a = xpToCarry({ user: A, history: aHistory, device, storage: st, ready: true });
  assert.equal(a.carry.value, 300);
  markCarried('A', st, { owns: true });
  // B signs in on A's phone with a short history of their own.
  const B = { id: 'B', user_metadata: {} };
  const bHistory = answers(12);
  const b = xpToCarry({ user: B, history: bHistory, device, storage: st, ready: true });
  assert.equal(b.carry, null, 'the counter is A\'s: B carries none of it');
  assert.equal(shownXp({ history: bHistory, user: B, device, storage: st }), accountXp({ history: bHistory }), 'B sees only B');
  // Before A ever carried: a counter that recorded more answers than B's whole
  // history cannot be B's either.
  const fresh = store();
  assert.equal(xpToCarry({ user: B, history: bHistory, device, storage: fresh, ready: true }).carry, null);
  // Quest points are kept per account.
  const xp = read('src/lib/xp.js');
  assert.match(xp, /st\.setItem\(pendingKey\(uid\)/, 'awardXp files quest points under the signed-in account');
  assert.equal(pendingKey('A') === pendingKey('B'), false);
});

test('two tabs carrying at once write the same number, never twice', () => {
  const st = store();
  const history = answers(100);
  const device = { totalXp: accountXp({ history }) + 800, lifetimeQs: 100 };
  const user = { id: 'A', user_metadata: {} };
  const tab1 = xpToCarry({ user, history, device, storage: st, ready: true });
  const tab2 = xpToCarry({ user, history, device, storage: st, ready: true });
  assert.deepEqual(tab1.carry, tab2.carry, 'same device, same lead');
  // Each tab's write sets xp_carry[device]; applying both leaves one 800.
  const after = { ...user, user_metadata: { xp_carry: { [tab1.carry.device]: tab1.carry.value } } };
  const again = { ...after, user_metadata: { xp_carry: { ...after.user_metadata.xp_carry, [tab2.carry.device]: tab2.carry.value } } };
  assert.equal(extraXpOf(again), 800, '800, not 1600');
  // And a tab that re-measures after the first write finds the same value.
  const third = xpToCarry({ user: again, history, device, storage: st, ready: true });
  assert.equal(third.carry.value, 800);
  assert.match(read('src/components/XpChip.jsx'), /navigator\.locks\.request\(`vmx-xp-account:\$\{uid\}`, run\)/, 'quest points flush under one lock across tabs');
  assert.match(read('src/lib/identity-write.js'), /\[carry\.device\]: Math\.max/, 'the carry is set per device, not added');
});

test('the level is one function of the account, the same on every device after the carry', () => {
  const history = answers(40);
  const rebuilt = accountXp({ history });
  const user = { id: 'A', user_metadata: { xp_quests: 60, xp_carry: { d1: 200 } } };
  const old = store({ [carriedKey('A')]: '1' });
  const fresh = store({ [carriedKey('A')]: '1' });
  assert.equal(shownXp({ history, user, device: { totalXp: 9000, lifetimeQs: 40 }, storage: old }), rebuilt + 260);
  assert.equal(shownXp({ history, user, device: { totalXp: 0 }, storage: fresh }), rebuilt + 260);
  assert.equal(levelFor(0), 0);
  assert.equal(XP_AWARDS.dailyQ > 0 && !/XP_AWARDS\.dailyQ/.test(read('src/App.jsx')), true, 'the daily question grants nothing, so nothing of it is carried');
  assert.match(read('src/App.jsx'), /xpReady=\{Boolean\(user\) && \['synced', 'pending'\]\.includes\(userDataSync\.phase\)\}/);
});

// ── 2. Presence and the privacy sentence ───────────────────────────
test('a hidden student is not published, and the sentence names where the name still shows', () => {
  const src = read('src/hooks/useStudyBuddies.js');
  assert.match(src, /if \(!showsOnLeaderboard\(latestRef\.current\.user\)\) \{/);
  const editor = read('src/components/IdentityEditor.jsx');
  const line = editor.match(/<strong>ไม่แสดง<\/strong>\s*<span>([^<]+)<\/span>/)[1];
  for (const where of ['ความเห็น', 'ห้องแข่ง', 'สมาชิกกลุ่ม', 'ข้อที่คุณเคยแชร์', 'รายชื่อคนที่กำลังอ่าน']) assert.ok(line.includes(where), where);
  for (const id of ['race', 'shared']) assert.equal(SURFACES.find((s) => s.id === id)?.followsChoice, false, id);
});

// ── 3. Names the database made from the Google name ────────────────
test('the ASCII letters of the Google name, with or without _N, are not a choice', () => {
  const user = { id: 'u', email: 'x@student.chula.ac.th', user_metadata: { full_name: 'Somchai Jaidee', name: 'Somchai Jaidee' } };
  for (const n of ['SomchaiJaidee', 'SomchaiJaidee_2', 'SomchaiJaidee_a1b2c3']) assert.equal(isAutoName(n, user.email, user), true, n);
  assert.equal(isAutoName('Somchai', user.email, user), false, 'a name the student typed');
  const chosen = { ...user, user_metadata: { ...user.user_metadata, username: 'SomchaiJaidee' } };
  assert.equal(isAutoName('SomchaiJaidee', user.email, chosen), false, 'saved by the student through the editor: a choice');
  const due = identityIntroDue({ user, profile: { id: 'u', username: 'SomchaiJaidee_2', created_at: 'x' }, view: 'home' });
  assert.equal(due, true, 'the first-run step asks');
});

// ── 4. Name rules ──────────────────────────────────────────────────
test('marks on digits, look-alike spellings and trailing punctuation are refused or folded', () => {
  for (const n of ['a6431่2345่67', '643ั 1234', 'Ping.', '-ping', '643_1234_567']) assert.equal(checkPublicName(n).ok, false, n);
  assert.equal(normalizePublicName('น้ำ'), normalizePublicName('นํ้า'), 'two spellings of sara am are one name');
  assert.equal(normalizePublicName('Ｐｉｎｇ'), 'Ping', 'NFKC folds full-width letters');
  assert.equal(compactName('SomchaI'), compactName('Somchal'), 'I and l compare as one');
  assert.match(read('src/lib/identity-write.js'), /compactName\(row\.username\) === mine/, 'the free-name check compares the compact form');
});

test('signup applies the same rules as every other place a name is chosen', () => {
  for (const n of ['643_1234_567', 'admin', 'vetmock_staff', 'user_2']) assert.equal(validateUsername(n, 'x@student.chula.ac.th').ok, false, n);
  assert.equal(validateUsername('6531234531', '6531234531@student.chula.ac.th').ok, false);
  assert.equal(validateUsername('ping_vet').ok, true);
  assert.match(read('src/views/AuthView.jsx'), /validateUsername\(username\.trim\(\), email\.trim\(\)\)/, 'checked again on submit');
});

// ── 5. Display on every surface ────────────────────────────────────
test('a name or picture the database took is drawn safely', () => {
  assert.equal(shownName(''), 'นิสิต');
  assert.equal(shownName('​‮'), 'นิสิต');
  assert.equal(shownName('6531234531'), 'นิสิต');
  assert.equal(shownName('ping@x.com'), 'นิสิต');
  assert.equal(shownName('pi‮ng'), 'ping', 'bidi overrides are removed');
  assert.equal(shownPicture('อาจารย์'), '🐾', 'text is never drawn as a picture');
  assert.equal(shownPicture('🐱'), '🐱');
});

test('every surface that draws another member goes through public-display.js', () => {
  // Files that read a member's name or picture to draw it. AdminView shows the
  // raw value on purpose (moderation); FeedbackView sends the student's own
  // name in a mail; HeaderBar only hands the profile on.
  const EXEMPT = new Set(['src/views/AdminView.jsx', 'src/views/FeedbackView.jsx', 'src/components/HeaderBar.jsx', 'src/components/IdentityStep.jsx']);
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(new URL(dir, ROOT))) {
      const rel = `${dir}${name}`;
      if (statSync(new URL(rel, ROOT)).isDirectory()) { if (name !== 'data') walk(`${rel}/`); continue; }
      if (rel.endsWith('.jsx')) files.push(rel);
    }
  };
  walk('src/');
  const draws = /\.(username|avatar_emoji|author_name)\b|\b[a-z]\.avatar\b/;
  const missing = [];
  for (const f of files) {
    if (EXEMPT.has(f)) continue;
    const s = read(f);
    if (draws.test(s) && !/from '\.\.\/lib\/public-display\.js'/.test(s)) missing.push(f);
  }
  assert.deepEqual(missing, [], 'these draw a member without shownName/shownPicture');
  // And the raw forms are gone from the surfaces the review named.
  for (const f of ['src/components/UserMenu.jsx', 'src/views/LeaderboardView.jsx', 'src/views/GroupDetailView.jsx', 'src/components/QComments.jsx', 'src/components/StudyBuddiesPanel.jsx', 'src/views/RaceView.jsx']) {
    const s = read(f);
    assert.doesNotMatch(s, /avatar_emoji \|\| '🐾'|\{p\.avatar\}|\{p\.username\}|\{profile\.username\}|\{m\.username\}/, f);
  }
});

// ── 6. The export copy ─────────────────────────────────────────────
test('the export page says what the file restores, and no more', () => {
  const s = read('src/views/AccountSettingsView.jsx');
  assert.match(s, /หน้าความคืบหน้านำกลับเข้าได้เฉพาะ/);
  assert.doesNotMatch(s, /ไฟล์เดียว นำกลับเข้าได้ที่หน้าความคืบหน้า ในไฟล์มี/);
});
