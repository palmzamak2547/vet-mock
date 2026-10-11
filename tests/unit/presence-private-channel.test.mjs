// ============================================================
// presence-private-channel — the buddies channel is private, token first
// ============================================================
// B76r. 'vet-mock-buddies' was a public Realtime channel, so anyone holding
// the shipped anon key could join it and read every signed-in student's
// subject, screen and question. With migration
// 20261011120500_study_buddies_private_channel the channel is authorised
// against RLS on realtime.messages, which only works when the client joins
// with config.private = true and the session JWT is already on the realtime
// socket when the join frame is built.
//
// This test pins the client half: private is set, realtime.setAuth() runs
// before channel() and subscribe(), a client whose fake has no realtime
// object (older tests, no session) still joins, and a failing setAuth does
// not stop the join. The presence payload rules of presence-privacy.test.mjs
// are unchanged and still pinned there.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../src/hooks/useStudyBuddies.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

// The same one-component host as presence-privacy.test.mjs: refs persist,
// effects run after each render.
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

function fakeRealtime({ withRealtime = true, setAuthFails = false } = {}) {
  const calls = [];
  const configs = [];
  const channel = {
    on() { return channel; },
    presenceState: () => ({}),
    async subscribe(cb) { calls.push('subscribe'); cb('SUBSCRIBED'); return channel; },
    track() { calls.push('track'); },
    untrack() {}, unsubscribe() {},
  };
  const sb = { channel: (name, opts) => { calls.push('channel'); configs.push({ name, opts }); return channel; } };
  if (withRealtime) {
    sb.realtime = { async setAuth(token) { calls.push('setAuth'); if (setAuthFails) throw new Error('no session'); return token; } };
  }
  return { sb, calls, configs };
}

const settle = async (ready = () => true) => {
  for (let i = 0; i < 2000 && !ready(); i++) await new Promise((r) => setTimeout(r, 1));
  for (let i = 0; i < 30; i++) await new Promise((r) => setImmediate(r));
};
const UID = '4a7f3c1e-9b2d-4e8a-b6c5-0d1e2f3a4b5c';
const props = { user: { id: UID }, profile: { username: 'palm', avatar_emoji: '🐶' }, subject: 'com5', view: 'exam', qKey: 'com5:q1' };

test('the buddies channel is joined as a private channel', async () => {
  const fake = fakeRealtime();
  loadHook(fake).render(props);
  await settle(() => fake.calls.includes('track'));
  assert.equal(fake.configs.length, 1);
  assert.equal(fake.configs[0].name, 'vet-mock-buddies');
  assert.equal(fake.configs[0].opts.config.private, true, 'config.private must be true');
  assert.ok(fake.configs[0].opts.config.presence.key, 'the presence key is still set');
});

test('the session token reaches the realtime socket before the channel is created and joined', async () => {
  const fake = fakeRealtime();
  loadHook(fake).render(props);
  await settle(() => fake.calls.includes('track'));
  const at = (name) => fake.calls.indexOf(name);
  assert.notEqual(at('setAuth'), -1, 'realtime.setAuth() is called');
  assert.ok(at('setAuth') < at('channel'), `setAuth before channel(): ${fake.calls.join(' > ')}`);
  assert.ok(at('channel') < at('subscribe'), `channel() before subscribe(): ${fake.calls.join(' > ')}`);
});

test('a client without a realtime object, or whose setAuth fails, still joins', async () => {
  const bare = fakeRealtime({ withRealtime: false });
  loadHook(bare).render(props);
  await settle(() => bare.calls.includes('track'));
  assert.deepEqual(bare.calls.filter((c) => c !== 'track'), ['channel', 'subscribe']);

  const failing = fakeRealtime({ setAuthFails: true });
  loadHook(failing).render(props);
  await settle(() => failing.calls.includes('track'));
  assert.ok(failing.calls.includes('subscribe'), 'a rejected setAuth does not stop the join; the server decides');
});

test('the source no longer calls the channel public or defers the change to a database migration', () => {
  assert.doesNotMatch(source, /is a public Realtime channel/);
  assert.doesNotMatch(source, /needs a database change/);
  assert.match(source, /private: true/);
});
