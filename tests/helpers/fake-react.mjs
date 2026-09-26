// ============================================================
// fake-react — drive a component's real source without a DOM
// ============================================================
// The component file is bundled with esbuild (the transformer Vite ships),
// `react` and `react/jsx-runtime` are swapped for a small deterministic hook
// runtime, and any module the test names is replaced by a stub. A mounted
// component returns a plain element tree; handlers are called directly, as
// React would call them, and `flush()` re-renders after state changed.
//
// It is deliberately small: one component instance with real hooks (state,
// refs, effects with deps and cleanup, memo, callback), nested function
// components expanded statelessly for reading the tree. Enough to prove
// what a component shows and what a handler does with its props.
// ============================================================

import { build } from 'esbuild';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

const FRAGMENT = Symbol.for('fake-react.fragment');

// ── The hook runtime ───────────────────────────────────────────────────────
let current = null;
const stateless = () => ({ stateless: true, slots: [], cursor: 0, ecursor: 0, effects: [] });

function slot(init) {
  const inst = current || stateless();
  const i = inst.cursor++;
  if (!(i in inst.slots)) inst.slots[i] = init();
  return [inst, i];
}

const R = {
  Fragment: FRAGMENT,
  jsx(type, props, key) { return { type, props: props || {}, key: key ?? null }; },
  createElement(type, props, ...children) {
    const p = { ...(props || {}) };
    if (children.length) p.children = children.length === 1 ? children[0] : children;
    return { type, props: p, key: p.key ?? null };
  },
  useState(init) {
    const [inst, i] = slot(() => (typeof init === 'function' ? init() : init));
    const set = (v) => {
      if (inst.stateless || inst.dead) return;
      const next = typeof v === 'function' ? v(inst.slots[i]) : v;
      if (!Object.is(next, inst.slots[i])) { inst.slots[i] = next; inst.dirty = true; }
    };
    return [inst.slots[i], set];
  },
  useReducer(reducer, init) {
    const [s, set] = R.useState(init);
    return [s, (a) => set((cur) => reducer(cur, a))];
  },
  useRef(init) { const [inst, i] = slot(() => ({ current: init })); return inst.slots[i]; },
  useMemo(fn, deps) {
    const [inst, i] = slot(() => ({ deps: undefined, value: undefined }));
    const box = inst.slots[i];
    if (!box.deps || !deps || deps.some((d, n) => !Object.is(d, box.deps[n]))) { box.value = fn(); box.deps = deps; }
    return box.value;
  },
  useCallback(fn, deps) { return R.useMemo(() => fn, deps); },
  useId() { const [inst, i] = slot(() => `fr-${Math.random().toString(36).slice(2, 8)}`); return inst.slots[i]; },
  useEffect(fn, deps) {
    const inst = current;
    if (!inst || inst.stateless) return;
    const i = inst.ecursor++;
    const prev = inst.effects[i];
    if (!prev || !deps || !prev.deps || deps.some((d, n) => !Object.is(d, prev.deps[n]))) {
      inst.queue.push({ i, fn, deps });
    }
  },
  useLayoutEffect(fn, deps) { R.useEffect(fn, deps); },
  useContext(ctx) { return ctx?._value; },
  createContext(v) { return { _value: v, Provider: ({ children }) => children }; },
  memo: (c) => c,
  forwardRef: (c) => (props) => c(props, props.ref),
  lazy: () => () => null,
  Suspense: ({ children }) => children,
  startTransition: (fn) => fn(),
};
globalThis.__fakeReact = R;

// ── Mounting ───────────────────────────────────────────────────────────────
export function mount(Comp, props = {}) {
  const inst = { slots: [], effects: [], queue: [], cursor: 0, ecursor: 0, dirty: false, dead: false, props, tree: null, renders: 0 };
  const renderOnce = () => {
    inst.dirty = false;
    inst.queue = [];
    inst.cursor = 0;
    inst.ecursor = 0;
    current = inst;
    try { inst.tree = Comp(inst.props); } finally { current = null; }
    inst.renders++;
    for (const { i, fn, deps } of inst.queue) {
      inst.effects[i]?.cleanup?.();
      const cleanup = fn();
      inst.effects[i] = { deps, cleanup: typeof cleanup === 'function' ? cleanup : null };
    }
  };
  inst.render = () => {
    let guard = 0;
    do { renderOnce(); } while (inst.dirty && !inst.dead && ++guard < 50);
    if (guard >= 50) throw new Error('fake-react: render loop');
    return inst.tree;
  };
  inst.flush = () => { if (inst.dirty && !inst.dead) inst.render(); return inst.tree; };
  inst.update = (next) => { inst.props = { ...inst.props, ...next }; return inst.render(); };
  inst.unmount = () => {
    for (const e of inst.effects) e?.cleanup?.();
    inst.dead = true;
  };
  inst.render();
  return inst;
}

