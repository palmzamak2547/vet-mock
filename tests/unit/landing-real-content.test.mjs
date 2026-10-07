// ============================================================
// landing-real-content.test.mjs — what the landing shows is what VetMock has
// ============================================================
// The landing's demo question is a real bank item, shown as the bank has it.
// It is copied into dict.js (the landing must not pull the bank to paint), so
// this holds every copied string to the item and fails when either drifts.
//
// Palm, 2026-10-07: the page does not call the bank "ข้อสอบเก่า" or past
// papers, the demo question is one written from lecture content rather than
// from a post-exam recall set, and the terms page says plainly that the
// questions are practice questions and not the official papers.
//
// Every file the landing names under public/ has to exist, or a visitor gets
// a broken image, a silent video or the fallback font.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const load = (rel) => import(pathToFileURL(join(ROOT, rel)).href);

const { DICT, HERO_QUESTION: H } = await load('src/views/landing/dict.js');
const { QB, loadQB } = await load('src/data/questions.js');
const { isPastPaperQuestion } = await load('src/lib/question-metadata.js');
const { isQuestionDeliverable } = await load('src/data/question-delivery.generated.js');
await loadQB();
const bank = QB.find((q) => q.id === H.id);

test('the demo question is the bank item, word for word', () => {
  assert.ok(bank, `bank item ${H.id} is gone`);
  assert.equal(H.q, bank.q);
  assert.deepEqual(H.options, bank.options);
  assert.equal(H.answer, bank.answer);
  assert.equal(H.subject, bank.subject);
  assert.equal(H.year, bank.year);
  // Every line the card shows is cut from the bank's own explanation.
  const lines = [H.why, H.note, H.noteLead, H.tip, DICT.th.noteHead, ...Object.values(H.wrong)];
  for (const line of lines) assert.ok(bank.explain.includes(line), `not in the bank's explanation: ${line}`);
  // One reason per wrong option, none for the answer.
  assert.deepEqual(Object.keys(H.wrong).map(Number).sort(), H.options.map((_, i) => i).filter((i) => i !== H.answer));
  for (const [i, why] of Object.entries(H.wrong)) {
    assert.ok(bank.explain.includes(`— ${H.options[i]} = ${why}`), `the reason for option ${i} is not the bank's`);
  }
});

test('the demo question was written from a lecture, not from a recall set', () => {
  assert.equal(bank.sourceType, 'lecture-derived');
  assert.equal(bank.examOrigin, undefined);
  assert.equal(isPastPaperQuestion(bank), false);
  assert.ok(isQuestionDeliverable(bank), 'the bank no longer serves this question, so the landing demos one nobody can open');
  // The page it cites is the page the bank verified it against.
  assert.match(bank.verified, new RegExp(`น\\.${H.page}$`));
  assert.match(DICT.th.sourceDoc, new RegExp(`หน้า ${H.page}$`));
  assert.match(DICT.en.sourceDoc, new RegExp(`page ${H.page}$`));
});

// Every string the dictionary can produce, function entries called with
// sample arguments, so a template like keepGoing(n) is read too.
function strings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (typeof value === 'function') {
    // The templates take counts and flags, or ISO dates (the exam range).
    let made;
    try { made = value(12, true); } catch { made = value('2026-10-12', '2026-10-16'); }
    strings(made, out);
  }
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
  return out;
}

test('the landing never calls the bank old exams or past papers', () => {
  const all = [...strings(DICT), ...strings(H)];
  assert.ok(all.length > 300, 'the scan reads the dictionary');
  const banned = /ข้อสอบเก่า|past[- ]?papers?|past exams?|old exams?/i;
  assert.deepEqual(all.filter((s) => banned.test(s)), []);
});

test('the terms say the questions are practice questions, and the links reach them', () => {
  const terms = read('src/views/PrivacyView.jsx');
  assert.match(terms, /<h3>โจทย์ใน VetMock ไม่ใช่ข้อสอบ<\/h3>/);
  assert.match(terms, /ไม่ใช่ข้อสอบฉบับทางการ/);
  assert.match(terms, /id="terms"/);
  assert.match(terms, /id="privacy"/);
  assert.match(read('src/lib/view-route.js'), /privacy: '\/app\/privacy'/);
  const pages = read('src/views/landing/LandingBody.jsx') + read('src/views/LandingView.jsx');
  for (const href of ['/app/privacy#terms', '/app/privacy#privacy']) {
    assert.ok(pages.includes(`href="${href}"`), `the landing no longer links ${href}`);
  }
});

test('every file the landing names under public/ exists', () => {
  const sources = ['src/views/LandingView.jsx', 'src/views/landing/LandingBody.jsx', 'src/views/landing/XraySkull.jsx', 'src/styles-landing.css']
    .map(read).join('\n');
  const paths = [...new Set([...sources.matchAll(/['"(](\/(?:landing|fonts|images)\/[^'")?#\s]+)/g)].map((m) => m[1]))];
  assert.ok(paths.length >= 6, `the scan finds the landing's files (${paths.length})`);
  for (const p of paths) assert.ok(existsSync(join(ROOT, 'public', p)), `public${p} is missing`);
  // Licences travel with the files that need them.
  assert.ok(existsSync(join(ROOT, 'public/landing/ATTRIBUTION.md')));
  assert.ok(existsSync(join(ROOT, 'public/fonts/noto-serif-thai-OFL.txt')));
});
