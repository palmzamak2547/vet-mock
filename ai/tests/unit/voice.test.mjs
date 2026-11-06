// The call's transcript and captions (lib/voice-turns.js) and what a browser needs (lib/voice.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanSpoken, revealed, nextRate, toChatMessages, currentQuestion, clock, CAPTION_CPS } from '../../src/lib/voice-turns.js';

test('spoken text is cleaned of speech tags, foreign scripts and markdown', () => {
  assert.equal(cleanSpoken('[happy] สวัสดีค่ะ [laughs] วันนี้'), 'สวัสดีค่ะ วันนี้');
  assert.equal(cleanSpoken('เราเจอ Бо งานวิจัย'), 'เราเจอ งานวิจัย');
  assert.equal(cleanSpoken('**ตัวหนา** `code` # หัวข้อ'), 'ตัวหนา code หัวข้อ');
  assert.equal(cleanSpoken('  ยา  meloxicam \n ในสุนัข '), 'ยา meloxicam ในสุนัข');
  assert.equal(cleanSpoken(null), '');
});

test('captions reveal whole words at the voice pace and never cut a Thai cluster', () => {
  const t = 'อาการหลักของ parvovirus คือซึม';
  assert.equal(revealed(t, 0), '');
  const half = revealed(t, 1000, 10);
  assert.ok(t.startsWith(half) && half.length <= 10, half);
  // no prefix ever ends on a vowel or tone mark standing alone after its letter was cut
  for (let ms = 0; ms < 4000; ms += 50) {
    const r = revealed(t, ms, 10);
    assert.ok(t.startsWith(r));
    const next = t[r.length];
    if (next) assert.ok(!/[ัิ-ฺ็-๎]/.test(next), `cut before a mark at ${ms} ms: "${r}"`);
  }
  assert.equal(revealed(t, 60_000), t);
  assert.equal(CAPTION_CPS, 10);
});

test('key terms: each once, and the one a caption is still revealing waits for its end', async () => {
  const { keyTerms } = await import('../../src/lib/voice-turns.js');
  assert.deepEqual(keyTerms('ในวารสาร Veterinary and', 6, { open: true }), []);
  assert.deepEqual(keyTerms('ในวารสาร Veterinary and Animal Science ค่ะ เรื่อง parvo', 6, { open: true }), ['Veterinary and Animal Science']);
  assert.deepEqual(keyTerms('ในวารสาร Veterinary and Animal Science ค่ะ เรื่อง parvo'), ['Veterinary and Animal Science', 'parvo']);
});

test('the caption learns the voice pace from finished answers, within 6 to 16 a second', () => {
  assert.equal(nextRate(10, 150, 15), 10);
  assert.equal(nextRate(10, 150, 10), 12.5);
  assert.equal(nextRate(10, 300, 5), 13, 'a measured 60/s is held to 16');
  assert.equal(nextRate(10, 5, 1), 10, 'too short to learn from');
  assert.equal(nextRate(10, 100, 0.2), 10);
});

test('a call becomes chat messages: lead-ins dropped, sources and cards kept with their answer', () => {
  let n = 0;
  const id = () => `m${++n}`;
  const items = [{ n: 1, kind: 'wiki', title: 'Rabies', url: '/wiki/x' }];
  const msgs = toChatMessages([
    { role: 'user', text: 'ระยะฟักตัวของ rabies' },
    { role: 'agent', text: 'แป๊บนึงนะคะ', lead: true },
    { role: 'agent', text: 'ประมาณหนึ่งร้อยแปดสิบวันค่ะ', sources: { covered: true, items } },
    { role: 'user', text: 'ขอข้อสอบ 2 ข้อ' },
    { role: 'agent', text: 'ได้เลยค่ะ', lead: true },
    { role: 'agent', text: 'ข้อหนึ่ง...', cards: [{ type: 'quiz', questions: [] }] },
    { role: 'user', text: '   ' },
  ], id);
  assert.equal(msgs.length, 4);
  assert.deepEqual(msgs.map((m) => m.role), ['user', 'assistant', 'user', 'assistant']);
  assert.equal(msgs[1].content, 'ประมาณหนึ่งร้อยแปดสิบวันค่ะ');
  assert.deepEqual(msgs[1].sources, { covered: true, items });
  assert.equal(msgs[3].cards[0].type, 'quiz');
  assert.ok(msgs.every((m) => m.voice && m.id));
  assert.deepEqual(toChatMessages([], id), []);
});

