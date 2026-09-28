// Disease frequency with correct denominators [M1-DESIGN.md 7.17; methods.md M3]: proportion
// (apparent prevalence), incidence risk (prevalent animals removed from the denominator, course
// 107004), incidence rate per animal-time with the exact Poisson interval (course 107006), and
// true prevalence by Rogan-Gladen with the apparent interval transformed (clipped to 0..1 with a
// note when the formula leaves it). OWNER: epi role.
//
// Cluster routes for a proportion (G1): 'deff' gives the Wald interval widened by sqrt(DEFF) (DEFF
// from spec.cluster.deff when a caller supplies it, else from the rows used); 'aggregate' reports the
// herd-level proportion (clusters with at least one positive animal). Rogan and Gladen 1978
// Am J Epidemiol 107:71-76.

import { proportionCi, poissonRateCi, clipCi01 } from '../stats/proportion.js';
import { qnorm } from '../stats/dist.js';
import { iccOneWay, designEffect } from './cluster.js';
import { getColumn, eachRow, binaryReader, groupReader, countPositive, invalidOutput, val, nul, guarded } from './_table.js';
import { surveyProportion } from './survey.js';

/** @typedef {import('../runtime/types.js').Value} Value */

/** Rogan-Gladen: (AP + Sp - 1) / (Se + Sp - 1); null with a reason when Se + Sp <= 1. */
export function roganGladen(ap, se, sp) {
  const den = se + sp - 1;
  if (!(den > 0)) return null;
  return (ap + sp - 1) / den;
}

function checkSeSp(se, sp) {
  return Number.isFinite(se) && Number.isFinite(sp) && se >= 0 && se <= 1 && sp >= 0 && sp <= 1;
}

/** Read x of n from counts or a dataset outcome; with cluster information when the table has it. */
function readProportion(spec, table) {
  if (spec.input?.kind === 'counts' || spec.input?.kind === 'params') {
    const c = spec.input.counts ?? spec.input.params ?? {};
    const x = c.x ?? c.cases, n = c.n;
    if (!Number.isInteger(x) || !Number.isInteger(n) || x < 0 || n < 0 || x > n) throw Object.assign(new Error('bad counts'), { key: 'epi.error.badCounts' });
    return { x, n, used: n, dropped: [], clusters: c.clusters ?? null };
  }
  if (!table) throw Object.assign(new Error('no data'), { key: 'epi.error.noData' });
  const outKey = spec.roles.outcome;
  const clusterKey = spec.roles?.cluster || spec.cluster?.column || null;
  if (!clusterKey || !table.columns?.[clusterKey] || !spec.cluster?.route || spec.cluster.route === 'none') {
    const r = countPositive(table, outKey, spec.levels.outcomePositive);
    return { x: r.x, n: r.n, used: r.used, dropped: r.dropped, clusters: null };
  }
  const rd = binaryReader(getColumn(table, outKey), spec.levels.outcomePositive, null);
  const g = groupReader(getColumn(table, clusterKey));
  const map = new Map();
  let x = 0;
  const res = eachRow(table, [outKey, clusterKey], (r) => {
    const v = rd(r);
    if (v === null) return { filter: outKey };
    const id = g(r);
    if (!map.has(id)) map.set(id, { size: 0, positives: 0 });
    const s = map.get(id);
    s.size++; s.positives += v; x += v;
    return undefined;
  });
  const list = [...map.values()];
  return { x, n: res.used, used: res.used, dropped: res.dropped, clusters: { sizes: list.map((s) => s.size), positives: list.map((s) => s.positives) } };
}

/** DEFF for the rows read: spec.cluster.deff when given, else the ICC of these rows. */
function deffFor(spec, clusters) {
  const given = spec.cluster?.deff ?? spec.input?.counts?.deff ?? spec.input?.params?.deff;
  if (given > 0) return { deff: given, from: 'given' };
  if (!clusters) return null;
  const y = [], g = [];
  clusters.sizes.forEach((m, i) => { for (let k = 0; k < m; k++) { y.push(k < clusters.positives[i] ? 1 : 0); g.push(i); } });
  const r = iccOneWay(y, g);
  if (r.icc === null) return { deff: null, reasonKey: r.reasonKey };
  const d = designEffect(r.icc, r.meanSize, r.n);
  return { deff: d.deff, icc: r.icc, nEff: d.nEff, k: r.k, meanSize: r.meanSize, from: 'data' };
}

