// ============================================================
// ai/library.js — lecture slides and handouts from the study library
// ============================================================
// The library is a Supabase table (library_docs) with the text of every page
// (library_doc_pages) and a search over it (library_search, migration
// 20261020230000): documents whose pages hold every term of a query, with the
// first matching page, a hit count and a snippet. The route asks as anon, so
// only public documents come back, and every one of them opens without a
// login through /api/library-file (a signed, short-lived link: ?open=1
// redirects to it, &dl=1 makes it a download, #page=N opens at the page).
//
// Two uses, one search:
//   findFiles(..., { files: true })  the student asked for files ("ขอสไลด์
//       rabies"): up to 8 documents, the requested kind first; the card IS
//       the answer.
//   findFiles(...)                   an ordinary answer: the 3 documents
//       whose pages discuss it, each opened at its page, and the text of the
//       best pages, so the answer can cite the lecturer's own slide.
//
// Ranking: raw hit counts favour long documents (a 952-page compilation
// "mentions" everything), so a document is scored on whether its title names
// the topic, on hit density, on its kind and on the subject asked about,
// with only a logarithm of the raw count. A page whose Thai came out of the
// PDF mis-encoded (legacy font mapping, e.g. "o°ÄÁÈª´") is never shown or
// quoted.
//
// Nothing here may fail a turn: a missing config, a slow database or a bad
// reply gives no files, and the answer goes on without them.
// ============================================================

import { SUBJECTS } from '../../../src/data/curriculum.js';
import { EXTERNAL_COURSES } from '../../../src/data/library-courses.js';
import { clip } from './text.js';

const SITE = 'https://vetmock.com';
const TIMEOUT_MS = 1400;
const FILES_TIMEOUT_MS = 4000;
// the score a document needs to sit beside an answer (see rankFiles: a deck
// named for the topic scores 8+, a guideline with the topic on a tenth of its
// pages ~4.5, a syllabus that mentions it once ~2.9)
const RELATED_FLOOR = 3.5;
const COLUMNS = 'id,slug,title,kind,subject,year,semester,academic_year,lecturer,page_count,byte_size,mime';

export const FILE_KINDS = Object.freeze({
  slide: 'สไลด์',
  handout: 'เอกสารประกอบ',
  summary: 'สรุป',
  textbook: 'ตำรา',
  pastpaper: 'ข้อสอบเก่า',
  guideline: 'แนวปฏิบัติ',
  other: 'เอกสาร',
});

const ADMIN_TITLE = /syllabus|course (?:outline|plan|schedule)|time ?table|schedule|ประมวลรายวิชา|แผนการสอน|ตารางเรียน|ตารางสอน|ตารางสอบ|มคอ/i;

// What a kind is worth when the student did not ask for one: the lecture's
// own material first, compilations last.
const KIND_WEIGHT = { slide: 1.2, handout: 1, summary: 1, guideline: 0.7, textbook: 0.6, other: 0.4, pastpaper: 0.3 };

const SUBJECT_NAME = new Map([
  ...SUBJECTS.filter((s) => s.id && s.id !== 'all').map((s) => [s.id, s.name]),
  ...EXTERNAL_COURSES.map((c) => [c.code, c.name]),
]);

export function subjectLabel(id) {
  if (!id) return '';
  return SUBJECT_NAME.get(id) || (id.length <= 5 ? id.toUpperCase() : id);
}

export function libraryConfig(env = process.env) {
  const base = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
  return base && key ? { base: String(base).replace(/\/$/, ''), key } : null;
}

/**
 * Text pulled from a PDF whose Thai font had no Unicode map comes out as
 * Latin-1 letters and symbols ("o°ÄÁÈª´¸µÁ"). Real text in this library is
 * Thai, English or Greek; a run of those Latin-1 characters is not.
 */
