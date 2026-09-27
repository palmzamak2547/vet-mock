// The workspace's pure helpers: dictionary key segments, dates with their era, what each grid cell
// shows, the import questions, the method panels and the specs they build. The specs are checked
// against the runtime's own contract (normalizeSpec + validateSpec), so the screens cannot drift from
// what the engine accepts. OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keyPart } from '../../src/workspace/lib/keys.js';
import { canonicalDay, daysToParts, eraTag, formatDayCell, formatMoment, toBE } from '../../src/workspace/lib/era.js';
import { cellCanonical, cellInfo, cellText, editedCells, filterRows, nextTypedRowId, rawColumnIndex, rawRowIndex, rowCounts, visibleColumns } from '../../src/workspace/lib/grid-model.js';
import { canConfirm, openCount, piiConversions, plainConversions, questionsOf } from '../../src/workspace/lib/import-questions.js';
import { answerPreview, buildPreview } from '../../src/lib/intake/preview.js';
import intakeDict from '../../src/i18n/intake.js';
import { readFileSync } from 'node:fs';
import { METHOD_UI, buildSpec, columnsForRole, initialChoices, methodsForPane, missingRoles, rolesFor } from '../../src/workspace/lib/method-ui.js';
import { nameFromFile, projectFileName, safeFileBase } from '../../src/workspace/lib/files.js';
import { herdGroups, herdLayout } from '../../src/workspace/lib/herd.js';
import { DESIGNS } from '../../src/lib/epi/design.js';
import { COMMON_OPTIONS, DEFAULT_OPTIONS, normalizeSpec, validateSpec } from '../../src/lib/runtime/spec.js';
import { parseRoute, routePath } from '../../src/router.js';

test('keyPart turns ids with hyphens and dots into one lowerCamel segment', () => {
  assert.equal(keyPart('row-exclude'), 'rowExclude');
  assert.equal(keyPart('mh-within'), 'mhWithin');
  assert.equal(keyPart('two.sided'), 'twoSided');
  assert.equal(keyPart('pairwise-t-holm'), 'pairwiseTHolm');
  assert.equal(keyPart('utf-8'), 'utf8');
  assert.equal(keyPart('course-1.96'), 'course196');
  assert.equal(keyPart(1000), '1000');
  assert.equal(keyPart(true), 'true');
});

test('dates: days since 1970 to calendar parts, Thai cells in BE, English in CE, era named', () => {
  // 2024-02-29 is day 19782 (Date.UTC(2024, 1, 29) / 86400000); in BE that is 29/02/2567.
  const d = Date.UTC(2024, 1, 29) / 86400000;
  assert.deepEqual(daysToParts(d), { y: 2024, m: 2, d: 29 });
  assert.equal(canonicalDay(d), '2024-02-29');
  assert.equal(formatDayCell(d, 'th'), '29/02/2567');
  assert.equal(formatDayCell(d, 'en'), '2024-02-29');
  assert.equal(daysToParts(NaN), null);
  assert.equal(canonicalDay(NaN), '');
  assert.equal(toBE(2026), 2569);
  assert.equal(eraTag('th'), 'พ.ศ.');
  assert.equal(eraTag('en'), 'CE');
  const when = new Date(2026, 8, 25, 14, 5);
  assert.equal(formatMoment(when, 'th'), '25 ก.ย. 2569 (พ.ศ.)');
  assert.equal(formatMoment(when, 'en'), '25 Sep 2026 CE');
  assert.equal(formatMoment(when, 'en', { time: true }), '25 Sep 2026 CE 14:05');
  assert.equal(formatMoment('not a date', 'th'), '');
});

