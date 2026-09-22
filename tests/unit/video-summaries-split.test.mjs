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
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

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

test('a rebuild still refuses an unreadable draft and writes nothing', () => {
  const s = cleanCorpus();
  try {
    const alpha = join(s.root, 'src', 'data', 'video-summaries-alpha.js');
    const before = readFileSync(alpha, 'utf8');
    s.stage('n1.md', staged('n1', 'alpha'), { checked: true });
    s.stage('broken.md', 'no front matter at all');
    const r = s.run();
    assert.notEqual(r.status, 0, 'only --check may pass over a broken draft\n' + r.stdout + r.stderr);
    assert.equal(readFileSync(alpha, 'utf8'), before, 'the good draft beside it must not ship on its own');
    assert.equal(existsSync(join(s.root, 'src', 'data', 'video-summary-clips', 'n1.js')), false);
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

// ── one module per clip ──────────────────────────────────────────────
// Opening one summary used to download every summary of that subject: the
// loader imported the whole subject file, 1.1 to 1.9 MB for aquatic, equine
// medicine and zoonoses, when most clips' own summary is 1 to 3 KB. The
// generator now also writes one module per clip, the barrel imports only the
// clip asked for, and a whole-subject load is composed of those clips.

const DATA = join(ROOT, 'src', 'data');
const CLIP_DIR = join(DATA, 'video-summary-clips');
const BARREL = join(DATA, 'video-summaries.js');

let shippedCache = null;
async function shipped() {
  if (shippedCache) return shippedCache;
  const byId = new Map();
  const bySubject = new Map();
  for (const f of readdirSync(DATA).filter((n) => /^video-summaries-.+\.js$/.test(n) && !n.includes('meta')).sort()) {
    const mod = await import(pathToFileURL(join(DATA, f)).href);
    const subject = f.slice('video-summaries-'.length, -3);
    for (const obj of Object.values(mod)) {
      bySubject.set(subject, obj);
      for (const [id, e] of Object.entries(obj)) byId.set(id, e);
    }
  }
  shippedCache = { byId, bySubject };
  return shippedCache;
}

// The bytes a clip's entry is made of, without any module around it.
const ownBytes = (e) => Buffer.byteLength(e.summary) + Buffer.byteLength(JSON.stringify({ ...e, summary: '' }));

test('every shipped summary has its own module, identical to its subject entry', async () => {
  const { byId } = await shipped();
  const files = readdirSync(CLIP_DIR).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3)).sort();
  assert.deepEqual(files, [...byId.keys()].sort(), 'one clip module per entry and none left over; run node scripts/rebuild-video-summaries.mjs');
  for (const [id, e] of byId) {
    const clip = await import(pathToFileURL(join(CLIP_DIR, id + '.js')).href);
    assert.deepStrictEqual(clip.default, e, id + ' differs from its subject file; run node scripts/rebuild-video-summaries.mjs');
  }
});

test('a clip module carries its own entry and a small wrapper, nothing more', async () => {
  const { byId } = await shipped();
  let largest = null;
  for (const [id, e] of byId) {
    // Counted as committed (LF), so a Windows CRLF checkout measures the same.
    const bytes = Buffer.byteLength(readFileSync(join(CLIP_DIR, id + '.js'), 'utf8').replace(/\r\n/g, '\n'));
    const own = ownBytes(e);
    assert.ok(bytes <= own * 1.05 + 1024, `${id}: ${bytes} B on disk for a ${own} B entry`);
    if (own < 3 * 1024) assert.ok(bytes < 10 * 1024, `${id}: a small clip must stay well under 10 KB`);
    if (!largest || own > largest.own) largest = { id, own, bytes };
  }
  assert.ok(largest.bytes < largest.own * 1.05 + 1024, 'the largest clip pulls only itself');
});

test('the barrel imports one clip for one clip, and never a whole subject file', async () => {
  const { byId } = await shipped();
  const barrel = readFileSync(BARREL, 'utf8');
  assert.doesNotMatch(barrel, /import\('\.\/video-summaries-/, 'a loader that imports a subject file downloads every summary in it');
  const loaders = [...barrel.matchAll(/^ {2}'([^']+)': \(\) => import\('\.\/video-summary-clips\/([^']+)\.js'\),\r?$/gm)];
  assert.equal(loaders.length, byId.size);
  for (const [, key, file] of loaders) assert.equal(file, key, `the loader for ${key} imports ${file}`);

  const { loadVideoSummaryClip } = await import(pathToFileURL(BARREL).href);
  const [id, entry] = [...byId].sort((a, b) => ownBytes(b[1]) - ownBytes(a[1]))[0];
  assert.deepStrictEqual(await loadVideoSummaryClip(id), entry);
  assert.equal(await loadVideoSummaryClip('notAClip000'), null);
  assert.equal(await loadVideoSummaryClip('constructor'), null, 'an id is looked up, not an inherited property');
  assert.equal(await loadVideoSummaryClip(undefined), null);
});

test('whole-subject loads are built from the clips and match the subject files', async () => {
  const { byId, bySubject } = await shipped();
  const barrel = await import(pathToFileURL(BARREL).href);
  assert.deepEqual([...barrel.VIDEO_SUMMARY_SUBJECTS], [...bySubject.keys()].sort());
  for (const [subject, obj] of bySubject) {
    assert.deepStrictEqual(await barrel.loadVideoSummariesForSubject(subject), obj, subject);
  }
  const all = await barrel.loadAllVideoSummaries();
  assert.equal(Object.keys(all).length, byId.size);
  assert.deepEqual(await barrel.loadVideoSummariesForSubject('no-such-subject'), {});
  assert.deepEqual(await barrel.loadVideoSummariesForSubject('constructor'), {});
});

// The barrel's clip cache, cut from the generated source and run with
// loaders the test controls.
function clipCache(loaders) {
  const src = readFileSync(BARREL, 'utf8').replace(/\r\n/g, '\n');
  const a = src.indexOf('const has = (map, key) =>');
  const b = src.indexOf('\n}\n', src.indexOf('export function loadVideoSummaryClip('));
  assert.ok(a !== -1 && b !== -1, 'the barrel must keep its clip cache and loadVideoSummaryClip');
  const ctx = { _clipLoaders: loaders };
  vm.createContext(ctx);
  return vm.runInContext(src.slice(a, b + 3).replace('export function', 'function') + '\nloadVideoSummaryClip', ctx);
}

test('a clip that failed to load is asked for again on the next tap', async () => {
  let attempts = 0;
  const loaded = { videoId: 'x', summary: 's' };
  const load = clipCache({
    x: () => (++attempts === 1
      ? Promise.reject(new Error('Failed to fetch dynamically imported module'))
      : Promise.resolve({ default: loaded })),
  });
  await assert.rejects(load('x'), /dynamically imported module/);
  assert.equal(await load('x'), loaded, 'the failure must not be kept for the rest of the tab');
  assert.equal(attempts, 2);
  await load('x');
  assert.equal(attempts, 2, 'a loaded clip is not fetched again');
});

test('two taps on one clip share one request', async () => {
  let attempts = 0;
  const load = clipCache({ x: () => { attempts += 1; return Promise.resolve({ default: { videoId: 'x' } }); } });
  const [a, b] = await Promise.all([load('x'), load('x')]);
  assert.equal(a, b);
  assert.equal(attempts, 1);
});

// ── the check guards the generated clips ─────────────────────────────

const clipDir = (s) => join(s.root, 'src', 'data', 'video-summary-clips');

test('a clip module out of step with its subject file fails the check and is named', () => {
  const s = cleanCorpus();
  try {
    s.write('video-summaries-alpha.js', subjectFile('alpha', [
      entry('a1', 'alpha', { summary: 'แก้ในไฟล์วิชาแล้ว แต่ยังไม่ได้ rebuild' }),
      entry('-a2', 'alpha', { duration: '1 ชม.' }),
    ]));
    const r = s.run('--check');
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stdout + r.stderr, /\ba1\b/);
    assert.doesNotMatch(r.stdout, /^ {3}-a2$/m, 'an unchanged clip is not reported');
    const rebuilt = s.run();
    assert.equal(rebuilt.status, 0, rebuilt.stdout + rebuilt.stderr);
    assert.equal(s.run('--check').status, 0);
  } finally { s.done(); }
});

test('a clip module with no entry behind it fails the check, and a rebuild removes it', () => {
  const s = cleanCorpus();
  try {
    writeFileSync(join(clipDir(s), 'gone1.js'), 'export default { videoId: "gone1" };\n');
    const r = s.run('--check');
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stdout + r.stderr, /gone1/);
    assert.equal(s.run().status, 0);
    assert.equal(existsSync(join(clipDir(s), 'gone1.js')), false);
    assert.equal(s.run('--check').status, 0);
  } finally { s.done(); }
});

