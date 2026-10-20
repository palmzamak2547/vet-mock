import test from 'node:test';
import assert from 'node:assert/strict';
import { isChunkLoadError } from '../../src/lib/chunk-error.js';

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
