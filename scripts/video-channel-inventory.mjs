#!/usr/bin/env node
// Inventory a YouTube channel through the Data API v3: every upload and every
// playlist, with title, description, publish date, duration, the caption flag
// and the chapters written in the description. Metadata only, never media.
//
//   node --env-file=<file holding YOUTUBE_API_KEY> scripts/video-channel-inventory.mjs @dai.1387
//
// Writes data-cache/channels/<handle>.json (gitignored). Re-run it to pick up
// new uploads; scripts/map-channel-videos.mjs reads the file it writes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// '1:02:03' or '12:34' -> seconds
const clock = (s) => s.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);

/** PT1H2M3S -> 3723 */
export function isoSeconds(iso) {
  const m = String(iso || '').match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return null;
  const [, d = 0, h = 0, mi = 0, s = 0] = m.map((x) => Number(x || 0));
  return d * 86400 + h * 3600 + mi * 60 + s;
}

/**
 * Timestamps that open a description line. `youtube` says whether YouTube
 * itself draws them as chapters (first at 0:00, three or more, ascending);
 * lines that fail that rule are still kept, as the owner's own pointers.
 */
export function parseChapters(description) {
  const chapters = [];
  for (const line of String(description || '').split(/\r?\n/)) {
    const m = line.match(/^\s*[[(]?((?:\d{1,2}:)?\d{1,2}:\d{2})[\])]?\s*[-–—:|.]?\s*(.*?)\s*$/);
    if (m) chapters.push({ start: clock(m[1]), title: m[2] });
  }
  const youtube = chapters.length >= 3 && chapters[0].start === 0
    && chapters.every((c, i) => i === 0 || c.start > chapters[i - 1].start);
  return { chapters, youtube };
}

async function api(endpoint, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set('key', process.env.YOUTUBE_API_KEY);
  const res = await fetch(url);
  // Never print the URL: it carries the key.
  if (!res.ok) throw new Error(`${endpoint} answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

async function every(endpoint, params) {
  const items = [];
  let pageToken = '';
  do {
    const page = await api(endpoint, { ...params, maxResults: 50, ...(pageToken && { pageToken }) });
    items.push(...(page.items || []));
    pageToken = page.nextPageToken || '';
  } while (pageToken);
  return items;
}

async function main() {
  const handle = process.argv[2];
  if (!handle?.startsWith('@')) throw new Error('usage: video-channel-inventory.mjs @handle');
  if (!process.env.YOUTUBE_API_KEY) throw new Error('YOUTUBE_API_KEY is not set');

  const [channel] = (await api('channels', { part: 'snippet,contentDetails,statistics', forHandle: handle })).items || [];
  if (!channel) throw new Error(`no channel answers to ${handle}`);

  // The API lists a channel's PUBLIC playlists and uploads only. A channel that
  // publishes unlisted (this one: 0 public videos on 2026-11-01) is reachable
  // only through playlist links someone shared, so the known links seed the
  // walk: every list= in src/data/videos.js plus --playlist=ID arguments.
  // Completeness beyond those links is the owner's to confirm.
  const listed = await every('playlists', { part: 'snippet,contentDetails,status', channelId: channel.id });
  const known = new Set([
    ...fs.readFileSync(path.join(ROOT, 'src/data/videos.js'), 'utf8').matchAll(/list=([\w-]+)/g),
  ].map((m) => m[1]).concat(process.argv.slice(3).filter((a) => a.startsWith('--playlist=')).map((a) => a.slice(11))));
  listed.forEach((p) => known.delete(p.id));
  const looked = [];
  for (const id of known) looked.push(...((await api('playlists', { part: 'snippet,contentDetails,status', id })).items || []));
  const playlists = [...listed, ...looked].filter((p) => p.snippet.channelId === channel.id);

  const memberOf = {};
  for (const p of playlists) {
    // A playlist the API lists but will not open (404) is recorded, not fatal.
    const items = await every('playlistItems', { part: 'snippet,contentDetails', playlistId: p.id })
      .catch((e) => { p.unreadable = e.message.slice(0, 80); return []; });
    p.videoIds = items.map((it) => it.contentDetails.videoId);
    items.forEach((it) => (memberOf[it.contentDetails.videoId] ||= []).push({ id: p.id, position: it.snippet.position }));
  }
  const ids = Object.keys(memberOf);
  const videos = [];
  for (let i = 0; i < ids.length; i += 50) {
    const page = await api('videos', { part: 'snippet,contentDetails,status', id: ids.slice(i, i + 50).join(',') });
    videos.push(...page.items);
  }

  const out = {
    fetchedAt: new Date().toISOString(),
    source: 'YouTube Data API v3 (channels, playlistItems, videos, playlists)',
    channel: { id: channel.id, handle, title: channel.snippet.title, description: channel.snippet.description, videoCount: Number(channel.statistics.videoCount) },
    playlists: playlists.map((p) => ({ id: p.id, title: p.snippet.title, description: p.snippet.description, publishedAt: p.snippet.publishedAt, privacy: p.status.privacyStatus, itemCount: p.contentDetails.itemCount, videoIds: p.videoIds, ...(p.unreadable && { unreadable: p.unreadable }) })),
    videos: videos.map((v) => ({
      id: v.id,
      // A playlist may hold another channel's video; it is kept and marked.
      channelId: v.snippet.channelId,
      channelTitle: v.snippet.channelTitle,
      title: v.snippet.title,
      description: v.snippet.description,
      publishedAt: v.snippet.publishedAt,
      durationSec: isoSeconds(v.contentDetails.duration),
      ownerCaptions: v.contentDetails.caption === 'true',
      audioLanguage: v.snippet.defaultAudioLanguage || null,
      embeddable: v.status.embeddable,
      privacy: v.status.privacyStatus,
      tags: v.snippet.tags || [],
      ...parseChapters(v.snippet.description),
      playlists: memberOf[v.id] || [],
    })),
    // In a playlist but not answered by videos.list: deleted or private.
    unavailable: ids.filter((id) => !videos.some((v) => v.id === id)),
  };
  const file = path.join(ROOT, 'data-cache', 'channels', `${handle.slice(1)}.json`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(out, null, 2));
  const foreign = out.videos.filter((v) => v.channelId !== channel.id).length;
  console.log(`${out.playlists.length} playlists (${listed.length} listed publicly), ${out.videos.length} videos (${foreign} from other channels), ${out.unavailable.length} unavailable; channel's public count ${out.channel.videoCount} -> ${path.relative(ROOT, file)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e.message); process.exit(1); });
