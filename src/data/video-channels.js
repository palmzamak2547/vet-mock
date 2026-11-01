// ============================================================
// VIDEO_CHANNELS — the YouTube channels whose own uploads VetMock
// catalogues video by video, and the permission on file for each.
// ============================================================
// scripts/map-channel-videos.mjs drafts src/data/video-registry.js only for
// videos uploaded by a channel listed here, so a video another account
// uploaded never enters the registry on the strength of sitting in a listed
// channel's playlist (41 such videos on 2026-11-01). Add a channel here only
// with its permission recorded; tests/unit/video-registry.test.mjs checks
// that every registry record belongs to a channel with one.
// ============================================================

export const VIDEO_CHANNELS = {
  UCCyb7FcNA6xQa0jOwQtNRSQ: {
    handle: '@dai.1387',
    // The channel's display name on YouTube; the cohort knows it as Dai's.
    name: 'WW',
    url: 'https://www.youtube.com/@dai.1387',
    permission: {
      date: '2026-11-01',
      by: 'เจ้าของช่อง แจ้งผ่าน Palm',
      // As Palm put it; the written confirmation should name embedding,
      // transcripts and summaries, the uses the library makes of a clip.
      scope: 'เก็บทุกวิดีโอของช่องเข้าคลัง VetMock',
      evidence: 'Palm ในแชตงาน 1 พ.ย. 2569: "เป็นไปได้ไหม ที่เราจะเก็ยทุกวิดีโอจากช่องITของเพื่อนผม ซึ่งได้รับอนุมัติแล้ว ใส่คลังVetmock"',
      // The owner's own written words (a message, an email) once Palm has them.
      written: null,
    },
  },
};
