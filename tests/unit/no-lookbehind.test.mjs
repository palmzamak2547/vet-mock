// no-lookbehind.test.mjs — the declared support floor holds (B53)
//
// package.json declares `ios >= 14` and vite builds for es2020, which does
// not lower RegExp syntax. WebKit before Safari 16.4 cannot parse a
// lookbehind: a regex literal that uses one makes the whole module fail to
// parse, and a module-scope `new RegExp('(?<!…')` throws while it evaluates.
// source-label.js did the second at the top of the chunk that every exam,
// clip summary and wrap-up imports, so on an iPhone 7 those screens showed the
// error card and a reload could not help. Keep lookbehind out of src/.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'src');
const LOOKBEHIND = /\(\?<[=!]/;

// A file here is never loaded by the app. The test below proves it, so an
// exemption stops holding the day something in src/ starts importing it.
const NOT_SHIPPED = new Map([
  ['src/data/source-docs.js', 'read only by scripts/lint-source-docs.mjs and its test'],
]);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (/\.(m?js|jsx|ts|tsx)$/.test(ent.name)) out.push(full);
  }
  return out;
}

const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/');
const FILES = walk(SRC);

test('no source file under src/ uses a regex lookbehind', () => {
  const offenders = [];
  for (const file of FILES) {
    const r = rel(file);
    if (NOT_SHIPPED.has(r)) continue;
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      if (LOOKBEHIND.test(line)) offenders.push(`${r}:${i + 1}`);
    });
  }
  assert.deepEqual(offenders, [], 'lookbehind is Safari 16.4+; capture the preceding character instead');
});

test('every exempt file really is unreachable from src/', () => {
  for (const [exempt] of NOT_SHIPPED) {
    const base = path.basename(exempt).replace(/\.m?js$/, '');
    const importers = FILES
      .filter((f) => rel(f) !== exempt)
      .filter((f) => new RegExp(`from\\s+['"][^'"]*/${base}(\\.m?js)?['"]|import\\(\\s*['"][^'"]*/${base}(\\.m?js)?['"]`)
        .test(fs.readFileSync(f, 'utf8')))
      .map(rel);
    assert.deepEqual(importers, [], `${exempt} is exempt only while nothing in src/ imports it`);
  }
});

test('source-label loads on an engine that rejects lookbehind', async () => {
  const Real = globalThis.RegExp;
  function OldWebKitRegExp(pattern, flags) {
    const src = pattern instanceof Real ? pattern.source : String(pattern);
    if (LOOKBEHIND.test(src)) throw new SyntaxError('Invalid regular expression: invalid group specifier name');
    return new Real(pattern, flags);
  }
  OldWebKitRegExp.prototype = Real.prototype;
  globalThis.RegExp = OldWebKitRegExp;
  try {
    const mod = await import(`../../src/lib/source-label.js?oldwebkit=${Date.now()}`);
    assert.equal(mod.recordingMoments('WRttiWQ7D9s [26:48]').length, 1);
  } finally {
    globalThis.RegExp = Real;
  }
});

test('recordingMoments keeps the lookbehind rules it had', async () => {
  const { recordingMoments } = await import('../../src/lib/source-label.js');
  const secs = (s) => recordingMoments(s).map((m) => `${m.videoId}@${m.seconds}`);
  // An id glued to the previous citation's closing bracket still counts,
  // because "]" is not an id character (the case a captured boundary loses).
  assert.deepEqual(secs('7XyI0SjnuBA [1:00]WRttiWQ7D9s [2:00]'), ['7XyI0SjnuBA@60', 'WRttiWQ7D9s@120']);
  assert.deepEqual(secs('7XyI0SjnuBA[1:00]WRttiWQ7D9s[2:00]'), ['7XyI0SjnuBA@60', 'WRttiWQ7D9s@120']);
  // Start of text, after a space, after VET86, after punctuation.
  assert.deepEqual(secs('VET86 7XyI0SjnuBA [0:05]'), ['7XyI0SjnuBA@5']);
  assert.deepEqual(secs('(7XyI0SjnuBA [0:05])'), ['7XyI0SjnuBA@5']);
  // Never read out of a longer token, even when VET86 sits in the token.
  assert.deepEqual(secs('xx7XyI0SjnuBA [1:00]'), []);
  assert.deepEqual(secs('-7XyI0SjnuBA [1:00]'), []);
  assert.deepEqual(secs('xVET86 7XyI0SjnuBA [1:00]'), ['7XyI0SjnuBA@60']);
  // A rejected start does not hide a real citation later in the same text.
  assert.deepEqual(secs('_7XyI0SjnuBA [1:00] and 7XyI0SjnuBA [2:00]'), ['7XyI0SjnuBA@120']);
});
