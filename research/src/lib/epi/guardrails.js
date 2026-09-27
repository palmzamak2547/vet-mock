// Guardrails that need no R [M1-DESIGN.md 7.20; methods.md section 4]. evaluateGuards() runs
// before every method (run.js) and never computes a p-value itself. OWNER: epi role.
//
// Findings are { id, severity, key: 'epi.guard.<id>.title', bodyKey: 'epi.guard.<id>.body',
// params?, routes? }. G3 (design check) is raised by run.js from checkDesign; G16 is raised here
// because it is the more specific sentence for the same situation. Guards that need the result
// (G8, G12) are in resultGuards(), which run.js calls after the method; guards that need the recipe
// or the import state (G13, G18, G26) read the optional fourth argument `context`.

import { checkDesign } from './design.js';
import { iccOneWay, designEffect } from './cluster.js';
import { missingCode, binaryReader, groupReader, levelIndex } from './_table.js';

/**
 * The M1 set. Severity and what each needs are fixed here; messages live in i18n/epi.js under
 * `epi.guard.<id>.*`. Guardrails not listed need models or time-to-event data (M2/M3):
 * G14 (events per variable), G15 (selection path), G21 (repeated measures), G22 (censoring), G23 (overdispersion).
 */
export const GUARDS = Object.freeze([
  { id: 'G1', severity: 'stop', what: 'cluster column repeats among the rows used and no cluster route chosen' },
  { id: 'G2', severity: 'stop', what: 'exposure constant within every cluster while the outcome is per animal' },
  { id: 'G3', severity: 'stop', what: 'measure the declared design cannot support' },
  { id: 'G4', severity: 'warn', what: 'odds ratio shown for a common outcome (> 10%) in a cohort or cross-sectional study' },
  { id: 'G5', severity: 'warn', what: 'any expected count below 5 (Cochran: more than 20% below 5, or any below 1); McNemar chi-square with fewer than 25 discordant pairs' },
  { id: 'G6', severity: 'stop', what: 'pair column present, independent-samples test requested' },
  { id: 'G7', severity: 'warn', what: 'more than one test in a family without an adjustment choice' },
  { id: 'G8', severity: 'warn', what: 'the results text would say "no difference" from p > 0.05' },
  { id: 'G9', severity: 'stop', what: 'observed (post hoc) power requested' },
  { id: 'G10', severity: 'warn', what: 'SE, CI or p-values requested in Table 1' },
  { id: 'G11', severity: 'warn', what: 'a column marked confounder was never stratified or adjusted for' },
  { id: 'G12', severity: 'warn', what: 'stratum estimates heterogeneous (Breslow-Day or Tarone p < 0.05)' },
  { id: 'G13', severity: 'warn', what: 'a bin step cut a continuous variable at a data-derived point' },
  { id: 'G16', severity: 'stop', what: 'Pearson correlation used as agreement' },
  { id: 'G17', severity: 'warn', what: 'kappa without PABAK and indices, or unweighted kappa on ordinal scores' },
  { id: 'G18', severity: 'warn', what: 'apparent prevalence reported while the test Se or Sp is below 1' },
  { id: 'G19', severity: 'note', what: 'PPV or NPV depend on prevalence; the same test elsewhere gives other values' },
  { id: 'G20', severity: 'note', what: 'combining tests in series or parallel assumes they err independently' },
  { id: 'G24', severity: 'warn', what: 'rows used below rows recorded' },
  { id: 'G25', severity: 'warn', what: 'sample size without DEFF for a clustered design, without FPC for a small population, or without non-response' },
  { id: 'G26', severity: 'stop', what: 'import questions unanswered (era, date order, two-digit years, legacy encoding, Excel-date IDs)' },
]);

const SEVERITY = Object.fromEntries(GUARDS.map((g) => [g.id, g.severity]));

/** @returns {import('../runtime/types.js').GuardFinding & { bodyKey: string }} */
function finding(id, extra = {}) {
  return { id, severity: SEVERITY[id], key: `epi.guard.${id}.title`, bodyKey: `epi.guard.${id}.body`, ...extra };
}

