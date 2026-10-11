// ============================================================
// race-null-snapshot — a missed room code is a refusal, not a retry
// ============================================================
// CX-RACE. Migration 20261011120600_race_join_rate_limit makes enter_race
// return NULL for a code that matches no live room and for an account past
// 20 join attempts in 10 minutes (the counter commits that way, where a
// RAISE would roll it back). Before this change applySnapshot(null) read
// snapshot.started_at off null; act() caught the TypeError and, finding no
// Thai in it, told the student 'ยังส่งไม่สำเร็จ กรุณาลองอีกครั้ง', a retry
// that can never succeed. The poll would have said the connection stumbled
// and kept polling.
//
// The client must ship before the migration, so this test drives the real
// RaceView under the fake React runtime with ownedRpc stubbed to answer
// null, and reads what the student sees.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, settle, textOf } from '../helpers/fake-react.mjs';
import { RACE_REFUSALS } from '../../src/lib/race-refusals.js';

const source = readFileSync(new URL('../../src/views/RaceView.jsx', import.meta.url), 'utf8');

const stubs = [
  { match: 'lib/supabase\\.js$', contents: `export const hasSupabase = true;
    export const getSupabase = async () => ({ auth: { getSession: async () => ({ data: { session: { user: { id: 'me' }, access_token: 't' } } }) } });` },
  { match: 'lib/owned-rpc\\.js$', contents: 'export const ownedRpc = (...args) => globalThis.__raceRpc(...args);' },
  { match: 'data/questions\\.js$', contents: 'export const QB = []; export const loadQBForYear = async () => {};' },
  { match: 'data/question-delivery\\.generated\\.js$', contents: 'export const isQuestionDeliverable = () => true;' },
  { match: 'lib/question-surfaces\\.js$', contents: 'export const raceEligibleQuestions = () => [];' },
  { match: 'lib/richtext\\.jsx$', contents: 'export const RichText = ({ text }) => text;' },
  { match: 'components/BackBar\\.jsx$', contents: 'export default function BackBar({ label }) { return label; }' },
  { match: 'lib/dialog\\.js$', contents: 'export const confirmDialog = async () => true;' },
];

const { default: RaceView } = await loadModule('src/views/RaceView.jsx', { stubs });

/** The unexpanded element tree still holds nested components by function; find one by name. */
function findComponent(node, name) {
  if (node == null || typeof node !== 'object') return null;
  if (Array.isArray(node)) { for (const n of node) { const hit = findComponent(n, name); if (hit) return hit; } return null; }
  if (typeof node.type === 'function' && node.type.name === name) return node;
  return findComponent(node.props?.children, name);
}

// The poll effect listens on window and document; node has neither. The
// returned restore runs after the panel is unmounted (its cleanup reads them).
function browserGlobals() {
  const original = new Map(['window', 'document'].map((key) => [key, globalThis[key]]));
  globalThis.window = Object.assign(new EventTarget(), {});
  globalThis.document = Object.assign(new EventTarget(), { visibilityState: 'visible' });
  return () => { for (const [key, value] of original) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

test('a null snapshot from enter_race shows the room refusal, not a retry prompt', async (t) => {
  const restore = browserGlobals();
  const calls = [];
  globalThis.__raceRpc = async (owner, name, args) => { calls.push([name, args]); return null; };
  const panel = mount(RaceView, { goHome() {}, setView() {}, user: { id: 'me' }, profile: { username: 'me' } });
  t.after(() => { panel.unmount(); restore(); delete globalThis.__raceRpc; });
  await settle(panel);
  const join = findComponent(panel.tree, 'JoinForm');
  assert.ok(join, 'the lobby offers the join form');
  await join.props.onJoin('abc123');
  await settle(panel);
  assert.deepEqual(calls, [['enter_race', { p_code: 'ABC123' }]]);
  const shown = textOf(panel.tree);
  assert.ok(shown.includes(RACE_REFUSALS['Room unavailable']), `the refusal is on screen: ${shown}`);
  assert.doesNotMatch(shown, /กรุณาลองอีกครั้ง|ยังส่งไม่สำเร็จ/, 'no retry prompt for something a retry cannot fix');
  assert.ok(findComponent(panel.tree, 'JoinForm'), 'the student stays in the lobby to type another code');
});

test('a null snapshot while polling stops the poll with the same refusal', async (t) => {
  const restore = browserGlobals();
  let polls = 0;
  globalThis.__raceRpc = async (owner, name) => {
    if (name === 'enter_race') return { code: 'ABC123', host_id: 'me', started_at: null, participants: { me: { username: 'me', avatar: '🐾', idx: 0, correct: 0, finished: false } } };
    polls++;
    return null;
  };
  const panel = mount(RaceView, { goHome() {}, setView() {}, user: { id: 'me' }, profile: { username: 'me' } });
  t.after(() => { panel.unmount(); restore(); delete globalThis.__raceRpc; });
  await settle(panel);
  await findComponent(panel.tree, 'JoinForm').props.onJoin('ABC123');
  await settle(panel);
  assert.ok(textOf(panel.tree).includes('ABC123'), 'the room lobby opened');
  for (let i = 0; i < 20 && polls < 1; i++) await flush();
  await settle(panel);
  assert.equal(polls, 1, 'the poll ran once');
  const shown = textOf(panel.tree);
  assert.ok(shown.includes(RACE_REFUSALS['Room unavailable']), `the refusal replaces the connection message: ${shown}`);
  assert.doesNotMatch(shown, /การเชื่อมต่อสะดุด/);
  assert.match(source, /if \(state == null\) \{ alive = false; clearInterval\(timer\);/, 'the poll stops instead of retrying forever');
});

test('an old room is an old version, not an old cohort', () => {
  assert.match(source, /ห้องเวอร์ชันเก่าต้องสร้างใหม่/);
  assert.doesNotMatch(source, /ห้องรุ่นเก่า/);
});
