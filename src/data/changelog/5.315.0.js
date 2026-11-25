// Release 5.315.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.315.0',
  date: '2026-11-25',
  headline: 'ค้นหาเจอครบทุกผล และเจอคำที่ก็อปมาจาก PDF หรือ LINE',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ช่องค้นหาบอกจำนวนจริงของทุกกลุ่ม', desc: 'คำที่เจอเยอะ เช่น rabies หรือ วัคซีน บอกจำนวนจริงของแต่ละกลุ่ม และกดแสดงเพิ่มได้จนครบ ข้อสอบที่ขึ้นต้นเหมือนกันขึ้นเป็นคนละแถว และคำที่อยู่ท้ายโจทย์ยาวก็ค้นเจอ' },
    { kind: 'fix', scope: 'system', title: 'คำที่ก็อปมาจาก PDF หรือ LINE ค้นเจอ', desc: 'คำที่มีอักขระล่องหนติดมา สระอำที่ไฟล์ PDF เก็บเป็นสองตัว และเลขไทย ค้นเจอเหมือนพิมพ์เอง ทั้งในช่องค้นหา รายการคลังเอกสาร สรุปบทเรียน คลิป รายชื่อวิชา และรายชื่ออาจารย์' },
    { kind: 'fix', scope: 'system', title: 'ค้นหลายคำในสรุปบทเรียนและคลิป', desc: 'พิมพ์หลายคำในช่องค้นของสรุปบทเรียน คลิป และรายชื่อวิชา จะขึ้นส่วนที่มีครบทุกคำ ไม่ต้องเรียงติดกันตามที่พิมพ์' },
  ],
};
