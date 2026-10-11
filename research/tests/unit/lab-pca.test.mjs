// Principal component analysis [M3-DESIGN.md 3.1.4, C8]: correlation or covariance matrix of the complete rows, cyclic
// Jacobi eigen decomposition, the sign rule (largest absolute loading positive), biplot coordinates as
// biplot.prcomp(scale = 1). Pins: R 4.6.0 prcomp on USArrests (scaled) and iris (covariance),
// tests/fixtures/r/out/pca.json, compared at the iterative tolerance after the sign rule.
// STATS_INJECT=1 turns every pinned comparison red (stats-fixtures.mjs). OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jacobiEigen, pca, biplot, runPca } from '../../src/lib/stats/pca.js';
import { close, TOL, makeTable, spec, readJson } from './stats-fixtures.mjs';

const tol = TOL.iterative;
const FX = readJson('r/out/pca.json');

/** A table of the dataset's columns c0..c3, with row labels and a made-up two-level group. */
function tableOf(ds, { missingAt = null } = {}) {
  const cols = {};
  ds.columns.forEach((_, j) => { cols[`c${j}`] = { kind: 'number', values: ds.values.map((r, i) => (i === missingAt && j === 1 ? null : r[j])) }; });
  const labels = ds.rows || ds.values.map((_, i) => `row${i + 1}`);
  cols.name = { kind: 'category', levels: labels, values: labels };
  cols.half = { kind: 'category', levels: ['first', 'second'], values: ds.values.map((_, i) => (i < ds.values.length / 2 ? 'first' : 'second')) };
  return makeTable(cols);
}

const ITEMS = ['c0', 'c1', 'c2', 'c3'];

function checkCase(name, scale) {
  const ds = FX.datasets[name === 'usarrestsScaled' ? 'USArrests' : 'iris'];
  const w = FX.cases[name].values;
  const out = runPca(spec('mv.pca', { roles: { items: ITEMS, subject: 'name', group: 'half' }, options: { scale } }), tableOf(ds));
  assert.equal(out.status, 'ok');
  const n = ds.values.length;
  assert.equal(out.used, n);
  assert.deepEqual([out.values.n.value, out.values.nItems.value, out.values.nComponents.value], [n, 4, 4]);
  const comp = out.tables.find((t) => t.id === 'components');
  assert.deepEqual(comp.columns, ['component', 'eigenvalue', 'sdev', 'proportion', 'cumulative']);
  comp.rows.forEach((r, c) => {
    assert.equal(r[0], `PC${c + 1}`);
    close(r[1], w.eigenvalue[c], tol, `eigenvalue ${c + 1}`);
    close(r[2], w.sdev[c], tol, `sdev ${c + 1}`);
    close(r[3], w.proportion[c], tol, `proportion ${c + 1}`);
    close(r[4], w.cumulative[c], tol, `cumulative ${c + 1}`);
  });
  const L = out.tables.find((t) => t.id === 'loadings');
  assert.deepEqual(L.columns, ['item', 'pc1', 'pc2', 'pc3', 'pc4']);
  L.rows.forEach((r, i) => { assert.equal(r[0], ITEMS[i]); for (let c = 0; c < 4; c++) close(r[c + 1], w.loadings[i][c], tol, `loading ${i + 1},${c + 1}`); });
  const S = out.tables.find((t) => t.id === 'scores');
  assert.deepEqual(S.columns, ['rowId', 'subject', 'group', 'pc1', 'pc2', 'pc3', 'pc4']);
  S.rows.forEach((r, i) => { for (let c = 0; c < 4; c++) close(r[c + 3], w.scores[i][c], tol, `score ${i + 1},${c + 1}`); });
  if (ds.rows) assert.deepEqual(S.rows.map((r) => r[1]), ds.rows);
  const I = out.tables.find((t) => t.id === 'items');
  I.rows.forEach((r, j) => { close(r[1], w.center[j], tol, `centre ${j + 1}`); if (w.scale) close(r[2], w.scale[j], tol, `scale ${j + 1}`); });
  const P = out.tables.find((t) => t.id === 'biplotPoints');
  assert.deepEqual(P.columns, ['rowId', 'subject', 'group', 'pc1', 'pc2']);
  P.rows.forEach((r, i) => { close(r[3], w.biplotPoints[i][0], tol, `biplot point ${i + 1} x`); close(r[4], w.biplotPoints[i][1], tol, `biplot point ${i + 1} y`); });
  const A = out.tables.find((t) => t.id === 'biplotArrows');
  A.rows.forEach((r, j) => { close(r[1], w.biplotArrows[j][0], tol, `arrow ${j + 1} x`); close(r[2], w.biplotArrows[j][1], tol, `arrow ${j + 1} y`); });
  assert.ok(out.notes.some((x) => x.key === `lab.note.pcaScale.${scale}`));
  assert.ok(out.notes.some((x) => x.key === 'lab.note.pcaSigns'));
  return out;
}

