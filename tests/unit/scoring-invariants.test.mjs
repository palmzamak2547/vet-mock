// A score can never be wrong: invariants over generated papers and answer sheets.
//
// The code under test, all of it the real code:
//   marking      isCorrect / isAnswered / answerOutcome (src/hooks/utils.js), every question type
//   totalling    App.jsx's count, `autoQs = questions.filter(!isWritingType)` then
//                `autoQs.filter(isCorrect).length`, in the score memo and in finishExam; it is inline
//                there, so it is modelled here as clientTotal and pinned to App.jsx's text below
//   shuffling    getShuffledOptions (src/lib/option-shuffle.js), a new session seed per module copy
//   answering    useExamSession's answerCurrent / jumpToQ / primeFromSaved (src/hooks/useExamSession.js)
//   resuming     the in-flight record App writes, read back by readOwnedExam (src/lib/exam-recovery.js)
//   the server   scoreSubmission (api/_lib/exam-scoring.js), fed the body finishExam builds
//
// Every expected count comes from `oracle` below, written from what each type means, not from the
// app's code. The generator is a seeded PRNG, so a failure names its seed and case and replays.
// If an invariant ever fails on main, the scoring code is not to be changed in the same pull request:
// the case goes in KNOWN_FAILURES with the exact input, and the fix comes on its own.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isCorrect, isAnswered, answerOutcome, isWritingType } from '../../src/hooks/utils.js';
import { scoreSubmission } from '../../api/_lib/exam-scoring.js';
import { createAttemptEntries, questionRevision } from '../../src/lib/study-events.js';
import { inflightExamKey, readOwnedExam } from '../../src/lib/exam-recovery.js';
import { loadModule, mount } from '../helpers/fake-react.mjs';

// Known failures on main: { invariant, seed, case, why }. Empty: none found on 11 Nov 2026.
const KNOWN_FAILURES = [];

