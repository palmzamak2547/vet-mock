// R parity: the Tier A engine against R 4.6.0 (webR 0.6.0) on every case of every fixture file
// [M1-DESIGN.md 7 general rules, 13.2, 13.3]. OWNER: rparity role.
//
// Tolerances (each case names its kind in `tol`; `iterativeValues`, `closedValues` and `tolByValue`
// override single values): closed forms 1e-10 relative, iterative fits 1e-6 relative, values R finds
// with uniroot |js - R| <= 2 * 1.220703125e-4 * max(1, |R|) on the scale R reports. A value R returns
// as NA must come back null; Inf must come back Infinity.
//
// Every engine module is implemented, so nothing skips: a module that throws (including a stub's
// "not implemented") fails its cases, and any number that comes back and disagrees fails.
// RPARITY_INJECT=1 shifts every nonzero finite R value outside its tolerance (closed x (1 + 1e-6),
// iterative x (1 + 1e-5), uniroot x (1 + 1e-2)); every case that compares such a number must then fail (the injected-wrong-value proof, M1-DESIGN.md 7).
//
// Fixture files (paths listed literally so scripts/regen-verified.mjs sees them):
//   tests/fixtures/r/out/dist.json         tests/fixtures/r/out/rootfind.json
//   tests/fixtures/r/out/descriptive.json  tests/fixtures/r/out/proportion.json
//   tests/fixtures/r/out/ttest.json        tests/fixtures/r/out/anova.json
//   tests/fixtures/r/out/padjust.json      tests/fixtures/r/out/rank.json
//   tests/fixtures/r/out/correlation.json  tests/fixtures/r/out/ols.json
//   tests/fixtures/r/out/chisq.json        tests/fixtures/r/out/fisher.json
//   tests/fixtures/r/out/mcnemar.json      tests/fixtures/r/out/twobytwo.json
//   tests/fixtures/r/out/mh.json           tests/fixtures/r/out/frequency.json
//   tests/fixtures/r/out/diagnostic.json   tests/fixtures/r/out/kappa.json
//   tests/fixtures/r/out/cluster.json      tests/fixtures/r/out/samplesize.json
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import * as dist from '../../src/lib/stats/dist.js';
import * as rootfind from '../../src/lib/stats/rootfind.js';
import * as descriptive from '../../src/lib/stats/descriptive.js';
import * as proportion from '../../src/lib/stats/proportion.js';
import * as ttest from '../../src/lib/stats/ttest.js';
import * as anova from '../../src/lib/stats/anova.js';
import * as padjust from '../../src/lib/stats/padjust.js';
import * as rank from '../../src/lib/stats/rank.js';
import * as correlation from '../../src/lib/stats/correlation.js';
import * as ols from '../../src/lib/stats/ols.js';
import * as chisq from '../../src/lib/stats/chisq.js';
import * as fisher from '../../src/lib/stats/fisher.js';
import * as mcnemar from '../../src/lib/stats/mcnemar.js';
import * as twobytwo from '../../src/lib/epi/twobytwo.js';
import * as mh from '../../src/lib/epi/mh.js';
import * as frequency from '../../src/lib/epi/frequency.js';
import * as diagnostic from '../../src/lib/epi/diagnostic.js';
import * as kappaMod from '../../src/lib/epi/kappa.js';
import * as cluster from '../../src/lib/epi/cluster.js';
import * as samplesize from '../../src/lib/epi/samplesize.js';

const ROOT = new URL('../fixtures/', import.meta.url);
const read = (rel) => JSON.parse(readFileSync(fileURLToPath(new URL(rel, ROOT)), 'utf8'));
const DATA = read('crosscheck/scipy-crosscheck.json').datasets;
const INJECT = process.env.RPARITY_INJECT === '1';

const REL = { closed: 1e-10, iterative: 1e-6 };
const UNIROOT_TOL = 1.220703125e-4;
const INJECT_SHIFT = { closed: 1e-6, iterative: 1e-5, uniroot: 1e-2 };

function revive(v) {
  if (v === 'Infinity') return Infinity;
  if (v === '-Infinity') return -Infinity;
  if (v === 'NaN') return NaN;
  return v;
}

/** Engine values are numbers or Value objects ({ value, ci, se }). */
function plain(v) {
  if (v && typeof v === 'object' && !Array.isArray(v) && 'value' in v) return v.value;
  return v;
}

