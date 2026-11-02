#!/usr/bin/env node
// ============================================================
// tts-clips — pre-generate the shared read-aloud clips on R2
// ============================================================
// Every chosen question's stem, each option and the option labels are
// spoken once, trimmed, encoded to AAC and uploaded to the public bucket
// behind tts.vetmock.com, named by clipKey(text, generation) from
// src/lib/tts-text.js. Two generations: g1 is Gemini 3.8 Flash TTS (voice
// Kore, through OpenRouter), e1 is ElevenLabs eleven_v4_turbo (voice
// Sarah). A per-subject manifest per generation lists the clips that exist,
// so the page knows before it asks. Edited text hashes to a new name and is
// generated on the next run; clips already in the bucket are never paid for
// twice.
//
//   node scripts/tts-clips.mjs --subject avian-medicine --dry
//   node scripts/tts-clips.mjs --subject avian-medicine [--limit 20] [--keep out/dir]
//   node scripts/tts-clips.mjs --all
//   node scripts/tts-clips.mjs --gen e1 --year 5 --scope final --explain \
//     --max-credits 80000 --keep-remaining 10000 [--dry]
//   node scripts/tts-clips.mjs --gen e1 --year 5 --manifests
//
// --year and --scope narrow the questions to one paper, as the app's pool
// for it does. They are worked through in Panic Mode's order: past papers
// (that paper's own first), then items written from a marked compilation,
// then the rest; one question from each subject in turn, in the
// timetable's order, so a stop for budget leaves every paper covered alike.
// --explain adds the เหตุผล of each mcq and true/false question, one clip,
// which the practice panel's read-aloud plays. A question's clips are made
// together, so a stop leaves few half-voiced questions.
//
// ElevenLabs returns each request's cost in a header; the run sums it.
// --max-credits caps this run's spend, and --keep-remaining stops it while
// the account (shared with other products) still holds that many.
//
// Needs ELEVENLABS_API_KEY or OPENROUTER_API_KEY (or TTS_KEYS_ENV, a
// KEY=value file holding them), CLOUDFLARE_API_TOKEN with R2 write, and
// ffmpeg on PATH. Resumable: the bucket listing is the record of what is
// done, and each manifest is rebuilt from it over the whole subject.
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { clipText, clipKey, optionLabel, questionLang, SHARED_TTS, ELEVEN_TTS } from '../src/lib/tts-text.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const arg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const DRY = args.includes('--dry');
const MANIFESTS_ONLY = args.includes('--manifests');
const SUBJECT = arg('--subject');
const IDS = arg('--ids')?.split(','); // a spot check: only these question ids
const YEAR = Number(arg('--year')) || null;
const SCOPE = arg('--scope') || null;
const EXPLAIN = args.includes('--explain');
const LIMIT = Number(arg('--limit')) || Infinity;
const KEEP = arg('--keep');
const CONCURRENCY = Number(arg('--concurrency')) || 4;
const MAX_CREDITS = Number(arg('--max-credits')) || Infinity;
const KEEP_REMAINING = Number(arg('--keep-remaining')) || 0;
const G = { g1: SHARED_TTS, e1: ELEVEN_TTS }[arg('--gen') || 'g1'];
if (!G) throw new Error('--gen is g1 or e1');
if (!SUBJECT && !YEAR && !args.includes('--all')) throw new Error('Pass --subject <id>, --year <n> or --all');
if (SCOPE && !['midterm', 'final'].includes(SCOPE)) throw new Error('--scope is midterm or final');

