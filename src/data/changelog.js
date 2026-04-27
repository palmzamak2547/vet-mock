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
//
// changes[].scope: บอกว่าอัปเดตนี้แตะส่วนไหน
//   'system'    ⚙️ ระบบ — UI / engine / cross-subject infrastructure
//   'engprof'   🗣️ Eng Vet Prof II
//   'com3'      🚨 COM III
//   'com4'      🩺 COM IV
//   'com5'      🐕 COM V
//   'auth'      🔐 Login / Register
//   'multi'     ⚡ ส่งผลหลายส่วน (ใช้กับการแก้ที่เกี่ยวข้อง 2+ scope)
// ============================================================

// Display metadata for each scope. Used by HomeView to render the
// little color-coded chip next to each change. Keep these short —
// they sit inline with the title.
export const SCOPE_LABELS = {
  system:   { icon: '⚙️',  label: 'ระบบ',          color: 'var(--clr-ink-soft)',     bg: 'var(--clr-surface-2)' },
  engprof:  { icon: '🗣️',  label: 'Eng Vet Prof II', color: '#5c6b7d',                 bg: 'rgba(92, 107, 125, 0.12)' },
  com3:     { icon: '🚨',  label: 'COM III',        color: '#c26d6d',                 bg: 'rgba(194, 109, 109, 0.12)' },
  com4:     { icon: '🩺',  label: 'COM IV',         color: '#6b5b8e',                 bg: 'rgba(107, 91, 142, 0.12)' },
  com5:     { icon: '🐕',  label: 'COM V',          color: '#3d6b82',                 bg: 'rgba(61, 107, 130, 0.12)' },
  auth:     { icon: '🔐',  label: 'Login/Register', color: 'var(--clr-sage)',          bg: 'rgba(74, 107, 74, 0.12)' },
  multi:    { icon: '⚡',  label: 'หลายส่วน',        color: 'var(--clr-gold)',          bg: 'rgba(184, 137, 64, 0.12)' },
};

