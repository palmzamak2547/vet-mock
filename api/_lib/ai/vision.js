// ============================================================
// ai/vision.js — what an attached image shows, as text
// ============================================================
// The writer works from text, so an attached image is first described and
// transcribed (llm.js visionJSON: the same provider order as every other
// image route). The description then does three jobs: it joins the search
// query (a photographed slide about FIP should retrieve FIP), it goes to the
// writer as part of the student's own turn, and its numbers count as numbers
// the student supplied when the answer is checked.
//
// It is the student's material, read as data: the prompt asks for what is
// visible and legible, not for a diagnosis, and a failure here never fails
// the request. The answer just says the image could not be read.
// ============================================================

import { visionJSON, extractJSON } from '../llm.js';
import { VISION_TIMEOUT_MS } from './config.js';
import { clip, stripCJK } from './text.js';

export const VISION_SYSTEM = `You read an image a Thai veterinary student attached to a study question.
Return ONLY JSON: {"kind":"slide|text|photo|radiograph|micrograph|diagram|chart|other","description":"...","text":"..."}
- "description": in Thai, 1-4 short sentences: what is shown (species, organ, lesion, structure, chart type), as seen. English technical terms are fine. No diagnosis beyond what is visibly labelled.
- "text": every legible word and number in the image, transcribed exactly in reading order (keep the original language). "" if there is none.
- Never invent text that is not legible. Never use Chinese or Japanese characters.`;

/**
 * @returns {Promise<{ ok: boolean, text: string, kind?: string }>}
 *   text = description and transcription joined, ready for the query and prompt
 */
export async function describeImage(image, { question = '', env = process.env, timeoutMs = VISION_TIMEOUT_MS, vision = visionJSON } = {}) {
  try {
    const reply = await vision({
      system: VISION_SYSTEM,
      user: `คำถามของนิสิต: ${clip(question, 500) || '(ไม่มีข้อความ)'}\nอธิบายและถอดข้อความจากภาพนี้`,
      image,
      maxTokens: 900,
      timeoutMs,
      env,
    });
    if (!reply?.ok) return { ok: false, text: '', status: reply?.status };
    const parsed = extractJSON(reply.text) || {};
    const description = stripCJK(clip(parsed.description, 900));
    const transcribed = stripCJK(String(parsed.text || '').slice(0, 1500)).trim();
    if (!description && !transcribed) return { ok: false, text: '' };
    const text = [description, transcribed ? `ข้อความในภาพ: ${transcribed}` : ''].filter(Boolean).join('\n');
    return { ok: true, text, kind: typeof parsed.kind === 'string' ? parsed.kind : 'other' };
  } catch {
    return { ok: false, text: '' };
  }
}
