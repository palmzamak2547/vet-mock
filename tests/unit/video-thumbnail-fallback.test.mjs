// A thumbnail that cannot load must not leave a broken image on the shelf.
//
// The ordinary failure is a video with no high-resolution still, and one retry
// at the smallest size fixes it. The failure that had nobody handling it is a
// video made private: EVERY size 404s, so the retry failed too and the row kept
// the browser's broken-image glyph, having spent a second request to get there.
// One of the cohort's own playlists has such a video today, and the students
// publish these themselves, so it will happen again.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleThumbnailError } from '../../src/data/videos.js';

const fakeImg = () => ({ dataset: {}, style: {}, src: '' });

test('the first failure retries once, at the smallest size', () => {
  const img = fakeImg();
  assert.equal(handleThumbnailError(img, 'abc123'), 'retried');
  assert.equal(img.src, 'https://img.youtube.com/vi/abc123/default.jpg');
  assert.equal(img.dataset.thumbFallback, '1');
  assert.notEqual(img.style.visibility, 'hidden', 'the retry must still be visible');
});

test('the second failure stops and hides, it does not ask again', () => {
  const img = fakeImg();
  handleThumbnailError(img, 'abc123');
  const afterRetry = img.src;
  assert.equal(handleThumbnailError(img, 'abc123'), 'hidden');
  assert.equal(img.style.visibility, 'hidden');
  assert.equal(img.src, afterRetry, 'a third request would be a third 404');
});

test('no video id means there is nothing to retry with', () => {
  const img = fakeImg();
  assert.equal(handleThumbnailError(img, undefined), 'hidden');
  assert.equal(img.style.visibility, 'hidden');
  assert.equal(img.src, '', 'never build a url out of undefined');
});

test('it survives being handed nothing', () => {
  assert.equal(handleThumbnailError(null, 'abc123'), 'ignored');
});
