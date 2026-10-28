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
import { externalCapabilities } from './external-connections.js';
import { rateLimit } from './rate-limit.js';

const DAY = 86_400_000;
const CHECK_MS = 8000;
const HANDOVER = 'https://github.com/palmzamak2547/vet-mock/blob/main/docs/HANDOVER.md';
const IAPP_TTS = 'https://api.iapp.co.th/v3/store/audio/tts';
const DOMAIN_RDAP = 'https://rdap.verisign.com/com/v1/domain/vetmock.com';
const DEFAULT_FEEDBACK_EMAIL = 'palmzamak2547@gmail.com'; // the fallback in api/send-feedback.js

const daysUntil = (iso, now) => Math.floor((Date.parse(iso) - now) / DAY);
const thaiDate = (iso) => new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' });
const signal = () => AbortSignal.timeout(CHECK_MS);

async function edgeSynth(text) {
  const tts = new MsEdgeTTS();
  try {
    await tts.setMetadata('th-TH-PremwadeeNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
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
        const bytes = await synth('ทดสอบ');
        return bytes > 0 ? r('ok', `สังเคราะห์คำทดสอบได้ ${bytes.toLocaleString('en-US')} ไบต์`) : r('down', 'ได้ไฟล์เสียงว่าง');
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
      const res = await fetchImpl('https://api.anthropic.com/v1/models', {
        headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, signal: signal(),
      });
      return res.ok ? r('ok', 'คีย์ใช้ได้ ส่วนยอดเครดิตดูที่ console.anthropic.com') : r('down', `คีย์ใช้ไม่ได้ (Anthropic ตอบ ${res.status})`);
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
    id: 'signing', name: 'กุญแจเซ็นผลสอบและรายงานข้อผิดพลาด', doc: 'signing',
    fix: 'ตั้งค่าเดียวกับกุญแจที่ฐานข้อมูลใช้ตรวจ ตาม HANDOVER หัวข้อกุญแจเซ็น',
    async run({ env }, r) {
      return env.VETMOCK_RPC_SIGNING_KEY ? r('ok', 'ตั้งไว้แล้ว') : r('down', 'ไม่ได้ตั้ง VETMOCK_RPC_SIGNING_KEY ผลสอบ ห้องแข่ง และรายงานข้อผิดพลาดจึงบันทึกไม่ได้');
    },
  },
  {
    id: 'email', name: 'อีเมลแจ้งปัญหา (Resend)', doc: 'email',
    fix: 'สร้างคีย์ที่ resend.com แล้วตั้ง RESEND_API_KEY และ FEEDBACK_EMAIL ใน Vercel',
    async run({ env }, r) {
      const to = env.FEEDBACK_EMAIL || DEFAULT_FEEDBACK_EMAIL;
      return env.RESEND_API_KEY
        ? r('ok', `ส่งไปที่ ${to}${env.FEEDBACK_EMAIL ? '' : ' (ค่าเริ่มต้นในโค้ด)'}`)
        : r('down', 'ไม่ได้ตั้ง RESEND_API_KEY หน้าแจ้งปัญหาจึงส่งอีเมลไม่ได้');
    },
  },
  {
    id: 'connectors', name: 'เชื่อม Google Drive และ Notion', doc: 'connectors',
    fix: 'สร้าง OAuth client แล้วตั้งค่าใน Vercel ตาม HANDOVER หัวข้อเชื่อมบัญชี',
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
