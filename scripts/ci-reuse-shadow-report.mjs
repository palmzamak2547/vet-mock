#!/usr/bin/env node
// Agreement of the CI reuse shadow (.github/workflows/smoke-e2e.yml, jobs `changes` and `smoke`).
//   node scripts/ci-reuse-shadow-report.mjs [--since=2026-11-02]
// For each push run of Smoke e2e on main since the date: the prediction `smoke` logged
// (would-skip, would-run, lookup-failed) beside that run's e2e result. A would-skip whose e2e did
// not pass is a disagreement, and one is enough to keep the reuse off (main session, 2 Nov 2026).
import { execFileSync } from 'node:child_process';

const REPO = 'palmzamak2547/vet-mock';
const since = process.argv.find((a) => a.startsWith('--since='))?.slice(8) || '2026-11-02';
const gh = (...args) => JSON.parse(execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 1 << 26 }));

const runs = gh('run', 'list', '--repo', REPO, '--workflow', 'Smoke e2e', '--branch', 'main', '--event', 'push',
  '--limit', '300', '--json', 'databaseId,headSha,createdAt').filter((r) => r.createdAt >= since);
const tally = new Map();
let disagreements = 0;
let skips = 0;
let read = 0;
for (const run of runs) {
  const smoke = gh('api', `repos/${REPO}/actions/runs/${run.databaseId}/jobs?per_page=100`).jobs.find((j) => j.name === 'smoke');
  if (!smoke) continue;
  read++;
  const notes = gh('api', `${smoke.check_run_url.replace('https://api.github.com/', '')}/annotations`);
  const line = notes.find((a) => a.title === 'reuse-shadow')?.message || '';
  const predicted = /predicted=(\S+)/.exec(line)?.[1] || 'no-log';
  const e2e = /e2e=(\S+)/.exec(line)?.[1] || 'unknown';
  const key = `${predicted}, e2e ${e2e}`;
  tally.set(key, (tally.get(key) || 0) + 1);
  if (predicted === 'would-skip') skips++;
  if (predicted === 'would-skip' && e2e !== 'success') {
    disagreements++;
    console.log(`DISAGREE ${run.headSha.slice(0, 8)} (run ${run.databaseId}): ${line}`);
  }
}
console.log(`${read} push runs of Smoke e2e on main with a smoke job since ${since}`);
for (const [key, n] of [...tally].sort()) console.log(`${String(n).padStart(4)}  ${key}`);
console.log(`${skips} would-skip, ${disagreements} disagreement(s)${disagreements ? ': keep the reuse off' : ''}`);
