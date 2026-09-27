// platform-compat.js — the declared support floor (package.json: ios >= 14)
// holds for the browser APIs the app calls.
//
// vite builds for es2020 and lowers syntax only; it adds no API polyfills.
// WebKit before Safari 15.4 has no Array/String .at() and no Object.hasOwn,
// and before Safari 16 no AbortSignal.timeout. HomeView calls .at(-1) on every
// render, and exam results, groups and study history time their requests with
// AbortSignal.timeout, so on an iPhone 7 or an older iPad the home page threw
// and saves failed without a word (the error reporter itself used
// AbortSignal.timeout). Each shim below is defined only when the platform
// lacks the method, and matches the standard behaviour the app relies on.
//
// main.jsx imports this first. tests/unit/platform-compat.test.mjs checks the
// order, the shims, and that src/ calls no newer API this file does not cover.

function define(target, name, value) {
  if (typeof target[name] === 'function') return;
  Object.defineProperty(target, name, { value, configurable: true, writable: true, enumerable: false });
}

function at(index) {
  const length = this.length >>> 0;
  let n = Math.trunc(Number(index)) || 0;
  if (n < 0) n += length;
  if (n < 0 || n >= length) return undefined;
  return typeof this === 'string' ? this.charAt(n) : this[n];
}

define(Array.prototype, 'at', at);
define(String.prototype, 'at', function stringAt(index) { return at.call(String(this), index); });

define(Object, 'hasOwn', function hasOwn(object, key) {
  if (object == null) throw new TypeError('Cannot convert undefined or null to object');
  return Object.prototype.hasOwnProperty.call(Object(object), key);
});

if (typeof AbortSignal !== 'undefined' && typeof AbortController !== 'undefined') {
  define(AbortSignal, 'timeout', function timeout(ms) {
    const controller = new AbortController();
    const reason = typeof DOMException === 'function'
      ? new DOMException('The operation timed out.', 'TimeoutError')
      : Object.assign(new Error('The operation timed out.'), { name: 'TimeoutError' });
    setTimeout(() => controller.abort(reason), ms);
    return controller.signal;
  });
}
