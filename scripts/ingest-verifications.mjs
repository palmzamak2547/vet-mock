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
    accepted.push({ ...c, _title: rec.title, _org: rec.source, _year: Number(String(rec.pubdate || '').match(/\d{4}/)?.[0]) || c.year });
    continue;
  }
  if (c.doi) {
    const r = await get(`https://api.crossref.org/works/${encodeURIComponent(c.doi)}`);
    if (r.networkError || (!r.ok && r.status !== 404)) { dropped.push({ c, why: `DOI ${c.doi} inconclusive` }); continue; }
    const m = r.body?.message;
    if (r.status === 404 || !m) { dropped.push({ c, why: `DOI ${c.doi} resolves to nothing` }); continue; }
    const title = Array.isArray(m.title) ? m.title[0] : m.title;
    if (!titlesAgree(c.sourceTitle, title)) { dropped.push({ c, why: `DOI ${c.doi} is a different work: "${String(title).slice(0, 60)}"` }); continue; }
    accepted.push({ ...c, _title: title, _org: m['container-title']?.[0] || c.journalOrOrg, _year: m.issued?.['date-parts']?.[0]?.[0] || c.year });
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
  srcLines.push(`    availability: '${c._guidelineOnly ? 'named' : 'verified-online'}',`);
  srcLines.push('  },');
}

// ---- build verification overlay -----------------------------------------
const byTopic = new Map();
for (const c of accepted) {
  const tId = `${SUBJECT}--${c.topicId}`;
  if (!byTopic.has(tId)) byTopic.set(tId, new Map());
  const m = byTopic.get(tId);
  if (!m.has(c._sectionId)) m.set(c._sectionId, []);
  m.get(c._sectionId).push(c);
}

const vLines = [];
vLines.push(`  // ${SUBJECT} sourcing pass, ${TODAY} — every identifier resolved against`);
vLines.push(`  // NCBI/Crossref and title-matched before being written here.`);
for (const [tId, secs] of byTopic) {
  vLines.push(`  '${tId}': {`);
  for (const [sId, cs] of secs) {
    vLines.push(`    '${sId}': {`);
    vLines.push('      claims: [');
    cs.forEach((c, i) => {
      vLines.push('        {');
      vLines.push(`          id: '${sId}--v${i + 1}',`);
      vLines.push(`          statement: '${esc(c.statement)}',`);
      vLines.push(`          evidenceStatus: '${c._guidelineOnly ? 'expert-consensus' : 'established'}',`);
      vLines.push("          reviewStatus: 'verified',");
      vLines.push(`          sourceRefs: [{ sourceId: '${c._sourceId}', locator: '${esc(c.locator || '')}', kind: '${c.sourceKind || 'primary-literature'}' }],`);
      vLines.push(`          review: { reviewedBy: 'reference-verified', reviewedAt: '${TODAY}', method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: '${esc(String(c.supportQuote || '').slice(0, 240))}' },`);
      vLines.push('        },');
    });
    vLines.push('      ],');
    vLines.push('    },');
  }
  vLines.push('  },');
}

console.log(`\nwould add ${sources.size} source(s), ${byTopic.size} topic(s), ${[...byTopic.values()].reduce((a, m) => a + m.size, 0)} section(s), ${accepted.length} claim(s)`);

if (!WRITE) { console.log('\n(dry run — pass --write to merge)'); process.exit(0); }

const spliceInto = (file, block, label) => {
  let s = fs.readFileSync(file, 'utf8');
  const at = s.lastIndexOf('\n};');
  if (at === -1) throw new Error(`could not find the end of the exported object in ${file}`);
  s = `${s.slice(0, at)}\n\n${label}\n${block}${s.slice(at)}`;
  fs.writeFileSync(file, s);
};

spliceInto('src/lib/vetwiki/sources.js', srcLines.join('\n'), `  // ---- ${SUBJECT} sourcing pass, ${TODAY} ----`);
spliceInto('src/lib/vetwiki/verification.js', vLines.join('\n'), '');
console.log('\n✅ merged into sources.js and verification.js');
