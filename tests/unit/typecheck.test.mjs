// The JavaScript type check (npm run typecheck, scripts/typecheck.mjs) is a
// gate: it runs in lint:data, it fails on the mistakes it exists for, and a
// silenced check or an `any` needs its reason on the line.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { scripts } = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));
const check = (file) => spawnSync(process.execPath, ['scripts/typecheck.mjs', '--only', file], { cwd: repo, encoding: 'utf8' });

function seeded(body) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vmx-typecheck-'));
  const file = path.join(dir, 'seeded.js');
  fs.writeFileSync(file, `// @ts-check\n${body}\n`);
  return file;
}

test('typecheck runs in lint:data as its own step', () => {
  assert.equal(scripts.typecheck, 'node scripts/typecheck.mjs');
  assert.equal(scripts['lint:data'].split(' && ').filter((s) => s === 'npm run typecheck').length, 1);
});

test('every listed file exists and the list has no duplicates', () => {
  const list = JSON.parse(fs.readFileSync(path.join(repo, 'scripts/typecheck-files.json'), 'utf8'));
  assert.ok(list.length >= 14, `${list.length} files`);
  assert.equal(new Set(list).size, list.length);
  for (const f of list) assert.ok(fs.existsSync(path.join(repo, f)), f);
});

test('a .catch on a value that is not a promise, a string compared with a number and a missing property fail', () => {
  const r = check(seeded([
    // A thenable with no catch, like a PostgREST builder (5.192.1). Plain
    // object literals are open in JavaScript, so the shapes are declared.
    '/** @type {{ then: (ok: (v: number) => void) => void }} */',
    'const builder = { then(ok) { ok(1); } };',
    'builder.catch(() => {});',
    "export const late = '10' > 9;",
    '/** @type {{ name: string }} */',
    'const user = { name: "a" };',
    'export const n = user.nmae;',
  ].join('\n')));
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /TS2339: Property 'catch' does not exist/);
  assert.match(r.stdout, /TS2365/);
  assert.match(r.stdout, /TS2339: Property 'nmae' does not exist/);
});

test('a silenced check or an any without a reason on its line fails; with one it passes', () => {
  const bare = check(seeded('// @ts-expect-error\nexport const x = 1 + undefined.y;'));
  assert.equal(bare.status, 1);
  assert.match(bare.stdout, /needs a reason on its line/);
  const reasoned = check(seeded('/** @type {any} -- the payload is whatever the provider sent */\nexport const payload = JSON.parse("{}");'));
  assert.equal(reasoned.status, 0, reasoned.stdout);
  assert.match(reasoned.stdout, /0 silenced check\(s\) and 1 any\(s\)/);
});