export const CHANGELOG = [
  {
    version: '5.1.9',
    date: '2026-04-27',
    headline: '🧹 เก็บ Smart AI grading ออก + จัดให้ Writing UI โผล่เฉพาะ Eng Vet Prof II',
    changes: [
      { scope: 'system', kind: 'fix', icon: '🧹', title: 'Smart AI grading ซ่อนไว้ก่อน',
        desc: 'หน้า Review ของข้อเขียนแสดงแค่ Self-assess + model + rubric · ไม่ต้องตั้ง ANTHROPIC_API_KEY แล้ว · code สำหรับ AI ยังเก็บไว้ในระบบเผื่ออนาคต' },
      { scope: 'engprof', kind: 'fix', icon: '🎯', title: 'Category picker เฉพาะ Eng Vet Prof II',
        desc: 'หน้า ConfigView "ทุกประเภท / MCQ / Writing เท่านั้น" โผล่เฉพาะตอนเลือกวิชา Eng Vet Prof II · วิชาอื่นซ่อน (เพราะมีแต่ MCQ อยู่แล้ว ไม่ต้องเลือก)' },
      { scope: 'system', kind: 'fix', icon: '✂️', title: 'ลบ Writing grade mode picker',
        desc: 'เดิม ConfigView มี chip "ตรวจข้อเขียน · ถามตอนตรวจ / ประเมินเอง / AI" — เอาออกแล้ว · default = self-assess view เลย' },
    ],
  },
  {
    version: '5.1.8',
    date: '2026-04-27',
    headline: '🏷️ ประกาศบอกว่าแก้วิชาไหน vs แก้ระบบ — รู้ทันที',
    changes: [
      { scope: 'system', kind: 'feature', icon: '🏷️', title: 'Scope chip ในประกาศอัปเดต',
        desc: 'แต่ละรายการมี chip บอกชัดว่า ⚙️ ระบบ · 🗣️ Eng Vet Prof II · 🚨 COM III · 🩺 COM IV · 🐕 COM V · 🔐 Auth · ⚡ หลายส่วน — scan ได้ใน 2 วิ' },
      { scope: 'system', kind: 'feature', icon: '🎨', title: 'Color-coded ตามสีวิชา',
        desc: 'COM III แดง · COM IV ม่วง · COM V น้ำเงิน · Eng Vet Prof II เทา-น้ำเงิน — ตรงกับสี subject card หน้าเลือกวิชา' },
      { scope: 'system', kind: 'fix', icon: '📜', title: 'Retrofit ทุกประกาศย้อนหลัง',
        desc: 'ติด scope ให้ทุก entry ตั้งแต่ v5.1.0 ครบหมด · กดดูประวัติแล้วเห็นได้เลยว่าแก้อะไรไปบ้าง วิชาไหน' },
    ],
  },
  {
    version: '5.1.7',
    date: '2026-04-27',
    headline: '📄 Passage + Writing area แสดงข้างกัน · ไม่ต้องเลื่อนกลับไปกลับมาแล้ว',
    changes: [
      { scope: 'system', kind: 'feature', icon: '📄', title: 'Side-by-side passage + writing บนจอใหญ่',
        desc: 'iPad/Desktop ≥1024px: passage อยู่ซ้าย (sticky) · เขียนคำตอบขวา · เห็นทั้งคู่พร้อมกันโดยไม่ต้องเลื่อน · ใช้ได้ทุกวิชาที่มี passage' },
      { scope: 'system', kind: 'feature', icon: '📱', title: 'ปุ่มลอย "📄 Passage" บนมือถือ',
        desc: 'แตะปุ่มมุมขวาล่าง → passage เลื่อนกลับมาให้เห็น + ขยายอัตโนมัติถ้ายุบไว้ · ไม่ต้องเลื่อนนิ้วขึ้นลงเอง' },
      { scope: 'system', kind: 'fix', icon: '⚡', title: 'Auto-save debounce 500ms',
        desc: 'พิมพ์เร็วๆ ไม่กระตุก แล้ว — เซฟลง localStorage 2 ครั้ง/วินาที (เดิม save ทุก keystroke ทำมือถือเก่าหน่วง)' },
      { scope: 'system', kind: 'fix', icon: '🐛', title: 'Passage open state ไม่หลงข้อ',
        desc: 'ยุบ passage ใน Q1 → ไป Q2 → เดิม passage ยุบต่อเนื่อง · แก้แล้วเปิดใหม่ทุกข้อ' },
      { scope: 'system', kind: 'fix', icon: '✍️', title: 'Result message สำหรับ Writing-only',
        desc: 'เขียน-only session ไม่แสดง "0% FAILED" แล้ว · แสดง "Writing Session · Grade in Review" + message ที่เหมาะ' },
    ],
  },
  {
    version: '5.1.6',
    date: '2026-04-27',
    headline: '🎚 เลือก Self/AI ก่อนเริ่ม + auto-save กันลืม + bug fix',
    changes: [
      { scope: 'engprof', kind: 'feature', icon: '🎚', title: 'เลือกผู้ตรวจข้อเขียนก่อนเริ่ม',
        desc: 'ConfigView มี 3 chip เลือก: 🤔 ถามตอนตรวจ (default) · 📝 ประเมินเอง (skip picker) · 🤖 AI ตรวจอัตโนมัติ — เข้า Review ปุ๊บได้ผลทันที (เก็บ preference ใน localStorage)' },
      { scope: 'system', kind: 'feature', icon: '💾', title: 'Auto-save ตอนทำข้อสอบ',
        desc: 'ทำๆ อยู่ tab ปิดเอง / browser ค้าง / มือถือไฟดับ → กลับมาเปิดเว็บ → เห็น "🔄 พบข้อสอบที่ค้างอยู่ · ทำต่อไหม?" — ไม่หายเลย · ใช้ได้ทุกวิชา' },
      { scope: 'engprof', kind: 'feature', icon: '✍️', title: 'Quick strategy banner ก่อนเริ่มเขียน',
        desc: 'ConfigView โหมด Writing → เห็น checklist 7 ข้อ: อ่าน 2 รอบ · topic sentence · transitions · paraphrase 2 อย่าง · cite source · word count · ห้าม opinion' },
      { scope: 'system', kind: 'fix', icon: '🐛', title: 'Bug: ย้อนข้อแล้วเวลาหด',
        desc: 'กด ← / jump-to-question ที่ข้อ essay → เวลาเหลือเป็น 60s แทน 25min · แก้แล้วใช้ timeForQuestion ตามประเภท' },
      { scope: 'system', kind: 'fix', icon: '🔀', title: 'Bug: shuffle ทำลาย mock passage flow',
        desc: 'เลือก subject แล้วได้ Q4 ของ Mock 2 มาก่อน Q1 ของ Mock 1 → passage งง · แก้: ถ้ามี examOrigin ติด → sort by ID ภายในก่อน' },
    ],
  },
  {
    version: '5.1.5',
    date: '2026-04-27',
    headline: '🎯 แยก MCQ vs Writing + Smart timer + Past Exam 2021',
    changes: [
      { scope: 'system', kind: 'feature', icon: '📝', title: 'แยก MCQ และ Writing ชัดเจน',
        desc: 'หน้า Config มีเลือก 3 โหมด: ทุกประเภท / MCQ + T/F (auto-graded) / Writing เท่านั้น (short + essay)' },
      { scope: 'system', kind: 'feature', icon: '⏱', title: 'Smart timer ต่อประเภท',
        desc: 'ตั้งเวลา 60 วิ ครั้งเดียว — ระบบให้ MCQ 60 วิ · Short answer 3 นาที · Essay 25 นาที (ตามสัดส่วนสอบจริง 2 ชม. = 5 นาที/short + 25 นาที/essay)' },
      { scope: 'system', kind: 'fix', icon: '⚠️', title: 'Confirm ก่อนข้ามข้อเขียนที่ยังไม่ตอบ',
        desc: 'กด "ข้อถัดไป" ที่ short/essay ที่ยังไม่ได้เขียน → ถามยืนยัน "ข้ามจริงๆ?" ก่อน — กันพลาดเพราะกดเร็ว' },
      { scope: 'system', kind: 'fix', icon: '📊', title: 'Score % ไม่นับข้อเขียนผิด',
        desc: 'Auto-graded score แสดงเฉพาะ MCQ/T/F — Writing แสดงแยก "X/Y ข้อเขียนเสร็จ" + ตรวจใน Review (Self / 🤖 AI)' },
      { scope: 'engprof', kind: 'content', icon: '📜', title: 'Past Exam 2021 — Part III Paraphrase',
        desc: '+1 mock ของจริงปี 2021 (Pets prevent allergies passage) พร้อม sample response จากนักเรียน 2021 + key ideas ที่ marker จะเช็ก' },
    ],
  },
  {
    version: '5.1.4',
    date: '2026-04-27',
    headline: '🤖 Smart AI grading + 4 Mock Exams Eng Vet Prof II ครบ',
    changes: [
      { scope: 'system', kind: 'feature', icon: '🤖', title: 'Smart AI score assessment',
        desc: 'หลังเขียน summary/short answer → กดปุ่ม "🤖 Smart AI grade" → AI ตรวจตาม rubric · score breakdown ต่อเกณฑ์ + จุดเด่น + จุดที่ควรปรับ · หรือเลือก "📝 Self assess" ก็ได้' },
      { scope: 'engprof', kind: 'content', icon: '📚', title: '4 Mock Exams ครบ Part I + Part II',
        desc: 'Mock 1: MDORS/CORS · Mock 2: Bone density baboons · Mock 3: Newcastle Oman · Mock 4: ✏️ AMR/MRSP (เขียนใหม่ตาม Final spec) · ทุก mock เรียงคำถามตาม section flow' },
      { scope: 'engprof', kind: 'content', icon: '✏️', title: '20 short-answer + 11 T/F + 4 essay จาก Exercise 2 KEY',
        desc: 'คำตอบ + keywords ดึงตรงจาก Exercise 2 KEY ที่อาจารย์ให้ · ใช้ฝึกได้สมจริง' },
      { scope: 'engprof', kind: 'feature', icon: '📋', title: 'Reordered ID + question flow',
        desc: 'Within each mock: passage แสดงก่อนคำถาม · คำถามเรียงตาม section · เลขข้อ run ต่อเนื่อง make sense' },
    ],
  },
  {
    version: '5.1.3',
    date: '2026-04-27',
    headline: '✍️ Mock Exam Eng Vet Prof II พร้อมแล้ว — เขียน summary จริงๆ ได้เลย',
    changes: [
      { scope: 'system', kind: 'feature', icon: '✍️', title: 'รองรับการเขียน Summary จริง',
        desc: 'เพิ่ม 2 question types ใหม่: short answer (พิมพ์คำตอบสั้น) + essay (textarea + word counter + penalty zones สี: เขียว/ทอง/แดง)' },
      { scope: 'system', kind: 'feature', icon: '📄', title: 'Reading passage attached to questions',
        desc: 'แสดง passage ยาวด้านบน + คำถามด้านล่าง (collapsible) เหมือน Final Part I จริงๆ' },
      { scope: 'engprof', kind: 'content', icon: '🎯', title: 'Mock Final 86 — Part I + Part II',
        desc: 'Part I: บทความ MDORS/CORS (Pet-Human Relationships) + 8 short answers + 4 T/F · Part II: บทความ Bats + เขียน 150-word summary' },
      { scope: 'system', kind: 'content', icon: '📋', title: 'Model answer + rubric ใน Review',
        desc: 'ตอบเสร็จ → กดดูเฉลย → เห็น sample summary + marking criteria ครบ → ประเมินตัวเองได้' },
      { scope: 'engprof', kind: 'fix', icon: '🧹', title: 'ลด MCQ meta-concept แปลกๆ ออก',
        desc: 'เก็บ warm-up ที่จำเป็นไว้ 20 ข้อ · ตัดข้อที่ไม่ตรงกับรูปแบบสอบจริงออก → focus ที่ mock + writing' },
    ],
  },
  {
    version: '5.1.2',
    date: '2026-04-27',
    headline: '🆕 Eng Vet Prof II พร้อมแล้ว! สอบพรุ่งนี้บ่าย',
    changes: [
      { scope: 'engprof', kind: 'content', icon: '🗣️', title: 'Eng Vet Prof II — เปิดใช้งาน',
        desc: 'สอบ Final อังคาร 28 เม.ย. 13:00-15:00 · Units 4-5 · Reading Research Papers + Writing Summary' },
      { scope: 'engprof', kind: 'content', icon: '📖', title: 'Notes ครบ 5 หัวข้อ',
        desc: 'Research paper structure (IMRD) · Research designs (8 แบบ) · Academic writing · Paraphrasing (5 techniques) · Summary writing rules' },
      { scope: 'engprof', kind: 'content', icon: '✏️', title: '~36 ข้อสอบจำลอง',
        desc: 'MCQ + T/F ทุก topic · เลียนแบบ exam pattern (Part I reading, paraphrase acceptability, summary rules)' },
      { scope: 'engprof', kind: 'feature', icon: '🎯', title: 'Exam strategy + word count rules',
        desc: 'Note หน้าสุดท้ายมี strategy เขียน summary 150 words · นับคำให้ดี (>180 = -1, >200 = -2)' },
    ],
  },
  {
    version: '5.1.1',
    date: '2026-04-27',
    headline: 'แก้บั๊ก + อัพเดตหลังเปิดใช้งานจริง',
    changes: [
      { scope: 'com3', kind: 'fix', icon: '🧮', title: 'สัดส่วนคะแนน COM III ถูกแล้ว',
        desc: 'งาน 20% (เดิมแสดง 10% ผิด) · Mid 40 + Final 40 + งาน 20 = 100 — ขอบคุณคนที่ส่ง feedback มาแจ้ง 🙏' },
      { scope: 'system', kind: 'fix', icon: '⏱', title: 'Countdown สอบไม่ค้างอีกแล้ว',
        desc: 'สอบเสร็จปุ๊บ "สอบถัดไป" ขยับเป็นวิชาต่อไปทันที (เดิมรอข้ามเที่ยงคืน)' },
      { scope: 'auth', kind: 'fix', icon: '🔐', title: 'Login/Register หาย bug',
        desc: 'หลัง Login กลับหน้าแรกทันทีไม่ต้อง refresh · "ลืมรหัสผ่าน" ใช้งานได้ · username ซ้ำกันไม่ทำให้สมัครพัง' },
      { scope: 'system', kind: 'feature', icon: '📱', title: 'Add to Home Screen สวยขึ้น',
        desc: 'iPad/iPhone กด Share → "เพิ่มสู่หน้าจอโฮม" → ได้ไอคอน 🐾 + standalone (ไม่มี Safari bar) ดูเหมือนแอปจริง' },
    ],
  },
  {
    version: '5.1.0',
    date: '2026-04-26',
    headline: 'อัปเดตใหม่ก่อนสอบ Final',
    changes: [
      { scope: 'system', kind: 'feature', icon: '📚', title: 'รายการอ่าน',
        desc: 'ติ๊กหัวข้อที่อ่านเสร็จแล้ว เห็น progress · เปิดจากการ์ดใหม่หน้าแรก · ใช้ได้ทุกวิชา' },
      { scope: 'system', kind: 'feature', icon: '🟢', title: 'นับคนออนไลน์ realtime',
        desc: 'เห็น badge "N คนกำลังเรียนอยู่" บน hero — รู้ว่ามีเพื่อนเรียนพร้อมกันกี่คน' },
      { scope: 'com4', kind: 'content', icon: '📖', title: 'COM IV notes ครบแล้ว',
        desc: 'ทวนเนื้อหาครบทั้ง COM III + IV + V (รวม 13 หัวข้อ Immune-mediated + Derm + Peds-Geri)' },
      { scope: 'multi', kind: 'content', icon: '✏️', title: '+12 ข้อสอบ FINAL 86',
        desc: 'รวบรวมข้อสอบเก่า COM III/IV/V — Spondylosis, IMHA-cat, WSAVA 2024 ฯลฯ' },
      { scope: 'system', kind: 'fix', icon: '🩹', title: 'แก้ feedback บน iPad',
        desc: 'ส่งฟอร์มแล้วเมลมาถึงตรงๆ ไม่เด้งเปิดแอป Mail / ไม่บังคับกรอกอีเมล / รองรับ autofill' },
    ],
  },
];

// Convenience: latest entry for the announcement banner
export const LATEST_CHANGELOG = CHANGELOG[0];
