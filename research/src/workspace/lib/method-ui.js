// What the analysis panels ask for each M1 method [M1-DESIGN.md 10.1, 17]: which columns fill which
// role, which level counts as positive or as the reference, which options the student may change
// (the allowed values are the spec contract's lists), and which screen offers the method. Pure.
// OWNER: ui-analysis role (M2; workspace in M1). The planning tools' entries live in method-ui-tools.js
// (ui-tools role) and are spread in below [M2-DESIGN.md 10].
import { TOOL_METHOD_UI } from './method-ui-tools.js';

/** Column types a role accepts (codebook `type`). */
const CAT = ['binary', 'nominal', 'ordinal'];
const NUM = ['continuous', 'count'];
const BIN = ['binary'];
/** Columns that name an animal (the subject of repeated measurements, or a block). */
const SUBJECT = ['id', 'nominal', 'ordinal', 'count'];

/**
 * @typedef {{ role: string, accept: string[], level?: string, reference?: string, multiple?: boolean, optional?: boolean }} RoleSpec
 * @typedef {{ pane: 'prev'|'assoc'|'table1'|'tool'|'lab'|'models'|'survival'|'measure', input: 'dataset'|'counts'|'params', roles: RoleSpec[], options: Record<string, (string|number|boolean)[]>, test?: boolean, measureKind?: string }} MethodUi
 */

