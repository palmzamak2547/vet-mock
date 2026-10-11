#!/usr/bin/env node
// Generate the per-question difficulty snapshot from real attempt aggregates.
//
// Every answered question in `study_event_batches` votes on how hard it is:
// a question most students miss sits above 1500, one most students clear sits
// below. Ratings are shrunk toward 1500 by sample size, so a handful of
// unlucky attempts cannot brand a question impossible.
//
// Unlike every other generated file in this repo, the source here is the LIVE
// database, not an in-repo corpus — so `--check` deliberately validates SHAPE
// only (parseable exports, finite ratings, honest counts), never staleness.
// The snapshot is refreshed deliberately by the owner:
//
//   SUPABASE_URL=https://… SUPABASE_SERVICE_ROLE_KEY=… \
//     npm run regen:question-difficulty
//
// `--scaffold` writes an empty map without credentials, for the initial commit
// and for tests. Aggregates only ever leave the database: no user ids, no
// answers, no free text — just { rating, n } per question id. Only the
// `events` column is selected; rows are ordered by the primary key without
// reading it.
//
// Shape of the source: `events` is a jsonb OBJECT keyed by event id
// (supabase/migrations/20260907050630_study_event_batches.sql checks
// jsonb_typeof = 'object'; src/lib/study-event-sync.js writes
// Object.fromEntries and reads Object.values). An array is accepted too.

import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { isAnswered } from '../src/hooks/utils.js';
import { DIFFICULTY_MIN_ATTEMPTS } from '../src/lib/elo.js';

const OUT = 'src/data/question-difficulty.generated.js';
const OUT_URL = new URL(`../${OUT}`, import.meta.url);

// Hosted PostgREST answers at most 1,000 rows per request (max_rows). Asking
// for more silently returns 1,000, so a page is never larger than that, and
// the offset advances by the rows that actually came back.
export const PAGE_SIZE = 1000;

// A question is written only once the app will actually use its rating:
// src/lib/elo.js trusts an entry from DIFFICULTY_MIN_ATTEMPTS (20) attempts.
// Writing thinner entries only grew the chunk with numbers nothing reads, and
// published aggregates of very few attempts. At 20 the shrinkage below keeps
// half of the observed deviation, and the standard error of a ~70% correct
// rate is about 0.10 (roughly 90 rating points), which is coarse but usable
// against 50-point nearness bands.
export const MIN_ATTEMPTS_TO_WRITE = DIFFICULTY_MIN_ATTEMPTS;
// Shrinkage prior: at n=20 the observed deviation keeps half its weight.
const SHRINK_PRIOR = 20;
const RATING_FLOOR = 800;
const RATING_CEILING = 2200;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

export function ratingFromAttempts(attempts, wrong) {
  const correctRate = Math.min(0.98, Math.max(0.02, (attempts - wrong) / attempts));
  const raw = 1500 + 400 * Math.log10((1 - correctRate) / correctRate);
  const shrunk = 1500 + (raw - 1500) * (attempts / (attempts + SHRINK_PRIOR));
  return Math.round(Math.min(RATING_CEILING, Math.max(RATING_FLOOR, shrunk)));
}

// The events of one batch row, whichever container the row holds.
export function eventsOf(row) {
  const events = row?.events;
  if (Array.isArray(events)) return events;
  if (events && typeof events === 'object') return Object.values(events);
  return [];
}

// Count attempts per question id. Only answered attempts with a boolean
// verdict count; everything else in a batch (reviews, timings) is skipped.
export function tallyRows(rows, tally = new Map()) {
  for (const row of rows) {
    for (const event of eventsOf(row)) {
      if (event?.kind !== 'attempt') continue;
      const id = event.questionId;
      if (id === null || id === undefined || id === '') continue;
      if (typeof event.correct !== 'boolean') continue;
      if (!isAnswered(event.answer)) continue;
      const key = String(id);
      const current = tally.get(key) ?? { attempts: 0, wrong: 0 };
      current.attempts += 1;
      if (!event.correct) current.wrong += 1;
      tally.set(key, current);
    }
  }
  return tally;
}

