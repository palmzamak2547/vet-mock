#!/usr/bin/env node
// ============================================================
// ingest-verifications.mjs — turn sourced claims into verified knowledge
// ============================================================
// Usage:
//   node scripts/ingest-verifications.mjs <claims.json> --subject <id>
//   node scripts/ingest-verifications.mjs <claims.json> --subject <id> --write
//
// <claims.json> is either an array of claims or a workflow result envelope
// containing one. Each claim looks like:
//   { topicId, sectionHeading, statement, supported,
//     sourceKind, pmid?, doi?, sourceTitle, journalOrOrg, year, locator,
//     url?, supportQuote }
//
// What this does, in order:
//   1. RESOLVES every pmid/doi against NCBI E-utilities or Crossref, throttled,
//      with retries, and compares the returned title to the claimed one.
//   2. ANCHORS each claim to a real section by matching sectionHeading against
//      the live note corpus, so a claim can never attach to a section that
//      does not exist.
//   3. MERGES the survivors into sources.js and verification.js.
//
// The point of step 1 is that an agent's citation is a proposal, not evidence.
// Identifiers written from memory are usually wrong, and a knowledge base whose
// citations do not resolve is worse than one with no citations, because it
// looks trustworthy. Nothing reaches the repo without the registry agreeing.
//
// A claim is DROPPED (never silently downgraded) when:
//   • its identifier resolves to nothing
//   • its identifier resolves to a different work
//   • its sectionHeading matches no section in that topic
// Anything the network could not settle is reported as inconclusive and also
// dropped — for ingestion, "unproven" and "unchecked" are treated the same,
// because both mean we cannot yet stand behind it.
// ============================================================

import fs from 'node:fs';
import { loadTopic } from '../src/lib/vetwiki/index.js';

const [, , FILE] = process.argv;
const argOf = (flag) => { const i = process.argv.indexOf(flag); return i === -1 ? null : process.argv[i + 1]; };
const SUBJECT = argOf('--subject');
const WRITE = process.argv.includes('--write');
const TODAY = argOf('--date') || new Date().toISOString().slice(0, 10);

if (!FILE || !SUBJECT) {
  console.error('usage: ingest-verifications.mjs <claims.json> --subject <id> [--write] [--date YYYY-MM-DD]');
  process.exit(2);
}

const UA = 'VetMock-source-verifier (educational; mailto:palmzamak2547@gmail.com)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastAt = 0;

async function getOnce(url) {
  const wait = lastAt + 350 - Date.now();
  if (wait > 0) await sleep(wait);
  lastAt = Date.now();
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 15000);
  try {
    const r = await fetch(url, { signal: c.signal, headers: { 'User-Agent': UA, Accept: 'application/json' } });
    return { ok: r.ok, status: r.status, body: r.ok ? await r.json() : null };
  } catch (e) { return { networkError: e.message }; } finally { clearTimeout(t); }
}

// NCBI drops requests above ~3/s and returns an empty record, which is
// indistinguishable from "no such id". Retry before concluding anything.
async function get(url) {
  let last;
  for (let i = 0; i < 3; i++) {
    last = await getOnce(url);
    if (last.ok || last.status === 404) return last;
    await sleep(700 * (i + 1));
  }
  return last;
}

function titlesAgree(a, b) {
  const norm = (s) => String(s || '').toLowerCase().normalize('NFKD')
    .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const A = new Set(norm(a).split(' ').filter((w) => w.length > 3));
  const B = new Set(norm(b).split(' ').filter((w) => w.length > 3));
  if (!A.size || !B.size) return false;
  let shared = 0;
  for (const w of A) if (B.has(w)) shared++;
  return shared / Math.min(A.size, B.size) >= 0.5;
}

const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const envelope = typeof raw.result === 'string' ? JSON.parse(raw.result) : (raw.result || raw);
const claims = Array.isArray(envelope) ? envelope : (envelope.claims || []);
console.log(`${claims.length} claim(s) proposed for subject '${SUBJECT}'\n`);

// ---- step 2 prep: real sections, so a claim cannot anchor to nothing -----
const sectionsByTopic = new Map();
for (const c of claims) {
  if (sectionsByTopic.has(c.topicId)) continue;
  const t = loadTopic(SUBJECT, c.topicId);
  sectionsByTopic.set(c.topicId, t ? new Map(t.sections.map((s) => [s.heading, s.id])) : null);
}

const accepted = [], dropped = [];

