// Where the reader was (lib/scroll.js), against a stand-in for the window and its history: each
// entry remembers its place, a return puts the page back once it is tall enough, a new page keeps
// going to the top, and the browser is never asked to write its history more often than it allows.
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

let copy = 0;
const fresh = () => import(`../../src/lib/scroll.js?copy=${copy += 1}`);
const BASE = 'https://vca.vetmock.com';

/** A window, its history and a document of a given height, with frames the test turns by hand. */
function world({ height = 9000, viewport = 800, state = null, path = '/' } = {}) {
  let clock = 0;
  let next = 1;
  const frames = new Map();
  const listeners = { window: {}, document: {} };
  const doc = { scrollHeight: height };
  const on = (side) => (type, fn) => { (listeners[side][type] ||= new Set()).add(fn); };
  const off = (side) => (type, fn) => { listeners[side][type]?.delete(fn); };
  const win = {
    scrollY: 0,
    innerHeight: viewport,
    location: new URL(path, BASE),
    scrolls: [],
    matchMedia: () => ({ matches: false }),
    addEventListener: on('window'),
    removeEventListener: off('window'),
    dispatchEvent(e) { listeners.window[e.type]?.forEach((fn) => fn(e)); return true; },
    scrollTo(x, y) {
      this.scrolls.push(y);
      this.scrollY = Math.max(0, Math.min(y, doc.scrollHeight - this.innerHeight));
    },
    history: {
      state,
      scrollRestoration: 'auto',
      writes: [],
      pushes: [],
      replaceState(s, _title, url) { this.state = s; this.writes.push(s); if (url) win.location = new URL(url, BASE); },
      pushState(s, _title, url) { this.state = s; this.pushes.push(s); win.location = new URL(url, BASE); },
    },
  };
  const document = { documentElement: doc, hidden: false, addEventListener: on('document'), removeEventListener: off('document') };
  globalThis.window = win;
  globalThis.document = document;
  globalThis.Element = class Element {};
  globalThis.requestAnimationFrame = (fn) => { const id = next; next += 1; frames.set(id, fn); return id; };
  globalThis.cancelAnimationFrame = (id) => { frames.delete(id); };
  Object.defineProperty(globalThis, 'performance', { value: { now: () => clock }, configurable: true, writable: true });
  return {
    win, doc,
    /** One animation frame, `ms` after the last. */
    frame(ms = 16) { clock += ms; const due = [...frames.values()]; frames.clear(); due.forEach((fn) => fn(clock)); },
    frames(n, ms = 16) { for (let i = 0; i < n; i += 1) this.frame(ms); },
    fire(side, type, event = { type }) { listeners[side][type]?.forEach((fn) => fn({ type, ...event })); },
    listening: (side, type) => (listeners[side][type]?.size || 0),
  };
}

test('savedScroll reads a place from a history entry\'s state, and nothing else', async () => {
  const { savedScroll } = await fresh();
  assert.equal(savedScroll({ scroll: 1715 }), 1715);
  assert.equal(savedScroll({ scroll: 0 }), 0);
  for (const bad of [null, undefined, {}, { scroll: -1 }, { scroll: '300' }, { scroll: NaN }, 'x', 7]) assert.equal(savedScroll(bad), null, JSON.stringify(bad));
});

test('a return puts the page back at once when it is tall enough, and is done when its height has held still', async () => {
  const w = world();
  const { restoreScroll, isRestoring } = await fresh();
  restoreScroll(1715);
  assert.equal(isRestoring(), true, 'the new route sees a return is under way');
  assert.deepEqual(w.win.scrolls, [], 'it waits for the next frame, after the route has drawn');
  w.frame();
  assert.equal(w.win.scrollY, 1715);
  assert.equal(isRestoring(), true);
  w.frames(10);
  assert.equal(isRestoring(), false, 'settled after a few calm frames');
  assert.deepEqual(w.win.history.writes.at(-1), { scroll: 1715 }, 'and the place is noted again');
});

