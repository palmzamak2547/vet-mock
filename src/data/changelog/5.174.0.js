// Release 5.174.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.174.0',
  date: '2026-10-29',
  headline: 'Equine Med ปลายภาคมีข้อสอบเก่า 139 ข้อ และ Swine มีข้อจากจุดที่รุ่นพี่มาร์ค',
  changes: [
    { kind: 'feature', scope: 'system', title: 'ข้อสอบเก่าปลายภาค Equine Med 139 ข้อ', desc: 'ข้อที่รุ่นพี่บันทึกไว้หลังสอบปลายภาค ทั้ง neonatal, ophthalmology, anesthesia, POA และ lameness ตามรูปแบบเดิมของข้อสอบ เฉลยตรวจกับสไลด์ปีนี้ ข้อที่มีภาพแนบภาพจากเอกสารจริง และข้อที่ตัวเลือกไม่ได้ถูกบันทึกไว้บอกในที่มาว่าตัวเลือกเรียบเรียงจากสไลด์' },
    { kind: 'feature', scope: 'system', title: 'Swine Medicine ข้ออิงแนวข้อสอบ 82 ข้อ', desc: 'เขียนจากจุดที่รุ่นพี่ขีดเส้นแดง ติดดาว หรือไฮไลต์ไว้ในสไลด์และสรุปปลายภาค ข้อละหนึ่งจุดที่คลังยังไม่เคยถาม แต่ละข้อบอกว่ามาร์คโดยรุ่นไหน และอยู่ใน Panic Mode ถัดจากข้อสอบเก่า' },
  ],
};
