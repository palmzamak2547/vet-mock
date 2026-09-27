// Every dictionary key the workspace screens build exists in both languages, and no visible Thai
// text sits in workspace code [M1-DESIGN.md 4.1, 4.3]. Static keys are read from the source files;
// keys built from a template (`ws.opt.${name}.${value}`) are enumerated from the same data the
// screens build them from (METHOD_UI, DESIGNS, STEP_KINDS, LOG_KINDS, the course fixture), so a new
// option, design or step kind without its words turns this test red. OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import workspace from '../../src/i18n/workspace.js';
import report from '../../src/i18n/report.js';
import common from '../../src/i18n/common.js';
import terms from '../../src/i18n/terms.js';
import epi from '../../src/i18n/epi.js';
import stats from '../../src/i18n/stats.js';
import runtime from '../../src/i18n/runtime.js';
import intake from '../../src/i18n/intake.js';
import { METHOD_UI, ALTERNATIVES, rolesFor } from '../../src/workspace/lib/method-ui.js';
import { keyPart } from '../../src/workspace/lib/keys.js';
import { MISSING_KEYS } from '../../src/workspace/lib/grid-model.js';
import { exampleParams } from '../../src/workspace/lib/sample-size.js';
import { strobeStatus } from '../../src/workspace/report/strobe.js';
import { DESIGNS } from '../../src/lib/epi/design.js';
import { STEP_KINDS } from '../../src/lib/intake/recipe.js';
import { LOG_KINDS } from '../../src/lib/store/log.js';
import { ROLE_NAMES, LEVEL_NAMES, CLUSTER_ROUTES } from '../../src/lib/runtime/spec.js';
import { getMethod } from '../../src/lib/runtime/catalog.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(here, '../../src');
const course = JSON.parse(readFileSync(path.resolve(here, '../fixtures/course/epi-course-2026.json'), 'utf8'));

const OWN = { th: { ...workspace.th, ...report.th, ...common.th, ...terms.th }, en: { ...workspace.en, ...report.en, ...common.en, ...terms.en } };
const ALL = {
  th: { ...OWN.th, ...epi.th, ...stats.th, ...runtime.th, ...intake.th },
  en: { ...OWN.en, ...epi.en, ...stats.en, ...runtime.en, ...intake.en },
};

function files(dir) {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) out.push(...files(p));
    else if (/\.(jsx?|mjs)$/.test(f)) out.push(p);
  }
  return out;
}
const CODE = [...files(path.join(src, 'workspace')), path.join(src, 'App.jsx'), path.join(src, 'router.js')];

/** Source text without comments (strings stay). Good enough for this code base: no '//' inside regexes that matter here. */
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1');
}

function need(keys, where, dict = OWN) {
  const missing = [];
  for (const k of keys) for (const lang of ['th', 'en']) if (dict[lang][k] === undefined) missing.push(`${lang} ${k}`);
  assert.deepEqual(missing, [], `${where}: missing keys`);
}

