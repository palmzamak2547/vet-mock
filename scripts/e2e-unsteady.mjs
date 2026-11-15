#!/usr/bin/env node
// node scripts/e2e-unsteady.mjs <playwright json report>...
//
// Only a test on the counted list may pass on its retry. CI gives every e2e test one retry
// (playwright.config.js), so a test that fails one attempt in three still shows green, nobody
// fixes it, and it turns a pull request red the day both attempts fail: from 9 to 15 Nov 2026,
// specs a pull request did not touch cost 22 of 84 lost CI rounds. This reads Playwright's JSON
// report and fails when a test was "flaky" (failed, then passed on its retry) and is not listed in
// tests/e2e/unsteady.json with its reason and the date it was listed.
//
// The list can only shrink: tests/unit/e2e-unsteady.test.mjs pins its length to a budget that is
// lowered when an entry is fixed and never raised. Fix a newly unsteady test at its cause (read its
// trace; AGENTS.md, "E2E and CI", and docs/CONTRIBUTING-CI.md say what WebKit is known to do); list it
// only when the cause is outside the app, and lower nothing else to make room.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const LIST = 'tests/e2e/unsteady.json';

export function readUnsteady(root = repo) {
  return JSON.parse(fs.readFileSync(path.join(root, LIST), 'utf8')).tests;
}

/** Tests that passed only on a retry: [{ file, line, title, project }]. `file` is relative to tests/e2e. */
export function flakyTests(report) {
  const out = [];
  const walk = (suite, file) => {
    for (const s of suite.suites || []) walk(s, s.file || file);
    for (const spec of suite.specs || []) {
      for (const t of spec.tests || []) {
        if (t.status === 'flaky') out.push({ file: (spec.file || file || '').replace(/\\/g, '/'), line: spec.line, title: spec.title, project: t.projectName });
      }
    }
  };
  for (const s of report.suites || []) walk(s, s.file);
  return out;
}

/** The list entry that allows this flaky test its retry, or undefined. */
export function allowedBy(test, list) {
  // By title, not line: an edit above a listed test moves its line and must not take its retry away.
  return list.find((e) => e.spec === `tests/e2e/${test.file}` && e.title === test.title && (!e.projects || e.projects.includes(test.project)));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const list = readUnsteady();
  const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const flaky = [];
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    flaky.push(...flakyTests(JSON.parse(fs.readFileSync(f, 'utf8'))));
  }
  const unlisted = flaky.filter((t) => !allowedBy(t, list));
  for (const t of flaky.filter((x) => allowedBy(x, list))) {
    console.log(`listed, passed on its retry: tests/e2e/${t.file}:${t.line} (${t.project}) ${t.title}`);
  }
  for (const t of unlisted) {
    console.log(`::error file=tests/e2e/${t.file},line=${t.line},title=passed only on its retry::${t.title} (${t.project}) failed once and passed on the retry. Only a test listed in ${LIST} may; fix it at its cause.`);
  }
  if (process.env.GITHUB_STEP_SUMMARY && flaky.length) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, [`## e2e tests that passed only on their retry: ${flaky.length}`, '', '| listed | project | test |', '|---|---|---|',
      ...flaky.map((t) => `| ${allowedBy(t, list) ? 'yes' : '**no**'} | ${t.project} | tests/e2e/${t.file}:${t.line} ${t.title} |`), ''].join('\n'));
  }
  console.log(`${flaky.length} test(s) passed only on their retry, ${unlisted.length} of them not on the list`);
  if (unlisted.length) process.exit(1);
}