export function garbled(text) {
  const s = String(text || '');
  const odd = (s.match(/[\u00A2-\u00BF\u00C0-\u00FF]/g) || []).length;
  const letters = (s.match(/[A-Za-z\u0E00-\u0E7F\u00C0-\u00FF]/g) || []).length;
  return odd >= 4 && odd / Math.max(1, letters) > 0.12;
}

/** A title as a person reads it: no file extension ("Swine medicine (VCA58-67).pdf"). */
export const displayTitle = (t) => String(t || '').replace(/\.(pdf|docx?|pptx?|xlsx?)$/i, '').trim();

/** The file format a download will be, for the card. */
export function formatOf(mime = '', title = '') {
  const m = String(mime).toLowerCase();
  if (m.includes('pdf')) return 'PDF';
  if (m.includes('presentation') || /\.pptx?$/i.test(title)) return 'PPTX';
  if (m.includes('wordprocessing') || m.includes('msword') || /\.docx?$/i.test(title)) return 'DOCX';
  if (m.includes('spreadsheet') || /\.xlsx?$/i.test(title)) return 'XLSX';
  return /\.pdf$/i.test(title) ? 'PDF' : '';
}

/** The links a document opens and downloads through (vetmock.com's own gate):
 *  open lands on the matching page; download saves it under its own title. */
export function fileLinks(slug, page, title = '', mime = 'application/pdf') {
  const q = `${SITE}/api/library-file?slug=${encodeURIComponent(slug)}&open=1`;
  const fmt = formatOf(mime, title);
  const ext = fmt ? `.${fmt.toLowerCase()}` : '';
  const name = title ? `&name=${encodeURIComponent(`${displayTitle(title).slice(0, 140)}${ext}`)}` : '';
  return { open: page > 1 ? `${q}#page=${page}` : q, download: `${q}&dl=1${name}` };
}

/** A search phrase as library_search reads it: lower-case words, at most six. */
function phrase(words) {
  // \p{M}: Thai vowel and tone marks are marks, not letters
  return words.join(' ').toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s.-]/gu, ' ').split(/\s+/).filter(Boolean).slice(0, 6).join(' ');
}

// Thai words a question carries that name no topic: searched alone they match
// half the shelf (\u0E40\u0E01\u0E48\u0E32 from \u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E40\u0E01\u0E48\u0E32 found milk quality and ethics readings).
const STOP_TH = new Set(['\u0E42\u0E23\u0E04', '\u0E2D\u0E32\u0E01\u0E32\u0E23', '\u0E40\u0E01\u0E48\u0E32', '\u0E43\u0E2B\u0E21\u0E48', '\u0E27\u0E34\u0E0A\u0E32', '\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A', '\u0E2A\u0E44\u0E25\u0E14\u0E4C', '\u0E44\u0E1F\u0E25\u0E4C', '\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23', '\u0E2A\u0E23\u0E38\u0E1B', '\u0E15\u0E33\u0E23\u0E32', '\u0E0A\u0E35\u0E17',
  '\u0E01\u0E32\u0E23', '\u0E02\u0E2D\u0E07', '\u0E2D\u0E30\u0E44\u0E23', '\u0E22\u0E31\u0E07\u0E44\u0E07', '\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23', '\u0E2B\u0E19\u0E48\u0E2D\u0E22', '\u0E0A\u0E48\u0E27\u0E22', '\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07', '\u0E2A\u0E31\u0E15\u0E27\u0E4C', '\u0E23\u0E31\u0E01\u0E29\u0E32', '\u0E27\u0E34\u0E19\u0E34\u0E08\u0E09\u0E31\u0E22', '\u0E15\u0E23\u0E27\u0E08', '\u0E22\u0E32', '\u0E1C\u0E25', '\u0E23\u0E30\u0E1A\u0E1A', '\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E22']);

/** A retrieval needle as text: retrieve.js hands { thai } or { re } objects;
 *  only the Thai ones are words (the English side comes from the plan's terms). */
