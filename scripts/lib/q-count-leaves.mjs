// The leaves of src/data/q-counts.js and src/data/q-kind-counts.generated.js,
// and the text of both modules. Pure: the caller hands in the questions and
// the rules (scripts/regen-q-counts.mjs passes the real ones, the unit tests
// pass small ones). The tables themselves are computed from these leaves by
// src/lib/q-count-tables.js when the modules load.

import { compareKeys, leafLines, LEAF_LAYOUT_NOTE } from './merge-friendly.mjs';

const PHASE_IDS = ['1-mid', '1-final', '2-mid', '2-final'];
const PHASE_TERM = { '1-mid': 1, '1-final': 1, '2-mid': 2, '2-final': 2 };
const KINDS = ['mcq', 'tf', 'match', 'writing'];
const kindOf = (q) => (q.type === 'tf' ? 'tf'
  : q.type === 'match' ? 'match'
    : (q.type === 'short' || q.type === 'essay' || q.type === 'fill') ? 'writing' : 'mcq');

/**
 * @param {any[]} questions every question in the source banks
 * @param {{
 *   isQuestionDeliverable: (q: any) => boolean,
 *   questionTopicId: (q: any) => string,
 *   isPastPaperQuestion: (q: any) => boolean,
 *   panicRank: (q: any) => number,
 *   questionInScope: (q: any, paper: 'midterm' | 'final') => boolean,
 *   scopeOfQuestion: (q: any) => string | null,
 *   isCurrentScopeQuestion: (q: any, o: { curriculumVersion: string }) => boolean,
 *   isHighPredictionQuestion: (q: any, o: { curriculumVersion: string }) => boolean,
 *   semesterForSubject: (subject: string) => number | null | undefined,
 *   hiddenBySubject: Record<string, Set<string>>,
 * }} rules
 */
export function buildQCountLeaves(questions, rules) {
  const subjectTerms = new Map();
  const termOf = (subject) => {
    if (!subjectTerms.has(subject)) subjectTerms.set(subject, rules.semesterForSubject(subject) ?? null);
    return subjectTerms.get(subject);
  };
  const inTerm = (subject, phase) => {
    const sem = termOf(subject);
    return sem == null || sem === 0 || sem === PHASE_TERM[phase];
  };

  const counts = new Map();
  const countLeaf = (subject, topic) => {
    const key = JSON.stringify([subject, topic]);
    if (!counts.has(key)) counts.set(key, { subject, topic, blocked: 0, cells: new Map() });
    return counts.get(key);
  };
  const kinds = new Map();
  const kindLeaf = (subject, topic) => {
    const key = JSON.stringify([subject, topic]);
    if (!kinds.has(key)) kinds.set(key, { subject, topic, deliverable: 0, kinds: {}, past: {} });
    return kinds.get(key);
  };
  const kindRow = (table, phase) => (table[phase] ||= [0, 0, 0, 0]);

  for (const q of questions) {
    const subject = q.subject || '__unknown__';
    const topic = rules.questionTopicId(q);
    termOf(subject);
    const leaf = countLeaf(subject, topic);
    if (!rules.isQuestionDeliverable(q)) {
      leaf.blocked += 1;
      continue;
    }
    const hidden = rules.hiddenBySubject[subject];
    const visible = !hidden || !hidden.has(q.topic);
    const past = rules.isPastPaperQuestion(q);
    const papers = visible
      ? (rules.questionInScope(q, 'midterm') ? 1 : 0) | (rules.questionInScope(q, 'final') ? 2 : 0)
      : 0;
    const panic = visible && rules.panicRank(q) < 2 ? 1 : 0;
    const version = q.curriculumVersion;
    const scoped = (test) => (visible && version && test(q, { curriculumVersion: version })
      ? [version, rules.scopeOfQuestion(q) ?? null] : 0);
    const cell = [q.year ?? null, visible ? 1 : 0, past ? 1 : 0, papers, panic,
      scoped(rules.isCurrentScopeQuestion), scoped(rules.isHighPredictionQuestion)];
    const cellKey = JSON.stringify(cell);
    const found = leaf.cells.get(cellKey);
    if (found) found[0] += 1;
    else leaf.cells.set(cellKey, [1, ...cell]);

    const kind = kindLeaf(subject, topic);
    kind.deliverable += 1;
    if (!visible) continue;
    for (const phase of PHASE_IDS) {
      if (!(papers & (phase.endsWith('-mid') ? 1 : 2)) || !inTerm(subject, phase)) continue;
      kindRow(kind.kinds, phase)[KINDS.indexOf(kindOf(q))] += 1;
      // A printed matching set keys its items to organisms from several
      // lectures. It is counted once, under its own topic; every other topic
      // it names gets a fifth number so a deck cover can say the set includes
      // that disease (LecturerSets).
      if (q.type === 'match' && Array.isArray(q.topics)) {
        for (const extra of q.topics) {
          if (extra === topic || extra === q.topic) continue;
          const row = kindRow(kindLeaf(subject, extra).kinds, phase);
          row[4] = (row[4] || 0) + 1;
        }
      }
      if (past) kindRow(kind.past, phase)[KINDS.indexOf(kindOf(q))] += 1;
    }
  }

  const sorted = (map) => [...map.values()].sort((a, b) => compareKeys([a.subject, a.topic], [b.subject, b.topic]));
  const phaseOrder = (table) => Object.fromEntries(PHASE_IDS.filter((p) => table[p]).map((p) => [p, table[p]]));
  return {
    subjectTerms: [...subjectTerms].sort(([a], [b]) => compareKeys([a], [b])),
    countLeaves: sorted(counts).map((l) => [
      l.subject, l.topic, l.blocked,
      [...l.cells.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([, c]) => c),
    ]),
    kindLeaves: sorted(kinds).map((l) => [l.subject, l.topic, l.deliverable, phaseOrder(l.kinds), phaseOrder(l.past)]),
  };
}

