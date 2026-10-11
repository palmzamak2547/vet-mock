// qPCR relative quantification and amplification efficiency [M3-DESIGN.md 3.1.3, C7]. OWNER: lab role.
//
// One framework for Livak and Pfaffl (Hellemans et al. 2007, Genome Biol 8:R19): per sample
//   log2 NRQ = -Ct_target log2 E_target + mean_i(Ct_ref_i log2 E_ref_i),
// the reference genes combined by the mean of their efficiency-weighted Ct, which is the geometric mean of their
// quantities (Vandesompele et al. 2002, Genome Biol 3:research0034). With every E = 2 this is -dCt of Livak and
// Schmittgen 2001 (Methods 25:402). The engine works on dCt = -log2 NRQ: with E = 2 it is Ct_target minus the mean
// reference Ct; with Pfaffl's efficiencies it is the same difference in cycles of perfect doubling.
// Tests run on dCt (Yuan et al. 2006, BMC Bioinformatics 7:85), never on fold changes: two groups by Welch's
// t-test (or the pooled t-test, option `test`) of a group against the calibrator (`levels.controlLevel`), three or
// more by one-way ANOVA and Dunnett's comparisons against the calibrator (stats/posthoc.js, numerical integration).
// ddCt = mean dCt of the group - mean dCt of the calibrator; the fold change 2^-ddCt and its interval are 2 raised
// to the minus difference and its interval (asymmetric). Each fold change is shown, never tested.
//
// runQpcrRelative output:
//   values  nSamples, nGroups; two groups: ddCt (ci, se, ciMethod 't'), fold (2^-ddCt; ci = 2^-(ddCt interval));
//           three or more: critical (Dunnett's two-sided critical value), integrationError
//   tests   'tTest' (two groups: t = ddCt / SE on dCt, df, p, variant 'welch' | 'pooled') or 'anova' (three or
//           more: F on dCt, dfPair, p, variant 'oneway')
//   tables  'samples'     [rowId, group, dCt, fold], fold = 2^-(dCt - mean dCt of the calibrator), one row per sample
//           'groups'      [level, n, meanDCt, sdDCt, lower, upper, fold, foldLower, foldUpper]: mean dCt, its t interval
//                         inside the group; fold = 2^-(mean - calibrator mean) (the geometric mean of the samples'
//                         fold) with that interval mapped the same way (the calibrator's own mean held fixed)
//           'comparisons' [pair, ddCt, lower, upper, p, fold, foldLower, foldUpper] (two groups) or
//                         [pair, ddCt, lower, upper, pAdjusted, fold, foldLower, foldUpper] (Dunnett), pair = 'B-A'
//   notes   lab.qpcr.guidance; lab.note.qpcrMethod.livak | .pfaffl; lab.note.qpcrReferences {count} (two or more
//           reference genes); lab.note.controlFirst {level} (no calibrator chosen); lab.note.qpcrManyGroups and
//           lab.note.dunnettIntegration {error} (three or more groups)
//   dropped missing Ct values, counted against the first role column (target, then each reference gene, group)
//
// runQpcrEfficiency (a dilution series): OLS of Ct on log10 input (stats/ols.js); E = 10^(-1/slope), its
// interval mapped from the slope's (10^(-1/b) increases with b on each side of 0, so a negative slope's interval
// maps end to end); efficiency % = (E - 1) 100.
//   values  slope (ci, se), intercept (ci, se), r2, efficiency (E, ci), efficiencyPercent (ci), n, df
//   notes   lab.note.efficiencyRange outside 90 to 110% (MIQE's commonly used range, not a rule)
import { tTest } from './ttest.js';
import { anova1 } from './anova.js';
import { dunnett } from './posthoc.js';
import { olsQr } from './ols.js';
import { qt } from './dist.js';
import { mean, variance, val, nullVal, testRow, role, common, completeRows, column, invalid } from './common.js';

