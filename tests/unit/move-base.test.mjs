// ============================================================
// move-base — the fingerprints both halves of the origin move share
// ============================================================
// src/lib/move-base.js holds the rules a second move depends on: which keys
// are study data, what an empty mirror looks like, how an item is keyed and
// how two copies of a tool join. The page /api/move-in serves embeds the
// kit's source and src/lib/origin-move.js imports it, so these pin it to the
// modules it mirrors and prove it runs with nothing around it.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

import { moveBaseKit } from '../../src/lib/move-base.js';
import { USER_DATA_FIELDS, stableItemKey } from '../../src/lib/user-data-sync.js';
import { LOCAL_EXTRA_FIELDS } from '../../src/lib/local-extras.js';
import { MOVE_IN_SCRIPT, FIELD_KEYS } from '../../api/move-in.js';

const KIT = moveBaseKit();

test('the kit names the user-data fields, their empty values and their item kinds as user-data-sync does', () => {
  assert.deepEqual(KIT.FIELD_BY_KEY, Object.fromEntries(Object.entries(USER_DATA_FIELDS).map(([field, d]) => [d.localKey, field])));
  assert.deepEqual([...FIELD_KEYS].sort(), Object.values(USER_DATA_FIELDS).map((d) => d.localKey).sort());
  for (const [field, d] of Object.entries(USER_DATA_FIELDS)) {
    assert.equal(KIT.EMPTY[field], JSON.stringify(d.initial), field);
    const kind = d.merge === 'keyed-object' ? 'object' : d.merge === 'keyed-array' ? 'array' : undefined;
    assert.equal(KIT.ITEMS[field], kind, `${field}: items that change in place`);
  }
});

test('an item is keyed exactly as user-data-sync keys it', () => {
  for (const item of [
    { id: 7 }, { id: 'c-1', q: 'x' }, { questionId: 3, date: 1758800000000, subject: 'com5' },
    { questionId: 3, date: 1 }, { a: 1 }, 'text', 42, null, [1, 2], { id: undefined, questionId: 1, date: 2 },
  ]) assert.equal(KIT.stableKey(item), stableItemKey(item), JSON.stringify(item));
});

test('the tools it joins are local-extras.js\'s, and the bundle is the one that module reads', () => {
  assert.deepEqual(Object.keys(KIT.EXTRAS).sort(), Object.keys(LOCAL_EXTRA_FIELDS).sort());
  for (const [key, kind] of Object.entries(KIT.EXTRAS)) {
    assert.equal(KIT.validExtra(kind, []), LOCAL_EXTRA_FIELDS[key].type === 'array', key);
    assert.equal(KIT.validExtra(kind, {}), LOCAL_EXTRA_FIELDS[key].type === 'object', key);
  }
  const source = readFileSync(new URL('../../src/lib/local-extras.js', import.meta.url), 'utf8');
  assert.equal(/const BUNDLE_KEY = '([^']+)'/.exec(source)?.[1], KIT.BUNDLE);
});

test('the digest is the bridge\'s own mix, so both halves agree on any text', () => {
  const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
  const script = /<script id="vmx-origin-move">([\s\S]*?)<\/script>/.exec(html)[1];
  const meta = /<meta name="vmx-origin-move" content="([^"]*)"/.exec(html)[1];
  // The bridge hashes key, NUL, value, SOH for each key; one key makes it a digest of that text.
  const key = 'vmx-bookmarks', value = '[1,2,3]';
  let submitted = null;
  const storage = (entries) => ({
    values: new Map(Object.entries(entries)),
    get length() { return this.values.size; }, key(i) { return [...this.values.keys()][i] ?? null; },
    getItem(k) { return this.values.has(k) ? this.values.get(k) : null; }, setItem(k, v) { this.values.set(k, String(v)); }, removeItem(k) { this.values.delete(k); },
  });
  const el = () => ({ children: [], setAttribute() {}, appendChild(c) { this.children.push(c); return c; },
    submit() { submitted = Object.fromEntries(this.children.map((c) => [c.name, c.value])); } });
  const sandbox = {
    location: { hostname: 'vetmock.vercel.app', origin: 'https://vetmock.vercel.app', pathname: '/', search: '', hash: '', replace() {}, reload() {} },
    document: { body: null, documentElement: { appendChild: (c) => c }, querySelector: () => ({ getAttribute: () => meta }), createElement: el, addEventListener() {} },
    localStorage: storage({ [key]: value }), sessionStorage: storage({}), navigator: { onLine: true },
    matchMedia: () => ({ matches: false }), performance: { getEntriesByType: () => [{ type: 'navigate' }] },
    history: { state: null, replaceState() {} }, URLSearchParams, TextEncoder, Blob, Response, btoa, CompressionStream,
    setTimeout: () => 0, clearTimeout() {}, stop() {}, addEventListener() {},
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  return new Promise((resolve) => {
    const wait = () => {
      if (!submitted) { setTimeout(wait, 2); return; }
      assert.equal(submitted.h, KIT.digest(key + String.fromCharCode(0) + value + String.fromCharCode(1)));
      resolve();
    };
    wait();
  });
});

