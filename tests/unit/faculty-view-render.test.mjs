// ============================================================
// FacultyView — typing in the search box must not redraw every card
// ============================================================
// The faculty directory holds every instructor profile (147 at the time
// of writing). The search box is controlled, so each keystroke re-renders
// FacultyView at once, and the debounced filter re-renders it again 80 ms
// later. Every card used to render on both, because the grid handed each
// card a fresh inline onClick. The cards are memoised now, with a stable
// onOpen, so a keystroke renders no card at all and a narrowing filter
// renders none either.
//
// This is a real render, not a source pin: FacultyView is bundled with
// esbuild and mounted with react-dom/client into a minimal DOM, and a
// counter is added at the top of FacultyCard's body so each card render
// is counted. The same harness pins that the list itself behaves exactly
// as before: the same cards in the same order for every query and chip,
// the same count line and the same empty state.

import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);

// ─────────────────────────────────────────────────────────────
// A minimal DOM: just what react-dom 18 touches to mount and update
// divs, spans, buttons and a text input.
// ─────────────────────────────────────────────────────────────
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const DOCUMENT_NODE = 9;
const HTML_NS = 'http://www.w3.org/1999/xhtml';

class FakeNode {
  constructor(nodeType, nodeName, ownerDocument) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.childNodes = [];
  }
  get firstChild() { return this.childNodes[0] ?? null; }
  get lastChild() { return this.childNodes[this.childNodes.length - 1] ?? null; }
  get nextSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.childNodes;
    return siblings[siblings.indexOf(this) + 1] ?? null;
  }
  appendChild(child) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.childNodes.push(child);
    return child;
  }
  insertBefore(child, ref) {
    if (!ref) return this.appendChild(child);
    if (child.parentNode) child.parentNode.removeChild(child);
    const at = this.childNodes.indexOf(ref);
    if (at < 0) throw new Error('insertBefore: reference node is not a child');
    this.childNodes.splice(at, 0, child);
    child.parentNode = this;
    return child;
  }
  removeChild(child) {
    const at = this.childNodes.indexOf(child);
    if (at < 0) throw new Error('removeChild: node is not a child');
    this.childNodes.splice(at, 1);
    child.parentNode = null;
    return child;
  }
  addEventListener() {}
  removeEventListener() {}
  get textContent() { return this.childNodes.map((c) => c.textContent).join(''); }
  set textContent(value) {
    for (const c of this.childNodes) c.parentNode = null;
    this.childNodes = [];
    if (value !== '' && value != null) this.appendChild(this.ownerDocument.createTextNode(String(value)));
  }
}

class FakeText extends FakeNode {
  constructor(text, ownerDocument) {
    super(TEXT_NODE, '#text', ownerDocument);
    this.nodeValue = text;
  }
  get textContent() { return this.nodeValue; }
  set textContent(value) { this.nodeValue = String(value); }
}

class FakeStyle {
  setProperty(name, value) { this[name] = value; }
  removeProperty(name) { delete this[name]; }
}

