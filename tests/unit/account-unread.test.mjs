import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isAccountUnread } from '../../src/lib/account-unread.js';

test('an account never read on this device, after a failed read, is unread', () => {
  assert.equal(isAccountUnread(true, { phase: 'error', lastSyncedAt: null }), true);
  assert.equal(isAccountUnread(true, { phase: 'offline', lastSyncedAt: null }), true);
});

test('an account read once, a read in flight, a guest or a recovery choice is not', () => {
  assert.equal(isAccountUnread(true, { phase: 'error', lastSyncedAt: 1763300000000 }), false);
  assert.equal(isAccountUnread(true, { phase: 'syncing', lastSyncedAt: null }), false);
  assert.equal(isAccountUnread(true, { phase: 'idle', lastSyncedAt: null }), false);
  assert.equal(isAccountUnread(false, { phase: 'error', lastSyncedAt: null }), false);
  assert.equal(isAccountUnread(true, { phase: 'error', lastSyncedAt: null, recovery: { kind: 'conflict' } }), false);
  assert.equal(isAccountUnread(true, null), false);
});
