#!/usr/bin/env node
// Our own copy of every video a channel in src/data/video-channels.js
// uploaded: fetch it, cut its slide frames, transcribe it when YouTube has no
// captions, store it in R2 (private), then free the disk. One video at a
// time, so a nearly full disk is enough; resumable from the manifest.
//
//   node --env-file=<.r2env> scripts/video-media.mjs [--only=id,id] [--limit=N] [--keep]
//
// Reads data-cache/channels/*.json (scripts/video-channel-inventory.mjs).
// Writes C:/dev/vetmock-video-data/<id>/ (captions, frames.json) and
// data-cache/channels/media-manifest.json: { id: { key, bytes, sha256,
// durationSec, captions: 'youtube'|'asr', frames, at } | { error, at } }.
// R2 keys: videos/<id>/video.mp4, captions.th.json3, frames.json, frames/f<t>.webp.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { presign, tokenKeyEnv } from '../api/_lib/r2.js';
import { VIDEO_CHANNELS } from '../src/data/video-channels.js';
import { SUBJECTS_BY_YEAR } from '../src/data/curriculum.js';
import { VIDEO_LIBRARY } from '../src/data/videos.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = process.env.VIDEO_DATA_DIR || 'C:/dev/vetmock-video-data';
// The video scripts' working state (gitignored); VIDEO_CACHE_DIR moves it out of the checkout.
export const CACHE = process.env.VIDEO_CACHE_DIR || path.join(ROOT, 'data-cache');
const MANIFEST = path.join(CACHE, 'channels/media-manifest.json');
// Every lane shares this machine's disk: a run stops before it leaves less than this free.
const MIN_FREE = Number(process.env.VIDEO_MIN_FREE_GB || 20) * 1e9;

export async function s3Env() {
  const env = await tokenKeyEnv(process.env);
  if (!env) throw new Error('the Cloudflare token did not verify');
  return env;
}

export async function put(env, key, file, type) {
  return putBuffer(env, key, fs.readFileSync(file), type);
}

export async function putBuffer(env, key, body, type) {
  // A dropped connection on a 600 MB upload is ordinary: three tries, waiting longer each time.
  let res = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // A stalled connection must not hold the run: two minutes plus a second per megabyte.
      res = await fetch(presign(key, { method: 'PUT', env, expiresIn: 3600 }), { method: 'PUT', body, headers: { 'content-type': type }, signal: AbortSignal.timeout(Math.round(120000 + body.length / 1000)) });
      if (res.ok) break;
    } catch (e) {
      if (attempt === 3) throw e;
    }
    await new Promise((r) => setTimeout(r, attempt * 15000));
  }
  if (!res?.ok) throw new Error(`PUT ${key} answered ${res?.status}`);
  // identity: a compressible type (JSON) otherwise comes back without a length.
  const head = await fetch(presign(key, { method: 'HEAD', env }), { method: 'HEAD', headers: { 'accept-encoding': 'identity' } });
  if (Number(head.headers.get('content-length')) !== body.length) throw new Error(`${key}: stored ${head.headers.get('content-length')} bytes, sent ${body.length}`);
  return body;
}

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024, ...opts }).toString();

// A course whose own topics are empty borrows its family's: Surgery Lab II's
// student clips include Lab I's dental block.
const FAMILY = { surg1: ['surg1', 'surg2', 'surg3'], surg2: ['surg1', 'surg2', 'surg3'], surg3: ['surg1', 'surg2', 'surg3'], repro: ['repro-lect', 'repro'] };

/**
 * Every video the pipeline takes (its uploader is in VIDEO_CHANNELS), with the
 * subjects its playlists are filed under, Year 5 first (the cohort's papers
 * are nearest), newest first within a year. Shared by video-media.mjs and
 * video-pipeline.mjs so both walk the same list.
 */
export function takenVideos() {
  const yearOf = new Map(Object.entries(SUBJECTS_BY_YEAR).flatMap(([y, ss]) => ss.map((s) => [s.id, Number(y)])));
  const filed = new Map();
  for (const v of VIDEO_LIBRARY) {
    const id = String(v.url).match(/list=([\w-]+)/)?.[1];
    if (id) filed.set(id, [...new Set([...(filed.get(id) || []), ...(FAMILY[v.subject] || [v.subject])])]);
  }
  const videos = [];
  // Inventories are named by handle (dai.1387.json); the pipeline's own files are not inventories.
  for (const f of fs.readdirSync(path.join(CACHE, 'channels')).filter((x) => x.endsWith('.json') && !/^(media-manifest|registry-review)/.test(x))) {
    const inv = JSON.parse(fs.readFileSync(path.join(CACHE, 'channels', f), 'utf8'));
    for (const v of inv.videos || []) {
      if (!VIDEO_CHANNELS[v.channelId] || videos.some((x) => x.id === v.id)) continue;
      const subjects = [...new Set(v.playlists.flatMap((p) => filed.get(p.id) || []))];
      videos.push({ ...v, subjects, year: Math.max(0, ...subjects.map((s) => yearOf.get(s) || 0)) });
    }
  }
  return videos.sort((a, b) => b.year - a.year || b.publishedAt.localeCompare(a.publishedAt));
}

