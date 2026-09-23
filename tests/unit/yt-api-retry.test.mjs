// ============================================================
// yt-api-retry.test.mjs — the in-app YouTube player
// ============================================================
// One failed load of YouTube's iframe API used to keep every clip black for
// the rest of the tab. The loader kept its rejected promise at module scope
// and left the failed <script> in the page, so the next clip opened got the
// same rejection back and no new request was made. The player only logged
// the failure, so the student saw a black box and no reason for it.
//
// The loader and the player effect are the view's real code, cut from the
// source and run under vm against a document the test controls, the way
// video-summary-open.test.mjs runs the summary loader.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const SRC = readFileSync(new URL('../../src/views/VideoView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

function cut(start, end) {
  const a = SRC.indexOf(start);
  assert.notEqual(a, -1, `VideoView must still contain ${JSON.stringify(start)}`);
  const b = SRC.indexOf(end, a);
  assert.notEqual(b, -1, `VideoView must still contain ${JSON.stringify(end)} after ${JSON.stringify(start)}`);
  return SRC.slice(a, b + end.length);
}

const LOADER = cut('let __ytApiPromise = null;', '\n  return __ytApiPromise;\n}\n');
const PLAYER_EFFECT = cut('// Mount one YT.Player per (currentVideoId, playlistId) tuple.', '}, [currentVideoId, playlistId]);');

// A page: the <script> tags the loader adds, and the window YouTube's script
// would install YT on.
function page() {
  const scripts = [];
  const window = {};
  const document = {
    querySelector: (sel) => {
      assert.equal(sel, 'script[data-vmx-yt-api]');
      return scripts.find((s) => s.inPage) || null;
    },
    createElement: (tag) => {
      assert.equal(tag, 'script');
      const s = { dataset: {}, inPage: false, remove() { s.inPage = false; } };
      return s;
    },
    head: { appendChild(s) { s.inPage = true; scripts.push(s); } },
  };
  const ctx = { window, document };
  vm.createContext(ctx);
  const loadYouTubeIframeAPI = vm.runInContext(`${LOADER}\nloadYouTubeIframeAPI`, ctx);
  return {
    scripts,
    window,
    loadYouTubeIframeAPI,
    // What YouTube's script does once it has loaded: install YT, then call
    // the page's ready hook.
    ready() {
      window.YT = { Player: function Player() {} };
      window.onYouTubeIframeAPIReady();
    },
  };
}

// ── the loader ───────────────────────────────────────────────────────

test('after a failed load the next clip asks again with a fresh script', async () => {
  const p = page();
  const first = p.loadYouTubeIframeAPI();
  p.scripts[0].onerror();
  await assert.rejects(first, /failed to load YT iframe API/);
  assert.equal(p.scripts[0].inPage, false, 'the failed tag must leave the page, or the next call waits on it forever');

  const second = p.loadYouTubeIframeAPI();
  assert.notEqual(second, first, 'the same rejected promise came back');
  assert.equal(p.scripts.length, 2, 'no new request was made');
  p.ready();
  assert.equal(await second, p.window.YT, 'the retry plays');
});

test('two clips opened during one load share one promise and one script', async () => {
  const p = page();
  const a = p.loadYouTubeIframeAPI();
  const b = p.loadYouTubeIframeAPI();
  assert.equal(a, b);
  assert.equal(p.scripts.length, 1);
  p.ready();
  assert.equal(await a, p.window.YT);
});

test('once the API is ready no further script is added', async () => {
  const p = page();
  const a = p.loadYouTubeIframeAPI();
  p.ready();
  await a;
  assert.equal(await p.loadYouTubeIframeAPI(), p.window.YT);
  assert.equal(p.scripts.length, 1);
});

// ── the player effect ────────────────────────────────────────────────

// The player column's effect with its refs and state under the test's
// control. `api` is what loadYouTubeIframeAPI returns.
function player(api, { currentVideoId = 'hPV3Rhh8r3Q', playlistId = null } = {}) {
  const seen = { players: [], failed: [], warned: 0, effect: null };
  const container = {};
  const YT = { Player: function Player(node, opts) { seen.players.push({ node, opts }); this.destroy = () => {}; } };
  const ctx = {
    currentVideoId,
    playlistId,
    startAt: 0,
    ytContainerRef: { current: container },
    playerRef: { current: null },
    loadYouTubeIframeAPI: () => api(YT),
    setPlayerFailed: (v) => seen.failed.push(v),
    useEffect: (fn) => { seen.effect = fn; },
    console: { warn() { seen.warned += 1; } },
  };
  vm.createContext(ctx);
  vm.runInContext(PLAYER_EFFECT, ctx);
  return { seen, ctx, mount: () => seen.effect() };
}

const settle = () => new Promise((r) => setTimeout(r, 0));

test('a player whose API failed to load says so inside the black box', async () => {
  const p = player(() => Promise.reject(new Error('failed to load YT iframe API')));
  p.mount();
  await settle();
  assert.equal(p.seen.players.length, 0);
  assert.equal(p.seen.failed.at(-1), true, 'the black box must not stay silent');
});

test('opening a clip clears the previous failure', async () => {
  const p = player((YT) => Promise.resolve(YT));
  p.mount();
  await settle();
  assert.equal(p.seen.failed[0], false);
  assert.equal(p.seen.failed.includes(true), false);
  assert.equal(p.seen.players.length, 1);
});

