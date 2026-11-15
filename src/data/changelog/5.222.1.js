// Release 5.222.1. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.222.1',
  date: '2026-11-15',
  headline: 'แก้โน้ต Zoonoses เรื่อง prion หนึ่งบรรทัด',
  changes: [
    { kind: 'fix', scope: 'system', title: 'แก้บรรทัด PrPSc ในโน้ต prion ของ Zoonoses', desc: 'โน้ต prion ของ Zoonoses ไม่บอกแล้วว่า PrPSc อยู่ในรูป inactive เพราะทั้งเนื้อหาปีนี้และตำรามาตรฐานไม่ได้กล่าวไว้' },
  ],
};
