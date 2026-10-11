// ============================================================
// install-prompt.test.mjs — the install event is caught once, at boot
// ============================================================
// Chromium raises `beforeinstallprompt` once per page load. The chip used to
// listen only while it was mounted, so the profile hub's chip (mounted later,
// when the student taps โปรไฟล์) never heard it and the install row stayed
// empty on Chrome, Edge and Samsung Internet. The store under test is the
// fix: it listens from import time, keeps the event, and hands it to whoever
// asks, whenever they ask.
//
// Driven against the real module over a bare EventTarget standing in for
// `window`, because the module attaches its listeners when it is imported.
// ============================================================

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const fakeWindow = new EventTarget();
globalThis.window = fakeWindow;

const { getInstallPrompt, subscribeInstallPrompt, clearInstallPrompt } =
  await import('../../src/lib/install-prompt.js');

// What Chromium dispatches: a cancelable event carrying prompt() and userChoice.
function promptEvent() {
  const event = new Event('beforeinstallprompt', { cancelable: true });
  event.prompt = () => Promise.resolve();
  event.userChoice = Promise.resolve({ outcome: 'dismissed' });
  return event;
}

beforeEach(() => {
  clearInstallPrompt();
});

test('an event raised before any chip exists is kept, and the mini-infobar is suppressed', () => {
  assert.equal(getInstallPrompt(), null, 'nothing has been raised yet');
  const event = promptEvent();
  fakeWindow.dispatchEvent(event);
  assert.equal(event.defaultPrevented, true, 'the browser banner must be held back so the chip can offer it');
  assert.equal(getInstallPrompt(), event);
});

test('a chip mounted AFTER the event still reads it (the profile hub case)', () => {
  const event = promptEvent();
  fakeWindow.dispatchEvent(event);
  // The hub mounts now, long after the event fired. It only has to ask.
  const seen = [];
  const stop = subscribeInstallPrompt((value) => seen.push(value));
  assert.equal(getInstallPrompt(), event, 'the late reader got nothing');
  stop();
});

test('subscribers hear a new event and a clear, and stop hearing once unsubscribed', () => {
  const seen = [];
  const stop = subscribeInstallPrompt((value) => seen.push(value));
  const first = promptEvent();
  fakeWindow.dispatchEvent(first);
  assert.deepEqual(seen, [first]);

  clearInstallPrompt();
  assert.deepEqual(seen, [first, null]);

  stop();
  fakeWindow.dispatchEvent(promptEvent());
  assert.equal(seen.length, 2, 'an unsubscribed listener was still called');
});

test('the event is consumed after prompt(): clearing hides it from every reader once', () => {
  const event = promptEvent();
  fakeWindow.dispatchEvent(event);
  const seen = [];
  subscribeInstallPrompt((value) => seen.push(value));

  clearInstallPrompt();
  assert.equal(getInstallPrompt(), null, 'a spent event must not be offered again');
  assert.deepEqual(seen, [null]);

  clearInstallPrompt();
  assert.deepEqual(seen, [null], 'clearing an empty store must not notify again');
});

test('a later event replaces the stored one (Chromium re-raises it after a dismissal)', () => {
  const first = promptEvent();
  const second = promptEvent();
  fakeWindow.dispatchEvent(first);
  fakeWindow.dispatchEvent(second);
  assert.equal(getInstallPrompt(), second);
});

test('appinstalled clears the stored event', () => {
  fakeWindow.dispatchEvent(promptEvent());
  assert.ok(getInstallPrompt());
  fakeWindow.dispatchEvent(new Event('appinstalled'));
  assert.equal(getInstallPrompt(), null);
});

test('one throwing subscriber does not stop the others', () => {
  const seen = [];
  const stopBad = subscribeInstallPrompt(() => { throw new Error('boom'); });
  const stopGood = subscribeInstallPrompt((value) => seen.push(value));
  const event = promptEvent();
  fakeWindow.dispatchEvent(event);
  assert.deepEqual(seen, [event]);
  stopBad();
  stopGood();
});
