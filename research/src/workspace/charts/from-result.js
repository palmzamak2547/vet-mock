// Which charts a result can draw, and their inputs, read from the result's envelope and (for charts of
// every animal) from the rows the result used [M2-DESIGN.md 8.2]. The envelope supplies every estimate,
// interval and table; the rows supply only the observations the dots show. A result computed on an
// earlier version of the data offers only the charts its envelope can draw (the dots would no longer be
// the animals it used). Pure. OWNER: graphs role.
//
// Envelope tables read here (owners, please keep these ids and columns):
//   epi.mantelHaenszel  'strata' [stratum, a, b, c, d, estimate, ciLow, ciHigh] (M1)
//   anova.repeated      'means'  [time, group, n, mean, lower, upper] (lab; group null without one)
//   surv.kaplanMeier    'survival' [group, time, nRisk, nEvent, nCensor, surv, lower, upper], one row per
//                       distinct time (event or censored), as R's survfit (models)
//   roc.delong          'coords' [test, threshold, se, sp] (test = 'test' or 'test2'), 'youden' the same
//                       columns for the tied best cut-offs; values AUC (and AUC2) with ci (measure)
//   agree.blandAltman   'points' [mean, difference]; values bias, loaLower, loaUpper with ci (measure)
// M3a (lab; M3-DESIGN.md 5, the lab builders' notes):
//   nls.fourPL          'curve' [x, fitted, lower, upper] (a row at x = 0 first when a dose of 0 exists),
//                       'potency' [kind, estimate, lower, upper, response], 'unknowns' [rowId, response, x, lower,
//                       upper, reason] (x null = outside the curve)
//   nls.doseResponse    'curve' [group, x, fitted, lower, upper], 'potency' [group, kind, estimate, lower, upper,
//                       response, n, r2] (group null without a group role)
//   nls.equation        'curve' [x, fitted, lower, upper]
//   calc.auc            'means' [time, group, n, mean, sd, lower, upper] (numeric times), 'areas' [animal, group,
//                       area, nTimes]
//   qpcr.relative       'samples' [rowId, group, dCt, fold], 'groups' [level, n, meanDCt, sdDCt, lower, upper,
//                       fold, foldLower, foldUpper]
//   mv.pca              'components' [component, eigenvalue, sdev, proportion, cumulative], 'biplotPoints'
//                       [rowId, subject, group, pc1, pc2], 'biplotArrows' [item, pc1, pc2]
//   anova.repeated      with factorB: 'means' [time, factorB, group, n, mean, sd, lower, upper]
import { completeRows, groupsAt, numbersAt, role } from '../../lib/stats/common.js';
import { seFromLogCi } from './helpers.js';
import { valueKind } from '../lib/method-ui.js';

const num = (v) => typeof v === 'number' && Number.isFinite(v);
/** Chart titles of the M3 charts (graphs words; the M2 charts take ws.chart.title.<kind>). */
const TITLE = Object.freeze({
  standardCurve: 'graphs.title.standardCurve', doseResponse: 'graphs.title.doseResponse', fittedCurve: 'graphs.title.fittedCurve',
  aucCourse: 'graphs.title.aucCourse', aucAreas: 'graphs.title.aucAreas', qpcrFold: 'graphs.title.qpcrFold',
  scree: 'graphs.title.scree', biplot: 'graphs.title.biplot', twoWithin: 'graphs.title.twoWithin',
});
/** A table cell as a group key: '' for a null group (one curve, no group role). */
const cellKey = (v) => (v === null || v === undefined ? '' : String(v));
/** A share (0 to 1) as a percent with one decimal. */
const pct1 = (v) => (num(v) ? `${(v * 100).toFixed(1)}%` : '');
/** The text a subject or level cell of the open table shows (a category's level, else the value). */
const cellText = (col, i) => (col.kind === 'category' ? cellKey((col.levels || [])[col.values[i]]) : cellKey(col.values[i]));
const tableOf = (env, id) => (env?.tables || []).find((tb) => tb.id === id) || null;
const colOf = (tb, ...names) => {
  if (!tb) return -1;
  for (const n of names) {
    const i = tb.columns.indexOf(n);
    if (i >= 0) return i;
  }
  return -1;
};

