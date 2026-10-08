import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf, settle } from '../helpers/fake-react.mjs';

const stubs = [
  { match: '(^|/)supabase\\.js$', contents: 'export const hasSupabase=true; export const getSupabase=async()=>globalThis.__adminRecoveryClient;' },
  { match: '/components/PrivateNotes\\.jsx$', contents: 'export default function PrivateNotes(){return null;}' },
  { match: '/data/bank-registry\\.generated\\.js$', contents: 'export const BANK_REGISTRY=[{load:()=>globalThis.__adminRecoveryBank(0)},{load:()=>globalThis.__adminRecoveryBank(1)}];' },
  { match: '/data/changelog\\.js$', contents: 'export const CHANGELOG=[]; export const SCOPE_LABELS={};' },
  { match: '/lib/dialog\\.js$', contents: 'export const confirmDialog=(options)=>globalThis.__adminRecoveryConfirm(options);' },
  { match: '\\.css$', contents: '' },
];
const { default: AdminView } = await loadModule('src/views/AdminView.jsx', { stubs });
const { checkIsAdmin } = await loadModule('src/lib/admin-api.js', { stubs });
const button = (panel, label) => findAll(panel.tree, n => n.type === 'button' && textOf(n) === label)[0];
const row = id => ({ question_id: id, subject: 'swine', attempts: 10, correct: 4, wrong: 6, users: 2, users_wrong: 2, answers: { 0: 4, 1: 6 } });
const question = { id: 124, q: 'Available audit question', subject: 'swine', type: 'mcq', options: ['A', 'B'], answer: 0 };

function setup(t) {
  const previous = new Map(['window', '__adminRecoveryClient', '__adminRecoveryBank', '__adminRecoveryConfirm'].map(key => [key, globalThis[key]]));
  const calls = [];
  const state = { gate: async () => ({ data: true, error: null }), bank: async index => index ? [question] : [], reloads: 0, confirm: async () => false };
  globalThis.window = { location: { reload() { state.reloads++; } } };
  globalThis.__adminRecoveryConfirm = options => state.confirm(options);
  globalThis.__adminRecoveryBank = index => state.bank(index);
  globalThis.__adminRecoveryClient = { rpc: async (name, args) => {
    calls.push({ name, args });
    if (name === 'is_admin') return state.gate();
    return { error: null, data: {
      admin_overview: { accounts_total: 1, attempts: 10, correct: 4, daily: [] },
      admin_questions: [row(123), row(124)], admin_subjects: [], admin_users_list: [], admin_extras: {}, admin_feedback_usage: {},
    }[name] };
  } };
  const panels = [];
  t.after(() => {
    for (const panel of panels) panel.unmount();
    for (const [key, value] of previous) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; }
  });
  return { state, calls, open() { const panel = mount(AdminView, { user: { id: 'admin-a' }, goHome() {}, onOpenQuestion() {} }); panels.push(panel); return panel; } };
}

test('role lookup preserves the difference between RPC failure and a genuine denial', async t => {
  const { state } = setup(t);
  state.gate = async () => ({ data: null, error: { code: 'FETCH_ERROR', message: 'Failed to fetch' } });
  await assert.rejects(checkIsAdmin(), error => error.code === 'FETCH_ERROR');
  state.gate = async () => ({ data: false, error: null });
  assert.equal(await checkIsAdmin(), false);
  state.gate = async () => ({ data: true, error: null });
  assert.equal(await checkIsAdmin(), true);
});

test('a failed role check shows a retry and recovers without fetching reports before authorization', async t => {
  const { state, calls, open } = setup(t);
  state.gate = async () => ({ data: null, error: { code: 'FETCH_ERROR', message: 'Failed to fetch' } });
  const panel = open(); await settle(panel);
  assert.match(textOf(panel.tree), /ตรวจสิทธิ์ไม่สำเร็จ/);
  assert.doesNotMatch(textOf(panel.tree), /บัญชีที่ล็อกอินอยู่ไม่มีสิทธิ์/);
  assert.equal(calls.filter(c => c.name.startsWith('admin_')).length, 0);
  state.gate = async () => ({ data: true, error: null });
  button(panel, 'ลองอีกครั้ง').props.onClick(); await settle(panel);
  assert.equal(calls.filter(c => c.name === 'is_admin').length, 2);
  assert.match(textOf(panel.tree), /สถิติทั้งหมดของ VetMock/);
});

