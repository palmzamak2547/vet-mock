// R parity for the M2 methods: the engine against R 4.6.0 (webR 0.6.0) on every case of the M2 fixture files
// [M2-DESIGN.md 3, 8.2]. OWNER: rparity role. The M1 files stay in rparity-engine.test.mjs.
//
// Tolerances (each case names its kind in `tol`; `iterativeValues`, `closedValues` and `tolByValue` override
// single values; `absoluteZero` lists values that are zero in exact arithmetic):
//   closed      1e-10 relative            iterative    1e-6 relative
//   uniroot     |js - R| <= 2 * 1.220703125e-4 * max(1, |R|)  (R's uniroot tolerance)
//   dunnettP    1e-8 absolute             dunnettCrit  1e-8 relative (M2-DESIGN.md 3.1.4)
//   density     1e-3 absolute (R bins and uses an FFT; the kit evaluates the kernel directly, 8.2)
//   rAbs12, rAbs9  1e-6 relative OR within R's own absolute error bound (1e-12 for pnt, 1e-9 for pnbeta):
//               a noncentral tail smaller than the bound is only as accurate in R as the bound (noncentral.json notes)
//   evidence    R output kept for the record, never compared as a number
//   absoluteZero  |js - R| <= 1e-10 (R prints about 1e-15 for an exact zero)
// A value R returns as NA must come back null; Inf must come back Infinity.
//
// Pending modules: while a module file still carries the STUB(m2) marker and throws "not implemented", its
// cases are skipped with the reason printed. The release check (`git grep -n "STUB(m2)" research/src` prints
// nothing, M2-DESIGN.md 15) removes every skip; a module without the marker that throws fails.
//
// RPARITY_INJECT=1 shifts every nonzero finite R value outside its tolerance (closed x (1 + 1e-6), iterative
// x (1 + 1e-5), uniroot x (1 + 1e-2), dunnettCrit x (1 + 1e-6), dunnettP + 1e-6, density + 1e-2); every case
// that compares such a number must then fail (the injected-wrong-value proof, M2-DESIGN.md 3).
//
// Run-level adapters (methods whose only contract is runX(spec, table)) read the output by the keys and table
// ids each module documents; a key the adapter cannot find fails with the name it looked for.
//
// Fixture files (paths listed literally so scripts/regen-verified.mjs sees them):
//   tests/fixtures/r/out/anova2.json        tests/fixtures/r/out/anovarm.json
//   tests/fixtures/r/out/friedman.json      tests/fixtures/r/out/posthoc.json
//   tests/fixtures/r/out/normality.json     tests/fixtures/r/out/hodgeslehmann.json
//   tests/fixtures/r/out/power.json         tests/fixtures/r/out/noncentral.json
//   tests/fixtures/r/out/glm.json           tests/fixtures/r/out/robust.json
//   tests/fixtures/r/out/survival.json      tests/fixtures/r/out/roc.json
//   tests/fixtures/r/out/blandaltman.json   tests/fixtures/r/out/cronbach.json
//   tests/fixtures/r/out/survey.json        tests/fixtures/r/out/charts.json
//   tests/fixtures/r/out/sources.json
// Second implementation (SciPy 1.17.1, not a pin; R against SciPy, no engine involved):
//   tests/fixtures/crosscheck/scipy-crosscheck-m2.json
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import * as anova2 from '../../src/lib/stats/anova2.js';
import * as anovarm from '../../src/lib/stats/anovarm.js';
import * as friedmanMod from '../../src/lib/stats/friedman.js';
import * as posthoc from '../../src/lib/stats/posthoc.js';
import * as mvt from '../../src/lib/stats/mvt.js';
import * as normality from '../../src/lib/stats/normality.js';
import * as hl from '../../src/lib/stats/hodges-lehmann.js';
import * as power from '../../src/lib/stats/power.js';
import * as noncentral from '../../src/lib/stats/noncentral.js';
import * as padjust from '../../src/lib/stats/padjust.js';
import * as dist from '../../src/lib/stats/dist.js';
import * as glm from '../../src/lib/models/glm.js';
import * as profile from '../../src/lib/models/profile.js';
import * as robust from '../../src/lib/models/robust.js';
import * as survival from '../../src/lib/models/survival.js';
import * as roc from '../../src/lib/epi/roc.js';
import * as blandaltman from '../../src/lib/epi/blandaltman.js';
import * as cronbach from '../../src/lib/epi/cronbach.js';
import * as survey from '../../src/lib/epi/survey.js';
import * as density from '../../src/workspace/charts/density.js';
import { makeTable, spec } from './stats-fixtures.mjs';

const ROOT = new URL('../fixtures/', import.meta.url);
const SRC = new URL('../../src/', import.meta.url);
const read = (rel) => JSON.parse(readFileSync(fileURLToPath(new URL(rel, ROOT)), 'utf8'));
const DATA = read('crosscheck/scipy-crosscheck.json').datasets;
const INJECT = process.env.RPARITY_INJECT === '1';

const REL = { closed: 1e-10, iterative: 1e-6, dunnettCrit: 1e-8 };
const ABS = { dunnettP: 1e-8, density: 1e-3 };
const ABS_OR_REL = { rAbs12: 1e-12, rAbs9: 1e-9 };
const UNIROOT_TOL = 1.220703125e-4;
const INJECT_REL = { closed: 1e-6, iterative: 1e-5, uniroot: 1e-2, dunnettCrit: 1e-6 };
const INJECT_ABS = { dunnettP: 1e-6, density: 1e-2 };

function revive(v) {
  if (v === 'Infinity') return Infinity;
  if (v === '-Infinity') return -Infinity;
  if (v === 'NaN') return NaN;
  return v;
}
const plain = (v) => (v && typeof v === 'object' && !Array.isArray(v) && 'value' in v ? v.value : v);

