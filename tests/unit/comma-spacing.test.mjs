// A comma sits against the word before it. When the app's middle dots became commas (AGENTS.md rule
// 11), a separator that used to stand on its own kept its spacing, and the screen hunt of 14 Nov 2026
// (scripts/screen-hunt.mjs) read "เวลารวม 0:06  , เฉลี่ย 3 วิ/ข้อ" on every practice result. The same
// fault was in six more places (the offline game's best score, the Lab's measuring hint, the OSCE
// timer, and the three KNOWN below), in four shapes: a text that ends in a space before an element that opens with the
// comma, a `{' '}` before it, an element that opens with the comma and a left margin, and a comma
// item inside an inline flex row with a gap.
//
// This parses every .jsx file under src and fails on each of those shapes. The flex rows it can see
// are the ones styled inline; ResultsView's pace line is a class, so screen-hunt-wave1.test.mjs holds
// that one. KNOWN rows sit inside a running set or its marking and wait for a reviewed change.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { parse } from '@babel/parser';

const ROOT = new URL('../../', import.meta.url);

const KNOWN = {
  'src/components/Question.jsx': 2, // the essay word count's penalty notes, inside a running set
  'src/components/SmartGrader.jsx': 1, // the self-marked score chip
};

function jsxFiles(dir) {
  return readdirSync(new URL(dir, ROOT), { withFileTypes: true }).flatMap((e) => {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) return /data/.test(e.name) ? [] : jsxFiles(rel);
    return /\.jsx$/.test(e.name) ? [rel] : [];
  });
}

const styleProps = (el) => {
  const style = el.openingElement?.attributes.find((a) => a.type === 'JSXAttribute' && a.name.name === 'style')?.value?.expression;
  if (style?.type !== 'ObjectExpression') return {};
  return Object.fromEntries(style.properties.filter((p) => p.type === 'ObjectProperty')
    .map((p) => [p.key.name ?? p.key.value, p.value.type === 'StringLiteral' || p.value.type === 'NumericLiteral' ? p.value.value : true]));
};

// The JSX element a child renders, through `cond && <x>` and `cond ? <x> : <y>`.
function rendered(child) {
  if (!child) return [];
  if (child.type === 'JSXElement') return [child];
  if (child.type === 'JSXExpressionContainer') return rendered(child.expression);
  if (child.type === 'LogicalExpression') return rendered(child.right);
  if (child.type === 'ConditionalExpression') return [...rendered(child.consequent), ...rendered(child.alternate)];
  return [];
}

const opensWithComma = (el) => {
  const first = el.children.find((c) => !(c.type === 'JSXText' && !c.value.trim()));
  return first?.type === 'JSXText' && /^\s*,/.test(first.value);
};

export function spacedCommas(source, file = 'inline.jsx') {
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'], errorRecovery: true });
  const found = [];
  const visit = (node) => {
    if (!node || typeof node.type !== 'string') return;
    if ((node.type === 'JSXElement' || node.type === 'JSXFragment') && node.children) {
      const parent = node.type === 'JSXElement' ? styleProps(node) : {};
      const flexGap = /flex/.test(String(parent.display || '')) && parent.gap !== undefined && parent.gap !== 0;
      node.children.forEach((child, i) => {
        for (const el of rendered(child)) {
          if (!opensWithComma(el)) continue;
          // The child before it, past whitespace JSX drops (a line break and its indent).
          let j = i - 1;
          while (j >= 0 && node.children[j].type === 'JSXText' && !node.children[j].value.trim() && node.children[j].value.includes('\n')) j -= 1;
          const prev = node.children[j];
          const own = styleProps(el);
          // JSX drops trailing whitespace that holds a line break: only a space on the same line is drawn.
          const why = prev?.type === 'JSXText' && /[ \t]$/.test(prev.value) && !/\n\s*$/.test(prev.value) ? 'a space before it'
            : prev?.type === 'JSXExpressionContainer' && prev.expression.type === 'StringLiteral' && /\s$/.test(prev.expression.value) ? "a {' '} before it"
              : own.marginLeft !== undefined || own.marginInlineStart !== undefined ? 'a left margin'
                : flexGap ? 'the gap of its flex row' : null;
          if (why) found.push(`${file}:${el.loc.start.line} a comma set off by ${why}`);
        }
      });
    }
    for (const key of Object.keys(node)) {
      if (key === 'loc') continue;
      const c = node[key];
      if (Array.isArray(c)) c.forEach(visit);
      else if (c && typeof c === 'object') visit(c);
    }
  };
  visit(ast);
  return found;
}

test('no comma is set off from the word before it', () => {
  const found = jsxFiles('src').flatMap((file) => spacedCommas(readFileSync(new URL(file, ROOT), 'utf8'), file));
  const count = (file) => found.filter((f) => f.startsWith(`${file}:`)).length;
  assert.deepEqual(found.filter((f) => count(f.split(':')[0]) > (KNOWN[f.split(':')[0]] || 0)), [], 'write the comma against the word: drop the space, the margin or the flex gap before it');
  assert.deepEqual(Object.entries(KNOWN).filter(([file, n]) => count(file) < n).map(([file]) => file), [], 'a known row no longer happens: lower or delete it');
});

test('each shape is caught, and a comma that follows on a new line is not', () => {
  const src = `export const A = ({ x }) => (<div>
    <p>ใหม่ {x && <span>, ต่อ</span>}</p>
    <p>Length{' '}<span>, กด</span></p>
    <p><b>1</b><span style={{ marginLeft: 8 }}>, −2</span></p>
    <p style={{ display: 'inline-flex', gap: 6 }}><span>5</span><span>, 60%</span></p>
    <p>เสร็จ
      {x && <span>, streak</span>}</p>
  </div>);`;
  assert.equal(spacedCommas(src).length, 4);
});
