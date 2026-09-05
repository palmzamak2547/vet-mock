// ============================================================
// ตารางเรียน ตารางสอบ และปฏิทินการศึกษา
// ============================================================
// เทอมปัจจุบัน: ภาคการศึกษาต้น 2569 (Vet 86 = ชั้นปีที่ 5)
//
// EXAM_SCHEDULE เก็บทั้งสองชั้นปีที่มีข้อมูลจริง:
//   y5 = ภาคต้น 2569 ทั้งกลางภาคและปลายภาค (รุ่น Vet 86)
//   y4 = ภาคต้น 2569 ของรุ่นถัดมา + รายการเทอม 2/2568 ที่สอบไปแล้ว
//        (เก็บไว้เพราะหน้า "ตารางสอบ" เรียงตามวันและแสดงย้อนหลังได้)
//
// ที่มา: ตารางสอบกลางภาค/ปลายภาค ภาคต้น 2569 ของคณะ + ตารางสอน
// ที่ประกาศให้แต่ละชั้นปี ดู SEMESTER ด้านล่างสำหรับช่วงสอบที่เป็นทางการ
// ============================================================

// The cohort year lives in curriculum.js so there is exactly one place to
// move it each August. curriculum.js imports nothing, so no cycle.
import { CURRENT_YEAR } from './curriculum.js';

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
      notes: 'สอบนอกตาราง, หลังมิดเทอมไม่มี OSCE',
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
      notes: 'สอบนอกตาราง, Attendance 30% + OSCE 30% + Final 40%',
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
      notes: 'Mid 60 + Final 35 + ฟรี 5, 6 อาจารย์, วิชาแรกของ exam week',
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
      notes: 'Mid 30 + Final 30 + งาน 25 + ฟรี 5 + อื่นๆ ~10, Penalty: -1 if summary > 180 words, -2 if > 200',
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
        'ออกคาบละ 5-7 ข้อ (โดยประมาณ), เป็นช้อย 5 ตัวเลือก',
        'วิชาซัฟเฟอร์+ยากที่สุด (ตามข้อสอบเก่า Kim 85)',
        'ต้องรู้หมดทุกข้อ ตัดช้อยยาก',
        '⚠️ เรื่อง AI ไม่มีสอบ — ใช้เป็นแนวทางทำโปสเตอร์เฉยๆ',
      ],
      notes: 'Mid 40 + Final 40 + งาน 20, เรียน 14 คาบ, อ่านแบบสมองไหล',
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
      notes: 'Midterm 47.5 + Final 47.5 + Attendance 5, ข้อสอบยากและเยอะมาก น่าจะได้เวลามากกว่า 2.5 ชม.',
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
        'Lect 19 Biotech, Lect 20 Exotic repro, Lect 21 Genetics',
        'Lect 22 Surgical neutering, Lect 23 Risk-benefit, Lect 24 Ultrasound',
      ],
      notes: 'Lecture course 3108-409, Final 40%, Lab แยกไปอยู่ Repro Lab เพราะสอบคนละรอบ',
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
      type: 'Mixed (3 ภาควิชา, ภาคละ 15-20 pts)',
      weight_pct: null,
      content: [
        '✴️ ภาคศัลย์ — Rumenotomy (อ.เอกพล EA, slide 2026 ยืนยัน) + Dehorning + Penile deviation + Bovine anesthesia (Paravertebral block, Caudal epidural สาคโคซิเจียล S5-Co1) ',
        '✴️ ภาคสัตวบาล — ชนิดอาหารหยาบ + ประเมินคุณภาพอาหารหยาบหมัก, 10 ข้อ ปรนัย',
        '✴️ ภาคสูติฯ — วาดรูปคลอดยาก (12 dystocia presentations A-L), เตรียมดินสอ + ยางลบ ✏️',
        '⚠️ ไม่ออก: คาบที่เรียนกับ อ.ปิยะณัฐ (ตรวจสุขภาพกีบ + แต่งกีบ + ปฏิบัติการอาหารสัตว์) — ให้คะแนนจาก assignment',
        '📚 คลังข้อสอบ: 47 ข้อ (36 past-paper + 11 lecture/background), confidence-tagged',
      ],
      notes: 'ผศ.ศิริวัฒน์ ทรวดทรง (ST) + อ.ดร.รุจิกร จงสุวรรณวัฒนา (RJ, coordinator) + Surgery staff (เอกพล/ธีรวัฒน์/จินดา/เอกพจน์), 3 ภาควิชา ภาคละ 15-20 คะแนน',
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
        'L9 First Week Mortality + Immunology (อ.สมศักดิ์, AHRA framework, IgY/MDA, Pasgar score) — MCQ',
        'L10 Avian Zoonosis (อ.กมลพรรณ เจริญกุล) — เติมคำ + MCQ',
        'L11 Biosecurity + Disease Surveillance (อ.ณทยา เจริญวิศาล, 3-level: Conceptual/Structural/Procedural, Boot/cloacal swab, Hen Housed/Day Production) — MCQ',
        'L13 Avian Drugs (Prof.นิวัตร จันทร์ศิริพรชัย, AMR 5 Rs, banned drugs Vanco/DES/CAP/Nitrofurans, Plasmodium, Knemidocoptes) — MCQ',
        'L14-15 Quality Assurance (น.สพ.เอกสิงห์ สาเรือง, Betagro, 5 ด้าน control/audit/accreditation/assess/traceability, PDCA, Five Freedoms, BQM 4 มิติ, Haugh Unit, FCR) — ถูก/ผิด ~10 ข้อ',
        '📚 คลังข้อสอบ: 70 ข้อ Final visible (+57 ซ่อนเป็น uncertain-scope/midterm)',
      ],
      notes: 'Course coord อ.ดร.เกรียงวิชญ์ ลิมปวิทยากุล, Mid 52.5 + Final 45 + Class 2.5, Letter Grade A-F',
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
        'ปรนัย, คาบละ 15 คะแนน (จำนวนข้อขึ้นกับอาจารย์)',
        '✴️ อ.ศวิตา สันติวิภารัตน์ (Sawita, 3 คาบ GI Surgery) — คาบละ 15 ข้อ รวม 45 ข้อ ⭐ MAIN',
        '🔪 GI Surgery (Sawita): Rumenotomy, LDA + RDA correction (R-flank omentopexy / L-flank abomasopexy), Abomasal volvulus (RAV), Cecal dilatation + dislocation (CDD), Hardware disease (TRP)',
        '💉 Ruminant Anesthesia (อ.ภัทร์มนฉัตร บุนนาค PB, adapted from รศ.สุมิตร): Local + Regional (Auriculopalpebral, Peterson, Paravertebral, Caudal epidural, IV regional Bier block)',
        '🌾 Metabolism & Nutrition Dashboard: DMI, CP/NDF/ADF/NE, R:C ratio + Milk Fat Depression, Particle size (Penn State 4-layer), Transition period, Subclinical Ketosis (BHBA ≥1.2 mM), NEFA, BCS, Feces Score 1-5, Locomotion Score 1-5',
        '🐾 Hoof Health Fleet (อ.ปิยะณัฐ ประสมศรี PP, pptx confirmed): TLI framework (Timing/Location/Identification/Interpretation), RT 2x/year, Dutch 5-step trim, Footbath CuSO4 5% / Formalin 3-5%',
        '🩺 GI Medicine (อ.ธนศักดิ์ บุญเสริม TB, slide cover ยืนยัน): GI atony, Hyper/Hypomotility, Acidosis pH<5.5, Methylene blue 3-6 min, Sediment activity 4-8 min, Gram stain rumen fluid',
        '📚 คลังข้อสอบ: 39 visible (37 MCQ + 2 writing), 2 ข้อ tendon legacy ซ่อนเป็น uncertain-scope',
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
  if (ms > 36 * 60 * 60 * 1000) return null;
  // "กำลังสอบอยู่" has to end when the exam ends, not a flat three hours after
  // it starts — the declared duration is right there in the record, and a
  // 2-hour paper was claiming to still be running an hour after everyone left.
  if (now.getTime() > examEndMs(exam)) return null;
  const totalMin = Math.floor(ms / 60000);
  if (totalMin < 0) {
    return { kind: 'now', text: 'กำลังสอบอยู่' };
  }
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  if (hours < 1) return { kind: 'imminent', text: `อีก ${minutes} นาที` };
  if (hours < 12) return { kind: 'imminent', text: `อีก ${hours} ชม. ${minutes} นาที` };
  return { kind: 'soon', text: `อีก ${hours} ชม.` };
}

