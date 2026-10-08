import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll } from '../helpers/fake-react.mjs';
import * as library from '../../src/lib/library.js';

globalThis.__libraryIntentFunctions = library;
globalThis.__libraryIntentCatalogCalls = 0;
const { default: LibraryView } = await loadModule('src/views/LibraryView.jsx', { stubs: [
  { match: '\\.css$', contents: '' },
  { match: '/components/Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/ExternalDocsSection\\.jsx$', contents: 'export default () => null;' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
  { match: '/lib/library\\.js$', contents: `
    export const { LIBRARY_KINDS, SEMESTERS, buddhistYear, docOpenMode, prefetchDocUrl, docTypeLabel,
      filterIndexed, formatBytes, groupByYearSubject, indexDocs, kindLabel, listRecentDocs,
      readerPayload, recordRecentDoc, resolveDocUrl, semesterLabel, subjectMeta } = globalThis.__libraryIntentFunctions;
    export const getLibraryCatalogFast = () => {
      globalThis.__libraryIntentCatalogCalls++;
      return { stale: Promise.resolve(null), fresh: Promise.resolve({ docs: [], configured: true }) };
    };` },
] });
const queryValue = view => findAll(view.tree, node => node.type === 'input' && node.props.placeholder === 'ค้นหาชื่อเอกสาร วิชา ผู้สอน หรือหัวข้อ…')[0].props.value;

test('Library handoffs survive discarded renders, acknowledge only captured rows and retain URL/same-view behavior', async t => {
  const tickets = new Map(), local = new Map(), listeners = new Map();
  const storage = map => ({ getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, String(value)), removeItem: key => map.delete(key) });
  globalThis.sessionStorage = storage(tickets);
  globalThis.localStorage = storage(local);
  globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
  globalThis.cancelAnimationFrame = clearTimeout;
  globalThis.window = { localStorage, sessionStorage, location: new URL('https://fixture.test/app/library'),
    addEventListener: (name, handler) => listeners.set(name, handler), removeEventListener: name => listeners.delete(name),
    history: { state: {}, replaceState(state, _title, url) { this.state = state; window.location = new URL(url, window.location.href); } } };
  t.after(() => {
    delete globalThis.window; delete globalThis.localStorage; delete globalThis.sessionStorage;
    delete globalThis.requestAnimationFrame; delete globalThis.cancelAnimationFrame;
  });
  sessionStorage.setItem('vmx-library-q', 'captured query');
  sessionStorage.setItem('vmx-library-subject', 'surg2');
  assert.throws(() => mount(props => {
    LibraryView(props);
    throw new Error('discard-before-commit');
  }, {}), /discard-before-commit/);
  assert.equal(sessionStorage.getItem('vmx-library-q'), 'captured query');
  assert.equal(sessionStorage.getItem('vmx-library-subject'), 'surg2');
  assert.equal(window.location.search, '');
  assert.equal(globalThis.__libraryIntentCatalogCalls, 0);
  let view = mount(LibraryView, {});
  await settle(view);
  assert.equal(queryValue(view), 'captured query');
  assert.equal(window.location.searchParams.get('subject'), 'surg2');
  assert.equal(sessionStorage.getItem('vmx-library-q'), null);
  assert.equal(sessionStorage.getItem('vmx-library-subject'), null);
  view.unmount();

  sessionStorage.setItem('vmx-library-q', 'old query');
  sessionStorage.setItem('vmx-library-subject', 'surg2');
  let replace = true;
  view = mount(props => {
    const tree = LibraryView(props);
    if (replace) {
      replace = false;
      sessionStorage.setItem('vmx-library-q', 'new query');
      sessionStorage.setItem('vmx-library-subject', 'com4');
    }
    return tree;
  }, {});
  await settle(view);
  assert.equal(sessionStorage.getItem('vmx-library-q'), 'new query');
  assert.equal(sessionStorage.getItem('vmx-library-subject'), 'com4');
  view.unmount();
  view = mount(LibraryView, {});
  await settle(view);
  assert.equal(queryValue(view), 'new query');
  assert.equal(window.location.searchParams.get('subject'), 'com4');
  view.unmount();

  window.location = new URL('https://fixture.test/app/library?q=url%20query&subject=com5&kind=slide&semester=2&ay=2569');
  view = mount(LibraryView, {});
  await settle(view);
  assert.equal(queryValue(view), 'url query');
  assert.equal(window.location.searchParams.get('subject'), 'com5');
  assert.equal(window.location.searchParams.get('kind'), 'slide');
  sessionStorage.setItem('vmx-library-q', 'same-view query');
  sessionStorage.setItem('vmx-library-subject', 'surg2');
  listeners.get('vmx-view-intent')({ detail: { view: 'library' } });
  view.flush();
  assert.equal(queryValue(view), 'same-view query');
  assert.equal(window.location.searchParams.get('subject'), 'surg2');
  for (const key of ['kind', 'semester', 'ay']) assert.equal(window.location.searchParams.has(key), false);
  assert.equal(sessionStorage.getItem('vmx-library-q'), null);
  assert.equal(sessionStorage.getItem('vmx-library-subject'), null);
  view.unmount();
});
