// lint:voice reads what a person sees and counts the wording that reads as machine-written.
// These tests pin the extractor (what is text and what is not) and the patterns (what each
// one must catch and must let through), so a budget number means the same thing next month.

import assert from 'node:assert/strict';
import test from 'node:test';

import { extractMarkdown, extractStrings } from '../../scripts/lib/voice-text.mjs';
import { GROUPS, compare, findingsIn, readPatterns, textsOf } from '../../scripts/lint-voice.mjs';

const patterns = readPatterns();
const byId = (id) => patterns.find((p) => p.id === id);
const hits = (id, text) => {
  const p = byId(id);
  p.re.lastIndex = 0;
  return [...text.matchAll(p.re)].length;
};

test('the extractor reads strings and JSX text, never a comment', () => {
  const src = [
    '// ทำการตรวจ — a comment',
    '/* มีความสำคัญ — a block comment */',
    'export const A = () => <p>ข้อความ — บนจอ</p>;',
    "export const B = 'ข้อความ — ในสตริง';",
  ].join('\n');
  const texts = textsOf('interface', src, 'src/views/X.jsx').map((r) => r.text).join('\n');
  assert.match(texts, /บนจอ/);
  assert.match(texts, /ในสตริง/);
  assert.doesNotMatch(texts, /a comment|a block comment/);
});

test('a class name, a key and a route are not copy', () => {
  const src = "export const C = () => <div className=\"a — b\" id=\"x — y\">ข้อความ</div>;";
  const texts = textsOf('interface', src, 'src/views/X.jsx').map((r) => r.text).join('\n');
  assert.doesNotMatch(texts, /a — b|x — y/);
});

test('markdown prose is read, code blocks are not', () => {
  const md = 'ย่อหน้า — แรก\n\n```js\nconst a = "ทำการตรวจ — x";\n```\n';
  const texts = extractMarkdown(md, 'docs/x.md').map((r) => r.text).join('\n');
  assert.match(texts, /ย่อหน้า/);
  assert.doesNotMatch(texts, /const a/);
});

test('every pattern catches its own examples and passes its counter-examples', () => {
  for (const p of patterns) {
    for (const s of p.hit) assert.ok(hits(p.id, s) > 0, `${p.id} must catch: ${s}`);
    for (const s of p.pass) assert.equal(hits(p.id, s), 0, `${p.id} must pass: ${s}`);
  }
});

test('long-dash: a separator counts, a placeholder dash and a range do not', () => {
  assert.equal(hits('long-dash', 'ไต — sagittal'), 1);
  assert.equal(hits('long-dash', '— แชร์โน้ต'), 1);
  assert.equal(hits('long-dash', '—'), 0);
  assert.equal(hits('long-dash', 'อายุ 5–10 ปี'), 0);
});

test('tham-kan: before a verb it counts, in a compound word it does not', () => {
  assert.equal(hits('tham-kan', 'ทำการตรวจเลือด'), 1);
  assert.equal(hits('tham-kan', 'เวลาทำการ 9 โมง'), 0);
});

test('mi-khwam: before an adjective it counts, as a noun phrase it does not', () => {
  assert.equal(hits('mi-khwam', 'มีความสำคัญมาก'), 1);
  assert.equal(hits('mi-khwam', 'ความสำคัญของโรค'), 0);
});

test('findings carry the file, the line and the pattern', () => {
  const records = textsOf('interface', "const a = 'ทำการตรวจ';\nconst b = 'ปกติ';", 'src/views/X.jsx');
  const found = findingsIn(records, patterns, 'interface');
  assert.equal(found.length, 1);
  assert.equal(found[0].pattern, 'tham-kan');
  assert.equal(found[0].line, 1);
});

test('the budget can only fall', () => {
  const finding = { pattern: 'long-dash', group: 'interface', file: 'src/a.jsx' };
  const result = { counts: { 'long-dash': { interface: 3 } }, files: { 'long-dash': { 'src/a.jsx': 3 } }, findings: [finding] };
  const over = compare(result, { budget: { 'long-dash': { interface: 2 } }, files: {} });
  assert.equal(over.ok, false);
  assert.equal(over.over[0].grew[0].file, 'src/a.jsx');
  assert.equal(compare(result, { budget: { 'long-dash': { interface: 3 } }, files: {} }).ok, true);
  assert.equal(compare(result, { budget: { 'long-dash': { interface: 5 } }, files: {} }).under.length, 1);
});

test('groups are the six the lint documents', () => {
  assert.deepEqual(Object.keys(GROUPS), ['interface', 'notes', 'questions', 'wrapups', 'changelog', 'docs']);
  assert.ok(typeof extractStrings === 'function');
});
