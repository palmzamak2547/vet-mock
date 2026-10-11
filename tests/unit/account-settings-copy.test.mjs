// ============================================================
// account-settings-copy.test.mjs — the account screen says it in Thai,
// asks for a Thai confirm phrase, and leaves LINE-only accounts out of a
// password flow they cannot finish (round 2, package G)
// ============================================================
// COPY-20: deleting an account asked the student to type 'ลบ account', a
//   phrase that needs a keyboard switch halfway through. The phrase is now
//   'ลบบัญชี', written once and used by the check, the label, the
//   placeholder and the disabled state alike.
// OV-data-9: a LINE sign-in that did not share an email is stored under a
//   placeholder address (line_<sub>@line.vetmock.local, minted by
//   supabase/functions/line-auth). The password change needs a code mailed to
//   the account's address, which for these accounts goes nowhere, and the
//   screen printed the placeholder as if it were the student's email.
// COPY-08 (this file): English words the app already has Thai for. Bookmark
//   wording is left for COPY-09, which waits for the owner's word pick.
//
// The view's real source is driven through tests/helpers/fake-react.mjs:
// handlers are called as React would call them and the tree is read back.
// ============================================================

import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, findAll, textOf, settle } from '../helpers/fake-react.mjs';
import { extractStrings, findIssues } from '../../scripts/lint-ui-copy.mjs';

const FILE = 'src/views/AccountSettingsView.jsx';
const source = readFileSync(new URL(`../../${FILE}`, import.meta.url), 'utf8');

let View;
before(async () => {
  const mod = await loadModule(FILE, {
    stubs: [
      { match: '/lib/supabase\\.js$', contents: `
        const rec = (name) => async (...args) => { globalThis.__acct.calls.push(name); return globalThis.__acct.returns[name]; };
        export const updatePassword = rec('updatePassword');
        export const requestReauthOtp = rec('requestReauthOtp');
        export const registerPasskey = rec('registerPasskey');
        export const listPasskeys = async () => [];
        export const deletePasskey = rec('deletePasskey');
        export const isPasskeySupported = () => false;
        export const updateEmail = rec('updateEmail');
        export const signOut = rec('signOut');
        export const signOutAllDevices = rec('signOutAllDevices');
        export const deleteAccountData = rec('deleteAccountData');
        export const updateProfileMetadata = rec('updateProfileMetadata');
        export const updateUsername = rec('updateUsername');` },
      { match: '/lib/dialog\\.js$', contents: 'export const confirmDialog = async () => true; export const alertDialog = async () => {};' },
      { match: '/BackBar\\.jsx$', contents: 'export default function BackBar() { return null; }' },
    ],
  });
  View = mod.default;
});

const fresh = () => {
  globalThis.__acct = { calls: [], returns: { deleteAccountData: { ok: true, devicePurged: true, deleted: {}, errors: [] } } };
  return globalThis.__acct;
};

const EMAIL_USER = {
  id: 'aaaaaaaa-1111-2222-3333-444444444444',
  email: 'student@example.com',
  email_confirmed_at: '2026-10-01T00:00:00Z',
  user_metadata: { username: 'vet86_ping' },
};
const LINE_SUB = 'U0123456789abcdef0123456789abcdef';
const LINE_USER = {
  id: 'bbbbbbbb-1111-2222-3333-444444444444',
  email: `line_${LINE_SUB}@line.vetmock.local`,
  email_confirmed_at: '2026-10-01T00:00:00Z',
  user_metadata: { provider: 'line', line_name: 'Ping' },
};

