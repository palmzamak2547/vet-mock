#!/usr/bin/env node
/**
 * fetch-video-transcripts.mjs
 *
 * เครื่องมือดึง YouTube transcript จาก playlist ที่ระบุไว้ใน
 * src/data/videos.js · ใช้ youtubei.js (Innertube) — ไม่ต้องใช้ API key
 *
 * Output:
 *   data-cache/transcripts/{videoId}.json
 *     { videoId, title, duration, playlistId, language,
 *       segments: [{ start: <sec>, dur: <sec>, text }] }
 *   data-cache/index.json
 *     { fetchedAt, playlists: { [playlistId]: { title, videos: [...] } } }
 *
 * Usage:
 *   node scripts/fetch-video-transcripts.mjs                  # ทุก playlist ที่ list
 *   node scripts/fetch-video-transcripts.mjs --playlist=com3  # เฉพาะ subject
 *   node scripts/fetch-video-transcripts.mjs --limit=3        # ดึง 3 คลิปแรกพอ (test)
 *   node scripts/fetch-video-transcripts.mjs --force          # re-fetch ของเดิมด้วย
 *
 * หมายเหตุ:
 *   • YouTube auto-caption คุณภาพแปรผัน — ศัพท์แพทย์ Thai มัก
 *     mistranscribe · summary downstream ต้อง mark เตือน
 *   • ถ้าคลิปไม่มี caption เลย script จะ skip + log warning
 */

import { Innertube } from 'youtubei.js';
import { YoutubeTranscript } from 'youtube-transcript';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(ROOT, 'data-cache');
const TRANSCRIPT_DIR = path.join(CACHE_DIR, 'transcripts');
const INDEX_FILE = path.join(CACHE_DIR, 'index.json');

