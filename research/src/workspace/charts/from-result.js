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
import { completeRows, groupsAt, numbersAt, role } from '../../lib/stats/common.js';
import { seFromLogCi } from './helpers.js';
import { valueKind } from '../lib/method-ui.js';

const num = (v) => typeof v === 'number' && Number.isFinite(v);
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
function groupsFrom(table, yKey, gKey) {
  const { rows } = completeRows(table, [yKey, gKey]);
  const g = groupsAt(table, yKey, gKey, rows);
  return g.labels.map((label, i) => ({ label, values: g.groups[i] }));
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
 * @param {{ labelOf?: (key: string) => string, stale?: boolean, t?: (k: string, p?: any) => string }} [o]
 * @returns {{ id: string, kind: string, input: any, needsRows: boolean }[]}
 */
export function chartOptions(analysis, table, o = {}) {
  const env = analysis?.envelope;
  const spec = analysis?.spec || env?.spec || {};
  if (!env || env.status !== 'ok') return [];
  const method = env.method?.id || spec.method;
  const labelOf = o.labelOf || ((k) => k);
  const rowsOk = Boolean(table) && !o.stale;
  const level = Object.values(env.values || {}).find((v) => v?.ciLevel)?.ciLevel ?? spec.options?.confLevel ?? 0.95;
  const out = [];
  const add = (kind, input, needsRows) => out.push({ id: `${analysis.id || method}:${kind}`, kind, input, needsRows });
  const safe = (fn) => { try { fn(); } catch { /* a role column that no longer exists: no chart */ } };

  const yKey = role(spec, 'outcome');
  const gKey = role(spec, 'group') ?? role(spec, 'exposure');
  const variant = spec.options?.variant;

  if (rowsOk) {
    if ((method === 'test.tTest' && variant !== 'paired' && variant !== 'one-sample') || method === 'test.anova1' || method === 'anova.twoWay') {
      safe(() => {
        const groups = groupsFrom(table, yKey, gKey);
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
        const base = { groups: groupsFrom(table, yKey, gKey), yTitle: labelOf(yKey), xTitle: labelOf(gKey), level };
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
        const groups = g ? groupsFrom(table, x, g) : [{ label: labelOf(x), values: columnValues(table, x) }];
        const base = { groups, yTitle: labelOf(x), xTitle: g ? labelOf(g) : '', level };
        add('dot', { ...base, center: method === 'desc.summary' ? 'median' : 'mean' }, true);
        add('box', base, true);
        add('violin', base, true);
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
      const rows = tb.rows.map((row) => ({ label: String(row[li]), est: row[ei], lo: row[lo], hi: row[hi], kind: 'stratum', note: row[ei] === null ? (o.t ? o.t('graphs.forest.undefinedStratum') : '') : '' }));
      if (r) rows.push({ label: o.t ? o.t('graphs.forest.pooled', { name: r.name }) : r.name, est: r.value, lo: r.ci[0], hi: r.ci[1], kind: 'pooled' });
      add('forest', { rows, measure: r?.name, xTitle: r?.name || '', level }, false);
    }
  }
  const r = ratioValue(env);
  if (r && (method === 'epi.mantelHaenszel' || method === 'epi.twoByTwo' || method === 'reg.logistic' || method === 'reg.poisson')) {
    const se = num(r.se) && r.ciMethod === 'wald-log' ? r.se : seFromLogCi(r.ci, r.ciLevel ?? level);
    if (se) add('ciFunction', { est: r.value, se, label: r.name, xTitle: r.name, level: r.ciLevel ?? level }, false);
  }
  if (method === 'anova.repeated') {
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
      const series = groups.map((g) => ({ label: g || labelOf(yKey), points: tb.rows.filter((row) => (gi >= 0 && row[gi] !== null ? String(row[gi]) : '') === g).map((row) => ({ time: times.indexOf(String(row[ti])), mean: row[mi], lo: row[li], hi: row[ui], n: ni >= 0 ? row[ni] : undefined })) }));
      add('timeCourse', { times, series, yTitle: labelOf(yKey), xTitle: labelOf(role(spec, 'time')), level }, false);
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
        return { label: g || labelOf(role(spec, 'event')), time: pick('time'), nRisk: pick('nRisk'), nEvent: pick('nEvent'), nCensor: pick('nCensor').map((v) => v ?? 0), surv: pick('surv'), lower: pick('lower'), upper: pick('upper') };
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
        xTitle: o.t ? o.t('graphs.ba.xTitle') : '', yTitle: o.t ? o.t(`graphs.ba.yTitle.${spec.options?.scale || 'absolute'}`) : '',
      }, false);
    }
  }
  return out;
}

/**
 * The epidemic curve of a date column of the data now open, optionally split by a category column.
 * @returns {{ series: { label: string, days: number[] }[], missing: number }}
 */
export function epiCurveInput(table, dateKey, groupKey = null, labelOf = (k) => k) {
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
  return { series: order.map((label) => ({ label, days: byLevel.get(label) })), missing };
}
