// Every dictionary key a result can emit has words in Thai and English. Three nets, because a refusal reason is
// only emitted on data nobody ran:
//   1. each registered method's end-to-end case (tests/unit/<area>-specs.mjs) runs, and every string anywhere in
//      its envelope that has the shape of a key (reasons, notes, guard findings, table and column ids, cells such as
//      the `meaning` of a curve parameter) is looked up in both languages;
//   2. every key written as a literal in the statistics and model modules (the refusals and undefined reasons the
//      cases above never reach) is looked up the same way, and the keys those modules build from a value
//      (`lab.note.equation.${equation}`) are looked up for every value the option allows;
//   3. the dropped-row reasons a method may report are the ones types.js names, each with words.
// A word missing in lab.js or models.js is the owner's to add: this file only finds it. OWNER: data role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { noFarm } from './runtime-m1-specs.mjs';
import { allSpecs } from './runtime-area-specs.mjs';
import { registerArea, translate, AREA_PREFIX } from '../../src/i18n/index.js';
import { ALLOWED } from '../../src/lib/runtime/spec.js';
import { envTableText, guardText } from '../../src/workspace/report/result-words.js';
import { columnNameFor } from '../../src/workspace/report/build.js';
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

for (const [a, d] of Object.entries({ workspace: ws, report, intake, stats, epi, runtime, lab, models, measure, data, graphs, tools })) registerArea(a, d);

const SRC = fileURLToPath(new URL('../../src/', import.meta.url));
// a key is an area prefix, then at least one more dotted word: 'lab.note.fourPLForm', 'models.col.or', 'ws.col.term'
const PREFIXES = Object.values(AREA_PREFIX).map((p) => p.slice(0, -1));
const KEY = new RegExp(String.raw`^(?:${PREFIXES.join('|')})\.[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z0-9_-]+)*$`);
const missingIn = (key) => ['th', 'en'].filter((lang) => translate(lang, key) === `[${key}]`);

/** Every string in `x` (any depth) that is shaped like a dictionary key. */
function keysIn(x, out = new Set()) {
  if (typeof x === 'string') { if (KEY.test(x)) out.add(x); } else if (Array.isArray(x)) x.forEach((v) => keysIn(v, out));
  else if (x && typeof x === 'object') Object.values(x).forEach((v) => keysIn(v, out));
  return out;
}

const { base, cases } = await allSpecs();
const droppedSeen = new Set();
// Table 1 and the planning tools show their tables on screens of their own (as workspace-m2-words leaves them)
const OWN_SCREEN = new Set(['desc.table1', 'design.randomisation', 'design.sampling']);

// ---- 1. the end-to-end case of every registered method --------------------------------------------------------
for (const c of cases) {
  const { spec } = c;
  test(`${spec.method}: every key its result carries has Thai and English words`, async () => {
    const codebook = c.codebook || (c.needsFarm ? base.codebook : noFarm(base.codebook));
    const { result: env } = await handleRequest('run', { spec, table: spec.input.kind === 'dataset' ? (c.table || base.table) : null, codebook, steps: c.steps || base.steps }, { mode: 'worker' });
    assert.equal(env.status, 'ok');
    // not the spec (column keys, option values) or the provenance: only what the method says
    const keys = keysIn({ values: env.values, tests: env.tests, tables: env.tables, guard: env.guard });
    const problems = [...keys].map((k) => [k, missingIn(k)]).filter(([, m]) => m.length).map(([k, m]) => `${k} (${m.join(', ')})`);
    // the way the result view reads a table and a finding, both languages
    for (const lang of OWN_SCREEN.has(spec.method) ? [] : ['th', 'en']) {
      const t = (k, p) => translate(lang, k, p);
      const columnName = columnNameFor(codebook, lang);
      for (const tb of env.tables || []) {
        const x = envTableText(tb, t, { spec, codebook, columnName });
        if (x.caption === tb.id || /\[[a-zA-Z][\w.:-]*\]/.test(x.caption)) problems.push(`${lang} caption of table ${tb.id}`);
        tb.columns.forEach((col, i) => { if (/\[[a-zA-Z][\w.:-]*\]/.test(x.columns[i])) problems.push(`${lang} column ${col} of table ${tb.id}`); });
      }
      for (const g of [...env.guard.stops, ...env.guard.warnings, ...env.guard.notes]) {
        const x = guardText(g, t);
        if (/\[[a-zA-Z][\w.:-]*\]/.test(`${x.title || ''} ${x.body || ''}`)) problems.push(`${lang} finding ${g.id} ${g.key}`);
      }
    }
    for (const d of env.provenance.rowsDropped || []) droppedSeen.add(d.reason);
    assert.deepEqual(problems, []);
  });
}

