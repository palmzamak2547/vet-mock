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
  assert.equal(formatP(0.04998), '0.050');
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
