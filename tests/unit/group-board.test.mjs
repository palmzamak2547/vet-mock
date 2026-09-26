// ============================================================
// group-board — the group tab ranks the members' runs
// ============================================================
// B15 (bug hunt 2026-09-26). GroupDetailView opened on 'อันดับคะแนน' and
// asked for exam_results WHERE group_id = the group. Nothing writes
// exam_results.group_id (record_exam_receipt's INSERT has no such column and
// no exam flow carries a group), so the tab always said nobody had taken an
// exam, however many sets the members finished.
//
// The board is now the verified global board (one best server-scored run per
// student, show_on_leaderboard honoured) narrowed to the group's members.
// api.js runs as shipped; only its ./supabase.js import is swapped for a stub
// (supabase.js reads import.meta.env and cannot load outside Vite).
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { groupBoardRows, GROUP_BOARD_SOURCE_LIMIT } from '../../src/lib/group-board.js';

registerHooks({
  resolve(specifier, context, nextResolve) {
    const parent = String(context.parentURL || '').split('?')[0];
    if (parent.endsWith('/src/lib/api.js') && specifier === './supabase.js') {
      return { url: 'vetmock-test:group-board-supabase', shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === 'vetmock-test:group-board-supabase') {
      return {
        format: 'module', shortCircuit: true,
        source: 'export const getSupabase = async () => globalThis.__vmxGroupBoard; export const ensureProfile = async () => {}; export const hasSupabase = true;',
      };
    }
    return nextLoad(url, context);
  },
});

const api = await import('../../src/lib/api.js');

const run = (user_id, pct, correct, id = `${user_id}-${pct}`) => ({
  id, user_id, pct, correct, total: 20, mode: 'exam', subject: 'com5',
  profiles: { username: user_id, avatar_emoji: '🐶' },
});

function backend({ members, board }) {
  const calls = { groupFilter: [], rpc: [], examResultsReads: 0 };
  globalThis.__vmxGroupBoard = {
    from(table) {
      if (table === 'exam_results') calls.examResultsReads++;
      assert.equal(table, 'group_members', `the group board read ${table}`);
      const q = {
        select() { return q; },
        eq(column, value) { calls.groupFilter.push([column, value]); return Promise.resolve({ data: members, error: null }); },
      };
      return q;
    },
    rpc: async (name, args) => { calls.rpc.push([name, args]); return { data: board, error: null }; },
  };
  return calls;
}

test('the group board ranks members who finished a verified set, and nobody else', async () => {
  const calls = backend({
    members: [{ user_id: 'me' }, { user_id: 'bee' }, { user_id: 'quiet' }],
    board: [run('stranger', 100, 20), run('bee', 90, 18), run('me', 75, 15), run('other', 60, 12)],
  });
  try {
    const rows = await api.getGroupLeaderboard('g1');
    assert.deepEqual(rows.map((r) => r.user_id), ['bee', 'me'], 'only this group, best first');
    assert.equal(rows[0].profiles.username, 'bee', 'rows keep the fields the tab draws');
    assert.deepEqual(calls.groupFilter, [['group_id', 'g1']]);
    assert.equal(calls.examResultsReads, 0, 'no exam_results.group_id query');
    assert.equal(calls.rpc[0][0], 'get_leaderboard_by_source');
    assert.equal(calls.rpc[0][1].p_source, 'server', 'verified runs only');
    assert.equal(calls.rpc[0][1].p_limit, GROUP_BOARD_SOURCE_LIMIT);
  } finally { delete globalThis.__vmxGroupBoard; }
});

test('a group with no members asks for no board', async () => {
  const calls = backend({ members: [], board: [run('x', 90, 18)] });
  try {
    assert.deepEqual(await api.getGroupLeaderboard('g1'), []);
    assert.equal(calls.rpc.length, 0);
  } finally { delete globalThis.__vmxGroupBoard; }
});

test('one row per member, ties broken by correct answers, junk input is an empty list', () => {
  const rows = groupBoardRows(['a', 'b'], [run('a', 80, 16, 'a1'), run('a', 85, 17, 'a2'), run('b', 85, 34, 'b1')]);
  assert.deepEqual(rows.map((r) => r.id), ['b1', 'a2']);
  assert.deepEqual(groupBoardRows([], [run('a', 90, 18)]), []);
  assert.deepEqual(groupBoardRows(['a'], null), []);
  assert.deepEqual(groupBoardRows(undefined, undefined), []);
  assert.equal(GROUP_BOARD_SOURCE_LIMIT, 1000, 'the RPC clamps p_limit to 1000');
});

test('the group page loads that board, and says which runs it ranks', () => {
  const src = readFileSync(new URL('../../src/views/GroupDetailView.jsx', import.meta.url), 'utf8');
  assert.match(src, /leaderboard: getGroupLeaderboard/);
  assert.doesNotMatch(src, /leaderboard: getLeaderboard\b/, 'the tab still queries exam_results.group_id');
  assert.match(src, /ระบบตรวจคะแนนแล้ว/);
  assert.doesNotMatch(src, /·/, 'no middle dot in student copy');
});
