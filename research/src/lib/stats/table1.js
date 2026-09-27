// Table 1 by group and by level of organisation [M1-DESIGN.md 7.4; methods.md M2]. Describes only:
// no p-values and no SE or CI for spread (G10); median with quartiles for skewed or ordinal
// variables; counts with the denominator and missing per variable and per level (STROBE-Vet 14(b)).
// Farm-level variables are summarised over farms, animal-level over animals, in separate blocks.
// OWNER: stats role.
//
// Output (long form, so the workspace can pivot it and a test can check every cell):
//   tables[k] = { id: 'table1.<unit>', columns: ['variable', 'level', 'stat', 'group', 'value'], rows }
//   unit     'animal' (the unit of analysis) or 'farm' (one row per cluster)
//   variable column key; level = category level text or null
//   stat     'n' (non-missing), 'median', 'q1', 'q3', 'mean', 'sd', 'min', 'max', 'count', 'percent',
//            'known' (denominator of the percentages), and 'missing.<reason>' for each missing reason
//            present: blank, unknown, notApplicable, notRecorded, invalid
//   group    'all', then each level of the group column (animal block only; a farm-level variable
//            is not split by an animal-level outcome)
// Percentages use the known values as the denominator (percentDenominator 'known').
import { quantile } from './descriptive.js';
import { mean, sumSqDev, column, activeRows, isMissing, role, nullVal, val } from './common.js';

const MISSING_REASON = ['present', 'blank', 'unknown', 'notApplicable', 'notRecorded', 'invalid'];

function missingReason(col, i) {
  const code = col.missing ? col.missing[i] : 0;
  if (code && MISSING_REASON[code]) return MISSING_REASON[code];
  return 'blank';
}

function describeNumber(col, idx, kind, qType) {
  const v = [];
  const miss = {};
  for (const i of idx) {
    if (isMissing(col, i)) { const r = missingReason(col, i); miss[r] = (miss[r] || 0) + 1; }
    else v.push(col.values[i]);
  }
  const out = [['n', v.length]];
  if (kind === 'mean-sd') {
    const m = v.length ? mean(v) : null;
    out.push(['mean', m]);
    out.push(['sd', v.length > 1 ? Math.sqrt(Math.max(0, sumSqDev(v, m)) / (v.length - 1)) : null]);
  } else {
    const s = v.slice().sort((a, b) => a - b);
    out.push(['median', s.length ? quantile(s, 0.5, qType) : null]);
    out.push(['q1', s.length ? quantile(s, 0.25, qType) : null]);
    out.push(['q3', s.length ? quantile(s, 0.75, qType) : null]);
    out.push(['min', s.length ? s[0] : null]);
    out.push(['max', s.length ? s[s.length - 1] : null]);
  }
  for (const r of MISSING_REASON.slice(1)) if (miss[r]) out.push([`missing.${r}`, miss[r]]);
  return out.map(([stat, value]) => [null, stat, value]);
}

function describeCategory(col, idx) {
  const levels = col.levels || [];
  const counts = new Array(levels.length).fill(0);
  const miss = {};
  for (const i of idx) {
    if (isMissing(col, i)) { const r = missingReason(col, i); miss[r] = (miss[r] || 0) + 1; }
    else counts[col.values[i]]++;
  }
  const known = counts.reduce((a, b) => a + b, 0);
  const out = [[null, 'known', known]];
  levels.forEach((l, j) => {
    out.push([l, 'count', counts[j]]);
    out.push([l, 'percent', known > 0 ? (100 * counts[j]) / known : null]);
  });
  for (const r of MISSING_REASON.slice(1)) if (miss[r]) out.push([null, `missing.${r}`, miss[r]]);
  return out;
}

/**
 * Pure core.
 * @param {import('../runtime/types.js').WorkingTable} table
 * @param {{ variables: string[], group?: string|null, cluster?: string|null,
 *   summaries?: Record<string, 'median-iqr'|'mean-sd'|'n-percent'>,
 *   columnLevels?: Record<string, string>, unitOfAnalysis?: string, quantileType?: 6|7,
 *   byLevel?: boolean }} opts
 * @returns {{ tables: {id: string, columns: string[], rows: (string|number|null)[][]}[], clusters: number, inconsistent: Record<string, number> }}
 */
