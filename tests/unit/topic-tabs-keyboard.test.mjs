// ============================================================
// The topic screen's two tabs are one keyboard stop (OV-ui-21)
// ============================================================
// WAI-ARIA tabs: the selected tab is the only one in the Tab order, Left and
// Right move between tabs (wrapping), Home and End jump to the first and last,
// and focus follows the selection. Until now both tabs sat in the Tab order,
// the arrow keys did nothing, and the unselected tab pointed aria-controls at
// a panel that was not rendered.
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModule, mount, settle, findAll } from '../helpers/fake-react.mjs';
import * as library from '../../src/lib/library.js';

globalThis.__tabsLibrary = { ...library, librarySubjectCounts: async () => new Map() };
const stubs = [
  { match: '\\.css$', contents: '' },
  { match: '/components/Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
  { match: '/lib/library\\.js$', contents: `export const { ${Object.keys(library).join(', ')} } = globalThis.__tabsLibrary;` },
];
const { default: TopicSelectView } = await loadModule('src/views/TopicSelectView.jsx', { stubs });

const props = { subject: 'com4', selectedYear: 4, mode: 'quick', setView() {}, setTopic() {}, setMode() {}, setSubject() {} };

function browser(t) {
  const storage = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };
  globalThis.sessionStorage = storage();
  globalThis.localStorage = storage();
  globalThis.window = { sessionStorage, localStorage, location: new URL('https://fixture.test/app/topics'), addEventListener() {}, removeEventListener() {} };
  t.after(() => { delete globalThis.window; delete globalThis.sessionStorage; delete globalThis.localStorage; });
}

const tablist = (tree) => findAll(tree, (n) => n.props.role === 'tablist')[0];
const tabs = (tree) => Object.fromEntries(findAll(tree, (n) => n.props.role === 'tab').map((n) => [n.props.id.replace('vmx-topic-tab-', ''), n.props]));
const panels = (tree) => findAll(tree, (n) => n.props.role === 'tabpanel').map((n) => n.props.id);

/** A key press on the tablist; records preventDefault and which tab was focused. */
function press(view, key) {
  const log = { prevented: false, focused: [] };
  tablist(view.tree).props.onKeyDown({
    key,
    preventDefault() { log.prevented = true; },
    currentTarget: { querySelector: (selector) => ({ focus() { log.focused.push(selector); } }) },
  });
  view.flush();
  return log;
}

function expectSelected(tree, id) {
  const t = tabs(tree);
  const other = id === 'topics' ? 'resources' : 'topics';
  assert.equal(t[id]['aria-selected'], true);
  assert.equal(t[id].tabIndex, 0, `${id} is the one Tab stop`);
  assert.equal(t[id]['aria-controls'], `vmx-topic-panel-${id}`);
  assert.equal(t[other]['aria-selected'], false);
  assert.equal(t[other].tabIndex, -1, `${other} leaves the Tab order`);
  assert.equal(t[other]['aria-controls'], undefined, 'an unrendered panel is not pointed at');
  assert.deepEqual(panels(tree), [`vmx-topic-panel-${id}`], 'only the selected panel is rendered, and it is the one aria-controls names');
}

test('the selected tab is the only Tab stop and the only one with aria-controls', async (t) => {
  browser(t);
  const view = mount(TopicSelectView, props);
  await settle(view);
  expectSelected(view.tree, 'topics');
  view.unmount();
});

test('Right and Left move between the tabs and wrap; focus follows the selection', async (t) => {
  browser(t);
  const view = mount(TopicSelectView, props);
  await settle(view);
  let log = press(view, 'ArrowRight');
  expectSelected(view.tree, 'resources');
  assert.equal(log.prevented, true, 'the page must not scroll');
  assert.deepEqual(log.focused, ['#vmx-topic-tab-resources']);
  log = press(view, 'ArrowRight');
  expectSelected(view.tree, 'topics');
  assert.deepEqual(log.focused, ['#vmx-topic-tab-topics'], 'wraps from the last tab to the first');
  log = press(view, 'ArrowLeft');
  expectSelected(view.tree, 'resources');
  assert.deepEqual(log.focused, ['#vmx-topic-tab-resources'], 'wraps from the first tab to the last');
  view.unmount();
});

test('Home and End jump to the first and last tab', async (t) => {
  browser(t);
  const view = mount(TopicSelectView, props);
  await settle(view);
  let log = press(view, 'End');
  expectSelected(view.tree, 'resources');
  assert.deepEqual(log.focused, ['#vmx-topic-tab-resources']);
  log = press(view, 'Home');
  expectSelected(view.tree, 'topics');
  assert.deepEqual(log.focused, ['#vmx-topic-tab-topics']);
  view.unmount();
});

test('other keys are left alone', async (t) => {
  browser(t);
  const view = mount(TopicSelectView, props);
  await settle(view);
  for (const key of ['Enter', ' ', 'Tab', 'ArrowDown', 'a']) {
    const log = press(view, key);
    assert.equal(log.prevented, false, `${JSON.stringify(key)} is not the tablist's to swallow`);
    assert.deepEqual(log.focused, []);
    expectSelected(view.tree, 'topics');
  }
  view.unmount();
});
