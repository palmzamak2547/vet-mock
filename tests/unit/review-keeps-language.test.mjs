// The review page keeps the bank's words and the student's own as written in English. Each answer it
// draws sits in an element of its own marked lang="th", which the translator skips
// (src/lib/ui-translate.js), so "หัวใจ" stays หัวใจ and not the game's "Hearts", while the words around it
// ("คุณตอบ", "เฉลย", "ไม่ได้ตอบ") translate. Drawn by the real components.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { compileDictionary, translateString } from '../../src/lib/ui-translate.js';
import UI_EN from '../../src/data/ui-en.js';
import { QB_EXOTIC } from '../../src/data/questions-exotic.js';
import { QUESTIONS_MID86_EQUINE_MEDICINE } from '../../src/data/questions-mid86-equine-medicine.js';

const sourceRoot = new URL('../../src/', import.meta.url).href;
registerHooks({
  load(url, context, nextLoad) {
    if (url.startsWith(sourceRoot) && url.endsWith('.jsx')) {
      const { code } = transformSync(readFileSync(new URL(url), 'utf8'), { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: url });
      return { format: 'module', shortCircuit: true, source: code };
    }
    return nextLoad(url, context);
  },
});
const { MatchReview } = await import('../../src/components/AnswerReveal.jsx');
const { default: ReviewView } = await import('../../src/views/ReviewView.jsx');

const kept = (html, text) => html.includes(`<span lang="th">${text}</span>`);

test('a matching set in review keeps every answer as written', () => {
  const q = QUESTIONS_MID86_EQUINE_MEDICINE.find((x) => x.id === 202394);
  const rights = q.pairs.map((p) => p.right);
  // The first row wrong: the review opens on it alone, with the pick and the key.
  const wrong = renderToStaticMarkup(createElement(MatchReview, { q, userAns: [rights[1], ...rights.slice(1)], answered: true }));
  for (const text of [rights[1], rights[0]]) assert.ok(kept(wrong, text), `${text} is not kept: ${wrong}`);
  const right = renderToStaticMarkup(createElement(MatchReview, { q, userAns: rights, answered: true }));
  for (const text of rights) assert.ok(kept(right, text), `${text} is not kept`);
});

test('the words around a kept answer read in English on their own', () => {
  const dict = compileDictionary(UI_EN);
  for (const [th, en] of [
    ['คุณตอบ ', 'You answered '], ['เฉลย ', 'Answer '], [' — มีข้อที่พลาด', ' — some questions were missed'],
    ['จับคู่ข้อ 3', 'Match item 3'], ['[ใช้แล้ว]', '[Used]'], ['— เลือกคำตอบ —', '— Choose an answer —'],
  ]) assert.equal(translateString(th, dict), en);
});

test('a choice in review keeps the bank\'s words, the pick and the key alike', () => {
  const q = QB_EXOTIC.find((x) => x.id === 50053);
  const pick = q.options.indexOf('หัวใจ');
  assert.notEqual(pick, q.answer, 'the pick is wrong, so the key shows too');
  const html = renderToStaticMarkup(createElement(ReviewView, {
    questions: [q], answers: { [q.id]: pick }, bookmarks: [], toggleBookmark() {}, goHome() {}, setView() {},
    notes: {}, setNote() {}, user: null, selectedYear: 5,
  }));
  for (const text of ['หัวใจ', q.options[q.answer]]) assert.ok(kept(html, text), `${text} is not kept`);
});
