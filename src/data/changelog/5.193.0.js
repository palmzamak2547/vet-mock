// Release 5.193.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.193.0',
  date: '2026-11-09',
  headline: 'Milk & Meat ปลายภาค: 239 ข้อจากจุดที่รุ่นพี่มาร์คไว้ ขึ้นใน Panic Mode แล้ว',
  changes: [
    { kind: 'feature', scope: 'system', title: 'Milk & Meat ปลายภาค เพิ่ม 239 ข้อจากจุดที่รุ่นพี่มาร์คไว้', desc: 'หนึ่งข้อต่อหนึ่งจุดที่รุ่นพี่ Vet 84 และ Vet 85 ขีดเส้นแดง ติดดาว หรือไฮไลต์ไว้ และคลังยังไม่มีข้อถาม ครบทุกหัวข้อ meat และ cleaning ทุกข้อตรวจกับสไลด์ปี 2569 ติดป้ายอิงแนวข้อสอบ และคำตอบตรวจซ้ำแบบไม่เห็นเฉลยตรงกันครบ 222 ข้อ Panic Mode ปลายภาคของวิชานี้จาก 173 เป็น 412 ข้อ' },
    { kind: 'fix', scope: 'system', title: 'Epidemiology: 7 ข้อเดิมที่ถามจุดที่รุ่นพี่มาร์คไว้ขึ้นใน Panic Mode แล้ว', desc: 'ข้อจากเนื้อหาบรรยายที่ถามตรงกับจุดที่รุ่นพี่ติดดาวหรือมาร์คไว้ ติดป้ายอิงแนวข้อสอบแล้ว Panic Mode ปลายภาคของ Epidemiology จาก 66 เป็น 73 ข้อ' },
    { kind: 'fix', scope: 'system', title: 'Equine Med: 17 ข้อเรื่อง lameness ตรวจกับสไลด์ปี 2569 แล้ว', desc: '13 ข้ออ้างหน้าสไลด์ lameness ปี 2569 ได้แล้ว อีก 4 ข้อเป็นเรื่องที่สไลด์ปีนี้ไม่ได้กล่าวถึงและบอกไว้ในข้อ แก้คำตอบหรือคำอธิบาย 10 ข้อ เช่น ผลบล็อกที่ดีขึ้นบางส่วน ตำแหน่ง fetlock และ X-ray กับ ultrasound ที่ทำก่อนหลังได้' },
    { kind: 'fix', scope: 'system', title: 'Milk Hygiene: ข้อสารฆ่าเชื้อที่ตอบได้สองแบบแสดงพร้อมคำเตือน', desc: 'ข้อสอบเก่าเรื่องสารที่ประสิทธิภาพลดลงเมื่อมีสารอินทรีย์ คำตอบที่บันทึกไว้คือ Iodophores แต่ surface active agents ก็ไม่ควรใช้เมื่อมีสารอินทรีย์เช่นกัน และคำอธิบายข้อวัตถุประสงค์ของการตรวจก่อนฆ่ากล่าวครบทุกข้อแล้ว' },
    { kind: 'fix', scope: 'system', title: 'บันทึกการอัปเดต 5.189.1 แยกตัวเลขข้อสอบเก่ากับจำนวนการ์ด', desc: 'ชื่อรายการบอกแล้วว่าเป็นตัวเลขข้อสอบเก่า 3 ฉบับ และจำนวนการ์ด Panic Mode 1 ฉบับ' },
  ],
};
