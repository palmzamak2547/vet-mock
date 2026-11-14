// ============================================================
// system-status.js — every outside service a feature needs, checked cheaply
// ============================================================
// The admin page's "ระบบภายนอก" card. Each check reads a balance, verifies a
// token or synthesises one word, so a credit, key or token that stops
// working shows there before a student reports it: the app itself degrades
// quietly (device voice, no microphone, a hidden button), which is right for
// the student and invisible to whoever looks after VetMock. `fix` names the
// next step; docs/HANDOVER.md has the long form under `doc`.
// Only states, dates, balances and env var NAMES leave the server.
// ============================================================
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { available as transcribeAvailable, providers as transcribeProviders } from '../ai-transcribe.js';
import { voiceFor } from '../tts.js';
import { externalCapabilities } from './external-connections.js';
import { rateLimit } from './rate-limit.js';
import { presign, tokenKeyEnv } from './r2.js';
import { voiceConfig, readBalance, budgetVerdict } from './ai/voice.js';
import { anthropicModelStatus } from './llm.js';

const DAY = 86_400_000;
const CHECK_MS = 8000;
const HANDOVER = 'https://github.com/palmzamak2547/vet-mock/blob/main/docs/HANDOVER.md';
const IAPP_TTS = 'https://api.iapp.co.th/v3/store/audio/tts';
const DOMAIN_RDAP = 'https://rdap.verisign.com/com/v1/domain/vetmock.com';
const DEFAULT_FEEDBACK_EMAIL = 'palmzamak2547@gmail.com'; // the fallbacks in api/send-feedback.js
const DEFAULT_FEEDBACK_FROM = 'VetMock <onboarding@resend.dev>';
// A question-length stem: Premwadee passed a one-word probe while it dropped
// two-sentence stems (28 Oct 2026), so the probe reads what students hear.
// The weekly video import runs Sunday night; two missed runs read as down.
const VIDEO_STALE_DAYS = 9;
const VOICE_PROBE = 'สุนัขเพศผู้อายุ 5 ปี มีอาการซึมและเบื่ออาหารมาสามวัน ผลตรวจเลือดพบค่าเอนไซม์ตับสูง ข้อใดเป็นการวินิจฉัยที่เป็นไปได้มากที่สุด';

const daysUntil = (iso, now) => Math.floor((Date.parse(iso) - now) / DAY);
const thaiDate = (iso) => new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' });
const signal = () => AbortSignal.timeout(CHECK_MS);

