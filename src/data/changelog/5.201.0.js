// Release 5.201.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.201.0',
  date: '2026-11-11',
  headline: 'กดหัวข้อแล้วเริ่มฝึกได้เลย ระบบจัดชุดให้',
  changes: [
    { kind: 'feature', scope: 'system', title: 'ชุดฝึกและรอบทบทวนจัดให้พร้อมเริ่ม', desc: 'กดหัวข้อแล้วเห็นบรรทัดเดียวว่าจัดอะไรให้และเพราะอะไร ปุ่มเริ่มอยู่ใต้บรรทัดนั้น ตัวเลือกทั้งหมดอยู่ใน "ปรับเอง" ถ้าปรับเองไว้ ครั้งหน้าระบบจะจัดตามที่คุณตั้ง' },
    { kind: 'feature', scope: 'system', title: 'เลือกชั้นปีแล้วเข้าหน้าแรกได้เลย', desc: 'ระบบเลือกช่วงสอบให้ตามตารางสอบ เปลี่ยนได้ที่ปุ่ม "เปลี่ยน" หน้าแรกแสดงโหมดซ้อมที่เหมาะที่สุดก่อน โหมดอื่นอยู่ใน "โหมดอื่น"' },
  ],
};
