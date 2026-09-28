// Kaplan-Meier with Greenwood standard errors (R survival 3.8-6 survfit: conf.type log, log-log or plain;
// median with R's interval rule) and the log-rank test (survdiff, rho = 0) [M2-DESIGN.md 3.2.3].
// OWNER: models role.
//
// Kaplan-Meier: at each distinct time t, n at risk (time >= t), d events, c censored; S(t) = prod (1 - d/n).
// Greenwood: var(log S) = sum d / (n (n - d)); the standard error printed is that of S itself, S sqrt(var)
// (summary.survfit's std.err). Intervals as survival's survfit_confint:
//   log      exp(log S -/+ z se_log), upper capped at 1;
//   log-log  exp(-exp(log(-log S) -/+ z se_log / log S)) (log S < 0, so the minus gives the lower bound),
//            undefined at S = 0 or 1;
//   plain    S -/+ z S se_log, clipped to 0 and 1.
// Where S = 0 the standard error and the bounds are null (R prints NaN or NA).
// Median (quantile.survfit): the first time S <= 0.5; if S equals 0.5 exactly over a stretch that ends in a
// later drop, the midpoint of the stretch's start and the drop (survfit(Surv(1:4, rep(1, 4)) ~ 1) gives
// 2.5); if S stays at 0.5 to the end, the start of the stretch. The interval applies the same rule to the
// lower and upper bands; a band that never reaches 0.5 gives no bound (R's NA; here an open bound, printed
// "no upper limit").
// Log-rank (survdiff, rho = 0): O and E per group summed over event times, the variance matrix
// sum d (n - d) / (n - 1) (n_g / n)(delta_gh - n_h / n), and X2 = (O - E)' V^- (O - E) on the groups with
// E > 0 less one.
import { pchisqUpper, qnorm } from '../stats/dist.js';
import { val, nullVal, testRow, role, common, completeRows, column, invalid } from '../stats/common.js';

const TOL = Math.sqrt(2.220446049250313e-16);

