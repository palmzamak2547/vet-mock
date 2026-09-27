// OLS by Householder QR [M1-DESIGN.md 7.11]. Pins: NIST StRD linear least squares (published/nist/:
// Norris, Longley, Wampler4 with the LRE thresholds of published/nist/fixture.json) and R 4.6.0
// summary(lm()) (r/out/ols.json, rparity role: simple, one-way with treatment contrasts, no
// intercept). Cross-check: SciPy 1.17.1 (ols.simple). OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { olsQr, runOls } from '../../src/lib/stats/ols.js';
import { readJson, readText, close, lre, TOL, makeTable, groupsTable, spec } from './stats-fixtures.mjs';

const NIST = readJson('published/nist/nist.json');
const NIST_FIX = readJson('published/nist/fixture.json');
const R = readJson('r/out/ols.json');
const SCIPY = readJson('crosscheck/scipy-crosscheck.json');
const D = SCIPY.datasets;

const DESIGN = {
  Longley: (r) => [1, ...r.slice(1)],
  Norris: (r) => [1, r[1]],
  Wampler4: (r) => [1, r[1], r[1] ** 2, r[1] ** 3, r[1] ** 4, r[1] ** 5],
};

test('OLS: NIST StRD certified coefficients and standard errors (LRE)', () => {
  assert.equal(NIST_FIX._fixture.family, 'nist-strd');
  for (const [name, build] of Object.entries(DESIGN)) {
    const rows = NIST[name].rows;
    const f = olsQr(rows.map(build), rows.map((r) => r[0]));
    const min = NIST_FIX.minLRE[name];
    for (const [i, b, s] of NIST[name].cert) {
      const lb = lre(f.coef[i], b);
      const ls = lre(f.se[i], s);
      assert.ok(lb >= min.coef, `NIST ${name} b${i}: LRE ${lb.toFixed(2)} < ${min.coef}`);
      assert.ok(ls >= min.se, `NIST ${name} se(b${i}): LRE ${ls.toFixed(2)} < ${min.se}`);
    }
  }
});

test('OLS: R 4.6.0 pins (r/out/ols.json)', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  const check = (f, v, call) => {
    v.coef.forEach((b, i) => close(f.coef[i], b, TOL.closed, `R ${call} coef[${i}]`));
    v.se.forEach((s, i) => close(f.se[i], s, TOL.closed, `R ${call} se[${i}]`));
    v.t.forEach((t, i) => close(f.t[i], t, TOL.closed, `R ${call} t[${i}]`));
    v.p.forEach((p, i) => close(f.p[i], p, 1e-9, `R ${call} p[${i}]`));
    for (const k of ['df', 'sigma', 'r2', 'adjR2', 'F', 'pF']) close(f[k], v[k], k === 'pF' ? 1e-9 : TOL.closed, `R ${call} ${k}`);
  };
  const s = R.cases['simple.corr'];
  check(olsQr(D.corr.x.map((x) => [1, x]), D.corr.y), s.values, s.call);
  const o = R.cases['oneway.three'];
  const y = [...D.three.A, ...D.three.B, ...D.three.C];
  const X = [...D.three.A.map(() => [1, 0, 0]), ...D.three.B.map(() => [1, 1, 0]), ...D.three.C.map(() => [1, 0, 1])];
  check(olsQr(X, y), o.values, o.call);
  const n = R.cases['noIntercept.corr'];
  check(olsQr(D.corr.x.map((x) => [x]), D.corr.y), n.values, n.call);
});

