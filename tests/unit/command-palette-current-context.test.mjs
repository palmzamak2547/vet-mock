import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import { FEATURES } from '../../src/lib/feature-registry.js';

class Storage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}
const storage = new Storage();
globalThis.window = new EventTarget(); window.localStorage = storage;
globalThis.localStorage = storage; globalThis.sessionStorage = storage;
globalThis.matchMedia = () => ({ matches: true });
globalThis.__paletteEntries = [];
const { default: CommandPalette } = await loadModule('src/components/CommandPalette.jsx', { stubs: [
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
  { match: '/lib/omni-sources\\.js$', contents: 'export const OMNI_SOURCES = [{ id: "library", label: "คลังเอกสาร", icon: "", load: async () => globalThis.__paletteEntries }];' },
  { match: '/lib/library\\.js$', contents: 'export const docOpenMode = () => ({ action: "read" }); export const readerPayload = doc => doc; export const recordRecentDoc = () => {}; export const resolveDocUrl = async () => "";' },
] });
function setup({ recents = [], notes = {}, owner = 'A', entries = [], props = {} } = {}) {
  storage.values.clear();
  storage.setItem('vmx-omni-recents', JSON.stringify(recents));
  storage.setItem('vmx-notes', JSON.stringify(notes));
  storage.setItem('vmx-user-sync-owner-v1', JSON.stringify(owner));
  window.dispatchEvent(new Event('vmx-palette-invalidate'));
  globalThis.__paletteEntries = entries;
  return mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: owner, ...props });
}
const recent = feature => ({ type: 'action', featureId: feature.id, label: feature.label,
  hint: feature.hint, icon: feature.icon, payload: feature.invoke });
const resultRows = view => findAll(view.tree, node => node.type === 'button' && node.props['data-flat-idx'] != null);
const searchInput = view => findAll(view.tree, node => node.type === 'input' && node.props['aria-label'] === 'ค้นหาใน VetMock')[0];

for (const [query, expected] of [['schedule', 'schedule'], ['no-matching-palette-result', null]]) {
  test(`rapid Enter resolves the current query ${query} before debounce`, async () => {
    let destination = null;
    const view = setup({ props: { goView: value => { destination = value; } } });
    try {
      await settle(view);
      searchInput(view).props.onChange({ target: { value: query } });
      view.flush();
      assert.equal(searchInput(view).props.value, query, 'input echoes immediately');
      searchInput(view).props.onKeyDown({ key: 'Enter', preventDefault() {} });
      assert.equal(destination, expected);
    } finally { view.unmount(); }
  });
}

test('rapid Enter after clearing a query uses current recents instead of the old result', async () => {
  let destination = null;
  const view = setup({ props: { goView: value => { destination = value; } } });
  try {
    await settle(view);
    searchInput(view).props.onChange({ target: { value: 'schedule' } });
    view.flush();
    await new Promise(resolve => setTimeout(resolve, 70));
    view.flush();
    assert.ok(textOf(resultRows(view)[0]).includes('ตารางเรียน'));
    searchInput(view).props.onChange({ target: { value: '' } });
    view.flush();
    searchInput(view).props.onKeyDown({ key: 'Enter', preventDefault() {} });
    assert.equal(destination, 'home');
  } finally { view.unmount(); }
});

test('rapid Enter on a question asks the current text once without opening an old result', async () => {
  const previousFetch = globalThis.fetch, requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push([url, JSON.parse(options.body).question]);
    return { ok: true, headers: { get: () => 'application/json' }, json: async () => ({ answer: 'Fixture answer' }) };
  };
  let destination = null;
  const view = setup({ props: { goView: value => { destination = value; } } });
  try {
    await settle(view);
    searchInput(view).props.onChange({ target: { value: 'why is rabies fatal?' } });
    view.flush();
    searchInput(view).props.onKeyDown({ key: 'Enter', preventDefault() {} });
    await settle(view);
    assert.deepEqual(requests, [['/api/wiki-explain', 'why is rabies fatal?']]);
    assert.equal(destination, null);
  } finally { view.unmount(); globalThis.fetch = previousFetch; }
});

for (const event of [
  { key: 'Enter', nativeEvent: { isComposing: true } },
  { key: 'Enter', keyCode: 229 },
  { key: 'Escape', nativeEvent: { isComposing: true } },
]) {
  test(`composition ${event.key} (${event.keyCode || 'native'}) cannot select or close search`, async () => {
    let destination = null, closes = 0, prevented = false;
    const view = setup({ props: { goView: value => { destination = value; }, onClose: () => { closes++; } } });
    try {
      await settle(view);
      searchInput(view).props.onKeyDown({ ...event, preventDefault: () => { prevented = true; } });
      assert.equal(destination, null);
      assert.equal(closes, 0);
      assert.equal(prevented, false, 'the input method keeps its native key behavior');
    } finally { view.unmount(); }
  });
}