/** @returns {string|null} null when within tolerance, else the reason */
export function mismatch(got, want, kind) {
  want = revive(want);
  got = plain(got);
  if (kind === 'evidence') return null;
  if (INJECT && typeof want === 'number' && Number.isFinite(want)) {
    if (kind in INJECT_ABS) want += INJECT_ABS[kind];
    else if (kind in ABS_OR_REL) want = want * (1 + 1e-5) + 10 * ABS_OR_REL[kind];
    else if (want !== 0 && kind !== 'absoluteZero') want *= 1 + (INJECT_REL[kind] ?? 1e-6);
  }
  if (want === null) return got === null ? null : `expected null (R's NA), got ${got}`;
  if (typeof got !== 'number') return `expected ${want}, got ${JSON.stringify(got)}`;
  if (Number.isNaN(want)) return Number.isNaN(got) ? null : `expected NaN, got ${got}`;
  if (!Number.isFinite(want)) return got === want ? null : `expected ${want}, got ${got}`;
  const err = Math.abs(got - want);
  if (kind === 'absoluteZero') return err <= 1e-10 ? null : `got ${got}, R ${want}: |diff| ${err.toExponential(3)} > 1e-10 (exact zero)`;
  if (kind in ABS) return err <= ABS[kind] ? null : `got ${got}, R ${want}: |diff| ${err.toExponential(3)} > ${ABS[kind]} (${kind})`;
  if (kind in ABS_OR_REL) {
    if (err <= ABS_OR_REL[kind] || (want !== 0 && err / Math.abs(want) <= 1e-6)) return null;
    return `got ${got}, R ${want}: |diff| ${err.toExponential(3)} > ${ABS_OR_REL[kind]} and relative > 1e-6 (${kind})`;
  }
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

/** The module a "not implemented: stats/anova2.fn" error names, when its file still says STUB(m2). */
function pendingStub(e) {
  const m = /^not implemented: ([\w/.-]+)\.\w+/.exec(e && e.message ? e.message : '');
  if (!m) return null;
  try {
    const src = readFileSync(fileURLToPath(new URL(`lib/${m[1]}.js`, SRC)), 'utf8');
    return src.includes('STUB(m2)') ? m[1] : null;
  } catch {
    return null;
  }
}

/** Per-value kind: absoluteZero / tolByValue / iterativeValues / closedValues override the case's tol. */
function kindOf(c, key) {
  if ((c.absoluteZero || []).includes(key)) return 'absoluteZero';
  const base = key.replace(/\.\d+$/, '').replace(/\[\d+\]$/, '');
  if (c.tolByValue && c.tolByValue[base]) return c.tolByValue[base];
  const iv = c.iterativeValues || [];
  if (iv.includes(base) || iv.includes(key)) return 'iterative';
  if ((c.closedValues || []).includes(base) || (c.closedValues || []).includes(key)) return 'closed';
  return c.tol;
}

/** Rows [label, got, want] for every element of an R vector, labels key.1, key.2, ... (1-based, as absoluteZero). */
function vec(c, key, got, want, kindKey = key) {
  const w = Array.isArray(want) ? want : [want];
  return w.map((x, i) => [`${key}.${i + 1}`, Array.isArray(got) || ArrayBuffer.isView(got) ? got[i] : (i === 0 ? got : undefined), x, kindOf(c, `${kindKey}.${i + 1}`)]);
}
const one = (c, key, got, want) => [[key, got, want, kindOf(c, key)]];

function runCase(t, file, id, c, fn) {
  return t.test(`${file}: ${id}`, (tt) => {
    let rows;
    try {
      rows = fn(c);
    } catch (e) {
      const stub = pendingStub(e);
      if (stub) { tt.skip(`pending: ${stub} is still a STUB(m2)`); return; }
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

function load(name) {
  const doc = read(`r/out/${name}.json`);
  assert.equal(doc._fixture.family, 'r-4.6.0');
  assert.match(doc._meta.r, /^R version 4\.6\.0/);
  return doc;
}

// ---- run-level output readers
function value(out, key) {
  assert.ok(out && out.status === 'ok', `method output status ${out && out.status} (${out && out.reasonKey})`);
  const v = out.values?.[key];
  assert.ok(v !== undefined, `output has no values.${key} (the rparity adapter reads this key)`);
  return v;
}
function testRes(out, id) {
  assert.ok(out && out.status === 'ok', `method output status ${out && out.status} (${out && out.reasonKey})`);
  const r = out.tests.find((x) => x.id === id);
  assert.ok(r, `output has no test '${id}' (tests: ${out.tests.map((x) => x.id).join(', ')})`);
  return r;
}
function table(out, id) {
  assert.ok(out && out.status === 'ok', `method output status ${out && out.status} (${out && out.reasonKey})`);
  const tb = out.tables.find((x) => x.id === id);
  assert.ok(tb, `output has no table '${id}' (tables: ${out.tables.map((x) => x.id).join(', ')})`);
  // The first name in the list that a column carries wins (so 'pAdjusted', 'p' prefers the adjusted column).
  const idx = (...names) => {
    const short = tb.columns.map((col) => String(col).split('.').pop().toLowerCase());
    const hit = names.map((n) => short.indexOf(n.toLowerCase())).find((j) => j >= 0);
    const i = hit === undefined ? -1 : hit;
    assert.ok(i >= 0, `table '${id}' has none of the columns ${names.join(' / ')} (columns: ${tb.columns.join(', ')})`);
    return i;
  };
  return { rows: tb.rows, col: (...names) => { const i = idx(...names); return tb.rows.map((r) => r[i]); } };
}
const cat = (levels, values) => ({ kind: 'category', levels, values });
const numc = (values) => ({ kind: 'number', values });
const threeTable = () => {
  const y = []; const g = [];
  for (const [l, xs] of Object.entries({ A: DATA.three.A, B: DATA.three.B, C: DATA.three.C })) for (const x of xs) { y.push(x); g.push(l); }
  return makeTable({ y: numc(y), g: cat(['A', 'B', 'C'], g) });
};

// ------------------------------------------------------------------------------------------------ lab

test('R parity M2: anova2', async (t) => {
  const doc = load('anova2');
  const wb = doc.datasets.warpbreaks;
  const rowsOf = (drop) => wb.breaks.map((_, i) => i).filter((i) => !drop.includes(i + 1));
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'anova2', id, c, () => {
      const v = c.values;
      const rows = rowsOf(c.dropRows || []);
      if (id.startsWith('typeI')) {
        const y = rows.map((i) => wb.breaks[i]);
        const a = rows.map((i) => wb.woolLevels.indexOf(wb.wool[i]));
        const b = rows.map((i) => wb.tensionLevels.indexOf(wb.tension[i]));
        const r = anova2.anovaTwoWay(y, a, b, { ssType: c.ssType, interaction: c.interaction });
        const ids = ['A', 'B', 'AB'].slice(0, v.effects.length);
        const out = [];
        ids.forEach((e, k) => {
          const eff = r.effects.find((x) => x.id === e);
          assert.ok(eff, `no effect ${e}`);
          out.push([`${e} SS`, eff.ss, v.ss[k]], [`${e} df`, eff.df, v.df[k]], [`${e} F`, eff.F, v.F[k]], [`${e} p`, eff.p, v.p[k]]);
          if (v.partialEtaSq) out.push([`${e} partial eta squared`, eff.etaPartial, v.partialEtaSq[k]]);
        });
        out.push(['residual SS', r.residual.ss, v.residualSs], ['residual df', r.residual.df, v.residualDf]);
        return out;
      }
      const tb = makeTable({ y: numc(rows.map((i) => wb.breaks[i])), wool: cat(wb.woolLevels, rows.map((i) => wb.wool[i])), tension: cat(wb.tensionLevels, rows.map((i) => wb.tension[i])) });
      const run = (interaction) => anova2.runAnovaTwoWay(spec('anova.twoWay', { roles: { outcome: 'y', group: 'wool', factorB: 'tension' }, options: { ssType: 'III', interaction, posthoc: 'tukey' } }), tb);
      if (id.startsWith('tukey.')) {
        const out = run(c.interaction);
        const T = table(out, c.term === 'wool' ? 'tukeyA' : 'tukeyB');
        const diff = T.col('diff'); const lo = T.col('lower', 'lwr'); const hi = T.col('upper', 'upr'); const p = T.col('pAdjusted', 'p');
        return v.pairs.flatMap((pr, k) => [[`${pr.pair} diff`, diff[k], pr.diff, 'closed'], [`${pr.pair} lower`, lo[k], pr.ci[0]], [`${pr.pair} upper`, hi[k], pr.ci[1]], [`${pr.pair} p`, p[k], pr.p]]);
      }
      if (id === 'cellMeans.balanced') {
        const T = table(run(true), 'cellMeans');
        const n = T.col('n'); const m = T.col('mean'); const sd = T.col('sd');
        const la = T.col('levelA'); const lb = T.col('levelB');
        return v.wool.flatMap((w, k) => {
          const j = la.findIndex((x, i) => String(x) === w && String(lb[i]) === v.tension[k]);
          assert.ok(j >= 0, `no cell ${w} x ${v.tension[k]}`);
          return [[`${w}:${v.tension[k]} n`, n[j], v.n[k]], [`${w}:${v.tension[k]} mean`, m[j], v.mean[k]], [`${w}:${v.tension[k]} sd`, sd[j], v.sd[k]]];
        });
      }
      throw new Error(`no adapter for anova2 case ${id}`);
    });
  }
});

test('R parity M2: anovarm', async (t) => {
  const doc = load('anovarm');
  const { wide, group, times } = doc.datasets.rm;
  const long = () => {
    const y = []; const s = []; const tm = []; const g = [];
    wide.forEach((row, i) => row.forEach((x, j) => { y.push(x); s.push(`a${i + 1}`); tm.push(times[j]); g.push(group[i]); }));
    return makeTable({ y: numc(y), subj: cat(wide.map((_, i) => `a${i + 1}`), s), time: cat(times, tm), grp: cat(['A', 'B'], g) });
  };
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'anovarm', id, c, () => {
      const v = c.values;
      const split = id === 'splitPlot';
      if (id === 'oneWay' || split) {
        const sp = anovarm.sphericity(wide, split ? group.map((x) => (x === 'A' ? 0 : 1)) : undefined);
        const out = [...one(c, 'epsGG', sp.gg, v.epsGG), ...one(c, 'epsHF', sp.hf, v.epsHF), ...one(c, 'mauchlyW', sp.mauchlyW, v.mauchlyW), ...one(c, 'mauchlyP', sp.mauchlyP, v.mauchlyP)];
        const roles = { outcome: 'y', subject: 'subj', time: 'time', ...(split ? { group: 'grp' } : {}) };
        const tb = long();
        const runs = Object.fromEntries(['none', 'gg', 'hf'].map((s) => [s, anovarm.runAnovaRepeated(spec('anova.repeated', { roles, options: { sphericity: s, mauchly: true } }), tb)]));
        const within = split ? [['time', 'time'], ['groupTime', 'groupTime']] : [['time', 'time']];
        for (const [tid, pre] of within) {
          out.push([`${tid} F`, testRes(runs.none, tid).statistic.value, v[`${pre}F`], 'closed']);
          out.push([`${tid} p (uncorrected)`, testRes(runs.none, tid).p, v[`${pre}P`], 'closed']);
          out.push([`${tid} p (GG)`, testRes(runs.gg, tid).p, v[`${pre}PGG`], kindOf(c, `${pre}PGG`)]);
          out.push([`${tid} p (HF, capped)`, testRes(runs.hf, tid).p, v[`${pre}PHF`], kindOf(c, `${pre}PHF`)]);
        }
        if (split) {
          const g = testRes(runs.none, 'group');
          out.push(['group F', g.statistic.value, v.groupF, 'closed'], ['group p', g.p, v.groupP, 'closed']);
        }
        out.push(['values.epsGG', plain(value(runs.gg, 'epsGG')), v.epsGG, 'iterative'], ['values.epsHF', plain(value(runs.gg, 'epsHF')), v.epsHF, 'iterative']);
        const A = table(runs.none, 'anova');
        const src = A.col('source'); const ss = A.col('ss');
        const ssOf = (name) => ss[src.indexOf(name)];
        out.push(['SS time', ssOf('time'), v.ssTime, 'closed'], ['SS error', ssOf('residual'), v.ssError, 'closed']);
        if (split) out.push(['SS group', ssOf('group'), v.ssGroup, 'closed'], ['SS group x time', ssOf('groupTime'), v.ssGroupTime, 'closed'], ['SS animals within groups', ssOf('animalsWithinGroups'), v.ssSubjects, 'closed']);
        else out.push(['SS animals', ssOf('animals'), v.ssSubjects, 'closed']);
        return out;
      }
      if (id === 'means') {
        const out = anovarm.runAnovaRepeated(spec('anova.repeated', { roles: { outcome: 'y', subject: 'subj', time: 'time', group: 'grp' }, options: { sphericity: 'gg', mauchly: true } }), long());
        const M = table(out, 'means');
        const tt = M.col('time'); const gg = M.col('group'); const n = M.col('n'); const m = M.col('mean'); const sd = M.col('sd'); const lo = M.col('lower'); const hi = M.col('upper');
        return v.time.flatMap((tm, k) => {
          const j = tt.findIndex((x, i) => String(x) === tm && String(gg[i]) === v.group[k]);
          assert.ok(j >= 0, `no means row ${tm} x ${v.group[k]}`);
          return [[`${tm}/${v.group[k]} n`, n[j], v.n[k]], [`${tm}/${v.group[k]} mean`, m[j], v.mean[k]], [`${tm}/${v.group[k]} sd`, sd[j], v.sd[k]],
            [`${tm}/${v.group[k]} lower`, lo[j], v.lower[k]], [`${tm}/${v.group[k]} upper`, hi[j], v.upper[k]]];
        });
      }
      throw new Error(`no adapter for anovarm case ${id}`);
    });
  }
});

test('R parity M2: friedman', async (t) => {
  const doc = load('friedman');
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'friedman', id, c, () => {
      const v = c.values;
      if (id === 'roundingTimes.missing') {
        const blocks = doc.datasets.roundingTimes;
        const y = []; const g = []; const s = [];
        blocks.forEach((row, i) => row.forEach((x, j) => { y.push(i + 1 === c.missingRow && j + 1 === c.missingColumn ? null : x); g.push(`t${j + 1}`); s.push(`b${i + 1}`); }));
        const tb = makeTable({ y: numc(y), g: cat(['t1', 't2', 't3'], g), s: cat(blocks.map((_, i) => `b${i + 1}`), s) });
        const r = testRes(friedmanMod.runFriedman(spec('test.friedman', { roles: { outcome: 'y', group: 'g', subject: 's' } }), tb), 'friedman');
        return [['statistic', r.statistic.value, v.statistic], ['df', r.df, v.df], ['p', r.p, v.p]];
      }
      const r = friedmanMod.friedman(doc.datasets[c.data]);
      return [['statistic', r.statistic, v.statistic], ['df', r.df, v.df], ['p', r.p, v.p]];
    });
  }
});