/** @returns {string|null} null when within tolerance, else the reason */
export function mismatch(got, want, kind) {
  want = revive(want);
  got = plain(got);
  // The injected shift sits outside each kind's tolerance: 1e-6 for closed forms (the design's
  // 1e-6 relative), 1e-5 for iterative fits (1e-6 would sit on their tolerance) and 1e-2 for uniroot.
  if (INJECT && typeof want === 'number' && Number.isFinite(want) && want !== 0) want *= 1 + (INJECT_SHIFT[kind] ?? 1e-6);
  if (want === null) return got === null ? null : `expected null (R's NA), got ${got}`;
  if (typeof got !== 'number') return `expected ${want}, got ${JSON.stringify(got)}`;
  if (Number.isNaN(want)) return Number.isNaN(got) ? null : `expected NaN, got ${got}`;
  if (!Number.isFinite(want)) return got === want ? null : `expected ${want}, got ${got}`;
  const err = Math.abs(got - want);
  if (kind === 'uniroot') {
    const lim = 2 * UNIROOT_TOL * Math.max(1, Math.abs(want));
    return err <= lim ? null : `got ${got}, R ${want}: |diff| ${err.toExponential(3)} > ${lim.toExponential(3)} (uniroot tolerance)`;
  }
  const rel = REL[kind];
  if (rel === undefined) return `unknown tolerance kind ${kind}`;
  if (want === 0) return Math.abs(got) <= 1e-15 ? null : `expected 0, got ${got}`;
  const r = err / Math.abs(want);
  return r <= rel ? null : `got ${got}, R ${want}: relative error ${r.toExponential(3)} > ${rel}`;
}

/**
 * Runs one case: `fn` returns a list of [label, got, want, kind?]; kind defaults to the case's tol.
 * Any throw fails the case with the fixture named in the message.
 */
function runCase(t, file, id, c, fn) {
  return t.test(`${file}: ${id}`, (tt) => {
    let rows;
    try {
      rows = fn(c);
    } catch (e) {
      throw new Error(`R 4.6.0 pin ${file}.json case ${id}: the engine threw: ${e && e.message}`, { cause: e });
    }
    assert.ok(Array.isArray(rows) && rows.length > 0, `${file} ${id}: the adapter compared nothing`);
    const fails = [];
    for (const [label, got, want, kind] of rows) {
      const m = mismatch(got, want, kind || c.tol);
      if (m) fails.push(`${label}: ${m}`);
    }
    assert.equal(fails.length, 0, `R 4.6.0 pin ${file}.json case ${id} (${c.call}):\n  ${fails.join('\n  ')}`);
  });
}

/** Per-value kind: iterativeValues / closedValues / tolByValue override the case's tol. */
function kindOf(c, key) {
  if (c.tolByValue && c.tolByValue[key]) return c.tolByValue[key];
  const iv = c.iterativeValues || [];
  if (iv.includes(key) || iv.some((k) => key.startsWith(`${k}.`))) return 'iterative';
  if ((c.closedValues || []).includes(key)) return 'closed';
  return c.tol;
}

const ciRows = (label, got, want, kind) => [[`${label} lower`, got?.[0], want[0], kind], [`${label} upper`, got?.[1], want[1], kind]];
const ds = (ref) => {
  const m = /^(\w+)\$(\w+)$/.exec(ref);
  if (!m) throw new Error(`unknown dataset reference ${ref}`);
  const v = DATA[m[1]][m[2]];
  if (!v) throw new Error(`no dataset ${ref}`);
  return v;
};
const groupsThree = () => [DATA.three.A, DATA.three.B, DATA.three.C];

function load(name) {
  const doc = read(`r/out/${name}.json`);
  assert.equal(doc._fixture.family, 'r-4.6.0');
  assert.match(doc._meta.r, /^R version 4\.6\.0/);
  return doc;
}

// ------------------------------------------------------------------------------------------- stats

test('R parity: dist', async (t) => {
  const { cases } = load('dist');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'dist', id, c, () => {
      assert.equal(typeof dist[c.fn], 'function', `dist.${c.fn} is not exported`);
      return [[c.fn, dist[c.fn](...c.args), c.values.value]];
    });
  }
});

test('R parity: rootfind', async (t) => {
  const { cases } = load('rootfind');
  const F = { cubic: (x) => x ** 3 - x - 1, cubicTight: (x) => x ** 3 - x - 1, cos: (x) => Math.cos(x) - x, exp: (x) => Math.exp(x) - 5 };
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'rootfind', id, c, () => {
      const r = rootfind.uniroot(F[id], c.interval, { tol: c.tolUsed });
      return [['root', r.root, c.values.root], ['iter', r.iter, c.values.iter], ['estimPrec', r.estimPrec, c.values.estimPrec]];
    });
  }
});

