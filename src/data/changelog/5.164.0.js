// Release 5.164.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.164.0',
  date: '2026-10-27',
  headline: 'ให้ปฏิทินเตือนทำโจทย์ทุกวัน',
  changes: [
    { kind: 'feature', scope: 'system', title: 'เตือนทำโจทย์ทุกวัน', desc: 'เลือกเวลา แล้วเพิ่มนัดที่ซ้ำทุกวันลง Google Calendar หรือปฏิทินอื่นอย่าง Apple และ Outlook ได้ที่หน้าเชื่อมแอป ถ้าเคยทำโจทย์สม่ำเสมอ จะเสนอเวลาที่คุณมักทำโจทย์ให้ด้วย' },
    { kind: 'feature', scope: 'system', title: 'ชวนตั้งเตือนหลังชุดแรกของวัน', desc: 'หลังทำชุดแรกของวันเสร็จ หน้าผลลัพธ์จะถามครั้งเดียวว่าอยากให้เตือนไหม ตอบไม่ต้องแล้วจะไม่ถามอีก' },
  ],
};
