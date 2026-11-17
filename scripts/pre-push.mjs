#!/usr/bin/env node
// The pre-push hook (.githooks/pre-push, installed by `npm ci` through the prepare script): runs
// `npm run gate:push` before a branch leaves this machine, so a push fails here in minutes instead
// of in CI a round later.
//
// It checks what is pushed: the tree of every pushed commit must be the checked-out one, and no tracked
// file may differ from it (the gate tests the working tree). A tree that already passed the whole gate
// here is not run again. Deleting a branch or pushing a tag runs nothing.
//
// One-off bypass, said in the push output and logged in the git dir (vetmock-gate/bypass.log):
//   VMX_SKIP_GATE=1 git push
// (`git push --no-verify` also skips it, silently; prefer the variable, so the log shows it.)
import fs from 'node:fs';
import path from 'node:path';
import { dirtyTracked, gateRecordPath, hookIsFull, passedBefore, runPushGate, treeOf } from './push-gate.mjs';

const ZERO = /^0+$/;
const cwd = process.cwd();
const log = (s = '') => process.stderr.write(`${s}\n`);

async function main() {
  const lines = fs.readFileSync(0, 'utf8').split(/\r?\n/).filter(Boolean);
  const pushed = lines.map((l) => l.split(/\s+/)).filter(([localRef, localSha]) => localSha && !ZERO.test(localSha) && !localRef.startsWith('refs/tags/'));
  if (!pushed.length || process.env.CI) return 0;

  if (process.env.VMX_SKIP_GATE === '1') {
    const dir = gateRecordPath(cwd);
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, 'bypass.log'), `${new Date().toISOString()} ${pushed.map((p) => `${p[2]}@${p[1].slice(0, 10)}`).join(' ')}\n`);
    log('push gate: SKIPPED (VMX_SKIP_GATE=1). CI will be the first to run it; logged in the git dir, vetmock-gate/bypass.log.');
    return 0;
  }
  if (!fs.existsSync(path.join(cwd, 'node_modules', '.bin'))) {
    log('push gate: this checkout has no node_modules. Run `npm ci` here first, or push once with VMX_SKIP_GATE=1 git push.');
    return 1;
  }
  const head = treeOf(cwd);
  const other = pushed.filter(([, sha]) => treeOf(cwd, sha) !== head);
  if (other.length) {
    log(`push gate: you are pushing ${other.map((p) => `${p[0]} (${p[1].slice(0, 10)})`).join(', ')}, which is not the checked-out tree.`);
    log('  The gate tests the working tree. Check that branch out and push from it, or VMX_SKIP_GATE=1 git push.');
    return 1;
  }
  const dirty = dirtyTracked(cwd);
  if (dirty.length) {
    log('push gate: tracked files differ from the commit you are pushing, so a green gate would prove the wrong tree:');
    for (const l of dirty.slice(0, 10)) log(`  ${l}`);
    log('  Commit or stash them, then push again (or VMX_SKIP_GATE=1 git push).');
    return 1;
  }
  if (passedBefore(cwd, head)) {
    log(`push gate: already green for this tree (${head.slice(0, 10)}), not run again.`);
    return 0;
  }
  if (hookIsFull()) log('push gate: VMX_GATE=full: lints and unit before the push; with a changed spec file also the build, budgets, contrast and those specs.');
  else log('push gate: runs the data lints only (about a minute); CI\'s first job runs the unit suite. The whole gate here: npm run gate:push, or VMX_GATE=full git push.');
  log('  One-off bypass: VMX_SKIP_GATE=1 git push');
  return runPushGate({ cwd, argv: ['--hook'], log });
}

main().then((code) => { process.exitCode = code; }, (error) => {
  log(`push gate: could not run: ${error.stack || error.message}`);
  log('  One-off bypass: VMX_SKIP_GATE=1 git push');
  process.exitCode = 1;
});
