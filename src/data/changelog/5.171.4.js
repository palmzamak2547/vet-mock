// Release 5.171.4. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.171.4',
  date: '2026-10-29',
  headline: 'Swine Medicine ปลายภาคมีข้อสอบเก่าครบทั้งสามอาจารย์',
  changes: [
    { kind: 'feature', scope: 'system', title: 'ข้อสอบเก่าปลายภาคส่วน อ.รุ่งธรรม 54 ข้อ', desc: 'ข้อที่รุ่นพี่ Vet 78, 80, 83 และอีกชุดที่ไม่ระบุรุ่นบันทึกไว้หลังสอบ เรื่อง CSF, ASF, pseudorabies, JE, greasy pig และ blood parasites เป็นปรนัย 20 ข้อตามตัวเลือกเดิม และข้อเขียนสั้น 34 ข้อ' },
    { kind: 'feature', scope: 'system', title: 'ข้อเขียนเก่าส่วน อ.พรชลิต และ อ.สุพจน์ 11 ข้อ', desc: 'ข้อเขียนเรื่องการแท้ง โรคท้องเสียในสุกรขุน E. coli, PCV2 และ FMD ตามถ้อยคำเดิมของข้อสอบ แต่ละข้อบอกว่ารุ่นไหนเคยสอบบ้าง ตั้งแต่ Vet 78 ถึง Vet 85' },
    { kind: 'fix', scope: 'system', title: 'ปรนัยที่แตกจากข้อเขียนเดียวกันไม่ถูกนับซ้ำ', desc: 'ปรนัย 12 ข้อที่เขียนแยกจากข้อเขียน 4 ข้อของ Vet 85 ยังอยู่ใน Panic Mode ถัดจากข้อเขียนต้นฉบับ แต่ปุ่มฝึกเฉพาะข้อสอบเก่านับข้อเขียนต้นฉบับแทน' },
    { kind: 'fix', scope: 'system', title: 'Zoonoses หัวข้อ Mycoses แสดงอาจารย์ผู้สอนปีนี้', desc: 'หัวข้อ Mycoses ปลายภาคแสดงชื่อ รศ.น.สพ.ดร.ศุภชัย เนื้อนวลสุวรรณ ตามประมวลรายวิชา 2569' },
  ],
};
