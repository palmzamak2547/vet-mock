// ============================================================
// read-aloud-card-text.test.mjs — the voice reads what the card shows
// ============================================================
// Long stems are drawn as a body and an ask (SplitStem, 5.236.0) and tables
// as tables. The read-aloud is handed wholeStem / wholeExplain. Here the
// card's own components are rendered and their visible text compared with
// the text the voice is given: the same words in the same order, for the two
// long equine stems the typesetting change touched and for a stem whose
// numbers sit in a table.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const compiled = buildSync({
  entryPoints: [fileURLToPath(new URL('../../src/components/RichBlocks.jsx', import.meta.url))],
  bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', packages: 'external', write: false,
});
const mod = { exports: {} };
new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { SplitStem, default: RichBlocks } = mod.exports;
const { splitStem, wholeStem, wholeExplain } = await import('../../src/lib/rich-blocks.js');
const { stripForSpeech, clipText, questionLang } = await import('../../src/lib/tts-text.js');
const { QB, loadQB } = await import('../../src/data/questions.js');
await loadQB();

const visible = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ');
// Letters and digits only: layout (line breaks, list markers drawn by CSS) is not words.
const squash = (s) => String(s).replace(/[^\p{L}\p{N}]/gu, '');

// The stem as the card draws it (Question.jsx: SplitStem when the stem splits, else the text whole).
function cardStem(q) {
  const text = q.q;
  const split = splitStem(text);
  if (!split) return text;
  return visible(renderToStaticMarkup(createElement(SplitStem, { text, split, ask: (c) => createElement('h2', null, c) })));
}
const cardExplain = (q) => visible(renderToStaticMarkup(createElement(RichBlocks, { text: q.explain })));

for (const id of ['209588', '209599']) {
  test(`question ${id}: the voice's stem and explanation are the card's, word for word`, () => {
    const q = QB.find((x) => String(x.id) === id);
    assert.ok(q, `question ${id} is in the bank`);
    assert.ok(splitStem(q.q), 'its stem is drawn split (the case 5.236.0 changed)');
    assert.equal(squash(stripForSpeech(wholeStem(q))), squash(cardStem(q)));
    if (q.explain && !q.explainSay) assert.equal(squash(stripForSpeech(wholeExplain(q))), squash(cardExplain(q)));
    // And what reaches a voice keeps every number the card shows.
    const nums = (s) => (String(s).match(/\d+(?:\.\d+)?/g) || []).join(' ');
    assert.equal(nums(clipText(wholeStem(q), questionLang(wholeStem(q), []))), nums(cardStem(q)));
  });
}

test('a stem with a table: every value the table shows is read', () => {
  const q = QB.find((x) => typeof x.say === 'string' && x.say && /\|/.test(x.passage || x.q || ''))
    || QB.find((x) => /\n\|/.test(x.q || ''));
  assert.ok(q, 'a question with a table');
  const spoken = stripForSpeech(wholeStem(q));
  const shownSource = q.passage && q.say ? `${q.passage}\n${q.q}` : q.q;
  const shown = visible(renderToStaticMarkup(createElement(RichBlocks, { text: shownSource })));
  const values = (x) => String(x).match(/\d+(?:[./]\d+)*/g) || [];
  const tokens = values(shown);
  // A table is said a column or a row at a time, as its writer phrased it: every value, each as often as shown.
  const said = values(spoken);
  for (const t of tokens) {
    const k = said.indexOf(t);
    assert.ok(k >= 0, `"${t}" of the table is read (question ${q.id})`);
    said.splice(k, 1);
  }
  assert.ok(tokens.length > 0);
});
