// runAnalysis: the one entry point every result goes through [M1-DESIGN.md 10.3]. Runs inside the
// worker (engine.worker.js) and in the main-thread fallback. Pure: no DOM, no storage, no network.
// OWNER: data role (M2; runtime in M1).
//
// Order: validateSpec -> normalizeSpec -> design check (epi/design.js allows the method?) ->
// guardrails (epi/guardrails.js, plus the G1 safety net below) -> if no stop, the chosen cluster route
// (within-farm Mantel-Haenszel, aggregate to farm, or the method's own DEFF widening) ->
// IMPLEMENTED[method](spec, table) -> makeEnvelope with provenance (rows used and dropped with
// reasons, fingerprint, recipeRev, ENGINE_VERSION, validatedAgainst from the catalogue).
import { validateSpec, normalizeSpec } from './spec.js';
import { makeEnvelope } from './envelope.js';
import { ENGINE_VERSION } from './protocol.js';
import { getMethod, METHODS } from './catalog.js';
import { IMPLEMENTED } from './registry.js';
import { checkDesign, DESIGN_FREE_METHODS } from '../epi/design.js';
import { evaluateGuards, resultGuards, clusterPanel, FARM_AWARE } from '../epi/guardrails.js';
import { aggregateToCluster } from '../epi/cluster.js';
import { AREA_G1_SUBJECT, AREA_ROUTES } from './areas/index.js';

/**
 * Methods that treat every row as an independent animal and so must stop (G1) when the cluster column
 * repeats and no farm-aware route is chosen. Descriptives, Table 1, the ICC itself, sample size and
 * p-value adjustment are not tests of animals; accuracy and agreement studies are guarded by epi.
 */
export const G1_SUBJECT = Object.freeze(new Set([
  'freq.proportion', 'freq.truePrevalence', 'freq.incidenceRisk', 'freq.incidenceRate',
  'epi.twoByTwo', 'epi.mantelHaenszel', 'test.chisq', 'test.fisher2x2', 'test.mcnemar', 'test.trend',
  'test.tTest', 'test.anova1', 'posthoc.tukey', 'test.mannWhitney', 'test.wilcoxonSignedRank',
  'test.kruskalWallis', 'corr.pearson', 'corr.spearman', 'reg.ols',
  // M2 areas declare theirs in areas/<area>.options.js (g1Subject) [M2-DESIGN.md 2].
  ...AREA_G1_SUBJECT,
]));

/** Methods a within-farm Mantel-Haenszel route replaces (a 2x2 question, answered stratified by farm). */
export const MH_WITHIN_FROM = Object.freeze(new Set(['epi.twoByTwo', 'test.chisq', 'test.fisher2x2']));

/** Routes the G1 panel offers, in the order the boards show them (GEE and mixed models are M3). */
// Areas add a route here (areas/<area>.options.js `routes`) once the route runs and has its fixture.
export const CLUSTER_ROUTE_ORDER = Object.freeze(['mh-within', 'deff', ...AREA_ROUTES, 'aggregate', 'gee', 'mixed']);

// FARM_AWARE comes from guardrails.js: 'survey' and 'robust' are carried out by the method itself, like 'deff'
// (M2-DESIGN.md 3.2, 3.3).
/** Data checks judged again on the farm table after the 'aggregate' route (G4 common outcome, G5 small expected counts). */
const AGG_RECHECK = new Set(['G4', 'G5']);

/**
 * @param {import('./types.js').AnalysisSpec} spec
 * @param {import('./types.js').WorkingTable|null} table   null for counts/params inputs
 * @param {import('./types.js').Codebook|null} codebook
 * @param {{ now?: () => Date, steps?: import('./types.js').RecipeStep[], deps?: Partial<Deps> }} [env]
 *   clock injection for tests; the recipe steps (to tell exclusions from filters); dependency injection for tests
 * @returns {import('./types.js').ResultEnvelope}
 */