for (const c of claims) {
  if (!c.supported) { dropped.push({ c, why: 'agent reported no source found' }); continue; }

  const secs = sectionsByTopic.get(c.topicId);
  if (!secs) { dropped.push({ c, why: `topic '${c.topicId}' not in subject '${SUBJECT}'` }); continue; }
  const sId = secs.get(c.sectionHeading);
  if (!sId) { dropped.push({ c, why: `no section titled "${String(c.sectionHeading).slice(0, 50)}"` }); continue; }
  c._sectionId = sId;

  if (c.pmid) {
    const r = await get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${encodeURIComponent(c.pmid)}&retmode=json`);
    const rec = r.body?.result?.[String(c.pmid)];
    if (r.networkError || !r.ok || !rec) { dropped.push({ c, why: `PMID ${c.pmid} inconclusive` }); continue; }
    if (rec.error) { dropped.push({ c, why: `PMID ${c.pmid} resolves to nothing` }); continue; }
    if (!titlesAgree(c.sourceTitle, rec.title)) { dropped.push({ c, why: `PMID ${c.pmid} is a different paper: "${String(rec.title).slice(0, 60)}"` }); continue; }
    accepted.push({
      ...c,
      _title: rec.title,
      _org: rec.source,
      _year: Number(String(rec.pubdate || '').match(/\d{4}/)?.[0]) || c.year,
      // captured so the source entry can carry a real citation string built
      // from what the registry returned, rather than one assembled by guesswork
      _author: rec.sortfirstauthor || rec.authors?.[0]?.name || '',
      _vol: rec.volume || '',
      _issue: rec.issue || '',
      _pages: rec.pages || '',
    });
    continue;
  }
  if (c.doi) {
    const r = await get(`https://api.crossref.org/works/${encodeURIComponent(c.doi)}`);
    if (r.networkError || (!r.ok && r.status !== 404)) { dropped.push({ c, why: `DOI ${c.doi} inconclusive` }); continue; }
    const m = r.body?.message;
    if (r.status === 404 || !m) { dropped.push({ c, why: `DOI ${c.doi} resolves to nothing` }); continue; }
    const title = Array.isArray(m.title) ? m.title[0] : m.title;
    if (!titlesAgree(c.sourceTitle, title)) { dropped.push({ c, why: `DOI ${c.doi} is a different work: "${String(title).slice(0, 60)}"` }); continue; }
    const au = m.author?.[0];
    accepted.push({ ...c, _title: title, _org: m['container-title']?.[0] || c.journalOrOrg, _year: m.issued?.['date-parts']?.[0]?.[0] || c.year,
      _author: au ? [au.family, au.given].filter(Boolean).join(' ') : '', _vol: m.volume || '', _issue: m.issue || '', _pages: m.page || '' });
    continue;
  }

  // Guideline with no machine-resolvable identifier. Allowed, but recorded as
  // expert-consensus rather than established, and its source is 'named' so
  // verify:sources never claims to have proved it.
  if (c.sourceKind === 'guideline' && c.sourceTitle) {
    accepted.push({ ...c, _title: c.sourceTitle, _org: c.journalOrOrg, _year: c.year, _guidelineOnly: true });
    continue;
  }
  dropped.push({ c, why: 'no pmid, doi, or named guideline' });
}

console.log(`accepted : ${accepted.length}`);
console.log(`dropped  : ${dropped.length}`);
for (const d of dropped.slice(0, 25)) console.log(`   ✗ [${d.c.topicId}] ${d.why}`);

if (!accepted.length) { console.log('\nnothing to merge.'); process.exitCode = dropped.length ? 1 : 0; }

const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();

// ---- build source entries ------------------------------------------------
const sources = new Map();
for (const c of accepted) {
  const id = c.pmid ? `pmid-${c.pmid}`
    : c.doi ? `doi-${String(c.doi).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`.slice(0, 52)
      : `guide-${String(c._org || 'org').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 22)}-${c._year || 'na'}`;
  c._sourceId = id;
  if (!sources.has(id)) sources.set(id, c);
}

