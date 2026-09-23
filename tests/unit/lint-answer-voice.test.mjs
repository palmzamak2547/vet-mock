// ============================================================
// An explanation explains; it does not narrate its source
// ============================================================
// Four explanations and one note callout still told the reader what
// "นักศึกษา" usually get wrong — a word this app has deliberately dropped
// (นิสิต, never นักศึกษา), and a third-person frame an explanation should not
// use at all: it states the trap as a fact. lint:answer-voice did not know
// the word.
// ============================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { scanQuestions, voiceHits } from '../../scripts/lint-answer-voice.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

let nextId = 995000;
const row = (explain, extra = {}) => ({ id: nextId++, subject: 'fixture', topic: 't', type: 'tf', explain, ...extra });
const rulesOf = (q) => [...new Set(voiceHits(q).map((h) => h.rule))];

test('an explanation that talks about what classmates get wrong is caught', () => {
  for (const explain of [
    'จุดที่นักศึกษามักพลาดคือเหมารวมว่าทั้งสองอย่างใช้เกณฑ์ปริมาณเหมือนกัน',
    'นักศึกษาที่จำสลับมักตอบผิดเป็นสัตว์ปีกน้ำ',
  ]) {
    assert.ok(rulesOf(row(explain)).includes('classmates'), explain);
  }
});

// The live bank: every explanation in the voice of the answer.
const rows = [];
for (const f of fs.readdirSync(path.join(ROOT, 'src/data')).filter((n) => /^questions-.*\.js$/.test(n))) {
  const mod = await import(pathToFileURL(path.join(ROOT, 'src/data', f)).href);
  const entry = Object.values(mod).find(Array.isArray);
  if (entry) for (const q of entry) rows.push({ q, f });
}

test('no explanation in the bank narrates its source', () => {
  assert.ok(rows.length > 6000, `only ${rows.length} rows loaded`);
  const hits = [];
  for (const { q, f } of rows) {
    const { hits: h } = scanQuestions([q], { file: f });
    for (const x of h) hits.push(`#${x.id} ${f} ${x.quote[0]}`);
  }
  assert.deepEqual(hits, []);
});

test('no question text or note uses นักศึกษา for the reader', () => {
  const found = [];
  for (const f of fs.readdirSync(path.join(ROOT, 'src/data')).filter((n) => /^(?:questions|notes)-.*\.js$/.test(n))) {
    const src = fs.readFileSync(path.join(ROOT, 'src/data', f), 'utf8');
    src.split('\n').forEach((line, i) => { if (line.includes('นักศึกษา')) found.push(`${f}:${i + 1}`); });
  }
  assert.deepEqual(found, []);
});
