// lint:motion counts the motion the family rules out, per file, against a budget that only falls.
//
// The parser is checked on fixtures whose comments say what each line counts
// (tests/fixtures/motion-lint/src). The ratchet is checked both as functions and end to end:
// the real script, copied into a throwaway tree, must fail when a count rises and when the
// budget itself rises above main's, and must pass (saying how to record it) when a count falls.
import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countMotion, compareBudget, lowerBudget, parseCss, transitionProps } from '../../scripts/lib/motion-lint.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FIX = path.join(repo, 'tests/fixtures/motion-lint/src');
const read = (f) => fs.readFileSync(path.join(FIX, f), 'utf8');

test('the parser counts each kind on the fixtures', () => {
  const counts = countMotion({ css: { 'sample.css': read('sample.css') }, scripts: { 'Widget.jsx': read('Widget.jsx') } });
  assert.deepEqual(counts['sample.css'], {
    'layout-transition': 3, 'easing-literal': 6, 'paint-keyframes': 2, 'no-reduced-rule': 1, 'infinite-loop': 1, 'blanket-reduced': 1,
  });
  assert.deepEqual(counts['Widget.jsx'], { 'layout-transition': 1, 'easing-literal': 3, 'no-reduced-rule': 1, 'infinite-loop': 1 });
});

test('the parser keeps at-rule context, line numbers, and skips comments and strings', () => {
  const { rules, keyframes } = parseCss('/* a { b: c } */\n.a { color: red; }\n@media (x) {\n  .b { transition: opacity 1s; }\n}\n@keyframes k { to { opacity: 0 } }\n.c::after { content: "}"; top: 0 }');
  assert.deepEqual(rules.map((r) => [r.selector, r.context, r.line]), [['.a', [], 2], ['.b', ['@media (x)'], 4], ['.c::after', [], 7]]);
  assert.equal(rules[1].decls[0].line, 4);
  assert.deepEqual(rules[2].decls.map((d) => d.prop), ['content', 'top']);
  assert.deepEqual(keyframes.map((k) => [k.name, k.line]), [['k', 6]]);
});

test('transition properties: a bare duration means all', () => {
  assert.deepEqual(transitionProps('.2s'), ['all']);
  assert.deepEqual(transitionProps('transform 1s, opacity .2s linear'), ['transform', 'opacity']);
  assert.deepEqual(transitionProps('var(--x)'), ['all']);
});

test('a reduced-motion rule on * covers nothing', () => {
  const css = '.a { animation: k 1s ease; } @keyframes k { to { opacity: 0 } } @media (prefers-reduced-motion: reduce) { * { animation-duration: 0s !important; } }';
  assert.equal(countMotion({ css: { 'x.css': css } })['x.css']['no-reduced-rule'], 1);
  const own = `${css} @media (prefers-reduced-motion: reduce) { .a { animation: none; } }`;
  assert.equal(countMotion({ css: { 'x.css': own } })['x.css']['no-reduced-rule'], undefined);
});

test('the budget: over fails, under is reported, and it never rises above main', () => {
  const budget = { 'a.css': { 'layout-transition': 2 } };
  assert.deepEqual(compareBudget({ 'a.css': { 'layout-transition': 2 } }, budget), { over: [], under: [], rose: [] });
  assert.equal(compareBudget({ 'a.css': { 'layout-transition': 3 } }, budget).over.length, 1);
  assert.equal(compareBudget({ 'a.css': { 'layout-transition': 1 } }, budget).under.length, 1);
  assert.equal(compareBudget({ 'new.css': { 'infinite-loop': 1 } }, budget).over.length, 1, 'a file with no row has budget 0');
  const raised = { 'a.css': { 'layout-transition': 3 } };
  assert.deepEqual(compareBudget({ 'a.css': { 'layout-transition': 3 } }, raised, budget).rose, ["a.css layout-transition: 3 > main's 2"]);
  const added = { ...budget, 'b.css': { 'easing-literal': 1 } };
  assert.equal(compareBudget({}, added, budget).rose.length, 1, 'a new row is a rise from 0');
});