test('OLS: SciPy cross-check', () => {
  const c = SCIPY['ols.simple'];
  const f = olsQr(D.corr.x.map((x) => [1, x]), D.corr.y);
  close(f.coef[1], c.slope, 1e-12, 'scipy slope');
  close(f.se[1], c.slopeSE, 1e-12, 'scipy slope SE');
  close(f.r2, c.r2, 1e-12, 'scipy r2');
  const b = SCIPY['ols.largeScaleX'];
  const big = R.cases.largeScaleX;
  const g = olsQr(big.x.map((x) => [1, x]), big.y);
  close(g.coef[1], b.slope, 1e-12, 'scipy slope (x from 1e10 to 1e12)');
  close(g.se[1], b.slopeSE, 1e-12, 'scipy slope SE (x from 1e10 to 1e12)');
  close(g.t[1], b.t, 1e-12, 'scipy t (x from 1e10 to 1e12)');
  close(g.p[1], b.pSlope, 1e-9, 'scipy p (x from 1e10 to 1e12)');
});

test('a real slope on a large-scale x is never taken for rounding (review round 3, R 4.6.0 largeScaleX)', () => {
  // x from 1e10 to 1e12 copies/mL, y near 300,000 g: slope 9.95e-8 per copy, t 232. The old rule
  // (|b| < 1e-12 max|y|) printed it as 0 with an interval of -8.8e-10 to 8.8e-10 beside that t.
  const c = R.cases.largeScaleX;
  const v = c.values;
  const out = runOls(spec('reg.ols', { roles: { outcome: 'y', covariates: ['x'] } }), makeTable({ x: { kind: 'number', values: c.x }, y: { kind: 'number', values: c.y } }));
  assert.equal(out.notes, undefined, 'no coefficient zeroed');
  const [term, b, s, t, p, lo, hi] = out.tables[0].rows[1];
  assert.equal(term, 'x');
  close(b, v.coef[1], TOL.closed, 'R slope');
  close(s, v.se[1], TOL.closed, 'R slope SE');
  close(t, v.t[1], TOL.closed, 'R t');
  close(p, v.p[1], 1e-9, 'R p');
  close(lo, v.lower[1], TOL.closed, 'R confint lower');
  close(hi, v.upper[1], TOL.closed, 'R confint upper');
  close(out.tables[0].rows[0][1], v.coef[0], TOL.closed, 'R intercept');
  // The rule does not depend on the units of x: the same data in 1e10 copies/mL gives slope x 1e10.
  const scaled = runOls(spec('reg.ols', { roles: { outcome: 'y', covariates: ['x'] } }), makeTable({ x: { kind: 'number', values: c.x.map((x) => x / 1e10) }, y: { kind: 'number', values: c.y } }));
  close(scaled.tables[0].rows[1][1], v.coef[1] * 1e10, 1e-9, 'slope per 1e10 copies');
});

test('the rounding rule sits below 1e-10 of the spread of y: a term that small is still shown (review round 3)', () => {
  // y = x1 + 1e-14 x2 by construction, x2 in the millions: the x2 term is 1.5e-10 of the spread of y,
  // 1e5 times the rounding of y itself, so the fit recovers 1e-14 to about 6 digits (rounding y to
  // doubles moves it by ~1e-6 relative). A threshold of 1e-9 or the old |b| < 1e-12 max|y| zeroes it.
  const x1 = [100, 250, 400, 550, 700, 1000];
  const x2 = [3e6, -1e6, 4e6, -1e6, -5e6, 9e6];
  const y = x1.map((v, i) => v + 1e-14 * x2[i]);
  const f = olsQr(x1.map((v, i) => [1, v, x2[i]]), y);
  assert.deepEqual(f.noise, [true, false, false], 'only the intercept (exactly 0 by construction) is rounding');
  close(f.coef[2], 1e-14, 1e-4, 'x2 coefficient');
  assert.ok(Math.abs(f.coef[2]) < 1e-12 * Math.max(...y), 'the old rule would have printed it as 0');
});

