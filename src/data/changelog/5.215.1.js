// Release 5.215.1. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.215.1',
  date: '2026-11-14',
  headline: 'ไฟล์ในคลังที่มีรายชื่อหรือรหัสนิสิตจะไม่แสดงจนกว่าจะตรวจแล้ว',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ไฟล์ที่มีข้อมูลส่วนตัวของนิสิตไม่แสดงในคลังแล้ว', desc: 'ไฟล์ที่ระบบพบว่ามีรายชื่อหรือรหัสนิสิต เช่น รายชื่อกลุ่มหรือรายชื่อในชั้น จะไม่อยู่ในคลัง ค้นหาไม่เจอ และเปิดไม่ได้ จนกว่าจะมีคนตรวจแล้ว ไฟล์ที่ตรวจแล้วว่าไม่มีข้อมูลส่วนตัวจะกลับมาเองทันที' },
  ],
};
