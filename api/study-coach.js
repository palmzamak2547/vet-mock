// ============================================================
// /api/study-coach.js — three grounded study aids, one endpoint
// ============================================================
// All three take something the app already holds, hand it to the provider
// chain, and hand back a short piece of writing about it. None of them is
// allowed to be the source of a fact:
//
//   miss    — the student picked a wrong option. Explain what the option they
//             picked actually is and what in the question rules it out. The
//             correct answer is rendered by the app from the bank, not by the
//             model, so the model is never in a position to name a different
//             one.
//   review  — a finished session's wrong answers. Name the mistake PATTERN
//             across them. Every pattern must cite the questions it is drawn
//             from, and citations are re-checked against the ids we sent.
//   recall  — a lecture summary the student just read. Ask a few recall
//             questions about it. The answer to each is a VERBATIM quote from
//             that summary, re-found in the source text before the item is
//             allowed out.
//
// Shared spine with the other model routes: origin-aware CORS, per-IP limit,
// one shared daily provider budget, 503 with a reason when it is gone.
//
// Every mode is cached in the shared KV. A miss on question 1234 option 2 is
// the same explanation for every student who picks it, and the recall set for
// a lecture is the same for everyone who reads it. Without the cache these
// features would spend the daily budget re-deriving identical answers; with
// it, the budget buys distinct answers instead of repeats.
// ============================================================

import { createHash } from 'node:crypto';
import { sendRateLimitFailure, rateLimit, clientIP, allowedOrigin, kvGetJSON, kvSetJSON } from './_lib/rate-limit.js';
import { chatJSON, extractJSON, llmConfigured, LLM_DAILY_BUDGET } from './_lib/llm.js';
import { checkText, quotesFrom, tidyQuote } from './_lib/grounding.js';
import { questionCatalog } from './_lib/question-catalog.js';
import { VIDEO_META } from '../src/data/video-summaries-meta.js';
import { loadVideoSummariesForSubject } from '../src/data/video-summaries.js';

const MAX_ITEMS = 25;          // one session's worth of wrong answers
const MAX_SUMMARY_CHARS = 14000;
const TIMEOUT_MS = 30000;
const CACHE_SECONDS = { miss: 7 * 86400, review: 86400, recall: 7 * 86400 };
// Bump when a guard or a presentation rule changes, so entries written under
// the old rule are ignored rather than served for another week. v1 recall
// answers were stored with their markdown still on them.
const CACHE_VERSION = 'v2';

const clip = (s, n) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const hash = (v) => createHash('sha1').update(JSON.stringify(v)).digest('hex').slice(0, 24);

// ─── mode: miss ────────────────────────────────────────────────

const MISS_SYSTEM = `You are VetMock's study assistant, writing for a Thai veterinary student who has just answered a practice question wrong.

You are given the question, all of its options, which option is CORRECT, which option the STUDENT PICKED, and the explanation written by the people who wrote the question.

Return ONLY this JSON object:
{"trap":"...","tell":"..."}

- "trap": what the option the student picked actually is — where that answer really belongs, or why it looks right here. 1-2 short Thai sentences.
- "tell": the detail in THIS question that rules the picked option out. 1-2 short Thai sentences.
- Write Thai. English technical terms are fine. NEVER Chinese or Japanese, not one character.
- Use ONLY what the material states. Never introduce a number, dose, drug name, organism, year or guideline that is not written in the material above. If you are unsure, say less.
- If the material does not support an explanation, return {"trap":"","tell":""} rather than inventing one.
- Do not name options by letter or number and do not restate which one is correct — the app already marks it. Write about the content.
- No preamble, no encouragement, no restating the question.`;