/** @type {Record<string, MethodUi>} */
export const METHOD_UI = {
  'freq.proportion': { pane: 'prev', input: 'dataset', roles: [{ role: 'outcome', accept: CAT, level: 'outcomePositive' }], options: { ciMethod: ['wilson', 'exact', 'wald', 'agresti-coull'] } },
  'freq.truePrevalence': { pane: 'prev', input: 'dataset', roles: [{ role: 'outcome', accept: CAT, level: 'outcomePositive' }], options: { apparentCiMethod: ['wilson', 'exact', 'wald'], clip: [true, false] }, params: ['se', 'sp'] },
  'freq.incidenceRisk': { pane: 'prev', input: 'dataset', roles: [{ role: 'outcome', accept: CAT, level: 'outcomePositive' }], options: { ciMethod: ['wilson', 'exact', 'wald'] } },
  'freq.incidenceRate': { pane: 'prev', input: 'counts', roles: [], counts: ['cases', 'animalTime'], options: { ciMethod: ['exact-poisson'], per: [1000, 100, 1] } },
  'desc.summary': { pane: 'prev', input: 'dataset', roles: [{ role: 'outcome', accept: NUM }, { role: 'group', accept: CAT, optional: true }], options: { quantileType: [7, 6] } },
  'cluster.iccDeff': { pane: 'prev', input: 'dataset', roles: [{ role: 'outcome', accept: [...BIN, ...NUM], level: 'outcomePositive' }], options: { estimator: ['anova-oneway'], clusterSize: ['mean', 'n0'] }, needsCluster: true },

  'epi.twoByTwo': { pane: 'assoc', input: 'dataset', roles: [{ role: 'outcome', accept: CAT, level: 'outcomePositive' }, { role: 'exposure', accept: CAT, level: 'exposureLevel', reference: 'referenceLevel' }], options: { orCi: ['woolf', 'exact'], rrCi: ['wald-log', 'score'], rdCi: ['wald', 'newcombe'], zeroCell: ['none', 'haldane'] }, test: false },
  'epi.mantelHaenszel': { pane: 'assoc', input: 'dataset', roles: [{ role: 'outcome', accept: CAT, level: 'outcomePositive' }, { role: 'exposure', accept: CAT, level: 'exposureLevel', reference: 'referenceLevel' }, { role: 'strata', accept: [...CAT, 'id'] }], options: { measure: ['OR', 'RR'], cmhContinuity: [true, false] }, test: true },
  'test.chisq': { pane: 'assoc', input: 'dataset', roles: [{ role: 'outcome', accept: CAT }, { role: 'exposure', accept: CAT }], options: { yates: [false, true] }, test: true },
  'test.fisher2x2': { pane: 'assoc', input: 'dataset', roles: [{ role: 'outcome', accept: BIN, level: 'outcomePositive' }, { role: 'exposure', accept: BIN, level: 'exposureLevel', reference: 'referenceLevel' }], options: {}, test: true, alternative: true },
  'test.mcnemar': { pane: 'assoc', input: 'dataset', roles: [{ role: 'x', accept: BIN }, { role: 'y', accept: BIN }], options: { continuityCorrection: [true, false], exact: [false, true] }, test: true },
  'test.trend': { pane: 'assoc', input: 'dataset', roles: [{ role: 'outcome', accept: BIN, level: 'outcomePositive' }, { role: 'exposure', accept: ['ordinal', 'count'] }], options: { scores: ['rank'] }, test: true },
  'test.tTest': { pane: 'assoc', input: 'dataset', roles: [{ role: 'outcome', accept: NUM }, { role: 'group', accept: BIN }], options: { variant: ['welch', 'pooled', 'paired', 'one-sample'] }, test: true, alternative: true },
  'test.anova1': { pane: 'assoc', input: 'dataset', roles: [{ role: 'outcome', accept: NUM }, { role: 'group', accept: CAT }], options: { posthoc: ['tukey', 'pairwise-t-holm', 'pairwise-t-bonferroni', 'pairwise-t-sidak', 'pairwise-t-bh', 'none'] }, test: true },
  'test.mannWhitney': { pane: 'assoc', input: 'dataset', roles: [{ role: 'outcome', accept: [...NUM, 'ordinal'] }, { role: 'group', accept: BIN }], options: { exact: ['auto', 'exact', 'normal'], continuityCorrection: [true, false] }, test: true, alternative: true },
  'test.wilcoxonSignedRank': { pane: 'assoc', input: 'dataset', roles: [{ role: 'x', accept: [...NUM, 'ordinal'] }, { role: 'y', accept: [...NUM, 'ordinal'] }], options: { exact: ['auto', 'exact', 'normal'], continuityCorrection: [true, false] }, test: true, alternative: true },
  'test.kruskalWallis': { pane: 'assoc', input: 'dataset', roles: [{ role: 'outcome', accept: [...NUM, 'ordinal'] }, { role: 'group', accept: CAT }], options: {}, test: true },
  'corr.pearson': { pane: 'assoc', input: 'dataset', roles: [{ role: 'x', accept: NUM }, { role: 'y', accept: NUM }], options: { ciMethod: ['fisher-z'] }, test: true, alternative: true },
  'corr.spearman': { pane: 'assoc', input: 'dataset', roles: [{ role: 'x', accept: [...NUM, 'ordinal'] }, { role: 'y', accept: [...NUM, 'ordinal'] }], options: { exact: ['auto', 'exact', 'normal'] }, test: true, alternative: true },
  'reg.ols': { pane: 'assoc', input: 'dataset', roles: [{ role: 'outcome', accept: NUM }, { role: 'covariates', accept: [...NUM, ...CAT], multiple: true }], options: { intercept: [true] }, test: true },
  'dx.accuracy': { pane: 'assoc', input: 'dataset', roles: [{ role: 'test', accept: BIN, level: 'testPositive' }, { role: 'reference', accept: BIN, level: 'referencePositive' }], options: { ciMethod: ['wilson', 'exact'] } },
  'agree.kappa': { pane: 'assoc', input: 'dataset', roles: [{ role: 'raterA', accept: CAT }, { role: 'raterB', accept: CAT }], options: { weights: ['none', 'linear', 'quadratic'] } },
  'agree.percent': { pane: 'assoc', input: 'dataset', roles: [{ role: 'raterA', accept: CAT }, { role: 'raterB', accept: CAT }], options: { ciMethod: ['wilson', 'exact'] } },

  'desc.table1': { pane: 'table1', input: 'dataset', roles: [{ role: 'group', accept: CAT, optional: true }], options: { quantileType: [7, 6] } },

  'ss.proportion': { pane: 'tool', input: 'params', roles: [], params: ['p', 'd', 'N', 'm', 'icc', 'nonResponse'], options: { z: ['exact', 'course-1.96'], fpc: ['course', 'epiR', 'none'] } },
  'ss.twoProportions': { pane: 'tool', input: 'params', roles: [], params: ['p1', 'p2', 'ratio', 'power'], options: { formula: ['pooled', 'fleiss', 'fleiss-cc'], z: ['exact', 'course-1.96'] } },
  'ss.caseControl': { pane: 'tool', input: 'params', roles: [], params: ['OR', 'p0', 'ratio', 'power'], options: { formula: ['course-pooled', 'fleiss', 'fleiss-cc'], z: ['exact', 'course-1.96'] } },
  'ss.mean': { pane: 'tool', input: 'params', roles: [], params: ['sd', 'margin'], options: { z: ['exact', 'course-1.96'] } },
  'ss.twoMeans': { pane: 'tool', input: 'params', roles: [], params: ['sd', 'delta', 'ratio', 'power'], options: { z: ['exact', 'course-1.96'] } },
  'ss.paired': { pane: 'tool', input: 'params', roles: [], params: ['d', 'power'], options: { z: ['exact', 'course-1.96'] } },

  // ---- M2 [M2-DESIGN.md 3, 10.2]: the lab, models, survival and measure panes. Option lists are the
  // area files' allowed values; an option the spec does not know yet is never shown (visibleOptions).
  'anova.twoWay': { pane: 'lab', input: 'dataset', roles: [{ role: 'outcome', accept: NUM }, { role: 'group', accept: CAT }, { role: 'factorB', accept: CAT }], options: { ssType: ['III', 'II', 'I'], interaction: [true, false], posthoc: ['none', 'tukey'] }, test: true },
  'anova.repeated': { pane: 'lab', input: 'dataset', roles: [{ role: 'outcome', accept: NUM }, { role: 'subject', accept: SUBJECT }, { role: 'time', accept: [...CAT, 'count'] }, { role: 'group', accept: CAT, optional: true }], options: { sphericity: ['gg', 'hf', 'none'], mauchly: [true, false] }, test: true },
  'test.friedman': { pane: 'lab', input: 'dataset', roles: [{ role: 'outcome', accept: [...NUM, 'ordinal'] }, { role: 'group', accept: CAT }, { role: 'subject', accept: SUBJECT }], options: {}, test: true },
  'posthoc.dunnett': { pane: 'lab', input: 'dataset', roles: [{ role: 'outcome', accept: NUM }, { role: 'group', accept: CAT, level: 'controlLevel' }], options: {}, test: true },
  'posthoc.dunn': { pane: 'lab', input: 'dataset', roles: [{ role: 'outcome', accept: [...NUM, 'ordinal'] }, { role: 'group', accept: CAT }], options: { adjust: ['holm', 'bonferroni', 'sidak', 'bh', 'none'] }, test: true },
  'posthoc.gamesHowell': { pane: 'lab', input: 'dataset', roles: [{ role: 'outcome', accept: NUM }, { role: 'group', accept: CAT }], options: {}, test: true },
  'diag.shapiro': { pane: 'lab', input: 'dataset', roles: [{ role: 'outcome', accept: NUM }, { role: 'group', accept: CAT, optional: true }], options: { on: ['residuals', 'groups'] }, test: true, diagnostic: true },
  'diag.brownForsythe': { pane: 'lab', input: 'dataset', roles: [{ role: 'outcome', accept: NUM }, { role: 'group', accept: CAT }], options: { center: ['median', 'mean'] }, test: true, diagnostic: true },

  'reg.logistic': { pane: 'models', input: 'dataset', roles: [{ role: 'outcome', accept: BIN, level: 'outcomePositive' }, { role: 'covariates', accept: [...NUM, ...CAT], multiple: true }], options: { ciMethod: ['profile', 'wald'] }, test: true },
  'reg.poisson': { pane: 'models', input: 'dataset', roles: [{ role: 'outcome', accept: ['count'] }, { role: 'covariates', accept: [...NUM, ...CAT], multiple: true }, { role: 'time', accept: NUM, optional: true }], options: { ciMethod: ['profile', 'wald'] }, test: true },

  'surv.kaplanMeier': { pane: 'survival', input: 'dataset', roles: [{ role: 'time', accept: NUM }, { role: 'event', accept: BIN, level: 'outcomePositive' }, { role: 'group', accept: CAT, optional: true }], options: { confType: ['log', 'log-log', 'plain'], test: ['logrank', 'none'] }, test: true },

  'roc.delong': { pane: 'measure', input: 'dataset', roles: [{ role: 'test', accept: [...NUM, 'ordinal'] }, { role: 'reference', accept: BIN, level: 'referencePositive' }, { role: 'test2', accept: [...NUM, 'ordinal'], optional: true }], options: { direction: ['higher-positive', 'lower-positive'], youden: [true, false] }, test: true },
  'agree.blandAltman': { pane: 'measure', input: 'dataset', roles: [{ role: 'raterA', accept: NUM }, { role: 'raterB', accept: NUM }], options: { scale: ['absolute', 'percent', 'ratio'], loaMultiplier: [1.96, 2], loaCi: ['approx', 'none'], proportionalBias: [true, false] } },
  'rel.cronbach': { pane: 'measure', input: 'dataset', roles: [{ role: 'items', accept: [...NUM, 'ordinal'], multiple: true }], options: { ciMethod: ['feldt', 'none'] } },
  ...TOOL_METHOD_UI,
};

