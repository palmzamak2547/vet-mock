// ============================================================
// CURRICULUM: Years + Subjects
// ============================================================
// อิงตามตารางสอบ: ตารางสอบป_14_Final_Term2.pdf
// ============================================================

export const YEARS = [
  { id: 1, label: 'ปี 1', active: false, note: 'Pre-clinic (จะเพิ่มทีหลัง)' },
  { id: 2, label: 'ปี 2', active: false, note: 'Pre-clinic (จะเพิ่มทีหลัง)' },
  { id: 3, label: 'ปี 3', active: false, note: 'Paraclinic (จะเพิ่มทีหลัง)' },
  { id: 4, label: 'ปี 4', active: true, note: 'ปีปัจจุบัน · Vet 86' },
  { id: 5, label: 'ปี 5', active: false, note: 'Clinical rotation (จะเพิ่มทีหลัง)' },
  { id: 6, label: 'ปี 6', active: false, note: 'Internship (จะเพิ่มทีหลัง)' },
];

export const CURRENT_YEAR = 4;

// ============================================================
// SUBJECTS — ปี 4 Sem 2 (Vet 86) อิงตามตารางสอบ Final
// ============================================================
export const SUBJECTS_BY_YEAR = {
  4: [
    // ── Surg Lab (สอบนอกตาราง) ──
    { id: 'surg2', code: '3106417', name: 'Vet Surg Lab II', name_en: 'Soft Tissue / Eye',
      icon: '👁️', color: '#4a6b4a', semester: 2, has_questions: true },
    { id: 'surg3', code: '3106418', name: 'Vet Surg Lab III', name_en: 'Orthopedic',
      icon: '🦴', color: '#c26d6d', semester: 2, has_questions: true },

    // ── COM Series (Companion Animal Clinical Sciences) ──
    { id: 'com5', code: '3107417', name: 'COM V', name_en: 'C ANI CLI SCI V · Companion Animal',
      icon: '🐕', color: '#3d6b82', semester: 2, has_questions: false,
      note: 'รอข้อสอบเพิ่ม' },
    { id: 'com3', code: '3106416', name: 'COM III', name_en: 'C ANI CLI SCI III · Companion Animal',
      icon: '🩺', color: '#3d6b82', semester: 2, has_questions: false,
      note: 'รอข้อสอบเพิ่ม' },
    { id: 'com4', code: '3107416', name: 'COM IV', name_en: 'C ANI CLI SCI IV · Companion Animal',
      icon: '🐈', color: '#3d6b82', semester: 2, has_questions: true },

    // ── Reproduction ──
    { id: 'repro', code: '3108409', name: 'Repro Lab', name_en: 'Companion Animal Reproduction',
      icon: '🐾', color: '#b88940', semester: 2, has_questions: true },

    // ── Wildlife & Exotic ──
    { id: 'exotic', code: '3107414', name: 'Wildlife & Exotic', name_en: 'Wild Exo Hlth Mgt + PP',
      icon: '🦜', color: '#7d4a7d', semester: 2, has_questions: true },

    // ── Ruminant Series ──
    { id: 'practrum', code: '3108412', name: 'Practice Ruminant', name_en: 'VET PRAC RUM',
      icon: '🐂', color: '#5c7d4a', semester: 2, has_questions: false,
      note: 'รอข้อสอบเพิ่ม' },
    { id: 'cliapprum', code: '3108411', name: 'Clinical App Rumen', name_en: 'VET CLI APP RUM',
      icon: '🐄', color: '#7d5a44', semester: 2, has_questions: true },

    // ── Poultry ──
    { id: 'poultry', code: '3107409', name: 'Poultry Health', name_en: 'PLTRY HLTH MGT',
      icon: '🐔', color: '#c2924a', semester: 2, has_questions: false,
      note: 'รอข้อสอบเพิ่ม' },
  ],
  // ปีอื่นๆ เพิ่มที่นี่ในอนาคต
};

// Flat list (includes "all")
export const SUBJECTS = [
  { id: 'all', name: 'รวมทุกวิชา', name_en: 'All Subjects', icon: '📚', color: '#2b2419' },
  ...Object.values(SUBJECTS_BY_YEAR).flat(),
];
