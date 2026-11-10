// Release 5.197.1. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.197.1',
  date: '2026-11-10',
  headline: 'หน้าเลือกหัวข้อและช่องค้นหาเปิดเร็วขึ้น',
  changes: [
    { kind: 'fix', scope: 'system', title: 'หน้าเลือกหัวข้อและช่องค้นหาโหลดเบาลง', desc: 'เครื่องที่เปิดครั้งแรกดาวน์โหลดน้อยลงราว 275 KB ข้อมูลผลงานของอาจารย์จะโหลดเมื่อกดชื่ออาจารย์เพื่อดูโปรไฟล์' },
    { kind: 'fix', scope: 'system', title: 'ป้ายรูปแบบข้อสอบบนการ์ดวิชาอ่านได้ครบ', desc: 'ป้ายที่ข้อความยาวหลายบรรทัดบนมือถือไม่ตัดมุมตัวอักษรแล้ว' },
    { kind: 'fix', scope: 'system', title: 'ลบเครื่องหมายจุลภาคที่ลอยอยู่หน้าข้อความ', desc: 'หัวเรื่องหน้าเลือกวิชา ข้อความระหว่างรอโหลดหน้า และแถวโน้ตของคลิป' },
  ],
};
