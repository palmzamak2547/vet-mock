// Release 5.219.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.219.0',
  date: '2026-11-15',
  headline: 'คลิปบรรยายได้สไลด์ของคาบตัวเองแม่นขึ้น',
  changes: [
    { kind: 'fix', scope: 'system', title: 'คลิปได้สไลด์ของคาบตัวเอง', desc: 'ขั้นจับคู่สไลด์ไม่หยิบตารางเรียนมาเป็นสไลด์ของคลิปอีก และเมื่อชื่อคลิปไม่มีคำเฉพาะ จะใช้สไลด์ของวิชาเดียวกันที่ลงวันที่สอนตรงกับคลิป รวมคาบที่สอนหลายเรื่อง เช่น ORT, Campylobacteriosis, Listeriosis และ Histomoniasis ในคาบเดียว' },
  ],
};
