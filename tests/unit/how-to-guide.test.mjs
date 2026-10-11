// ============================================================
// how-to-guide.test.mjs — the วิธีใช้ guide and the hint, driven for real
// ============================================================
// The real OnboardingTour and FeatureTip, mounted with the fake hook runtime
// (tests/helpers/fake-react.mjs). What a student does is what is tested:
//   - the guide opens on a list of goals, a goal opens its numbered steps,
//     and "เรื่องถัดไป" walks the goals in order to "เสร็จแล้ว";
//   - a step's go button does what a bottom-bar tap does (lib/nav.js runNav),
//     a feature keeps its registry intent (สรุปบทเรียน opens the picker in
//     reading mode), search opens the palette, and the guide closes first;
//   - without the app's handlers no go button is drawn at all, never a dead one;
//   - an opened goal is remembered and counted when the guide opens again,
//     and a hint can open the guide straight at its goal;
//   - App.jsx speaks the same event and attribute names the hint listens for.
// ============================================================

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';

const stores = { local: new Map(), session: new Map() };
const stub = (map) => ({
  getItem: (k) => (map.has(k) ? map.get(k) : null),
  setItem: (k, v) => { map.set(k, String(v)); },
  removeItem: (k) => { map.delete(k); },
  clear: () => map.clear(),
});
const attrs = {};
const dispatched = [];
beforeEach(() => {
  stores.local.clear();
  stores.session.clear();
  for (const k of Object.keys(attrs)) delete attrs[k];
  dispatched.length = 0;
  globalThis.localStorage = stub(stores.local);
  globalThis.sessionStorage = stub(stores.session);
  globalThis.document = {
    body: { style: {} },
    documentElement: { getAttribute: (n) => (n in attrs ? attrs[n] : null) },
  };
  globalThis.window = { dispatchEvent: (e) => { dispatched.push(e); return true; } };
  globalThis.CustomEvent ??= class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } };
  stores.local.set('vmx-selected-year', '5');
});

const stubs = [
  { match: '/hooks/useModalFocus\\.js$', contents: 'export function useModalFocus() { return { current: null }; }' },
  { match: '/Mochi\\.jsx$', contents: 'export default function Mochi() { return null; }' },
];
const { default: OnboardingTour } = await loadModule('src/components/OnboardingTour.jsx', { stubs });
const { default: FeatureTip } = await loadModule('src/components/FeatureTip.jsx', { stubs });
const { GUIDE_PATHS, FEATURE_TIPS } = await import('../../src/data/how-to.js');
const { NAV_ITEMS } = await import('../../src/lib/nav.js');

const buttons = (tree) => findAll(tree, (n) => n?.type === 'button');
const byText = (tree, re) => buttons(tree).find((b) => re.test(textOf(b)) || re.test(b.props?.['aria-label'] || ''));
const click = (inst, node) => { node.props.onClick({ currentTarget: { tagName: 'BUTTON' } }); return inst.flush(); };

function handlers() {
  const calls = [];
  const h = {
    setView: (v) => calls.push(['setView', v]),
    goHome: () => calls.push(['goHome']),
    setSubject: (v) => calls.push(['setSubject', v]),
    setPracticeMode: (v) => calls.push(['setPracticeMode', v]),
    setMode: (v) => calls.push(['setMode', v]),
    onMockExam: () => calls.push(['onMockExam']),
  };
  return { h, calls };
}

test('the guide opens on the list of goals and a goal opens its numbered steps', () => {
  const inst = mount(OnboardingTour, { onDismiss() {}, onStart() {} });
  const dialog = findAll(inst.tree, (n) => n?.props?.role === 'dialog')[0];
  const heading = findAll(inst.tree, (n) => n?.type === 'h2')[0];
  assert.equal(dialog.props['aria-labelledby'], heading.props.id, 'the dialog is not named by its visible heading');
  assert.equal(textOf(heading), 'วิธีใช้ VetMock');
  for (const p of GUIDE_PATHS) assert.ok(byText(inst.tree, new RegExp(p.title)), `goal ${p.id} is not on the list`);

  const tree = click(inst, byText(inst.tree, /ฝึกทุกวัน/));
  assert.equal(textOf(findAll(tree, (n) => n?.type === 'h2')[0]), GUIDE_PATHS[0].title);
  const steps = findAll(tree, (n) => n?.type === 'li' && n.props?.className === 'vmx-guide-step');
  assert.equal(steps.length, GUIDE_PATHS[0].steps.length);
  // The shared label is resolved from the registry, not typed into the copy.
  const navLabel = NAV_ITEMS.find((n) => n.id === 'subject-select').label;
  assert.ok(steps.some((s) => textOf(s).includes(navLabel)), 'the nav label did not reach the step');
  inst.unmount();
});