test('R parity: descriptive', async (t) => {
  const { cases } = load('descriptive');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'descriptive', id, c, () => {
      const v = c.values;
      if (id === 'quantiles.tails') {
        const s = [...DATA.quantiles].sort((a, b) => a - b);
        return v.probs.flatMap((p, i) => [
          [`type 7 q(${p})`, descriptive.quantile(s, p, 7), v.type7[i]],
          [`type 6 q(${p})`, descriptive.quantile(s, p, 6), v.type6[i]],
        ]);
      }
      const s7 = descriptive.summary(c.x, { quantileType: 7 });
      const s6 = descriptive.summary(c.x, { quantileType: 6 });
      return [
        ['n', s7.n, v.n], ['mean', s7.mean, v.mean], ['sd', s7.sd, v.sd], ['se', s7.se, v.se], ['min', s7.min, v.min], ['max', s7.max, v.max],
        ['q1 type 7', s7.q1, v.q1Type7], ['median type 7', s7.median, v.medianType7], ['q3 type 7', s7.q3, v.q3Type7],
        ['q1 type 6', s6.q1, v.q1Type6], ['median type 6', s6.median, v.medianType6], ['q3 type 6', s6.q3, v.q3Type6],
      ];
    });
  }
});

test('R parity: proportion', async (t) => {
  const { cases } = load('proportion');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'proportion', id, c, () => {
      const v = c.values;
      if (id.startsWith('rate ')) {
        const r = proportion.poissonRateCi(c.count, c.time, c.confLevel);
        return [['rate', r, v.rate], ...ciRows('exact Poisson', r.ci, v.ci)];
      }
      const rows = [];
      for (const [key, method] of [['wilson', 'wilson'], ['exact', 'exact'], ['wald', 'wald'], ['agrestiCoull', 'agresti-coull']]) {
        if (!v[key]) continue;
        const r = proportion.proportionCi(c.x, c.n, method, c.confLevel);
        if (v.p !== undefined) rows.push([`${method} estimate`, r, v.p]);
        // the engine holds Wald and Agresti-Coull bounds inside 0..1 (stats.note.ciTruncated); R prints the formula
        const want = key === 'wald' || key === 'agrestiCoull' ? v[key].map((w) => Math.max(0, Math.min(1, w))) : v[key];
        rows.push(...ciRows(method, r.ci, want));
      }
      return rows;
    });
  }
});

test('R parity: ttest', async (t) => {
  const { cases } = load('ttest');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'ttest', id, c, () => {
      const v = c.values;
      const r = ttest.tTest(ds(c.x), c.y ? ds(c.y) : null, { variant: c.variant, mu: c.mu, alternative: c.alternative, confLevel: c.confLevel });
      return [['t', r.t, v.t], ['df', r.df, v.df], ['p', r.p, v.p], ['estimate', r.estimate, v.estimate], ['se', r.se, v.se], ...ciRows('CI', r.ci, v.ci)];
    });
  }
});

test('R parity: anova', async (t) => {
  const { cases } = load('anova');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'anova', id, c, () => {
      const v = c.values;
      if (id === 'anova1.three') {
        const r = anova.anova1(groupsThree());
        return [['F', r.F, v.F], ['df1', r.df1, v.df1], ['df2', r.df2, v.df2], ['p', r.p, v.p], ['SS between', r.ssBetween, v.ssBetween],
          ['SS within', r.ssWithin, v.ssWithin], ['MS within', r.msWithin, v.msWithin],
          ...v.means.map((m, i) => [`mean ${i}`, r.means[i], m]), ...v.ns.map((m, i) => [`n ${i}`, r.ns[i], m])];
      }
      if (id === 'anova1.four') {
        const r = anova.anova1(Object.values(c.groups));
        return [['F', r.F, v.F], ['df1', r.df1, v.df1], ['df2', r.df2, v.df2], ['p', r.p, v.p]];
      }
      if (id.startsWith('tukey.')) {
        const r = anova.tukeyHsd(groupsThree(), ['A', 'B', 'C'], c.confLevel);
        return v.pairs.flatMap((w) => {
          const g = r.find((x) => x.pair === w.pair);
          assert.ok(g, `tukeyHsd returned no pair ${w.pair} (pairs: ${r.map((x) => x.pair).join(', ')})`);
          // The bound is diff -/+ qtukey * SE / sqrt(2). R finds qtukey by a secant search, so the
          // iterative tolerance belongs to the half-width; a bound near 0 (C-B upper at 90% is 0.027)
          // would turn a 1e-8 half-width difference into a 1e-6 relative one on the bound.
          return [[`${w.pair} diff`, g.diff, w.diff, 'closed'], [`${w.pair} p`, g.p, w.p],
            [`${w.pair} CI lower half-width`, g.ci && g.diff - g.ci[0], w.diff - w.ci[0]],
            [`${w.pair} CI upper half-width`, g.ci && g.ci[1] - g.diff, w.ci[1] - w.diff]];
        });
      }
      if (id.startsWith('pairwiseT.')) {
        const r = anova.pairwiseT(groupsThree(), ['A', 'B', 'C'], c.method);
        return Object.entries(v).map(([pair, want]) => {
          const g = r.find((x) => x.pair === pair);
          assert.ok(g, `pairwiseT returned no pair ${pair} (pairs: ${r.map((x) => x.pair).join(', ')})`);
          return [`${pair} adjusted p`, g.pAdjusted, want];
        });
      }
      throw new Error(`no adapter for anova case ${id}`);
    });
  }
});