// Helper: get upcoming exams sorted by date
export function getUpcomingExams(year = `y${CURRENT_YEAR}`) {
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

export function getNextExam(year = `y${CURRENT_YEAR}`) {
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

// ============================================================
// ภาคการศึกษาต้น ปีการศึกษา 2569 (Sem 1/2569) — ชั้นปีที่ 5
// ============================================================
// แหล่งข้อมูล (เอกสารทางการ คณะสัตวแพทยศาสตร์ จุฬาฯ):
//   • ตารางสอน ชั้นปีที่ 5 ภาคต้น 2569 (หลักสูตร สพ.บ. 61) — 27 มี.ค. 69
//   • ตารางสอบกลางภาค ภาคต้น 2569 — Update 20 ก.ค. 69
//   • ตารางสอบปลายภาค ภาคต้น 2569 สัปดาห์ที่ 1-2 — Update 20 ก.ค. 69
//   • ทะเบียนกลุ่มรายวิชา ชั้นปีที่ 5 (รหัสกลุ่ม 3190501)
//   • กำหนดการลงทะเบียนเรียน + การชำระค่าเล่าเรียน (สนง.การทะเบียน)
// ⚠️ ทุกค่าคัดจากเอกสารตรง ๆ ไม่มีการเดา ถ้าเอกสารไม่ระบุ = null
// หมายเหตุจากเอกสาร: "ตารางสอบและห้องสอบอาจมีการเปลี่ยนแปลง
// โดยจะมีการแจ้งให้ทราบล่วงหน้าโดยเร็วที่สุด"
// ============================================================

export { SEMESTER } from './semester.js';


// ── ตารางสอบ ชั้นปีที่ 5 ภาคต้น 2569 ────────────────────────────────
// กลางภาค 21-25 ก.ย. 69 (9 วิชา) · ปลายภาค 23 พ.ย. - 4 ธ.ค. 69 (10 วิชา)
// 3107522 CLI PROB SOLV COMP ไม่ปรากฏในตารางสอบทั้งสองรอบ
// 3107508 VET EPID PREV MED มีเฉพาะสอบปลายภาค
EXAM_SCHEDULE.y5 = [
  // ─── สอบกลางภาค ───
  { id: 'y5-one-health-mid', code: '3109502', subject: 'one-health', title: 'ONE HEALTH VPH — กลางภาค', date: '2026-09-21', time: '08:30-09:30', duration_min: 60, credits: 1, location: 'VET6 202/203', term: 'midterm', icon: '🌍', color: '#4a6b4a' },
  { id: 'y5-avian-mid', code: '3107510', subject: 'avian-medicine', title: 'AVIAN MEDICINE — กลางภาค', date: '2026-09-21', time: '13:00-15:00', duration_min: 120, credits: 2, location: 'VET6 B01-03', term: 'midterm', icon: '🐔', color: '#c2924a' },
  { id: 'y5-food-ind-mid', code: '3109501', subject: 'food-industry', title: 'FOOD IND QUAL CONT — กลางภาค', date: '2026-09-22', time: '08:30-09:30', duration_min: 60, credits: 1, location: 'VET6 807', term: 'midterm', icon: '🏭', color: '#b88940' },
  { id: 'y5-milk-meat-mid', code: '3109503', subject: 'milk-meat-hygiene', title: 'MILK HYG MEAT INSP — กลางภาค', date: '2026-09-22', time: '13:00-16:00', duration_min: 180, credits: 3, location: 'VET6 202/203', term: 'midterm', icon: '🥛', color: '#5c7d4a' },
  { id: 'y5-equine-med-mid', code: '3106510', subject: 'equine-medicine', title: 'EQUINE MED SURG — กลางภาค', date: '2026-09-23', time: '08:30-11:30', duration_min: 180, credits: 3, location: 'VET6 807', term: 'midterm', icon: '🐎', color: '#7d5a44' },
  { id: 'y5-equine-repro-mid', code: '3108515', subject: 'equine-repro', title: 'EQUINE REPROD — กลางภาค', date: '2026-09-23', time: '13:00-14:00', duration_min: 60, credits: 1, location: 'VET6 807', term: 'midterm', icon: '🐴', color: '#b88940' },
  { id: 'y5-swine-mid', code: '3107507', subject: 'swine-clinic', title: 'SWINE MEDICINE — กลางภาค', date: '2026-09-24', time: '08:30-10:30', duration_min: 120, credits: 2, location: 'VET6 202/203', term: 'midterm', icon: '🐖', color: '#c26d6d' },
  { id: 'y5-aqua-mid', code: '3107520', subject: 'aquatic-clinic', title: 'AQUA ANL MED — กลางภาค', date: '2026-09-24', time: '13:00-16:00', duration_min: 180, credits: 3, location: 'VET6 202/203', term: 'midterm', icon: '🐟', color: '#3d6b82' },
  { id: 'y5-zoonoses-mid', code: '3109504', subject: 'zoonoses', title: 'ZOONOSES — กลางภาค', date: '2026-09-25', time: '08:30-11:30', duration_min: 180, credits: 3, location: 'VET6 202/203', term: 'midterm', icon: '🦠', color: '#7d4a7d' },

  // ─── สอบปลายภาค สัปดาห์ที่ 1 ───
  { id: 'y5-swine-final', code: '3107507', subject: 'swine-clinic', title: 'SWINE MEDICINE — ปลายภาค', date: '2026-11-23', time: '13:00-15:00', duration_min: 120, credits: 2, location: 'VET6 807', term: 'final', icon: '🐖', color: '#c26d6d' },
  { id: 'y5-equine-med-final', code: '3106510', subject: 'equine-medicine', title: 'EQUINE MED SURG — ปลายภาค', date: '2026-11-24', time: '13:00-16:00', duration_min: 180, credits: 3, location: 'VET6 202/203', term: 'final', icon: '🐎', color: '#7d5a44' },
  { id: 'y5-one-health-final', code: '3109502', subject: 'one-health', title: 'ONE HEALTH VPH — ปลายภาค', date: '2026-11-25', time: '13:00-14:30', duration_min: 90, credits: 1, location: 'VET6 807', term: 'final', icon: '🌍', color: '#4a6b4a' },
  { id: 'y5-zoonoses-final', code: '3109504', subject: 'zoonoses', title: 'ZOONOSES — ปลายภาค', date: '2026-11-26', time: '13:00-16:00', duration_min: 180, credits: 3, location: 'VET6 807', term: 'final', icon: '🦠', color: '#7d4a7d' },
  { id: 'y5-aqua-final', code: '3107520', subject: 'aquatic-clinic', title: 'AQUA ANL MED — ปลายภาค', date: '2026-11-27', time: '13:00-16:00', duration_min: 180, credits: 3, location: 'VET6 B01-03', term: 'final', icon: '🐟', color: '#3d6b82' },

  // ─── สอบปลายภาค สัปดาห์ที่ 2 ───
  { id: 'y5-milk-meat-final', code: '3109503', subject: 'milk-meat-hygiene', title: 'MILK HYG MEAT INSP — ปลายภาค', date: '2026-11-30', time: '08:30-11:30', duration_min: 180, credits: 3, location: 'VET6 807', term: 'final', icon: '🥛', color: '#5c7d4a' },
  { id: 'y5-equine-repro-final', code: '3108515', subject: 'equine-repro', title: 'EQUINE REPROD — ปลายภาค', date: '2026-12-01', time: '08:30-10:00', duration_min: 90, credits: 1, location: 'VET6 807', term: 'final', icon: '🐴', color: '#b88940' },
  { id: 'y5-avian-final', code: '3107510', subject: 'avian-medicine', title: 'AVIAN MEDICINE — ปลายภาค', date: '2026-12-02', time: '08:30-10:30', duration_min: 120, credits: 2, location: 'VET6 807', term: 'final', icon: '🐔', color: '#c2924a' },
  { id: 'y5-food-ind-final', code: '3109501', subject: 'food-industry', title: 'FOOD IND QUAL CONT — ปลายภาค', date: '2026-12-03', time: '13:00-14:30', duration_min: 90, credits: 1, location: 'VET6 807', term: 'final', icon: '🏭', color: '#b88940' },
  { id: 'y5-epid-final', code: '3107508', subject: 'epidemiology', title: 'VET EPID PREV MED — ปลายภาค', date: '2026-12-04', time: '08:30-11:30', duration_min: 180, credits: 3, location: 'VET6 807', term: 'final', icon: '📊', color: '#3d6b82' },
];


// ── ตารางสอบ ชั้นปีที่ 4 ภาคต้น 2569 ────────────────────────────────
// ต่อท้าย EXAM_SCHEDULE.y4 ที่มีอยู่ (ของเทอม 2/2568 = ประวัติ) — helper
// เรียงตามวันที่ให้เอง จึงคืน 'สอบถัดไป' ได้ถูกโดยไม่ต้องลบของเก่า
// 3106415 VET SURG LAB I ไม่ปรากฏในตารางสอบทั้งสองรอบ
// 5500418 ENG VET PROF I มีเฉพาะสอบปลายภาค
EXAM_SCHEDULE.y4 = [...(EXAM_SCHEDULE.y4 || []),
  // ─── สอบกลางภาค 21-25 ก.ย. 69 ───
  { id: 'y4-com1-mid', code: '3107415', subject: 'com1', title: 'C ANI CLI SCI I — กลางภาค', date: '2026-09-21', time: '13:00-16:00', duration_min: 180, credits: 3, location: 'VET6 702', term: 'midterm', icon: '🐕', color: '#3d6b82' },
  { id: 'y4-juris-mid', code: '3100403', subject: 'vet-juris', title: 'JURIS ETH WELFARE — กลางภาค', date: '2026-09-22', time: '08:30-09:30', duration_min: 60, credits: 1, location: 'VET6 B01-03', term: 'midterm', icon: '⚖️', color: '#5c6b7d' },
  { id: 'y4-imaging-mid', code: '3106413', subject: 'vet-imaging', title: 'VET IMAGING (LECT/LAB) — กลางภาค', date: '2026-09-22', time: '13:00-15:00', duration_min: 120, credits: 2, location: 'VET6 807', term: 'midterm', icon: '🩻', color: '#6b5b8e' },
  { id: 'y4-com2-mid', code: '3106414', subject: 'com2', title: 'C ANI CLI SCI II — กลางภาค', date: '2026-09-23', time: '08:30-10:30', duration_min: 120, credits: 2, location: 'VET6 B01-03', term: 'midterm', icon: '🩺', color: '#6b5b8e' },
  { id: 'y4-swinerepro-mid', code: '3108404', subject: 'swine-repro', title: 'SWINE REPRODUCTION — กลางภาค', date: '2026-09-24', time: '08:30-10:30', duration_min: 120, credits: 2, location: 'VET6 807', term: 'midterm', icon: '🐖', color: '#c26d6d' },
  { id: 'y4-swineherd-mid', code: '3107408', subject: 'swine-herd', title: 'SWI HERD HLTH MGT — กลางภาค', date: '2026-09-24', time: '13:00-15:00', duration_min: 120, credits: 2, location: 'VET6 807', term: 'midterm', icon: '🐷', color: '#c2924a' },
  { id: 'y4-herdrum-mid', code: '3107407', subject: 'herd-health-rum', title: 'HERD HLTH MGT RUM — กลางภาค', date: '2026-09-25', time: '08:30-11:30', duration_min: 180, credits: 3, location: 'VET6 702', term: 'midterm', icon: '🐄', color: '#7d5a44' },
  { id: 'y4-foodsafety-mid', code: '3109401', subject: 'food-safety-y4', title: 'FOOD SAFETY — กลางภาค', date: '2026-09-25', time: '13:00-16:00', duration_min: 180, credits: 3, location: 'VET6 702', term: 'midterm', icon: '🍖', color: '#5c7d4a' },

  // ─── สอบปลายภาค สัปดาห์ที่ 1 (23-27 พ.ย. 69) ───
  { id: 'y4-herdrum-final', code: '3107407', subject: 'herd-health-rum', title: 'HERD HLTH MGT RUM — ปลายภาค', date: '2026-11-23', time: '13:00-16:00', duration_min: 180, credits: 3, location: 'VET6 B01-03', term: 'final', icon: '🐄', color: '#7d5a44' },
  { id: 'y4-engprof-final', code: '5500418', subject: 'engprof1', title: 'ENG VET PROF I — ปลายภาค', date: '2026-11-24', time: '13:00-16:00', duration_min: 180, credits: 3, location: 'VET6 807', term: 'final', icon: '🗣️', color: '#5c6b7d' },
  { id: 'y4-imaging-final', code: '3106413', subject: 'vet-imaging', title: 'VET IMAGING (LECT/LAB) — ปลายภาค', date: '2026-11-25', time: '08:30-10:30', duration_min: 120, credits: 2, location: 'VET6 807', term: 'final', icon: '🩻', color: '#6b5b8e' },
  { id: 'y4-foodsafety-final', code: '3109401', subject: 'food-safety-y4', title: 'FOOD SAFETY — ปลายภาค', date: '2026-11-26', time: '08:30-11:30', duration_min: 180, credits: 3, location: 'VET6 807', term: 'final', icon: '🍖', color: '#5c7d4a' },
  { id: 'y4-swineherd-final', code: '3107408', subject: 'swine-herd', title: 'SWI HERD HLTH MGT — ปลายภาค', date: '2026-11-27', time: '08:30-10:30', duration_min: 120, credits: 2, location: 'VET6 807', term: 'final', icon: '🐷', color: '#c2924a' },

  // ─── สอบปลายภาค สัปดาห์ที่ 2 (30 พ.ย. - 4 ธ.ค. 69) ───
  { id: 'y4-swinerepro-final', code: '3108404', subject: 'swine-repro', title: 'SWINE REPRODUCTION — ปลายภาค', date: '2026-11-30', time: '08:30-11:30', duration_min: 180, credits: 2, location: 'VET6 B01-03', term: 'final', icon: '🐖', color: '#c26d6d' },
  { id: 'y4-juris-final', code: '3100403', subject: 'vet-juris', title: 'JURIS ETH WELFARE — ปลายภาค', date: '2026-12-01', time: '08:30-10:00', duration_min: 90, credits: 1, location: 'VET6 B01-03', term: 'final', icon: '⚖️', color: '#5c6b7d' },
  { id: 'y4-com1-final', code: '3107415', subject: 'com1', title: 'C ANI CLI SCI I — ปลายภาค', date: '2026-12-02', time: '08:30-11:30', duration_min: 180, credits: 3, location: 'VET6 B01-03', term: 'final', icon: '🐕', color: '#3d6b82' },
  { id: 'y4-com2-final', code: '3106414', subject: 'com2', title: 'C ANI CLI SCI II — ปลายภาค', date: '2026-12-03', time: '08:30-10:30', duration_min: 120, credits: 2, location: 'VET6 B01-03', term: 'final', icon: '🩺', color: '#6b5b8e' },
];

/** ทะเบียนกลุ่มรายวิชา — ลงทะเบียนทั้งชุดด้วยรหัสกลุ่มเดียว */
export const COURSE_GROUPS = {
  y5: {
    groupCode: '3190501',
    condition: 'G',
    courseCount: 11,
    credits: 23,
    section: '001',
    howTo: 'ป้อนรหัสกลุ่ม 3190501 แล้วเลือกเงื่อนไข G เพื่อลงทะเบียนครบทุกรายวิชาตามโปรแกรม',
    warning: 'ลงทะเบียนผิดเงื่อนไข/ผิดระเบียบ จะถูกยกเลิกผลการลงทะเบียนทุกรายวิชา',
    codes: ['3106510', '3107507', '3107508', '3107510', '3107520', '3107522', '3108515', '3109501', '3109502', '3109503', '3109504'],
  },
};

/** ตารางเรียนรายสัปดาห์ ชั้นปีที่ 4 และ 5 ภาคต้น 2569 — dow 1=จันทร์ ... 5=ศุกร์, เวลา 24 ชม. */
export const CLASS_TIMETABLE = {
  y4: [
    // ── ชั้นปีที่ 4 ภาคต้น 2569 (จากตารางสอน 27 มี.ค. 69) ──
    { dow: 1, start: '08:00', end: '11:00', code: '3107415', title: 'COM ANI CLIN SCI I', subject: 'com1', room: 'VET6 203', kind: 'lecture' },
    { dow: 1, start: '13:00', end: '14:00', code: '3100403', title: 'JURIS ETH WELFARE', subject: 'vet-juris', room: 'VET6 203', kind: 'lecture' },
    { dow: 2, start: '08:00', end: '10:00', code: '3108404', title: 'SWINE REPRODUCTION', subject: 'swine-repro', room: 'VET6 203', kind: 'lecture' },
    { dow: 2, start: '10:00', end: '12:00', code: '3107408', title: 'SWI HERD HLTH MGT', subject: 'swine-herd', room: 'VET6 203', kind: 'lecture' },
    { dow: 2, start: '13:00', end: '16:00', code: '5500418', title: 'ENG VET PROF I', subject: 'engprof1', room: 'VET6 204, 205, 206, B04, B05', kind: 'lecture' },
    { dow: 3, start: '09:00', end: '12:00', code: '3107407', title: 'HERD HLTH MGT RUM', subject: 'herd-health-rum', room: 'VET6 203', kind: 'lecture' },
    { dow: 3, start: '13:00', end: '15:00', code: '3106414', title: 'COM ANI CLIN SCI II', subject: 'com2', room: 'VET6 203', kind: 'lecture' },
    { dow: 4, start: '11:00', end: '12:00', code: '3106413', title: 'VET IMAGING', subject: 'vet-imaging', room: 'VET6 203', kind: 'lecture' },
    { dow: 4, start: '13:00', end: '15:00', code: '3106413', title: 'VET IMAGING', subject: 'vet-imaging', room: 'VET6 401', kind: 'lab' },
    { dow: 5, start: '09:00', end: '12:00', code: '3109401', title: 'FOOD SAFETY', subject: 'food-safety-y4', room: 'VET6 203', kind: 'lecture' },
    { dow: 5, start: '13:00', end: '15:00', code: '3106415', title: 'VET SURG LAB I', subject: 'surg1', room: 'VET6 401', kind: 'lab' },
  ],
  y5: [
    { dow: 1, start: '10:00', end: '12:00', code: '3107508', title: 'VET EPIDEM', subject: 'epidemiology', room: 'VET6 807', kind: 'lecture' },
    { dow: 1, start: '13:00', end: '15:00', code: '3107508', title: 'VET EPIDEMI (LAB)', subject: 'epidemiology', room: 'VET6 807', kind: 'lab' },
    { dow: 2, start: '09:00', end: '12:00', code: '3107520', title: 'AQUATIC ANIMAL MEDICINE', subject: 'aquatic-clinic', room: 'VET6 807', kind: 'lecture' },
    { dow: 2, start: '13:00', end: '15:00', code: '3107510', title: 'AVIAN MED', subject: 'avian-medicine', room: 'VET6 807', kind: 'lecture' },
    { dow: 3, start: '08:00', end: '09:00', code: '3107522', title: 'CLI PROB SOLV COMP', subject: 'poa-clinical', room: 'VET6 807', kind: 'lecture' },
    { dow: 3, start: '09:00', end: '12:00', code: '3109503', title: 'MILK HYGIENE AND MEAT INSPECTION', subject: 'milk-meat-hygiene', room: 'VET6 807', kind: 'lecture' },
    { dow: 3, start: '13:00', end: '14:00', code: '3109502', title: 'ONE HEALTH', subject: 'one-health', room: 'VET6 807', kind: 'lecture' },
    { dow: 3, start: '14:00', end: '15:00', code: '3109501', title: 'FOOD INDUSTRY', subject: 'food-industry', room: 'VET6 807', kind: 'lecture' },
    { dow: 4, start: '09:00', end: '12:00', code: '3106510', title: 'EQUINE MEDICINE AND SURGERY', subject: 'equine-medicine', room: 'VET6 807', kind: 'lecture' },
    { dow: 4, start: '13:00', end: '14:00', code: '3108515', title: 'EQUINE REPRO', subject: 'equine-repro', room: 'VET6 807', kind: 'lecture' },
    { dow: 5, start: '09:00', end: '12:00', code: '3109504', title: 'ZOONOSES', subject: 'zoonoses', room: 'VET6 807', kind: 'lecture' },
    { dow: 5, start: '13:00', end: '15:00', code: '3107507', title: 'SWINE MEDICINE', subject: 'swine-clinic', room: 'VET6 807', kind: 'lecture' },
  ],
};

/** ปฏิทินลงทะเบียน/ชำระเงิน ภาคต้น 2569 (ระบบทวิภาค) */
export const ACADEMIC_MILESTONES = [
  { id: 'reg-r1', start: '2026-06-22', end: '2026-07-05', titleTh: 'แสดงความจำนงลงทะเบียน รอบที่ 1', kind: 'registration' },
  { id: 'reg-r2', start: '2026-07-16', end: '2026-07-20', titleTh: 'ดูผลรอบ 1 + แสดงความจำนง รอบที่ 2', kind: 'registration' },
  { id: 'reg-r3', start: '2026-07-24', end: '2026-07-29', titleTh: 'ดูผลรอบ 2 + แสดงความจำนง รอบที่ 3', kind: 'registration' },
  { id: 'reg-r3-result', start: '2026-07-31', end: '2026-08-02', titleTh: 'ประกาศผลการแสดงความจำนง รอบที่ 3', kind: 'registration' },
  {
    id: 'late-reg', start: '2026-08-03', end: '2026-08-14',
    titleTh: 'ลงทะเบียนสาย เพิ่ม/เปลี่ยนตอน/ลดรายวิชา',
    kind: 'registration',
    warnTh: 'ลงทะเบียนช่วงนี้ต้องชำระค่าปรับลงทะเบียนสายตามประกาศ',
    endTimeTh: 'ปิด 20.00 น.',
  },
  {
    id: 'payment', start: '2026-06-22', end: '2026-08-16',
    titleTh: 'ชำระค่าเล่าเรียน ผ่านแอป CUNEX',
    kind: 'payment',
    endTimeTh: 'ปิด 23.00 น. ของวันที่ 16 ส.ค. 69',
    noteTh: 'เลือกสถานะรายการเป็น "ลงทะเบียนปกติ" — กรณีลาพัก/รักษาสถานภาพให้เลือก "รักษาสถานภาพ" (ป.ตรี 1,000 บาท/ภาค) และต้องยื่นคำร้องที่ทะเบียนคณะก่อน',
    warnTh: 'ในแอป CUNEX จะแจ้งวันที่ 2 ส.ค. 69 ก่อน (รอบแรก) ถ้ายังไม่ชำระให้รออัปเดตวันใหม่ (16 ส.ค. 69)',
  },
  { id: 'cr52-1', start: '2026-08-14', end: '2026-08-14', titleTh: 'ตรวจรายชื่อกับอาจารย์ผู้สอน ครั้งที่ 1 (CR52)', kind: 'checkpoint' },
  { id: 'cr52-2', start: '2026-08-20', end: '2026-08-28', titleTh: 'ตรวจรายชื่อกับอาจารย์ผู้สอน ครั้งที่ 2 (CR52)', kind: 'checkpoint' },
  { id: 'drop-last', start: '2026-09-11', end: '2026-09-11', titleTh: 'วันสุดท้ายของการลดรายวิชา (W)', kind: 'deadline' },
];

/** รายวิชาที่จัดสอบนอกตาราง (ตามหมายเหตุท้ายตารางสอบ) */
export const OFF_SCHEDULE_EXAMS = [
  { code: '3100103', title: 'VET IMP PROF I', note: 'TDF (จัดสอบนอกตาราง)' },
  { code: '3100201', title: 'VET IMP PROF II', note: 'TDF (จัดสอบนอกตาราง)' },
];

// ── Helpers: ตารางเรียน + ปฏิทินการศึกษา ─────────────────────────────

/** คาบเรียนของวันนั้น (default = วันนี้) เรียงตามเวลา. เสาร์-อาทิตย์ = [] */
export function getClassesForDay(year = 5, date = new Date()) {
  const rows = CLASS_TIMETABLE[`y${year}`] || [];
  const dow = date.getDay(); // 0=Sun
  return rows.filter((r) => r.dow === dow).sort((a, b) => a.start.localeCompare(b.start));
}

/** คาบถัดไปของวันนี้ (ยังไม่จบ) — ใช้โชว์ "คาบต่อไป" */
export function getNextClassToday(year = 5, date = new Date()) {
  const hhmm = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return getClassesForDay(year, date).find((c) => c.end > hhmm) || null;
}

/** คาบที่กำลังเรียนอยู่ตอนนี้ (ถ้ามี) */
export function getCurrentClass(year = 5, date = new Date()) {
  const hhmm = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return getClassesForDay(year, date).find((c) => c.start <= hhmm && hhmm < c.end) || null;
}

/** หมุดปฏิทินที่ "เกี่ยวกับตอนนี้" — กำลังเปิดอยู่ หรือจะถึงใน N วัน
 *  คืนค่าเรียงตามความใกล้ พร้อม daysLeft / daysLeftToEnd / active */
export function getActiveMilestones(withinDays = 10, now = new Date()) {
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const day = 24 * 60 * 60 * 1000;
  return ACADEMIC_MILESTONES
    .map((m) => {
      const s = new Date(m.start); s.setHours(0, 0, 0, 0);
      const e = new Date(m.end); e.setHours(0, 0, 0, 0);
      return {
        ...m,
        daysLeft: Math.round((s - today) / day),
        daysLeftToEnd: Math.round((e - today) / day),
        active: s <= today && today <= e,
      };
    })
    .filter((m) => m.active || (m.daysLeft > 0 && m.daysLeft <= withinDays))
    .sort((a, b) => (a.active === b.active ? a.daysLeft - b.daysLeft : (a.active ? -1 : 1)));
}

/** หมุดที่ควรเตือนที่สุดหนึ่งอัน — เดดไลน์/การชำระเงินที่กำลังเปิดมาก่อน */
export function getTopMilestone(now = new Date()) {
  const list = getActiveMilestones(10, now);
  if (list.length === 0) return null;
  const urgent = list.find((m) => m.active && (m.kind === 'payment' || m.kind === 'deadline'));
  return urgent || list[0];
}

/** ฟอร์แมตช่วงวันแบบสั้น: "3 - 14 ส.ค. 69" / "11 ก.ย. 69" */
export function fmtThaiRange(start, end) {
  const M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const a = new Date(start); const b = new Date(end);
  const yy = String((b.getFullYear() + 543) % 100);
  if (a.getTime() === b.getTime()) return `${a.getDate()} ${M[a.getMonth()]} ${yy}`;
  if (a.getMonth() === b.getMonth()) return `${a.getDate()} - ${b.getDate()} ${M[b.getMonth()]} ${yy}`;
  return `${a.getDate()} ${M[a.getMonth()]} - ${b.getDate()} ${M[b.getMonth()]} ${yy}`;
}

/** ชื่อวันไทยแบบสั้นจาก dow (1=จันทร์) */
export const DOW_TH = { 1: 'จันทร์', 2: 'อังคาร', 3: 'พุธ', 4: 'พฤหัสบดี', 5: 'ศุกร์' };

// ============================================================
// กิจกรรมของคณะ/สโมสร ที่มีวันเวลาแน่นอน
// ============================================================
// ต่างจาก ACADEMIC_MILESTONES (กำหนดการของสำนักทะเบียน) — อันนี้คือ
// งานที่ประกาศผ่านสโมสร/ฝ่ายนิสิต ซึ่งปกติหายไปในแชท พอมีวันเวลา+ห้อง
// +ลิงก์ที่ชัด ก็ควรอยู่ในปฏิทินเดียวกับเรื่องเรียน
// ที่มา: ประกาศจากฝ่ายพัฒนาคุณภาพชีวิตนิสิต (SE) — LINE 26 ก.ค. 69
export const CAMPUS_EVENTS = [
  {
    id: 'stetho-3m-2026',
    date: '2026-08-04',
    start: '16:30',
    end: '18:00',
    titleTh: 'บริษัทนำ Stethoscope มาให้ลอง — 3M Littmann',
    location: 'ห้อง 203',
    audienceYears: [4, 5],
    noteTh: 'ลองฟัง/เทียบรุ่นก่อนตัดสินใจซื้อ',
    links: [
      { label: 'ข้อมูล Stethoscope 2026 (Drive)', url: 'https://drive.google.com/drive/folders/1goWyQfugunK6Ox2DRogbMRlQ2te8FB8o' },
      { label: '3M Littmann Flip Book', url: 'https://heyzine.com/flip-book/914c8169b3.html' },
    ],
  },
  {
    id: 'stetho-mdf-2026',
    date: '2026-08-05',
    start: '15:30',
    end: '17:00',
    titleTh: 'บริษัทนำ Stethoscope มาให้ลอง — MDF',
    location: 'ห้อง 203',
    audienceYears: [4, 5],
    noteTh: 'ลองฟัง/เทียบรุ่นก่อนตัดสินใจซื้อ',
    links: [
      { label: 'ข้อมูล Stethoscope 2026 (Drive)', url: 'https://drive.google.com/drive/folders/1goWyQfugunK6Ox2DRogbMRlQ2te8FB8o' },
    ],
  },
];

/** กิจกรรมที่ยังไม่ผ่าน (และตรงกับชั้นปี) เรียงตามวัน */
export function getUpcomingEvents(year = 5, withinDays = 60, now = new Date()) {
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const day = 24 * 60 * 60 * 1000;
  return CAMPUS_EVENTS
    .filter((e) => !e.audienceYears || e.audienceYears.includes(Number(year)))
    .map((e) => {
      const d = new Date(e.date); d.setHours(0, 0, 0, 0);
      return { ...e, daysLeft: Math.round((d - today) / day) };
    })
    .filter((e) => e.daysLeft >= 0 && e.daysLeft <= withinDays)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}
