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
// marker's handwriting, never names the lecturer, a senior or the deck, never
// predicts what the paper will ask, and never points at a table, figure,
// attachment or option letter the reader cannot see. Provenance belongs in
// `verified`, which renders through humanSource(); framing belongs in `why`.
//
// A model answer is held to the same voice: it is what a candidate would
// write, so it cannot cite the lecturer or the deck either.
//
// Usage: node scripts/lint-answer-voice.mjs [--list] [--json out.json]
// ============================================================
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

// The two fields a student reads as the answer's own voice. `verified` is
// provenance by design and `why` is framing, so neither is scanned; a stem may
// legitimately quote a regulation, and has its own lint (lint:question-voice).
export const FIELDS = ['explain', 'model_answer'];

// Each rule is a phrase that can only mean the writer is talking about their
// own source, their reader's classmates, or the paper instead of the fact.
// A word list is only as good as the words someone thought of: 2026-09-23 the
// deck rule knew เอกสารระบุ but not เอกสารเขียน/แบ่ง/ให้, the senior rule knew
// บันทึกรุ่นพี่ but not รุ่นพี่บันทึก, and nothing read model_answer, so ~180
// narrating explanations passed a lint that reported 0.
export const RULES = [
  // "เฉลย" is the answer key. An explanation IS the answer; the only reason
  // to name the key is to narrate it ("ตามเฉลย", "เฉลยตัดออก", "คีย์เฉลย").
  ['answer-sheet', /กระดาษคำตอบ|เฉลย|\bExercise\s*\d+\s*KEY\b|\bAnswer Key\b/, 'quotes an answer sheet the reader does not have'],
  ['marker-hand', /เขียนกำกับ|ลายมือที่แก้|ที่แก้ไว้ในสรุป|ตามไฮไลต์|หมึก(?:สี)?แดง|ขีดเส้นใต้|ติดดาว|ตีกรอบไว้|ลูกศรโยง|โน้ต(?:ระบุ|เขียน|บอก)|กล่อง(?:ในสรุป|ค่าอ้างอิง|กำกับ)/, "describes a marker's handwriting"],
  ['attachment', /ที่แนบมา|แนบมากับข้อสอบ|ตามที่แนบ/, 'points at an attachment that is not shown'],
  ['table-ref', /(?:ตาม|ใน|จาก|ดู)ตาราง(?!เวลา)/, 'points at a table that is not shown'],
  ['prior-paper', /ข้อสอบเดิม|โจทย์เดิม|โจทย์ข้อนี้|ข้อสอบข้อนี้|แนวข้อสอบเดิม|ข้อสอบรอบก่อน|ข้อสอบชุดเดิม|คำถามข้อนี้/, 'talks about the paper instead of the fact'],
  // Any mention of a senior, a senior's sheet or a named senior summary.
  // รุ่นพี่ appears in 12 explanations and every one narrates a compilation.
  ['senior-sheet', /รุ่นพี่|ชีท|โพย|ผู้สรุป|Kimchii|\bTJ\s?8\d\b/, 'names a senior compilation'],
  // A cohort ("Vet 81 group ตอบ B", "Vet 83 mark X", "Vet 85 lecture") is a
  // class of students, not a fact about the animal.
  ['cohort', /\bVet\s?\d{2}\b|\bcommentary\b/i, 'names a cohort or its commentary'],
  // นิสิต, never นักศึกษา, and an explanation should not describe what
  // classmates get wrong at all: it states the trap as a fact.
  ['classmates', /นักศึกษา/, 'talks about other students instead of the fact'],
  // Every อาจารย์ in an explanation narrates the lecturer; the one innocent use
  // in the bank is One Health's faculty development ("พัฒนาอาจารย์"). "Aj." and
  // "อ.<name>" are the same thing abbreviated; "อ.ย." is the Thai FDA.
  ['lecturer', /ผู้บรรยาย|(?<!พัฒนา)อาจารย์|\bAj\.|\bAj [A-Z]|(?<![ก-๙])อ\.(?!ย\.)\s?[ก-ฮ]|ในคาบ(?:นี้|เรียน|)?\s*(?:ระบุ|บอก|สอน|พูด|ย้ำ|เน้น)?|\b[Pp]er (?:lecture|slide)\b/, 'names the lecturer or the class'],
  // "ตามเอกสาร" is only narration when it means "according to the document".
  // "ปล่อยให้เข้าฆ่าก่อนแล้วตามเอกสารทีหลัง" is a slaughterhouse following up on
  // its own paperwork, so the verb that follows decides it. Likewise เอกสาร is
  // a real object in food law (เอกสารรับรอง, เอกสารเคลื่อนย้าย, เอกสารกำกับยา,
  // จัดทำเอกสารและบันทึก), so only the verbs that make the document a speaker
  // are listed.
  ['deck', new RegExp([
    'สไลด์(?:ระบุ|บอก|เขียน|หน้า)', '\\bslides?\\s*\\d', '\\bslide:',
    'ในเอกสาร(?:นี้|ระบุ|กล่าว|เขียน)', 'ตามเอกสาร(?:ที่|นี้|ระบุ)', 'ตามที่เอกสาร', 'จากเอกสารประกอบ',
    'เอกสารประกอบการสอน', 'เอกสารที่ข้อนี้',
    // the summary a question was written from is a document too
    'สรุป(?:ชุดนี้|เขียน|ขีดเส้น|ทำเครื่องหมาย|ระบุ|แยกไว้|บันทึก|อธิบาย|บรรยาย|กำกับ)', 'ขีดเส้นใต้(?:ไว้|กำกับ)', 'ทำเครื่องหมายดาว',
    'ใน(?:เนื้อหา)?สรุป', 'ของสรุป', 'ที่สรุปไว้',
    '(?:ตาม|ใน|จาก)\\s*(?:[Ss]lides?|สไลด์|[Ll]ecture|เลคเชอร์|เลกเชอร์|handout)',
    // no space allowed: "💡 เอกสาร แยกสัมผัส อุณหภูมิ" lists the paperwork
    `เอกสาร(?:${[
      'ระบุ', 'เขียน', 'แบ่ง', 'ให้(?:เหตุผล|ไว้|ตัวเลข)', 'ยก', 'บอก', 'อธิบาย', 'จัด(?!ทำ)', 'ใช้กับ', 'ยัง', 'กล่าว',
      'ไม่ได้(?:ระบุ|กล่าว|เขียน)', 'เน้น', 'ชี้', 'แยก', 'บรรยาย', 'เรียก', 'เรียง', 'ทำเครื่องหมาย', 'ตอบ', 'ตั้งคำถาม',
      'หน้า', 'พูด', 'ยอมรับ', 'เอง', 'ห้าม', 'เตือน', 'กำกับไว้', 'ไล่', 'เปรียบ', 'เปิดบท', 'ไฮไลต์',
      'บันทึก(?!ข้อ|และ)', 'นิยาม', 'กาว่า', 'ย้ำ', 'สรุป', 'p\\.',
    ].join('|')})`,
  ].join('|')), 'names the deck or a document'],
  // What the paper will ask is a prediction, and it never belongs in an
  // explanation ("ข้อสอบชอบถามคู่กัน", "เป็นจุดที่มักออกข้อสอบ", "ออก 2 ล้านข้อ").
  // NOT bare ชอบออก/มักออก: a female pinworm "ชอบออกมาวางไข่" is biology.
  ['exam-prediction', /ข้อสอบ(?:ชอบ|มัก|จะ|ถาม)|ออก(?:ข้อ)?สอบ|ออก\s?\d+\s?ล้านข้อ|จำไปให้หมด|จำไปสอบ/, 'predicts what the paper will ask'],
];

