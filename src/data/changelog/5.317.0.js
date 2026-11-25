// Release 5.317.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.317.0',
  date: '2026-11-26',
  headline: 'เลือกให้แอปเป็นภาษาอังกฤษได้ทุกหน้า',
  changes: [
    { kind: 'feature', scope: 'system', title: 'เปลี่ยนภาษาได้จากเมนูธีม', desc: 'แถวภาษาอยู่บนสุดของเมนูธีม ทั้งที่หัวแอปและหน้าโปรไฟล์ เลือก English แล้วทุกหน้าเปลี่ยนทันทีโดยไม่ต้องโหลดใหม่ และเครื่องนี้จำไว้ เปิดครั้งหน้าก็เป็นภาษาที่เลือก' },
    { kind: 'feature', scope: 'system', title: 'ข้อสอบ โน้ต และชื่อยังเป็นภาษาเดิม', desc: 'เมื่อเลือก English จะเปลี่ยนแค่ปุ่ม เมนู และคำอธิบายของแอป ส่วนโจทย์ โน้ตที่เขียนเอง ชื่ออาจารย์ ชื่อไทยของอวัยวะใน Atlas และรายการในอัปเดตล่าสุด ยังเป็นภาษาที่เขียนไว้' },
    { kind: 'feature', scope: 'system', title: 'การ์ดสรุปช่วงสอบเป็นภาษาที่เลือก', desc: 'เลือก English แล้วการ์ดในหน้าสรุปช่วงสอบเป็นภาษาอังกฤษทั้งใบ ปีการศึกษาเป็น ค.ศ. และข้อความที่คัดลอกหรือแชร์ไปพร้อมการ์ดก็เป็นภาษาอังกฤษด้วย' },
  ],
};