class FakeElement extends FakeNode {
  constructor(tagName, ownerDocument, namespaceURI = HTML_NS) {
    super(ELEMENT_NODE, tagName.toUpperCase(), ownerDocument);
    this.tagName = tagName.toUpperCase();
    this.namespaceURI = namespaceURI;
    this.attributes = new Map();
    this.style = new FakeStyle();
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  hasAttribute(name) { return this.attributes.has(name); }
  removeAttribute(name) { this.attributes.delete(name); }
}

class FakeDocument extends FakeNode {
  constructor() {
    super(DOCUMENT_NODE, '#document', null);
    this.ownerDocument = null;
    this.documentElement = new FakeElement('html', this);
    this.body = new FakeElement('body', this);
    this.documentElement.appendChild(this.body);
    this.activeElement = null;
  }
  createElement(tag) { return new FakeElement(tag, this); }
  createElementNS(ns, tag) { return new FakeElement(tag, this, ns); }
  createTextNode(text) { return new FakeText(text, this); }
}

function walk(node, visit) {
  visit(node);
  for (const child of node.childNodes) walk(child, visit);
}
function findAll(root, predicate) {
  const out = [];
  walk(root, (n) => { if (n.nodeType === ELEMENT_NODE && predicate(n)) out.push(n); });
  return out;
}
function reactProps(node) {
  const key = Object.keys(node).find((k) => k.startsWith('__reactProps$'));
  assert.ok(key, `no React props on <${node.tagName}>`);
  return node[key];
}

// ─────────────────────────────────────────────────────────────
// Bundle FacultyView with its real data, a render counter in FacultyCard,
// and a stub for the lazily loaded modal (its focus trap needs a real DOM).
// React itself stays external and loads from node_modules as usual: bundled,
// its act() cannot reach Node's timers and falls back to MessageChannel
// ports that keep the test process alive after the last test.
// ─────────────────────────────────────────────────────────────
let tmp;
let mod;
let document;
const consoleErrors = [];
const originalConsoleError = console.error;

before(async () => {
  document = new FakeDocument();
  class HTMLIFrameElement {}
  const fakeWindow = {
    document,
    HTMLIFrameElement,
    addEventListener() {},
    removeEventListener() {},
    location: { protocol: 'file:' },
  };
  globalThis.window = fakeWindow;
  globalThis.document = document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  console.error = (...args) => { consoleErrors.push(args.map(String).join(' ')); };

  const countCardRenders = {
    name: 'count-faculty-card-renders',
    setup(b) {
      b.onLoad({ filter: /[\\/]src[\\/]views[\\/]FacultyView\.jsx$/ }, (args) => {
        const source = readFileSync(args.path, 'utf8');
        const entry = /function FacultyCard\(\{[^}]*\}\) \{/g;
        const hits = source.match(entry) || [];
        if (hits.length !== 1) {
          throw new Error(`expected one "function FacultyCard({ ... }) {" in FacultyView.jsx, found ${hits.length}`);
        }
        return {
          contents: source.replace(entry, (m) => `${m} globalThis.__facultyCardRenders = (globalThis.__facultyCardRenders || 0) + 1;`),
          loader: 'jsx',
        };
      });
      b.onResolve({ filter: /^react(-dom)?(\/.*)?$/ }, (args) => ({
        path: pathToFileURL(require.resolve(args.path)).href,
        external: true,
      }));
      b.onResolve({ filter: /InstructorModal\.jsx$/ }, () => ({ path: 'instructor-modal', namespace: 'stub' }));
      b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
        contents: 'export default function InstructorModal({ instructor }) { return <div className="stub-instructor-modal" data-slug={instructor.slug} />; }',
        loader: 'jsx',
        resolveDir: repoRoot,
      }));
    },
  };

  const result = await build({
    stdin: {
      contents: [
        "export { default as FacultyView } from './src/views/FacultyView.jsx';",
        "export { ALL_INSTRUCTORS } from './src/data/instructors.js';",
        "export { act, createElement } from 'react';",
        "export { createRoot } from 'react-dom/client';",
      ].join('\n'),
      resolveDir: repoRoot,
      loader: 'js',
    },
    bundle: true,
    format: 'esm',
    platform: 'browser',
    jsx: 'automatic',
    loader: { '.js': 'jsx', '.jsx': 'jsx' },
    plugins: [countCardRenders],
    write: false,
    logLevel: 'silent',
  });
  tmp = mkdtempSync(join(tmpdir(), 'faculty-view-'));
  const file = join(tmp, 'faculty-view.bundle.mjs');
  writeFileSync(file, result.outputFiles[0].text);
  mod = await import(pathToFileURL(file).href);
});

