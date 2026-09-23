// ============================================================
// image-occlusion-drop.test.mjs — a dropped picture opens in the editor
// ============================================================
// The empty Image Occlusion screen says "ลากรูปมาวาง". Dropping a picture on
// it set editing = { _bootstrapFile } and EditorBootstrap mounted the editor
// straight away with initialDeck = null, then read the file in an effect.
// The editor reads initialDeck only when it mounts (useState and useRef
// initialisers), so the picture that arrived a moment later never reached
// it: the student saw an empty editor and had to pick the same file again.
// That held whether the editor chunk was already loaded or not.
//
// The view itself runs here, under the real React DOM, compiled from the
// source that ships. The editor chunk is replaced by a stand-in that keeps
// the one property that matters: it takes initialDeck when it mounts and
// never again. The drop goes through the drop zone's own onDrop handler,
// and FileReader is held so each test decides when the read finishes.
// ============================================================

import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { transformWithEsbuild } from 'vite';

const ROOT = resolve(process.cwd());
const VIEW_PATH = join(ROOT, 'src/views/ImageOcclusionView.jsx');
const EDITOR_SPEC = '../components/ImageOcclusionEditor.jsx';
const DECK_KEY = 'vmx-image-occlusion-decks';
const PNG = 'data:image/png;base64,iVBORw0KGgo=';

// ── A document just large enough for React DOM ────────────────────────────
const HTML_NS = 'http://www.w3.org/1999/xhtml';

class FakeNode {
  constructor(nodeType, nodeName, ownerDocument, namespaceURI = null) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.ownerDocument = ownerDocument;
    this.namespaceURI = namespaceURI;
    this.childNodes = [];
    this.parentNode = null;
    this.nodeValue = null;
    this.attributes = new Map();
    this.listeners = new Map();
    const style = {};
    Object.defineProperties(style, {
      setProperty: { value(name, value) { style[name] = value; } },
      removeProperty: { value(name) { delete style[name]; } },
    });
    this.style = style;
  }
  get tagName() { return this.nodeType === 1 ? this.nodeName : undefined; }
  get firstChild() { return this.childNodes[0] || null; }
  get lastChild() { return this.childNodes[this.childNodes.length - 1] || null; }
  appendChild(child) {
    child.parentNode?.removeChild(child);
    this.childNodes.push(child);
    child.parentNode = this;
    return child;
  }
  insertBefore(child, before) {
    if (!before) return this.appendChild(child);
    child.parentNode?.removeChild(child);
    this.childNodes.splice(this.childNodes.indexOf(before), 0, child);
    child.parentNode = this;
    return child;
  }
  removeChild(child) {
    const at = this.childNodes.indexOf(child);
    if (at >= 0) this.childNodes.splice(at, 1);
    child.parentNode = null;
    return child;
  }
  contains(node) {
    for (let n = node; n; n = n.parentNode) if (n === this) return true;
    return false;
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  removeAttribute(name) { this.attributes.delete(name); }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(fn);
  }
  removeEventListener(type, fn) { this.listeners.get(type)?.delete(fn); }
  get textContent() {
    if (this.nodeType === 3) return this.nodeValue;
    return this.childNodes.map((c) => c.textContent).join('');
  }
  set textContent(value) {
    if (this.nodeType === 3) { this.nodeValue = String(value); return; }
    for (const c of this.childNodes) c.parentNode = null;
    this.childNodes = [];
    if (value !== '' && value != null) this.appendChild(this.ownerDocument.createTextNode(String(value)));
  }
}

function makeDocument() {
  const doc = new FakeNode(9, '#document', null);
  doc.createElement = (tag) => new FakeNode(1, tag.toUpperCase(), doc, HTML_NS);
  doc.createElementNS = (ns, tag) => new FakeNode(1, tag, doc, ns);
  doc.createTextNode = (text) => {
    const node = new FakeNode(3, '#text', doc);
    node.nodeValue = String(text);
    return node;
  };
  doc.documentElement = doc.appendChild(doc.createElement('html'));
  doc.body = doc.documentElement.appendChild(doc.createElement('body'));
  doc.activeElement = null;
  return doc;
}

