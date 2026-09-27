// Diagnostic test evaluation against a reference [M1-DESIGN.md 7.18]: Se, Sp, PPV, NPV, accuracy
// with Wilson or exact intervals; LR+ and LR- with log-method intervals (Simel et al. 1991).
// PPV and NPV carry note G19. OWNER: epi role.
//
// Simel, Samsa and Matchar 1991 J Clin Epidemiol 44:763-770: var(ln LR+) = 1/TP - 1/(TP + FN)
// + 1/FP - 1/(FP + TN); var(ln LR-) = 1/FN - 1/(TP + FN) + 1/TN - 1/(FP + TN).
// Prevalence here is the share of reference-positive animals in this sample; PPV and NPV hold
// only at that prevalence (G19, and the Module 5 bench in the main app).

import { proportionCi } from '../stats/proportion.js';
import { qnorm } from '../stats/dist.js';
import { getColumn, eachRow, binaryReader, invalidOutput, val, nul, guarded } from './_table.js';

/** @typedef {import('../runtime/types.js').Value} Value */

function prop(x, n, method, confLevel, reasonKey) {
  if (n === 0) return nul(reasonKey);
  const v = proportionCi(x, n, method, confLevel);
  return { ...v, value: x / n, ciLevel: v.ciLevel ?? confLevel, ciMethod: v.ciMethod ?? method };
}

function lr(est, se, z, confLevel) {
  if (!Number.isFinite(est) || !Number.isFinite(se)) return val(est, { ci: [null, null], ciLevel: confLevel, se: null, reasonKey: 'epi.undefined.zeroCellCi' });
  return val(est, { ci: [est * Math.exp(-z * se), est * Math.exp(z * se)], ciLevel: confLevel, ciMethod: 'log', se });
}

/**
 * @param {{ TP: number, FN: number, FP: number, TN: number }} counts
 * @param {{ ciMethod?: 'wilson'|'exact', confLevel?: number }} opts
 * @returns {Object<string, Value>}  Se, Sp, PPV, NPV, accuracy, LRpos, LRneg, prevalence
 */
export function diagnosticAccuracy(counts, opts = {}) {
  const { TP, FN, FP, TN } = counts;
  for (const v of [TP, FN, FP, TN]) {
    if (!Number.isInteger(v) || v < 0) throw Object.assign(new Error('bad counts'), { key: 'epi.error.badCounts' });
  }
  const method = opts.ciMethod ?? 'wilson';
  const confLevel = opts.confLevel ?? 0.95;
  const z = qnorm(1 - (1 - confLevel) / 2);
  const dpos = TP + FN, dneg = FP + TN, tpos = TP + FP, tneg = FN + TN, n = dpos + dneg;
  const out = {
    Se: prop(TP, dpos, method, confLevel, 'epi.undefined.noReferencePositive'),
    Sp: prop(TN, dneg, method, confLevel, 'epi.undefined.noReferenceNegative'),
    PPV: prop(TP, tpos, method, confLevel, 'epi.undefined.noTestPositive'),
    NPV: prop(TN, tneg, method, confLevel, 'epi.undefined.noTestNegative'),
    accuracy: prop(TP + TN, n, method, confLevel, 'epi.undefined.noDenominator'),
    prevalence: prop(dpos, n, method, confLevel, 'epi.undefined.noDenominator'),
  };
  // LR+ = Se / (1 - Sp); undefined when there is no reference-positive or -negative animal, or FP = 0.
  if (dpos === 0 || dneg === 0) {
    out.LRpos = nul('epi.undefined.noReferenceGroup');
    out.LRneg = nul('epi.undefined.noReferenceGroup');
  } else {
    const se = TP / dpos, sp = TN / dneg;
    if (FP === 0) out.LRpos = nul('epi.undefined.lrPosNoFalsePositive');
    else out.LRpos = lr(se / (1 - sp), TP > 0 ? Math.sqrt(1 / TP - 1 / dpos + 1 / FP - 1 / dneg) : NaN, z, confLevel);
    if (TN === 0) out.LRneg = nul('epi.undefined.lrNegNoTrueNegative');
    else out.LRneg = lr((1 - se) / sp, FN > 0 ? Math.sqrt(1 / FN - 1 / dpos + 1 / TN - 1 / dneg) : NaN, z, confLevel);
  }
  return out;
}

/**
 * Implementation for 'dx.accuracy'. Input: counts { TP, FN, FP, TN } or a dataset with roles.test,
 * roles.reference, levels.testPositive and levels.referencePositive. Table 'counts' holds the 2x2
 * (rows test positive, negative; columns reference positive, negative).
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runDiagnostic(spec, table) {
  return guarded(() => {
    const o = spec.options || {};
    let counts, used, dropped = [];
    if (spec.input?.kind === 'counts') {
      counts = spec.input.counts;
      used = counts.TP + counts.FN + counts.FP + counts.TN;
    } else {
      if (!table) return invalidOutput('epi.error.noData');
      const tKey = spec.roles.test, rKey = spec.roles.reference;
      const tr = binaryReader(getColumn(table, tKey), spec.levels.testPositive, null);
      const rr = binaryReader(getColumn(table, rKey), spec.levels.referencePositive, null);
      counts = { TP: 0, FN: 0, FP: 0, TN: 0 };
      const res = eachRow(table, [tKey, rKey], (r) => {
        const t = tr(r), d = rr(r);
        if (t === null) return { filter: tKey };
        if (d === null) return { filter: rKey };
        if (t && d) counts.TP++; else if (!t && d) counts.FN++; else if (t) counts.FP++; else counts.TN++;
        return undefined;
      });
      used = res.used; dropped = res.dropped;
    }
    const values = diagnosticAccuracy(counts, { ciMethod: o.ciMethod, confLevel: o.confLevel });
    const { TP, FN, FP, TN } = counts;
    return {
      status: 'ok', values, tests: [],
      tables: [{ id: 'counts', columns: ['test', 'referencePositive', 'referenceNegative', 'total'], rows: [
        ['positive', TP, FP, TP + FP], ['negative', FN, TN, FN + TN], ['total', TP + FN, FP + TN, TP + FN + FP + TN],
      ] }],
      used, dropped,
    };
  });
}