test('R parity: padjust', async (t) => {
  const { cases } = load('padjust');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'padjust', id, c, () => {
      const p = c.p.map(revive);
      const h = padjust.pAdjust(p, 'holm');
      const b = padjust.pAdjust(p, 'bonferroni');
      return [...c.values.holm.map((w, i) => [`holm ${i}`, h[i], w]), ...c.values.bonferroni.map((w, i) => [`bonferroni ${i}`, b[i], w])];
    });
  }
});

test('R parity: rank', async (t) => {
  const { cases } = load('rank');
  // how each case was called in R, in the engine's option names
  const OPTS = {
    'mannWhitney.exact': { exact: 'auto', continuityCorrection: true },
    'mannWhitney.normalTiesCC': { exact: 'normal', continuityCorrection: true },
    'mannWhitney.autoTies': { exact: 'auto', continuityCorrection: true },
    'mannWhitney.normalNoCC': { exact: 'normal', continuityCorrection: false },
    'mannWhitney.exact.less': { exact: 'auto', continuityCorrection: true, alternative: 'less' },
    'signedRank.exact': { exact: 'auto', continuityCorrection: true },
    'signedRank.normal': { exact: 'normal', continuityCorrection: true },
    'signedRank.zerosTies': { exact: 'auto', continuityCorrection: true },
    'signedRank.zerosTies.normal': { exact: 'normal', continuityCorrection: true },
  };
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'rank', id, c, () => {
      const v = c.values;
      if (id === 'kruskalWallis.three') {
        const r = rank.kruskalWallis(groupsThree());
        return [['H', r.H, v.H], ['df', r.df, v.df], ['p', r.p, v.p]];
      }
      const o = OPTS[id];
      assert.ok(o, `no adapter for rank case ${id}`);
      if (id.startsWith('mannWhitney')) {
        const r = rank.rankSum(ds(c.x), ds(c.y), o);
        return [['W', r.W, v.statistic], ['p', r.p, v.p]];
      }
      const d = c.d ? c.d : ds(c.x).map((x, i) => x - ds(c.y)[i]);
      const r = rank.signedRank(d, o);
      return [['V', r.V, v.statistic], ['p', r.p, v.p]];
    });
  }
});

test('R parity: correlation', async (t) => {
  const { cases } = load('correlation');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'correlation', id, c, () => {
      const v = c.values;
      const x = c.data === 'corr' ? DATA.corr.x : ds(c.x);
      const y = c.data === 'corr' ? DATA.corr.y : c.y;
      if (id.startsWith('pearson')) {
        const r = correlation.pearson(x, y, { confLevel: c.confLevel ?? 0.95 });
        return [['r', r.r, v.r], ['t', r.t, v.t], ['df', r.df, v.df], ['p', r.p, v.p], ...ciRows('Fisher z CI', r.ci, v.ci)];
      }
      const r = correlation.spearman(x, y, {});
      return [['rho', r.rho, v.rho], ['S', r.S, v.S], ['p', r.p, v.p]];
    });
  }
});

test('R parity: ols', async (t) => {
  const { cases } = load('ols');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'ols', id, c, () => {
      const v = c.values;
      let X; let y; let opts = {};
      if (id === 'simple.corr') { X = DATA.corr.x.map((x) => [1, x]); y = DATA.corr.y; }
      else if (id === 'noIntercept.corr') { X = DATA.corr.x.map((x) => [x]); y = DATA.corr.y; opts = { intercept: false }; }
      else if (id === 'largeScaleX') { X = c.x.map((x) => [1, x]); y = c.y; }
      else if (id === 'oneway.three') {
        const g = groupsThree();
        X = g.flatMap((grp, k) => grp.map(() => [1, k === 1 ? 1 : 0, k === 2 ? 1 : 0]));
        y = g.flat();
      } else throw new Error(`no adapter for ols case ${id}`);
      const r = ols.olsQr(X, y, opts);
      const rows = [];
      v.coef.forEach((w, i) => rows.push([`coef ${v.terms[i]}`, r.coef[i], w], [`se ${v.terms[i]}`, r.se[i], v.se[i]], [`t ${v.terms[i]}`, r.t[i], v.t[i]], [`p ${v.terms[i]}`, r.p[i], v.p[i]]));
      rows.push(['df', r.df, v.df], ['sigma', r.sigma, v.sigma], ['R2', r.r2, v.r2], ['adjusted R2', r.adjR2, v.adjR2], ['F', r.F, v.F], ['p of F', r.pF, v.pF]);
      return rows;
    });
  }
});