/**
 * Per-sample dCt (= -log2 NRQ) from the target Ct and the reference Cts.
 * @param {number} target            Ct of the gene of interest
 * @param {number[]} refs            Ct of each reference gene
 * @param {number} [eTarget]         amplification factor of the target (2 = doubling)
 * @param {number[]} [eRefs]         amplification factor of each reference gene
 * @returns {number}
 */
export function deltaCt(target, refs, eTarget = 2, eRefs = refs.map(() => 2)) {
  const livak = eTarget === 2 && eRefs.every((e) => e === 2);
  if (livak) return target - mean(refs);
  return target * Math.log2(eTarget) - mean(refs.map((c, i) => c * Math.log2(eRefs[i])));
}

/** 2^-x (an open bound stays open: 2^-Infinity = 0, 2^Infinity = Infinity); null stays null. */
const fold = (x) => (typeof x === 'number' && !Number.isNaN(x) ? 2 ** -x : null);

function within(x, confLevel) {
  const m = mean(x);
  const sd = x.length > 1 ? Math.sqrt(variance(x)) : null;
  const half = sd === null ? null : qt(1 - (1 - confLevel) / 2, x.length - 1) * sd / Math.sqrt(x.length);
  return { n: x.length, mean: m, sd, lower: half === null ? null : m - half, upper: half === null ? null : m + half };
}

