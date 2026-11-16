// Release 5.291.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.291.0',
  date: '2026-11-16',
  headline: 'เส้นที่เขียนด้วยปากกาบน PDF ไม่หายเมื่อฝ่ามือยังวางอยู่บนจอ',
  changes: [
    { kind: 'fix', scope: 'system', title: 'เส้นปากกาไม่หายเพราะฝ่ามือ', desc: 'ในโหมดรับเฉพาะปากกาบน PDF ถ้าวางฝ่ามือบนจอก่อนลงปากกา แล้วยกปากกาขึ้นขณะที่ฝ่ามือยังวางอยู่ เส้นที่เพิ่งเขียนเคยหายไป ตอนนี้เส้นนั้นถูกเก็บไว้ตามปกติ' },
    { kind: 'fix', scope: 'system', title: 'วาดทับภาพและช่องเขียนลายมือ', desc: 'วาดทับภาพในโหมดรับเฉพาะปากกา ยกฝ่ามือขึ้นระหว่างเขียนแล้วเส้นไม่ขาด และเมื่อแตะสองนิ้ว เส้นไม่โยงไปมาระหว่างสองนิ้วแล้ว ช่องเขียนลายมือบอกเมื่อยังเตรียมไม่เสร็จหรือเปิดไม่ได้ และมีปุ่มลองอีกครั้ง' },
  ],
};
