// ============================================================
// mini-dom.mjs — mount a real component without a browser
// ============================================================
// A document just large enough for react-dom 18 to mount and update divs,
// spans, buttons, inputs and svg, plus a bundler that compiles the source
// that ships (esbuild, jsx automatic) and loads it in this process. Tests
// drive it the way React itself would: they read a node's React props and
// call the handler (onClick, onChange) inside act().
//
// React stays external, loaded from node_modules as usual: bundled, its
// act() cannot reach Node's timers and falls back to MessageChannel ports
// that keep the test process alive after the last test.
//
// Not a test file: node --test only picks up tests/unit/*.test.mjs.
// ============================================================
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

export const ELEMENT_NODE = 1;
export const TEXT_NODE = 3;
const DOCUMENT_NODE = 9;
const HTML_NS = 'http://www.w3.org/1999/xhtml';

export const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
const require = createRequire(import.meta.url);

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
  // An own innerHTML tells react-dom this is a node it can assign to, which
  // is how an svg with dangerouslySetInnerHTML is mounted. The markup is kept
  // as text and never parsed.
  innerHTML = '';
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

/** A Storage-shaped Map, so a component's saves can be read back. */
export function fakeStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    clear: () => map.clear(),
    get length() { return map.size; },
    key: (i) => [...map.keys()][i] ?? null,
  };
}

/**
 * Install window and document globals. Returns { document, storage, restore }.
 * Errors React reports through console.error are collected in `consoleErrors`
 * so a test can assert there were none.
 */
export function installDom() {
  const document = new FakeDocument();
  const storage = fakeStorage();
  class HTMLIFrameElement {}
  const fakeWindow = {
    document,
    HTMLIFrameElement,
    localStorage: storage,
    addEventListener() {},
    removeEventListener() {},
    location: { protocol: 'file:', href: 'file:///', origin: 'null' },
    requestAnimationFrame: () => 0,
    cancelAnimationFrame() {},
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  };
  const consoleErrors = [];
  const originalConsoleError = console.error;
  const previous = {
    window: globalThis.window,
    document: globalThis.document,
    act: globalThis.IS_REACT_ACT_ENVIRONMENT,
  };
  globalThis.window = fakeWindow;
  globalThis.document = document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  console.error = (...args) => { consoleErrors.push(args.map(String).join(' ')); };
  return {
    document,
    storage,
    consoleErrors,
    restore() {
      console.error = originalConsoleError;
      globalThis.window = previous.window;
      globalThis.document = previous.document;
      globalThis.IS_REACT_ACT_ENVIRONMENT = previous.act;
    },
  };
}

/** An esbuild plugin that replaces any module whose path matches `filter`. */
export function stubModule(filter, source) {
  return {
    name: `stub-${String(filter)}`,
    setup(b) {
      b.onResolve({ filter }, () => ({ path: `stub:${String(filter)}`, namespace: 'mini-dom-stub' }));
      b.onLoad({ filter: /.*/, namespace: 'mini-dom-stub' }, () => ({ contents: source, loader: 'jsx', resolveDir: repoRoot }));
    },
  };
}

const reactExternal = {
  name: 'react-external',
  setup(b) {
    b.onResolve({ filter: /^react(-dom)?(\/.*)?$/ }, (args) => ({
      path: pathToFileURL(require.resolve(args.path)).href,
      external: true,
    }));
  },
};

/**
 * Bundle `contents` (an ES module that re-exports what the test needs) with
 * the repository as its resolve root and import the result. React and
 * react-dom/client are appended to the exports as act, createElement and
 * createRoot. Returns { mod, dispose }.
 */
export async function bundleModule({ contents, plugins = [], prefix = 'mini-dom-' }) {
  const result = await build({
    stdin: {
      contents: [
        contents,
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
    plugins: [...plugins, reactExternal],
    write: false,
    logLevel: 'silent',
  });
  const tmp = mkdtempSync(join(tmpdir(), prefix));
  const file = join(tmp, 'bundle.mjs');
  writeFileSync(file, result.outputFiles[0].text);
  const mod = await import(pathToFileURL(file).href);
  return { mod, dispose: () => rmSync(tmp, { recursive: true, force: true }) };
}

/**
 * Mount one element under a fresh container. Returns { container, rerender }.
 * The tree is unmounted when the test ends, even when it fails.
 */
export async function mountElement(t, mod, document, element) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = mod.createRoot(container);
  await mod.act(async () => { root.render(element); });
  t.after(async () => {
    await mod.act(async () => { root.unmount(); });
    document.body.removeChild(container);
  });
  return { container };
}

export function walk(node, visit) {
  visit(node);
  for (const child of node.childNodes) walk(child, visit);
}

export function findAll(root, predicate) {
  const out = [];
  walk(root, (n) => { if (n.nodeType === ELEMENT_NODE && predicate(n)) out.push(n); });
  return out;
}

export function reactProps(node) {
  const key = Object.keys(node).find((k) => k.startsWith('__reactProps$'));
  if (!key) throw new Error(`no React props on <${node.tagName}>`);
  return node[key];
}

/** Buttons whose visible text includes `text`. */
export function buttonsWithText(root, text) {
  return findAll(root, (n) => n.tagName === 'BUTTON' && n.textContent.includes(text));
}

/** Call a node's onClick inside act(). */
export async function click(mod, node, event = {}) {
  await mod.act(async () => { reactProps(node).onClick({ preventDefault() {}, stopPropagation() {}, ...event }); });
}
