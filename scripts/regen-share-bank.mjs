#!/usr/bin/env node
// ============================================================
// regen-share-bank.mjs — generate api/_lib/share-bank.generated.js
// ============================================================
// api/s.js answers a /s/<code> link without a database: it needs to know
// which question ids each subject really has, and the subject's name. This
// writes both, for every subject in SHARE_SUBJECTS (src/lib/share-link.js),
// as runs of consecutive ids so the function stays small, one leaf per topic
// so two pull requests in different topics merge by themselves. It also fails when
// the bank holds a subject the link format cannot name yet: append it to
// SHARE_SUBJECTS (never reorder) and run this again.
//
// Usage:  node scripts/regen-share-bank.mjs          (npm run regen:share-bank)
//         node scripts/regen-share-bank.mjs --check  (lint: fail if stale)
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sameGenerated } from './lib/same-generated.mjs';
import { renderShareBank } from './lib/share-bank-leaves.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'api/_lib/share-bank.generated.js');
const load = (rel) => import(pathToFileURL(path.join(root, rel)).href);

const { BANK_REGISTRY } = await load('src/data/bank-registry.generated.js');
const { SUBJECTS } = await load('src/data/curriculum.js');
const { SHARE_SUBJECTS } = await load('src/lib/share-link.js');
const { CUSTOM_QUESTION_ID_RANGE } = await load('src/lib/custom-question-ids.js');
// A question held back from students (question-delivery) is not opened by a link either.
const { isQuestionDeliverable } = await load('src/data/question-delivery.generated.js');

const { questionTopicId } = await load('src/lib/question-metadata.js');

const questions = [];
for (const bank of BANK_REGISTRY) {
  const mod = await load(`src/data/${bank.file}`);
  questions.push(...(mod[bank.export] || []));
}

const names = new Map(SUBJECTS.map((s) => [s.id, s.name]));
const { text: content, subjects, ids: total, runs } = renderShareBank(questions, {
  shareSubjects: SHARE_SUBJECTS,
  subjectName: (subject) => names.get(subject),
  questionTopicId,
  isQuestionDeliverable,
  customRange: CUSTOM_QUESTION_ID_RANGE,
});

const missing = [...subjects].filter((s) => !SHARE_SUBJECTS.includes(s));
if (missing.length) {
  console.error(`✗ share-bank: the bank has subjects a /s/ link cannot name: ${missing.join(', ')}`);
  console.error('  Append them to the end of SHARE_SUBJECTS in src/lib/share-link.js, then run npm run regen:share-bank.');
  process.exit(1);
}

if (process.argv.includes('--check')) {
  const cur = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
  if (!sameGenerated(cur, content)) {
    console.error('✗ share-bank: api/_lib/share-bank.generated.js is stale. Run npm run regen:share-bank.');
    process.exit(1);
  }
  console.log(`✓ share-bank: ${SHARE_SUBJECTS.length} subjects, ${total} ids in ${runs} runs`);
} else {
  fs.writeFileSync(outPath, content);
  console.log(`wrote ${path.relative(root, outPath)}: ${SHARE_SUBJECTS.length} subjects, ${total} ids in ${runs} runs, ${Math.round(content.length / 1024)} KB`);
}
