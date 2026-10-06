import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../../../tests/helpers/fake-react.mjs';
import { createMemoryDb } from '../../src/lib/store/db.js';
import { createProject } from '../../src/lib/store/projects.js';
import { putDataset, getDataset, listDatasets } from '../../src/lib/store/datasets.js';
import { exportProjectFile, parseProjectFile, importProjectFile } from '../../src/lib/store/project-file.js';
import { proposeCodebook, checkCodebook } from '../../src/lib/intake/codebook.js';
import { applyRecipe, makeStep } from '../../src/lib/intake/recipe.js';
import { analysedCsv } from '../../src/lib/export/analysed-data.js';
import { visibleColumns } from '../../src/workspace/lib/grid-model.js';
import workspaceWords from '../../src/i18n/workspace.js';

globalThis.__visibilityControlT = (key, params = {}) => (workspaceWords.en[key] || key)
  .replace(/\{([^}]+)\}/g, (_, name) => params[name] ?? `{${name}}`);
const { useProject } = await loadModule('research/src/workspace/screens/useProject.js', { stubs: [
  { match: '(^|/)ws-context\\.js$', contents: 'export const useWs = () => globalThis.__visibilityControlContext; export const errorInfo = e => ({ key: e.key || "fixture-error" }); export const newId = () => "fixture-id";' },
  { match: '(^|/)prefs\\.js$', contents: 'export const writePrefs = () => {};' },
] });
const { default: CodebookPane } = await loadModule('research/src/workspace/screens/CodebookPane.jsx', { stubs: [
  { match: '/i18n/index\\.js$', contents: 'export const useT = () => ({ t: globalThis.__visibilityControlT, lang: "en" });' },
  { match: '(^|/)Bits\\.jsx$', contents: 'export const Chip = ({ children }) => children; export const Notice = ({ children }) => children; export const PageHead = () => null;' },
  { match: '(^|/)Icon\\.jsx$', contents: 'export default () => null;' },
  { match: '(^|/)Link\\.jsx$', contents: 'export default ({ children }) => children;' },
  { match: '\\.css$', contents: '' },
] });

const raw = {
  header: ['made-up birth date', 'made-up event date', 'weight', 'group'],
  columns: [['2020-01-01', '2021-01-01', '2022-01-01'], ['2024-01-01', '2024-01-01', '2024-01-01'], ['10', '20', '40'], ['A', 'A', 'B']],
  rowIds: ['r1', 'r2', 'r3'], rowCount: 3,
  source: { fileName: 'made-up-visibility.csv', bytes: 1, sha256: '', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: '2026-10-06T00:00:00.000Z' },
};
function fixture(kind, hidden = true) {
  const codebook = proposeCodebook(raw);
  codebook.columns[0].type = codebook.columns[1].type = 'date';
  codebook.columns[2].type = 'continuous'; codebook.columns[3].type = 'nominal';
  codebook.columns[0].pii = codebook.columns[1].pii = codebook.columns[2].pii = null;
  codebook.columns[0].hidden = codebook.columns[1].hidden = kind === 'derive-age';
  codebook.columns[2].hidden = kind !== 'derive-age';
  const params = kind === 'derive-age' ? { birth: 'c1', event: 'c2', unit: 'years', target: 'd1' }
    : kind === 'bin' ? { column: 'c3', target: 'd1', cutpoints: [25], closed: 'left', labels: ['under25', '25plus'], cutSource: 'typed' }
      : { by: 'c4', summaries: [{ column: 'c3', fn: 'mean', target: 'd1' }] };
  const steps = [makeStep([], kind, params)];
  const entry = { ...applyRecipe(raw, codebook, steps).codebook.columns.find(column => column.key === 'd1'),
    name: `${kind}_reviewed`, hidden, pii: null };
  codebook.columns.push(entry);
  return { codebook, steps };
}
const shape = table => ({ rowIds: table.rowIds, values: Array.from(table.columns.d1.values), missing: Array.from(table.columns.d1.missing) });
const bigSpace = async () => ({ usage: 0, quota: 1e12 });

