// ============================================================
// q-count-tables.js — the count tables, computed from their leaves
// ============================================================
// src/data/q-counts.js and src/data/q-kind-counts.generated.js store leaves
// only: one row per subject and topic, written by scripts/regen-q-counts.mjs.
// Every total a screen prints (the bank size, per subject, per year, per
// phase) is summed here when the module loads, so two pull requests that add
// questions to different topics change different lines and merge by
// themselves (scripts/lib/merge-friendly.mjs).
//
// Nothing here imports the bank: the home screen's count-only path stays
// count-only.
//
// A q-counts leaf: [subject, topic, blocked, cells]. `blocked` counts the
// questions the delivery gate holds back. Each cell is
//   [n, year, visible, pastPaper, papers, panic, currentScope, highPrediction]
// for n deliverable questions that share every other field:
//   year            q.year, or null
//   visible         1 unless the topic is hidden in the curriculum
//   pastPaper       1 when isPastPaperQuestion
//   papers          bit 1: in the midterm paper, bit 2: in the final paper
//                   (questionInScope), visible questions only
//   panic           1 when panicRank < 2, visible questions only
//   currentScope    [curriculumVersion, scopeOfQuestion] when the question is
//   highPrediction  current-scope / high-prediction, else 0; visible only
//
// A q-kind-counts leaf: [subject, topic, deliverable, kinds, pastKinds], where
// kinds and pastKinds map a phase to [mcq, tf, match, writing] plus a fifth
// number when a printed matching set from another topic names this one.
// ============================================================

export const PHASE_IDS = ['1-mid', '1-final', '2-mid', '2-final'];
const PHASE_TERM = { '1-mid': 1, '1-final': 1, '2-mid': 2, '2-final': 2 };
// Which bit of a cell's `papers` the phase's paper is.
const PHASE_PAPER = { '1-mid': 1, '1-final': 2, '2-mid': 1, '2-final': 2 };
const KINDS = ['mcq', 'tf', 'match', 'writing'];

const blank = () => Object.fromEntries(PHASE_IDS.map((phase) => [phase, {}]));
const add = (index, key, n) => { index[key] = (index[key] || 0) + n; };
const addNested = (index, outer, inner, n) => {
  index[outer] ||= {};
  index[outer][inner] = (index[outer][inner] || 0) + n;
};

// Mirrors questionInScope(): `both` lands in midterm AND final; continuous
// stays in its own bucket and never inflates an exam-phase count.
function addScoped(index, [version, scope], subject, n) {
  index[version] ||= { all: {}, midterm: {}, final: {}, continuous: {} };
  const phase = index[version];
  add(phase.all, subject, n);
  if (scope === 'both') {
    add(phase.midterm, subject, n);
    add(phase.final, subject, n);
  } else if (phase[scope]) {
    add(phase[scope], subject, n);
  }
}

/**
 * @param {Array<[string, string, number, Array<any[]>]>} leaves
 * @param {Record<string, number | null>} subjectTerms semester of each subject
 */
