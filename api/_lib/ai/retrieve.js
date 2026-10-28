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
import { termForm } from './textindex.js';
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
  if (!read.concepts.length) return { ...read, ranked: [], anyRare: false, unmatched: [], idf: [] };
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
  // back, and is cited only when nothing on the asked animal answers (see
  // selectDocs): the canine enteritis treatment section outranked the feline
  // panleukopenia lecture's for a question about cats, and fowlpox pages (FPV
  // is also fowlpox virus) were cited beside it.
  const share = animalShare(read);
  const ranked = results.map((r) => {
    const doc = corpus.docs[r.i];
    const s = share(doc.title);
    return s < 1 ? { ...r, doc, elsewhere: true, score: r.score * s } : { ...r, doc };
  }).sort((a, b) => b.score - a.score || a.i - b.i);
  return { ...read, anyRare, unmatched, ranked, idf };
}

/**
 * What a title keeps of its score for the animals it names: SPECIES_ELSEWHERE
 * when it names only animals the question (`asked`, its concepts) does not
 * ask about, else 1. The study library's card uses the same rule.
 */
export function animalShare(asked) {
  const want = new Set((asked?.concepts || []).map((c) => c.species).filter(Boolean));
  return (title) => {
    if (!want.size) return 1;
    const named = speciesIn(title);
    return named.size > 0 && ![...named].some((s) => want.has(s)) ? SPECIES_ELSEWHERE : 1;
  };
}

/**
 * What a file beside the answer must cover: the most specific whole term the
 * question itself names, a disease, organism or drug it names or a Latin term
 * it types (ORT, HCM), as the forms to look for; null when it has none. Thai
 * word tokens are left out (the segmenter cuts some into fragments), and so
 * are the planner's extra terms. "ยาฆ่าเชื้อที่ใช้รักษา pyometra ในสุนัข" names
 * ยาฆ่าเชื้อ and pyometra; pyometra is the rarer, and a deck that only says
 * ยาฆ่าเชื้อ on its pages (an entomology question set did) is not about it.
 */
export function questionTopic(corpus, asked) {
  const idf = asked?.idf || [];
  const ceiling = Math.log(1 + corpus.docs.length);
  let best = null;
  (asked?.concepts || []).forEach((c, i) => {
    const typedLatin = c.kind === 'word' && c.forms.length > 0 && c.forms.every((f) => f.re);
    if (!(c.named || typedLatin) || c.extra) return;
    const v = idf[i] > 0 ? idf[i] : ceiling;
    if (!best || v > best.idf) best = { idf: v, label: c.label, forms: c.forms };
  });
  return best;
}

const formKey = (f) => (f.thai ? `t:${f.thai}` : `r:${f.re.source}`);

/**
 * How specific a search term is for a turn, 0 to 1: the idf over VetMock's own
 * text of the concept the term names, as a share of the most specific core
 * concept the question itself names (the planner's extra terms aside), 1 when
 * at least as rare. A share of RARE_SHARE or more is one of the rare things
 * asked, as the index counts them. One thing is one concept: leptospirosis is
 * as specific as เลปโตสไปโรซิส, the concept these searches (`asked`, the search
 * the answer cites from, and `others`) scored; a term outside them is counted
 * by itself, and one no text uses is fully specific.
 * For "ORT ในไก่ ... ควบคุมป้องกันอย่างไร": ORT 1 (in ~8 of 17,195 documents),
 * ควบคุม 0.39 (~870). The study library weighs its title words and search
 * phrases by it (library.js rankFiles). Counted by library titles instead,
 * ควบคุม is in 8 of 2,128 and ORT in 1: too close to tell apart.
 */
export function termSpecificity(corpus, asked, ...others) {
  const idf = asked?.idf || [];
  const most = (keep) => Math.max(0, ...(asked?.concepts || []).map((c, i) => (c.core && idf[i] > 0 && keep(c) ? idf[i] : 0)));
  // the topic is what the question names; a rare planner phrase ("rumen anatomy") is not it
  const top = most((c) => !c.extra) || most(() => true);
  if (!top) return () => 1;
  const n = corpus.docs.length;
  // what a concept no text uses weighs (as in the index's coverage)
  const ceiling = Math.log(1 + n);
  const ofConcept = new Map();
  for (const s of [asked, ...others]) {
    (s?.concepts || []).forEach((c, i) => {
      const v = s.idf[i] > 0 ? s.idf[i] : ceiling;
      for (const f of c.forms) if (!ofConcept.has(formKey(f))) ofConcept.set(formKey(f), v);
    });
  }
  const memo = new Map();
  return (term) => {
    const form = termForm(String(term || ''));
    const key = form ? formKey(form) : '';
    if (!memo.has(key)) {
      let v = form ? ofConcept.get(key) : ceiling;
      if (v === undefined) {
        const df = corpus.index.hits(form).size;
        v = df ? Math.log(1 + n / df) : ceiling;
      }
      memo.set(key, Math.min(1, v / top));
    }
    return memo.get(key);
  };
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
  // Half the question answered, and not a distant tail of the ranking.
  const answers = (r) => r.coverage >= 0.5 && r.score >= top * 0.2 && (!kinds || kinds.has(r.doc.kind));
  const onAnimal = ranked.some((r) => !r.elsewhere && answers(r));
  for (const r of ranked) {
    if (out.length >= max) break;
    if (!answers(r) || (r.elsewhere && onAnimal)) continue;
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