/** Numeric groups of `yKey` by the category `gKey` on complete rows. */
function groupsFrom(table, yKey, gKey, levelOf = (k, v) => v) {
  const { rows } = completeRows(table, [yKey, gKey]);
  const g = groupsAt(table, yKey, gKey, rows);
  return g.labels.map((label, i) => ({ label: levelOf(gKey, label), values: g.groups[i] }));
}

function columnValues(table, key) {
  const { rows } = completeRows(table, [key]);
  return numbersAt(table, key, rows);
}

/** The ratio value a p-value function can be drawn for: estimate > 0 with a two-sided interval. */
function ratioValue(env) {
  for (const [name, v] of Object.entries(env?.values || {})) {
    if (valueKind(name) !== 'ratio') continue;
    if (num(v?.value) && v.value > 0 && Array.isArray(v.ci) && v.ci[0] > 0 && num(v.ci[1])) return { name, ...v };
  }
  return null;
}

/**
 * @param {{ id?: string, spec: any, envelope: any }} analysis
 * @param {import('../../lib/runtime/types.js').WorkingTable|null} table   the data now open
 * @param {{ labelOf?: (key: string) => string, levelOf?: (key: string, value: string) => string, stale?: boolean, t?: (k: string, p?: any) => string }} [o]
 *   levelOf: a level's codebook label in the page language (review round 1: charts printed raw codes, and
 *   Thai level values in the English page)
 * @returns {{ id: string, kind: string, input: any, needsRows: boolean }[]}
 */