// A small working table: 5 rows, a number column with one missing, a category, a date, a farm id.
function smallTable() {
  const rowIds = ['r1', 'r2', 'r3', 'r4', 'n1'];
  return {
    rowIds,
    n: rowIds.length,
    excluded: { r4: 'step-3' },
    columns: {
      c1: { kind: 'number', values: Float64Array.from([12, NaN, 30.5, 8, 5]), missing: Uint8Array.from([0, 2, 0, 0, 0]) },
      c2: { kind: 'category', levels: ['บวก', 'ลบ'], values: Int32Array.from([0, 1, 0, -1, 1]), missing: Uint8Array.from([0, 0, 0, 3, 0]) },
      c3: { kind: 'date', values: Float64Array.from([Date.UTC(2026, 7, 15) / 86400000, NaN, NaN, NaN, NaN]), missing: Uint8Array.from([0, 1, 1, 1, 1]) },
      c4: { kind: 'category', levels: ['F01', 'F02'], values: Int32Array.from([0, 0, 1, 1, 1]), missing: Uint8Array.from([0, 0, 0, 0, 0]) },
    },
  };
}
const codebook = {
  unitOfAnalysis: 'animal',
  clusterKey: 'c4',
  columns: [
    { key: 'c1', name: 'อายุ', labelTh: 'อายุ (เดือน)', labelEn: 'Age (months)', type: 'continuous', role: 'exposure', level: 'animal', levels: [], hidden: false, pii: null },
    { key: 'c2', name: 'ผล', labelTh: 'ผล ELISA', labelEn: 'ELISA', type: 'binary', role: 'outcome', level: 'animal', levels: [{ value: 'บวก' }, { value: 'ลบ' }], positive: 'บวก', reference: 'ลบ', hidden: false, pii: null },
    { key: 'c3', name: 'วันเก็บ', type: 'date', role: 'none', level: 'animal', levels: [], hidden: false, pii: null },
    { key: 'c4', name: 'ฟาร์ม', type: 'id', role: 'cluster', level: 'animal', levels: [], hidden: false, pii: null },
    { key: 'c5', name: 'เบอร์โทร', type: 'text', role: 'none', level: 'farm', levels: [], hidden: true, pii: 'phone' },
    { key: 'd1', name: 'อายุ (เป็นช่วง)', type: 'binary', role: 'exposure', level: 'animal', levels: [{ value: 'น้อยกว่า 24' }, { value: '24 ขึ้นไป' }], reference: 'น้อยกว่า 24', hidden: false, pii: null },
  ],
};
const raw = {
  header: ['อายุ', 'ผล', 'วันเก็บ', 'ฟาร์ม', 'เบอร์โทร'],
  rowIds: ['r1', 'r2', 'r3', 'r4'],
  columns: [['๑๒', '99', '30.5', '8'], ['บวก', 'ลบ', 'บวก', ''], ['15/08/2569', '', '', ''], ['F01', 'F01', 'F02', 'F02'], ['0001', '0002', '0003', '0004']],
};

test('grid: personal-data columns stay out, derived columns are marked, raw columns are found by key and name', () => {
  const cols = visibleColumns(codebook);
  assert.deepEqual(cols.map((c) => c.key), ['c1', 'c2', 'c3', 'c4', 'd1']);
  assert.equal(cols.find((c) => c.key === 'd1').derived, true);
  assert.equal(visibleColumns(codebook, { showHidden: true }).length, 6);
  const rc = rawColumnIndex(codebook, raw);
  assert.equal(rc.get('c1'), 0);
  assert.equal(rc.get('c5'), 4);
  assert.equal(rc.has('d1'), false);
  assert.equal(rawRowIndex(raw).get('r3'), 2);
});

test('grid cells: text in the page language, canonical text for edits, converted and missing cells', () => {
  const table = smallTable();
  assert.equal(cellText(table.columns.c1, 0, 'th'), '12');
  assert.equal(cellText(table.columns.c1, 1, 'th'), '', 'missing prints as empty; the grid adds the dash and the reason');
  assert.equal(cellText(table.columns.c2, 0, 'en'), 'บวก');
  assert.equal(cellText(table.columns.c3, 0, 'th'), '15/08/2569');
  assert.equal(cellText(table.columns.c3, 0, 'en'), '2026-08-15');
  assert.equal(cellCanonical(table.columns.c3, 0), '2026-08-15');
  const ctx = { table, raw, rawCols: rawColumnIndex(codebook, raw), rawRows: rawRowIndex(raw), edited: editedCells([{ kind: 'cell-edit', params: { rowId: 'r3', column: 'c1' } }]) };
  const thaiDigits = cellInfo(ctx, 'c1', 0, 'th');
  assert.equal(thaiDigits.converted, true, 'the file said ๑๒, the grid says 12');
  assert.equal(thaiDigits.rawText, '๑๒');
  assert.equal(cellInfo(ctx, 'c3', 0, 'th').converted, false, 'a BE date read as the same day is not a conversion');
  assert.equal(cellInfo(ctx, 'c1', 2, 'th').edited, true);
  assert.equal(cellInfo(ctx, 'c1', 2, 'th').converted, false, 'an edited cell is marked edited, not converted');
  const missing = cellInfo(ctx, 'c1', 1, 'th');
  assert.equal(missing.missing, 2);
  assert.equal(missing.rawText, '99');
  const cols = visibleColumns(codebook);
  assert.deepEqual(filterRows(ctx, cols, 'missing', '', 'th'), [1, 2, 3, 4], 'not applicable (code 3) alone is not a gap, but r4 also has blank dates');
  assert.deepEqual(filterRows(ctx, cols, 'excluded', '', 'th'), [3]);
  assert.deepEqual(filterRows(ctx, cols, 'all', 'f02', 'th'), [2, 3, 4], 'search looks at the farm id');
  assert.deepEqual(rowCounts(ctx, cols, 'th'), { all: 5, missing: 4, converted: 1, excluded: 1 });
  assert.equal(nextTypedRowId(['r1', 'n1', 'n7', 'r2']), 'n8');
  assert.equal(nextTypedRowId([]), 'n1');
});