// `Content-Range: 0-999/5234` (or `*/0` when empty). Returns the first row's
// offset and the total, each null when the server did not report it.
export function parseContentRange(header) {
  const match = /^\s*(?:(\d+)-\d+|\*)\/(\d+|\*)\s*$/.exec(header ?? '');
  if (!match) return { start: null, total: null };
  return {
    start: match[1] === undefined ? null : Number(match[1]),
    total: match[2] === '*' ? null : Number(match[2]),
  };
}

// Page through every batch row. Stops on an empty page or once the offset
// reaches the total the server reported; never on a short page, because a
// server cap below PAGE_SIZE would otherwise end the run after page one.
export async function fetchAttempts({ url, key, fetchImpl = globalThis.fetch, pageSize = PAGE_SIZE } = {}) {
  if (!url || !key) {
    throw new Error('ต้องมี SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY (หรือใช้ --scaffold เพื่อสร้างไฟล์เปล่า)');
  }
  const limit = Math.min(PAGE_SIZE, Math.max(1, Math.floor(pageSize)));
  const base = `${url.replace(/\/$/, '')}/rest/v1/study_event_batches?select=events&order=user_id.asc,session_id.asc`;
  const tally = new Map();
  let offset = 0;
  let total = null;
  let rowCount = 0;
  let pages = 0;
  while (true) {
    const res = await fetchImpl(`${base}&limit=${limit}&offset=${offset}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact' },
    });
    // An offset past the end (rows deleted mid-run) is the end, not an error.
    if (res.status === 416 && offset > 0) break;
    if (!res.ok) throw new Error(`Supabase REST ตอบ ${res.status}: ${await res.text()}`);
    const range = parseContentRange(res.headers.get('content-range'));
    if (range.total !== null) total = range.total;
    const rows = await res.json();
    if (!Array.isArray(rows)) throw new Error('Supabase REST ไม่ได้ตอบเป็นรายการแถว');
    // A server that ignored the offset would hand back page one forever and
    // every attempt would be counted again on each pass.
    if (rows.length && range.start !== null && range.start !== offset) {
      throw new Error(`Supabase REST ตอบแถวเริ่มที่ ${range.start} แต่ขอที่ ${offset}`);
    }
    pages += 1;
    if (rows.length === 0) break;
    tallyRows(rows, tally);
    rowCount += rows.length;
    offset += rows.length;
    if (total !== null && offset >= total) break;
  }
  return { tally, rowCount, total, pages };
}

export function attemptCount(tally) {
  return [...tally.values()].reduce((sum, t) => sum + t.attempts, 0);
}

// A real run must prove it read something. Rows with no countable attempt
// means the event shape no longer matches this parser (exactly how every run
// used to write an empty map); no rows at all means the wrong project or key.
// Either way the existing snapshot is left untouched.
export function refusalFor({ rowCount, tally }) {
  if (rowCount === 0) return 'ไม่พบแถวใน study_event_batches เลย (ตรวจ SUPABASE_URL และคีย์) จึงไม่เขียนทับไฟล์เดิม';
  if (attemptCount(tally) === 0) return `อ่านได้ ${rowCount} แถวแต่นับ attempt ได้ 0 ข้อ (รูปแบบ events อาจเปลี่ยน) จึงไม่เขียนทับไฟล์เดิม`;
  return null;
}

export function buildOutput(tally, now = new Date()) {
  const entries = Object.fromEntries(
    [...tally.entries()]
      .filter(([, t]) => t.attempts >= MIN_ATTEMPTS_TO_WRITE)
      .sort((a, b) => (Number(a[0]) - Number(b[0])) || a[0].localeCompare(b[0]))
      .map(([id, t]) => [id, { rating: ratingFromAttempts(t.attempts, t.wrong), n: t.attempts }]),
  );
  const lines = [
    '// AUTO-GENERATED by scripts/regen-question-difficulty.mjs - do not hand-edit.',
    '// Aggregate attempt ratings per question id, shrunk toward 1500 by sample',
    '// size. Refreshed deliberately with provider credentials; consumers trust an',
    '// entry only from DIFFICULTY_MIN_ATTEMPTS attempts (src/lib/elo.js).',
    '',
    `export const QUESTION_DIFFICULTY_UPDATED_AT = '${now.toISOString()}';`,
    `export const QUESTION_DIFFICULTY = ${JSON.stringify(entries, null, 2)};`,
    '',
  ];
  return lines.join('\n');
}

// Shape-only validation. Never staleness: the source is the live database, so
// a red check on a Tuesday means nothing about the file's fitness.
async function check() {
  if (!fs.existsSync(OUT_URL)) fail(`${OUT} ยังไม่มี - รัน npm run regen:question-difficulty หรือ --scaffold`);
  const mod = await import(OUT_URL.href);
  const map = mod.QUESTION_DIFFICULTY;
  if (typeof map !== 'object' || map === null || Array.isArray(map)) fail('QUESTION_DIFFICULTY ต้องเป็น object');
  if (typeof mod.QUESTION_DIFFICULTY_UPDATED_AT !== 'string' || Number.isNaN(Date.parse(mod.QUESTION_DIFFICULTY_UPDATED_AT))) {
    fail('QUESTION_DIFFICULTY_UPDATED_AT ต้องเป็น ISO timestamp');
  }
  for (const [id, entry] of Object.entries(map)) {
    if (!/^[A-Za-z0-9_-]+$/.test(id)) fail(`key ไม่ถูกต้อง: ${id}`);
    if (!entry || !Number.isFinite(entry.rating) || entry.rating < RATING_FLOOR || entry.rating > RATING_CEILING) {
      fail(`rating ของข้อ ${id} อยู่นอกช่วง ${RATING_FLOOR}-${RATING_CEILING}`);
    }
    if (!Number.isInteger(entry.n) || entry.n < MIN_ATTEMPTS_TO_WRITE) {
      fail(`n ของข้อ ${id} ต้องเป็นจำนวนเต็มตั้งแต่ ${MIN_ATTEMPTS_TO_WRITE}`);
    }
    const extra = Object.keys(entry).filter((field) => field !== 'rating' && field !== 'n');
    if (extra.length) fail(`ข้อ ${id} มีฟิลด์เกิน (${extra.join(', ')}) ไฟล์นี้เก็บได้แค่ rating และ n`);
  }
  console.log(`✓ question difficulty โครงสร้างถูกต้อง: ${Object.keys(map).length} ข้อ (อัปเดต ${mod.QUESTION_DIFFICULTY_UPDATED_AT})`);
}

async function main(argv = process.argv) {
  if (argv.includes('--check')) return check();
  // --out=<path> writes somewhere else, for a dry look before replacing the
  // shipped snapshot, and for tests.
  const outArg = argv.find((arg) => arg.startsWith('--out='));
  const target = outArg ? outArg.slice('--out='.length) : OUT_URL;
  const targetLabel = outArg ? target : OUT;
  if (argv.includes('--scaffold')) {
    fs.writeFileSync(target, buildOutput(new Map()), 'utf8');
    console.log(`✓ wrote ${targetLabel}: ไฟล์เปล่าสำหรับเริ่มต้น (ยังไม่มีข้อมูลจริง)`);
    return;
  }
  let result;
  try {
    result = await fetchAttempts({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY });
  } catch (error) {
    fail(error.message);
  }
  const refusal = refusalFor(result);
  if (refusal) fail(refusal);
  const { tally, rowCount, total, pages } = result;
  if (total !== null && rowCount < total) {
    fail(`อ่านได้ ${rowCount} จาก ${total} แถว (ไม่ครบ) จึงไม่เขียนทับไฟล์เดิม`);
  }
  fs.writeFileSync(target, buildOutput(tally), 'utf8');
  const written = [...tally.values()].filter((t) => t.attempts >= MIN_ATTEMPTS_TO_WRITE).length;
  console.log(`✓ wrote ${targetLabel}: อ่าน ${rowCount} แถว ใน ${pages} หน้า, ${tally.size} ข้อถูกนับ, ${attemptCount(tally)} attempts รวม, เขียน ${written} ข้อที่มี ≥${MIN_ATTEMPTS_TO_WRITE}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
