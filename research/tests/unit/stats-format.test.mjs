// Number display [M1-DESIGN.md 10.6]: p never 0, "< 0.001" below 0.001, three decimals with a
// leading zero; ratios 2 decimals below 10 and 1 from 10; percentages 1 decimal; null prints a dash;
// open bounds print words from the stats dictionary. Worked examples from the design (PR 2.11 with
// CI 1.43 to 3.12, numbers.json assoc). OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatP, formatNumber, formatCi } from '../../src/lib/stats/format.js';
import dict from '../../src/i18n/stats.js';

test('format: p-values', () => {
  assert.equal(formatP(0.0689), '0.069');
  // Below 0.05 never prints as 0.050 (review round 3): the decimals that keep it below.
  assert.equal(formatP(0.04998), '0.04998');
  assert.equal(formatP(0.001), '0.001');
  assert.equal(formatP(0.00099), '< 0.001');
  assert.equal(formatP(6.23e-5), '< 0.001');
  assert.equal(formatP(0), '< 0.001');
  assert.equal(formatP(1), '1.000');
  assert.equal(formatP(null), '—');
  assert.equal(formatP(NaN), '—');
  for (const p of [0, 1e-300, 0.0004, 0.00049]) assert.notEqual(formatP(p), '0.000');
});

test('format: numbers by kind', () => {
  assert.equal(formatNumber(2.112345679012346, { kind: 'ratio' }), '2.11');
  assert.equal(formatNumber(17.372514876633765, { kind: 'ratio' }), '17.4');
  assert.equal(formatNumber(1234.5, { kind: 'ratio' }), '1,234.5');
  assert.equal(formatNumber(0.004321, { kind: 'ratio' }), '0.00432');
  assert.equal(formatNumber(0.20054945054945056, { kind: 'proportion' }), '20.1%');
  assert.equal(formatNumber(0.0002, { kind: 'proportion' }), '0.02%');
  assert.equal(formatNumber(0, { kind: 'proportion' }), '0%');
  assert.equal(formatNumber(12.345, { kind: 'percent' }), '12.3%');
  assert.equal(formatNumber(728, { kind: 'count' }), '728');
  assert.equal(formatNumber(12345, { kind: 'count' }), '12,345');
  assert.equal(formatNumber(16, { kind: 'statistic' }), '16');
  assert.equal(formatNumber(13.914408480898441, { kind: 'statistic' }), '13.91');
  assert.equal(formatNumber(-1.3149999999999986, { kind: 'difference' }), '-1.31');
  assert.equal(formatNumber(0.12725988700564972, { kind: 'difference' }), '0.127');
  assert.equal(formatNumber(-0.0001, { kind: 'difference', digits: 2 }), '0.00');
  assert.equal(formatNumber(8.088e-5, { kind: 'statistic' }), '0.0000809');
  assert.equal(formatNumber(null, { kind: 'ratio' }), '—');
  assert.equal(formatNumber(Infinity, { kind: 'ratio' }), '∞');
  assert.equal(formatNumber(2.5, { kind: 'statistic', digits: 3 }), '2.500');
  assert.match(formatNumber(1e-20, { kind: 'statistic' }), /^1\.00e-20$/);
});

test('format: intervals in both languages, open bounds in words from the dictionary', () => {
  const pr = { value: 2.112345679012346, ci: [1.431994065027821, 3.1159376820150717], kind: 'ratio' };
  assert.equal(formatCi(pr, 'en'), '2.11 (1.43 to 3.12)');
  assert.equal(formatCi(pr, 'th'), '2.11 (1.43 ถึง 3.12)');
  const fisher = { value: Infinity, ci: [1.4494814670239329, Infinity], kind: 'ratio' };
  assert.equal(formatCi(fisher, 'en'), `∞ (1.45 to ${dict.en['stats.format.noUpper']})`);
  assert.equal(formatCi(fisher, 'th'), `∞ (1.45 ถึง ${dict.th['stats.format.noUpper']})`);
  assert.equal(formatCi({ value: 0.2, ci: [null, 0.3], kind: 'proportion' }, 'en'), '20.0% (— to 30.0%)');
  assert.equal(formatCi({ value: 3.2 }, 'en'), '3.20');
  assert.equal(formatCi({ value: -2, ci: [-Infinity, 1], kind: 'difference' }, 'en'), `-2 (${dict.en['stats.format.noLower']} to 1)`);
  for (const lang of ['th', 'en']) for (const k of ['stats.format.to', 'stats.format.noUpper', 'stats.format.noLower']) assert.ok(dict[lang][k], `${lang} ${k}`);
});

