// Writes the example datasets under src/data/examples/ [M2-DESIGN.md 11.4; competitor-gaps.md D7].
// Every example is made-up data (ข้อมูลสมมุติ), drawn from PCG32 (O'Neill 2014, pcg32 of pcg-c-basic,
// seeded as pcg32_srandom_r(seed, stream); M2-DESIGN.md 7) with the seed and stream written into the
// file, so anyone can redraw it. The numbers are rounded as a person would type them (grams as whole
// numbers, kilograms to 0.1, degrees to 0.1). The generator is its own small PCG32 (checked against the
// reference output of pcg32-demo in tests/unit/trust-examples.test.mjs), not lib/plan/random.js, so the
// examples never change when the planning tools do.
//
//   node scripts/make-examples.mjs          write src/data/examples/*.js
//   node scripts/make-examples.mjs --check  exit 1 when a written file differs from what the seeds give
//
// OWNER: trust role.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = path.join(root, 'src', 'data', 'examples');

// ---- PCG32 ---------------------------------------------------------------------------------------
const MASK64 = (1n << 64n) - 1n;
const MULT = 6364136223846793005n;
export const STREAM = 54;

/**
 * pcg32_random_r with pcg32_srandom_r(seed, stream) seeding.
 * @param {number} seed @param {number} [stream]
 */
export function pcg32(seed, stream = STREAM) {
  let state = 0n;
  const inc = ((BigInt(stream) << 1n) | 1n) & MASK64;
  const next = () => {
    const old = state;
    state = (old * MULT + inc) & MASK64;
    const xorshifted = Number((((old >> 18n) ^ old) >> 27n) & 0xffffffffn);
    const rot = Number(old >> 59n);
    return ((xorshifted >>> rot) | (xorshifted << ((32 - rot) & 31))) >>> 0;
  };
  next();
  state = (state + BigInt(seed)) & MASK64;
  next();
  /** uniform in (0, 1) */
  const uniform = () => (next() + 0.5) / 4294967296;
  /** integer in [0, n) without modulo bias (pcg32_boundedrand_r) */
  const bounded = (n) => {
    const threshold = (4294967296 - n) % n;
    for (;;) {
      const r = next();
      if (r >= threshold) return r % n;
    }
  };
  /** standard normal, Box-Muller (cosine branch only; one pair of draws per value) */
  const normal = () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform());
  /** Fisher-Yates from the last index down, in place */
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = bounded(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  return { next, uniform, bounded, normal, shuffle };
}

// ---- helpers -------------------------------------------------------------------------------------
const pad = (n, w) => String(n).padStart(w, '0');
const fixed = (x, d) => {
  const s = x.toFixed(d);
  return s === `-${(0).toFixed(d)}` ? (0).toFixed(d) : s;
};
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

/** @param {string[]} header @param {(string|number)[][]} rows */
function toCsv(header, rows) {
  const cell = (v) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return `${[header, ...rows].map((r) => r.map(cell).join(',')).join('\n')}\n`;
}

/**
 * A codebook hint per column, in the shape of the project's codebook entries (lib/runtime/types.js
 * CodebookEntry) so the import can apply it by column name.
 */
function col(name, labelTh, labelEn, type, extra = {}) {
  return {
    name, labelTh, labelEn, type,
    role: extra.role || 'none',
    level: extra.level || 'animal',
    unit: extra.unit || null,
    levels: extra.levels || [],
    reference: extra.reference ?? null,
    positive: extra.positive ?? null,
    range: extra.range || null,
    missingNote: extra.missingNote || null,
  };
}
const lv = (value, labelTh, labelEn) => ({ value, labelTh, labelEn });

// ---- the examples --------------------------------------------------------------------------------

