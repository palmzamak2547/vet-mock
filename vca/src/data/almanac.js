// How many questions each subject took in the licensing exam, 2558 to 2568 (B.E.), as students
// recalled and sorted them after each sitting. Transcribed as printed in "VCA ALMANAC, CUVET:
// สถิติจำนวนข้อสอบ VCA ปี 58 ถึง 68" (15 ต.ค. 2569), Table 1, which copies the shared sheet
// "รวมมิตร VCA" that eleven cohorts kept in turn. These are not official figures: each year's
// record holds the questions people remembered and could place, about 250 a year (the paper is
// 150 questions a part, two parts, by the faculty's 2569 account; older papers may have differed).
// tests/unit/almanac.test.mjs checks every sum below against the ones printed in the almanac.
//
// A cell is a count; [a, b] where the sheet wrote two counts (Surgery as ortho + soft tissue);
// null where that year holds no record for the subject, which is not zero; a string where the
// sheet wrote words instead of a number ('med': the content was counted under medicine).

export const YEARS = [2558, 2559, 2560, 2561, 2562, 2563, 2564, 2565, 2566, 2567, 2568];
/** The three latest years: the almanac's own window for "what the exam asks now". */
export const RECENT = [2566, 2567, 2568];

export const GROUPS = [
  { id: 'small', th: 'คลินิกสัตว์เล็ก' },
  { id: 'livestock', th: 'ปศุสัตว์' },
  { id: 'avian', th: 'สัตว์ปีก สัตว์น้ำ ม้า' },
  { id: 'exotic', th: 'สัตว์วิเทศและสัตว์ป่า' },
  { id: 'preclinic', th: 'พรีคลินิกและพาราคลินิก' },
  { id: 'public', th: 'สาธารณสุข กฎหมาย สวัสดิภาพ' },
];

/** The almanac's notes, numbered as printed. */
export const NOTES = {
  1: 'Surgery บันทึกเป็น ortho + soft tissue',
  2: 'Hematology (+Cytology) ปี 68 คือ hematology 6 ข้อ และ cytology 2 ข้อ',
  3: 'Bacteriology ปี 67 มี 3 ข้อ และมีเนื้อหาที่ไปอยู่ในวิชา med',
  4: 'Virology ปี 67 และ 68 บันทึกว่าเนื้อหาไปอยู่ในวิชา med จึงไม่มีตัวเลข',
  5: 'Neurology ปี 65 คือ 15 ข้อ รวมกับ Emergency',
  6: 'Nutrition ปี 60 ถึง 63 บันทึกรวมกันทั้งหมด 3 ข้อ ไม่ได้แยกปี',
  7: 'Reproduction in horses ปี 62 ผู้บันทึกไม่แน่ใจว่าเป็นปีนั้น',
  8: 'Ruminant reproduction ปี 67 บันทึกว่าเนื้อหาซ้ำกับ management',
};

const _ = null;

/**
 * Each subject in the almanac's order, with the VCA domain its questions belong to here: one id,
 * one id per part when the cell holds two counts, or null when no domain covers it yet.
 * One health / Food safety is read as one health + food safety, in the order of its name.
 */
