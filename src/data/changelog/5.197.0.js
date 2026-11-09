// Release 5.197.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.197.0',
  date: '2026-11-09',
  headline: 'Vet Surg Lab II, Lab III, Repro Lab และ COM IV แยกหัวข้อตามคาบเรียนแล้ว',
  changes: [
    { kind: 'feature', scope: 'system', title: 'Vet Surg Lab II, Lab III และ Repro Lab มีหัวข้อตามคาบเรียน', desc: 'หัวข้อมาจากรายการคาบของแต่ละวิชาในภาค 2568/2: Surg Lab II 6 หัวข้อ, Surg Lab III 11 หัวข้อ และ Repro Lab 4 หัวข้อ ข้อในคลังย้ายเข้าหัวข้อตามเนื้อหาที่ถาม ข้อที่ไม่ตรงคาบใดยังอยู่ในรวมวิชาเหมือนเดิม' },
    { kind: 'feature', scope: 'system', title: "COM IV เพิ่มหัวข้อ Cushing's, Addison's และ diabetes mellitus", desc: 'ตามคาบต่อมไร้ท่อของ COM IV ข้อที่ถามโรคเหล่านี้ย้ายเข้าหัวข้อของตัวเอง ข้อเรื่องไตยังอยู่ใน COM IV โดยไม่มีหัวข้อ' },
  ],
};