test('import questions on the serosurvey file: two questions wait, answering them through intake unblocks the import', async () => {
  // tests/fixtures/serosurvey/serosurvey-2569.csv (windows-874, 728 cows, 49 farms; numbers.json 'conv').
  const bytes = readFileSync(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url));
  const pv = await buildPreview(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), { fileName: 'serosurvey-2569.csv' });
  const qs = questionsOf(pv);
  const waiting = qs.filter((q) => q.waiting);
  assert.deepEqual(waiting.map((q) => q.conv.kind).sort(), ['excel-date-id', 'two-digit-year'], 'the board: Excel IDs and two-digit years need the student');
  assert.equal(openCount(pv), 2);
  assert.equal(canConfirm(pv), false, 'the confirm button waits (G26)');
  assert.ok(qs.every((q) => q.options.length > 0), 'every question has its choices');
  assert.equal(new Set(qs.map((q) => q.questionId)).size, qs.length, 'one entry per question');
  assert.ok(qs.indexOf(waiting[0]) < qs.indexOf(qs.find((q) => !q.waiting)), 'waiting questions come first');
  for (const q of qs) for (const o of q.options) assert.ok(intakeDict.th[o.key] && intakeDict.en[o.key], `option text ${o.key}`);
  assert.deepEqual(piiConversions(pv).map((c) => c.column).sort(), ['c3', 'c4'], 'owner name and phone are personal data');
  assert.ok(plainConversions(pv).applied.some((c) => c.kind === 'thai-digits'));
  let next = pv;
  for (const q of waiting) next = answerPreview(next, { [q.questionId]: q.options[0].value });
  assert.equal(openCount(next), 0);
  assert.equal(canConfirm(next), true);
  assert.equal(next.importStep.kind, 'import-conversions');
});

test('design first: a pane offers only the methods the chosen design allows, none without a design', () => {
  const cc = DESIGNS.find((d) => d.id === 'case-control');
  const assoc = methodsForPane('assoc', cc).map((o) => o.method);
  assert.ok(assoc.includes('epi.twoByTwo'));
  assert.ok(!assoc.includes('test.tTest'), 'case-control offers no t-test in M1');
  assert.deepEqual(methodsForPane('prev', cc).map((o) => o.method).filter((m) => m.startsWith('freq.')), [], 'no prevalence or risk from a case-control study');
  assert.deepEqual(methodsForPane('assoc', null), []);
  const cs = DESIGNS.find((d) => d.id === 'cross-sectional');
  assert.deepEqual(methodsForPane('assoc', cs).find((o) => o.method === 'epi.twoByTwo').measures, ['PR', 'POR', 'PD']);
});

test('method panels: personal data never offered, codebook roles fill the first choices, gaps named', () => {
  const outcomeSpec = rolesFor('epi.twoByTwo')[0];
  assert.ok(columnsForRole(codebook, { role: 'x', accept: ['text'] }).every((c) => !c.pii), 'the phone column is never a choice');
  assert.deepEqual(columnsForRole(codebook, outcomeSpec).map((c) => c.key), ['c2', 'd1']);
  const ch = initialChoices('epi.twoByTwo', codebook);
  assert.equal(ch.roles.outcome, 'c2');
  assert.equal(ch.levels.outcomePositive, 'บวก');
  assert.equal(ch.roles.exposure, 'd1');
  assert.equal(ch.levels.referenceLevel, 'น้อยกว่า 24');
  assert.equal(ch.levels.exposureLevel, '24 ขึ้นไป', 'the exposed level is the other level of a two-level exposure');
  assert.deepEqual(missingRoles('epi.twoByTwo', ch), []);
  assert.deepEqual(missingRoles('epi.twoByTwo', { roles: {}, levels: {} }), ['outcome', 'exposure']);
  assert.deepEqual(rolesFor('test.tTest', { variant: 'paired' }).map((r) => r.role), ['x', 'y']);
  assert.deepEqual(rolesFor('test.tTest', { variant: 'one-sample' }).map((r) => r.role), ['outcome']);
});

