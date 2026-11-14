#!/usr/bin/env node
// npm run typecheck — the type check of plain JavaScript, in lint:data.
//
// The files checked are the list in scripts/typecheck-files.json; adding a file
// is one line there plus `// @ts-check` at its top. The compiler options are
// tsconfig.check.json. Nothing is compiled.
//
// Fails when:
//   - the compiler reports any error in a listed file;
//   - a listed file does not start with `// @ts-check`, or a file outside the
//     list carries it (so the list is the one place that says what is checked);
//   - a listed file silences the checker (`@ts-ignore`, `@ts-expect-error`,
//     `@ts-nocheck`) or types something `any` without a reason on the same
//     line: `// @ts-expect-error -- why`, `/** @type {any} -- why */`.
// It prints how many silencers and `any`s the listed files hold.
//
// `--only <file>` checks that one file instead of the list (the unit test seeds
// a wrong call this way and expects a failure).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIST = 'scripts/typecheck-files.json';
const CONFIG = 'tsconfig.check.json';

const onlyAt = process.argv.indexOf('--only');
const only = onlyAt > 0 ? path.resolve(process.argv[onlyAt + 1]) : null;
const files = only ? [path.relative(ROOT, only)] : JSON.parse(fs.readFileSync(path.join(ROOT, LIST), 'utf8'));
const problems = [];
let silencers = 0;
let anys = 0;

if (new Set(files).size !== files.length) problems.push(`${LIST} names a file twice`);
for (const rel of files) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { problems.push(`${rel}: listed in ${LIST} but missing`); continue; }
  const lines = fs.readFileSync(abs, 'utf8').split(/\r?\n/);
  const head = lines.find((l) => l.trim() && !l.startsWith('#!'));
  if (head?.trim() !== '// @ts-check') problems.push(`${rel}: the first line must be // @ts-check`);
  lines.forEach((line, i) => {
    const silence = /@ts-(ignore|expect-error|nocheck)\b/.test(line);
    const any = /[{<(:,|]\s*any\s*[}>)\]|,]|@type\s*\{any\}/.test(line) && /@(type|param|returns?|typedef|property)\b/.test(line);
    if (silence) silencers++;
    if (any) anys++;
    if ((silence || any) && !/\s--\s+\S/.test(line)) {
      problems.push(`${rel}:${i + 1}: ${silence ? 'a silenced check' : 'an any'} needs a reason on its line ("-- why")`);
    }
  });
}

// A file carrying @ts-check outside the list would look checked and is not.
let tracked = [];
try {
  tracked = execFileSync('git', ['grep', '-l', '^// @ts-check', '--', 'src', 'api', 'scripts'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter(Boolean);
} catch { /* git grep exits 1 when nothing matches */ }
if (!only) for (const rel of tracked) if (!files.includes(rel)) problems.push(`${rel}: has // @ts-check but is not in ${LIST}`);

const configFile = ts.readConfigFile(path.join(ROOT, CONFIG), ts.sys.readFile);
if (configFile.error) throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, ROOT, undefined, CONFIG);
const program = ts.createProgram({ rootNames: files.map((f) => path.join(ROOT, f)), options: parsed.options });
const diagnostics = ts.getPreEmitDiagnostics(program);
const host = { getCanonicalFileName: (f) => f, getCurrentDirectory: () => ROOT, getNewLine: () => '\n' };
const errors = diagnostics.filter((d) => d.category === ts.DiagnosticCategory.Error);

if (errors.length) process.stdout.write(ts.formatDiagnostics(errors, host));
for (const p of problems) console.log(`✗ ${p}`);
console.log(`typecheck: ${files.length} files, ${errors.length} type error(s), ${problems.length} list problem(s); ${silencers} silenced check(s) and ${anys} any(s), each with its reason`);
process.exitCode = errors.length || problems.length ? 1 : 0;
