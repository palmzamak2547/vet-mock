// A generated file that git checks out with CRLF is still the same file.
//
// Windows checkouts run with core.autocrlf=true, so every generated module in
// a worktree holds CRLF while its generator writes LF. On 23 Sep a release gate
// died at lint:exam-scope with "exam-papers.generated.js is stale" after
// `git checkout -- .` had restored that file byte-for-byte in content and CRLF
// in line endings; `git diff --ignore-cr-at-eol` was empty. The run cost a full
// gate, and the obvious "fix" (regenerate and commit) would have been
// line-ending churn.
//
// Each case runs a generator inside a scratch copy of the repo, feeds its
// --check a CRLF copy of the generator's own output (must pass and write
// nothing), then a copy whose content really changed (must fail and repair
// nothing). The second half is what keeps the tolerance from hiding drift.
import assert from 'node:assert/strict';
import test from 'node:test';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// Every generator whose --check compares text. regen-q-counts has its own
// test (regen-q-counts-check.test.mjs); regen-video-meta compares meaning by
// importing the module, so line endings never reach it.
const GENERATORS = [
  { script: 'regen-exam-papers.mjs', out: 'src/data/exam-papers.generated.js' },
  { script: 'regen-latest-changelog.mjs', out: 'src/data/latest-changelog.generated.js' },
  { script: 'regen-bank-registry.mjs', out: 'src/data/bank-registry.generated.js' },
  { script: 'regen-question-delivery.mjs', out: 'src/data/question-delivery.generated.js' },
  { script: 'regen-mochi-poses.mjs', out: 'src/data/mochi-poses.generated.js' },
  { script: 'regen-glossary-related.mjs', out: 'src/data/glossary-related.generated.js' },
  { script: 'regen-written-questions.mjs', out: 'api/_lib/written-questions.generated.json' },
  { script: 'regen-citation-index.mjs', out: 'src/lib/vetwiki/citation-index.generated.js' },
  { script: 'regen-conflict-summary.mjs', out: 'src/lib/vetwiki/conflict-summary.generated.js' },
  { script: 'regen-notes-registry.mjs', out: 'src/data/notes-registry.generated.js' },
  { script: 'regen-vetwiki-topic-registry.mjs', out: 'src/lib/vetwiki/topic-registry.generated.js' },
  { script: 'regen-vetwiki-runtime-data.mjs', out: 'src/lib/vetwiki/runtime-data.generated.js' },
  { script: 'regen-atlas-registry.mjs', out: 'src/data/atlas-assets.generated.js' },
];

function makeScratchRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-crlf-check-'));
  fs.cpSync(path.join(repo, 'src'), path.join(dir, 'src'), { recursive: true });
  fs.cpSync(path.join(repo, 'scripts'), path.join(dir, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'api', '_lib'), { recursive: true });
  // The atlas registry reads only the conversion ledgers, not the models.
  fs.mkdirSync(path.join(dir, 'public', 'atlas'), { recursive: true });
  for (const name of fs.readdirSync(path.join(repo, 'public', 'atlas'))) {
    if (name.endsWith('-provenance.json')) {
      fs.copyFileSync(path.join(repo, 'public', 'atlas', name), path.join(dir, 'public', 'atlas', name));
    }
  }
  fs.writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}\n');
  return dir;
}

const run = (dir, script, ...args) => new Promise((resolve) => {
  const child = spawn(process.execPath, [`scripts/${script}`, ...args], { cwd: dir });
  let output = '';
  child.stdout.on('data', (b) => { output += b; });
  child.stderr.on('data', (b) => { output += b; });
  child.on('close', (status) => resolve({ status, output }));
});

const fingerprint = (file) => ({
  sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
  mtimeMs: fs.statSync(file).mtimeMs,
});

