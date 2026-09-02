#!/usr/bin/env node
// ============================================================
// regen-q-counts.mjs — regenerate src/data/q-counts.js
// ============================================================
// Why this file exists:
//   HomeView / YearSelectView / ScheduleView only need to KNOW how many
//   Qs each subject has — they don't render any Q content. Statically
//   importing the full QB barrel just to count length pulls every
//   per-subject chunk into the entry's load graph (~2 MB of Q data
//   on the home screen).
//
//   This script reads every questions-*.js file, counts the entries,
//   and emits a small `q-counts.js` metadata module with the
//   precomputed numbers. Lazy callers can import that single file
//   instead of QB and the heavy chunks stay deferred.
//
// Usage:
//   node scripts/regen-q-counts.mjs
//   (regen:q-counts in package.json runs the same thing; lint:curriculum
//    then FAILS if the checked-in counts disagree with a live recount)
//
// Output is checked into git — re-run whenever Q content changes.
// CI step verifies via lint-q-counts.mjs that the counts still match.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

// Use the QB barrel as the source of truth — it's the same array
// every consumer sees today. Importing through file:// URL because
// Windows ESM rejects bare absolute paths.
const m = await import(pathToFileURL(path.join(root, 'src/data/questions.js')).href);
const curM = await import(pathToFileURL(path.join(root, 'src/data/curriculum.js')).href);
const metadataM = await import(pathToFileURL(path.join(root, 'src/lib/question-metadata.js')).href);
const predictionM = await import(pathToFileURL(path.join(root, 'src/lib/question-prediction.js')).href);
const deliveryM = await import(pathToFileURL(path.join(root, 'src/data/question-delivery.generated.js')).href);
const { QB, loadQB } = m;
const { SUBJECTS } = curM;
const { UNASSIGNED_TOPIC, isPastPaperQuestion, questionTopicId } = metadataM;
const { isCurrentScopeQuestion, isHighPredictionQuestion } = predictionM;
const { isQuestionDeliverable } = deliveryM;
if (!Array.isArray(QB)) throw new Error('QB import did not return an array');

// Phase 3 lazy QB rework (2026-05-17): QB exports empty until loadQB()
// resolves. Without this await the regen would emit zero counts.
await loadQB();

// Build a hidden-topic set per subject from the curriculum metadata —
// matches the `hiddenTopicIdsFor()` runtime behaviour so the
// precomputed "visible" counts stay in sync with what HomeView's
// SubjectGrid expects.
const hiddenBySubject = {};
for (const s of SUBJECTS) {
  if (!s?.id || !Array.isArray(s.topics)) continue;
  const set = new Set();
  for (const t of s.topics) if (t.hidden) set.add(t.id);
  if (set.size) hiddenBySubject[s.id] = set;
}

const incrementNested = (index, subject, topic) => {
  index[subject] ||= {};
  index[subject][topic] = (index[subject][topic] || 0) + 1;
};

// Count by subject + year + topic. Separately track "visible" counts
// that exclude hidden-topic Qs so HomeView can render subject cards
// without scanning the full QB.
const bySubject = {};
const byVisibleSubject = {};
const byYear = {};
const byVisibleYear = {};
const byTopic = {};
const byPastPaperTopic = {};
const byCurrentScopePhase = {};
const byHighPredictionPhase = {};

const incrementScopedPrediction = (index, question, subject) => {
  index[question.curriculumVersion] ||= {
    all: {},
    midterm: {},
    final: {},
    continuous: {},
  };
  const phase = index[question.curriculumVersion];
  phase.all[subject] = (phase.all[subject] || 0) + 1;
  if (question.examScope === 'both') {
    phase.midterm[subject] = (phase.midterm[subject] || 0) + 1;
    phase.final[subject] = (phase.final[subject] || 0) + 1;
  } else if (question.examScope === 'continuous') {
    phase.continuous[subject] = (phase.continuous[subject] || 0) + 1;
    phase.midterm[subject] = (phase.midterm[subject] || 0) + 1;
    phase.final[subject] = (phase.final[subject] || 0) + 1;
  } else if (phase[question.examScope]) {
    phase[question.examScope][subject] = (phase[question.examScope][subject] || 0) + 1;
  }
};
const deliverableQuestions = QB.filter(isQuestionDeliverable);
for (const q of deliverableQuestions) {
  const subj = q.subject || '__unknown__';
  const topic = questionTopicId(q);
  bySubject[subj] = (bySubject[subj] || 0) + 1;
  incrementNested(byTopic, subj, topic);
  if (isPastPaperQuestion(q)) incrementNested(byPastPaperTopic, subj, topic);
  const hidden = hiddenBySubject[subj];
  const isVisible = !hidden || !hidden.has(q.topic);
  if (isVisible) {
    byVisibleSubject[subj] = (byVisibleSubject[subj] || 0) + 1;
    if (q.curriculumVersion && isCurrentScopeQuestion(q, { curriculumVersion: q.curriculumVersion })) {
      incrementScopedPrediction(byCurrentScopePhase, q, subj);
    }
    if (q.curriculumVersion && isHighPredictionQuestion(q, { curriculumVersion: q.curriculumVersion })) {
      incrementScopedPrediction(byHighPredictionPhase, q, subj);
    }
  }
  if (Number.isFinite(q.year)) {
    byYear[q.year] = (byYear[q.year] || 0) + 1;
    if (isVisible) byVisibleYear[q.year] = (byVisibleYear[q.year] || 0) + 1;
  }
}

