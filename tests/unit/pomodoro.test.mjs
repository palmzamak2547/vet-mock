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

test('Pomodoro Storage: 3. Toggle strictFocus on/off persists across simulated page reloads', () => {
  localStorage.clear();

  // Initial load
  let config = loadConfig();
  assert.equal(config.strictFocus, true);

  // Toggle OFF (Relaxed Mode)
  saveConfig({ ...config, strictFocus: false });
  config = loadConfig();
  assert.equal(config.strictFocus, false);

  // Toggle back ON (Strict Mode)
  saveConfig({ ...config, strictFocus: true });
  config = loadConfig();
  assert.equal(config.strictFocus, true);
});

test('Pomodoro Storage: 4. Corrupt JSON in LocalStorage falls back gracefully without crashing', () => {
  localStorage.clear();

  // Set invalid corrupt JSON strings into storage keys
  localStorage.setItem('vmx-pomodoro-config', '{{ invalid json string }}}');
  localStorage.setItem('vmx-pomodoro', 'NOT_JSON_AT_ALL');

  // Should recover with defaults without throwing
  assert.doesNotThrow(() => {
    const config = loadConfig();
    assert.equal(config.focusMin, 25);
    assert.equal(config.strictFocus, true);

    const history = loadHistory();
    assert.equal(history.sessions.length, 0);
    assert.equal(history.totalMin, 0);
    assert.equal(history.currentStreak, 0);
  });
});

