// Repeated-measures ANOVA: one within factor (time), optionally one between factor (a split-plot design),
// Greenhouse-Geisser and Huynh-Feldt corrections, Mauchly test [M2-DESIGN.md 3.1.2]. OWNER: lab role.
//
// Sums of squares as R's summary(aov(y ~ group * time + Error(subject / time))): the between-animal stratum
// splits the animals' means into group and animals within groups; the within-animal stratum splits the
// rest into time, group x time (sequential, after time) and the residual. Each is computed from centred
// means (no sum(x^2) - n mean^2 subtraction). The residual is the within-animal part left after each
// animal's own mean and its group's mean profile.
//
// Sphericity follows R's anova.mlm(test = 'Spherical') and mauchly.test on lm(W ~ group) with X = ~1: E is
// the residual SSD matrix of the wide data (one row per animal) on n = animals - groups df; U = T E T'
// with T the p - 1 orthonormal Helmert contrasts (U's eigenvalues do not depend on which orthonormal
// basis is used). Greenhouse-Geisser epsilon = tr(U)^2 / ((p - 1) tr(U^2)); Huynh-Feldt as R, ((n + 1)
// (p - 1) GG - 2) / ((p - 1)(n - (p - 1) GG)), which is the Lecoutre (1991) form when there is a
// between factor; it is capped at 1 for the p-value and printed uncapped with a note. Mauchly's W =
// det(U) / (tr(U) / (p - 1))^(p - 1) with R's chi-square approximation and its second-order term.
// Mauchly is shown beside the result and never chooses the correction (methods.md anti-pattern 2).
//
// M3 adds a second within factor (role factorB, M3-DESIGN.md 3.1.5): its own code path at the end of this file;
// without factorB nothing below changes.
import { pfUpper, pchisqUpper, qt } from './dist.js';
import { mean, ksum, variance, val, nullVal, testRow, role, common, completeRows, column, numbersAt, invalid } from './common.js';

/** Orthonormal Helmert contrasts: p - 1 rows of length p, each orthogonal to the ones vector. */
function helmert(p) {
  const T = [];
  for (let k = 1; k < p; k++) {
    const row = new Array(p).fill(0);
    const s = Math.sqrt(k * (k + 1));
    for (let j = 0; j < k; j++) row[j] = 1 / s;
    row[k] = -k / s;
    T.push(row);
  }
  return T;
}

/** Determinant of a symmetric positive semi-definite matrix by Gaussian elimination with pivoting. */
function det(M) {
  const n = M.length;
  const a = M.map((r) => r.slice());
  let d = 1;
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(a[r][c]) > Math.abs(a[piv][c])) piv = r;
    if (a[piv][c] === 0) return 0;
    if (piv !== c) { [a[piv], a[c]] = [a[c], a[piv]]; d = -d; }
    d *= a[c][c];
    for (let r = c + 1; r < n; r++) {
      const f = a[r][c] / a[c][c];
      for (let k = c; k < n; k++) a[r][k] -= f * a[c][k];
    }
  }
  return d;
}

/**
 * Epsilons from the covariance of the within-subject contrasts (R anova.mlm, test = 'Spherical').
 * @param {number[][]} wide       one row per subject, one column per time
 * @param {number[]} [between]     between-group index per subject
 * @returns {{ gg: number, hf: number, hfCapped: number, mauchlyW: number|null, mauchlyStat: number|null, mauchlyDf: number|null, mauchlyP: number|null, df: number, dims: number, trace: number }}
 */
