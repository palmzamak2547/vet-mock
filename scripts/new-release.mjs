#!/usr/bin/env node
// npm run release:new -- [minor|patch]   (default minor)
//
// Writes src/data/changelog/<version>.js with the next free version, so sessions stop agreeing on
// numbers by message. "Taken" means: in changelog.js or a release file on origin/main, in a release
// file of any open pull request (gh), or in this checkout. Two sessions that run it in the same
// minute can still pick the same number; their files then share a path and the second pull request
// shows a conflict, and running this again picks the next one.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareVersions, readChangelog } from './regen-latest-changelog.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const bump = process.argv[2] || 'minor';
if (!['minor', 'patch'].includes(bump)) {
  console.error('usage: npm run release:new -- [minor|patch]');
  process.exit(1);
}
const run = (cmd, args) => {
  try { return execFileSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch { return ''; }
};

const taken = new Set((await readChangelog()).all.map((e) => e.version));
run('git', ['fetch', '-q', 'origin', 'main']);
for (const m of run('git', ['show', 'origin/main:src/data/changelog.js']).matchAll(/version: '(\d+\.\d+\.\d+)'/g)) taken.add(m[1]);
for (const m of run('git', ['ls-tree', '--name-only', 'origin/main', 'src/data/changelog/']).matchAll(/(\d+\.\d+\.\d+)\.js/g)) taken.add(m[1]);
const prs = run('gh', ['pr', 'list', '--state', 'open', '--limit', '100', '--json', 'files']);
if (!prs) console.warn('⚠ could not list open pull requests (gh); numbers they hold are not counted');
for (const m of prs.matchAll(/src\/data\/changelog\/(\d+\.\d+\.\d+)\.js/g)) taken.add(m[1]);

const [major, minor, patch] = [...taken].sort(compareVersions).at(-1).split('.').map(Number);
const version = bump === 'minor' ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`;
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