// ─────────────────────────────────────────────────────────────────
// CLI args
// ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const subjectFilter = args.find((a) => a.startsWith('--playlist='))?.split('=')[1] || null;
const limitArg = args.find((a) => a.startsWith('--limit='))?.split('=')[1];
const limit = limitArg ? Number(limitArg) : Infinity;
const force = args.includes('--force');

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function extractPlaylistId(url) {
  const m = url.match(/[?&]list=([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

function shortDur(s) {
  if (!s || isNaN(s)) return '';
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────────
// Read VIDEO_LIBRARY (just for playlist URLs)
// ─────────────────────────────────────────────────────────────────
async function readVideoLibrary() {
  const file = path.join(ROOT, 'src', 'data', 'videos.js');
  const mod = await import(pathToFileURL(file).href);
  return mod.VIDEO_LIBRARY || [];
}

// ─────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────
async function main() {
  ensureDir(CACHE_DIR);
  ensureDir(TRANSCRIPT_DIR);

  console.log('🎥 VetMock video transcript fetcher\n');
  console.log('   Initializing youtubei.js (Innertube)...');
  const yt = await Innertube.create({ retrieve_player: false });

  const lib = await readVideoLibrary();

  // Build a map of playlists to fetch (one entry per unique playlistId)
  const playlistsToFetch = new Map();
  for (const v of lib) {
    if (subjectFilter && v.subject !== subjectFilter) continue;
    const pid = extractPlaylistId(v.url);
    if (!pid) continue;
    if (!playlistsToFetch.has(pid)) {
      playlistsToFetch.set(pid, { subject: v.subject, topic: v.topic, url: v.url });
    }
  }

  if (playlistsToFetch.size === 0) {
    console.log('⚠️   No playlists matched filter. Check --playlist= value.');
    return;
  }

  console.log(`   Found ${playlistsToFetch.size} unique playlist(s) to fetch.\n`);

  // Load existing index (resume mode)
  let masterIndex = { fetchedAt: null, playlists: {} };
  if (fs.existsSync(INDEX_FILE)) {
    try {
      masterIndex = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
    } catch {}
  }

  let totalNewTranscripts = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const [playlistId, meta] of playlistsToFetch) {
    console.log(`📺 [${meta.subject}] ${meta.topic}`);
    console.log(`   playlist=${playlistId}`);

    let playlist;
    try {
      playlist = await yt.getPlaylist(playlistId);
    } catch (e) {
      console.log(`   ❌ Could not load playlist: ${e.message}\n`);
      totalFailed++;
      continue;
    }

    const items = playlist.videos || [];
    console.log(`   ${items.length} video(s) in playlist`);

    const playlistEntry = masterIndex.playlists[playlistId] || {
      subject: meta.subject,
      topic: meta.topic,
      title: playlist.info?.title || meta.topic,
      videos: [],
    };
    playlistEntry.subject = meta.subject;
    playlistEntry.topic = meta.topic;
    playlistEntry.title = playlist.info?.title || meta.topic;

    // Track existing videoIds in entry
    const knownIds = new Set(playlistEntry.videos.map((v) => v.videoId));

    let count = 0;
    for (const item of items) {
      if (count >= limit) break;
      count++;

      const videoId = item.id;
      if (!videoId) continue;

      const cachePath = path.join(TRANSCRIPT_DIR, `${videoId}.json`);
      if (!force && fs.existsSync(cachePath)) {
        totalSkipped++;
        if (!knownIds.has(videoId)) {
          // already on disk but missing from index — repair
          const cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
          playlistEntry.videos.push({
            videoId,
            title: cached.title,
            duration: cached.duration,
            language: cached.language,
            hasTranscript: (cached.segments?.length || 0) > 0,
            charCount: (cached.segments || []).reduce((a, s) => a + (s.text?.length || 0), 0),
          });
        }
        continue;
      }

      const title = item.title?.text || item.title || '(no title)';
      const durSec = item.duration?.seconds || null;

      let segments = [];
      let language = null;

      // Use youtube-transcript package (more reliable than youtubei.js's
      // getTranscript which often returns 400 because the signed URL token
      // expires before we can replay it).
      try {
        // Try Thai first (auto-caption ของ Aj. มักเป็น Thai)
        let raw = null;
        try {
          raw = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'th' });
          language = 'th';
        } catch {
          // Fall back to whatever language is available
          raw = await YoutubeTranscript.fetchTranscript(videoId);
          language = raw?.[0]?.lang || 'auto';
        }
        segments = (raw || []).map((s) => ({
          start: Math.round((s.offset || 0) / 1000),
          dur: Math.round((s.duration || 0) / 1000),
          text: (s.text || '').replace(/\s+/g, ' ').trim(),
        })).filter((s) => s.text);
      } catch (e) {
        console.log(`   ⚠️  ${videoId} (${title.slice(0, 40)}) — ${e.message?.slice(0, 60)}`);
        totalFailed++;
        continue;
      }

      if (segments.length === 0) {
        console.log(`   ⚠️  ${videoId} (${title.slice(0, 40)}) — no transcript`);
        totalFailed++;
        continue;
      }

      const charCount = segments.reduce((a, s) => a + s.text.length, 0);
      const cached = {
        videoId,
        playlistId,
        subject: meta.subject,
        title,
        duration: durSec,
        language,
        segments,
      };

      fs.writeFileSync(cachePath, JSON.stringify(cached, null, 2));
      console.log(`   ✓ ${videoId} ${shortDur(durSec).padStart(6)} [${segments.length}seg/${charCount}ch] ${title.slice(0, 50)}`);
      totalNewTranscripts++;

      // Update index entry
      const existingIdx = playlistEntry.videos.findIndex((v) => v.videoId === videoId);
      const entry = {
        videoId,
        title,
        duration: durSec,
        language,
        hasTranscript: true,
        charCount,
      };
      if (existingIdx >= 0) playlistEntry.videos[existingIdx] = entry;
      else playlistEntry.videos.push(entry);
    }

    masterIndex.playlists[playlistId] = playlistEntry;
    console.log('');
  }

  masterIndex.fetchedAt = new Date().toISOString();
  fs.writeFileSync(INDEX_FILE, JSON.stringify(masterIndex, null, 2));

  console.log('───────────────────────────────────────────');
  console.log(`✓ ${totalNewTranscripts} new transcript(s) fetched`);
  console.log(`↻ ${totalSkipped} cached (skipped)`);
  console.log(`⚠ ${totalFailed} failed (no caption / locked / error)`);
  console.log(`\nIndex: ${path.relative(ROOT, INDEX_FILE)}`);
  console.log(`Transcripts: ${path.relative(ROOT, TRANSCRIPT_DIR)}/`);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
