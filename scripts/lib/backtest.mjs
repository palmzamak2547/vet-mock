// ============================================================
// backtest.mjs — does the past-paper ordering cover a paper it has not seen?
// ============================================================
// Panic Mode orders a subject by provenance (src/lib/question-metadata.js
// panicRank): band 0, items a senior cohort sat; band 1, items written from
// what a cohort marked (อิงแนวข้อสอบ); band 2, everything else, which Panic
// leaves out. Inside a band the order is a shuffle. The ordering therefore
// claims one thing: the questions closest to past papers are the ones worth
// working first. This measures that claim against the papers we hold.
//
// For each recorded paper (subject, sitting cohort, paper) with enough items:
//   1. hide the paper: its items leave the bank;
//   2. for every topic the paper touched, rank that topic's remaining
//      questions the way panicRank does;
//   3. a hidden item is covered at depth k when the top k of its topic hold a
//      match for it, and the expected coverage of the band order (shuffled
//      inside each band) and of a plain shuffle of the same topic are exact
//      hypergeometric sums, so there is no sampling noise to argue about.
//
// Two depths: the first 10 of the topic, and the Panic set itself (bands 0
// and 1; a topic with neither is served whole, as panicPool does for a
// subject). Two meanings of a match:
//   same item  the recurrence generator's own rule (scripts/regen-exam-
//              recurrence.mjs sameItem, hand-checked on 2026-10-28);
//   sibling    stems agree at that rule's first gate alone (character
//              trigram Jaccard >= 0.25), no key check: a question on the
//              same frame, often about a different thing. Unvalidated;
//              read it as "practised something next to it".
// Two windows of history:
//   leave-one-out  every other paper counts, as the instruction for this
//                  measure says;
//   forward        only papers of earlier cohorts count (later cohorts'
//                  items are removed): what a student could have had.
// Leakage guard, both windows: a band-1 or band-2 row whose provenance names
// the hidden cohort is removed, since it may have been written from the
// hidden paper itself.
//
// History only. Nothing here is shown to a student, and no figure here says
// what a coming paper will hold.
// ============================================================

import { fingerprint, sameItem, sittingOf, isPaperEvidence } from '../regen-exam-recurrence.mjs';
import { panicRank, questionTopicId } from '../../src/lib/question-metadata.js';
import { questionDeliveryKey } from '../../src/data/question-delivery.generated.js';

export const BACKTEST = Object.freeze({
  minItems: 5,        // a paper with fewer recorded items is not a paper to test on
  depth: 10,          // the first screenful of a topic
  siblingStem: 0.25,  // regen-exam-recurrence SAME_ITEM.stem
  minPapers: 3,       // below this a subject's figure concludes nothing
  minCoverable: 20,   // nor below this many hidden items that could be covered at all
});

/** log C(n, k) via a cached log-factorial table. */
const logFact = [0];
function lf(n) {
  for (let i = logFact.length; i <= n; i++) logFact[i] = logFact[i - 1] + Math.log(i);
  return logFact[n];
}
function logChoose(n, k) {
  if (k < 0 || k > n) return -Infinity;
  return lf(n) - lf(k) - lf(n - k);
}
/** P(no marked item among r drawn without replacement from n holding m marked). */
export function missProbability(n, m, r) {
  if (m <= 0 || r <= 0) return 1;
  if (r > n - m) return 0;
  return Math.exp(logChoose(n - m, r) - logChoose(n, r));
}

/**
 * Expected coverage of one hidden item at depth k.
 * @param bands [{ n, m }] in serving order: size and matches per band
 * @param k     depth
 * @returns probability that the first k hold at least one match
 */
export function bandCoverage(bands, k) {
  let left = k;
  let miss = 1;
  for (const { n, m } of bands) {
    if (left <= 0) break;
    const r = Math.min(left, n);
    miss *= missProbability(n, m, r);
    left -= r;
    if (miss === 0) break;
  }
  return 1 - miss;
}

/** The same k drawn by a plain shuffle of the whole topic. */
export function randomCoverage(bands, k) {
  const n = bands.reduce((s, b) => s + b.n, 0);
  const m = bands.reduce((s, b) => s + b.m, 0);
  return 1 - missProbability(n, m, Math.min(k, n));
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let n = 0;
  const [s, l] = a.size < b.size ? [a, b] : [b, a];
  for (const x of s) if (l.has(x)) n++;
  return n / (a.size + b.size - n);
}

const COHORT_TOKEN = (cohort) => new RegExp(`(?<!\\d)${cohort}(?!\\d)`);
function namesHiddenCohort(q, cohort) {
  const re = COHORT_TOKEN(cohort);
  return [q.examOrigin, q.source, q.verified].some((v) => typeof v === 'string' && re.test(v));
}

/** Recorded papers: subject|cohort|paper -> item keys (deliverable past-paper items with a sitting cohort). */
export function recordedPapers(questions) {
  const papers = new Map();
  const sitting = new Map();
  for (const q of questions) {
    if (!isPaperEvidence(q)) continue;
    const { cohorts, paper } = sittingOf(q);
    const key = questionDeliveryKey(q);
    sitting.set(key, cohorts);
    for (const cohort of cohorts) {
      const id = `${q.subject}|${cohort}|${paper || 'unknown'}`;
      if (!papers.has(id)) papers.set(id, { id, subject: q.subject, cohort, paper: paper || 'unknown', items: [] });
      papers.get(id).items.push(q);
    }
  }
  return { papers: [...papers.values()], sitting };
}

