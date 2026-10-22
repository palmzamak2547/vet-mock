#!/usr/bin/env node
// ============================================================
// tts-clips — pre-generate the shared read-aloud clips on R2
// ============================================================
// Every deliverable question's stem, each option and the option labels are
// spoken once by Gemini 3.8 Flash TTS (voice Kore, through OpenRouter),
// trimmed, encoded to AAC and uploaded to the public bucket behind
// tts.vetmock.com, named by clipKey(text) from src/lib/tts-text.js. A per-
// subject manifest lists the clips that exist, so the page knows before it
// asks. Edited text hashes to a new name and is generated on the next run;
// clips already in the bucket are never paid for twice.
//
//   node scripts/tts-clips.mjs --subject avian-medicine --dry
//   node scripts/tts-clips.mjs --subject avian-medicine [--limit 20] [--keep out/dir]
//   node scripts/tts-clips.mjs --all
//
// Needs OPENROUTER_API_KEY (or TTS_KEYS_ENV, a KEY=value file holding it),
// CLOUDFLARE_API_TOKEN with R2 write, and ffmpeg on PATH. Resumable: the
// bucket listing is the record of what is done.
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { clipText, clipKey, optionLabel, questionLang, SHARED_TTS } from '../src/lib/tts-text.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const arg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const DRY = args.includes('--dry');
const SUBJECT = arg('--subject');
const LIMIT = Number(arg('--limit')) || Infinity;
const KEEP = arg('--keep');
const CONCURRENCY = Number(arg('--concurrency')) || 4;
if (!SUBJECT && !args.includes('--all')) throw new Error('Pass --subject <id> or --all');

