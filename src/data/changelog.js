// ============================================================
// CHANGELOG — สิ่งที่อัปเดตล่าสุด แสดงเป็น banner บนหน้าแรก
// ============================================================
// แต่ละ entry คือ release หนึ่ง · เรียงใหม่สุดอยู่ index 0
//
// ใช้ `version` เป็น key เก็บ "เห็นแล้ว" ใน localStorage
//   ('vmx-last-seen-changelog' = '5.1.0')
// → ถ้า version ใหม่ขึ้น → banner โผล่ใหม่
//
// changes[].kind:
//   'feature'  เขียว — ฟีเจอร์ใหม่
//   'fix'      ทอง — แก้บั๊ก
//   'content'  กลาง — เพิ่มข้อสอบ/notes/data
// ============================================================

export const CHANGELOG = [
  {
    version: '5.1.5',
    date: '2026-04-27',
    headline: '🎯 แยก MCQ vs Writing + Smart timer + Past Exam 2021',
    changes: [
      { kind: 'feature', icon: '📝', title: 'แยก MCQ และ Writing ชัดเจน',
        desc: 'หน้า Config มีเลือก 3 โหมด: ทุกประเภท / MCQ + T/F (auto-graded) / Writing เท่านั้น (short + essay)' },
      { kind: 'feature', icon: '⏱', title: 'Smart timer ต่อประเภท',
        desc: 'ตั้งเวลา 60 วิ ครั้งเดียว — ระบบให้ MCQ 60 วิ · Short answer 3 นาที · Essay 25 นาที (ตามสัดส่วนสอบจริง 2 ชม. = 5 นาที/short + 25 นาที/essay)' },
      { kind: 'fix', icon: '⚠️', title: 'Confirm ก่อนข้ามข้อเขียนที่ยังไม่ตอบ',
        desc: 'กด "ข้อถัดไป" ที่ short/essay ที่ยังไม่ได้เขียน → ถามยืนยัน "ข้ามจริงๆ?" ก่อน — กันพลาดเพราะกดเร็ว' },
      { kind: 'fix', icon: '📊', title: 'Score % ไม่นับข้อเขียนผิด',
        desc: 'Auto-graded score แสดงเฉพาะ MCQ/T/F — Writing แสดงแยก "X/Y ข้อเขียนเสร็จ" + ตรวจใน Review (Self / 🤖 AI)' },
      { kind: 'content', icon: '📜', title: 'Past Exam 2021 — Part III Paraphrase',
        desc: '+1 mock ของจริงปี 2021 (Pets prevent allergies passage) พร้อม sample response จากนักเรียน 2021 + key ideas ที่ marker จะเช็ก' },
    ],
  },
  {
    version: '5.1.4',
    date: '2026-04-27',
    headline: '🤖 Smart AI grading + 4 Mock Exams Eng Vet Prof II ครบ',
    changes: [
      { kind: 'feature', icon: '🤖', title: 'Smart AI score assessment',
        desc: 'หลังเขียน summary/short answer → กดปุ่ม "🤖 Smart AI grade" → AI ตรวจตาม rubric · score breakdown ต่อเกณฑ์ + จุดเด่น + จุดที่ควรปรับ · หรือเลือก "📝 Self assess" ก็ได้' },
      { kind: 'content', icon: '📚', title: '4 Mock Exams ครบ Part I + Part II',
        desc: 'Mock 1: MDORS/CORS · Mock 2: Bone density baboons · Mock 3: Newcastle Oman · Mock 4: ✏️ AMR/MRSP (เขียนใหม่ตาม Final spec) · ทุก mock เรียงคำถามตาม section flow (Intro→Methods→Results→Discussion→T/F→Essay)' },
      { kind: 'content', icon: '✏️', title: '20 short-answer + 11 T/F + 4 essay จาก Exercise 2 KEY',
        desc: 'คำตอบ + keywords ดึงตรงจาก Exercise 2 KEY ที่อาจารย์ให้ · ใช้ฝึกได้สมจริง' },
      { kind: 'feature', icon: '📋', title: 'Reordered ID + question flow',
        desc: 'Within each mock: passage แสดงก่อนคำถาม · คำถามเรียงตาม section · เลขข้อ run ต่อเนื่อง make sense' },
    ],
  },
  {
    version: '5.1.3',
    date: '2026-04-27',
    headline: '✍️ Mock Exam Eng Vet Prof II พร้อมแล้ว — เขียน summary จริงๆ ได้เลย',
    changes: [
      { kind: 'feature', icon: '✍️', title: 'รองรับการเขียน Summary จริง',
        desc: 'เพิ่ม 2 question types ใหม่: short answer (พิมพ์คำตอบสั้น) + essay (textarea + word counter + penalty zones สี: เขียว/ทอง/แดง)' },
      { kind: 'feature', icon: '📄', title: 'Reading passage attached to questions',
        desc: 'แสดง passage ยาวด้านบน + คำถามด้านล่าง (collapsible) เหมือน Final Part I จริงๆ' },
      { kind: 'content', icon: '🎯', title: 'Mock Final 86 — Part I + Part II',
        desc: 'Part I: บทความ MDORS/CORS (Pet-Human Relationships) + 8 short answers + 4 T/F · Part II: บทความ Bats + เขียน 150-word summary' },
      { kind: 'content', icon: '📋', title: 'Model answer + rubric ใน Review',
        desc: 'ตอบเสร็จ → กดดูเฉลย → เห็น sample summary จาก textbook + marking criteria ครบ 15 pts (Content 7 + Org/Grammar 5 + Paraphrase 3) → ประเมินตัวเองได้' },
      { kind: 'fix', icon: '🧹', title: 'ลด MCQ meta-concept แปลกๆ ออก',
        desc: 'เก็บ warm-up ที่จำเป็นไว้ 20 ข้อ · ตัดข้อที่ไม่ตรงกับรูปแบบสอบจริงออก → focus ที่ mock + writing' },
    ],
  },
  {
    version: '5.1.2',
    date: '2026-04-27',
    headline: '🆕 Eng Vet Prof II พร้อมแล้ว! สอบพรุ่งนี้บ่าย',
    changes: [
      { kind: 'content', icon: '🗣️', title: 'Eng Vet Prof II — เปิดใช้งาน',
        desc: 'สอบ Final อังคาร 28 เม.ย. 13:00-15:00 · Units 4-5 · Reading Research Papers + Writing Summary' },
      { kind: 'content', icon: '📖', title: 'Notes ครบ 5 หัวข้อ',
        desc: 'Research paper structure (IMRD) · Research designs (8 แบบ) · Academic writing · Paraphrasing (5 techniques) · Summary writing rules + marking rubric' },
      { kind: 'content', icon: '✏️', title: '~36 ข้อสอบจำลอง',
        desc: 'MCQ + T/F ทุก topic · เลียนแบบ exam pattern (Part I reading, paraphrase acceptability, summary rules)' },
      { kind: 'feature', icon: '🎯', title: 'Exam strategy + word count rules',
        desc: 'Note หน้าสุดท้ายมี strategy เขียน summary 150 words · นับคำให้ดี (>180 = -1, >200 = -2)' },
    ],
  },
  {
    version: '5.1.1',
    date: '2026-04-27',
    headline: 'แก้บั๊ก + อัพเดตหลังเปิดใช้งานจริง',
    changes: [
      { kind: 'fix', icon: '🧮', title: 'สัดส่วนคะแนน COM III ถูกแล้ว',
        desc: 'งาน 20% (เดิมแสดง 10% ผิด) · Mid 40 + Final 40 + งาน 20 = 100 — ขอบคุณคนที่ส่ง feedback มาแจ้ง 🙏' },
      { kind: 'fix', icon: '⏱', title: 'Countdown สอบไม่ค้างอีกแล้ว',
        desc: 'สอบเสร็จปุ๊บ "สอบถัดไป" ขยับเป็นวิชาต่อไปทันที (เดิมรอข้ามเที่ยงคืน)' },
      { kind: 'fix', icon: '🔐', title: 'Login/Register หาย bug',
        desc: 'หลัง Login กลับหน้าแรกทันทีไม่ต้อง refresh · "ลืมรหัสผ่าน" ใช้งานได้ · username ซ้ำกันไม่ทำให้สมัครพัง' },
      { kind: 'feature', icon: '📱', title: 'Add to Home Screen สวยขึ้น',
        desc: 'iPad/iPhone กด Share → "เพิ่มสู่หน้าจอโฮม" → ได้ไอคอน 🐾 + standalone (ไม่มี Safari bar) ดูเหมือนแอปจริง' },
    ],
  },
  {
    version: '5.1.0',
    date: '2026-04-26',
    headline: 'อัปเดตใหม่ก่อนสอบ Final',
    changes: [
      { kind: 'feature', icon: '📚', title: 'รายการอ่าน',
        desc: 'ติ๊กหัวข้อที่อ่านเสร็จแล้ว เห็น progress · เปิดจากการ์ดใหม่หน้าแรก' },
      { kind: 'feature', icon: '🟢', title: 'นับคนออนไลน์ realtime',
        desc: 'เห็น badge "N คนกำลังเรียนอยู่" บน hero — รู้ว่ามีเพื่อนเรียนพร้อมกันกี่คน' },
      { kind: 'content', icon: '📖', title: 'COM IV notes ครบแล้ว',
        desc: 'ทวนเนื้อหาครบทั้ง COM III + IV + V (รวม 13 หัวข้อ Immune-mediated + Derm + Peds-Geri)' },
      { kind: 'content', icon: '✏️', title: '+12 ข้อสอบ FINAL 86',
        desc: 'รวบรวมข้อสอบเก่า COM III/IV/V — Spondylosis, IMHA-cat, WSAVA 2024 ฯลฯ' },
      { kind: 'fix', icon: '🩹', title: 'แก้ feedback บน iPad',
        desc: 'ส่งฟอร์มแล้วเมลมาถึงตรงๆ ไม่เด้งเปิดแอป Mail / ไม่บังคับกรอกอีเมล / รองรับ autofill' },
    ],
  },
];

// Convenience: latest entry for the announcement banner
export const LATEST_CHANGELOG = CHANGELOG[0];
