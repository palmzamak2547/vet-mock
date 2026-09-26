// announced() hides authoring placeholders from subject cards. From 5.53.0 its
// "TBD plus more text" regex held a literal U+0008 where \b was meant, so it
// never matched; the first assertion fails if that character comes back.
import test from 'node:test';
import assert from 'node:assert/strict';
import { announced } from '../../src/data/curriculum.js';

test('announced() drops placeholders and keeps real text', () => {
  assert.equal(announced('TBD — x'), null);
  assert.equal(announced('TBD'), null);
  assert.equal(announced('  '), null);
  assert.equal(announced('Mid + Final separate'), 'Mid + Final separate');
});
