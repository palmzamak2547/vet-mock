// The double-entry check on a farm survey with owner names and phone numbers: the comparison still lists every
// differing cell, but a hidden or personal-data column shows its values masked on screen and in the downloaded
// list, as the import screen masks them [M1-DESIGN.md 8.3]. Settling a difference still edits the real cell.
// OWNER: ui-tools role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../../../tests/helpers/fake-react.mjs';
import { parseDelimited } from '../../src/lib/intake/csv.js';
import { proposeCodebook } from '../../src/lib/intake/codebook.js';

const stub = (match, contents) => ({ match, contents });
const { default: ComparePane } = await loadModule('research/src/workspace/screens/tools/ComparePane.jsx', { stubs: [
  stub('/i18n/index\\.js$', 'export const useT = () => ({ lang: "th", t: (k, p) => (p ? k + JSON.stringify(p) : k) }); export const registerArea = () => {};'),
  stub('(^|/)ws-context\\.js$', 'export const useWs = () => ({ notify: (...a) => globalThis.__comparePrivacy.notes.push(a) }); export const errorInfo = (e) => ({ key: e?.key || "fixture-error" });'),
  stub('(^|/)runtime/export\\.js$', 'export const download = (blob, name) => globalThis.__comparePrivacy.downloads.push({ blob, name }); export const usesHiddenColumns = () => false;'),
  stub('(^|/)Bits\\.jsx$', 'export const ErrorBox = () => null; export const Field = ({ children }) => <div>{children}</div>; export const Notice = ({ title, children }) => <div>{title}{children}</div>; export const PageHead = () => null;'),
  stub('(^|/)Icon\\.jsx$', 'export default () => null;'),
  stub('(^|/)ToolBits\\.jsx$', 'export const IdList = ({ items }) => <ul>{(items || []).map((x, i) => <li key={i}>{x}</li>)}</ul>; export const SecondFile = () => null;'),
] });

function rawOf(text, fileName) {
  const parsed = parseDelimited(text, { headerRow: 0 });
  const n = parsed.rows.length;
  return {
    header: parsed.header, columns: parsed.header.map((_, c) => parsed.rows.map((r) => r[c] ?? '')), rowIds: Array.from({ length: n }, (_, i) => `r${i + 1}`), rowCount: n,
    source: { fileName, bytes: 0, sha256: '', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: '2026-11-08T00:00:00.000Z' },
  };
}

function open(first, second) {
  const a = rawOf(first, 'typist-1.csv');
  const b = rawOf(second, 'typist-2.csv');
  const state = { notes: [], downloads: [], logs: [], commits: [] };
  globalThis.__comparePrivacy = state;
  const p = {
    meta: { id: 'ds1', codebook: proposeCodebook(a), steps: [] },
    raw: a,
    others: [{ meta: { id: 'ds2', purpose: 'double-entry', codebook: proposeCodebook(b), steps: [], source: { fileName: 'typist-2.csv' } }, raw: b }],
    project: { name: 'farm-survey' },
    log: (kind, detail) => state.logs.push([kind, detail]),
    commitSteps: async (steps, detail) => { state.commits.push({ steps, detail }); return true; },
    busy: false,
  };
  const inst = mount(ComparePane, { p });
  const button = (label) => findAll(inst.tree, (n) => n.type === 'button' && textOf(n).includes(label))[0];
  button('tools.compare.run').props.onClick();
  inst.flush();
  return { inst, state, p, button };
}

const FIRST = 'รหัส,ชื่อเจ้าของ,เบอร์โทร,น้ำหนัก\nA1,นายสมชาย ใจดี,081-234-5678,450\nA2,นางสาวสมหญิง รักดี,089-111-2222,398\nA3,นายวิชัย มั่นคง,062-333-4444,512';
const SECOND = 'รหัส,ชื่อเจ้าของ,เบอร์โทร,น้ำหนัก\nA1,นายสมชาย ใจดีมาก,081-234-5679,450\nA2,นางสาวสมหญิง รักดี,089-111-2222,389\nA3,นายวิชัย มั่นคง,062-333-4444,512';
const SECRETS = ['สมชาย', 'ใจดี', '234-5678', '234-5679'];

