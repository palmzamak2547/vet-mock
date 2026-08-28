// ============================================================
// repair-library-metadata.mjs — one-shot metadata repair, 2026-08-28
// ============================================================
// The first MyCourseVille ingest shipped 1,496 rows whose display metadata
// carried the source's dirt: HTML entities in titles ("Ca &amp; P"), stray
// backslashes in front of Thai characters, three titles that were literally
// `" title=` (listing HTML leaked into the name), descriptions that repeated
// the course label on every card, and — the one that made the shelf
// unbrowsable — `subject` left NULL, so every year rendered as "1 วิชา".
//
// This script rebuilds title / description / subject for every mirrored row
// from the SAME source of truth the ingest uses (.mcv/manifest.json) with the
// SAME cleaning functions the ingest now applies (scripts/ingest-library.mjs),
// and prints batched UPDATE statements to .mcv/repair-N.sql. Nothing else is
// touched: slug (the row's identity, possibly bookmarked), storage_key,
// checksums, sizes and terms all stay exactly as loaded.
//
// Rows are matched by slug — the catalog's unique key — via the ingest's own
// .mcv/rows.ndjson ledger (source_url → slug). Manifest entries without a
// ledger row (byte-identical duplicates, the one zero-byte file) have no DB
// row to repair and drop out of the join naturally.
//
//   node scripts/repair-library-metadata.mjs
//   → .mcv/repair-1.sql … apply each through the Supabase MCP / SQL editor.

import { readFileSync, writeFileSync } from 'node:fs';
import { cleanDisplayText, isJunkTitle, titleFromUrl, folderLabel } from './ingest-library.mjs';
import { subjectForCourse } from './mcv-manifest.mjs';

const BATCH = 150;

const manifest = JSON.parse(readFileSync('.mcv/manifest.json', 'utf8'));
const items = Array.isArray(manifest) ? manifest : manifest.items;
const slugByUrl = new Map(
  readFileSync('.mcv/rows.ndjson', 'utf8').split(String.fromCharCode(10)).filter(Boolean)
    .map((l) => JSON.parse(l)).map((r) => [r.source_url, r.slug]),
);

const q = (v) => (v == null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);

const rows = items
  .filter((it) => /^https?:\/\/mycourseville/i.test(it.url || ''))
  .map((it) => {
    const cleaned = cleanDisplayText(it.name || '');
    const title = isJunkTitle(cleaned) ? titleFromUrl(it.url) : cleaned;
    return {
      slug: slugByUrl.get(it.url),
      title,
      description: folderLabel(it.folder),
      subject: it.subject || subjectForCourse(it.courseNo),
    };
  })
  .filter((r) => r.slug && r.title);

// A file can be listed in two folders of the same course — same URL, same
// bytes, ONE catalog row. Keep the first listing so its folder becomes the
// description deterministically instead of whichever VALUES row Postgres
// happens to join last.
const seen = new Set();
const unique = rows.filter((r) => (seen.has(r.slug) ? false : (seen.add(r.slug), true)));

let n = 0;
for (let i = 0; i < unique.length; i += BATCH) {
  const values = unique.slice(i, i + BATCH)
    .map((r) => `(${q(r.slug)}, ${q(r.title)}, ${q(r.description)}, ${q(r.subject)})`)
    .join(',\n');
  const sql = `UPDATE public.library_docs AS d
SET title = v.title, description = v.description, subject = v.subject
FROM (VALUES\n${values}\n) AS v(slug, title, description, subject)
WHERE d.slug = v.slug;`;
  writeFileSync(`.mcv/repair-${++n}.sql`, sql, 'utf8');
}
console.log(`${unique.length} rows → ${n} batches (.mcv/repair-*.sql)`);
