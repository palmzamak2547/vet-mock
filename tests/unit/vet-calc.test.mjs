// ============================================================
// vet-calc.test.mjs — the numbers a student copies from the calculator
// ============================================================
// Two defects found in review (B73):
//   • Fluid: the daily maintenance was divided by the correction window, so
//     any window shorter than 24 h over-infused. A 4 kg cat at 7% corrected
//     over 12 h was told 43.3 mL/h; the deficit share plus the hourly share
//     of the daily maintenance is 33.3 mL/h.
//   • CRI: the tab's own worked example said "ดูดยา ≈ 1.5 mL" while the tab
//     itself computes 3.75 mL. 1.5 mL would deliver 2 µg/kg/min, not 5.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { fluidPlan, criPlan, CRI_EXAMPLE } from '../../src/lib/vet-calc.js';

const calc = readFileSync(new URL('../../src/components/VetCalculator.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('a 24 h correction window gives the same rate as before', () => {
  const p = fluidPlan({ bw: 4, dehydPct: 7, hours: 24 });
  assert.equal(p.deficit, 280);
  assert.equal(p.maint, 240);
  assert.equal(p.total, 520);
  assert.equal(p.ratePerHr, 21.7);
});

test('maintenance is a daily volume whatever the correction window', () => {
  // deficit 280 mL over 12 h = 23.3 mL/h, maintenance 240 mL/day = 10 mL/h
  assert.equal(fluidPlan({ bw: 4, dehydPct: 7, hours: 12 }).ratePerHr, 33.3);
  // 280/6 + 10 = 56.7
  assert.equal(fluidPlan({ bw: 4, dehydPct: 7, hours: 6 }).ratePerHr, 56.7);
  // The old arithmetic, (deficit + maintenance) / window, over-infused.
  assert.notEqual(fluidPlan({ bw: 4, dehydPct: 7, hours: 12 }).ratePerHr, Math.round((520 / 12) * 10) / 10);
});

test('the ongoing-loss estimate is daily, like maintenance', () => {
  // 280/12 + (240 + 120)/24 = 23.33 + 15 = 38.3
  const p = fluidPlan({ bw: 4, dehydPct: 7, hours: 12, ongoing: 120 });
  assert.equal(p.ratePerHr, 38.3);
  assert.equal(p.rateAfter, 15);
  assert.equal(p.total, 640);
});

test('empty or impossible input shows a dash, never NaN', () => {
  assert.deepEqual(fluidPlan({ bw: '', dehydPct: '' }), { deficit: null, maint: null, total: null, ratePerHr: null, rateAfter: null });
  assert.equal(fluidPlan({ bw: 4, dehydPct: 7, hours: 0 }).ratePerHr, null);
  assert.equal(criPlan({ bw: 20, target: 5, stock: 40, bag: 250, rate: 0 }).drugMl, null);
});

test('the CRI worked example is what the tab computes, and delivers the target', () => {
  const p = criPlan(CRI_EXAMPLE);
  assert.equal(p.mgPerHr, 6);
  assert.equal(p.concNeeded, 0.6);
  assert.equal(p.drugMl, 3.75);
  // Round trip the note tells the student to do: conc × rate ÷ BW × 1000/60.
  const conc = (p.drugMl * CRI_EXAMPLE.stock) / CRI_EXAMPLE.bag;
  const back = (conc * CRI_EXAMPLE.rate) / CRI_EXAMPLE.bw * 1000 / 60;
  assert.ok(Math.abs(back - CRI_EXAMPLE.target) < 1e-9, `round trip gives ${back} µg/kg/min`);
});

test('the calculator screen uses these helpers and prints the example from them', () => {
  assert.match(calc, /from '\.\.\/lib\/vet-calc\.js'/);
  assert.match(calc, /fluidPlan\(/);
  assert.match(calc, /criPlan\(CRI_EXAMPLE\)/);
  assert.doesNotMatch(calc, /ดูดยา ≈ 1\.5 mL/, 'the hand-typed wrong example is gone');
  assert.doesNotMatch(calc, /total \/ hr/, 'no whole-day volume divided by the correction window');
});
