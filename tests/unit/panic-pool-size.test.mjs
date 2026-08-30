// ============================================================
// Panic Mode must be able to fill the session it offers
// ============================================================
// The weak-question pool was capped at 25 while Panic Mode offered 50 ("I
// have an hour") and 120 ("tonight"). A student picking the longest option
// got at most 25 questions — fewer once year-scoping ran — and the session
// simply ended early. The same 25 also truncated the weak count on the
// dashboard, so a student with 80 weak questions was told they had 25.
//
// These two numbers live in one file and must be read together, so the test
// holds them together rather than restating either.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const APP = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');

function readPanicSizes() {
  const line = APP.slice(APP.indexOf('export const PANIC_SIZE'));
  const body = line.slice(line.indexOf('{'), line.indexOf('}') + 1);
  return [...body.matchAll(/:\s*(\d+)/g)].map((m) => Number(m[1]));
}

function readWeakCap() {
  const m = APP.match(/export const WEAK_POOL_CAP = (\d+);/);
  assert.ok(m, 'WEAK_POOL_CAP is gone — Panic Mode can silently under-deliver again');
  return Number(m[1]);
}

test('the weak pool can cover the longest Panic session offered', () => {
  const sizes = readPanicSizes();
  assert.ok(sizes.length >= 3, `expected several Panic sizes, parsed ${sizes.length}`);
  const biggest = Math.max(...sizes);
  const cap = readWeakCap();
  assert.ok(
    cap >= biggest,
    `Panic offers ${biggest} questions but the weak pool holds at most ${cap} — the session ends early`,
  );
});

test('the pool is still capped, so "weak" stays narrower than "wrong"', () => {
  // Removing the cap entirely would make weak == wrong, collapsing two modes
  // the user picks between.
  const cap = readWeakCap();
  assert.ok(cap > 0 && cap <= 1000, `WEAK_POOL_CAP ${cap} is not a meaningful "most missed" list`);
  assert.ok(
    APP.includes('slice(0, WEAK_POOL_CAP)'),
    'the weak list no longer slices to the cap',
  );
});

test('the weak pool is ordered by how often the question was missed', () => {
  // The cap only means "most missed" if the sort survives.
  assert.ok(
    APP.includes('b[1].wrong - a[1].wrong'),
    'weak questions are no longer ranked by wrong-count — the cap would truncate arbitrarily',
  );
});
