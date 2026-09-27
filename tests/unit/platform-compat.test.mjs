// platform-compat.test.mjs — the ios >= 14 floor holds for browser APIs
//
// Array/String .at() and Object.hasOwn arrived in Safari 15.4 and
// AbortSignal.timeout in Safari 16. HomeView calls .at(-1) on every render
// and exam results, groups and study history time their requests with
// AbortSignal.timeout, so on an iPhone 7 or an older iPad the home page threw
// and saves failed silently. src/lib/platform-compat.js supplies them; this
// checks it loads first in every entry, behaves like the standard, leaves a
// native method alone, and that src/ calls no newer API it does not cover.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'src');
const COMPAT = fs.readFileSync(path.join(SRC, 'lib', 'platform-compat.js'), 'utf8');

function firstImport(file) {
  const source = fs.readFileSync(path.join(SRC, file), 'utf8');
  return /^\s*import\s+(?:[^'"]*from\s+)?['"]([^'"]+)['"]/m.exec(source)?.[1];
}

test('every app entry loads the compat shims before anything else', () => {
  for (const entry of ['main.jsx', 'atlas-main.jsx']) {
    assert.equal(firstImport(entry), './lib/platform-compat.js', entry);
  }
});

function oldWebKit() {
  const context = vm.createContext({ AbortController, DOMException, setTimeout, AbortSignal: function AbortSignal() {} });
  vm.runInContext('delete Array.prototype.at; delete String.prototype.at; delete Object.hasOwn;', context);
  vm.runInContext(COMPAT, context);
  return context;
}

test('on a platform without them, the shims behave like the standard', async () => {
  const ctx = oldWebKit();
  const run = (code) => vm.runInContext(code, ctx);
  assert.equal(run('[1, 2, 3].at(-1)'), 3);
  assert.equal(run('[1, 2, 3].at(0)'), 1);
  assert.equal(run('[].at(-1)'), undefined);
  assert.equal(run('[1, 2, 3].at(5)'), undefined);
  assert.equal(run("'abc'.at(-1)"), 'c');
  assert.equal(run("'2569-1'.split('-').at(-1)"), '1');
  assert.equal(run("Object.keys([]).includes('at') || Object.keys(Array.prototype).includes('at')"), false, 'not enumerable');
  assert.equal(run("Object.hasOwn({ a: 1 }, 'a')"), true);
  assert.equal(run("Object.hasOwn(Object.create({ a: 1 }), 'a')"), false);
  assert.throws(() => run('Object.hasOwn(null, "a")'), /null/);
  const signal = run('AbortSignal.timeout(20)');
  assert.equal(signal.aborted, false);
  await new Promise((resolve) => setTimeout(resolve, 80));
  assert.equal(signal.aborted, true);
  assert.equal(signal.reason?.name, 'TimeoutError');
});

test('a platform that has them keeps its own methods', () => {
  const context = vm.createContext({ AbortController, DOMException, setTimeout, AbortSignal });
  const before = vm.runInContext('[Array.prototype.at, String.prototype.at, Object.hasOwn]', context);
  const timeout = AbortSignal.timeout;
  vm.runInContext(COMPAT, context);
  const after = vm.runInContext('[Array.prototype.at, String.prototype.at, Object.hasOwn]', context);
  after.forEach((fn, index) => assert.equal(fn, before[index]));
  assert.equal(AbortSignal.timeout, timeout);
});

// APIs newer than the floor that the compat file does not cover. Add a shim
// there before using one of these in src/.
const TOO_NEW = [
  ['structuredClone', /\bstructuredClone\s*\(/],
  ['findLast / findLastIndex', /\.findLast(?:Index)?\s*\(/],
  ['toSorted / toReversed / toSpliced', /\.to(?:Sorted|Reversed|Spliced)\s*\(/],
  ['AbortSignal.any', /\bAbortSignal\.any\s*\(/],
  ['Promise.withResolvers', /\bPromise\.withResolvers\b/],
  ['Array.fromAsync', /\bArray\.fromAsync\b/],
  ['Object.groupBy / Map.groupBy', /\b(?:Object|Map)\.groupBy\s*\(/],
];

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(?:js|jsx|mjs)$/.test(entry.name) ? [full] : [];
  });
}

// A line that tests for the API before calling it (`Map.groupBy ? Map.groupBy(…) : …`,
// `typeof x.fn === 'function'`) carries its own fallback.
const GUARDED = /\?\s*[\w$.]+\s*\(|\btypeof\s/;

test('src/ calls no browser API newer than the floor without a shim or a guard', () => {
  const hits = [];
  for (const file of sourceFiles(SRC)) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, index) => {
      for (const [name, pattern] of TOO_NEW) {
        if (pattern.test(line) && !GUARDED.test(line)) hits.push(`${path.relative(ROOT, file)}:${index + 1}: ${name}`);
      }
    });
  }
  assert.deepEqual(hits, []);
});
