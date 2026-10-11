// ============================================================
// /api/wiki-explain.js — grounded explanation from VetWiki
// ============================================================
// Answers a question using ONLY governed VetWiki sections, and returns
// structured claims (not prose) so every sentence can show where it came from.
//
// Two modes, one contract:
//   topic mode  — body carries subject+topic: context = that article's
//                 sections. No screen in the app sends it today (the
//                 per-article panel that did was removed unused); the mode
//                 stays so the request contract does not change.
//   corpus mode — no subject/topic (the AI Search box): the server retrieves
//                 the most relevant sections ACROSS every governed topic
//                 (src/lib/vetwiki/retrieve.js — deterministic, Thai-aware)
//                 and answers from those. meta.sections maps each cited
//                 sectionId back to its article so the client can navigate
//                 AND re-validate against its own bundled corpus.
//
// Trust is structural, not prompt-based:
//   1. the model is shown ONLY the sections we selected;
//   2. it must return claims that cite sectionIds;
//   3. `validateAnswer` re-checks every citation against the ids we actually
//      sent, strips the rest, and downgrades any claim that over-states its
//      support. A fabricated citation therefore cannot reach the UI — the
//      worst case is a claim labelled "การวิเคราะห์ของ VetMock".
//
// Follows the existing api/grade-summary.js contract exactly: origin-aware
// CORS, per-IP rate limit, 503 when the key is absent so the UI degrades
// instead of breaking.
//
// Nothing to answer from is an answer too. When retrieval finds that the
// corpus does not cover the question (meta.covered false), no model is
// asked: the reply says so and names `related` sections, the nearest ones
// that account for at least half of the question. Terms VetWiki never
// mentions come back in meta.unmatched, and the model is told about them.
//
// Failures carry a `reason` (timeout, provider, malformed, unexpected) so
// the search box can say what happened and offer the next step; it retries
// a transient one once by itself. The platform's own limit is set above the
// model deadline, so a slow answer ends in this handler's JSON, never in a
// platform error page the client cannot read.
// ============================================================

import { sendRateLimitFailure, rateLimit, clientIP, allowedOrigin, kvGetJSON, kvSetJSON } from './_lib/rate-limit.js';
import { createHash } from 'node:crypto';

import { chatJSON, extractJSON, llmConfigured, hasCJK, LLM_DAILY_BUDGET } from './_lib/llm.js';
import { loadTopic } from '../src/lib/vetwiki/index.js';
import { retrieveForQuestion, sectionsForPicks } from '../src/lib/vetwiki/retrieve.js';
import { validateAnswer, allowedFromSections } from '../src/lib/vetwiki/answer.js';

const MAX_QUESTION = 500;
const MAX_SECTIONS = 10;         // bounded context — cost + latency ceiling
const MAX_SECTION_CHARS = 3000;
// Thai is token-dense: six claims with their limitations came close to the
// old 1,200 and a reply cut off mid-object parsed as nothing at all.
const MAX_TOKENS = 1600;
// One deadline for every model call in a request, the language retry
// included. It sits under the platform limit below, so a slow provider ends
// in our own 504 with a reason, not in the platform's text page.
const MODEL_BUDGET_MS = 24_000;
const RETRY_MIN_MS = 6_000;

// Without this the platform gives the function its 10-second default, and the
// model deadline above could never be reached: a slow answer was cut off and
// the browser got a page it could not read.
export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
};

/** The complete claims of a reply that was cut off mid-object (the model hit
 *  its token limit). Each one is still re-validated like any answer; a reply
 *  with no complete claim is null. */
export function salvageClaims(text) {
  const s = String(text ?? '');
  const key = s.indexOf('"claims"');
  const open = key < 0 ? -1 : s.indexOf('[', key);
  if (open < 0) return null;
  const BACKSLASH = String.fromCharCode(92);
  const claims = [];
  let depth = 0, start = -1, inStr = false, esc = false;
  for (let i = open + 1; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === BACKSLASH) esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{') { if (depth === 0) start = i; depth++; }
    else if (ch === '}') {
      depth--;
      if (depth === 0 && start >= 0) {
        try { claims.push(JSON.parse(s.slice(start, i + 1))); } catch { /* an unreadable claim is skipped */ }
        start = -1;
      }
    } else if (ch === ']' && depth === 0) break;
  }
  return claims.length ? { claims } : null;
}

/** The fields the client needs to link a section, nothing more. */
const sectionLink = ({ subject, topic, topicTitle, sectionId, heading }) => ({ subject, topic, topicTitle, sectionId, heading });

