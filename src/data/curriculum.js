// ============================================================
// CURRICULUM: Years + Subjects
// ============================================================
// อิงตามตารางสอบ: ตารางสอบป_14_Final_Term2.pdf
// ============================================================

export const YEARS = [
  { id: 1, label: 'ปี 1', available: false, current: false, desc: 'Pre-clinic — จะเพิ่มทีหลัง' },
  { id: 2, label: 'ปี 2', available: false, current: false, desc: 'Pre-clinic — จะเพิ่มทีหลัง' },
  { id: 3, label: 'ปี 3', available: false, current: false, desc: 'Paraclinic — จะเพิ่มทีหลัง' },
  { id: 4, label: 'ปี 4', available: true,  current: true,  desc: 'ปีปัจจุบัน · Vet 86' },
  { id: 5, label: 'ปี 5', available: false, current: false, desc: 'Clinical rotation — จะเพิ่มทีหลัง' },
  { id: 6, label: 'ปี 6', available: false, current: false, desc: 'Internship — จะเพิ่มทีหลัง' },
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
      icon: '🐕', color: '#3d6b82', semester: 2, has_questions: true,
      topics: [
        { id: 'cve',          label: 'CVE — CPV / CCV',                  icon: '🦠',
          lecturer: 'Punyamanee Yamkate', lecturer_year: 2026,
          lecturerNote: 'ข้อสอบเก่า sunsun84 (2024) อาจสอนคนละคน — ตรวจสอบกับเพื่อนในห้อง' },
        { id: 'sporo-crypto', label: 'Sporotrichosis & Cryptococcosis',  icon: '🍄',
          lecturer: 'Siwaporn Pengpis', lecturer_year: 2026,
          lecturerNote: 'ข้อสอบเก่า sunsun84 (2024) อาจสอนคนละคน — ตรวจสอบกับเพื่อนในห้อง' },
        { id: 'gi-protozoa',  label: 'GI protozoal enteritis',           icon: '🪱',
          lecturer: 'Woraporn Sukhumavasi', lecturer_year: 2026,
          lecturerNote: 'ปี 2024 (sunsun84) Aj. Woraporn สอนเหมือนกัน — เนื้อหาน่าจะใกล้เคียง' },
        { id: 'rabies',       label: 'Rabies',                           icon: '🦇',
          lecturer: 'Vachira Hunprasit', lecturer_year: 2026,
          lecturerNote: 'ข้อสอบเก่า sunsun84 (2024) อาจสอนคนละคน — ตรวจสอบกับเพื่อนในห้อง' },
        { id: 'vaccine',      label: 'Vaccine guidelines (WSAVA/VPAT)',  icon: '💉',
          lecturer: 'Sanipa Suradhat', lecturer_year: 2026,
          lecturerNote: 'WSAVA 2024 + VPAT 2024 ออกใหม่ ข้อสอบเก่าก่อนปี 2024 อาจอ้าง guideline เก่า' },
        { id: 'feline-uri',   label: 'Feline URI',                       icon: '🐈',
          lecturer: 'Nattawan Tangmahakul', lecturer_year: 2026,
          lecturerNote: 'ข้อสอบเก่า sunsun84 ใช้ชื่อ "FRDC" — ปี 86 ใช้ "FURI" เนื้อหาเดียวกัน' },
      ] },
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

    // ── English / Professional skills ──
    { id: 'engprof', code: '5500419', name: 'Eng Vet Prof II', name_en: 'English for Vet Profession II',
      icon: '🇬🇧', color: '#5c6b7d', semester: 2, has_questions: false,
      note: 'รอข้อสอบเพิ่ม' },
  ],
  // ปีอื่นๆ เพิ่มที่นี่ในอนาคต
};

// Flat list (includes "all")
export const SUBJECTS = [
  { id: 'all', name: 'รวมทุกวิชา', name_en: 'All Subjects', icon: '📚', color: '#2b2419' },
  ...Object.values(SUBJECTS_BY_YEAR).flat(),
];
