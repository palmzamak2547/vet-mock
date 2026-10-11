// Review round for M3a, analysis screens and their words: each test pins one verified finding of the review and fails
// on the code before its fix. The engine runs here on made-up data (ข้อมูลสมมุติ / made-up data) generated in this
// file, so it reads no fixture file; words are read through the same translate() the app uses.
// OWNER: ui-analysis role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { smallTable } from './runtime-area-specs.mjs';
import { COMMON_OPTIONS, DEFAULT_OPTIONS } from '../../src/lib/runtime/spec.js';
import { METHOD_UI, buildSpec, columnsForRole, isSeparationStop, optionShown, rolesFor } from '../../src/workspace/lib/method-ui.js';
import { valueLabel } from '../../src/workspace/lib/result-model.js';
import { columnNameFor, levelNameFor } from '../../src/workspace/report/build.js';
import { registerArea, translate } from '../../src/i18n/index.js';
import { runDoseResponse } from '../../src/lib/stats/curves.js';
import { makeTable } from './stats-fixtures.mjs';
import ws from '../../src/i18n/workspace.js';
import termsM2 from '../../src/i18n/terms-m2.js';
import workspaceM3 from '../../src/i18n/workspace-m3.js';
import termsM3 from '../../src/i18n/terms-m3.js';
import report from '../../src/i18n/report.js';
import intake from '../../src/i18n/intake.js';
import stats from '../../src/i18n/stats.js';
import epi from '../../src/i18n/epi.js';
import runtime from '../../src/i18n/runtime.js';
import lab from '../../src/i18n/lab.js';
import models from '../../src/i18n/models.js';
import measure from '../../src/i18n/measure.js';
import data from '../../src/i18n/data.js';
import graphs from '../../src/i18n/graphs.js';
import tools from '../../src/i18n/tools.js';
import termsBase from '../../src/i18n/terms.js';

for (const [a, d] of Object.entries({ workspace: ws, 'terms-m2': termsM2, 'workspace-m3': workspaceM3, 'terms-m3': termsM3, report, intake, stats, epi, runtime, lab, models, measure, data, graphs, tools })) registerArea(a, d);
const tOf = (lang) => (k, p) => translate(lang, k, p);
const THAI = /[\u0E00-\u0E7F]/;

async function run(sp, t) {
  const { result } = await handleRequest('run', { spec: sp, table: t.table, codebook: t.codebook, steps: t.steps || [] }, { mode: 'worker' });
  return result;
}
const specOf = (method, roles, options = {}, levels = {}) => buildSpec({
  method, datasetId: 'd-m3', recipeRev: 0, design: 'experiment', roles, levels, options: { ...COMMON_OPTIONS, ...(DEFAULT_OPTIONS[method] || {}), ...options },
});

// ---------------------------------------------------------------------------------------------- screens