test('format: a share that is not 0 or 1 never prints as 0% or 100% (review round 2)', () => {
  assert.equal(formatNumber(0.9996, { kind: 'proportion' }), '99.96%');
  assert.equal(formatNumber(0.99996, { kind: 'proportion' }), '> 99.99%');
  assert.equal(formatNumber(1, { kind: 'proportion' }), '100.0%');
  assert.equal(formatNumber(0.00004, { kind: 'proportion' }), '< 0.01%');
  assert.equal(formatNumber(0.2005, { kind: 'proportion' }), '20.1%');
});

test('format: a p below 0.05 never prints at or above 0.05 (review round 3)', () => {
  assert.equal(formatP(0.0496), '0.0496');
  assert.equal(formatP(0.0495), '0.0495');
  assert.equal(formatP(0.04996), '0.04996');
  // Six decimals still round to 0.050000: the inequality, which is true, instead.
  assert.equal(formatP(0.0499999), '< 0.050');
  // At or above 0.05 it is on the same side as "0.050".
  assert.equal(formatP(0.05), '0.050');
  assert.equal(formatP(0.0500001), '0.050');
  assert.equal(formatP(0.0504), '0.050');
  assert.equal(formatP(0.0494), '0.049');
  // Every p from 0.04 to 0.06 in steps of 1e-6: the printed p is below 0.05 exactly when p is.
  for (let i = 40000; i <= 60000; i++) {
    const p = i / 1e6;
    const s = formatP(p);
    const printedBelow = s.startsWith('<') || Number(s) < 0.05;
    assert.equal(printedBelow, p < 0.05, `p ${p} printed ${s}`);
  }
});

test('format: a percent above 100 is not "> 99.99%" (review round 3)', () => {
  assert.equal(formatNumber(100.001, { kind: 'percent' }), '100.0%');
  assert.equal(formatNumber(100.04, { kind: 'percent' }), '100.0%');
  assert.equal(formatNumber(99.996, { kind: 'percent' }), '> 99.99%');
  assert.equal(formatNumber(-99.996, { kind: 'percent' }), '< -99.99%');
  assert.equal(formatNumber(1.00001, { kind: 'proportion' }), '100.0%');
});

test('format: a value judged against a threshold keeps its side of it (below / above, review round 3)', () => {
  // Chi-square's smallest expected count against Cochran's 1 and 5 (G5).
  const e = { kind: 'statistic', below: [1, 5] };
  assert.equal(formatNumber(4.996, e), '4.996');
  assert.equal(formatNumber(0.9996, e), '0.9996');
  assert.equal(formatNumber(4.9999999, e), '< 5.00');
  assert.equal(formatNumber(5.0004, e), '5.00');
  assert.equal(formatNumber(47.134078212290504, e), '47.13');
  // A share of cells above 20% never prints as 20.0%.
  assert.equal(formatNumber(0.2004, { kind: 'proportion', above: [0.2] }), '20.04%');
  assert.equal(formatNumber(0.2, { kind: 'proportion', above: [0.2] }), '20.0%');
  // Kappa against the course's band edges: 0.5996 is still "moderate".
  assert.equal(formatNumber(0.5996, { kind: 'statistic', below: [0.2, 0.4, 0.6, 0.8] }), '0.5996');
  assert.equal(formatNumber(0.65, { kind: 'statistic', below: [0.2, 0.4, 0.6, 0.8] }), '0.650');
  // The interval's bounds keep the same sides, and fixed digits too.
  assert.equal(formatCi({ value: 4.996, ci: [3.2, 4.9996], kind: 'statistic', below: [5] }, 'en'), '4.996 (3.20 to 4.9996)');
  assert.equal(formatNumber(4.996, { kind: 'statistic', digits: 2, below: [5] }), '4.996');
  // Without thresholds nothing changes.
  assert.equal(formatNumber(4.996, { kind: 'statistic' }), '5.00');
});