export function table1(table, opts) {
  const qType = opts.quantileType ?? 7;
  const unit = opts.unitOfAnalysis || 'animal';
  const byLevel = opts.byLevel !== false && !!opts.cluster;
  const rows = activeRows(table);
  const g = opts.group ? column(table, opts.group) : null;
  const groupSets = [['all', rows]];
  if (g) (g.levels || []).forEach((gl, gj) => groupSets.push([gl, rows.filter((i) => g.values[i] === gj)]));

  // one representative row per cluster (the first in row order) for cluster-level variables
  let clusterRows = null;
  let clusterIndex = null;
  if (byLevel) {
    const cc = column(table, opts.cluster);
    const first = new Map();
    clusterIndex = new Map();
    for (const i of rows) {
      if (isMissing(cc, i)) continue;
      const key = cc.kind === 'category' ? cc.values[i] : String(cc.values[i]);
      if (!first.has(key)) first.set(key, i);
      clusterIndex.set(i, key);
    }
    clusterRows = [...first.values()];
  }

  const animal = [];
  const farm = [];
  const inconsistent = {};
  for (const key of opts.variables) {
    const col = column(table, key);
    const level = opts.columnLevels?.[key] ?? unit;
    const kind = opts.summaries?.[key] ?? (col.kind === 'category' ? 'n-percent' : 'median-iqr');
    const onClusters = byLevel && level !== unit;
    if (col.kind !== 'number' && col.kind !== 'category') continue; // dates and text are not summarised
    const describe = (idx) => (col.kind === 'category' ? describeCategory(col, idx) : describeNumber(col, idx, kind, qType));
    if (onClusters) {
      // a cluster-level variable should not vary inside a cluster; count clusters where it does
      const seen = new Map();
      let bad = 0;
      for (const i of rows) {
        const c = clusterIndex.get(i);
        if (c === undefined || isMissing(col, i)) continue;
        const v = col.values[i];
        if (!seen.has(c)) seen.set(c, v);
        else if (seen.get(c) !== v && seen.get(c) !== null) { bad++; seen.set(c, null); }
      }
      if (bad) inconsistent[key] = bad;
      for (const [lv, stat, v] of describe(clusterRows)) farm.push([key, lv, stat, 'all', v]);
    } else {
      for (const [gid, idx] of groupSets) for (const [lv, stat, v] of describe(idx)) animal.push([key, lv, stat, gid, v]);
    }
  }
  const cols = ['variable', 'level', 'stat', 'group', 'value'];
  const tables = [{ id: `table1.${unit}`, columns: cols, rows: animal }];
  if (byLevel) tables.push({ id: 'table1.cluster', columns: cols, rows: farm });
  // group sizes (every row, whatever is missing) so headers can print "n = 146"
  tables.push({ id: 'table1.groups', columns: ['group', 'n'], rows: groupSets.map(([gid, idx]) => [gid, idx.length]) });
  return { tables, clusters: clusterRows ? clusterRows.length : 0, inconsistent };
}

/**
 * Implementation for method 'desc.table1'. Roles: `covariates` = the variables to describe (in order);
 * `group` (or `outcome`) = the column that splits the table; the cluster column comes from
 * `spec.cluster.column` or `roles.cluster`. Options: quantileType, summaries, byLevel, showMissing,
 * and `columnLevels` {columnKey: level of organisation}, which normalizeSpec copies from the codebook
 * (a variable whose level differs from the unit of analysis is summarised over clusters).
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runTable1(spec, table) {
  const variables = [].concat(spec?.roles?.covariates ?? []);
  if (!variables.length) return { status: 'invalid', values: { reason: nullVal('stats.error.missingRole') }, tests: [], tables: [], used: 0, dropped: [] };
  const o = spec.options || {};
  const cluster = spec?.cluster?.column ?? role(spec, 'cluster');
  const res = table1(table, {
    variables,
    group: role(spec, 'group') ?? role(spec, 'outcome'),
    cluster,
    summaries: o.summaries,
    columnLevels: o.columnLevels,
    unitOfAnalysis: o.unitOfAnalysis,
    quantileType: o.quantileType,
    byLevel: o.byLevel,
  });
  if (o.showMissing === false) for (const t of res.tables) t.rows = t.rows.filter((r) => !(typeof r[2] === 'string' && r[2].startsWith('missing.')));
  const used = activeRows(table).length;
  const values = { rows: val(used) };
  if (cluster) values.clusters = val(res.clusters);
  const tables = res.tables;
  const bad = Object.entries(res.inconsistent);
  if (bad.length) tables.push({ id: 'table1.inconsistentWithinCluster', columns: ['variable', 'clusters'], rows: bad });
  return { status: 'ok', values, tests: [], tables, used, dropped: [] };
}
