// ============================================================
// Imaging Practical: the recent-files list lives for the tab only (OV-critic-8)
// ============================================================
// DICOM file names are often a patient's or an owner's name. The "recent
// files" list kept them in localStorage with no expiry: nothing swept it on
// sign-out, and only the student's own clear buttons removed it. The list is
// display-only (a File cannot be reopened from a name), so it now lives in
// sessionStorage, which the browser drops with the tab, and the copy an older
// version left in localStorage is removed once when the page opens.
//
// recent-files.js is the whole storage contract. LabView's wiring is pinned by
// reading its source, because mounting it needs Cornerstone.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const KEY = 'vmx-lab-recent-files';
const labSource = readFileSync(new URL('../../src/views/LabView.jsx', import.meta.url), 'utf8');
// Comments may mention the old key; only code counts.
const labCode = labSource.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

class FakeStorage {
  constructor(initial = {}) { this.map = new Map(Object.entries(initial)); this.calls = []; }
  getItem(key) { this.calls.push(['get', key]); return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.calls.push(['set', key]); this.map.set(key, String(value)); }
  removeItem(key) { this.calls.push(['remove', key]); this.map.delete(key); }
}
const throwing = () => ({
  getItem() { throw new Error('denied'); },
  setItem() { throw new Error('denied'); },
  removeItem() { throw new Error('denied'); },
});
const load = () => import('../../src/lib/dicom/recent-files.js');
const file = (name, extra = {}) => ({ name, size: 1000, lastModified: 1_700_000_000_000, ...extra });

test('the list is read from and written to the tab storage, never the device storage', async () => {
  const { readRecentFiles, writeRecentFiles, RECENT_KEY } = await load();
  assert.equal(RECENT_KEY, KEY);
  const session = new FakeStorage();
  writeRecentFiles([file('rex.dcm'), file('bella.dcm')], session);
  assert.deepEqual(readRecentFiles(session).map((f) => f.name), ['rex.dcm', 'bella.dcm']);
  assert.deepEqual(JSON.parse(session.map.get(KEY)).map((f) => f.name), ['rex.dcm', 'bella.dcm']);
});

test('an empty list removes the key instead of storing []', async () => {
  const { writeRecentFiles } = await load();
  const session = new FakeStorage({ [KEY]: '[{"name":"a.dcm","size":1}]' });
  writeRecentFiles([], session);
  assert.equal(session.map.has(KEY), false);
});

test('a list left by an older version in the device storage is removed, and only that key', async () => {
  const { dropSavedRecentFiles } = await load();
  const local = new FakeStorage({ [KEY]: '[{"name":"owner-smith.dcm","size":1}]', 'vmx-lab-onboarded': '1', theme: 'dark' });
  dropSavedRecentFiles(local);
  assert.equal(local.map.has(KEY), false);
  assert.equal(local.map.get('vmx-lab-onboarded'), '1');
  assert.equal(local.map.get('theme'), 'dark');
  assert.deepEqual(local.calls, [['remove', KEY]], 'nothing else is read or written');
});

