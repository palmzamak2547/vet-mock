// ============================================================
// omni-ask.js — what the search box does with a knowledge-base reply
// ============================================================
// The pure half of ถามคลังความรู้ in the palette: read a response, decide
// whether it is worth one automatic retry, decide whether an answer is an
// answer or "VetWiki has nothing on this", and find the VetWiki articles a
// question is near when the server could not be reached. No React, no
// network, so every state the student can land in is unit-tested
// (tests/unit/omni-ask.test.mjs).
//
// Every state ends somewhere real: an answer cites sections that open, an
// empty answer offers related sections and the normal results, a failure
// offers one tap to ask again plus the articles the question is near. Never
// a bare "try again" with nowhere to go, and never a retry loop: one
// automatic retry for a transient failure, then the student decides.
// ============================================================

import { STOPWORDS, ALIAS_GROUPS, GENERIC_ALIAS_HEADS, SPECIES_ALIAS_HEADS, normalizeQuery, contentQuery, segmentWords, isThai, isLatin } from './vetwiki/query-terms.js';

/** Plain Thai for each outcome. One term per concept: คลังความรู้. */
export const ASK_COPY = {
  retrying: 'ตอบช้ากว่าปกติ กำลังลองอีกครั้ง…',
  failedTitle: 'ตอบไม่สำเร็จ',
  timeout: 'คำตอบใช้เวลานานเกินไป',
  provider: 'ระบบตอบคำถามขัดข้องชั่วคราว',
  network: 'เชื่อมต่อไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง',
  busy: 'ระบบไม่ว่างชั่วคราว ลองใหม่ในอีกครึ่งนาที',
  rate: 'ถามบ่อยเกินไป ลองใหม่ในอีกสักครู่',
  budget: 'วันนี้ถามครบโควตาแล้ว พรุ่งนี้ถามได้อีก — เนื้อหาในคลังความรู้ยังอ่านได้ตามปกติ',
  unconfigured: 'ยังไม่ได้เปิดใช้การถามจากคลังความรู้ — เนื้อหาทั้งหมดยังอ่านได้ตามปกติ',
  localOnly: 'การถามใช้ได้เฉพาะบนเว็บจริง (vetmock.com)',
  badRequest: 'ส่งคำถามนี้ไม่สำเร็จ ลองพิมพ์คำถามใหม่',
  retry: 'ลองถามอีกครั้ง',
  emptyTitle: 'คลังความรู้ยังไม่มีคำตอบเรื่องนี้',
  emptyBody: 'ลองถามด้วยชื่อโรคหรือคำภาษาอังกฤษที่ใช้ในเลกเชอร์',
  related: 'หัวข้อที่ใกล้เคียงที่สุด',
  library: 'ค้นในคลังเอกสาร',
  results: 'ผลค้นหาอื่นอยู่ด้านล่าง',
};

/** "ไม่พบคำว่า “norberg” ในคลังความรู้" for the terms VetWiki never uses. */
export function unmatchedLine(terms) {
  const list = (terms || []).filter(Boolean).slice(0, 3);
  if (!list.length) return '';
  return `ไม่พบคำว่า ${list.map((t) => `“${t}”`).join(' ')} ในคลังความรู้`;
}

/**
 * What a reply means for the student.
 * @param {{ status?: number, contentType?: string, body?: any, networkError?: boolean, unreadable?: boolean }} r
 *   unreadable: the JSON body could not be parsed (cut off on the way)
 * @returns {{ kind: 'reply', body } | { kind: 'transient'|'busy'|'rate'|'budget'|'unconfigured'|'local-only'|'bad-request', message: string, retryable: boolean }}
 */
export function classifyAskResponse({ status, contentType = '', body, networkError = false, unreadable = false } = {}) {
  if (networkError) return { kind: 'transient', message: ASK_COPY.network, retryable: true };
  const json = contentType.includes('application/json');
  // A success whose body never arrived whole is a dropped connection: read
  // as a reply, its missing body became "VetWiki has nothing on this". An
  // error status still says what happened on its own (below).
  if (unreadable && json && status < 400) return { kind: 'transient', message: ASK_COPY.network, retryable: true };
  if (status === 503 && json) {
    if (body?.reason === 'budget') return { kind: 'budget', message: ASK_COPY.budget, retryable: false };
    if (body?.reason === 'temporarily_unavailable') return { kind: 'busy', message: ASK_COPY.busy, retryable: true };
    return { kind: 'unconfigured', message: ASK_COPY.unconfigured, retryable: false };
  }
  if (status === 429) return { kind: 'rate', message: ASK_COPY.rate, retryable: false };
  // The platform answers a cut-off function with its own page, not our JSON:
  // a 5xx without JSON is a transient failure, not "this is not the real site".
  if (status >= 500) {
    const reason = json ? body?.reason : null;
    return { kind: 'transient', message: reason === 'timeout' || status === 504 ? ASK_COPY.timeout : ASK_COPY.provider, retryable: true };
  }
  if (!json) return { kind: 'local-only', message: ASK_COPY.localOnly, retryable: false };
  if (status >= 400) return { kind: 'bad-request', message: ASK_COPY.badRequest, retryable: false };
  return { kind: 'reply', body };
}

