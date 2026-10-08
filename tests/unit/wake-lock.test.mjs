import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle } from '../helpers/fake-react.mjs';

test('exam wake lock coalesces visibility requests and releases pending locks on exit', async t => {
  const original = new Map(['navigator', 'document'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const listeners = new Set(), requests = [];
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
    wakeLock: { request: () => new Promise((resolve, reject) => requests.push({ resolve, reject })) },
  } });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    visibilityState: 'visible',
    addEventListener(type, fn) { assert.equal(type, 'visibilitychange'); listeners.add(fn); },
    removeEventListener(type, fn) { listeners.delete(fn); },
  } });
  t.after(() => {
    for (const [key, descriptor] of original) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  const { useWakeLock } = await loadModule('src/hooks/useWakeLock.js');
  function Exam({ active }) { useWakeLock(active); return null; }
  const exam = mount(Exam, { active: true });
  t.after(() => exam.unmount());
  const visible = () => { for (const fn of listeners) fn(); };
  visible(); visible();
  assert.equal(requests.length, 1, 'a pending screen lock is shared across visibility events');
  requests[0].reject(new Error('document temporarily inactive'));
  await settle(exam);
  visible(); visible();
  assert.equal(requests.length, 2, 'a refused lock remains retryable without duplicate requests');
  let releases = 0;
  const sentinel = { released: false, async release() { this.released = true; releases++; } };
  requests[1].resolve(sentinel);
  await settle(exam);
  visible();
  assert.equal(requests.length, 2, 'an active lock is retained');
  sentinel.released = true;
  visible(); visible();
  assert.equal(requests.length, 3, 'system-released lock is reacquired only once');
  exam.update({ active: false });
  assert.equal(listeners.size, 0);
  const late = { async release() { releases++; } };
  requests[2].resolve(late);
  await settle(exam);
  assert.equal(releases, 2, 'both the previous and late sentinel are released on exit');
  visible();
  assert.equal(requests.length, 3, 'leaving the exam retires visibility requests');
});