export function sphericity(wide, between) {
  const N = wide.length;
  const p = wide[0].length;
  const g = between ? between : new Array(N).fill(0);
  const k = Math.max(...g) + 1;
  // residual of each animal's profile from its group's mean profile
  const gm = Array.from({ length: k }, (_, h) => {
    const rows = wide.filter((_, i) => g[i] === h);
    return Array.from({ length: p }, (_, t) => mean(rows.map((r) => r[t])));
  });
  const T = helmert(p);
  const pp = p - 1;
  // contrast scores of the residuals: z_i = T (w_i - m_g(i))
  const Z = wide.map((w, i) => T.map((row) => ksum(row.map((c, t) => c * (w[t] - gm[g[i]][t])))));
  const U = Array.from({ length: pp }, (_, a) => Array.from({ length: pp }, (_, b) => ksum(Z.map((z) => z[a] * z[b]))));
  const n = N - k;
  const tr = ksum(U.map((r, a) => r[a]));
  let tr2 = 0;
  for (let a = 0; a < pp; a++) for (let b = 0; b < pp; b++) tr2 += U[a][b] * U[b][a];
  const gg = (tr * tr) / (pp * tr2);
  const hf = ((n + 1) * pp * gg - 2) / (pp * (n - pp * gg));
  let mauchlyW = null;
  let mauchlyStat = null;
  let mauchlyP = null;
  let mauchlyDf = null;
  if (pp >= 2 && n >= pp) {
    const d = det(U);
    if (d > 0) {
      const logW = Math.log(d) - pp * Math.log(tr / pp);
      mauchlyW = Math.exp(logW);
      // R stats:::mauchly.test.SSD, including its 3 * p term (p = number of times, not p - 1)
      const rho = 1 - (2 * pp * pp + pp + 2) / (6 * pp * n);
      const w2 = ((pp + 2) * (pp - 1) * (pp - 2) * (2 * pp ** 3 + 6 * pp * pp + 3 * p + 2)) / (288 * (n * pp * rho) ** 2);
      const z = -n * rho * logW;
      const f = (pp * (pp + 1)) / 2 - 1;
      const pr1 = pchisqUpper(z, f);
      const pr2 = pchisqUpper(z, f + 4);
      mauchlyStat = z;
      mauchlyDf = f;
      mauchlyP = pr1 + w2 * (pr2 - pr1);
    }
  }
  return { gg, hf, hfCapped: Math.min(1, hf), mauchlyW, mauchlyStat, mauchlyDf, mauchlyP, df: n, dims: pp, trace: tr };
}

/**
 * The sums of squares of a (split-plot) repeated-measures layout.
 * @param {number[][]} W  one row per animal, one column per time, complete
 * @param {number[]|null} g  between-group index per animal (null: one group)
 */
export function anovaRepeated(W, g) {
  const N = W.length;
  const p = W[0].length;
  const grp = g || new Array(N).fill(0);
  const k = Math.max(...grp) + 1;
  const ng = Array.from({ length: k }, (_, h) => grp.filter((x) => x === h).length);
  const all = [];
  for (const r of W) for (const v of r) all.push(v);
  const grand = mean(all);
  const mS = W.map((r) => mean(r));
  const mT = Array.from({ length: p }, (_, t) => mean(W.map((r) => r[t])));
  const mG = Array.from({ length: k }, (_, h) => mean(mS.filter((_, i) => grp[i] === h)));
  const mGT = Array.from({ length: k }, (_, h) => Array.from({ length: p }, (_, t) => mean(W.filter((_, i) => grp[i] === h).map((r) => r[t]))));
  const ssTime = N * ksum(mT.map((m) => (m - grand) ** 2));
  const ssGroup = p * ksum(mG.map((m, h) => ng[h] * (m - grand) ** 2));
  const ssSubj = p * ksum(mS.map((m, i) => (m - mG[grp[i]]) ** 2));
  const ssGT = ksum(mGT.map((row, h) => ng[h] * ksum(row.map((m, t) => (m - mG[h] - mT[t] + grand) ** 2))));
  const res = [];
  W.forEach((r, i) => r.forEach((v, t) => res.push((v - mS[i] - mGT[grp[i]][t] + mG[grp[i]]) ** 2)));
  const ssRes = ksum(res);
  const dfTime = p - 1;
  const dfGroup = k - 1;
  const dfSubj = N - k;
  const dfGT = dfGroup * dfTime;
  const dfRes = dfSubj * dfTime;
  return { N, p, k, ng, grand, ssTime, ssGroup, ssSubj, ssGT, ssRes, dfTime, dfGroup, dfSubj, dfGT, dfRes };
}

function fp(ss1, df1, ss2, df2, eps = 1) {
  if (!(df1 > 0) || !(df2 > 0) || !(ss2 > 0)) return { F: null, p: null };
  const F = (ss1 / df1) / (ss2 / df2);
  return { F, p: pfUpper(F, eps * df1, eps * df2) };
}