test('--write lowers and drops zeros, and never raises or adds', () => {
  const budget = { 'a.css': { 'layout-transition': 2, 'easing-literal': 5 }, 'b.css': { 'infinite-loop': 1 } };
  const counts = { 'a.css': { 'layout-transition': 4, 'easing-literal': 3 }, 'c.css': { 'infinite-loop': 9 } };
  assert.deepEqual(lowerBudget(counts, budget), { 'a.css': { 'layout-transition': 2, 'easing-literal': 3 } });
});

// End to end: the real script in a throwaway git repository with an origin/main.
function tree(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-motion-'));
  const put = (rel, text) => { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.writeFileSync(path.join(dir, rel), text); };
  put('scripts/lint-motion.mjs', fs.readFileSync(path.join(repo, 'scripts/lint-motion.mjs'), 'utf8'));
  put('scripts/lib/motion-lint.mjs', fs.readFileSync(path.join(repo, 'scripts/lib/motion-lint.mjs'), 'utf8'));
  for (const [rel, text] of Object.entries(files)) put(rel, text);
  return { dir, put };
}
const run = (dir, ...args) => spawnSync(process.execPath, ['scripts/lint-motion.mjs', ...args], { cwd: dir, encoding: 'utf8' });
const budgetFile = (files) => `${JSON.stringify({ files }, null, 2)}\n`;
const git = (dir, ...args) => execFileSync('git', args, { cwd: dir, stdio: 'ignore', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });

test('the script fails when a count rises and passes at the budget', () => {
  const { dir, put } = tree({ 'src/a.css': '.a { transition: width 1s; }', 'docs/motion-budget.json': budgetFile({ 'src/a.css': { 'layout-transition': 1, 'easing-literal': 1 } }) });
  assert.equal(run(dir).status, 0, run(dir).stderr);
  put('src/a.css', '.a { transition: width 1s; } .b { transition: height 1s; }');
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /src\/a\.css layout-transition: 2 > budget 1/);
});

test('the script passes when a count falls and says how to record it; --write never raises', () => {
  const { dir, put } = tree({ 'src/a.css': '.a { transition: opacity 1s var(--vm-ease-tap); }', 'docs/motion-budget.json': budgetFile({ 'src/a.css': { 'layout-transition': 1, 'easing-literal': 1 } }) });
  const r = run(dir);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /below the budget; record them with `npm run lint:motion -- --write`/);
  assert.equal(run(dir, '--write').status, 0);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'docs/motion-budget.json'), 'utf8')).files, {});
  assert.equal(run(dir).status, 0);
  put('src/a.css', '.a { transition: all 1s; }');
  assert.equal(run(dir, '--write').status, 1, '--write cannot record a rise');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'docs/motion-budget.json'), 'utf8')).files, {});
});

test("the script fails when the budget file rises above main's", () => {
  const { dir, put } = tree({ 'src/a.css': '.a { transition: width 1s; }', 'docs/motion-budget.json': budgetFile({ 'src/a.css': { 'layout-transition': 1, 'easing-literal': 1 } }) });
  git(dir, 'init', '-q', '-b', 'main');
  git(dir, 'add', '.');
  git(dir, 'commit', '-q', '-m', 'main');
  git(dir, 'update-ref', 'refs/remotes/origin/main', 'HEAD');
  // a branch adds motion and raises its own budget to match
  put('src/a.css', '.a { transition: width 1s; } .b { transition: height 1s; }');
  put('docs/motion-budget.json', budgetFile({ 'src/a.css': { 'layout-transition': 2, 'easing-literal': 2 } }));
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /rose above main's/);
  assert.match(r.stderr, /layout-transition: 2 > main's 1/);
});