/** Two-way feed trial: three diets x sex, 8 broilers per cell, weight gain over 21 days. */
function feedTrial(seed) {
  const rng = pcg32(seed);
  const cells = [];
  for (const sex of ['ผู้', 'เมีย']) for (const diet of ['A', 'B', 'C']) for (let k = 0; k < 8; k++) cells.push({ diet, sex });
  rng.shuffle(cells);
  const dietMean = { A: 780, B: 812, C: 846 };
  const rows = cells.map((c, i) => {
    const mu = dietMean[c.diet] + (c.sex === 'ผู้' ? 58 : 0) + (c.diet === 'C' && c.sex === 'ผู้' ? 22 : 0);
    return [`B${pad(i + 1, 2)}`, c.diet, c.sex, Math.round(mu + 36 * rng.normal())];
  });
  return {
    files: [{ fileName: 'feed-trial.csv', csv: toCsv(['bird_id', 'diet', 'sex', 'gain_g'], rows) }],
    codebook: [
      col('bird_id', 'รหัสไก่', 'Bird ID', 'id', { role: 'id' }),
      col('diet', 'สูตรอาหาร', 'Diet', 'nominal', {
        role: 'exposure', reference: 'A',
        levels: [lv('A', 'สูตรควบคุม', 'Control diet'), lv('B', 'เสริมยีสต์ 0.1%', 'Yeast 0.1%'), lv('C', 'เสริมยีสต์ 0.2%', 'Yeast 0.2%')],
      }),
      col('sex', 'เพศ', 'Sex', 'binary', { role: 'group', levels: [lv('ผู้', 'เพศผู้', 'Male'), lv('เมีย', 'เพศเมีย', 'Female')], reference: 'เมีย' }),
      col('gain_g', 'น้ำหนักที่เพิ่มขึ้นใน 21 วัน', 'Weight gain over 21 days', 'continuous', { role: 'outcome', unit: 'g', range: { min: 400, max: 1400 } }),
    ],
    planted: [],
  };
}

/** Repeated weighings of weaned piglets, wide as people type it; one piglet misses the last weighing. */
function growth(seed) {
  const rng = pcg32(seed);
  const groups = rng.shuffle(['ควบคุม', 'ควบคุม', 'ควบคุม', 'ควบคุม', 'ควบคุม', 'ควบคุม', 'เสริม', 'เสริม', 'เสริม', 'เสริม', 'เสริม', 'เสริม']);
  const control = [0, 3.0, 6.6, 10.8];
  const extra = [0, 0.3, 0.7, 1.1];
  const rows = groups.map((g, i) => {
    const pig = 7.0 + 0.6 * rng.normal();
    const w = control.map((c, t) => fixed(pig + c + (g === 'เสริม' ? extra[t] : 0) + 0.35 * rng.normal(), 1));
    return [`P${pad(i + 1, 2)}`, g, ...w];
  });
  const lost = 8; // P09: the last weighing was not recorded
  rows[lost][5] = '';
  return {
    files: [{ fileName: 'piglet-growth.csv', csv: toCsv(['pig_id', 'group', 'wt_w0', 'wt_w2', 'wt_w4', 'wt_w6'], rows) }],
    codebook: [
      col('pig_id', 'รหัสลูกสุกร', 'Piglet ID', 'id', { role: 'id' }),
      col('group', 'กลุ่ม', 'Group', 'binary', {
        role: 'exposure', reference: 'ควบคุม',
        levels: [lv('ควบคุม', 'อาหารปกติ', 'Usual feed'), lv('เสริม', 'เสริมกรดอินทรีย์ในอาหาร', 'Organic acids added to the feed')],
      }),
      ...[0, 2, 4, 6].map((w) => col(`wt_w${w}`, `น้ำหนักสัปดาห์ที่ ${w} หลังหย่านม`, `Weight at week ${w} after weaning`, 'continuous', {
        role: 'outcome', unit: 'kg', range: { min: 3, max: 30 },
        missingNote: w === 6 ? 'P09' : null,
      })),
    ],
    planted: [{ row: 'P09', column: 'wt_w6', what: 'missing' }],
  };
}

