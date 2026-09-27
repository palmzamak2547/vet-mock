// Prepares the webR runner used by run-webr.mjs, OUTSIDE the repository [M1-DESIGN.md 13.2].
//
//   node research/scripts/r-parity/setup-webr.mjs [folder]
//
// folder defaults to $WEBR_RUNNER_DIR, else a sibling of the repository checkout named webr-runner
// (for the worktree C:\Users\palmz\Desktop\vmu\research-m1 that is C:\Users\palmz\Desktop\vmu\webr-runner).
// It installs webr@0.6.0 there (never into research/package.json) and applies one Windows fix:
// webR 0.6.0 loads R.js inside its worker with import(path.resolve(file)), and on Windows Node's ESM
// loader rejects a "c:\" path. The fix wraps that path with pathToFileURL; Linux and macOS are unchanged
// by it. Running this twice is harmless.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const WEBR_VERSION = '0.6.0';

export function defaultRunnerDir() {
  if (process.env.WEBR_RUNNER_DIR) return path.resolve(process.env.WEBR_RUNNER_DIR);
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
  return path.resolve(repoRoot, '..', 'webr-runner');
}

export function patchForWindows(dir) {
  const re = /import\(\(await import\("path"\)\)\.default\.resolve\(([a-z])\)\)/g;
  let changed = 0;
  for (const f of ['webr-worker.js', 'webr.mjs']) {
    const file = path.join(dir, 'node_modules', 'webr', 'dist', f);
    const src = readFileSync(file, 'utf8');
    const next = src.replace(re, (_, v) => { changed++; return `import((await import("url")).pathToFileURL((await import("path")).default.resolve(${v})).href)`; });
    if (next !== src) writeFileSync(file, next);
  }
  return changed;
}

export function installedVersion(dir) {
  const pkg = path.join(dir, 'node_modules', 'webr', 'package.json');
  return existsSync(pkg) ? JSON.parse(readFileSync(pkg, 'utf8')).version : null;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = path.resolve(process.argv[2] || defaultRunnerDir());
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
  if (!path.relative(repoRoot, dir).startsWith('..')) {
    console.error(`refusing to install inside the repository: ${dir}`);
    process.exit(2);
  }
  mkdirSync(dir, { recursive: true });
  if (!existsSync(path.join(dir, 'package.json'))) writeFileSync(path.join(dir, 'package.json'), '{ "name": "webr-runner", "private": true }\n');
  if (installedVersion(dir) !== WEBR_VERSION) {
    execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', `webr@${WEBR_VERSION}`, '--no-audit', '--no-fund'], { cwd: dir, stdio: 'inherit', shell: process.platform === 'win32' });
  }
  const n = patchForWindows(dir);
  console.log(`webR ${installedVersion(dir)} ready in ${dir}${n ? ` (Windows path fix applied to ${n} call${n > 1 ? 's' : ''})` : ''}`);
}
