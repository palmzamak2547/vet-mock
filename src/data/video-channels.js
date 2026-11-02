// ============================================================
// VIDEO_CHANNELS — the YouTube channels whose own uploads VetMock keeps,
// video by video (our own copy, captions, summaries), and the permission on
// file for each.
// ============================================================
// The pipeline (docs/VIDEO-LIBRARY.md) takes a video only when its uploader
// is listed here, so a video that merely sits in a listed channel's playlist
// is not taken on that playlist's strength. Eight other channels have 40
// clips in Dai's playlists; none is listed until its owner approves, and the
// record of them (link, title, channel) stays outside this repository.
// tests/unit/video-registry.test.mjs checks that every registry record
// belongs to a channel listed here.
// ============================================================

// Palm, 1 Nov 2026 (verbatim, in the order he said it).
const APPROVED = {
  date: '2026-11-01',
  by: 'เจ้าของช่องอนุมัติ แจ้งโดย Palm',
  scope: 'เก็บทุกวิดีโอของช่องเข้าคลัง VetMock และนำมาทำต่อยอด: สำเนาของเราเอง ถอดความ สรุป และ player ของเราเอง',
  evidence: [
    'เป็นไปได้ไหม ที่เราจะเก็ยทุกวิดีโอจากช่องITของเพื่อนผม ซึ่งได้รับอนุมัติแล้ว ใส่คลังVetmock',
    'ก็sessionที่กำลังโหลดมาเก็บเข้าคลังไว้ไงครับ ผมหมายถึงให้เอามาทำต่อยอด',
    'อันนี้เป็นสิ่งที่ผมกับเพื่อนในรุ่นร่วมกันทำทั้งหมด อย่าเอาเป็นข้อจำกัด บอกไปแล้ว เราตกลงกันทั้งรุ่น',
  ],
};

export const VIDEO_CHANNELS = {
  // Dai's channel: the cohort's lecture recordings.
  UCCyb7FcNA6xQa0jOwQtNRSQ: { handle: '@dai.1387', name: 'WW', url: 'https://www.youtube.com/@dai.1387', permission: APPROVED },
};
