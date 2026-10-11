// Shared by the report role's M3a tests (not a test file itself): every M3a method and every option that changes
// what its report must say, run end to end through runAnalysis on the R fixtures' own datasets (ryegrass, the two-arm
// curves, Puromycin, decay, growth, gtt, qpcr, dilution, USArrests, OBrienKaiser, sex2, quine), so each sentence and
// each exported script is written from a real envelope, never from a hand-made one. Made-up datasets (curves, decay,
// growth, gtt, qpcr, dilution, the three-group qPCR and the steep dilution) are labelled ข้อมูลสมมุติ / made-up data in
// tests/fixtures/r. OWNER: report role.
import { readFileSync } from 'node:fs';
import { runAnalysis } from '../../src/lib/runtime/run.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { smallTable } from './runtime-area-specs.mjs';
import { THREE } from './lab-fixtures.mjs';

const J = (p) => JSON.parse(readFileSync(new URL(`../fixtures/r/out/${p}`, import.meta.url), 'utf8'));
const ds = { kind: 'dataset', datasetId: 'd-m3', recipeRev: 0 };
const none = { route: null, column: null };
const spec = (method, roles, options = {}, levels = {}, design = 'experiment') => makeSpec(method, ds, { design, cluster: none, roles, options, levels });

/** Column labels in the codebook that differ from the file's headers, so a sentence that names a column is seen to use them. */
function labelled(tb, labels) {
  const codebook = structuredClone(tb.codebook);
  for (const c of codebook.columns) {
    const l = labels[c.name];
    if (l) { c.labelEn = l[0]; c.labelTh = l[1]; }
  }
  return { ...tb, labelledCodebook: codebook };
}

let memo = null;

