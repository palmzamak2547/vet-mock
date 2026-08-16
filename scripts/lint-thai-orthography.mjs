#!/usr/bin/env node
// ============================================================
// lint-thai-orthography.mjs — find Thai that cannot be read
// ============================================================
// Usage: node scripts/lint-thai-orthography.mjs [--all]
//
// Catches BROKEN ENCODING: a tone mark or thanthakhat must sit on a consonant
// (optionally through a dependent vowel), and a leading vowel must be followed
// by a consonant. Text mangled by a bad PDF layer breaks those rules at a rate
// real Thai never does — which is the failure CLAUDE.md warns about when
// pdftotext reorders Thai vowels during ingestion. Currently 0 across all 4,507
// questions, so it is an ingestion gate, not a cleanup task.
//
// ⚠️ It does NOT catch the corruption that prompted it. #8039 reads:
//
//   "มีประจ้ำเป็นก้อนใหญ่ ผังออกจากปลายลึงจะ บริเวณคบลกหัวลูก … พระวาเทิน
//    การีอินส่งกู่เพราะที่กรืในที่ลึงมีอะไหล่ทอนใจ"
//
// Every syllable there is legal Thai; the sentence means nothing. It scores
// 0.78 violations per 100 characters, below ordinary text. Thai word
// segmentation does no better — it ranks that question 380th of 3,109, behind
// clean questions full of short function words. Semantically-corrupt-but-
// spellable text is found by a reader, and claiming otherwise here would make
// this a gate that lies. tests/unit/thai-orthography.test.mjs pins both the
// silence on real Thai and this limit.
//
// The score is violations per 100 Thai characters, so a long question is not
// punished for length.
// ============================================================

import { bankFiles, readBank } from './lib/bank-file.mjs';

const CONS = /[ก-ฮ]/;
// Every dependent vowel a tone mark can sit above, ABOVE and BELOW the line.
// Leaving out the below vowels ุ and ู made "อยู่" and "คู่" — two of the most
// common words in Thai — read as violations, which is how a first run put
// perfectly clean questions at the top of the report.
const DEP_VOWEL = /[ัิีึื็ํฺุู]/;
const TONE = /[่้๊๋์]/;
const LEAD_VOWEL = /[เแโใไ]/;
const THAI = /[฀-๿]/;

export function orthographyViolations(text) {
  const s = String(text || '');
  const bad = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (TONE.test(c)) {
      // walk back over an upper vowel, then require a consonant
      let j = i - 1;
      if (j >= 0 && DEP_VOWEL.test(s[j])) j--;
      if (j < 0 || !CONS.test(s[j])) { bad.push(`tone mark on nothing @${i}`); continue; }
      // two tone marks in a row never happens
      if (i + 1 < s.length && TONE.test(s[i + 1])) bad.push(`double tone mark @${i}`);
    }
    if (LEAD_VOWEL.test(c)) {
      const n = s[i + 1];
      if (n && THAI.test(n) && !CONS.test(n)) bad.push(`leading vowel not followed by a consonant @${i}`);
    }
    if (DEP_VOWEL.test(c)) {
      const p = s[i - 1];
      if (!p || !CONS.test(p)) bad.push(`upper vowel on nothing @${i}`);
    }
  }
  const thaiChars = (s.match(/[฀-๿]/g) || []).length;
  return { count: bad.length, per100: thaiChars ? (100 * bad.length) / thaiChars : 0, thaiChars, examples: bad.slice(0, 3) };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('lint-thai-orthography.mjs')) {
  const ALL = process.argv.includes('--all');
  const rows = [];
  for (const f of bankFiles()) {
    const { questions } = await readBank(f);
    for (const q of questions) {
      const text = [q.q, ...(q.options || [])].join(' ');
      const v = orthographyViolations(text);
      if (v.thaiChars < 40) continue;
      if (v.count === 0) continue;
      rows.push({ id: q.id, subject: q.subject, bank: f.split(/[\\/]/).pop(), ...v, stem: String(q.q).replace(/\s+/g, ' ').slice(0, 90) });
    }
  }
  rows.sort((a, b) => b.per100 - a.per100);
  const show = ALL ? rows : rows.filter((r) => r.per100 >= 0.5);
  for (const r of show) {
    console.log(`${r.per100.toFixed(2).padStart(5)} /100ch  ${String(r.count).padStart(3)} bad  #${r.id} [${r.subject}]`);
    console.log(`                        ${r.stem}`);
  }
  console.log(`\n${rows.length} question(s) contain at least one violation; ${show.length} above the reporting threshold`);
  console.log('Every one still needs eyes — this finds candidates, it does not judge meaning.');
}
