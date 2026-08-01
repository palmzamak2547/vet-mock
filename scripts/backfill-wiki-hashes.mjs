#!/usr/bin/env node
// ============================================================
// backfill-wiki-hashes.mjs — stamp contentHash onto every question wikiRef
// ============================================================
// Usage:
//   node scripts/backfill-wiki-hashes.mjs           # report only
//   node scripts/backfill-wiki-hashes.mjs --write   # edit the question files
//
// wiki/SCHEMA.md §3 rule 5 made contentHash optional "ใน Phase 1", so every
// wikiRef shipped without one and the validator emitted a warning per ref.
// That left the citation link unable to notice the thing it exists to notice:
// a wiki section being edited out from under the questions that cite it.
//
// This stamps the current hash of each cited section onto the ref. From then
// on validate-wiki errors when a section's content no longer matches, naming
// the questions that need re-checking.
//
// Stamping a hash asserts only "this ref pointed at THIS text at stamp time".
// It is not a review and does not touch status or mappingStatus.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sectionContentHash } from './lib/wiki-section-hash.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const WIKI_DIR = path.join(ROOT, 'wiki');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const WRITE = process.argv.includes('--write') || process.env.BACKFILL_WRITE === '1';

/** pageId -> full markdown, read from every wiki/**\/*.md with a frontmatter id */
function loadPages() {
  const pages = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(p); continue; }
      if (!entry.name.endsWith('.md')) continue;
      const content = fs.readFileSync(p, 'utf8');
      const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!fm) continue;
      const id = fm[1].match(/^id:\s*(.+)$/m)?.[1]?.trim();
      if (id) pages.set(id, content);
    }
  };
  walk(WIKI_DIR);
  return pages;
}

const pages = loadPages();
console.log(`Loaded ${pages.size} wiki pages.`);

// Match one ref object inside a wikiRefs array, anchored on pageId/anchorId
// rather than trying to parse JS.
//
// Two styles exist in the corpus and both must be handled — questions-com5.js
// writes quoted JSON keys ("pageId": "..."), questions-exotic.js writes plain
// JS keys with single quotes (pageId: '...'). Matching only one style would
// have silently backfilled half the refs and reported success.
const REF_RE = /\{\s*"?pageId"?\s*:\s*['"]([^'"]+)['"]\s*,\s*"?anchorId"?\s*:\s*['"]([^'"]+)['"][\s\S]*?\}/g;

let totalRefs = 0, stamped = 0, alreadyHad = 0, unresolved = [];
const changedFiles = [];

for (const file of fs.readdirSync(DATA_DIR)) {
  if (!file.startsWith('questions-') || !file.endsWith('.js')) continue;
  const full = path.join(DATA_DIR, file);
  const original = fs.readFileSync(full, 'utf8');
  if (!original.includes('wikiRefs')) continue;

  let fileStamped = 0;
  const updated = original.replace(REF_RE, (block, pageId, anchorId) => {
    totalRefs++;
    if (/"?contentHash"?\s*:/.test(block)) { alreadyHad++; return block; }

    const content = pages.get(pageId);
    if (!content) { unresolved.push(`${file}: unknown pageId '${pageId}'`); return block; }

    const hash = sectionContentHash(content, anchorId);
    if (!hash) { unresolved.push(`${file}: '${pageId}#${anchorId}' has no resolvable section body`); return block; }

    // Insert as a sibling key, matching the block's own indentation and its
    // key-quoting style so the file stays internally consistent.
    const indent = block.match(/\n(\s*)"?anchorId"?/)?.[1] ?? '  ';
    const quotedKeys = /"anchorId"/.test(block);
    const key = quotedKeys ? '"contentHash"' : 'contentHash';
    const val = quotedKeys ? `"${hash}"` : `'${hash}'`;
    const out = block.replace(/(\n\s*"?anchorId"?\s*:\s*['"][^'"]+['"]\s*,?)/, `$1\n${indent}${key}: ${val},`);
    if (out === block) { unresolved.push(`${file}: could not splice contentHash into '${pageId}#${anchorId}'`); return block; }
    stamped++; fileStamped++;
    return out;
  });

  if (fileStamped > 0) {
    changedFiles.push(`${file} (+${fileStamped})`);
    if (WRITE) fs.writeFileSync(full, updated);
  }
}

console.log(`\nwikiRefs seen        : ${totalRefs}`);
console.log(`already had a hash   : ${alreadyHad}`);
console.log(`stamped              : ${stamped}`);
console.log(`unresolved           : ${unresolved.length}`);
for (const u of unresolved.slice(0, 20)) console.log(`   - ${u}`);
if (changedFiles.length) console.log(`\nfiles: ${changedFiles.join(', ')}`);
console.log(WRITE ? '\n✅ written' : '\n(dry run — pass --write to apply)');

if (unresolved.length) process.exitCode = 1;
