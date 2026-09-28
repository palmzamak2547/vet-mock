// Writes src/lib/runtime/verified.generated.js from the fixture declarations [M1-DESIGN.md 13.5], and
// src/lib/runtime/fixtures.generated.js, the data behind the public /methods page [M2-DESIGN.md 11.1].
// A fixture file declares itself with a top-level `_fixture`: { family, kind: 'pin'|'crosscheck', methods: [...],
// source?: 'one sentence: where the expected numbers come from', tolerance?: 'how close counts as equal' }.
// Only kind 'pin' counts toward "ตรวจเทียบแล้ว": R 4.6.0 outputs, NIST StRD, the course, the serosurvey
// numbers checked by an independent program. A declaration counts only when some tests/unit/*.test.mjs
// file references the fixture's path (the path under tests/fixtures/, e.g. 'course/epi-course-2026.json';
// for a directory declaration such as published/nist/fixture.json, any file of that directory), and that
// test must fail when a wrong value is injected (proved once per module, recorded in the role notes).
//
// fixtures.generated.js lists, per fixture file a unit test reads: family, kind, methods, the unit tests
// that read it, where its numbers come from (the `_fixture.source` sentence, else what the file records:
// R and package versions, the course bank item, the NIST pages), its tolerances, a hash of its text, and
// `lastPassed`: the date (in Asia/Bangkok) on which this script last ran every unit test that reads the fixture and saw
// them all pass. A run reruns those tests only for a fixture whose text changed since its date was written
// (or for all of them with --rerun); a fixture whose tests fail gets `lastPassed: null`. `--check` exits 1
// when either generated file is stale (a fixture added, removed, or changed since its tests last ran); it
// never runs tests itself. OWNER: trust role (M2; runtime in M1).
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const fixturesDir = path.join(root, 'tests', 'fixtures');
const unitDir = path.join(root, 'tests', 'unit');
const outFile = path.join(root, 'src', 'lib', 'runtime', 'verified.generated.js');
const fixturesOutFile = path.join(root, 'src', 'lib', 'runtime', 'fixtures.generated.js');

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const posix = (p) => p.split(path.sep).join('/');

/** sha-256 of the file's text with CRLF read as LF (a checkout on Windows must not look like a change), first 16 hex. */
function hashFile(file) {
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  return createHash('sha256').update(text).digest('hex').slice(0, 16);
}

const RELATIVE = /^([0-9.]+e[-+]?[0-9]+) relative$/i;

/**
 * What a fixture file says about itself: where its numbers come from and how close counts as equal.
 * Only fields the file actually carries; nothing is filled in by guess.
 * @param {any} json
 * @returns {{ source: { text: string|null, r: string|null, webR: string|null, packages: Record<string, string>|null,
 *   python: Record<string, string>|null, script: string|null, urls: string[], file: string|null, commit: string|null,
 *   date: string|null }, tolerance: { scope: string, rel?: string, lre?: number, text?: string }[] }}
 */
