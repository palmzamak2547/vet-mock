#!/usr/bin/env node
// ============================================================
// mcv-sync.mjs — what MyCourseVille has that the library does not, in one command
// ============================================================
//
//   npm run mcv:sync                what is new, and the fate each file would get. Changes nothing.
//   npm run mcv:sync -- --shelve    shelves what passes every gate, holds the rest, says what it did.
//
//   --term=2026/1     a term other than the newest one that has courses
//   --dump=<file>     a listing already on disk, instead of asking the bridge
//   --report=<file>   where the JSON report goes (default .mcv/sync-report.json)
//
// Exit 0 when the run completed, whatever it held; 1 when a course did not list,
// a file failed to shelve or a follow-up step stopped; 2 when it could not run.
//
// A pull used to be five steps done by hand: dump the listing, diff it against
// the previous dump file, build a manifest, review it, ingest. The diff needed a
// file from the last pull to exist, and the review needed a person each time.
// This wires the same tools together and keeps no state of its own:
//
//   the bridge's `cli.py dump`      the term's courses and material listings
//   mcv-manifest.mjs                listing -> items; score announcements left out
//   library_docs, read in full      the base of the diff: a file is known by its
//                                   upload URL, then by its bytes (sha256_16)
//   library-pages.py check          a PDF's text, read before it is shelved, and
//                                   its fingerprint against library_doc_pages
//   ingest-library.mjs              the R2 object, the catalog row, the rights gate
//   library-pages.py extract, load  page text, once rows are in
//   library-links.mjs propose, apply  topic links
//
// Every run reads MyCourseVille and the catalog afresh, so nothing is lost when
// a folder is wiped, and a second run finds the first one's rows and stops.
//
// A FILE IS SHELVED ONLY WHEN ALL OF THIS HOLDS. Anything else is held with its
// reason and left for a person; the manual path (a reviewed manifest through
// ingest-library.mjs) still exists for those.
//   1. MyCourseVille hosts it. An external link has no file to mirror.
//   2. Its name, folder and file name do not read as a score or grade
//      announcement (never shelved) or as a list of students, groups, seats or
//      attendance (scripts/lib/library-pii.mjs).
//   3. The library does not hold the same bytes, under any status: an archived
//      or held document does not come back under a new URL.
//   4. It is a PDF, and library-pages.py reads its text and finds no student or
//      national ID and no page that lists students ('ok' or 'partial'). A scan,
//      an unreadable font, a spreadsheet, a deck or a video is held: nothing
//      here can read it, and what cannot be read cannot be vouched for.
//   5. No stored document has the same number of pages and the same text: that
//      is the same deck saved again, a duplicate whatever its bytes.
//   6. With --shelve: the upload reads back from R2 with the hash it went up with.
//
// WHAT THE GATES CANNOT SEE: a name printed without an ID inside an otherwise
// ordinary deck (a student's case presentation), and a page that is only a
// picture inside a PDF whose other pages have text. Markers such as "Student
// ID" or "รหัสนิสิต" were measured on the 1,345 served course PDFs (13 Nov 2026)
// and are almost always a blank form or an instruction, so they are not a gate.
//
// RIGHTS. Every MyCourseVille row in the library is `instructor-permission`,
// public behind the university sign-in, on one basis: course material the
// instructor posted for the enrolled class. A file that passes the gates is
// shelved on that same basis and its row says a routine sync did it.
//
// SETUP. Secrets come from the environment: SUPABASE_ACCESS_TOKEN (Management
// API) to read the catalog, plus R2_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to
// shelve. On a machine set up for this project nothing needs exporting: the
// script reads the checkout's git-ignored .r2env and .mcp.json (the token of its
// `supabase-vetmock` entry; the bridge is its `mcv` entry, whose Python also
// runs library-pages.py). From a linked worktree it reads the main checkout's.