// ── A PRNG of the test's own (not the app's mulberry32) ──────────────────────────────────────────
function prng(seed) {
  let s = (seed >>> 0) || 0x9e3779b9;
  const next = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  return {
    next,
    int: (n) => Math.floor(next() * n),
    bool: (p = 0.5) => next() < p,
    pick: (list) => list[Math.floor(next() * list.length)],
    shuffle: (list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  };
}

// Keys are Latin letters a-m and wrong answers are n-z, so no wrong answer can contain, or be
// contained in, a key: the oracle never needs the app's matching rules beyond "the key, in any case".
const word = (r, letters, min = 5) => Array.from({ length: min + r.int(3) }, () => letters[r.int(letters.length)]).join('');
const KEY_LETTERS = 'abcdefghijklm';
const WRONG_LETTERS = 'nopqrtuvwxyz';
function distinctWords(r, n) {
  const out = [];
  while (out.length < n) {
    const w = word(r, KEY_LETTERS);
    if (!out.some((o) => o.includes(w) || w.includes(o))) out.push(w);
  }
  return out;
}

const TYPES = ['mcq', 'mcq', 'mcq', 'tf', 'fill', 'match', 'short', 'essay'];
function makeQuestion(r, id) {
  const type = r.pick(TYPES);
  const base = { id, subject: 'gen', year: 5, type, q: `โจทย์ทดสอบข้อ ${id}` };
  if (type === 'mcq') {
    const n = 2 + r.int(4);
    const options = Array.from({ length: n }, (_, k) => `ตัวเลือก ${id}-${k}`);
    if (n > 2 && r.bool(0.2)) options[n - 1] = 'ถูกทุกข้อ'; // a catch-all stays last when shuffled
    return { ...base, options, answer: r.int(n) };
  }
  if (type === 'tf') return { ...base, answer: r.bool() };
  if (type === 'fill') {
    const blanks = distinctWords(r, 1 + r.int(3));
    const q = `เติมคำ ${blanks.map(() => '____').join(' และ ')}`;
    return { ...base, q, blanks, ...(blanks.length > 1 && r.bool(0.4) ? { unordered: true } : {}) };
  }
  if (type === 'match') {
    const m = 2 + r.int(3);
    return { ...base, pairs: Array.from({ length: m }, (_, j) => ({ left: `ซ้าย ${j}`, right: `ขวา ${id}-${j}` })) };
  }
  if (type === 'short') return { ...base, keywords: distinctWords(r, 2 + r.int(3)) };
  return { ...base, rubric: ['ข้อเขียน'] };
}

// One answer the way the card stores it, or undefined for a question left alone. About half right.
function makeAnswer(r, q) {
  if (r.bool(0.2)) return undefined;
  const right = r.bool();
  switch (q.type) {
    case 'mcq': return right ? q.answer : r.int(q.options.length);
    case 'tf': return right ? q.answer : r.bool();
    case 'fill': {
      const keys = q.unordered && right ? r.shuffle(q.blanks) : q.blanks;
      return keys.map((k) => {
        if (right) return r.bool(0.3) ? `  ${k.toUpperCase()} ` : k;
        return r.pick([k, word(r, WRONG_LETTERS, 4), '']);
      });
    }
    case 'match': {
      const rights = q.pairs.map((p) => p.right);
      const chosen = q.pairs.map((p, i) => (right ? p.right : r.bool(0.3) ? undefined : r.pick(rights)));
      if (r.bool()) return chosen.map((v) => v ?? '');
      return Object.fromEntries(chosen.map((v, i) => [i, v]).filter(([, v]) => v !== undefined));
    }
    case 'short': {
      const said = q.keywords.filter(() => (right ? r.bool(0.9) : r.bool(0.4)));
      return r.shuffle([...said, word(r, WRONG_LETTERS, 4), 'คำตอบ']).join(' ');
    }
    default: return right ? 'เขียนตอบยาว' : '';
  }
}

// What each type means, written for this test.
function oracle(q, ua) {
  if (ua === undefined || ua === null) return false;
  switch (q.type) {
    case 'mcq': return ua === q.answer;
    case 'tf': return ua === q.answer;
    case 'fill': {
      if (!Array.isArray(ua)) return false;
      const said = ua.map((v) => String(v ?? '').trim().toLowerCase());
      if (q.unordered) return [...said].sort().join('|') === [...q.blanks].sort().join('|');
      return q.blanks.every((k, i) => said[i] === k);
    }
    case 'match': return q.pairs.every((p, i) => ua[i] === p.right);
    case 'short': {
      if (typeof ua !== 'string') return false;
      const words = new Set(ua.split(/\s+/));
      return q.keywords.filter((k) => words.has(k)).length / q.keywords.length >= 0.75;
    }
    default: return false; // an essay is never marked by the machine
  }
}
const isWriting = (q) => q.type === 'short' || q.type === 'essay';
const expectedTotal = (qs, answers) => qs.filter((q) => !isWriting(q) && oracle(q, answers[q.id])).length;

// App.jsx's count (score memo and finishExam), as written there.
function clientTotal(questions, answers) {
  const autoQs = questions.filter((q) => !isWritingType(q));
  return autoQs.filter((q) => isCorrect(q, answers[q.id])).length;
}

function makePaper(seed, size) {
  const r = prng(seed);
  const n = size ?? 1 + r.int(60);
  const questions = Array.from({ length: n }, (_, i) => makeQuestion(r, 1000 + i));
  const answers = {};
  for (const q of questions) { const a = makeAnswer(r, q); if (a !== undefined) answers[q.id] = a; }
  return { r, questions, answers };
}

const SEEDS = Array.from({ length: 300 }, (_, i) => 0x51ed + i * 7919);
const fail = (what, seed, detail) => assert.fail(`${what} (seed ${seed}): ${JSON.stringify(detail)}`);

test('App.jsx still totals a paper the way clientTotal models it', () => {
  const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
  const filter = app.split('const autoQs = questions.filter((q) => !isWritingType(q));').length - 1;
  const count = app.split('const correct = autoQs.filter((q) => isCorrect(q, answers[q.id])).length;').length - 1;
  assert.ok(filter >= 2 && count >= 2, 'the score memo and finishExam changed their count: change clientTotal here to match, and keep the oracle');
});

test('the total of every paper equals an independent count, and each mark agrees with its type', () => {
  for (const seed of SEEDS) {
    const { questions, answers } = makePaper(seed);
    for (const q of questions) {
      const want = oracle(q, answers[q.id]);
      if (isCorrect(q, answers[q.id]) !== want) fail('a mark disagrees with its type', seed, { q, ua: answers[q.id], want });
    }
    const got = clientTotal(questions, answers);
    const want = expectedTotal(questions, answers);
    if (got !== want) fail('the total disagrees', seed, { got, want });
    assert.ok(got <= questions.filter((q) => !isWriting(q)).length);
  }
});

test('an unanswered question never counts, in any shape a cleared answer leaves', () => {
  const blanks = [undefined, null, '', '   ', [], [''], ['', '  '], {}];
  for (const seed of SEEDS.slice(0, 60)) {
    const { questions } = makePaper(seed, 30);
    for (const q of questions) {
      for (const ua of blanks) {
        if (isCorrect(q, ua)) fail('a blank answer scored', seed, { q, ua });
        if (answerOutcome(q, ua) !== 'skipped') fail('a blank answer was not skipped', seed, { q, ua });
      }
    }
    const none = clientTotal(questions, {});
    if (none !== 0) fail('an empty sheet scored', seed, { none });
  }
  // A mark is only ever given to an answered question.
  for (const seed of SEEDS) {
    const { questions, answers } = makePaper(seed);
    for (const q of questions) if (isCorrect(q, answers[q.id]) && !isAnswered(answers[q.id])) fail('marked but unanswered', seed, { q, ua: answers[q.id] });
  }
});

test('marking does not depend on how the options were shuffled', async () => {
  // Each import with its own query is a fresh module, so a fresh session seed: another page load.
  const copies = await Promise.all(Array.from({ length: 12 }, (_, i) => import(`../../src/lib/option-shuffle.js?load=${i}`)));
  for (const seed of SEEDS.slice(0, 120)) {
    const r = prng(seed);
    const { questions } = makePaper(seed, 20);
    for (const q of questions.filter((x) => x.type === 'mcq')) {
      const keyText = q.options[q.answer];
      for (const { getShuffledOptions } of copies) {
        const { displayOptions, displayToOriginal, originalToDisplay } = getShuffledOptions(q);
        assert.deepEqual([...displayToOriginal].sort((a, b) => a - b), q.options.map((_, i) => i), 'a permutation of every option');
        for (let d = 0; d < displayOptions.length; d++) {
          assert.equal(originalToDisplay[displayToOriginal[d]], d);
          // The student taps row d; the card stores displayToOriginal[d]. Right exactly when the row reads the key.
          const stored = displayToOriginal[d];
          if (isCorrect(q, stored) !== (displayOptions[d] === keyText)) fail('a shuffled row was marked by its position', seed, { q, d, stored });
        }
        if (q.options.at(-1) === 'ถูกทุกข้อ' && displayOptions.at(-1) !== 'ถูกทุกข้อ') fail('a catch-all left the last row', seed, { q });
      }

    }
  }
});

// ── The real session hook, driven without a DOM ─────────────────────────────────────────────────
let hookModule;
function storage() {
  const map = new Map();
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k) };
}
async function session() {
  if (!hookModule) {
    const noop = () => {};
    globalThis.document ??= { visibilityState: 'visible', addEventListener: noop, removeEventListener: noop };
    globalThis.window ??= { addEventListener: noop, removeEventListener: noop, localStorage: storage() };
    hookModule = await loadModule('src/hooks/useExamSession.js', {
      stubs: [{ match: 'lib/dialog\\.js$', contents: 'export const confirmDialog = async () => true; export const alertDialog = async () => {};' }],
    });
  }
  let api;
  const inst = mount(() => { api = hookModule.useExamSession({ view: 'exam', useTimer: false, timePerQ: 0, onFinish: () => {} }); return null; });
  return { get api() { return api; }, flush: () => inst.flush(), unmount: () => inst.unmount() };
}
// The in-flight record App writes (writeInflight), as far as resuming reads it.
const inflightRecord = (s, questions) => ({ questions, answers: s.api.answers, currentIdx: s.api.currentIdx, questionDeadline: null,
  examStartTime: Date.now(), sessionId: s.api.sessionId, ownerId: null, mode: 'quick', useTimer: false, timePerQ: 0, clock: 'per-question', savedAt: Date.now() });