after(() => {
  console.error = originalConsoleError;
  if (tmp) rmSync(tmp, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────
// Driving the view
// ─────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const renders = () => globalThis.__facultyCardRenders || 0;

// Unmounted after the test even when it fails, so a pending debounce never
// lands outside act() and muddles the next test.
async function mount(t) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = mod.createRoot(container);
  await mod.act(async () => { root.render(mod.createElement(mod.FacultyView, {})); });
  t.after(async () => {
    await mod.act(async () => { root.unmount(); });
    document.body.removeChild(container);
  });
  return { container };
}

const grid = (container) => findAll(container, (n) => n.style.display === 'grid')[0] || null;
const cards = (container) => grid(container)?.childNodes || [];
const searchBox = (container) => findAll(container, (n) => n.tagName === 'INPUT' && n.getAttribute('aria-label') === 'ค้นหาอาจารย์')[0];
const countLine = (container) => findAll(container, (n) => /^แสดง \d+ \/ \d+ โปรไฟล์$/.test(n.textContent) && n.childNodes.every((c) => c.nodeType === TEXT_NODE))[0]?.textContent ?? null;
const emptyState = (container) => findAll(container, (n) => n.getAttribute('class') === 'vmx-empty')[0]?.textContent ?? null;
const chip = (container, label) => {
  const g = grid(container);
  const hits = findAll(container, (n) => n.tagName === 'BUTTON' && n.parentNode !== g && n.textContent.includes(label));
  assert.equal(hits.length, 1, `expected one chip labelled "${label}", found ${hits.length}`);
  return hits[0];
};

// One keystroke: the controlled input's onChange, exactly as React calls it.
// Returns how many cards rendered in that commit, before the debounce fires.
async function keystroke(container, value) {
  const input = searchBox(container);
  const before = renders();
  await mod.act(async () => { reactProps(input).onChange({ target: { value } }); });
  return renders() - before;
}
// Let the 80 ms debounce land. Returns how many cards rendered in that commit.
async function settle() {
  const before = renders();
  await mod.act(async () => { await sleep(120); });
  return renders() - before;
}
async function click(node) {
  await mod.act(async () => { reactProps(node).onClick(); });
  await mod.act(async () => { await sleep(0); });
}

// The list contract, written out independently of the component: the same
// fields searched, case-insensitive and trimmed, then ordered by English name.
function expectedList({ q = '', subject = 'all', status = 'all' } = {}) {
  const lq = q.trim().toLowerCase();
  const hay = (ins) => [
    ins.nameEn, ins.nameTh, ins.position, ins.department,
    ins.institution, ins.nickname, ...(ins.aliases || []), ...(ins.areas || []),
  ].filter(Boolean).join(' ').toLowerCase();
  const key = (ins) => (ins.nameEn || '').toLowerCase();
  return mod.ALL_INSTRUCTORS
    .filter((ins) => subject === 'all' || (ins.subjects || []).includes(subject))
    .filter((ins) => status === 'all' || ins.status === status)
    .filter((ins) => !lq || hay(ins).includes(lq))
    .sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));
}

function assertCardsMatch(container, expected, label) {
  const shown = cards(container);
  assert.equal(shown.length, expected.length, `${label}: card count`);
  expected.forEach((ins, i) => {
    const text = shown[i].textContent;
    assert.ok(text.includes(ins.nameEn), `${label}: card ${i} should be ${ins.nameEn}, got "${text.slice(0, 80)}"`);
    if (ins.nameTh) assert.ok(text.includes(ins.nameTh), `${label}: card ${i} should carry ${ins.nameTh}`);
  });
  const total = mod.ALL_INSTRUCTORS.length;
  assert.equal(countLine(container), `แสดง ${expected.length} / ${total} โปรไฟล์`, `${label}: count line`);
}

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────
test('a keystroke in the faculty search renders no card, and a narrowing filter renders none either', async (t) => {
  const view = await mount(t);
  const total = mod.ALL_INSTRUCTORS.length;
  assert.ok(total > 100, `the directory should hold every profile, got ${total}`);
  assert.equal(cards(view.container).length, total);

  // Each letter re-renders FacultyView at once (the input is controlled).
  // No card may render on that commit: its instructor and onOpen are unchanged.
  assert.equal(await keystroke(view.container, 's'), 0, 'typing "s" re-rendered the cards');
  assert.equal(await settle(), 0, 'the debounced "s" filter re-rendered cards that were already on screen');
  assert.equal(await keystroke(view.container, 'sw'), 0, 'typing "w" re-rendered the cards');
  assert.equal(await keystroke(view.container, 'swi'), 0, 'typing "i" re-rendered the cards');
  assert.equal(await settle(), 0, 'narrowing to "swi" re-rendered cards that stayed on screen');
  assertCardsMatch(view.container, expectedList({ q: 'swi' }), '"swi"');

  // Clearing the query brings the hidden cards back: only those mount.
  const shownBefore = cards(view.container).length;
  assert.equal(await keystroke(view.container, ''), 0, 'clearing the box re-rendered the cards');
  assert.equal(await settle(), total - shownBefore, 'widening should mount only the cards that were hidden');
  assertCardsMatch(view.container, expectedList(), 'cleared');
});

