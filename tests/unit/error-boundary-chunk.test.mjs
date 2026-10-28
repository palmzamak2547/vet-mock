import test from 'node:test';
import assert from 'node:assert/strict';
import { importFresh, isChunkLoadError } from '../../src/lib/chunk-error.js';

// Every engine words a failed lazy screen differently, and Vite adds its own
// line when a screen's stylesheet cannot load. Each one must get the card
// that offers a reload, not the generic "something broke" card.
test('recognises failed lazy screens from every engine and from Vite', () => {
  for (const message of [
    'Failed to fetch dynamically imported module: https://vetmock.com/assets/LibraryView-abc.js',
    'error loading dynamically imported module: https://vetmock.com/assets/X.js',
    'Importing a module script failed.',
    'Unable to preload CSS for /assets/PomodoroView-abc.css',
    'Loading chunk 12 failed.',
  ]) assert.equal(isChunkLoadError(new Error(message)), true, message);
});

test('does not mistake an ordinary render error for a failed download', () => {
  assert.equal(isChunkLoadError(new TypeError("Cannot read properties of undefined (reading 'map')")), false);
  assert.equal(isChunkLoadError(null), false);
});

// Chromium keeps a failed import failed for the life of the page, so a retry
// once the connection is back asks for the module it named under a new query.
test('a failed download is fetched again under a fresh query, once', async () => {
  const origin = 'https://vetmock.com';
  const asked = [];
  const importer = async (href) => { asked.push(href); return { default: 'Sheet' }; };
  const failing = (message) => () => Promise.reject(new TypeError(message));

  const mod = await importFresh(failing('Failed to fetch dynamically imported module: https://vetmock.com/assets/TimetableSheet-abc.js'), { importer, origin });
  assert.equal(mod.default, 'Sheet');
  await importFresh(failing('error loading dynamically imported module: https://vetmock.com/assets/TimetableSheet-abc.js'), { importer, origin });
  await importFresh(failing('Failed to fetch dynamically imported module: http://localhost:4321/src/components/TimetableSheet.jsx?t=17'), { importer, origin: 'http://localhost:4321' });
  assert.equal(asked.length, 3);
  assert.match(asked[0], /^https:\/\/vetmock\.com\/assets\/TimetableSheet-abc\.js\?retry=\d+$/);
  assert.match(asked[2], /^http:\/\/localhost:4321\/src\/components\/TimetableSheet\.jsx\?retry=\d+$/);
  assert.notEqual(asked[0], asked[1], 'every retry is a new URL');

  // A load that works is not asked twice.
  assert.equal((await importFresh(async () => ({ default: 'ok' }), { importer, origin })).default, 'ok');
  assert.equal(asked.length, 3);
});

test('anything but a same-origin failed download keeps its first error', async () => {
  const origin = 'https://vetmock.com';
  let asked = 0;
  const importer = async () => { asked += 1; return {}; };
  const first = (message) => new TypeError(message);
  for (const err of [
    first('Importing a module script failed.'),
    first('Failed to fetch dynamically imported module: https://evil.example/assets/X.js'),
    first("Cannot read properties of undefined (reading 'map')"),
  ]) {
    await assert.rejects(importFresh(() => Promise.reject(err), { importer, origin }), (e) => e === err);
  }
  // The retry failing too reports the first failure, not the retry's.
  const err = first('Failed to fetch dynamically imported module: https://vetmock.com/assets/X.js');
  await assert.rejects(importFresh(() => Promise.reject(err), { importer: async () => { throw new Error('again'); }, origin }), (e) => e === err);
  assert.equal(asked, 0);
});
