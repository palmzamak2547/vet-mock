// One Node version, said in one place (docs/HANDOVER.md "เวอร์ชัน Node"):
// .node-version is what CI and the machines run, every workflow's setup-node
// asks for the same major, and `engines` is one floor for the four apps that
// declare it, below or at that version.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const major = Number(fs.readFileSync('.node-version', 'utf8').trim().split('.')[0]);

test('.node-version names a major version', () => {
  assert.ok(Number.isInteger(major) && major >= 20, `got ${major}`);
});

test('every setup-node step in CI runs the .node-version major', () => {
  const dir = '.github/workflows';
  const found = [];
  for (const f of fs.readdirSync(dir).filter((n) => /\.ya?ml$/.test(n))) {
    for (const m of fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/node-version:\s*['"]?([\d.x]+)['"]?/g)) {
      found.push(`${f}: ${m[1]}`);
      assert.equal(Number(m[1].split('.')[0]), major, `${f} asks for Node ${m[1]}, .node-version says ${major}`);
    }
  }
  assert.ok(found.length >= 1, 'no setup-node step found');
});

test('the four engines floors are equal and the run version satisfies them', () => {
  const floors = ['package.json', 'ai/package.json', 'research/package.json', 'vca/package.json']
    .map((f) => JSON.parse(fs.readFileSync(f, 'utf8')).engines?.node);
  assert.equal(new Set(floors).size, 1, `engines differ: ${floors.join(', ')}`);
  const floor = /^>=\s*(\d+)/.exec(floors[0]);
  assert.ok(floor, `engines is ${floors[0]}, expected a >=N floor`);
  assert.ok(major >= Number(floor[1]), `Node ${major} is below the floor ${floors[0]}`);
});
