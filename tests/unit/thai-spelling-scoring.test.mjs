// A typed Thai answer that looks like the key is the key.
//
// Two spellings look the same on screen and differ in code points: SARA AM
// typed as NIKHAHIT plus SARA AA (U+0E4D U+0E32), and a tone mark typed before
// the vowel above or below its consonant. NFC joins neither, so a student who
// typed the right word was marked ผิด (scoring-invariants.test.mjs on
// claude/structural-guards listed both). isCorrect, which the leaderboard's
// re-score imports too (api/_lib/exam-scoring.js), now puts both sides in one
// form before comparing. Scoring: this may only turn a look-alike into right.
// The proof is the whole bank: every typed question, answered with its own key
// (and its unordered blanks reversed, and a short answer's keywords), gets the
// same verdict from the scorer as it is and from the scorer with that one step
// taken out.
import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { QB, loadQB } from '../../src/data/questions.js';
import { isCorrect, keywordHit } from '../../src/hooks/utils.js';

let without;
let qb;
const SOURCE = readFileSync(new URL('../../src/hooks/utils.js', import.meta.url), 'utf8');
const STEP = /const thaiSpelling = \(s\) => s\r?\n(?:\s+\.replace\([^\n]*\)\r?\n?)+;/;
before(async () => {
  assert.match(SOURCE, STEP, 'the normalisation step moved: update this test with it');
  const dir = mkdtempSync(join(tmpdir(), 'thai-spelling-'));
  const file = join(dir, 'utils-without.mjs');
  writeFileSync(file, SOURCE.replace(STEP, 'const thaiSpelling = (s) => s;'));
  without = await import(pathToFileURL(file).href);
  rmSync(dir, { recursive: true, force: true });
  qb = QB.length ? QB : await loadQB();
});

const TYPED = new Set(['fill', 'short']);
function answersFor(q) {
  if (q.type === 'fill') {
    const out = [q.blanks.map(String)];
    if (q.unordered) out.push(q.blanks.map(String).reverse());
    return out;
  }
  const out = [];
  if (q.model_answer) out.push(String(q.model_answer));
  if (Array.isArray(q.keywords) && q.keywords.length) out.push(q.keywords.join(' '));
  return out;
}

test('every typed answer in the bank gets the same verdict with and without the step', () => {
  let compared = 0;
  const changed = [];
  for (const q of qb) {
    if (!TYPED.has(q.type)) continue;
    for (const ua of answersFor(q)) {
      compared += 1;
      const a = without.isCorrect(q, ua);
      const b = isCorrect(q, ua);
      if (a !== b) changed.push(`${q.subject}#${q.id} ${a} -> ${b}`);
    }
  }
  assert.ok(compared > 300, `typed answers compared: ${compared}`);
  assert.deepEqual(changed, []);
});

test('the step can only add matches: a look-alike of every key is right, a wrong word stays wrong', () => {
  const lookAlike = (s) => String(s).normalize('NFC')
    .replace(/([่-๋]?)ำ/g, 'ํ$1า')
    .replace(/([ัิ-ฺ็])([่-์])/g, '$2$1');
  let touched = 0;
  for (const q of qb) {
    if (q.type !== 'fill') continue;
    const typed = q.blanks.map(lookAlike);
    if (typed.join('|') === q.blanks.map(String).join('|')) continue;
    touched += 1;
    assert.equal(isCorrect(q, typed), isCorrect(q, q.blanks.map(String)), `${q.subject}#${q.id}: its own key typed the other way`);
  }
  assert.ok(touched > 0);
});

const fill1 = (key) => ({ id: 1, subject: 'test', type: 'fill', q: 'คำตอบคือ ____', blanks: [key] });
test('SARA AM and a tone before the vowel above, alone and inside a longer answer', () => {
  // น้ำ typed as น + ้ + ํ + า, and as น + ํ + ้ + า
  assert.equal(isCorrect(fill1('น้ำ'), ['น้ํา']), true);
  assert.equal(isCorrect(fill1('น้ำ'), ['นํ้า']), true);
  assert.equal(isCorrect(fill1('ทำ'), ['ทํา']), true);
  // กิ่ง typed with MAI EK before SARA I
  assert.equal(isCorrect(fill1('กิ่ง'), ['ก่ิง']), true);
  assert.equal(isCorrect(fill1('ปั๊ม'), ['ป๊ัม']), true);
  // Inside a longer answer
  assert.equal(isCorrect(fill1('น้ำตาล'), ['ระดับน้ําตาลในเลือด']), true);
  assert.equal(isCorrect(fill1('กิ่งก้าน'), ['ส่วนก่ิงก้านของพืช']), true);
  // A short answer's keyword checklist reads the same form
  assert.equal(keywordHit('ให้ดื่มน้ํามาก ๆ', 'น้ำ'), true);
  assert.equal(without.isCorrect(fill1('น้ำ'), ['น้ํา']), false, 'the case this fixes was wrong before');
  // A different word stays wrong
  assert.equal(isCorrect(fill1('น้ำ'), ['นำ']), false);
  assert.equal(isCorrect(fill1('กิ่ง'), ['กิง']), false);
});

test('Latin drug names and numbers are untouched', () => {
  assert.equal(isCorrect(fill1('ketamine'), ['Ketamine']), true);
  assert.equal(isCorrect(fill1('ketamine'), ['ketamin']), without.isCorrect(fill1('ketamine'), ['ketamin']));
  assert.equal(isCorrect(fill1('15'), ['150']), false);
  assert.equal(isCorrect(fill1('2:1'), ['2:1']), true);
  assert.equal(isCorrect(fill1('ivermectin'), ['ivermectin 0.2 mg/kg']), without.isCorrect(fill1('ivermectin'), ['ivermectin 0.2 mg/kg']));
});

test('how many keys the step can touch', () => {
  let am = 0;
  let stacked = 0;
  for (const q of qb) {
    if (!TYPED.has(q.type)) continue;
    const text = q.type === 'fill' ? q.blanks.join(' ') : [q.model_answer, ...(q.keywords || [])].join(' ');
    if (/ำ|ํา/.test(text)) am += 1;
    if (/[ัิ-ฺ็][่-์]|[่-์][ัิ-ฺ็]/.test(text)) stacked += 1;
  }
  // Printed for the release notes; the numbers move with the bank.
  console.log(`typed questions whose key holds SARA AM: ${am}; a tone or thanthakhat with a vowel above or below: ${stacked}`);
  assert.ok(am >= 0 && stacked >= 0);
});
