#!/usr/bin/env node
// ============================================================
// media-registry.mjs: one registry of every picture a question or a note shows
// ============================================================
// Usage:
//   node scripts/media-registry.mjs            write the registry and the two size modules (npm run regen:media)
//   node scripts/media-registry.mjs --check    fail on drift or on anything the lint holds (npm run lint:media)
//
// Pictures used to be found in eight places by eight readers, and none knew a
// picture's size, so each one moved the page as it loaded. This walks the
// question banks (image, imagePath, explainImage) and the slide-figure map
// against public/figures and public/images, and writes:
//
//   src/data/media-registry.generated.json       path, width, height, bytes, hash, kind, what shows it
//   src/data/media-sizes.generated.js            question figures' sizes, loaded with the banks
//   src/data/slide-image-sizes.generated.js      deck figures' sizes, loaded with the slide-figure map
//
// --check fails on (scripts/lib/media.mjs holds the rules, docs/MEDIA.md the guide):
//   missing        a picture something shows that is not under public/
//   unreferenced   a file in a governed folder that nothing shows
//   same picture   byte-identical files of one kind, bar SAME_BYTES_ALLOWED
//   too heavy      a question image over QUESTION_IMAGE_MAX_BYTES
//   file name      a question figure whose file name names the key
//   wrong folder   a figure outside its kind's folders, or shown by both kinds
//   drift          a generated file that is not what this script writes today
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { BANK_REGISTRY } from '../src/data/bank-registry.generated.js';
import { SLIDE_IMAGES } from '../src/data/slide-images.generated.js';
import { sameGenerated } from './lib/same-generated.mjs';
import { buildRegistry, lintMedia, questionSizesText, registryText, slideSizesText } from './lib/media.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

const OUT = {
  registry: 'src/data/media-registry.generated.json',
  questionSizes: 'src/data/media-sizes.generated.js',
  slideSizes: 'src/data/slide-image-sizes.generated.js',
};

const questions = [];
for (const bank of BANK_REGISTRY) for (const q of await bank.load()) questions.push(q);

const built = await buildRegistry({ publicDir: path.join(ROOT, 'public'), root: ROOT, questions, slideMap: SLIDE_IMAGES });
const errors = [...built.problems, ...lintMedia({ entries: built.entries, questions })];

const fresh = {
  registry: registryText(built),
  questionSizes: questionSizesText(built),
  slideSizes: slideSizesText(built),
};

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;
const { totals } = JSON.parse(fresh.registry);
const line = Object.entries(totals).map(([kind, t]) => `${kind} ${t.files} file(s) ${mb(t.bytes)}${t.inline ? ` and ${t.inline} inline` : ''}`).join(', ');

if (CHECK) {
  for (const [key, file] of Object.entries(OUT)) {
    const abs = path.join(ROOT, file);
    const current = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
    if (!sameGenerated(current, fresh[key])) errors.push(`drift: ${file} is not what the pictures and the data say today; run npm run regen:media`);
  }
} else {
  for (const [key, file] of Object.entries(OUT)) fs.writeFileSync(path.join(ROOT, file), fresh[key]);
}

if (errors.length) {
  for (const e of errors.slice(0, 80)) console.error(`✗ ${e}`);
  if (errors.length > 80) console.error(`  ... and ${errors.length - 80} more`);
  console.error(`\n${errors.length} media problem(s). ${line}`);
  process.exit(1);
}
console.log(`✓ media registry ${CHECK ? 'holds' : 'written'}: ${line}`);