test('R parity M2: posthoc', async (t) => {
  const doc = load('posthoc');
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'posthoc', id, c, () => {
      const v = c.values;
      const spc = (method, extra = {}) => spec(method, { roles: { outcome: 'y', group: 'g' }, ...extra });
      if (id === 'dunn.three') {
        const out = [];
        for (const [adj, key] of [['none', 'pRaw'], ['holm', 'pHolm'], ['bonferroni', 'pBonferroni'], ['bh', 'pBH']]) {
          const T = table(posthoc.runDunn(spc('posthoc.dunn', { options: { adjust: adj } }), threeTable()), 'pairs');
          const z = T.col('z'); const p = T.col('pAdjusted', 'pAdj', 'p');
          v.pairs.forEach((pr, k) => {
            if (adj === 'none') out.push([`${pr} z`, z[k], v.z[k]]);
            out.push([`${pr} p (${adj})`, p[k], v[key][k]]);
          });
        }
        return out;
      }
      if (id === 'gamesHowell.three') {
        const T = table(posthoc.runGamesHowell(spc('posthoc.gamesHowell'), threeTable()), 'pairs');
        const cols = { diff: T.col('diff'), se: T.col('se'), df: T.col('df'), q: T.col('q'), p: T.col('pAdjusted', 'p'), lower: T.col('lower'), upper: T.col('upper') };
        return v.pairs.flatMap((pr, k) => Object.keys(cols).map((key) => [`${pr} ${key}`, cols[key][k], v[key][k], kindOf(c, key)]));
      }
      if (id === 'dunnett.three.controlA') {
        const out = [];
        v.p.forEach((p, k) => out.push([`${v.pairs[k]} p (mvt)`, 1 - mvt.dunnettProbability(Math.abs(v.t[k]), v.lambda, v.df), p, 'dunnettP']));
        out.push(['critical value (mvt)', mvt.dunnettQuantile(0.95, v.lambda, v.df), v.crit, 'dunnettCrit']);
        const T = table(posthoc.runDunnett(spc('posthoc.dunnett', { levels: { controlLevel: 'A' } }), threeTable()), 'pairs');
        const cols = { diff: T.col('diff'), se: T.col('se'), t: T.col('t'), p: T.col('pAdjusted', 'p'), lower: T.col('lower'), upper: T.col('upper') };
        v.pairs.forEach((pr, k) => Object.keys(cols).forEach((key) => out.push([`${pr} ${key}`, cols[key][k], v[key][k], kindOf(c, key)])));
        return out;
      }
      if (id.startsWith('adjust.')) {
        return [...vec(c, 'sidak', padjust.pAdjust(c.input, 'sidak'), v.sidak), ...vec(c, 'bh', padjust.pAdjust(c.input, 'bh'), v.bh)];
      }
      throw new Error(`no adapter for posthoc case ${id}`);
    });
  }
});

