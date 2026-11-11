#!/usr/bin/env node
// npm run release:new -- [minor|patch] [--no-reserve] [--remote <name>]   (default minor, origin)
//
// Writes src/data/changelog/<version>.js with the next free version, so sessions stop agreeing on
// numbers by message. "Taken" means: in changelog.js or a release file on origin/main, in a release
// file, a release record or the title of any open pull request (gh), in this checkout, or reserved on
// the remote (refs/vmx-release/<version>). The number is then reserved on the remote before the file
// is written (scripts/lib/release-reserve.mjs): the remote creates that ref for one caller only, so
// two lanes that run this at the same moment, on any machines, get different numbers. When the
// remote cannot be reached the old pick is used with a loud warning. Run it when you open the pull
// request and keep the number: there is no renumbering at merge, because Home announces every
// release a device has not seen (src/lib/changelog-seen.js) in whatever order they merge.
// Renumbering, when it is needed after all: src/data/changelog/README.md.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readChangelog } from './regen-latest-changelog.mjs';
import { RESERVE_PREFIX, takeNextVersion } from './lib/release-reserve.mjs';

const USAGE = `usage: npm run release:new -- [minor|patch] [--no-reserve] [--remote <name>]

  minor | patch   which part to raise (default minor)
  --no-reserve    do not reserve the number on the remote (offline work; collisions possible)
  --remote <name> the remote that holds ${RESERVE_PREFIX}* (default origin)
  --help          this text`;

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(USAGE);
  process.exit(0);
}
let bump = 'minor';
let remote = 'origin';
let noReserve = false;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === 'minor' || a === 'patch') bump = a;
  else if (a === '--no-reserve') noReserve = true;
  else if (a === '--remote' && args[i + 1]) remote = args[++i];
  else {
    console.error(USAGE);
    process.exit(1);
  }
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (cmd, argv) => {
  try { return execFileSync(cmd, argv, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch { return ''; }
};

const taken = new Set((await readChangelog()).all.map((e) => e.version));
run('git', ['fetch', '-q', remote, 'main']);
for (const m of run('git', ['show', `${remote}/main:src/data/changelog.js`]).matchAll(/version: '(\d+\.\d+\.\d+)'/g)) taken.add(m[1]);
for (const m of run('git', ['ls-tree', '--name-only', `${remote}/main`, 'src/data/changelog/']).matchAll(/(\d+\.\d+\.\d+)\.js/g)) taken.add(m[1]);
// gh lists only the first 100 files of a pull request, so one that deletes hundreds of files hides its
// release file; its title ("5.203.0: ...") and its release record still name the number.
const prs = run('gh', ['pr', 'list', '--state', 'open', '--limit', '100', '--json', 'files,title']);
if (!prs) console.warn('⚠ could not list open pull requests (gh); numbers they hold are not counted');
for (const m of prs.matchAll(/(?:src\/data\/changelog|docs\/releases)\/(\d+\.\d+\.\d+)\.(?:js|md)|"title":"(\d+\.\d+\.\d+)[: ]/g)) taken.add(m[1] || m[2]);

const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']).trim() || 'a branch';
const pick = await takeNextVersion({ cwd: root, remote, taken, bump, label: branch, noReserve });
const { version } = pick;
if (pick.reserved) {
  console.log(`reserved ${version} on ${remote} (${RESERVE_PREFIX}${version}${pick.attempts > 1 ? `, after ${pick.attempts - 1} taken by others` : ''})`);
} else {
  console.warn([
    '',
    `⚠⚠ ${version} is NOT reserved: ${pick.reason}.`,
    '   Another lane can take the same number until this one is reserved. When the remote answers, run',
    `   git push --force-with-lease=${RESERVE_PREFIX}${version}: ${remote} HEAD:${RESERVE_PREFIX}${version}`,
    '   and if that is refused, take another number (src/data/changelog/README.md).',
    '',
  ].join('\n'));
}
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date());
const file = path.join(root, 'src/data/changelog', `${version}.js`);
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, `// Release ${version}. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '${version}',
  date: '${date}',
  headline: '',
  changes: [
    { kind: 'feature', scope: 'system', title: '', desc: '' },
  ],
};
`);
console.log(`wrote ${path.relative(root, file)}`);