async function controls(kind, hidden = true) {
  const { codebook, steps } = fixture(kind, hidden);
  const db = createMemoryDb(), notices = [];
  const project = await createProject(db, 'guest', { name: `made-up ${kind}` });
  const meta = await putDataset(db, 'guest', project.id, { raw, codebook, steps });
  globalThis.__visibilityControlContext = { db, owner: 'guest', engine: { apply: applyRecipe }, engineError: null,
    notify: (...message) => notices.push(message), bumpProjects() {} };
  let p, hook;
  const start = async () => {
    hook = mount(() => { p = useProject(project.id); return null; }); await settle(hook, 12);
    assert.equal(p.status, 'ready');
  };
  await start();
  const pane = mount(CodebookPane, { p });
  const checkbox = () => {
    const row = findAll(pane.tree, node => node.type === 'tr' && node.key === 'd1')[0];
    return findAll(row, node => node.type === 'input' && node.props.type === 'checkbox')[0];
  };
  return { db, project, meta, notices, pane, checkbox, get p() { return p; },
    async choose(value) {
      checkbox().props.onChange({ target: { checked: value } }); pane.flush();
      const save = findAll(pane.tree, node => node.type === 'button' && textOf(node) === 'Save codebook')[0];
      assert.equal(save.props.disabled, false);
      await save.props.onClick(); await settle(hook, 12); pane.update({ p });
    },
    async reload() { hook.unmount(); await start(); pane.update({ p }); },
    close() { pane.unmount(); hook.unmount(); },
  };
}

for (const kind of ['derive-age', 'bin', 'aggregate']) {
  test(`explicit ${kind} Show, Hide and Show again persist through actual control, reload and project archive`, async () => {
    const c = await controls(kind);
    try {
      const before = shape(c.p.table);
      const rawHidden = c.p.meta.codebook.columns.filter(column => column.key.startsWith('c') && column.hidden).map(column => column.key);
      assert.equal(c.checkbox().props.checked, true);
      await c.choose(false);
      assert.equal(c.p.codebook.columns.find(column => column.key === 'd1').hidden, false);
      assert.equal(c.p.meta.codebook.columns.find(column => column.key === 'd1').hiddenExplicit, true);
      assert.equal(c.checkbox().props.checked, false);
      assert.ok(textOf(c.pane.tree).includes('All saved'));
      assert.ok(visibleColumns(c.p.codebook).some(column => column.key === 'd1'));
      assert.ok(analysedCsv(c.p.table, c.p.codebook).columns.some(column => column.key === 'd1'));
      assert.deepEqual(shape(c.p.table), before, 'visibility cannot alter numeric results or missing reasons');
      await c.reload();
      assert.equal(c.p.codebook.columns.find(column => column.key === 'd1').hidden, false);
      await c.choose(true);
      assert.equal(c.p.codebook.columns.find(column => column.key === 'd1').hidden, true);
      assert.equal(analysedCsv(c.p.table, c.p.codebook).columns.some(column => column.key === 'd1'), false);
      await c.reload(); assert.equal(c.checkbox().props.checked, true);
      await c.choose(false);
      const archive = await exportProjectFile(c.db, 'guest', c.project.id);
      const text = await archive.text();
      const parsed = await parseProjectFile({ size: Buffer.byteLength(text), text: async () => text });
      assert.equal(parsed.ok, true);
      const copy = await importProjectFile(c.db, 'guest', parsed.data, { estimate: bigSpace });
      const [imported] = await listDatasets(c.db, 'guest', copy.id);
      const loaded = await getDataset(c.db, 'guest', imported.id);
      const replayed = applyRecipe(loaded.raw, loaded.meta.codebook, loaded.meta.steps);
      assert.equal(loaded.meta.codebook.columns.find(column => column.key === 'd1').hiddenExplicit, true);
      assert.equal(replayed.codebook.columns.find(column => column.key === 'd1').hidden, false);
      assert.deepEqual(shape(replayed), before);
      const exported = analysedCsv(replayed, replayed.codebook);
      assert.ok(exported.columns.some(column => column.key === 'd1'));
      assert.equal(exported.columns.some(column => rawHidden.includes(column.key)), false);
      assert.deepEqual(loaded.meta.codebook.columns.filter(column => column.key.startsWith('c') && column.hidden).map(column => column.key), rawHidden);
    } finally { c.close(); }
  });
}

test('the actual checkbox shows effective inherited hiding for unmarked stored false', async () => {
  const c = await controls('bin', false);
  try {
    assert.equal(c.p.meta.codebook.columns.find(column => column.key === 'd1').hidden, false);
    assert.equal(c.p.codebook.columns.find(column => column.key === 'd1').hidden, true);
    assert.equal(c.checkbox().props.checked, true);
    await c.choose(false);
    assert.equal(c.p.codebook.columns.find(column => column.key === 'd1').hidden, false);
  } finally { c.close(); }
});

