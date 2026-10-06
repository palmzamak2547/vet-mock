import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import { FEATURES, visibleFeatures } from '../../src/lib/feature-registry.js';
import { buildCatalog, validateAction } from '../../api/_lib/agent-actions.js';

const values = new Map();
const storage = { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, String(v)), removeItem: k => values.delete(k) };
globalThis.window = new EventTarget();
window.localStorage = storage;
globalThis.localStorage = storage;
globalThis.sessionStorage = storage;
globalThis.matchMedia = () => ({ matches: true });
const { default: Palette } = await loadModule('src/components/CommandPalette.jsx', { stubs: [
  { match: '/data/questions\\.js$', contents: 'export const QB = [];' },
  { match: '/data/schedule\\.js$', contents: 'export const getUpcomingExams = () => []; export const fmtThaiDate = () => "";' },
  { match: '/data/video-summaries-meta\\.js$', contents: 'export const VIDEO_META = [];' },
  { match: '/data/instructors\\.js$', contents: 'export const ALL_INSTRUCTORS = [];' },
  { match: '/data/question-delivery\\.generated\\.js$', contents: 'export const isQuestionDeliverable = () => true;' },
  { match: '/lib/user-flashcards\\.js$', contents: 'export const loadUserFlashcards = () => [];' },
  { match: '/lib/vetwiki/registry\\.js$', contents: 'export const listTopics = () => [];' },
  { match: '/hooks/useModalFocus\\.js$', contents: 'export const useModalFocus = () => ({ current: null });' },
  { match: '(^|/)Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '(^|/)ErrorBoundary\\.jsx$', contents: 'export default ({ children }) => children;' },
  { match: '/lib/dialog\\.js$', contents: 'export const alertDialog = () => {};' },
  { match: '/lib/omni-intents\\.js$', contents: 'export const detectIntents = () => [];' },
  { match: '/lib/omni-sources\\.js$', contents: 'export const OMNI_SOURCES = [{ id: "library", load: async () => [] }];' },
  { match: '/lib/library\\.js$', contents: 'export const docOpenMode = () => ({ action: "read" }); export const readerPayload = doc => doc; export const recordRecentDoc = () => {}; export const resolveDocUrl = async () => "";' },
] });

async function requestPlan(view) {
  const input = findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0];
  input.props.onChange({ target: { value: 'เปิดเครื่องมือที่ขอ' } });
  await settle(view);
  await new Promise(resolve => setTimeout(resolve, 70));
  await settle(view);
  const command = findAll(view.tree, n => n.type === 'button' && textOf(n).includes('สั่งให้จัดการ'))[0];
  assert.ok(command);
  await command.props.onClick();
  await settle(view);
}

for (const id of ['admin', 'account-settings', 'bench']) {
  test(`confirmed command cannot dispatch currently hidden feature ${id}`, async () => {
    const context = { signedIn: false, isAdmin: false, selectedYear: 1, hasSupabase: true, scaffold: false };
    const feature = FEATURES.find(f => f.id === id);
    assert.ok(feature);
    assert.equal(visibleFeatures([feature], context).length, 0);
    const valid = validateAction({ type: 'feature', params: { id }, say: 'made-up approved plan' }, buildCatalog());
    assert.equal(valid.ok, true, 'this exact endpoint plan is accepted by the actual server validator');
    globalThis.fetch = async () => ({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: async () => ({ action: valid.action, say: valid.say }) });
    let destination = null;
    const view = mount(Palette, { open: true, onClose() {}, ownerId: null, notes: {}, ...context, goView: v => { destination = v; } });
    try {
      await settle(view);
      await requestPlan(view);
      const confirm = findAll(view.tree, n => n.type === 'button' && textOf(n).trim() === 'ทำเลย')[0];
      assert.equal(confirm, undefined, 'an unavailable menu must not be offered as an executable plan');
      assert.ok(textOf(view.tree).includes('เมนูนี้ไม่พร้อมใช้สำหรับบัญชีหรือชั้นปีที่เลือก'));
      assert.equal(destination, null);
    } finally { view.unmount(); }
  });
}

test('an account A plan cannot appear after the mounted palette has switched to B', async () => {
  let release;
  let startedResolve;
  const started = new Promise(resolve => { startedResolve = resolve; });
  globalThis.fetch = () => new Promise(resolve => { release = resolve; startedResolve(); });
  const view = mount(Palette, { open: true, onClose() {}, ownerId: 'A', notes: {}, signedIn: true, selectedYear: 5 });
  try {
    await settle(view);
    const pending = requestPlan(view);
    await Promise.race([started, new Promise((_, reject) => setTimeout(() => reject(new Error('fixture request did not start')), 1500))]);
    assert.equal(typeof release, 'function');
    view.update({ ownerId: 'B' });
    release({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: async () => ({ action: { type: 'feature', id: 'exam-mode' }, say: 'Owner A stale plan sentinel' }) });
    await pending;
    await settle(view);
    assert.equal(textOf(view.tree).includes('Owner A stale plan sentinel'), false);
  } finally { view.unmount(); }
});