test('the served page runs the kit\'s own source, which needs nothing around it', () => {
  assert.ok(MOVE_IN_SCRIPT.includes(moveBaseKit.toString()), 'one copy of the rules, not two');
  assert.ok(!/<\/script|<!--/i.test(moveBaseKit.toString()), 'cannot close the script element it is served in');
  const alone = vm.runInContext(`(${moveBaseKit.toString()})()`, vm.createContext({}));
  assert.equal(alone.digest('vetmock'), KIT.digest('vetmock'));
  assert.deepEqual(JSON.parse(JSON.stringify(alone.slots('vmx-notes', '{"q1":"a"}'))), JSON.parse(JSON.stringify(KIT.slots('vmx-notes', '{"q1":"a"}'))));
});

test('fingerprints go field by field inside a snapshot, and item by item where items change in place', () => {
  const v2 = JSON.stringify({ version: 2, revision: 0, base: { bookmarks: [1], notes: { q1: 'a', q2: 'b' }, customQuestions: [{ id: 'c1', q: 'x' }] } });
  const slots = KIT.slots('vmx-user-data-v2:anonymous', v2);
  assert.deepEqual(Object.keys(slots).sort(), ['bookmarks', 'customQuestions', 'notes']);
  assert.equal(slots.bookmarks.i, undefined, 'a bookmark has no content to change');
  assert.deepEqual(Object.keys(slots.notes.i).sort(), ['q1', 'q2']);
  assert.deepEqual(Object.keys(slots.customQuestions.i), ['id:c1']);
  assert.equal(slots.notes.i.q1, KIT.short(JSON.stringify('a')));
  assert.deepEqual(Object.keys(KIT.slots('vmx-user-data-v1:u1', '{"srCards":{"5":{"interval":1}}}')), ['srCards']);
  assert.deepEqual(Object.keys(KIT.slots('vmx-sr-cards', '{"5":{"interval":1}}')), ['srCards']);
  assert.equal(KIT.slots('vmx-theme', '"dark"'), null);
  assert.equal(KIT.slots('vmx-user-data-v2:anonymous', '{not json'), null);
  const odd = KIT.print('notes', JSON.parse('{"__proto__":"x"}'));
  assert.deepEqual(Object.keys(odd.i), ['__proto__'], 'an item named like a prototype is just an item');
});

test('an empty mirror is told from one with data', () => {
  for (const [field, d] of Object.entries(USER_DATA_FIELDS)) assert.equal(KIT.isEmpty(field, JSON.stringify(d.initial)), true, field);
  assert.equal(KIT.isEmpty('bookmarks', '[1]'), false);
  assert.equal(KIT.isEmpty('streakData', '{"streak":1,"lastDate":null}'), false);
  assert.equal(KIT.isEmpty('notes', 'not json'), false);
});

test('two copies of a tool join without either hiding the other', () => {
  assert.deepEqual(KIT.mergeExtra('by-id', [{ id: 1, v: 'mine' }, { id: 2 }], [{ id: 1, v: 'theirs' }, { id: 3 }]),
    [{ id: 1, v: 'mine' }, { id: 2 }, { id: 3 }], 'an id both hold keeps this side\'s copy');
  assert.deepEqual(KIT.mergeExtra('clips', [{ url: 'u1', topic: 't' }], [{ url: 'u1', topic: 't', note: 'x' }, { url: 'u1', topic: 'other' }]),
    [{ url: 'u1', topic: 't' }, { url: 'u1', topic: 'other' }], 'a clip is its url and topic');
  assert.deepEqual(JSON.parse(JSON.stringify(KIT.mergeExtra('watched', { a: { watchedAt: 5 }, b: { watchedAt: 9 } }, { a: { watchedAt: 7 }, c: { watchedAt: 1 } }))),
    { a: { watchedAt: 7 }, b: { watchedAt: 9 }, c: { watchedAt: 1 } }, 'a watched mark keeps its later time');
  const notes = KIT.mergeExtra('video-notes',
    { v1: { lastUpdated: 5, notes: [{ id: 1, t: 1, text: 'here' }] } },
    { v1: { lastUpdated: 9, notes: [{ id: 1, t: 1, text: 'there' }, { id: 2, t: 3, text: 'two' }] }, v2: { lastUpdated: 1, notes: [] } });
  assert.deepEqual(JSON.parse(JSON.stringify(notes)), {
    v1: { lastUpdated: 9, notes: [{ id: 1, t: 1, text: 'here' }, { id: 2, t: 3, text: 'two' }] },
    v2: { lastUpdated: 1, notes: [] },
  });
});