test('a hidden personal-data column is compared, but its values are masked on screen and in the downloaded list', async () => {
  const { inst, state, p, button } = open(FIRST, SECOND);
  assert.ok(p.meta.codebook.columns.filter((c) => c.hidden).length === 2, 'the name and phone columns are hidden at import');
  const rows = findAll(inst.tree, (n) => n.type === 'tr' && findAll(n, (x) => x.type === 'td').length > 0);
  const cells = rows.map((tr) => findAll(tr, (x) => x.type === 'th' || x.type === 'td').slice(0, 4).map(textOf));
  assert.equal(rows.length, 3, 'every differing cell is still listed');
  assert.deepEqual(cells.map((c) => c.slice(2)), [['น*** ใ***', 'น*** ใ***'], ['08x-xxx-xx78', '08x-xxx-xx79'], ['398', '389']]);
  const screen = textOf(inst.tree);
  for (const s of SECRETS) assert.equal(screen.includes(s), false, `"${s}" is on the screen`);

  button('tools.compare.download').props.onClick();
  assert.equal(state.downloads.length, 1);
  const csv = (await state.downloads[0].blob.text()).replace(/^﻿/, '');
  for (const s of SECRETS) assert.equal(csv.includes(s), false, `"${s}" is in the downloaded list: ${csv}`);
  assert.ok(csv.includes('A1,r1,r1,ชื่อเจ้าของ,น*** ใ***,น*** ใ***\r\n'), csv);
  assert.ok(csv.includes('A1,r1,r1,เบอร์โทร,08x-xxx-xx78,08x-xxx-xx79\r\n'), csv);
  assert.ok(csv.includes('A2,r2,r2,น้ำหนัก,398,389\r\n'), 'a public column keeps its values');
  assert.equal(JSON.stringify(state.logs).includes('สมชาย'), false, 'the log holds counts only');

  // Settling against the paper form still edits the real cell (a cell edit's "from" must be the current value).
  const form = findAll(inst.tree, (n) => n.type === 'input' && n.props.id === 'rs-cmp-form')[0];
  form.props.onChange({ target: { value: 'แบบฟอร์มกระดาษ A1' } });
  inst.flush();
  const takeB = findAll(inst.tree, (n) => n.type === 'button' && textOf(n) === 'tools.compare.takeB')[0];
  await takeB.props.onClick();
  const step = state.commits[0].steps.at(-1);
  assert.deepEqual(step.params, { rowId: 'r1', column: 'c2', from: 'นายสมชาย ใจดี', to: 'นายสมชาย ใจดีมาก' });
});

test('a personal-data key column prints its keys masked: the rows, the keys found in one file only, and the download', async () => {
  // No form number: the files are matched on the owner's name (the first column is the first guess).
  const first = 'ชื่อเจ้าของ,น้ำหนัก\nนายสมชาย ใจดี,450\nนางสาวสมหญิง รักดี,398\nนายวิชัย มั่นคง,512';
  const second = 'ชื่อเจ้าของ,น้ำหนัก\nนายสมชาย ใจดี,405\nนางสาวสมหญิง รักดี,398\nนายประเสริฐ ทองดี,420';
  const { inst, state, button } = open(first, second);
  const screen = textOf(inst.tree);
  for (const s of ['สมชาย', 'ใจดี', 'วิชัย', 'ประเสริฐ']) assert.equal(screen.includes(s), false, `"${s}" is on the screen`);
  const keys = findAll(inst.tree, (n) => n.type === 'th' && n.props.scope === 'row').map(textOf);
  assert.deepEqual(keys, ['น*** ใ***']);
  assert.deepEqual(findAll(inst.tree, (n) => n.type === 'li').map(textOf), ['น*** ม***', 'น*** ท***'], 'the keys in one file only');
  button('tools.compare.download').props.onClick();
  const csv = (await state.downloads[0].blob.text()).replace(/^﻿/, '');
  assert.ok(csv.includes('น*** ใ***,r1,r1,น้ำหนัก,450,405\r\n'), csv);
  assert.equal(csv.includes('สมชาย'), false, csv);
});
