// ============================================================
// exam-clock.test.mjs — the clock on a timed set
// ============================================================
// Two layers. The first pins secondsUntilDeadline, the one rule every part
// of the clock reads: time left is the deadline minus the wall clock, never a
// count of callbacks, so a throttled or suspended tab loses nothing.
//
// The second runs the clock at its real seam: useExamSession under the real
// React DOM, inside a stand-in for App that calls the hook the way App does
// and renders the real ExamView. The clock used to be App state that changed
// once a second, so the whole app, ExamView and the question card re-rendered
// every second of a timed set, competing with an essay being typed on a slow
// phone. Now the countdown ticks inside the clock on screen and the app
// renders once when time is up. Everything a student can observe is pinned
// alongside it: the countdown itself, its warning colour, advancing or
// finishing at the deadline, catching up after a hidden tab, a page restored
// from the back-forward cache or a device that slept, resuming a saved set,
// and that every answer is still there when time runs out.
//
// The question card and the classmates-on-this-question count are stand-ins
// (the card counts its renders; the count needs Supabase). Timers and
// Date.now in the bundled source run on a clock the test owns; React keeps
// the real ones.
// ============================================================

import assert from 'node:assert/strict';
import test, { after, before } from 'node:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { secondsUntilDeadline } from '../../src/lib/exam-clock.js';

test('a suspended tab consumes elapsed time even when its timer did not run', () => {
  const deadline = 100_000 + 60_000;
  assert.equal(secondsUntilDeadline(deadline, 100_000), 60);
  assert.equal(secondsUntilDeadline(deadline, 141_000), 19);
  assert.equal(secondsUntilDeadline(deadline, 160_000), 0);
  assert.equal(secondsUntilDeadline(deadline, 200_000), 0);
});

test('a restored deadline preserves fractions of the remaining second', () => {
  assert.equal(secondsUntilDeadline(160_000, 159_999), 1);
  for (const invalid of [null, undefined, NaN, Infinity, -1]) {
    assert.equal(secondsUntilDeadline(invalid, 100_000), 0);
  }
});

// ─────────────────────────────────────────────────────────────
// A clock the test owns. Two times, because a device keeps two: the wall
// clock Date.now() reads, and the one timers are scheduled on. A closed lid
// or a locked phone moves the first and, on most systems, not the second, so
// a timeout armed for the deadline wakes up late by however long the device
// slept. advance() moves both and fires what falls due, in order, each inside
// act(); sleep() moves only the wall clock.
// ─────────────────────────────────────────────────────────────
const clock = {
  wall: 1_700_000_000_000,
  mono: 0,
  seq: 0,
  timers: new Map(),
  now: () => clock.wall,
  setTimeout: (fn, ms = 0, ...args) => {
    const id = ++clock.seq;
    clock.timers.set(id, { at: clock.mono + Math.max(0, Number(ms) || 0), fn, args, every: 0 });
    return id;
  },
  setInterval: (fn, ms = 0, ...args) => {
    const id = ++clock.seq;
    const every = Math.max(1, Number(ms) || 0);
    clock.timers.set(id, { at: clock.mono + every, fn, args, every });
    return id;
  },
  clearTimeout: (id) => { clock.timers.delete(id); },
  clearInterval: (id) => { clock.timers.delete(id); },
};
globalThis.__examTestClock = clock;

function advance(ms) {
  const end = clock.mono + ms;
  for (;;) {
    let next = null;
    for (const [id, t] of clock.timers) {
      if (t.at > end) continue;
      if (!next || t.at < next[1].at || (t.at === next[1].at && id < next[0])) next = [id, t];
    }
    if (!next) break;
    const [id, t] = next;
    clock.wall += t.at - clock.mono;
    clock.mono = t.at;
    if (t.every) t.at += t.every; else clock.timers.delete(id);
    mod.act(() => { t.fn(...t.args); });
  }
  clock.wall += end - clock.mono;
  clock.mono = end;
}
const sleep = (ms) => { clock.wall += ms; };