/**
 * Apparent proportion x/n with the interval chosen, or the cluster route's interval.
 * @returns {{ values: Object<string, Value>, apparentCi: [number, number]|null, ciMethod: string }}
 */
function proportionWithRoute(spec, x, n, clusters, ciMethod, confLevel, name) {
  const values = {};
  const route = spec.cluster?.route ?? null;
  if (n === 0) {
    values[name] = nul('epi.undefined.noDenominator');
    return { values, apparentCi: null, ciMethod };
  }
  const p = x / n;
  if (route === 'deff') {
    const d = deffFor(spec, clusters);
    if (!d || d.deff == null) {
      values[name] = nul(d?.reasonKey || 'epi.route.deffNeedsValue');
      return { values, apparentCi: null, ciMethod: 'wald-deff' };
    }
    const se = Math.sqrt((p * (1 - p)) / n);
    const h = qnorm(1 - (1 - confLevel) / 2) * se * Math.sqrt(Math.max(1, d.deff));
    // A widened Wald interval around a low prevalence leaves 0..1 (2 of 100 with DEFF 2 gives a
    // lower bound of -1.9%): held at the edge with a note, as proportionCi does.
    const { ci, truncated } = clipCi01(p - h, p + h);
    values[name] = val(p, { ci, ciLevel: confLevel, ciMethod: 'wald-deff', se: se * Math.sqrt(Math.max(1, d.deff)), ...(truncated ? { noteKey: 'stats.note.ciTruncated' } : {}) });
    values.deff = val(d.deff);
    if (d.icc !== undefined) { values.icc = val(d.icc); values.nEff = val(d.nEff); values.clusters = val(d.k); values.meanSize = val(d.meanSize); }
    else values.nEff = val(n / d.deff);
    return { values, apparentCi: ci, apparentNoteKey: truncated ? 'stats.note.ciTruncated' : null, ciMethod: 'wald-deff' };
  }
  if (route === 'survey' && clusters) {
    // Design-based interval with the farms as sampling units (M2, measure's survey.js): the proportion
    // is the same x / n, only the interval changes; 'logit' is svyciprop's default.
    const positive = [], cluster = [];
    clusters.sizes.forEach((m, g) => { for (let k = 0; k < m; k++) { positive.push(k < clusters.positives[g]); cluster.push(g); } });
    const how = spec.options?.surveyCi === 'mean' ? 'mean' : 'logit';
    const s = surveyProportion(positive, cluster, { method: how, confLevel });
    const ciMethod2 = `survey-${how}`;
    values[name] = s.ci[0] === null
      ? val(p, { ci: [null, null], ciLevel: confLevel, ciMethod: ciMethod2, reasonKey: s.reasonKey })
      : val(p, { ci: s.ci, ciLevel: confLevel, ciMethod: ciMethod2, se: s.se });
    values.clusters = val(s.clusters);
    return { values, apparentCi: s.ci[0] === null ? null : s.ci, ciMethod: ciMethod2 };
  }
  if (route === 'aggregate' && clusters) {
    // Herd level: a cluster counts as positive when at least one animal in it is positive. When
    // run.js has already aggregated the table (the cluster column is gone), x and n are farms.
    const k = clusters.sizes.length;
    const kPos = clusters.positives.filter((v) => v > 0).length;
    const herd = proportionCi(kPos, k, ciMethod, confLevel);
    values[name] = { ...herd, value: k ? kPos / k : null, ciLevel: herd.ciLevel ?? confLevel, ciMethod: herd.ciMethod ?? ciMethod, noteKey: 'epi.note.herdLevel' };
    values.clustersPositive = val(kPos);
    values.clusters = val(k);
    return { values, apparentCi: herd.ci, ciMethod };
  }
  const v = proportionCi(x, n, ciMethod, confLevel);
  values[name] = { ...v, value: p, ciLevel: v.ciLevel ?? confLevel, ciMethod: v.ciMethod ?? ciMethod };
  return { values, apparentCi: v.ci, ciMethod };
}

