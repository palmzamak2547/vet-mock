// ============================================================
// Night-rank promotion reaches the results page
// ============================================================
// The promotion is decided in finishExam, before React switches to the
// results view, so a window event alone was fired into a room with no
// listener and the banner never showed (reproduced in the browser with a
// 01:00 clock). The stash carries it across the view switch.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stashPromotion, takePromotion, NIGHT_RANKS } from '../../src/lib/night-rank.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('the stash is one-shot and only holds a real from/to pair', () => {
  assert.equal(takePromotion(), null);
  stashPromotion({ from: NIGHT_RANKS[0], to: NIGHT_RANKS[1] });
  const taken = takePromotion();
  assert.equal(taken.to.id, NIGHT_RANKS[1].id);
  assert.equal(takePromotion(), null, 'a second take must find nothing');
  stashPromotion({ from: null, to: NIGHT_RANKS[1] });
  assert.equal(takePromotion(), null, 'half a promotion is not stashed');
});

test('finishExam stashes the promotion before dispatching, and ResultsView takes it on mount', () => {
  const app = read('../../src/App.jsx');
  assert.match(app, /stashPromotion\(detail\);\n\s*window\.dispatchEvent\(new CustomEvent\(NIGHT_RANK_EVENT, \{ detail \}\)\);/);
  const results = read('../../src/views/ResultsView.jsx');
  assert.match(results, /const pending = takePromotion\(\);\n\s*if \(pending\) setRankPromo\(pending\);/);
  assert.match(results, /window\.addEventListener\(NIGHT_RANK_EVENT, onPromo\);/, 'the live listener stays for events fired after mount');
});
