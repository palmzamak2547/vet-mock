// ============================================================
// legacy-copy.js — archive of pre-2026-05-10 user-facing copy
// ============================================================
//
// This file is NOT imported anywhere. It exists as a backdoor for
// future restoration if/when:
//   • Faculty endorses the project explicitly (we can re-expose
//     "ข้อสอบเก่า" framing)
//   • Vet Council / VCA opens an "official" sample paper channel
//   • Legal/IP context shifts (e.g., open licensing of past exams)
//
// To restore, copy the relevant string back into the original file.
// Each block is keyed by file:line so you can find it again later.
//
// Why we softened (2026-05-10):
//   The app shipped to public Vercel + IG @vetmock.cu before any
//   faculty review. Words like "ข้อสอบเก่า" / "เก็งข้อสอบ" /
//   year-tagged exam-origin badges (`VET84 ER Q5`) read fine for
//   the cohort but could feel uncomfortable for a lecturer who
//   stumbles into the public site. Softening pre-empts that
//   conversation without giving up any feature or data.
//
// Underlying DATA fields are UNTOUCHED:
//   • q.examOrigin still exists on questions for internal tracking
//   • verified.js still tags sources for our own QA
//   • Only the RENDER layer changed
// ============================================================

export const LEGACY_COPY_PRE_2026_05_10 = {
  // ── index.html ──────────────────────────────────────────────
  pageTitle: 'VetMock — คลังข้อสอบสัตวแพทย์ จุฬา · MCQ + ข้อสอบเก่า + คลิปย้อนหลัง',
  metaDescription:
    'VetMock = คลังข้อสอบสัตวแพทย์จุฬา · MCQ + ข้อสอบเก่า COM III / IV / V + Eng Vet Prof II · คลิปย้อนหลัง + summary · กำลังขยายให้ครบทุกชั้นปี (ปี 1-6) · ออกแบบโดยและเพื่อนิสิตในรุ่น',
  metaKeywords:
    'VetMock, คลังข้อสอบสัตวแพทย์, ข้อสอบสัตวแพทย์ จุฬา, ข้อสอบเก่า สัตวแพทย์, Vet 86, COM III, COM IV, COM V, vet question bank, Chulalongkorn veterinary',
  ogTitle: 'VetMock — คลังข้อสอบสัตวแพทย์ จุฬา · MCQ + ข้อสอบเก่า + คลิปย้อนหลัง',
  ogDescription: 'คลังข้อสอบ MCQ + ข้อสอบเก่า + คลิปย้อนหลัง + summary · นิสิตสัตวแพทย์จุฬา · กำลังขยายให้ครบทุกชั้นปี',
  ogImageAlt: 'VetMock logo — คลังข้อสอบสัตวแพทย์ จุฬา',
  twitterTitle: 'VetMock — คลังข้อสอบสัตวแพทย์ จุฬา',
  twitterDescription: 'คลังข้อสอบ MCQ + ข้อสอบเก่า + คลิปย้อนหลัง · นิสิตสัตวแพทย์จุฬา · ขยายครบทุกชั้นปี',
  jsonLdAlternateName: 'คลังข้อสอบสัตวแพทย์ จุฬา',
  jsonLdDescription:
    'คลังข้อสอบสัตวแพทย์จุฬา · MCQ + ข้อสอบเก่า COM III / IV / V + Eng Vet Prof II · คลิปย้อนหลัง + summary + spaced repetition · กำลังขยายให้ครบทุกชั้นปี (ปี 1-6)',

  // ── public/manifest.webmanifest ────────────────────────────
  manifestDescription: 'คลังข้อสอบ + ตารางสอบ + คลิปย้อนหลัง สำหรับสัตวแพทย์ จุฬา (Vet 86)',

  // ── AboutView.jsx ──────────────────────────────────────────
  aboutHeroSub: 'คลังข้อสอบและเครื่องมือเตรียมสอบสำหรับสัตวแพทย์ จุฬาฯ',
  aboutWhoBlurb:
    'เว็บนี้สร้างโดย Vet 86 (คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย) เพื่อช่วยให้รุ่นน้อง รุ่นพี่ และเพื่อนร่วมห้อง ได้ฝึกทำข้อสอบแบบจำลอง เนื้อหาทุกอย่างมาจากข้อสอบเก่าที่เพื่อนๆ รุ่นพี่ช่วยกันรวบรวม',
  aboutMissionBullet1:
    'เครื่องมือเตรียมสอบครบจบในเว็บเดียว — ไม่ใช่แค่ข้อสอบเก่า แต่รวมถึง notes, flashcard, video, scoring',
  aboutMissionBullet2: 'รวมคลังข้อสอบทุกชั้นปีในเว็บเดียว (ตอนนี้เริ่มที่ปี 4 ก่อน)',
  aboutSourcesIntro:
    'ข้อสอบในเว็บนี้ดึงมาจากข้อสอบเก่าของรุ่นพี่ Vet 83–85 ที่ช่วยกันรวบรวมและแชร์กันในห้อง',

  // ── Badges (Question.jsx + ReviewView.jsx) ─────────────────
  examOriginBadgeText: '📜 ข้อสอบเก่า',
  examOriginBadgeTooltip: 'คำถามนี้อ้างอิงจากข้อสอบเก่า',

  // ── TopicSelectView.jsx — past-paper coverage indicator ────
  // Format: "📜 ข้อสอบเก่า 12/45, 27%"
  // Now: "📚 อิงแนวเดิม 12/45, 27%"
  topicCardPpLabelPrefix: '📜 ข้อสอบเก่า',

  // ── ResultsView.jsx — encouragement messages ───────────────
  resultsLowMsg40: 'สู้ๆ, กลับไปเปิดข้อสอบเก่า',
  resultsLowQuote40: '"สู้ๆ นะ เปิดข้อสอบเก่าอ่านอีกรอบกันเถอะ"',

  // ── HomeView.jsx — subject grid scaffold tooltip ───────────
  // Pre-existing copy that was already softer; logged here for
  // completeness. No change needed but keep for reference.
};

// Underlying-data archive — examOrigin tags currently look like
// "VET84 ER Q5" / "COM III Final 86". The data still ships with these
// so internal tooling + lint scripts keep working, but the UI badge
// no longer surfaces the year/source. If we ever want to re-expose,
// just change the render string in Question.jsx + ReviewView.jsx.
export const LEGACY_NOTES = {
  examOriginPattern: 'YEAR + PAPER + Q-INDEX, e.g. "VET84 ER Q5", "COM III Final 86"',
  rationaleForKeepingDataIntact:
    'examOrigin powers TopicSelectView.jsx coverage % + helps internal QA flag dupes against past papers. Hiding it from UI does not require deleting it from data.',
};
