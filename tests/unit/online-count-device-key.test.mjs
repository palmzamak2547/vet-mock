// ============================================================
// online-count-device-key — one presence key per device per day
// ============================================================
// OV-critic-7. useOnlineCount keyed presence with a random id per tab, so
// the admin's "ออนไลน์ตอนนี้" counted tabs: a student with the app open in
// three tabs was three. The key is now kept in localStorage as { id, day }
// and reused by every tab on that device for the day, then rotated. When
// storage is missing or throws (private mode, blocked site data) the tab
// falls back to a key of its own, so the count still works.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, settle } from '../helpers/fake-react.mjs';

const source = readFileSync(new URL('../../src/hooks/useOnlineCount.js', import.meta.url), 'utf8');

function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    writes: 0,
    getItem(k) { return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { this.writes++; map.set(k, String(v)); },
    dump() { return Object.fromEntries(map); },
  };
}

const hook = await loadModule('src/hooks/useOnlineCount.js', { stubs: [{
  match: 'lib/supabase\\.js$', contents: 'export const hasSupabase = true; export const getSupabase = async () => globalThis.__onlineProbe;',
}] });
const { onlineDeviceKey, useOnlineCount } = hook;

test('two tabs on one device, same day, share one key', () => {
  const storage = memoryStorage();
  const day = new Date('2026-10-11T03:00:00Z');
  const first = onlineDeviceKey(storage, day);
  const second = onlineDeviceKey(storage, new Date('2026-10-11T21:30:00Z'));
  assert.equal(first, second);
  assert.match(first, /^dev-[a-z0-9]{6,}$/);
  assert.doesNotMatch(first, /^anon-/, 'no longer the per-tab anon id');
  assert.equal(storage.writes, 1, 'the second tab reads the saved key, it does not mint one');
  const saved = JSON.parse(storage.dump()['vmx-online-device-v1']);
  assert.deepEqual(Object.keys(saved).sort(), ['day', 'id']);
  assert.equal(saved.day, '2026-10-11');
});

test('the key rotates on the next day and never carries the old one', () => {
  const storage = memoryStorage();
  const today = onlineDeviceKey(storage, new Date('2026-10-11T12:00:00Z'));
  const tomorrow = onlineDeviceKey(storage, new Date('2026-10-12T00:00:01Z'));
  assert.notEqual(today, tomorrow);
  assert.equal(JSON.parse(storage.dump()['vmx-online-device-v1']).day, '2026-10-12');
  assert.equal(onlineDeviceKey(storage, new Date('2026-10-12T18:00:00Z')), tomorrow, 'later tabs that day reuse the new key');
});

test('a missing, throwing or garbled storage falls back to a key per tab without throwing', () => {
  const a = onlineDeviceKey(undefined);
  const b = onlineDeviceKey(undefined);
  assert.match(a, /^tab-/);
  assert.notEqual(a, b, 'without storage every tab is its own key, as before');

  const throwing = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('SecurityError'); } };
  assert.match(onlineDeviceKey(throwing), /^tab-/);

  const garbled = memoryStorage({ 'vmx-online-device-v1': '{not json' });
  assert.match(onlineDeviceKey(garbled, new Date('2026-10-11T12:00:00Z')), /^dev-/, 'bad JSON is replaced, not trusted');
  const foreign = memoryStorage({ 'vmx-online-device-v1': JSON.stringify({ id: '<script>', day: '2026-10-11' }) });
  assert.match(onlineDeviceKey(foreign, new Date('2026-10-11T12:00:00Z')), /^dev-[a-z0-9]+$/, 'a saved id of the wrong shape is replaced');
});

test('two mounted hooks on one device join presence under the same key', async (t) => {
  const original = new Map(['window', '__onlineProbe'].map((key) => [key, globalThis[key]]));
  const storage = memoryStorage();
  globalThis.window = { requestIdleCallback(fn) { fn(); }, localStorage: storage };
  const keys = [];
  globalThis.__onlineProbe = { channel(name, opts) {
    keys.push(opts.config.presence.key);
    return { on() { return this; }, subscribe() { return this; }, async track() {}, presenceState() { return {}; }, unsubscribe() { return Promise.resolve(); } };
  } };
  t.after(() => { for (const [key, value] of original) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } });
  const tabA = mount(useOnlineCount);
  const tabB = mount(useOnlineCount);
  t.after(() => { tabA.unmount(); tabB.unmount(); });
  await settle(tabA); await settle(tabB);
  assert.equal(keys.length, 2);
  assert.equal(keys[0], keys[1], 'the second tab merges under the first tab\'s device key');
  assert.match(keys[0], /^dev-/);
});

test('the header comment no longer says the count is people', () => {
  assert.doesNotMatch(source, /จำนวนคนที่ active/);
  assert.doesNotMatch(source, /anon-\$\{Math\.random/);
  assert.match(source, /devices open right now, not people/);
});
