// Descriptive statistics [M1-DESIGN.md 7.3]. Pins: R 4.6.0 (r/out/descriptive.json: mean, sd, se,
// min, max and type 7 / type 6 quartiles, rparity role) and NIST StRD univariate summary statistics
// (stats/nist-strd/: certified mean and SD, LRE >= 9 at the lower and average levels, >= 8 for NumAcc4).
// Cross-check: SciPy 1.17.1 (crosscheck/scipy-crosscheck.json desc.quantiles). OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summary, quantile, frequency, runSummary } from '../../src/lib/stats/descriptive.js';
import { readJson, readText, close, lre, TOL, makeTable, spec } from './stats-fixtures.mjs';

const R = readJson('r/out/descriptive.json');
const SCIPY = readJson('crosscheck/scipy-crosscheck.json');
const NIST = readJson('stats/nist-strd/fixture.json');

function rData(name) {
  const d = SCIPY.datasets;
  switch (name) {
    case 'quantiles': case 'quantiles.tails': return d.quantiles;
    case 'two.g1': return d.two.g1;
    case 'two.g2': return d.two.g2;
    case 'three.C': return d.three.C;
    case 'corr.x': return d.corr.x;
    case 'odd11': return Array.from({ length: 11 }, (_, i) => i + 1);
    default: throw new Error(`no data for ${name}`);
  }
}

test('descriptive: R 4.6.0 pins (r/out/descriptive.json)', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  for (const [name, c] of Object.entries(R.cases)) {
    const x = rData(name);
    const v = c.values;
    if (name === 'quantiles.tails') {
      const s = x.slice().sort((a, b) => a - b);
      v.probs.forEach((p, i) => {
        close(quantile(s, p, 7), v.type7[i], TOL.closed, `R ${c.call} type 7 p=${p}`);
        close(quantile(s, p, 6), v.type6[i], TOL.closed, `R ${c.call} type 6 p=${p}`);
      });
      continue;
    }
    const s7 = summary(x, { quantileType: 7 });
    const s6 = summary(x, { quantileType: 6 });
    assert.equal(s7.n, v.n, `R ${c.call} n`);
    for (const k of ['mean', 'sd', 'se', 'min', 'max']) close(s7[k], v[k], TOL.closed, `R ${c.call} ${k}`);
    close(s7.q1, v.q1Type7, TOL.closed, `R ${c.call} q1 type 7`);
    close(s7.median, v.medianType7, TOL.closed, `R ${c.call} median type 7`);
    close(s7.q3, v.q3Type7, TOL.closed, `R ${c.call} q3 type 7`);
    close(s6.q1, v.q1Type6, TOL.closed, `R ${c.call} q1 type 6`);
    close(s6.median, v.medianType6, TOL.closed, `R ${c.call} median type 6`);
    close(s6.q3, v.q3Type6, TOL.closed, `R ${c.call} q3 type 6`);
  }
});

test('descriptive: SciPy cross-check (desc.quantiles)', () => {
  const c = SCIPY['desc.quantiles'];
  const s7 = summary(SCIPY.datasets.quantiles, { quantileType: 7 });
  const s6 = summary(SCIPY.datasets.quantiles, { quantileType: 6 });
  close(s7.mean, c.mean, TOL.closed, 'scipy mean');
  close(s7.sd, c.sd, TOL.closed, 'scipy sd');
  close(s7.se, c.se, TOL.closed, 'scipy se');
  assert.deepEqual([s7.q1, s7.median, s7.q3], c.type7);
  assert.deepEqual([s6.q1, s6.median, s6.q3], c.type6);
});

function parseUniv(name) {
  const lines = readText(`stats/nist-strd/${name}.dat`).split(/\r?\n/);
  const cert = (re) => Number(lines.find((l) => re.test(l)).split(':')[1].trim().split(/\s+/)[0]);
  const di = lines.findLastIndex((l) => /^Data:/.test(l));
  const x = lines.slice(di + 1).map((l) => l.trim()).filter((l) => /^-?[0-9.]+(E[-+]?\d+)?$/i.test(l)).map(Number);
  return { x, mean: cert(/Sample Mean/), sd: cert(/Sample Standard Deviation/) };
}

test('descriptive: NIST StRD univariate, certified mean and SD (LRE)', () => {
  assert.equal(NIST._fixture.family, 'nist-strd');
  for (const [level, names] of Object.entries(NIST.univariate)) {
    const min = NIST.minLRE[level];
    for (const name of names) {
      const d = parseUniv(name);
      const s = summary(d.x, { quantileType: 7 });
      const lm = lre(s.mean, d.mean);
      const ls = lre(s.sd, d.sd);
      assert.ok(lm >= min, `NIST ${name} (${level}) mean LRE ${lm.toFixed(2)} < ${min}`);
      assert.ok(ls >= min, `NIST ${name} (${level}) SD LRE ${ls.toFixed(2)} < ${min}`);
    }
  }
});

test('descriptive: missing values are counted, never used, and n < 2 gives no SD', () => {
  const s = summary([3, NaN, 5, NaN], { quantileType: 7 });
  assert.equal(s.n, 2);
  assert.equal(s.missing, 2);
  assert.equal(s.mean, 4);
  const one = summary([7], { quantileType: 7 });
  assert.equal(one.sd, null);
  assert.equal(one.se, null);
  assert.equal(one.median, 7);
  const none = summary([NaN], { quantileType: 7 });
  assert.equal(none.n, 0);
  assert.equal(none.mean, null);
});

test('descriptive: frequency uses the known values as the denominator', () => {
  const f = frequency([0, 1, 1, -1, 2, -1], ['a', 'b', 'c']);
  assert.equal(f.known, 4);
  assert.equal(f.missing, 2);
  assert.deepEqual(f.levels.map((l) => l.count), [1, 2, 1]);
  assert.equal(f.levels[1].percent, 50);
  assert.equal(frequency([-1], ['a']).levels[0].percent, null);
});

test('descriptive: runSummary on a WorkingTable (rows dropped for a missing value are counted)', () => {
  const t = makeTable({
    w: { kind: 'number', values: [2, 4, 4, 5, null, 7, 9, 10, 12] },
    g: { kind: 'category', levels: ['x', 'y'], values: ['x', 'x', 'x', 'x', 'y', 'y', 'y', 'y', 'y'] },
  });
  const out = runSummary(spec('desc.summary', { roles: { x: 'w' } }), t);
  assert.equal(out.status, 'ok');
  assert.equal(out.values.n.value, 8);
  assert.equal(out.values.mean.value, 6.625);
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'w', count: 1 }]);
  const byGroup = runSummary(spec('desc.summary', { roles: { x: 'w', group: 'g' } }), t);
  assert.deepEqual(byGroup.tables[0].rows.map((r) => r[0]), ['all', 'x', 'y']);
  assert.equal(byGroup.tables[0].rows[1][1], 4);
  // an excluded row (recipe step) is skipped and not counted here; run.js counts it from the recipe
  const t2 = makeTable({ w: { kind: 'number', values: [1, 2, 100] } }, { excluded: { r3: 's4' } });
  const out2 = runSummary(spec('desc.summary', { roles: { x: 'w' } }), t2);
  assert.equal(out2.values.max.value, 2);
  assert.deepEqual(out2.dropped, []);
});
