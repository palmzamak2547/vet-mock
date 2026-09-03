// ============================================================
// Boot diet — two chunks that used to download on every Home boot
// ============================================================
// Measured with a chunk trace of Home boot: the VetWiki corrections table
// (~345 KB) arrived because Home prefetches ReviewView at idle and
// ReviewView imported the full conflict index for a count; the instructor
// directory (~334 KB) arrived because App's idle prefetch included
// FacultyView. Neither is needed until its own view opens.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const review = read('../../src/views/ReviewView.jsx');
const wikiLink = read('../../src/components/WikiLinkForQuestion.jsx');
const app = read('../../src/App.jsx');

test('ReviewView reads conflict counts from the generated summary, not the full index', () => {
  // The button lives in WikiLinkForQuestion since the instant-feedback
  // release; the boot-diet contract is the same — whoever renders the
  // count must read the generated summary, never the 368 KB table.
  const holder = review.includes('conflictCountFor') ? review : wikiLink;
  assert.match(holder, /conflict-summary\.generated\.js/);
  assert.doesNotMatch(holder, /conflict-index\.js/);
  assert.doesNotMatch(holder, /vetwiki\/corrections\.js/);
  if (holder === wikiLink) {
    assert.match(review, /WikiLinkForQuestion/, 'ReviewView must render the shared button');
  }
});

test('the idle prefetch does not pull the instructor directory', () => {
  const block = app.slice(app.indexOf('// Idle-time prefetch'), app.indexOf('useWakeLock('));
  assert.doesNotMatch(block, /FacultyView/ === null ? /x/ : /import\('\.\/views\/FacultyView\.jsx'\)/);
  assert.match(block, /import\('\.\/views\/ScheduleView\.jsx'\)/, 'the lighter prefetches stay');
});