test('a current visible action still waits for confirmation and then uses its registry destination', async () => {
  const valid = validateAction({ type: 'feature', params: { id: 'exam-mode' }, say: 'made-up exam plan' }, buildCatalog());
  globalThis.fetch = async () => ({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: async () => ({ action: valid.action, say: valid.say }) });
  let invoked = null;
  const view = mount(Palette, { open: true, onClose() {}, ownerId: 'A', notes: {}, signedIn: true, selectedYear: 5, onPractice: preset => { invoked = preset; } });
  try {
    await settle(view);
    await requestPlan(view);
    assert.equal(invoked, null, 'requesting a plan does not execute it');
    const confirm = findAll(view.tree, n => n.type === 'button' && textOf(n).trim() === 'ทำเลย')[0];
    assert.ok(confirm);
    confirm.props.onClick();
    assert.deepEqual(invoked, FEATURES.find(f => f.id === 'exam-mode').invoke);
  } finally { view.unmount(); }
});

test('an already confirmed year-five plan cannot dispatch after switching to year one', async () => {
  const valid = validateAction({ type: 'feature', params: { id: 'bench' }, say: 'made-up year-five plan' }, buildCatalog());
  globalThis.fetch = async () => ({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: async () => ({ action: valid.action, say: valid.say }) });
  let destination = null;
  const view = mount(Palette, { open: true, onClose() {}, ownerId: 'A', notes: {}, signedIn: true, selectedYear: 5, goView: v => { destination = v; } });
  try {
    await settle(view);
    await requestPlan(view);
    const oldConfirm = findAll(view.tree, n => n.type === 'button' && textOf(n).trim() === 'ทำเลย')[0];
    assert.ok(oldConfirm);
    view.update({ selectedYear: 1 });
    await settle(view);
    oldConfirm.props.onClick();
    assert.equal(destination, null);
  } finally { view.unmount(); }
});

test('an old command response cannot replace the plan for the edited query', async () => {
  let release, startedResolve;
  const started = new Promise(resolve => { startedResolve = resolve; });
  globalThis.fetch = () => new Promise(resolve => { release = resolve; startedResolve(); });
  const view = mount(Palette, { open: true, onClose() {}, ownerId: 'A', notes: {}, signedIn: true, selectedYear: 5 });
  try {
    await settle(view);
    const pending = requestPlan(view);
    await Promise.race([started, new Promise((_, reject) => setTimeout(() => reject(new Error('fixture request did not start')), 1500))]);
    findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0].props.onChange({ target: { value: 'เปิดคำสั่งใหม่ที่ต้องการ' } });
    await settle(view);
    release({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: async () => ({ action: { type: 'feature', id: 'exam-mode' }, say: 'Old query command sentinel' }) });
    await pending;
    await settle(view);
    assert.equal(textOf(view.tree).includes('Old query command sentinel'), false);
  } finally { view.unmount(); }
});

for (const change of ['owner', 'query']) {
  test(`an old knowledge-question response cannot appear after ${change} changes`, async () => {
    let release, startedResolve;
    const started = new Promise(resolve => { startedResolve = resolve; });
    globalThis.fetch = () => new Promise(resolve => { release = resolve; startedResolve(); });
    const view = mount(Palette, { open: true, onClose() {}, ownerId: 'A', notes: {}, signedIn: true, selectedYear: 5 });
    try {
      await settle(view);
      const input = findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0];
      input.props.onChange({ target: { value: 'คำถามจากบัญชีเดิมของนิสิต' } });
      await settle(view);
      findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0].props.onKeyDown({ key: 'Enter', ctrlKey: true, preventDefault() {} });
      await Promise.race([started, new Promise((_, reject) => setTimeout(() => reject(new Error('fixture question request did not start')), 1500))]);
      if (change === 'owner') view.update({ ownerId: 'B' });
      else {
        findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0].props.onChange({ target: { value: 'คำถามใหม่ของนิสิต' } });
        await settle(view);
      }
      release({ ok: false, status: 503, headers: { get: () => 'application/json' }, json: async () => ({ reason: 'budget' }) });
      await settle(view, 8);
      assert.equal(textOf(view.tree).includes('วันนี้ถามครบโควตาแล้ว'), false);
    } finally { view.unmount(); }
  });
}

