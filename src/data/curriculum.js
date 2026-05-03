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
      examFormat: {
        weight: 'Final 40% · Lecture course 3108-409',
        examDate: '5 พ.ค. 2569 · 13:00-16:00 · VET6 B01-B03',
        choiceCount: 4,
        notes: [
          'ยึด Lecture 15-24 ปี 2026 เป็นแกนหลักก่อน แล้ว map ข้อสอบเก่าตามหัวข้อเดียวกัน',
          'Lab อยู่ subject แยกชื่อ Repro Lab เพราะสอบคนละรอบ',
          'ชุดข้อสอบยึดข้อสอบเก่า/recall รุ่นพี่เป็น source หลัก แล้วใช้ slide 2026 verify + map topic; topic ใหม่ที่ยังไม่มี recall ชัดจะติด lecture-verified draft',
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
      examFormat: {
        weight: 'Mid 105/200 (52.5%) · Final 90/200 (45%) · Class 5/200 (2.5%) · Letter Grade A-F',
        choiceCount: 5,
        notes: [
          '📅 Final scope (lectures 9-14): First Week Mortality / Avian Zoonosis / Biosecurity / Avian Drugs / Quality Assurance — 5 หัวข้อตรงกับ 5 slides ใน /Slide Lecture 2026/',
          '📅 Midterm scope (lectures 1-7) สอบไปแล้ว — viral/bacterial/vaccine/physiology · ซ่อนไว้ default',
          '⚠️ 52 ข้อจาก "Final Exotic ไม่ใช่คำตอบ.pdf" — Palm ตรวจแล้วเหมือนข้อมูลไม่ตรง scope · ซ่อนทั้ง batch ใน hidden topic "uncertain-scope" (อาจเป็น midterm Y4 หรือ Avian Med Y5)',
          '👨‍🏫 Course coord: Kriengwich Limpavithayakul (L9 AHRA) · Final scope instructors: Aj. Somsak (L9 first-week) · Aj. Kamonpan Charoenkul (L10 zoonosis) · Aj. Nataya/ณทยา (L11 biosecurity) · Aj. Niwat Chansiripornchai (L13 drugs) · Aj. Ekasingh Sareung (L14-15 QA · Betagro)',
          '📋 Q types per topic: QA = T/F ~10 ข้อ + MCQ · First-week mortality + management = MCQ · Avian zoonosis = fill-in/MCQ · 7.5% ต่อสัปดาห์',
          '🎯 70 ข้อใน final scope visible · 57 ข้อ hidden (52 uncertain-scope + 3 physiology midterm + 2 midterm-disease)',
        ],
      },
      topics: [
        // ── Final scope (lectures 9-14) — 5 topics matching 2026 slides ──
        { id: 'first-week-mortality', label: 'L9 · First Week Mortality (AHRA)', icon: '🐣',
          lecturer: 'Aj. Somsak (L9 + immunology) / Kriengwich Limpavithayakul (coord)', lecturer_year: 2026, schedule: '2026-03-10 · L9 · Final scope',
          lecturerNote: 'Aj. Somsak สอน first-week mortality + immunology basics (IgY/MDA/Harderian/vaccination) · AHRA / ShineChick framework · Pasgar score · rolling reaction · 17 ข้อใน DB (Kim85 Vet 83 + 86 master)' },
        { id: 'avian-zoonosis',       label: 'L10 · Avian Zoonosis', icon: '🧬',
          lecturer: 'Kamonpan Charoenkul (Vet Public Health, CU)', lecturer_year: 2026, schedule: '2026-03-17 · L10 · Final scope',
          lecturerNote: 'Avian zoonoses table — Bacteria (Chlamydiosis/Erysipelas/Avian TB/Salmonellosis/Campylobacter/Yersiniosis/Q Fever) · Yeast (Cryptococcosis) · Virus (NDV/WNV/AI) · 9 ข้อใน DB' },
        { id: 'biosecurity',          label: 'L11 · Biosecurity & Disease Surveillance', icon: '🛡',
          lecturer: 'Nataya / ณทยา เจริญวิศาล (ผศ.สพ.ญ.ดร.)', lecturer_year: 2026, schedule: '2026-03-24 · L11 · Final scope',
          lecturerNote: 'Aj. Nakcha — Conceptual/Structural/Procedural biosecurity · sample size + Se/Sp · Boot/cloacal/cleft palate swabs · Hen Housed/Day Production · window of susceptibility · 19 ข้อใน DB' },
        { id: 'avian-drugs',          label: 'L13 · Avian Drugs', icon: '💊',
          lecturer: 'Niwat Chansiripornchai (Prof. · DTBVM · CU Vet)', lecturer_year: 2026, schedule: '2026-04-07 · L13 · Final scope',
          lecturerNote: 'Aj. Niwat — Antimicrobial classification (cidal/static · dose/time-dependent) · Mycoplasmosis tx · banned drugs (Vanco/DES/CAP/Nitrofurans) · Plasmodium/Knemidocoptes · mold binders · AMR 5 Rs · 11 ข้อใน DB' },
        { id: 'quality-assurance',    label: 'L14-15 · Quality Assurance', icon: '🏆',
          lecturer: 'Ekasingh Sareung (เอกสิงห์ สาเรือง · Betagro)', lecturer_year: 2026, schedule: '2026-04-21 + 04-28 · L14-15 · Final scope',
          lecturerNote: 'น.สพ.เอกสิงห์ สาเรือง — QA 5 ด้าน (control/audit/accreditation/assess/traceability) · PDCA · Five Freedoms · BQM 4 มิติ · NCR · Haugh Unit · slow-growth trade-offs · FCR · 14 ข้อใน DB (T/F + MCQ)' },

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
          lecturer: 'หทัยรัตน์ พลายมาศ (ผศ.ดร. · ปี 86)', lecturer_year: 2026, schedule: 'L4-5 · Midterm scope',
          lecturerNote: '⚠️ ผู้สอนเปลี่ยน — ปี 84 (sunsun84) Aj. Chackrit Nuengjamnong สอน · ปี 86 Aj. หทัยรัตน์ พลายมาศ สอนแทน (พบจาก Nicky 86 master PDF) · Animal composition · ME (กิน feed ตาม ME level) · limiting AA: Met (ไก่ไข่ขาด) / Lys (ref =100) / Thr · Cysteine + Tyrosine = semi-essential · feed cost ~70% ของค่าใช้จ่ายเลี้ยง · 0 ข้อใน DB (Mid scope · ซ่อนไว้)' },
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
    // Vet Prac Rum — restructured 2026-05-03 to match 2026 ตารางสอน Final scope
    // (post-midterm Week 8-13). Coordinator: อ.รุจิกร (RJ).
    // Sunsun84 (Vet 84 / 2024) covers extra topics (hernia / esophageal /
    // eye / udder / tendon) flagged as `uncertain-scope` because 2026
    // ตารางสอนไม่ระบุชัด — บางหัวข้อปีก่อนเรียงไม่เหมือนกัน per Palm.
    { id: 'practrum', code: '3108412', name: 'Practice Ruminant', name_en: 'VET PRAC RUM',
      icon: '🐂', color: '#5c7d4a', semester: 2, has_questions: true,
      examFormat: {
        weight: 'Mid + Final + ปฏิบัติการ',
        examDate: '6 พ.ค. 2569 (week 27 เม.ย. – 12 พ.ค.)',
        notes: [
          '📅 Final scope = post-midterm (Week 8-13) · 8 หัวข้อหลัก',
          '👨‍🏫 Course coordinator: อ.น.สพ.ดร.รุจิกร จงสุวรรณวัฒนา (RJ)',
          '🎯 ปฏิบัติการศัลยกรรม + สูติศาสตร์ + ตรวจสุขภาพ — เน้น vivid procedural details',
          '📦 Mined sources: Sunsun84 (Vet 84 mind map · 8 หน้า) + Lecture 2026 (Penile deviation · Rumenotomy slides)',
          '⚠️ pp\'s vet prac rum final85.pdf (37MB) + Ploy83 (132MB) เกินขนาด — ยังไม่ได้ extract; topics ที่ Sunsun84 มีแต่ตารางสอน 2026 ไม่ระบุชัด ซ่อนเป็น uncertain-scope',
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
          lecturer: 'Surgery staff (likely EA + team)', lecturer_year: 2026, schedule: '20 เม.ย. · 13.00-16.00 · ห้อง 144',
          lecturerNote: 'Surgery staff · อ.เอกพล (EA) สอน Rumenotomy ช่วงเช้า · Dehorning ช่วงบ่ายอาจสอนต่อหรือ rotation · ปก slide ของ dehorning ยังไม่ extracted · Cornual n block + Lidocaine ยาชา · อายุ <2m = Horn bud → Debudding (hoof knife/tube/calf dehorner gauge/50% CaCl2) · adult = Tube/Robert dehorner · Obstetric wire (Gigli) · Risk: frontal sinus fracture → sinusitis/empyema · Tx open drainage = Trephination ~2.5cm' },

        // ── Uncertain scope (Sunsun84 ครอบคลุม · 2026 ตารางไม่ระบุ) ──
        { id: 'uncertain-scope', label: '❓ Uncertain Scope · Hernia/Esophageal/Eye/Udder/Tendon',
          icon: '❓', hidden: true,
          lecturer: 'TBD — Sunsun84 (Vet 84) ครอบคลุม 25 ข้อ',
          lecturerNote: 'พี่มด (5 hernia) + พี่ลี (5 esophageal) + พี่พล (5 head/neck/eye) + พี่ดิติศักดิ์ (5 udder/teat T/F) + พี่แนน (5 foot/tendon) · ปีก่อนอาจ midterm · ปี 86 ตารางไม่เห็นชัด — ซ่อนไว้ก่อนรอ verify' },
      ] },
    // Clin App Rum — restructured 2026-05-03 from scratch
    // Coordinator scope text confirms อ.ศวิตา (Sawita) 3 lectures × 15 ข้อ = 45 Q (main)
    // Master compilation "Clin App Ruminant - Final.pdf" = 5 sections (Metabolism + Anes + GI + ...)
    // PDF→PNG conversion used (avoid 7MB+ image render bug)
    { id: 'cliapprum', code: '3108411', name: 'Clinical App Rumen', name_en: 'VET CLI APP RUM',
      icon: '🐄', color: '#7d5a44', semester: 2, has_questions: true,
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
          lecturer: 'TBD — slide ปก 2026 ไม่ระบุชื่อ', lecturer_year: 2026,
          lecturerNote: 'Clinical Dashboard Framework · 5 sections: DMI / Nutritional values / Nutrient requirements / R:C ratio + milk fat / Particle size · Transition period · Subclinical Ketosis · NEB · Feces Score 1-5 · Locomotion Score 1-5 · BCS · ⚠️ Slide 2026 ปกหน้าแรกไม่มีชื่ออาจารย์ — รอ verify ในคาบ' },
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
  ],
  // ปีอื่นๆ เพิ่มที่นี่ในอนาคต
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