/**
 * Implementation for 'freq.proportion'. Input: counts { x, n } or a dataset with roles.outcome and
 * levels.outcomePositive (plus the cluster column for a G1 route). Values: prevalence (the apparent
 * proportion), x, n; with 'deff' also deff, icc, nEff; with 'aggregate' the herd-level proportion (noteKey
 * 'epi.note.herdLevel'), clustersPositive and clusters.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runProportion(spec, table) {
  return guarded(() => {
    const o = spec.options || {};
    const confLevel = o.confLevel ?? 0.95;
    const r = readProportion(spec, table);
    const { values } = proportionWithRoute(spec, r.x, r.n, r.clusters, o.ciMethod ?? 'wilson', confLevel, 'prevalence');
    values.x = val(r.x);
    values.n = val(r.n);
    return { status: 'ok', values, tests: [], tables: [], used: r.used, dropped: r.dropped };
  });
}

/**
 * Implementation for 'freq.incidenceRisk'. Input: counts { newCases, startPopulation,
 * prevalentAtStart } (course 107004: animals already diseased at the start leave the denominator)
 * or { cases, atRisk }; or a dataset whose rows are the animals at risk (prevalent animals removed
 * by a filter step) with roles.outcome and levels.outcomePositive. Values: risk, cases, atRisk.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runIncidenceRisk(spec, table) {
  return guarded(() => {
    const o = spec.options || {};
    const confLevel = o.confLevel ?? 0.95;
    let x, n, used, dropped = [];
    if (spec.input?.kind === 'counts' || spec.input?.kind === 'params') {
      const c = spec.input.counts ?? spec.input.params ?? {};
      if (c.newCases !== undefined) {
        x = c.newCases;
        n = c.startPopulation - (c.prevalentAtStart ?? 0);
      } else { x = c.cases; n = c.atRisk; }
      if (!Number.isInteger(x) || !Number.isInteger(n) || x < 0 || x > n) return invalidOutput('epi.error.badCounts');
      used = n;
    } else {
      if (!table) return invalidOutput('epi.error.noData');
      const r = countPositive(table, spec.roles.outcome, spec.levels.outcomePositive);
      x = r.x; n = r.n; used = r.used; dropped = r.dropped;
    }
    const values = {};
    if (n === 0) values.risk = nul('epi.undefined.noDenominator');
    else {
      const v = proportionCi(x, n, o.ciMethod ?? 'wilson', confLevel);
      values.risk = { ...v, value: x / n, ciLevel: v.ciLevel ?? confLevel, ciMethod: v.ciMethod ?? (o.ciMethod ?? 'wilson') };
    }
    values.cases = val(x);
    values.atRisk = val(n);
    return { status: 'ok', values, tests: [], tables: [], used, dropped };
  });
}

/**
 * Implementation for 'freq.incidenceRate'. Input: counts { cases, animalTime, per? } (course 107006)
 * or a dataset with roles.outcome (events per row: a count, or 0/1 through levels.outcomePositive)
 * and roles.time (animal-time per row, in the unit the codebook names). Values: rate (per
 * options.per animal-time units, exact Poisson interval), cases, animalTime.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runIncidenceRate(spec, table) {
  return guarded(() => {
    const o = spec.options || {};
    const confLevel = o.confLevel ?? 0.95;
    const per = o.per ?? 1000;
    let cases, time, used, dropped = [];
    if (spec.input?.kind === 'counts' || spec.input?.kind === 'params') {
      const c = spec.input.counts ?? spec.input.params ?? {};
      cases = c.cases; time = c.animalTime;
      if (!Number.isInteger(cases) || cases < 0 || !(time >= 0)) return invalidOutput('epi.error.badCounts');
      used = null;
    } else {
      if (!table) return invalidOutput('epi.error.noData');
      const outKey = spec.roles.outcome, timeKey = spec.roles.time;
      if (!timeKey) return invalidOutput('epi.error.noTime');
      const outCol = getColumn(table, outKey);
      const tCol = getColumn(table, timeKey);
      const read = outCol.kind === 'category' ? binaryReader(outCol, spec.levels.outcomePositive, null) : (r) => outCol.values[r];
      cases = 0; time = 0;
      const res = eachRow(table, [outKey, timeKey], (r) => {
        const v = read(r);
        const tt = tCol.values[r];
        if (v === null || !(v >= 0)) return { filter: outKey };
        if (!(tt >= 0)) return { filter: timeKey };
        cases += v; time += tt;
        return undefined;
      });
      used = res.used; dropped = res.dropped;
    }
    const values = { cases: val(cases), animalTime: val(time) };
    if (!(time > 0)) values.rate = nul('epi.undefined.noAnimalTime');
    else {
      const ci = poissonRateCi(cases, time, confLevel);
      const bounds = ci.ci ?? ci;
      values.rate = val((cases / time) * per, { ci: [bounds[0] * per, bounds[1] * per], ciLevel: confLevel, ciMethod: 'exact-poisson' });
      values.per = val(per);
    }
    return { status: 'ok', values, tests: [], tables: [], used: used ?? cases, dropped };
  });
}

/**
 * True prevalence from an apparent one and the test's Se and Sp.
 * @returns {Object<string, Value>}  apparent, truePrevalence
 */