/** One automatic retry, only for a failure that a second try can fix. */
export const shouldAutoRetry = (outcome) => outcome?.kind === 'transient';

/** How long to wait before the automatic retry, in ms. */
export const AUTO_RETRY_DELAY_MS = 1200;

/**
 * Is a validated answer an answer, or "VetWiki has nothing on this"?
 * Empty when the server said the corpus does not cover the question, or when
 * no claim is sourced and every claim only says the evidence is missing.
 */
export function isEmptyAnswer(claims, meta) {
  if (meta?.covered === false) return true;
  const list = Array.isArray(claims) ? claims : [];
  if (!list.length) return true;
  const sourced = list.some((c) => Array.isArray(c.support) && c.support.length > 0);
  return !sourced && list.every((c) => c.supportType === 'insufficient-evidence');
}

/** Sections the server offered as related, deduplicated, at most three. */
export function relatedSections(meta) {
  const seen = new Set();
  const out = [];
  for (const s of meta?.related || []) {
    if (!s?.sectionId || !s.subject || !s.topic || seen.has(s.sectionId)) continue;
    seen.add(s.sectionId);
    out.push({ subject: s.subject, topic: s.topic, topicTitle: s.topicTitle || '', sectionId: s.sectionId, heading: s.heading || '' });
    if (out.length >= 3) break;
  }
  return out;
}

// Words every VetWiki article could carry, and words that say what kind of
// answer is wanted; on their own they say nothing about which article a
// question is near ("ตรวจ" matched every title about examining something).
const DOMAIN_WORDS = new Set([
  'สัตวแพทย์', 'สัตว์', 'โรค', 'ตรวจ', 'วินิจฉัย', 'รักษา', 'อาการ', 'ป้องกัน', 'ติดต่อ', 'สาเหตุ', 'เกิด',
  'ชนิด', 'ประเภท', 'วิธี', 'ขั้นตอน', 'ใช้', 'ยา', 'ระยะ',
  'vet', 'veterinary', 'animal', 'animals', 'disease', 'diseases', 'treatment', 'treat', 'diagnosis',
  'signs', 'symptoms', 'prevention', 'cause', 'causes', 'dose', 'type', 'types',
]);

const isThaiForm = (f) => isThai(f.replace(/\s+/g, ''));

/**
 * What a question names, as concepts: each curated alias group it mentions is
 * one concept (ลมชัก reaches "seizure"); any other word of three letters or
 * more is its own. Groups that only say what kind of answer is wanted
 * (รักษา, อาการ, ผ่าตัด ...) are left out, or "treatment" in a title would
 * win, and so are their words: skipping the group alone let ผ่าตัด come back
 * as a plain word, and "TPLO ผ่าตัดยังไง" offered every surgery article.
 */
function questionConcepts(q, words) {
  const starts = new Set(words.map((w) => w.start));
  const ends = new Set(words.map((w) => w.end));
  const spans = [];
  const concepts = [];
  for (const group of ALIAS_GROUPS) {
    const generic = GENERIC_ALIAS_HEADS.has(group[0]);
    let hit = null;
    for (const f of group) {
      if (isThaiForm(f)) {
        for (let i = q.indexOf(f); i >= 0 && !hit; i = q.indexOf(f, i + 1)) {
          if (starts.has(i) && ends.has(i + f.length)) hit = { start: i, end: i + f.length };
        }
      } else {
        const stem = f.replace(/\*$/, '');
        const i = q.indexOf(stem);
        if (i >= 0 && (i === 0 || !/[a-z0-9]/.test(q[i - 1]))) {
          let end = i + stem.length;
          // A kind word's stem form (emergenc*) covers its whole word, or
          // "emergency" would be left behind as a concept of its own.
          if (generic && f.endsWith('*')) while (end < q.length && /[a-z0-9-]/.test(q[end])) end++;
          hit = { start: i, end };
        }
      }
      if (hit) break;
    }
    if (!hit) continue;
    spans.push(hit);
    if (generic) continue; // its words are covered above, and name no article
    const forms = group.map((f) => f.replace(/\*$/, '')).filter((f) => f.length >= 3);
    if (forms.length) concepts.push({ forms, weight: SPECIES_ALIAS_HEADS.has(group[0]) ? 0.5 : 1 });
  }
  for (const w of words) {
    const t = w.word.trim();
    // A short Thai word is a piece of longer ones (วัด in หวัด); it only
    // counts through an alias, which knows where it starts and ends.
    if (STOPWORDS.has(t) || DOMAIN_WORDS.has(t) || (isThai(t) ? t.length < 4 : !isLatin(t) || t.length < 3)) continue;
    if (spans.some((sp) => sp.start <= w.start && w.end <= sp.end)) continue;
    concepts.push({ forms: [t], weight: 1 });
  }
  return concepts;
}

