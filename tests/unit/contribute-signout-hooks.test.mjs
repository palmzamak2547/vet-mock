// ============================================================
// contribute-signout-hooks.test.mjs — signing out on the contribute page
// shows the sign-in card instead of crashing (B78)
// ============================================================
// ContributeView returned its sign-in card before about twenty hooks. App
// renders the view without a user gate, so a sign-out (this tab, another tab,
// or "ออกจากระบบทุกเครื่อง" elsewhere) re-rendered the same instance with
// fewer hooks: React threw "Rendered fewer hooks than expected" and the
// boundary showed "หน้านี้ขัดข้อง". The view must call the same hooks whether
// or not a user is signed in, with the form's hooks in a child of their own.
// ============================================================

import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, textOf } from '../helpers/fake-react.mjs';

let ContributeView;
before(async () => {
  const mod = await loadModule('src/views/ContributeView.jsx', {
    stubs: [
      { match: '/lib/contributions\\.js$', contents: `
        export const CONTRIBUTION_SOURCE_TYPES = [];
        export const validateSubmission = () => ({ ok: false, errors: [], warnings: [] });
        export const submitProposal = async () => ({});
        export const fetchMyReputation = async () => null;
        export const fetchMySubmissions = async () => [];
        export const statusMeta = () => ({ label: '', color: '', bg: '' });
        export const ROLE_META = new Proxy({}, { get: () => ({ label: '', color: '', bg: '', icon: '' }) });
        export const ensureContributorRow = async () => {};` },
      { match: '/BackBar\\.jsx$', contents: 'export default function BackBar() { return null; }' },
      { match: '/StatePanel\\.jsx$', contents: 'export default function StatePanel() { return null; }' },
    ],
  });
  ContributeView = mod.default;
});

const hooksOf = (inst) => [inst.cursor, inst.ecursor];

test('signing out on the page calls the same hooks and shows the sign-in card', () => {
  const inst = mount(ContributeView, { user: { id: 'u1' }, goHome() {}, setView() {}, selectedYear: 4 });
  const signedIn = hooksOf(inst);
  const tree = inst.update({ user: null });
  assert.deepEqual(hooksOf(inst), signedIn, 'the view called a different number of hooks after sign-out');
  assert.match(textOf(tree), /Login เพื่อส่งคำถาม/);
  inst.unmount();
});

test('signing in on the page calls the same hooks and shows the form', () => {
  const inst = mount(ContributeView, { user: null, goHome() {}, setView() {}, selectedYear: 4 });
  const signedOut = hooksOf(inst);
  const tree = inst.update({ user: { id: 'u1' } });
  assert.deepEqual(hooksOf(inst), signedOut, 'the view called a different number of hooks after sign-in');
  assert.doesNotMatch(textOf(tree), /Login เพื่อส่งคำถาม/);
  inst.unmount();
});
