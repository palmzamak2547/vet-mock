// ============================================================
// lint-answer-voice.mjs — an explanation explains, it does not narrate
// ============================================================
// Palm, reading a milk question: "เนี่ย อย่างเนี่ยคืออะไร กระดาษคำตอบไหน".
// The explain said "กระดาษคำตอบระบุว่ามาตรฐานนมข้นกำหนดค่าของวิตามินเอไว้".
// There is no answer sheet on his screen. Another said the purchase criteria
// came from "ตารางเกณฑ์รับซื้อที่แนบมา" — nothing is attached.
//
// An explanation is written to the candidate, in the voice of the answer. It
// states the fact. It never says where the writer read it, never quotes a
// marker's handwriting, never names the lecturer or the deck, and never points
// at a table, figure or attachment the reader cannot see. Provenance belongs in
// `verified`, which renders through humanSource(); framing belongs in `why`.
//
// Usage: node scripts/lint-answer-voice.mjs [--list] [--json out.json]
// ============================================================
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

// The field a student reads as the answer's own voice.
export const FIELDS = ['explain'];

// Each rule is a phrase that can only mean the writer is talking about their
// own source. They are checked against `explain` only — a stem may legitimately
// quote a regulation, and `verified` is provenance by design.
export const RULES = [
  ['answer-sheet', /กระดาษคำตอบ|เฉลยที่แนบ|ในเฉลยเขียน/, 'quotes an answer sheet the reader does not have'],
  ['marker-hand', /เขียนกำกับ|ลายมือที่แก้|ที่แก้ไว้ในสรุป/, "describes a marker's handwriting"],
  ['attachment', /ที่แนบมา|แนบมากับข้อสอบ|ตามที่แนบ/, 'points at an attachment that is not shown'],
  ['table-ref', /(?:ตาม|ใน|จาก|ดู)ตาราง(?!เวลา)/, 'points at a table that is not shown'],
  ['prior-paper', /ข้อสอบเดิม|โจทย์เดิม|โจทย์ข้อนี้|ข้อสอบข้อนี้|แนวข้อสอบเดิม|ข้อสอบรอบก่อน/, 'talks about the paper instead of the fact'],
  ['senior-sheet', /ชีทรุ่นพี่|สรุปรุ่นพี่|บันทึกรุ่นพี่|โพย/, 'names a senior compilation'],
  ['lecturer', /ผู้บรรยาย|อาจารย์(?:สอน|บอก|เน้น|ย้ำ|ยก|ต้องการ|ระบุ|พูด)|ที่อาจารย์|ในคาบ(?:นี้|เรียน|)?\s*(?:ระบุ|บอก|สอน|พูด|ย้ำ|เน้น)?/, 'names the lecturer or the class'],
  // นิสิต, never นักศึกษา, and an explanation should not describe what
  // classmates get wrong at all: it states the trap as a fact.
  ['classmates', /นักศึกษา/, 'talks about other students instead of the fact'],
  // "ตามเอกสาร" is only narration when it means "according to the document".
  // "ปล่อยให้เข้าฆ่าก่อนแล้วตามเอกสารทีหลัง" is a slaughterhouse following up on
  // its own paperwork, so the verb that follows decides it.
  ['deck', /สไลด์(?:ระบุ|บอก|เขียน|หน้า)|เอกสารระบุ|ในเอกสาร(?:นี้|ระบุ|กล่าว|เขียน)|ตามเอกสาร(?:ที่|นี้|ระบุ)/, 'names the deck or a document'],
];

/** Every narrating phrase in one question, as {field, rule, why, quote}. */
export function voiceHits(q) {
  const out = [];
  for (const field of FIELDS) {
    const text = String(q?.[field] || '');
    if (!text) continue;
    for (const [rule, re, why] of RULES) {
      const i = text.search(re);
      if (i >= 0) out.push({ field, rule, why, quote: text.slice(Math.max(0, i - 45), i + 95).replace(/\s+/g, ' ') });
    }
  }
  return out;
}

/** Scan rows; returns the hits and how many fields were read. */
export function scanQuestions(rows, { file = '' } = {}) {
  const hits = [];
  let scanned = 0;
  for (const q of rows) {
    for (const field of FIELDS) if (q?.[field]) scanned++;
    const found = voiceHits(q);
    if (!found.length) continue;
    hits.push({
      id: q.id, file, subject: q.subject, topic: q.topic,
      rules: [...new Set(found.map((h) => h.rule))],
      fields: [...new Set(found.map((h) => h.field))],
      why: found.map((h) => h.why),
      quote: found.map((h) => `${h.field}/${h.rule}: ${h.quote}`),
    });
  }
  return { hits, scanned };
}

async function main() {
  const LIST = process.argv.includes('--list');
  const JSON_AT = (() => { const i = process.argv.indexOf('--json'); return i > 0 ? process.argv[i + 1] : null; })();
  const banks = fs.readdirSync(`${ROOT}/src/data`).filter((f) => /^questions-.*\.js$/.test(f));
  const hits = [];
  let scanned = 0;

  for (const f of banks) {
    const mod = await import(pathToFileURL(`${ROOT}/src/data/${f}`).href);
    const entry = Object.entries(mod).find(([, v]) => Array.isArray(v));
    if (!entry) continue;
    const res = scanQuestions(entry[1], { file: f });
    scanned += res.scanned;
    hits.push(...res.hits);
  }

  const byRule = {};
  for (const h of hits) for (const r of h.rules) byRule[r] = (byRule[r] || 0) + 1;
  const rules = RULES.map(([k, , w]) => [k, w]);

  console.log(`scanned ${scanned} explanations in ${banks.length} banks`);
  console.log(`explanations that narrate instead of explain: ${hits.length}`);
  for (const [r, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${r.padEnd(16)} ${rules.find(([k]) => k === r)[1]}`);
  }
  if (LIST) for (const h of hits) console.log(`  #${h.id} [${h.subject}] ${h.rules.join(',')} — ...${h.quote[0]}...`);
  if (JSON_AT) { fs.writeFileSync(JSON_AT, `${JSON.stringify(hits, null, 2)}\n`, 'utf8'); console.log(`\nwrote ${JSON_AT}`); }

  process.exit(hits.length ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
