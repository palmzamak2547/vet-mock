// storage.get (src/hooks/useStorage.js) returned a stored JSON null as null,
// not the caller's default: with vmx-consent-prefs = "null" the app read
// consentPrefs.analytics at boot and drew a blank page (screen leftovers,
// 11 Nov 2026). The hook now answers the default for a missing key, a corrupt
// value and a stored null, and keeps every real value (0, false, '').
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { storage } from '../../src/hooks/useStorage.js';

function withStore(entries, fn) {
  const map = new Map(Object.entries(entries));
  globalThis.window = { localStorage: { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k) } };
  try { return fn(map); } finally { delete globalThis.window; }
}

test('a missing key, a corrupt value and a stored null read as the default', () => {
  withStore({ corrupt: '{not json', stored: 'null', empty: '' }, () => {
    const def = { analytics: true, personal: true };
    assert.equal(storage.get('missing', def), def);
    assert.equal(storage.get('corrupt', def), def);
    assert.equal(storage.get('stored', def), def);
    assert.equal(storage.get('empty', def), def);
    assert.equal(storage.get('stored', null), null);
  });
});

test('real values come back as stored, falsy ones included', () => {
  withStore({ zero: '0', no: 'false', blank: '""', obj: '{"a":1}', list: '[]' }, () => {
    assert.equal(storage.get('zero', 25), 0);
    assert.equal(storage.get('no', true), false);
    assert.equal(storage.get('blank', 'th'), '');
    assert.deepEqual(storage.get('obj', {}), { a: 1 });
    assert.deepEqual(storage.get('list', null), []);
  });
});

test('no storage at all reads as the default', () => {
  assert.equal(storage.get('anything', 'default'), 'default');
});

// The fix reads a stored null as the default, which is wrong only for a
// caller whose default is not null and that stores null on purpose. None does:
// every useLocalStorage with a non-null default, and its setter never given null.
function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : /\.(jsx?|mjs)$/.test(name) ? [p] : [];
  });
}

test('no useLocalStorage caller with a non-null default stores null', () => {
  const root = new URL('../../src/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
  let callers = 0;
  for (const file of files(root)) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/const \[\w+, (set\w+)\] = useLocalStorage\('[^']+', ([^)]+)\)/g)) {
      const [, setter, def] = m;
      if (def.trim() === 'null') continue;
      callers += 1;
      assert.doesNotMatch(src, new RegExp(`${setter}\\(\\s*(?:null|undefined)\\s*\\)`), `${file}: ${setter} stores null over a default of ${def}`);
    }
  }
  assert.ok(callers >= 10, `found only ${callers} callers`);
});
