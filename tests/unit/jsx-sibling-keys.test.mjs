// Two sibling elements must never carry the same `key`.
//
// React matches the children of one parent by key. When two of them share a
// key, the one that leaves is lost track of: its DOM node stays on screen and
// nothing owns it any more. That is how a "ข้อมูลขัดแย้ง" chip stayed on every
// question after a flagged one (5.189.2 to 5.213.0): the chip and the source
// line under it were both keyed by the question's id.
//
// This reads every JSX file and fails on any parent whose direct children
// (through `cond && <X/>` and `cond ? <X/> : <Y/>`) repeat a key expression.
// Children made by `.map()` are their own list and are not compared with
// their neighbours; the two branches of a conditional never render together.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { parse } = require('@babel/parser');

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIRS = ['src', 'vca/src', 'ai/src', 'research/src', 'mobile/src'];

function jsxFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) jsxFiles(full, out);
    else if (/\.(jsx|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const keyOf = (element, source) => {
  const attr = element.openingElement.attributes.find((a) => a.type === 'JSXAttribute' && a.name.name === 'key');
  if (!attr || !attr.value) return null;
  return source.slice(attr.value.start, attr.value.end).replace(/\s+/g, ' ');
};

/** `view === 'exam' && ready && <X/>` says X shows only while `view` is 'exam': { view: "'exam'" }. */
function guardsOf(test, source, out = new Map()) {
  if (!test) return out;
  if (test.type === 'ParenthesizedExpression') return guardsOf(test.expression, source, out);
  if (test.type === 'LogicalExpression' && test.operator === '&&') {
    guardsOf(test.left, source, out);
    guardsOf(test.right, source, out);
  } else if (test.type === 'BinaryExpression' && test.operator === '===') {
    const literal = [test.left, test.right].find((n) => n.type === 'StringLiteral' || n.type === 'NumericLiteral');
    const other = literal === test.left ? test.right : test.left;
    if (literal) out.set(source.slice(other.start, other.end).replace(/\s+/g, ' '), source.slice(literal.start, literal.end));
  }
  return out;
}

/** The keyed elements one child slot can put beside its siblings, each with the conditions it shows under. */
function slotKeys(node, source, guards = new Map()) {
  if (!node) return [];
  switch (node.type) {
    case 'JSXElement': {
      const key = keyOf(node, source);
      return key ? [{ key, line: node.loc.start.line, guards }] : [];
    }
    case 'JSXExpressionContainer':
    case 'ParenthesizedExpression':
      return slotKeys(node.expression, source, guards);
    case 'LogicalExpression':
      return node.operator === '&&'
        ? slotKeys(node.right, source, guardsOf(node.left, source, new Map(guards)))
        : slotKeys(node.right, source, guards);
    // Only one branch renders, so the branches may share a key; a sibling may
    // share it with neither. Keep both, and de-duplicate within this slot.
    case 'ConditionalExpression': {
      const seen = new Map();
      for (const k of [...slotKeys(node.consequent, source, guards), ...slotKeys(node.alternate, source, guards)]) if (!seen.has(k.key)) seen.set(k.key, k);
      return [...seen.values()];
    }
    default:
      return [];
  }
}

/** Two slots never show together when both test one expression against different values. */
const exclusive = (a, b) => [...a.guards].some(([expr, value]) => b.guards.has(expr) && b.guards.get(expr) !== value);

export function duplicateSiblingKeys(source, file = 'inline') {
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx', 'typescript'], errorRecovery: true });
  const problems = [];
  const visit = (node) => {
    if (!node || typeof node.type !== 'string') return;
    if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
      const seen = [];
      for (const child of node.children) {
        const mine = slotKeys(child, source);
        for (const k of mine) {
          const clash = seen.find((s) => s.key === k.key && !exclusive(s, k));
          if (clash) problems.push(`${file}:${k.line} key=${k.key} is also the key of a sibling at line ${clash.line}`);
        }
        seen.push(...mine);
      }
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value.type === 'string') visit(value);
    }
  };
  visit(ast.program);
  return problems;
}

test('the check sees a shared key between siblings, and leaves lists and branches alone', () => {
  const bad = 'const a = <div><A key={id} />{flag && <B key={id} />}</div>;';
  assert.equal(duplicateSiblingKeys(bad).length, 1);
  const badInFragment = 'const a = <><A key="x" /><p /><B key="x" /></>;';
  assert.equal(duplicateSiblingKeys(badInFragment).length, 1);
  const fine = [
    'const a = <div><A key={`flag:${id}`} /><B key={`source:${id}`} /></div>;',
    'const b = <ul>{rows.map((r) => <li key={r.id} />)}{more.map((r) => <li key={r.id} />)}</ul>;',
    'const c = <div>{ok ? <A key={id} /> : <B key={id} />}</div>;',
    'const d = <div><section><A key={id} /></section><B key={id} /></div>;',
    // One `view` at a time: these two never show together.
    "const f = <div>{view === 'a' && <A key={id} />}{view === 'b' && ready && <B key={id} />}</div>;",
  ].join('\n');
  // The same value of `view`, or no shared test at all, is not exclusive.
  assert.equal(duplicateSiblingKeys("const g = <div>{view === 'a' && <A key={id} />}{view === 'a' && <B key={id} />}</div>;").length, 1);
  assert.equal(duplicateSiblingKeys("const h = <div>{view === 'a' && <A key={id} />}{open && <B key={id} />}</div>;").length, 1);
  assert.deepEqual(duplicateSiblingKeys(fine), []);
  const branchAgainstSibling = 'const e = <div>{ok ? <A key={id} /> : <B key={id} />}<C key={id} /></div>;';
  assert.equal(duplicateSiblingKeys(branchAgainstSibling).length, 1);
});

test('no parent in the app has two children with the same key', () => {
  const files = DIRS.flatMap((d) => jsxFiles(path.join(ROOT, d)));
  assert.ok(files.length > 100, `expected the app's JSX files, found ${files.length}`);
  const problems = files.flatMap((file) => duplicateSiblingKeys(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file).replaceAll('\\', '/')));
  assert.deepEqual(problems, []);
});