const HEADER = [
  '// ============================================================',
  '// Q_COUNTS — precomputed Q-bank cardinality by subject/year/topic',
  '// ============================================================',
  '//',
  '// AUTO-GENERATED by scripts/regen-q-counts.mjs — do NOT hand-edit.',
  '// Re-run after adding/removing Qs in any questions-*.js file.',
  '//',
  '// Consumers (HomeView/YearSelectView/ScheduleView/etc.) import',
  '// from here INSTEAD of QB so the count-only render path doesn\'t',
  '// drag the full Q-bank into the home-screen load graph.',
  '//',
  ...LEAF_LAYOUT_NOTE,
  '// The fields of a leaf are described in src/lib/q-count-tables.js.',
  '// ============================================================',
];

/** The text of src/data/q-counts.js. */
export function renderQCounts({ subjectTerms, countLeaves }) {
  const lines = [...HEADER, ''];
  lines.push("import { countTables } from '../lib/q-count-tables.js';");
  lines.push('');
  lines.push('// The semester each subject is taught in (curriculum.js), for the phase tables.');
  lines.push('const SUBJECT_TERMS = {');
  for (const [subject, term] of subjectTerms) lines.push(...leafLines([subject], `${JSON.stringify(subject)}: ${JSON.stringify(term)}`));
  lines.push('};');
  lines.push('');
  lines.push('// [subject, topic, held back by the delivery gate, cells]');
  lines.push('const LEAVES = [');
  for (const leaf of countLeaves) lines.push(...leafLines(leaf.slice(0, 2), JSON.stringify(leaf)));
  lines.push('];');
  lines.push('');
  lines.push('const T = countTables(LEAVES, SUBJECT_TERMS);');
  lines.push('');
  lines.push('export const QB_TOTAL = T.QB_TOTAL;');
  lines.push('export const QB_SOURCE_TOTAL = T.QB_SOURCE_TOTAL;');
  lines.push('export const QB_BLOCKED_TOTAL = T.QB_BLOCKED_TOTAL;');
  lines.push('export const Q_COUNTS_BY_SUBJECT = T.Q_COUNTS_BY_SUBJECT;');
  lines.push('// Visible counts exclude hidden-topic Qs (midterm leftovers, uncertain-scope');
  lines.push('// items flagged via topic.hidden in curriculum.js).');
  lines.push('export const Q_VISIBLE_COUNTS_BY_SUBJECT = T.Q_VISIBLE_COUNTS_BY_SUBJECT;');
  lines.push('// What Panic Mode holds per subject: questions from a real paper plus the');
  lines.push('// ones written from what a senior cohort marked, hidden topics excluded.');
  lines.push('// A subject missing from this map has neither, and its Panic card falls');
  lines.push('// back to the whole subject.');
  lines.push('export const Q_PANIC_COUNTS_BY_SUBJECT = T.Q_PANIC_COUNTS_BY_SUBJECT;');
  lines.push('// The same count, narrowed to one paper (lib/exam-scope.js).');
  lines.push('export const Q_PANIC_COUNTS_BY_SUBJECT_BY_SCOPE = T.Q_PANIC_COUNTS_BY_SUBJECT_BY_SCOPE;');
  lines.push('// What each surface may print once a paper is chosen: the same rule as the');
  lines.push('// buildExamPool call behind the button next to it.');
  lines.push('export const Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE = T.Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE;');
  lines.push('// What รวมทุกวิชา serves for a year under a phase. Follows the pool\'s');
  lines.push('// never-empty guard, so this is NOT always the sum of the subject table.');
  lines.push('export const Q_VISIBLE_COUNTS_BY_YEAR_BY_SCOPE = T.Q_VISIBLE_COUNTS_BY_YEAR_BY_SCOPE;');
  lines.push('export const Q_COUNTS_BY_TOPIC_BY_SCOPE = T.Q_COUNTS_BY_TOPIC_BY_SCOPE;');
  lines.push('// Past-paper counts per topic, over the SAME phase-scoped set as above.');
  lines.push('export const Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE = T.Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE;');
  lines.push('export const Q_COUNTS_BY_YEAR = T.Q_COUNTS_BY_YEAR;');
  lines.push('// Visible per-year totals (hidden topics excluded): every user-facing year');
  lines.push('// total renders THIS.');
  lines.push('export const Q_VISIBLE_COUNTS_BY_YEAR = T.Q_VISIBLE_COUNTS_BY_YEAR;');
  lines.push('// Nested by subject so identical topic ids in different subjects cannot');
  lines.push('// collide; questions without a topic sit under the unassigned topic id.');
  lines.push('export const Q_COUNTS_BY_TOPIC = T.Q_COUNTS_BY_TOPIC;');
  lines.push('export const Q_PAST_PAPER_COUNTS_BY_TOPIC = T.Q_PAST_PAPER_COUNTS_BY_TOPIC;');
  lines.push('// Current-scope and high-likelihood questions per curriculum version: `all`');
  lines.push('// counts each question once, `both` lands in midterm and final, `continuous`');
  lines.push('// never counts toward an exam phase. Hidden topics are excluded.');
  lines.push('export const Q_CURRENT_SCOPE_COUNTS = T.Q_CURRENT_SCOPE_COUNTS;');
  lines.push('export const Q_HIGH_PREDICTION_COUNTS = T.Q_HIGH_PREDICTION_COUNTS;');
  lines.push('');
  return lines.join('\n');
}