import { execFileSync, spawnSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cfConfig } from '../api/_lib/r2.js';
import { displayName, fetchMaterial, folderLabel, publicationMetadata, r2Put, shelfEntry } from './ingest-library.mjs';
import { rosterReason } from './lib/library-pii.mjs';
import { libraryFileBytes, librarySql } from './lib/library-read.mjs';
import { buildManifest, subjectForCourse } from './mcv-manifest.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOSTED = /^https?:\/\/mycourseville/i; // the test ingest-library.mjs mirrors by

const sha16 = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 16);

/** One upload, one key, however its URL was written down.
 *
 *  A Thai file name reached the catalog as "u0e15u0e23u0e35_x.pdf" (the bridge
 *  dropped the backslash of each escape until Nov 2026), is listed today as
 *  "%E0%B8%95%E0%B8%A3%E0%B8%B5_x.pdf", and both are the file "ตรี_x.pdf".
 *  Every form is brought to the oldest one, which is plain ASCII: decode the
 *  percent escapes, then write each non-ASCII UTF-16 unit as u + four hex
 *  digits. A share link's trailing ?e= token changes per copy of the same link. */
export function urlKey(url) {
  let s = String(url ?? '').trim().replace(/\?e(=[^#]*)?$/, '');
  try { s = decodeURIComponent(s); } catch { /* a stray %: compare it as it came */ }
  // eslint-disable-next-line no-control-regex -- the ASCII range, written out
  return s.replace(/[^\x00-\x7f]/g, (c) => `u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);
}

const host = (url) => { try { return new URL(url).host; } catch { return 'no host'; } };
const extension = (url) => (String(url).split(/[?#]/)[0].split('/').pop().match(/\.([a-z0-9]{1,5})$/i)?.[1] || '').toLowerCase();

/** What MyCourseVille lists that no library row accounts for, each with the
 *  fate its listing alone decides. Items without one still need their bytes. */
export function reconcile(dump, catalog) {
  const known = new Set(catalog.filter((row) => row.source_url).map((row) => urlKey(row.source_url)));
  const scoreSheets = [];
  const listed = buildManifest(dump, scoreSheets);
  const items = [];
  for (const it of [...listed, ...scoreSheets]) {
    if (known.has(urlKey(it.url))) continue;
    const item = {
      courseNo: it.courseNo, subject: subjectForCourse(it.courseNo), folder: it.folder, name: it.name, title: displayName(it), url: it.url,
      year: it.year ?? null, semester: it.semester ?? null, academicYear: it.academicYear ?? null,
    };
    const roster = rosterReason(it);
    if (it.reason) hold(item, `a score or grade announcement is never shelved: ${it.reason}`);
    else if (roster) hold(item, `a list of students is a person's decision: ${roster}`);
    else if (!HOSTED.test(it.url)) hold(item, `an external link (${host(it.url)}): there is no file on MyCourseVille to mirror`);
    else if (extension(it.url) !== 'pdf') hold(item, `a .${extension(it.url) || 'unknown'} file: only a PDF's text can be read for names and IDs here`);
    items.push(item);
  }
  items.sort((a, b) => `${a.courseNo}\n${a.folder}\n${a.name}`.localeCompare(`${b.courseNo}\n${b.folder}\n${b.name}`, 'en'));
  return { items, listed: listed.length + scoreSheets.length, inLibrary: listed.length + scoreSheets.length - items.length, silent: silentCourses(dump, catalog) };
}

/** Courses that list no file at all while the library holds files from them.
 *  An empty listing reads as "nothing new", and two courses that kept their files
 *  outside folders listed nothing for months before anyone saw it (the bridge's
 *  parser, fixed 13 Nov 2026). The library's own rows say when to doubt it. */
function silentCourses(dump, catalog) {
  const failed = new Set((dump.errors || []).map((error) => String(error.cv_cid)));
  const out = [];
  for (const course of dump.courses || []) {
    const cid = String(course.cv_cid);
    if (failed.has(cid) || Object.values(dump.materials?.[cid]?.folders || {}).flat().length) continue;
    const from = `/${course.year}_${course.semester}/${cid}/materials/`;
    const held = catalog.filter((row) => String(row.source_url || '').includes(from)).length;
    if (held) out.push({ cv_cid: cid, course_no: course.course_no, error: `it lists no files, yet the library holds ${held} from it: the listing may be broken` });
  }
  return out;
}

function hold(item, reason) {
  item.fate = 'held';
  item.reason = reason;
}

/** Why library-pages.py's reading of a PDF leaves a doubt, or null when it does not. */
export function textDoubt(check) {
  const notes = check?.notes || {};
  switch (check?.status) {
    case 'ok':
    case 'partial':
      return null;
    case 'pii_held':
      return notes.roster_pages
        ? `page ${notes.roster_pages.join(', ')} lists students (${notes.id_matches} ID-like numbers)`
        : `its text shows a student or national ID number (${notes.id_matches})`;
    case 'no_text':
      return 'no page has text to read (a scan, or pictures only), so it could not be checked for names and IDs';
    case 'garbled':
      return 'its text does not decode (a font with no Unicode map), so it could not be checked for names and IDs';
    case 'unreadable':
      return `it does not open as a PDF (${notes.error || 'no detail'})`;
    default:
      return `its text was not checked (${check?.error || 'the check gave no verdict'})`;
  }
}

function duplicate(item, same, row, twin) {
  item.fate = 'duplicate';
  item.duplicateOf = row ? { slug: row.slug, title: row.title, status: row.status } : { listedAs: twin.title };
  item.reason = row
    ? `${same} as "${row.title}" (${row.slug}, ${row.status}${row.text_status === 'pii_held' ? ', held' : ''})`
    : `${same} as "${twin.title}", listed in this run`;
}

// Below this much text two different decks of pictures could share their few words.
const SAME_TEXT_MIN_CHARS = 500;

/** Which stored documents have these page counts and exactly this text. A deck
 *  saved again has other bytes and the same words: on 1 Nov 2026 a 110-page deck
 *  came back 4 MB lighter, and its text matched the stored copy on every page.
 *  `text_md5` is library-pages.py's fingerprint, computed here the way it is there. */
export function sameTextSql(candidates) {
  const pages = [...new Set(candidates.map((c) => Number(c.pages)))].filter(Number.isInteger);
  const md5s = [...new Set(candidates.map((c) => c.md5))].filter((m) => /^[0-9a-f]{32}$/.test(m));
  return `select d.slug, d.title, d.status, d.text_status, t.md5
from (select p.doc_id, md5(string_agg(p.body, ' ' order by p.page)) as md5
      from library_doc_pages p join library_docs k on k.id = p.doc_id
      where k.page_count in (${pages.join(', ')})
      group by p.doc_id) t
join library_docs d on d.id = t.doc_id
where t.md5 in (${md5s.map((m) => `'${m}'`).join(', ')})`;
}

/** Second pass: fetch what is still undecided, then duplicate, held or shelve.
 *  `fetchFile(url)` -> { ok, status, bytes }; `saveFile(bytes)` -> a path;
 *  `checkPdfs(paths)` -> Map(path -> library-pages.py's verdict);
 *  `sql(query, { readOnly })` -> rows. */
export async function inspect(items, catalog, { fetchFile, saveFile, checkPdfs, sql }) {
  const bySha = new Map(catalog.map((row) => [row.sha256_16, row]));
  const firstInRun = new Map();
  const toCheck = [];
  for (const item of items) {
    if (item.fate) continue;
    const got = await fetchFile(item.url);
    if (!got.ok) { hold(item, `the download answered ${got.status}`); continue; }
    if (!got.bytes.length) { hold(item, 'the file is empty on MyCourseVille'); continue; }
    item.bytes = got.bytes.length;
    item.sha256_16 = sha16(got.bytes);
    const row = bySha.get(item.sha256_16);
    const twin = firstInRun.get(item.sha256_16);
    if (row || twin) { duplicate(item, 'the same bytes', row, twin); continue; }
    firstInRun.set(item.sha256_16, item);
    item.file = saveFile(got.bytes);
    toCheck.push(item);
  }

  const verdicts = toCheck.length ? await checkPdfs(toCheck.map((item) => item.file)) : new Map();
  const readable = [];
  for (const item of toCheck) {
    const check = verdicts.get(item.file) || { error: verdicts.error };
    item.pages = check.page_count ?? null;
    const doubt = textDoubt(check);
    if (doubt) { hold(item, doubt); continue; }
    item.fate = 'shelve';
    if (/^[0-9a-f]{32}$/.test(check.text_md5 || '') && Number.isInteger(check.page_count) && check.text_chars >= SAME_TEXT_MIN_CHARS) {
      readable.push({ item, md5: check.text_md5, pages: check.page_count });
    }
  }

  if (readable.length) {
    const stored = new Map((await sql(sameTextSql(readable), { readOnly: true })).map((row) => [row.md5, row]));
    const firstByText = new Map();
    for (const { item, md5 } of readable) {
      const row = stored.get(md5);
      const twin = firstByText.get(md5);
      if (row || twin) duplicate(item, `the same text across the same ${item.pages} pages`, row, twin);
      else firstByText.set(md5, item);
    }
  }
  return items;
}

/** The rights line a shelved row carries: the one basis every MyCourseVille row
 *  in the library rests on, and that a routine sync, not a reviewer, applied it. */
export function permissionEvidence(item, day) {
  const area = folderLabel(item.folder);
  const term = `${item.academicYear}/${item.semester}`;
  return `Course material the instructor uploaded to the ${item.courseNo} ${area ? `${area} area` : 'course area'} on MyCourseVille `
    + `for the enrolled ${term} cohort; shelved on ${day} by the project owner's routine MyCourseVille sync on the same basis as `
    + `the existing ${term} rows (no new instructor statement was collected).`;
}

// The columns shelfEntry() fills, with the types the insert reads them as.
const ROW_TYPES = {
  slug: 'text', title: 'text', kind: 'text', description: 'text', subject: 'text', year: 'int', semester: 'smallint',
  academic_year: 'int', storage_provider: 'text', storage_bucket: 'text', storage_key: 'text', mime: 'text',
  byte_size: 'bigint', sha256_16: 'text', license: 'text', status: 'text', source_url: 'text', attribution: 'text',
  permission_evidence: 'text',
};

/** One statement for every row, guarded by hash and by slug so a second run, or
 *  another session shelving the same file, inserts nothing twice. The rows
 *  travel as JSON inside a dollar-quoted literal: no value is spliced into SQL. */
export function insertSql(rows) {
  const stray = [...new Set(rows.flatMap((row) => Object.keys(row)))].filter((column) => !(column in ROW_TYPES));
  if (stray.length) throw new Error(`a row carries a column this insert does not know: ${stray.join(', ')}`);
  const columns = Object.keys(ROW_TYPES);
  const json = JSON.stringify(rows);
  let tag;
  do { tag = `$r${randomBytes(6).toString('hex')}$`; } while (json.includes(tag));
  return `insert into library_docs (${columns.join(', ')})
select ${columns.map((c) => `i.${c}`).join(', ')}
from jsonb_to_recordset(${tag}${json}${tag}::jsonb) as i(${columns.map((c) => `${c} ${ROW_TYPES[c]}`).join(', ')})
where not exists (select 1 from library_docs d where d.sha256_16 = i.sha256_16 or d.slug = i.slug)
returning slug`;
}

/** Third pass, --shelve only: each `shelve` item becomes `shelved`, or `failed`
 *  with what stopped it. A row counts only once its file has been read back
 *  from R2 through the catalog and hashes to what was checked. */
export async function shelve(items, { day, bucket, readFile, put, sql, readBack }) {
  const fail = (item, reason) => { item.fate = 'failed'; item.reason = reason; };
  const uploaded = [];
  for (const item of items) {
    if (item.fate !== 'shelve') continue;
    try {
      const bytes = readFile(item.file);
      const publication = publicationMetadata({
        ...item, license: 'instructor-permission', permissionEvidence: permissionEvidence(item, day), status: 'public',
      });
      const entry = shelfEntry(item, bytes, { publication, bucket });
      if (entry.sha !== item.sha256_16) { fail(item, 'the saved file no longer matches the bytes that were checked'); continue; }
      const up = await put(entry.key, bytes, entry.mime, bucket);
      if (!up.ok) { fail(item, `R2 answered ${up.status} to the upload`); continue; }
      uploaded.push({ item, ...entry });
    } catch (error) {
      fail(item, String(error.message).slice(0, 240));
    }
  }
  if (!uploaded.length) return items;

  const quoted = uploaded.map((u) => `'${u.sha}'`).join(', '); // sixteen hex digits each, made here
  let rows = [];
  try {
    await sql(insertSql(uploaded.map((u) => u.row)));
    rows = await sql(`select slug, storage_key from library_docs where sha256_16 in (${quoted})`);
  } catch (error) {
    for (const u of uploaded) fail(u.item, `uploaded, but the catalog insert failed: ${String(error.message).slice(0, 200)}`);
    return items;
  }
  for (const u of uploaded) {
    const row = rows.find((r) => r.storage_key === u.key);
    if (!row) { fail(u.item, 'uploaded, but the catalog has no row for it'); continue; }
    try {
      if (sha16(await readBack(row.slug)) !== u.sha) { fail(u.item, 'the file read back from R2 is not the file that was uploaded'); continue; }
    } catch (error) {
      fail(u.item, `catalogued, but it did not read back from R2: ${String(error.message).slice(0, 200)}`);
      continue;
    }
    u.item.fate = 'shelved';
    u.item.slug = row.slug;
    delete u.item.reason;
  }
  return items;
}

// ── what only this machine knows ─────────────────────────────────────────

/** The environment, completed from the checkout's git-ignored files, and where
 *  the bridge is. A value already in the environment wins. */
export function localSetup(env = process.env, dirs = checkoutDirs()) {
  const read = (name) => {
    const dir = dirs.find((d) => fs.existsSync(path.join(d, name)));
    return dir ? fs.readFileSync(path.join(dir, name), 'utf8') : '';
  };
  const out = { ...env };
  for (const line of read('.r2env').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !out[m[1]]) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  let servers = {};
  try { servers = JSON.parse(read('.mcp.json') || '{}').mcpServers || {}; } catch { /* unreadable: the errors below say what is missing */ }
  const token = servers['supabase-vetmock']?.env?.SUPABASE_ACCESS_TOKEN;
  if (token && !out.SUPABASE_ACCESS_TOKEN) out.SUPABASE_ACCESS_TOKEN = token;
  const server = servers.mcv?.args?.find((a) => /server\.py$/.test(a)); // cli.py sits beside it
  return {
    env: out,
    python: servers.mcv?.command || 'python',
    bridgeCli: server ? path.join(path.dirname(server), 'cli.py') : null,
  };
}

// This checkout, then the main one: a linked worktree has no ignored files of its own.
function checkoutDirs() {
  const dirs = [ROOT];
  try {
    const common = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (common) dirs.push(path.dirname(common));
  } catch { /* not a git checkout: this folder only */ }
  return dirs;
}

function bridgeDump({ python, bridgeCli }, term) {
  if (!bridgeCli) throw new Error('no MyCourseVille bridge is registered here (the `mcv` entry of .mcp.json). Pass --dump=<file> to use a listing already on disk.');
  const run = spawnSync(python, [bridgeCli, 'dump', ...(term ? ['--term', term] : [])], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, timeout: 10 * 60_000 });
  if (run.error || run.status !== 0) {
    const last = String(run.stderr || run.error?.message || '').trim().split(/\r?\n/).pop();
    throw new Error(`the MyCourseVille bridge did not return a listing: ${last || `exit ${run.status}`}`);
  }
  return JSON.parse(run.stdout);
}

/** library-pages.py's verdict for each PDF, by path. A check that cannot run
 *  returns no verdicts and says why in `.error`, which holds every file. */
function checkPdfs(python, files) {
  const verdicts = new Map();
  for (let i = 0; i < files.length; i += 40) {
    const run = spawnSync(python, ['-I', path.join(ROOT, 'scripts/library-pages.py'), 'check', ...files.slice(i, i + 40)], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 30 * 60_000 });
    for (const line of String(run.stdout || '').split(/\r?\n/)) {
      if (!line.startsWith('{')) continue;
      const rec = JSON.parse(line);
      verdicts.set(rec.file, rec);
    }
    if (run.error || run.status !== 0) verdicts.error = String(run.error?.message || run.stderr || `exit ${run.status}`).trim().split(/\r?\n/).pop().slice(0, 160);
  }
  return verdicts;
}

// Page text and topic links for what was just shelved: the existing commands,
// each resumable, so a step that fails here is run again by its own line.
const AFTER_SHELVING = [
  ['page text read from R2', 'python', ['-I', 'scripts/library-pages.py', 'extract']],
  ['page text stored', 'python', ['-I', 'scripts/library-pages.py', 'load']],
  ['topic links proposed', 'node', ['scripts/library-links.mjs', 'propose']],
  ['topic links written', 'node', ['scripts/library-links.mjs', 'apply']],
];

function afterShelving(setup) {
  const done = [];
  for (const [step, runner, args] of AFTER_SHELVING) {
    console.log(`\n-- ${step}: ${runner} ${args.join(' ')}`);
    const run = spawnSync(runner === 'node' ? process.execPath : setup.python, args, { cwd: ROOT, env: setup.env, stdio: 'inherit' });
    done.push({ step, command: `${runner} ${args.join(' ')}`, ok: run.status === 0 });
    if (run.status !== 0) break; // the later steps build on this one
  }
  return done;
}

// ── the run ──────────────────────────────────────────────────────────────

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const mb = (bytes) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** The lines a run prints: one block per fate, in the order a reader acts on them. */
export function describe(result) {
  const { items } = result;
  const lines = [
    `MyCourseVille ${result.term}: ${plural(result.courses, 'course')}, ${plural(result.listed, 'file')} listed, ${result.inLibrary} already in the library, ${items.length} not.`,
  ];
  for (const error of result.errors) lines.push(`  NOT LISTED: course ${error.course_no ?? error.cv_cid}: ${error.error}`);
  const blocks = [
    ['shelved', 'Shelved, read back from R2'], ['shelve', 'Would be shelved'], ['failed', 'FAILED'],
    ['duplicate', 'Duplicate, not shelved'], ['held', 'Held for a person'],
  ];
  for (const [fate, heading] of blocks) {
    const group = items.filter((item) => item.fate === fate);
    if (!group.length) continue;
    lines.push('', `${heading} (${group.length})`);
    for (const item of group) {
      const size = item.bytes ? `${item.pages ? `${plural(item.pages, 'page')}, ` : ''}${mb(item.bytes)}` : '';
      lines.push(`  ${item.courseNo} ${item.subject}  ${folderLabel(item.folder) || '(no folder)'} / ${item.title}${size ? `  [${size}]` : ''}`);
      if (item.reason) lines.push(`      ${item.reason}`);
    }
  }
  return lines;
}

const termsOf = (dump) => [...new Set((dump.courses || []).map((c) => `${c.year}/${c.semester}`))].join(', ') || 'no term';

/** One pass over one listing. Without `shelve`, reading is all that leaves this
 *  process: what it asks the catalog is sent read-only, so the database itself
 *  would refuse a write, and nothing is put or inserted.
 *  deps: sql(query, { readOnly }), fetchFile, saveFile, checkPdfs, and for
 *  shelving bucket, readFile, put, readBack. */
export async function run({ dump, shelve: doShelve = false, day }, deps) {
  // The whole catalog, every status: a restricted, archived or held row is still a file the library has.
  const catalog = await deps.sql('select slug, title, status, text_status, sha256_16, source_url from library_docs', { readOnly: true });
  const { silent, ...found } = reconcile(dump, catalog);
  const result = {
    mode: doShelve ? 'shelve' : 'check',
    term: dump.term || termsOf(dump),
    courses: (dump.courses || []).length,
    errors: [...(dump.errors || []), ...silent],
    ...found,
  };
  await inspect(result.items, catalog, deps);
  if (doShelve) await shelve(result.items, { ...deps, day });
  return result;
}

async function main() {
  const doShelve = process.argv.includes('--shelve');
  const setup = localSetup();
  if (doShelve && !cfConfig(setup.env).configured) throw new Error('R2 is not configured: set R2_ACCOUNT_ID and CLOUDFLARE_API_TOKEN (.r2env)');
  const dumpFile = arg('dump');
  const dump = dumpFile ? JSON.parse(fs.readFileSync(dumpFile, 'utf8')) : bridgeDump(setup, arg('term'));
  if (doShelve) {
    // r2Put reads the process environment, as ingest-library.mjs always has. Set after the bridge has run.
    for (const key of ['R2_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN', 'R2_BUCKET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']) {
      if (setup.env[key] && !process.env[key]) process.env[key] = setup.env[key];
    }
  }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-mcv-sync-'));
  let saved = 0;
  let result;
  try {
    result = await run({ dump, shelve: doShelve, day: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }) }, {
      sql: (query, opts) => librarySql(query, { env: setup.env, ...opts }),
      fetchFile: async (url) => {
        try {
          const res = await fetchMaterial(url);
          return { ok: res.ok, status: res.status, bytes: res.ok ? Buffer.from(await res.arrayBuffer()) : null };
        } catch (error) {
          return { ok: false, status: `nothing (${error.name})` };
        }
      },
      saveFile: (bytes) => {
        const file = path.join(tmp, `${String(saved += 1).padStart(4, '0')}.pdf`);
        fs.writeFileSync(file, bytes);
        return file;
      },
      checkPdfs: (files) => checkPdfs(setup.python, files),
      bucket: cfConfig(setup.env).bucket,
      readFile: (file) => fs.readFileSync(file),
      put: r2Put,
      readBack: (slug) => libraryFileBytes(slug, { env: setup.env }),
    });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  for (const line of describe(result)) console.log(line);
  const count = (fate) => result.items.filter((item) => item.fate === fate).length;
  if (count('shelved')) result.after = afterShelving(setup);
  const stopped = (result.after || []).find((step) => !step.ok);

  console.log('');
  if (!doShelve) console.log(count('shelve') ? `Nothing was changed. \`npm run mcv:sync -- --shelve\` shelves the ${plural(count('shelve'), 'file')} above.` : 'Nothing was changed, and nothing is waiting to be shelved.');
  else console.log(`${plural(count('shelved'), 'file')} shelved, ${count('failed')} failed, ${count('held')} held, ${count('duplicate')} duplicate.`);
  if (stopped) console.log(`STOPPED at "${stopped.step}". The files are shelved; run \`${stopped.command}\` again for the rest.`);

  const reportFile = arg('report') || path.join(ROOT, '.mcv/sync-report.json');
  for (const item of result.items) delete item.file; // a path in a folder that is gone
  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  const counts = Object.fromEntries(['shelve', 'shelved', 'failed', 'duplicate', 'held'].map((fate) => [fate, count(fate)]));
  fs.writeFileSync(reportFile, `${JSON.stringify({ at: new Date().toISOString(), ...result, counts }, null, 1)}\n`);
  console.log(`Report: ${path.relative(process.cwd(), reportFile) || reportFile}`);
  if (result.errors.length || count('failed') || stopped) process.exitCode = 1;
}

const entry = process.argv[1]?.replace(/\\/g, '/');
if (entry && import.meta.url.endsWith(entry.split('/').pop())) {
  main().catch((error) => { console.error(`mcv-sync: ${error.message}`); process.exit(2); });
}