export function runAnalysis(spec, table, codebook, env = {}) {
  const deps = { ...DEFAULT_DEPS, ...(env.deps || {}) };
  const computedAt = (env.now ? env.now() : new Date()).toISOString();
  const valid = validateSpec(spec);
  if (!valid.ok) {
    const s = /** @type {any} */ (spec) || {};
    return makeEnvelope({
      spec: s,
      output: null,
      guard: { stops: [], warnings: [], notes: [] },
      provenance: provenanceOf(s, null, { used: 0, dropped: [] }, computedAt, []),
      verified: false,
      method: methodInfo(s.method),
      issues: valid.issues,
    });
  }

  let norm = normalizeSpec(valid.spec, codebook);
  // A column holds one role (review round 5: the outcome ticked again as its own explanatory variable fitted,
  // was badged verified, and the Methods listed it twice). The screen no longer offers it; this stops a spec that
  // still carries it, before any check reads the data.
  const twice = columnInTwoRoles(norm);
  if (twice) {
    return makeEnvelope({
      spec: norm,
      output: null,
      guard: { stops: [{ id: 'roles', severity: 'stop', key: 'runtime.guard.roleTwice', bodyKey: 'runtime.guard.roleTwiceBody', params: { column: twice.column, roleIds: twice.roles } }], warnings: [], notes: [] },
      provenance: provenanceOf(norm, null, { used: 0, dropped: [] }, computedAt, []),
      verified: false,
      method: methodInfo(norm.method),
    });
  }
  const active = table ? activeTable(table) : null;
  const exclusionDrops = table ? exclusionCounts(table, env.steps) : [];
  const notes = [];
  let error = null;
  let output = null;
  let extraValues = null;
  let panel = null;
  let guard = { stops: [], warnings: [], notes: [] };
  let runTable = active;
  const routeDrops = [];

  try {
    // A chosen farm route must be one the data allow (panel routes: e.g. 'aggregate' is off when the
    // factor is measured on the animal, 'deff' only for methods that widen their own CI, 'mh-within'
    // only for a 2x2 question whose factor varies inside farms). A route the panel greys out is not a
    // way around G1: the answer stops, the panel is shown, and no p-value leaves this function.
    const routeBlock = unavailableRoute(norm, active, codebook, deps);
    if (routeBlock) {
      guard.stops.push({ id: 'G1', severity: 'stop', key: 'runtime.guard.routeUnavailable', params: { route: norm.cluster.route, reasonKey: routeBlock.reasonKey }, routes: routeBlock.enabled });
      panel = routeBlock.panel;
      extraValues = { icc: panel.icc, deff: panel.deff, nEff: panel.nEff };
    }

    // A within-farm route answers the 2x2 question stratified by farm, so the method that runs is MH.
    if (!routeBlock && norm.cluster.route === 'mh-within' && MH_WITHIN_FROM.has(norm.method)) {
      const from = norm.method;
      norm = normalizeSpec({
        ...norm,
        method: 'epi.mantelHaenszel',
        roles: { ...norm.roles, strata: norm.cluster.column || undefined },
        options: {
          confLevel: norm.options.confLevel,
          alternative: norm.options.alternative,
          measure: norm.design === 'case-control' ? 'OR' : 'RR',
          homogeneity: norm.design === 'case-control' ? 'breslow-day-tarone' : 'woolf',
        },
      }, codebook);
      notes.push({ id: 'route', severity: 'note', key: 'runtime.note.routeMhWithin', params: { from } });
    }

    // Design first (G3).
    if (!DESIGN_FREE_METHODS.includes(norm.method) && norm.input.kind !== 'params') {
      const d = deps.checkDesign(norm.design, norm.method);
      if (!d.allowed) guard.stops.push({ id: 'G3', severity: 'stop', key: d.reasonKey || 'epi.guard.G3.title' });
      else if (norm.method === 'epi.twoByTwo' && !norm.options.measures && Array.isArray(d.measures)) {
        norm = { ...norm, options: { ...norm.options, measures: d.measures } };
      }
    }

    const found = deps.evaluateGuards(norm, runTable, codebook) || {};
    guard = mergeGuard(guard, found);

    // G1 safety net: even if the guard table missed it, a repeating cluster column with no farm-aware
    // route stops every method that assumes independent animals. No p-value leaves this function.
    if (!guard.stops.some((s) => s.id === 'G1' || s.id === 'G2') && g1Applies(norm, runTable)) {
      guard.stops.push({ id: 'G1', severity: 'stop', key: 'epi.guard.G1.title', routes: [...CLUSTER_ROUTE_ORDER] });
    }

    if (!panel && guard.stops.some((s) => s.id === 'G1' || s.id === 'G2')) {
      panel = deps.clusterPanel(norm, runTable, codebook);
      if (panel) extraValues = { icc: panel.icc, deff: panel.deff, nEff: panel.nEff };
    }

    if (guard.stops.length === 0) {
      if (norm.cluster.route === 'aggregate' && runTable && norm.cluster.column) {
        const cols = roleColumns(norm);
        // A binary outcome becomes herd status (positive when any animal on the farm is positive).
        const positive = {};
        if (norm.roles.outcome && norm.levels?.outcomePositive != null) positive[norm.roles.outcome] = norm.levels.outcomePositive;
        const agg = deps.aggregateToCluster(runTable, norm.cluster.column, cols, { positive });
        // Rows without a farm are dropped with their own reason; the rest are merged into farm rows.
        if (Array.isArray(agg.dropped)) routeDrops.push(...agg.dropped);
        const merged = typeof agg.rowsUsed === 'number' ? agg.rowsUsed - agg.n : runTable.n - agg.n;
        routeDrops.push({ reason: 'aggregated', column: norm.cluster.column, count: Math.max(0, merged) });
        runTable = agg;
        notes.push({ id: 'route', severity: 'note', key: 'runtime.note.routeAggregate' });
        // The checks that read the data judged the animal rows; the method runs on the farm rows.
        // Judge those again (review round 2: a farm table that fails Cochran's rule was printed
        // with a chi-square p-value and no warning), replacing the animal-level findings.
        const farm = deps.evaluateGuards(norm, runTable, codebook) || {};
        guard.warnings = guard.warnings.filter((w) => !AGG_RECHECK.has(w.id))
          .concat((farm.warnings || []).filter((w) => AGG_RECHECK.has(w.id)));
      } else if (norm.cluster.route === 'deff') {
        notes.push({ id: 'route', severity: 'note', key: 'runtime.note.routeDeff' });
      }
      const impl = deps.implemented[norm.method];
      if (!impl) {
        error = { key: 'runtime.engine.methodNotShipped', detail: norm.method };
      } else {
        output = impl(norm, runTable);
        // An invalid result's reason is carried as a value, as the lab and model methods do, so the screen says
        // why (review round 2: a text column ticked as a Cronbach item gave "Could not compute" and no reason).
        if (output?.status === 'invalid' && typeof output.reasonKey === 'string' && !Object.values(output.values || {}).some((v) => v && v.reasonKey)) {
          output = { ...output, values: { ...(output.values || {}), reason: { value: null, reasonKey: output.reasonKey } } };
        }
        if (output?.resolvedOptions && Object.keys(output.resolvedOptions).length) {
          norm = { ...norm, options: { ...norm.options, ...output.resolvedOptions } };
          // The robust farm route forces Wald intervals: that is a consequence of the route the student chose,
          // said as such; the rest was settled from the data (review round 2: raw option ids reached the screen).
          const ids = Object.keys(output.resolvedOptions).filter((k) => !(k === 'ciMethod' && norm.cluster.route === 'robust'));
          if (ids.length < Object.keys(output.resolvedOptions).length) notes.push({ id: 'autoRoute', severity: 'note', key: 'runtime.note.robustWald' });
          if (ids.length) notes.push({ id: 'auto', severity: 'note', key: 'runtime.note.autoResolved', params: { options: ids.join(', '), optionIds: ids } });
        }
        if (Array.isArray(output?.notes)) notes.push(...output.notes);
        // M2: a method may raise its own warnings (G14 events per variable, G23 overdispersion).
        if (Array.isArray(output?.warnings) && output.warnings.length) guard = mergeGuard(guard, { warnings: output.warnings });
        if (output && output.status === 'ok' && !output.values && !output.tests) error = { key: 'runtime.engine.methodFailed', detail: 'empty output' };
        // Guards that read the result: G8 (p > 0.05 is not "no difference") and G12 (strata disagree).
        if (output && output.status === 'ok') guard = mergeGuard(guard, deps.resultGuards(norm, output) || {});
      }
    }
  } catch (e) {
    error = { key: 'runtime.engine.methodFailed', detail: String(e?.message || e).slice(0, 300) };
    output = null;
  }

  guard.notes = [...guard.notes, ...notes];
  const drops = [...exclusionDrops, ...routeDrops, ...((output && output.dropped) || [])];
  const used = output ? output.used ?? 0 : runTable ? runTable.n : 0;
  const entry = getMethod(norm.method);
  return makeEnvelope({
    spec: norm,
    output,
    guard,
    provenance: provenanceOf(norm, table, { used, dropped: drops }, computedAt, entry?.validatedAgainst || [], valid.spec.method !== norm.method ? valid.spec.method : null),
    verified: Boolean(entry?.verified),
    method: methodInfo(norm.method),
    extraValues,
    clusterPanel: panel,
    error,
  });
}