// ---- 2. the keys the modules name ------------------------------------------------------------------------------
const MODULES = ['lib/stats', 'lib/models'].flatMap((dir) => readdirSync(`${SRC}${dir}`).filter((f) => f.endsWith('.js')).map((f) => `${dir}/${f}`));
const QUOTE = '[\'"`]';
const LITERAL = new RegExp(`${QUOTE}((?:${PREFIXES.join('|')})` + String.raw`\.[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z0-9_-]+)*)` + QUOTE, 'g');
const TEMPLATE = new RegExp('`' + `((?:${PREFIXES.join('|')})` + String.raw`\.[A-Za-z0-9_.]*)\$\{`, 'g');
const sources = new Map(MODULES.map((m) => [m, readFileSync(`${SRC}${m}`, 'utf8')]));

test('the statistics and model modules were found, so the scan below is not empty', () => {
  assert.ok(MODULES.includes('lib/stats/curves.js') && MODULES.includes('lib/models/negbin.js') && MODULES.includes('lib/stats/qpcr.js'));
  assert.ok(MODULES.length >= 30, `${MODULES.length} modules`);
});

test('every dictionary key written as a literal in lib/stats and lib/models has Thai and English words', () => {
  const problems = [];
  let seen = 0;
  for (const [m, src] of sources) {
    for (const hit of src.matchAll(LITERAL)) {
      seen++;
      const gone = missingIn(hit[1]);
      if (gone.length) problems.push(`${m}: ${hit[1]} (${gone.join(', ')})`);
    }
  }
  assert.ok(seen > 200, `only ${seen} keys found: the pattern stopped matching`);
  assert.deepEqual(problems, []);
});

/** The suffixes of the keys the modules build from a value, from the values the option allows (spec.js). */
const allowed = (method, option) => ALLOWED[method][option].options.map(String);
const FAMILIES = {
  'lab.note.unbalanced': () => allowed('anova.twoWay', 'ssType'),
  'lab.note.sphericity.': () => allowed('anova.repeated', 'sphericity'),
  'lab.note.hfCapped': () => ['Time', 'FactorB', 'TimeFactorB'],
  'lab.note.aucBaseline.': () => allowed('calc.auc', 'baseline'),
  'lab.note.equation.': () => allowed('nls.equation', 'equation'),
  'lab.note.pcaScale.': () => ['true', 'false'],
  'lab.note.qpcrMethod.': () => allowed('qpcr.relative', 'method'),
  'lab.note.adjust.': () => allowed('posthoc.dunn', 'adjust'),
  'lab.power.formula.t.': () => allowed('power.tTest', 'type'),
};

test('every key a module builds from a value has words for every value the option allows', () => {
  const found = new Set();
  for (const src of sources.values()) for (const hit of src.matchAll(TEMPLATE)) found.add(hit[1]);
  const undeclared = [...found].filter((p) => !FAMILIES[p]);
  assert.deepEqual(undeclared, [], 'a module builds a key from a value: declare its family (and its values) in FAMILIES');
  const problems = [];
  for (const [prefix, values] of Object.entries(FAMILIES)) {
    assert.ok(found.has(prefix), `${prefix}: no module builds it any more; remove it from FAMILIES`);
    const list = values();
    assert.ok(list.length > 0, prefix);
    for (const v of list) {
      const gone = missingIn(prefix + v);
      if (gone.length) problems.push(`${prefix}${v} (${gone.join(', ')})`);
    }
  }
  assert.deepEqual(problems, []);
});

test('a refusal that explains itself with a note has words for the note: lab.invalid.X gives lab.note.refused.X', () => {
  const src = sources.get('lib/stats/curves.js');
  const withNote = [...src.matchAll(/refuse\('(lab\.invalid\.[A-Za-z0-9]+)',\s*\{/g)].map((m) => m[1]);
  assert.ok(withNote.length >= 4, `${withNote.length} refusals with a note found`);
  const problems = [];
  for (const reason of new Set(withNote)) {
    for (const key of [reason, reason.replace('lab.invalid.', 'lab.note.refused.')]) {
      const gone = missingIn(key);
      if (gone.length) problems.push(`${key} (${gone.join(', ')})`);
    }
  }
  assert.deepEqual(problems, []);
});

// ---- 3. rows a method leaves out ----------------------------------------------------------------------------
test('the dropped-row reasons are the ones types.js names, and each has words in both languages', () => {
  const types = readFileSync(`${SRC}lib/runtime/types.js`, 'utf8');
  const named = [...types.match(/@property \{\{reason: ([^,}]+)/)[1].matchAll(/'(\w+)'/g)].map((m) => m[1]);
  assert.ok(named.includes('missing') && named.includes('incomplete'), named.join(', '));
  for (const r of named) assert.deepEqual(missingIn(`runtime.prov.drop.${r}`), [], `runtime.prov.drop.${r}`);
  // what the methods report (the cases above) and what the modules write as a reason
  const written = new Set();
  for (const src of sources.values()) for (const hit of src.matchAll(/reason: '(\w+)', column/g)) written.add(hit[1]);
  for (const r of [...droppedSeen, ...written]) assert.ok(named.includes(r), `a method reports the dropped-row reason '${r}', which types.js does not name`);
});
