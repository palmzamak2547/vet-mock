// ============================================================
// ตารางสอบ Final — Sem 2/2568 (Vet 86, ปี 4)
// ============================================================
// ดึงข้อมูลจาก: ตารางสอบป_14_Final_Term2.pdf
// สัปดาห์สอบปลายภาค: 27 เม.ย. - 12 พ.ค. 2569
// ============================================================

export const EXAM_SCHEDULE = {
  y4: [
    // ─── สอบนอกตาราง ───
    {
      id: 'surg2-final',
      code: '3106417',
      subject: 'surg2',
      title: 'Vet Surg Lab II — Final',
      date: '2026-04-22',
      time: '13:00-14:00',
      duration_min: 60,
      location: 'ชั้น 8',
      type: 'Multiple choice',
      weight_pct: 20,
      content: [
        'Ophthalmology ~15 ข้อ',
        'Aural hematoma & drain ~10 ข้อ',
      ],
      notes: 'สอบนอกตาราง · หลังมิดเทอมไม่มี OSCE',
      icon: '👁️',
      color: '#4a6b4a',
      official_note: '3106417 VET SUR LAB II (Lab) (1) — ไม่มีการสอบในตารางหลัก',
    },
    {
      id: 'surg3-final',
      code: '3106418',
      subject: 'surg3',
      title: 'Vet Surg Lab III — Final',
      date: '2026-04-23',
      time: '~2 ชม.',
      duration_min: 120,
      location: 'น่าจะชั้น 8 (รอคอนเฟิร์ม)',
      type: 'Multiple choice',
      weight_pct: 40,
      content: [
        'Lab 1–15 ทั้งหมด',
        '❌ ยกเว้น Lab 3, 4, 5 (Surgical approach)',
      ],
      notes: 'สอบนอกตาราง · Attendance 30% + OSCE 30% + Final 40%',
      icon: '🦴',
      color: '#c26d6d',
    },

    // ─── จันทร์ 27 เม.ย. 69 ───
    {
      id: 'com5-final',
      code: '3107417',
      subject: 'com5',
      title: 'COM V — C ANI CLI SCI V',
      date: '2026-04-27',
      time: '08:30-10:30',
      duration_min: 120,
      location: 'VET6 202/203',
      type: 'Mixed',
      weight_pct: 35,
      content: ['CPV/CCV', 'Sporotrichosis & Cryptococcosis', 'GI protozoal enteritis', 'Rabies', 'Vaccine guidelines (WSAVA/VPAT)', 'Feline URI'],
      notes: 'Mid 60 + Final 35 + ฟรี 5 · 6 อาจารย์ · วิชาแรกของ exam week',
      icon: '🐕',
      color: '#3d6b82',
    },

    // ─── อังคาร 28 เม.ย. 69 (บ่าย) ───
    {
      id: 'engprof-final',
      code: '5500419',
      subject: 'engprof',
      title: 'Eng Vet Prof II — Final',
      date: '2026-04-28',
      time: '13:00-15:00',
      duration_min: 120,
      location: 'VET6 807',
      type: 'Mixed (short answers + T/F + writing)',
      weight_pct: 30,
      content: [
        'Unit 4 — Reading Vet Research Papers (Intro/Methods/Results/Discussion)',
        'Unit 5 — Writing Academic Papers + Paraphrasing + Summary',
        'Part I (20 pts) — Read paper → short answers + T/F',
        'Part II (15 pts) — Write 150-word summary (paraphrase required)',
      ],
      notes: 'Mid 30 + Final 30 + งาน 25 + ฟรี 5 + อื่นๆ ~10 · Penalty: -1 if summary > 180 words, -2 if > 200',
      icon: '🗣️',
      color: '#5c6b7d',
    },

    // ─── พุธ 29 เม.ย. 69 ───
    {
      id: 'com3-final',
      code: '3106416',
      subject: 'com3',
      title: 'COM III — C ANI CLI SCI III',
      date: '2026-04-29',
      time: '08:30-11:30',
      duration_min: 180,
      location: 'VET6 807',
      type: 'MCQ 5 choices',
      weight_pct: 40,
      content: [
        'ออกคาบละ 5-7 ข้อ (โดยประมาณ) · เป็นช้อย 5 ตัวเลือก',
        'วิชาซัฟเฟอร์+ยากที่สุด (ตามข้อสอบเก่า Kim 85)',
        'ต้องรู้หมดทุกข้อ ตัดช้อยยาก',
        '⚠️ เรื่อง AI ไม่มีสอบ — ใช้เป็นแนวทางทำโปสเตอร์เฉยๆ',
      ],
      notes: 'Mid 40 + Final 40 + งาน 20 · เรียน 14 คาบ · อ่านแบบสมองไหล',
      icon: '🚨',
      color: '#c26d6d',
    },

    // ─── พฤหัส 30 เม.ย. 69 ───
    {
      id: 'exotic-final',
      code: '3107414',
      subject: 'exotic',
      title: 'Wildlife & Exotic Health Management',
      date: '2026-04-30',
      time: '08:30-10:30',
      duration_min: 120,
      location: 'VET6 807',
      type: 'Mixed',
      weight_pct: null,
      content: [
        'Wildlife veterinary medicine',
        'Conservation medicine, One health',
        'Exotic pets (rabbit, reptile, avian, ferret)',
        'Post-graduate courses (ECZM, residency)',
      ],
      notes: 'อ.ดร.อรวีย์ + นางวัฒนา',
      icon: '🦜',
      color: '#7d4a7d',
    },

    // ─── ศุกร์ 1 พ.ค. 69 (เช้า — ย้ายมาจากบ่าย) ───
    {
      id: 'com4-final',
      code: '3107416',
      subject: 'com4',
      title: 'COM IV — C ANI CLI SCI IV',
      date: '2026-05-01',
      time: '08:30-11:30',
      duration_min: 180,
      location: 'VET6 807',
      type: 'Mixed',
      weight_pct: 47.5,
      content: [
        'Immune-mediated (IMHA, ITP, SLE, IBD, GN) — คาบ 15-18',
        'Dermatology series (parasitic / bacterial / fungal / endocrine / nutrition / allergic / autoimmune) — คาบ 19-26',
        'Pediatrics & Geriatrics — คาบ 27-28',
      ],
      notes: 'Midterm 47.5 + Final 47.5 + Attendance 5 · ข้อสอบยากและเยอะมาก น่าจะได้เวลามากกว่า 2.5 ชม.',
      icon: '🩺',
      color: '#6b5b8e',
    },

    // ─── อังคาร 5 พ.ค. 69 ───
    {
      id: 'repro-final',
      code: '3108409',
      subject: 'repro-lect',
      title: 'Companion Animal Reproduction (Lecture)',
      date: '2026-05-05',
      time: '13:00-16:00',
      duration_min: 180,
      location: 'VET6 B01-B03',
      type: 'MCQ',
      weight_pct: 40,
      content: [
        'Lect 15 Hormonal applications',
        'Lect 16 Semen collection/evaluation + breeding management + AI',
        'Lect 17 Preserved semen',
        'Lect 18 Infertility problems',
        'Lect 19 Biotech · Lect 20 Exotic repro · Lect 21 Genetics',
        'Lect 22 Surgical neutering · Lect 23 Risk-benefit · Lect 24 Ultrasound',
      ],
      notes: 'Lecture course 3108-409 · Final 40% · Lab แยกไปอยู่ Repro Lab เพราะสอบคนละรอบ',
      links: [
        { label: '📄 ข้อสอบรวบรวมทุกกลุ่ม', url: 'https://docs.google.com/document/d/1Gt5nj7eaTdnm5s0xoQ3ZSS5RbDMTuPNdHPxGIJ0gnFc/edit?usp=drivesdk' },
      ],
      icon: '🐾',
      color: '#b88940',
    },

    // ─── พุธ 6 พ.ค. 69 ───
    {
      id: 'practrum-final',
      code: '3108412',
      subject: 'practrum',
      title: 'VET PRAC RUM — Practice Ruminant',
      date: '2026-05-06',
      time: '13:00-16:00',
      duration_min: 180,
      location: 'VET6 B01-B03',
      type: 'Mixed (3 ภาควิชา · ภาคละ 15-20 pts)',
      weight_pct: null,
      content: [
        '✴️ ภาคศัลย์ — Rumenotomy (อ.เอกพล EA · slide 2026 ยืนยัน) + Dehorning + Penile deviation + Bovine anesthesia (Paravertebral block · Caudal epidural สาคโคซิเจียล S5-Co1) ',
        '✴️ ภาคสัตวบาล — ชนิดอาหารหยาบ + ประเมินคุณภาพอาหารหยาบหมัก · 10 ข้อ ปรนัย',
        '✴️ ภาคสูติฯ — วาดรูปคลอดยาก (12 dystocia presentations A-L) · เตรียมดินสอ + ยางลบ ✏️',
        '⚠️ ไม่ออก: คาบที่เรียนกับ อ.ปิยะณัฐ (ตรวจสุขภาพกีบ + แต่งกีบ + ปฏิบัติการอาหารสัตว์) — ให้คะแนนจาก assignment',
        '📚 คลังข้อสอบ: 47 ข้อ (36 past-paper + 11 lecture/background) · confidence-tagged',
      ],
      notes: 'ผศ.ศิริวัฒน์ ทรวดทรง (ST) + อ.ดร.รุจิกร จงสุวรรณวัฒนา (RJ · coordinator) + Surgery staff (เอกพล/ธีรวัฒน์/จินดา/เอกพจน์) · 3 ภาควิชา ภาคละ 15-20 คะแนน',
      icon: '🐂',
      color: '#5c7d4a',
    },

    // ─── พฤหัส 7 พ.ค. 69 ───
    {
      id: 'poultry-final',
      code: '3107409',
      subject: 'poultry',
      title: 'Poultry Health Management',
      date: '2026-05-07',
      time: '13:00-15:00',
      duration_min: 120,
      location: 'VET6 702',
      type: 'Mixed (T/F + MCQ + Fill)',
      weight_pct: 45,
      content: [
        'L9 First Week Mortality + Immunology (อ.สมศักดิ์ · AHRA framework · IgY/MDA · Pasgar score) — MCQ',
        'L10 Avian Zoonosis (อ.กมลพรรณ จรัญกุล) — เติมคำ + MCQ',
        'L11 Biosecurity + Disease Surveillance (อ.ณทยา เจริญวิศาล · 3-level: Conceptual/Structural/Procedural · Boot/cloacal swab · Hen Housed/Day Production) — MCQ',
        'L13 Avian Drugs (Prof.นิวัตร จันทร์ศิริพรชัย · AMR 5 Rs · banned drugs Vanco/DES/CAP/Nitrofurans · Plasmodium · Knemidocoptes) — MCQ',
        'L14-15 Quality Assurance (น.สพ.เอกสิงห์ สาเรือง · Betagro · 5 ด้าน control/audit/accreditation/assess/traceability · PDCA · Five Freedoms · BQM 4 มิติ · Haugh Unit · FCR) — ถูก/ผิด ~10 ข้อ',
        '📚 คลังข้อสอบ: 70 ข้อ Final visible (+57 ซ่อนเป็น uncertain-scope/midterm)',
      ],
      notes: 'Course coord อ.ดร.เกรียงวิชญ์ ลิมป์วิทยาคุณ · Mid 52.5 + Final 45 + Class 2.5 · Letter Grade A-F',
      icon: '🐔',
      color: '#c2924a',
    },

    // ─── ศุกร์ 8 พ.ค. 69 ───
    {
      id: 'cliapprum-final',
      code: '3108411',
      subject: 'cliapprum',
      title: 'VET CLI APP RUM — Clinical App. Ruminant',
      date: '2026-05-08',
      time: '13:00-16:00',
      duration_min: 180,
      location: 'VET6 B01-B03',
      type: 'MCQ (ปรนัย)',
      weight_pct: null,
      content: [
        'ปรนัย · คาบละ 15 คะแนน (จำนวนข้อขึ้นกับอาจารย์)',
        '✴️ อ.ศวิตา สันติวิภารัตน์ (Sawita · 3 คาบ GI Surgery) — คาบละ 15 ข้อ รวม 45 ข้อ ⭐ MAIN',
        '🔪 GI Surgery (Sawita): Rumenotomy · LDA + RDA correction (R-flank omentopexy / L-flank abomasopexy) · Abomasal volvulus (RAV) · Cecal dilatation + dislocation (CDD) · Hardware disease (TRP)',
        '💉 Ruminant Anesthesia (อ.ภัทร์มนฉัตร บุนนาค PB · adapted from รศ.สุมิตร): Local + Regional (Auriculopalpebral · Peterson · Paravertebral · Caudal epidural · IV regional Bier block)',
        '🌾 Metabolism & Nutrition Dashboard: DMI · CP/NDF/ADF/NE · R:C ratio + Milk Fat Depression · Particle size (Penn State 4-layer) · Transition period · Subclinical Ketosis (BHBA ≥1.2 mM) · NEFA · BCS · Feces Score 1-5 · Locomotion Score 1-5',
        '🐾 Hoof Health Fleet (อ.ปิยะณัฐ ประสมศรี PP · pptx confirmed): TLI framework (Timing/Location/Identification/Interpretation) · RT 2x/year · Dutch 5-step trim · Footbath CuSO4 5% / Formalin 3-5%',
        '🩺 GI Medicine (อ.ธนศักดิ์ บุญเสริม TB · slide cover ยืนยัน): GI atony · Hyper/Hypomotility · Acidosis pH<5.5 · Methylene blue 3-6 min · Sediment activity 4-8 min · Gram stain rumen fluid',
        '📚 คลังข้อสอบ: 39 visible (37 MCQ + 2 writing) · 2 ข้อ tendon legacy ซ่อนเป็น uncertain-scope',
      ],
      notes: 'อ.ศวิตา สันติวิภารัตน์ (45 ข้อ main) + อ.ภัทร์มนฉัตร บุนนาค + อ.ธนศักดิ์ บุญเสริม + อ.ปิยะณัฐ ประสมศรี + others',
      icon: '🐄',
      color: '#7d5a44',
    },
  ],
};

