// ============================================================
// retrieve.js — Thai-aware retrieval over the governed corpus
// ============================================================
// Turns a free-text question into the handful of VetWiki sections most
// likely to answer it. This is the half of the AI layer that decides what
// the model is ALLOWED to know — the endpoint shows the model only what
// this returns, so retrieval quality is answer quality.
//
// Why not searchTopics(): that matches the WHOLE query as one substring,
// which is right for a search box and useless for a question — a Thai
// question is one long unspaced string that will never appear verbatim in
// any section. Here the question is segmented into words (Intl.Segmenter,
// which both Vercel's Node and every supported browser ship with ICU),
// intent words are dropped, and sections are scored by which content
// words they actually contain.
//
// A question is read as CONCEPTS, not strings (query-terms.js has the
// vocabulary): ลมชัก and seizure are one concept, so a Thai question finds
// the section the notes wrote in English; diagnosed matches diagnosis; a
// misspelt Latin word that is one letter away from a word the corpus uses
// is read as that word. The facet a question asks for (treatment,
// diagnosis, signs ...) lifts the section whose heading says so. Measured
// against tests/fixtures/vetwiki-ask-eval.json by
// scripts/eval-vetwiki-retrieval.mjs.
//
// A term the question names that appears nowhere in the corpus ("Norberg")
// comes back in `unmatched`, so the endpoint can tell the model and the
// student that VetWiki has nothing on it. When nothing specific matched at
// all ("TPLO ผ่าตัดยังไง"), `covered` is false and no section is handed to
// the model; `related` names the nearest sections, but only ones that
// account for at least half of the question.
//
// Pure and deterministic: same question + same corpus → same sections.
// No network, no model, nothing to fabricate.

import { listTopics, loadTopic } from './index.js';
import { indexTopic } from './search.js';
import { GLOSSARY } from '../../data/glossary.js';
import {
  STOPWORDS, ALIAS_GROUPS, GENERIC_ALIAS_HEADS, normalizeQuery, contentQuery, segmentWords, isThai, isLatin,
  latinPattern, latinProbe, questionFacets,
} from './query-terms.js';

const ok = (w) => !!w && w.length >= 2 && !STOPWORDS.has(w);

/** Below this share of the question, a section is not offered as related. */
export const RELATED_MIN_COVERAGE = 0.5;
// How strongly answering more of the question counts (Lucene's "coord"):
// 0.5 measured best on the eval set (MRR 0.895 -> 0.923, no lost hit);
// 1.0 started dropping treatment sections whose article carries the subject.
const COORD_EXPONENT = 0.5;

/** Content words of a question, lowercased, stopwords out — plus BIGRAMS of
 *  adjacent Thai words. The segmenter splits โรคพิษสุนัขบ้า into
 *  พิษ|สุนัข|บ้า, and each half is a common word that appears all over the
 *  corpus — the bigram สุนัขบ้า is the RARE string that names the disease.
 *  Exported for tests — if this breaks, retrieval silently degrades to noise. */
export function questionTokens(question) {
  const q = contentQuery(normalizeQuery(question));
  const raw = segmentWords(q).filter((s) => s.wordLike).map((s) => s.word.trim());
  const out = [];
  const push = (w) => { if (!out.includes(w)) out.push(w); };
  for (let i = 0; i < raw.length; i++) {
    const w = raw[i];
    if (ok(w)) push(w);
    // Bigrams come from RAW adjacency only. Filtering stopwords first and
    // then pairing survivors invented เกิดเชื้อ out of เกิดจากเชื้อ — a string
    // that never appeared in the question but happened to appear (rare,
    // therefore heavily weighted) in an unrelated husbandry article.
    const n = raw[i + 1] || '';
    if (ok(w) && ok(n) && isThai(w) && isThai(n)) push(w + n);
  }
  return out;
}