export const SUBJECTS = [
  { en: 'Diseases dogs & cats', group: 'small', domain: 'small-animal', y: [37, 32, 32, 26, 23, 20, 40, 21, 11, 13, 19] },
  { en: 'Surgery', group: 'small', domain: 'surgery', note: 1, y: [[4, 11], [1, 10], [2, 18], [7, 8], [1, 12], [3, 14], [9, 10], [15, 21], [8, 8], [8, 5], [6, 8]] },
  { en: 'Repro dogs & cats', group: 'small', domain: 'theriogenology', y: [6, 14, 11, 5, 4, 5, 5, _, 7, 5, 13] },
  { en: 'Anesthesiology', group: 'small', domain: 'surgery', y: [9, 9, 4, 7, 5, 12, 7, 10, 7, 8, 8] },
  { en: 'Neurology', group: 'small', domain: 'neuro-ophtho', note: 5, y: [_, _, _, _, _, _, _, 15, 3, 6, 3] },
  { en: 'Ophthalmology', group: 'small', domain: 'neuro-ophtho', y: [_, _, _, _, _, _, _, _, 5, 3, 2] },
  { en: 'Dermatology', group: 'small', domain: 'small-animal', y: [1, 3, 2, 9, 1, 3, 1, _, 3, 2, 3] },
  { en: 'Emergency', group: 'small', domain: 'small-animal', y: [_, _, _, _, _, _, _, _, 3, 3, _] },

  { en: 'Ruminant medicine', group: 'livestock', domain: 'ruminant', y: [_, _, _, _, _, _, _, _, 19, 14, 14] },
  { en: 'Swine medicine', group: 'livestock', domain: 'swine', y: [_, _, _, _, _, _, _, _, 10, 11, 12] },
  { en: 'Ruminant mgmt & nutrition', group: 'livestock', domain: 'ruminant', y: [_, _, _, _, _, _, _, _, 13, 11, 7] },
  { en: 'Ruminant reproduction', group: 'livestock', domain: 'theriogenology', note: 8, y: [11, 15, 11, 12, 10, 10, 17, 12, 8, 4, 8] },
  { en: 'Swine reproduction', group: 'livestock', domain: 'theriogenology', y: [_, _, 5, 9, 5, 9, 13, 15, 3, 4, 4] },
  { en: 'Nutrition', group: 'livestock', domain: null, note: 6, y: [1, 1, _, _, _, _, 1, 0, 0, 6, 0] },

  { en: 'Avian medicine', group: 'avian', domain: 'avian', y: [11, 8, 18, 21, 18, 22, 26, 20, 14, 9, 21] },
  { en: 'Aquatic medicine', group: 'avian', domain: 'aquatic', y: [8, 6, 6, 13, 14, 21, 19, 11, 7, 13, 14] },
  { en: 'Equine medicine & surgery', group: 'avian', domain: 'equine', y: [11, 10, 5, 12, 15, 19, 19, 14, 8, 10, 11] },
  { en: 'Reproduction in horses', group: 'avian', domain: 'theriogenology', note: 7, y: [3, 1, 1, 2, 3, 4, 4, 3, 7, 0, 4] },

  { en: 'Exotic medicine', group: 'exotic', domain: 'exotic', y: [1, 0, 1, 6, 8, 13, 16, 9, 2, 8, 14] },
  { en: 'Wildlife medicine', group: 'exotic', domain: 'exotic', y: [0, 0, 2, 0, 5, 4, 1, 4, 0, 2, 2] },

  { en: 'Pharmacology', group: 'preclinic', domain: 'pharmacology', y: [_, _, _, _, _, _, _, _, 7, 12, 9] },
  { en: 'Helminthology', group: 'preclinic', domain: 'micro-immuno', y: [1, 4, 5, 4, 6, 11, 11, 12, 8, 9, 8] },
  { en: 'Anatomy', group: 'preclinic', domain: 'anatomy', y: [_, _, _, _, _, _, _, _, 11, 7, 5] },
  { en: 'Hematology (+Cytology)', group: 'preclinic', domain: 'pathology', note: 2, y: [_, _, _, _, _, _, _, _, 3, 8, [6, 2]] },
  { en: 'Radiology', group: 'preclinic', domain: 'imaging', y: [8, 7, 8, 4, 14, 10, 10, 8, 6, 5, 6] },
  { en: 'Pathology', group: 'preclinic', domain: 'pathology', y: [_, _, _, _, _, _, _, _, 4, 8, 3] },
  { en: 'Protozoology', group: 'preclinic', domain: 'micro-immuno', y: [_, _, _, _, _, _, _, _, 8, 3, 3] },
  { en: 'Physiology', group: 'preclinic', domain: null, y: [7, 5, 1, 4, 7, 2, 4, 6, 4, 4, 3] },
  { en: 'Clinical chemistry', group: 'preclinic', domain: 'pathology', y: [_, _, _, _, _, _, _, _, 2, 5, 1] },
  { en: 'Immunology & Vaccinology', group: 'preclinic', domain: 'micro-immuno', y: [0, 12, 9, 7, 8, 4, 10, 8, 5, 2, 1] },
  { en: 'Entomology', group: 'preclinic', domain: 'micro-immuno', y: [0, 0, 1, 1, 0, 2, 3, 3, 0, 4, 4] },
  { en: 'Bacteriology', group: 'preclinic', domain: 'micro-immuno', note: 3, y: [0, 0, 2, 1, 7, 5, 12, 9, 3, 3, 1] },
  { en: 'Mycology', group: 'preclinic', domain: 'micro-immuno', y: [0, 0, 1, 5, 1, 1, 1, 2, 2, 1, 1] },
  { en: 'Virology', group: 'preclinic', domain: 'micro-immuno', note: 4, y: [2, 5, 0, 2, 10, 2, 7, 14, 1, 'med', 'med'] },

  { en: 'Epidemiology', group: 'public', domain: 'epidemiology', y: [6, 8, 0, 10, 8, 6, 20, 9, 12, 6, 13] },
  { en: 'VPH (Milk/Meat/FIQC)', group: 'public', domain: 'food-hygiene', y: [_, _, _, _, _, _, _, _, 10, 12, 7] },
  { en: 'Animal welfare', group: 'public', domain: 'juris', y: [1, 5, 3, 1, 5, 2, 2, 5, 4, 5, 5] },
  { en: 'One health / Food safety', group: 'public', domain: ['zoonoses', 'food-hygiene'], y: [_, _, _, _, _, _, _, _, [1, 1], [3, 1], [4, 1]] },
  { en: 'Juris & Ethics', group: 'public', domain: 'juris', y: [_, _, _, _, _, _, _, 8, 1, 4, 4] },
  { en: 'Zoonosis', group: 'public', domain: 'zoonoses', y: [_, _, _, _, _, _, _, 3, 2, 2, 1] },
];

