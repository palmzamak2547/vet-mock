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

// Device preference: with Mochi off, a failed illustration must not turn into
// Mochi. The preference module caches per process, so each case saves and
// restores it through its own public API.
import { saveMotionPreferences, MOTION_DEFAULTS } from '../../src/lib/motion-preferences.js';

function withPreference(patch, run) {
  const previous = { window: globalThis.window };
  globalThis.window = Object.assign(new EventTarget(), { localStorage: { getItem: () => null, setItem() {} } });
  try {
    saveMotionPreferences(patch);
    run();
  } finally {
    saveMotionPreferences({ ...MOTION_DEFAULTS });
    if (previous.window === undefined) delete globalThis.window; else globalThis.window = previous.window;
  }
}

for (const [label, patch] of [['the companion is off', { companion: false }], ['motion is off', { mode: 'off' }]]) {
  test(`artImgFallback hides a failed image instead of showing Mochi when ${label}`, () => {
    withPreference(patch, () => {
      const img = { dataset: {}, style: {}, alt: 'ชั้นหนังสือ', src: '/art/empty-states/shelf.webp' };
      artImgFallback({ currentTarget: img });
      assert.equal(img.style.display, 'none');
      assert.equal(img.src, '/art/empty-states/shelf.webp', 'the portrait is never swapped in');
      assert.equal(img.dataset.artFallback, undefined);
    });
  });
}

test('artImgFallback drops the old alt when it swaps in the portrait', () => {
  const img = { dataset: {}, style: {}, alt: 'ชั้นหนังสือที่ว่างเปล่า', src: '/art/empty-states/shelf.webp' };
  artImgFallback({ currentTarget: img });
  assert.equal(img.src, '/motion/assets/mochi.png');
  assert.equal(img.alt, '', 'a screen reader must not describe artwork that is no longer shown');
});

// The element carries the fallback state, so an <img> whose src can change
// has to remount with it (React diffs against its last prop, not the DOM).
test('the seasonal Mochi images remount when their source changes', async () => {
  const { readFileSync } = await import('node:fs');
  for (const [file, key] of [['src/views/HomeView.jsx', 'companionImg'], ['src/components/NextActionCard.jsx', 'seasonal.src']]) {
    const source = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
    const tag = source.match(/<img\b[^>]*?onError=\{artImgFallback\}[^>]*?\/>/s)?.[0] ?? '';
    assert.ok(tag.includes(`key={${key}}`), `${file}: the <img> that uses artImgFallback needs key={${key}}`);
  }
});