async function main() {
  const args = process.argv.slice(2);
  const only = new Set((args.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean));
  const limit = Number((args.find((a) => a.startsWith('--limit=')) || '').slice(8)) || Infinity;
  const keep = args.includes('--keep');
  // --shard=k/n: this process takes every n-th video from the k-th; each
  // shard keeps its own manifest file, read together, so none overwrites another.
  const [shard, shards] = ((args.find((a) => a.startsWith('--shard=')) || '').slice(8) || '0/1').split('/').map(Number);
  const mine = shards > 1 ? MANIFEST.replace(/\.json$/, `.${shard}.json`) : MANIFEST;
  const dir0 = path.dirname(MANIFEST);
  const manifest = {};
  for (const f of fs.readdirSync(dir0).filter((x) => /^media-manifest(\.\d+)?\.json$/.test(x))) Object.assign(manifest, JSON.parse(fs.readFileSync(path.join(dir0, f), 'utf8')));
  const own = fs.existsSync(mine) ? JSON.parse(fs.readFileSync(mine, 'utf8')) : {};
  const save = () => fs.writeFileSync(mine, JSON.stringify(own, null, 1));

  const videos = takenVideos();
  const todo = videos.filter((v, i) => i % shards === shard && (!only.size || only.has(v.id)) && !manifest[v.id]?.key).slice(0, limit);
  console.log(`${videos.length} videos taken, ${videos.length - todo.length} done or skipped, ${todo.length} to do`);
  const env = await s3Env();

  for (const v of todo) {
    const dir = path.join(DATA, v.id);
    fs.mkdirSync(dir, { recursive: true });
    const mp4 = path.join(dir, 'video.mp4');
    // --defer-asr: a video YouTube has no captions for waits until the Thai
    // speech model is ready (scripts/video-asr.py), instead of downloading now.
    if (args.includes('--defer-asr') && !fs.existsSync(path.join(dir, 'video.th.json3'))) continue;
    const { bavail, bsize } = fs.statfsSync(DATA);
    if (bavail * bsize < MIN_FREE) {
      console.error(`stopped: ${(bavail * bsize / 1e9).toFixed(1)} GB free on the data drive, under ${MIN_FREE / 1e9} GB`);
      process.exitCode = 2;
      break;
    }
    const t0 = Date.now();
    try {
      if (!fs.existsSync(mp4)) {
        run('yt-dlp', ['-q', '--no-progress', '--no-warnings', '-f', 'bv*[vcodec^=avc1][height<=1080]+ba[ext=m4a]/b[ext=mp4]/b',
          '--merge-output-format', 'mp4', '--postprocessor-args', 'ffmpeg:-movflags +faststart', '-o', 'video.%(ext)s',
          '--write-auto-subs', '--sub-langs', 'th', '--sub-format', 'json3', `https://www.youtube.com/watch?v=${v.id}`], { cwd: dir });
      }
      const durationSec = Math.round(Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]).trim()));
      run('python', ['-I', path.join(ROOT, 'scripts/video-frames.py'), mp4, path.join(dir, 'frames')]);
      let captions = 'youtube';
      const json3 = path.join(dir, 'video.th.json3');
      if (!fs.existsSync(json3)) {
        // No captions on YouTube: our own, on this machine's GPU.
        run('python', ['-I', path.join(ROOT, 'scripts/video-asr.py'), mp4, json3], { timeout: 3 * 3600 * 1000 });
        captions = 'asr';
      }
      const body = await put(env, `videos/${v.id}/video.mp4`, mp4, 'video/mp4');
      await put(env, `videos/${v.id}/captions.th.json3`, json3, 'application/json');
      const frames = JSON.parse(fs.readFileSync(path.join(dir, 'frames/frames.json'), 'utf8'));
      await put(env, `videos/${v.id}/frames.json`, path.join(dir, 'frames/frames.json'), 'application/json');
      for (const f of frames.frames) await put(env, `videos/${v.id}/frames/${f.file}`, path.join(dir, 'frames', f.file), 'image/webp');
      own[v.id] = manifest[v.id] = { key: `videos/${v.id}/video.mp4`, bytes: body.length, sha256: crypto.createHash('sha256').update(body).digest('hex'), durationSec, captions, frames: frames.frames.length, at: new Date().toISOString() };
      if (!keep) {
        fs.rmSync(mp4);
        for (const f of frames.frames) fs.rmSync(path.join(dir, 'frames', f.file));
      }
      console.log(`${v.id} ${Math.round(body.length / 1e6)} MB, ${durationSec} s, ${frames.frames.length} slides, ${captions}, ${Math.round((Date.now() - t0) / 1000)} s`);
    } catch (e) {
      own[v.id] = manifest[v.id] = { error: String(e.message || e).slice(0, 300), at: new Date().toISOString() };
      console.error(`${v.id} failed: ${manifest[v.id].error}`);
      if (!keep) fs.rmSync(mp4, { force: true });
    }
    save();
  }
  const done = Object.values(manifest).filter((m) => m.key);
  console.log(`done ${done.length}, ${(done.reduce((n, m) => n + m.bytes, 0) / 1e9).toFixed(1)} GB in R2; failed ${Object.values(manifest).filter((m) => m.error).length}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });
