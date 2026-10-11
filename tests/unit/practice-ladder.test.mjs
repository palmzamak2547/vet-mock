// ============================================================
// practice-ladder.test.mjs — the three rungs, what moves a student between
// them, and the gentle order of rung 1
// ============================================================
// Owner review 2026-10-11: practice should build understanding with easier
// questions first and lead toward exam mode. The ladder is derived from the
// settings a set runs with, never stored beside them, so the strip on screen
// and the switches under it cannot disagree; the gentle order is a proxy
// (format and stem length) until a question has measured difficulty.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LADDER_STEPS, STEP_MIN_SET, STEP_UP_RATIO, ladderStepFor, ladderPreset, ladderVerdict,
  gentleRank, gentleOrder, gentlePick, recallLadderStep, rememberLadderStep,
} from '../../src/lib/practice-ladder.js';
import { DIFFICULTY_MIN_ATTEMPTS, DEFAULT_RATING } from '../../src/lib/elo.js';

test('the rung is read off the settings: exam mode, then the clock', () => {
  assert.equal(ladderStepFor({ mode: 'exam', useTimer: true }), 'exam');
  assert.equal(ladderStepFor({ mode: 'exam', useTimer: false }), 'exam', 'an exam is an exam whatever the clock says');
  assert.equal(ladderStepFor({ mode: 'quick', useTimer: true }), 'timed');
  assert.equal(ladderStepFor({ mode: 'quick', useTimer: false }), 'understand');
  assert.deepEqual(LADDER_STEPS.map((s) => s.n), [1, 2, 3]);
});

test('a preset never promises more than the pool holds, and keeps a chosen clock', () => {
  assert.deepEqual(ladderPreset('understand', { available: 153 }), {
    mode: 'quick', useTimer: false, instantFeedback: true, numQuestions: 10, timePerQ: 60,
  });
  assert.equal(ladderPreset('timed', { available: 7 }).numQuestions, 7, 'seven questions cannot become twenty');
  assert.equal(ladderPreset('exam', { available: null }).numQuestions, 50, 'an unknown pool keeps the rung default');
  assert.equal(ladderPreset('timed', { available: 100, timePerQ: 45 }).timePerQ, 45, 'the student chose 45 seconds');
  assert.equal(ladderPreset('exam', { timePerQ: 2 }).timePerQ, 60, 'an impossible clock falls back to the rung default');
  assert.equal(ladderPreset('nonsense').mode, 'quick', 'an unknown rung is the first one');
});

test('the verdict uses exact counts and the stated bars', () => {
  assert.equal(ladderVerdict({ stepId: 'understand', correct: 8, total: 10 }).kind, 'up');
  assert.equal(ladderVerdict({ stepId: 'understand', correct: 8, total: 10 }).next, 'timed');
  assert.equal(ladderVerdict({ stepId: 'understand', correct: 7, total: 9 }).kind, 'hold', '7/9 rounds to 78 but is under 0.8');
  assert.equal(ladderVerdict({ stepId: 'understand', correct: 5, total: 10 }).kind, 'back');
  assert.equal(ladderVerdict({ stepId: 'understand', correct: 5, total: 10 }).next, 'understand', 'the first rung has nothing below it');
  assert.equal(ladderVerdict({ stepId: 'timed', correct: 14, total: 20 }).kind, 'up');
  assert.equal(ladderVerdict({ stepId: 'timed', correct: 14, total: 20 }).next, 'exam');
  assert.equal(ladderVerdict({ stepId: 'timed', correct: 13, total: 20 }).kind, 'hold');
  assert.equal(ladderVerdict({ stepId: 'timed', correct: 11, total: 20 }).next, 'understand');
  assert.equal(ladderVerdict({ stepId: 'exam', correct: 30, total: 50 }).kind, 'done');
  assert.equal(ladderVerdict({ stepId: 'exam', correct: 29, total: 50 }).kind, 'back');
  assert.equal(ladderVerdict({ stepId: 'exam', correct: 29, total: 50 }).next, 'timed');
  assert.equal(ladderVerdict({ stepId: 'understand', correct: 4, total: 4 }).kind, 'short', `${STEP_MIN_SET} questions is the floor`);
  assert.equal(ladderVerdict({ stepId: 'understand', correct: 0, total: 0 }).kind, 'short');
  assert.equal(ladderVerdict({ stepId: 'made-up', correct: 10, total: 10 }).step, 'understand');
  assert.equal(STEP_UP_RATIO.understand, 0.8);
  assert.equal(STEP_UP_RATIO.timed, 0.7);
});

const q = (id, type, stem, options) => ({ id, type, q: stem, options });

