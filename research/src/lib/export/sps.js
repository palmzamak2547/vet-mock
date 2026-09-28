// SPSS syntax (.sps) that re-runs each analysis of the report on the exported analysed-data CSV, with
// VetMock Research's numbers and SPSS's known differences as comments above each command (engine.md 6.2:
// the reference level, the Levene centre, Yates, profile against Wald intervals) [M2-DESIGN.md 6.3].
// Methods SPSS has no command for say so in a comment. The app shows the syntax and hands it over as a
// download; it never runs it. Every comment is its own command ending in a full stop, as SPSS reads
// comments. OWNER: report role.
import { getMethod } from '../runtime/catalog.js';
import { columnIndex, envNumbers, rolesOf, scriptAnalyses, wrapComment } from './script-common.js';

/** An SPSS string literal in single quotes. */
export const sq = (s) => `'${String(s ?? '').replace(/'/g, "''")}'`;

/** Comment lines, each a command of its own. */
export const cmt = (text) => wrapComment(text, 80).map((l) => `* ${l.replace(/\.\s*$/, '')}.`);

/** Numeric variable formats for reading (the width only bounds the field) and for showing. */
function readFormat(c) {
  if (c.type === 'date') return 'SDATE10';
  if (c.type === 'string') return `A${Math.max(1, Math.min(32767, c.width || 255))}`;
  return 'F40.0';
}
const showFormat = (c) => (c.codebookType === 'continuous' ? 'F12.4' : 'F8.0');

/** The position (1-based) of a level among the values in the order SPSS sorts them. */
function sortedIndex(levels, level, numeric) {
  const sorted = levels.slice().sort((x, y) => (numeric ? Number(x) - Number(y) : x < y ? -1 : x > y ? 1 : 0));
  const i = sorted.indexOf(level);
  return i < 0 ? null : i + 1;
}

/**
 * SPSS commands for one analysis, the differences to state above them, and whether SPSS has a command.
 * @returns {{ code: string[], notes: string[], none?: string }}
 */
