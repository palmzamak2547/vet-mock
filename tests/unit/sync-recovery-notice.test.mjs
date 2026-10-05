import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';

const exports = [], alerts = [];
let confirmation = async () => true;
globalThis.__syncRecoveryNotice = {
  downloadJSON: (data, filename) => exports.push({ data, filename }),
  confirmDialog: (...args) => confirmation(...args),
  alertDialog: value => alerts.push(value),
};
const { default: Notice } = await loadModule('src/components/SyncStatusNotice.jsx', { stubs: [
  { match: 'Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/hooks/utils\\.js$', contents: 'export const { downloadJSON } = globalThis.__syncRecoveryNotice;' },
  { match: '/lib/dialog\\.js$', contents: 'export const { confirmDialog, alertDialog } = globalThis.__syncRecoveryNotice;' },
] });
const recovery = { kind: 'legacy', local: { notes: { a: 'local' }, history: [] }, account: { notes: { b: 'cloud' } } };
const buttons = view => findAll(view.tree, n => n.type === 'button');
const button = (view, label) => buttons(view).find(n => textOf(n) === label);

test('recovery exports both versions and only resolves the captured principal after confirmation', async () => {
  let release;
  confirmation = () => new Promise(resolve => { release = resolve; });
  const calls = [];
  const view = mount(Notice, { signedIn: true, online: true,
    sync: { recovery, resolveRecovery: choice => calls.push(['a', choice]) } });
  button(view, 'ดาวน์โหลดสำเนาทั้งสองชุด').props.onClick();
  assert.deepEqual(exports.at(-1).data.notes, recovery.local.notes);
  assert.deepEqual(exports.at(-1).data.syncRecovery.account, recovery.account);
  const pending = button(view, 'ใช้ข้อมูลในเครื่อง').props.onClick();
  view.flush();
  assert.equal(button(view, 'ใช้ข้อมูลในเครื่อง').props.disabled, true);
  view.update({ sync: { recovery, resolveRecovery: choice => calls.push(['b', choice]) } });
  release(true);
  await pending;
  assert.deepEqual(calls, [['a', 'local']], 'the captured owner-bound resolver, never the new account');
});

test('offline and custom-ID conflicts keep an export path without unsafe overwrite', () => {
  const view = mount(Notice, { signedIn: true, online: false, sync: { recovery } });
  assert.equal(button(view, 'ดาวน์โหลดสำเนาทั้งสองชุด').props.disabled, undefined);
  assert.equal(button(view, 'ใช้ข้อมูลบัญชี').props.disabled, true);
  view.update({ online: true, sync: { recovery: { ...recovery, kind: 'custom-id' } } });
  assert.equal(button(view, 'ใช้ข้อมูลในเครื่อง'), undefined);
  assert.ok(button(view, 'ใช้ข้อมูลบัญชี'));
  view.update({ signedIn: false });
  assert.equal(button(view, 'ดาวน์โหลดสำเนาทั้งสองชุด'), undefined, 'another principal cannot export the recovery');
});

test('cancel and failed recovery preserve the panel with an actionable message', async () => {
  let calls = 0;
  const view = mount(Notice, { signedIn: true, online: true,
    sync: { recovery, resolveRecovery: async () => { calls++; return { accepted: false }; } } });
  confirmation = async () => false;
  await button(view, 'ใช้ข้อมูลบัญชี').props.onClick();
  view.flush();
  assert.equal(calls, 0);
  confirmation = async () => true;
  await button(view, 'ใช้ข้อมูลบัญชี').props.onClick();
  view.flush();
  assert.equal(calls, 1);
  assert.match(alerts.at(-1), /สำเนาเดิมยังอยู่/);
  assert.ok(button(view, 'ดาวน์โหลดสำเนาทั้งสองชุด'));
});