/** Methods that treat rows as independent animals (the same list as run.js G1_SUBJECT). */
export const G1_METHODS = Object.freeze(new Set([
  'freq.proportion', 'freq.truePrevalence', 'freq.incidenceRisk', 'freq.incidenceRate',
  'epi.twoByTwo', 'epi.mantelHaenszel', 'test.chisq', 'test.fisher2x2', 'test.mcnemar', 'test.trend',
  'test.tTest', 'test.anova1', 'posthoc.tukey', 'test.mannWhitney', 'test.wilcoxonSignedRank',
  'test.kruskalWallis', 'corr.pearson', 'corr.spearman', 'reg.ols',
]));

/** Methods that compare an exposure or group, where a farm-level exposure triggers G2. */
const G2_METHODS = new Set(['epi.twoByTwo', 'epi.mantelHaenszel', 'test.chisq', 'test.fisher2x2', 'test.trend', 'test.tTest', 'test.anova1', 'test.mannWhitney', 'test.kruskalWallis']);
/** Independent-samples methods stopped by a pair column (G6). */
const G6_METHODS = new Set(['test.tTest', 'test.mannWhitney', 'test.anova1', 'test.kruskalWallis', 'test.chisq', 'test.fisher2x2', 'epi.twoByTwo']);
/** Crude 2x2 answers that a recorded confounder should stratify (G11). */
const G11_METHODS = new Set(['epi.twoByTwo', 'test.chisq', 'test.fisher2x2']);
/** Methods that answer the within-farm route as a Mantel-Haenszel analysis. */
const MH_METHODS = new Set(['epi.twoByTwo', 'test.chisq', 'test.fisher2x2', 'epi.mantelHaenszel']);
/** Methods that implement the DEFF-widened route themselves. */
const DEFF_METHODS = new Set(['freq.proportion', 'freq.truePrevalence', 'epi.twoByTwo']);
const FARM_AWARE = new Set(['deff', 'mh-within', 'aggregate']);

function clusterKeyOf(spec, codebook) {
  return spec.cluster?.column || spec.roles?.cluster || codebook?.clusterKey || null;
}

function outcomeKeyOf(spec) { return spec.roles?.outcome || spec.roles?.y || null; }
function exposureKeyOf(spec) { return spec.roles?.exposure || spec.roles?.group || null; }

/** Role column keys named by the spec (cluster excluded), in role order. */
export function roleKeys(spec) {
  const out = [];
  for (const [role, v] of Object.entries(spec.roles || {})) {
    if (role === 'cluster') continue;
    for (const k of [].concat(v || [])) if (k && !out.includes(k)) out.push(k);
  }
  return out;
}

/** Rows present in every named column (indexes). */
function presentRows(table, keys) {
  const cols = keys.map((k) => table.columns[k]).filter(Boolean);
  const rows = [];
  for (let r = 0; r < table.n; r++) if (cols.every((c) => !missingCode(c, r))) rows.push(r);
  return rows;
}

/** Group present rows by the cluster column: Map(cluster id -> row indexes). */
function byCluster(table, clusterKey, rows) {
  const col = table.columns[clusterKey];
  const g = groupReader(col);
  const m = new Map();
  for (const r of rows) {
    if (missingCode(col, r)) continue;
    const id = g(r);
    if (!m.has(id)) m.set(id, []);
    m.get(id).push(r);
  }
  return m;
}

/** Does a column take more than one value inside at least one cluster? */
function variesWithin(col, groups) {
  for (const rows of groups.values()) {
    let first;
    for (const r of rows) {
      const v = col.values[r];
      if (first === undefined) first = v;
      else if (v !== first) return true;
    }
  }
  return false;
}

function codebookEntry(codebook, key) {
  return codebook?.columns?.find((c) => c.key === key) || null;
}

/** Share of rows positive for the outcome, from counts or the table (G4). */
function outcomeShare(spec, table) {
  const c = spec.input?.counts;
  if (spec.input?.kind === 'counts' && c) {
    const tabs = c.table ? [c.table] : Array.isArray(c.strata) ? c.strata : [];
    let pos = 0, all = 0;
    for (const t of tabs) { pos += t[0][0] + t[1][0]; all += t[0][0] + t[0][1] + t[1][0] + t[1][1]; }
    return all ? pos / all : null;
  }
  const key = spec.roles?.outcome;
  if (!table || !key || !table.columns[key]) return null;
  const col = table.columns[key];
  const pos = spec.levels?.outcomePositive ?? null;
  if (col.kind === 'category' && (pos == null || levelIndex(col, pos) < 0)) return null;
  const rd = binaryReader(col, pos, null);
  let x = 0, all = 0;
  for (let r = 0; r < table.n; r++) {
    if (missingCode(col, r)) continue;
    const v = rd(r);
    if (v === null) continue;
    x += v; all++;
  }
  return all ? x / all : null;
}