/**
 * roles outcome, subject, time (within), group (between, optional); data in long form (one row per animal and time).
 * With factorB (a second within factor, M3) the two-within path runTwoWithin answers instead (end of this file).
 * Animals missing any time are dropped with reason 'incomplete' and counted. options sphericity (which corrected p the sentence uses), mauchly.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runAnovaRepeated(spec, table) {
  if (role(spec, 'factorB')) return runTwoWithin(spec, table);
  const yKey = role(spec, 'outcome');
  const sKey = role(spec, 'subject');
  const tKey = role(spec, 'time');
  const gKey = role(spec, 'group');
  if (!yKey || !sKey || !tKey) return invalid('stats.error.missingRole');
  const o = spec.options || {};
  const which = o.sphericity ?? 'gg';
  const showMauchly = o.mauchly !== false;
  const { confLevel } = common(spec);
  const tc = column(table, tKey);
  if (tc.kind !== 'category') throw Object.assign(new Error(`stats: ${tKey} is not a category column`), { key: 'stats.error.needsCategory', detail: tKey });
  const gc = gKey ? column(table, gKey) : null;
  if (gc && gc.kind !== 'category') throw Object.assign(new Error(`stats: ${gKey} is not a category column`), { key: 'stats.error.needsCategory', detail: gKey });
  const sc = column(table, sKey);
  const keys = gKey ? [yKey, sKey, tKey, gKey] : [yKey, sKey, tKey];
  const { rows, dropped } = completeRows(table, keys);
  const y = numbersAt(table, yKey, rows);

  // times present, in codebook order
  const tSeen = new Set(rows.map((i) => tc.values[i]));
  const tLevels = (tc.levels || []).map((l, j) => [l, j]).filter(([, j]) => tSeen.has(j));
  const tIndex = new Map(tLevels.map(([, j], x) => [j, x]));
  const p = tLevels.length;
  if (p < 2) return invalid('lab.undefined.needTwoTimes', { used: rows.length, dropped });

  // one record per animal, in order of first appearance
  const animals = new Map();
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r];
    const id = sc.values[i];
    if (!animals.has(id)) animals.set(id, { values: new Array(p).fill(null), group: gc ? gc.values[i] : 0, rows: 0 });
    const a = animals.get(id);
    a.rows += 1;
    const t = tIndex.get(tc.values[i]);
    if (a.values[t] !== null) return invalid('lab.invalid.duplicateTime', { used: rows.length, dropped });
    if (gc && a.group !== gc.values[i]) return invalid('lab.invalid.groupChanges', { used: rows.length, dropped });
    a.values[t] = y[r];
  }
  const complete = [];
  let incompleteRows = 0;
  let incompleteAnimals = 0;
  for (const a of animals.values()) {
    if (a.values.every((v) => v !== null)) complete.push(a);
    else { incompleteRows += a.rows; incompleteAnimals += 1; }
  }
  const allDropped = incompleteRows ? [...dropped, { reason: 'incomplete', column: sKey, count: incompleteRows }] : dropped;
  const used = complete.length * p;
  // between groups present among complete animals, in codebook order
  let gLabels = [null];
  let gIdx = complete.map(() => 0);
  if (gc) {
    const present = new Set(complete.map((a) => a.group));
    const lv = (gc.levels || []).map((l, j) => [l, j]).filter(([, j]) => present.has(j));
    const map = new Map(lv.map(([, j], x) => [j, x]));
    gLabels = lv.map(([l]) => l);
    gIdx = complete.map((a) => map.get(a.group));
  }
  const k = gLabels.length;
  const W = complete.map((a) => a.values);
  const N = W.length;
  const base = { used, dropped: allDropped };
  if (gc && k < 2) return invalid('lab.undefined.needTwoGroups', base);
  if (N - k < 1) return invalid('lab.undefined.fewAnimals', base);

  const a = anovaRepeated(W, gc ? gIdx : null);
  const sph = sphericity(W, gc ? gIdx : null);
  const eps = { none: 1, gg: sph.gg, hf: sph.hfCapped };

  const effects = [['time', a.ssTime, a.dfTime]];
  if (gc) effects.push(['groupTime', a.ssGT, a.dfGT]);
  const within = effects.map(([id, ss, df]) => {
    const u = fp(ss, df, a.ssRes, a.dfRes);
    const gg = fp(ss, df, a.ssRes, a.dfRes, eps.gg);
    const hf = fp(ss, df, a.ssRes, a.dfRes, eps.hf);
    return { id, ss, df, F: u.F, p: u.p, pGG: gg.p, pHF: hf.p, etaPartial: ss + a.ssRes > 0 ? ss / (ss + a.ssRes) : null };
  });
  const tests = [];
  const values = { epsGG: val(sph.gg), epsHF: val(sph.hf), nAnimals: val(N), nIncomplete: val(incompleteAnimals) };
  const reasonRes = a.ssRes > 0 ? undefined : 'stats.undefined.zeroVariance';
  const rowsTable = [];
  let between = null;
  if (gc) {
    between = fp(a.ssGroup, a.dfGroup, a.ssSubj, a.dfSubj);
    rowsTable.push(['group', a.dfGroup, a.ssGroup, a.ssGroup / a.dfGroup, between.F, between.p, null, null, a.ssGroup + a.ssSubj > 0 ? a.ssGroup / (a.ssGroup + a.ssSubj) : null]);
    rowsTable.push(['animalsWithinGroups', a.dfSubj, a.ssSubj, a.ssSubj / a.dfSubj, null, null, null, null, null]);
    tests.push(testRow({ id: 'group', name: 'F', statistic: between.F, dfPair: [a.dfGroup, a.dfSubj], p: between.p, variant: 'between', reasonKey: a.ssSubj > 0 ? undefined : 'stats.undefined.zeroVariance' }));
    values.etaPartialGroup = a.ssGroup + a.ssSubj > 0 ? val(a.ssGroup / (a.ssGroup + a.ssSubj)) : nullVal('stats.undefined.zeroVariance');
  } else {
    rowsTable.push(['animals', a.dfSubj, a.ssSubj, a.ssSubj / a.dfSubj, null, null, null, null, null]);
  }
  for (const e of within) {
    rowsTable.push([e.id, e.df, e.ss, e.ss / e.df, e.F, e.p, e.pGG, e.pHF, e.etaPartial]);
    const pUsed = which === 'gg' ? e.pGG : which === 'hf' ? e.pHF : e.p;
    const e1 = which === 'none' ? 1 : eps[which];
    tests.push(testRow({ id: e.id, name: 'F', statistic: e.F, dfPair: [e.df * e1, a.dfRes * e1], p: pUsed, variant: which, reasonKey: reasonRes }));
    values[e.id === 'time' ? 'etaPartialTime' : 'etaPartialGroupTime'] = e.etaPartial === null ? nullVal('stats.undefined.zeroVariance') : val(e.etaPartial);
  }
  rowsTable.push(['residual', a.dfRes, a.ssRes, a.dfRes > 0 ? a.ssRes / a.dfRes : null, null, null, null, null, null]);
  if (showMauchly) {
    if (sph.mauchlyP === null) {
      tests.push(testRow({ id: 'mauchly', name: 'W', statistic: null, p: null, variant: 'sphericity', reasonKey: p === 2 ? 'lab.undefined.mauchlyTwoTimes' : 'lab.undefined.mauchlyFewAnimals' }));
      values.mauchlyW = nullVal(p === 2 ? 'lab.undefined.mauchlyTwoTimes' : 'lab.undefined.mauchlyFewAnimals');
    } else {
      tests.push(testRow({ id: 'mauchly', name: 'W', statistic: sph.mauchlyW, df: sph.mauchlyDf, p: sph.mauchlyP, variant: 'sphericity' }));
      values.mauchlyW = val(sph.mauchlyW);
    }
  }

  // means per time (and group) with t intervals
  const meansRows = [];
  for (let h = 0; h < k; h++) {
    for (let t = 0; t < p; t++) {
      const x = W.filter((_, i) => gIdx[i] === h).map((r) => r[t]);
      const m = mean(x);
      const sd = x.length > 1 ? Math.sqrt(variance(x)) : null;
      const half = sd === null ? null : qt(1 - (1 - confLevel) / 2, x.length - 1) * sd / Math.sqrt(x.length);
      meansRows.push([tLevels[t][0], gLabels[h], x.length, m, sd, half === null ? null : m - half, half === null ? null : m + half]);
    }
  }
  const notes = [{ id: 'sphericity', severity: 'note', key: `lab.note.sphericity.${which}` }];
  if (sph.hf > 1) notes.push({ id: 'hfCapped', severity: 'note', key: 'lab.note.hfCapped', params: { epsHF: sph.hf } });
  if (incompleteAnimals) notes.push({ id: 'incomplete', severity: 'note', key: 'lab.note.incompleteAnimals', params: { animals: incompleteAnimals, rows: incompleteRows } });
  return {
    status: reasonRes ? 'invalid' : 'ok',
    values,
    tests,
    tables: [
      { id: 'anova', columns: ['source', 'df', 'ss', 'ms', 'F', 'p', 'pGG', 'pHF', 'etaPartial'], rows: rowsTable },
      { id: 'means', columns: ['time', 'group', 'n', 'mean', 'sd', 'lower', 'upper'], rows: meansRows },
    ],
    used,
    dropped: allDropped,
    notes,
  };
}

// ---------------------------------------------------------------- two within factors (M3)
// [M3-DESIGN.md 3.1.5, C11] The role factorB is a second within-animal factor: long data, one row per animal and
// combination of the two within factors (`time` is the first, A; `factorB` the second, B), optionally one between
// factor (`group`). The rows are reshaped to one row per animal with a column per combination (column index
// iA * b + iB); an animal missing a combination is dropped whole, reason 'incomplete'.
//
// Each within effect is tested on its own orthonormal contrasts (C11): A averaged over B (Helmert contrasts of A
// times the averaging vector of B), B averaged over A, and their product (A x B). For one effect with contrast
// scores z_i (q of them per animal) and n = animals - groups residual df:
//   SS(effect)          = N |mean z|^2 (the mean over all animals, as R's anova.mlm: sequential, the within main
//                         effect entered first; with unequal group sizes this is not SPSS's Type III, which weights
//                         the groups equally, and a note says so)
//   SS(group x effect)  = sum_h n_h |mean z in h - mean z|^2
//   SS(error)           = trace of U, the residual SSP matrix of z around the group means
//   F = (SS / q) / (SS(error) / (n q)); Greenhouse-Geisser epsilon tr(U)^2 / (q tr(U^2)); Huynh-Feldt as M2,
//   ((n + 1) q GG - 2) / (q (n - q GG)), capped at 1 for the p-value and printed uncapped; Mauchly's W =
//   det(U) / (tr(U) / q)^q with R's chi-square approximation. R's mauchly.test.SSD puts the number of columns of
//   the whole SSD matrix (here a b) in its second-order term, where the one-factor method has the number of times;
//   both follow R, so the p-values agree with mauchly.test (r/out/anovarm2.json). The between effect is tested on
//   the animals' means over every combination (the averaging contrast), as in M2's split-plot.
//
// runAnovaRepeated with factorB returns:
//   values  nAnimals, nIncomplete; epsGG<E>, epsHF<E> (HF uncapped) for E in Time, FactorB, TimeFactorB;
//           etaPartial<E> and, with a group, etaPartialGroup and etaPartialGroup<E>
//   tests   'time', 'factorB', 'timeFactorB' (F, dfPair corrected by the epsilon the `sphericity` option names, the p
//           it names, variant 'gg' | 'hf' | 'none'); with a group 'group' (variant 'between') and 'groupTime',
//           'groupFactorB', 'groupTimeFactorB' (corrected by their within effect's epsilon); with `mauchly`
//           'mauchlyTime', 'mauchlyFactorB', 'mauchlyTimeFactorB' (W, df, p; null with a reason for a 2-level effect)
//   tables  'anova' [source, df, ss, ms, F, p, pGG, pHF, etaPartial]: 'animals' (no group) or 'group' and
//           'animalsWithinGroups', then per within effect E: E, 'group' + E (with a group), 'residual' + E
//           'sphericity' [effect, epsGG, epsHF, mauchlyW, mauchlyP], effect 'time' | 'factorB' | 'timeFactorB'
//           'means' [time, factorB, group, n, mean, sd, lower, upper], one row per combination (and group)
//   notes   lab.note.sphericity.<gg|hf|none>, lab.note.hfCapped<E> {epsHF}, lab.note.incompleteCombinations
//           {animals, rows}, lab.note.rmSequential (unequal group sizes)

/** Orthonormal contrast columns of k levels: k rows x (k - 1) columns, each orthogonal to the ones vector. */
function helmertColumns(k) {
  const T = helmert(k);
  return Array.from({ length: k }, (_, j) => T.map((row) => row[j]));
}

