// ============================================================
// ai/papers.js — research papers from PubMed (OpenAlex as the fallback)
// ============================================================
// For "หางานวิจัย PRRSV ล่าสุด" and for questions the course material does not
// cover, the chat looks the literature up instead of reciting it from memory:
// a paper card the student can open, and the abstracts as numbered sources
// the answer must cite. A model asked for "recent papers" without a search
// invents titles; a search cannot.
//
// PubMed E-utilities: esearch (ids), then esummary (title, journal, year,
// authors, DOI) and efetch (abstracts) in parallel. Identified as
// tool=vetmock-ai with the product URL as the User-Agent contact; no e-mail
// parameter is sent, and nobody's address appears anywhere (an optional
// NCBI_API_KEY raises the rate limit). OpenAlex answers when PubMed fails or
// finds nothing. Results are cached in the shared KV for a day, keyed by the
// search itself, so a popular question costs one search per day.
//
// Abstracts are third-party text: they are handed to the model as DATA inside
// a source block, never as instructions (prompt.js says so to the model).
// ============================================================

import { createHash } from 'node:crypto';
import { kvGetJSON, kvSetJSON } from '../rate-limit.js';
import { RESEARCH_TIMEOUT_MS } from './config.js';
import { paperLink } from './links.js';
import { clip } from './text.js';

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const OPENALEX = 'https://api.openalex.org/works';
export const USER_AGENT = 'VetMock (https://vetmock.com)';
const CACHE_TTL_S = 24 * 60 * 60;
const MAX_PAPERS = 5;

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
// Inline markup PubMed puts in titles and abstracts. esummary sends it
// entity-encoded (&lt;i&gt;), efetch as real tags; after decoding, only these
// names are removed, so a literal "<37>" in an abstract survives.
const INLINE_TAG = /<\/?(?:i|b|u|em|strong|sup|sub|span|sc|mml:[a-z]+)(?:\s[^>]*)?>/gi;
export function decodeXml(s) {
  return String(s ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
      if (e[0] === '#') {
        const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .replace(INLINE_TAG, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Search words usable in an English-language index: ASCII words, quoted phrases. */
export function cleanTerms(terms) {
  return [...new Set((terms || [])
    .map((t) => String(t || '').replace(/[^A-Za-z0-9 .\-/]/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((t) => t.length >= 2))].slice(0, 4);
}

export function pubmedTerm(terms) {
  return cleanTerms(terms).map((t) => (/\s/.test(t) ? `"${t}"` : t)).join(' AND ');
}

const authorLine = (names) => {
  const list = names.filter(Boolean);
  return list.length > 3 ? `${list.slice(0, 3).join(', ')}, et al.` : list.join(', ');
};

/** PMID → abstract text, from an efetch XML document. */
export function parseEfetchAbstracts(xml) {
  const out = new Map();
  for (const block of String(xml || '').split(/<PubmedArticle[\s>]/).slice(1)) {
    const pmid = /<PMID[^>]*>(\d+)<\/PMID>/.exec(block)?.[1];
    if (!pmid) continue;
    const parts = [];
    for (const m of block.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)) {
      const label = /Label="([^"]+)"/.exec(m[1])?.[1];
      const text = decodeXml(m[2]);
      if (text) parts.push(label ? `${label}: ${text}` : text);
    }
    if (parts.length) out.set(pmid, parts.join(' '));
  }
  return out;
}

/** Papers from an esummary JSON reply, in the order PubMed ranked them. */
export function papersFromSummary(summary, ids, abstracts = new Map()) {
  const result = summary?.result || {};
  return ids.map((id) => {
    const r = result[id];
    if (!r || r.error) return null;
    const doi = (r.articleids || []).find((a) => a.idtype === 'doi')?.value || null;
    const year = Number(/\d{4}/.exec(r.pubdate || r.epubdate || '')?.[0]) || null;
    const paper = {
      title: decodeXml(r.title).replace(/\.$/, ''),
      journal: decodeXml(r.fulljournalname || r.source || ''),
      year,
      authors: authorLine((r.authors || []).filter((a) => !a.authtype || a.authtype === 'Author').map((a) => a.name)),
      pmid: String(id),
      ...(doi ? { doi } : {}),
      abstract: abstracts.get(String(id)) || '',
    };
    paper.url = paperLink(paper);
    return paper.title && paper.url ? paper : null;
  }).filter(Boolean);
}

/** OpenAlex keeps abstracts as word → positions; put the words back in order. */
export function invertedAbstract(inv) {
  if (!inv || typeof inv !== 'object') return '';
  const words = [];
  for (const [w, positions] of Object.entries(inv)) for (const p of positions || []) words[p] = w;
  return words.filter((w) => w !== undefined).join(' ').replace(/\s+/g, ' ').trim();
}

export function papersFromOpenAlex(json) {
  return (json?.results || []).map((w) => {
    const pmid = /(\d+)\/?$/.exec(w.ids?.pmid || '')?.[1] || null;
    const doi = String(w.doi || '').replace(/^https?:\/\/(dx\.)?doi\.org\//i, '') || null;
    const paper = {
      title: decodeXml(w.display_name || w.title || ''),
      journal: decodeXml(w.primary_location?.source?.display_name || ''),
      year: Number(w.publication_year) || null,
      authors: authorLine((w.authorships || []).map((a) => a?.author?.display_name)),
      ...(pmid ? { pmid } : {}),
      ...(doi ? { doi } : {}),
      abstract: invertedAbstract(w.abstract_inverted_index),
    };
    paper.url = paperLink(paper);
    return paper.title && paper.url ? paper : null;
  }).filter(Boolean);
}

async function get(url, { signal, fetchImpl, as }) {
  const res = await fetchImpl(url, { headers: { 'User-Agent': USER_AGENT, Accept: as === 'json' ? 'application/json' : '*/*' }, signal });
  if (!res.ok) throw Object.assign(new Error(`http ${res.status}`), { status: res.status });
  return as === 'json' ? res.json() : res.text();
}

export async function searchPubMed(terms, { recent = false, signal, fetchImpl = fetch, apiKey = '', max = MAX_PAPERS } = {}) {
  const term = pubmedTerm(terms);
  if (!term) return [];
  const base = { db: 'pubmed', tool: 'vetmock-ai', ...(apiKey ? { api_key: apiKey } : {}) };
  const search = new URLSearchParams({ ...base, term: `(${term}) AND hasabstract`, retmode: 'json', retmax: String(max), sort: recent ? 'pub_date' : 'relevance' });
  const found = await get(`${EUTILS}/esearch.fcgi?${search}`, { signal, fetchImpl, as: 'json' });
  const ids = (found?.esearchresult?.idlist || []).filter((id) => /^\d+$/.test(id)).slice(0, max);
  if (!ids.length) return [];
  const byId = new URLSearchParams({ ...base, id: ids.join(',') });
  const [summary, xml] = await Promise.all([
    get(`${EUTILS}/esummary.fcgi?${byId}&retmode=json`, { signal, fetchImpl, as: 'json' }),
    // Without abstracts the papers are still real and still linkable.
    get(`${EUTILS}/efetch.fcgi?${byId}&rettype=abstract&retmode=xml`, { signal, fetchImpl, as: 'text' }).catch(() => ''),
  ]);
  return papersFromSummary(summary, ids, parseEfetchAbstracts(xml));
}

export async function searchOpenAlex(terms, { recent = false, signal, fetchImpl = fetch, max = MAX_PAPERS, now = new Date() } = {}) {
  const words = cleanTerms(terms).join(' ');
  if (!words) return [];
  const filter = ['has_abstract:true'];
  if (recent) filter.push(`from_publication_date:${now.getUTCFullYear() - 3}-01-01`);
  const params = new URLSearchParams({ search: words, per_page: String(max), filter: filter.join(',') });
  return papersFromOpenAlex(await get(`${OPENALEX}?${params}`, { signal, fetchImpl, as: 'json' }));
}

/**
 * Papers for a set of English search terms.
 * @returns {Promise<{ papers: Array, source: 'pubmed'|'openalex'|'cache'|null, failed?: boolean }>}
 */
export async function findPapers(terms, {
  recent = false, signal, env = process.env, fetchImpl = fetch, timeoutMs = RESEARCH_TIMEOUT_MS,
  kv = { get: kvGetJSON, set: kvSetJSON },
} = {}) {
  const clean = cleanTerms(terms);
  if (!clean.length) return { papers: [], source: null };
  const key = `ai-chat:papers:v1:${createHash('sha1').update(JSON.stringify({ t: clean.map((t) => t.toLowerCase()), recent })).digest('hex')}`;
  const cached = await kv.get(key);
  if (Array.isArray(cached?.papers) && cached.papers.length) return { papers: cached.papers, source: 'cache' };

  const limit = AbortSignal.timeout(timeoutMs);
  const sig = signal ? AbortSignal.any([signal, limit]) : limit;
  let failed = false;
  try {
    const papers = await searchPubMed(clean, { recent, signal: sig, fetchImpl, apiKey: env.NCBI_API_KEY || '' });
    if (papers.length) {
      await kv.set(key, { papers }, CACHE_TTL_S);
      return { papers, source: 'pubmed' };
    }
  } catch (err) {
    failed = true;
    console.warn('[ai-chat] pubmed', err?.status || err?.name || 'error');
  }
  if (sig.aborted) return { papers: [], source: null, failed: true };
  try {
    const papers = await searchOpenAlex(clean, { recent, signal: sig, fetchImpl });
    if (papers.length) {
      await kv.set(key, { papers }, CACHE_TTL_S);
      return { papers, source: 'openalex' };
    }
  } catch (err) {
    failed = true;
    console.warn('[ai-chat] openalex', err?.status || err?.name || 'error');
  }
  return { papers: [], source: null, failed };
}

/** The papers card the page renders. */
export function papersCard(papers) {
  return {
    type: 'papers',
    items: papers.map((p) => ({
      title: p.title,
      journal: p.journal,
      year: p.year,
      authors: p.authors,
      url: p.url,
      ...(p.pmid ? { pmid: p.pmid } : {}),
      ...(p.doi ? { doi: p.doi } : {}),
      ...(p.abstract ? { abstract: clip(p.abstract, 600) } : {}),
    })),
  };
}