/**
 * roles outcome (Ct of the gene of interest), items (Ct of each reference gene, one or more), group (category) with
 * levels.controlLevel (the calibrator). options method 'livak' | 'pfaffl', efficiency { column key: amplification
 * factor } (every gene, Pfaffl only), test 'welch' | 'pooled' (two groups), confLevel, alternative.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runQpcrRelative(spec, table) {
  const tKey = role(spec, 'outcome');
  const refKeys = [...new Set([].concat(spec?.roles?.items ?? []).filter(Boolean))];
  const gKey = role(spec, 'group');
  if (!tKey || !refKeys.length || !gKey) return invalid('stats.error.missingRole');
  const o = spec.options || {};
  const method = o.method === 'pfaffl' ? 'pfaffl' : 'livak';
  const variant = o.test === 'pooled' ? 'pooled' : 'welch';
  const { confLevel, alternative } = common(spec);
  for (const k of [tKey, ...refKeys]) if (column(table, k).kind !== 'number') return invalid('stats.error.needsNumber');
  const gc = column(table, gKey);
  if (gc.kind !== 'category') return invalid('stats.error.needsCategory');
  let eT = 2;
  let eR = refKeys.map(() => 2);
  if (method === 'pfaffl') {
    const eff = o.efficiency || {};
    const missing = [tKey, ...refKeys].filter((k) => !(typeof eff[k] === 'number' && Number.isFinite(eff[k])));
    if (missing.length) return invalid('lab.invalid.qpcrEfficiencyMissing');
    eT = eff[tKey];
    eR = refKeys.map((k) => eff[k]);
  }
  const { rows, dropped } = completeRows(table, [tKey, ...refKeys, gKey]);
  const tc = column(table, tKey);
  const rc = refKeys.map((k) => column(table, k));
  const dct = rows.map((i) => deltaCt(tc.values[i], rc.map((c) => c.values[i]), eT, eR));

  // groups present, in codebook order
  const present = new Set(rows.map((i) => gc.values[i]));
  const lv = (gc.levels || []).map((l, j) => [l, j]).filter(([, j]) => present.has(j));
  const labels = lv.map(([l]) => l);
  const index = new Map(lv.map(([, j], x) => [j, x]));
  const gOf = rows.map((i) => index.get(gc.values[i]));
  const groups = labels.map((_, h) => dct.filter((_, r) => gOf[r] === h));
  const base = { used: rows.length, dropped };
  if (labels.length < 2) return invalid('stats.undefined.needTwoGroups', base);
  const notes = [{ id: 'guidance', severity: 'note', key: 'lab.qpcr.guidance' }, { id: 'method', severity: 'note', key: `lab.note.qpcrMethod.${method}` }];
  const wanted = spec.levels?.controlLevel ?? null;
  let cal = 0;
  if (wanted !== null && wanted !== undefined) {
    cal = labels.indexOf(wanted);
    if (cal < 0) return invalid('lab.invalid.controlNotFound', base);
  } else notes.push({ id: 'control', severity: 'note', key: 'lab.note.controlFirst', params: { level: labels[0] } });
  if (refKeys.length > 1) notes.push({ id: 'references', severity: 'note', key: 'lab.note.qpcrReferences', params: { count: refKeys.length } });
  const calMean = mean(groups[cal]);

  const values = { nSamples: val(rows.length), nGroups: val(labels.length) };
  const tests = [];
  const tables = [];
  let ok;
  if (labels.length === 2) {
    const other = cal === 0 ? 1 : 0;
    const res = tTest(groups[other], groups[cal], { variant, alternative, confLevel });
    ok = res.t !== null;
    values.ddCt = res.estimate === null
      ? nullVal(res.reasonKey || 'stats.undefined.notComputable')
      : val(res.estimate, ok ? { ci: res.ci, ciLevel: confLevel, ciMethod: 't', se: res.se } : { reasonKey: res.reasonKey });
    values.fold = res.estimate === null
      ? nullVal(res.reasonKey || 'stats.undefined.notComputable')
      : val(fold(res.estimate), ok ? { ci: [fold(res.ci[1]), fold(res.ci[0])], ciLevel: confLevel, ciMethod: 't' } : { reasonKey: res.reasonKey });
    tests.push(testRow({ id: 'tTest', name: 't', statistic: res.t, df: res.df, p: res.p, alternative, variant, reasonKey: res.reasonKey }));
    tables.push({ id: 'comparisons', columns: ['pair', 'ddCt', 'lower', 'upper', 'p', 'fold', 'foldLower', 'foldUpper'], rows: [[`${labels[other]}-${labels[cal]}`, res.estimate, res.ci[0], res.ci[1], res.p, fold(res.estimate), fold(res.ci[1]), fold(res.ci[0])]] });
  } else {
    // Dunnett's comparisons are two-sided here (stats/posthoc.js)
    if (alternative !== 'two.sided') return invalid('lab.invalid.dunnettTwoSided', base);
    const a = anova1(groups);
    tests.push(testRow({ id: 'anova', name: 'F', statistic: a.F, dfPair: [a.df1, a.df2], p: a.p, variant: 'oneway', reasonKey: a.reasonKey }));
    const d = dunnett(groups, labels, cal, confLevel);
    ok = a.F !== null && d.crit !== null;
    values.critical = d.crit === null ? nullVal('stats.undefined.zeroVariance') : val(d.crit);
    values.integrationError = val(d.error);
    tables.push({ id: 'comparisons', columns: ['pair', 'ddCt', 'lower', 'upper', 'pAdjusted', 'fold', 'foldLower', 'foldUpper'], rows: d.rows.map((x) => [x.pair, x.diff, x.lower, x.upper, x.p, fold(x.diff), fold(x.upper), fold(x.lower)]) });
    notes.push({ id: 'manyGroups', severity: 'note', key: 'lab.note.qpcrManyGroups' });
    notes.push({ id: 'integration', severity: 'note', key: 'lab.note.dunnettIntegration', params: { error: d.error } });
  }
  tables.unshift(
    { id: 'samples', columns: ['rowId', 'group', 'dCt', 'fold'], rows: rows.map((i, r) => [table.rowIds[i], labels[gOf[r]], dct[r], fold(dct[r] - calMean)]) },
    {
      id: 'groups', columns: ['level', 'n', 'meanDCt', 'sdDCt', 'lower', 'upper', 'fold', 'foldLower', 'foldUpper'],
      rows: groups.map((x, h) => { const s = within(x, confLevel); return [labels[h], s.n, s.mean, s.sd, s.lower, s.upper, fold(s.mean - calMean), s.upper === null ? null : fold(s.upper - calMean), s.lower === null ? null : fold(s.lower - calMean)]; }),
    },
  );
  return { status: ok ? 'ok' : 'invalid', values, tests, tables, used: rows.length, dropped, notes };
}

/** The efficiency percent outside which the note fires (MIQE's commonly used range). */
export const EFFICIENCY_RANGE = Object.freeze([90, 110]);