test('bookmark and missing-note fallback dispatch the supplied topic reset', async () => {
  for (const note of [false, true]) {
    const calls = [];
    const view = setup({ notes: note ? { 100: 'A note on a removed question' } : {}, props: {
      setTopic: value => calls.push(['topic', value]),
      setPracticeMode: value => calls.push(['mode', value]),
      goView: value => calls.push(['view', value]),
      onOpenQuestion: async () => false,
    } });
    try {
      await settle(view);
      const row = resultRows(view).find(row => textOf(row).includes(note ? 'A note on a removed question' : 'Bookmarks'));
      assert.ok(row);
      row.props.onClick();
      await settle(view);
      assert.deepEqual(calls, [['topic', null], ['mode', 'bookmarks'], ['view', 'config']]);
    } finally { view.unmount(); }
  }
});

test('show more reveals the remaining search matches after the first expanded page', async () => {
  const entries = Array.from({ length: 45 }, (_, id) => ({ type: 'library-doc', label: `polishlibrary ${id}`,
    _labelLc: `polishlibrary ${id}`, _hayLc: `polishlibrary ${id}`, payload: { id: String(id), status: 'public' } }));
  const view = setup({ entries });
  const more = () => findAll(view.tree, node => node.type === 'button' && textOf(node).includes('แสดงเพิ่ม'))[0];
  try {
    await settle(view);
    searchInput(view).props.onChange({ target: { value: 'polishlibrary' } });
    view.flush();
    await new Promise(resolve => setTimeout(resolve, 70));
    view.flush();
    assert.equal(resultRows(view).length, 6);
    more().props.onClick(); view.flush();
    assert.equal(resultRows(view).length, 30);
    more().props.onClick(); view.flush();
    assert.equal(resultRows(view).length, 45);
    assert.equal(more(), undefined);
  } finally { view.unmount(); }
});

test('recent actions obey current auth and year visibility; removed library hits disappear', async () => {
  const account = FEATURES.find(feature => feature.id === 'account-settings');
  const lesson = FEATURES.find(feature => feature.id === 'bench');
  const view = setup({ recents: [recent(account), recent(lesson), {
    type: 'library-doc', label: 'Restricted saved lecture title', payload: { id: 'restricted', status: 'login' },
  }], props: { signedIn: false, selectedYear: 1 } });
  try {
    await settle(view);
    const text = textOf(view.tree);
    assert.equal(text.includes(account.label), false);
    assert.equal(text.includes(lesson.label), false);
    assert.equal(text.includes('Restricted saved lecture title'), false);
  } finally { view.unmount(); }
});

test('a visible recent action keeps its position and dispatches the current registry payload', async () => {
  const exam = FEATURES.find(feature => feature.id === 'exam-mode'); let invoked;
  for (const saved of [
    { ...recent(exam), label: 'Old saved action label' },
    { ...recent(exam), featureId: undefined }, // prior recordings have only the label
  ]) {
    const view = setup({ recents: [{ ...saved, payload: { ...exam.invoke, numQuestions: 999 } }],
      props: { onPractice: invocation => { invoked = invocation; } } });
    try {
      await settle(view);
      assert.equal(textOf(view.tree).includes('Old saved action label'), false);
      const row = resultRows(view)[0]; assert.ok(textOf(row).includes(exam.label));
      row.props.onClick();
      assert.deepEqual(invoked, exam.invoke);
    } finally { view.unmount(); }
  }
});

test('normal document recents resolve current metadata and open the current reader payload', async () => {
  const doc = { id: 'public-doc', title: 'Updated public document', status: 'public', url: 'https://example.test/current.pdf' };
  let opened;
  const view = setup({ recents: [{ type: 'library-doc', label: 'Old saved document title',
    payload: { ...doc, url: 'https://example.test/obsolete.pdf' } }],
    entries: [{ type: 'library-doc', label: doc.title, payload: doc }],
    props: { onOpenLibraryDoc: payload => { opened = payload; } } });
  try {
    await settle(view);
    assert.equal(textOf(view.tree).includes('Old saved document title'), false);
    const row = resultRows(view)[0]; assert.ok(textOf(row).includes(doc.title));
    row.props.onClick(); assert.deepEqual(opened, doc);
  } finally { view.unmount(); }
});

test('owner note changes cannot inherit the old static cache with the same question-bank size', async () => {
  let view = setup({ notes: { 100: 'Private note from account A' } });
  try {
    await settle(view); assert.ok(textOf(view.tree).includes('Private note from account A'));
    view.update({ ownerId: 'B' }); await settle(view);
    assert.equal(textOf(view.tree).includes('Private note from account A'), false, 'B renders before the legacy mirror changes');
    view.unmount();
    storage.setItem('vmx-notes', JSON.stringify({ 100: 'Private note from account B' }));
    storage.setItem('vmx-user-sync-owner-v1', '"B"');
    view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'B' });
    await settle(view);
    assert.equal(textOf(view.tree).includes('Private note from account A'), false);
    assert.ok(textOf(view.tree).includes('Private note from account B'));
    view.update({ signedIn: false, ownerId: null }); await settle(view);
    assert.equal(textOf(view.tree).includes('Private note from account B'), false);
    storage.setItem('vmx-notes', '{}'); storage.setItem('vmx-user-sync-owner-v1', '"anonymous"');
    view.update({}); await settle(view);
  } finally { view.unmount(); }
});

