// The data scorecard (scripts/scorecard.mjs) prints six numbers and the
// counts behind each. These tests pin its SHAPE and its arithmetic, never
// today's values: the numbers are meant to move as the bank improves.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  PROPERTIES, SLACK, MISSING_DEPENDENCY, dataGuards, loadContext,
  organised, correct, linked, retrievable, predictive, renderText, renderBacktest,
} from '../../scripts/scorecard.mjs';
import { missProbability, bandCoverage, randomCoverage, runBacktest } from '../../scripts/lib/backtest.mjs';

const near = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;

test('hypergeometric miss probability is exact on small cases', () => {
  // 2 marked among 5, draw 2: P(no marked) = C(3,2)/C(5,2) = 3/10.
  assert.ok(near(missProbability(5, 2, 2), 0.3));
  assert.equal(missProbability(5, 0, 3), 1);
  assert.equal(missProbability(5, 2, 4), 0);
  assert.equal(missProbability(5, 2, 0), 1);
});

test('band order covers its first band before a shuffle would', () => {
  // The only match sits in band 0 of size 2; a topic of 10.
  const bands = [{ n: 2, m: 1 }, { n: 3, m: 0 }, { n: 5, m: 0 }];
  assert.equal(bandCoverage(bands, 2), 1);
  assert.ok(near(randomCoverage(bands, 2), 0.2));
  // The match in the last band: the band order cannot reach it before depth 6.
  const late = [{ n: 2, m: 0 }, { n: 3, m: 0 }, { n: 5, m: 1 }];
  assert.equal(bandCoverage(late, 5), 0);
  assert.ok(near(bandCoverage(late, 6), 0.2));
  // At full depth both orders cover everything coverable.
  assert.equal(bandCoverage(late, 10), 1);
  assert.equal(randomCoverage(late, 10), 1);
});

test('dataGuards expands lint:data into node commands', () => {
  const pkg = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  const guards = dataGuards(pkg);
  assert.ok(guards.length >= 20, 'lint:data should expand to many guards');
  for (const g of guards) {
    assert.match(g.name, /^[\w:-]+$/);
    assert.match(g.cmd, /^node\s/);
  }
  assert.ok(!guards.some((g) => g.name === 'lint:dist'), 'the bundle guard is not a data guard');
  const fake = { scripts: { 'lint:data': 'npm run a && npm run b', a: 'node x.mjs --check', b: 'node y.mjs && npm run c', c: 'node z.mjs' } };
  assert.deepEqual(dataGuards(fake).map((g) => g.cmd), ['node x.mjs --check', 'node y.mjs', 'node z.mjs']);
});

test('guard output is classified by budget slack and missing dependencies', () => {
  assert.ok(SLACK.test('noSourceType: 2978 rows, under the budget of 3015; lower BUDGETS.noSourceType to 2978'));
  assert.ok(!SLACK.test('✓ provenance holds'));
  assert.ok(MISSING_DEPENDENCY.test("Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'sharp'"));
});

const isShare = (x) => x === null || (typeof x === 'number' && x >= 0 && x <= 100);

function assertProperty(p, { unit } = {}) {
  assert.equal(typeof p.label, 'string');
  if (unit === 'x') assert.ok(p.headline === null || (typeof p.headline === 'number' && p.headline >= 0));
  else assert.ok(isShare(p.headline), `headline ${p.headline} is a share`);
  const behind = Object.entries(p.behind);
  assert.ok(behind.length >= 2 && behind.length <= 8, 'two to eight counts behind the headline');
  for (const [, v] of behind) assert.ok(['number', 'string'].includes(typeof v));
  assert.equal(typeof p.total, 'number');
  assert.equal(typeof p.defects, 'object');
}