test('search results, their order and the count line are unchanged for every kind of query', async (t) => {
  const view = await mount(t);
  assertCardsMatch(view.container, expectedList(), 'no query');
  for (const q of ['a', 'swine', 'PATHOLOGY', '  aquatic  ', 'zoonos', 'Med']) {
    await keystroke(view.container, q);
    await settle();
    assertCardsMatch(view.container, expectedList({ q }), JSON.stringify(q));
    assert.equal(emptyState(view.container), null, `${JSON.stringify(q)} should not show the empty state`);
  }
});

test('a query with no match shows the empty state with what was typed', async (t) => {
  const view = await mount(t);
  await keystroke(view.container, 'zzqx-no-such-lecturer');
  await settle();
  assert.equal(grid(view.container), null, 'the grid should give way to the empty state');
  assert.equal(emptyState(view.container), 'ไม่พบอาจารย์ที่ตรงกับ "zzqx-no-such-lecturer"');
  assert.equal(countLine(view.container), `แสดง 0 / ${mod.ALL_INSTRUCTORS.length} โปรไฟล์`);
});

test('subject, status and department chips filter exactly as before, together with the query', async (t) => {
  const view = await mount(t);
  await click(chip(view.container, 'COM V'));
  assertCardsMatch(view.container, expectedList({ subject: 'com5' }), 'COM V');
  await keystroke(view.container, 'a');
  await settle();
  assertCardsMatch(view.container, expectedList({ subject: 'com5', q: 'a' }), 'COM V + "a"');
  await click(chip(view.container, 'ทุกวิชา'));
  await keystroke(view.container, '');
  await settle();

  await click(chip(view.container, 'วิทยากรภายนอก'));
  assertCardsMatch(view.container, expectedList({ status: 'external' }), 'external');
  await click(chip(view.container, 'ทุกสถานะ'));

  // A department chip carries its own count; selecting it shows that many.
  const medicine = chip(view.container, 'Medicine');
  const advertised = Number(medicine.textContent.match(/(\d+)\s*$/)[1]);
  await click(medicine);
  assert.equal(cards(view.container).length, advertised);
  assert.equal(countLine(view.container), `แสดง ${advertised} / ${mod.ALL_INSTRUCTORS.length} โปรไฟล์`);
});

test('opening a card still opens that instructor', async (t) => {
  const view = await mount(t);
  await keystroke(view.container, 'swine');
  await settle();
  const expected = expectedList({ q: 'swine' });
  assert.ok(expected.length > 1);
  await click(cards(view.container)[1]);
  const modal = findAll(view.container, (n) => n.getAttribute('class') === 'stub-instructor-modal');
  assert.equal(modal.length, 1, 'the instructor modal did not open');
  assert.equal(modal[0].getAttribute('data-slug'), expected[1].slug);
});

// React's development build reports duplicate keys, updates outside act()
// and prop mistakes through console.error. None of them may appear.
test('the directory renders without a single React warning', () => {
  assert.deepEqual(consoleErrors, []);
});
