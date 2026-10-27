// ============================================================
// ai/planner.js — what kind of answer a turn needs, decided fast
// ============================================================
// One small JSON call to the model before anything is written: is this a
// question to answer from the corpus, a request for a quiz, a request to open
// something in the app, a literature search, a question about VetMock itself,
// or small talk? It also rewrites a follow-up ("แล้วในแมวล่ะ") into a
// standalone question and lists English search terms, which is what lets a
// Thai question reach notes written in English.
//
// The planner is a convenience, never a dependency:
//   - heuristicPlan() reads the same signals with regexes and is used when the
//     model is slow (PLANNER_TIMEOUT_MS), down, or replies with junk;
//   - parsePlan() reads only the fields it uses and validates each one, so a
//     reply with extra keys, a wrong type or an invented subject id degrades
//     to the heuristic for that field, not to an error;
//   - retrieval does not wait for it: the route searches the raw question
//     while this call is in flight.
// ============================================================

import { chatJSON, extractJSON } from '../llm.js';
import { SUBJECTS } from '../../../src/data/curriculum.js';
import { FEATURES } from '../../../src/lib/feature-registry.js';
import { PLANNER_TIMEOUT_MS, QUIZ_DEFAULT, QUIZ_MAX } from './config.js';
import { subjectsInText, resolveSubjectRef } from './subjects.js';
import { featureLink } from './links.js';
import { clip } from './text.js';

export const INTENTS = Object.freeze(['answer', 'quiz', 'files', 'action', 'research', 'guide', 'chat']);
const ACTION_TYPES = new Set(['practice', 'library', 'wiki', 'feature']);
const FILE_KIND_IDS = new Set(['any', 'slide', 'handout', 'summary', 'textbook', 'pastpaper', 'guideline']);

// Features the planner may name: those that open somewhere real.
const LINKABLE_FEATURES = FEATURES.filter((f) => !f.adminOnly && featureLink(f));
const FEATURE_IDS = new Set(LINKABLE_FEATURES.map((f) => f.id));

const SUBJECT_LIST = SUBJECTS.filter((s) => s.id !== 'all' && s.has_questions)
  .map((s) => `${s.id}=${s.name}`).join(', ');
const FEATURE_LIST = LINKABLE_FEATURES.map((f) => `${f.id}=${f.label}`).join(', ');

export const PLANNER_SYSTEM = `You plan how VetMock's study assistant answers a Thai veterinary student. Read the conversation (oldest first; the last message is the student's new turn) and return ONLY one JSON object:
{"intent":"answer|quiz|files|action|research|guide|chat","query_th":"...","terms_en":["..."],"subjects":["..."],"quiz_n":5,"needs_research":false,"recent":false,"files":{"kind":"any|slide|handout|summary|textbook|pastpaper|guideline","title":""},"action":{"type":"practice|library|wiki|feature","subject":"","feature":"","num":10}}

intent:
- answer: a veterinary, medical or other scientific question to answer from course material.
- quiz: the student wants practice questions to answer here in the chat (ขอข้อสอบ, ขอโจทย์, ทดสอบหน่อย, quiz me).
- files: the student wants study FILES to read or download: lecture slides, handouts, summary sheets, past papers, textbooks, guidelines (ขอสไลด์, สไลด์เรื่อง..., ขอชีท, ขอไฟล์, เอกสารประกอบ, ขอสรุป pdf, ข้อสอบเก่า, ดาวน์โหลด, โหลดสไลด์, slides, handout, pdf). A question ABOUT a topic is answer, even when it mentions a lecture; ข้อสอบเก่า (past papers to download) is files, ขอข้อสอบ N ข้อ (to answer here) is quiz.
- action: the student wants to OPEN or START something in the VetMock app (เปิด..., ไปที่..., พาไป..., เริ่มฝึก...).
- research: the student wants research papers or literature (งานวิจัย, paper, งานตีพิมพ์, literature).
- guide: a question about VetMock itself: features and how to use them, what is new, its subjects, lecturers, the exam timetable (ตารางสอบ, สอบวิชาอะไร, ใครสอน, มีอะไรใหม่, ใช้ยังไง).
- chat: greetings, thanks, small talk.
query_th: the latest turn rewritten as ONE standalone question in Thai, with the topic made explicit; resolve follow-ups such as "แล้วในแมวล่ะ" from the earlier turns. Keep English technical terms in English.
terms_en: 1-6 English search keywords (disease, organism, drug, procedure, species, test), most specific first. [] for chat.
subjects: ids from SUBJECTS that the turn names or clearly means; [] when none.
quiz_n: how many questions were asked for (1-10); only for quiz.
needs_research: true when answering needs the research literature, not course notes.
recent: true when the student asks for the latest or newest papers.
files: only for intent files. kind = the kind asked for (สไลด์ slide, เอกสารประกอบ/ชีท handout, สรุป summary, ตำรา textbook, ข้อสอบเก่า pastpaper, แนวปฏิบัติ guideline), else any; title = a deck name, number or lecturer the student named ("Avian 2.1", "FIQC E3"), else "".
action: only for intent action. subject = an id from SUBJECTS; feature = an id from FEATURES; num = number of practice questions.
SUBJECTS: ${SUBJECT_LIST}
FEATURES: ${FEATURE_LIST}`;

