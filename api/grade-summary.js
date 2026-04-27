// ============================================================
// /api/grade-summary.js — AI grading for short-answer + essay Qs
// ============================================================
// Calls Anthropic Claude API to grade student writing against the
// rubric and model answer. Returns structured JSON the frontend
// can render as a per-criterion score breakdown.
//
// Env vars required (set in Vercel Dashboard → Settings → Env):
//   ANTHROPIC_API_KEY = sk-ant-...
//
// Optional:
//   AI_GRADER_MODEL = claude-sonnet-4-5-20250929 (default)
//
// Security:
//   • Origin-aware CORS (same-origin auto-allow + static allowlist)
//   • Rate limit: 20 / hour / IP — generous for studying but bounded
//   • Input length capped (passage 20k, answer 5k)
//   • Returns 503 if ANTHROPIC_API_KEY isn't set so the UI can fall
//     back to self-grade gracefully
// ============================================================

import { rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';

const MAX_PASSAGE = 20000;
const MAX_ANSWER = 5000;
const MAX_MODEL = 8000;
const MAX_RUBRIC = 4000;
const MAX_QUESTION = 2000;

const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929';

export default async function handler(req, res) {
  // ── CORS (same pattern as other VetMock APIs) ──
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

  // ── Rate limit: 20/hr/IP ──
  const ip = clientIP(req);
  const rl = rateLimit(`grade:${ip}`, 20, 60 * 60 * 1000);
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ error: 'Too many requests', retryAfter: rl.retryAfter });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI grading not configured',
      hint: 'ANTHROPIC_API_KEY is not set in Vercel environment. Falling back to self-grade.',
    });
  }

  try {
    const body = req.body || {};
    const type = body.type === 'essay' ? 'essay' : 'short';
    const passage = String(body.passage || '').slice(0, MAX_PASSAGE);
    const question = String(body.question || '').slice(0, MAX_QUESTION);
    const userAnswer = String(body.userAnswer || '').slice(0, MAX_ANSWER);
    const modelAnswer = String(body.modelAnswer || '').slice(0, MAX_MODEL);
    const rubric = String(body.rubric || '').slice(0, MAX_RUBRIC);
    const targetWords = Number(body.targetWords) || 150;
    const softMax = Number(body.softMaxWords) || 180;
    const hardMax = Number(body.hardMaxWords) || 200;

    if (!userAnswer.trim()) {
      return res.status(400).json({ error: 'Empty answer — write something first' });
    }
    if (!question) {
      return res.status(400).json({ error: 'Question text is required for grading context' });
    }

    // Build the system + user prompt
    const systemPrompt = type === 'essay'
      ? buildEssaySystemPrompt({ targetWords, softMax, hardMax })
      : buildShortSystemPrompt();

    const userPrompt = buildUserPrompt({ passage, question, userAnswer, modelAnswer, rubric, type });

    // Call Anthropic API
    const aiResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.AI_GRADER_MODEL || DEFAULT_MODEL,
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error('Anthropic API error:', aiResp.status, errText);
      return res.status(502).json({
        error: `AI service error (${aiResp.status})`,
        hint: 'Try again in a moment, or use self-grade.',
      });
    }

    const aiData = await aiResp.json();
    const aiText = aiData?.content?.[0]?.text || '';

    // Extract JSON from response (Claude often wraps in ```json ... ```)
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('AI did not return JSON:', aiText.slice(0, 500));
      return res.status(502).json({
        error: 'AI response not parseable',
        hint: 'Try again — sometimes the model returns prose instead of JSON.',
      });
    }

    let grading;
    try {
      grading = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('JSON parse failed:', e.message, jsonMatch[0].slice(0, 500));
      return res.status(502).json({ error: 'AI response malformed JSON' });
    }

    // Tag with metadata for the UI
    grading._meta = {
      model: process.env.AI_GRADER_MODEL || DEFAULT_MODEL,
      gradedAt: new Date().toISOString(),
      type,
      wordCount: userAnswer.trim().split(/\s+/).length,
    };

    return res.status(200).json(grading);
  } catch (err) {
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

function buildShortSystemPrompt() {
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
    "answer": { "earned": 0, "total": 2, "justification": "Correctly identified X and Y; missed Z..." }
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
- "earned" 0-2 (most short answers are out of 2 pts in actual exam)
- If the answer is essentially correct but missing minor detail → 1.5 → round to 1 or 2 based on coverage
- If the answer is wrong / off-topic → 0
- If perfect match to model answer concepts → 2`;
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
