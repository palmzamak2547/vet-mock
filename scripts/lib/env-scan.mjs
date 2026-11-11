// Every environment variable name the code reads, with the files that read it.
// Used by scripts/env-contract.mjs. Never opens an .env file: it reads tracked
// source only.
//
// Read: process.env.X, process.env['X'], import.meta.env.X, Deno.env.get('X'),
// os.environ['X'] / os.environ.get('X') / os.getenv('X') (Python), a
// destructure of process.env or env, `env.X` in a file that also touches
// process.env or Deno.env (handlers take `env = process.env`), and the
// `secret('X')` reader of scripts/tts-clips.mjs. A write (`process.env.X = …`,
// `delete process.env.X`) is not a read.
// Not scanned: unit tests (they set variables for the code under test), docs,
// static files, workflow files (they set variables, they do not read them).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SKIP = /^(docs|wiki|public|vetmock_launch_kit|mobile\/android|\.github)\/|(^|\/)tests\/unit\/|(^|\/)node_modules\//;
const NAME = '([A-Z][A-Z0-9_]+)';
const PATTERNS = [
  new RegExp(`process\\.env\\??\\.${NAME}\\b`, 'g'),
  new RegExp(`process\\.env\\[\\s*['"]${NAME}['"]\\s*\\]`, 'g'),
  new RegExp(`import\\.meta\\.env\\??\\.${NAME}\\b`, 'g'),
  new RegExp(`Deno\\.env\\.get\\(\\s*['"]${NAME}['"]`, 'g'),
  new RegExp(`os\\.environ(?:\\.get)?[\\[(]\\s*['"]${NAME}['"]`, 'g'),
  new RegExp(`os\\.getenv\\(\\s*['"]${NAME}['"]`, 'g'),
  new RegExp(`\\bsecret\\(\\s*['"]${NAME}['"]`, 'g'),
];
// `env` as its own identifier, not the tail of process.env (matched above).
const VIA_ENV = [new RegExp(`(?<![.\\w$])env\\??\\.${NAME}\\b`, 'g'), new RegExp(`(?<![.\\w$])env\\[\\s*['"]${NAME}['"]\\s*\\]`, 'g')];
const DESTRUCTURE = /(?:const|let|var)\s*\{([^}]+)\}\s*=\s*(?:process\.env|env)\b/g;

function isWrite(src, end) {
  return /^\s*(?:=(?!=)|\+=|\|\|=|\?\?=)/.test(src.slice(end, end + 6));
}

/** Map name -> sorted list of files, for one source text. */
export function namesIn(src) {
  const out = new Set();
  const code = src.replace(/^\s*(?:\/\/|#).*$/gm, '');
  const env = /process\.env|Deno\.env/.test(code);
  for (const re of [...PATTERNS, ...(env ? VIA_ENV : [])]) {
    for (const m of code.matchAll(re)) {
      const before = code.slice(Math.max(0, m.index - 7), m.index);
      if (/delete\s+$/.test(before)) continue;
      if (isWrite(code, m.index + m[0].length)) continue;
      out.add(m[1]);
    }
  }
  for (const m of code.matchAll(DESTRUCTURE)) {
    for (const part of m[1].split(',')) {
      const key = part.trim().split(/[:=\s]/)[0];
      if (/^[A-Z][A-Z0-9_]+$/.test(key)) out.add(key);
    }
  }
  return out;
}

export function scanEnv(root) {
  const files = execFileSync('git', ['ls-files', '*.js', '*.jsx', '*.mjs', '*.cjs', '*.ts', '*.py'], { cwd: root, encoding: 'utf8' })
    .split('\n').filter((f) => f && !SKIP.test(f));
  const found = new Map();
  for (const file of files) {
    for (const name of namesIn(fs.readFileSync(path.join(root, file), 'utf8'))) {
      if (!found.has(name)) found.set(name, []);
      found.get(name).push(file);
    }
  }
  return new Map([...found].sort(([a], [b]) => a.localeCompare(b)));
}