const RE = {
  quiz: /(ขอ(?:ข้อสอบ|โจทย์|คำถาม|ควิซ)|ข้อสอบ.{0,24}\d+\s*ข้อ|\d+\s*ข้อ.{0,12}(?:ข้อสอบ|โจทย์)|ทดสอบ(?:หน่อย|ฉัน|ความรู้)|ควิซ|quiz me|\bquiz\b|ลองทำข้อสอบ|ฝึกทำข้อสอบในนี้)/i,
  // No \b after a Thai word: JavaScript counts Thai letters as non-word
  // characters, so a boundary between two of them never exists.
  action: /^(?:ช่วย)?(?:เปิด|ไปที่|ไปหน้า|พาไป|เริ่มฝึก|เริ่มทำ|เริ่มสอบ)|^(?:open|go to|start)\b|(?:เปิด|ไปที่|พาไป)(?:หน้า|เมนู|ฟีเจอร์|คลัง|ชั้น|ตาราง|ชุด)/i,
  research: /(งานวิจัย|วิจัยล่าสุด|งานตีพิมพ์|บทความวิจัย|ผลงานวิจัย|\bpapers?\b|literature|pubmed|journal|meta-?analysis|systematic review|research)/i,
  // files: a past paper is checked before quiz (ขอข้อสอบเก่า is a download, not a quiz)
  pastpaper: /(ข้อสอบเก่า|ข้อสอบปีก่อน|past\s*papers?|old exams?)/i,
  files: /(สไลด์|\bslides?\b|ชีท|ไฟล์|\bpdf\b|เอกสารประกอบ|\bhandouts?\b|ตำรา|\btextbooks?\b|ดาวน์โหลด|\bdownload\b|โหลด(?:สไลด์|ไฟล์|ชีท|เอกสาร|ตำรา))/i,
  // asking for files in so many words: this beats a model that read it as a question
  filesAsk: /(ขอ|หา|ส่ง|เอา|โหลด|ดาวน์โหลด|\bdownload|\bget|\bfind|\bsend)\s*(?:ไฟล์\s*)?(สไลด์|ชีท|ไฟล์|เอกสาร|ตำรา|\bpdf|\bslides?|\bhandouts?)|ข้อสอบเก่า|past\s*papers?/i,
  recent: /(ล่าสุด|ใหม่ๆ|ใหม่ล่าสุด|ปีนี้|ช่วงนี้|recent|latest|newest)/i,
  guide: /(vetmock|เว็บนี้|แอปนี้|แอพนี้|ในแอป|ในแอพ|ฟีเจอร์|feature|วิธีใช้|ใช้ยังไง|ใช้งานยังไง|อยู่ตรงไหน|อยู่เมนูไหน|มีอะไรใหม่|อัปเดต|อัพเดต|ตารางสอบ|สอบวิชา|วันสอบ|กลางภาค|ปลายภาค|ใครสอน|อาจารย์ผู้สอน|วิชาอะไรบ้าง|รายวิชา)/i,
  chat: /^(สวัสดี|หวัดดี|ดีจ้า|ดีครับ|ดีค่ะ|hello|hi|hey|ขอบคุณ|ขอบใจ|thank|thx|โอเค|ok|เยี่ยม|เก่งมาก|ฝันดี|บาย)[\s!.ๆ]*(?:ครับ|ค่ะ|คับ|จ้า|นะ)?[\s!.]*$/i,
  count: /(\d{1,2})\s*ข้อ/,
};

const FOLLOW_UP = /^(แล้ว|ส่วน|และ|ถ้า|กรณี|อันนี้|อันนั้น|ต่อ|อีก|what about|and |how about)|(ล่ะ|หละ|ละ\??)$/;

/** Is this turn a follow-up that needs the previous one to make sense? */
export function isFollowUp(text) {
  const t = String(text || '').trim();
  return t.length < 28 || FOLLOW_UP.test(t);
}

/** Does the turn ask for files in so many words ("ขอสไลด์...", "ข้อสอบเก่า")? */
export const asksForFiles = (text) => RE.filesAsk.test(String(text || ''));

/** The kind of file a request names, or 'any'. */
export function fileKindIn(text) {
  const t = String(text || '');
  if (RE.pastpaper.test(t)) return 'pastpaper';
  if (/สไลด์|\bslides?\b/i.test(t)) return 'slide';
  if (/ชีท|เอกสารประกอบ|\bhandouts?\b/i.test(t)) return 'handout';
  if (/ตำรา|\btextbooks?\b/i.test(t)) return 'textbook';
  if (/แนวปฏิบัติ|\bguidelines?\b/i.test(t)) return 'guideline';
  if (/สรุป|\bsummar(?:y|ies)\b/i.test(t)) return 'summary';
  return 'any';
}

const clampN = (n, dflt = QUIZ_DEFAULT) => {
  const v = Math.round(Number(n));
  return Number.isFinite(v) && v > 0 ? Math.min(QUIZ_MAX, Math.max(1, v)) : dflt;
};

