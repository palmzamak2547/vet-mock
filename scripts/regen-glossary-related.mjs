#!/usr/bin/env node
/**
 * regen-glossary-related.mjs
 *
 * The term card offers "ข้อที่เกี่ยวข้อง N ข้อ". That N used to be
 * counted at render time against `QB` — the array of questions the
 * session happens to have loaded so far. Open the card early and N is
 * small; open the same card after browsing two more subjects and N is
 * bigger. Same term, same bank, different number, and the student has
 * no way to tell which one was true.
 *
 * So the index is built here, once, against the whole bank, and the
 * runtime only reads it. A term's related questions are also filtered
 * to the entry's own scope: the poultry IBD card lists poultry
 * questions, the small-animal IBD card lists small-animal ones.
 * One leaf per entry, subject and topic (scripts/lib/glossary-related-leaves.mjs),
 * so pull requests in different topics merge by themselves.
 *
 * Usage:  node scripts/regen-glossary-related.mjs
 *         node scripts/regen-glossary-related.mjs --check   (CI)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderGlossaryRelated } from './lib/glossary-related-leaves.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'data', 'glossary-related.generated.js');
const checkOnly = process.argv.includes('--check');

const load = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href);
const { GLOSSARY, entryKey, getAllSearchableStrings } = await load('src/data/glossary.js');
const { BANK_REGISTRY } = await load('src/data/bank-registry.generated.js');
// The delivery gate is the only thing standing between a student and an
// unverified key; a card link that bypasses the exam pool must apply it too.
const { isQuestionDeliverable } = await load('src/data/question-delivery.generated.js');

const questions = [];
for (const entry of BANK_REGISTRY) for (const q of await entry.load()) questions.push(q);

const { questionTopicId } = await load('src/lib/question-metadata.js');

const { text: json, entries, links: total } = renderGlossaryRelated(GLOSSARY, questions, {
  entryKey,
  searchableStrings: getAllSearchableStrings,
  isQuestionDeliverable,
  questionTopicId,
});

if (checkOnly) {
  const lf = (s) => s.split('\r\n').join('\n');
  const current = fs.existsSync(OUT) ? lf(fs.readFileSync(OUT, 'utf8')) : '';
  if (current !== lf(json)) {
    console.error('✗ src/data/glossary-related.generated.js is stale — run: node scripts/regen-glossary-related.mjs');
    process.exit(1);
  }
  console.log(`✓ ${entries} glossary entries indexed, ${total} question links`);
} else {
  fs.writeFileSync(OUT, json, 'utf8');
  console.log(`✓ wrote ${entries} entries / ${total} links → ${path.relative(ROOT, OUT)}`);
}
