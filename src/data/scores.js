// ============================================================
// สัดส่วนคะแนน ปี 4 เทอม 2 — Vet 86
// Source: ส_ดส_วนคะแนน.jpg (อาจไม่ครบ — รอข้อมูลเพิ่ม)
// ============================================================

export const SCORE_BREAKDOWN = {
  practrum: {
    subject_id: 'practrum',
    name: 'Practice Ruminant',
    midterm: 17.65,
    final: 23.53,
    free: 11.76,
    work: null,
    note: 'ยังไม่ทราบสัดส่วนคะแนน',
  },
  com3: {
    subject_id: 'com3',
    name: 'COM III',
    midterm: 40,
    final: 40,
    free: null,
    work: 20,
  },
  com4: {
    subject_id: 'com4',
    name: 'COM IV',
    midterm: 47.5,
    final: 47.5,
    free: 5,
    work: null,
  },
  com5: {
    subject_id: 'com5',
    name: 'COM V',
    midterm: 60,
    final: 35,
    free: 5,
    work: null,
  },
  poultry: {
    subject_id: 'poultry',
    name: 'Poultry Management',
    midterm: 52.5,
    final: 45,
    free: 2.5,
    work: null,
  },
  engprof: {
    subject_id: 'engprof',
    name: 'Eng Vet Prof II',
    midterm: 30,
    final: 30,
    free: 5,
    work: 25,
    note: 'มีงาน 25%',
  },
  exotic: {
    subject_id: 'exotic',
    name: 'Wildlife & Exotic',
    midterm: 50,
    final: 50,
    free: null,
    work: null,
  },
  repro: {
    subject_id: 'repro',
    name: 'Companion Animal Repro',
    midterm: 50,
    final: 40,
    free: 10,
    work: null,
  },
  reprolab: {
    subject_id: 'repro',  // share with repro
    name: 'Lab Companion Repro',
    midterm: 'Paper',
    final: 50,
    free: null,
    work: 50,
    note: 'งาน 50%',
  },
  cliapprum: {
    subject_id: 'cliapprum',
    name: 'Clinical Approach Ruminant',
    midterm: 50,
    final: 42.86,
    free: 7.14,
    work: null,
  },
  surg2: {
    subject_id: 'surg2',
    name: 'Lab Surgery 2',
    midterm: 'OSCE 50',
    final: 20,
    free: 30,
    work: null,
    note: 'OSCE มิดเทอม 50%',
  },
  surg3: {
    subject_id: 'surg3',
    name: 'Lab Surgery 3',
    midterm: 'OSCE 30',
    final: 40,
    free: 30,
    work: null,
    note: 'OSCE มิดเทอม 30%',
  },
};

export function getAllScores() {
  return Object.values(SCORE_BREAKDOWN);
}

// A cell is a percentage (a number), a word that carries its percentage
// ('OSCE 50'), a word with none ('Paper'), or empty. Only a number that is
// already in the cell counts; nothing is inferred.
function cellPercent(cell) {
  if (typeof cell === 'number') return cell;
  const m = typeof cell === 'string' ? /(\d+(?:\.\d+)?)\s*$/.exec(cell) : null;
  return m ? Number(m[1]) : 0;
}

/** The percentage the row's own cells add up to. */
export function knownScoreTotal(row) {
  return cellPercent(row?.midterm) + cellPercent(row?.final) + cellPercent(row?.free) + cellPercent(row?.work);
}

/**
 * What to tell the reader when a row's shares do not add up to about 100%
 * (95-105 leaves room for rounding). Null when they do. Below 95 the rest is
 * simply not in the source; above 105 the source disagrees with itself.
 */
export function scoreTotalNote(total) {
  if (total >= 95 && total <= 105) return null;
  const shown = Number(total.toFixed(1));
  return total < 95
    ? `สัดส่วนที่ทราบรวม ${shown}% ส่วนที่เหลือยังไม่มีข้อมูล`
    : `สัดส่วนที่ทราบรวม ${shown}% เกิน 100% ข้อมูลอาจคลาดเคลื่อน`;
}
