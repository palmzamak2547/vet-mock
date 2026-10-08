import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle } from '../helpers/fake-react.mjs';

test('online count retries one retired channel once and ignores its late callbacks', async t => {
  const original = new Map(['window', 'setTimeout', 'clearTimeout', '__onlineProbe'].map(key => [key, globalThis[key]]));
  const timers = new Set(), channels = [];
  globalThis.window = { requestIdleCallback(fn) { fn(); } };
  globalThis.setTimeout = (fn, ms, ...args) => {
    if (ms !== 8000) return original.get('setTimeout')(fn, ms, ...args);
    const timer = { fn }; timers.add(timer); return timer;
  };
  globalThis.clearTimeout = timer => {
    if (!timers.delete(timer)) original.get('clearTimeout')(timer);
  };
  globalThis.__onlineProbe = { channel() {
    const channel = {
      closed: 0, count: 1,
      on(kind, event, fn) { this.sync = fn; return this; },
      subscribe(fn) { this.status = fn; return this; },
      async track() {},
      presenceState() { return Object.fromEntries(Array.from({ length: this.count }, (_, i) => [i, []])); },
      unsubscribe() { this.closed++; return Promise.resolve(); },
    };
    channels.push(channel); return channel;
  } };
  t.after(() => { for (const [key, value] of original) {
    if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
  } });
  const { useOnlineCount } = await loadModule('src/hooks/useOnlineCount.js', { stubs: [{
    match: 'lib/supabase\\.js$', contents: 'export const hasSupabase = true; export const getSupabase = async () => globalThis.__onlineProbe;',
  }] });
  const panel = mount(useOnlineCount);
  t.after(() => panel.unmount());
  await settle(panel);
  assert.equal(channels.length, 1);
  await channels[0].status('CHANNEL_ERROR');
  await channels[0].status('TIMED_OUT');
  await channels[0].status('CHANNEL_ERROR');
  assert.equal(timers.size, 1, 'one failed channel queues only one retry');
  assert.equal(channels[0].closed, 1);
  const timer = [...timers][0]; timers.delete(timer); timer.fn();
  await settle(panel);
  assert.equal(channels.length, 2);
  channels[1].count = 2;
  await channels[1].status('SUBSCRIBED');
  channels[1].sync();
  panel.flush();
  assert.deepEqual(panel.tree, { count: 2, status: 'connected' });
  await channels[0].status('TIMED_OUT');
  channels[0].sync();
  panel.flush();
  assert.deepEqual(panel.tree, { count: 2, status: 'connected' }, 'old events cannot replace the current connection');
  assert.equal(channels[1].closed, 0);
  assert.equal(timers.size, 0);
  await channels[1].status('CHANNEL_ERROR');
  assert.equal(timers.size, 1);
  panel.unmount();
  assert.equal(timers.size, 0, 'leaving the app cancels queued retries');
});