/** @typedef {{ checkDesign: typeof checkDesign, evaluateGuards: typeof evaluateGuards, resultGuards: typeof resultGuards, clusterPanel: typeof clusterPanel, aggregateToCluster: typeof aggregateToCluster, implemented: Record<string, import('./registry.js').MethodImpl> }} Deps */
/** @type {Deps} */
const DEFAULT_DEPS = { checkDesign, evaluateGuards, resultGuards, clusterPanel, aggregateToCluster, implemented: IMPLEMENTED };

function methodInfo(id) {
  const row = METHODS.find((m) => m.id === id);
  return { id: id || '', family: row?.families?.[0] || '', milestone: row?.milestone || 'M1' };
}

function mergeGuard(a, b) {
  const stops = [...a.stops];
  for (const s of b.stops || []) if (!stops.some((x) => x.id === s.id)) stops.push(s);
  return { stops, warnings: [...a.warnings, ...(b.warnings || [])], notes: [...a.notes, ...(b.notes || [])] };
}

function provenanceOf(spec, table, { used, dropped }, computedAt, validatedAgainst, requestedMethod = null) {
  /** @type {import('./types.js').Provenance & { route?: string|null, requestedMethod?: string|null }} */
  const p = {
    methodId: spec?.method || '',
    options: spec?.options || {},
    engineVersion: ENGINE_VERSION,
    engineTier: 'A',
    rowsUsed: used,
    rowsDropped: dropped,
    dataFingerprint: table?.fingerprint || null,
    recipeRev: table ? table.recipeRev ?? null : spec?.input?.recipeRev ?? null,
    computedAt,
    validatedAgainst: [...validatedAgainst],
    route: spec?.cluster?.route ?? null,
  };
  if (table?.codebookFingerprint) p.codebookFingerprint = table.codebookFingerprint;
  if (requestedMethod) p.requestedMethod = requestedMethod;
  return p;
}