/** The text of src/data/q-kind-counts.generated.js. */
export function renderQKindCounts({ kindLeaves }) {
  const lines = [
    '// GENERATED by scripts/regen-q-counts.mjs — do not edit by hand.',
    '// Per-topic question counts split by kind (mcq, tf, match, writing), keyed by',
    '// the phase a student can pick and scoped by the same rule the session uses.',
    '// Its own module: the topic screen imports it, the home screen does not.',
    ...LEAF_LAYOUT_NOTE,
    '',
    "import { kindTables } from '../lib/q-count-tables.js';",
    '',
    '// [subject, topic, deliverable questions, kinds by phase, past-paper kinds by phase]',
    'const LEAVES = [',
  ];
  for (const leaf of kindLeaves) lines.push(...leafLines(leaf.slice(0, 2), JSON.stringify(leaf)));
  lines.push('];');
  lines.push('');
  lines.push('const T = kindTables(LEAVES);');
  lines.push('');
  lines.push('// The bank size this table was generated from; lint:curriculum compares it');
  lines.push('// to a live recount so a card can never print a number from a stale table.');
  lines.push('export const Q_KIND_COUNTS_QB_TOTAL = T.Q_KIND_COUNTS_QB_TOTAL;');
  lines.push('export const Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE = T.Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE;');
  lines.push('// The same table over past-paper questions only, behind the');
  lines.push('// "ฝึกเฉพาะข้อสอบเก่า" button on a lecturer card.');
  lines.push('export const Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE = T.Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE;');
  lines.push('');
  return lines.join('\n');
}