const ACCOUNT = 'f637e6449eaaf73c7ac900c4e6915604';
const BUCKET = 'vetmock-tts';
const R2 = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/r2/buckets/${BUCKET}`;
const OR_MODEL = `google/${SHARED_TTS.model}`;
const CHARS_PER_SEC = 11.6; // measured Kore pace on Thai

function secret(name) {
  if (process.env[name]) return process.env[name];
  const file = process.env.TTS_KEYS_ENV;
  if (file) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_0-9]+)\s*=\s*(.+?)\s*$/);
      if (m && m[1] === name) return m[2];
    }
  }
  throw new Error(`missing ${name}`);
}

// ---- 1. the texts -----------------------------------------------------
const DATA = path.join(ROOT, 'src', 'data');
const { isQuestionDeliverable } = await import(new URL('../src/data/question-delivery.generated.js', import.meta.url).href);
const bySubject = new Map(); // subject -> Set(text)
for (const f of fs.readdirSync(DATA).filter((x) => /^questions-.*\.js$/.test(x)).sort()) {
  const m = await import(new URL(`../src/data/${f}`, import.meta.url).href);
  for (const rows of Object.values(m)) {
    if (!Array.isArray(rows)) continue;
    for (const q of rows) {
      if (!q || typeof q !== 'object' || !q.subject || typeof q.q !== 'string') continue;
      if (SUBJECT && q.subject !== SUBJECT) continue;
      if (!isQuestionDeliverable(q)) continue;
      const options = Array.isArray(q.options) ? q.options.map(String) : [];
      const lang = questionLang(q.q, options);
      const set = bySubject.get(q.subject) || new Set();
      set.add(clipText(q.q, lang));
      options.forEach((o, i) => { set.add(clipText(o, lang)); set.add(optionLabel(i, lang)); });
      set.delete('');
      bySubject.set(q.subject, set);
    }
  }
}
const texts = new Map(); // key -> text
const subjectKeys = new Map();
for (const [subject, set] of bySubject) {
  const keys = [];
  for (const t of set) { const k = await clipKey(t); texts.set(k, t); keys.push(k); }
  subjectKeys.set(subject, keys);
}
const chars = [...texts.values()].reduce((n, t) => n + t.length, 0);
const audioSec = chars / CHARS_PER_SEC;
console.log(`subjects ${bySubject.size}, clips ${texts.size}, chars ${chars}, ~${(audioSec / 3600).toFixed(1)} h audio, ~$${(audioSec * 25 * 9e-6 + chars * 0.5e-6 * 1.2).toFixed(2)} at Gemini list price`);

// ---- 2. what the bucket already has -----------------------------------
const CF = secret('CLOUDFLARE_API_TOKEN');
const cf = (url, init = {}) => fetch(url, { ...init, headers: { Authorization: `Bearer ${CF}`, ...(init.headers || {}) } });
async function listDone() {
  const done = new Set();
  let cursor = '';
  for (;;) {
    const r = await cf(`${R2}/objects?prefix=${SHARED_TTS.gen}/&per_page=1000${cursor ? `&cursor=${cursor}` : ''}`);
    const j = await r.json();
    if (!j.success) throw new Error(`R2 list: ${JSON.stringify(j.errors)}`);
    for (const o of j.result) { const m = o.key.match(/\/([0-9a-f]{16})\.mp4$/); if (m) done.add(m[1]); }
    cursor = j.result_info?.cursor;
    if (!j.result_info?.is_truncated || !cursor) return done;
  }
}
const done = await listDone();
const todo = [...texts.keys()].filter((k) => !done.has(k)).slice(0, LIMIT);
const todoChars = todo.reduce((n, k) => n + texts.get(k).length, 0);
console.log(`in bucket ${done.size}, to generate ${todo.length} (${todoChars} chars)`);
if (DRY) process.exit(0);

// ---- 3. generate, check, encode, upload -------------------------------
const OR = secret('OPENROUTER_API_KEY');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vmx-tts-'));
if (KEEP) fs.mkdirSync(KEEP, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function speak(text) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch('https://openrouter.ai/api/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OR}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OR_MODEL, input: text, voice: SHARED_TTS.voice, response_format: 'pcm' }),
      signal: AbortSignal.timeout(120_000),
    }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    const body = (await r.text()).slice(0, 200);
    // 402 = out of credit: stop everything, nothing else will succeed.
    if (r.status === 402) { console.error('OUT OF CREDIT', body); process.exit(2); }
    if (attempt >= 5 || (r.status >= 400 && r.status < 500 && r.status !== 429 && r.status !== 408)) throw new Error(`tts ${r.status} ${body}`);
    await sleep(2000 * 2 ** attempt);
  }
}

// 24 kHz mono s16le in; leading/trailing silence trimmed to 50 ms; AAC out.
function encode(pcm, key) {
  const raw = path.join(tmp, `${key}.pcm`);
  const out = path.join(tmp, `${key}.m4a`);
  fs.writeFileSync(raw, pcm);
  const trim = 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05';
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', raw,
    '-af', `${trim},areverse,${trim},areverse`, '-c:a', 'aac', '-b:a', '32k', '-movflags', '+faststart', out]);
  const sec = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]).toString());
  if (KEEP) fs.copyFileSync(out, path.join(KEEP, `${key}.m4a`));
  const bytes = fs.readFileSync(out);
  fs.rmSync(raw); fs.rmSync(out);
  return { bytes, sec };
}

// A voice that loops or stops early shows up as a duration far from the
// text's length. Short labels get a wide band.
// A digit is spoken as a Thai number word, about three letters' worth
// ("O103" says โอ หนึ่งร้อยสาม), so digits count three times.
function plausible(text, sec) {
  const expect = (text.length + 2 * (text.match(/\d/g) || []).length) / CHARS_PER_SEC;
  return sec >= Math.min(0.25, expect) && sec <= Math.max(4, expect * 2.5) && sec >= expect * 0.3;
}

async function put(key, buf, type, cache) {
  for (let attempt = 0; ; attempt++) {
    const r = await cf(`${R2}/objects/${key}`, { method: 'PUT', body: buf, headers: { 'Content-Type': type, 'Cache-Control': cache } });
    if (r.ok) return;
    if (attempt >= 4) throw new Error(`R2 put ${r.status} ${(await r.text()).slice(0, 200)}`);
    await sleep(1000 * 2 ** attempt);
  }
}

const failed = [];
let n = 0, bytesTotal = 0, secTotal = 0;
fs.mkdirSync(path.join(ROOT, 'work'), { recursive: true });
const log = fs.createWriteStream(path.join(ROOT, 'work', `tts-clips-${Date.now()}.jsonl`), { flags: 'a' });
async function one(key) {
  const text = texts.get(key);
  for (let tries = 0; tries < 2; tries++) {
    try {
      const { bytes, sec } = encode(await speak(text), key);
      if (!plausible(text, sec)) { log.write(JSON.stringify({ key, text, sec, implausible: true }) + '\n'); continue; }
      await put(`${SHARED_TTS.gen}/${key}.mp4`, bytes, 'audio/mp4', 'public, max-age=31536000, immutable');
      done.add(key); bytesTotal += bytes.length; secTotal += sec;
      log.write(JSON.stringify({ key, chars: text.length, sec, bytes: bytes.length }) + '\n');
      if (++n % 50 === 0) console.log(`${n}/${todo.length} ${(bytesTotal / 1e6).toFixed(1)} MB ${(secTotal / 60).toFixed(1)} min`);
      return;
    } catch (e) {
      log.write(JSON.stringify({ key, error: String(e.message || e).slice(0, 200) }) + '\n');
    }
  }
  failed.push(key);
}
const queue = todo.slice();
await Promise.all(Array.from({ length: CONCURRENCY }, async () => { while (queue.length) await one(queue.shift()); }));

// ---- 4. manifests: only clips that really exist -------------------------
for (const [subject, keys] of subjectKeys) {
  const have = keys.filter((k) => done.has(k)).sort();
  await put(`${SHARED_TTS.gen}/m/${encodeURIComponent(subject)}.json`, Buffer.from(JSON.stringify(have)),
    'application/json', 'public, max-age=300');
}
console.log(`generated ${n}, failed ${failed.length}, ${(bytesTotal / 1e6).toFixed(2)} MB, ${(secTotal / 60).toFixed(1)} min audio, mean ${(bytesTotal / Math.max(1, secTotal) * 8 / 1000).toFixed(1)} kbps`);
if (failed.length) console.log('failed:', failed.map((k) => texts.get(k).slice(0, 60)).join(' | '));
fs.rmSync(tmp, { recursive: true, force: true });
