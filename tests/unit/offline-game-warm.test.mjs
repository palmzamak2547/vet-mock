// ============================================================
// offline-game-warm.test.mjs — the offline banner's game opens offline (B77)
// ============================================================
// The "🎮 เล่นเกม" button renders only while the device is offline
// (SyncStatusNotice), and it opens the lazy OfflineGameView. That chunk was not
// in index.html, not in the worker's install precache and not in the idle
// prefetch, so the first tap on a device that had never opened the game asked
// the network for it, offline, and the view's boundary showed
// "หน้านี้ขัดข้อง". The idle prefetch now warms it while the device is online;
// the worker's cache-first /assets/ route keeps it for the offline tap.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, posix } from 'node:path';
import vm from 'node:vm';

const read = (f) => readFileSync(resolve(process.cwd(), f), 'utf8');
const FILE = 'src/app/lazy-views.js';

function idlePrefetch({ saveData = false } = {}) {
  const source = read(FILE);
  const start = source.indexOf('useEffect(', source.indexOf('// Idle-time prefetch'));
  const end = source.indexOf('}, []);', start);
  assert.ok(start > 0 && end > start, 'the idle prefetch effect moved');
  const effect = source.slice(start + 'useEffect('.length, end + 1).replace(/\bimport\(/g, '__import(');
  const requested = [];
  const ctx = vm.createContext({
    window: { requestIdleCallback: (cb) => { cb(); return 1; }, cancelIdleCallback() {} },
    navigator: { connection: { saveData } },
    hasSavedSession: () => true,
    __import: (spec) => { requested.push(posix.join('app', spec)); return Promise.resolve({}); },
  });
  vm.runInContext(`(${effect})()`, ctx);
  return requested.map((p) => posix.normalize(p));
}

test('the offline game chunk is warmed while the device is online', () => {
  assert.ok(idlePrefetch().includes('views/OfflineGameView.jsx'), 'the game the offline banner offers is not warmed');
});

test('it is the same module the offline banner opens', () => {
  assert.match(read(FILE), /OfflineGameView = lazy\(\(\) => import\('\.\.\/views\/OfflineGameView\.jsx'\)\)/);
  assert.match(read('src/App.jsx'), /onOfflineGame=\{\(\) => setView\('offline-game'\)\}/);
  assert.match(read('src/App.jsx'), /view === 'offline-game' && <OfflineGameView/);
});
