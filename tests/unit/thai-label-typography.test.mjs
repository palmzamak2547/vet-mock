// ============================================================
// Thai labels are never set in the mono eyebrow style (UI-01)
// ============================================================
// A Latin eyebrow — the mono face, 0.06-0.15em tracking, uppercase — had
// been applied to Thai across the app. JetBrains Mono has no Thai glyphs, so
// every such label fell back to the loopless IBM Plex face beside looped
// Sarabun, with gaps between the letters: "ปี 5, ทม.1 กลาง" on Results,
// "คำตอบของคุณ:" on Review, "ถึงเกณฑ์ซ้อมของแอป" at 0.15em. The rule is
// the one headings already follow: a label that can carry Thai is Sarabun,
// letter-spacing 0, never uppercased. Mono stays for digits and codes.
//
// This reads the JSX of the screens the w3 visual pass owns and fails on any
// element whose own literal text is Thai while its inline style asks for the
// mono face, positive tracking or uppercase. The class rules are checked by
// tests/unit/style-metrics-floors.test.mjs, which resolves the cascade.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';

const FILES = [
  'src/views/ResultsView.jsx',
  'src/views/ReviewView.jsx',
  'src/components/Question.jsx',
  'src/views/ExamView.jsx',
  'src/views/TopicSelectView.jsx',
  'src/views/WrapUpView.jsx',
  'src/views/HomeView.jsx',
  'src/components/ToolsFAB.jsx',
  'src/components/PinButton.jsx',
];

const THAI = /[฀-๿]/;
const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

/** The inline style object of a JSX element, as { key: source text }. */
function inlineStyle(el, src) {
  const attr = el.openingElement.attributes.find((a) => a.type === 'JSXAttribute' && a.name?.name === 'style');
  const obj = attr?.value?.expression;
  if (!obj || obj.type !== 'ObjectExpression') return {};
  const out = {};
  for (const p of obj.properties) {
    if (p.type !== 'ObjectProperty') continue;
    const key = p.key.name ?? p.key.value;
    out[key] = src.slice(p.value.start, p.value.end);
  }
  return out;
}

/** The element's own literal text: JSX text and string literals directly inside it. */
function ownText(el) {
  return el.children.map((c) => {
    if (c.type === 'JSXText') return c.value;
    if (c.type === 'JSXExpressionContainer') {
      const e = c.expression;
      if (e.type === 'StringLiteral') return e.value;
      if (e.type === 'TemplateLiteral') return e.quasis.map((q) => q.value.cooked).join(' ');
      if (e.type === 'ConditionalExpression') {
        return [e.consequent, e.alternate].map((b) => (b.type === 'StringLiteral' ? b.value
          : b.type === 'TemplateLiteral' ? b.quasis.map((q) => q.value.cooked).join(' ') : '')).join(' ');
      }
    }
    return '';
  }).join(' ');
}

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

function offenders(file) {
  const src = read(file);
  const ast = parse(src, { sourceType: 'module', plugins: ['jsx'] });
  const hits = [];
  walk(ast.program, (node) => {
    if (node.type !== 'JSXElement') return;
    const text = ownText(node).trim();
    if (!THAI.test(text)) return;
    const style = inlineStyle(node, src);
    const why = [];
    if (/vmx-mono|monospace|JetBrains/.test(style.fontFamily || '')) why.push(`fontFamily ${style.fontFamily}`);
    const ls = (style.letterSpacing || '').match(/'(-?[\d.]+)em'/);
    if (ls && Number(ls[1]) > 0) why.push(`letterSpacing ${style.letterSpacing}`);
    if (/uppercase/.test(style.textTransform || '')) why.push('textTransform uppercase');
    if (why.length) {
      const line = src.slice(0, node.start).split('\n').length;
      hits.push(`${file}:${line} "${text.replace(/\s+/g, ' ').slice(0, 40)}" — ${why.join(', ')}`);
    }
  });
  return hits;
}

test('UI-01: no Thai label on the study screens is inline-styled mono, tracked or uppercased', () => {
  const hits = FILES.flatMap(offenders);
  assert.deepEqual(hits, [], `Thai set in a Latin eyebrow style:\n${hits.join('\n')}`);
});

test('UI-01: the checker sees what it is meant to catch', () => {
  // A fixture in the exact shape that shipped on Results, so a parser change
  // that silently stops matching cannot turn the real test green.
  const src = `export default () => (<div style={{ fontFamily: 'var(--vmx-mono)', letterSpacing: '0.15em' }}>ถึงเกณฑ์ซ้อม</div>);`;
  const ast = parse(src, { sourceType: 'module', plugins: ['jsx'] });
  let el = null;
  walk(ast.program, (n) => { if (!el && n.type === 'JSXElement') el = n; });
  assert.match(ownText(el), THAI);
  assert.equal(inlineStyle(el, src).letterSpacing, "'0.15em'");
});