const props = (user, extra = {}) => ({ user, goHome() {}, onSignedOut() {}, coreData: {}, ...extra });
const buttons = (tree) => findAll(tree, (n) => n.type === 'button');
const byId = (tree, id) => findAll(tree, (n) => n.props?.id === id)[0];
const click = (inst, node) => { node.props.onClick(); return inst.flush(); };
const deleteOpener = (tree) => buttons(tree).find((b) => /^ลบ.*→\s*$/.test(textOf(b).trim()));
const deleteSubmit = (tree) => buttons(tree).find((b) => b.props.type === 'submit' && b.props.style?.background === 'var(--clr-rose)');
const openForm = (tree) => findAll(tree, (n) => n.type === 'form')[0];
const type = (inst, id, value) => { byId(inst.tree, id).props.onChange({ target: { value } }); return inst.flush(); };

test('the delete confirm accepts exactly ลบบัญชี and then deletes and signs out', async (t) => {
  const acct = fresh();
  let signedOut = 0;
  const inst = mount(View, props(EMAIL_USER, { onSignedOut() { signedOut++; } }));
  click(inst, deleteOpener(inst.tree));
  const input = byId(inst.tree, 'vmx-account-delete-confirm');
  assert.equal(input.props.placeholder, 'ลบบัญชี', 'the placeholder shows the phrase to type');
  assert.match(textOf(findAll(inst.tree, (n) => n.type === 'label' && n.props.htmlFor === 'vmx-account-delete-confirm')[0]), /พิมพ์ ลบบัญชี เพื่อยืนยัน/);

  type(inst, 'vmx-account-delete-confirm', 'ลบบัญชี');
  assert.equal(deleteSubmit(inst.tree).props.disabled, false, 'the button wakes up once the Thai phrase is typed');

  t.mock.timers.enable({ apis: ['setTimeout'] });
  await openForm(inst.tree).props.onSubmit({ preventDefault() {} });
  inst.flush();
  assert.deepEqual(acct.calls, ['deleteAccountData']);
  assert.match(textOf(inst.tree), /✓ ลบบัญชีสำเร็จและออกจากระบบแล้ว/);
  t.mock.timers.tick(2000);
  assert.equal(signedOut, 1, 'the screen hands back to the app after the confirmation');
  inst.unmount();
});

test('the old phrase ลบ account no longer deletes anything', async () => {
  const acct = fresh();
  const inst = mount(View, props(EMAIL_USER));
  click(inst, deleteOpener(inst.tree));
  type(inst, 'vmx-account-delete-confirm', 'ลบ account');
  assert.equal(deleteSubmit(inst.tree).props.disabled, true);
  await openForm(inst.tree).props.onSubmit({ preventDefault() {} });
  inst.flush();
  assert.deepEqual(acct.calls, [], 'no delete request for the old phrase');
  assert.match(textOf(inst.tree), /พิมพ์ "ลบบัญชี" ให้ตรงเพื่อยืนยัน/);
  inst.unmount();
});

test('a near miss with spaces is refused too, as before', async () => {
  const acct = fresh();
  const inst = mount(View, props(EMAIL_USER));
  click(inst, deleteOpener(inst.tree));
  type(inst, 'vmx-account-delete-confirm', ' ลบบัญชี ');
  assert.equal(deleteSubmit(inst.tree).props.disabled, true);
  await openForm(inst.tree).props.onSubmit({ preventDefault() {} });
  assert.deepEqual(acct.calls, []);
  inst.unmount();
});

