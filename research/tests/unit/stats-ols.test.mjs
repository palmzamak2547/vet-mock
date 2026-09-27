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
