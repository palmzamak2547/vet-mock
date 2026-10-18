// View transitions (lib/motion.js) when the browser drops one. A transition that is skipped or
// aborted rejects its promises (ready, updateCallbackDone, finished); a page change that rode on
// one must come out quiet and clean, and a real fault must still be heard.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const { pageTransition, themeTransition, pageReady } = await import('../../src/lib/motion.js');

const settled = () => new Promise((resolve) => setImmediate(resolve));

/** Rejections nobody handled while `run` ran and the loop turned a few times. */
async function unhandledDuring(run) {
  const seen = [];
  const listener = (reason) => seen.push(reason);
  process.on('unhandledRejection', listener);
  try {
    await run();
    for (let i = 0; i < 5; i += 1) await settled();
  } finally { process.off('unhandledRejection', listener); }
  return seen;
}

/** A browser with view transitions: `make` builds the transition object startViewTransition returns.
 *  It has a mouse (page changes run as transitions only with a fine pointer) and motion on. */
function browser(make, { mouse = true } = {}) {
  const root = { dataset: {}, classList: { toggle() {} }, animate() {} };
  globalThis.window = { matchMedia: (q) => ({ matches: mouse && /pointer: fine/.test(q) }) };
  globalThis.innerWidth = 390;
  globalThis.innerHeight = 800;
  globalThis.document = {
    documentElement: root,
    querySelector: () => null,
    startViewTransition: (callback) => make(callback),
  };
  return root;
}

const abort = (message = 'Transition was aborted because of invalid state. Viewport size changed') => new DOMException(message, 'InvalidStateError');
const skipped = () => new DOMException('Transition was skipped', 'AbortError');

test('a page transition the browser aborts leaves no uncaught error, and the page changed anyway', async () => {
  let changed = 0;
  const root = browser((callback) => {
    const done = Promise.resolve().then(callback);
    return { ready: Promise.reject(abort()), updateCallbackDone: done, finished: done };
  });
  const seen = await unhandledDuring(async () => {
    pageTransition(() => { changed += 1; });
    await settled();
    pageReady();
  });
  assert.deepEqual(seen, [], 'nothing uncaught');
  assert.equal(changed, 1, 'the route changed');
  assert.equal(root.dataset.vt, undefined, 'the page-transition flag is cleared');
});

test('a transition skipped before it began is as quiet', async () => {
  let changed = 0;
  const root = browser((callback) => {
    const done = Promise.resolve().then(callback);
    return { ready: Promise.reject(skipped()), updateCallbackDone: done, finished: done };
  });
  const seen = await unhandledDuring(async () => {
    pageTransition(() => { changed += 1; });
    await settled();
    pageReady();
  });
  assert.deepEqual(seen, []);
  assert.equal(changed, 1);
  assert.equal(root.dataset.vt, undefined);
});

test('all three promises rejecting at once is still one quiet abort', async () => {
  const root = browser(() => ({ ready: Promise.reject(abort()), updateCallbackDone: Promise.reject(abort()), finished: Promise.reject(abort()) }));
  const seen = await unhandledDuring(async () => { pageTransition(() => {}); });
  assert.deepEqual(seen, []);
  assert.equal(root.dataset.vt, undefined, 'the flag is cleared when the transition is over, however it ended');
});

test('a theme change the browser aborts is quiet and clears its flag', async () => {
  const root = browser(() => ({ ready: Promise.reject(abort()), updateCallbackDone: Promise.resolve(), finished: Promise.resolve() }));
  const seen = await unhandledDuring(async () => { themeTransition(() => {}, 10, 10); });
  assert.deepEqual(seen, []);
  assert.equal(root.dataset.vt, undefined);
});

test('a fault that is not an abort is still reported, and the flag is still cleared', async () => {
  // The test runner fails a test on any unhandled rejection, so the transition's promises are
  // stand-ins that show what the page's handler does with a rejection: swallow it or throw it on.
  const fault = new Error('the route threw');
  const verdicts = [];
  const rejects = (reason, label) => ({
    catch(handler) {
      try { handler(reason); verdicts.push(`${label}: quiet`); } catch (thrown) { verdicts.push(`${label}: thrown ${thrown === reason ? 'on' : 'other'}`); }
      return Promise.resolve();
    },
  });
  const root = browser(() => ({
    ready: rejects(abort(), 'ready (abort)'),
    updateCallbackDone: rejects(fault, 'updateCallbackDone (fault)'),
    finished: rejects(fault, 'finished (fault)'),
  }));
  pageTransition(() => {});
  await settled();
  assert.deepEqual(verdicts, ['ready (abort): quiet', 'updateCallbackDone (fault): thrown on', 'finished (fault): thrown on']);
  assert.equal(root.dataset.vt, undefined, 'the flag is cleared whatever the transition ended in');
});

test('where the browser has no view transitions the change simply happens', () => {
  browser(() => { throw new Error('should not be asked'); });
  delete globalThis.document.startViewTransition;
  let changed = 0;
  pageTransition(() => { changed += 1; });
  assert.equal(changed, 1);
});

// On a touch screen a page change is not a view transition: the glass bars could only be shown
// as snapshots, which cannot blur what is behind them, and the bar's spring ran unseen while the
// old page was frozen (Palm, phone, 18 Oct: the bar flickered on every page change).
test('a touch screen changes page directly, with no view transition', () => {
  let started = 0;
  let changed = 0;
  const root = browser(() => { started += 1; return {}; }, { mouse: false });
  pageTransition(() => { changed += 1; });
  assert.equal(started, 0);
  assert.equal(changed, 1);
  assert.equal(root.dataset.vt, undefined);
});
