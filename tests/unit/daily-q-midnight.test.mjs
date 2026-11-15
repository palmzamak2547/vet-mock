// ============================================================
// daily-q-midnight.test.mjs — ข้อวันนี้ keeps its own day across midnight
// ============================================================
// Home's chip picked the day's question once and kept it while Home stayed
// mounted, and the modal filed the answer under the moment it was given. A
// Home page left open overnight (an installed app brought back from the
// background) still showed yesterday's question and its ✓ the next morning,
// and answering it filed yesterday's question as today's: the streak and the
// share grid read the wrong question, today's own question showed no ✓ after
// a reload, and today's class-pulse flag was spent on yesterday's question.
//
// DailyQRow runs from its real source in HomeView.jsx and TodaysQModal from
// its own, both on the fake React runtime, with a clock the test moves. Times
// are Bangkok wall times: the daily question's day is Bangkok's, the streak's
// (lib/study-day.js), so the same midnight holds whatever zone the suite runs in.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from 'esbuild';
import { mount, findAll, textOf, loadModule } from '../helpers/fake-react.mjs';
import { SUBJECTS, SUBJECTS_BY_YEAR } from '../../src/data/curriculum.js';
import {
  pickTodaysQ, readTodaysQStatus, recordTodaysQAnswer, dailyQStreak, todayKey, TODAY_KEY_PREFIX,
} from '../../src/lib/daily-q.js';

// ── A small browser ─────────────────────────────────────────────────────────
const store = new Map();
const storage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => { store.set(k, String(v)); },
  removeItem: (k) => { store.delete(k); },
  key: (i) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
};
const docListeners = new Map();
const intervals = new Map();
let nextTimer = 1;
globalThis.window = {
  localStorage: storage,
  setInterval: (fn) => { const id = nextTimer++; intervals.set(id, fn); return id; },
  clearInterval: (id) => { intervals.delete(id); },
  dispatchEvent: () => true,
};
globalThis.document = {
  visibilityState: 'visible',
  addEventListener: (type, fn) => { if (!docListeners.has(type)) docListeners.set(type, new Set()); docListeners.get(type).add(fn); },
  removeEventListener: (type, fn) => { docListeners.get(type)?.delete(fn); },
};
/** The page comes back into view (a phone unlocked, an app brought back). */
const comeBack = () => { for (const fn of [...(docListeners.get('visibilitychange') || [])]) fn(); };
/** A minute passes on a page that stayed open. */
const minutePasses = () => { for (const fn of [...intervals.values()]) fn(); };

// `new Date()` and Date.now() both read the test's clock.
const RealDate = Date;
let clockNow = 0;
class ClockDate extends RealDate {
  constructor(...args) { if (args.length === 0) super(clockNow); else super(...args); }
  static now() { return clockNow; }
}
const setClock = (bangkok) => { clockNow = new RealDate(`${bangkok}+07:00`).getTime(); };
function useClock(t, local) {
  setClock(local);
  globalThis.Date = ClockDate;
  t.after(() => { globalThis.Date = RealDate; });
}

// ── The two components, from their real source ─────────────────────────────
// The class pulse is observed at the RPC the modal's answer would call.
globalThis.__pulseCalls = [];
const { default: TodaysQModal } = await loadModule('src/components/TodaysQModal.jsx', {
  stubs: [
    { match: 'useModalFocus(\\.js)?$', contents: 'export function useModalFocus() { return { current: null }; }' },
    {
      match: '/supabase(\\.js)?$',
      contents: 'export const hasSupabase = true; export async function getSupabase() { return { rpc: async (name, args) => { globalThis.__pulseCalls.push({ name, args }); return { error: null }; } }; }',
    },
  ],
});

