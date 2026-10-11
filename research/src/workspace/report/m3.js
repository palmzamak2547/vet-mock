// Methods and results sentences of the M3a methods [M3-DESIGN.md 6]: the standard curve, dose-response curves and
// curve equations (nls.*), the area under the curve (calc.auc), qPCR (qpcr.relative, qpcr.efficiency) and PCA
// (mv.pca). build.js opens each methods paragraph with the method's own sentence and calls these for what follows;
// the results are written here from the envelope's values, tests and tables, estimate and interval before p. The
// potency is named IC50 or EC50 by the curve's direction, read from the envelope (the value keys say it), never
// guessed. Pure: the formatting helpers come in `kit` from build.js. OWNER: report role.

/**
 * @typedef {{ t: Function, lang: 'th'|'en', fmt: any, col: (k: string) => string, levelName: (k: string, v: string) => string,
 *   valueText: (r: any) => string, statsText: (test: any) => string, num: (x: number) => string, cap: (s: string) => string,
 *   join: (items: string[]) => string, level: string, estimate: (name: string) => string|null, undefinedText: (r: any) => string,
 *   pText: (p: number|null) => string }} Kit
 */

/** Methods whose results this module writes. */
export const M3_RESULTS = new Set(['nls.fourPL', 'nls.doseResponse', 'nls.equation', 'calc.auc', 'qpcr.relative', 'qpcr.efficiency', 'mv.pca']);

const tableOf = (env, id) => (env?.tables || []).find((tb) => tb.id === id) || null;
const noteOf = (env, id) => (env?.guard?.notes || []).find((n) => n.id === id) || null;
const testOf = (env, id) => (env?.tests || []).find((x) => x.id === id) || null;
const finite = (x) => typeof x === 'number' && Number.isFinite(x);
/** The cells of one row of a table by column name. */
const rowObj = (tb, r) => Object.fromEntries(tb.columns.map((c, i) => [c, r[i]]));

/**
 * The potency's name from the envelope: 'ic50' when every curve falls, 'ec50' when every curve rises, 'both' when the
 * groups go both ways (or no curve could be fitted).
 * @param {any} env
 */
export function potencyOf(env) {
  const heads = new Set(Object.keys(env?.values || {}).map((n) => n.split(':')[0]));
  for (const r of tableOf(env, 'potency')?.rows || []) heads.add(r[tableOf(env, 'potency').columns.indexOf('kind')]);
  const ic = heads.has('ic50');
  const ec = heads.has('ec50');
  return ic && !ec ? 'ic50' : ec && !ic ? 'ec50' : 'both';
}

/** The potency in words for a sentence. */
export const potencyWord = (env, t) => t(`report.potency.${potencyOf(env)}`);

/**
 * The sentences that follow the opening methods sentence of an M3a method (and of Firth's logistic regression, negative
 * binomial regression and repeated measures with a second within factor): how the intervals were made, what was read
 * off a curve, how groups were compared.
 * @param {any} spec
 * @param {any} env
 * @param {{ t: Function, lang: 'th'|'en', col: (k: string) => string, levelName: (k: string, v: string) => string, join: (items: string[]) => string, level: string }} ctx
 * @returns {string[]}
 */