test('a hand-edited barrel fails the check', () => {
  const s = cleanCorpus();
  try {
    const path = join(s.root, 'src', 'data', 'video-summaries.js');
    writeFileSync(path, readFileSync(path, 'utf8').replace("'beta': ['b1']", "'beta': ['b1', 'b2']"));
    const r = s.run('--check');
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stdout + r.stderr, /video-summaries\.js/);
  } finally { s.done(); }
});

test('the scratch rebuild writes clips identical to their entries', async () => {
  const s = cleanCorpus();
  try {
    const clip = await import(pathToFileURL(join(clipDir(s), '-a2.js')).href);
    assert.deepStrictEqual(clip.default, entry('-a2', 'alpha', { duration: '1 ชม.' }));
    const barrel = await import(pathToFileURL(join(s.root, 'src', 'data', 'video-summaries.js')).href);
    assert.deepStrictEqual(await barrel.loadVideoSummariesForSubject('alpha'), {
      a1: entry('a1', 'alpha'),
      '-a2': entry('-a2', 'alpha', { duration: '1 ชม.' }),
    });
  } finally { s.done(); }
});

test('two ids that differ only in case stop the rebuild', () => {
  const s = scratch({
    'video-summaries-alpha.js': subjectFile('alpha', [entry('abcDEF', 'alpha'), entry('ABCdef', 'alpha')]),
  });
  try {
    const r = s.run();
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stderr, /abcDEF/);
    assert.match(r.stderr, /ABCdef/);
  } finally { s.done(); }
});
