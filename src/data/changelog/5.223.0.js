// Release 5.223.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.223.0',
  date: '2026-11-15',
  headline: 'โจทย์ zoonoses อ่านฉบับอังกฤษได้แล้ว พร้อมศัพท์เฉพาะทางท้ายบท VetWiki',
  changes: [
    { kind: 'feature', scope: 'system', title: 'ปุ่ม ไทย/EN สลับโจทย์เป็นภาษาอังกฤษ', desc: 'ในหน้าทำโจทย์ กด EN เพื่อดูโจทย์และตัวเลือกฉบับอังกฤษของวิชา zoonoses 367 ข้อ กด ไทย เพื่อกลับ ข้อที่ยังไม่มีฉบับแปลแสดงไทยพร้อมโน้ตกำกับ' },
    { kind: 'feature', scope: 'system', title: 'กล่องศัพท์เฉพาะทางท้ายบท VetWiki', desc: 'บทความ zoonoses 16 บทปิดท้ายด้วยตาราง "ศัพท์เฉพาะทางในบทนี้" รวม 213 คำ พร้อมคำแปลไทยและความหมายทางเวชศาสตร์ที่ยึดตามสิ่งที่บทพูดจริง' },
    { kind: 'fix', scope: 'system', title: 'แก้ปีในข้อ Duck plague ตามหลักฐาน', desc: 'ข้อ 8031 แก้ปีในตัวเลือกจาก พ.ศ. 2499 เป็น พ.ศ. 2519 (ค.ศ. 1976) ซึ่งตรงกับการระบาดครั้งแรกที่มีรายงานยืนยัน พร้อมคำอธิบายที่อ้างแหล่งตรวจสอบแล้ว' },
  ],
};
