// Second check for the R parity fixtures: native R 4.6.0 (GitHub Actions, Linux) recomputes every
// research/tests/fixtures/r/<name>.R and compares with the committed webR files [M1-DESIGN.md 13.2].
//
//   node research/scripts/r-parity/run-native.mjs                  compare every script
//   node research/scripts/r-parity/run-native.mjs --only ttest,mh
//   node research/scripts/r-parity/run-native.mjs --packages       print "pkg@version" for pak, from
//                                                                  the committed files' _meta.packages
//
// It writes nothing in the repository: each script runs with RS_OUT set to a temporary folder.
// Native R and webR are the same R 4.6.0 source; they differ in the C library's exp/log/pow, so the
// comparison uses NATIVE_REL (compare.mjs). The R version and every package version must equal the
// committed ones, or the run fails before comparing: a different epiR is a different pin, not noise.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareFixtureDocs, NATIVE_REL } from './compare.mjs';
import { listScripts, OUT_DIR, R_DIR } from './run-webr.mjs';

const RSCRIPT = process.env.RSCRIPT || 'Rscript';

/** Package versions recorded in the committed files, as { name: version }. */
export function committedPackages(names) {
  const all = {};
  for (const n of names) {
    const file = path.join(OUT_DIR, `${n}.json`);
    if (!existsSync(file)) continue;
    const pk = JSON.parse(readFileSync(file, 'utf8'))._meta?.packages || {};
    for (const [p, v] of Object.entries(pk)) {
      if (all[p] && all[p] !== v) throw new Error(`${p} is recorded as ${all[p]} and ${v} in different files`);
      all[p] = v;
    }
  }
  return all;
}

function main() {
  const args = process.argv.slice(2);
  const onlyIdx = args.indexOf('--only');
  const names = listScripts(onlyIdx >= 0 ? args[onlyIdx + 1] : null);

  if (args.includes('--packages')) {
    console.log(Object.entries(committedPackages(names)).map(([p, v]) => `${p}@${v}`).join(' '));
    return;
  }

  let rVersion;
  try {
    rVersion = execFileSync(RSCRIPT, ['-e', 'cat(R.version.string)'], { encoding: 'utf8' }).trim();
  } catch (e) {
    console.error(`cannot run ${RSCRIPT} (${e.code || e.message}). This check needs native R 4.6.0; locally use run-webr.mjs --check.`);
    process.exit(2);
  }
  console.log(`${rVersion} (native, ${process.platform})`);
  if (!rVersion.startsWith('R version 4.6.0')) {
    console.error(`expected R 4.6.0, got ${rVersion}`);
    process.exit(2);
  }

  const tmp = mkdtempSync(path.join(os.tmpdir(), 'r-parity-'));
  const problems = [];
  try {
    for (const n of names) {
      const target = path.join(OUT_DIR, `${n}.json`);
      if (!existsSync(target)) { problems.push(`${n}: no committed file`); continue; }
      try {
        execFileSync(RSCRIPT, ['--vanilla', '-e', `source("${n}.R", local = new.env(), encoding = "UTF-8")`], {
          cwd: R_DIR,
          env: { ...process.env, RS_OUT: tmp, RS_WEBR: '' },
          stdio: ['ignore', 'inherit', 'inherit'],
        });
      } catch (e) {
        problems.push(`${n}: R error (exit ${e.status})`);
        continue;
      }
      const committed = JSON.parse(readFileSync(target, 'utf8'));
      const fresh = JSON.parse(readFileSync(path.join(tmp, `${n}.json`), 'utf8'));
      const want = committed._meta?.packages || {};
      const got = fresh._meta?.packages || {};
      const versionDiffs = [...new Set([...Object.keys(want), ...Object.keys(got)])]
        .filter((p) => want[p] !== got[p])
        .map((p) => `package ${p}: committed ${want[p] ?? 'not used'}, native ${got[p] ?? 'not used'}`);
      if (versionDiffs.length) { problems.push(`${n}:\n    ${versionDiffs.join('\n    ')}`); continue; }
      const diffs = compareFixtureDocs(committed, fresh, NATIVE_REL);
      console.log(`  ${n}: ${diffs.length ? `${diffs.length} difference(s)` : `same within ${NATIVE_REL} relative`}`);
      if (diffs.length) problems.push(`${n}:\n    ${diffs.join('\n    ')}`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  if (problems.length) {
    console.error(`\n${problems.length} problem(s):\n${problems.join('\n')}`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