/**
 * The first column a spec names under two roles, and those two roles, or null: a column holds one role. The stop
 * names both roles (review round 6: it named the column "c5" and always said the outcome cannot also be an
 * explanatory variable, also when the outcome was the follow-up time or a test was its own second test).
 * @returns {{ column: string, roles: string[] }|null}
 */
export function columnInTwoRoles(spec) {
  const seen = new Map();
  for (const [role, v] of Object.entries(spec.roles || {})) {
    for (const k of new Set([].concat(v || []))) {
      if (!k) continue;
      if (seen.has(k)) return { column: k, roles: [seen.get(k), role] };
      seen.set(k, role);
    }
  }
  return null;
}

/** Column keys the spec's roles name (for aggregation to the farm). */
export function roleColumns(spec) {
  const out = [];
  for (const [role, v] of Object.entries(spec.roles || {})) {
    if (role === 'cluster') continue;
    for (const k of [].concat(v || [])) if (k && !out.includes(k)) out.push(k);
  }
  return out;
}

/**
 * The table without rows a recipe step excluded or filtered. Implementations never see those rows;
 * provenance counts them separately (exclusionCounts).
 * @param {import('./types.js').WorkingTable} table
 * @returns {import('./types.js').WorkingTable}
 */
export function activeTable(table) {
  const excluded = table.excluded || {};
  if (!Object.keys(excluded).length) return table;
  const keep = [];
  table.rowIds.forEach((id, i) => { if (!excluded[id]) keep.push(i); });
  const columns = {};
  for (const [key, col] of Object.entries(table.columns)) {
    const vals = col.values;
    const pick = (arr) => {
      if (ArrayBuffer.isView(arr)) {
        const out = new /** @type {any} */ (arr.constructor)(keep.length);
        keep.forEach((r, j) => { out[j] = arr[r]; });
        return out;
      }
      return keep.map((r) => arr[r]);
    };
    columns[key] = { ...col, values: pick(vals), missing: pick(col.missing) };
  }
  return { ...table, rowIds: keep.map((i) => table.rowIds[i]), columns, n: keep.length, excluded: {} };
}

