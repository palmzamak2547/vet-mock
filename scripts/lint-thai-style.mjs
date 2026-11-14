#!/usr/bin/env node
// ============================================================
// lint-thai-style.mjs — Thai that reads as translated, stiff or hyped
// ============================================================
// Usage: node scripts/lint-thai-style.mjs [--list] [--rule <id>] [--write]
//
// docs/THAI-STYLE.md is the house style for every Thai word a student reads.
// This lint holds the part of it a pattern can judge without a reader: a
// short list of phrases that, in an interface, almost always have a plainer
// form. Palm, 14 Nov 2026: Thai that is real language, with nothing odd and
// nothing machine-sounding in it, and nothing overdone ("ไม่เวอ้เว้อเกิน").
//
// It reads the same strings lint:ui-copy reads (src/views, src/components,
// src/lib, src/hooks, src/App.jsx, src/main.jsx, src/data/og-covers.js) and
// the student-facing data files below, through lint:ui-copy's extractStrings,
// so the same text is left out: patterns, console output, comments, and
// anything under a content key (explain, why, source, quote ...). Quoted
// lecture text under vetwiki/ and generated files are not read.
//
// Each rule is counted per file and recorded in docs/thai-style-budget.json.
// A file over its number fails; a file with no row may have none. --write
// lowers the numbers after a cleanup and never raises one. Rules at zero
// everywhere today are written into the budget as nothing at all, so they
// already stop the first offender.
//
// A rule earns a place here only if nearly every hit is worth fixing. Taste
// (a long sentence, "ของคุณ" where the reader is obvious, an emoji that might
// be an icon) stays in the guide and in a reader's review, not in this gate.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractStrings, SCANNED as UI_SCANNED } from './lint-ui-copy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const BUDGET_FILE = 'docs/thai-style-budget.json';
export const SCANNED = [...UI_SCANNED, 'src/data/changelog', 'src/data/how-to.js'];
const EXCLUDED_FILES = /generated|vetwiki\/|tts-phonetic|\.test\./;
const LOG_CALL = /^(skip)?call:(console|logger)\b|\.(console|logger)\./;
const NOTE = 'lint:thai-style budgets, per rule and per file (docs/THAI-STYLE.md). A number may only go down; a file with no row may have none. node scripts/lint-thai-style.mjs --list prints every hit with its plain form; --write lowers the numbers after a cleanup.';

// Thai letters, so a rule can ask "inside a Thai word" or "after Thai".
const TH = '\\u0E00-\\u0E7F';

/**
 * The rules. Each has an id, a pattern, the plain form, and the section of
 * docs/THAI-STYLE.md that explains it. Patterns are written to stay silent on
 * the ordinary Thai that shares their letters; the unit test holds both sides.
 */