test('a page that is short at first is followed as it grows, and the place is reached when it is tall', async () => {
  const w = world({ height: 1200 });
  const { restoreScroll, isRestoring } = await fresh();
  restoreScroll(1715);
  w.frames(3);
  assert.equal(w.win.scrollY, 400, 'as far as the short page goes');
  assert.equal(isRestoring(), true, 'still waiting for the rest of the page');
  w.doc.scrollHeight = 9000;
  w.frame();
  assert.equal(w.win.scrollY, 1715);
  w.frames(10);
  assert.equal(isRestoring(), false);
});

test('a page that never gets tall enough is given up on after a second, at the farthest it goes', async () => {
  const w = world({ height: 1500 });
  const { restoreScroll, isRestoring } = await fresh();
  restoreScroll(1715);
  w.frames(30, 16);
  assert.equal(isRestoring(), true, 'half a second in, still hoping');
  w.frames(40, 16);
  assert.equal(isRestoring(), false, 'a second is the most it waits');
  assert.equal(w.win.scrollY, 700, 'the bottom of the page');
});

test('the reader taking over ends it: the page is not pulled from under their hand', async () => {
  const w = world();
  const { restoreScroll, isRestoring } = await fresh();
  restoreScroll(1715);
  w.frame();
  assert.equal(isRestoring(), true);
  w.fire('window', 'wheel');
  assert.equal(isRestoring(), false);
  w.win.scrollY = 1900; // the reader scrolled on
  w.frames(5);
  assert.equal(w.win.scrollY, 1900, 'nothing scrolled it back');
  for (const type of ['wheel', 'touchstart', 'keydown', 'mousedown']) assert.equal(w.listening('window', type), 0, `${type} listener removed`);
});

test('saveScroll writes the place into the entry\'s state, keeping what else it holds', async () => {
  const w = world({ state: { other: 'kept' } });
  const { saveScroll } = await fresh();
  w.win.scrollY = 1234.4;
  saveScroll();
  assert.deepEqual(w.win.history.state, { other: 'kept', scroll: 1234 });
  saveScroll();
  assert.equal(w.win.history.writes.length, 1, 'a place already noted is not written again');
  w.win.scrollY = 1300;
  saveScroll();
  assert.deepEqual(w.win.history.state, { other: 'kept', scroll: 1300 });
});

test('while a page is being put back, its place is not the reader\'s and is not noted', async () => {
  const w = world();
  const { saveScroll, restoreScroll } = await fresh();
  restoreScroll(1715);
  w.win.scrollY = 0;
  saveScroll();
  assert.deepEqual(w.win.history.writes, []);
});

test('the browser\'s limit on history writes is respected', async () => {
  mock.timers.enable({ apis: ['Date'] });
  try {
    const w = world();
    const { saveScroll } = await fresh();
    for (let i = 1; i <= 120; i += 1) { w.win.scrollY = i * 10; saveScroll(); }
    assert.equal(w.win.history.writes.length, 80, 'at most 80 writes in 30 s (Safari allows 100)');
    mock.timers.tick(31_000);
    w.win.scrollY = 5000;
    saveScroll();
    assert.equal(w.win.history.writes.length, 81, 'and writing resumes when the window has passed');
  } finally { mock.timers.reset(); }
});

test('a browser that refuses the write does not break the page', async () => {
  const w = world();
  w.win.history.replaceState = () => { throw new DOMException('Too many calls', 'SecurityError'); };
  const { saveScroll } = await fresh();
  w.win.scrollY = 400;
  assert.doesNotThrow(() => saveScroll());
});

test('leaving a page notes its place and stops putting back a place the reader has left', async () => {
  const w = world();
  const { leavePage, restoreScroll, isRestoring } = await fresh();
  w.win.scrollY = 2100;
  leavePage();
  assert.deepEqual(w.win.history.state, { scroll: 2100 });
  restoreScroll(500);
  assert.equal(isRestoring(), true);
  leavePage();
  assert.equal(isRestoring(), false, 'a new page is not scrolled by a return that was still going on');
  assert.deepEqual(w.win.history.writes, [{ scroll: 2100 }], 'and the half-restored place was not noted');
});

