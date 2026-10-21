// Release 5.155.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.155.0',
  date: '2026-10-21',
  headline: 'สรุปบทเรียนอ่านได้เต็มจอบนมือถือ และเข้าสู่ระบบในแอป LINE ง่ายขึ้น',
  changes: [
    { kind: 'fix', scope: 'system', title: 'สรุปบทเรียนไม่ล้นจอมือถือ', desc: 'บนมือถือจอแคบ ข้อความในสรุปบทเรียนไม่ถูกตัดขอบขวาแล้ว ตารางกว้างเลื่อนดูในกรอบของตัวเอง' },
    { kind: 'fix', scope: 'auth', title: 'เข้าสู่ระบบในแอป LINE, Facebook, Instagram', desc: 'เปิดลิงก์ในแอป LINE จะเห็นปุ่มเข้าสู่ระบบด้วย LINE เป็นปุ่มแรก และไม่มีปุ่ม Google ที่เข้าไม่ได้ในเบราว์เซอร์ของแอปแล้ว' },
    { kind: 'feature', scope: 'system', title: 'ทวนข้อผิดได้จากหน้าทบทวน', desc: 'ถ้ายังไม่มีการ์ดทบทวน หน้าทบทวนบอกว่าข้อผิดจะกลายเป็นการ์ดเมื่อไร และมีปุ่มทวนข้อที่ยังตอบผิดให้กดได้เลย' },
  ],
};
