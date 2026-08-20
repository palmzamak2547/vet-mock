#!/usr/bin/env node
// ============================================================
// lint-curriculum.mjs — consistency gate (Phase 1 / Architecture L5)
// ============================================================
// Asserts the 3 sources of truth AGREE so scaling to 6 years can't
// silently drift:
//   1. curriculum.js  — taxonomy (year → subject → topic)
//   2. questions-*.js — each Q's {year, subject, topic}
//   3. q-counts.js    — precomputed counts (auto-gen)
//
// ERRORS (exit 1 — block commit/CI):
//   • a question's `subject` is not in curriculum
//   • a question is missing its `subject` field
//   • q-counts.js is stale (stored count ≠ live recount)
//   • a curriculum subject flagged has_questions:true but has 0 Qs
// WARNINGS (exit 0 — surface, don't block):
//   • a question's `year` ≠ curriculum yearForSubject(subject)
//   • a question's `topic` not in its subject's curriculum topics
//   • a subject has Qs but isn't flagged has_questions:true
//
// Complements lint:ids + lint:dupes (id uniqueness) — this is the
// taxonomy/coverage/freshness layer they don't cover.
//
// Usage: node scripts/lint-curriculum.mjs   (npm run lint:curriculum)
// ============================================================

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const imp = (rel) => import(pathToFileURL(path.join(root, rel)).href);

// Utility banks that intentionally aren't pure curriculum subjects
// (cross-year licensure prep / mixed compilations). Their Qs carry a
// subject that may not map 1:1 to a curriculum subject id — allow-list
// so they warn instead of erroring. Keep this list TIGHT.
const UTILITY_SUBJECTS = new Set(['short', 'mahahon', 'termpaper']);

const qm = await imp('src/data/questions.js');
const cur = await imp('src/data/curriculum.js');
const counts = await imp('src/data/q-counts.js');
const delivery = await imp('src/data/question-delivery.generated.js');
const metadata = await imp('src/lib/question-metadata.js');

const { QB, loadQB } = qm;
const { SUBJECTS, SUBJECTS_BY_YEAR, YEARS, yearForSubject } = cur;
const { isPastPaperQuestion, questionTopicId } = metadata;
const { isQuestionDeliverable } = delivery;
if (!Array.isArray(QB)) throw new Error('QB import did not return an array');
await loadQB();

const errors = [];
const warns = [];

const subjectIds = new Set(SUBJECTS.map((s) => s.id));
const topicsBySubject = {};
for (const s of SUBJECTS) topicsBySubject[s.id] = new Set((s.topics || []).map((t) => t.id));

const orphanSubjects = new Map();
const utilitySubjects = new Map();
const yearMismatch = new Map();
const orphanTopics = new Map();
const bySubject = {};
const byYear = {};
const byTopic = {};
const byPastPaperTopic = {};
let missingFields = 0;

const incrementNested = (index, subject, topic) => {
  index[subject] ||= {};
  index[subject][topic] = (index[subject][topic] || 0) + 1;
};

for (const q of QB) {
  const subj = q.subject;
  if (!subj) { missingFields++; continue; }
  const topic = questionTopicId(q);
  if (isQuestionDeliverable(q)) {
    bySubject[subj] = (bySubject[subj] || 0) + 1;
    if (Number.isFinite(q.year)) byYear[q.year] = (byYear[q.year] || 0) + 1;
    incrementNested(byTopic, subj, topic);
    if (isPastPaperQuestion(q)) {
      incrementNested(byPastPaperTopic, subj, topic);
    }
  }

  if (!subjectIds.has(subj)) {
    if (UTILITY_SUBJECTS.has(subj)) utilitySubjects.set(subj, (utilitySubjects.get(subj) || 0) + 1);
    else orphanSubjects.set(subj, (orphanSubjects.get(subj) || 0) + 1);
    continue;
  }
  const cy = yearForSubject(subj);
  if (Number.isFinite(q.year) && cy !== undefined && q.year !== cy) {
    const k = `${subj}: Q.year=${q.year} ≠ curriculum=${cy}`;
    yearMismatch.set(k, (yearMismatch.get(k) || 0) + 1);
  }
  const tset = topicsBySubject[subj];
  if (q.topic && tset && tset.size && !tset.has(q.topic)) {
    orphanTopics.set(`${subj}/${q.topic}`, (orphanTopics.get(`${subj}/${q.topic}`) || 0) + 1);
  }
}

// ── ERRORS ──
for (const [subj, n] of [...orphanSubjects].sort((a, b) => b[1] - a[1]))
  errors.push(`subject '${subj}' on ${n} Q(s) not found in curriculum.js (add to SUBJECTS_BY_YEAR or fix the Q)`);
if (missingFields) errors.push(`${missingFields} question(s) missing a 'subject' field`);

const storedSub = counts.Q_COUNTS_BY_SUBJECT || {};
const storedYr = counts.Q_COUNTS_BY_YEAR || {};
const storedTopic = counts.Q_COUNTS_BY_TOPIC || {};
const storedPastPaperTopic = counts.Q_PAST_PAPER_COUNTS_BY_TOPIC || {};
const deliverableTotal = QB.filter(isQuestionDeliverable).length;
if (counts.QB_TOTAL !== deliverableTotal)
  errors.push(`q-counts QB_TOTAL=${counts.QB_TOTAL} but deliverable=${deliverableTotal} → run: npm run regen:q-counts`);
