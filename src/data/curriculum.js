// ============================================================
// CURRICULUM: Years + Subjects (อนาคตรองรับทุกปี)
// ============================================================
// ตารางสอบ → schedule.js
// คลิปวิดีโอ → videos.js
// แหล่งที่มาข้อสอบ → sources.js
// ============================================================

export const YEARS = [
  { id: 1, label: 'ปี 1', active: false, note: 'Pre-clinic (จะเพิ่มทีหลัง)' },
  { id: 2, label: 'ปี 2', active: false, note: 'Pre-clinic (จะเพิ่มทีหลัง)' },
  { id: 3, label: 'ปี 3', active: false, note: 'Paraclinic (จะเพิ่มทีหลัง)' },
  { id: 4, label: 'ปี 4', active: true, note: 'ปีปัจจุบัน · Vet 86' },
  { id: 5, label: 'ปี 5', active: false, note: 'Clinical rotation (จะเพิ่มทีหลัง)' },
  { id: 6, label: 'ปี 6', active: false, note: 'Internship (จะเพิ่มทีหลัง)' },
];

export const CURRENT_YEAR = 4;  // default ปีที่ active

// Subjects grouped by year (supports all years)
export const SUBJECTS_BY_YEAR = {
  4: [
    { id: 'surg2',  name: 'Vet Surg Lab II',  name_en: 'Soft Tissue / Eye',  icon: '👁️', color: '#4a6b4a', semester: 2 },
    { id: 'surg3',  name: 'Vet Surg Lab III', name_en: 'Orthopedic',         icon: '🦴', color: '#c26d6d', semester: 2 },
    { id: 'repro',  name: 'Repro Lab',        name_en: 'Reproduction',       icon: '🐾', color: '#b88940', semester: 2 },
    { id: 'com4',   name: 'COM IV',           name_en: 'Clinical Medicine',  icon: '🩺', color: '#3d6b82', semester: 2 },
    { id: 'com3',   name: 'COM III / Rumen',  name_en: 'Large Animal',       icon: '🐄', color: '#7d4a44', semester: 2 },
    { id: 'exotic', name: 'Exotic / PP',      name_en: 'Exotic & Post-Grad', icon: '🦜', color: '#7d4a7d', semester: 2 },
  ],
  // ปีอื่นๆ เพิ่มที่นี่ในอนาคต
};

// Flat list (includes "all")
export const SUBJECTS = [
  { id: 'all', name: 'รวมทุกวิชา', name_en: 'All Subjects', icon: '📚', color: '#2b2419' },
  ...Object.values(SUBJECTS_BY_YEAR).flat(),
];
