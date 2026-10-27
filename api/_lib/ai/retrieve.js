// ============================================================
// ai/retrieve.js — from a question to the numbered sources the answer cites
// ============================================================
// Two retrievers, one ranking:
//
//   VetWiki's own retrieval (src/lib/vetwiki/retrieve.js) — tuned and
//   measured against its eval set for the governed corpus — nominates
//   sections; the concept index (textindex.js) ranks EVERYTHING (wiki
//   sections, notes, clip summaries, bank questions) on one scale, with the
//   wiki's nominations boosted by their rank. One scale matters: a clip
//   section that states the answer must be able to beat a wiki section that
//   only shares a heading word with the question, which the wiki ranking alone
//   could not see (measured: "ระยะฟักตัวของโรคพิษสุนัขบ้า" — the wiki ranked
//   four avian "ระยะฟักตัว" headings above anything about rabies).
//
// Selection keeps the answer readable and the citations honest: at most
// MAX_SOURCES, a cap per kind and per article/clip so one long lecture cannot
// fill every slot, and nothing that answers less than half of what was asked
// unless nothing better exists.
//
// `covered` is the honest flag the page shows: false when no source answers
// the core of the question. The prompt then tells the model to say so in one
// sentence before using general knowledge.
// ============================================================

import { retrieveForQuestion } from '../../../src/lib/vetwiki/retrieve.js';
import { MAX_SOURCES, CONTEXT_CHARS, SNIPPET_CHARS } from './config.js';
import { buildConcepts, snippetNeedles, speciesIn } from './concepts.js';
import { subjectName, topicLabel, questionText } from './corpus.js';
import { guideSubtitle } from './guide.js';
import { wikiLink, videoLink, questionSetLink, viewLink } from './links.js';
import { clip, contextText, plainText, snippetAround } from './text.js';

// What one source may contribute to the model's context, by kind.
const CONTEXT_CAP = { wiki: 2400, note: 2000, video: 2000, question: 1300, guide: 2600, paper: 1600, library: 1500 };
// How many of each kind an answer may cite.
const KIND_CAP = { wiki: 4, note: 3, video: 3, question: 2 };
// What an article about another animal keeps of its score.
const SPECIES_ELSEWHERE = 0.75;
const KIND_LABEL = { wiki: 'VetWiki', note: 'สรุปบทเรียน', video: 'สรุปคลิปเลกเชอร์', question: 'ข้อสอบในคลัง', guide: 'ข้อมูลของ VetMock', paper: 'งานวิจัย', library: 'หน้าสไลด์หรือเอกสารจากห้องสมุด VetMock' };

/** Section id → corpus position, built once per corpus. */
function wikiPositions(corpus) {
  if (!corpus.wikiPos) {
    corpus.wikiPos = new Map();
    corpus.docs.forEach((d, i) => { if (d.kind === 'wiki') corpus.wikiPos.set(d.sectionId, i); });
  }
  return corpus.wikiPos;
}

/** VetWiki's nominations for a question, as rank-based multipliers. */
export function wikiNominations(corpus, questions) {
  const pos = wikiPositions(corpus);
  const boost = new Map();
  for (const q of questions) {
    if (!q) continue;
    const { picks } = retrieveForQuestion(q, { maxSections: 8 });
    picks.forEach((p, r) => {
      const i = pos.get(p.sectionId);
      if (i === undefined) return;
      const m = Math.max(1.1, 1.35 - 0.04 * r);
      if (m > (boost.get(i) || 1)) boost.set(i, m);
    });
  }
  return boost;
}

/**
 * Rank the corpus for a question.
 * @param {object} corpus   loadCorpus() result
 * @param {object} o
 * @param {string} o.text          the question text(s) to read concepts from
 * @param {string[]} [o.terms]     English search terms (planner)
 * @param {string[]} [o.wikiQueries] questions to ask VetWiki's retrieval
 */