test('the gentle rank is measured difficulty when it exists and a stated proxy otherwise', () => {
  const measured = { 1: { rating: 1720, n: DIFFICULTY_MIN_ATTEMPTS }, 2: { rating: 1300, n: DIFFICULTY_MIN_ATTEMPTS - 1 } };
  assert.equal(gentleRank(q(1, 'tf', 'สั้น'), measured), 1720, 'measured beats the proxy');
  assert.equal(gentleRank(q(2, 'tf', 'สั้น'), measured), DEFAULT_RATING - 100, 'too few attempts: the proxy');
  assert.ok(gentleRank(q(3, 'tf', 'x')) < gentleRank(q(4, 'mcq', 'x', ['a', 'b', 'c', 'd'])), 'true/false before multiple choice');
  assert.ok(gentleRank(q(4, 'mcq', 'x', ['a', 'b', 'c', 'd'])) < gentleRank(q(5, 'match', 'x')), 'multiple choice before matching');
  assert.ok(gentleRank(q(5, 'match', 'x')) < gentleRank(q(6, 'short', 'x')), 'matching before short answer');
  assert.ok(gentleRank(q(6, 'short', 'x')) < gentleRank(q(7, 'essay', 'x')), 'short answer before essay');
  assert.ok(gentleRank(q(8, 'mcq', 'ก'.repeat(400), ['a', 'b', 'c', 'd'])) > gentleRank(q(9, 'mcq', 'ก'.repeat(40), ['a', 'b', 'c', 'd'])), 'a long vignette after a short stem');
  assert.equal(gentleRank(q(10, 'mcq', 'ก'.repeat(5000), ['a', 'b', 'c', 'd'])), DEFAULT_RATING + 80, 'the stem bump is capped');
  assert.equal(gentleRank(q(11, 'mcq', 'x', ['a', 'b', 'c', 'd', 'e', 'f'])), DEFAULT_RATING + 20, 'extra options cost ten each');
});

test('the gentle order is stable and keeps passage questions in reading order', () => {
  const list = [q(3, 'essay', 'x'), q(1, 'tf', 'x'), q(2, 'mcq', 'x', ['a', 'b', 'c', 'd']), q(4, 'tf', 'x')];
  assert.deepEqual(gentleOrder(list).map((x) => x.id), [1, 4, 2, 3], 'ties keep pool order');
  const passage = [
    { id: 20, type: 'mcq', q: 'ก'.repeat(300), options: ['a', 'b', 'c', 'd'], passage: 'p' },
    { id: 21, type: 'mcq', q: 'ก'.repeat(10), options: ['a', 'b', 'c', 'd'], passage: 'p' },
    q(5, 'tf', 'x'),
  ];
  assert.deepEqual(gentleOrder(passage).map((x) => x.id), [5, 20, 21], 'Q1 of the passage still comes before Q2');
});

test('gentlePick serves the wanted count, easy to hard, auto-marked first, from a varying window', () => {
  const pool = [];
  for (let i = 0; i < 30; i++) pool.push(q(100 + i, i % 3 === 0 ? 'tf' : 'mcq', 'ก'.repeat(20 * (i % 7)), ['a', 'b', 'c', 'd']));
  for (let i = 0; i < 10; i++) pool.push(q(200 + i, 'short', 'x'));
  const seeded = (seed) => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const picked = gentlePick(pool, 10, { rng: seeded(7) });
  assert.equal(picked.length, 10);
  assert.ok(picked.every((x) => x.type !== 'short'), 'written items stay out while there are enough auto-marked ones');
  const ranks = picked.map((x) => gentleRank(x));
  assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b), 'served easy to hard');
  const again = gentlePick(pool, 10, { rng: seeded(99) });
  assert.notDeepEqual(picked.map((x) => x.id), again.map((x) => x.id), 'two sessions are not the same ten questions');
  assert.equal(gentlePick(pool.slice(30), 10).length, 10, 'a written-only pool still serves its ten');
  assert.equal(gentlePick(pool.slice(0, 3), 10).length, 3, 'a thin pool is never padded');
  assert.deepEqual(gentlePick([], 10), []);
});

test('the remembered rung is a nicety that never returns the exam rung or a bad value', () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.equal(recallLadderStep(storage), 'understand');
  rememberLadderStep('timed', storage);
  assert.equal(recallLadderStep(storage), 'timed');
  rememberLadderStep('exam', storage);
  assert.equal(recallLadderStep(storage), 'understand', 'a topic never opens straight into exam mode');
  rememberLadderStep('nonsense', storage);
  assert.equal(store.get('vmx-ladder-step'), 'exam', 'an unknown rung is not written');
  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(recallLadderStep(broken), 'understand');
  assert.doesNotThrow(() => rememberLadderStep('timed', broken));
});