// A real content change: one letter past the middle of the file changes case.
function drift(text) {
  const at = text.slice(Math.floor(text.length / 2)).search(/[a-z]/);
  assert.ok(at >= 0, 'the file must have a letter to change');
  const i = Math.floor(text.length / 2) + at;
  return text.slice(0, i) + text[i].toUpperCase() + text.slice(i + 1);
}

test('sameGenerated forgives CRLF and the Built stamp, and nothing else', async () => {
  const { sameGenerated } = await import('../../scripts/lib/same-generated.mjs');
  assert.equal(sameGenerated('a\r\nb\r\n', 'a\nb\n'), true, 'CRLF against LF');
  assert.equal(sameGenerated('x\n// Built: 2020-01-01\ny\n', 'x\n// Built: 2026-09-23\ny\n'), true, 'another build time');
  assert.equal(sameGenerated('a\rb\n', 'a\nb\n'), false, 'a lone CR is a change');
  assert.equal(sameGenerated('a\nb\n', 'a\nc\n'), false, 'a changed character');
  assert.equal(sameGenerated('a\nb\n', 'a\nb \n'), false, 'trailing whitespace is a change');
  assert.equal(sameGenerated('a\nb\n', 'a\nb'), false, 'a missing final newline is a change');
  assert.equal(sameGenerated('a\n', 'a\n// Built: now\n'), false, 'a Built line that is not in the other copy');
  assert.equal(sameGenerated('', 'a\n'), false, 'a missing file is stale');
});

let scratch;
test.before(() => { scratch = makeScratchRepo(); });
test.after(() => { if (scratch) fs.rmSync(scratch, { recursive: true, force: true }); });

// Generators that others import: build them first, in regen:all order, so a
// generator never reads an input that is being rewritten beside it.
const INPUTS = ['regen-bank-registry.mjs', 'regen-question-delivery.mjs', 'regen-exam-papers.mjs'];

test('every generator --check passes a CRLF copy of its own output and writes nothing', async () => {
  for (const script of INPUTS) {
    const r = await run(scratch, script);
    assert.equal(r.status, 0, `${script} (write): ${r.output}`);
  }
  const rest = GENERATORS.filter(({ script }) => !INPUTS.includes(script));
  const built = await Promise.all(rest.map(({ script }) => run(scratch, script)));
  built.forEach((r, i) => assert.equal(r.status, 0, `${rest[i].script} (write): ${r.output}`));

  const before = GENERATORS.map(({ out }) => {
    const file = path.join(scratch, out);
    const lf = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    fs.writeFileSync(file, lf.replace(/\n/g, '\r\n'), 'utf8');
    return fingerprint(file);
  });

  const checked = await Promise.all(GENERATORS.map(({ script }) => run(scratch, script, '--check')));
  const stale = checked
    .map((r, i) => ({ ...r, script: GENERATORS[i].script }))
    .filter((r) => r.status !== 0)
    .map((r) => `${r.script}: ${r.output.trim()}`);
  assert.deepEqual(stale, [], 'a CRLF checkout of fresh output was called stale');
  GENERATORS.forEach(({ out, script }, i) => {
    assert.deepEqual(fingerprint(path.join(scratch, out)), before[i], `${script} --check rewrote ${out}`);
  });
});

test('every generator --check still fails on a real content change, CRLF or not, and repairs nothing', async () => {
  const before = GENERATORS.map(({ out }) => {
    const file = path.join(scratch, out);
    fs.writeFileSync(file, drift(fs.readFileSync(file, 'utf8')), 'utf8');
    return fingerprint(file);
  });

  const checked = await Promise.all(GENERATORS.map(({ script }) => run(scratch, script, '--check')));
  const missed = checked
    .map((r, i) => ({ ...r, script: GENERATORS[i].script }))
    .filter((r) => r.status === 0)
    .map((r) => r.script);
  assert.deepEqual(missed, [], 'these checks passed a file whose content had changed');
  GENERATORS.forEach(({ out, script }, i) => {
    assert.deepEqual(fingerprint(path.join(scratch, out)), before[i], `${script} --check rewrote ${out}`);
  });
});
