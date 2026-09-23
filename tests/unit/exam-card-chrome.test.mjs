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

// ── UI-17: interface icons are line glyphs, not emoji ─────────────────
// DESIGN_SYSTEM rule 6: no emoji as an interface icon — NavIcon draws them.
// The chrome of Results, the exam and Home carried 🛠 🎯 🚀 🏁 ✍️ 👥 📋 🧠
// 🕒 🔥 🎖️ ⏱ and the like, which render differently on every phone. What
// may stay: a subject's or topic's own emoji (data, its identity), Mochi,
// the canvas share card, and the text of a message a student sends.
const PICTO = /\p{Extended_Pictographic}/u;
const CHROME_FILES = [
  'src/views/ResultsView.jsx',
  'src/views/ExamView.jsx',
  'src/components/ToolsFAB.jsx',
  'src/components/Question.jsx',
  'src/views/HomeView.jsx',
];

function chromeEmoji(file) {
  const src = read(file);
  const ast = parse(src, { sourceType: 'module', plugins: ['jsx'] });
  const hits = [];
  const lineOf = (n) => src.slice(0, n.start).split('\n').length;
  const literal = (e) => (e?.type === 'StringLiteral' ? e.value
    : e?.type === 'TemplateLiteral' ? e.quasis.map((q) => q.value.cooked).join('') : '');
  walk(ast.program, (n) => {
    // Text drawn by JSX, directly or through a conditional.
    if (n.type === 'JSXText' && PICTO.test(n.value)) hits.push(`${file}:${lineOf(n)} ${n.value.trim()}`);
    if (n.type === 'JSXExpressionContainer') {
      const e = n.expression;
      const parts = e?.type === 'ConditionalExpression' ? [e.consequent, e.alternate] : [e];
      for (const p of parts) if (PICTO.test(literal(p))) hits.push(`${file}:${lineOf(n)} ${literal(p)}`);
    }
    // Icon fields that a component renders as the icon of a row or a card.
    if (n.type === 'ObjectProperty' && (n.key.name === 'icon') && PICTO.test(literal(n.value))) {
      hits.push(`${file}:${lineOf(n)} icon: ${literal(n.value)}`);
    }
  });
  return hits;
}

test('UI-17: the chrome of Results, the exam and Home draws no emoji as an icon', () => {
  const hits = CHROME_FILES.flatMap(chromeEmoji);
  assert.deepEqual(hits, []);
});

test('UI-17: the checker catches the shapes that shipped', () => {
  const probe = (code) => {
    const ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
    let found = false;
    walk(ast.program, (n) => {
      if (n.type === 'JSXText' && PICTO.test(n.value)) found = true;
      if (n.type === 'JSXExpressionContainer' && n.expression?.type === 'ConditionalExpression'
        && [n.expression.consequent, n.expression.alternate].some((b) => b.type === 'StringLiteral' && PICTO.test(b.value))) found = true;
    });
    return found;
  };
  assert.ok(probe("const a = <button>{open ? '×' : '🛠'}</button>;"));
  assert.ok(probe('const a = <div>🎯</div>;'));
  assert.ok(!probe("const a = <div>{open ? '×' : 'x'}</div>;"));
});

test('UI-17: NavIcon has a wrench for the tools button, distinct from the settings gear', () => {
  const icon = read('src/components/NavIcon.jsx');
  assert.match(icon, /\n {2}tools: /);
  const fab = read('src/components/ToolsFAB.jsx');
  assert.match(fab, /<NavIcon name="tools"/);
});
