// Release 5.192.6. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.192.6',
  date: '2026-11-09',
  headline: 'เปิดสไลด์จาก VetMock AI แล้วไปถึงหน้าที่ตอบ ในมือถือด้วย',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ปุ่มเปิดใน VetMock AI พาไปหน้าที่ตรงกับคำตอบ ทั้งใน iPhone และ Android', desc: 'เดิมเปิดไฟล์ PDF จาก VetMock AI ใน iPhone จะเห็นหน้าแรกเสมอ ส่วน Android มักดาวน์โหลดไฟล์ไปแทน ตอนนี้ไฟล์ PDF เปิดในตัวอ่านของ VetMock ที่หน้านั้นเลย ไฟล์ Word และ PowerPoint เปิดและดาวน์โหลดได้เหมือนเดิม' },
    { kind: 'fix', scope: 'auth', title: 'เข้าสู่ระบบจากลิงก์เอกสาร แล้วกลับมาที่เอกสารเดิม', desc: 'เปิดลิงก์เอกสารตอนยังไม่ได้เข้าสู่ระบบ พอเข้าสู่ระบบด้วยบัญชีจุฬาแล้วเคยได้ตัวอ่านว่าง ๆ ตอนนี้กลับมาที่เอกสารและหน้าที่ลิงก์ชี้ไว้' },
    { kind: 'fix', scope: 'system', title: 'ตัวอ่านหาเอกสารไม่เจอ ยังเปิดไฟล์ต้นฉบับหรือดาวน์โหลดได้', desc: 'ลิงก์ที่ชี้ไปเอกสารซึ่งคลังในเครื่องหาไม่เจอ ตัวอ่านบอกเหตุผล พร้อมปุ่มเปิดไฟล์ต้นฉบับและดาวน์โหลดไฟล์ ไม่ค้างอยู่ที่ข้อความแจ้งอย่างเดียว' },
  ],
};
