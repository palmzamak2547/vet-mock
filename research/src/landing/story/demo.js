// The sample file the story's panels show [M1-DESIGN.md 15.2]. These are spreadsheet cells, not
// interface copy: a raw Thai field file keeps its own headers and values (Thai numerals, Buddhist-era
// dates, "ไม่ทราบ") in both languages, exactly as a student's file would. Every count the panels print
// (rows shown, conversions by kind) and the cleaned rows are derived here from these cells, never
// typed. OWNER: landing role. Pure module.

/** The raw file's own header row (Thai, as in the file). */
export const RAW_HEADERS = Object.freeze(['รหัสสัตว์', 'ฟาร์ม', 'วันเก็บตัวอย่าง', 'อายุ (ปี)', 'ผล ELISA']);

/** Five rows of the made-up file elisa_2568.xlsx: id, farm, sample date, age in years, ELISA. */
export const RAW_ROWS = Object.freeze([
  Object.freeze(['C-0412', 'F03', '12/03/2568', '๔', 'บวก']),
  Object.freeze(['C-0413', 'F03', '12/03/2568', '6', 'ลบ']),
  Object.freeze(['C-0414', 'F03', '13/03/2568', 'ไม่ทราบ', 'ลบ']),
  Object.freeze(['C-0415', 'F11', '2/4/2025', '3', 'บวก']),
  Object.freeze(['C-0416', 'F11', '02/04/2568', '5', '-']),
]);

export const RAW_FILE = 'elisa_2568.xlsx';
export const CLEAN_NAME = 'elisa_clean';
export const CLEAN_HEADERS = Object.freeze(['animal_id', 'farm_id', 'sample_date', 'age_y', 'elisa']);
/** Rows the cleaned panel shows (a mix of the conversions). */
export const CLEAN_SHOWN = Object.freeze(['C-0412', 'C-0414', 'C-0416']);

const MISSING = new Set(['ไม่ทราบ', '-']);
const THAI_DIGIT = /[๐-๙]/;
const toArabic = (s) => s.replace(/[๐-๙]/g, (d) => String(d.charCodeAt(0) - 0x0e50));

/**
 * Classify one date cell. Four-digit years from 2400 to 2700 are Buddhist era (M1-DESIGN.md 8.2);
 * a single-digit day and month in a CE year ("2/4/2025") needs the day-first order confirmed.
 * @param {string} cell
 */
function readDate(cell) {
  const [d, m, y] = cell.split('/').map(Number);
  const be = y >= 2400 && y <= 2700;
  const ce = be ? y - 543 : y;
  const iso = `${ce}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const ambiguous = !be && d <= 12 && m <= 12 && d !== m;
  return { iso, be, ambiguous };
}

/** The cells the raw panel marks (need converting or confirming), as [rowIndex, columnIndex]. */
export function markedCells() {
  const out = [];
  RAW_ROWS.forEach((r, i) => {
    const date = readDate(r[2]);
    if (date.be || date.ambiguous) out.push([i, 2]);
    if (THAI_DIGIT.test(r[3]) || MISSING.has(r[3])) out.push([i, 3]);
    if (MISSING.has(r[4])) out.push([i, 4]);
  });
  return out;
}

/** Conversion counts for the cleaned panel's log, derived from the raw cells. */
export function conversionCounts() {
  let be = 0;
  let confirmed = 0;
  let thaiDigits = 0;
  let missing = 0;
  let confirmedExample = '';
  for (const r of RAW_ROWS) {
    const date = readDate(r[2]);
    if (date.be) be++;
    if (date.ambiguous) {
      confirmed++;
      confirmedExample = r[2];
    }
    if (THAI_DIGIT.test(r[3])) thaiDigits++;
    if (MISSING.has(r[3])) missing++;
    if (MISSING.has(r[4])) missing++;
  }
  return { be, confirmed, confirmedExample, thaiDigits, missing };
}

/** The cleaned rows the panel shows. Missing values print as NA (prose says ค่าที่หายไป). */
export function cleanRows() {
  return RAW_ROWS.filter((r) => CLEAN_SHOWN.includes(r[0])).map((r) => {
    const age = MISSING.has(r[3]) ? null : toArabic(r[3]);
    const elisa = MISSING.has(r[4]) ? null : r[4];
    return [r[0], r[1], readDate(r[2]).iso, age, elisa];
  });
}