/**
 * roles time, event (levels.outcomePositive names the event level), group (optional); options confType, test.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runKaplanMeier(spec, table) {
  const tKey = role(spec, 'time');
  const eKey = role(spec, 'event');
  const gKey = role(spec, 'group');
  if (!table || !tKey || !eKey) return invalid('stats.error.missingRole');
  const { confLevel } = common(spec);
  const confType = ['log', 'log-log', 'plain'].includes(spec?.options?.confType) ? spec.options.confType : 'log';
  const testOpt = spec?.options?.test === 'none' ? 'none' : 'logrank';
  let { rows, dropped } = completeRows(table, [tKey, eKey, ...(gKey ? [gKey] : [])]);
  const tc = column(table, tKey);
  if (tc.kind !== 'number') return invalid('stats.error.needsNumber', { dropped });
  const neg = rows.filter((i) => !(tc.values[i] >= 0));
  if (neg.length) {
    rows = rows.filter((i) => tc.values[i] >= 0);
    dropped = [...dropped, { reason: 'invalid', column: tKey, count: neg.length }];
  }
  const ec = column(table, eKey);
  let isEvent;
  if (ec.kind === 'category') {
    const pos = spec?.levels?.outcomePositive ?? null;
    const posIdx = pos == null ? -1 : (ec.levels || []).indexOf(pos);
    if (posIdx < 0) return invalid('models.error.needEventLevel', { dropped });
    if (new Set(rows.map((i) => ec.values[i])).size > 2) return invalid('models.error.eventNotBinary', { dropped });
    isEvent = (i) => ec.values[i] === posIdx;
  } else if (ec.kind === 'number') {
    if (rows.some((i) => ec.values[i] !== 0 && ec.values[i] !== 1)) return invalid('models.error.eventNotBinary', { dropped });
    isEvent = (i) => ec.values[i] === 1;
  } else return invalid('models.error.eventNotBinary', { dropped });
  if (!rows.length) return invalid('stats.undefined.noData', { dropped });

  // Groups in codebook order; a level no used row carries is left out.
  let labels = [''];
  let groupOf = () => 0;
  if (gKey) {
    const gc = column(table, gKey);
    if (gc.kind !== 'category') return invalid('stats.error.needsCategory', { dropped });
    const levels = gc.levels || [];
    const present = levels.map((_, j) => j).filter((j) => rows.some((i) => gc.values[i] === j));
    labels = present.map((j) => levels[j]);
    groupOf = (i) => present.indexOf(gc.values[i]);
  }
  const time = rows.map((i) => tc.values[i]);
  const event = rows.map(isEvent);
  const group = rows.map(groupOf);

  const values = {};
  const survRows = [];
  const medRows = [];
  const grouped = labels.length > 1 || gKey;
  labels.forEach((lab, g) => {
    const idx = group.map((gg, i) => (gg === g ? i : -1)).filter((i) => i >= 0);
    const km = kaplanMeier(idx.map((i) => time[i]), idx.map((i) => event[i]), confType, confLevel);
    const suffix = grouped ? `:${lab}` : '';
    const events = idx.filter((i) => event[i]).length;
    km.time.forEach((t, k) => survRows.push([grouped ? lab : null, t, km.nRisk[k], km.nEvent[k], km.nCensor[k], km.surv[k], km.se[k], km.lower[k], km.upper[k]]));
    const lo = km.medianCi[0];
    const hi = km.medianCi[1];
    if (km.median === null) values[`median${suffix}`] = nullVal('models.undefined.medianNotReached');
    else {
      const extra = { ci: [lo === null ? -Infinity : lo, hi === null ? Infinity : hi], ciLevel: confLevel, ciMethod: confType };
      if (hi === null) extra.noteKey = 'models.undefined.noUpper';
      else if (lo === null) extra.noteKey = 'models.undefined.noLower';
      values[`median${suffix}`] = val(km.median, extra);
    }
    values[`n${grouped ? `:${lab}` : ''}`] = val(idx.length);
    values[`events${suffix}`] = val(events);
    medRows.push([grouped ? lab : null, idx.length, events, km.median, lo, km.median === null ? null : hi === null ? Infinity : hi]);
  });
  const tests = [];
  // One curve: no group column (a dash there would read as an undefined value).
  const cut = (cols, rows) => (grouped ? { columns: cols, rows } : { columns: cols.slice(1), rows: rows.map((r) => r.slice(1)) });
  const tables = [
    { id: 'survival', ...cut(['ws.col.group', 'models.col.time', 'models.col.nRisk', 'models.col.nEvent', 'models.col.nCensor', 'models.col.surv', 'ws.col.se', 'ws.col.lower', 'ws.col.upper'], survRows) },
    { id: 'medians', ...cut(['ws.col.group', 'ws.col.n', 'models.col.events', 'models.col.median', 'ws.col.lower', 'ws.col.upper'], medRows) },
  ];
  if (testOpt === 'logrank' && labels.length > 1) {
    const lr = logRank(time, event, group);
    tests.push(testRow({ id: 'logrank', name: 'X2', statistic: lr.statistic, df: lr.df, p: lr.p, variant: 'logrank' }));
    tables.push({ id: 'logrank', columns: ['ws.col.group', 'models.col.observed', 'models.col.expected'], rows: labels.map((l, g) => [l, lr.observed[g], lr.expected[g]]) });
  }
  return {
    status: 'ok',
    values,
    tests,
    tables,
    used: rows.length,
    dropped,
    notes: [{ id: 'G22', severity: 'note', key: 'models.guard.G22.title', bodyKey: 'models.guard.G22.censoring' }],
    // one curve has nothing to compare: the log-rank option falls back to 'none' (recorded with a note)
    ...(testOpt === 'logrank' && labels.length < 2 ? { resolvedOptions: { test: 'none' } } : {}),
  };
}

/**
 * @param {number[]} time
 * @param {boolean[]} event
 * @param {'log'|'log-log'|'plain'} confType
 * @param {number} confLevel
 * @returns {{ time: number[], nRisk: number[], nEvent: number[], nCensor: number[], surv: number[], se: (number|null)[], lower: (number|null)[], upper: (number|null)[], median: number|null, medianCi: [number|null, number|null] }}
 */
