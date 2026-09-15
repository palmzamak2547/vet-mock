#!/usr/bin/env node
/**
 * lint-exam-scope.mjs
 *
 * The midterm pile and the final pile must stay separate, and the only way
 * that survives contact with a growing bank is a gate that fails when they
 * start to mix again.
 *
 * Three of the four checks need no judgment at all, because the faculty's own
 * exam timetable settles them:
 *   1. A subject with no midterm paper may hold no midterm-scope content.
 *      (Year 5: epidemiology sits only the final. POA sits neither.)
 *   2. A subject with no final paper may hold no final-scope content.
 *   3. A subject with neither paper is 'continuous' throughout.
 * The fourth is the real work:
 *   4. Every topic of a subject that sits BOTH papers must say which one it
 *      belongs to, because that is the split a student is asking for when they
 *      tap กลางภาค. Unscoped topics are counted against a budget that may only
 *      shrink, so the gap can never quietly grow back.
 *
 * Usage:  node scripts/lint-exam-scope.mjs
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href);

const { SUBJECTS, SUBJECTS_BY_YEAR } = await load('src/data/curriculum.js');
const { EXAM_SCHEDULE } = await load('src/data/schedule.js');
const { BANK_REGISTRY } = await load('src/data/bank-registry.generated.js');
const { EXAM_SCOPES, scopeOfQuestion, scopeForTopic } = await load('src/lib/exam-scope.js');

const errors = [];
const warnings = [];
const err = (what, msg) => errors.push(`${what}: ${msg}`);
const warn = (what, msg) => warnings.push(`${what}: ${msg}`);

// ── what the faculty timetable says each subject sits ─────────────
const papers = new Map(); // subjectId -> { midterm: bool, final: bool, year }
for (const [yearKey, entries] of Object.entries(EXAM_SCHEDULE)) {
  const year = Number(String(yearKey).replace(/^y/, ''));
  for (const e of entries || []) {
    if (!e?.subject) continue;
    const rec = papers.get(e.subject) || { midterm: false, final: false, year };
    if (e.term === 'midterm') rec.midterm = true;
    if (e.term === 'final') rec.final = true;
    papers.set(e.subject, rec);
  }
}

// ── every declared scope is a real one ────────────────────────────
const VALID = new Set(EXAM_SCOPES);
for (const subject of SUBJECTS) {
  if (subject.examScope != null && !VALID.has(subject.examScope)) {
    err(subject.id, `subject examScope "${subject.examScope}" is not one of ${EXAM_SCOPES.join(', ')}`);
  }
  for (const topic of subject.topics || []) {
    if (topic.examScope != null && !VALID.has(topic.examScope)) {
      err(`${subject.id}/${topic.id}`, `topic examScope "${topic.examScope}" is not one of ${EXAM_SCOPES.join(', ')}`);
    }
  }
}

// ── a scope the timetable cannot support ──────────────────────────
// Checked on the resolved scope (question field, else topic, else subject),
// so a hand-set override cannot smuggle a question onto a paper the subject
// does not sit.
const questions = [];
for (const entry of BANK_REGISTRY) for (const q of await entry.load()) questions.push(q);

const impossible = new Map(); // subject -> {midterm:n, final:n}
for (const q of questions) {
  const scope = scopeOfQuestion(q);
  if (!scope || scope === 'both' || scope === 'continuous') continue;
  const rec = papers.get(q.subject);
  if (!rec) continue; // no timetable for this subject: nothing to contradict
  if ((scope === 'midterm' && !rec.midterm) || (scope === 'final' && !rec.final)) {
    const bucket = impossible.get(q.subject) || { midterm: 0, final: 0 };
    bucket[scope] += 1;
    impossible.set(q.subject, bucket);
  }
}
for (const [subject, bucket] of impossible) {
  const rec = papers.get(subject);
  const sits = [rec.midterm && 'midterm', rec.final && 'final'].filter(Boolean).join(' + ') || 'no written paper';
  if (bucket.midterm) err(subject, `${bucket.midterm} question(s) scoped midterm, but the faculty timetable has this subject sitting ${sits}`);
  if (bucket.final) err(subject, `${bucket.final} question(s) scoped final, but the faculty timetable has this subject sitting ${sits}`);
}

// A subject the timetable gives no paper at all is continuous, and saying so
// is what keeps its questions out of both piles.
for (const subject of SUBJECTS) {
  const rec = papers.get(subject.id);
  if (rec || !(subject.topics || []).length) continue;
  const own = questions.filter((q) => q.subject === subject.id);
  if (!own.length) continue;
  const unresolved = own.filter((q) => scopeOfQuestion(q) == null).length;
  if (unresolved) {
    warn(subject.id, `no paper in the faculty timetable and ${unresolved} question(s) with no scope — mark the subject examScope: 'continuous' if it is graded continuously`);
  }
}

// ── the split, where a subject sits both papers ───────────────────
// Only the current teaching years are held to this: a subject nobody is
// studying this year has nothing to separate yet.
const CURRENT_YEARS = [4, 5];
const currentSubjectIds = new Set(
  CURRENT_YEARS.flatMap((y) => (SUBJECTS_BY_YEAR[y] || []).map((s) => s.id)),
);

// Budget: unscoped topics in both-paper subjects of the current years. It may
// only go down. Lower it whenever a batch is mapped; never raise it.
const UNSCOPED_TOPIC_BUDGET = 0;

const unscopedTopics = [];
for (const subject of SUBJECTS) {
  if (!currentSubjectIds.has(subject.id)) continue;
  const rec = papers.get(subject.id);
  if (!rec?.midterm || !rec?.final) continue; // one paper or none: no split to make
  for (const topic of subject.topics || []) {
    if (topic.hidden) continue;
    if (!scopeForTopic(subject.id, topic.id)) unscopedTopics.push(`${subject.id}/${topic.id}`);
  }
}
if (unscopedTopics.length > UNSCOPED_TOPIC_BUDGET) {
  err('exam-scope coverage',
    `${unscopedTopics.length} topic(s) in both-paper subjects do not say which paper they sit `
    + `(budget ${UNSCOPED_TOPIC_BUDGET}). A student who picks กลางภาค gets these in the pile either way.\n`
    + `     ${unscopedTopics.slice(0, 18).join(', ')}${unscopedTopics.length > 18 ? `, +${unscopedTopics.length - 18} more` : ''}`);
} else if (unscopedTopics.length < UNSCOPED_TOPIC_BUDGET) {
  warn('exam-scope coverage', `only ${unscopedTopics.length} unscoped topic(s) left — lower UNSCOPED_TOPIC_BUDGET in ${path.basename(fileURLToPath(import.meta.url))} to ${unscopedTopics.length}`);
}

// ── what a student actually gets, per current subject ─────────────
const rows = [];
for (const id of [...currentSubjectIds].sort()) {
  const own = questions.filter((q) => q.subject === id);
  if (!own.length) continue;
  const t = { midterm: 0, final: 0, both: 0, continuous: 0, unknown: 0 };
  for (const q of own) { const s = scopeOfQuestion(q); t[s == null ? 'unknown' : s] += 1; }
  const rec = papers.get(id);
  rows.push({ id, n: own.length, ...t, sits: [rec?.midterm && 'mid', rec?.final && 'final'].filter(Boolean).join('+') || 'none' });
}

console.log('exam scope, by subject (what a phase pick will serve)');
console.log('subject                sits    total    mid  final   both   cont unknown');
for (const r of rows.sort((a, b) => b.n - a.n)) {
  console.log(
    String(r.id).padEnd(22), String(r.sits).padEnd(7),
    String(r.n).padStart(5), String(r.midterm).padStart(6), String(r.final).padStart(6),
    String(r.both).padStart(6), String(r.continuous).padStart(6), String(r.unknown).padStart(7),
  );
}

for (const w of warnings) console.log(`⚠️  ${w}`);
if (errors.length) {
  console.error(`\n❌ ${errors.length} exam-scope problem(s):`);
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}
console.log(`\n✓ exam scope holds: ${questions.length} questions, every declared scope is one the timetable allows`);