test('R parity: chisq', async (t) => {
  const { cases } = load('chisq');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'chisq', id, c, () => {
      const v = c.values;
      if (id.startsWith('trend')) {
        const r = chisq.trendTest(c.x, c.n, c.scores);
        return [['X2', r.X2, v.X2], ['df', r.df, v.df], ['p', r.p, v.p]];
      }
      const r = chisq.chisqTest(c.table, { yates: c.yates });
      const rows = [['X2', r.X2, v.X2], ['df', r.df, v.df], ['p', r.p, v.p], ['smallest expected', r.minExpected, v.minExpected]];
      v.expected.forEach((row, i) => row.forEach((w, j) => rows.push([`expected[${i}][${j}]`, r.expected?.[i]?.[j], w])));
      return rows;
    });
  }
});

test('R parity: fisher', async (t) => {
  const { cases } = load('fisher');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'fisher', id, c, () => {
      const v = c.values;
      const r = fisher.fisher2x2(c.table, { alternative: c.alternative, confLevel: c.confLevel });
      return [['p', r.p, v.p, kindOf(c, 'p')], ['conditional MLE', r.estimate, v.estimate], ...ciRows('exact CI', r.ci, v.ci)];
    });
  }
});

test('R parity: mcnemar', async (t) => {
  const { cases } = load('mcnemar');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'mcnemar', id, c, () => {
      const v = c.values;
      // option names as the design's options table (M1-DESIGN.md 10.1: continuityCorrection, exact)
      const a = mcnemar.mcnemar(c.b, c.c, { continuityCorrection: true });
      const u = mcnemar.mcnemar(c.b, c.c, { continuityCorrection: false });
      const e = mcnemar.mcnemar(c.b, c.c, { exact: true });
      return [['corrected X2', a.X2, v.corrected.X2], ['corrected p', a.p, v.corrected.p],
        ['uncorrected X2', u.X2, v.uncorrected.X2], ['uncorrected p', u.p, v.uncorrected.p], ['exact p', e.p, v.exact.p]];
    });
  }
});

// --------------------------------------------------------------------------------------------- epi

test('R parity: twobytwo', async (t) => {
  const { cases } = load('twobytwo');
  const MEASURES = ['RR', 'OR', 'RD', 'AFe', 'AFp', 'AFeEst', 'AFpEst'];
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'twobytwo', id, c, () => {
      const v = c.values;
      const base = { measures: MEASURES, zeroCell: c.zeroCell || 'none', confLevel: c.confLevel };
      const w = twobytwo.twoByTwo(c.table, { ...base, orCi: 'woolf', rrCi: 'wald-log', rdCi: 'wald' });
      const rows = [
        ['risk exposed', w.p1, v.risk1], ['risk reference', w.p0, v.risk0],
        ['RR', w.RR, v.RR.value], ...ciRows('RR Wald log', w.RR?.ci, v.RR.ci),
        ['OR', w.OR, v.OR.value], ...ciRows('OR Woolf', w.OR?.ci, v.OR.ci),
        ['RD', w.RD, v.RD.value], ...ciRows('RD Wald', w.RD?.ci, v.RD.ci),
        ['AFe', w.AFe, v.AFe], ['AFp', w.AFp, v.AFp], ['AFe from OR', w.AFeEst, v.AFeFromOR], ['AFp from OR', w.AFpEst, v.AFpFromOR],
      ];
      if (w.RR?.se !== undefined && w.RR?.se !== null) rows.push(['SE log RR', w.RR.se, v.RR.se]);
      if (w.OR?.se !== undefined && w.OR?.se !== null) rows.push(['SE log OR', w.OR.se, v.OR.se]);
      if (w.RD?.se !== undefined && w.RD?.se !== null) rows.push(['SE RD', w.RD.se, v.RD.se]);
      if (v.RR.score || v.RD.newcombe || c.exactOR) {
        const s = twobytwo.twoByTwo(c.table, { ...base, orCi: 'exact', rrCi: 'score', rdCi: 'newcombe' });
        if (v.RR.score) rows.push(...ciRows('RR score (Koopman)', s.RR?.ci, v.RR.score, kindOf(c, 'RR.score')));
        if (v.RD.newcombe) rows.push(...ciRows('RD Newcombe', s.RD?.ci, v.RD.newcombe));
        if (c.exactOR) rows.push(['OR conditional MLE', s.OR, c.exactOR.estimate, 'uniroot'], ...ciRows('OR exact', s.OR?.ci, c.exactOR.ci, 'uniroot'));
      }
      return rows;
    });
  }
});