/** warpbreaks (Tippett 1950) as R's datasets::warpbreaks, from the anova2 fixture's own copy. */
function warpbreaksTable() {
  const wb = load('anova2').datasets.warpbreaks;
  return makeTable({ y: numc(wb.breaks), wool: cat(wb.woolLevels, wb.wool), tension: cat(wb.tensionLevels, wb.tension) });
}

test('R parity M2: normality', async (t) => {
  const doc = load('normality');
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'normality', id, c, () => {
      const v = c.values;
      if (id === 'shapiro.warpbreaks.cells') {
        // The engine forms the residuals itself: the two-way cells from group and factorB.
        const r = normality.shapiroWilk(c.x);
        const out = normality.runShapiro(spec('diag.shapiro', { roles: { outcome: 'y', group: 'wool', factorB: 'tension' }, options: { on: 'residuals' } }), warpbreaksTable());
        return [['W', r?.W, v.W], ['p', r?.p, v.p], ['W (engine, cells)', out.tests[0]?.statistic.value, v.W], ['p (engine, cells)', out.tests[0]?.p, v.p], ['n', out.values.n?.value, v.n, 'closed']];
      }
      if (id.startsWith('shapiro.')) {
        const r = normality.shapiroWilk(c.x);
        return [['W', r?.W, v.W], ['p', r?.p, v.p]];
      }
      if (id === 'brownForsythe.warpbreaks.cells') {
        const r = normality.runBrownForsythe(spec('diag.brownForsythe', { roles: { outcome: 'y', group: 'wool', factorB: 'tension' }, options: { center: 'median' } }), warpbreaksTable()).tests[0];
        assert.ok(r, 'no test row');
        return [['F', r.statistic.value, v.F], ['df1', r.dfPair?.[0], v.df1], ['df2', r.dfPair?.[1], v.df2], ['p', r.p, v.p]];
      }
      if (id.startsWith('qq.')) return vec(c, 'theoretical', normality.qqPoints(c.x).theoretical, v.theoretical);
      if (id === 'brownForsythe.three' || id === 'levene.three') {
        const out = normality.runBrownForsythe(spec('diag.brownForsythe', { roles: { outcome: 'y', group: 'g' }, options: { center: id === 'levene.three' ? 'mean' : 'median' } }), threeTable());
        const r = out.tests[0];
        assert.ok(r, 'no test row');
        return [['F', r.statistic.value, v.F], ['df1', r.dfPair?.[0], v.df1], ['df2', r.dfPair?.[1], v.df2], ['p', r.p, v.p]];
      }
      throw new Error(`no adapter for normality case ${id}`);
    });
  }
});

