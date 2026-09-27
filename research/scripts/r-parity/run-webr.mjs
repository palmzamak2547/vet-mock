// Regenerates the R parity fixtures with R 4.6.0 running in webR 0.6.0 under Node [M1-DESIGN.md 13.2].
//
//   node research/scripts/r-parity/setup-webr.mjs          once, installs webR outside the repo
//   node research/scripts/r-parity/run-webr.mjs            writes research/tests/fixtures/r/out/*.json
//   node research/scripts/r-parity/run-webr.mjs --check    recomputes and compares, writes nothing
//   node research/scripts/r-parity/run-webr.mjs --only ttest,anova
//
// Each research/tests/fixtures/r/<name>.R (files starting with "_" are helpers) runs in a fresh R
// environment inside one webR session. A script declares the packages it needs on a line
// "# packages: epiR, PropCIs"; they are installed from https://repo.r-wasm.org before the scripts run.
// The webR folder comes from $WEBR_RUNNER_DIR or the sibling "webr-runner" folder (setup-webr.mjs).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { compareFixtureDocs } from './compare.mjs';
import { defaultRunnerDir, installedVersion, WEBR_VERSION } from './setup-webr.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const R_DIR = path.resolve(HERE, '..', '..', 'tests', 'fixtures', 'r');
export const OUT_DIR = path.join(R_DIR, 'out');
export const WEBR_REPO = 'https://repo.r-wasm.org';

export function listScripts(only) {
  const all = readdirSync(R_DIR).filter((f) => f.endsWith('.R') && !f.startsWith('_')).map((f) => f.slice(0, -2)).sort();
  if (!only) return all;
  const want = only.split(',').map((s) => s.trim()).filter(Boolean);
  const missing = want.filter((w) => !all.includes(w));
  if (missing.length) throw new Error(`no such fixture script: ${missing.join(', ')}`);
  return want;
}

export function declaredPackages(src) {
  const m = src.match(/^#[ \t]*packages:[ \t]*(.*)$/m);
  return m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const onlyIdx = args.indexOf('--only');
  const names = listScripts(onlyIdx >= 0 ? args[onlyIdx + 1] : null);

  const runnerDir = defaultRunnerDir();
  if (installedVersion(runnerDir) !== WEBR_VERSION) {
    console.error(`webR ${WEBR_VERSION} is not installed in ${runnerDir}. Run: node research/scripts/r-parity/setup-webr.mjs`);
    process.exit(2);
  }
  const { WebR } = await import(pathToFileURL(path.join(runnerDir, 'node_modules', 'webr', 'dist', 'webr.mjs')).href);
  // The worker path must be relative to the working directory (Node's Worker refuses file:// URLs).
  process.chdir(runnerDir);
  const webR = new WebR({ baseUrl: './node_modules/webr/dist/', interactive: false });
  await webR.init();
  const rVersion = await webR.evalRString('R.version.string');
  console.log(`${rVersion}, webR ${WEBR_VERSION}`);
  if (!rVersion.startsWith('R version 4.6.0')) throw new Error(`expected R 4.6.0, got ${rVersion}`);

  const sources = Object.fromEntries(names.map((n) => [n, readFileSync(path.join(R_DIR, `${n}.R`), 'utf8')]));
  const pkgs = [...new Set(names.flatMap((n) => declaredPackages(sources[n])))].sort();
  if (pkgs.length) {
    console.log(`installing from ${WEBR_REPO}: ${pkgs.join(', ')}`);
    await webR.installPackages(pkgs, { repos: [WEBR_REPO], quiet: true });
  }

  const work = '/home/web_user/rp';
  const out = '/home/web_user/out';
  await webR.FS.mkdir(work);
  await webR.FS.mkdir(out);
  for (const f of readdirSync(R_DIR).filter((f) => f.startsWith('_') && f.endsWith('.R'))) {
    await webR.FS.writeFile(`${work}/${f}`, readFileSync(path.join(R_DIR, f)));
  }
  await webR.evalRVoid(`Sys.setenv(RS_OUT = "${out}", RS_WEBR = "${WEBR_VERSION}"); setwd("${work}")`);

  const problems = [];
  if (!check) mkdirSync(OUT_DIR, { recursive: true });
  for (const n of names) {
    await webR.FS.writeFile(`${work}/${n}.R`, new TextEncoder().encode(sources[n]));
    const shelter = await new webR.Shelter();
    try {
      const res = await shelter.captureR(`source("${n}.R", local = new.env(), encoding = "UTF-8")`, { withAutoprint: false, captureStreams: true, captureConditions: false });
      const errs = res.output.filter((o) => o.type === 'stderr').map((o) => o.data).join('\n');
      if (errs.trim()) console.log(`  ${n}: R wrote to stderr:\n${errs}`);
    } catch (e) {
      problems.push(`${n}: R error: ${e.message}`);
      console.error(`  ${n}: R error: ${e.message}`);
      continue;
    } finally {
      await shelter.purge();
    }
    const bytes = await webR.FS.readFile(`${out}/${n}.json`);
    const text = new TextDecoder().decode(bytes);
    const fresh = JSON.parse(text);
    const target = path.join(OUT_DIR, `${n}.json`);
    if (check) {
      if (!existsSync(target)) { problems.push(`${n}: no committed file ${path.relative(process.cwd(), target)}`); continue; }
      const diffs = compareFixtureDocs(JSON.parse(readFileSync(target, 'utf8')), fresh, 0);
      if (diffs.length) problems.push(`${n}:\n    ${diffs.join('\n    ')}`);
      console.log(`  ${n}: ${diffs.length ? `${diffs.length} difference(s)` : 'same'}`);
    } else {
      writeFileSync(target, text);
      console.log(`  ${n}: wrote ${Object.keys(fresh.cases).length} case(s)`);
    }
  }
  webR.close();
  if (problems.length) {
    console.error(`\n${problems.length} problem(s):\n${problems.join('\n')}`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