test('every spec the panels can build is one the engine accepts (normalizeSpec + validateSpec)', () => {
  const problems = [];
  for (const [method, ui] of Object.entries(METHOD_UI)) {
    const base = { ...COMMON_OPTIONS, ...(DEFAULT_OPTIONS[method] || {}) };
    const variants = [base];
    for (const [name, vals] of Object.entries(ui.options || {})) for (const v of vals) variants.push({ ...base, [name]: v });
    for (const options of variants) {
      const roles = {};
      for (const r of rolesFor(method, options)) roles[r.role] = r.multiple ? ['c1'] : 'c2';
      if (ui.needsCluster) roles.cluster = 'c4';
      const extra = {};
      if (ui.params && ui.pane !== 'tool') for (const k of ui.params) extra[k] = 0.9;
      const spec = buildSpec({
        method, datasetId: 'ds', recipeRev: 3, design: 'cross-sectional', roles, levels: {}, options: { ...options, ...extra },
        cluster: { route: null, column: 'c4' },
        counts: ui.counts ? Object.fromEntries(ui.counts.map((k) => [k, 7])) : null,
        params: ui.pane === 'tool' ? Object.fromEntries((ui.params || []).map((k) => [k, 0.5])) : null,
      });
      const res = validateSpec(normalizeSpec(spec, codebook));
      if (!res.ok) problems.push(`${method} ${JSON.stringify(options)}: ${JSON.stringify(res.issues)}`);
    }
  }
  assert.deepEqual(problems, []);
});

test('buildSpec: input by method kind, empty roles dropped, cluster route carried', () => {
  const s = buildSpec({ method: 'freq.incidenceRate', counts: { cases: 7, animalTime: 1089 } });
  assert.deepEqual(s.input, { kind: 'counts', counts: { cases: 7, animalTime: 1089 } });
  const d = buildSpec({ method: 'epi.twoByTwo', datasetId: 'ds', recipeRev: 2, roles: { outcome: 'c2', exposure: null, covariates: [] }, cluster: { route: 'mh-within', column: 'c4' } });
  assert.deepEqual(d.input, { kind: 'dataset', datasetId: 'ds', recipeRev: 2 });
  assert.deepEqual(d.roles, { outcome: 'c2' });
  assert.deepEqual(d.cluster, { route: 'mh-within', column: 'c4' });
  assert.equal(buildSpec({ method: 'ss.mean', params: { sd: 0.5 } }).input.kind, 'params');
});

test('herd picture groups: one group per farm, positives counted from the rows in use', () => {
  const table = smallTable();
  const groups = herdGroups(table, 'c4', 'c2', 'บวก');
  assert.deepEqual(groups, [{ id: 'F01', n: 2, pos: 1 }, { id: 'F02', n: 2, pos: 1 }], 'r4 is excluded, the rest keep their farm');
  const L = herdLayout(groups, { cols: 7 });
  assert.equal(L.dots.length, 4);
  assert.equal(L.dots.filter((d) => d.pos).length, 2);
  assert.deepEqual(herdGroups(table, 'c4', 'c1', 'x'), [], 'a number column is not an outcome for the picture');
});

test('file names: safe on every file system, Thai kept, project files dated', () => {
  assert.equal(projectFileName('สำรวจ brucellosis: ฟาร์ม/2569', new Date(2026, 8, 27)), 'สำรวจ-brucellosis-ฟาร์ม-2569-2026-09-27.vmresearch.json');
  assert.equal(nameFromFile('serosurvey_2569-final.csv'), 'serosurvey 2569 final');
  assert.equal(safeFileBase('ความชุก ELISA?'), 'ความชุก-ELISA');
  assert.equal(safeFileBase(''), 'result');
});

test('routes round-trip for every pane', () => {
  for (const pane of ['import', 'codebook', 'data', 'design', 'prev', 'assoc', 'table1', 'report']) {
    const p = `/app/p/3f2a9c1b-0000-4000-8000-000000000001/${pane}`;
    assert.equal(routePath(parseRoute(p)), p);
  }
});
