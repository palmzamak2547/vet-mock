// ============================================================
// video-history-entry.test.mjs: the shelf writes its course into the
// history entry in the same task as the student's change
// ============================================================
// As a passive effect keyed on the filter, the write could run after a quick
// Back then Forward had already moved to the newer entry, and replace that
// entry with the older course. WebKit showed it in 3 runs of 20
// (video-navigation.spec.js, Back/Forward): popstate to surg3, then the late
// replaceState for surg2, and the shelf stayed on surg2.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../src/views/VideoView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('no effect keyed on the filter writes history', () => {
  assert.doesNotMatch(src, /useEffect\(\(\) => \{[^}]*replaceState[^}]*\}, \[filter\]\)/,
    'a [filter] effect that calls replaceState runs after the navigation it belongs to');
});

test('every change the student makes is written where it happens; Back/Forward writes nothing', () => {
  // Chips and in-app intents go through chooseFilter, which records at once.
  assert.match(src, /const chooseFilter = \(value\) => \{\s*setFilter\(value\);\s*recordFilter\(value\);/);
  assert.ok((src.match(/onClick=\{\(\) => chooseFilter\(/g) || []).length >= 2, 'both kinds of chip record their change');
  // popstate only follows the entry it landed on.
  const follow = src.slice(src.indexOf('const followNavigation'), src.indexOf('const followIntent'));
  assert.match(follow, /setFilter\(videoSubjectForNavigation\(/);
  assert.doesNotMatch(follow, /recordFilter|replaceState|chooseFilter/);
});
