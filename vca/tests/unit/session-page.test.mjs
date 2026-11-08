// The session page itself (pages/Session.jsx), run under react-dom against the bank files the
// generator wrote: a mock whose time ran out while the page was closed is graded against the bank
// as it is now, and the answer keys only ever answer the question on screen. One process, so the
// bank starts cold: each test takes its own domain where it needs one nothing has read yet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { at, mount, press, settle, window } from '../support/page.mjs';
import { installBankFetch, readDomain } from '../support/bank-files.mjs';

const net = installBankFetch();
const { BANK } = await import('../../src/lib/bank.js');
const { createSession, sessionStore, resultsStore } = await import('../../src/lib/session.js');
const { progressStore, emptyProgress } = await import('../../src/lib/progress.js');
const { default: Session } = await import('../../src/pages/Session.jsx');

/** Domains by size, largest first: the tests pick by size, never by an id whose size may change. */
const bySize = BANK.domains.slice().sort((a, b) => b.count - a.count);
const keyOf = (q) => `${q.subject}:${q.id}`;
const inOrder = (q) => q.options.map((_, i) => i);
const DAY = 86400e3;

/** A key no index lists: a question held back since the set was made. */
function heldKey(index) {
  const key = 'vca:held-for-recheck';
  assert.equal(index.byKey.has(key), false);
  return key;
}

/**
 * Monday's mock, opened on Wednesday: an hour long, so its time ran out two days ago. Since
 * Monday the bank corrected the key of `fixed` (the set still holds the old one; the student chose
 * the answer that is right now) and held one question back, which was left unanswered.
 */
function expiredMock(card) {
  const { index, questions } = readDomain(card);
  const [fixed, plain] = [questions[0], questions[Math.min(40, questions.length - 1)]];
  const held = heldKey(index);
  const made = Date.now() - 2 * DAY;
  const s = createSession({
    mode: 'mock', now: made, limitSec: 3600,
    items: [
      { key: keyOf(fixed), domain: card.id, order: inOrder(fixed), answer: (fixed.answer + 1) % fixed.options.length },
      { key: held, domain: card.id, order: [0, 1, 2, 3], answer: 0 },
      { key: keyOf(plain), domain: card.id, order: inOrder(plain), answer: plain.answer },
    ],
  });
  s.answers = { [keyOf(fixed)]: { choice: fixed.answer, at: made + 60e3 }, [keyOf(plain)]: { choice: plain.answer, at: made + 120e3 } };
  return { s, fixed, plain, held };
}

async function arrive(t, s) {
  progressStore.set(emptyProgress());
  sessionStore.set(s);
  at('/session');
  await mount(t, Session);
  await settle(() => window.location.pathname !== '/session', 400);
}

function assertGradedAsNow({ s, fixed, plain, held }) {
  assert.equal(window.location.pathname, `/result/${s.id}`, 'handed in on arrival');
  const result = resultsStore.get()[0];
  assert.equal(result.id, s.id);
  assert.deepEqual(result.items.map((it) => it.key), [keyOf(fixed), keyOf(plain)], 'the question held back and left unanswered does not count');
  const graded = result.items[0];
  assert.equal(graded.answer, fixed.answer, 'graded against the corrected key');
  assert.equal(graded.correct, true);
  assert.deepEqual([result.total, result.correct, result.answered], [2, 2, 2]);
  const { q } = progressStore.get();
  assert.equal(q[keyOf(fixed)].l, 1, 'the record says it was answered right');
  assert.equal(q[held], undefined);
  assert.equal(sessionStore.get(), null);
}

test('a mock whose time ran out while the page was closed is graded once its questions are read', async (t) => {
  const card = bySize[0];
  const mock = expiredMock(card);
  net.calls.length = 0;
  await arrive(t, mock.s);
  assert.ok(net.calls.includes(card.index), 'the domain\'s index was read first');
  assertGradedAsNow(mock);
});

