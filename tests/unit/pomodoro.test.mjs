// ============================================================
// pomodoro.test.mjs — Unit tests for Pomodoro storage & stats
// ============================================================

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
globalThis.window = {
  dispatchEvent: () => true,
};
globalThis.Event = class Event {
  constructor(type) {
    this.type = type;
  }
};

const {
  loadConfig,
  saveConfig,
  loadHistory,
  recordSession,
  getTotalMinutesToday,
  getSessionsCount,
  POMODORO_DEFAULTS,
} = await import('../../src/lib/pomodoro.js');

test('Pomodoro Storage: 1. loadConfig returns defaults on empty storage', () => {
  localStorage.clear();
  const config = loadConfig();
  assert.equal(config.focusMin, 25);
  assert.equal(config.shortBreakMin, 5);
  assert.equal(config.longBreakMin, 15);
  assert.equal(config.strictFocus, true);
});

test('Pomodoro Storage: 2. saveConfig clamps duration values & preserves strictFocus', () => {
  localStorage.clear();
  
  // Test clamping out-of-bounds values
  const saved = saveConfig({ focusMin: 200, shortBreakMin: -5, longBreakMin: 120, strictFocus: false });
  assert.equal(saved.focusMin, 90);       // Max clamped at 90
  assert.equal(saved.shortBreakMin, 1);    // Min clamped at 1
  assert.equal(saved.longBreakMin, 60);    // Max clamped at 60
  assert.equal(saved.strictFocus, false);  // Preserved boolean toggle

  const reloaded = loadConfig();
  assert.equal(reloaded.strictFocus, false);
});

test('Pomodoro Storage: 3. recordSession aggregates minutes & sessions correctly', () => {
  localStorage.clear();

  recordSession({ durationMin: 25, completed: true });
  recordSession({ durationMin: 25, completed: true });
  recordSession({ durationMin: 25, completed: false }); // Uncompleted session should not count towards minutes

  const history = loadHistory();
  assert.equal(history.sessions.length, 3);
  assert.equal(history.totalMin, 50);

  const todayMin = getTotalMinutesToday();
  assert.equal(todayMin, 50);

  const counts = getSessionsCount();
  assert.equal(counts.today, 2);
  assert.equal(counts.total, 2);
});

test('Pomodoro Storage: 4. FIFO capping limits session history to 200 entries', () => {
  localStorage.clear();

  for (let i = 0; i < 210; i++) {
    recordSession({ durationMin: 25, completed: true });
  }

  const history = loadHistory();
  assert.equal(history.sessions.length, 200); // capped at 200
  assert.equal(history.totalMin, 5000); // 200 * 25 = 5000
});
