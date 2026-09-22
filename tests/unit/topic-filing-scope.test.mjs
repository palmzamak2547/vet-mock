// ============================================================
// A question on the wrong topic sits on the wrong paper
// ============================================================
// Scope belongs to the topic (AGENTS.md rule 10), so a misfiled row is a
// scope bug. Swine midterm practice carried three ileitis / swine dysentery
// items from the seniors' FINAL on swine-gi-viral (Athipoo, both papers),
// although this year's GI-viral lecture (recorded 2026-08-21) does not teach
// either disease and the topic that does, swine-ileitis-bacti, sits the
// final. Zoonoses midterm practice was missing a Q fever item filed under
// bacterial zoonoses (final), while this year's rickettsial deck covers
// Coxiella and the Q fever past-paper item sat a midterm.
// ============================================================

import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readBank } from '../../scripts/lib/bank-file.mjs';
import { questionInScope } from '../../src/lib/exam-scope.js';

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'data');

async function rows(file, subject) {
  const { questions } = await readBank(path.join(DATA, file));
  return new Map(questions.filter((q) => q.subject === subject).map((q) => [q.id, q]));
}

test('ileitis and swine dysentery items sit the swine final, not the midterm', async () => {
  const swine = await rows('questions-y5-swine-2026-b.js', 'swine-clinic');
  for (const id of [105576, 105577, 105579]) {
    const q = swine.get(id);
    assert.equal(q.topic, 'swine-ileitis-bacti', `${id} is filed on ${q.topic}`);
    assert.equal(questionInScope(q, 'midterm'), false, `${id} still pads the swine midterm`);
    assert.equal(questionInScope(q, 'final'), true, `${id} fell out of the swine final`);
  }
});

test('final-paper swine items sit on the topic that names their disease', async () => {
  const swine = await rows('questions-y5-swine-2026-b.js', 'swine-clinic');
  assert.equal(swine.get(105598).topic, 'swine-greasypig', 'exudative epidermitis is greasy pig disease');
  for (const id of [105593, 105595]) {
    assert.equal(swine.get(id).topic, 'swine-csf', `${id} is a classical swine fever item`);
  }
});

test('the Coxiella item is in zoonoses midterm practice with the other Q fever items', async () => {
  const zoo = await rows('questions-y5-zoonoses-2026-b.js', 'zoonoses');
  const q = zoo.get(106034);
  assert.equal(q.topic, 'zoo-rickettsial');
  assert.equal(questionInScope(q, 'midterm'), true, 'Q fever is examined on the zoonoses midterm');
});
