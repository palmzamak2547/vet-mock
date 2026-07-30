// ============================================================
// personal-notes-lifecycle.test.mjs — Unit tests for Personal Notes sync lifecycle
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

// ─── Mocked dependencies based on App.jsx & api.js ─────────────

let mockLocalStorage = {};
let mockCloudDB = {}; // user_data table
let mockPendingNotes = {}; // durable per-user outbox

function getLocalNotes() {
  return mockLocalStorage['vmx-notes'] || {};
}

function setLocalNotes(notes) {
  mockLocalStorage['vmx-notes'] = notes;
}

// simulate `migrateLocalToCloud` in supabase.js
async function simulateMigrateLocalToCloud(userId) {
  const localNotes = getLocalNotes();
  if (Object.keys(localNotes).length === 0) return { migrated: false };
  
  // Upsert to cloud
  const existing = mockCloudDB[userId] || {};
  mockCloudDB[userId] = {
    ...existing,
    notes: { ...(existing.notes || {}), ...localNotes }
  };
  return { migrated: true };
}

// simulate `pullUserData` in api.js & App.jsx
async function simulatePullUserData(userId) {
  const data = mockCloudDB[userId];
  const pending = mockPendingNotes[userId];
  if (pending) {
    // Local dirty data is replayed over the pulled base; a stale remote
    // response must not erase edits that are still waiting for delivery.
    setLocalNotes({ ...(data?.notes || {}), ...pending });
  } else if (data && Object.hasOwn(data, 'notes')) {
    // Empty objects are intentional data too (for example, delete all notes).
    setLocalNotes(data.notes);
  }
}

// simulate `pushUserDataDebounced` in api.js
async function simulatePushUserData(userId, notes, isOffline = false) {
  if (isOffline) {
    mockPendingNotes[userId] = notes;
    throw new Error('Network error (Offline)');
  }
  const existing = mockCloudDB[userId] || {};
  mockCloudDB[userId] = { ...existing, notes };
  delete mockPendingNotes[userId];
}

function resetEnvironment() {
  mockLocalStorage = {};
  mockCloudDB = {};
  mockPendingNotes = {};
}

// ─── Tests ───────────────────────────────────────────────────

test('Lifecycle: Guest Mode (Offline by definition)', async () => {
  resetEnvironment();
  
  // Guest user creates a note
  setLocalNotes({ 'com5:101': 'guest note' });
  
  // It exists in local storage
  assert.equal(getLocalNotes()['com5:101'], 'guest note');
  
  // It does NOT exist in cloud because push is not called for guests
  assert.equal(mockCloudDB['user-1']?.notes, undefined);
});

test('Lifecycle: Migration (Guest -> Authenticated)', async () => {
  resetEnvironment();
  
  // 1. Guest writes a note
  setLocalNotes({ 'com5:101': 'guest note before login' });
  
  // 2. User signs up / logs in. AuthView calls migrateLocalToCloud
  await simulateMigrateLocalToCloud('user-1');
  
  assert.equal(mockCloudDB['user-1'].notes['com5:101'], 'guest note before login');
  
  // 3. App.jsx then calls pullUserData
  await simulatePullUserData('user-1');
  
  assert.equal(getLocalNotes()['com5:101'], 'guest note before login');
});

test('Lifecycle: Authenticated Online Sync', async () => {
  resetEnvironment();
  mockCloudDB['user-1'] = { notes: { 'com5:101': 'old note' } };
  
  // 1. App loads, pulls data
  await simulatePullUserData('user-1');
  assert.equal(getLocalNotes()['com5:101'], 'old note');
  
  // 2. User edits note
  setLocalNotes({ 'com5:101': 'updated note' });
  
  // 3. App.jsx pushes data (simulate online)
  await simulatePushUserData('user-1', getLocalNotes(), false);
  
  assert.equal(mockCloudDB['user-1'].notes['com5:101'], 'updated note');
});

test('Lifecycle: Authenticated Offline Conflict preserves the local edit', async () => {
  resetEnvironment();
  mockCloudDB['user-1'] = { notes: { 'com5:101': 'cloud note' } };
  
  // 1. App loads while online
  await simulatePullUserData('user-1');
  assert.equal(getLocalNotes()['com5:101'], 'cloud note');
  
  // 2. Network goes offline. User edits note.
  setLocalNotes({ 'com5:101': 'offline edit' });
  
  // 3. App tries to push, but fails (offline)
  try {
    await simulatePushUserData('user-1', getLocalNotes(), true);
  } catch (e) {
    // Expected network error
  }
  
  // 4. Cloud still has old data, local has new data
  assert.equal(mockCloudDB['user-1'].notes['com5:101'], 'cloud note');
  assert.equal(getLocalNotes()['com5:101'], 'offline edit');
  
  // 5. User reloads page while back online. App.jsx calls pullUserData
  await simulatePullUserData('user-1');
  
  // The durable outbox is replayed over the stale cloud response.
  assert.equal(getLocalNotes()['com5:101'], 'offline edit');

  // Reconnect flushes the pending value and clears the outbox.
  await simulatePushUserData('user-1', getLocalNotes(), false);
  assert.equal(mockCloudDB['user-1'].notes['com5:101'], 'offline edit');
  assert.equal(mockPendingNotes['user-1'], undefined);
});