export function describe(json) {
  const decl = (json && json._fixture) || {};
  const meta = (json && json._meta) || {};
  const src = json && json.source;
  const urls = (Array.isArray(src) ? src : typeof src === 'string' ? [src] : []).filter((u) => typeof u === 'string' && /^https:\/\//.test(u));
  const pyKeys = ['python', 'numpy', 'scipy', 'statsmodels'].filter((k) => typeof meta[k] === 'string');
  const obj = src && typeof src === 'object' && !Array.isArray(src) ? src : null;
  const source = {
    text: typeof decl.source === 'string' ? decl.source : typeof decl.note === 'string' ? decl.note : null,
    r: typeof meta.r === 'string' ? meta.r : null,
    webR: typeof meta.webR === 'string' ? meta.webR : null,
    packages: meta.packages && typeof meta.packages === 'object' && Object.keys(meta.packages).length ? meta.packages : null,
    python: meta.python ? Object.fromEntries(pyKeys.map((k) => [k, meta[k]])) : null,
    script: typeof meta.script === 'string' ? meta.script : null,
    urls,
    file: obj && typeof obj.file === 'string' ? obj.file : null,
    commit: obj && typeof obj.commit === 'string' ? obj.commit : null,
    date: typeof meta.written === 'string' ? meta.written : typeof json.downloaded === 'string' ? json.downloaded : null,
  };
  const tolerance = [];
  const tol = (scope, value) => {
    if (typeof value === 'number') tolerance.push({ scope, lre: value });
    else if (typeof value === 'string') {
      const m = value.match(RELATIVE);
      tolerance.push(m ? { scope, rel: m[1] } : { scope, text: value });
    }
  };
  if (typeof decl.tolerance === 'string') tol('all', decl.tolerance);
  if (meta.tolerances && typeof meta.tolerances === 'object') for (const [k, v] of Object.entries(meta.tolerances)) tol(k, v);
  if (json && json.minLRE && typeof json.minLRE === 'object') {
    for (const [name, v] of Object.entries(json.minLRE)) {
      if (typeof v === 'number') tol(name, v);
      else if (v && typeof v === 'object') for (const [part, n] of Object.entries(v)) tol(`${name} ${part}`, n);
    }
  }
  return { source, tolerance };
}

/**
 * @param {{ fixturesDir: string, unitDir: string }} dirs
 * @returns {{ verified: Record<string, string[]>, declarations: { file: string, family: string, kind: string, methods: string[], referenced: boolean, tests: string[], about: ReturnType<typeof describe>, sha: string }[] }}
 */
export function collect({ fixturesDir: fdir, unitDir: udir }) {
  const tests = walk(udir).filter((f) => f.endsWith('.test.mjs')).sort().map((f) => ({ name: posix(path.relative(udir, f)), src: readFileSync(f, 'utf8') }));
  const readers = (needles) => tests.filter((t) => needles.some((n) => t.src.includes(n))).map((t) => t.name);
  const declarations = [];
  for (const file of walk(fdir).filter((f) => f.endsWith('.json'))) {
    let json;
    try {
      json = JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      continue;
    }
    const decl = json && json._fixture;
    if (!decl || typeof decl.family !== 'string' || !Array.isArray(decl.methods)) continue;
    const rel = posix(path.relative(fdir, file));
    const needles = [rel];
    if (path.basename(file) === 'fixture.json') {
      const dirRel = posix(path.relative(fdir, path.dirname(file)));
      for (const f of Array.isArray(json.files) ? json.files : []) needles.push(`${dirRel}/${f}`);
    }
    const readBy = readers(needles);
    declarations.push({
      file: rel, family: decl.family, kind: decl.kind, methods: decl.methods, referenced: readBy.length > 0,
      tests: readBy, about: describe(json), sha: hashFile(file),
    });
  }
  const verified = {};
  for (const d of declarations) {
    if (d.kind !== 'pin' || !d.referenced) continue;
    for (const m of d.methods) {
      verified[m] = verified[m] || [];
      if (!verified[m].includes(d.family)) verified[m].push(d.family);
    }
  }
  for (const m of Object.keys(verified)) verified[m].sort();
  return { verified, declarations };
}

export function render(verified) {
  const lines = Object.keys(verified).sort().map((m) => `  ${JSON.stringify(m)}: ${JSON.stringify(verified[m])},`);
  return [
    '// GENERATED by scripts/regen-verified.mjs from tests/fixtures/**/*.json. Do not edit by hand.',
    "// method id -> fixture family ids that cover it (e.g. 'r-4.6.0', 'course-2026', 'nist-strd', 'serosurvey-numbers').",
    '// Only pin fixtures referenced by a unit test count. `node scripts/regen-verified.mjs --check` fails when stale.',
    '/** @type {Record<string, string[]>} */',
    `export const VERIFIED = {${lines.length ? `\n${lines.join('\n')}\n` : ''}};`,
    '',
  ].join('\n');
}

/**
 * @param {ReturnType<typeof collect>['declarations']} declarations
 * @param {Record<string, { sha: string, lastPassed: string|null }>} dates  file -> the date carried for that text
 */
export function renderFixtures(declarations, dates) {
  const rows = declarations
    .filter((d) => d.referenced && d.methods.length > 0)
    .sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0))
    .map((d) => ({
      file: d.file, family: d.family, kind: d.kind, methods: [...d.methods].sort(), tests: d.tests,
      source: d.about.source, tolerance: d.about.tolerance, sha: d.sha,
      lastPassed: dates[d.file] && dates[d.file].sha === d.sha ? dates[d.file].lastPassed : null,
    }));
  return [
    '// GENERATED by scripts/regen-verified.mjs from tests/fixtures/**/*.json. Do not edit by hand.',
    '// Every fixture a unit test reads: where its numbers come from, its tolerances, the tests that read it, and',
    '// lastPassed, the date (Asia/Bangkok) those tests last passed when the script ran them. `--check` fails when stale.',
    '/** @type {readonly { file: string, family: string, kind: string, methods: string[], tests: string[], source: any, tolerance: any[], sha: string, lastPassed: string|null }[]} */',
    `export const FIXTURES = ${JSON.stringify(rows, null, 1)};`,
    '',
  ].join('\n');
}