/** b + c of a paired 2x2 (McNemar), from counts or the x and y columns; null when it cannot be read. */
function discordantPairs(spec, table) {
  const k = spec.input?.counts;
  if (spec.input?.kind === 'counts' && k) {
    if (Array.isArray(k.table) && k.table.length === 2) return (k.table[0]?.[1] ?? 0) + (k.table[1]?.[0] ?? 0);
    if (typeof k.b === 'number' && typeof k.c === 'number') return k.b + k.c;
    return null;
  }
  const xk = spec.roles?.x, yk = spec.roles?.y;
  if (!table || !xk || !yk || !table.columns[xk] || !table.columns[yk]) return null;
  const X = table.columns[xk], Y = table.columns[yk];
  if (X.kind !== 'category' || Y.kind !== 'category' || X.levels.length !== 2 || Y.levels.length !== 2) return null;
  let n = 0;
  for (let r = 0; r < table.n; r++) {
    if (missingCode(X, r) || missingCode(Y, r)) continue;
    if (X.levels[X.values[r]] !== Y.levels[Y.values[r]]) n++;
  }
  return n;
}

/** r x c table for G5, from counts or the exposure/group and outcome columns. */
function contingency(spec, table) {
  const c = spec.input?.counts;
  if (spec.input?.kind === 'counts' && c?.table) return c.table;
  const ek = exposureKeyOf(spec), ok = spec.roles?.outcome;
  if (!table || !ek || !ok || !table.columns[ek] || !table.columns[ok]) return null;
  const E = table.columns[ek], O = table.columns[ok];
  if (E.kind !== 'category' || O.kind !== 'category') return null;
  const m = E.levels.map(() => O.levels.map(() => 0));
  for (let r = 0; r < table.n; r++) {
    if (missingCode(E, r) || missingCode(O, r)) continue;
    m[E.values[r]][O.values[r]]++;
  }
  // Levels never seen are not cells of the table.
  const rows = m.filter((row) => row.some((v) => v > 0));
  const keep = rows.length ? rows[0].map((_, j) => rows.some((row) => row[j] > 0)) : [];
  return rows.map((row) => row.filter((_, j) => keep[j]));
}

/** Expected counts check (Cochran): { minExpected, shareBelow5, cells }. */
export function expectedCheck(t) {
  const N = t.reduce((s, r) => s + r.reduce((a, b) => a + b, 0), 0);
  if (!N) return null;
  const rs = t.map((r) => r.reduce((a, b) => a + b, 0));
  const cs = t[0].map((_, j) => t.reduce((s, r) => s + r[j], 0));
  let min = Infinity, below5 = 0, cells = 0;
  for (let i = 0; i < t.length; i++) for (let j = 0; j < cs.length; j++) {
    const e = (rs[i] * cs[j]) / N;
    min = Math.min(min, e);
    if (e < 5) below5++;
    cells++;
  }
  return { minExpected: min, shareBelow5: below5 / cells, cells };
}

/**
 * @param {import('../runtime/types.js').AnalysisSpec} spec   normalised
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @param {import('../runtime/types.js').Codebook|null} codebook
 * @param {{ steps?: import('../runtime/types.js').RecipeStep[], importQuestionsOpen?: number, testSe?: number, testSp?: number }} [context]
 *   the recipe steps (G13), the number of import questions still unanswered (G26), and the Se and
 *   Sp of the test behind a prevalence outcome when the student gave them (G18)
 * @returns {{ stops: import('../runtime/types.js').GuardFinding[], warnings: import('../runtime/types.js').GuardFinding[], notes: import('../runtime/types.js').GuardFinding[] }}
 */