export function chartOptions(analysis, table, o = {}) {
  const env = analysis?.envelope;
  const spec = analysis?.spec || env?.spec || {};
  if (!env || env.status !== 'ok') return [];
  const method = env.method?.id || spec.method;
  const labelOf = o.labelOf || ((k) => k);
  const levelOf = o.levelOf || ((k, v) => v);
  // A value's name as the result view prints it ('oddsRatio:c2=B' -> "OR (Diet: B vs A)"), when the caller has one.
  const nameOf = o.nameOf || ((nm) => nm);
  const rowsOk = Boolean(table) && !o.stale;
  const level = Object.values(env.values || {}).find((v) => v?.ciLevel)?.ciLevel ?? spec.options?.confLevel ?? 0.95;
  const out = [];
  // titleKey: an M3 chart's own title (graphs words); without it the screen uses ws.chart.title.<kind>
  const add = (kind, input, needsRows, titleKey) => out.push({ id: `${analysis.id || method}:${kind}`, kind, input, needsRows, ...(titleKey ? { titleKey } : {}) });
  const safe = (fn) => { try { fn(); } catch { /* a role column that no longer exists: no chart */ } };

  const yKey = role(spec, 'outcome');
  const gKey = role(spec, 'group') ?? role(spec, 'exposure');
  const variant = spec.options?.variant;

  if (rowsOk) {
    if ((method === 'test.tTest' && variant !== 'paired' && variant !== 'one-sample') || method === 'test.anova1' || method === 'anova.twoWay') {
      safe(() => {
        const groups = groupsFrom(table, yKey, gKey, levelOf);
        const base = { groups, yTitle: labelOf(yKey), xTitle: labelOf(gKey), level };
        add('dot', { ...base, center: 'mean' }, true);
        add('box', base, true);
        add('violin', base, true);
        const est = env.values?.estimate;
        if (method === 'test.tTest' && groups.length === 2 && est) {
          // the envelope's difference is first minus second; the plot shows second minus first
          add('estimation', { ...base, diff: { value: num(est.value) ? -est.value : null, lo: num(est.ci?.[1]) ? -est.ci[1] : null, hi: num(est.ci?.[0]) ? -est.ci[0] : null } }, true);
        }
      });
    }
    if (method === 'test.mannWhitney' || method === 'test.kruskalWallis') {
      safe(() => {
        const base = { groups: groupsFrom(table, yKey, gKey, levelOf), yTitle: labelOf(yKey), xTitle: labelOf(gKey), level };
        add('dot', { ...base, center: 'median' }, true);
        add('box', base, true);
        add('violin', base, true);
      });
    }
    if ((method === 'test.tTest' && variant === 'paired') || method === 'test.wilcoxonSignedRank') {
      safe(() => {
        const a = role(spec, 'x') ?? role(spec, 'outcome');
        const b = role(spec, 'y');
        const { rows } = completeRows(table, [a, b]);
        add('dot', { groups: [{ label: labelOf(a), values: numbersAt(table, a, rows) }, { label: labelOf(b), values: numbersAt(table, b, rows) }], paired: true, center: method === 'test.tTest' ? 'mean' : 'median', yTitle: '', level }, true);
      });
    }
    if (method === 'desc.summary' || (method === 'test.tTest' && variant === 'one-sample')) {
      safe(() => {
        const x = role(spec, 'x') ?? role(spec, 'outcome');
        const g = role(spec, 'group');
        const groups = g ? groupsFrom(table, x, g, levelOf) : [{ label: labelOf(x), values: columnValues(table, x) }];
        const base = { groups, yTitle: labelOf(x), xTitle: g ? labelOf(g) : '', level };
        add('dot', { ...base, center: method === 'desc.summary' ? 'median' : 'mean' }, true);
        add('box', base, true);
        add('violin', base, true);
      });
    }
    if (method === 'qpcr.efficiency') {
      // the dilution series: Ct against log10 of the input amount, with its least-squares line (the slope the
      // efficiency comes from; the line is the kit's pinned OLS helper on the same points the result used)
      safe(() => {
        const xk = role(spec, 'x');
        const yk = role(spec, 'outcome');
        const { rows } = completeRows(table, [xk, yk]);
        const xs = numbersAt(table, xk, rows);
        const ys = numbersAt(table, yk, rows);
        add('scatter', { points: xs.map((x, i) => ({ x, y: ys[i] })), xTitle: labelOf(xk), yTitle: labelOf(yk), line: true, level }, true);
      });
    }
    if (method === 'corr.pearson' || method === 'corr.spearman' || method === 'reg.ols') {
      safe(() => {
        const xk = method === 'reg.ols' ? [].concat(spec.roles?.covariates ?? role(spec, 'x') ?? [])[0] : role(spec, 'x');
        const yk = method === 'reg.ols' ? (role(spec, 'outcome') ?? role(spec, 'y')) : (role(spec, 'y') ?? role(spec, 'outcome'));
        const covs = [].concat(spec.roles?.covariates ?? []);
        if (method === 'reg.ols' && covs.length > 1) return; // a line of one predictor would not be this model
        const { rows } = completeRows(table, [xk, yk]);
        const xs = numbersAt(table, xk, rows);
        const ys = numbersAt(table, yk, rows);
        add('scatter', { points: xs.map((x, i) => ({ x, y: ys[i] })), xTitle: labelOf(xk), yTitle: labelOf(yk), line: method !== 'corr.spearman', level }, true);
      });
    }
  }

  // Charts drawn from the envelope alone
  if (method === 'epi.mantelHaenszel') {
    const tb = tableOf(env, 'strata');
    const r = ratioValue(env);
    if (tb) {
      const [li, ei, lo, hi] = [colOf(tb, 'stratum'), colOf(tb, 'estimate'), colOf(tb, 'ciLow'), colOf(tb, 'ciHigh')];
      const sKey = [].concat(spec.roles?.strata || [])[0] || null;
      const rows = tb.rows.map((row) => ({ label: sKey ? levelOf(sKey, String(row[li])) : String(row[li]), est: row[ei], lo: row[lo], hi: row[hi], kind: 'stratum', note: row[ei] === null ? (o.t ? o.t('graphs.forest.undefinedStratum') : '') : '' }));
      if (r) rows.push({ label: o.t ? o.t('graphs.forest.pooled', { name: nameOf(r.name) }) : nameOf(r.name), est: r.value, lo: r.ci[0], hi: r.ci[1], kind: 'pooled' });
      add('forest', { rows, measure: r?.name, xTitle: r ? nameOf(r.name) : '', level }, false);
    }
  }
  const r = ratioValue(env);
  if (r && (method === 'epi.mantelHaenszel' || method === 'epi.twoByTwo' || method === 'reg.logistic' || method === 'reg.poisson')) {
    // The curve is a Wald curve on the log scale: it is drawn only when it passes through the interval the result
    // reports, that is a Wald-log interval or one symmetric on the log scale. A profile-likelihood interval is not
    // symmetric, and a curve built from its width would cross p = 0.05 away from the printed bounds and print a
    // p at 1 that no test gave (review round 2: 1.09 and 8.88 against the reported 1.13 to 9.25).
    const [lo, hi] = Array.isArray(r.ci) ? r.ci : [null, null];
    const symmetric = num(lo) && num(hi) && lo > 0 && hi > 0 && r.value > 0
      && Math.abs(Math.log(r.value / lo) - Math.log(hi / r.value)) <= 1e-6 * Math.max(1, Math.log(hi / lo));
    const se = num(r.se) && r.ciMethod === 'wald-log' ? r.se : symmetric ? seFromLogCi(r.ci, r.ciLevel ?? level) : null;
    if (se) add('ciFunction', { est: r.value, se, label: nameOf(r.name), xTitle: nameOf(r.name), level: r.ciLevel ?? level }, false);
  }
  if (method === 'anova.repeated' && tableOf(env, 'means') && colOf(tableOf(env, 'means'), 'factorB') >= 0) {
    // two within factors (M3): one panel per group, one line per level of the second factor (time-panels.js)
    safe(() => {
      const tb = tableOf(env, 'means');
      const [ti, bi, gi, ni, mi, li, ui] = ['time', 'factorB', 'group', 'n', 'mean', 'lower', 'upper'].map((c) => colOf(tb, c));
      const timeKey = role(spec, 'time');
      const fbKey = role(spec, 'factorB');
      const times = [];
      const levels = [];
      const groups = [];
      for (const row of tb.rows) {
        if (!times.includes(cellKey(row[ti]))) times.push(cellKey(row[ti]));
        if (!levels.includes(cellKey(row[bi]))) levels.push(cellKey(row[bi]));
        const g = gi >= 0 ? cellKey(row[gi]) : '';
        if (!groups.includes(g)) groups.push(g);
      }
      const panels = groups.map((g) => ({
        label: g ? levelOf(gKey, g) : null,
        series: levels.map((b) => ({
          label: levelOf(fbKey, b),
          points: tb.rows.filter((row) => (gi >= 0 ? cellKey(row[gi]) : '') === g && cellKey(row[bi]) === b)
            .map((row) => ({ time: times.indexOf(cellKey(row[ti])), mean: row[mi], lo: row[li], hi: row[ui], n: ni >= 0 ? row[ni] : undefined })),
        })),
      }));
      add('timeCourse', { panels, times: times.map((x) => levelOf(timeKey, x)), seriesTitle: labelOf(fbKey), panelTitle: groups.some(Boolean) && gKey ? labelOf(gKey) : '', yTitle: labelOf(yKey), xTitle: labelOf(timeKey), level }, false, TITLE.twoWithin);
    });
  } else if (method === 'anova.repeated') {
    const tb = tableOf(env, 'means');
    if (tb) {
      const [ti, gi, ni, mi, li, ui] = [colOf(tb, 'time'), colOf(tb, 'group'), colOf(tb, 'n'), colOf(tb, 'mean'), colOf(tb, 'lower', 'ciLow'), colOf(tb, 'upper', 'ciHigh')];
      const times = [];
      const groups = [];
      for (const row of tb.rows) {
        if (!times.includes(String(row[ti]))) times.push(String(row[ti]));
        const g = gi >= 0 && row[gi] !== null ? String(row[gi]) : '';
        if (!groups.includes(g)) groups.push(g);
      }
      const timeKey = role(spec, 'time');
      const series = groups.map((g) => ({ label: g ? levelOf(gKey, g) : labelOf(yKey), points: tb.rows.filter((row) => (gi >= 0 && row[gi] !== null ? String(row[gi]) : '') === g).map((row) => ({ time: times.indexOf(String(row[ti])), mean: row[mi], lo: row[li], hi: row[ui], n: ni >= 0 ? row[ni] : undefined })) }));
      add('timeCourse', { times: times.map((x) => levelOf(timeKey, x)), series, yTitle: labelOf(yKey), xTitle: labelOf(timeKey), level }, false);
    }
  }
  if (method === 'surv.kaplanMeier') {
    const tb = tableOf(env, 'survival');
    if (tb) {
      // The models area names its columns by dictionary key ('models.col.time', 'ws.col.group'); plain
      // ids are read too.
      const c = Object.fromEntries(['group', 'time', 'nRisk', 'nEvent', 'nCensor', 'surv', 'lower', 'upper'].map((k) => [k, colOf(tb, k, `models.col.${k}`, `ws.col.${k}`)]));
      const groups = [];
      for (const row of tb.rows) { const g = c.group >= 0 && row[c.group] !== null ? String(row[c.group]) : ''; if (!groups.includes(g)) groups.push(g); }
      const series = groups.map((g) => {
        const rows = tb.rows.filter((row) => (c.group >= 0 && row[c.group] !== null ? String(row[c.group]) : '') === g);
        const pick = (k) => rows.map((row) => (c[k] >= 0 ? row[c[k]] : null));
        return { label: g ? levelOf(role(spec, 'group'), g) : labelOf(role(spec, 'event')), time: pick('time'), nRisk: pick('nRisk'), nEvent: pick('nEvent'), nCensor: pick('nCensor').map((v) => v ?? 0), surv: pick('surv'), lower: pick('lower'), upper: pick('upper') };
      });
      add('kaplanMeier', { series, band: true, xTitle: labelOf(role(spec, 'time')), yTitle: o.t ? o.t('graphs.km.yTitle') : '', level }, false);
    }
  }
  if (method === 'roc.delong') {
    const tb = tableOf(env, 'coords');
    if (tb) {
      const yt = tableOf(env, 'youden');
      const [ti, thi, sei, spi] = [colOf(tb, 'test'), colOf(tb, 'threshold'), colOf(tb, 'se', 'sensitivity'), colOf(tb, 'sp', 'specificity')];
      const tests = [...new Set(tb.rows.map((row) => (ti >= 0 ? row[ti] : 'test')))];
      const curves = tests.map((tk, k) => {
        const v = env.values?.[k === 0 ? 'AUC' : 'AUC2'] || env.values?.[k === 0 ? 'auc' : 'auc2'];
        const pts = tb.rows.filter((row) => (ti >= 0 ? row[ti] : 'test') === tk).map((row) => ({ threshold: row[thi], se: row[sei], sp: row[spi] }));
        const yd = yt ? yt.rows.filter((row) => (ti >= 0 ? row[colOf(yt, 'test')] : 'test') === tk).map((row) => ({ threshold: row[colOf(yt, 'threshold')], se: row[colOf(yt, 'se', 'sensitivity')], sp: row[colOf(yt, 'sp', 'specificity')] })) : [];
        return { label: labelOf(role(spec, k === 0 ? 'test' : 'test2')), points: pts, auc: v?.value ?? null, aucLo: v?.ci?.[0] ?? null, aucHi: v?.ci?.[1] ?? null, youden: yd };
      });
      add('roc', { curves, level }, false);
    }
  }
  if (method === 'agree.blandAltman') {
    const tb = tableOf(env, 'points');
    if (tb) {
      const [mi, di] = [colOf(tb, 'mean'), colOf(tb, 'difference', 'diff')];
      const v = env.values || {};
      const pick = (...names) => { for (const n of names) if (v[n]) return { value: v[n].value, lo: v[n].ci?.[0] ?? null, hi: v[n].ci?.[1] ?? null }; return { value: null }; };
      add('blandAltman', {
        points: tb.rows.map((row) => ({ mean: row[mi], diff: row[di] })),
        // The bias is named by the scale: 'bias', 'biasPercent' or 'ratioGeoMean' (measure).
        bias: pick('bias', 'biasPercent', 'ratioGeoMean', 'meanDiff'), lower: pick('loaLower', 'lower'), upper: pick('loaUpper', 'upper'),
        scale: spec.options?.scale || 'absolute', multiplier: spec.options?.loaMultiplier ?? 1.96, level,
        xTitle: o.t ? o.t('graphs.ba.xTitle') : '', yTitle: o.t ? o.t(`graphs.ba.yTitle.${spec.options?.scale || 'absolute'}`, { a: labelOf(role(spec, 'raterA')), b: labelOf(role(spec, 'raterB')) }) : '',
      }, false);
    }
  }
  // ---- M3a charts (M3-DESIGN.md 5)
  if (method === 'nls.fourPL' || method === 'nls.doseResponse' || method === 'nls.equation') {
    safe(() => {
      const tb = tableOf(env, 'curve');
      if (!tb) return;
      const [gi, xi, fi, li, ui] = ['group', 'x', 'fitted', 'lower', 'upper'].map((c) => colOf(tb, c));
      const xKey = role(spec, 'x');
      const gk = method === 'nls.doseResponse' ? role(spec, 'group') : null;
      const groupOf = (row) => (gi >= 0 ? cellKey(row[gi]) : '');
      const labels = [];
      for (const row of tb.rows) if (!labels.includes(groupOf(row))) labels.push(groupOf(row));
      const pot = method === 'nls.equation' ? null : tableOf(env, 'potency');
      const potOf = (g) => {
        if (!pot) return null;
        const [pg, pk, pe, pl, pu, pr] = ['group', 'kind', 'estimate', 'lower', 'upper', 'response'].map((c) => colOf(pot, c));
        const row = pot.rows.find((r) => (pg >= 0 ? cellKey(r[pg]) : '') === g);
        return row ? { kind: row[pk], estimate: row[pe], lower: row[pl], upper: row[pu], response: row[pr] } : null;
      };
      // the measured points come from the rows the result used (a standard curve's unknowns have no
      // concentration: they are drawn from the envelope's 'unknowns' table)
      let pts = null;
      if (rowsOk) {
        const keys = [xKey, yKey, ...(gk ? [gk] : [])];
        const { rows } = completeRows(table, keys);
        const xs = numbersAt(table, xKey, rows);
        const ys = numbersAt(table, yKey, rows);
        const gcol = gk ? table.columns[gk] : null;
        pts = rows.map((r, j) => ({ x: xs[j], y: ys[j], g: gcol ? cellText(gcol, r) : '' }));
      }
      const curves = labels.map((g) => ({
        label: g ? levelOf(gk, g) : null,
        curve: tb.rows.filter((row) => groupOf(row) === g).map((row) => ({ x: row[xi], fitted: row[fi], lower: row[li], upper: row[ui] })),
        potency: potOf(g),
        points: pts ? pts.filter((p) => p.g === g).map(({ x, y }) => ({ x, y })) : [],
      }));
      const ut = method === 'nls.fourPL' ? tableOf(env, 'unknowns') : null;
      const unknowns = ut ? ut.rows.map((row) => ({ label: row[colOf(ut, 'rowId')], response: row[colOf(ut, 'response')], x: row[colOf(ut, 'x')], lower: row[colOf(ut, 'lower')], upper: row[colOf(ut, 'upper')], reason: row[colOf(ut, 'reason')] })) : [];
      const kind = method === 'nls.fourPL' ? 'standardCurve' : method === 'nls.equation' ? 'fittedCurve' : 'doseResponse';
      add(kind, { curves, unknowns, xTitle: labelOf(xKey), yTitle: labelOf(yKey), level }, Boolean(pts && pts.length), TITLE[kind]);
    });
  }
  if (method === 'calc.auc') {
    safe(() => {
      const mt = tableOf(env, 'means');
      const at = tableOf(env, 'areas');
      const gk = role(spec, 'group');
      const tk = role(spec, 'time');
      const sk = role(spec, 'subject');
      if (mt) {
        const [ti, gi, ni, mi, li, ui] = ['time', 'group', 'n', 'mean', 'lower', 'upper'].map((c) => colOf(mt, c));
        const tvals = [...new Set(mt.rows.map((r) => r[ti]).filter(num))].sort((a, b) => a - b);
        const groups = [];
        for (const row of mt.rows) { const g = gi >= 0 ? cellKey(row[gi]) : ''; if (!groups.includes(g)) groups.push(g); }
        const series = groups.map((g) => ({
          label: g ? levelOf(gk, g) : labelOf(yKey),
          points: mt.rows.filter((row) => (gi >= 0 ? cellKey(row[gi]) : '') === g).map((row) => ({ time: tvals.indexOf(row[ti]), mean: row[mi], lo: row[li], hi: row[ui], n: ni >= 0 ? row[ni] : undefined })),
        }));
        // one thin line per animal the result kept (the areas table), on that animal's own times
        const animals = [];
        if (rowsOk && at && sk && tk) {
          const kept = new Set(at.rows.map((r) => cellKey(r[colOf(at, 'animal')])));
          const { rows } = completeRows(table, [sk, tk, yKey, ...(gk ? [gk] : [])]);
          const [sc, tc, yc] = [table.columns[sk], table.columns[tk], table.columns[yKey]];
          const gc = gk ? table.columns[gk] : null;
          const byAnimal = new Map();
          for (const r of rows) {
            const id = cellText(sc, r);
            if (!kept.has(id)) continue;
            if (!byAnimal.has(id)) byAnimal.set(id, { series: gc ? groups.indexOf(cellText(gc, r)) : 0, values: new Array(tvals.length).fill(null) });
            const k = tvals.indexOf(tc.values[r]);
            if (k >= 0) byAnimal.get(id).values[k] = yc.values[r];
          }
          for (const a of byAnimal.values()) if (a.series >= 0) animals.push(a);
        }
        add('timeCourse', { variant: 'auc', baseline: spec.options?.baseline ?? 'zero', times: tvals.map((v) => String(v)), timeValues: tvals, series, animals, yTitle: labelOf(yKey), xTitle: labelOf(tk), level }, animals.length > 0, TITLE.aucCourse);
      }
      if (at) {
        const [gi, ri] = [colOf(at, 'group'), colOf(at, 'area')];
        const levels = [];
        for (const row of at.rows) { const g = gi >= 0 ? cellKey(row[gi]) : ''; if (!levels.includes(g)) levels.push(g); }
        const groups = levels.map((g) => ({ label: g ? levelOf(gk, g) : labelOf(yKey), values: at.rows.filter((row) => (gi >= 0 ? cellKey(row[gi]) : '') === g).map((row) => row[ri]).filter(num) }));
        add('dot', { groups, center: 'mean', yTitle: o.t ? o.t('graphs.auc.yTitle', { outcome: labelOf(yKey) }) : labelOf(yKey), xTitle: gk ? labelOf(gk) : '', level }, false, TITLE.aucAreas);
      }
    });
  }
  if (method === 'qpcr.relative') {
    safe(() => {
      const st = tableOf(env, 'samples');
      const gt = tableOf(env, 'groups');
      if (!st || !gt) return;
      const gk = role(spec, 'group');
      const [sg, sf] = [colOf(st, 'group'), colOf(st, 'fold')];
      const [gl, gn, gf, gfl, gfu] = ['level', 'n', 'fold', 'foldLower', 'foldUpper'].map((c) => colOf(gt, c));
      const cal = cellKey(spec.levels?.controlLevel ?? gt.rows[0]?.[gl]);
      const groups = gt.rows.map((row) => ({
        label: levelOf(gk, cellKey(row[gl])),
        n: row[gn],
        folds: st.rows.filter((r) => cellKey(r[sg]) === cellKey(row[gl])).map((r) => r[sf]),
        center: row[gf], lo: row[gfl], hi: row[gfu],
      }));
      add('qpcrFold', { groups, calibrator: levelOf(gk, cal), xTitle: labelOf(gk), level }, false, TITLE.qpcrFold);
    });
  }
  if (method === 'mv.pca') {
    safe(() => {
      const ct = tableOf(env, 'components');
      if (!ct) return;
      const [ci, ei, pi, cu] = ['component', 'eigenvalue', 'proportion', 'cumulative'].map((c) => colOf(ct, c));
      add('scree', { components: ct.rows.map((r) => ({ label: String(r[ci]), eigenvalue: r[ei], proportion: r[pi], cumulative: r[cu] })), reference: spec.options?.scale !== false }, false, TITLE.scree);
      const bp = tableOf(env, 'biplotPoints');
      const ba = tableOf(env, 'biplotArrows');
      if (!bp || !ba) return;
      const gk = role(spec, 'group');
      const axis = (k) => {
        const share = ct.rows[k]?.[pi];
        const pc = String(ct.rows[k]?.[ci] ?? `PC${k + 1}`);
        return num(share) && o.t ? o.t('graphs.biplot.axis', { pc, share: pct1(share) }) : pc;
      };
      const [bs, bg, b1, b2] = ['subject', 'group', 'pc1', 'pc2'].map((c) => colOf(bp, c));
      const [ai, a1, a2] = ['item', 'pc1', 'pc2'].map((c) => colOf(ba, c));
      const points = bp.rows.map((r) => ({ label: r[bs] === null || r[bs] === undefined ? null : String(r[bs]), group: r[bg] === null || r[bg] === undefined ? null : levelOf(gk, String(r[bg])), pc1: r[b1], pc2: r[b2] }));
      const groups = [...new Set(points.map((p) => p.group).filter((g) => g !== null))];
      add('biplot', { points, arrows: ba.rows.map((r) => ({ label: labelOf(r[ai]), pc1: r[a1], pc2: r[a2] })), groups, xTitle: axis(0), yTitle: axis(1) }, false, TITLE.biplot);
    });
  }
  return out;
}

