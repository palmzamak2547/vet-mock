// ============================================================
// /api/grade-summary.js — AI grading for short-answer + essay Qs
// ============================================================
// Uses the configured shared provider chain to grade student writing against the
// rubric and model answer. Returns structured JSON the frontend
// can render as a per-criterion score breakdown.
//
// Env vars required (set in Vercel Dashboard → Settings → Env):
//   DEEPSEEK_API_KEY or ANTHROPIC_API_KEY (server-side only)
//
// Optional:
//   AI_GRADER_MODEL = overrides the Anthropic model (default: ANTHROPIC_MODEL in _lib/llm.js)
//
// Security:
//   • Origin-aware CORS (same-origin auto-allow + static allowlist)
//   • The question is identified by ID and looked up server-side, so this
//     cannot be used to grade — or answer — anything outside the corpus
//   • Rate limit: 120 / hour / IP, under a shared 4000 / day provider budget
//   • Input length capped (passage 20k, answer 5k)
//   • Returns 503 if no provider is configured so the UI can fall
//     back to self-grade gracefully
// ============================================================

import { sendRateLimitFailure, rateLimit, allowedOrigin, limitCaller } from './_lib/rate-limit.js';
import { readJsonBody, sendBadBody } from './_lib/body.js';
import { extractJSON, chatJSON, llmConfigured, LLM_DAILY_BUDGET } from './_lib/llm.js';
import WRITTEN from './_lib/written-questions.generated.json' with { type: 'json' };
import { requireChula } from './_lib/chula-gate.js';
import { countWords, normalizeGrading, statedPoints } from './_lib/grade-shape.js';

const MAX_PASSAGE = 20000;
const MAX_ANSWER = 5000;
const MAX_MODEL = 8000;
const MAX_RUBRIC = 4000;
const MAX_QUESTION = 2000;

// Bounded so a stalled upstream ends as a clean 504 with a hint, instead of
// the platform's generic timeout page the client cannot explain.
const UPSTREAM_TIMEOUT_MS = 45_000;

// Every `hint` below is Thai: SmartGrader prints it on screen verbatim. The
// `error` fields stay English. They are for logs, and the client picks its
// own Thai sentence from the status code instead of reading them.

