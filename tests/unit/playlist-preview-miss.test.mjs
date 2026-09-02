// ============================================================
// Playlist cover misses are remembered — source contracts
// ============================================================
// Only successful, non-empty cover answers used to be cached, so a playlist
// that no longer exists was requested again on every card mount and every
// scroll-in. Production saw one reader generate 150 requests for one removed
// playlist in twenty minutes. A miss is now remembered too: half an hour when
// YouTube (or the server, about the playlist itself) says there is nothing
// to show, ninety seconds for a transient failure.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../src/views/VideoView.jsx', import.meta.url), 'utf8');

test('a remembered miss short-circuits both the fetch and the viewport gate', () => {
  const fetchStart = src.indexOf('function fetchPreview(');
  const fetchEnd = src.indexOf('function usePlaylistPreview(');
  const fetchBody = src.slice(fetchStart, fetchEnd);
  assert.ok(fetchStart > 0 && fetchEnd > fetchStart);
  // Miss check runs before the in-flight dedupe and therefore before any request.
  const missAt = fetchBody.indexOf('if (previewMissedUntil(playlistId)) return Promise.resolve(null);');
  const inflightAt = fetchBody.indexOf('if (INFLIGHT.has(playlistId)) return INFLIGHT.get(playlistId);');
  assert.ok(missAt >= 0 && inflightAt > missAt, 'the miss check must precede the request path');
  // The hook neither subscribes nor spins for a remembered miss.
  const hookBody = src.slice(fetchEnd, src.indexOf('export default function VideoView('));
  assert.match(hookBody, /if \(cached\) \{ setPreview\(cached\); return undefined; \}[\s\S]{0,240}if \(previewMissedUntil\(playlistId\)\) return undefined;/);
});

test('gone playlists rest for half an hour, transient failures for ninety seconds', () => {
  assert.match(src, /const MISS_TTL_GONE = 30 \* 60 \* 1000;/);
  assert.match(src, /const MISS_TTL_SOFT = 90 \* 1000;/);
  assert.match(src, /const gone = r\.status === 404\s*\|\| \(r\.ok && \(json\?\.reason === 'multi_channel' \|\| json\?\.reason === 'empty_playlist'\)\);/);
  assert.match(src, /rememberPreviewMiss\(playlistId, gone \? MISS_TTL_GONE : MISS_TTL_SOFT\);/);
  // A thrown fetch (offline, aborted) is transient, never a 30-minute sentence.
  assert.match(src, /\.catch\(\(\) => \{ rememberPreviewMiss\(playlistId, MISS_TTL_SOFT\); return null; \}\)/);
  // The miss survives a reload but never masquerades as a cover.
  assert.match(src, /localStorage\.setItem\('vmx-pl-miss-' \+ playlistId, String\(until\)\)/);
  assert.doesNotMatch(src, /PLAYLIST_PREVIEW_CACHE\.set\(playlistId, null\)/);
});

test('a successful cover is still cached exactly as before', () => {
  assert.match(src, /PLAYLIST_PREVIEW_CACHE\.set\(playlistId, data\);/);
  assert.match(src, /window\.localStorage\.setItem\('vmx-pl-preview-' \+ playlistId, JSON\.stringify\(\{ data, cachedAt: Date\.now\(\) \}\)\);/);
});
