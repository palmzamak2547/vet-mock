// ============================================================
// palette-summary-opens-clip.test.mjs — a ⌘K 'สรุปคลิป' hit opens that clip
// ============================================================
// B28: every summary hit was pushed with payload null and ran
// goView('videos'), so the student landed on the whole shelf (55 playlist
// cards) and had to find the clip again. The hit now carries the clip id; the
// palette leaves it for VideoView, which opens that clip on mount or, when the
// shelf is already open, through vmx-view-intent.
//
// The palette's real runItem and the view's real clip helpers, cut from the
// source and run under vm, the way video-summary-open.test.mjs does it.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const PALETTE = read('../../src/components/CommandPalette.jsx');
const VIEW = read('../../src/views/VideoView.jsx');

function cut(src, start, end) {
  const a = src.indexOf(start);
  assert.notEqual(a, -1, `source must still contain ${JSON.stringify(start)}`);
  const b = src.indexOf(end, a);
  assert.notEqual(b, -1, `source must still contain ${JSON.stringify(end)} after ${JSON.stringify(start)}`);
  return src.slice(a, b + end.length);
}

function memoryStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    _m: m,
  };
}

const META = {
  shrimpClip1: { videoId: 'shrimpClip1', title: 'Aquatic Clinic — 9.1.2 Shrimp Diseases - Biosecurity Cases', subject: 'aquatic-clinic' },
};

function env(now = 1_000_000) {
  const sessionStorage = memoryStorage();
  const ctx = {
    sessionStorage,
    VIDEO_META: META,
    sessionLabel: () => null,
    momentFromSearch: () => null,
    window: { location: { search: '' } },
    Date: { now: () => ctx.__now },
    JSON,
    Number,
    __now: now,
    rememberViewIntent() {},
    alertDialog() {},
  };
  vm.createContext(ctx);
  vm.runInContext(`
    ${cut(PALETTE, 'function runItem(item, handlers) {', '\n}\n')}
    ${cut(VIEW, 'function knownClip(', '\n}\n')}
    ${cut(VIEW, 'function citedMoment(', '\n}\n')}
    ${cut(VIEW, "const PENDING_CLIP_KEY", 'function takePendingClip() {')} ${cut(VIEW, 'let raw = null;', '\n}\n')}
    this.runItem = runItem; this.takePendingClip = takePendingClip; this.knownClip = knownClip;
  `, ctx);
  return ctx;
}

test('each summary hit carries the clip it names', () => {
  const block = cut(PALETTE, '// Video summaries', '// Instructors');
  assert.match(block, /payload: s\.videoId \? \{ videoId: s\.videoId, subject: s\.subject \|\| null \} : null/);
});

test('choosing a summary hit opens that clip, not the whole shelf', () => {
  const ctx = env();
  const calls = [];
  ctx.runItem({ type: 'summary', payload: { videoId: 'shrimpClip1', subject: 'aquatic-clinic' } }, {
    goView: (...a) => calls.push(a),
  });
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [['videos', { videoId: 'shrimpClip1', subject: 'aquatic-clinic' }]]);
  // the fresh VideoView takes the clip once
  const clip = ctx.takePendingClip();
  assert.equal(clip.url, 'https://www.youtube.com/watch?v=shrimpClip1');
  assert.equal(clip.topic, META.shrimpClip1.title);
  assert.equal(clip.start, 0);
  assert.equal(ctx.takePendingClip(), null, 'taken once');
});

test('a hand-off that never arrived does not open a clip on a later visit', () => {
  const ctx = env();
  ctx.runItem({ type: 'summary', payload: { videoId: 'shrimpClip1', subject: 'aquatic-clinic' } }, { goView() {} });
  ctx.__now += 31_000;
  assert.equal(ctx.takePendingClip(), null);
});

test('an unknown clip id opens nothing, and a hit without an id still opens the shelf', () => {
  const ctx = env();
  const calls = [];
  ctx.runItem({ type: 'summary', payload: null }, { goView: (...a) => calls.push(a) });
  assert.deepEqual(calls, [['videos']]);
  ctx.sessionStorage.setItem('vmx-video-pending-clip', JSON.stringify({ videoId: 'notAClip999', at: ctx.__now }));
  assert.equal(ctx.takePendingClip(), null);
});

test('the view opens the pending clip on mount and through vmx-view-intent', () => {
  assert.match(VIEW, /useState\(\(\) => citedMoment\(\) \|\| takePendingClip\(\)\)/);
  const intent = cut(VIEW, 'const followIntent = (event) => {', '\n    };\n');
  assert.match(intent, /typeof detail\.navigationState\?\.videoId === 'string'/);
  assert.match(intent, /setPlaying\(clip\)/);
});

// B34: a claim's source opened the article top. The section it cites was
// validated against the build a moment earlier and then thrown away.
test('an ask-the-corpus source opens the cited section', () => {
  const card = cut(PALETTE, 'function AskAnswerCard(', '\n}\n');
  assert.match(card, /onOpenWiki\?\.\(m\.subject, m\.topic, sectionId\)/);
  assert.doesNotMatch(card, /onOpenWiki\?\.\(m\.subject, m\.topic\);/);
  assert.match(card, /\{m\.heading \? <span/);
});