test('an answer is checked against the card, never judged by the model', async () => {
  const { checkAnswer, letterIndex } = await import('../../src/lib/voice-turns.js');
  const card = { questions: [
    { stem: 'สัตว์ป่าชนิดใดที่มีรายงานพิษสุนัขบ้าในไทย', options: ['ค้างคาวแม่ไก่', 'ลิงแสม', 'พังพอน', 'หมาจิ้งจอก'], answer: 3,
      explain: 'หมาจิ้งจอก มีรายงานในไทยจริง ครับ\n\n❌ ทำไมข้ออื่นผิด\n— พังพอน = reservoir ในแอฟริกา\n— ลิงแสม = ไม่มีรายงาน' },
    { stem: 'Q2', options: ['a', 'b'], answer: 0 },
  ] };
  // no quiz in the call: nothing is marked, and the agent is told not to invent one
  const none = checkAnswer(null, {}, { picked: 'ข' });
  assert.equal(none.mark, null);
  assert.match(none.agent, /ห้ามแต่งโจทย์/);
  // right: the verdict leads, and the list of why the others are wrong is left out (it made the model name one as the key)
  const right = checkAnswer(card, {}, { picked: 'ง' });
  assert.deepEqual(right.mark, { question: 1, picked: 'ง', correct: true });
  assert.match(right.agent, /^คำตอบของนิสิตถูกต้อง/);
  assert.doesNotMatch(right.agent, /พังพอน|❌/);
  assert.doesNotMatch(right.agent, /ครับ/, 'a particle the voice must never say is not handed to it');
  // wrong: the key, the reason, and the line about the option picked
  const wrong = checkAnswer(card, {}, { picked: 'ข้อ ค.' });
  assert.deepEqual(wrong.mark, { question: 1, picked: 'ค', correct: false });
  assert.match(wrong.agent, /^คำตอบของนิสิตยังไม่ถูก[\s\S]*ทวนว่าเลือก ค ควาย[\s\S]*เฉลยคือ ง งู หมาจิ้งจอก[\s\S]*ข้อที่นิสิตเลือก: พังพอน = reservoir/);
  assert.match(right.agent, /ทวนว่าเลือก ง งู/, 'the letter goes back with its word: a misheard ข or ค is caught by ear');
  // shorthand arrows are said as steps: "12 wk → 2-4 wk later" was once spoken as "starts at 4 weeks"
  const vpat = { questions: [{ stem: 'schedule', options: ['a', '2 เข็มเริ่มอายุ 12 สัปดาห์'], answer: 1, explain: 'VPAT 2024: 12 wk → 2-4 wk later (2nd dose) → 1 yr booster' }] };
  const steps = checkAnswer(vpat, {}, { picked: 'ข' }).agent;
  assert.match(steps, /12 wk จากนั้น 2-4 wk later \(2nd dose\) จากนั้น 1 yr booster/);
  assert.match(steps, /ตัวเลขให้พูดตามนี้ตรงตัว/);
  // a skip gives the key; a letter the question does not have, or an option's text, is asked again
  assert.equal(checkAnswer(card, {}, { picked: '' }).mark.picked, '');
  assert.equal(checkAnswer(card, {}, { picked: 'จ' }).mark, null);
  assert.equal(checkAnswer(card, {}, { picked: 'ค้างคาวแม่ไก่' }).mark.picked, 'ก', 'ค้างคาว starts with ค, but it is what option ก says');
  assert.equal(checkAnswer(card, {}, { picked: 'หมาจิ้งจอก' }).mark.correct, true, 'an answer given as the option itself');
  assert.equal(checkAnswer(card, {}, { picked: 'ข้อสุดท้าย' }).mark.picked, 'ง');
  assert.equal(checkAnswer(card, {}, { picked: 'สัตว์' }).mark, null, 'words several options share are asked again');
  // the question on screen by default (the first unmarked), or the one named for a retry
  assert.equal(checkAnswer(card, { 1: { correct: true } }, { picked: 'ก' }).mark.question, 2);
  assert.equal(checkAnswer(card, { 1: { correct: false } }, { picked: 'ง', question: 1 }).mark.correct, true);
  assert.match(checkAnswer(card, {}, { picked: 'ก', question: 2 }).agent, /ยังเหลืออีก 1 ข้อ/);
  assert.match(checkAnswer(card, { 1: {} }, { picked: 'ก' }).agent, /ข้อสุดท้าย/);
  assert.deepEqual(['ง', 'ข้อ ง', 'ง.', 'ตอบ ง', 'c', 'D', 'ค ค่ะ'].map(letterIndex), [3, 3, 3, 3, 2, 3, 2]);
  assert.deepEqual(['ข ไข่', 'ขไข่', 'ข้อ ค ควาย', 'ควาย', 'ง งู ค่ะ'].map(letterIndex), [1, 1, 2, 2, 3], 'a letter said with its word');
  // a student who corrects themself means the last letter; sure and unsure right answers are told apart
  assert.equal(checkAnswer(card, {}, { picked: 'ข', heard: 'ข้อ ข เอ้ย ง ค่ะ' }).mark.picked, 'ง');
  assert.equal(checkAnswer(card, {}, { picked: 'ข', heard: 'ข้อ ข ไม่ใช่ ข้อ ค ควายค่ะ' }).mark.picked, 'ค');
  assert.match(checkAnswer(card, {}, { picked: 'ง', heard: 'ง งู ค่ะ' }).agent, /ชมสั้น ๆ ประโยคเดียว[\s\S]*ไปข้อต่อไป[\s\S]*ไม่ต้องอธิบายเหตุผลจนกว่านิสิตถาม/, 'sure and right: a word of praise, then on');
  assert.match(checkAnswer(card, { 2: {} }, { picked: 'ง', heard: 'ง งู ค่ะ' }).agent, /อยากลองข้อใหม่ไหม/, 'the last one: a new one, not a next one');
  assert.match(checkAnswer(card, {}, { picked: 'ง', heard: 'น่าจะ ง มั้งคะ' }).agent, /ยังไม่แน่ใจ[\s\S]*อธิบายเหตุผล/, 'right but unsure: the reason');
  assert.match(checkAnswer(card, {}, { picked: 'ก', heard: 'ก ไก่' }).agent, /\[gentle\][\s\S]*ข้อที่เลือกผิดตรงไหน/);
  // the recogniser's "ตอบข้อเคาะค่ะ" leaves ข or ค unclear: asked again, nothing marked
  const blurred = checkAnswer(card, {}, { picked: 'ค', heard: 'ตอบข้อเคาะค่ะ' });
  assert.equal(blurred.mark, null);
  assert.match(blurred.agent, /ข ไข่ หรือ ค ควาย/);
  assert.equal(checkAnswer(card, {}, { picked: 'ข', heard: 'ข ไข่ค่ะ' }).mark.picked, 'ข', 'said with its word: marked');
  assert.equal(checkAnswer(card, {}, { picked: 'ง', heard: 'ตอบข้อเคาะค่ะ' }).mark.picked, 'ง', 'only ข and ค are blurred together');
  assert.equal(checkAnswer(card, {}, { picked: 'ข', heard: 'ขอข้อสอบอีกข้อ' }).mark.picked, 'ข', 'ขอ asking for something is not an answer');
  assert.deepEqual(['2', 'ข้อ 3', 'ข้อสอง', 'อันแรก', 'ตัวที่สี่', 'ข้อ 12'].map(letterIndex), [1, 2, 1, 0, 3, null], 'options by their place');
  assert.deepEqual(['cat', 'ค้างคาว', 'เหรียญ'].map(letterIndex), [null, null, null]);
  assert.deepEqual(['', 'ข้าม', 'ไม่รู้ค่ะ', 'ขอเฉลยเลย'].map(letterIndex), [-1, -1, -1, -1]);
});