export function truePrevalence(x, n, se, sp, opts = {}) {
  const confLevel = opts.confLevel ?? 0.95;
  const values = {};
  if (!checkSeSp(se, sp)) return { truePrevalence: nul('epi.error.badSeSp') };
  if (n === 0) return { truePrevalence: nul('epi.undefined.noDenominator') };
  const ap = x / n;
  let apCi = opts.apparentCi ? clipCi01(opts.apparentCi[0], opts.apparentCi[1]).ci : null;
  let apNote = opts.apparentCi ? (opts.apparentNoteKey || (clipCi01(opts.apparentCi[0], opts.apparentCi[1]).truncated ? 'stats.note.ciTruncated' : null)) : null;
  const method = opts.apparentCiMethod ?? 'wilson';
  if (!apCi) {
    const v = proportionCi(x, n, method, confLevel);
    apCi = v.ci;
    apNote = v.noteKey || null;
  }
  values.apparent = val(ap, { ci: apCi, ciLevel: confLevel, ciMethod: opts.apparentLabel ?? method, ...(apNote ? { noteKey: apNote } : {}) });
  const tp = roganGladen(ap, se, sp);
  if (tp === null) {
    values.truePrevalence = nul('epi.undefined.seSpUninformative');
    return values;
  }
  const lo = roganGladen(apCi[0], se, sp), hi = roganGladen(apCi[1], se, sp);
  const clip = opts.clip ?? true;
  const cl = (v) => Math.min(1, Math.max(0, v));
  const clipped = clip && (tp < 0 || tp > 1 || lo < 0 || hi > 1);
  values.truePrevalence = val(clip ? cl(tp) : tp, {
    ci: clip ? [cl(lo), cl(hi)] : [lo, hi], ciLevel: confLevel, ciMethod: `rogan-gladen-${opts.apparentLabel ?? method}`,
    ...(clipped ? { noteKey: 'epi.note.truePrevalenceClipped' } : {}),
  });
  return values;
}

/**
 * Implementation for 'freq.truePrevalence'. Se and Sp come from options.se and options.sp (numbers
 * 0..1, runtime spec.js ALLOWED), or from counts/params { x, n, se, sp }. The
 * apparent interval is options.apparentCiMethod, or the DEFF-widened Wald interval on the 'deff'
 * route, transformed through Rogan-Gladen.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runTruePrevalence(spec, table) {
  return guarded(() => {
    const o = spec.options || {};
    const confLevel = o.confLevel ?? 0.95;
    const c = spec.input?.counts ?? spec.input?.params ?? {};
    const se = o.se ?? o.Se ?? c.se ?? c.Se, sp = o.sp ?? o.Sp ?? c.sp ?? c.Sp;
    if (!checkSeSp(se, sp)) return invalidOutput('epi.error.badSeSp');
    const r = readProportion(spec, table);
    const method = o.apparentCiMethod ?? 'wilson';
    const pr = proportionWithRoute(spec, r.x, r.n, r.clusters, method, confLevel, 'apparent');
    let values;
    if (spec.cluster?.route === 'deff') {
      if (!pr.apparentCi) return { status: 'ok', values: { ...pr.values, truePrevalence: nul(pr.values.apparent?.reasonKey || 'epi.route.deffNeedsValue') }, tests: [], tables: [], used: r.used, dropped: r.dropped };
      values = { ...pr.values, ...truePrevalence(r.x, r.n, se, sp, { confLevel, apparentCi: pr.apparentCi, apparentNoteKey: pr.apparentNoteKey, apparentLabel: 'wald-deff', clip: o.clip }) };
    } else {
      values = truePrevalence(r.x, r.n, se, sp, { confLevel, apparentCiMethod: method, clip: o.clip });
    }
    values.Se = val(se);
    values.Sp = val(sp);
    values.x = val(r.x);
    values.n = val(r.n);
    return { status: 'ok', values, tests: [], tables: [], used: r.used, dropped: r.dropped };
  });
}
