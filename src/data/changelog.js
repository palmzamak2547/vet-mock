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
