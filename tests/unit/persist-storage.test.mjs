// Work that lives only on the device asks, once, to be kept (src/lib/persist-storage.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { keepDeviceWork, resetKeepDeviceWork } from '../../src/lib/persist-storage.js';

const memory = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), m };
};
const browser = (answer, already = false) => {
  const calls = { persist: 0, persisted: 0 };
  return {
    calls,
    nav: { storage: {
      persisted: async () => { calls.persisted++; return already; },
      persist: async () => { calls.persist++; return answer; },
    } },
  };
};

test('asks once; a refusal is remembered and never repeated', async () => {
  resetKeepDeviceWork();
  const storage = memory();
  const b = browser(false);
  assert.equal(await keepDeviceWork({ nav: b.nav, storage }), false);
  resetKeepDeviceWork();
  for (let i = 0; i < 5; i++) await keepDeviceWork({ nav: b.nav, storage });
  assert.equal(b.calls.persist, 1, 'no prompt loop');
});

test('a grant is reported; storage already kept is not asked again', async () => {
  resetKeepDeviceWork();
  const b = browser(true);
  assert.equal(await keepDeviceWork({ nav: b.nav, storage: memory() }), true);
  resetKeepDeviceWork();
  const kept = browser(true, true);
  assert.equal(await keepDeviceWork({ nav: kept.nav, storage: memory() }), true);
  assert.equal(kept.calls.persist, 0);
});

test('without the API, or with storage blocked, nothing happens and nothing throws', async () => {
  resetKeepDeviceWork();
  assert.equal(await keepDeviceWork({ nav: {}, storage: memory() }), false);
  const blocked = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('SecurityError'); } };
  const b = browser(true);
  assert.equal(await keepDeviceWork({ nav: b.nav, storage: blocked }), false);
  assert.equal(b.calls.persist, 0, 'unreadable storage is read as asked: never a loop');
  const failing = { storage: { persisted: async () => false, persist: async () => { throw new Error('denied'); } } };
  assert.equal(await keepDeviceWork({ nav: failing, storage: memory() }), false);
});

test('never while a question set or an exam is on screen; a later save asks', async () => {
  resetKeepDeviceWork();
  const storage = memory();
  const b = browser(true);
  const onScreen = { querySelector: (sel) => (/vmx-question-card/.test(sel) ? {} : null) };
  assert.equal(await keepDeviceWork({ nav: b.nav, storage, session: memory(), doc: onScreen }), false);
  assert.equal(b.calls.persist, 0, 'the pin button mid-exam does not raise a prompt');
  assert.equal(storage.getItem('vmx-persist-asked'), null, 'not asked yet, so not marked');
  assert.equal(await keepDeviceWork({ nav: b.nav, storage, session: memory(), doc: { querySelector: () => null } }), true);
  assert.equal(b.calls.persist, 1);
});

test('a prompt that never settles is asked at most once per session', async () => {
  resetKeepDeviceWork();
  const session = memory();
  let calls = 0;
  const hanging = { storage: { persisted: async () => false, persist: () => { calls++; return new Promise(() => {}); } } };
  const idle = { querySelector: () => null };
  keepDeviceWork({ nav: hanging, storage: memory(), session, doc: idle });
  await new Promise((r) => setTimeout(r, 5));
  resetKeepDeviceWork(); // a reload in the same tab: the module forgets, the session does not
  keepDeviceWork({ nav: hanging, storage: memory(), session, doc: idle });
  await new Promise((r) => setTimeout(r, 5));
  assert.equal(calls, 1);
});

test('the flashcards\' id migration, a write made during a read, never asks', () => {
  const cards = readFileSync(new URL('../../src/lib/user-flashcards.js', import.meta.url), 'utf8');
  assert.match(cards, /if \(moved\) writeLocalExtra\(STORAGE_KEY, list, \{ ask: false \}\)/);
  const extras = readFileSync(new URL('../../src/lib/local-extras.js', import.meta.url), 'utf8');
  assert.match(extras, /if \(ask && key !== 'vmx-watched-videos'\) keepDeviceWork/);
});

test('the ask is wired where a student first saves their own work', () => {
  const extras = readFileSync(new URL('../../src/lib/local-extras.js', import.meta.url), 'utf8');
  assert.match(extras, /keepDeviceWork\(/);
  const notebook = readFileSync(new URL('../../src/lib/notebook.js', import.meta.url), 'utf8');
  assert.match(notebook, /keepDeviceWork\(/);
  // Nothing a student sees: no prompt text, no dialog.
  const lib = readFileSync(new URL('../../src/lib/persist-storage.js', import.meta.url), 'utf8');
  assert.doesNotMatch(lib, /alert\(|confirm\(|[฀-๿]/);
});
