// No source file carries a raw control character (review round 2: a shell here-document folded the regex's
// word boundary into a backspace byte in report/build.js, so "Cronbach" never matched the proper-name rule and
// the English Results wrote "The cronbach's alpha"). A regex escape must stay two characters. OWNER: integrator.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const DIRS = ['src', 'tests/unit', 'tests/e2e', 'scripts'];
const EXT = /\.(js|jsx|mjs|css)$/;
// every C0 control except tab, line feed and carriage return
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (name !== 'node_modules') walk(p, out); } else if (EXT.test(name)) out.push(p);
  }
  return out;
}

test('source files carry no raw control characters', () => {
  const bad = [];
  for (const d of DIRS) for (const f of walk(join(ROOT, d), [])) {
    const s = readFileSync(f, 'utf8');
    const i = s.search(CONTROL);
    if (i >= 0) bad.push(`${f.slice(ROOT.length)} at ${i}: U+${s.charCodeAt(i).toString(16).padStart(4, '0')}`);
  }
  assert.deepEqual(bad, []);
});
