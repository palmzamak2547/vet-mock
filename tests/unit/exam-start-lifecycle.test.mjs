import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';
import { buildExamPool, normalizePracticeMode, appliedCategory, USER_CURATED_MODES } from '../../src/lib/exam-pool.js';

const source = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
const appBody = ast.program.body.find(node => node.type === 'ExportDefaultDeclaration').declaration.body.body;
const declaration = name => appBody.find(node => node.type === 'VariableDeclaration' && node.declarations.some(item => item.id.name === name));
const handler = source.slice(declaration('startExam').start, declaration('startExam').end);
const contextStart = appBody.indexOf(declaration('examStartRequestRef'));
const contextEnd = appBody.indexOf(declaration('confirmReplaceUnfinished'));
const contextCode = contextStart < 0 ? '' : source.slice(appBody[contextStart].start, appBody[contextEnd].start);
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
const q = id => ({ id, subject: 'vca', year: 4, topic: 'fixture', type: 'mcq', q: `Question ${id}`, options: ['A', 'B'], answer: 0 });

// Execute the real handler and request-context hooks; only external effects are fakes.
function harness(initial = {}) {
  const starts = [], alerts = [], writes = [], refs = [], cleanups = [];
  const viewRef = { current: 'config' };
  const eventContextRef = { current: { owner: null, sessionId: 'existing-session' } };
  const defaults = {
    view: 'config', user: null, authLoading: false, examSessionId: 'existing-session',
    selectedYear: 4, selectedPhase: '2-final', mode: 'quick', subject: 'vca', topic: null,
    practiceMode: 'all', questionCategory: 'all', numQuestions: 1, useTimer: false, timePerQ: 60,
    panicPending: false, customQuestions: [], QB: [q(60100), q(60101)], bookmarks: [], history: [], analytics: null,
    viewRef, eventContextRef, finishingRef: { current: true }, sessionRef: { current: null },
    confirmReplaceUnfinished: async () => true, isQBFullyLoaded: () => true, isQBYearLoaded: () => true,
    loadQBForYear: async () => {}, loadQB: async () => {}, offerBankRetry: async () => false,
    confirmDialog: async () => false, alertDialog: message => alerts.push(message),
    buildExamPool, normalizePracticeMode, appliedCategory, USER_CURATED_MODES,
    isQuestionDeliverable: () => true, SUBJECTS: [], shuffle: rows => [...rows], timeForQuestion: () => 0,
    loadQuestionDifficulty: async () => ({}), computeAbility: () => ({}), questionDifficulty: () => 0,
    adaptiveSelect: (rows, { count }) => rows.slice(0, count),
    session: { startNewSession: (...args) => starts.push(args) },
  };
  defaults.sessionRef.current = defaults.session;
  for (const name of ['setPendingResume', 'setSessionKind', 'setChallengeSender', 'setQbReady', 'setQbRevision',
    'setMode', 'setSubject', 'setTopic', 'setPracticeMode', 'setPracticeModeRaw', 'setNumQuestions', 'setUseTimer', 'setTimePerQ']) {
    defaults[name] = value => writes.push([name, value]);
  }
  defaults.setView = next => { writes.push(['setView', next]); viewRef.current = next; };
  let values = { ...defaults, ...initial };
  const render = changes => {
    values = { ...values, ...changes };
    let index = 0;
    const scope = { ...values,
      useRef: initialValue => refs[index++] ||= { current: initialValue },
      useEffect: callback => { const cleanup = callback(); if (cleanup) cleanups.push(cleanup); },
    };
    const start = new Function('scope', `with (scope) { ${contextCode}\n${handler}\nreturn startExam; }`)(scope);
    return start;
  };
  return { starts, alerts, writes, viewRef, eventContextRef, render, unmount: () => cleanups.forEach(cleanup => cleanup()), start: render({}) };
}

test('a delayed bank load cannot replace newer navigation', async () => {
  const bank = deferred();
  const h = harness({ isQBYearLoaded: () => false, loadQBForYear: () => bank.promise });
  const pending = h.start();
  await flush();
  h.viewRef.current = 'notes';
  h.render({ view: 'notes' });
  bank.resolve();
  await pending;
  assert.equal(h.starts.length, 0);
  assert.equal(h.writes.some(([name]) => name === 'setPendingResume'), false);
});

test('the latest exam request wins when older loading completes last', async () => {
  const first = deferred(), second = deferred();
  let calls = 0;
  const h = harness({ isQBYearLoaded: () => false, loadQBForYear: () => (++calls === 1 ? first : second).promise });
  const a = h.start({ numQuestions: 1 });
  await flush();
  const b = h.start({ numQuestions: 2 });
  await flush();
  second.resolve(); await b;
  first.resolve(); await a;
  assert.deepEqual(h.starts.map(([questions]) => questions.length), [2]);
});