/**
 * The epidemic curve of a date column of the data now open, optionally split by a category column.
 * @returns {{ series: { label: string, days: number[] }[], missing: number }}
 */
export function epiCurveInput(table, dateKey, groupKey = null, labelOf = (k) => k, levelOf = (k, v) => v) {
  const d = table?.columns?.[dateKey];
  if (!d || d.kind !== 'date') return { series: [], missing: 0 };
  const g = groupKey ? table.columns[groupKey] : null;
  const ex = table.excluded || {};
  const byLevel = new Map();
  let missing = 0;
  for (let i = 0; i < table.n; i += 1) {
    if (Object.prototype.hasOwnProperty.call(ex, table.rowIds[i])) continue;
    const v = d.values[i];
    if (!num(v) || d.missing?.[i]) { missing += 1; continue; }
    let key = labelOf(dateKey);
    if (g && g.kind === 'category') {
      const c = g.values[i];
      if (c === -1 || c === null || c === undefined || g.missing?.[i]) { missing += 1; continue; }
      key = g.levels[c];
    }
    if (!byLevel.has(key)) byLevel.set(key, []);
    byLevel.get(key).push(v);
  }
  const order = g && g.kind === 'category' ? g.levels.filter((l) => byLevel.has(l)) : [...byLevel.keys()];
  return { series: order.map((label) => ({ label: g ? levelOf(groupKey, label) : label, days: byLevel.get(label) })), missing };
}