export function searchCorpus(corpus, { text, terms = [], wikiQueries = [] } = {}) {
  const read = buildConcepts(text, { extraTerms: terms });
  if (!read.concepts.length) return { ...read, ranked: [], anyRare: false, unmatched: [] };
  const boost = wikiNominations(corpus, wikiQueries.length ? wikiQueries : [text]);
  const { results, anyRare, idf } = corpus.index.rank(read.concepts, {
    facetWords: read.facetWords,
    boost: (i) => boost.get(i) || 1,
    limit: 80,
  });
  // What the question names that nothing in VetMock mentions at all: the
  // model is told, so "Norberg angle" is answered as not covered rather than
  // from a section about some other angle.
  const unmatched = read.concepts.filter((c, i) => c.core && idf[i] === 0).map((c) => c.label).slice(0, 5);
  // An article whose title names other animals than the one asked about steps
  // back (it stays in, for when nothing else exists): the canine enteritis
  // treatment section outranked the feline panleukopenia lecture's for a
  // question about cats, and equine blood parasites a question about cattle.
  const asked = new Set(read.concepts.map((c) => c.species).filter(Boolean));
  const ranked = results.map((r) => {
    const doc = corpus.docs[r.i];
    if (!asked.size) return { ...r, doc };
    const named = speciesIn(doc.title);
    const other = named.size > 0 && ![...named].some((s) => asked.has(s));
    return { ...r, doc, score: other ? r.score * SPECIES_ELSEWHERE : r.score };
  }).sort((a, b) => b.score - a.score || a.i - b.i);
  return { ...read, anyRare, unmatched, ranked };
}

const groupKey = (d) => (d.kind === 'video' ? `v:${d.videoId}` : d.kind === 'question' ? `q:${d.subject}:${d.topic}` : `${d.kind}:${d.subject}:${d.topic}`);

/**
 * The few ranked documents worth citing.
 * @param {Array} ranked   searchCorpus().ranked
 * @param {object} o
 * @param {number} [o.max]
 * @param {Set<string>} [o.kinds]  kinds allowed (all corpus kinds by default)
 */
export function selectDocs(ranked, { max = MAX_SOURCES, kinds = null } = {}) {
  if (!ranked.length) return [];
  const top = ranked[0].score;
  const out = [];
  const perKind = {};
  const perGroup = {};
  for (const r of ranked) {
    if (out.length >= max) break;
    if (kinds && !kinds.has(r.doc.kind)) continue;
    // Half the question answered, and not a distant tail of the ranking.
    if (r.coverage < 0.5 || r.score < top * 0.2) continue;
    const k = r.doc.kind;
    const g = groupKey(r.doc);
    if ((perKind[k] || 0) >= (KIND_CAP[k] || 3)) continue;
    if ((perGroup[g] || 0) >= 2) continue;
    perKind[k] = (perKind[k] || 0) + 1;
    perGroup[g] = (perGroup[g] || 0) + 1;
    out.push(r);
  }
  return out;
}

/** Does the selection answer the core of the question? */
export function isCovered(selected) {
  return selected.some((r) => r.coverage >= 0.6 && r.score >= 3);
}

/**
 * The search an answer cites from: the planner's reading, unless it finds
 * nothing that answers the question while the question as typed does (one
 * stray term once turned a distemper question into rinderpest citations). A
 * follow-up ("แล้วในแมวล่ะ") has no reading of its own, so there the planner's
 * stands.
 */
export function chooseSearch(typed, planned, { followUp = false } = {}) {
  if (!typed || followUp) return planned;
  const answers = (f) => isCovered(selectDocs(f.ranked));
  return !answers(planned) && answers(typed) ? typed : planned;
}

