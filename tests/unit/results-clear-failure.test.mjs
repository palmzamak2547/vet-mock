// ============================================================
// Results: a failed clear of the finished set is counted, and the
// results still show
// ============================================================
// O-284. Once the results were saved, ResultsView removed the parked copy of
// the set with clearCompletedExam inside an empty catch, so a browser that
// refused the removal left no trace anywhere. The copy that stays is never
// offered back (App reads a saved, submitted set as finished work), so the
// student has nothing to do and is shown nothing; the failure is counted
// through reportFailure for the owner, and the page renders as before.
//
// Driven through the real ResultsView (fake-react harness).
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fr from '../helpers/fake-react.mjs';
import { FAILURE_EVENT } from '../../src/lib/report-failure.js';
import { inflightExamKey } from '../../src/lib/exam-recovery.js';

const nothing = 'export default function Stub() { return null; }';
const stubs = [
  ...['BackBar', 'ExamSaveNotice', 'DigitRoll', 'ScoreBurst', 'MochiLive', 'StreakMoment', 'ShareCardSheet', 'WeakSpots', 'NavIcon', 'LadderStrip']
    .map((name) => ({ match: `/${name}\\.jsx$`, contents: nothing })),
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ preferences: { mode: "auto", companion: true, haptics: false }, reduced: true });' },
  { match: '/lib/haptics\\.js$', contents: 'export const haptic = () => false;' },
];
const { default: ResultsView } = await fr.loadModule('src/views/ResultsView.jsx', { stubs });

const OWNER = 'user-1';
const SESSION = 'session-1';

function browser({ refuseRemove }) {
  const store = new Map();
  store.set(inflightExamKey(OWNER), JSON.stringify({
    ownerId: OWNER, sessionId: SESSION, submitted: true, localSaved: true, detailsSaved: true,
    questions: [{ id: 1, subject: 'com3' }], answers: {},
  }));
  const storage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => {
      if (refuseRemove) { const e = new Error('The operation is insecure.'); e.name = 'SecurityError'; throw e; }
      store.delete(k);
    },
    key: () => null,
    length: 0,
  };
  const failures = [];
  const win = Object.assign(new EventTarget(), {
    localStorage: storage, sessionStorage: storage,
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    location: { href: 'https://vetmock.com/app/results', origin: 'https://vetmock.com', pathname: '/app/results', search: '', hash: '' },
    scrollTo() {}, requestAnimationFrame: (f) => setTimeout(f, 0), cancelAnimationFrame: (id) => clearTimeout(id),
  });
  win.addEventListener(FAILURE_EVENT, (e) => failures.push(e.detail));
  globalThis.window = win;
  globalThis.localStorage = storage;
  globalThis.sessionStorage = storage;
  globalThis.document = { body: {}, head: { appendChild() {} }, activeElement: null, querySelector: () => null, createElement: () => ({}), addEventListener() {}, removeEventListener() {} };
  return { store, failures };
}

// The page drew its score seal (found by class, without expanding child components).
function scoreShown(tree) {
  let hit = false;
  const go = (n) => {
    if (hit || n == null || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(go); return; }
    if (String(n.props?.className || '').includes('vmx-results-seal-wrapper')) { hit = true; return; }
    go(n.props?.children);
  };
  go(tree);
  return hit;
}

function show() {
  return fr.mount(ResultsView, {
    saveStatus: { committed: true, owner: OWNER, sessionId: SESSION },
    score: { correct: 1, total: 1, pct: 100 },
    questions: [{ id: 1, subject: 'com3', type: 'mcq', q: 'ข้อ', options: ['ก', 'ข'], answer: 0 }],
    answers: { 0: 0 },
    goHome: () => {}, setView: () => {}, mode: 'practice',
    examStartTime: 1, completedAt: 61_001,
  });
}

test('a clear that works removes the parked copy and counts nothing', () => {
  const env = browser({ refuseRemove: false });
  const inst = show();
  assert.equal(scoreShown(inst.tree), true, 'the results render with their score');
  assert.equal(env.store.has(inflightExamKey(OWNER)), false, 'the parked copy is gone');
  assert.deepEqual(env.failures, []);
  inst.unmount();
});

test('a clear the browser refuses is counted, and the results still render', () => {
  const env = browser({ refuseRemove: true });
  const inst = show();
  assert.equal(scoreShown(inst.tree), true, 'the results render with their score');
  assert.deepEqual(env.failures.map((f) => [f.kind, f.name]), [['save', 'SecurityError']]);
  inst.unmount();
});
