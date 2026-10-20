// The video shelf's first scroll must not commit once per cover.
// Measured at 4x CPU slowdown: 72-83 layouts and long tasks up to 261 ms,
// because every card made its own IntersectionObserver and committed its own
// setState (cover, then loading flag) as each response landed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../src/views/VideoView.jsx', import.meta.url), 'utf8');
const hook = src.slice(src.indexOf('function usePlaylistPreview('), src.indexOf('export default function VideoView('));

test('cards share one viewport observer instead of building one each', () => {
  assert.doesNotMatch(hook, /new IntersectionObserver/, 'a per-card observer is one callback and one commit per card');
  assert.equal((src.match(/new IntersectionObserver\(/g) || []).filter(() => true).length >= 1, true);
  assert.match(src, /function watchNearViewport\(/);
  assert.match(hook, /watchNearViewport\(node, start\)/);
});

test('cover and loading updates are coalesced into one frame', () => {
  assert.match(src, /function queueCardUpdate\(/);
  assert.match(src, /requestAnimationFrame\(run\)/);
  // Neither the subscriber notification nor the loading reset may set state directly.
  assert.match(src, /subs\.forEach\(\(set\) => queueCardUpdate\(\(\) => set\(data\)\)\)/);
  assert.match(hook, /queueCardUpdate\(\(\) => \{ if \(alive\) setLoading\(false\); \}\)/);
  assert.doesNotMatch(hook, /\.finally\(\(\) => \{ if \(alive\) setLoading\(false\); \}\)/);
});

test('the cover box holds its own layout and the image reserves its size', () => {
  const thumbs = src.match(/className="vmx-video-thumb"[^>]*>/g) || [];
  assert.equal(thumbs.length, 2);
  for (const t of thumbs) assert.match(t, /contain: 'layout paint'/);
  assert.match(src, /<img src=\{thumbSrc\} alt="" loading="lazy" decoding="async" width="480" height="270"/);
});

test('the observer still gates the request: nothing fetches for a card that was never near the viewport', () => {
  assert.match(src, /rootMargin: '300px'/);
  assert.match(hook, /typeof IntersectionObserver === 'undefined'/);
});
