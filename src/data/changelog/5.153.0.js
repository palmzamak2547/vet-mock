// Release 5.153.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.153.0',
  date: '2026-10-21',
  headline: 'เชื่อมแอป: ตารางสอบเข้าปฏิทิน และการ์ด Anki',
  changes: [
    { kind: 'feature', scope: 'system', title: 'หน้าเชื่อมแอป', desc: 'เปิดได้จากหน้าโปรไฟล์ รวมแอปที่ใช้คู่กับ VetMock ไว้ที่เดียว' },
    { kind: 'feature', scope: 'system', title: 'ตารางสอบในปฏิทินของคุณ', desc: 'กดครั้งเดียวเพิ่มตารางสอบปี 4 หรือปี 5 ลง Google Calendar, Apple Calendar หรือ Outlook มีเวลา ห้อง และเตือนก่อน 1 วัน ถ้าตารางเปลี่ยน ปฏิทินอัปเดตเอง' },
    { kind: 'feature', scope: 'system', title: 'ส่งข้อสอบไป Anki', desc: 'ดาวน์โหลดข้อที่ปักหมุดหรือข้อที่ยังตอบผิดเป็นไฟล์ที่ Anki นำเข้าได้ ด้านหน้าเป็นโจทย์ ด้านหลังเป็นเฉลยพร้อมคำอธิบาย' },
  ],
};