test('a current knowledge-question failure still tells the current owner what happened', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 503, headers: { get: () => 'application/json' }, json: async () => ({ reason: 'budget' }) });
  const view = mount(Palette, { open: true, onClose() {}, ownerId: 'A', notes: {}, signedIn: true, selectedYear: 5 });
  try {
    await settle(view);
    findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0].props.onChange({ target: { value: 'คำถามปัจจุบันของนิสิต' } });
    await settle(view);
    findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0].props.onKeyDown({ key: 'Enter', ctrlKey: true, preventDefault() {} });
    await settle(view, 8);
    assert.equal(textOf(view.tree).includes('วันนี้ถามครบโควตาแล้ว'), true);
  } finally { view.unmount(); }
});

for (const kind of ['ask', 'agent']) {
  test(`a retained typed ${kind} handler cannot launch an obsolete query`, async () => {
    let requests = 0;
    globalThis.fetch = async () => { requests++; return { ok: false, status: 503, headers: { get: () => 'application/json' }, json: async () => ({ reason: 'budget' }) }; };
    const view = mount(Palette, { open: true, onClose() {}, ownerId: 'A', notes: {}, signedIn: true, selectedYear: 5 });
    try {
      await settle(view);
      findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0].props.onChange({ target: { value: 'เปิดเครื่องมือที่ขอ' } });
      await settle(view);
      await new Promise(resolve => setTimeout(resolve, 70));
      await settle(view);
      const old = kind === 'ask'
        ? findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0].props.onKeyDown
        : findAll(view.tree, n => n.type === 'button' && textOf(n).includes('สั่งให้จัดการ'))[0].props.onClick;
      findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0].props.onChange({ target: { value: 'เปิดคำสั่งใหม่ของนิสิต' } });
      await settle(view);
      await old({ key: 'Enter', ctrlKey: true, preventDefault() {} });
      await settle(view);
      assert.equal(requests, 0);
    } finally { view.unmount(); }
  });
}

test('a finished current voice command starts once before text render and still requires confirmation', async () => {
  const calls = [];
  const valid = validateAction({ type: 'feature', params: { id: 'exam-mode' }, say: 'Current voice command sentinel' }, buildCatalog());
  globalThis.fetch = async (_url, options) => {
    calls.push(JSON.parse(options.body));
    return { ok: true, status: 200, headers: { get: () => 'application/json' }, json: async () => ({ action: valid.action, say: valid.say }) };
  };
  let recognizer;
  const previous = window.SpeechRecognition;
  window.SpeechRecognition = class {
    constructor() { recognizer = this; }
    start() {}
    stop() {}
  };
  let invoked = null;
  const view = mount(Palette, { open: true, onClose() {}, ownerId: 'A', notes: {}, signedIn: true, selectedYear: 5, onPractice: preset => { invoked = preset; } });
  try {
    await settle(view);
    const mic = findAll(view.tree, n => n.type === 'button' && n.props['aria-label'] === 'สั่งงานหรือถามด้วยเสียง')[0];
    assert.ok(mic);
    mic.props.onClick();
    recognizer.onresult({ results: [[{ transcript: 'เปิดเครื่องมือที่ขอ' }]] });
    recognizer.onend();
    await settle(view, 8);
    assert.deepEqual(calls, [{ utterance: 'เปิดเครื่องมือที่ขอ' }]);
    assert.equal(invoked, null);
    const confirm = findAll(view.tree, n => n.type === 'button' && textOf(n).trim() === 'ทำเลย')[0];
    assert.ok(confirm);
    confirm.props.onClick();
    assert.deepEqual(invoked, FEATURES.find(f => f.id === 'exam-mode').invoke);
  } finally { view.unmount(); window.SpeechRecognition = previous; }
});

test('closing speech input must not start a request from its stop-triggered onend callback', async () => {
  let recognizer, requests = 0;
  const previous = window.SpeechRecognition;
  window.SpeechRecognition = class {
    constructor() { recognizer = this; }
    start() {}
    stop() { this.onend?.(); }
  };
  globalThis.fetch = async () => { requests++; return { ok: false, status: 503, headers: { get: () => 'application/json' }, json: async () => ({ reason: 'budget' }) }; };
  const view = mount(Palette, { open: true, onClose() {}, ownerId: 'A', notes: {}, signedIn: true, selectedYear: 5 });
  try {
    await settle(view);
    const mic = findAll(view.tree, n => n.type === 'button' && n.props['aria-label'] === 'สั่งงานหรือถามด้วยเสียง')[0];
    assert.ok(mic);
    mic.props.onClick();
    recognizer.onresult({ results: [[{ transcript: 'เปิดเครื่องมือที่ขอ' }]] });
    view.unmount();
    assert.equal(requests, 0);
  } finally { if (!view.dead) view.unmount(); window.SpeechRecognition = previous; }
});
