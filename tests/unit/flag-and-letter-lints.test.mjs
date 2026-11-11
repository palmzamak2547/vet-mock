// The two lints of 11 Nov 2026 (docs/releases/pending/quiet-labels.md):
// a minor note that disputes the key, and an option named by its letter on a
// shuffled card. Both run over the whole bank in lint:data; these pin what
// each one catches and lets through.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QB, loadQB } from '../../src/data/questions.js';
import { disputedMinors, DISPUTE_WORDS } from '../../scripts/lint-flag-severity.mjs';
import { letterCitingShuffled, LETTERS_ARE_CONTENT } from '../../scripts/lint-option-letters.mjs';
import { optionLetterCitations } from '../../scripts/lib/option-letters.mjs';

await loadQB();

test('no minor note in the bank disputes its key, and the word list catches one that does', () => {
  assert.deepEqual(disputedMinors(QB), []);
  const minor = (note) => ({ subject: 's', id: 1, flag: { severity: 'minor', note } });
  for (const note of ['ข้อนี้จึงเถียงได้ระหว่างสองคู่', 'แปลว่าโจทย์อาจกำกวม', 'คู่นี้ก็ถูกเช่นกัน', 'the key is outdated']) {
    assert.equal(disputedMinors([minor(note)]).length, 1, note);
  }
  assert.equal(disputedMinors([{ ...minor('เถียงได้'), flag: { severity: 'major', note: 'เถียงได้' } }]).length, 0, 'a major may say it');
  assert.equal(disputedMinors([minor('ให้ยึดตามที่สอนในหัวข้อนี้ปีนี้')]).length, 0);
  assert.ok(DISPUTE_WORDS.includes('กำกวม'));
});

test('no shuffled question names an option by its letter', () => {
  assert.deepEqual(letterCitingShuffled(QB), []);
  const q = (explain, extra = {}) => ({ subject: 's', id: 1, type: 'mcq', options: ['ก', 'ข', 'ค', 'ง'], explain, ...extra });
  assert.equal(letterCitingShuffled([q('สาเหตุอื่น → C ผิด เพราะ...')]).length, 1);
  assert.equal(letterCitingShuffled([q('A: ผิดเพราะ ... \n B ถูก')]).length, 1);
  assert.equal(letterCitingShuffled([q('ส่วนข้อ D เป็นตัวลวง')]).length, 1);
  assert.equal(letterCitingShuffled([q('→ C ผิด', { noShuffle: true })]).length, 0, 'a question that keeps its order may');
  assert.equal(optionLetterCitations(q('Vitamin A: สำคัญต่อการมองเห็น')).length, 0, 'a letter after a word is not an option');
  assert.equal(optionLetterCitations(q('→ E ผิด')).length, 0, 'no fifth option, no fifth letter');
  // Every question kept in order for its letters is a real multiple-choice question.
  const held = QB.filter((x) => x.noShuffle === true && optionLetterCitations(x).length);
  assert.ok(held.length >= 35, `questions held in order for their letters (${held.length})`);
  for (const x of held) assert.equal(x.type, 'mcq', `${x.subject}:${x.id}`);
  for (const k of LETTERS_ARE_CONTENT.keys()) assert.ok(QB.some((x) => `${x.subject}:${x.id}` === k), `${k} is in the bank`);
});