export const needleText = (n) => (typeof n === 'string' ? n : n?.thai || '');

/**
 * The phrases worth searching for a turn: the most specific English term,
 * the two most specific together, and the strongest Thai concept that names
 * a topic, so a Thai deck and an English one are both found. Each must be 3+
 * letters (the search returns nothing for less). No topic word, no search.
 */
export function searchPhrases({ terms = [], needles = [], title = '' }) {
  const out = [];
  const add = (p) => { if (p && p.replace(/\s/g, '').length >= 3 && !out.includes(p)) out.push(p); };
  if (title) add(phrase([title]));
  const en = terms.map((t) => String(t).trim()).filter(Boolean);
  if (en[0]) add(phrase([en[0]]));
  if (en[1]) add(phrase([en[0], en[1]]));
  const th = needles.map(needleText).map((t) => t.trim())
    .find((t) => /[\u0E00-\u0E7F]/.test(t) && t.length >= 3 && !STOP_TH.has(t));
  if (th) add(phrase([th]));
  return out.slice(0, 3);
}

/**
 * Score documents for a turn. Pure, so the ranking is tested without a network.
 * @param {Array} docs  catalog rows + { hits, page, snippet, titleHit }
 */
export function rankFiles(docs, { subjects = [], kind = '', terms = [] } = {}) {
  const words = terms.map((t) => String(t).toLowerCase()).filter((t) => t.length >= 3);
  const wantKind = kind && kind !== 'any' ? kind : '';
  return docs
    .map((d) => {
      const title = String(d.title || '').toLowerCase();
      const titleHit = Boolean(d.titleHit || words.some((w) => title.includes(w)));
      const pages = Math.max(1, Number(d.page_count) || 1);
      const hits = Math.max(0, Number(d.hits) || 0);
      // how much of the document is about it, not how long it is
      const density = Math.min(1, (hits / Math.max(5, pages)) * 4);
      // past 100 pages a document is a compilation or a book: it mentions everything
      const bulk = pages > 100 ? Math.log2(pages / 100) * 0.5 : 0;
      let score = (titleHit ? 4 : 0) + Math.log2(1 + hits) * 0.5 + density * 2 + (KIND_WEIGHT[d.kind] ?? 0.4) - bulk;
      // a syllabus or timetable names every topic of a course and teaches none
      if (ADMIN_TITLE.test(d.title || '')) score -= 3;
      if (subjects.includes(d.subject)) score += 1.5;
      return { ...d, titleHit, score, kindMatch: wantKind ? d.kind === wantKind : true };
    })
    // a kind the student asked for comes first, whatever the scores
    .sort((a, b) => Number(b.kindMatch) - Number(a.kindMatch) || b.score - a.score || String(a.title).localeCompare(String(b.title)));
}

async function getJSON(url, { cfg, fetchImpl, signal, method = 'GET', body }) {
  const r = await fetchImpl(url, {
    method,
    headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  if (!r.ok) throw new Error(`library ${r.status}`);
  return r.json();
}

const inList = (values) => `(${values.map((v) => `"${String(v).replace(/["\\]/g, '')}"`).join(',')})`;

/** A snippet as the card shows it: one line, never garbled, marked when cut. */
export function tidySnippet(s) {
  let t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t || garbled(t)) return '';
  // library_search returns a 200-character window from 60 before the match;
  // a full window started mid-text (a cut English word is dropped; Thai has
  // no spaces to find, so it keeps its first syllables)
  if (t.length >= 190) {
    const sp = t.indexOf(' ');
    if (sp > 0 && sp < 16 && /^[A-Za-z]/.test(t)) t = t.slice(sp + 1);
    t = `…${t}`;
  }
  return clip(t, 160);
}

/**
 * Library documents for a turn.
 * @returns {Promise<{ items: Array, pages: Array, failed: boolean }>}
 *   items: ranked documents for the card; pages: the text of the best matching
 *   pages (answer turns only) for the writer to cite.
 */