test('without the app\'s handlers no go button is drawn, so none can do nothing', () => {
  const inst = mount(OnboardingTour, { onDismiss() {} });
  const tree = click(inst, byText(inst.tree, /ฝึกทุกวัน/));
  assert.equal(findAll(tree, (n) => n?.props?.className === 'vmx-guide-go').length, 0);
  // onStart is the app's oldest contract; without it the try-one button hides too.
  assert.equal(byText(tree, /ลองทำ 1 ข้อเลย/), undefined);
  inst.unmount();
});

test('a nav go button closes the guide and does what the bottom bar does', () => {
  const { h, calls } = handlers();
  let dismissed = 0;
  const inst = mount(OnboardingTour, { onDismiss: () => { dismissed += 1; }, navHandlers: h });
  let tree = click(inst, byText(inst.tree, /ฝึกทุกวัน/));
  const navLabel = NAV_ITEMS.find((n) => n.id === 'subject-select').label;
  click(inst, byText(tree, new RegExp(`ไปที่ ${navLabel}`)));
  assert.equal(dismissed, 1, 'the guide stayed open over the destination');
  // runNav('subject-select'): the same reset a bar tap performs.
  assert.deepEqual(calls, [['setSubject', 'all'], ['setPracticeMode', 'all'], ['setMode', 'quick'], ['setView', 'subject-select']]);

  calls.length = 0;
  tree = click(inst, byText(inst.tree, /เรื่องถัดไป/));
  click(inst, byText(tree, /ไปที่ โหมดสอบ/));
  assert.deepEqual(calls, [['onMockExam']], 'โหมดสอบ did not use the mock-exam preset');
  inst.unmount();
});

test('a feature go button keeps the registry intent: สรุปบทเรียน opens the picker in reading mode', () => {
  const { h, calls } = handlers();
  const inst = mount(OnboardingTour, { onDismiss() {}, navHandlers: h });
  const tree = click(inst, byText(inst.tree, /อ่านสรุป จดโน้ต/));
  click(inst, byText(tree, /ไปที่ สรุปบทเรียน/));
  assert.deepEqual(calls, [['setView', 'subject-select']]);
  assert.equal(stores.session.get('vmx-view-intent'), 'notes', 'the reading intent was lost on the way');
  inst.unmount();
});

test('the search goal opens the palette, and only when the app can', () => {
  let opened = 0;
  const inst = mount(OnboardingTour, { onDismiss() {}, onOpenSearch: () => { opened += 1; }, navHandlers: handlers().h });
  const tree = click(inst, byText(inst.tree, /ค้นหาและถามคลังความรู้/));
  click(inst, byText(tree, /เปิดช่องค้นหา/));
  assert.equal(opened, 1);
  inst.unmount();
  const bare = mount(OnboardingTour, { onDismiss() {}, navHandlers: handlers().h });
  const t2 = click(bare, byText(bare.tree, /ค้นหาและถามคลังความรู้/));
  assert.equal(byText(t2, /เปิดช่องค้นหา/), undefined, 'a search button was drawn with no way to open search');
  bare.unmount();
});

test('an opened goal is remembered, and the list counts it when the guide opens again', () => {
  const first = mount(OnboardingTour, { onDismiss() {} });
  assert.doesNotMatch(textOf(first.tree), /ดูแล้ว/, 'a first-time student was shown a progress count');
  click(first, byText(first.tree, /ทบทวนข้อที่ตอบผิด/));
  first.unmount();
  assert.deepEqual(JSON.parse(stores.local.get('vmx-guide')).seen, ['mistakes']);

  const again = mount(OnboardingTour, { onDismiss() {} });
  assert.match(textOf(again.tree), new RegExp(`ดูแล้ว 1 จาก ${GUIDE_PATHS.length} เรื่อง`));
  again.unmount();
});

