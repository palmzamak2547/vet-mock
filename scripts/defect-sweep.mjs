#!/usr/bin/env node
// npm run sweep:defects [-- --gather] [--write] [--keep] [<playwright arguments>]
//
// Runs tests/e2e/defect-sweep.spec.js (left out of every other run by playwright.config.js) against
// the connected bundle, then gathers what it found:
//   work/defect-sweep/findings.json   every finding, one per line
//   work/defect-sweep/counts.json     the counts per detector, against the baseline
//   work/defect-sweep/shots/          a cropped picture per finding (at most three per fault and size)
// and fails when a detector found more than tests/e2e/defect-baseline.json allows. The baseline only
// falls: --write lowers each number to what this run counted and never raises one.
//
// Build first, as CI builds its connected runner:
//   VITE_SUPABASE_URL=https://mpovsdzdggvksmeehqfj.supabase.co VITE_SUPABASE_ANON_KEY=ci-placeholder-not-a-real-key \
//     npx vite build --outDir dist-connected
// (after `npm run build`, which writes the generated files that build reads). The key is not a key:
// every database request is answered by the spec. PLAYWRIGHT_BASE_URL points it elsewhere instead.
//
// Narrowing, for a rerun of one screen: VMX_DEFECT_ONLY=<part of a path or flow name> (=<path> for that path only),
// VMX_DEFECT_STATES=settled,loading, VMX_DEFECT_SIZES=390x664, VMX_DEFECT_SCHEMES=dark,
// VMX_DEFECT_PARTS=routes,probe,flows. A narrowed run gathers, but is not compared with the baseline.
// --gather only gathers what is already in work/defect-sweep/raw. At most three workers: the
// machine is shared.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PORTS } from '../tests/e2e/local-port.js';
import { compareBaseline, countFindings, lowerBaseline } from './lib/defect-baseline.mjs';
import { ALLOW } from '../tests/e2e/lib/defect-allow.js';
import { allowedBy } from '../tests/e2e/lib/defects.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.VMX_DEFECT_OUT || path.join(ROOT, 'work', 'defect-sweep');
const BASELINE = path.join(ROOT, 'tests', 'e2e', 'defect-baseline.json');
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const passthrough = args.filter((a) => !['--gather', '--write', '--keep'].includes(a));
const narrowed = ['VMX_DEFECT_ONLY', 'VMX_DEFECT_STATES', 'VMX_DEFECT_SIZES', 'VMX_DEFECT_SCHEMES', 'VMX_DEFECT_PARTS', 'VMX_DEFECT_DEV'].some((k) => process.env[k])
  || passthrough.some((a) => !a.startsWith('--workers') && !a.startsWith('--reporter'));

async function run() {
  if (!flag('--keep')) {
    rmSync(path.join(OUT, 'raw'), { recursive: true, force: true });
    rmSync(path.join(OUT, 'shots'), { recursive: true, force: true });
    rmSync(path.join(OUT, 'steps'), { recursive: true, force: true });
  }
  mkdirSync(path.join(OUT, 'raw'), { recursive: true });
  let server = null;
  let base = process.env.PLAYWRIGHT_BASE_URL;
  if (!base) {
    const dist = path.join(ROOT, 'dist-connected');
    if (!existsSync(path.join(dist, 'index.html'))) {
      console.error('sweep:defects: no dist-connected/ (see this script\'s header for the build)');
      process.exit(2);
    }
    const port = PORTS.local + 4000;
    base = `http://127.0.0.1:${port}`;
    server = spawn(process.execPath, [path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--outDir', 'dist-connected', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
    for (let i = 0; i < 60; i += 1) {
      try { if ((await fetch(base)).ok) break; } catch { /* not up yet */ }
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  const workers = passthrough.some((a) => a.startsWith('--workers')) ? [] : ['--workers=3'];
  const result = spawnSync('npx', ['playwright', 'test', 'tests/e2e/defect-sweep.spec.js', '--project=chromium-desktop', '--retries=0', ...workers, ...passthrough], {
    cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32',
    env: { ...process.env, VMX_DEFECT_SWEEP: '1', PLAYWRIGHT_BASE_URL: base, PLAYWRIGHT_OUTPUT_DIR: 'test-results/defect-sweep' },
  });
  if (server) server.kill();
  return result.status ?? 1;
}

function gather() {
  const dir = path.join(OUT, 'raw');
  const rows = [];
  for (const f of existsSync(dir) ? readdirSync(dir) : []) {
    if (!f.endsWith('.json')) continue;
    try { rows.push(...JSON.parse(readFileSync(path.join(dir, f), 'utf8')).findings); } catch { /* a file being written when the run stopped */ }
  }
  // The allow list is read again here, so a row added after a run applies without running again.
  for (const r of rows) {
    const hit = r.detector && r.detector !== 'unreached' ? allowedBy(ALLOW, r) : null;
    if (hit) r.allowed = hit.reason; else delete r.allowed;
  }
  rows.sort((a, b) => `${a.route}|${a.state}|${a.size}|${a.scheme}|${a.detector}`.localeCompare(`${b.route}|${b.state}|${b.size}|${b.scheme}|${b.detector}`));
  writeFileSync(path.join(OUT, 'findings.json'), `[\n${rows.map((r) => JSON.stringify(r)).join(',\n')}\n]\n`);
  return rows;
}

const status = flag('--gather') ? 0 : await run();
const rows = gather();
const counts = countFindings(rows);
const file = JSON.parse(readFileSync(BASELINE, 'utf8'));
const { over, under } = compareBaseline(counts, file.counts);
writeFileSync(path.join(OUT, 'counts.json'), `${JSON.stringify({ counts, baseline: file.counts, findings: rows.length }, null, 2)}\n`);
console.log(`sweep:defects: ${rows.length} findings in ${path.relative(ROOT, path.join(OUT, 'findings.json'))}`);
for (const [d, n] of Object.entries(counts)) console.log(`  ${d.padEnd(11)} ${String(n).padStart(6)}  (baseline ${file.counts[d]})`);
if (narrowed) {
  console.log('sweep:defects: a narrowed run, not compared with the baseline');
  process.exit(status);
}
if (flag('--write')) {
  writeFileSync(BASELINE, `${JSON.stringify({ ...file, counts: lowerBaseline(counts, file.counts) }, null, 2)}\n`);
  console.log('sweep:defects: baseline lowered where this run counted less');
}
if (over.length) {
  console.error(`sweep:defects: more than the baseline allows:\n  ${over.join('\n  ')}`);
  process.exit(1);
}
if (under.length && !flag('--write')) console.log(`sweep:defects: below the baseline, record it with --write:\n  ${under.join('\n  ')}`);
process.exit(status);