test('no player mounts after the modal closed', async () => {
  let resolve;
  const p = player((YT) => new Promise((r) => { resolve = () => r(YT); }));
  const cleanup = p.mount();
  cleanup();
  resolve();
  await settle();
  assert.equal(p.seen.players.length, 0);
});

test('a load that fails after the modal closed changes nothing', async () => {
  let reject;
  const p = player(() => new Promise((_, r) => { reject = () => r(new Error('failed to load YT iframe API')); }));
  const cleanup = p.mount();
  cleanup();
  reject();
  await settle();
  assert.equal(p.seen.failed.includes(true), false, 'a closed player has no box to write in');
});

test('the failure line points at the YouTube button and at reopening the clip', () => {
  const box = cut('{playerFailed && (', ')}');
  assert.match(box, /เปิดใน YouTube/);
  assert.match(box, /เปิดใหม่/);
  assert.doesNotMatch(box, /·/);
  // It sits in the black 16:9 box, after the node YT.Player replaces.
  const frame = cut('<div style={{ position: \'relative\', paddingBottom: \'56.25%\'', '{playerFailed && (');
  assert.match(frame, /ref=\{ytContainerRef\}/);
});

// ── the player clock ─────────────────────────────────────────────────
// The notes panel follows the clip through a 500 ms poll of the player's
// clock. The poll used to be PlayerModal's own state, so while a clip played
// every tick re-rendered the whole modal, and with it the playlist sidebar,
// whose rows each searched the playlist for their own number. The clock now
// belongs to the notes panel's wrapper, and a row's number is a lookup.

// Cut when a test runs, so a missing piece fails that test and not the file.
const playerModal = () => cut('function PlayerModal(', '\n}\n');
const clockHook = () => cut('function usePlayerClock(playerRef, videoId) {', '\n}\n');

// A tab: timers the test fires by hand, and a visibility the test flips.
function clock({ time = () => 12.5, hidden = false } = {}) {
  const timers = new Map();
  let nextId = 1;
  const listeners = new Set();
  const doc = { hidden, addEventListener: (t, fn) => { assert.equal(t, 'visibilitychange'); listeners.add(fn); }, removeEventListener: (t, fn) => listeners.delete(fn) };
  const win = {
    setInterval: (fn, ms) => { assert.equal(ms, 500); const id = nextId++; timers.set(id, fn); return id; },
  };
  const slots = [];
  let at = 0;
  let cleanup = null;
  const renders = { count: 0 };
  const ctx = {
    window: win,
    document: doc,
    clearInterval: (id) => timers.delete(id),
    useState: (init) => {
      const i = at++;
      if (!(i in slots)) slots[i] = { value: init };
      const slot = slots[i];
      return [slot.value, (v) => { if (v !== slot.value) { slot.value = v; renders.count += 1; } }];
    },
    useEffect: (fn) => { if (!cleanup) cleanup = fn() || (() => {}); },
  };
  vm.createContext(ctx);
  const usePlayerClock = vm.runInContext(`${clockHook()}\nusePlayerClock`, ctx);
  const playerRef = { current: { getCurrentTime: time } };
  const read = () => { at = 0; return usePlayerClock(playerRef, 'hPV3Rhh8r3Q'); };
  read();
  return {
    read,
    renders,
    tick: () => { for (const fn of [...timers.values()]) fn(); },
    timers,
    listeners,
    setHidden: (h) => { doc.hidden = h; for (const fn of [...listeners]) fn(); },
    unmount: () => cleanup(),
  };
}

test('the clock reads the player every 500 ms and hands back the time', () => {
  let t = 3;
  const c = clock({ time: () => t });
  assert.equal(c.read(), 0);
  c.tick();
  assert.equal(c.read(), 3);
  t = 3.5;
  c.tick();
  assert.equal(c.read(), 3.5);
});

test('the clock stops while the tab is hidden and starts again when it is back', () => {
  const c = clock();
  assert.equal(c.timers.size, 1);
  c.setHidden(true);
  assert.equal(c.timers.size, 0);
  c.setHidden(false);
  assert.equal(c.timers.size, 1);
  c.unmount();
  assert.equal(c.timers.size, 0);
  assert.equal(c.listeners.size, 0);
});

test('a paused clip costs no render', () => {
  const c = clock({ time: () => 42 });
  c.tick();
  const after = c.renders.count;
  c.tick();
  c.tick();
  assert.equal(c.renders.count, after);
});

test('the player modal no longer owns the clock, so a tick cannot re-render the sidebar', () => {
  const modal = playerModal();
  assert.doesNotMatch(modal, /setCurrentTime|setInterval|getCurrentTime/);
  assert.match(modal, /<ClockedVideoNotePanel\s+videoId=\{currentVideoId\}\s+playerRef=\{playerRef\}\s*\/>/);
  const wrapper = cut('function ClockedVideoNotePanel(', '\n}\n');
  assert.match(wrapper, /usePlayerClock\(playerRef, videoId\)/);
  assert.match(wrapper, /<VideoNotePanel videoId=\{videoId\} playerRef=\{playerRef\} currentTime=\{currentTime\} \/>/);
});

test('a sidebar row finds its number without searching the playlist', () => {
  const rows = cut('{filteredItems.map((item) => {', '\n                })}');
  assert.doesNotMatch(rows, /findIndex/);
  assert.match(rows, /indexById\.get\(item\.id\)/);
});