function spssCode(spec, ix, t) {
  const v = ix.v;
  const o = spec.options || {};
  const lv = spec.levels || {};
  const one = (role) => rolesOf(spec, role)[0] || null;
  const V = (role) => v(one(role));
  const isNum = (role) => ix.col(one(role))?.type === 'number';
  const lit = (role, value) => (isNum(role) ? String(value) : sq(value));
  const cil = Math.round((o.confLevel ?? 0.95) * 100);
  const code = [];
  const notes = [];
  const route = spec.cluster?.route && spec.cluster.route !== 'none' ? spec.cluster.route : null;
  // ONEWAY needs a numeric factor: a string group is coded 1..k in sorted order first.
  const numericGroup = (role) => {
    if (isNum(role)) return V(role);
    code.push(`AUTORECODE VARIABLES=${V(role)} /INTO ${V(role)}_n /PRINT.`);
    return `${V(role)}_n`;
  };
  if (route && route !== 'robust') notes.push(t(`report.script.spss.route.${route === 'mh-within' ? 'mhWithin' : route}`));
  switch (spec.method) {
    case 'freq.proportion':
    case 'freq.incidenceRisk':
    case 'freq.truePrevalence':
      code.push(`FREQUENCIES VARIABLES=${V('outcome')}.`);
      notes.push(t('report.script.spss.noInterval'));
      break;
    case 'desc.summary':
      code.push(`EXAMINE VARIABLES=${V('outcome')}${one('group') ? ` BY ${V('group')}` : ''} /PLOT NONE /STATISTICS DESCRIPTIVES /PERCENTILES(25,50,75) ${o.quantileType === 6 ? 'HAVERAGE' : 'EMPIRICAL'} /MISSING PAIRWISE.`);
      notes.push(t('report.script.spss.quantile'));
      break;
    case 'desc.table1':
      code.push(`FREQUENCIES VARIABLES=${rolesOf(spec, 'covariates').map(v).join(' ') || 'ALL'} /STATISTICS=MEAN STDDEV MEDIAN QUARTILES.`);
      break;
    case 'epi.twoByTwo':
      code.push(`CROSSTABS /TABLES=${V('exposure')} BY ${V('outcome')} /STATISTICS=CHISQ RISK /CELLS=COUNT ROW.`);
      notes.push(t('report.script.spss.riskOrder', { exposed: lv.exposureLevel ?? '', outcome: lv.outcomePositive ?? '' }));
      break;
    case 'epi.mantelHaenszel':
      code.push(`CROSSTABS /TABLES=${V('exposure')} BY ${V('outcome')} BY ${rolesOf(spec, 'strata').map(v).join(' BY ')} /STATISTICS=CHISQ RISK CMH(1) /CELLS=COUNT.`);
      notes.push(t('report.script.spss.riskOrder', { exposed: lv.exposureLevel ?? '', outcome: lv.outcomePositive ?? '' }));
      break;
    case 'test.chisq':
      code.push(`CROSSTABS /TABLES=${V('exposure')} BY ${V('outcome')} /STATISTICS=CHISQ /CELLS=COUNT EXPECTED.`);
      notes.push(t('report.script.spss.yates'));
      break;
    case 'test.fisher2x2':
      code.push(`CROSSTABS /TABLES=${V('exposure')} BY ${V('outcome')} /STATISTICS=CHISQ RISK /CELLS=COUNT.`);
      notes.push(t('report.script.spss.fisherOr'));
      break;
    case 'test.mcnemar':
      code.push(`CROSSTABS /TABLES=${V('x')} BY ${V('y')} /STATISTICS=MCNEMAR /CELLS=COUNT.`);
      break;
    case 'test.trend':
      code.push(`CROSSTABS /TABLES=${V('exposure')} BY ${V('outcome')} /STATISTICS=CHISQ /CELLS=COUNT.`);
      notes.push(t('report.script.spss.trend'));
      break;
    case 'test.tTest': {
      const variant = o.variant || 'welch';
      if (variant === 'paired') code.push(`T-TEST PAIRS=${v(one('x') || one('outcome'))} WITH ${V('y')} (PAIRED) /CRITERIA=CI(.${cil}).`);
      else if (variant === 'one-sample') code.push(`T-TEST /TESTVAL=${o.mu ?? 0} /VARIABLES=${v(one('outcome') || one('x'))} /CRITERIA=CI(.${cil}).`);
      else {
        const g = one('group') || one('exposure');
        const levels = ix.col(g)?.levels || [];
        const quote = ix.col(g)?.type === 'number' ? String : sq;
        code.push(`T-TEST GROUPS=${v(g)}(${levels.slice(0, 2).map(quote).join(' ')}) /VARIABLES=${V('outcome')} /CRITERIA=CI(.${cil}).`);
        notes.push(t(variant === 'pooled' ? 'report.script.spss.tPooled' : 'report.script.spss.tWelch'));
      }
      break;
    }
    case 'test.anova1':
    case 'posthoc.tukey': {
      const g = numericGroup('group');
      const post = spec.method === 'posthoc.tukey' || o.posthoc === 'tukey' ? ' /POSTHOC=TUKEY ALPHA(0.05)' : /bonferroni/.test(o.posthoc || '') ? ' /POSTHOC=BONFERRONI ALPHA(0.05)' : '';
      code.push(`ONEWAY ${V('outcome')} BY ${g} /STATISTICS DESCRIPTIVES${post}.`);
      if (/holm/.test(o.posthoc || '')) notes.push(t('report.script.spss.holm'));
      break;
    }
    case 'posthoc.gamesHowell': {
      const g = numericGroup('group');
      code.push(`ONEWAY ${V('outcome')} BY ${g} /POSTHOC=GH ALPHA(0.05).`);
      break;
    }
    case 'posthoc.dunnett': {
      const levels = ix.col(one('group'))?.levels || [];
      const k = sortedIndex(levels, lv.controlLevel, isNum('group'));
      const g = numericGroup('group');
      code.push(`ONEWAY ${V('outcome')} BY ${g} /POSTHOC=DUNNETT${k ? `(${k})` : ''} ALPHA(0.05).`);
      notes.push(t('report.script.spss.dunnett', { control: lv.controlLevel ?? '' }));
      break;
    }
    case 'posthoc.dunn':
    case 'test.kruskalWallis':
      code.push(`NPTESTS /INDEPENDENT TEST (${V('outcome')}) GROUP (${V('group')}) KRUSKAL_WALLIS(COMPARE=${spec.method === 'posthoc.dunn' ? 'PAIRWISE' : 'NONE'}).`);
      if (spec.method === 'posthoc.dunn') notes.push(t('report.script.spss.dunn'));
      break;
    case 'test.mannWhitney':
      code.push(`NPTESTS /INDEPENDENT TEST (${V('outcome')}) GROUP (${V('group')}) MANN_WHITNEY${o.estimate === 'none' ? '' : ' HODGES_LEHMAN'} /CRITERIA CILEVEL=${cil}.`);
      break;
    case 'test.wilcoxonSignedRank':
      code.push(`NPTESTS /RELATED TEST(${V('x')} ${V('y')}) WILCOXON${o.estimate === 'none' ? '' : ' HODGES_LEHMAN'} /CRITERIA CILEVEL=${cil}.`);
      break;
    case 'corr.pearson':
      code.push(`CORRELATIONS /VARIABLES=${V('x')} ${V('y')} /PRINT=TWOTAIL.`);
      notes.push(t('report.script.spss.noCorrCi'));
      break;
    case 'corr.spearman':
      code.push(`NONPAR CORR /VARIABLES=${V('x')} ${V('y')} /PRINT=SPEARMAN TWOTAIL.`);
      break;
    case 'reg.ols': {
      const covs = rolesOf(spec, 'covariates');
      const cats = covs.filter((k) => ix.col(k)?.type !== 'number' || ['binary', 'nominal', 'ordinal'].includes(ix.col(k)?.codebookType));
      if (cats.length) {
        const nums = covs.filter((k) => !cats.includes(k));
        code.push(`UNIANOVA ${V('outcome')} BY ${cats.map(v).join(' ')}${nums.length ? ` WITH ${nums.map(v).join(' ')}` : ''} /PRINT=PARAMETER /CRITERIA=ALPHA(.05) /DESIGN=${covs.map(v).join(' ')}.`);
        notes.push(t('report.script.spss.lastReference'));
      } else code.push(`REGRESSION /STATISTICS COEFF CI(${cil}) R ANOVA /DEPENDENT ${V('outcome')} /METHOD=ENTER ${covs.map(v).join(' ')}.`);
      break;
    }
    case 'dx.accuracy':
      code.push(`CROSSTABS /TABLES=${V('test')} BY ${V('reference')} /CELLS=COUNT COLUMN ROW.`);
      notes.push(t('report.script.spss.dx'));
      break;
    case 'agree.kappa':
      code.push(`CROSSTABS /TABLES=${V('raterA')} BY ${V('raterB')} /STATISTICS=KAPPA.`);
      if (o.weights && o.weights !== 'none') notes.push(t('report.script.spss.weightedKappa'));
      break;
    case 'agree.percent':
      code.push(`CROSSTABS /TABLES=${V('raterA')} BY ${V('raterB')} /CELLS=COUNT TOTAL.`);
      break;
    case 'cluster.iccDeff':
      code.push(`ONEWAY ${V('outcome')} BY ${spec.cluster?.column ? v(spec.cluster.column) : V('cluster')}.`);
      notes.push(t('report.script.spss.icc'));
      break;
    case 'anova.twoWay': {
      const A = V('group');
      const B = V('factorB');
      const design = o.interaction === false ? `${A} ${B}` : `${A} ${B} ${A}*${B}`;
      const post = o.posthoc === 'tukey' ? ` /POSTHOC=${A} ${B}(TUKEY)` : '';
      code.push(`UNIANOVA ${V('outcome')} BY ${A} ${B} /METHOD=SSTYPE(${o.ssType === 'II' ? 2 : 3}) /INTERCEPT=INCLUDE${post} /PRINT=ETASQ DESCRIPTIVE /CRITERIA=ALPHA(.05) /DESIGN=${design}.`);
      break;
    }
    case 'anova.repeated': {
      const y = V('outcome');
      const s = V('subject');
      const tm = V('time');
      const g = one('group') ? V('group') : null;
      const times = ix.col(one('time'))?.levels || [];
      if (!times.length) return { code: [], notes, none: t('report.script.spss.noTimes') };
      code.push('DATASET COPY rm_wide.', 'DATASET ACTIVATE rm_wide.');
      code.push(`SELECT IF NOT MISSING(${y}).`, `SORT CASES BY ${s} ${tm}.`);
      code.push(`CASESTOVARS /ID=${s}${g ? ` ${g}` : ''} /INDEX=${tm} /GROUPBY=VARIABLE.`);
      code.push(`GLM ${times.map((x) => `${y}.${x}`).join(' ')}${g ? ` BY ${g}` : ''} /WSFACTOR=time ${times.length} Polynomial /METHOD=SSTYPE(3) /PRINT=DESCRIPTIVE ETASQ /WSDESIGN=time${g ? ` /DESIGN=${g}` : ''}.`);
      code.push('DATASET ACTIVATE analysed.', 'DATASET CLOSE rm_wide.');
      notes.push(t('report.script.spss.rm'));
      if (g) notes.push(t('report.script.spss.hf'));
      break;
    }
    case 'test.friedman': {
      const y = V('outcome');
      const s = V('subject');
      const g = V('group');
      const levels = ix.col(one('group'))?.levels || [];
      if (!levels.length) return { code: [], notes, none: t('report.script.spss.noTimes') };
      code.push('DATASET COPY fr_wide.', 'DATASET ACTIVATE fr_wide.');
      code.push(`SELECT IF NOT MISSING(${y}).`, `SORT CASES BY ${s} ${g}.`, `CASESTOVARS /ID=${s} /INDEX=${g} /GROUPBY=VARIABLE.`);
      code.push(`NPAR TESTS /FRIEDMAN=${levels.map((x) => `${y}.${x}`).join(' ')}.`);
      code.push('DATASET ACTIVATE analysed.', 'DATASET CLOSE fr_wide.');
      break;
    }
    case 'diag.shapiro':
      if (one('group') && o.on !== 'groups') {
        code.push(`UNIANOVA ${V('outcome')} BY ${V('group')} /SAVE=RESID(res_sw) /DESIGN=${V('group')}.`);
        code.push('EXAMINE VARIABLES=res_sw /PLOT NPPLOT /STATISTICS NONE.');
      } else code.push(`EXAMINE VARIABLES=${V('outcome')}${one('group') ? ` BY ${V('group')}` : ''} /PLOT NPPLOT /STATISTICS NONE.`);
      notes.push(t('report.script.spss.shapiro'));
      break;
    case 'diag.brownForsythe': {
      const g = numericGroup('group');
      code.push(`ONEWAY ${V('outcome')} BY ${g} /STATISTICS HOMOGENEITY.`);
      notes.push(t(o.center === 'mean' ? 'report.script.spss.leveneMean' : 'report.script.spss.leveneMedian'));
      break;
    }
    case 'reg.logistic': {
      const covs = rolesOf(spec, 'covariates');
      const cats = covs.filter((k) => ['binary', 'nominal', 'ordinal'].includes(ix.col(k)?.codebookType));
      code.push(`COMPUTE y01 = (${V('outcome')} = ${lit('outcome', lv.outcomePositive)}).`, 'EXECUTE.');
      const contrasts = cats.map((k) => {
        const c = ix.col(k);
        const ref = spec.levels?.references?.[k] ?? c?.reference ?? c?.levels?.[0] ?? null;
        const pos = ref != null ? sortedIndex(c?.levels || [], ref, c?.type === 'number') : null;
        if (ref != null) notes.push(t('report.script.spss.reference', { column: c?.name || k, level: ref }));
        return ` /CONTRAST (${v(k)})=Indicator${pos ? `(${pos})` : ''}`;
      }).join('');
      code.push(`LOGISTIC REGRESSION VARIABLES y01 /METHOD=ENTER ${covs.map(v).join(' ')}${cats.length ? ` /CATEGORICAL=${cats.map(v).join(' ')}` : ''}${contrasts} /PRINT=CI(${cil}) /CRITERIA=PIN(.05) POUT(.10) ITERATE(25) CUT(.5).`);
      notes.push(t('report.script.spss.wald'));
      notes.push(t('report.script.spss.convergence'));
      if (route === 'robust') notes.push(t('report.script.spss.robust'));
      break;
    }
    case 'reg.poisson': {
      const covs = rolesOf(spec, 'covariates');
      const cats = covs.filter((k) => ['binary', 'nominal', 'ordinal'].includes(ix.col(k)?.codebookType));
      const nums = covs.filter((k) => !cats.includes(k));
      if (one('time')) code.push(`COMPUTE ln_time = LN(${V('time')}).`, 'EXECUTE.');
      code.push(`GENLIN ${V('outcome')}${cats.length ? ` BY ${cats.map(v).join(' ')} (ORDER=ASCENDING)` : ''}${nums.length ? ` WITH ${nums.map(v).join(' ')}` : ''}`
        + ` /MODEL ${covs.map(v).join(' ')} INTERCEPT=YES${one('time') ? ' OFFSET=ln_time' : ''} DISTRIBUTION=POISSON LINK=LOG`
        + `${route === 'robust' && spec.cluster?.column ? ` /REPEATED SUBJECT=${v(spec.cluster.column)} CORRTYPE=INDEPENDENT` : ''}`
        + ` /CRITERIA CILEVEL=${cil} CITYPE=${o.ciMethod === 'wald' || route === 'robust' ? 'WALD' : 'PROFILE'} /PRINT CPS DESCRIPTIVES MODELINFO FIT SUMMARY SOLUTION (EXPONENTIATED).`);
      if (cats.length) notes.push(t('report.script.spss.lastReference'));
      if (route === 'robust') notes.push(t('report.script.spss.robust'));
      break;
    }
    case 'surv.kaplanMeier':
      code.push(`COMPUTE event01 = (${V('event')} = ${lit('event', lv.outcomePositive)}).`, 'EXECUTE.');
      code.push(`KM ${V('time')}${one('group') ? ` BY ${V('group')}` : ''} /STATUS=event01(1) /PRINT TABLE MEAN /PLOT SURVIVAL${one('group') && o.test !== 'none' ? ' /TEST LOGRANK /COMPARE OVERALL POOLED' : ''}.`);
      notes.push(t('report.script.spss.km'));
      break;
    case 'roc.delong':
      code.push(`COMPUTE ref01 = (${V('reference')} = ${lit('reference', lv.referencePositive)}).`, 'EXECUTE.');
      code.push(`ROC ${V('test')}${one('test2') ? ` ${V('test2')}` : ''} BY ref01 (1) /PLOT=CURVE(REFERENCE) /PRINT=SE COORDINATES /CRITERIA=CUTOFF(INCLUDE) TESTPOS(${o.direction === 'lower-positive' ? 'SMALL' : 'LARGE'}) DISTRIBUTION(FREE) CI(${cil}) /MISSING=EXCLUDE.`);
      notes.push(t('report.script.spss.roc'));
      if (one('test2')) notes.push(t('report.script.spss.rocPaired'));
      break;
    case 'agree.blandAltman': {
      const A = V('raterA');
      const B = V('raterB');
      code.push(`COMPUTE ba_mean = (${A} + ${B}) / 2.`);
      code.push(o.scale === 'percent' ? `COMPUTE ba_diff = 100 * (${A} - ${B}) / ba_mean.` : o.scale === 'ratio' ? `COMPUTE ba_diff = LN(${A} / ${B}).` : `COMPUTE ba_diff = ${A} - ${B}.`);
      code.push('EXECUTE.', 'DESCRIPTIVES VARIABLES=ba_diff /STATISTICS=MEAN STDDEV.');
      if (o.proportionalBias !== false) code.push('REGRESSION /DEPENDENT ba_diff /METHOD=ENTER ba_mean.');
      notes.push(t('report.script.spss.blandAltman', { k: typeof o.loaMultiplier === 'number' ? o.loaMultiplier : 1.96 }));
      break;
    }
    case 'rel.cronbach': {
      const items = rolesOf(spec, 'items').map(v);
      code.push(`RELIABILITY /VARIABLES=${items.join(' ')} /SCALE('ALL') ALL /MODEL=ALPHA /STATISTICS=DESCRIPTIVE /SUMMARY=TOTAL /ICC=MODEL(MIXED) TYPE(CONSISTENCY) CIN=${cil}.`);
      notes.push(t('report.script.spss.cronbach'));
      break;
    }
    case 'freq.incidenceRate':
    case 'adjust.pValues':
    case 'ss.proportion':
    case 'ss.twoProportions':
    case 'ss.caseControl':
    case 'ss.mean':
    case 'ss.twoMeans':
    case 'ss.paired':
    case 'power.anova':
    case 'power.tTest':
    case 'power.correlation':
    case 'power.regression':
      return { code: [], notes, none: t('report.script.spss.noCommand') };
    case 'design.randomisation':
    case 'design.sampling': {
      const p = spec.input?.params || {};
      return { code: [], notes, none: t('report.script.list', { seed: p.seed ?? o.seed ?? '', stream: p.stream ?? o.stream ?? 54 }) };
    }
    default:
      return { code: [], notes, none: t('report.script.noCode') };
  }
  return { code, notes };
}

