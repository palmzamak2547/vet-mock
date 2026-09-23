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
import { posix } from 'node:path';
import vm from 'node:vm';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const review = read('../../src/views/ReviewView.jsx');
const wikiLink = read('../../src/components/WikiLinkForQuestion.jsx');
// App's idle prefetch lives with its lazy() declarations.
const lazyViews = read('../../src/app/lazy-views.js');

test('ReviewView reads conflict counts from the generated summary, not the full index', () => {
  // The button lives in WikiLinkForQuestion since the instant-feedback
  // release; the boot-diet contract is the same — whoever renders the
  // count must read the generated summary, never the 368 KB table.
  const holder = review.includes('conflictCountFor') ? review : wikiLink;
  assert.match(holder, /conflict-summary\.generated\.js/);
  assert.doesNotMatch(holder, /vetwiki\/corrections\.js/);
  if (holder === wikiLink) {
    assert.match(review, /WikiLinkForQuestion/, 'ReviewView must render the shared button');
  }
});

test('the idle prefetch does not pull the instructor directory', () => {
  // Run the prefetch effect (src/app/lazy-views.js) with the browser pieces
  // it touches stood in, for a visitor and for a signed-in student, and
  // collect the modules it asks for as paths under src/.
  const start = lazyViews.indexOf('useEffect(', lazyViews.indexOf('// Idle-time prefetch'));
  const end = lazyViews.indexOf('}, []);', start);
  assert.ok(start > 0 && end > start, 'the idle prefetch effect moved');
  const effect = lazyViews.slice(start + 'useEffect('.length, end + 1).replace(/\bimport\(/g, '__import(');
  const requested = new Set();
  for (const savedSession of [false, true]) {
    const ctx = vm.createContext({
      window: { requestIdleCallback: (cb) => { cb(); return 1; }, cancelIdleCallback() {} },
      navigator: { connection: { saveData: false } },
      hasSavedSession: () => savedSession,
      __import: (spec) => { requested.add(posix.join('app', spec)); return Promise.resolve({}); },
    });
    vm.runInContext(`(${effect})()`, ctx);
  }
  assert.ok(requested.has('views/ScheduleView.jsx'), 'the lighter prefetches stay');
  assert.ok(requested.has('views/HomeView.jsx'));
  assert.ok(!requested.has('views/FacultyView.jsx'), 'the instructor directory is back on the idle path');
  // No other spelling of it either: the directory rides with FacultyView.
  assert.ok(![...requested].some((p) => /Faculty|instructors/.test(p)), [...requested].join(', '));
});