export default async function handler(req, res) {
  // Student answers and grading feedback are user-specific and must never be
  // retained by a shared cache.
  res.setHeader('Cache-Control', 'private, no-store');
  // ── CORS (same pattern as other VetMock APIs) ──
  const reqOrigin = req.headers.origin;
  const allowed = allowedOrigin(req);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (reqOrigin && !allowed) return res.status(403).json({ error: 'Origin not allowed' });
  const gate = await requireChula(req, res);
  if (!gate) return undefined;

  // ── Rate limit ──
  // 20/hr was tight for the thing this is actually for: a student works
  // through a set of written answers in one sitting, re-reads the feedback and
  // asks again after rewriting. The shared daily budget below is what protects
  // the bill; this number only needs to stop one machine hammering it.
  const rl = await limitCaller(req, gate, 'grade', 120, 60 * 60 * 1000);
  if (!rl.ok) return sendRateLimitFailure(res, rl);

  if (!llmConfigured(process.env)) {
    return res.status(503).json({
      error: 'AI grading not configured',
      hint: 'ใช้การประเมินตามเกณฑ์ด้วยตนเองได้ในระหว่างนี้',
    });
  }

  try {
    const body = readJsonBody(req);
    if (!body) return sendBadBody(res);
    const userAnswer = String(body.userAnswer || '').slice(0, MAX_ANSWER);
    if (!userAnswer.trim()) {
      return res.status(400).json({ error: 'Empty answer — write something first' });
    }

    // The question, its model answer and its rubric are looked up HERE, from
    // the corpus, rather than taken from the request. Accepting them from the
    // caller made this a general-purpose language model behind our key: post
    // your own "model answer" and it will answer anything, on a daily budget
    // shared with every real student. A question id can only ever name one of
    // our own written questions.
    const qid = String(body.qid ?? '');
    // Own keys only: '__proto__', 'constructor' or 'toString' name no question.
    const known = Object.hasOwn(WRITTEN, qid) ? WRITTEN[qid] : null;
    if (!known) {
      return res.status(400).json({
        error: 'Unknown question',
        hint: 'ข้อนี้ยังไม่รองรับการตรวจอัตโนมัติ ใช้เกณฑ์ให้คะแนนด้วยตนเองได้',
      });
    }
    if (!known.model_answer) {
      return res.status(422).json({
        error: 'No model answer for this question',
        hint: 'ข้อนี้ยังไม่มีคำตอบตัวอย่างให้เทียบ',
      });
    }

    const type = known.type === 'essay' ? 'essay' : 'short';
    // A short answer is out of the points its question states, else 2.
    const maxPoints = type === 'short' ? (statedPoints(known.q) || 2) : null;
    const passage = String(known.passage || '').slice(0, MAX_PASSAGE);
    const question = String(known.q || '').slice(0, MAX_QUESTION);
    const modelAnswer = String(known.model_answer || '').slice(0, MAX_MODEL);
    const rubric = String(known.rubric || '').slice(0, MAX_RUBRIC);
    const targetWords = Number(known.target_words) || 150;
    const softMax = Number(known.soft_max_words) || 180;
    const hardMax = Number(known.hard_max_words) || 200;

    // A per-IP limit does not stop distributed quota burn. Keep one shared
    // daily ceiling shared with the other metered study routes; on exhaustion
    // the UI already falls back to self-grade / normal VetWiki reading.
    const providerBudget = await rateLimit('provider:llm:daily', LLM_DAILY_BUDGET, 24 * 60 * 60 * 1000);
    if (providerBudget.unavailable) return sendRateLimitFailure(res, providerBudget);
    if (!providerBudget.ok) {
      res.setHeader('Retry-After', String(providerBudget.retryAfter));
      return res.status(503).json({
        error: 'AI daily capacity reached',
        hint: 'ระบบตรวจอัตโนมัติใช้ครบโควตาของวันนี้แล้ว',
      });
    }

    // Build the system + user prompt
    const systemPrompt = type === 'essay'
      ? buildEssaySystemPrompt({ targetWords, softMax, hardMax })
      : buildShortSystemPrompt(maxPoints);

    const userPrompt = buildUserPrompt({ passage, question, userAnswer, modelAnswer, rubric, type });

    // Use the same configured provider chain as the other study tools. An
    // absent optional provider must not disable a working configured one.
    const reply = await chatJSON({
      system: systemPrompt, user: userPrompt, maxTokens: 1500,
      timeoutMs: UPSTREAM_TIMEOUT_MS,
    });
    if (!reply.ok) {
      return res.status(reply.status === 504 ? 504 : 502).json({
        error: reply.status === 504 ? 'Automatic grading timed out' : 'Automatic grading unavailable',
        hint: 'ลองอีกครั้งภายหลัง หรือประเมินตามเกณฑ์ด้วยตนเอง',
      });
    }
    const aiText = reply.text;

    // The model wraps the object in prose or a ```json fence, and sometimes
    // appends junk after it. A greedy `{...}` match ran from the first brace
    // to the LAST one, so that trailing junk made the whole grade unparseable.
    // extractJSON walks brace depth and returns the first complete object —
    // the same parser the other model routes already rely on.
    // What the model proposed is checked against the rubric before it is
    // shown: scores clamped, the total recomputed (api/_lib/grade-shape.js).
    const words = countWords(userAnswer);
    const checked = normalizeGrading(extractJSON(aiText), type, { wordCount: words, softMax, hardMax, maxPoints });
    if (!checked.ok) {
      console.error('AI grading refused (' + checked.reason + '):', aiText.slice(0, 500));
      return res.status(502).json({
        error: 'AI response not parseable',
        hint: 'ผลตรวจรอบนี้อ่านไม่ออก ลองกดตรวจอีกครั้ง',
      });
    }

    const grading = checked.grading;
    // Tag with metadata for the UI
    grading._meta = {
      model: reply.model,
      gradedAt: new Date().toISOString(),
      type,
      wordCount: userAnswer.trim().split(/\s+/).length,
    };

    return res.status(200).json(grading);
  } catch (err) {
    if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
      return res.status(504).json({ error: 'AI grading timed out', hint: 'ลองอีกครั้งในอีกสักครู่ หรือประเมินตามเกณฑ์ด้วยตนเอง' });
    }
    console.error('grade-summary handler error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ─── Prompts ───────────────────────────────────────────────────

function buildEssaySystemPrompt({ targetWords, softMax, hardMax }) {
  return `You are an experienced English instructor at Chulalongkorn University Language Institute, grading the Final exam Part II (Writing a Summary, 15 points) for the course "5500419 English for Veterinary Profession II".

The student is a Thai veterinary undergraduate. They had to:
1. Read a passage
2. Write a ~${targetWords}-word summary using paraphrasing techniques
3. Demonstrate paraphrasing (not just copy phrases)

Grade strictly per the rubric provided. Be fair but rigorous — the same rubric is used in the actual exam.

**Rubric (15 points total):**
- **Content (7 points)** — main idea (1-2 pts) + major details (1 pt each)
- **Organization & Grammar (5 points)** — see provided rubric for level descriptions
- **Paraphrasing (3 points)** — 3 = own words / 2 = own words but copy some key phrases / 1 = minimal paraphrase / 0 = copy all
- **Word-count penalty** — > ${softMax} words = −1 / > ${hardMax} words = −2

**You MUST respond with ONLY valid JSON in this exact shape:**
\`\`\`json
{
  "scores": {
    "content": { "earned": 0, "total": 7, "justification": "Identified main idea (1 pt) + 5 major details (5 pts)" },
    "grammar": { "earned": 0, "total": 5, "justification": "Logical flow, few errors..." },
    "paraphrase": { "earned": 0, "total": 3, "justification": "Mostly own words; sentence 3 borrows phrase X..." }
  },
  "wordCount": 0,
  "wordCountPenalty": { "applied": 0, "reason": "150 words — within target" },
  "totalScore": 0,
  "overallFeedback": "2-3 sentences in Thai or English summarizing performance",
  "improvements": [
    "Specific actionable improvement 1",
    "Specific actionable improvement 2"
  ],
  "strengthsSpotted": [
    "What they did well"
  ]
}
\`\`\`

CRITICAL:
- "earned" must be an integer (0 to total, not fractional)
- "totalScore" = sum of (content.earned + grammar.earned + paraphrase.earned) − wordCountPenalty.applied (clamped 0-15)
- Justification fields must reference specific evidence from the student's writing
- Be strict about paraphrasing: if 2+ consecutive 4-word phrases match the original passage exactly, that's a -1 hit on paraphrase score
- Feedback should be concrete and actionable, not vague`;
}

function buildShortSystemPrompt(maxPoints = 2) {
  return `You are an experienced English instructor grading a Thai veterinary student's short-answer response for the Final exam Part I (Reading Vet Research Papers, 20 points total — individual short-answer items are typically worth 1-2 points each).

The student read a research paper passage and answered a short-answer question. They were expected to extract specific information from the passage in their own words (or close paraphrase).

Grade based on:
- Did they identify the correct information?
- Is the answer accurate vs the passage?
- Is it complete (covers what was asked)?

**You MUST respond with ONLY valid JSON in this exact shape:**
\`\`\`json
{
  "scores": {
    "answer": { "earned": 0, "total": ${maxPoints}, "justification": "Correctly identified X and Y; missed Z..." }
  },
  "totalScore": 0,
  "overallFeedback": "1-2 sentences in Thai or English",
  "improvements": [
    "What they should add or correct"
  ],
  "strengthsSpotted": [
    "What they got right"
  ]
}
\`\`\`

CRITICAL:
- This item is worth ${maxPoints} points: "earned" is 0-${maxPoints}, in steps of 0.5
- If the answer is essentially correct but missing minor detail → a part of ${maxPoints} matching its coverage
- If the answer is wrong / off-topic → 0
- If perfect match to model answer concepts → ${maxPoints}`;
}

function buildUserPrompt({ passage, question, userAnswer, modelAnswer, rubric, type }) {
  return `Grade the following student response.

═══════════════════════════════════════════════════════
PASSAGE THE STUDENT READ
═══════════════════════════════════════════════════════
${passage || '(no passage)'}

═══════════════════════════════════════════════════════
QUESTION
═══════════════════════════════════════════════════════
${question}

═══════════════════════════════════════════════════════
STUDENT'S ANSWER (${type})
═══════════════════════════════════════════════════════
${userAnswer}

═══════════════════════════════════════════════════════
MODEL ANSWER / KEY (from textbook)
═══════════════════════════════════════════════════════
${modelAnswer || '(no model answer provided)'}

${rubric ? `═══════════════════════════════════════════════════════
RUBRIC
═══════════════════════════════════════════════════════
${rubric}
` : ''}
═══════════════════════════════════════════════════════

Now grade rigorously. Return ONLY the JSON object — no prose before or after.`;
}