test('the Firth stop and the separation note advise every kind of separation, including a number and a combination', async () => {
  // age >= 5 is sick in every animal: the outcome is split by a range of a number, and there is no level to merge
  const age = [1, 2, 2, 3, 3, 4, 4, 4.5, 5, 5.5, 6, 6, 7, 7, 8, 9];
  const t = smallTable([
    { name: 'sick', type: 'binary', levels: ['0', '1'], positive: '1', values: age.map((a) => (a >= 5 ? 1 : 0)) },
    { name: 'age', type: 'continuous', values: age },
  ]);
  const env = await run(specOf('reg.logistic', { outcome: 'c1', covariates: ['c2'] }, {}, { outcomePositive: '1' }), t);
  assert.equal(isSeparationStop(env), true);
  assert.ok(env.tables.find((x) => x.id === 'separation').rows.some((r) => r[1] === 'models.cell.sideLow'), 'the separation is by a range of values');
  for (const lang of ['th', 'en']) {
    const body = translate(lang, 'ws.firth.stopBody');
    const note = translate(lang, 'models.note.separation');
    if (lang === 'en') {
      assert.ok(!/^A group has the same outcome/.test(body), body);
      assert.match(body, /range of values/);
      assert.match(body, /combination/);
      assert.match(body, /leave a variable out/);
      assert.match(note, /leave that variable out/);
    } else {
      assert.match(body, /ช่วงค่า/);
      assert.match(body, /หลายตัวรวมกัน/);
      assert.match(body, /เอาตัวแปรออก/);
      assert.match(note, /ตัดตัวแปรนั้นออก/);
    }
    assert.match(body, /Firth’s correction/);
    assert.ok(!/\{|\[ws\./.test(body), lang);
  }
});

test('an unknown outside the standards gets advice for the side it is on, not "dilute" for every one', () => {
  for (const lang of ['th', 'en']) {
    const one = translate(lang, 'lab.note.outsideCurve', { rows: 1 });
    const many = translate(lang, 'lab.note.outsideCurve', { rows: 2 });
    assert.ok(!/\{rows\}/.test(one));
    assert.ok(one.includes('1') && many.includes('2'), lang);
    if (lang === 'en') {
      assert.ok(!/1 samples|dilute the sample or add standards/.test(one), one);
      assert.match(one, /beyond the end of the curve where the highest standards lie[^.]*dilute it and measure again/);
      assert.match(one, /beyond the end where the lowest standards lie[^.]*below the lowest standard/);
    } else {
      assert.match(one, /ความเข้มข้นสูง[^ ]* แปลว่าตัวอย่างเข้มข้นกว่า standard ให้เจือจางแล้ววัดใหม่/);
      assert.match(one, /ต่ำกว่า standard ต่ำสุด/);
    }
  }
});

/** Made-up long-form data shaped like a phase-by-hour study: 12 animals in 3 treatments, 3 phases, 5 hours, one row each. */
function phaseHour(hour = 'nominal', onlyHour = null) {
  const r = { y: [], id: [], phase: [], hour: [], trt: [] };
  const phases = ['pre', 'post', 'fup'];
  for (let i = 0; i < 12; i += 1) {
    phases.forEach((phase, j) => {
      for (let h = 1; h <= 5; h += 1) {
        if (onlyHour && String(h) !== onlyHour) continue;
        r.y.push(Math.round((5 + (i % 3) * 0.8 + j * 1.1 + h * 0.4 + Math.sin(i * 3.1) * 1.5 + Math.sin(i * 7.7 + j * 1.3 + h * 0.9) * 0.8) * 100) / 100);
        r.id.push(`s${i + 1}`); r.phase.push(phase); r.hour.push(hour === 'nominal' ? `h${h}` : h); r.trt.push(['control', 'A', 'B'][i % 3]);
      }
    });
  }
  return smallTable([
    { name: 'score', type: 'continuous', values: r.y },
    { name: 'animal', type: 'id', values: r.id },
    { name: 'phase', type: 'nominal', levels: phases, values: r.phase },
    hour === 'nominal'
      ? { name: 'hour', type: 'nominal', levels: ['h1', 'h2', 'h3', 'h4', 'h5'], values: r.hour }
      : hour === 'ordinal'
        ? { name: 'hour', type: 'ordinal', levels: ['1', '2', '3', '4', '5'], values: r.hour }
        : { name: 'hour', type: 'count', values: r.hour },
    { name: 'treatment', type: 'nominal', levels: ['control', 'A', 'B'], values: r.trt },
  ]);
}

test('repeated measures: every column the time and second-factor pickers offer is one the engine accepts', async () => {
  const roles = rolesFor('anova.repeated');
  const time = roles.find((r) => r.role === 'time');
  const factorB = roles.find((r) => r.role === 'factorB');
  // hours written as numbers 1 to 5, as the data come: the importer types the column 'count'
  const t = phaseHour('count');
  assert.equal(t.codebook.columns.find((c) => c.name === 'hour').type, 'count');
  for (const [role, pick] of [[time, (key) => ({ outcome: 'c1', subject: 'c2', time: key })], [factorB, (key) => ({ outcome: 'c1', subject: 'c2', time: 'c3', factorB: key })]]) {
    for (const col of columnsForRole(t.codebook, role)) {
      const env = await run(specOf('anova.repeated', pick(col.key)), t);
      assert.ok(!(env.status === 'invalid' && env.reasonKey === 'stats.error.needsCategory'), `${role.role} offers ${col.name}, which the engine refuses as not a category`);
    }
  }
  // set to Ordered categories in the codebook, the same column is offered and runs
  const o = phaseHour('ordinal');
  assert.ok(columnsForRole(o.codebook, time).some((c) => c.name === 'hour'));
  assert.ok(columnsForRole(o.codebook, factorB).some((c) => c.name === 'hour'));
  const ok = await run(specOf('anova.repeated', { outcome: 'c1', subject: 'c2', time: 'c3', factorB: 'c4' }), o);
  assert.equal(ok.status, 'ok');
  // the hints and the refusal say what to do, in the student's words
  for (const lang of ['th', 'en']) {
    const hint = lang === 'en' ? /Ordered categories in the Codebook/ : /กลุ่มมีลำดับในหน้ารหัสตัวแปร/;
    assert.match(translate(lang, 'ws.roleHintFor.anovaRepeated.time'), hint, `${lang} time hint`);
    assert.match(translate(lang, 'ws.roleHintFor.anovaRepeated.factorB'), hint, `${lang} factorB hint`);
    const refusal = translate(lang, 'stats.error.needsCategory');
    assert.match(refusal, lang === 'en' ? /time point or second factor/ : /ครั้งที่วัด/);
    assert.ok(!/The group variable must be a category|ตัวแปรกลุ่มต้องเป็นหมวดหมู่$/.test(refusal), refusal);
  }
});

test('dose-response: a comparison needs a group, so the spec says none and the screen does not offer one without it', async () => {
  const shared = { ...DEFAULT_OPTIONS['nls.doseResponse'], compare: 'ec50' };
  const noGroup = buildSpec({ method: 'nls.doseResponse', roles: { x: 'c1', outcome: 'c2' }, options: shared });
  assert.equal(noGroup.options.compare, 'none');
  const withGroup = buildSpec({ method: 'nls.doseResponse', roles: { x: 'c1', outcome: 'c2', group: 'c3' }, options: shared });
  assert.equal(withGroup.options.compare, 'ec50', 'with a group the choice stays');
  assert.equal(buildSpec({ method: 'nls.doseResponse', roles: { x: 'c1', outcome: 'c2', group: null }, options: { ...shared, compare: 'all' } }).options.compare, 'none');
  assert.equal(optionShown('nls.doseResponse', 'compare', { x: 'c1', outcome: 'c2' }), false);
  assert.equal(optionShown('nls.doseResponse', 'compare', { x: 'c1', outcome: 'c2', group: 'c3' }), true);
  assert.equal(optionShown('nls.doseResponse', 'model', { x: 'c1', outcome: 'c2' }), true);
  assert.equal(optionShown('nls.fourPL', 'compare', {}), true, 'other methods are untouched');
  // the engine then has nothing to note: one curve is what was asked for
  const conc = [0.94, 1.88, 3.75, 7.5, 15, 30].flatMap((x) => [x, x, x]);
  const resp = conc.map((x, i) => Math.round((0.6 + 7.9 / (1 + (x / 3.5) ** 1.4) + Math.sin(i * 2.7) * 0.25) * 100) / 100);
  const table = makeTable({ conc: { kind: 'number', values: conc }, rootl: { kind: 'number', values: resp } });
  const out = runDoseResponse({ ...noGroup, roles: { x: 'conc', outcome: 'rootl' } }, table);
  assert.ok(!(out.notes || []).some((n) => n.id === 'compareNeedsGroups'), 'no "this result shows a single curve" beside a comparison that was never asked for');
  // the options list the screen builds hides the comparison until a group is chosen
  assert.ok(METHOD_UI['nls.doseResponse'].options.compare.length > 1);
});

test('lang="en" is set only on text that is English: not on the Firth switch, nor on a term name with Thai words', () => {
  const src = readFileSync(new URL('../../src/workspace/screens/AnalysisPane.jsx', import.meta.url), 'utf8');
  assert.ok(!/lang="en"[^>]*>\{t\('ws\.firth\.switch'\)/.test(src), 'the Firth switch is in the page language');
  const marked = [...src.matchAll(/lang="en">\{t\(([^)]*)\)\}/g)].map((m) => m[1]);
  assert.ok(marked.length >= 1, 'the term list still marks its English names');
  const termNames = (lang) => Object.entries({ ...termsBase[lang], ...termsM2[lang], ...termsM3[lang] }).filter(([k]) => /^term\.[^.]+\.name$/.test(k));
  for (const arg of marked) {
    if (/term\.\$\{k\}\.name/.test(arg)) {
      for (const [k, v] of termNames('th')) assert.ok(!THAI.test(v), `${k} is marked English but reads "${v}"`);
    } else {
      const key = /'([^']+)'/.exec(arg)?.[1];
      assert.ok(key && !THAI.test(ws.th[key] ?? workspaceM3.th[key] ?? ''), `${arg} is marked English`);
    }
  }
  assert.equal(termsM3.th['term.ec50.name'], 'EC50 and IC50');
});

