// lint:hex-budget is a one-way ratchet on hardcoded #hex colours (B58).
//
// A file with no row in docs/hex-budget-baseline.json used to be skipped,
// so a brand-new component could carry any number of hexes and the lint
// still printed "all within budget". A file with no row now has budget 0:
// it is recorded with --write, exempted with a reason, or its colours move
// to tokens. HTML entities such as &#124; are characters, not colours.
//
// Each case copies the real script into a throwaway tree, so the script's
// own ROOT (its parent folder) is the fixture.
import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = path.join(repo, 'scripts', 'lint-hex-budget.mjs');

function fixture({ files, budget = {}, exempt = {} }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-hex-'));
  const put = (rel, text) => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  };
  fs.mkdirSync(path.join(dir, 'scripts'), { recursive: true });
  fs.copyFileSync(SCRIPT, path.join(dir, 'scripts', 'lint-hex-budget.mjs'));
  for (const d of ['views', 'components', 'lib', 'hooks']) fs.mkdirSync(path.join(dir, 'src', d), { recursive: true });
  put('src/App.jsx', 'export default 1;\n');
  for (const [rel, text] of Object.entries(files)) put(`src/${rel}`, text);
  put('docs/hex-budget-baseline.json', JSON.stringify({ budget, exempt }, null, 2));
  const run = (...args) => spawnSync(process.execPath, [path.join(dir, 'scripts', 'lint-hex-budget.mjs'), ...args], { encoding: 'utf8' });
  const baseline = () => JSON.parse(fs.readFileSync(path.join(dir, 'docs/hex-budget-baseline.json'), 'utf8'));
  return { run, baseline, done: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

const hexes = (n) => Array.from({ length: n }, (_, i) => `const c${i} = '#${String(100000 + i).slice(-6)}';`).join('\n') + '\n';

test('a file with no baseline row has budget 0', () => {
  const f = fixture({
    files: { 'views/Old.jsx': hexes(1), 'components/NewThing.jsx': hexes(20) },
    budget: { 'views/Old.jsx': 1 },
  });
  try {
    const r = f.run();
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stderr, /components\/NewThing\.jsx: 20 > budget 0/);
    assert.doesNotMatch(r.stdout, /all within budget/);
  } finally { f.done(); }
});

test('recording, exempting or clearing the new file each make it pass', () => {
  for (const setup of [
    { budget: { 'views/Old.jsx': 1, 'components/NewThing.jsx': 2 } },
    { budget: { 'views/Old.jsx': 1 }, exempt: { 'components/NewThing.jsx': 'canvas pigment' } },
  ]) {
    const f = fixture({ files: { 'views/Old.jsx': hexes(1), 'components/NewThing.jsx': hexes(2) }, ...setup });
    try {
      const r = f.run();
      assert.equal(r.status, 0, r.stdout + r.stderr);
    } finally { f.done(); }
  }
  const f = fixture({ files: { 'views/Old.jsx': hexes(1), 'components/NewThing.jsx': hexes(2) }, budget: { 'views/Old.jsx': 1 } });
  try {
    assert.equal(f.run('--write').status, 0);
    assert.equal(f.baseline().budget['components/NewThing.jsx'], 2, '--write still records a new file');
    assert.equal(f.run().status, 0);
  } finally { f.done(); }
});

test('an HTML character entity is not a colour', () => {
  const f = fixture({ files: { 'views/Bench.jsx': 'export const x = <p>a &nbsp;&#124;&nbsp; b &#039; c</p>;\n' } });
  try {
    const r = f.run();
    assert.equal(r.status, 0, r.stdout + r.stderr);
  } finally { f.done(); }
});

test('the real tree passes with no unrecorded file', () => {
  const r = spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8', cwd: repo });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