/** Dates already written in a fixtures.generated.js text, by file. */
export function readDates(text) {
  const m = String(text || '').replace(/\r\n/g, '\n').match(/export const FIXTURES = ([\s\S]*?);\n/);
  if (!m) return {};
  try {
    return Object.fromEntries(JSON.parse(m[1]).map((r) => [r.file, { sha: r.sha, lastPassed: r.lastPassed }]));
  } catch {
    return {};
  }
}

/** Run each named unit test file once; true when every one exits 0. */
function runTests(names, cache) {
  for (const name of names) {
    if (cache.has(name)) continue;
    const r = spawnSync(process.execPath, ['--test', posix(path.join('tests', 'unit', name))], { cwd: root, stdio: 'pipe', encoding: 'utf8' });
    cache.set(name, r.status === 0);
    if (r.status !== 0) console.error(`failed: tests/unit/${name}`);
  }
  return names.length > 0 && names.every((n) => cache.get(n));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const { verified, declarations } = collect({ fixturesDir, unitDir });
  const text = render(verified);
  const current = existsSync(outFile) ? readFileSync(outFile, 'utf8') : '';
  const fixturesCurrent = existsSync(fixturesOutFile) ? readFileSync(fixturesOutFile, 'utf8').replace(/\r\n/g, '\n') : '';
  const previous = readDates(fixturesCurrent);
  if (process.argv.includes('--check')) {
    let stale = false;
    if (current.replace(/\r\n/g, '\n') !== text) {
      console.error('verified.generated.js is stale: run node scripts/regen-verified.mjs');
      stale = true;
    }
    if (fixturesCurrent !== renderFixtures(declarations, previous)) {
      console.error('fixtures.generated.js is stale (a fixture was added, removed or changed since its tests last ran): run node scripts/regen-verified.mjs');
      stale = true;
    }
    if (stale) process.exit(1);
    console.log(`verified.generated.js is current (${Object.keys(verified).length} methods); fixtures.generated.js is current.`);
  } else {
    writeFileSync(outFile, text);
    for (const d of declarations) console.log(`${d.kind.padEnd(10)} ${d.referenced ? 'used  ' : 'unused'} ${d.family.padEnd(20)} ${d.file}`);
    console.log(`wrote ${posix(path.relative(root, outFile))}: ${Object.keys(verified).length} methods`);
    const rerun = process.argv.includes('--rerun');
    // The day in Thailand (the site's readers), written YYYY-MM-DD.
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const cache = new Map();
    const dates = {};
    for (const d of declarations) {
      if (!d.referenced || d.methods.length === 0) continue;
      const prev = previous[d.file];
      if (!rerun && prev && prev.sha === d.sha && prev.lastPassed) {
        dates[d.file] = prev;
        continue;
      }
      dates[d.file] = { sha: d.sha, lastPassed: runTests(d.tests, cache) ? today : null };
    }
    writeFileSync(fixturesOutFile, renderFixtures(declarations, dates));
    const failed = Object.entries(dates).filter(([, v]) => !v.lastPassed).map(([f]) => f);
    console.log(`wrote ${posix(path.relative(root, fixturesOutFile))}: ${Object.keys(dates).length} fixtures, ${cache.size} test files run${failed.length ? `; not passing: ${failed.join(', ')}` : ''}`);
  }
}
