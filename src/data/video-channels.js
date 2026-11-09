// ============================================================
// VIDEO_CHANNELS — the YouTube channels whose own uploads VetMock keeps,
// video by video (our own copy, captions, summaries), and the permission on
// file for each.
// ============================================================
// The pipeline (docs/VIDEO-LIBRARY.md) takes a video only when its uploader
// is listed here, so a video that merely sits in a listed channel's playlist
// is not taken on that playlist's strength: one in Dai's "Com ani sci II by
// student" playlist is a US clinic's public video, outside what the cohort
// agreed, and stays out. tests/unit/video-registry.test.mjs checks that every
// registry record belongs to a channel listed here.
//
// Channel ids only for the classmates: their display names are their own.
// ============================================================

// Palm, 1 Nov 2026 (verbatim, in the order he said it).
const APPROVED = {
  date: '2026-11-01',
  by: 'เจ้าของช่องอนุมัติ แจ้งโดย Palm',
  scope: 'เก็บทุกวิดีโอของช่องเข้าคลัง VetMock และนำมาทำต่อยอด: สำเนาของเราเอง ถอดความ สรุป และ player ของเราเอง',
  evidence: [
    'เป็นไปได้ไหม ที่เราจะเก็ยทุกวิดีโอจากช่องITของเพื่อนผม ซึ่งได้รับอนุมัติแล้ว ใส่คลังVetmock',
    'ก็sessionที่กำลังโหลดมาเก็บเข้าคลังไว้ไงครับ ผมหมายถึงให้เอามาทำต่อยอด',
  ],
};

// Classmates' clips of the cohort's practical classes, in Dai's playlists
// "Surgery lab by student", "Com ani sci II by student" and "Com Ani Clin Sci
// III VET86", uploaded Nov 2025 to Apr 2026. Decided channel by channel on
// 2 Nov 2026 from public metadata only (personal channels, the playlist, the
// upload dates, the class titles); each decision and its evidence is in the
// lane ledger, where Palm can overturn it.
const COHORT = {
  date: '2026-11-02',
  by: 'รุ่น Vet 86 ตกลงร่วมกัน แจ้งโดย Palm 1 พ.ย. ตัดสินรายช่อง 2 พ.ย.',
  scope: 'คลิปคาบปฏิบัติที่เพื่อนในรุ่นอัดและแชร์ใน playlist ของรุ่น: สำเนาของเราเอง ถอดความ สรุป และ player ของเราเอง',
  evidence: [
    'อันนี้เป็นสิ่งที่ผมกับเพื่อนในรุ่นร่วมกันทำทั้งหมด อย่าเอาเป็นข้อจำกัด บอกไปแล้ว เราตกลงกันทั้งรุ่น',
  ],
};
const CLASSMATE = { name: 'เพื่อนร่วมรุ่น', permission: COHORT };

export const VIDEO_CHANNELS = {
  // Dai's channel: the cohort's lecture recordings.
  UCCyb7FcNA6xQa0jOwQtNRSQ: { handle: '@dai.1387', name: 'WW', url: 'https://www.youtube.com/@dai.1387', permission: APPROVED },
  // Classmates whose practical-class clips sit in Dai's "by student" playlists.
  'UC5uqU_F6afowi7dygdQMlpQ': CLASSMATE,
  'UCzhT1cBKIFhnV2SYB7pDiQA': CLASSMATE,
  'UCq7axrhe-eTXE7VdZ-kQtlQ': CLASSMATE,
  'UCuQOLe7R15-Rz6V_bH5ARfQ': CLASSMATE,
  'UCotVBvpa-BI95S-tlwiFvnw': CLASSMATE,
  'UCXgYLoedQlmd7BFDpdJNnAw': CLASSMATE,
  'UCDLtMf0Zckut2WxugSEfUfA': CLASSMATE,
  'UCDRtIOsWEL-bCULSTeKrbHQ': CLASSMATE,
};
