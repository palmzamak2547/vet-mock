import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';
import { parseUserBackup } from '../../src/lib/user-data-schema.js';
import { parseLocalExtras, restoreLocalExtras } from '../../src/lib/local-extras.js';
import { addPin, loadPins } from '../../src/lib/pinboard.js';
import { BLOCKED_QUESTIONS, isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { inflightExamKey, readOwnedExam } from '../../src/lib/exam-recovery.js';
import { unfinishedWork } from '../../src/lib/app-flow.js';

// Same actual-callback harness as the work-only discovery proof. Only the
// registry and navigation endpoints are substituted; neither opener is copied.
function callback(file, name, scope) {
  const source = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
  const body = parse(source, { sourceType: 'module', plugins: ['jsx'] }).program.body
    .find(node => node.type === 'ExportDefaultDeclaration').declaration.body.body;
  let expression = body.filter(node => node.type === 'VariableDeclaration').flatMap(node => node.declarations)
    .find(node => node.id.name === name).init;
  if (expression.type === 'CallExpression') expression = expression.arguments[0];
  return new Function(...Object.keys(scope), `return (${source.slice(expression.start, expression.end)});`)(...Object.values(scope));
}
const question = id => ({ id, type: 'tf', subject: 'surg2', year: 4, q: `Imported question ${id}`, answer: true });
const zero = question(0), noteQuestion = question('legacy-note-q');
const backup = parseUserBackup({ customQuestions: [zero, noteQuestion] });
assert.equal(backup.success, true);
const [heldSubject, heldId] = BLOCKED_QUESTIONS[0].key.split(':');
const held = { ...question(Number(heldId)), subject: heldSubject };
assert.equal(isQuestionDeliverable(held), false);

function openers(customQuestions = backup.data.customQuestions, {
  bank = [held], loaded = true, load = async () => {}, replay,
  eventContextRef = { current: { owner: 'account-a' } },
} = {}) {
  const replayed = [], dispatched = [], fallback = [];
  const openQuestion = callback('src/App.jsx', 'openQuestionById', {
    QB: bank, customQuestions, isQuestionDeliverable, isQBFullyLoaded: () => loaded, loadQB: load, eventContextRef,
    replayQuestions: replay ?? (questions => replayed.push(questions.map(q => q.id))),
  });
  const onOpen = callback('src/views/PinboardView.jsx', 'onOpen', {
    onOpenQuestion: id => { dispatched.push(id); return openQuestion(id); },
    setSubject: value => fallback.push(['subject', value]), setTopic: value => fallback.push(['topic', value]),
    setPracticeMode: value => fallback.push(['practiceMode', value]), setView: value => fallback.push(['view', value]),
    alertDialog: () => fallback.push(['alert']),
  });
  return { openQuestion, onOpen, replayed, dispatched, fallback, eventContextRef };
}
function localStorageFixture(t) {
  const values = new Map();
  globalThis.window = { localStorage: {
    getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)),
  }, dispatchEvent() {} };
  t.after(() => { delete globalThis.window; });
}

test('named-question opener accepts numeric/string zero and refuses absent IDs without loading a bank', async () => {
  const state = openers(undefined, { loaded: false, load: async () => assert.fail('no bank load for absent IDs or a known zero') });
  for (const id of [undefined, null, '']) assert.equal(await state.openQuestion(id), false);
  assert.equal(await state.openQuestion(0), true);
  assert.equal(await state.openQuestion('0'), true);
  assert.deepEqual(state.replayed, [[0], [0]]);
});

test('a real stored question pin with ID zero reaches the exact-question opener', async t => {
  localStorageFixture(t);
  const pin = addPin({ type: 'question', payload: { id: zero.id, subject: zero.subject }, label: zero.q });
  assert.ok(pin);
  const state = openers();
  await state.onOpen(loadPins()[0]);
  assert.deepEqual(state.dispatched, [0]);
  assert.deepEqual(state.replayed, [[0]]);
  assert.deepEqual(state.fallback, []);
});

test('a supported restored note pin opens its bare qKey, while an explicit ID takes precedence', async t => {
  localStorageFixture(t);
  const archive = { format: 'vetmock-local-extras-v1', data: { 'vmx-pinboard': [
    { id: 1, type: 'note', label: 'Saved note', payload: { qKey: noteQuestion.id, subject: noteQuestion.subject }, addedAt: 1 },
  ] } };
  assert.equal(parseLocalExtras(archive).success, true);
  assert.equal(restoreLocalExtras(archive).ok, true);
  const state = openers();
  await state.onOpen(loadPins()[0]);
  await state.onOpen({ type: 'note', payload: { id: 0, qKey: noteQuestion.id } });
  assert.deepEqual(state.dispatched, [noteQuestion.id, 0]);
  assert.deepEqual(state.replayed, [[noteQuestion.id], [0]]);
  assert.deepEqual(state.fallback, []);
});