export function evaluateGuards(spec, table, codebook, context = {}) {
  const out = { stops: [], warnings: [], notes: [] };
  const add = (f) => (f.severity === 'stop' ? out.stops : f.severity === 'warn' ? out.warnings : out.notes).push(f);
  const method = spec.method;
  const o = spec.options || {};
  const route = spec.cluster?.route ?? null;
  const dataset = spec.input?.kind === 'dataset' && table;

  // G26: the import is not settled; nothing runs on data until it is.
  if (context.importQuestionsOpen > 0 && spec.input?.kind === 'dataset') add(finding('G26', { params: { open: context.importQuestionsOpen }, routes: ['import'] }));

  // G1 and G2: clustering.
  const clusterKey = clusterKeyOf(spec, codebook);
  if (dataset && clusterKey && table.columns[clusterKey] && G1_METHODS.has(method)) {
    const stratifiedByCluster = method === 'epi.mantelHaenszel' && [].concat(spec.roles?.strata || []).includes(clusterKey);
    const rows = presentRows(table, roleKeys(spec).concat([clusterKey]));
    const groups = byCluster(table, clusterKey, rows);
    const repeats = [...groups.values()].some((g) => g.length > 1);
    if (repeats && !stratifiedByCluster) {
      const ek = exposureKeyOf(spec), yk = outcomeKeyOf(spec);
      const exposureFarmLevel = G2_METHODS.has(method) && ek && table.columns[ek] && groups.size > 1 && !variesWithin(table.columns[ek], groups);
      const outcomePerAnimal = yk && table.columns[yk] && variesWithin(table.columns[yk], groups);
      if (exposureFarmLevel && outcomePerAnimal && route !== 'aggregate') {
        add(finding('G2', { params: { exposure: ek, cluster: clusterKey }, routes: ['aggregate'] }));
      } else if (!FARM_AWARE.has(route)) {
        const panelRoutes = routesFor(spec, table, codebook, groups).filter((r) => r.enabled).map((r) => r.id);
        add(finding('G1', { params: { cluster: clusterKey, clusters: groups.size }, routes: panelRoutes }));
      }
    }
  }

  // G6: a pair column stops an independent-samples test.
  const pairKey = spec.roles?.pair || codebook?.columns?.find((c) => c.role === 'pair')?.key || null;
  const independent = G6_METHODS.has(method) && !(method === 'test.tTest' && (o.variant === 'paired' || o.variant === 'one-sample'));
  if (independent && pairKey) add(finding('G6', { params: { pair: pairKey }, routes: ['test.tTest:paired', 'test.wilcoxonSignedRank', 'test.mcnemar'] }));

  // G9: observed power after the data are in.
  if (o.observedPower === true || spec.input?.params?.observedPower === true) add(finding('G9', { routes: ['ci', 'ss.detectableEffect'] }));

  // G16: correlation offered as agreement.
  if ((method === 'corr.pearson' || method === 'corr.spearman') && spec.design === 'agreement') add(finding('G16', { routes: ['agree.kappa', 'blandAltman:M2', 'icc:M2'] }));

  // G4: odds ratio for a common outcome where a ratio of risks exists.
  if ((method === 'epi.twoByTwo' || method === 'epi.mantelHaenszel') && ['cross-sectional', 'cohort', 'trial'].includes(spec.design)) {
    const measures = method === 'epi.mantelHaenszel' ? [o.measure === 'RR' ? 'RR' : 'OR'] : (o.measures || checkDesign(spec.design, method).measures || []);
    const share = outcomeShare(spec, table);
    if (share !== null && share > 0.1 && measures.some((m) => m === 'OR' || m === 'POR')) {
      const beside = spec.design === 'cross-sectional' ? 'PR' : 'RR';
      add(finding('G4', { params: { share, beside }, routes: [beside] }));
    }
  }

  // G5: small expected counts in a chi-square table.
  if (method === 'test.chisq') {
    const t = contingency(spec, table);
    const e = t && t.length > 1 && t[0].length > 1 ? expectedCheck(t) : null;
    if (e && (e.minExpected < 1 || e.shareBelow5 > 0.2)) {
      add(finding('G5', { params: { minExpected: e.minExpected, shareBelow5: e.shareBelow5 }, routes: t.length === 2 && t[0].length === 2 ? ['test.fisher2x2'] : [] }));
    }
  }

  // G5 for paired data: McNemar's chi-square on few discordant pairs (b + c below 25, the usual
  // threshold) is an approximation the exact binomial version does not need (review round 1).
  if (method === 'test.mcnemar' && !o.exact) {
    const bc = discordantPairs(spec, table);
    if (bc !== null && bc > 0 && bc < 25) {
      add(finding('G5', { key: 'epi.guard.G5.mcnemarTitle', bodyKey: 'epi.guard.G5.mcnemarBody', params: { discordant: bc }, routes: [] }));
    }
  }

  // G7: several p-values with no adjustment chosen.
  if (method === 'adjust.pValues' && o.method === 'none') {
    const ps = spec.input?.counts?.p;
    if (Array.isArray(ps) && ps.length > 1) add(finding('G7', { params: { tests: ps.length }, routes: ['holm', 'bonferroni'] }));
  }

  // G10: tests or SE in Table 1.
  if (method === 'desc.table1' && (o.showP || o.showCi || o.showSe)) add(finding('G10'));

  // G11: a recorded confounder never stratified.
  if (G11_METHODS.has(method) && codebook) {
    const used = new Set([...[].concat(spec.roles?.strata || []), ...[].concat(spec.roles?.covariates || [])]);
    const conf = (codebook.columns || []).filter((c) => c.role === 'confounder' && !used.has(c.key) && c.key !== exposureKeyOf(spec) && c.key !== spec.roles?.outcome);
    if (conf.length) add(finding('G11', { params: { columns: conf.map((c) => c.key) }, routes: ['epi.mantelHaenszel'] }));
  }

  // G13: a bin step cut a column at a data-derived point.
  if (Array.isArray(context.steps)) {
    const keys = new Set(roleKeys(spec));
    const hit = context.steps.filter((s) => s.kind === 'bin' && (s.params?.cutSource === 'median' || s.params?.cutSource === 'quantile') && keys.has(s.params?.target));
    if (hit.length) add(finding('G13', { params: { columns: hit.map((s) => s.params.target) } }));
  }

  // G17: unweighted kappa on ordered categories.
  if (method === 'agree.kappa' && (o.weights ?? 'none') === 'none') {
    const ord = ['raterA', 'raterB'].some((r) => codebookEntry(codebook, spec.roles?.[r])?.type === 'ordinal');
    if (ord) add(finding('G17', { routes: ['weights:linear', 'weights:quadratic'] }));
  }

  // G18: apparent prevalence from a test known to be imperfect.
  if (method === 'freq.proportion') {
    const se = context.testSe ?? o.se, sp = context.testSp ?? o.sp;
    if ((Number.isFinite(se) && se < 1) || (Number.isFinite(sp) && sp < 1)) add(finding('G18', { params: { se, sp }, routes: ['freq.truePrevalence'] }));
  }

  // G19: predictive values depend on prevalence.
  if (method === 'dx.accuracy') add(finding('G19', { routes: ['bench:screening'] }));

  // G20: tests combined in series or parallel.
  if (o.combine === 'series' || o.combine === 'parallel') add(finding('G20'));

  // G24: rows used below rows recorded (missing values in the columns named).
  if (dataset) {
    const keys = roleKeys(spec).filter((k) => table.columns[k]);
    if (keys.length) {
      const byColumn = [];
      let dropped = 0;
      for (let r = 0; r < table.n; r++) {
        const k = keys.find((key) => missingCode(table.columns[key], r));
        if (!k) continue;
        dropped++;
        const e = byColumn.find((b) => b.column === k);
        if (e) e.count++; else byColumn.push({ column: k, count: 1 });
      }
      if (dropped > 0) add(finding('G24', { params: { used: table.n - dropped, recorded: table.n, byColumn } }));
    }
  }

  // G25: sample size without DEFF for clusters, without FPC for a small population, or without non-response.
  if (method.startsWith('ss.')) {
    const p = spec.input?.params || {};
    const missing = [];
    if (p.clustered === true && !(p.deff > 0) && !(p.m > 0 && Number.isFinite(p.icc))) missing.push('deff');
    if (p.N > 0 && o.fpc === 'none') missing.push('fpc');
    if (!(p.nonResponse > 0)) missing.push('nonResponse');
    if (missing.length) add(finding('G25', { params: { missing } }));
  }
  return out;
}

