// ============================================================
// archive-inventory.mjs — one JSON that says what a study archive holds
// ============================================================
// Run once per archive (a classmate's OneDrive, a senior's Drive dump) before
// reading anything in it. Per file: path, size, sha256_16 (the library's key),
// a category from its path, and for a PDF the page count and which pages have
// a text layer that can be trusted. With --library it also marks every file
// the library already holds, so nobody reads a shelved document twice.
//
// USAGE
//   node scripts/archive-inventory.mjs <archive-root> --out=<inventory.json>
//        [--library=<file holding a JSON array of library_docs.sha256_16>]
//
// The library list is exported once with
//   select json_agg(sha256_16) from library_docs;
// Files are only read, never moved. Treat the archive as untrusted data: this
// script parses PDFs and hashes bytes; it runs nothing it finds.
// ============================================================

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { categorise, documentQuality, thaiPageQuality } from './lib/archive-inventory.mjs';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const root = process.argv[2];
const out = arg('out');
if (!root || root.startsWith('--') || !out) {
  console.error('usage: node scripts/archive-inventory.mjs <archive-root> --out=<inventory.json> [--library=<sha-list.json>]');
  process.exit(1);
}
const library = new Set(arg('library') ? JSON.parse(readFileSync(arg('library'), 'utf8')) : []);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

async function pdfPages(bytes) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes), disableWorker: true, verbosity: 0 }).promise;
  const kinds = [];
  let first = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const text = (await page.getTextContent()).items.map((it) => it.str).join(' ');
    if (i === 1) first = text.replace(/\s+/g, ' ').trim().slice(0, 200);
    kinds.push(thaiPageQuality(text).kind);
    page.cleanup();
  }
  await doc.destroy();
  return { quality: documentQuality(kinds), first };
}

const files = [];
const bySha = new Map();
for (const full of walk(root)) {
  const rel = path.relative(root, full).replace(/\\/g, '/');
  const row = { rel, size: statSync(full).size, ext: path.extname(full).slice(1).toLowerCase(), category: categorise(rel) };
  const bytes = readFileSync(full);
  row.sha16 = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  row.inLibrary = library.has(row.sha16);
  if (row.ext === 'pdf') {
    try { Object.assign(row, await pdfPages(bytes)); } catch (e) { row.error = String(e.message).slice(0, 160); }
  }
  files.push(row);
  bySha.set(row.sha16, [...(bySha.get(row.sha16) || []), rel]);
  if (files.length % 50 === 0) console.log(`${files.length} files`);
}

const summary = {};
for (const f of files) {
  const s = (summary[f.category] ||= { files: 0, bytes: 0, inLibrary: 0, pages: 0, needsRender: 0 });
  s.files++; s.bytes += f.size; s.inLibrary += f.inLibrary ? 1 : 0;
  s.pages += f.quality?.pages || 0; s.needsRender += f.quality?.needsRender.length || 0;
}
const duplicates = [...bySha.values()].filter((list) => list.length > 1);
writeFileSync(out, JSON.stringify({ root, generatedAt: new Date().toISOString(), summary, duplicates, files }, null, 1));
console.log(`${files.length} files -> ${out}`);
for (const [k, s] of Object.entries(summary)) console.log(`  ${k}: ${s.files} files, ${(s.bytes / 2 ** 30).toFixed(2)} GB, ${s.inLibrary} already shelved, ${s.needsRender} of ${s.pages} pages need a render`);