test('R parity M2: hodgeslehmann', async (t) => {
  const doc = load('hodgeslehmann');
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'hodgeslehmann', id, c, () => {
      const v = c.values;
      const exact = c.tol === 'closed';
      const opts = { confLevel: c.confLevel, exact, correct: true };
      const r = id.startsWith('two.') ? hl.hodgesLehmannTwo(c.x, c.y, opts) : hl.hodgesLehmannPaired(c.x.map((x, i) => x - c.y[i]), opts);
      return [['estimate', r.estimate, v.estimate], ['lower', r.ci?.[0], v.ci[0]], ['upper', r.ci?.[1], v.ci[1]]];
    });
  }
});

test('R parity M2: power', async (t) => {
  const doc = load('power');
  const params = (method, p, options = {}) => spec(method, { input: { kind: 'params', params: p }, options });
  // values.nBase is the unrounded n (as M1's ss.* outputs), values.n the n reported after rounding up.
  const nOut = (out, c, v) => [['n (unrounded)', value(out, 'nBase'), v.n ?? v.v, kindOf(c, 'n')], ['n reported', value(out, 'n'), v.nCeiling, 'closed']];
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'power', id, c, () => {
      const v = c.values;
      const common = { sigLevel: c.sigLevel };
      switch (id) {
        case 'anova.n': return nOut(power.runPowerAnova(params('power.anova', { groups: c.groups, betweenVar: c.betweenVar, withinVar: c.withinVar, power: c.power }, { ...common, solveFor: 'n' })), c, v);
        case 'anova.power': case 'anova.power.five':
          return one(c, 'power', value(power.runPowerAnova(params('power.anova', { groups: c.groups, betweenVar: c.betweenVar, withinVar: c.withinVar, n: c.n }, { ...common, solveFor: 'power' })), 'power'), v.power);
        case 't.twoSample.n': case 't.paired.n':
          return nOut(power.runPowerTTest(params('power.tTest', { delta: c.delta, sd: c.sd, power: c.power }, { ...common, solveFor: 'n', type: c.type === 'paired' ? 'paired' : 'two-sample' })), c, v);
        case 't.twoSample.power': case 't.paired.power':
          return one(c, 'power', value(power.runPowerTTest(params('power.tTest', { delta: c.delta, sd: c.sd, n: c.n }, { ...common, solveFor: 'power', type: c.type === 'paired' ? 'paired' : 'two-sample' })), 'power'), v.power);
        case 'correlation.n': return nOut(power.runPowerCorrelation(params('power.correlation', { r: c.r, power: c.power }, { ...common, solveFor: 'n' })), c, v);
        case 'correlation.power': return one(c, 'power', value(power.runPowerCorrelation(params('power.correlation', { r: c.r, n: c.n }, { ...common, solveFor: 'power' })), 'power'), v.power);
        case 'regression.v': {
          const out = power.runPowerRegression(params('power.regression', { u: c.u, f2: c.f2, power: c.power }, { ...common, solveFor: 'n' }));
          return [['n = v + u + 1 (unrounded)', value(out, 'nBase'), v.n, 'uniroot'], ['n reported', value(out, 'n'), v.nCeiling, 'closed']];
        }
        case 'regression.power': return one(c, 'power', value(power.runPowerRegression(params('power.regression', { u: c.u, f2: c.f2, n: c.v + c.u + 1 }, { ...common, solveFor: 'power' })), 'power'), v.power);
        default: throw new Error(`no adapter for power case ${id}`);
      }
    });
  }
});

test('R parity M2: noncentral', async (t) => {
  const { cases } = load('noncentral');
  for (const [id, c] of Object.entries(cases)) {
    await runCase(t, 'noncentral', id, c, () => {
      const got = c.fn === 'pnt' ? noncentral.pnt(c.q, c.df, c.ncp, c.lowerTail) : noncentral.pnf(c.q, c.df1, c.df2, c.ncp, c.lowerTail);
      return [['p', got, c.values.p]];
    });
  }
});

// --------------------------------------------------------------------------------------------- models

/** Treatment-coded design columns (intercept first) from numeric and categorical columns. */
function designOf(n, terms) {
  const X = [Float64Array.from({ length: n }, () => 1)];
  const termCols = [];
  for (const tm of terms) {
    const cols = [];
    if (tm.levels) {
      for (const l of tm.levels.slice(1)) { cols.push(X.length); X.push(Float64Array.from(tm.values, (x) => (x === l ? 1 : 0))); }
    } else { cols.push(X.length); X.push(Float64Array.from(tm.values)); }
    termCols.push(cols);
  }
  return { X, termCols };
}
const drop = (X, cols) => X.filter((_, j) => !cols.includes(j));
const se = (fit) => fit.vcov.map((r, j) => Math.sqrt(r[j]));