test('a slope that is rounding noise shows 0 with the t, p and interval of 0 (review round 3)', () => {
  // y is symmetric about the middle x, so the exact least-squares slope is 0: sum (x - 0.3)(y - 1.5) =
  // -0.2 x -0.4 - 0.1 x 0.8 + 0 + 0.1 x 0.8 + 0.2 x -0.4 = 0. QR gives about 5e-16.
  const x = [0.1, 0.2, 0.3, 0.4, 0.5];
  const y = [1.1, 2.3, 0.7, 2.3, 1.1];
  const f = olsQr(x.map((v) => [1, v]), y);
  assert.ok(f.coef[1] !== 0 && Math.abs(f.coef[1]) < 1e-14, `raw slope ${f.coef[1]}`);
  assert.deepEqual(f.noise, [false, true]);
  const out = runOls(spec('reg.ols', { roles: { outcome: 'y', covariates: ['x'] } }), makeTable({ x: { kind: 'number', values: x }, y: { kind: 'number', values: y } }));
  const [, b, s, t, p, lo, hi] = out.tables[0].rows[1];
  assert.equal(b, 0);
  // By hand: residual SS = sum (y - 1.5)^2 = 2.24 on 3 df, Sxx = 0.1, so SE = sqrt(2.24 / 3 / 0.1).
  close(s, Math.sqrt(2.24 / 3 / 0.1), 1e-12, 'slope SE by hand');
  assert.equal(t, 0);
  assert.equal(p, 1);
  assert.equal(lo, -hi);
  // qt(0.975, 3) = 3.1824463052837078 in R 4.6.0 (webR 0.6.0) and SciPy 1.17.1.
  close(hi, 3.1824463052837078 * s, 1e-12, 'interval of 0: qt(0.975, 3) x SE');
  assert.equal(out.notes?.[0]?.key, 'stats.note.coefZero');
  close(out.tables[0].rows[0][1], 1.5, 1e-12, 'intercept = mean of y');
});

test('OLS: an aliased column gets no coefficient, like R', () => {
  const X = [[1, 1, 2], [1, 2, 4], [1, 3, 6], [1, 4, 8.0000000001e0], [1, 5, 10]].map((r, i) => (i === 3 ? [1, 4, 8] : r));
  const f = olsQr(X, [1, 3, 2, 5, 4]);
  assert.equal(f.coef[2], null);
  assert.equal(f.aliased[2], true);
  assert.ok(f.coef[1] !== null);
});

test('OLS: runOls with a category covariate (treatment contrasts, reference = first level)', () => {
  const t = groupsTable({ A: D.three.A, B: D.three.B, C: D.three.C });
  const out = runOls(spec('reg.ols', { roles: { outcome: 'y', covariates: ['g'] }, options: { intercept: true } }), t);
  assert.equal(out.status, 'ok');
  const rows = out.tables[0].rows;
  assert.deepEqual(rows.map((r) => r[0]), ['(Intercept)', 'g=B', 'g=C']);
  close(rows[1][1], R.cases['oneway.three'].values.coef[1], TOL.closed, 'runOls gB');
  close(out.tests[0].p, R.cases['oneway.three'].values.pF, 1e-9, 'runOls overall F p');
  const ref = runOls(spec('reg.ols', { roles: { outcome: 'y', covariates: ['g'] }, levels: { referenceLevel: 'B' } }), t);
  assert.deepEqual(ref.tables[0].rows.map((r) => r[0]), ['(Intercept)', 'g=A', 'g=C']);
  const num = makeTable({ x: { kind: 'number', values: D.corr.x }, y: { kind: 'number', values: D.corr.y } });
  const simple = runOls(spec('reg.ols', { roles: { outcome: 'y', covariates: ['x'] } }), num);
  close(simple.values.r2.value, R.cases['simple.corr'].values.r2, TOL.closed, 'runOls r2');
});

