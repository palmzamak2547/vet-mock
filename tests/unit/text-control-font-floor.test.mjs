// iOS Safari zooms the whole page when a focused text control is under 16 px, and the page stays
// zoomed after the keyboard closes. styles.css keeps every text control at 16 px or more
// (a11y-inline-floors.test.mjs explains the floor), but an inline `fontSize` on the element wins
// over it. The screen hunt of 14 Nov 2026 found two that still did: the subject search on the
// study screen (15 px, the box every student types into to find a course) and the note box under
// each reviewed question (14 px).
//
// This parses every .jsx file under src and fails on an <input>, <textarea> or <select> whose inline
// style sets a literal font size under 16 px. Checkboxes, radios, ranges, colours and files take no
// typing and are left out.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { parse } from '@babel/parser';

const ROOT = new URL('../../', import.meta.url);
const NO_TYPING = new Set(['checkbox', 'radio', 'range', 'color', 'file', 'hidden', 'button', 'submit', 'reset', 'image']);

function jsxFiles(dir) {
  return readdirSync(new URL(dir, ROOT), { withFileTypes: true }).flatMap((e) => {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) return /data/.test(e.name) ? [] : jsxFiles(rel);
    return /\.jsx$/.test(e.name) ? [rel] : [];
  });
}

export function smallTextControls(source, file = 'inline.jsx') {
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'], errorRecovery: true });
  const found = [];
  const visit = (node) => {
    if (!node || typeof node.type !== 'string') return;
    if (node.type === 'JSXOpeningElement' && node.name.type === 'JSXIdentifier' && ['input', 'textarea', 'select'].includes(node.name.name)) {
      const attr = (name) => node.attributes.find((a) => a.type === 'JSXAttribute' && a.name.name === name);
      const type = attr('type')?.value?.value;
      const style = attr('style')?.value?.expression;
      if (!(node.name.name === 'input' && NO_TYPING.has(type)) && style?.type === 'ObjectExpression') {
        for (const p of style.properties) {
          if (p.type !== 'ObjectProperty' || (p.key.name ?? p.key.value) !== 'fontSize') continue;
          const v = p.value.type === 'NumericLiteral' ? p.value.value
            : p.value.type === 'StringLiteral' && /^\d+(\.\d+)?px$/.test(p.value.value) ? parseFloat(p.value.value) : null;
          if (v !== null && v < 16) found.push(`${file}:${node.loc.start.line} <${node.name.name}> fontSize ${v}`);
        }
      }
    }
    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'start' || key === 'end') continue;
      const child = node[key];
      if (Array.isArray(child)) child.forEach(visit);
      else if (child && typeof child === 'object') visit(child);
    }
  };
  visit(ast);
  return found;
}

// Left for a reviewed change, because they sit inside a running set (the written answer box of a question,
// and the race's own controls), which takes two reviews (AGENTS.md, sync and exam session). Rows only go.
const KNOWN = {
  'src/components/Question.jsx': 1,
  'src/views/RaceView.jsx': 3,
};

test('no text control is drawn under 16 px by an inline style', () => {
  const found = jsxFiles('src').flatMap((file) => smallTextControls(readFileSync(new URL(file, ROOT), 'utf8'), file));
  const perFile = {};
  for (const f of found) { const file = f.split(':')[0]; perFile[file] = (perFile[file] || 0) + 1; }
  const unexpected = found.filter((f) => (perFile[f.split(':')[0]] || 0) > (KNOWN[f.split(':')[0]] || 0));
  assert.deepEqual(unexpected, [], 'a focused text control under 16 px zooms the page on iPhone: use 16 or leave it to styles.css');
  const fixed = Object.entries(KNOWN).filter(([file, n]) => (perFile[file] || 0) < n).map(([file]) => file);
  assert.deepEqual(fixed, [], 'a known row no longer happens: lower or delete it in KNOWN');
});

test('the check sees through an arrow-function prop and skips controls nobody types into', () => {
  const src = `export const A = () => (<>
    <input type="text" onChange={(e) => go(e)} style={{ fontSize: 15 }} />
    <textarea style={{ fontSize: '14px' }} />
    <input type="checkbox" style={{ fontSize: 12 }} />
    <input style={{ fontSize: 16 }} />
  </>);`;
  assert.deepEqual(smallTextControls(src).map((s) => s.replace(/^inline\.jsx:\d+ /, '')), ['<input> fontSize 15', '<textarea> fontSize 14']);
});