function glmRows(c, v, X, y, family, offset) {
  const opts = offset ? { offset } : {};
  const fit = glm.fitGlm(X, y, family, opts);
  const out = [...vec(c, 'B', fit.beta, v.B), ...vec(c, 'SE', se(fit), v.SE), ...one(c, 'deviance', fit.deviance, v.deviance),
    ...one(c, 'nullDeviance', fit.nullDeviance, v.nullDeviance), ...one(c, 'aic', fit.aic, v.aic), ['iterations', fit.iter, v.iter, 'closed'], ['converged', fit.converged ? 1 : 0, 1, 'closed']];
  v.profileLower.forEach((lo, j) => {
    const ci = profile.profileCi([X, y, family, opts], j, 0.95, fit);
    out.push([`profile lower ${j + 1}`, ci[0], lo, kindOf(c, `profileLower.${j + 1}`)], [`profile upper ${j + 1}`, ci[1], v.profileUpper[j], kindOf(c, `profileUpper.${j + 1}`)]);
  });
  const q = 1.959963984540054; // qnorm(0.975) as R prints it with %.17g; R's confint.default uses it
  const s = se(fit);
  v.waldLower.forEach((lo, j) => out.push([`Wald lower ${j + 1}`, fit.beta[j] - q * s[j], lo, kindOf(c, `waldLower.${j + 1}`)], [`Wald upper ${j + 1}`, fit.beta[j] + q * s[j], v.waldUpper[j], kindOf(c, `waldUpper.${j + 1}`)]));
  return { fit, out };
}

test('R parity M2: glm', async (t) => {
  const doc = load('glm');
  const D = doc.datasets;
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'glm', id, c, () => {
      const v = c.values;
      if (id === 'logistic.infert') {
        const n = D.infert.case.length;
        const { X, termCols } = designOf(n, [{ values: D.infert.education, levels: D.infert.educationLevels }, { values: D.infert.spontaneous }, { values: D.infert.induced }]);
        const y = Float64Array.from(D.infert.case);
        const { fit, out } = glmRows(c, v, X, y, 'binomial');
        termCols.forEach((cols, k) => {
          const red = glm.fitGlm(drop(X, cols), y, 'binomial');
          const lr = red.deviance - fit.deviance;
          out.push([`LR ${v.lrtTerms[k]}`, lr, v.lrtStatistic[k], 'iterative'], [`LR p ${v.lrtTerms[k]}`, dist.pchisqUpper(lr, cols.length), v.lrtP[k], 'iterative']);
        });
        return out;
      }
      if (id === 'logistic.separation') {
        const { X } = designOf(D.sep.y.length, [{ values: D.sep.x, levels: ['a', 'b', 'c'] }]);
        const fit = glm.fitGlm(X, Float64Array.from(D.sep.y), 'binomial');
        assert.equal(fit.separated, true, 'the fit must report separation (M2-DESIGN.md 3.2.1), not R\'s diverging estimates');
        return [['separation (evidence)', 1, 1, 'evidence'], ['separated flag', fit.separated ? 1 : 0, 1, 'closed']];
      }
      if (id === 'poisson.dobson') {
        const { X } = designOf(9, [{ values: c.outcome, levels: [1, 2, 3] }, { values: c.treatment, levels: [1, 2, 3] }]);
        const y = Float64Array.from(c.counts);
        const { fit, out } = glmRows(c, v, X, y, 'poisson');
        const mu = fit.fitted;
        out.push(['Pearson X2', Array.from(y).reduce((s, yi, i) => s + (yi - mu[i]) ** 2 / mu[i], 0), v.pearsonX2, 'iterative']);
        return out;
      }
      if (id === 'poisson.doctors') {
        const d = D.doctors;
        const { X, termCols } = designOf(d.deaths.length, [{ values: d.smoke, levels: ['no', 'yes'] }, { values: d.age, levels: ['35-44', '45-54', '55-64', '65-74', '75-84'] }]);
        const y = Float64Array.from(d.deaths);
        const offset = Float64Array.from(d.py, Math.log);
        const { fit, out } = glmRows(c, v, X, y, 'poisson', offset);
        const mu = fit.fitted;
        out.push(['Pearson X2', Array.from(y).reduce((s, yi, i) => s + (yi - mu[i]) ** 2 / mu[i], 0), v.pearsonX2, 'iterative']);
        out.push(['IRR smoking', Math.exp(fit.beta[1]), v.irrSmoke, 'iterative']);
        termCols.forEach((cols, k) => {
          const red = glm.fitGlm(drop(X, cols), y, 'poisson', { offset });
          const lr = red.deviance - fit.deviance;
          out.push([`LR ${v.lrtTerms[k]}`, lr, v.lrtStatistic[k], 'iterative'], [`LR p ${v.lrtTerms[k]}`, dist.pchisqUpper(lr, cols.length), v.lrtP[k], 'iterative']);
        });
        return out;
      }
      throw new Error(`no adapter for glm case ${id}`);
    });
  }
});

test('R parity M2: robust', async (t) => {
  const doc = load('robust');
  const s = doc.datasets.sero;
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'robust', id, c, () => {
      const v = c.values;
      const n = s.pos.length;
      const X = [Float64Array.from({ length: n }, () => 1), Float64Array.from(s.age24), Float64Array.from(s.vacNo), Float64Array.from(s.herd)];
      const y = Float64Array.from(s.pos);
      const fit = glm.fitGlm(X, y, 'binomial');
      const farms = [...new Set(s.farm)];
      const cluster = Int32Array.from(s.farm, (f) => farms.indexOf(f));
      const base = { X, y, fitted: fit.fitted, family: 'binomial', bread: fit.vcov, workingWeights: fit.workingWeights, workingResiduals: fit.workingResiduals };
      const sd = (V) => V.map((r, j) => Math.sqrt(r[j]));
      return [...vec(c, 'B', fit.beta, v.B), ...vec(c, 'modelSE', se(fit), v.modelSE), ...one(c, 'deviance', fit.deviance, v.deviance),
        ...vec(c, 'robustSE', sd(robust.clusterRobustVcov(base, cluster)), v.robustSE),
        ...vec(c, 'robustSENoAdjust', sd(robust.clusterRobustVcov(base, cluster, { cadjust: false })), v.robustSENoAdjust),
        ...vec(c, 'robustSEHC1', sd(robust.clusterRobustVcov(base, cluster, { type: 'HC1' })), v.robustSEHC1)];
    });
  }
});

