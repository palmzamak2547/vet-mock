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
import { XP_AWARDS, levelFor } from '../../src/lib/xp.js';
import {
  accountXp, shownXp, xpToCarry, markCarried, carriedKey, pendingKey, extraXpOf,
} from '../../src/lib/xp-account.js';
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
  assert.equal(plan.carry, null, 'answers are counted once, from the history: no lead, nothing written');
  markCarried('A', st);
  assert.equal(shownXp({ history, user, device, storage: st }), rebuilt, '3500 stays 3500, not 7000');
});

test('a second account on the same phone never gets the first one\'s counter or quest points', () => {
  const st = store({ 'vmx-user-sync-owner-v1': JSON.stringify('A'), 'vmx-xp-counter-owner': 'A' });
  const aHistory = answers(990);
  const device = { totalXp: accountXp({ history: aHistory }) + 300, lifetimeQs: 990 }; // A's 300 quest points
  const A = { id: 'A', user_metadata: {} };
  const a = xpToCarry({ user: A, history: aHistory, device, storage: st, ready: true });
  assert.equal(a.carry.value, 300);
  markCarried('A', st);
  // B signs in on A's phone with a short history of their own.
  const B = { id: 'B', user_metadata: {} };
  const bHistory = answers(12);
  const b = xpToCarry({ user: B, history: bHistory, device, storage: st, ready: true });
  assert.equal(b.carry, null, 'the counter is A\'s: B carries none of it');
  assert.equal(shownXp({ history: bHistory, user: B, device, storage: st }), accountXp({ history: bHistory }), 'B sees only B');
  // A phone with no recorded owner: nobody carries its counter.
  const fresh = store({ 'vmx-xp-counter-owner': 'none' });
  assert.equal(xpToCarry({ user: B, history: bHistory, device, storage: fresh, ready: true }).carry, null);
  // Quest points are kept per account.
  const xp = read('src/lib/xp.js');
  assert.match(xp, /st\.setItem\(`vmx-xp-pending:\$\{uid\}`/, 'awardXp files quest points under the signed-in account');
  assert.equal(pendingKey('A'), 'vmx-xp-pending:A', 'the key xp-account.js reads');
  assert.equal(pendingKey('A') === pendingKey('B'), false);
});

test('two tabs carrying at once write the same number, never twice', () => {
  const st = store({ 'vmx-xp-counter-owner': 'A' });
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

test('every read of a member name or picture in src is drawn through public-display.js, or named here with why', () => {
  // A read is `x.username`, `x.avatar_emoji`, `x.author_name` or `x.avatar`,
  // and destructured `username` / `avatar_emoji`; it is drawn safely when it
  // sits directly inside shownName( or shownPicture(. Every other read is
  // listed with its reason, so a new surface that skips the helper fails.
  const EXEMPT = {
    'src/components/IdentityEditor.jsx: profile?.username': 'the student\'s own name, put into the input to edit; the preview draws it through shownName',
    'src/hooks/useStudyBuddies.js: b?.username': 'copies the presence payload into the panel store; StudyBuddiesPanel draws it with shownName',
    'src/hooks/useStudyBuddies.js: b?.avatar': 'same store copy; drawn with shownPicture',
    'src/hooks/useStudyBuddies.js: profile?.username': 'the student\'s own name, published to presence; drawn by others through shownName',
    'src/hooks/useStudyBuddies.js: profile?.avatar_emoji': 'the student\'s own picture, published to presence; drawn through shownPicture',
    'src/lib/identity-gate.js: md.username': 'compared, never drawn',
    'src/lib/identity-gate.js: profile.username': 'compared, never drawn',
    'src/lib/identity-write.js: patch.username': 'the write path',
    'src/lib/identity-write.js: patch.avatar_emoji': 'the write path',
    'src/lib/identity-write.js: meta.username': 'the write path',
    'src/lib/identity-write.js: meta.avatar_emoji': 'the write path',
    'src/lib/identity-write.js: row.username': 'compared in the free-name check, never drawn',
    'src/lib/identity-write.js: destructure': 'saveIdentity\'s own arguments',
    'src/lib/safe-url.js: u.username': 'URL user info, not a member',
    'src/lib/safe-url.js: parsed.username': 'URL user info, not a member',
    'src/lib/vca-library.js: url.username': 'URL user info, not a member',
    'src/views/AccountSettingsView.jsx: profile?.username': 'the student\'s own name, checked and exported; drawn through shownName',
    'src/views/AccountSettingsView.jsx: profile?.avatar_emoji': 'exported as stored, in the student\'s own file',
    'src/views/AdminView.jsx: u.avatar': 'the back office shows raw values on purpose, to moderate them',
    'src/views/AdminView.jsx: u.username': 'back office, raw on purpose',
    'src/views/AdminView.jsx: row.username': 'back office, raw on purpose',
    'src/views/AdminView.jsx: row.avatar': 'back office, raw on purpose',
    'src/views/AdminView.jsx: s.username': 'back office, raw on purpose',
    'src/views/AdminView.jsx: e.avatar': 'back office, raw on purpose',
    'src/views/AdminView.jsx: e.username': 'back office, raw on purpose',
    'src/views/FeedbackView.jsx: profile?.username': 'the student\'s own name, sent in their own feedback mail',
    'src/views/HomeView.jsx: profile?.username': 'checked by isAutoName; the greeting draws it through shownName',
    'src/views/ProfileView.jsx: profile?.username': 'the student\'s own name on their card, drawn through shownName',
  };
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(new URL(dir, ROOT))) {
      const rel = `${dir}${name}`;
      if (statSync(new URL(rel, ROOT)).isDirectory()) { if (name !== 'data') walk(`${rel}/`); continue; }
      if (/\.(jsx?|mjs)$/.test(rel)) files.push(rel);
    }
  };
  walk('src/');
  const unlisted = [];
  const seen = new Set();
  for (const f of files) {
    const lines = read(f).split('\n');
    for (const line of lines) {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) continue;
      for (const m of line.matchAll(/([A-Za-z_$][\w$]*(?:\??\.[A-Za-z_$][\w$]*|\[[^\]]+\])*)\??\.(username|avatar_emoji|author_name|avatar)\b/g)) {
        if (/(shownName|shownPicture)\($/.test(line.slice(0, m.index))) continue;
        const key = `${f}: ${m[0]}`;
        seen.add(key);
        if (!EXEMPT[key]) unlisted.push(key);
      }
      if (/\{[^}]*\b(username|avatar_emoji)\b[^}]*\}\s*=/.test(line)) {
        const key = `${f}: destructure`;
        seen.add(key);
        if (!EXEMPT[key]) unlisted.push(key);
      }
    }
  }
  assert.deepEqual([...new Set(unlisted)], [], 'these read a member\'s name or picture without shownName/shownPicture and are not listed with a reason');
  const stale = Object.keys(EXEMPT).filter((k) => !seen.has(k));
  assert.deepEqual(stale, [], 'listed reads that are gone: take them off the list');
});

