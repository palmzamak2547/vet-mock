// ============================================================
// /api/wiki-explain.js — grounded explanation from VetWiki
// ============================================================
// Answers a question using ONLY governed VetWiki sections, and returns
// structured claims (not prose) so every sentence can show where it came from.
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
// ============================================================

import { rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';
import { loadTopic } from '../src/lib/vetwiki/index.js';
import { validateAnswer, allowedFromSections } from '../src/lib/vetwiki/answer.js';

const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929';
const MAX_QUESTION = 500;
const MAX_SECTIONS = 8;          // bounded context — cost + latency ceiling
const MAX_SECTION_CHARS = 3000;
const MAX_TOKENS = 1200;
const TIMEOUT_MS = 25_000;

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

You will be given SECTIONS from VetWiki, each with a stable sectionId. Answer the
student's question using ONLY those sections.

Return ONLY a JSON object, no prose around it:
{"claims":[{"id":"c1","text":"...","supportType":"vetwiki-verified|vetwiki-draft|vetmock-analysis|insufficient-evidence","support":[{"sectionId":"..."}],"limitations":["..."]}]}

Rules:
- Write "text" in Thai, in short plain sentences a student can read quickly.
- Each claim states ONE idea. 2-6 claims total.
- Cite the sectionId(s) the claim actually comes from. NEVER cite a sectionId
  that was not given to you.
- supportType:
  * "vetwiki-verified" ONLY if the section is marked VERIFIED below.
  * "vetwiki-draft" if it comes from a section marked DRAFT.
  * "vetmock-analysis" if you are connecting or summarising beyond what a
    section literally says.
  * "insufficient-evidence" if the sections do not answer the question — say so
    plainly instead of guessing.
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
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ error: 'Too many requests', retryAfter: rl.retryAfter });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Degrade honestly — the wiki itself still works without AI.
    return res.status(503).json({
      error: 'AI explanation not configured',
      hint: 'ANTHROPIC_API_KEY is not set. VetWiki content is still readable without it.',
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

    const knowledge = loadTopic(subject, topic);
    if (!knowledge) return res.status(404).json({ error: 'Unknown VetWiki topic' });

    // Select the context: requested sections, else the whole (bounded) topic.
    const chosen = (wanted.length
      ? knowledge.sections.filter((s) => wanted.includes(s.id))
      : knowledge.sections
    ).slice(0, MAX_SECTIONS);
    if (chosen.length === 0) return res.status(400).json({ error: 'No matching sections' });

    const providerBudget = await rateLimit('provider:anthropic:daily', 1000, 24 * 60 * 60 * 1000);
    if (!providerBudget.ok) {
      res.setHeader('Retry-After', String(providerBudget.retryAfter));
      return res.status(503).json({
        error: 'AI daily capacity reached',
        hint: 'VetWiki content is still readable without AI.',
      });
    }

    const allowedMap = allowedFromSections(knowledge.id, chosen);

    const context = chosen.map((s) => {
      const verified = (s.claims || []).some((c) => c.reviewStatus === 'verified');
      const extra = (s.claims || [])
        .filter((c) => c.reviewStatus === 'verified')
        .map((c) => `  [verified statement] ${c.statement}`)
        .join('\n');
      const text = bodyText(s.body).join('\n').slice(0, MAX_SECTION_CHARS);
      return `--- sectionId: ${s.id} (${verified ? 'VERIFIED' : 'DRAFT'})\nheading: ${s.heading}\n${text}${extra ? `\n${extra}` : ''}`;
    }).join('\n\n');

    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
    let apiRes;
    try {
      apiRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: ac.signal,
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: process.env.AI_GRADER_MODEL || DEFAULT_MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM,
          messages: [{ role: 'user', content: `SECTIONS:\n${context}\n\nคำถาม: ${question}` }],
        }),
      });
    } finally {
      clearTimeout(timer);
    }

    if (!apiRes.ok) {
      const detail = await apiRes.text().catch(() => '');
      return res.status(502).json({ error: 'AI provider error', status: apiRes.status, detail: detail.slice(0, 300) });
    }

    const data = await apiRes.json();
    const raw = data?.content?.[0]?.text || '';
    let parsed;
    try {
      parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
    } catch {
      return res.status(502).json({ error: 'AI returned malformed output' });
    }

    // THE trust gate — re-ground every citation against what we actually sent.
    const { claims, dropped, downgraded } = validateAnswer(parsed?.claims, allowedMap);
    if (claims.length === 0) {
      return res.status(200).json({
        claims: [{ id: 'c1', text: 'ยังตอบจากเนื้อหาที่มีไม่ได้', supportType: 'insufficient-evidence', support: [] }],
        meta: { dropped, downgraded, sectionsUsed: chosen.length },
      });
    }

    return res.status(200).json({
      claims,
      meta: {
        topicId: knowledge.id,
        sectionsUsed: chosen.length,
        dropped,
        downgraded,
        model: process.env.AI_GRADER_MODEL || DEFAULT_MODEL,
      },
    });
  } catch (err) {
    if (err?.name === 'AbortError') return res.status(504).json({ error: 'AI request timed out' });
    return res.status(500).json({ error: 'Unexpected error', detail: String(err?.message || err).slice(0, 200) });
  }
}
