// One Node version, said in one place (docs/HANDOVER.md "เวอร์ชัน Node"):
// .node-version is what CI and the machines run, every workflow's setup-node
// asks for the same major, and `engines` of the four apps that
// declare it pins that same major, so the host runs what the checks ran on.
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

test('the four engines pins are equal and name the .node-version major', () => {
  const pins = ['package.json', 'ai/package.json', 'research/package.json', 'vca/package.json']
    .map((f) => JSON.parse(fs.readFileSync(f, 'utf8')).engines?.node);
  assert.equal(new Set(pins).size, 1, `engines differ: ${pins.join(', ')}`);
  // A floor such as >=20 lets the host pick its newest major: production ran Node 26 for a week
  // while CI tested 24. A pin makes the host run the version the checks ran on.
  const pin = /^(\d+)\.x$/.exec(pins[0]);
  assert.ok(pin, `engines is ${pins[0]}, expected a pin such as ${major}.x`);
  assert.equal(Number(pin[1]), major, `engines pins Node ${pin[1]}, .node-version says ${major}`);
});
