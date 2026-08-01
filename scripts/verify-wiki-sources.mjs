#!/usr/bin/env node
// ============================================================
// verify-wiki-sources.mjs — prove every VetWiki source is real
// ============================================================
// Usage:
//   node scripts/verify-wiki-sources.mjs            # check everything
//   node scripts/verify-wiki-sources.mjs --ids a,b  # check a subset
//   VETWIKI_SOURCES_OFFLINE=1 npm run ...           # skip network, exit 0
//
// sources.js says every entry is real and that `availability:'verified-online'`
// means the citation was confirmed against the live source during authoring.
// Nothing re-confirmed it afterwards, so the strongest claim in the knowledge
// base rested on a promise. A DOI that never existed, or a guideline URL that
// moved, would sit there indefinitely looking verified.
//
// This resolves each identifier against a live registry and compares the
// returned title with the registered one:
//   pmid -> NCBI E-utilities esummary
//   doi  -> Crossref REST
//   url  -> reachability only (many publishers block bots, so a non-2xx URL
//           is reported but never fails the gate on its own)
//
// FAILS the build on: an identifier that resolves to nothing, or one that
// resolves to a clearly different work. Those are the two ways a citation is
// actually fabricated or wrong.
//
// NEVER fails on: network unreachable, rate limiting, or a `named` source with
// no identifier. Being offline is not evidence of fabrication, and a gate that
// red-lights on a flaky connection gets switched off, which costs more than it
// saves.
// ============================================================

import { SOURCES } from '../src/lib/vetwiki/sources.js';

const OFFLINE = process.env.VETWIKI_SOURCES_OFFLINE === '1';
const idsArg = process.argv.indexOf('--ids');
const onlyIds = idsArg !== -1 ? new Set(String(process.argv[idsArg + 1] || '').split(',').filter(Boolean)) : null;

const UA = 'VetMock-source-verifier (educational; mailto:palmzamak2547@gmail.com)';
const TIMEOUT_MS = 15000;

async function get(url, accept = 'application/json') {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, { signal: c.signal, headers: { 'User-Agent': UA, Accept: accept } });
    return { ok: r.ok, status: r.status, body: r.ok && accept.includes('json') ? await r.json() : null };
  } catch (e) {
    return { networkError: e.name === 'AbortError' ? 'timeout' : e.message };
  } finally { clearTimeout(t); }
}

/** Loose title comparison — publishers vary punctuation, case and subtitles. */
function titlesAgree(a, b) {
  const norm = (s) => String(s || '').toLowerCase().normalize('NFKD')
    .replace(/[^a-z0-9฀-๿ ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const A = new Set(norm(a).split(' ').filter((w) => w.length > 3));
  const B = new Set(norm(b).split(' ').filter((w) => w.length > 3));
  if (!A.size || !B.size) return true; // nothing to compare on, don't invent a failure
  let shared = 0;
  for (const w of A) if (B.has(w)) shared++;
  return shared / Math.min(A.size, B.size) >= 0.5;
}

async function resolvePmid(pmid) {
  const r = await get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${encodeURIComponent(pmid)}&retmode=json`);
  if (r.networkError) return { unchecked: r.networkError };
  if (!r.ok) return { unchecked: `HTTP ${r.status}` };
  const rec = r.body?.result?.[String(pmid)];
  if (!rec || rec.error) return { missing: true };
  return { title: rec.title, extra: `${rec.source || ''} ${rec.pubdate || ''}`.trim() };
}

async function resolveDoi(doi) {
  const r = await get(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
  if (r.networkError) return { unchecked: r.networkError };
  if (r.status === 404) return { missing: true };
  if (!r.ok) return { unchecked: `HTTP ${r.status}` };
  const m = r.body?.message;
  if (!m) return { missing: true };
  return { title: Array.isArray(m.title) ? m.title[0] : m.title, extra: m['container-title']?.[0] || '' };
}

async function checkUrl(url) {
  const r = await get(url, 'text/html');
  if (r.networkError) return { unchecked: r.networkError };
  return { status: r.status, ok: r.ok };
}

const entries = Object.values(SOURCES).filter((s) => !onlyIds || onlyIds.has(s.id));
console.log(`Verifying ${entries.length} VetWiki source(s)${OFFLINE ? ' — OFFLINE mode, network checks skipped' : ''}\n`);

const errors = [];
const warnings = [];
let resolved = 0, unchecked = 0, noIdentifier = 0, urlOnly = 0;

for (const s of entries) {
  if (OFFLINE) continue;

  if (s.pmid || s.doi) {
    const res = s.pmid ? await resolvePmid(s.pmid) : await resolveDoi(s.doi);
    const label = s.pmid ? `PMID ${s.pmid}` : `DOI ${s.doi}`;
    if (res.unchecked) { unchecked++; warnings.push(`${s.id}: could not check ${label} (${res.unchecked})`); continue; }
    if (res.missing) { errors.push(`${s.id}: ${label} does not resolve to any record — the identifier is wrong or fabricated`); continue; }
    if (!titlesAgree(s.title, res.title)) {
      errors.push(`${s.id}: ${label} resolves to a DIFFERENT work\n      registered: ${s.title}\n      resolved  : ${res.title}`);
      continue;
    }
    resolved++;
    console.log(`  ✅ ${s.id} — ${label} → "${String(res.title).slice(0, 62)}"`);
    continue;
  }

  if (s.availability === 'named') { noIdentifier++; continue; }

  if (s.url) {
    urlOnly++;
    const res = await checkUrl(s.url);
    if (res.unchecked) { unchecked++; continue; }
    if (!res.ok) warnings.push(`${s.id}: url returned HTTP ${res.status} — may have moved (${s.url})`);
    continue;
  }

  warnings.push(`${s.id}: marked '${s.availability}' but carries no pmid, doi or url to check`);
}

console.log(`\nresolved identifiers : ${resolved}`);
console.log(`url-only (reachability only) : ${urlOnly}`);
console.log(`named, no identifier by design : ${noIdentifier}`);
console.log(`could not check (network) : ${unchecked}`);

if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`   • ${w}`);
}

if (errors.length) {
  console.log(`\n❌ ${errors.length} error(s):`);
  for (const e of errors) console.log(`   • ${e}`);
  console.log('\nA source that does not resolve cannot back a verified claim. Fix the identifier or drop the claim to draft.');
  // process.exitCode, NOT process.exit(). Forcing exit here while undici still
  // holds fetch sockets aborts the process on Windows with
  //   Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), src\win\async.c
  // which surfaces as exit 127 ("command not found") — CI would fail for the
  // right reason but point at a phantom missing binary. Letting the loop drain
  // exits cleanly with 1.
  process.exitCode = 1;
} else {
  console.log('\n✅ Every checkable source resolved to the work it claims to be.');
}
