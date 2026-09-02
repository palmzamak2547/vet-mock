import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { lintQuestions, loadQuestions } = require('../../scripts/lint-questions.cjs');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-questions-'));
fs.writeFileSync(path.join(tmp, 'package.json'), '{"type":"module"}\n');
after(() => fs.rmSync(tmp, { recursive: true, force: true }));

function writeJsonBank(name, question, header = '') {
  const file = path.join(tmp, name);
  const body = `${header}export const QUESTIONS_FIXTURE = ${JSON.stringify([question], null, 2)};\n`;
  fs.writeFileSync(file, body);
  return file;
}

const egregiousQuestion = {
  id: 990001,
  subject: 'fixture-subject',
  topic: 'quoted-keys',
  year: 1,
  type: 'mcq',
  q: 'ข้อใดถูกต้อง',
  options: [
    'A',
    'B',
    'คำตอบที่ถูกต้องซึ่งยาวกว่าตัวลวงอย่างผิดปกติมากจนเดาได้โดยไม่ต้องรู้เนื้อหา',
    'D',
  ],
  answer: 2,
  explain: 'fixture',
};

test('loads a JSON-shaped quoted-key bank and catches its egregious length tell', async () => {
  const file = writeJsonBank('questions-json-shaped.js', egregiousQuestion);
  const questions = await loadQuestions({ files: [file], rootDir: tmp });

  assert.equal(questions.length, 1, 'quoted-key question must be counted');
  assert.equal(questions[0].id, egregiousQuestion.id);
  assert.equal(questions[0].file, 'questions-json-shaped.js', 'finding keeps bank attribution');

  const result = lintQuestions(questions);
  assert.equal(result.errors.length, 1);
  assert.deepEqual(
    result.errors.map(({ kind, id }) => ({ kind, id })),
    [{ kind: 'length-bias', id: egregiousQuestion.id }],
  );
});

test('keeps a reasoned file-level length-bias exemption', async () => {
  const file = writeJsonBank(
    'questions-faithful-paper.js',
    { ...egregiousQuestion, id: 990002 },
    '// lint:length-bias-exempt: faithful transcription of a real exam fixture\n',
  );
  const questions = await loadQuestions({ files: [file], rootDir: tmp });
  const result = lintQuestions(questions);

  assert.equal(result.errors.length, 0);
  assert.equal(result.suppressed, 1, 'exempt finding must still be counted');
});