/** A cell as one number: parts summed, words and missing years as null. */
export function cellValue(cell) {
  if (Array.isArray(cell)) return cell.reduce((a, b) => a + b, 0);
  return typeof cell === 'number' ? cell : null;
}

const yearIndex = (year) => YEARS.indexOf(year);

/** The questions recorded in a year, over every subject. */
export function yearTotal(year) {
  const i = yearIndex(year);
  return SUBJECTS.reduce((sum, s) => sum + (cellValue(s.y[i]) ?? 0), 0);
}

/** How many subjects hold a number for the year. */
export function yearSubjects(year) {
  const i = yearIndex(year);
  return SUBJECTS.filter((s) => cellValue(s.y[i]) !== null).length;
}

/** The almanac's three-year mean: a year with no record counts as 0. */
export function recentMean(subject) {
  return RECENT.reduce((sum, year) => sum + (cellValue(subject.y[yearIndex(year)]) ?? 0), 0) / RECENT.length;
}

/** The almanac's direction: the latest year less the mean of the two before it; null without a record. */
export function trend(subject) {
  const [a, b, c] = RECENT.map((year) => cellValue(subject.y[yearIndex(year)]));
  if (c === null) return null;
  return c - ((a ?? 0) + (b ?? 0)) / 2;
}

/** Long-run figures over the years that hold a number (population SD, as the almanac uses). */
export function longRun(subject) {
  const values = subject.y.map(cellValue).filter((v) => v !== null);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sd = Math.sqrt(values.reduce((a, v) => a + (v - mean) ** 2, 0) / values.length);
  return { years: values.length, mean, sd, min: Math.min(...values), max: Math.max(...values), cv: mean ? sd / mean : 0 };
}

/** Group totals for a year, in GROUPS order. */
export function groupTotals(year) {
  const i = yearIndex(year);
  return GROUPS.map((g) => ({
    ...g,
    total: SUBJECTS.filter((s) => s.group === g.id).reduce((sum, s) => sum + (cellValue(s.y[i]) ?? 0), 0),
  }));
}

/**
 * Each VCA domain's recalled questions in each of the given years, split by part where a cell
 * holds two subjects' counts. Subjects no domain covers gather under null.
 * @returns {Map<string|null, number[]>}
 */
export function domainSeries(years = RECENT) {
  const out = new Map();
  const add = (id, k, v) => {
    if (!out.has(id)) out.set(id, years.map(() => 0));
    out.get(id)[k] += v;
  };
  for (const s of SUBJECTS) {
    years.forEach((year, k) => {
      const cell = s.y[yearIndex(year)];
      if (Array.isArray(s.domain)) {
        if (Array.isArray(cell)) cell.forEach((v, part) => add(s.domain[part], k, v));
        else if (typeof cell === 'number') add(s.domain[0], k, cell);
        else add(s.domain[0], k, 0);
      } else {
        add(s.domain, k, cellValue(cell) ?? 0);
      }
    });
  }
  return out;
}

/** Each domain's mean over the recent window (a year without a record counts as 0). */
export function domainMeans() {
  return new Map([...domainSeries()].map(([id, series]) => [id, series.reduce((a, b) => a + b, 0) / series.length]));
}

/** A domain's direction, as the almanac reads a subject's: the latest year less the two before. */
export function domainTrend(series) {
  const [a, b, c] = series;
  return c - (a + b) / 2;
}

/**
 * Each domain's place in the recent record: its mean a year, its share of everything recorded
 * (subjects without a domain included, so shares are of the whole record), and its direction.
 * @returns {Map<string|null, { mean: number, share: number, move: number }>}
 */
export function domainProfile() {
  const series = domainSeries();
  const all = [...series.values()].reduce((sum, s) => sum + s.reduce((a, b) => a + b, 0), 0) / RECENT.length;
  return new Map([...series].map(([id, s]) => {
    const mean = s.reduce((a, b) => a + b, 0) / s.length;
    return [id, { mean, share: all ? mean / all : 0, move: domainTrend(s) }];
  }));
}

/** A domain's share of the recent record, 0..1, over the questions a domain covers. */
export function domainShares() {
  const means = domainMeans();
  const all = [...means.values()].reduce((a, b) => a + b, 0);
  return { means, all, shares: new Map([...means].map(([id, v]) => [id, all ? v / all : 0])) };
}

/** Weights for drawing a set "as the exam asks", by domain id (subjects without a domain left out). */
export function examWeights() {
  const means = domainMeans();
  return Object.fromEntries([...means].filter(([id]) => id !== null));
}