/**
 * Guards that read the result: G8 (a p-value above 0.05 must not be written as "no difference")
 * and G12 (strata disagree: Breslow-Day/Tarone or Woolf p < 0.05). run.js calls this after the
 * method and merges the findings.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/registry.js').MethodOutput|null} output
 */
export function resultGuards(spec, output) {
  void spec;
  const out = { stops: [], warnings: [], notes: [] };
  if (!output || output.status !== 'ok') return out;
  for (const t of output.tests || []) {
    if (t.id === 'homogeneity') {
      if (typeof t.p === 'number' && t.p < 0.05) out.warnings.push(finding('G12', { params: { p: t.p, test: t.variant }, routes: ['strata'] }));
      continue;
    }
    if (typeof t.p === 'number' && t.p > 0.05) out.warnings.push(finding('G8', { params: { testId: t.id } }));
  }
  return out;
}

/** The routes the G1 panel lists, each enabled or disabled with a reason. */
function routesFor(spec, table, codebook, groups) {
  const method = spec.method;
  const ek = exposureKeyOf(spec);
  const eCol = ek ? table.columns[ek] : null;
  const exposureVaries = eCol ? variesWithin(eCol, groups) : false;
  const exposureOnAnimal = eCol ? exposureVaries || codebookEntry(codebook, ek)?.level === 'animal' : false;
  const routes = [];
  if (!MH_METHODS.has(method)) routes.push({ id: 'mh-within', enabled: false, reasonKey: 'epi.route.mhWithin.notTwoByTwo' });
  else if (!exposureVaries) routes.push({ id: 'mh-within', enabled: false, reasonKey: 'epi.route.mhWithin.exposureConstant' });
  else routes.push({ id: 'mh-within', enabled: true, reasonKey: null });
  routes.push(DEFF_METHODS.has(method) ? { id: 'deff', enabled: true, reasonKey: null } : { id: 'deff', enabled: false, reasonKey: 'epi.route.deff.notForMethod' });
  routes.push(exposureOnAnimal ? { id: 'aggregate', enabled: false, reasonKey: 'epi.route.aggregate.exposureOnAnimal' } : { id: 'aggregate', enabled: true, reasonKey: null });
  routes.push({ id: 'gee', enabled: false, reasonKey: 'epi.route.m3' });
  routes.push({ id: 'mixed', enabled: false, reasonKey: 'epi.route.m3' });
  return routes;
}

