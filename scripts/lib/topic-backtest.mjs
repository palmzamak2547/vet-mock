// ============================================================
// topic-backtest.mjs — which topics does the next cohort's paper examine?
// ============================================================
// The item-level backtest (backtest.mjs) asks whether the first questions of
// a topic hold a relative of an unseen paper's item. The bank limits that:
// most of a hidden paper's items have nothing related left in their topic.
// This asks the question one level up, the grain the data can carry: given
// only earlier cohorts' recorded papers of a subject, which topics, and how
// many items in each, does the next cohort's paper examine?
//
// One hidden paper at a time, forward only: a scorer sees the papers of the
// same subject sat by earlier cohorts, never the hidden paper, never another
// paper of the hidden cohort, never a later cohort. Each scorer gives every
// topic of the subject a number, and the paper is scored by
//   share@k  the share of its items whose topic is in the scorer's top k
//            (a tie at the boundary counts its expected share over a random
//            order of the tied topics: exact, no sampling);
//   rho      Spearman's rank correlation between the score and the paper's
//            items per topic over the whole universe of topics.
//
// The scorers and the rule for calling a lift real (TOPIC_BACKTEST, the
// verdicts below) were fixed before the first run; the rule and the result
// of 15 Nov 2026 are in docs/DATA-INTEGRITY-ROADMAP.md, "Topic-level
// backtest". No ordering in src/ reads this. History only: no figure here says what a
// coming paper will hold, and nothing here is shown to a student.
// ============================================================

export const TOPIC_BACKTEST = Object.freeze({
  minItems: 5,          // as the item-level backtest
  ks: [3, 5, 'half'],
  primaryK: 5,
  recencyWeight: 0.5,   // C2: the last cohort counts 1, the one before 0.5, ...
  minPapers: 3,         // a subject below this concludes nothing
  minItemsSubject: 30,  // nor below this many hidden items
  minPapersOverall: 15,
  bootstrap: 10000,
  seed: 20261115,
  level: 0.9875,        // 95% with Bonferroni over four candidates
  winShare: 0.6,        // R3
  subjectTolerance: 2,  // R5, percentage points
});

/** Papers from EXAM_RECURRENCE: [{ id, subject, cohort, paper, topics: Map(topic -> items) , items }]. */
export function papersFromRecurrence(recurrence) {
  const out = new Map();
  for (const [subject, s] of Object.entries(recurrence)) {
    for (const [topic, t] of Object.entries(s.topics || {})) {
      for (const [cohort, byPaper] of Object.entries(t.sat || {})) {
        for (const [paper, keys] of Object.entries(byPaper)) {
          const id = `${subject}|${cohort}|${paper}`;
          if (!out.has(id)) out.set(id, { id, subject, cohort: Number(cohort), paper, topics: new Map(), items: 0 });
          const p = out.get(id);
          p.topics.set(topic, (p.topics.get(topic) || 0) + keys.length);
          p.items += keys.length;
        }
      }
    }
  }
  return [...out.values()].sort((a, b) => a.subject.localeCompare(b.subject) || a.cohort - b.cohort || a.paper.localeCompare(b.paper));
}

// ── Scorers: (history, ctx) -> Map(topic -> score) ─────────────────────────
// history: the earlier cohorts' papers of the subject; ctx: { universe, cohort, ... }

const cohortsOf = (history) => [...new Set(history.map((p) => p.cohort))].sort((a, b) => a - b);

export function cohortFrequency(history, { universe }) {
  const score = new Map(universe.map((t) => [t, 0]));
  for (const c of cohortsOf(history)) {
    const seen = new Set(history.filter((p) => p.cohort === c).flatMap((p) => [...p.topics].filter(([, n]) => n > 0).map(([t]) => t)));
    for (const t of seen) if (score.has(t)) score.set(t, score.get(t) + 1);
  }
  return score;
}

export function recencyFrequency(history, { universe, cohort, weight = TOPIC_BACKTEST.recencyWeight }) {
  const score = new Map(universe.map((t) => [t, 0]));
  for (const c of cohortsOf(history)) {
    const w = weight ** (cohort - 1 - c);
    const seen = new Set(history.filter((p) => p.cohort === c).flatMap((p) => [...p.topics].filter(([, n]) => n > 0).map(([t]) => t)));
    for (const t of seen) if (score.has(t)) score.set(t, score.get(t) + w);
  }
  return score;
}

export function meanShare(history, { universe }) {
  const score = new Map(universe.map((t) => [t, 0]));
  if (!history.length) return score;
  for (const p of history) for (const [t, n] of p.topics) if (score.has(t)) score.set(t, score.get(t) + n / p.items / history.length);
  return score;
}

export function lastCohort(history, { universe }) {
  const score = new Map(universe.map((t) => [t, 0]));
  const cs = cohortsOf(history);
  if (!cs.length) return score;
  const last = cs[cs.length - 1];
  for (const p of history.filter((x) => x.cohort === last)) for (const [t, n] of p.topics) if (score.has(t)) score.set(t, score.get(t) + n);
  return score;
}

