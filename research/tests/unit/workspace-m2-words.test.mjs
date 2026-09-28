// Every word an M2 result shows comes from a dictionary, in Thai and in English [M2-DESIGN.md 9, 10.2]: the
// method's name, each value, test, table caption and column, guardrail and note, the options panel, the
// methods and results sentences, and the charts drawn from the result. Each registered M2 analysis runs
// end to end on its case from tests/unit/<area>-specs.mjs, then the result view's own label functions are
// asked for words. A statistic symbol (n, F, df, p, W, z, t, q) reads the same in both languages and is
// allowed as it is. The planning methods (design.randomisation, design.sampling) show their lists on their
// own tool screens and are left out here. OWNER: integrator (M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { allSpecs } from './runtime-area-specs.mjs';
import { noFarm } from './runtime-m1-specs.mjs';
import { registerArea, translate } from '../../src/i18n/index.js';
import ws from '../../src/i18n/workspace.js';
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
import { valueLabel, testLabel } from '../../src/workspace/lib/result-model.js';
import { envTableText, guardText } from '../../src/workspace/report/result-words.js';
import { resultParagraphs, columnNameFor } from '../../src/workspace/report/build.js';
import { chartsForResult } from '../../src/workspace/lib/chart-inputs.js';
import { buildChart, chartToSvg } from '../../src/workspace/charts/model.js';
import { provenanceLines } from '../../src/lib/runtime/provenance.js';
import { getMethod } from '../../src/lib/runtime/catalog.js';
import * as F from '../../src/lib/stats/format.js';

for (const [a, d] of Object.entries({ workspace: ws, report, intake, stats, epi, runtime, lab, models, measure, data, graphs, tools })) registerArea(a, d);
const fmt = { formatP: F.formatP, formatNumber: F.formatNumber, formatCi: F.formatCi };
// Statistics terms that stay English in the Thai page too (M1-DESIGN.md 4.4): 'power', 'deviance'.
const SYMBOLS = new Set(['n', 'F', 'df', 'p', 'W', 'z', 't', 'q', 'power', 'deviance']);
const PLANNING = new Set(['design.randomisation', 'design.sampling']);
const missing = (s) => /\[[a-zA-Z][\w.:-]*\]/.test(String(s));

const { base, cases } = await allSpecs();

for (const c of cases.filter((x) => x.area !== 'm1' && !PLANNING.has(x.spec.method))) {
  const { spec } = c;
  test(`${spec.method}: every word of its result comes from a dictionary, in Thai and English`, async () => {
    const table = c.table || base.table;
    const codebook = c.codebook || noFarm(base.codebook);
    const { result: env } = await handleRequest('run', { spec, table: spec.input.kind === 'dataset' ? table : null, codebook, steps: c.steps || base.steps }, { mode: 'worker' });
    assert.equal(env.status, 'ok');
    const m = spec.method;
    const problems = [];
    for (const lang of ['th', 'en']) {
      const t = (k, p) => translate(lang, k, p);
      const columnName = columnNameFor(codebook, lang);
      if (missing(t(getMethod(m).nameKey))) problems.push(`${lang} method name`);
      for (const name of Object.keys(env.values || {})) {
        const l = valueLabel(name, t, m);
        if ((l === name && !SYMBOLS.has(name)) || missing(l)) problems.push(`${lang} value ${name}`);
        for (const k of [env.values[name]?.reasonKey, env.values[name]?.noteKey]) if (k && missing(t(k))) problems.push(`${lang} key ${k}`);
      }
      for (const tr of env.tests || []) {
        const l = testLabel(tr, t, { methodId: m, roles: spec.roles, columnName });
        if (l === tr.id || missing(l)) problems.push(`${lang} test ${tr.id}`);
      }
      for (const tb of env.tables || []) {
        const x = envTableText(tb, t, { spec, codebook, columnName });
        if (x.caption === tb.id) problems.push(`${lang} table caption ${tb.id}`);
        tb.columns.forEach((col, i) => { if ((x.columns[i] === col && !SYMBOLS.has(col)) || missing(x.columns[i])) problems.push(`${lang} table ${tb.id} column ${col}`); });
      }
      for (const g of [...(env.guard?.warnings || []), ...(env.guard?.notes || [])]) {
        const x = guardText(g, t);
        if (missing(`${x.title || ''} ${x.body || ''}`)) problems.push(`${lang} guard ${g.id}`);
      }
      const p = resultParagraphs(env, { t, fmt, lang, codebook, nameKeyOf: (id) => getMethod(id)?.nameKey || null });
      if (missing(p.methods) || missing(p.results)) problems.push(`${lang} paragraphs`);
      if (provenanceLines(env, lang, t, columnName).some(missing)) problems.push(`${lang} provenance line`);
      for (const ch of chartsForResult({ spec, envelope: env }, table, { labelOf: columnName, t })) {
        const model = buildChart(ch.kind, ch.input, { width: 460, lang, t, fmt });
        const svg = chartToSvg(model, { theme: 'print' });
        if (missing(svg) || missing(model.summary)) problems.push(`${lang} chart ${ch.kind}`);
        if (/NaN/.test(svg)) problems.push(`${lang} chart ${ch.kind} NaN`);
      }
    }
    assert.deepEqual(problems, []);
  });
}