/**
 * Options another area adds to a method it does not own (Hodges-Lehmann on the rank tests, the
 * design-based interval on a prevalence) [M2-DESIGN.md 3.1.6, 3.3.4]. Shown only once the spec contract
 * knows them (visibleOptions), so the screen never offers a value the engine would refuse.
 */
export const EXTRA_OPTIONS = Object.freeze({
  'test.mannWhitney': { estimate: ['hodges-lehmann', 'none'] },
  'test.wilcoxonSignedRank': { estimate: ['hodges-lehmann', 'none'] },
  'freq.proportion': { surveyCi: ['logit', 'mean'] },
});

/**
 * Options the screen offers for a method: its own list and the extra ones, limited to those the
 * engine's defaults contain (an option the spec does not know yet is left out) and to those with a choice.
 * @param {string} methodId
 * @param {Record<string, any>} defaults   DEFAULT_OPTIONS[methodId] (passed in so this module stays light)
 * @returns {[string, (string|number|boolean)[]][]}
 */
export function visibleOptions(methodId, defaults = {}) {
  const ui = METHOD_UI[methodId];
  const all = { ...(ui?.options || {}), ...(EXTRA_OPTIONS[methodId] || {}) };
  return Object.entries(all).filter(([name, vals]) => vals.length > 1 && Object.prototype.hasOwnProperty.call(defaults || {}, name));
}

