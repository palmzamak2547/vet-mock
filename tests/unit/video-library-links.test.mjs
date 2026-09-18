// Every row of the video shelf must be something a student can actually open.
//
// "Mastectomy in Dog" sat there as a single-video row long after YouTube had
// taken the video down: every thumbnail size 404'd, the shelf drew a broken
// image, and a tap would have opened a dead player. It was found by watching
// the network while clicking into a playlist on production, not by reading the
// file — nothing in the data says a link has rotted.
//
// This test cannot ask YouTube (no network in unit tests, and a flaky external
// dependency is worse than the bug). What it can do is hold the shape: every
// row parses to a real playlist or video id, no duplicates, and the one class
// of row that rotted — a bare single video from an outside channel, with no
// playlist behind it to keep it alive — is gone. If one is added back, this
// says so and the person adding it can confirm it still plays.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VIDEO_LIBRARY, getVideoId, getPlaylistId, isPlaylistUrl } from '../../src/data/videos.js';

test('every shelf row resolves to a playlist or a video id', () => {
  for (const row of VIDEO_LIBRARY) {
    const id = isPlaylistUrl(row.url) ? getPlaylistId(row.url) : getVideoId(row.url);
    assert.ok(id, `unparseable url on "${row.topic}": ${row.url}`);
    assert.ok(row.subject, `row has no subject: ${row.topic}`);
  }
});

test('no subject lists the same thing twice', () => {
  // One playlist under two subjects is on purpose — the Vet Surg Lab II + III
  // recordings serve both surg2 and surg3, and a student browsing either
  // should find them. The same playlist twice under ONE subject is a paste.
  const seen = new Map();
  for (const row of VIDEO_LIBRARY) {
    const key = row.subject + '|' + (isPlaylistUrl(row.url) ? 'pl:' : 'v:')
      + (isPlaylistUrl(row.url) ? getPlaylistId(row.url) : getVideoId(row.url));
    assert.ok(!seen.has(key), `${row.subject}: "${row.topic}" duplicates "${seen.get(key)}"`);
    seen.set(key, row.topic);
  }
});

test('single-video rows are declared, not accumulated', () => {
  // A playlist row survives one of its videos being taken down; the shelf just
  // lists one fewer. A bare video row does not — it becomes a broken thumbnail
  // and a dead tap, with nothing in the repo to show it happened.
  const singles = VIDEO_LIBRARY.filter((row) => !isPlaylistUrl(row.url));
  assert.deepEqual(
    singles.map((row) => row.topic),
    [],
    'a bare single-video row was added: confirm it still plays on YouTube, then list it here',
  );
});
