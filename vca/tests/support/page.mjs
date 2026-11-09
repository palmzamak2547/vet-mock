// A page of the app run in this process, for tests of what a page does rather than what one
// function returns: the real component under the real react-dom, in a document just large enough
// for it (no browser). Importing this module installs the document and the window and registers
// support/jsx-hooks.mjs, so import it first and the page after it, with import():
//   import { mount, press, settle } from '../support/page.mjs';
//   const { default: Session } = await import('../../src/pages/Session.jsx');
// Handlers that listen on the document (the session page's keys) hear press(); React's own
// events are not dispatched.
import { register } from 'node:module';

register('./jsx-hooks.mjs', import.meta.url);

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const DOCUMENT_NODE = 9;
const HTML_NS = 'http://www.w3.org/1999/xhtml';

class Listeners {
  constructor() { this.map = new Map(); }
  add(type, fn) { if (!this.map.has(type)) this.map.set(type, new Set()); this.map.get(type).add(fn); }
  remove(type, fn) { this.map.get(type)?.delete(fn); }
  fire(event) { for (const fn of [...(this.map.get(event.type) || [])]) fn(event); }
}

class FakeNode {
  constructor(nodeType, nodeName, ownerDocument) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.childNodes = [];
    this.listeners = new Listeners();
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
    this.childNodes.splice(this.childNodes.indexOf(ref), 0, child);
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
  contains(node) {
    for (let n = node; n; n = n.parentNode) if (n === this) return true;
    return false;
  }
  addEventListener(type, fn) { this.listeners.add(type, fn); }
  removeEventListener(type, fn) { this.listeners.remove(type, fn); }
  get textContent() { return this.childNodes.map((c) => c.textContent).join(''); }
  set textContent(value) {
    for (const c of this.childNodes) c.parentNode = null;
    this.childNodes = [];
    if (value !== '' && value != null) this.appendChild(this.ownerDocument.createTextNode(String(value)));
  }
}

class FakeText extends FakeNode {
  constructor(text, ownerDocument) { super(TEXT_NODE, '#text', ownerDocument); this.nodeValue = text; }
  get textContent() { return this.nodeValue; }
  set textContent(value) { this.nodeValue = String(value); }
}

class FakeStyle {
  setProperty(name, value) { this[name] = value; }
  removeProperty(name) { delete this[name]; }
}

class FakeElement extends FakeNode {
  innerHTML = '';
  constructor(tagName, ownerDocument, namespaceURI = HTML_NS) {
    super(ELEMENT_NODE, tagName.toUpperCase(), ownerDocument);
    this.tagName = tagName.toUpperCase();
    this.namespaceURI = namespaceURI;
    this.attributes = new Map();
    this.style = new FakeStyle();
    this.isContentEditable = false;
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  hasAttribute(name) { return this.attributes.has(name); }
  removeAttribute(name) { this.attributes.delete(name); }
  focus() { this.ownerDocument.activeElement = this; }
  blur() { if (this.ownerDocument.activeElement === this) this.ownerDocument.activeElement = this.ownerDocument.body; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
  getBoundingClientRect() { return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }; }
  scrollIntoView() {}
}

class FakeDocument extends FakeNode {
  constructor() {
    super(DOCUMENT_NODE, '#document', null);
    this.ownerDocument = null;
    this.documentElement = new FakeElement('html', this);
    this.body = new FakeElement('body', this);
    this.documentElement.appendChild(this.body);
    this.activeElement = this.body;
    this.visibilityState = 'visible';
    this.title = '';
  }
  createElement(tag) { return new FakeElement(tag, this); }
  createElementNS(ns, tag) { return new FakeElement(tag, this, ns); }
  createTextNode(text) { return new FakeText(text, this); }
  querySelector() { return null; }
  querySelectorAll() { return []; }
  getElementById() { return null; }
}

export const document = new FakeDocument();

const ORIGIN = 'https://vca.vetmock.com';
const windowListeners = new Listeners();
const location = { origin: ORIGIN, pathname: '/', search: '', hash: '', get href() { return `${ORIGIN}${this.pathname}${this.search}${this.hash}`; } };
const goTo = (url) => {
  const u = new URL(url, location.href);
  location.pathname = u.pathname;
  location.search = u.search;
  location.hash = u.hash;
};
const history = {
  state: null,
  replaceState(state, _title, url) { history.state = state; if (url != null) goTo(url); },
  pushState(state, _title, url) { history.state = state; if (url != null) goTo(url); },
};

export const window = {
  document,
  HTMLIFrameElement: class HTMLIFrameElement {},
  location,
  history,
  navigator: globalThis.navigator,
  innerWidth: 400,
  innerHeight: 800,
  scrollX: 0,
  scrollY: 0,
  addEventListener: (type, fn) => windowListeners.add(type, fn),
  removeEventListener: (type, fn) => windowListeners.remove(type, fn),
  dispatchEvent: (event) => { windowListeners.fire(event); return true; },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
  requestAnimationFrame: () => 0,
  cancelAnimationFrame() {},
  scrollTo() {},
};

globalThis.window = window;
globalThis.document = document;
globalThis.HTMLElement = FakeElement;
globalThis.requestAnimationFrame = window.requestAnimationFrame;
globalThis.cancelAnimationFrame = window.cancelAnimationFrame;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/** Put the address bar at `path` before a page mounts. */
export const at = (path) => goTo(path);

const { act, createElement } = await import('react');
const { createRoot } = await import('react-dom/client');
export { act };

/**
 * Mount `Component` under a fresh container; it is unmounted when the test ends, even when it
 * fails. Returns { container, unmount }.
 */
export async function mount(t, Component, props = {}) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => { root.render(createElement(Component, props)); });
  let mounted = true;
  const unmount = async () => {
    if (!mounted) return;
    mounted = false;
    await act(async () => { root.unmount(); });
    document.body.removeChild(container);
  };
  t.after(unmount);
  return { container, unmount };
}

/** Let fetches and effects run, a few milliseconds at a time, until `done()` or `rounds` run out. */
export async function settle(done = () => false, rounds = 40) {
  for (let i = 0; i < rounds && !done(); i += 1) {
    await act(async () => { await new Promise((r) => setTimeout(r, 5)); });
  }
}

/** A key pressed on the page (on `target`, the body by default), as the document's listeners hear it. */
export async function press(code, { key = code, target = document.body } = {}) {
  const event = {
    type: 'keydown', code, key, target, metaKey: false, ctrlKey: false, altKey: false, shiftKey: false,
    defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, stopPropagation() {},
  };
  await act(async () => { document.listeners.fire(event); });
  return event;
}