for (const kind of ['view', 'owner', 'config', 'session']) test(`${kind} ABA retires the pending exam request`, async () => {
  const bank = deferred();
  const h = harness({ isQBYearLoaded: () => false, loadQBForYear: () => bank.promise });
  const pending = h.start();
  await flush();
  if (kind === 'view') { h.viewRef.current = 'notes'; h.render({ view: 'notes' }); h.viewRef.current = 'config'; h.render({ view: 'config' }); }
  if (kind === 'owner') { h.render({ user: { id: 'other' } }); h.render({ user: null }); }
  if (kind === 'config') { h.render({ numQuestions: 2 }); h.render({ numQuestions: 1 }); }
  if (kind === 'session') { h.render({ examSessionId: 'other' }); h.render({ examSessionId: 'existing-session' }); }
  bank.resolve(); await pending;
  assert.equal(h.starts.length, 0);
});

test('unmount retires a pending request while benign rerenders keep it', async () => {
  const bank = deferred();
  const h = harness({ isQBYearLoaded: () => false, loadQBForYear: () => bank.promise });
  const pending = h.start(); await flush();
  h.render({ qbRevision: 2 });
  bank.resolve(); await pending;
  assert.equal(h.starts.length, 1);
  const slow = deferred();
  const next = h.render({ isQBYearLoaded: () => false, loadQBForYear: () => slow.promise });
  const abandoned = next(); await flush(); h.unmount(); slow.resolve(); await abandoned;
  assert.equal(h.starts.length, 1);
});

test('failed adaptive loading preserves the parked/current set and gives a retryable notice', async () => {
  const h = harness({ practiceMode: 'adaptive', loadQuestionDifficulty: async () => { throw new Error('network'); } });
  await assert.doesNotReject(h.start());
  assert.equal(h.starts.length, 0);
  assert.equal(h.writes.some(([name]) => ['setPendingResume', 'setSessionKind', 'setChallengeSender', 'setView'].includes(name)), false);
  assert.equal(h.alerts.length, 1);
});

test('a late rejected adaptive load stays quiet on the newer screen', async () => {
  const difficulty = deferred();
  const h = harness({ practiceMode: 'adaptive', loadQuestionDifficulty: () => difficulty.promise });
  const pending = h.start(); await flush();
  h.viewRef.current = 'notes'; h.render({ view: 'notes' });
  difficulty.reject(new Error('late network error'));
  await assert.doesNotReject(pending);
  assert.equal(h.starts.length, 0); assert.deepEqual(h.alerts, []);
});

test('replacement confirmation cannot revive a retired launch', async () => {
  const confirm = deferred();
  const h = harness({ confirmReplaceUnfinished: () => confirm.promise });
  const pending = h.start(); await flush();
  h.viewRef.current = 'notes'; h.render({ view: 'notes' });
  confirm.resolve(true); await pending;
  assert.equal(h.starts.length, 0);
});

for (const path of ['scoped', 'full']) test(`${path} bank retry cannot revive a retired launch`, async () => {
  const retry = deferred();
  let loads = 0, prompts = 0;
  const fail = async () => { loads++; throw new Error('offline'); };
  const r = harness({ QB: path === 'full' ? [] : [q(60100)],
    isQBYearLoaded: () => path === 'full', isQBFullyLoaded: () => false,
    loadQBForYear: fail, loadQB: fail,
    offerBankRetry: () => ++prompts === 1 ? retry.promise : Promise.resolve(false),
  });
  const retrying = r.start(); await flush();
  r.viewRef.current = 'notes'; r.render({ view: 'notes' });
  retry.resolve(true);
  await retrying;
  assert.equal(loads, 1);
});

for (const path of ['scoped', 'full']) test(`${path} bank retry still starts the chosen set when intent stays current`, async () => {
  let loads = 0, prompts = 0;
  const bank = path === 'full' ? [] : [q(60100)];
  const load = async () => {
    if (++loads === 1) throw new Error('offline');
    if (!bank.length) bank.push(q(60100));
  };
  const h = harness({ QB: bank, isQBYearLoaded: () => path === 'full', isQBFullyLoaded: () => false,
    loadQBForYear: load, loadQB: load, offerBankRetry: async () => { prompts++; return true; },
  });
  await h.start({ numQuestions: 1 });
  assert.equal(prompts, 1);
  assert.equal(h.starts.length, 1);
  assert.equal(h.starts[0][0][0].id, 60100);
});

test('a declined replacement keeps the current configuration and parked state intact', async () => {
  const h = harness({ confirmReplaceUnfinished: async () => false });
  await h.start({ mode: 'quick', numQuestions: 2, topic: null, useTimer: false });
  assert.deepEqual(h.writes, []);
  assert.deepEqual(h.starts, []);
});
