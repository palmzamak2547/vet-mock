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

const entries = Object.entries(m.VIDEO_SUMMARIES).map(([id, v]) => {
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
fs.writeFileSync(outPath, out, 'utf8');
console.log(`✓ wrote ${entries.length} entries · ${(out.length / 1024).toFixed(1)} KB → ${outPath}`);
