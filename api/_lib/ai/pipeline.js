// ============================================================
// ai/pipeline.js — one chat turn, from validated input to the last event
// ============================================================
// The route validates, rate-limits and opens the stream; everything after
// that happens here, in this order:
//
//   status plan    at once, so the page shows life within ~150 ms
//   [vision]       an attached image is described first (its text joins
//                  the query)
//   planner  ┐     the model's plan (intent, standalone question, English
//   search   ┘     terms) runs WHILE the corpus is searched for the raw
//                  question; when the plan arrives, a second pass searches
//                  its standalone question and terms (form hits are cached,
//                  so the second pass re-scans almost nothing)
//   [research]     PubMed / OpenAlex for research questions, or for a
//                  research-type question VetMock does not cover
//   sources        once, numbered; then any cards (quiz, action, papers)
//   status write → delta… → check → done     (or error, then the end)
//
// Every dependency that leaves the process (planner, vision, writer, paper
// search, KV) can be replaced through `deps`, which is how the unit tests run
// a whole turn without a network.
// ============================================================

import { chatJSON, visionJSON } from '../llm.js';
import { kvGetJSON, kvSetJSON } from '../rate-limit.js';
import { questionCatalog } from '../question-catalog.js';
import { visibleQuestionCount } from '../../../src/data/curriculum.js';
import { MAX_SOURCES, REQUEST_DEADLINE_MS } from './config.js';
import { loadCorpus, warmCorpus } from './corpus.js';
import { heuristicPlan, runPlanner, asksForFiles, fileKindIn, isFollowUp } from './planner.js';
import { searchCorpus, selectDocs, isCovered, chooseSearch, toSource, numberSources, snippetNeedles } from './retrieve.js';
import { retrieveGuide, guideRoutes, loadGuide, examDocs, thaiShortDate } from './guide.js';
import { pickQuiz } from './quiz.js';
import { buildActionCard } from './actions.js';
import { findPapers, papersCard } from './papers.js';
import { findFiles, filesCard, filesLead, pageSource } from './library.js';
import { describeImage } from './vision.js';
import { writeAnswer } from './writer.js';
import { SYSTEM_PROMPT, turnNote, writerMessages } from './prompt.js';
import { computeCheck } from './check.js';
import { createOutputFilter } from './text.js';

export const STATUS = Object.freeze({
  plan: 'กำลังทำความเข้าใจคำถาม',
  vision: 'กำลังอ่านภาพที่แนบ',
  search: 'ค้นในคลัง VetMock',
  research: 'ค้นงานวิจัยที่ตีพิมพ์',
  write: 'กำลังเขียนคำตอบ',
});

export const ERROR_MESSAGES = Object.freeze({
  timeout: 'ใช้เวลานานเกินไป ลองถามใหม่อีกครั้ง',
  provider: 'ระบบตอบคำถามขัดข้องชั่วคราว ลองถามใหม่อีกครั้ง',
  unexpected: 'เกิดข้อผิดพลาดที่ไม่คาดคิด ลองถามใหม่อีกครั้ง',
});

// A question that asks about evidence: worth a literature search when the
// course material does not answer it.
const RESEARCHY = /(งานวิจัย|การศึกษา|ศึกษาพบ|หลักฐาน|ความชุก|อุบัติการณ์|ล่าสุด|evidence|stud(?:y|ies)|trial|prevalence|incidence|meta-?analysis|recent|latest)/i;

// How long an answer waits for the study library before it starts writing
// (warm: 0.2 to 0.5 s for the search and the page text).
const LIBRARY_BUDGET_MS = 900;

let countsPending = null;
/** Deliverable questions per subject, counted the way the subject cards count. */
export function questionCounts() {
  if (!countsPending) {
    countsPending = questionCatalog().then((catalog) => {
      const all = [...catalog.values()];
      const subjects = new Set(all.map((q) => q.subject));
      return new Map([...subjects].map((s) => [s, visibleQuestionCount(s, all)]));
    }).catch((err) => { countsPending = null; throw err; });
  }
  return countsPending;
}