/** The averaging column of k levels: k rows x 1 column, 1 / sqrt(k) each. */
function averaging(k) {
  return Array.from({ length: k }, () => [1 / Math.sqrt(k)]);
}

/** Kronecker product of two matrices (arrays of rows). */
function kron(A, B) {
  const rb = B.length;
  const cb = B[0].length;
  const out = Array.from({ length: A.length * rb }, () => new Array(A[0].length * cb).fill(0));
  for (let i = 0; i < A.length; i++) for (let j = 0; j < A[0].length; j++) for (let k = 0; k < rb; k++) for (let l = 0; l < cb; l++) out[i * rb + k][j * cb + l] = A[i][j] * B[k][l];
  return out;
}

/**
 * The orthonormal contrasts of each within effect of an a x b layout, combination columns A-major (iA * b + iB).
 * @param {number} a  levels of the first within factor
 * @param {number} b  levels of the second
 * @returns {{ time: number[][], factorB: number[][], timeFactorB: number[][] }}  each (a b) rows x q columns
 */
export function withinContrasts(a, b) {
  return {
    time: kron(helmertColumns(a), averaging(b)),
    factorB: kron(averaging(a), helmertColumns(b)),
    timeFactorB: kron(helmertColumns(a), helmertColumns(b)),
  };
}

