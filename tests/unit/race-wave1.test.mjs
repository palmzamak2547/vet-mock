// ============================================================
// race-wave1 — what a student is told at the edges of a race
// ============================================================
// Four things the multiplayer audit of 15 Nov 2026 found the race saying
// wrong, each driven through the real RaceView under the fake React runtime:
//
// 1. A guest whose app holds other questions than the room (a release landed
//    after the page loaded) was told "การเชื่อมต่อสะดุด ระบบกำลังลองใหม่"
//    forever, because the poll only passed through refusals. Only a fresh page
//    helps, so the screen says that and offers the reload.
// 2. The exit dialog said the score would be lost. The server keeps every
//    answer, and entering the same code again resumes at the same question,
//    so the dialog says that, and the join box offers the code back.
// 3. A guest in the waiting room was never told what it waits for, and had no
//    word when the host had gone. It now reads "รอเจ้าของห้องกดเริ่ม"; leaving
//    the waiting room calls leave_race (the host's call closes the room), and
//    a room gone before its start reads as closed, with the way back.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, textOf } from '../helpers/fake-react.mjs';
import { questionRevision } from '../../src/lib/study-events.js';
import { resolveRaceQuestions } from '../../src/lib/race-session.js';

const BANK = [1, 2, 3, 4, 5].map((n) => ({
  id: `rw-${n}`, subject: 'com3', type: 'mcq', year: 4,
  q: `คำถามที่ ${n}`, options: ['ก', 'ข', 'ค', 'ง'], answer: 0,
}));
const IDS = BANK.map((q) => q.id);
const VERSIONS = Object.fromEntries(BANK.map((q) => [q.id, questionRevision(q)]));
globalThis.__raceBank = BANK;

const stubs = [
  { match: 'lib/supabase\\.js$', contents: `export const hasSupabase = true;
    export const getSupabase = async () => ({ auth: { getSession: async () => ({ data: { session: { user: { id: 'me' }, access_token: 't' } } }) } });` },
  { match: 'lib/owned-rpc\\.js$', contents: 'export const ownedRpc = (...args) => globalThis.__raceRpc(...args);' },
  { match: 'data/questions\\.js$', contents: 'export const QB = globalThis.__raceBank; export const loadQBForYear = async () => {};' },
  { match: 'data/question-delivery\\.generated\\.js$', contents: 'export const isQuestionDeliverable = () => true;' },
  { match: 'lib/question-surfaces\\.js$', contents: 'export const raceEligibleQuestions = () => [];' },
  { match: 'lib/richtext\\.jsx$', contents: 'export const RichText = ({ text }) => text;' },
  { match: 'components/BackBar\\.jsx$', contents: 'export default function BackBar({ label }) { return label; }' },
  { match: 'components/StatePanel\\.jsx$', contents: 'export default function StatePanel({ title, body, actionLabel }) { return [title, " ", body, " ", actionLabel]; }' },
  { match: 'lib/dialog\\.js$', contents: 'export const confirmDialog = async (opts) => { globalThis.__raceDialogs.push(opts); return false; };' },
];

const { default: RaceView } = await loadModule('src/views/RaceView.jsx', { stubs });

function findComponent(node, name) {
  if (node == null || typeof node !== 'object') return null;
  if (Array.isArray(node)) { for (const n of node) { const hit = findComponent(n, name); if (hit) return hit; } return null; }
  if (typeof node.type === 'function' && node.type.name === name) return node;
  return findComponent(node.props?.children, name);
}

function browserGlobals() {
  const keys = ['window', 'document', 'sessionStorage'];
  const original = new Map(keys.map((key) => [key, globalThis[key]]));
  const store = new Map();
  globalThis.window = Object.assign(new EventTarget(), { location: { reload() { globalThis.__raceReloads += 1; } } });
  globalThis.document = Object.assign(new EventTarget(), { visibilityState: 'visible' });
  globalThis.sessionStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
  };
  globalThis.__raceDialogs = [];
  globalThis.__raceReloads = 0;
  return () => { for (const [key, value] of original) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } };
}

const flush = () => new Promise((r) => setTimeout(r, 0));
const person = (idx = 0) => ({ username: 'x', avatar: '🐾', idx, correct: 0, finished: false });
const lobby = (host) => ({ code: 'ABC123', host_id: host, started_at: null, participants: { me: person(), host: person() } });
const running = (versions, idx = 0) => ({
  code: 'ABC123', host_id: 'host', started_at: '2026-11-15T03:00:00Z', subject: 'com3', year: 4,
  question_ids: IDS, question_versions: versions, participants: { me: person(idx), host: person() },
});

async function openRoom(t, rpc) {
  const restore = browserGlobals();
  globalThis.__raceRpc = rpc;
  const panel = mount(RaceView, { goHome() {}, setView() {}, user: { id: 'me' }, profile: { username: 'me' } });
  t.after(() => { panel.unmount(); restore(); delete globalThis.__raceRpc; });
  await settle(panel);
  await findComponent(panel.tree, 'JoinForm').props.onJoin('ABC123');
  await settle(panel);
  return panel;
}

test('a mismatched question set is marked as a build problem; a missing one first as a slow bank', async () => {
  await assert.rejects(resolveRaceQuestions(running({}), BANK, async () => {}), (e) => e.stale === true);
  await assert.rejects(resolveRaceQuestions({ ...running(VERSIONS), question_ids: [...IDS.slice(0, 4), 'gone'] }, BANK, async () => {}),
    (e) => e.missing === true && !e.stale);
});