const lines = [];
lines.push('// ============================================================');
lines.push('// Q_COUNTS — precomputed Q-bank cardinality by subject/year/topic');
lines.push('// ============================================================');
lines.push('//');
lines.push('// AUTO-GENERATED by scripts/regen-q-counts.mjs — do NOT hand-edit.');
lines.push('// Re-run after adding/removing Qs in any questions-*.js file.');
lines.push('//');
lines.push('// Consumers (HomeView/YearSelectView/ScheduleView/etc.) import');
lines.push('// from here INSTEAD of QB so the count-only render path doesn\'t');
lines.push('// drag the full Q-bank into the home-screen load graph.');
lines.push('// ============================================================');
lines.push('');
lines.push(`export const QB_TOTAL = ${deliverableQuestions.length};`);
lines.push(`export const QB_SOURCE_TOTAL = ${QB.length};`);
lines.push(`export const QB_BLOCKED_TOTAL = ${QB.length - deliverableQuestions.length};`);
lines.push('');
lines.push('export const Q_COUNTS_BY_SUBJECT = {');
for (const k of Object.keys(bySubject).sort()) {
  lines.push(`  '${k}': ${bySubject[k]},`);
}
lines.push('};');
lines.push('');
lines.push('// Visible counts exclude hidden-topic Qs (midterm leftovers,');
lines.push('// uncertain-scope items flagged via topic.hidden in curriculum.js).');
lines.push('// HomeView SubjectGrid renders these for the per-card Q badges so');
lines.push('// the page doesn\'t need to scan the full QB at render time.');
lines.push('export const Q_VISIBLE_COUNTS_BY_SUBJECT = {');
for (const k of Object.keys(byVisibleSubject).sort()) {
  lines.push(`  '${k}': ${byVisibleSubject[k]},`);
}
lines.push('};');
lines.push('');
lines.push('export const Q_COUNTS_BY_YEAR = {');
for (const k of Object.keys(byYear).sort((a, b) => Number(a) - Number(b))) {
  lines.push(`  ${k}: ${byYear[k]},`);
}
lines.push('};');
lines.push('');
lines.push('// Visible per-year totals (hidden topics excluded). Every user-facing');
lines.push('// year total renders THIS — the raw total above counts questions the');
lines.push('// UI deliberately hides, so showing it next to per-subject cards made');
lines.push('// the same screen disagree with itself by up to 106 questions.');
lines.push('export const Q_VISIBLE_COUNTS_BY_YEAR = {');
for (const k of Object.keys(byVisibleYear).sort((a, b) => Number(a) - Number(b))) {
  lines.push(`  ${k}: ${byVisibleYear[k]},`);
}
lines.push('};');
lines.push('');
lines.push('// Per-topic metadata stays nested by subject so identical topic IDs in');
lines.push('// different subjects cannot collide. Legacy Qs without a topic are');
lines.push(`// retained under ${JSON.stringify(UNASSIGNED_TOPIC)} so nested totals remain exact.`);
lines.push('export const Q_COUNTS_BY_TOPIC = {');
for (const subject of Object.keys(byTopic).sort()) {
  lines.push(`  ${JSON.stringify(subject)}: {`);
  for (const topic of Object.keys(byTopic[subject]).sort()) {
    lines.push(`    ${JSON.stringify(topic)}: ${byTopic[subject][topic]},`);
  }
  lines.push('  },');
}
lines.push('};');
lines.push('');
lines.push('// Past-paper counts accept canonical sourceType plus legacy examOrigin');
lines.push('// or source-name conventions only when no canonical marker is present.');
lines.push('export const Q_PAST_PAPER_COUNTS_BY_TOPIC = {');
for (const subject of Object.keys(byPastPaperTopic).sort()) {
  lines.push(`  ${JSON.stringify(subject)}: {`);
  for (const topic of Object.keys(byPastPaperTopic[subject]).sort()) {
    lines.push(`    ${JSON.stringify(topic)}: ${byPastPaperTopic[subject][topic]},`);
  }
  lines.push('  },');
}
lines.push('};');
lines.push('');
lines.push('// Current-scope questions have verified answers and complete metadata');
lines.push('// for one exact curriculum version. Hidden topics are excluded.');
lines.push('export const Q_CURRENT_SCOPE_COUNTS =');
lines.push(`${JSON.stringify(byCurrentScopePhase, null, 2)};`);
lines.push('');
lines.push('// High-likelihood questions are counted only when their answer is');
lines.push('// verified and their metadata names an exact curriculum + exam scope.');
lines.push('// `all` counts each question once; `both` questions are expanded into');
lines.push('// the midterm and final views so phase-specific buttons stay truthful.');
lines.push('export const Q_HIGH_PREDICTION_COUNTS =');
lines.push(`${JSON.stringify(byHighPredictionPhase, null, 2)};`);
lines.push('');
lines.push(`// Built: ${new Date().toISOString()}`);
lines.push('');

const outPath = path.join(root, 'src/data/q-counts.js');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');

const sz = fs.statSync(outPath).size;
console.log(`✓ wrote ${deliverableQuestions.length}/${QB.length} deliverable Qs across ${Object.keys(bySubject).length} subjects → src/data/q-counts.js (${sz} bytes)`);
console.log('  Subjects:', Object.keys(bySubject).length, '· Years:', Object.keys(byYear).join(', '));