/** Mauchly's W and R's chi-square approximation for a q x q residual SSP matrix on n df; m = columns of the whole SSD. */
function mauchlyOf(U, n, m) {
  const q = U.length;
  if (q < 2) return { W: null, stat: null, df: null, p: null, reasonKey: 'lab.undefined.mauchlyTwoLevels' };
  const d = n >= q ? det(U) : 0;
  if (!(d > 0)) return { W: null, stat: null, df: null, p: null, reasonKey: 'lab.undefined.mauchlyFewAnimals' };
  const tr = ksum(U.map((r, i) => r[i]));
  const logW = Math.log(d) - q * Math.log(tr / q);
  const rho = 1 - (2 * q * q + q + 2) / (6 * q * n);
  const w2 = ((q + 2) * (q - 1) * (q - 2) * (2 * q ** 3 + 6 * q * q + 3 * m + 2)) / (288 * (n * q * rho) ** 2);
  const z = -n * rho * logW;
  const f = (q * (q + 1)) / 2 - 1;
  const pr1 = pchisqUpper(z, f);
  const pr2 = pchisqUpper(z, f + 4);
  return { W: Math.exp(logW), stat: z, df: f, p: pr1 + w2 * (pr2 - pr1) };
}

/**
 * One within effect on its own orthonormal contrasts (C11).
 * @param {number[][]} W  one row per animal, one column per combination, complete
 * @param {number[]} g    between-group index per animal (all 0 without a group)
 * @param {number[][]} C  contrast columns of the effect, (columns of W) x q, orthonormal
 * @returns {{ q: number, ss: number, ssBy: number, ssError: number, df: number, dfBy: number, dfError: number, gg: number, hf: number, hfCapped: number, mauchly: ReturnType<typeof mauchlyOf> }}
 */
