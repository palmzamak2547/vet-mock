// ============================================================
// /api/transcribe-handwriting.js — a handwritten answer, as text
// ============================================================
// The written paper is handwritten, so a student can practise the same way:
// write on the pad or photograph the page, and the words come back as text
// in the answer box to check and edit before the usual grading. The model
// only transcribes here — it never grades and never "helps": a misread word
// must stay visible to the student, so the prompt forbids corrections.
//
// Provider order (5.126.2): Anthropic first, with extended thinking, DeepSeek
// after. Typed Thai came back exact from DeepSeek's flash model, real
// handwriting did not — a tone mark or an above-line vowel dropped is a
// different word. The Anthropic ids are tried strongest first; an id the key
// cannot use falls to the next. HANDWRITING_MODEL pins one id,
// HANDWRITING_PROVIDER=deepseek restores the DeepSeek-first order, and a
// request may name `provider` or `model` (allow-listed) for a side-by-side
// check. Same contract as the other model routes: origin-aware CORS, per-IP
// limit, the shared daily provider budget, 503 when no key is set so the
// button degrades instead of breaking.
// ============================================================

import { sendRateLimitFailure, rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';
import { visionJSON, extractJSON, llmConfigured, LLM_DAILY_BUDGET } from './_lib/llm.js';

// The client sends the ink alone, redrawn to the size the model reads at
// full detail (1568 px on the long side), or a photo downsized the same way;
// this is the ceiling for what still gets read, well under the function's
// request limit.
const MAX_BASE64 = 3_400_000;
const MAX_TEXT = 5000;
const MIME = new Set(['image/png', 'image/jpeg', 'image/webp']);
const TIMEOUT_MS = 40_000;
const PROVIDERS = new Set(['anthropic', 'deepseek']);
// Strongest first. Each id that the key cannot use (404) falls to the next.
const ANTHROPIC_MODELS = ['claude-opus-5', 'claude-sonnet-5', 'claude-sonnet-4-5-20250929'];

const SYSTEM = `You transcribe HANDWRITING from one image for a Thai veterinary student's practice answer.
Return ONLY a JSON object: {"text":"..."}

The writing is Thai, usually mixed with English medical terms, Latin names, numbers and units.
Thai script rules:
- Read every mark: the tone marks (่ ้ ๊ ๋), the vowels above the line (ิ ี ึ ื ั ็), below the line (ุ ู), the silent-letter mark (์), and the vowels written before or after the consonant (เ แ โ ใ ไ า ะ ำ). A dropped or moved mark makes a different word, so never leave one out and never "normalise" a spelling.
- Look twice at letters that differ by a small loop or notch: ด/ต, บ/ป, ค/ศ/ต, ก/ภ/ถ, ข/ช, พ/ฟ/ผ, น/ม, ช/ซ, ร/ธ, ล/ส, อ/ฮ, ย/ษ.
- Thai has no spaces between words; keep the writer's own spacing. Copy Latin letters, digits and punctuation exactly as written, including abbreviations.
Copy, do not improve:
- Write exactly what is written, in the language(s) written. Do not correct spelling, grammar, terminology or facts. Do not add, complete, translate, expand abbreviations or summarise.
- Keep the writer's line breaks as \\n.
- Ignore ruled lines, margins, smudges and the paper itself.
- A word you truly cannot read becomes [อ่านไม่ออก]. Nothing legible at all → {"text":""}.`;

// A reply whose JSON holds a raw line break is still a reply.
function parseReply(text) {
  const direct = extractJSON(text);
  if (direct && typeof direct.text === 'string') return direct;
  const repaired = extractJSON(String(text || '').replace(/\r?\n/g, '\\n'));
  if (repaired && typeof repaired.text === 'string') return repaired;
  return null;
}

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
    return res.status(400).json({ error: 'image must be base64 without a data: prefix, at most 3.4 MB' });
  }
  const env = process.env;
  const prefer = PROVIDERS.has(body.provider)
    ? body.provider
    : (PROVIDERS.has(env.HANDWRITING_PROVIDER) ? env.HANDWRITING_PROVIDER : 'anthropic');
  const anthropicModels = ANTHROPIC_MODELS.includes(body.model)
    ? [body.model]
    : [env.HANDWRITING_MODEL, ...ANTHROPIC_MODELS].filter((m, i, a) => m && a.indexOf(m) === i);

  const budget = await rateLimit('provider:llm:daily', LLM_DAILY_BUDGET, 24 * 60 * 60 * 1000);
  if (!budget.ok) return res.status(503).json({ error: 'capacity reached for today' });

  const out = await visionJSON({
    system: SYSTEM,
    user: 'ถอดข้อความลายมือในภาพนี้ให้ครบทุกตัวอักษร รวมวรรณยุกต์และสระบนล่าง ตามที่เขียนจริง ตอบเป็น JSON เท่านั้น',
    image: { mediaType: mime, data: image },
    // Room for the thinking pass AND the transcription after it. At 4000 a
    // hard image spent the lot on thinking and came back with no text, so
    // the route fell through to the weaker provider on the samples that
    // needed the better one (measured on production 2026-09-20).
    maxTokens: 8000,
    timeoutMs: TIMEOUT_MS,
    prefer,
    anthropicModels,
    thinking: true,
  });
  if (!out.ok) return res.status(out.status === 504 ? 504 : 502).json({ error: 'vision model unavailable' });

  const parsed = parseReply(out.text);
  if (!parsed) return res.status(502).json({ error: 'unreadable model reply' });
  return res.status(200).json({ text: parsed.text.slice(0, MAX_TEXT), model: out.model });
}
