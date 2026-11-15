// The steps of `npm run lint:data`, read from scripts/lint-data.list (one npm script name per line).
//
// Until 16 Nov 2026 `lint:data` was one line of `&&` in package.json, so every pull request that added
// a lint edited the same line and any two of them conflicted. The list keeps one name per line, in
// alphabetical order after lint:untracked, so two additions land in different places and merge
// cleanly. scripts/lint-all.mjs (lint:data and lint:data:all), scripts/gate.mjs and
// scripts/push-gate.mjs all read the steps through this module.
import fs from 'node:fs';
import path from 'node:path';

export const LINT_LIST = 'scripts/lint-data.list';
export const FIRST_STEP = 'lint:untracked';

/** The npm script names in the list, in its order. Throws when the file is missing or empty. */
export function readLintList(cwd = process.cwd()) {
  const file = path.join(cwd, LINT_LIST);
  if (!fs.existsSync(file)) throw new Error(`${LINT_LIST} is missing: it lists the steps of lint:data`);
  const names = fs.readFileSync(file, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  if (!names.length) throw new Error(`${LINT_LIST} names no step`);
  return names;
}

/** The steps as the commands the old && chain held (`npm run <name>`), for tests that ask "is X a step?". */
export const lintDataCommands = (cwd = process.cwd()) => readLintList(cwd).map((name) => `npm run ${name}`);

/** What is wrong with the list against package.json's scripts: empty when it is well formed. */
export function lintListProblems(names, scripts) {
  const problems = [];
  if (names[0] !== FIRST_STEP) problems.push(`the first step must be ${FIRST_STEP}, not ${names[0]}`);
  const seen = new Set();
  for (const name of names) {
    if (seen.has(name)) problems.push(`${name} is listed twice`);
    seen.add(name);
    if (typeof scripts[name] !== 'string') problems.push(`${name} is not a script in package.json`);
    if (/^lint:data(:all)?$/.test(name)) problems.push(`${name} cannot be a step of itself`);
  }
  const rest = names.slice(1);
  rest.forEach((name, i) => {
    // Plain code-unit order (what `sort` gives), so no locale decides where a line goes.
    if (i > 0 && rest[i - 1] > name) problems.push(`${name} is out of alphabetical order (after ${rest[i - 1]})`);
  });
  return problems;
}