// Helper: parse first time from "08:30-10:30" → { hour: 8, minute: 30 }
export function parseExamStart(timeStr) {
  if (!timeStr) return null;
  const m = timeStr.match(/(\d{1,2})[:.](\d{2})/);
  if (!m) return null;
  return { hour: parseInt(m[1], 10), minute: parseInt(m[2], 10) };
}

// Helper: ms until exam start. Negative if already started/passed.
export function msUntilExam(exam, now = new Date()) {
  const start = parseExamStart(exam.time);
  const dt = new Date(exam.date);
  if (start) dt.setHours(start.hour, start.minute, 0, 0);
  else dt.setHours(8, 0, 0, 0);
  return dt - now;
}

// Helper: epoch-ms timestamp of when the exam *ends*.
// Used to filter exams that have already finished today (e.g. COM V
// at 08:30-10:30 has finished by 11:00 — should NOT still show as
// "next exam" for the rest of the day).
function examEndMs(exam) {
  const start = parseExamStart(exam.time);
  const dt = new Date(exam.date);
  if (start) dt.setHours(start.hour, start.minute, 0, 0);
  else dt.setHours(8, 0, 0, 0);
  // Use declared duration if available; fall back to 3 hr (longest in y4)
  const durMin = exam.duration_min || 180;
  return dt.getTime() + durMin * 60 * 1000;
}

