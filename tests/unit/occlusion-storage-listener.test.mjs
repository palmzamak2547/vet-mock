// ============================================================
// occlusion-storage-listener.test.mjs — leaving the view must leave no ears
// ============================================================
// ImageOcclusionView listens for two things while it is on screen: the
// in-tab IMAGE_OCCLUSION_EVENT and the cross-tab 'storage' event, both of
// which re-read the deck store (a JSON.parse of every deck, base64 images
// included). The 'storage' handler was an anonymous arrow passed straight to
// addEventListener, so the cleanup had nothing to hand to removeEventListener
// and only detached the in-tab one. Every visit to the view left one more
// 'storage' handler behind for the life of the tab; one deck save in another
// tab then parsed the whole store once per visit, mostly for components that
// no longer existed.
//
// The view imports React and lazy-loads a JSX editor, so it cannot be
// imported here. The effect body is lifted out of the source and run against
// a fake window that tracks listeners by identity, the way the DOM does —
// so the assertion is about the leak itself, not about the shape of the text.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/views/ImageOcclusionView.jsx'), 'utf8');
const DECK_KEY = 'vmx-image-occlusion-decks';
const EVENT = 'vmx-image-occlusion-changed';

/** The body of the effect that subscribes to store changes, as a runnable function. */
function storeEffect() {
  const anchor = SRC.indexOf('// Re-load when another tab / component mutates the store');
  assert.notEqual(anchor, -1, 'the store-change effect must still be there');
  const start = SRC.indexOf('useEffect(() => {', anchor);
  const open = start + 'useEffect(() => {'.length;
  const close = SRC.indexOf('}, []);', open);
  assert.ok(start !== -1 && close !== -1, 'could not isolate the effect body');
  const body = SRC.slice(open, close);
  assert.match(body, /addEventListener\('storage'/, 'the effect must still watch cross-tab storage');
  // eslint-disable-next-line no-new-func
  return new Function('window', 'setDecks', 'loadDecks', 'IMAGE_OCCLUSION_EVENT', body);
}

/** A window whose listener bookkeeping mirrors the DOM: remove by identity. */
function fakeWindow() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      listeners.get(type)?.delete(fn);
    },
    dispatch(type, event) {
      for (const fn of [...(listeners.get(type) || [])]) fn(event);
    },
    count(type) {
      return listeners.get(type)?.size || 0;
    },
  };
}

function mount(win, loadDecks = () => []) {
  const cleanup = storeEffect()(win, () => {}, loadDecks, EVENT);
  assert.equal(typeof cleanup, 'function', 'the effect must return its cleanup');
  return cleanup;
}

test('while mounted, a deck-store change in another tab reloads the decks', () => {
  const win = fakeWindow();
  let loads = 0;
  mount(win, () => { loads += 1; return []; });
  win.dispatch('storage', { key: DECK_KEY });
  assert.equal(loads, 1, 'a write to the deck key must reload');
  win.dispatch('storage', { key: null });
  assert.equal(loads, 2, 'localStorage.clear() (key null) must reload');
  win.dispatch('storage', { key: 'vmx-history' });
  assert.equal(loads, 2, 'an unrelated key must not reload');
  win.dispatch(EVENT, {});
  assert.equal(loads, 3, 'the in-tab change event must still reload');
});

test('leaving the view removes the storage listener, not just the in-tab one', () => {
  const win = fakeWindow();
  const cleanup = mount(win);
  assert.equal(win.count('storage'), 1);
  assert.equal(win.count(EVENT), 1);
  cleanup();
  assert.equal(win.count(EVENT), 0, 'the in-tab listener must be removed on unmount');
  assert.equal(
    win.count('storage'),
    0,
    'the storage listener is still attached after unmount — every visit to the view '
    + 'leaks one more handler that re-parses the whole deck store on any cross-tab write',
  );
});

test('ten visits then one cross-tab save parse the store zero times, not ten', () => {
  const win = fakeWindow();
  let loads = 0;
  for (let i = 0; i < 10; i++) {
    const cleanup = mount(win, () => { loads += 1; return []; });
    cleanup();
  }
  win.dispatch('storage', { key: DECK_KEY });
  assert.equal(
    loads,
    0,
    `a deck saved in another tab ran loadDecks() ${loads} times for views that are no longer mounted`,
  );
});
