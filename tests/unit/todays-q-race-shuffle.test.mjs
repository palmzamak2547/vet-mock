// ============================================================
// Race and ข้อวันนี้ show the options in the shuffled order
// ============================================================
// CONTENT-13. The exam screen renders every MCQ through getShuffledOptions,
// so an author's habit of parking the key at B never reaches a student
// there. Race and the daily question mapped q.options in source order under
// A-E chips, so in the banks where the key sits at B far more often than
// chance (swine-herd: 67% of keys at B) the letter gave the answer away.
//
// Race carries a second constraint. The room's answer key is stored by
// SOURCE index (api/race-start keeps q.answer) and answer_race compares
// p_answer against it, so the row the student clicked must be translated
// back to its source index before it is sent. Server scoring is unchanged.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getShuffledOptions } from '../../src/lib/option-shuffle.js';
import { isCorrect } from '../../src/hooks/utils.js';
// A namespace import, so a missing export fails its own test with a message
// instead of failing the whole file at link time.
import * as race from '../../src/lib/race-session.js';

const RACE = readFileSync(new URL('../../src/views/RaceView.jsx', import.meta.url), 'utf8');
const TODAY = readFileSync(new URL('../../src/components/TodaysQModal.jsx', import.meta.url), 'utf8');
// Source checks that name the missing line instead of dumping the file.
const has = (src, re, why = `missing ${re}`) => assert.ok(re.test(src), why);
const lacks = (src, re, why) => assert.ok(!re.test(src), why);

// Keyed at B, the position the biased banks favour.
const keyedAtB = (id) => ({
  id, subject: 'swine-herd', type: 'mcq', answer: 1,
  options: ['option-0', 'option-1 (the key)', 'option-2', 'option-3'],
});

// ── CONTENT-13: Race ───────────────────────────────────────────

test('race rows follow the exam-screen shuffle and carry the source index the room is keyed on', () => {
  assert.equal(typeof race.raceOptionRows, 'function',
    'race-session has no raceOptionRows: Race still renders q.options in source order');
  let keyLeftB = 0;
  for (let id = 1; id <= 400; id++) {
    const q = keyedAtB(id);
    const rows = race.raceOptionRows(q);
    assert.deepEqual(rows.map((r) => r.text), getShuffledOptions(q).displayOptions,
      `q${id}: Race shows a different order from the exam screen`);
    for (const r of rows) {
      assert.equal(q.options[r.original], r.text,
        `q${id}: the row showing "${r.text}" would send the source index of "${q.options[r.original]}"`);
    }
    const keyRow = rows.findIndex((r) => r.text === q.options[q.answer]);
    // Clicking the row that shows the key sends its source index, which is
    // exactly what the room stored as the key, so the server scores it correct.
    assert.equal(rows[keyRow].original, q.answer, `q${id}: the key row does not send the stored key`);
    if (keyRow !== 1) keyLeftB++;
  }
  // Without this, a source-order render would pass every assertion above.
  assert.ok(keyLeftB > 250, `the key left row B on only ${keyLeftB}/400 questions`);
});

test('the race screen renders those rows and sends the source index to answer_race', () => {
  lacks(RACE, /q\.options\.map\(/, 'Race still maps q.options in source order');
  has(RACE, /raceOptionRows\(q\)\.map\(\(\{ text, original \}, row\) =>/);
  // The click hands answer() the SOURCE index, and answer() forwards it
  // untouched as p_answer, the value answer_race compares with the key.
  has(RACE, /onClick=\{\(\) => answer\(original\)\}/);
  has(RACE, /const answer = option => act\(/);
  has(RACE, /ownedRpc\(owner, 'answer_race', \{ p_code: code, p_index: idx, p_answer: option \}\)/);
  // The chip names the row the student sees, and the text is that row's.
  has(RACE, /String\.fromCharCode\(65 \+ row\)/);
  has(RACE, /<RichText text=\{text\} \/>/);
});

// ── CONTENT-13: ข้อวันนี้ ──────────────────────────────────────────

test('ข้อวันนี้ renders the shuffled order and records the source index of the clicked row', () => {
  has(TODAY, /import \{ getShuffledOptions \} from '\.\.\/lib\/option-shuffle\.js';/);
  lacks(TODAY, /q\.options\.map\(/, 'ข้อวันนี้ still maps q.options in source order');
  has(TODAY, /const \{ displayOptions, displayToOriginal \} = getShuffledOptions\(q\);/);
  has(TODAY, /displayOptions\.map\(\(opt, row\) => \{\s*const i = displayToOriginal\[row\];/);
  has(TODAY, /onClick=\{\(\) => pickAnswer\(i\)\}/);
  has(TODAY, /String\.fromCharCode\(65 \+ row\)/);
});

test('in ข้อวันนี้ a click on the row showing the key registers correct, and every other row wrong', () => {
  let keyLeftB = 0;
  for (let id = 1; id <= 400; id++) {
    const q = keyedAtB(id);
    // What the modal does per rendered row.
    const { displayOptions, displayToOriginal } = getShuffledOptions(q);
    displayOptions.forEach((text, row) => {
      const i = displayToOriginal[row];
      const showsKey = text === q.options[q.answer];
      assert.equal(isCorrect(q, i), showsKey,
        `q${id}: clicking row ${String.fromCharCode(65 + row)} ("${text}") scored ${isCorrect(q, i) ? 'correct' : 'wrong'}`);
      // The reveal highlights the row whose source index is the key.
      assert.equal(i === q.answer, showsKey);
      if (showsKey && row !== 1) keyLeftB++;
    });
  }
  assert.ok(keyLeftB > 250, `the key left row B on only ${keyLeftB}/400 questions`);
});