test('Pomodoro Storage: 5. recordSession aggregates minutes & sessions correctly', () => {
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

test('Pomodoro Storage: 6. FIFO capping limits session history to 200 entries', () => {
  localStorage.clear();

  for (let i = 0; i < 210; i++) {
    recordSession({ durationMin: 25, completed: true });
  }

  const history = loadHistory();
  assert.equal(history.sessions.length, 200); // capped at 200
  assert.equal(history.totalMin, 5000); // 200 * 25 = 5000
});

// ── Days ─────────────────────────────────────────────────────────────────────
// These cases pin Date.now. A time with an offset names one moment in any zone;
// one without is read in the zone the suite runs in (Bangkok here, UTC in CI).
function withClock(iso, fn) {
  const original = Date.now;
  let now = new Date(iso).getTime();
  Date.now = () => now;
  try {
    return fn({ set: (next) => { now = new Date(next).getTime(); } });
  } finally {
    Date.now = original;
  }
}

function inZone(zone, fn) {
  const previous = process.env.TZ;
  process.env.TZ = zone;
  try {
    return fn();
  } finally {
    if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous;
  }
}

test('Pomodoro Storage: 7. the 7-day count reaches six calendar days back, across a daylight-saving change too', () => {
  localStorage.clear();
  withClock('2026-09-04T23:30:00', (clock) => {
    recordSession({ durationMin: 25, completed: true });
    clock.set('2026-09-10T12:00:00');
    assert.deepEqual(getSessionsCount(), { today: 0, week: 1, total: 1 }, 'six days back is inside the window');
    clock.set('2026-09-11T00:30:00');
    assert.deepEqual(getSessionsCount(), { today: 0, week: 0, total: 1 }, 'seven days back is outside it');
  });

  inZone('America/Los_Angeles', () => {
    assert.equal(new Date('2026-10-30T12:00:00Z').getTimezoneOffset(), 420, 'the runtime follows the zone this case sets');
    assert.equal(new Date('2026-11-05T12:00:00Z').getTimezoneOffset(), 480);
    // Clocks fall back on Sunday 1 Nov, so this window holds a 25-hour day.
    localStorage.clear();
    withClock('2026-10-30T23:30:00-07:00', (clock) => {
      recordSession({ durationMin: 25, completed: true }); // Friday 30 Oct, PDT
      clock.set('2026-11-05T12:00:00-08:00'); // Thursday 5 Nov: 30 Oct is six days back
      assert.deepEqual(getSessionsCount(), { today: 0, week: 1, total: 1 }, 'the oldest day of the window was dropped after the fall-back');
      clock.set('2026-11-06T00:30:00-08:00');
      assert.deepEqual(getSessionsCount(), { today: 0, week: 0, total: 1 });
    });
    // Clocks spring forward on Sunday 8 Mar, a 23-hour day: still seven days, not eight.
    localStorage.clear();
    withClock('2026-03-05T12:00:00-08:00', (clock) => {
      recordSession({ durationMin: 25, completed: true }); // Thursday 5 Mar, PST
      clock.set('2026-03-06T12:00:00-08:00');
      recordSession({ durationMin: 25, completed: true }); // Friday 6 Mar, PST
      clock.set('2026-03-12T12:00:00-07:00'); // Thursday 12 Mar, PDT
      assert.deepEqual(getSessionsCount(), { today: 0, week: 1, total: 2 }, 'only 6 Mar is six days back');
    });
  });
});

// Local wall-clock time on day `n`, counted by calendar day from 1 Sep 2026.
const onDay = (n, hour) => new Date(2026, 8, n, hour).getTime();

test('Pomodoro Storage: 8. the 200-session cap never cuts a streak short, and failed sessions never push a completed one out', () => {
  // Eight completed a day for 30 days: 240 rows, and the 200 kept reach back 25 days.
  localStorage.clear();
  withClock(onDay(1, 8), (clock) => {
    for (let n = 1; n <= 30; n += 1) {
      for (let i = 0; i < 8; i += 1) {
        clock.set(onDay(n, 8 + i));
        recordSession({ durationMin: 25, completed: true });
      }
    }
    const history = loadHistory();
    assert.equal(history.sessions.length, 200, 'the cap still holds');
    assert.equal(history.totalMin, 5000);
    assert.equal(history.currentStreak, 30, 'the streak stopped where the kept rows did');
    clock.set(onDay(31, 12));
    assert.equal(loadHistory().currentStreak, 30, 'the next day, before a session, it still stands');
    clock.set(onDay(32, 12));
    assert.equal(loadHistory().currentStreak, 0, 'and a missed day still ends it');
  });

  // Four completed and four failed a day: the failed ones go first, so every
  // completed session stays.
  localStorage.clear();
  withClock(onDay(1, 8), (clock) => {
    for (let n = 1; n <= 30; n += 1) {
      for (let i = 0; i < 8; i += 1) {
        clock.set(onDay(n, 8 + i));
        recordSession({ durationMin: 25, completed: i % 2 === 0 });
      }
    }
    const history = loadHistory();
    assert.equal(history.sessions.length, 200);
    assert.equal(history.sessions.filter((s) => s.completed).length, 120, 'failed sessions pushed completed ones out');
    assert.equal(history.totalMin, 3000);
    assert.equal(history.currentStreak, 30);
    assert.deepEqual(getSessionsCount(), { today: 4, week: 28, total: 120 });
  });

  // One a day, ten days, a two-day gap, then 201 days: the streak is the 201,
  // neither cut to the 200 kept rows nor carried across the gap.
  localStorage.clear();
  withClock(onDay(1, 10), (clock) => {
    for (let n = 1; n <= 10; n += 1) { clock.set(onDay(n, 10)); recordSession({ durationMin: 25, completed: true }); }
    for (let n = 13; n <= 213; n += 1) { clock.set(onDay(n, 10)); recordSession({ durationMin: 25, completed: true }); }
    const history = loadHistory();
    assert.equal(history.sessions.length, 200);
    assert.equal(history.currentStreak, 201);
  });
});

test('Pomodoro Storage: 9. a focus that ended while the student was away is logged at the moment it ended', () => {
  localStorage.clear();
  // Started at 21:00 on Sunday, found finished on Tuesday morning.
  withClock('2026-11-10T09:00:00', (clock) => {
    const ended = new Date('2026-11-08T21:25:00').getTime();
    recordSession({ durationMin: 25, completed: true, endedAt: ended });
    assert.equal(loadHistory().sessions[0].date, ended, 'the row carries the moment the focus ended');
    assert.equal(getTotalMinutesToday(), 0, 'no focus was done on the day the student came back');
    assert.deepEqual(getSessionsCount(), { today: 0, week: 1, total: 1 });
    assert.equal(loadHistory().currentStreak, 0, 'Monday had no session, so no streak stands on Tuesday');
    // An end time still to come, or none that reads, is the moment of recording.
    recordSession({ durationMin: 25, completed: true, endedAt: Date.now() + 60_000 });
    recordSession({ durationMin: 25, completed: true, endedAt: 'soon' });
    recordSession({ durationMin: 25, completed: true });
    assert.deepEqual(loadHistory().sessions.slice(1).map((s) => s.date), [Date.now(), Date.now(), Date.now()]);
    clock.set('2026-11-08T23:00:00');
    assert.equal(getTotalMinutesToday(), 25, 'the minutes belong to the day the focus ran');
  });
});