/**
 * roles x (log10 of the input amount), outcome (Ct); no options besides confLevel.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runQpcrEfficiency(spec, table) {
  const xKey = role(spec, 'x');
  const yKey = role(spec, 'outcome');
  if (!xKey || !yKey) return invalid('stats.error.missingRole');
  const { confLevel } = common(spec);
  if (column(table, xKey).kind !== 'number' || column(table, yKey).kind !== 'number') return invalid('stats.error.needsNumber');
  const { rows, dropped } = completeRows(table, [yKey, xKey]);
  const base = { used: rows.length, dropped };
  const x = rows.map((i) => table.columns[xKey].values[i]);
  const y = rows.map((i) => table.columns[yKey].values[i]);
  if (rows.length < 3) return invalid('lab.undefined.efficiencyFewPoints', base);
  if (new Set(x).size < 2) return invalid('lab.undefined.efficiencyOneInput', base);
  const f = olsQr(x.map((v) => [1, v]), y);
  const q = f.df > 0 ? qt(1 - (1 - confLevel) / 2, f.df) : NaN;
  const ci = (j) => (f.se[j] === null || Number.isNaN(q) ? [null, null] : [f.coef[j] - q * f.se[j], f.coef[j] + q * f.se[j]]);
  const b = f.coef[1];
  const [bLo, bHi] = ci(1);
  const values = {
    slope: f.se[1] === null ? val(b) : val(b, { ci: [bLo, bHi], ciLevel: confLevel, ciMethod: 't', se: f.se[1] }),
    intercept: f.se[0] === null ? val(f.coef[0]) : val(f.coef[0], { ci: ci(0), ciLevel: confLevel, ciMethod: 't', se: f.se[0] }),
    r2: f.r2 === null ? nullVal('stats.undefined.zeroVariance') : val(f.r2),
    n: val(rows.length),
    df: val(f.df),
  };
  const notes = [];
  if (!(b < 0)) {
    values.efficiency = nullVal('lab.undefined.slopeNotNegative');
    values.efficiencyPercent = nullVal('lab.undefined.slopeNotNegative');
  } else {
    const E = 10 ** (-1 / b);
    // the interval maps end to end only while the whole slope interval stays below 0
    const mapped = bLo !== null && bHi !== null && bHi < 0;
    const eCi = mapped ? [10 ** (-1 / bLo), 10 ** (-1 / bHi)] : null;
    values.efficiency = mapped ? val(E, { ci: eCi, ciLevel: confLevel, ciMethod: 'slope' }) : val(E, { reasonKey: bLo === null ? 'stats.undefined.noResidualDf' : 'lab.undefined.efficiencyCiOpen' });
    const pct = (E - 1) * 100;
    values.efficiencyPercent = mapped ? val(pct, { ci: [(eCi[0] - 1) * 100, (eCi[1] - 1) * 100], ciLevel: confLevel, ciMethod: 'slope', below: EFFICIENCY_RANGE[0], above: EFFICIENCY_RANGE[1] }) : val(pct, { reasonKey: bLo === null ? 'stats.undefined.noResidualDf' : 'lab.undefined.efficiencyCiOpen', below: EFFICIENCY_RANGE[0], above: EFFICIENCY_RANGE[1] });
    if (pct < EFFICIENCY_RANGE[0] || pct > EFFICIENCY_RANGE[1]) notes.push({ id: 'efficiencyRange', severity: 'note', key: 'lab.note.efficiencyRange' });
  }
  if (f.perfectFit) notes.push({ id: 'perfectFit', severity: 'note', key: 'stats.note.perfectFit' });
  return { status: 'ok', values, tests: [], tables: [], used: rows.length, dropped, notes };
}
