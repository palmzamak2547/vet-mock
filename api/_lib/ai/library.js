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
// with only a logarithm of the raw count. A title word and a search phrase
// count by how specific they are (retrieve.js termSpecificity): "ORT ในไก่
// ... ควบคุมป้องกันอย่างไร" once showed three epidemiology decks found by
// ควบคุม on most of their pages (two titled ควบคุม and ป้องกัน), and not the
// deck titled ORT. A page whose Thai came out of the PDF mis-encoded (legacy
// font mapping, e.g. "o°ÄÁÈª´") is never shown or quoted.
//
// Nothing here may fail a turn: a missing config, a slow database or a bad
// reply gives no files, and the answer goes on without them.
// ============================================================

import { SUBJECTS } from '../../../src/data/curriculum.js';
import { EXTERNAL_COURSES } from '../../../src/data/library-courses.js';
import { normalizeQuery } from '../../../src/lib/vetwiki/query-terms.js';
import { clip, stripBroken } from './text.js';
import { RARE_SHARE } from './textindex.js';

const SITE = 'https://vetmock.com';
const TIMEOUT_MS = 1400;
const FILES_TIMEOUT_MS = 4000;
// the score a document needs to sit beside an answer (see rankFiles: a deck
// named for the topic scores 8+, a guideline with the topic on a tenth of its
// pages ~4.5, a syllabus that mentions it once ~2.9; a deck that only words any
// lecture uses found can reach ~4.7, and findFiles' gate keeps it off instead)
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

/** Whether a normalised text holds one of a concept's forms ({ thai } or { re }). */
function formsIn(forms) {
  const res = forms.filter((f) => f.re).map((f) => new RegExp(f.re.source));
  const thai = forms.filter((f) => f.thai).map((f) => f.thai);
  return (text) => thai.some((t) => text.includes(t)) || res.some((re) => re.test(text));
}

/** The phrases worth searching, each with the terms it was made from (none: the title the student named). */
function phraseList({ terms = [], needles = [], title = '' }) {
  const out = [];
  const add = (q, of) => { if (q && q.replace(/\s/g, '').length >= 3 && !out.some((p) => p.q === q)) out.push({ q, of }); };
  if (title) add(phrase([title]), null);
  const en = terms.map((t) => String(t).trim()).filter(Boolean);
  if (en[0]) add(phrase([en[0]]), [en[0]]);
  if (en[1]) add(phrase([en[0], en[1]]), [en[0], en[1]]);
  const th = needles.map(needleText).map((t) => t.trim())
    .find((t) => /[\u0E00-\u0E7F]/.test(t) && t.length >= 3 && !STOP_TH.has(t));
  if (th) add(phrase([th]), [th]);
  return out.slice(0, 3);
}

/**
 * The phrases worth searching for a turn: the most specific English term,
 * the two most specific together, and the strongest Thai concept that names
 * a topic, so a Thai deck and an English one are both found. Each must be 3+
 * letters (the search returns nothing for less). No topic word, no search.
 */
export function searchPhrases(o) {
  return phraseList(o).map((p) => p.q);
}

/**
 * Score documents for a turn. Pure, so the ranking is tested without a network.
 * @param {Array} docs  catalog rows + { hits, page, snippet, titleHit, found }
 *   found: [{ hits, weight }], one per phrase that found the document, weight
 *   being how specific that phrase is (without it: the hits, in full)
 * @param {object} o
 * @param {(term: string) => number} [o.specificity]  0..1 per term
 *   (retrieve.js termSpecificity); without it every term counts in full
 * @param {(title: string) => number} [o.animal]  the share of its score a
 *   title keeps for the animals it names (retrieve.js animalShare)
 */
