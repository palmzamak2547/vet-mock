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
//   node scripts/regen-q-counts.mjs           (npm run regen:q-counts)
//   node scripts/regen-q-counts.mjs --check   (npm run lint:q-counts)
//
// Output is checked into git — re-run whenever Q content changes.
// --check rebuilds both modules in memory, compares every export with the
// checked-in copy (ignoring the Built line and CRLF), names the first export
// that differs and exits 1 without writing. lint:all runs it, so a push that
// moves questions between papers or kinds cannot ship stale per-paper counts
// even when every total still matches.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const CHECK = process.argv.includes('--check');

// Use the QB barrel as the source of truth — it's the same array
// every consumer sees today. Importing through file:// URL because
// Windows ESM rejects bare absolute paths.
const m = await import(pathToFileURL(path.join(root, 'src/data/questions.js')).href);
const curM = await import(pathToFileURL(path.join(root, 'src/data/curriculum.js')).href);
const metadataM = await import(pathToFileURL(path.join(root, 'src/lib/question-metadata.js')).href);
const predictionM = await import(pathToFileURL(path.join(root, 'src/lib/question-prediction.js')).href);
const deliveryM = await import(pathToFileURL(path.join(root, 'src/data/question-delivery.generated.js')).href);
const { QB, loadQB } = m;
const { SUBJECTS, semesterForSubject } = curM;
const { UNASSIGNED_TOPIC, isPastPaperQuestion, questionTopicId, panicRank } = metadataM;
const { isCurrentScopeQuestion, isHighPredictionQuestion } = predictionM;
const { isQuestionDeliverable } = deliveryM;
const { questionInScope } = await import(pathToFileURL(path.join(root, 'src/lib/exam-scope.js')).href);
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
const byPanicSubject = {};
// ...and the same count once the student has said which paper they are
// sitting. The card promises a number and the button must hand over that
// many; since buildExamPool began narrowing to the paper, one figure could
// not keep that promise for both picks (one-health printed 10, served 3).
const byPanicSubjectScope = { midterm: {}, final: {} };
// The three tables the UI prints beside a button that opens a session:
// per subject, per year, per topic. Phase-blind they promised 338 equine
// medicine questions and opened 57 — see lib/exam-scope.js.
// Keyed by the phase the student can actually pick, because that is what the
// session applies: the TERM narrows which subjects are in play and the PAPER
// narrows which of their questions are. A table that knew only the paper
// still promised year 4 1,772 questions where a midterm serves 139.
const PHASE_IDS = ['1-mid', '1-final', '2-mid', '2-final'];
const blank = () => Object.fromEntries(PHASE_IDS.map((k) => [k, {}]));
const byVisibleSubjectScope = blank();
const byYearScope = blank();
const byTopicScope = blank();
// Per-topic counts split by question kind, so a card that promises one
// format (อ.เกรียงวิชญ์: ถูกผิด 24 ข้อ) can print the number a tap will serve.
// Written to its own module: the topic screen imports it, the home screen
// does not, and the boot chunk stays the size it is.
const byTopicKindScope = blank();
// The same split over past-paper questions only, for the card's
// "ฝึกเฉพาะข้อสอบเก่า" button.
const byPastTopicKindScope = blank();
const kindOf = (q) => (q.type === 'tf' ? 'tf'
  : q.type === 'match' ? 'match'
    : (q.type === 'short' || q.type === 'essay' || q.type === 'fill') ? 'writing' : 'mcq');