test('USArrests, correlation matrix: eigenvalues, loadings, scores and biplot coordinates as prcomp (signs fixed)', () => {
  checkCase('usarrestsScaled', true);
});

test('iris measurements, covariance matrix: as prcomp(scale. = FALSE)', () => {
  checkCase('irisCovariance', false);
});

test('sign rule C8: in every component the largest absolute loading is positive', () => {
  const fit = pca(FX.datasets.USArrests.values, { scale: true });
  for (let c = 0; c < fit.k; c++) {
    const col = fit.loadings.map((r) => r[c]);
    const big = col.reduce((b, v) => (Math.abs(v) > Math.abs(b) ? v : b), 0);
    assert.ok(big > 0, `component ${c + 1}`);
  }
  // biplot() of the pure fit gives the same arrows as the table
  close(biplot(fit).arrows[0][0], FX.cases.usarrestsScaled.values.biplotArrows[0][0], tol, 'arrow from biplot()');
});

test('cyclic Jacobi on a small symmetric matrix: eigenvalues 3 and 1, orthonormal vectors', () => {
  const e = jacobiEigen([[2, 1], [1, 2]]);
  assert.ok(e.converged);
  const vals = [...e.values].sort((a, b) => b - a);
  assert.ok(Math.abs(vals[0] - 3) < 1e-14 && Math.abs(vals[1] - 1) < 1e-14);
  const [v0, v1] = [0, 1].map((j) => e.vectors.map((r) => r[j]));
  assert.ok(Math.abs(v0[0] * v1[0] + v0[1] * v1[1]) < 1e-14);
});

test('listwise: a row missing a measurement is dropped and counted, and the rest give prcomp on the other rows', () => {
  const ds = FX.datasets.USArrests;
  const out = runPca(spec('mv.pca', { roles: { items: ITEMS }, options: { scale: true } }), tableOf(ds, { missingAt: 3 }));
  assert.equal(out.used, 49);
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'c1', count: 1 }]);
  const ref = pca(ds.values.filter((_, i) => i !== 3), { scale: true });
  close(out.tables.find((t) => t.id === 'components').rows[0][1], ref.eigenvalues[0], 1e-12, 'first eigenvalue without row 4');
  assert.equal(out.tables.find((t) => t.id === 'scores').rows[0][1], null, 'no subject role: no label');
});

test('a constant measurement cannot be scaled: invalid, named in a note; with the covariance matrix it runs', () => {
  const tab = makeTable({ a: { kind: 'number', values: [1, 2, 3, 4] }, b: { kind: 'number', values: [5, 5, 5, 5] }, c: { kind: 'number', values: [2, 1, 4, 3] } });
  const bad = runPca(spec('mv.pca', { roles: { items: ['a', 'b', 'c'] }, options: { scale: true } }), tab);
  assert.equal(bad.status, 'invalid');
  assert.equal(bad.values.reason.reasonKey, 'lab.undefined.pcaConstantItem');
  assert.deepEqual(bad.notes, [{ id: 'constantItem', severity: 'note', key: 'lab.note.pcaConstantItem', params: { column: 'b' } }]);
  const cov = runPca(spec('mv.pca', { roles: { items: ['a', 'b', 'c'] }, options: { scale: false } }), tab);
  assert.equal(cov.status, 'ok');
  assert.ok(!cov.notes.some((x) => x.key === 'lab.note.pcaFewRows'), '4 rows, 3 measurements');
  const few = makeTable({ a: { kind: 'number', values: [1, 2, 4] }, b: { kind: 'number', values: [3, 1, 2] }, c: { kind: 'number', values: [2, 5, 1] } });
  const f = runPca(spec('mv.pca', { roles: { items: ['a', 'b', 'c'] } }), few);
  assert.deepEqual(f.notes.find((x) => x.key === 'lab.note.pcaFewRows').params, { n: 3, p: 3 });
  assert.ok(f.tables.find((t) => t.id === 'components').rows[2][1] < 1e-12, '3 rows carry at most 2 components of variance');
  const one = runPca(spec('mv.pca', { roles: { items: ['a'] } }), tab);
  assert.equal(one.values.reason.reasonKey, 'lab.undefined.pcaNeedTwoItems');
});