/**
 * Run the backtest over deliverable questions.
 * @returns {{ rule, papers: object[], subjects: object[], overall: object, skipped: object }}
 */
export function runBacktest(questions, { rule = BACKTEST } = {}) {
  const prints = new Map();
  const fp = (q) => {
    const key = questionDeliveryKey(q);
    if (!prints.has(key)) prints.set(key, fingerprint(q));
    return prints.get(key);
  };
  const byTopic = new Map();
  for (const q of questions) {
    const t = `${q.subject}|${questionTopicId(q)}`;
    if (!byTopic.has(t)) byTopic.set(t, []);
    byTopic.get(t).push(q);
  }
  const band = new Map(questions.map((q) => [questionDeliveryKey(q), panicRank(q)]));
  const { papers: all, sitting } = recordedPapers(questions);
  const tested = all.filter((p) => p.items.length >= rule.minItems);
  const skipped = { papers: all.length - tested.length, items: all.filter((p) => p.items.length < rule.minItems).reduce((s, p) => s + p.items.length, 0) };

  const results = [];
  for (const paper of tested) {
    const hidden = new Set(paper.items.map(questionDeliveryKey));
    const row = { id: paper.id, subject: paper.subject, cohort: paper.cohort, paper: paper.paper, items: paper.items.length, windows: {} };
    for (const window of ['leaveOneOut', 'forward']) {
      const acc = { coverable: { item: 0, sibling: 0 } };
      for (const m of ['item', 'sibling']) for (const d of ['depth', 'panic']) acc[`${m}.${d}`] = { app: 0, random: 0 };
      for (const h of paper.items) {
        const topic = byTopic.get(`${h.subject}|${questionTopicId(h)}`) || [];
        const pool = topic.filter((q) => {
          const key = questionDeliveryKey(q);
          if (hidden.has(key)) return false;
          const b = band.get(key);
          if (b > 0 && namesHiddenCohort(q, paper.cohort)) return false;
          if (window === 'forward' && b === 0) {
            const cohorts = sitting.get(key) || [];
            // A paper of a later cohort had not been sat yet; an item with no cohort stays (it cannot be dated).
            if (cohorts.length && cohorts.every((c) => c >= paper.cohort)) return false;
          }
          return true;
        });
        const hp = fp(h);
        const counts = { item: [0, 0, 0], sibling: [0, 0, 0] };
        const sizes = [0, 0, 0];
        for (const q of pool) {
          const b = band.get(questionDeliveryKey(q));
          sizes[b]++;
          const qp = fp(q);
          if (jaccard(hp.stem, qp.stem) >= rule.siblingStem && hp.stemLength >= 12 && qp.stemLength >= 12) {
            counts.sibling[b]++;
            if (sameItem(hp, qp)) counts.item[b]++;
          }
        }
        const panicSize = sizes[0] + sizes[1] || sizes[2];
        for (const m of ['item', 'sibling']) {
          const bands = sizes.map((n, i) => ({ n, m: counts[m][i] }));
          if (!bands.some((b) => b.m)) continue;
          acc.coverable[m]++;
          acc[`${m}.depth`].app += bandCoverage(bands, rule.depth);
          acc[`${m}.depth`].random += randomCoverage(bands, rule.depth);
          // Panic set: the band order up to its size; a topic with no band 0/1 is served whole.
          acc[`${m}.panic`].app += bandCoverage(bands, panicSize);
          acc[`${m}.panic`].random += randomCoverage(bands, panicSize);
        }
      }
      row.windows[window] = acc;
    }
    results.push(row);
  }

  const summarise = (rows) => {
    const out = { papers: rows.length, items: rows.reduce((s, r) => s + r.items, 0), windows: {} };
    for (const window of ['leaveOneOut', 'forward']) {
      const w = { coverable: { item: 0, sibling: 0 } };
      for (const r of rows) for (const m of ['item', 'sibling']) w.coverable[m] += r.windows[window].coverable[m];
      for (const m of ['item', 'sibling']) for (const d of ['depth', 'panic']) {
        const k = `${m}.${d}`;
        const app = rows.reduce((s, r) => s + r.windows[window][k].app, 0);
        const random = rows.reduce((s, r) => s + r.windows[window][k].random, 0);
        // Per-paper sign test: on how many papers did the band order beat a shuffle?
        let better = 0; let worse = 0; let tie = 0;
        for (const r of rows) {
          const a = r.windows[window][k].app; const b = r.windows[window][k].random;
          if (Math.abs(a - b) < 1e-9) tie++; else if (a > b) better++; else worse++;
        }
        w[k] = {
          app: round(app), random: round(random),
          appShare: share(app, out.items), randomShare: share(random, out.items),
          lift: random > 0 ? round(app / random, 2) : null,
          papersBetter: better, papersWorse: worse, papersTied: tie,
        };
      }
      out.windows[window] = w;
    }
    out.conclusive = rows.length >= rule.minPapers && out.windows.forward.coverable.sibling >= rule.minCoverable;
    return out;
  };

  const subjects = [...new Set(results.map((r) => r.subject))].sort().map((s) => ({ subject: s, ...summarise(results.filter((r) => r.subject === s)) }));
  return { rule: { ...rule }, papers: results, subjects, overall: summarise(results), skipped };
}

const round = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;
const share = (x, n) => (n ? round((100 * x) / n, 1) : null);
