// scripts/lib/topic-backtest.mjs: the topic-level backtest of the past-paper
// order. These pin what its verdict rests on: ties at the top-k boundary are
// spread exactly, the rank correlation is Spearman's with average ranks, and
// a hidden paper is scored only from earlier cohorts' papers.
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bootstrapInterval,
  cohortFrequency,
  itemsInTopK,
  meanShare,
  papersFromRecurrence,
  recencyFrequency,
  runTopicBacktest,
  spearman,
  taughtFrequency,
} from '../../scripts/lib/topic-backtest.mjs';

const m = (o) => new Map(Object.entries(o));

test('a tie at the top-k boundary counts its expected share', () => {
  const actual = m({ a: 4, b: 2, c: 0, d: 0 });
  assert.equal(itemsInTopK(m({ a: 3, b: 2, c: 1, d: 0 }), actual, 2), 6);
  // b, c and d tie for the last slot: one third of their 2 items.
  assert.equal(itemsInTopK(m({ a: 3, b: 1, c: 1, d: 1 }), actual, 2), 4 + 2 / 3);
  // A uniform score is k/T of the paper.
  assert.equal(itemsInTopK(m({ a: 0, b: 0, c: 0, d: 0 }), actual, 2), 3);
  assert.equal(itemsInTopK(m({ a: 0, b: 0 }), m({ a: 1, b: 1 }), 5), 2);
});

test('Spearman with average ranks, and 0 for a constant side', () => {
  assert.equal(spearman([1, 2, 3], [10, 20, 30]), 1);
  assert.equal(spearman([1, 2, 3], [3, 2, 1]), -1);
  assert.equal(spearman([1, 1, 1], [1, 2, 3]), 0);
  assert.ok(Math.abs(spearman([1, 1, 2], [1, 2, 3]) - 0.866) < 0.001);
});

const paper = (cohort, topics, name = 'final') => ({ cohort, paper: name, topics: m(topics), items: Object.values(topics).reduce((a, b) => a + b, 0) });

test('the candidates count cohorts, weigh recent ones, and average shares', () => {
  const history = [paper(80, { a: 9, b: 1 }), paper(81, { b: 2 }), paper(82, { b: 1, c: 1 })];
  const universe = ['a', 'b', 'c', 'd'];
  assert.deepEqual([...cohortFrequency(history, { universe })], [['a', 1], ['b', 3], ['c', 1], ['d', 0]]);
  assert.deepEqual([...recencyFrequency(history, { universe, cohort: 83 })], [['a', 0.25], ['b', 1.75], ['c', 1], ['d', 0]]);
  const share = meanShare(history, { universe });
  assert.ok(Math.abs(share.get('a') - 0.3) < 1e-9);
  assert.ok(Math.abs(share.get('b') - (0.1 + 1 + 0.5) / 3) < 1e-9);
  assert.equal(taughtFrequency(history, { universe, taught: new Set(['a']) }).get('b'), 0);
  assert.equal(taughtFrequency(history, { universe, taught: null }).get('b'), 3);
});

test('the bootstrap interval is reproducible and brackets a constant', () => {
  assert.deepEqual(bootstrapInterval([1, 2, 3, 4], { n: 500 }), bootstrapInterval([1, 2, 3, 4], { n: 500 }));
  assert.deepEqual(bootstrapInterval([2, 2, 2], { n: 200 }), [2, 2]);
});

// Recurrence shaped like the generated file: topic -> sat[cohort][paper] = keys.
const keys = (n, tag) => Array.from({ length: n }, (_, i) => `s:${tag}${i}`);
const RECURRENCE = {
  s: {
    topics: {
      a: { sat: { 80: { final: keys(5, 'a80') }, 81: { final: keys(5, 'a81') }, 82: { final: keys(1, 'a82') } } },
      b: { sat: { 82: { final: keys(5, 'b82') }, 83: { final: keys(9, 'b83') } } },
      c: { sat: { 83: { final: keys(1, 'c83') } } },
    },
  },
};

test('a hidden paper is scored from earlier cohorts only', () => {
  const papers = papersFromRecurrence(RECURRENCE);
  assert.deepEqual(papers.map((p) => `${p.id}:${p.items}`), ['s|80|final:5', 's|81|final:5', 's|82|final:6', 's|83|final:10']);
  const seen = [];
  const bt = runTopicBacktest(RECURRENCE, {
    universeOf: () => ['a', 'b', 'c', 'd'],
    currentOrder: (subject, cohort, paperId, universe) => { seen.push([cohort, paperId]); return new Map(universe.map((t) => [t, 0])); },
    rule: { minItems: 5, ks: [1], primaryK: 1, recencyWeight: 0.5, minPapers: 1, minItemsSubject: 1, minPapersOverall: 1, bootstrap: 100, seed: 1, level: 0.95, winShare: 0.6, subjectTolerance: 2 },
  });
  // Cohort 80 has no earlier paper and is not scored.
  assert.equal(bt.skipped.noHistory, 1);
  assert.deepEqual(bt.papers.map((p) => p.historyCohorts.join(',')), ['80', '80,81', '80,81,82']);
  assert.deepEqual(seen.map(([c]) => c), [81, 82, 83]);
  // For cohort 83 the history says a (3 cohorts) before b (1): b's 9 items are missed at k = 1.
  const last = bt.papers.at(-1);
  assert.equal(last.scores.C1_cohortFrequency['share@1'], 0);
  // The last cohort alone (82: b 5, a 1) puts b first.
  assert.equal(last.scores.lastCohort['share@1'], 90);
});
