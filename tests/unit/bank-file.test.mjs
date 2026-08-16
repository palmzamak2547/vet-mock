// A question-bank reader that skips a bank must not do it quietly.
//
// The deck-reference gate read banks with JSON.parse inside a try/catch. Older
// banks carry section comments inside the array, so 37 of 65 banks — 2,846
// questions — threw and were skipped, and the gate printed a clean report while
// 92 deck-naming stems sat in the files it never opened. These tests pin the two
// behaviours that failure needed: read a commented bank, and cut exactly one
// question out of one.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readBank, removeQuestions, updateStems, bankFiles } from '../../scripts/lib/bank-file.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bank-'));
const write = (name, body) => { const p = path.join(tmp, name); fs.writeFileSync(p, body); return p; };

const COMMENTED = `// header comment { with a brace }
export const QUESTIONS_X = [
  // ── Chromatography (Q1-9, Final Lab 2022) ──
  { "id": 1, "q": "หนึ่ง", "options": ["a","b"], "answer": 0 },
  { "id": 2, "q": "สอง { ไม่ใช่วงเล็บจริง", "options": ["a","b"], "answer": 1 },
  // ── Electrophoresis ──
  { "id": 3, "q": "สาม \\" ยังไม่จบ", "options": ["a","b"], "answer": 0 },
];
`;

test('reads a bank whose array contains comments', async () => {
  const p = write('questions-commented.js', COMMENTED);
  const { questions } = await readBank(p);
  assert.equal(questions.length, 3, 'a commented bank must not read as empty');
  assert.equal(questions[0].q, 'หนึ่ง');
});

test('JSON.parse — the old approach — genuinely fails on that same file', () => {
  const src = COMMENTED;
  const slice = src.slice(src.indexOf('['), src.lastIndexOf(']') + 1);
  assert.throws(() => JSON.parse(slice), 'if this ever parses, the bug it caused was something else');
});

test('removes exactly the named question, leaving comments and siblings', async () => {
  const p = write('questions-cut.js', COMMENTED);
  assert.equal(removeQuestions(p, new Set([2])), 1);

  const { questions } = await readBank(p);
  assert.deepEqual(questions.map((q) => q.id), [1, 3], 'only id 2 should be gone');

  const after = fs.readFileSync(p, 'utf8');
  assert.match(after, /Chromatography/, 'section comments must survive');
  assert.match(after, /Electrophoresis/);
  assert.doesNotMatch(after, /ไม่ใช่วงเล็บจริง/);
});

test('a brace inside a string does not end the object early', async () => {
  const p = write('questions-brace.js', COMMENTED);
  removeQuestions(p, new Set([1]));
  const { questions } = await readBank(p);
  // id 2's stem holds an unmatched "{". If brace counting ignored strings it
  // would swallow the rest of the file when cutting its neighbour.
  assert.deepEqual(questions.map((q) => q.id), [2, 3]);
});

test('rewrites a stem without disturbing its neighbours', async () => {
  const p = write('questions-stem.js', COMMENTED);
  assert.equal(updateStems(p, new Map([[2, 'สองใหม่ มี "อัญประกาศ" และ \\ ด้วย']])), 1);

  const { questions } = await readBank(p);
  assert.equal(questions.length, 3, 're-encoding must not break the file');
  assert.equal(questions[1].q, 'สองใหม่ มี "อัญประกาศ" และ \\ ด้วย');
  assert.equal(questions[0].q, 'หนึ่ง', 'neighbours untouched');
  assert.equal(questions[1].answer, 1, 'only the stem changes');
});

test('handles banks written as plain JS object literals, not JSON', async () => {
  // questions-engprof.js is `{ id: 51045, subject: 'engprof', ...}` — bare keys
  // and single quotes. Matching only `"id":` made a drop return 0 and change
  // nothing, which looked exactly like a question that was not there.
  const p = write('questions-literal.js', `export const Q = [
  { id: 7, subject: 'x', q: 'ตาม Bloom\\'s taxonomy วง { นี้', options: ['a','b'], answer: 0 },
  { id: 8, subject: 'x', q: 'แปด', options: ['a','b'], answer: 1 },
];
`);
  assert.equal(updateStems(p, new Map([[7, 'เจ็ดใหม่']])), 1, 'unquoted key must be found');
  assert.equal(removeQuestions(p, new Set([8])), 1);
  const { questions } = await readBank(p);
  assert.deepEqual(questions.map((q) => [q.id, q.q]), [[7, 'เจ็ดใหม่']]);
});

test('single-quoted values with escaped apostrophes and a stray brace', async () => {
  const p = write('questions-sq.js', `export const Q = [
  { id: 1, q: 'Bloom\\'s taxonomy { ไม่ปิด', explain: 'x', options: ['a','b'], answer: 0 },
  { id: 2, q: 'สอง', explain: 'y', options: ['a','b'], answer: 1 },
];
`);
  // If the escaped apostrophe ended the string early, the brace inside it would
  // be counted and cutting id 1 would swallow id 2.
  assert.equal(removeQuestions(p, new Set([1])), 1);
  const { questions } = await readBank(p);
  assert.deepEqual(questions.map((q) => q.id), [2]);
});

test('every shipped bank is readable — none may be skipped', async () => {
  const files = bankFiles(path.join(import.meta.dirname, '../../src/data'));
  assert.ok(files.length > 50, `expected the real corpus, found ${files.length} bank(s)`);
  for (const f of files) {
    const { questions } = await readBank(f);
    assert.ok(Array.isArray(questions) && questions.length > 0, `${f} read as empty`);
  }
});
