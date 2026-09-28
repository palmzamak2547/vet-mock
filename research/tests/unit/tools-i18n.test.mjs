// Every tools.* word the tool screens and the planning methods use exists in Thai and English: static keys
// are read from the source, and keys built from a template are enumerated from the same lists the
// screens build them from [M2-DESIGN.md 9]. The workspace coverage test scans ws./common./report. keys
// only, so this one covers tools.*. OWNER: ui-tools role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tools from '../../src/i18n/tools.js';
import workspace from '../../src/i18n/workspace.js';
import { keyPart } from '../../src/workspace/lib/keys.js';
import { AGG_FNS } from '../../src/workspace/screens/tools/tools-model.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(here, '../../src');
const FILES = [
  ...readdirSync(path.join(src, 'workspace/screens/tools')).map((f) => path.join(src, 'workspace/screens/tools', f)),
  ...['ImportPane.jsx', 'CodebookPane.jsx', 'Projects.jsx', 'SampleSize.jsx', 'useProject.js'].map((f) => path.join(src, 'workspace/screens', f)),
  ...readdirSync(path.join(src, 'lib/plan')).map((f) => path.join(src, 'lib/plan', f)),
];
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1');

function need(keys, where) {
  const missing = [];
  for (const k of keys) for (const lang of ['th', 'en']) if (tools[lang][k] === undefined) missing.push(`${lang} ${k}`);
  assert.deepEqual(missing, [], `${where}: missing`);
}

test('every static tools.* key in the tool screens and planning code exists in th and en', () => {
  const keys = new Set();
  for (const f of FILES) {
    const s = strip(readFileSync(f, 'utf8'));
    for (const m of s.matchAll(/['"`](tools\.[A-Za-z0-9_.]+)['"`]/g)) keys.add(m[1]);
  }
  assert.ok(keys.size > 250, `only ${keys.size} keys found; the scan is broken`);
  need([...keys], 'static');
});

test('keys built from templates exist', () => {
  const keys = [];
  for (const fns of Object.values(AGG_FNS)) for (const f of fns) keys.push(`tools.aggregate.fn.${f}`, `tools.aggregate.fnHint.${f}`, `tools.aggregate.nameFor.${f}`);
  for (const fn of ['abs', 'sqrt', 'ln', 'log10', 'exp', 'round', 'floor', 'ceil', 'min', 'max', 'sum', 'mean', 'if', 'isMissing', 'daysBetween', 'monthsBetween']) keys.push(`tools.compute.fn.${fn}`);
  for (const x of ['number', 'boolean']) keys.push(`tools.compute.type.${x}`);
  for (const c of ['ineligible', 'lost', 'protocol-deviation', 'measurement-error', 'duplicate', 'other']) keys.push(`tools.clean.cat.${keyPart(c)}`);
  for (const m of ['power.anova', 'power.tTest', 'power.correlation', 'power.regression']) keys.push(`tools.power.about.${keyPart(m)}`);
  for (const s of ['n', 'power']) keys.push(`tools.power.headline.${s}`, `tools.power.run.${s}`, `tools.power.solve.${s}`, `tools.power.hint.${s}`, `tools.power.param.${s}`);
  for (const k of ['groups', 'betweenVar', 'withinVar', 'delta', 'sd', 'r', 'u', 'f2', 'm', 'icc']) keys.push(`tools.power.param.${k}`, `tools.power.hint.${k}`);
  for (const x of ['two-sample', 'paired', 'one-sample']) keys.push(`tools.power.ttype.${keyPart(x)}`);
  for (const p of ['merge', 'doubleEntry']) keys.push(`tools.purpose.${p}`);
  for (const w of ['full', 'codes', 'key']) keys.push(`tools.random.file.${w}`);
  for (const s of ['simple', 'block', 'stratified-block']) keys.push(`tools.random.scheme.${keyPart(s)}`, `tools.random.schemeHint.${keyPart(s)}`);
  for (const m of ['long', 'wide']) keys.push(`tools.reshape.mode.${m}`, `tools.reshape.modeHint.${m}`);
  for (const a of ['proportional', 'equal']) keys.push(`tools.sampling.allocation.${a}`);
  for (const s of ['simple', 'systematic', 'stratified']) keys.push(`tools.sampling.scheme.${s}`, `tools.sampling.schemeHint.${s}`);
  need(keys, 'templates');
});

test('the ws.* words the tool screens borrow exist (rail, steps, levels)', () => {
  const keys = ['ws.rail.group.dataTools', 'ws.rail.group.tools', 'ws.rail.power', 'ws.rail.randomise', 'ws.rail.sampleSize', 'ws.steps.chooseColumn', 'ws.steps.reasonRequired', 'ws.steps.because', 'ws.steps.added', 'ws.grid.legendMissing', 'ws.ss.noFile', 'ws.analysis.running', 'ws.analysis.notReadyBody', 'ws.action.cancel', 'ws.codebook.col.labelTh', 'ws.codebook.col.labelEn', 'ws.codebook.levelCount'];
  for (const o of ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'missing', 'present']) keys.push(`ws.steps.op.${o}`);
  const bad = keys.filter((k) => !workspace.th[k] || !workspace.en[k]);
  assert.deepEqual(bad, []);
});

test('no Thai text in the tool screens or the planning code', () => {
  const bad = [];
  for (const f of FILES) {
    strip(readFileSync(f, 'utf8')).split('\n').forEach((line, i) => { if (/[฀-๿]/.test(line)) bad.push(`${path.relative(src, f)}:${i + 1}`); });
  }
  assert.deepEqual(bad, []);
});

test('made-up data is named so in both languages', () => {
  assert.equal(tools.th['tools.examples.madeUp'], 'ข้อมูลสมมุติ');
  assert.equal(tools.en['tools.examples.madeUp'], 'made-up data');
});
