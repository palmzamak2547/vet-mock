// ============================================================
// boot-weight.test.mjs — what every visit downloads before Home can paint
// ============================================================
// The entry stylesheet is a render-blocking <link>: nothing paints until it
// has arrived and been parsed. It carried the owner's back-office styles
// (about 14 KB of .ad-* rules) for every student on every boot, although
// one account ever opens that page. Those rules now travel with AdminView's
// own lazy chunk, whose CSS Vite loads and waits for before the view mounts.
//
// Which files reach the boot stylesheet is read from the real import graph:
// esbuild walks src/main.jsx and reports every import with its kind, and a
// stylesheet reachable from the entry through static imports alone is one
// Vite puts in the entry CSS.
//
// A sheet may leave the boot path only when every rule in it is scoped to a
// class used by nothing else, because until its chunk loads it applies to
// nothing. The admin sheet is. The landing sheet is not: it also carries
// two app-wide rules (the small-button size on phones up to 430 px, the
// subject-card hover on touch screens), so it stays in the boot stylesheet,
// and the guard below fails if it is moved without splitting those out.
//
// The idle prefetch no longer pulls the sign-in screen for a student who is
// already signed in.
// ============================================================

import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { build } from 'esbuild';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');

// ── The import graph, as a bundler sees it ───────────────────────────
let inputs;
before(async () => {
  const result = await build({
    entryPoints: [join(ROOT, 'src/main.jsx')],
    absWorkingDir: ROOT,
    bundle: true,
    write: false,
    metafile: true,
    splitting: true,
    format: 'esm',
    outdir: join(ROOT, '.boot-weight-probe'),
    packages: 'external',
    platform: 'browser',
    jsx: 'automatic',
    logLevel: 'silent',
    loader: {
      '.js': 'jsx', '.jsx': 'jsx', '.json': 'json',
      '.png': 'empty', '.jpg': 'empty', '.jpeg': 'empty', '.svg': 'empty', '.webp': 'empty',
      '.woff2': 'empty', '.woff': 'empty', '.wasm': 'empty', '.glb': 'empty',
    },
    plugins: [{
      name: 'vite-only-specifiers',
      setup(b) {
        // `?url`, `?worker` and friends, and /public paths inside CSS, are
        // Vite's to resolve; the graph only needs to know they are leaves.
        b.onResolve({ filter: /\?/ }, (a) => ({ path: a.path, external: true }));
        b.onResolve({ filter: /^\// }, (a) => (a.importer.endsWith('.css') ? { path: a.path, external: true } : undefined));
      },
    }],
  });
  inputs = result.metafile.inputs;
});

// Files reachable from `from` through static imports only.
function staticReach(from) {
  assert.ok(inputs[from], `${from} is not in the import graph`);
  const seen = new Set([from]);
  const queue = [from];
  while (queue.length) {
    for (const edge of inputs[queue.shift()]?.imports || []) {
      if (edge.external || edge.kind !== 'import-statement') continue;
      if (!seen.has(edge.path)) { seen.add(edge.path); queue.push(edge.path); }
    }
  }
  return seen;
}
const importsOf = (file) => inputs[file]?.imports || [];

// ── What a stylesheet's rules can reach ──────────────────────────────
// Every selector in the sheet, with @media/@supports unwrapped, plus the
// at-rules that act globally whatever their selectors say.
function sheetParts(css) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const selectors = [];
  const keyframes = [];
  const globals = [];
  for (const m of text.matchAll(/([^{};]+)\{/g)) {
    const head = m[1].trim();
    if (head.startsWith('@')) {
      const kf = head.match(/^@(?:-webkit-)?keyframes\s+([\w-]+)/);
      if (kf) keyframes.push(kf[1]);
      else if (!/^@(media|supports|container|layer)\b/.test(head)) globals.push(head);
      continue;
    }
    if (/^(from|to|[\d.]+%)(\s*,\s*(from|to|[\d.]+%))*$/.test(head)) continue; // keyframe steps
    for (const part of head.split(',')) selectors.push(part.trim());
  }
  return { selectors, keyframes, globals };
}
// Selectors in `css` that can match an element outside the classes named by
// `prefixes` (an .ad-x ancestor or subject is inside; anything else is not).
function unscoped(css, prefixes) {
  const scoped = (s) => prefixes.some((p) => s.includes(`.${p}`) || s.includes(`#${p}`));
  const { selectors, keyframes, globals } = sheetParts(css);
  return [
    ...selectors.filter((s) => !scoped(s)),
    ...keyframes.filter((k) => !prefixes.some((p) => k.startsWith(p))).map((k) => `@keyframes ${k}`),
    ...globals,
  ];
}

// Class names written in className attributes across the app's source.
function filesUsingClassPrefix(prefix) {
  const hits = [];
  const walk = (dir) => {
    for (const name of readdirSync(join(ROOT, dir))) {
      const rel = `${dir}/${name}`;
      if (statSync(join(ROOT, rel)).isDirectory()) { if (name !== 'data') walk(rel); continue; }
      if (!/\.(jsx?|mjs)$/.test(name)) continue;
      const src = read(rel);
      for (const m of src.matchAll(/className=(\{`[^`]*`\}|"[^"]*"|'[^']*'|\{[^}\n]*\})/g)) {
        if (new RegExp(`(^|[\\s"'\`{])${prefix}[a-z]`).test(m[1])) { hits.push(rel); break; }
      }
    }
  };
  walk('src');
  return hits.sort();
}

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────

test('the back-office stylesheet is not in the boot stylesheet', () => {
  const boot = staticReach('src/main.jsx');
  assert.ok(boot.has('src/styles.css'), 'the scan finds the main stylesheet on the boot path');
  assert.ok(!boot.has('src/styles-admin.css'),
    'styles-admin.css is statically reachable from the entry, so every student downloads it before Home paints');
  assert.ok(!boot.has('src/views/AdminView.jsx'), 'AdminView must stay a lazy chunk');
  // It travels with the view that uses it, and that view is reached lazily.
  assert.ok(importsOf('src/views/AdminView.jsx').some((e) => e.path === 'src/styles-admin.css' && e.kind === 'import-statement'),
    'AdminView must import its own stylesheet, or the back-office renders unstyled');
  assert.ok(importsOf('src/App.jsx').some((e) => e.path === 'src/views/AdminView.jsx' && e.kind === 'dynamic-import'));
});

test('the back-office sheet styles nothing outside the back-office', () => {
  // Until AdminView's chunk loads the sheet applies to nothing, so any rule
  // in it that could match another screen would be a rule that silently
  // stopped applying there.
  const sheet = read('src/styles-admin.css');
  assert.ok(sheetParts(sheet).selectors.length > 100, 'the scan reads the back-office rules');
  assert.deepEqual(unscoped(sheet, ['ad-']), [],
    'every selector in styles-admin.css must sit inside an .ad-* element');
  const users = filesUsingClassPrefix('ad-');
  const admin = staticReach('src/views/AdminView.jsx');
  const outside = users.filter((rel) => !admin.has(rel));
  assert.ok(users.includes('src/views/AdminView.jsx'), 'the scan finds the back-office classes');
  assert.deepEqual(outside, [], '.ad-* classes are used by a screen that does not load the back-office stylesheet');
});

test('the landing sheet leaves the boot path only once it holds nothing the app relies on', () => {
  // The scan catches an app-wide rule tucked inside a media query, which is
  // how the landing sheet holds the small-button size today.
  assert.deepEqual(
    unscoped('@media (max-width: 430px) { .vmx-btn-sm { padding: 8px; } } .lp-root .vmx-btn { overflow: visible; }', ['lp-']),
    ['.vmx-btn-sm'],
  );
  if (staticReach('src/main.jsx').has('src/styles-landing.css')) return;
  assert.deepEqual(unscoped(read('src/styles-landing.css'), ['lp-', 'cta']), [],
    'styles-landing.css left the boot stylesheet while it still styles the app outside the landing');
});

// ── The idle prefetch ────────────────────────────────────────────────
// App's own effect, lifted out of App.jsx and run with the browser pieces it
// touches stood in. Returns the chunks it asked for.
function idlePrefetch({ savedSession, saveData = false }) {
  const app = read('src/App.jsx');
  const start = app.indexOf('useEffect(', app.indexOf('// Idle-time prefetch'));
  const end = app.indexOf('}, []);', start);
  assert.ok(start > 0 && end > start, 'the idle prefetch effect moved');
  const effect = app.slice(start + 'useEffect('.length, end + 1).replace(/\bimport\(/g, '__import(');
  const requested = [];
  const ctx = vm.createContext({
    window: { requestIdleCallback: (cb) => { cb(); return 1; }, cancelIdleCallback() {} },
    navigator: { connection: { saveData } },
    hasSavedSession: () => savedSession,
    __import: (spec) => { requested.push(spec); return Promise.resolve({}); },
  });
  vm.runInContext(`(${effect})()`, ctx);
  return requested;
}

test('a signed-in student is not sent the sign-in screen at idle', () => {
  const signedIn = idlePrefetch({ savedSession: true });
  const guest = idlePrefetch({ savedSession: false });
  assert.ok(!signedIn.includes('./views/AuthView.jsx'),
    'the sign-in screen was prefetched for a student who already holds a session');
  assert.ok(guest.includes('./views/AuthView.jsx'), 'a visitor who may sign in still gets it warmed');
  assert.deepEqual(signedIn, guest.filter((spec) => spec !== './views/AuthView.jsx'),
    'the other prefetched screens must not change');
  assert.ok(signedIn.includes('./views/HomeView.jsx'));
  assert.deepEqual(idlePrefetch({ savedSession: false, saveData: true }), [], 'Save-Data still gets nothing');
});