export function m3MethodDetails(spec, env, ctx) {
  const { t, col, levelName, join, level } = ctx;
  const o = spec.options || {};
  const r = spec.roles || {};
  const v = env?.values || {};
  const out = [];
  const potency = potencyWord(env, t);
  switch (spec.method) {
    case 'nls.fourPL':
    case 'nls.doseResponse': {
      if (spec.method === 'nls.doseResponse' && r.group) out.push(t('report.methods.nls.pooled'));
      out.push(t('report.methods.nls.se'));
      out.push(t('report.methods.nls.potencyCi', { potency, level }));
      if (spec.method === 'nls.fourPL' && finite(v.nUnknowns?.value) && v.nUnknowns.value > 0) out.push(t('report.methods.nls.unknowns', { n: v.nUnknowns.value }));
      if (noteOf(env, 'zeroDose')) out.push(t('report.methods.nls.zero'));
      if (spec.method === 'nls.fourPL' && o.model === '5pl') out.push(t('report.methods.nls.fiveVsFour'));
      if (spec.method === 'nls.doseResponse') {
        // A comparison whose restricted fit did not converge says it was planned and did not run, never that the
        // curves were compared (fix-stats finding 9).
        const sharedT = testOf(env, 'sharedEc50');
        const oneT = testOf(env, 'oneCurve');
        if (sharedT) out.push(t(sharedT.reasonKey === 'lab.undefined.sharedNotConverged' ? 'report.methods.nls.compareEc50Failed' : o.model === '5pl' ? 'report.methods.nls.compareEc50Five' : 'report.methods.nls.compareEc50', { potency }));
        else if (oneT) out.push(t(oneT.reasonKey === 'lab.undefined.oneCurveNotConverged' ? 'report.methods.nls.compareAllFailed' : 'report.methods.nls.compareAll'));
        const ratio = Object.keys(v).find((n) => n === 'ic50Ratio' || n === 'ec50Ratio');
        const named = noteOf(env, 'ratio')?.params;
        if (ratio && named) {
          out.push(t('report.methods.nls.ratio', { potency: t(`report.potency.${ratio.slice(0, 4)}`), level, numerator: levelName(r.group, named.numerator), denominator: levelName(r.group, named.denominator) }));
        }
      }
      break;
    }
    case 'nls.equation':
      out.push(t('report.methods.nls.se'));
      break;
    case 'calc.auc':
      if (testOf(env, 'tTest')) out.push(t('report.methods.auc.welch'));
      else if (testOf(env, 'anova')) out.push(t('report.methods.auc.anova'));
      else if (!r.group) out.push(t('report.methods.auc.one', { level }));
      break;
    case 'qpcr.relative': {
      const refs = [].concat(r.items || []).filter(Boolean);
      if (refs.length === 1) out.push(t('report.methods.qpcr.refOne', { refs: col(refs[0]) }));
      // Pfaffl's method averages the efficiency-weighted Ct (qpcr.js deltaCt), not the raw Ct (fix-stats finding 10)
      else if (refs.length > 1) out.push(t(o.method === 'pfaffl' ? 'report.methods.qpcr.refManyPfaffl' : 'report.methods.qpcr.refMany', { refs: join(refs.map(col)), count: refs.length }));
      if (o.method === 'pfaffl') {
        const eff = o.efficiency && typeof o.efficiency === 'object' ? o.efficiency : {};
        const genes = [r.outcome, ...refs].filter((k) => k && finite(eff[k]));
        if (genes.length) out.push(t('report.methods.qpcr.efficiencies', { list: join(genes.map((k) => t('report.methods.qpcr.efficiencyItem', { gene: col(k), e: String(Number(eff[k].toPrecision(4))) }))) }));
      }
      const control = controlOf(spec, env);
      const tt = testOf(env, 'tTest');
      if (tt) out.push(t(tt.variant === 'pooled' ? 'report.methods.qpcr.pooled' : 'report.methods.qpcr.welch', { control: control != null ? levelName(r.group, control) : '' }));
      else if (testOf(env, 'anova')) out.push(t('report.methods.qpcr.dunnett', { control: control != null ? levelName(r.group, control) : '' }));
      out.push(t('report.methods.qpcr.fold'));
      break;
    }
    case 'mv.pca':
      out.push(t('report.methods.pca.signs'));
      break;
    case 'anova.repeated':
      if (r.factorB && noteOf(env, 'sequential')) out.push(t('report.methods.rmSequential'));
      break;
    case 'reg.negbin':
      out.push(t('report.methods.negbin.tests'));
      break;
    default:
      break;
  }
  return out;
}

/** The calibrator: the level chosen in the spec, else the one the method says it took (the first level). */
function controlOf(spec, env) {
  if (spec.levels?.controlLevel != null) return spec.levels.controlLevel;
  const first = noteOf(env, 'controlFirst')?.params?.level;
  if (first != null) return first;
  return tableOf(env, 'groups')?.rows?.[0]?.[0] ?? null;
}