const home = readFileSync(new URL('../../src/views/HomeView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const rowStart = home.indexOf('function DailyQRow(');
assert.ok(rowStart > 0, 'HomeView.jsx defines DailyQRow');
const { code: rowCode } = await transform(home.slice(rowStart, home.indexOf('\n}\n', rowStart) + 2), {
  loader: 'jsx', jsx: 'transform', jsxFactory: 'h', jsxFragment: 'Fragment',
});
const R = globalThis.__fakeReact;
function makeRow(bank) {
  const scope = {
    h: R.createElement, Fragment: R.Fragment, Suspense: R.Suspense,
    useState: R.useState, useMemo: R.useMemo, useEffect: R.useEffect, useCallback: R.useCallback, useRef: R.useRef,
    QB: bank, isQBYearLoaded: () => true, isQuestionDeliverable: () => true,
    pickTodaysQ, readTodaysQStatus, dailyQStreak, todayKey,
    fetchTodaysClassPulse: () => Promise.resolve(null),
    SUBJECTS, NavIcon: 'NavIcon', TodaysQModal: 'TodaysQModal',
  };
  return new Function(...Object.keys(scope), `${rowCode}\nreturn DailyQRow;`)(...Object.values(scope));
}

// ── A year-5 bank whose 8 Nov and 9 Nov questions sit in different subjects ─
// The chip names the subject, so the two days must differ there to be told apart.
const subjects = (SUBJECTS_BY_YEAR[5] || []).filter((s) => s.id !== 'all').map((s) => s.id);
function distinctDays() {
  for (let perSubject = 1; perSubject <= 6; perSubject += 1) {
    const bank = subjects.flatMap((subject, i) => Array.from({ length: perSubject }, (_, k) => ({
      id: 100 + i * 10 + k, subject, topic: 't', type: 'mcq', q: `stem ${i}-${k}`, options: ['a', 'b', 'c', 'd'], answer: 0,
    })));
    const q7 = pickTodaysQ(bank, '2026-11-07', { year: 5 });
    const q8 = pickTodaysQ(bank, '2026-11-08', { year: 5 });
    const q9 = pickTodaysQ(bank, '2026-11-09', { year: 5 });
    if (q7 && q8 && q9 && q8.subject !== q9.subject) return { bank, q7, q8, q9 };
  }
  return null;
}
const days = distinctDays();

// ── Reading the screen ──────────────────────────────────────────────────────
const subjectName = (q) => SUBJECTS.find((s) => s.id === q.subject)?.name || q.subject;
const chip = (inst) => findAll(inst.tree, (n) => n.type === 'button' && textOf(n).startsWith('ข้อวันนี้'))[0];
const chipShows = (inst, q) => textOf(chip(inst)).endsWith(` ${subjectName(q)}`);
const chipDone = (inst) => textOf(chip(inst)).startsWith('ข้อวันนี้ ✓');
const modalProps = (inst) => findAll(inst.tree, (n) => n.type === 'TodaysQModal')[0]?.props;
const answerFirstOption = (modal) => findAll(modal.tree, (n) => n.type === 'button' && n.props.className === 'vmx-option')[0].props.onClick();
const sameQ = (a, b) => `${a?.subject}:${a?.id}` === `${b?.subject}:${b?.id}`;
const dayKeys = () => [...store.keys()].filter((k) => k.startsWith(TODAY_KEY_PREFIX)).sort();
async function pulseSettled() {
  for (let i = 0; i < 10; i += 1) await new Promise((resolve) => setImmediate(resolve));
}
function reset() {
  store.clear();
  docListeners.clear();
  intervals.clear();
  globalThis.__pulseCalls = [];
}

test('the fixture bank gives 8 Nov and 9 Nov questions in different subjects', () => {
  assert.ok(days, 'no year-5 bank of up to six questions a subject separates the two days');
});

test('a Home page left open overnight moves to the new day\'s question, and its answer is filed under that day', async (t) => {
  reset();
  useClock(t, '2026-11-08T23:58:00');
  const { bank, q8, q9 } = days;
  const row = mount(makeRow(bank), { user: null, setView() {}, selectedYear: 5 });
  assert.ok(chipShows(row, q8), 'the evening shows 8 Nov\'s question');

  setClock('2026-11-09T07:30:00'); // the phone was locked overnight; the app comes back
  comeBack();
  row.flush();
  assert.ok(chipShows(row, q9), 'the next morning the chip still showed 8 Nov\'s question');
  assert.equal(chipDone(row), false);

  chip(row).props.onClick();
  row.flush();
  const props = modalProps(row);
  assert.ok(sameQ(props?.q, q9), 'the modal opens on 9 Nov\'s question');
  assert.equal(props.dateStr, '2026-11-09', 'and knows the day it belongs to');
  const modal = mount(TodaysQModal, props);
  answerFirstOption(modal);
  await pulseSettled();
  row.flush();

  assert.deepEqual(dayKeys(), [`${TODAY_KEY_PREFIX}2026-11-09`]);
  assert.equal(readTodaysQStatus('2026-11-09', q9).completed, true, 'today\'s own question is the one answered');
  assert.ok(chipDone(row), 'and the chip shows its ✓');
  assert.equal(globalThis.__pulseCalls.length, 1, 'an answer to today\'s question counts in the class pulse');
});

test('a question opened before midnight and answered after it is filed under the day it was shown', async (t) => {
  reset();
  useClock(t, '2026-11-08T23:59:00');
  const { bank, q7, q8, q9 } = days;
  recordTodaysQAnswer({ qSubject: q7.subject, qId: q7.id, choice: 0, correct: true, dateStr: '2026-11-07' });
  const row = mount(makeRow(bank), { user: null, setView() {}, selectedYear: 5 });
  chip(row).props.onClick();
  row.flush();

  setClock('2026-11-09T00:01:00');
  // Meanwhile another tab answered 9 Nov's question and spent today's pulse.
  recordTodaysQAnswer({ qSubject: q9.subject, qId: q9.id, choice: 1, correct: false, dateStr: '2026-11-09' });
  storage.setItem('vmx-daily-q-pulse-fired-2026-11-09', '1');
  minutePasses();
  row.flush();
  assert.ok(chipShows(row, q9), 'a page that stayed open moves to the new day within the minute');

  const props = modalProps(row);
  assert.ok(sameQ(props?.q, q8), 'the open modal keeps the question the student is reading');
  assert.equal(props.dateStr, '2026-11-08', 'which belongs to the day it was shown');
  const modal = mount(TodaysQModal, props);
  answerFirstOption(modal);
  await pulseSettled();

  assert.equal(readTodaysQStatus('2026-11-08', q8).completed, true, 'filed under 8 Nov');
  assert.ok(sameQ({ subject: readTodaysQStatus('2026-11-09').qSubject, id: readTodaysQStatus('2026-11-09').qId }, q9),
    '9 Nov keeps its own question as the day\'s answer');
  assert.equal(readTodaysQStatus('2026-11-09', q8).completed, false, '8 Nov\'s question is not filed under 9 Nov');
  assert.equal(storage.getItem('vmx-daily-q-pulse-fired-2026-11-09'), '1', 'today\'s pulse flag is kept');
  assert.equal(globalThis.__pulseCalls.length, 0, '8 Nov\'s question is not counted in 9 Nov\'s class pulse');
  assert.equal(dailyQStreak(), 3, '7, 8 and 9 Nov each have their own answer');
});
