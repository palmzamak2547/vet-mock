// Release 5.274.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.274.0',
  date: '2026-11-16',
  headline: 'ข้อเขียนในชุดข้อสอบ: แตะช่องเขียนแล้วหน้าไม่ขยายบน iPhone และถ้าคะแนนที่ตรวจเองบันทึกไม่ได้ แอปบอก',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ช่องเขียน summary ไม่ซูมหน้าจอบน iPhone', desc: 'ตัวหนังสือในช่องเขียนใหญ่ขึ้นเป็น 16 px แตะเข้าไปเขียนกลางชุดแล้วหน้าไม่ขยายเอง' },
    { kind: 'fix', scope: 'system', title: 'ถ้าคะแนนที่ตรวจเองบันทึกไม่ได้ แอปบอก', desc: 'ถ้าเบราว์เซอร์เก็บข้อมูลไม่ได้ เช่นในโหมดส่วนตัว ใต้ช่องตรวจคะแนนจะมีหนึ่งบรรทัดบอกว่ายังไม่ได้บันทึก และวิธีแก้ แทนที่ติ๊กที่ตรวจไว้จะหายเองเมื่อเปิดข้อนี้อีกครั้ง' },
    { kind: 'fix', scope: 'system', title: 'จุลภาคชิดคำในตัวนับคำและป้ายคะแนน', desc: 'หมายเหตุหักคะแนนเมื่อเขียนเกินจำนวนคำ และป้ายคะแนนที่ตรวจเอง อ่านเป็น "150 words, −2 pts" และ "10 / 15, 67%" ไม่มีช่องว่างแปลกหน้าจุลภาค' },
  ],
};
