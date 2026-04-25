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
    note: 'ไม่รู้คะแนนงง',
  },
  com3: {
    subject_id: 'com3',
    name: 'COM III',
    midterm: 42,
    final: 48,
    free: null,
    work: 10,
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

export function getScoreBreakdown(subjectId) {
  // Find primary entry (some subjects have multiple, e.g. repro/reprolab)
  return Object.values(SCORE_BREAKDOWN).find((s) => s.subject_id === subjectId);
}

export function getAllScores() {
  return Object.values(SCORE_BREAKDOWN);
}
