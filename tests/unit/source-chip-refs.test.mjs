// ============================================================
// source-chip-refs — the chip's panel names what the key was checked against
// ============================================================
// 365 questions carry verificationSources ({ title, locator, url }) and 112
// carry sourceDocument.question beside its page. The panel used to show only
// the `verified` string and the page. Now it lists each reference (a link only
// when safeLinkUrl passes it, in a new tab, rel noopener noreferrer nofollow)
// and prints "อ้างหน้า N ข้อ M". All of it waits for the key.
// The real QSourceChip is compiled with esbuild and rendered with stub hooks,
// as source-line-no-spoiler.test.mjs does.
// ============================================================

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { transformSync } from 'esbuild';
import { QB, loadQB } from '../../src/data/questions.js';
import { verificationRefs, sourceDocumentPointer, verifiedLine } from '../../src/lib/source-refs.js';

const CHIP = 'vetmock-test:source-refs-chip';
const STUB = 'vetmock-test:source-refs-stub:';
const STUBS = {
  react: [
    'const h = () => globalThis.__vmxHooks;',
    'export const useState = (v) => h().useState(v);',
    'export const useEffect = () => {};',
    'export const useMemo = (f) => f();',
    'export const useRef = (v) => ({ current: v });',
    'export const useCallback = (f) => f;',
    'export const lazy = () => function Lazy() { return null; };',
    'export const Suspense = ({ children }) => children ?? null;',
  ].join('\n'),
  'react/jsx-runtime': [
    "export const Fragment = 'fragment';",
    'export const jsx = (type, props, key) => ({ type, props: props || {}, key });',
    'export const jsxs = jsx;',
  ].join('\n'),
  './NavIcon.jsx': 'export default function NavIcon() { return null; }',
};
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const chipFile = `${repoRoot}src/components/QSourceChip.jsx`;
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === CHIP) return { url: CHIP, shortCircuit: true };
    if (context.parentURL === CHIP) {
      if (Object.hasOwn(STUBS, specifier)) return { url: STUB + specifier, shortCircuit: true };
      return nextResolve(specifier, { ...context, parentURL: pathToFileURL(chipFile).href });
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === CHIP) {
      const { code } = transformSync(readFileSync(chipFile, 'utf8'), { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: chipFile });
      return { format: 'module', shortCircuit: true, source: code };
    }
    if (url.startsWith(STUB)) return { format: 'module', shortCircuit: true, source: STUBS[url.slice(STUB.length)] };
    return nextLoad(url, context);
  },
});
const { default: QSourceChip } = await import(CHIP);
await loadQB();

function expand(node) {
  if (node == null || typeof node === 'boolean') return null;
  if (Array.isArray(node)) return node.map(expand);
  if (typeof node !== 'object') return node;
  if (typeof node.type === 'function') return expand(node.type(node.props));
  return { ...node, props: { ...node.props, children: expand(node.props.children) } };
}
const textOf = (node) => {
  if (node == null) return '';
  if (Array.isArray(node)) return node.map(textOf).join(' ');
  if (typeof node !== 'object') return String(node);
  return textOf(node.props.children);
};
const findAll = (node, pred, out = []) => {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) { for (const c of node) findAll(c, pred, out); return out; }
  if (pred(node)) out.push(node);
  findAll(node.props?.children, pred, out);
  return out;
};
function render(q, { revealed = false, open = false } = {}) {
  globalThis.__vmxHooks = { useState: (v) => [v === false ? open : v, () => {}] };
  const tree = expand(QSourceChip({ q, revealed }));
  return { tree, text: textOf(tree).replace(/\s+/g, ' ').trim() };
}
const links = (tree) => findAll(tree, (n) => n.type === 'a');
const lists = (tree) => findAll(tree, (n) => n.type === 'ul');
const withRefs = QB.filter((q) => Array.isArray(q.verificationSources) && q.verificationSources.length);
const withItem = QB.filter((q) => Number.isInteger(q.sourceDocument?.question));

test('the bank holds what the panel reads', () => {
  assert.ok(withRefs.length >= 300, `questions with verificationSources: ${withRefs.length}`);
  assert.ok(withItem.length >= 100, `questions with a source question number: ${withItem.length}`);
});

test('every reference is listed once the panel opens, with its locator, and never before the key', () => {
  for (const q of withRefs) {
    const refs = verificationRefs(q);
    const open = render(q, { revealed: true, open: true });
    for (const r of refs) {
      assert.ok(open.text.includes(r.title), `${q.subject}#${q.id} title`);
      if (r.locator) assert.ok(open.text.includes(r.locator), `${q.subject}#${q.id} locator`);
    }
    assert.equal(lists(open.tree).length, refs.length ? 1 : 0, `${q.subject}#${q.id} one list`);
    // Before the key (even asked open), and after it until "ดูเต็ม": no list.
    for (const asked of [render(q, { open: true }), render(q, { revealed: true })]) {
      assert.equal(lists(asked.tree).length, 0, `${q.subject}#${q.id} no reference list yet`);
    }
  }
});