/**
 * @param {{ analyses: any[], codebook: any, csvName: string, lang?: 'th'|'en', t?: (k: string, p?: any) => string,
 *   columns?: import('./analysed-data.js').ScriptColumn[]|null, version?: string, date?: string }} input
 * @returns {string}
 */
export function buildSps(input) {
  const t = input.t || ((k) => k);
  const lang = input.lang || 'th';
  const ix = columnIndex(input.codebook, input.columns || null, lang);
  const out = [
    ...cmt(t('report.script.headSps', { csv: input.csvName })),
    ...cmt(t('report.script.notRun')),
    ...cmt(t('report.script.madeWith', { version: input.version || '', date: input.date || '' })),
    ...cmt(t('report.script.csvNote')),
    ...cmt(t('report.script.spss.unicode')),
    '',
    "GET DATA /TYPE=TXT",
    `  /FILE=${sq(input.csvName)}`,
    "  /ENCODING='UTF8'",
    '  /DELIMITERS=","',
    `  /QUALIFIER='"'`,
    '  /ARRANGEMENT=DELIMITED',
    '  /FIRSTCASE=2',
    '  /VARIABLES=',
    ...ix.list.map((c) => `    ${c.name} ${readFormat(c)}`),
    '.',
    'DATASET NAME analysed WINDOW=FRONT.',
  ];
  const numeric = ix.list.filter((c) => c.type === 'number');
  if (numeric.length) out.push(`FORMATS ${numeric.map((c) => `${c.name} (${showFormat(c)})`).join(' ')}.`);
  const dates = ix.list.filter((c) => c.type === 'date');
  if (dates.length) out.push(`FORMATS ${dates.map((c) => `${c.name} (SDATE10)`).join(' ')}.`);
  out.push('VARIABLE LABELS', ...ix.list.map((c, i) => `  ${c.name} ${sq(c.label)}${i === ix.list.length - 1 ? '.' : ''}`));
  const labelled = ix.list.filter((c) => c.levels.length && Object.values(c.levelLabels).some(Boolean));
  if (labelled.length) {
    out.push('VALUE LABELS');
    labelled.forEach((c, i) => {
      const pairs = c.levels.filter((l) => c.levelLabels[l]).map((l) => `${c.type === 'number' ? l : sq(l)} ${sq(c.levelLabels[l])}`);
      out.push(`  ${i ? '/' : ''}${c.name} ${pairs.join(' ')}${i === labelled.length - 1 ? '.' : ''}`);
    });
  }
  const nominal = ix.list.filter((c) => ['binary', 'nominal'].includes(c.codebookType));
  const ordinal = ix.list.filter((c) => c.codebookType === 'ordinal');
  const scale = ix.list.filter((c) => ['continuous', 'count'].includes(c.codebookType));
  const levels = [[nominal, 'NOMINAL'], [ordinal, 'ORDINAL'], [scale, 'SCALE']].filter(([l]) => l.length);
  if (levels.length) out.push(`VARIABLE LEVEL ${levels.map(([l, w]) => `${l.map((c) => c.name).join(' ')} (${w})`).join(' /')}.`);

  scriptAnalyses(input.analyses).forEach((a, i) => {
    const row = getMethod(a.spec?.method);
    const name = row && t(row.nameKey) !== `[${row.nameKey}]` ? t(row.nameKey) : a.spec?.method;
    const r = spssCode(a.spec, ix, t);
    out.push('', `* ${i + 1}. ${name}.`);
    out.push(...cmt(t('report.script.ours', { numbers: '' }).trim().replace(/:$/, '')));
    for (const n of envNumbers(a.env)) out.push(`*   ${n.replace(/\.\s*$/, '')}.`);
    for (const n of r.notes) out.push(...cmt(n));
    if (r.none) out.push(...cmt(r.none));
    else out.push(...r.code);
  });
  return `﻿${out.join('\r\n')}\r\n`;
}
