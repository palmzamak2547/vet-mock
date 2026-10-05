#!/usr/bin/env node

// Expand the public instructor directory beyond Chulalongkorn.
//
// Roster sources (official, scraped 2026-10-05, cached under data-cache/):
//   - Kasetsart:   https://vet.ku.ac.th/<ภาควิชา>/คณาจารย์ (TH + EN pages,
//                  per-person email + Scopus author link); romanisations for
//                  departments without an EN page come from each person's
//                  Scopus author profile via their author ID.
//   - Mahidol:     https://vs.mahidol.ac.th/new/personnel.aspx?dept_id=N
//                  (per-division pages, Thai + English names).
//
// Publication discovery: OpenAlex author search gated on a Kasetsart/Mahidol
// affiliation, filtered to article/review 2020–2026. Every DOI is verified
// against Crossref before it is emitted. A small sample per person is also
// cross-checked against Consensus (independent search index) and recorded in
// the audit cache.
//
// Usage:
//   node scripts/research-faculty-expansion.mjs --research   # network, cached
//   node scripts/research-faculty-expansion.mjs --emit       # merge to directory
//   node scripts/research-faculty-expansion.mjs              # both
//
// Existing directory entries are emitted unchanged; only expansion entries are
// appended, so a stale Chula research cache cannot affect them.

import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const fileUrlToPath = fileURLToPath;

const ROOT = new URL('..', import.meta.url);
const AUDIT_FILE = new URL('data-cache/instructors/expansion-audit.json', ROOT);
const KU_ROSTER = new URL('data-cache/instructors/ku-roster/ku-roster.json', ROOT);
const MU_ROSTER = new URL('data-cache/instructors/mahidol-roster/roster.json', ROOT);
const DIRECTORY_FILE = new URL('src/data/instructors-directory.js', ROOT);

const VERIFIED_AT = '2026-10-05';
const YEAR_FROM = 2020;
const YEAR_TO = 2026;
const PAPER_TYPES = 'article|review';
const CONTACT = (process.env.VETMOCK_RESEARCH_CONTACT || '').trim();
const CONSENSUS_KEY = (process.env.CONSENSUS_API_KEY || '').trim();

const KU_INSTITUTION = 'คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเกษตรศาสตร์';
const MU_INSTITUTION = 'คณะสัตวแพทยศาสตร์ มหาวิทยาลัยมหิดล';
const KU_ROSTER_URL = 'https://vet.ku.ac.th/';
const MU_ROSTER_URL = 'https://vs.mahidol.ac.th/new/Department';

const KU_DEPARTMENTS = {
  anatomy: 'ภาควิชากายวิภาคศาสตร์',
  physiology: 'ภาควิชาสรีรวิทยา',
  pharmacology: 'ภาควิชาเภสัชวิทยา',
  pathology: 'ภาควิชาพยาธิวิทยา',
  parasitology: 'ภาควิชาปรสิตวิทยา',
  micro: 'ภาควิชาจุลชีววิทยาและวิทยาภูมิคุ้มกัน',
  companion: 'ภาควิชาเวชศาสตร์คลินิกสัตว์เลี้ยง',
  largeanimal: 'ภาควิชาเวชศาสตร์คลินิกสัตว์ใหญ่และสัตว์ป่า',
  production: 'ภาควิชาเวชศาสตร์และทรัพยากรการผลิตสัตว์',
  vph: 'ภาควิชาสัตวแพทยสาธารณสุขศาสตร์',
};

const MU_ACADEMIC_POSITIONS = new Set([
  'ศาสตราจารย์', 'รองศาสตราจารย์', 'ผู้ช่วยศาสตราจารย์', 'อาจารย์', 'ผู้ช่วยอาจารย์',
]);

const RANK_ABBR = {
  'ศาสตราจารย์': 'ศ.',
  'รองศาสตราจารย์': 'รศ.',
  'ผู้ช่วยศาสตราจารย์': 'ผศ.',
  'อาจารย์': 'อ.',
  'ผู้ช่วยอาจารย์': 'ผอช.',
  'Professor': 'ศ.',
  'Associate Professor': 'รศ.',
  'Assistant Professor': 'ผศ.',
  'Lecturer': 'อ.',
};

const LICENSE_PATTERN = /(สพ\.ญ\.|น\.สพ\.|สพ\.บ\.|ภญ\.|ภ\.|ส\.ญ\.|สพ\.)/u;