/**
 * VetWiki articles a question is near, from titles and summaries alone, for
 * when the server cannot answer. A concept found in a title counts double,
 * the animal counts half; an article must name what was asked in its title,
 * or in a summary when only a few articles mention it, and only articles
 * scoring at least half the best are offered, so a weak guess shows nothing
 * rather than three unrelated links.
 * @param {string} query
 * @param {Array<{subject, topic, title, summary}>} topics  listTopics() rows
 */
export function relatedTopicsFor(query, topics, { limit = 3 } = {}) {
  const q = contentQuery(normalizeQuery(query));
  if (!q || !Array.isArray(topics) || !topics.length) return [];
  const words = segmentWords(q).filter((w) => w.wordLike && w.word.trim());
  const concepts = questionConcepts(q, words);
  if (!concepts.length) return [];
  const rows = topics.map((t) => ({ t, title: String(t.title || '').toLowerCase(), summary: String(t.summary || '').toLowerCase() }));
  const has = (text, forms) => forms.some((f) => mentions(text, f));
  const df = concepts.map(({ forms }) => rows.filter((r) => has(r.title, forms) || has(r.summary, forms)).length);
  const idf = df.map((n) => (n ? Math.log(1 + rows.length / n) : 0));
  const scored = [];
  for (const r of rows) {
    let score = 0;
    let vouched = false;
    concepts.forEach(({ forms, weight }, ci) => {
      if (!idf[ci]) return;
      if (has(r.title, forms)) { score += 2 * idf[ci] * weight; if (weight === 1) vouched = true; }
      else if (has(r.summary, forms)) { score += idf[ci] * weight; if (weight === 1 && df[ci] <= 3) vouched = true; }
    });
    // Offered only when a title names what was asked, or a summary names
    // something only a few articles mention; never on the animal alone.
    if (vouched) scored.push({ ...r.t, score });
  }
  if (!scored.length) return [];
  scored.sort((a, b) => b.score - a.score || (String(a.title) < String(b.title) ? -1 : 1));
  const best = scored[0].score;
  return scored.filter((x) => x.score >= best / 2).slice(0, limit).map(({ subject, topic, title }) => ({ subject, topic, title }));
}

// A Latin term counts where a word starts with it (cat in "cats", not in
// "vaccination"); Thai has no spaces, so a Thai term counts anywhere.
function mentions(hay, term) {
  if (isThai(term)) return hay.includes(term);
  for (let i = hay.indexOf(term); i >= 0; i = hay.indexOf(term, i + 1)) {
    if (i === 0 || !/[a-z0-9]/.test(hay[i - 1])) return true;
  }
  return false;
}

// Words that name the document shelf itself, not what a document is about:
// "คลังมีเรื่อง TPLO ไหม" is asking about TPLO. Typed into the shelf's search
// they match by kind label or nothing, never by topic.
const SHELF_WORDS = new Set([
  'คลัง', 'คลังเอกสาร', 'เอกสาร', 'ชีท', 'ชีต', 'สไลด์', 'ไฟล์',
  'library', 'pdf', 'pdfs', 'slide', 'slides', 'sheet', 'sheets', 'handout', 'handouts',
  'document', 'documents', 'doc', 'docs', 'file', 'files',
]);

/**
 * Words of a question worth typing into the document shelf's search, most
 * specific first: Latin terms (the shelf's titles are mostly English), then
 * longer Thai words. The shelf matches every word it is given, so the palette
 * offers one word at a time, and only a word some document really contains.
 */
export function libraryTerms(question) {
  const q = contentQuery(normalizeQuery(question));
  const words = segmentWords(q).filter((w) => w.wordLike).map((w) => w.word.trim())
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !SHELF_WORDS.has(w));
  const latin = words.filter((w) => isLatin(w)).sort((a, b) => b.length - a.length);
  const thai = words.filter((w) => isThai(w) && w.length >= 4).sort((a, b) => b.length - a.length);
  return [...new Set([...latin, ...thai])];
}

/**
 * The one word to offer for the document shelf after a question found no
 * answer: the first term (the knowledge base's unmatched terms, then the
 * question's own words) that some document really contains, counted the way
 * the shelf searches (every space-separated part of the term must appear in a
 * document's text). Counting against the search box's own index once offered
 * "คลัง" with every file, because that index adds the shelf's name to each.
 * @param {string} question
 * @param {string[]} unmatched  terms the knowledge base does not use
 * @param {string[]} shelf  each document's search text, as the shelf indexes it
 * @returns {{ term: string, count: number } | null}
 */
export function librarySuggestion(question, unmatched, shelf) {
  const docs = (Array.isArray(shelf) ? shelf : []).filter((h) => typeof h === 'string' && h);
  if (!docs.length) return null;
  const seen = new Set();
  for (const raw of [...(unmatched || []), ...libraryTerms(question || '')]) {
    const term = String(raw || '').trim().toLowerCase();
    if (!term || seen.has(term) || SHELF_WORDS.has(term)) continue;
    seen.add(term);
    const parts = term.split(/\s+/);
    const count = docs.filter((h) => parts.every((p) => h.includes(p))).length;
    if (count) return { term, count };
  }
  return null;
}