// "[30:23-30:51]" or "[1:02:03" at the start of a clip heading → seconds.
export function headingSeconds(heading) {
  const m = /\[(?:(\d{1,2}):)?(\d{1,3}):(\d{2})/.exec(String(heading || ''));
  if (!m) return 0;
  return (Number(m[1] || 0) * 3600) + (Number(m[2]) * 60) + Number(m[3]);
}

/**
 * A corpus or guide document (or a paper) as a source: what the page shows
 * and what the model reads.
 */
export function toSource(item, { needles = [] } = {}) {
  const d = item.doc || item;
  if (d.kind === 'paper' || item.kind === 'paper') {
    const p = item.paper || item;
    const head = [p.title, [p.journal, p.year].filter(Boolean).join(' '), p.authors].filter(Boolean).join('\n');
    return {
      kind: 'paper',
      title: p.title,
      subtitle: [p.journal, p.year].filter(Boolean).join(' '),
      url: p.url,
      snippet: clip(p.abstract || p.title, SNIPPET_CHARS),
      context: `${head}\nAbstract: ${clip(p.abstract || '(ไม่มีบทคัดย่อ)', CONTEXT_CAP.paper)}`,
    };
  }
  const raw = d.kind === 'question' ? questionText(d.q) : d.text;
  const ctx = contextText(raw);
  const base = {
    kind: d.kind,
    snippet: snippetAround(plainText(raw), needles, SNIPPET_CHARS),
    context: ctx.length > CONTEXT_CAP[d.kind] ? snippetAround(ctx, needles, CONTEXT_CAP[d.kind]) : ctx,
  };
  if (d.kind === 'wiki') {
    return { ...base, title: d.title, subtitle: d.heading, subject: subjectName(d.subject), url: wikiLink(d.subject, d.topic, d.sectionId) };
  }
  if (d.kind === 'video') {
    return { ...base, title: d.title, subtitle: d.heading ? plainText(d.heading) : 'สรุปคลิปเลกเชอร์', subject: subjectName(d.subject), url: videoLink(d.videoId, headingSeconds(d.heading)) };
  }
  if (d.kind === 'note') {
    // Year-2 notes have no address of their own yet; the subject picker is
    // where NotesView is opened from.
    return { ...base, title: d.title, subtitle: d.heading, subject: subjectName(d.subject), url: viewLink('subject-select') };
  }
  if (d.kind === 'question') {
    const tl = topicLabel(d.q.subject, d.q.topic);
    return { ...base, title: clip(d.q.q, 110), subtitle: `ข้อสอบ ${subjectName(d.q.subject)}${tl ? `, ${tl}` : ''}`, subject: subjectName(d.q.subject), url: questionSetLink([d.q]) };
  }
  // guide
  return {
    ...base,
    title: d.title,
    subtitle: guideSubtitle(d),
    ...(d.subject ? { subject: subjectName(d.subject) } : {}),
    url: d.url,
  };
}

/**
 * Number the sources, fit their context into the budget, and split what the
 * page sees from what the model reads.
 * @returns {{ items: Array, contextBlocks: string, contextText: string }}
 */
export function numberSources(sources, { budget = CONTEXT_CHARS } = {}) {
  let left = budget;
  const kept = [];
  for (const s of sources) {
    if (left < 250) break;
    const ctx = s.context.length > left ? `${s.context.slice(0, left - 1)}…` : s.context;
    left -= ctx.length;
    kept.push({ ...s, context: ctx });
  }
  // Headings in the notes use the middle dot as a separator; on the page it
  // reads as a comma (house style).
  const tidy = (t) => clip(String(t ?? '').replace(/[ \t]*·[ \t]*/g, ', '), 160);
  const items = kept.map((s, i) => {
    const item = { n: i + 1, kind: s.kind, title: tidy(s.title), url: s.url, snippet: s.snippet };
    if (s.subtitle) item.subtitle = tidy(s.subtitle);
    if (s.subject) item.subject = s.subject;
    return item;
  });
  const esc = (t) => String(t).replace(/<\/?source/gi, '‹source');
  const contextBlocks = kept.map((s, i) => (
    `<source n="${i + 1}" kind="${KIND_LABEL[s.kind] || s.kind}">\n${esc(s.title)}${s.subtitle ? ` | ${esc(s.subtitle)}` : ''}\n${esc(s.context)}\n</source>`
  )).join('\n\n');
  // What each source said, exactly as the model saw it: check.js holds a
  // number in a cited sentence against the source that sentence cites.
  const sourceTexts = kept.map((s) => `${s.title}\n${s.subtitle || ''}\n${s.context}`);
  return { items, contextBlocks, sourceTexts, contextText: sourceTexts.join('\n') };
}

export { snippetNeedles };