export function rankFiles(docs, { subjects = [], kind = '', terms = [], specificity = null, animal = null } = {}) {
  const specific = specificity || (() => 1);
  // A title names the topic as much as the term it holds is specific: a deck
  // titled ORT does, one titled ควบคุม ป้องกัน does not. A Latin term of three
  // letters or fewer must stand alone (ORT is not in "Report", cat not in
  // "cattle", but dogs is dog); a longer one or a Thai one is found as text,
  // as before (rumen in "Rumenotomy").
  const named = [...new Set(terms.map((t) => String(t).toLowerCase().trim()).filter((t) => t.length >= 3))]
    .map((t) => {
      const alone = /^[a-z0-9]{1,3}$/.test(t) ? new RegExp(`(?:^|[^a-z0-9])${t}(?:e?s)?(?![a-z0-9])`) : null;
      return { t, in: (title) => (alone ? alone.test(title) : title.includes(t)) };
    });
  const wantKind = kind && kind !== 'any' ? kind : '';
  return docs
    .map((d) => {
      // a file name's underscores are spaces ("Powerpoint_Newcastle disease virus")
      const title = normalizeQuery(d.title || '').replace(/_/g, ' ');
      // a row the title search found carries every word of the asked title
      const naming = d.titleHit ? 1 : Math.max(0, ...named.filter((n) => n.in(title)).map((n) => specific(n.t)));
      const pages = Math.max(1, Number(d.page_count) || 1);
      const found = d.found?.length ? d.found : [{ hits: d.hits, weight: 1 }];
      // each phrase that found it is worth what the phrase is worth
      const evidence = Math.max(0, ...found.map(({ hits, weight = 1 }) => {
        const h = Math.max(0, Number(hits) || 0);
        // how much of the document is about it, not how long it is
        const density = Math.min(1, (h / Math.max(5, pages)) * 4);
        return (Math.log2(1 + h) * 0.5 + density * 2) * weight;
      }));
      // past 100 pages a document is a compilation or a book: it mentions everything
      const bulk = pages > 100 ? Math.log2(pages / 100) * 0.5 : 0;
      let score = naming * 4 + evidence + (KIND_WEIGHT[d.kind] ?? 0.4) - bulk;
      // a syllabus or timetable names every topic of a course and teaches none
      if (ADMIN_TITLE.test(d.title || '')) score -= 3;
      if (subjects.includes(d.subject)) score += 1.5;
      // a deck on another animal steps back (a mare's endometritis beside a dog's pyometra)
      const share = animal ? animal(d.title || '') : 1;
      // the title names the topic when its term is one of the rare things asked
      return { ...d, titleHit: naming >= RARE_SHARE, score: score > 0 ? score * share : score, elsewhere: share < 1, kindMatch: wantKind ? d.kind === wantKind : true };
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
  let t = stripBroken(s).replace(/\s+/g, ' ').trim();
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
 * @param {object} turn
 * @param {(term: string) => number} [turn.specificity]  how specific a term is,
 *   0..1 (retrieve.js termSpecificity); every term counts in full without it
 * @param {{ forms: Array }} [turn.topic]  what a file beside an answer must
 *   cover (retrieve.js questionTopic); without it, any rare part of the question
 * @param {(title: string) => number} [turn.animal]  retrieve.js animalShare
 * @returns {Promise<{ items: Array, pages: Array, failed: boolean }>}
 *   items: ranked documents for the card; pages: the text of the best matching
 *   pages (answer turns only) for the writer to cite.
 */
export async function findFiles({ terms = [], needles = [], subjects = [], kind = '', title = '', files = false, specificity = null, topic = null, animal = null }, { env = process.env, fetchImpl = fetch, signal, timeoutMs } = {}) {
  const cfg = libraryConfig(env);
  const list = phraseList({ terms, needles, title });
  const phrases = list.map((p) => p.q);
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
    // while the searches run: a phrase is as specific as the most specific term
    // it was made from, and pages a rare part of the question found count in
    // full (as the index counts the rare things asked; a title, one line on
    // what the whole document is about, keeps the share in rankFiles)
    const weights = list.map((p) => {
      const s = p.of && specificity ? Math.max(...p.of.map(specificity)) : 1;
      return s >= RARE_SHARE ? 1 : s;
    });
    const [hitLists, titleRows] = await Promise.all([Promise.all(searches), titled]);

    // Each document keeps its best count; its page and snippet come from the
    // most specific phrase that found it (most words, then the later phrase):
    // "rabies" alone lands on the cover, "rabies incubation period" on the page.
    const hits = new Map();
    hitLists.forEach((rows, i) => {
      const words = phrases[i].split(' ').length;
      const weight = weights[i];
      const q = phrases[i];
      for (const r of Array.isArray(rows) ? rows : []) {
        const had = hits.get(r.slug);
        if (!had) hits.set(r.slug, { hits: r.hits, page: r.page, snippet: r.snippet, words, found: [{ hits: r.hits, weight, q }] });
        else {
          had.hits = Math.max(had.hits, r.hits);
          had.found.push({ hits: r.hits, weight, q });
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
    const ranked = rankFiles(docs, { subjects, kind, terms: [title, ...terms, ...needles.map(needleText)].filter(Boolean), specificity, animal });
    // Two uploads of one handout (72 and 78 pages, same title) are one file to a
    // student. Beside an answer only clearly relevant documents appear (a
    // syllabus listing "C = Canine" is not about distemper), and only ones
    // about the question: a title naming a rare part of it, or pages on the
    // most specific thing it names (pyometra, not the ยาฆ่าเชื้อ an entomology
    // question set mentions on 15 pages), or, when it names none, pages a rare
    // part found (ควบคุม on 55 of 63 pages is noise beside ORT, as in the
    // corpus's specificity gate). A deck on another animal is shown only when
    // nothing on the asked one is. A request for files shows what there is.
    const seen = new Set();
    const floor = files ? -Infinity : RELATED_FLOOR;
    const covers = topic ? formsIn(topic.forms) : null;
    const about = (d) => files || d.titleHit || (covers
      ? covers(normalizeQuery(d.title || '').replace(/_/g, ' ')) || (d.found || []).some((f) => covers(f.q))
      : (d.found || []).some((f) => f.weight >= RARE_SHARE));
    const shown = ranked.filter((d) => about(d) && (d.titleHit || d.score >= floor));
    const onAnimal = shown.some((d) => !d.elsewhere);
    const unique = shown.filter((d) => files || !d.elsewhere || !onAnimal).filter((d) => {
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
 * The line above a files card, made from the card itself: it cannot name a
 * file that is not there or say what a file does not (a model introducing the
 * rabies deck added that rabies "ออกสอบบ่อย", production 2026-10-28).
 */
export function filesLead(items) {
  const f = items[0];
  const meta = [f.subjectName, f.pages ? `${f.pages} หน้า` : ''].filter(Boolean).join(', ');
  const parts = [`ไฟล์ที่ตรงที่สุดคือ${f.kindLabel} **${f.title}**${meta ? ` (${meta})` : ''}`];
  if (f.page > 1) parts.push(`เปิดแล้วไปที่หน้า ${f.page} ซึ่งตรงกับคำค้น`);
  parts.push(items.length > 1 ? `การ์ดด้านล่างมี ${items.length} ไฟล์ กดเปิดหรือดาวน์โหลดได้` : 'กดเปิดหรือดาวน์โหลดจากการ์ดด้านล่างได้');
  return parts.join(' ');
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
