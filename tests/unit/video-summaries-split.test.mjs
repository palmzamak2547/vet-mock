// ============================================================
// video-summaries-split.test.mjs — the generated summary corpus
// ============================================================
// scripts/rebuild-video-summaries.mjs owns src/data/video-summaries-*.js and
// the lazy barrel. It exists because the corpus had drifted: seven Clin
// Ruminant summaries sat inside the poultry file, so the ruminant student saw
// none of them and the poultry student saw eight lectures from other courses.
// `npm run lint:video-corpus` runs it with --check, and --check used to exit
// 0 whatever it found, so that drift had no gate.
//
// The check runs here against a scratch copy of the script and a corpus the
// test writes, and once against the real tree.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SCRIPT = join(ROOT, 'scripts', 'rebuild-video-summaries.mjs');

const constName = (subject) => 'VIDEO_SUMMARIES_' + subject.toUpperCase().replace(/-/g, '_');

const entry = (videoId, subject, extra = {}) => ({
  videoId,
  title: 'Lecture ' + videoId,
  subject,
  date: '2026-09-01',
  durationMin: 60,
  instructor: null,
  examFormat: null,
  summary: '# ' + videoId + '\n\nเนื้อหาสรุป `code` and ${not an interpolation}',
  ...extra,
});

// A per-subject file as a person might leave it: plain JS, not the
// generator's own layout.
const subjectFile = (subject, entries) =>
  'export const ' + constName(subject) + ' = '
  + JSON.stringify(Object.fromEntries(entries.map((e) => [e.videoId, e])), null, 2) + ';\n';

// A repository with only what the script touches: the script itself, the
// per-subject files and, when asked for, a staged batch.
function scratch(files) {
  const root = mkdtempSync(join(tmpdir(), 'vmx-video-corpus-'));
  mkdirSync(join(root, 'scripts'));
  mkdirSync(join(root, 'src', 'data'), { recursive: true });
  copyFileSync(SCRIPT, join(root, 'scripts', 'rebuild-video-summaries.mjs'));
  const write = (name, text) => writeFileSync(join(root, 'src', 'data', name), text);
  for (const [name, text] of Object.entries(files)) write(name, text);
  return {
    root,
    write,
    stage(name, text, { checked = false } = {}) {
      mkdirSync(join(root, 'data-cache', 'generated'), { recursive: true });
      writeFileSync(join(root, 'data-cache', 'generated', name), text);
      if (checked) writeFileSync(join(root, 'data-cache', 'fact-checked.txt'), name.replace(/\.(md|json)$/, '') + '\n', { flag: 'a' });
    },
    run: (...args) => spawnSync(process.execPath, [join(root, 'scripts', 'rebuild-video-summaries.mjs'), ...args], { encoding: 'utf8' }),
    done: () => rmSync(root, { recursive: true, force: true }),
  };
}

// Two subjects, written and then rebuilt once so every generated file the
// check compares against exists.
function cleanCorpus() {
  const s = scratch({
    'video-summaries-alpha.js': subjectFile('alpha', [entry('a1', 'alpha'), entry('-a2', 'alpha', { duration: '1 ชม.' })]),
    'video-summaries-beta.js': subjectFile('beta', [entry('b1', 'beta')]),
  });
  const built = s.run();
  assert.equal(built.status, 0, built.stdout + built.stderr);
  return s;
}

const staged = (videoId, subject) => [
  '---',
  'videoId: ' + videoId,
  'title: Staged ' + videoId,
  'subject: ' + subject,
  'date: 2026-09-20',
  'durationMin: 90',
  'instructor:',
  'examFormat:',
  '---',
  '# ' + videoId,
  '',
  'ร่างสรุป',
].join('\n');

// ── the check ────────────────────────────────────────────────────────

test('the current tree passes the corpus check', () => {
  const r = spawnSync(process.execPath, [SCRIPT, '--check'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('a clean corpus passes, with or without a staged batch', () => {
  const s = cleanCorpus();
  try {
    const bare = s.run('--check');
    assert.equal(bare.status, 0, bare.stdout + bare.stderr);
    // data-cache/ is gitignored and absent on CI; what is staged there must
    // not decide whether the local gate is green.
    s.stage('n1.md', staged('n1', 'alpha'));
    s.stage('n2.md', staged('n2', 'gamma'), { checked: true });
    const withBatch = s.run('--check');
    assert.equal(withBatch.status, 0, withBatch.stdout + withBatch.stderr);
    assert.match(withBatch.stdout, /new from cache\s*: 1/);
    s.stage('broken.md', 'no front matter at all');
    const withDraft = s.run('--check');
    assert.equal(withDraft.status, 0, 'an unreadable draft in staging is not a shipped-corpus failure\n' + withDraft.stdout + withDraft.stderr);
  } finally { s.done(); }
});

test('an entry moved into another subject\'s file fails the check and is named', () => {
  const s = cleanCorpus();
  try {
    s.write('video-summaries-alpha.js', subjectFile('alpha', [entry('-a2', 'alpha', { duration: '1 ชม.' })]));
    s.write('video-summaries-beta.js', subjectFile('beta', [entry('a1', 'alpha'), entry('b1', 'beta')]));
    const r = s.run('--check');
    assert.equal(r.status, 1, r.stdout + r.stderr);
    const out = r.stdout + r.stderr;
    assert.match(out, /a1/);
    assert.match(out, /video-summaries-beta\.js/);
    assert.doesNotMatch(out, /\bb1\b.*misfiled|misfiled.*\bb1\b/);
  } finally { s.done(); }
});

test('an entry filed under a subject with no file of its own fails the check', () => {
  const s = cleanCorpus();
  try {
    s.write('video-summaries-beta.js', subjectFile('beta', [entry('b1', 'beta'), entry('g1', 'gamma')]));
    const r = s.run('--check');
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stdout + r.stderr, /g1 \(gamma\)/);
  } finally { s.done(); }
});

test('a rebuild files a misplaced entry back under its subject', () => {
  const s = cleanCorpus();
  try {
    s.write('video-summaries-beta.js', subjectFile('beta', [entry('a1', 'alpha'), entry('b1', 'beta')]));
    s.write('video-summaries-alpha.js', subjectFile('alpha', [entry('-a2', 'alpha', { duration: '1 ชม.' })]));
    const rebuilt = s.run();
    assert.equal(rebuilt.status, 0, rebuilt.stdout + rebuilt.stderr);
    const r = s.run('--check');
    assert.equal(r.status, 0, r.stdout + r.stderr);
  } finally { s.done(); }
});
