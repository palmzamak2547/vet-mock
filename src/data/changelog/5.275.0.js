// Release 5.275.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.275.0',
  date: '2026-11-16',
  headline: 'สมุดที่เบราว์เซอร์ไม่ยอมเก็บ แอปบอกทันทีตอนเพิ่มหน้าหรือเปิดสมุด',
  changes: [
    { kind: 'fix', scope: 'system', title: 'เพิ่มหน้ากระดาษไม่สำเร็จ แอปบอกตรงๆ', desc: 'ถ้าเบราว์เซอร์เก็บข้อมูลไม่ได้ (พื้นที่เต็มหรือปิดการเก็บไว้) การเพิ่มหน้ากระดาษหรือเปิดสมุดขึ้นกล่อง "บันทึกไม่สำเร็จ" พร้อมวิธีแก้ ไม่มีหน้าใหม่ที่จะหายไปเมื่อเปิดสมุดครั้งหน้าอีก' },
  ],
};
