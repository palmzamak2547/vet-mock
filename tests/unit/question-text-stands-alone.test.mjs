// ============================================================
// question-text-stands-alone.test.mjs — the words on screen need nothing else
// ============================================================
// A student sees a stem, the options in shuffled order, and after answering
// an explanation. Nothing else: no source page, no slide, no answer outline,
// and no idea which option was "B" in the file. Three ways the bank broke that:
//
// 1. A past-paper stem lost its negation. swine-clinic:8042 asked which option
//    IS a PCV-2 disease, listed four that are, and keyed "ผิดทุกข้อ" — the
//    explanation then argued that "all wrong" meant "all right". The sat page
//    prints "ข้อใดไม่ใช่รอยโรค…", the same as the Vet 81 copy (8241).
// 2. Explanations named an option by letter or position ("ข้อ B ผิด",
//    "ตัวเลือกแรก…"). Question.jsx shuffles every MCQ and letters the rows by
//    display position, so that letter points at a different row on screen.
// 3. Stems pointed at something only the author had open: "ตามคำอธิบาย",
//    "โครงคำตอบข้อเขียน", "ที่กำกับไว้ว่า", a figure that is not attached.
//    lint:question-voice reads ตามบทเรียน but not these.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import { carriesFigure } from '../../scripts/lib/question-standard.mjs';

const questions = [];
for (const entry of BANK_REGISTRY) {
  const bank = await entry.load();
  for (const q of (Array.isArray(bank) ? bank : [])) questions.push(q);
}
const find = (subject, id) => questions.find((q) => q.subject === subject && q.id === id);
const label = (q) => `${q.subject}:${q.id}`;

// The papers these three guardrails were written for. Other subjects still
// carry older instances; widening the scope is a separate, measured change.
const SUBJECTS = new Set(['swine-clinic', 'aquatic-clinic', 'zoonoses']);
const inScope = questions.filter((q) => SUBJECTS.has(q.subject));

// ── 1. A none-of-the-above key and its explanation agree ─────

const NONE_KEY = /^\s*(?:ผิดทุกข้อ|ไม่มีข้อ(?:ใด|ไหน)?(?:กล่าว)?ถูก|none of the above)/i;
const EVERY_OPTION_RIGHT = /ทุกข้อถูก|ถูกทุกข้อ|ถูกหมด|all (?:the )?(?:options|choices) are (?:correct|true)/i;
// On a "which is NOT…" stem, "every option is right" is exactly why nothing is
// the exception, so only a stem with no negation turns it into a contradiction.
const NEGATIVE_STEM = /ไม่|มิใช่|มิได้|ยกเว้น|ผิด|\bnot\b|\bexcept\b|incorrect|\bfalse\b/i;

test('a none-of-the-above key never answers a positive stem whose explanation says every option is right', () => {
  const contradictions = questions
    .filter((q) => Array.isArray(q.options) && Number.isInteger(q.answer))
    .filter((q) => NONE_KEY.test(String(q.options[q.answer] ?? '')))
    .filter((q) => !NEGATIVE_STEM.test(String(q.q || '')))
    .filter((q) => EVERY_OPTION_RIGHT.test(String(q.explain || '')))
    .map(label);
  assert.deepEqual(contradictions, []);
});

test('the Vet 80 PCV-2 item asks for the exception, as the sat page prints it', () => {
  const q = find('swine-clinic', 8042);
  assert.ok(q, 'swine-clinic:8042 is missing');
  assert.match(q.q, /ข้อใดไม่ใช่/, 'the stem must ask which option is NOT caused by PCV-2');
  assert.equal(q.answer, 4);
  assert.equal(q.options[4], 'ผิดทุกข้อ');
});

// ── 2. Explanations never point at an option by position ─────

const TH = '\\u0E00-\\u0E7F';
const BY_POSITION = [
  new RegExp(`(?<![${TH}])(?:ข้อ|ตัวเลือก|ตอบ|คำตอบ(?:คือ|ที่ถูก(?:คือ)?)?)\\s*\\(?([ก-จ])\\)?(?=$|[\\s.,)\\]:：;+/=—–-])`),
  new RegExp(`(?<![${TH}A-Za-z])(?:ข้อ|ตัวเลือก|ตอบ|คำตอบ(?:คือ)?|choice|option|answer(?: is)?)\\s*\\(?([A-Ea-e])\\)?(?![A-Za-z0-9${TH}.])`),
  /ตัวเลือก(?:แรก|ที่(?:หนึ่ง|สอง|สาม|สี่|ห้า)|สุดท้าย|ที่\s*[1-5](?!\d))|(?:สอง|สาม)?ข้อแรก|ข้อสุดท้าย|(?:first|second|third|last) option/i,
];
// Matches that are not about option order at all, each with its reason.
const NOT_POSITIONAL = {
  202161: '"amoxicillin จึงไม่ใช่ตัวเลือกแรก" means it is not the first-line drug',
};

test('explanations in the swine, aquatic and zoonoses banks never name an option by letter or position', () => {
  const shuffled = inScope.filter((q) => Array.isArray(q.options) && q.options.length >= 2
    && Number.isInteger(q.answer) && (!q.type || q.type === 'mcq'));
  const hits = shuffled
    .filter((q) => !NOT_POSITIONAL[q.id])
    .filter((q) => BY_POSITION.some((re) => re.test(String(q.explain || ''))))
    .map(label);
  assert.deepEqual(hits, []);
});

// ── 3. Stems and options point at nothing the student cannot see ─

// Pointers at a source document, a lesson, or an answer outline.
const SOURCE_POINTER = /ตามคำอธิบาย|โครงคำตอบ|ถูกยกมา|ข้อเขียน(?:กลางภาค|ปลายภาค|ไฟนอล)|ในบทเรียน/;
// Pointers at a label or a figure; fine when the figure is attached.
const FIGURE_POINTER = /กำกับไว้|กำกับว่า|ในรูป(?!แบบ)|ในภาพ(?!รวม)|จากรูป(?!แบบ)|จากภาพ(?!รวม)|ตามรูป(?!แบบ)|ตามภาพ/;
// Known, and left for after the exams. May only shrink.
const RESIDUAL = {
  104006: 'needs the deck figure attached; without it, 6 feet is as defensible as the keyed 3 feet',
  104005: '"ตามเส้นเวลาการแพร่เชื้อในบทเรียน" — the timeline wording needs a reread before it changes',
  104010: '"ตามตัวอย่างในบทเรียน" carries lecture-specific numbers; dropping it can make the key arguable',
  104011: '"ตามวัตถุประสงค์ในบทเรียน" — reword with the lecture open',
  105165: '"ที่พิมพ์กำกับไว้" — reword with the slide open',
};

test('stems and options in the swine, aquatic and zoonoses banks point at no unseen source or figure', () => {
  const hits = [];
  for (const q of inScope) {
    if (RESIDUAL[q.id]) continue;
    const texts = [q.q, ...(Array.isArray(q.options) ? q.options : [])].map((t) => String(t ?? ''));
    const pointsAtSource = texts.some((t) => SOURCE_POINTER.test(t));
    const pointsAtFigure = !carriesFigure(q) && texts.some((t) => FIGURE_POINTER.test(t));
    if (pointsAtSource || pointsAtFigure) hits.push(label(q));
  }
  assert.deepEqual(hits, []);
});
