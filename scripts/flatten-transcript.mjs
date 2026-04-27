#!/usr/bin/env node
/**
 * Read one transcript JSON cache file and emit a flat
 * timestamp-prefixed text suitable for human/LLM reading.
 *
 *   node scripts/flatten-transcript.mjs <videoId>
 *
 * Output goes to stdout. Pipe to file if needed:
 *   node scripts/flatten-transcript.mjs pewBPGWFqoo > /tmp/ibd.txt
 */
import fs from 'node:fs';
import path from 'node:path';

const videoId = process.argv[2];
if (!videoId) {
  console.error('Usage: node scripts/flatten-transcript.mjs <videoId>');
  process.exit(1);
}

const file = path.resolve('data-cache', 'transcripts', `${videoId}.json`);
if (!fs.existsSync(file)) {
  console.error('Not found:', file);
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

console.log(`# ${data.title}`);
console.log(`# subject=${data.subject}  duration=${Math.round(data.duration / 60)}min  segments=${data.segments.length}`);
console.log('');

// Group segments into ~30-second chunks for compact reading.
const CHUNK_SEC = 30;
let curStart = -1;
let curEnd = -1;
let curText = [];

function flush() {
  if (curText.length === 0) return;
  const m = Math.floor(curStart / 60);
  const s = curStart % 60;
  const stamp = `[${m}:${String(s).padStart(2, '0')}]`;
  console.log(`${stamp} ${curText.join(' ').replace(/\s+/g, ' ').trim()}`);
  curText = [];
}

for (const seg of data.segments) {
  if (curStart < 0) curStart = seg.start;
  if (seg.start - curStart >= CHUNK_SEC) {
    flush();
    curStart = seg.start;
  }
  curText.push(seg.text);
  curEnd = seg.start + seg.dur;
}
flush();