// ─────────────────────────────────────────────────────────────
// A document just large enough for React DOM, with real listeners on the
// document and the window: the clock listens for visibilitychange and
// pageshow there.
// ─────────────────────────────────────────────────────────────
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const DOCUMENT_NODE = 9;
const HTML_NS = 'http://www.w3.org/1999/xhtml';

class Listeners {
  constructor() { this.map = new Map(); }
  add(type, fn) { if (!this.map.has(type)) this.map.set(type, new Set()); this.map.get(type).add(fn); }
  remove(type, fn) { this.map.get(type)?.delete(fn); }
  fire(type, props = {}) { for (const fn of [...(this.map.get(type) || [])]) fn({ type, ...props }); }
  count(type) { return this.map.get(type)?.size || 0; }
}

class FakeNode {
  constructor(nodeType, nodeName, ownerDocument) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.childNodes = [];
  }
  get firstChild() { return this.childNodes[0] ?? null; }
  get lastChild() { return this.childNodes[this.childNodes.length - 1] ?? null; }
  get nextSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.childNodes;
    return siblings[siblings.indexOf(this) + 1] ?? null;
  }
  appendChild(child) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.childNodes.push(child);
    return child;
  }
  insertBefore(child, ref) {
    if (!ref) return this.appendChild(child);
    if (child.parentNode) child.parentNode.removeChild(child);
    this.childNodes.splice(this.childNodes.indexOf(ref), 0, child);
    child.parentNode = this;
    return child;
  }
  removeChild(child) {
    const at = this.childNodes.indexOf(child);
    if (at < 0) throw new Error('removeChild: node is not a child');
    this.childNodes.splice(at, 1);
    child.parentNode = null;
    return child;
  }
  addEventListener() {}
  removeEventListener() {}
  get textContent() { return this.childNodes.map((c) => c.textContent).join(''); }
  set textContent(value) {
    for (const c of this.childNodes) c.parentNode = null;
    this.childNodes = [];
    if (value !== '' && value != null) this.appendChild(this.ownerDocument.createTextNode(String(value)));
  }
}
class FakeText extends FakeNode {
  constructor(text, ownerDocument) { super(TEXT_NODE, '#text', ownerDocument); this.nodeValue = text; }
  get textContent() { return this.nodeValue; }
  set textContent(value) { this.nodeValue = String(value); }
}
class FakeStyle {
  setProperty(name, value) { this[name] = value; }
  removeProperty(name) { delete this[name]; }
}
class FakeElement extends FakeNode {
  constructor(tagName, ownerDocument, namespaceURI = HTML_NS) {
    super(ELEMENT_NODE, tagName.toUpperCase(), ownerDocument);
    this.tagName = tagName.toUpperCase();
    this.namespaceURI = namespaceURI;
    this.attributes = new Map();
    this.style = new FakeStyle();
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  hasAttribute(name) { return this.attributes.has(name); }
  removeAttribute(name) { this.attributes.delete(name); }
}
class FakeDocument extends FakeNode {
  constructor() {
    super(DOCUMENT_NODE, '#document', null);
    this.ownerDocument = null;
    this.documentElement = new FakeElement('html', this);
    this.body = new FakeElement('body', this);
    this.documentElement.appendChild(this.body);
    this.activeElement = null;
    this.visibilityState = 'visible';
    this.listeners = new Listeners();
  }
  createElement(tag) { return new FakeElement(tag, this); }
  createElementNS(ns, tag) { return new FakeElement(tag, this, ns); }
  createTextNode(text) { return new FakeText(text, this); }
  addEventListener(type, fn) { this.listeners.add(type, fn); }
  removeEventListener(type, fn) { this.listeners.remove(type, fn); }
}

function findAll(root, predicate, out = []) {
  if (root.nodeType === ELEMENT_NODE && predicate(root)) out.push(root);
  for (const child of root.childNodes) findAll(child, predicate, out);
  return out;
}

// ─────────────────────────────────────────────────────────────
// Bundle the hook and ExamView from the source that ships. React stays
// external (bundled, its act() cannot reach Node's timers). Timers and
// Date.now in the bundled source are routed to the test's clock.
// ─────────────────────────────────────────────────────────────
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);
const EXAM_VIEW_SOURCE = readFileSync(join(repoRoot, 'src/views/ExamView.jsx'), 'utf8');