/**
 * The G1 panel shown before any route: ICC, DEFF and effective n computed first (cluster.iccDeff),
 * with the routes the data allow: 'mh-within' (factor varies inside farms), 'deff', 'aggregate'
 * (disabled with a reason when the factor is measured on the animal), and GEE/mixed as M3.
 * ICC is of the outcome (0/1 at levels.outcomePositive, or the number) over the rows the method
 * would use; DEFF uses the mean cluster size. Null when the table has no cluster column.
 * @returns {{ icc: import('../runtime/types.js').Value, deff: import('../runtime/types.js').Value, nEff: import('../runtime/types.js').Value, clusters: number, meanSize: number, routes: { id: string, enabled: boolean, reasonKey: string|null }[] }|null}
 */
export function clusterPanel(spec, table, codebook) {
  const clusterKey = clusterKeyOf(spec, codebook);
  if (!table || !clusterKey || !table.columns[clusterKey]) return null;
  // The panel's ICC uses every animal with the outcome and the farm ("the ICC of the whole set");
  // the routes look at the rows the method would use.
  const rows = presentRows(table, roleKeys(spec).concat([clusterKey]));
  const groups = byCluster(table, clusterKey, rows);
  const yk = outcomeKeyOf(spec);
  const outcomeGroups = yk && table.columns[yk] ? byCluster(table, clusterKey, presentRows(table, [yk, clusterKey])) : groups;
  let r = null;
  if (yk && table.columns[yk]) {
    const col = table.columns[yk];
    let read = null;
    if (col.kind === 'category') {
      const pos = spec.levels?.outcomePositive ?? null;
      if (pos != null && levelIndex(col, pos) >= 0) read = binaryReader(col, pos, null);
    } else if (col.kind === 'number') read = (i) => col.values[i];
    if (read) {
      const y = [], g = [];
      for (const [id, list] of outcomeGroups) for (const i of list) { const v = read(i); if (v !== null) { y.push(v); g.push(id); } }
      r = iccOneWay(y, g);
    }
  }
  const k = r ? r.k : outcomeGroups.size;
  const meanSize = r ? r.meanSize : 0;
  let icc, deff, nEff;
  if (!r || r.icc === null) {
    const key = r?.reasonKey || 'epi.undefined.iccNoOutcome';
    icc = { value: null, reasonKey: key }; deff = { value: null, reasonKey: key }; nEff = { value: null, reasonKey: key };
  } else {
    const d = designEffect(r.icc, r.meanSize, r.n);
    icc = r.negative ? { value: r.icc, noteKey: 'epi.note.iccNegative' } : { value: r.icc };
    deff = { value: d.deff };
    nEff = { value: d.nEff };
  }
  return { icc, deff, nEff, clusters: k, meanSize, routes: routesFor(spec, table, codebook, groups) };
}