test('answering in any order, changing answers and resuming at any point give the same score', async () => {
  for (const seed of SEEDS.slice(0, 80)) {
    const { r, questions, answers: finalSheet } = makePaper(seed, 5 + (seed % 25));
    // A random route to that sheet: each question gets up to two earlier answers (often wrong, some
    // cleared), then its final one (or a clear, when the sheet leaves it unanswered), and the
    // questions' routes are interleaved at random, so questions are answered in any order.
    const clear = (q) => (q.type === 'mcq' || q.type === 'tf' ? undefined : q.type === 'match' ? {} : q.type === 'fill' ? q.blanks.map(() => '') : '');
    const routes = questions.map((q) => {
      const route = Array.from({ length: r.int(3) }, () => [q.id, makeAnswer(r, q) ?? clear(q)]);
      if (q.id in finalSheet) route.push([q.id, finalSheet[q.id]]);
      else if (route.length) route.push([q.id, clear(q)]);
      return route;
    }).filter((route) => route.length);
    const plan = [];
    while (routes.length) {
      const i = r.int(routes.length);
      plan.push(routes[i].shift());
      if (!routes[i].length) routes.splice(i, 1);
    }
    const want = expectedTotal(questions, finalSheet);
    const resumeAt = r.int(plan.length + 1);

    const s = await session();
    s.api.startNewSession(JSON.parse(JSON.stringify(questions)), 0, {});
    s.flush();
    const store = storage();
    let live = s;
    for (let step = 0; step < plan.length; step++) {
      if (step === resumeAt) {
        // The page is closed here and opened again: App's record, through storage, into a new session.
        store.setItem(inflightExamKey(null), JSON.stringify(inflightRecord(live, live.api.questions)));
        live.unmount();
        live = await session();
        const saved = readOwnedExam(store, null);
        assert.ok(saved, 'the record is read back');
        assert.equal(live.api.primeFromSaved(saved), true);
        live.flush();
      }
      const [id, value] = plan[step];
      const idx = live.api.questions.findIndex((q) => q.id === id);
      live.api.jumpToQ(idx);
      live.flush();
      if (value === undefined) {
        // An MCQ or true/false answer is never cleared by the card; deleting it stands for "never answered".
        live.api.setAnswers((p) => { const { [id]: _, ...rest } = p; return rest; });
      } else live.api.answerCurrent(value);
      live.flush();
    }
    const got = clientTotal(live.api.questions, live.api.answers);
    if (got !== want) fail('the score moved with the order, a change or a resume', seed, { got, want, resumeAt, steps: plan.length });
    live.unmount();
  }
});

