#!/usr/bin/env node
// ============================================================
// drop-stale-citations.mjs — remove citations that do not support their question
// ============================================================
// Usage: node scripts/drop-stale-citations.mjs [--write]
//
// An audit of every question citing a corrected wiki section found five whose
// key is fine but whose citation points at a section that does not address it:
// a disinfectant question citing a virology section, a latency question citing
// a lesion-comparison section, and so on. Most of these predate the correction
// pass — editing the section is what made them visible.
//
// They are removed rather than repointed, because the sections they would need
// do not exist on those pages as separate anchors. Inventing a target would put
// the corpus back where it started: a citation that looks checkable and isn't.
// A question with no citation is honest; a question with a citation that does
// not support it is a lie the reader can only catch by clicking through.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';

const WRITE = process.argv.includes('--write');

// questionId -> the anchor to drop, and why
const STALE = [
  { file: 'src/data/questions-com5.js', id: 543, anchorId: 'virology-and-agents',
    why: 'asks which disinfectant to use; the section covers virus families and persistence, never disinfectants' },
  { file: 'src/data/questions-com5.js', id: 548, anchorId: 'supportive-treatment-protocol',
    why: 'asks about adjunctive immunotherapy; the section no longer discusses it' },
  { file: 'src/data/questions-com5.js', id: 529, anchorId: 'wsava-vpat-cat-vaccination',
    why: 'key names B. bronchiseptica, which the section does not mention' },
  { file: 'src/data/questions-com5.js', id: 606, anchorId: 'clinical-distinction-fhv-vs-fcv',
    why: 'asks about FHV-1 latency; the section compares lesions and never mentions latency or trigeminal ganglia' },
  { file: 'src/data/questions-com5.js', id: 609, anchorId: 'clinical-distinction-fhv-vs-fcv',
    why: 'decided by a numeric mortality range the section does not give' },
];

const byFile = new Map();
for (const s of STALE) {
  if (!byFile.has(s.file)) byFile.set(s.file, []);
  byFile.get(s.file).push(s);
}

let dropped = 0, missed = 0;
for (const [file, entries] of byFile) {
  const full = path.join(process.cwd(), file);
  let text = fs.readFileSync(full, 'utf8');

  for (const e of entries) {
    // Find the question object by its id, then the one wikiRef inside it whose
    // anchorId matches. Scoping to the question first is what keeps this safe:
    // the same anchorId is cited by other questions that are perfectly fine.
    const idRe = new RegExp(`\\n\\s*id:\\s*${e.id},`);
    const at = text.search(idRe);
    if (at < 0) { console.log(`  ✗ q${e.id}: not found`); missed++; continue; }

    // question object runs to the start of the next question's id
    const after = text.slice(at + 1);
    const nextId = after.search(/\n\s{2,4}\{\s*\n\s*id:\s*\d+,/);
    const block = nextId > 0 ? after.slice(0, nextId) : after;

    // the individual ref object carrying this anchorId
    const refRe = new RegExp(`\\s*\\{[^{}]*?"anchorId":\\s*"${e.anchorId}"[^{}]*?\\}\\s*,?`, 's');
    const m = block.match(refRe);
    if (!m) { console.log(`  ✗ q${e.id}: no wikiRef with anchor '${e.anchorId}'`); missed++; continue; }

    const newBlock = block.replace(refRe, '\n          ');
    text = text.slice(0, at + 1) + newBlock + (nextId > 0 ? after.slice(nextId) : '');
    console.log(`  ✓ q${e.id} drop #${e.anchorId} — ${e.why}`);
    dropped++;
  }

  // an emptied wikiRefs array is noise; remove it entirely
  text = text.replace(/\n\s*wikiRefs:\s*\[\s*\],?/g, '');

  if (WRITE) fs.writeFileSync(full, text);
}

console.log(`\ndropped: ${dropped}, not found: ${missed}`);
if (!WRITE) console.log('(dry run — pass --write to apply)');