for (const k of new Set([...Object.keys(bySubject), ...Object.keys(storedSub)]))
  if ((bySubject[k] || 0) !== (storedSub[k] || 0))
    errors.push(`q-counts subject '${k}'=${storedSub[k] || 0} but live=${bySubject[k] || 0} → regen:q-counts`);
for (const k of new Set([...Object.keys(byYear), ...Object.keys(storedYr)]))
  if ((byYear[k] || 0) !== (storedYr[k] || 0))
    errors.push(`q-counts year ${k}=${storedYr[k] || 0} but live=${byYear[k] || 0} → regen:q-counts`);
for (const subject of new Set([...Object.keys(byTopic), ...Object.keys(storedTopic)])) {
  for (const topic of new Set([
    ...Object.keys(byTopic[subject] || {}),
    ...Object.keys(storedTopic[subject] || {}),
  ])) {
    if ((byTopic[subject]?.[topic] || 0) !== (storedTopic[subject]?.[topic] || 0)) {
      errors.push(
        `q-counts topic '${subject}/${topic}'=${storedTopic[subject]?.[topic] || 0} ` +
        `but live=${byTopic[subject]?.[topic] || 0} → regen:q-counts`,
      );
    }
  }
}
for (const subject of new Set([
  ...Object.keys(byPastPaperTopic),
  ...Object.keys(storedPastPaperTopic),
])) {
  for (const topic of new Set([
    ...Object.keys(byPastPaperTopic[subject] || {}),
    ...Object.keys(storedPastPaperTopic[subject] || {}),
  ])) {
    if ((byPastPaperTopic[subject]?.[topic] || 0) !== (storedPastPaperTopic[subject]?.[topic] || 0)) {
      errors.push(
        `q-counts past-paper topic '${subject}/${topic}'=${storedPastPaperTopic[subject]?.[topic] || 0} ` +
        `but live=${byPastPaperTopic[subject]?.[topic] || 0} → regen:q-counts`,
      );
    }
  }
}

for (const s of SUBJECTS) {
  const n = bySubject[s.id] || 0;
  if (s.has_questions && n === 0) errors.push(`subject '${s.id}' has_questions:true but 0 Qs in banks`);
  if (!s.has_questions && n > 0) warns.push(`subject '${s.id}' has ${n} Qs but no has_questions:true flag`);
  // Subject-level scaffold, same rule as the year-level one below. This gate
  // was missing until 2026-07-31, and in the gap 9 year-5 subjects kept
  // scaffold:true after their banks landed — 215 real questions rendered as
  // "รอเติมเนื้อหา" in SubjectSelectView, left out of PhaseSelectView's live
  // count, and filtered out of Race mode entirely. The flag means "no Q file
  // yet" (see the SCAFFOLD comment in curriculum.js), so a subject with
  // questions can never be scaffolded.
  if (s.scaffold && n > 0) {
    errors.push(
      `subject '${s.id}' scaffold:true but has ${n} Qs — set scaffold:false ` +
      `(scaffold:true means no Q bank; leaving it on hides the questions from the picker and Race mode)`
    );
  }
}

// Year-level scaffold flag MUST match Q presence. scaffold:true ⟺ year has
// 0 Qs. Otherwise YearSelectView either buries a LIVE year under
// "ดูชั้นปีอื่น · รอเติม" (the Y1/Y5 bug, 2026-05-31) or advertises an empty
// year as ready. Derived truth = the live recount byYear (same source the
// q-counts freshness check above already trusts).
for (const y of YEARS || []) {
  const n = byYear[y.id] || 0;
  const shouldScaffold = n === 0;
  if (!!y.scaffold !== shouldScaffold) {
    errors.push(
      `YEARS id=${y.id} (${y.label}) scaffold:${!!y.scaffold} but year has ${n} Qs — ` +
      `set scaffold:${shouldScaffold} (scaffold:true ⟺ 0 Qs, else front door mislabels the year)`
    );
  }
}

// ── WARNINGS ──
for (const [k, n] of [...yearMismatch].sort((a, b) => b[1] - a[1])) warns.push(`year mismatch — ${k} (${n} Q)`);
if (utilitySubjects.size)
  warns.push(`utility banks (not curriculum subjects): ${[...utilitySubjects].map(([s, n]) => `${s}=${n}`).join(', ')}`);
if (orphanTopics.size) {
  const total = [...orphanTopics.values()].reduce((a, b) => a + b, 0);
  warns.push(`${orphanTopics.size} topic id(s) on ${total} Q(s) not in curriculum topics (sample: ${[...orphanTopics.keys()].slice(0, 6).join(' · ')})`);
}

// ── REPORT ──
const line = '━'.repeat(60);
console.log(line);
console.log('CURRICULUM CONSISTENCY GATE  (lint:curriculum)');
console.log(line);
console.log(`QB         : ${deliverableTotal}/${QB.length} deliverable Qs · ${Object.keys(bySubject).length} subjects · years ${Object.keys(byYear).sort().join(', ')}`);
console.log(`Curriculum : ${SUBJECTS.length} subjects · years ${Object.keys(SUBJECTS_BY_YEAR).sort().join(', ')}`);
console.log('');
if (warns.length) {
  console.log(`⚠️  ${warns.length} warning(s):`);
  for (const w of warns) console.log('   • ' + w);
  console.log('');
}
if (errors.length) {
  console.log(`❌ ${errors.length} error(s):`);
  for (const e of errors) console.log('   • ' + e);
  console.log('');
  console.log(`FAIL — ${errors.length} error(s). Fix above before commit.`);
  process.exit(1);
}
console.log('✅ Clean — taxonomy ↔ questions ↔ counts all consistent.');
