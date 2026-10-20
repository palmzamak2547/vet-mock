// ============================================================
// library-external-tab — every way into the external-document reader
// ============================================================
// The reader used to be its own screen at /app/external-docs. It moved onto
// the library's second tab without an alias, so old links, bookmarks and the
// release notes that pointed there landed on Home, and the palette stopped
// finding it. The way back from a chat app's browser (?tab=external) needs
// the same door.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import * as library from '../../src/lib/library.js';
import { viewForAppPath, appPathForView, APP_VIEW_ROUTES } from '../../src/lib/view-route.js';
import { FEATURES, rememberViewIntent } from '../../src/lib/feature-registry.js';
import { ogCoverForRoute } from '../../src/data/og-covers.js';

globalThis.__libraryExternalFunctions = library;
const { default: LibraryView } = await loadModule('src/views/LibraryView.jsx', { stubs: [
  { match: '\\.css$', contents: '' },
  { match: '/components/Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/FeatureTip\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/ExternalDocsSection\\.jsx$', contents: "export default () => 'EXTERNAL READER';" },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
  { match: '/lib/library\\.js$', contents: `
    export const { LIBRARY_KINDS, SEMESTERS, buddhistYear, docOpenMode, prefetchDocUrl, docTypeLabel,
      displayDocTitle, filterIndexed, formatBytes, groupByYearSubject, indexDocs, kindLabel, listRecentDocs,
      readerPayload, recordRecentDoc, resolveDocUrl, semesterLabel, subjectMeta } = globalThis.__libraryExternalFunctions;
    export const getLibraryCatalogFast = () => ({ stale: Promise.resolve(null), fresh: Promise.resolve({ docs: [], configured: true }) });` },
] });

function browser(t, href) {
  const session = new Map(), local = new Map(), listeners = new Map();
  const storage = map => ({ getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, String(value)), removeItem: key => map.delete(key) });
  globalThis.sessionStorage = storage(session);
  globalThis.localStorage = storage(local);
  globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
  globalThis.cancelAnimationFrame = clearTimeout;
  globalThis.window = { localStorage, sessionStorage, location: new URL(href),
    addEventListener: (name, handler) => listeners.set(name, handler), removeEventListener: name => listeners.delete(name),
    history: { state: { vmxView: 'library' }, replaceState(state, _title, url) { this.state = state; window.location = new URL(url, window.location.href); } } };
  t.after(() => {
    delete globalThis.window; delete globalThis.localStorage; delete globalThis.sessionStorage;
    delete globalThis.requestAnimationFrame; delete globalThis.cancelAnimationFrame;
  });
  return { session, listeners };
}
const reading = view => textOf(view.tree).includes('EXTERNAL READER');

test('the retired /app/external-docs path opens the library on its external tab and settles on /app/library', async t => {
  assert.equal(viewForAppPath('/app/external-docs'), 'library');
  assert.equal(viewForAppPath('/app/external-docs/'), 'library');
  assert.equal(appPathForView('library'), '/app/library', 'the alias is never written back');
  assert.equal(Object.values(APP_VIEW_ROUTES).includes('/app/external-docs'), false);
  browser(t, 'https://vetmock.com/app/external-docs');
  const view = mount(LibraryView, {});
  await settle(view);
  assert.equal(reading(view), true);
  assert.equal(window.location.pathname, '/app/library');
  assert.equal(window.history.state.vmxView, 'library', 'the history entry keeps its view');
  view.unmount();
});

test('?tab=external opens the external tab once and leaves the address clean', async t => {
  browser(t, 'https://vetmock.com/app/library?tab=external');
  const view = mount(LibraryView, {});
  await settle(view);
  assert.equal(reading(view), true);
  assert.equal(window.location.search, '');
  // A screen reader hears which of the two tabs is showing, as the filter
  // chips on the same screen already say.
  const chip = label => findAll(view.tree, n => n.type === 'button' && textOf(n) === label)[0];
  assert.equal(chip('เอกสารภายนอก').props['aria-pressed'], true);
  assert.equal(chip('เอกสารในระบบ').props['aria-pressed'], false);
  chip('เอกสารในระบบ').props.onClick(); view.flush();
  assert.equal(chip('เอกสารในระบบ').props['aria-pressed'], true);
  assert.equal(chip('เอกสารภายนอก').props['aria-pressed'], false);
  assert.equal(findAll(view.tree, n => n.props?.role === 'group' && textOf(n).includes('เอกสารภายนอก')).length, 1);
  view.unmount();
  const plain = mount(LibraryView, {});
  await settle(plain);
  assert.equal(reading(plain), false, 'a plain library visit stays on the library documents');
  plain.unmount();
});

test('the palette entry finds the reader by its words and opens it, also when the library is already open', async t => {
  const entry = FEATURES.find(f => f.id === 'external-docs');
  assert.ok(entry, 'the reader is in the registry again');
  assert.deepEqual(entry.invoke, { kind: 'view', view: 'library', intent: 'external' });
  for (const word of ['notion', 'google', 'เอกสารภายนอก']) assert.ok(entry.kw.includes(word), word);
  assert.equal(entry.rail, false, 'the rail already has the library itself');
  assert.equal(viewForAppPath(ogCoverForRoute('/app/external-docs').route), 'library', 'the share card route still opens the reader');

  const { session, listeners } = browser(t, 'https://vetmock.com/app/library');
  rememberViewIntent('external');
  let view = mount(LibraryView, {});
  await settle(view);
  assert.equal(reading(view), true);
  assert.equal(session.has('vmx-view-intent'), false, 'the intent is read once');
  view.unmount();

  view = mount(LibraryView, {});
  await settle(view);
  assert.equal(reading(view), false);
  rememberViewIntent('external');
  listeners.get('vmx-view-intent')({ detail: { view: 'library' } });
  view.flush();
  assert.equal(reading(view), true);
  assert.equal(session.has('vmx-view-intent'), false);
  view.unmount();
});