test('recode and compute honor only a target-authored boolean choice and preserve PII provenance', () => {
  const numeric = { header: ['made-up private number'], columns: [['10', '20']], rowIds: ['r1', 'r2'], rowCount: 2 };
  for (const kind of ['compute', 'recode']) {
    const cb = proposeCodebook(numeric); cb.columns[0].type = 'continuous'; cb.columns[0].hidden = true; cb.columns[0].pii = 'phone';
    const params = kind === 'compute' ? { target: 'd1', expression: '{c1} + 0', type: 'continuous' }
      : { target: 'd1', column: 'c1', map: [{ from: ['10'], to: 'small' }, { from: ['20'], to: 'large' }] };
    const steps = [makeStep([], kind, params)];
    const defaults = applyRecipe(numeric, cb, steps), before = shape(defaults);
    cb.columns.push({ ...defaults.codebook.columns.find(column => column.key === 'd1'), hidden: false, hiddenExplicit: true });
    const shown = applyRecipe(numeric, cb, steps);
    assert.equal(shown.codebook.columns.find(column => column.key === 'd1').hidden, false);
    assert.equal(shown.codebook.columns.find(column => column.key === 'd1').pii, 'phone');
    assert.deepEqual(shape(shown), before);
    for (const invalid of ['true', 1, {}, null, false]) {
      cb.columns.at(-1).hiddenExplicit = invalid;
      assert.equal(applyRecipe(numeric, cb, steps).codebook.columns.find(column => column.key === 'd1').hidden, true);
    }
  }
});

test('reshape-created columns cannot borrow an explicit source choice, while their own Show works', () => {
  const wide = { header: ['id', 'public', 'private'], columns: [['A', 'B'], ['5', '10'], ['10', '20']], rowIds: ['r1', 'r2'], rowCount: 2 };
  const cb = proposeCodebook(wide); cb.columns[0].type = 'id'; cb.columns[1].type = cb.columns[2].type = 'continuous';
  cb.columns[1].hidden = false; cb.columns[1].hiddenExplicit = true; cb.columns[2].hidden = true; cb.columns[2].pii = 'phone';
  const steps = [makeStep([], 'reshape-long', { idColumns: ['c1'], stubs: [{ target: 'd1', columns: ['c2', 'c3'] }], timeTarget: 'd2', times: ['first', 'second'] })];
  const defaults = applyRecipe(wide, cb, steps);
  const target = defaults.codebook.columns.find(column => column.key === 'd1');
  assert.equal(target.hidden, true); assert.notEqual(target.hiddenExplicit, true);
  cb.columns.push({ ...target, hidden: false, hiddenExplicit: true });
  const shown = applyRecipe(wide, cb, steps);
  assert.equal(shown.codebook.columns.find(column => column.key === 'd1').hidden, false);
  assert.equal(shown.codebook.columns.find(column => column.key === 'd1').pii, 'phone');
  assert.deepEqual(shape(shown), shape(defaults));
});