const srcLines = [];
for (const [id, c] of sources) {
  srcLines.push(`  '${id}': {`);
  srcLines.push(`    id: '${id}',`);
  srcLines.push(`    title: '${esc(c._title)}',`);
  srcLines.push(`    organization: '${esc(c._org || '')}',`);
  srcLines.push(`    kind: '${c.sourceKind || 'primary-literature'}',`);
  if (c._year) srcLines.push(`    year: ${c._year},`);
  if (c.pmid) srcLines.push(`    pmid: '${esc(c.pmid)}',`);
  if (c.doi) srcLines.push(`    doi: '${esc(c.doi)}',`);
  const url = c.url || (c.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/` : null);
  if (url) srcLines.push(`    url: '${esc(url)}',`);
  // A citation assembled ONLY from fields the registry actually returned. Any
  // part the registry did not give is simply omitted rather than guessed, so
  // the string is always short of the truth and never ahead of it.
  const vol = [c._vol, c._issue && `(${c._issue})`].filter(Boolean).join('');
  const volPages = [vol, c._pages].filter(Boolean).join(':');
  const citation = [c._author, c._title, c._org, c._year && String(c._year)]
    .filter(Boolean).join('. ')
    + (volPages ? `;${volPages}` : '')
    + (c.pmid ? `. PMID: ${c.pmid}` : '')
    + (c.doi ? `. doi:${c.doi}` : '')
    + '.';
  srcLines.push(`    citation: '${esc(citation)}',`);
  srcLines.push(`    availability: '${c._guidelineOnly ? 'named' : 'verified-online'}',`);
  srcLines.push('  },');
}


// ---- merge into the generated overlay ------------------------------------
// Merged in memory and rewritten wholesale, never appended as text. Appending a
// second 'com5--rabies' key to an object literal is last-one-wins, and doing
// exactly that silently deleted three hand-verified rabies claims the first
// time this ran on a subject that already had a curated overlay.
const GEN_FILE = 'src/lib/vetwiki/verification-generated.js';
const { GENERATED_VERIFICATIONS: existingGen } =
  await import(`../src/lib/vetwiki/verification-generated.js?t=${Date.now()}`);
const gen = JSON.parse(JSON.stringify(existingGen));

const oneLine = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();

let added = 0, updated = 0;
for (const c of accepted) {
  const tId = `${SUBJECT}--${c.topicId}`;
  gen[tId] ||= {};
  gen[tId][c._sectionId] ||= { claims: [] };
  const claims = gen[tId][c._sectionId].claims;
  const claim = {
    id: `${c._sectionId}--v${claims.length + 1}`,
    statement: oneLine(c.statement),
    evidenceStatus: c._guidelineOnly ? 'expert-consensus' : 'established',
    reviewStatus: 'verified',
    sourceRefs: [{
      sourceId: c._sourceId,
      locator: oneLine(c.locator),
      kind: c.sourceKind || 'primary-literature',
    }],
    review: {
      reviewedBy: 'reference-verified',
      reviewedAt: TODAY,
      method: 'reference-cross-check',
      approvedScopes: ['learning', 'assessment'],
      rationale: oneLine(c.supportQuote).slice(0, 240),
    },
  };
  // Idempotent: re-ingesting the same claims file updates in place rather than
  // duplicating, so a re-run after a fix is safe.
  const at = claims.findIndex((x) => x.statement === claim.statement);
  if (at === -1) { claims.push(claim); added++; }
  else { claims[at] = { ...claim, id: claims[at].id }; updated++; }
}

const nTopics = Object.keys(gen).length;
const nSections = Object.values(gen).reduce((a, t) => a + Object.keys(t).length, 0);
const nClaims = Object.values(gen).reduce(
  (a, t) => a + Object.values(t).reduce((b, s) => b + s.claims.length, 0), 0);
console.log(`\noverlay becomes ${nTopics} topic(s), ${nSections} section(s), ${nClaims} claim(s)`
  + ` (+${added} new, ${updated} updated); ${sources.size} source(s) referenced`);

if (!WRITE) { console.log('\n(dry run — pass --write to merge)'); process.exit(0); }

const header = fs.readFileSync(GEN_FILE, 'utf8').split('/** @type')[0];
fs.writeFileSync(GEN_FILE,
  `${header}/** @type {Record<string, Record<string, {claims: object[]}>>} */\n`
  + `export const GENERATED_VERIFICATIONS = ${JSON.stringify(gen, null, 2)};\n\n`
  + 'export default GENERATED_VERIFICATIONS;\n');

// sources.js is keyed by a unique source id, so appending genuinely NEW ids is
// safe. Ids already present are skipped rather than re-appended, which would
// create the same last-one-wins duplicate problem in that file.
const sourcesText = fs.readFileSync('src/lib/vetwiki/sources.js', 'utf8');
const fresh = [...sources.keys()].filter((id) => !sourcesText.includes(`'${id}': {`));

if (fresh.length) {
  const keep = [];
  let emitting = false;
  for (const line of srcLines) {
    const m = line.match(/^ {2}'([^']+)': \{$/);
    if (m) emitting = fresh.includes(m[1]);
    if (emitting) keep.push(line);
    if (line === '  },') emitting = false;
  }
  const at = sourcesText.lastIndexOf('\n};');
  if (at === -1) throw new Error('could not find the end of SOURCES');
  fs.writeFileSync('src/lib/vetwiki/sources.js',
    `${sourcesText.slice(0, at)}\n\n  // ---- ${SUBJECT} sourcing pass, ${TODAY} ----\n`
    + `${keep.join('\n')}${sourcesText.slice(at)}`);
}

console.log(`\n✅ overlay rewritten; ${fresh.length} new source(s) appended`);
