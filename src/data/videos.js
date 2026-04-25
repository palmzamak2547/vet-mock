// ============================================================
// Video Library — คลิปย้อนหลัง/คลิปอ้างอิงต่อวิชา
// ============================================================
// 📺 ช่อง Dai (@dai.1387) — playlists ปี 4 เทอม 2 ของ Chula Vet
//    https://www.youtube.com/@dai.1387
//
// วิธีเพิ่มคลิปใหม่:
// 1. ไปหาคลิปบน YouTube
// 2. copy URL หรือ playlist link
// 3. เพิ่ม entry ในรายการด้านล่าง
//
// **หรือ** เพิ่มผ่าน UI: หน้า "🎥 คลิปย้อนหลัง" → กดปุ่ม "➕ เพิ่มคลิป"
// (เก็บใน localStorage)
// ============================================================

export const VIDEO_LIBRARY = [

  // ═════════════════════════════════════════════════════════════════
  // 📺 ช่อง Dai (@dai.1387) — Chula Vet ปี 4 เทอม 2
  // ═════════════════════════════════════════════════════════════════
  // ─── Vet Surg Lab II + III ───
  {
    subject: 'surg2',
    topic: 'Vet Surg Lab II + III — บทเรียนทบทวน',
    url: 'https://www.youtube.com/playlist?list=PLHN1MlbLvVsvYvXSI59yf4c3rPXC1wJbg',
    author: 'Dai (@dai.1387)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dai', 'surg2', 'surg3'],
  },
  {
    subject: 'surg3',
    topic: 'Vet Surg Lab II + III — บทเรียนทบทวน',
    url: 'https://www.youtube.com/playlist?list=PLHN1MlbLvVsvYvXSI59yf4c3rPXC1wJbg',
    author: 'Dai (@dai.1387)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dai', 'surg2', 'surg3'],
  },

  // ─── COM III ───
  {
    subject: 'com3',
    topic: 'COM III — บทเรียนทบทวน',
    url: 'https://www.youtube.com/playlist?list=PLHN1MlbLvVstCBlmAk5JQ6UcoS1tkByy_',
    author: 'Dai (@dai.1387)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dai'],
  },

  // ─── COM IV ───
  {
    subject: 'com4',
    topic: 'COM IV — บทเรียนทบทวน',
    url: 'https://www.youtube.com/playlist?list=PLHN1MlbLvVsv01nkdkrVx2pxr9Yc9s5aE',
    author: 'Dai (@dai.1387)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dai'],
  },

  // ─── COM V ───
  {
    subject: 'com5',
    topic: 'COM V — บทเรียนทบทวน',
    url: 'https://www.youtube.com/playlist?list=PLHN1MlbLvVstWc9goqNOdBZsMAWTANNt3',
    author: 'Dai (@dai.1387)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dai'],
  },

  // ─── Repro ───
  {
    subject: 'repro',
    topic: 'Repro — บทเรียนทบทวน',
    url: 'https://www.youtube.com/playlist?list=PLHN1MlbLvVsvcmtkPB_AJLPaAjoW0RHRn',
    author: 'Dai (@dai.1387)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dai'],
  },

  // ─── Wildlife & Exotic ───
  {
    subject: 'exotic',
    topic: 'Wildlife & Exotic — บทเรียนทบทวน',
    url: 'https://www.youtube.com/playlist?list=PLHN1MlbLvVstFaBaFWvyRVULwkhEm8iHB',
    author: 'Dai (@dai.1387)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dai'],
  },

  // ─── Practice Ruminant ───
  {
    subject: 'practrum',
    topic: 'Practice Ruminant — บทเรียนทบทวน',
    url: 'https://www.youtube.com/playlist?list=PLHN1MlbLvVsvSKVEuR5h-yqrPVU0mcI93',
    author: 'Dai (@dai.1387)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dai'],
  },

  // ─── Clinical App Ruminant ───
  {
    subject: 'cliapprum',
    topic: 'Clinical App Ruminant — บทเรียนทบทวน',
    url: 'https://www.youtube.com/playlist?list=PLHN1MlbLvVss4sHrFdfFSjzsRcaRpE2yS',
    author: 'Dai (@dai.1387)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dai'],
  },

  // ─── Poultry Health ───
  {
    subject: 'poultry',
    topic: 'Poultry Health — บทเรียนทบทวน',
    url: 'https://www.youtube.com/playlist?list=PLHN1MlbLvVsvU0He4LxV-HEtFIZVyplw3',
    author: 'Dai (@dai.1387)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dai'],
  },

  // ─── Eng Vet Prof — ยังไม่มีคลิปย้อนหลัง ───
  // (ผู้ใช้สามารถเพิ่มเองผ่าน UI ในเว็บได้)

  // ═════════════════════════════════════════════════════════════════
  // 🎬 คลิปจากช่องอื่นๆ (สามารถเพิ่มได้)
  // ═════════════════════════════════════════════════════════════════
  {
    subject: 'surg2',
    topic: 'Mastectomy in Dog',
    url: 'https://www.youtube.com/watch?v=rGFTSX3YxjY',
    author: 'Veterinary Surgery',
    duration: '12:34',
    tags: ['mastectomy', 'mammary'],
  },
];

// ============================================================
// HELPERS — URL parsing utilities
// ============================================================

// Extract video ID from any YouTube URL format
export function getVideoId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// Extract playlist ID
export function getPlaylistId(url) {
  if (!url) return null;
  const m = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

// Build thumbnail URL (works for video or playlist)
export function getThumbnail(url) {
  const videoId = getVideoId(url);
  if (videoId) return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  // For playlists, no built-in thumbnail — return null
  return null;
}

// Filter videos by subject
export function getVideosBySubject(subjectId) {
  if (!subjectId || subjectId === 'all') return VIDEO_LIBRARY;
  return VIDEO_LIBRARY.filter((v) => v.subject === subjectId);
}

// Detect if URL is a playlist (no specific video ID)
export function isPlaylistUrl(url) {
  return !!getPlaylistId(url) && !getVideoId(url);
}

// Detect if URL is a channel
export function isChannelUrl(url) {
  if (!url) return false;
  return /youtube\.com\/(@|c\/|channel\/|user\/)/.test(url);
}
