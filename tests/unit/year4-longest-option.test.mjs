// ============================================================
// Year-4 papers must not be passable by picking the longest option
// ============================================================
// The five year-4 banks that sit midterms in late September were written with
// the key as the one option that carried the full detail and the distractors
// as short stubs. Always clicking the longest option scored 63-83% against a
// chance rate of 20-25%, so a practice score said nothing about what a student
// knew. The lint only warned (length bias below 3.5x is not an error), so
// nothing stopped it.
//
// This holds the five banks to the standard the lint cannot: the longest
// option, and the shortest, may win no more than ten points above chance, on
// the midterm pool a student actually practises and on the whole bank.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { questionInScope } from '../../src/lib/exam-scope.js';
import { BLOCKED_QUESTIONS } from '../../src/data/question-delivery.generated.js';

const require = createRequire(import.meta.url);
const { lintQuestions, loadQuestions } = require('../../scripts/lint-questions.cjs');

const BANKS = {
  com2: 'src/data/questions-com2.js',
  'swine-repro': 'src/data/questions-swine-repro.js',
  'swine-herd': 'src/data/questions-swine-herd.js',
  'herd-health-rum': 'src/data/questions-herd-health-rum.js',
  'food-safety-y4': 'src/data/questions-food-safety-y4.js',
};

const MARGIN = 10; // percentage points above chance
const blocked = new Set(BLOCKED_QUESTIONS.map((b) => b.key));
const len = (s) => String(s ?? '').replace(/\*\*|__/g, '').trim().length;

const questions = await loadQuestions({ files: Object.values(BANKS) });
const isMcq = (q) => q.type === 'mcq' && Array.isArray(q.options) && q.options.length >= 2 && Number.isInteger(q.answer);

// Score for a student who always picks the longest (or shortest) option,
// splitting ties evenly — the same rule the audit probe used.
function strategyScore(rows, pick) {
  let won = 0;
  let chance = 0;
  for (const q of rows) {
    const lens = q.options.map(len);
    const target = pick(...lens);
    const tied = lens.map((_, i) => i).filter((i) => lens[i] === target);
    if (tied.includes(q.answer)) won += 1 / tied.length;
    chance += 1 / q.options.length;
  }
  return { won: (won / rows.length) * 100, chance: (chance / rows.length) * 100 };
}

for (const [subject] of Object.entries(BANKS)) {
  const live = questions.filter((q) => q.subject === subject && isMcq(q) && !blocked.has(`${subject}:${q.id}`));
  const pools = {
    midterm: live.filter((q) => questionInScope(q, 'midterm')),
    'whole bank': live,
  };

  for (const [label, rows] of Object.entries(pools)) {
    test(`${subject} (${label}): always picking the longest option does not beat chance`, () => {
      assert.ok(rows.length >= 5, `${subject} ${label} pool unexpectedly small (${rows.length})`);
      const { won, chance } = strategyScore(rows, Math.max);
      assert.ok(
        won <= chance + MARGIN,
        `${subject} ${label}: longest option wins ${won.toFixed(0)}% against chance ${chance.toFixed(0)}% (n=${rows.length})`,
      );
    });

    test(`${subject} (${label}): always picking the shortest option does not beat chance`, () => {
      const { won, chance } = strategyScore(rows, Math.min);
      assert.ok(
        won <= chance + MARGIN,
        `${subject} ${label}: shortest option wins ${won.toFixed(0)}% against chance ${chance.toFixed(0)}% (n=${rows.length})`,
      );
    });
  }
}

test('the five year-4 banks carry no length-bias finding at all', () => {
  const { findings } = lintQuestions(questions);
  const lengthBias = findings.filter((f) => f.kind === 'length-bias');
  assert.deepEqual(
    lengthBias.map((f) => `${f.id} ${f.ratio}x`),
    [],
    'correct option more than 1.6x the mean distractor length',
  );
});

test('no option in the five banks carries a marker that points at the key', () => {
  const MIDDLE_DOT = String.fromCharCode(0xB7);
  const bad = [];
  for (const q of questions) {
    if (!Array.isArray(q.options)) continue;
    for (const o of q.options) {
      if (typeof o !== 'string') continue;
      if (o.includes('★') || o.includes('**') || o.includes('…') || o.includes(MIDDLE_DOT)
        || /all of the above|none of the above|ถูกทุกข้อ|ผิดทุกข้อ|ไม่มีข้อใดถูก/i.test(o)) {
        bad.push(`${q.id}: ${o}`);
      }
    }
  }
  assert.deepEqual(bad, []);
});