/** Calves followed for their first 90 days; colostrum within 6 hours or later. */
function calves(seed) {
  const rng = pcg32(seed);
  const groups = rng.shuffle([...Array(40).fill('ภายใน 6 ชม.'), ...Array(40).fill('หลัง 6 ชม.')]);
  const rows = groups.map((g, i) => {
    const hazard = g === 'ภายใน 6 ชม.' ? 0.0016 : 0.0045;
    const death = -Math.log(rng.uniform()) / hazard;
    const sold = -Math.log(rng.uniform()) / 0.0022;
    const sex = rng.bounded(2) === 0 ? 'ผู้' : 'เมีย';
    const bw = fixed(38 + 4 * rng.normal() + (sex === 'ผู้' ? 2 : 0), 1);
    const end = Math.min(death, sold, 90);
    const days = Math.max(1, Math.ceil(end));
    const status = end === death ? 'ตาย' : 'มีชีวิต';
    const reason = end === death ? '' : end === sold ? 'ขายออก' : 'ครบ 90 วัน';
    return [`C${pad(i + 1, 2)}`, g, sex, bw, days, status, reason];
  });
  return {
    files: [{ fileName: 'calf-survival.csv', csv: toCsv(['calf_id', 'colostrum', 'sex', 'birth_wt_kg', 'days', 'status', 'end_reason'], rows) }],
    codebook: [
      col('calf_id', 'รหัสลูกโค', 'Calf ID', 'id', { role: 'id' }),
      col('colostrum', 'เวลาที่ได้นมน้ำเหลืองครั้งแรก', 'First colostrum', 'binary', {
        role: 'exposure', reference: 'ภายใน 6 ชม.',
        levels: [lv('ภายใน 6 ชม.', 'ภายใน 6 ชั่วโมงหลังคลอด', 'Within 6 hours of birth'), lv('หลัง 6 ชม.', 'หลัง 6 ชั่วโมง', 'After 6 hours')],
      }),
      col('sex', 'เพศ', 'Sex', 'binary', { levels: [lv('ผู้', 'เพศผู้', 'Male'), lv('เมีย', 'เพศเมีย', 'Female')] }),
      col('birth_wt_kg', 'น้ำหนักแรกเกิด', 'Birth weight', 'continuous', { unit: 'kg', range: { min: 20, max: 60 } }),
      col('days', 'จำนวนวันที่ติดตาม (วัน)', 'Days followed', 'count', { role: 'time', range: { min: 1, max: 90 } }),
      col('status', 'สถานะเมื่อสิ้นสุดการติดตาม', 'Status at the end of follow-up', 'binary', {
        role: 'outcome', positive: 'ตาย',
        levels: [lv('ตาย', 'ตาย', 'Died'), lv('มีชีวิต', 'ยังมีชีวิต (ขายออก หรือครบ 90 วัน)', 'Alive (sold, or reached 90 days)')],
      }),
      col('end_reason', 'เหตุที่หยุดติดตามทั้งที่ยังมีชีวิต', 'Why follow-up stopped while alive', 'nominal', {
        levels: [lv('ขายออก', 'ขายออก', 'Sold'), lv('ครบ 90 วัน', 'ครบ 90 วัน', 'Reached 90 days')],
        missingNote: 'blank for calves that died',
      }),
    ],
    planted: [],
  };
}

/** A rapid mastitis test read as a number, the somatic cell count, and milk culture as the truth. */
function rapidTest(seed) {
  const rng = pcg32(seed);
  const status = rng.shuffle([...Array(34).fill('บวก'), ...Array(56).fill('ลบ')]);
  const rows = status.map((s, i) => {
    const pos = s === 'บวก';
    const score = Math.round(clamp((pos ? 63 : 40) + (pos ? 13 : 12) * rng.normal(), 0, 100));
    const scc = Math.round(10 ** ((pos ? 2.72 : 2.36) + 0.34 * rng.normal()));
    return [`M${pad(i + 1, 2)}`, score, scc, s];
  });
  return {
    files: [{ fileName: 'mastitis-rapid-test.csv', csv: toCsv(['cow_id', 'rapid_score', 'scc_k', 'culture'], rows) }],
    codebook: [
      col('cow_id', 'รหัสโค', 'Cow ID', 'id', { role: 'id', level: 'sample' }),
      col('rapid_score', 'ค่าที่อ่านได้จากชุดตรวจเร็ว (0 ถึง 100)', 'Rapid test reading (0 to 100)', 'continuous', { level: 'sample', range: { min: 0, max: 100 } }),
      col('scc_k', 'จำนวนเซลล์โซมาติก (พันเซลล์ต่อ mL)', 'Somatic cell count (thousand cells per mL)', 'continuous', { level: 'sample', range: { min: 1, max: 20000 } }),
      col('culture', 'ผลเพาะเชื้อจากน้ำนม', 'Milk culture', 'binary', {
        role: 'outcome', level: 'sample', positive: 'บวก',
        levels: [lv('บวก', 'พบเชื้อ', 'Growth'), lv('ลบ', 'ไม่พบเชื้อ', 'No growth')],
      }),
    ],
    planted: [],
  };
}