// The body finishExam builds for /api/exam-result, from the same questions and answers.
function submission(questions, answers, sessionId) {
  const autoQs = questions.filter((q) => !isWritingType(q));
  const entries = createAttemptEntries({ questions: autoQs, answers, sessionId, year: 5, phase: null, mode: 'quick', now: 1 });
  return JSON.parse(JSON.stringify({
    id: sessionId, mode: 'quick', subject: 'gen', total: autoQs.length, correct: clientTotal(questions, answers),
    pct: autoQs.length ? Math.round(clientTotal(questions, answers) * 100 / autoQs.length) : 0, year: 5, phase: null,
    question_ids: autoQs.map((q) => q.id),
    answers: Object.fromEntries(autoQs.map((q) => [q.id, answers[q.id] ?? null])),
    question_versions: Object.fromEntries(entries.map((e) => [e.questionId, e.questionVersion])),
  }));
}
const catalogOf = (qs) => new Map(qs.filter((q) => !isWritingType(q)).map((q) => [String(q.id), q]));

test('the server agrees with the client, and when it cannot check it says so and keeps the client\'s count', () => {
  const sid = '9466ac62-6c52-4b88-8d7a-a4cb41c38b03';
  for (const seed of SEEDS) {
    const { r, questions, answers } = makePaper(seed);
    const autoQs = questions.filter((q) => !isWritingType(q));
    if (!autoQs.length) continue;
    // A resumed paper's questions went through storage; the server must still recognise them.
    const resumed = r.bool() ? JSON.parse(JSON.stringify(questions)) : questions;
    const body = submission(resumed, answers, sid);
    const server = scoreSubmission(body, catalogOf(questions));
    const want = expectedTotal(questions, answers);
    if (server.score_source !== 'server' || server.correct !== want || server.correct !== body.correct || server.total !== autoQs.length) {
      fail('client and server disagree', seed, { server: [server.correct, server.total, server.score_source], client: body.correct, want });
    }
    // The documented fallback: a question the server cannot verify (a custom question, or one edited
    // since the paper was taken) leaves the client's count in place, marked as the client's.
    const victim = autoQs[r.int(autoQs.length)];
    const custom = new Map(catalogOf(questions)); custom.delete(String(victim.id));
    const edited = new Map(catalogOf(questions)); edited.set(String(victim.id), { ...victim, q: `${victim.q} (แก้ไข)` });
    const noVersion = { ...body, question_versions: { ...body.question_versions, [victim.id]: undefined } };
    for (const [why, b, cat] of [['custom', body, custom], ['edited', body, edited], ['no version', JSON.parse(JSON.stringify(noVersion)), catalogOf(questions)]]) {
      const res = scoreSubmission(b, cat);
      if (res.score_source !== 'client' || res.correct !== body.correct) fail(`fallback (${why}) did not keep the client's count`, seed, res);
      assert.throws(() => scoreSubmission({ ...b, correct: autoQs.length + 1 }, cat), /invalid-score/, 'an impossible claim is refused');
    }
  }
});