// The "อิงแนวเดิม X/Y" chip divides past-paper questions by the topic's total.
// The denominator is phase-scoped, so the numerator has to be counted over the
// same set or the chip prints a ratio above 1 — pregnancy showed 15/1, 1500%.
const byPastPaperTopicScope = blank();
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
  // Mirrors questionInScope(): `both` lands in midterm AND final; continuous
  // stays in its own bucket and never inflates an exam-phase count.
  if (question.examScope === 'both') {
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
    // What Panic Mode will actually serve for this subject, counted the same
    // way the session builds it so the card's number and the set agree.
    for (const phase of PHASE_IDS) {
      const [termKey, paperKey] = phase.split('-');
      if (!questionInScope(q, paperKey === 'mid' ? 'midterm' : 'final')) continue;
      const sem = semesterForSubject(subj);
      if (sem != null && sem !== 0 && sem !== Number(termKey)) continue;
      byVisibleSubjectScope[phase][subj] = (byVisibleSubjectScope[phase][subj] || 0) + 1;
      if (q.year != null) byYearScope[phase][q.year] = (byYearScope[phase][q.year] || 0) + 1;
      incrementNested(byTopicScope[phase], subj, topic);
      byTopicKindScope[phase][subj] ||= {};
      const kinds = (byTopicKindScope[phase][subj][topic] ||= { mcq: 0, tf: 0, match: 0, writing: 0 });
      kinds[kindOf(q)] += 1;
      // A printed matching set keys its items to organisms from several
      // lectures. It is counted once, under its own topic, above; here every
      // other topic it names gets a `_matchCovers` mark so a deck cover can
      // say the set includes that disease. LecturerSets adds the mark to a
      // deck's count and leaves it out of the lecturer's whole-part sum.
      if (q.type === 'match' && Array.isArray(q.topics)) {
        for (const extra of q.topics) {
          if (extra === topic || extra === q.topic) continue;
          const row = (byTopicKindScope[phase][subj][extra] ||= { mcq: 0, tf: 0, match: 0, writing: 0 });
          row._matchCovers = (row._matchCovers || 0) + 1;
        }
      }
      if (isPastPaperQuestion(q)) {
        incrementNested(byPastPaperTopicScope[phase], subj, topic);
        byPastTopicKindScope[phase][subj] ||= {};
        const pastKinds = (byPastTopicKindScope[phase][subj][topic] ||= { mcq: 0, tf: 0, match: 0, writing: 0 });
        pastKinds[kindOf(q)] += 1;
      }
    }
    if (panicRank(q) < 2) {
      byPanicSubject[subj] = (byPanicSubject[subj] || 0) + 1;
      for (const paper of ['midterm', 'final']) {
        if (questionInScope(q, paper)) byPanicSubjectScope[paper][subj] = (byPanicSubjectScope[paper][subj] || 0) + 1;
      }
    }
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
lines.push('// What Panic Mode holds per subject: questions from a real paper plus the');
lines.push('// ones written from what a senior cohort marked, hidden topics excluded.');
lines.push('// A subject missing from this map has neither, and its Panic card falls');
lines.push('// back to the whole subject.');
lines.push('export const Q_PANIC_COUNTS_BY_SUBJECT = {');
for (const k of Object.keys(byPanicSubject).sort()) {
  lines.push(`  '${k}': ${byPanicSubject[k]},`);
}
lines.push('};');
lines.push('');
lines.push('// The same count, narrowed to one paper. A Panic card opened with a phase');
lines.push('// selected must print what that phase will actually serve — see');
lines.push('// lib/exam-scope.js. A subject absent from a paper holds nothing for it.');
lines.push('export const Q_PANIC_COUNTS_BY_SUBJECT_BY_SCOPE = {');
for (const paper of ['midterm', 'final']) {
  lines.push(`  ${paper}: {`);
  for (const k of Object.keys(byPanicSubjectScope[paper]).sort()) {
    lines.push(`    '${k}': ${byPanicSubjectScope[paper][k]},`);
  }
  lines.push('  },');
}
lines.push('};');
lines.push('');
lines.push('// What each surface may print once a paper is chosen. Every one of these');
lines.push('// sits next to a button that opens buildExamPool with the same phase, so');
lines.push('// the number and the set have to come from the same rule.');
lines.push('export const Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE = {');
for (const phase of PHASE_IDS) {
  lines.push(`  '${phase}': {`);
  for (const k of Object.keys(byVisibleSubjectScope[phase]).sort()) {
    lines.push(`    '${k}': ${byVisibleSubjectScope[phase][k]},`);
  }
  lines.push('  },');
}
lines.push('};');
lines.push('');
lines.push('export const Q_VISIBLE_COUNTS_BY_YEAR_BY_SCOPE = {');
for (const phase of PHASE_IDS) {
  lines.push(`  '${phase}': {`);
  for (const k of Object.keys(byYearScope[phase]).sort((a, b) => Number(a) - Number(b))) {
    lines.push(`    ${k}: ${byYearScope[phase][k]},`);
  }
  lines.push('  },');
}
lines.push('};');
lines.push('');
lines.push('export const Q_COUNTS_BY_TOPIC_BY_SCOPE = {');
for (const phase of PHASE_IDS) {
  lines.push(`  '${phase}': {`);
  for (const subj of Object.keys(byTopicScope[phase]).sort()) {
    lines.push(`    '${subj}': {`);
    for (const t of Object.keys(byTopicScope[phase][subj]).sort()) {
      lines.push(`      '${t}': ${byTopicScope[phase][subj][t]},`);
    }
    lines.push('    },');
  }
  lines.push('  },');
}
lines.push('};');
lines.push('');
lines.push('// Past-paper counts per topic, counted over the SAME phase-scoped set as');
lines.push('// Q_COUNTS_BY_TOPIC_BY_SCOPE so the two can be shown as a ratio.');
lines.push('export const Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE = {');
for (const phase of PHASE_IDS) {
  lines.push(`  '${phase}': {`);
  for (const subj of Object.keys(byPastPaperTopicScope[phase]).sort()) {
    lines.push(`    '${subj}': {`);
    for (const t of Object.keys(byPastPaperTopicScope[phase][subj]).sort()) {
      lines.push(`      '${t}': ${byPastPaperTopicScope[phase][subj][t]},`);
    }
    lines.push('    },');
  }
  lines.push('  },');
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
lines.push('// the midterm and final views so phase-specific buttons stay truthful;');
lines.push('// `continuous` is its own bucket and never counts toward an exam phase.');
lines.push('export const Q_HIGH_PREDICTION_COUNTS =');
lines.push(`${JSON.stringify(byHighPredictionPhase, null, 2)};`);
lines.push('');
lines.push(`// Built: ${new Date().toISOString()}`);
lines.push('');

const outPath = path.join(root, 'src/data/q-counts.js');
const countsBody = lines.join('\n');

// Per-topic, per-kind counts for the lecturer cards. Own module on purpose —
// see the comment where byTopicKindScope is declared.
const kindOut = path.join(root, 'src/data/q-kind-counts.generated.js');
const kindBody = [
  '// GENERATED by scripts/regen-q-counts.mjs — do not edit by hand.',
  '// Per-topic question counts split by kind (mcq, tf, match, writing), keyed by',
  '// the phase a student can pick and scoped by the same rule the session uses.',
  // The bank size this table was generated from; lint:curriculum compares it
  // to a live recount so a card can never print a number from a stale table.
  'export const Q_KIND_COUNTS_QB_TOTAL = ' + deliverableQuestions.length + ';',
  'export const Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE =',
  JSON.stringify(byTopicKindScope, null, 2) + ';',
  '',
  '// The same table over past-paper questions only (sourceType past-paper),',
  '// behind the "ฝึกเฉพาะข้อสอบเก่า" button on a lecturer card.',
  'export const Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE =',
  JSON.stringify(byPastTopicKindScope, null, 2) + ';',
  '',
].join('\n');

// Each `export const` from its first line to the line that ends it with `;`.
function exportBlocks(text) {
  const blocks = new Map();
  let name = null;
  let block = [];
  for (const line of text.split('\n')) {
    const m = /^export const (\w+)/.exec(line);
    if (m) { name = m[1]; block = []; }
    if (!name) continue;
    block.push(line);
    if (/;\s*$/.test(line)) { blocks.set(name, block.join('\n')); name = null; }
  }
  return blocks;
}

// null when the file on disk matches the fresh build, otherwise the first
// export that differs. Git checks these files out with CRLF on Windows while
// the generator writes LF, and the Built line changes on every run; neither
// is staleness.
function firstStaleExport(onDisk, fresh) {
  const norm = (s) => s.replace(/\r\n/g, '\n').replace(/^\/\/ Built:.*$/m, '');
  if (norm(onDisk) === norm(fresh)) return null;
  const want = exportBlocks(norm(fresh));
  const have = exportBlocks(norm(onDisk));
  for (const [name, block] of want) if (have.get(name) !== block) return name;
  for (const name of have.keys()) if (!want.has(name)) return name;
  return 'a comment line';
}

if (CHECK) {
  for (const [file, body] of [[outPath, countsBody], [kindOut, kindBody]]) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    const where = firstStaleExport(fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '', body);
    if (where) {
      console.error(`❌ ${rel} is STALE at ${where} → run: npm run regen:q-counts`);
      process.exitCode = 1;
    }
  }
  if (!process.exitCode) console.log('✅ q-counts.js and q-kind-counts.generated.js are up to date.');
} else {
  fs.writeFileSync(outPath, countsBody, 'utf8');
  const sz = fs.statSync(outPath).size;
  console.log(`✓ wrote ${deliverableQuestions.length}/${QB.length} deliverable Qs across ${Object.keys(bySubject).length} subjects → src/data/q-counts.js (${sz} bytes)`);
  console.log('  Subjects:', Object.keys(bySubject).length, '· Years:', Object.keys(byYear).join(', '));
  fs.writeFileSync(kindOut, kindBody, 'utf8');
  console.log(`✓ wrote per-kind topic counts → ${path.relative(root, kindOut)}`);
}