export const RULES = [
  {
    id: 'tham-kan',
    // "ทำการลบ" is "ลบ". Not การ์ด (ทำการ์ด, a card) and not ทำการบ้าน.
    re: new RegExp(`ทำการ(?!์|บ้าน)(?=[${TH}])`),
    fix: 'ตัด "ทำการ" ออก ใช้คำกริยาตรงๆ: "ทำการบันทึก" เป็น "บันทึก"',
    section: '2.1',
  },
  {
    id: 'mii-kan-event',
    // "มีการเปลี่ยนแปลง" is "เปลี่ยน". Only the nominalised interface events;
    // "ไม่มีการคุมสอบ" and "มีการติดเชื้อ" are ordinary Thai and are left alone.
    re: /มีการ(?:เปลี่ยนแปลง|เพิ่ม|แก้ไข|อัปเดต|ลบ|บันทึก|ส่ง|ซิงก์|ใช้งาน|ดำเนินการ)/,
    fix: 'ใช้กริยาตรงๆ: "มีการเปลี่ยนแปลง" เป็น "เปลี่ยน", "เมื่อมีการเพิ่ม" เป็น "เมื่อเพิ่ม"',
    section: '2.2',
  },
  {
    id: 'in-order-to',
    re: /ในการที่จะ|เพื่อที่จะ|ในการที่/,
    fix: '"เพื่อที่จะ" เป็น "เพื่อ" หรือตัดทิ้ง, "ในการที่จะ" เป็น "จะ" หรือ "ถ้าจะ"',
    section: '2.3',
  },
  {
    id: 'samart-dai',
    // "สามารถ...ได้" says ได้ twice. Not ความสามารถ, the noun.
    re: /(?<!ความ)สามารถ/,
    fix: 'ตัด "สามารถ" เหลือ "...ได้": "ไม่สามารถกู้คืนได้" เป็น "กู้คืนไม่ได้"',
    section: '2.4',
  },
  {
    id: 'passive-thuk',
    // A neutral event in the passive ("ถูกบันทึก", "ถูกส่ง"). ถูก stays for
    // something done TO the reader or their work against their wish, and
    // ถูกต้อง / ถูกผิด / ถูกใจ are not passives at all. Verbs that can follow
    // ถูก meaning "correct" are left out: "ตอบถูกเพิ่มขึ้น", "ถูกตั้งแต่ครั้งแรก",
    // and "ชื่อนี้ถูกใช้แล้ว" is the ordinary way to say a name is taken.
    re: /ถูก(?:บันทึก|ส่ง(?!ผล)|เก็บ|ดึง|ซิงก์|อัปเดต|สร้าง|คัดลอก|นำเข้า|ส่งออก|ย้าย|โหลด)/,
    fix: 'เขียนแบบประโยคกรรมวาจกตรงๆ: "จะถูกเก็บไว้" เป็น "เก็บไว้ให้", "ข้อความถูกส่งไปที่" เป็น "ส่งข้อความไปที่"',
    section: '2.5',
  },
  {
    id: 'essay-connector',
    // Essay glue in an interface. A screen states the next thing; it does not
    // argue. อย่างไรก็ดี and โดยสรุป are the same family.
    re: /อย่างไรก็ตาม|อย่างไรก็ดี|นอกจากนี้|ทั้งนี้|อนึ่ง|กล่าวคือ|ดังนั้นจึง|โดยสรุป|ในส่วนของ/,
    fix: 'ตัดคำเชื่อม แยกเป็นประโยคใหม่ หรือใช้ "แต่", "และ", "เลย"',
    section: '2.6',
  },
  {
    id: 'please',
    // "กรุณา"/"โปรด" in front of the action reads like a government form.
    // The app asks plainly ("ลองใหม่อีกครั้ง"). Not รายการโปรด (favourites),
    // ของโปรด, ที่โปรด or โปรดปราน.
    re: /กรุณา|(?<!รายการ|ของ|ที่|สุด|เพลง)โปรด(?!ปราน|แกรม|ไฟล์|ักษ์)/,
    fix: 'ตัด "กรุณา"/"โปรด" ขึ้นต้นด้วยกริยา: "กรุณาลองใหม่" เป็น "ลองใหม่อีกครั้ง"',
    section: '2.7',
  },
  {
    id: 'riap-roi',
    // "บันทึกเรียบร้อยแล้ว" is "บันทึกแล้ว". Not ความเรียบร้อย, the noun.
    re: /(?<!ความ)เรียบร้อย/,
    fix: 'ตัด "เรียบร้อย": "บันทึกเรียบร้อยแล้ว" เป็น "บันทึกแล้ว"',
    section: '2.8',
  },
  {
    id: 'dam-noen-kan',
    re: /ดำเนินการ/,
    fix: 'ใช้กริยาของสิ่งที่ทำจริง: "ดำเนินการต่อด้วย Google" เป็น "ไปต่อด้วย Google"',
    section: '2.9',
  },
  {
    id: 'hype',
    // Praise that shouts. A result says what happened and the next step.
    re: /สุดยอด|ยอดเยี่ยม|เก่งสุดๆ|เก่งมาก|เทพ!|สู้ๆ|สู้ ๆ|ลุยเลย|ลุยต่อ|ปังมาก|ว้าว|เจ๋ง/,
    fix: 'บอกผลที่เกิดและขั้นต่อไปแทนคำชม: "สุดยอดมากเลย!" เป็น "ถูก 18 จาก 20 ข้อ ทวนข้อที่ผิดต่อได้"',
    section: '3.4',
  },
  {
    id: 'thai-exclamation',
    // An exclamation mark straight after Thai. Routine events are not news.
    re: new RegExp(`[${TH}]\\s?!(?!=)`),
    fix: 'ตัด "!" ออก งานปกติไม่ต้องตื่นเต้น',
    section: '3.4',
  },
];

/** The rules each string breaks, as [{ rule, token }]. */
export function ruleHits(text) {
  const hits = [];
  for (const rule of RULES) {
    const m = text.match(rule.re);
    if (m) hits.push({ rule: rule.id, token: m[0] });
  }
  return hits;
}

/** Every hit in one module's strings. */
export function findIssues(records) {
  const out = [];
  for (const r of records) {
    if (r.pattern || r.content || LOG_CALL.test(r.ctx) || r.ctx.startsWith('skipcall:')) continue;
    if (!/[฀-๿]/.test(r.text)) continue;
    for (const hit of ruleHits(r.text)) out.push({ ...r, ...hit });
  }
  return out;
}

