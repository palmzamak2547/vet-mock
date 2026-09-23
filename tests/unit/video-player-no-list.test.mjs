// ============================================================
// The in-app player plays one clip; the app owns the playlist
// ============================================================
// On 23 Sep 2026 every clip of the Swine Medicine VET86 playlist showed
// "This video is unavailable" in the app while each one played on YouTube.
// Every clip was playable and embeddable on its own; YouTube refused the
// embed only when it was also handed list=PLXVS-5YCQzqk. The app already
// lists the clips and moves between them itself, so the player must be
// created for the chosen clip alone: a playlist YouTube will not embed can
// no longer take a playable clip down with it.

import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../src/views/VideoView.jsx', import.meta.url), 'utf8');

test('the YT.Player for a chosen clip is not given the playlist', () => {
  const start = src.indexOf('new YT.Player(');
  assert.ok(start > 0, 'VideoView creates a YT.Player');
  const vars = src.slice(start, src.indexOf('});', start));
  assert.match(vars, /videoId: currentVideoId/);
  assert.doesNotMatch(vars, /\blist\s*:/, 'playerVars must not carry list: a playlist YouTube refuses would block the clip');
});
