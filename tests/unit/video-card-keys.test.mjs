// ============================================================
// video-card-keys.test.mjs — a shelf card belongs to its clip
// ============================================================
// B31: shelf cards were keyed by index. After a subject switch the card at
// the same slot kept its ThumbnailWithPlayOverlay instance, so the previous
// playlist's cover, "PLAYLIST, N" badge and error state stayed on a card that
// now named another playlist (for good, when the new one was a remembered
// miss or its fetch failed). Cards are keyed by the clip, and the preview
// hook drops the old cover when its playlist changes.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { VIDEO_LIBRARY } from '../../src/data/videos.js';

const SRC = readFileSync(new URL('../../src/views/VideoView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
function cut(start, end) {
  const a = SRC.indexOf(start);
  assert.notEqual(a, -1, `VideoView must still contain ${JSON.stringify(start)}`);
  return SRC.slice(a, SRC.indexOf(end, a) + end.length);
}
const ctx = { Map };
vm.createContext(ctx);
vm.runInContext(`${cut('function videoCardKeys(', '\n}\n')}\nthis.videoCardKeys = videoCardKeys;`, ctx);

test('a card keeps its key when the subject filter moves it to another slot', () => {
  const all = ctx.videoCardKeys(VIDEO_LIBRARY);
  const keyOf = new Map(all.map(({ v, key }) => [v, key]));
  const subject = VIDEO_LIBRARY.find((v) => v.subject !== VIDEO_LIBRARY[0].subject).subject;
  const some = ctx.videoCardKeys(VIDEO_LIBRARY.filter((v) => v.subject === subject));
  for (const { v, key } of some) assert.equal(key, keyOf.get(v));
  // and a slot index is not a key: the first card of the filtered shelf is
  // not the first card of the full shelf
  assert.notEqual(some[0].key, all[0].key);
});

test('keys are unique across the whole shelf, repeats included', () => {
  const list = [...VIDEO_LIBRARY, { ...VIDEO_LIBRARY[0] }, { ...VIDEO_LIBRARY[0], custom: true }];
  const keys = ctx.videoCardKeys(list).map((x) => x.key);
  assert.equal(new Set(keys).size, keys.length);
});

test('the shelf keys cards by clip and the preview hook resets on a new playlist', () => {
  const grid = cut('{filteredKeys.map(({ v, key }) => (', '/>');
  assert.match(grid, /key=\{key\}/);
  assert.doesNotMatch(SRC, /<VideoCard\s+key=\{idx\}/);
  const hook = cut('function usePlaylistPreview(', '\n}\n');
  assert.match(hook, /if \(cached\) \{ setPreview\(cached\); return undefined; \}\s*setPreview\(null\);/);
});

// B33: the player's window keydown ran goPrev/goNext under the open clip
// summary, so ← / → changed the clip behind a summary that still described
// the previous one.
test('player shortcuts do nothing while the clip summary is open', () => {
  const body = cut('const handleKey = (e) => {', '\n    };\n');
  const run = (openSummary, key) => {
    const calls = [];
    const c = {
      openSummary,
      goPrev: () => calls.push('prev'),
      goNext: () => calls.push('next'),
      playlistItems: [{ id: 'a' }, { id: 'b' }],
      searchInputRef: { current: { focus: () => calls.push('search') } },
    };
    vm.createContext(c);
    const handleKey = vm.runInContext(`(() => { ${body} return handleKey; })()`, c);
    handleKey({ key, target: { tagName: 'DIV' }, preventDefault() {} });
    return calls;
  };
  assert.deepEqual(run(null, 'ArrowRight'), ['next'], 'control: the player pages with no summary open');
  assert.deepEqual(run({ title: 'สรุป' }, 'ArrowRight'), []);
  assert.deepEqual(run({ title: 'สรุป' }, 'ArrowLeft'), []);
  assert.deepEqual(run({ title: 'สรุป' }, '/'), []);
  assert.match(SRC, /\}, \[currentIdx, playlistItems\.length, onClose, openSummary\]\);/);
});
