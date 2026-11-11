// The preference table (src/lib/prefs/table.js): every setting a student has
// today resolves to the same meaning through it, no file outside a key's
// owners touches that key, and the ready-made sets only ever hold values the
// table accepts.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// ── A browser-shaped store, seeded with every old key before any import ────
const store = new Map();
const localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => { store.set(k, String(v)); },
  removeItem: (k) => { store.delete(k); },
  key: (i) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
};
const win = new EventTarget();
win.localStorage = localStorage;
win.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
globalThis.window = win;
globalThis.localStorage = localStorage;

// What a student who used every old control has on the device today.
const OLD = {
  'vmx-theme': JSON.stringify('dark'),
  'vmx-palette': JSON.stringify('plum'),
  'vmx-motion-settings': JSON.stringify({ mode: 'quiet', companion: false, loader: 'helix', celebration: 'hearts', readingPointer: 'ink', haptics: false }),
  'vmx-selected-buddy': 'mimi',
  'vmx-read-aloud-rate': '1.5',
  'vmx-tts-prefs': JSON.stringify({ afterStem: 200, betweenOpts: 60, afterLast: 30, speed: 1.1 }),
};
for (const [k, v] of Object.entries(OLD)) store.set(k, v);

const table = await import('../../src/lib/prefs/table.js');
const motion = await import('../../src/lib/motion-preferences.js');
const buddyStats = await import('../../src/lib/buddy-stats.js');
const { effectiveTheme } = await import('../../src/lib/theme-pref.js');

test('every old key resolves to the meaning its own module gives it', () => {
  const state = table.resolvedState();
  const m = motion.normalizeMotionPreferences(JSON.parse(OLD['vmx-motion-settings']));
  assert.equal(effectiveTheme(state.theme, false), 'dark');
  assert.equal(state.theme, 'dark');
  assert.equal(state.palette, 'plum');
  for (const field of ['mode', 'companion', 'loader', 'celebration', 'readingPointer', 'haptics']) {
    assert.equal(state[`motion.${field}`], m[field], field);
  }
  assert.equal(state.buddy, buddyStats.getPickedBuddy());
  assert.equal(state.readAloudRate, 1.5);
  assert.equal(state['voice.speed'], 1.1);
  assert.equal(state['voice.afterStem'], 200);
  assert.equal(state['voice.betweenOpts'], 60);
  assert.equal(state['voice.afterLast'], 30);
});

test('reading through the table rewrites nothing (no setting is migrated or lost)', () => {
  table.resolvedState();
  for (const [k, v] of Object.entries(OLD)) assert.equal(store.get(k), v, k);
  assert.equal(store.has('vmx-prefs-stamp'), false);
});

test('a write goes through the owner and keeps the stored shape the old readers parse', () => {
  assert.equal(table.writePref('theme', 'light'), true);
  assert.equal(store.get('vmx-theme'), '"light"');
  assert.equal(table.writePref('palette', 'ocean'), true);
  assert.equal(store.get('vmx-palette'), '"ocean"');
  table.writePref('motion.loader', 'orbital');
  assert.equal(motion.readMotionPreferences().loader, 'orbital');
  assert.equal(JSON.parse(store.get('vmx-motion-settings')).mode, 'quiet', 'the other motion fields stay');
  table.writePref('buddy', 'oto');
  assert.equal(store.get('vmx-selected-buddy'), 'oto', 'the buddy key stays a raw id');
  table.writePref('readAloudRate', 2);
  assert.equal(store.get('vmx-read-aloud-rate'), '2');
  assert.ok(Number(store.get('vmx-prefs-stamp')) > 0, 'a change to a row that follows the account is stamped');
});

test('values a row does not accept are refused and change nothing', () => {
  const before = new Map(store);
  for (const [id, bad] of [['theme', 'sepia'], ['palette', '__proto__'], ['motion.mode', 'loud'], ['buddy', 'garfield'], ['readAloudRate', 3], ['accentHue', 400], ['accentHue', 1.5], ['card', 'c9.bpaper'], ['nope', 1]]) {
    assert.equal(table.writePref(id, bad), false, `${id}=${bad}`);
  }
  assert.deepEqual(new Map(store), before);
});

test('ready-made sets hold only valid values and never the student\'s identity', () => {
  for (const preset of table.PRESETS) {
    for (const [id, v] of Object.entries(preset.values)) assert.ok(table.validFor(id, v), `${preset.id} ${id}=${v}`);
    for (const id of ['palette', 'accentHue', 'buddy', 'card']) assert.ok(!(id in preset.values), `${preset.id} sets ${id}`);
  }
  const ids = new Set(table.PRESETS.map((p) => p.id));
  assert.equal(ids.size, table.PRESETS.length);
  table.applyValues(table.PRESETS[1].values);
  assert.equal(table.matchingPreset(), table.PRESETS[1].id);
});

test('every row declares its key, owner, default and exam behaviour', () => {
  for (const row of table.PREFS) {
    assert.match(row.key, /^vmx-[a-z-]+$/, row.id);
    assert.match(row.owner, /^src\//, row.id);
    assert.equal(typeof row.def, 'function', row.id);
    assert.ok(table.validFor(row.id, row.def({})), `${row.id} default must be valid`);
    assert.equal(typeof row.account, 'boolean', row.id);
    assert.equal(row.exam, 'as-today', row.id);
  }
});

// ── The guard: a preference key lives only in its owners ───────────────────
// A file that reads or writes one of these keys by name, outside the modules
// listed for it, would be a second copy of the control logic.
const OWNERS = {
  'vmx-theme': ['src/lib/theme-pref.js', 'index.html'],
  'vmx-palette': ['src/lib/theme-pref.js', 'index.html'],
  'vmx-accent': ['src/lib/prefs/accent.js'],
  'vmx-accent-css': ['src/lib/prefs/accent.js', 'index.html'],
  'vmx-motion-settings': ['src/lib/motion-preferences.js', 'src/lib/prefs/table.js'],
  'vmx-selected-buddy': ['src/lib/buddy-stats.js'],
  'vmx-read-aloud-rate': ['src/lib/read-aloud.js', 'src/lib/read-aloud-store.js', 'src/lib/prefs/table.js'],
  'vmx-tts-prefs': ['src/lib/tts.js', 'src/lib/prefs/table.js'],
  'vmx-card': ['src/lib/prefs/card-token.js', 'src/lib/account-local-purge.js'],
  'vmx-prefs-stamp': ['src/lib/prefs/table.js'],
};
const ROOT = new URL('../../', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|jsx|mjs)$/.test(name)) out.push(full);
  }
  return out;
}

test('no file outside a preference key\'s owners names that key', () => {
  const files = [...walk(join(ROOT, 'src')), join(ROOT, 'index.html')];
  const leaks = [];
  for (const file of files) {
    const rel = relative(ROOT, file).replace(/\\/g, '/');
    const text = readFileSync(file, 'utf8');
    for (const [key, owners] of Object.entries(OWNERS)) {
      // The key as a string literal, not as a class name or a longer key.
      const re = new RegExp(`(?<!className=)['"\`]${key}['"\`]`);
      if (re.test(text) && !owners.includes(rel)) leaks.push(`${rel} names ${key}`);
    }
  }
  assert.deepEqual(leaks, []);
});

test('every row of the table has its key in the owner list above', () => {
  for (const row of table.PREFS) assert.ok(OWNERS[row.key], `${row.id} (${row.key}) needs an owner entry`);
});
