// The chat list used to drop half its chats, or all of them, without a word when the
// browser's storage was full or blocked. A write now answers what it did, and the page
// says 'trimmed' and 'failed' under the composer.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const chat = (id) => ({ id, messages: [{ role: 'user', text: 'q' }] });

test('a full or blocked store is reported, never forgotten quietly', async () => {
  const map = new Map();
  let room = Infinity;
  globalThis.localStorage = {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => { if (v.length > room) throw new Error('QuotaExceededError'); map.set(k, v); },
    removeItem: (k) => map.delete(k),
  };
  const store = await import('../../src/lib/store.js');
  for (let i = 0; i < 30; i++) assert.equal(store.saveChat(chat(`c${i}`)), 'ok');
  room = JSON.stringify(store.listChats().slice(0, 20)).length + 400;
  assert.equal(store.saveChat(chat('big')), 'trimmed');
  room = 0;
  assert.equal(store.saveChat(chat('lost')), 'failed');
  delete globalThis.localStorage;
});

test('the page shows what the save did', () => {
  const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
  assert.match(app, /setKept\(saveChat\(chat\)\)/);
  assert.match(app, /kept === 'failed' &&/);
  assert.match(app, /kept === 'trimmed' &&/);
});