/** English words already in the question, for a search when the plan has none. */
function latinTerms(text) {
  return [...new Set((String(text).match(/[A-Za-z][A-Za-z0-9-]{2,}/g) || [])
    .filter((w) => !/^(vetmock|paper|papers|research|latest|recent|study|the|and|for|with)$/i.test(w)))].slice(0, 4);
}

// Node's HTTP response corks a chunk and writes it on the next tick, and the
// tick queue only runs once the microtask queue is empty. Code that goes from
// `send()` straight into synchronous work (the corpus search is ~100-300 ms of
// CPU) inside an async continuation therefore holds the event back until that
// work is done: measured locally, the first status reached the reader 350 ms
// after it was "sent". A macrotask boundary lets the write out first.
// (setTimeout 0, not setImmediate: the repo's globals lint allows only the shared set)
const yieldToSocket = () => new Promise((resolve) => setTimeout(resolve, 0));

let statsPending = null;
/**
 * What the chat can answer from, counted from the corpora retrieval loads
 * (GET /api/ai-chat). A count that cannot be made is left out, never guessed.
 */
export function chatStats() {
  if (!statsPending) {
    statsPending = (async () => {
      const stats = {};
      try {
        const corpus = await loadCorpus();
        stats.questions = corpus.counts.question;
        stats.wikiSections = corpus.counts.wiki;
        stats.wikiTopics = new Set(corpus.docs.filter((d) => d.kind === 'wiki').map((d) => `${d.subject}--${d.topic}`)).size;
        stats.noteSections = corpus.counts.note;
        stats.videos = new Set(corpus.docs.filter((d) => d.kind === 'video').map((d) => d.videoId)).size;
      } catch (err) {
        console.warn('[ai-chat] stats corpus', err?.message || err);
      }
      try {
        const { docs } = await loadGuide(await questionCounts());
        stats.guideItems = docs.length + (await examDocs()).length;
      } catch (err) {
        console.warn('[ai-chat] stats guide', err?.message || err);
      }
      // A partial count is not cached for the life of the instance.
      if (Object.keys(stats).length < 6) statsPending = null;
      return stats;
    })();
  }
  return statsPending;
}

/**
 * Run one turn.
 * @param {{ messages, image, question }} input   validateChatInput() result
 * @param {object} io
 * @param {(name, data) => boolean} io.send
 * @param {AbortSignal} io.signal                 aborted when the reader leaves
 * @param {number} [io.t0]                        when the request arrived
 * @param {object} [io.env]
 * @param {object} [io.deps]                      { chat, vision, fetchImpl, kv, rng, now }
 */
