// ============================================================
// An option that names other options by letter must not be shuffled
// ============================================================
// getShuffledOptions permutes every multiple-choice question per session.
// "ข้อ A และ C ถูก" is pinned last by its tail rule, but the options it
// names move: the cat semen-collection item (repro-lect 1868) put "A" and
// "C" on Digital manipulation and Artificial vagina for some students, and
// the answer the key rewards could not be picked as displayed. The vet-juris
// "ถูกเฉพาะข้อ 1 และ 2" rows were not pinned at all and landed mid-list.
//
// lint:questions now fails such a row unless it sets noShuffle (or the stem
// carries its own numbered list, which is what the letters then point at),
// and fails a reference that cannot resolve at all ("ข้อ 1 และ b").
// ============================================================

import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { getShuffledOptions } from '../../src/lib/option-shuffle.js';

const require = createRequire(import.meta.url);
const { lintQuestions, loadQuestions } = require('../../scripts/lint-questions.cjs');

const base = {
  subject: 'fixture-subject',
  topic: 'fixture-topic',
  year: 4,
  type: 'mcq',
  explain: 'fixture',
};

let nextId = 991000;
const mcq = (q, options, extra = {}) => ({ ...base, id: nextId++, q, options, answer: 0, ...extra });
const letterFindings = (questions) => lintQuestions(questions).findings
  .filter((f) => f.kind.startsWith('option-letter-reference'));

test('an option that names other options by letter fails when the options shuffle', () => {
  const cases = [
    ['ข้อ A และ C ถูก', ['Electroejaculation only', 'ข้อ A และ C ถูก', 'Artificial vagina', 'Digital manipulation']],
    ['ข้อ ก และ ข ถูกต้อง', ['biodegradability', 'biocompatibility', 'optical tracking', 'ข้อ ก และ ข ถูกต้อง', 'price']],
    ['ข้อ 1 และ 3', ['Young dog < 5 kg', 'Animal > 30 kg', 'Cat', 'ข้อ 1 และ 3']],
    ['ถูกเฉพาะข้อ 1 และ 2', ['one', 'two', 'three', 'ถูกเฉพาะข้อ 1 และ 2', 'ถูกทุกข้อ']],
    ['ถูกทั้งข้อ ก ข และ ค', ['one', 'two', 'three', 'none', 'ถูกทั้งข้อ ก ข และ ค']],
    ['ถูกทั้ง A, B, C', ['one', 'two', 'three', 'none', 'ถูกทั้ง A, B, C']],
    ['Both A and C are correct', ['one', 'two', 'three', 'Both A and C are correct']],
  ];
  for (const [label, options] of cases) {
    const found = letterFindings([mcq('การรีดเก็บน้ำเชื้อแมว มักใช้วิธี', options)]);
    assert.equal(found.length, 1, `${label} was not flagged`);
    assert.equal(found[0].severity, 'error', `${label} must fail the gate`);
    assert.equal(found[0].kind, 'option-letter-reference');
  }
});

test('noShuffle, or a numbered list in the stem, makes the same option legitimate', () => {
  const options = ['Electroejaculation only', 'ข้อ A และ C ถูก', 'Artificial vagina', 'Digital manipulation'];
  assert.deepEqual(letterFindings([mcq('การรีดเก็บน้ำเชื้อแมว มักใช้วิธี', options, { noShuffle: true })]), []);

  const listed = mcq(
    'ข้อใดถูกต้อง\n1. ข้อความแรก\n2. ข้อความที่สอง\n3. ข้อความที่สาม',
    ['ข้อ 1 และ 2', 'ข้อ 2 และ 3', 'ข้อ 1 และ 3', 'ถูกทุกข้อ'],
  );
  assert.deepEqual(letterFindings([listed]), [], 'letters that point at the stem list survive a shuffle');
});

test('a reference that cannot resolve fails even when the order is fixed', () => {
  const broken = mcq('เนื้อที่ได้จากการล่า หากนำมาจำหน่ายจะผิดกฎหมายใดบ้าง',
    ['ข้อความหนึ่ง', 'ข้อความสอง', 'ข้อความสาม', 'ถูกเฉพาะข้อ 1 และ b', 'ถูกทุกข้อ'], { noShuffle: true });
  const found = letterFindings([broken]);
  assert.equal(found.length, 1);
  assert.equal(found[0].kind, 'option-letter-reference-broken');
  assert.equal(found[0].severity, 'error');

  const self = mcq('ข้อใดถูก', ['one', 'two', 'ข้อ A และ C ถูก', 'four'], { noShuffle: true });
  assert.equal(letterFindings([self])[0]?.kind, 'option-letter-reference-broken', 'an option cannot name itself');

  const outOfRange = mcq('ข้อใดถูก', ['one', 'two', 'ข้อ A และ F ถูก'], { noShuffle: true });
  assert.equal(letterFindings([outOfRange])[0]?.kind, 'option-letter-reference-broken', 'F does not exist in three options');
});

