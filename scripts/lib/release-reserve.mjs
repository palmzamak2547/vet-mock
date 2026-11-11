// Taking a release number, atomically, across every machine that can push to the repository.
//
// A number is held by a ref on the remote, refs/vmx-release/<version>, created with a lease that
// expects it to be absent (`--force-with-lease=<ref>:`, an empty expected value). The remote checks
// that lease under its own ref lock, so of any number of callers racing for one version exactly one
// push creates the ref and every other is refused; a refused caller moves to the next number. No
// service, no queue: the remote's ref update is the lock.
//
// The ref points at a commit of its own (the empty tree, one line naming the branch that took the
// number), so taking a number publishes nothing of the branch's work. Refs outside refs/heads and
// refs/tags start no workflow and appear in no branch list.
//
// When the remote cannot be reached the caller gets `reserved: false` and says so loudly: the number
// is then only as safe as the open-pull-request check, which is what release:new did before.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
export const RESERVE_PREFIX = 'refs/vmx-release/';
const VERSION = /^\d+\.\d+\.\d+$/;

const parse = (v) => v.split('.').map(Number);
export function compareVersions(a, b) {
  const x = parse(a);
  const y = parse(b);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

export function nextVersion(taken, bump) {
  const newest = [...taken].filter((v) => VERSION.test(v)).sort(compareVersions).at(-1) || '0.0.0';
  const [major, minor, patch] = parse(newest);
  return bump === 'patch' ? `${major}.${minor}.${patch + 1}` : `${major}.${minor + 1}.0`;
}

async function git(cwd, args, env = {}) {
  return exec('git', args, { cwd, encoding: 'utf8', env: { ...process.env, GIT_TERMINAL_PROMPT: '0', ...env }, timeout: 60_000 });
}

/** Versions already reserved on the remote, or null when the remote does not answer. */
export async function reservedVersions({ cwd, remote = 'origin' }) {
  try {
    const { stdout } = await git(cwd, ['ls-remote', remote, `${RESERVE_PREFIX}*`]);
    const out = new Set();
    for (const line of stdout.split('\n')) {
      const ref = line.split('\t')[1]?.trim();
      const v = ref?.startsWith(RESERVE_PREFIX) ? ref.slice(RESERVE_PREFIX.length) : null;
      if (v && VERSION.test(v)) out.add(v);
    }
    return out;
  } catch {
    return null;
  }
}

async function identity(cwd) {
  const read = async (key) => { try { return (await git(cwd, ['config', key])).stdout.trim(); } catch { return ''; } };
  const name = (await read('user.name')) || 'release-new';
  const email = (await read('user.email')) || 'release-new@localhost';
  return { GIT_AUTHOR_NAME: name, GIT_AUTHOR_EMAIL: email, GIT_COMMITTER_NAME: name, GIT_COMMITTER_EMAIL: email };
}

async function markerCommit(cwd, version, label) {
  const pending = exec('git', ['hash-object', '-t', 'tree', '-w', '--stdin'], { cwd, encoding: 'utf8', timeout: 60_000 });
  pending.child.stdin.end();
  const { stdout: tree } = await pending;
  const { stdout } = await git(cwd, ['commit-tree', tree.trim(), '-m', `Release ${version} reserved for ${label}`], await identity(cwd));
  return stdout.trim();
}

/** One attempt: 'reserved', 'taken' (another caller holds it) or 'unreachable'. */
export async function reserve({ cwd, remote = 'origin', version, label = 'a branch' }) {
  if (!VERSION.test(version)) throw new Error(`not a version: ${version}`);
  const ref = `${RESERVE_PREFIX}${version}`;
  let commit;
  try { commit = await markerCommit(cwd, version, label); } catch { return 'unreachable'; }
  try {
    await git(cwd, ['push', '--quiet', '--no-verify', `--force-with-lease=${ref}:`, remote, `${commit}:${ref}`]);
    return 'reserved';
  } catch {
    // Refused or not sent. The ref existing is the only answer that means "taken".
    try {
      const { stdout } = await git(cwd, ['ls-remote', remote, ref]);
      return stdout.trim() ? 'taken' : 'unreachable';
    } catch {
      return 'unreachable';
    }
  }
}

/**
 * The next free version above everything in `taken` and on the remote, reserved there.
 * Returns { version, reserved, attempts, reason? }. reserved is false only when the remote could
 * not be reached (or `noReserve`), and then `version` is the old, unreserved pick.
 */
export async function takeNextVersion({ cwd, remote = 'origin', taken = [], bump = 'minor', label, noReserve = false, maxAttempts = 25 }) {
  const seen = new Set(taken);
  if (noReserve) return { version: nextVersion(seen, bump), reserved: false, attempts: 0, reason: 'reservation turned off (--no-reserve)' };
  const remoteHeld = await reservedVersions({ cwd, remote });
  if (!remoteHeld) return { version: nextVersion(seen, bump), reserved: false, attempts: 0, reason: `could not read ${RESERVE_PREFIX}* from ${remote}` };
  for (const v of remoteHeld) seen.add(v);
  for (let attempts = 1; attempts <= maxAttempts; attempts++) {
    const version = nextVersion(seen, bump);
    const result = await reserve({ cwd, remote, version, label });
    if (result === 'reserved') return { version, reserved: true, attempts };
    if (result === 'unreachable') return { version, reserved: false, attempts, reason: `could not push ${RESERVE_PREFIX}${version} to ${remote}` };
    seen.add(version);
  }
  throw new Error(`no free version after ${maxAttempts} attempts`);
}
