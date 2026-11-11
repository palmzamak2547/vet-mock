// The two tokens that leave the device: the card's style (prefs/card-token.js)
// and the account copy of the preferences (prefs/account-token.js). Both are
// parsed as hostile input (AGENTS.md rule 8), and the sign-in plan of
// prefs/account-sync.js never loses a choice a device already has.
import test from 'node:test';
import assert from 'node:assert/strict';

const store = new Map();
globalThis.localStorage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
globalThis.window = Object.assign(new EventTarget(), { localStorage: globalThis.localStorage });

const { parseCardToken, encodeCard, BADGE_IDS, DEFAULT_CARD, CARD_BACKDROPS } = await import('../../src/lib/prefs/card-token.js');
const { parseAccountToken, encodeAccountToken, uncodedAccountPrefs, MAX_TOKEN_BYTES } = await import('../../src/lib/prefs/account-token.js');
const { plan } = await import('../../src/lib/prefs/account-sync.js');
const { BADGE_ART, IG_BACKGROUNDS } = await import('../../src/data/art.js');
const { CHARACTER_EMOJI, characterFor, portraitFor } = await import('../../src/lib/avatar.js');
const { parseBackupPreferences } = await import('../../src/lib/user-data-schema.js');

const HOSTILE = [
  undefined, null, 42, {}, [], '', ' ', 'c1'.padEnd(121, 'a'), 'C1.bpaper', 'c2.bpaper', 'c1..', 'c1.b__proto__',
  'c1.bconstructor', 'c1.t__proto__', 'c1.s__proto__,constructor', 'c1.b<script>', 'c1.p1f436;drop', 'c1.pzz',
  'c1.p' + '1f436-'.repeat(8), '\u0000c1', 'c1.bpaper\n', '{"b":"paper"}',
];

test('a card token that is not one gives no card', () => {
  for (const raw of HOSTILE) {
    const card = parseCardToken(raw);
    if (card === null) continue;
    // A token that parses may only hold values from its lists.
    assert.ok(CARD_BACKDROPS.includes(card.backdrop), String(raw));
    assert.equal(Object.getPrototypeOf(card), Object.prototype);
    assert.ok(!Object.hasOwn(card, '__proto__'));
  }
  for (const raw of [undefined, null, 42, {}, [], '', 'c2.bpaper', 'C1.bpaper', '{"b":"paper"}', 'c1'.padEnd(121, 'a')]) assert.equal(parseCardToken(raw), null, String(raw));
});

test('unknown parts are ignored, values off their lists drop only their part', () => {
  const card = parseCardToken('c1.bfield.zfuture.fgilt.tnope.sstreak-7,nope,streak-7,perfect,night-owl,early-bird');
  assert.equal(card.backdrop, 'field');
  assert.equal(card.frame, 'gilt');
  assert.equal(card.title, null);
  assert.deepEqual(card.trophies, ['streak-7', 'perfect', 'night-owl'], 'at most three, no repeats');
});

test('a card round-trips and the default encodes to the bare version', () => {
  assert.equal(encodeCard(DEFAULT_CARD), 'c1');
  const card = { backdrop: 'graph', frame: 'foil', title: 'streak-30', trophies: ['questions-100'], picture: '🐿️' };
  const back = parseCardToken(encodeCard(card));
  assert.deepEqual(back, card);
  for (const emoji of Object.values(CHARACTER_EMOJI)) assert.equal(parseCardToken(encodeCard({ ...DEFAULT_CARD, picture: emoji })).picture, emoji);
});

test('the card lists match the art they draw', () => {
  assert.deepEqual([...BADGE_IDS].sort(), Object.keys(BADGE_ART).sort());
  const bgs = new Set(IG_BACKGROUNDS.map((b) => b.id));
  for (const id of CARD_BACKDROPS) assert.ok(id === 'paper' || id === 'graph' || bgs.has(id), id);
});

