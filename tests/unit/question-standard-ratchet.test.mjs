// lint:question-standard runs inside lint:all with --ratchet. It used to write
// docs/question-standard-baseline.json whenever a count fell ("baseline
// lowered ... commit it"), so a green gate could leave the tree dirty and what
// got pushed differed from what was gated. It was the only lint:all step that
// wrote without an explicit write flag.
//
// Now the gate only reports: a count that fell prints the command that
// records it, and exits 0 with the baseline untouched. Recording is the
// deliberate `npm run ratchet:question-standard` (--ratchet --write). A count
// that rose still fails, and a missing baseline fails instead of quietly
// writing a first one, because a ratchet with nothing to compare against is
// not checking anything.
//
// The script reads the banks from src/data and the baseline from docs/, both
// relative to where it runs, so each case runs it inside a scratch directory
// holding copies of the banks and a baseline of the case's own.
import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = path.join(repo, 'scripts', 'lint-question-standard.mjs');
const BASELINE = 'docs/question-standard-baseline.json';

// What the lint measures on the copied banks, recorded once in the scratch
// directory. The committed baseline is deliberately NOT the reference: now that
// the gate no longer lowers it, it may sit above the corpus until someone runs
// ratchet:question-standard, and a newly added detector row is absent from it
// until then. Neither is a failure of the lint, so neither may fail this file.
let measured;

let scratch;
test.before(() => {
  scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-question-standard-'));
  const data = path.join(scratch, 'src', 'data');
  fs.mkdirSync(data, { recursive: true });
  fs.mkdirSync(path.join(scratch, 'docs'));
  for (const name of fs.readdirSync(path.join(repo, 'src', 'data'))) {
    if (/^(questions-.*|images.*)\.js$/.test(name)) {
      fs.copyFileSync(path.join(repo, 'src', 'data', name), path.join(data, name));
    }
  }
  const r = spawnSync(process.execPath, [SCRIPT, '--ratchet', '--write'], { cwd: scratch, encoding: 'utf8' });
  assert.equal(r.status, 0, `${r.stdout}${r.stderr}`);
  measured = JSON.parse(fs.readFileSync(path.join(scratch, BASELINE), 'utf8'));
  assert.ok(Object.keys(measured).length > 0, 'the lint measures at least one row');
});
test.after(() => { if (scratch) fs.rmSync(scratch, { recursive: true, force: true }); });

const baselineFile = () => path.join(scratch, BASELINE);
const writeBaseline = (counts) => fs.writeFileSync(baselineFile(), `${JSON.stringify(counts, null, 2)}\n`);
const readBaseline = () => JSON.parse(fs.readFileSync(baselineFile(), 'utf8'));
const hash = () => (fs.existsSync(baselineFile())
  ? createHash('sha256').update(fs.readFileSync(baselineFile())).digest('hex')
  : null);
const lint = (...args) => {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { cwd: scratch, encoding: 'utf8' });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
};

// Every row the lint measures, one count higher than the corpus has, so every
// row reads as "fell".
const inflated = () => Object.fromEntries(Object.entries(measured).map(([k, n]) => [k, n + 3]));

test('a count that fell is reported with the command that records it, and nothing is written', () => {
  writeBaseline(inflated());
  const before = hash();
  const r = lint('--ratchet');
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /npm run ratchet:question-standard/);
  assert.equal(hash(), before, 'the gate rewrote the baseline');
});

test('a row measured for the first time is reported, and nothing is written', () => {
  const partial = { ...measured };
  delete partial[Object.keys(partial).at(-1)];
  writeBaseline(partial);
  const before = hash();
  const r = lint('--ratchet');
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /first measured/);
  assert.match(r.out, /npm run ratchet:question-standard/);
  assert.equal(hash(), before, 'the gate rewrote the baseline');
});

test('ratchet:question-standard records the lower counts', () => {
  const { scripts } = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));
  assert.equal(scripts['ratchet:question-standard'], 'node scripts/lint-question-standard.mjs --ratchet --write');
  assert.equal(scripts['lint:question-standard'], 'node scripts/lint-question-standard.mjs --ratchet');

  writeBaseline(inflated());
  const r = lint('--ratchet', '--write');
  assert.equal(r.status, 0, r.out);
  assert.deepEqual(readBaseline(), measured, 'the recorded baseline is the measured one');
});

test('a missing baseline fails the gate instead of writing a first one', () => {
  fs.rmSync(baselineFile(), { force: true });
  const r = lint('--ratchet');
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /npm run ratchet:question-standard/);
  assert.equal(fs.existsSync(baselineFile()), false, 'the gate wrote a baseline');

  const w = lint('--ratchet', '--write');
  assert.equal(w.status, 0, w.out);
  assert.deepEqual(readBaseline(), measured);
});

test('a count that rose still fails, and the baseline is not moved', () => {
  writeBaseline(measured);
  const extra = path.join(scratch, 'src', 'data', 'questions-zz-ratchet.js');
  fs.writeFileSync(extra, 'export const QZZ = [{ id: 987654321, subject: "zz-none", question: "x?", options: ["a", "b"], answer: 0 }];\n');
  try {
    const before = hash();
    const r = lint('--ratchet');
    assert.equal(r.status, 1, r.out);
    assert.match(r.out, /does not move backwards/);
    assert.equal(hash(), before);
  } finally {
    fs.rmSync(extra, { force: true });
  }
});
