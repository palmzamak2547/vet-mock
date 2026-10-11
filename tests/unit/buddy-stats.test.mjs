import test from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage for Node test runner environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) ?? null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

// Mock window for event broadcasting
let dispatchedEvents = [];
globalThis.window = {
  dispatchEvent: (event) => {
    dispatchedEvents.push(event.type);
    return true;
  },
};
globalThis.Event = class Event {
  constructor(type) {
    this.type = type;
  }
};

const buddyStats = await import('../../src/lib/buddy-stats.js');
const {
  getSelectedBuddy,
  getPickedBuddy,
  setSelectedBuddy,
  getBuddyStats,
  recordBuddyFocus,
  formatBuddyTime,
  DEFAULT_BUDDY,
} = buddyStats;

test('Buddy Stats: 1. getSelectedBuddy returns default buddy when storage is empty', () => {
  localStorage.clear();
  assert.equal(getSelectedBuddy(), DEFAULT_BUDDY);
});

test('Buddy Stats: 2. setSelectedBuddy stores and broadcasts changes', () => {
  localStorage.clear();
  dispatchedEvents = [];
  setSelectedBuddy('porky');
  assert.equal(getSelectedBuddy(), 'porky');
  assert.ok(dispatchedEvents.includes('vmx-buddy-changed'));
});

test('Buddy Stats: 3. recordBuddyFocus increments minutes and session counts', () => {
  localStorage.clear();
  recordBuddyFocus('clover', 25);
  recordBuddyFocus('clover', 25);
  
  const stats = getBuddyStats('clover');
  assert.equal(stats.minutes, 50);
  assert.equal(stats.sessions, 2);
  assert.equal(stats.questions, 0);
});

// The Results screen used to add score.correct on every mount, so Back from
// the answers or a reload counted the same exam again, in a device-wide key
// shared by every account on the browser. Nothing ever displayed the figure
// (BuddySelector shows minutes only), so the recording is gone rather than
// fixed; bring it back keyed on the session's completion time, per account,
// when a screen shows it.
test('Buddy Stats: 4. exam scores are not recorded while nothing displays them', async () => {
  assert.equal(buddyStats.recordBuddyExam, undefined, 'no exam recorder is exported');
  const { readFileSync } = await import('node:fs');
  const results = readFileSync(new URL('../../src/views/ResultsView.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(results, /recordBuddyExam/, 'ResultsView records nothing per mount');
});

test('Buddy Stats: 6. getPickedBuddy tells an explicit pick from the default', () => {
  localStorage.clear();
  assert.equal(getPickedBuddy(), null, 'no pick yet');
  assert.equal(getSelectedBuddy(), DEFAULT_BUDDY, 'the default still answers getSelectedBuddy');
  setSelectedBuddy('porky');
  assert.equal(getPickedBuddy(), 'porky');
});

test('Buddy Stats: 5. formatBuddyTime formats minutes correctly into Thai string', () => {
  assert.equal(formatBuddyTime(0), '0 นาที');
  assert.equal(formatBuddyTime(25), '25 นาที');
  assert.equal(formatBuddyTime(60), '1 ชม.');
  assert.equal(formatBuddyTime(90), '1 ชม. 30 นาที');
  assert.equal(formatBuddyTime(150), '2 ชม. 30 นาที');
});