test('the qPCR method is not named "2 minus ΔΔCt": the name fits Livak and Pfaffl alike', () => {
  for (const lang of ['th', 'en']) {
    for (const key of ['runtime.method.qpcr.relative', 'runtime.family.qpcr']) {
      const s = runtime[lang][key];
      assert.ok(s.includes('ΔΔCt'), `${lang} ${key}`);
      assert.ok(!/2-ΔΔCt|2−ΔΔCt/.test(s), `${lang} ${key} reads "${s}"`);
    }
  }
});

test('two within factors: the values name the student\'s columns, and the animal counts say "pair of", not "every time"', async () => {
  const t = phaseHour('nominal');
  const roles = { outcome: 'c1', subject: 'c2', time: 'c3', factorB: 'c4', group: 'c5' };
  const env = await run(specOf('anova.repeated', roles), t);
  assert.equal(env.status, 'ok');
  const label = (name, lang, e = env, tb = t) => valueLabel(name, tOf(lang), 'anova.repeated', { spec: e.spec, env: e, codebook: tb.codebook, columnName: columnNameFor(tb.codebook, lang), levelName: levelNameFor(tb.codebook, lang) });
  assert.equal(label('etaPartialTimeFactorB', 'en'), 'Partial eta squared, phase by hour');
  assert.equal(label('etaPartialGroupTimeFactorB', 'en'), 'Partial eta squared, treatment by phase by hour');
  assert.equal(label('etaPartialGroupFactorB', 'en'), 'Partial eta squared, treatment by hour');
  assert.equal(label('etaPartialFactorB', 'en'), 'Partial eta squared, hour');
  assert.equal(label('etaPartialTime', 'en'), 'Partial eta squared, phase');
  assert.equal(label('etaPartialGroup', 'en'), 'Partial eta squared, treatment');
  assert.equal(label('etaPartialGroupTime', 'en'), 'Partial eta squared, treatment by phase');
  assert.equal(label('epsGGTime', 'en'), 'Greenhouse-Geisser epsilon, phase');
  assert.equal(label('epsHFFactorB', 'en'), 'Huynh-Feldt epsilon, hour');
  assert.equal(label('epsGGTimeFactorB', 'en'), 'Greenhouse-Geisser epsilon, phase by hour');
  assert.match(label('nAnimals', 'en'), /every pair of phase and hour/);
  assert.match(label('nIncomplete', 'en'), /missing pair of phase and hour/);
  for (const name of Object.keys(env.values)) {
    for (const lang of ['th', 'en']) {
      const s = label(name, lang);
      assert.ok(!/second within factor|ปัจจัยที่สองภายในตัว|every time|\{[abg]\}|\[lab\./.test(s), `${lang} ${name}: ${s}`);
    }
  }
  for (const name of ['etaPartialTimeFactorB', 'epsGGTime', 'nAnimals']) assert.ok(label(name, 'th').includes('phase'), `th ${name}`);
  assert.ok(label('etaPartialTimeFactorB', 'th').includes('hour'));
  // one within factor: the words of M2 stay
  const t1 = phaseHour('nominal', '1');
  const one = await run(specOf('anova.repeated', { outcome: 'c1', subject: 'c2', time: 'c3' }), t1);
  assert.equal(one.status, 'ok');
  assert.equal(label('nAnimals', 'en', one, t1), 'Animals measured at every time');
  assert.equal(label('etaPartialTime', 'en', one, t1), 'Partial eta squared, time');
  // with no spec at hand (a caller that has no words) the generic names stand in, never a placeholder
  assert.equal(valueLabel('etaPartialTimeFactorB', tOf('en'), 'anova.repeated'), 'Partial eta squared, time by second within factor');
});
