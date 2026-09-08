import test from 'node:test';
import assert from 'node:assert/strict';
import { createScope } from '../../src/lib/motion-kit/core.js';

test('motion scope stops frames while hidden, offscreen or reduced and fully disposes', async () => {
  const originals = Object.fromEntries(['window', 'document', 'requestAnimationFrame', 'cancelAnimationFrame', 'IntersectionObserver'].map(k => [k, globalThis[k]]));
  const frames = new Map(), media = new EventTarget(), document = new EventTarget(), root = new EventTarget();
  let id = 0, observer, disconnected = false;
  media.matches = false; document.hidden = false;
  root.classList = { toggle() {}, remove() {} };
  globalThis.window = { matchMedia: () => media };
  globalThis.document = document;
  globalThis.requestAnimationFrame = callback => { frames.set(++id, callback); return id; };
  globalThis.cancelAnimationFrame = key => frames.delete(key);
  globalThis.IntersectionObserver = class { constructor(callback) { observer = callback; } observe() {} disconnect() { disconnected = true; } };
  let scope;
  try {
    scope = createScope(root);
    let ticks = 0, delayed = false;
    scope.frame(() => ticks++);
    const step = time => { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(time)); };
    step(0); step(16);
    assert.equal(ticks, 2); assert.equal(frames.size, 1);
    document.hidden = true; document.dispatchEvent(new Event('visibilitychange'));
    assert.equal(frames.size, 0);
    document.hidden = false; document.dispatchEvent(new Event('visibilitychange'));
    assert.equal(frames.size, 1);
    observer([{ isIntersecting: false }]); assert.equal(frames.size, 0);
    observer([{ isIntersecting: true }]); assert.equal(frames.size, 1);
    scope.setPaused(true); assert.equal(frames.size, 0);
    scope.setPaused(false); assert.equal(frames.size, 1);

    let cancelled = 0, played = 0;
    const animation = { playState: 'running', finished: new Promise(() => {}), cancel() { cancelled++; this.playState = 'idle'; }, finish() { throw Error('infinite animation cannot finish'); }, pause() { this.playState = 'paused'; }, play() { played++; } };
    scope.animate({ animate: () => animation }, [], { iterations: Infinity });
    media.matches = true; media.dispatchEvent(new Event('change'));
    assert.equal(frames.size, 0); assert.equal(cancelled, 1);
    media.matches = false; media.dispatchEvent(new Event('change'));
    assert.equal(played, 0, 'cancelled effects must not replay');
    scope.later(() => { delayed = true; }, 5);
    scope.destroy(); scope.destroy();
    document.dispatchEvent(new Event('visibilitychange')); media.dispatchEvent(new Event('change'));
    assert.equal(frames.size, 0); assert.equal(disconnected, true);
    await new Promise(resolve => setTimeout(resolve, 15));
    assert.equal(delayed, false);
    scope.frame(() => ticks++); scope.setPaused(false);
    assert.equal(frames.size, 0);
  } finally {
    scope?.destroy();
    for (const [key, value] of Object.entries(originals)) {
      if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
    }
  }
});