// ── Browser globals the view and its store touch ──────────────────────────
const rows = new Map();
const windowListeners = new Map();
const document = makeDocument();
globalThis.window = {
  document,
  localStorage: {
    getItem: (k) => (rows.has(k) ? rows.get(k) : null),
    setItem: (k, v) => { rows.set(k, String(v)); },
    removeItem: (k) => { rows.delete(k); },
  },
  addEventListener(type, fn) {
    if (!windowListeners.has(type)) windowListeners.set(type, new Set());
    windowListeners.get(type).add(fn);
  },
  removeEventListener(type, fn) { windowListeners.get(type)?.delete(fn); },
  dispatchEvent(event) {
    for (const fn of [...(windowListeners.get(event.type) || [])]) fn(event);
    return true;
  },
  HTMLIFrameElement: class HTMLIFrameElement {},
  location: { protocol: 'http:' },
};
globalThis.document = document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/** FileReader that finishes only when the test says so. */
const reads = [];
globalThis.FileReader = class FakeFileReader {
  readAsDataURL(file) { this.file = file; reads.push(this); }
  finish(result) { this.result = result; this.onload?.(); }
  fail() { this.error = new Error('read failed'); this.onerror?.(); }
};

// ── The view, compiled from source, with the editor chunk stood in ────────
const react = await import('react');
const { createRoot } = await import('react-dom/client');
const { act, createElement } = react;
const io = await import(pathToFileURL(join(ROOT, 'src/lib/image-occlusion.js')).href);

/** Every editor mount: the initialDeck it mounted with, and its callbacks. */
const mounts = [];
globalThis.__occlusionEditorMounts = mounts;
const EDITOR_STUB = [
  `import { createElement, useState } from ${JSON.stringify(import.meta.resolve('react'))};`,
  'export default function EditorStandIn(props) {',
  '  useState(() => { globalThis.__occlusionEditorMounts.push(props); return 0; });',
  "  return createElement('section', null, 'editor');",
  '}',
].join('\n');
const dataUrl = (code) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;

const compiled = (await transformWithEsbuild(
  readFileSync(VIEW_PATH, 'utf8'), VIEW_PATH, { jsx: 'automatic', format: 'esm', sourcemap: false },
)).code;
let editorImports = 0;
const VIEW_CODE = compiled.replace(/(from\s*|import\s*\(\s*)"([^"]+)"/g, (_, lead, spec) => {
  let target;
  if (spec === EDITOR_SPEC) { editorImports += 1; target = dataUrl(EDITOR_STUB); }
  else if (spec.startsWith('.')) target = pathToFileURL(resolve(dirname(VIEW_PATH), spec)).href;
  else target = import.meta.resolve(spec);
  return `${lead}${JSON.stringify(target)}`;
});
assert.equal(editorImports, 1, 'the view must still lazy-load the editor chunk');

let instance = 0;
/** A fresh copy of the view module, so its lazy editor starts unloaded. */
async function freshView() {
  instance += 1;
  return (await import(dataUrl(`${VIEW_CODE}\n// instance ${instance}\n`))).default;
}

// ── Helpers ───────────────────────────────────────────────────────────────
const propsOf = (node) => {
  const key = Object.keys(node).find((k) => k.startsWith('__reactProps$'));
  return key ? node[key] : null;
};
function findNode(root, pred) {
  if (root.nodeType === 1 && pred(root)) return root;
  for (const c of root.childNodes) {
    const hit = findNode(c, pred);
    if (hit) return hit;
  }
  return null;
}

/** Let pending chunk loads and timers run until the screen stops changing. */
async function settle(container) {
  let last = '';
  let stable = 0;
  for (let i = 0; i < 60 && stable < 3; i += 1) {
    await act(async () => { await new Promise((r) => setTimeout(r, 2)); });
    const now = `${container.textContent}|${mounts.length}`;
    stable = now === last ? stable + 1 : 0;
    last = now;
  }
}

/** Views still on screen; each test's are taken down even when it fails. */
const mounted = new Set();
afterEach(async () => {
  for (const view of [...mounted]) await view.unmount();
});

async function mountView() {
  rows.clear();
  reads.length = 0;
  mounts.length = 0;
  const View = await freshView();
  const container = document.body.appendChild(document.createElement('div'));
  const root = createRoot(container);
  await act(async () => { root.render(createElement(View, { goHome() {} })); });
  const view = {
    container,
    text: () => container.textContent,
    async drop(file) {
      const zone = findNode(container, (n) => typeof propsOf(n)?.onDrop === 'function');
      assert.ok(zone, 'the empty screen must have a drop zone');
      await act(async () => {
        propsOf(zone).onDrop({ preventDefault() {}, dataTransfer: { files: [file] } });
      });
      await settle(container);
    },
    async click(label) {
      const button = findNode(container, (n) => n.nodeName === 'BUTTON'
        && (n.textContent.includes(label) || (n.getAttribute('aria-label') || '').includes(label)));
      assert.ok(button, `no button "${label}" on screen`);
      await act(async () => { propsOf(button).onClick(); });
      await settle(container);
    },
    async finishRead(result) {
      const reader = reads[reads.length - 1];
      assert.ok(reader, 'the dropped file must be read');
      await act(async () => { reader.finish(result); });
      await settle(container);
    },
    async failRead() {
      const reader = reads[reads.length - 1];
      assert.ok(reader, 'the dropped file must be read');
      await act(async () => { reader.fail(); });
      await settle(container);
    },
    async unmount() {
      if (!mounted.delete(view)) return;
      await act(async () => { root.unmount(); });
      container.parentNode?.removeChild(container);
    },
  };
  mounted.add(view);
  return view;
}