// ── Vocabulary: curated aliases + the glossary's Thai names ─────────────
// A glossary entry already pairs an English term with the Thai name a
// student uses (mastitis / เต้านมอักเสบ, Demodex / ไรขี้เรื้อนเปียก). The
// leading classifier (โรค, ไร, ภาวะ, เชื้อ) is also tried without it, since
// students type ขี้เรื้อนเปียก, not ไรขี้เรื้อนเปียก.
const THAI_LEAD = /^(โรค|ไร|ภาวะ|เชื้อ|การ)/;

function cleanForm(f) {
  return normalizeQuery(f).replace(/\s*\([^)]*\)\s*/g, ' ').trim();
}

let vocabulary = null;
function aliasGroups() {
  if (vocabulary) return vocabulary;
  const groups = ALIAS_GROUPS.map((forms) => forms.map(cleanForm).filter(Boolean));
  const generic = groups.map((forms) => GENERIC_ALIAS_HEADS.has(forms[0]));
  // One thing must be one concept. A glossary entry that names something a
  // curated group already names (พาร์โว, ขี้เรื้อนเปียก) joins that group,
  // and two glossary entries for the same term (laminitis in cattle and in
  // horses) are one group; otherwise the same word scored twice. Only forms
  // long enough to be unambiguous join groups: a two-letter code could name
  // two different diseases.
  const key = (f) => f.replace(/\*$/, '');
  const owner = new Map();
  groups.forEach((forms, gi) => forms.forEach((f) => { if (key(f).length >= 4 || isThai(key(f))) owner.set(key(f), gi); }));
  const byTerm = new Map();
  for (const entry of GLOSSARY) {
    const forms = new Set();
    for (const f of [entry.term, ...(entry.aliases || []), entry.thai]) {
      const c = cleanForm(f || '');
      if (!c) continue;
      forms.add(c);
      if (isThai(c.replace(/\s+/g, '')) && THAI_LEAD.test(c)) {
        const bare = c.replace(THAI_LEAD, '');
        if (bare.length >= 4) forms.add(bare);
      }
    }
    if (forms.size < 2) continue;
    const term = cleanForm(entry.term || '');
    let gi = [...forms].map((f) => owner.get(key(f))).find((x) => x !== undefined);
    if (gi === undefined && byTerm.has(term)) gi = byTerm.get(term);
    if (gi === undefined) {
      gi = groups.push([]) - 1;
      generic.push(false);
    }
    for (const f of forms) if (!groups[gi].includes(f)) groups[gi].push(f);
    byTerm.set(term, gi);
  }
  vocabulary = groups.map((forms, gi) => {
    const thai = forms.filter((f) => isThai(f.replace(/\s+/g, '')));
    const latin = forms.filter((f) => !isThai(f.replace(/\s+/g, '')) && /^[a-z0-9][a-z0-9 .'*-]*$/.test(f));
    return {
      generic: !!generic[gi],
      // what the student may type
      queryThai: thai.map((f) => f.replace(/\s+/g, '')),
      queryLatin: latin.map((f) => ({ form: f, re: new RegExp(latinPattern(f)) })),
      // what the corpus is searched for: Thai forms short enough to sit
      // inside longer words (ไต in ไตรมาส) are left to their English names
      corpus: [
        ...thai.filter((f) => f.length >= 3).map((f) => ({ thai: f })),
        ...latin.map((f) => ({ probe: latinProbe(f), re: new RegExp(latinPattern(f), 'g') })),
      ],
    };
  });
  return vocabulary;
}

// ── The corpus, prepared once per process ───────────────────────────────
// A section whose text is a "🚧 รอเติม" line lists what is NOT written yet;
// matching on that list sent questions to empty sections. Those lines are
// left out of scoring (the section's real text still counts).
function stripPlaceholders(text) {
  return text.split(' \n ').filter((part) => !part.trimStart().startsWith('🚧')).join(' \n ');
}

let corpusCache = null;
function corpus() {
  if (corpusCache) return corpusCache;
  const topics = [];
  const sections = [];
  for (const t of listTopics()) {
    const idx = indexTopic(t.subject, t.topic);
    if (!idx) continue;
    const entry = { t, titleLc: `${t.title} ${t.summary}`.toLowerCase(), sections: [] };
    for (const s of idx.sections) {
      const placeholderHeading = s.heading.trimStart().startsWith('🚧');
      const row = {
        id: s.id,
        heading: s.heading,
        headingLc: placeholderHeading ? '' : s.heading.toLowerCase(),
        text: stripPlaceholders(s.text),
        topic: entry,
      };
      entry.sections.push(row);
      sections.push(row);
    }
    topics.push(entry);
  }
  // Latin words the corpus uses, with how many sections use them — the
  // dictionary a misspelt query word is corrected against.
  const words = new Map();
  for (const s of sections) {
    for (const w of new Set(s.text.match(/[a-z][a-z0-9-]{3,}/g) || [])) words.set(w, (words.get(w) || 0) + 1);
  }
  corpusCache = { topics, sections, words };
  return corpusCache;
}

// ── Concepts ─────────────────────────────────────────────────────────────
// One concept = one thing the question names, satisfied by any of its forms.
//   forms: [{ thai } | { probe, re }]   (re is global, for counting)

function damerau(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      rowMin = Math.min(rowMin, d[i][j]);
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length][b.length];
}

/** The corpus word a misspelt Latin token most likely meant, or null. */
function correction(token, words) {
  if (token.length < 5 || /\d/.test(token)) return null;
  const max = token.length >= 8 ? 2 : 1;
  let best = null;
  for (const [w, df] of words) {
    if (Math.abs(w.length - token.length) > max || w[0] !== token[0]) continue;
    const dist = damerau(token, w, max);
    if (dist > max) continue;
    if (!best || dist < best.dist || (dist === best.dist && (df > best.df || (df === best.df && w < best.w)))) {
      best = { w, dist, df };
    }
  }
  return best ? best.w : null;
}

function latinForm(form) {
  return { probe: latinProbe(form), re: new RegExp(latinPattern(form), 'g') };
}

// ICU splits fhv-1, x-ray and gs-441524 at the hyphen; a code is one word to
// a student, so adjacent Latin pieces joined by - or . merge back when one of
// them is a number or a short code. Two ordinary words stay two words:
// "small-breed" is small and breed, not a term the corpus has never seen.
const codePiece = (w) => /\d/.test(w) || w.length <= 3;
function mergeCodes(segs, q) {
  const out = [];
  for (const s of segs) {
    const prev = out[out.length - 1];
    const joinable = prev && /^[a-z0-9]/.test(s.word) && /[a-z0-9]$/.test(prev.word)
      && (codePiece(s.word) || codePiece(prev.word.split(/[-.]/).pop()));
    const gap = prev ? q.slice(prev.end, s.start) : '';
    if (joinable && (gap === '-' || gap === '.')) {
      out[out.length - 1] = { word: q.slice(prev.start, s.end), start: prev.start, end: s.end, wordLike: true };
      continue;
    }
    out.push(s);
  }
  return out;
}

function buildConcepts(question) {
  const full = normalizeQuery(question);
  const q = contentQuery(full);
  const segs = mergeCodes(segmentWords(q).filter((s) => s.wordLike && s.word.trim()), q);
  const starts = new Set(segs.map((s) => s.start));
  const ends = new Set(segs.map((s) => s.end));
  const concepts = [];
  const spans = [];

  // 1. aliases, longest Thai forms first so the span list is maximal
  aliasGroups().forEach((group, gi) => {
    let matched = null;
    for (const form of [...group.queryThai].sort((a, b) => b.length - a.length)) {
      for (let i = q.indexOf(form); i >= 0; i = q.indexOf(form, i + 1)) {
        if (starts.has(i) && ends.has(i + form.length)) { matched = { start: i, end: i + form.length, label: form }; break; }
      }
      if (matched) break;
    }
    if (!matched) {
      for (const { form, re } of group.queryLatin) {
        const m = re.exec(q);
        if (m) { matched = { start: m.index, end: m.index + m[0].length, label: m[0] }; break; }
      }
    }
    if (!matched || !group.corpus.length) return;
    spans.push({ ...matched, gi });
    concepts.push({ key: `alias:${gi}`, label: matched.label, forms: group.corpus, alias: true, generic: group.generic, span: matched });
  });
  const covered = (start, end) => spans.some((s) => s.start <= start && end <= s.end);
  const overlaps = (start, end) => spans.some((s) => s.start < end && start < s.end);
  // A name inside a longer name (แมว inside ลูกแมว, สุนัข inside
  // โรคพิษสุนัขบ้า) still counts, at half weight: the longer name is the subject.
  for (const c of concepts) {
    const { start, end } = c.span;
    c.nested = spans.some((s) => s.start <= start && end <= s.end && s.end - s.start > end - start);
  }

  // 2. words and bigrams the aliases did not already cover. A Thai bigram
  // never straddles an alias: ท้อง|โค from ปวดท้อง|โคลิก is a string nobody
  // asked about, and as a rare one it would have filtered everything out.
  const words = segs.map((s) => ({ w: s.word.trim(), start: s.start, end: s.end }));
  const seen = new Set(concepts.map((c) => c.label));
  for (let i = 0; i < words.length; i++) {
    const { w, start, end } = words[i];
    if (ok(w) && !covered(start, end) && !seen.has(w)) {
      seen.add(w);
      if (isThai(w)) concepts.push({ key: `w:${w}`, label: w, forms: [{ thai: w }], unigram: true });
      else if (isLatin(w)) concepts.push({ key: `w:${w}`, label: w, forms: [latinForm(w)], latin: true, unigram: true });
    }
    const n = words[i + 1];
    if (!n || !ok(w) || !ok(n.w)) continue;
    if (isThai(w) && isThai(n.w) && !overlaps(start, n.end)) {
      const bi = w + n.w;
      if (!seen.has(bi)) { seen.add(bi); concepts.push({ key: `b:${bi}`, label: bi, forms: [{ thai: bi }], covers: [w, n.w] }); }
    } else if (isLatin(w) && isLatin(n.w) && /^[ -]+$/.test(q.slice(end, n.start)) && !covered(start, n.end)) {
      // "feline herpesvirus", "canine atopic": the phrase is far rarer than
      // either word and names what the question is about.
      const phrase = `${w} ${n.w}`;
      if (!seen.has(phrase)) { seen.add(phrase); concepts.push({ key: `p:${phrase}`, label: phrase, forms: [latinForm(phrase)], covers: [w, n.w] }); }
    }
  }
  return { q, concepts, facets: questionFacets(full) };
}

function countForm(text, form) {
  if (form.thai) {
    let n = 0;
    for (let i = text.indexOf(form.thai); i >= 0 && n < 4; i = text.indexOf(form.thai, i + form.thai.length)) n++;
    return n;
  }
  if (!text.includes(form.probe)) return 0;
  form.re.lastIndex = 0;
  let n = 0;
  while (n < 4 && form.re.exec(text)) n++;
  return n;
}

/** Hits per form of one concept in a text, or null when none matched. */
function formHits(text, concept) {
  let cells = null;
  concept.forms.forEach((f, fi) => {
    const n = countForm(text, f);
    if (!n) return;
    if (!cells) cells = new Array(concept.forms.length).fill(0);
    cells[fi] = n;
  });
  return cells;
}

/**
 * The sections most relevant to a question, across every governed topic,
 * and whether the corpus covers the question at all.
 *
 * tf–idf, not tf: a section that says วัคซีน eight times must not outrank the
 * one section in the corpus that contains the rare word the question is
 * actually about (the first version did exactly that — rabies questions
 * retrieved poultry vaccine programs). df is computed over the live corpus
 * per call, so the weights follow the data like everything else. A concept
 * scores by its most specific form present: a section that says AMR is about
 * AMR, one that says "resistance" may be about anthelmintics.
 *
 * Sections are read inside their article: the article's best evidence is
 * shared with all its sections, so the Treatment section of the article a
 * question is about can win on its heading even when, as usual, it never
 * repeats the disease's name.
 *
 * @returns {{
 *   picks: Array<{subject, topic, topicTitle, topicSummary, sectionId, heading, score}>,
 *   covered: boolean, unmatched: string[], related: Array<object>, facets: string[]
 * }}
 */
export function retrieveForQuestion(question, { maxSections = 8, perTopic = 3 } = {}) {
  const { concepts, facets } = buildConcepts(question);
  const facetIds = facets.map((f) => f.id);
  const empty = { picks: [], covered: false, unmatched: [], related: [], facets: facetIds };
  if (concepts.length === 0) return empty;
  const { topics, sections, words } = corpus();
  const total = sections.length;

  // pass 1 — document frequency per form; a Latin word nowhere in the
  // corpus gets one chance as a typo of a word that is there
  let rows = new Map(); // section → (cells | null)[] per concept
  let formDf = [];
  const tally = () => {
    rows = new Map();
    formDf = concepts.map((c) => new Array(c.forms.length).fill(0));
    for (const s of sections) {
      let row = null;
      concepts.forEach((c, ci) => {
        const cells = formHits(s.text, c);
        if (!cells) return;
        if (!row) row = new Array(concepts.length).fill(null);
        row[ci] = cells;
        cells.forEach((n, fi) => { if (n) formDf[ci][fi] += 1; });
      });
      if (row) rows.set(s, row);
    }
  };
  tally();
  const found = (ci) => formDf[ci].some((n) => n > 0);
  let corrected = false;
  concepts.forEach((c, ci) => {
    if (found(ci) || !c.latin) return;
    const fix = correction(c.label, words);
    if (fix) { c.forms = [...c.forms, latinForm(fix)]; c.corrected = fix; corrected = true; }
  });
  if (corrected) tally();

  // What the question names that the corpus never does: a Latin term or a
  // known name always counts; a Thai word only when it is a whole word.
  const unmatched = concepts
    .filter((c, ci) => !found(ci) && (c.latin || c.alias || (c.unigram && c.label.length >= 3)))
    .map((c) => c.label);
  const idf = formDf.map((dfs) => dfs.map((n) => (n > 0 ? Math.log(1 + total / n) : 0)));
  const maxIdf = Math.max(0, ...idf.flat());
  if (maxIdf === 0) return { ...empty, unmatched };

  // Specificity gate: when the question carries at least one RARE form
  // (high idf — สุนัขบ้า, uri, uht…), a section that matches none of the
  // rare ones is background noise no matter how many common words it
  // shares with the question. Without this, one husbandry section that
  // says เชื้อ and รักษา a lot outranked the actual feline-URI article.
  const gateIdf = Math.max(0, ...idf.filter((_, ci) => !concepts[ci].generic).flat());
  const rare = idf.map((ws, ci) => ws.map((w) => !concepts[ci].generic && w > 0 && w >= 0.55 * gateIdf));
  // idf carries specificity; a short Thai word cut out of a compound (มุม
  // from มุมมอง) is the one place where length still says something.
  const factor = concepts.map((c) => (c.unigram && !c.latin ? Math.min(c.label.length, 6) / 6 : 1) * (c.nested ? 0.5 : 1));
  // A word inside a pair the corpus actually uses (one inside "one health",
  // มุม inside มุมมอง) is part of that phrase, not a second piece of evidence.
  const inPhrase = new Set();
  concepts.forEach((c, ci) => { if (c.covers && found(ci)) c.covers.forEach((w) => inPhrase.add(w)); });
  concepts.forEach((c, ci) => { if (c.unigram && inPhrase.has(c.label)) factor[ci] *= 0.5; });
  const weight = (ci, fi) => idf[ci][fi] * factor[ci];
  const best = (ci, cells) => {
    let top = 0;
    cells.forEach((n, fi) => { if (n) top = Math.max(top, n * weight(ci, fi)); });
    return top;
  };
  const anyRare = (ci, cells) => cells.some((n, fi) => n > 0 && rare[ci][fi]);

  // A question about something the corpus never names, asked next to words
  // it names everywhere, is not covered: only common words would match.
  const idfCeiling = Math.log(1 + total);
  const specificMatched = idf.some((ws, ci) => !concepts[ci].generic && ws.some((w) => w >= 0.6 * idfCeiling));
  const covered = !(unmatched.some((u) => /^[a-z0-9]/.test(u)) && !specificMatched);

  // How much of what the question says a section accounts for, weighted by
  // specificity; a word the corpus never uses weighs the most. Only words and
  // names count (a pair is the same evidence twice), never the facet words.
  const core = concepts.map((c) => !c.generic && (c.unigram || c.alias));
  const mass = concepts.map((c, ci) => {
    if (!core[ci]) return 0;
    const w = found(ci) ? Math.max(...idf[ci]) : idfCeiling;
    return w * (c.unigram && !c.latin ? Math.min(c.label.length, 6) / 6 : 1) * (c.nested ? 0.5 : 1);
  });
  const totalMass = mass.reduce((a, b) => a + b, 0);

  // pass 2 — what each article's title says, then each section on its own
  const titleInfo = new Map();
  for (const entry of topics) {
    let boost = 0;
    let hasRare = false;
    const named = new Set();
    concepts.forEach((c, ci) => {
      const cells = formHits(entry.titleLc, c);
      if (!cells) return;
      const top = best(ci, cells.map((n, fi) => (idf[ci][fi] > 0 ? 1 : 0)));
      if (top === 0) return;
      boost += top;
      named.add(ci);
      if (anyRare(ci, cells)) hasRare = true;
    });
    titleInfo.set(entry, { boost, hasRare, named });
  }

  const local = new Map();
  const topicRare = new Set();
  const topicBest = new Map();
  const topicHas = new Map(); // topic → concepts any of its sections contains
  for (const [s, row] of rows) {
    if (!topicHas.has(s.topic)) topicHas.set(s.topic, new Set());
    row.forEach((cells, ci) => { if (cells) topicHas.get(s.topic).add(ci); });
  }
  for (const [s, row] of rows) {
    const { named } = titleInfo.get(s.topic);
    let score = 0;
    let hasRare = false;
    row.forEach((cells, ci) => {
      if (!cells) return;
      const top = best(ci, cells);
      if (top === 0) return;
      // A heading that repeats the article's own subject says nothing new;
      // a heading that names another of the question's words does.
      const inHeading = s.headingLc && !named.has(ci) && formHits(s.headingLc, concepts[ci]);
      score += top * (inHeading ? 2 : 1);
      if (anyRare(ci, cells)) hasRare = true;
    });
    if (score === 0) continue;
    // Length normalization — an omnibus section that mentions everything
    // once must not outrank the short section that is ABOUT the question.
    score /= Math.sqrt(Math.max(1, s.text.length / 1200));
    local.set(s, { score, hasRare });
    if (hasRare) topicRare.add(s.topic);
    topicBest.set(s.topic, Math.max(topicBest.get(s.topic) || 0, score));
  }

  const facetWords = facets.flatMap((f) => f.heading);
  const scored = [];
  for (const [s, { score, hasRare }] of local) {
    const title = titleInfo.get(s.topic);
    // The article vouches for its sections: its title, or any of its
    // sections, carrying a rare word is enough.
    if (!hasRare && !title.hasRare && !topicRare.has(s.topic)) continue;
    let final = score + 0.5 * topicBest.get(s.topic) + title.boost;
    // The section headed with what the question asks for (Treatment,
    // Diagnosis, อาการ…) is the one that answers it.
    if (facetWords.length && s.headingLc && facetWords.some((w) => s.headingLc.includes(w))) final *= 1.5;
    const t = s.topic.t;
    const row = rows.get(s);
    // What share of the question this section answers for: its own words and
    // its title in full, words found elsewhere in its article at half.
    let matchedMass = 0;
    let ownMass = 0;
    concepts.forEach((_, ci) => {
      if (!mass[ci]) return;
      if (row[ci] || title.named.has(ci)) { matchedMass += mass[ci]; ownMass += mass[ci]; }
      else if (topicHas.get(s.topic)?.has(ci)) matchedMass += mass[ci] / 2;
    });
    const share = totalMass ? matchedMass / totalMass : 0;
    // A section that answers only the incidental words of a question (fish
    // vaccination for "วัคซีนพิษสุนัขบ้าฉีดกี่เข็ม") sinks below one that
    // answers its subject.
    if (totalMass) final *= Math.pow(Math.max(share, 0.05), COORD_EXPONENT);
    const coverage = totalMass ? ownMass / totalMass : 0;
    scored.push({ subject: t.subject, topic: t.topic, topicTitle: t.title, topicSummary: t.summary, sectionId: s.id, heading: s.heading, score: final, coverage });
  }

  scored.sort((a, b) => b.score - a.score || (a.sectionId < b.sectionId ? -1 : 1));
  const take = (list, n, cap) => {
    const out = [];
    const perTopicCount = new Map();
    for (const s of list) {
      const key = `${s.subject}--${s.topic}`;
      const k = perTopicCount.get(key) || 0;
      if (k >= cap) continue;
      perTopicCount.set(key, k + 1);
      out.push(s);
      if (out.length >= n) break;
    }
    return out;
  };
  // Offered as "the nearest thing VetWiki has" only when a section accounts
  // for at least half of what was asked; a hoof angle is not near a Norberg
  // angle, and pretending it is would send the student somewhere useless.
  const related = take(scored.filter((s) => s.coverage >= RELATED_MIN_COVERAGE), 3, 1);
  if (!covered) return { picks: [], covered: false, coverage: 0, unmatched, related, facets: facetIds };
  const picks = take(scored, maxSections, perTopic);
  const coverage = Math.max(0, ...picks.slice(0, 5).map((p) => p.coverage));
  return { picks, covered: picks.length > 0, coverage, unmatched, related, facets: facetIds };
}

/** Curated alias groups none of whose forms occur anywhere in the corpus.
 *  An alias may only ever point at content that exists; the eval test keeps
 *  this empty. */
export function vocabularyGaps() {
  const { sections } = corpus();
  const groups = aliasGroups().slice(0, ALIAS_GROUPS.length);
  return groups
    .map((g, gi) => ({ forms: ALIAS_GROUPS[gi], hit: g.corpus.some((f) => sections.some((s) => countForm(s.text, f) > 0)) }))
    .filter((g) => !g.hit)
    .map((g) => g.forms);
}

/** How a question was read: each concept, its forms and how many sections
 *  contain each form. For the eval script's --explain and for debugging. */
export function explainQuestion(question) {
  const { concepts, facets } = buildConcepts(question);
  const { sections } = corpus();
  return {
    facets: facets.map((f) => f.id),
    concepts: concepts.map((c) => ({
      label: c.label,
      kind: c.alias ? (c.nested ? 'alias (nested)' : 'alias') : c.key.slice(0, 1),
      forms: c.forms.map((f) => {
        let df = 0;
        for (const s of sections) if (countForm(s.text, f)) df++;
        return `${f.thai || f.re.source}=${df}`;
      }),
    })),
  };
}

/** The sections most relevant to a question (see retrieveForQuestion). */
export function retrieveSections(question, opts = {}) {
  return retrieveForQuestion(question, opts).picks;
}

/** Materialize picks into full section objects, grouped by topic, in one
 *  pass per topic. Order inside the result follows the picks (score order). */
export function sectionsForPicks(picks) {
  const byTopic = new Map();
  const out = [];
  for (const p of picks || []) {
    const key = `${p.subject}--${p.topic}`;
    if (!byTopic.has(key)) {
      const k = loadTopic(p.subject, p.topic);
      byTopic.set(key, k ? new Map(k.sections.map((s) => [s.id, s])) : new Map());
    }
    const section = byTopic.get(key).get(p.sectionId);
    if (section) out.push({ subject: p.subject, topic: p.topic, topicTitle: p.topicTitle, topicSummary: p.topicSummary || '', section });
  }
  return out;
}