test('R parity: mh', async (t) => {
  const { cases } = load('mh');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'mh', id, c, () => {
      const v = c.values;
      const o = mh.mantelHaenszel(c.strata, { measure: 'OR', cmhContinuity: true, confLevel: c.confLevel, homogeneity: 'breslow-day-tarone' });
      const o0 = mh.mantelHaenszel(c.strata, { measure: 'OR', cmhContinuity: false, confLevel: c.confLevel, homogeneity: 'breslow-day-tarone' });
      const r = mh.mantelHaenszel(c.strata, { measure: 'RR', cmhContinuity: true, confLevel: c.confLevel, homogeneity: 'woolf' });
      const wo = mh.mantelHaenszel(c.strata, { measure: 'OR', homogeneity: 'woolf' });
      // The same strata summed: 1 when the engine names exactly R's set (0-based indexes), else 0.
      const sameSet = (got, want) => (JSON.stringify(got) === JSON.stringify(want) ? 1 : 0);
      // epiR's epi.2by2 on the strata with a positive in both groups (wOR.homog after its 0.5 on every cell).
      const e = v.epiR;
      const sub = e.strata.map((i) => c.strata[i]);
      const half = sub.map(([[a, b], [cc, d]]) => [[a + 0.5, b + 0.5], [cc + 0.5, d + 0.5]]);
      const ew = mh.woolfHomogeneity(sub, 'RR');
      const eo = mh.woolfHomogeneity(half, 'OR');
      const orSub = mh.mantelHaenszel(sub, { measure: 'OR' }).estimate.value;
      const eb = mh.breslowDay(sub, orSub);
      return [
        ['informative strata', o.informative, v.informative], ['skipped strata', o.skipped, v.skipped],
        ['OR_MH', o.estimate, v.OR.value], ...ciRows('OR_MH RGB', o.estimate?.ci, v.OR.ci),
        ['CMH corrected', o.cmh.X2, v.cmh.X2], ['CMH corrected p', o.cmh.p, v.cmh.p],
        ['CMH uncorrected', o0.cmh.X2, v.cmhNoCorrection.X2], ['CMH uncorrected p', o0.cmh.p, v.cmhNoCorrection.p],
        ['Breslow-Day', o.homogeneity.X2, v.breslowDay.X2, 'iterative'], ['Breslow-Day p', o.homogeneity.p, v.breslowDay.p, 'iterative'],
        ['Breslow-Day df', o.homogeneity.df, v.breslowDay.df], ['Breslow-Day strata', sameSet(o.homogeneity.included, v.breslowDay.strata), 1],
        ['Tarone', o.homogeneity.tarone?.X2, v.tarone.X2, 'iterative'], ['Tarone p', o.homogeneity.tarone?.p, v.tarone.p, 'iterative'],
        ['RR_MH', r.estimate, v.RR.value], ...ciRows('RR_MH Greenland-Robins', r.estimate?.ci, v.RR.ci),
        ['Woolf homogeneity (RR)', r.homogeneity.X2, v.woolfRR.X2], ['Woolf homogeneity df', r.homogeneity.df, v.woolfRR.df], ['Woolf homogeneity p', r.homogeneity.p, v.woolfRR.p],
        ['Woolf RR strata', sameSet(r.homogeneity.included, v.woolfRR.strata), 1],
        ['Woolf homogeneity (OR)', wo.homogeneity.X2, v.woolfOR.X2], ['Woolf OR df', wo.homogeneity.df, v.woolfOR.df], ['Woolf OR p', wo.homogeneity.p, v.woolfOR.p],
        ['Woolf OR strata', sameSet(wo.homogeneity.included, v.woolfOR.strata), 1],
        ['epiR wRR.homog', ew.X2, e['wRR.homog'].X2], ['epiR wRR.homog df', ew.df, e['wRR.homog'].df], ['epiR wRR.homog p', ew.p, e['wRR.homog'].p],
        ['epiR wOR.homog (0.5 added)', eo.X2, e['wOR.homog'].X2], ['epiR wOR.homog p', eo.p, e['wOR.homog'].p],
        ['epiR OR_MH', orSub, e['bOR.homog'].ORmh], ['epiR bOR.homog', eb.X2, e['bOR.homog'].X2, 'closed'], ['epiR bOR.homog df', eb.df, e['bOR.homog'].df], ['epiR bOR.homog p', eb.p, e['bOR.homog'].p, 'closed'],
      ];
    });
  }
});

