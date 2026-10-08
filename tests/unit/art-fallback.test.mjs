import test from 'node:test';
import assert from 'node:assert/strict';

import { artImgFallback } from '../../src/lib/art-fallback.js';

// The helper mirrors Mochi.jsx's local artwork contract on plain <img>s:
// first failure swaps to the static portrait, a second failure hides the
// element. Nothing may throw when the event is malformed.
test('artImgFallback swaps a failed image to the static portrait once', () => {
  const img = { dataset: {}, style: {}, src: '/art/characters/porky.webp' };
  artImgFallback({ currentTarget: img });
  assert.equal(img.src, '/motion/assets/mochi.png');
  assert.equal(img.dataset.artFallback, '1');
  assert.notEqual(img.style.display, 'none');
});

test('artImgFallback hides the element when the fallback also fails', () => {
  const img = { dataset: { artFallback: '1' }, style: {}, src: '/motion/assets/mochi.png' };
  artImgFallback({ currentTarget: img });
  assert.equal(img.style.display, 'none');
  assert.equal(img.src, '/motion/assets/mochi.png');
});

test('artImgFallback survives a missing event or target', () => {
  assert.doesNotThrow(() => artImgFallback(undefined));
  assert.doesNotThrow(() => artImgFallback({}));
  assert.doesNotThrow(() => artImgFallback({ currentTarget: null }));
});

test('artImgFallback keeps rescuing an image that failed after a swap', () => {
  const img = { dataset: {}, style: {}, src: '/art/characters/clover.webp' };
  artImgFallback({ currentTarget: img });
  assert.equal(img.src, '/motion/assets/mochi.png');
  // A later unrelated error (same handler re-fired) must not brick the img.
  img.dataset.artFallback = '';
  artImgFallback({ currentTarget: img });
  assert.equal(img.src, '/motion/assets/mochi.png');
  assert.notEqual(img.style.display, 'none');
});
