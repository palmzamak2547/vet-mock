// ============================================================
// Mochi voice — the pieces /api/mochi-voice needs, kept pure so they test
// without a network.
//
// Provider: Gemini Live (gemini-3.8-live), chosen 2026-10-20 on price and
// Thai support (vault: projects/vetmock/mochi-realtime-voice-provider.md).
// The browser never sees the API key: this route mints a one-session
// ephemeral token whose setup (model, prompt, tool) is locked server-side,
// so a client cannot swap the model or drop the grounding instruction.
//
// Spend has two ceilings, both counted in sessions because a token can only
// send messages until its expireTime (= one session):
//   per user   MOCHI_VOICE_USER_SESSIONS per calendar month (UTC)
//   everyone   MOCHI_VOICE_MONTHLY_USD / worst-case cost of one session
// Worst case assumes the student talks and Mochi answers for the whole
// session at the published per-minute audio prices, so the real bill sits
// under the cap, never over it.
// ============================================================

import { retrieveForQuestion, sectionsForPicks } from '../../src/lib/vetwiki/retrieve.js';
import { wikiPath } from '../../src/lib/vetwiki/url.js';

export const MODEL = 'models/gemini-3.8-live';
// ai.google.dev/gemini-api/docs/pricing (2026-10-20): audio in $0.005/min, audio out $0.018/min
export const USD_PER_MINUTE_WORST = 0.005 + 0.018;

export function voiceConfig(env = process.env) {
  const num = (v, d) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);
  const sessionMinutes = Math.min(14, num(env.MOCHI_VOICE_SESSION_MINUTES, 10)); // Live audio sessions end at 15 min anyway
  const monthlyUsd = num(env.MOCHI_VOICE_MONTHLY_USD, 20);
  return {
    open: env.MOCHI_VOICE_OPEN === '1',
    configured: Boolean(env.GEMINI_API_KEY),
    sessionMinutes,
    userSessions: Math.floor(num(env.MOCHI_VOICE_USER_SESSIONS, 6)),
    monthlyUsd,
    globalSessions: Math.max(1, Math.floor(monthlyUsd / (sessionMinutes * USD_PER_MINUTE_WORST))),
  };
}

/** "2026-10": the cap counters are keyed per UTC month so they reset on the 1st. */
export const monthKey = (now = new Date()) => now.toISOString().slice(0, 7);

/** Seconds from now to the start of next UTC month: the counters' lifetime. */
export function secondsToMonthEnd(now = new Date()) {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);
  return Math.max(60, Math.ceil((next - now.getTime()) / 1000));
}

export const SYSTEM_PROMPT = [
  'คุณคือ Mochi ผู้ช่วยติวของ VetMock สำหรับนิสิตสัตวแพทย์ พูดภาษาไทยเป็นกันเอง กระชับ ตอบทีละ 1 ถึง 3 ประโยค',
  'เรียกชื่อยา โรค และเชื้อเป็นภาษาอังกฤษตามที่นิสิตพูด',
  'ทุกคำถามที่เป็นข้อเท็จจริงทางสัตวแพทย์ ต้องเรียก search_vetmock ก่อนตอบ และตอบจากผลที่ได้เท่านั้น บอกชื่อหัวข้อที่ใช้ตอบสั้น ๆ',
  'ถ้าผลค้นหาว่างหรือไม่ตรงคำถาม ให้บอกตรง ๆ ว่ายังไม่มีในคลังของ VetMock ห้ามเดา ห้ามเติมตัวเลขหรือขนาดยาที่ไม่มีในผล',
  'ถ้าได้ยินชื่อศัพท์ไม่ชัด ให้ถามทวนก่อนค้นหา',
  'นี่คือเครื่องมือช่วยเรียน ไม่ใช่คำแนะนำการรักษาสัตว์จริง',
].join('\n');

export const SEARCH_TOOL = {
  name: 'search_vetmock',
  description: "Search VetMock's governed VetWiki (built from the course notes). Returns sections with their article titles; they can be loosely related, so use only a section that actually answers the question, and treat `unmatched` words as not in the library.",
  parameters: { type: 'OBJECT', properties: { query: { type: 'STRING', description: 'the question or key terms, Thai or English' } }, required: ['query'] },
};

/** The locked session setup. sessionResumption lets a dropped socket rejoin the same conversation. */
export function liveSetup() {
  return {
    model: MODEL,
    generationConfig: { responseModalities: ['AUDIO'] },
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    tools: [{ functionDeclarations: [SEARCH_TOOL] }],
    inputAudioTranscription: {},
    outputAudioTranscription: {},
    sessionResumption: {},
  };
}

/**
 * Mint a Live ephemeral token (POST v1beta/auth_tokens, shape verified against
 * the API 2026-10-21). uses: 3 allows two reconnects inside the same session
 * window; expireTime ends sending, so it is the session's hard length.
 */
export async function mintToken(apiKey, { now = new Date(), sessionMinutes, fetchImpl = fetch } = {}) {
  const at = (ms) => new Date(now.getTime() + ms).toISOString();
  const setup = liveSetup();
  const res = await fetchImpl('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      uses: 3,
      expireTime: at(sessionMinutes * 60_000),
      newSessionExpireTime: at(60_000),
      bidiGenerateContentSetup: setup,
      fieldMask: Object.keys(setup).join(','),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw Object.assign(new Error('token-failed'), { status: res.status });
  const body = await res.json();
  if (!body?.name) throw new Error('token-failed');
  return { token: body.name, expiresAt: at(sessionMinutes * 60_000) };
}

const MAX_RESULTS = 4;
const MAX_CHARS = 700;

function flatten(body, out = []) {
  for (const item of body || []) {
    if (typeof item === 'string') { out.push(item); continue; }
    if (!item || typeof item !== 'object') continue;
    if (item.bullets) for (const b of item.bullets) out.push(typeof b === 'string' ? b : `${b.label}: ${b.value}`);
    if (item.sub) { out.push(item.sub); flatten(item.body, out); }
    if (item.callout) out.push(item.callout);
    if (item.table) {
      out.push((item.table.headers || []).join(' | '));
      for (const row of item.table.rows || []) out.push(row.join(' | '));
    }
  }
  return out;
}

/**
 * The tool Mochi calls. Same deterministic retrieval as the AI Search box
 * (wiki-explain corpus mode), so voice and text answer from the same
 * sections. Each result carries the link the panel shows as its source.
 */
export function searchKnowledge(query) {
  const q = String(query || '').slice(0, 300).trim();
  if (!q) return { covered: false, results: [] };
  const retrieval = retrieveForQuestion(q, { maxSections: MAX_RESULTS, perTopic: 2 });
  const results = sectionsForPicks(retrieval.picks).map(({ subject, topic, topicTitle, section }) => {
    const text = flatten(section.body).join(' ').replace(/\s+/g, ' ').trim();
    return {
      id: section.id,
      title: topicTitle,
      heading: section.heading,
      text: text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS)}…` : text,
      url: wikiPath(subject, topic, section.id),
    };
  });
  // Retrieval ranks loosely (a meloxicam question can surface the vaccine
  // guideline that mentions NSAIDs), so the model is told which words found
  // nothing and must check each section actually answers before using it.
  return { covered: retrieval.covered && results.length > 0, unmatched: retrieval.unmatched || [], results };
}
