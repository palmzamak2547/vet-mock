// ============================================================
// regen-video-meta.mjs — regenerate src/data/video-summaries-meta.js
// from src/data/video-summaries.js
//
// Why:
//   CommandPalette needs only metadata (title/subject/instructor) for
//   search; pulling in the full ~360 KB of markdown summaries just to
//   render search results blew the palette chunk up to 385 KB. The
//   meta file is ~20 KB, so the palette load is ~20× faster on cold
//   open. Run this whenever you add/edit/remove a summary so the
//   meta stays in sync.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

// Node's ESM loader on Windows rejects bare absolute paths (`c:\...`
// reads as a URL with scheme `c:`). Wrap in file:// via pathToFileURL
// so the script works on both POSIX and Windows.
const m = await import(pathToFileURL(path.join(root, 'src/data/video-summaries.js')).href);

// video-summaries.js used to export one VIDEO_SUMMARIES object. It was later
// split into per-subject files behind lazy loaders, and this script was not
// updated — so it threw on every run ("Cannot convert undefined or null to
// object") while its own header told the author to run it after every edit.
// The meta index happened to stay in sync by hand; nothing would have caught
// it if it had not.
const ALL = typeof m.loadAllVideoSummaries === 'function'
  ? await m.loadAllVideoSummaries()
  : m.VIDEO_SUMMARIES;
if (!ALL || typeof ALL !== 'object') {
  console.error('video-summaries.js exposed neither loadAllVideoSummaries() nor VIDEO_SUMMARIES');
  process.exit(1);
}

const entries = Object.entries(ALL).map(([id, v]) => {
  const { summary, ...meta } = v;
  return [id, meta];
});

let out = `// ============================================================
// VIDEO_META — lightweight index of video summaries (no full text).
// Auto-derived from video-summaries.js · used by CommandPalette /
// other consumers that only need {videoId, title, subject, date,
// durationMin, instructor, examFormat} for search/list — NOT the
// markdown body.
//
// To regenerate: run \`node scripts/regen-video-meta.mjs\`
// (DO NOT hand-edit — drift between this and video-summaries.js
//  causes subtle bugs.)
// ============================================================

export const VIDEO_META = {
`;

for (const [id, v] of entries) {
  out += `  '${id}': ${JSON.stringify(v, null, 2).split('\n').join('\n  ')},\n`;
}

out += '};\n';

const outPath = path.join(root, 'src/data/video-summaries-meta.js');

// --check compares MEANING, not bytes. The committed file and a fresh
// generation hold the same 400 entries in a different subject order (the
// per-subject split changed the merge order), and reordering 3,600 generated
// lines to satisfy a byte compare would be churn, not safety. What actually
// matters is that every summary has a meta entry and every field agrees.
if (process.argv.includes('--check') || process.env.CHECK_ONLY === '1') {
  const current = await import(pathToFileURL(outPath).href);
  const meta = current.VIDEO_META || current.default || {};
  const problems = [];
  for (const [id, v] of entries) {
    const got = meta[id];
    if (!got) { problems.push(`${id}: missing from meta (its summary badge will not show)`); continue; }
    for (const k of Object.keys(v)) {
      if (JSON.stringify(v[k]) !== JSON.stringify(got[k])) {
        problems.push(`${id}.${k}: summaries say ${JSON.stringify(v[k])}, meta says ${JSON.stringify(got[k])}`);
      }
    }
  }
  for (const id of Object.keys(meta)) {
    if (!entries.some(([e]) => e === id)) problems.push(`${id}: in meta but has no summary (badge would lie)`);
  }
  if (problems.length) {
    console.error(`✗ video meta is out of sync with the summaries (${problems.length}):`);
    for (const p of problems.slice(0, 20)) console.error('   ' + p);
    process.exit(1);
  }
  console.log(`✅ video meta in sync — ${entries.length} entries, every field agrees.`);
  process.exit(0);
}

fs.writeFileSync(outPath, out, 'utf8');
console.log(`✓ wrote ${entries.length} entries · ${(out.length / 1024).toFixed(1)} KB → ${outPath}`);