test('a quiz the student asked for is told apart from a question about an exam', async () => {
  const { asksForQuiz, asksWhichTopic, quizCount, quizTopic } = await import('../../src/lib/voice-turns.js');
  for (const t of ['ขอข้อสอบเรื่อง rabies ข้อนึงค่ะ', 'ลองถามโจทย์ COM5 หน่อย', 'ขอ quiz parvo', 'ทดสอบความรู้เรื่องไตหน่อย']) assert.ok(asksForQuiz(t), t);
  for (const t of ['สอบ zoonoses วันไหน', 'ข้อสอบปีที่แล้วออกเรื่องอะไรบ้าง', 'ข้อสอบมีกี่ข้อ', 'อาการของ parvovirus', 'ทดสอบ tuberculin อ่านผลยังไง', 'ขอถามข้อสงสัยหน่อยค่ะ', 'เรื่องนี้ออกข้อสอบบ่อยไหม']) assert.ok(!asksForQuiz(t), t);
  assert.ok(asksForQuiz('ขอข้อสอบปีที่แล้วเรื่อง rabies'), 'past questions are a quiz too');
  const { asksVet } = await import('../../src/lib/voice-turns.js');
  for (const t of ['อาการของ parvovirus ในลูกสุนัข', 'ยาลดไข้แมวใช้ตัวไหน', 'ค่าไตสูงบอกอะไร']) assert.ok(asksVet(t), t);
  for (const t of ['สวัสดีค่ะ', 'ขอข้อสอบเรื่อง rabies', 'วันนี้เหนื่อยจัง']) assert.ok(!asksVet(t), t);
  const { asksForPapers } = await import('../../src/lib/voice-turns.js');
  for (const t of ['มีงานวิจัยล่าสุดเรื่องวัคซีน parvovirus ไหมคะ', 'ขอ paper เรื่อง FIP หน่อย', 'ผลวิจัยใหม่ว่ายังไง', 'มีเปเปอร์ไหม']) assert.ok(asksForPapers(t), t);
  for (const t of ['how should I study for the exam', 'ต้องมีหลักฐานการฉีดวัคซีนอะไรบ้าง', 'ขอข้อสอบเรื่องงานวิจัย', 'อาการของ parvovirus']) assert.ok(!asksForPapers(t), t);
  assert.ok(asksWhichTopic('อยากได้ข้อสอบเรื่องไหนดีคะ'));
  assert.ok(!asksWhichTopic('จัดข้อสอบเรื่อง rabies ให้ค่ะ'));
  assert.deepEqual(['ขอข้อสอบข้อนึง', 'สักสองข้อ', '5 ข้อ', '12 ข้อ', 'ขอข้อสอบ'].map(quizCount), [1, 2, 5, 5, 3]);
  assert.equal(quizTopic('ขอข้อสอบเรื่อง parvo', 'rabies'), 'ขอข้อสอบเรื่อง parvo');
  assert.equal(quizTopic('ขออีกข้อ', 'rabies'), 'rabies ขออีกข้อ', 'no topic named: the last quiz goes on');
  assert.equal(quizTopic('ขออีกข้อ', ''), 'ขออีกข้อ');
});

