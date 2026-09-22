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
