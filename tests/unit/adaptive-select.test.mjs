import test from 'node:test';
import assert from 'node:assert/strict';

import {
  adaptiveSelect,
  computeAbility,
  targetDifficultyFor,
  ADAPTIVE_TARGET,
} from '../../src/lib/adaptive-select.js';
import { expectedScore, DEFAULT_RATING } from '../../src/lib/elo.js';
import { buildExamPool } from '../../src/lib/exam-pool.js';
import { yearForSubject } from '../../src/data/curriculum.js';

let nextId = 800_000;
const q = (subject, difficulty, extra = {}) => ({ id: nextId++, subject, topic: `topic-${(nextId % 7)}`, type: 'mcq', q: 'fixture', options: ['a', 'b'], answer: 0, _d: difficulty, ...extra });
const difficultyOf = (question) => question._d;

// ── Premises the fixtures rest on ──────────────────────────────────────
test('the fixture subject still sits where the test assumes', () => {
  assert.equal(yearForSubject('equine-medicine'), 5);
});

test('target difficulty round-trips through the logistic to the target rate', () => {
  const target = targetDifficultyFor(1500);
  assert.ok(Math.abs(expectedScore(1500, target) - ADAPTIVE_TARGET) < 1e-9);
  assert.ok(target < 1500, 'a 1500-ability student should face below-1500 questions to hit 70%');
});

test('the set clusters near the target difficulty and ramps easy to hard', () => {
  const pool = [];
  for (let d = 900; d <= 2100; d += 10) pool.push(q('equine-medicine', d));
  const picked = adaptiveSelect(pool, { ability: 1500, difficultyOf, count: 10, rng: () => 0.5 });
  assert.equal(picked.length, 10);
  const difficulties = picked.map(difficultyOf);
  const target = targetDifficultyFor(1500);
  for (const d of difficulties) {
    assert.ok(Math.abs(d - target) <= 150, `picked difficulty ${d} is not near target ${Math.round(target)}`);
  }
  for (let i = 1; i < difficulties.length; i++) {
    assert.ok(difficulties[i] >= difficulties[i - 1], 'the set must walk easy to hard');
  }
});

test('one heavily banked topic cannot own the set', () => {
  const pool = [];
  for (let i = 0; i < 60; i++) pool.push(q('equine-medicine', 1350 + (i % 5), { topic: 'flooded-topic' }));
  for (let d = 1000; d <= 1800; d += 25) pool.push(q('equine-medicine', d, { topic: `topic-${d}` }));
  const picked = adaptiveSelect(pool, { ability: 1500, difficultyOf, count: 10, rng: () => 0.5 });
  const counts = new Map();
  for (const item of picked) counts.set(item.topic, (counts.get(item.topic) || 0) + 1);
  assert.equal(picked.length, 10);
  assert.ok(Math.max(...counts.values()) <= 2, `a single topic took ${Math.max(...counts.values())} of 10`);
});

test('a thin pool is served whole, ordered, never short', () => {
  const pool = [q('equine-medicine', 1800), q('equine-medicine', 1000), q('equine-medicine', 1400)];
  const picked = adaptiveSelect(pool, { ability: 1200, difficultyOf, count: 10, rng: () => 0.5 });
  assert.deepEqual(picked.map(difficultyOf), [1000, 1400, 1800]);
});

test('an empty pool comes back empty', () => {
  assert.deepEqual(adaptiveSelect([], { ability: 1500, difficultyOf, count: 10 }), []);
});

test('the same rng serves the same set; identical difficulties vary members', () => {
  const spread = [];
  for (let d = 1200; d <= 1500; d += 10) spread.push(q('equine-medicine', d));
  const fixed = () => adaptiveSelect(spread, { ability: 1500, difficultyOf, count: 8, rng: () => 0.5 });
  assert.deepEqual(fixed(), fixed(), 'deterministic rng must give a deterministic set');

  // The real variance case: a dense pool where most questions carry no
  // measured rating yet and all sit at the neutral 1500. Which eight of them
  // a session serves must depend on the shuffle, not on bank order.
  const uniform = Array.from({ length: 40 }, () => q('equine-medicine', 1500));
  const sets = new Set();
  for (let seed = 0; seed < 10; seed++) {
    const rng = (() => { let s = seed * 7919 + 17; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
    sets.add(adaptiveSelect(uniform, { ability: 1500, difficultyOf, count: 8, rng }).map((x) => x.id).join(','));
  }
  assert.ok(sets.size >= 2, `ten seeds served ${sets.size} distinct sets from a uniform pool`);
});

test('ability rises on correct answers and falls on misses, from the neutral start', () => {
  assert.equal(computeAbility([], {}), DEFAULT_RATING, 'no history is a neutral ability');

  const data = { '1': { rating: 1500, n: 50 } };
  const winning = Array.from({ length: 10 }, (_, i) => ({ questionId: 1, correct: true, date: i }));
  const rising = computeAbility(winning, data);
  assert.ok(rising > DEFAULT_RATING, `a clean sweep must raise ability (got ${rising})`);

  const losing = winning.map((e) => ({ ...e, correct: false }));
  const falling = computeAbility(losing, data);
  assert.ok(falling < DEFAULT_RATING, `a clean fail must lower ability (got ${falling})`);
  assert.ok(Math.abs(rising - DEFAULT_RATING) === Math.abs(falling - DEFAULT_RATING),
    'symmetric evidence must move ability symmetrically');
});

test('ability respects chronology and clamps inside the servable band', () => {
  const data = { '1': { rating: 1500, n: 50 } };
  const shuffled = Array.from({ length: 10 }, (_, i) => ({ questionId: 1, correct: true, date: 100 - i }));
  const chronological = computeAbility(shuffled, data);
  const ordered = computeAbility([...shuffled].sort((a, b) => a.date - b.date), data);
  assert.equal(chronological, ordered, 'history order on the wire must not change the estimate');

  const absurd = Array.from({ length: 500 }, (_, i) => ({ questionId: 1, correct: true, date: i }));
  assert.ok(computeAbility(absurd, data) <= 2200, 'a hot streak cannot escape the band');
});

test('ability uses the trust ladder: thin samples read as neutral, not as their rating', () => {
  // A question with 5 recorded attempts sits in the map but below the trust
  // threshold; rating a student against a shaky number would move them on
  // noise. Their own attempts on it still count as their own evidence.
  const thin = { '7': { rating: 2100, n: 5 } };
  const attempts = Array.from({ length: 4 }, (_, i) => ({ questionId: 7, correct: false, date: i }));
  const got = computeAbility(attempts, thin);
  assert.ok(got < DEFAULT_RATING, 'a miss against a neutral-1500 question still lowers ability');
  assert.ok(Math.abs(got - DEFAULT_RATING) < 40, 'but the bogus 2100 rating never touched the estimate');
});

test('adaptive mode draws from the same pool the config screen counts', () => {
  // The count on the config screen comes from buildExamPool on the same
  // practiceMode; 'adaptive' must flow through the ordinary subject/year
  // filters exactly like 'all', or the printed number stops being true.
  const questions = [];
  for (let i = 0; i < 30; i++) questions.push({ id: 600_000 + i, subject: 'equine-medicine', topic: 'fixture-topic', type: 'mcq', q: 'fixture', options: ['a', 'b'], answer: 0, year: 5 });
  const build = (practiceMode) => buildExamPool({
    questions, practiceMode, subject: 'equine-medicine', topic: null, questionCategory: 'all', selectedYear: 5,
  });
  assert.equal(build('adaptive').length, build('all').length);
  assert.equal(build('adaptive').length, 30);
});