test('a LINE-only account never sees its placeholder address or a password form', async () => {
  const acct = fresh();
  const inst = mount(View, props(LINE_USER));
  const shown = () => textOf(inst.tree);
  assert.ok(!shown().includes('line.vetmock.local'), 'the placeholder domain is not printed');
  assert.ok(!shown().includes(LINE_SUB), 'nor its LINE id local part');
  assert.match(shown(), /บัญชีนี้เข้าด้วย LINE เพิ่มอีเมลจริงก่อนจึงตั้งรหัสผ่านได้/);

  // Every button that mentions a password leads nowhere near a reauth code.
  for (const b of buttons(inst.tree).filter((n) => /รหัสผ่าน/.test(textOf(n)))) click(inst, b);
  for (const id of ['vmx-account-password', 'vmx-account-password-confirm', 'vmx-account-reauth-code']) {
    assert.equal(byId(inst.tree, id), undefined, `${id} is not offered to a LINE-only account`);
  }
  assert.ok(!acct.calls.includes('requestReauthOtp'), 'no code is mailed to the placeholder');

  // Editing the profile does not prefill the username with line_<sub>.
  const edit = buttons(inst.tree).find((b) => /^แก้ไข/.test(textOf(b).trim()));
  click(inst, edit);
  assert.equal(byId(inst.tree, 'vmx-account-username').props.value, '', 'the placeholder local part is not offered as a username');
  assert.ok(!shown().includes(LINE_SUB));
  inst.unmount();

  // The way out, adding a real email, stays open.
  const again = mount(View, props(LINE_USER));
  const add = buttons(again.tree).find((b) => /อีเมล/.test(textOf(b)) && /→/.test(textOf(b)));
  click(again, add);
  assert.ok(byId(again.tree, 'vmx-account-email'), 'the add-email form opens');
  await settle(again);
  assert.ok(!textOf(again.tree).includes('line.vetmock.local'));
  again.unmount();
});

test('an email account keeps the two-step password change and sees its own address', async () => {
  const acct = fresh();
  const inst = mount(View, props(EMAIL_USER));
  assert.match(textOf(inst.tree), /student@example\.com/);
  click(inst, buttons(inst.tree).find((b) => textOf(b).trim() === 'เปลี่ยนรหัสผ่าน →'));
  type(inst, 'vmx-account-password', 'correct horse 9');
  type(inst, 'vmx-account-password-confirm', 'correct horse 9');
  await openForm(inst.tree).props.onSubmit({ preventDefault() {} });
  inst.flush();
  assert.deepEqual(acct.calls, ['requestReauthOtp']);
  assert.ok(byId(inst.tree, 'vmx-account-reauth-code'), 'step two asks for the mailed code');
  assert.match(textOf(inst.tree), /ส่งไปที่ student@example\.com/);
  inst.unmount();
});

test('isSyntheticLineEmail matches only the placeholder that line-auth mints', async () => {
  const { isSyntheticLineEmail, LINE_PLACEHOLDER_SUFFIX } = await import('../../src/lib/line-account.js');
  assert.equal(isSyntheticLineEmail(LINE_USER), true);
  assert.equal(isSyntheticLineEmail(LINE_USER.email), true, 'a bare address works too');
  assert.equal(isSyntheticLineEmail('LINE_X@LINE.VETMOCK.LOCAL'), true, 'case does not matter in a domain');
  for (const other of [EMAIL_USER, 'someone@gmail.com', 'x@line.vetmock.local.evil.com', 'line.vetmock.local', '', null, undefined, {}, { email: 42 }]) {
    assert.equal(isSyntheticLineEmail(other), false, JSON.stringify(other));
  }
  const fn = readFileSync(new URL('../../supabase/functions/line-auth/index.ts', import.meta.url), 'utf8');
  assert.ok(fn.includes(`\`line_\${lineSub}${LINE_PLACEHOLDER_SUFFIX}\``),
    'the edge function mints the same placeholder suffix this check looks for');
});

test('the screen has no English word the app already says in Thai (bookmark waits for COPY-09)', () => {
  const { leaks } = findIssues(extractStrings(source, FILE));
  const left = leaks.filter((l) => !/^bookmarks?$/i.test(l.token));
  assert.deepEqual(left.map((l) => `${l.line}: ${l.token}`), []);
  assert.ok(!source.includes('ลบ account'), 'the old confirm phrase is gone everywhere');
  assert.match(source, /const DELETE_PHRASE = 'ลบบัญชี'/);
  assert.doesNotMatch(source, /[!=]==\s*'ลบบัญชี'/, 'the check compares against DELETE_PHRASE, not a second copy of the words');
  assert.ok((source.match(/\bDELETE_PHRASE\b/g) || []).length >= 6, 'check, message, label, placeholder and disabled state all read DELETE_PHRASE');
});
