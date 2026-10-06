import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';

const { default: Notice } = await loadModule('src/components/SyncStatusNotice.jsx', { stubs: [
  { match: 'Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/hooks/utils\\.js$', contents: 'export const downloadJSON = () => {};' },
  { match: '/lib/dialog\\.js$', contents: 'export const confirmDialog = async () => true; export const alertDialog = () => {};' },
] });
const readError = { code: 'LOCAL_READ_FAILED', retryable: true };
const props = extra => ({ online: true, justChanged: false, signedIn: false,
  sync: { phase: 'error', pending: true, error: readError }, ...extra });
const button = (view, label) => findAll(view.tree, node => node.type === 'button').find(node => textOf(node) === label);
const readRetry = 'ลองอ่านข้อมูลในเครื่องอีกครั้ง';

for (const signedIn of [false, true]) for (const online of [false, true]) {
  test(`read failure is visible to ${signedIn ? 'members' : 'guests'} while ${online ? 'online' : 'offline'}`, () => {
    const view = mount(Notice, props({ signedIn, online }));
    assert.match(textOf(view.tree), /อ่านข้อมูลในเครื่องไม่สำเร็จ/);
    assert.doesNotMatch(textOf(view.tree), /บันทึกการเปลี่ยนแปลงไว้ในเครื่องแล้ว|ข้อมูลใหม่จะเก็บไว้ในเครื่อง/);
    assert.equal(findAll(view.tree, node => node.props?.role === 'status').length, 1);
    assert.equal(view.tree.props.style.color, 'var(--clr-rose-text, #b3453f)');
  });
}

for (const signedIn of [false, true]) test(`offline write failure does not claim a successful save for ${signedIn ? 'members' : 'guests'}`, () => {
  const view = mount(Notice, props({ signedIn, online: false,
    sync: { phase: 'error', pending: true, error: { code: 'LOCAL_WRITE_FAILED', retryable: true } } }));
  assert.match(textOf(view.tree), /บันทึกลงเครื่องไม่สำเร็จ/);
  assert.doesNotMatch(textOf(view.tree), /บันทึกการเปลี่ยนแปลงไว้ในเครื่องแล้ว|ข้อมูลใหม่จะเก็บไว้ในเครื่อง/);
});

test('an offline local-read retry calls the existing local retry callback and respects a non-retryable error', () => {
  let calls = 0;
  const view = mount(Notice, props({ online: false, onRetry: () => { calls++; } }));
  const retry = button(view, readRetry);
  assert.ok(retry, 'local reads can retry without waiting for internet');
  assert.notEqual(retry.props.disabled, true);
  retry.props.onClick();
  assert.equal(calls, 1);
  view.update({ sync: { phase: 'error', error: { ...readError, retryable: false } } });
  assert.equal(button(view, readRetry), undefined);
});

test('local-read errors remain visible and retryable inside the existing recovery panel', () => {
  let calls = 0;
  const recovery = { kind: 'legacy', local: { notes: { draft: 'known work' } }, account: { notes: { cloud: 'known account' } } };
  const view = mount(Notice, props({ signedIn: true, online: false, onRetry: () => { calls++; },
    sync: { phase: 'error', pending: true, error: readError, recovery } }));
  assert.match(textOf(view.tree), /อ่านข้อมูลในเครื่องไม่สำเร็จ/);
  assert.ok(button(view, 'ดาวน์โหลดสำเนาทั้งสองชุด'));
  assert.equal(button(view, 'ใช้ข้อมูลบัญชี').props.disabled, true);
  button(view, readRetry).props.onClick();
  assert.equal(calls, 1);
  view.update({ online: true });
  assert.equal(button(view, 'ใช้ข้อมูลบัญชี').props.disabled, true, 'read failure blocks a choice even when the account copy is cached');
});

test('specific local read/write error messages take precedence over offline copy', () => {
  for (const code of ['LOCAL_READ_FAILED', 'LOCAL_WRITE_FAILED']) {
    const view = mount(Notice, props({ online: false, signedIn: true,
      sync: { phase: 'error', pending: true, error: { code, message: 'ข้อผิดพลาดในเครื่องที่ต้องแสดง', retryable: true } } }));
    assert.match(textOf(view.tree), /ข้อผิดพลาดในเครื่องที่ต้องแสดง/);
    assert.doesNotMatch(textOf(view.tree), /บันทึกการเปลี่ยนแปลงไว้ในเครื่องแล้ว/);
  }
});

test('ordinary offline, returning-online, synced and cloud-error notices keep their existing meaning', () => {
  let games = 0, retries = 0;
  const view = mount(Notice, { online: false, signedIn: true, sync: { phase: 'offline', pending: true }, onOfflineGame: () => { games++; } });
  assert.match(textOf(view.tree), /บันทึกการเปลี่ยนแปลงไว้ในเครื่องแล้ว/);
  button(view, '🎮 เล่นเกม').props.onClick();
  assert.equal(games, 1);
  view.update({ signedIn: false });
  assert.match(textOf(view.tree), /ใช้งานส่วนที่เปิดไว้แล้วได้ตามปกติ/);
  view.update({ online: true, signedIn: true, justChanged: true, sync: { phase: 'pending' } });
  assert.match(textOf(view.tree), /กำลังตรวจสอบและซิงก์ข้อมูล/);
  view.update({ justChanged: false, sync: { phase: 'synced' } });
  assert.equal(view.tree, null);
  view.update({ sync: { phase: 'error', error: { code: 'REMOTE_PUSH_FAILED' } }, onRetry: () => { retries++; } });
  assert.match(textOf(view.tree), /ยังซิงก์ข้อมูลกับบัญชีไม่ได้ ข้อมูลในเครื่องยังอยู่ครบ/);
  button(view, 'ลองซิงก์อีกครั้ง').props.onClick();
  assert.equal(retries, 1);
});
