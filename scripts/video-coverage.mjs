#!/usr/bin/env node
/**
 * video-coverage.mjs
 *
 * "ทุกคลิปเรียนย้อนหลัง เอาให้ครบ และอย่าให้ซ้ำ" — this answers both halves.
 * Enumerates every video on the lecture-recording channels and diffs it
 * against the summaries we already ship, so a run can only ever add what is
 * genuinely missing.
 *
 * Both channels expose ONLY Home + Playlists (there is no Videos tab), so the
 * playlist is the unit of enumeration, not the channel feed.
 *
 * Usage: node scripts/video-coverage.mjs [out.json]
 */
import { Innertube } from 'youtubei.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.argv[2] || path.join(ROOT, 'data-cache', 'video-coverage.json');

const CHANNELS = [
  { handle: '@dai.1387', label: 'Vet 86' },
  { handle: '@dekdokvet85', label: 'Vet 85' },
];

const txt = (t) => (typeof t === 'string' ? t : t?.text ?? t?.runs?.map((r) => r.text).join('') ?? '');

// LockupView is the current shape for a playlist card; the id lives on
// content_id and the count only exists as badge text ("4 videos").
function readPlaylistCard(node) {
  const id = node?.content_id ?? node?.id;
  if (!id) return null;
  const title = txt(node?.metadata?.title) || txt(node?.title);
  const badge = node?.content_image?.primary_thumbnail?.overlays
    ?.flatMap((o) => o?.badges ?? [])
    ?.map((b) => txt(b?.text))
    ?.find((s) => /\d/.test(s || ''));
  return { id, title, listed: badge || null };
}

async function pagedPlaylists(channel) {
  const found = [];
  let page = await channel.getPlaylists();
  for (let guard = 0; page && guard < 40; guard++) {
    for (const n of page.playlists ?? []) {
      const p = readPlaylistCard(n);
      if (p) found.push(p);
    }
    if (!page.has_continuation) break;
    page = await page.getContinuation();
  }
  return found;
}

async function playlistVideos(yt, id) {
  const vids = [];
  let page = await yt.getPlaylist(id);
  for (let guard = 0; page && guard < 60; guard++) {
    for (const v of page.videos ?? []) {
      const vid = v?.id ?? v?.video_id ?? v?.content_id;
      if (vid) vids.push({ vid, title: txt(v?.title), duration: txt(v?.duration) || null });
    }
    if (!page.has_continuation) break;
    page = await page.getContinuation();
  }
  return vids;
}

const yt = await Innertube.create({ retrieve_player: false });
const report = { fetchedAt: new Date().toISOString(), channels: [], videos: {} };

for (const ch of CHANNELS) {
  const res = await yt.resolveURL(`https://www.youtube.com/${ch.handle}`);
  const channel = await yt.getChannel(res.payload.browseId);
  const playlists = await pagedPlaylists(channel);
  const rec = { ...ch, name: channel?.metadata?.title, playlists: [] };

  for (const p of playlists) {
    let videos = [];
    let error = null;
    try { videos = await playlistVideos(yt, p.id); } catch (e) { error = e.message; }
    for (const v of videos) {
      // A clip can sit in more than one playlist; key by id so it counts once.
      report.videos[v.vid] = { ...(report.videos[v.vid] || v), channel: ch.handle,
                               playlists: [...new Set([...(report.videos[v.vid]?.playlists || []), p.title])] };
    }
    rec.playlists.push({ ...p, fetched: videos.length, error });
  }
  report.channels.push(rec);
}

const meta = await import(pathToFileURL(path.join(ROOT, 'src/data/video-summaries-meta.js')).href);
const have = new Set(Object.keys(meta.VIDEO_META));
const all = Object.keys(report.videos);
report.missing = all.filter((v) => !have.has(v));
report.summarisedElsewhere = [...have].filter((v) => !report.videos[v]);

for (const c of report.channels) {
  console.log(`\n${c.label} — ${c.name} · ${c.playlists.length} playlists`);
  for (const p of c.playlists) {
    const miss = (report.videos && Object.entries(report.videos)
      .filter(([id, v]) => v.playlists?.includes(p.title) && !have.has(id)).length) || 0;
    console.log(`  ${String(p.fetched).padStart(3)} videos (listed ${p.listed ?? '?'}) · ${miss} missing · ${p.title}${p.error ? ` · ERR ${p.error}` : ''}`);
  }
}
console.log(`\ndistinct videos on channels : ${all.length}`);
console.log(`already summarised          : ${all.length - report.missing.length}`);
console.log(`MISSING a summary           : ${report.missing.length}`);
console.log(`summaries not on these two  : ${report.summarisedElsewhere.length}`);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 1));
console.log(`\nreport → ${OUT}`);