test('merge, reshape-wide and aggregate-first apply the same target identity visibility rule', () => {
  const cases = [];
  const left = { header: ['group'], columns: [['A', 'B']], rowIds: ['r1', 'r2'], rowCount: 2 };
  const right = { header: ['group', 'private'], columns: [['A', 'B'], ['10', '20']], rowIds: ['r1', 'r2'], rowCount: 2 };
  const leftCb = proposeCodebook(left), rightCb = proposeCodebook(right);
  leftCb.columns[0].type = rightCb.columns[0].type = 'id';
  rightCb.columns[1].type = 'continuous'; rightCb.columns[1].hidden = true; rightCb.columns[1].hiddenExplicit = true; rightCb.columns[1].pii = 'phone';
  cases.push({ raw: left, cb: leftCb, target: 'm1', steps: [makeStep([], 'merge', { sourceDatasetId: 'right', sourceRev: 0, leftKey: 'c1', rightKey: 'c1', columns: ['c2'] })],
    sources: { right: { raw: right, codebook: rightCb, steps: [] } } });
  const long = { header: ['id', 'time', 'private'], columns: [['A', 'A', 'B', 'B'], ['first', 'second', 'first', 'second'], ['5', '10', '10', '20']], rowIds: ['r1', 'r2', 'r3', 'r4'], rowCount: 4 };
  const longCb = proposeCodebook(long); longCb.columns[0].type = 'id'; longCb.columns[1].type = 'nominal'; longCb.columns[2].type = 'continuous';
  longCb.columns[2].hidden = true; longCb.columns[2].hiddenExplicit = true; longCb.columns[2].pii = 'phone';
  cases.push({ raw: long, cb: longCb, target: 'w1', steps: [makeStep([], 'reshape-wide', { idColumn: 'c1', timeColumn: 'c2', valueColumns: ['c3'] })] });
  const grouped = { header: ['private', 'group'], columns: [['10', '20', '40'], ['A', 'A', 'B']], rowIds: ['r1', 'r2', 'r3'], rowCount: 3 };
  const groupedCb = proposeCodebook(grouped); groupedCb.columns[0].type = 'continuous'; groupedCb.columns[1].type = 'nominal';
  groupedCb.columns[0].hidden = true; groupedCb.columns[0].hiddenExplicit = true; groupedCb.columns[0].pii = 'phone';
  cases.push({ raw: grouped, cb: groupedCb, target: 'd1', steps: [makeStep([], 'aggregate', { by: 'c2', summaries: [{ column: 'c1', fn: 'first', target: 'd1' }] })] });
  for (const c of cases) {
    const defaults = applyRecipe(c.raw, c.cb, c.steps, c.sources);
    assert.deepEqual(defaults.rejected, []);
    const target = defaults.codebook.columns.find(column => column.key === c.target);
    assert.equal(target.hidden, true); assert.notEqual(target.hiddenExplicit, true);
    const before = Array.from(defaults.columns[c.target].values);
    c.cb.columns.push({ ...target, hidden: false, hiddenExplicit: true });
    const shown = applyRecipe(c.raw, c.cb, c.steps, c.sources);
    assert.equal(shown.codebook.columns.find(column => column.key === c.target).hidden, false);
    assert.equal(shown.codebook.columns.find(column => column.key === c.target).pii, 'phone');
    assert.deepEqual(Array.from(shown.columns[c.target].values), before);
    delete c.cb.columns.at(-1).hiddenExplicit;
    assert.equal(applyRecipe(c.raw, c.cb, c.steps, c.sources).codebook.columns.find(column => column.key === c.target).hidden, true);
  }
});

test('project import and Codebook validation reject malformed explicit-choice metadata', async () => {
  const c = await controls('bin');
  try {
    const text = await (await exportProjectFile(c.db, 'guest', c.project.id)).text();
    for (const invalid of ['true', 1, null, {}]) {
      const archive = JSON.parse(text);
      archive.datasets[0].codebook.columns.find(column => column.key === 'd1').hiddenExplicit = invalid;
      const bad = JSON.stringify(archive);
      assert.equal((await parseProjectFile({ size: bad.length, text: async () => bad })).ok, false);
      assert.equal(checkCodebook(archive.datasets[0].codebook).ok, false);
    }
    const archive = JSON.parse(text), target = archive.datasets[0].codebook.columns.find(column => column.key === 'd1');
    target.hiddenExplicit = true; delete target.hidden;
    const missing = JSON.stringify(archive);
    assert.equal((await parseProjectFile({ size: missing.length, text: async () => missing })).ok, false);
    assert.equal(checkCodebook(archive.datasets[0].codebook).ok, false);
  } finally { c.close(); }
});

test('the actual derived control keeps the effective PII provenance badge when stored metadata has none', () => {
  const numeric = { header: ['made-up private number'], columns: [['10', '20']], rowIds: ['r1', 'r2'], rowCount: 2 };
  const cb = proposeCodebook(numeric); cb.columns[0].type = 'continuous'; cb.columns[0].hidden = true; cb.columns[0].pii = 'phone';
  const steps = [makeStep([], 'compute', { target: 'd1', expression: '{c1}', type: 'continuous' })];
  const effective = applyRecipe(numeric, cb, steps).codebook;
  cb.columns.push({ ...effective.columns.find(column => column.key === 'd1'), pii: null, hidden: false });
  const pane = mount(CodebookPane, { p: { project: { id: 'made-up' }, meta: { codebook: cb }, codebook: effective, commitCodebook: async () => true } });
  try {
    const row = findAll(pane.tree, node => node.type === 'tr' && node.key === 'd1')[0];
    assert.ok(textOf(row).includes(workspaceWords.en['ws.pii.phone']));
  } finally { pane.unmount(); }
});