let tmp;
let mod;
let document;
let fakeWindow;
const consoleErrors = [];
const originalConsoleError = console.error;

before(async () => {
  document = new FakeDocument();
  const windowListeners = new Listeners();
  const store = new Map();
  class HTMLIFrameElement {}
  fakeWindow = {
    document,
    HTMLIFrameElement,
    listeners: windowListeners,
    addEventListener: (type, fn) => windowListeners.add(type, fn),
    removeEventListener: (type, fn) => windowListeners.remove(type, fn),
    location: { protocol: 'file:' },
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => { store.set(k, String(v)); },
      removeItem: (k) => { store.delete(k); },
    },
  };
  globalThis.window = fakeWindow;
  globalThis.document = document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  console.error = (...args) => { consoleErrors.push(args.map(String).join(' ')); };

  const harness = {
    name: 'exam-clock-harness',
    setup(b) {
      b.onResolve({ filter: /^react(-dom)?(\/.*)?$/ }, (args) => ({
        path: pathToFileURL(require.resolve(args.path)).href,
        external: true,
      }));
      // Count ExamView's own renders at the top of its body.
      b.onLoad({ filter: /[\\/]src[\\/]views[\\/]ExamView\.jsx$/ }, () => {
        const entry = /export default function ExamView\(\{[^}]*\}\) \{/g;
        const hits = EXAM_VIEW_SOURCE.match(entry) || [];
        if (hits.length !== 1) throw new Error(`expected one ExamView signature, found ${hits.length}`);
        return {
          contents: EXAM_VIEW_SOURCE.replace(entry, (m) => `${m} globalThis.__examViewRenders = (globalThis.__examViewRenders || 0) + 1;`),
          loader: 'jsx',
        };
      });
      b.onResolve({ filter: /components[\\/]Question\.jsx$/ }, () => ({ path: 'question', namespace: 'stub' }));
      b.onResolve({ filter: /hooks[\\/]useStudyBuddies\.js$/ }, () => ({ path: 'buddies', namespace: 'stub' }));
      b.onLoad({ filter: /^question$/, namespace: 'stub' }, () => ({
        contents: [
          'export default function QuestionComponent({ currentQ }) {',
          '  globalThis.__questionRenders = (globalThis.__questionRenders || 0) + 1;',
          '  return <div className="q-stub">{currentQ.q}</div>;',
          '}',
        ].join('\n'),
        loader: 'jsx',
        resolveDir: repoRoot,
      }));
      b.onLoad({ filter: /^buddies$/, namespace: 'stub' }, () => ({
        contents: 'export function useBuddyCountOnQ() { return 0; }',
        loader: 'js',
      }));
    },
  };

  const result = await build({
    stdin: {
      contents: [
        "export { useExamSession } from './src/hooks/useExamSession.js';",
        "export { default as ExamView } from './src/views/ExamView.jsx';",
        "export { act, createElement, useCallback, useRef, useState } from 'react';",
        "export { createRoot } from 'react-dom/client';",
      ].join('\n'),
      resolveDir: repoRoot,
      loader: 'js',
    },
    bundle: true,
    format: 'esm',
    platform: 'browser',
    jsx: 'automatic',
    loader: { '.js': 'jsx', '.jsx': 'jsx' },
    define: {
      setTimeout: 'globalThis.__examTestClock.setTimeout',
      clearTimeout: 'globalThis.__examTestClock.clearTimeout',
      setInterval: 'globalThis.__examTestClock.setInterval',
      clearInterval: 'globalThis.__examTestClock.clearInterval',
      'Date.now': 'globalThis.__examTestClock.now',
    },
    plugins: [harness],
    write: false,
    logLevel: 'silent',
  });
  tmp = mkdtempSync(join(tmpdir(), 'exam-clock-'));
  const file = join(tmp, 'exam-clock.bundle.mjs');
  writeFileSync(file, result.outputFiles[0].text);
  mod = await import(pathToFileURL(file).href);
});