export function countTables(leaves, subjectTerms) {
  // A phase narrows a year to its TERM and never empties it (exam-pool.js): a
  // year with no deliverable question in the term keeps the whole year, then
  // the paper filter, so the year table counts those questions too.
  const inTerm = (subject, phase) => {
    const sem = subjectTerms[subject];
    return sem == null || sem === 0 || sem === PHASE_TERM[phase];
  };
  const yearHasTermQuestions = Object.fromEntries(PHASE_IDS.map((phase) => [phase, new Set()]));
  for (const [subject, , , cells] of leaves) {
    for (const [, year] of cells) {
      if (year == null) continue;
      for (const phase of PHASE_IDS) if (inTerm(subject, phase)) yearHasTermQuestions[phase].add(year);
    }
  }

  let total = 0;
  let blocked = 0;
  const bySubject = {};
  const byVisibleSubject = {};
  const byPanicSubject = {};
  const byPanicSubjectScope = { midterm: {}, final: {} };
  const byVisibleSubjectScope = blank();
  const byYearScope = blank();
  const byTopicScope = blank();
  const byPastPaperTopicScope = blank();
  const byYear = {};
  const byVisibleYear = {};
  const byTopic = {};
  const byPastPaperTopic = {};
  const byCurrentScope = {};
  const byHighPrediction = {};

  for (const [subject, topic, held, cells] of leaves) {
    blocked += held;
    for (const [n, year, visible, past, papers, panic, currentScope, highPrediction] of cells) {
      total += n;
      add(bySubject, subject, n);
      addNested(byTopic, subject, topic, n);
      if (past) addNested(byPastPaperTopic, subject, topic, n);
      if (visible) {
        add(byVisibleSubject, subject, n);
        for (const phase of PHASE_IDS) {
          if (!(papers & PHASE_PAPER[phase])) continue;
          if (!inTerm(subject, phase)) {
            if (year != null && !yearHasTermQuestions[phase].has(year)) add(byYearScope[phase], year, n);
            continue;
          }
          add(byVisibleSubjectScope[phase], subject, n);
          if (year != null) add(byYearScope[phase], year, n);
          addNested(byTopicScope[phase], subject, topic, n);
          if (past) addNested(byPastPaperTopicScope[phase], subject, topic, n);
        }
        if (panic) {
          add(byPanicSubject, subject, n);
          if (papers & 1) add(byPanicSubjectScope.midterm, subject, n);
          if (papers & 2) add(byPanicSubjectScope.final, subject, n);
        }
        if (currentScope) addScoped(byCurrentScope, currentScope, subject, n);
        if (highPrediction) addScoped(byHighPrediction, highPrediction, subject, n);
      }
      if (Number.isFinite(year)) {
        add(byYear, year, n);
        if (visible) add(byVisibleYear, year, n);
      }
    }
  }

  return {
    QB_TOTAL: total,
    QB_SOURCE_TOTAL: total + blocked,
    QB_BLOCKED_TOTAL: blocked,
    Q_COUNTS_BY_SUBJECT: bySubject,
    Q_VISIBLE_COUNTS_BY_SUBJECT: byVisibleSubject,
    Q_PANIC_COUNTS_BY_SUBJECT: byPanicSubject,
    Q_PANIC_COUNTS_BY_SUBJECT_BY_SCOPE: byPanicSubjectScope,
    Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE: byVisibleSubjectScope,
    Q_VISIBLE_COUNTS_BY_YEAR_BY_SCOPE: byYearScope,
    Q_COUNTS_BY_TOPIC_BY_SCOPE: byTopicScope,
    Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE: byPastPaperTopicScope,
    Q_COUNTS_BY_YEAR: byYear,
    Q_VISIBLE_COUNTS_BY_YEAR: byVisibleYear,
    Q_COUNTS_BY_TOPIC: byTopic,
    Q_PAST_PAPER_COUNTS_BY_TOPIC: byPastPaperTopic,
    Q_CURRENT_SCOPE_COUNTS: byCurrentScope,
    Q_HIGH_PREDICTION_COUNTS: byHighPrediction,
  };
}

/** @param {Array<[string, string, number, Record<string, number[]>, Record<string, number[]>]>} leaves */
export function kindTables(leaves) {
  let deliverable = 0;
  const byKind = blank();
  const byPastKind = blank();
  const row = (counts) => {
    const out = Object.fromEntries(KINDS.map((kind, i) => [kind, counts[i]]));
    if (counts.length > KINDS.length) out._matchCovers = counts[KINDS.length];
    return out;
  };
  for (const [subject, topic, n, kinds, pastKinds] of leaves) {
    deliverable += n;
    for (const phase of PHASE_IDS) {
      if (kinds[phase]) (byKind[phase][subject] ||= {})[topic] = row(kinds[phase]);
      if (pastKinds[phase]) (byPastKind[phase][subject] ||= {})[topic] = row(pastKinds[phase]);
    }
  }
  return {
    Q_KIND_COUNTS_QB_TOTAL: deliverable,
    Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE: byKind,
    Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE: byPastKind,
  };
}
