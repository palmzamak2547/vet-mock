// ============================================================
// /api/transcribe-handwriting.js — a handwritten answer, as text
// ============================================================
// The written paper is handwritten, so a student can practise the same way:
// write on the pad or photograph the page, and the words come back as text
// in the answer box to check and edit before the usual grading. The model
// only transcribes here — it never grades and never "helps": a misread word
// must stay visible to the student, so the prompt forbids corrections.
//
// Providers in the usual order — DeepSeek's flash model reads images,
// Anthropic after it (llm.js visionJSON). Same contract as the other model
// routes: origin-aware CORS, per-IP limit, the shared daily provider
// budget, 503 when no key is set so the button degrades instead of breaking.
// ============================================================

import { sendRateLimitFailure, rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';
import { visionJSON, extractJSON, llmConfigured, LLM_DAILY_BUDGET } from './_lib/llm.js';

// The client downsizes to ~1400 px before sending; this is the ceiling for
// what still gets read, well under the function's request limit.
const MAX_BASE64 = 2_600_000;
const MAX_TEXT = 5000;
const MIME = new Set(['image/png', 'image/jpeg', 'image/webp']);
const TIMEOUT_MS = 25_000;

const SYSTEM = `You transcribe handwriting for a Thai veterinary student's practice answer.
Return ONLY a JSON object: {"text":"..."}
Rules:
- Write exactly what is written, in the language(s) written — Thai and English mixed is normal.
- Keep the writer's line breaks as \\n.
- Do not correct spelling, grammar, or facts. Do not add, complete, or summarise anything.
- A word you cannot read becomes [อ่านไม่ออก].
- Nothing legible at all → {"text":""}.`;

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
  const rl = await rateLimit(`handwriting:${ip}`, 40, 60 * 60 * 1000);
  if (!rl.ok) return sendRateLimitFailure(res, rl);

  if (!llmConfigured()) {
    return res.status(503).json({ error: 'handwriting not configured', hint: 'No model key is set. Typing and dictation still work.' });
  }

  const body = req.body || {};
  const mime = String(body.mime || '');
  const image = String(body.image || '');
  if (!MIME.has(mime)) return res.status(400).json({ error: 'mime must be image/png, image/jpeg or image/webp' });
  if (!image || image.length > MAX_BASE64 || !/^[A-Za-z0-9+/]+=*$/.test(image)) {
    return res.status(400).json({ error: 'image must be base64 without a data: prefix, at most 2.6 MB' });
  }

  const budget = await rateLimit('provider:llm:daily', LLM_DAILY_BUDGET, 24 * 60 * 60 * 1000);
  if (!budget.ok) return res.status(503).json({ error: 'capacity reached for today' });

  const out = await visionJSON({
    system: SYSTEM,
    user: 'ถอดข้อความที่เขียนในภาพนี้',
    image: { mediaType: mime, data: image },
    maxTokens: 800,
    timeoutMs: TIMEOUT_MS,
  });
  if (!out.ok) return res.status(out.status === 504 ? 504 : 502).json({ error: 'vision model unavailable' });

  const parsed = extractJSON(out.text);
  if (!parsed || typeof parsed.text !== 'string') return res.status(502).json({ error: 'unreadable model reply' });
  return res.status(200).json({ text: parsed.text.slice(0, MAX_TEXT), model: out.model });
}