// ── Re-read of ab7036db ────────────────────────────────────────────
test('a zero lead writes nothing and claims nothing: 200 fresh devices leave the metadata as it was', () => {
  const history = answers(50);
  const user = { id: 'A', user_metadata: { xp_quests: 10 } };
  for (let i = 0; i < 200; i++) {
    const st = store();
    const plan = xpToCarry({ user, history, device: { totalXp: 0, lifetimeQs: 0 }, storage: st, ready: true });
    assert.equal(plan.carry, null, 'nothing to write');
    assert.equal(plan.owns, false, 'and the counter is not claimed');
  }
  assert.deepEqual(user.user_metadata, { xp_quests: 10 });
  assert.match(read('src/components/XpChip.jsx'), /markCarried\(uid\)/);
});

test('the counter is only the pre-release owner\'s: A and B in both orders, and a level never falls', () => {
  // A's phone: 500 answers, 1,000 SR grades and 400 quest points on the counter.
  const aHistory = answers(500);
  const aCards = { c: { totalReviews: 1000 } };
  const aOwn = accountXp({ history: aHistory, srCards: aCards });
  const device = { totalXp: aOwn + 400, lifetimeQs: 500 };
  const B = { id: 'B', user_metadata: {} };
  const bHistory = answers(600);
  for (const order of [['B', 'A'], ['A', 'B']]) {
    const st = store({ 'vmx-xp-counter-owner': 'A' });
    const seen = {};
    for (const who of order) {
      const user = who === 'A' ? { id: 'A', user_metadata: {} } : B;
      const history = who === 'A' ? aHistory : bHistory;
      const srCards = who === 'A' ? aCards : {};
      const before = shownXp({ history, srCards, user, device, storage: st });
      const plan = xpToCarry({ user, history, srCards, device, storage: st, ready: true });
      markCarried(user.id, st);
      const md = plan.carry ? { xp_carry: { [plan.carry.device]: plan.carry.value } } : {};
      const after = shownXp({ history, srCards, user: { ...user, user_metadata: md }, device, storage: st });
      assert.ok(after >= before, `${order.join(' then ')}: ${who} ${after} >= ${before}`);
      seen[who] = { plan, after };
    }
    assert.equal(seen.B.plan.carry, null, `${order.join(' then ')}: B carries none of A's counter`);
    assert.equal(seen.B.after, accountXp({ history: bHistory }), 'B sees only B');
    assert.equal(seen.A.plan.carry.value, 400, `${order.join(' then ')}: A carries A's 400 quest points`);
    assert.equal(seen.A.after, device.totalXp, 'A keeps 5,150');
  }
  // The owner is recorded once, before any sign-in, from the data store's own key.
  const xp = read('src/lib/xp.js');
  assert.match(xp, /st\.getItem\(COUNTER_OWNER_KEY\) === null/);
  assert.match(xp, /JSON\.parse\(st\.getItem\('vmx-user-sync-owner-v1'\)/);
});

test('the level does not flash on a load: guest, signed in before sync, synced', () => {
  const history = answers(200);
  const own = accountXp({ history });
  const device = { totalXp: own + 150, lifetimeQs: 200 };
  const st = store({ 'vmx-xp-counter-owner': 'A' });
  const A = { id: 'A', user_metadata: {} };
  const guest = shownXp({ history: [], user: null, device, storage: st });
  const early = shownXp({ history: [], user: A, device, storage: st }); // sync not finished: no history yet
  const plan = xpToCarry({ user: A, history, device, storage: st, ready: true });
  markCarried('A', st);
  const synced = shownXp({ history, user: { ...A, user_metadata: { xp_carry: { [plan.carry.device]: plan.carry.value } } }, device, storage: st });
  assert.deepEqual([guest, early, synced], [device.totalXp, device.totalXp, device.totalXp], 'the same number in all three frames');
  const chip = read('src/components/XpChip.jsx');
  assert.match(chip, /const total = ready \|\| !uid \? computed : Math\.max\(computed, lastShown\.current\);/, 'and never less than the frame before until sync is ready');
});

test('the board line names the board, and a second tab stops publishing when hidden elsewhere', () => {
  assert.match(read('src/components/BoardPresenceNotice.jsx'), /เพื่อนไม่เห็นคะแนนของคุณบนกระดาน/);
  const src = read('src/hooks/useStudyBuddies.js');
  assert.match(src, /window\.addEventListener\('storage', onStorage\)/);
  assert.match(src, /\/\^sb-\.\*-auth-token\$\/\.test\(event\.key\)/);
});

test('look-alike names are "similar", not "taken"; reserved words only as a whole or a prefix', () => {
  const editor = read('src/components/IdentityEditor.jsx');
  assert.match(editor, /free === 'similar' \? 'คล้ายกับชื่อที่มีคนใช้แล้ว ลองชื่ออื่น'/);
  assert.match(read('src/lib/identity-write.js'), /\? 'taken' : 'similar'/);
  for (const n of ['Rootbeer', 'Rooti', 'Staffy', 'Systema', 'Ownerin']) assert.equal(checkPublicName(n).ok, true, n);
  for (const n of ['Owner', 'admin', 'Staff_1', 'vetmock2', 'AdmIn', 'Support 24', 'อาจารย์ปิง', 'ทีมงานVetMock']) assert.equal(checkPublicName(n).ok, false, n);
  // A Thai word is matched anywhere, so the refusal names it.
  assert.equal(checkPublicName('ลูกอาจารย์').reason, 'มีคำว่า อาจารย์ ซึ่งอ่านเหมือนทีมงาน');
  assert.equal(checkPublicName('ผู้ดูแลแมว').reason, 'มีคำว่า ผู้ดูแล ซึ่งอ่านเหมือนทีมงาน');
});

test('names saved before this release keep showing, and the owner is told when they do not', () => {
  for (const n of ['ploy55555', 'vet86 2567', 'ping 2026']) assert.equal(shownName(n), n, n);
  for (const n of ['6531234531', '６４３１２３４５６７', '๖๕๓๑๒๓๔๕๓๑', 'x12345678',
    '1234567', '643 1234567', '6431.234.567', '081-234-5678', '081 2345678']) assert.equal(shownName(n), 'นิสิต', n);
  const hub = read('src/views/ProfileView.jsx');
  assert.match(hub, /const masked = Boolean\(name\) && shownName\(name\) === 'นิสิต'/);
  assert.match(hub, /เพื่อนเห็นคุณเป็น นิสิต เพราะชื่อนี้อ่านเหมือนรหัสหรืออีเมล แตะการ์ดเพื่อตั้งชื่อใหม่/);
});

// ── 6. The export copy ─────────────────────────────────────────────
test('the export page says what the file restores, and no more', () => {
  const s = read('src/views/AccountSettingsView.jsx');
  assert.match(s, /หน้าความคืบหน้านำกลับเข้าได้เฉพาะ/);
  assert.doesNotMatch(s, /ไฟล์เดียว นำกลับเข้าได้ที่หน้าความคืบหน้า ในไฟล์มี/);
});
