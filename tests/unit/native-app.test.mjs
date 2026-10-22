import test from 'node:test';
import assert from 'node:assert/strict';

// src/lib/native-app.js runs first in main.jsx. Inside the Android app it replaces browser objects the WebView
// leaves empty or read-only; an assignment to a read-only one throws in a module and would stop the page starting.
test('inside the app, the bridge installs over read-only browser objects and the page still starts', async () => {
  const calls = [];
  const listeners = [];
  const win = {
    Capacitor: {
      isNativePlatform: () => true,
      getPlatform: () => 'android',
      nativePromise: (plugin, method, options) => { calls.push([plugin, method, options]); return Promise.resolve({ languages: ['th-TH', 'en-US'], state: 'prompt' }); },
      addListener: (plugin, event, cb) => { listeners.push([plugin, event, cb]); return { remove() {} }; },
    },
    matchMedia: (q) => ({ matches: false, media: q }),
  };
  // As in the WebView: speechSynthesis exists, read-only, with no voices.
  Object.defineProperty(win, 'speechSynthesis', { get: () => ({ getVoices: () => [] }), configurable: true });
  const root = { firstElementChild: {} };
  globalThis.window = win;
  Object.defineProperty(globalThis, 'navigator', { value: {}, configurable: true, writable: true });
  globalThis.document = {
    getElementById: () => root,
    documentElement: { getAttribute: () => 'light' },
    addEventListener() {},
    visibilityState: 'visible',
  };
  globalThis.localStorage = { getItem: () => null };
  globalThis.MutationObserver = class { observe() {} disconnect() {} };
  globalThis.requestAnimationFrame = (fn) => fn();

  await import('../../src/lib/native-app.js');

  assert.equal(typeof win.VetMockApp?.haptic, 'function', 'window.VetMockApp is defined');
  assert.equal(win.VetMockApp.haptic('correct'), true);
  assert.equal(typeof win.speechSynthesis.speak, 'function', "Android's voices replace the WebView's empty speechSynthesis");
  assert.equal(typeof navigator.share, 'function');
  assert.equal(win.matchMedia('(display-mode: standalone)').matches, true);
  assert.equal(win.matchMedia('(prefers-color-scheme: dark)').matches, false);
  assert.ok(calls.some(([, method]) => method === 'ready'), 'the first paint is reported, so the splash can go');
  assert.ok(calls.some(([, method, o]) => method === 'haptic' && o.kind === 'correct'));
  assert.ok(listeners.some(([plugin, event]) => plugin === 'VetMock' && event === 'speech'));
});