test('a reference links only through safeLinkUrl, in a new tab, with nofollow', () => {
  const q = {
    id: 1, subject: 't', source: 'x', verified: 'y',
    verificationSources: [
      { title: 'Public page', locator: 'Section 2', url: 'https://example.org/a' },
      { title: 'Script', locator: 'p. 1', url: 'javascript:alert(1)' },
      { title: 'Plain http', url: 'http://example.org/b' },
      { title: 'Same site', url: '/wiki/x' },
      { title: '', url: 'https://example.org/untitled' },
      { title: 'Drive copy', locator: 'หน้า 15-16', url: 'https://drive.google.com/file/d/abc/view' },
      { title: 'Docs copy', url: 'https://docs.google.com/document/d/abc/edit' },
    ],
  };
  const { tree, text } = render(q, { revealed: true, open: true });
  const refLinks = links(tree).filter((a) => a.props.rel === 'noopener noreferrer nofollow');
  assert.deepEqual(refLinks.map((a) => a.props.href), ['https://example.org/a']);
  assert.equal(refLinks[0].props.target, '_blank');
  for (const t of ['Public page', 'Section 2', 'Script', 'p. 1', 'Plain http', 'Same site', 'Drive copy', 'หน้า 15-16', 'Docs copy']) assert.ok(text.includes(t), t);
  assert.ok(!links(tree).some((a) => /javascript:|http:\/\/|untitled|google\.com/.test(a.props.href || '')));
});

test('a Google Drive reference in the bank is text, every other one a link', () => {
  const refs = withRefs.flatMap((q) => q.verificationSources.map((r) => ({ r, out: verificationRefs({ verificationSources: [r] })[0] })));
  const drive = refs.filter(({ r }) => /(?:drive|docs)\.google\.com/.test(r.url || ''));
  assert.ok(drive.length > 0, 'the bank has Drive references');
  for (const { r, out } of drive) assert.equal(out.href, null, r.url);
  for (const { r, out } of refs.filter((x) => !drive.includes(x))) assert.ok(out.href, r.url);
  // The panel's own source-document link is unchanged: it still opens the member's copy.
  const q = QB.find((x) => x.subject === 'vca' && x.id === 200221);
  const { tree } = render(q, { revealed: true, open: true });
  assert.ok(links(tree).some((a) => textOf(a).includes('เปิดเอกสารต้นฉบับ')));
  assert.ok(!links(tree).some((a) => a.props.rel === 'noopener noreferrer nofollow'));
});

// The "ตรวจกับ" row: the Row whose label child is that word.
const verifiedRow = (tree) => findAll(tree, (n) => Array.isArray(n.props?.children)
  && n.props.children.some((c) => c && typeof c === 'object' && c.props?.children === 'ตรวจกับ'))[0];

test('with a references list, the "ตรวจกับ" line leaves its bare addresses to the list', () => {
  let changed = 0;
  for (const q of withRefs) {
    const row = verifiedRow(render(q, { revealed: true, open: true }).tree);
    if (row) assert.ok(!/http/i.test(textOf(row)), `${q.subject}#${q.id}: ${textOf(row)}`);
    if (/https?:\/\//.test(q.verified || '')) changed += 1;
  }
  assert.ok(changed > 0, 'some verified lines held an address');
  const q = QB.find((x) => x.subject === 'vca' && x.id === 200221);
  const row = textOf(verifiedRow(render(q, { revealed: true, open: true }).tree));
  assert.ok(row.includes('Immunology for VCA 2026, หน้า 15-16'), row);
  assert.ok(!/[;,]\s*$/.test(row.trim()), row);
});

test('without a references list, the "ตรวจกับ" line is the bank text as before', () => {
  const plain = QB.filter((x) => typeof x.verified === 'string' && x.verified && !x.verificationSources?.length);
  const withUrl = plain.filter((x) => /https?:\/\//.test(x.verified));
  assert.ok(withUrl.length > 0, 'some verified lines without references hold an address');
  for (const q of plain) {
    assert.equal(verifiedLine(q), q.verified, `${q.subject}#${q.id}`);
  }
  const row = textOf(verifiedRow(render(withUrl[0], { revealed: true, open: true }).tree));
  assert.ok(/http/.test(row), row);
});

test('the source document names its page and its question number', () => {
  assert.equal(sourceDocumentPointer({ page: 9, question: 2 }), 'อ้างหน้า 9 ข้อ 2');
  assert.equal(sourceDocumentPointer({ page: 9 }), 'อ้างหน้า 9');
  assert.equal(sourceDocumentPointer({ question: 2 }), 'อ้างข้อ 2');
  assert.equal(sourceDocumentPointer({ page: 0, question: '2' }), '');
  const q = QB.find((x) => x.subject === 'vca' && x.id === 200340);
  const { tree } = render(q, { revealed: true, open: true });
  assert.ok(links(tree).some((a) => textOf(a).replace(/\s+/g, ' ').includes(`เปิดเอกสารต้นฉบับ (อ้างหน้า ${q.sourceDocument.page} ข้อ ${q.sourceDocument.question})`)));
});

test('a question with neither field renders the panel it rendered before', () => {
  const plain = QB.filter((x) => x.source && !x.verificationSources && !x.sourceDocument);
  assert.ok(plain.length > 1000);
  for (const q of plain) {
    const { tree, text } = render(q, { revealed: true, open: true });
    assert.equal(lists(tree).length, 0, `${q.subject}#${q.id}`);
    assert.ok(!text.includes('อ้างหน้า'), `${q.subject}#${q.id}`);
  }
  // Nothing to cite, nothing drawn.
  assert.equal(QSourceChip({ q: { id: 1 }, revealed: true }), null);
});