test('with the browser defaults, the list uses the tab storage and ignores a stale device copy', async () => {
  const { readRecentFiles, writeRecentFiles, dropSavedRecentFiles } = await load();
  const had = { local: Object.getOwnPropertyDescriptor(globalThis, 'localStorage'), session: Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage') };
  const local = new FakeStorage({ [KEY]: '[{"name":"owner-smith.dcm","size":1}]' });
  const session = new FakeStorage();
  Object.defineProperty(globalThis, 'localStorage', { value: local, configurable: true });
  Object.defineProperty(globalThis, 'sessionStorage', { value: session, configurable: true });
  try {
    assert.deepEqual(readRecentFiles(), [], 'the stale device copy leaked into the tab list');
    writeRecentFiles([file('rex.dcm')]);
    assert.deepEqual(readRecentFiles().map((f) => f.name), ['rex.dcm']);
    assert.ok(session.map.has(KEY), 'written to the tab storage');
    assert.deepEqual(local.calls, [], 'the device storage was not touched by read or write');
    dropSavedRecentFiles();
    assert.equal(local.map.has(KEY), false, 'the default drop clears the device copy');
    assert.ok(session.map.has(KEY), 'and leaves the tab list alone');
  } finally {
    for (const [name, d] of [['localStorage', had.local], ['sessionStorage', had.session]]) {
      if (d) Object.defineProperty(globalThis, name, d); else delete globalThis[name];
    }
  }
});

test('a corrupt or foreign value reads as an empty list', async () => {
  const { readRecentFiles } = await load();
  for (const raw of ['{not json', 'null', '42', '"text"', '{"name":"a.dcm"}', '']) {
    assert.deepEqual(readRecentFiles(new FakeStorage({ [KEY]: raw })), [], `raw ${JSON.stringify(raw)}`);
  }
});

test('entries without a file name are dropped and the list is capped', async () => {
  const { readRecentFiles, RECENT_MAX } = await load();
  const many = Array.from({ length: RECENT_MAX + 4 }, (_, i) => file(`f${i}.dcm`));
  const mixed = [null, 7, 'x', {}, { name: 5 }, file('ok.dcm'), ...many];
  const list = readRecentFiles(new FakeStorage({ [KEY]: JSON.stringify(mixed) }));
  assert.equal(list.length, RECENT_MAX);
  assert.equal(list[0].name, 'ok.dcm');
  assert.ok(list.every((f) => typeof f.name === 'string'));
});

test('a browser that refuses storage never breaks the page', async () => {
  const { readRecentFiles, writeRecentFiles, dropSavedRecentFiles } = await load();
  assert.deepEqual(readRecentFiles(throwing()), []);
  assert.doesNotThrow(() => writeRecentFiles([file('a.dcm')], throwing()));
  assert.doesNotThrow(() => writeRecentFiles([], throwing()));
  assert.doesNotThrow(() => dropSavedRecentFiles(throwing()));
  assert.deepEqual(readRecentFiles(null), []);
  assert.doesNotThrow(() => writeRecentFiles([file('a.dcm')], null));
  assert.doesNotThrow(() => dropSavedRecentFiles(null));
});

test('LabView no longer touches the device storage for the recent list', () => {
  const calls = [...labCode.matchAll(/localStorage\s*\.\s*(getItem|setItem|removeItem)\s*\(([^)]*)\)/g)];
  assert.ok(calls.length > 0, 'the onboarding flag still uses the device storage, so the scan is looking at real code');
  for (const [text, , args] of calls) {
    assert.ok(!/RECENT_KEY|vmx-lab-recent-files/.test(args), `LabView still stores the recent files in localStorage: ${text}`);
  }
  assert.ok(!/RECENT_KEY\s*=\s*['"]vmx-lab-recent-files['"]/.test(labCode), 'the key is defined in recent-files.js only');
});

test('LabView reads, writes and clears the list through recent-files.js, and drops the old copy on mount', () => {
  assert.match(labCode, /from\s+['"]\.\.\/lib\/dicom\/recent-files\.js['"]/);
  assert.match(labCode, /readRecentFiles\(/);
  assert.match(labCode, /dropSavedRecentFiles\(/);
  assert.equal((labCode.match(/writeRecentFiles\(/g) || []).length, 3, 'add, remove-one and clear-all each write the tab list');
  // The one-time removal runs in the mount effect, before the list is read.
  const effect = labCode.slice(labCode.indexOf('useEffect(() => {'));
  const drop = effect.indexOf('dropSavedRecentFiles(');
  const read = effect.indexOf('readRecentFiles(');
  assert.ok(drop > 0 && read > 0 && drop < read, 'the old device copy is removed on mount, before the tab list is read');
});

test('the note under the list tells the student it lasts until the tab is closed', () => {
  assert.match(labCode, /รายการนี้อยู่จนกว่าจะปิดแท็บ/);
  assert.ok(!/persist ข้าม session/.test(labCode), 'the English note about blobs is replaced by plain Thai');
});