test('the bank-derived properties return a headline, counts and defect ids', async () => {
  const ctx = await loadContext();
  assert.ok(ctx.questions.length > 0);
  for (const fn of [organised, correct, linked, retrievable]) {
    const p = await fn(ctx);
    assertProperty(p);
    for (const ids of Object.values(p.defects)) {
      if (!Array.isArray(ids) || !ids.length || typeof ids[0] !== 'string') continue;
      for (const id of ids.slice(0, 50)) assert.match(id, /^[\w-]+:[\w-]+/, `${fn.name} defect ${id} is a subject:id key`);
    }
  }
  const p = await predictive(ctx);
  assertProperty(p, { unit: 'x' });
  const bt = p.backtest;
  assert.ok(Array.isArray(bt.subjects) && Array.isArray(bt.papers));
  for (const window of ['leaveOneOut', 'forward']) {
    for (const k of ['item.depth', 'item.panic', 'sibling.depth', 'sibling.panic']) {
      const w = bt.overall.windows[window][k];
      assert.ok(w.app <= bt.overall.items + 1e-6 && w.random <= bt.overall.items + 1e-6);
      assert.equal(w.papersBetter + w.papersWorse + w.papersTied, bt.overall.papers);
    }
  }
  assert.match(renderBacktest(bt), /too few papers to conclude|ALL/);
});

test('a hidden paper is never ranked against itself', () => {
  // Two cohorts sat the same item; hiding one leaves the other as a band-0 match.
  const mk = (id, cohort, extra = {}) => ({
    id, subject: 'demo', topic: 't', type: 'mcq', year: 5,
    q: 'สารใดเป็นยาปฏิชีวนะกลุ่ม tetracycline ที่ใช้รักษาโรค anaplasmosis ในโค',
    options: ['Oxytetracycline', 'Penicillin G', 'Ivermectin', 'Florfenicol'], answer: 0,
    sourceType: 'past-paper', examOrigin: `Demo final (Vet ${cohort})`, ...extra,
  });
  const filler = Array.from({ length: 8 }, (_, i) => ({
    id: 100 + i, subject: 'demo', topic: 't', type: 'mcq', year: 5,
    q: `คำถามเติมเต็มหมายเลข ${i} เกี่ยวกับการจัดการฟาร์มทั่วไปและสุขาภิบาลโรงเรือน`, options: ['a', 'b', 'c', 'd'], answer: 1,
  }));
  const bank = [...Array.from({ length: 5 }, (_, i) => mk(i + 1, 84)), ...Array.from({ length: 5 }, (_, i) => mk(i + 11, 85)), ...filler];
  const bt = runBacktest(bank, { rule: { minItems: 5, depth: 3, siblingStem: 0.25, minPapers: 1, minCoverable: 1 } });
  const byCohort = Object.fromEntries(bt.papers.map((p) => [p.cohort, p]));
  assert.ok(byCohort[84] && byCohort[85], 'both cohorts form a paper');
  // Leave-one-out: each paper finds the other cohort's copies.
  assert.equal(byCohort[84].windows.leaveOneOut.coverable.item, 5);
  // Forward: Vet 84 could not have seen Vet 85's paper; Vet 85 could see Vet 84's.
  assert.equal(byCohort[84].windows.forward.coverable.item, 0);
  assert.equal(byCohort[85].windows.forward.coverable.item, 5);
  // The copies are band 0 and the topic's first 3 hold them all.
  assert.ok(near(byCohort[85].windows.forward['item.depth'].app, 5));
  assert.ok(byCohort[85].windows.forward['item.depth'].random < 5);
});

test('the text report prints all six properties in order', () => {
  const p = { headline: 50, label: 'x', behind: { a: 1, b: 2 }, total: 2, defects: {} };
  const card = { bank: { deliverable: 2, held: 0 }, seconds: 1, properties: Object.fromEntries(PROPERTIES.map((n) => [n, n === 'predictive' ? { ...p, unit: 'x', headline: 1.1 } : p])) };
  const text = renderText(card);
  const order = ['Organised', 'Correct', 'Linked', 'Retrievable', 'Stable', 'Predictive'].map((t) => text.indexOf(t));
  assert.ok(order.every((i, j) => i > 0 && (j === 0 || i > order[j - 1])));
  assert.match(text, /1\.10?x|1\.1x/);
});
