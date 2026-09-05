// ============================================================
// semester.js — the current term, on its own
// ============================================================
// App.jsx (the entry chunk) needs SEMESTER.id and nothing else from
// schedule.js. Importing it from there dragged both years' exam
// timetables, class timetables, milestones and campus events (~9 KB gzip)
// into the boot chunk for one string. schedule.js re-exports this, so
// every other consumer is untouched.
// ============================================================

/** ข้อมูลภาคการศึกษาปัจจุบัน — ใช้เป็นหัวเรื่องและ context ทั่วแอป */
export const SEMESTER = {
  id: '2569-1',
  labelTh: 'ภาคการศึกษาต้น 2569',
  short: 'เทอม 1/2569',
  cohortNote: 'Vet 86 = ชั้นปีที่ 5',
  midtermPeriod: { start: '2026-09-21', end: '2026-09-25', labelTh: 'สอบกลางภาค 21-25 ก.ย. 69' },
  finalPeriod: { start: '2026-11-23', end: '2026-12-04', labelTh: 'สอบปลายภาค 23 พ.ย. - 4 ธ.ค. 69' },
  sourceNote: 'ตามมติที่ประชุมคณะกรรมการบริหารคณะสัตวแพทยศาสตร์ จุฬาฯ ครั้งที่ 10/2569 (22 ก.ค. 69)',
  updatedAt: '2026-07-31',
};
