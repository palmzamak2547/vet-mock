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
      content: ['CPV/CCV', 'Sporotrichosis & Cryptococcosis', 'GI protozoal enteritis', 'Rabies', 'Vaccine guidelines', 'Feline URI'],
      notes: 'อ.กฤษฎา + น.ส.มาลินี + นางวันทนา · วิชาแรกของ exam week',
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
      type: 'Mixed',
      weight_pct: 30,
      content: ['English for Veterinary Profession II'],
      notes: 'อ.ดร.เกรียงวิชญ์ + นางพรรณิภา + น.ส.เชาวลี · เก็บคะแนน 25, ทำงาน, Final 30',
      icon: '🇬🇧',
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
      type: 'Mixed',
      weight_pct: null,
      content: [
        'วิชาซัฟเฟอร์+ยากที่สุด (ตามโพย Kim 85)',
        'ต้องรู้หมดทุกข้อ ตัดช้อยยาก',
      ],
      notes: 'เรียน 8 คาบ · อ่านแบบสมองไหล',
      icon: '🩺',
      color: '#3d6b82',
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

    // ─── ศุกร์ 1 พ.ค. 69 ───
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
        'Dermatology (allergic, autoimmune, fungal)',
        'Pediatric / Geriatric care',
        'SLE, IMT, IMHA, Glomerular disease',
        'Endocrine (Cushing, Addison, DM)',
        'Cardiology (DCM, MMVD)',
      ],
      notes: 'Midterm 47.5 + Final 47.5 + Attendance 5 · ข้อสอบยากและเยอะมาก',
      icon: '🩺',
      color: '#3d6b82',
    },

    // ─── อังคาร 5 พ.ค. 69 ───
    {
      id: 'repro-final',
      code: '3108409',
      subject: 'repro',
      title: 'Companion Animal Reproduction',
      date: '2026-05-05',
      time: '13:00-16:00',
      duration_min: 180,
      location: 'VET6 B01-B03',
      type: 'Mixed',
      weight_pct: null,
      content: [
        'Vaginal cytology, Estrus cycle',
        'Pyometra, Dystocia, Cryptorchid',
        'Hormone (LH, FSH, Progesterone, AMH)',
        'BPH, Mismate management',
      ],
      notes: 'รศ.ดร.ศุภวิวัฒน์ + น.ส.วัฒชรา + น.ส.อุบล',
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
      type: 'Mixed',
      weight_pct: null,
      content: ['Practice ruminant medicine'],
      notes: 'ผศ.ศิริวัฒน์ + อ.ดร.รุจิกร + น.ส.อุบล',
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
      type: 'Mixed',
      weight_pct: null,
      content: ['Poultry health & disease management'],
      notes: 'อ.ดร.เกรียงวิชญ์ + นายสรารุธ',
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
      type: 'Mixed',
      weight_pct: null,
      content: [
        'Foot rot, Laminitis, Sole ulcer',
        'LDA, Hardware disease',
        'BSP, Tendon surgery',
        'Digital dermatitis (Treponema)',
      ],
      notes: 'ผศ.ศิริวัฒน์ + น.ส.อุบล + นายณัฐรชัย',
      icon: '🐄',
      color: '#7d5a44',
    },
  ],
};

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
  const upcoming = getUpcomingExams(year).filter((e) => e.daysLeft >= 0);
  return upcoming[0] || null;
}

// Thai date formatter
export function fmtThaiDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
}
