// ============================================================
// video-local-extras.test.mjs — a clip is shown only once it is stored
// ============================================================
// The video shelf keeps a student's own clips and watch history through the
// local-extras bundle. Its hook used to put the new list on screen first and
// then write it, ignoring the false the write returned. With storage that
// refused the write, the card appeared, the form closed, and the next reload
// took the clip away with no word to the student. Deleting had the same
// shape: the card went, and came back on reload.
//
// These are the view's real hook and handlers, cut from the source and run
// under vm against the real local-extras module and a storage whose writes
// the test can make fail, the way video-summary-open.test.mjs runs the
// summary loader.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { readLocalExtra, writeLocalExtra } from '../../src/lib/local-extras.js';
import { getVideoId, getPlaylistId, isChannelUrl } from '../../src/data/videos.js';

const SRC = readFileSync(new URL('../../src/views/VideoView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

function cut(start, end) {
  const a = SRC.indexOf(start);
  assert.notEqual(a, -1, `VideoView must still contain ${JSON.stringify(start)}`);
  const b = SRC.indexOf(end, a);
  assert.notEqual(b, -1, `VideoView must still contain ${JSON.stringify(end)} after ${JSON.stringify(start)}`);
  return SRC.slice(a, b + end.length);
}

const HOOK = cut('function useLocalExtra(key, fallback) {', '\n}\n');
const SAVE = cut('const save = () => {', '\n  };\n');
const DELETE = cut('const deleteCustom = async (idx) => {', '\n  };\n');
const MARK = cut('const markWatched = (videoId) => {', '\n  };\n');

const BUNDLE = 'vmx-local-extras-v1';
const CLIPS = 'vmx-custom-videos';
const WATCHED = 'vmx-watched-videos';

// A browser: a localStorage whose writes can be refused the way a full one
// refuses them, and the window local-extras listens on. A fresh browser over
// the same saved values is a reload.
function browser(initial = {}) {
  const values = new Map(Object.entries(initial));
  const b = {
    values,
    refuse: false,
    install() {
      globalThis.window = {
        localStorage: {
          getItem: (key) => (values.has(key) ? values.get(key) : null),
          setItem: (key, value) => {
            if (b.refuse) {
              const err = new Error('The quota has been exceeded.');
              err.name = 'QuotaExceededError';
              throw err;
            }
            values.set(key, String(value));
          },
          removeItem: (key) => values.delete(key),
        },
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {},
      };
      return b;
    },
    reload() { return browser(Object.fromEntries(values)).install(); },
  };
  return b.install();
}

// Just enough of React to run a hook: state and refs keep their slot across
// renders, and a setter changes the value the next render reads.
function mount(key, fallback) {
  const slots = [];
  let i = 0;
  const useState = (init) => {
    const at = i++;
    if (!(at in slots)) slots[at] = { value: typeof init === 'function' ? init() : init };
    const slot = slots[at];
    return [slot.value, (next) => { slot.value = typeof next === 'function' ? next(slot.value) : next; }];
  };
  const useRef = (init) => {
    const at = i++;
    if (!(at in slots)) slots[at] = { current: init };
    return slots[at];
  };
  const ctx = { readLocalExtra, writeLocalExtra, useState, useRef };
  vm.createContext(ctx);
  const useLocalExtra = vm.runInContext(`${HOOK}\nuseLocalExtra`, ctx);
  const render = () => { i = 0; return useLocalExtra(key, fallback); };
  render();
  return render;
}

const CLIP_A = { subject: 'surg2', topic: 'Cherry eye', url: 'https://www.youtube.com/watch?v=hPV3Rhh8r3Q', author: '', duration: '', custom: true };
const CLIP_B = { subject: 'surg2', topic: 'Enucleation', url: 'https://youtu.be/dQw4w9WgXcQ', author: '', duration: '', custom: true };

test.afterEach(() => { delete globalThis.window; });

// ── the hook ─────────────────────────────────────────────────────────

test('a clip the browser refused to store is not shown', () => {
  const b = browser();
  const render = mount(CLIPS, []);
  b.refuse = true;
  const [, setClips] = render();
  assert.equal(setClips([CLIP_A]), false, 'the caller has to learn the write failed');
  assert.deepEqual(render()[0], [], 'a card the next reload would take away must not appear');
});

test('a stored clip is shown and is still there after a reload', () => {
  const b = browser();
  const render = mount(CLIPS, []);
  assert.equal(render()[1]([CLIP_A]), true);
  assert.deepEqual(render()[0], [CLIP_A]);
  b.reload();
  assert.deepEqual(mount(CLIPS, [])()[0], [CLIP_A]);
});

test('a later save persists once the browser accepts it again', () => {
  const b = browser();
  const render = mount(CLIPS, []);
  b.refuse = true;
  assert.equal(render()[1]([CLIP_A]), false);
  b.refuse = false;
  assert.equal(render()[1]([CLIP_A]), true);
  b.reload();
  assert.deepEqual(mount(CLIPS, [])()[0], [CLIP_A]);
});

test('a restored local-extras bundle is read and written in place', () => {
  const b = browser({ [BUNDLE]: JSON.stringify({ [CLIPS]: [CLIP_A] }) });
  const render = mount(CLIPS, []);
  assert.deepEqual(render()[0], [CLIP_A]);
  assert.equal(render()[1]([CLIP_A, CLIP_B]), true);
  assert.deepEqual(JSON.parse(b.values.get(BUNDLE))[CLIPS], [CLIP_A, CLIP_B]);
  assert.equal(b.values.has(CLIPS), false, 'a bundle reader never looks at the plain key');
});

test('plain-key storage from before the bundle still works', () => {
  const b = browser({ [CLIPS]: JSON.stringify([CLIP_A]) });
  const render = mount(CLIPS, []);
  assert.deepEqual(render()[0], [CLIP_A]);
  assert.equal(render()[1]([CLIP_A, CLIP_B]), true);
  assert.deepEqual(JSON.parse(b.values.get(CLIPS)), [CLIP_A, CLIP_B]);
});

test('an unreadable bundle refuses the write and shows nothing new', () => {
  browser({ [BUNDLE]: '{not json' });
  const render = mount(CLIPS, []);
  assert.equal(render()[1]([CLIP_A]), false);
  assert.deepEqual(render()[0], []);
});

test('functional updates build on the stored value, even twice before a render', () => {
  browser();
  const render = mount(WATCHED, {});
  const [, setWatched] = render();
  assert.equal(setWatched((prev) => ({ ...prev, a: { watchedAt: 1 } })), true);
  assert.equal(setWatched((prev) => ({ ...prev, b: { watchedAt: 2 } })), true);
  assert.deepEqual(Object.keys(render()[0]).sort(), ['a', 'b'], 'the second update must see the first');
});

// ── the shelf's handlers ─────────────────────────────────────────────

// The view around save/deleteCustom/markWatched: its form, its modal flag and
// its dialogs, with the list and history from real hooks.
function shelf({ clips = [], editingIdx = null, form = { ...CLIP_B } } = {}) {
  const b = browser({ [CLIPS]: JSON.stringify(clips) });
  const clipsHook = mount(CLIPS, []);
  const watchedHook = mount(WATCHED, {});
  const seen = { alerts: [], showAdd: [] };
  const ctx = {
    form,
    editingIdx,
    getVideoId,
    getPlaylistId,
    isChannelUrl,
    setShowAdd: (v) => seen.showAdd.push(v),
    alertDialog: (o) => { seen.alerts.push(typeof o === 'string' ? o : [o.title, o.body].filter(Boolean).join('\n')); },
    confirmDialog: async () => true,
  };
  const refresh = () => {
    [ctx.customVideos, ctx.setCustomVideos] = clipsHook();
    [ctx.watched, ctx.setWatched] = watchedHook();
  };
  refresh();
  vm.createContext(ctx);
  const handlers = vm.runInContext(`${SAVE}\n${DELETE}\n${MARK}\n({ save, deleteCustom, markWatched })`, ctx);
  return {
    b, seen, handlers,
    clips: () => { refresh(); return ctx.customVideos; },
    watched: () => { refresh(); return ctx.watched; },
  };
}

const saysNotSaved = (alerts) => {
  assert.equal(alerts.length, 1, 'the student has to be told');
  assert.match(alerts[0], /ไม่สำเร็จ/);
  // A corrupt bundle fails the same way as a full one, so the message may
  // not claim to know which.
  assert.doesNotMatch(alerts[0], /เต็ม/);
};

test('adding under a refused write keeps the form open and says the clip was not saved', () => {
  const s = shelf();
  s.b.refuse = true;
  s.handlers.save();
  saysNotSaved(s.seen.alerts);
  assert.ok(!s.seen.showAdd.includes(false), 'the form must stay open, still filled');
  assert.deepEqual(s.clips(), []);
});

test('editing under a refused write keeps the clip as it was', () => {
  const s = shelf({ clips: [CLIP_A], editingIdx: 0, form: { ...CLIP_A, topic: 'Cherry eye, revised' } });
  s.b.refuse = true;
  s.handlers.save();
  saysNotSaved(s.seen.alerts);
  assert.ok(!s.seen.showAdd.includes(false));
  assert.deepEqual(s.clips(), [CLIP_A]);
});

test('deleting under a refused write leaves the card and says so', async () => {
  const s = shelf({ clips: [CLIP_A, CLIP_B] });
  s.b.refuse = true;
  await s.handlers.deleteCustom(0);
  assert.equal(s.seen.alerts.length, 1);
  assert.match(s.seen.alerts[0], /ไม่สำเร็จ/);
  assert.deepEqual(s.clips(), [CLIP_A, CLIP_B]);
});

test('on working storage a save closes the form and the clip stays after a reload', () => {
  const s = shelf();
  s.handlers.save();
  assert.deepEqual(s.seen.alerts, []);
  assert.deepEqual(s.seen.showAdd, [false]);
  assert.equal(s.clips().length, 1);
  s.b.reload();
  assert.equal(mount(CLIPS, [])()[0].length, 1);
});

test('on working storage a delete removes the card', async () => {
  const s = shelf({ clips: [CLIP_A, CLIP_B] });
  await s.handlers.deleteCustom(0);
  assert.deepEqual(s.seen.alerts, []);
  assert.deepEqual(s.clips(), [CLIP_B]);
});

test('the watched badge still appears on working storage', () => {
  const s = shelf();
  s.handlers.markWatched('hPV3Rhh8r3Q');
  assert.ok(s.watched().hPV3Rhh8r3Q?.watchedAt > 0);
});