test('denied users stay locked and a retired role response cannot reopen the page', async t => {
  const { state, calls, open } = setup(t);
  let answerOld;
  state.gate = () => new Promise(resolve => { answerOld = resolve; });
  const panel = open(); await settle(panel, 1);
  state.gate = async () => ({ data: false, error: null });
  panel.update({ user: { id: 'member-b' } }); await settle(panel);
  answerOld({ data: true, error: null }); await settle(panel);
  assert.match(textOf(panel.tree), /บัญชีที่ล็อกอินอยู่ไม่มีสิทธิ์/);
  assert.equal(button(panel, 'ลองอีกครั้ง'), undefined);
  assert.equal(calls.filter(c => c.name.startsWith('admin_')).length, 0);
});

test('an explicit forbidden RPC remains a denied state without a retry or report requests', async t => {
  const { state, calls, open } = setup(t);
  state.gate = async () => ({ data: null, error: { code: '42501', message: 'forbidden' } });
  const panel = open(); await settle(panel);
  assert.match(textOf(panel.tree), /บัญชีที่ล็อกอินอยู่ไม่มีสิทธิ์/);
  assert.equal(button(panel, 'ลองอีกครั้ง'), undefined);
  assert.equal(calls.filter(c => c.name.startsWith('admin_')).length, 0);
});

test('partial bank failure preserves available questions and offers an explicit reload without blaming missing content', async t => {
  const { state, open } = setup(t);
  state.bank = async index => { if (!index) throw new Error('chunk fetch failed'); return [question]; };
  const panel = open(); await settle(panel);
  assert.match(textOf(panel.tree), /โหลดข้อความโจทย์ไม่ครบ/);
  assert.match(textOf(panel.tree), /Available audit question/);
  assert.doesNotMatch(textOf(panel.tree), /ไม่พบใน build นี้/);
  const failedRow = findAll(panel.tree, n => n.type === 'tr' && textOf(n).includes('123'))[0];
  failedRow.props.onClick(); panel.flush();
  assert.doesNotMatch(textOf(panel.tree), /อาจถูกลบหรือย้าย id/);
  await button(panel, 'โหลดหน้าใหม่').props.onClick();
  assert.equal(state.reloads, 0, 'cancel preserves the current page');
  state.confirm = async () => true;
  await button(panel, 'โหลดหน้าใหม่').props.onClick();
  assert.equal(state.reloads, 1);
});

test('a delayed reload decision is ignored after leaving the admin page or changing its account', async t => {
  const { state, open } = setup(t);
  state.bank = async () => { throw new Error('chunk fetch failed'); };
  for (const change of ['unmount', 'account']) {
    const panel = open(); await settle(panel);
    let answer;
    state.confirm = () => new Promise(resolve => { answer = resolve; });
    const pending = button(panel, 'โหลดหน้าใหม่')?.props.onClick();
    assert.ok(answer, 'the reload action asks before replacing the document');
    if (change === 'unmount') panel.unmount(); else panel.update({ user: { id: 'other-admin' } });
    answer(true); await pending;
    assert.equal(state.reloads, 0);
    panel.unmount();
  }
});

test('a successfully loaded bank still distinguishes an actually missing question', async t => {
  const { open } = setup(t);
  const panel = open(); await settle(panel);
  assert.match(textOf(panel.tree), /ไม่พบใน build นี้/);
  assert.doesNotMatch(textOf(panel.tree), /โหลดข้อความโจทย์ไม่ครบ/);
  assert.equal(button(panel, 'โหลดหน้าใหม่'), undefined);
});
