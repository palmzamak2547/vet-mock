import assert from 'node:assert/strict';
import test from 'node:test';
import { secondsUntilDeadline } from '../../src/lib/exam-clock.js';

test('a suspended tab consumes elapsed time even when its timer did not run', () => {
  const deadline = 100_000 + 60_000;
  assert.equal(secondsUntilDeadline(deadline, 100_000), 60);
  assert.equal(secondsUntilDeadline(deadline, 141_000), 19);
  assert.equal(secondsUntilDeadline(deadline, 160_000), 0);
  assert.equal(secondsUntilDeadline(deadline, 200_000), 0);
});

test('a restored deadline preserves fractions of the remaining second', () => {
  assert.equal(secondsUntilDeadline(160_000, 159_999), 1);
  for (const invalid of [null, undefined, NaN, Infinity, -1]) {
    assert.equal(secondsUntilDeadline(invalid, 100_000), 0);
  }
});
