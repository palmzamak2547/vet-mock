// Modules moved out of the first load stay out. perf-budgets.json `lazyOnly` names them; perf:budget
// checks each against the build manifest (scripts/lib/perf-logic.mjs lazyOnlyProblems), and this file
// checks the same list, plus the helpers only they import, against the source import graph, so a
// static import that would pull one back fails before anything is built.
import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { lazyOnlyProblems } from '../../scripts/lib/perf-logic.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const budgets = JSON.parse(readFileSync(join(ROOT, 'perf-budgets.json'), 'utf8'));
const LAZY = budgets.lazyOnly.modules;
// Helpers imported only by a lazyOnly module: they leave with it and must not come back on their own.
const HELPERS = { 'src/lib/move-base.js': 'src/lib/origin-move.js' };
// Shared with lazy screens (the question card, results), so not single-owner, but off the first load too.
const ALSO_OFF = ['src/lib/haptics.js'];

let inputs;
before(async () => {
  const result = await build({
    entryPoints: [join(ROOT, 'src/main.jsx')],
    absWorkingDir: ROOT,
    bundle: true, write: false, metafile: true, splitting: true, format: 'esm',
    outdir: join(ROOT, '.first-load-lazy-probe'),
    packages: 'external', platform: 'browser', jsx: 'automatic', logLevel: 'silent',
    loader: {
      '.js': 'jsx', '.jsx': 'jsx', '.json': 'json',
      '.png': 'empty', '.jpg': 'empty', '.jpeg': 'empty', '.svg': 'empty', '.webp': 'empty',
      '.woff2': 'empty', '.woff': 'empty', '.wasm': 'empty', '.glb': 'empty',
    },
    plugins: [{
      name: 'vite-only-specifiers',
      setup(b) {
        b.onResolve({ filter: /\?/ }, (a) => ({ path: a.path, external: true }));
        b.onResolve({ filter: /^\// }, (a) => (a.importer.endsWith('.css') ? { path: a.path, external: true } : undefined));
      },
    }],
  });
  inputs = result.metafile.inputs;
});

function staticReach(from) {
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

test('every lazyOnly module and its helpers are outside the static imports of src/main.jsx', () => {
  const boot = staticReach('src/main.jsx');
  assert.ok(boot.has('src/App.jsx'), 'the walk sees the app');
  for (const file of [...LAZY, ...Object.keys(HELPERS), ...ALSO_OFF]) {
    assert.ok(inputs[file], `${file} is still in the graph (loaded with import())`);
    assert.ok(!boot.has(file), `${file} is statically reachable from src/main.jsx again: load it with import() behind its gate`);
  }
});

test('a lazyOnly helper is imported only by the module it leaves with', () => {
  for (const [helper, owner] of Object.entries(HELPERS)) {
    const importers = Object.entries(inputs).filter(([, v]) => v.imports.some((e) => e.path === helper)).map(([k]) => k);
    assert.deepEqual(importers, [owner], `${helper} gained an importer`);
  }
});

test('the theme panel holds the motion settings\' closed row while they load, word for word', () => {
  const picker = readFileSync(join(ROOT, 'src/components/ThemePicker.jsx'), 'utf8');
  const settings = readFileSync(join(ROOT, 'src/components/MotionSettings.jsx'), 'utf8');
  const shown = settings.match(/<details className="([^"]+)">\s*<summary>([^<]+)<\/summary>/);
  assert.ok(shown, 'MotionSettings opens from a <details> row');
  assert.match(picker, new RegExp(`const MOTION_SETTINGS_SUMMARY = '${shown[2]}';`));
  assert.match(picker, new RegExp(`<details className="${shown[1]}"[\\s\\S]*?<summary[\\s\\S]*?>\\{MOTION_SETTINGS_SUMMARY\\}</summary>\\s*</details>`));
  assert.match(settings, /export default function MotionSettings\(\)/, 'the component keeps its default export and no props');
});

// Where each lazyOnly module may be asked for with import(), and the condition each import sits behind.
// An import() anywhere else on the boot path (an App.jsx effect that warms the settings, say) would
// fetch it on every visit while every static check above still passed.
const ASKED_FROM = {
  'src/lib/origin-move.js': { from: 'src/main.jsx', behind: /^\s*(?:\}\s*else\s+)?if \(move === '(now|later)'\)/ },
  'src/lib/native-app.js': { from: 'src/main.jsx', behind: /^\s*if \(IS_APP\)/ },
  'src/components/MotionSettings.jsx': { from: 'src/components/ThemePicker.jsx', behind: /^const loadMotionSettings = \(\) => import/ },
};

test('a lazyOnly module is asked for only from its gate, and the gate only behind its condition', () => {
  const boot = staticReach('src/main.jsx');
  for (const [target, { from, behind }] of Object.entries(ASKED_FROM)) {
    const askers = [...boot].filter((file) => (inputs[file]?.imports || []).some((e) => e.path === target && e.kind === 'dynamic-import'));
    assert.deepEqual(askers, [from], `${target} is imported from ${askers.join(', ')}`);
    // Each import() line in the gate, with the line it depends on: itself, or the if above it.
    const lines = readFileSync(join(ROOT, from), 'utf8').replace(/\r\n/g, '\n').split('\n');
    const name = target.split('/').pop();
    const at = lines.map((l, i) => (l.includes(`import('./`) && l.includes(name) ? i : -1)).filter((i) => i >= 0);
    assert.ok(at.length, `${from} imports ${name}`);
    for (const i of at) {
      const guarded = behind.test(lines[i]) || (i > 0 && behind.test(lines[i - 1])) || (i > 1 && behind.test(lines[i - 2]));
      assert.ok(guarded, `${from}:${i + 1} imports ${name} outside its condition: ${lines[i].trim()}`);
    }
  }
  // The settings' loader runs on the panel's own events or through lazy(), never at start-up.
  const picker = readFileSync(join(ROOT, 'src/components/ThemePicker.jsx'), 'utf8');
  const calls = [...picker.matchAll(/.*\bloadMotionSettings\b.*/g)].map((m) => m[0].trim());
  for (const line of calls) {
    assert.match(line, /^(const loadMotionSettings = |const MotionSettings = lazy\(loadMotionSettings\)|on(PointerEnter|Focus)=\{\(\) => \{ loadMotionSettings\(\))/, `ThemePicker calls the loader at: ${line}`);
  }
});

test('lazyOnlyProblems: a dynamic chunk outside the route passes, a static or merged one fails', () => {
  const manifest = {
    'index.html': { file: 'assets/main.js', isEntry: true, imports: ['_shared.js'], dynamicImports: ['src/lazy.js', 'src/also-static.js'] },
    '_shared.js': { file: 'assets/shared.js', imports: ['src/also-static.js'] },
    'src/lazy.js': { file: 'assets/lazy.js', src: 'src/lazy.js', isDynamicEntry: true },
    'src/also-static.js': { file: 'assets/also-static.js', src: 'src/also-static.js', isDynamicEntry: true },
    'src/plain.js': { file: 'assets/plain.js', src: 'src/plain.js' },
  };
  assert.deepEqual(lazyOnlyProblems(manifest, ['index.html'], ['src/lazy.js']), []);
  assert.match(lazyOnlyProblems(manifest, ['index.html'], ['src/also-static.js'])[0], /statically reachable/);
  assert.match(lazyOnlyProblems(manifest, ['index.html'], ['src/gone.js'])[0], /no chunk of its own/);
  assert.match(lazyOnlyProblems(manifest, ['index.html'], ['src/plain.js'])[0], /not loaded with import/);
});
