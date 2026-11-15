// Release 5.227.6. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.227.6',
  date: '2026-11-15',
  headline: 'ปุ่มเริ่มกับปุ่มปรับเองอยู่ที่เดิม ตอนที่แอปนับใบหรือนับข้อเสร็จ กดแล้วติดทุกครั้ง',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ปุ่มเริ่ม Session ไม่ขยับหนีนิ้วอีก', desc: 'เปิดหน้าทบทวนตามรอบหรือหน้าตั้งค่าการฝึกครั้งแรก ระหว่างที่แอปยังนับใบหรือนับข้อ ปุ่มเริ่มกับปุ่มปรับเองอยู่ที่เดิมตลอด กดตอนนับเสร็จพอดีก็ไม่หลุด' },
  ],
};