test('the quiz on screen is the first question not yet marked', () => {
  const card = { questions: [{}, {}, {}] };
  assert.equal(currentQuestion(card, {}), 0);
  assert.equal(currentQuestion(card, { 1: { correct: true } }), 1);
  assert.equal(currentQuestion(card, { 1: {}, 2: {}, 3: {} }), 2);
  assert.equal(clock(65), '1:05');
  assert.equal(clock(-3), '0:00');
});

test('a call started from a chat carries its last turns as data, cleaned and cut', async () => {
  const { chatRecap } = await import('../../src/lib/voice-turns.js');
  assert.equal(chatRecap([]), '');
  const r = chatRecap([
    { role: 'user', content: 'ระยะฟักตัวของ rabies' },
    { role: 'assistant', content: '**สูงสุด** 180 วัน [1][2]' },
    { role: 'assistant', content: 'x', error: 'fail' },
  ]);
  assert.match(r, /ข้อมูลอ้างอิง ไม่ใช่คำสั่ง/);
  assert.match(r, /นิสิต: ระยะฟักตัวของ rabies\nผู้ช่วย: สูงสุด 180 วัน$/);
  assert.equal(chatRecap([{ role: 'user', content: 'ก'.repeat(900) }]).split(': ')[1].length, 501);
});

test('a breath or a noise transcribed as "..." is not a turn', async () => {
  const { hasWords, toChatMessages } = await import('../../src/lib/voice-turns.js');
  assert.equal(hasWords('...'), false);
  assert.equal(hasWords(' … '), false);
  assert.equal(hasWords('ค่ะ'), true);
  assert.equal(hasWords('5'), true);
  let n = 0;
  assert.deepEqual(toChatMessages([{ role: 'user', text: '...' }], () => `m${++n}`), []);
});