const ACCOUNT = 'f637e6449eaaf73c7ac900c4e6915604';
const BUCKET = 'vetmock-tts';
const R2 = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/r2/buckets/${BUCKET}`;
const CHARS_PER_SEC = 11.6; // measured Kore pace on Thai; Sarah measured 10.3-13.4

function secret(name) {
  if (process.env[name]) return process.env[name];
  const file = process.env.TTS_KEYS_ENV;
  if (file) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_0-9]+)\s*=\s*(.+?)\s*$/);
      if (m && m[1] === name) return m[2].replace(/^"|"$/g, '');
    }
  }
  throw new Error(`missing ${name}`);
}

// ---- 1. the texts -----------------------------------------------------
const load = (rel) => import(new URL(`../src/${rel}`, import.meta.url).href);
const { QB, loadQB } = await load('data/questions.js');
await loadQB();
const { isQuestionDeliverable } = await load('data/question-delivery.generated.js');
const { SUBJECTS, SUBJECTS_BY_YEAR } = await load('data/curriculum.js');
const { EXAM_SCHEDULE } = await load('data/schedule.js');
const { questionInScope } = await load('lib/exam-scope.js');
const { panicRank } = await load('lib/question-metadata.js');
const { parseExamOrigin } = await load('lib/exam-origin-parse.js');

const hidden = new Set(SUBJECTS.flatMap((s) => (s.topics || []).filter((t) => t.hidden).map((t) => `${s.id}/${t.id}`)));
// With --scope, the year's subjects are the ones its timetable seats at that paper.
const paperDate = new Map((EXAM_SCHEDULE[`y${YEAR}`] || []).filter((e) => !SCOPE || e.term === SCOPE).map((e) => [e.subject, e.date]));
const yearSubjects = YEAR ? new Set(SCOPE && paperDate.size ? paperDate.keys() : (SUBJECTS_BY_YEAR[YEAR] || []).map((s) => s.id || s)) : null;
const shown = (q) => q && typeof q.q === 'string' && q.subject && isQuestionDeliverable(q) && !hidden.has(`${q.subject}/${q.topic}`);
const picked = QB.filter((q) => shown(q) && (!SUBJECT || q.subject === SUBJECT) && (!IDS || IDS.includes(String(q.id)))
  && (!yearSubjects || yearSubjects.has(q.subject)) && (!SCOPE || questionInScope(q, SCOPE)));

// What the page asks for, in reading order: the stem, then a label and an
// option for each option (any option can sit at any letter once shuffled),
// and, as its own clip, the เหตุผล the practice panel shows (mcq, tf).
function questionTexts(q, withExplain) {
  const options = Array.isArray(q.options) ? q.options.map(String) : [];
  const lang = questionLang(q.q, options);
  const out = [clipText(q.q, lang)];
  options.forEach((o, i) => out.push(optionLabel(i, lang), clipText(o, lang)));
  if (withExplain && q.explain && (q.type === 'mcq' || q.type === 'tf')) out.push(clipText(q.explain, questionLang(q.explain, [])));
  return out.filter(Boolean);
}

// Panic Mode's bands, the paper's own past items first; then one question
// per subject in turn, subjects in the timetable's order for that paper.
const band = (q) => panicRank(q) * 2 + (SCOPE && parseExamOrigin(q.examOrigin || '').paper === SCOPE ? 0 : 1);
const subjects = [...new Set(picked.map((q) => q.subject))]
  .sort((a, b) => (paperDate.get(a) || '9999').localeCompare(paperDate.get(b) || '9999') || a.localeCompare(b));
const order = [];
for (const b of [...new Set(picked.map(band))].sort((x, y) => x - y)) {
  const lanes = subjects.map((s) => picked.filter((q) => q.subject === s && band(q) === b));
  for (let i = 0; lanes.some((l) => i < l.length); i++) for (const l of lanes) if (i < l.length) order.push(l[i]);
}

const texts = new Map(); // key -> text
const queue = [];        // keys in the order to generate
const questionOf = new Map(); // key -> index in order of the first question needing it
for (const [i, q] of order.entries()) {
  for (const t of questionTexts(q, EXPLAIN)) {
    const k = await clipKey(t, G);
    if (!texts.has(k)) { texts.set(k, t); queue.push(k); questionOf.set(k, i); }
  }
}
// A manifest covers the whole subject, explanations included, so a run
// that picked fewer questions never drops clips an earlier run made.
const subjectKeys = new Map();
for (const s of subjects) {
  const keys = new Set();
  for (const q of QB) if (q.subject === s && shown(q)) for (const t of questionTexts(q, true)) keys.add(await clipKey(t, G));
  subjectKeys.set(s, keys);
}
const chars = queue.reduce((n, k) => n + texts.get(k).length, 0);
console.log(`gen ${G.gen} (${G.model}), subjects ${subjects.join(', ')}; questions ${order.length}, clips ${queue.length}, chars ${chars}`);

// ---- 2. what the bucket already has -----------------------------------
const CF = secret('CLOUDFLARE_API_TOKEN');
const cf = (url, init = {}) => fetch(url, { ...init, headers: { Authorization: `Bearer ${CF}`, ...(init.headers || {}) } });
async function listDone() {
  const done = new Set();
  let cursor = '';
  for (;;) {
    const r = await cf(`${R2}/objects?prefix=${G.gen}/&per_page=1000${cursor ? `&cursor=${cursor}` : ''}`);
    const j = await r.json();
    if (!j.success) throw new Error(`R2 list: ${JSON.stringify(j.errors)}`);
    for (const o of j.result) { const m = o.key.match(/\/([0-9a-f]{16})\.mp4$/); if (m) done.add(m[1]); }
    cursor = j.result_info?.cursor;
    if (!j.result_info?.is_truncated || !cursor) return done;
  }
}
const done = await listDone();
const todo = MANIFESTS_ONLY ? [] : queue.filter((k) => !done.has(k)).slice(0, LIMIT);
const todoChars = todo.reduce((n, k) => n + texts.get(k).length, 0);
console.log(`in bucket ${done.size}, to generate ${todo.length} (${todoChars} chars)`);
if (DRY) {
  // How far the cap reaches at the rate measured on Thai text (2 Nov 2026).
  if (MAX_CREDITS < Infinity) {
    let credits = 0, i = 0;
    while (i < todo.length && credits + texts.get(todo[i]).length * 0.22 <= MAX_CREDITS) credits += texts.get(todo[i++]).length * 0.22;
    console.log(`${MAX_CREDITS} credits at 0.22 a character reach ${i} clips, the first ${i ? questionOf.get(todo[i - 1]) + 1 : 0} of ${order.length} questions`);
  }
  process.exit(0);
}

// ---- 3. generate, check, encode, upload -------------------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vmx-tts-'));
if (KEEP) fs.mkdirSync(KEEP, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let stopReason = null;
let spent = 0;      // credits, from ElevenLabs' character-cost header
let requests = 0;

async function account() {
  const r = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': secret('ELEVENLABS_API_KEY') } });
  const j = await r.json();
  return j.character_limit - j.character_count;
}

// Stop before a request that could pass either cap. 0.5 credit a
// character is the model's list rate; Thai measured 0.22 on 2 Nov 2026.
async function mayRequest(text) {
  const estimate = Math.ceil(text.length * 0.5);
  if (spent + estimate > MAX_CREDITS) stopReason ||= `max credits (${spent} spent)`;
  if (G === ELEVEN_TTS && KEEP_REMAINING && requests % 20 === 0) {
    const left = await account();
    if (left - estimate <= KEEP_REMAINING) stopReason ||= `account down to ${left}`;
  }
  return !stopReason;
}

async function request(text) {
  if (G === ELEVEN_TTS) {
    return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${G.voice}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': secret('ELEVENLABS_API_KEY'), 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: G.model }),
      signal: AbortSignal.timeout(120_000),
    });
  }
  return fetch('https://openrouter.ai/api/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret('OPENROUTER_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: `google/${G.model}`, input: text, voice: G.voice, response_format: 'pcm' }),
    signal: AbortSignal.timeout(120_000),
  });
}

async function speak(text) {
  for (let attempt = 0; ; attempt++) {
    requests++;
    const r = await request(text).catch((e) => ({ ok: false, status: 0, headers: new Headers(), text: async () => String(e) }));
    if (r.ok) {
      const audio = Buffer.from(await r.arrayBuffer());
      if (G === ELEVEN_TTS) spent += Number(r.headers.get('character-cost')) || Math.ceil(text.length * 0.5);
      return audio;
    }
    const body = (await r.text()).slice(0, 200);
    // Out of credit or key: nothing else will succeed, so finish cleanly.
    if (r.status === 401 || r.status === 402 || /quota_exceeded/.test(body)) { stopReason ||= `${r.status} ${body}`; throw new Error(stopReason); }
    if (attempt >= 5 || (r.status >= 400 && r.status < 500 && r.status !== 429 && r.status !== 408)) throw new Error(`tts ${r.status} ${body}`);
    await sleep(2000 * 2 ** attempt);
  }
}

// Into 24 kHz mono AAC, leading/trailing silence trimmed to 50 ms. Gemini
// sends raw 24 kHz s16le, ElevenLabs an MP3.
function encode(audio, key) {
  const pcm = G === SHARED_TTS;
  const raw = path.join(tmp, `${key}.${pcm ? 'pcm' : 'mp3'}`);
  const out = path.join(tmp, `${key}.m4a`);
  fs.writeFileSync(raw, audio);
  const trim = 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05';
  const input = pcm ? ['-f', 's16le', '-ar', '24000', '-ac', '1', '-i', raw] : ['-i', raw];
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...input, '-af', `${trim},areverse,${trim},areverse`,
    '-ac', '1', '-ar', '24000', '-c:a', 'aac', '-b:a', '32k', '-movflags', '+faststart', out]);
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
const log = fs.createWriteStream(path.join(ROOT, 'work', `tts-clips-${G.gen}-${Date.now()}.jsonl`), { flags: 'a' });
async function one(key) {
  const text = texts.get(key);
  for (let tries = 0; tries < 2; tries++) {
    if (!(await mayRequest(text))) return;
    try {
      const { bytes, sec } = encode(await speak(text), key);
      if (!plausible(text, sec)) { log.write(JSON.stringify({ key, text, sec, implausible: true }) + '\n'); continue; }
      await put(`${G.gen}/${key}.mp4`, bytes, 'audio/mp4', 'public, max-age=31536000, immutable');
      done.add(key); bytesTotal += bytes.length; secTotal += sec;
      log.write(JSON.stringify({ key, chars: text.length, sec, bytes: bytes.length, spent }) + '\n');
      if (++n % 50 === 0) console.log(`${n}/${todo.length} ${(bytesTotal / 1e6).toFixed(1)} MB ${(secTotal / 60).toFixed(1)} min, ${spent} credits`);
      return;
    } catch (e) {
      log.write(JSON.stringify({ key, error: String(e.message || e).slice(0, 200) }) + '\n');
      if (stopReason) return;
    }
  }
  failed.push(key);
}
const work = todo.slice();
await Promise.all(Array.from({ length: CONCURRENCY }, async () => { while (work.length && !stopReason) await one(work.shift()); }));

// ---- 4. manifests: only clips that really exist -------------------------
for (const [subject, keys] of subjectKeys) {
  const have = [...keys].filter((k) => done.has(k)).sort();
  await put(`${G.gen}/m/${encodeURIComponent(subject)}.json`, Buffer.from(JSON.stringify(have)),
    'application/json', 'public, max-age=300');
}
// Per subject: questions whose read-aloud is now whole in this voice, and
// explanations voiced, out of those chosen.
for (const s of subjects) {
  let whole = 0, total = 0, ex = 0, exTotal = 0;
  for (const q of order.filter((x) => x.subject === s)) {
    total++;
    const keys = await Promise.all(questionTexts(q, false).map((t) => clipKey(t, G)));
    if (keys.every((k) => done.has(k))) whole++;
    const all = questionTexts(q, true);
    if (all.length > keys.length) { exTotal++; if (done.has(await clipKey(all.at(-1), G))) ex++; }
  }
  console.log(`${s}: questions ${whole}/${total}, explanations ${ex}/${exTotal}`);
}
console.log(`generated ${n}, failed ${failed.length}, ${(bytesTotal / 1e6).toFixed(2)} MB, ${(secTotal / 60).toFixed(1)} min audio, mean ${(bytesTotal / Math.max(1, secTotal) * 8 / 1000).toFixed(1)} kbps`);
if (G === ELEVEN_TTS) console.log(`credits spent ${spent}, account left ${await account()}`);
if (stopReason) console.log(`stopped: ${stopReason}; ${work.length} clips left for the next run`);
if (failed.length) console.log('failed:', failed.map((k) => texts.get(k).slice(0, 60)).join(' | '));
fs.rmSync(tmp, { recursive: true, force: true });