test('R parity: frequency', async (t) => {
  const { cases } = load('frequency');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'frequency', id, c, () => {
      const v = c.values;
      if ('wilson' in v && 'exact' in v && 'estimate' in v) {
        const w = proportion.proportionCi(c.x, c.n, 'wilson', 0.95);
        const e = proportion.proportionCi(c.x, c.n, 'exact', 0.95);
        return [['estimate', w, v.estimate], ...ciRows('Wilson', w.ci, v.wilson), ...ciRows('exact', e.ci, v.exact)];
      }
      if (id.startsWith('incidenceRate')) {
        const r = proportion.poissonRateCi(c.cases, c.time, 0.95);
        return [['rate', r, v.rate], ...ciRows('exact Poisson', r.ci, v.ci)];
      }
      if (id === 'truePrevalence.closedForm' || id === 'truePrevalence.undefined') {
        return [['Rogan-Gladen', frequency.roganGladen(c.ap, c.se, c.sp), v.tp]];
      }
      if (id === 'truePrevalence.clipped') {
        return [['Rogan-Gladen (unclipped)', frequency.roganGladen(c.x / c.n, c.se, c.sp), v.tp],
          ['transformed lower', frequency.roganGladen(v.wilson[0], c.se, c.sp), v.transformed[0]],
          ['transformed upper', frequency.roganGladen(v.wilson[1], c.se, c.sp), v.transformed[1]]];
      }
      if (id === 'truePrevalence.serosurvey') {
        const se = Math.sqrt(v.ap * (1 - v.ap) / c.n);
        const wd = cluster.deffWaldCi(v.ap, se, c.deff, 0.95, 'identity');
        return [['apparent', c.x / c.n, v.ap], ['Rogan-Gladen', frequency.roganGladen(v.ap, c.se, c.sp), v.tp], ...ciRows('DEFF-widened Wald', wd, v.waldDeff),
          ['transformed lower', frequency.roganGladen(wd[0], c.se, c.sp), v.tpCi[0]], ['transformed upper', frequency.roganGladen(wd[1], c.se, c.sp), v.tpCi[1]]];
      }
      throw new Error(`no adapter for frequency case ${id}`);
    });
  }
});

test('R parity: diagnostic', async (t) => {
  const { cases } = load('diagnostic');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'diagnostic', id, c, () => {
      const v = c.values;
      const w = diagnostic.diagnosticAccuracy(c.counts, { ciMethod: 'wilson', confLevel: 0.95 });
      const e = diagnostic.diagnosticAccuracy(c.counts, { ciMethod: 'exact', confLevel: 0.95 });
      const rows = [];
      for (const k of ['Se', 'Sp', 'PPV', 'NPV', 'accuracy', 'prevalence']) {
        rows.push([k, w[k], v[k].value], ...ciRows(`${k} Wilson`, w[k]?.ci, v[k].wilson), ...ciRows(`${k} exact`, e[k]?.ci, v[k].exact));
      }
      rows.push(['LR+', w.LRpos, v.LRpos.value], ...ciRows('LR+ log method', w.LRpos?.ci, v.LRpos.ci), ['LR-', w.LRneg, v.LRneg.value], ...ciRows('LR- log method', w.LRneg?.ci, v.LRneg.ci));
      return rows;
    });
  }
});

test('R parity: kappa', async (t) => {
  const { cases } = load('kappa');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'kappa', id, c, () => {
      const v = c.values;
      if (id === 'threeLevel') {
        const n = kappaMod.kappa(c.table, { weights: 'none' });
        const l = kappaMod.kappa(c.table, { weights: 'linear' });
        const q = kappaMod.kappa(c.table, { weights: 'quadratic' });
        return [['po', n.po, v.po], ['pe', n.pe, v.pe], ['kappa', n.kappa, v.kappa], ['linear weighted kappa', l.kappa, v.kappaLinear],
          ['quadratic weighted kappa', q.kappa, v.kappaQuadratic], ['pe linear', l.pe, v.formula.peLinear], ['pe quadratic', q.pe, v.formula.peQuadratic]];
      }
      if (id === 'twoByTwo') {
        const k = kappaMod.kappa(c.table, { weights: 'none' });
        // M1-DESIGN.md 7.19 prints both indices as magnitudes; epiR's signed prevalence index is -0.05
        return [['po', k.po, v.po], ['kappa', k.kappa, v.kappa], ['PABAK', k.PABAK, v.pabak],
          ['prevalence index', k.prevalenceIndex, v.prevalenceIndexAbs], ['bias index', k.biasIndex, v.biasIndexAbs]];
      }
      if (id === 'percentAgreement.course107027') {
        const table = [[c.agree, 0], [0, 0]];
        table[1][0] = c.n - c.agree;
        return [['po', kappaMod.kappa(table, { weights: 'none' }).po, v.po]];
      }
      throw new Error(`no adapter for kappa case ${id}`);
    });
  }
});