async function buildMiss(body) {
  const qid = String(body.qid ?? '').slice(0, 32);
  const catalog = await questionCatalog();
  const q = catalog.get(qid);
  if (!q) return { error: 400, message: 'Unknown question' };
  // Multiple choice only. On a True/False the bank's own explanation already
  // is the account of the other side, so there is nothing here to add.
  if (q.type !== 'mcq') return { error: 400, message: 'Unsupported question type' };

  const chosen = Number(body.chosen);
  const options = Array.isArray(q.options) ? q.options : [];
  if (!Number.isInteger(chosen) || chosen < 0 || chosen >= options.length) {
    return { error: 400, message: 'chosen is not an option of this question' };
  }
  if (chosen === q.answer) return { error: 400, message: 'That answer was correct' };
  const picked = options[chosen];
  const correct = options[q.answer];

  const optionList = options.map((o, i) => {
    const marks = [i === q.answer ? '[CORRECT]' : '', i === chosen ? '[STUDENT PICKED]' : ''].filter(Boolean).join(' ');
    return `  - ${o}${marks ? `   ${marks}` : ''}`;
  }).join('\n');

  const material = [
    `QUESTION: ${q.q}`,
    `OPTIONS:\n${optionList}`,
    `CORRECT: ${correct}`,
    `STUDENT PICKED: ${picked}`,
    q.explain ? `EXPLANATION FROM THE QUESTION BANK: ${q.explain}` : '',
  ].filter(Boolean).join('\n\n');

  return {
    cacheKey: `coach:${CACHE_VERSION}:miss:${qid}:${chosen}`,
    system: MISS_SYSTEM,
    user: material,
    maxTokens: 600,
    // The grounding context is everything the model was shown. A figure it
    // prints has to have been in front of it.
    finish: (parsed) => {
      const trap = clip(parsed?.trap, 400);
      const tell = clip(parsed?.tell, 400);
      // Both halves are one thought; half a contrast is not worth showing.
      if (!trap || !tell) return { blocked: 'no-answer' };
      for (const part of [trap, tell]) {
        const verdict = checkText(part, material);
        if (!verdict.ok) return { blocked: verdict.reason, detail: verdict.detail };
      }
      return { payload: { trap, tell } };
    },
  };
}

// ─── mode: review ──────────────────────────────────────────────

const REVIEW_SYSTEM = `You are VetMock's study assistant, looking at the questions a Thai veterinary student just got wrong in one practice session.

Each item is tagged Q1, Q2, ... and gives the topic, the question, the correct answer and what the student answered instead.

Return ONLY this JSON object:
{"patterns":[{"text":"...","qids":["Q1","Q3"]}],"focus":"..."}

- A "pattern" is one mistake the SAME student made in TWO OR MORE of these items — a pair of things being mixed up, a qualifier being read past, a rule applied to the wrong species or stage. 1-2 short Thai sentences each.
- "qids" lists every item the pattern is drawn from. At least two. Use the tags exactly as given.
- At most 3 patterns. If the misses have nothing in common, return "patterns":[] — that is a correct and useful answer, not a failure.
- "focus": one concrete thing to go read or practise next, in one Thai sentence, drawn from these items.
- Write Thai. English technical terms are fine. NEVER Chinese or Japanese.
- Use ONLY what the items state. Never introduce a number, dose, drug name, organism or guideline that is not written in them. Do not count things — cite the tags instead.
- Do not praise, reassure or address the student directly. State the pattern.`;