/** Flatten a note body into plain text for the prompt. */
function bodyText(body, out = []) {
  for (const item of body || []) {
    if (typeof item === 'string') { out.push(item); continue; }
    if (!item || typeof item !== 'object') continue;
    if (item.bullets) for (const b of item.bullets) out.push(typeof b === 'string' ? b : `${b.label}: ${b.value}`);
    if (item.sub) { out.push(item.sub); bodyText(item.body, out); }
    if (item.callout) out.push(item.callout);
    if (item.table) {
      for (const h of item.table.headers || []) out.push(h);
      for (const row of item.table.rows || []) out.push(row.join(' | '));
    }
  }
  return out;
}

const SYSTEM = `You are VetMock's veterinary study assistant for Thai veterinary students.

You will be given SECTIONS from VetWiki, each tagged with a short id like S1, S2.
Answer the student's question using ONLY those sections.

Return ONLY a JSON object, no prose around it:
{"claims":[{"id":"c1","text":"...","supportType":"vetwiki-verified|vetwiki-draft|vetmock-analysis|insufficient-evidence","support":[{"sectionId":"..."}],"limitations":["..."]}]}

Rules:
- Write "text" in Thai, in short plain sentences a student can read quickly.
  English technical terms are fine. NEVER use Chinese, Japanese, or any other
  script — not even one word.
- Each claim states ONE idea. 2-6 claims total.
- Cite with the SHORT ids exactly as given: {"sectionId":"S1"}. NEVER cite an id
  that was not given to you. Every factual claim MUST cite its section(s).
- Be maximally specific: give the exact numbers, names, criteria and steps the
  sections state. Do not hedge about facts a VERIFIED section states plainly.
- When every fact in a claim appears in the cited section(s), use the section
  label (vetwiki-verified for VERIFIED, vetwiki-draft otherwise) even if you
  rephrase or combine sections. Reserve "vetmock-analysis" for genuine
  inference that goes beyond what the sections say.
- supportType:
  * "vetwiki-verified" ONLY if the section is marked VERIFIED below.
  * "vetwiki-draft" if it comes from a section marked DRAFT.
  * "vetmock-analysis" if you are connecting or summarising beyond what a
    section literally says.
  * "insufficient-evidence" if the sections do not answer the question — say so
    plainly instead of guessing.
- If NONE of the sections answers the question, return exactly one
  "insufficient-evidence" claim saying the knowledge base does not cover it.
  Do not describe or summarise sections that are about something else.
- Never invent drug doses, numbers, or guideline names that are not in the sections.
- If the question is clinical, add a limitation noting this is for learning, not
  clinical decision-making.`;

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
  const rl = await rateLimit(`wiki-explain:${ip}`, 20, 60 * 60 * 1000);
  if (!rl.ok) return sendRateLimitFailure(res, rl);

  if (!llmConfigured()) {
    // Degrade honestly — the wiki itself still works without the model.
    return res.status(503).json({
      error: 'AI explanation not configured',
      hint: 'No model key is set. VetWiki content is still readable without it.',
    });
  }

  try {
    const body = req.body || {};
    const question = String(body.question || '').slice(0, MAX_QUESTION).trim();
    const subject = String(body.subject || '').slice(0, 100);
    const topic = String(body.topic || '').slice(0, 200);
    const wanted = Array.isArray(body.sectionIds)
      ? body.sectionIds.slice(0, 32).map((id) => String(id).slice(0, 300))
      : [];

    if (!question) return res.status(400).json({ error: 'question is required' });

    // Answer cache — exact-match on the normalized input tuple. The palette
    // placeholders now TEACH specific example questions, so identical asks
    // are a hot path; a repeat should not spend the shared daily LLM budget
    // or 2-5 s of a student's time on an answer the validator already
    // approved. Cached payloads passed validateAnswer before being stored,
    // and the client's isomorphic guard re-validates them like any answer.
    // The key also carries the text of the sections the answer is built from
    // (see below), so a corrected section retires the cached answer.
    const norm = question.replace(/\s+/g, ' ').toLowerCase();

    // topic mode (article panel) or corpus mode (AI Search) — both end at
    // the same shape: `picked` = [{ subject, topic, topicTitle, section }].
    let picked;
    let topicMeta = null;
    let retrieval = null;
    if (subject && topic) {
      const knowledge = loadTopic(subject, topic);
      if (!knowledge) return res.status(404).json({ error: 'Unknown VetWiki topic' });
      topicMeta = knowledge.id;
      const chosen = (wanted.length
        ? knowledge.sections.filter((s) => wanted.includes(s.id))
        : knowledge.sections
      ).slice(0, MAX_SECTIONS);
      picked = chosen.map((s) => ({ subject, topic, topicTitle: knowledge.title, topicSummary: knowledge.summary || '', section: s }));
    } else {
      retrieval = retrieveForQuestion(question, { maxSections: MAX_SECTIONS });
      picked = sectionsForPicks(retrieval.picks);
    }
    const related = (retrieval?.related || []).map(sectionLink);
    const unmatched = (retrieval?.unmatched || []).slice(0, 5);
    if (picked.length === 0) {
      // Retrieval found nothing to answer from — say so instead of letting
      // the model guess, and point at what VetWiki does have. The claim stays
      // for clients built before meta.covered existed.
      return res.status(200).json({
        claims: [{ id: 'c1', text: 'ยังไม่มีเนื้อหาในคลังความรู้ที่ตอบคำถามนี้ได้', supportType: 'insufficient-evidence', support: [] }],
        meta: { mode: 'corpus', covered: false, sectionsUsed: 0, sections: [], related, unmatched },
      });
    }

    const sectionsRev = createHash('sha1').update(JSON.stringify(picked.map(({ section: s }) => [
      s.id, s.heading, s.body, (s.claims || []).map((c) => [c.statement, c.reviewStatus]),
    ]))).digest('hex');
    const cacheKey = `ask:${createHash('sha1').update(JSON.stringify({ norm, subject, topic, wanted, sectionsRev })).digest('hex')}`;
    const cached = await kvGetJSON(cacheKey);
    if (cached && Array.isArray(cached.claims) && cached.claims.length) {
      return res.status(200).json({ ...cached, meta: { ...(cached.meta || {}), cached: true } });
    }

    const providerBudget = await rateLimit('provider:llm:daily', LLM_DAILY_BUDGET, 24 * 60 * 60 * 1000);

    if (providerBudget.unavailable) return sendRateLimitFailure(res, providerBudget);
    if (!providerBudget.ok) {
      res.setHeader('Retry-After', String(providerBudget.retryAfter));
      // 'budget' vs 'not_configured' matter to the reader: one is "come back
      // tomorrow", the other is "this app does not do that". The client used to
      // print the not-configured sentence for both, so a student who hit the
      // cap was told the feature does not exist and never tried again.
      return res.status(503).json({
        error: 'AI daily capacity reached',
        reason: 'budget',
        hint: 'VetWiki content is still readable without AI.',
      });
    }

    // Merge per-topic allowed maps — the validator only cares that a cited
    // id is one we actually sent, whichever article it lives in.
    const allowedMap = new Map();
    for (const p of picked) {
      for (const [id, v] of allowedFromSections(`${p.subject}--${p.topic}`, [p.section])) allowedMap.set(id, v);
    }

    // Models garble long Thai slugs when echoing them, and one garbled
    // character used to void the citation (validateAnswer strips ids it
    // never sent — four verified claims came back as bare 'analysis' on
    // the first production run). Short aliases are echo-proof; the alias
    // map converts them back to real sectionIds before validation.
    const aliasToId = new Map(picked.map((pk, i) => [`S${i + 1}`, pk.section.id]));
    const context = picked.map(({ topicTitle, topicSummary, section: s }, i) => {
      const verified = (s.claims || []).some((c) => c.reviewStatus === 'verified');
      const extra = (s.claims || [])
        .filter((c) => c.reviewStatus === 'verified')
        .map((c) => `  [verified statement] ${c.statement}`)
        .join('\n');
      const text = bodyText(s.body).join('\n').slice(0, MAX_SECTION_CHARS);
      return `--- section S${i + 1} (${verified ? 'VERIFIED' : 'DRAFT'})\narticle: ${topicTitle}${topicSummary ? ` — ${topicSummary}` : ''}\nheading: ${s.heading}\n${text}${extra ? `\n${extra}` : ''}`;
    }).join('\n\n');

    // A term the question names that no section mentions: tell the model, so
    // "Norberg angle" is answered as not covered rather than from a hoof angle.
    const absentNote = unmatched.length
      ? `\n\nNOTE: no supplied section mentions: ${unmatched.join(', ')}. If the question is about that, answer with an "insufficient-evidence" claim saying the knowledge base does not cover it, instead of answering from loosely related sections.`
      : '';
    const userMsg = `SECTIONS:\n${context}\n\nคำถาม: ${question}${absentNote}`;
    const deadline = Date.now() + MODEL_BUDGET_MS;
    const remaining = () => Math.max(0, deadline - Date.now());
    let answer = await chatJSON({
      system: SYSTEM,
      user: userMsg,
      maxTokens: MAX_TOKENS,
      timeoutMs: remaining(),
    });
    if (!answer.ok) {
      if (answer.status === 504) return res.status(504).json({ error: 'AI request timed out', reason: 'timeout' });
      return res.status(502).json({ error: 'AI provider error', status: answer.status, reason: 'provider' });
    }

    let parsed = extractJSON(answer.text) || salvageClaims(answer.text);
    if (!parsed) return res.status(502).json({ error: 'AI returned malformed output', reason: 'malformed' });

    // Language enforcement — the prompt rule is not enforcement. The primary
    // model dropped "主要通过" into a Thai claim live; on detection, ONE
    // corrective regeneration, and any claim still carrying CJK after that
    // is dropped rather than rendered as broken Thai.
    const claimHasCJK = (c) => hasCJK(c?.text) || (Array.isArray(c?.limitations) && c.limitations.some(hasCJK));
    if ((parsed.claims || []).some(claimHasCJK)) {
      // Only when the shared deadline still has room: otherwise the CJK
      // claims are dropped below and the rest of the answer still arrives.
      if (remaining() >= RETRY_MIN_MS) {
        const retry = await chatJSON({
          system: SYSTEM,
          user: `${userMsg}\n\nคำตอบก่อนหน้าของคุณมีตัวอักษรจีนปนอยู่ ตอบใหม่ทั้งหมดเป็นภาษาไทยล้วน (ศัพท์เทคนิคภาษาอังกฤษได้) ห้ามมีอักษรจีนหรือญี่ปุ่นแม้แต่ตัวเดียว`,
          maxTokens: MAX_TOKENS,
          timeoutMs: remaining(),
        });
        if (retry.ok) {
          const reparsed = extractJSON(retry.text) || salvageClaims(retry.text);
          if (reparsed && (reparsed.claims || []).length) { parsed = reparsed; answer = retry; }
        }
      }
      parsed.claims = (parsed.claims || []).filter((c) => !claimHasCJK(c));
    }

    // Cited-section map for the client: which article each id lives in, so
    // the AI Search card can navigate to it AND re-validate the citation
    // against its own bundled corpus (the isomorphic guard).
    const sectionMeta = picked.map((pk) => ({
      sectionId: pk.section.id,
      subject: pk.subject,
      topic: pk.topic,
      topicTitle: pk.topicTitle,
      heading: pk.section.heading,
    }));

    for (const c of parsed?.claims || []) {
      if (!Array.isArray(c?.support)) continue;
      for (const sup of c.support) {
        const real = aliasToId.get(String(sup?.sectionId || '').trim());
        if (real) sup.sectionId = real;
      }
    }

    // THE trust gate — re-ground every citation against what we actually sent.
    const { claims, dropped, downgraded } = validateAnswer(parsed?.claims, allowedMap);
    if (claims.length === 0) {
      return res.status(200).json({
        claims: [{ id: 'c1', text: 'ยังตอบจากเนื้อหาที่มีไม่ได้', supportType: 'insufficient-evidence', support: [] }],
        meta: { mode: topicMeta ? 'topic' : 'corpus', covered: true, dropped, downgraded, sectionsUsed: picked.length, sections: sectionMeta, related, unmatched },
      });
    }

    const payload = {
      claims,
      meta: {
        mode: topicMeta ? 'topic' : 'corpus',
        topicId: topicMeta,
        covered: true,
        sectionsUsed: picked.length,
        sections: sectionMeta,
        related,
        unmatched,
        dropped,
        downgraded,
        model: answer.model,
      },
    };
    // Awaited on purpose: Vercel can reap un-awaited work at response end.
    await kvSetJSON(cacheKey, payload, 3600);
    return res.status(200).json(payload);

  } catch (err) {
    if (err?.name === 'AbortError') return res.status(504).json({ error: 'AI request timed out', reason: 'timeout' });
    // A malformed request body throws when req.body is touched — that is
    // the caller's error, not ours (probed live: it answered 500 before).
    if (/invalid json/i.test(String(err?.message || ''))) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    return res.status(500).json({ error: 'Unexpected error', reason: 'unexpected', detail: String(err?.message || err).slice(0, 200) });
  }
}