test('every static key in workspace code exists in th and en', () => {
  const keys = new Set();
  for (const f of CODE) {
    const s = stripComments(readFileSync(f, 'utf8'));
    for (const m of s.matchAll(/['"`]((?:ws|common|term|report)\.[A-Za-z0-9_.]+)['"`]/g)) keys.add(m[1]);
  }
  assert.ok(keys.size > 300, `only ${keys.size} keys found; the scan is broken`);
  need([...keys], 'static keys');
});

test('no Thai text in workspace code (every visible string comes from a dictionary)', () => {
  const bad = [];
  for (const f of CODE) {
    const s = stripComments(readFileSync(f, 'utf8'));
    s.split('\n').forEach((line, i) => { if (/[฀-๿]/.test(line)) bad.push(`${path.relative(src, f)}:${i + 1}`); });
  }
  assert.deepEqual(bad, []);
});

test('option labels and values for every option the analysis and sample-size screens offer', () => {
  const keys = ['ws.opt.confLevel.label', 'ws.opt.alternative.label', ...ALTERNATIVES.map((v) => `ws.opt.alternative.${keyPart(v)}`)];
  for (const ui of Object.values(METHOD_UI)) {
    for (const [name, vals] of Object.entries(ui.options || {})) {
      if (vals.length > 1) keys.push(`ws.opt.${name}.label`);
      for (const v of vals) keys.push(`ws.opt.${name}.${keyPart(v)}`);
    }
  }
  keys.push('ws.opt.quantileType.7', 'ws.opt.quantileType.6', 'ws.opt.quantileType.label');
  need(keys, 'options');
});

test('roles, level pickers, counts and parameters the analysis screens ask for', () => {
  const keys = [];
  for (const [id, ui] of Object.entries(METHOD_UI)) {
    const variants = id === 'test.tTest' ? ['welch', 'paired', 'one-sample'] : [undefined];
    for (const variant of variants) {
      for (const r of rolesFor(id, variant ? { variant } : {})) {
        keys.push(`ws.role.${r.role}`);
        if (!r.multiple) keys.push(`ws.roleHint.${r.role}`);
        if (r.level) keys.push(`ws.level.pick.${r.level}`);
        if (r.reference) keys.push(`ws.level.pick.${r.reference}`);
      }
    }
    for (const c of ui.counts || []) keys.push(`ws.counts.${c}`);
    if (ui.pane !== 'tool') for (const p of ui.params || []) keys.push(`ws.param.${p}`);
  }
  for (const r of ROLE_NAMES) keys.push(`ws.role.${r}`, `report.role.${r}`);
  for (const l of LEVEL_NAMES.filter((x) => x !== 'order')) keys.push(`ws.level.pick.${l}`);
  need(keys, 'roles');
});

test('sample-size fields have a label, including every field a course example fills', () => {
  const label = (method, k) => [`ws.ss.param.${keyPart(method)}.${keyPart(k)}`, `ws.ss.param.${keyPart(k)}`].some((key) => OWN.th[key] && OWN.en[key]);
  const missing = [];
  for (const [id, ui] of Object.entries(METHOD_UI)) {
    if (ui.pane !== 'tool') continue;
    for (const k of ui.params || []) if (!label(id, k)) missing.push(`${id} ${k}`);
    for (const item of course.items.filter((i) => i.method === id)) for (const k of Object.keys(exampleParams(item).params)) if (!label(id, k)) missing.push(`${id} ${k} (course ${item.id})`);
  }
  assert.deepEqual(missing, []);
});

test('designs, routes, steps, log kinds, missing reasons, strobe items and other enumerations', () => {
  const keys = [];
  for (const d of DESIGNS) keys.push(`ws.design.en.${keyPart(d.id)}`);
  for (const r of [...CLUSTER_ROUTES, 'gee', 'mixed']) {
    keys.push(`ws.route.${keyPart(r)}.short`);
    if (r !== 'none') keys.push(`ws.route.${keyPart(r)}.title`, `ws.route.${keyPart(r)}.desc`);
    if (!['none', 'gee', 'mixed'].includes(r)) keys.push(`report.methods.route.${keyPart(r)}`);
  }
  for (const k of STEP_KINDS) keys.push(`ws.steps.kind.${keyPart(k)}`);
  for (const k of LOG_KINDS) keys.push(`ws.log.kind.${keyPart(k)}`);
  for (const k of Object.values(MISSING_KEYS)) keys.push(k);
  for (const r of ['unknown', 'not-applicable', 'not-recorded']) keys.push(`ws.missing.${keyPart(r)}`);
  for (const s of strobeStatus({ analyses: [], steps: [], codebook: null })) keys.push(`ws.strobe.${s.key}.title`, `ws.strobe.${s.key}.ok`, `ws.strobe.${s.key}.open`);
  for (const t of ['continuous', 'count', 'binary', 'nominal', 'ordinal', 'date', 'id', 'text']) keys.push(`ws.type.${t}`);
  for (const r of ['outcome', 'exposure', 'confounder', 'group', 'cluster', 'id', 'pair', 'rater', 'time', 'none']) keys.push(`ws.cbrole.${r}`);
  for (const l of ['animal', 'farm', 'pen', 'household', 'litter', 'sample', 'visit', 'region']) keys.push(`ws.level.${l}`);
  for (const u of ['animal', 'sample', 'visit', 'farm']) keys.push(`ws.codebook.unit.${u}`);
  for (const p of ['name', 'phone', 'national-id', 'address', 'line-id', 'email']) keys.push(`ws.pii.${keyPart(p)}`);
  for (const f of ['all', 'missing', 'converted', 'excluded']) keys.push(`ws.grid.filter.${f}`);
  for (const e of ['auto', 'utf-8', 'windows-874', 'utf-16le']) keys.push(`ws.import.encoding.${keyPart(e)}`);
  for (const th of ['system', 'light', 'dark']) keys.push(`ws.account.theme.${th}`);
  for (const w of [84, 120, 174]) keys.push(`ws.chart.width.${w}`);
  for (const p of ['prev', 'assoc']) keys.push(`ws.rail.${p}`, `ws.analysis.${p}.title`, `ws.analysis.${p}.sub`);
  for (const k of ['levels', 'missing', 'noP', 'skewed', 'thaiOrder']) keys.push(`ws.table1.rule.${k}`);
  for (const s of ['typed', 'literature', 'median', 'quantile']) keys.push(`ws.steps.cutSource.${s}`);
  for (const o of ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'missing', 'present']) keys.push(`ws.steps.op.${o}`);
  for (const u of ['months', 'days', 'years']) keys.push(`ws.steps.unit.${u}`);
  for (let m = 1; m <= 12; m += 1) keys.push(`ws.date.month.${m}`);
  need(keys, 'enumerations');
});

test('names the screens show from other areas exist (design names, method names, route reasons)', () => {
  const keys = [];
  for (const d of DESIGNS) {
    keys.push(d.nameKey, d.descKey);
    for (const b of d.blocked) keys.push(b.reasonKey);
    for (const o of d.offers) { const m = getMethod(o.method); if (m) keys.push(m.nameKey); }
  }
  for (const id of Object.keys(METHOD_UI)) { const m = getMethod(id); if (m) keys.push(m.nameKey); }
  need(keys.filter(Boolean), 'names from other areas', ALL);
});