async function buildReview(body) {
  const raw = Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS) : [];
  if (raw.length < 2) return { error: 400, message: 'Need at least two wrong answers' };
  const catalog = await questionCatalog();

  const picked = [];
  for (const item of raw) {
    const q = catalog.get(String(item?.qid ?? '').slice(0, 32));
    if (!q || (q.type !== 'mcq' && q.type !== 'tf')) continue;
    let chose;
    let answer;
    if (q.type === 'mcq') {
      const options = Array.isArray(q.options) ? q.options : [];
      const n = Number(item?.chosen);
      if (!Number.isInteger(n) || n < 0 || n >= options.length || n === q.answer) continue;
      chose = options[n];
      answer = options[q.answer];
    } else {
      if (typeof item?.chosen !== 'boolean' || item.chosen === q.answer) continue;
      chose = item.chosen ? 'True' : 'False';
      answer = q.answer ? 'True' : 'False';
    }
    picked.push({ q, chose, answer });
  }
  if (picked.length < 2) return { error: 400, message: 'Need at least two wrong answers' };

  // Short tags rather than real ids: models garble long identifiers when they
  // echo them, and a garbled citation is indistinguishable from an invented
  // one by the time it reaches the validator.
  const tagToId = new Map(picked.map((p, i) => [`Q${i + 1}`, String(p.q.id)]));
  const material = picked.map((p, i) => [
    `--- Q${i + 1}  (subject ${p.q.subject}, topic ${p.q.topic || 'unspecified'})`,
    `question: ${clip(p.q.q, 300)}`,
    `correct: ${clip(p.answer, 200)}`,
    `student answered: ${clip(p.chose, 200)}`,
  ].join('\n')).join('\n\n');

  return {
    cacheKey: `coach:${CACHE_VERSION}:review:${hash(picked.map((p) => [p.q.id, p.chose]))}`,
    system: REVIEW_SYSTEM,
    user: material,
    maxTokens: 900,
    finish: (parsed) => {
      const patterns = [];
      for (const p of Array.isArray(parsed?.patterns) ? parsed.patterns.slice(0, 3) : []) {
        const text = clip(p?.text, 400);
        if (!checkText(text, material).ok) continue;
        // A citation we did not issue is dropped, not translated. Same rule as
        // the wiki answer validator: the model cannot widen its own scope.
        const ids = [...new Set((Array.isArray(p?.qids) ? p.qids : [])
          .map((t) => tagToId.get(String(t).trim()))
          .filter(Boolean))];
        if (ids.length < 2) continue;   // one question is not a pattern
        patterns.push({ text, questionIds: ids });
      }
      const focusText = clip(parsed?.focus, 300);
      const focus = checkText(focusText, material).ok ? focusText : '';
      if (!patterns.length && !focus) return { blocked: 'no-pattern' };
      return { payload: { patterns, focus } };
    },
  };
}

// ─── mode: recall ──────────────────────────────────────────────

const RECALL_SYSTEM = `You are VetMock's study assistant. A Thai veterinary student has just read a summary of a recorded lecture. Write short recall questions that check whether they took it in.

Return ONLY this JSON object:
{"items":[{"q":"...","quote":"..."}]}

- 3 to 5 items, each on a DIFFERENT part of the summary.
- "q": one short Thai question answerable from the summary alone. Ask for the specific thing — the organism, the number, the step, the criterion — never "what did this lecture cover".
- "quote": the passage from the summary that answers it, COPIED EXACTLY, character for character, out of the summary text. Do not paraphrase it, do not correct it, do not shorten it with an ellipsis. One line or sentence, 8 to 200 characters. Leave out leading markdown bullets, stars or heading marks.
- If a point cannot be answered by an exact quote, do not ask about it.
- Prefer the points the summary itself marks with stars.
- Write the question in Thai. NEVER Chinese or Japanese.
- Never ask about anything the summary does not state.`;

