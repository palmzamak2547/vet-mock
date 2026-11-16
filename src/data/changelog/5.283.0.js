// Release 5.283.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.283.0',
  date: '2026-11-16',
  headline: 'ใส่รูปของตัวเองบนโปรไฟล์ได้แล้ว เห็นเฉพาะเพื่อนในจุฬาที่เข้าสู่ระบบ',
  changes: [
    { kind: 'feature', scope: 'system', title: 'รูปโปรไฟล์ของคุณเอง', desc: 'ในหน้าโปรไฟล์กด "ใส่รูปของคุณ" เลือกรูปหรือถ่ายรูปใหม่ เปลี่ยนรูปหรือลบรูปเพื่อกลับไปใช้รูปสำเร็จรูปได้ทุกเมื่อ รูปถูกย่อเป็นสี่เหลี่ยมจัตุรัสและตัดข้อมูลแฝงอย่างตำแหน่งที่ถ่ายออก เห็นเฉพาะเพื่อนในจุฬาที่เข้าสู่ระบบ' },
    { kind: 'feature', scope: 'system', title: 'รายงานรูปที่ไม่เหมาะสม', desc: 'ในหน้าสมาชิกของกลุ่มกด "รายงานรูปนี้" ใต้รูปของเพื่อนได้ เมื่อมีเพื่อนรายงานรูปเดียวกันครบ 3 คน รูปจะถูกซ่อน และเจ้าของรูปเห็นข้อความแจ้งในหน้าโปรไฟล์' },
  ],
};
