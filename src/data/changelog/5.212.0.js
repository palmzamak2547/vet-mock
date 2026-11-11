// Release 5.212.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.212.0',
  date: '2026-11-11',
  headline: 'เฉลยบอกที่มาครบขึ้น และคำอธิบายข้อที่ตอบผิดอ่านเรื่องที่ให้มาด้วย',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ข้อที่มีเรื่องหรือตารางให้อ่าน อธิบายข้อที่ตอบผิดได้ตรงขึ้น', desc: 'ปุ่ม "ทำไมข้อที่เลือกถึงไม่ใช่" ในข้อที่มีกรณีหรือตารางอยู่เหนือโจทย์ อธิบายโดยอ่านเรื่องนั้นด้วย จึงอ้างตัวเลขในตารางได้' },
    { kind: 'feature', scope: 'system', title: 'ที่มาของข้อบอกเอกสารที่ใช้ตรวจเฉลย', desc: 'หลังเห็นเฉลยและกด "ดูเต็ม" จะเห็นชื่อเอกสารที่ใช้ตรวจคำตอบพร้อมตำแหน่งในเอกสาร กดชื่อเพื่อเปิดในแท็บใหม่ได้ และลิงก์เอกสารต้นฉบับบอกทั้งหน้าและข้อ' },
  ],
};
