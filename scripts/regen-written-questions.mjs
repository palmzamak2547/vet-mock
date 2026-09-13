#!/usr/bin/env node
/**
 * regen-written-questions.mjs
 *
 * The grading endpoint used to take the question, the model answer and the
 * rubric from whatever the browser sent it. That makes it a general-purpose
 * language model behind Palm's API key: anyone who reads the network tab can
 * post their own "model answer" and have it answer anything, and the daily
 * provider budget is shared, so burning it takes grading away from every real
 * student that day.
 *
 * There are only a few dozen written questions in the whole corpus, so the
 * server can simply hold them. The client sends a question id and the
 * student's answer; everything else is looked up here. The endpoint then
 * cannot grade anything that is not one of these questions.
 *
 * Usage:  node scripts/regen-written-questions.mjs
 *         node scripts/regen-written-questions.mjs --check   (CI)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'api', '_lib', 'written-questions.generated.json');
const checkOnly = process.argv.includes('--check');

const { BANK_REGISTRY } = await import(pathToFileURL(path.join(ROOT, 'src/data/bank-registry.generated.js')).href);

const written = {};
for (const entry of BANK_REGISTRY) {
  for (const q of await entry.load()) {
    if (q.type !== 'short' && q.type !== 'essay') continue;
    written[q.id] = {
      type: q.type,
      q: q.q || '',
      model_answer: q.model_answer || '',
      rubric: q.rubric || '',
      // Only the engprof reading questions carry a passage, and the grader
      // needs it to judge paraphrasing.
      ...(q.passage ? { passage: q.passage } : {}),
      ...(q.target_words ? { target_words: q.target_words } : {}),
      ...(q.soft_max_words ? { soft_max_words: q.soft_max_words } : {}),
      ...(q.hard_max_words ? { hard_max_words: q.hard_max_words } : {}),
    };
  }
}

const json = JSON.stringify(written, null, 1) + '\n';
const ids = Object.keys(written);
const gradeable = ids.filter((id) => written[id].model_answer);

if (checkOnly) {
  // Compare content, not line endings. Git hands this file back with CRLF on a
  // Windows checkout while the generator writes LF, and a real failure signal
  // spent on an invisible difference is worse than no signal — the video
  // summary pipeline learned the same lesson the hard way.
  const lf = (s) => s.split('\r\n').join('\n');
  const current = fs.existsSync(OUT) ? lf(fs.readFileSync(OUT, 'utf8')) : '';
  if (current !== lf(json)) {
    console.error('✗ api/_lib/written-questions.generated.json is stale — run: node scripts/regen-written-questions.mjs');
    process.exit(1);
  }
  console.log(`✓ ${ids.length} written question(s), ${gradeable.length} with a model answer`);
} else {
  fs.writeFileSync(OUT, json, 'utf8');
  console.log(`✓ wrote ${ids.length} written question(s) (${gradeable.length} gradeable) → ${path.relative(ROOT, OUT)} (${Math.round(json.length / 1024)} KB)`);
}
