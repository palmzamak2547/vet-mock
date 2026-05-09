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

  // ─── Repro Lecture (3108-409) ───
  // Note: playlist รวม Lect 1-24 (no Lab — Lab exam is hands-on only, no lecture recording)
  {
    subject: 'repro-lect',
    topic: 'Comp Ani Repro Lecture — บทเรียนทบทวน Lect 1-24',
    url: 'https://www.youtube.com/playlist?list=PLHN1MlbLvVsvcmtkPB_AJLPaAjoW0RHRn',
    author: 'Dai (@dai.1387)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dai', 'repro-lect'],
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
  // 📺 ช่อง DekDokVet85 (@DekDokVet85) — Vet 85 cohort recordings
  // https://www.youtube.com/@DekDokVet85
  // ═════════════════════════════════════════════════════════════════
  // Vet 85 = cohort หนึ่งปีก่อน Vet 86 → คลิปครอบคลุม:
  //   • Y4 sem 1 (10 วิชา · เป็น primary source เพราะ Dai ยังไม่มี)
  //   • Y4 sem 2 (เพิ่มเป็น 2nd source ถ้าอยากดูมุมอื่น)
  //   • Y5 specialty (Swine Med · Equine · Aquatic · Avian — scaffold subjects)
  //   • Cross-year (Zoonoses · One Health · Epidemiology — assigned to VPH)

  // ─── Y4 sem 1 (NEW coverage) ──────────────────────────────────
  {
    subject: 'com1',
    topic: 'COM I — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBfTDTTKWQDwZcNT-F_XinVf',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem1'],
  },
  {
    subject: 'com2',
    topic: 'COM II — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBd1axgDENyMd-Fy-325B0l5',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem1'],
  },
  {
    subject: 'surg1',
    topic: 'Vet Surg Lab I — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBeFDkoSjC212RWuEjYVXtDu',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem1'],
  },
  {
    subject: 'swine-herd',
    topic: 'Swine Herd Health — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBcQkHInO7fgACo44uXCZjIu',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem1'],
  },
  {
    subject: 'swine-repro',
    topic: 'Swine Reproduction — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBe6g74T9Uxq7lF2GZUq48-r',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem1'],
  },
  {
    subject: 'vet-imaging',
    topic: 'Veterinary Imaging — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBcnzcig898A2Ievv8-GeOsH',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem1'],
  },
  {
    subject: 'food-safety-y4',
    topic: 'Food Safety — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBeT1Yx49AmJDk3Bwkry1gI5',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem1'],
  },
  {
    subject: 'food-safety-y4',
    topic: 'Food Industry — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBcUnd3zKPlyYy7HBVee626W',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem1', 'food-industry'],
  },
  {
    subject: 'food-safety-y4',
    topic: 'Milk Hygiene & Meat — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBc0BpJpXvXo4IBjvhEuAjYK',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem1', 'milk-meat'],
  },
  {
    subject: 'vet-juris',
    topic: 'Vet Jurisprudent + Ethics + Welfare — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBcx3prumnorDVc94g7q5-fa',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem1'],
  },
  {
    subject: 'herd-health-rum',
    topic: 'Herd Health Ruminant — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBdiQhygkaXm8fRqUJT-n_ZE',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem1'],
  },

  // ─── Y4 sem 2 (alternate source — Dai already covers above) ────
  {
    subject: 'com3',
    topic: 'Dog-Cat III — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBfDQez3_YFYyJzsWkV6VU1-',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem2'],
  },
  {
    subject: 'com4',
    topic: 'Dog-Cat IV — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBf5uCV_FP-2HgX7Ljs9MoXT',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem2'],
  },
  {
    subject: 'com5',
    topic: 'Dog-Cat V — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBcVMP0Bw8m_QpZrjrSCckYj',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem2'],
  },
  {
    subject: 'cliapprum',
    topic: 'Clinical App Ruminant — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBcrnk0d5Kqjh64tc_RSA9o3',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem2'],
  },
  {
    subject: 'practrum',
    topic: 'Practice Ruminant (นครปฐม) — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBfSQrJmr-ethysVBGYEu-Be',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem2'],
  },
  {
    subject: 'poultry',
    topic: 'Poultry Health — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBc33bWepdkvFSwzZyTai4vh',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem2'],
  },
  {
    subject: 'exotic',
    topic: 'Wildlife & Exotic Health — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBf4w_9LK1jzr67KYhEzqBCo',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem2'],
  },
  {
    subject: 'repro-lect',
    topic: 'Comp Animal Reproduction — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBem-MnGLhPMT0YkMuMxX31f',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem2'],
  },
  {
    subject: 'surg2',
    topic: 'Surgery Lab II — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBfL32N-WjFI4KvuxqWgZXiz',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem2'],
  },
  {
    subject: 'surg3',
    topic: 'Surgery Lab III — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBeCCi298S935iBRLBRr4lZU',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y4-sem2'],
  },

  // ─── Y5 specialty (scaffold subjects — first reference content!) ────
  {
    subject: 'swine-clinic',
    topic: 'Swine Medicine — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBeWBKqZjmS0OmO6EFDY3e9G',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y5'],
  },
  {
    subject: 'equine-medicine',
    topic: 'Equine Medicine + Surgery — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBcd3WeOwoxizv3J4vUWRX4S',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y5'],
  },
  {
    subject: 'equine-medicine',
    topic: 'Equine Reproduction — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBeHUcODQtkM-uW_YC1gqcRE',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y5', 'equine-repro'],
  },
  {
    subject: 'aquatic-clinic',
    topic: 'Aquatic Medicine — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBd-Qcm-qEnIdVJ5FaWXxrmb',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y5'],
  },
  {
    subject: 'avian-medicine',
    topic: 'Avian Medicine — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBd1x0bNc7g0_CG7FkE2-qn5',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y5'],
  },

  // ─── Y3 cross-references (Vet 85 took these in Y3 academic 2023/24)
  {
    subject: 'vet-public-health',
    topic: 'Zoonoses — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBeh0qDN1ZbCQxt57GaPCIi7',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y3', 'zoonoses'],
  },
  {
    subject: 'vet-public-health',
    topic: 'One Health — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBfUcwrORL1oPvUaNsPbTL0x',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y3', 'one-health'],
  },
  {
    subject: 'principles-vph',
    topic: 'Veterinary Epidemiology — DekDokVet85',
    url: 'https://www.youtube.com/playlist?list=PLaZuHrnxtHBeOEuZVTsd0i_layAF0663z',
    author: 'DekDokVet85 (Vet 85)',
    duration: 'Playlist',
    tags: ['lecture', 'review', 'dekdok', 'y3', 'epidemiology'],
  },

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

// Build thumbnail URL with quality preference
//   Quality: 'max' | 'sd' | 'hq' | 'mq' | 'default'
//   maxresdefault may 404 for older videos → caller should onError fallback
export function getThumbnail(url, quality = 'hq') {
  const videoId = getVideoId(url);
  if (!videoId) return null;
  const map = {
    max: 'maxresdefault',
    sd: 'sddefault',
    hq: 'hqdefault',
    mq: 'mqdefault',
    default: 'default',
  };
  return `https://img.youtube.com/vi/${videoId}/${map[quality] || 'hqdefault'}.jpg`;
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
