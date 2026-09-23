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
//
// PF-19. A live race polls every 2 s, and every snapshot re-resolved the
// whole question set (up to 50 bank.find scans plus a revision hash each)
// and handed React a new array. The resolved list is now reused while the
// room, its start, its question set and their revisions are unchanged.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getShuffledOptions } from '../../src/lib/option-shuffle.js';
import { isCorrect } from '../../src/hooks/utils.js';
import { questionRevision } from '../../src/lib/study-events.js';
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
  // The reveal marks rows by the same source index, so the tick lands on the
  // row showing the key and the cross on the row that was clicked.
  has(TODAY, /const correctIdx = q\.answer;/);
  has(TODAY, /const isCorrectAnswer = i === correctIdx;/);
  has(TODAY, /const isPicked = picked === i;/);
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

// ── PF-19: the 2 s poll ────────────────────────────────────────

const clone = (value) => JSON.parse(JSON.stringify(value));
const roomOf = (qs, over = {}) => ({
  code: 'A3C7F2', host_id: 'host', started_at: '2026-09-23T03:00:00+00:00', year: 5, subject: 'swine-herd',
  question_ids: qs.map((q) => q.id),
  question_versions: Object.fromEntries(qs.map((q) => [q.id, questionRevision(q)])),
  participants: { host: { idx: 0, correct: 0, finished: false } },
  ...over,
});
function countingBank(qs) {
  const bank = [...qs];
  bank.scans = 0;
  bank.find = function find(fn) { this.scans++; return Array.prototype.find.call(this, fn); };
  return bank;
}
const twenty = () => Array.from({ length: 20 }, (_, i) => keyedAtB(i + 1));

test('a repeat poll of the same room reuses the resolved list instead of re-scanning the bank', async () => {
  assert.equal(typeof race.createRaceQuestionCache, 'function',
    'no cache: every 2 s poll re-resolves the whole question set');
  const qs = twenty();
  const bank = countingBank(qs);
  let loads = 0;
  const loadYear = async () => { loads++; };
  const resolve = race.createRaceQuestionCache();
  const first = await resolve(roomOf(qs), bank, loadYear);
  assert.deepEqual(first.map((q) => q.id), qs.map((q) => q.id));
  const scans = bank.scans;
  // Each poll parses a fresh snapshot, and other players' progress moves;
  // neither is a reason to resolve the questions again.
  const later = clone(roomOf(qs, { participants: { host: { idx: 4, correct: 3, finished: false }, guest: { idx: 2, correct: 2, finished: false } } }));
  const second = await resolve(later, bank, loadYear);
  assert.equal(second, first, 'same room and set, but React was handed a new array');
  assert.equal(bank.scans, scans, 'the bank was scanned again for an unchanged set');
  assert.equal(loads, 1, 'the year was reloaded for an unchanged set');
});

test('a poll and an answer reply in flight together share one resolve', async () => {
  const qs = twenty();
  const bank = countingBank(qs);
  let loads = 0;
  const resolve = race.createRaceQuestionCache();
  const [a, b] = await Promise.all([
    resolve(roomOf(qs), bank, async () => { loads++; }),
    resolve(clone(roomOf(qs)), bank, async () => { loads++; }),
  ]);
  assert.equal(a, b);
  assert.equal(loads, 1);
});

test('a restarted room, another room, a new set or new revisions resolve again', async () => {
  const qs = twenty();
  const bank = countingBank(qs);
  const resolve = race.createRaceQuestionCache();
  const reversed = qs.map((q) => q.id).reverse();
  const cases = [
    ['restarted', { started_at: '2026-09-23T03:05:00+00:00' }, qs.map((q) => q.id)],
    ['another room', { code: 'B4D8E1' }, qs.map((q) => q.id)],
    ['new set', { question_ids: reversed }, reversed],
  ];
  // Each case follows a fresh resolve of the base room, so it is compared
  // with a warm cache for that room, not with the case before it.
  for (const [label, over, ids] of cases) {
    const warm = await resolve(roomOf(qs), bank, async () => {});
    const next = await resolve(roomOf(qs, over), bank, async () => {});
    assert.notEqual(next, warm, `${label}: served the previous list`);
    assert.deepEqual(next.map((q) => q.id), ids, `${label}: wrong questions`);
  }
  // Revisions the local bank does not match are still refused, not served
  // from the cache: the server would score against a different key. Each is
  // asked right after the same room and set resolved, so a cache key that
  // ignored the revisions would hand back that warm list here.
  const changed = { ...roomOf(qs).question_versions, [qs[0].id]: 'r-other' };
  for (const versions of [{}, changed]) {
    await resolve(roomOf(qs), bank, async () => {});
    await assert.rejects(resolve(roomOf(qs, { question_versions: versions }), bank, async () => {}), /คนละรุ่น/);
  }
});

test('a failed resolve is retried on the next poll, not remembered', async () => {
  const qs = twenty();
  const bank = countingBank([]);
  const resolve = race.createRaceQuestionCache();
  // The bank chunk has not arrived yet (a reconnect on a cold cache).
  await assert.rejects(resolve(roomOf(qs), bank, async () => {}), /ไม่ครบ/);
  bank.push(...qs);
  const list = await resolve(roomOf(qs), bank, async () => {});
  assert.deepEqual(list.map((q) => q.id), qs.map((q) => q.id));
});

test('the race view resolves its snapshots through the cache', () => {
  has(RACE, /createRaceQuestionCache\(\)/);
  lacks(RACE, /await resolveRaceQuestions\(/, 'applySnapshot still re-resolves every snapshot');
});