test('initScroll: the browser\'s own restoring is turned off, and a scroll, a hide and a jump note the place', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const w = world();
    const { initScroll } = await fresh();
    initScroll();
    assert.equal(w.win.history.scrollRestoration, 'manual');

    w.win.scrollY = 800;
    w.fire('window', 'scroll');
    w.win.scrollY = 900;
    w.fire('window', 'scroll');
    mock.timers.tick(149);
    assert.deepEqual(w.win.history.writes, [], 'not while the scrolling goes on');
    mock.timers.tick(1);
    assert.deepEqual(w.win.history.state, { scroll: 900 }, 'a moment after it stops');

    w.win.scrollY = 1000;
    w.fire('window', 'pagehide');
    assert.deepEqual(w.win.history.state, { scroll: 1000 });

    w.win.scrollY = 1100;
    w.fire('document', 'visibilitychange');
    assert.deepEqual(w.win.history.state, { scroll: 1000 }, 'a page that is still showing is not noted');
    globalThis.document.hidden = true;
    w.fire('document', 'visibilitychange');
    assert.deepEqual(w.win.history.state, { scroll: 1100 }, 'a page that hides is');

    // A footnote's own address makes a history entry of its own: the place is noted before it.
    class Anchor extends globalThis.Element { closest(selector) { return selector === 'a[href^="#"]' ? this : null; } }
    class Other extends globalThis.Element { closest() { return null; } }
    w.win.scrollY = 1500;
    w.fire('document', 'click', { target: new Other() });
    assert.deepEqual(w.win.history.state, { scroll: 1100 }, 'a click elsewhere notes nothing');
    w.fire('document', 'click', { target: new Anchor() });
    assert.deepEqual(w.win.history.state, { scroll: 1500 });
  } finally { mock.timers.reset(); }
});

test('Back puts the page where it was; an entry with no place leaves the new page at its top', async () => {
  const w = world();
  const { initScroll, isRestoring } = await fresh();
  initScroll();
  w.fire('window', 'popstate', { state: { scroll: 1715 } });
  assert.equal(isRestoring(), true, 'the route that draws next is told not to scroll to the top');
  w.frame();
  assert.equal(w.win.scrollY, 1715);
  w.frames(10);
  w.fire('window', 'popstate', { state: null });
  assert.equal(isRestoring(), false, 'no place noted: nothing is being restored');
  w.fire('window', 'popstate', { state: { scroll: 300 } });
  w.fire('window', 'popstate', { state: {} });
  assert.equal(isRestoring(), false, 'a second step back before the first settled cancels it');
});

test('a reload puts the page back where its entry says it was', async () => {
  const w = world({ state: { scroll: 900 } });
  const { initScroll, isRestoring } = await fresh();
  initScroll();
  assert.equal(isRestoring(), true);
  w.frame();
  assert.equal(w.win.scrollY, 900);
});

test('a reload waits longer than a return does: its page has the network to wait for first', async () => {
  const w = world({ height: 1000, state: { scroll: 900 } });
  const { initScroll, isRestoring } = await fresh();
  initScroll();
  w.frames(100, 16); // 1.6 s, past what a return would wait
  assert.equal(isRestoring(), true, 'still hoping at 1.6 s');
  w.doc.scrollHeight = 5000; // the route and its data arrive
  w.frame();
  assert.equal(w.win.scrollY, 900);
  w.frames(10);
  assert.equal(isRestoring(), false);
});

test('a new page is pushed with the left page\'s place already noted, and starts with none', async () => {
  const w = world({ path: '/bank' });
  const { navigate } = await import('../../src/router.js');
  w.win.scrollY = 1500;
  navigate('/progress');
  assert.deepEqual(w.win.history.writes, [{ scroll: 1500 }], 'the bank entry remembers 1500');
  assert.deepEqual(w.win.history.pushes, [{}], 'the new entry knows nothing yet');
  assert.equal(w.win.location.pathname, '/progress');
});

test('a replaced entry keeps its place on the same page, and drops it on another', async () => {
  const w = world({ path: '/bank', state: { scroll: 1500 } });
  const { navigate } = await import('../../src/router.js');
  navigate('/bank?q=Lepto', { replace: true });
  assert.deepEqual(w.win.history.state, { scroll: 1500 }, 'the search written to the address does not forget the place');
  navigate('/practice', { replace: true });
  assert.deepEqual(w.win.history.state, {}, 'a different page has no use for the old place');
  assert.equal(w.win.history.pushes.length, 0);
});