export function kaplanMeier(time, event, confType = 'log', confLevel = 0.95) {
  const ord = time.map((_, i) => i).sort((a, b) => time[a] - time[b]);
  const out = { time: [], nRisk: [], nEvent: [], nCensor: [], surv: [], se: [], lower: [], upper: [], median: null, medianCi: [null, null] };
  const z = qnorm(1 - (1 - confLevel) / 2);
  let atRisk = time.length;
  let s = 1;
  let gw = 0;
  const seLog = [];
  for (let k = 0; k < ord.length;) {
    const t = time[ord[k]];
    let d = 0;
    let c = 0;
    let m = k;
    while (m < ord.length && time[ord[m]] === t) { if (event[ord[m]]) d++; else c++; m++; }
    if (d > 0) {
      s *= 1 - d / atRisk;
      gw += atRisk > d ? d / (atRisk * (atRisk - d)) : Infinity;
    }
    out.time.push(t);
    out.nRisk.push(atRisk);
    out.nEvent.push(d);
    out.nCensor.push(c);
    out.surv.push(s);
    seLog.push(Math.sqrt(gw));
    atRisk -= d + c;
    k = m;
  }
  out.surv.forEach((p, k) => {
    const sl = seLog[k];
    if (p === 0 || !Number.isFinite(sl)) { out.se.push(null); out.lower.push(null); out.upper.push(null); return; }
    out.se.push(p * sl);
    if (confType === 'plain') {
      const w = z * sl * p;
      out.lower.push(Math.max(p - w, 0));
      out.upper.push(Math.min(p + w, 1));
    } else if (confType === 'log-log') {
      if (p === 1) { out.lower.push(null); out.upper.push(null); return; }
      const w = (z * sl) / Math.log(p);
      out.lower.push(Math.exp(-Math.exp(Math.log(-Math.log(p)) - w)));
      out.upper.push(Math.exp(-Math.exp(Math.log(-Math.log(p)) + w)));
    } else {
      const w = z * sl;
      out.lower.push(Math.exp(Math.log(p) - w));
      out.upper.push(Math.min(Math.exp(Math.log(p) + w), 1));
    }
  });
  out.median = crossing(out.time, out.surv, 0.5);
  out.medianCi = [crossing(out.time, out.lower, 0.5), crossing(out.time, out.upper, 0.5)];
  return out;
}

/**
 * The time a step curve reaches p, as quantile.survfit: the first time the curve is at or below p; when it
 * sits at p exactly (within sqrt(machine epsilon)), the midpoint to the next time the curve drops below p.
 * Null values in `y` (an undefined band) never count as reaching p.
 */
function crossing(x, y, p) {
  for (let k = 0; k < y.length; k++) {
    if (y[k] === null) continue;
    if (Math.abs(y[k] - p) < TOL) {
      for (let m = k + 1; m < y.length; m++) if (y[m] !== null && y[m] < p - TOL) return (x[k] + x[m]) / 2;
      return x[k];
    }
    if (y[k] < p) return x[k];
  }
  return null;
}

/**
 * @param {number[]} time
 * @param {boolean[]} event
 * @param {number[]} group   group index per row
 * @returns {{ statistic: number, df: number, p: number, observed: number[], expected: number[] }}
 */
export function logRank(time, event, group) {
  const G = Math.max(...group) + 1;
  const obs = new Array(G).fill(0);
  const exp = new Array(G).fill(0);
  const V = Array.from({ length: G }, () => new Array(G).fill(0));
  const times = [...new Set(time.filter((_, i) => event[i]))].sort((a, b) => a - b);
  for (const t of times) {
    const nG = new Array(G).fill(0);
    const dG = new Array(G).fill(0);
    for (let i = 0; i < time.length; i++) {
      if (time[i] >= t) nG[group[i]]++;
      if (time[i] === t && event[i]) dG[group[i]]++;
    }
    const nn = nG.reduce((a, b) => a + b, 0);
    const d = dG.reduce((a, b) => a + b, 0);
    for (let g = 0; g < G; g++) { obs[g] += dG[g]; exp[g] += (d * nG[g]) / nn; }
    if (nn > 1) {
      const f = (d * (nn - d)) / (nn - 1);
      for (let g = 0; g < G; g++) for (let h = 0; h < G; h++) V[g][h] += f * (nG[g] / nn) * ((g === h ? 1 : 0) - nG[h] / nn);
    }
  }
  // survdiff: the groups with expected > 0, the last of them dropped (the rest determine it).
  const keep = exp.map((e, g) => (e > 0 ? g : -1)).filter((g) => g >= 0);
  const use = keep.slice(0, -1);
  const df = use.length;
  if (!df) return { statistic: NaN, df: 0, p: NaN, observed: obs, expected: exp };
  const zv = use.map((g) => obs[g] - exp[g]);
  const Vs = use.map((g) => use.map((h) => V[g][h]));
  const sol = solveSym(Vs, zv);
  const stat = sol === null ? NaN : zv.reduce((s, v, i) => s + v * sol[i], 0);
  return { statistic: stat, df, p: Number.isFinite(stat) ? pchisqUpper(stat, df) : NaN, observed: obs, expected: exp };
}

/** Solve A x = b for a small symmetric positive-definite A by Gaussian elimination with partial pivoting. */
function solveSym(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    if (!(Math.abs(M[piv][c]) > 1e-12)) return null;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = c + 1; r < n; r++) {
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i][n];
    for (let k = i + 1; k < n; k++) s -= M[i][k] * x[k];
    x[i] = s / M[i][i];
  }
  return x;
}