test('held, unknown and prior-owner questions stay refused; a failed bank load can be retried', async () => {
  const ownerA = question('private-a'), ownerB = question('private-b');
  const state = openers([ownerB]); // Current App render after the owner transition.
  for (const id of [held.id, 'missing-question', ownerA.id]) {
    await state.onOpen({ type: 'note', payload: { qKey: id, subject: 'surg2' } });
    assert.equal(await state.openQuestion(id), false);
  }
  assert.deepEqual(state.dispatched, [held.id, 'missing-question', ownerA.id]);
  assert.deepEqual(state.replayed, []);
  assert.deepEqual(state.fallback, Array.from({ length: 3 }, () => [
    ['alert'], ['subject', 'surg2'], ['topic', null], ['practiceMode', 'bookmarks'], ['view', 'config'],
  ]).flat());
  const bank = [];
  let attempts = 0;
  const retry = openers([], { bank, loaded: false, load: async () => {
    if (++attempts === 1) throw new Error('offline');
    bank.push(noteQuestion);
  } });
  const pin = { type: 'note', payload: { qKey: noteQuestion.id } };
  await retry.onOpen(pin);
  assert.deepEqual(retry.replayed, []);
  await retry.onOpen(pin);
  assert.equal(attempts, 2);
  assert.deepEqual(retry.replayed, [[noteQuestion.id]]);
});

test('a replay confirmation consumes the pin request but cannot carry A private questions into B', async t => {
  localStorageFixture(t);
  const privateQuestion = question('private-a');
  const parked = { ownerId: 'account-a', questions: [question('parked-a')], answers: { 0: true } };
  window.localStorage.setItem(inflightExamKey('account-a'), JSON.stringify(parked));
  for (const [switchOwner, accept] of [[true, true], [false, true], [false, false]]) {
    const effects = [], eventContextRef = { current: { owner: 'account-a' } };
    const sessionRef = { current: { replayQuestions: qs => effects.push(['session', 'account-a', qs[0].id]) } };
    const finishingRef = { current: true };
    let answerConfirmation, pendingReplay, confirmations = 0;
    const replay = callback('src/App.jsx', 'replayQuestions', {
      eventContextRef, sessionRef, finishingRef, viewRef: { current: 'pinboard' }, window,
      readOwnedExam, unfinishedWork, confirmDialog: () => {
        confirmations++;
        return new Promise(resolve => { answerConfirmation = resolve; });
      },
      setSessionKind: value => effects.push(['kind', value]), setMode: value => effects.push(['mode', value]),
      setChallengeSender: value => effects.push(['challenge', value]), setUseTimer: value => effects.push(['timer', value]),
      setView: value => effects.push(['view', value]),
    });
    const state = openers([privateQuestion], { eventContextRef, replay: qs => { pendingReplay = replay(qs); } });
    await state.onOpen({ type: 'question', payload: { id: privateQuestion.id } });
    assert.equal(confirmations, 1, 'the actual owner-scoped parked exam requires confirmation');
    assert.deepEqual(state.fallback, [], 'an opened or cancelled exact-question request is consumed');
    if (switchOwner) {
      eventContextRef.current = { owner: 'account-b' };
      sessionRef.current = { replayQuestions: qs => effects.push(['session', 'account-b', qs[0].id]) };
    }
    answerConfirmation(accept);
    await pendingReplay;
    if (switchOwner || !accept) {
      assert.deepEqual(effects, [], 'a cancelled or previous-owner replay has no session/navigation effects');
      assert.equal(finishingRef.current, true);
    } else {
      assert.deepEqual(effects, [['kind', 'normal'], ['challenge', null], ['timer', false],
        ['session', 'account-a', privateQuestion.id], ['view', 'exam']]);
      assert.equal(finishingRef.current, false);
    }
  }
});

for (const outcome of ['found', 'failed']) test(`an account change during ${outcome} bank loading cancels the old pin without B fallback`, async () => {
  const bank = [];
  let settleLoad, loads = 0;
  const state = openers([], { bank, loaded: false, load: () => {
    loads++;
    return new Promise((resolve, reject) => { settleLoad = outcome === 'found' ? resolve : () => reject(new Error('offline')); });
  } });
  const pending = state.onOpen({ type: 'note', payload: { qKey: noteQuestion.id, subject: noteQuestion.subject } });
  assert.equal(loads, 1);
  state.eventContextRef.current = { owner: 'account-b' };
  if (outcome === 'found') bank.push(noteQuestion);
  settleLoad();
  await pending;
  assert.deepEqual(state.replayed, [], 'no session is started from an obsolete owner request');
  assert.deepEqual(state.fallback, [], 'no obsolete request navigates or alerts the next owner');
});
