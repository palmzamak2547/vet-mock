#!/usr/bin/env node
// The prepare script (runs after `npm ci` and `npm install`): points git at the tracked hooks in
// .githooks/, so the push gate (scripts/pre-push.mjs) runs before every push from this repository.
// No dependency: one `git config core.hooksPath .githooks`. Worktrees share the setting, and a
// worktree whose branch has no .githooks/ simply has no hook.
//
// It changes nothing on CI, outside a git checkout, or when core.hooksPath already points somewhere
// else (someone's own hooks win; it says so).
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

try {
  if (process.env.CI) process.exit(0);
  try { git('rev-parse', '--git-dir'); } catch { process.exit(0); }
  let current = '';
  try { current = git('config', '--get', 'core.hooksPath'); } catch { /* unset */ }
  if (current && current !== '.githooks') {
    console.log(`hooks: core.hooksPath is ${current}, left as it is; the push gate hook is .githooks/pre-push`);
  } else if (!current) {
    git('config', 'core.hooksPath', '.githooks');
    console.log('hooks: the push gate runs before each push (.githooks/pre-push; one-off bypass: VMX_SKIP_GATE=1 git push)');
  }
} catch (error) {
  // Installing a hook must never fail an install.
  console.log(`hooks: not installed (${error.message})`);
}