test('R parity M2: survival', async (t) => {
  const doc = load('survival');
  const a = doc.datasets.aml;
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'survival', id, c, () => {
      const v = c.values;
      if (id === 'logrank') {
        const r = survival.logRank(a.time, a.status.map((x) => x === 1), a.x.map((x) => (x === 'Maintained' ? 0 : 1)));
        return [['statistic', r.statistic, v.statistic], ['df', r.df, v.df], ['p', r.p, v.p], ...vec(c, 'observed', r.observed, v.observed), ...vec(c, 'expected', r.expected, v.expected)];
      }
      const strata = [...new Set(v.stratum)];
      const out = [];
      strata.forEach((st, h) => {
        const idx = a.time.map((_, i) => i).filter((i) => st === 'all' || a.x[i] === st);
        const r = survival.kaplanMeier(idx.map((i) => a.time[i]), idx.map((i) => a.status[i] === 1), c.confType, c.confLevel);
        const rows = v.stratum.map((x, i) => i).filter((i) => v.stratum[i] === st);
        // summary() lists event times only; the engine may list censoring times too: compare at R's times.
        rows.forEach((i) => {
          const j = r.time.findIndex((tt, k) => tt === v.time[i] && r.nEvent[k] > 0);
          assert.ok(j >= 0, `${st}: no event row at time ${v.time[i]}`);
          for (const key of ['nRisk', 'nEvent', 'surv', 'se', 'lower', 'upper']) out.push([`${st} t=${v.time[i]} ${key}`, r[key][j], v[key][i], 'closed']);
        });
        out.push([`${st} median`, r.median, v.median[h], 'closed'], [`${st} median lower`, r.medianCi[0], v.medianLower[h], 'closed'], [`${st} median upper`, r.medianCi[1], v.medianUpper[h], 'closed']);
      });
      return out;
    });
  }
});

// -------------------------------------------------------------------------------------------- measure

test('R parity M2: roc', async (t) => {
  const doc = load('roc');
  const r = doc.datasets.roc;
  const tb = () => makeTable({ ref: cat(['0', '1'], r.status.map(String)), m1: numc(r.marker1), m2: numc(r.marker2), neg1: numc(r.marker1.map((x) => -x)) });
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'roc', id, c, () => {
      const v = c.values;
      const run = (test, test2, direction = 'higher-positive') => roc.runRoc(spec('roc.delong', { roles: { test, reference: 'ref', ...(test2 ? { test2 } : {}) }, levels: { referencePositive: '1' }, options: { direction, youden: true } }), tb());
      if (id === 'marker1' || id === 'marker2') {
        const m = id === 'marker1' ? r.marker1 : r.marker2;
        const d = roc.delong(m.filter((_, i) => r.status[i] === 1), m.filter((_, i) => r.status[i] === 0));
        const out = run(id === 'marker1' ? 'm1' : 'm2');
        const auc = value(out, 'auc');
        const C = table(out, 'coords');
        const th = C.col('threshold'); const sens = C.col('se', 'sensitivity'); const spec_ = C.col('sp', 'specificity');
        const rows = [['AUC (delong)', d.auc, v.auc], ['variance', d.variance, v.variance], ['AUC (run)', plain(auc), v.auc], ['CI lower', auc.ci?.[0], v.ciLower], ['CI upper (clipped)', auc.ci?.[1], v.ciUpper]];
        v.thresholds.forEach((x, k) => rows.push([`threshold ${k + 1}`, th[k], x], [`Se ${k + 1}`, sens[k], v.sensitivity[k]], [`Sp ${k + 1}`, spec_[k], v.specificity[k]]));
        return rows;
      }
      if (id === 'paired.delong') {
        const out = run('m1', 'm2');
        const T = testRes(out, 'delong');
        return [['z', T.statistic.value, v.z], ['p', T.p, v.p], ['difference', plain(value(out, 'aucDifference')), v.diff],
          ['difference lower', value(out, 'aucDifference').ci?.[0], v.diffLower], ['difference upper', value(out, 'aucDifference').ci?.[1], v.diffUpper]];
      }
      if (id === 'marker1.negated.lowerPositive') {
        const auc = value(run('neg1', null, 'lower-positive'), 'auc');
        return [['AUC', plain(auc), v.auc], ['CI lower', auc.ci?.[0], v.ciLower], ['CI upper', auc.ci?.[1], v.ciUpper]];
      }
      throw new Error(`no adapter for roc case ${id}`);
    });
  }
});

test('R parity M2: blandaltman', async (t) => {
  const doc = load('blandaltman');
  const p = doc.datasets.pefr;
  const tb = () => makeTable({ a: numc(p.wright), b: numc(p.mini) });
  const run = (options) => blandaltman.runBlandAltman(spec('agree.blandAltman', { roles: { raterA: 'a', raterB: 'b' }, options: { loaCi: 'approx', proportionalBias: true, ...options } }), tb());
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'blandaltman', id, c, () => {
      const v = c.values;
      if (id === 'absolute.196' || id === 'absolute.2') {
        const out = run({ scale: 'absolute', loaMultiplier: c.loaMultiplier });
        const lo = value(out, 'loaLower'); const hi = value(out, 'loaUpper');
        const rows = [['limit lower', plain(lo), v.loaLower], ['limit upper', plain(hi), v.loaUpper], ['lower limit CI lower', lo.ci?.[0], v.loaLowerCiLower],
          ['lower limit CI upper', lo.ci?.[1], v.loaLowerCiUpper], ['upper limit CI lower', hi.ci?.[0], v.loaUpperCiLower], ['upper limit CI upper', hi.ci?.[1], v.loaUpperCiUpper]];
        if (id === 'absolute.196') {
          const b = value(out, 'bias');
          rows.push(['n', plain(value(out, 'n')), v.n], ['mean difference', plain(b), v.meanDifference], ['mean CI lower', b.ci?.[0], v.meanLower], ['mean CI upper', b.ci?.[1], v.meanUpper],
            ['SD', plain(value(out, 'sdDifference')), v.sd], ['limit SE', lo.se, v.loaSe]);
        }
        return rows;
      }
      if (id === 'proportionalBias') {
        const out = run({ scale: 'absolute', loaMultiplier: 1.96 });
        const T = testRes(out, 'proportionalBias');
        return [['slope', plain(value(out, 'proportionalSlope')), v.slope], ['intercept', plain(value(out, 'proportionalIntercept')), v.intercept],
          ['slope SE', value(out, 'proportionalSlope').se, v.slopeSe], ['t', T.statistic.value, v.t], ['df', T.df, v.df], ['p', T.p, v.p]];
      }
      if (id === 'percent.196') {
        const out = run({ scale: 'percent', loaMultiplier: 1.96 });
        return [['mean percent difference', plain(value(out, 'biasPercent')), v.meanDifference], ['SD', plain(value(out, 'sdPercent')), v.sd],
          ['limit lower', plain(value(out, 'loaLower')), v.loaLower], ['limit upper', plain(value(out, 'loaUpper')), v.loaUpper], ['limit SE', value(out, 'loaLower').se, v.loaSe]];
      }
      if (id === 'ratio.196') {
        const out = run({ scale: 'ratio', loaMultiplier: 1.96 });
        return [['geometric mean ratio', plain(value(out, 'ratioGeoMean')), v.ratio], ['SD of log ratio', plain(value(out, 'sdLogRatio')), v.logSd],
          ['limit lower', plain(value(out, 'loaLower')), v.loaLower], ['limit upper', plain(value(out, 'loaUpper')), v.loaUpper]];
      }
      throw new Error(`no adapter for blandaltman case ${id}`);
    });
  }
});

