// ============================================================
// read-aloud-live-text.test.mjs — what a voice is given, and what is marked
// ============================================================
// The live voices read livePlan's pieces (tts.js): each piece's `say` is the
// text the device voice and the cloud voice receive, and its `from` is the
// word of the whole text it starts at, which the highlight marks from. The
// p1 clips (tts-shared.js sharedPlan) carry the same `from`. These tests read
// both off the plans, so a regular expression that lost its backslash (`/s+/`
// deleting every "s", `/S+/` counting no words) fails here.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

const kanya = { name: 'Kanya', lang: 'th-TH', voiceURI: 'Kanya', localService: true };
const samantha = { name: 'Samantha', lang: 'en-US', voiceURI: 'Samantha', localService: true };
globalThis.window = {
  speechSynthesis: { getVoices: () => [kanya, samantha], addEventListener() {}, removeEventListener() {}, speak() {}, cancel() {} },
  localStorage: (() => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; })(),
  addEventListener() {},
  matchMedia: () => ({ matches: true }),
};
globalThis.localStorage = globalThis.window.localStorage;

let p1Manifest = null;
globalThis.fetch = async (url) => {
  const u = String(url);
  if (u.includes('/p1/m/') && p1Manifest) return new Response(JSON.stringify(p1Manifest), { status: 200 });
  return new Response('not found', { status: 404 });
};

const text = await import('../../src/lib/tts-text.js');
const live = await import('../../src/lib/tts.js');
const shared = await import('../../src/lib/tts-shared.js');

const words = (s) => String(s).match(/\S+/g) || [];
const THAI_MARK = /^[ัิ-ฺ็-๎]/;

test('an English question: the voice is given every letter, the s too', async () => {
  const stem = 'Which drug is used against Ascaris suum in pigs? Give the dose.';
  const plan = await live.livePlan({ stem, options: ['Ivermectin is used', 'Fenbendazole tablets'] });
  assert.equal(plan.lang, 'en');
  const said = plan.parts.map((p) => p.say).join(' | ');
  for (const w of ['is used', 'against', 'Ascaris suum', 'pigs?', 'dose', 'Ivermectin is used', 'tablets']) assert.ok(said.includes(w), `"${w}" in ${said}`);
  assert.doesNotMatch(said, / {2}/, 'no doubled space where a letter was');
});

test('a Thai question with Latin names: the names reach the voice whole', async () => {
  const stem = 'ข้อใดเป็นสาเหตุของโรคข้ออักเสบในลูกสุกร Streptococcus suis หรือ Haemophilus parasuis';
  const plan = await live.livePlan({ stem, options: ['ให้ยา penicillin', 'ไม่ต้องรักษา'] });
  assert.equal(plan.lang, 'th');
  const said = plan.parts.map((p) => p.say).join(' | ');
  // The Thai voice gets English terms in Thai spelling where it knows them;
  // whatever stays in Latin letters keeps every letter.
  const asked = new Set(`${stem} penicillin A B`.match(/[A-Za-z]+/g)); // A and B: the option labels
  assert.match(said, /suis/);
  assert.match(said, /parasuis/);
  for (const w of said.match(/[A-Za-z]+/g) || []) assert.ok(asked.has(w), `"${w}" is a word of the question, not one with letters lost`);
  assert.doesNotMatch(said, / {2}/, 'no doubled space where a letter was');
  for (const p of plan.parts) assert.equal(p.say, p.say.trim());
});

test('a stem of several sentences: each piece starts at its own words, so the mark moves on', async () => {
  const sentences = [
    'สุกรอายุสามสัปดาห์มีอาการไอ หอบ และมีไข้สูงหลังย้ายเข้าคอกอนุบาล.',
    'ผลชันสูตรพบปอดอักเสบแบบมีหนองร่วมกับเยื่อหุ้มปอดอักเสบชัดเจน.',
    'สัตวแพทย์เก็บตัวอย่างส่งตรวจทางห้องปฏิบัติการเพื่อยืนยันเชื้อก่อโรค.',
    'ข้อใดเป็นเชื้อที่น่าจะเป็นสาเหตุมากที่สุดในกรณีนี้ และควรรักษาอย่างไร?',
  ];
  const stem = sentences.join(' ');
  const plan = await live.livePlan({ stem, options: [] });
  const pieces = plan.parts.filter((p) => p.kind === 'stem');
  assert.ok(pieces.length >= 2, `${pieces.length} pieces`);
  const all = words(pieces[0].full);
  let expected = 0;
  for (const p of pieces) {
    assert.equal(p.from, expected, `piece "${p.text.slice(0, 20)}" starts at word ${expected}`);
    // The words marked are the piece's own words.
    assert.deepEqual(all.slice(p.from, p.from + words(p.text).length), words(p.text));
    expected += words(p.text).length;
  }
  assert.ok(pieces[1].from > 0, 'the second piece is not marked from the first word');
});

