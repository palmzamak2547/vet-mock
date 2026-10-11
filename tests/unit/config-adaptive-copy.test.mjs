import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DIFFICULTY_MIN_ATTEMPTS } from '../../src/lib/elo.js';

// The config screen's adaptive chip. Two promises are checked against what the
// engine keeps: the screen still names the subject and topic the set comes
// from, and the chip only says questions are matched to the student's level
// when measured difficulty actually exists for the pool on screen.

const sourceRoot = new URL('../../src/', import.meta.url).href;
registerHooks({
  load(url, context, nextLoad) {
    if (url.startsWith(sourceRoot) && url.endsWith('.jsx')) {
      const { code } = transformSync(readFileSync(new URL(url), 'utf8'), {
        loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: url,
      });
      return { format: 'module', shortCircuit: true, source: code };
    }
    return nextLoad(url, context);
  },
});
const { default: ConfigView, adaptiveHelpText } = await import('../../src/views/ConfigView.jsx');

const render = (props) => renderToStaticMarkup(createElement(ConfigView, {
  practiceMode: 'adaptive', setPracticeMode() {}, subject: 'equine-medicine', topic: 'equine-intro',
  numQuestions: 10, setNumQuestions() {}, useTimer: false, setUseTimer() {}, timePerQ: 60, setTimePerQ() {},
  questionCategory: 'all', setQuestionCategory() {}, instantFeedback: true, setInstantFeedback() {},
  startExam() {}, goHome() {}, availableCount: 30, availablePool: null, mode: 'quick', ...props,
}));

test('choosing adaptive keeps the subject and topic on screen', () => {
  const adaptive = render({});
  const ordinary = render({ practiceMode: 'all' });
  const subjectLine = 'เวชปฏิบัติม้า + ศัลย์';
  assert.ok(ordinary.includes(subjectLine), 'fixture premise: the ordinary screen names the subject');
  assert.ok(adaptive.includes(subjectLine), 'the adaptive screen must still name the subject');
  assert.ok(adaptive.includes('Course intro'), 'and the topic');
  assert.equal((adaptive.match(/ประวัติการตอบ/g) || []).length <= 1, true,
    'the adaptive explanation appears once, in the chip helper, not three times');
});

const pool = Array.from({ length: 40 }, (_, i) => ({ id: 900 + i, subject: 'equine-medicine' }));
const trusted = (ids) => Object.fromEntries(ids.map((id) => [String(id), { rating: 1400, n: DIFFICULTY_MIN_ATTEMPTS }]));

test('with no measured difficulty the chip does not promise level matching', () => {
  for (const data of [{}, { 900: { rating: 1400, n: DIFFICULTY_MIN_ATTEMPTS - 1 } }, trusted([5])]) {
    const text = adaptiveHelpText({ data, pool });
    assert.match(text, /ยังมีคนตอบไม่พอ/, JSON.stringify(data));
    assert.match(text, /สุ่ม/);
    assert.doesNotMatch(text, /ยากพอดีกับคุณ/);
  }
});

test('with measured difficulty the chip says how much of this pool it can place', () => {
  const text = adaptiveHelpText({ data: trusted([900, 901, 902]), pool });
  assert.match(text, /ยากพอดีกับคุณ/);
  assert.match(text, /3 จาก 40 ข้อ/);
  assert.doesNotMatch(text, /ง่ายไปยาก/, 'the order is not promised: past-paper sets are re-sorted by id');
});

test('loading and failure states say what they are', () => {
  assert.match(adaptiveHelpText({ data: undefined, pool }), /กำลังตรวจ/);
  assert.match(adaptiveHelpText({ data: trusted([900]), pool: null }), /กำลังตรวจ/);
  assert.match(adaptiveHelpText({ data: null, pool }), /โหลด.*ไม่ได้/);
});

test('the copy has no middle dot separators', () => {
  const samples = [
    adaptiveHelpText({ data: {}, pool }), adaptiveHelpText({ data: trusted([900]), pool }),
    adaptiveHelpText({ data: undefined, pool }), adaptiveHelpText({ data: null, pool }), render({}),
  ];
  for (const sample of samples) assert.equal(sample.includes('·'), false);
});
