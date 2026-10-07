import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import * as registry from '../../src/lib/feature-registry.js';
import * as library from '../../src/lib/library.js';
import { SUBJECTS } from '../../src/data/curriculum.js';

import { FEATURES, IMAGING_PRO_URL, RESEARCH_STUDIO_URL } from '../../src/lib/feature-registry.js';

globalThis.__notesIntentLibrary = { ...library, librarySubjectCounts: async () => new Map() };
const stubs = [
  { match: '\\.css$', contents: '' },
  { match: '/components/Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
  { match: '/lib/library\\.js$', contents: `export const { ${Object.keys(library).join(', ')} } = globalThis.__notesIntentLibrary;` },
];
const { default: SubjectSelectView } = await loadModule('src/views/SubjectSelectView.jsx', { stubs });
const { default: TopicSelectView } = await loadModule('src/views/TopicSelectView.jsx', { stubs });
function intentBrowser(t) {
  const values = new Map(), local = new Map(), listeners = new Map();
  const storage = map => ({ getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, String(value)), removeItem: key => map.delete(key) });
  globalThis.sessionStorage = storage(values);
  globalThis.localStorage = storage(local);
  globalThis.window = { sessionStorage, localStorage, location: new URL('https://fixture.test/app/subjects'),
    addEventListener: (name, callback) => listeners.set(name, callback), removeEventListener: name => listeners.delete(name) };
  t.after(() => { delete globalThis.window; delete globalThis.sessionStorage; delete globalThis.localStorage; });
  return { values, listeners };
}

test('Subject notes intent survives an abandoned render, preserves replacement and retains same-view/practice behavior', async t => {
  const { values, listeners } = intentBrowser(t), calls = [];
  const subject = SUBJECTS.find(item => item.id === 'com4');
  const props = { selectedYear: 4, mode: 'quick', setSubject() {}, setTopic() {}, setPracticeMode() {}, setView: value => calls.push(value) };
  registry.rememberViewIntent('notes');
  assert.throws(() => mount(options => { SubjectSelectView(options); throw new Error('subject-discard-before-commit'); }, props), /subject-discard-before-commit/);
  assert.equal(values.get('vmx-view-intent'), 'notes');
  let view = mount(SubjectSelectView, props);
  await settle(view);
  assert.equal(values.has('vmx-view-intent'), false);
  assert.equal(findAll(view.tree, node => node.props.className?.split(/\s+/).includes('vmx-subject-card') && textOf(node).includes('รวมทุกวิชา')).length, 0,
    'a reading choice must not offer the practice-only aggregate');
  const card = findAll(view.tree, node => node.props.className?.split(/\s+/).includes('vmx-subject-card') && textOf(node).includes(subject.name))[0];
  assert.ok(card);
  card.props.onClick();
  assert.equal(calls.at(-1), 'topic-select');
  assert.equal(registry.takeViewIntent(), 'notes', 'the actual subject callback forwards reading only to a topic destination');
  registry.rememberViewIntent('unknown-intent');
  listeners.get('vmx-view-intent')({ detail: { view: 'subject-select' } });
  view.flush();
  assert.equal(values.has('vmx-view-intent'), false, 'the same-view event retains default single-use consumption');
  const aggregate = findAll(view.tree, node => node.props.className?.split(/\s+/).includes('vmx-subject-card') && textOf(node).includes('รวมทุกวิชา'));
  assert.equal(aggregate.length, 1, 'ordinary practice restores the aggregate');
  aggregate[0].props.onClick();
  assert.equal(calls.at(-1), 'config', 'the normal aggregate keeps its existing destination');
  findAll(view.tree, node => node.props.className?.split(/\s+/).includes('vmx-subject-card') && textOf(node).includes(subject.name))[0].props.onClick();
  assert.equal(registry.takeViewIntent(), null, 'a normal practice selection does not forward notes');
  view.unmount();
  registry.rememberViewIntent('notes');
  let replace = true;
  view = mount(options => {
    const tree = SubjectSelectView(options);
    if (replace) { replace = false; registry.rememberViewIntent('newer-intent'); }
    return tree;
  }, props);
  await settle(view);
  assert.equal(registry.takeViewIntent(), 'newer-intent');
  view.unmount();
  const read = sessionStorage.getItem;
  sessionStorage.getItem = () => { throw new Error('storage refused'); };
  assert.equal(registry.takeViewIntent(), null);
  sessionStorage.getItem = read;
  registry.rememberViewIntent(undefined);
  assert.equal(registry.takeViewIntent(), null);
});