const png = () => new File([Uint8Array.of(0x89, 0x50, 0x4e, 0x47)], 'heart.png', { type: 'image/png' });

// ── Tests ─────────────────────────────────────────────────────────────────

test('a picture dropped on the empty screen opens in the editor (editor chunk not loaded yet)', async () => {
  const view = await mountView();
  assert.match(view.text(), /สร้าง deck แรก/);
  await view.drop(png());
  assert.equal(reads.length, 1, 'the dropped file is read once');
  assert.equal(reads[0].file.name, 'heart.png');
  assert.equal(mounts.length, 0, 'the editor must not open before the dropped picture is read');
  assert.match(view.text(), /กำลังเปิดรูป/);
  await view.finishRead(PNG);
  assert.equal(mounts.length, 1, 'the editor mounts once');
  assert.equal(mounts[0].initialDeck?.imageDataUrl, PNG, 'the editor must open with the dropped picture');
  assert.deepEqual(mounts[0].initialDeck.masks, [], 'a dropped picture starts with no boxes');
  // Saving from there keeps the picture, and the deck lands in the list.
  let saved;
  await act(async () => {
    saved = mounts[0].onSave({ name: 'Heart', imageDataUrl: mounts[0].initialDeck.imageDataUrl, masks: [] });
  });
  await settle(view.container);
  assert.equal(saved?.imageDataUrl, PNG);
  assert.equal(io.loadDecks().length, 1);
  assert.match(view.text(), /1\/30 decks/);
  await view.unmount();
});

test('a picture dropped after the editor chunk has loaded also opens in the editor', async () => {
  const view = await mountView();
  await view.click('เลือกรูปและสร้าง deck');
  assert.equal(mounts.length, 1, 'the CTA opens the editor');
  await act(async () => { mounts[0].onClose(); });
  await view.drop(png());
  assert.equal(mounts.length, 1, 'the editor must not open before the dropped picture is read');
  await view.finishRead(PNG);
  assert.equal(mounts.length, 2, 'the editor mounts once for the drop');
  assert.equal(mounts[1].initialDeck?.imageDataUrl, PNG, 'the editor must open with the dropped picture');
  await view.unmount();
});

test('a dropped file that is not a picture only says so', async () => {
  const view = await mountView();
  await view.drop(new File(['notes'], 'notes.txt', { type: 'text/plain' }));
  assert.match(view.text(), /ไฟล์ไม่ใช่รูป/);
  assert.equal(reads.length, 0, 'nothing is read');
  assert.equal(mounts.length, 0, 'the editor stays closed');
  assert.match(view.text(), /สร้าง deck แรก/);
  await view.unmount();
});

test('a dropped picture that cannot be read shows the error, and ปิด goes back', async () => {
  const view = await mountView();
  await view.drop(png());
  await view.failRead();
  assert.match(view.text(), /อ่านไฟล์ไม่ได้/);
  assert.equal(mounts.length, 0, 'no empty editor behind the error');
  await view.click('ปิด');
  assert.match(view.text(), /สร้าง deck แรก/);
  await view.unmount();
});

test('a new deck and an existing deck still open the editor straight away', async () => {
  const view = await mountView();
  await view.click('เลือกรูปและสร้าง deck');
  assert.equal(mounts.length, 1);
  assert.equal(mounts[0].initialDeck, null, 'a new deck opens with no picture');
  assert.equal(reads.length, 0);
  await view.unmount();

  const listed = await mountView();
  let deck;
  await act(async () => { deck = io.saveDeck({ name: 'Heart', imageDataUrl: PNG, masks: [] }); });
  assert.ok(deck && rows.has(DECK_KEY));
  await settle(listed.container);
  await listed.click('เปิด deck Heart');
  assert.equal(mounts.length, 1);
  assert.equal(mounts[0].initialDeck?.id, deck.id, 'an existing deck opens as itself');
  assert.equal(mounts[0].initialDeck?.imageDataUrl, PNG);
  assert.equal(reads.length, 0);
  await listed.unmount();
});