export function uniform(history, { universe }) {
  return new Map(universe.map((t) => [t, 0]));
}

/** C4: C1, zero for a topic no session of this term names (when the subject has syllabus data). */
export function taughtFrequency(history, ctx) {
  const score = cohortFrequency(history, ctx);
  if (!ctx.taught) return score;
  for (const t of score.keys()) if (!ctx.taught.has(t)) score.set(t, 0);
  return score;
}

// ── Metrics ────────────────────────────────────────────────────────────────

/** Expected count of actual items inside the top k topics, ties at the boundary spread evenly. */
export function itemsInTopK(score, actual, k) {
  const groups = new Map();
  for (const [t, s] of score) {
    if (!groups.has(s)) groups.set(s, []);
    groups.get(s).push(t);
  }
  let left = k;
  let got = 0;
  for (const s of [...groups.keys()].sort((a, b) => b - a)) {
    if (left <= 0) break;
    const ts = groups.get(s);
    const sum = ts.reduce((acc, t) => acc + (actual.get(t) || 0), 0);
    if (ts.length <= left) { got += sum; left -= ts.length; } else { got += (sum * left) / ts.length; left = 0; }
  }
  return got;
}

function ranks(values) {
  const idx = values.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(values.length);
  for (let i = 0; i < idx.length;) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    const avg = (i + j) / 2 + 1;
    for (let m = i; m <= j; m++) r[idx[m][1]] = avg;
    i = j + 1;
  }
  return r;
}

/** Spearman's rho with average ranks; 0 when either side is constant. */
export function spearman(xs, ys) {
  const n = xs.length;
  if (n < 2) return 0;
  const rx = ranks(xs); const ry = ranks(ys);
  const mx = rx.reduce((a, b) => a + b, 0) / n; const my = ry.reduce((a, b) => a + b, 0) / n;
  let sxy = 0; let sxx = 0; let syy = 0;
  for (let i = 0; i < n; i++) { sxy += (rx[i] - mx) * (ry[i] - my); sxx += (rx[i] - mx) ** 2; syy += (ry[i] - my) ** 2; }
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
}

export function kValue(k, T) {
  return k === 'half' ? Math.ceil(T / 2) : k;
}

/** Score one paper under one scorer: { 'share@3': %, 'share@5': %, 'share@half': %, rho }. */
export function scorePaper(score, paper, universe, ks = TOPIC_BACKTEST.ks) {
  const actual = new Map(universe.map((t) => [t, paper.topics.get(t) || 0]));
  const out = {};
  for (const k of ks) out[`share@${k}`] = (100 * itemsInTopK(score, actual, kValue(k, universe.length))) / paper.items;
  out.rho = spearman(universe.map((t) => score.get(t)), universe.map((t) => actual.get(t)));
  return out;
}

// ── Statistics ─────────────────────────────────────────────────────────────

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Paired bootstrap of the mean of per-paper differences: [lo, hi] at `level`. */
export function bootstrapInterval(diffs, { n = TOPIC_BACKTEST.bootstrap, seed = TOPIC_BACKTEST.seed, level = TOPIC_BACKTEST.level } = {}) {
  if (!diffs.length) return [null, null];
  const rand = mulberry32(seed);
  const means = new Float64Array(n);
  for (let b = 0; b < n; b++) {
    let s = 0;
    for (let i = 0; i < diffs.length; i++) s += diffs[Math.floor(rand() * diffs.length)];
    means[b] = s / diffs.length;
  }
  means.sort();
  const tail = (1 - level) / 2;
  return [means[Math.floor(tail * n)], means[Math.min(n - 1, Math.ceil((1 - tail) * n) - 1)]];
}

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10);
const r3 = (x) => (x == null ? null : Math.round(x * 1000) / 1000);

// ── The run ────────────────────────────────────────────────────────────────

/**
 * @param recurrence EXAM_RECURRENCE
 * @param opts.universeOf (subject) => topic ids (the curriculum's visible topics)
 * @param opts.currentOrder (subject, cohort, hiddenPaperId) => Map(topic -> score): B1
 * @param opts.taughtOf (subject) => Set(topic) | null: this term's sessions (C4)
 */