export function withinEffect(W, g, C) {
  const N = W.length;
  const m = W[0].length;
  const q = C[0].length;
  const k = Math.max(...g) + 1;
  const Z = W.map((w) => Array.from({ length: q }, (_, c) => ksum(w.map((v, t) => v * C[t][c]))));
  const ng = Array.from({ length: k }, (_, h) => g.filter((x) => x === h).length);
  const zbar = Array.from({ length: q }, (_, c) => mean(Z.map((z) => z[c])));
  const zg = Array.from({ length: k }, (_, h) => Array.from({ length: q }, (_, c) => mean(Z.filter((_, i) => g[i] === h).map((z) => z[c]))));
  const ss = N * ksum(zbar.map((z) => z * z));
  const ssBy = ksum(zg.map((row, h) => ng[h] * ksum(row.map((z, c) => (z - zbar[c]) ** 2))));
  const R = Z.map((z, i) => z.map((v, c) => v - zg[g[i]][c]));
  const U = Array.from({ length: q }, (_, a) => Array.from({ length: q }, (_, b) => ksum(R.map((r) => r[a] * r[b]))));
  const n = N - k;
  const tr = ksum(U.map((r, a) => r[a]));
  let tr2 = 0;
  for (let a = 0; a < q; a++) for (let b = 0; b < q; b++) tr2 += U[a][b] * U[b][a];
  const gg = (tr * tr) / (q * tr2);
  const hf = ((n + 1) * q * gg - 2) / (q * (n - q * gg));
  return { q, ss, ssBy, ssError: tr, df: q, dfBy: (k - 1) * q, dfError: n * q, gg, hf, hfCapped: Math.min(1, hf), mauchly: mauchlyOf(U, n, m) };
}

/**
 * Sums of squares, F tests and sphericity of a two-within-factor layout (optionally with one between factor).
 * @param {number[][]} W  one row per animal, a b columns (A-major), complete
 * @param {number[]|null} g  between-group index per animal (null: one group)
 * @param {number} a @param {number} b
 */
export function anovaRepeated2(W, g, a, b) {
  const N = W.length;
  const grp = g || new Array(N).fill(0);
  const k = Math.max(...grp) + 1;
  const ng = Array.from({ length: k }, (_, h) => grp.filter((x) => x === h).length);
  // between animals: the averaging contrast over every combination
  const z0 = W.map((w) => ksum(w) / Math.sqrt(a * b));
  const z0bar = mean(z0);
  const z0g = Array.from({ length: k }, (_, h) => mean(z0.filter((_, i) => grp[i] === h)));
  const ssGroup = ksum(z0g.map((z, h) => ng[h] * (z - z0bar) ** 2));
  const ssSubj = ksum(z0.map((z, i) => (z - z0g[grp[i]]) ** 2));
  const C = withinContrasts(a, b);
  const effects = {};
  for (const id of ['time', 'factorB', 'timeFactorB']) effects[id] = withinEffect(W, grp, C[id]);
  return { N, k, ng, ssGroup, dfGroup: k - 1, ssSubj, dfSubj: N - k, effects };
}

const EFFECTS = ['time', 'factorB', 'timeFactorB'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);

