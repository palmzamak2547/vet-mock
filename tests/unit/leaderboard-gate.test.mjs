// ============================================================
// leaderboard-gate.test.mjs — min-questions rules for the boards
// ============================================================
// The LAUNCH_READINESS "1-question run can top the board" bug.
// Guards the pure gate logic every read path shares: the global
// RPC's floor must equal the client constant, and aggregation must
// prefer qualifying runs so luck never outranks an honest set.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import {
  LEADERBOARD_MIN_QUESTIONS,
  qualifiesForLeaderboard,
  aggregateLeaderboard,
} from '../../src/lib/leaderboard-gate.js';

const ROOT = resolve(process.cwd());
const row = (over = {}) => ({
  id: 'row-1', user_id: 'u1', pct: 80, correct: 8, total: 10,
  created_at: '2026-09-01T10:00:00Z', ...over,
});

test('the floor matches the SQL RPC default (client and data layer agree)', () => {
  assert.equal(LEADERBOARD_MIN_QUESTIONS, 5, 'product decision 2026-09-03: gate on ≥5 questions per run');
  const sql = readFileSync(join(ROOT, 'supabase/migrations/20260903000000_global_leaderboard_min_questions.sql'), 'utf8');
  assert.match(sql, /p_min_total INT DEFAULT 5/i, 'migration must default p_min_total to the same 5');
  assert.match(sql, /r\.total >= COALESCE\(p_min_total, 5\)/i, 'migration must filter runs below the floor');
});

test('qualifiesForLeaderboard: total below the floor never ranks', () => {
  assert.equal(qualifiesForLeaderboard(row({ total: 1, pct: 100, correct: 1 })), false, 'a 1-question 100% is luck, not a ranking signal');
  assert.equal(qualifiesForLeaderboard(row({ total: LEADERBOARD_MIN_QUESTIONS - 1 })), false);
  assert.equal(qualifiesForLeaderboard(row({ total: LEADERBOARD_MIN_QUESTIONS })), true);
  assert.equal(qualifiesForLeaderboard(null), false, 'defensive: a null row cannot crash the gate');
  assert.equal(qualifiesForLeaderboard({}), false, 'defensive: a missing total is not a qualifying run');
});

test('aggregateLeaderboard drops a user whose every run is under the floor', () => {
  const out = aggregateLeaderboard([
    row({ user_id: 'lucky', total: 1, correct: 1, pct: 100 }),
    row({ user_id: 'lucky', total: 2, correct: 2, pct: 100 }),
  ]);
  assert.equal(out.length, 0, 'no qualifying run → no board entry');
});

test('aggregateLeaderboard prefers the best QUALIFYING run over a tiny perfect one', () => {
  const out = aggregateLeaderboard([
    row({ user_id: 'u1', total: 1, correct: 1, pct: 100, created_at: '2026-09-02T00:00:00Z' }),
    row({ user_id: 'u1', total: 30, correct: 27, pct: 90, created_at: '2026-09-01T00:00:00Z' }),
  ]);
  assert.equal(out.length, 1);
  assert.equal(out[0].pct, 90, 'the 30-question 90% must outrank the filtered-out 1-question 100%');
  assert.equal(out[0].total, 30);
  // Attempts count qualifying runs only — the badge must not
  // advertise runs the board refused to consider.
  assert.equal(out[0].attempts, 1);
});

test('aggregateLeaderboard keeps per-user dedupe, tie-breaks and sorting intact', () => {
  const out = aggregateLeaderboard([
    row({ id: 'a', user_id: 'u1', pct: 70, correct: 7, created_at: '2026-09-01T00:00:00Z' }),
    row({ id: 'b', user_id: 'u1', pct: 90, correct: 9, created_at: '2026-09-01T00:00:00Z' }),
    row({ id: 'c', user_id: 'u1', pct: 90, correct: 9, created_at: '2026-09-02T00:00:00Z' }),
    row({ id: 'd', user_id: 'u2', pct: 90, correct: 10, created_at: '2026-09-01T00:00:00Z' }),
    row({ id: 'e', user_id: 'u3', pct: 50, correct: 5, created_at: '2026-09-01T00:00:00Z' }),
  ]);
  // Same order contract as the SQL: pct → correct → recency.
  assert.deepEqual(out.map((r) => r.id), ['d', 'c', 'e']);
  assert.equal(out[1].attempts, 3, 'all 3 runs qualified, so the ×3 badge counts them all');
});

test('aggregateLeaderboard: null/undefined input cannot crash the board', () => {
  assert.deepEqual(aggregateLeaderboard(null), []);
  assert.deepEqual(aggregateLeaderboard(undefined), []);
  assert.deepEqual(aggregateLeaderboard([null, { pct: 100 }]), [], 'rows without user_id are skipped');
});