test('one emoji per character, both ways, and old emoji stay emoji', () => {
  const emojis = Object.values(CHARACTER_EMOJI);
  assert.equal(new Set(emojis.map((e) => e.replace(/️/g, ''))).size, emojis.length);
  for (const [id, e] of Object.entries(CHARACTER_EMOJI)) {
    assert.equal(characterFor(e), id);
    assert.ok(e.length <= 32, 'fits profiles.avatar_emoji');
    assert.equal(portraitFor(id), `/art/avatars/${id}.webp`);
  }
  assert.equal(characterFor('🐿'), 'glidy', 'without the variation selector');
  for (const e of ['🐾', '🦊', '', null, '__proto__', 'constructor']) assert.equal(characterFor(e), null, String(e));
});

test('the account token: every account row has a code, and it stays under 512 bytes', () => {
  assert.deepEqual(uncodedAccountPrefs(), []);
  const longest = encodeAccountToken({
    palette: 'custom', accentHue: 359, 'motion.companion': false, 'motion.loader': 'heartbeat', 'motion.celebration': 'contextual',
    'motion.readingPointer': 'spotlight', buddy: 'hootie', readAloudRate: 1.25,
    card: 'c1.bdotted-grid.fledger.tcorrected-mistakes.scorrected-mistakes,panic-survivor,questions-1000.p1f43f-fe0f',
  }, Date.now());
  assert.ok(longest && new TextEncoder().encode(longest).length <= MAX_TOKEN_BYTES, longest);
  const back = parseAccountToken(longest);
  assert.equal(back.values.palette, 'custom');
  assert.equal(back.values.accentHue, 359);
  assert.equal(back.values['motion.companion'], false);
  assert.equal(back.values.readAloudRate, 1.25);
});

test('the account token as hostile input', () => {
  for (const raw of [undefined, null, 7, {}, '', 'p2;t=1', 'p1', 'p1;t=', 'p1;t=-5', 'p1;t=zzzzzzzzzzzz', 'p1;' + 'x'.repeat(600), 'p1;t=0']) {
    assert.equal(parseAccountToken(raw), null, String(raw).slice(0, 30));
  }
  const t = parseAccountToken('p1;t=lz;__proto__=x;constructor=y;pa=__proto__;pa=ocean;bu=garfield;rr=9;ah=1e3;ah=12;co=yes;zz=1;cd=c9.b');
  assert.deepEqual(t.values, { palette: 'ocean', accentHue: 12 });
  assert.equal(Object.getPrototypeOf(t.values), Object.prototype);
  assert.equal({}.polluted, undefined);
});

test('a backup carries the token; a bad one brings nothing and blocks nothing', () => {
  assert.deepEqual(parseBackupPreferences({ preferences: 'p1;t=lz;pa=plum' }), { palette: 'plum' });
  for (const v of [{}, { preferences: 5 }, { preferences: 'p1;t=lz' }, { preferences: '<x>' }, null, []]) assert.equal(parseBackupPreferences(v), null);
});

test('sign-in plan: a device with its own choices keeps them; newest wins after that', () => {
  const token = { at: 1000, values: { palette: 'ocean', buddy: 'oto' } };
  // no account copy yet: this device's values go up when it has any
  assert.deepEqual(plan({ token: null, localStamp: 0, seen: 0, storedIds: ['palette'] }), { take: {}, push: true });
  assert.deepEqual(plan({ token: null, localStamp: 0, seen: 0, storedIds: [] }), { take: {}, push: false });
  // first time on this device: only what it has no choice for
  assert.deepEqual(plan({ token, localStamp: 0, seen: 0, storedIds: ['palette'] }), { take: { buddy: 'oto' }, push: false, seen: 1000 });
  // first time, but this device changed later than the account
  assert.deepEqual(plan({ token, localStamp: 2000, seen: 0, storedIds: ['palette'] }), { take: { buddy: 'oto' }, push: true });
  // known device: newest wins
  assert.deepEqual(plan({ token, localStamp: 500, seen: 900, storedIds: ['palette'] }), { take: token.values, push: false, seen: 1000 });
  assert.deepEqual(plan({ token, localStamp: 3000, seen: 1000, storedIds: ['palette'] }), { take: {}, push: true });
  assert.deepEqual(plan({ token, localStamp: 1000, seen: 1000, storedIds: ['palette'] }), { take: {}, push: false, seen: 1000 });
});