/** Long data with two within factors (factorB set): the reshape, the tests and the tables listed above. */
function runTwoWithin(spec, table) {
  const yKey = role(spec, 'outcome');
  const sKey = role(spec, 'subject');
  const aKey = role(spec, 'time');
  const bKey = role(spec, 'factorB');
  const gKey = role(spec, 'group');
  if (!yKey || !sKey || !aKey || !bKey) return invalid('stats.error.missingRole');
  const o = spec.options || {};
  const which = o.sphericity ?? 'gg';
  const showMauchly = o.mauchly !== false;
  const { confLevel } = common(spec);
  const yc = column(table, yKey);
  const ac = column(table, aKey);
  const bc = column(table, bKey);
  const gc = gKey ? column(table, gKey) : null;
  const sc = column(table, sKey);
  if (yc.kind !== 'number') return invalid('stats.error.needsNumber');
  if (ac.kind !== 'category' || bc.kind !== 'category' || (gc && gc.kind !== 'category')) return invalid('stats.error.needsCategory');
  const keys = gKey ? [yKey, sKey, aKey, bKey, gKey] : [yKey, sKey, aKey, bKey];
  const { rows, dropped } = completeRows(table, keys);

  // levels present, in codebook order
  const present = (c) => {
    const seen = new Set(rows.map((i) => c.values[i]));
    const lv = (c.levels || []).map((l, j) => [l, j]).filter(([, j]) => seen.has(j));
    return { labels: lv.map(([l]) => l), index: new Map(lv.map(([, j], x) => [j, x])) };
  };
  const A = present(ac);
  const B = present(bc);
  const a = A.labels.length;
  const b = B.labels.length;
  if (a < 2 || b < 2) return invalid('lab.undefined.needTwoLevels', { used: rows.length, dropped });
  const m = a * b;

  // one record per animal, in order of first appearance
  const animals = new Map();
  for (const i of rows) {
    const id = sc.values[i];
    if (!animals.has(id)) animals.set(id, { values: new Array(m).fill(null), group: gc ? gc.values[i] : 0, rows: 0 });
    const rec = animals.get(id);
    rec.rows += 1;
    const cell = A.index.get(ac.values[i]) * b + B.index.get(bc.values[i]);
    if (rec.values[cell] !== null) return invalid('lab.invalid.duplicateCell', { used: rows.length, dropped });
    if (gc && rec.group !== gc.values[i]) return invalid('lab.invalid.groupChanges', { used: rows.length, dropped });
    rec.values[cell] = yc.values[i];
  }
  const complete = [];
  let incompleteRows = 0;
  let incompleteAnimals = 0;
  for (const rec of animals.values()) {
    if (rec.values.every((v) => v !== null)) complete.push(rec);
    else { incompleteRows += rec.rows; incompleteAnimals += 1; }
  }
  const allDropped = incompleteRows ? [...dropped, { reason: 'incomplete', column: sKey, count: incompleteRows }] : dropped;
  const used = complete.length * m;
  let gLabels = [null];
  let gIdx = complete.map(() => 0);
  if (gc) {
    const seen = new Set(complete.map((rec) => rec.group));
    const lv = (gc.levels || []).map((l, j) => [l, j]).filter(([, j]) => seen.has(j));
    const map = new Map(lv.map(([, j], x) => [j, x]));
    gLabels = lv.map(([l]) => l);
    gIdx = complete.map((rec) => map.get(rec.group));
  }
  const k = gLabels.length;
  const W = complete.map((rec) => rec.values);
  const N = W.length;
  const base = { used, dropped: allDropped };
  if (gc && k < 2) return invalid('lab.undefined.needTwoGroups', base);
  if (N - k < 1) return invalid('lab.undefined.fewAnimals', base);

  const r = anovaRepeated2(W, gc ? gIdx : null, a, b);
  const values = { nAnimals: val(N), nIncomplete: val(incompleteAnimals) };
  const tests = [];
  const rowsTable = [];
  const sphRows = [];
  const notes = [{ id: 'sphericity', severity: 'note', key: `lab.note.sphericity.${which}` }];
  if (gc) {
    const between = fp(r.ssGroup, r.dfGroup, r.ssSubj, r.dfSubj);
    const eta = r.ssGroup + r.ssSubj > 0 ? r.ssGroup / (r.ssGroup + r.ssSubj) : null;
    rowsTable.push(['group', r.dfGroup, r.ssGroup, r.ssGroup / r.dfGroup, between.F, between.p, null, null, eta]);
    rowsTable.push(['animalsWithinGroups', r.dfSubj, r.ssSubj, r.ssSubj / r.dfSubj, null, null, null, null, null]);
    tests.push(testRow({ id: 'group', name: 'F', statistic: between.F, dfPair: [r.dfGroup, r.dfSubj], p: between.p, variant: 'between', reasonKey: r.ssSubj > 0 ? undefined : 'stats.undefined.zeroVariance' }));
    values.etaPartialGroup = eta === null ? nullVal('stats.undefined.zeroVariance') : val(eta);
  } else {
    rowsTable.push(['animals', r.dfSubj, r.ssSubj, r.dfSubj > 0 ? r.ssSubj / r.dfSubj : null, null, null, null, null, null]);
  }
  let anyF = false;
  for (const id of EFFECTS) {
    const e = r.effects[id];
    const E = cap(id);
    const eps = { none: 1, gg: e.gg, hf: e.hfCapped };
    const reason = e.ssError > 0 ? undefined : 'stats.undefined.zeroVariance';
    const row = (source, ss, df) => {
      const u = fp(ss, df, e.ssError, e.dfError);
      const pg = fp(ss, df, e.ssError, e.dfError, eps.gg);
      const ph = fp(ss, df, e.ssError, e.dfError, eps.hf);
      const eta = ss + e.ssError > 0 ? ss / (ss + e.ssError) : null;
      rowsTable.push([source, df, ss, ss / df, u.F, u.p, pg.p, ph.p, eta]);
      const pUsed = which === 'gg' ? pg.p : which === 'hf' ? ph.p : u.p;
      tests.push(testRow({ id: source, name: 'F', statistic: u.F, dfPair: [df * eps[which], e.dfError * eps[which]], p: pUsed, variant: which, reasonKey: reason }));
      if (u.F !== null) anyF = true;
      return eta;
    };
    const eta = row(id, e.ss, e.df);
    values[`etaPartial${E}`] = eta === null ? nullVal('stats.undefined.zeroVariance') : val(eta);
    if (gc) {
      const etaBy = row(`group${E}`, e.ssBy, e.dfBy);
      values[`etaPartialGroup${E}`] = etaBy === null ? nullVal('stats.undefined.zeroVariance') : val(etaBy);
    }
    rowsTable.push([`residual${E}`, e.dfError, e.ssError, e.dfError > 0 ? e.ssError / e.dfError : null, null, null, null, null, null]);
    values[`epsGG${E}`] = val(e.gg);
    values[`epsHF${E}`] = val(e.hf);
    if (e.hf > 1) notes.push({ id: `hfCapped${E}`, severity: 'note', key: `lab.note.hfCapped${E}`, params: { epsHF: e.hf } });
    const mc = e.mauchly;
    sphRows.push([id, e.gg, e.hf, mc.W, mc.p]);
    if (showMauchly) {
      if (mc.p === null) tests.push(testRow({ id: `mauchly${E}`, name: 'W', statistic: null, p: null, variant: 'sphericity', reasonKey: mc.reasonKey }));
      else tests.push(testRow({ id: `mauchly${E}`, name: 'W', statistic: mc.W, df: mc.df, p: mc.p, variant: 'sphericity' }));
    }
  }
  if (incompleteAnimals) notes.push({ id: 'incomplete', severity: 'note', key: 'lab.note.incompleteCombinations', params: { animals: incompleteAnimals, rows: incompleteRows } });
  if (gc && new Set(r.ng).size > 1) notes.push({ id: 'sequential', severity: 'note', key: 'lab.note.rmSequential' });

  // means per combination (and group) with t intervals
  const meansRows = [];
  for (let h = 0; h < k; h++) {
    for (let i = 0; i < a; i++) {
      for (let j = 0; j < b; j++) {
        const x = W.filter((_, n) => gIdx[n] === h).map((w) => w[i * b + j]);
        const mu = mean(x);
        const sd = x.length > 1 ? Math.sqrt(variance(x)) : null;
        const half = sd === null ? null : qt(1 - (1 - confLevel) / 2, x.length - 1) * sd / Math.sqrt(x.length);
        meansRows.push([A.labels[i], B.labels[j], gLabels[h], x.length, mu, sd, half === null ? null : mu - half, half === null ? null : mu + half]);
      }
    }
  }
  return {
    status: anyF ? 'ok' : 'invalid',
    values,
    tests,
    tables: [
      { id: 'anova', columns: ['source', 'df', 'ss', 'ms', 'F', 'p', 'pGG', 'pHF', 'etaPartial'], rows: rowsTable },
      { id: 'sphericity', columns: ['effect', 'epsGG', 'epsHF', 'mauchlyW', 'mauchlyP'], rows: sphRows },
      { id: 'means', columns: ['time', 'factorB', 'group', 'n', 'mean', 'sd', 'lower', 'upper'], rows: meansRows },
    ],
    used,
    dropped: allDropped,
    notes,
  };
}
