// ============================================================
// /api/playlist — the caps have to fit the page that calls it
// ============================================================
// Measured on production 2026-08-29: opening /app/videos mounted one card per
// playlist and fired 41 requests to this endpoint inside 41 ms from a single
// IP. The per-IP cap was 30/minute, so everything past the 30th answered 429 —
// and the player rendered "playlist อาจรวมจากหลายช่อง", blaming a cause that
// had nothing to do with it. The shared daily budget (250 calls) was spent by
// roughly six cold visitors, after which every playlist degraded to an empty
// RSS answer that was then CACHED for 30 minutes with a 24-hour
// stale-while-revalidate window.
//
// These assertions tie the server's numbers to the data that drives them, so
// adding playlists to the library fails here instead of on a student's screen.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SRC = readFileSync(new URL('../../api/playlist.js', import.meta.url), 'utf8');

async function playlistCount() {
  const { VIDEO_LIBRARY, isPlaylistUrl, getPlaylistId } = await import('../../src/data/videos.js');
  return new Set(
    VIDEO_LIBRARY.filter((v) => isPlaylistUrl(v.url)).map((v) => getPlaylistId(v.url)),
  ).size;
}

test('the per-IP cap can serve one full cold load of the video shelf', async () => {
  const m = SRC.match(/rateLimit\(`playlist:\$\{ip\}`,\s*(\d+),\s*60_000\)/);
  assert.ok(m, 'per-IP rate limit call not found in api/playlist.js');
  const cap = Number(m[1]);
  const playlists = await playlistCount();
  assert.ok(
    cap >= playlists,
    `per-IP cap ${cap}/min cannot serve a shelf of ${playlists} playlists — the overflow answers 429 and the player blames the wrong cause`,
  );
});

test('the shared daily budget survives many cold visitors, not six', async () => {
  const m = SRC.match(/provider:youtube-data-api:daily',\s*(\d+),/);
  assert.ok(m, 'daily provider budget not found in api/playlist.js');
  const budget = Number(m[1]);
  const playlists = await playlistCount();
  // A cold visitor can cost at most one call per playlist. Ten such visitors in
  // a day is an ordinary morning for a cohort, so the budget must clear that.
  assert.ok(
    budget >= playlists * 10,
    `daily budget ${budget} covers only ${Math.floor(budget / playlists)} cold visits over ${playlists} playlists`,
  );
});

test('a degraded or rejected answer is never cacheable', () => {
  // Each of these paths hands back something that is NOT the truth about the
  // playlist. Caching one poisons every later visitor behind the same CDN node.
  for (const marker of [
    "reason: 'rate_limited'",
    "reason: 'bad_id'",
    "reason: 'upstream_unreachable'",
    "reason: 'playlist_not_found'",
  ]) {
    const at = SRC.indexOf(marker);
    assert.ok(at > 0, `path ${marker} missing`);
    const before = SRC.slice(Math.max(0, at - 400), at);
    assert.ok(
      before.includes("Cache-Control', 'no-store'"),
      `${marker} is returned without no-store — a cached failure locks out later visitors`,
    );
  }
  // The empty-RSS answer may only be cached when it is the genuine truth
  // (a real multi-channel playlist), never when we merely failed to reach the API.
  assert.ok(
    SRC.includes("degraded ? 'no-store' : 's-maxage=1800"),
    'the empty-RSS answer must not be cached when it came from a degraded path',
  );
});

test('the endpoint names the cause instead of letting the UI guess', () => {
  for (const reason of ['rate_limited', 'multi_channel', 'budget_exhausted', 'api_error']) {
    assert.ok(SRC.includes(reason), `no '${reason}' reason is ever reported to the client`);
  }
});

// ── A playlist that does not exist is not a server fault ──
// A removed or privatised playlist made YouTube answer plainly ("no such
// playlist") and we relayed that as 502 upstream_unreachable — untrue twice
// over, and enough to raise a 5xx error alert over one deleted link.
test('a missing playlist answers 404, not 5xx', () => {
  assert.match(
    SRC,
    /playlistMissing[\s\S]{0,400}?status\(404\)/,
    'a playlist YouTube says does not exist is still reported as a server error',
  );
  assert.ok(
    SRC.includes("reason: 'playlist_not_found'"),
    'the client cannot tell a missing playlist from an unreachable YouTube',
  );
});