test('the p1 clips carry the same word offsets', async () => {
  const stem = `${'สุกรอายุสามสัปดาห์มีอาการไอ หอบ และมีไข้สูงหลังย้ายเข้าคอกอนุบาลหลายวันติดต่อกัน. '.repeat(4)}ข้อใดถูกต้อง?`;
  const lang = text.questionLang(stem, []);
  const full = text.clipText(stem, lang);
  const segs = text.clipParts(full, text.PAXA_TTS);
  assert.ok(segs.length >= 2, `${segs.length} parts`);
  p1Manifest = { complete: true, keys: await Promise.all(segs.map((s) => text.clipKey(s, text.PAXA_TTS))) };
  const plan = await shared.sharedPlan({ stem, options: [], lang, subject: 'p1-offsets', prefetch: false });
  p1Manifest = null;
  assert.ok(plan, 'the p1 plan is chosen');
  assert.equal(plan[0].gen, 'p1');
  let expected = 0;
  for (const p of plan) {
    assert.equal(p.from, expected);
    expected += words(p.text).length;
  }
  assert.ok(plan[1].from > 0);
});

test('a missing p1 manifest is not a finished subject', async () => {
  const set = await shared.loadManifest('never-made', text.PAXA_TTS);
  assert.ok(set, 'a 404 reads as an empty list');
  assert.equal(set.complete, false);
});

test('a long Thai run with no space is cut between words, never before a vowel or tone mark', () => {
  // The opening words put a tone or vowel mark at characters 160 and 220,
  // where a cut by length alone would fall.
  const run = `กระบือแพะ${'การตรวจโรคสัตว์ไม่ได้ทำให้ผลผลิตเสียหายแต่ช่วยป้องกันการแพร่ระบาดของเชื้อในฟาร์ม'.repeat(5)}`;
  assert.match(run[160] + run[220], /^[ัิ-ฺ็-๎]{2}$/);
  for (const opt of [{ max: 160, min: 30 }, { max: 220, min: 40 }]) {
    const parts = text.clipSegments(run, opt);
    assert.ok(parts.length >= 2, `${parts.length} parts`);
    assert.equal(parts.join(''), run, 'no letter lost or added');
    const seg = new Intl.Segmenter('th', { granularity: 'word' });
    const bounds = new Set([...seg.segment(run)].map((s) => s.index));
    let at = 0;
    for (const p of parts) {
      assert.ok(p.length <= opt.max);
      assert.doesNotMatch(p, THAI_MARK, `"${p.slice(0, 6)}" starts with a lone mark`);
      assert.doesNotMatch(p, /[เ-ไ]$/, 'a leading vowel stays with its consonant');
      assert.ok(at === 0 || bounds.has(at), `cut at ${at} is a word boundary`);
      at += p.length;
    }
  }
});

test('a piece cut inside a Thai run starts in the word the piece before it ends in', () => {
  const run = 'การตรวจโรคสัตว์ไม่ได้ทำให้ผลผลิตเสียหาย'.repeat(6);
  const full = `ข้อ ${run} ใช่หรือไม่`;
  const segs = text.clipSegments(full, { max: 160, min: 30 });
  assert.ok(segs.length >= 2);
  const starts = text.segmentStarts(full, segs);
  assert.equal(starts[0], 0);
  assert.equal(starts[1], 1, 'the second piece is still inside the long run, word 1');
  // Spaces between pieces may differ from the text's own (a line break, two spaces).
  assert.deepEqual(text.segmentStarts('aa bb\ncc  dd', ['aa bb', 'cc dd']), [0, 2]);
});
