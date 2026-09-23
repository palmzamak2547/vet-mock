#!/usr/bin/env node
// ============================================================
// lint-untracked.mjs — no source file may exist only on this machine
// ============================================================
// Usage: node scripts/lint-untracked.mjs        (npm run lint:untracked)
//
// A gate proves the working tree, while CI and Vercel build a fresh checkout.
// On 23 Sep, 22 src/lib/vetwiki/search-index-*.generated.js modules existed
// only on the integration machine: its gate passed 1503/0 and 707/0, and a
// fresh checkout could not resolve search-index-loaders.generated.js.
//
// So: any file under src/, api/ or public/ that git lists as untracked fails
// the gate. Ignored files never show up in `git status`, and dist/,
// test-results/ and playwright-report/ are skipped by name as well. It runs
// first in lint:data, before any build, and takes one `git status`.
// ============================================================

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SOURCE_ROOTS = ['src/', 'api/', 'public/'];
export const SKIPPED_ROOTS = ['dist/', 'test-results/', 'playwright-report/'];

/** Untracked files under src/, api/ or public/, relative to the repo root. */
export function untrackedSourceFiles(cwd = process.cwd()) {
  // -z: NUL-separated and never quoted, so a Thai file name stays itself.
  const out = execFileSync('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all'], {
    cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const entries = out.split('\0');
  const files = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry) continue;
    const status = entry.slice(0, 2);
    // A rename or copy carries its source path as the next entry.
    if (status[0] === 'R' || status[0] === 'C') i++;
    if (status !== '??') continue;
    const file = entry.slice(3);
    if (SKIPPED_ROOTS.some((root) => file.startsWith(root))) continue;
    if (SOURCE_ROOTS.some((root) => file.startsWith(root))) files.push(file);
  }
  return files.sort();
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  let files;
  try {
    files = untrackedSourceFiles();
  } catch (error) {
    console.error(`✗ lint:untracked could not list untracked files: ${String(error.stderr || error.message).trim()}`);
    process.exit(1);
  }
  if (files.length) {
    console.error(`✗ ${files.length} file(s) under src/, api/ or public/ are not tracked by git.`);
    console.error('  This machine builds with them; a fresh checkout (CI, Vercel) would not have them:');
    for (const file of files.slice(0, 50)) console.error(`    ${file}`);
    if (files.length > 50) console.error(`    … and ${files.length - 50} more`);
    console.error('  Commit them (git add), or add them to .gitignore if they must never ship.');
    process.exit(1);
  }
  console.log('✓ no untracked files under src/, api/ or public/');
}
