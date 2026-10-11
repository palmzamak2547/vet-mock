// Principal component analysis [M3-DESIGN.md 3.1.4, C8]. OWNER: lab role.
//
// The complete rows (listwise; rows missing a measurement are dropped and counted per column) are centred and,
// when `scale` is true, divided by each column's SD (divisor n - 1): the correlation matrix; otherwise the
// covariance matrix. Its symmetric eigen decomposition is the cyclic Jacobi method (own code, no dependency):
// sweeps of plane rotations until the off-diagonal norm is below 1e-14 of the diagonal norm. Eigenvalues are
// sorted largest first; sdev = sqrt(eigenvalue), as R's prcomp (which takes the SVD of the scaled data, the same
// numbers). Sign rule C8: in each component the loading of largest absolute value is positive, and the scores
// flip with it, so the result does not depend on the arithmetic's choice of sign. Components: min(n, p), as
// prcomp. Biplot coordinates as R's biplot.prcomp(scale = 1): lam = sdev * sqrt(n) for the first two components,
// points = scores / lam, arrows = loadings * lam.
//
// runPca output:
//   values  n (rows used), nItems, nComponents
//   tables  'components'   [component, eigenvalue, sdev, proportion, cumulative] (proportion of the total variance,
//                          0 to 1; component 'PC1', 'PC2', ...)
//           'loadings'     [item, pc1, ..., pck] one row per measurement (item = column key; the column ids are
//                          lower case, their words lab.col.pc1 ... read PC1 ...)
//           'scores'       [rowId, subject, group, pc1, ..., pck] one row per row used (subject and group are the
//                          labels of those roles, or null)
//           'items'        [item, mean, sd] the centre and the SD of each measurement (the SD divides only when
//                          scale is true)
//           'biplotPoints' [rowId, subject, group, pc1, pc2] and 'biplotArrows' [item, pc1, pc2] (with two or more
//                          components)
//   notes   lab.note.pcaScale.true | .false, lab.note.pcaSigns, lab.note.pcaFewRows {n, p} (rows not above the
//           number of measurements)
//   invalid lab.undefined.pcaNeedTwoItems, lab.undefined.pcaFewRows, lab.undefined.pcaConstantItem (with the note
//           lab.note.pcaConstantItem {column}: a measurement with one value cannot be scaled to SD 1),
//           lab.invalid.pcaNotConverged
import { mean, ksum, val, role, completeRows, column, isMissing, invalid } from './common.js';
import { cellLabel } from './auc.js';

/**
 * Eigen decomposition of a symmetric matrix by the cyclic Jacobi method.
 * @param {number[][]} S  symmetric, p x p (not modified)
 * @param {{ tol?: number, maxSweeps?: number }} [opts]
 * @returns {{ values: number[], vectors: number[][], sweeps: number, converged: boolean }}
 *   values unsorted; vectors[r][j] is row r of eigenvector j (eigenvectors are the columns)
 */
export function jacobiEigen(S, opts = {}) {
  const tol = opts.tol ?? 1e-14;
  const maxSweeps = opts.maxSweeps ?? 100;
  const p = S.length;
  const A = S.map((r) => r.slice());
  const V = Array.from({ length: p }, (_, i) => Array.from({ length: p }, (_, j) => (i === j ? 1 : 0)));
  let sweeps = 0;
  let converged = false;
  for (; sweeps <= maxSweeps; sweeps++) {
    let off = 0;
    let diag = 0;
    for (let i = 0; i < p; i++) {
      diag += A[i][i] * A[i][i];
      for (let j = 0; j < p; j++) if (i !== j) off += A[i][j] * A[i][j];
    }
    if (off === 0 || Math.sqrt(off) <= tol * Math.sqrt(diag)) { converged = true; break; }
    if (sweeps === maxSweeps) break;
    for (let r = 0; r < p - 1; r++) {
      for (let q = r + 1; q < p; q++) {
        const apq = A[r][q];
        if (apq === 0) continue;
        // the rotation that zeroes A[r][q] (Rutishauser's stable form: |t| <= 1)
        const theta = (A[q][q] - A[r][r]) / (2 * apq);
        const t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < p; k++) {
          const akr = A[k][r];
          const akq = A[k][q];
          A[k][r] = c * akr - s * akq;
          A[k][q] = s * akr + c * akq;
        }
        for (let k = 0; k < p; k++) {
          const ark = A[r][k];
          const aqk = A[q][k];
          A[r][k] = c * ark - s * aqk;
          A[q][k] = s * ark + c * aqk;
        }
        for (let k = 0; k < p; k++) {
          const vkr = V[k][r];
          const vkq = V[k][q];
          V[k][r] = c * vkr - s * vkq;
          V[k][q] = s * vkr + c * vkq;
        }
      }
    }
  }
  return { values: A.map((row, i) => row[i]), vectors: V, sweeps, converged };
}

