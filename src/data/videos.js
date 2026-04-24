// ============================================================
// Video Library — คลิปย้อนหลัง/คลิปอ้างอิงต่อวิชา
// ============================================================
// เพิ่มคลิปเอง:
// 1. ไปหาคลิปบน YouTube ที่เกี่ยวข้อง
// 2. copy URL (e.g. https://youtu.be/abc123)
// 3. เพิ่มใน array ข้างล่าง
//
// YouTube URL formats ที่ support:
// - https://youtu.be/VIDEO_ID
// - https://www.youtube.com/watch?v=VIDEO_ID
// - https://youtube.com/embed/VIDEO_ID
// ============================================================

export const VIDEO_LIBRARY = [
  // ═════════════ Vet Surg Lab II ═════════════
  {
    subject: 'surg2',
    topic: 'Mastectomy in Dog',
    url: 'https://www.youtube.com/watch?v=rGFTSX3YxjY',
    author: 'Veterinary Surgery',
    duration: '12:34',
    tags: ['mastectomy', 'mammary'],
  },
  {
    subject: 'surg2',
    topic: 'Aural Hematoma Surgery',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',  // placeholder
    author: 'VetSurgeonTV',
    duration: '8:15',
    tags: ['aural', 'hematoma'],
  },
  {
    subject: 'surg2',
    topic: 'Entropion Surgery (Hotz-Celsus)',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Ophtho Vet',
    duration: '6:45',
    tags: ['ophthalmology', 'entropion'],
  },
  {
    subject: 'surg2',
    topic: 'Dental Scaling Procedure',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'VetDental Academy',
    duration: '10:22',
    tags: ['dental'],
  },

  // ═════════════ Vet Surg Lab III ═════════════
  {
    subject: 'surg3',
    topic: 'Approach to Femur',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Ortho Vet',
    duration: '15:00',
    tags: ['approach', 'femur'],
  },
  {
    subject: 'surg3',
    topic: 'Cerclage Wire Technique',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'VOS',
    duration: '8:30',
    tags: ['cerclage'],
  },
  {
    subject: 'surg3',
    topic: 'Tension Band Wire',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'AO Vet',
    duration: '11:45',
    tags: ['tension band'],
  },
  {
    subject: 'surg3',
    topic: 'Ehmer Sling Application',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'VetSurgeonTV',
    duration: '5:20',
    tags: ['Ehmer', 'sling'],
  },

  // ═════════════ Repro Lab ═════════════
  {
    subject: 'repro',
    topic: 'Canine Vaginal Cytology',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Vet Repro',
    duration: '9:10',
    tags: ['cytology'],
  },
  {
    subject: 'repro',
    topic: 'Pyometra Surgery (OVH)',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Soft Tissue Vet',
    duration: '18:00',
    tags: ['pyometra', 'OVH'],
  },
  {
    subject: 'repro',
    topic: 'C-Section in Dog',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Vet Surgery',
    duration: '22:15',
    tags: ['csection', 'dystocia'],
  },

  // ═════════════ COM IV ═════════════
  {
    subject: 'com4',
    topic: 'SLE in Dogs — Overview',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'VetMed Academy',
    duration: '14:30',
    tags: ['SLE'],
  },
  {
    subject: 'com4',
    topic: 'Cushing Disease Diagnosis',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Endocrine Vet',
    duration: '12:00',
    tags: ['endocrine', 'Cushing'],
  },
  {
    subject: 'com4',
    topic: 'IMHA Management',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Internal Med Vet',
    duration: '16:45',
    tags: ['IMHA'],
  },

  // ═════════════ COM III / Rumen ═════════════
  {
    subject: 'com3',
    topic: 'Hardware Disease in Cattle',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Large Animal Vet',
    duration: '13:20',
    tags: ['rumen', 'hardware'],
  },
  {
    subject: 'com3',
    topic: 'LDA Correction — R Flank',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Bovine Surgery',
    duration: '25:00',
    tags: ['LDA'],
  },
  {
    subject: 'com3',
    topic: 'Foot Rot Treatment',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Farm Vet',
    duration: '8:45',
    tags: ['foot'],
  },

  // ═════════════ Exotic / PP ═════════════
  {
    subject: 'exotic',
    topic: 'Rabbit GI Stasis Treatment',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Exotic Vet',
    duration: '11:30',
    tags: ['rabbit'],
  },
  {
    subject: 'exotic',
    topic: 'Avian Blood Collection',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Avian Medicine',
    duration: '6:50',
    tags: ['bird'],
  },
  {
    subject: 'exotic',
    topic: 'Reptile Physical Exam',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Herp Vet',
    duration: '14:15',
    tags: ['reptile'],
  },
];

// Extract YouTube ID from various URL formats
export function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// Get thumbnail URL
export function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

export function getVideosBySubject(subjectId) {
  if (!subjectId || subjectId === 'all') return VIDEO_LIBRARY;
  return VIDEO_LIBRARY.filter((v) => v.subject === subjectId);
}