/** A value and interval from table cells, written as the results do. */
const cellValue = (kit, value, lo, hi, kind = 'statistic') => kit.valueText({ name: '', value, ci: finite(lo) || finite(hi) || lo === Infinity || hi === Infinity ? [lo, hi] : undefined, kind });

/**
 * The results sentences of an M3a method, or null for a method this module does not write.
 * @param {any} spec
 * @param {any} env
 * @param {Kit} kit
 * @returns {string[]|null}
 */
export function m3Results(spec, env, kit) {
  if (!M3_RESULTS.has(spec?.method)) return null;
  const { t, cap } = kit;
  const v = env.values || {};
  const r = spec.roles || {};
  const out = [];
  const say = (key, params) => out.push(cap(t(key, params)));
  const fitLine = () => {
    if (finite(v.r2?.value) && finite(v.sigma?.value)) say('report.results.nlsFit', { r2: kit.num(v.r2.value), sigma: kit.num(v.sigma.value), df: v.dfResidual?.value ?? '' });
  };
  const testLine = (test, name) => {
    if (!test) return;
    // a test that could not run says why, as an undefined estimate does
    if (test.reasonKey === 'lab.undefined.sharedNotConverged') say('report.results.sharedNotFitted', { test: name, potency: potencyWord(env, t) });
    else if (test.reasonKey === 'lab.undefined.oneCurveNotConverged') say('report.results.oneNotFitted', { test: name });
    else if ((test.p === null || test.p === undefined) && test.reasonKey) out.push(kit.undefinedText({ label: name, reasonKey: test.reasonKey }));
    else if (test.p === null || test.p === undefined) say('report.results.pWithheld', { test: name });
    else say('report.results.test', { test: name, stats: kit.statsText(test) });
  };
  switch (spec.method) {
    case 'nls.fourPL': {
      for (const name of ['ic50', 'ec50']) if (v[name]) out.push(kit.estimate(name));
      if (spec.options?.model === '5pl') {
        testLine(testOf(env, 'fiveVsFour'), t('report.test.fiveVsFour'));
        if (finite(v.aicc?.value) && finite(v.aiccFourPL?.value)) say('report.results.aiccTwo', { a: t('report.model.fivePL'), x: kit.num(v.aicc.value), b: t('report.model.fourPL'), y: kit.num(v.aiccFourPL.value) });
      }
      fitLine();
      const unk = tableOf(env, 'unknowns');
      if (unk && unk.rows.length) {
        const rows = unk.rows.map((x) => rowObj(unk, x));
        say('report.results.nlsRead', { read: rows.filter((x) => finite(x.x)).length, n: rows.length });
        const outside = rows.filter((x) => x.reason === 'lab.undefined.outsideCurve').length;
        if (outside) say('report.results.nlsOutside', { k: outside, n: rows.length });
        const beyond = noteOf(env, 'beyondStandards')?.params?.rows;
        if (finite(beyond) && beyond > 0) say('report.results.nlsBeyond', { k: beyond, n: rows.length });
      }
      break;
    }
    case 'nls.doseResponse': {
      const potency = potencyWord(env, t);
      for (const [name, val] of Object.entries(v)) {
        const m = /^(ic50|ec50)(?::(.*))?$/.exec(name);
        if (!m) continue;
        if (m[2] === undefined) { out.push(kit.estimate(name)); continue; }
        const label = t('report.results.ofTerm', { measure: t(`report.potency.${m[1]}`), term: kit.levelName(r.group, m[2]) });
        if (val.value === null || val.value === undefined) out.push(kit.undefinedText({ ...val, label }));
        else say('report.results.estimate', { label, value: kit.valueText({ name, ...val, kind: 'statistic' }) });
      }
      const ratio = ['ic50Ratio', 'ec50Ratio'].find((n) => v[n]);
      const named = noteOf(env, 'ratio')?.params;
      if (ratio && named && finite(v[ratio].value)) {
        say('report.results.ratio', { potency: t(`report.potency.${ratio.slice(0, 4)}`), numerator: kit.levelName(r.group, named.numerator), denominator: kit.levelName(r.group, named.denominator), value: kit.valueText({ name: ratio, ...v[ratio], kind: 'ratio' }) });
      }
      const shared = testOf(env, 'sharedEc50');
      const one = testOf(env, 'oneCurve');
      if (shared) {
        testLine(shared, t('report.test.sharedEc50', { potency }));
        if (finite(v.aiccSeparate?.value) && finite(v.aiccShared?.value)) say('report.results.aiccTwo', { a: t('report.model.separate'), x: kit.num(v.aiccSeparate.value), b: t('report.model.sharedPotency', { potency }), y: kit.num(v.aiccShared.value) });
      } else if (one) {
        testLine(one, t('report.test.oneCurve'));
        if (finite(v.aiccSeparate?.value) && finite(v.aiccOne?.value)) say('report.results.aiccTwo', { a: t('report.model.separate'), x: kit.num(v.aiccSeparate.value), b: t('report.model.oneCurve'), y: kit.num(v.aiccOne.value) });
      }
      if (finite(v.sigma?.value)) {
        if (r.group) say('report.results.nlsPooledSd', { sigma: kit.num(v.sigma.value), df: v.dfResidual?.value ?? '' });
        else fitLine();
      }
      break;
    }
    case 'nls.equation': {
      const eq = spec.options?.equation || 'michaelisMenten';
      const par = tableOf(env, 'parameters');
      const param = (term) => {
        const row = par?.rows.find((x) => x[0] === term);
        if (!row) return null;
        const o = rowObj(par, row);
        return cellValue(kit, o.estimate, o.lower, o.upper);
      };
      if (eq === 'michaelisMenten' && v.vmax && v.km) {
        if (finite(v.vmax.value) && finite(v.km.value)) say('report.results.michaelisMenten', { vmax: kit.valueText({ name: 'vmax', ...v.vmax }), km: kit.valueText({ name: 'km', ...v.km }) });
        else for (const n of ['vmax', 'km']) out.push(kit.estimate(n));
      } else if (eq === 'decay' && v.halfLife) {
        if (finite(v.halfLife.value)) say('report.results.halfLife', { value: kit.valueText({ name: 'halfLife', ...v.halfLife }), k: param('K') ?? '' });
        else out.push(kit.estimate('halfLife'));
      } else if (eq === 'growth' && v.doublingTime) {
        if (finite(v.doublingTime.value)) say('report.results.doublingTime', { value: kit.valueText({ name: 'doublingTime', ...v.doublingTime }), k: param('k') ?? '' });
        else out.push(kit.estimate('doublingTime'));
      }
      fitLine();
      break;
    }
    case 'calc.auc': {
      const groups = tableOf(env, 'groups');
      if (groups && groups.rows.length) {
        const parts = groups.rows.map((x) => rowObj(groups, x)).map((g) => t('report.results.aucPart', { group: kit.levelName(r.group, g.level), value: cellValue(kit, g.mean, g.lower, g.upper), n: g.n }));
        say('report.results.aucMeans', { parts: kit.join(parts) });
      }
      const diff = v.difference;
      const named = noteOf(env, 'difference')?.params;
      if (diff && named) {
        if (finite(diff.value)) say('report.results.aucDiff', { first: kit.levelName(r.group, named.first), second: kit.levelName(r.group, named.second), value: kit.valueText({ name: 'difference', ...diff, kind: 'difference' }) });
        else out.push(kit.estimate('difference'));
      }
      if (v.meanArea) {
        if (finite(v.meanArea.value)) say('report.results.aucOne', { n: v.nAnimals?.value ?? '', value: kit.valueText({ name: 'meanArea', ...v.meanArea }) });
        else out.push(kit.estimate('meanArea'));
      }
      testLine(testOf(env, 'tTest'), t('report.test.welch'));
      testLine(testOf(env, 'anova'), t('report.test.anova'));
      break;
    }
    case 'qpcr.relative': {
      const control = controlOf(spec, env);
      const controlName = control != null ? kit.levelName(r.group, control) : '';
      const cmp = tableOf(env, 'comparisons');
      const groupOf = (pair) => {
        const s = String(pair);
        const suffix = `-${control}`;
        return control != null && s.endsWith(suffix) ? s.slice(0, -suffix.length) : s;
      };
      for (const row of cmp?.rows || []) {
        const c = rowObj(cmp, row);
        const params = { control: controlName, group: kit.levelName(r.group, groupOf(c.pair)), ddCt: cellValue(kit, c.ddCt, c.lower, c.upper, 'difference'), fold: cellValue(kit, c.fold, c.foldLower, c.foldUpper, 'ratio') };
        if ('pAdjusted' in c) say('report.results.qpcrMany', { ...params, p: kit.pText(c.pAdjusted) });
        else say('report.results.qpcrTwo', params);
      }
      const tt = testOf(env, 'tTest');
      const an = testOf(env, 'anova');
      for (const [test, name] of [[tt, t(tt?.variant === 'pooled' ? 'report.test.pooledT' : 'report.test.welch')], [an, t('report.test.anova')]]) {
        if (!test) continue;
        if (test.p === null || test.p === undefined) say('report.results.pWithheld', { test: name });
        else say('report.results.testOnDct', { test: name, stats: kit.statsText(test) });
      }
      break;
    }
    case 'qpcr.efficiency': {
      const pct = v.efficiencyPercent;
      if (pct && finite(pct.value) && v.efficiency && finite(v.efficiency.value)) {
        const p1 = (x) => kit.fmt.formatNumber(x, { kind: 'statistic', digits: 1 });
        const pctText = Array.isArray(pct.ci) && pct.ci.every(finite)
          ? t('report.results.valueCiPct', { value: p1(pct.value), lo: p1(pct.ci[0]), hi: p1(pct.ci[1]), level: kit.level })
          : `${p1(pct.value)}%`;
        say('report.results.efficiency', { pct: pctText, e: kit.valueText({ name: 'efficiency', ...v.efficiency }), slope: v.slope ? kit.valueText({ name: 'slope', ...v.slope }) : '', r2: finite(v.r2?.value) ? kit.num(v.r2.value) : '' });
        if (noteOf(env, 'efficiencyRange')) say('report.results.efficiencyRange');
      } else {
        if (v.slope) out.push(kit.estimate('slope'));
        if (pct) out.push(kit.estimate('efficiencyPercent'));
      }
      break;
    }
    case 'mv.pca': {
      const comp = tableOf(env, 'components');
      const rows = (comp?.rows || []).map((x) => rowObj(comp, x));
      if (rows.length >= 2) {
        const pc = (x) => `${kit.fmt.formatNumber(x * 100, { kind: 'statistic', digits: 1 })}%`;
        say('report.results.pcaVariance', { n: v.n?.value ?? '', k: v.nItems?.value ?? '', p1: pc(rows[0].proportion), p2: pc(rows[1].proportion), cum: pc(rows[1].cumulative), e1: kit.num(rows[0].eigenvalue), e2: kit.num(rows[1].eigenvalue) });
      }
      const ld = tableOf(env, 'loadings');
      if (ld && ld.rows.length) {
        const top = (c) => {
          const j = ld.columns.indexOf(c);
          if (j < 0) return null;
          let best = null;
          for (const row of ld.rows) if (finite(row[j]) && (!best || Math.abs(row[j]) > Math.abs(best[j]))) best = row;
          return best ? { item: kit.col(best[0]), value: kit.num(best[j]) } : null;
        };
        const a = top('pc1');
        const b = top('pc2');
        if (a && b) say('report.results.pcaLoadings', { item1: a.item, l1: a.value, item2: b.item, l2: b.value });
      }
      break;
    }
    default:
      break;
  }
  return out.filter(Boolean);
}
