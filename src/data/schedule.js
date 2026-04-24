// ============================================================
// ตารางสอบ Final — ปี 4 Vet 86 (Semester 2/2568)
// ============================================================
// อัพเดตข้อมูลจากโพยจริงในโปรเจกต์
// - วันที่: yyyy-mm-dd format
// - ถ้าอยากเพิ่ม/แก้ไข ให้มาแก้ไฟล์นี้
// ============================================================

export const EXAM_SCHEDULE = {
  y4: [
    {
      id: 'surg2-final',
      subject: 'surg2',
      title: 'Vet Surg Lab II — Final',
      date: '2026-04-22',          // พุธ 22 เม.ย.
      time: '13:00-14:00',
      duration_min: 60,
      location: 'ชั้น 8',
      type: 'Multiple choice',
      weight_pct: 20,
      content: [
        'Ophthalmology ~15 ข้อ',
        'Aural hematoma & drain ~10 ข้อ',
      ],
      notes: 'หลังมิดเทอมไม่มี OSCE แล้ว เก็บ post-test + assignment',
      icon: '👁️',
      color: '#4a6b4a',
    },
    {
      id: 'surg3-final',
      subject: 'surg3',
      title: 'Vet Surg Lab III — Final',
      date: '2026-04-23',          // พฤหัส 23 เม.ย.
      time: '—',
      duration_min: 120,
      location: 'น่าจะชั้น 8 (รอคอนเฟิร์ม)',
      type: 'Multiple choice',
      weight_pct: 40,
      content: [
        'Lab 1–15 ทั้งหมด',
        '❌ ยกเว้น Lab 3, 4, 5 (Surgical approach)',
      ],
      notes: 'Attendance 30% + OSCE 30% + Final 40%',
      icon: '🦴',
      color: '#c26d6d',
    },
    {
      id: 'com3-final',
      subject: 'com3',
      title: 'COM III Final',
      date: '2026-04-29',          // พุธ 29 เม.ย.
      time: '08:30-11:30',
      duration_min: 180,
      location: 'รอคอนเฟิร์ม',
      type: 'Mixed',
      weight_pct: null,
      content: [
        'วิชาซัฟเฟอร์+ยากที่สุด (ตามโพย Kim 85)',
        'ต้องรู้หมดทุกข้อ ตัดช้อยยาก',
      ],
      notes: 'เรียน 8 คาบ · อ่านแบบสมองไหล',
      icon: '🐄',
      color: '#7d4a44',
    },
    {
      id: 'com4-final',
      subject: 'com4',
      title: 'COM IV Final',
      date: '2026-05-01',          // ศุกร์ 1 พ.ค.
      time: 'ช่วงเช้า',
      duration_min: 150,              // 2.5 ชม.+
      location: 'รอคอนเฟิร์ม',
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
  ],
};

// Helper: get upcoming exams sorted by date
export function getUpcomingExams(year = 'y4') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const list = EXAM_SCHEDULE[year] || [];
  return list
    .map((e) => ({ ...e, dateObj: new Date(e.date), daysLeft: Math.round((new Date(e.date) - today) / (1000 * 60 * 60 * 24)) }))
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
