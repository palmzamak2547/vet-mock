// ============================================================
// guide-progress.test.mjs — what the วิธีใช้ guide remembers
// ============================================================
// The guide is a list of goals a student actually has (ฝึกทุกวัน, เตรียม
// สอบ, ทบทวนข้อที่ผิด...). It remembers which goals were opened, so it can
// say "ดูแล้ว 2 จาก 6" when it is opened again, and it can be asked to open
// straight at one goal: a usage hint on the notes page offers "ดูวิธีใช้
// ทั้งหมด" and lands on the reading goal, not on the list.
//
// Rules under test:
//   - progress is a set of known goal ids plus the last one opened; a goal
//     that no longer exists stops counting instead of inflating "ดูแล้ว";
//   - a broken, foreign or disabled store reads as "nothing seen" and never
//     throws, and the next write replaces the bad blob;
//   - the open-at request survives a render that is thrown away (React's
//     StrictMode renders twice) and is used once, like the feature intent
//     hand-off in lib/feature-registry.js;
//   - a hint can open the guide only when the app has said it listens, so
//     a link never appears that does nothing.
// ============================================================

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const local = new Map();
const session = new Map();
const stubStore = (map) => ({
  getItem: (key) => (map.has(key) ? map.get(key) : null),
  setItem: (key, value) => { map.set(key, String(value)); },
  removeItem: (key) => { map.delete(key); },
  clear: () => { map.clear(); },
});
const saved = { localStorage: globalThis.localStorage, sessionStorage: globalThis.sessionStorage, window: globalThis.window, document: globalThis.document };

beforeEach(() => {
  local.clear();
  session.clear();
  globalThis.localStorage = stubStore(local);
  globalThis.sessionStorage = stubStore(session);
  delete globalThis.window;
  delete globalThis.document;
});

const {
  GUIDE_STORAGE_KEY, GUIDE_OPEN_EVENT, GUIDE_READY_ATTR,
  readGuideProgress, markGuideSeen,
  requestGuidePath, peekGuidePath, consumeGuidePath,
  canOpenGuide, openGuide,
} = await import('../../src/lib/guide-progress.js');

const IDS = ['daily', 'exam', 'mistakes', 'read', 'search', 'phone'];

test('a student who never opened the guide has seen nothing', () => {
  assert.deepEqual(readGuideProgress(IDS), { seen: [], last: null });
});

test('opening a goal records it once and remembers it as the last one', () => {
  markGuideSeen('read', IDS);
  markGuideSeen('daily', IDS);
  markGuideSeen('read', IDS);
  assert.deepEqual(readGuideProgress(IDS), { seen: ['read', 'daily'], last: 'read' });
});

test('a goal that no longer exists stops counting', () => {
  markGuideSeen('read', IDS);
  markGuideSeen('retired-goal');
  const progress = readGuideProgress(IDS);
  assert.deepEqual(progress.seen, ['read'], 'a retired goal inflated the seen count');
  assert.equal(progress.last, null, 'the last goal points at one the guide no longer has');
  // Unfiltered, the record is still there: filtering is a read concern.
  assert.deepEqual(readGuideProgress().seen, ['read', 'retired-goal']);
});

test('an unknown id is not written when the caller knows the goal list', () => {
  markGuideSeen('nope', IDS);
  assert.equal(local.has(GUIDE_STORAGE_KEY), false, 'an id outside the goal list was stored');
  markGuideSeen('', IDS);
  markGuideSeen(null, IDS);
  assert.equal(local.has(GUIDE_STORAGE_KEY), false);
});