test('R parity M2: cronbach', async (t) => {
  const doc = load('cronbach');
  const items = doc.datasets.items;
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'cronbach', id, c, () => {
      const v = c.values;
      const cols = Object.fromEntries(Array.from({ length: v.k }, (_, j) => [`q${j + 1}`, numc(items.map((r) => r[j]))]));
      const out = cronbach.runCronbach(spec('rel.cronbach', { roles: { items: Object.keys(cols) }, options: { ciMethod: 'feldt' } }), makeTable(cols));
      const a = value(out, 'alpha');
      const T = table(out, 'items');
      const rest = T.col('itemRest'); const dropped = T.col('alphaIfDropped'); const mean = T.col('mean'); const sd = T.col('sd');
      return [['alpha', plain(a), v.alpha], ['Feldt lower', a.ci?.[0], v.feldtLower], ['Feldt upper', a.ci?.[1], v.feldtUpper],
        ['standardized alpha', plain(value(out, 'alphaStandardized')), v.standardized],
        ...vec(c, 'itemRest', rest, v.itemRest), ...vec(c, 'alphaIfDropped', dropped, v.alphaIfDropped), ...vec(c, 'itemMean', mean, v.itemMean), ...vec(c, 'itemSd', sd, v.itemSd)];
    });
  }
});

test('R parity M2: survey', async (t) => {
  const doc = load('survey');
  for (const [id, c] of Object.entries(doc.cases)) {
    await runCase(t, 'survey', id, c, () => {
      const v = c.values;
      const sizes = id === 'serosurvey' ? doc.datasets.serosurvey.n : c.sizes;
      const pos = id === 'serosurvey' ? doc.datasets.serosurvey.positives : c.positives;
      const positive = []; const cluster = [];
      sizes.forEach((n, g) => { for (let i = 0; i < n; i++) { positive.push(i < pos[g]); cluster.push(g); } });
      const l = survey.surveyProportion(positive, cluster, { method: 'logit', confLevel: c.confLevel });
      const m = survey.surveyProportion(positive, cluster, { method: 'mean', confLevel: c.confLevel });
      return [['p', l.p, v.p], ['SE', l.se, v.se], ['df', l.df, v.df], ['logit lower', l.ci[0], v.logitLower, kindOf(c, 'logitLower')], ['logit upper', l.ci[1], v.logitUpper, kindOf(c, 'logitUpper')],
        ['mean lower', m.ci[0], v.meanLower], ['mean upper', m.ci[1], v.meanUpper]];
    });
  }
});

// --------------------------------------------------------------------------------------- chart helpers

test('R parity M2: charts (bandwidth and density)', async (t) => {
  const doc = load('charts');
  for (const [id, c] of Object.entries(doc.cases)) {
    if (id === 'band.corr') continue; // the scatter band is the graphs role's (its chart input comes from reg.ols); see notes
    await runCase(t, 'charts', id, c, () => {
      const v = c.values;
      if (id.startsWith('bw.')) return [['bw', density.bwNrd0(c.x), v.bw]];
      if (id.startsWith('density.')) {
        const bw = density.bwNrd0(c.input);
        const y = density.kde(c.input, bw, v.x);
        return [['bw', bw, v.bw, 'closed'], ...v.y.map((yy, k) => [`density at ${v.x[k]}`, y[k], yy, 'density'])];
      }
      throw new Error(`no adapter for charts case ${id}`);
    });
  }
});

test('R parity M2: the published datasets equal their package copies (sources.json)', () => {
  const { cases } = load('sources');
  for (const [id, c] of Object.entries(cases)) assert.equal(c.values.matches, true, `${id} differs from ${c.source}`);
});

test('R parity M2: R 4.6.0 agrees with the SciPy second implementation (scipy-crosscheck-m2.json)', () => {
  // A disagreement here is a bug report on one side (R or SciPy/Boost), not a tolerance to widen quietly.
  const doc = read('crosscheck/scipy-crosscheck-m2.json');
  assert.ok(doc.rows.length > 200, 'the cross-check file lost its rows');
  const files = {};
  const fails = [];
  for (const r of doc.rows) {
    files[r.file] ??= read(`r/out/${r.file}.json`);
    const c = files[r.file].cases[r.case];
    assert.ok(c, `${r.file}.json has no case ${r.case}`);
    let want = c.values[r.key];
    if (r.index !== null) want = want?.[r.index];
    want = revive(want);
    const got = revive(r.scipy);
    if (typeof want !== 'number' || typeof got !== 'number') { fails.push(`${r.file} ${r.case} ${r.key}[${r.index}]: R ${want}, SciPy ${got}`); continue; }
    const err = Math.abs(got - want);
    const ok = r.tol === 'abs' ? err <= r.bound
      : r.tol === 'absOrRel' ? err <= r.bound || err <= 1e-6 * Math.abs(want)
        : err <= r.bound * Math.abs(want) || (want === 0 && err <= 1e-15);
    if (!ok) fails.push(`${r.file} ${r.case} ${r.key}[${r.index}]: R ${want}, SciPy ${got} (${r.how}; ${r.tol} ${r.bound})`);
  }
  assert.equal(fails.length, 0, `R and SciPy disagree:\n  ${fails.join('\n  ')}`);
});
