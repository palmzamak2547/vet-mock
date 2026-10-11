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

const {
  getSelectedBuddy,
  setSelectedBuddy,
  getBuddyStats,
  getAllBuddyStats,
  recordBuddyFocus,
  recordBuddyExam,
  formatBuddyTime,
  DEFAULT_BUDDY,
} = await import('../../src/lib/buddy-stats.js');

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

test('Buddy Stats: 4. recordBuddyExam increments question count correctly', () => {
  localStorage.clear();
  recordBuddyExam('oto', 15);
  recordBuddyExam('oto', 5);

  const stats = getBuddyStats('oto');
  assert.equal(stats.questions, 20);
  assert.equal(stats.minutes, 0);
});

test('Buddy Stats: 5. formatBuddyTime formats minutes correctly into Thai string', () => {
  assert.equal(formatBuddyTime(0), '0 นาที');
  assert.equal(formatBuddyTime(25), '25 นาที');
  assert.equal(formatBuddyTime(60), '1 ชม.');
  assert.equal(formatBuddyTime(90), '1 ชม. 30 นาที');
  assert.equal(formatBuddyTime(150), '2 ชม. 30 นาที');
});
