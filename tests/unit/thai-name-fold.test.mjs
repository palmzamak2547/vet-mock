// Faculty search had no tolerance for Thai spelling: "อนุวัฒน์" found nobody
// for the record spelled "อนุวัตน์" (screens hunt, 11 Nov 2026). The second
// pass (src/lib/thai-name-fold.js) folds look-alike finals, tone marks and
// silent letters, and runs only when the exact pass finds nobody.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ALL_INSTRUCTORS } from '../../src/data/instructors.js';
import { foldThaiName, twoPassSearch, looseThaiMatch } from '../../src/lib/thai-name-fold.js';

// Built as FacultyView builds them (pinned below).
const entries = ALL_INSTRUCTORS.map((ins) => ({
  ins,
  _hayLc: [ins.nameEn, ins.nameTh, ins.position, ins.department, ins.institution, ins.nickname,
    ...(ins.aliases || []), ...(ins.areas || [])].filter(Boolean).join(' ').toLowerCase(),
  _looseHay: foldThaiName([ins.nameTh, ins.nickname, ...(ins.aliases || [])].filter(Boolean).join(' ')),
}));

// Common misspellings: what a student types, and the record it means.
const MISSPELLINGS = [
  ['อนุวัฒน์', 'อนุวัตน์ วิรัชสุดากุล'],
  ['อดิสร', 'อดิศร อดิเรกถาวร'],
  ['จีรวัตน์', 'จีรวัฒน์ สุนทรสิต'],
  ['อนุศักด์', 'อนุศักดิ์ กิจถาวรรัตน์'],
  ['บุญฤทธ์', 'บุญฤทธิ์ ทองทรง'],
  ['เดชฤทธ์', 'เดชฤทธิ์ นิลอุบล'],
  ['ณัฐพงษ์ คำ', 'ณัฐพงศ์ คำประเสริฐ'],
  ['กิตติพงศ์ ทา', 'กิตติพงษ์ ทาจำปา'],
  ['กัญจณ์', 'กัญจน์ แก้วมงคล'],
  ['อาภรน์', 'อาภรณ์ ลี้สมบุญ'],
  ['กมลพรรน', 'กมลพรรณ เจริญกุล'],
  ['ชาญนรงค์', 'ชาญณรงค์ รอดคำ'],
  ['เกียรติพิเชฐ', 'เกียรติพิเชษฐ์ โคมิน'],
  ['ไชยยันท์', 'ไชยยันต์ เกษรดอกบัว'],
  ['กองเกียรติ ศรี', 'ก้องเกียรติ ศรีสุวัฒนาสกุล'],
  ['นำผึง', 'น้ำผึ้ง สื่อมโนธรรม'],
  ['ลีสมบุญ', 'อาภรณ์ ลี้สมบุญ'],
  ['ตนธีรวงษ์', 'อัญญรัตน์ ต้นธีรวงศ์'],
  ['กรมิศฐ์', 'กรมิษฐ์ เจนจิรวัฒน์'],
  ['รัตนสรีสมพร', 'จตุพร รัตนศรีสมพร'],
  ['วงษ์สนิท', 'จตุรงค์ วงศ์สนิท'],
  ['จารุญลักษน์', 'จารุญลักษณ์ จิรภัทรเศรษฐ์'],
];

test('the directory still has its 310 names', () => {
  assert.equal(entries.length, 310);
  assert.equal(entries.filter((e) => e.ins.nameTh).length, 310);
});

test('the reported case: อนุวัฒน์ finds อนุวัตน์, and says it was the near pass', () => {
  const { hits, loose } = twoPassSearch(entries, 'อนุวัฒน์');
  assert.equal(loose, true);
  assert.deepEqual(hits.map((e) => e.ins.nameTh), ['อนุวัตน์ วิรัชสุดากุล']);
  assert.equal(twoPassSearch(entries, 'anuwat').loose, false);
});

test('every name finds itself, by the exact pass, and folds onto itself', () => {
  for (const e of entries) {
    const { hits, loose } = twoPassSearch(entries, e.ins.nameTh);
    assert.equal(loose, false, e.ins.nameTh);
    assert.ok(hits.includes(e), e.ins.nameTh);
    assert.ok(looseThaiMatch(e.ins.nameTh, e.ins.nameTh), e.ins.nameTh);
  }
});

test('twenty-odd common misspellings each find their record and no stranger', () => {
  let extra = 0;
  for (const [typed, meant] of MISSPELLINGS) {
    const exact = entries.filter((e) => e._hayLc.includes(typed.toLowerCase()));
    assert.equal(exact.length, 0, `${typed} is not a misspelling: the exact pass finds it`);
    const { hits, loose } = twoPassSearch(entries, typed);
    assert.equal(loose, true, typed);
    assert.ok(hits.some((e) => e.ins.nameTh === meant), `${typed} does not find ${meant}`);
    extra += hits.length - 1;
  }
  assert.ok(MISSPELLINGS.length >= 20);
  assert.equal(extra, 0, `the misspellings pulled in ${extra} other people`);
});

test('across all names, the near pass adds few hits', () => {
  // For every first name and every full name: what the folded key matches
  // beyond what the exact text matches. Printed for the release notes.
  let extraFull = 0;
  let extraFirst = 0;
  let firstNames = 0;
  for (const e of entries) {
    const full = e.ins.nameTh;
    const first = full.replace(/^.*\./, '').split(/\s+/)[0];
    const fold = (q) => entries.filter((x) => (' ' + x._looseHay).includes(' ' + foldThaiName(q))).length;
    const exact = (q) => entries.filter((x) => x._hayLc.includes(q.toLowerCase())).length;
    extraFull += Math.max(0, fold(full) - exact(full));
    if (first.length >= 3) { firstNames += 1; extraFirst += Math.max(0, fold(first) - exact(first)); }
  }
  console.log(`near pass extra hits: ${extraFull} over ${entries.length} full names, ${extraFirst} over ${firstNames} first names`);
  assert.ok(extraFull <= 5, `full names: ${extraFull} extra hits`);
  assert.ok(extraFirst <= 30, `first names: ${extraFirst} extra hits`);
});

test('Latin queries never take the near pass', () => {
  assert.deepEqual(twoPassSearch(entries, 'zzqx'), { hits: [], loose: false });
});

test('FacultyView builds the folded names and searches through the two passes', () => {
  const src = readFileSync(new URL('../../src/views/FacultyView.jsx', import.meta.url), 'utf8');
  assert.match(src, /_looseHay: foldThaiName\(\[ins\.nameTh, ins\.nickname, \.\.\.\(ins\.aliases \|\| \[\]\)\]\.filter\(Boolean\)\.join\(' '\)\)/);
  assert.match(src, /twoPassSearch\(pool, q\)/);
  assert.match(src, /ไม่มีชื่อที่สะกดตรงกัน จึงแสดงชื่อที่สะกดใกล้เคียง/);
});
