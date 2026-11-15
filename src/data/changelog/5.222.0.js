// Release 5.222.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.222.0',
  date: '2026-11-15',
  headline: 'โน้ต Swine, Equine Medicine และ One Health บอกจุดที่ต่างจากแหล่งอ้างอิง และบรรทัดแหล่งที่มาอ่านเป็นคำ',
  changes: [
    { kind: 'content', scope: 'system', title: 'หมายเหตุจุดที่คาบต่างจากแหล่งอ้างอิง 35 จุด', desc: 'โน้ต Swine, Equine Medicine และ One Health: เพิ่มหมายเหตุ 35 จุดที่เนื้อหาในคาบต่างจากแหล่งอ้างอิงภายนอก เช่น ขนาดยาและความเข้มข้นของยาฆ่าเชื้อ แต่ละจุดมีแหล่งที่ตรวจแล้ว' },
    { kind: 'fix', scope: 'system', title: 'บรรทัดแหล่งที่มาในสรุปอ่านเป็นคำ', desc: 'ใต้แต่ละส่วนในสรุป บรรทัด "แหล่งที่มา" บอกชื่อคลิปพร้อมวันที่ และชื่อเอกสารที่อ่านออก แทนรหัสคลิปกับชื่อไฟล์ดิบ' },
    { kind: 'fix', scope: 'system', title: 'แก้ ileitis ในโน้ต Swine หนึ่งบรรทัด', desc: 'แก้โน้ต Swine เรื่อง ileitis หนึ่งบรรทัดที่อ่านค่าจากกราฟผิด' },
    { kind: 'fix', scope: 'system', title: 'ช่องตารางที่ไม่มีข้อมูลแสดงเป็น -', desc: 'ช่องตารางที่ไม่มีข้อมูลในโน้ตใหม่แสดงเป็น - แทนข้อความว่าสไลด์ไม่ได้ระบุ' },
  ],
};
