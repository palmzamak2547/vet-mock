// Release 5.204.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.204.0',
  date: '2026-11-11',
  headline: 'โจทย์ Epidemiology อีก 13 ข้อ ตัวเลขอยู่ในตาราง',
  changes: [
    { kind: 'content', scope: 'system', title: 'โจทย์ Epidemiology อีก 13 ข้อแสดงตัวเลขเป็นตาราง', desc: 'ข้อที่ตัวเลขเคยเรียงอยู่ในประโยคคำถาม เช่น ข้อมูล 2x2 และผลแบ่งชั้น ตอนนี้ตัวเลขอยู่ในตารางเหนือคำถาม และคำถามเหลือแค่สิ่งที่ถาม ตัวเลขคงเดิมทุกตัว เสียงอ่านคำถามยังอ่านตัวเลขครบ และพาไปที่ตารางระหว่างอ่าน' },
    { kind: 'fix', scope: 'system', title: 'ปุ่มกลับไปดู passage ไม่บังปุ่มข้อถัดไป', desc: 'บนมือถือ ปุ่มนี้เคยทับครึ่งขวาของปุ่มข้อถัดไป ตอนนี้อยู่เหนือแถวปุ่ม ขึ้นเฉพาะตอนที่ passage พ้นจอ และกดแล้วเปิด passage ที่ซ่อนไว้ให้ด้วย ถ้าซ่อน passage ไว้ ข้อถัดไปที่เป็นคนละ passage จะเปิดให้เอง และชื่อ passage ตัวใหญ่ขึ้น อ่านง่ายขึ้น' },
  ],
};