test('เรื่องถัดไป walks every goal in order and the last one finishes', () => {
  let dismissed = 0;
  const inst = mount(OnboardingTour, { onDismiss: () => { dismissed += 1; } });
  let tree = click(inst, byText(inst.tree, new RegExp(GUIDE_PATHS[0].title)));
  for (let i = 1; i < GUIDE_PATHS.length; i++) {
    tree = click(inst, byText(tree, /เรื่องถัดไป/));
    assert.equal(textOf(findAll(tree, (n) => n?.type === 'h2')[0]), GUIDE_PATHS[i].title);
  }
  click(inst, byText(tree, /เสร็จแล้ว/));
  assert.equal(dismissed, 1);
  assert.equal(JSON.parse(stores.local.get('vmx-guide')).seen.length, GUIDE_PATHS.length);
  inst.unmount();
});

test('a hint\'s request opens the guide straight at its goal, once', () => {
  stores.session.set('vmx-guide-open', 'read');
  const inst = mount(OnboardingTour, { onDismiss() {} });
  assert.equal(textOf(findAll(inst.tree, (n) => n?.type === 'h2')[0]), GUIDE_PATHS.find((p) => p.id === 'read').title);
  assert.equal(stores.session.has('vmx-guide-open'), false, 'the request outlived the open');
  inst.unmount();
  const next = mount(OnboardingTour, { onDismiss() {} });
  assert.equal(textOf(findAll(next.tree, (n) => n?.type === 'h2')[0]), 'วิธีใช้ VetMock', 'the next open did not start at the list');
  next.unmount();
});

test('the notes hint shows the print button on day one and is quiet for the rest of the day', () => {
  const inst = mount(FeatureTip, { id: 'notes' });
  const text = textOf(inst.tree);
  assert.match(text, new RegExp(FEATURE_TIPS.notes.tips[0].title));
  assert.match(text, /พิมพ์/);
  assert.ok(byText(inst.tree, /ปิดคำแนะนำ/), 'the hint has no close control');
  assert.equal(byText(inst.tree, /ดูวิธีใช้เรื่องนี้ทั้งหมด/), undefined, 'a link was drawn while nothing listens for it');
  inst.unmount();
  const again = mount(FeatureTip, { id: 'notes' });
  assert.equal(again.tree, null, 'the hint came back the same day');
  again.unmount();
});

test('the hint links to its goal only while the app listens, and the link asks for that goal', () => {
  attrs['data-vmx-guide'] = 'ready';
  const inst = mount(FeatureTip, { id: 'videos' });
  const link = byText(inst.tree, /ดูวิธีใช้เรื่องนี้ทั้งหมด/);
  assert.ok(link, 'no link although the app listens');
  click(inst, link);
  assert.equal(dispatched.at(-1)?.type, 'vmx-open-guide');
  assert.equal(stores.session.get('vmx-guide-open'), FEATURE_TIPS.videos.guide);
  inst.unmount();
});

test('dismissing a hint hides it at once and spends only its own day', () => {
  const inst = mount(FeatureTip, { id: 'library' });
  const tree = click(inst, byText(inst.tree, /ปิดคำแนะนำ/));
  assert.equal(tree, null);
  inst.unmount();
  const other = mount(FeatureTip, { id: 'schedule' });
  assert.notEqual(other.tree, null, 'closing one hint silenced another feature');
  other.unmount();
});

test('the VetWiki article gets its own words, not the index\'s', () => {
  const inst = mount(FeatureTip, { id: 'knowledge', surface: 'article' });
  const article = FEATURE_TIPS.knowledge.tips.find((t) => t.surface === 'article');
  assert.match(textOf(inst.tree), new RegExp(article.title));
  inst.unmount();
});

test('App opens the guide on the event a hint sends, and says so with the attribute a hint reads', async () => {
  const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
  const { GUIDE_OPEN_EVENT, GUIDE_READY_ATTR } = await import('../../src/lib/guide-progress.js');
  assert.ok(app.includes(`addEventListener('${GUIDE_OPEN_EVENT}'`), 'App does not listen for the hint\'s event');
  assert.ok(app.includes(`setAttribute('${GUIDE_READY_ATTR}', 'ready')`), 'App never tells hints it listens');
  assert.ok(app.includes(`removeAttribute('${GUIDE_READY_ATTR}')`), 'the attribute outlives the listener');
  assert.match(app, /<OnboardingTour[\s\S]*?navHandlers=\{navHandlers\}[\s\S]*?\/>/, 'the guide is not given the bottom bar\'s handlers');
});

process.on('exit', () => {
  delete globalThis.document;
  delete globalThis.window;
  delete globalThis.localStorage;
  delete globalThis.sessionStorage;
});