// Helper: short countdown when exam is within ~36 hours
// Returns null when not imminent (use daysLeft instead)
export function shortCountdown(exam, now = new Date()) {
  const ms = msUntilExam(exam, now);
  if (ms < -3 * 60 * 60 * 1000) return null;
  if (ms > 36 * 60 * 60 * 1000) return null;
  const totalMin = Math.floor(ms / 60000);
  if (totalMin < 0) {
    return { kind: 'now', text: `🔥 กำลังสอบอยู่!` };
  }
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  if (hours < 1) return { kind: 'imminent', text: `⏰ อีก ${minutes} นาที!` };
  if (hours < 12) return { kind: 'imminent', text: `⏰ อีก ${hours} ชม. ${minutes} นาที` };
  return { kind: 'soon', text: `⏰ อีก ${hours} ชม.` };
}

// Helper: get upcoming exams sorted by date
export function getUpcomingExams(year = 'y4') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const list = EXAM_SCHEDULE[year] || [];
  return list
    .map((e) => ({
      ...e,
      dateObj: new Date(e.date),
      daysLeft: Math.round((new Date(e.date) - today) / (1000 * 60 * 60 * 24)),
    }))
    .sort((a, b) => a.dateObj - b.dateObj);
}

export function getNextExam(year = 'y4') {
  // Filter by exam END time, not by date. Otherwise an exam that
  // finished hours ago today would still count as "next" for the
  // rest of the day and only roll over at midnight.
  const nowMs = Date.now();
  const upcoming = getUpcomingExams(year).filter((e) => examEndMs(e) > nowMs);
  return upcoming[0] || null;
}

// Thai date formatter
export function fmtThaiDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
}
