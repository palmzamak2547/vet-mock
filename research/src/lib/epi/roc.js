// ROC curve, AUC with the DeLong interval, and the paired DeLong comparison of two tests on the same animals
// (pROC 1.19.0.1: roc, ci.auc, var, cov, roc.test, coords) [M2-DESIGN.md 3.3.1].
// OWNER: measure role (written by the integrator in M2).
//
// Sources: DeLong ER, DeLong DM, Clarke-Pearson DL. Comparing the areas under two or more correlated
// receiver operating characteristic curves: a nonparametric approach. Biometrics 1988;44(3):837-845
// (placement values V10, V01; variance S10 / n1 + S01 / n0; the covariance of two curves on the same
// animals). Youden WJ. Index for rating diagnostic tests. Cancer 1950;3(1):32-35 (J = Se + Sp - 1).
//
// Direction. 'higher-positive': an animal with the condition is expected to read higher; psi(case,
// control) = 1 when case > control, 1/2 on a tie, 0 otherwise (pROC direction '<'). 'lower-positive':
// the same with case < control (pROC direction '>'). Never 'auto': an AUC below 0.5 is shown as it is,
// with a note, instead of flipping the test silently.
// AUC = mean of V10 = Mann-Whitney U / (n1 n0). S10 and S01 use n - 1 denominators, as pROC.
// Interval: AUC +/- z(1 - a/2) sqrt(var), clipped to 0..1 as pROC (a clipped bound is noted).
// Paired comparison: z = (AUC1 - AUC2) / sqrt(var1 + var2 - 2 cov), p two-sided from the normal complement;
// interval of the difference = difference +/- z(1 - a/2) sqrt(var of the difference) (pROC roc.test).
// Thresholds as pROC: -Inf, the midpoints (a + b) / 2 of the sorted distinct values, Inf. Se at a
// threshold t: cases above t ('higher-positive') or below t ('lower-positive'); Sp: controls on the
// other side. Rows run from Se 1 to Se 0 (ascending thresholds for 'higher-positive', descending for
// 'lower-positive'). The Youden cut-off is every finite threshold with the largest J (ties all shown),
// compared on whole counts so that equal J values are never split by rounding.
import { qnorm, pnormTwoSided } from '../stats/dist.js';
import { getColumn, eachRow, binaryReader, invalidOutput, val, nul, guarded } from './_table.js';

function err(key) { return Object.assign(new Error(key), { key }); }

/**
 * DeLong placement values, AUC and its variance (positives = cases, negatives = controls), for a test
 * read 'higher-positive'. Pass negated values for 'lower-positive'.
 * @param {number[]} positives   marker values of animals with the condition
 * @param {number[]} negatives
 * @returns {{ auc: number, variance: number, v10: number[], v01: number[] }}
 */
export function delong(positives, negatives) {
  const n1 = positives.length, n0 = negatives.length;
  const v10 = new Array(n1).fill(0), v01 = new Array(n0).fill(0);
  for (let i = 0; i < n1; i++) {
    const x = positives[i];
    let s = 0;
    for (let j = 0; j < n0; j++) {
      const y = negatives[j];
      const psi = x > y ? 1 : x === y ? 0.5 : 0;
      s += psi;
      v01[j] += psi;
    }
    v10[i] = s / n0;
  }
  for (let j = 0; j < n0; j++) v01[j] /= n1;
  let auc = 0;
  for (const v of v10) auc += v;
  auc /= n1;
  let s10 = 0, s01 = 0;
  for (const v of v10) s10 += (v - auc) * (v - auc);
  for (const v of v01) s01 += (v - auc) * (v - auc);
  s10 /= n1 - 1;
  s01 /= n0 - 1;
  return { auc, variance: s10 / n1 + s01 / n0, v10, v01 };
}

/**
 * DeLong covariance of two AUCs measured on the same animals (placements from `delong`).
 * @param {{ auc: number, v10: number[], v01: number[] }} a
 * @param {{ auc: number, v10: number[], v01: number[] }} b
 */
export function delongCovariance(a, b) {
  const n1 = a.v10.length, n0 = a.v01.length;
  let s10 = 0, s01 = 0;
  for (let i = 0; i < n1; i++) s10 += (a.v10[i] - a.auc) * (b.v10[i] - b.auc);
  for (let j = 0; j < n0; j++) s01 += (a.v01[j] - a.auc) * (b.v01[j] - b.auc);
  return s10 / (n1 - 1) / n1 + s01 / (n0 - 1) / n0;
}

/**
 * The ROC coordinates at pROC's thresholds.
 * @param {number[]} cases @param {number[]} controls
 * @param {'higher-positive'|'lower-positive'} direction
 * @returns {{ threshold: number, tp: number, tn: number, se: number, sp: number }[]}  ordered from Se 1 to Se 0
 */
