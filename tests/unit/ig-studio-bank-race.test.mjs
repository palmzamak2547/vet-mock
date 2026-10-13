// ============================================================
// ig-studio-bank-race.test.mjs: the IG studio counts its pool whenever the
// year's banks arrive, and draws from every year
// ============================================================
// Smoke e2e on 5.145.0 and 5.146.0 (WebKit, first attempt): the studio said
// "กำลังเตรียมคลังข้อสอบ…" for 30 s and never counted. Its first render read
// an empty bank, the year's banks merged before its effect ran, and the
// effect, seeing questions, neither loaded nor recounted, so the pool stayed
// at 0. Reproduced in WebKit by holding the bank chunks 100-400 ms past the
// studio's own chunk: 2 of 21 loads stuck with only the year's 61 chunks
// fetched. On the other loads the pool was 4,022 or 6,366 by timing alone,
// while the subject picker lists every year.
// ============================================================

import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, textOf } from '../helpers/fake-react.mjs';

let Studio;
before(async () => {
  ({ default: Studio } = await loadModule('src/views/IgCardStudioView.jsx', {
    stubs: [
      { match: '/data/questions\\.js$', contents: `
        const s = () => globalThis.__igBank;
        // The pool memo is the render's last read of the bank; with
        // mergeAfterRender the year's merge lands right after it, before
        // the effect runs.
        export const QB = {
          get length() { return s().merged ? s().questions.length : 0; },
          filter(fn) {
            const out = s().merged ? s().questions.filter(fn) : [];
            if (s().mergeAfterRender) s().merged = true;
            return out;
          },
        };
        // pendingLoad: every year's banks are still on their way.
        export const loadQB = () => {
          s().loads += 1;
          if (s().pendingLoad) return new Promise(() => {});
          s().merged = true;
          return Promise.resolve(QB);
        };` },
      { match: '/question-delivery\\.generated\\.js$', contents: 'export const isQuestionDeliverable = () => true;' },
      { match: '/data/curriculum\\.js$', contents: "export const SUBJECTS = [{ id: 'zoonoses', name: 'Zoonoses', year: 5 }];" },
      { match: '/data/art\\.js$', contents: "export const IG_BACKGROUNDS = [{ id: 'none', label: 'ไม่มีลาย', src: null }];" },
      { match: '/BackBar\\.jsx$', contents: 'export default function BackBar() { return null; }' },
      { match: '/share-card/', contents: 'export const drawIgCard = () => ({ card: {}, problems: [] }); export const ensureCardFonts = async () => {}; export const toBlob = async () => null; export const triggerDownload = () => {};' },
    ],
  }));
});

const QUESTIONS = [
  { id: 1, type: 'tf', subject: 'zoonoses', question: 'ข้อหนึ่ง' },
  { id: 2, type: 'mcq', subject: 'zoonoses', question: 'ข้อสอง', options: ['ก', 'ข', 'ค'] },
];

test('the year\'s banks merging between the first render and its effect are counted at once', async () => {
  // The other years are still loading, so only the merged year can give the count.
  globalThis.__igBank = { questions: QUESTIONS, merged: false, mergeAfterRender: true, pendingLoad: true, loads: 0 };
  const studio = mount(Studio, { goHome() {} });
  await settle(studio);
  assert.match(textOf(studio.tree), /สุ่มจากข้อสอบ 2 ข้อ/, 'the pool is counted, not left preparing');
  assert.doesNotMatch(textOf(studio.tree), /กำลังเตรียมคลังข้อสอบ/);
  assert.equal(globalThis.__igBank.loads, 1, 'and every year is still asked for');
});

test('a studio that opens on one year\'s banks still asks for every year', async () => {
  globalThis.__igBank = { questions: QUESTIONS, merged: true, mergeAfterRender: false, loads: 0 };
  const studio = mount(Studio, { goHome() {} });
  await settle(studio);
  assert.equal(globalThis.__igBank.loads, 1, 'the subject picker lists every year, so the pool loads every year');
  assert.match(textOf(studio.tree), /สุ่มจากข้อสอบ 2 ข้อ/);
});
