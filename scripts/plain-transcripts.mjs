#!/usr/bin/env node
/**
 * plain-transcripts.mjs
 *
 * Rewrites a cached transcript as timestamped plain text for summarising.
 *
 * Auto-captions arrive as ~1000 two-word segments per lecture, and as JSON
 * that is two thirds punctuation and repeated keys — a 94 KB file carrying
 * 31 KB of speech. Whatever reads it pays for all of it, and pays again on
 * every turn that keeps it in context. Merging into ~15 second lines cuts a
 * typical lecture by two thirds and keeps the timestamps a summary needs.
 *
 * Usage: node scripts/plain-transcripts.mjs [manifest.json]
 *   manifest: JSON array of { videoId } (default: every cached transcript)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'data-cache', 'transcripts');
const OUT = path.join(ROOT, 'data-cache', 'plain');
const WINDOW_SEC = 15;

const mmss = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

function toPlain(t) {
  const lines = [];
  let buf = [];
  let start = null;
  for (const s of t.segments || []) {
    if (start === null) start = s.start || 0;
    if (s.text) buf.push(s.text);
    if ((s.start || 0) + (s.dur || 0) - start >= WINDOW_SEC) {
      if (buf.length) lines.push('[' + mmss(start) + '] ' + buf.join(' '));
      buf = [];
      start = null;
    }
  }
  if (buf.length) lines.push('[' + mmss(start || 0) + '] ' + buf.join(' '));
  return lines.join('\n');
}

const manifestPath = process.argv[2];
const ids = manifestPath
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')).map((m) => m.videoId)
  : fs.readdirSync(SRC).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));

fs.mkdirSync(OUT, { recursive: true });
let written = 0;
let srcChars = 0;
let outChars = 0;
const sizes = [];
for (const id of ids) {
  const p = path.join(SRC, id + '.json');
  if (!fs.existsSync(p)) continue;
  const raw = fs.readFileSync(p, 'utf8');
  const t = JSON.parse(raw);
  const plain = toPlain(t);
  if (plain.length < 200) continue;
  const header = '# ' + (t.title || id) + '\n' +
    '# duration: ' + Math.round((t.duration || 0) / 60) + ' min (' + (t.duration || 0) + ' s)\n' +
    '# auto-generated captions, language ' + (t.language || '?') + '\n\n';
  fs.writeFileSync(path.join(OUT, id + '.txt'), header + plain);
  written++;
  srcChars += raw.length;
  outChars += plain.length + header.length;
  sizes.push(plain.length);
}
sizes.sort((a, b) => a - b);
console.log('wrote ' + written + ' plain transcripts');
console.log('json ' + srcChars.toLocaleString() + ' chars -> plain ' + outChars.toLocaleString() +
            ' chars (' + Math.round(100 - (outChars / srcChars) * 100) + '% smaller)');
console.log('per file: median ' + (sizes[Math.floor(sizes.length / 2)] || 0).toLocaleString() +
            ', max ' + (sizes[sizes.length - 1] || 0).toLocaleString());
console.log('under 8k chars: ' + sizes.filter((s) => s < 8000).length +
            ' | 8k-40k: ' + sizes.filter((s) => s >= 8000 && s < 40000).length +
            ' | 40k+: ' + sizes.filter((s) => s >= 40000).length);