export async function findFiles({ terms = [], needles = [], subjects = [], kind = '', title = '', files = false }, { env = process.env, fetchImpl = fetch, signal, timeoutMs } = {}) {
  const cfg = libraryConfig(env);
  const phrases = searchPhrases({ terms, needles, title });
  if (!cfg || !phrases.length) return { items: [], pages: [], failed: !cfg };
  // a student who asked for files waits for them; an answer only borrows a moment
  const timer = AbortSignal.timeout(timeoutMs ?? (files ? FILES_TIMEOUT_MS : TIMEOUT_MS));
  const sig = signal ? AbortSignal.any([signal, timer]) : timer;
  const io = { cfg, fetchImpl, signal: sig };
  try {
    // page search for every phrase, and (for a request for files) titles too:
    // every word of the named title, or of the main term, in any order
    const searches = phrases.map((q) => getJSON(`${cfg.base}/rest/v1/rpc/library_search`, { ...io, method: 'POST', body: { q, max_docs: files ? 16 : 10 } }).catch(() => []));
    const titleWords = (title ? phrase([title]) : phrases[0]).split(' ').filter((w) => w.length >= 2).slice(0, 3);
    const titleFilter = titleWords.map((w) => `title.ilike."*${w.replace(/["\\,()]/g, '')}*"`).join(',');
    const titled = files && titleWords.length
      ? getJSON(`${cfg.base}/rest/v1/library_docs?select=${COLUMNS}&status=eq.public&and=${encodeURIComponent(`(${titleFilter})`)}&limit=12`, io).catch(() => [])
      : Promise.resolve([]);
    const [hitLists, titleRows] = await Promise.all([Promise.all(searches), titled]);

    // Each document keeps its best count; its page and snippet come from the
    // most specific phrase that found it (most words, then the later phrase):
    // "rabies" alone lands on the cover, "rabies incubation period" on the page.
    const hits = new Map();
    hitLists.forEach((rows, i) => {
      const words = phrases[i].split(' ').length;
      for (const r of Array.isArray(rows) ? rows : []) {
        const had = hits.get(r.slug);
        if (!had) hits.set(r.slug, { hits: r.hits, page: r.page, snippet: r.snippet, words });
        else {
          had.hits = Math.max(had.hits, r.hits);
          if (words >= had.words) Object.assign(had, { page: r.page, snippet: r.snippet, words });
        }
      }
    });
    const slugs = [...hits.keys()].filter((s) => !titleRows.some((t) => t.slug === s));
    const rows = slugs.length
      ? await getJSON(`${cfg.base}/rest/v1/library_docs?select=${COLUMNS}&slug=in.${encodeURIComponent(inList(slugs.slice(0, 40)))}`, io).catch(() => [])
      : [];
    const docs = [...titleRows.map((d) => ({ ...d, titleHit: true })), ...rows]
      .filter((d) => d && d.slug && !garbled(d.title))
      .map((d) => ({ ...d, ...(hits.get(d.slug) || { hits: 0, page: 0, snippet: '' }) }));
    const ranked = rankFiles(docs, { subjects, kind, terms: [title, ...terms, ...needles.map(needleText)].filter(Boolean) });
    // Two uploads of one handout (72 and 78 pages, same title) are one file to a
    // student. Beside an answer only clearly relevant documents appear (a
    // syllabus listing "C = Canine" is not about distemper); a request for
    // files shows what there is.
    const seen = new Set();
    const floor = files ? -Infinity : RELATED_FLOOR;
    const unique = ranked.filter((d) => d.titleHit || d.score >= floor).filter((d) => {
      const key = displayTitle(d.title).toLowerCase().replace(/[\s_()-]+/g, ' ').trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const items = unique.slice(0, files ? 8 : 3).map((d) => {
      const page = Number(d.page) || 0;
      return {
        slug: d.slug,
        title: clip(displayTitle(d.title), 140),
        format: formatOf(d.mime, d.title),
        kind: FILE_KINDS[d.kind] ? d.kind : 'other',
        kindLabel: FILE_KINDS[d.kind] || FILE_KINDS.other,
        subject: d.subject || '',
        subjectName: subjectLabel(d.subject),
        lecturer: d.lecturer ? clip(d.lecturer, 60) : '',
        year: d.year || null,
        pages: Number(d.page_count) || null,
        bytes: Number(d.byte_size) || null,
        page: page || null,
        snippet: tidySnippet(d.snippet),
        ...fileLinks(d.slug, page, d.title, d.mime || undefined),
      };
    });

    // the text of the two best pages, for an answer to cite (not for a request
    // for files: there the card speaks for itself)
    let pages = [];
    if (!files) {
      const best = unique.filter((d) => d.page && d.id).slice(0, 3);
      if (best.length) {
        const or = best.map((d) => `and(doc_id.eq.${d.id},page.eq.${Number(d.page)})`).join(',');
        const bodies = await getJSON(`${cfg.base}/rest/v1/library_doc_pages?select=doc_id,page,body&or=${encodeURIComponent(`(${or})`)}`, io).catch(() => []);
        pages = best.map((d) => {
          const b = (Array.isArray(bodies) ? bodies : []).find((x) => x.doc_id === d.id && x.page === Number(d.page));
          const body = String(b?.body || '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
          // a cover (title, lecturer, department) names the topic and says nothing about it
          if (!body || garbled(body) || (Number(d.page) <= 2 && body.length < 320)) return null;
          return { doc: d, page: Number(d.page), body };
        }).filter(Boolean).slice(0, 2);
      }
    }
    return { items, pages, failed: false };
  } catch (err) {
    console.warn('[ai-chat] library', String(err?.message || err).slice(0, 160));
    return { items: [], pages: [], failed: true };
  }
}

/** A matching page as a numbered source: the writer reads it, the page links to it. */
export function pageSource({ doc, page, body }, { needles = [] } = {}) {
  const kindLabel = FILE_KINDS[doc.kind] || FILE_KINDS.other;
  const subject = subjectLabel(doc.subject);
  const flat = body.replace(/\s+/g, ' ');
  // the first place a needle (Thai substring or English pattern) appears
  const at = needles.map((n) => (n?.re ? flat.search(new RegExp(n.re.source, 'i')) : flat.toLowerCase().indexOf(needleText(n).toLowerCase() || '\u0000')))
    .filter((i) => i >= 0).sort((a, b) => a - b)[0] ?? 0;
  return {
    kind: 'library',
    title: clip(displayTitle(doc.title), 140),
    subtitle: `${kindLabel}${subject ? ` ${subject}` : ''}, หน้า ${page}`,
    subject,
    url: fileLinks(doc.slug, page).open,
    snippet: clip(flat.slice(Math.max(0, at - 60)), 220),
    context: clip(body, 1500),
  };
}

/** The card a turn shows. */
export function filesCard(items, { related = false } = {}) {
  return { type: 'files', related, items };
}

/**
 * One small search while the student is still typing: the TLS connection
 * (kept alive by fetch) and the database's plan and pages are warm by the
 * time the question arrives. Cold, the first search measured 1.2 to 1.8 s;
 * warm, 0.07 to 0.4 s. Never throws, never waits more than 1.5 s.
 */
export async function warmLibrary({ env = process.env, fetchImpl = fetch } = {}) {
  const cfg = libraryConfig(env);
  if (!cfg) return;
  await getJSON(`${cfg.base}/rest/v1/rpc/library_search`, { cfg, fetchImpl, signal: AbortSignal.timeout(1500), method: 'POST', body: { q: 'diagnosis', max_docs: 1 } }).catch(() => {});
}
