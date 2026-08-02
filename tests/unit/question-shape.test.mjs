// ============================================================
// question-shape.test.mjs — the fields tooling reads actually exist
// ============================================================
// A retrieval pass built for this corpus read the correct option as `q.a`.
// No question has ever had an `a` field — they all use `answer` — so every
// judge downstream was handed `markedAnswer: undefined` and silently lost the
// ability to notice a question whose key its own article contradicts.
//
// Nothing failed. No error was thrown. The output looked exactly like output.
// That is the shape of bug this file exists to stop: a script reading a field
// name that was never there, on data that is otherwise fine.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const questions = [];
for (const entry of BANK_REGISTRY) {
  const bank = await entry.load();
  for (const q of (Array.isArray(bank) ? bank : [])) questions.push({ ...q, __bank: entry.file });
}

test('the corpus is non-empty and loads', () => {
  assert.ok(questions.length > 3000, `only ${questions.length} questions loaded`);
});

test('multiple-choice questions key their answer as `answer`, never `a`', () => {
  const strays = questions.filter((q) => 'a' in q);
  assert.deepEqual(strays.map((q) => `${q.__bank}:${q.id}`), [],
    'some question uses `a` — tooling assumes `answer` everywhere');
});

test('every question with options has an in-range answer index', () => {
  const bad = questions
    .filter((q) => Array.isArray(q.options) && q.options.length > 0 && typeof q.answer === 'number')
    .filter((q) => q.answer < 0 || q.answer >= q.options.length)
    .map((q) => `${q.__bank}:${q.id} answer=${q.answer} of ${q.options.length}`);
  assert.deepEqual(bad, []);
});

test('a question with options either keys an answer or declares another type', () => {
  const orphan = questions
    .filter((q) => Array.isArray(q.options) && q.options.length > 1)
    .filter((q) => typeof q.answer !== 'number')
    .filter((q) => !q.type || q.type === 'mcq')
    .map((q) => `${q.__bank}:${q.id}`);
  assert.deepEqual(orphan, [], 'multiple-choice question with no answer index');
});