/** Let pending promises settle, then re-render if state changed. */
export async function settle(inst, rounds = 5) {
  for (let r = 0; r < rounds; r++) {
    await new Promise((res) => setTimeout(res, 0));
    inst.flush();
  }
  return inst.tree;
}

// ── Reading the tree ───────────────────────────────────────────────────────
// Function components below the root are expanded statelessly (their own
// state starts at its initial value), which is enough to read what they draw.
export function walk(node, visit) {
  if (node == null || typeof node === 'boolean') return;
  if (Array.isArray(node)) { for (const n of node) walk(n, visit); return; }
  if (typeof node !== 'object') return;
  if (typeof node.type === 'function') {
    const saved = current;
    current = null;
    let out;
    try { out = node.type(node.props || {}); } finally { current = saved; }
    walk(out, visit);
    return;
  }
  visit(node);
  walk(node.props?.children, visit);
}

export function findAll(tree, pred) {
  const hits = [];
  walk(tree, (n) => { if (pred(n)) hits.push(n); });
  return hits;
}

export function textOf(node) {
  let s = '';
  const go = (n) => {
    if (n == null || typeof n === 'boolean') return;
    if (typeof n === 'string' || typeof n === 'number') { s += String(n); return; }
    if (Array.isArray(n)) { n.forEach(go); return; }
    if (typeof n.type === 'function') {
      const saved = current;
      current = null;
      try { go(n.type(n.props || {})); } finally { current = saved; }
      return;
    }
    go(n.props?.children);
  };
  go(node);
  return s;
}

// ── Loading a component module ─────────────────────────────────────────────
/**
 * Bundle `entry` (repo-relative) with react swapped for the runtime above.
 * `stubs` maps a regex source matched against the resolved import path to
 * the module text that replaces it (JSX allowed; react imports resolve to
 * the fake runtime too).
 */
export async function loadModule(entry, { stubs = [] } = {}) {
  const plugin = {
    name: 'fake-react',
    setup(b) {
      b.onResolve({ filter: /^react(\/jsx-runtime|\/jsx-dev-runtime)?$/ }, (args) => ({ path: args.path, namespace: 'fake-react' }));
      b.onLoad({ filter: /.*/, namespace: 'fake-react' }, (args) => ({
        contents: args.path === 'react'
          ? `const R = globalThis.__fakeReact;
             export const { Fragment, createElement, useState, useReducer, useRef, useMemo, useCallback, useId, useEffect, useLayoutEffect, useContext, createContext, memo, forwardRef, lazy, Suspense, startTransition } = R;
             export default R;`
          : `const R = globalThis.__fakeReact; export const jsx = R.jsx; export const jsxs = R.jsx; export const jsxDEV = R.jsx; export const Fragment = R.Fragment;`,
        loader: 'js',
      }));
      for (const [i, s] of stubs.entries()) {
        const re = new RegExp(s.match);
        b.onResolve({ filter: re }, (args) => ({ path: `stub-${i}:${args.path}`, namespace: 'fake-stub' }));
      }
      b.onLoad({ filter: /.*/, namespace: 'fake-stub' }, (args) => {
        const i = Number(args.path.slice(5, args.path.indexOf(':')));
        return { contents: stubs[i].contents, loader: 'jsx', resolveDir: repoRoot };
      });
    },
  };
  const result = await build({
    stdin: {
      contents: /^export default /m.test(readFileSync(join(repoRoot, entry), 'utf8'))
        ? `export * from './${entry}'; export { default } from './${entry}';`
        : `export * from './${entry}';`,
      resolveDir: repoRoot,
      loader: 'js',
    },
    bundle: true,
    format: 'esm',
    platform: 'browser',
    jsx: 'automatic',
    loader: { '.js': 'jsx', '.jsx': 'jsx' },
    plugins: [plugin],
    write: false,
    logLevel: 'silent',
  });
  const dir = mkdtempSync(join(tmpdir(), 'fake-react-'));
  const file = join(dir, 'module.mjs');
  writeFileSync(file, result.outputFiles[0].text);
  try {
    return await import(pathToFileURL(file).href);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