/**
 * PCA of a complete data matrix.
 * @param {number[][]} X   n rows x p columns, no missing values
 * @param {{ scale?: boolean }} [opts]
 * @returns {{ ok: true, n: number, p: number, k: number, center: number[], sd: number[], eigenvalues: number[], sdev: number[],
 *   proportion: number[], cumulative: number[], loadings: number[][], scores: number[][], sweeps: number }
 *   | { ok: false, reasonKey: string, column?: number }}
 *   loadings[r][j]: measurement r on component j; scores[i][j]: row i on component j; k = min(n, p) components
 */
export function pca(X, opts = {}) {
  const scale = opts.scale !== false;
  const n = X.length;
  const p = n ? X[0].length : 0;
  if (p < 2) return { ok: false, reasonKey: 'lab.undefined.pcaNeedTwoItems' };
  if (n < 2) return { ok: false, reasonKey: 'lab.undefined.pcaFewRows' };
  const center = Array.from({ length: p }, (_, j) => mean(X.map((r) => r[j])));
  const D = X.map((r) => r.map((v, j) => v - center[j]));
  const sd = Array.from({ length: p }, (_, j) => Math.sqrt(ksum(D.map((r) => r[j] * r[j])) / (n - 1)));
  if (scale) {
    const flat = sd.findIndex((s) => !(s > 0));
    if (flat >= 0) return { ok: false, reasonKey: 'lab.undefined.pcaConstantItem', column: flat };
  }
  const Z = scale ? D.map((r) => r.map((v, j) => v / sd[j])) : D;
  const S = Array.from({ length: p }, (_, a) => Array.from({ length: p }, (_, b) => ksum(Z.map((r) => r[a] * r[b])) / (n - 1)));
  // exact symmetry before the rotations
  for (let a = 0; a < p; a++) for (let b = 0; b < a; b++) S[a][b] = S[b][a];
  const e = jacobiEigen(S);
  if (!e.converged) return { ok: false, reasonKey: 'lab.invalid.pcaNotConverged' };
  const order = e.values.map((_, j) => j).sort((a, b) => e.values[b] - e.values[a]);
  const k = Math.min(n, p);
  const keep = order.slice(0, k);
  // a variance that is zero in exact arithmetic can come out a hair below zero
  const eigenvalues = keep.map((j) => Math.max(0, e.values[j]));
  const loadings = Array.from({ length: p }, (_, r) => keep.map((j) => e.vectors[r][j]));
  for (let c = 0; c < k; c++) {
    let best = 0;
    for (let r = 1; r < p; r++) if (Math.abs(loadings[r][c]) > Math.abs(loadings[best][c])) best = r;
    if (loadings[best][c] < 0) for (let r = 0; r < p; r++) loadings[r][c] = -loadings[r][c];
  }
  const scores = Z.map((z) => Array.from({ length: k }, (_, c) => ksum(z.map((v, r) => v * loadings[r][c]))));
  const total = ksum(order.map((j) => Math.max(0, e.values[j])));
  const proportion = eigenvalues.map((v) => (total > 0 ? v / total : NaN));
  const cumulative = [];
  for (let c = 0; c < k; c++) cumulative.push(total > 0 ? ksum(eigenvalues.slice(0, c + 1)) / total : NaN);
  return { ok: true, n, p, k, center, sd, eigenvalues, sdev: eigenvalues.map(Math.sqrt), proportion, cumulative, loadings, scores, sweeps: e.sweeps };
}

