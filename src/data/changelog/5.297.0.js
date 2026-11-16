// Release 5.297.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.297.0',
  date: '2026-11-17',
  headline: 'แตะช่องพิมพ์ทันทีหลังเปลี่ยนหน้า แล้วพิมพ์ต่อได้เลย',
  changes: [
    { kind: 'fix', scope: 'system', title: 'แตะช่องพิมพ์หลังเปลี่ยนหน้า', desc: 'ถ้าเปลี่ยนหน้าแล้วแตะช่องพิมพ์ทันที เช่น ช่องค้นหาในคลังเอกสาร ช่องนั้นจะยังพร้อมพิมพ์อยู่ เดิมบนเครื่องที่ช้า ระบบอาจดึงเคอร์เซอร์ออกจากช่องนั้นเอง คีย์บอร์ดจึงหุบและตัวอักษรที่พิมพ์ไม่ขึ้น' },
  ],
};
