// Release 5.249.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.249.0',
  date: '2026-11-16',
  headline: 'ปรับเสียงอ่านได้เอง ทั้งความเร็ว โทนเสียง และเสียงของเครื่อง',
  changes: [
    { kind: 'feature', scope: 'system', title: 'ปรับเสียงอ่านจากแถบเสียงอ่าน', desc: 'แตะปุ่มความเร็วบนแถบเสียงอ่าน แล้วเลือกแบบ ช้าและชัด ปกติ หรือเร็ว ทบทวน หรือตั้งความเร็ว โทนเสียง และเสียงของเครื่องที่ใช้อ่านเอง กดลองฟังได้ทันที ค่าที่ตั้งเก็บไว้ในเครื่องนี้ ไม่เสียเครดิต' },
    { kind: 'feature', scope: 'system', title: 'ความเร็วไม่ทำให้เสียงเพี้ยน', desc: 'เสียงที่อัดไว้แล้วเล่นเร็วหรือช้าโดยคงระดับเสียงเดิม โทนเสียงปรับได้กับเสียงอ่านของเครื่อง ระหว่างทำข้อสอบจับเวลา ปุ่มความเร็วเปลี่ยนความเร็วทีละขั้นเหมือนเดิม' },
  ],
};