/** Confidence levels offered everywhere (options.confLevel). */
export const CONF_LEVELS = Object.freeze([0.95, 0.9, 0.99]);
/** Alternatives offered on tests that have a direction. */
export const ALTERNATIVES = Object.freeze(['two.sided', 'less', 'greater']);

/**
 * The one-sample t-test's test value as the student typed it (R's `mu`): Thai digits read as digits;
 * an empty box or anything that is not a finite number gives null, and the analysis waits for a number.
 * @param {string} text
 * @returns {number|null}
 */
export function testValue(text) {
  const s = String(text ?? '').trim().replace(/[\u0e50-\u0e59]/g, (d) => String(d.charCodeAt(0) - 0x0e50));
  return s !== '' && Number.isFinite(Number(s)) ? Number(s) : null;
}

/** Roles the t-test needs depend on its variant. */
export function rolesFor(methodId, options = {}) {
  const ui = METHOD_UI[methodId];
  if (!ui) return [];
  if (methodId === 'test.tTest') {
    if (options.variant === 'paired') return [{ role: 'x', accept: NUM }, { role: 'y', accept: NUM }];
    if (options.variant === 'one-sample') return [{ role: 'outcome', accept: NUM }];
  }
  return ui.roles;
}

/**
 * Methods one screen offers for a design: the design row's `offers` (lib/epi/design.js) filtered to
 * this pane, in the design's order. Without a design, nothing is offered: the student names the
 * design first.
 * @param {'prev'|'assoc'|'table1'} pane
 * @param {{ offers: { method: string, measures?: string[] }[] } | null} designRow
 * @returns {{ method: string, measures: string[]|null }[]}
 */
export function methodsForPane(pane, designRow) {
  if (!designRow) return [];
  const seen = new Set();
  const out = [];
  for (const o of designRow.offers || []) {
    const ui = METHOD_UI[o.method];
    if (!ui || ui.pane !== pane || seen.has(o.method)) continue;
    seen.add(o.method);
    out.push({ method: o.method, measures: o.measures || null });
  }
  return out;
}

/** Codebook columns a role can take. Hidden personal-data columns never appear. */
export function columnsForRole(codebook, roleSpec) {
  return (codebook?.columns || []).filter((c) => !c.hidden && !c.pii && roleSpec.accept.includes(c.type));
}

/** Levels of a column in codebook order (value strings). */
export function levelsOf(codebook, key) {
  return (codebook?.columns || []).find((c) => c.key === key)?.levels?.map((l) => l.value) || [];
}

/**
 * Sensible starting choices for a method from the codebook: roles marked in the codebook fill the
 * matching role, the positive level and the reference level come from the codebook.
 * @returns {{ roles: Record<string, string|string[]>, levels: Record<string, string|null> }}
 */