export function rocCoords(cases, controls, direction = 'higher-positive') {
  const distinct = [...new Set([...cases, ...controls])].sort((a, b) => a - b);
  const th = [-Infinity];
  for (let i = 0; i + 1 < distinct.length; i++) th.push((distinct[i] + distinct[i + 1]) / 2);
  th.push(Infinity);
  const n1 = cases.length, n0 = controls.length;
  const higher = direction !== 'lower-positive';
  const rows = th.map((t) => {
    let tp = 0, tn = 0;
    if (higher) {
      for (const x of cases) if (x > t) tp++;
      for (const y of controls) if (y < t) tn++;
    } else {
      for (const x of cases) if (x < t) tp++;
      for (const y of controls) if (y > t) tn++;
    }
    return { threshold: t, tp, tn, se: tp / n1, sp: tn / n0 };
  });
  return higher ? rows : rows.reverse();
}

/** Every finite threshold with the largest Youden J (compared on whole counts). */
export function youdenBest(coords, n1, n0) {
  let best = -Infinity;
  const score = (c) => c.tp * n0 + c.tn * n1;
  for (const c of coords) if (Number.isFinite(c.threshold)) best = Math.max(best, score(c));
  return coords.filter((c) => Number.isFinite(c.threshold) && score(c) === best);
}

/** A number reader for the test: a number column, or an ordinal column whose levels are numbers. */
function markerReader(col) {
  if (col.kind === 'number') return (r) => col.values[r];
  if (col.kind === 'category') {
    const scores = (col.levels || []).map((l) => {
      const s = String(l).trim().replace(/[๐-๙]/g, (ch) => String(ch.charCodeAt(0) - 0x0e50));
      return /^[+-]?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
    });
    if (scores.some((x) => Number.isNaN(x))) throw err('measure.error.testNotNumber');
    return (r) => scores[col.values[r]];
  }
  throw err('measure.error.testNotNumber');
}

/** One curve: AUC, DeLong variance, interval, coordinates, Youden. */
function curve(cases, controls, direction, conf) {
  const sign = direction === 'lower-positive' ? -1 : 1;
  const d = delong(cases.map((x) => sign * x), controls.map((x) => sign * x));
  const coords = rocCoords(cases, controls, direction);
  const z = qnorm(1 - (1 - conf) / 2);
  const out = { ...d, coords, youden: youdenBest(coords, cases.length, controls.length), ci: [null, null], clipped: false, se: null };
  if (cases.length >= 2 && controls.length >= 2 && d.variance >= 0) {
    out.se = Math.sqrt(d.variance);
    const lo = d.auc - z * out.se, hi = d.auc + z * out.se;
    out.clipped = lo < 0 || hi > 1;
    out.ci = [Math.max(0, lo), Math.min(1, hi)];
  }
  return out;
}

