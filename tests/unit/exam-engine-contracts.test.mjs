// ============================================================
// exam-engine-contracts.test.mjs — four promises the engine now keeps
// ============================================================
// startExam and the analytics memo live inside App.jsx and cannot be
// imported without React, so these pin the shape of the code the way
// panic-pool-size.test.mjs and boot-diet.test.mjs already do.
//
//   1. A caller's `mode` override reaches the session. VetWiki's
//      "ฝึกจากหัวข้อนี้" passed mode:'quick' and it was ignored, so after a
//      visit to โหมดสอบ the practice ran as a graded exam.
//   2. A curated set ('weak', 'wrong', 'bookmarks') keeps its order.
//      Both screens promise "เรียงตามความถี่ (ผิดบ่อยขึ้นก่อน)"; the pick
//      shuffled the pool and threw the order away.
//   3. The 'wrong' pool is sorted most-missed-first, so that promise is
//      true rather than merely un-shuffled.
//   4. The legacy-history fallback is a Map lookup. It was Array.find over
//      the whole loaded bank once per row that missed the compound key —
//      2,000 out-of-scope rows cost 52 ms on desktop V8 the moment the app
//      became usable, for lookups that all returned undefined.
//   5. The in-flight exam snapshot is written on pagehide/visibilitychange
//      and at most 3 s apart during continuous typing — it used to be a
//      resetting debounce that never fired while a student kept typing and
//      was discarded when the tab went away.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const APP = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');

function between(startMarker, endMarker) {
  const a = APP.indexOf(startMarker);
  assert.notEqual(a, -1, `missing marker: ${startMarker}`);
  const b = APP.indexOf(endMarker, a);
  assert.notEqual(b, -1, `missing end marker: ${endMarker}`);
  return APP.slice(a, b);
}

test('startExam reads the mode override and applies it like the timer overrides', () => {
  const fn = between('const startExam = async (overrides = {}) => {', 'const finishExam = async () => {');
  assert.match(fn, /const _mode = 'mode' in overrides \? overrides\.mode : mode;/);
  assert.match(fn, /if \('mode' in overrides\) setMode\(_mode\);/);
});

test('a curated set is picked in order; ordinary practice still shuffles', () => {
  const fn = between('const startExam = async (overrides = {}) => {', 'const finishExam = async () => {');
  assert.match(fn, /const ordered = USER_CURATED_MODES\.has\(_practiceMode\);/);
  assert.match(fn, /\(ordered \? pool : shuffle\(pool\)\)\.slice\(/, 'the pick must only shuffle non-curated pools');
  assert.doesNotMatch(fn, /let picked = shuffle\(pool\)\.slice/, 'the unconditional shuffle is back');
});

test("the 'wrong' pool is sorted most-missed-first", () => {
  const branch = between("} else if (practiceMode === 'wrong') {", '  } else {\n    pool = subject === \'all\'');
  assert.match(branch, /const wrongCount = new Map\(\);/);
  assert.match(branch, /pool\.sort\(\(a, b\) => \(wrongCount\.get\(`\$\{b\.subject\}:\$\{b\.id\}`\) \|\| 0\)/);
});

test('the legacy-history fallback is an index lookup, not a scan of the bank', () => {
  const memo = between('const analytics = useMemo(() => {', 'const configPracticeMode =');
  assert.match(memo, /const qById = new Map\(\);/);
  assert.match(memo, /\|\| qById\.get\(h\.questionId\);/);
  assert.doesNotMatch(memo, /allQuestions\.find\(\(x\) => x\.id === h\.questionId\)/, 'the per-row bank scan is back');
  // "first question carrying that id" is what Array.find returned; the map
  // must be filled the same way or a colliding id resolves differently.
  assert.match(memo, /if \(!qById\.has\(q\.id\)\) qById\.set\(q\.id, q\);/);
});

test('the in-flight exam snapshot flushes on tab hide and has a write ceiling', () => {
  assert.match(APP, /const writeInflight = useCallback\(\(\) => \{/);
  const flush = between('const writeInflight = useCallback', 'const analytics = useMemo');
  assert.match(flush, /window\.addEventListener\('pagehide', onHide\);[\s\S]*document\.addEventListener\('visibilitychange', onHide\);/);
  assert.match(flush, />= 3000\) \{ writeInflight\(\); return undefined; \}/, 'continuous typing must still commit every few seconds');
  assert.match(flush, /setTimeout\(writeInflight, 500\)/, 'the short debounce is still the common path');
  assert.match(flush, /inflightRef\.current = null; return undefined;/, 'leaving the exam must stop the hide handler re-writing a stale snapshot');
});