/**
 * Biplot coordinates of the first two components as R's biplot.prcomp(scale = 1).
 * @param {{ n: number, sdev: number[], scores: number[][], loadings: number[][] }} fit
 * @returns {{ points: (number|null)[][], arrows: number[][] }}
 */
export function biplot(fit) {
  const lam = [0, 1].map((c) => fit.sdev[c] * Math.sqrt(fit.n));
  return {
    points: fit.scores.map((s) => [0, 1].map((c) => (lam[c] > 0 ? s[c] / lam[c] : null))),
    arrows: fit.loadings.map((l) => [0, 1].map((c) => l[c] * lam[c])),
  };
}

/**
 * roles items (number columns, two or more), subject (point labels, optional), group (point colours, optional).
 * option scale true (correlation matrix) | false (covariance matrix).
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runPca(spec, table) {
  const items = [...new Set([].concat(spec?.roles?.items ?? []).filter(Boolean))];
  if (items.length < 2) return invalid(items.length ? 'lab.undefined.pcaNeedTwoItems' : 'stats.error.missingRole');
  const sKey = role(spec, 'subject');
  const gKey = role(spec, 'group');
  const scale = spec.options?.scale !== false;
  for (const k of items) if (column(table, k).kind !== 'number') return invalid('stats.error.needsNumber');
  const sc = sKey ? column(table, sKey) : null;
  const gc = gKey ? column(table, gKey) : null;
  if (gc && gc.kind !== 'category') return invalid('stats.error.needsCategory');
  // listwise on the measurements; a missing label leaves the point without a label
  const { rows, dropped } = completeRows(table, items);
  const base = { used: rows.length, dropped };
  const X = rows.map((i) => items.map((k) => table.columns[k].values[i]));
  const fit = pca(X, { scale });
  if (!fit.ok) {
    // a constant measurement is named, so the student knows which one to leave out
    const notes = fit.column === undefined ? [] : [{ id: 'constantItem', severity: 'note', key: 'lab.note.pcaConstantItem', params: { column: items[fit.column] } }];
    return invalid(fit.reasonKey, { ...base, notes });
  }
  const label = (c, i) => (c && !isMissing(c, i) ? cellLabel(c, i) : null);
  const pcs = Array.from({ length: fit.k }, (_, c) => `pc${c + 1}`);
  const tables = [
    { id: 'components', columns: ['component', 'eigenvalue', 'sdev', 'proportion', 'cumulative'], rows: pcs.map((_, c) => [`PC${c + 1}`, fit.eigenvalues[c], fit.sdev[c], fit.proportion[c], fit.cumulative[c]]) },
    { id: 'loadings', columns: ['item', ...pcs], rows: items.map((k, r) => [k, ...fit.loadings[r]]) },
    { id: 'scores', columns: ['rowId', 'subject', 'group', ...pcs], rows: rows.map((i, r) => [table.rowIds[i], label(sc, i), label(gc, i), ...fit.scores[r]]) },
    { id: 'items', columns: ['item', 'mean', 'sd'], rows: items.map((k, r) => [k, fit.center[r], fit.sd[r]]) },
  ];
  if (fit.k >= 2) {
    const b = biplot(fit);
    tables.push(
      { id: 'biplotPoints', columns: ['rowId', 'subject', 'group', 'pc1', 'pc2'], rows: rows.map((i, r) => [table.rowIds[i], label(sc, i), label(gc, i), ...b.points[r]]) },
      { id: 'biplotArrows', columns: ['item', 'pc1', 'pc2'], rows: items.map((k, r) => [k, ...b.arrows[r]]) },
    );
  }
  const notes = [{ id: 'scale', severity: 'note', key: `lab.note.pcaScale.${scale}` }, { id: 'signs', severity: 'note', key: 'lab.note.pcaSigns' }];
  if (fit.n <= fit.p) notes.push({ id: 'fewRows', severity: 'note', key: 'lab.note.pcaFewRows', params: { n: fit.n, p: fit.p } });
  return {
    status: 'ok',
    values: { n: val(fit.n), nItems: val(fit.p), nComponents: val(fit.k) },
    tests: [],
    tables,
    used: rows.length,
    dropped,
    notes,
  };
}
