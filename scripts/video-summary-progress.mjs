#!/usr/bin/env node
/**
 * video-summary-progress.mjs
 *
 * Which cohort recordings still have no summary.
 *
 * This job keeps getting cut in half by a rate limit, and the next session
 * then has to re-derive what shipped by reading commits. It does not have to:
 * the answer is a join between the playlists tagged `vet86` in videos.js, the
 * transcripts on disk, and the ids already present in src/data.
 *
 * A lecture counts as done only when its id is in src/data — a file sitting in
 * data-cache/generated/ is staged, not shipped, and staged is exactly the state
 * a killed run leaves behind.
 *
 * Usage: node scripts/video-summary-progress.mjs [--subject <id>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'src', 'data');
const CACHE = path.join(ROOT, 'data-cache');

const only = process.argv.includes('--subject')
  ? process.argv[process.argv.indexOf('--subject') + 1]
  : null;

const videosSrc = fs.readFileSync(path.join(DATA, 'videos.js'), 'utf8');
const playlists = new Map();
for (const block of videosSrc.match(/\{[^{}]*?\}/gs) || []) {
  if (!block.includes('vet86')) continue;
  const topic = block.match(/topic:\s*'([^']+)'/);
  const list = block.match(/list=([A-Za-z0-9_-]+)/);
  if (topic && list) playlists.set(list[1], topic[1]);
}

const shipped = new Set();
for (const f of fs.readdirSync(DATA)) {
  if (!/^video-summaries-.+\.js$/.test(f)) continue;
  const txt = fs.readFileSync(path.join(DATA, f), 'utf8');
  for (const m of txt.matchAll(/["']?videoId["']?:\s*["']([^"']+)["']/g)) shipped.add(m[1]);
}

const staged = new Set(
  fs.existsSync(path.join(CACHE, 'generated'))
    ? fs.readdirSync(path.join(CACHE, 'generated')).map((f) => f.replace(/\.(md|json)$/, ''))
    : [],
);
const checked = new Set(
  fs.existsSync(path.join(CACHE, 'fact-checked.txt'))
    ? fs
        .readFileSync(path.join(CACHE, 'fact-checked.txt'), 'utf8')
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#'))
    : [],
);
const plain = new Set(
  fs.existsSync(path.join(CACHE, 'plain'))
    ? fs.readdirSync(path.join(CACHE, 'plain')).map((f) => f.replace(/\.txt$/, ''))
    : [],
);

const bySubject = new Map();
const tdir = path.join(CACHE, 'transcripts');
for (const f of fs.existsSync(tdir) ? fs.readdirSync(tdir) : []) {
  if (!f.endsWith('.json')) continue;
  let d;
  try {
    d = JSON.parse(fs.readFileSync(path.join(tdir, f), 'utf8'));
  } catch {
    continue;
  }
  const name = playlists.get(d.playlistId);
  if (!name) continue;
  if (!bySubject.has(name)) bySubject.set(name, []);
  bySubject.get(name).push({
    id: d.videoId,
    title: d.title || '',
    chars: (d.segments || []).reduce((n, s) => n + (s.text || '').length, 0),
  });
}

let totalTodo = 0;
const rows = [];
for (const [name, clips] of bySubject) {
  if (only && !name.toLowerCase().includes(only.toLowerCase())) continue;
  const todo = clips.filter((c) => !shipped.has(c.id));
  totalTodo += todo.length;
  rows.push({ name, clips, todo });
}
rows.sort((a, b) => a.todo.length - b.todo.length);

console.log('\nVET86 lecture summaries — shipped means the id is in src/data\n');
console.log('  done  todo  subject');
console.log('  ----  ----  -------');
for (const { name, clips, todo } of rows) {
  const mark = todo.length === 0 ? 'OK' : '  ';
  console.log(
    `${mark} ${String(clips.length - todo.length).padStart(4)}  ${String(todo.length).padStart(4)}  ${name}`,
  );
}

for (const { name, todo } of rows) {
  if (!todo.length) continue;
  console.log(`\n## ${name}`);
  for (const c of todo.sort((a, b) => a.title.localeCompare(b.title))) {
    const flags = [
      staged.has(c.id)
        ? checked.has(c.id)
          ? 'STAGED, fact-checked — ready to rebuild'
          : 'STAGED, NOT fact-checked — do not ship'
        : null,
      plain.has(c.id) ? null : 'no plain text yet',
    ].filter(Boolean);
    console.log(
      `   ${c.id}  ${String(c.chars).padStart(7)} chars  ${c.title.slice(0, 58)}${flags.length ? '   [' + flags.join(' | ') + ']' : ''}`,
    );
  }
}

console.log(`\n${totalTodo} lecture(s) still to summarise.`);
console.log('\nThis counts the transcripts already cached. The cohort keeps uploading —');
console.log('Milk Hygiene gained a sixth lecture hours after the first four shipped — so a');
console.log('subject reading 0 is only current as far as the last fetch:');
console.log('  node scripts/fetch-video-transcripts.mjs --playlist=<subject>');
if (totalTodo) {
  console.log('\nFor a subject with no plain text yet:');
  console.log('  node scripts/plain-transcripts.mjs <manifest.json>   # [{"videoId": "..."}]');
  console.log('Then write to data-cache/generated/<id>.md, fact-check it against');
  console.log('data-cache/plain/<id>.txt, and only then:');
  console.log('  node scripts/rebuild-video-summaries.mjs && npm run regen:video-meta');
  console.log('\nEdits to a staged .md after the first rebuild are ignored — an id already');
  console.log('in src/data is never overwritten. Restore those files to HEAD and rebuild.');
}
