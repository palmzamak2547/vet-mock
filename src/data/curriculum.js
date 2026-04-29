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
        weight: 'Final 40% (Mid 40 + Final 40 + งาน 20)',
        perSession: '~5-7 ข้อ/คาบ',
        totalEstimate: '~70-100 ข้อรวม (14 คาบ)',
        choiceCount: 5,
        notes: [
          '✅ Confirmed: 5-7 ข้อต่อคาบ · MCQ 5 ตัวเลือก · สัดส่วน Final 40%',
          'ℹ️ เรื่อง AI (คาบ 19) ไม่ออกข้อสอบ — เป็นแนวทางสำหรับทำโปสเตอร์เท่านั้น',
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

        // ── ข้อสอบเก่าเฉพาะกิจ — separate section, not a real "คาบ" ──
        // 72 unique MCQs (5-option) from COM III Final 2019 past exam,
        // cross-verified against 2026 lecture slides. Mapped to all 14
        // chapters via tags[] (spinal 11 · shock 7 · seizure 6 · neuro-
        // er/vestibular/ataxia/nutrition/acute-ab/resp-cv 5 each · cpcr
        // 5 · triage 4 · metabolic-er 4 · anesthesia 3 · flutd 1).
        { id: 'special-prep',  label: '⭐ ข้อสอบเก่าเฉพาะกิจ · COM III Final 2019', icon: '📜',
          lecturer: '2 ไฟล์ในโฟลเดอร์ "ยังไม่ได้เช็ค"', lecturer_year: 2019,
          lecturerNote: '72 ข้อจาก past final — verified vs 2026 slides + student answer key. กระจายทุกบท: spinal 11 · shock 7 · seizure 6 · neuro-er/vestibular/ataxia/nutrition/acute-ab/resp-cv 5 · cpcr 5 · triage 4 · metabolic 4 · anesth 3 · flutd 1' },
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

    // ── Poultry Health Management ──
    // Topics restructured 2026-04-29 to match 2026 final-scope slides
    // exactly (5 PDFs in /Slide Lecture 2026/ folder). Lectures 9-14
    // form the final scope per syllabus. Midterm-scope topics (lectures
    // 1-7: viral diseases, bacterial diseases) hidden by default — the
    // 52 Qs from "Final Exotic ไม่ใช่คำตอบ" might be midterm content
    // OR Year 5 Avian Med (Palm uncertain), so flagged accordingly.
    { id: 'poultry', code: '3107409', name: 'Poultry', name_en: 'Poultry Health Management',
      icon: '🐔', color: '#d97744', semester: 2, has_questions: true,
      examFormat: {
        weight: 'Mid 105/200 (52.5%) · Final 90/200 (45%) · Class 5/200 (2.5%) · Letter Grade A-F',
        choiceCount: 5,
        notes: [
          '📅 Final scope (lectures 9-14): First Week Mortality / Avian Zoonosis / Biosecurity / Avian Drugs / Quality Assurance — 5 หัวข้อตรงกับ 5 slides ใน /Slide Lecture 2026/',
          '📅 Midterm scope (lectures 1-7) สอบไปแล้ว — viral/bacterial/vaccine/physiology · ซ่อนไว้ default',
          '⚠️ 52 ข้อจาก "Final Exotic ไม่ใช่คำตอบ.pdf" ยังไม่ชัวร์ scope — อาจเป็น midterm Year 4 หรือ Avian Med Year 5 · เก็บไว้ใน hidden topic "uncertain-scope"',
          '👨‍🏫 Course coord: Kriengwich Limpavithayakul (L14-15) · Final scope instructors: Hatairat Plaimast (L9) · Nataya Charoenvisal (L10) · Niwat Chansiripornchai (L11) · Kamonpan Charoenkul (L13)',
          '🎯 14 ข้อใน final scope · 53 ข้อ uncertain-scope (hidden จนกว่าจะ verify)',
        ],
      },
      topics: [
        // ── Final scope (lectures 9-14) — 5 topics matching 2026 slides ──
        { id: 'first-week-mortality', label: 'L9 · First Week Mortality (AHRA)', icon: '🐣',
          lecturer: 'Hatairat Plaimast', lecturer_year: 2026, schedule: '2026-03-10 · L9 · Final scope',
          lecturerNote: 'AHRA / ShineChick first-week mortality framework · 0 ข้อตอนนี้ — ต้อง extract MCQs จาก slide เพิ่ม' },
        { id: 'avian-zoonosis',       label: 'L10 · Avian Zoonosis', icon: '🧬',
          lecturer: 'Nataya Charoenvisal', lecturer_year: 2026, schedule: '2026-03-17 · L10 · Final scope',
          lecturerNote: 'Salmonella food safety + zoonotic poultry diseases · 1 ข้อ' },
        { id: 'biosecurity',          label: 'L11 · Biosecurity & Disease Surveillance', icon: '🛡',
          lecturer: 'Niwat Chansiripornchai', lecturer_year: 2026, schedule: '2026-03-24 · L11 · Final scope',
          lecturerNote: 'Conceptual + structural biosecurity · sentinel birds · cleaning + disinfection · sample size · sens/spec — 4 ข้อ' },
        { id: 'avian-drugs',          label: 'L13 · Avian Drugs', icon: '💊',
          lecturer: 'Kamonpan Charoenkul', lecturer_year: 2026, schedule: '2026-04-07 · L13 · Final scope',
          lecturerNote: 'Antibiotic selection in poultry · Tylosin/streptomycin/gentamicin/enrofloxacin (residue concerns) · 1 ข้อ' },
        { id: 'quality-assurance',    label: 'L14-15 · Quality Assurance', icon: '🏆',
          lecturer: 'Kriengwich Limpavithayakul', lecturer_year: 2026, schedule: '2026-04-21 + 04-28 · L14-15 · Final scope · Course coord',
          lecturerNote: 'QA components (control/audit/accreditation/assess/traceability) · PDCA · slow-growth trade-offs · FCR · Betagro performance — 7 ข้อ' },

        // ── Uncertain scope (52 Qs) — might be midterm Y4 or Y5 Avian Med ──
        { id: 'uncertain-scope',      label: '❓ Uncertain Scope · ND/AE/aMPV/E.coli/Mycoplasma', icon: '❓',
          hidden: true,
          lecturer: 'TBD — verify against L1-7 slides or Y5 Avian Med syllabus',
          lecturerNote: '52 ข้อจาก "Final Exotic ไม่ใช่คำตอบ.pdf" · cover ND (15) · AE (10) · aMPV (5) · APEC (10) · Mycoplasma (4) · Coryza/cholera/NDS (8). เนื้อหาเป็นโรคพื้นฐานของ poultry — ปกติสอนใน midterm Y4 แต่ Palm สงสัยว่าอาจเป็น Y5 Avian Med' },

        // ── Midterm scope topics (lectures 1-7) — hidden, no Qs yet ──
        { id: 'physiology',           label: 'L1-2 · Physiology + Immunology', icon: '🧠',
          hidden: true,
          lecturer: 'Kris Angkanaporn', lecturer_year: 2026, schedule: 'L1-2 · Midterm scope',
          lecturerNote: 'Lymphoid organs · B-cell (Bursa) · T-cell (Thymus) · cecal tonsils — 3 ข้อ จาก pre-test note' },
        { id: 'nutrition',            label: 'L4-5 · Feed Management', icon: '🌾',
          hidden: true,
          lecturer: 'Chackrit Nuengjamnong', lecturer_year: 2026, schedule: 'L4-5 · Midterm scope',
          lecturerNote: 'Animal composition · ME/NE · limiting amino acids (Met/Lys/Thr) · Ca:P · raw materials · 0 ข้อ' },
        { id: 'midterm-disease',      label: 'L6-7 · Midterm Diseases', icon: '🦠',
          hidden: true,
          lecturer: 'Somsak Pakpinyo', lecturer_year: 2026, schedule: 'L6-7 · Midterm scope',
          lecturerNote: 'Acute death DDx · CAV/blue wing — 2 ข้อ' },
      ] },

    // ── Wildlife & Exotic ──
    { id: 'exotic', code: '3107414', name: 'Wildlife & Exotic', name_en: 'Wild Exo Hlth Mgt + PP',
      icon: '🦜', color: '#7d4a7d', semester: 2, has_questions: true,
      examFormat: {
        weight: 'Final 1 หน่วยกิต · Letter Grade (A-F)',
        examDate: '27 เม.ย. – 12 พ.ค. 2569 (ตารางสอบปลายภาค ปีการศึกษา 2568)',
        notes: [
          '📅 สอบปลายภาค: 27 เม.ย. – 12 พ.ค. 2569 · วันเวลาเฉพาะดูประกาศจากคณะ',
          '✅ คลังข้อสอบครอบคลุม Final scope (สัปดาห์ 7-14): นก noninf + นก infect + zoo + field + career',
          '⏳ Midterm scope (สัปดาห์ 1-6: เต่า/หนู/กระต่าย/Sugar glider/Hedgehog/ไก่ชน) — รอเก็บปิดเทอม',
          '👨‍🏫 ผู้สอนหลัก: ผศ.น.สพ. ธวัช เล็กดำรงศักดิ์ (สัปดาห์ 1-11)',
          '👥 ผู้สอนสัมมนา: เสาวภางค์ สนั่นหนู (สวนสัตว์) · ไพศิลป์ เล็กเจริญ (นอกสวนสัตว์) · ปัณณวัฒน์ สุภาพรรณชาติ (เรียนต่อ)',
          '📚 Cumulative — exam ออกได้ทุกสัตว์ที่เรียนตลอดเทอม',
        ],
      },
      topics: [
        // ── Pre-midterm species (สัปดาห์ 1-6) ─────────────────────────
        // Hidden until ปิดเทอม — เพื่อนกำลังเร่ง Final scope · จะ enable
        // กลับมาตอนเริ่มเก็บ midterm content (เปลี่ยน hidden:false)
        { id: 'intro-turtle',         label: 'สัปดาห์ 1 · Introduction + เต่า', icon: '🐢', hidden: true,
          lecturer: 'ธวัช เล็กดำรงศักดิ์', lecturer_year: 2026, schedule: '7 ม.ค. · สัปดาห์ 1' },
        { id: 'hamster-gerbil',       label: 'สัปดาห์ 2 · หนูแฮมสเตอร์ + หนูแกสบี้', icon: '🐹', hidden: true,
          lecturer: 'ธวัช เล็กดำรงศักดิ์', lecturer_year: 2026, schedule: '14 ม.ค. · สัปดาห์ 2' },
        { id: 'rabbit',               label: 'สัปดาห์ 3-4 · กระต่าย', icon: '🐰', hidden: true,
          lecturer: 'ธวัช เล็กดำรงศักดิ์', lecturer_year: 2026, schedule: '21+28 ม.ค. · สัปดาห์ 3-4' },
        { id: 'sugar-glider-hedgehog', label: 'สัปดาห์ 5 · Sugar Glider + Hedgehog', icon: '🦔', hidden: true,
          lecturer: 'ธวัช เล็กดำรงศักดิ์', lecturer_year: 2026, schedule: '4 ก.พ. · สัปดาห์ 5' },
        { id: 'chicken',              label: 'สัปดาห์ 6 · ไก่ชน', icon: '🐓', hidden: true,
          lecturer: 'ธวัช เล็กดำรงศักดิ์', lecturer_year: 2026, schedule: '11 ก.พ. · สัปดาห์ 6' },

        // ── Bird series — non-infectious (สัปดาห์ 7-8) ──────────────
        { id: 'bird-noninfect',       label: 'สัปดาห์ 7-8 · นกสวยงาม + โรคไม่ติดเชื้อในนก', icon: '🦜',
          lecturer: 'ธวัช เล็กดำรงศักดิ์', lecturer_year: 2026, schedule: '18 ก.พ. + 4 มี.ค. · สัปดาห์ 7-8',
          lecturerNote: 'รวม handling, anesthesia, blood collection, cloacal papilloma' },

        // ── Bird series — infectious (สัปดาห์ 9-11) — Final exam scope หลัก ──
        { id: 'bird-infect',          label: 'สัปดาห์ 9-11 · โรคติดเชื้อในนก (1-3)', icon: '🦠',
          lecturer: 'ธวัช เล็กดำรงศักดิ์', lecturer_year: 2026, schedule: '11+18+25 มี.ค. · สัปดาห์ 9-11',
          lecturerNote: 'Pacheco, PDD, Polyoma, PBFD, Avian Bornavirus etc.' },

        // ── Wildlife / Zoo / Career (สัปดาห์ 12-14) ─────────────────
        { id: 'zoo-vet',              label: 'สัปดาห์ 12 · สัตวแพทย์กับงานสวนสัตว์', icon: '🦓',
          lecturer: 'เสาวภางค์ สนั่นหนู', lecturer_year: 2026, schedule: '1 เม.ย. · สัปดาห์ 12',
          lecturerNote: 'One Health, conservation, welfare (Five Domains), quarantine' },
        { id: 'field-vet',            label: 'สัปดาห์ 13 · สัตวแพทย์กับงานนอกสวนสัตว์', icon: '🌳',
          lecturer: 'ไพศิลป์ เล็กเจริญ', lecturer_year: 2026, schedule: '8 เม.ย. · สัปดาห์ 13',
          lecturerNote: 'Field work, vaccine programs, wildlife health' },
        { id: 'wildlife-career',      label: 'สัปดาห์ 14 · การศึกษาต่อด้าน Wildlife/Exotic', icon: '🎓',
          lecturer: 'ปัณณวัฒน์ สุภาพรรณชาติ', lecturer_year: 2026, schedule: '22 เม.ย. · สัปดาห์ 14',
          lecturerNote: 'ECZM, ACZM, residency USA/EU, Fulbright/Chevening/Erasmus' },

        // ── Other species (covered in course but not in formal weekly schedule) ──
        { id: 'reptile',              label: '➕ Reptile (general)', icon: '🦎',
          lecturer: 'ธวัช เล็กดำรงศักดิ์', lecturer_year: 2026,
          lecturerNote: 'MBD, thermoregulation, terrarium gradient' },
        { id: 'ferret',               label: '➕ Ferret', icon: '🦦',
          lecturer: 'ธวัช เล็กดำรงศักดิ์', lecturer_year: 2026,
          lecturerNote: 'Insulinoma + adrenal disease' },
      ] },

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
      icon: '🗣️', color: '#5c6b7d', semester: 2, has_questions: true,
      examFormat: {
        weight: 'Final 30% (Mid 30 + Final 30 + งาน 25 + ฟรี 5 + อื่นๆ ~10)',
        notes: [
          '📅 Final = Units 4-5 · 35 points (30%) · 28 เม.ย. 13:00-15:00 · VET6 807',
          '📖 Part I — Reading Vet Research Papers (20 pts): short answers + T/F',
          '✍️ Part II — Writing a 150-word Summary (15 pts): Content 7 + Org/Grammar 5 + Paraphrase 3',
          '⚠️ Deduct 1 point ถ้า summary > 180 words · -2 points ถ้า > 200 words',
        ],
      },
      topics: [
        { id: 'research-paper-structure', label: 'Unit 4 · ส่วนต่างๆ ของ Research Paper', icon: '📑',
          lecturer: 'CULI Eng Vet Prof II', lecturer_year: 2026,
          lecturerNote: 'Introduction · Methodology · Results · Discussion/Conclusion · ส่วนละทำหน้าที่ต่างกัน — รู้ว่าข้อมูลอยู่ที่ไหน' },
        { id: 'research-design',          label: 'Unit 4 · Research Designs', icon: '🔬',
          lecturer: 'CULI Eng Vet Prof II', lecturer_year: 2026,
          lecturerNote: 'Case report / Case-control / Cohort / Clinical Trial / RCT / Cross-sectional · ดูคำบรรยายแล้วบอกชนิดได้' },
        { id: 'academic-writing',         label: 'Unit 5 · Writing Academic Papers', icon: '🖋️',
          lecturer: 'CULI Eng Vet Prof II', lecturer_year: 2026,
          lecturerNote: 'Review article structure · 5 ขั้นตอนเขียน · AMA citation' },
        { id: 'paraphrasing',             label: 'Unit 5 · Paraphrasing Techniques', icon: '🔁',
          lecturer: 'CULI Eng Vet Prof II', lecturer_year: 2026,
          lecturerNote: 'Synonyms · active↔passive · parts of speech · sentence markers · structures · acceptable vs unacceptable' },
        { id: 'summary-writing',          label: 'Unit 5 · Writing a Summary', icon: '📝',
          lecturer: 'CULI Eng Vet Prof II', lecturer_year: 2026,
          lecturerNote: '150-word target · main idea + key details · own words · ห้าม opinion/invented material' },
      ] },
  ],
  // ปีอื่นๆ เพิ่มที่นี่ในอนาคต
};

// Flat list (includes "all")
export const SUBJECTS = [
  { id: 'all', name: 'รวมทุกวิชา', name_en: 'All Subjects', icon: '📚', color: '#2b2419' },
  ...Object.values(SUBJECTS_BY_YEAR).flat(),
];
