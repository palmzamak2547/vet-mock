// ============================================================
// CURRICULUM: Years + Subjects
// ============================================================
// อิงตามตารางสอบ: ตารางสอบป_14_Final_Term2.pdf
//
// 🔗 VAULT BRIDGE — lecturer profiles + research clusters:
//   Each `lecturer:` field uses display string (e.g., "Krissda Boonaramrueng (KB)").
//   Map to vault profile: knowledge/instructors/{lowercase-hyphenated-name}.md
//   Cross-cutting clusters: knowledge/synthesis/vet-research-clusters-and-exam-prediction.md
//   Discrepancy log: knowledge/discrepancies.md (FRDC vs FURI · Lepto vaccines · etc)
//
// Future improvement (P2 from automation roadmap):
//   Add `lecturer_slug:` field for deterministic lookup instead of fuzzy match
//   in instructors.js#getInstructorByLecturerString().
// ============================================================

// Year states (since 2026-05-08 expansion):
//   available: true  + scaffold: false → LIVE (full content, ปี 4 today)
//   available: true  + scaffold: true  → PREVIEW (subjects listed, no Q yet)
//   available: false                   → SOON (hidden from year selector)
// All 6 years are now browsable so users see the roadmap. Scaffold subjects
// render as "🚧 รอเพิ่มเนื้อหา" cards in HomeView (no exam mode entry).
export const YEARS = [
  { id: 1, label: 'ปี 1', available: true,  current: false, scaffold: true,  desc: 'Pre-clinic · Foundation' },
  { id: 2, label: 'ปี 2', available: true,  current: false, scaffold: true,  desc: 'Pre-clinic · Body Systems' },
  { id: 3, label: 'ปี 3', available: true,  current: false, scaffold: true,  desc: 'Paraclinic · Disease & Diagnostics' },
  { id: 4, label: 'ปี 4', available: true,  current: true,  scaffold: false, desc: 'Vet 86 · ปัจจุบัน' },
  { id: 5, label: 'ปี 5', available: true,  current: false, scaffold: true,  desc: 'Clinical Rotation · Specialty' },
  { id: 6, label: 'ปี 6', available: true,  current: false, scaffold: true,  desc: 'Internship · Externship' },
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
          lecturer: 'COM III Final 2019 past exam', lecturer_year: 2019,
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
    { id: 'repro', code: '3108410', name: 'Repro Lab', name_en: 'Companion Animal Reproduction Lab · สอบแยกแล้ว',
      icon: '🐾', color: '#b88940', semester: 2, has_questions: true,
      examFormat: {
        notes: [
          'Lab แยกจาก Lecture ชัดเจน · สอบนอกตารางไปแล้ว',
          'ข้อเดิมในคลังเป็น lab/practical style: vaginal cytology, dystocia, pyometra, cryptorchid, catheter, anatomy',
        ],
      } },
    { id: 'repro-lect', code: '3108409', name: 'Repro Lecture', name_en: 'Companion Animal Reproduction · Lecture',
      icon: '🐾', color: '#b88940', semester: 2, has_questions: true,
      // Collections: virtual "ทำรวม" cards that filter topics by prefix.
      // Used when a coherent block of topics deserves its own bundled exam
      // (e.g., หมาหอน 90 Q across 9 sub-topics, Term Paper 12 Q across 12).
      collections: [
        { id: '_mahahon-all', label: '🐺 รวมหมาหอน', sub: 'Master 86 — Blackboard caps + synthesized', topicPrefix: 'mahahon-', accent: '#8b3d2f' },
        { id: '_termpaper-all', label: '📜 รวม Term Paper', sub: 'Master 86 — 12 groups', topicPrefix: 'group', accent: '#5d4037' },
      ],
      examFormat: {
        weight: 'Final 40% · Lecture course 3108-409',
        examDate: '5 พ.ค. 2569 · 13:00-16:00 · VET6 B01-B03',
        choiceCount: 4,
        notes: [
          'ยึด Lecture 15-24 ปี 2026 เป็นแกนหลักก่อน แล้ว map ข้อสอบเก่าตามหัวข้อเดียวกัน',
          'Lab อยู่ subject แยกชื่อ Repro Lab เพราะสอบคนละรอบ',
          'ชุดข้อสอบยึดข้อสอบเก่า/recall รุ่นพี่เป็น source หลัก · cross-verify กับ slide 2026',
        ],
      },
      topics: [
        { id: 'hormonal-applications', label: 'Lect 15 · Hormonal applications', icon: '💊',
          lecturer: 'Suppawiwat Ponglowhapan (SP)', lecturer_year: 2026, schedule: '6 มี.ค. · Lect 15',
          lecturerNote: 'Synthetic hormones, adverse effects, pyometra/pseudopregnancy/contraception/diagnostic uses' },
        { id: 'semen-ai', label: 'Lect 16 · Semen evaluation + Breeding management + AI', icon: '🧪',
          lecturer: 'Theerawat Tharasanit (TT)', lecturer_year: 2026, schedule: '6 มี.ค. · Lect 16',
          lecturerNote: 'Dog/cat semen collection, semen evaluation, ovulation timing, vaginal vs intrauterine AI' },
        { id: 'semen-preservation', label: 'Lect 17 · Preserved semen', icon: '❄️',
          lecturer: 'Theerawat Tharasanit (TT)', lecturer_year: 2026, schedule: '13 มี.ค. · Lect 17',
          lecturerNote: 'Cryopreservation principle, CPA, LN2, freezing injury, thaw/evaluation' },
        { id: 'infertility', label: 'Lect 18 · Infertility problems', icon: '🔍',
          lecturer: 'Theerawat Tharasanit (TT)', lecturer_year: 2026, schedule: '13 มี.ค. · Lect 18',
          lecturerNote: 'Female + male infertility workup, P4 timing, Brucella, azoospermia/teratozoospermia, prostate' },
        { id: 'biotech', label: 'Lect 19 · Reproductive biotechnology', icon: '🧬',
          lecturer: 'Ampika Thongphakdee', lecturer_year: 2026, schedule: '20 มี.ค. · Lect 19',
          lecturerNote: 'ART in dogs/cats/wildlife models, IVF/IVM/IVC, embryo transfer, cloning, GRB/conservation' },
        { id: 'exotic-repro', label: 'Lect 20 · Exotic pets reproduction', icon: '🐇',
          lecturer: 'Chaowaphan Yinharnmingmongkol', lecturer_year: 2026, schedule: '20 มี.ค. · Lect 20',
          lecturerNote: 'Exotic reproductive overview · slide 2026 is scan-heavy, so paired with sunsun84/Kimchii notes' },
        { id: 'genetics', label: 'Lect 21 · Genetic considerations', icon: '🧬',
          lecturer: 'Nantapong Kamprasert (Bank · UNE Australia · external guest)', lecturer_year: 2026, schedule: '27 มี.ค. · Lect 21',
          lecturerNote: 'P = G + E, heritability, selection, EBV/BLUP/GBLUP, inbreeding risk' },
        { id: 'surgical-neutering', label: 'Lect 22 · Surgical neutering', icon: '✂️',
          lecturer: 'Sroisuda Chotimanukul (SC)', lecturer_year: 2026, schedule: '27 มี.ค. · Lect 22',
          lecturerNote: 'OHE/OE/orchiectomy techniques, ligation, tissue tag, closure, cryptorchid approaches' },
        { id: 'gonadectomy-risk', label: 'Lect 23 · Risk-benefit of neutering', icon: '⚖️',
          lecturer: 'Sroisuda Chotimanukul (SC)', lecturer_year: 2026, schedule: '3 เม.ย. · Lect 23',
          lecturerNote: 'Breed/age/sex-specific risk-benefit: mammary tumor, pyometra, BPH, USMI, orthopedic, tumors' },
        { id: 'repro-ultrasound', label: 'Lect 24 · Reproductive ultrasonography', icon: '🩻',
          lecturer: 'Suppawiwat Ponglowhapan (SP)', lecturer_year: 2026, schedule: '10 เม.ย. · Lect 24',
          lecturerNote: 'Pregnancy diagnosis, uterine/ovarian/prostatic/testicular disorders, fetal assessment' },

        // ── ข้อสอบหมาหอน (Master 86 — Blackboard caps + synthesized · 90 Q) ──
        { id: 'mahahon-hormone', label: '🐺 หมาหอน 1 — Hormone (Blackboard 10/10)', icon: '💊',
          lecturer: 'Suppawiwat Ponglowhapan (SP)', lecturer_year: 2026,
          lecturerNote: '10 ข้อจาก Blackboard quiz "Progestins to control feline reproduction" — Auto-grade ยืนยันคำตอบ (Master 86 p6-10)' },
        { id: 'mahahon-ultrasound', label: '🐺 หมาหอน 2 — Ultrasound (Blackboard 10/10 + ภาพ)', icon: '🩻',
          lecturer: 'Suppawiwat Ponglowhapan (SP)', lecturer_year: 2026,
          lecturerNote: '10 ข้อจาก Blackboard "diencephalon-telencephalic" quiz — Q4 Q5 Q6 Q7 Q10 มีภาพ U/S ประกอบ (CEH, Doppler, fluid uterus, estrus ovary, hydrocephalus)' },
        { id: 'mahahon-semen-freezing', label: '🐺 หมาหอน 3 — Semen freezing + Infertility', icon: '❄️',
          lecturer: 'Theerawat Tharasanit (TT)', lecturer_year: 2026,
          lecturerNote: '10 ข้อจาก Blackboard p14 — sperm morphology, hemospermia, anestrus, infectious infertility, ovulation timing' },
        { id: 'mahahon-semen-eval', label: '🐺 หมาหอน 4 — Semen evaluation (synthesized)', icon: '🔬',
          lecturer: 'Theerawat Tharasanit (TT)', lecturer_year: 2026,
          lecturerNote: '10 ข้อสังเคราะห์จาก slide 2026 Lect 16 — ejaculate fractions, UrCaPI, P4 timing, CASA, IUAI, fertilization window' },
        { id: 'mahahon-art', label: '🐺 หมาหอน 5 — ART พี่อิม (Blackboard p17)', icon: '🧬',
          lecturer: 'Ampika Thongphakdee (Zoological Park Org. Thailand)', lecturer_year: 2026,
          lecturerNote: '10 ข้อเกี่ยวกับ ICSI IVF SCNT embryo transfer cryopreservation — 8 ข้อจาก Blackboard และ 2 ข้อสังเคราะห์ (IVM duration, vitrification)' },
        { id: 'mahahon-exotic', label: '🐺 หมาหอน 6 — Exotic repro (Blackboard p22)', icon: '🐇',
          lecturer: 'Chaowaphan Yinharnmingmongkol', lecturer_year: 2026,
          lecturerNote: '10 ข้อ — rabbit chinchilla ferret reptile turtle reproductive med — gestation, OVH complications, sexing, dystocia' },
        { id: 'mahahon-risk-benefit', label: '🐺 หมาหอน 7 — Risk-benefit gonadectomy (synthesized)', icon: '⚖️',
          lecturer: 'Sroisuda Chotimanukul (SC)', lecturer_year: 2026,
          lecturerNote: '10 ข้อสังเคราะห์จาก Master 86 p26-30 — mammary tumor timing, USMI, MCT, osteosarcoma, obesity, behavior, pediatric, BPH/perianal, cat detriments' },
        { id: 'mahahon-genetic', label: '🐺 หมาหอน 8 — Genetic (synthesized)', icon: '🔬',
          lecturer: 'Nantapong Kamprasert (Bank — UNE Australia)', lecturer_year: 2026,
          lecturerNote: '10 ข้อสังเคราะห์จาก slide 2026 Lect 21 — inbreeding F, founder/bottleneck, linebreeding, Ne, heritability, CRISPR, breed screening, popular sire, ethics' },
        { id: 'mahahon-surgical', label: '🐺 หมาหอน 9 — Surgical neutering (synthesized)', icon: '✂️',
          lecturer: 'Sroisuda Chotimanukul (SC)', lecturer_year: 2026,
          lecturerNote: '10 ข้อสังเคราะห์จาก slide 2026 Lect 22 — OVH/OE, cryptorchidectomy, open/closed castration, ORS, pyometra emergency, ligation pitfalls, multimodal analgesia' },

        // ── ข้อสอบ Term Paper (Master 86 — 12 groups, 1 Q each) ──
        { id: 'group01-nutrition-neutered', label: '📜 Term Paper G1 — Nutrition for neutered dogs', icon: '🍽️', lecturer: 'Term Paper Group 1 (Master 86 p41)', lecturer_year: 2026 },
        { id: 'group02-bph-pharmacology', label: '📜 Term Paper G2 — BPH pharmacology (Deslorelin)', icon: '💊', lecturer: 'Term Paper Group 2 (Master 86 p41)', lecturer_year: 2026 },
        { id: 'group03-gene-editing', label: '📜 Term Paper G3 — Gene editing (ZFN/TALEN/CRISPR)', icon: '🧬', lecturer: 'Term Paper Group 3 (Master 86 p41-42)', lecturer_year: 2026 },
        { id: 'group04-dermato-repro', label: '📜 Term Paper G4 — Dermato-Reproductive (Alopecia X)', icon: '🐕', lecturer: 'Term Paper Group 4 (Master 86 p42)', lecturer_year: 2026 },
        { id: 'group05-felidae-infertility', label: '📜 Term Paper G5 — Felidae infertility (teratozoospermia)', icon: '🐅', lecturer: 'Term Paper Group 5 (Master 86 p42)', lecturer_year: 2026 },
        { id: 'group06-iugr-piglet', label: '📜 Term Paper G6 — IUGR in piglets', icon: '🐖', lecturer: 'Term Paper Group 6 (Master 86 p42-43)', lecturer_year: 2026 },
        { id: 'group07-ruminant-us-CL', label: '📜 Term Paper G7 — Ruminant US for CL function', icon: '🐄', lecturer: 'Term Paper Group 7 (Master 86 p43)', lecturer_year: 2026 },
        { id: 'group08-PAGs-ruminant', label: '📜 Term Paper G8 — PAGs pregnancy test', icon: '🩸', lecturer: 'Term Paper Group 8 (Master 86 p43)', lecturer_year: 2026 },
        { id: 'group09-placenta', label: '📜 Term Paper G9 — Comparative placentation', icon: '🫁', lecturer: 'Term Paper Group 9 (Master 86 p44)', lecturer_year: 2026 },
        { id: 'group10-heat-stress', label: '📜 Term Paper G10 — Heat stress + HPG axis', icon: '🌡️', lecturer: 'Term Paper Group 10 (Master 86 p44)', lecturer_year: 2026 },
        { id: 'group11-buserelin-pig', label: '📜 Term Paper G11 — GnRH agonist (Buserelin) in pig', icon: '💉', lecturer: 'Term Paper Group 11 (Master 86 p44)', lecturer_year: 2026 },
        { id: 'group12-NEB-dairy', label: '📜 Term Paper G12 — NEB postpartum dairy cow', icon: '🥛', lecturer: 'Term Paper Group 12 (Master 86 p45)', lecturer_year: 2026 },
      ] },

    // ── Poultry Health Management ──
    // Topics restructured 2026-04-29 to match 2026 final-scope slides
    // exactly (5 PDFs in /Slide Lecture 2026/ folder). Lectures 9-14
    // form the final scope per syllabus. Midterm-scope topics (lectures
    // 1-7: viral diseases, bacterial diseases) hidden by default — the
    // 52 Qs from "Final Exotic ไม่ใช่คำตอบ" might be midterm content
    // OR Year 5 Avian Med (Palm uncertain), so flagged accordingly.
    { id: 'poultry', code: '3107409', name: 'Poultry', name_en: 'Poultry Health Management',
      icon: '🐔', color: '#d97744', semester: 2, has_questions: true,
      // Collection: หมาหอน Poultry (high-yield exam-prep set, มาจาก TJ + Master 86)
      collections: [
        { id: '_mahahon-poultry-all', label: '🐺 รวมหมาหอน Poultry', sub: 'TJ + Master 86 + Master 86', topicPrefix: 'mahahon-poultry-', accent: '#d97744' },
      ],
      examFormat: {
        weight: 'Mid 105/200 (52.5%) · Final 90/200 (45%) · Class 5/200 (2.5%) · Letter Grade A-F',
        choiceCount: 5,
        notes: [
          '📅 Final scope (lectures 9-14) corrected per syllabus 2026 (myCourseVille):',
          '   L9 = Biosecurity (ณทยา) | L10-11 = Drugs (นิวัตร) | L12 = QA | L13 = Zoonosis (กมลพรรณ) | L14 = First-week mortality (เกรียงวิทย์)',
          '⚠️ ก่อนหน้านี้ผมเรียงผิด syllabus ทำให้ลำดับ L9-L14 สับสน แก้ตาม myCourseVille syllabus uploaded 6 พ.ค. 2026',
          '📅 Midterm scope (lectures 1-7) สอบไปแล้ว — viral/bacterial/vaccine/physiology · ซ่อนไว้ default',
          '⚠️ 52 ข้อจาก "Final Exotic ไม่ใช่คำตอบ.pdf" — Palm ตรวจแล้วเหมือนข้อมูลไม่ตรง scope · ซ่อนทั้ง batch ใน hidden topic "uncertain-scope"',
          '📋 Q types per topic: QA = T/F + MCQ · First-week mortality = MCQ · Avian zoonosis = MCQ · Drugs = MCQ',
        ],
      },
      topics: [
        // ── Final scope (Lectures 8-14 per syllabus 2026) ──
        { id: 'nutrition',            label: 'L8 · Animal Nutrition (อ.หทัยรัตน์) ★ Final scope!', icon: '🌾',
          lecturer: 'หทัยรัตน์ พลายมาศ (ผศ.ดร. · ปี 86)', lecturer_year: 2026, schedule: '2026-03-10 · L8 · Final scope',
          lecturerNote: '★ ก่อนนี้คิดว่าเป็น Mid scope แต่ syllabus ระบุชัดอยู่ใน Final · TJ มี 15 ข้อ Vet 85 · Protein & amino acids (Met/Lys/Thr most limiting · Lysine ref=100) · Cysteine+Tyrosine semi-essential · Linoleic essential fatty acid · Mineral (Ca:P ratio Broiler 2:1, Layer 10:1) · Phytate-P 60-80% need phytase · DEB 250 mEq/kg · Heat stress: Vit C+E + electrolytes · Coarse Ca 2-4mm for layer eggshell · Phase feeding (Starter Crumble/Grower/Finisher · Layer Starter/Developer/Layer)' },
        { id: 'biosecurity',          label: 'L9 · Biosecurity & Disease Surveillance', icon: '🛡',
          lecturer: 'Nataya Charoenvisal (ณทยา เจริญวิศาล · ผศ.สพ.ญ.ดร.)', lecturer_year: 2026, schedule: '2026-03-17 · L9 · Final scope',
          lecturerNote: 'Conceptual + Structural + Procedural biosecurity · Iceberg concept · Flock immunity · Sample size + Sensitivity/Specificity · Boot/cloacal/cleft palate swabs · Disease surveillance methods' },
        { id: 'avian-drugs',          label: 'L10-11 · Avian Drugs + Therapeutic Techniques', icon: '💊',
          lecturer: 'Niwat Chansiripornchai (Prof. · DTBVM · CU Vet)', lecturer_year: 2026, schedule: '2026-03-24 + 2026-03-31 · L10-11 · Final scope',
          lecturerNote: 'Aj. Niwat — Antimicrobial classification (cidal/static · dose/time-dependent) · Banned drugs in layer (Monensin/Salinomycin/Narasin/Maduramicin) · Banned in broiler (Nitrofurans/Nitroimidazoles/Chloramphenicol) · Ionophores · Piperazine for roundworm · External parasite (Dip best, Spray real-world) · No withdrawal: Neomycin' },
        { id: 'quality-assurance',    label: 'L12 · Quality Assurance', icon: '🏆',
          lecturer: 'Ekasingh Sareung (เอกสิงห์ สาเรือง · Betagro)', lecturer_year: 2026, schedule: '2026-04-07 · L12 · Final scope',
          lecturerNote: 'น.สพ.เอกสิงห์ สาเรือง — QA 5 ด้าน (Control/Audit/Accreditation/Assessment/Traceability) · PDCA · Food safety (Salmonella enteritidis/Typhimurium + AI · Chemical: drug, heavy metal, melamine, dioxin) · AMR (RAU/RWA/NAE) · 5 Freedoms · Labor (GLP/BLS/Sedex) · ISO 14000 · BQM' },
        { id: 'avian-zoonosis',       label: 'L13 · Avian Zoonosis', icon: '🧬',
          lecturer: 'Kamonpan Charoenkul (Vet Public Health, CU)', lecturer_year: 2026, schedule: '2026-04-07 · L13 · Final scope',
          lecturerNote: 'Avian zoonoses table — Bacteria (Chlamydiosis flu-like/pneumonia · Erysipelas erysipeloid · Avian TB · Salmonellosis · Campylobacter · Yersiniosis pseudo-appendicitis · Q Fever) · Yeast (Cryptococcosis) · Virus (NDV conjunctivitis · WNV encephalitis · AI flu-like)' },
        { id: 'first-week-mortality', label: 'L14 · First Week Mortality + Farm Management', icon: '🐣',
          lecturer: 'Kriengwich Limpavithayakul (เกรียงวิทย์ · coord)', lecturer_year: 2026, schedule: '2026-04-21 · L14 · Final scope',
          lecturerNote: 'อ.เกรียงวิทย์ — Industry profit + monitoring (FCR/Serology/Field/Lab) · Disease = virulence × frequency × dose · Broiler breeds in Thailand: Cobb 500, ROSS 308, Hubbard, Arbor Acres · Layer: Lohmann brown, ISA brown · Crob fulfill 24h 80-100% · UVC + cleaning before disinfect · Pasgar score: Legs/Beak/Naval/Belly/Reflex · Hetchy factor egg wet → infect · Splayed leg from heat stress · Broofing too cold/hot → vent pasting' },

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
        { id: 'midterm-disease',      label: 'L6-7 · Midterm Diseases', icon: '🦠',
          hidden: true,
          lecturer: 'Somsak Pakpinyo', lecturer_year: 2026, schedule: 'L6-7 · Midterm scope',
          lecturerNote: 'Acute death DDx · CAV/blue wing — 2 ข้อ' },

        // ── ข้อสอบหมาหอน Poultry (Final 86 high-yield prediction set) ──
        // Source: Poultry Final TJ.pdf (May 6, 2026) · 5 lecturer summaries
        { id: 'mahahon-poultry-biosec', label: '🐺 หมาหอน 1 — L9 Biosecurity (ณทยา) TJ', icon: '🛡',
          lecturer: 'Nataya Charoenvisal', lecturer_year: 2026,
          lecturerNote: 'จาก TJ p3-4 — Biosecurity 3 levels (Conceptual/Structural/Procedural) · Iceberg + flock immunity · Boot/Drag swab Salmonella · Cleft palate respiratory · Cloacal GI · Pair serum 2 wk · Sample size + Se/Sp · Risk score exponential' },
        { id: 'mahahon-poultry-drugs', label: '🐺 หมาหอน 2 — L10-11 Drugs (นิวัตร) TJ', icon: '💊',
          lecturer: 'Niwat Chansiripornchai', lecturer_year: 2026,
          lecturerNote: 'จาก TJ p5 — External parasite Dip > Spray · No withdrawal: Neomycin · Layer banned: Monensin/Salinomycin/Narasin/Maduramicin · Broiler banned: Nitrofurans/Nitroimidazoles/Chloramphenicol · Ionophores: Monensin/Salinomycin/Narasin · Roundworm: Piperazine' },
        { id: 'mahahon-poultry-qa', label: '🐺 หมาหอน 3 — L12 QA (เอกสิงห์) TJ', icon: '🏆',
          lecturer: 'Ekasingh Sareung', lecturer_year: 2026,
          lecturerNote: 'จาก TJ p6 — QA 5 components (QC/Audit/Accreditation/Assessment/Traceability) · PDCA · Food safety Bio (Salmonella + AI) Chem (drug/heavy metal/melamine/dioxin) · AMR RAU/RWA/NAE · Five Freedoms · Labor GLP/BLS/Sedex · ISO 14000 · BQM 4 มิติ' },
        { id: 'mahahon-poultry-zoonosis', label: '🐺 หมาหอน 4 — L13 Zoonosis (กมลพรรณ) TJ', icon: '🧬',
          lecturer: 'Kamonpan Charoenkul', lecturer_year: 2026,
          lecturerNote: 'จาก TJ p7 — Zoonosis table (Chlamydiosis flu-like/pneumonia · Erysipelas erysipeloid · Avian TB · Salmonella foodborne · Campylobacter · Yersiniosis pseudo-appendicitis · Q fever pneumonia · Cryptococcus respi/CNS · NDV conjunctivitis · WNV encephalitis · AI flu-like)' },
        { id: 'mahahon-poultry-firstweek', label: '🐺 หมาหอน 5 — L14 First-Week Mortality (เกรียงวิทย์) TJ', icon: '🐣',
          lecturer: 'Kriengwich Limpavithayakul', lecturer_year: 2026,
          lecturerNote: 'จาก TJ p8-9 — Disease = virulence × frequency × dose · Broiler Cobb 500/ROSS 308/Hubbard · Layer Lohmann/ISA brown · Crob fulfill 24h 80-100% · UVC for disinfect · ND/AI/IBD/IB/AE clinical signs · CAV → Blue wing disease · Splayed leg heat stress · Pasgar score 5 components · Hetchy egg wet → infection' },
        { id: 'mahahon-poultry-nutrition', label: '🐺 หมาหอน 6 — L8 Nutrition (อ.หทัยรัตน์) TJ + Master 86', icon: '🌾',
          lecturer: 'หทัยรัตน์ พลายมาศ (ผศ.ดร.)', lecturer_year: 2026,
          lecturerNote: 'จาก TJ p1-2 (15 ข้อ Vet 85) + Master 86 p4-7 — Limiting AAs: Methionine/Lysine/Threonine · Lysine ref=100 ทุก phase · Cysteine+Tyrosine = Semi-essential · Linoleic = Essential FA (Broiler >3%) · Phytate-P 60-80% ต้อง phytase · Ca:P ratio Broiler 2:1 / Layer 10:1 · DEB 250 mEq/kg · Heat stress: Vit C+E + electrolytes · Coarse Ca 2-4mm สำคัญต่อเปลือกไข่ · Layer Coarse:Fine 50:50 → 35:65 ตามอายุ · Broiler 3 phases (Starter Crumble/Grower/Finisher) · Developer diet hi-fiber + coarse → ชะลอเจริญ · Egg weight control: ลด Met+Cys + Linoleic' },
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
    // Vet Prac Rum — restructured 2026-05-03 to match 2026 ตารางสอน Final scope
    // (post-midterm Week 8-13). Coordinator: อ.รุจิกร (RJ).
    // Sunsun84 (Vet 84 / 2024) covers extra topics (hernia / esophageal /
    // eye / udder / tendon) flagged as `uncertain-scope` because 2026
    // ตารางสอนไม่ระบุชัด — บางหัวข้อปีก่อนเรียงไม่เหมือนกัน per Palm.
    { id: 'practrum', code: '3108412', name: 'Practice Ruminant', name_en: 'VET PRAC RUM',
      icon: '🐂', color: '#5c7d4a', semester: 2, has_questions: true,
      // Collection: หมาหอน Vet Prac Rum (high-yield exam-prep set)
      // 31 ข้อ จาก past paper Final 86 (verified TJ red highlight) +
      // อ.น้ำ silage/feed (10 ข้อปรนัย) + dystocia 12 presentations +
      // penile deviation/caudal epididymectomy (Palm friend tip)
      collections: [
        { id: '_mahahon-practrum-all', label: '🐺 รวมหมาหอน Vet Prac Rum', sub: 'Final 86 past paper + อ.น้ำ + ชี้แจงอาจารย์', topicPrefix: 'mahahon-practrum-', accent: '#5c7d4a' },
      ],
      examFormat: {
        weight: 'Mid + Final + ปฏิบัติการ',
        examDate: '6 พ.ค. 2569 (week 27 เม.ย. – 12 พ.ค.)',
        notes: [
          '📅 Final scope = post-midterm (Week 8-13) · 8 หัวข้อหลัก',
          '👨‍🏫 Course coordinator: อ.น.สพ.ดร.รุจิกร จงสุวรรณวัฒนา (RJ)',
          '🎯 ปฏิบัติการศัลยกรรม + สูติศาสตร์ + ตรวจสุขภาพ — เน้น vivid procedural details',
          '📦 Mined sources: Sunsun84 (Vet 84 mind map · 8 หน้า) + Lecture 2026 (Penile deviation · Rumenotomy slides)',
          '⚠️ Topics ที่ Sunsun84 มีแต่ตารางสอน 2026 ไม่ระบุชัด ซ่อนเป็น uncertain-scope',
        ],
      },
      topics: [
        // ── Final scope (Week 8-13 post-midterm) ──
        { id: 'penile-deviation', label: 'Week 8 · Penile Deviation + Caudal Epididymectomy', icon: '🩺',
          lecturer: 'Surgery staff (ST/TS/RJ/JSi/ES)', lecturer_year: 2026, schedule: '2 มี.ค. · Week 8',
          lecturerNote: 'Indications: heat detector bull / semen collecting bull · Sedation: Xylazine 0.05-0.1 mg/kg IM/IV · Local: Lidocaine 2% · ABO: Pendistrep L.A. 20,000 IU/kg IM · NSAID: Phenylbutazone 2-5 mg/kg IV · Topical: Banocin · Restraint: Hannover trolley' },
        { id: 'hoof-trim', label: 'Week 8/10-12 · Hoof Care + Trimming', icon: '🐾',
          lecturer: 'ผศ.น.สพ.ปิยะณัฐ ประสมศรี (PP)', lecturer_year: 2026, schedule: '2 มี.ค. + 16/23/30 มี.ค.',
          lecturerNote: '⚠️ ผู้สอนเปลี่ยน — ปี 83 (2023) Aj. ศิรินันท์ พรรณระวี สอน lameness · ปี 86 Aj. ปิยะณัฐ ประสมศรี (PP) สอนแทน — เนื้อหา core เทียบกันได้ (Treponema, sole ulcer, digital amputation) แต่ emphasis อาจต่างกัน · Routine claw care: foot bath + claw trimming · Infectious: digital dermatitis (Treponema) / foot rot (Fusobacterium necrophorum + Dichelobacter nodosus) / interdigital fibropapilloma · Non-infectious: laminitis (carb overload) / sole ulcer (lateral claw hindlimb) / interdigital fibroma (corn) · Digital amputation S2 = distal 3rd middle phalanx' },
        { id: 'animal-nutrition', label: 'Week 9 · Ruminant Nutrition · DMI', icon: '🌾',
          lecturer: 'ผศ.น.สพ.ปิยะณัฐ ประสมศรี (PP)', lecturer_year: 2026, schedule: '9 มี.ค. · ห้อง 203 ตึก 60 ปี · กรุงเทพฯ',
          lecturerNote: 'DMI calculation จากสูตรอาหาร · roughage:concentrate ratio · TMR vs partial mixed ration · เปรียบเทียบกับความต้องการโภชนะของโค' },
        { id: 'cow-restraint', label: 'Week 10-12 · Cow Restraint', icon: '🪢',
          lecturer: 'CN, CK, PD, AC, TA, SP + Husb Staff', lecturer_year: 2026, schedule: '16/23/30 มี.ค. · rotation',
          lecturerNote: 'Halter · casting (Reuff/Burley method) · squeeze chute · tail jack · Hannover trolley · safety considerations · ใช้ Leg rope พาดข้อเท้า' },
        { id: 'bovine-anesthesia', label: 'Week 10-12 · Bovine Local Anesthesia', icon: '💉',
          lecturer: 'Surgery staff', lecturer_year: 2026, schedule: '16/23/30 มี.ค. · rotation',
          lecturerNote: 'Auriculopalpebral block (motor fiber Orbicularis oculi) · Peterson n block (eyeball) · Paravertebral: Proximal (T13/L1/L2/L3 transverse process) vs Distal (T13/L1/L2/L4) · Epidural: @แพะแกะ lumbosacral · @วัว sacrococcygeal · Lidocaine 1 mg/5 kg = laparotomy · 7 kg = perineal · Cornual n block (dehorning)' },
        { id: 'parturition-fetotomy', label: 'Week 7+10-12 · Parturition + Fetotomy', icon: '🐮',
          hidden: true,
          lecturer: 'ST, TS, RJ, JSi, ES', lecturer_year: 2026, schedule: '16 ก.พ. (Lect V demo · Mid scope) + 16/23/30 มี.ค. (rotation practice)',
          lecturerNote: '⚠️ Hidden — theory was Week 7 (Mid scope demo · สาธิตการจัดท่า + Fetotomy) · re-encountered Week 10-12 practice rotation · scope cross-over uncertain → ซ่อนไว้จนกว่า Palm จะ confirm · 4 ข้อใน DB ภายใต้ topic นี้' },
        { id: 'rumenotomy', label: 'Week 13 · Rumenotomy', icon: '🐂',
          lecturer: 'ผศ.น.สพ.ดร.เอกพล อัครพุทธิพร (EA · Surgery)', lecturer_year: 2026, schedule: '20 เม.ย. · 09.00-12.00 · ห้อง 144',
          lecturerNote: 'อ.เอกพล (EA) Department of Veterinary Surgery · ปก slide 2026 ระบุชัด · Indications: hardware disease (TRP) · frothy bloat · FB · choke · vagal indigestion · persistent rumen impaction · exploration · Approach: Left flank paralumbar fossa standing · ห่างจาก last rib 3-5 cm · incision 20-25 cm · 2-layer closure (simple continuous + continuous Lembert · mid-term absorbable) · Complications: peritonitis · incisional infection · lack of improvement · Post-op: Flunixin 1.1-2.2 mg/kg IV + Procaine PCN 22-66k U/kg IM/SC ≥3 days' },
        { id: 'dehorning', label: 'Week 13 · Dehorning', icon: '🐃',
          lecturer: 'Surgery staff (อ.เอกพล + team)', lecturer_year: 2026, schedule: '20 เม.ย. · 13.00-16.00 · ห้อง 144',
          lecturerNote: 'Cornual n block + Lidocaine ยาชา · อายุ <2m = Horn bud → Debudding (hoof knife/tube/calf dehorner gauge/50% CaCl2) · adult = Tube/Robert dehorner · Obstetric wire (Gigli) · Risk: frontal sinus fracture → sinusitis/empyema · Tx open drainage = Trephination ~2.5cm' },

        // ── Uncertain scope (Sunsun84 ครอบคลุม · 2026 ตารางไม่ระบุ) ──
        { id: 'uncertain-scope', label: '❓ Uncertain Scope · Hernia/Esophageal/Eye/Udder/Tendon',
          icon: '❓', hidden: true,
          lecturer: 'TBD — Sunsun84 (Vet 84) ครอบคลุม 25 ข้อ',
          lecturerNote: 'พี่มด (5 hernia) + พี่ลี (5 esophageal) + พี่พล (5 head/neck/eye) + พี่ดิติศักดิ์ (5 udder/teat T/F) + พี่แนน (5 foot/tendon) · ปีก่อนอาจ midterm · ปี 86 ตารางไม่เห็นชัด — ซ่อนไว้ก่อนรอ verify' },

        // ── ข้อสอบหมาหอน Vet Prac Rum (Final 86 high-yield prediction set) ──
        { id: 'mahahon-practrum-surgery', label: '🐺 หมาหอน 1 — ภาคศัลย์ (Past paper Q1-10 verified)', icon: '🔪',
          lecturer: 'อ.วิมล + อ.เอกพล (Surgery)', lecturer_year: 2026,
          lecturerNote: '10 ข้อจาก (Final) Prac Rum Final 86 PDF · verified จาก TJ red highlights + พี่พล/sunsun84 ค่าตอบ · rumen anatomy, rumenotomy indications/closure, calf NPO, xylazine dose, lidocaine duration, paravertebral L1, caudal epidural S5-C1, propofol NOT used' },
        { id: 'mahahon-practrum-silage', label: '🐺 หมาหอน 2 — Silage Quality (อ.น้ำ ชี้แจง)', icon: '🌽',
          lecturer: 'อ.น้ำ', lecturer_year: 2026,
          lecturerNote: '5 ข้อ ปรนัย — อ.น้ำบอกแนวข้อสอบ "ชนิดของอาหารหยาบและประเมินคุณภาพอาหารหยาบหมัก" · หัวข้อหลัก: กลิ่น (เปรี้ยว lactic) · pH<4 · สี (เขียวปนน้ำตาล) · ความชื้น 60-70% · ระยะเวลาหมัก 21d ขั้นต่ำ' },
        { id: 'mahahon-practrum-feed', label: '🐺 หมาหอน 3 — Feed Mgmt (อ.น้ำ formulas)', icon: '📐',
          lecturer: 'อ.น้ำ', lecturer_year: 2026,
          lecturerNote: '5 ข้อ — สูตร DMI, R:C ratio (50:50 high-yield), Particle size >19mm peNDF, NEL คือ, NDF vs ADF · จาก Feed mgt page ของ (Final) PDF p2' },
        { id: 'mahahon-practrum-dystocia', label: '🐺 หมาหอน 4 — Dystocia Drawing Prep', icon: '🎨',
          lecturer: 'Surgery/สูติฯ staff', lecturer_year: 2026,
          lecturerNote: '5 ข้อ (2 match-type 12 ท่า A-L + 3 MCQ correction) · อาจารย์บอกออกข้อสอบวาดรูปคลอดยาก ต้องเตรียมดินสอ+ยางลบ · หมาหอนนี้ฝึก map ชื่อ/ท่า ก่อน + รู้วิธี mutation ก่อนวาด' },
        { id: 'mahahon-practrum-penile', label: '🐺 หมาหอน 5 — Penile Deviation + Caudal Epididymectomy', icon: '🐂',
          lecturer: 'Surgery staff', lecturer_year: 2026,
          lecturerNote: '6 ข้อ — Palm เพื่อนถามมา · อ.บอกอ่านคร่าวๆ ให้รู้หลักการ · 3 types penile deviation (spiral/ventral/S-shape) + apical ligament + reinforcement surgery + caudal epididymectomy → teaser bull concept' },
      ] },
    // Clin App Rum — restructured 2026-05-03 from scratch
    // Coordinator scope text confirms อ.ศวิตา (Sawita) 3 lectures × 15 ข้อ = 45 Q (main)
    // Master compilation "Clin App Ruminant - Final.pdf" = 5 sections (Metabolism + Anes + GI + ...)
    // PDF→PNG conversion used (avoid 7MB+ image render bug)
    { id: 'cliapprum', code: '3108411', name: 'Clinical App Rumen', name_en: 'VET CLI APP RUM',
      icon: '🐄', color: '#7d5a44', semester: 2, has_questions: true,
      // Collection: หมาหอน Clin App Rum (high-yield mine from TJ + Tomato compilations)
      collections: [
        { id: '_mahahon-cliapprum-all', label: '🐺 รวมหมาหอน Clin App Rum', sub: 'TJ Vet 86 + 🍅 Tomato + Vet 85 markers', topicPrefix: 'mahahon-cliapprum-', accent: '#7d5a44' },
      ],
      examFormat: {
        weight: 'คาบละ 15 คะแนน · จำนวนข้อขึ้นกับอาจารย์',
        examDate: '8 พ.ค. 2569',
        choiceCount: 4,
        notes: [
          '✴️ อ.ศวิตา (Sawita): 3 คาบ × 15 ข้อ = 45 ข้อ (main scope per scope text)',
          '🎯 Topics: GI Surgery (Sawita) + Anesthesia (อ.ภัทร์มนฉัตร PB) + Metabolism/Nutrition + GI VDTT + Hoof Health',
          '📦 Mined: Clin App Ruminant - Final.pdf master + Ruminant_Anesthesia.pdf + scope text',
          '⚠️ การประเมินสุขภาพ holistic — Feces Score / Locomotion Score / DMI / NEFA / BHBA',
        ],
      },
      topics: [
        { id: 'metabolism-nutrition', label: 'Metabolism & Nutrition in Dairy Cows', icon: '🌾',
          lecturer: 'ผศ.น.สพ. ปิยะณัฐ ประสมศรี (Piyanat Prasomsri, PP)', lecturer_year: 2026,
          lecturerNote: 'อ.ปิยะณัฐ (PP) สอนทั้ง Metabolism+Nutrition และ Hoof Health ใน Clin App Rum 2026 · Clinical Dashboard Framework 5 sections: DMI / Nutritional values / Nutrient requirements / R:C ratio + milk fat / Particle size · Transition period · Subclinical Ketosis · NEB · Feces Score 1-5 · Locomotion Score 1-5 · BCS' },
        { id: 'ruminant-anesthesia', label: 'Ruminant Anesthesia', icon: '💉',
          lecturer: 'อ.ภัทร์มนฉัตร บุนนาค (PB) [จัดทำโดย รศ.สุมิตร ดุรงค์พงษ์ธร]', lecturer_year: 2026,
          lecturerNote: 'Local + General anesthesia · ET intubation · Patient prep (PE/lab/fasting · Cow 24-48h food / 12-24h water) · Catheters jugular 14ga · Maintenance fluid 4-8 ml/kg/h · Hypotension correction 10-25 ml/kg/h · Potential GA problems: regurgitation (active vs passive) / bloat / respiratory complication / hypoventilation / nerve paralysis · Preanesthetics: Anticholinergics · Sedatives: Benzodiazepines + Phenothiazines · Local: Auriculopalpebral / Peterson / Retrobulbar / Paravertebral / IV regional (Bier block)' },
        { id: 'gi-surgery-sawita', label: 'GI Surgery (Sawita 3 lectures · 45 ข้อ)', icon: '🔪',
          lecturer: 'อ.ศวิตา สันติวิภารัตน์ (SS)', lecturer_year: 2026,
          lecturerNote: '⭐ MAIN SCOPE 45 Q · 3 lectures: GI Surgery I/II/III · Topics: Rumenotomy / LDA + RDA correction (right omentopexy + left abomasopexy) / Abomasal volvulus / Cecal dilatation & dislocation (CDD) · Typhlotomy / Trocharization for bloat / TRP (Hardware disease) management' },
        { id: 'gi-vdtt', label: 'GI Medicine (VDTT)', icon: '🩺',
          lecturer: 'ผศ.น.สพ. ธนศักดิ์ บุญเสริม (TB)', lecturer_year: 2026,
          lecturerNote: 'อ.ธนศักดิ์ (TB) จากปก slide 2026 GI_VDTT.pdf · "Ruminant Gastrointestinal Disorder" · Internal medicine approach: GI atony / Hyper-Hypomotility / Acidosis (pH <5.5) / Alkalosis (>7.0 inactivate rumen) / Methylene blue test (3-6 min normal) / Sediment activity 4-8 min / Gram stain rumen fluid (gram+ predominate normal · gram- shift = acidosis)' },
        { id: 'hoof-health-fleet', label: 'Hoof Health Management ในฝูง', icon: '🐾',
          lecturer: 'ผศ.น.สพ. ปิยะณัฐ ประสมศรี (PP)', lecturer_year: 2026,
          lecturerNote: 'อ.ปิยะณัฐ (PP · pptx slide 1 ระบุ) สอนทั้ง Vet Prac Rum hoof+nutrition และ Clin App Rum hoof fleet · Framework 4 elements (T-L-I-I): Timing (work flow น้อย คนน้อย โคเดินอิสระ เวลาประณีต) · Location (พื้นเรียบไม่ลาด · ระยะเดิน ≥4m) · Identification (ครบทุกตัว) · Interpretation (มี RT ปีละ 2 ครั้ง vs ไม่มี RT) · Routine trimming 6-12 เดือน · Sole ulcer / White line / Infectious / Laminitis (feeding mgt) / Iatrogenic' },
        // ── ข้อสอบหมาหอน Clin App Rum (high-yield prediction from TJ Vet 86 + Tomato)
        // Source: Clin approach final TJ.pdf p1-3 (Vet 86 reorganized + Vet 85/84 markers) + 🍅clin rum final🐄.pdf p13-30 (Sawita GI/Loco/Respi)
        { id: 'mahahon-cliapprum-anes', label: '🐺 หมาหอน 1 — Anesthesia (อ.ภัทร์มนฉัตร) TJ', icon: '💉',
          lecturer: 'อ.ภัทร์มนฉัตร บุนนาค', lecturer_year: 2026,
          lecturerNote: 'จาก TJ p1-2 — General anes problems (regurg/bloat/respi/hypovent/nerve paralysis) + Diazepam vs Midazolam (insoluble vs water-soluble) + Acepromazine ระวัง bull (penile prolapse) + Xylazine sensitivity Brahmans>Hereford>Holstein + Standing sedation 0.1-0.2 mg/kg + Lidocaine toxic 10 mg/kg + Peterson block (enucleation) + Bier block + Paravertebral T13/L1/L2 vs L1/L2/L4 + Epidural lumbosacral (small) vs sacrococcygeal (cattle)' },
        { id: 'mahahon-cliapprum-givdtt', label: '🐺 หมาหอน 2 — GI Internal Med (อ.ธนศักดิ์) TJ ปี 85', icon: '🩺',
          lecturer: 'อ.ธนศักดิ์ บุญเสริม', lecturer_year: 2026,
          lecturerNote: 'จาก TJ p3 — Vet 85 ตรง 10 ข้อ + Vet 84 8 ข้อ — Signs ของ GI dysfunction + Wither test grunting + Ping sound right (RDA, RTA) + Feces oily sheen = LDA + Methylene blue <3 min = grain engorgement + Rumen pH 5.5-7.5 normal + Rumen contraction 1-2/3min + Foamy bloat hypermotility early phase' },
        { id: 'mahahon-cliapprum-sawita-gi', label: '🐺 หมาหอน 3 — Sawita GI Surgery I+II (Hernia)', icon: '🔪',
          lecturer: 'อ.ศวิตา สันติวิภารัตน์', lecturer_year: 2026,
          lecturerNote: 'จาก Sawita I+II 2026 slide + 🍅 Tomato p13-15 — Hernia composition (ring/content/sac) + Umbilical (T. pyogenes infection, conservative <2cm vs sx >5cm, mesh >10-15cm) + Inguinal scrotal (Beef>Dairy, Polled Hereford, Lt>Rt, 1-2 fingers normal vs >4 fingers risk) + Diaphragmatic (water buffalo more susceptible, reticulum common content, ventilator + 2-phase surgery for adult) + Lidocaine vs Bupivacaine onset/duration' },
        { id: 'mahahon-cliapprum-piyanat-hoof', label: '🐺 หมาหอน 4 — Hoof Health (อ.ปิยะณัฐ) 🍅', icon: '🐾',
          lecturer: 'ผศ.น.สพ. ปิยะณัฐ ประสมศรี (PP)', lecturer_year: 2026,
          lecturerNote: 'จาก 🍅 Tomato p20-24 (อ.ปิยะณัฐ hoof health คาบ) — Lameness 90/90 rule (90% from claw, 90% lateral claw) + Sole 8mm thick + Foot bath 4% formalin หรือ 5% Cu/Zn sulfate + DD M0-M4 staging (Treponema) + Foot rot (Fusobact necrophorum + Dichelobacter, penicillin G) + Laminitis pathway (carb→acidosis→endotoxin→histamine→MMP) + Sole ulcer wooden block opposite + Digital amputation S1/S2/S3 levels + 4-point nerve block. ⚠️ ตอน 2026 Sawita III ไม่สอน loco/hoof — ย้ายมาที่ topic นี้เพื่อตรงผู้สอนจริง' },
        { id: 'mahahon-cliapprum-sawita-respi', label: '🐺 หมาหอน 5 — Sawita Head/Respi/Eye/Udder/Urinary (Sawita III 2026)', icon: '👁',
          lecturer: 'อ.ศวิตา สันติวิภารัตน์', lecturer_year: 2026,
          lecturerNote: 'จาก Sawita III 2026 slide (HEAD REGION + RESPIRATORY SURGERY) + 🍅 Tomato p17-19, p25-26 — Dehorning age (<2m bud / 2-4m connect frontal / >4m sinus open) + Cornual nerve block 2% lidocaine 3-10ml + Methods (chemical paste KOH/NaOH young / thermal portable / cutting / cosmetic) + Sinusitis (frontal > maxillary, trephination 4cm caudal to orbit + lavage 10-12 days) + Esophageal choke (cervical FB, orogastric tube swallow reflex test) + Enucleation (Auriculopalpebral + Retrobulbar 4-point 15ml lidocaine) + Udder/Teat surgery + Urethrostomy (low urethrostomy at distal sigmoid flexure)' },
        // Hidden — legacy Vet 84 past-paper Qs (Q136 BSP, Q139 patella) ที่อยู่นอก 2026 scope
        { id: 'uncertain-scope', label: '❓ Uncertain Scope · Tendon Sx (legacy Vet 84)', icon: '❓',
          hidden: true,
          lecturer: 'TBD — legacy ปี 84 past-paper Qs', lecturer_year: 2024,
          lecturerNote: 'Q136 (Medial patella desmotomy) + Q139 (BSP type) จาก Vet 84 past paper · ไม่ตรงตาม Clin App Rum 2026 scope (Sawita = GI surgery) · ซ่อนไว้รอ verify' },
      ] },

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

    // ─── Year 4 sem 1 — scaffold (Vet 86 academic 2025/1, Aug-Dec 2025)
    // Already passed for Vet 86; keeping as scaffolds in case anyone
    // wants to back-fill notes/Q from old slides + past papers.
    // Source: MCV (CourseVille) academic 2025/1.
    { id: 'com1', code: '3107415', name: 'อายุรศาสตร์สัตว์เล็ก I',
      name_en: 'Companion Animal Clinical Sciences I',
      icon: '🐕', color: '#5d8b8b', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['rosama-pusoonthornthum', 'sitilak-surachetpong', 'sukullaya-ritthikulprasert'],
      topics: [] },
    { id: 'com2', code: '3106414', name: 'อายุรศาสตร์สัตว์เล็ก II',
      name_en: 'Companion Animal Clinical Sciences II',
      icon: '🐩', color: '#3d6b82', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['krissda-boonaramrueng', 'kumpanart-soontornvipart'],
      topics: [] },
    { id: 'surg1', code: '3106415', name: 'ปฏิบัติศัลยศาสตร์ I',
      name_en: 'Veterinary Surgery Laboratory I',
      icon: '🔪', color: '#c26d6d', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['kumpanart-soontornvipart', 'chalika-wangdee', 'ekkapol-akkraputtiporn'],
      topics: [] },
    { id: 'swine-herd', code: '3107408', name: 'สุขศาสตร์ฝูงสุกร',
      name_en: 'Swine Herd Health Management',
      icon: '🐖', color: '#c26d8e', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['athipoo-nuntaprasert', 'pornchalit-assavacheep', 'suphot-wattanaphansak', 'roongtham-kedkovid'],
      topics: [] },
    { id: 'swine-repro', code: '3108404', name: 'การสืบพันธุ์ในสุกร',
      name_en: 'Swine Reproduction',
      icon: '🐷', color: '#b88940', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['padet-tummaruk', 'nutthee-am-in'],
      topics: [] },
    { id: 'vet-imaging', code: '3106413', name: 'การถ่ายภาพทางสัตวแพทย์',
      name_en: 'Veterinary Imaging',
      icon: '🩻', color: '#6b5d8e', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['nan-choisunirachon', 'chutimon-thanaboonnipat'],
      topics: [] },
    { id: 'food-safety-y4', code: '3109401', name: 'ความปลอดภัยอาหาร',
      name_en: 'Food Safety',
      icon: '🥩', color: '#a73d4a', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['alongkorn-amonsin', 'rungtip-chuanchuen', 'suphachai-nuanualsuwan', 'taradon-luangtongkum', 'saharuetai-jeamsripong'],
      topics: [] },
    { id: 'vet-juris', code: '3100403', name: 'กฎหมาย จริยธรรม + สวัสดิภาพสัตว์',
      name_en: 'Veterinary Jurisprudent, Ethics, and Animal Welfare',
      icon: '⚖️', color: '#5d7d8b', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['kaywalee-chatdarong'], topics: [] },
    { id: 'engprof1', code: '5500418', name: 'English for Vet Profession I',
      name_en: 'English for Veterinary Profession I',
      icon: '🗣️', color: '#5c6b7d', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['culi-eng-vet-prof-i'], topics: [] },
    { id: 'herd-health-rum', code: '3107407', name: 'สุขศาสตร์ฝูงโค-กระบือ',
      name_en: 'Herd Health Management in Ruminants',
      icon: '🐂', color: '#5c7d4a', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['kittisak-ajariyakhajorn', 'chaidate-inchaisri', 'siriwat-suadsong', 'piyanat-prasomsri'],
      topics: [] },
  ],

  // ════════════════════════════════════════════════════════════════════
  // SCAFFOLD — Years 1, 2, 3, 5, 6 (added 2026-05-08)
  // ════════════════════════════════════════════════════════════════════
  // Subjects below are placeholders — `scaffold: true` flags them as
  // "📋 รอเพิ่มเนื้อหา" in HomeView. No Q files yet, no exam mode entry.
  // Source: vault `knowledge/instructors/_index.md` (135 profiles) +
  //         `_meta` curriculum research 2026-05-08 + agent scaffold pass.
  //
  // Course codes:
  //   - Confirmed (no TBD-) when matching existing Y4 codes (3107417 etc.)
  //   - `TBD-31xxxxx` = pattern-derived guess; verify with Chula registrar
  //     before locking IDs. Pattern: 31 D Y X X X (D=dept, Y=year tier).
  //
  // Lecturer info attached as `vault_lecturers: ['slug-1', 'slug-2']` —
  //   these are vault profile slugs. App ignores this field for now;
  //   used as ground truth when content arrives.
  // ════════════════════════════════════════════════════════════════════

  // ─── Year 1 · Pre-clinic Foundation ──────────────────────────────
  // Subject codes + names from MCV (CourseVille) for Vet 86 cohort
  // (academic year 2022/1 + 2022/2). Gen-ed courses (Chemistry for
  // Health, Plants & Humanity, etc.) are intentionally omitted —
  // VetMock only models vet-specific exams.
  1: [
    { id: 'intro-vet', code: '3100102', name: 'สัตวแพทย์ปริทรรศน์',
      name_en: 'Perspectives in Veterinary Profession',
      icon: '🩺', color: '#5d8b8b', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'biology-lab', code: '3100101', name: 'ปฏิบัติการชีววิทยาสำหรับสัตวแพทย์',
      name_en: 'Biology Laboratory for Veterinary Student',
      icon: '🧬', color: '#4a7d6b', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'comp-app', code: '3101101', name: 'การประยุกต์คอมพิวเตอร์ในวิชาชีพ',
      name_en: 'Computer Application in Profession',
      icon: '💻', color: '#6b5d8e', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'biochem-1', code: '3102113', name: 'ชีวเคมี I',
      name_en: 'Biochemistry I',
      icon: '🧪', color: '#8b6b3d', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'vet-dev-anat', code: '3101102', name: 'คัพภวิทยาทางสัตวแพทย์',
      name_en: 'Veterinary Developmental Anatomy',
      icon: '🥚', color: '#7d5a8b', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'vet-anat-1', code: '3101103', name: 'กายวิภาคสัตว์ I',
      name_en: 'Veterinary Anatomy I',
      icon: '🦴', color: '#c26d6d', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['paisan-tianthailand', 'kongkiat-srisuwattanaskul'], topics: [] },
  ],

  // ─── Year 2 · Pre-clinic Body Systems ────────────────────────────
  // From MCV academic 2023/1 + 2023/2.
  2: [
    { id: 'vet-histo', code: '3101206', name: 'จุลกายวิภาคสัตวแพทย์',
      name_en: 'Veterinary Histology',
      icon: '🔬', color: '#7d5a8b', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['kongkiat-srisuwattanaskul', 'wuthichai-klomkliao', 'damri-daraviroj'],
      topics: [] },
    { id: 'vet-anat-2', code: '3101210', name: 'กายวิภาคสัตว์ II',
      name_en: 'Veterinary Anatomy II',
      icon: '🫀', color: '#c26d6d', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['paisan-tianthailand', 'saritvich-pannyabaribun', 'benchaphorn-limcharoen'],
      topics: [] },
    { id: 'vet-physio-1', code: '3102203', name: 'สรีรวิทยาสัตว์ I',
      name_en: 'Veterinary Physiology I',
      icon: '⚡', color: '#5d7d8b', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['sumpun-thammacharoen', 'chollada-buranakarl', 'anusak-kijtawornrat', 'kittipong-tachampa', 'suwanakiet-sawangkoon'],
      topics: [] },
    { id: 'vet-physio-lab-1', code: '3102206', name: 'ปฏิบัติการสรีรวิทยา I',
      name_en: 'Veterinary Physiology Laboratory I',
      icon: '🧫', color: '#5d7d8b', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'biochem-2', code: '3102215', name: 'ชีวเคมี II',
      name_en: 'Biochemistry II',
      icon: '🧪', color: '#8b6b3d', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['gunnaporn-suriyaphol', 'sariya-asawakarn', 'meena-sarikaphuti', 'sirakarnt-dhitavat', 'prapruddee-piyaviriyakul'],
      topics: [] },
    { id: 'husbandry-2', code: '3103212', name: 'หลักสัตวบาล II',
      name_en: 'Principle of Animal Husbandry II',
      icon: '🐄', color: '#5c7d4a', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['chackrit-nuengjamnong', 'boonrit-thongsong', 'chatree-ketviraveach', 'talerngsak-angkuraseranee'],
      topics: [] },
    { id: 'vet-neuroanat', code: '3101209', name: 'ประสาทกายวิภาคสัตว์',
      name_en: 'Veterinary Neuroanatomy',
      icon: '🧠', color: '#c26d6d', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'vet-physio-2', code: '3102204', name: 'สรีรวิทยาสัตว์ II',
      name_en: 'Veterinary Physiology II',
      icon: '💓', color: '#5d7d8b', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['sumpun-thammacharoen', 'kris-angkanaporn', 'sutthasinee-poonyachoti', 'sarinee-kalandakanond-thongsong'],
      topics: [] },
    { id: 'vet-physio-3', code: '3102205', name: 'สรีรวิทยาสัตว์ III',
      name_en: 'Veterinary Physiology III',
      icon: '🫁', color: '#5d7d8b', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['saikaew-sutayatram', 'sumonwan-chamsuwan'], topics: [] },
    { id: 'vet-physio-lab-2', code: '3102207', name: 'ปฏิบัติการสรีรวิทยา II',
      name_en: 'Veterinary Physiology Laboratory II',
      icon: '🧫', color: '#5d7d8b', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'animal-breeding', code: '3103215', name: 'การปรับปรุงพันธุ์สัตว์',
      name_en: 'Animal Breeding',
      icon: '🧬', color: '#4a7d6b', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['chatree-ketviraveach', 'talerngsak-angkuraseranee', 'praopilas-phakdeedindan', 'nantapong-kamprasert'],
      topics: [] },
    { id: 'vet-parasit-1', code: '3105201', name: 'ปรสิตวิทยาทางสัตวแพทย์ I',
      name_en: 'Veterinary Parasitology I',
      icon: '🪱', color: '#8b6b3d', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['sonthaya-tiawsirisup', 'morakot-kaewthamasorn', 'piyanan-taweethavonsawat', 'woraporn-sukhumavasi'],
      topics: [] },
    { id: 'vet-microbio-1', code: '3110201', name: 'จุลชีววิทยาทางสัตวแพทย์ I',
      name_en: 'Veterinary Microbiology I',
      icon: '🦠', color: '#7d5a8b', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['pattrarat-chanchaithong', 'nuvee-prapasarakul', 'aunyaratana-tonteerawong'],
      topics: [] },
  ],

  // ─── Year 3 · Paraclinic (Disease & Diagnostics) ─────────────────
  // From MCV academic 2024/1 + 2024/2.
  3: [
    { id: 'lab-animal', code: '3103305', name: 'สัตว์ทดลอง',
      name_en: 'Laboratory Animal Science',
      icon: '🐭', color: '#a78b3d', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'field-husbandry', code: '3103303', name: 'ปฏิบัติงานสัตวบาลภาคสนาม',
      name_en: 'Field Practice in Animal Husbandry',
      icon: '🚜', color: '#5c7d4a', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['chackrit-nuengjamnong', 'ajjima-chansaenroj', 'chaidate-inchaisri'],
      topics: [] },
    { id: 'vet-path-1', code: '3105301', name: 'พยาธิวิทยาทางสัตวแพทย์ I',
      name_en: 'Veterinary Pathology I',
      icon: '🔬', color: '#c26d6d', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['somporn-techangamsuwan', 'nopadon-pirarat', 'anudep-rungsipipat', 'roongroje-thanawongnuwech', 'wijit-banlunara', 'theerayuth-kaewamatawong'],
      topics: [] },
    { id: 'vet-parasit-2', code: '3105305', name: 'ปรสิตวิทยาทางสัตวแพทย์ II',
      name_en: 'Veterinary Parasitology II',
      icon: '🪱', color: '#8b6b3d', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['sonthaya-tiawsirisup', 'morakot-kaewthamasorn', 'piyanan-taweethavonsawat', 'woraporn-sukhumavasi'],
      topics: [] },
    { id: 'biostat', code: '3107302', name: 'ชีวสถิติ',
      name_en: 'Biostatistics',
      icon: '📊', color: '#3d6b82', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'vet-pharm-1', code: '3104306', name: 'เภสัชวิทยาทางสัตวแพทย์ I',
      name_en: 'Veterinary Pharmacology I',
      icon: '💊', color: '#6b5d8e', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['nipattra-suwanpairintr', 'piyarat-chansiripornchai', 'chenpop-sawangmake', 'kananuch-vasunthararaksa'],
      topics: [] },
    { id: 'vet-microbio-2', code: '3110306', name: 'จุลชีววิทยาทางสัตวแพทย์ II',
      name_en: 'Veterinary Microbiology II',
      icon: '🦠', color: '#7d5a8b', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['sanipa-suradhat', 'dachrit-nilubol', 'teerawut-nedumpun', 'navapon-techakriengkrai'],
      topics: [] },
    { id: 'vet-immuno', code: '3110307', name: 'วิทยาภูมิคุ้มกันทางสัตวแพทย์',
      name_en: 'Veterinary Immunology',
      icon: '🛡', color: '#7d5a8b', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['sanipa-suradhat', 'teerawut-nedumpun'], topics: [] },
    { id: 'animal-nutrition', code: '3103304', name: 'โภชนศาสตร์สัตว์',
      name_en: 'Animal Nutrition',
      icon: '🌾', color: '#a78b3d', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['kris-angkanaporn', 'hatairat-plaimast', 'anongnart-assavacheep', 'boonrit-thongsong', 'saranporn-poothong'],
      topics: [] },
    { id: 'vet-clin-chem', code: '3102315', name: 'วิเคราะห์ทางคลินิก',
      name_en: 'Veterinary Clinical Chemistry',
      icon: '🧪', color: '#a73d4a', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['yaowalak-panyasing', 'namphung-suemanotham', 'araya-radtanakatikanon'],
      topics: [] },
    { id: 'principles-vet-med', code: '3107303', name: 'หลักอายุรศาสตร์สัตวแพทย์',
      name_en: 'Principles of Veterinary Medicine',
      icon: '🩺', color: '#3d6b82', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['rosama-pusoonthornthum', 'sitilak-surachetpong', 'nattawan-tangmahakul'],
      topics: [] },
    { id: 'vet-pharm-2', code: '3104307', name: 'เภสัชวิทยาทางสัตวแพทย์ II',
      name_en: 'Veterinary Pharmacology II',
      icon: '💊', color: '#6b5d8e', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['nipattra-suwanpairintr', 'piyarat-chansiripornchai'], topics: [] },
    { id: 'vet-tox', code: '3104308', name: 'พิษวิทยาทางสัตวแพทย์',
      name_en: 'Veterinary Toxicology',
      icon: '☠️', color: '#a73d4a', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['kananuch-vasunthararaksa'], topics: [] },
    { id: 'vet-path-2', code: '3105302', name: 'พยาธิวิทยาทางสัตวแพทย์ II',
      name_en: 'Veterinary Pathology II',
      icon: '🔬', color: '#c26d6d', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['somporn-techangamsuwan', 'nopadon-pirarat', 'komkrich-tiankam', 'sawang-kesdangsakonwut'],
      topics: [] },
    { id: 'vet-clin-immuno', code: '3110308', name: 'วิทยาภูมิคุ้มกันคลินิก',
      name_en: 'Veterinary Clinical Immunology',
      icon: '🛡', color: '#7d5a8b', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['sanipa-suradhat'], topics: [] },
    { id: 'vet-hema-cytology', code: '3105303', name: 'โลหิตวิทยา + เซลล์วิทยา',
      name_en: 'Veterinary Hematology and Cytology',
      icon: '🩸', color: '#a73d4a', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['yaowalak-panyasing', 'namphung-suemanotham'], topics: [] },
    { id: 'vet-anesth', code: '3106302', name: 'วิสัญญีวิทยาทางสัตวแพทย์',
      name_en: 'Veterinary Anesthesiology',
      icon: '😴', color: '#6b5d8e', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['sumit-durongphongtorn', 'pattaramonchat-bunnak'], topics: [] },
    { id: 'principles-vph', code: '3109301', name: 'หลักสัตวแพทยสาธารณสุข',
      name_en: 'Principles of Veterinary Public Health',
      icon: '🌐', color: '#3d6b82', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['alongkorn-amonsin', 'rungtip-chuanchuen', 'suphachai-nuanualsuwan', 'taradon-luangtongkum', 'saharuetai-jeamsripong', 'vachira-hunprasit'],
      topics: [] },
    { id: 'principles-surgery', code: '3106301', name: 'หลักศัลยศาสตร์ทางสัตวแพทย์',
      name_en: 'Principles of Veterinary Surgery',
      icon: '🔪', color: '#c26d6d', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['kumpanart-soontornvipart', 'chalika-wangdee', 'ekkapol-akkraputtiporn'],
      topics: [] },
    { id: 'principles-therio', code: '3108301', name: 'หลักวิทยาการสืบพันธุ์',
      name_en: 'Principles of Theriogenology',
      icon: '🐾', color: '#b88940', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: ['kaywalee-chatdarong', 'theerawat-tharasanit', 'suppawiwat-ponglowhapan', 'sroisuda-chotimanukul'],
      topics: [] },
  ],

  // ─── Year 5 · Clinical Rotation & Specialty ──────────────────────
  // Subject list mirrors DekDokVet85 channel section labels (Y5/1 + Y5/2)
  // — that's the most reliable ground truth I have without Chula registrar
  // direct access. Codes still TBD-prefixed pending confirmation.
  5: [
    // Y5 sem 1 (11 subjects) — DekDokVet85 'Year 5/1' section
    { id: 'epidemiology', code: 'TBD-3104501', name: 'ระบาดวิทยา',
      name_en: 'Veterinary Epidemiology',
      icon: '📊', color: '#3d6b82', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['alongkorn-amonsin', 'chaidate-inchaisri'], topics: [] },
    { id: 'aquatic-clinic', code: 'TBD-3107510', name: 'คลินิกสัตว์น้ำ',
      name_en: 'Aquatic Animal Medicine',
      icon: '🐟', color: '#3d6b82', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['aranya-ponpornpisit', 'patharapol-piamsomboon', 'thanida-haetrakul', 'nopadon-pirarat', 'charnnarong-rodkhum'],
      topics: [] },
    { id: 'avian-medicine', code: 'TBD-3107511', name: 'อายุรศาสตร์สัตว์ปีก',
      name_en: 'Avian Medicine',
      icon: '🦅', color: '#d97744', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['niwat-chansiripornchai', 'somsak-pakpinyo', 'nataya-charoenvisal'],
      topics: [] },
    { id: 'poa-clinical', code: 'TBD-3107512', name: 'POA · การแก้ปัญหาคลินิกสัตว์เล็ก',
      name_en: 'POA — Clinical Problem Solving (Companion Animals)',
      icon: '🩺', color: '#5d8b8b', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'milk-meat-hygiene', code: 'TBD-3109511', name: 'สุขศาสตร์น้ำนม + เนื้อ',
      name_en: 'Milk Hygiene & Meat Science',
      icon: '🥩', color: '#a73d4a', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['suphachai-nuanualsuwan', 'saharuetai-jeamsripong'],
      topics: [] },
    { id: 'one-health', code: 'TBD-3109512', name: 'One Health',
      name_en: 'One Health',
      icon: '🌐', color: '#5c7d4a', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['alongkorn-amonsin', 'rungtip-chuanchuen', 'taradon-luangtongkum'],
      topics: [] },
    { id: 'food-industry', code: 'TBD-3109513', name: 'อุตสาหกรรมอาหาร',
      name_en: 'Food Industry',
      icon: '🏭', color: '#8b6b3d', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['suphachai-nuanualsuwan'], topics: [] },
    { id: 'equine-medicine', code: 'TBD-3107513', name: 'เวชปฏิบัติม้า + ศัลย์',
      name_en: 'Equine Medicine & Surgery',
      icon: '🐎', color: '#8b5a3d', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['theerawat-tharasanit', 'sumit-durongphongtorn'],
      topics: [] },
    { id: 'equine-repro', code: 'TBD-3108513', name: 'การสืบพันธุ์ในม้า',
      name_en: 'Equine Reproduction',
      icon: '🐴', color: '#b88940', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['theerawat-tharasanit'], topics: [] },
    { id: 'zoonoses', code: 'TBD-3109514', name: 'โรคติดต่อระหว่างสัตว์-คน',
      name_en: 'Zoonoses',
      icon: '🦠', color: '#7d5a8b', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['alongkorn-amonsin', 'rungtip-chuanchuen', 'taradon-luangtongkum', 'vachira-hunprasit'],
      topics: [] },
    { id: 'swine-clinic', code: 'TBD-3107514', name: 'อายุรศาสตร์สุกร',
      name_en: 'Swine Medicine',
      icon: '🐖', color: '#c26d8e', semester: 1, has_questions: false, scaffold: true,
      vault_lecturers: ['athipoo-nuntaprasert', 'pornchalit-assavacheep', 'suphot-wattanaphansak', 'roongtham-kedkovid'],
      topics: [] },

    // Y5 sem 2 (2 subjects) — DekDokVet85 'Year 5/2' section
    { id: 'rec-adv-bioscience', code: 'TBD-3100521', name: 'Recent Advance in Bioscience',
      name_en: 'Recent Advance in Bioscience',
      icon: '🔬', color: '#5d7d8b', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
    { id: 'preclinic-orientation', code: 'TBD-3100522', name: 'ปฐมนิเทศคลินิก',
      name_en: 'Pre-clinic Orientation',
      icon: '🎓', color: '#a78b3d', semester: 2, has_questions: false, scaffold: true,
      vault_lecturers: [], topics: [] },
  ],

  // ─── Year 6 · Internship / Externship Rotation ───────────────────
  // Block-based, not semester-based at Chula. Marked semester: 0
  // (placeholder) — UI should show "Block" label instead of สอบกลาง/ปลาย.
  6: [
    { id: 'rotation-small-animal', code: 'TBD-3107601', name: 'หมุนเวียน · สัตว์เล็ก (รพ.)',
      name_en: 'Small Animal Hospital Rotation',
      icon: '🏥', color: '#3d6b82', semester: 0, has_questions: false, scaffold: true,
      vault_lecturers: ['chaiyot-tanrattana', 'chutirat-torsahakul', 'krissda-boonaramrueng', 'rosama-pusoonthornthum', 'siwaporn-pengpis', 'sitilak-surachetpong'],
      topics: [] },
    { id: 'rotation-surgery-anesth', code: 'TBD-3106601', name: 'หมุนเวียน · ศัลย์ + วิสัญญี',
      name_en: 'Surgery & Anesthesia Rotation',
      icon: '🔪', color: '#c26d6d', semester: 0, has_questions: false, scaffold: true,
      vault_lecturers: ['kumpanart-soontornvipart', 'sumit-durongphongtorn', 'nan-choisunirachon', 'chalika-wangdee', 'chutimon-thanaboonnipat', 'pattaramonchat-bunnak', 'ekkapol-akkraputtiporn'],
      topics: [] },
    { id: 'rotation-livestock-farm', code: 'TBD-3108601', name: 'หมุนเวียน · ปศุสัตว์ + ฟาร์ม',
      name_en: 'Livestock & Farm Animal Rotation',
      icon: '🚜', color: '#5c7d4a', semester: 0, has_questions: false, scaffold: true,
      vault_lecturers: ['kittisak-ajariyakhajorn', 'chaidate-inchaisri', 'padet-tummaruk', 'siriwat-suadsong', 'piyanat-prasomsri', 'roongtham-kedkovid', 'pornchalit-assavacheep'],
      topics: [] },
    { id: 'rotation-aquatic-wildlife', code: 'TBD-3107602', name: 'หมุนเวียน · สัตว์น้ำ + สัตว์ป่า',
      name_en: 'Aquatic & Wildlife Rotation',
      icon: '🦓', color: '#7d4a7d', semester: 0, has_questions: false, scaffold: true,
      vault_lecturers: ['aranya-ponpornpisit', 'patharapol-piamsomboon', 'thanida-haetrakul', 'thavajchai-lekdamrongsak', 'pannawat-supapannachart', 'saowaphang-sanannu'],
      topics: [] },
    { id: 'rotation-vph-extern', code: 'TBD-3104601', name: 'หมุนเวียน · VPH + ฝึกงานนอก',
      name_en: 'VPH & Food Safety Externship',
      icon: '🌐', color: '#3d6b82', semester: 0, has_questions: false, scaffold: true,
      vault_lecturers: ['alongkorn-amonsin', 'rungtip-chuanchuen', 'suphachai-nuanualsuwan', 'taradon-luangtongkum'],
      topics: [] },
    { id: 'rotation-imaging-pathlab', code: 'TBD-3102601', name: 'หมุนเวียน · Imaging + Path Lab',
      name_en: 'Diagnostic Imaging & Path Lab Rotation',
      icon: '🩻', color: '#6b5d8e', semester: 0, has_questions: false, scaffold: true,
      vault_lecturers: ['nan-choisunirachon', 'chutimon-thanaboonnipat', 'somporn-techangamsuwan', 'sawang-kesdangsakonwut', 'kasem-rattanapinyopituk'],
      topics: [] },
    { id: 'senior-project', code: 'TBD-3100601', name: 'โครงการพิเศษปีสุดท้าย',
      name_en: 'Senior Project (research thesis)',
      icon: '🎓', color: '#a78b3d', semester: 0, has_questions: false, scaffold: true,
      vault_lecturers: ['nan-choisunirachon'],
      topics: [] },
  ],
};

// Flat list (includes "all")
export const SUBJECTS = [
  { id: 'all', name: 'รวมทุกวิชา', name_en: 'All Subjects', icon: '📚', color: '#2b2419' },
  ...Object.values(SUBJECTS_BY_YEAR).flat(),
];

// ──────────────────────────────────────────────────────────────────
// Helpers: count only "visible" questions (skip hidden-topic Qs)
// ──────────────────────────────────────────────────────────────────
// Why: subject cards + topic-grid "all" used to show raw subject count
// (incl. uncertain-scope/midterm Qs that are hidden in topic grid).
// User clicks → sees fewer Qs than card promised → confusion.
// Source of confusion was Poultry: card shows 127, but only 70 visible
// in topic grid (52 uncertain-scope hidden + 5 midterm hidden).
// ──────────────────────────────────────────────────────────────────

/** Returns Set of topic IDs flagged hidden for the given subject. */
export function hiddenTopicIdsFor(subjectId) {
  const subj = SUBJECTS.find((s) => s.id === subjectId);
  if (!subj || !Array.isArray(subj.topics)) return new Set();
  return new Set(subj.topics.filter((t) => t.hidden).map((t) => t.id));
}

/** Counts only questions whose topic is NOT hidden. Use for card display. */
export function visibleQuestionCount(subjectId, allQuestions) {
  if (!Array.isArray(allQuestions)) return 0;
  if (subjectId === 'all') {
    // Sum visible counts across each non-"all" subject
    return SUBJECTS
      .filter((s) => s.id !== 'all')
      .reduce((sum, s) => sum + visibleQuestionCount(s.id, allQuestions), 0);
  }
  const hidden = hiddenTopicIdsFor(subjectId);
  return allQuestions.filter((q) => q.subject === subjectId && !hidden.has(q.topic)).length;
}
