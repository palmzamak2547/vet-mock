// ============================================================
// ข้อสอบเก่า Equine Repro Mid 86 — ชุดรวบรวมจากรุ่นพี่ Vet 85
// ============================================================
// 3 questions recalled from the midterm paper by the Vet 85 cohort and
// passed down. Ingested 2026-09-14.
//
// The source PDFs embed Thai display fonts that hand back their tone marks as
// Private Use Area codepoints (and, in Equine Repro, as plain ASCII), so a raw
// text extraction reads as though every tone mark had been deleted. These come
// from the repaired extraction; AGENTS.md records the method, and the eight
// Aqua pages that were not recoverable.
// ============================================================

export const QUESTIONS_MID86_EQUINE_REPRO = [
  {
    "id": 202091,
    "subject": "equine-repro",
    "topic": "eqrepro-stallion-infect",
    "year": 5,
    "source": "Equine Repro Mid 86 (รวบรวมโดยรุ่นพี่ Vet 85)",
    "sourceType": "past-paper",
    "tags": [
      "EHV-1",
      "อาการทางระบบประสาท",
      "past-paper"
    ],
    "type": "mcq",
    "q": "นอกจากทำให้แม่ม้าท้องแก่แท้งลูกแล้ว การติดเชื้อ equine herpesvirus type 1 ยังก่ออาการทางคลินิกข้อใดได้อีก",
    "options": [
      "ขาหลังอ่อนแรงจาก encephalomyelitis",
      "ตุ่มใสที่อวัยวะสืบพันธุ์ภายนอกแบบ coital exanthema",
      "ฝีหนองที่ต่อมน้ำเหลืองใต้คางแบบ strangles",
      "เยื่อบุมดลูกอักเสบหลังผสมแบบ post-breeding endometritis"
    ],
    "answer": 0,
    "explain": "EHV-1 ก่อโรคได้ 3 รูปแบบ คือ ทางเดินหายใจอักเสบในม้าเล็ก แท้งในแม่ม้าท้องแก่ และ encephalomyelitis หรือ equine herpesvirus myeloencephalopathy ที่ทำให้ม้าเดินเซ อ่อนแรงขาหลัง จนถึงล้มนอนและปัสสาวะราด\n\n❌ ทำไมข้ออื่นผิด\n— ตุ่มใสที่อวัยวะสืบพันธุ์ภายนอกเป็นรอยโรคของ EHV-3 (equine coital exanthema) คนละชนิดกับ EHV-1\n— ฝีหนองที่ต่อมน้ำเหลืองใต้คางเป็นลักษณะของ strangles จากเชื้อ Streptococcus equi subsp. equi\n— เยื่อบุมดลูกอักเสบหลังผสมพันธุ์เกิดจากปฏิกิริยาต่อน้ำเชื้อและเชื้อแบคทีเรียในโพรงมดลูก ไม่ใช่ผลจากไวรัสตัวนี้\n\n💡 EHV-1 จำสามคำ แท้ง หายใจ ประสาท ส่วนตุ่มใสที่อวัยวะเพศเป็นงานของ EHV-3",
    "verified": "Equine Repro Mid 86 p.3"
  },
  {
    "id": 202092,
    "subject": "equine-repro",
    "topic": "eqrepro-art-female",
    "year": 5,
    "source": "Equine Repro Mid 86 (รวบรวมโดยรุ่นพี่ Vet 85)",
    "sourceType": "past-paper",
    "tags": [
      "embryo transfer",
      "uterine body",
      "past-paper"
    ],
    "type": "mcq",
    "q": "ตรวจแม่ม้าตัวรับ (recipient) ด้วยอัลตราซาวนด์พบคอร์ปัสลูเตียมที่รังไข่ข้างซ้าย เมื่อจะย้ายฝากตัวอ่อนระยะ blastocyst ควรปล่อยตัวอ่อนไว้ที่ตำแหน่งใด",
    "options": [
      "ปลายปีกมดลูกข้างซ้ายชิดท่อนำไข่",
      "ตัวมดลูก ถัดจากคอมดลูกเข้าไป",
      "ปลายปีกมดลูกข้างขวาชิดท่อนำไข่",
      "ท่อนำไข่ข้างที่มีคอร์ปัสลูเตียม"
    ],
    "answer": 1,
    "explain": "ตัวอ่อนม้าเคลื่อนที่ไปมาทั่วโพรงมดลูกได้เองจนถึงวันที่ 16 ซึ่งเป็นกลไกของ maternal recognition of pregnancy การย้ายฝากจึงสอดปิเปตผ่านคอมดลูกแล้วปล่อยตัวอ่อนไว้ที่ตัวมดลูก ตัวอ่อนจะเคลื่อนไปฝังตัวเองที่ฐานปีกมดลูกต่อไป\n\n❌ ทำไมข้ออื่นผิด\n— ปลายปีกมดลูกข้างซ้าย ไม่จำเป็นต้องเลือกข้างเดียวกับคอร์ปัสลูเตียม เพราะตัวอ่อนม้าเดินทางเองได้ทั้งสองข้าง\n— ปลายปีกมดลูกข้างขวา การดันปิเปตลึกถึงปลายปีกเสี่ยงทำให้เยื่อบุมดลูกบาดเจ็บโดยไม่จำเป็น\n— ท่อนำไข่ ตัวอ่อนระยะ blastocyst ผ่านพ้นท่อนำไข่ลงมาแล้ว การใส่กลับขึ้นไปไม่ทำให้ตั้งท้อง\n\n💡 ม้าไม่เหมือนโค ตัวอ่อนเดินเองได้ทั่วมดลูก วางไว้กลางตัวมดลูกก็พอ",
    "verified": "Equine Repro Mid 86 p.3"
  },
  {
    "id": 202093,
    "subject": "equine-repro",
    "topic": "eqrepro-anatomy-cycle",
    "year": 5,
    "source": "Equine Repro Mid 86 (รวบรวมโดยรุ่นพี่ Vet 85)",
    "sourceType": "past-paper",
    "tags": [
      "ท่อนำไข่",
      "การปฏิสนธิ",
      "past-paper"
    ],
    "type": "mcq",
    "q": "การปฏิสนธิของม้าเกิดขึ้นที่ส่วนใดของท่อนำไข่",
    "options": [
      "ส่วน infundibulum ริมรังไข่",
      "ส่วน isthmus ที่ต่อกับมดลูก",
      "ส่วน ampulla ของท่อนำไข่",
      "รอยต่อท่อนำไข่กับมดลูก (UTJ)"
    ],
    "answer": 2,
    "explain": "หลังตกไข่ที่ ovulation fossa ไข่จะถูก infundibulum โอบรับเข้าสู่ท่อนำไข่ แล้วมาพบอสุจิที่ ampulla ซึ่งเป็นส่วนป่องกว้างของท่อ การปฏิสนธิจึงเกิดขึ้นที่นี่ ก่อนที่ตัวอ่อนจะเคลื่อนผ่าน isthmus ลงสู่มดลูกต่อไป\n\n❌ ทำไมข้ออื่นผิด\n— infundibulum ทำหน้าที่รับไข่ที่ตกลงมาเท่านั้น ไม่ใช่จุดที่อสุจิเข้าผสมกับไข่\n— isthmus เป็นส่วนคอดที่ตัวอ่อนเคลื่อนผ่านลงมาภายหลังการปฏิสนธิไปแล้ว\n— รอยต่อท่อนำไข่กับมดลูกเป็นประตูคัดกรอง ยอมให้เฉพาะตัวอ่อนที่สร้าง prostaglandin E ผ่านเข้ามดลูก\n\n💡 ปฏิสนธิที่ส่วนป่อง (ampulla) แล้วค่อยลอดส่วนคอด (isthmus) เข้ามดลูก",
    "verified": "Equine Repro Mid 86 p.4"
  }
];