/** Every case once per process: { name, spec, table, codebook, labelledCodebook, env }. */
export function m3Cases() {
  if (memo) return memo;
  const NL = J('nonlinear.json').datasets;
  const out = [];
  const add = (name, s, tb) => out.push({ name, spec: s, ...tb, labelledCodebook: tb.labelledCodebook || tb.codebook, env: runAnalysis(s, tb.table, tb.codebook) });

  // nls.fourPL: ryegrass (root length falls with the dose: an IC50) with two samples to read off the curve, one of them
  // above the top (outside the standard curve)
  const elisa = labelled(smallTable([
    { name: 'conc', type: 'continuous', values: [...NL.ryegrass.conc, null, null, null] },
    { name: 'root', type: 'continuous', values: [...NL.ryegrass.rootl, 2, 4, 9.5] },
  ]), { conc: ['herbicide (mM)', 'ความเข้มข้นของสารกำจัดวัชพืช'], root: ['root length', 'ความยาวราก'] });
  add('fourPL', spec('nls.fourPL', { x: 'c1', outcome: 'c2' }, { model: '4pl' }), elisa);
  add('fivePL', spec('nls.fourPL', { x: 'c1', outcome: 'c2' }, { model: '5pl' }), elisa);
  // the same curve turned upside down (10 minus the root length): the response rises, an EC50
  const rising = smallTable([
    { name: 'conc', type: 'continuous', values: NL.ryegrass.conc },
    { name: 'signal', type: 'continuous', values: NL.ryegrass.rootl.map((y) => 10 - y) },
  ]);
  add('fourPLRising', spec('nls.fourPL', { x: 'c1', outcome: 'c2' }, { model: '4pl' }), rising);

  // nls.doseResponse: the made-up two-arm curves
  const arms = smallTable([
    { name: 'arm', type: 'nominal', levels: ['control', 'drug'], values: NL.curves.arm },
    { name: 'dose', type: 'continuous', values: NL.curves.dose },
    { name: 'resp', type: 'continuous', values: NL.curves.resp },
  ]);
  add('doseEc50', spec('nls.doseResponse', { x: 'c2', outcome: 'c3', group: 'c1' }, { model: '4pl', compare: 'ec50' }), arms);
  add('doseAll', spec('nls.doseResponse', { x: 'c2', outcome: 'c3', group: 'c1' }, { model: '4pl', compare: 'all' }), arms);
  add('doseNone', spec('nls.doseResponse', { x: 'c2', outcome: 'c3', group: 'c1' }, { model: '4pl', compare: 'none' }), arms);
  add('dose5pl', spec('nls.doseResponse', { x: 'c2', outcome: 'c3', group: 'c1' }, { model: '5pl', compare: 'ec50' }), arms);

  // nls.equation: Puromycin (treated), the made-up decay and growth series
  add('michaelisMenten', spec('nls.equation', { x: 'c1', outcome: 'c2' }, { equation: 'michaelisMenten' }), smallTable([
    { name: 'conc', type: 'continuous', values: NL.puromycin.conc }, { name: 'rate', type: 'continuous', values: NL.puromycin.rate }]));
  add('decay', spec('nls.equation', { x: 'c1', outcome: 'c2' }, { equation: 'decay' }), smallTable([
    { name: 'time', type: 'continuous', values: NL.decay.time }, { name: 'conc', type: 'continuous', values: NL.decay.conc }]));
  add('growth', spec('nls.equation', { x: 'c1', outcome: 'c2' }, { equation: 'growth' }), smallTable([
    { name: 'time', type: 'continuous', values: NL.growth.time }, { name: 'count', type: 'continuous', values: NL.growth.count }]));

  // calc.auc: the made-up glucose tolerance test (two arms), net of the first value, one animal measured once, no group,
  // and three arms
  const gtt = J('auc.json').datasets.gtt;
  const g = { y: [], animal: [], t: [], arm: [] };
  gtt.glucose.forEach((row, i) => row.forEach((v, j) => { g.y.push(v); g.animal.push(gtt.animal[i]); g.t.push(gtt.times[j]); g.arm.push(gtt.group[i]); }));
  const auc = smallTable([
    { name: 'glucose', type: 'continuous', values: [...g.y, 6.1] },
    { name: 'animal', type: 'id', values: [...g.animal, 'Z9'] },
    { name: 'minute', type: 'continuous', values: [...g.t, 0] },
    { name: 'arm', type: 'nominal', levels: ['control', 'treated'], values: [...g.arm, 'treated'] },
  ]);
  add('aucZero', spec('calc.auc', { outcome: 'c1', subject: 'c2', time: 'c3', group: 'c4' }, { baseline: 'zero' }), auc);
  add('aucFirst', spec('calc.auc', { outcome: 'c1', subject: 'c2', time: 'c3', group: 'c4' }, { baseline: 'first' }), auc);
  add('aucOne', spec('calc.auc', { outcome: 'c1', subject: 'c2', time: 'c3' }, { baseline: 'zero' }), auc);
  const arm3 = g.animal.map((a) => (/[12]$/.test(a) ? 'low' : /[34]$/.test(a) ? 'high' : 'mid'));
  add('aucThree', spec('calc.auc', { outcome: 'c1', subject: 'c2', time: 'c3', group: 'c4' }, { baseline: 'zero' }), smallTable([
    { name: 'glucose', type: 'continuous', values: g.y }, { name: 'animal', type: 'id', values: g.animal },
    { name: 'minute', type: 'continuous', values: g.t }, { name: 'dose', type: 'nominal', levels: ['low', 'mid', 'high'], values: arm3.map((x, i) => (g.arm[i] === 'control' ? x : x === 'low' ? 'mid' : x === 'high' ? 'mid' : 'low')) },
  ]));

  // qpcr.relative: the made-up qpcr data (two reference genes), Livak and Pfaffl, and three groups built on `three`
  const q = J('qpcr.json').datasets;
  const qp = labelled(smallTable([
    { name: 'target', type: 'continuous', values: q.qpcr.target },
    { name: 'gapdh', type: 'continuous', values: q.qpcr.gapdh },
    { name: 'actb', type: 'continuous', values: q.qpcr.actb },
    { name: 'arm', type: 'nominal', levels: ['control', 'treated'], values: q.qpcr.group },
  ]), { target: ['IL-6 Ct', 'Ct ของ IL-6'], gapdh: ['GAPDH Ct', 'Ct ของ GAPDH'], actb: ['ACTB Ct', 'Ct ของ ACTB'] });
  add('livak', spec('qpcr.relative', { outcome: 'c1', items: ['c2', 'c3'], group: 'c4' }, { method: 'livak', test: 'welch' }, { controlLevel: 'control' }), qp);
  add('pfaffl', spec('qpcr.relative', { outcome: 'c1', items: ['c2', 'c3'], group: 'c4' }, { method: 'pfaffl', efficiency: { c1: 1.95, c2: 1.98, c3: 2 }, test: 'pooled' }, { controlLevel: 'control' }), qp);
  const tri = { target: [], ref: [], grp: [] };
  for (const [l, vals] of Object.entries(THREE)) for (const v of vals) { tri.target.push(20 + v / 10); tri.ref.push(20); tri.grp.push(l); }
  add('qpcrThree', spec('qpcr.relative', { outcome: 'c1', items: ['c2'], group: 'c3' }, { method: 'livak', test: 'welch' }, { controlLevel: 'A' }), smallTable([
    { name: 'target', type: 'continuous', values: tri.target }, { name: 'ref', type: 'continuous', values: tri.ref },
    { name: 'dose', type: 'nominal', levels: ['A', 'B', 'C'], values: tri.grp }]));

  // qpcr.efficiency: the made-up dilution series (96.96%) and a steep one outside 90 to 110%
  add('efficiency', spec('qpcr.efficiency', { x: 'c1', outcome: 'c2' }), smallTable([
    { name: 'log10input', type: 'continuous', values: q.dilution.log10input }, { name: 'ct', type: 'continuous', values: q.dilution.ct }]));
  add('efficiencyLow', spec('qpcr.efficiency', { x: 'c1', outcome: 'c2' }), smallTable([
    { name: 'log10input', type: 'continuous', values: [0, -1, -2, -3, -4] }, { name: 'ct', type: 'continuous', values: [16.1, 20.0, 24.1, 27.9, 32.0] }]));

  // mv.pca: USArrests, correlation and covariance matrices
  const us = J('pca.json').datasets.USArrests;
  const arrests = smallTable([
    ...us.columns.map((name, j) => ({ name, type: 'continuous', values: us.values.map((r) => r[j]) })),
    { name: 'state', type: 'id', values: us.rows },
  ]);
  add('pcaCorrelation', spec('mv.pca', { items: ['c1', 'c2', 'c3', 'c4'], subject: 'c5' }, { scale: true }, {}, 'cross-sectional'), arrests);
  add('pcaCovariance', spec('mv.pca', { items: ['c1', 'c2', 'c3', 'c4'], subject: 'c5' }, { scale: false }, {}, 'cross-sectional'), arrests);

  // anova.repeated with a second within factor: OBrienKaiser, with the treatment groups (5, 4, 7 animals: sequential sums
  // of squares) and without; animal s4 misses one combination in the second
  const D = J('anovarm2.json').datasets.OBrienKaiser;
  const longOf = (skip) => {
    const L = { y: [], a: [], ph: [], h: [], tr: [] };
    D.values.forEach((row, i) => row.forEach((v, j) => { if (skip && i === 3 && j === 4) return; L.y.push(v); L.a.push(`s${i + 1}`); L.ph.push(D.phase[j]); L.h.push(D.hour[j]); L.tr.push(D.treatment[i]); }));
    return smallTable([
      { name: 'score', type: 'continuous', values: L.y }, { name: 'subj', type: 'id', values: L.a },
      { name: 'phase', type: 'ordinal', levels: ['pre', 'post', 'fup'], values: L.ph }, { name: 'hour', type: 'ordinal', levels: ['1', '2', '3', '4', '5'], values: L.h },
      { name: 'treatment', type: 'nominal', levels: ['control', 'A', 'B'], values: L.tr },
    ]);
  };
  add('rm2Between', spec('anova.repeated', { outcome: 'c1', subject: 'c2', time: 'c3', factorB: 'c4', group: 'c5' }, { sphericity: 'gg', mauchly: true }), longOf(false));
  add('rm2Within', spec('anova.repeated', { outcome: 'c1', subject: 'c2', time: 'c3', factorB: 'c4' }, { sphericity: 'hf', mauchly: true }), longOf(true));

  // reg.logistic with Firth's correction: sex2 (Heinze and Schemper 2002), profile and Wald
  const s2 = J('firth.json').datasets.sex2;
  const fx = smallTable([
    { name: 'case', type: 'binary', levels: ['0', '1'], values: s2.case.map(String) },
    ...['age', 'oc', 'vic', 'vicl', 'vis', 'dia'].map((k) => ({ name: k, type: 'binary', levels: ['0', '1'], values: s2[k].map(String), reference: '0' })),
  ]);
  add('firthProfile', spec('reg.logistic', { outcome: 'c1', covariates: ['c2', 'c3', 'c4', 'c5', 'c6', 'c7'] }, { method: 'firth', ciMethod: 'profile' }, { outcomePositive: '1' }, 'case-control'), fx);
  add('firthWald', spec('reg.logistic', { outcome: 'c1', covariates: ['c2', 'c3'] }, { method: 'firth', ciMethod: 'wald' }, { outcomePositive: '1' }, 'case-control'), fx);

  // reg.negbin: quine (Venables and Ripley), profile and Wald, and with a made-up exposure as the offset
  const quine = J('negbin.json').datasets.quine;
  const qt = smallTable([
    { name: 'Days', type: 'count', values: quine.Days },
    { name: 'Eth', type: 'nominal', levels: ['A', 'N'], values: quine.Eth },
    { name: 'Sex', type: 'nominal', levels: ['F', 'M'], values: quine.Sex },
    { name: 'Age', type: 'nominal', levels: ['F0', 'F1', 'F2', 'F3'], values: quine.Age },
    { name: 'py', type: 'continuous', values: quine.Days.map((_, i) => 150 + ((i + 1) % 7) * 8) },
  ]);
  add('negbinProfile', spec('reg.negbin', { outcome: 'c1', covariates: ['c2', 'c3', 'c4'] }, { ciMethod: 'profile' }, {}, 'cross-sectional'), qt);
  add('negbinWald', spec('reg.negbin', { outcome: 'c1', covariates: ['c2', 'c3'], time: 'c5' }, { ciMethod: 'wald' }, {}, 'cohort'), qt);

  memo = out;
  return out;
}

/** One case by name. */
export const m3Case = (name) => {
  const c = m3Cases().find((x) => x.name === name);
  if (!c) throw new Error(`no M3 case ${name}`);
  return c;
};
