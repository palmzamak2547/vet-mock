// ============================================================
// presence-privacy — what the study-buddies channel publishes
// ============================================================
// B76 (bug hunt 2026-09-26). 'vet-mock-buddies' is a public Realtime channel:
// any client holding the shipped anon key can join it. Its presence was keyed
// by the student's auth UUID, and it carried their username, avatar and live
// screen/question even when they had turned the leaderboard off ("ปิดถ้าอยาก
// เก็บ progress เป็น private").
//
// This test pins what can be done without a database change:
//   • the presence key is an opaque digest, never the auth id;
//   • a student who opted out of the leaderboard is published without their
//     username or avatar;
//   • the app still sees itself under its own id, so the online list, the
//     "N คนกำลังทำข้อนี้" chip and self-exclusion read exactly as before.
// Moving the channel behind Realtime authorization (private: true plus an
// RLS policy on realtime.messages) needs a migration and is reported
// separately.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../src/hooks/useStudyBuddies.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

// A one-component host: refs persist, effects run after each render.
function loadHook(fake) {
  const hookNames = source.match(/^import \{([^}]*)\} from 'react';$/m)[1].split(',').map((s) => s.trim()).filter(Boolean);
  const exported = [...source.matchAll(/^export (?:function|const|let) (\w+)/gm)].map((m) => m[1]);
  const body = source.replace(/^import .*$/gm, '').replace(/^export /gm, '');
  const slots = [];
  let cursor = 0;
  const effects = [];
  const react = {
    useRef: (init) => { const k = cursor++; if (!slots[k]) slots[k] = { current: init }; return slots[k]; },
    useEffect: (fn, deps) => {
      const k = cursor++;
      const prev = slots[k];
      if (prev && deps && prev.deps && deps.every((d, i) => Object.is(d, prev.deps[i]))) return;
      slots[k] = { deps, cleanup: prev?.cleanup };
      effects.push(k);
      slots[k].fn = fn;
    },
    useSyncExternalStore: (subscribe, get) => get(),
  };
  const win = { requestIdleCallback: (cb) => setImmediate(cb) };
  const doc = Object.assign(new EventTarget(), { visibilityState: 'visible' });
  const mod = new Function(...hookNames, 'hasSupabase', 'getSupabase', 'window', 'document',
    `${body}\nreturn { ${exported.join(', ')} };`)(...hookNames.map((n) => react[n]), true, async () => fake.sb, win, doc);
  const render = (props) => {
    cursor = 0;
    mod.useStudyBuddies(props);
    for (const k of effects.splice(0)) {
      if (typeof slots[k].cleanup === 'function') slots[k].cleanup();
      slots[k].cleanup = slots[k].fn();
    }
  };
  return { mod, render };
}

function fakeRealtime() {
  const configs = [];
  const tracked = [];
  let onSync = null;
  let state = {};
  const channel = {
    on(type, filter, cb) { if (type === 'presence') onSync = cb; return channel; },
    presenceState: () => state,
    async subscribe(cb) { cb('SUBSCRIBED'); return channel; },
    track(payload) { tracked.push(payload); },
    untrack() {}, unsubscribe() {},
  };
  return {
    sb: { channel: (name, opts) => { configs.push({ name, opts }); return channel; } },
    configs, tracked,
    sync(map) { state = Object.fromEntries(Object.entries(map).map(([k, m]) => [k, [m]])); onSync?.(); },
  };
}

// The channel is joined after an idle callback and an awaited client, so wait
// for what the test reads rather than for a fixed number of turns.
const settle = async (ready = () => true) => {
  for (let i = 0; i < 2000 && !ready(); i++) await new Promise((r) => setTimeout(r, 1));
  for (let i = 0; i < 30; i++) await new Promise((r) => setImmediate(r));
};
const UID = '4a7f3c1e-9b2d-4e8a-b6c5-0d1e2f3a4b5c';

test('the public channel never carries the auth id, and the app still recognises itself', async () => {
  const fake = fakeRealtime();
  const { mod, render } = loadHook(fake);
  render({ user: { id: UID }, profile: { username: 'palm', avatar_emoji: '🐶' }, subject: 'com5', view: 'exam', qKey: 'com5:q1' });
  await settle(() => fake.tracked.length > 0);
  assert.equal(fake.configs.length, 1);
  const key = fake.configs[0].opts.config.presence.key;
  assert.ok(key && key !== UID && !key.includes(UID), 'the presence key is not the auth id');
  assert.doesNotMatch(JSON.stringify(fake.tracked), new RegExp(UID), 'no payload carries the auth id');

  // Realtime reports this client under its opaque key and a classmate under theirs.
  fake.sync({ [key]: { username: 'palm', avatar: '🐶', subject: 'com5', qKey: 'com5:q1' }, other: { username: 'bee', avatar: '🐱', subject: 'com5', qKey: 'com5:q1' } });
  const panel = mod.useBuddyPanel();
  assert.deepEqual(Object.keys(panel).sort(), [UID, 'other'].sort(), 'the app sees itself under its own id');
  assert.equal(mod.useBuddyCountOnQ('com5:q1', UID), 1, 'self is still excluded from the question chip');
});

test('the key is the same in every tab of one account, so two tabs stay one person', async () => {
  const a = fakeRealtime();
  const b = fakeRealtime();
  loadHook(a).render({ user: { id: UID }, profile: null, subject: null, view: 'home', qKey: null });
  loadHook(b).render({ user: { id: UID }, profile: null, subject: null, view: 'home', qKey: null });
  await settle(() => a.configs.length > 0 && b.configs.length > 0);
  assert.equal(a.configs[0].opts.config.presence.key, b.configs[0].opts.config.presence.key);
});

test('a student who opted out of the leaderboard is published without name or avatar', async () => {
  for (const flag of [false, 'false', 'off']) {
    const fake = fakeRealtime();
    loadHook(fake).render({ user: { id: UID, user_metadata: { show_on_leaderboard: flag } }, profile: { username: 'palm', avatar_emoji: '🐶' }, subject: 'com5', view: 'home', qKey: null });
    await settle(() => fake.tracked.length > 0);
    const [payload] = fake.tracked;
    assert.ok(payload, 'still counted as online');
    assert.notEqual(payload.username, 'palm', `username published with show_on_leaderboard=${flag}`);
    assert.notEqual(payload.avatar, '🐶');
  }
  const shown = fakeRealtime();
  loadHook(shown).render({ user: { id: UID, user_metadata: { show_on_leaderboard: true } }, profile: { username: 'palm', avatar_emoji: '🐶' }, subject: null, view: 'home', qKey: null });
  await settle(() => shown.tracked.length > 0);
  assert.equal(shown.tracked[0].username, 'palm', 'a student who shows on the board keeps their name');
});