export async function runChat(input, { send, signal, t0 = Date.now(), env = process.env, deps = {} } = {}) {
  const D = { chat: chatJSON, vision: visionJSON, fetchImpl: fetch, kv: { get: kvGetJSON, set: kvSetJSON }, rng: Math.random, now: () => new Date(), ...deps };
  const since = () => Date.now() - t0;
  const timing = { status: null, sources: null, firstDelta: null };
  const { messages, image, question } = input;

  send('status', { phase: 'plan', label: STATUS.plan });
  timing.status = since();
  await yieldToSocket();
  warmCorpus();

  // One deadline for the whole turn, under the platform's limit.
  const deadline = new AbortController();
  const deadlineTimer = setTimeout(() => deadline.abort(new Error('deadline')), Math.max(1000, REQUEST_DEADLINE_MS - since()));
  const sig = signal ? AbortSignal.any([signal, deadline.signal]) : deadline.signal;

  try {
    // ── image ───────────────────────────────────────────────────────────
    let imageText = '';
    let imageFailed = false;
    if (image) {
      send('status', { phase: 'vision', label: STATUS.vision });
      const v = await describeImage(image, { question, env, vision: D.vision });
      imageText = v.text;
      imageFailed = !v.ok;
    }

    // ── plan and search, side by side ───────────────────────────────────
    const heuristic = heuristicPlan(messages, { imageText });
    // A turn that is nothing but a greeting or a thank-you has nothing to
    // plan; asking the model would only add a second of waiting.
    const plannerP = heuristic.intent === 'chat'
      ? Promise.resolve(heuristic)
      : runPlanner(messages, { imageText, env, chat: D.chat });
    send('status', { phase: 'search', label: STATUS.search });
    await yieldToSocket();
    const corpus = await loadCorpus();
    let found = heuristic.intent === 'chat' ? null : searchCorpus(corpus, { text: heuristic.query_th, wikiQueries: [heuristic.query_th] });
    const plan = await plannerP;
    let intent = plan.intent;
    if (plan.source === 'model' && intent !== 'chat') {
      const planned = searchCorpus(corpus, {
        text: `${plan.query_th} ${imageText}`.trim(),
        terms: plan.terms_en,
        wikiQueries: [plan.query_th, heuristic.query_th],
      });
      found = chooseSearch(found, planned, { followUp: isFollowUp(question) });
    } else if (intent !== 'chat' && !found) {
      found = searchCorpus(corpus, { text: heuristic.query_th, wikiQueries: [heuristic.query_th] });
    }
    // A question of a known app shape is about the app, whatever the planner
    // thought: its answer is in the timetable or the changelog, not the notes.
    const routes = guideRoutes(question);
    if (intent === 'answer' && (routes.exam || routes.whatsNew || routes.subjects)) intent = 'guide';
    // "ขอสไลด์ rabies" asks for files in so many words; a model that read it as a
    // question about rabies (it did, in production) does not get the last word
    if ((intent === 'answer' || intent === 'research') && asksForFiles(question)) intent = 'files';
    const fileAsk = intent === 'files' ? plan.files || { kind: fileKindIn(question), title: '' } : null;
    const needles = found ? snippetNeedles(found.concepts) : [];

    // ── the study library ───────────────────────────────────────────────
    // Started now, awaited just before the sources go out: files for a request
    // for files, the matching slide pages for an answer. It never fails a turn.
    const libraryP = ['files', 'answer', 'research'].includes(intent)
      ? findFiles({
        terms: plan.terms_en.length ? plan.terms_en : latinTerms(`${question} ${plan.query_th}`),
        needles,
        subjects: plan.subjects,
        kind: fileAsk?.kind || '',
        title: fileAsk?.title || '',
        files: intent === 'files',
      }, { env, fetchImpl: D.fetchImpl, signal: sig, timeoutMs: intent === 'files' ? 4000 : 3500 })
      : null;

    // ── what this turn needs ────────────────────────────────────────────
    const sources = [];
    const cards = [];
    let covered = false;
    let files = null;
    let filesMissing = null;
    let relatedFiles = 0;
    let lateLibrary = null;
    let quiz = null;
    let quizMissing = null;
    let action = null;
    let actionMissing = null;
    let papers = [];
    let researchFailed = false;

    if (intent === 'chat') {
      covered = true;
    } else if (intent === 'quiz') {
      const r = pickQuiz(corpus, { subjects: plan.subjects, concepts: found?.concepts || [], n: plan.quiz_n, rng: D.rng });
      if (r.card) {
        cards.push(r.card);
        quiz = { count: r.card.questions.length, title: r.card.title };
        covered = true;
      } else {
        quizMissing = plan.subjects.length
          ? 'วิชาที่ขอยังไม่มีข้อสอบในคลังที่แสดงในแชทได้'
          : 'ยังไม่รู้ว่าต้องการข้อสอบวิชาหรือหัวข้อไหน ให้ถามนิสิตกลับ';
      }
    } else if (intent === 'files') {
      // the card is the answer; the writer only introduces it
      const lib = await libraryP;
      if (lib.items.length) {
        cards.push(filesCard(lib.items));
        files = {
          lead: filesLead(lib.items),
          count: lib.items.length,
          // what the card shows may be repeated in the text (see the number check)
          shown: lib.items.map((f) => `${f.title} ${f.pages || ''} ${f.page || ''} ${f.subjectName} ${f.lecturer}`).join('\n'),
        };
        covered = true;
      } else {
        filesMissing = lib.failed ? 'เปิดห้องสมุดไม่สำเร็จในครั้งนี้' : 'ห้องสมุดยังไม่มีไฟล์ที่เปิดให้ทุกคนที่ตรงกับที่ขอ';
        // a subject was named: its shelf is the next best door
        const r = plan.subjects[0] ? buildActionCard({ type: 'library', subject: plan.subjects[0] }, { corpus, rng: D.rng }) : {};
        if (r.card) {
          cards.push(r.card);
          action = { label: r.card.label, say: r.card.say };
        }
      }
    } else if (intent === 'action') {
      const wikiTop = found?.ranked.find((x) => x.doc.kind === 'wiki' && x.coverage >= 0.5)?.doc;
      const request = {
        ...(plan.action || { type: 'feature' }),
        wiki: wikiTop ? { subject: wikiTop.subject, topic: wikiTop.topic } : null,
      };
      if (request.type === 'feature' && !request.feature && wikiTop) request.type = 'wiki';
      const r = buildActionCard(request, { corpus, rng: D.rng });
      if (r.card) {
        cards.push(r.card);
        action = { label: r.card.label, say: r.card.say };
        covered = true;
      } else {
        actionMissing = r.reason;
      }
    } else if (intent === 'guide') {
      // The app's own data failing to load must not fail the turn: the
      // answer then says VetMock has nothing on it, honestly.
      const g = await retrieveGuide(`${question} ${plan.query_th}`, found?.concepts || [], {
        facetWords: found?.facetWords || [],
        now: D.now(),
        questionCounts: await questionCounts().catch(() => new Map()),
      }).catch((err) => {
        console.warn('[ai-chat] guide', String(err?.message || err).slice(0, 200));
        return { picks: [], featureId: null, routed: false };
      });
      for (const p of g.picks) sources.push(toSource(p, { needles }));
      covered = g.picks.length > 0;
      if (g.featureId) {
        const r = buildActionCard({ type: 'feature', feature: g.featureId }, { corpus, rng: D.rng });
        if (r.card) {
          cards.push(r.card);
          action = { label: r.card.label, say: r.card.say };
        }
      }
      // A question about the app that also names course content ("VetMock มี
      // เรื่อง FIP ไหม") gets that content too.
      if (!g.routed) {
        for (const r of selectDocs(found?.ranked || [], { max: 3 })) sources.push(toSource(r, { needles }));
      }
    }

    let selected = [];
    if (intent === 'answer' || intent === 'research') {
      selected = selectDocs(found?.ranked || [], { max: MAX_SOURCES });
      covered = isCovered(selected);
    }

    // ── literature ──────────────────────────────────────────────────────
    const wantsResearch = intent === 'research' || plan.needs_research
      || (intent === 'answer' && !covered && RESEARCHY.test(question));
    if (wantsResearch) {
      const terms = plan.terms_en.length ? plan.terms_en : latinTerms(`${question} ${plan.query_th}`);
      if (terms.length) {
        send('status', { phase: 'research', label: STATUS.research });
        await yieldToSocket();
        const res = await findPapers(terms, { recent: plan.recent, signal: sig, env, fetchImpl: D.fetchImpl, kv: D.kv });
        papers = res.papers.slice(0, 5);
        researchFailed = !papers.length && Boolean(res.failed);
      } else {
        researchFailed = intent === 'research';
      }
    }
    if (intent === 'answer' || intent === 'research') {
      // Papers lead a research answer, with up to three of VetMock's own
      // sources after them; an ordinary answer keeps the course first, then
      // the lecturer's own slide pages, then papers. The library gets a
      // moment, not the answer's start: if it is slower, its card follows
      // during the answer and its pages are left out of this one.
      let budget;
      const lib = await Promise.race([libraryP, new Promise((r) => { budget = setTimeout(r, LIBRARY_BUDGET_MS, null); })])
        .finally(() => clearTimeout(budget)) || { items: [], pages: [] };
      if (!lib.items.length && !lib.pages.length) lateLibrary = libraryP;
      const slideSources = lib.pages.map((p) => pageSource(p, { needles }));
      const room = Math.max(0, (intent === 'research' ? Math.min(3, MAX_SOURCES - papers.length) : MAX_SOURCES - papers.length) - slideSources.length);
      const corpusSources = selected.slice(0, room).map((r) => toSource(r, { needles }));
      const paperSources = papers.map((p) => toSource({ kind: 'paper', paper: p }));
      sources.push(...(intent === 'research' ? [...paperSources, ...corpusSources, ...slideSources] : [...corpusSources, ...slideSources, ...paperSources]));
      // a slide page holding every search term is VetMock material on the topic
      if (slideSources.length) covered = true;
      if (lib.items.length) relatedFiles = lib.items.length;
      if (papers.length) cards.push(papersCard(papers));
      if (lib.items.length) cards.push(filesCard(lib.items, { related: true }));
    } else if (papers.length) {
      cards.push(papersCard(papers));
    }

    // ── sources, cards ──────────────────────────────────────────────────
    const numbered = numberSources(sources.slice(0, MAX_SOURCES));
    send('sources', { covered, items: numbered.items });
    timing.sources = since();
    if (cards.length) send('cards', { items: cards });

    // ── the answer ──────────────────────────────────────────────────────
    send('status', { phase: 'write', label: STATUS.write });
    await yieldToSocket();
    const { bangkokDate } = await import('../../../src/data/schedule.js');
    const note = turnNote({
      intent,
      covered,
      sourceCount: numbered.items.length,
      quiz,
      quizMissing,
      action,
      actionMissing,
      filesMissing,
      relatedFiles,
      papers: papers.length,
      researchFailed,
      unmatched: intent === 'answer' || intent === 'research' ? found?.unmatched || [] : [],
      imageText,
      imageFailed,
      today: thaiShortDate(bangkokDate(D.now())),
    });
    const filter = createOutputFilter();
    let shown = '';
    const emit = (text) => {
      if (!text) return;
      shown += text;
      if (timing.firstDelta === null) timing.firstDelta = since();
      send('delta', { text });
    };
    let result;
    if (files) {
      // the card is the answer, introduced by a line made from it
      emit(files.lead);
      result = { ok: true, model: 'card' };
    } else {
      result = await writeAnswer({
        system: SYSTEM_PROMPT,
        messages: writerMessages(messages, numbered.contextBlocks, note),
        onDelta: (raw) => emit(filter.push(raw)),
        signal: sig,
        env,
        fetchImpl: D.fetchImpl,
      });
      emit(filter.flush());
    }

    const log = {
      ms: since(),
      tStatus: timing.status,
      tSources: timing.sources,
      tFirstDelta: timing.firstDelta,
      intent,
      plan: plan.source,
      sources: numbered.items.length,
      kinds: numbered.items.reduce((m, s) => ({ ...m, [s.kind]: (m[s.kind] || 0) + 1 }), {}),
      covered,
      quiz: quiz?.count || 0,
      papers: papers.length,
      files: files?.count || relatedFiles,
      actions: action ? 1 : 0,
      chars: shown.length,
      filtered: filter.dropped(),
    };

    if (!result.ok) {
      if (signal?.aborted) {
        console.log('[ai-chat]', JSON.stringify({ ...log, outcome: 'reader-left' }));
        return log;
      }
      const reason = deadline.signal.aborted || result.reason === 'timeout' ? 'timeout' : 'provider';
      send('error', { reason, message: ERROR_MESSAGES[reason] });
      console.log('[ai-chat]', JSON.stringify({ ...log, outcome: `error-${reason}`, model: result.model, partial: Boolean(result.partial) }));
      return log;
    }

    // What the student supplied (their turns, their image) and the counts the
    // app itself put on screen (cards) may be repeated anywhere.
    const studentText = [
      ...messages.filter((m) => m.role === 'user').map((m) => m.content),
      imageText,
      quiz ? String(quiz.count) : '',
      papers.length ? String(papers.length) : '',
      files ? `${files.count}\n${files.shown}` : '',
    ].join('\n');
    // a library that missed the start still shows its decks, before the end
    if (lateLibrary) {
      const lib = await lateLibrary;
      if (lib.items.length) send('cards', { items: [filesCard(lib.items, { related: true })] });
    }

    const check = computeCheck(shown, {
      sourceCount: numbered.items.length,
      context: numbered.contextText,
      sourceTexts: numbered.sourceTexts,
      studentText,
    });
    send('check', check);
    send('done', { ms: since(), model: result.model });
    console.log('[ai-chat]', JSON.stringify({
      ...log, ms: since(), model: result.model, ungrounded: check.ungrounded.length, invalidCitations: check.invalidCitations.length,
    }));
    return { ...log, model: result.model, check };
  } finally {
    clearTimeout(deadlineTimer);
  }
}
