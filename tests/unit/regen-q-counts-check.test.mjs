// The count tables behind Home, the topic list, the lecturer cards and the
// wrap-up page are generated. lint:curriculum and q-counts.test.mjs recount
// only some of them, so a push that moved questions between papers or kinds
// without changing a total could print stale numbers with the gate green.
// `regen-q-counts.mjs --check` rebuilds both modules in memory and compares
// every export with the checked-in copy.
//
// The generator reads its inputs relative to its own location, so each case
// runs it inside a scratch copy of src/ and can make a table deliberately wrong
// without touching the checked-in one.
import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const COUNTS = 'src/data/q-counts.js';
const KINDS = 'src/data/q-kind-counts.generated.js';

function withScratchRepo(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-q-counts-'));
  try {
    fs.cpSync(path.join(repo, 'src'), path.join(dir, 'src'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'scripts'));
    fs.copyFileSync(
      path.join(repo, 'scripts/regen-q-counts.mjs'),
      path.join(dir, 'scripts/regen-q-counts.mjs'),
    );
    fs.writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}\n');
    return fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

const regen = (dir, ...args) => spawnSync(
  process.execPath,
  ['scripts/regen-q-counts.mjs', ...args],
  { cwd: dir, encoding: 'utf8' },
);

const snapshot = (dir) => [COUNTS, KINDS].map((rel) => {
  const file = path.join(dir, rel);
  return {
    rel,
    sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
    mtimeMs: fs.statSync(file).mtimeMs,
  };
});

// Adds one to the first count inside the named export, e.g. `'swine': 12,`.
function bumpInside(text, exportName) {
  const start = text.indexOf(`export const ${exportName} `);
  assert.ok(start >= 0, `${exportName} must exist`);
  const count = /['"][^'"\n]+['"]: (\d+)/g;
  count.lastIndex = start;
  const m = count.exec(text);
  assert.ok(m, `${exportName} must hold a count`);
  const numberAt = m.index + m[0].length - m[1].length;
  return text.slice(0, numberAt) + String(Number(m[1]) + 1) + text.slice(numberAt + m[1].length);
}

test('--check agrees with a fresh regen through CRLF and another build time, and writes nothing', () => {
  withScratchRepo((dir) => {
    const built = regen(dir);
    assert.equal(built.status, 0, built.stderr);

    // What a Windows checkout with core.autocrlf holds, built at another time.
    for (const rel of [COUNTS, KINDS]) {
      const file = path.join(dir, rel);
      const text = fs.readFileSync(file, 'utf8')
        .replace(/^\/\/ Built: .*$/m, '// Built: 2020-01-01T00:00:00.000Z')
        .replace(/\n/g, '\r\n');
      fs.writeFileSync(file, text, 'utf8');
    }
    const before = snapshot(dir);

    const check = regen(dir, '--check');
    assert.equal(check.status, 0, check.stdout + check.stderr);
    assert.deepEqual(snapshot(dir), before, '--check must not write either table');
  });
});

test('--check fails on one wrong number in a table no other check recounts, names the export and repairs nothing', () => {
  withScratchRepo((dir) => {
    const built = regen(dir);
    assert.equal(built.status, 0, built.stderr);

    const kindsFile = path.join(dir, KINDS);
    fs.writeFileSync(kindsFile, bumpInside(
      fs.readFileSync(kindsFile, 'utf8'),
      'Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE',
    ), 'utf8');
    const countsFile = path.join(dir, COUNTS);
    fs.writeFileSync(countsFile, bumpInside(
      fs.readFileSync(countsFile, 'utf8'),
      'Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE',
    ), 'utf8');
    const before = snapshot(dir);

    const check = regen(dir, '--check');
    assert.equal(check.status, 1, check.stdout + check.stderr);
    assert.match(check.stderr, /q-kind-counts\.generated\.js[^\n]*\bQ_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE\b/);
    assert.match(check.stderr, /q-counts\.js[^\n]*\bQ_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE\b/);
    assert.match(check.stderr, /npm run regen:q-counts/);
    assert.deepEqual(snapshot(dir), before, '--check must leave the stale tables for a human to regenerate');
  });
});

test('lint:all runs the q-counts check', () => {
  const { scripts } = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));
  assert.equal(scripts['lint:q-counts'], 'node scripts/regen-q-counts.mjs --check');
  assert.ok(
    scripts['lint:all'].split(' && ').includes('npm run lint:q-counts'),
    'lint:all must include npm run lint:q-counts',
  );
});
