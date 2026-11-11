// ============================================================
// study-coach-passage — the wrong-answer coach is shown the case
// ============================================================
// A question can carry a passage (a case, or the table its stem refers to)
// shown above the stem. The coach used to explain a miss without it. Now the
// passage goes into what the model is shown, and so into the cache key,
// except where `say` already holds the whole sentence with its numbers.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'test-key';
const { missMaterial, coachPassage, MAX_PASSAGE_CHARS } = await import('../../api/study-coach.js');
const { questionCatalog } = await import('../../api/_lib/question-catalog.js');
const { wholeExplain, wholeStem, isTableRow, passageBesideStem } = await import('../../src/lib/rich-blocks.js');

// The material exactly as the coach built it before passages were sent.
function legacyMaterial(q, chosen) {
  const options = Array.isArray(q.options) ? q.options : [];
  const optionList = options.map((o, i) => {
    const marks = [i === q.answer ? '[CORRECT]' : '', i === chosen ? '[STUDENT PICKED]' : ''].filter(Boolean).join(' ');
    return `  - ${o}${marks ? `   ${marks}` : ''}`;
  }).join('\n');
  return [
    `QUESTION: ${wholeStem(q)}`,
    `OPTIONS:\n${optionList}`,
    `CORRECT: ${options[q.answer]}`,
    `STUDENT PICKED: ${options[chosen]}`,
    q.explain ? `EXPLANATION FROM THE QUESTION BANK: ${wholeExplain(q)}` : '',
  ].filter(Boolean).join('\n\n');
}

const catalog = await questionCatalog();
const mcq = [...catalog.values()].filter((q) => q.type === 'mcq' && Array.isArray(q.options) && q.options.length > 1);
const hasPassage = (q) => typeof q.passage === 'string' && q.passage.trim();
const wrong = (q) => (q.answer === 0 ? 1 : 0);

test('a passage question is explained with its passage and title', () => {
  const qs = mcq.filter((q) => hasPassage(q) && !q.say);
  assert.ok(qs.length > 0, 'the bank has passage questions without say');
  for (const q of qs) {
    const m = missMaterial(q, wrong(q));
    assert.ok(m.startsWith('PASSAGE SHOWN ABOVE THE QUESTION'), q.id);
    if (q.passage_title) assert.ok(m.includes(q.passage_title.trim()), `${q.id} title`);
    // Every bank passage fits under the cap today, so each is sent whole.
    assert.ok(m.includes(q.passage.trim()), `${q.id} passage whole`);
  }
});

test('a say question gets no passage: its stem already holds the numbers', () => {
  const qs = mcq.filter((q) => hasPassage(q) && q.say);
  assert.ok(qs.length > 0, 'the bank has say questions');
  for (const q of qs) {
    assert.equal(coachPassage(q), '');
    assert.equal(missMaterial(q, wrong(q)), legacyMaterial(q, wrong(q)), q.id);
    assert.ok(missMaterial(q, wrong(q)).includes(q.say));
  }
});

test('a question without a passage gets the exact prompt it got before', () => {
  const qs = mcq.filter((q) => !hasPassage(q));
  assert.ok(qs.length > 100);
  for (const q of qs) assert.equal(missMaterial(q, wrong(q)), legacyMaterial(q, wrong(q)), q.id);
});

test('a long passage is cut at a line end within the cap, never inside a table row', () => {
  const row = (i) => `| row ${i} | ${'x'.repeat(40)} | ${i * 7} |`;
  const passage = ['A case first, in prose.', '', '| name | text | n |', '|---|---|---|', ...Array.from({ length: 200 }, (_, i) => row(i))].join('\n');
  const q = { type: 'mcq', passage, passage_title: 'Table', q: 'Which?', options: ['a', 'b'], answer: 0 };
  const p = coachPassage(q);
  assert.ok(p.length <= MAX_PASSAGE_CHARS, `${p.length} within ${MAX_PASSAGE_CHARS}`);
  const lines = p.split('\n');
  assert.equal(lines.at(-1), '[the passage continues]');
  for (const line of lines.slice(1, -1)) assert.ok(passage.split('\n').includes(line), `whole line: ${line}`);
  assert.ok(isTableRow(lines.at(-2)));
});

test('one prose line longer than the cap is cut at a word', () => {
  const q = { type: 'mcq', passage: 'word '.repeat(1000).trim(), q: 'Which?', options: ['a', 'b'], answer: 0 };
  const p = coachPassage(q);
  assert.ok(p.length <= MAX_PASSAGE_CHARS);
  assert.ok(p.split('\n')[1].endsWith('word'));
});

test('the coach footer names the passage exactly when the model was shown one', () => {
  for (const q of mcq) assert.equal(Boolean(passageBesideStem(q)), Boolean(coachPassage(q)), q.id);
});

test('the passage is inside what the cache key hashes', async () => {
  const q = mcq.find((x) => hasPassage(x) && !x.say);
  const changed = { ...q, passage: `${q.passage}\nedited` };
  assert.notEqual(missMaterial(q, wrong(q)), missMaterial(changed, wrong(q)));
});