test('a corrupted or foreign blob reads as nothing seen and is replaced on the next write', () => {
  local.set(GUIDE_STORAGE_KEY, '{not json');
  assert.deepEqual(readGuideProgress(IDS), { seen: [], last: null });
  local.set(GUIDE_STORAGE_KEY, JSON.stringify(['daily']));
  assert.deepEqual(readGuideProgress(IDS), { seen: [], last: null }, 'an array blob was read as progress');
  local.set(GUIDE_STORAGE_KEY, JSON.stringify({ seen: 'daily', last: 7 }));
  assert.deepEqual(readGuideProgress(IDS), { seen: [], last: null }, 'wrongly typed fields were trusted');
  local.set(GUIDE_STORAGE_KEY, JSON.stringify({ seen: ['daily', 3, null, 'daily'], last: 'daily' }));
  assert.deepEqual(readGuideProgress(IDS), { seen: ['daily'], last: 'daily' }, 'non-string or duplicate ids survived');
  markGuideSeen('phone', IDS);
  assert.deepEqual(JSON.parse(local.get(GUIDE_STORAGE_KEY)), { v: 1, seen: ['daily', 'phone'], last: 'phone' });
});

test('a disabled store degrades to nothing seen and never throws', () => {
  globalThis.localStorage = {
    getItem() { throw new Error('SecurityError'); },
    setItem() { throw new Error('QuotaExceededError'); },
    removeItem() {},
  };
  assert.deepEqual(readGuideProgress(IDS), { seen: [], last: null });
  assert.doesNotThrow(() => markGuideSeen('daily', IDS));
  delete globalThis.localStorage;
  assert.deepEqual(readGuideProgress(IDS), { seen: [], last: null }, 'a missing store threw');
  assert.doesNotThrow(() => markGuideSeen('daily', IDS));
});

test('an open-at request survives a discarded render and is used once', () => {
  requestGuidePath('read');
  // Render 1 (thrown away by StrictMode) and render 2 both see the request.
  assert.equal(peekGuidePath(), 'read');
  assert.equal(peekGuidePath(), 'read', 'peeking consumed the request');
  // The effect that commits consumes it; the next open starts at the list.
  consumeGuidePath('read');
  assert.equal(peekGuidePath(), null, 'the request outlived its open');
});

test('consuming a request that was replaced in the meantime keeps the newer one', () => {
  requestGuidePath('read');
  const captured = peekGuidePath();
  requestGuidePath('search');
  consumeGuidePath(captured);
  assert.equal(peekGuidePath(), 'search', 'an older open removed a newer request');
  requestGuidePath(null);
  assert.equal(peekGuidePath(), null, 'a null request did not clear');
});

test('a hint can open the guide only after the app says it listens', () => {
  assert.equal(canOpenGuide(), false, 'no document: no link');
  const attrs = {};
  globalThis.document = { documentElement: { getAttribute: (name) => (name in attrs ? attrs[name] : null) } };
  assert.equal(canOpenGuide(), false, 'the app has not registered yet');
  attrs[GUIDE_READY_ATTR] = 'ready';
  assert.equal(canOpenGuide(), true);
});

test('opening from a hint asks for that goal and tells the app which control opened it', () => {
  const events = [];
  globalThis.window = { dispatchEvent: (event) => { events.push(event); return true; } };
  globalThis.CustomEvent ??= class CustomEvent { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } };
  const attrs = { [GUIDE_READY_ATTR]: 'ready' };
  globalThis.document = { documentElement: { getAttribute: (name) => (name in attrs ? attrs[name] : null) } };
  const launcher = { tagName: 'BUTTON' };
  assert.equal(openGuide('read', launcher), true);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, GUIDE_OPEN_EVENT);
  assert.equal(events[0].detail.launcher, launcher);
  assert.equal(peekGuidePath(), 'read', 'the guide would open at the list, not the goal');
});

test('opening without a listening app does nothing and leaves no stale request', () => {
  const events = [];
  globalThis.window = { dispatchEvent: (event) => { events.push(event); return true; } };
  globalThis.document = { documentElement: { getAttribute: () => null } };
  assert.equal(openGuide('read', null), false);
  assert.equal(events.length, 0);
  assert.equal(peekGuidePath(), null, 'a request was left for a guide that never opened');
});

process.on('exit', () => {
  for (const [key, value] of Object.entries(saved)) {
    if (value === undefined) delete globalThis[key];
    else globalThis[key] = value;
  }
});
