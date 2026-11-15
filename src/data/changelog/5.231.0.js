// Release 5.231.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.231.0',
  date: '2026-11-15',
  headline: 'หน้าทบทวนตามรอบสั้นลงและเป็นภาษาไทย ส่วนตัวเลขข้อที่บันทึกไว้ตรงกันทั้งสองหน้า',
  changes: [
    { kind: 'fix', scope: 'system', title: 'จำนวนข้อที่บันทึกไว้ไม่ขัดกันอีก', desc: 'ปุ่มบันทึกที่หัวแอปนับข้อที่กดบันทึกไว้ แต่หน้า Pinboard นับเฉพาะที่ปักหมุด จึงเคยเห็นหัวแอปบอก 1 ส่วนบอร์ดบอก 0 ตอนนี้บอร์ดมีบรรทัด “ข้อที่บันทึกไว้” พร้อมปุ่มทำข้อเหล่านั้นต่อ' },
    { kind: 'improve', scope: 'system', title: 'หน้าทบทวนตามรอบตัดข้อความที่ซ้ำออก', desc: 'ปุ่มเริ่มเป็น “เริ่มทบทวน” คำให้กำลังใจใต้หัวข้อหายไป หน้าทบทวนเสร็จพูดครั้งเดียว และคำแนะนำในส่วนปรับเองเป็นประโยคไทยสั้นๆ' },
  ],
};
