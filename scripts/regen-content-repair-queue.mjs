#!/usr/bin/env node
// Rewrite docs/content-repair-queue.csv from the delivery gate, so the queue
// lists exactly the questions the gate holds. tests/unit/empty-state-copy.test.mjs
// fails when the two differ; run `npm run regen:delivery` to bring them together.
import fs from 'node:fs';
import { BLOCKED_QUESTIONS } from '../src/data/question-delivery.generated.js';

const rows = BLOCKED_QUESTIONS.map((b) => [b.key, b.reason, `src/data/${b.source}`].map((v) => `"${v}"`).join(','));
const text = '\uFEFF' + ['"question_key","reason","source_file"', ...rows].join('\r\n') + '\r\n';
fs.writeFileSync('docs/content-repair-queue.csv', text, 'utf8');
console.log(`wrote docs/content-repair-queue.csv: ${rows.length} rows`);
