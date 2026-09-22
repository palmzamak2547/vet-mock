#!/usr/bin/env node
// ============================================================
// report-source-conflicts.mjs — does a question teach a side already rejected?
// ============================================================
// src/data/source-conflicts.js records where a senior compilation and the
// cohort's recording disagree, and which side a question may teach. This
// reads what each question in that subject teaches (the keyed option, a true
// statement, a model answer, the explanation) and lists the ones that state
// the rejected side.
//
// Report-only: it prints and exits 0. With --strict it exits 1 on any hit,
// for use as a gate once a few ingests have shown it raises no false alarms
// (an explanation that names the wrong side in order to refute it would be
// one).
//
// Usage: node scripts/report-source-conflicts.mjs [--strict]
// ============================================================
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { bankFiles, readBank } from './lib/bank-file.mjs';

/** The text a question asserts as correct. */
export function keyedText(q) {
  const parts = [];
  const type = q.type || 'mcq';
  if (type === 'tf') {
    if (q.answer === true) parts.push(q.q);
  } else if (type === 'match') {
    for (const p of q.pairs || []) parts.push(`${p.left} ${p.right}`);
  } else if (type === 'fill') {
    parts.push(q.q, ...(q.blanks || []));
  } else if (type === 'short' || type === 'essay') {
    parts.push(q.model_answer, ...(q.keywords || []));
  } else if (Array.isArray(q.options)) {
    for (const k of [].concat(q.answer)) if (Number.isInteger(k) && q.options[k] != null) parts.push(q.options[k]);
  }
  parts.push(q.explain, q.why);
  return parts.filter((p) => typeof p === 'string' && p.trim()).join('\n');
}

/** Every (question, conflict) pair where the question states the rejected side. */
export function conflictHits(questions, conflicts) {
  const hits = [];
  for (const c of conflicts) {
    for (const q of questions) {
      if (q.subject !== c.subject) continue;
      const text = keyedText(q);
      const group = c.rejected.find((g) => g.every((re) => re.test(text)));
      if (group) hits.push({ conflict: c.id, subject: q.subject, id: q.id, verdict: c.verdict });
    }
  }
  return hits;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const { SOURCE_CONFLICTS } = await import(pathToFileURL(path.join(root, 'src/data/source-conflicts.js')).href);
  const questions = [];
  for (const file of bankFiles(path.join(root, 'src/data'))) questions.push(...(await readBank(file)).questions);
  const hits = conflictHits(questions, SOURCE_CONFLICTS);
  console.log(`${SOURCE_CONFLICTS.length} recorded source conflicts checked against ${questions.length} questions`);
  for (const h of hits) console.log(`  ${h.subject}#${h.id} states the rejected side of ${h.conflict}: ${h.verdict}`);
  console.log(hits.length ? `${hits.length} question(s) to review` : 'no question states a rejected side');
  if (hits.length && process.argv.includes('--strict')) process.exit(1);
}
