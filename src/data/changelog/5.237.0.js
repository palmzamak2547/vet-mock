// Release 5.237.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.237.0',
  date: '2026-11-15',
  headline: 'ตอนเปิดเอกสารไฟล์ใหญ่ ชื่อเอกสาร รอยเท้า และตัวเลขความคืบหน้าไม่ทับกันแล้ว',
  changes: [
    { kind: 'fix', scope: 'system', title: 'รอยเท้าไม่ทับชื่อเอกสาร', desc: 'ระหว่างรอไฟล์จากคลังเอกสาร รอยเท้าเดินอยู่บนแถบของตัวเอง ใต้ชื่อเอกสาร ชื่อยาวสองสามบรรทัดก็ไม่โดนบัง' },
    { kind: 'fix', scope: 'system', title: 'เปอร์เซ็นต์กับขนาดไฟล์อยู่บรรทัดเดียวกัน', desc: 'ตัวเลขเปอร์เซ็นต์ไม่ทับคำว่า กำลังโหลด อีก ตอนนี้อ่านเป็นบรรทัดเดียว เช่น 5% กำลังโหลด 1.3 / 24.5 MB และแถบสีเขียวยาวขึ้นตามที่โหลดได้จริง' },
  ],
};