// NIST StRD Pontius (lower difficulty, y = B0 + B1 x + B2 x^2, 40 observations), downloaded
// unchanged on 2026-09-27 from https://www.itl.nist.gov/div898/strd/lls/data/LINKS/DATA/Pontius.dat
// into fixtures/stats/nist-strd/ (sha-256 in its README). The certified values are parsed from the
// file's own header, so no number is typed twice. Threshold: LRE >= 9 for every coefficient,
// standard error, the residual SD and R-squared (engine.md 6.1, lower difficulty).
test('OLS: NIST StRD Pontius (quadratic, lower difficulty), LRE >= 9', () => {
  const text = readText('stats/nist-strd/Pontius.dat').split(/\r?\n/);
  const cert = text.filter((l) => /^\s+B\d\s/.test(l)).map((l) => l.trim().split(/\s+/)).map(([b, est, sd]) => [Number(b.slice(1)), Number(est), Number(sd)]);
  assert.equal(cert.length, 3);
  const sigma = Number(text.find((l) => /Standard Deviation\s+\S+\s*$/.test(l) && !/Estimate/.test(l)).trim().split(/\s+/).pop());
  const r2 = Number(text.find((l) => /R-Squared/.test(l)).trim().split(/\s+/).pop());
  const start = text.findIndex((l) => /^Data:\s+y\s+x/.test(l));
  const rows = text.slice(start + 1).map((l) => l.trim()).filter(Boolean).map((l) => l.split(/\s+/).map(Number));
  assert.equal(rows.length, 40);
  const f = olsQr(rows.map(([, x]) => [1, x, x * x]), rows.map(([y]) => y));
  for (const [i, b, s] of cert) {
    assert.ok(lre(f.coef[i], b) >= 9, `Pontius b${i}: LRE ${lre(f.coef[i], b).toFixed(2)}`);
    assert.ok(lre(f.se[i], s) >= 9, `Pontius se(b${i}): LRE ${lre(f.se[i], s).toFixed(2)}`);
  }
  assert.ok(lre(f.sigma, sigma) >= 9, `Pontius sigma: LRE ${lre(f.sigma, sigma).toFixed(2)}`);
  assert.ok(lre(f.r2, r2) >= 9, `Pontius R2: LRE ${lre(f.r2, r2).toFixed(2)}`);
});

test('ols: an exact fit withholds t, F and p-values with a sentence (review round 1)', () => {
  const f = olsQr([[1, 1], [1, 2], [1, 3]], [2, 4, 6], { intercept: true });
  assert.equal(f.perfectFit, true);
  assert.deepEqual(f.p, [null, null]);
  assert.equal(f.F, null);
  close(f.coef[1], 2, 1e-12, 'slope still reported');
  const out = runOls(spec('reg.ols', { roles: { outcome: 'y', covariates: ['x'] } }), makeTable({ y: { kind: 'number', values: [2, 4, 6, 8] }, x: { kind: 'number', values: [1, 2, 3, 4] } }));
  assert.equal(out.values.sigma.noteKey, 'stats.note.perfectFit');
  assert.equal(out.tests[0].p, null);
  assert.equal(out.tests[0].reasonKey, 'stats.note.perfectFit');
  assert.equal(olsQr([[1, 1], [1, 2], [1, 3], [1, 4]], [2, 4.1, 5.9, 8.2], { intercept: true }).perfectFit, false);
});

test('a coefficient that is rounding noise prints as 0 with a note (review round 2)', async () => {
  const { runOls } = await import('../../src/lib/stats/ols.js');
  const table = { n: 4, rowIds: ['a', 'b', 'c', 'd'], columns: {
    y: { kind: 'number', values: new Float64Array([2, 4, 6, 8]), missing: new Uint8Array(4) },
    x: { kind: 'number', values: new Float64Array([1, 2, 3, 4]), missing: new Uint8Array(4) },
  } };
  const out = runOls({ method: 'reg.ols', roles: { outcome: 'y', covariates: ['x'] }, options: { confLevel: 0.95 } }, table);
  const intercept = out.tables[0].rows.find((r) => r[0] === '(Intercept)');
  // olsQr gives -1.78e-15 here (the exact answer is 0).
  assert.equal(intercept[1], 0, `intercept ${intercept[1]}`);
  assert.equal(out.notes?.[0]?.key, 'stats.note.coefZero');
  assert.ok(Math.abs(out.tables[0].rows.find((r) => r[0] === 'x')[1] - 2) < 1e-12);
});