export function runTopicBacktest(recurrence, { universeOf, currentOrder, taughtOf = () => null, rule = TOPIC_BACKTEST } = {}) {
  const all = papersFromRecurrence(recurrence);
  const scorers = {
    uniform: { kind: 'baseline', fn: uniform },
    current: { kind: 'baseline', fn: (h, ctx) => currentOrder(ctx.subject, ctx.cohort, ctx.paperId, ctx.universe) },
    lastCohort: { kind: 'baseline', fn: lastCohort },
    C1_cohortFrequency: { kind: 'candidate', fn: cohortFrequency },
    C2_recencyFrequency: { kind: 'candidate', fn: recencyFrequency },
    C3_meanShare: { kind: 'candidate', fn: meanShare },
    C4_taughtFrequency: { kind: 'candidate', fn: taughtFrequency },
  };
  const skipped = { small: [], noHistory: [] };
  const rows = [];
  for (const paper of all) {
    if (paper.items < rule.minItems) { skipped.small.push(paper.id); continue; }
    const history = all.filter((p) => p.subject === paper.subject && p.cohort < paper.cohort);
    if (!history.length) { skipped.noHistory.push(paper.id); continue; }
    const universe = [...new Set([...(universeOf(paper.subject) || []), ...Object.keys(recurrence[paper.subject].topics || {})])].sort();
    const ctx = { subject: paper.subject, cohort: paper.cohort, paperId: paper.id, universe, taught: taughtOf(paper.subject) };
    const row = { id: paper.id, subject: paper.subject, cohort: paper.cohort, paper: paper.paper, items: paper.items, topics: universe.length, historyCohorts: cohortsOf(history), scores: {} };
    for (const [name, s] of Object.entries(scorers)) row.scores[name] = scorePaper(s.fn(history, ctx), paper, universe, rule.ks);
    rows.push(row);
  }

  const metrics = [...rule.ks.map((k) => `share@${k}`), 'rho'];
  const summarise = (rs) => {
    const out = { papers: rs.length, items: rs.reduce((s, r) => s + r.items, 0), mean: {}, weighted: {} };
    for (const name of Object.keys(scorers)) {
      out.mean[name] = {}; out.weighted[name] = {};
      for (const m of metrics) {
        out.mean[name][m] = m === 'rho' ? r3(mean(rs.map((r) => r.scores[name][m]))) : r1(mean(rs.map((r) => r.scores[name][m])));
        if (m !== 'rho') out.weighted[name][m] = r1(out.items ? rs.reduce((s, r) => s + (r.scores[name][m] * r.items) / 100, 0) / out.items * 100 : null);
      }
    }
    out.conclusive = rs.length >= rule.minPapers && out.items >= rule.minItemsSubject;
    return out;
  };
  const subjects = [...new Set(rows.map((r) => r.subject))].sort().map((s) => ({ subject: s, ...summarise(rows.filter((r) => r.subject === s)) }));
  const overall = summarise(rows);

  // Comparisons and the verdict, per candidate.
  const primary = `share@${rule.primaryK}`;
  const compare = (a, b, m, rs = rows) => {
    const diffs = rs.map((r) => r.scores[a][m] - r.scores[b][m]);
    let better = 0; let worse = 0; let tied = 0;
    for (const d of diffs) { if (Math.abs(d) < 1e-9) tied++; else if (d > 0) better++; else worse++; }
    const [lo, hi] = bootstrapInterval(diffs, rule);
    return { meanDiff: m === 'rho' ? r3(mean(diffs)) : r1(mean(diffs)), lo: m === 'rho' ? r3(lo) : r1(lo), hi: m === 'rho' ? r3(hi) : r1(hi), better, worse, tied };
  };
  const verdicts = {};
  for (const [name, s] of Object.entries(scorers)) {
    if (s.kind !== 'candidate') continue;
    const vsCurrent = Object.fromEntries(metrics.map((m) => [m, compare(name, 'current', m)]));
    const vsUniform = compare(name, 'uniform', primary);
    const p = vsCurrent[primary];
    const subjectGaps = subjects.filter((x) => x.conclusive).map((x) => ({ subject: x.subject, gap: r1(x.mean[name][primary] - x.mean.current[primary]) }));
    const checks = {
      R1: rows.length >= rule.minPapersOverall,
      R2: p.meanDiff > 0 && p.lo > 0,
      R3: p.better + p.worse > 0 && p.better / (p.better + p.worse) >= rule.winShare,
      R4: metrics.filter((m) => m !== primary).every((m) => vsCurrent[m].meanDiff >= 0),
      R5: subjectGaps.every((g) => g.gap >= -rule.subjectTolerance),
      R6: vsUniform.meanDiff > 0 && vsUniform.lo > 0,
    };
    verdicts[name] = { vsCurrent, vsUniform, subjectGaps, checks, passes: Object.values(checks).every(Boolean) };
  }
  const order = ['C1_cohortFrequency', 'C3_meanShare', 'C2_recencyFrequency', 'C4_taughtFrequency'];
  const chosen = order.find((n) => verdicts[n]?.passes) || null;
  const baselines = { lastVsCurrent: compare('lastCohort', 'current', primary), currentVsUniform: compare('current', 'uniform', primary) };
  return { rule: { ...rule }, papers: rows, subjects, overall, verdicts, baselines, chosen, skipped: { small: skipped.small.length, noHistory: skipped.noHistory.length, ids: skipped } };
}