export function initialChoices(methodId, codebook, options = {}) {
  const roles = {};
  const levels = {};
  const cols = codebook?.columns || [];
  const byRole = (r) => cols.filter((c) => c.role === r && !c.hidden);
  for (const spec of rolesFor(methodId, options)) {
    const fits = columnsForRole(codebook, spec);
    let pick = null;
    if (spec.role === 'outcome') pick = byRole('outcome').find((c) => fits.includes(c)) || null;
    if (spec.role === 'exposure' || spec.role === 'group') pick = byRole('exposure').find((c) => fits.includes(c)) || null;
    if (spec.role === 'strata') pick = cols.find((c) => c.key === codebook.clusterKey) || byRole('confounder').find((c) => fits.includes(c)) || null;
    if (spec.role === 'event') pick = byRole('outcome').find((c) => fits.includes(c)) || null;
    if (spec.role === 'subject') pick = [...byRole('id'), ...byRole('pair')].find((c) => fits.includes(c) && c.key !== codebook.clusterKey) || null;
    if (spec.role === 'time' && !spec.optional) pick = byRole('time').find((c) => fits.includes(c)) || null;
    if (spec.multiple) {
      roles[spec.role] = pick ? [pick.key] : [];
      continue;
    }
    if (pick) roles[spec.role] = pick.key;
    // A control group is the codebook's reference level, never its "positive" one.
    if (pick && spec.level) levels[spec.level] = (spec.level === 'controlLevel' ? pick.reference : pick.positive) || null;
    if (pick && spec.reference) {
      levels[spec.reference] = pick.reference || null;
      const other = (pick.levels || []).map((l) => l.value).find((v) => v !== pick.reference);
      if (spec.level) levels[spec.level] = levels[spec.level] || other || null;
    }
  }
  return { roles, levels };
}

/** Which role choices are still empty (the run button stays disabled and says which). */
export function missingRoles(methodId, choices, options = {}) {
  const out = [];
  for (const spec of rolesFor(methodId, options)) {
    const v = choices.roles?.[spec.role];
    if (!spec.optional && (!v || (Array.isArray(v) && v.length === 0))) out.push(spec.role);
    if (v && spec.level && !choices.levels?.[spec.level]) out.push(spec.level);
    if (v && spec.reference && !choices.levels?.[spec.reference]) out.push(spec.reference);
  }
  return out;
}

/**
 * The AnalysisSpec the engine receives [M1-DESIGN.md 10.1]. Options not set here are filled by
 * normalizeSpec() in the engine; the envelope stores the complete, normalised spec.
 */
export function buildSpec({ method, datasetId = null, recipeRev = 0, design = null, roles = {}, levels = {}, options = {}, cluster = { route: null, column: null }, counts = null, params = null }) {
  const ui = METHOD_UI[method];
  let input;
  if (ui?.input === 'params') input = { kind: 'params', params: { ...(params || {}) } };
  else if (ui?.input === 'counts') input = { kind: 'counts', counts: { ...(counts || {}) } };
  else input = { kind: 'dataset', datasetId, recipeRev };
  const keep = Object.fromEntries(Object.entries(roles).filter(([, v]) => v && (!Array.isArray(v) || v.length)));
  return {
    specVersion: 1,
    method,
    input,
    design: design || null,
    roles: keep,
    levels: { ...levels },
    options: { ...options },
    cluster: { route: cluster?.route ?? null, column: cluster?.column ?? null },
  };
}

/** Display kind of a reported value, for formatting and for the CI plot's scale. */
export function valueKind(fullName) {
  // A value one level of a group or one model term carries ('median:Maintained', 'oddsRatio:age'):
  // its kind is the kind of the name before the colon.
  const name = String(fullName).split(':')[0];
  if (/^(oddsRatio|rateRatio)$/.test(name)) return 'ratio';
  if (/^(PR|POR|RR|OR|IRR|LRpos|LRneg|LR\+|LR-|orMH|rrMH|prMH)$/i.test(name) || /ratio/i.test(name)) return 'ratio';
  if (/^(PD|RD|diff|difference|meanDiff)$/i.test(name) || /diff/i.test(name)) return 'difference';
  if (/^(p|prevalence|apparent|truePrevalence|risk|risk0|risk1|Se|Sp|PPV|NPV|ppv|npv|accuracy|po|pe|AFe|AFp|AFeEst|AFpEst|proportion|sensitivity|specificity)$/.test(name)) return 'proportion';
  if (/^(n|nEff|count|clusters|cases|rows)$/.test(name) || /^strata[A-Z]/.test(name)) return 'count';
  if (/^(rate|incidenceRate)$/.test(name)) return 'rate';
  return 'statistic';
}