test('Topic notes intent survives an abandoned render without consuming a replacement or explicit resources shortcut', async t => {
  const { values } = intentBrowser(t);
  const props = { subject: 'com4', selectedYear: 4, mode: 'quick', setView() {}, setTopic() {}, setMode() {} };
  const resources = view => findAll(view.tree, node => node.props.id === 'vmx-topic-tab-resources')[0].props['aria-selected'];
  registry.rememberViewIntent('notes');
  assert.throws(() => mount(options => { TopicSelectView(options); throw new Error('topic-discard-before-commit'); }, props), /topic-discard-before-commit/);
  assert.equal(values.get('vmx-view-intent'), 'notes');
  let view = mount(TopicSelectView, props);
  await settle(view);
  assert.equal(resources(view), true);
  assert.equal(values.has('vmx-view-intent'), false);
  view.unmount();
  registry.rememberViewIntent('notes');
  let replace = true;
  view = mount(options => {
    const tree = TopicSelectView(options);
    if (replace) { replace = false; registry.rememberViewIntent('newer-intent'); }
    return tree;
  }, props);
  await settle(view);
  assert.equal(registry.takeViewIntent(), 'newer-intent');
  view.unmount();
  registry.rememberViewIntent('notes');
  view = mount(TopicSelectView, { ...props, initialSection: 'resources' });
  await settle(view);
  assert.equal(resources(view), true);
  assert.equal(registry.takeViewIntent(), 'notes', 'explicit resources keeps the existing short-circuit semantics');
  view.unmount();
  for (const intent of [undefined, 'unknown-intent']) {
    registry.rememberViewIntent(intent);
    view = mount(TopicSelectView, props);
    await settle(view);
    assert.equal(resources(view), false);
    assert.equal(registry.takeViewIntent(), null);
    view.unmount();
  }
});

test('VetMock keeps a local practical Imaging Lab', () => {
  const practical = FEATURES.find((feature) => feature.id === 'lab');

  assert.ok(practical, 'Practical Imaging must remain discoverable');
  assert.equal(practical.fab, true, 'Practical Imaging belongs in quick tools');
  assert.match(practical.label, /Practical/);
  assert.deepEqual(practical.invoke, { kind: 'view', view: 'lab' });
});

test('the full Imaging Pro workstation stays a distinct external feature', () => {
  const pro = FEATURES.find((feature) => feature.id === 'imaging-pro');

  assert.ok(pro, 'Imaging Pro must remain discoverable');
  assert.notEqual(pro.id, 'lab');
  assert.deepEqual(pro.invoke, { kind: 'external', url: IMAGING_PRO_URL });
  assert.equal(IMAGING_PRO_URL, 'https://imaging.cuvetsmo.com');
});

test('the palette opens the Research Studio on its own origin, found by the words students search with', () => {
  const rs = FEATURES.find((feature) => feature.id === 'research-studio');

  assert.ok(rs, 'Research Studio must be discoverable');
  assert.equal(rs.category, 'tools');
  assert.deepEqual(rs.invoke, { kind: 'external', url: RESEARCH_STUDIO_URL });
  assert.equal(RESEARCH_STUDIO_URL, 'https://research.vetmock.com');
  for (const word of ['spss', 'epi info', 'winepiscope', 'epitools', 'สถิติ', 'วิเคราะห์ข้อมูล', 'วิจัย', 't-test', 'chi-square', 'odds ratio', 'sample size']) {
    assert.ok(rs.kw.includes(word), `keyword ${word}`);
  }
});
