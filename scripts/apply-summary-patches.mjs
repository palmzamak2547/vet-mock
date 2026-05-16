#!/usr/bin/env node
// ============================================================
// apply-summary-patches.mjs — merge agent-generated summary rewrites
// ============================================================
//
// Agents write JSON patches to `tmp/vmx-patches/*.json`. Each patch
// entry: { videoId, newSummary }. This script locates each videoId in
// `src/data/video-summaries.js` and replaces ONLY the summary
// template-literal contents (not the wrapping field structure).
//
// Why this indirection: 4 parallel agents Edit()-ing the same file
// would race. JSON patches → sequential apply = safe + parallel.
// ============================================================

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'src', 'data', 'video-summaries.js');
const PATCH_DIR = join(__dirname, '..', 'tmp', 'vmx-patches');

// Locate `videoId: '<id>'` (or `<id>:` / `"<id>":` as the entry KEY)
// then walk forward to its `summary: ` template literal and rewrite
// just the literal content. Robust to multi-line, escapes, nested
// backticks (which are rare in markdown but possible).
function patchOne(content, videoId, newSummary) {
  // Anchor on the entry key — appears as `<id>: {` at top-level of
  // VIDEO_SUMMARIES map. videoIds may be bare (alphanumeric only) or
  // quoted (hyphen-containing). Accept all 3 forms.
  const idEsc = videoId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keyRe = new RegExp(`(^|\\n)(\\s{2,4})(?:${idEsc}|'${idEsc}'|"${idEsc}"):\\s*\\{`);
  const km = keyRe.exec(content);
  if (!km) return { ok: false, reason: 'key-not-found' };

  // From the match, find the next `summary: \`` opener.
  const fromIdx = km.index + km[0].length;
  const sumStart = content.indexOf('summary: `', fromIdx);
  if (sumStart < 0 || sumStart > fromIdx + 800) {
    // 800 chars = sanity bound for the videoId-to-summary distance
    // (videoId/title/subject/date/durationMin/instructor/examFormat fields)
    return { ok: false, reason: 'summary-marker-missing' };
  }

  // Find the closing backtick of the template literal. Skip escaped
  // backticks `\``. Backticks inside nested ${...} blocks are rare in
  // markdown summary content; not handled.
  const bodyStart = sumStart + 'summary: `'.length;
  let i = bodyStart;
  while (i < content.length) {
    if (content[i] === '\\') { i += 2; continue; }
    if (content[i] === '`') break;
    i++;
  }
  if (i >= content.length) return { ok: false, reason: 'unterminated-template' };
  const bodyEnd = i;

  // Splice: keep everything up to bodyStart + replace body + keep rest.
  // newSummary is RAW markdown — escape JS template-literal terminators
  // (backslash, backtick, ${ interpolation start) so the spliced source
  // still parses. Agents sometimes return triple-backtick fences inside
  // their markdown, which would otherwise close the outer template literal
  // and break the bundle (build error: "Unexpected character" at the
  // unescaped ` line). Escape order: backslashes FIRST so we don't
  // double-escape the slashes we add for the backticks.
  const escaped = newSummary
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
  const before = content.slice(0, bodyStart);
  const after = content.slice(bodyEnd);
  return { ok: true, content: before + escaped + after };
}

// ── main ──
let content = readFileSync(FILE, 'utf8');
const patchFiles = readdirSync(PATCH_DIR).filter((f) => f.endsWith('.json'));

let applied = 0, failed = 0;
const failures = [];
let totalEntries = 0;

for (const f of patchFiles) {
  const raw = JSON.parse(readFileSync(join(PATCH_DIR, f), 'utf8'));
  // Accept either a bare array (agents A/B/C) or a wrapper object
  // `{patches: [...]}` (agent D shape). Both are valid; normalize here.
  const entries = Array.isArray(raw) ? raw : (Array.isArray(raw?.patches) ? raw.patches : []);
  totalEntries += entries.length;
  for (const { videoId, newSummary } of entries) {
    const result = patchOne(content, videoId, newSummary);
    if (result.ok) {
      content = result.content;
      applied++;
    } else {
      failed++;
      failures.push({ videoId, reason: result.reason, agent: f });
    }
  }
}

writeFileSync(FILE, content, 'utf8');

console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`SUMMARY PATCHES APPLIED`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`Patch files:  ${patchFiles.length}`);
console.log(`Entries:      ${totalEntries}`);
console.log(`Applied:      ${applied}`);
console.log(`Failed:       ${failed}`);
if (failures.length > 0) {
  console.log('');
  console.log('Failures (videoId · reason · agent):');
  for (const f of failures) console.log(`  ${f.videoId.padEnd(20)} ${f.reason.padEnd(28)} ${f.agent}`);
}
process.exit(failed > 0 ? 1 : 0);