test('the generator really covers every type, blanks, wrong and right answers', () => {
  const seen = new Map();
  for (const seed of SEEDS) {
    const { questions, answers } = makePaper(seed);
    for (const q of questions) {
      const k = `${q.type}:${!isAnswered(answers[q.id]) ? 'blank' : oracle(q, answers[q.id]) ? 'right' : 'wrong'}`;
      seen.set(k, (seen.get(k) || 0) + 1);
    }
  }
  for (const type of ['mcq', 'tf', 'fill', 'match', 'short']) for (const kind of ['blank', 'right', 'wrong']) {
    assert.ok((seen.get(`${type}:${kind}`) || 0) >= 20, `${type} ${kind}: ${seen.get(`${type}:${kind}`) || 0}`);
  }
  assert.ok(seen.get('essay:blank') && (seen.get('essay:wrong') || 0) > 0);
  assert.deepEqual(KNOWN_FAILURES, [], 'a known failure is listed: fix it, then empty this list');
});

// The bank itself: a student who answers any question with its own key gets the mark, on the client
// and on the server, and a paper of the bank's questions resumed from storage is still checked by
// the server. A question its own key fails can never be scored right by anyone.
test('every question in the bank gives the mark for its own key, on the client and the server', async () => {
  const { QB, loadQB } = await import('../../src/data/questions.js');
  const { isQuestionDeliverable } = await import('../../src/data/question-delivery.generated.js');
  await loadQB();
  const graded = QB.filter((q) => isQuestionDeliverable(q) && !isWritingType(q));
  assert.ok(graded.length > 5000, `bank loaded (${graded.length})`);
  const keyOf = (q) => (q.type === 'fill' ? q.blanks.slice() : q.type === 'match' ? q.pairs.map((p) => p.right) : q.answer);
  const refused = graded.filter((q) => !isCorrect(q, keyOf(q)));
  const known = new Set(KNOWN_FAILURES.filter((k) => k.invariant === 'own key').map((k) => k.case));
  const fresh = refused.filter((q) => !known.has(q.id));
  assert.deepEqual(fresh.map((q) => ({ id: q.id, type: q.type, key: keyOf(q) })), [], 'a question whose own key is marked wrong');
  for (const q of graded) {
    if (q.type === 'mcq') assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `mcq ${q.id}: key outside its options`);
    if (q.type === 'tf') assert.equal(typeof q.answer, 'boolean', `tf ${q.id}: key is not true or false`);
    if (q.type === 'match') {
      // The card makes a right side one-to-one unless the question prints a bank (MatchDragDrop):
      // a key that uses one right twice without a bank could never be entered.
      const rights = q.pairs.map((p) => p.right);
      if (new Set(rights).size !== rights.length) assert.ok(Array.isArray(q.bank) && rights.every((x) => q.bank.includes(x)), `match ${q.id}: a right side used twice needs a bank that holds it`);
    }
  }
  // One paper of the whole bank, every key given, as the server reads it after a resume.
  const sid = '0b1d8a8c-2f4e-4c55-9a77-5d7d6f1a2b3c';
  const r = prng(0xbeef);
  const paper = r.shuffle(graded).slice(0, 5000);
  const answers = Object.fromEntries(paper.map((q) => [q.id, keyOf(q)]));
  const body = submission(JSON.parse(JSON.stringify(paper)), answers, sid);
  const server = scoreSubmission(body, new Map(graded.map((q) => [String(q.id), q])));
  assert.equal(server.score_source, 'server');
  assert.equal(server.correct, paper.filter((q) => !known.has(q.id)).length + paper.filter((q) => known.has(q.id) && isCorrect(q, keyOf(q))).length);
  assert.equal(server.correct, body.correct);
});