function listFiles(root) {
  const files = [];
  const walk = (p) => {
    if (!fs.existsSync(p)) return;
    const stat = fs.statSync(p);
    if (stat.isFile()) {
      if (/\.(jsx?|mjs)$/.test(p)) files.push(p);
      return;
    }
    for (const name of fs.readdirSync(p).sort()) walk(path.join(p, name));
  };
  for (const entry of SCANNED) walk(path.join(root, entry));
  return files;
}

export function readBudget(root = ROOT) {
  const file = path.join(root, BUDGET_FILE);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

/** Scan the tree and compare each rule's per-file counts with the budget. */
export function lintTree({ root = ROOT, budget = readBudget(root) } = {}) {
  const hits = [];
  for (const abs of listFiles(root)) {
    const file = path.relative(root, abs).split(path.sep).join('/');
    if (EXCLUDED_FILES.test(file)) continue;
    hits.push(...findIssues(extractStrings(fs.readFileSync(abs, 'utf8'), file)));
  }
  const counts = {};
  for (const rule of RULES) counts[rule.id] = {};
  for (const h of hits) counts[h.rule][h.file] = (counts[h.rule][h.file] || 0) + 1;
  return { hits, counts, ...compareBudget(counts, budget) };
}

/** Which files are over their budget, and which rows could be lowered. */
export function compareBudget(counts, budget) {
  const over = [];
  const lowered = [];
  for (const rule of RULES) {
    const caps = budget?.rules?.[rule.id] || {};
    for (const [file, n] of Object.entries(counts[rule.id])) if (n > (caps[file] ?? 0)) over.push({ rule: rule.id, file, n, cap: caps[file] ?? 0 });
    for (const [file, cap] of Object.entries(caps)) if ((counts[rule.id][file] || 0) < cap) lowered.push({ rule: rule.id, file, n: counts[rule.id][file] || 0, cap });
  }
  return { over, lowered, ok: over.length === 0 };
}

/** New caps: never above the old ones, zero rows dropped. With no budget yet
 *  (the first --write), today's counts become the caps. */
export function lowerBudget(budget, counts) {
  const rules = {};
  for (const rule of RULES) {
    const old = budget?.rules?.[rule.id];
    const next = {};
    for (const [file, n] of Object.entries(counts[rule.id] || {}).sort()) {
      const cap = budget ? Math.min(n, old?.[file] ?? 0) : n;
      if (cap > 0) next[file] = cap;
    }
    rules[rule.id] = next;
  }
  return { note: NOTE, rules };
}

function main() {
  const args = process.argv.slice(2);
  const only = args.includes('--rule') ? args[args.indexOf('--rule') + 1] : null;
  const budget = readBudget();
  const result = lintTree({ budget });
  const byId = Object.fromEntries(RULES.map((r) => [r.id, r]));
  const where = (h) => `  ${h.file}:${h.line}  [${h.rule}: ${h.token}]  ${h.text.replace(/\s+/g, ' ').slice(0, 120)}`;
  if (args.includes('--list')) {
    for (const h of result.hits) if (!only || h.rule === only) console.log(where(h));
  }
  if (args.includes('--write')) {
    const next = lowerBudget(budget, result.counts);
    fs.writeFileSync(path.join(ROOT, BUDGET_FILE), `${JSON.stringify(next, null, 2)}\n`);
    const total = Object.values(next.rules).reduce((a, caps) => a + Object.values(caps).reduce((x, y) => x + y, 0), 0);
    console.log(`lint:thai-style — wrote ${BUDGET_FILE}: ${total} hits within budget`);
    return;
  }
  if (!budget) {
    console.error(`lint:thai-style — ${BUDGET_FILE} is missing; run node scripts/lint-thai-style.mjs --write once to record it.`);
    process.exitCode = 1;
    return;
  }
  if (!result.ok) {
    console.error('lint:thai-style — new Thai that reads as translated, stiff or hyped (docs/THAI-STYLE.md):');
    for (const { rule, file, n, cap } of result.over) {
      console.error(`  ${file}: ${rule} ${n} > budget ${cap}. ${byId[rule].fix} (THAI-STYLE ${byId[rule].section})`);
      result.hits.filter((h) => h.rule === rule && h.file === file).forEach((h) => console.error(`  ${where(h)}`));
    }
    process.exitCode = 1;
    return;
  }
  const summary = RULES.map((r) => `${r.id} ${result.hits.filter((h) => h.rule === r.id).length}`).join(', ');
  console.log(`lint:thai-style — OK, within budget (${summary})`);
  if (result.lowered.length) {
    console.log(`  ${result.lowered.length} row(s) are under budget; run node scripts/lint-thai-style.mjs --write to lower them.`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