/** The plan the regexes alone would make. */
export function heuristicPlan(messages, { imageText = '' } = {}) {
  const userTurns = messages.filter((m) => m.role === 'user');
  const last = userTurns[userTurns.length - 1]?.content || '';
  const prev = userTurns.length > 1 ? userTurns[userTurns.length - 2].content : '';
  const standalone = isFollowUp(last) && prev ? `${prev} ${last}` : last;
  let intent = 'answer';
  if (RE.chat.test(last.trim()) && !imageText) intent = 'chat';
  else if (RE.pastpaper.test(last)) intent = 'files';
  else if (RE.quiz.test(last)) intent = 'quiz';
  else if (RE.action.test(last.trim())) intent = 'action';
  else if (RE.files.test(last)) intent = 'files';
  else if (RE.research.test(last)) intent = 'research';
  else if (RE.guide.test(last)) intent = 'guide';
  const count = RE.count.exec(last);
  const subjects = subjectsInText(standalone);
  return {
    intent,
    query_th: clip(`${standalone}${imageText ? ` ${imageText}` : ''}`, 600),
    terms_en: [],
    subjects,
    quiz_n: intent === 'quiz' ? clampN(count?.[1]) : null,
    needs_research: intent === 'research',
    recent: RE.recent.test(last),
    files: intent === 'files' ? { kind: fileKindIn(last), title: '' } : null,
    action: intent === 'action' ? { type: subjects.length ? 'practice' : 'feature', subject: subjects[0] || '', feature: '', num: clampN(count?.[1], 10) } : null,
    source: 'heuristic',
  };
}

/**
 * Read a planner reply leniently: only the fields used, each validated, the
 * heuristic plan filling any field that is missing or wrong.
 */
export function parsePlan(text, fallback) {
  const raw = typeof text === 'string' ? extractJSON(text) : text;
  if (!raw || typeof raw !== 'object') return { ...fallback, source: 'heuristic' };
  const intent = INTENTS.includes(raw.intent) ? raw.intent : fallback.intent;
  const query = typeof raw.query_th === 'string' && raw.query_th.trim() ? clip(raw.query_th, 600) : fallback.query_th;
  const terms = Array.isArray(raw.terms_en)
    ? [...new Set(raw.terms_en.filter((t) => typeof t === 'string').map((t) => t.trim()).filter((t) => t && t.length <= 60))].slice(0, 6)
    : [];
  const subjects = [...new Set([
    ...(Array.isArray(raw.subjects) ? raw.subjects : []).map(resolveSubjectRef).filter(Boolean),
    ...fallback.subjects,
  ])].slice(0, 4);
  let action = null;
  if (intent === 'action') {
    const a = raw.action && typeof raw.action === 'object' ? raw.action : {};
    const type = ACTION_TYPES.has(a.type) ? a.type : fallback.action?.type || 'feature';
    action = {
      type,
      subject: resolveSubjectRef(a.subject) || subjects[0] || '',
      feature: FEATURE_IDS.has(String(a.feature || '')) ? String(a.feature) : '',
      num: clampN(a.num ?? raw.quiz_n, 10),
    };
  }
  let files = null;
  if (intent === 'files') {
    const f = raw.files && typeof raw.files === 'object' ? raw.files : {};
    files = {
      kind: FILE_KIND_IDS.has(f.kind) ? f.kind : fallback.files?.kind || 'any',
      title: typeof f.title === 'string' ? clip(f.title.trim(), 80) : '',
    };
  }
  return {
    intent,
    query_th: query,
    terms_en: terms,
    subjects,
    quiz_n: intent === 'quiz' ? clampN(raw.quiz_n ?? fallback.quiz_n) : null,
    needs_research: raw.needs_research === true || intent === 'research',
    recent: raw.recent === true || fallback.recent,
    files,
    action,
    source: 'model',
  };
}

/** The last few turns, clipped, as the planner reads them. */
export function plannerTranscript(messages, imageText = '') {
  const lines = messages.slice(-6).map((m) => `${m.role === 'user' ? 'student' : 'assistant'}: ${clip(m.content.replace(/\[\d+\]/g, ''), m.role === 'user' ? 800 : 400)}`);
  if (imageText) lines.push(`(the student attached an image; it shows: ${clip(imageText, 500)})`);
  return lines.join('\n');
}

/**
 * Ask the model for a plan. Resolves to a validated plan, never throws; the
 * heuristic plan comes back (source 'heuristic') on any failure or timeout.
 */
export async function runPlanner(messages, { imageText = '', env = process.env, timeoutMs = PLANNER_TIMEOUT_MS, chat = chatJSON } = {}) {
  const fallback = heuristicPlan(messages, { imageText });
  try {
    const reply = await chat({
      system: PLANNER_SYSTEM,
      user: plannerTranscript(messages, imageText),
      maxTokens: 320,
      timeoutMs,
      env,
    });
    if (!reply?.ok) return { ...fallback, failed: reply?.status || 'error' };
    return parsePlan(reply.text, fallback);
  } catch {
    return { ...fallback, failed: 'error' };
  }
}