test('questions still missing after three polls are another build, and the poll stops', async (t) => {
  let polls = 0;
  const panel = await openRoom(t, async (owner, name) => {
    if (name === 'enter_race') return lobby('host');
    polls++;
    return { ...running(VERSIONS), question_ids: [...IDS.slice(0, 4), 'not-in-this-build'] };
  });
  for (let i = 0; i < 400 && polls < 3; i++) await new Promise((r) => setTimeout(r, 25));
  await settle(panel);
  assert.match(textOf(panel.tree), /แอปในเครื่องนี้ยังเป็นรุ่นเก่า/);
  const stopped = polls;
  await new Promise((r) => setTimeout(r, 2300));
  assert.equal(polls, stopped, 'the poll stopped');
});

test('joining a running room from an older app asks for a reload, never a retry', async (t) => {
  const panel = await openRoom(t, async (owner, name) => (name === 'enter_race' ? running({ 'rw-1': 'old' }) : null));
  const shown = textOf(panel.tree);
  assert.match(shown, /แอปในเครื่องนี้ยังเป็นรุ่นเก่า/, shown);
  assert.doesNotMatch(shown, /การเชื่อมต่อสะดุด|กรุณาลองอีกครั้ง/);
  findComponent(panel.tree, 'StatePanel').props.onAction();
  assert.equal(globalThis.__raceReloads, 1, 'the button reloads the page');
});

test('a room that starts with questions this app lacks stops the poll and asks for a reload', async (t) => {
  let polls = 0;
  const panel = await openRoom(t, async (owner, name) => {
    if (name === 'enter_race') return lobby('host');
    polls++;
    return running({ 'rw-1': 'old' });
  });
  for (let i = 0; i < 20 && polls < 1; i++) await flush();
  await settle(panel);
  const shown = textOf(panel.tree);
  assert.match(shown, /แอปในเครื่องนี้ยังเป็นรุ่นเก่า/, shown);
  assert.match(shown, /โหลดหน้าใหม่/);
  assert.doesNotMatch(shown, /การเชื่อมต่อสะดุด/, 'not the connection message');
  assert.equal(polls, 1, 'the poll stopped: a retry gets the same answer');
});

test('the exit dialog says the answers are kept and how to come back', async (t) => {
  const panel = await openRoom(t, async () => running(VERSIONS, 2));
  assert.match(textOf(panel.tree), /Q3 \/ 5/, 'the race resumed at the question the server holds');
  await findComponent(panel.tree, 'BackBar').props.onBack();
  const [dialog] = globalThis.__raceDialogs;
  assert.ok(dialog, 'leaving asks first');
  assert.match(dialog.body, /ยังเก็บไว้/);
  assert.match(dialog.body, /ABC123/, 'it names the code to type again');
  assert.doesNotMatch(`${dialog.title} ${dialog.body}`, /หาย/, 'nothing is lost');
  assert.notEqual(dialog.tone, 'danger');
  assert.equal(globalThis.sessionStorage.getItem('vmx-race-last-room'), 'ABC123', 'the code is kept for the join box');
});

test('the join box offers the last room back', async (t) => {
  const restore = browserGlobals();
  t.after(restore);
  globalThis.sessionStorage.setItem('vmx-race-last-room', 'ABC123');
  globalThis.__raceRpc = async () => null;
  const panel = mount(RaceView, { goHome() {}, setView() {}, user: { id: 'me' }, profile: { username: 'me' } });
  t.after(() => { panel.unmount(); delete globalThis.__raceRpc; });
  await settle(panel);
  assert.equal(findComponent(panel.tree, 'JoinForm').props.initial, 'ABC123');
});

test('a guest is told the room waits for its host, and leaving gives the seat back', async (t) => {
  const calls = [];
  const panel = await openRoom(t, async (owner, name, args) => { calls.push([name, args]); return name === 'leave_race' ? null : lobby('host'); });
  assert.match(textOf(panel.tree), /รอเจ้าของห้องกดเริ่ม/);
  const back = findComponent(panel.tree, 'BackBar');
  assert.equal(back.props.label, 'ออกจากห้อง');
  back.props.onBack();
  await settle(panel);
  assert.deepEqual(calls.filter(([name]) => name === 'leave_race'), [['leave_race', { p_code: 'ABC123' }]]);
  assert.ok(findComponent(panel.tree, 'JoinForm'), 'back at the lobby');
});

test('the host closing the waiting room calls leave_race, and does not see the guest line', async (t) => {
  const calls = [];
  const panel = await openRoom(t, async (owner, name, args) => { calls.push([name, args]); return name === 'leave_race' ? null : { ...lobby('me') }; });
  assert.doesNotMatch(textOf(panel.tree), /รอเจ้าของห้องกดเริ่ม/);
  const back = findComponent(panel.tree, 'BackBar');
  assert.equal(back.props.label, 'ปิดห้อง');
  back.props.onBack();
  await settle(panel);
  assert.ok(calls.some(([name]) => name === 'leave_race'));
});

test('a room closed before its start tells the guest and offers the way back', async (t) => {
  let polls = 0;
  const panel = await openRoom(t, async (owner, name) => {
    if (name === 'enter_race') return lobby('host');
    polls++;
    throw Object.assign(new Error('ไม่พบห้องนี้'), { refused: true, serverMessage: 'Room unavailable' });
  });
  for (let i = 0; i < 20 && polls < 1; i++) await flush();
  await settle(panel);
  const shown = textOf(panel.tree);
  assert.match(shown, /ห้อง ABC123 ปิดแล้ว/, shown);
  assert.match(shown, /เจ้าของห้องออกไป/);
  findComponent(panel.tree, 'StatePanel').props.onAction();
  await settle(panel);
  assert.ok(findComponent(panel.tree, 'JoinForm'), 'the way back is the lobby');
  assert.equal(findComponent(panel.tree, 'JoinForm').props.initial, '', 'the closed room is not offered again');
});
