// ============================================================
// The exam card's chrome, read from the JSX (UI-07, UI-17)
// ============================================================
// UI-07: right above the figure and the stem, one bordered pill read
// "ปรนัย, เวชปฏิบัติม้า + ศัลย์, 📖 COURSE INTRO, กลางภาค" — mono,
// 0.1em tracking, uppercased, comma-joined, with the topic's emoji. It is now
// a quiet row of separate parts; the hairline between them is drawn by CSS,
// so no separator character is written into the copy. The classes the specs
// select on stay: .vmx-qtype-badge on the row, .vmx-scope-chip on the paper.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

function walk(node, visit) {
  if (!node || typeof node.type !== 'string') return;
  visit(node);
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'start' || key === 'end') continue;
    const v = node[key];
    if (Array.isArray(v)) v.forEach((x) => walk(x, visit));
    else if (v && typeof v.type === 'string') walk(v, visit);
  }
}

const classOf = (el) => {
  const a = el.openingElement.attributes.find((x) => x.type === 'JSXAttribute' && x.name?.name === 'className');
  return a?.value?.type === 'StringLiteral' ? a.value.value : '';
};

function elementsWithClass(src, cls) {
  const ast = parse(src, { sourceType: 'module', plugins: ['jsx'] });
  const out = [];
  walk(ast.program, (n) => { if (n.type === 'JSXElement' && classOf(n).split(/\s+/).includes(cls)) out.push(n); });
  return out;
}

test('UI-07: the exam card meta is a row of separate parts, with no commas and no topic emoji', () => {
  const src = read('src/components/Question.jsx');
  const [meta] = elementsWithClass(src, 'vmx-q-meta');
  assert.ok(meta, 'the meta row lost its class');
  assert.equal(classOf(meta), 'vmx-qtype-badge vmx-q-meta', 'the specs select on .vmx-qtype-badge');
  const body = src.slice(meta.start, meta.end);
  assert.doesNotMatch(body, /\{', '\}|>, <|, <span/, 'the parts are still joined with commas');
  assert.doesNotMatch(body, /topic\.icon/, 'the topic emoji is back in the chrome');
  assert.match(body, /<span className="vmx-scope-chip">/, 'exam-scope.spec selects the paper by this class');
  assert.match(body, /<span className="vmx-origin-chip"/);
  // The parts are spans the row can space and divide.
  const spans = [];
  walk(meta, (n) => { if (n !== meta && n.type === 'JSXElement' && n.openingElement.name.name === 'span') spans.push(n); });
  assert.ok(spans.length >= 4, `only ${spans.length} parts`);
});

test('UI-07: "อิงแนวเดิม" is one class on the exam card and on Review', () => {
  for (const file of ['src/components/Question.jsx', 'src/views/ReviewView.jsx']) {
    const chips = elementsWithClass(read(file), 'vmx-origin-chip');
    assert.equal(chips.length, 1, `${file}`);
    const attrs = chips[0].openingElement.attributes.map((a) => a.name?.name);
    assert.ok(!attrs.includes('style'), `${file}: the chip is styled inline again`);
  }
});
