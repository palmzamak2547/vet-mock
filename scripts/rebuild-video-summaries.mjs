#!/usr/bin/env node
/**
 * rebuild-video-summaries.mjs
 *
 * One generator owns the per-subject summary files, the lazy barrel and the
 * subject list they share. Before this existed the split was a one-shot
 * migration off a monolith that no longer exists, and it had drifted: seven
 * `cliapprum` summaries and one `com1` summary were sitting inside
 * video-summaries-poultry.js, so loadVideoSummariesForSubject('cliapprum')
 * returned nothing while the Clin Ruminant student had seven summaries on
 * disk — and the poultry student was shown eight lectures from other courses.
 *
 * It also writes one module per clip, src/data/video-summary-clips/<id>.js,
 * which is what the app imports: opening one summary used to download every
 * summary of its subject. The subject files stay the source every script and
 * lint reads, so after editing one in place, rebuild; --check fails until
 * the clip modules match again.
 *
 * Sources, in precedence order:
 *   1. the existing src/data/video-summaries-*.js entries (authoritative)
 *   2. data-cache/generated/<videoId>.json  (newly written summaries)
 * An id already present in (1) is never overwritten by (2), so re-running a
 * generation pass cannot silently rewrite a summary that already shipped.
 *
 * Usage:
 *   node scripts/rebuild-video-summaries.mjs            # rebuild in place
 *   node scripts/rebuild-video-summaries.mjs --check    # report only, no write;
 *     exits 1 when a shipped entry is not under its own subject
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'src', 'data');
// Outside the video-summaries-*.js pattern on purpose: every script and lint
// that reads the subject files lists src/data by that pattern, and must not
// count each summary twice.
const CLIP_DIR_NAME = 'video-summary-clips';
const CLIPS = path.join(DATA, CLIP_DIR_NAME);
const GENERATED = path.join(ROOT, 'data-cache', 'generated');
const checkOnly = process.argv.includes('--check');

// Correcting a summary that has already shipped: without this the fix sits in
// data-cache/generated/ and the rebuild quietly keeps the old text, because an
// id already in src/data is never overwritten. Naming the id here is the
// supported way to pull the corrected file back in.
//   node scripts/rebuild-video-summaries.mjs --refresh <id>[,<id>...]
const refreshArg = process.argv.indexOf('--refresh');
const refresh = new Set(
  refreshArg === -1 ? [] : (process.argv[refreshArg + 1] || '').split(',').map((s) => s.trim()).filter(Boolean),
);

// Ship one subject per commit, which is how this content is reviewed and how
// the cohort reads it. Staging holds work from several subjects at once, so
// without this a release of Milk would also carry whichever avian and food
// lectures happened to be finished that hour.
//   node scripts/rebuild-video-summaries.mjs --only milk-meat-hygiene
// Existing entries are untouched either way; this only narrows what is taken
// from data-cache/generated/.
const onlyArg = process.argv.indexOf('--only');
const only = new Set(
  onlyArg === -1 ? [] : (process.argv[onlyArg + 1] || '').split(',').map((s) => s.trim()).filter(Boolean),
);

const FIELDS = ['videoId', 'title', 'subject', 'date', 'durationMin', 'instructor', 'examFormat'];

const constName = (subject) => 'VIDEO_SUMMARIES_' + subject.toUpperCase().replace(/-/g, '_');

// Every entry, and the file each one was found in. The map alone cannot say
// that an entry sits in another subject's file, which is the drift --check
// exists to catch.
async function readExisting() {
  const files = fs.readdirSync(DATA).filter((f) => /^video-summaries-.+\.js$/.test(f) && !f.includes('meta'));
  const entries = new Map();
  const placements = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(path.join(DATA, f)).href);
    for (const key of Object.keys(mod)) {
      const obj = mod[key];
      if (!obj || typeof obj !== 'object') continue;
      for (const [id, entry] of Object.entries(obj)) {
        entries.set(id, entry);
        placements.push({ id, subject: entry?.subject, file: f });
      }
    }
  }
  return { entries, placements };
}

// Front matter + raw body. Summaries are written this way rather than as JSON
// because escaping a 30k-character markdown body into a JSON string pushed the
// writers into shelling out, and one of them wrote the same file eight times.
// Values are single-line; an empty value means "not recorded", not "".
function parseFrontMatter(text, name) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text.replace(/^﻿/, '').trimStart());
  if (!m) throw new Error(name + ': no front matter block');
  // Normalise the body's line endings. A summary edited on Windows comes back
  // with CRLF while the generated module stores LF, and the round-trip check
  // then reports drift on four files whose text is character-for-character
  // identical — a real failure signal wasted on an invisible difference.
  const entry = { summary: m[2].replace(/\r\n/g, '\n').trim() };
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    if (!key) continue;
    entry[key] = value === '' ? null : value;
  }
  if (entry.durationMin != null) {
    const n = parseInt(String(entry.durationMin).replace(/[^0-9]/g, ''), 10);
    entry.durationMin = Number.isFinite(n) ? n : null;
  }
  return entry;
}

// Nothing reaches src/data without a fact-check on record.
//
// The summaries are built from recordings of the cohort's own lectures, and a
// pass that does not reopen the audio misses the defects that matter: a header
// that groups a disease the lecturer never grouped, a table cell filled from a
// phrase she used two minutes later about a different row, a quote that gained
// a "ไม่". Every checked lecture so far has produced between seven and eleven
// of these. A staged file is therefore a draft, and drafts share a directory
// with finished work.
//
// data-cache/fact-checked.txt is the list of ids somebody has read against the
// audio. It used to be advisory, printed by npm run video:progress, which made
// it a note rather than a rule — and the generator would happily sweep the whole
// staging directory into a release. Now it is the door. To ship a summary, put
// its id in the ledger; that is the honest action, because the ledger is a claim
// that the work was done.
//
// The ledger lives under data-cache/, which is untracked, like the staged files
// it governs. A fresh clone therefore has an empty ledger and ships nothing from
// staging until someone does the checking — the right way round for a default.
const CHECKED = (() => {
  const p = path.join(ROOT, 'data-cache', 'fact-checked.txt');
  if (!fs.existsSync(p)) return new Set();
  return new Set(
    fs.readFileSync(p, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#')),
  );
})();

function readGenerated(existing) {
  const added = [];
  const skipped = [];
  const unchecked = [];
  if (!fs.existsSync(GENERATED)) return { added, skipped, unchecked };
  const files = fs.readdirSync(GENERATED).filter((n) => n.endsWith('.json') || n.endsWith('.md'));
  for (const f of files) {
    const text = fs.readFileSync(path.join(GENERATED, f), 'utf8');
    const raw = f.endsWith('.md') ? parseFrontMatter(text, f) : JSON.parse(text);
    if (!raw.videoId) raw.videoId = f.replace(/\.(json|md)$/, '');
    if (!raw || !raw.videoId || !raw.subject || !raw.summary) throw new Error(f + ': missing required fields');
    if (existing.has(raw.videoId) && !refresh.has(raw.videoId)) { skipped.push(raw.videoId); continue; }
    if (only.size && !only.has(raw.subject)) continue;
    if (!CHECKED.has(raw.videoId)) { unchecked.push(raw.videoId); continue; }
    // "absent" has one representation here. An empty string for instructor or
    // examFormat renders as a blank row in the UI instead of being omitted,
    // and reads in the data as though something was recorded when nothing was.
    for (const k of ['date', 'instructor', 'examFormat']) {
      if (typeof raw[k] === 'string' && raw[k].trim() === '') raw[k] = null;
    }
    added.push(raw);
  }
  return { added, skipped, unchecked };
}

// The summary body is markdown that legitimately contains backticks and $.
// Keep it a template literal so the source stays readable, and escape only
// what would end the literal or open an interpolation.
function tpl(s) {
  const escaped = String(s)
    .split('\\').join('\\\\')
    .split('`').join('\\`')
    .split('${').join('\\${');
  return '`' + escaped + '`';
}
const lit = (v) => (v === null || v === undefined ? 'null' : JSON.stringify(v));

// Emit every field the entry actually carries, not a fixed list: 18 of the
// existing entries record `duration` as free text and have no `durationMin`,
// and a generator that only knew FIELDS would drop that on the floor while
// reporting a clean round trip.
function fieldsOf(e) {
  const rest = Object.keys(e).filter((k) => !FIELDS.includes(k) && k !== 'summary');
  return FIELDS.filter((f) => f in e).concat(rest);
}

// One entry's fields exactly as they are written, shared by the subject files
// and the clip modules so the two can never hold different values.
function renderEntry(e, indent) {
  const fields = fieldsOf(e).map((f) => indent + f + ': ' + lit(e[f] === undefined ? null : e[f]) + ',').join('\n');
  return fields + '\n' + indent + 'summary: ' + tpl(e.summary) + ',';
}

function renderFile(subject, ids, entries) {
  const body = ids.map((id) => '  ' + JSON.stringify(id) + ': {\n' + renderEntry(entries.get(id), '    ') + '\n  },').join('\n');
  return [
    '// ============================================================',
    '// VIDEO SUMMARIES — subject="' + subject + '" (' + ids.length + ' entries)',
    '// ============================================================',
    '// Generated by scripts/rebuild-video-summaries.mjs.',
    '// DO NOT hand-edit: the generator owns this file, the barrel in',
    '// video-summaries.js and the subject list they share, so an edit',
    '// here is silently reverted on the next run.',
    '// ============================================================',
    '',
    'export const ' + constName(subject) + ' = {',
    body,
    '};',
    '',
  ].join('\n');
}

// One module per clip, so opening one summary downloads that summary and
// nothing else. The subject files stay the source every script and lint
// reads; these are copies the app imports, rewritten on every rebuild and
// compared by --check.
function renderClip(e) {
  return [
    '// Generated by scripts/rebuild-video-summaries.mjs from',
    '// video-summaries-' + e.subject + '.js. DO NOT hand-edit: change the subject file',
    '// and rebuild, or the next run puts this back.',
    'export default {',
    renderEntry(e, '  '),
    '};',
    '',
  ].join('\n');
}

const quote = (s) => "'" + s + "'";

function renderBarrel(subjects, bySubject) {
  const ids = subjects.flatMap((s) => bySubject.get(s)).sort();
  const loaders = ids.map((id) => '  ' + quote(id) + ': () => import(' + quote('./' + CLIP_DIR_NAME + '/' + id + '.js') + '),').join('\n');
  const lists = subjects.map((s) => '  ' + quote(s) + ': [' + bySubject.get(s).map(quote).join(', ') + '],').join('\n');
  return [
    '// ============================================================',
    '// VIDEO SUMMARIES — lazy barrel',
    '// ============================================================',
    '// Every summary is its own module (' + CLIP_DIR_NAME + '/<videoId>.js), so',
    '// opening one downloads that summary and nothing else. It used to import',
    '// the whole subject file: 1.1 to 1.9 MB for the heaviest subjects, for a',
    '// summary that is usually 1 to 3 KB. A whole-subject load is composed of',
    '// the same clip modules, so both paths share one cache.',
    '//',
    '// Generated by scripts/rebuild-video-summaries.mjs — every shipped',
    '// summary appears here. The per-subject files remain the source that',
    '// scripts and lints read; `npm run lint:video-corpus` fails when this',
    '// file or a clip module no longer matches them.',
    '// ============================================================',
    '',
    'const _clipLoaders = {',
    loaders,
    '};',
    '',
    'const _subjectClips = {',
    lists,
    '};',
    '',
    'const has = (map, key) => Object.prototype.hasOwnProperty.call(map, key);',
    '',
    'const _cache = new Map();',
    '',
    '// One clip\'s summary, or null when there is none. The import is shared while',
    '// it is in flight and kept once it has loaded. A failed one is forgotten, so',
    '// the next tap after the connection comes back asks again instead of being',
    '// handed the same failure for the rest of the tab.',
    'export function loadVideoSummaryClip(videoId) {',
    '  if (!has(_clipLoaders, videoId)) return Promise.resolve(null);',
    '  if (!_cache.has(videoId)) {',
    '    const pending = _clipLoaders[videoId]().then((m) => m.default);',
    '    _cache.set(videoId, pending);',
    '    pending.catch(() => { if (_cache.get(videoId) === pending) _cache.delete(videoId); });',
    '  }',
    '  return _cache.get(videoId);',
    '}',
    '',
    'export function loadVideoSummariesForSubject(subject) {',
    '  if (!has(_subjectClips, subject)) return Promise.resolve({});',
    '  const ids = _subjectClips[subject];',
    '  return Promise.all(ids.map((id) => loadVideoSummaryClip(id)))',
    '    .then((entries) => Object.fromEntries(ids.map((id, i) => [id, entries[i]])));',
    '}',
    '',
    'export function loadAllVideoSummaries() {',
    '  const subjects = Object.keys(_subjectClips);',
    '  return Promise.all(subjects.map((s) => loadVideoSummariesForSubject(s)))',
    '    .then((maps) => Object.assign({}, ...maps));',
    '}',
    '',
    'export const VIDEO_SUMMARY_SUBJECTS = Object.keys(_subjectClips);',
    '',
  ].join('\n');
}

// Group entries by subject, ids sorted, the order every generated file uses.
function group(entries) {
  const bySubject = new Map();
  for (const [id, e] of entries) {
    if (!e.subject) throw new Error(id + ': entry has no subject');
    if (!bySubject.has(e.subject)) bySubject.set(e.subject, []);
    bySubject.get(e.subject).push(id);
  }
  const subjects = [...bySubject.keys()].sort();
  for (const s of subjects) bySubject.get(s).sort();
  return { subjects, bySubject };
}

// A clip id becomes a file name. It has to be one that every file system
// keeps apart: Windows and macOS do not tell `abcDEF.js` from `ABCdef.js`, and
// one clip would silently overwrite the other.
function clipIdProblems(ids) {
  const problems = [];
  const seen = new Map();
  for (const id of [...ids].sort()) {
    if (!/^[A-Za-z0-9_-]+$/.test(id)) problems.push(id + ' cannot be a file name');
    const folded = id.toLowerCase();
    if (seen.has(folded)) problems.push(seen.get(folded) + ' and ' + id + ' differ only in case');
    else seen.set(folded, id);
  }
  return problems;
}

// Text as it would compare after a checkout: a Windows working tree holds
// these files with CRLF, and that is not a difference.
function readText(file) {
  try { return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'); } catch { return null; }
}

// Leave a file alone when it already says the same thing, so a rebuild on a
// CRLF checkout does not rewrite 600-odd unchanged files.
function writeIfChanged(file, text) {
  if (readText(file) === text) return false;
  fs.writeFileSync(file, text);
  return true;
}

const { entries: existing, placements } = await readExisting();
const before = new Map(existing);
// --check judges the shipped corpus only. data-cache/ is gitignored and absent
// on CI, so a staged draft (finished, pending or broken) must not turn the
// local gate red while CI stays green. A rebuild still refuses a broken one.
let staging;
try {
  staging = readGenerated(existing);
} catch (err) {
  if (!checkOnly) throw err;
  console.log('staged batch unreadable, not judged by --check: ' + err.message);
  staging = { added: [], skipped: [], unchecked: [] };
}
const { added, skipped, unchecked } = staging;
for (const e of added) existing.set(e.videoId, e);

const { subjects, bySubject } = group(existing);

console.log('existing entries : ' + before.size);
console.log('new from cache   : ' + added.length + (skipped.length ? ' (' + skipped.length + ' already present, left alone)' : ''));
if (unchecked.length) {
  console.log('');
  console.log('HELD BACK, not fact-checked : ' + unchecked.length);
  for (const id of unchecked.sort()) console.log('   ' + id);
  console.log('');
  console.log('These are staged but their ids are not in data-cache/fact-checked.txt,');
  console.log('so they were not written to src/data. Fact-check them against');
  console.log('data-cache/plain/<id>.txt, then append the id to that file.');
}
console.log('total after      : ' + existing.size);
console.log('subjects         : ' + subjects.length + ' — ' + subjects.join(' '));

const homeless = [];
for (const [id, e] of before) {
  if (!fs.existsSync(path.join(DATA, 'video-summaries-' + e.subject + '.js'))) homeless.push(id + ' (' + e.subject + ')');
}
if (homeless.length) {
  console.log('entries filed under a subject with no file of its own: ' + homeless.length);
  for (const h of homeless.sort()) console.log('   ' + h);
}

// An entry inside another subject's file is invisible to its own subject's
// loader. A rebuild moves it home; --check reports it.
const misfiled = placements
  .filter((p) => 'video-summaries-' + p.subject + '.js' !== p.file)
  .map((p) => p.id + ' (' + p.subject + ') in ' + p.file)
  .sort();
if (misfiled.length) {
  console.log('entries sitting in another subject\'s file: ' + misfiled.length);
  for (const m of misfiled) console.log('   ' + m);
}

// The files the app actually imports, compared with what a rebuild would write
// from the shipped entries alone. A subject file edited in place (a bracket
// repair, a patch script) leaves its clip module behind until the next
// rebuild, and the student would go on reading the old text.
function generatedDrift(entries) {
  const shipped = group(entries);
  const stale = [...entries].filter(([id, e]) => readText(path.join(CLIPS, id + '.js')) !== renderClip(e)).map(([id]) => id);
  const orphans = fs.existsSync(CLIPS)
    ? fs.readdirSync(CLIPS).filter((f) => f.endsWith('.js') && !entries.has(f.slice(0, -3))).map((f) => f.slice(0, -3))
    : [];
  const barrel = readText(path.join(DATA, 'video-summaries.js')) !== renderBarrel(shipped.subjects, shipped.bySubject);
  return { stale: stale.sort(), orphans: orphans.sort(), barrel };
}

const listSome = (ids) => {
  for (const id of ids.slice(0, 20)) console.log('   ' + id);
  if (ids.length > 20) console.log('   …and ' + (ids.length - 20) + ' more');
};

if (checkOnly) {
  const failures = [];
  // One entry can be both (in another file, under a subject with none).
  const misplaced = new Set(homeless.concat(misfiled).map((line) => line.split(' ')[0])).size;
  if (misplaced) {
    failures.push(misplaced + (misplaced === 1 ? ' shipped entry is not filed under its own subject.'
      : ' shipped entries are not filed under their own subjects.')
      + ' Check the subject is not a typo, then run node scripts/rebuild-video-summaries.mjs,'
      + ' which files each entry under its subject.');
  }
  const idProblems = clipIdProblems(before.keys());
  if (idProblems.length) {
    console.log('clip ids that cannot be written as files: ' + idProblems.length);
    listSome(idProblems);
    failures.push('two clips would share one file on Windows and macOS; nothing else is judged until that is fixed.');
  } else {
    const drift = generatedDrift(before);
    if (drift.stale.length) {
      console.log('clip modules that no longer match their subject file: ' + drift.stale.length);
      listSome(drift.stale);
    }
    if (drift.orphans.length) {
      console.log('clip modules with no shipped entry behind them: ' + drift.orphans.length);
      listSome(drift.orphans);
    }
    if (drift.barrel) console.log('src/data/video-summaries.js no longer matches the shipped entries');
    if (drift.stale.length || drift.orphans.length || drift.barrel) {
      failures.push('the clip modules the app imports are out of date. Run node scripts/rebuild-video-summaries.mjs'
        + ' and commit what it writes.');
    }
  }
  if (failures.length) {
    console.error('\n--check: ' + failures.join('\n--check: '));
    process.exit(1);
  }
  console.log('\n--check: nothing written.');
  process.exit(0);
}

const idProblems = clipIdProblems(existing.keys());
if (idProblems.length) {
  console.error('\nclip ids that cannot be written as files:');
  for (const p of idProblems) console.error('   ' + p);
  console.error('Nothing was written.');
  process.exit(1);
}

for (const s of subjects) {
  writeIfChanged(path.join(DATA, 'video-summaries-' + s + '.js'), renderFile(s, bySubject.get(s), existing));
}
for (const f of fs.readdirSync(DATA)) {
  const m = /^video-summaries-(.+)\.js$/.exec(f);
  if (!m || f.includes('meta')) continue;
  if (!subjects.includes(m[1])) { fs.unlinkSync(path.join(DATA, f)); console.log('removed stale ' + f); }
}
fs.mkdirSync(CLIPS, { recursive: true });
let clipsWritten = 0;
for (const [id, e] of existing) {
  if (writeIfChanged(path.join(CLIPS, id + '.js'), renderClip(e))) clipsWritten++;
}
for (const f of fs.readdirSync(CLIPS)) {
  if (!f.endsWith('.js') || existing.has(f.slice(0, -3))) continue;
  fs.unlinkSync(path.join(CLIPS, f));
  console.log('removed stale ' + CLIP_DIR_NAME + '/' + f);
}
writeIfChanged(path.join(DATA, 'video-summaries.js'), renderBarrel(subjects, bySubject));
console.log('clip modules     : ' + existing.size + ' (' + clipsWritten + ' rewritten)');

// Round-trip: re-read what was just written and require it to match, field for
// field, what we held in memory. A generator that quietly drops or mangles a
// summary would otherwise look like a clean run. The clip modules are checked
// the same way, since they are what the app actually shows.
const reread = new Map();
for (const s of subjects) {
  const href = pathToFileURL(path.join(DATA, 'video-summaries-' + s + '.js')).href + '?v=' + existing.size + '-' + s;
  const mod = await import(href);
  for (const [id, e] of Object.entries(mod[constName(s)])) reread.set(id, e);
}
const rereadClips = new Map();
for (const id of existing.keys()) {
  const mod = await import(pathToFileURL(path.join(CLIPS, id + '.js')).href + '?v=' + existing.size + '-clip');
  rereadClips.set(id, mod.default);
}
let drift = 0;
for (const [label, copy] of [['', reread], ['clip ', rereadClips]]) {
  for (const [id, e] of existing) {
    const r = copy.get(id);
    if (!r) { console.error('LOST ' + label + id); drift++; continue; }
    // Compare the union of both sides' keys so an added OR dropped field shows.
    for (const f of new Set(Object.keys(e).concat(Object.keys(r)))) {
      const a = e[f] === undefined ? null : e[f];
      const b = r[f] === undefined ? null : r[f];
      if (a !== b) { console.error('DRIFT ' + label + id + '.' + f); drift++; }
    }
  }
}
if (drift) {
  console.error('\n' + drift + ' field(s) drifted — NOT safe, files left as written for inspection.');
  process.exit(1);
}
console.log('\nround-trip verified: ' + reread.size + ' entries and ' + rereadClips.size + ' clip modules identical after rewrite.');
