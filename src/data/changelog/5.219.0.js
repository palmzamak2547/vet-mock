// Release 5.219.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.219.0',
  date: '2026-11-15',
  headline: 'คลิปบรรยายปี 5 มีการ์ดสรุปเพิ่ม 29 คลิป ทั้งภาคปลายและภาคต้นที่เคยค้าง',
  changes: [
    { kind: 'feature', scope: 'system', title: 'การ์ดสรุปคลิปปี 5 ภาคปลายเพิ่ม 21 คลิป', desc: 'สุกร 2 คลิป (Trichinosis, FMD และ PCV2 กับ Japanese encephalitis) ม้า 2 คลิป One Health 3 คลิป โรคสัตว์สู่คน 3 คลิป สัตว์น้ำ 3 คลิป สุขศาสตร์เนื้อและนม 4 คลิป สัตว์ปีก 2 คลิป อุตสาหกรรมอาหาร 1 คลิป และการสืบพันธุ์ม้า 1 คลิป ทุกข้อกดแล้วคลิปเล่นจากตรงนั้น' },
    { kind: 'feature', scope: 'system', title: 'คลิปภาคต้นที่เคยค้างมีการ์ดแล้ว 8 คลิป', desc: 'สัตว์ปีก 4 คลิป สัตว์น้ำ 3 คลิป และ Intro to zoonoses ทุกข้ออ่านเทียบกับคำบรรยายและสไลด์แล้ว ข้อที่คำบรรยายกับสไลด์ขัดกันหรือยืนยันไม่ได้ถูกนำออก' },
    { kind: 'fix', scope: 'system', title: 'คลิปได้สไลด์ของคาบตัวเอง', desc: 'ขั้นจับคู่สไลด์ไม่หยิบตารางเรียนมาเป็นสไลด์ของคลิปอีก และเมื่อชื่อคลิปไม่มีคำเฉพาะ จะใช้สไลด์ของวิชาเดียวกันที่ลงวันที่สอนตรงกับคลิป รวมคาบที่สอนหลายเรื่อง เช่น ORT, Campylobacteriosis, Listeriosis และ Histomoniasis ในคาบเดียว' },
    { kind: 'fix', scope: 'system', title: 'ชื่อช่วงเนื้อหาไม่มีสัญลักษณ์หรือลิงก์หลงมา', desc: 'ชื่อช่วงที่มาจากหัวสไลด์ไม่มีจุด bullet ลิงก์เว็บ เลขหน้า หรือรหัสวิชาติดมา สระอำที่แยกออกจากตัวอักษรกลับเป็นคำปกติ และช่วงที่หัวสไลด์ไม่ตรงกับที่สอนจริงใช้ชื่อตามเนื้อหา' },
  ],
};
