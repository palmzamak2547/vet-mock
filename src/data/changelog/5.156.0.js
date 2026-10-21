// Release 5.156.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.156.0',
  date: '2026-10-22',
  headline: 'วาดวงเลือกเส้นแล้วย้ายได้ และมีสมุดเปล่าให้เขียนโดยไม่ต้องมี PDF',
  changes: [
    { kind: 'feature', scope: 'system', title: 'เลือกเส้นด้วยการวาดวง', desc: 'ในหน้าเขียนบน PDF กดเครื่องมือเลือกเส้น วาดวงล้อมสิ่งที่เขียนไว้ แล้วลากไปวางที่อื่น ลากมุมเพื่อย่อหรือขยาย เปลี่ยนสี ทำสำเนา หรือลบ กดย้อนกลับครั้งเดียวได้ทั้งชุด' },
    { kind: 'feature', scope: 'system', title: 'สมุดเปล่า', desc: 'สร้างสมุดเขียนได้ทันที เลือกกระดาษว่าง เส้นบรรทัด ตาราง จุด หรือแบบ Cornell ใช้ปากกา ไฮไลต์ ยางลบ และเต็มจอได้เหมือนเขียนบนสไลด์ เพิ่มหน้าได้โดยสิ่งที่เขียนไว้ยังอยู่ครบ' },
  ],
};