test('unavailable browser storage still renders the ordinary search actions', async () => {
  Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('storage disabled'); } });
  let view;
  try {
    view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5 }); await settle(view);
    assert.ok(textOf(view.tree).includes('หน้าแรก'));
  } finally {
    view?.unmount(); Object.defineProperty(window, 'localStorage', { configurable: true, value: storage, writable: true });
  }
});

test('a cached restricted library row remains hidden from the signed-out palette', async () => {
  const view = setup({ entries: [{ type: 'library-doc', label: 'Cached restricted course document',
    payload: { id: 'private-cache', status: 'login' } }], props: { signedIn: false } });
  try {
    await settle(view);
    assert.equal(textOf(view.tree).includes('Cached restricted course document'), false);
  } finally { view.unmount(); }
});

test('a malformed recent archive does not prevent ordinary search actions', async () => {
  storage.setItem('vmx-omni-recents', '{}');
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, ownerId: null });
  try { await settle(view); assert.ok(textOf(view.tree).includes('หน้าแรก')); }
  finally { view.unmount(); }
});

const { OMNI_SOURCES } = await loadModule('src/lib/omni-sources.js', { stubs: [
  { match: '(^|/)library\\.js$', contents: 'export const getLibraryCatalog = async () => typeof globalThis.__currentPaletteCatalog === "function" ? globalThis.__currentPaletteCatalog() : globalThis.__currentPaletteCatalog; export const subjectMeta = () => null; export const formatBytes = () => "";' },
] });
test('the real omni source drops its library cache across A, logout and B auth events', async () => {
  const catalog = id => ({ docs: [{ id, title: id, status: id === 'public' ? 'public' : 'restricted' }] });
  window.dispatchEvent(new Event('vmx-palette-invalidate'));
  globalThis.__currentPaletteCatalog = catalog('account-A');
  assert.deepEqual((await OMNI_SOURCES[0].load()).map(entry => entry.payload.id), ['account-A']);
  globalThis.__currentPaletteCatalog = catalog('public');
  window.dispatchEvent(new Event('vmx-library-auth-changed'));
  assert.deepEqual((await OMNI_SOURCES[0].load()).map(entry => entry.payload.id), ['public']);
  globalThis.__currentPaletteCatalog = catalog('account-B');
  window.dispatchEvent(new Event('vmx-library-auth-changed'));
  assert.deepEqual((await OMNI_SOURCES[0].load()).map(entry => entry.payload.id), ['account-B']);
});

test('an old account catalogue completing after logout cannot refill the cleared omni cache', async () => {
  window.dispatchEvent(new Event('vmx-palette-invalidate'));
  let release;
  globalThis.__currentPaletteCatalog = () => new Promise(resolve => { release = resolve; });
  const oldRequest = OMNI_SOURCES[0].load();
  globalThis.__currentPaletteCatalog = { docs: [{ id: 'public-after-logout', status: 'public' }] };
  window.dispatchEvent(new Event('vmx-library-auth-changed'));
  assert.deepEqual((await OMNI_SOURCES[0].load()).map(entry => entry.payload.id), ['public-after-logout']);
  release({ docs: [{ id: 'old-account-private', status: 'restricted' }] });
  await oldRequest;
  assert.deepEqual((await OMNI_SOURCES[0].load()).map(entry => entry.payload.id), ['public-after-logout']);
});

test('mounted search follows same-owner canonical notes updates without a question-bank resize', async () => {
  const first = { 100: 'Original note in this account' }, edited = { 100: 'Updated note in this account' };
  const view = setup({ notes: first, props: { notes: first } });
  try {
    await settle(view); assert.ok(textOf(view.tree).includes(first[100]));
    view.update({ notes: edited }); await settle(view);
    assert.equal(textOf(view.tree).includes(first[100]), false);
    assert.ok(textOf(view.tree).includes(edited[100]));
  } finally { view.unmount(); }
});

test('the first B render hides A source rows before the reload effect runs', async () => {
  storage.values.clear(); storage.setItem('vmx-user-sync-owner-v1', '"A"');
  window.dispatchEvent(new Event('vmx-palette-invalidate'));
  globalThis.__paletteEntries = [{ type: 'library-doc', label: 'Account A restricted catalogue title',
    payload: { id: 'A-private', status: 'restricted' } }];
  const renders = [];
  const capture = props => { const tree = CommandPalette(props); renders.push(textOf(tree)); return tree; };
  const view = mount(capture, { open: true, onClose() {}, ownerId: 'A', signedIn: true, selectedYear: 5, notes: {} });
  let release;
  try {
    await settle(view); assert.ok(textOf(view.tree).includes('Account A restricted catalogue title'));
    globalThis.__paletteEntries = new Promise(resolve => { release = resolve; });
    const before = renders.length;
    view.update({ ownerId: 'B' });
    assert.equal(renders[before].includes('Account A restricted catalogue title'), false);
  } finally { view.unmount(); release?.([]); }
});
