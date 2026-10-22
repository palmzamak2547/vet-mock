// signInPlan: no Google button inside an app browser (Google refuses OAuth
// there), and LINE's own login first inside LINE.
import test from 'node:test';
import assert from 'node:assert/strict';
import { signInPlan } from '../../src/lib/inapp.js';

test('system browser: Google shown, LINE not promoted', () => {
  assert.deepEqual(signInPlan(null), { google: true, lineFirst: false });
});
test('LINE: no Google, LINE first', () => {
  assert.deepEqual(signInPlan('line'), { google: false, lineFirst: true });
});
test('Facebook, Instagram: no Google, LINE not promoted', () => {
  for (const app of ['facebook', 'instagram', 'messenger', 'tiktok', 'twitter']) {
    assert.deepEqual(signInPlan(app), { google: false, lineFirst: false });
  }
});
