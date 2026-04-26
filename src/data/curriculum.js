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
          lecturerNote: 'ปี 2023 (sunsun84) Aj. Punyamanee สอนเหมือนกัน — เนื้อหาเทียบกันได้' },
        { id: 'sporo-crypto', label: 'Sporotrichosis & Cryptococcosis',  icon: '🍄',
          lecturer: 'Siwaporn Pengpis', lecturer_year: 2026,
          lecturerNote: 'ปี 2024 (sunsun84) Aj. Siwaporn สอนเหมือนกัน — เนื้อหาเทียบกันได้' },
        { id: 'gi-protozoa',  label: 'GI protozoal enteritis',           icon: '🪱',
          lecturer: 'Woraporn Sukhumavasi', lecturer_year: 2026,
          lecturerNote: 'ปี 2023 (sunsun84) Aj. Woraporn สอนเหมือนกัน — เนื้อหาเทียบกันได้' },
        { id: 'rabies',       label: 'Rabies',                           icon: '🦇',
          lecturer: 'Vachira Hunprasit', lecturer_year: 2026,
          lecturerNote: 'ปี 2024 (sunsun84) Aj. Vachira สอนเหมือนกัน — เนื้อหาเทียบกันได้' },
        { id: 'vaccine',      label: 'Vaccine guidelines (WSAVA/VPAT)',  icon: '💉',
          lecturer: 'Sanipa Suradhat', lecturer_year: 2026,
          lecturerNote: 'ปี 2024 Prof. Sanipa สอนเหมือนกัน · WSAVA 2024 + VPAT 2024 เป็น guideline ใหม่ — ข้อสอบเก่าอาจอ้าง 2016' },
        { id: 'feline-uri',   label: 'Feline URI',                       icon: '🐈',
          lecturer: 'Nattawan Tangmahakul', lecturer_year: 2026,
          lecturerNote: '⚠️ ผู้สอนเปลี่ยน — ปี 2024 (sunsun84) Aj. Prapaporn Jongwattanapisan สอน "FRDC" / ปี 86 Aj. Nattawan สอน "FURI" (เนื้อหาเทียบเคียงได้แต่อาจมี emphasis ต่างกัน — ถ้าข้อสอบเก่าอ้างไม่ตรงให้ถือ slide 2026 เป็นหลัก)' },
      ] },
    { id: 'com3', code: '3106416', name: 'COM III', name_en: 'C ANI CLI SCI III · Companion Animal',
      icon: '🚨', color: '#c26d6d', semester: 2, has_questions: true,
      examFormat: {
        weight: 'Final 48% (Mid 42 + Final 48 + งาน 10)',
        perSession: '~5-7 ข้อ/คาบ',
        totalEstimate: '~70-100 ข้อรวม (14 คาบ)',
        choiceCount: 5,
        notes: [
          '⚠️ เรื่อง AI ยังไม่ confirm ว่าออก — อาจารย์ตั้งใจให้ไม่ออก · รอ confirm อีกที',
        ],
      },
      topics: [
        // เรียงตามตารางเรียน Sem 2/2568 คาบ 15-30 (Final exam scope)
        { id: 'neuro-exam',    label: 'คาบ 15-16 · Neuro Exam + Localization', icon: '🔍',
          lecturer: 'Krissda Boonaramrueng (KB)', lecturer_year: 2026, schedule: '5 มี.ค. · คาบ 15-16',
          lecturerNote: 'ปี 2024 (sunsun84) Aj. Krissda สอนเหมือนกัน — เนื้อหาเทียบกันได้' },
        { id: 'spinal',        label: 'คาบ 17-18 · Spinal Disorder & Injuries', icon: '🦴',
          lecturer: 'Kumpanart Soontornvipart (KS)', lecturer_year: 2026, schedule: '12 มี.ค. · คาบ 17-18',
          lecturerNote: 'Surgery + neuro overlap — สอน 2 ชม. (Paraplegia + Tetra/Hemi)' },
        { id: 'ai-vet',        label: 'คาบ 19 · AI in Vet Learning', icon: '🤖',
          lecturer: 'Nutthee Am-In (NA)', lecturer_year: 2026, schedule: '19 มี.ค. · คาบ 19',
          lecturerNote: 'หัวข้อใหม่ปี 2026 — AI platforms, prompt engineering, citation' },
        { id: 'ataxia-tremor', label: 'คาบ 20 · Ataxia, Tremor, Head Tilt', icon: '🌀',
          lecturer: 'Krissda Boonaramrueng (KB)', lecturer_year: 2026, schedule: '19 มี.ค. · คาบ 20' },
        { id: 'seizure',       label: 'คาบ 21 · Seizure & Narcolepsy', icon: '⚡',
          lecturer: 'Krissda Boonaramrueng (KB)', lecturer_year: 2026, schedule: '26 มี.ค. · คาบ 21',
          lecturerNote: 'IVETF + ACVIM consensus 2015 — เนื้อหาน่าจะใกล้เคียง' },
        { id: 'neuro-er',      label: 'คาบ 22 · Neuro Emergency', icon: '🧠',
          lecturer: 'Krissda Boonaramrueng (KB)', lecturer_year: 2026, schedule: '26 มี.ค. · คาบ 22' },
        { id: 'shock',         label: 'คาบ 23 · SHOCK + Fluid Therapy', icon: '⚠️',
          lecturer: 'Chutirat Torsahakul (CT)', lecturer_year: 2026, schedule: '2 เม.ย. · คาบ 23',
          lecturerNote: 'ปี 2024 Aj. Chutirat สอน emergency series ทั้งหมด — เนื้อหาเทียบกันได้' },
        { id: 'resp-cv-er',    label: 'คาบ 24 · Respiratory & CV Emergency', icon: '🫁',
          lecturer: 'Chutirat Torsahakul (CT)', lecturer_year: 2026, schedule: '2 เม.ย. · คาบ 24' },
        { id: 'acute-abdomen', label: 'คาบ 25 · Acute Abdomen', icon: '🩺',
          lecturer: 'Chutirat Torsahakul (CT)', lecturer_year: 2026, schedule: '9 เม.ย. · คาบ 25' },
        { id: 'cpcr',          label: 'คาบ 26 · CPCR (RECOVER)', icon: '❤️',
          lecturer: 'Chutirat Torsahakul (CT)', lecturer_year: 2026, schedule: '9 เม.ย. · คาบ 26' },
        { id: 'metabolic-er',  label: 'คาบ 27 · Metabolic / Endo / UT Emergency', icon: '💊',
          lecturer: 'Chutirat Torsahakul (CT)', lecturer_year: 2026, schedule: '16 เม.ย. · คาบ 27' },
        { id: 'nutrition',     label: 'คาบ 28 · Nutrition in Critical Illness', icon: '🥣',
          lecturer: 'Chutirat Torsahakul (CT)', lecturer_year: 2026, schedule: '16 เม.ย. · คาบ 28' },
        { id: 'triage',        label: 'คาบ 29 · Triage', icon: '🚦',
          lecturer: 'Chutirat Torsahakul (CT)', lecturer_year: 2026, schedule: '23 เม.ย. · คาบ 29' },
        { id: 'er-anes',       label: 'คาบ 30 · Emergency Anesthesia', icon: '😴',
          lecturer: 'Sumit Durongphongtorn (SD)', lecturer_year: 2026, schedule: '23 เม.ย. · คาบ 30' },
      ] },
    { id: 'com4', code: '3107416', name: 'COM IV', name_en: 'C ANI CLI SCI IV · Companion Animal',
      icon: '🩺', color: '#6b5b8e', semester: 2, has_questions: true,
      examFormat: {
        weight: 'Final 47.5% (Mid 47.5 + Final 47.5 + ฟรี 5)',
        notes: [
          '📅 Final exam scope = คาบ 15-28 (Immune-mediated + Dermatology + Peds-Geri) · ศุกร์ 1 พ.ค. 2569 · ยาก > 2.5 ชม.',
          '📚 Midterm scope = คาบ 1-14 (Oncology I-VI + systemic Endocrine I-VI + Immune intro) — สอบไปแล้ว',
          '✅ คลังข้อสอบครอบคลุม Final scope ครบทั้ง 14 คาบ',
        ],
      },
      topics: [
        // เรียงตาม Course Syllabus 2/2568 — Period 15 → 28 (Mar 5 → Apr 16)
        // คาบ 1-14 = Oncology + systemic Endocrine series — ยังไม่มีคลังข้อสอบ

        // ── Immune-mediated diseases (คาบ 15-18) ─────────────────────
        { id: 'immune-drugs',   label: 'คาบ 15 · Drugs for Immune-mediated', icon: '💊',
          lecturer: 'Chaiyot Tanrattana (CT)', lecturer_year: 2026, schedule: '5 มี.ค. · คาบ 15' },
        { id: 'imha',           label: 'คาบ 16 · IMHA + ITP', icon: '🩸',
          lecturer: 'Rosama Pusoonthornthum (RP)', lecturer_year: 2026, schedule: '5 มี.ค. · คาบ 16' },
        { id: 'ibd',            label: 'คาบ 17 · IBD + GN (Inflammatory disease)', icon: '🌀',
          lecturer: 'Rosama Pusoonthornthum (RP)', lecturer_year: 2026, schedule: '12 มี.ค. · คาบ 17' },
        { id: 'sle',            label: 'คาบ 18 · SLE (Systemic Lupus Erythematosus)', icon: '🦋',
          lecturer: 'Rosama Pusoonthornthum (RP)', lecturer_year: 2026, schedule: '12 มี.ค. · คาบ 18' },

        // ── Dermatology series (คาบ 19-26) ──────────────────────────
        { id: 'derm-intro',     label: 'คาบ 19 · Derm Intro + Diagnostic Techniques', icon: '🌟',
          lecturer: 'Chaiyot Tanrattana (CT)', lecturer_year: 2026, schedule: '19 มี.ค. · คาบ 19' },
        { id: 'derm-parasitic', label: 'คาบ 20 · Parasitic Skin Diseases', icon: '🪲',
          lecturer: 'Chaiyot Tanrattana (CT)', lecturer_year: 2026, schedule: '19 มี.ค. · คาบ 20' },
        { id: 'derm-bacterial', label: 'คาบ 21 · Bacterial Skin Diseases', icon: '🦠',
          lecturer: 'Chaiyot Tanrattana (CT)', lecturer_year: 2026, schedule: '26 มี.ค. · คาบ 21' },
        { id: 'derm-fungal',    label: 'คาบ 22 · Fungal Skin Diseases', icon: '🍄',
          lecturer: 'Chaiyot Tanrattana (CT)', lecturer_year: 2026, schedule: '26 มี.ค. · คาบ 22' },
        { id: 'derm-endocrine', label: 'คาบ 23 · Endocrine Skin Diseases', icon: '⚖️',
          lecturer: 'Chaiyot Tanrattana (CT)', lecturer_year: 2026, schedule: '2 เม.ย. · คาบ 23' },
        { id: 'derm-nutrition', label: 'คาบ 24 · Nutritional Skin Diseases', icon: '🥗',
          lecturer: 'Chaiyot Tanrattana (CT)', lecturer_year: 2026, schedule: '2 เม.ย. · คาบ 24' },
        { id: 'derm-allergic',  label: 'คาบ 25 · Allergic Dermatitis', icon: '🤧',
          lecturer: 'Chaiyot Tanrattana (CT)', lecturer_year: 2026, schedule: '9 เม.ย. · คาบ 25' },
        { id: 'derm-autoimmune', label: 'คาบ 26 · Autoimmune Skin Diseases', icon: '🛡',
          lecturer: 'Chaiyot Tanrattana (CT)', lecturer_year: 2026, schedule: '9 เม.ย. · คาบ 26' },

        // ── Pediatrics & Geriatrics (คาบ 27-28) ─────────────────────
        { id: 'peds-geri',      label: 'คาบ 27-28 · Pediatrics & Geriatrics', icon: '👶',
          lecturer: 'Punyamanee Yamkate (PY)', lecturer_year: 2026, schedule: '16 เม.ย. · คาบ 27-28' },
      ] },

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
      note: 'รอข้อสอบเพิ่ม',
      examFormat: {
        weight: '7.5% ต่อสัปดาห์',
        questionTypes: [
          { topic: 'การประกันคุณภาพของฟาร์มสัตว์ปีก', type: 'True/False', count: '~10 ข้อ' },
          { topic: 'การจัดการฟาร์มสัตว์ปีก + ปัญหาลูกไก่ตายในสัปดาห์แรก', type: 'MCQ' },
          { topic: 'Avian zoonosis', type: 'Fill-in (เติมคำ)' },
        ],
      } },

    // ── English / Professional skills ──
    { id: 'engprof', code: '5500419', name: 'Eng Vet Prof II', name_en: 'English for Vet Profession II',
      icon: '🗣️', color: '#5c6b7d', semester: 2, has_questions: false,
      note: 'รอข้อสอบเพิ่ม' },
  ],
  // ปีอื่นๆ เพิ่มที่นี่ในอนาคต
};

// Flat list (includes "all")
export const SUBJECTS = [
  { id: 'all', name: 'รวมทุกวิชา', name_en: 'All Subjects', icon: '📚', color: '#2b2419' },
  ...Object.values(SUBJECTS_BY_YEAR).flat(),
];