function stripThaiTitles(value = '') {
  return String(value)
    .replace(/^(?:(?:ศาสตราจารย์|รองศาสตราจารย์|ผู้ช่วยศาสตราจารย์|ผู้ช่วยอาจารย์|ศ\.|รศ\.|ผศ\.|ดร\.|ผอ\.|ผศ\.)\s*)+/u, '')
    .replace(/^(?:น\.สพ\.|สพ\.ญ\.|สพ\.|ภญ\.|ภ\.|น\.ส\.|นายสัตวแพทย์|สัตวแพทย์หญิง|ว่าที่\s*ร\.ต\.)\s*/u, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripEnglishTitles(value = '') {
  let result = String(value).trim();
  const prefix = /^(?:(?:professor|associate professor|assistant professor|lecturer|instructor|assoc\.?\s*prof\.?|asst\.?\s*prof\.?|prof\.?|dr\.?|dvm|phd)[.\s]*)+/i;
  while (prefix.test(result)) result = result.replace(prefix, '').trim();
  return result;
}

function normalizeName(value = '') {
  return stripEnglishTitles(String(value))
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/g, '');
}

function slugifyName(value = '') {
  return String(value).normalize('NFKD').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function positionFromThaiName(nameTh = '', rankTh = '') {
  const license = (nameTh.match(LICENSE_PATTERN) || [])[1];
  const rank = RANK_ABBR[rankTh] || stripThaiTitles(rankTh);
  return [rank, license].filter(Boolean).join('');
}

function toDisplayName(scopusForm = '') {
  // "Chantakru, Sirirak" -> "Sirirak Chantakru"
  if (!/,/.test(scopusForm)) return scopusForm;
  const [last, ...first] = scopusForm.split(',');
  return `${first.join(',').trim()} ${last.trim()}`.trim();
}

async function fetchJson(url, tries = 5) {
  for (let attempt = 1; attempt <= tries; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': CONTACT || 'vetmock-faculty-directory' } });
      if (response.status === 429 || response.status >= 500) throw new Error(`HTTP ${response.status}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
      } catch (error) {
      if (attempt === tries) { console.warn(`  ! ${url.slice(0, 120)} -> ${error.message}`); return null; }
      await new Promise((resolve) => setTimeout(resolve, error.message === 'HTTP 429' ? 15000 * attempt : 1500 * attempt));
    }
  }
  return null;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const THROTTLE_MS = Number(process.env.FACULTY_THROTTLE_MS || 400);

function normalizeTitle(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9ก-๙ ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Rosters
// ---------------------------------------------------------------------------

function buildRoster(people_) {
  const people = [];

  const ku = JSON.parse(readFileSyncSafe(KU_ROSTER));
  for (const person of ku) {
    // Scopus-derived romanisations arrive as "Last, First"; OpenAlex search
    // and the public directory both want the natural "First Last" form.
    const nameEn = /[A-Za-z],\s*[A-Za-z]/.test(person.nameEn || '')
      ? toDisplayName(person.nameEn)
      : person.nameEn;
    people.push({
      key: `ku:${person.email || person.scopus || person.nameEn}`,
      slugSeed: nameEn || person.nameTh,
      nameTh: stripThaiTitles(person.nameTh || ''),
      nameEn: stripEnglishTitles(nameEn || ''),
      rawNameTh: person.nameTh || '',
      rawNameEn: person.nameEn || '',
      position: positionFromThaiName(person.nameTh || '', person.positionEn || ''),
      department: KU_DEPARTMENTS[person.dept] || person.dept,
      institution: KU_INSTITUTION,
      email: person.email || undefined,
      scopus: person.scopus || undefined,
      universityNeedle: 'kasetsart',
      rosterUrl: KU_ROSTER_URL,
    });
  }

  const mu = JSON.parse(readFileSyncSafe(MU_ROSTER));
  for (const person of mu) {
    if (!MU_ACADEMIC_POSITIONS.has(person.position)) continue;
    const division = person.division && person.division !== '(ทั้งภาค)' ? ` · ${person.division}` : '';
    people.push({
      key: `mu:${person.nameTh}`,
      slugSeed: person.nameEn || person.nameTh,
      nameTh: stripThaiTitles(person.nameTh || ''),
      nameEn: stripEnglishTitles(person.nameEn || ''),
      rawNameTh: person.nameTh || '',
      rawNameEn: person.nameEn || '',
      position: positionFromThaiName(person.nameTh || '', person.position),
      department: `${person.dept}${division}`,
      institution: MU_INSTITUTION,
      email: undefined,
      scopus: undefined,
      universityNeedle: 'mahidol',
      rosterUrl: MU_ROSTER_URL,
    });
  }

  const seen = new Set();
  return people.filter((person) => {
    if (!person.nameTh || !person.nameEn) return false;
    const norm = normalizeName(person.nameEn);
    if (seen.has(norm)) return false;
    seen.add(norm);
    return true;
  });
}

function readFileSyncSafe(url) {
  return readFileSync(fileURLToPath(url), 'utf8');
}

// ---------------------------------------------------------------------------
// OpenAlex
// ---------------------------------------------------------------------------

async function matchOpenAlexAuthor(person) {
  const url = `https://api.openalex.org/authors?search=${encodeURIComponent(person.nameEn)}&per-page=10${CONTACT ? `&mailto=${encodeURIComponent(CONTACT)}` : ''}`;
    const data = await fetchJson(url);
    if (!data) return { status: 'error' };
    const results = data?.results || [];
  const scored = results.map((author) => {
    const name = normalizeName(author.display_name || '');
    const target = normalizeName(person.nameEn);
    const exact = name === target;
    const hasUniversity = (author.affiliations || []).some((affiliation) => (
      (affiliation.institution?.display_name || '').toLowerCase().includes(person.universityNeedle)
    ));
    return { author, exact, hasUniversity };
  }).filter(({ exact, hasUniversity }) => exact && hasUniversity);
  if (!scored.length) return { status: 'unmatched' };
  const best = scored[0].author;
  return {
    status: 'matched-high',
    id: best.id,
    openAlex: best,
  };
}

async function fetchOpenAlexWorks(authorId) {
  const works = [];
  let cursor = '*';
  const filter = `author.id:${authorId},from_publication_date:${YEAR_FROM}-01-01,to_publication_date:${YEAR_TO}-12-31,type:${PAPER_TYPES}`;
  for (let page = 0; page < 30; page += 1) {
    const url = `https://api.openalex.org/works?filter=${encodeURIComponent(filter)}&per-page=200&cursor=${encodeURIComponent(cursor)}${CONTACT ? `&mailto=${encodeURIComponent(CONTACT)}` : ''}`;
    const data = await fetchJson(url);
    if (!data) break;
    works.push(...(data.results || []));
    if (!data.meta?.next_cursor) break;
    cursor = data.meta.next_cursor;
    await sleep(120);
  }
  return works;
}

function paperFromWork(work) {
  const doi = String(work.doi || '').replace(/^https:\/\/doi\.org\//i, '').toLowerCase();
  const title = (work.title || work.display_name || '').trim();
  if (!title || !doi) return null;
  return {
    title,
    year: work.publication_year,
    journal: work.primary_location?.source?.display_name || undefined,
    authors: (work.authorships || []).map((authorship) => authorship.author?.display_name).filter(Boolean).join(', '),
    doi,
    citedByCount: work.cited_by_count,
  };
}

async function verifyWithCrossref(doi, expectedTitle) {
  const data = await fetchJson(`https://api.crossref.org/works/${encodeURIComponent(doi)}${CONTACT ? `?mailto=${encodeURIComponent(CONTACT)}` : ''}`);
  const message = data?.message;
  if (!message) return { ok: false, reason: 'not-found' };
  const crossrefTitle = normalizeTitle(Array.isArray(message.title) ? message.title[0] : message.title || '');
  const localTitle = normalizeTitle(expectedTitle);
  if (!crossrefTitle || (!crossrefTitle.includes(localTitle) && !localTitle.includes(crossrefTitle))) {
    return { ok: false, reason: 'title-mismatch', crossrefTitle };
  }
  return { ok: true, journal: Array.isArray(message['container-title']) ? message['container-title'][0] : undefined };
}

// ---------------------------------------------------------------------------
// Consensus (independent cross-check on a sample)
// ---------------------------------------------------------------------------

async function consensusCheck(title) {
  if (!CONSENSUS_KEY) return { checked: false };
  const url = `https://api.consensus.app/v1/search?query=${encodeURIComponent(title)}`;
  try {
    const response = await fetch(url, { headers: { 'x-api-key': CONSENSUS_KEY } });
    if (!response.ok) return { checked: false, status: response.status };
    const data = await response.json();
    const titles = (data.results || []).map((result) => normalizeTitle(result.title || ''));
    return { checked: true, found: titles.includes(normalizeTitle(title)) };
  } catch {
    return { checked: false };
  }
}

// ---------------------------------------------------------------------------
// Phases
// ---------------------------------------------------------------------------

async function research() {
  const roster = buildRoster();
  const existingDirectory = await readDirectory();
  const existingSlugs = new Set(existingDirectory.map((entry) => entry.slug));

  let audit;
  try {
    audit = JSON.parse(await readFile(AUDIT_FILE, 'utf8'));
  } catch {
    audit = { verifiedAt: VERIFIED_AT, records: {} };
  }
  audit.verifiedAt = VERIFIED_AT;
  audit.records = audit.records || {};
  // Retry hygiene: keep only settled matches. Unmatched and error records are
  // rebuilt from scratch so a fixed romanisation or a recovered rate limit can
  // change the outcome.
  for (const [slug, record] of Object.entries(audit.records)) {
    if (record.openAlex?.status !== 'matched-high') delete audit.records[slug];
  }

  console.log(`Roster: ${roster.length} new-faculty people (KU + Mahidol)`);
  const limit = Number(process.argv.find((arg) => arg.startsWith('--limit='))?.split('=')[1]) || roster.length;
  let done = 0;
  for (const person of roster.slice(0, limit)) {
    done += 1;
    const slug = uniqueSlug(person, existingSlugs, audit.records);
    person.slug = slug;
    const cached = audit.records[slug];
    if (cached?.openAlex?.status === 'matched-high' && cached?.papersResolved) {
      console.log(`[${done}/${roster.length}] ${person.nameEn} — cached (${cached.papers.length} papers)`);
      continue;
    }

    const record = {
      slug,
      nameEn: person.nameEn,
      nameTh: person.nameTh,
      rawNameEn: person.rawNameEn,
      rawNameTh: person.rawNameTh,
      institution: person.institution,
      department: person.department,
      position: person.position,
      rosterUrl: person.rosterUrl,
      scopus: person.scopus,
      email: person.email,
      openAlex: null,
      papers: [],
      rejected: [],
      consensus: null,
      papersResolved: false,
    };

    const match = await matchOpenAlexAuthor(person);
    record.openAlex = { status: match.status, id: match.id, areas: match.openAlex?.topics?.slice(0, 5).map((topic) => topic.display_name) };
    if (match.status === 'matched-high') {
      record.openAlex.display_name = match.openAlex.display_name;
      record.openAlex.works_count = match.openAlex.works_count;
      record.openAlex.orcid = match.openAlex.orcid || null;
      record.openAlex.affiliations = (match.openAlex.affiliations || []).map((affiliation) => affiliation.institution?.display_name).filter(Boolean).slice(0, 6);

      const works = await fetchOpenAlexWorks(match.id);
      for (const work of works) {
        const paper = paperFromWork(work);
        if (!paper) continue;
        const verification = await verifyWithCrossref(paper.doi, paper.title);
        if (verification.ok) {
          if (verification.journal && !paper.journal) paper.journal = verification.journal;
          record.papers.push(paper);
        } else {
          record.rejected.push({ doi: paper.doi, title: paper.title, reason: verification.reason });
        }
        await sleep(90);
      }
      record.papers.sort((a, b) => (b.year || 0) - (a.year || 0));
      record.papersResolved = true;

      // Consensus cross-check on the most recent paper.
      if (record.papers.length) {
        const sample = record.papers[0];
        const check = await consensusCheck(sample.title);
        record.consensus = { title: sample.title, ...check };
        await sleep(200);
      }
      console.log(`[${done}/${roster.length}] ${person.nameEn} — ${match.id} -> ${record.papers.length} verified papers (${record.rejected.length} rejected)`);
    } else {
      record.papersResolved = match.status !== 'error';
      console.log(`[${done}/${roster.length}] ${person.nameEn} — ${match.status === 'error' ? 'transient error, will retry next run' : 'no OpenAlex match, kept with 0 papers'}`);
    }

    audit.records[slug] = record;
    await writeFile(AUDIT_FILE, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
    await sleep(THROTTLE_MS);
  }

  await writeFile(AUDIT_FILE, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
  const matched = Object.values(audit.records).filter((record) => record.openAlex?.status === 'matched-high');
  console.log(`\nAudit: ${Object.keys(audit.records).length} people, ${matched.length} matched, ${matched.reduce((sum, record) => sum + record.papers.length, 0)} verified papers`);
}

async function emit() {
  const audit = JSON.parse(await readFile(AUDIT_FILE, 'utf8'));
  const directory = await readDirectory();
  const existing = new Map(directory.map((entry) => [entry.slug, entry]));

  const newEntries = [];
  const seenSlugs = new Set(directory.map((entry) => entry.slug));
  for (const record of Object.values(audit.records)) {
    if (record.openAlex?.status !== 'matched-high') continue; // never emit pending/errored lookups
    if (seenSlugs.has(record.slug)) continue;
    seenSlugs.add(record.slug);
    newEntries.push(canonicalEntry(record));
  }

  const merged = [...directory, ...newEntries].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  const header = `// GENERATED by scripts/generate-instructor-directory.mjs + scripts/research-faculty-expansion.mjs\n// Sources checked ${VERIFIED_AT} (Chula entries from the 2026-08-12 audit): official university profiles/rosters + DOI metadata.\n// Edit the generators or research cache inputs, not this file directly.\n\n`;
  const output = `${header}export const INSTRUCTOR_DIRECTORY = ${JSON.stringify(merged, null, 2)};\n`;
  await writeFile(DIRECTORY_FILE, output, 'utf8');

  const withPapers = newEntries.filter((entry) => entry.papers.length > 0).length;
  console.log(`Emitted ${merged.length} profiles (${directory.length} existing + ${newEntries.length} expansion, ${withPapers} with verified publications)`);
}

function canonicalEntry(record) {
  const papers = record.papers.map((paper) => ({
    title: paper.title,
    year: paper.year || undefined,
    journal: paper.journal || undefined,
    authors: paper.authors || undefined,
    url: `https://doi.org/${paper.doi}`,
    doi: paper.doi,
    verifiedBy: 'Crossref',
  })).filter((paper) => paper.title && paper.doi);

  const aliases = unique([record.rawNameEn, record.rawNameTh, record.openAlex?.display_name]
    .map((value) => (value || '').trim())
    .filter((value) => value && value !== record.nameEn && value !== record.nameTh));

  const sources = [
    { label: record.institution === KU_INSTITUTION ? 'Kasetsart University' : 'Mahidol University', url: record.rosterUrl },
    record.openAlex?.id ? { label: 'OpenAlex', url: record.openAlex.id } : null,
    papers.length ? { label: 'Crossref', url: 'https://www.crossref.org/' } : null,
  ].filter(Boolean);

  return {
    slug: record.slug,
    nameEn: record.nameEn,
    nameTh: record.nameTh,
    aliases,
    position: record.position || 'อาจารย์',
    department: record.department,
    institution: record.institution,
    email: record.email,
    status: 'faculty',
    areas: (record.openAlex?.areas || []).slice(0, 5),
    areaSource: record.openAlex?.areas?.length ? 'OpenAlex' : (papers.length ? 'publications' : 'unavailable'),
    papers,
    subjects: [],
    topics: [],
    profiles: {
      ...(record.scopus ? { scopus: `https://www.scopus.com/authid/detail.uri?authorId=${record.scopus}` } : {}),
      ...(record.openAlex?.id ? { openalex: record.openAlex.id } : {}),
    },
    verification: {
      status: papers.length ? 'verified' : 'partial',
      verifiedAt: VERIFIED_AT,
      sources,
      publicationsFound: papers.length,
    },
  };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function uniqueSlug(person, existingSlugs, auditRecords) {
  // A person already audited keeps their slug even after it reached the
  // directory file; re-deriving from the directory alone would suffix every
  // re-run and duplicate the profile.
  for (const [slug, record] of Object.entries(auditRecords)) {
    if (record.nameEn === person.nameEn) return slug;
  }
  const base = slugifyName(person.slugSeed);
  let slug = base;
  let suffix = 2;
  while (existingSlugs.has(slug) || (auditRecords[slug] && auditRecords[slug].nameEn !== person.nameEn)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  existingSlugs.add(slug);
  return slug;
}

async function readDirectory() {
  const source = await readFile(DIRECTORY_FILE, 'utf8');
  const start = source.indexOf('export const INSTRUCTOR_DIRECTORY = ');
  if (start === -1) throw new Error('INSTRUCTOR_DIRECTORY not found');
  const json = source.slice(start + 'export const INSTRUCTOR_DIRECTORY = '.length).replace(/;\s*$/, '');
  return JSON.parse(json);
}

const mode = process.argv[2] || '';
if (mode.includes('--research')) await research();
if (mode.includes('--emit')) await emit();
if (!mode) { await research(); await emit(); }
