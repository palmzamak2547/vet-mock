#!/usr/bin/env node
// ============================================================
// lint-evidence.mjs — the filed slides point at real questions (docs/ANSWER-EVIDENCE.md)
// ============================================================
// src/data/evidence/<subject>.generated.js files which page of which library
// document a question's answer rests on. This checks what a machine can: every
// row names a question of that subject, a document of the file, a page, boxes
// inside the page and a hash; and loaders.generated.js lists every file.
//
// A question edited after its slide was matched no longer hashes the same,
// and a question removed or moved leaves its row behind. Both are counted,
// not failed: the card hides such a slide by itself (src/lib/evidence.js),
// and only the matching pipeline, which needs the library's files, can
// rebuild the index. Failing here would block whoever fixed a typo in a
// stem or retired a question.
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { bankFiles, readBank } from './lib/bank-file.mjs';
import { evidenceHash } from '../src/lib/evidence-hash.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'src/data/evidence');
const KINDS = new Set(['slide', 'handout', 'guideline', 'other', 'summary']);

export async function lintEvidence(dir = DIR, dataDir = path.join(ROOT, 'src/data')) {
  const problems = [];
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.generated.js') && f !== 'loaders.generated.js').sort() : [];
  const loaders = fs.existsSync(path.join(dir, 'loaders.generated.js')) ? fs.readFileSync(path.join(dir, 'loaders.generated.js'), 'utf8') : '';
  const listed = [...loaders.matchAll(/import\('\.\/([^']+)'\)/g)].map((m) => m[1]).sort();
  if (JSON.stringify(listed) !== JSON.stringify(files)) problems.push(`loaders.generated.js lists ${listed.length} files, the folder holds ${files.length}: run node scripts/evidence/build.mjs index`);

  const bank = new Map();   // "subject:id" → question
  if (files.length) {
    for (const file of bankFiles(dataDir)) for (const q of (await readBank(file)).questions) bank.set(`${q.subject}:${q.id}`, q);
  }
  let total = 0; let stale = 0; let gone = 0;
  for (const f of files) {
    const subject = f.replace('.generated.js', '');
    const { EVIDENCE } = await import(pathToFileURL(path.join(dir, f)).href);
    const docs = EVIDENCE?.docs;
    if (!Array.isArray(docs) || typeof EVIDENCE.q !== 'object') { problems.push(`${f}: not { docs, q }`); continue; }
    docs.forEach((d, i) => {
      if (!Array.isArray(d) || !/^[0-9a-f]{16}$/.test(d[0]) || typeof d[1] !== 'string' || !d[1] || typeof d[2] !== 'string' || !d[2] || !KINDS.has(d[3])) problems.push(`${f}: document ${i} is malformed`);
    });
    for (const [id, row] of Object.entries(EVIDENCE.q)) {
      total++;
      const q = bank.get(`${subject}:${id}`);
      if (!q) { gone++; continue; }   // a question removed or moved since: its row is dead weight, not a fault
      const [doc, page, w, h, boxes, hash] = Array.isArray(row) ? row : [];
      if (!docs[doc]) problems.push(`${subject}:${id}: document ${doc} is not in the file`);
      if (!Number.isInteger(page) || page < 1) problems.push(`${subject}:${id}: page ${page}`);
      if (!(w > 0 && h > 0)) problems.push(`${subject}:${id}: page size ${w}x${h}`);
      if (!/^[0-9a-f]{8}$/.test(String(hash))) problems.push(`${subject}:${id}: hash ${hash}`);
      const inside = Array.isArray(boxes) && boxes.every((b) => Array.isArray(b) && b.length === 4
        && b.every((v) => Number.isInteger(v) && v >= 0 && v <= 1000) && b[0] + b[2] <= 1003 && b[1] + b[3] <= 1003 && b[2] > 0 && b[3] > 0);
      if (!inside) problems.push(`${subject}:${id}: a highlight box lies outside the page`);
      if (hash !== evidenceHash(q)) stale++;
    }
  }
  return { problems, files: files.length, total, stale, gone };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { problems, files, total, stale, gone } = await lintEvidence();
  for (const p of problems.slice(0, 40)) console.error(`✗ ${p}`);
  if (problems.length > 40) console.error(`… and ${problems.length - 40} more`);
  console.log(`${problems.length ? '✗' : '✓'} answer evidence: ${total} slides in ${files} subjects`
    + (stale ? `; ${stale} wait to be matched again (their question changed; the card hides them)` : '')
    + (gone ? `; ${gone} name a question the bank no longer holds (dropped at the next index run)` : ''));
  if (problems.length) process.exit(1);
}