/**
 * roles test (a number), reference (binary, levels.referencePositive), test2 (optional, same animals); options direction (never 'auto'), youden.
 * Tables 'coords' [test, threshold, se, sp] (test = 'test' or 'test2'), 'youden' the same columns for the
 * tied best cut-offs. Values auc (and auc2, aucDifference with the paired test 'delong'). The Youden
 * cut-off carries the G13 warning (a cut-off chosen on these animals overstates accuracy).
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runRoc(spec, table) {
  return guarded(() => {
    if (!table) return invalidOutput('measure.error.noData');
    const o = spec.options || {};
    const conf = o.confLevel ?? 0.95;
    const direction = o.direction === 'lower-positive' ? 'lower-positive' : 'higher-positive';
    const tKey = spec.roles?.test, rKey = spec.roles?.reference, t2Key = spec.roles?.test2 || null;
    const positive = spec.levels?.referencePositive;
    if (!tKey || !rKey) return invalidOutput('measure.error.needTestAndReference');
    if (positive == null) return invalidOutput('measure.error.needReferencePositive');
    if (tKey === rKey || (t2Key && (t2Key === tKey || t2Key === rKey))) return invalidOutput('measure.error.sameColumnTwice');
    const rd1 = markerReader(getColumn(table, tKey));
    const rd2 = t2Key ? markerReader(getColumn(table, t2Key)) : null;
    const ref = binaryReader(getColumn(table, rKey), positive, null);
    const keys = [tKey, rKey].concat(t2Key ? [t2Key] : []);
    const c1 = [], k1 = [], c2 = [], k2 = [];
    const res = eachRow(table, keys, (r) => {
      const y = ref(r);
      if (y === null) return { filter: rKey };
      (y ? c1 : k1).push(rd1(r));
      if (rd2) (y ? c2 : k2).push(rd2(r));
      return undefined;
    });
    if (!c1.length || !k1.length) return invalidOutput(c1.length ? 'measure.error.noReferenceNegative' : 'measure.error.noReferencePositive', { used: res.used, dropped: res.dropped });
    const a = curve(c1, k1, direction, conf);
    const values = { nPositive: val(c1.length), nNegative: val(k1.length) };
    // A DeLong variance of 0 (every positive reads above, or below, every negative) gives the interval
    // [AUC, AUC]: not a real interval, so it is undefined with its reason (review round 3; pROC prints [1, 1]).
    const aucVal = (cv) => (cv.se === null
      ? val(cv.auc, { ci: [null, null], ciLevel: conf, ciMethod: 'delong', reasonKey: 'measure.undefined.aucNeedTwoEach' })
      : cv.se === 0
        ? val(cv.auc, { ci: [null, null], ciLevel: conf, ciMethod: 'delong', reasonKey: 'measure.undefined.aucNoVariance' })
        : val(cv.auc, { ci: cv.ci, ciLevel: conf, ciMethod: 'delong', se: cv.se }));
    values.auc = aucVal(a);
    const notes = [];
    const warnings = [];
    const tests = [];
    const coordRows = a.coords.map((c) => ['test', c.threshold, c.se, c.sp]);
    const youdenRows = [];
    const youden = o.youden ?? true;
    if (youden) {
      for (const c of a.youden) youdenRows.push(['test', c.threshold, c.se, c.sp]);
      values.youdenIndex = a.youden.length ? val(a.youden[0].se + a.youden[0].sp - 1) : nul('measure.undefined.noThreshold');
    }
    let b = null;
    if (rd2) {
      b = curve(c2, k2, direction, conf);
      values.auc2 = aucVal(b);
      for (const c of b.coords) coordRows.push(['test2', c.threshold, c.se, c.sp]);
      if (youden) {
        for (const c of b.youden) youdenRows.push(['test2', c.threshold, c.se, c.sp]);
        values.youdenIndex2 = b.youden.length ? val(b.youden[0].se + b.youden[0].sp - 1) : nul('measure.undefined.noThreshold');
      }
      const diff = a.auc - b.auc;
      if (a.se === null || b.se === null) {
        values.aucDifference = val(diff, { ci: [null, null], ciLevel: conf, reasonKey: 'measure.undefined.aucNeedTwoEach' });
        tests.push({ id: 'delong', statistic: { name: 'z', value: null }, df: null, p: null, alternative: 'two.sided', variant: 'paired', reasonKey: 'measure.undefined.aucNeedTwoEach' });
      } else {
        const cov = delongCovariance(
          { auc: a.auc, v10: a.v10, v01: a.v01 },
          { auc: b.auc, v10: b.v10, v01: b.v01 },
        );
        const vd = a.variance + b.variance - 2 * cov;
        const zq = qnorm(1 - (1 - conf) / 2);
        if (vd > 0) {
          const sd = Math.sqrt(vd);
          const z = diff / sd;
          values.aucDifference = val(diff, { ci: [diff - zq * sd, diff + zq * sd], ciLevel: conf, ciMethod: 'delong', se: sd });
          tests.push({ id: 'delong', statistic: { name: 'z', value: z }, df: null, p: pnormTwoSided(z), alternative: 'two.sided', variant: 'paired' });
        } else {
          values.aucDifference = val(diff, { ci: [null, null], ciLevel: conf, reasonKey: 'measure.undefined.aucDifferenceNoVariance' });
          tests.push({ id: 'delong', statistic: { name: 'z', value: null }, df: null, p: null, alternative: 'two.sided', variant: 'paired', reasonKey: 'measure.undefined.aucDifferenceNoVariance' });
        }
      }
    }
    if (a.clipped || (b && b.clipped)) notes.push({ id: 'aucCiClipped', severity: 'note', key: 'measure.note.aucCiClipped' });
    if (a.auc < 0.5 || (b && b.auc < 0.5)) notes.push({ id: 'aucBelowHalf', severity: 'note', key: `measure.note.aucBelowHalf.${direction}` });
    if (youden && youdenRows.length) warnings.push({ id: 'G13', severity: 'warn', key: 'measure.guard.G13.title', bodyKey: 'measure.guard.G13.youden' });
    const tables = [{ id: 'coords', columns: ['test', 'threshold', 'se', 'sp'], rows: coordRows }];
    if (youden) tables.push({ id: 'youden', columns: ['test', 'threshold', 'se', 'sp'], rows: youdenRows });
    return { status: 'ok', values, tests, tables, used: res.used, dropped: res.dropped, notes, warnings };
  });
}