async function buildRecall(body) {
  const videoId = String(body.videoId ?? '').slice(0, 24);
  if (!/^[A-Za-z0-9_-]{5,24}$/.test(videoId)) return { error: 400, message: 'Bad videoId' };
  const meta = VIDEO_META[videoId];
  if (!meta) return { error: 404, message: 'Unknown lecture' };
  const entry = (await loadVideoSummariesForSubject(meta.subject))?.[videoId];
  const summary = String(entry?.summary || '');
  if (summary.length < 200) return { error: 404, message: 'No summary for this lecture' };

  return {
    cacheKey: `coach:${CACHE_VERSION}:recall:${videoId}`,
    system: RECALL_SYSTEM,
    user: `LECTURE: ${meta.title}\n\nSUMMARY:\n${summary.slice(0, MAX_SUMMARY_CHARS)}`,
    maxTokens: 1200,
    finish: (parsed) => {
      const items = [];
      for (const it of Array.isArray(parsed?.items) ? parsed.items.slice(0, 5) : []) {
        const q = clip(it?.q, 200);
        const quote = clip(it?.quote, 260);
        if (!q || !quote) continue;
        if (!checkText(q, summary, { maxChars: 200 }).ok) continue;
        // The whole design of this mode: the answer is not written by the
        // model, it is FOUND in the summary. An item whose quote is not there
        // is a fabricated answer however plausible it reads.
        if (!quotesFrom(quote, summary)) continue;
        // Verified first, then tidied: the check is against what the summary
        // really says, and tidying only decides how it is shown.
        const shown = tidyQuote(quote);
        if (shown.length < 8) continue;
        items.push({ q, quote: shown });
      }
      if (items.length < 2) return { blocked: 'no-quotable-items' };
      return { payload: { items, lecture: { videoId, title: meta.title, subject: meta.subject } } };
    },
  };
}

const BUILDERS = { miss: buildMiss, review: buildReview, recall: buildRecall };

// ─── handler ───────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const reqOrigin = req.headers.origin;
  const allowed = allowedOrigin(req);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (reqOrigin && !allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const ip = clientIP(req);
  const rl = await rateLimit(`coach:${ip}`, 120, 60 * 60 * 1000);
  if (!rl.ok) return sendRateLimitFailure(res, rl);

  if (!llmConfigured()) {
    return res.status(503).json({ error: 'AI study aids not configured', reason: 'not_configured' });
  }

  try {
    const body = req.body || {};
    const mode = String(body.mode || '');
    const build = BUILDERS[mode];
    if (!build) return res.status(400).json({ error: 'Unknown mode' });

    const plan = await build(body);
    if (plan.error) return res.status(plan.error).json({ error: plan.message });

    const cached = await kvGetJSON(plan.cacheKey);
    if (cached) return res.status(200).json({ ...cached, cached: true });

    const budget = await rateLimit('provider:llm:daily', LLM_DAILY_BUDGET, 24 * 60 * 60 * 1000);
    if (budget.unavailable) return sendRateLimitFailure(res, budget);
    if (!budget.ok) {
      res.setHeader('Retry-After', String(budget.retryAfter));
      return res.status(503).json({ error: 'AI daily capacity reached', reason: 'budget' });
    }

    const reply = await chatJSON({
      system: plan.system,
      user: plan.user,
      maxTokens: plan.maxTokens,
      timeoutMs: TIMEOUT_MS,
    });
    if (!reply.ok) return res.status(reply.status === 504 ? 504 : 502).json({ error: 'AI provider error', status: reply.status });

    const parsed = extractJSON(reply.text);
    if (!parsed) return res.status(502).json({ error: 'AI returned malformed output' });

    const result = plan.finish(parsed);
    if (result.blocked) {
      // Not an error the student caused and not one they can act on. Logged
      // because a rising ungrounded-number rate is the signal that a prompt or
      // a model has drifted, and nothing else would show it.
      console.warn('[study-coach]', mode, 'blocked:', result.blocked, result.detail || '');
      return res.status(200).json({ blocked: result.blocked });
    }

    const payload = { ...result.payload, model: reply.model };
    // Awaited on purpose: Vercel can reap un-awaited work at response end.
    await kvSetJSON(plan.cacheKey, payload, CACHE_SECONDS[mode]);
    return res.status(200).json(payload);
  } catch (err) {
    if (err?.name === 'AbortError' || err?.name === 'TimeoutError') return res.status(504).json({ error: 'AI request timed out' });
    if (/invalid json/i.test(String(err?.message || ''))) return res.status(400).json({ error: 'Invalid JSON body' });
    console.error('[study-coach]', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
