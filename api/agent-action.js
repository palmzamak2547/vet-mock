// ============================================================
// /api/agent-action.js — natural language → one validated app action
// ============================================================
// "จัดข้อสอบพยาธิ 20 ข้อจับเวลา" → { type:'practice', invoke:{...} } that the
// palette executes through its EXISTING dispatch. The model only picks from
// a catalog derived live from app data; validateAction re-grounds every
// field, so a fabricated subject, topic or feature id cannot reach the
// client (same trust shape as wiki-explain's citations). The client shows
// the validated plan and the STUDENT confirms before anything runs.

import { rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';
import { chatJSON, extractJSON, llmConfigured } from './_lib/llm.js';
import { buildCatalog, validateAction } from './_lib/agent-actions.js';

const MAX_UTTERANCE = 300;

const SYSTEM = `You translate a Thai veterinary student's request into ONE action for the VetMock app.

You will be given the app's catalog: practice subjects, library subjects, wiki articles, features.
Return ONLY JSON:
{"type":"practice|library|wiki|feature|none","params":{...},"say":"<Thai, what will happen, under 15 words>"}

params by type:
- practice: {"subject":"<id from practiceSubjects>","numQuestions":<5-50>,"useTimer":<bool>,"timePerQ":<seconds, only if useTimer>}
- library:  {"subject":"<id from librarySubjects>"}
- wiki:     {"subject":"<subject>","topic":"<topic>"} — must be a listed pair
- feature:  {"id":"<id from features>"}
- none:     {"reason":"<Thai, why no action fits>"}

Rules:
- Use ONLY ids that appear in the catalog. Never invent ids.
- อ่านโจทย์ อยากฝึก/ทำข้อสอบ → practice. อยากอ่านเอกสาร/สไลด์/ชีท → library.
  อยากอ่านเนื้อหา/ทบทวนเรื่องโรค → wiki. เครื่องมือ/หน้าอื่น → feature.
- If the request names a subject loosely (พยาธิ, เภสัช, ศัลย์), match it to the
  closest catalog subject by name/name_en/code.
- If the student wants PRACTICE in a subject that has no entry in
  practiceSubjects (no question bank yet) but the subject exists in
  librarySubjects, return the library action instead and say in "say" that
  there are no practice questions yet so you are opening the documents.
- If numbers/timer are not stated: numQuestions 10, useTimer false.
- If nothing in the catalog fits, use "none" and say so honestly.

Examples (from live use):
"ติวข้อสอบ COM5 แบบ 30 ข้อ" → {"type":"practice","params":{"subject":"com5","numQuestions":30,"useTimer":false},"say":"เปิดชุดฝึก COM5 30 ข้อ"}
"ขอทบทวนเรื่องโรคพิษสุนัขบ้า" → {"type":"wiki","params":{"subject":"com5","topic":"rabies"},"say":"เปิดบทความโรคพิษสุนัขบ้า"}
"อยากฝึกพยาธิ" (no พยาธิ bank in practiceSubjects, but library has it) → {"type":"library","params":{"subject":"vet-path-1"},"say":"วิชานี้ยังไม่มีคลังข้อสอบ เปิดเอกสารจริงให้แทน"}`;

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
  const rl = await rateLimit(`agent-action:${ip}`, 30, 60 * 60 * 1000);
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ error: 'Too many requests', retryAfter: rl.retryAfter });
  }
  if (!llmConfigured()) {
    return res.status(503).json({ error: 'Agent not configured' });
  }

  try {
    const utterance = String(req.body?.utterance || '').slice(0, MAX_UTTERANCE).trim();
    if (!utterance) return res.status(400).json({ error: 'utterance is required' });

    const providerBudget = await rateLimit('provider:llm:daily', 600, 24 * 60 * 60 * 1000);
    if (!providerBudget.ok) {
      res.setHeader('Retry-After', String(providerBudget.retryAfter));
      return res.status(503).json({ error: 'AI daily capacity reached' });
    }

    const catalog = buildCatalog();
    const answer = await chatJSON({
      system: SYSTEM,
      user: `CATALOG:\n${JSON.stringify(catalog)}\n\nคำสั่งของนิสิต: ${utterance}`,
      maxTokens: 400,
      timeoutMs: 15_000,
    });
    if (!answer.ok) {
      if (answer.status === 504) return res.status(504).json({ error: 'Agent timed out' });
      return res.status(502).json({ error: 'Agent provider error', status: answer.status });
    }

    const parsed = extractJSON(answer.text);
    if (!parsed) return res.status(502).json({ error: 'Agent returned malformed output' });

    // THE trust gate — nothing outside the catalog survives this call.
    const verdict = validateAction(parsed, catalog);
    if (!verdict.ok) {
      return res.status(200).json({ action: null, reason: verdict.reason });
    }
    return res.status(200).json({ action: verdict.action, say: verdict.say, model: answer.model });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error', detail: String(err?.message || err).slice(0, 200) });
  }
}