test('letters that are content, not option references, are left alone', () => {
  const contentLetters = [
    ['จากแผ่น TLC ที่รันสาร known A-E ท่านคิดว่า Unk. ประกอบด้วยสารชนิดใด', ['A และ C', 'B และ C', 'C และ D', 'D และ C', 'E และ C']],
    ['Shoulder sling พันที่ระดับนิ้ว', ['1, 2', '2, 5', '3, 4', 'ทุกนิ้ว']],
    ['วิตามินใดละลายในน้ำ', ['Vitamin A และ D เท่านั้น', 'Vitamin C และ E', 'Vitamin K', 'ไม่มีข้อใดถูก']],
    ['จากกราฟ ระยะใดเปลี่ยนแปลงมากที่สุด', ['ระยะ A และ B', 'ระยะ A และ C', 'ระยะ B และ D', 'ระยะ C และ D']],
    ['serovar ใดใช้ในไทย', ['Serovars A และ C เท่านั้นที่มีใช้ในไทย', 'มี 3 serovars: A, B, C', 'B', 'C']],
    ['ควรฉีดในวันที่เท่าใด', ['วันที่ 1 และ 2', 'วันที่ 3 และ 4', 'วันที่ 2 และ 3', 'วันที่ 4 และ 5']],
    ['Giardia assemblage ใดติดคน', ['Assemblage A และ B (zoonotic)', 'C', 'D', 'E']],
    ['ฉีดวัคซีนแม่สุกรเมื่อใด', ['4 และ 2 สัปดาห์ก่อนคลอด', '6 สัปดาห์', '3 และ 1 สัปดาห์ก่อนคลอด', 'หลังคลอด']],
    ['ข้อใดถูกต้องเกี่ยวกับ DNA', ['จำนวนเบส A + T = G + C', 'ถูกทั้ง 2 ข้อ', 'ผิดทุกข้อ', 'ไม่มีข้อใดถูก']],
    ['ข้อต่อใดเสื่อมบ่อย', ['ข้อศอก และ ข้อเข่า', 'ข้อสะโพก', 'ข้อเท้า', 'ถูกทุกข้อ']],
  ];
  for (const [stem, options] of contentLetters) {
    assert.deepEqual(letterFindings([mcq(stem, options)]), [], `false positive on ${JSON.stringify(options)}`);
  }
});

test('the real corpus has no option that names shuffled options by letter', async () => {
  const questions = await loadQuestions();
  assert.ok(questions.length > 5000, `expected the whole corpus, loaded ${questions.length}`);
  const found = letterFindings(questions);
  assert.deepEqual(found.map((f) => `${f.topic} #${f.id} ${f.kind}: ${f.option}`), []);
});

test('every noShuffle row keeps its authored order on screen', async () => {
  const questions = await loadQuestions();
  const pinned = questions.filter((q) => q.noShuffle === true);
  assert.ok(pinned.length >= 11, `expected the letter-reference rows to set noShuffle, found ${pinned.length}`);
  for (const q of pinned) {
    const { displayOptions, displayToOriginal } = getShuffledOptions(q);
    assert.deepEqual(displayToOriginal, q.options.map((_, i) => i), `${q.subject}:${q.id} was shuffled`);
    assert.deepEqual(displayOptions, q.options);
  }
});

test('the two references that were wrong in source order now name the right options', async () => {
  const questions = await loadQuestions();
  const find = (subject, id) => questions.find((q) => q.subject === subject && q.id === id);

  // repro-lect 1867: the combination named A and D, and D is laparoscopy,
  // which needs general anaesthesia. The two catheters are what it means.
  const ai = find('repro-lect', 1867);
  const combo = ai.options[ai.answer];
  const named = [...combo.matchAll(/ข้อ\s*([A-E])\s*และ\s*([A-E])/g)].flatMap((m) => [m[1], m[2]]);
  if (named.length) {
    assert.equal(ai.noShuffle, true);
    const texts = named.map((l) => ai.options[l.charCodeAt(0) - 65]);
    assert.ok(texts.some((t) => /Scandinavian/.test(t)) && texts.some((t) => /Norwegian/.test(t)),
      `1867 names ${named.join(' และ ')} = ${JSON.stringify(texts)}`);
  } else {
    assert.match(combo, /Scandinavian/);
    assert.match(combo, /Norwegian/);
  }

  // vet-juris 93040: "ถูกเฉพาะข้อ 1 และ b" mixed a digit with a Latin letter.
  const meat = find('vet-juris', 93040);
  assert.ok(meat.options.every((o) => !/ข้อ\s*1\s*และ\s*b/.test(o)), '93040 still reads "1 และ b"');
});