test('an expired mock whose questions this visit has read already is graded the same way', async (t) => {
  // The same domain as above: its index and the shards these questions are in are in memory now.
  const mock = expiredMock(bySize[0]);
  net.calls.length = 0;
  await arrive(t, mock.s);
  assert.deepEqual(net.calls, [], 'nothing to fetch: the page opened ready');
  assertGradedAsNow(mock);
});

test('a clock that runs out on screen hands the exam in, graded the same way', async (t) => {
  const mock = expiredMock(bySize[0]);
  // The same set, with a moment left on the clock when the page opens.
  const s = { ...mock.s, deadline: Date.now() + 400 };
  progressStore.set(emptyProgress());
  sessionStore.set(s);
  at('/session');
  await mount(t, Session);
  assert.equal(window.location.pathname, '/session', 'time left: the exam stays open');
  await settle(() => window.location.pathname !== '/session', 400);
  assertGradedAsNow({ ...mock, s });
});

test('a number key does nothing while the questions are still loading', async (t) => {
  const card = bySize[1];
  const { questions } = readDomain(card);
  const s = createSession({ mode: 'practice', items: [questions[0], questions[1]].map((q) => ({ key: keyOf(q), domain: card.id, order: inOrder(q), answer: q.answer })) });
  // The page reloaded mid-set on a slow line: nothing of the bank arrives until the test lets it.
  const fetchFiles = globalThis.fetch;
  let letThrough;
  const line = new Promise((r) => { letThrough = r; });
  globalThis.fetch = async (url) => { await line; return fetchFiles(url); };
  t.after(() => { globalThis.fetch = fetchFiles; });
  progressStore.set(emptyProgress());
  sessionStore.set(s);
  at('/session');
  const { container, unmount } = await mount(t, Session);
  await settle();
  assert.match(container.textContent, /กำลังโหลดข้อสอบ/, 'the skeleton is on screen');
  const first = s.items[0];
  await press('Digit1');
  assert.equal(sessionStore.get().answers[first.key], undefined, 'no answer before the question is shown');
  assert.equal(progressStore.get().q[first.key], undefined, 'and nothing in the record');
  letThrough();
  await settle(() => !/กำลังโหลดข้อสอบ/.test(container.textContent), 400);
  assert.doesNotMatch(container.textContent, /กำลังโหลดข้อสอบ/, 'the question is on screen');
  await press('Digit1');
  assert.equal(sessionStore.get().answers[first.key]?.choice, first.order[0], 'on screen, 1 chooses the first option');
  assert.equal(progressStore.get().q[first.key]?.n, 1);
  await unmount();
  sessionStore.set(null);
});

test('a letter key does not answer a question held back since the set was made', async (t) => {
  // bySize[0] was read by the first test: this set opens ready, on its held question.
  const card = bySize[0];
  const { index, questions } = readDomain(card);
  const held = heldKey(index);
  const real = questions[1];
  for (const mode of ['practice', 'mock']) {
    const s = createSession({
      mode,
      items: [
        { key: held, domain: card.id, order: [0, 1, 2, 3], answer: 3 },
        { key: keyOf(real), domain: card.id, order: inOrder(real), answer: real.answer },
      ],
    });
    progressStore.set(emptyProgress());
    sessionStore.set(s);
    at('/session');
    const { container, unmount } = await mount(t, Session);
    assert.match(container.textContent, /ข้อนี้ไม่นับคะแนน/, `${mode}: the page says this question does not count`);
    await press('KeyA');
    assert.equal(sessionStore.get().answers[held], undefined, `${mode}: A leaves it unanswered`);
    assert.equal(progressStore.get().q[held], undefined, `${mode}: and out of the record`);
    await press('ArrowRight');
    assert.equal(sessionStore.get().cursor, 1, `${mode}: the student moves on`);
    await press('KeyA');
    assert.equal(sessionStore.get().answers[keyOf(real)]?.choice, s.items[1].order[0], `${mode}: A answers the question on screen`);
    await unmount();
    sessionStore.set(null);
  }
});
