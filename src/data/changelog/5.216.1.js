// Release 5.216.1. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.216.1',
  date: '2026-11-14',
  headline: 'หน้าแรกบนแท็บเล็ตและจอกว้างอ่านหัวข้อได้ครบ',
  changes: [
    { kind: 'fix', scope: 'system', title: 'หัวข้อหน้าแรกไม่ถูกการ์ดโจทย์บังแล้ว', desc: 'บนแท็บเล็ตและจอกว้าง บรรทัดแรกของหัวข้อเคยวิ่งไปอยู่ใต้การ์ดโจทย์ ตอนนี้อยู่ในพื้นที่ของตัวเองครบทุกบรรทัด ทั้งภาษาไทยและอังกฤษ' },
    { kind: 'fix', scope: 'system', title: 'ภาพ radiograph หลังการ์ดไม่ถูกเมนูทับแล้ว', desc: 'วงภาพ radiograph หลังการ์ดโจทย์เริ่มใต้แถบเมนู และไม่ล้นออกนอกขอบจออีก' },
  ],
};