test('R parity: cluster', async (t) => {
  const { cases } = load('cluster');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'cluster', id, c, () => {
      const v = c.values;
      if (id === 'deff.course107039') return [['DEFF', cluster.designEffect(c.icc, c.m, 1).deff, v.deff]];
      let r;
      if (id === 'continuous.fourFarms') {
        const y = Object.values(c.clusters).flat();
        const g = Object.entries(c.clusters).flatMap(([k, a]) => a.map(() => k));
        r = cluster.iccOneWay(y, g);
      } else if (id === 'serosurvey.binary') {
        r = cluster.iccFromCounts(c.sizes, c.positives);
      } else throw new Error(`no adapter for cluster case ${id}`);
      const de = cluster.designEffect(r.icc, r.meanSize, r.n);
      const rows = [['MSB', r.msb, v.msb], ['MSW', r.msw, v.msw], ['n0', r.n0, v.n0], ['clusters', r.k, v.k], ['n', r.n, v.n],
        ['mean size', r.meanSize, v.meanSize], ['ICC', r.icc, v.icc], ['DEFF', de.deff, v.deff], ['effective n', de.nEff, v.nEff],
        ['DEFF (n0 option)', cluster.designEffect(r.icc, r.n0, r.n).deff, v.deffN0]];
      if (id === 'serosurvey.binary') {
        const p = v.prevalence;
        rows.push(...ciRows('prevalence, DEFF-widened Wald', cluster.deffWaldCi(p, Math.sqrt(p * (1 - p) / v.n), v.deff, 0.95, 'identity'), v.waldDeff));
        const [[a, b], [cc, d]] = [[116, 364], [27, 209]];
        const seLog = Math.sqrt(1 / a - 1 / (a + b) + 1 / cc - 1 / (cc + d));
        rows.push(...ciRows('PR, DEFF-widened Wald on the log scale', cluster.deffWaldCi(v.pr, seLog, v.deff, 0.95, 'log'), v.prCiDeff));
      }
      return rows;
    });
  }
});

test('R parity: samplesize', async (t) => {
  const { cases } = load('samplesize');
  const za = dist.qnorm(0.975);
  const zb = dist.qnorm(0.8);
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'samplesize', id, c, () => {
      const v = c.values;
      switch (id) {
        case 'proportion.p05.d005': return [['n', samplesize.nProportion(c.p, c.d, samplesize.zFor(0.95)), v.n], ['n with z = 1.96', samplesize.nProportion(c.p, c.d, samplesize.zFor(0.95, '1.96')), v.nCourseZ]];
        case 'mean.course107036': return [['n', samplesize.nMean(c.sd, c.d, za), v.n], ['n with z = 1.96', samplesize.nMean(c.sd, c.d, 1.96), v.nCourseZ]];
        case 'caseControl.course107029': {
          const p1 = samplesize.p1FromOr(c.OR, c.p0);
          return [['p1', p1, v.p1], ['course pooled', samplesize.nTwoProportions(p1, c.p0, za, zb, 1, 'pooled'), v.coursePooled],
            ['Fleiss', samplesize.nTwoProportions(p1, c.p0, za, zb, 1, 'fleiss'), v.fleiss], ['Fleiss with continuity', samplesize.nTwoProportions(p1, c.p0, za, zb, 1, 'fleiss-cc'), v.fleissContinuity]];
        }
        case 'paired.course107035': return [['normal approximation', samplesize.nPaired(c.d, za, zb), v.normal]];
        case 'twoMeans': return [['per group, normal approximation', samplesize.nTwoMeans(c.sd, c.delta, za, zb, 1), v.normalPerGroup]];
        case 'twoProportions': return [['Fleiss per group', samplesize.nTwoProportions(c.p1, c.p2, za, zb, 1, 'fleiss'), v.fleissPerGroup],
          ['pooled per group', samplesize.nTwoProportions(c.p1, c.p2, za, zb, 1, 'pooled'), v.pooledPerGroup]];
        case 'fpc.course107038': return [['course form', c.n0 / (1 + (c.n0 - 1) / c.N), v.courseForm], ['epiR form', c.n0 / (1 + c.n0 / c.N), v.epiRForm]];
        case 'deff.course107039': return [['n x DEFF', c.n * c.deff, v.n]];
        case 'nonResponse.course107040': return [['n / (1 - rate)', c.n / (1 - c.nonResponse), v.n]];
        default: throw new Error(`no adapter for samplesize case ${id}`);
      }
    });
  }
});
