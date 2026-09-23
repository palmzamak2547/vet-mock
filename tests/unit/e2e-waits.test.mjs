// A fixed sleep in an e2e spec is a guess about how fast the machine is.
// Under load the guess is wrong and a healthy build goes red; on a quiet
// machine it is time spent doing nothing. These specs were measured as the
// gate's worst offenders and now wait for the condition each sleep stood in
// for, so they must not drift back:
//
//   STAB-07  video-shelf-requests sampled the page after a 3.5 s sleep and
//            read 0 cards in 4 of 4 loaded runs.
//   STAB-08  pdf-annotate slept 31.8 s per project (37 sleeps), the most
//            expensive spec in every quiet run, and was flaky on CI.
//   STAB-09  summary-pdf-export failed on Firefox and WebKit in 8 of 19 local
//            gates; its budget was raised once already and must not be again.
//
// Playwright itself is run by the gate; this only reads the spec text.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const spec = (name) => readFileSync(new URL(`../e2e/${name}`, import.meta.url), 'utf8');
const sleeps = (text) => text.split('\n')
  .map((line, i) => ({ line: i + 1, text: line.trim() }))
  .filter(({ text }) => /\bwaitForTimeout\s*\(/.test(text) && !text.startsWith('//'));

test('video-shelf-requests waits for the cards, not for 3.5 s (STAB-07)', () => {
  assert.deepEqual(sleeps(spec('video-shelf-requests.spec.js')), []);
});

test('summary-pdf-export keeps third-party video off the wire and its budgets where they were (STAB-09)', () => {
  const text = spec('summary-pdf-export.spec.js');
  assert.match(text, /youtube\\\.com/, 'the YouTube player is not what this spec tests, and it loads heavily on Firefox and WebKit');
  assert.match(text, /waitForResponse\(/, 'the clip summary module is awaited by name');
  const budgets = [...text.matchAll(/timeout:\s*([\d_]+)/g)].map((m) => Number(m[1].replace(/_/g, '')));
  assert.ok(budgets.every((ms) => ms <= 30_000), `a wait budget was raised past 30 s: ${budgets.join(', ')}`);
});