/** Rectal and ear temperature on the same dogs. */
function thermometers(seed) {
  const rng = pcg32(seed);
  const rows = [];
  for (let i = 0; i < 45; i++) {
    const t = 38.7 + 0.55 * rng.normal();
    rows.push([`D${pad(i + 1, 2)}`, fixed(t + 0.08 * rng.normal(), 1), fixed(t - 0.3 + 0.22 * rng.normal(), 1)]);
  }
  return {
    files: [{ fileName: 'dog-thermometers.csv', csv: toCsv(['dog_id', 'rectal_c', 'ear_c'], rows) }],
    codebook: [
      col('dog_id', 'รหัสสุนัข', 'Dog ID', 'id', { role: 'id' }),
      col('rectal_c', 'อุณหภูมิทางทวารหนัก (ปรอทดิจิทัล)', 'Rectal temperature (digital thermometer)', 'continuous', { role: 'rater', unit: '°C', range: { min: 35, max: 42 } }),
      col('ear_c', 'อุณหภูมิทางหู (อินฟราเรด)', 'Ear temperature (infrared)', 'continuous', { role: 'rater', unit: '°C', range: { min: 35, max: 42 } }),
    ],
    planted: [],
  };
}

/** Six Likert items on how confident owners feel about rabies prevention; one answer left blank. */
function questionnaire(seed) {
  const rng = pcg32(seed);
  const loadings = [0.95, 0.85, 0.9, 0.75, 0.85, 0.35];
  const ages = ['18-29', '30-44', '45-59', '60+'];
  const rows = [];
  for (let i = 0; i < 60; i++) {
    const theta = rng.normal();
    const items = loadings.map((l) => Math.round(clamp(3.4 + 1.05 * l * theta + 0.6 * rng.normal(), 1, 5)));
    rows.push([`R${pad(i + 1, 2)}`, ages[rng.bounded(4)], ...items]);
  }
  rows[22][5] = ''; // R23 left item 4 blank
  const items = [
    ['ฉันรู้ว่าสุนัขของฉันควรฉีดวัคซีนพิษสุนัขบ้าเมื่อไร', 'I know when my dog should have its rabies vaccine'],
    ['ฉันพาสุนัขไปฉีดวัคซีนตรงตามนัดได้', 'I can bring my dog for its vaccine on the day it is due'],
    ['ฉันรู้ว่าต้องทำอะไรทันทีถ้าถูกสุนัขกัด', 'I know what to do straight away if a dog bites me'],
    ['ฉันบอกได้ว่าสุนัขตัวไหนควรเฝ้าดูอาการหลังกัดคน', 'I can tell which dog should be watched after it bites someone'],
    ['ฉันมั่นใจว่าจะอธิบายเรื่องพิษสุนัขบ้าให้คนในบ้านฟังได้', 'I could explain rabies to the people I live with'],
    ['ฉันชอบพาสุนัขไปเดินเล่นนอกบ้าน', 'I like taking my dog for walks'],
  ];
  const likert = [
    lv('1', 'ไม่เห็นด้วยอย่างยิ่ง', 'Strongly disagree'), lv('2', 'ไม่เห็นด้วย', 'Disagree'), lv('3', 'เฉย ๆ', 'Neither'),
    lv('4', 'เห็นด้วย', 'Agree'), lv('5', 'เห็นด้วยอย่างยิ่ง', 'Strongly agree'),
  ];
  return {
    files: [{ fileName: 'owner-questionnaire.csv', csv: toCsv(['resp_id', 'age_group', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6'], rows) }],
    codebook: [
      col('resp_id', 'รหัสผู้ตอบ', 'Respondent ID', 'id', { role: 'id', level: 'household' }),
      col('age_group', 'ช่วงอายุผู้ตอบ (ปี)', 'Respondent age (years)', 'ordinal', {
        level: 'household', levels: ages.map((a) => lv(a, a, a)),
      }),
      ...items.map(([th, en], k) => col(`q${k + 1}`, th, en, 'ordinal', {
        level: 'household', levels: likert, range: { min: 1, max: 5 }, missingNote: k === 3 ? 'R23' : null,
      })),
    ],
    planted: [{ row: 'R23', column: 'q4', what: 'missing' }],
  };
}

/** A farm file and an animal file to merge; one animal's farm code was typed with the letter O. */
function mergeFiles(seed) {
  const rng = pcg32(seed);
  const farms = [];
  const animals = [];
  for (let f = 1; f <= 12; f++) {
    const id = `F${pad(f, 2)}`;
    const housing = rng.bounded(2) === 0 ? 'ยกพื้น' : 'ปล่อยแปลง';
    const district = ['ก', 'ข', 'ค'][rng.bounded(3)];
    const herd = 20 + rng.bounded(61);
    farms.push([id, `อำเภอ ${district}`, herd, housing]);
    const farmEffect = 0.9 * rng.normal();
    const logit = -1.6 + (housing === 'ปล่อยแปลง' ? 0.8 : 0) + farmEffect;
    const n = 8 + rng.bounded(9);
    for (let a = 1; a <= n; a++) {
      const age = 6 + rng.bounded(55);
      const p = 1 / (1 + Math.exp(-(logit + 0.012 * (age - 30))));
      const sex = rng.uniform() < 0.8 ? 'เมีย' : 'ผู้';
      animals.push([`${id}-${pad(a, 2)}`, id, age, sex, rng.uniform() < p ? 'บวก' : 'ลบ']);
    }
  }
  const typo = animals.findIndex((r) => r[0] === 'F10-03');
  animals[typo][1] = 'F1O';
  return {
    files: [
      { fileName: 'goat-animals.csv', csv: toCsv(['animal_id', 'farm_id', 'age_months', 'sex', 'elisa'], animals) },
      { fileName: 'goat-farms.csv', csv: toCsv(['farm_id', 'district', 'herd_size', 'housing'], farms) },
    ],
    codebook: [
      col('animal_id', 'รหัสแพะ', 'Goat ID', 'id', { role: 'id' }),
      col('farm_id', 'รหัสฟาร์ม', 'Farm ID', 'nominal', { role: 'cluster', level: 'farm' }),
      col('age_months', 'อายุ (เดือน)', 'Age (months)', 'continuous', { range: { min: 1, max: 180 } }),
      col('sex', 'เพศ', 'Sex', 'binary', { levels: [lv('เมีย', 'เพศเมีย', 'Female'), lv('ผู้', 'เพศผู้', 'Male')] }),
      col('elisa', 'ผล ELISA', 'ELISA result', 'binary', { role: 'outcome', positive: 'บวก', levels: [lv('บวก', 'บวก', 'Positive'), lv('ลบ', 'ลบ', 'Negative')] }),
      col('district', 'อำเภอ', 'District', 'nominal', { level: 'farm' }),
      col('herd_size', 'จำนวนแพะในฟาร์ม (ตัว)', 'Goats on the farm', 'count', { level: 'farm', range: { min: 1, max: 1000 } }),
      col('housing', 'การเลี้ยง', 'Housing', 'binary', {
        role: 'exposure', level: 'farm', reference: 'ยกพื้น',
        levels: [lv('ยกพื้น', 'เลี้ยงในคอกยกพื้น', 'Raised-floor pen'), lv('ปล่อยแปลง', 'ปล่อยแทะเล็มในแปลง', 'Grazed in a paddock')],
      }),
    ],
    planted: [{ row: 'F10-03', column: 'farm_id', what: 'F1O' }],
  };
}

/** The same 30 clinic forms typed twice; the second typist made five mistakes. */
function doubleEntry(seed) {
  const rng = pcg32(seed);
  const a = [];
  for (let i = 1; i <= 30; i++) {
    const sex = rng.bounded(2) === 0 ? 'ผู้' : 'เมีย';
    const age = 1 + rng.bounded(13);
    const weight = fixed(clamp(4 + 26 * rng.uniform() + 2 * rng.normal(), 2, 45), 1);
    const bcs = String(3 + rng.bounded(5));
    const vacc = rng.uniform() < 0.7 ? 'ใช่' : 'ไม่ใช่';
    a.push([`D${pad(i, 3)}`, sex, String(age), weight, bcs, vacc]);
  }
  const b = a.map((r) => [...r]);
  const planted = [];
  const edit = (row, c, value, column) => {
    planted.push({ row: b[row][0], column, a: b[row][c], b: value });
    b[row][c] = value;
  };
  // A weight with two digits swapped, an age typed with a decimal, a body score one off, a sex swapped.
  const w = b[6][3];
  // Two digits swapped (12.4 typed 21.4); a weight like 7.3 or 11.2 loses its decimal point instead.
  const swapped = w.length >= 4 && w[0] !== w[1] && w[1] !== '0' ? `${w[1]}${w[0]}${w.slice(2)}` : w.replace('.', '');
  edit(6, 3, swapped, 'weight_kg');
  edit(11, 2, `${b[11][2]}.0`, 'age_years');
  edit(17, 4, String(Number(b[17][4]) === 9 ? 8 : Number(b[17][4]) + 1), 'bcs');
  edit(23, 1, b[23][1] === 'ผู้' ? 'เมีย' : 'ผู้', 'sex');
  // The key D028 typed as D082 on the second pass.
  planted.push({ row: 'D028', column: 'record_no', a: 'D028', b: 'D082' });
  b[27][0] = 'D082';
  const header = ['record_no', 'sex', 'age_years', 'weight_kg', 'bcs', 'vaccinated'];
  return {
    files: [
      { fileName: 'clinic-forms-typist1.csv', csv: toCsv(header, a) },
      { fileName: 'clinic-forms-typist2.csv', csv: toCsv(header, b) },
    ],
    codebook: [
      col('record_no', 'เลขที่แบบฟอร์ม', 'Form number', 'id', { role: 'id', level: 'visit' }),
      col('sex', 'เพศ', 'Sex', 'binary', { level: 'visit', levels: [lv('ผู้', 'เพศผู้', 'Male'), lv('เมีย', 'เพศเมีย', 'Female')] }),
      col('age_years', 'อายุ (ปี)', 'Age (years)', 'count', { level: 'visit', range: { min: 0, max: 25 } }),
      col('weight_kg', 'น้ำหนัก', 'Weight', 'continuous', { level: 'visit', unit: 'kg', range: { min: 1, max: 90 } }),
      col('bcs', 'คะแนนร่างกาย (1 ถึง 9)', 'Body condition score (1 to 9)', 'ordinal', { level: 'visit', range: { min: 1, max: 9 } }),
      col('vaccinated', 'ฉีดวัคซีนพิษสุนัขบ้าในปีนี้', 'Rabies vaccine this year', 'binary', { level: 'visit', levels: [lv('ใช่', 'ใช่', 'Yes'), lv('ไม่ใช่', 'ไม่ใช่', 'No')] }),
    ],
    planted,
  };
}

/** id, seed and builder of every example. The seeds are arbitrary and fixed; changing one redraws the data. */
export const SPECS = Object.freeze([
  { id: 'feed-trial', seed: 20260928, build: feedTrial },
  { id: 'piglet-growth', seed: 20260929, build: growth },
  { id: 'calf-survival', seed: 20260930, build: calves },
  { id: 'rapid-test', seed: 20261001, build: rapidTest },
  { id: 'thermometers', seed: 20261002, build: thermometers },
  { id: 'questionnaire', seed: 20261003, build: questionnaire },
  { id: 'merge-farms', seed: 20261004, build: mergeFiles },
  { id: 'double-entry', seed: 20261005, build: doubleEntry },
]);

/** @param {typeof SPECS[number]} spec @returns {string} the module text */
export function renderExample(spec) {
  const built = spec.build(spec.seed);
  const [first, second] = built.files;
  const data = {
    id: spec.id,
    madeUp: true,
    generator: { algorithm: 'PCG32 (pcg32_srandom_r, XSH RR)', seed: spec.seed, stream: STREAM, script: 'research/scripts/make-examples.mjs' },
    fileName: first.fileName,
    csv: first.csv,
    second: second || null,
    codebook: built.codebook,
    planted: built.planted,
  };
  return [
    `// GENERATED by scripts/make-examples.mjs from seed ${spec.seed}, PCG32 stream ${STREAM}. Do not edit by hand.`,
    '// Made-up data (ข้อมูลสมมุติ): no animal, farm, owner or clinic in this file exists.',
    `export default ${JSON.stringify(data, null, 1)};`,
    '',
  ].join('\n');
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const check = process.argv.includes('--check');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  let stale = 0;
  for (const spec of SPECS) {
    const file = path.join(outDir, `${spec.id}.js`);
    const text = renderExample(spec);
    const current = existsSync(file) ? readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : null;
    if (check) {
      if (current !== text) {
        console.error(`stale: src/data/examples/${spec.id}.js (run node scripts/make-examples.mjs)`);
        stale++;
      }
    } else {
      writeFileSync(file, text);
      console.log(`wrote src/data/examples/${spec.id}.js`);
    }
  }
  if (check) {
    if (stale) process.exit(1);
    console.log(`examples are current (${SPECS.length} files).`);
  }
}
