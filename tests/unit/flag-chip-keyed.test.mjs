// Every caution chip is keyed by its question (review of pull request 247).
// FlagChip keeps whether it is open while it renders nothing. On the spaced-repetition
// card it had no key, so a chip opened on one disputed card opened already expanded on
// the next. Each place that draws it keys it by the question it belongs to.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const files = ['src/components', 'src/views'].flatMap((d) => readdirSync(path.join(ROOT, d)).filter((f) => f.endsWith('.jsx')).map((f) => `${d}/${f}`));

test('every <FlagChip> carries a key naming its question', () => {
  const found = [];
  for (const f of files) {
    const src = readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/<FlagChip\b[^>]*>/g)) {
      found.push(f);
      assert.match(m[0], /key=\{`flag:\$\{(compoundId|currentQ\.subject\}:\$\{currentQ\.id)\}`\}/, `${f}: ${m[0]}`);
    }
  }
  assert.ok(found.includes('src/views/SRSessionView.jsx'), 'the spaced-repetition card draws the chip');
});