after(() => {
  console.error = originalConsoleError;
  if (tmp) rmSync(tmp, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────
// App, reduced to what the clock touches: it owns `view`, builds the hook
// with the same arguments, keeps finishExam behind a ref that reads this
// render's session, and renders ExamView with the props App passes (the
// handlers are fresh functions every render, as they are in App).
// ─────────────────────────────────────────────────────────────
const probe = {};
const renders = () => ({
  app: probe.appRenders,
  examView: globalThis.__examViewRenders || 0,
  question: globalThis.__questionRenders || 0,
});

function Host({ useTimer, sessionBudget, timePerQ }) {
  const { createElement: h, useState, useRef, useCallback } = mod;
  probe.appRenders += 1;
  const [view, setView] = useState('home');
  const finishExamRef = useRef(null);
  const session = mod.useExamSession({
    ownerId: null,
    view, useTimer, timePerQ,
    sessionBudget,
    onFinish: useCallback(() => finishExamRef.current?.(), []),
  });
  finishExamRef.current = () => {
    probe.finished.push({ answers: { ...session.answers }, currentIdx: session.currentIdx, wall: clock.wall });
    setView('results');
  };
  probe.session = session;
  probe.view = view;
  probe.setView = setView;
  if (view !== 'exam' || !session.currentQ) return null;
  return h(mod.ExamView, {
    currentQ: session.currentQ,
    currentIdx: session.currentIdx,
    questions: session.questions,
    questionDeadline: session.questionDeadline,
    useTimer,
    isBookmarked: false,
    toggleBookmark: () => {},
    currentAnswer: session.currentAnswer,
    answerCurrent: session.answerCurrent,
    nextQ: session.nextQ,
    prevQ: session.prevQ,
    jumpToQ: session.jumpToQ,
    notes: {},
    setNote: () => {},
    answers: session.answers,
    bookmarks: [],
    user: null,
    goHome: () => {},
    selectedYear: 5,
    selectedPhase: null,
    mode: sessionBudget ? 'exam' : 'quick',
    instantFeedback: false,
    onOpenWiki: () => {},
  });
}

async function mount(t, { useTimer = true, sessionBudget = true, timePerQ = 60 } = {}) {
  probe.appRenders = 0;
  probe.finished = [];
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = mod.createRoot(container);
  mod.act(() => { root.render(mod.createElement(Host, { useTimer, sessionBudget, timePerQ })); });
  t.after(() => {
    mod.act(() => { root.unmount(); });
    document.body.removeChild(container);
    clock.timers.clear();
    document.visibilityState = 'visible';
  });
  const timer = () => {
    const hits = findAll(container, (n) => /^vmx-timer\b/.test(n.getAttribute('class') || ''));
    return hits.length ? { text: hits[0].textContent, cls: hits[0].getAttribute('class') } : null;
  };
  return { container, timer };
}

const mcq = (id) => ({ id, subject: 'swine-clinic', topic: 'audit', type: 'mcq', q: `ข้อ ${id}`, options: ['ก', 'ข', 'ค'], answer: 1 });
const shortQ = (id) => ({ id, subject: 'swine-clinic', topic: 'audit', type: 'short', q: `ข้อเขียน ${id}`, answer: 'x' });

// App.startExam: startNewSession with the first question's allowance, then
// the view, in one handler.
function start(questions, firstTime, sessionBudget) {
  mod.act(() => {
    probe.session.startNewSession(questions, firstTime, { sessionBudget });
    probe.setView('exam');
  });
}
const left = () => probe.session.questionDeadline - clock.wall;

// ─────────────────────────────────────────────────────────────
// PF-02: the regression
// ─────────────────────────────────────────────────────────────

test('a timed paper left alone for 30 seconds does not re-render the app every second', async (t) => {
  const view = await mount(t);
  start(Array.from({ length: 20 }, (_, i) => mcq(9100 + i)), 60, true);
  assert.equal(view.timer()?.text, '20:00');
  const before = renders();
  advance(30_000);
  const after = renders();
  assert.ok(after.app - before.app <= 2,
    `App rendered ${after.app - before.app} times in 30 idle seconds; the clock should not live in App state`);
  assert.ok(after.examView - before.examView <= 2,
    `ExamView rendered ${after.examView - before.examView} times in 30 idle seconds`);
  assert.ok(after.question - before.question <= 2,
    `the question card rendered ${after.question - before.question} times in 30 idle seconds`);
  // The student still watches it count down, a second at a time.
  assert.equal(view.timer()?.text, '19:30');
  advance(1_000);
  assert.equal(view.timer()?.text, '19:29');
  assert.equal(probe.finished.length, 0);
});

// ─────────────────────────────────────────────────────────────
// What the student sees and keeps, unchanged
// ─────────────────────────────────────────────────────────────

test('time up on the paper clock ends the paper where the student stands, once, with every answer kept', async (t) => {
  await mount(t);
  start([mcq(9201), mcq(9202), mcq(9203)], 60, true);
  const deadline = probe.session.questionDeadline;
  mod.act(() => { probe.session.answerCurrent(2); });
  advance(10_500);
  mod.act(() => { probe.session.nextQ(); });
  mod.act(() => { probe.session.answerCurrent(0); });
  assert.equal(probe.session.questionDeadline, deadline, 'moving to the next question refilled the paper clock');
  mod.act(() => { probe.session.prevQ(); });
  mod.act(() => { probe.session.jumpToQ(1); });
  assert.equal(probe.session.questionDeadline, deadline, 'moving back refilled the paper clock');

  advance(left() - 1);
  assert.equal(probe.finished.length, 0, 'the paper ended before its deadline');
  advance(1_000);
  assert.equal(probe.finished.length, 1, 'time up must end the paper exactly once');
  assert.deepEqual(probe.finished[0].answers, { 9201: 2, 9202: 0 }, 'an answer was lost when time ran out');
  assert.equal(probe.finished[0].currentIdx, 1, 'time up on the paper clock does not carry the student on');
  assert.equal(probe.view, 'results');
  advance(10_000);
  assert.equal(probe.finished.length, 1);
});

test('the per-question clock carries the student on with a fresh allowance, then finishes on the last', async (t) => {
  const view = await mount(t, { sessionBudget: false });
  start([mcq(9301), mcq(9302), mcq(9303)], 60, false);
  assert.equal(view.timer()?.text, '01:00');
  mod.act(() => { probe.session.answerCurrent(1); });
  for (const idx of [0, 1]) {
    advance(left() - 1);
    assert.equal(probe.session.currentIdx, idx, 'moved on before the question\'s time was up');
    advance(1_000);
    assert.equal(probe.session.currentIdx, idx + 1, 'did not move on when the question\'s time was up');
    assert.equal(view.timer()?.text, '01:00', 'the next question starts with its own full minute');
  }
  mod.act(() => { probe.session.answerCurrent(2); });
  assert.equal(probe.finished.length, 0);
  advance(left() - 1);
  assert.equal(probe.finished.length, 0);
  advance(1_000);
  assert.equal(probe.finished.length, 1, 'time up on the last question finishes the set once');
  assert.deepEqual(probe.finished[0].answers, { 9301: 1, 9303: 2 });
});

test('a tab that comes back after the deadline ends the paper at once', async (t) => {
  await mount(t);
  start([mcq(9401), mcq(9402)], 60, true);
  mod.act(() => { probe.session.answerCurrent(1); });
  document.visibilityState = 'hidden';
  mod.act(() => { document.listeners.fire('visibilitychange'); });
  // Hidden: the browser throttles or suspends the page's timers entirely.
  sleep(5 * 60_000);
  assert.equal(probe.finished.length, 0);
  document.visibilityState = 'visible';
  mod.act(() => { document.listeners.fire('visibilitychange'); });
  assert.equal(probe.finished.length, 1, 'coming back to the tab must settle the clock without waiting for a timer');
  assert.deepEqual(probe.finished[0].answers, { 9401: 1 });
});

test('a page restored from the back-forward cache after the deadline ends the paper at once', async (t) => {
  await mount(t);
  start([mcq(9501), mcq(9502)], 60, true);
  sleep(5 * 60_000);
  mod.act(() => { fakeWindow.listeners.fire('pageshow', { persisted: true }); });
  assert.equal(probe.finished.length, 1);
});

test('the per-question clock catches up one question when the tab comes back', async (t) => {
  const view = await mount(t, { sessionBudget: false });
  start([mcq(9601), mcq(9602), mcq(9603)], 60, false);
  sleep(5 * 60_000);
  mod.act(() => { document.listeners.fire('visibilitychange'); });
  assert.equal(probe.session.currentIdx, 1);
  assert.equal(view.timer()?.text, '01:00');
  assert.equal(probe.finished.length, 0);
});

test('a device that slept past the deadline with no event at all still ends the paper within a second of waking', async (t) => {
  // A timeout armed for the deadline is scheduled on the clock that stood
  // still while the device slept, so it would fire minutes late. The clock
  // has to keep reading the wall clock at least once a second.
  await mount(t);
  start([mcq(9701), mcq(9702)], 60, true);
  advance(3_000);
  sleep(10 * 60_000);
  advance(1_000);
  assert.equal(probe.finished.length, 1);
});

test('a resumed set keeps its deadline, and one whose deadline passed while closed ends on entry', async (t) => {
  const view = await mount(t);
  const saved = (deadlineIn) => ({
    ownerId: null, questions: [mcq(9801), mcq(9802)], answers: { 9801: 2 }, currentIdx: 1,
    questionDeadline: clock.wall + deadlineIn, examStartTime: clock.wall - 60_000, clock: 'session',
  });
  mod.act(() => {
    assert.equal(probe.session.primeFromSaved(saved(25_400)), true);
    probe.setView('exam');
  });
  assert.equal(view.timer()?.text, '00:26');
  advance(25_399);
  assert.equal(probe.finished.length, 0);
  advance(1_000);
  assert.equal(probe.finished.length, 1);
  assert.deepEqual(probe.finished[0].answers, { 9801: 2 });

  mod.act(() => {
    assert.equal(probe.session.primeFromSaved(saved(-5_000)), true);
    probe.setView('exam');
  });
  assert.equal(probe.finished.length, 2, 'a deadline that passed while the app was closed ends the set on entry');
});

test('the clock turns to its warning colour at ten seconds, and at a minute on written questions', async (t) => {
  const view = await mount(t);
  start([mcq(9901)], 60, true);
  advance(49_000);
  assert.deepEqual(view.timer(), { text: '00:11', cls: 'vmx-timer ' });
  advance(1_000);
  assert.deepEqual(view.timer(), { text: '00:10', cls: 'vmx-timer warn' });
  advance(10_000);
  assert.equal(probe.finished.length, 1);
});

test('a written question warns from its last minute', async (t) => {
  const view = await mount(t, { sessionBudget: false });
  start([shortQ(9951), mcq(9952)], 180, false);
  assert.deepEqual(view.timer(), { text: '03:00', cls: 'vmx-timer ' });
  advance(119_000);
  assert.deepEqual(view.timer(), { text: '01:01', cls: 'vmx-timer ' });
  advance(1_000);
  assert.deepEqual(view.timer(), { text: '01:00', cls: 'vmx-timer warn' });
});

test('an untimed set never ends itself and never re-renders the app on its own', async (t) => {
  const view = await mount(t, { useTimer: false });
  start([mcq(9991)], 0, false);
  assert.equal(view.timer(), null);
  const before = renders().app;
  advance(10 * 60_000);
  sleep(60 * 60_000);
  mod.act(() => { document.listeners.fire('visibilitychange'); });
  assert.equal(renders().app, before);
  assert.equal(probe.finished.length, 0);
});

test('leaving the set stops every clock listener', async (t) => {
  await mount(t);
  start([mcq(9993), mcq(9994)], 60, true);
  mod.act(() => { probe.setView('home'); });
  advance(5 * 60_000);
  assert.equal(probe.finished.length, 0, 'a set the student left must not finish itself in the background');
  assert.equal(fakeWindow.listeners.count('pageshow'), 0, 'a pageshow listener outlived the exam view');
});

// React's development build reports updates outside act() and prop mistakes
// through console.error. None of them may appear.
test('the clock runs without a single React warning', () => {
  assert.deepEqual(consoleErrors, []);
});
