// Release 5.196.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.196.0',
  date: '2026-11-09',
  headline: 'VCA: ข้อสอบเก่าเพิ่ม 697 ข้อจากชุด Super สรุป ทั้งสัตว์เล็ก หมู ม้า สัตว์น้ำ และ exotic',
  changes: [
    { kind: 'feature', scope: 'system', title: 'ข้อสอบเก่า VCA เพิ่ม 697 ข้อ', desc: 'สัตว์เล็ก 381 ข้อ หมู 118 ม้า 81 สัตว์น้ำ 66 และ exotic กับสัตว์ป่า 51 ข้อ จากชุด Super สรุปครบทั้งห้าไฟล์ ใช้ถ้อยคำและลำดับตัวเลือกตามต้นฉบับ 280 ข้อบอกปีที่ออกจริง (VCA 2558 ถึง 2568) จากชุดรวมข้อสอบเก่าของ CUVET และ 53 ข้อมีภาพจริงจากต้นฉบับ' },
    { kind: 'feature', scope: 'system', title: 'เฉลยทุกข้อตรวจซ้ำสองทาง', desc: 'ทุกข้อหาคำตอบใหม่โดยไม่ดูคำตอบในต้นฉบับ แล้วนำมาเทียบกัน ข้อที่ไม่ตรงกันตรวจกับแหล่งอ้างอิงที่เปิดอ่านจริง เช่น MSD Veterinary Manual, WOAH และแนวทางของ ACVIM และ AAFP ข้อที่ยังตัดสินไม่ได้ 133 ข้อยังไม่เปิดให้ทำ และมีเหตุผลกำกับทุกข้อ' },
    { kind: 'fix', scope: 'system', title: '46 ข้อที่คลังเคยเรียบเรียงใหม่ กลับเป็นข้อต้นฉบับ', desc: 'ใช้เลขข้อเดิม คำตอบที่เคยทำไว้จึงยังนับอยู่' },
  ],
};