// Option letters and positions only mean something while the options keep the
// order they were written in. getShuffledOptions (src/lib/option-shuffle.js)
// permutes every multiple-choice row that does not set noShuffle, and the
// screen relabels them A-E by display position, so "ข้อ D จึงถูก" or
// "ตัวเลือกแรกผิดเพราะ" points at a different row for most students. Quote the
// option's content instead. Review shows answers as text, so this is only a
// defect on a shuffled row.
export const OPTION_POSITION = new RegExp([
  '(?<![\\u0E00-\\u0E7FA-Za-z])(?:ข้อ|ตัวเลือก|choice|option)\\s*\\(?[A-E]\\)?(?![A-Za-z0-9\\u0E00-\\u0E7F.])',
  '(?<![\\u0E00-\\u0E7F])(?:ข้อ|ตัวเลือก)\\s*\\(?[ก-จ]\\)?(?![\\u0E00-\\u0E7F])',
  'ตอบ\\s*[A-E](?![A-Za-z0-9])',
  // "ยาตัวเลือกแรก", "ไม่ใช่ตัวเลือกแรก" and "เป็นตัวเลือกแรก" mean a drug or
  // diet of first choice, not an option on the screen.
  '(?<!ยา|ไม่ใช่|เป็น)ตัวเลือก(?:แรก|ที่\\s*(?:หนึ่ง|สอง|สาม|สี่|ห้า|[1-5](?!\\d))|สุดท้าย|ท้าย)',
  '(?:สอง|สาม)ตัวเลือก(?:แรก|ท้าย)',
  // Only as its own word: "ปัจจัยโน้มนำข้อแรกคือ" and "คำถามข้อแรก" count items
  // of a list the explanation is teaching, not options.
  '(?:^|\\s|สอง|สาม|และ|ส่วน)ข้อ(?:แรก|สุดท้าย)(?=\\s*(?:ผิด|ถูก|เป็น|คือ|สลับ|ไม่|,|$))',
  // "คือข้อแรกของการซักประวัติ" is the first step of a history, not an option.
  'คือข้อ(?:แรก|สุดท้าย)(?!ของ|ที่|ใน)',
  '(?:เหมือน|เลือก)ข้อ(?:แรก|สุดท้าย)',
  '\\b(?:first|second|third|last) option\\b',
].join('|'), 'i');

const isShuffledChoice = (q) => Array.isArray(q?.options) && q.options.length > 1 && q.noShuffle !== true;

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
    if (field === 'explain' && isShuffledChoice(q)) {
      const i = text.search(OPTION_POSITION);
      if (i >= 0) {
        out.push({
          field,
          rule: 'option-position',
          why: 'names an option by letter or position on a row whose options shuffle',
          quote: text.slice(Math.max(0, i - 45), i + 95).replace(/\s+/g, ' '),
        });
      }
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
  const rules = [...RULES.map(([k, , w]) => [k, w]), ['option-position', 'names an option by letter or position on a row whose options shuffle']];

  console.log(`scanned ${scanned} explanations and model answers in ${banks.length} banks`);
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
