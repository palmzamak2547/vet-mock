// ============================================================
// tts-cache.test.mjs — both voices keep their cached audio
// ============================================================
// The Edge voice and the iApp voice each keep synthesized audio in
// IndexedDB so a question read aloud once replays instantly, offline too.
// The two caches were copy-pasted from one another; they now share one
// implementation in tts-cache.js. What a student must not notice:
//   • a phrase played before is still served from the device, not
//     downloaded again — which needs the same database names and the same
//     cache keys as before the change, byte for byte;
//   • each cache stays bounded (30-day expiry, 30 MB cap, trimmed to 80%).
// legacyHashKey below is the key function both engines shipped before the
// extraction, copied verbatim. A key that drifts from it turns every
// student's cached audio into a miss.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// ── The key both engines used before the extraction (verbatim) ──────────
async function legacyHashKey({ text, lang, rate }) {
  const data = new TextEncoder().encode(`${lang}|${Number(rate).toFixed(2)}|${text}`);
  if (typeof crypto?.subtle?.digest !== 'function') {
    // Fallback: simple FNV-1a 32-bit hash
    let h = 2166136261;
    for (let i = 0; i < data.length; i++) {
      h ^= data[i];
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16);
  }
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── A small IndexedDB: named databases, one object store, out-of-line keys ─
function fakeIndexedDb() {
  const dbs = new Map();
  const opened = [];
  const later = (fn) => queueMicrotask(fn);
  const request = (result) => {
    const req = { result, onsuccess: null, onerror: null };
    later(() => req.onsuccess?.({ target: req }));
    return req;
  };
  return {
    opened,
    dbs,
    open(name) {
      opened.push(name);
      if (!dbs.has(name)) dbs.set(name, new Map());
      const data = dbs.get(name);
      const db = {
        objectStoreNames: { contains: () => true },
        createObjectStore: () => {},
        transaction() {
          return {
            objectStore() {
              return {
                get: (k) => request(data.has(k) ? structuredClone(data.get(k)) : undefined),
                put: (v, k) => { data.set(k, structuredClone(v)); return request(undefined); },
                delete: (k) => { data.delete(k); return request(undefined); },
                clear: () => { data.clear(); return request(undefined); },
                openCursor() {
                  const entries = [...data.entries()];
                  let i = 0;
                  const req = { onsuccess: null, onerror: null };
                  const step = () => later(() => {
                    const cursor = i < entries.length
                      ? { primaryKey: entries[i][0], value: entries[i][1], continue() { i += 1; step(); } }
                      : null;
                    req.onsuccess?.({ target: { result: cursor } });
                  });
                  step();
                  return req;
                },
              };
            },
          };
        },
      };
      const req = { result: db, onsuccess: null, onerror: null, onupgradeneeded: null };
      later(() => req.onsuccess?.());
      return req;
    },
  };
}

const settle = async () => { for (let i = 0; i < 20; i++) await new Promise((r) => setTimeout(r, 0)); };

let seq = 0;
const ENGINES = [
  {
    name: 'Edge',
    db: 'vmx-tts',
    endpoint: '/api/tts',
    load: async () => (await import(`../../src/lib/tts-edge.js?t=${++seq}`)).getEdgeAudio,
    // The Edge engine keys on the rate it is given.
    legacyKey: ({ text, lang, rate = 1.0 }) => legacyHashKey({ text, lang, rate }),
  },
  {
    name: 'iApp',
    db: 'vmx-tts-iapp',
    endpoint: '/api/tts-iapp',
    load: async () => (await import(`../../src/lib/tts-iapp.js?t=${++seq}`)).getIAppAudio,
    // The iApp engine defaults lang to 'th' and keys on speed = Number(rate).
    legacyKey: ({ text, lang = 'th', rate = 1.0 }) => legacyHashKey({ text, lang, rate: Number(rate) }),
  },
];

function install() {
  const idb = fakeIndexedDb();
  const calls = [];
  const savedFetch = globalThis.fetch;
  globalThis.indexedDB = idb;
  globalThis.fetch = async (url) => {
    calls.push(url);
    return { ok: true, status: 200, text: async () => '', arrayBuffer: async () => new Uint8Array([7, 7, 7, calls.length]).buffer };
  };
  return {
    idb,
    calls,
    restore() { delete globalThis.indexedDB; globalThis.fetch = savedFetch; },
  };
}

const PHRASES = [
  { text: 'ไข้หวัดนกชนิดรุนแรง H5N1 ติดต่อสู่คนได้หรือไม่', lang: 'th', rate: 1.0 },
  { text: 'Newcastle disease', lang: 'en', rate: 0.9 },
  { text: 'โรคพิษสุนัขบ้า', lang: 'th', rate: '1.10' },
];

for (const engine of ENGINES) {
  test(`${engine.name}: a phrase played once is served from the device the second time`, async () => {
    const env = install();
    try {
      const get = await engine.load();
      const first = await get({ text: 'ท้องเสียในลูกสุกร', lang: 'th', rate: 1.0 });
      await settle();
      const second = await get({ text: 'ท้องเสียในลูกสุกร', lang: 'th', rate: 1.0 });
      assert.equal(env.calls.length, 1, 'the repeat must not fetch again');
      assert.equal(env.calls[0], engine.endpoint);
      assert.deepEqual(new Uint8Array(second), new Uint8Array(first));
      assert.deepEqual([...new Set(env.idb.opened)], [engine.db], 'the database name must not change');
    } finally { env.restore(); }
  });

  test(`${engine.name}: audio cached before this release is still found under its old key`, async () => {
    const env = install();
    try {
      const get = await engine.load();
      const data = env.idb.dbs.get(engine.db) || new Map();
      env.idb.dbs.set(engine.db, data);
      for (const [i, p] of PHRASES.entries()) {
        const audio = new Uint8Array([42, i]).buffer;
        data.set(await engine.legacyKey(p), { audio, ts: Date.now(), bytes: 2 });
        const got = await get(p);
        assert.deepEqual([...new Uint8Array(got)], [42, i], `"${p.text}" missed the cache`);
      }
      assert.equal(env.calls.length, 0, 'every phrase cached under the old key must play without a download');
    } finally { env.restore(); }
  });

  test(`${engine.name}: new audio is stored under the same key the old code wrote`, async () => {
    const env = install();
    try {
      const get = await engine.load();
      for (const p of PHRASES) await get(p);
      await settle();
      const keys = [...env.idb.dbs.get(engine.db).keys()].sort();
      const legacy = (await Promise.all(PHRASES.map((p) => engine.legacyKey(p)))).sort();
      assert.deepEqual(keys, legacy);
    } finally { env.restore(); }
  });

  test(`${engine.name}: without WebCrypto the fallback key is unchanged too`, async () => {
    const env = install();
    const desc = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
    try {
      const get = await engine.load();
      Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true, writable: true });
      const p = PHRASES[0];
      const key = await engine.legacyKey(p);
      assert.match(key, /^[0-9a-f]{1,8}$/, 'the reference itself took the fallback path');
      await get(p);
      await settle();
      assert.deepEqual([...env.idb.dbs.get(engine.db).keys()], [key]);
    } finally {
      Object.defineProperty(globalThis, 'crypto', desc);
      env.restore();
    }
  });

  test(`${engine.name}: a phrase cached over 30 days ago is fetched fresh`, async () => {
    const env = install();
    try {
      const get = await engine.load();
      const p = PHRASES[1];
      const data = new Map();
      env.idb.dbs.set(engine.db, data);
      data.set(await engine.legacyKey(p), { audio: new Uint8Array([1]).buffer, ts: Date.now() - 31 * 24 * 3600 * 1000, bytes: 1 });
      const got = await get(p);
      assert.equal(env.calls.length, 1, 'expired audio must not be played');
      assert.notDeepEqual([...new Uint8Array(got)], [1]);
    } finally { env.restore(); }
  });

  test(`${engine.name}: replaying a cached phrase marks it recently played`, async () => {
    const env = install();
    try {
      const get = await engine.load();
      const p = PHRASES[0];
      const key = await engine.legacyKey(p);
      const tenDaysAgo = Date.now() - 10 * 24 * 3600 * 1000;
      const data = new Map([[key, { audio: new Uint8Array([5]).buffer, ts: tenDaysAgo, bytes: 1 }]]);
      env.idb.dbs.set(engine.db, data);
      await get(p);
      await settle();
      assert.equal(env.calls.length, 0);
      assert.ok(data.get(key).ts > tenDaysAgo, 'a replay must refresh the entry, or the size sweep drops audio in use');
    } finally { env.restore(); }
  });

  test(`${engine.name}: the cache drops month-old audio and trims to 80% of 30 MB`, async () => {
    const env = install();
    try {
      const get = await engine.load();
      const MB = 1024 * 1024;
      const now = Date.now();
      const data = new Map();
      env.idb.dbs.set(engine.db, data);
      data.set('stale', { audio: new ArrayBuffer(1), ts: now - 31 * 24 * 3600 * 1000, bytes: 1 * MB });
      // 32 one-MB entries, oldest first: 32 MB is over the 30 MB cap.
      for (let i = 0; i < 32; i++) data.set(`k${String(i).padStart(2, '0')}`, { audio: new ArrayBuffer(1), ts: now - (40 - i) * 60_000, bytes: MB });
      await get({ text: 'แท้งติดต่อ', lang: 'th', rate: 1.0 });
      await settle();
      assert.equal(data.has('stale'), false, 'audio older than 30 days is removed');
      const total = [...data.values()].reduce((s, v) => s + (v.bytes || 0), 0);
      assert.ok(total <= Math.floor(30 * MB * 0.8) + MB, `trimmed to about 24 MB, holds ${(total / MB).toFixed(1)} MB`);
      assert.equal(data.has('k00'), false, 'the least recently used entry goes first');
      assert.equal(data.has('k31'), true, 'the most recently used entry stays');
    } finally { env.restore(); }
  });
}

test('one IndexedDB implementation serves both voices', () => {
  const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
  const count = (s) => (s.match(/indexedDB\.open\(/g) || []).length;
  assert.equal(count(read('../../src/lib/tts-cache.js')), 1);
  assert.equal(count(read('../../src/lib/tts-edge.js')), 0);
  assert.equal(count(read('../../src/lib/tts-iapp.js')), 0);
});