/** Rows removed by recipe steps, counted by kind: 'excluded' (row-exclude) and 'filter'. */
export function exclusionCounts(table, steps) {
  const kindOf = new Map((steps || []).map((s) => [s.id, s.kind]));
  let excluded = 0;
  let filtered = 0;
  for (const stepId of Object.values(table.excluded || {})) {
    if (kindOf.get(stepId) === 'filter') filtered += 1;
    else excluded += 1;
  }
  const out = [];
  if (excluded) out.push({ reason: 'excluded', column: null, count: excluded });
  if (filtered) out.push({ reason: 'filter', column: null, count: filtered });
  return out;
}

/**
 * The chosen farm route when the G1 panel greys it out for this method and these rows, else null.
 * Only asked when the cluster column actually repeats (a route on data without farms is harmless).
 * @returns {{ panel: any, reasonKey: string|null, enabled: string[] }|null}
 */
export function unavailableRoute(spec, table, codebook, deps = DEFAULT_DEPS) {
  const route = spec.cluster?.route;
  if (!table || !FARM_AWARE.has(route) || !G1_SUBJECT.has(spec.method)) return null;
  if (!g1Applies({ ...spec, cluster: { ...spec.cluster, route: null } }, table)) return null;
  const panel = deps.clusterPanel(spec, table, codebook);
  if (!panel || !Array.isArray(panel.routes)) return null;
  const r = panel.routes.find((x) => x.id === route);
  if (r && r.enabled) return null;
  return { panel, reasonKey: r?.reasonKey ?? null, enabled: panel.routes.filter((x) => x.enabled).map((x) => x.id) };
}

/**
 * True when the method assumes independent animals, the data come from a file with a cluster column,
 * that column repeats among the rows present, and no farm-aware route has been chosen.
 */
export function g1Applies(spec, table) {
  if (!table || spec.input.kind !== 'dataset' || !G1_SUBJECT.has(spec.method)) return false;
  if (FARM_AWARE.has(spec.cluster.route)) return false;
  const key = spec.cluster.column;
  const col = key ? table.columns[key] : null;
  if (!col) return false;
  const seen = new Set();
  for (let i = 0; i < table.n; i += 1) {
    if (col.missing?.[i]) continue;
    const v = col.values[i];
    if (v === null || v === undefined || (typeof v === 'number' && (Number.isNaN(v) || (col.kind === 'category' && v < 0)))) continue;
    if (seen.has(v)) return true;
    seen.add(v);
  }
  return false;
}

