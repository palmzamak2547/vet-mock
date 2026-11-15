#!/usr/bin/env node
// npm run lint:data:all [-- --full] [--github] [--summary=<file>]
//
// Every step of `lint:data`, each on its own and to the end, as one table.
//
// `lint:data` is one && chain, so its first failure hides every later one: on 11 Nov 2026 it stopped
// at step 33 of 63 and 30 steps said nothing, and a pull request learned its failures one red run at
// a time. This runs the same steps and never stops early. They are read from package.json through
// the local gate's own reader (resolveSteps in scripts/gate.mjs), so the chain, the gate and this
// table are one list: a step added to `lint:data` runs here with no second edit. A step that is
// itself a chain is split as well, so its later parts are not hidden either.
//
// One step at a time, in the chain's order, because a later step may rely on an earlier one (the
// release-number step fetches main). Exit 1 when any step failed, 0 otherwise.
//
// CI's Build runs this in place of the chain, so one red run names every failing step.
// `npm run lint:data` stays the chain, for anyone who wants it to stop at the first failure.
//
// It prints a row per step (step, pass or FAIL, seconds) with the first lines of a failure under
// its row, then the failed steps once more.
//   --full            also print everything each failed step printed
//   --github          the same, folded per step for a GitHub Actions log, with one error annotation
//                     per failed step
//   --summary=<file>  append the result as Markdown (the run summary file on GitHub Actions)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSteps, runPool } from './gate.mjs';

export const CHAIN = 'lint:data';
const FIRST_LINES = 10;
const WIDTH = 160;

/** The chain's steps in its own order: one per command it would run. */
export const lintSteps = (scripts) => resolveSteps(scripts, CHAIN);

const seconds = (ms) => (ms / 1000).toFixed(1);
const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*[A-Za-z]`, 'g');
const linesOf = (output) => String(output).replace(ANSI, '').split(/\r?\n/).map((l) => l.trimEnd()).filter((l) => l.trim());
const cut = (line) => (line.length > WIDTH ? `${line.slice(0, WIDTH - 1)}…` : line);
const firstLine = (r) => cut(linesOf(r.output)[0] || 'it printed nothing');

// GitHub reads a line that starts with `::` as a command, and these characters end its parts early.
const data = (s) => s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
const property = (s) => data(s).replace(/:/g, '%3A').replace(/,/g, '%2C');

function markdown(results, failed, total) {
  const head = `### \`${CHAIN}\`, every step\n\n`;
  if (!failed.length) return `${head}All ${results.length} steps passed in ${total} s.\n`;
  const cell = (s) => `\`${s.replace(/`/g, "'").replace(/\|/g, '\\|')}\``;
  return [
    `${head}${failed.length} of ${results.length} steps failed in ${total} s. The log holds everything each of them printed.`,
    '',
    '| step | exit | seconds | first line |',
    '|---|---|---|---|',
    ...failed.map((r) => `| ${cell(r.label)} | ${r.status} | ${seconds(r.ms)} | ${cell(firstLine(r))} |`),
    '',
  ].join('\n');
}

/** Runs every step and prints the table. Resolves 1 when a step failed, else 0. */
export async function runAll({ cwd = process.cwd(), print = console.log, full = false, github = false, summary = '' } = {}) {
  const { scripts } = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  const steps = lintSteps(scripts);
  const pad = Math.max(4, ...steps.map((s) => s.label.length));
  print(`${CHAIN}:all: the ${steps.length} steps of "${CHAIN}", each on its own and to the end`);
  print('');
  print(`  ${'step'.padEnd(pad)}  result  seconds`);
  const started = Date.now();
  // One at a time: the rows arrive in the chain's order, and a step can rely on the one before it.
  const results = await runPool(steps, 1, {
    cwd,
    onDone: (r) => {
      print(`  ${r.label.padEnd(pad)}  ${(r.status === 0 ? 'pass' : 'FAIL').padEnd(6)}  ${seconds(r.ms).padStart(7)}`);
      if (r.status === 0) return;
      const lines = linesOf(r.output);
      for (const line of lines.slice(0, FIRST_LINES)) print(`      | ${cut(line)}`);
      if (!lines.length) print('      | (it printed nothing)');
      if (lines.length > FIRST_LINES) print(`      | (${lines.length - FIRST_LINES} more lines: ${r.command})`);
    },
  });
  const failed = results.filter((r) => r.status !== 0);
  const total = seconds(Date.now() - started);

  if (full || github) {
    for (const r of failed) {
      print('');
      print(`${github ? '::group::' : '── '}${r.label}: everything it printed (${r.command})`);
      print(String(r.output).trimEnd() || '(nothing)');
      if (github) print('::endgroup::');
    }
  }

  print('');
  if (!failed.length) {
    print(`all ${results.length} steps passed in ${total} s`);
  } else {
    print(`${failed.length} of ${results.length} steps failed in ${total} s`);
    for (const r of failed) {
      print(`  ✘ ${r.label} (exit ${r.status}): ${firstLine(r)}`);
      if (github) print(`::error title=${property(`${CHAIN}, ${r.label}`)}::${data(firstLine(r))}`);
    }
  }

  if (summary) {
    // The table above is the verdict; a summary file that cannot be written changes nothing.
    try { fs.appendFileSync(summary, markdown(results, failed, total)); } catch (error) { print(`(no run summary written: ${error.message})`); }
  }
  return failed.length ? 1 : 0;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const argv = process.argv.slice(2);
  const summary = argv.find((a) => a.startsWith('--summary='))?.slice('--summary='.length) || '';
  runAll({ full: argv.includes('--full'), github: argv.includes('--github'), summary }).then((code) => { process.exitCode = code; }, (error) => {
    console.error(`✘ ${CHAIN}:all could not run: ${error.stack || error.message}`);
    process.exitCode = 1;
  });
}