async function edgeSynth(text) {
  const tts = new MsEdgeTTS();
  try {
    await tts.setMetadata(voiceFor('th'), OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const out = await tts.toStream(text);
    const stream = out.audioStream || out;
    let bytes = 0;
    await new Promise((resolve, reject) => {
      stream.on('data', (c) => { bytes += c.length; });
      stream.on('end', resolve);
      stream.on('error', reject);
    });
    return bytes;
  } finally {
    try { tts.close(); } catch { /* already closed */ }
  }
}

// Each check: what it is, which HANDOVER section explains it, its usual fix,
// and run(deps, r) where r(state, detail, fix?) builds the row.
const CHECKS = [
  {
    id: 'voice-edge', name: 'เสียงอ่านโจทย์ (Microsoft Edge)', doc: 'voice',
    fix: 'บริการฟรีที่ไม่มีสัญญา ระหว่างนี้ปุ่มอ่านออกเสียงใช้เสียงของเครื่อง อัปเดต msedge-tts แล้วลองใหม่',
    async run({ synth }, r) {
      try {
        const bytes = await synth(VOICE_PROBE);
        return bytes > 0 ? r('ok', `อ่านโจทย์ทดสอบภาษาไทยได้ ${bytes.toLocaleString('en-US')} ไบต์ (${voiceFor('th')})`) : r('down', 'ได้ไฟล์เสียงว่าง');
      } catch (e) {
        return r('down', `Microsoft ไม่ตอบ: ${String(e?.message || e).slice(0, 120)}`);
      }
    },
  },
  {
    id: 'voice-iapp', name: 'เสียงอ่านภาษาไทย (iApp)', doc: 'voice',
    fix: 'เติมเครดิตที่ iapp.co.th ระหว่างนี้ภาษาไทยใช้เสียง Edge แทน',
    async run({ env, fetchImpl }, r) {
      if (!env.IAPP_API_KEY) return r('off', 'ไม่ได้ตั้ง IAPP_API_KEY ภาษาไทยใช้เสียง Edge แทน', 'ไม่จำเป็นถ้า Edge ใช้ได้');
      // One word: 0.02 credit when the account has credit, only when the admin opens the card.
      const res = await fetchImpl(IAPP_TTS, {
        method: 'POST', headers: { 'Content-Type': 'application/json', apikey: env.IAPP_API_KEY },
        body: JSON.stringify({ text: 'ทดสอบ', speed: 1 }), signal: signal(),
      });
      if (res.ok) return r('ok', 'สังเคราะห์คำทดสอบได้');
      if (res.status === 402) return r('down', 'เครดิต iApp หมด');
      if (res.status === 401 || res.status === 403) return r('down', `คีย์ใช้ไม่ได้ (iApp ตอบ ${res.status})`, 'สร้างคีย์ใหม่ที่ iapp.co.th แล้วแก้ IAPP_API_KEY ใน Vercel');
      return r('down', `iApp ตอบ ${res.status}`);
    },
  },
  {
    id: 'mic', name: 'ไมค์ของ VetMock AI (เบราว์เซอร์ที่ไม่มีไมค์ในตัว)', doc: 'mic',
    fix: 'ให้ token ใน CF_AI_TOKEN มีสิทธิ์ Workers AI หรือเติมเครดิต iApp',
    async run({ env, mic }, r) {
      if (!transcribeProviders(env).length) return r('off', 'ไม่ได้ตั้ง CF_AI_TOKEN หรือ IAPP_API_KEY Firefox และเบราว์เซอร์ในแอปจึงไม่เห็นปุ่มไมค์', 'ตั้ง CF_AI_TOKEN (token ของ Cloudflare ที่มีสิทธิ์ Workers AI) ใน Vercel');
      return (await mic({ env })) ? r('ok', 'ถอดเสียงทดสอบได้') : r('down', 'ถอดเสียงทดสอบไม่ได้ Firefox และเบราว์เซอร์ในแอปจึงไม่เห็นปุ่มไมค์');
    },
  },
  {
    id: 'ai-deepseek', name: 'VetMock AI ผู้ตอบหลัก (DeepSeek)', doc: 'ai',
    fix: 'เติมเงินที่ platform.deepseek.com ระหว่างนี้ AI ตอบด้วย Anthropic ถ้ายังมีเครดิต',
    async run({ env, fetchImpl }, r) {
      if (!env.DEEPSEEK_API_KEY) return r('off', 'ไม่ได้ตั้ง DEEPSEEK_API_KEY AI ตอบด้วย Anthropic อย่างเดียว', 'ตั้งคีย์ DeepSeek ใน Vercel');
      const res = await fetchImpl('https://api.deepseek.com/user/balance', { headers: { Authorization: `Bearer ${env.DEEPSEEK_API_KEY}` }, signal: signal() });
      if (!res.ok) return r('down', `DeepSeek ตอบ ${res.status}`);
      const j = await res.json();
      const bal = (j?.balance_infos || []).map((b) => `${b.total_balance} ${b.currency}`).join(', ');
      return j?.is_available === false ? r('down', `ยอดเงินหมด${bal ? ` (${bal})` : ''}`) : r('ok', bal ? `ยอดคงเหลือ ${bal}` : 'ใช้ได้');
    },
  },
  {
    id: 'ai-anthropic', name: 'VetMock AI ผู้ตอบสำรอง (Anthropic)', doc: 'ai',
    fix: 'ตรวจคีย์และเครดิตที่ console.anthropic.com แล้วแก้ ANTHROPIC_API_KEY ใน Vercel',
    async run({ env, fetchImpl }, r) {
      if (!env.ANTHROPIC_API_KEY) return r('off', 'ไม่ได้ตั้ง ANTHROPIC_API_KEY ถ้า DeepSeek ล่ม AI จะไม่มีทางสำรอง');
      // Asks for the model the routes use, not for the list: a key can be
      // fine while the model has been retired, which Anthropic answers with
      // 404 and which ends the fallback as surely as a dead key. The same
      // check feeds the public health answer (api/_lib/ai/health.js).
      const { state, status, model, error } = await anthropicModelStatus({ env, fetchImpl, timeoutMs: CHECK_MS });
      if (state === 'served') return r('ok', `คีย์ใช้ได้ และรุ่น ${model} ยังให้บริการ ส่วนยอดเครดิตดูที่ console.anthropic.com`);
      if (state === 'retired') {
        return r('down', `Anthropic เลิกให้บริการรุ่น ${model} แล้ว AI จึงไม่มีทางสำรอง`, env.AI_GRADER_MODEL
          ? 'แก้ AI_GRADER_MODEL ใน Vercel เป็นรุ่นปัจจุบัน หรือลบออกเพื่อใช้รุ่นเริ่มต้นของระบบ'
          : 'แก้ ANTHROPIC_MODEL ใน api/_lib/llm.js เป็นรุ่นปัจจุบัน หรือตั้ง AI_GRADER_MODEL ใน Vercel');
      }
      if (status == null) throw error;
      return r('down', `คีย์ใช้ไม่ได้ (Anthropic ตอบ ${status})`);
    },
  },
  {
    id: 'gemini', name: 'เสียง Mochi แบบสด (Gemini, เปิดเฉพาะแอดมิน)', doc: 'ai',
    fix: 'สร้างคีย์ใหม่ที่ aistudio.google.com แล้วแก้ GEMINI_API_KEY ใน Vercel',
    async run({ env, fetchImpl }, r) {
      if (!env.GEMINI_API_KEY) return r('off', 'ไม่ได้ตั้ง GEMINI_API_KEY', 'ฟีเจอร์นี้ยังไม่เปิดให้นิสิต ไม่ต้องทำอะไรจนกว่าจะเปิด');
      const res = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=1&key=${encodeURIComponent(env.GEMINI_API_KEY)}`, { signal: signal() });
      return res.ok ? r('ok', 'คีย์ใช้ได้ ตรวจจากตรงนี้ไม่ได้ว่ามีเครดิตพอคุยสด') : r('down', `คีย์ใช้ไม่ได้ (Google ตอบ ${res.status})`);
    },
  },
  {
    id: 'voice', name: 'คุยด้วยเสียงของ VetMock AI (ElevenLabs)', doc: 'voice-call',
    fix: 'ดูยอดเครดิตที่ elevenlabs.io (บัญชีเดียวกับเสียงแจ้งเตือนของ Tipjai) เติมแผนหรือรอวันต่ออายุ ถ้าต้องปิดชั่วคราวให้ตั้ง AI_VOICE_OFF=1 ใน Vercel',
    async run({ env, fetchImpl, now }, r) {
      const cfg = voiceConfig(env);
      if (!cfg.configured) return r('off', 'ไม่ได้ตั้ง ELEVENLABS_API_KEY หรือ ELEVENLABS_VOICE_AGENT_ID ปุ่มคุยด้วยเสียงบอกว่ายังไม่พร้อม');
      if (cfg.off) return r('off', 'ปิดอยู่ด้วย AI_VOICE_OFF=1', 'ลบ AI_VOICE_OFF ใน Vercel เมื่อพร้อมเปิด');
      const b = await readBalance(cfg, { fetchImpl, now });
      const v = budgetVerdict(b, cfg);
      if (!v.ok && v.reason === 'provider') return r('down', 'อ่านยอดเครดิตจาก ElevenLabs ไม่ได้ การเริ่มคุยด้วยเสียงจะตอบว่าเชื่อมต่อไม่สำเร็จ');
      const renews = b.renewsAt ? ` ต่ออายุ ${thaiDate(new Date(b.renewsAt).toISOString())}` : '';
      const room = `เหลือ ${Math.round(b.remaining).toLocaleString('en-US')} เครดิต (ต้องเหลือไว้ ${(cfg.floorCredits + cfg.sessionCredits * cfg.maxConcurrent).toLocaleString('en-US')})${renews}`;
      if (!v.ok) return r('down', `โควตาเดือนนี้หมด นิสิตเห็นข้อความว่าหมดโควตา: ${room}`);
      // under about twenty sessions of room left: say so before it runs out
      return v.spare < cfg.sessionCredits * 20 ? r('warn', `ใกล้หมด: ${room}`) : r('ok', room);
    },
  },
  {
    id: 'rate-limit', name: 'ตัวนับโควตา (Upstash)', doc: 'quota',
    fix: 'ตรวจบัญชี Upstash และ UPSTASH_REDIS_REST_URL กับ UPSTASH_REDIS_REST_TOKEN ใน Vercel',
    async run({ limit }, r) {
      const res = await limit('system-status:probe', 1_000_000, 60_000);
      return res?.unavailable ? r('down', 'นับโควตาไม่ได้ API ที่จำกัดจำนวน (เสียงอ่าน AI แจ้งปัญหา ผลสอบ) จึงตอบ 503 ทั้งหมด') : r('ok', 'ใช้ได้');
    },
  },
  {
    id: 'cloudflare', name: 'คลังเอกสาร (Cloudflare R2)', doc: 'library',
    fix: 'สร้าง token ใหม่ที่ dash.cloudflare.com (สิทธิ์ R2 และ Workers AI ถ้าจะใช้ไมค์) แล้วแก้ CLOUDFLARE_API_TOKEN ใน Vercel',
    async run({ env, fetchImpl, now }, r) {
      const account = env.R2_ACCOUNT_ID || env.CF_ACCOUNT_ID;
      if (!env.CLOUDFLARE_API_TOKEN || !account) return r('down', 'ไม่ได้ตั้ง CLOUDFLARE_API_TOKEN หรือ R2_ACCOUNT_ID ไฟล์ในคลังเอกสารจึงเปิดไม่ได้');
      const verify = async (url) => {
        const res = await fetchImpl(url, { headers: { Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}` }, signal: signal() });
        const j = res.ok ? await res.json() : null;
        return j?.success ? j.result : null;
      };
      // A user token verifies on /user; an account-owned token only on its account.
      const t = (await verify('https://api.cloudflare.com/client/v4/user/tokens/verify'))
        || (await verify(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/tokens/verify`));
      if (!t || t.status !== 'active') return r('down', `token ใช้ไม่ได้${t?.status ? ` (${t.status})` : ''} ไฟล์ในคลังเอกสารจึงเปิดไม่ได้`);
      if (!t.expires_on) return r('ok', 'token ใช้ได้ ไม่มีวันหมดอายุ');
      const d = daysUntil(t.expires_on, now);
      return d < 30 ? r('warn', `token หมดอายุในอีก ${d} วัน (${thaiDate(t.expires_on)})`) : r('ok', `token ใช้ได้ถึง ${thaiDate(t.expires_on)}`);
    },
  },
  {
    id: 'evidence', name: 'สไลด์ประกอบเฉลย (slides.vetmock.com)', doc: 'evidence',
    fix: 'ตั้ง EVIDENCE_BASE ใน Vercel ให้ตรงกับโฟลเดอร์ภาพใน R2 แล้ว deploy ใหม่ (docs/ANSWER-EVIDENCE.md)',
    async run({ env, fetchImpl }, r) {
      const base = String(env.EVIDENCE_BASE || '').replace(/\/+$/, '');
      if (!base.startsWith('https://slides.vetmock.com/')) return r('down', 'ไม่ได้ตั้ง EVIDENCE_BASE ใต้เฉลยจึงมีแต่ชื่อสไลด์ ไม่มีภาพ');
      // ok.txt is written beside the images by scripts/evidence/build.mjs upload.
      const res = await fetchImpl(`${base}/ok.txt`, { signal: signal() });
      return res.ok ? r('ok', 'เปิดภาพสไลด์ได้') : r('down', `เปิดภาพสไลด์ไม่ได้ (status ${res.status}) ใต้เฉลยจึงมีแต่ชื่อสไลด์ ไม่มีภาพ`);
    },
  },
  {
    id: 'videos', name: 'คลังวิดีโอ (นำเข้าคลิปใหม่ทุกสัปดาห์)', doc: 'videos',
    fix: 'บนเครื่องที่ทำคลังวิดีโอ รัน node scripts/video-pipeline.mjs แล้ว node scripts/video-registry.mjs --status แล้วอ่านสาเหตุใน log (docs/VIDEO-LIBRARY.md)',
    async run({ env, fetchImpl, now }, r) {
      // videos/_status.json is the import run's own report (scripts/video-registry.mjs --status).
      const keyed = await tokenKeyEnv(env, fetchImpl);
      if (!keyed) return r('down', 'อ่านรายงานการนำเข้าไม่ได้ เพราะ token ของ Cloudflare ใช้ไม่ได้');
      const res = await fetchImpl(presign('videos/_status.json', { env: keyed, expiresIn: 60 }), { headers: { 'accept-encoding': 'identity' }, signal: signal() });
      if (res.status === 404) return r('warn', 'ยังไม่มีรายงานการนำเข้า งานประจำสัปดาห์ยังไม่เคยรัน');
      if (!res.ok) return r('warn', `อ่านรายงานการนำเข้าไม่ได้ (status ${res.status})`);
      const s = await res.json();
      const age = Math.floor((now - Date.parse(s.at)) / DAY);
      if (!(age <= VIDEO_STALE_DAYS)) return r('down', `ไม่ได้นำเข้าคลิปใหม่มา ${age} วัน (ล่าสุด ${thaiDate(s.at)}) คลิปที่อัปโหลดหลังจากนั้นยังไม่เข้าคลัง`);
      const ids = (list) => list.slice(0, 3).map((x) => x.id).join(' ') + (list.length > 3 ? ` และอีก ${list.length - 3}` : '');
      const failed = s.failed || [];
      const held = s.held || [];
      if (failed.length) return r('warn', `${failed.length} คลิปนำเข้าไม่สำเร็จ (${ids(failed)}) รอบล่าสุด ${thaiDate(s.at)}`);
      if (held.length) return r('warn', `${held.length} คลิปรอตรวจก่อนขึ้นคลัง (${ids(held)}) รอบล่าสุด ${thaiDate(s.at)}`, 'ดูเหตุผลของแต่ละคลิปใน videos/_status.json แล้วแก้แล้วรันใหม่ (docs/VIDEO-LIBRARY.md)');
      return r('ok', `รอบล่าสุด ${thaiDate(s.at)} คลังมี ${s.videos} คลิป${s.published?.length ? ` เพิ่มใหม่ ${s.published.length}` : ''}`);
    },
  },
  {
    id: 'signing', name: 'กุญแจเซ็นผลสอบและรายงานข้อผิดพลาด', doc: 'signing',
    fix: 'ตั้งค่าเดียวกับกุญแจที่ฐานข้อมูลใช้ตรวจ ตามหัวข้อกุญแจเซ็นผลสอบในคู่มือ',
    async run({ env }, r) {
      return env.VETMOCK_RPC_SIGNING_KEY ? r('ok', 'ตั้งไว้แล้ว') : r('down', 'ไม่ได้ตั้ง VETMOCK_RPC_SIGNING_KEY ผลสอบ ห้องแข่ง และรายงานข้อผิดพลาดจึงบันทึกไม่ได้');
    },
  },
  {
    id: 'email', name: 'อีเมลแจ้งปัญหา (Resend)', doc: 'email',
    fix: 'สร้างคีย์ที่ resend.com แล้วตั้ง RESEND_API_KEY และ FEEDBACK_EMAIL ใน Vercel',
    async run({ env }, r) {
      const to = env.FEEDBACK_EMAIL || DEFAULT_FEEDBACK_EMAIL;
      const from = env.FEEDBACK_FROM || DEFAULT_FEEDBACK_FROM;
      // Resend's shared test sender delivers only to the Resend account's own address.
      const shared = from.includes('@resend.dev') ? ' ผู้ส่งเป็นที่อยู่ทดสอบของ Resend จึงส่งได้เฉพาะอีเมลเจ้าของบัญชี Resend' : '';
      return env.RESEND_API_KEY
        ? r('ok', `ส่งไปที่ ${to}${env.FEEDBACK_EMAIL ? '' : ' (ค่าเริ่มต้นในโค้ด)'}${shared}`)
        : r('down', 'ไม่ได้ตั้ง RESEND_API_KEY หน้าแจ้งปัญหาจึงส่งอีเมลไม่ได้');
    },
  },
  {
    id: 'connectors', name: 'เชื่อม Google Drive และ Notion', doc: 'connectors',
    fix: 'สร้าง OAuth client แล้วตั้งค่าใน Vercel ตามหัวข้อเชื่อม Google Drive และ Notion ในคู่มือ',
    async run({ env }, r) {
      const { connect } = externalCapabilities(env);
      const missing = [['google', 'Google Drive'], ['notion', 'Notion']].filter(([p]) => !connect[p]).map(([, label]) => label);
      return missing.length ? r('off', `ปุ่มเชื่อม ${missing.join(' และ ')} ซ่อนอยู่ เอกสาร Google สาธารณะยังเปิดได้`) : r('ok', 'เชื่อมได้ทั้งสองอย่าง');
    },
  },
  {
    id: 'domain', name: 'โดเมน vetmock.com', doc: 'domain',
    fix: 'ต่ออายุที่ Cloudflare Registrar และตรวจว่าเปิดต่ออายุอัตโนมัติกับบัตรยังใช้ได้ ถ้าโดเมนหลุด ทุกหน้าของ VetMock เข้าไม่ได้',
    async run({ fetchImpl, now }, r) {
      const res = await fetchImpl(DOMAIN_RDAP, { headers: { accept: 'application/rdap+json' }, signal: signal() });
      if (!res.ok) return r('warn', `อ่านวันหมดอายุไม่ได้ (RDAP ตอบ ${res.status}) ดูเองที่ dash.cloudflare.com`);
      const exp = ((await res.json())?.events || []).find((e) => e.eventAction === 'expiration')?.eventDate;
      if (!exp) return r('warn', 'ไม่พบวันหมดอายุ ดูเองที่ dash.cloudflare.com');
      const d = daysUntil(exp, now);
      const detail = `หมดอายุ ${thaiDate(exp)} (อีก ${d} วัน)`;
      return r(d < 14 ? 'down' : d < 60 ? 'warn' : 'ok', detail);
    },
  },
];

/** Run every check at once; one that hangs or throws reads as down without holding up the rest. */
export async function runChecks(deps = {}) {
  const d = { env: process.env, fetchImpl: fetch, synth: edgeSynth, limit: rateLimit, mic: transcribeAvailable, now: Date.now(), ...deps };
  return Promise.all(CHECKS.map(async ({ id, name, doc, fix, run }) => {
    const r = (state, detail, override) => ({ id, name, state, detail, fix: state === 'ok' ? '' : (override ?? fix), doc: `${HANDOVER}#${doc}` });
    let timer;
    const late = new Promise((resolve) => { timer = setTimeout(() => resolve(r('down', `ไม่ตอบภายใน ${CHECK_MS / 1000} วินาที`)), CHECK_MS + 1000); });
    try {
      return await Promise.race([run(d, r), late]);
    } catch (e) {
      return r('down', `ตรวจไม่สำเร็จ: ${String(e?.message || e).slice(0, 120)}`);
    } finally {
      clearTimeout(timer);
    }
  }));
}
